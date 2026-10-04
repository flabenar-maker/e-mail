import {isDeepStrictEqual as equal} from 'node:util';

// Shared entries are identity references. Only the consuming owner's actual
// complete tree is evidence; no Shared source contract or capture is required.
export function isSharedArtworkReference(record) {
  return record?.identity?.library === 'shared' && ['asset', 'icon'].includes(record.identity.semantic_role);
}
const unique = (items, message) => {if (items?.length !== 1) throw Error(message); return items[0];};
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const closed = (value, keys) => object(value) && keys.every(key => Object.hasOwn(value, key)) && Object.keys(value).every(key => keys.includes(key));

export function verifyRegisteredArtworkInstance({record, link, node, records}) {
  const target = unique(records?.filter(candidate => candidate.id === link?.target?.component_id), 'one registered artwork identity required');
  if (!['asset', 'icon'].includes(target.identity?.semantic_role) || target.figma?.file_key !== record.figma?.file_key ||
      !Array.isArray(target.properties) || target.properties.length || !Array.isArray(target.variants) || node?.node_type !== 'INSTANCE') throw Error('registered same-file artwork without unsupported controls required');
  const variants = target.variants.length ? target.variants : [{node_id: target.figma.node_id, axes: []}];
  const variant = unique(variants.filter(candidate => link.target.variant_id === undefined ? target.variants.length === 0 : candidate.id === link.target.variant_id), 'one exact declared artwork variant required');
  if (node.main_component_id !== variant.node_id || !Array.isArray(variant.axes) ||
      new Set(variant.axes.map(axis => axis.name)).size !== variant.axes.length ||
      variant.axes.some(axis => !closed(axis, ['name', 'value']) || typeof axis.name !== 'string' || !axis.name || typeof axis.value !== 'string')) throw Error('exact artwork main and unique registered axes required');
  const expected = Object.fromEntries(variant.axes.map(axis => [axis.name, {type: 'VARIANT', value: axis.value, boundVariables: {}}]));
  if (!equal(node.instance_properties, expected)) throw Error('complete actual artwork VARIANT properties required');
  return {target, variant};
}

// The export source and another viewport's placement need not share a name or
// size. The latter has an exact semantic element identity and the same suffix.
export function artworkPlacementName({record, element, asset, variant_node_id}) {
  if (['asset', 'icon'].includes(record.identity?.semantic_role)) return asset.owner_layer_name;
  const variant = unique(record.variants?.filter(candidate => candidate.node_id === variant_node_id), 'one owned artwork placement variant required');
  const viewport = unique(variant.axes?.filter(axis => axis.name === 'Viewport'), 'one owned artwork viewport required').value.toLowerCase();
  if (!['mobile', 'desktop'].includes(viewport) || !['mobile', 'desktop'].includes(asset.source_viewport)) throw Error('known artwork placement/source viewports required');
  if (viewport === asset.source_viewport) return asset.owner_layer_name;
  if (asset.export_profile_id !== 'png-4x' || typeof element.semantic_role !== 'string' || !element.semantic_role || !asset.owner_layer_name.endsWith(' @4x')) throw Error('exact semantic PNG @4x placement required');
  return element.semantic_role + ' @4x';
}

export function verifyOwnedArtworkInstances({record, boundary, asset, env}) {
  const owner = env.tree(record.id), links = record.evidence_links?.source_dependencies ?? [];
  const inside = entry => entry.variantId === boundary.variantId && (entry.node.node_id === boundary.node.node_id || entry.ancestors.some(ancestor => ancestor.node_id === boundary.node.node_id));
  const instances = [...owner.nodes.values()].filter(entry => inside(entry) && entry.node.node_type === 'INSTANCE');
  for (const entry of instances) {
    const link = unique(links.filter(candidate => candidate.source.variant_node_id === entry.variantId && candidate.source.node_id === entry.node.node_id), 'every actual artwork INSTANCE needs one owned dependency');
    if (link.asset_owner.node_id !== boundary.node.node_id || link.asset_owner.asset_id !== asset.id) throw Error('exact rendered artwork owner/asset ancestry required');
    const selected = env.selected({component_id: record.id, variant_node_id: entry.variantId, node_id: entry.node.node_id});
    verifyRegisteredArtworkInstance({record, link, node: selected.node, records: env.records});
  }
  for (const link of links.filter(candidate => candidate.source.variant_node_id === boundary.variantId && candidate.asset_owner.node_id === boundary.node.node_id)) {
    if (link.asset_owner.asset_id !== asset.id || instances.filter(entry => entry.node.node_id === link.source.node_id).length !== 1) throw Error('declared artwork dependency missing from actual boundary');
  }
}
