import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import YAML from 'yaml';
import { validateEmailModelSemantics, loadEmailModel } from '../../scripts/lib/email-model.mjs';
import { renderComponent } from '../../scripts/lib/email-renderer.mjs';
import { collectEmailActions } from '../../scripts/lib/email-action-inventory.mjs';
import { verifyEmailModelSource } from '../../scripts/lib/email-source-fidelity.mjs';

const viewports = ['mobile', 'desktop'];
const variants = { mobile: 'mobile', desktop: 'desktop' };
const mask = (element_id, scope = 'all', value = false) => ({ element_id, scope, value });
const plain = value => ({ type: 'plain-text', value });
const instance = (instance_id, component_id, extra = {}) => ({ instance_id, component_id, variants, property_values: [], content_values: [], asset_files: [], slots: [], ...extra });
const fact = (id, value, node_id) => ({ id, value, ...(node_id ? { provenance: { kind: 'figma-literal', node_id } } : {}) });
const element = (id, render_mode, children = [], extra = {}) => ({ id, semantic_role: id, render_mode, visibility: { mode: 'always' }, facts: [fact('reference-size', { type: 'dimensions', width: 100, height: 20, unit: 'px' }, '11:' + ({ first: 1, group: 2, link: 3, image: 4, nested: 5, last: 6, root: 7 })[id])], children, ...extra });
const text = id => element(id, 'html-text', [], { content_slots: [{ id: 'text', type: 'plain-text', required: true }] });
function scenario() {
  const link = element('link', 'html-link', [], { content_slots: [{ id: 'text', type: 'plain-text', required: true }, { id: 'href', type: 'url', required: true }] });
  const image = element('image', 'direct-image', [], { asset_contract_id: 'photo', content_slots: [{ id: 'alt', type: 'alt-text', required: true }] });
  const nested = element('nested', 'nested-component', [], { component_id: 'child' });
  const group = element('group', 'presentation-table', [link, image, nested]);
  group.facts.push(fact('layout-axis', { type: 'keyword', value: 'vertical' }), fact('layout-gap', { type: 'measure', value: 9, unit: 'px' }));
  const root = element('root', 'presentation-table', [text('first'), group, text('last')]);
  root.facts.push(fact('layout-axis', { type: 'keyword', value: 'vertical' }), fact('layout-gap', { type: 'measure', value: 12, unit: 'px' }));
  const record = { id: 'block', properties: [], asset_contracts: [{ id: 'photo' }], contracts: Object.fromEntries(viewports.map(v => [v, { root: structuredClone(root) }])) };
  const child = { id: 'child', properties: [], contracts: Object.fromEntries(viewports.map(v => [v, { root: text('first') }])) };
  const componentIndex = { bySystemId: new Map([[record.id, record], [child.id, child]]) };
  const rendererRegistry = { coverage: [{ component_id: 'block', mode: 'interpreter' }, { component_id: 'child', mode: 'interpreter' }] };
  const model = { schema_version: '1.1.0', id: 'visibility', metadata: { language: 'ru', direction: 'ltr' }, root: instance('block', 'block', { visibility_values: [mask('group')], content_values: [{ element_id: 'first', slot_id: 'text', scope: 'all', value: plain('FIRST') }, { element_id: 'last', slot_id: 'text', scope: 'all', value: plain('LAST') }] }) };
  return { model, componentIndex, rendererRegistry, foundations: { rendering: { breakpoints: [{ id: 'cupis-mobile', query: 'max-width', value: 660, unit: 'px' }] } } };
}

test('schema accepts scoped concrete instance visibility without permitting extra fields', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'cupis-visibility-'));
  try {
    const modelPath = join(folder, 'model.json');
    await writeFile(modelPath, JSON.stringify(scenario().model));
    const loaded = await loadEmailModel({ modelPath, schemaPath: new URL('../../schemas/email-model.schema.json', import.meta.url) });
    assert.deepEqual(loaded.root.visibility_values, [mask('group')]);
  } finally { await rm(folder, { recursive: true, force: true }); }
});

test('hidden ancestor suppresses required content, assets and omitted nested instances', () => {
  const input = scenario();
  assert.deepEqual(validateEmailModelSemantics(input.model, input), []);
});

test('visible positions remain required when a concrete visibility mask is removed', () => {
  const input = scenario();
  delete input.model.root.visibility_values;
  const codes = validateEmailModelSemantics(input.model, input).map(x => x.code);
  assert.ok(codes.includes('EMAIL_MODEL_REQUIRED_CONTENT_MISSING'));
  assert.ok(codes.includes('EMAIL_MODEL_REQUIRED_ASSET_MISSING'));
  assert.ok(codes.includes('EMAIL_MODEL_REQUIRED_NESTED_MISSING'));
});

