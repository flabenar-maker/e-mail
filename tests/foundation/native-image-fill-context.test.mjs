import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {auditFigmaContractFacts} from '../../scripts/lib/figma-contract-facts.mjs';
import {auditNativeRelationProofs} from '../../scripts/lib/native-relationship-coverage.mjs';
import {auditNativeContextProofs, applyNativeContextCoverage, validateNativeContextProofReferences} from '../../scripts/lib/native-context-coverage.mjs';
import {validateComponentRegistryShape} from '../../scripts/lib/component-registry.mjs';
import {fixture as relationFixture} from './native-relationship-coverage.test.mjs';
const imageProof = {id: 'secondary-image-fill', kind: 'image-fill-paint-context', structure_proof_id: 'detail-structure'};
const paint = {type: 'image', visible: true, opacity: 1, image_hash: '9391ea844ee162e6e7fd61a0833038e535161381', scale_mode: 'FILL', image_transform: [[1, 0, 0], [0, 1, 0]], scaling_factor: .5, rotation: 0, filters: {exposure: 0, contrast: 0, saturation: 0, temperature: 0, tint: 0, highlights: 0, shadows: 0}};
const clone = value => structuredClone(value);
const paintPaths = ['/fills/0/type','/fills/0/visible','/fills/0/opacity','/fills/0/image_hash','/fills/0/scale_mode','/fills/0/image_transform/0/0','/fills/0/image_transform/0/1','/fills/0/image_transform/0/2','/fills/0/image_transform/1/0','/fills/0/image_transform/1/1','/fills/0/image_transform/1/2','/fills/0/scaling_factor','/fills/0/rotation','/fills/0/filters/exposure','/fills/0/filters/contrast','/fills/0/filters/saturation','/fills/0/filters/temperature','/fills/0/filters/tint','/fills/0/filters/highlights','/fills/0/filters/shadows'];

function fixture() {
  const f = relationFixture(), element = f.record.contracts.mobile.root.children[1], node = f.packet.variants[0].source_node.children[1];
  element.id = 'secondary-image'; element.semantic_role = 'secondary-image'; element.render_mode = 'direct-image'; element.asset_contract_id = 'secondary-image'; element.children = [];
  node.node_type = 'FRAME'; node.name = 'secondary-image @2x'; node.visible = true; node.children = []; node.reference_dimensions = {width: 296, height: 188, unit: 'px'};
  node.layout = {mode: 'NONE', horizontal_sizing: 'FILL', vertical_sizing: 'FIXED', primary_axis_sizing: 'AUTO', counter_axis_sizing: 'FIXED', item_spacing: 0, counter_axis_spacing: 0, wrap: 'NO_WRAP', primary_axis_alignment: 'MIN', counter_axis_alignment: 'MIN', padding: {top: 0, right: 0, bottom: 0, left: 0}};
  Object.assign(node, {minimum_width_px: null, layout_align: 'STRETCH', layout_grow: 0, layout_positioning: 'AUTO', clips_content: true, corner_radius: 0, corner_radii: {top_left: 0, top_right: 0, bottom_right: 0, bottom_left: 0}, fills: [clone(paint)], strokes: [], opacity: 1, rotation: 0, variable_bindings: {}, component_property_references: {}});
  element.facts[0].value = {type: 'dimensions', width: 296, height: 188, unit: 'px'};
  f.record.asset_contracts = [{id: 'secondary-image', owner_layer_name: 'secondary-image @2x', source_viewport: 'mobile', source_mode_id: 'image-fill', display_mode_id: 'fill-image', export_profile_id: 'jpeg-2x', alpha_mode_id: 'none', clipping_policy_id: 'preserve-artwork', export_boundary: {kind: 'fill', semantic_node_name: 'secondary-image @2x'}, pixel_dimensions: {width: 592, height: 376, unit: 'px'}, aspect_ratio: {width: 296, height: 188}, crop: {mode: 'figma-fill', position_source: 'concrete-mobile-instance'}, background: {own_visible_boundary_fill: 'preserve', artificial_matte: 'forbid'}}];
  f.record.evidence_links.native_context_proofs = [clone(imageProof)];
  const raw = auditFigmaContractFacts({record: f.record, live: f.packet});
  assert.equal(raw.issues.some(issue => ['FIGMA_CONTRACT_MISMATCH', 'CONTRACT_FACT_UNMAPPED', 'FIGMA_SOURCE_PATH_MISSING'].includes(issue.code)), false, 'fixture must authenticate existing direct mappings before image-fill coverage');
  assert.equal(auditNativeRelationProofs(f).ok, true, 'independent owned structure proof must verify first');
  return {...f, element, node, raw};
}

