import assert from 'node:assert/strict';
import test from 'node:test';
import {fixture as relationFixture} from './native-relationship-coverage.test.mjs';
import {auditFigmaContractFacts} from '../../scripts/lib/figma-contract-facts.mjs';
import {auditNativeRelationProofs} from '../../scripts/lib/native-relationship-coverage.mjs';
import {auditNativeContextProofs, applyNativeContextCoverage} from '../../scripts/lib/native-context-coverage.mjs';
function fixture({divider = false, paint = true} = {}) {
  const f = relationFixture();
  const node = divider ? f.packet.variants[0].source_node.children[1] : f.packet.variants[0].source_node;
  const e = divider ? f.record.contracts.mobile.root.children[1] : f.record.contracts.mobile.root;
  const path = divider ? '/contracts/mobile/root/children/1' : '/contracts/mobile/root';
  const relation = divider ? 'detail-structure' : 'root-structure';
  Object.assign(node, {layout_positioning: 'AUTO', layout_grow: 0, minimum_width_px: null, opacity: 1, rotation: 0, strokes: [], variable_bindings: {}, effects: []});
  node.layout = divider ? {mode: 'NONE', wrap: 'NO_WRAP', horizontal_sizing: 'FILL', vertical_sizing: 'FIXED', primary_axis_sizing: 'AUTO', counter_axis_sizing: 'FIXED', primary_alignment: 'MIN', counter_alignment: 'MIN', item_spacing: 0, counter_axis_spacing: 0, padding: {left: 0, right: 0, top: 0, bottom: 0}} : {mode: 'VERTICAL', wrap: 'NO_WRAP', counter_axis_spacing: 0};
  if (divider) {node.name = 'divider'; e.semantic_role = 'divider'; node.reference_dimensions.height = 1; e.facts[0].value.height = 1;}
  function fact(id, value, source_path, transform = 'identity') {
    const i = e.facts.length;
    e.facts.push({id, value, provenance: {kind: 'figma-literal', node_id: node.node_id}});
    f.record.contracts.figma_fact_links.push({variant_node_id: '101:1', node_id: node.node_id, source_path, contract_path: `${path}/facts/${i}/value/value`, transform});
  }
  fact('layout-wrap', {type: 'keyword', value: 'no_wrap'}, '/layout/wrap', 'lowercase');
  if (!divider) fact('layout-orientation', {type: 'keyword', value: 'vertical'}, '/layout/mode', 'lowercase');
  else {
    fact('horizontal-sizing', {type: 'keyword', value: 'fill'}, '/layout/horizontal_sizing', 'lowercase');
    fact('vertical-sizing', {type: 'keyword', value: 'fixed'}, '/layout/vertical_sizing', 'lowercase');
  }
  node.fills = paint ? [{type: 'solid', visible: true, opacity: 1, color: '#DFDFE0'}] : [];
  if (paint) fact('background', {type: 'color', value: '#DFDFE0'}, '/fills/0/color');
  f.record.evidence_links.native_context_proofs = [{id: 'element-context', kind: 'html-element-context', structure_proof_id: relation}];
  const raw = auditFigmaContractFacts({record: f.record, live: f.packet});
  assert.equal(raw.issues.some(i => ['FIGMA_CONTRACT_MISMATCH', 'CONTRACT_FACT_UNMAPPED'].includes(i.code)), false, 'direct scalar baseline');
  assert.equal(auditNativeRelationProofs(f).ok, true, 'independent ordered structure baseline');
  return {...f, node, e, raw};
}
function sources(f) {const report = auditNativeContextProofs(f); assert.equal(report.ok, true); return report.verified_sources.map(s => s.source_path);}
test('opaque mapped paint proves native type, visibility and opacity qualifiers', () => {
  const f = fixture(); for (const path of ['/fills/0/type', '/fills/0/visible', '/fills/0/opacity']) assert.ok(sources(f).includes(path), path);
});
test('empty paint is proven absent when HTML element has no own paint fact', () => {assert.ok(sources(fixture({paint: false})).includes('/fills'));});
for (const [name, change] of [
  ['paint alpha', f => {f.node.fills[0].opacity = 0.5;}],
  ['paint visibility', f => {f.node.fills[0].visible = false;}],
  ['paint color mismatch', f => {f.node.fills[0].color = '#FFFFFF';}],
  ['extra paint', f => {f.node.fills.push({...f.node.fills[0]});}],
  ['unknown paint field', f => {f.node.fills[0].future = true;}],
]) test(`paint context rejects ${name}`, () => {const f = fixture(); change(f); assert.equal(auditNativeContextProofs(f).ok, false);});
test('leaf divider NONE layout proves only exact inert padding and axis fields', () => {
  const f = fixture({divider: true}); for (const p of ['/layout/mode', '/layout/primary_axis_sizing', '/layout/counter_axis_sizing', '/layout/item_spacing', '/layout/padding/left']) assert.ok(sources(f).includes(p), p);
});
test('NONE divider rejects nonzero unimplemented padding', () => {const f = fixture({divider: true}); f.node.layout.padding.left = 3; assert.equal(auditNativeContextProofs(f).ok, false);});
test('context coverage preserves unknown native fields and original raw report', () => {
  const f = fixture(); f.node.future_field = 1;
  const raw = auditFigmaContractFacts({record: f.record, live: f.packet}), saved = structuredClone(raw), coverage = auditNativeContextProofs(f);
  assert.equal(coverage.ok, true);
  const effective = applyNativeContextCoverage({facts: raw, coverage});
  assert.deepEqual(raw, saved); assert.ok(effective.issues.some(i => i.source_path === '/future_field'));
  assert.equal(effective.issues.some(i => i.node_id === f.node.node_id && i.source_path === '/fills/0/opacity'), false);
});
