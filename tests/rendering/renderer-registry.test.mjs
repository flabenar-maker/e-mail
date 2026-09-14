import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadRendererRegistry,
  resolveRendererCoverage,
  validateRendererRegistrySemantics,
  validateRendererRegistryShape,
} from "../../scripts/lib/renderer-registry.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const dataPath = join(repoRoot, "data/renderers/registry.yaml");
const schemaPath = join(repoRoot, "schemas/renderer-registry.schema.json");
const pilotIds = [
  "email-template",
  "button-primary",
  "button-secondary",
  "card-image",
  "banner-secondary",
  "banner-app-download",
  "email-footer",
];

async function canonicalRegistry() {
  return readStrictYaml(dataPath);
}

async function readSchema() {
  return JSON.parse(await readFile(schemaPath, "utf8"));
}

function hasDiagnostic(errors, code, path = null) {
  return errors.some(
    (error) => error.code === code && (path === null || error.path === path),
  );
}

test("loads exact interpreter coverage for the seven pilot components", async () => {
  const registry = await loadRendererRegistry({ repoRoot });

  assert.equal(registry.registry.id, "email-renderers");
  assert.equal(registry.registry.status, "shadow");
  assert.deepEqual(
    registry.coverage.map(({ component_id, mode }) => ({ component_id, mode })),
    pilotIds.map((component_id) => ({
      component_id,
      mode: "interpreter",
    })),
  );
  assert.deepEqual(validateRendererRegistrySemantics(registry), []);
});

test("renderer registry schema rejects unknown fields", async () => {
  const [registry, schema] = await Promise.all([
    canonicalRegistry(),
    readSchema(),
  ]);
  registry.unexpected = true;
  registry.coverage[0].unexpected = true;

  const errors = validateRendererRegistryShape(registry, schema);

  assert.ok(hasDiagnostic(errors, "renderer-registry-schema", "/"));
  assert.ok(
    hasDiagnostic(errors, "renderer-registry-schema", "/coverage/0"),
  );
});

test("renderer registry schema enforces fields owned by each mode", async () => {
  const [registry, schema] = await Promise.all([
    canonicalRegistry(),
    readSchema(),
  ]);
  registry.coverage = [
    {
      component_id: "recipe-component",
      mode: "recipe",
      recipe_id: "two-column",
    },
    {
      component_id: "custom-component",
      mode: "custom",
      handler_id: "custom-handler",
    },
    {
      component_id: "source-only-component",
      mode: "source-only",
      reason: "Figma-only source",
    },
    {
      component_id: "unsupported-component",
      mode: "unsupported",
      reason: "Renderer contract not approved",
    },
  ];

  assert.deepEqual(validateRendererRegistryShape(registry, schema), []);

  registry.coverage[0].handler_id = "wrong-owner";
  registry.coverage[1].recipe_id = "wrong-owner";
  registry.coverage[2].handler_id = "wrong-owner";
  registry.coverage[3].recipe_id = "wrong-owner";
  const errors = validateRendererRegistryShape(registry, schema);
  assert.equal(
    errors.filter((error) => error.code === "renderer-registry-schema").length,
    4,
  );
});

test("renderer registry schema rejects missing mode-owned fields", async () => {
  const [registry, schema] = await Promise.all([
    canonicalRegistry(),
    readSchema(),
  ]);
  registry.coverage = [
    { component_id: "recipe-component", mode: "recipe" },
    { component_id: "custom-component", mode: "custom" },
    { component_id: "source-only-component", mode: "source-only" },
    { component_id: "unsupported-component", mode: "unsupported" },
  ];

  const errors = validateRendererRegistryShape(registry, schema);

  assert.equal(
    errors.filter((error) => error.code === "renderer-registry-schema").length,
    4,
  );
});

test("semantic validation reports duplicate component coverage deterministically", async () => {
  const registry = await canonicalRegistry();
  registry.coverage.push(structuredClone(registry.coverage[0]));

  const errors = validateRendererRegistrySemantics(registry);

  assert.ok(hasDiagnostic(errors, "RENDERER_COVERAGE_DUPLICATE"));
  assert.deepEqual(
    errors,
    [...errors].sort(
      (left, right) =>
        left.path.localeCompare(right.path) ||
        left.code.localeCompare(right.code) ||
        left.message.localeCompare(right.message),
    ),
  );
});

test("resolver returns a detached exact coverage record", async () => {
  const registry = await canonicalRegistry();
  const coverage = resolveRendererCoverage(registry, "card-image");

  assert.deepEqual(coverage, {
    component_id: "card-image",
    mode: "interpreter",
  });
  coverage.mode = "custom";
  assert.equal(registry.coverage[2].mode, "interpreter");
});

test("resolver rejects unknown component coverage without guessing", async () => {
  const registry = await canonicalRegistry();

  assert.throws(
    () => resolveRendererCoverage(registry, "missing-component"),
    (error) => error.code === "RENDERER_COVERAGE_UNKNOWN",
  );
});
