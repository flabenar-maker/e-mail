import {createHash} from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {createContractProofEnvironment} from './contract-fact-proofs.mjs';
import {auditNativeRelationProofs} from './native-relationship-coverage.mjs';
import {applyNativeVariableCoverage} from './native-variable-coverage.mjs';
import {isFigmaContractFactReportFor} from './figma-contract-facts.mjs';

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
  return closed(p, ['id', 'kind', 'structure_proof_id']) && match(ID, p.id) &&
    p.kind === 'html-element-context' && match(ID, p.structure_proof_id);
}
function structure(record, proof) {
  const matches = record.evidence_links?.native_relation_proofs?.filter(p => p.id === proof.structure_proof_id && p.kind === 'element-structure');
  if (matches?.length !== 1) throw Error('one owned element-structure proof required');
  return matches[0];
}
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
      if (!shape(p)) {issues.push(issue('NATIVE_CONTEXT_SHAPE_INVALID', at, 'Closed html-element-context reference required.')); continue;}
      try {
        const relation = structure(r, p), e = pointer(r, relation.element_path);
        if (['asset', 'icon', 'template'].includes(r.identity?.semantic_role) || !['presentation-table', 'html-text', 'nested-component', 'direct-image'].includes(e?.render_mode)) throw Error('ordinary HTML element capability required; source artwork is a separate boundary');
      } catch (error) {issues.push(issue('NATIVE_CONTEXT_TARGET_INVALID', at, error.message));}
      if (references.has(p.structure_proof_id)) issues.push(issue('NATIVE_CONTEXT_SOURCE_DUPLICATE', at, 'One context per independently verified element.'));
      references.add(p.structure_proof_id);
    }
  }
  return ordered(issues);
}
function directFact(record, relation, node, factId, sourcePath) {
  const e = pointer(record, relation.element_path), fs = e.facts.map((f, i) => ({f, i})).filter(({f}) => f.id === factId);
  if (fs.length !== 1) return false;
  const {f, i} = fs[0], links = (record.contracts.figma_fact_links ?? []).filter(l => l.contract_path === `${relation.element_path}/facts/${i}/value/value`);
  if (!['figma-literal', 'figma-binding'].includes(f.provenance?.kind) || f.provenance.node_id !== node.node_id || links.length !== 1) return false;
  const l = links[0], value = pointer(node, sourcePath);
  return l.variant_node_id === relation.source.variant_node_id && l.node_id === node.node_id && l.source_path === sourcePath &&
    (l.transform === 'identity' ? equal(f.value.value, value) : l.transform === 'lowercase' && typeof value === 'string' && f.value.value === value.toLowerCase());
}
function verifyContext(record, relation, node, add) {
  const e = pointer(record, relation.element_path);
  // These are semantic absence conditions for ordinary HTML, not a global
  // list of fields to ignore. Any active unsupported appearance fails proof.
  for (const [path, wanted] of [['/layout_positioning', 'AUTO'], ['/minimum_width_px', null], ['/opacity', 1], ['/rotation', 0], ['/strokes', []]]) {
    if (!equal(pointer(node, path), wanted)) throw Error(`unsupported HTML context at ${path}`);
    add(path);
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
  if (node.layout !== undefined) {
    if (!object(node.layout) || !['HORIZONTAL', 'VERTICAL'].includes(node.layout.mode)) throw Error('known Auto Layout context required');
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
  const relations = auditNativeRelationProofs({record, model, session});
  report.issues.push(...validation, ...env.issues);
  for (const p of Array.isArray(proofs) ? proofs : []) {
    const item = {proof_id: p?.id ?? null, kind: p?.kind ?? null, status: 'unverified'}, local = [];
    env.beginProof();
    try {
      if (validation.length || env.issues.length) throw Error('context metadata/session unverified');
      const relation = structure(record, p), result = relations.results.filter(r => r.proof_id === relation.id);
      if (result.length !== 1 || result[0].status !== 'verified') throw Error('independent ordered element structure is unverified');
      const node = env.selected(relation.source).node;
      verifyContext(record, relation, node, path => local.push({...relation.source, source_path: path}));
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
