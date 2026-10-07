// External RED transport draft. Intended destination: tests/foundation/native-header-owned-artwork.test.mjs.
// Break protected: accepting an unregistered/mis-bound nested instance as a Header PNG export dependency.
import assert from 'node:assert/strict';
import test from 'node:test';
import {createContractProofEnvironment} from '../../scripts/lib/contract-fact-proofs.mjs';
import {auditFigmaContractFacts} from '../../scripts/lib/figma-contract-facts.mjs';
import {auditComponentEvidenceLinks} from '../../scripts/lib/figma-component-evidence.mjs';
import {collectEvidenceConsumers} from '../../scripts/lib/component-evidence-links.mjs';
const owned = await import('../../scripts/lib/native-owned-artwork.mjs').catch(error => {
  const expected = new URL('../../scripts/lib/native-owned-artwork.mjs', import.meta.url).href;
  if (error?.code === 'ERR_MODULE_NOT_FOUND' && error.url === expected) return {};
  throw error;
});
const relation = await import('../../scripts/lib/native-relationship-coverage.mjs');
const context = await import('../../scripts/lib/native-context-coverage.mjs');
const {validateNativeRelationProofReferences} = relation;
const SHA = 'a'.repeat(40), NONCE = 'b'.repeat(64), REQUEST = 'c'.repeat(64);
const clone = structuredClone;
const sel = (variant_node_id, node_id) => ({component_id: 'email-header', variant_node_id, node_id});
const dim = (node_id, width, height) => ({id: 'reference-size', value: {type: 'dimensions', width, height, unit: 'px'}, provenance: {kind: 'figma-literal', node_id}});
const none = () => ({mode: 'NONE', horizontal_sizing: 'FIXED', vertical_sizing: 'FIXED', primary_axis_sizing: 'AUTO', counter_axis_sizing: 'FIXED', item_spacing: 0, counter_axis_spacing: 0, wrap: 'NO_WRAP', primary_axis_alignment: 'MIN', counter_axis_alignment: 'MIN', padding: {top: 0, right: 0, bottom: 0, left: 0}});
function node(id, type, name, width, height, children = []) { return {node_id: id, node_type: type, name, visible: true, opacity: 1, reference_dimensions: {width, height, unit: 'px'}, layout: none(), layout_positioning: 'AUTO', layout_grow: 0, minimum_width_px: null, clips_content: true, corner_radius: 0, corner_radii: {top_left: 0, top_right: 0, bottom_right: 0, bottom_left: 0}, rotation: 0, strokes: [], effects: [], fills: [], variable_bindings: {}, component_property_references: {}, children}; }
function source(id, node_id, figma, variants) { return {id, identity: {library: 'shared', node_kind: 'component-set', semantic_role: 'asset', figma_name: figma}, figma: {file_key: 'native-file', node_id}, properties: [], variants, asset_contracts: [], contracts: {mobile: {root: {id: 'root', semantic_role: 'asset', render_mode: 'figma-source-only', visibility: {mode: 'always'}, facts: [], children: []}}, desktop: {root: {id: 'root', semantic_role: 'asset', render_mode: 'figma-source-only', visibility: {mode: 'always'}, facts: [], children: []}}, figma_fact_links: []}, evidence_links: {foundation_values: [], source_dependencies: [], native_relation_proofs: [], native_context_proofs: []}}; }
function fixture() {
  const headerShared = source('asset-header-logo-4x', '1008:1476', 'Asset/Header-Logo @4x', [{id: 'product-cupis', node_id: '1008:1473', axes: [{name: 'Product', value: 'CUPIS'}]}]);
  const compactShared = source('asset-header-logo-compact-4x', '1008:1708', 'Asset/Header-Logo-Compact @4x', [{id: 'product-cupis', node_id: '1008:1686', axes: [{name: 'Product', value: 'CUPIS'}]}]);
  const productShared = source('asset-product-logo', '1008:874', 'Asset/Product-Logo', [{id: 'product-cupis', node_id: '1008:871', axes: [{name: 'Product', value: 'CUPIS'}]}]);
  const asset = {id: 'header-logo', owner_layer_name: 'header-logo @4x', source_viewport: 'desktop', source_mode_id: 'rendered-node', display_mode_id: 'direct-image', export_profile_id: 'png-4x', alpha_mode_id: 'transparent', clipping_policy_id: 'preserve-artwork', export_boundary: {kind: 'node', semantic_node_name: 'header-logo @4x'}, pixel_dimensions: {width: 1288, height: 200, unit: 'px'}, aspect_ratio: {width: 322, height: 50}, crop: {mode: 'none', position_source: 'exact-node-after-overrides'}, background: {own_visible_boundary_fill: 'preserve', artificial_matte: 'forbid'}};
  const product = {...node('I1008:1823;1008:1309', 'INSTANCE', 'Asset/Product-Logo', 273.125, 38), main_component_id: '1008:871', instance_properties: {Product: {type: 'VARIANT', value: 'CUPIS', boundVariables: {}}}};
  const desktop = {...node('1008:1823', 'INSTANCE', 'header-logo @4x', 322, 50, [product]), main_component_id: '1008:1473', instance_properties: {Product: {type: 'VARIANT', value: 'CUPIS', boundVariables: {}}}};
  const mobileProduct = {...clone(product), node_id: 'I1008:1709;1008:1347', reference_dimensions: {width: 179.6875, height: 25, unit: 'px'}};
  const mobile = {...clone(desktop), node_id: '1008:1709', name: 'header-logo-compact @4x', reference_dimensions: {width: 212, height: 33, unit: 'px'}, main_component_id: '1008:1686', children: [mobileProduct]};
  const owner = {id: 'email-header', identity: {library: 'marketing', node_kind: 'component-set', semantic_role: 'email', figma_name: 'Email/Header'}, figma: {file_key: 'native-file', node_id: '326:5159'}, properties: [], variants: [{id: 'mobile', node_id: '15:2037', axes: [{name: 'Viewport', value: 'Mobile'}]}, {id: 'desktop', node_id: '230:3679', axes: [{name: 'Viewport', value: 'Desktop'}]}], asset_contracts: [asset], contracts: {mobile: {root: {id: 'root', semantic_role: 'email', render_mode: 'presentation-table', visibility: {mode: 'always'}, facts: [dim('15:2037', 328, 49)], children: [{id: 'logo', semantic_role: 'header-logo-compact', render_mode: 'direct-image', asset_contract_id: 'header-logo', visibility: {mode: 'always'}, facts: [dim('1008:1709', 212, 33)], children: []}]}}, desktop: {root: {id: 'root', semantic_role: 'email', render_mode: 'presentation-table', visibility: {mode: 'always'}, facts: [dim('230:3679', 600, 74)], children: [{id: 'logo', semantic_role: 'header-logo', render_mode: 'direct-image', asset_contract_id: 'header-logo', visibility: {mode: 'always'}, facts: [dim('1008:1823', 322, 50)], children: []}]}}, figma_fact_links: []}, evidence_links: {foundation_values: [], source_dependencies: [
    {id: 'mobile-header', source: {variant_node_id: '15:2037', node_id: '1008:1709'}, target: {component_id: compactShared.id, variant_id: 'product-cupis'}, asset_owner: {node_id: '1008:1709', asset_id: asset.id}},
    {id: 'desktop-header', source: {variant_node_id: '230:3679', node_id: '1008:1823'}, target: {component_id: headerShared.id, variant_id: 'product-cupis'}, asset_owner: {node_id: '1008:1823', asset_id: asset.id}},
    {id: 'mobile-product', source: {variant_node_id: '15:2037', node_id: mobileProduct.node_id}, target: {component_id: productShared.id, variant_id: 'product-cupis'}, asset_owner: {node_id: '1008:1709', asset_id: asset.id}},
    {id: 'desktop-product', source: {variant_node_id: '230:3679', node_id: product.node_id}, target: {component_id: productShared.id, variant_id: 'product-cupis'}, asset_owner: {node_id: '1008:1823', asset_id: asset.id}}], native_relation_proofs: [
    {id: 'mobile-logo', kind: 'element-structure', source: sel('15:2037', '1008:1709'), element_path: '/contracts/mobile/root/children/0'},
    {id: 'desktop-logo', kind: 'element-structure', source: sel('230:3679', '1008:1823'), element_path: '/contracts/desktop/root/children/0'}], native_context_proofs: [{id: 'mobile-artwork', kind: 'rendered-artwork-context', structure_proof_id: 'mobile-logo'}, {id: 'desktop-artwork', kind: 'rendered-artwork-context', structure_proof_id: 'desktop-logo'}]}};
  // The placements are actual VERTICAL consumer nodes. Their dimensions/facts are
  // independently mapped; these are not source/export dimensions.
  for (const [placement, mode, horizontal, vertical] of [[mobile, 'VERTICAL', 'FIXED', 'HUG'], [desktop, 'VERTICAL', 'FIXED', 'FIXED']]) {
    placement.layout = {...none(), mode, horizontal_sizing: horizontal, vertical_sizing: vertical};
    placement.fills = [{type: 'solid', visible: true, opacity: 1, color: '#F3F3F5'}];
  }
  const addFacts = (element, nodeId, axis, vertical) => element.facts.push(
    {id: 'layout-axis', value: {type: 'keyword', value: axis}, provenance: {kind: 'figma-literal', node_id: nodeId}},
    {id: 'horizontal-sizing', value: {type: 'keyword', value: 'fixed'}, provenance: {kind: 'figma-literal', node_id: nodeId}},
    {id: 'vertical-sizing', value: {type: 'keyword', value: vertical}, provenance: {kind: 'figma-literal', node_id: nodeId}},
    {id: 'layout-wrap', value: {type: 'keyword', value: 'no_wrap'}, provenance: {kind: 'figma-literal', node_id: nodeId}},
    {id: 'background', value: {type: 'color', value: '#F3F3F5'}, provenance: {kind: 'figma-literal', node_id: nodeId}});
  addFacts(owner.contracts.mobile.root.children[0], '1008:1709', 'vertical', 'hug');
  addFacts(owner.contracts.desktop.root.children[0], '1008:1823', 'vertical', 'fixed');
  for (const [variant, nodeId, base] of [['15:2037', '1008:1709', '/contracts/mobile/root/children/0/facts'], ['230:3679', '1008:1823', '/contracts/desktop/root/children/0/facts']]) {
    for (const key of ['width', 'height']) owner.contracts.figma_fact_links.push({variant_node_id: variant, node_id: nodeId, source_path: `/reference_dimensions/${key}`, contract_path: `${base}/0/value/${key}`, transform: 'identity'});
    for (const [source_path, index, transform] of [['/layout/mode', 1, 'lowercase'], ['/layout/horizontal_sizing', 2, 'lowercase'], ['/layout/vertical_sizing', 3, 'lowercase'], ['/layout/wrap', 4, 'lowercase'], ['/fills/0/color', 5, 'identity']]) owner.contracts.figma_fact_links.push({variant_node_id: variant, node_id: nodeId, source_path, contract_path: `${base}/${index}/value/value`, transform});
  }
  const roots = [{variant_node_id: '15:2037', axes: owner.variants[0].axes, source_node: node('15:2037', 'COMPONENT', 'Viewport=Mobile', 328, 49, [mobile])}, {variant_node_id: '230:3679', axes: owner.variants[1].axes, source_node: node('230:3679', 'COMPONENT', 'Viewport=Desktop', 600, 74, [desktop])}];
  const packet = {capture_version: '1.3.0', file_key: 'native-file', component_node_id: owner.figma.node_id, owner_identity: {node_id: owner.figma.node_id, node_type: 'COMPONENT_SET', name: owner.identity.figma_name}, component_properties: [{name: 'Viewport', type: 'VARIANT', default: 'Mobile', variant_options: ['Mobile', 'Desktop']}], capture_errors: [], variants: roots, capture_meta: {started_at: '2026-10-05T10:00:01.000Z', completed_at: '2026-10-05T10:00:02.000Z', tree_complete: true, node_count: 6, request: {session_nonce: NONCE, request_nonce: REQUEST, canonical_git_sha: SHA}}};
  const session = {schema_version: '1.1.0', canonical_git_sha: SHA, session_nonce: NONCE, started_at: '2026-10-05T10:00:00.000Z', completed_at: '2026-10-05T10:00:03.000Z', component_ids: [owner.id], captures: [{component_id: owner.id, receipt_id: 'header', tool: 'use_figma', request_nonce: REQUEST, requested_at: '2026-10-05T10:00:01.000Z', received_at: '2026-10-05T10:00:02.000Z', packet}]};
  return {owner, session, packet, model: {canonical_sha: SHA, records: [owner, headerShared, compactShared, productShared], source_documents: new Map(), manifest: {sources: []}}};
}
function api() { for (const n of ['isSharedArtworkReference', 'verifyRegisteredArtworkInstance']) assert.equal(typeof owned[n], 'function', `missing owned-artwork API: ${n}`); }
function all(f) { return {relation: relation.auditNativeRelationProofs({record: f.owner, model: f.model, session: f.session}), context: context.auditNativeContextProofs({record: f.owner, model: f.model, session: f.session})}; }
test('Header fixture authenticates its sole complete owner packet before owned-artwork behavior', () => {
  const f = fixture(), env = createContractProofEnvironment(f.model, f.session);
  assert.deepEqual(env.issues, []);
  assert.equal(env.selected(sel('15:2037', '1008:1709')).node.node_id, '1008:1709');
  assert.equal(env.selected(sel('230:3679', '1008:1823')).node.node_id, '1008:1823');
  assert.equal(env.tree(f.owner.id).nodes.size, 6);
  assert.deepEqual(validateNativeRelationProofReferences({records: f.model.records}), []);
});
test('Header owner-only evidence-link audit needs no Shared capture receipt', () => {
  const f = fixture(); api(); assert.equal(auditComponentEvidenceLinks({recordId: f.owner.id, model: f.model, session: f.session}).ok, true);
});
test('Header raw report preserves an unknown native field', () => {
  const f = fixture(); f.packet.variants[0].source_node.children[0].future_field = 'keep';
  const raw = auditFigmaContractFacts({record: f.owner, live: f.packet});
  assert.equal(raw.issues.some(i => i.source_path === '/future_field'), true);
  assert.deepEqual(raw, structuredClone(raw));
});
test('Header-only capture verifies registered nested artwork without Shared receipts or clipping closure', () => { const f = fixture(); api(); assert.equal(f.session.captures.length, 1); assert.equal(all(f).relation.ok, true); const r = all(f).context; assert.equal(r.ok, true); assert.equal(r.verified_sources.some(x => x.source_path === '/clips_content'), false); });
for (const [name, mutate] of [['missing dependency', f => f.owner.evidence_links.source_dependencies.pop()], ['swapped main', f => f.packet.variants[0].source_node.children[0].main_component_id = '1008:1473'], ['cross-owner link', f => f.owner.evidence_links.source_dependencies[0].asset_owner.node_id = '1008:1823'], ['unknown property', f => f.packet.variants[0].source_node.children[0].instance_properties.Unknown = {type: 'VARIANT', value: 'x', boundVariables: {}}], ['bad Mobile suffix', f => f.packet.variants[0].source_node.children[0].name = 'header-logo-compact @2x'], ['unregistered target', f => f.owner.evidence_links.source_dependencies[0].target.component_id = 'unknown'], ['missing nested instance link', f => f.owner.evidence_links.source_dependencies = f.owner.evidence_links.source_dependencies.filter(x => x.id !== 'mobile-product')], ['unknown nested instance', f => { f.packet.variants[0].source_node.children[0].children.push({...node('I1008:1709;9:9', 'INSTANCE', 'unknown', 1, 1), main_component_id: '9:9', instance_properties: {}}); f.packet.capture_meta.node_count = 7; }], ['removed nested instance', f => { f.packet.variants[0].source_node.children[0].children = []; f.packet.capture_meta.node_count = 5; }], ['stale capture', f => f.session.canonical_git_sha = 'd'.repeat(40)]]) test(`Header artwork refuses ${name}`, () => { const f = fixture(); mutate(f); api(); assert.equal(all(f).relation.ok && all(f).context.ok, false); });

