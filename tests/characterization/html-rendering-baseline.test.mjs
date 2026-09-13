import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { auditRendererReadiness } from "../../scripts/lib/renderer-readiness.mjs";
import { loadRendererRegistry } from "../../scripts/lib/renderer-registry.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const execFileAsync = promisify(execFile);
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

test("preserves the measured legacy baseline outside the approved pilot delta", async () => {
  assert.equal(
    baseline.source_commit,
    "ba5cd1f4bc7af1ecb1987dc31bdf25725b5bef84",
  );

  const [registries, rendererRegistry] = await Promise.all([
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
  ]);
  const report = auditRendererReadiness(registries, rendererRegistry);
  for (const key of [
    "components",
    "active_components",
    "components_with_properties",
    "components_with_assets",
  ]) {
    assert.equal(report.summary[key], baseline[key], key);
  }
  // Three approved pilot layouts add 21 facts; Button/Primary adds two exact CSS angles.
  assert.equal(report.summary.facts, baseline.renderer_ready_pilot.facts + 23);
  assert.equal(
    report.summary.generic_description_facts,
    baseline.renderer_ready_pilot.generic_description_facts,
  );
  assert.equal(
    report.summary.components_with_generic_facts,
    baseline.renderer_ready_pilot.components_with_generic_facts,
  );
  assert.equal(
    report.summary.covered_active_components,
    baseline.renderer_ready_pilot.covered_components,
  );
  assert.equal(
    report.summary.ready_components,
    baseline.renderer_ready_pilot.ready_components,
  );
  assert.equal(
    report.summary.missing_coverage,
    baseline.renderer_ready_pilot.missing_coverage,
  );

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
      sourceIds.some((sourceId) =>
        baseline.rendering_source_ids.includes(sourceId),
      ),
      false,
    );
  }
});

test("renderer readiness CLI prints JSON and creates no email output", async () => {
  const { stdout, stderr } = await execFileAsync(
    process.execPath,
    [
      join(repoRoot, "scripts/audit-renderer-readiness.mjs"),
      "--repo-root",
      repoRoot,
    ],
    { cwd: repoRoot, encoding: "utf8" },
  );

  assert.equal(stderr, "");
  const report = JSON.parse(stdout);
  assert.equal(report.summary.components, baseline.components);
  assert.equal(
    report.summary.generic_description_facts,
    baseline.renderer_ready_pilot.generic_description_facts,
  );
  assert.equal(
    report.summary.ready_components,
    baseline.renderer_ready_pilot.ready_components,
  );
  assert.equal(await exists("email.html"), false);
  assert.equal(await exists("images"), false);
});

test("does not track concrete email output in the system repository", async () => {
  const { stdout } = await execFileAsync(
    "git",
    ["-C", repoRoot, "ls-files"],
    { encoding: "utf8" },
  );
  const trackedPaths = stdout
    .split(/\r?\n/gu)
    .filter(Boolean)
    .map((path) => path.replaceAll("\\", "/"));

  assert.equal(
    trackedPaths.some(
      (path) => /(?:^|\/)email\.html$/u.test(path) || /(?:^|\/)images(?:\/|$)/u.test(path),
    ),
    false,
  );
});
