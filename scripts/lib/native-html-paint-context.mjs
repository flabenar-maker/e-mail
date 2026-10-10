import {isDeepStrictEqual as equal} from 'node:util';
import {hasCompleteMixedTextRuns} from './figma-contract-facts.mjs';

// Only the existing HTML endpoint/range representation is qualified here.
// No caller masks, component IDs, duplicated colors, or inferred CSS angle.
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const closed = (value, keys) => object(value) && keys.every(key => Object.hasOwn(value, key)) && Object.keys(value).every(key => keys.includes(key));
const pointer = (root, path) => path.split('/').slice(1).reduce((value, key) => value?.[key], root);
const hex = value => typeof value === 'string' && /^#[A-Fa-f0-9]{6}$/u.test(value);
const own = (fact, node) => ['figma-literal', 'figma-binding'].includes(fact.provenance?.kind) && fact.provenance.node_id === node.node_id;
function exactFact(element, id) {
  const matches = element.facts.map((fact, index) => ({fact, index})).filter(item => item.fact.id === id);
  if (matches.length !== 1) throw Error(`one own ${id} fact required`);
  return matches[0];
}
function mappedEndpoint(record, relation, node, element, id, index, color) {
  const selected = exactFact(element, id), path = `${relation.element_path}/facts/${selected.index}/value/value`;
  const links = (record.contracts.figma_fact_links ?? []).filter(link => link.contract_path === path);
  if (selected.fact.value?.type !== 'color' || selected.fact.value.value !== color || !own(selected.fact, node) || links.length !== 1 ||
      links[0].variant_node_id !== relation.source.variant_node_id || links[0].node_id !== node.node_id || links[0].transform !== 'identity' ||
      ![`/fills/0/stops/${index}/color`, `/fills/0/gradient_stops/${index}/color`].includes(links[0].source_path) || pointer(node, links[0].source_path) !== color) throw Error('exact own independently mapped gradient endpoint required');
}
export function verifyHtmlGradientPaintContext({record, relation, node, contractProofs, add, addNotRequired}) {
  const element = pointer(record, relation.element_path), paint = node.fills[0];
  if (element.render_mode !== 'presentation-table' || element.semantic_role !== 'button' || node.fills.length !== 1 ||
      !closed(paint, ['type', 'visible', 'opacity', 'gradient_stops', 'stops', 'gradient_transform']) ||
      paint.type !== 'gradient_linear' || paint.visible !== true || paint.opacity !== 1 || !Array.isArray(paint.gradient_stops) || paint.gradient_stops.length !== 2 ||
      !equal(paint.stops, paint.gradient_stops) || paint.gradient_stops.some((stop, index) => !closed(stop, ['position', 'color', 'alpha']) || stop.position !== index || stop.alpha !== 1 || !hex(stop.color)) ||
      !Array.isArray(paint.gradient_transform) || paint.gradient_transform.length !== 2 || paint.gradient_transform.some(row => !Array.isArray(row) || row.length !== 3 || row.some(value => typeof value !== 'number' || !Number.isFinite(value)))) throw Error('closed visible opaque two-endpoint HTML linear gradient required');
  mappedEndpoint(record, relation, node, element, 'background-gradient-start', 0, paint.gradient_stops[0].color);
  mappedEndpoint(record, relation, node, element, 'background-gradient-end', 1, paint.gradient_stops[1].color);
  const angle = exactFact(element, 'background-gradient-css-angle-degrees'), path = `${relation.element_path}/facts/${angle.index}/value`;
  const proofs = (record.evidence_links?.fact_proofs ?? []).filter(proof => proof.kind === 'approved-css-gradient-angle' && proof.contract_path === path);
  if (angle.fact.value?.type !== 'number' || !Number.isFinite(angle.fact.value.value) || proofs.length !== 1 || proofs[0].paint_index !== 0 ||
      !equal(proofs[0].source, relation.source) || angle.fact.provenance?.kind !== 'contract-proof' || angle.fact.provenance.proof_id !== proofs[0].id ||
      contractProofs.results.filter(result => result.proof_id === proofs[0].id && result.status === 'verified').length !== 1) throw Error('independent exact same-element approved CSS angle required');
  for (const key of ['type', 'visible', 'opacity']) add(`/fills/0/${key}`);
  for (const alias of ['gradient_stops', 'stops']) for (const index of [0, 1]) for (const key of ['position', 'color', 'alpha']) add(`/fills/0/${alias}/${index}/${key}`);
  // This exact native matrix remains in raw evidence. Its orientation is not
  // asserted equal to CSS: the independently approved, context-bound HTML
  // angle owns that choice. A changed matrix invalidates that approval digest.
  for (const row of [0, 1]) for (const column of [0, 1, 2]) addNotRequired(`/fills/0/gradient_transform/${row}/${column}`);
}
export function verifyHtmlMixedTextPaintContext({record, relation, node, packet, add}) {
  const element = pointer(record, relation.element_path), errors = packet.capture_errors.filter(error => error.node_id === node.node_id && error.field === 'fills');
  if (node.node_type !== 'TEXT' || !['html-text', 'html-link'].includes(element.render_mode) || (node.fills !== null && !equal(node.fills, [])) || errors.length !== 1 || !closed(errors[0], ['node_id', 'code', 'field']) || errors[0].code !== 'MIXED_VALUE' || !hasCompleteMixedTextRuns(node, 'fills')) throw Error('complete captured MIXED text fills and ranges required');
  const selected = exactFact(element, 'styled-text-segments'), runs = node.styled_text_segments;
  if (selected.fact.value?.type !== 'segments' || !own(selected.fact, node) || !equal(selected.fact.value.items, runs) ||
      runs.some(run => !closed(run, ['start', 'end', 'characters', 'font_family', 'font_style', 'font_size_px', 'line_height', 'text_decoration', 'fills']) ||
        !closed(run.line_height, ['unit', 'value']) || run.fills.length !== 1 || run.fills.some(paint => !closed(paint, ['type', 'visible', 'opacity', 'color']) || paint.type !== 'solid' || paint.visible !== true || paint.opacity !== 1 || !hex(paint.color)))) throw Error('exact own complete typed text ranges with closed opaque SOLID paints required');
  const leaves = [];
  const collect = (value, path) => {
    if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, `${path}/${key}`);
    else leaves.push({path, value});
  };
  runs.forEach((run, index) => collect(run, `/${index}`));
  const mappings = record.contracts.figma_fact_links ?? [], base = `${relation.element_path}/facts/${selected.index}/value/items`;
  if (!leaves.every(leaf => {
    const path = `${base}${leaf.path}`, links = mappings.filter(link => link.contract_path === path);
    return links.length === 1 && links[0].variant_node_id === relation.source.variant_node_id && links[0].node_id === node.node_id &&
      links[0].transform === 'identity' && links[0].source_path === `/styled_text_segments${leaf.path}` && equal(pointer(record, path), leaf.value);
  })) throw Error('every styled-run primitive needs its independent same-node identity mapping');
  // Not paint absence: the complete independently mapped ranges retain paint.
  // Binding identities and text_case are outside this aggregate-only proof.
  add('/fills');
}