test('image-fill paint context is a closed semantic proof and schema section', async () => {
  const f = fixture();
  assert.deepEqual(validateNativeContextProofReferences({records: [f.record]}), []);
  const doc = JSON.parse(await readFile(new URL('../../data/components/marketing.yaml', import.meta.url), 'utf8'));
  doc.components = [f.record];
  const schema = JSON.parse(await readFile(new URL('../../schemas/components.schema.json', import.meta.url), 'utf8'));
  assert.deepEqual(validateComponentRegistryShape(doc, schema), []);
});

test('owned flat Mobile JPEG image-fill context closes exactly 20 complete IMAGE paint leaves', () => {
  const f = fixture(), coverage = auditNativeContextProofs(f);
  assert.equal(coverage.ok, true);
  assert.deepEqual(coverage.verified_sources.map(source => source.source_path).filter(path => path.startsWith('/fills/0/')).sort(), [...paintPaths].sort());
  const effective = applyNativeContextCoverage({facts: f.raw, coverage});
  for (const path of paintPaths) assert.equal(effective.issues.some(issue => issue.node_id === f.node.node_id && issue.source_path === path), false, path);
  for (const path of ['/layout/primary_axis_sizing', '/layout/counter_axis_sizing', '/strokes', '/corner_radius']) assert.ok(effective.issues.some(issue => issue.node_id === f.node.node_id && issue.source_path === path), path);
  assert.deepEqual(auditFigmaContractFacts({record: f.record, live: f.packet}), f.raw, 'raw report is retained');
});

for (const [label, mutate] of [
  ['wrong asset', f => {f.element.asset_contract_id = 'other';}], ['wrong owner name', f => {f.node.name = 'other @2x';}], ['wrong source viewport', f => {f.record.asset_contracts[0].source_viewport = 'desktop';}], ['wrong JPEG profile', f => {f.record.asset_contracts[0].export_profile_id = 'png-4x';}], ['wrong alpha', f => {f.record.asset_contracts[0].alpha_mode_id = 'transparent';}], ['wrong clipping', f => {f.record.asset_contracts[0].clipping_policy_id = 'clip';}], ['wrong crop', f => {f.record.asset_contracts[0].crop.position_source = 'other';}], ['wrong background', f => {f.record.asset_contracts[0].background.artificial_matte = 'allow';}], ['ratio not 2x', f => {f.record.asset_contracts[0].pixel_dimensions.width = 591;}], ['wrong native type', f => {f.node.node_type = 'RECTANGLE';}], ['nested native child', f => {f.node.children.push({node_id: '101:99'});}], ['missing structure', f => {f.record.evidence_links.native_context_proofs[0].structure_proof_id = 'missing';}], ['capture error', f => {f.packet.capture_errors.push({node_id: f.node.node_id, field: 'fills', code: 'MIXED_VALUE'});}], ['FIT mode', f => {f.node.fills[0].scale_mode = 'FIT';}], ['nonidentity transform', f => {f.node.fills[0].image_transform[0][2] = .1;}], ['rotation', f => {f.node.fills[0].rotation = 1;}], ['nonzero filter', f => {f.node.fills[0].filters.tint = 1;}], ['unknown paint field', f => {f.node.fills[0].future = true;}], ['missing filter', f => {delete f.node.fills[0].filters.tint;}], ['null hash', f => {f.node.fills[0].image_hash = null;}], ['extra paint', f => {f.node.fills.push(clone(paint));}]
]) test(`image-fill context rejects ${label}`, () => { const f = fixture(); mutate(f); assert.equal(auditNativeContextProofs(f).ok, false); });

test('image-fill coverage rejects copied, mutated, and cross-packet reports', () => {
  const f = fixture(), coverage = auditNativeContextProofs(f), copied = clone(coverage);
  assert.equal(applyNativeContextCoverage({facts: f.raw, coverage: copied}), f.raw);
  coverage.verified_sources.push({...coverage.verified_sources[0], source_path: '/fills/0/future'});
  assert.equal(applyNativeContextCoverage({facts: f.raw, coverage}), f.raw);
});
