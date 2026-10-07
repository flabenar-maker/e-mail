import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadComponentEvidenceModel} from '../../scripts/lib/component-evidence-inputs.mjs';
import {auditFigmaComponentEvidence} from '../../scripts/lib/figma-component-evidence.mjs';

const SHA = 'd9771f9fe5063bbe6794843ac893a13d81c48a2a';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ids = ['block-transaction-success', 'badge-operation-status', 'details-operation'];
const packet = async id => JSON.parse(await readFile(join(root, 'tests/foundation/fixtures/genuine-html-d977', `${id}.json`), 'utf8'));
const walk = (node, all = []) => { all.push(node); for (const child of node.children ?? []) walk(child, all); return all; };
async function fixture() {
  const model = await loadComponentEvidenceModel({repoRoot: root, canonicalSha: SHA});
  const packets = Object.fromEntries(await Promise.all(ids.map(async id => [id, await packet(id)])));
  // Static unit-fixture session: it preserves the admitted d977 envelope and
  // packet identities, but it never represents a new capture or fresh proof.
  const session = JSON.parse(await readFile(join(root, 'tests/foundation/fixtures/genuine-html-d977/session.json'), 'utf8'));
  for (const capture of session.captures) capture.packet = packets[capture.component_id];
  return {model, packets, session};
}
function actualPlacements(f) {
  const parent = f.packets['block-transaction-success'];
  const targets = new Map(['badge-operation-status', 'details-operation'].map(id => [id, new Set(f.model.records.find(r => r.id === id).variants.map(v => v.node_id))]));
  return parent.variants.flatMap(variant => walk(variant.source_node).filter(node => node.node_type === 'INSTANCE').flatMap(node => {
    const component_id = [...targets].find(([, variants]) => variants.has(node.main_component_id))?.[0];
    return component_id ? [{component_id, variant_node_id: variant.variant_node_id, node}] : [];
  }));
}
function nested(report) { assert.ok(report.nested_html, 'combined audit must expose nested_html rather than silently stopping at genuine HTML INSTANCE descendants'); return report.nested_html; }
function firstText(instance) { return walk(instance.node).find(node => node.node_type === 'TEXT'); }
function selectedDetailsTextContract(f, placement) {
  const record = f.model.records.find(item => item.id === 'details-operation');
  const variant = record.variants.find(item => item.node_id === placement.node.main_component_id);
  const viewport = variant.axes.find(axis => axis.name === 'Viewport').value.toLowerCase();
  return {record, variant_node_id: variant.node_id, text: record.contracts[viewport].root.children[0].children[0]};
}

test('actual d977 child records independently pass the combined auditor before nested-owner coverage is tested', async () => {
  const f = await fixture();
  for (const id of ['badge-operation-status', 'details-operation']) {
    const record = f.model.records.find(r => r.id === id);
    const report = auditFigmaComponentEvidence({record, live: f.packets[id], model: f.model, session: f.session});
    assert.equal(report.ok, true, `${id}: ${JSON.stringify(report.issues)}`);
  }
});

test('combined owner audit selects exactly the four actual nested HTML placements and preserves out-of-scope parent findings', async () => {
  const f = await fixture(), placements = actualPlacements(f), owner = f.model.records.find(r => r.id === 'block-transaction-success');
  assert.equal(placements.length, 4);
  const report = auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session});
  const result = nested(report);
  assert.equal(result.ok, true, JSON.stringify(result.issues));
  assert.deepEqual(new Set(result.placements.map(p => p.actual_node_id)), new Set(placements.map(p => p.node.node_id)));
  assert.ok(report.facts.issues.length > 0, 'parent residual artwork findings stay raw and separate');
});

