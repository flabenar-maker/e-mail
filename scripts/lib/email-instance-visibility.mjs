import { selectVariantRoot } from './email-interpreter.mjs';

export const EMAIL_VIEWPORTS = ['mobile', 'desktop'];

export function instanceVisibilityBinding(instance, elementId, viewport) {
  const values = (instance?.visibility_values ?? []).filter(item => item.element_id === elementId);
  return values.find(item => item.scope === viewport) ?? values.find(item => item.scope === 'all');
}

export function instanceElementVisible(element, instance, viewport, onUnresolvedProperty) {
  const binding = instanceVisibilityBinding(instance, element.id, viewport);
  if (binding && typeof binding.value !== 'boolean') return false;
  if (binding?.value === false) return false;
  if (element.visibility?.mode === 'property') {
    const propertyId = element.visibility.property_id;
    const values = (instance.property_values ?? []).filter(item => item.property_id === propertyId);
    const value = (values.find(item => item.scope === viewport) ?? values.find(item => item.scope === 'all'))?.value;
    if (typeof value !== 'boolean') { onUnresolvedProperty?.(propertyId); return false; }
    return value;
  }
  if (element.visibility?.mode === 'instance') return binding?.value ?? element.visibility.default_visible === true;
  return binding?.value ?? true;
}

export function visibleContractElements(root, instance, viewport) {
  const visible = new Set();
  function visit(element) {
    if (!element || !instanceElementVisible(element, instance, viewport)) return;
    visible.add(element.id);
    for (const child of element.children ?? []) visit(child);
  }
  visit(root);
  return visible;
}

export function hasInstanceVisibility(instance) {
  return (instance?.visibility_values?.length ?? 0) > 0 ||
    (instance?.slots ?? []).some(slot => slot.instances?.some(hasInstanceVisibility)) ||
    (instance?.nested_components ?? []).some(item => hasInstanceVisibility(item.instance));
}

// Visit only the active contract tree. Shared assets are required once if either
// viewport uses them; retained data in a hidden branch creates no export work.
export function visibleModelAssets(model, componentIndex) {
  const assets = new Set();
  function visitInstance(instance, viewport, stack = [], inheritedAxes = {}) {
    if (!instance || stack.includes(instance.component_id)) return;
    const record = componentIndex?.bySystemId?.get(instance.component_id);
    if (!record) return;
    const axes = { ...inheritedAxes, ...(instance.variant_axes?.[viewport] ?? {}) };
    const root = selectVariantRoot(record, viewport, axes).root;
    function visit(element) {
      if (!element || !instanceElementVisible(element, instance, viewport)) return;
      if (element.asset_contract_id) assets.add(modelAssetKey(instance, element.asset_contract_id));
      for (const child of element.children ?? []) visit(child);
      if (element.render_mode === 'slot') {
        const slot = instance.slots?.find(item => item.element_id === element.id);
        for (const child of slot?.instances ?? []) visitInstance(child, viewport, [...stack, instance.component_id]);
      }
      if (element.render_mode === 'nested-component') {
        const nested = instance.nested_components?.find(item => (item.element_ids?.[viewport] ?? item.element_id) === element.id);
        const inferred = Object.fromEntries((element.facts ?? [])
          .filter(f => f.id.startsWith('instance-') && f.id !== 'instance-viewport' && typeof f.value?.value === 'string')
          .map(f => [f.id.slice(9).replace(/^./u, letter => letter.toUpperCase()), f.value.value]));
        if (nested) visitInstance(nested.instance, viewport, [...stack, instance.component_id], inferred);
      }
    }
    visit(root);
  }
  for (const viewport of EMAIL_VIEWPORTS) visitInstance(model?.root, viewport);
  return assets;
}

export function modelAssetKey(instance, assetId) {
  return [instance.instance_id, instance.component_id, assetId].join('\0');
}
