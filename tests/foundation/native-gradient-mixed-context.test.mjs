import assert from 'node:assert/strict';
import test from 'node:test';
import {fixture as relationFixture} from './native-relationship-coverage.test.mjs';
import {auditFigmaContractFacts} from '../../scripts/lib/figma-contract-facts.mjs';
import {auditNativeRelationProofs} from '../../scripts/lib/native-relationship-coverage.mjs';
import {auditContractFactProofs, contractDecisionContextDigest, contractDecisionValueDigest} from '../../scripts/lib/contract-fact-proofs.mjs';
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadComponentEvidenceModel} from '../../scripts/lib/component-evidence-inputs.mjs';
import {auditFigmaComponentEvidence} from '../../scripts/lib/figma-component-evidence.mjs';

const context = await import('../../scripts/lib/native-context-coverage.mjs');
const clone = value => structuredClone(value);
const api = () => {
  for (const name of ['auditNativeContextProofs', 'applyNativeContextCoverage']) assert.equal(typeof context[name], 'function', `missing native context API: ${name}`);
  return context;
};
const selector = node_id => ({component_id: 'relationship-fixture', variant_node_id: '101:1', node_id});
const CONTACT_STATIC_SHA = '15a601fd656af83eabb468057f5a11a065f350ce';
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
async function actualContactFixture() {
  // Static unit fixture from the admitted 9c packet: the real node/runs/error
  // shape is retained, while only the test envelope binds it to this source SHA.
  const packet = JSON.parse(await readFile(join(repoRoot, 'tests/foundation/fixtures/paint-repair-contact-9c-static.json'), 'utf8'));
  const sessionNonce = 'a'.repeat(64), requestNonce = 'b'.repeat(64);
  packet.capture_meta.request = {canonical_git_sha: CONTACT_STATIC_SHA, session_nonce: sessionNonce, request_nonce: requestNonce};
  const session = {schema_version: '1.1.0', canonical_git_sha: CONTACT_STATIC_SHA, session_nonce: sessionNonce, started_at: '2026-10-10T10:23:00.000Z', completed_at: '2026-10-10T10:24:00.000Z', component_ids: ['block-contact-support'], captures: [{component_id: 'block-contact-support', receipt_id: 'static-contact-empty-fills', tool: 'use_figma', request_nonce: requestNonce, requested_at: '2026-10-10T10:23:01.000Z', received_at: '2026-10-10T10:23:59.000Z', packet}]};
  const model = await loadComponentEvidenceModel({repoRoot, canonicalSha: CONTACT_STATIC_SHA});
  return {model, session, packet, record: model.records.find(item => item.id === 'block-contact-support')};
}
function contactHelpContexts(report) { return report.native_context_proofs.results.filter(item => item.proof_id.endsWith('help-text-context')); }
function contactHelpNodes() { return ['459:27586', '459:27607']; }
function contactProofIdByNode(record, nodeId) {
  const structure = record.evidence_links.native_relation_proofs.find(proof => proof.kind === 'element-structure' && proof.source?.node_id === nodeId);
  const contexts = record.evidence_links.native_context_proofs.filter(proof => proof.kind === 'html-element-context' && proof.structure_proof_id === structure?.id);
  if (contexts.length !== 1) throw Error('exact Contact help context identity missing');
  return contexts[0].id;
}
function contactContextByNode(report, recordOrNode, maybeNode) {
  if (maybeNode === undefined) return contactHelpContexts(report).find(item => item.source_selectors?.[0]?.node_id === recordOrNode);
  return report.native_context_proofs.results.find(item => item.proof_id === contactProofIdByNode(recordOrNode, maybeNode));
}
function contactPointer(root, path) { return path.split('/').slice(1).reduce((value, key) => value?.[key], root); }
function contactNativeNode(packet, nodeId) {
  const walk = node => node?.node_id === nodeId ? node : (node?.children ?? []).map(walk).find(Boolean);
  return packet.variants.map(variant => walk(variant.source_node)).find(Boolean);
}
function contactSegmentsFact(record, variantNodeId, nodeId) {
  const link = record.contracts.figma_fact_links.find(item => item.variant_node_id === variantNodeId && item.node_id === nodeId && item.source_path === '/styled_text_segments/0/line_height/value');
  const match = link?.contract_path.match(/^(.*)\/facts\/(\d+)\/value\/items\/0\/line_height\/value$/u);
  if (!match) throw Error('actual Contact styled-run mapping missing');
  return {link, fact: contactPointer(record, match[1]).facts[Number(match[2])]};
}
function contactReport(f) { return auditFigmaComponentEvidence({record: f.record, live: f.packet, model: f.model, session: f.session}); }

