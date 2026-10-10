// Audit-only absence of own Auto Layout axes on a flat image Fill.
// Directional sizing and export geometry remain independently owned facts.
import {resolveImageFillContextReference} from './native-image-fill-context.mjs';
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const closed = (value, keys) => object(value) && keys.every(key => Object.hasOwn(value, key)) && Object.keys(value).every(key => keys.includes(key));
const pointer = (root, path) => path.split('/').slice(1).reduce((value, key) => value?.[key], root);
export function resolveImageFillInertAxisContextReference({record, proof}) {
  const boundary = resolveImageFillContextReference({record, proof});
  if (boundary.element.render_mode !== 'direct-image') throw Error('owned flat direct image Fill required for inert axes');
  return boundary;
}
function mappedKeyword(record, relation, element, node, factId, sourcePath) {
  const facts = element.facts.map((fact, index) => ({fact, index})).filter(({fact}) => fact.id === factId);
  if (facts.length !== 1) throw Error('one independently mapped image sizing/wrap fact required');
  const {fact, index} = facts[0], target = relation.element_path + '/facts/' + index + '/value/value';
  const links = record.contracts.figma_fact_links ?? [];
  const targets = links.filter(link => link.contract_path === target);
  const sources = links.filter(link => link.variant_node_id === relation.source.variant_node_id && link.node_id === node.node_id && link.source_path === sourcePath);
  const link = targets[0], actual = pointer(node, sourcePath);
  if (targets.length !== 1 || sources.length !== 1 || link !== sources[0] ||
      !closed(fact.value, ['type', 'value']) || fact.value.type !== 'keyword' ||
      !['figma-literal', 'figma-binding'].includes(fact.provenance?.kind) || fact.provenance.node_id !== node.node_id ||
      link.transform !== 'lowercase' || typeof actual !== 'string' || fact.value.value !== actual.toLowerCase()) throw Error('exact same-node directional keyword mapping/provenance required');
  return actual;
}
export function verifyImageFillInertAxisContext({record, proof, entry, add}) {
  const {relation, element, asset} = resolveImageFillInertAxisContextReference({record, proof}), node = entry.node;
  if (entry.selector.component_id !== record.id || entry.selector.variant_node_id !== relation.source.variant_node_id || entry.selector.node_id !== relation.source.node_id ||
      node.node_type !== 'FRAME' || node.name !== asset.owner_layer_name || !Array.isArray(node.children) || node.children.length ||
      [node, ...entry.ancestors].some(ancestor => ancestor.visible !== true || ancestor.opacity !== 1) || node.layout_positioning !== 'AUTO' || node.layout_grow !== 0) throw Error('exact visible empty-child image Fill and ordinary flow required');
  const layout = node.layout;
  if (!closed(layout, ['mode', 'horizontal_sizing', 'vertical_sizing', 'primary_axis_sizing', 'counter_axis_sizing', 'item_spacing', 'counter_axis_spacing', 'wrap', 'primary_axis_alignment', 'counter_axis_alignment', 'padding']) ||
      layout.mode !== 'NONE' || layout.primary_axis_sizing !== 'AUTO' || layout.counter_axis_sizing !== 'FIXED' ||
      layout.item_spacing !== 0 || layout.counter_axis_spacing !== 0 || layout.wrap !== 'NO_WRAP' ||
      layout.primary_axis_alignment !== 'MIN' || layout.counter_axis_alignment !== 'MIN' ||
      !closed(layout.padding, ['top', 'right', 'bottom', 'left']) || Object.values(layout.padding).some(value => value !== 0)) throw Error('complete supported inert NONE layout qualifiers required');
  for (const direction of ['horizontal', 'vertical']) {
    const sizing = mappedKeyword(record, relation, element, node, direction + '-sizing', '/layout/' + direction + '_sizing');
    if (!['FILL', 'FIXED'].includes(sizing)) throw Error('NONE requires independently mapped FILL/FIXED directional sizing');
  }
  mappedKeyword(record, relation, element, node, 'layout-wrap', '/layout/wrap');
  // Figma axes apply only to HORIZONTAL/VERTICAL Auto Layout. Under guarded
  // NONE they are inert, NOT an alias of FILL/FIXED or an HTML height choice.
  add('/layout/primary_axis_sizing');
  add('/layout/counter_axis_sizing');
}
