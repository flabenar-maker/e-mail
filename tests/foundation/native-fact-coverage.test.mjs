import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import {auditContractFactProofs} from '../../scripts/lib/contract-fact-proofs.mjs';
import { auditFigmaContractFacts } from '../../scripts/lib/figma-contract-facts.mjs';
import { auditFigmaComponentEvidence } from '../../scripts/lib/figma-component-evidence.mjs';

const native = await import('../../scripts/lib/native-fact-coverage.mjs').catch(() => ({}));
const SHA = 'a'.repeat(40), NONCE = 'b'.repeat(64), REQUEST = 'c'.repeat(64);
const clone = v => structuredClone(v);
const target = '/contracts/mobile/root/facts/0/value';
function api() {
  for (const name of ['validateNativeFactProofReferences', 'auditNativeFactProofs', 'applyNativeFactCoverage'])
    assert.equal(typeof native[name], 'function', `missing native fact coverage API: ${name}`);
  return native;
}
function fixture(kind = 'uniform-corners', options = {}) {
  const node = {
    node_id: '101:1', node_type: kind.startsWith('text-') ? 'TEXT' : 'COMPONENT', name: 'Native root', visible: true, opacity: 1,
    reference_dimensions: {width: 120, height: 40, unit: 'px'},
    corner_radius: 12, corner_radii: {top_left: 12, top_right: 12, bottom_left: 12, bottom_right: 12},
    layout: {mode: 'HORIZONTAL', horizontal_sizing: 'FILL', vertical_sizing: 'HUG', primary_axis_sizing: 'FIXED', counter_axis_sizing: 'AUTO'},
    children: [],
  };
  // TEXT is a child of a real COMPONENT variant, never a forged variant root.
  let root = node;
  if (node.node_type === 'TEXT') {
    node.node_id = '101:2'; node.characters = 'Caption';
    node.text_style = {text_auto_resize: 'HEIGHT', vertical_alignment: 'CENTER'};
    node.text_geometry = {auto_resize: 'HEIGHT', vertical_alignment: 'CENTER'};
    root = {node_id: '101:1', node_type: 'COMPONENT', name: 'Root', visible: true, opacity: 1, children: [node]};
  }
  let fact, sourcePath;
  if (kind === 'uniform-corners') {fact = {id: 'border-radius', value: {type: 'measure', value: 12, unit: 'px'}}; sourcePath = '/corner_radius';}
  else if (kind === 'text-resize-alias') {fact = {id: 'text-auto-resize', value: {type: 'keyword', value: 'height'}}; sourcePath = '/text_geometry/auto_resize';}
  else if (kind === 'text-alignment-alias') {fact = {id: 'text-vertical-alignment', value: {type: 'keyword', value: 'center'}}; sourcePath = '/text_geometry/vertical_alignment';}
  else {fact = {id: 'horizontal-sizing', value: {type: 'keyword', value: 'fill'}}; sourcePath = '/layout/horizontal_sizing';}
  fact.provenance = {kind: 'figma-literal', node_id: node.node_id};
  const record = {
    id: 'native-fixture', identity: {library: 'service', node_kind: 'component-set', semantic_role: 'block', figma_name: 'Native fixture'},
    figma: {file_key: 'native-file', node_id: '100:1'}, variants: [{id: 'mobile', node_id: '101:1', axes: [{name: 'Viewport', value: 'Mobile'}]}],
    asset_contracts: [],
    contracts: {
      mobile: {root: {id: 'root', semantic_role: 'card', render_mode: 'presentation-table', facts: [fact], children: []}},
      desktop: {root: {id: 'root', semantic_role: 'card', render_mode: 'presentation-table', facts: [], children: []}},
      figma_fact_links: [{variant_node_id: '101:1', node_id: node.node_id, source_path: sourcePath, contract_path: `${target}/value`, transform: kind === 'uniform-corners' ? 'identity' : 'lowercase'}],
    },
    evidence_links: {foundation_values: [], source_dependencies: [], native_fact_proofs: [{
      id: 'native-proof', kind, source: {component_id: 'native-fixture', variant_node_id: '101:1', node_id: node.node_id}, contract_path: target,
      ...(kind === 'axis-sizing-alias' ? {axis: 'primary'} : {}),
    }]},
  };
  const packet = {
    capture_version: '1.3.0', file_key: 'native-file', component_node_id: '100:1', component_properties: [], capture_errors: [],
    owner_identity: {node_id: '100:1', node_type: 'COMPONENT_SET', name: 'Native fixture'},
    capture_meta: {started_at: '2040-01-01T10:00:01.000Z', completed_at: '2040-01-01T10:00:02.000Z', tree_complete: true, node_count: root === node ? 1 : 2,
      request: {session_nonce: NONCE, request_nonce: REQUEST, canonical_git_sha: SHA}},
    variants: [{variant_node_id: '101:1', axes: [{name: 'Viewport', value: 'Mobile'}], source_node: root}],
  };
  const session = {
    schema_version: '1.1.0', canonical_git_sha: SHA, session_nonce: NONCE, started_at: '2026-10-04T10:00:00.000Z', completed_at: '2026-10-04T10:00:04.000Z', component_ids: [record.id],
    captures: [{component_id: record.id, receipt_id: 'receipt-native', tool: 'use_figma', request_nonce: REQUEST,
      requested_at: '2026-10-04T10:00:01.000Z', received_at: '2026-10-04T10:00:03.000Z', packet}],
  };
  const model = {canonical_sha: SHA, records: [record], source_documents: new Map(), manifest: {sources: []}};
  if (options.mutate) options.mutate({record, node, packet, session, model});
  return {record, node, packet, session, model};
}
function audit(f) {return api().auditNativeFactProofs({record: f.record, model: f.model, session: f.session});}
function paths(report) {return report.verified_sources.map(s => s.source_path).sort();}
function effective(f, coverage = audit(f), facts = auditFigmaContractFacts({record: f.record, live: f.packet})) {
  return {facts, coverage, effective: api().applyNativeFactCoverage({facts, coverage})};
}

