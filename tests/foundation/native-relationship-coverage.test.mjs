import assert from 'node:assert/strict';
import test from 'node:test';
import {auditFigmaContractFacts} from '../../scripts/lib/figma-contract-facts.mjs';
import {createContractProofEnvironment} from '../../scripts/lib/contract-fact-proofs.mjs';
import * as nativeFactProofs from '../../scripts/lib/native-fact-coverage.mjs';

const relationship = await import('../../scripts/lib/native-relationship-coverage.mjs').catch(error => {
  const expected = new URL('../../scripts/lib/native-relationship-coverage.mjs', import.meta.url).href;
  if (error?.code === 'ERR_MODULE_NOT_FOUND' && error.url === expected) return {};
  throw error;
});
const SHA = 'a'.repeat(40), NONCE = 'b'.repeat(64), REQUEST = 'c'.repeat(64);
const clone = value => structuredClone(value);
const selector = node_id => ({component_id: 'relationship-fixture', variant_node_id: '101:1', node_id});
function api() { for (const name of ['validateNativeRelationProofReferences', 'auditNativeRelationProofs', 'applyNativeRelationCoverage']) assert.equal(typeof relationship[name], 'function', `missing native relationship coverage API: ${name}`); return relationship; }
const dimensions = (node_id, width, height) => ({id: 'reference-size', value: {type: 'dimensions', width, height, unit: 'px'}, provenance: {kind: 'figma-literal', node_id}});
function element(id, semantic_role, render_mode, node_id, width, height, children = []) { return {id, semantic_role, render_mode, visibility: {mode: 'always'}, component_property_references: {}, facts: [dimensions(node_id, width, height)], children}; }
const links = (node_id, factPath) => ['width', 'height'].map(key => ({variant_node_id: '101:1', node_id, source_path: `/reference_dimensions/${key}`, contract_path: `${factPath}/value/${key}`, transform: 'identity'}));
function fixture() {
  const title = {node_id: '101:2', node_type: 'TEXT', name: 'text', visible: true, component_property_references: {}, reference_dimensions: {width: 88, height: 20, unit: 'px'}, children: []};
  const detail = {node_id: '101:3', node_type: 'FRAME', name: 'description', visible: true, component_property_references: {}, reference_dimensions: {width: 80, height: 16, unit: 'px'}, children: []};
  const root = {node_id: '101:1', node_type: 'COMPONENT', name: 'Viewport=Mobile, State=Default', visible: true, component_property_references: {}, reference_dimensions: {width: 120, height: 40, unit: 'px'}, children: [title, detail]};
  const rootContract = element('root', 'card', 'presentation-table', '101:1', 120, 40, [element('title', 'text', 'html-text', '101:2', 88, 20), element('detail', 'description', 'presentation-table', '101:3', 80, 16)]);
  const desktopRoot = clone(root); desktopRoot.node_id = '201:1'; desktopRoot.name = 'Viewport=Desktop, State=Default'; desktopRoot.children.forEach((node, index) => {node.node_id = `201:${index + 2}`;});
  const record = {id: 'relationship-fixture', identity: {library: 'service', node_kind: 'component-set', semantic_role: 'block', figma_name: 'Relationship fixture'}, figma: {file_key: 'native-file', node_id: '100:1'}, properties: [{id: 'show-description', figma_name: 'Show Description', type: 'boolean', default: true}], variants: [{id: 'mobile-default', node_id: '101:1', axes: [{name: 'Viewport', value: 'Mobile'}, {name: 'State', value: 'Default'}]}, {id: 'desktop-default', node_id: '201:1', axes: [{name: 'Viewport', value: 'Desktop'}, {name: 'State', value: 'Default'}]}], asset_contracts: [], contracts: {mobile: {root: rootContract}, desktop: {root: {id: 'root', facts: [], children: []}}, figma_fact_links: []}, evidence_links: {foundation_values: [], source_dependencies: [], fact_proofs: [], normative_decisions: [], native_fact_proofs: [], native_relation_proofs: [{id: 'root-structure', kind: 'element-structure', source: selector('101:1'), element_path: '/contracts/mobile/root'}, {id: 'title-structure', kind: 'element-structure', source: selector('101:2'), element_path: '/contracts/mobile/root/children/0'}, {id: 'detail-structure', kind: 'element-structure', source: selector('101:3'), element_path: '/contracts/mobile/root/children/1'}, {id: 'owner-controls', kind: 'owner-controls', source: selector('101:1'), default_variant_id: 'mobile-default'}]}};
  record.contracts.figma_fact_links.push(...links('101:1', '/contracts/mobile/root/facts/0'), ...links('101:2', '/contracts/mobile/root/children/0/facts/0'), ...links('101:3', '/contracts/mobile/root/children/1/facts/0'));
  const packet = {capture_version: '1.3.0', file_key: 'native-file', component_node_id: '100:1', capture_errors: [], owner_identity: {node_id: '100:1', node_type: 'COMPONENT_SET', name: 'Relationship fixture'}, component_properties: [{name: 'Show Description', type: 'BOOLEAN', default: true, variant_options: null}, {name: 'Viewport', type: 'VARIANT', default: 'Mobile', variant_options: ['Mobile', 'Desktop']}, {name: 'State', type: 'VARIANT', default: 'Default', variant_options: ['Default']}], capture_meta: {started_at: '2026-10-04T10:00:01.000Z', completed_at: '2026-10-04T10:00:02.000Z', tree_complete: true, node_count: 6, request: {session_nonce: NONCE, request_nonce: REQUEST, canonical_git_sha: SHA}}, variants: [{variant_node_id: '101:1', axes: [{name: 'Viewport', value: 'Mobile'}, {name: 'State', value: 'Default'}], source_node: root}, {variant_node_id: '201:1', axes: [{name: 'Viewport', value: 'Desktop'}, {name: 'State', value: 'Default'}], source_node: desktopRoot}]};
  const session = {schema_version: '1.1.0', canonical_git_sha: SHA, session_nonce: NONCE, started_at: '2026-10-04T10:00:00.000Z', completed_at: '2026-10-04T10:00:04.000Z', component_ids: [record.id], captures: [{component_id: record.id, receipt_id: 'receipt-rel', tool: 'use_figma', request_nonce: REQUEST, requested_at: '2026-10-04T10:00:01.000Z', received_at: '2026-10-04T10:00:03.000Z', packet}]};
  return {record, packet, session, model: {canonical_sha: SHA, records: [record], source_documents: new Map(), manifest: {sources: []}}};
}
function assertFixture(f) { const raw = auditFigmaContractFacts({record: f.record, live: f.packet}); assert.equal(raw.issues.some(i => ['FIGMA_CONTRACT_MISMATCH', 'CONTRACT_FACT_UNMAPPED'].includes(i.code)), false, 'basic direct mappings must validate before N2'); const env = createContractProofEnvironment(f.model, f.session); assert.equal(env.issues.length, 0, 'fixture must authenticate before N2'); env.tree(f.record.id); env.selected(selector('101:1')); assert.equal(env.issues.length, 0, 'lazy packet lookup must authenticate before N2'); return raw; }
function audit(f) { return api().auditNativeRelationProofs({record: f.record, model: f.model, session: f.session}); }
function reject(mutator) { const f = fixture(); assertFixture(f); mutator(f); assert.equal(audit(f).ok, false); }

