import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEmailModel, validateEmailModelSemantics } from "../../scripts/lib/email-model.mjs";
import { renderComponent } from "../../scripts/lib/email-renderer.mjs";
import { spawnSync } from "node:child_process";
import { actionComponents, actionModel } from "../fixtures/rendering/email-delivery-fixtures.mjs";
import { physicalEmailSourceFixture } from "../helpers/email-physical-source-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schemaPath = join(repoRoot, "schemas/email-model.schema.json");

const logicalInstance = (instance_id, component_id = 'identity-leaf', extra = {}) => ({
  instance_id, component_id, variants: { mobile: 'mobile', desktop: 'desktop' },
  property_values: [], content_values: [], asset_files: [], slots: [], ...extra,
});
const logicalModel = root => ({ schema_version: '1.1.0', id: 'identity-test', metadata: { language: 'ru', direction: 'ltr' }, root });
const siblingLocations = ['/root/slots/0/instances/0/instance_id', '/root/slots/0/instances/1/instance_id'];

function assertDuplicatePairs(diagnostics, id, pairs, componentId) {
  assert.ok(Array.isArray(diagnostics));
  assert.equal(diagnostics.length, pairs.length * 2, JSON.stringify(diagnostics));
  assert.ok(diagnostics.every(d => d.code === 'EMAIL_MODEL_INSTANCE_DUPLICATE'));
  for (const pair of pairs) for (const location of pair) {
    const diagnostic = diagnostics.find(d => d.path === location && typeof d.message === 'string' &&
      d.message.includes(id) && pair.every(path => d.message.includes(path)));
    assert.ok(diagnostic, `Missing duplicate ${id} at ${location} with both locations ${pair.join(' / ')}`);
    if (componentId) assert.equal(diagnostic.component_id, componentId);
  }
  assert.deepEqual(diagnostics, [...diagnostics].sort((a, b) =>
    a.path.localeCompare(b.path) || a.code.localeCompare(b.code) || a.message.localeCompare(b.message)));
}

const earlyIdentityDependencies = { componentIndex: { bySystemId: new Map() } };
function semanticIdentityDiagnostics(root) {
  return validateEmailModelSemantics(logicalModel(root), earlyIdentityDependencies);
}

test('semantic identity rejects duplicate siblings before dependent contract lookup', () => {
  const root = logicalInstance('root', 'identity-wrapper', { slots: [{ element_id: 'content', instances: [logicalInstance('shared'), logicalInstance('shared')] }] });
  assertDuplicatePairs(semanticIdentityDiagnostics(root), 'shared', [siblingLocations]);
});

test('semantic identity counts repeated object references at independent logical locations', () => {
  const shared = logicalInstance('shared');
  const root = logicalInstance('root', 'identity-wrapper', { slots: [{ element_id: 'content', instances: [shared, shared] }] });
  assertDuplicatePairs(semanticIdentityDiagnostics(root), 'shared', [siblingLocations]);
});

test('semantic identity rejects a root ID repeated by its descendant at both JSON locations', () => {
  const root = logicalInstance('shared', 'identity-wrapper', { nested_components: [{ element_id: 'child', instance: logicalInstance('shared') }] });
  assertDuplicatePairs(semanticIdentityDiagnostics(root), 'shared', [['/root/instance_id', '/root/nested_components/0/instance/instance_id']]);
});

test('semantic identity is global across different component IDs', () => {
  const root = logicalInstance('root', 'identity-wrapper', { slots: [{ element_id: 'content', instances: [logicalInstance('shared', 'first-type'), logicalInstance('shared', 'second-type')] }] });
  assertDuplicatePairs(semanticIdentityDiagnostics(root), 'shared', [siblingLocations]);
});

