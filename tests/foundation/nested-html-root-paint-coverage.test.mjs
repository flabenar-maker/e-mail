import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadComponentEvidenceModel} from '../../scripts/lib/component-evidence-inputs.mjs';
import {auditFigmaComponentEvidence} from '../../scripts/lib/figma-component-evidence.mjs';
import * as nestedApi from '../../scripts/lib/nested-html-evidence.mjs';

// Static admitted packets only; this fixture is never a fresh MCP claim.
const SHA = '67feb7c15bb5b7fcea082f67222d9b8ced909978';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ids = ['banner-hero', 'banner-secondary', 'button-primary', 'button-secondary'];
const fixtureDir = join(root, 'tests/foundation/fixtures/final-banners-67feb7c');
const paths = new Set([
  '/fills/0/type', '/fills/0/visible', '/fills/0/opacity',
  ...['gradient_stops', 'stops'].flatMap(alias => [0, 1].flatMap(index => ['position', 'color', 'alpha'].map(key => `/fills/0/${alias}/${index}/${key}`))),
  ...[0, 1].flatMap(row => [0, 1, 2].map(column => `/fills/0/gradient_transform/${row}/${column}`)),
  '/variable_bindings/fills/0/id', '/variable_bindings/fills/1/id',
]);
const walk = (node, all = []) => { all.push(node); for (const child of node.children ?? []) walk(child, all); return all; };
async function fixture() {
  const model = await loadComponentEvidenceModel({repoRoot: root, canonicalSha: SHA});
  const packets = Object.fromEntries(await Promise.all(ids.map(async id => [id, JSON.parse(await readFile(join(fixtureDir, `${id}.json`), 'utf8'))])));
  const session = JSON.parse(await readFile(join(fixtureDir, 'session.json'), 'utf8'));
  for (const capture of session.captures) capture.packet = packets[capture.component_id];
  return {model, packets, session};
}
function record(f, id) { return f.model.records.find(value => value.id === id); }
function heroRoots(f) {
  return f.packets['banner-hero'].variants.flatMap(variant => walk(variant.source_node)
    .filter(node => ['1045:18176', '1045:18180'].includes(node.node_id))
    .map(node => ({variant_node_id: variant.variant_node_id, node})));
}
// Raw facts are deliberately immutable evidence. Assertions must observe the effective view.
function issuesFor(report, nodeId) { return report.effective_facts.issues.filter(issue => issue.code === 'FIGMA_FACT_UNCOVERED' && issue.node_id === nodeId); }
function rawIssuesFor(report, nodeId) { return report.facts.issues.filter(issue => issue.code === 'FIGMA_FACT_UNCOVERED' && issue.node_id === nodeId); }
function rootPaintCovered(report, nodeId) { return issuesFor(report, nodeId).filter(issue => paths.has(issue.source_path)); }
function addOwnInertContexts(f) {
  const hero = record(f, 'banner-hero');
  const existing = new Set((hero.evidence_links.native_context_proofs ?? []).map(proof => proof.structure_proof_id));
  for (const relation of hero.evidence_links.native_relation_proofs.filter(proof => ['1045:18176', '1045:18180'].includes(proof.source?.node_id))) {
    if (!existing.has(relation.id)) {
      hero.evidence_links.native_context_proofs.push({id: `test-${relation.id}-inert-context`, kind: 'html-element-context', structure_proof_id: relation.id});
      existing.add(relation.id);
    }
  }
}
function report(f) { return auditFigmaComponentEvidence({record: record(f, 'banner-hero'), live: f.packets['banner-hero'], model: f.model, session: f.session}); }
function primarySourceContext(f) { return record(f, 'button-primary').evidence_links.native_context_proofs.find(proof => proof.id === 'native-desktop-root-context'); }