test('four equal corners reduce to one independently mapped pixel radius, without changing provenance or raw report', () => {
  const f = fixture(), before = clone(f.record), coverage = audit(f);
  assert.equal(coverage.ok, true);
  assert.deepEqual(paths(coverage), ['/corner_radii/bottom_left', '/corner_radii/bottom_right', '/corner_radii/top_left', '/corner_radii/top_right']);
  const result = effective(f, coverage), rawBefore = clone(result.facts);
  assert.equal(result.facts.issues.filter(i => i.source_path?.startsWith('/corner_radii/')).length, 4);
  assert.equal(result.effective.issues.filter(i => i.source_path?.startsWith('/corner_radii/')).length, 0);
  assert.ok(result.effective.issues.some(i => i.code === 'FIGMA_FACT_UNCOVERED' && i.source_path === '/opacity'));
  assert.deepEqual(result.facts, rawBefore); assert.deepEqual(f.record, before);
});

for (const [label, mutate] of [
  ['unequal corner', f => {f.node.corner_radii.bottom_right = 13;}],
  ['missing corner', f => {delete f.node.corner_radii.bottom_right;}],
  ['extra corner key', f => {f.node.corner_radii.future_corner = 12;}],
  ['string corner', f => {f.node.corner_radii.bottom_right = '12';}],
  ['wrong target value', f => {f.record.contracts.mobile.root.facts[0].value.value = 13;}],
  ['unit mismatch', f => {f.record.contracts.mobile.root.facts[0].value.unit = 'percent';}],
  ['missing direct link', f => {f.record.contracts.figma_fact_links = [];}],
  ['duplicate direct target', f => {f.record.contracts.figma_fact_links.push(clone(f.record.contracts.figma_fact_links[0]));}],
  ['wrong native node in provenance', f => {f.record.contracts.mobile.root.facts[0].provenance.node_id = '199:1';}],
  ['unknown property on proof', f => {f.record.evidence_links.native_fact_proofs[0].ignore_paths = ['/opacity'];}],
  ['wrong request', f => {f.packet.capture_meta.request.request_nonce = 'd'.repeat(64);}],
  ['wrong owner', f => {f.packet.owner_identity.node_id = '199:1';}],
  ['incomplete tree', f => {f.packet.capture_meta.tree_complete = false;}],
]) test(`uniform radius proof refuses ${label}`, () => {
  const f = fixture('uniform-corners', {mutate}), coverage = audit(f);
  assert.equal(coverage.ok, false); assert.equal(coverage.verified_sources.length, 0);
  assert.ok(effective(f, coverage).effective.issues.some(i => i.source_path === '/corner_radii/top_left'));
});

