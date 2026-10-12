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
import { physicalEmailSourceFixture } from '../helpers/email-physical-source-fixture.mjs';

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
  const correspondence = { capture_id: 'capture', file_key: 'file', instances: [{ instance_id: 'block', nodes: { mobile: '2021:4164', desktop: '2021:4163' } }], fields: [], assets: [], visibility: [] };
  for (const viewport of viewports) {
    const root = viewport === 'mobile' ? '2021:4164' : '2021:4163';
    readings.selection[viewport] = { root_node_id: root, terminal: true, truncated: false };
    readings.instances.push({ viewport, node_id: root, variant_id: viewport, parent_node_id: null, relation: null, order: 0 });
    readings.nodes.push({ viewport, node_id: root, parent_node_id: null, visible: true });
    for (const [id, suffix, parent, visible] of [['first', 1, root, true], ['group', 2, root, false], ['link', 3, 'I' + root + ';11:2', true], ['image', 4, 'I' + root + ';11:2', true], ['nested', 5, 'I' + root + ';11:2', true], ['last', 6, root, true]]) readings.nodes.push({ viewport, node_id: 'I' + root + ';11:' + suffix, parent_node_id: parent, visible });
    for (const [id, suffix, value] of [['first', 1, 'FIRST'], ['last', 6, 'LAST'], ['link', 3, 'HIDDEN']]) {
      readings.fields.push({ viewport, node_id: 'I' + root + ';11:' + suffix, owner_node_id: root, field: 'characters', value });
      if (id !== 'link') correspondence.fields.push({ instance_id: 'block', kind: 'content', element_id: id, slot_id: 'text', viewport, node_id: 'I' + root + ';11:' + suffix, field: 'characters', origin: 'figma' });
    }
    readings.instances.push({ viewport, node_id: 'I' + root + ';11:5', parent_node_id: root, variant_id: viewport, relation: { kind: 'nested', element_id: 'nested' }, order: 0 });
    correspondence.visibility.push({ instance_id: 'block', element_id: 'group', viewport, node_id: 'I' + root + ';11:2' });
    readings.assets.push({ viewport, node_id: 'I' + root + ';11:4', owner_node_id: root, evidence_id: 'hidden-asset' });
  }
  return { model: input.model, readings, correspondence, resolvedContracts: input.componentIndex.bySystemId, selectedTest: true };
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
    i => { i.correspondence.visibility[0].node_id = 'I2021:4164;11:1'; },
    i => { i.readings.nodes.find(n => n.node_id === 'I2021:4164;11:2').visible = true; },
    i => { i.readings.nodes.find(n => n.node_id === 'I2021:4164;11:2').parent_node_id = 'missing'; },
    i => { i.readings.nodes.find(n => n.node_id === 'I2021:4164;11:2').parent_node_id = 'I2021:4164;11:3'; },
  ]) {
    const input = sourceScenario(); mutate(input);
    assert.ok(verifyEmailModelSource(input).some(x => /VISIBILITY/u.test(x.code)));
  }
});

test('visible source content cannot be discarded by a hidden exclusion reason', () => {
  const input = sourceScenario();
  input.readings.fields.push({ viewport: 'mobile', node_id: 'I2021:4164;11:1', owner_node_id: '2021:4164', field: 'unrepresented-visible-field', value: 'VISIBLE' });
  input.readings.exclusions = [{ kind: 'field', viewport: 'mobile', node_id: 'I2021:4164;11:1', field: 'unrepresented-visible-field', reason: 'hidden by instance' }];
  assert.ok(verifyEmailModelSource(input).some(x => x.code === 'EMAIL_SOURCE_FIELD_UNREPRESENTED' && x.message.includes('unrepresented-visible-field')));
});


test('hidden slots do not require or recursively validate their retained child content', () => {
  const input = scenario();
  for (const viewport of viewports) {
    const group = input.componentIndex.bySystemId.get('block').contracts[viewport].root.children[1];
    group.render_mode = 'slot'; group.children = [];
    group.content_slots = [{ id: 'content', type: 'slot', required: true }];
  }
  input.model.root.slots = [{ element_id: 'group', instances: [instance('retained', 'child')] }];
  assert.deepEqual(validateEmailModelSemantics(input.model, input), []);
  const result = renderComponent({ componentId: 'block', viewportData: input.model.root, ...input });
  assert.deepEqual(result.diagnostics, []); assert.deepEqual(result.assets, []);
  assert.doesNotMatch(result.html, /retained/u);
});

