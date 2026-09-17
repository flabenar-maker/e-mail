import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadRenderingFoundation,
  resolveRenderingDefinition,
  validateRenderingSemantics,
  validateRenderingShape,
} from "../../scripts/lib/rendering-foundation.mjs";
import {
  parseStrictYaml,
  readStrictYaml,
} from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schemaPath = join(repoRoot, "schemas/rendering.schema.json");
const dataPath = join(repoRoot, "data/foundations/rendering.yaml");

async function canonicalRendering() {
  return readStrictYaml(dataPath);
}

async function readSchema() {
  return JSON.parse(await readFile(schemaPath, "utf8"));
}

function hasDiagnostic(errors, code, path) {
  return errors.some((error) => error.code === code && error.path === path);
}

test("loads the canonical rendering foundation", async () => {
  const rendering = await loadRenderingFoundation({ repoRoot });

  assert.equal(rendering.foundation.id, "rendering");
  assert.equal(rendering.foundation.status, "shadow");
  assert.deepEqual(rendering.breakpoints, [
    { id: "cupis-mobile", query: "max-width", value: 659, unit: "px" },
  ]);
  assert.deepEqual(rendering.shell, {
    background_color: "#F3F3F5",
    horizontal_inset_px: 15,
    max_width_px: 600,
    min_supported_viewport_px: 300,
  });
  assert.deepEqual(rendering.embedded_css, { max_bytes_exclusive: 16384 });
  assert.deepEqual(rendering.color_scheme, {
    declaration: "none",
    dark_variant: "none",
  });
  assert.deepEqual(rendering.responsive_fallback, {
    without_embedded_css: "desktop",
    validation: "required-before-change",
  });
  assert.deepEqual(
    rendering.responsive_strategies.map((item) => item.id),
    ["shared-tree", "split-subtree", "split-component"],
  );
  assert.deepEqual(
    rendering.primitives.map((item) => item.id),
    [
      "email-shell",
      "section",
      "table",
      "text",
      "link",
      "direct-image",
      "background-image",
      "responsive-visibility",
    ],
  );
  assert.deepEqual(validateRenderingSemantics(rendering), []);
});

test("schema rejects unknown root and nested fields", async () => {
  const [rendering, schema] = await Promise.all([
    canonicalRendering(),
    readSchema(),
  ]);
  rendering.unexpected = true;
  rendering.primitives[0].unexpected = true;

  const errors = validateRenderingShape(rendering, schema);

  assert.ok(hasDiagnostic(errors, "rendering-schema", "/"));
  assert.ok(hasDiagnostic(errors, "rendering-schema", "/primitives/0"));
});

test("shape validation rejects unsupported version", async () => {
  const [rendering, schema] = await Promise.all([
    canonicalRendering(),
    readSchema(),
  ]);
  rendering.schema_version = "2.0.0";

  const errors = validateRenderingShape(rendering, schema);

  assert.ok(
    hasDiagnostic(
      errors,
      "rendering-version-unsupported",
      "/schema_version",
    ),
  );
});

test("schema rejects a fractional breakpoint", async () => {
  const [rendering, schema] = await Promise.all([
    canonicalRendering(),
    readSchema(),
  ]);
  rendering.breakpoints[0].value = 660.5;

  const errors = validateRenderingShape(rendering, schema);

  assert.ok(
    hasDiagnostic(errors, "rendering-schema", "/breakpoints/0/value"),
  );
});

test("strict YAML rejects duplicate rendering keys", () => {
  assert.throws(
    () =>
      parseStrictYaml(
        "schema_version: 1.1.0\nschema_version: 1.1.0\n",
        "rendering.yaml",
      ),
    (error) => error.code === "yaml-duplicate-key",
  );
});