for (const [kind, sourcePath] of [['text-resize-alias', '/text_style/text_auto_resize'], ['text-alignment-alias', '/text_style/vertical_alignment']]) {
  test(`${kind} checks the exact same TEXT node and existing geometry link`, () => {
    const f = fixture(kind), coverage = audit(f); assert.equal(coverage.ok, true); assert.deepEqual(paths(coverage), [sourcePath]);
    assert.equal(effective(f, coverage).effective.issues.some(i => i.source_path === sourcePath), false);
    f.node.text_style[kind === 'text-resize-alias' ? 'text_auto_resize' : 'vertical_alignment'] = 'DIFFERENT';
    const failure = audit(f); assert.equal(failure.ok, false); assert.deepEqual(failure.verified_sources, []);
  });
}

for (const row of [
  {mode: 'HORIZONTAL', axis: 'primary', direction: 'horizontal', sizing: 'FILL', native: 'FIXED'},
  {mode: 'HORIZONTAL', axis: 'counter', direction: 'vertical', sizing: 'HUG', native: 'AUTO'},
  {mode: 'VERTICAL', axis: 'primary', direction: 'vertical', sizing: 'HUG', native: 'AUTO'},
  {mode: 'VERTICAL', axis: 'counter', direction: 'horizontal', sizing: 'FIXED', native: 'FIXED'},
]) test(`axis proof derives ${row.mode}/${row.axis}/${row.sizing} without equating FILL to HUG`, () => {
  const f = fixture('axis-sizing-alias'); const proof = f.record.evidence_links.native_fact_proofs[0]; proof.axis = row.axis;
  f.node.layout.mode = row.mode; f.node.layout[`${row.direction}_sizing`] = row.sizing; f.node.layout[`${row.axis}_axis_sizing`] = row.native;
  f.record.contracts.mobile.root.facts[0].id = `${row.direction}-sizing`; f.record.contracts.mobile.root.facts[0].value.value = row.sizing.toLowerCase();
  f.record.contracts.figma_fact_links[0].source_path = `/layout/${row.direction}_sizing`;
  assert.deepEqual(paths(audit(f)), [`/layout/${row.axis}_axis_sizing`]);
  f.node.layout[`${row.axis}_axis_sizing`] = row.native === 'AUTO' ? 'FIXED' : 'AUTO';
  assert.equal(audit(f).ok, false);
});
test('unknown layout mode and wrong axis target cannot establish coverage', () => {
  const f = fixture('axis-sizing-alias'); f.node.layout.mode = 'NONE'; assert.equal(audit(f).ok, false);
  f.node.layout.mode = 'VERTICAL'; assert.equal(audit(f).ok, false);
});

