import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as namingFoundation from "../../scripts/lib/figma-naming-foundation.mjs";
import {
  loadFigmaNamingFoundation,
  validateFigmaNamingShape,
} from "../../scripts/lib/figma-naming-foundation.mjs";
import {
  parseStrictYaml,
  readStrictYaml,
} from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schemaPath = join(repoRoot, "schemas/figma-naming.schema.json");
const dataPath = join(repoRoot, "data/foundations/figma-naming.yaml");

async function canonicalNaming() {
  return readStrictYaml(dataPath);
}

async function readSchema() {
  return JSON.parse(await readFile(schemaPath, "utf8"));
}

function hasDiagnostic(errors, code, path) {
  return errors.some((error) => error.code === code && error.path === path);
}

test("loads the canonical Figma naming foundation", async () => {
  const naming = await loadFigmaNamingFoundation({ repoRoot });

  assert.equal(naming.foundation.id, "figma-naming");
  assert.equal(naming.foundation.status, "shadow");
  assert.deepEqual(
    naming.namespaces.map((item) => item.label),
    [
      "Email",
      "Banner",
      "Block",
      "Card",
      "Item",
      "Button",
      "Badge",
      "Details",
      "NPS",
      "Icon",
      "Asset",
    ],
  );
  assert.deepEqual(
    naming.layer_names.controlled_roles,
    [
      "image-area",
      "content-area",
      "text-content",
      "heading",
      "body",
      "caption",
      "supporting-text",
      "label",
      "link",
      "actions",
      "cards",
      "items",
      "steps",
      "bullets",
      "rows",
      "divider",
      "social-links",
      "background",
      "glyph",
      "artwork",
    ],
  );
});

test("schema rejects unknown root and nested fields", async () => {
  const [naming, schema] = await Promise.all([
    canonicalNaming(),
    readSchema(),
  ]);
  naming.unexpected = true;
  naming.foundation.unexpected = true;

  const errors = validateFigmaNamingShape(naming, schema);

  assert.ok(hasDiagnostic(errors, "figma-naming-schema", "/"));
  assert.ok(
    hasDiagnostic(errors, "figma-naming-schema", "/foundation"),
  );
});

test("shape validation rejects unsupported version", async () => {
  const [naming, schema] = await Promise.all([
    canonicalNaming(),
    readSchema(),
  ]);
  naming.schema_version = "1.2.0";

  const errors = validateFigmaNamingShape(naming, schema);

  assert.ok(
    hasDiagnostic(
      errors,
      "figma-naming-version-unsupported",
      "/schema_version",
    ),
  );
});

test("strict YAML rejects duplicate Figma naming keys", () => {
  assert.throws(
    () =>
      parseStrictYaml(
        "schema_version: 1.0.0\nschema_version: 1.0.0\n",
        "figma-naming.yaml",
      ),
    (error) => error.code === "yaml-duplicate-key",
  );
});

for (const [name, mutate, expectedCode] of [
  [
    "duplicate namespace id",
    (naming) => naming.namespaces.push(structuredClone(naming.namespaces[0])),
    "FIGMA_NAMING_DUPLICATE_ID",
  ],
  [
    "duplicate namespace label",
    (naming) => {
      naming.namespaces[1].label = naming.namespaces[0].label;
    },
    "FIGMA_NAMING_DUPLICATE_LABEL",
  ],
  [
    "duplicate layer role",
    (naming) => {
      naming.layer_names.controlled_roles.push(
        naming.layer_names.controlled_roles[0],
      );
    },
    "FIGMA_NAMING_DUPLICATE_ID",
  ],
  [
    "broken variant axis order",
    (naming) => {
      naming.variant_axes[1].order = 1;
    },
    "FIGMA_NAMING_AXIS_ORDER_INVALID",
  ],
  [
    "mismatched scale suffix",
    (naming) => {
      naming.asset_owners.scale_suffixes[0].suffix = "@4x";
    },
    "FIGMA_NAMING_SCALE_SUFFIX_MISMATCH",
  ],
  [
    "unknown viewport axis reference",
    (naming) => {
      naming.organizational_names.template.viewport_axis_id = "unknown";
    },
    "FIGMA_NAMING_UNKNOWN_REFERENCE",
  ],
  [
    "concrete component record",
    (naming) => {
      naming.foundation.component_id = "Banner/Hero";
    },
    "FIGMA_NAMING_CONCRETE_RECORD_FORBIDDEN",
  ],
]) {
  test("semantic validation reports " + name, async () => {
    const naming = await canonicalNaming();
    mutate(naming);

    const errors = namingFoundation.validateFigmaNamingSemantics(naming);

    assert.ok(errors.some((error) => error.code === expectedCode));
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
}

test("canonical Figma naming foundation is semantically valid", async () => {
  const naming = await canonicalNaming();

  assert.deepEqual(
    namingFoundation.validateFigmaNamingSemantics(naming),
    [],
  );
});

test("combined foundation validator loads canonical data", async () => {
  const result = await namingFoundation.validateFigmaNamingFoundation({
    repoRoot,
  });

  assert.equal(result.naming.foundation.id, "figma-naming");
  assert.deepEqual(result.errors, []);
});