test('a hidden component root produces no HTML or requested property/content/asset work', () => {
  const input = scenario();
  input.model.root.visibility_values = [mask('root')]; input.model.root.content_values = [];
  input.componentIndex.bySystemId.get('block').properties.push({ id: 'show-extra', type: 'boolean' });
  assert.deepEqual(validateEmailModelSemantics(input.model, input), []);
  const result = renderComponent({ componentId: 'block', viewportData: input.model.root, ...input });
  assert.deepEqual(result.diagnostics, []); assert.equal(result.html, ''); assert.deepEqual(result.assets, []);
});

test('assets retained only inside hidden branches need no export receipt', () => {
  const input = sourceScenario();
  input.model.root.asset_files = [{ asset_contract_id: 'photo', path: 'images/hidden.png' }];
  assert.deepEqual(verifyEmailModelSource(input), []);
});

test('a shared asset visible only on Desktop remains required once and is absent on Mobile', () => {
  const input = scenario();
  input.model.root.visibility_values = [mask('group', 'mobile'), mask('link', 'desktop'), mask('nested', 'desktop')];
  input.model.root.content_values.push({ element_id: 'image', slot_id: 'alt', scope: 'desktop', value: { type: 'alt-text', purpose: 'informative', value: 'DESKTOP IMAGE' } });
  assert.ok(validateEmailModelSemantics(input.model, input).some(x => x.code === 'EMAIL_MODEL_REQUIRED_ASSET_MISSING' && x.path.includes('desktop')));
  input.model.root.asset_files = [{ asset_contract_id: 'photo', path: 'images/desktop.png' }];
  assert.deepEqual(validateEmailModelSemantics(input.model, input), []);
  const result = renderComponent({ componentId: 'block', viewportData: input.model.root, ...input });
  assert.deepEqual(result.diagnostics, []); assert.equal(result.assets.length, 1);
  assert.equal((result.html.match(/src="images\/desktop.png"/gu) ?? []).length, 1);
});

test('a wrong source component or selected variant cannot prove even a hidden omission', () => {
  for (const wrong of ['owner_component_id', 'main_component_id']) {
    const input = sourceScenario();
    const block = input.resolvedContracts.get('block');
    block.figma = { file_key: 'file', node_id: '100:1' };
    block.variants = [{ id: 'mobile', node_id: '100:2' }, { id: 'desktop', node_id: '100:3' }];
    for (const node of input.readings.nodes.filter(n => n.parent_node_id === null)) {
      node.owner_component_id = '100:1'; node.main_component_id = node.viewport === 'mobile' ? '100:2' : '100:3';
    }
    input.readings.nodes.find(n => n.node_id === '2021:4164')[wrong] = '999:1';
    assert.ok(verifyEmailModelSource(input).some(x => /VISIBILITY.*(OWNER|VARIANT)|SOURCE_(OWNER|VARIANT)/u.test(x.code)));
  }
});

test('a root visibility assertion maps only to the exact source instance root', () => {
  const input = sourceScenario();
  input.model.root.visibility_values = [mask('root')]; input.model.root.content_values = [];
  input.correspondence.visibility = viewports.map(viewport => ({ instance_id: 'block', element_id: 'root', viewport, node_id: viewport === 'mobile' ? 'I2021:4164;11:2' : '2021:4163' }));
  input.readings.nodes.find(n => n.node_id === '2021:4163').visible = false;
  assert.ok(verifyEmailModelSource(input).some(x => /VISIBILITY/u.test(x.code)));
});


test('an exact hidden asset correspondence needs neither a model file nor an export receipt', () => {
  const input = sourceScenario();
  input.correspondence.assets = [{ instance_id: 'block', asset_contract_id: 'photo', viewport: 'desktop', node_id: 'I2021:4163;11:4' }];
  assert.deepEqual(verifyEmailModelSource(input), []);
});