test('nested HTML records a same-length actual plain-text override as observation, not runtime authorization', async () => {
  const f = await fixture(), owner = f.model.records.find(r => r.id === 'block-transaction-success'), placement = actualPlacements(f)[0], actual = firstText(placement);
  const original = actual.characters;
  actual.characters = `${original.slice(0, -1)}${original.at(-1) === 'X' ? 'Y' : 'X'}`;
  assert.equal(actual.characters.length, original.length);
  const result = nested(auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session}));
  assert.equal(result.ok, true, JSON.stringify(result.issues));
  assert.ok(result.observed_content_overrides.some(item => item.actual_node_id === actual.node_id && item.source_path === '/characters'));
});

test('nested HTML rejects a Details FILL placement without its exact lowercase direct mapping', async () => {
  const f = await fixture(), owner = f.model.records.find(r => r.id === 'block-transaction-success'), placement = actualPlacements(f).find(item => item.component_id === 'details-operation');
  owner.contracts.figma_fact_links = owner.contracts.figma_fact_links.filter(link => !(link.variant_node_id === placement.variant_node_id && link.node_id === placement.node.node_id && link.source_path === '/layout/horizontal_sizing' && link.transform === 'lowercase'));
  const result = nested(auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session}));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some(item => item.code === 'NESTED_HTML_PLACEMENT_UNVERIFIED'));
});

test('nested HTML leaves an observed descendant reference measurement unverified without a same-element typed behavior', async () => {
  const f = await fixture(), owner = f.model.records.find(r => r.id === 'block-transaction-success'), actual = firstText(actualPlacements(f).find(item => item.component_id === 'details-operation'));
  actual.reference_dimensions.width += 1;
  const result = nested(auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session}));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some(item => item.code === 'NESTED_HTML_REFERENCE_UNVERIFIED'));
});

for (const [label, mutate] of [
  ['removes the unique direct characters mapping', (f, placement) => { const selected = selectedDetailsTextContract(f, placement); const link = selected.record.contracts.figma_fact_links.find(item => item.variant_node_id === selected.variant_node_id && item.source_path === '/characters'); selected.record.contracts.figma_fact_links = selected.record.contracts.figma_fact_links.filter(item => item !== link); }],
  ['duplicates the direct characters mapping', (f, placement) => { const selected = selectedDetailsTextContract(f, placement); selected.record.contracts.figma_fact_links.push(structuredClone(selected.record.contracts.figma_fact_links.find(item => item.variant_node_id === selected.variant_node_id && item.source_path === '/characters'))); }],
  ['removes the attached plain-text slot', (f, placement) => { selectedDetailsTextContract(f, placement).text.content_slots = []; }],
]) test(`nested HTML content override is unverified when it ${label}`, async () => {
  const f = await fixture(), owner = f.model.records.find(r => r.id === 'block-transaction-success'), placement = actualPlacements(f).find(item => item.component_id === 'details-operation'), actual = firstText(placement);
  actual.characters = `${actual.characters.slice(0, -1)}X`;
  mutate(f, placement);
  const result = nested(auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session}));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some(item => item.code === 'NESTED_HTML_CONTENT_UNVERIFIED'));
});

for (const [label, mutate] of [
  ['text style', f => { firstText(actualPlacements(f)[0]).text_style.font_size_px += 1; }],
  ['text color', f => { firstText(actualPlacements(f)[0]).fills[0].color = '#FFFFFF'; }],
  ['binding', f => { firstText(actualPlacements(f)[0]).variable_bindings = {fills: {type: 'VARIABLE_ALIAS', id: 'VariableID:1'}}; }],
  ['unknown descendant field', f => { firstText(actualPlacements(f)[0]).future_override = true; }],
  ['details ordered children', f => { const target = actualPlacements(f).find(p => p.component_id === 'details-operation'); target.node.children[0].children.reverse(); }],
]) test(`nested HTML rejects actual ${label} drift`, async () => {
  const f = await fixture(), owner = f.model.records.find(r => r.id === 'block-transaction-success');
  nested(auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session}));
  mutate(f);
  const report = auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session});
  assert.equal(nested(report).ok, false);
  assert.ok(nested(report).issues.some(i => i.code === 'NESTED_HTML_DESCENDANT_UNVERIFIED'));
});

