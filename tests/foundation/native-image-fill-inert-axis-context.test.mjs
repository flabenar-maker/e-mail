import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

import { readStrictYaml } from '../../scripts/lib/strict-yaml.mjs';
import { auditFigmaContractFacts } from '../../scripts/lib/figma-contract-facts.mjs';
import { auditNativeRelationProofs } from '../../scripts/lib/native-relationship-coverage.mjs';
import { auditNativeContextProofs, applyNativeContextCoverage, validateNativeContextProofReferences } from '../../scripts/lib/native-context-coverage.mjs';
import { validateComponentRegistryShape } from '../../scripts/lib/component-registry.mjs';
import { fixture as relationFixture } from './native-relationship-coverage.test.mjs';

const clone = value => structuredClone(value);
const axisPaths = ['/layout/primary_axis_sizing', '/layout/counter_axis_sizing'];
const axisProof = { id: 'secondary-image-inert-axis', kind: 'image-fill-inert-axis-context', structure_proof_id: 'detail-structure' };
const paintProof = { id: 'secondary-image-existing-paint', kind: 'image-fill-paint-context', structure_proof_id: 'detail-structure' };
const assetsFoundation = await readStrictYaml(new URL('../../data/foundations/assets.yaml', import.meta.url));

function fixture() {
  const f = relationFixture();
  const element = f.record.contracts.mobile.root.children[1];
  const node = f.packet.variants[0].source_node.children[1];
  element.id = 'secondary-image';
  element.semantic_role = 'secondary-image';
  element.render_mode = 'direct-image';
  element.asset_contract_id = 'secondary-image';
  element.children = [];
  element.facts = [
    { id: 'reference-size', value: { type: 'dimensions', width: 296, height: 188, unit: 'px' }, provenance: { kind: 'figma-literal', node_id: '101:3' } },
    { id: 'horizontal-sizing', value: { type: 'keyword', value: 'fill' }, provenance: { kind: 'figma-literal', node_id: '101:3' } },
    { id: 'vertical-sizing', value: { type: 'keyword', value: 'fixed' }, provenance: { kind: 'figma-literal', node_id: '101:3' } },
    { id: 'layout-wrap', value: { type: 'keyword', value: 'no_wrap' }, provenance: { kind: 'figma-literal', node_id: '101:3' } }
  ];
  node.node_type = 'FRAME'; node.name = 'secondary-image @2x'; node.visible = true; node.children = [];
  node.reference_dimensions = { width: 296, height: 188, unit: 'px' };
  node.layout = { mode: 'NONE', horizontal_sizing: 'FILL', vertical_sizing: 'FIXED', primary_axis_sizing: 'AUTO', counter_axis_sizing: 'FIXED', item_spacing: 0, counter_axis_spacing: 0, wrap: 'NO_WRAP', primary_axis_alignment: 'MIN', counter_axis_alignment: 'MIN', padding: { top: 0, right: 0, bottom: 0, left: 0 } };
  Object.assign(node, { minimum_width_px: null, layout_positioning: 'AUTO', layout_grow: 0, clips_content: true, corner_radius: 0, corner_radii: { top_left: 0, top_right: 0, bottom_right: 0, bottom_left: 0 }, fills: [{ type: 'image', visible: true, opacity: 1, image_hash: 'fresh-image-hash', scale_mode: 'FILL', image_transform: [[1, 0, 0], [0, 1, 0]], scaling_factor: 0.5, rotation: 0, filters: { exposure: 0, contrast: 0, saturation: 0, temperature: 0, tint: 0, highlights: 0, shadows: 0 } }], strokes: [], opacity: 1, rotation: 0, variable_bindings: {}, component_property_references: {} });
  f.packet.variants[0].source_node.opacity = 1;
  f.record.asset_contracts = [{ id: 'secondary-image', owner_layer_name: 'secondary-image @2x', source_viewport: 'mobile', source_mode_id: 'image-fill', display_mode_id: 'fill-image', export_profile_id: 'jpeg-2x', alpha_mode_id: 'none', clipping_policy_id: 'preserve-artwork', export_boundary: { kind: 'fill', semantic_node_name: 'secondary-image @2x' }, pixel_dimensions: { width: 592, height: 376, unit: 'px' }, aspect_ratio: { width: 296, height: 188 }, crop: { mode: 'figma-fill', position_source: 'concrete-mobile-instance' }, background: { own_visible_boundary_fill: 'preserve', artificial_matte: 'forbid' }}];
  const prefix = '/contracts/mobile/root/children/1/facts';
  f.record.contracts.figma_fact_links.push(
    { variant_node_id: '101:1', node_id: '101:3', source_path: '/layout/horizontal_sizing', contract_path: `${prefix}/1/value/value`, transform: 'lowercase' },
    { variant_node_id: '101:1', node_id: '101:3', source_path: '/layout/vertical_sizing', contract_path: `${prefix}/2/value/value`, transform: 'lowercase' },
    { variant_node_id: '101:1', node_id: '101:3', source_path: '/layout/wrap', contract_path: `${prefix}/3/value/value`, transform: 'lowercase' }
  );
  f.record.evidence_links.native_context_proofs = [clone(axisProof)];
  const raw = auditFigmaContractFacts({ record: f.record, live: f.packet });
  assert.equal(raw.issues.some(issue => ['FIGMA_CONTRACT_MISMATCH', 'CONTRACT_FACT_UNMAPPED', 'FIGMA_SOURCE_PATH_MISSING'].includes(issue.code)), false, 'fixture must authenticate direct size/sizing/wrap mappings before the new context proof');
  assert.equal(auditNativeRelationProofs(f).ok, true, 'independent flat owned structure must verify before axis coverage');
  return { ...f, element, node, raw };
}

