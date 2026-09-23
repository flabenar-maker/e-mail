import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const transformedComponentSources = new Set([
  "components-shared",
  "components-marketing",
  "components-service",
]);

test("each email workflow rule is delivered by its bundle or transformed component selection", async () => {
  const manifest = await readStrictYaml(join(repoRoot, "system/manifest.yaml"));
  const { workflow } = JSON.parse(await readFile(join(repoRoot, "data/workflows/email-build.yaml"), "utf8"));

  for (const routeId of ["email-new-build", "email-continue-fix"]) {
    const profile = manifest.bundle_profiles.find(({ id }) => id === routeId);
    assert.ok(profile, `missing profile: ${routeId}`);
    const delivered = new Set(profile.generated_bundle.static_source_ids);
    assert.deepEqual(new Set(profile.source_ids), new Set([
      ...profile.generated_bundle.static_source_ids,
      ...[...transformedComponentSources].filter((sourceId) => profile.source_ids.includes(sourceId)),
    ]), `${routeId}: route sources and bundle delivery diverge`);
    assert.notEqual(profile.generated_bundle.component_selection, "none");
    for (const mode of workflow.modes) {
      if (routeId === "email-new-build" && mode.id !== "new-build") continue;
      if (routeId === "email-continue-fix" && mode.id === "new-build") continue;
      for (const step of mode.steps) {
        for (const sourceId of step.source_ids) {
          assert.ok(profile.source_ids.includes(sourceId), `${routeId}/${mode.id}/${step.id}: ${sourceId} absent from route sources`);
          assert.ok(manifest.sources.some(({ id, path }) => id === sourceId && typeof path === "string"), `${sourceId}: unregistered source`);
          assert.ok(
            delivered.has(sourceId) || transformedComponentSources.has(sourceId),
            `${routeId}/${mode.id}/${step.id}: ${sourceId} is referenced but not delivered`,
          );
        }
      }
    }
  }
});

