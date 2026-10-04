import {createHash} from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {createContractProofEnvironment} from './contract-fact-proofs.mjs';
import {auditNativeRelationProofs} from './native-relationship-coverage.mjs';
import {applyNativeVariableCoverage} from './native-variable-coverage.mjs';
import {isFigmaContractFactReportFor} from './figma-contract-facts.mjs';
import {ownedContextStructure, resolveArtworkContextReference, verifyArtworkDependency, verifySourceArtworkContext} from './native-artwork-context.mjs';
import {resolveImageFillContextReference, verifyImageFillPaintContext} from './native-image-fill-context.mjs';

// Context proofs reference an independently verified semantic element. They
// never accept field masks, duplicated defaults, or caller-provided success.
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const groups = ['foundation_values', 'source_dependencies', 'fact_proofs', 'normative_decisions', 'native_fact_proofs', 'native_relation_proofs', 'native_variable_proofs', 'native_context_proofs'];
const computed = new WeakMap();
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const closed = (v, keys) => object(v) && keys.every(k => Object.hasOwn(v, k)) && Object.keys(v).every(k => keys.includes(k));
const match = (re, v) => typeof v === 'string' && !/[\r\n]/u.test(v) && re.test(v);
const pointer = (root, path) => path.split('/').slice(1).reduce((v, k) => v?.[k], root);
const digest = v => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const tuple = s => JSON.stringify([s.component_id, s.variant_node_id, s.node_id, s.source_path]);
const issue = (code, path, message) => ({code, path, message});
const ordered = a => a.sort((x, y) => x.path.localeCompare(y.path) || x.code.localeCompare(y.code));
function shape(p) {
  if (!match(ID, p?.id) || !match(ID, p?.structure_proof_id)) return false;
  if (['html-element-context', 'rendered-artwork-context', 'image-fill-paint-context'].includes(p.kind)) return closed(p, ['id', 'kind', 'structure_proof_id']);
  return p.kind === 'source-artwork-context' && closed(p, ['id', 'kind', 'structure_proof_id', 'owner_component_id', 'dependency_link_id']) && match(ID, p.owner_component_id) && match(ID, p.dependency_link_id);
}
const structure = ownedContextStructure;
export function validateNativeContextProofReferences({records = []} = {}) {
  const issues = [], owners = new Set();
  for (const [i, r] of records.entries()) {
    if (owners.has(r.id)) issues.push(issue('NATIVE_CONTEXT_OWNER_AMBIGUOUS', `/records/${i}`, 'One canonical owner required.'));
    owners.add(r.id);
    const links = r.evidence_links ?? {}, proofs = links.native_context_proofs ?? [], base = `/records/${i}/evidence_links`;
    if (!Array.isArray(proofs)) {issues.push(issue('NATIVE_CONTEXT_SHAPE_INVALID', base, 'Context proofs must be an optional closed array.')); continue;}
    if (!proofs.length) continue;
    const ids = new Set(), references = new Set();
    for (const group of groups) for (const [j, p] of (Array.isArray(links[group]) ? links[group] : []).entries()) {
      if (ids.has(p?.id)) issues.push(issue('NATIVE_CONTEXT_ID_DUPLICATE', `${base}/${group}/${j}`, 'IDs are unique across owned evidence arrays.'));
      ids.add(p?.id);
    }
    for (const [j, p] of proofs.entries()) {
      const at = `${base}/native_context_proofs/${j}`;
      if (!shape(p)) {issues.push(issue('NATIVE_CONTEXT_SHAPE_INVALID', at, 'Closed supported context reference required.')); continue;}
      try {
        if (p.kind === 'html-element-context') {
          const relation = structure(r, p), e = pointer(r, relation.element_path);
          if (['asset', 'icon', 'template'].includes(r.identity?.semantic_role) || !['presentation-table', 'html-text', 'html-link', 'nested-component', 'direct-image'].includes(e?.render_mode)) throw Error('ordinary HTML element capability required; source artwork is a separate boundary');
        } else if (p.kind === 'image-fill-paint-context') resolveImageFillContextReference({record: r, proof: p});
        else resolveArtworkContextReference({record: r, proof: p, records});
      } catch (error) {issues.push(issue('NATIVE_CONTEXT_TARGET_INVALID', at, error.message));}
      const reference = JSON.stringify([p.owner_component_id ?? r.id, p.structure_proof_id, p.dependency_link_id ?? null]);
      if (references.has(reference)) issues.push(issue('NATIVE_CONTEXT_SOURCE_DUPLICATE', at, 'One context per independently verified element/dependency.'));
      references.add(reference);
    }
  }
  return ordered(issues);
}
function directFact(record, relation, node, factId, sourcePath) {
  const e = pointer(record, relation.element_path), fs = e.facts.map((f, i) => ({f, i})).filter(({f}) => f.id === factId || (factId === 'layout-orientation' && f.id === 'layout-axis'));
  if (fs.length !== 1) return false;
  const {f, i} = fs[0], links = (record.contracts.figma_fact_links ?? []).filter(l => l.contract_path === `${relation.element_path}/facts/${i}/value/value`);
  if (!['figma-literal', 'figma-binding'].includes(f.provenance?.kind) || f.provenance.node_id !== node.node_id || links.length !== 1 ||
      f.value?.type !== ({'/layout_grow': 'number', '/minimum_width_px': 'measure', '/clips_content': 'boolean'}[sourcePath] ?? 'keyword') ||
      (sourcePath === '/minimum_width_px' && (f.value.unit !== 'px' || !Number.isFinite(f.value.value) || f.value.value < 0))) return false;
  const l = links[0], value = pointer(node, sourcePath);
  return l.variant_node_id === relation.source.variant_node_id && l.node_id === node.node_id && l.source_path === sourcePath &&
    (l.transform === 'identity' ? equal(f.value.value, value) : l.transform === 'lowercase' && typeof value === 'string' && f.value.value === value.toLowerCase());
}
function paintContext(record, relation, node, packet, add) {
  if (packet.capture_errors.some(error => error.node_id === node.node_id && error.field === 'fills')) throw Error('capture could not establish complete native paint; absence is unverified');
  if (!Object.hasOwn(node, 'fills')) return;
  const e = pointer(record, relation.element_path), colors = e.facts.filter(f => f.value?.type === 'color');
  if (equal(node.fills, [])) {
    if (colors.length) throw Error('empty native paint cannot satisfy an own canonical color');
    add('/fills'); return;
  }
  if (!Array.isArray(node.fills) || node.fills.length !== 1 || !closed(node.fills[0], ['type', 'visible', 'opacity', 'color'])) throw Error('one complete supported native paint required');
  const paint = node.fills[0];
  if (paint.type !== 'solid' || paint.opacity !== 1 || !/^#[0-9A-Fa-f]{6}$/u.test(paint.color)) throw Error('opaque solid native paint required');
  if (paint.visible === false && e.render_mode === 'direct-image' && colors.length === 0) {
    // An independently verified rendered-node boundary preserves artwork.
    // An explicitly hidden paint contributes no HTML background or matte.
    for (const key of ['type', 'visible', 'opacity', 'color']) add(`/fills/0/${key}`);
    return;
  }
  if (paint.visible !== true) throw Error('visible own HTML paint required');
  const mappings = (record.contracts.figma_fact_links ?? []).filter(l => l.variant_node_id === relation.source.variant_node_id && l.node_id === node.node_id && l.source_path === '/fills/0/color');
  if (mappings.length !== 1 || mappings[0].transform !== 'identity') throw Error('one independent same-node color mapping required');
  const f = pointer(record, mappings[0].contract_path.replace(/\/value\/value$/u, ''));
  if (!e.facts.includes(f) || f.value?.type !== 'color' || f.value.value !== paint.color || !['figma-literal', 'figma-binding'].includes(f.provenance?.kind) || f.provenance.node_id !== node.node_id) throw Error('exact own typed paint value/provenance required');
  for (const key of ['type', 'visible', 'opacity']) add(`/fills/0/${key}`);
}
function inertNoneContext(record, relation, node, e, add) {
  const divider = e.render_mode === 'presentation-table' && e.semantic_role === 'divider' && e.children.length === 0 && (node.children ?? []).length === 0;
  const image = e.render_mode === 'direct-image' && e.children.length === 0;
  if ((!divider && !image) || !directFact(record, relation, node, 'horizontal-sizing', '/layout/horizontal_sizing') ||
      !directFact(record, relation, node, 'vertical-sizing', '/layout/vertical_sizing') || !directFact(record, relation, node, 'layout-wrap', '/layout/wrap')) throw Error('NONE requires a verified flat divider or rendered image with mapped sizing/wrap');
  const layout = node.layout;
  for (const [key, wanted] of [['mode', 'NONE'], ['wrap', 'NO_WRAP'], ['primary_axis_sizing', 'AUTO'], ['counter_axis_sizing', 'FIXED'], ['primary_axis_alignment', 'MIN'], ['counter_axis_alignment', 'MIN'], ['item_spacing', 0], ['counter_axis_spacing', 0]]) {
    if (!equal(layout[key], wanted)) throw Error(`unsupported inert NONE layout ${key}`);
    add(`/layout/${key}`);
  }
  if (!closed(layout.padding, ['top', 'right', 'bottom', 'left']) || Object.values(layout.padding).some(value => value !== 0)) throw Error('inert NONE padding must be explicitly zero');
  for (const side of ['top', 'right', 'bottom', 'left']) add(`/layout/padding/${side}`);
}
function verifyContext(record, relation, node, packet, add, ordinaryHtml) {
  const e = pointer(record, relation.element_path);
  // These are semantic absence conditions for ordinary HTML, not a global
  // list of fields to ignore. Any active unsupported appearance fails proof.
  for (const [path, wanted] of [['/layout_positioning', 'AUTO'], ['/opacity', 1], ['/rotation', 0], ['/strokes', []]]) {
    if (!equal(pointer(node, path), wanted)) throw Error(`unsupported HTML context at ${path}`);
    add(path);
  }
  if (node.minimum_width_px === null) add('/minimum_width_px');
  else if (!directFact(record, relation, node, 'minimum-width', '/minimum_width_px')) throw Error('minimum width requires an independently mapped exact px measure');
  if (Object.hasOwn(node, 'clips_content')) {
    if (ordinaryHtml) {
      if (node.clips_content === false) add('/clips_content');
      else if (!directFact(record, relation, node, 'clip-content', '/clips_content')) throw Error('active clipping requires an independently mapped exact Boolean');
    } else if (typeof node.clips_content !== 'boolean') throw Error('complete rendered artwork clipping qualifier required');
    // The other admitted path already passed the owned PNG/rendered-node
    // preserve-artwork boundary verifier. Its native clipping is not an HTML
    // scalar. Do not remove that raw obligation as ordinary HTML coverage.
  }
  if (Object.hasOwn(node, 'effects')) {
    if (!equal(node.effects, [])) throw Error('active effects require their own supported implementation');
    add('/effects');
  }
  if (node.layout_grow === 0) add('/layout_grow');
  else if (!directFact(record, relation, node, 'layout-grow', '/layout_grow')) throw Error('nonzero grow requires an independently mapped exact fact');
  if (Object.hasOwn(node, 'layout_align')) {
    if (node.layout_align === 'INHERIT') add('/layout_align');
    else if (!directFact(record, relation, node, 'layout-align', '/layout_align')) throw Error('explicit alignment requires an independently mapped exact fact');
  }
  if (equal(node.variable_bindings, {})) add('/variable_bindings');
  // Nonempty bindings are deliberately not covered here; the variable proof
  // checks exact identities, definitions, consumer modes and scalar mappings.
  paintContext(record, relation, node, packet, add);
  if (node.layout !== undefined) {
    if (!object(node.layout)) throw Error('known layout context required');
    if (node.layout.mode === 'NONE') {inertNoneContext(record, relation, node, e, add); return;}
    if (!['HORIZONTAL', 'VERTICAL'].includes(node.layout.mode)) throw Error('known Auto Layout context required');
    if (!directFact(record, relation, node, 'layout-orientation', '/layout/mode') ||
        !directFact(record, relation, node, 'layout-wrap', '/layout/wrap')) throw Error('orientation and wrap need their own same-node mapped facts');
    if (node.layout.wrap !== 'NO_WRAP' || node.layout.counter_axis_spacing !== 0) throw Error('wrapped or nonzero counter-axis spacing requires explicit implementation');
    add('/layout/counter_axis_spacing');
  } else if (e.render_mode === 'presentation-table') throw Error('container layout context missing');
}
export function auditNativeContextProofs({record, model, session} = {}) {
  const report = {ok: false, component_id: record?.id ?? null, canonical_git_sha: model?.canonical_sha ?? null, receipt_ids: [], results: [], issues: [], verified_sources: []};
  const proofs = record?.evidence_links?.native_context_proofs ?? [];
  if (Array.isArray(proofs) && !proofs.length) {report.ok = true; return report;}
  const canonical = model?.records?.filter(r => r.id === record?.id);
  if (canonical?.length !== 1 || !equal(canonical[0], record)) {report.issues.push(issue('NATIVE_CONTEXT_CANONICAL_MISMATCH', '/record', 'Exact canonical record required.')); return report;}
  const validation = validateNativeContextProofReferences({records: model.records}), env = createContractProofEnvironment(model, session);
  const relationReports = new Map();
  const relationsFor = owner => {if (!relationReports.has(owner.id)) relationReports.set(owner.id, auditNativeRelationProofs({record: owner, model, session})); return relationReports.get(owner.id);};
  report.issues.push(...validation, ...env.issues);
  for (const p of Array.isArray(proofs) ? proofs : []) {
    const item = {proof_id: p?.id ?? null, kind: p?.kind ?? null, status: 'unverified'}, local = [];
    env.beginProof();
    try {
      if (validation.length || env.issues.length) throw Error('context metadata/session unverified');
      const boundary = ['html-element-context', 'image-fill-paint-context'].includes(p.kind) ? null : resolveArtworkContextReference({record, proof: p, records: model.records});
      const owner = boundary?.owner ?? record, relation = boundary?.relation ?? structure(record, p);
      const result = relationsFor(owner).results.filter(r => r.proof_id === relation.id);
      if (result.length !== 1 || result[0].status !== 'verified') throw Error('independent ordered element structure is unverified');
      const entry = boundary ? verifyArtworkDependency({record, proof: p, boundary, env}) : env.selected(relation.source);
      const source = entry.selector, add = path => local.push({...source, source_path: path});
      if (p.kind === 'source-artwork-context') verifySourceArtworkContext({record, entry, add});
      else if (p.kind === 'image-fill-paint-context') item.foundation_paths = verifyImageFillPaintContext({record, proof: p, entry, model, add});
      else verifyContext(record, relation, entry.node, entry.packet, add, p.kind === 'html-element-context');
      item.status = 'verified'; report.verified_sources.push(...local);
    } catch (error) {
      item.reason = error.message; report.issues.push(issue('NATIVE_CONTEXT_UNVERIFIED', `/evidence_links/native_context_proofs/${p?.id ?? 'invalid'}`, error.message));
    }
    Object.assign(item, env.proofTrace(), {source_paths: item.status === 'verified' ? local : []}); report.results.push(item);
  }
  report.receipt_ids = [...env.receipts].sort();
  report.verified_sources = [...new Map(report.verified_sources.map(s => [tuple(s), s])).values()].sort((a, b) => tuple(a).localeCompare(tuple(b)));
  ordered(report.issues); report.ok = !report.issues.length && report.results.every(r => r.status === 'verified');
  if (report.verified_sources.length) computed.set(report, {record: structuredClone(record), live: structuredClone(env.tree(record.id).packet), sources: structuredClone(report.verified_sources), digest: digest(report)});
  return report;
}
export function applyNativeContextCoverage({facts, coverage, nativeVariableProofs, nativeRelationProofs, nativeFactProofs, contractProofs} = {}) {
  const base = applyNativeVariableCoverage({facts, coverage: nativeVariableProofs, nativeRelationProofs, nativeFactProofs, contractProofs});
  const trusted = computed.get(coverage);
  if (!trusted || digest(coverage) !== trusted.digest || !isFigmaContractFactReportFor({facts, record: trusted.record, live: trusted.live})) return base;
  const sources = new Set(trusted.sources.map(tuple));
  const issues = base.issues.filter(i => !(i.code === 'FIGMA_FACT_UNCOVERED' && sources.has(tuple({component_id: facts.component_id, ...i}))));
  const removed = base.issues.length - issues.length;
  return removed ? {...base, ok: !issues.length, ...(typeof base.mapped_source_fact_count === 'number' ? {mapped_source_fact_count: base.mapped_source_fact_count + removed} : {}), issues} : base;
}