test('image-fill inert NONE axis context closes only its two independently bounded sizing leaves', () => {
  const f = fixture();
  f.node.future_native_field = 'retain';
  const raw = auditFigmaContractFacts({ record: f.record, live: f.packet });
  const coverage = auditNativeContextProofs(f);
  assert.equal(coverage.ok, true, 'the new context capability should verify the complete inert NONE image boundary');
  assert.deepEqual(coverage.verified_sources.map(source => source.source_path).sort(), [...axisPaths].sort());
  const effective = applyNativeContextCoverage({ facts: raw, coverage });
  for (const path of axisPaths) assert.equal(effective.issues.some(issue => issue.node_id === '101:3' && issue.source_path === path), false, path);
  const tuple = issue => JSON.stringify([issue.variant_node_id, issue.node_id, issue.source_path, issue.code]);
  const expected = raw.issues.filter(issue => !(issue.node_id === '101:3' && axisPaths.includes(issue.source_path))).map(tuple).sort();
  assert.deepEqual(effective.issues.map(tuple).sort(), expected, 'only the two authenticated axis tuples may leave original raw coverage');
  assert.ok(effective.issues.some(issue => issue.node_id === '101:3' && issue.source_path === '/future_native_field'), 'unknown native field remains uncovered');
  assert.deepEqual(auditFigmaContractFacts({ record: f.record, live: f.packet }), raw, 'raw report remains intact');
});

test('image-fill inert axis kind is accepted by the real registry schema and does not replace paint metadata', async () => {
  const doc = clone(await readStrictYaml(new URL('../../data/components/marketing.yaml', import.meta.url)));
  const record = doc.components.find(item => item.id === 'banner-secondary');
  record.evidence_links.native_context_proofs = record.evidence_links.native_context_proofs.filter(proof => proof.kind !== 'image-fill-inert-axis-context');
  record.evidence_links.native_context_proofs.push({ id: 'schema-secondary-inert-axis', kind: 'image-fill-inert-axis-context', structure_proof_id: 'native-mobile-root-card-secondary-image-structure' });
  const schema = JSON.parse(await readFile(new URL('../../schemas/components.schema.json', import.meta.url), 'utf8'));
  assert.deepEqual(validateComponentRegistryShape(doc, schema), []);
  assert.deepEqual(validateNativeContextProofReferences({ records: [record] }), []);
});

test('one inert-axis context coexists with the existing paint context while duplicate axis metadata is rejected', () => {
  const f = fixture();
  f.record.evidence_links.native_context_proofs.unshift(clone(paintProof));
  f.model.source_documents = new Map([['assets-foundation', clone(assetsFoundation)]]);
  f.model.manifest = { sources: [{ id: 'assets-foundation', kind: 'foundation', path: 'data/foundations/assets.yaml' }] };
  assert.equal(auditNativeContextProofs(f).ok, true, 'different closed context kinds may share the verified image relation');
  f.record.evidence_links.native_context_proofs.push({ ...axisProof, id: 'secondary-image-inert-axis-duplicate' });
  assert.ok(validateNativeContextProofReferences({ records: [f.record] }).length, 'duplicate inert-axis metadata must be rejected');
});

test('removing the inert-axis proof retains both original axis obligations', () => {
  const f = fixture();
  f.record.evidence_links.native_context_proofs = [];
  const coverage = auditNativeContextProofs(f);
  assert.equal(coverage.ok, true);
  const effective = applyNativeContextCoverage({ facts: f.raw, coverage });
  assert.deepEqual(effective, f.raw);
  for (const path of axisPaths) assert.ok(effective.issues.some(issue => issue.node_id === '101:3' && issue.source_path === path), path);
});

test('ordinary HTML and image-fill paint contexts cannot share one structure reference', () => {
  const f = fixture();
  f.record.evidence_links.native_context_proofs = [clone(paintProof), { id: 'ordinary-context', kind: 'html-element-context', structure_proof_id: 'detail-structure' }];
  assert.ok(validateNativeContextProofReferences({ records: [f.record] }).length);
});