test('hidden subtree renders no content, asset, action or extra gap', () => {
  const input = scenario();
  const result = renderComponent({ componentId: 'block', viewportData: input.model.root, ...input });
  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(result.assets, []);
  assert.match(result.html, /FIRST/u); assert.match(result.html, /LAST/u);
  assert.doesNotMatch(result.html, /<img|<a\b|height="9"/u);
  const reference = structuredClone(input.componentIndex.bySystemId.get('block'));
  for (const viewport of viewports) reference.contracts[viewport].root.children.splice(1, 1);
  const expected = renderComponent({ componentId: 'block', viewportData: input.model.root, ...input, componentIndex: { bySystemId: new Map([['block', reference]]) } });
  assert.equal(result.html, expected.html);
});

test('hidden source content does not enter link inventory and changes invalidate the inventory digest', () => {
  const input = scenario();
  const hidden = collectEmailActions({ model: input.model, componentIndex: input.componentIndex, profile: { roles: [] } });
  assert.deepEqual(hidden.diagnostics, []); assert.deepEqual(hidden.fields, []);
  assert.deepEqual(hidden.text_bindings.map(x => x.value).sort(), ['FIRST', 'FIRST', 'LAST', 'LAST']);
  input.model.root.visibility_values[0].value = true;
  const visible = collectEmailActions({ model: input.model, componentIndex: input.componentIndex, profile: { roles: [] } });
  assert.ok(visible.fields.some(x => x.bindings.some(b => b.element_id === 'link')));
  assert.notEqual(hidden.inventory_digest, visible.inventory_digest);
});

test('visibility binding conflicts and unknown targets fail semantic validation', () => {
  for (const values of [[mask('missing')], [mask('group'), mask('group')], [mask('group'), mask('group', 'mobile')]]) {
    const input = scenario(); input.model.root.visibility_values = values;
    assert.ok(validateEmailModelSemantics(input.model, input).some(x => /VISIBILITY|BINDING_CONFLICT/u.test(x.code)));
  }
});

test('one-sided hidden nested instance is validated only in its active viewport', () => {
  const input = scenario();
  input.model.root.visibility_values = [mask('group', 'mobile'), mask('image', 'desktop'), mask('link', 'desktop')];
  input.model.root.nested_components = [{ element_id: 'nested', instance: instance('child', 'child', { content_values: [{ element_id: 'first', slot_id: 'text', scope: 'desktop', value: plain('DESKTOP CHILD') }] }) }];
  assert.deepEqual(validateEmailModelSemantics(input.model, input), []);
  const result = renderComponent({ componentId: 'block', viewportData: input.model.root, ...input });
  assert.deepEqual(result.diagnostics, []); assert.match(result.html, /DESKTOP CHILD/u); assert.deepEqual(result.assets, []);
});

test('a concrete true mask cannot revive a property-disabled branch', () => {
  const input = scenario(); const record = input.componentIndex.bySystemId.get('block');
  record.properties = [{ id: 'show-group', type: 'boolean' }];
  for (const viewport of viewports) record.contracts[viewport].root.children[1].visibility = { mode: 'property', property_id: 'show-group' };
  input.model.root.property_values = [{ property_id: 'show-group', scope: 'all', value: false }];
  input.model.root.visibility_values = [mask('group', 'all', true)];
  assert.deepEqual(validateEmailModelSemantics(input.model, input), []);
  assert.deepEqual(collectEmailActions({ model: input.model, componentIndex: input.componentIndex, profile: { roles: [] } }).fields, []);
});

test('all twelve saved hidden positions may omit required descendants under the pinned library contracts', async () => {
  const registry = YAML.parse(await readFile(new URL('../../data/components/marketing.yaml', import.meta.url), 'utf8'));
  const componentIndex = { bySystemId: new Map(registry.components.map(r => [r.id, r])) };
  const hiddenRoles = new Map([['block-steps', new Set(['step-04', 'step-05'])], ['block-cards-images', new Set(['card-04', 'card-05', 'card-06'])], ['block-icon-cards', new Set(['card-04', 'card-05', 'card-06'])], ['block-icon-list', new Set(['item-03', 'item-04', 'item-05', 'item-06'])]]);
  const scalar = type => type === 'alt-text' ? { type, purpose: 'informative', value: 'TEST IMAGE' } : type === 'rich-text' ? { type, segments: [{ type: 'text', value: 'TEST COPY' }] } : { type, value: type === 'number' ? 1 : type === 'url' ? 'https://example.invalid/test' : 'TEST COPY' };
  function build(componentId, instanceId) {
    const record = componentIndex.bySystemId.get(componentId);
    const value = instance(instanceId, componentId, { property_values: (record.properties ?? []).map(p => ({ property_id: p.id, scope: 'all', value: false })), nested_components: [], visibility_values: [] });
    const nestedByRole = new Map();
    for (const viewport of viewports) {
      function visit(e) {
        if (hiddenRoles.get(componentId)?.has(e.semantic_role)) { value.visibility_values.push(mask(e.id, viewport)); return; }
        if (e.visibility?.mode === 'property' || (e.visibility?.mode === 'instance' && !e.visibility.default_visible)) return;
        for (const s of e.content_slots ?? []) if (s.required && s.type !== 'slot') value.content_values.push({ element_id: e.id, slot_id: s.id, scope: viewport, value: scalar(s.type) });
        if (e.render_mode === 'nested-component') { const n = nestedByRole.get(e.semantic_role) ?? { component_id: e.component_id, ids: {} }; n.ids[viewport] = e.id; nestedByRole.set(e.semantic_role, n); }
        for (const c of e.children ?? []) visit(c);
      }
      visit(record.contracts[viewport].root);
    }
    value.nested_components = [...nestedByRole].map(([role, n]) => ({ element_ids: n.ids, instance: build(n.component_id, `${instanceId}-${role}`) }));
    return value;
  }
  let masked = 0;
  for (const componentId of hiddenRoles.keys()) {
    const root = build(componentId, componentId); masked += root.visibility_values.length;
    const model = { schema_version: '1.1.0', id: componentId, metadata: { language: 'ru', direction: 'ltr' }, root };
    assert.deepEqual(validateEmailModelSemantics(model, { componentIndex }, { purpose: 'delivery-inventory' }), [], componentId);
  }
  assert.equal(masked, 24);
});