for (const [name, group] of [
  ["breakpoint", "breakpoints"],
  ["responsive strategy", "responsive_strategies"],
  ["primitive", "primitives"],
  ["support profile", "support_profiles"],
]) {
  test(`semantic validation reports duplicate ${name} ids`, async () => {
    const rendering = await canonicalRendering();
    rendering[group].push(structuredClone(rendering[group][0]));

    const errors = validateRenderingSemantics(rendering);

    assert.ok(errors.some((error) => error.code === "RENDERING_DUPLICATE_ID"));
  });
}

test("semantic validation forbids component and Figma records", async () => {
  const rendering = await canonicalRendering();
  rendering.foundation.component_id = "Banner/Hero";
  rendering.primitives[0].node_id = "538:17236";

  const errors = validateRenderingSemantics(rendering);

  assert.ok(
    errors.filter(
      (error) => error.code === "RENDERING_CONCRETE_RECORD_FORBIDDEN",
    ).length >= 2,
  );
});

test("semantic diagnostics are sorted deterministically", async () => {
  const rendering = await canonicalRendering();
  rendering.support_profiles.push(
    structuredClone(rendering.support_profiles[0]),
  );
  rendering.breakpoints[0].component_id = "Banner/Hero";

  const errors = validateRenderingSemantics(rendering);

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

test("resolver returns a detached definition clone", async () => {
  const rendering = await canonicalRendering();
  const resolved = resolveRenderingDefinition(rendering, {
    group: "primitives",
    id: "text",
  });

  resolved.contract = "changed";

  assert.equal(rendering.primitives[3].contract, "html-text");
});

test("resolver rejects an unknown group without guessing", async () => {
  const rendering = await canonicalRendering();

  assert.throws(
    () =>
      resolveRenderingDefinition(rendering, {
        group: "components",
        id: "Banner/Hero",
      }),
    (error) => error.code === "RENDERING_DEFINITION_UNKNOWN",
  );
});

test("resolver rejects an unknown id without fallback", async () => {
  const rendering = await canonicalRendering();

  assert.throws(
    () =>
      resolveRenderingDefinition(rendering, {
        group: "primitives",
        id: "missing",
      }),
    (error) => error.code === "RENDERING_DEFINITION_UNKNOWN",
  );
});

test("combined foundation validator loads canonical data", async () => {
  const rendering = await import(
    "../../scripts/lib/rendering-foundation.mjs"
  );
  const result = await rendering.validateRenderingFoundation({ repoRoot });

  assert.equal(result.rendering.foundation.id, "rendering");
  assert.deepEqual(result.errors, []);
});

test("schema requires exact client resilience policies and rejects removed shell naming", async () => {
  const [rendering, schema] = await Promise.all([
    canonicalRendering(),
    readSchema(),
  ]);
  rendering.embedded_css = { max_bytes_exclusive: 0 };
  rendering.color_scheme = { declaration: "dark", dark_variant: "none" };
  rendering.responsive_fallback = {
    without_embedded_css: "desktop",
    validation: "required-before-change",
  };
  rendering.shell.min_supported_viewport_px = 300;
  rendering.shell.min_width_px = 300;

  const errors = validateRenderingShape(rendering, schema);

  assert.ok(
    hasDiagnostic(
      errors,
      "rendering-schema",
      "/embedded_css/max_bytes_exclusive",
    ),
  );
  assert.ok(
    hasDiagnostic(errors, "rendering-schema", "/color_scheme/declaration"),
  );
  assert.ok(hasDiagnostic(errors, "rendering-schema", "/shell"));
});

test("semantic validation rejects a viewport consumed by horizontal shell insets", async () => {
  const rendering = await canonicalRendering();
  delete rendering.shell.min_width_px;
  rendering.shell.min_supported_viewport_px = 30;

  const errors = validateRenderingSemantics(rendering);

  assert.ok(
    hasDiagnostic(
      errors,
      "RENDERING_SHELL_VIEWPORT_IMPOSSIBLE",
      "/shell/min_supported_viewport_px",
    ),
  );
});