function addFact(record, fact, source_path) {
  const root = record.contracts.mobile.root;
  root.facts.push(fact);
  record.contracts.figma_fact_links.push({variant_node_id: '101:1', node_id: fact.provenance.node_id, source_path, contract_path: `/contracts/mobile/root/facts/${root.facts.length - 1}/value/value`, transform: 'identity'});
  return root.facts.length - 1;
}

function addLayoutFacts(f, element, node, elementPath) {
  element.facts.push(
    {id: 'layout-orientation', value: {type: 'keyword', value: 'vertical'}, provenance: {kind: 'figma-literal', node_id: node.node_id}},
    {id: 'layout-wrap', value: {type: 'keyword', value: 'no_wrap'}, provenance: {kind: 'figma-literal', node_id: node.node_id}}
  );
  f.record.contracts.figma_fact_links.push(
    {variant_node_id: '101:1', node_id: node.node_id, source_path: '/layout/mode', contract_path: `${elementPath}/facts/${element.facts.length - 2}/value/value`, transform: 'lowercase'},
    {variant_node_id: '101:1', node_id: node.node_id, source_path: '/layout/wrap', contract_path: `${elementPath}/facts/${element.facts.length - 1}/value/value`, transform: 'lowercase'}
  );
}

function gradientFixture() {
  const f = relationFixture(), node = f.packet.variants[0].source_node, root = f.record.contracts.mobile.root;
  f.record.identity = {...f.record.identity, semantic_role: 'button'};
  root.semantic_role = 'button';
  Object.assign(node, {layout_positioning: 'AUTO', layout_grow: 0, minimum_width_px: null, opacity: 1, rotation: 0, strokes: [], variable_bindings: {}, effects: []});
  node.layout = {mode: 'VERTICAL', wrap: 'NO_WRAP', counter_axis_spacing: 0};
  addLayoutFacts(f, root, node, '/contracts/mobile/root');
  node.fills = [{type: 'gradient_linear', visible: true, opacity: 1,
    gradient_stops: [{position: 0, color: '#18B037', alpha: 1}, {position: 1, color: '#3DD55C', alpha: 1}],
    stops: [{position: 0, color: '#18B037', alpha: 1}, {position: 1, color: '#3DD55C', alpha: 1}],
    gradient_transform: [[1, 0, 0], [0, 1, 0]]}];
  addFact(f.record, {id: 'background-gradient-start', value: {type: 'color', value: '#18B037'}, provenance: {kind: 'figma-literal', node_id: node.node_id}}, '/fills/0/gradient_stops/0/color');
  addFact(f.record, {id: 'background-gradient-end', value: {type: 'color', value: '#3DD55C'}, provenance: {kind: 'figma-literal', node_id: node.node_id}}, '/fills/0/gradient_stops/1/color');
  root.facts.push({id: 'background-gradient-css-angle-degrees', value: {type: 'number', value: 25}, provenance: {kind: 'contract-proof', proof_id: 'angle'}});
  const anglePath = `/contracts/mobile/root/facts/${root.facts.length - 1}/value`;
  f.record.evidence_links.fact_proofs = [{id: 'angle', kind: 'approved-css-gradient-angle', contract_path: anglePath, source: selector(node.node_id), paint_index: 0, decision_id: 'decision-angle'}];
  const value_sha256 = contractDecisionValueDigest({record: f.record, contractPath: anglePath});
  const context_sha256 = contractDecisionContextDigest({selector: selector(node.node_id), paintIndex: 0, model: f.model, session: f.session});
  f.record.evidence_links.normative_decisions = [{id: 'decision-angle', kind: 'css-linear-gradient-angle', owner_id: f.record.id, targets: [{viewport: 'mobile', element_id: root.id, fact_id: 'background-gradient-css-angle-degrees', contract_path: anglePath, value_sha256, context_sha256, source: selector(node.node_id), paint_index: 0}], authorization: {user_instruction: 'Exact 25 degrees', scope: {owner_id: f.record.id, contract_paths: [anglePath]}, approved_spec: {path: 'docs/superpowers/specs/2026-10-03-cupis-contract-fact-proof-design.md', git_sha: 'a'.repeat(40)}}}];
  f.record.evidence_links.native_context_proofs = [{id: 'gradient-context', kind: 'html-element-context', structure_proof_id: 'root-structure'}];
  return {...f, node};
}

