import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const moduleUrl = pathToFileURL(
  `${repoRoot}/scripts/lib/spacing-foundation.mjs`,
).href;

test("loads the canonical spacing foundation and resolves exact viewport values", async () => {
  const {
    loadSpacingFoundation,
    resolveDesignSpacing,
    validateSpacingSemantics,
  } = await import(moduleUrl);

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
