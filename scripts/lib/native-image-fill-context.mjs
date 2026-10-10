// Audit-only IMAGE paint capability. This does not export a file or prove
// raster resolution, output color/quality, node clipping or layout sizing.
import {ownedContextStructure} from './native-artwork-context.mjs';
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const closed = (v, keys) => object(v) && keys.every(k => Object.hasOwn(v, k)) && Object.keys(v).every(k => keys.includes(k));
const pointer = (root, path) => path.split('/').slice(1).reduce((v, k) => v?.[k], root);
const positive = v => typeof v === 'number' && Number.isFinite(v) && v > 0;
const unique = (items, message) => {if (items?.length !== 1) throw Error(message); return items[0];};
const viewport = (record, relation) => unique(record.variants?.filter(v => v.node_id === relation.source.variant_node_id), 'exact registered source variant required').axes.find(a => a.name === 'Viewport')?.value?.toLowerCase();
export function resolveImageFillContextReference({record, proof}) {
  const relation = ownedContextStructure(record, proof), element = pointer(record, relation.element_path);
  if (['asset', 'icon', 'template'].includes(record.identity?.semantic_role) || relation.source.component_id !== record.id ||
      !['direct-image', 'background-image'].includes(element?.render_mode) || element.children?.length !== 0) throw Error('owned flat image element required');
  const asset = unique(record.asset_contracts?.filter(a => a.id === element.asset_contract_id), 'one owned image Fill asset required');
  if (!['mobile', 'desktop'].includes(asset.source_viewport) || viewport(record, relation) !== asset.source_viewport ||
      asset.source_mode_id !== 'image-fill' || !['direct-image', 'fill-image'].includes(asset.display_mode_id) ||
      asset.export_profile_id !== 'jpeg-2x' || asset.alpha_mode_id !== 'none' || asset.clipping_policy_id !== 'preserve-artwork' ||
      !closed(asset.export_boundary, ['kind', 'semantic_node_name']) || asset.export_boundary.kind !== 'fill' ||
      asset.export_boundary.semantic_node_name !== asset.owner_layer_name || !asset.owner_layer_name.endsWith(' @2x') ||
      !closed(asset.crop, ['mode', 'position_source']) || asset.crop.mode !== 'figma-fill' || asset.crop.position_source !== `concrete-${asset.source_viewport}-instance` ||
      !closed(asset.background, ['own_visible_boundary_fill', 'artificial_matte']) || asset.background.own_visible_boundary_fill !== 'preserve' || asset.background.artificial_matte !== 'forbid') throw Error('exact source viewport and existing rectangular Fill export ownership required');
  const size = unique(element.facts?.filter(f => f.id === 'reference-size'), 'one independently mapped reference size required').value;
  const pixels = asset.pixel_dimensions, ratio = asset.aspect_ratio;
  if (!closed(size, ['type', 'width', 'height', 'unit']) || size.type !== 'dimensions' || size.unit !== 'px' || !positive(size.width) || !positive(size.height) ||
      !closed(pixels, ['width', 'height', 'unit']) || pixels.unit !== 'px' || !positive(pixels.width) || !positive(pixels.height) ||
      !closed(ratio, ['width', 'height']) || !positive(ratio.width) || !positive(ratio.height) ||
      size.width * ratio.height !== size.height * ratio.width || pixels.width !== size.width * 2 || pixels.height !== size.height * 2) throw Error('source node, export ratio and exact 2x pixel geometry must agree');
  return {relation, element, asset};
}
function policy(model, group, id) {
  const source = model.source_documents?.get('assets-foundation');
  if (source?.foundation?.id !== 'assets' || source.foundation.status !== 'active') throw Error('canonical assets foundation required');
  return unique(source[group]?.filter(d => d.id === id), 'unique canonical ' + group + ' policy required').contract;
}
function requireFields(value, expected, message) {
  if (!object(value) || Object.entries(expected).some(([k, wanted]) => value[k] !== wanted)) throw Error(message);
}
export function verifyImageFillPaintContext({record, proof, entry, model, add}) {
  const {relation, element, asset} = resolveImageFillContextReference({record, proof}), node = entry.node;
  if (entry.selector.component_id !== record.id || entry.selector.variant_node_id !== relation.source.variant_node_id || entry.selector.node_id !== relation.source.node_id ||
      node.node_type !== 'FRAME' || node.name !== asset.owner_layer_name || !Array.isArray(node.children) || node.children.length ||
      [node, ...entry.ancestors].some(n => n.visible !== true || n.opacity !== 1)) throw Error('exact fully visible flat Fill source and ancestry required');
  requireFields(policy(model, 'source_modes', asset.source_mode_id), {source_content: 'source-raster-only', concrete_email_instance_required: true, own_visible_fill_included: true, visible_nested_graphics_included: false, parent_fill_included: false, unrelated_layout_included: false, live_html_included: false}, 'source raster export policy mismatch');
  requireFields(policy(model, 'display_modes', asset.display_mode_id), {intrinsic_ratio_required: true, crop_owner: asset.display_mode_id === 'fill-image' ? 'html-wrapper' : 'none', mobile_width_behavior: 'fluid-to-container', mobile_height_behavior: 'auto', fixed_mobile_height_forbidden: true, html_height_attribute_forbidden: true, image_height_100_percent_forbidden: true, deformation_forbidden: true}, 'proportional display policy mismatch');
  if (asset.display_mode_id === 'direct-image' && element.render_mode !== 'direct-image') throw Error('direct display capability mismatch');
  const profile = policy(model, 'export_profiles', asset.export_profile_id);
  requireFields(profile, {format: 'JPEG', extension: '.jpg', scale: 2, suffix: '@2x', color_space: 'sRGB', alpha_mode: 'none'}, 'existing JPEG2x export profile mismatch');
  requireFields(profile.quality, {base_percent: 82, escalation_percent: 90, escalation_condition: 'visible-artifacts-only'}, 'existing JPEG quality policy mismatch');
  requireFields(policy(model, 'alpha_modes', asset.alpha_mode_id), {expectation: 'no-alpha', permits_alpha: false}, 'JPEG alpha policy mismatch');
  const clipping = policy(model, 'clipping_policies', asset.clipping_policy_id);
  requireFields(clipping, {temporary_copy_required: false, artwork_clipping_preserved: true, presentation_clipping_neutralized: false, temporary_copy_deleted: false, readback_required: false}, 'existing source clipping policy mismatch');
  if (!Array.isArray(clipping.allowed_source_mode_ids) || !clipping.allowed_source_mode_ids.includes(asset.source_mode_id) || !Array.isArray(clipping.preserve_fields) || !['fill', 'crop', 'dimensions', 'intrinsic-ratio', 'variants', 'overrides', 'children'].every(field => clipping.preserve_fields.includes(field))) throw Error('complete source clipping preservation policy required');
  const foundation = model.source_documents.get('assets-foundation');
  requireFields(foundation.background_policy, {own_visible_boundary_fill: 'preserve', parent_fill: 'exclude', invisible_fill: 'exclude', artificial_matte: 'forbid'}, 'owned Fill background policy mismatch');
  requireFields(foundation.identity_policy, {scale_suffix_required: true, shared_mobile_desktop_file: true, shared_mobile_desktop_src: true, concrete_email_instance_required: true, placeholder_forbidden: true, main_component_export_forbidden: true}, 'concrete source identity policy mismatch');
  const compatible = foundation.compatibility?.filter(c => c.export_profile_id === asset.export_profile_id && c.source_mode_ids?.includes(asset.source_mode_id) && c.display_mode_ids?.includes(asset.display_mode_id) && c.alpha_mode_ids?.includes(asset.alpha_mode_id) && c.clipping_policy_ids?.includes(asset.clipping_policy_id));
  if (compatible?.length !== 1) throw Error('unique compatible Fill export policy required');
  if (entry.packet.capture_errors.some(error => error.node_id === node.node_id && (error.field === 'fills' || error.code === 'PAINT_UNSUPPORTED'))) throw Error('complete supported captured IMAGE paint required');
  const keys = ['type', 'visible', 'opacity', 'image_hash', 'scale_mode', 'image_transform', 'scaling_factor', 'rotation', 'filters'];
  const paint = node.fills?.[0];
  if (!Array.isArray(node.fills) || node.fills.length !== 1 || !closed(paint, keys) || paint.type !== 'image' || paint.visible !== true || paint.opacity !== 1 ||
      typeof paint.image_hash !== 'string' || !paint.image_hash.trim() || paint.image_hash.trim() !== paint.image_hash || paint.scale_mode !== 'FILL' ||
      !Array.isArray(paint.image_transform) || paint.image_transform.length !== 2 || paint.image_transform.some(row => !Array.isArray(row) || row.length !== 3) ||
      paint.image_transform[0][0] !== 1 || paint.image_transform[0][1] !== 0 || paint.image_transform[0][2] !== 0 || paint.image_transform[1][0] !== 0 || paint.image_transform[1][1] !== 1 || paint.image_transform[1][2] !== 0 ||
      !positive(paint.scaling_factor) || paint.rotation !== 0) throw Error('only complete opaque FILL, identity transform and zero rotation are supported');
  const filters = ['exposure', 'contrast', 'saturation', 'temperature', 'tint', 'highlights', 'shadows'];
  if (!closed(paint.filters, filters) || filters.some(key => paint.filters[key] !== 0)) throw Error('complete zero image filters required; active filters remain unverified');
  // Figma ImagePaint: imageTransform is CROP-only; scalingFactor is TILE-only.
  // Under this guarded FILL mode a positive factor is inactive, not a requested
  // 0.5 resize. The current export preflight still requires identity transform.
  // https://developers.figma.com/docs/plugins/api/Paint/#imagepaint
  for (const key of ['type', 'visible', 'opacity', 'image_hash', 'scale_mode', 'scaling_factor', 'rotation']) add('/fills/0/' + key);
  for (let row = 0; row < 2; row++) for (let column = 0; column < 3; column++) add('/fills/0/image_transform/' + row + '/' + column);
  for (const key of filters) add('/fills/0/filters/' + key);
  // No node context, axis, unknown paint field or output-byte claim is covered.
  return ['source_modes', 'display_modes', 'export_profiles', 'alpha_modes', 'clipping_policies'].map(group => ({source_id: 'assets-foundation', definition_group: group, target_id: asset[{source_modes: 'source_mode_id', display_modes: 'display_mode_id', export_profiles: 'export_profile_id', alpha_modes: 'alpha_mode_id', clipping_policies: 'clipping_policy_id'}[group]]}));
}
