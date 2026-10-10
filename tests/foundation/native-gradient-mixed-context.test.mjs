import assert from 'node:assert/strict';
import test from 'node:test';
import {fixture as relationFixture} from './native-relationship-coverage.test.mjs';
import {auditFigmaContractFacts} from '../../scripts/lib/figma-contract-facts.mjs';
import {auditNativeRelationProofs} from '../../scripts/lib/native-relationship-coverage.mjs';
import {auditContractFactProofs, contractDecisionContextDigest, contractDecisionValueDigest} from '../../scripts/lib/contract-fact-proofs.mjs';

const context = await import('../../scripts/lib/native-context-coverage.mjs');
const clone = value => structuredClone(value);
const api = () => {
  for (const name of ['auditNativeContextProofs', 'applyNativeContextCoverage']) assert.equal(typeof context[name], 'function', `missing native context API: ${name}`);
  return context;
};
const selector = node_id => ({component_id: 'relationship-fixture', variant_node_id: '101:1', node_id});

function addFact(record, fact, source_path) {
  const root = record.contracts.mobile.root;
  root.facts.push(fact);
  record.contracts.figma_fact_links.push({variant_node_id: '101:1', node_id: fact.provenance.node_id, source_path, contract_path: `/contracts/mobile/root/facts/${root.facts.length - 1}/value/value`, transform: 'identity'});
  return root.facts.length - 1;
}

function gradientFixture() {
  const f = relationFixture(), node = f.packet.variants[0].source_node, root = f.record.contracts.mobile.root;
  f.record.identity = {...f.record.identity, semantic_role: 'button'};
  root.semantic_role = 'button';
  Object.assign(node, {layout_positioning: 'AUTO', layout_grow: 0, minimum_width_px: null, opacity: 1, rotation: 0, strokes: [], variable_bindings: {}, effects: []});
  node.layout = {mode: 'VERTICAL', wrap: 'NO_WRAP', counter_axis_spacing: 0};
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
  Object.assign(node, {characters: 'Help', fills: null, layout_positioning: 'AUTO', layout_grow: 0, minimum_width_px: null, opacity: 1, rotation: 0, strokes: [], variable_bindings: {}, effects: [], text_style: {font_family: null, font_style: null, text_decoration: null}});
  node.layout = {mode: 'VERTICAL', wrap: 'NO_WRAP', counter_axis_spacing: 0};
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
  assert.equal(auditContractFactProofs({record: f.record, model: f.model, session: f.session}).ok, true, 'independent approved angle');
  const raw = auditFigmaContractFacts({record: f.record, live: f.packet});
  const coverage = api().auditNativeContextProofs(f);
  assert.equal(coverage.ok, true);
  assert.deepEqual(coverage.verified_sources.map(source => source.source_path).filter(path => path.includes('gradient_stops')).sort(), ['/fills/0/gradient_stops/0/color', '/fills/0/gradient_stops/1/color']);
  assert.equal(coverage.verified_sources.some(source => source.source_path.includes('gradient_transform')), false);
  const effective = api().applyNativeContextCoverage({facts: raw, coverage});
  assert.ok(effective.issues.some(issue => issue.source_path === '/fills/0/gradient_transform/0/0'));
});

for (const [label, mutate] of [
  ['missing end mapping', f => {f.record.contracts.figma_fact_links.splice(-1, 1);}],
  ['third stop', f => {f.node.fills[0].gradient_stops.push({position: .5, color: '#000000', alpha: 1}); f.node.fills[0].stops.push({position: .5, color: '#000000', alpha: 1});}],
  ['nonendpoint position', f => {f.node.fills[0].gradient_stops[1].position = .9;}],
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
  assert.ok(effective.issues.some(issue => issue.source_path === '/text_case') || effective.issues.some(issue => issue.source_path.startsWith('/variable_bindings')));
});

for (const [label, mutate] of [
  ['incomplete run', f => {f.node.styled_text_segments[0].end = 1;}],
  ['non-solid run paint', f => {f.node.styled_text_segments[0].fills[0].type = 'gradient_linear';}],
  ['missing primitive mapping', f => {f.record.contracts.figma_fact_links.pop();}],
  ['unknown root field', f => {f.node.future_native_field = true;}]
]) test(`mixed null fills context rejects ${label}`, () => {
  const f = mixedTextFixture(); mutate(f); assert.equal(api().auditNativeContextProofs(f).ok, false);
});