test('a hidden asset correspondence cannot name an unknown model instance', () => {
  const input = sourceScenario();
  input.correspondence.assets = [{ instance_id: 'invented', asset_contract_id: 'photo', viewport: 'desktop', node_id: 'I2021:4163;11:4' }];
  assert.ok(verifyEmailModelSource(input).some(x => /ASSET|VISIBILITY/u.test(x.code)));
});

test('a hidden asset correspondence cannot name an unknown registered asset contract', () => {
  const input = sourceScenario();
  input.correspondence.assets = [{ instance_id: 'block', asset_contract_id: 'invented', viewport: 'desktop', node_id: 'I2021:4163;11:4' }];
  assert.ok(verifyEmailModelSource(input).some(x => /ASSET|VISIBILITY/u.test(x.code)));
});

test('a hidden non-image sibling cannot prove an asset binding even within the same owner', () => {
  const input = sourceScenario();
  input.model.root.asset_files = [{ asset_contract_id: 'photo', path: 'images/hidden.png' }];
  input.correspondence.assets = [{ instance_id: 'block', asset_contract_id: 'photo', viewport: 'desktop', node_id: 'I2021:4163;11:3' }];
  assert.ok(verifyEmailModelSource(input).some(x => /ASSET|VISIBILITY/u.test(x.code)));
});

test('a hidden asset still obeys its registered source viewport', () => {
  const input = sourceScenario();
  input.resolvedContracts.get('block').asset_contracts[0].source_viewport = 'desktop';
  input.correspondence.assets = [{ instance_id: 'block', asset_contract_id: 'photo', viewport: 'mobile', node_id: 'I2021:4164;11:4' }];
  assert.ok(verifyEmailModelSource(input).some(x => /ASSET|VISIBILITY/u.test(x.code)));
});

function hiddenChildAssetSource() {
  const input = sourceScenario();
  const child = input.resolvedContracts.get('child');
  child.asset_contracts = [{ id: 'photo' }];
  for (const viewport of viewports) child.contracts[viewport].root = element('image', 'direct-image', [], { asset_contract_id: 'photo', content_slots: [{ id: 'alt', type: 'alt-text', required: true }] });
  input.model.root.nested_components = [{ element_id: 'nested', instance: instance('hidden-child', 'child') }];
  input.correspondence.instances.push({ instance_id: 'hidden-child', nodes: { mobile: 'I2021:4164;11:5', desktop: 'I2021:4163;11:5' } });
  for (const viewport of viewports) {
    const node = viewport === 'mobile' ? 'I2021:4164;11:5' : 'I2021:4163;11:5';
    input.readings.assets.push({ viewport, node_id: node, owner_node_id: node, evidence_id: 'hidden-child-image' });
  }
  return input;
}

test('a retained fully hidden child may omit its asset file and export receipt with exact correspondence', () => {
  const input = hiddenChildAssetSource();
  input.correspondence.assets = [{ instance_id: 'hidden-child', asset_contract_id: 'photo', viewport: 'desktop', node_id: 'I2021:4163;11:5' }];
  assert.deepEqual(verifyEmailModelSource(input), []);
});

test('a registered hidden child asset cannot borrow its parent asset node', () => {
  const input = hiddenChildAssetSource();
  input.correspondence.assets = [{ instance_id: 'hidden-child', asset_contract_id: 'photo', viewport: 'desktop', node_id: 'I2021:4163;11:4' }];
  assert.ok(verifyEmailModelSource(input).some(x => /ASSET|VISIBILITY/u.test(x.code)));
});

test('a hidden asset correspondence still requires its exact observed asset owner', () => {
  const input = hiddenChildAssetSource();
  input.correspondence.assets = [{ instance_id: 'hidden-child', asset_contract_id: 'photo', viewport: 'desktop', node_id: 'I2021:4163;11:5' }];
  input.readings.assets.find(a => a.viewport === 'desktop' && a.node_id === 'I2021:4163;11:5').owner_node_id = '2021:4163';
  assert.ok(verifyEmailModelSource(input).some(x => /ASSET|VISIBILITY/u.test(x.code)));
});

