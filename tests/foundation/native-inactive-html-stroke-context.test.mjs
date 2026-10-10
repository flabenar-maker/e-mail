import assert from 'node:assert/strict';
import test from 'node:test';
import {fixture as relationFixture} from './native-relationship-coverage.test.mjs';
import {auditNativeRelationProofs} from '../../scripts/lib/native-relationship-coverage.mjs';
import {auditNativeContextProofs} from '../../scripts/lib/native-context-coverage.mjs';

const strokeVariable = 'VariableID:dd9ec21777b96b29256fb926ca8ad8d55b8d726f/22:17';
const collection = 'VariableCollectionId:3b29eff80abbf8cba059b4f3a2a46b61f38a23b4/17:75';
const contextProof = {id: 'inactive-stroke-context', kind: 'html-element-context', structure_proof_id: 'root-structure'};

function fixture() {
  const f = relationFixture();
  const root = f.record.contracts.mobile.root;
  const node = f.packet.variants[0].source_node;
  Object.assign(node, {
    layout_positioning: 'AUTO', layout_grow: 0, minimum_width_px: null, opacity: 1, rotation: 0,
    fills: [], effects: [], stroke_weight: 1, stroke_align: 'INSIDE',
    strokes: [{type: 'solid', visible: false, opacity: 1, color: '#FFFFFF'}],
    variable_bindings: {strokes: [{id: strokeVariable}]},
    layout: {mode: 'VERTICAL', wrap: 'NO_WRAP', counter_axis_spacing: 0}
  });
  root.facts.push(
    {id: 'layout-orientation', value: {type: 'keyword', value: 'vertical'}, provenance: {kind: 'figma-literal', node_id: node.node_id}},
    {id: 'layout-wrap', value: {type: 'keyword', value: 'no_wrap'}, provenance: {kind: 'figma-literal', node_id: node.node_id}}
  );
  f.record.contracts.figma_fact_links.push(
    {variant_node_id: '101:1', node_id: node.node_id, source_path: '/layout/mode', contract_path: '/contracts/mobile/root/facts/' + (root.facts.length - 2) + '/value/value', transform: 'lowercase'},
    {variant_node_id: '101:1', node_id: node.node_id, source_path: '/layout/wrap', contract_path: '/contracts/mobile/root/facts/' + (root.facts.length - 1) + '/value/value', transform: 'lowercase'}
  );
  f.record.evidence_links.native_context_proofs = [structuredClone(contextProof)];
  f.packet.binding_evidence = {
    variables: [{id: strokeVariable, name: 'Grey/White', key: 'dd9ec21777b96b29256fb926ca8ad8d55b8d726f', remote: true, collection_id: collection, resolved_type: 'COLOR', values_by_mode: {'4:4': {r: 1, g: 1, b: 1, a: 1}}}],
    collections: [{id: collection, name: 'Brand Core Colors', default_mode: '4:4', modes: [{id: '4:4', name: 'Mode 1'}]}],
    usages: [{node_id: node.node_id, binding_path: '/variable_bindings/strokes/0', variable_id: strokeVariable, resolved_type: 'COLOR', resolved_value: {r: 1, g: 1, b: 1, a: 1}, mode_selections: [{collection_id: collection, mode_id: '4:4'}]}],
    paint_locations: {schema_version: '1.0.0', items: []}
  };
  assert.equal(auditNativeRelationProofs({record: f.record, model: f.model, session: f.session}).ok, true, 'independent owned structure baseline');
  return {...f, node};
}

function coverage(f) { return auditNativeContextProofs({record: f.record, model: f.model, session: f.session}); }

test('one complete invisible SOLID stroke with an exact own COLOR usage is inert HTML context, not border scalar coverage', () => {
  const f = fixture(); const report = coverage(f);
  assert.equal(report.ok, true);
  const paths = new Set(report.not_required_sources.map(source => source.source_path));
  for (const path of ['/strokes/0/type', '/strokes/0/visible', '/strokes/0/opacity', '/strokes/0/color', '/stroke_weight', '/stroke_align', '/variable_bindings/strokes/0/id']) assert.ok(paths.has(path), path);
  assert.equal(report.verified_sources.some(source => source.source_path.startsWith('/strokes/')), false, 'inert stroke is not an HTML border scalar');
});

test('a hidden complete SOLID stroke may omit the optional binding only when no stroke usage is claimed', () => {
  const f = fixture(); f.node.variable_bindings = {}; f.packet.binding_evidence.usages = [];
  assert.equal(coverage(f).ok, true);
});

for (const [label, mutate] of [
  ['visible stroke', f => { f.node.strokes[0].visible = true; }],
  ['unknown paint key', f => { f.node.strokes[0].unexpected = true; }],
  ['mixed stroke', f => { f.node.strokes = [{type: 'solid', visible: false, opacity: 1, color: '#FFFFFF'}, {type: 'solid', visible: false, opacity: 1, color: '#FFFFFF'}]; }],
  ['incomplete stroke', f => { delete f.node.strokes[0].opacity; }],
  ['active unexpected stroke', f => { f.node.strokes[0].visible = true; f.node.strokes[0].opacity = 1; }],
  ['wrong binding usage node', f => { f.packet.binding_evidence.usages[0].node_id = '101:2'; }],
  ['missing binding usage', f => { f.packet.binding_evidence.usages = []; }],
  ['wrong binding definition collection', f => { f.packet.binding_evidence.variables[0].collection_id = 'VariableCollectionId:other'; }]
]) test('hidden stroke refuses ' + label, () => {
  const f = fixture(); mutate(f); assert.equal(coverage(f).ok, false);
});
