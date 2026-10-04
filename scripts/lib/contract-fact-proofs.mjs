import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { validateCaptureFreshness, validateEvidenceSessionFreshness } from './component-evidence-freshness.mjs';
import { matchesRemoteSourceIdentity } from './component-evidence-links.mjs';
import { isFigmaContractFactReportFor, hasCompleteMixedTextRuns } from './figma-contract-facts.mjs';

// Proof metadata is authoring evidence, never an HTML value override. Every
// success is qualified by an exact canonical owner, request-bound complete
// capture and typed target. The raw scalar audit remains independently visible.
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ROOT = /^[0-9]+:[0-9]+$/u;
const NODE = /^(?:[0-9]+:[0-9]+|I[0-9]+:[0-9]+(?:;[0-9]+:[0-9]+)+)$/u;
const SHA = /^[a-f0-9]{40}$/u;
const DIGEST = /^[a-f0-9]{64}$/u;
const VALUE_PATH = /^\/contracts\/(?:mobile|desktop|variant_contracts\/\d+)\/root(?:\/children\/\d+)*\/facts\/\d+\/value$/u;
const computedCoverage = new WeakMap();
const KINDS = {
  'source-value-set': ['sources', 'field'],
  'consumer-geometry': ['consumer_component_id', 'asset_contract_id', 'placements'],
  'asset-profile': ['asset_owner_id', 'asset_contract_id'],
  'style-usage': ['source'],
  'mobile-image-auto': ['source', 'asset_contract_id'],
  'content-height-cover': ['card', 'content', 'image', 'asset_contract_id'],
  'approved-css-gradient-angle': ['source', 'paint_index', 'decision_id'],
};
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const closed = (v, keys) => object(v) && keys.every(k => Object.hasOwn(v, k)) && Object.keys(v).every(k => keys.includes(k));
const match = (re, v) => typeof v === 'string' && !/[\r\n]/u.test(v) && re.test(v);
const finite = v => typeof v === 'number' && Number.isFinite(v);
const number = v => finite(v) && Math.abs(v - Math.round(v)) < 0.0001 ? Math.round(v) : v;
const diagnostic = (code, path, message, extra = {}) => ({ code, path, message, ...extra });
const ordered = issues => issues.sort((a, b) => a.path.localeCompare(b.path) || a.code.localeCompare(b.code));
const selectorShape = v => closed(v, ['component_id', 'variant_node_id', 'node_id']) && match(ID, v.component_id) && match(ROOT, v.variant_node_id) && match(NODE, v.node_id);
const key = s => JSON.stringify([s.component_id, s.variant_node_id, s.node_id, s.source_path]);
const pointer = (root, path) => typeof path === 'string' ? path.split('/').slice(1).reduce((value, part) => value?.[part], root) : undefined;
const equal = (a, b) => isDeepStrictEqual(a, b);
function sortedJson(v) {
  if (Array.isArray(v)) return v.map(sortedJson);
  if (object(v)) return Object.fromEntries(Object.keys(v).sort().map(k => [k, sortedJson(v[k])]));
  return v;
}
const digest = v => createHash('sha256').update(JSON.stringify(sortedJson(v))).digest('hex');
const variants = record => record?.variants?.length ? record.variants : [{ node_id: record?.figma?.node_id, axes: [] }];
const axes = value => Array.isArray(value) && value.every(a => closed(a, ['name', 'value']) && typeof a.name === 'string' && typeof a.value === 'string') && new Set(value.map(a => a.name)).size === value.length ? JSON.stringify(value.map(a => [a.name, a.value]).sort((a, b) => a[0].localeCompare(b[0]))) : null;
const viewportOf = (record, variantId) => variants(record).find(v => v.node_id === variantId)?.axes?.find(a => a.name === 'Viewport')?.value?.toLowerCase();
function target(record, path) {
  if (!match(VALUE_PATH, path)) return null;
  const value = pointer(record, path), fact = pointer(record, path.replace(/\/value$/u, ''));
  const elementPath = path.replace(/\/facts\/\d+\/value$/u, ''), element = pointer(record, elementPath);
  if (!object(value) || typeof value.type !== 'string' || !fact || !element) return null;
  const scope = /^\/contracts\/(mobile|desktop)/u.exec(path)?.[1];
  const index = /^\/contracts\/variant_contracts\/(\d+)/u.exec(path)?.[1];
  const viewport = scope ?? record.contracts?.variant_contracts?.[index]?.viewport;
  return { value, fact, element, elementPath, viewport };
}
function factsIn(record) {
  const found = [];
  function visit(e, path) { if (!e) return; for (const [i, f] of (e.facts ?? []).entries()) found.push({ fact: f, path: `${path}/facts/${i}/value`, element: e }); (e.children ?? []).forEach((c, i) => visit(c, `${path}/children/${i}`)); }
  for (const v of ['mobile', 'desktop']) visit(record.contracts?.[v]?.root, `/contracts/${v}/root`);
  (record.contracts?.variant_contracts ?? []).forEach((v, i) => visit(v.root, `/contracts/variant_contracts/${i}/root`));
  return found;
}
function proofShape(p) {
  if (!KINDS[p?.kind] || !closed(p, ['id', 'kind', 'contract_path', ...KINDS[p.kind]]) || !match(ID, p.id) || !match(VALUE_PATH, p.contract_path)) return false;
  switch (p.kind) {
    case 'source-value-set': return ['color', 'dimensions'].includes(p.field) && Array.isArray(p.sources) && p.sources.length > 0 && p.sources.every(selectorShape);
    case 'consumer-geometry': return match(ID, p.consumer_component_id) && match(ID, p.asset_contract_id) && closed(p.placements, ['mobile', 'desktop']) && Object.values(p.placements).every(selectorShape);
    case 'asset-profile': return match(ID, p.asset_owner_id) && match(ID, p.asset_contract_id);
    case 'style-usage': return selectorShape(p.source);
    case 'mobile-image-auto': return selectorShape(p.source) && match(ID, p.asset_contract_id);
    case 'content-height-cover': return ['card', 'content', 'image'].every(k => selectorShape(p[k])) && match(ID, p.asset_contract_id);
    case 'approved-css-gradient-angle': return selectorShape(p.source) && Number.isSafeInteger(p.paint_index) && p.paint_index >= 0 && match(ID, p.decision_id);
    default: return false;
  }
}
function decisionShape(d) {
  const a = d?.authorization;
  return closed(d, ['id', 'kind', 'owner_id', 'targets', 'authorization']) && match(ID, d.id) && d.kind === 'css-linear-gradient-angle' && match(ID, d.owner_id) &&
    Array.isArray(d.targets) && d.targets.length > 0 && d.targets.every(t => closed(t, ['viewport', 'element_id', 'fact_id', 'contract_path', 'value_sha256', 'context_sha256', 'source', 'paint_index']) &&
      ['mobile', 'desktop'].includes(t.viewport) && match(ID, t.element_id) && match(ID, t.fact_id) && match(VALUE_PATH, t.contract_path) && match(DIGEST, t.value_sha256) && match(DIGEST, t.context_sha256) && selectorShape(t.source) && Number.isSafeInteger(t.paint_index) && t.paint_index >= 0) &&
    closed(a, ['user_instruction', 'scope', 'approved_spec']) && typeof a.user_instruction === 'string' && !!a.user_instruction.trim() &&
    closed(a.scope, ['owner_id', 'contract_paths']) && match(ID, a.scope.owner_id) && Array.isArray(a.scope.contract_paths) && a.scope.contract_paths.length > 0 && a.scope.contract_paths.every(p => match(VALUE_PATH, p)) &&
    closed(a.approved_spec, ['path', 'git_sha']) && typeof a.approved_spec.path === 'string' && /^docs\/superpowers\/specs\/[a-z0-9-]+\.md$/u.test(a.approved_spec.path) && match(SHA, a.approved_spec.git_sha);
}
function compatible(p, t) {
  if (!t) return false;
  if (p.kind === 'source-value-set') return t.value.type === p.field;
  if (p.kind === 'consumer-geometry') return t.value.type === 'dimensions' && t.value.unit === 'px';
  if (p.kind === 'asset-profile') return t.value.type === 'asset-reference' || (['string', 'keyword'].includes(t.value.type) && /^@(?:2|4)x$/u.test(t.value.value));
  if (p.kind === 'style-usage') return t.value.type === 'string' && t.fact.id === 'figma-style-id';
  if (p.kind === 'mobile-image-auto') return t.viewport === 'mobile' && t.value.type === 'keyword' && t.value.value === 'auto' && t.element.render_mode === 'direct-image';
  if (p.kind === 'content-height-cover') return t.viewport === 'desktop' && t.value.type === 'keyword' && t.value.value === 'content-driven-cover';
  return t.value.type === 'number' && finite(t.value.value) && t.fact.id === 'background-gradient-css-angle-degrees' && t.element.semantic_role === 'button';
}
export function validateContractFactProofReferences({ records = [] } = {}) {
  const issues = [], byId = new Map();
  for (const [i, r] of records.entries()) { if (byId.has(r.id)) issues.push(diagnostic('CONTRACT_PROOF_OWNER_AMBIGUOUS', `/records/${i}`, 'Duplicate canonical component ID.')); else byId.set(r.id, r); }
  for (const [i, r] of records.entries()) {
    const at = `/records/${i}/evidence_links`, links = r.evidence_links ?? {}, proofs = links.fact_proofs ?? [], decisions = links.normative_decisions ?? [];
    if (!Array.isArray(proofs) || !Array.isArray(decisions)) { issues.push(diagnostic('CONTRACT_PROOF_SHAPE_INVALID', at, 'Optional proof metadata must be arrays.')); continue; }
    const ids = new Set();
    for (const group of ['foundation_values', 'source_dependencies', 'fact_proofs', 'normative_decisions']) for (const [j, item] of (Array.isArray(links[group]) ? links[group] : []).entries()) {
      if (ids.has(item.id)) issues.push(diagnostic('CONTRACT_PROOF_ID_DUPLICATE', `${at}/${group}/${j}/id`, 'Duplicate evidence/decision ID.'));
      ids.add(item.id);
    }
    const paths = new Set();
    for (const [j, p] of proofs.entries()) {
      const where = `${at}/fact_proofs/${j}`, t = target(r, p.contract_path);
      if (!proofShape(p)) { issues.push(diagnostic('CONTRACT_PROOF_SHAPE_INVALID', where, 'Unsupported kind, contract_path or kind-required field.')); continue; }
      if (paths.has(p.contract_path)) issues.push(diagnostic('CONTRACT_PROOF_TARGET_DUPLICATE', where, 'One typed target may have one proof.'));
      paths.add(p.contract_path);
      if (!compatible(p, t)) issues.push(diagnostic('CONTRACT_PROOF_TARGET_INVALID', `${where}/contract_path`, 'Exact own typed target is incompatible with proof kind.'));
      if (t && p.kind !== 'style-usage' && t.value.type !== 'asset-reference' && !equal(t.fact.provenance, { kind: 'contract-proof', proof_id: p.id })) issues.push(diagnostic('CONTRACT_PROOF_PROVENANCE_INVALID', where, 'Atomic target must name this exact proof.'));
      if (p.kind === 'style-usage' && !['figma-literal', 'figma-binding'].includes(t?.fact.provenance?.kind)) issues.push(diagnostic('CONTRACT_PROOF_PROVENANCE_INVALID', where, 'Supplementary style usage preserves direct native provenance.'));
      const sels = p.sources ?? (p.placements ? Object.values(p.placements) : ['source', 'card', 'content', 'image'].filter(k => p[k]).map(k => p[k]));
      for (const s of sels) {
        const owner = byId.get(s.component_id);
        if (!owner || variants(owner).filter(v => v.node_id === s.variant_node_id).length !== 1 || owner.figma.file_key !== r.figma.file_key) issues.push(diagnostic('CONTRACT_PROOF_SELECTOR_INVALID', where, 'Selector must name a unique registered same-file variant.'));
        if (p.kind !== 'consumer-geometry' && s.component_id !== r.id) issues.push(diagnostic('CONTRACT_PROOF_SELECTOR_INVALID', where, 'Proof source belongs to this canonical owner.'));
      }
      if (p.kind === 'approved-css-gradient-angle' && decisions.filter(d => d.id === p.decision_id && d.owner_id === r.id).length !== 1) issues.push(diagnostic('CONTRACT_PROOF_DECISION_MISSING', where, 'One owned normative decision is required.'));
    }
    for (const { fact, path } of factsIn(r)) if (fact.provenance?.kind === 'contract-proof' && (!closed(fact.provenance, ['kind', 'proof_id']) || proofs.filter(p => p.id === fact.provenance.proof_id && p.contract_path === path).length !== 1)) issues.push(diagnostic('CONTRACT_PROOF_REFERENCE_MISSING', path, 'contract-proof provenance requires one exact owned proof.'));
    for (const [j, d] of decisions.entries()) {
      const where = `${at}/normative_decisions/${j}`;
      if (!decisionShape(d)) { issues.push(diagnostic('CONTRACT_DECISION_SHAPE_INVALID', where, 'Closed decision, exact typed targets, digests and actual user authorization are required.')); continue; }
      const selected = d.targets.map(t => t.contract_path);
      if (d.owner_id !== r.id || d.authorization.scope.owner_id !== r.id || new Set(selected).size !== selected.length || !equal([...selected].sort(), [...d.authorization.scope.contract_paths].sort())) issues.push(diagnostic('CONTRACT_DECISION_SCOPE_INVALID', where, 'Authorization and unique owned targets must agree exactly.'));
      for (const t of d.targets) {
        const actual = target(r, t.contract_path), p = proofs.find(p => p.decision_id === d.id && p.contract_path === t.contract_path);
        if (!actual || actual.viewport !== t.viewport || actual.element.id !== t.element_id || actual.fact.id !== t.fact_id || !p || !equal(p.source, t.source) || p.paint_index !== t.paint_index) issues.push(diagnostic('CONTRACT_DECISION_TARGET_INVALID', where, 'Decision membership binds owner, viewport, element, fact and exact native paint.'));
      }
    }
  }
  return ordered(issues);
}