test('all evidence arrays share IDs; duplicate obligations and foreign targets are refused', () => {
  const f = fixture(); f.record.evidence_links.source_dependencies = [{id: 'native-proof'}];
  assert.ok(api().validateNativeFactProofReferences({records: [f.record]}).some(i => i.code === 'NATIVE_PROOF_ID_DUPLICATE'));
  f.record.evidence_links.source_dependencies = []; f.record.evidence_links.native_fact_proofs.push({...clone(f.record.evidence_links.native_fact_proofs[0]), id: 'second-proof'});
  assert.ok(api().validateNativeFactProofReferences({records: [f.record]}).some(i => i.code === 'NATIVE_PROOF_SOURCE_DUPLICATE'));
  f.record.evidence_links.native_fact_proofs = [clone(f.record.evidence_links.native_fact_proofs[0])];
  f.record.evidence_links.native_fact_proofs[0].source.component_id = 'other-owner'; assert.equal(audit(f).ok, false);
});
test('copied, caller-made, mutated, and other-packet reports never close raw obligations', () => {
  const f = fixture(), coverage = audit(f), facts = auditFigmaContractFacts({record: f.record, live: f.packet});
  for (const fake of [clone(coverage), {ok: true, verified_sources: coverage.verified_sources}]) assert.equal(api().applyNativeFactCoverage({facts, coverage: fake}), facts);
  const copiedRaw = clone(facts); assert.equal(api().applyNativeFactCoverage({facts: copiedRaw, coverage}), copiedRaw);
  const otherPacket = clone(f.packet); otherPacket.variants[0].source_node.opacity = 0.5;
  const other = auditFigmaContractFacts({record: f.record, live: otherPacket}); assert.equal(api().applyNativeFactCoverage({facts: other, coverage}), other);
  coverage.verified_sources.push({component_id: f.record.id, variant_node_id: '101:1', node_id: '101:1', source_path: '/opacity'});
  assert.equal(api().applyNativeFactCoverage({facts, coverage}), facts);
});
test('effective proof refusal preserves raw value mismatch and unknown source fields', () => {
  const f = fixture(); f.node.future_native_capability = true; f.node.corner_radius = 14;
  const result = effective(f); assert.ok(result.effective.issues.some(i => i.code === 'FIGMA_CONTRACT_MISMATCH'));
  assert.ok(result.effective.issues.some(i => i.source_path === '/future_native_capability'));
});
test('orchestrator exposes raw and native proof reports without waiving unrelated fields', () => {
  api(); const f = fixture(); const result = auditFigmaComponentEvidence({record: f.record, live: f.packet, model: f.model, session: f.session});
  assert.equal(result.native_fact_proofs.ok, true);
  assert.equal(result.facts.issues.filter(i => i.source_path?.startsWith('/corner_radii/')).length, 4);
  assert.equal(result.effective_facts.issues.filter(i => i.source_path?.startsWith('/corner_radii/')).length, 0);
  assert.equal(result.ok, false); assert.ok(result.effective_facts.issues.some(i => i.source_path === '/opacity'));
});

