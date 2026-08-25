import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { validateDocumentShape } from "../../scripts/lib/schema-validation.mjs";
import {
  parseStrictYaml,
  readStrictYaml,
} from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schemaPath = join(repoRoot, "schemas/typography.schema.json");
const dataPath = join(repoRoot, "data/foundations/typography.yaml");

async function readSchema() {
  return JSON.parse(await readFile(schemaPath, "utf8"));
}

async function canonicalTypography() {
  return readStrictYaml(dataPath);
}

function validate(document, schema) {
  return validateDocumentShape({
    document,
    schema,
    supportedVersion: "1.0.0",
    versionCode: "typography-version-unsupported",
    schemaCode: "typography-schema",
  });
}

test("loads the canonical typography foundation", async () => {
  const [schema, typography] = await Promise.all([
    readSchema(),
    canonicalTypography(),
  ]);

  assert.deepEqual(validate(typography, schema), []);
  assert.equal(typography.styles.length, 15);
  assert.equal(typography.responsive_pairs.length, 8);
});

test("rejects an unsupported typography version", async () => {
  const [schema, typography] = await Promise.all([
    readSchema(),
    canonicalTypography(),
  ]);
  typography.schema_version = "1.1.0";

  const errors = validate(typography, schema);

  assert.equal(errors[0].code, "typography-version-unsupported");
  assert.equal(errors[0].path, "/schema_version");
});

for (const [name, mutate, expectedPath] of [
  [
    "unknown root data",
    (value) => {
      value.unexpected = true;
    },
    "/",
  ],
  [
    "unknown nested data",
    (value) => {
      value.foundation.source.unexpected = true;
    },
    "/foundation/source",
  ],
  [
    "missing styles",
    (value) => {
      delete value.styles;
    },
    "/",
  ],
  [
    "zero font size",
    (value) => {
      value.styles[0].font_size_px = 0;
    },
    "/styles/0/font_size_px",
  ],
  [
    "non-hundred font weight",
    (value) => {
      value.styles[0].font.css_weight = 550;
    },
    "/styles/0/font/css_weight",
  ],
  [
    "measure without unit",
    (value) => {
      delete value.styles[0].line_height.unit;
    },
    "/styles/0/line_height",
  ],
  [
    "unknown viewport",
    (value) => {
      value.styles[0].viewport = "tablet";
    },
    "/styles/0/viewport",
  ],
  [
    "unknown role",
    (value) => {
      value.styles[0].role = "label";
    },
    "/styles/0/role",
  ],
  [
    "unknown variant",
    (value) => {
      value.styles[0].variant = "tiny";
    },
    "/styles/0/variant",
  ],
]) {
  test(`rejects ${name}`, async () => {
    const [schema, typography] = await Promise.all([
      readSchema(),
      canonicalTypography(),
    ]);
    mutate(typography);

    const errors = validate(typography, schema);

    assert.ok(
      errors.some(
        (error) =>
          error.code === "typography-schema" &&
          error.path === expectedPath,
      ),
    );
  });
}

test("rejects a remote reference in the typography schema", async () => {
  const [schema, typography] = await Promise.all([
    readSchema(),
    canonicalTypography(),
  ]);
  schema.$defs.style.properties.font = {
    $ref: "https://example.com/font.schema.json",
  };

  assert.throws(
    () => validate(typography, schema),
    (error) => error.code === "remote-schema-reference",
  );
});

for (const [name, yaml, code] of [
  ["duplicate keys", "schema_version: 1.0.0\nschema_version: 1.0.0\n", "yaml-duplicate-key"],
  ["anchors", "schema_version: &version 1.0.0\n", "yaml-anchor-forbidden"],
  ["aliases", "version: &version 1.0.0\nschema_version: *version\n", "yaml-alias-forbidden"],
  ["merge keys", "base: &base\n  id: typography\nfoundation:\n  <<: *base\n", "yaml-merge-key-forbidden"],
]) {
  test(`strict YAML rejects typography ${name}`, () => {
    assert.throws(
      () => parseStrictYaml(yaml, "typography.yaml"),
      (error) => error.code === code,
    );
  });
}
