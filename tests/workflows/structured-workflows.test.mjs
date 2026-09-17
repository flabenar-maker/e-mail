import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildContextBundle } from "../../scripts/lib/context-bundle.mjs";
import { loadSystemManifest } from "../../scripts/lib/system-manifest.mjs";
import {
  loadWorkflowRegistry,
  resolveWorkflowSteps,
  validateWorkflowRegistrySemantics,
  validateWorkflowRegistryShape,
} from "../../scripts/lib/workflow-registry.mjs";
import {
  canonicalSystemFixtureFiles,
  copyFixtureFile,
  createSystemFixture,
  writeFixtureFile,
} from "../helpers/system-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function canonicalWorkflow(workflowId) {
  return loadWorkflowRegistry({ repoRoot, workflowId });
}

test("manifest declares structured workflows without switching paused routes", async () => {
  const manifest = await loadSystemManifest({ repoRoot });

  assert.equal(manifest.schema_version, "1.2.0");
  assert.deepEqual(manifest.structured_workflows, {
    status: "shadow",
    schema_source_id: "workflows-schema",
    entries: [
      {
        id: "library-maintenance",
        source_id: "workflow-library-maintenance",
      },
      { id: "email-build", source_id: "workflow-email-build" },
    ],
  });
  assert.equal(
    manifest.routes.every(
      ({ workflow_source_id }) => workflow_source_id === "workflow-paused",
    ),
    true,
  );
  assert.equal(
    manifest.bundle_profiles.every(
      ({ generated_bundle }) =>
        generated_bundle.status === "structured-shadow" &&
        generated_bundle.static_source_ids.includes("workflow-paused") &&
        !generated_bundle.static_source_ids.some((id) =>
          id.startsWith("workflow-library-") || id === "workflow-email-build",
        ),
    ),
    true,
  );
});

test("loads exact maintenance and email workflow registries", async () => {
  const maintenance = await canonicalWorkflow("library-maintenance");
  const email = await canonicalWorkflow("email-build");

  assert.equal(maintenance.schema_version, "1.0.0");
  assert.equal(maintenance.workflow.id, "library-maintenance");
  assert.equal(maintenance.workflow.status, "shadow");
  assert.deepEqual(
    maintenance.workflow.modes.map(({ id }) => id),
    ["read-only", "write"],
  );
  assert.deepEqual(
    email.workflow.modes.map(({ id }) => id),
    [
      "new-build",
      "continue-fix-design",
      "continue-fix-technical",
      "read-only",
      "clarify",
    ],
  );

  for (const registry of [maintenance, email]) {
    assert.doesNotMatch(JSON.stringify(registry), /legacy/iu);
    for (const mode of registry.workflow.modes) {
      assert.deepEqual(
        mode.steps.map(({ order }) => order),
        Array.from({ length: mode.steps.length }, (_, index) => index + 1),
      );
    }
  }
});

test("resolves detached ordered steps and blocks unknown workflow or mode", async () => {
  const email = await canonicalWorkflow("email-build");
  const steps = resolveWorkflowSteps(email, "new-build");

  assert.equal(steps[0].id, "validate-specific-email-sources");
  assert.equal(steps.at(-1).id, "handoff");
  assert.equal(Object.isFrozen(steps), true);
  assert.equal(Object.isFrozen(steps[0]), true);
  assert.throws(
    () => resolveWorkflowSteps(email, "missing-mode"),
    (error) => error.code === "WORKFLOW_MODE_UNKNOWN",
  );
  await assert.rejects(
    canonicalWorkflow("missing-workflow"),
    (error) => error.code === "WORKFLOW_UNKNOWN",
  );
});

test("workflow schema and semantics reject unknown fields and unordered steps", async () => {
  const workflow = structuredClone(await canonicalWorkflow("email-build"));
  const manifest = await loadSystemManifest({ repoRoot });
  const schema = JSON.parse(
    await readFile(join(repoRoot, "schemas/workflows.schema.json"), "utf8"),
  );

  workflow.workflow.unexpected = true;
  assert.ok(
    validateWorkflowRegistryShape(workflow, schema).some(
      ({ code }) => code === "workflow-registry-schema",
    ),
  );
  delete workflow.workflow.unexpected;
  workflow.workflow.modes[0].steps[1].order = 9;
  assert.ok(
    validateWorkflowRegistrySemantics(workflow, manifest).some(
      ({ code }) => code === "WORKFLOW_STEP_ORDER_INVALID",
    ),
  );
});

test("context bundles use structured-shadow and block archived source paths", async (t) => {
  const canonical = await buildContextBundle({
    repoRoot,
    routeId: "migration-progress",
  });
  assert.equal(canonical.status, "resolved");
  assert.equal(canonical.bundle.mode, "structured-shadow");

  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);
  for (const path of canonicalSystemFixtureFiles) {
    await copyFixtureFile(repoRoot, fixture.root, path);
  }
  await copyFixtureFile(
    repoRoot,
    fixture.root,
    "Legacy/workflows/email-build-checkpoint.md",
  );
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  manifest.sources.push({
    id: "archived-workflow-test",
    kind: "workflow",
    path: "Legacy/workflows/email-build-checkpoint.md",
  });
  const profile = manifest.bundle_profiles.find(
    ({ id }) => id === "migration-progress",
  );
  profile.source_ids.push("archived-workflow-test");
  profile.generated_bundle.static_source_ids.push("archived-workflow-test");
  await writeFixtureFile(
    fixture.root,
    "system/manifest.yaml",
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const result = await buildContextBundle({
    repoRoot: fixture.root,
    routeId: "migration-progress",
  });
  assert.equal(result.status, "blocked");
  assert.deepEqual(result.blockers.map(({ code }) => code), [
    "CONTEXT_BUNDLE_ARCHIVED_SOURCE_FORBIDDEN",
  ]);
});