test('semantic identity is global across different parents, slots and nested branches', () => {
  const root = logicalInstance('root', 'identity-wrapper', { slots: [
    { element_id: 'first', instances: [logicalInstance('left', 'parent', { slots: [{ element_id: 'inner', instances: [logicalInstance('shared')] }] })] },
    { element_id: 'second', instances: [logicalInstance('right', 'parent', { nested_components: [{ element_id: 'child', instance: logicalInstance('shared') }] })] },
  ] });
  assertDuplicatePairs(semanticIdentityDiagnostics(root), 'shared', [[
    '/root/slots/0/instances/0/slots/0/instances/0/instance_id',
    '/root/slots/1/instances/0/nested_components/0/instance/instance_id',
  ]]);
});

test('semantic identity includes a retained hidden branch and its visible duplicate', () => {
  const value = actionModel({ hiddenSecondCard: true });
  value.root.nested_components[1].instance.nested_components[0].instance.instance_id = 'cta';
  const diagnostics = validateEmailModelSemantics(value, { componentIndex: actionComponents }, { purpose: 'delivery-inventory' });
  assertDuplicatePairs(diagnostics, 'cta', [[
    '/root/nested_components/0/instance/nested_components/0/instance/instance_id',
    '/root/nested_components/1/instance/nested_components/0/instance/instance_id',
  ]]);
});

test('three duplicate identities preserve the first location, both collision messages and diagnostic order', () => {
  const root = logicalInstance('root', 'identity-wrapper', { slots: [{ element_id: 'content', instances: [logicalInstance('shared'), logicalInstance('shared'), logicalInstance('shared')] }] });
  assertDuplicatePairs(semanticIdentityDiagnostics(root), 'shared', [siblingLocations, [siblingLocations[0], '/root/slots/0/instances/2/instance_id']]);
});

test('unique logical instances shared by Mobile and Desktop remain unchanged and counted once', async () => {
  const value = model(); const before = structuredClone(value);
  const module = await import('../../scripts/lib/email-model.mjs');
  assert.equal(typeof module.validateEmailInstanceIdentities, 'function');
  assert.deepEqual(module.validateEmailInstanceIdentities(value), []);
  assert.deepEqual(validateEmailModelSemantics(value, dependencies()), []);
  assert.deepEqual(value, before);
});

test('identity traversal terminates on direct JavaScript ancestry cycles without requiring a new diagnostic contract', () => {
  const url = new URL('../../scripts/lib/email-model.mjs', import.meta.url).href;
  const script = `const module = await import(${JSON.stringify(url)}); if (typeof module.validateEmailInstanceIdentities !== 'function') process.exit(2); const root = {instance_id:'root',slots:[],nested_components:[]}; root.slots.push({element_id:'content',instances:[root]}); module.validateEmailInstanceIdentities({root}); console.log('TERMINATED');`;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8', timeout: 10000 });
  assert.equal(result.status, 0, result.error?.message || result.stderr || 'Identity helper must exist and terminate.');
  assert.equal(result.stdout.trim(), 'TERMINATED');
});

test('missing-root semantic diagnostic remains unchanged', () => {
  assert.deepEqual(validateEmailModelSemantics({}, {}).map(({ code, path }) => ({ code, path })), [{ code: 'EMAIL_MODEL_ROOT_MISSING', path: '/root' }]);
});

