import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadSystemManifest,
  validateManifestShape,
} from "../../scripts/lib/system-manifest.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schema = JSON.parse(
  await readFile(join(repoRoot, "schemas/manifest.schema.json"), "utf8"),
);

async function canonicalManifest() {
  return loadSystemManifest({ repoRoot });
}

test("loads the repository canonical manifest", async () => {
  const manifest = await canonicalManifest();
  assert.equal(manifest.schema_version, "1.0.0");
  assert.equal(manifest.system.id, "cupis-email-system");
});

test("rejects an unsupported manifest schema version", async () => {
  const manifest = structuredClone(await canonicalManifest());
  manifest.schema_version = "1.1.0";

  const errors = validateManifestShape(manifest, schema);

  assert.equal(errors[0].code, "manifest-version-unsupported");
  assert.equal(errors[0].path, "/schema_version");
});

test("rejects an unknown root property", async () => {
  const manifest = structuredClone(await canonicalManifest());
  manifest.unexpected = true;

  const errors = validateManifestShape(manifest, schema);

  assert.ok(
    errors.some(
      (error) =>
        error.code === "manifest-schema" &&
        error.path === "/" &&
        error.message.includes("unexpected"),
    ),
  );
});

test("rejects an unknown nested property", async () => {
  const manifest = structuredClone(await canonicalManifest());
  manifest.system.unexpected = true;

  const errors = validateManifestShape(manifest, schema);

  assert.ok(
    errors.some(
      (error) =>
        error.code === "manifest-schema" &&
        error.path === "/system" &&
        error.message.includes("unexpected"),
    ),
  );
});

test("rejects a missing required section", async () => {
  const manifest = structuredClone(await canonicalManifest());
  delete manifest.commands;

  const errors = validateManifestShape(manifest, schema);

  assert.ok(
    errors.some(
      (error) =>
        error.code === "manifest-schema" &&
        error.path === "/" &&
        error.message.includes("commands"),
    ),
  );
});

for (const invalidPath of [
  "/absolute/path.md",
  "C:\\absolute\\path.md",
  "../outside.md",
  "core/../outside.md",
  "core\\windows.md",
]) {
  test(`rejects unsafe repository path: ${invalidPath}`, async () => {
    const manifest = structuredClone(await canonicalManifest());
    manifest.entrypoints.repository = invalidPath;

    const errors = validateManifestShape(manifest, schema);

    assert.ok(
      errors.some(
        (error) =>
          error.code === "manifest-schema" &&
          error.path === "/entrypoints/repository",
      ),
    );
  });
}
