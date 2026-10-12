import { createHash } from 'node:crypto';
import { selectVariantRoot } from './email-interpreter.mjs';
import { validateEmailModelSemantics } from './email-model.mjs';
import { instanceElementVisible } from './email-instance-visibility.mjs';

const viewports = ['mobile', 'desktop'];
const diagnostic = (code, path, message) => ({ code, path, message });
export function deliveryBinding(instance, elementId, slotId, viewport) {
  const values = (instance.content_values ?? []).filter(item => item.element_id === elementId && item.slot_id === slotId);
  return values.find(item => item.scope === viewport) ?? values.find(item => item.scope === 'all');
}
export function deliveryText(value) {
  if (value?.type === 'rich-text' && value.segments) return value.segments.map(run => run.value).join('');
  return typeof value?.value === 'string' ? value.value : '';
}
export function indexDeliveryInstances(model) {
  const instances = new Map();
  instances.duplicatePaths = [];
  function visit(instance, parent = '') {
    if (!instance) return;
    const path = parent ? parent + '/' + instance.instance_id : instance.instance_id;
    if (instances.has(path)) { instances.duplicatePaths.push(path); return; }
    instances.set(path, instance);
    for (const slot of instance.slots ?? []) for (const child of slot.instances ?? []) visit(child, path);
    for (const nested of instance.nested_components ?? []) visit(nested.instance, path);
  }
  visit(model?.root);
  return instances;
}
function roleFor(profile, componentId, viewport, elementId, slotId, kind) {
  return (profile?.roles ?? []).find(role => role.component_id === componentId && role.bindings.some(binding => binding.viewport === viewport && binding.element_id === elementId && binding.slot_id === slotId && binding.kind === kind));
}
function visible(element, instance, viewport) {
  return instanceElementVisible(element, instance, viewport);
}