function directIdentityScenario(ids = ['first', 'second']) {
  const always = { mode: 'always' };
  const textRoot = { id: 'label', semantic_role: 'text', render_mode: 'html-text', visibility: always,
    facts: [], children: [], content_slots: [{ id: 'text', type: 'plain-text', required: true }] };
  const content = { id: 'content', semantic_role: 'content', render_mode: 'slot', visibility: always,
    facts: [], children: [], content_slots: [{ id: 'content', type: 'slot', required: true }] };
  const wrapperRoot = { id: 'root', semantic_role: 'wrapper', render_mode: 'presentation-table', visibility: always,
    facts: [{ id: 'layout-axis', value: { type: 'keyword', value: 'vertical' } }, { id: 'layout-gap', value: { type: 'measure', value: 0, unit: 'px' } }], children: [content] };
  const records = [
    { id: 'identity-wrapper', properties: [], contracts: { mobile: { root: wrapperRoot }, desktop: { root: structuredClone(wrapperRoot) } } },
    { id: 'identity-leaf', properties: [], contracts: { mobile: { root: textRoot }, desktop: { root: structuredClone(textRoot) } } },
  ];
  const root = logicalInstance('identity-root', 'identity-wrapper', { slots: [{ element_id: 'content', instances: ids.map((id, index) =>
    logicalInstance(id, 'identity-leaf', { content_values: [{ element_id: 'label', slot_id: 'text', scope: 'all', value: { type: 'plain-text', value: index === 0 ? 'FIRST' : 'SECOND' } }] })) }] });
  return { model: logicalModel(root), componentIndex: { bySystemId: new Map(records.map(r => [r.id, r])) },
    rendererRegistry: { coverage: records.map(r => ({ component_id: r.id, mode: 'interpreter' })) },
    foundations: { rendering: { breakpoints: [{ id: 'cupis-mobile', query: 'max-width', value: 659, unit: 'px' }] } } };
}
function directIdentityRender(input) {
  return renderComponent({ componentId: 'identity-wrapper', viewportData: input.model.root, ...input });
}

test('real direct renderer preserves FIRST then SECOND for unique siblings', () => {
  const input = directIdentityScenario(); const before = structuredClone(input.model);
  const result = directIdentityRender(input);
  assert.deepEqual(result.diagnostics, []);
  assert.equal((result.html.match(/FIRST/gu) ?? []).length, 1);
  assert.equal((result.html.match(/SECOND/gu) ?? []).length, 1);
  assert.ok(result.html.indexOf('FIRST') < result.html.indexOf('SECOND'));
  assert.deepEqual(input.model, before);
});

test('real direct renderer rejects duplicate siblings instead of overwriting FIRST with SECOND', () => {
  const result = directIdentityRender(directIdentityScenario(['shared', 'shared']));
  const first = (result.html.match(/FIRST/gu) ?? []).length;
  const second = (result.html.match(/SECOND/gu) ?? []).length;
  assert.ok(result.diagnostics.some(d => d.code === 'EMAIL_MODEL_INSTANCE_DUPLICATE'), `Missing early identity diagnostic; observed FIRST=${first}, SECOND=${second}, diagnostics=${JSON.stringify(result.diagnostics)}`);
  assertDuplicatePairs(result.diagnostics, 'shared', [siblingLocations], 'identity-wrapper');
  assert.equal(result.html, ''); assert.equal(result.css, ''); assert.deepEqual(result.assets, []);
});

test('direct identity errors preserve both locations and messages with component context for three duplicate instances', () => {
  const result = directIdentityRender(directIdentityScenario(['shared', 'shared', 'shared']));
  assertDuplicatePairs(result.diagnostics, 'shared', [siblingLocations, [siblingLocations[0], '/root/slots/0/instances/2/instance_id']], 'identity-wrapper');
  assert.equal(result.html, ''); assert.equal(result.css, ''); assert.deepEqual(result.assets, []);
});

test('direct component fixtures without root instance_id retain their existing rendering API', () => {
  const input = directIdentityScenario(); delete input.model.root.instance_id;
  const result = directIdentityRender(input);
  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /FIRST/u); assert.match(result.html, /SECOND/u);
});

test('real prepare-delivery CLI reports early duplicate model locations and publishes no intake', async (t) => {
  const folder = await mkdtemp(join(tmpdir(), 'cupis-identity-intake-'));
  t.after(() => rm(folder, { recursive: true, force: true }));
  const value = physicalEmailSourceFixture().model;
  value.root.slots[0].instances[0].instance_id = 'letter';
  const modelPath = join(folder, 'model.json'), output = join(folder, 'intake');
  await writeFile(modelPath, JSON.stringify(value), 'utf8');
  const result = spawnSync(process.execPath, [join(repoRoot, 'scripts/prepare-email-delivery.mjs'), '--model', modelPath, '--output', output], { encoding: 'utf8', cwd: repoRoot });
  const wroteForm = await readFile(join(output, 'form.html')).then(() => true, error => { if (error.code === 'ENOENT') return false; throw error; });
  const wroteDelivery = await readFile(join(output, 'delivery.json')).then(() => true, error => { if (error.code === 'ENOENT') return false; throw error; });
  assert.equal(result.status, 1, JSON.stringify({ status: result.status, wroteForm, wroteDelivery, stderr: result.stderr }));
  assert.match(result.stderr, /EMAIL_MODEL_INSTANCE_DUPLICATE/u);
  assert.ok(['/root/instance_id', '/root/slots/0/instances/0/instance_id'].every(location => result.stderr.includes(location)), result.stderr);
  assert.equal(wroteForm, false); assert.equal(wroteDelivery, false);
});