function mixedTextFixture() {
  const f = relationFixture(), node = f.packet.variants[0].source_node.children[0], element = f.record.contracts.mobile.root.children[0];
  element.render_mode = 'html-text';
  Object.assign(node, {characters: 'Help', fills: null, text_case: 'UPPER', layout_positioning: 'AUTO', layout_grow: 0, minimum_width_px: null, opacity: 1, rotation: 0, strokes: [], variable_bindings: {fills: {type: 'VARIABLE_ALIAS', id: 'VariableID:fill'}, textRangeFills: {type: 'VARIABLE_ALIAS', id: 'VariableID:text-range'}}, effects: [], text_style: {font_family: null, font_style: null, text_decoration: null}});
  node.layout = {mode: 'VERTICAL', wrap: 'NO_WRAP', counter_axis_spacing: 0};
  addLayoutFacts(f, element, node, '/contracts/mobile/root/children/0');
  const runs = [
    {start: 0, end: 2, characters: 'He', font_family: 'Roboto', font_style: 'Regular', font_size_px: 14, line_height: {unit: 'PERCENT', value: 140}, text_decoration: 'NONE', fills: [{type: 'solid', visible: true, opacity: 1, color: '#AA7100'}]},
    {start: 2, end: 4, characters: 'lp', font_family: 'Roboto', font_style: 'Regular', font_size_px: 14, line_height: {unit: 'PERCENT', value: 140}, text_decoration: 'UNDERLINE', fills: [{type: 'solid', visible: true, opacity: 1, color: '#AA7100'}]}
  ];
  node.styled_text_segments = clone(runs);
  element.facts.push({id: 'styled-text-segments', value: {type: 'segments', items: clone(runs)}, provenance: {kind: 'figma-literal', node_id: node.node_id}});
  const factIndex = element.facts.length - 1;
  const leaves = (value, path = []) => value && typeof value === 'object' && !Array.isArray(value) ? Object.entries(value).flatMap(([key, child]) => leaves(child, [...path, key])) : Array.isArray(value) ? value.flatMap((child, index) => leaves(child, [...path, index])) : [path];
  for (const [index, run] of runs.entries()) for (const leaf of leaves(run)) {
    const suffix = leaf.join('/');
    f.record.contracts.figma_fact_links.push({variant_node_id: '101:1', node_id: node.node_id, source_path: `/styled_text_segments/${index}/${suffix}`, contract_path: `/contracts/mobile/root/children/0/facts/${factIndex}/value/items/${index}/${suffix}`, transform: 'identity'});
  }
  f.packet.capture_errors.push({node_id: node.node_id, code: 'MIXED_VALUE', field: 'fills'});
  f.record.evidence_links.native_context_proofs = [{id: 'mixed-text-context', kind: 'html-element-context', structure_proof_id: 'title-structure'}];
  return {...f, node};
}