function sourceText(element, instance, viewport) {
  for (const slot of element.content_slots ?? []) {
    if (['plain-text','rich-text'].includes(slot.type)) {
      const text = deliveryText(deliveryBinding(instance, element.id, slot.id, viewport)?.value);
      if (text) return text;
    }
  }
  return element.facts?.find(fact => fact.id === 'source-text')?.value?.value ?? '';
}
function actionText(element, instance, viewport) {
  if (!visible(element, instance, viewport)) return '';
  return sourceText(element, instance, viewport) || (element.children ?? []).map(child => actionText(child, instance, viewport)).filter(Boolean).join(' ');
}
function ownerText(root, instance, viewport) {
  const texts = [];
  const visit = element => {
    if (!element || !visible(element, instance, viewport) || element.render_mode === 'html-link' || element.action) return;
    if (element.render_mode === 'html-text') {
      const text = sourceText(element, instance, viewport);
      if (text.trim()) texts.push({text,heading:/title|heading/u.test(element.semantic_role ?? '')});
    }
    for (const child of element.children ?? []) visit(child);
  };
  visit(root);
  return (texts.find(item => item.heading) ?? texts.find(item => item.text.length <= 160))?.text ?? '';
}
export function collectEmailActions({ model, componentIndex, profile }) {
  const diagnostics = validateEmailModelSemantics(model, { componentIndex }, { purpose: 'delivery-inventory' }).map(({ code, path, message }) => ({ code, path, message }));
  const indexed = indexDeliveryInstances(model);
  diagnostics.push(...indexed.duplicatePaths.map(path => diagnostic('EMAIL_DELIVERY_INSTANCE_DUPLICATE', '/root', 'Duplicate instance path: ' + path)));
  const instanceOrders = new Map([...indexed.keys()].map((path, index) => [path, index]));
  const actions = [];
  const textBindings = [];
  const selection = [];
  function visitInstance(instance, viewport, parentPath = '', stack = [], inheritedBlock, inheritedAxes) {
    if (!instance) return;
    const path = parentPath ? parentPath + '/' + instance.instance_id : instance.instance_id;
    const record = componentIndex?.bySystemId?.get(instance.component_id);
    if (!record || stack.includes(record.id)) return;
    const axes = { ...(inheritedAxes ?? {}), ...(instance.variant_axes?.[viewport] ?? {}) };
    const selected = selectVariantRoot(record, viewport, axes);
    diagnostics.push(...selected.diagnostics);
    if (!selected.root) return;
    selection.push({ path, viewport, component_id: record.id, axes, properties: instance.property_values,
      ...(instance.visibility_values?.length ? { visibility_values: instance.visibility_values } : {}),
    });
    const blockRole = inheritedBlock ?? profile?.block_labels?.[record.id] ?? `Блок ${instanceOrders.get(path) + 1}`;
    const owner = ownerText(selected.root, instance, viewport);
    const block = owner && !blockRole.includes(owner) ? `${blockRole} — ${owner}` : blockRole;
    let elementOrder = 0;
    function add(element, slot, role, kind = 'slot-link', range) {
      const original = deliveryBinding(instance, element.id, slot.id, viewport);
      const label = range?.text || actionText(element, instance, viewport) || role?.label || 'Ссылка';
      const value = role?.href ?? deliveryText(original?.value) ?? '';
      const binding = { instance_path: path, component_id: record.id, viewport, element_id: element.id, slot_id: slot.id, kind, ...(range ? { range } : {}) };
      actions.push({ label, block_label: block, instance_label: `Экземпляр ${instanceOrders.get(path) + 1}`, kind: 'url', required: kind !== 'slot-link' || slot.required === true || element.render_mode === 'html-link' || element.action?.required === true, managed: typeof role?.href === 'string', value: kind === 'output-range-link' ? range.href ?? '' : value, bindings: [binding], role: role?.id ?? null, order: [instanceOrders.get(path), elementOrder], proof: role ? 'registered-role' : original?.scope === 'all' ? 'explicit-all-slot' : original && original.scope !== 'all' ? 'viewport-specific-slot' : 'stable-slot-identity' });
    }
    function visit(element, insideAction = false) {
      if (!element || !visible(element, instance, viewport)) return;
      elementOrder += 1;
      const urlSlots = (element.content_slots ?? []).filter(slot => slot.type === 'url');
      if (element.render_mode === 'html-text' || element.render_mode === 'html-link') {
        for (const slot of element.content_slots ?? []) {
          if (!['plain-text','rich-text'].includes(slot.type)) continue;
          const supplied = deliveryBinding(instance, element.id, slot.id, viewport);
          const value = supplied ? deliveryText(supplied.value) : sourceText(element, instance, viewport);
          if (value) textBindings.push({instance_path:path,component_id:record.id,viewport,element_id:element.id,slot_id:slot.id,value,runs:structuredClone(element.facts?.find(fact => fact.id === 'styled-text-segments')?.value?.items ?? [])});
        }
      }
      for (const slot of urlSlots) add(element, slot, roleFor(profile, record.id, viewport, element.id, slot.id, 'slot-link'));
      for (const role of profile?.roles ?? []) {
        if (role.component_id !== record.id) continue;
        const target = role.bindings.find(b => b.viewport === viewport && b.element_id === element.id && b.kind === 'output-link');
        if (target) add(element, { id: target.slot_id, required: true }, role, 'output-link');
      }
      if (!insideAction && element.render_mode === 'html-text') {
        const segments = element.facts?.find(fact => fact.id === 'styled-text-segments')?.value?.items ?? [];
        segments.forEach((segment, index) => {
          if (segment.text_decoration !== 'UNDERLINE' && !segment.hyperlink) return;
          if (urlSlots.some(slot => slot.id === `link-${index + 1}-url` || slot.id === 'help-url')) return;
          const slot = element.content_slots?.find(slot => ['plain-text','rich-text'].includes(slot.type));
          if (slot) add(element, slot, null, 'output-range-link', { start: segment.start, end: segment.end, text: segment.characters, href: segment.hyperlink?.type === 'URL' ? segment.hyperlink.value : '' });
        });
      }
      const action = insideAction || element.render_mode === 'html-link' || Boolean(element.action);
      for (const child of element.children ?? []) visit(child, action);
      if (element.render_mode === 'slot') {
        const slot = instance.slots?.find(slot => slot.element_id === element.id);
        for (const child of slot?.instances ?? []) visitInstance(child, viewport, path, [...stack, record.id]);
      }
      if (element.render_mode === 'nested-component') {
        const nested = instance.nested_components?.find(n => (n.element_ids?.[viewport] ?? n.element_id) === element.id);
        const inferred = Object.fromEntries((element.facts ?? []).filter(f => f.id.startsWith('instance-') && f.id !== 'instance-viewport' && typeof f.value?.value === 'string').map(f => [f.id.slice(9).replace(/^./u, letter => letter.toUpperCase()), f.value.value]));
        if (nested) visitInstance(nested.instance, viewport, path, [...stack, record.id], block, inferred);
      }
    }
    visit(selected.root);
  }
  for (const viewport of viewports) visitInstance(model?.root, viewport);
  const groups = new Map();
  for (const action of actions) {
    const binding = action.bindings[0];
    const key = JSON.stringify([binding.instance_path, action.role ?? binding.element_id, action.role ? '' : binding.slot_id, binding.kind, binding.range?.start ?? null, binding.range?.end ?? null]);
    const group = groups.get(key) ?? [];
    group.push(action); groups.set(key, group);
  }
  const fields = [];
  for (const group of groups.values()) {
    const pair = group.length === 2 && group[0].bindings[0].viewport !== group[1].bindings[0].viewport;
    const merge = pair && group.every(action => action.proof !== 'viewport-specific-slot') && group[0].value === group[1].value && group[0].managed === group[1].managed;
    const results = merge ? [{ ...group[0], bindings: group.flatMap(action => action.bindings), required: group.some(action => action.required) }] : group;
    for (const field of results) {
      const binding = field.bindings[0];
      const suffix = field.bindings.length === 2 ? 'both' : binding.viewport;
      field.id = [binding.instance_path, field.role ?? binding.element_id, binding.slot_id, binding.range?.start ?? '', suffix].map(encodeURIComponent).join('~');
      if (!merge && pair) field.instance_label += binding.viewport === 'mobile' ? ' — мобильная версия' : ' — версия для компьютера';
      fields.push(field);
    }
  }
  fields.sort((a,b) => a.order[0]-b.order[0] || a.order[1]-b.order[1]);
  const clean = fields.map(({ order, proof, ...field }) => field);
  const structure = { email_id: model?.id, profile_id: profile?.id, profile_version: profile?.version, selection, fields: clean.map(({ value, ...field }) => ({ ...field, bindings: field.bindings.map(({ range, ...binding }) => ({ ...binding, ...(range ? { range: { start: range.start, end: range.end, text: range.text } } : {}) })) })) };
  structure.text_bindings = textBindings;
  return { email_id: model?.id, fields: clean, text_bindings:textBindings, inventory_digest: createHash('sha256').update(JSON.stringify(structure)).digest('hex'), diagnostics };
}
