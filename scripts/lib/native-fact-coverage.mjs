import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { createContractProofEnvironment, applyContractFactProofCoverage } from './contract-fact-proofs.mjs';
import { isFigmaContractFactReportFor } from './figma-contract-facts.mjs';

// Native reductions supplement an independently mapped same-node fact. They
// neither supply HTML values nor turn unknown native fields into defaults.
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ROOT = /^[0-9]+:[0-9]+$/u;
const NODE = /^(?:[0-9]+:[0-9]+|I[0-9]+:[0-9]+(?:;[0-9]+:[0-9]+)+)$/u;
const PATH = /^\/contracts\/(?:mobile|desktop|variant_contracts\/\d+)\/root(?:\/children\/\d+)*\/facts\/\d+\/value$/u;
const KINDS = ['uniform-corners', 'text-resize-alias', 'text-alignment-alias', 'axis-sizing-alias'];
const computed = new WeakMap();
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const closed = (v, keys) => object(v) && keys.every(k => Object.hasOwn(v, k)) && Object.keys(v).every(k => keys.includes(k));
const match = (re, v) => typeof v === 'string' && !/[\r\n]/u.test(v) && re.test(v);
const finite = v => typeof v === 'number' && Number.isFinite(v);
const number = v => finite(v) && Math.abs(v - Math.round(v)) < 0.0001 ? Math.round(v) : v;
const pointer = (root, path) => typeof path === 'string' ? path.split('/').slice(1).reduce((v, part) => v?.[part], root) : undefined;
const equal = isDeepStrictEqual;
const issue = (code, path, message) => ({code, path, message});
const ordered = issues => issues.sort((a, b) => a.path.localeCompare(b.path) || a.code.localeCompare(b.code));
const tuple = s => JSON.stringify([s.component_id, s.variant_node_id, s.node_id, s.source_path]);
const digest = v => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const variants = r => r?.variants?.length ? r.variants : [{node_id: r?.figma?.node_id, axes: []}];
const selectorShape = s => closed(s, ['component_id', 'variant_node_id', 'node_id']) && match(ID, s.component_id) && match(ROOT, s.variant_node_id) && match(NODE, s.node_id);
function target(record, path) {
  if (!match(PATH, path)) return null;
  const fact = pointer(record, path.replace(/\/value$/u, ''));
  const value = pointer(record, path);
  const scope = /^\/contracts\/(mobile|desktop)(?:\/|$)/u.exec(path)?.[1];
  const index = /^\/contracts\/variant_contracts\/(\d+)\//u.exec(path)?.[1];
  return object(value) && object(fact) ? {fact, value, viewport: scope ?? record.contracts?.variant_contracts?.[index]?.viewport} : null;
}
function shape(p) {
  return KINDS.includes(p?.kind) && closed(p, ['id', 'kind', 'source', 'contract_path', ...(p.kind === 'axis-sizing-alias' ? ['axis'] : [])]) &&
    match(ID, p.id) && match(PATH, p.contract_path) && selectorShape(p.source) && (p.kind !== 'axis-sizing-alias' || ['primary', 'counter'].includes(p.axis));
}
function compatible(p, t) {
  return !!t && (p.kind === 'uniform-corners' ? t.value.type === 'measure' && t.value.unit === 'px' && finite(t.value.value) : t.value.type === 'keyword' && typeof t.value.value === 'string');
}
export function validateNativeFactProofReferences({records = []} = {}) {
  const issues = [], owners = new Map();
  for (const [i, r] of records.entries()) {
    if (owners.has(r.id)) issues.push(issue('NATIVE_PROOF_OWNER_AMBIGUOUS', `/records/${i}`, 'One canonical owner per component ID is required.'));
    owners.set(r.id, r);
  }
  for (const [i, r] of records.entries()) {
    const base = `/records/${i}/evidence_links`, links = r.evidence_links ?? {}, proofs = links.native_fact_proofs ?? [];
    if (!Array.isArray(proofs)) {issues.push(issue('NATIVE_PROOF_SHAPE_INVALID', `${base}/native_fact_proofs`, 'Native proofs must be an array.')); continue;}
    if (!proofs.length) continue;
    const ids = new Set(), obligations = new Set();
    for (const group of ['foundation_values', 'source_dependencies', 'fact_proofs', 'normative_decisions', 'native_fact_proofs']) {
      for (const [j, item] of (Array.isArray(links[group]) ? links[group] : []).entries()) {
        if (ids.has(item.id)) issues.push(issue('NATIVE_PROOF_ID_DUPLICATE', `${base}/${group}/${j}/id`, 'IDs are unique across all owned evidence arrays.'));
        ids.add(item.id);
      }
    }
    for (const [j, p] of proofs.entries()) {
      const at = `${base}/native_fact_proofs/${j}`, t = target(r, p?.contract_path);
      if (!shape(p)) {issues.push(issue('NATIVE_PROOF_SHAPE_INVALID', at, 'Unsupported native reduction or non-closed metadata.')); continue;}
      const owner = owners.get(p.source.component_id), vs = variants(r).filter(v => v.node_id === p.source.variant_node_id);
      const viewport = vs[0]?.axes?.find(a => a.name === 'Viewport')?.value?.toLowerCase();
      if (owner !== r || vs.length !== 1 || (viewport && viewport !== t?.viewport)) issues.push(issue('NATIVE_PROOF_SELECTOR_INVALID', `${at}/source`, 'The exact registered source belongs to this owner and target viewport.'));
      if (!compatible(p, t)) issues.push(issue('NATIVE_PROOF_TARGET_INVALID', `${at}/contract_path`, 'A compatible independently mapped typed target is required.'));
      if (!['figma-literal', 'figma-binding'].includes(t?.fact.provenance?.kind) || t.fact.provenance.node_id !== p.source.node_id) issues.push(issue('NATIVE_PROOF_PROVENANCE_INVALID', at, 'Direct provenance must identify the same native node.'));
      const obligation = JSON.stringify([p.source.component_id, p.source.variant_node_id, p.source.node_id, p.kind, p.axis ?? null]);
      if (obligations.has(obligation)) issues.push(issue('NATIVE_PROOF_SOURCE_DUPLICATE', at, 'One native obligation can have only one reduction.'));
      obligations.add(obligation);
    }
  }
  return ordered(issues);
}
function direct(record, p, t, node, sourcePath, transform) {
  const targetPath = `${p.contract_path}/value`;
  const links = (record.contracts?.figma_fact_links ?? []).filter(l => l.contract_path === targetPath);
  if (links.length !== 1 || links[0].variant_node_id !== p.source.variant_node_id || links[0].node_id !== p.source.node_id || links[0].source_path !== sourcePath || links[0].transform !== transform) throw Error('unique exact same-node direct mapping required');
  const raw = pointer(node, sourcePath);
  const value = transform === 'lowercase' && typeof raw === 'string' ? raw.toLowerCase() : number(raw);
  if (raw === undefined || !equal(t.value.value, value)) throw Error('direct native value/typed target mismatch');
  return raw;
}
export function auditNativeFactProofs({record, model, session} = {}) {
  const issues = [], results = [], sources = [];
  const report = {ok: false, component_id: record?.id ?? null, canonical_git_sha: model?.canonical_sha ?? null, receipt_ids: [], results, issues, verified_sources: []};
  const proofs = record?.evidence_links?.native_fact_proofs ?? [];
  if (Array.isArray(proofs) && !proofs.length) {report.ok = true; return report;}
  const canonical = model?.records?.filter(r => r.id === record?.id);
  if (canonical?.length !== 1 || !equal(canonical[0], record)) {issues.push(issue('NATIVE_PROOF_CANONICAL_MISMATCH', '/record', 'Exact canonical record required.')); return report;}
  const validation = validateNativeFactProofReferences({records: model.records}); issues.push(...validation);
  const env = createContractProofEnvironment(model, session); issues.push(...env.issues);
  for (const p of Array.isArray(proofs) ? proofs : []) {
    const item = {proof_id: p?.id ?? null, kind: p?.kind ?? null, status: 'unverified'}, local = [];
    env.beginProof();
    try {
      if (validation.length || env.issues.length) throw Error('native proof reference/session unverified');
      const t = target(record, p.contract_path), e = env.selected(p.source), n = e.node;
      const add = path => local.push({...p.source, source_path: path});
      if (p.kind === 'uniform-corners') {
        const radius = direct(record, p, t, n, '/corner_radius', 'identity');
        const corners = ['top_left', 'top_right', 'bottom_left', 'bottom_right'];
        if (!finite(radius) || radius < 0 || !closed(n.corner_radii, corners) || corners.some(c => !finite(n.corner_radii[c]) || n.corner_radii[c] !== radius)) throw Error('four complete finite corners/scalar radius mismatch');
        corners.forEach(c => add(`/corner_radii/${c}`));
      } else if (p.kind.startsWith('text-')) {
        if (n.node_type !== 'TEXT') throw Error('exact TEXT source required');
        const resize = p.kind === 'text-resize-alias', geometry = resize ? 'auto_resize' : 'vertical_alignment', style = resize ? 'text_auto_resize' : 'vertical_alignment';
        const raw = direct(record, p, t, n, `/text_geometry/${geometry}`, 'lowercase');
        const allowed = resize ? ['NONE', 'WIDTH_AND_HEIGHT', 'HEIGHT', 'TRUNCATE'] : ['TOP', 'CENTER', 'BOTTOM'];
        if (!allowed.includes(raw) || n.text_style?.[style] !== raw) throw Error('same TEXT style/geometry alias mismatch');
        add(`/text_style/${style}`);
      } else {
        const mode = n.layout?.mode;
        if (!['HORIZONTAL', 'VERTICAL'].includes(mode)) throw Error('known Auto Layout orientation required');
        const direction = (mode === 'HORIZONTAL') === (p.axis === 'primary') ? 'horizontal' : 'vertical';
        const sizing = direct(record, p, t, n, `/layout/${direction}_sizing`, 'lowercase');
        if (!['HUG', 'FILL', 'FIXED'].includes(sizing) || n.layout[`${p.axis}_axis_sizing`] !== (sizing === 'HUG' ? 'AUTO' : 'FIXED')) throw Error('native axis sizing/directional sizing mismatch');
        add(`/layout/${p.axis}_axis_sizing`);
      }
      item.status = 'verified'; sources.push(...local);
    } catch (error) {
      item.reason = error.message;
      issues.push(issue(/mismatch/u.test(error.message) ? 'NATIVE_PROOF_MISMATCH' : 'NATIVE_PROOF_UNVERIFIED', `/evidence_links/native_fact_proofs/${p?.id ?? 'invalid'}`, error.message));
    }
    Object.assign(item, env.proofTrace(), {source_paths: local}); results.push(item);
  }
  report.receipt_ids = [...env.receipts].sort();
  report.verified_sources = [...new Map(sources.map(s => [tuple(s), s])).values()].sort((a, b) => tuple(a).localeCompare(tuple(b)));
  ordered(issues); report.ok = !issues.length && results.every(r => r.status === 'verified');
  if (report.verified_sources.length) computed.set(report, {record: structuredClone(record), live: structuredClone(env.tree(record.id).packet), sources: structuredClone(report.verified_sources), digest: digest(report)});
  return report;
}
export function applyNativeFactCoverage({facts, coverage, contractProofs} = {}) {
  // Compose only from the original authenticated raw report. Never accept an
  // effective clone, public mask, copied report or report from another packet.
  const base = applyContractFactProofCoverage({facts, proofs: contractProofs});
  const trusted = computed.get(coverage);
  if (!trusted || digest(coverage) !== trusted.digest || !isFigmaContractFactReportFor({facts, record: trusted.record, live: trusted.live})) return base;
  const sources = new Set(trusted.sources.map(tuple));
  const issues = base.issues.filter(i => !(i.code === 'FIGMA_FACT_UNCOVERED' && sources.has(tuple({component_id: facts.component_id, ...i}))));
  const removed = base.issues.length - issues.length;
  if (!removed) return base;
  return {...base, ok: !issues.length, ...(typeof base.mapped_source_fact_count === 'number' ? {mapped_source_fact_count: base.mapped_source_fact_count + removed} : {}), issues};
}