test('uniform corners require an actual corner-capable node type', () => {
  const f = fixture();
  const child = f.node; child.node_id = '101:2'; child.node_type = 'TEXT';
  const root = {node_id: '101:1', node_type: 'COMPONENT', name: 'Root', visible: true, opacity: 1, children: [child]};
  f.packet.variants[0].source_node = root; f.packet.capture_meta.node_count = 2;
  f.record.contracts.mobile.root.facts[0].provenance.node_id = child.node_id;
  f.record.contracts.figma_fact_links[0].node_id = child.node_id;
  f.record.evidence_links.native_fact_proofs[0].source.node_id = child.node_id;
  assert.equal(audit(f).ok, false);
});
test('axis sizing requires an actual Auto Layout capable node type', () => {
  const f = fixture('axis-sizing-alias');
  const child = f.node; child.node_id = '101:2'; child.node_type = 'RECTANGLE';
  const root = {node_id: '101:1', node_type: 'COMPONENT', name: 'Root', visible: true, opacity: 1, children: [child]};
  f.packet.variants[0].source_node = root; f.packet.capture_meta.node_count = 2;
  f.record.contracts.mobile.root.facts[0].provenance.node_id = child.node_id;
  f.record.contracts.figma_fact_links[0].node_id = child.node_id;
  f.record.evidence_links.native_fact_proofs[0].source.node_id = child.node_id;
  assert.equal(audit(f).ok, false);
});
test('native proof schema is closed and discriminates axis metadata', () => {
  const schema = JSON.parse(readFileSync(new URL('../../schemas/components.schema.json', import.meta.url), 'utf8'));
  const ajv = new Ajv2020({strict: true, allErrors: true}); ajv.addSchema(schema);
  const validate = ajv.compile({$ref: `${schema.$id}#/$defs/nativeFactProof`});
  for (const kind of ['uniform-corners', 'text-resize-alias', 'text-alignment-alias', 'axis-sizing-alias']) {
    const p = fixture(kind).record.evidence_links.native_fact_proofs[0]; assert.equal(validate(p), true);
    assert.equal(validate({...clone(p), ignore_paths: ['/opacity']}), false);
    assert.equal(validate({...clone(p), kind: 'future-ignore'}), false);
  }
  const axis = fixture('axis-sizing-alias').record.evidence_links.native_fact_proofs[0];
  assert.equal(validate({...clone(axis), axis: 'diagonal'}), false);
  const missing = clone(axis); delete missing.axis; assert.equal(validate(missing), false);
  assert.equal(validate({...fixture().record.evidence_links.native_fact_proofs[0], axis: 'primary'}), false);
});
test('mobile native selector cannot reduce a desktop target', () => {
  const f = fixture(); f.record.contracts.desktop.root.facts = f.record.contracts.mobile.root.facts;
  f.record.evidence_links.native_fact_proofs[0].contract_path = '/contracts/desktop/root/facts/0/value';
  assert.ok(api().validateNativeFactProofReferences({records: [f.record]}).some(i => i.code === 'NATIVE_PROOF_SELECTOR_INVALID'));
  assert.equal(audit(f).ok, false);
});
test('authenticated native and contract proof branches compose from one original raw report', () => {
  const f = fixture();
  f.record.identity.library = 'shared'; f.record.identity.semantic_role = 'asset';
  f.record.variants[0].axes = []; f.packet.variants[0].axes = [];
  f.record.contracts.mobile.root.facts.push({id: 'source-dimensions', value: {type: 'dimensions', width: 120, height: 40, unit: 'px'}, provenance: {kind: 'contract-proof', proof_id: 'source-dimensions-proof'}});
  f.record.evidence_links.fact_proofs = [{id: 'source-dimensions-proof', kind: 'source-value-set', sources: [{component_id: f.record.id, variant_node_id: '101:1', node_id: '101:1'}], field: 'dimensions', contract_path: '/contracts/mobile/root/facts/1/value'}];
  const facts = auditFigmaContractFacts({record: f.record, live: f.packet}), coverage = audit(f);
  const contractProofs = auditContractFactProofs({record: f.record, model: f.model, session: f.session});
  assert.equal(coverage.ok, true); assert.equal(contractProofs.ok, true);
  const result = api().applyNativeFactCoverage({facts, coverage, contractProofs});
  assert.ok(facts.issues.some(i => i.code === 'CONTRACT_FACT_UNMAPPED' && i.contract_path.startsWith('/contracts/mobile/root/facts/1/')));
  assert.equal(result.issues.some(i => i.code === 'CONTRACT_FACT_UNMAPPED' && i.contract_path.startsWith('/contracts/mobile/root/facts/1/')), false);
  assert.equal(result.issues.some(i => i.source_path?.startsWith('/corner_radii/')), false);
  assert.equal(result.issues.some(i => i.source_path?.startsWith('/reference_dimensions/')), false);
  assert.ok(result.issues.some(i => i.source_path === '/opacity'));
  const composedAgain = api().applyNativeFactCoverage({facts: result, coverage, contractProofs}); assert.equal(composedAgain, result);
});