test('nested HTML rejects a missing child receipt', async () => {
  const f = await fixture(), owner = f.model.records.find(r => r.id === 'block-transaction-success');
  f.session.captures = f.session.captures.filter(c => c.component_id !== 'details-operation');
  assert.ok(nested(auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session})).issues.some(i => i.code === 'EVIDENCE_CAPTURE_MISSING'));
});

test('nested HTML rejects wrong all-axis actual instance properties', async () => {
  const f = await fixture(), placement = actualPlacements(f).find(p => p.component_id === 'badge-operation-status');
  placement.node.instance_properties.State.value = 'Success';
  assert.ok(nested(auditFigmaComponentEvidence({record: f.model.records.find(r => r.id === 'block-transaction-success'), live: f.packets['block-transaction-success'], model: f.model, session: f.session})).issues.some(i => i.code === 'NESTED_HTML_PLACEMENT_UNVERIFIED'));
});

test('nested HTML fails closed before borrowing immediate-child coverage for a deeper genuine dependency', async () => {
  const f = await fixture(), owner = f.model.records.find(r => r.id === 'block-transaction-success'), details = f.model.records.find(r => r.id === 'details-operation');
  // Synthetic unit mutation only: it models a second genuine library edge;
  // it is not a Figma capture, a new canonical value, or an admitted packet.
  details.contracts.mobile.root.children.push({
    id: 'synthetic-deeper-genuine-html',
    render_mode: 'nested-component',
    component_id: 'badge-operation-status',
    facts: [],
    children: [],
  });
  const result = nested(auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session}));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some(item => item.code === 'NESTED_HTML_DEPTH_UNVERIFIED'));
});
test('nested HTML fails closed before comparing an unqualified child artwork projection', async () => {
  const f = await fixture(), owner = f.model.records.find(r => r.id === 'block-transaction-success'), details = f.model.records.find(r => r.id === 'details-operation');
  // Synthetic unit mutation only: a declared child graphic edge without an
  // actual qualified graphic-owner proof. No packet or design scalar is added.
  details.asset_contracts.push({owner_layer_name: 'synthetic-unqualified-artwork'});
  details.contracts.mobile.root.children.push({
    id: 'synthetic-unqualified-artwork',
    semantic_role: 'synthetic-unqualified-artwork',
    render_mode: 'direct-image',
    children: [],
  });
  const result = nested(auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session}));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some(item => item.code === 'NESTED_HTML_ARTWORK_UNVERIFIED'));
});

for (const [label, mutate] of [
  ['missing projected descendant usage', f => { const usage = f.packets['block-transaction-success'].binding_evidence.usages.find(item => item.node_id.startsWith('I484:20069;')); f.packets['block-transaction-success'].binding_evidence.usages = f.packets['block-transaction-success'].binding_evidence.usages.filter(item => item !== usage); }],
  ['wrong projected resolved value', f => { const usage = f.packets['block-transaction-success'].binding_evidence.usages.find(item => item.node_id.startsWith('I484:20069;')); usage.resolved_value = typeof usage.resolved_value === 'number' ? usage.resolved_value + 1 : {r: 1, g: 0, b: 0, a: 1}; }],
  ['invalid projected mode selection', f => { const usage = f.packets['block-transaction-success'].binding_evidence.usages.find(item => item.node_id.startsWith('I484:20069;')); usage.mode_selections[0].mode_id = 'invalid-mode'; }],
]) test(`nested HTML rejects ${label} against actual consumer binding evidence`, async () => {
  const f = await fixture(), owner = f.model.records.find(r => r.id === 'block-transaction-success');
  nested(auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session}));
  mutate(f);
  const report = auditFigmaComponentEvidence({record: owner, live: f.packets[owner.id], model: f.model, session: f.session});
  assert.equal(nested(report).ok, false);
  assert.ok(nested(report).issues.some(i => i.code === 'NESTED_HTML_VARIABLE_UNVERIFIED'));
});