test('html context qualifies two mapped gradient endpoint colors without proving native transform', () => {
  const f = gradientFixture();
  assert.equal(auditNativeRelationProofs(f).ok, true, 'independent root structure');
  const raw = auditFigmaContractFacts({record: f.record, live: f.packet});
  const coverage = api().auditNativeContextProofs(f);
  assert.equal(coverage.ok, true);
  assert.deepEqual(coverage.verified_sources.map(source => source.source_path).filter(path => path.includes('gradient_stops')).sort(), ['/fills/0/gradient_stops/0/alpha', '/fills/0/gradient_stops/0/color', '/fills/0/gradient_stops/0/position', '/fills/0/gradient_stops/1/alpha', '/fills/0/gradient_stops/1/color', '/fills/0/gradient_stops/1/position']);
  assert.equal(coverage.verified_sources.some(source => source.source_path.includes('gradient_transform')), false);
  assert.equal(coverage.not_required_sources.filter(source => source.source_path.startsWith('/fills/0/gradient_transform/')).length, 6);
  const effective = api().applyNativeContextCoverage({facts: raw, coverage});
  assert.ok(raw.issues.some(issue => issue.source_path === '/fills/0/gradient_transform/0/0'));
  assert.equal(effective.issues.some(issue => issue.source_path === '/fills/0/gradient_transform/0/0'), false);
});

for (const [label, mutate] of [
  ['missing end mapping', f => {f.record.contracts.figma_fact_links.splice(-1, 1);}],
  ['third stop', f => {f.node.fills[0].gradient_stops.push({position: .5, color: '#000000', alpha: 1}); f.node.fills[0].stops.push({position: .5, color: '#000000', alpha: 1});}],
  ['nonendpoint position', f => {f.node.fills[0].gradient_stops[1].position = .9;}],
  ['divergent stops alias', f => {f.node.fills[0].stops[1].alpha = .5;}],
  ['stale angle decision', f => {f.record.evidence_links.normative_decisions[0].targets[0].context_sha256 = '0'.repeat(64);}]
]) test(`gradient context rejects ${label}`, () => {
  const f = gradientFixture(); mutate(f); assert.equal(api().auditNativeContextProofs(f).ok, false);
});

test('html context qualifies only the null mixed fills aggregate from complete mapped runs', () => {
  const f = mixedTextFixture();
  assert.equal(auditNativeRelationProofs(f).ok, true, 'independent text structure');
  const raw = auditFigmaContractFacts({record: f.record, live: f.packet});
  const coverage = api().auditNativeContextProofs(f);
  assert.equal(coverage.ok, true);
  assert.deepEqual(coverage.verified_sources.map(source => source.source_path).filter(path => path === '/fills'), ['/fills']);
  const effective = api().applyNativeContextCoverage({facts: raw, coverage});
  assert.ok(raw.capture_diagnostics.some(diagnostic => diagnostic.raw?.code === 'MIXED_VALUE' && diagnostic.raw?.field === 'fills'));
  assert.equal(effective.issues.some(issue => issue.source_path === '/fills'), false);
  assert.ok(effective.issues.some(issue => issue.source_path === '/text_case'));
  assert.ok(effective.issues.some(issue => issue.source_path.startsWith('/variable_bindings/')));
});

for (const [label, mutate] of [
  ['incomplete run', f => {f.node.styled_text_segments[0].end = 1;}],
  ['non-solid run paint', f => {f.node.styled_text_segments[0].fills[0].type = 'gradient_linear';}],
  ['missing primitive mapping', f => {f.record.contracts.figma_fact_links.pop();}],
  ['unknown run paint field', f => {f.node.styled_text_segments[0].fills[0].future = true;}]
]) test(`mixed null fills context rejects ${label}`, () => {
  const f = mixedTextFixture(); mutate(f); assert.equal(api().auditNativeContextProofs(f).ok, false);
});

function refreshGradientApproval(f) {
  const root = f.record.contracts.mobile.root;
  const angle = root.facts.find(fact => fact.id === 'background-gradient-css-angle-degrees');
  const index = root.facts.indexOf(angle);
  const target = f.record.evidence_links.normative_decisions[0].targets[0];
  target.context_sha256 = contractDecisionContextDigest({selector: selector(f.node.node_id), paintIndex: 0, model: f.model, session: f.session});
  target.value_sha256 = contractDecisionValueDigest({record: f.record, contractPath: `/contracts/mobile/root/facts/${index}/value`});
}

test('gradient context permits fallback and start facts mapped from the same captured endpoint', () => {
  const f = gradientFixture();
  addFact(f.record, {id: 'background-gradient-fallback', value: {type: 'color', value: '#18B037'}, provenance: {kind: 'figma-literal', node_id: f.node.node_id}}, '/fills/0/gradient_stops/0/color');
  assert.equal(api().auditNativeContextProofs(f).ok, true);
});

