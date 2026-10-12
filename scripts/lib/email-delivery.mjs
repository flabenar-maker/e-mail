import { validateDeliveryShape, loadEmailDeliveryProfiles, selectDeliveryProfile } from './email-delivery-profile.mjs';
import { collectEmailActions, deliveryBinding, indexDeliveryInstances } from './email-action-inventory.mjs';

const issue = (code, path, message) => ({ code, path, message });
const reservedHost = host => /(?:^|\.)(?:example\.(?:com|org|net)|test|invalid|localhost)$/iu.test(host);
const emailAddress = address => typeof address === 'string' && /^[^\s<>@\r\n]+@[^\s<>@\r\n]+\.[^\s<>@\r\n]+$/u.test(address);
export async function prepareEmailDelivery({ repoRoot, model, componentIndex, document, purpose = 'preview', sourceSha }) {
  const profiles = await loadEmailDeliveryProfiles({ repoRoot, componentIndex });
  const profile = selectDeliveryProfile(profiles, document.profile_id);
  const inventory = collectEmailActions({ model, componentIndex, profile });
  const diagnostics = validateDeliveryDocument({ document, inventory, profile, purpose, sourceSha, emailId: model.id });
  if (diagnostics.length) throw new AggregateError(diagnostics, 'Delivery readiness is blocked.');
  return { ...projectDeliveryBindings({ model, document, inventory, profile }), profile, inventory, document };
}
export function validateDeliveryDocument({ document, inventory, profile, purpose = 'preview', sourceSha, emailId }) {
  const diagnostics = validateDeliveryShape(document).map(({code,path,message}) => ({code,path,message}));
  if (diagnostics.length) return diagnostics;
  if (!['preview','final'].includes(purpose)) return [issue('EMAIL_DELIVERY_PURPOSE_INVALID','/purpose','Unknown release purpose.')];
  if (document.profile_id !== profile?.id || document.profile_version !== profile?.version) diagnostics.push(issue('EMAIL_DELIVERY_PROFILE_STALE','/profile_id','The release profile changed; prepare a new form.'));
  if ((emailId ?? inventory.email_id) && document.email_id !== (emailId ?? inventory.email_id)) diagnostics.push(issue('EMAIL_DELIVERY_EMAIL_MISMATCH','/email_id','The answers belong to another email.'));
  if (document.inventory_digest !== inventory.inventory_digest) diagnostics.push(issue('EMAIL_DELIVERY_INVENTORY_STALE','/inventory_digest','The email structure changed; prepare a new form.'));
  if (sourceSha && document.source_sha !== sourceSha) diagnostics.push(issue('EMAIL_DELIVERY_SOURCE_STALE','/source_sha','The source version changed; prepare a new form.'));
  diagnostics.push(...(inventory.diagnostics ?? []));
  const fields = new Map(inventory.fields.map(field => [field.id,field]));
  for (const id of Object.keys(document.answers)) if (!fields.has(id)) diagnostics.push(issue('EMAIL_DELIVERY_ANSWER_UNKNOWN','/answers/'+id,'The answer has no current field.'));
  for (const field of inventory.fields) {
    const value = document.answers[field.id] ?? field.value ?? '';
    const path = '/answers/' + field.id;
    if (field.managed && value !== field.value) { diagnostics.push(issue('EMAIL_DELIVERY_MANAGED_OVERRIDE',path,'The fixed system address cannot be overridden.')); continue; }
    if (!value.trim()) {
      if (purpose === 'final' && field.required) diagnostics.push(issue('EMAIL_DELIVERY_REQUIRED_URL',path,'Fill the address for '+field.block_label+' — '+field.label+'.'));
      continue;
    }
    if (value.includes('{') || value.includes('}')) {
      if (!(field.managed && field.role === 'footer-unsubscribe' && profile.allowed_templates.includes(value))) diagnostics.push(issue('EMAIL_DELIVERY_TEMPLATE_INVALID',path,'This action cannot use that template token.'));
      continue;
    }
    try {
      const url = new URL(value);
      if (!['https:','http:','mailto:','tel:'].includes(url.protocol) || /[\x00-\x20<>]/u.test(value) || url.username || url.password) throw new Error('Unsafe URL');
      if (url.protocol === 'mailto:' && !emailAddress(decodeURIComponent(url.pathname))) throw new Error('Invalid email');
      if (url.protocol === 'tel:' && !/^\+?[0-9().-]+$/u.test(url.pathname)) throw new Error('Invalid telephone');
      if (purpose === 'final' && reservedHost(url.hostname || url.pathname.split('@').at(-1))) diagnostics.push(issue('EMAIL_DELIVERY_EXAMPLE_URL',path,'A test address cannot be released.'));
    } catch { diagnostics.push(issue('EMAIL_DELIVERY_URL_INVALID',path,'Provide an HTTP, HTTPS, mailto or tel address.')); }
  }
  for (const name of ['sender','reply_to']) {
    const value = document[name];
    if (value.mode === 'explicit' && (!emailAddress(value.address) || /[\r\n]/u.test(value.name))) diagnostics.push(issue('EMAIL_DELIVERY_SENDER_INVALID','/'+name,'Provide a valid address and a single-line name.'));
  }
  if (/[\r\n]/u.test(document.subject)) diagnostics.push(issue('EMAIL_DELIVERY_SUBJECT_INVALID','/subject','The subject must be one line.'));
  return diagnostics;
}
export function projectDeliveryBindings({ model, document, inventory, profile }) {
  const diagnostics = validateDeliveryDocument({ document, inventory, profile, purpose: 'preview', emailId: model.id });
  if (diagnostics.length) throw new AggregateError(diagnostics, 'Delivery projection is blocked.');
  const projected = structuredClone(model);
  const instances = indexDeliveryInstances(projected);
  const outputBindings = [];
  const updates = new Map();
  for (const field of inventory.fields) {
    const href = document.answers[field.id] ?? field.value ?? '';
    for (const binding of field.bindings) {
      const instance = instances.get(binding.instance_path);
      if (!instance || instance.component_id !== binding.component_id) throw new AggregateError([issue('EMAIL_DELIVERY_BINDING_STALE','/answers/'+field.id,'The target instance is no longer present.')]);
      if (binding.kind === 'output-link' || binding.kind === 'output-range-link') {
        if (href) outputBindings.push({ kind: binding.kind === 'output-link' ? 'managed-output-link' : 'output-range-link', role: field.role ?? 'source-hyperlink', href, target: structuredClone(binding) });
        continue;
      }
      const key = JSON.stringify([binding.instance_path,binding.element_id,binding.slot_id]);
      const item = updates.get(key) ?? { instance, element_id: binding.element_id, slot_id: binding.slot_id, values: {}, merge: field.bindings.length === 2 };
      item.values[binding.viewport] = href;
      item.merge &&= field.bindings.length === 2;
      updates.set(key,item);
    }
  }
  for (const item of updates.values()) {
    const original = Object.fromEntries(['mobile','desktop'].map(viewport => [viewport, deliveryBinding(item.instance,item.element_id,item.slot_id,viewport)?.value?.value]));
    const values = { ...original, ...item.values };
    item.instance.content_values = (item.instance.content_values ?? []).filter(value => value.element_id !== item.element_id || value.slot_id !== item.slot_id);
    const entry = (scope,value) => ({ element_id:item.element_id,slot_id:item.slot_id,scope,value:{type:'url',value} });
    if (item.merge && typeof values.mobile === 'string' && values.mobile === values.desktop) item.instance.content_values.push(entry('all',values.mobile));
    else for (const viewport of ['mobile','desktop']) if (typeof values[viewport] === 'string') item.instance.content_values.push(entry(viewport,values[viewport]));
  }
  return { model: projected, outputBindings };
}