function record() {
  const root = {
    id: "root", semantic_role: "card", render_mode: "presentation-table",
    visibility: { mode: "always" }, facts: [], children: [
      {
        id: "heading", semantic_role: "heading", render_mode: "html-text",
        visibility: { mode: "always" }, facts: [],
        content_slots: [{ id: "text", type: "rich-text", required: true }],
        children: [],
      },
      {
        id: "image", semantic_role: "image", render_mode: "direct-image",
        visibility: { mode: "always" }, facts: [],
        content_slots: [{ id: "alt", type: "alt-text", required: true }],
        asset_contract_id: "image", children: [],
      },
    ],
  };
  return {
    id: "test-card",
    properties: [{ id: "show-body", type: "boolean", default: true }],
    asset_contracts: [{ id: "image" }],
    contracts: { mobile: { root: structuredClone(root) }, desktop: { root: structuredClone(root) } },
  };
}

function model() {
  return {
    schema_version: "1.1.0", id: "test-email",
    metadata: { language: "ru", direction: "ltr" },
    root: {
      instance_id: "root-instance", component_id: "test-card",
      variants: { mobile: "mobile", desktop: "desktop" },
      property_values: [{ property_id: "show-body", scope: "all", value: true }],
      content_values: [
        {
          element_id: "heading", slot_id: "text", scope: "all",
          value: { type: "rich-text", segments: [{ type: "text", value: "Hello <team>" }] },
        },
        {
          element_id: "image", slot_id: "alt", scope: "all",
          value: { type: "alt-text", purpose: "informative", value: "Team" },
        },
      ],
      asset_files: [{ asset_contract_id: "image", path: "images/card.jpg" }],
      slots: [],
    },
  };
}

function dependencies() {
  const component = record();
  return {
    componentIndex: { bySystemId: new Map([[component.id, component]]) },
    rendererRegistry: { coverage: [{ component_id: component.id, mode: "interpreter" }] },
  };
}

function has(errors, code) {
  return errors.some((error) => error.code === code);
}

function hasPath(errors, code, path) {
  return errors.some((error) => error.code === code && error.path === path);
}

