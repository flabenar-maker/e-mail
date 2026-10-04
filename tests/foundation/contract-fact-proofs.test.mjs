import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { auditFigmaContractFacts } from '../../scripts/lib/figma-contract-facts.mjs';

// Dynamic namespace import makes the pre-implementation RED an API failure, not an import error.
const proofsModule = await import('../../scripts/lib/contract-fact-proofs.mjs').catch(() => ({}));
const CAPTURE_PATH = new URL('../../scripts/figma/capture-contract-source.js', import.meta.url);
const SHA = 'a'.repeat(40);
const SESSION_NONCE = 'b'.repeat(64);
const nonce = (value) => value.toString(16).padStart(64, '0');

const apiNames = [
  'auditContractFactProofs',
  'validateContractFactProofReferences',
  'contractDecisionValueDigest',
  'contractDecisionContextDigest',
  'applyContractFactProofCoverage'
];
function api() {
  for (const name of apiNames) assert.equal(typeof proofsModule[name], 'function', `missing typed fact-proof API: ${name}`);
  return proofsModule;
}
const clone = (value) => structuredClone(value);

function sourceNode(nodeId, nodeType = 'COMPONENT', extra = {}) {
  return {
    node_id: nodeId, node_type: nodeType, name: `Synthetic ${nodeId}`,
    visible: true, opacity: 1,
    reference_dimensions: { width: 24, height: 24, unit: 'px' },
    fills: [{ type: 'solid', visible: true, opacity: 1, color: '#F3F3F5' }],
    layout: { mode: 'HORIZONTAL', horizontal_sizing: 'FIXED', vertical_sizing: 'HUG', padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    children: [],
    ...extra
  };
}
function capture(componentId, componentNodeId, variants, requestNonce, options = {}) {
  const nodeCount = variants.reduce((total, variant) => total + countNodes(variant.source_node), 0);
  return {
    component_id: componentId,
    receipt_id: `receipt-${componentId}-${requestNonce.slice(-2)}`,
    tool: 'use_figma', request_nonce: requestNonce,
    requested_at: '2026-10-03T10:00:01.000Z', received_at: '2026-10-03T10:00:03.000Z',
    packet: {
      capture_version: options.capture_version ?? '1.3.0', file_key: options.file_key ?? 'synthetic-file', component_node_id: componentNodeId,
      component_properties: [], capture_errors: [],
      capture_meta: { started_at: '2040-01-01T10:00:01.000Z', completed_at: '2040-01-01T10:00:02.000Z', tree_complete: true, node_count: nodeCount, request: { session_nonce: SESSION_NONCE, request_nonce: requestNonce, canonical_git_sha: SHA } },
      owner_identity: { node_id: componentNodeId, node_type: options.owner_type ?? 'COMPONENT_SET', name: options.owner_name ?? `Synthetic ${componentId}` },
      variants
    }
  };
}
function countNodes(node) { return 1 + (node.children ?? []).reduce((total, child) => total + countNodes(child), 0); }
// Fixtures begin as independently native facts.  A proof test explicitly marks
// only its selected target as contract-proof, mirroring canonical records.
function fact(id, value, provenance = { kind: 'figma-literal', node_id: '101:1' }) { return { id, value, provenance }; }
function pointer(root, path) {
  return path.split('/').slice(1).reduce((value, segment) => value?.[segment], root);
}

function baseFixture() {
  const sourceVariants = [
    { id: 'product-one', node_id: '101:1', axes: [{ name: 'Product', value: 'One' }] },
    { id: 'product-two', node_id: '101:2', axes: [{ name: 'Product', value: 'Two' }] }
  ];
  const record = {
    id: 'synthetic-asset', identity: { library: 'shared', semantic_role: 'asset', node_kind: 'component-set', figma_name: 'Synthetic Asset @4x' },
    figma: { file_key: 'synthetic-file', node_id: '100:1' }, variants: sourceVariants,
    asset_contracts: [{ id: 'synthetic-image', owner_layer_name: 'synthetic-image @4x', source_viewport: 'mobile', display_mode_id: 'direct-image', export_profile_id: 'png-4x' }],
    contracts: {
      mobile: { root: { semantic_role: 'asset', render_mode: 'figma-source-only', facts: [
        fact('protective-background-color', { type: 'color', value: '#F3F3F5' }),
        fact('native-size', { type: 'dimensions', width: 24, height: 24, unit: 'px' }),
        fact('asset-reference', { type: 'asset-reference', asset_contract_id: 'synthetic-image' }),
        fact('figma-style-id', { type: 'string', value: 'S:synthetic,' }, { kind: 'figma-literal', node_id: '101:1' }),
        fact('background-gradient-css-angle-degrees', { type: 'number', value: 25 })
      ], children: [{ id: 'mobile-image', semantic_role: 'image', render_mode: 'direct-image', asset_contract_id: 'synthetic-image', facts: [fact('height-behavior', { type: 'keyword', value: 'auto' })], children: [] }] } },
      desktop: { root: { semantic_role: 'asset', render_mode: 'figma-source-only', facts: [], children: [{ id: 'desktop-card', semantic_role: 'card', render_mode: 'presentation-table', facts: [], children: [{ id: 'desktop-content', semantic_role: 'content', render_mode: 'slot', facts: [], children: [] }, { id: 'desktop-image', semantic_role: 'image', render_mode: 'direct-image', asset_contract_id: 'synthetic-image', facts: [fact('height-behavior', { type: 'keyword', value: 'content-driven-cover' })], children: [] }] }] } }
    },
    evidence_links: { foundation_values: [], source_dependencies: [], fact_proofs: [], normative_decisions: [] }
  };
  // Keep figma links in the canonical contracts wrapper, as existing inputs do.
  record.contracts.figma_fact_links = [];
  const sourceOne = sourceNode('101:1');
  const sourceTwo = sourceNode('101:2');
  const mobileImage = sourceNode('200:1', 'FRAME', { reference_dimensions: { width: 296, height: 190, unit: 'px' }, fills: [{ type: 'image', visible: true, opacity: 1, image_hash: 'synthetic-image' }], layout: { mode: 'HORIZONTAL', horizontal_sizing: 'FILL', vertical_sizing: 'FIXED', padding: { top: 0, right: 0, bottom: 0, left: 0 } } });
  const content = sourceNode('300:2', 'FRAME', { reference_dimensions: { width: 300, height: 238, unit: 'px' }, layout: { mode: 'HORIZONTAL', horizontal_sizing: 'FIXED', vertical_sizing: 'HUG', padding: { top: 0, right: 0, bottom: 0, left: 0 } } });
  const desktopImage = sourceNode('300:3', 'FRAME', { reference_dimensions: { width: 252, height: 238, unit: 'px' }, fills: [{ type: 'image', visible: true, opacity: 1, image_hash: 'synthetic-image' }], layout: { mode: 'HORIZONTAL', horizontal_sizing: 'FIXED', vertical_sizing: 'FILL', padding: { top: 0, right: 0, bottom: 0, left: 0 } } });
  const card = sourceNode('300:1', 'FRAME', { layout: { mode: 'HORIZONTAL', horizontal_sizing: 'FIXED', vertical_sizing: 'HUG', padding: { top: 0, right: 0, bottom: 0, left: 0 } }, children: [content, desktopImage] });
  const gradient = sourceNode('101:1', 'COMPONENT', { fills: [{ type: 'gradient_linear', visible: true, opacity: 1, gradient_stops: [{ position: 0, color: '#18B037', alpha: 1 }, { position: 1, color: '#3DD55C', alpha: 1 }], gradient_transform: [[1, 0, 0], [0, 1, 0]] }] });
  const model = {
    canonical_sha: SHA, records: [record], manifest: { sources: [] }, targets: new Map(),
    source_documents: new Map([
      ['assets-foundation', { display_modes: [{ id: 'direct-image' }, { id: 'fill-image' }], export_profiles: [{ id: 'png-4x' }] }],
      ['typography-foundation', { styles: [{ id: 'mobile-body', figma_style_id: 'S:synthetic,', figma_name: 'Mobile/Body', viewport: 'mobile', font: { family: 'Roboto', figma_style: 'Regular', css_weight: 400 }, font_size_px: 14, letter_spacing: { unit: 'pixels', value: 0 }, line_height: { unit: 'percent', value: 140 } }] }]
    ])
  };
  const session = {
    schema_version: '1.1.0', canonical_git_sha: SHA, session_nonce: SESSION_NONCE,
    started_at: '2026-10-03T10:00:00.000Z', completed_at: '2026-10-03T10:00:04.000Z', component_ids: [record.id],
    captures: [capture(record.id, '100:1', [
      { variant_node_id: '101:1', axes: clone(sourceVariants[0].axes), source_node: sourceOne },
      { variant_node_id: '101:2', axes: clone(sourceVariants[1].axes), source_node: sourceTwo },
    ], nonce(1), { owner_type: 'COMPONENT_SET', owner_name: 'Synthetic Asset @4x' })]
  };
  return { record, model, session, sourceOne, sourceTwo, mobileImage, card, content, desktopImage };
}

function imagePolicyFixture(mode = 'auto') {
  const f = baseFixture();
  const mobileVariant = { id: 'mobile', node_id: '210:1', axes: [{ name: 'Viewport', value: 'Mobile' }] };
  const desktopVariant = { id: 'desktop', node_id: '210:2', axes: [{ name: 'Viewport', value: 'Desktop' }] };
  const mobileImage = sourceNode('210:3', 'FRAME', { reference_dimensions: { width: 296, height: 190, unit: 'px' }, fills: [{ type: 'image', visible: true, opacity: 1, image_hash: 'synthetic-image', scale_mode: 'FILL' }], layout: { mode: 'HORIZONTAL', horizontal_sizing: 'FILL', vertical_sizing: 'FIXED', padding: { top: 0, right: 0, bottom: 0, left: 0 } } });
  const mobileRoot = sourceNode('210:1', 'COMPONENT', { children: [mobileImage] });
  const desktopRoot = sourceNode('210:2', 'COMPONENT');
  f.record.variants = [mobileVariant, desktopVariant];
  f.record.contracts = { mobile: { root: { semantic_role: 'asset', render_mode: 'presentation-table', facts: [], children: [{ id: 'mobile-image', semantic_role: 'image', render_mode: 'direct-image', asset_contract_id: 'synthetic-image', facts: [fact('reference-size', { type: 'dimensions', width: 296, height: 190, unit: 'px' }, { kind: 'figma-literal', node_id: '210:3' }), fact('height-behavior', { type: 'keyword', value: 'auto' })], children: [] }] } }, desktop: { root: { semantic_role: 'asset', render_mode: 'presentation-table', facts: [], children: [] } } };
  f.record.contracts.figma_fact_links = [
    { variant_node_id: '210:1', node_id: '210:3', source_path: '/reference_dimensions/width', contract_path: '/contracts/mobile/root/children/0/facts/0/value/width', transform: 'identity' },
    { variant_node_id: '210:1', node_id: '210:3', source_path: '/reference_dimensions/height', contract_path: '/contracts/mobile/root/children/0/facts/0/value/height', transform: 'identity' }
  ];
  f.model.records = [f.record];
  f.model.source_documents.set('assets-foundation', { display_modes: [{ id: 'direct-image', contract: { mobile_height_behavior: 'auto', intrinsic_ratio_required: true, deformation_forbidden: true, crop_owner: 'asset' } }], export_profiles: [{ id: 'png-4x', contract: { suffix: '@4x', scale: 4 } }] });
  f.session.component_ids = [f.record.id];
  f.session.captures = [capture(f.record.id, '100:1', [{ variant_node_id: '210:1', axes: clone(mobileVariant.axes), source_node: mobileRoot }, { variant_node_id: '210:2', axes: clone(desktopVariant.axes), source_node: desktopRoot }], nonce(21), { owner_type: 'COMPONENT_SET', owner_name: 'Synthetic Asset @4x' })];
  return { ...f, mobileImage };
}

function coverPolicyFixture() {
  const f = imagePolicyFixture();
  const mobileVariant = f.record.variants[0], desktopVariant = f.record.variants[1];
  const content = sourceNode('220:2', 'FRAME', { reference_dimensions: { width: 300, height: 238, unit: 'px' }, layout: { mode: 'HORIZONTAL', horizontal_sizing: 'FIXED', vertical_sizing: 'HUG', padding: { top: 0, right: 0, bottom: 0, left: 0 } } });
  const image = sourceNode('220:3', 'FRAME', { reference_dimensions: { width: 252, height: 238, unit: 'px' }, fills: [{ type: 'image', visible: true, opacity: 1, image_hash: 'synthetic-image', scale_mode: 'FILL' }], layout: { mode: 'HORIZONTAL', horizontal_sizing: 'FIXED', vertical_sizing: 'FILL', padding: { top: 0, right: 0, bottom: 0, left: 0 } } });
  const card = sourceNode('220:1', 'FRAME', { layout: { mode: 'HORIZONTAL', horizontal_sizing: 'FIXED', vertical_sizing: 'HUG', padding: { top: 0, right: 0, bottom: 0, left: 0 } }, children: [content, image] });
  const desktopRoot = sourceNode('210:2', 'COMPONENT', { children: [card] });
  f.record.asset_contracts[0].display_mode_id = 'fill-image';
  f.record.contracts.desktop.root = { semantic_role: 'card', render_mode: 'presentation-table', facts: [], children: [{ id: 'card', semantic_role: 'card', render_mode: 'presentation-table', facts: [], children: [{ id: 'content', semantic_role: 'content', render_mode: 'slot', facts: [], children: [] }, { id: 'desktop-image', semantic_role: 'image', render_mode: 'direct-image', asset_contract_id: 'synthetic-image', facts: [fact('reference-size', { type: 'dimensions', width: 252, height: 238, unit: 'px' }, { kind: 'figma-literal', node_id: '220:3' }), fact('height-behavior', { type: 'keyword', value: 'content-driven-cover' })], children: [] }] }] };
  f.record.contracts.figma_fact_links.push({ variant_node_id: '210:2', node_id: '220:3', source_path: '/reference_dimensions/width', contract_path: '/contracts/desktop/root/children/0/children/1/facts/0/value/width', transform: 'identity' }, { variant_node_id: '210:2', node_id: '220:3', source_path: '/reference_dimensions/height', contract_path: '/contracts/desktop/root/children/0/children/1/facts/0/value/height', transform: 'identity' });
  f.model.source_documents.set('assets-foundation', { display_modes: [{ id: 'fill-image', contract: { mobile_height_behavior: 'auto', intrinsic_ratio_required: true, deformation_forbidden: true, crop_owner: 'html-wrapper' } }], export_profiles: [{ id: 'png-4x', contract: { suffix: '@4x', scale: 4 } }] });
  f.session.captures = [capture(f.record.id, '100:1', [{ variant_node_id: mobileVariant.node_id, axes: clone(mobileVariant.axes), source_node: sourceNode('210:1', 'COMPONENT') }, { variant_node_id: desktopVariant.node_id, axes: clone(desktopVariant.axes), source_node: desktopRoot }], nonce(22), { owner_type: 'COMPONENT_SET', owner_name: 'Synthetic Asset @4x' })];
  return { ...f, card, content, desktopImage: image };
}

function buttonGradientFixture() {
  const f = baseFixture();
  const mobile = { id: 'mobile', node_id: '230:1', axes: [{ name: 'Viewport', value: 'Mobile' }] }, desktop = { id: 'desktop', node_id: '230:2', axes: [{ name: 'Viewport', value: 'Desktop' }] };
  const gradient = sourceNode('230:1', 'COMPONENT', { fills: [{ type: 'gradient_linear', visible: true, opacity: 1, gradient_stops: [{ position: 0, color: '#18B037', alpha: 1 }, { position: 1, color: '#3DD55C', alpha: 1 }], gradient_transform: [[1, 0, 0], [0, 1, 0]] }] });
  f.record.identity = { ...f.record.identity, library: 'shared', semantic_role: 'button', node_kind: 'component-set', figma_name: 'Synthetic/Button' };
  f.record.variants = [mobile, desktop];
  f.record.contracts = { mobile: { root: { id: 'button-root', semantic_role: 'button', render_mode: 'presentation-table', facts: [fact('background-gradient-css-angle-degrees', { type: 'number', value: 25 })], children: [] } }, desktop: { root: { id: 'button-root', semantic_role: 'button', render_mode: 'presentation-table', facts: [], children: [] }, figma_fact_links: [] } };
  f.model.records = [f.record]; f.session.component_ids = [f.record.id]; f.session.captures = [capture(f.record.id, '100:1', [{ variant_node_id: mobile.node_id, axes: clone(mobile.axes), source_node: gradient }, { variant_node_id: desktop.node_id, axes: clone(desktop.axes), source_node: sourceNode('230:2', 'COMPONENT') }], nonce(23), { owner_type: 'COMPONENT_SET', owner_name: 'Synthetic/Button' })];
  return f;
}

function verifiedStyleFixture() {
  const f = baseFixture();
  f.record.variants = [{ id: 'mobile', node_id: '101:1', axes: [{ name: 'Viewport', value: 'Mobile' }] }, { id: 'desktop', node_id: '101:2', axes: [{ name: 'Viewport', value: 'Desktop' }] }];
  f.session.captures[0].packet.variants.forEach((variant, index) => { variant.axes = clone(f.record.variants[index].axes); });
  const text = sourceNode('101:3', 'TEXT', { characters: 'Help', text_style: { figma_style_id: 'S:synthetic,', figma_style_name: 'Mobile/Body', font_size_px: 14, font_weight: 400, letter_spacing: { unit: 'PIXELS', value: 0 }, line_height: { unit: 'PERCENT', value: 140 } }, styled_text_segments: [{ start: 0, end: 4, characters: 'Help', font_family: 'Roboto', font_style: 'Regular', font_size_px: 14, letter_spacing: { unit: 'PIXELS', value: 0 }, line_height: { unit: 'PERCENT', value: 140 } }] });
  f.session.captures[0].packet.variants[0].source_node.children = [text];
  f.record.contracts.mobile.root.children = [{ id: 'style-text', semantic_role: 'text', render_mode: 'text', facts: [fact('figma-style-id', { type: 'string', value: 'S:synthetic,' }, { kind: 'figma-literal', node_id: '101:3' }), fact('styled-text-segments', { type: 'segments', items: clone(text.styled_text_segments) }, { kind: 'figma-literal', node_id: '101:3' })], children: [] }];
  f.record.contracts.figma_fact_links = [{ variant_node_id: '101:1', node_id: '101:3', source_path: '/text_style/figma_style_id', contract_path: '/contracts/mobile/root/children/0/facts/0/value/value', transform: 'identity' }];
  recount(f);
  setProof(f, { id: 'proof-style', kind: 'style-usage', contract_path: '/contracts/mobile/root/children/0/facts/0/value', source: { component_id: f.record.id, variant_node_id: '101:1', node_id: '101:3' } }, { preserveProvenance: true });
  return { f, text };
}

function verifiedGradientFixture() {
  const f = buttonGradientFixture();
  const contractPath = '/contracts/mobile/root/facts/0/value';
  const source = { component_id: f.record.id, variant_node_id: '230:1', node_id: '230:1' };
  const value_sha256 = api().contractDecisionValueDigest({ record: f.record, contractPath });
  const context_sha256 = api().contractDecisionContextDigest({ selector: source, paintIndex: 0, model: f.model, session: f.session });
  f.record.evidence_links.normative_decisions = [{ id: 'decision-angle', kind: 'css-linear-gradient-angle', owner_id: f.record.id, targets: [{ viewport: 'mobile', element_id: 'button-root', fact_id: 'background-gradient-css-angle-degrees', contract_path: contractPath, value_sha256, context_sha256, source, paint_index: 0 }], authorization: { user_instruction: 'По кнопке: делай 25 градусов точным значением', scope: { owner_id: f.record.id, contract_paths: [contractPath] }, approved_spec: { path: 'docs/superpowers/specs/2026-10-03-cupis-contract-fact-proof-design.md', git_sha: SHA } } }];
  setProof(f, { id: 'proof-angle', kind: 'approved-css-gradient-angle', contract_path: contractPath, source, paint_index: 0, decision_id: 'decision-angle' });
  return { f, contractPath, source };
}

function reportFor(fixture) { return api().auditContractFactProofs({ record: fixture.record, model: fixture.model, session: fixture.session }); }
function proofResult(report, proofId) { return report.results.find((item) => item.proof_id === proofId); }
function assertVerified(fixture, proofId) { const report = reportFor(fixture); assert.equal(proofResult(report, proofId)?.status, 'verified', JSON.stringify(report)); return report; }
function assertUnverified(fixture, proofId, marker) { const report = reportFor(fixture); assert.notEqual(proofResult(report, proofId)?.status, 'verified'); assert.match(JSON.stringify(report), marker); }
function setProof(fixture, proof, { preserveProvenance = false } = {}) {
  fixture.record.evidence_links.fact_proofs = [proof];
  const target = pointer(fixture.record, proof.contract_path);
  assert.ok(target && typeof target === 'object', `proof target must exist: ${proof.contract_path}`);
  const factNode = pointer(fixture.record, proof.contract_path.replace(/\/value$/u, ''));
  assert.ok(factNode?.id, `proof must target a fact value: ${proof.contract_path}`);
  if (!preserveProvenance) factNode.provenance = { kind: 'contract-proof', proof_id: proof.id };
}
function recount(fixture) {
  for (const capture of fixture.session.captures) capture.packet.capture_meta.node_count = capture.packet.variants.reduce((total, variant) => total + countNodes(variant.source_node), 0);
}

function consumerChainFixture() {
  const f = baseFixture();
  const source = f.record, asset = f.record.asset_contracts[0];
  source.contracts.mobile.root.facts[1] = fact('consumer-display-size', { type: 'dimensions', width: 212, height: 33, unit: 'px' });
  source.variants.forEach(v => v.axes = [{ name: 'Product', value: v.id === 'product-one' ? 'One' : 'Two' }]);
  const product = { id: 'synthetic-product', identity: { library: 'shared', semantic_role: 'asset', node_kind: 'component-set', figma_name: 'Synthetic Product' }, figma: { file_key: 'synthetic-file', node_id: '600:1' }, properties: [], variants: [{ id: 'product-one', node_id: '601:1', axes: [{ name: 'Product', value: 'One' }] }, { id: 'product-two', node_id: '601:2', axes: [{ name: 'Product', value: 'Two' }] }], asset_contracts: [], contracts: { mobile: { root: { render_mode: 'figma-source-only', facts: [], children: [] } }, desktop: { root: { render_mode: 'figma-source-only', facts: [], children: [] } }, figma_fact_links: [] }, evidence_links: { foundation_values: [], source_dependencies: [], fact_proofs: [], normative_decisions: [] } };
  const compact = {
    id: 'synthetic-compact', identity: { library: 'shared', semantic_role: 'asset', node_kind: 'component-set', figma_name: 'Synthetic Compact' }, figma: { file_key: 'synthetic-file', node_id: '400:1' }, properties: [],
    variants: [{ id: 'product-one', node_id: '401:1', axes: [{ name: 'Product', value: 'One' }] }, { id: 'product-two', node_id: '401:2', axes: [{ name: 'Product', value: 'Two' }] }], asset_contracts: [],
    contracts: { mobile: { root: { render_mode: 'figma-source-only', facts: [], children: [] } }, desktop: { root: { render_mode: 'figma-source-only', facts: [], children: [] } }, figma_fact_links: [] },
    evidence_links: { foundation_values: [], source_dependencies: [{ id: 'compact-product-one', source: { variant_node_id: '401:1', node_id: '401:10' }, target: { component_id: product.id, variant_id: 'product-one' }, asset_owner: { node_id: '401:1' } }, { id: 'compact-product-two', source: { variant_node_id: '401:2', node_id: '401:20' }, target: { component_id: product.id, variant_id: 'product-two' }, asset_owner: { node_id: '401:2' } }], fact_proofs: [], normative_decisions: [] }
  };
  const header = {
    id: 'synthetic-header', identity: { semantic_role: 'email', node_kind: 'component-set' }, figma: { file_key: 'synthetic-file', node_id: '500:1' },
    variants: [{ id: 'mobile', node_id: '501:1', axes: [{ name: 'Viewport', value: 'Mobile' }] }, { id: 'desktop', node_id: '501:2', axes: [{ name: 'Viewport', value: 'Desktop' }] }],
    asset_contracts: [clone(asset)],
    contracts: { mobile: { root: { render_mode: 'presentation-table', facts: [], children: [{ id: 'mobile-image', semantic_role: 'image', render_mode: 'direct-image', asset_contract_id: 'synthetic-image', facts: [fact('reference-size', { type: 'dimensions', width: 212, height: 33, unit: 'px' }, { kind: 'figma-literal', node_id: '501:3' })], children: [] }] } }, desktop: { root: { render_mode: 'presentation-table', facts: [], children: [{ id: 'desktop-image', semantic_role: 'image', render_mode: 'direct-image', asset_contract_id: 'synthetic-image', facts: [fact('reference-size', { type: 'dimensions', width: 322, height: 50, unit: 'px' }, { kind: 'figma-literal', node_id: '501:4' })], children: [] }] } }, figma_fact_links: [] },
    evidence_links: { foundation_values: [], source_dependencies: [
      { id: 'mobile-compact', source: { variant_node_id: '501:1', node_id: '501:3' }, target: { component_id: compact.id, variant_id: 'product-one' }, asset_owner: { node_id: '501:3', asset_id: 'synthetic-image' } }, { id: 'mobile-product', source: { variant_node_id: '501:1', node_id: 'I501:3;401:10' }, target: { component_id: product.id, variant_id: 'product-one' }, asset_owner: { node_id: '501:3', asset_id: 'synthetic-image' } }, { id: 'desktop-ordinary', source: { variant_node_id: '501:2', node_id: '501:4' }, target: { component_id: source.id, variant_id: 'product-one' }, asset_owner: { node_id: '501:4', asset_id: 'synthetic-image' } }, { id: 'desktop-product', source: { variant_node_id: '501:2', node_id: 'I501:4;101:10' }, target: { component_id: product.id, variant_id: 'product-one' }, asset_owner: { node_id: '501:4', asset_id: 'synthetic-image' } }
    ], fact_proofs: [], normative_decisions: [] }
  };
  source.evidence_links.source_dependencies = [{ id: 'ordinary-product-one', source: { variant_node_id: '101:1', node_id: '101:10' }, target: { component_id: product.id, variant_id: 'product-one' }, asset_owner: { node_id: '101:1', asset_id: 'synthetic-image' } }, { id: 'ordinary-product-two', source: { variant_node_id: '101:2', node_id: '101:20' }, target: { component_id: product.id, variant_id: 'product-two' }, asset_owner: { node_id: '101:2', asset_id: 'synthetic-image' } }];
  const productRoots = ['601:1','601:2'].map(id => sourceNode(id, 'COMPONENT'));
  const sourceRoots = ['101:1','101:2'].map((id,i) => sourceNode(id, 'COMPONENT', { reference_dimensions: { width: 322, height: 50, unit: 'px' }, children: [sourceNode(i ? '101:20' : '101:10', 'INSTANCE', { main_component_id: productRoots[i].node_id, instance_properties: { Product: { type: 'VARIANT', value: i ? 'Two' : 'One', boundVariables: {} } } })] }));
  const compactRoots = ['401:1','401:2'].map((id,i) => sourceNode(id, 'COMPONENT', { reference_dimensions: { width: 212, height: 33, unit: 'px' }, children: [sourceNode(i ? '401:20' : '401:10', 'INSTANCE', { main_component_id: productRoots[i].node_id, instance_properties: { Product: { type: 'VARIANT', value: i ? 'Two' : 'One', boundVariables: {} } } })] }));
  const headerRoots = [sourceNode('501:1','COMPONENT',{children:[sourceNode('501:3','INSTANCE',{main_component_id:'401:1',instance_properties:{Product:{type:'VARIANT',value:'One',boundVariables:{}}},reference_dimensions:{width:212,height:33,unit:'px'},children:[sourceNode('I501:3;401:10','INSTANCE',{main_component_id:'601:1',instance_properties:{Product:{type:'VARIANT',value:'One',boundVariables:{}}}})]})]}), sourceNode('501:2','COMPONENT',{children:[sourceNode('501:4','INSTANCE',{main_component_id:'101:1',instance_properties:{Product:{type:'VARIANT',value:'One',boundVariables:{}}},reference_dimensions:{width:322,height:50,unit:'px'},children:[sourceNode('I501:4;101:10','INSTANCE',{main_component_id:'601:1',instance_properties:{Product:{type:'VARIANT',value:'One',boundVariables:{}}}})]})]})];
  for (const [variant,node] of header.variants.map((v,i)=>[v,i])) for (const dim of ['width','height']) header.contracts.figma_fact_links.push({ variant_node_id: header.variants[node].node_id, node_id: node ? '501:4' : '501:3', source_path: `/reference_dimensions/${dim}`, contract_path: `/contracts/${node ? 'desktop' : 'mobile'}/root/children/0/facts/0/value/${dim}`, transform: 'identity' });
  f.model.records = [source, compact, header, product];
  f.model.source_documents = new Map(f.model.source_documents);
  f.session.component_ids = [source.id, compact.id, header.id, product.id];
  f.session.captures = [
    capture(source.id, '100:1', source.variants.map((v,i)=>({variant_node_id:v.node_id,axes:clone(v.axes),source_node:sourceRoots[i]})), nonce(11), { owner_name: 'Synthetic Asset @4x' }), capture(compact.id, '400:1', compact.variants.map((v,i)=>({variant_node_id:v.node_id,axes:clone(v.axes),source_node:compactRoots[i]})), nonce(12), { owner_name: 'Synthetic Compact' }), capture(header.id, '500:1', header.variants.map((v,i)=>({variant_node_id:v.node_id,axes:clone(v.axes),source_node:headerRoots[i]})), nonce(13), { owner_name: 'Synthetic Header' }), capture(product.id, '600:1', product.variants.map((v,i)=>({variant_node_id:v.node_id,axes:clone(v.axes),source_node:productRoots[i]})), nonce(14), { owner_name: 'Synthetic Product' })
  ];
  f.record = source;
  return f;
}

function verifiedColorProofFixture({ prepare } = {}) {
  const f = baseFixture();
  setProof(f, { id: 'proof-protective-background-color', kind: 'source-value-set', contract_path: '/contracts/mobile/root/facts/0/value', sources: [{ component_id: f.record.id, variant_node_id: '101:1', node_id: '101:1' }, { component_id: f.record.id, variant_node_id: '101:2', node_id: '101:2' }], field: 'color' });
  prepare?.(f);
  return { f, proof: assertVerified(f, 'proof-protective-background-color') };
}

function verifiedConsumerProofFixture() {
  const f = consumerChainFixture();
  setProof(f, { id: 'proof-consumer', kind: 'consumer-geometry', contract_path: '/contracts/mobile/root/facts/1/value', consumer_component_id: 'synthetic-header', asset_contract_id: 'synthetic-image', placements: { mobile: { component_id: 'synthetic-header', variant_node_id: '501:1', node_id: '501:3' }, desktop: { component_id: 'synthetic-header', variant_node_id: '501:2', node_id: '501:4' } } });
  return { f, proof: assertVerified(f, 'proof-consumer') };
}

test('exports the complete typed fact-proof API', () => { api(); });

test('source-value-set verifies all registered own source variants for an exact color fact', () => {
  const f = baseFixture(); setProof(f, { id: 'proof-protective-background-color', kind: 'source-value-set', contract_path: '/contracts/mobile/root/facts/0/value', sources: [{ component_id: f.record.id, variant_node_id: '101:1', node_id: '101:1' }, { component_id: f.record.id, variant_node_id: '101:2', node_id: '101:2' }], field: 'color' }); assertVerified(f, 'proof-protective-background-color');
});
test('source-value-set rejects wrong node, file, missing canonical variant, and raw color mismatch', () => {
  for (const change of [
    (f) => { f.record.evidence_links.fact_proofs[0].sources[0].node_id = '101:99'; },
    (f) => { f.session.captures[0].packet.file_key = 'foreign-file'; },
    (f) => { f.record.variants.push({ id: 'product-three', node_id: '101:3', axes: [{ name: 'Product', value: 'Three' }] }); },
    (f) => { f.session.captures[0].packet.variants[0].source_node.fills[0].color = '#000000'; }
  ]) { const f = baseFixture(); setProof(f, { id: 'proof-protective-background-color', kind: 'source-value-set', contract_path: '/contracts/mobile/root/facts/0/value', sources: [{ component_id: f.record.id, variant_node_id: '101:1', node_id: '101:1' }, { component_id: f.record.id, variant_node_id: '101:2', node_id: '101:2' }], field: 'color' }); change(f); assertUnverified(f, 'proof-protective-background-color', /node|file|variant|mismatch|identity/i); }
});
test('source-value-set requires a Shared asset/icon owner and complete Product-only variants', () => {
  for (const change of [
    (f) => { f.record.identity.library = 'marketing'; },
    (f) => { f.record.identity.semantic_role = 'email'; },
    (f) => { f.record.variants[1].axes = [{ name: 'Viewport', value: 'Desktop' }]; },
  ]) {
    const f = baseFixture();
    setProof(f, { id: 'proof-protective-background-color', kind: 'source-value-set', contract_path: '/contracts/mobile/root/facts/0/value', sources: [{ component_id: f.record.id, variant_node_id: '101:1', node_id: '101:1' }, { component_id: f.record.id, variant_node_id: '101:2', node_id: '101:2' }], field: 'color' });
    change(f);
    assertUnverified(f, 'proof-protective-background-color', /shared|asset|icon|product|variant/i);
  }
});
test('source-value-set rejects altered request/receipt and incomplete-tree packet admissions', () => {
  for (const change of [
    (f) => { f.session.captures[0].packet.capture_meta.request.request_nonce = nonce(97); },
    (f) => { f.session.captures[0].receipt_id = ''; },
    (f) => { const duplicate = clone(f.session.captures[0]); duplicate.request_nonce = nonce(98); duplicate.packet.capture_meta.request.request_nonce = nonce(98); f.session.captures.push(duplicate); },
    (f) => { f.session.captures[0].packet.capture_meta.tree_complete = false; },
    (f) => { f.session.captures[0].packet.capture_meta.node_count += 1; }
  ]) {
    const { f } = verifiedColorProofFixture();
    change(f);
    assertUnverified(f, 'proof-protective-background-color', /request|receipt|tree|node.count|capture|identity/i);
  }
});
test('consumer-geometry requires the full source-to-consumer dependency and exact owned asset placement', () => {
  const f = consumerChainFixture(); setProof(f, { id: 'proof-consumer', kind: 'consumer-geometry', contract_path: '/contracts/mobile/root/facts/1/value', consumer_component_id: 'synthetic-header', asset_contract_id: 'synthetic-image', placements: { mobile: { component_id: 'synthetic-header', variant_node_id: '501:1', node_id: '501:3' }, desktop: { component_id: 'synthetic-header', variant_node_id: '501:2', node_id: '501:4' } } }); assertVerified(f, 'proof-consumer');
});
test('consumer-geometry permits owner-only evidence when Shared identity packets are absent', () => {
  const { f } = verifiedConsumerProofFixture();
  f.session.captures = f.session.captures.filter((capture) => !['synthetic-product', 'synthetic-compact'].includes(capture.component_id));
  assertVerified(f, 'proof-consumer');
});
test('consumer-geometry rejects invalid Product variant, actual instance identity, and asset ownership', () => {
  for (const change of [
    (f) => { f.model.records.find((record) => record.id === 'synthetic-product').variants.pop(); },
    (f) => { f.session.captures.find((capture) => capture.component_id === 'synthetic-header').packet.variants[0].source_node.children[0].children[0].main_component_id = '601:2'; },
    (f) => { f.model.records.find((record) => record.id === 'synthetic-header').evidence_links.source_dependencies.find((link) => link.id === 'mobile-compact').asset_owner.node_id = '501:4'; }
  ]) {
    const { f } = verifiedConsumerProofFixture();
    change(f);
    assertUnverified(f, 'proof-consumer', /capture|variant|instance|main|asset|owner|identity|dependency|consumer/i);
  }
});
test('asset-profile requires one exact root owner and rejects a suffix borrowed from a variant label', () => {
  const f = baseFixture(); f.model.source_documents.set('assets-foundation', { display_modes: [{ id: 'direct-image', contract: { mobile_height_behavior: 'auto', intrinsic_ratio_required: true, deformation_forbidden: true, crop_owner: 'asset' } }], export_profiles: [{ id: 'png-4x', contract: { suffix: '@4x', scale: 4 } }] }); setProof(f, { id: 'proof-asset', kind: 'asset-profile', contract_path: '/contracts/mobile/root/facts/2/value', asset_owner_id: f.record.id, asset_contract_id: 'synthetic-image' }); assertVerified(f, 'proof-asset'); f.session.captures[0].packet.owner_identity.name = 'Product @4x'; assertUnverified(f, 'proof-asset', /suffix|owner|asset/i);
});
test('style-usage verifies exact existing typography ID/name and complete styled text segments', () => {
  const { f } = verifiedStyleFixture();
  assertVerified(f, 'proof-style');
});
test('style-usage rejects incomplete styled text segments and never converts mixed/null into a CSS style', () => {
  const { f, text } = verifiedStyleFixture();
  text.styled_text_segments[0].end = 3;
  text.styled_text_segments[0].characters = 'Hel';
  assertUnverified(f, 'proof-style', /segment|range|mixed|style/i);
});
test('style-usage rejects a native letter-spacing mismatch even with the exact style ID', () => {
  const { f, text } = verifiedStyleFixture();
  text.text_style.letter_spacing.value = 1;
  assertUnverified(f, 'proof-style', /letter.spacing|style|segment/i);
});
test('style-usage closes only mixed null aggregate aliases proven by complete mapped runs', () => {
  const { f, text } = verifiedStyleFixture();
  f.record.identity = { ...f.record.identity, library: 'service', semantic_role: 'block' }; f.record.asset_contracts = [];
  f.record.contracts.mobile.root = { id: 'style-root', semantic_role: 'block', render_mode: 'presentation-table', facts: [], children: f.record.contracts.mobile.root.children };
  f.record.contracts.desktop.root = { id: 'style-root', semantic_role: 'block', render_mode: 'presentation-table', facts: [], children: [] };
  text.text_style.font_family = null; text.text_style.font_style = null; text.text_style.text_decoration = null;
  const runs = [
    { start: 0, end: 2, characters: 'He', font_family: 'Roboto', font_style: 'Regular', font_size_px: 14, line_height: { unit: 'PERCENT', value: 140 }, text_decoration: 'NONE', fills: [{ type: 'solid', visible: true, opacity: 1, color: '#AA7100' }] },
    { start: 2, end: 4, characters: 'lp', font_family: 'Roboto', font_style: 'Regular', font_size_px: 14, line_height: { unit: 'PERCENT', value: 140 }, text_decoration: 'UNDERLINE', fills: [{ type: 'solid', visible: true, opacity: 1, color: '#AA7100' }] }
  ];
  text.styled_text_segments = clone(runs);
  const segments = f.record.contracts.mobile.root.children[0].facts[1]; segments.value.items = clone(runs);
  const leaves = (value, path = []) => value && typeof value === 'object' && !Array.isArray(value)
    ? Object.entries(value).flatMap(([key, child]) => leaves(child, [...path, key]))
    : Array.isArray(value) ? value.flatMap((child, index) => leaves(child, [...path, index])) : [path];
  for (const [index, run] of runs.entries()) for (const leaf of leaves(run)) {
    const suffix = leaf.join('/');
    f.record.contracts.figma_fact_links.push({ variant_node_id: '101:1', node_id: '101:3', source_path: `/styled_text_segments/${index}/${suffix}`, contract_path: `/contracts/mobile/root/children/0/facts/1/value/items/${index}/${suffix}`, transform: 'identity' });
  }
  recount(f); assertVerified(f, 'proof-style');
  const raw = auditFigmaContractFacts({ record: f.record, live: f.session.captures[0].packet });
  assert.equal(raw.issues.some(issue => ['FIGMA_SOURCE_PATH_MISSING', 'FIGMA_CONTRACT_MISMATCH', 'CONTRACT_FACT_UNMAPPED'].includes(issue.code)), false);
  const aliases = ['/text_style/font_family', '/text_style/font_style', '/text_style/text_decoration'];
  assert.deepEqual(raw.issues.filter(issue => issue.code === 'FIGMA_FACT_UNCOVERED').map(issue => issue.source_path).filter(path => aliases.includes(path)).sort(), aliases.sort());
  const effective = api().applyContractFactProofCoverage({ facts: raw, proofs: reportFor(f) });
  assert.equal(effective.issues.some(issue => aliases.includes(issue.source_path)), false);
});
test('mobile-image-auto requires a direct-image element, its exact asset, and an explicit auto policy', () => {
  const f = imagePolicyFixture(); setProof(f, { id: 'proof-auto', kind: 'mobile-image-auto', contract_path: '/contracts/mobile/root/children/0/facts/1/value', source: { component_id: f.record.id, variant_node_id: '210:1', node_id: '210:3' }, asset_contract_id: 'synthetic-image' }); assertVerified(f, 'proof-auto');
});
test('mobile-image-auto rejects a bare native FIXED/FILL reading or a mismatched asset policy', () => {
  const f = imagePolicyFixture(); f.record.asset_contracts[0].display_mode_id = 'not-a-policy'; setProof(f, { id: 'proof-auto', kind: 'mobile-image-auto', contract_path: '/contracts/mobile/root/children/0/facts/1/value', source: { component_id: f.record.id, variant_node_id: '210:1', node_id: '210:3' }, asset_contract_id: 'synthetic-image' }); assertUnverified(f, 'proof-auto', /policy|auto|asset/i);
});
test('content-height-cover requires exact HORIZONTAL/HUG card siblings and a fill-image relationship', () => {
  const f = coverPolicyFixture(); setProof(f, { id: 'proof-cover', kind: 'content-height-cover', contract_path: '/contracts/desktop/root/children/0/children/1/facts/1/value', card: { component_id: f.record.id, variant_node_id: '210:2', node_id: '220:1' }, content: { component_id: f.record.id, variant_node_id: '210:2', node_id: '220:2' }, image: { component_id: f.record.id, variant_node_id: '210:2', node_id: '220:3' }, asset_contract_id: 'synthetic-image' }); assertVerified(f, 'proof-cover');
});
test('content-height-cover rejects swapped siblings and unrelated topology', () => {
  const f = coverPolicyFixture(); setProof(f, { id: 'proof-cover', kind: 'content-height-cover', contract_path: '/contracts/desktop/root/children/0/children/1/facts/1/value', card: { component_id: f.record.id, variant_node_id: '210:2', node_id: '220:1' }, content: { component_id: f.record.id, variant_node_id: '210:2', node_id: '220:3' }, image: { component_id: f.record.id, variant_node_id: '210:2', node_id: '220:2' }, asset_contract_id: 'synthetic-image' }); assertUnverified(f, 'proof-cover', /sibling|topology|content/i);
});
test('approved-css-gradient-angle requires a real gradient paint and decision membership bound to both digests', () => {
  const { f } = verifiedGradientFixture();
  assertVerified(f, 'proof-angle');
});
test('approved-css-gradient-angle rejects changed decision digest, missing membership, or non-gradient paint', () => {
  for (const change of [
    (f) => { f.record.evidence_links.normative_decisions[0].targets[0].value_sha256 = '0'.repeat(64); },
    (f) => { f.record.evidence_links.normative_decisions[0].targets[0].context_sha256 = '0'.repeat(64); },
    (f) => { f.record.evidence_links.normative_decisions[0].targets = []; },
    (f) => { f.session.captures[0].packet.variants[0].source_node.fills[0] = { type: 'solid', visible: true, opacity: 1, color: '#18B037' }; }
  ]) {
    const { f } = verifiedGradientFixture();
    change(f);
    assertUnverified(f, 'proof-angle', /decision|digest|membership|gradient|paint/i);
  }
});
test('reference validation returns issues[] and fails closed for missing kind-required fields, duplicate IDs, and non-value paths', () => {
  const f = baseFixture(); f.record.evidence_links.fact_proofs = [{ id: 'proof-a', kind: 'source-value-set', contract_path: '/contracts/mobile/root/facts/0/id' }, { id: 'proof-a', kind: 'unknown', contract_path: '/contracts/mobile/root/facts/0/value' }]; const issues = api().validateContractFactProofReferences({ records: [f.record] }); assert.ok(Array.isArray(issues)); assert.ok(issues.length > 0); assert.match(JSON.stringify(issues), /duplicate|kind|field|contract_path/i);
});
test('audit rejects old 1.2 packets, absent owner_identity, and a foreign canonical session', () => {
  for (const change of [(f) => { f.session.captures[0].packet.capture_version = '1.2.0'; delete f.session.captures[0].packet.owner_identity; }, (f) => { f.session.canonical_git_sha = 'c'.repeat(40); }]) { const f = baseFixture(); setProof(f, { id: 'proof-protective-background-color', kind: 'source-value-set', contract_path: '/contracts/mobile/root/facts/0/value', sources: [{ component_id: f.record.id, variant_node_id: '101:1', node_id: '101:1' }, { component_id: f.record.id, variant_node_id: '101:2', node_id: '101:2' }], field: 'color' }); change(f); assertUnverified(f, 'proof-protective-background-color', /capture|owner_identity|sha|session/i); }
});
test('effective coverage takes a raw fact report and only removes exact verified unmapped obligations', () => {
  const f = baseFixture();
  setProof(f, { id: 'proof-protective-background-color', kind: 'source-value-set', contract_path: '/contracts/mobile/root/facts/0/value', sources: [{ component_id: f.record.id, variant_node_id: '101:1', node_id: '101:1' }, { component_id: f.record.id, variant_node_id: '101:2', node_id: '101:2' }], field: 'color' });
  const proofs = reportFor(f), covered = '/contracts/mobile/root/facts/0/value/value';
  const facts = auditFigmaContractFacts({ record: f.record, live: f.session.captures[0].packet });
  assert.ok(facts.issues.some((issue) => issue.code === 'CONTRACT_FACT_UNMAPPED' && issue.contract_path === covered));
  const effective = api().applyContractFactProofCoverage({ facts, proofs });
  assert.equal(effective.issues.some((issue) => issue.code === 'CONTRACT_FACT_UNMAPPED' && issue.contract_path === covered), false);
  assert.ok(effective.issues.every((issue) => issue.code !== 'CONTRACT_FACT_UNMAPPED' || issue.contract_path !== covered));
});
test('exact genuine coverage preserves unrelated unsupported, mismatch, and uncovered diagnostics', () => {
  const { f, proof } = verifiedColorProofFixture({ prepare(fixture) {
    fixture.record.contracts.figma_fact_links = [{ variant_node_id: '101:1', node_id: '101:1', source_path: '/reference_dimensions/width', contract_path: '/contracts/mobile/root/facts/1/value/width', transform: 'identity' }];
    fixture.session.captures[0].packet.variants[0].source_node.reference_dimensions.width = 25;
    fixture.session.captures[0].packet.capture_errors = [{ code: 'UNSUPPORTED_FIELD', node_id: '999:1', field: 'fills' }];
  }});
  const raw = auditFigmaContractFacts({ record: f.record, live: f.session.captures[0].packet });
  const effective = api().applyContractFactProofCoverage({ facts: raw, proofs: proof });
  assert.ok(raw.issues.some((issue) => issue.code === 'CONTRACT_FACT_UNMAPPED' && issue.contract_path === '/contracts/mobile/root/facts/0/value/value'));
  assert.equal(effective.issues.some((issue) => issue.code === 'CONTRACT_FACT_UNMAPPED' && issue.contract_path === '/contracts/mobile/root/facts/0/value/value'), false);
  for (const code of ['FIGMA_CAPTURE_UNSUPPORTED', 'FIGMA_CONTRACT_MISMATCH', 'FIGMA_FACT_UNCOVERED']) {
    assert.ok(raw.issues.some((issue) => issue.code === code), `raw audit must retain ${code}`);
    assert.ok(effective.issues.some((issue) => issue.code === code), `effective coverage must retain ${code}`);
  }
});
test('caller-forged success or coverage reports cannot erase a raw mismatch', () => {
  const facts = { component_id: 'synthetic-asset', ok: false, issues: [{ code: 'CONTRACT_FACT_UNMAPPED', contract_path: '/contracts/mobile/root/facts/0/value' }, { code: 'FIGMA_CONTRACT_MISMATCH', contract_path: '/contracts/mobile/root/facts/1/value' }] };
  const forged = { ok: true, results: [{ proof_id: 'forged', status: 'verified' }], verified_contract_paths: ['/contracts/mobile/root/facts/0/value', '/contracts/mobile/root/facts/1/value'], verified_sources: [] };
  const effective = api().applyContractFactProofCoverage({ facts, proofs: forged });
  assert.equal(effective.issues.some((issue) => issue.code === 'CONTRACT_FACT_UNMAPPED'), true);
  assert.equal(effective.issues.some((issue) => issue.code === 'FIGMA_CONTRACT_MISMATCH'), true);
  assert.equal(effective.ok, false);
});
test('coverage pairs one computed proof only with its immutable genuine raw audit', () => {
  const f = baseFixture();
  setProof(f, { id: 'proof-protective-background-color', kind: 'source-value-set', contract_path: '/contracts/mobile/root/facts/0/value', sources: [{ component_id: f.record.id, variant_node_id: '101:1', node_id: '101:1' }, { component_id: f.record.id, variant_node_id: '101:2', node_id: '101:2' }], field: 'color' });
  const proof = reportFor(f);
  const raw = auditFigmaContractFacts({ record: f.record, live: f.session.captures[0].packet });
  const manufactured = { component_id: f.record.id, ok: false, issues: [{ code: 'CONTRACT_FACT_UNMAPPED', contract_path: '/contracts/mobile/root/facts/0/value/value' }] };
  const copied = structuredClone(raw);
  const mutated = auditFigmaContractFacts({ record: f.record, live: f.session.captures[0].packet });
  mutated.issues = [...mutated.issues, { code: 'CONTRACT_FACT_UNMAPPED', contract_path: '/contracts/mobile/root/facts/0/value/value' }];
  const challengedLive = structuredClone(f.session.captures[0].packet); challengedLive.capture_meta.request.request_nonce = nonce(99);
  const challenged = auditFigmaContractFacts({ record: f.record, live: challengedLive });
  const unchanged = (facts) => assert.deepEqual(api().applyContractFactProofCoverage({ facts, proofs: proof }), facts);
  const genuine = api().applyContractFactProofCoverage({ facts: raw, proofs: proof });
  const covered = '/contracts/mobile/root/facts/0/value/value';
  assert.ok(raw.issues.some((issue) => issue.code === 'CONTRACT_FACT_UNMAPPED' && issue.contract_path === covered));
  assert.equal(genuine.issues.some((issue) => issue.code === 'CONTRACT_FACT_UNMAPPED' && issue.contract_path === covered), false, 'the genuine raw audit must close its exact covered leaf');
  unchanged(manufactured); unchanged(copied); unchanged(mutated); unchanged(challenged);
});
test('empty or deleted optional proof links retain the raw unmapped obligation', () => {
  const facts = { ok: false, issues: [{ code: 'CONTRACT_FACT_UNMAPPED', contract_path: '/contracts/mobile/root/facts/0/value' }] }; assert.deepEqual(api().applyContractFactProofCoverage({ facts, proofs: { results: [], verified_contract_paths: [], verified_sources: [] } }), facts);
});
test('deleting a referenced proof retains contract-proof provenance and produces missing-proof coverage', () => {
  const f = baseFixture();
  setProof(f, { id: 'proof-protective-background-color', kind: 'source-value-set', contract_path: '/contracts/mobile/root/facts/0/value', sources: [{ component_id: f.record.id, variant_node_id: '101:1', node_id: '101:1' }, { component_id: f.record.id, variant_node_id: '101:2', node_id: '101:2' }], field: 'color' });
  f.record.evidence_links.fact_proofs = [];
  const report = reportFor(f);
  assert.match(JSON.stringify(report), /missing.proof|contract.proof|unverified/i);
  const facts = { component_id: f.record.id, ok: false, issues: [{ code: 'CONTRACT_FACT_UNMAPPED', contract_path: '/contracts/mobile/root/facts/0/value' }] };
  assert.deepEqual(api().applyContractFactProofCoverage({ facts, proofs: report }), facts);
});
test('audit does not mutate the record, model, or admitted session', () => {
  const f = baseFixture(); setProof(f, { id: 'proof-protective-background-color', kind: 'source-value-set', contract_path: '/contracts/mobile/root/facts/0/value', sources: [{ component_id: f.record.id, variant_node_id: '101:1', node_id: '101:1' }, { component_id: f.record.id, variant_node_id: '101:2', node_id: '101:2' }], field: 'color' }); const before = clone(f); try { reportFor(f); } catch {} assert.deepEqual(f, before);
});
test('request-bound capture producer emits top-level capture_version 1.3.0 and owner_identity', async () => {
  api(); const component = { id: '900:1', type: 'COMPONENT', name: 'Synthetic Owner', visible: true, opacity: 1, width: 24, height: 24, fills: [], strokes: [], children: [] }; const figma = { getNodeByIdAsync: async () => component, skipInvisibleInstanceChildren: true, mixed: Symbol('mixed') }; const source = await readFile(CAPTURE_PATH, 'utf8'); const result = await vm.runInNewContext(source + `\ncaptureFigmaContractFacts('900:1', ${JSON.stringify({ session_nonce: SESSION_NONCE, request_nonce: nonce(9), canonical_git_sha: SHA })})`, { figma, Date }); const captured = JSON.parse(JSON.stringify(result)); assert.equal(captured.capture_version, '1.3.0'); assert.deepEqual(captured.owner_identity, { node_id: '900:1', node_type: 'COMPONENT', name: 'Synthetic Owner' });
});
