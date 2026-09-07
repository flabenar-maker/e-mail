import test from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

const expectedLegacyProfiles = {
  "library-maintenance": [
    "repository-readme",
    "email-figma-prompt",
    "figma-component-naming-standard",
    "component-descriptions-registry",
    "typography-registry",
    "spacing-foundation",
    "library-maintenance-checkpoint",
  ],
  "component-onboarding": [
    "repository-readme",
    "email-figma-prompt",
    "figma-component-naming-standard",
    "component-descriptions-registry",
    "typography-registry",
    "spacing-foundation",
    "library-maintenance-checkpoint",
  ],
  "figma-description-sync": [
    "repository-readme",
    "email-figma-prompt",
    "component-descriptions-registry",
    "typography-registry",
    "library-maintenance-checkpoint",
  ],
  "figma-naming-audit": [
    "repository-readme",
    "figma-component-naming-standard",
    "component-descriptions-registry",
    "library-maintenance-checkpoint",
  ],
  "migration-progress": [
    "repository-readme",
    "migration-roadmap",
    "library-maintenance-checkpoint",
  ],
  "email-new-build": [
    "repository-readme",
    "email-figma-prompt",
    "figma-component-naming-standard",
    "component-descriptions-registry",
    "typography-registry",
    "email-build-checkpoint",
    "email-project-brief",
  ],
  "email-continue-fix": [
    "repository-readme",
    "email-figma-prompt",
    "figma-component-naming-standard",
    "component-descriptions-registry",
    "typography-registry",
    "email-build-checkpoint",
  ],
};

const expectedRouteProfiles = Object.fromEntries(
  Object.keys(expectedLegacyProfiles).map((id) => [id, id]),
);

async function exists(relativePath) {
  try {
    await access(join(repoRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

test("generated layer remains shadow and preserves every legacy route bundle", async () => {
  const manifest = await readStrictYaml(join(repoRoot, "system/manifest.yaml"));

  assert.deepEqual(
    Object.fromEntries(
      manifest.bundle_profiles.map(({ id, source_ids: sourceIds }) => [
        id,
        sourceIds,
      ]),
    ),
    expectedLegacyProfiles,
  );
  assert.deepEqual(
    Object.fromEntries(
      manifest.routes.map(({ id, bundle_profile_id: profileId }) => [
        id,
        profileId,
      ]),
    ),
    expectedRouteProfiles,
  );

  for (const profile of manifest.bundle_profiles) {
    const shadow = profile.generated_bundle;
    if (!shadow) continue;
    assert.equal(shadow.status, "shadow");
    assert.equal(
      shadow.static_source_ids.includes("component-descriptions-registry"),
      false,
    );
    assert.equal(
      shadow.static_source_ids.includes("typography-registry"),
      false,
    );
  }
});

test("generated layer does not pre-empt workflow migration or ship email output", async () => {
  assert.equal(await exists("docs/generated/workflow-checklists"), false);
  assert.equal(await exists("schemas/workflow.schema.json"), false);
  assert.equal(await exists("email.html"), false);
  assert.equal(await exists("images"), false);
});