export function createContractProofEnvironment(model, session) {
  const issues = validateEvidenceSessionFreshness({ session, canonicalSha: model?.canonical_sha }), cache = new Map(), receipts = new Set();
  let usedOwners = new Set(), usedSelectors = new Map();
  const lookup = id => { const matches = model?.records?.filter(r => r.id === id); if (matches?.length !== 1) throw Error('canonical owner identity ambiguous'); return matches[0]; };
  if (!Array.isArray(session?.component_ids) || new Set(session.component_ids).size !== session.component_ids.length || !Array.isArray(session?.captures) || session.captures.length !== session.component_ids.length || session.captures.some(c => session.component_ids.filter(id => id === c.component_id).length !== 1) || new Set(session.captures.map(c => c.component_id)).size !== session.captures.length) issues.push(diagnostic('CONTRACT_PROOF_SESSION_INVALID', '/session', 'Exact unique selected capture owners are required.'));
  function tree(id) {
    usedOwners.add(id);
    if (cache.has(id)) return cache.get(id);
    if (issues.length) throw Error('session SHA/receipt/request identity unverified');
    const record = lookup(id), captures = session.captures.filter(c => c.component_id === id);
    if (captures.length !== 1) throw Error('capture owner missing or duplicated');
    const capture = captures[0], packet = capture.packet, freshness = validateCaptureFreshness({ session, capture, canonicalSha: model.canonical_sha });
    if (freshness.length) throw Error(freshness[0].code);
    const owner = packet?.owner_identity;
    if (packet?.capture_version !== '1.3.0' || packet.file_key !== record.figma.file_key || packet.component_node_id !== record.figma.node_id ||
      !closed(owner, ['node_id', 'node_type', 'name']) || owner.node_id !== record.figma.node_id || owner.node_type !== (record.identity.node_kind === 'component-set' ? 'COMPONENT_SET' : 'COMPONENT') || typeof owner.name !== 'string' || !owner.name.trim() ||
      packet.capture_meta?.tree_complete !== true || !Array.isArray(packet.capture_errors) || !Array.isArray(packet.component_properties) || !Array.isArray(packet.variants)) throw Error('capture1.3 owner_identity/file/tree identity unverified');
    const canonical = variants(record);
    if (packet.variants.length !== canonical.length || new Set(packet.variants.map(v => v.variant_node_id)).size !== canonical.length) throw Error('complete canonical variant set mismatch');
    const nodes = new Map(), seen = new Set(); let count = 0;
    function visit(n, variantId, ancestors) {
      if (!object(n) || seen.has(n) || !match(NODE, n.node_id) || nodes.has(n.node_id) || typeof n.node_type !== 'string' || (['COMPONENT', 'COMPONENT_SET', 'FRAME', 'GROUP', 'INSTANCE', 'SECTION', 'SLOT'].includes(n.node_type) && !Array.isArray(n.children)) || (Object.hasOwn(n, 'children') && !Array.isArray(n.children))) throw Error('capture node/ancestry identity incomplete or ambiguous');
      seen.add(n); count++; nodes.set(n.node_id, { node: n, variantId, ancestors });
      for (const c of n.children ?? []) visit(c, variantId, [...ancestors, n]);
    }
    for (const v of packet.variants) {
      const expected = canonical.filter(c => c.node_id === v.variant_node_id);
      if (expected.length !== 1 || axes(v.axes) === null || axes(v.axes) !== axes(expected[0].axes) || v.source_node?.node_id !== v.variant_node_id || v.source_node.node_type !== 'COMPONENT' || !matchesRemoteSourceIdentity(record, v.source_node)) throw Error('variant root/axes/remote identity mismatch');
      visit(v.source_node, v.variant_node_id, []);
    }
    if (!Number.isSafeInteger(packet.capture_meta.node_count) || count !== packet.capture_meta.node_count) throw Error('capture complete node_count mismatch');
    receipts.add(capture.receipt_id);
    const result = { record, capture, packet, nodes }; cache.set(id, result); return result;
  }
  function selected(s) {
    if (!selectorShape(s)) throw Error('selector malformed');
    const t = tree(s.component_id), entry = t.nodes.get(s.node_id);
    if (!entry || entry.variantId !== s.variant_node_id) throw Error('exact node/variant identity missing');
    usedSelectors.set(JSON.stringify(s), { ...s });
    return { ...entry, ...t, selector: s };
  }
  function dependencies(id, trail = new Set()) {
    if (trail.has(id)) throw Error('source dependency cycle');
    const t = tree(id), next = new Set([...trail, id]);
    for (const link of t.record.evidence_links?.source_dependencies ?? []) {
      const entry = selected({ component_id: id, ...link.source }), child = lookup(link.target.component_id);
      const targets = link.target.variant_id ? child.variants.filter(v => v.id === link.target.variant_id) : variants(child);
      const own = t.nodes.get(link.asset_owner.node_id);
      if (targets.length !== 1 || child.figma.file_key !== t.record.figma.file_key || entry.node.node_type !== 'INSTANCE' || entry.node.main_component_id !== targets[0].node_id || !own || own.variantId !== entry.variantId || (own.node.node_id !== entry.node.node_id && !entry.ancestors.some(a => a.node_id === own.node.node_id))) throw Error('source dependency identity or asset owner ancestry mismatch');
      dependencies(child.id, next);
    }
    // Every native INSTANCE inside a source-only graphic needs an exact link.
    if (['asset', 'icon'].includes(t.record.identity.semantic_role)) for (const e of t.nodes.values()) if (e.node.node_type === 'INSTANCE' && (t.record.evidence_links?.source_dependencies ?? []).filter(l => l.source.node_id === e.node.node_id && l.source.variant_node_id === e.variantId).length !== 1) throw Error('required source dependency link missing');
    return t;
  }
  return { issues, lookup, tree, selected, dependencies, receipts,
    beginProof() { usedOwners = new Set(); usedSelectors = new Map(); },
    proofTrace() { return { source_selectors: [...usedSelectors.values()], receipt_ids: [...usedOwners].map(id => cache.get(id)?.capture.receipt_id).filter(Boolean).sort() }; }
  };
}
function visible(entry) { return [entry.node, ...entry.ancestors].every(n => n.visible === true && n.opacity === 1); }
function dimensions(node) {
  const d = node?.reference_dimensions;
  if (d?.unit !== 'px' || !finite(d.width) || !finite(d.height) || d.width <= 0 || d.height <= 0) throw Error('same-node pixel dimensions unavailable');
  return { type: 'dimensions', width: number(d.width), height: number(d.height), unit: 'px' };
}
function nativeColor(e) {
  const fills = e.node.fills;
  if (!visible(e) || !Array.isArray(fills) || fills.some(p => typeof p.visible !== 'boolean')) throw Error('paint visibility/opacity context unverified');
  const paints = fills.map((p, i) => [p, i]).filter(([p]) => p.visible);
  if (paints.length !== 1 || paints[0][0].type !== 'solid' || paints[0][0].opacity !== 1 || !/^#[A-Fa-f0-9]{6}$/u.test(paints[0][0].color)) throw Error('one opaque visible solid paint required');
  return { value: { type: 'color', value: paints[0][0].color.toUpperCase() }, paintIndex: paints[0][1] };
}
function nativeImage(e) {
  dimensions(e.node);
  const p = e.node.fills?.filter(p => p.visible === true);
  if (!visible(e) || !Array.isArray(e.node.fills) || e.node.fills.some(p => typeof p.visible !== 'boolean') || p?.length !== 1 || p[0].type !== 'image' || p[0].opacity !== 1 || typeof p[0].image_hash !== 'string' || !p[0].image_hash || p[0].scale_mode !== 'FILL') throw Error('exact visible image Fill and paint context required');
}
function asset(record, id) { const found = record.asset_contracts?.filter(a => a.id === id); if (found?.length !== 1) throw Error('owned asset ambiguous or missing'); return found[0]; }
function referenceElement(record, selector, assetId) {
  const result = [];
  function walk(e) { if (!e) return; if (e.asset_contract_id === assetId && (e.facts ?? []).some(f => f.id === 'reference-size' && ['figma-literal', 'figma-binding'].includes(f.provenance?.kind) && f.provenance.node_id === selector.node_id)) result.push(e); for (const c of e.children ?? []) walk(c); }
  walk(record.contracts?.[viewportOf(record, selector.variant_node_id)]?.root);
  if (result.length !== 1) throw Error('owned asset element/reference-size placement identity missing');
  return result[0];
}
function verifyReferenceDimensions(record, e, native, variantId) {
  const i = e.facts.findIndex(f => f.id === 'reference-size'), f = e.facts[i];
  if (!equal(f.value, dimensions(native))) throw Error('native placement/reference-size mismatch');
  const recordFact = factsIn(record).filter(v => v.element === e && v.fact === f)[0];
  if (!recordFact || ['width', 'height'].some(dim => (record.contracts.figma_fact_links ?? []).filter(l => l.node_id === native.node_id && l.variant_node_id === variantId && l.source_path === `/reference_dimensions/${dim}` && l.contract_path === `${recordFact.path}/${dim}` && l.transform === 'identity').length !== 1)) throw Error('placement requires exact independent width/height native mappings');
}
function consumerOwnership(env, owner, consumerId, assetId, placements) {
  const consumer = env.lookup(consumerId), a = asset(consumer, assetId), sourceAssets = owner.asset_contracts ?? [];
  const source = env.dependencies(owner.id); env.dependencies(consumer.id);
  if (owner.figma.file_key !== consumer.figma.file_key || a.display_mode_id !== 'direct-image') throw Error('consumer same-file direct asset required');
  const entries = {};
  for (const v of ['mobile', 'desktop']) {
    const s = placements[v], entry = env.selected(s);
    if (s.component_id !== consumerId || viewportOf(consumer, s.variant_node_id) !== v || entry.node.node_type !== 'INSTANCE') throw Error('consumer exact viewport INSTANCE required');
    const e = referenceElement(consumer, s, assetId); verifyReferenceDimensions(consumer, e, entry.node, s.variant_node_id);
    if (e.render_mode !== 'direct-image') throw Error('one shared direct asset must serve both viewports');
    const links = (consumer.evidence_links?.source_dependencies ?? []).filter(l => l.source.node_id === s.node_id && l.source.variant_node_id === s.variant_node_id && l.asset_owner.node_id === s.node_id && l.asset_owner.asset_id === assetId);
    if (links.length !== 1) throw Error('exact consumer asset dependency missing');
    entries[v] = { ...entry, dependency: links[0], element: e };
  }
  const desktopOwner = env.lookup(entries.desktop.dependency.target.component_id), compact = env.lookup(entries.mobile.dependency.target.component_id);
  if (desktopOwner.id !== owner.id && compact.id !== owner.id) throw Error('source is outside consumer ownership chain');
  if (desktopOwner.id === compact.id || !['asset', 'icon'].includes(desktopOwner.identity.semantic_role) || !['asset', 'icon'].includes(compact.identity.semantic_role)) throw Error('distinct ordinary/compact source ownership required');
  const desktopAssets = desktopOwner.asset_contracts ?? [];
  if (desktopAssets.length !== 1 || !equal(desktopAssets[0], a)) throw Error('consumer must retain exact ordinary-source asset contract');
  for (const r of [desktopOwner, compact]) {
    env.dependencies(r.id);
    for (const variant of variants(r)) if (!equal(dimensions(env.selected({ component_id: r.id, variant_node_id: variant.node_id, node_id: variant.node_id }).node), dimensions(entries[r.id === desktopOwner.id ? 'desktop' : 'mobile'].node))) throw Error('source variants must match their own consumer geometry');
  }
  return { consumer, a, entries, source, sourceAssets };
}
const leaves = (value, path) => Object.keys(value).filter(k => k !== 'type').flatMap(k => object(value[k]) ? leaves(value[k], `${path}/${k}`) : [{ path: `${path}/${k}` }]);

export function contractDecisionValueDigest({ record, contractPath } = {}) {
  const t = target(record, contractPath);
  if (!t) throw Error('exact own typed decision target required');
  return digest({ owner_id: record.id, viewport: t.viewport, element_id: t.element.id, fact_id: t.fact.id, value: t.value });
}
export function contractDecisionContextDigest({ selector, paintIndex, model, session } = {}) {
  const e = createContractProofEnvironment(model, session).selected(selector), paint = e.node.fills?.[paintIndex];
  if (!Number.isSafeInteger(paintIndex) || paintIndex < 0 || !visible(e) || paint?.type !== 'gradient_linear' || paint.visible !== true || paint.opacity !== 1 || !Array.isArray(paint.gradient_stops) || paint.gradient_stops.length < 2 || paint.gradient_stops.some(s => !finite(s.position) || typeof s.color !== 'string' || !finite(s.alpha)) || !Array.isArray(paint.gradient_transform) || paint.gradient_transform.length !== 2 || paint.gradient_transform.some(row => !Array.isArray(row) || row.length !== 3 || row.some(v => !finite(v)))) throw Error('native linear-gradient paint/context unverified');
  return digest({ file_key: e.record.figma.file_key, variant_node_id: selector.variant_node_id, node_id: selector.node_id, paint_index: paintIndex, paint: { type: paint.type, visible: paint.visible, opacity: paint.opacity, gradient_stops: paint.gradient_stops, gradient_transform: paint.gradient_transform }, visibility: [e.node, ...e.ancestors].map(n => ({ node_id: n.node_id, visible: n.visible, opacity: n.opacity })) });
}
export function auditContractFactProofs({ record, model, session } = {}) {
  const results = [], issues = [], verified = [], sources = [], receipts = new Set();
  const report = { ok: false, component_id: record?.id ?? null, canonical_git_sha: model?.canonical_sha ?? null, receipt_ids: [], results, issues, verified_contract_paths: [], verified_sources: [] };
  const proofs = record?.evidence_links?.fact_proofs ?? [], decisions = record?.evidence_links?.normative_decisions ?? [];
  if (!proofs.length && !decisions.length && !factsIn(record ?? {}).some(f => f.fact.provenance?.kind === 'contract-proof')) { report.ok = true; return report; }
  const canonical = model?.records?.filter(r => r.id === record?.id);
  if (canonical?.length !== 1 || !equal(canonical[0], record)) { issues.push(diagnostic('CONTRACT_PROOF_CANONICAL_MISMATCH', '/record', 'Exact canonical record required.')); return report; }
  const validation = validateContractFactProofReferences({ records: model.records }); issues.push(...validation);
  const env = createContractProofEnvironment(model, session); issues.push(...env.issues);
  for (const p of Array.isArray(proofs) ? proofs : []) {
    const localSources = [], item = { proof_id: p.id, kind: p.kind, contract_path: p.contract_path, status: 'unverified' }, t = target(record, p.contract_path);
    const source = (s, path) => localSources.push({ component_id: s.component_id, variant_node_id: s.variant_node_id, node_id: s.node_id, source_path: path });
    item.owner_id = record.id;
    item.category = ['mobile-image-auto', 'content-height-cover'].includes(p.kind) ? 'derived-html-rule' : p.kind === 'approved-css-gradient-angle' ? 'approved-normative-decision' : p.kind === 'source-value-set' ? 'own-native-values' : 'verified-relation';
    item.foundation_paths = [];
    env.beginProof();
    try {
      if (validation.length || env.issues.length || !compatible(p, t)) throw Error('proof reference/type/session unverified');
      env.tree(record.id);
      switch (p.kind) {
        case 'source-value-set': {
          if (!['asset', 'icon'].includes(record.identity.semantic_role) || record.identity.library !== 'shared' || variants(record).some(v => v.axes.some(a => a.name === 'Viewport')) || p.sources.length !== variants(record).length || new Set(p.sources.map(s => s.variant_node_id)).size !== p.sources.length || p.sources.some(s => s.component_id !== record.id || s.node_id !== s.variant_node_id)) throw Error('complete own source-only variant roots required');
          env.dependencies(record.id);
          for (const s of p.sources) { const e = env.selected(s); if (p.field === 'color') { const c = nativeColor(e); if (!equal(c.value, t.value)) throw Error('source color mismatch'); source(s, `/fills/${c.paintIndex}/color`); } else { if (!equal(dimensions(e.node), t.value)) throw Error('source dimensions mismatch'); source(s, '/reference_dimensions/width'); source(s, '/reference_dimensions/height'); source(s, '/reference_dimensions/unit'); } }
          break;
        }
        case 'consumer-geometry': {
          const own = consumerOwnership(env, record, p.consumer_component_id, p.asset_contract_id, p.placements), v = t.viewport;
          if (!equal(dimensions(own.entries[v]?.node), t.value)) throw Error('consumer geometry mismatch');
          source(p.placements[v], '/reference_dimensions/width'); source(p.placements[v], '/reference_dimensions/height'); source(p.placements[v], '/reference_dimensions/unit'); break;
        }
        case 'asset-profile': {
          const r = env.lookup(p.asset_owner_id), a = asset(r, p.asset_contract_id);
          if (r.id !== record.id) {
            const placements = {};
            for (const v of ['mobile', 'desktop']) { const links = (r.evidence_links?.source_dependencies ?? []).filter(l => viewportOf(r, l.source.variant_node_id) === v && l.asset_owner.asset_id === a.id && l.asset_owner.node_id === l.source.node_id); if (links.length !== 1) throw Error('asset consumer placement ambiguous'); placements[v] = { component_id: r.id, ...links[0].source }; }
            consumerOwnership(env, record, r.id, a.id, placements);
          } else env.dependencies(record.id);
          const owner = env.tree(record.id).packet.owner_identity, suffix = / @(2x|4x)$/u.exec(owner.name)?.[1], profile = model.source_documents?.get('assets-foundation')?.export_profiles?.filter(e => e.id === a.export_profile_id);
          item.foundation_paths.push({ source_id: 'assets-foundation', target_id: a.export_profile_id });
          if (owner.name !== record.identity.figma_name || !suffix || profile?.length !== 1 || profile[0].contract?.suffix !== `@${suffix}` || profile[0].contract?.scale !== Number(suffix[0]) || !a.owner_layer_name.endsWith(` @${suffix}`)) throw Error('owner suffix/registered asset export profile mismatch');
          if (t.value.type === 'asset-reference' ? t.value.asset_contract_id !== a.id || r.id !== record.id : t.value.value !== `@${suffix}`) throw Error('asset reference/suffix target mismatch'); break;
        }
        case 'style-usage': {
          const e = env.selected(p.source), n = e.node, style = n.text_style;
          const styles = model.source_documents?.get('typography-foundation')?.styles?.filter(s => s.figma_style_id === style?.figma_style_id);
          if (n.node_type !== 'TEXT' || t.fact.provenance.node_id !== n.node_id || viewportOf(record, p.source.variant_node_id) !== t.viewport || styles?.length !== 1) throw Error('text style identity/viewport ambiguous');
          const s = styles[0], line = (a, b) => a?.unit?.toLowerCase() === (b?.unit === 'percent' ? 'percent' : b?.unit === 'px' ? 'pixels' : b?.unit) && number(a.value) === b?.value;
          item.foundation_paths.push({ source_id: 'typography-foundation', target_id: s.id });
          if (s.viewport !== t.viewport || s.figma_name !== style.figma_style_name || t.value.value !== s.figma_style_id || number(style.font_size_px) !== s.font_size_px || style.font_weight !== s.font.css_weight || !line(style.line_height, s.line_height) || !line(style.letter_spacing, s.letter_spacing) || (record.contracts.figma_fact_links ?? []).filter(l => l.node_id === n.node_id && l.variant_node_id === p.source.variant_node_id && l.source_path === '/text_style/figma_style_id' && l.contract_path === `${p.contract_path}/value` && l.transform === 'identity').length !== 1) throw Error('style ID/name/native parameters/direct mapping mismatch');
          const segments = n.styled_text_segments;
          if (segments) {
            let start = 0;
            if (!Array.isArray(segments) || !segments.length || typeof n.characters !== 'string') throw Error('complete text segment ranges required');
            for (const segment of segments) { if (!Number.isSafeInteger(segment.start) || !Number.isSafeInteger(segment.end) || segment.start !== start || segment.end <= start || segment.characters !== n.characters.slice(segment.start, segment.end) || segment.font_family !== s.font.family || segment.font_style !== s.font.figma_style || number(segment.font_size_px) !== s.font_size_px || !line(segment.line_height, s.line_height)) throw Error('text segment range/style mismatch'); start = segment.end; }
            if (start !== n.characters.length) throw Error('text segment coverage incomplete');
            // Local underline/link paint is retained by its independent fact.
            const runFacts = factsIn(record).filter(f => f.fact.id === 'styled-text-segments' && f.fact.provenance?.node_id === n.node_id);
            if (runFacts.length !== 1 || !equal(sortedJson(runFacts[0].fact.value.items), sortedJson(segments.map(segment => ({ ...segment, font_size_px: number(segment.font_size_px), line_height: { ...segment.line_height, value: number(segment.line_height.value) } }))))) throw Error('canonical complete styled segments must retain local decoration/paint');
            // MIXED aggregate fields are not CSS defaults. Only the complete,
            // independently mapped run facts retain actual local underline/paint.
            const runs = runFacts[0], keys = ['start', 'end', 'characters', 'font_family', 'font_style', 'font_size_px', 'line_height', 'text_decoration', 'fills'];
            const exactRuns = hasCompleteMixedTextRuns(n, 'fontName') && hasCompleteMixedTextRuns(n, 'textDecoration') &&
              runs.element === t.element && runs.fact.provenance.node_id === n.node_id && ['figma-literal', 'figma-binding'].includes(runs.fact.provenance.kind) &&
              segments.every(run => closed(run, keys) && closed(run.line_height, ['unit', 'value']) && run.fills.every(paint =>
                closed(paint, ['type', 'visible', 'opacity', 'color']) && paint.type === 'solid' && paint.visible === true && paint.opacity === 1 && /^#[A-Fa-f0-9]{6}$/u.test(paint.color)));
            if (exactRuns) {
              const primitiveLeaves = [];
              const collect = (value, path) => {
                if (value && typeof value === 'object') { for (const [k, v] of Object.entries(value)) collect(v, `${path}/${k}`); }
                else primitiveLeaves.push({ path, value });
              };
              segments.forEach((run, index) => collect(run, `/${index}`));
              const mappings = record.contracts.figma_fact_links ?? [];
              const independentlyMapped = primitiveLeaves.every(leaf => {
                const path = `${runs.path}/items${leaf.path}`, links = mappings.filter(link => link.contract_path === path);
                return links.length === 1 && links[0].variant_node_id === p.source.variant_node_id && links[0].node_id === n.node_id &&
                  links[0].source_path === `/styled_text_segments${leaf.path}` && links[0].transform === 'identity' && equal(number(leaf.value), pointer(record, path));
              });
              if (independentlyMapped) for (const field of ['font_family', 'font_style', 'text_decoration']) {
                if (style[field] === null) source(p.source, `/text_style/${field}`);
              }
            }

          } else if (style.font_family !== s.font.family || style.font_style !== s.font.figma_style) throw Error('native unmixed style required');
          source(p.source, '/text_style/figma_style_id'); source(p.source, '/text_style/figma_style_name'); source(p.source, '/text_style/font_weight'); break;
        }
        case 'mobile-image-auto': {
          const e = env.selected(p.source), a = asset(record, p.asset_contract_id), element = referenceElement(record, p.source, a.id), policy = model.source_documents?.get('assets-foundation')?.display_modes?.filter(d => d.id === a.display_mode_id);
          if (viewportOf(record, p.source.variant_node_id) !== 'mobile' || element !== t.element || element.render_mode !== 'direct-image' || policy?.length !== 1 || policy[0].contract?.mobile_height_behavior !== 'auto' || policy[0].contract?.intrinsic_ratio_required !== true || policy[0].contract?.deformation_forbidden !== true) throw Error('owned Mobile direct-image auto/proportional policy required');
          item.foundation_paths.push({ source_id: 'assets-foundation', target_id: a.display_mode_id });
          nativeImage(e); verifyReferenceDimensions(record, element, e.node, p.source.variant_node_id); break;
        }
        case 'content-height-cover': {
          const card = env.selected(p.card), content = env.selected(p.content), image = env.selected(p.image), a = asset(record, p.asset_contract_id), element = referenceElement(record, p.image, a.id), policy = model.source_documents?.get('assets-foundation')?.display_modes?.filter(d => d.id === a.display_mode_id);
          if (new Set([p.card.variant_node_id, p.content.variant_node_id, p.image.variant_node_id]).size !== 1 || viewportOf(record, p.card.variant_node_id) !== 'desktop' || card.node.layout?.mode !== 'HORIZONTAL' || card.node.layout?.vertical_sizing !== 'HUG' || content.node.layout?.horizontal_sizing !== 'FIXED' || content.node.layout?.vertical_sizing !== 'HUG' || image.node.layout?.vertical_sizing !== 'FILL' || !equal(card.node.children?.map(n => n.node_id), [content.node.node_id, image.node.node_id]) || content.ancestors.at(-1)?.node_id !== card.node.node_id || image.ancestors.at(-1)?.node_id !== card.node.node_id || element !== t.element || a.display_mode_id !== 'fill-image' || policy?.length !== 1 || policy[0].contract?.crop_owner !== 'html-wrapper') throw Error('exact content-height HUG/FILL sibling topology and wrapper policy required');
          item.foundation_paths.push({ source_id: 'assets-foundation', target_id: a.display_mode_id });
          nativeImage(image); verifyReferenceDimensions(record, element, image.node, p.image.variant_node_id); break;
        }
        case 'approved-css-gradient-angle': {
          const d = decisions.find(d => d.id === p.decision_id), selected = d.targets.filter(v => v.contract_path === p.contract_path);
          if (selected.length !== 1) throw Error('decision exact target membership missing');
          const m = selected[0];
          if (m.value_sha256 !== contractDecisionValueDigest({ record, contractPath: p.contract_path }) || m.context_sha256 !== contractDecisionContextDigest({ selector: p.source, paintIndex: p.paint_index, model, session }) || viewportOf(record, p.source.variant_node_id) !== t.viewport) throw Error('approved value/context digest mismatch');
          env.selected(p.source); break;
        }
      }
      item.status = 'verified'; verified.push(...leaves(t.value, p.contract_path).map(v => v.path)); sources.push(...localSources);
    } catch (error) { item.reason = error.message; item.status = /mismatch/u.test(error.message) ? 'mismatch' : 'unverified'; issues.push(diagnostic(item.status === 'mismatch' ? 'CONTRACT_PROOF_MISMATCH' : 'CONTRACT_PROOF_UNVERIFIED', `/evidence_links/fact_proofs/${p.id}`, error.message, { proof_id: p.id })); }
    Object.assign(item, env.proofTrace(), { source_paths: localSources.map(s => ({ ...s })) });
    results.push(item);
  }
  for (const receipt of env.receipts) receipts.add(receipt);
  report.receipt_ids = [...receipts].sort(); report.verified_contract_paths = [...new Set(verified)].sort();
  report.verified_sources = [...new Map(sources.map(s => [key(s), s])).values()].sort((a, b) => key(a).localeCompare(key(b)));
  ordered(issues); report.ok = issues.length === 0 && results.every(r => r.status === 'verified');
  if (verified.length || sources.length) computedCoverage.set(report, { component_id: record.id, record: structuredClone(record), live: structuredClone(env.tree(record.id).packet), paths: [...report.verified_contract_paths], sources: report.verified_sources.map(s => ({ ...s })) });
  return report;
}
export function applyContractFactProofCoverage({ facts, proofs } = {}) {
  // Only this module's computed result may close gaps. Caller flags, copied JSON
  // reports and mutations of the public report never establish coverage.
  const computed = computedCoverage.get(proofs);
  if (!computed || computed.component_id !== facts?.component_id || !isFigmaContractFactReportFor({ facts, record: computed.record, live: computed.live })) return facts;
  const paths = new Set(computed.paths), sources = computed.sources;
  if (!paths.size && !sources.length) return facts;
  const issues = facts.issues.filter(i => !(i.code === 'CONTRACT_FACT_UNMAPPED' && paths.has(i.contract_path)) && !(i.code === 'FIGMA_FACT_UNCOVERED' && sources.some(s => s.component_id === facts.component_id && s.variant_node_id === i.variant_node_id && s.node_id === i.node_id && s.source_path === i.source_path)));
  const removed = facts.issues.filter(i => !issues.includes(i));
  return { ...facts, ok: issues.length === 0, ...(typeof facts.mapped_contract_fact_count === 'number' ? {mapped_contract_fact_count: facts.mapped_contract_fact_count + removed.filter(i => i.code === 'CONTRACT_FACT_UNMAPPED').length} : {}), ...(typeof facts.mapped_source_fact_count === 'number' ? {mapped_source_fact_count: facts.mapped_source_fact_count + removed.filter(i => i.code === 'FIGMA_FACT_UNCOVERED').length} : {}), issues };
}