// Break protected: treating Shared provenance as an export gate hides a valid
// consumer-owned PNG boundary, or lets a forged owner-boundary report pass.
test('Header owner evidence is independent of Shared main variant and property provenance', () => {
  const f = fixture();
  const instances = [
    f.packet.variants[0].source_node.children[0],
    f.packet.variants[1].source_node.children[0],
    f.packet.variants[0].source_node.children[0].children[0],
    f.packet.variants[1].source_node.children[0].children[0]
  ];
  for (const instance of instances) {
    delete instance.main_component_id;
    instance.instance_properties = {Unexpected: {type: 'VARIANT', value: 'not-a-master', boundVariables: {}}};
  }
  for (const link of f.owner.evidence_links.source_dependencies) delete link.target.variant_id;
  const report = auditComponentEvidenceLinks({recordId: f.owner.id, model: f.model, session: f.session});
  assert.equal(report.ok, true);
  assert.ok(report.results.every(item => item.status === 'verified' && item.expected === item.source.node_id && item.actual === item.source.node_id));
  assert.ok(report.verified_sources.every(source => source.field_path === '/node_id'));
  assert.equal(all(f).relation.ok && all(f).context.ok, true);
  const impact = collectEvidenceConsumers({model: f.model, session: f.session, sourceComponentId: 'asset-header-logo-4x', reports: [report]});
  assert.deepEqual(impact.confirmed, []);
  assert.deepEqual(impact.possible, [{component_id: 'email-header', asset_owner_node_id: '1008:1823', asset_id: 'header-logo', via: [{component_id: 'email-header', link_id: 'desktop-header'}]}]);
});

