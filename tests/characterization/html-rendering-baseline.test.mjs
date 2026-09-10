import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { auditRendererReadiness } from "../../scripts/lib/renderer-readiness.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const baseline = JSON.parse(
  await readFile(
    join(repoRoot, "tests/fixtures/rendering/legacy-baseline.json"),
    "utf8",
  ),
);

function digestText(content) {
  return `sha256:${createHash("sha256")
    .update(content.replace(/\r\n/gu, "\n"), "utf8")
    .digest("hex")}`;
}

async function exists(relativePath) {
  try {
    await access(join(repoRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

test("preserves the measured legacy renderer baseline", async () => {
  assert.equal(
    baseline.source_commit,
    "ba5cd1f4bc7af1ecb1987dc31bdf25725b5bef84",
  );

  const registries = await loadComponentRegistries({ repoRoot });
  const report = auditRendererReadiness(registries);
  for (const key of [
    "components",
    "active_components",
    "facts",
    "generic_description_facts",
    "components_with_generic_facts",
    "components_with_properties",
    "components_with_assets",
  ]) {
    assert.equal(report.summary[key], baseline[key], key);
  }

  for (const [relativePath, expected] of Object.entries(
    baseline.legacy_digests,
  )) {
    const content = await readFile(join(repoRoot, relativePath), "utf8");
    assert.equal(digestText(content), expected, relativePath);
  }
});

test("keeps active bundles on their exact legacy sources", async () => {
  const manifest = await readStrictYaml(join(repoRoot, "system/manifest.yaml"));
  const activeProfiles = Object.fromEntries(
    manifest.bundle_profiles.map(({ id, source_ids: sourceIds }) => [
      id,
      sourceIds,
    ]),
  );

  assert.deepEqual(activeProfiles, baseline.active_bundle_source_ids);
  for (const sourceIds of Object.values(activeProfiles)) {
    assert.equal(
      sourceIds.some((sourceId) => baseline.rendering_source_ids.includes(sourceId)),
      false,
    );
  }
});

test("does not place concrete email output in the system repository", async () => {
  assert.equal(await exists("email.html"), false);
  assert.equal(await exists("images"), false);
});