for (const [label, mutate] of [
  ['missing structure', f => { f.record.evidence_links.native_context_proofs[0].structure_proof_id = 'missing'; }],
  ['wrong asset', f => { f.element.asset_contract_id = 'other'; }],
  ['wrong viewport', f => { f.record.asset_contracts[0].source_viewport = 'desktop'; }],
  ['wrong boundary', f => { f.record.asset_contracts[0].export_boundary.kind = 'node'; }],
  ['wrong native identity', f => { f.node.name = 'other @2x'; }],
  ['non-FRAME node', f => { f.node.node_type = 'RECTANGLE'; }],
  ['native child', f => { f.node.children.push({ node_id: '101:4' }); }],
  ['HUG qualifier', f => { f.node.layout.horizontal_sizing = 'HUG'; }],
  ['unknown layout mode', f => { f.node.layout.mode = 'VERTICAL'; }],
  ['wrong primary qualifier', f => { f.node.layout.primary_axis_sizing = 'FIXED'; }],
  ['wrong counter qualifier', f => { f.node.layout.counter_axis_sizing = 'AUTO'; }],
  ['nonzero padding', f => { f.node.layout.padding.left = 1; }],
  ['nonzero gap', f => { f.node.layout.item_spacing = 1; }],
  ['wrong alignment', f => { f.node.layout.primary_axis_alignment = 'CENTER'; }],
  ['wrap', f => { f.node.layout.wrap = 'WRAP'; }],
  ['missing layout field', f => { delete f.node.layout.counter_axis_sizing; }],
  ['extra layout field', f => { f.node.layout.future_axis = 'AUTO'; }],
  ['missing padding side', f => { delete f.node.layout.padding.left; }],
  ['missing direct mapping', f => { f.record.contracts.figma_fact_links = f.record.contracts.figma_fact_links.filter(link => link.source_path !== '/layout/wrap'); }],
  ['ambiguous direct mapping', f => { f.record.contracts.figma_fact_links.push(clone(f.record.contracts.figma_fact_links.find(link => link.source_path === '/layout/horizontal_sizing'))); }],
  ['wrong mapping node', f => { f.record.contracts.figma_fact_links.find(link => link.source_path === '/layout/horizontal_sizing').node_id = '101:2'; }],
  ['wrong mapping variant', f => { f.record.contracts.figma_fact_links.find(link => link.source_path === '/layout/horizontal_sizing').variant_node_id = '201:1'; }],
  ['wrong mapping source path', f => { f.record.contracts.figma_fact_links.find(link => link.source_path === '/layout/horizontal_sizing').source_path = '/layout/future'; }],
  ['wrong mapping transform', f => { f.record.contracts.figma_fact_links.find(link => link.source_path === '/layout/horizontal_sizing').transform = 'identity'; }],
  ['wrong keyword type', f => { f.element.facts[1].value.type = 'measure'; }],
  ['wrong mapping provenance kind', f => { f.element.facts[1].provenance.kind = 'contract-proof'; }],
  ['missing primary axis value', f => { delete f.node.layout.primary_axis_sizing; }],
  ['missing counter axis value', f => { delete f.node.layout.counter_axis_sizing; }],
  ['hidden node', f => { f.node.visible = false; }],
  ['nonopaque node', f => { f.node.opacity = .9; }],
  ['nonopaque ancestor', f => { f.packet.variants[0].source_node.opacity = .9; }],
  ['absolute positioning', f => { f.node.layout_positioning = 'ABSOLUTE'; }],
  ['nonzero grow', f => { f.node.layout_grow = 1; }],
  ['caller field mask', f => { f.record.evidence_links.native_context_proofs[0].source_paths = axisPaths; }],
  ['source-only role', f => { f.record.identity.semantic_role = 'asset'; }],
  ['template role', f => { f.record.identity.semantic_role = 'template'; }]
]) test(`image-fill inert axis context rejects ${label}`, () => { const f = fixture(); mutate(f); assert.equal(auditNativeContextProofs(f).ok, false); });

test('axis coverage rejects copied, mutated, and cross-packet report objects', () => {
  const f = fixture();
  const coverage = auditNativeContextProofs(f);
  assert.equal(applyNativeContextCoverage({ facts: f.raw, coverage: clone(coverage) }), f.raw);
  coverage.verified_sources.push({ ...coverage.verified_sources[0], source_path: '/layout/future' });
  assert.equal(applyNativeContextCoverage({ facts: f.raw, coverage }), f.raw);
  const mutatedRaw = clone(f.raw); mutatedRaw.issues.push({ code: 'FIGMA_FACT_UNCOVERED', variant_node_id: '101:1', node_id: '101:3', source_path: '/future_raw' });
  assert.equal(applyNativeContextCoverage({ facts: mutatedRaw, coverage: auditNativeContextProofs(f) }), mutatedRaw);
  const other = clone(f.packet); other.variants[0].source_node.children[1].future_native_field = true;
  const otherRaw = auditFigmaContractFacts({ record: f.record, live: other });
  assert.equal(applyNativeContextCoverage({ facts: otherRaw, coverage: auditNativeContextProofs(f) }), otherRaw);
});
