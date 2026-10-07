import {artworkPlacementName, isSharedArtworkReference, verifyOwnedArtworkInstances} from './native-owned-artwork.mjs';
// A source graphic is delegated to an independently registered whole-node
// export. This is neither scalar HTML equality nor an exemption by source role.
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const closed = (v, keys) => object(v) && keys.every(k => Object.hasOwn(v, k)) && Object.keys(v).every(k => keys.includes(k));
const pointer = (root, path) => path.split('/').slice(1).reduce((v, k) => v?.[k], root);
const positive = v => typeof v === 'number' && Number.isFinite(v) && v > 0;
const unique = (items, message) => {if (items?.length !== 1) throw Error(message); return items[0];};

export function ownedContextStructure(record, proof) {
  return unique(record.evidence_links?.native_relation_proofs?.filter(p => p.id === proof.structure_proof_id && p.kind === 'element-structure'), 'one owned element-structure proof required');
}
function renderedBoundary(owner, relation) {
  const element = pointer(owner, relation.element_path);
  if (owner.identity?.semantic_role === 'template' || element?.render_mode !== 'direct-image' || element.children?.length !== 0 ||
      !['asset', 'icon'].includes(owner.identity?.semantic_role) && !/^\/contracts\/(?:mobile|desktop)\/root\/children\//u.test(relation.element_path)) throw Error('registered owned direct-image boundary required');
  const asset = unique(owner.asset_contracts?.filter(a => a.id === element.asset_contract_id), 'one owned artwork asset required');
  if (asset.source_mode_id !== 'rendered-node' || asset.display_mode_id !== 'direct-image' || asset.export_profile_id !== 'png-4x' ||
      asset.clipping_policy_id !== 'preserve-artwork' || !closed(asset.export_boundary, ['kind', 'semantic_node_name']) || asset.export_boundary.kind !== 'node' ||
      asset.export_boundary.semantic_node_name !== asset.owner_layer_name || !closed(asset.crop, ['mode', 'position_source']) || asset.crop.mode !== 'none' || asset.crop.position_source !== 'exact-node-after-overrides' ||
      !closed(asset.background, ['own_visible_boundary_fill', 'artificial_matte']) || asset.background.own_visible_boundary_fill !== 'preserve' || asset.background.artificial_matte !== 'forbid') throw Error('whole rendered-node export preserving artwork without an artificial matte required');
  return {owner, relation, element, asset, placement_name: artworkPlacementName({record: owner, element, asset, variant_node_id: relation.source.variant_node_id})};
}
export function resolveArtworkContextReference({record, proof, records}) {
  if (proof.kind === 'rendered-artwork-context') return renderedBoundary(record, ownedContextStructure(record, proof));
  if (proof.kind !== 'source-artwork-context') throw Error('supported artwork context required');
  const owner = unique(records?.filter(r => r.id === proof.owner_component_id && r.id !== record.id), 'one other canonical rendered owner required');
  const boundary = renderedBoundary(owner, ownedContextStructure(owner, proof));
  const dependency = unique(owner.evidence_links?.source_dependencies?.filter(d => d.id === proof.dependency_link_id), 'one declared owned artwork dependency required');
  if (dependency.target.component_id !== record.id || dependency.asset_owner.node_id !== boundary.relation.source.node_id || dependency.asset_owner.asset_id !== boundary.asset.id ||
      dependency.source.variant_node_id !== boundary.relation.source.variant_node_id || owner.figma.file_key !== record.figma.file_key) throw Error('exact owner/source/export-boundary dependency required');
  if (!['asset', 'icon'].includes(record.identity?.semantic_role) || record.identity?.node_kind !== 'component' || record.properties?.length !== 0 || record.variants?.length !== 0 || record.asset_contracts?.length !== 0 ||
      !['mobile', 'desktop'].every(v => {const root = record.contracts?.[v]?.root; return root?.render_mode === 'figma-source-only' && root.facts?.length === 0 && root.children?.length === 0;}) ||
      record.contracts?.variant_contracts?.length || record.contracts?.figma_fact_links?.length) throw Error('source-only artwork without separate HTML values, controls or exports required');
  return {...boundary, dependency};
}
export function verifyArtworkDependency({record, proof, boundary, env}) {
  env.dependencies(boundary.owner.id);
  const ownerEntry = env.selected(boundary.relation.source);
  if (ownerEntry.node.name !== boundary.placement_name) throw Error('actual whole-node boundary name mismatch');
  verifyOwnedArtworkInstances({record: boundary.owner, boundary: ownerEntry, asset: boundary.asset, env});
  if (proof.kind === 'rendered-artwork-context') return ownerEntry;
  const instance = env.selected({component_id: boundary.owner.id, ...boundary.dependency.source});
  if (instance.node.node_type !== 'INSTANCE' || (instance.node.node_id !== ownerEntry.node.node_id && !instance.ancestors.some(n => n.node_id === ownerEntry.node.node_id))) throw Error('actual dependency must lie inside the independently verified owner boundary');
  const sourceEntry = env.selected({component_id: record.id, variant_node_id: record.figma.node_id, node_id: record.figma.node_id});
  if (instance.node.main_component_id !== sourceEntry.node.node_id || !closed(instance.node.instance_properties, []) || sourceEntry.packet.component_properties.length !== 0) throw Error('exact main artwork without unmodeled instance controls required');
  return sourceEntry;
}
// Called only after the owned boundary and its complete actual graph passed.
// These known native metadata fields are opaque export inputs, not HTML facts.
// Their presence, values, or shape are never a Shared origin acceptance gate.
export function preserveSharedArtworkMetadata({boundary, entry, env, add}) {
  if (entry.node.node_type !== 'INSTANCE') return;
  const link = unique(boundary.owner.evidence_links?.source_dependencies?.filter(d =>
    d.source.variant_node_id === entry.variantId && d.source.node_id === entry.node.node_id &&
    d.asset_owner.node_id === entry.node.node_id && d.asset_owner.asset_id === boundary.asset.id), 'one actual root artwork dependency required');
  const target = unique(env.records.filter(r => r.id === link.target.component_id), 'one registered artwork reference required');
  if (!isSharedArtworkReference(target)) return;
  function leaves(value, path) {
    if (Array.isArray(value)) {
      if (!value.length) add(path);
      value.forEach((child, i) => leaves(child, path + '/' + i));
    } else if (object(value)) {
      const entries = Object.entries(value);
      if (!entries.length) add(path);
      for (const [key, child] of entries) leaves(child, path + '/' + key);
    } else add(path);
  }
  for (const key of ['main_component_id', 'instance_properties'])
    if (Object.hasOwn(entry.node, key)) leaves(entry.node[key], '/' + key);
}

export function verifySourceArtworkContext({record, entry, add}) {
  const node = entry.node;
  if (node.node_id !== record.figma.node_id || node.node_type !== 'COMPONENT' || node.name !== record.identity.figma_name || entry.packet.owner_identity.name !== node.name || node.visible !== true) throw Error('exact visible source component identity required');
  for (const key of ['name', 'node_type', 'visible']) add('/' + key);
  const size = node.reference_dimensions;
  if (!closed(size, ['width', 'height', 'unit']) || size.unit !== 'px' || !positive(size.width) || !positive(size.height)) throw Error('complete positive intrinsic source dimensions required');
  // Intrinsic source dimensions are preserved by export, not equated to the
  // rendered owner dimensions or the scaled file dimensions.
  for (const key of ['width', 'height', 'unit']) add('/reference_dimensions/' + key);
  if (record.figma.remote_source) {
    if (!closed(node.remote_source, ['remote', 'component_key']) || node.remote_source.remote !== true || node.remote_source.component_key !== record.figma.remote_source.component_key) throw Error('exact published remote source identity required');
    add('/remote_source/remote'); add('/remote_source/component_key');
  } else if (node.remote_source !== undefined) throw Error('undeclared remote source identity');
  for (const [path, expected] of [['/clips_content', true], ['/corner_radius', 0], ['/minimum_width_px', null], ['/layout_align', 'INHERIT'], ['/layout_grow', 0], ['/layout_positioning', 'AUTO'], ['/opacity', 1], ['/rotation', 0]]) {
    if (pointer(node, path) !== expected) throw Error('unsupported source artwork context at ' + path);
    add(path);
  }
  for (const key of ['strokes', 'variable_bindings', 'component_property_references']) {
    const value = node[key], empty = key === 'strokes' ? Array.isArray(value) && value.length === 0 : closed(value, []);
    if (!empty) throw Error('unsupported source artwork ' + key);
    add('/' + key);
  }
  if (Object.hasOwn(node, 'effects')) {if (!Array.isArray(node.effects) || node.effects.length) throw Error('unsupported source effects'); add('/effects');}
  const corners = ['top_left', 'top_right', 'bottom_right', 'bottom_left'];
  if (!closed(node.corner_radii, corners) || corners.some(k => node.corner_radii[k] !== 0)) throw Error('unsupported source artwork corners');
  for (const k of corners) add('/corner_radii/' + k);
  const layout = node.layout, qualifiers = {mode: 'NONE', horizontal_sizing: 'FIXED', vertical_sizing: 'FIXED', primary_axis_sizing: 'AUTO', counter_axis_sizing: 'FIXED', primary_axis_alignment: 'MIN', counter_axis_alignment: 'MIN', wrap: 'NO_WRAP', item_spacing: 0, counter_axis_spacing: 0};
  if (!closed(layout, [...Object.keys(qualifiers), 'padding']) || Object.entries(qualifiers).some(([k, v]) => layout[k] !== v) || !closed(layout.padding, ['top', 'right', 'bottom', 'left']) || Object.values(layout.padding).some(v => v !== 0)) throw Error('unsupported complete source artwork NONE layout');
  for (const k of Object.keys(qualifiers)) add('/layout/' + k);
  for (const side of ['top', 'right', 'bottom', 'left']) add('/layout/padding/' + side);
  if (entry.packet.capture_errors.some(e => e.node_id === node.node_id && e.field === 'fills') || !Array.isArray(node.fills) || node.fills.length !== 1 || !closed(node.fills[0], ['type', 'visible', 'opacity', 'color'])) throw Error('complete source paint required');
  const paint = node.fills[0];
  if (paint.type !== 'solid' || paint.visible !== true || paint.opacity !== 1 || !/^#[0-9A-Fa-f]{6}$/u.test(paint.color)) throw Error('supported opaque source solid required');
  for (const key of ['type', 'visible', 'opacity', 'color']) add('/fills/0/' + key);
  // No traversal or blanket key filtering: vector descendants stay inside the
  // already verified export boundary; unknown root fields stay uncovered.
}