test('Header owner report rejects a forged actual boundary without Shared capture', () => {
  const f = fixture();
  const report = auditComponentEvidenceLinks({recordId: f.owner.id, model: f.model, session: f.session});
  assert.equal(report.ok, true);
  const clean = collectEvidenceConsumers({model: f.model, session: f.session, sourceComponentId: 'asset-header-logo-4x', reports: [report]});
  assert.deepEqual(clean.confirmed, []);
  assert.equal(clean.possible.length, 1);
  const forged = clone(report);
  forged.results[0].actual = 'forged-owner-node';
  const impact = collectEvidenceConsumers({model: f.model, session: f.session, sourceComponentId: 'asset-header-logo-4x', reports: [forged]});
  assert.deepEqual(impact.confirmed, []);
  assert.ok(impact.issues.some(issue => issue.code === 'EVIDENCE_REPORT_CONTEXT_MISMATCH'));
});

for (const [name, mutate] of [
  ['wrong actual node', f => f.packet.variants[0].source_node.children[0].node_id = '1008:1710'],
  ['wrong actual name', f => f.packet.variants[0].source_node.children[0].name = 'wrong-logo @4x'],
  ['wrong actual type', f => f.packet.variants[0].source_node.children[0].node_type = 'FRAME'],
  ['hidden actual node', f => f.packet.variants[0].source_node.children[0].visible = false],
  ['broken nested ancestry', f => { const root = f.packet.variants[0].source_node; root.children.push(root.children[0].children.pop()); f.packet.capture_meta.node_count = 6; }],
  ['wrong actual boundary', f => f.owner.asset_contracts[0].export_boundary.semantic_node_name = 'other @4x']
]) test('Header owner evidence refuses '+name, () => {
  const f = fixture(); mutate(f);
  assert.equal(auditComponentEvidenceLinks({recordId: f.owner.id, model: f.model, session: f.session}).ok, false);
  assert.equal(all(f).relation.ok && all(f).context.ok, false);
});