test('gradient context rejects a fills MIXED_VALUE capture diagnostic', () => {
  const f = gradientFixture();
  f.packet.capture_errors.push({node_id: f.node.node_id, code: 'MIXED_VALUE', field: 'fills'});
  assert.equal(api().auditNativeContextProofs(f).ok, false);
});

test('gradient context rejects a wrong-owner endpoint mapping', () => {
  const f = gradientFixture();
  f.record.contracts.figma_fact_links.find(link => link.source_path === '/fills/0/gradient_stops/0/color').node_id = '101:2';
  assert.equal(api().auditNativeContextProofs(f).ok, false);
});

test('gradient context rejects a changed native matrix under the prior approval digest', () => {
  const f = gradientFixture();
  f.node.fills[0].gradient_transform[0][2] = 1;
  assert.equal(api().auditNativeContextProofs(f).ok, false);
});

for (const [label, mutate] of [
  ['third stop with refreshed approval digest', f => {f.node.fills[0].gradient_stops.push({position: .5, color: '#000000', alpha: 1}); f.node.fills[0].stops.push({position: .5, color: '#000000', alpha: 1}); refreshGradientApproval(f);}],
  ['nonendpoint position with refreshed approval digest', f => {f.node.fills[0].gradient_stops[1].position = .9; f.node.fills[0].stops[1].position = .9; refreshGradientApproval(f);}]
]) test(`gradient context rejects ${label}`, () => {
  const f = gradientFixture(); mutate(f); assert.equal(api().auditNativeContextProofs(f).ok, false);
});

test('mixed null fills rejects malformed producer capture-error shape', () => {
  const f = mixedTextFixture();
  f.packet.capture_errors[0].extra = true;
  assert.equal(api().auditNativeContextProofs(f).ok, false);
});

test('gradient coverage rejects copied, tampered, and cross-packet reports', () => {
  const f = gradientFixture();
  const raw = auditFigmaContractFacts({record: f.record, live: f.packet});
  const coverage = api().auditNativeContextProofs(f);
  const tampered = coverage;
  tampered.not_required_sources.push({component_id: f.record.id, variant_node_id: '101:1', node_id: f.node.node_id, source_path: '/fills/0/gradient_transform/0/0'});
  assert.equal(api().applyNativeContextCoverage({facts: raw, coverage: structuredClone(coverage)}), raw);
  assert.equal(api().applyNativeContextCoverage({facts: raw, coverage: tampered}), raw);
  const other = structuredClone(f.packet);
  other.variants[0].source_node.future_gradient_field = true;
  const otherRaw = auditFigmaContractFacts({record: f.record, live: other});
  assert.equal(api().applyNativeContextCoverage({facts: otherRaw, coverage: api().auditNativeContextProofs(f)}), otherRaw);
});

test('actual Contact mixed TEXT captures with empty aggregate fills qualify through full native-context routing', async () => {
  const f = await actualContactFixture(), report = contactReport(f);
  const desktop = contactNativeNode(f.packet, '459:27586'), mobile = contactNativeNode(f.packet, '459:27607');
  assert.equal(desktop.styled_text_segments[0].line_height.value, 139.9999976158142);
  assert.equal(mobile.styled_text_segments[0].line_height.value, 139.9999976158142);
  assert.equal(contactSegmentsFact(f.record, '472:16997', desktop.node_id).fact.value.items[0].line_height.value, 140);
  assert.equal(contactSegmentsFact(f.record, '472:16998', mobile.node_id).fact.value.items[0].line_height.value, 140);
  assert.equal(contactHelpContexts(report).length, 2, JSON.stringify(contactHelpContexts(report)));
  assert.equal(contactHelpContexts(report).every(item => item.status === 'verified'), true, JSON.stringify(contactHelpContexts(report)));
  for (const node_id of contactHelpNodes()) assert.equal(report.effective_facts.issues.some(issue => issue.node_id === node_id && issue.source_path === '/fills'), false);
  assert.ok(report.effective_facts.issues.some(issue => issue.node_id === '459:27586' && issue.source_path === '/text_style/text_case'));
  assert.ok(report.effective_facts.issues.some(issue => issue.node_id === '459:27607' && issue.source_path.startsWith('/variable_bindings/')));
});