function omittedHiddenHierarchySource() {
  const input = sourceScenario();
  const child = input.resolvedContracts.get('child');
  const deep = { id: 'deep', properties: [], figma: { file_key: 'file', node_id: '300:1' }, variants: [{ id: 'mobile', node_id: '300:2' }, { id: 'desktop', node_id: '300:3' }], contracts: {} };
  for (const viewport of viewports) {
    const prefix = viewport === 'mobile' ? 'I2021:4164' : 'I2021:4163';
    child.contracts[viewport].root = element('child-root', 'presentation-table', [{ ...element('deep-nested', 'nested-component', [], { component_id: 'deep' }), facts: [fact('reference-size', { type: 'dimensions', width: 100, height: 20, unit: 'px' }, '12:1')] }]);
    deep.contracts[viewport] = { root: text('first') };
    input.readings.nodes.push({ viewport, node_id: prefix + ';11:5;12:1', parent_node_id: prefix + ';11:5', visible: true, main_component_id: viewport === 'mobile' ? '300:2' : '300:3', owner_component_id: '300:1' });
    input.readings.instances.push({ viewport, node_id: prefix + ';11:5;12:1', parent_node_id: prefix + ';11:5', variant_id: viewport, relation: { kind: 'nested', element_id: 'deep-nested' }, order: 0 });
    input.readings.fields.push({ viewport, node_id: prefix + ';11:5;12:1', owner_node_id: prefix + ';11:5;12:1', field: 'characters', value: 'HIDDEN GRANDCHILD' });
  }
  input.resolvedContracts.set('deep', deep);
  return input;
}

test('fully omitted hidden nested parents need no placeholder model instances for their registered descendants', () => {
  const input = omittedHiddenHierarchySource();
  assert.deepEqual(input.model.root.nested_components ?? [], []);
  assert.deepEqual(verifyEmailModelSource(input), []);
});

test('omitted hidden descendants cannot substitute a wrong nested role or selected component variant', () => {
  for (const mutate of [
    input => { input.readings.instances.find(i => i.node_id === 'I2021:4164;11:5;12:1').relation.element_id = 'invented'; },
    input => { input.readings.nodes.find(i => i.node_id === 'I2021:4164;11:5;12:1').main_component_id = '999:1'; },
  ]) {
    const input = omittedHiddenHierarchySource(); mutate(input);
    assert.ok(verifyEmailModelSource(input).some(x => /VISIBILITY/u.test(x.code)));
  }
});

test('explicit extra instance correspondence cannot claim a used or hidden source node', () => {
  for (const suffix of ['', ';11:5']) {
    const input = sourceScenario();
    input.correspondence.instances.push({ instance_id: 'invented', nodes: { mobile: suffix ? 'I2021:4164' + suffix : '2021:4164', desktop: suffix ? 'I2021:4163' + suffix : '2021:4163' } });
    assert.ok(verifyEmailModelSource(input).some(x => /SOURCE_(INSTANCE|TARGET|STRUCTURE)|VISIBILITY/u.test(x.code)));
  }
});


test('production visibility proof rejects contracts without registered Figma identity', () => {
  const input = sourceScenario(); delete input.selectedTest;
  assert.ok(verifyEmailModelSource(input).some(x => /VISIBILITY.*(IDENTITY|OWNER|VARIANT)/u.test(x.code)));
});

test('literal numeric owners bind provenance descendants with exactly one leading I', () => {
  const input = sourceScenario();
  assert.equal(input.readings.selection.mobile.root_node_id, '2021:4164');
  assert.equal(input.readings.selection.desktop.root_node_id, '2021:4163');
  assert.equal(input.correspondence.visibility[0].node_id, 'I2021:4164;11:2');
  assert.equal(input.correspondence.visibility[1].node_id, 'I2021:4163;11:2');
  assert.deepEqual(verifyEmailModelSource(input), []);
});

