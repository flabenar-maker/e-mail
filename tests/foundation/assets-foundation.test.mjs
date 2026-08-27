import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadAssetsFoundation,
  validateAssetsShape,
} from "../../scripts/lib/assets-foundation.mjs";
import {
  parseStrictYaml,
  readStrictYaml,
} from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schemaPath = join(repoRoot, "schemas/assets.schema.json");
const dataPath = join(repoRoot, "data/foundations/assets.yaml");

async function canonicalAssets() {
  return readStrictYaml(dataPath);
}

async function readSchema() {
  return JSON.parse(await readFile(schemaPath, "utf8"));
}

function hasDiagnostic(errors, code, path) {
  return errors.some((error) => error.code === code && error.path === path);
}

test("loads the canonical assets foundation through its strict shape contract", async () => {
  const assets = await loadAssetsFoundation({ repoRoot });

  assert.equal(assets.foundation.id, "assets");
  assert.equal(assets.foundation.status, "shadow");
  assert.deepEqual(
    assets.source_modes.map((item) => item.id),
    ["image-fill", "rendered-node"],
  );
  assert.deepEqual(
    assets.display_modes.map((item) => item.id),
    ["direct-image", "fill-image"],
  );
  assert.deepEqual(
    assets.export_profiles.map((item) => item.id),
    ["jpeg-2x", "png-4x"],
  );
  assert.deepEqual(
    assets.alpha_modes.map((item) => item.id),
    ["none", "transparent", "opaque", "source"],
  );
  assert.deepEqual(
    assets.clipping_policies.map((item) => item.id),
    ["preserve-artwork", "neutralize-presentation-only"],
  );
});

test("schema rejects unknown root and nested fields", async () => {
  const [assets, schema] = await Promise.all([
    canonicalAssets(),
    readSchema(),
  ]);
  assets.unexpected = true;
  assets.source_modes[0].contract.unexpected = true;

  const errors = validateAssetsShape(assets, schema);

  assert.ok(hasDiagnostic(errors, "assets-schema", "/"));
  assert.ok(
    hasDiagnostic(
      errors,
      "assets-schema",
      "/source_modes/0/contract",
    ),
  );
});

test("shape validation rejects an unsupported assets version", async () => {
  const [assets, schema] = await Promise.all([
    canonicalAssets(),
    readSchema(),
  ]);
  assets.schema_version = "1.1.0";

  const errors = validateAssetsShape(assets, schema);

  assert.ok(
    hasDiagnostic(
      errors,
      "assets-version-unsupported",
      "/schema_version",
    ),
  );
});

for (const group of [
  "source_modes",
  "display_modes",
  "export_profiles",
  "alpha_modes",
  "clipping_policies",
  "compatibility",
  "global_invariants",
]) {
  test(`shape validation requires at least one ${group} item`, async () => {
    const [assets, schema] = await Promise.all([
      canonicalAssets(),
      readSchema(),
    ]);
    assets[group] = [];

    const errors = validateAssetsShape(assets, schema);

    assert.ok(hasDiagnostic(errors, "assets-schema", `/${group}`));
  });
}

test("shape validation rejects malformed definition ids", async () => {
  const [assets, schema] = await Promise.all([
    canonicalAssets(),
    readSchema(),
  ]);
  assets.source_modes[0].id = "IMAGE FILL";

  const errors = validateAssetsShape(assets, schema);

  assert.ok(
    hasDiagnostic(errors, "assets-schema", "/source_modes/0/id"),
  );
});

for (const [name, mutate, expectedPath] of [
  [
    "owner",
    (assets) => {
      assets.source_modes[0].contract.owner = "hero-image";
    },
    "/source_modes/0/contract",
  ],
  [
    "export_boundary",
    (assets) => {
      assets.display_modes[0].contract.export_boundary = "asset-node";
    },
    "/display_modes/0/contract",
  ],
  [
    "display_width",
    (assets) => {
      assets.export_profiles[0].contract.display_width = 232;
    },
    "/export_profiles/0/contract",
  ],
  [
    "display_height",
    (assets) => {
      assets.compatibility[0].display_height = 148;
    },
    "/compatibility/0",
  ],
  [
    "component_id",
    (assets) => {
      assets.global_invariants[0].component_id = "Banner/Hero";
    },
    "/global_invariants/0",
  ],
]) {
  test(`shape validation rejects component build field ${name}`, async () => {
    const [assets, schema] = await Promise.all([
      canonicalAssets(),
      readSchema(),
    ]);
    mutate(assets);

    const errors = validateAssetsShape(assets, schema);

    assert.ok(hasDiagnostic(errors, "assets-schema", expectedPath));
  });
}

test("strict YAML rejects duplicate assets keys", () => {
  assert.throws(
    () =>
      parseStrictYaml(
        "schema_version: 1.0.0\nschema_version: 1.0.0\n",
        "assets.yaml",
      ),
    (error) => error.code === "yaml-duplicate-key",
  );
});
