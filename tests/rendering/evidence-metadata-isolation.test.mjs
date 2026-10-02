import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { renderFigmaComponentDescription } from "../../scripts/lib/component-description.mjs";
const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
test("synthetic evidence metadata preserves all compact descriptions", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const records = Object.values(registries).flatMap(({ components }) => components);
  assert.equal(records.length, 61);
  for (const record of records) {
    const copy = structuredClone(record); const before = renderFigmaComponentDescription(copy);
    copy.evidence_links = { foundation_values: [], source_dependencies: [] };
    assert.equal(renderFigmaComponentDescription(copy), before, record.id);
  }
});