test('literal root visibility binds the numeric owner unchanged', () => {
  const input = sourceScenario();
  input.model.root.visibility_values = [mask('root')];
  input.model.root.content_values = [];
  input.correspondence.visibility = [
    { instance_id: 'block', element_id: 'root', viewport: 'mobile', node_id: '2021:4164' },
    { instance_id: 'block', element_id: 'root', viewport: 'desktop', node_id: '2021:4163' },
  ];
  for (const node of input.readings.nodes.filter(n => n.parent_node_id === null)) node.visible = false;
  assert.deepEqual(verifyEmailModelSource(input), []);
});

test('invalid, empty, ambiguous and unknown native provenance fail closed without synthetic fallback', () => {
  for (const native of ['', 'unknown', '11:2;12:1', 'II11:2;12:1', 'I11:2;', ' 11:2']) {
    const input = sourceScenario();
    for (const viewport of viewports) input.resolvedContracts.get('block').contracts[viewport].root.children[1].facts[0].provenance.node_id = native;
    assert.ok(verifyEmailModelSource(input).some(x => x.code === 'EMAIL_SOURCE_VISIBILITY_TARGET_MISMATCH'), JSON.stringify(native));
  }
  const input = sourceScenario();
  for (const viewport of viewports) input.resolvedContracts.get('block').contracts[viewport].root.children[1].facts.push(fact('other-source', {}, '12:1'));
  assert.ok(verifyEmailModelSource(input).some(x => x.code === 'EMAIL_SOURCE_VISIBILITY_TARGET_MISMATCH'));
});

test('a matched physical target cannot validate a plain compound native ID', () => {
  const input = sourceScenario();
  assert.equal(input.selectedTest, true);
  for (const viewport of viewports) {
    input.resolvedContracts.get('block').contracts[viewport].root.children[1].facts[0].provenance.node_id = '11:2;12:1';
  }
  // These targets would match blind leading-I composition. Every intermediate
  // parent exists; rejection must come from invalid native shape, not a typo.
  const mobileIntermediate = input.readings.nodes.find(n => n.node_id === 'I2021:4164;11:2');
  const desktopIntermediate = input.readings.nodes.find(n => n.node_id === 'I2021:4163;11:2');
  mobileIntermediate.visible = true; desktopIntermediate.visible = true;
  for (const node of input.readings.nodes) {
    if (node.parent_node_id === 'I2021:4164;11:2') node.parent_node_id = 'I2021:4164;11:2;12:1';
    if (node.parent_node_id === 'I2021:4163;11:2') node.parent_node_id = 'I2021:4163;11:2;12:1';
  }
  input.readings.nodes.push(
    { viewport: 'mobile', node_id: 'I2021:4164;11:2;12:1', parent_node_id: 'I2021:4164;11:2', visible: false },
    { viewport: 'desktop', node_id: 'I2021:4163;11:2;12:1', parent_node_id: 'I2021:4163;11:2', visible: false },
  );
  input.correspondence.visibility = [
    { instance_id: 'block', element_id: 'group', viewport: 'mobile', node_id: 'I2021:4164;11:2;12:1' },
    { instance_id: 'block', element_id: 'group', viewport: 'desktop', node_id: 'I2021:4163;11:2;12:1' },
  ];
  assert.ok(verifyEmailModelSource(input).some(x => x.code === 'EMAIL_SOURCE_VISIBILITY_TARGET_MISMATCH'));
});

async function registeredPhysicalSource() {
  const [shared, marketing] = await Promise.all(['shared', 'marketing'].map(name =>
    readFile(new URL(`../../data/components/${name}.yaml`, import.meta.url), 'utf8').then(YAML.parse)));
  return { ...physicalEmailSourceFixture(), resolvedContracts: new Map([...shared.components, ...marketing.components].map(r => [r.id, r])) };
}

test('registered Content uses qualified foundation evidence and Count 2 owner/main IDs in both viewports', async () => {
  const input = await registeredPhysicalSource();
  assert.equal(Object.hasOwn(input, 'selectedTest'), false);
  assert.deepEqual(input.correspondence.visibility.map(x => x.node_id), ['I2021:4164;1103:7', 'I2021:4163;1103:8']);
  assert.deepEqual(verifyEmailModelSource(input), []);
});