test('N2 exposes APIs after the base fixture validates', () => { assertFixture(fixture()); api(); });
test('element structure accepts canonical root and child name, class, visibility, dimensions, and order', () => { assert.equal(audit(fixture()).ok, true); });
test('root rejects a noncanonical variant-axis name', () => reject(f => {f.packet.variants[0].source_node.name = 'Mobile';}));
test('each child proof rejects a wrong native class', () => reject(f => {f.packet.variants[0].source_node.children[0].node_type = 'FRAME';}));
test('each child proof rejects a nonsemantic native name', () => reject(f => {f.packet.variants[0].source_node.children[1].name = 'Detail layer';}));
test('reference-size requires exact typed dimensions', () => reject(f => {f.record.contracts.mobile.root.children[0].facts[0].id = 'width';}));
test('reference-size requires exact direct width and height links', () => reject(f => {f.record.contracts.figma_fact_links.pop();}));
test('reference-size requires same-node literal provenance', () => reject(f => {f.record.contracts.mobile.root.children[0].facts[0].provenance.node_id = '101:3';}));
test('children reject reordering', () => reject(f => {f.packet.variants[0].source_node.children.reverse();}));
test('children reject omission', () => reject(f => {f.packet.variants[0].source_node.children.pop();}));
test('children reject an extra node', () => reject(f => {f.packet.variants[0].source_node.children.push(clone(f.packet.variants[0].source_node.children[0]));}));
test('always visibility requires native true and empty property refs', () => reject(f => {f.packet.variants[0].source_node.children[0].visible = false;}));
test('property visibility accepts canonical Boolean property and exact normalized native ref', () => { const f = fixture(), child = f.record.contracts.mobile.root.children[1]; f.record.properties = [{id: 'show-description', figma_name: 'Show Description', type: 'boolean', default: true}]; child.visibility = {mode: 'property', property_id: 'show-description'}; f.packet.variants[0].source_node.children[1].component_property_references = {visible: 'Show Description#1:2'}; assert.equal(audit(f).ok, true); });
test('property visibility rejects a broken native reference', () => reject(f => {const child = f.record.contracts.mobile.root.children[1]; f.record.properties = [{id: 'show-description', figma_name: 'Show Description', type: 'boolean', default: true}]; child.visibility = {mode: 'property', property_id: 'show-description'}; f.packet.variants[0].source_node.children[1].component_property_references = {visible: 'Other#1:2'};}));
test('owner controls reject a Boolean default mismatch', () => reject(f => {f.packet.component_properties[0].default = false;}));
test('owner controls reject a duplicate capture definition', () => reject(f => {f.packet.component_properties.push(clone(f.packet.component_properties[0]));}));
test('owner controls reject a missing capture definition', () => reject(f => {f.packet.component_properties.splice(0, 1);}));
test('owner controls reject an extra capture definition', () => reject(f => {f.packet.component_properties.push({name: 'Future', type: 'BOOLEAN', default: false, variant_options: null});}));
test('owner controls reject wrong default variant axes', () => reject(f => {f.packet.component_properties[1].default = 'Desktop';}));
test('owner options ignore UI order but reject outside-domain option', () => { const f = fixture(); f.packet.component_properties[1].variant_options.reverse(); assert.equal(audit(f).ok, true); f.packet.component_properties[1].variant_options.push('Desktop'); assert.equal(audit(f).ok, false); });
test('metadata closes the initial two kinds and rejects extra shape keys', () => { const f = fixture(); f.record.evidence_links.native_relation_proofs[0].extra = true; assert.ok(api().validateNativeRelationProofReferences({records: [f.record]}).length); });
test('metadata rejects duplicate IDs globally across evidence arrays', () => { const f = fixture(); f.record.evidence_links.source_dependencies = [{id: 'root-structure'}]; assert.ok(api().validateNativeRelationProofReferences({records: [f.record]}).length); });
test('metadata rejects a foreign owner selector', () => { const f = fixture(); f.record.evidence_links.native_relation_proofs[0].source.component_id = 'foreign-owner'; assert.ok(api().validateNativeRelationProofReferences({records: [f.record]}).length); });
test('metadata rejects alternate variant-contract axes with a wrong viewport selector', () => { const f = fixture(); f.record.contracts.variant_contracts = [{axes: [{name: 'Viewport', value: 'Desktop'}], root: clone(f.record.contracts.mobile.root)}]; f.record.evidence_links.native_relation_proofs[0].element_path = '/contracts/variant_contracts/0/root'; assert.ok(api().validateNativeRelationProofReferences({records: [f.record]}).length); });
test('metadata accepts the valid mobile selector and source viewport', () => { const f = fixture(); assert.deepEqual(api().validateNativeRelationProofReferences({records: [f.record]}), []); });
test('authenticated coverage removes only verified mobile structural tuples and retains desktop and future raw obligations', () => { const f = fixture(), facts = assertFixture(f); f.packet.variants[1].source_node.future_field = true; const raw = auditFigmaContractFacts({record: f.record, live: f.packet}), coverage = audit(f), effective = api().applyNativeRelationCoverage({facts: raw, coverage, nativeFactProofs: {}, contractProofs: {}}); assert.ok(raw.issues.some(i => i.variant_node_id === '101:1' && ['/name', '/node_type', '/visible', '/children_order'].includes(i.source_path))); assert.equal(effective.issues.some(i => i.variant_node_id === '101:1' && ['/name', '/node_type', '/visible', '/children_order'].includes(i.source_path)), false); assert.ok(effective.issues.some(i => i.variant_node_id === '201:1')); assert.ok(effective.issues.some(i => i.source_path === '/future_field')); });
test('authenticated coverage rejects copied, fake, and cross-packet reports', () => { const f = fixture(), facts = assertFixture(f), coverage = audit(f); for (const bad of [clone(coverage), {ok: true, verified_sources: []}]) assert.equal(api().applyNativeRelationCoverage({facts, coverage: bad, nativeFactProofs: {}, contractProofs: {}}), facts); const other = clone(f.packet); other.variants[0].source_node.future_field = true; const otherFacts = auditFigmaContractFacts({record: f.record, live: other}); assert.equal(api().applyNativeRelationCoverage({facts: otherFacts, coverage, nativeFactProofs: {}, contractProofs: {}}), otherFacts); });
test('authenticated coverage rejects a report mutated after audit', () => { const f = fixture(), facts = assertFixture(f), coverage = audit(f); coverage.verified_sources?.push?.(selector('101:1')); assert.equal(api().applyNativeRelationCoverage({facts, coverage, nativeFactProofs: {}, contractProofs: {}}), facts); assert.equal(typeof nativeFactProofs.applyNativeFactCoverage, 'function'); });

