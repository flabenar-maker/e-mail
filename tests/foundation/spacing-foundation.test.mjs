import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadSpacingFoundation,
  resolveDesignSpacing,
  validateSpacingSemantics,
  validateSpacingShape,
} from "../../scripts/lib/spacing-foundation.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schemaPath = join(repoRoot, "schemas/spacing.schema.json");
const dataPath = join(repoRoot, "data/foundations/spacing.yaml");

async function canonicalSpacing() {
  return readStrictYaml(dataPath);
}

async function readSchema() {
  return JSON.parse(await readFile(schemaPath, "utf8"));
}

test("loads the canonical spacing foundation and resolves exact viewport values", async () => {
  const spacing = await loadSpacingFoundation({
    repoRoot,
    dataPath: "data/foundations/spacing.yaml",
    schemaPath: "schemas/spacing.schema.json",
  });

  assert.equal(spacing.foundation.id, "spacing");
  assert.equal(spacing.foundation.status, "shadow");
  assert.equal(spacing.roles.length, 15);
  assert.deepEqual(validateSpacingSemantics(spacing), []);
  assert.equal(
    resolveDesignSpacing(spacing, {
      roleId: "outer-flow",
      viewport: "mobile",
    }),
    16,
  );
  assert.equal(
    resolveDesignSpacing(spacing, {
      roleId: "outer-flow",
      viewport: "desktop",
    }),
    24,
  );
});

test("schema rejects unknown root and nested fields", async () => {
  const [spacing, schema] = await Promise.all([
    canonicalSpacing(),
    readSchema(),
  ]);
  spacing.unexpected = true;
  spacing.roles[0].resolutions.mobile.unexpected = true;

  const errors = validateSpacingShape(spacing, schema);

  assert.ok(
    errors.some(
      (error) => error.code === "spacing-schema" && error.path === "/",
    ),
  );
  assert.ok(
    errors.some(
      (error) =>
        error.code === "spacing-schema" &&
        error.path === "/roles/0/resolutions/mobile",
    ),
  );
});

for (const [name, mutate, code] of [
  [
    "duplicate role id",
    (spacing) => {
      spacing.roles[1].id = spacing.roles[0].id;
    },
    "SPACING_DUPLICATE_ROLE_ID",
  ],
  [
    "non-exact value",
    (spacing) => {
      spacing.roles[0].resolutions.mobile.value_px = 16.5;
    },
    "SPACING_NON_EXACT_VALUE",
  ],
  [
    "unresolved viewport value",
    (spacing) => {
      delete spacing.roles[0].resolutions.mobile;
    },
    "SPACING_UNRESOLVED_ROLE",
  ],
  [
    "invalid binding provenance",
    (spacing) => {
      spacing.roles[0].resolutions.mobile.provenance = {
        kind: "figma-variable",
      };
    },
    "SPACING_INVALID_BINDING_PROVENANCE",
  ],
  [
    "invalid exception",
    (spacing) => {
      spacing.exceptions.push({
        id: "bad-exception",
        viewport: "mobile",
      });
    },
    "SPACING_INVALID_EXCEPTION",
  ],
  [
    "build choice field",
    (spacing) => {
      spacing.roles[0].resolutions.mobile.allowed_values = [16, 24];
    },
    "SPACING_BUILD_CHOICE_FORBIDDEN",
  ],
]) {
  test(`reports ${name} with a stable spacing diagnostic`, async () => {
    const spacing = await canonicalSpacing();
    mutate(spacing);

    const errors = validateSpacingSemantics(spacing);

    assert.ok(errors.some((error) => error.code === code));
  });
}

test("resolver rejects an unknown role without guessing", async () => {
  const spacing = await canonicalSpacing();

  assert.throws(
    () =>
      resolveDesignSpacing(spacing, {
        roleId: "missing-role",
        viewport: "mobile",
      }),
    (error) => error.code === "SPACING_UNRESOLVED_ROLE",
  );
});

test("resolver rejects an unknown viewport without fallback", async () => {
  const spacing = await canonicalSpacing();

  assert.throws(
    () =>
      resolveDesignSpacing(spacing, {
        roleId: "outer-flow",
        viewport: "tablet",
      }),
    (error) => error.code === "SPACING_UNKNOWN_VIEWPORT",
  );
});

test("semantic diagnostics are sorted deterministically", async () => {
  const spacing = await canonicalSpacing();
  spacing.roles[1].id = spacing.roles[0].id;
  spacing.roles[0].resolutions.mobile.value_px = 16.5;

  const errors = validateSpacingSemantics(spacing);
  const sorted = [...errors].sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );

  assert.deepEqual(errors, sorted);
});