test('registered Content foundation projection retains exact selected variant and evidence qualification', async () => {
  for (const mutate of [
    r => { r.evidence_links.foundation_values = r.evidence_links.foundation_values.filter(x => x.id !== 'mobile-slot-background'); },
    r => { r.evidence_links.foundation_values.find(x => x.id === 'mobile-slot-background').source.variant_node_id = '1102:7'; },
    r => { r.evidence_links.foundation_values.find(x => x.id === 'mobile-slot-background').source.node_id = 'unknown'; },
  ]) {
    const input = await registeredPhysicalSource();
    mutate(input.resolvedContracts.get('email-template'));
    assert.ok(verifyEmailModelSource(input).some(x => x.code === 'EMAIL_SOURCE_VISIBILITY_TARGET_MISMATCH'));
  }
});

test('literal nested owner and compound native preserve every segment and the complete intermediate graph', async () => {
  const input = await registeredPhysicalSource(); input.selectedTest = true;
  const child = input.model.root.slots[0].instances[0];
  child.component_id = 'compound-child'; delete child.variant_axes;
  child.visibility_values = [mask('group')];
  const record = { id: 'compound-child', properties: [], contracts: {} };
  for (const viewport of viewports) record.contracts[viewport] = { root: {
    id: 'root', render_mode: 'presentation-table', visibility: { mode: 'always' }, facts: [], children: [
      { id: 'group', render_mode: 'presentation-table', visibility: { mode: 'always' },
        facts: [fact('reference-size', {}, 'I1200:1;1200:2')], children: [] },
    ],
  } };
  input.resolvedContracts.set('compound-child', record);
  input.readings.nodes = input.readings.nodes.filter(n => !n.node_id.includes(';260:'));
  input.readings.fields = []; input.readings.assets = [];
  for (const observed of input.readings.instances.filter(n => n.relation)) observed.variant_id = observed.viewport;
  input.readings.nodes.push(
    { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;1200:1', parent_node_id: 'I2021:4164;1103:7;1104:1', visible: true },
    { viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;1200:1;1200:2', parent_node_id: 'I2021:4164;1103:7;1104:1;1200:1', visible: false },
    { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;1200:1', parent_node_id: 'I2021:4163;1103:8;1104:2', visible: true },
    { viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;1200:1;1200:2', parent_node_id: 'I2021:4163;1103:8;1104:2;1200:1', visible: false },
  );
  input.correspondence.visibility.push(
    { instance_id: 'nps-1', element_id: 'group', viewport: 'mobile', node_id: 'I2021:4164;1103:7;1104:1;1200:1;1200:2' },
    { instance_id: 'nps-1', element_id: 'group', viewport: 'desktop', node_id: 'I2021:4163;1103:8;1104:2;1200:1;1200:2' },
  );
  assert.deepEqual(verifyEmailModelSource(input), []);
  input.readings.nodes = input.readings.nodes.filter(n => n.node_id !== 'I2021:4164;1103:7;1104:1;1200:1');
  assert.ok(verifyEmailModelSource(input).some(x => /VISIBILITY.*ANCEST/u.test(x.code)));
});

test('physical Content cannot substitute a foreign owner, viewport suffix, missing node or repeated target', async () => {
  for (const mutate of [
    i => { i.correspondence.visibility[0].node_id = 'I999:1;1103:7'; },
    i => { i.correspondence.visibility[0].node_id = 'I2021:4164;1103:8'; },
    i => { i.readings.nodes = i.readings.nodes.filter(n => n.node_id !== 'I2021:4164;1103:7'); },
    i => { i.readings.nodes.push(structuredClone(i.readings.nodes.find(n => n.node_id === 'I2021:4164;1103:7'))); },
    i => { i.correspondence.visibility.push(structuredClone(i.correspondence.visibility[0])); },
    i => { i.readings.nodes.find(n => n.node_id === 'I2021:4164;1103:7;1104:1').parent_node_id = '2021:4164'; },
    i => { i.readings.nodes.find(n => n.node_id === 'I2021:4164;1103:7;1104:1').main_component_id = '260:3976'; },
  ]) {
    const input = await registeredPhysicalSource(); mutate(input);
    assert.ok(verifyEmailModelSource(input).some(x => /VISIBILITY/u.test(x.code)));
  }
});
