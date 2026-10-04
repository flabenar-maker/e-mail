import {createHash} from 'node:crypto';
import {artworkPlacementName, verifyRegisteredArtworkInstance} from './native-owned-artwork.mjs';
import {isDeepStrictEqual as equal} from 'node:util';
import {createContractProofEnvironment} from './contract-fact-proofs.mjs';
import {applyNativeFactCoverage} from './native-fact-coverage.mjs';
import {isFigmaContractFactReportFor} from './figma-contract-facts.mjs';

// Structural evidence references canonical elements and controls, never a second
// copy of the native tree or a caller-supplied mask of acceptable source fields.
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ROOT = /^[0-9]+:[0-9]+$/u;
const NODE = /^(?:[0-9]+:[0-9]+|I[0-9]+:[0-9]+(?:;[0-9]+:[0-9]+)+)$/u;
const PATH = /^\/contracts\/(?:mobile|desktop|variant_contracts\/\d+)\/root(?:\/children\/\d+)*$/u;
const groups = ['foundation_values', 'source_dependencies', 'fact_proofs', 'normative_decisions', 'native_fact_proofs', 'native_relation_proofs', 'native_variable_proofs', 'native_context_proofs'];
const computed = new WeakMap();
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const closed = (v, keys) => object(v) && keys.every(k => Object.hasOwn(v, k)) && Object.keys(v).every(k => keys.includes(k));
const match = (re, v) => typeof v === 'string' && !/[\r\n]/u.test(v) && re.test(v);
const pointer = (root, path) => typeof path === 'string' ? path.split('/').slice(1).reduce((v, k) => v?.[k], root) : undefined;
const finite = v => typeof v === 'number' && Number.isFinite(v);
const number = v => finite(v) && Math.abs(v - Math.round(v)) < 0.0001 ? Math.round(v) : v;
const digest = v => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const tuple = s => JSON.stringify([s.component_id, s.variant_node_id, s.node_id, s.source_path]);
const issue = (code, path, message) => ({code, path, message});
const ordered = a => a.sort((x, y) => x.path.localeCompare(y.path) || x.code.localeCompare(y.code));
const variants = r => r?.variants?.length ? r.variants : [{node_id: r?.figma?.node_id, axes: []}];
const selectorShape = s => closed(s, ['component_id', 'variant_node_id', 'node_id']) && match(ID, s.component_id) && match(ROOT, s.variant_node_id) && match(NODE, s.node_id);
const normalizeProperty = name => name.replace(/#\d+:\d+$/u, '');
function viewport(record, path) {
  const plain = /^\/contracts\/(mobile|desktop)\//u.exec(path)?.[1];
  const index = /^\/contracts\/variant_contracts\/(\d+)\//u.exec(path)?.[1];
  return plain ?? record.contracts?.variant_contracts?.[index]?.axes?.find(a => a.name === 'Viewport')?.value?.toLowerCase();
}
function shape(p) {
  const field = p?.kind === 'element-structure' ? 'element_path' : p?.kind === 'owner-controls' ? 'default_variant_id' : null;
  return field && closed(p, ['id', 'kind', 'source', field]) && match(ID, p.id) && selectorShape(p.source) &&
    (field === 'element_path' ? match(PATH, p[field]) : match(ID, p[field]));
}
function reference(record, path, source) {
  const element = pointer(record, path);
  const matches = element?.facts?.map((f, i) => ({f, i})).filter(({f}) => f.id === 'reference-size');
  if (matches?.length !== 1) throw Error('one independently mapped reference-size fact required');
  const {f, i} = matches[0], v = f.value;
  if (!closed(v, ['type', 'width', 'height', 'unit']) || v.type !== 'dimensions' || v.unit !== 'px' ||
      !finite(v.width) || !finite(v.height) || v.width < 0 || v.height < 0 ||
      !['figma-literal', 'figma-binding'].includes(f.provenance?.kind) || f.provenance.node_id !== source.node_id) throw Error('same-node typed reference dimensions/provenance required');
  for (const key of ['width', 'height']) {
    const mappings = (record.contracts?.figma_fact_links ?? []).filter(l => l.contract_path === `${path}/facts/${i}/value/${key}`);
    if (mappings.length !== 1 || mappings[0].variant_node_id !== source.variant_node_id || mappings[0].node_id !== source.node_id || mappings[0].source_path !== `/reference_dimensions/${key}` || mappings[0].transform !== 'identity') throw Error('unique direct reference dimension mapping required');
  }
  return {element, fact: f};
}
export function validateNativeRelationProofReferences({records = []} = {}) {
  const issues = [], owners = new Map();
  for (const [i, r] of records.entries()) {
    if (owners.has(r.id)) issues.push(issue('NATIVE_RELATION_OWNER_AMBIGUOUS', `/records/${i}`, 'One canonical record per owner is required.'));
    owners.set(r.id, r);
  }
  for (const [i, r] of records.entries()) {
    const links = r.evidence_links ?? {}, proofs = links.native_relation_proofs ?? [], base = `/records/${i}/evidence_links`;
    if (!Array.isArray(proofs)) {issues.push(issue('NATIVE_RELATION_SHAPE_INVALID', base, 'Relation proofs must be an optional closed array.')); continue;}
    if (!proofs.length) continue;
    const ids = new Set(), obligations = new Set();
    for (const group of groups) for (const [j, item] of (Array.isArray(links[group]) ? links[group] : []).entries()) {
      if (ids.has(item?.id)) issues.push(issue('NATIVE_RELATION_ID_DUPLICATE', `${base}/${group}/${j}`, 'IDs are unique across owned evidence arrays.'));
      ids.add(item?.id);
    }
    for (const [j, p] of proofs.entries()) {
      const at = `${base}/native_relation_proofs/${j}`;
      if (!shape(p)) {issues.push(issue('NATIVE_RELATION_SHAPE_INVALID', at, 'Only closed supported relation metadata is accepted.')); continue;}
      const vs = variants(r).filter(v => v.node_id === p.source.variant_node_id);
      if (owners.get(p.source.component_id) !== r || vs.length !== 1) issues.push(issue('NATIVE_RELATION_SELECTOR_INVALID', at, 'Exact registered own variant required.'));
      if (p.kind === 'element-structure') {
        const sourceViewport = vs[0]?.axes?.find(a => a.name === 'Viewport')?.value?.toLowerCase();
        if (sourceViewport && sourceViewport !== viewport(r, p.element_path)) issues.push(issue('NATIVE_RELATION_SELECTOR_INVALID', at, 'Element and selected variant viewports must agree.'));
        try {reference(r, p.element_path, p.source);} catch (e) {issues.push(issue('NATIVE_RELATION_TARGET_INVALID', at, e.message));}
      } else if (r.identity?.node_kind !== 'component-set' || p.source.node_id !== p.source.variant_node_id ||
          r.variants?.filter(v => v.id === p.default_variant_id && v.node_id === p.source.variant_node_id).length !== 1) {
        issues.push(issue('NATIVE_RELATION_TARGET_INVALID', at, 'Explicit registered default variant/root reference required.'));
      }
      const key = JSON.stringify([p.kind, p.source]);
      if (obligations.has(key)) issues.push(issue('NATIVE_RELATION_SOURCE_DUPLICATE', at, 'One relation per exact native source and kind is allowed.'));
      obligations.add(key);
    }
  }
  return ordered(issues);
}
function verifyDimensions(record, path, source, node) {
  const t = reference(record, path, source), d = node.reference_dimensions;
  if (!closed(d, ['width', 'height', 'unit']) || d.unit !== 'px' || !finite(d.width) || !finite(d.height) ||
      t.fact.value.width !== number(d.width) || t.fact.value.height !== number(d.height)) throw Error('native reference-size mismatch');
  return t.element;
}
function childSelector(record, path, variantId) {
  const e = pointer(record, path), fs = e?.facts?.filter(f => f.id === 'reference-size');
  if (fs?.length !== 1 || typeof fs[0].provenance?.node_id !== 'string') throw Error('child reference identity missing');
  const s = {component_id: record.id, variant_node_id: variantId, node_id: fs[0].provenance.node_id};
  reference(record, path, s); return s;
}
function visibility(record, e, node, packet, add) {
  if (closed(e.visibility, ['mode']) && e.visibility.mode === 'always') {
    if (node.visible !== true || !equal(node.component_property_references, {})) throw Error('always visibility/native references mismatch');
    add('/visible'); add('/component_property_references'); return;
  }
  if (!closed(e.visibility, ['mode', 'property_id']) || e.visibility.mode !== 'property') throw Error('unsupported visibility mode');
  const properties = record.properties?.filter(p => p.id === e.visibility.property_id);
  if (properties?.length !== 1 || properties[0].type !== 'boolean' || typeof properties[0].default !== 'boolean') throw Error('canonical Boolean visibility property missing');
  const property = properties[0], refs = node.component_property_references;
  const definitions = packet.component_properties.filter(p => p.name === property.figma_name);
  if (definitions.length !== 1 || definitions[0].type !== 'BOOLEAN' || definitions[0].default !== property.default || definitions[0].variant_options !== null ||
      !closed(refs, ['visible']) || typeof refs.visible !== 'string' || normalizeProperty(refs.visible) !== property.figma_name || node.visible !== property.default) throw Error('exact Boolean reference/default/visibility mismatch');
  add('/visible'); add('/component_property_references/visible');
}
function instance(record, e, source, node, env, add) {
  if (e.render_mode === 'direct-image') {
    const assets = record.asset_contracts?.filter(a => a.id === e.asset_contract_id);
    if (assets?.length !== 1 || artworkPlacementName({record, element: e, asset: assets[0], variant_node_id: source.variant_node_id}) !== node.name || assets[0].source_mode_id !== 'rendered-node') throw Error('rendered-node asset ownership required');
    env.dependencies(record.id);
    const deps = record.evidence_links?.source_dependencies?.filter(l => l.source.node_id === node.node_id && l.source.variant_node_id === source.variant_node_id && l.asset_owner.node_id === node.node_id && l.asset_owner.asset_id === e.asset_contract_id);
    if (deps?.length !== 1) throw Error('one owned source dependency required for direct-image instance');
    const {variant} = verifyRegisteredArtworkInstance({record, link: deps[0], node, records: env.records});
    add('/main_component_id');
    if (variant.axes.length) for (const axis of variant.axes) for (const key of ['type', 'value', 'boundVariables']) add('/instance_properties/' + axis.name + '/' + key);
    else add('/instance_properties');
    return;
  }
  const child = env.lookup(e.component_id);
  if (child.figma.file_key !== record.figma.file_key || (child.properties?.length ?? 0) !== 0) throw Error('same-file nested component without unmodeled controls required');
  const selected = variants(child).filter(v => v.node_id === node.main_component_id);
  if (selected.length !== 1 || !selected[0].axes.length) throw Error('one registered nested main variant required');
  env.selected({component_id: child.id, variant_node_id: selected[0].node_id, node_id: selected[0].node_id});
  const props = node.instance_properties, expected = Object.fromEntries(selected[0].axes.map(a => [a.name, {type: 'VARIANT', value: a.value, boundVariables: {}}]));
  if (!equal(props, expected)) throw Error('complete nested instance axes/properties mismatch');
  for (const axis of selected[0].axes) {
    const matches = (record.contracts?.figma_fact_links ?? []).filter(l => l.variant_node_id === source.variant_node_id && l.node_id === source.node_id && l.source_path === `/instance_properties/${axis.name}/value`);
    if (matches.length !== 1 || matches[0].transform !== 'lowercase') throw Error('nested axis value needs its own independent direct mapping');
    const fact = pointer(record, matches[0].contract_path.replace(/\/value$/u, ''));
    if (fact?.type !== 'keyword' || fact.value !== axis.value.toLowerCase()) throw Error('nested instance canonical axis value mismatch');
    add(`/instance_properties/${axis.name}/type`); add(`/instance_properties/${axis.name}/boundVariables`);
  }
  add('/main_component_id');
}
// Admission of a flat owned IMAGE boundary proves structure only. Paint
// values, crop, filters, source resolution and export geometry remain separate
// raw obligations; this is not artwork/export coverage.
function imagePaintShape(paint) {
  const required = ['type', 'visible', 'opacity', 'image_hash', 'scale_mode'];
  const optional = ['image_transform', 'scaling_factor', 'rotation', 'filters'];
  if (!object(paint) || required.some(k => !Object.hasOwn(paint, k)) || Object.keys(paint).some(k => ![...required, ...optional].includes(k)) ||
      paint.type !== 'image' || paint.visible !== true || paint.opacity !== 1 || typeof paint.image_hash !== 'string' || !paint.image_hash.trim() ||
      !['FILL', 'FIT', 'CROP', 'TILE'].includes(paint.scale_mode)) return false;
  if (Object.hasOwn(paint, 'image_transform') && (!Array.isArray(paint.image_transform) || paint.image_transform.length !== 2 || paint.image_transform.some(row => !Array.isArray(row) || row.length !== 3 || row.some(n => !finite(n))))) return false;
  if (Object.hasOwn(paint, 'scaling_factor') && (!finite(paint.scaling_factor) || paint.scaling_factor <= 0)) return false;
  if (Object.hasOwn(paint, 'rotation') && !finite(paint.rotation)) return false;
  if (Object.hasOwn(paint, 'filters') && (!closed(paint.filters, ['exposure', 'contrast', 'saturation', 'temperature', 'tint', 'highlights', 'shadows']) || Object.values(paint.filters).some(n => !finite(n)))) return false;
  return true;
}
function structure(record, p, env, add) {
  const entry = env.selected(p.source), node = entry.node;
  const e = verifyDimensions(record, p.element_path, p.source, node);
  const root = p.source.node_id === p.source.variant_node_id;
  const assetElement = ['direct-image', 'background-image'].includes(e.render_mode);
  const candidates = assetElement ? record.asset_contracts?.filter(a => a.id === e.asset_contract_id) : [];
  if (assetElement && candidates?.length !== 1) throw Error('one unambiguous own asset contract required');
  const ownAsset = candidates?.[0] ?? null;
  const fillBoundary = ownAsset?.source_mode_id === 'image-fill' && ownAsset.export_boundary?.kind === 'fill';
  if (fillBoundary && (!closed(ownAsset.export_boundary, ['kind', 'semantic_node_name']) ||
      !(ownAsset.display_mode_id === 'direct-image' && e.render_mode === 'direct-image' || ownAsset.display_mode_id === 'fill-image' && ['direct-image', 'background-image'].includes(e.render_mode)))) throw Error('declared image-fill display capability/boundary mismatch');
  const type = root ? 'COMPONENT' : ({'presentation-table': 'FRAME', 'html-text': 'TEXT', 'html-link': 'TEXT', 'nested-component': 'INSTANCE', 'direct-image': fillBoundary ? 'FRAME' : 'INSTANCE', 'background-image': fillBoundary ? 'FRAME' : undefined})[e.render_mode];
  if (!type || node.node_type !== type) throw Error('canonical element/native class mismatch');
  const variant = variants(record).find(v => v.node_id === p.source.variant_node_id);
  const asset = ownAsset;
  const name = root ? variant.axes.length ? variant.axes.map(a => `${a.name}=${a.value}`).join(', ') : record.identity.figma_name : asset?.source_mode_id === 'rendered-node' && asset.export_profile_id === 'png-4x' ? artworkPlacementName({record, element: e, asset, variant_node_id: p.source.variant_node_id}) : asset?.owner_layer_name ?? e.semantic_role;
  if (typeof name !== 'string' || node.name !== name) throw Error('canonical semantic/variant name mismatch');
  visibility(record, e, node, entry.packet, add);
  if (e.render_mode === 'direct-image' || e.render_mode === 'background-image' || e.render_mode === 'nested-component') {
    if (e.children?.length !== 0) throw Error('HTML children cannot flatten an asset/nested boundary');
    if (node.node_type === 'INSTANCE') instance(record, e, p.source, node, env, add);
    else if (fillBoundary) {
      if (asset.owner_layer_name !== node.name || !Array.isArray(node.children) || node.children.length !== 0 || asset.export_boundary.semantic_node_name !== node.name ||
          !Array.isArray(node.fills) || node.fills.length !== 1 || !imagePaintShape(node.fills[0])) throw Error('exact flat owned image-fill boundary required');
    } else if (e.render_mode !== 'direct-image' || record.identity.semantic_role !== 'asset' || !asset || asset.owner_layer_name !== node.name || asset.source_mode_id !== 'rendered-node') throw Error('own source asset boundary required');
  } else {
    if (!Array.isArray(e.children) || (node.children !== undefined && !Array.isArray(node.children))) throw Error('complete canonical/native child arrays required');
    const expected = e.children.map((_, i) => childSelector(record, `${p.element_path}/children/${i}`, p.source.variant_node_id).node_id);
    const actual = (node.children ?? []).map(c => c.node_id);
    if (new Set(expected).size !== expected.length || !equal(actual, expected)) throw Error('ordered independent child identities mismatch');
    e.children.forEach((_, i) => {
      const childSource = childSelector(record, `${p.element_path}/children/${i}`, p.source.variant_node_id);
      verifyDimensions(record, `${p.element_path}/children/${i}`, childSource, env.selected(childSource).node);
    });
    if (expected.length) add('/children_order');
  }
  add('/name'); add('/node_type');
}
function controls(record, p, env, add) {
  const entry = env.selected(p.source), selected = record.variants.find(v => v.id === p.default_variant_id);
  const expected = new Map();
  for (const property of record.properties ?? []) {
    if (property.type !== 'boolean' || typeof property.default !== 'boolean' || expected.has(property.figma_name)) throw Error('unique canonical Boolean controls required');
    expected.set(property.figma_name, {name: property.figma_name, type: 'BOOLEAN', default: property.default, variant_options: null});
  }
  const axes = selected.axes;
  for (const axis of axes) {
    const domain = [...new Set(record.variants.map(v => v.axes.find(a => a.name === axis.name)?.value))];
    if (expected.has(axis.name) || domain.some(v => typeof v !== 'string') || !domain.includes(axis.value)) throw Error('complete independent canonical axis domain required');
    expected.set(axis.name, {name: axis.name, type: 'VARIANT', default: axis.value, variant_options: domain.sort()});
  }
  if (record.variants.some(v => v.axes.length !== axes.length || new Set(v.axes.map(a => a.name)).size !== axes.length || v.axes.some(a => !axes.some(s => s.name === a.name)))) throw Error('all canonical variants need the same unique axes');
  const actual = entry.packet.component_properties, names = new Set();
  if (actual.length !== expected.size) throw Error('complete control definition set mismatch');
  actual.forEach((definition, i) => {
    const target = expected.get(definition.name);
    if (!closed(definition, ['name', 'type', 'default', 'variant_options']) || names.has(definition.name) || !target) throw Error('unknown, duplicate or incomplete native control');
    names.add(definition.name);
    const normalized = {...definition};
    if (definition.type === 'VARIANT') {
      if (!Array.isArray(definition.variant_options) || new Set(definition.variant_options).size !== definition.variant_options.length || definition.variant_options.some(v => typeof v !== 'string')) throw Error('unique actual variant options required');
      normalized.variant_options = [...definition.variant_options].sort();
    }
    if (!equal(normalized, target)) throw Error('canonical control type/default/domain mismatch');
    const owner = {component_id: record.id, variant_node_id: record.figma.node_id, node_id: record.figma.node_id};
    for (const key of ['name', 'type', 'default']) add(`/component_properties/${i}/${key}`, owner);
    if (definition.variant_options === null) add(`/component_properties/${i}/variant_options`, owner);
    else definition.variant_options.forEach((_, j) => add(`/component_properties/${i}/variant_options/${j}`, owner));
  });
}
export function auditNativeRelationProofs({record, model, session} = {}) {
  const report = {ok: false, component_id: record?.id ?? null, canonical_git_sha: model?.canonical_sha ?? null, receipt_ids: [], results: [], issues: [], verified_sources: []};
  const proofs = record?.evidence_links?.native_relation_proofs ?? [];
  if (Array.isArray(proofs) && !proofs.length) {report.ok = true; return report;}
  const canonical = model?.records?.filter(r => r.id === record?.id);
  if (canonical?.length !== 1 || !equal(canonical[0], record)) {report.issues.push(issue('NATIVE_RELATION_CANONICAL_MISMATCH', '/record', 'Exact canonical record required.')); return report;}
  const validation = validateNativeRelationProofReferences({records: model.records}), env = createContractProofEnvironment(model, session);
  report.issues.push(...validation, ...env.issues);
  for (const p of Array.isArray(proofs) ? proofs : []) {
    const item = {proof_id: p?.id ?? null, kind: p?.kind ?? null, status: 'unverified'}, local = [];
    env.beginProof();
    try {
      if (validation.length || env.issues.length) throw Error('relation metadata/session unverified');
      const add = (path, source = p.source) => local.push({...source, source_path: path});
      if (p.kind === 'element-structure') structure(record, p, env, add);
      else controls(record, p, env, add);
      item.status = 'verified'; report.verified_sources.push(...local);
    } catch (e) {
      item.reason = e.message; report.issues.push(issue('NATIVE_RELATION_UNVERIFIED', `/evidence_links/native_relation_proofs/${p?.id ?? 'invalid'}`, e.message));
    }
    Object.assign(item, env.proofTrace(), {source_paths: item.status === 'verified' ? local : []}); report.results.push(item);
  }
  report.receipt_ids = [...env.receipts].sort();
  report.verified_sources = [...new Map(report.verified_sources.map(s => [tuple(s), s])).values()].sort((a, b) => tuple(a).localeCompare(tuple(b)));
  ordered(report.issues); report.ok = !report.issues.length && report.results.every(r => r.status === 'verified');
  if (report.verified_sources.length) computed.set(report, {record: structuredClone(record), live: structuredClone(env.tree(record.id).packet), sources: structuredClone(report.verified_sources), digest: digest(report)});
  return report;
}
export function applyNativeRelationCoverage({facts, coverage, nativeFactProofs, contractProofs} = {}) {
  const base = applyNativeFactCoverage({facts, coverage: nativeFactProofs, contractProofs});
  const trusted = computed.get(coverage);
  if (!trusted || digest(coverage) !== trusted.digest || !isFigmaContractFactReportFor({facts, record: trusted.record, live: trusted.live})) return base;
  const sources = new Set(trusted.sources.map(tuple));
  const issues = base.issues.filter(i => !(i.code === 'FIGMA_FACT_UNCOVERED' && sources.has(tuple({component_id: facts.component_id, ...i}))));
  const removed = base.issues.length - issues.length;
  if (!removed) return base;
  return {...base, ok: !issues.length, ...(typeof base.mapped_source_fact_count === 'number' ? {mapped_source_fact_count: base.mapped_source_fact_count + removed} : {}), issues};
}
