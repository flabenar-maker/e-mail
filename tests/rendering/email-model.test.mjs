import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEmailModel, validateEmailModelSemantics } from "../../scripts/lib/email-model.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schemaPath = join(repoRoot, "schemas/email-model.schema.json");

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