for (const {label, affected, mutate} of [
  {label: 'removes the same-node fills MIXED_VALUE error', affected: contactHelpNodes(), mutate: f => {f.packet.capture_errors = f.packet.capture_errors.filter(error => !(contactHelpNodes().includes(error.node_id) && error.field === 'fills'));}},
  {label: 'duplicates a same-node fills MIXED_VALUE error', affected: ['459:27586'], mutate: f => {f.packet.capture_errors.push(structuredClone(f.packet.capture_errors.find(error => error.node_id === '459:27586' && error.field === 'fills')));}},
  {label: 'moves the fills MIXED_VALUE error to a foreign node', affected: ['459:27586'], mutate: f => {f.packet.capture_errors.find(error => error.node_id === '459:27586' && error.field === 'fills').node_id = '459:27585';}}
]) test(`actual Contact empty aggregate fills stays unverified when it ${label}`, async () => {
  const f = await actualContactFixture(); mutate(f); const report = contactReport(f);
  assert.equal(contactHelpContexts(report).length, 2, JSON.stringify(contactHelpContexts(report)));
  for (const node_id of affected) {
    assert.equal(contactContextByNode(report, node_id)?.status, 'unverified', JSON.stringify(contactHelpContexts(report)));
    assert.ok(report.effective_facts.issues.some(issue => issue.node_id === node_id && issue.source_path === '/fills'));
  }
  for (const node_id of contactHelpNodes().filter(node_id => !affected.includes(node_id))) assert.equal(contactContextByNode(report, node_id)?.status, 'verified', JSON.stringify(contactHelpContexts(report)));
});

for (const {label, mutate} of [
  {label: 'a material line-height difference', mutate: f => { contactNativeNode(f.packet, '459:27607').styled_text_segments[0].line_height.value = 140.01; }},
  {label: 'a material font-size difference', mutate: f => { contactNativeNode(f.packet, '459:27607').styled_text_segments[0].font_size_px = 12.01; }},
  {label: 'a changed line-height unit', mutate: f => { contactNativeNode(f.packet, '459:27607').styled_text_segments[0].line_height.unit = 'PIXELS'; }},
  {label: 'an unknown raw run field', mutate: f => { contactNativeNode(f.packet, '459:27607').styled_text_segments[0].unexpected = true; }},
  {label: 'an unknown canonical run field', mutate: f => { contactSegmentsFact(f.record, '472:16998', '459:27607').fact.value.items[0].unexpected = true; }},
  {label: 'a wrong-node primitive mapping', mutate: f => { contactSegmentsFact(f.record, '472:16998', '459:27607').link.node_id = '459:27606'; }},
  {label: 'a stale packet binding', mutate: f => { f.packet.capture_meta.request.canonical_git_sha = 'f'.repeat(40); }},
  {label: 'a changed color rather than numeric canonicalization', mutate: f => { contactNativeNode(f.packet, '459:27607').styled_text_segments[0].fills[0].color = '#757679'; }}
]) test(`actual Contact mixed TEXT empty aggregate rejects ${label}`, async () => {
  const f = await actualContactFixture(); mutate(f); const report = contactReport(f);
  assert.equal(contactContextByNode(report, f.record, '459:27607')?.status, 'unverified', JSON.stringify(contactHelpContexts(report)));
  assert.ok(report.effective_facts.issues.some(issue => issue.node_id === '459:27607' && issue.source_path === '/fills'));
});

test('mixed null fills context leaves an unknown root field effective-uncovered', () => {
  const f = mixedTextFixture(); f.node.future_native_field = true;
  const raw = auditFigmaContractFacts({record: f.record, live: f.packet}), coverage = api().auditNativeContextProofs(f);
  assert.equal(coverage.ok, true);
  const effective = api().applyNativeContextCoverage({facts: raw, coverage});
  assert.ok(effective.issues.some(issue => issue.source_path === '/future_native_field'));
});