test('html-link structure accepts only a same-node native TEXT element', () => {
  const f = fixture(), element = f.record.contracts.mobile.root.children[1], node = f.packet.variants[0].source_node.children[1];
  element.render_mode = 'html-link'; element.semantic_role = 'help-link'; node.node_type = 'TEXT'; node.name = 'help-link';
  assert.equal(audit(f).ok, true);
});

test('html-link structure rejects a FRAME masquerading as a link', () => {
  const f = fixture(), element = f.record.contracts.mobile.root.children[1], node = f.packet.variants[0].source_node.children[1];
  element.render_mode = 'html-link'; element.semantic_role = 'help-link'; node.name = 'help-link';
  assert.equal(audit(f).ok, false);
});

function imageFillFixture() {
  const f = fixture(), element = f.record.contracts.mobile.root.children[1], node = f.packet.variants[0].source_node.children[1];
  element.render_mode = 'direct-image'; element.semantic_role = 'hero-image'; element.asset_contract_id = 'hero-image'; element.children = [];
  node.node_type = 'FRAME'; node.name = 'hero-image @2x'; node.children = []; node.fills = [{type: 'image', visible: true, opacity: 1, image_hash: 'actual-test-hash'}];
  f.record.asset_contracts = [{id: 'hero-image', source_mode_id: 'image-fill', owner_layer_name: 'hero-image @2x', export_profile_id: 'jpeg-2x', export_boundary: {kind: 'fill', semantic_role: 'hero-image', export_scale: 2}}];
  return f;
}
test('owned image-fill direct-image accepts only its flat native FRAME boundary', () => {
  const f = imageFillFixture();
  assert.equal(audit(f).ok, true);
});
for (const [label, mutate] of [
  ['wrong asset', f => { f.record.contracts.mobile.root.children[1].asset_contract_id = 'other-image'; }],
  ['wrong source mode', f => { f.record.asset_contracts[0].source_mode_id = 'rendered-node'; }],
  ['wrong boundary', f => { f.record.asset_contracts[0].export_boundary.kind = 'node'; }],
  ['wrong owner name', f => { f.packet.variants[0].source_node.children[1].name = 'hero-image'; }],
  ['native child', f => { f.packet.variants[0].source_node.children[1].children = [{node_id: '101:99'}]; }],
]) test(`owned image-fill direct-image rejects ${label}`, () => { const f = imageFillFixture(); mutate(f); assert.equal(audit(f).ok, false); });

export {fixture};