async function loadErrors(source) {
  const folder = await mkdtemp(join(tmpdir(), "cupis-email-model-"));
  const modelPath = join(folder, "email-model.json");
  await writeFile(modelPath, JSON.stringify(source), "utf8");
  try {
    await loadEmailModel({ modelPath, schemaPath });
    return [];
  } catch (error) {
    if (error instanceof AggregateError) return error.errors;
    throw error;
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
}

test("loader validates the model and normalizes restricted rich text", async () => {
  const folder = await mkdtemp(join(tmpdir(), "cupis-email-model-"));
  const modelPath = join(folder, "email-model.json");
  const source = model();
  await writeFile(modelPath, JSON.stringify(source), "utf8");
  try {
    const loaded = await loadEmailModel({ modelPath, schemaPath });
    assert.deepEqual(loaded.root.content_values[0].value, { type: "rich-text", value: "Hello <team>" });
    assert.deepEqual(JSON.parse(await readFile(modelPath, "utf8")), source);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test("loader rejects unknown fields through the strict schema", async () => {
  const folder = await mkdtemp(join(tmpdir(), "cupis-email-model-"));
  const modelPath = join(folder, "email-model.json");
  const value = model();
  value.unexpected = true;
  await writeFile(modelPath, JSON.stringify(value), "utf8");
  try {
    await assert.rejects(
      loadEmailModel({ modelPath, schemaPath }),
      (error) => error instanceof AggregateError && error.errors.some((item) => item.code === "email-model-schema"),
    );
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test("semantic validation accepts exact component, slot, property and asset IDs", () => {
  assert.deepEqual(validateEmailModelSemantics(model(), dependencies()), []);
});

test("semantic validation ignores required bindings for default-hidden instance children", () => {
  const component = record();
  for (const viewport of ["mobile", "desktop"]) {
    component.contracts[viewport].root.children.push({
      id: "hidden-image", semantic_role: "image", render_mode: "direct-image",
      visibility: { mode: "instance", default_visible: false }, facts: [],
      content_slots: [{ id: "alt", type: "alt-text", required: true }],
      asset_contract_id: "hidden-image", children: [],
    });
  }
  const deps = {
    componentIndex: { bySystemId: new Map([[component.id, component]]) },
    rendererRegistry: { coverage: [{ component_id: component.id, mode: "interpreter" }] },
  };

  assert.deepEqual(validateEmailModelSemantics(model(), deps), []);
});

test("semantic validation rejects unknown IDs and missing required content", () => {
  const unknown = model();
  unknown.root.component_id = "unknown-component";
  assert.ok(has(validateEmailModelSemantics(unknown, dependencies()), "EMAIL_MODEL_COMPONENT_UNKNOWN"));
  const missing = model();
  missing.root.content_values = missing.root.content_values.filter((item) => item.element_id !== "heading");
  assert.ok(has(validateEmailModelSemantics(missing, dependencies()), "EMAIL_MODEL_REQUIRED_CONTENT_MISSING"));
});

test("semantic validation rejects conflicting bindings", () => {
  const value = model();
  value.root.property_values.push({ property_id: "show-body", scope: "mobile", value: false });
  assert.ok(has(validateEmailModelSemantics(value, dependencies()), "EMAIL_MODEL_BINDING_CONFLICT"));
});

test("semantic validation rejects unsafe asset paths", () => {
  for (const path of ["../card.jpg", "C:\\temp\\card.jpg", "/tmp/card.jpg", "https://example.test/card.jpg"]) {
    const value = model();
    value.root.asset_files[0].path = path;
    assert.ok(has(validateEmailModelSemantics(value, dependencies()), "EMAIL_MODEL_ASSET_PATH_UNSAFE"), path);
  }
});

test("semantic validation rejects content and property type mismatches", () => {
  const value = model();
  value.root.content_values[0].value = { type: "number", value: 42 };
  value.root.property_values[0].value = "yes";
  const errors = validateEmailModelSemantics(value, dependencies());
  assert.ok(has(errors, "EMAIL_MODEL_CONTENT_TYPE_MISMATCH"));
  assert.ok(has(errors, "EMAIL_MODEL_PROPERTY_TYPE_MISMATCH"));
});

test("loader accepts required document metadata and tagged alt values", async () => {
  const informative = model();
  assert.deepEqual(await loadErrors(informative), []);

  const decorative = model();
  decorative.root.content_values[1].value = {
    type: "alt-text",
    purpose: "decorative",
    value: "",
  };
  assert.deepEqual(await loadErrors(decorative), []);
});

test("loader rejects missing or invalid document metadata at exact paths", async () => {
  const missing = model();
  delete missing.metadata;
  assert.ok(hasPath(await loadErrors(missing), "email-model-schema", "/"));

  const language = model();
  language.metadata.language = "";
  assert.ok(
    hasPath(
      await loadErrors(language),
      "email-model-schema",
      "/metadata/language",
    ),
  );

  const direction = model();
  direction.metadata.direction = "auto";
  assert.ok(
    hasPath(
      await loadErrors(direction),
      "email-model-schema",
      "/metadata/direction",
    ),
  );
});

test("loader rejects incomplete or contradictory tagged alt values", async () => {
  const missingPurpose = model();
  delete missingPurpose.root.content_values[1].value.purpose;
  assert.ok(
    hasPath(
      await loadErrors(missingPurpose),
      "email-model-schema",
      "/root/content_values/1/value",
    ),
  );

  const emptyInformative = model();
  emptyInformative.root.content_values[1].value.value = "";
  assert.ok(
    hasPath(
      await loadErrors(emptyInformative),
      "email-model-schema",
      "/root/content_values/1/value/value",
    ),
  );

  const nonEmptyDecorative = model();
  nonEmptyDecorative.root.content_values[1].value = {
    type: "alt-text",
    purpose: "decorative",
    value: "Logo",
  };
  assert.ok(
    hasPath(
      await loadErrors(nonEmptyDecorative),
      "email-model-schema",
      "/root/content_values/1/value/value",
    ),
  );
});

test("semantic validation rejects whitespace-only informative alt text", () => {
  const value = model();
  value.root.content_values[1].value.value = "   ";

  const errors = validateEmailModelSemantics(value, dependencies());

  assert.ok(
    hasPath(
      errors,
      "EMAIL_MODEL_INFORMATIVE_ALT_EMPTY",
      "/root/content_values/1/value/value",
    ),
  );
});

test("model variant axes select the exact two-option contract instead of the base variant", async () => {
  const value = model();
  value.root.variant_axes = {
    mobile: { Count: "2" },
    desktop: { Count: "2" },
  };
  assert.deepEqual(await loadErrors(value), []);

  const component = record();
  for (const viewport of ["mobile", "desktop"]) {
    component.contracts[viewport].root.children.push({
      id: "neutral", semantic_role: "label", render_mode: "html-text",
      visibility: { mode: "always" }, facts: [],
      content_slots: [{ id: "text", type: "plain-text", required: true }],
      children: [],
    });
  }
  component.contracts.variant_contracts = ["mobile", "desktop"].map((viewport) => ({
    axes: [{ name: "Viewport", value: viewport }, { name: "Count", value: "2" }],
    root: structuredClone(record().contracts[viewport].root),
  }));
  const deps = {
    componentIndex: { bySystemId: new Map([[component.id, component]]) },
    rendererRegistry: { coverage: [{ component_id: component.id, mode: "interpreter" }] },
  };
  assert.deepEqual(validateEmailModelSemantics(value, deps), []);

  value.root.variant_axes.mobile.Count = "4";
  assert.ok(has(validateEmailModelSemantics(value, deps), "EMAIL_MODEL_VARIANT_UNRESOLVED"));
});

test("one nested model instance can map to different mobile and desktop element IDs", async () => {
  const value = model();
  value.root.nested_components = [{
    element_ids: { mobile: "mobile-status", desktop: "desktop-status" },
    instance: {
      instance_id: "status-1", component_id: "test-status",
      variants: { mobile: "mobile", desktop: "desktop" },
      property_values: [], content_values: [], asset_files: [], slots: [],
    },
  }];
  assert.deepEqual(await loadErrors(value), []);

  const parent = record();
  for (const viewport of ["mobile", "desktop"]) {
    parent.contracts[viewport].root.children.push({
      id: viewport + "-status", semantic_role: "status",
      render_mode: "nested-component", component_id: "test-status",
      visibility: { mode: "always" }, facts: [], children: [],
    });
  }
  const childRoot = {
    id: "root", semantic_role: "status", render_mode: "presentation-table",
    visibility: { mode: "always" }, facts: [], children: [],
  };
  const status = {
    id: "test-status", properties: [], asset_contracts: [],
    contracts: { mobile: { root: structuredClone(childRoot) }, desktop: { root: structuredClone(childRoot) } },
  };
  const deps = {
    componentIndex: { bySystemId: new Map([[parent.id, parent], [status.id, status]]) },
    rendererRegistry: { coverage: [
      { component_id: parent.id, mode: "interpreter" },
      { component_id: status.id, mode: "interpreter" },
    ] },
  };
  assert.deepEqual(validateEmailModelSemantics(value, deps), []);
});
