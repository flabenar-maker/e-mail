import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SystemValidationError } from './diagnostics.mjs';
import { readStrictYaml } from './strict-yaml.mjs';
import { validateDocumentShape } from './schema-validation.mjs';
import profileSchema from '../../schemas/email-delivery-profiles.schema.json' with { type: 'json' };
import deliverySchema from '../../schemas/email-delivery.schema.json' with { type: 'json' };

const issue = (code, path, message) => new SystemValidationError(code, path, message);
const sources = [
  ['email-delivery-profiles', 'registry', 'data/delivery/profiles.yaml'],
  ['email-delivery-profiles-schema', 'schema', 'schemas/email-delivery-profiles.schema.json'],
  ['email-delivery-schema', 'schema', 'schemas/email-delivery.schema.json'],
];
export function resolveDeliverySources(manifest) {
  const errors = [];
  const resolved = {};
  for (const [id, kind, path] of sources) {
    const found = manifest.sources?.find(source => source.id === id);
    if (!found || found.kind !== kind || found.path !== path) {
      errors.push(issue('EMAIL_DELIVERY_SOURCE_INVALID', '/sources/' + id, 'Required delivery source is missing or inconsistent: ' + id));
    } else resolved[id] = found;
  }
  return { sources: resolved, errors };
}
function allElements(record, viewport) {
  const items = [];
  const visit = e => { if (e) { items.push(e); (e.children ?? []).forEach(visit); } };
  visit(record?.contracts?.[viewport]?.root);
  for (const variant of record?.contracts?.variant_contracts ?? []) {
    if (variant.axes?.some(axis => axis.name === 'Viewport' && axis.value.toLowerCase() === viewport)) visit(variant.root);
  }
  return items;
}
export function validateDeliveryProfile(profile, { componentIndex } = {}) {
  const errors = validateDocumentShape({ document: { schema_version: '1.0.0', profiles: [profile] }, schema: profileSchema, supportedVersion: '1.0.0', versionCode: 'EMAIL_DELIVERY_PROFILE_VERSION', schemaCode: 'EMAIL_DELIVERY_PROFILE_SCHEMA' });
  if (errors.length) return errors;
  const ids = new Set();
  const targets = new Set();
  for (const [index, role] of profile.roles.entries()) {
    const path = '/roles/' + index;
    if (ids.has(role.id)) errors.push(issue('EMAIL_DELIVERY_ROLE_DUPLICATE', path, 'Duplicate role ID.'));
    ids.add(role.id);
    const record = componentIndex?.bySystemId?.get(role.component_id);
    if (componentIndex && !record) errors.push(issue('EMAIL_DELIVERY_ROLE_OWNER_UNKNOWN', path, 'Role owner is not registered.'));
    for (const binding of role.bindings) {
      const key = JSON.stringify([role.component_id, binding.viewport, binding.element_id, binding.slot_id]);
      if (targets.has(key)) errors.push(issue('EMAIL_DELIVERY_ROLE_CONFLICT', path, 'Role targets overlap.'));
      targets.add(key);
      if (record) {
        const elements = allElements(record, binding.viewport).filter(e => e.id === binding.element_id);
        const valid = binding.kind === 'output-link'
          ? binding.slot_id === 'href' && elements.some(e => e.render_mode === 'direct-image')
          : elements.some(e => e.content_slots?.some(slot => slot.id === binding.slot_id && slot.type === 'url'));
        if (!valid) errors.push(issue('EMAIL_DELIVERY_ROLE_TARGET_UNKNOWN', path, 'Role target does not exist in the registered viewport contracts.'));
      }
    }
    if (role.href && !profile.allowed_templates.includes(role.href) && !/^https:\/\//u.test(role.href)) errors.push(issue('EMAIL_DELIVERY_MANAGED_URL_INVALID', path + '/href', 'Managed role requires an approved template or HTTPS URL.'));
  }
  return errors;
}
export async function loadEmailDeliveryProfiles({ repoRoot, manifest, componentIndex } = {}) {
  manifest ??= await import('./system-manifest.mjs').then(module => module.loadSystemManifest({ repoRoot }));
  const resolved = resolveDeliverySources(manifest);
  if (resolved.errors.length) throw new AggregateError(resolved.errors, 'Delivery source registration failed.');
  const document = await readStrictYaml(join(repoRoot, resolved.sources['email-delivery-profiles'].path));
  const schema = JSON.parse(await readFile(join(repoRoot, resolved.sources['email-delivery-profiles-schema'].path), 'utf8'));
  const errors = validateDocumentShape({ document, schema, supportedVersion: '1.0.0', versionCode: 'EMAIL_DELIVERY_PROFILES_VERSION', schemaCode: 'EMAIL_DELIVERY_PROFILES_SCHEMA' });
  if (errors.length) throw new AggregateError(errors, 'Delivery profiles are invalid.');
  if (!componentIndex) {
    const { indexComponentRegistries, loadComponentRegistries } = await import('./component-registry.mjs');
    componentIndex = indexComponentRegistries(await loadComponentRegistries({ repoRoot }));
  }
  const ids = new Set();
  for (const profile of document.profiles ?? []) {
    if (ids.has(profile.id)) errors.push(issue('EMAIL_DELIVERY_PROFILE_DUPLICATE', '/profiles', 'Duplicate profile.'));
    ids.add(profile.id);
    errors.push(...validateDeliveryProfile(profile, { componentIndex }));
  }
  if (errors.length) throw new AggregateError(errors, 'Delivery profiles are invalid.');
  return document;
}
export function selectDeliveryProfile(document, id = 'altcraft-mobile-base-v1') {
  const profile = document.profiles.find(p => p.id === id);
  if (!profile) throw issue('EMAIL_DELIVERY_PROFILE_UNKNOWN', '/profile_id', 'Unknown delivery profile.');
  return profile;
}
export function validateDeliveryShape(document) {
  return validateDocumentShape({ document, schema: deliverySchema, supportedVersion: '1.0.0', versionCode: 'EMAIL_DELIVERY_VERSION', schemaCode: 'EMAIL_DELIVERY_SCHEMA' });
}
export async function loadDeliveryDocument(path) {
  const document = JSON.parse(await readFile(path, 'utf8'));
  const errors = validateDeliveryShape(document);
  if (errors.length) throw new AggregateError(errors, 'Delivery document is invalid.');
  return document;
}