test('authentic Hero Primary roots receive only independently qualified nested paint and direct bindings', async () => {
  const f = await fixture();
  addOwnInertContexts(f);
  // A real, unknown parent layout leaf is not a child-derived paint fact and must remain uncovered.
  heroRoots(f)[0].node.layout.unknown_future_layout_field = true;
  const primary = auditFigmaComponentEvidence({record: record(f, 'button-primary'), live: f.packets['button-primary'], model: f.model, session: f.session});
  assert.equal(primary.ok, true, JSON.stringify(primary.issues));
  const result = report(f);
  assert.equal(result.nested_html.ok, true, JSON.stringify(result.nested_html.issues));
  for (const {node} of heroRoots(f)) assert.deepEqual(rootPaintCovered(result, node.node_id), [], `root paint/bindings must be private computed coverage: ${node.node_id}`);
  assert.ok(rawIssuesFor(result, '1045:18176').some(issue => paths.has(issue.source_path)), 'computed coverage must not mutate raw facts');
  assert.ok(issuesFor(result, '1045:18176').some(issue => issue.source_path === '/layout/unknown_future_layout_field'), 'parent layout remains parent-owned');
});

test('private root-paint bridge rejects forged nested reports and facts', async () => {
  const f = await fixture();
  addOwnInertContexts(f);
  const result = report(f);
  const apply = nestedApi.applyNestedHtmlRootPaintCoverage;
  assert.equal(typeof apply, 'function', 'root-paint coverage must be supplied by the named private bridge');
  const baseline = structuredClone(result.effective_facts);
  const forgedNested = structuredClone(result.nested_html);
  forgedNested.canonical_git_sha = 'forged';
  forgedNested.digest = 'forged';
  assert.deepEqual(apply({facts: result.facts, effective: structuredClone(baseline), nestedHtml: forgedNested}), baseline, 'a cloned/mutated nested report has no private admission identity');
  const wrongFacts = structuredClone(result.facts);
  wrongFacts.issues = [];
  assert.deepEqual(apply({facts: wrongFacts, effective: structuredClone(baseline), nestedHtml: result.nested_html}), baseline, 'a nested report cannot be rebound to different fact evidence');
});

for (const [label, mutate] of [
  ['actual gradient override', f => { heroRoots(f)[0].node.fills[0].gradient_stops[0].color = '#000000'; }],
  ['unknown actual paint field', f => { heroRoots(f)[0].node.fills[0].unknown_future_paint_field = true; }],
  ['removed canonical root context', f => { const p = primarySourceContext(f); record(f, 'button-primary').evidence_links.native_context_proofs = record(f, 'button-primary').evidence_links.native_context_proofs.filter(value => value !== p); }],
  ['wrong direct root binding alias', f => { heroRoots(f)[0].node.variable_bindings.fills[0].id = 'VariableID:forged'; }],
  ['missing consumer mode usage', f => { const id = heroRoots(f)[0].node.node_id; f.packets['banner-hero'].binding_evidence.usages = f.packets['banner-hero'].binding_evidence.usages.filter(value => !(value.node_id === id && value.binding_path === '/variable_bindings/fills/0')); }],
  ['missing source direct paint location', f => { f.packets['button-primary'].binding_evidence.paint_locations.items = f.packets['button-primary'].binding_evidence.paint_locations.items.filter(value => !(value.node_id === '337:4691' && value.source_path === '/fills/0/stops/0/color')); }],
  ['missing actual consumer direct paint location', f => { f.packets['banner-hero'].binding_evidence.paint_locations.items = f.packets['banner-hero'].binding_evidence.paint_locations.items.filter(value => !(value.node_id === '1045:18180' && value.source_path === '/fills/0/stops/0/color')); }],
  ['child source value mismatch', f => { f.session.captures.find(value => value.component_id === 'button-primary').packet.variants[0].source_node.fills[0].gradient_stops[0].color = '#000000'; }],
  ['deeper genuine child', f => { record(f, 'button-primary').contracts.mobile.root.children.push({id: 'test-deeper', render_mode: 'nested-component', component_id: 'button-secondary', facts: [], children: []}); }],
]) test(`nested root paint stays uncovered with ${label}`, async () => {
  const f = await fixture();
  addOwnInertContexts(f);
  mutate(f);
  const result = report(f);
  assert.ok(rootPaintCovered(result, heroRoots(f)[0].node.node_id).length > 0 || result.nested_html.ok === false, JSON.stringify(result.issues));
});