function sourceScenario() {
  const input = scenario();
  const readings = { capture_id: 'capture', file_key: 'file', captured_at: '2026-10-12T00:00:00Z', complete: true, selection: {}, instances: [], fields: [], assets: [], nodes: [] };
  const correspondence = { capture_id: 'capture', file_key: 'file', instances: [{ instance_id: 'block', nodes: { mobile: 'm-root', desktop: 'd-root' } }], fields: [], assets: [], visibility: [] };
  for (const viewport of viewports) {
    const root = viewport === 'mobile' ? 'm-root' : 'd-root';
    readings.selection[viewport] = { root_node_id: root, terminal: true, truncated: false };
    readings.instances.push({ viewport, node_id: root, variant_id: viewport, parent_node_id: null, relation: null, order: 0 });
    readings.nodes.push({ viewport, node_id: root, parent_node_id: null, visible: true });
    for (const [id, suffix, parent, visible] of [['first', 1, root, true], ['group', 2, root, false], ['link', 3, root + ';11:2', true], ['image', 4, root + ';11:2', true], ['nested', 5, root + ';11:2', true], ['last', 6, root, true]]) readings.nodes.push({ viewport, node_id: root + ';11:' + suffix, parent_node_id: parent, visible });
    for (const [id, suffix, value] of [['first', 1, 'FIRST'], ['last', 6, 'LAST'], ['link', 3, 'HIDDEN']]) {
      readings.fields.push({ viewport, node_id: root + ';11:' + suffix, owner_node_id: root, field: 'characters', value });
      if (id !== 'link') correspondence.fields.push({ instance_id: 'block', kind: 'content', element_id: id, slot_id: 'text', viewport, node_id: root + ';11:' + suffix, field: 'characters', origin: 'figma' });
    }
    readings.instances.push({ viewport, node_id: root + ';11:5', parent_node_id: root, variant_id: viewport, relation: { kind: 'nested', element_id: 'nested' }, order: 0 });
    correspondence.visibility.push({ instance_id: 'block', element_id: 'group', viewport, node_id: root + ';11:2' });
    readings.assets.push({ viewport, node_id: root + ';11:4', owner_node_id: root, evidence_id: 'hidden-asset' });
  }
  return { model: input.model, readings, correspondence, resolvedContracts: input.componentIndex.bySystemId };
}

test('independent graph proves hidden ancestor omissions without invented exclusions', () => {
  assert.deepEqual(verifyEmailModelSource(sourceScenario()), []);
});

test('unproven instance visibility never passes the source gate', () => {
  const input = sourceScenario(); delete input.readings.nodes; delete input.correspondence.visibility;
  assert.ok(verifyEmailModelSource(input).some(x => /VISIBILITY/u.test(x.code)));
});

test('wrong-node mapping, wrong visibility, missing ancestors and cyclic ancestry fail source proof', () => {
  for (const mutate of [
    i => { i.correspondence.visibility[0].node_id = 'm-root;11:1'; },
    i => { i.readings.nodes.find(n => n.node_id === 'm-root;11:2').visible = true; },
    i => { i.readings.nodes.find(n => n.node_id === 'm-root;11:2').parent_node_id = 'missing'; },
    i => { i.readings.nodes.find(n => n.node_id === 'm-root;11:2').parent_node_id = 'm-root;11:3'; },
  ]) {
    const input = sourceScenario(); mutate(input);
    assert.ok(verifyEmailModelSource(input).some(x => /VISIBILITY/u.test(x.code)));
  }
});

test('visible source content cannot be discarded by a hidden exclusion reason', () => {
  const input = sourceScenario();
  input.readings.fields.push({ viewport: 'mobile', node_id: 'm-root;11:1', owner_node_id: 'm-root', field: 'unrepresented-visible-field', value: 'VISIBLE' });
  input.readings.exclusions = [{ kind: 'field', viewport: 'mobile', node_id: 'm-root;11:1', field: 'unrepresented-visible-field', reason: 'hidden by instance' }];
  assert.ok(verifyEmailModelSource(input).some(x => x.code === 'EMAIL_SOURCE_FIELD_UNREPRESENTED'));
});
