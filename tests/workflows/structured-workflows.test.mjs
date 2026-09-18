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

test("manifest declares a partial email-only structured workflow cutover", async () => {
  const manifest = await loadSystemManifest({ repoRoot });

  assert.equal(manifest.schema_version, "1.2.0");
  assert.deepEqual(manifest.structured_workflows, {
    status: "partial",
    schema_source_id: "workflows-schema",
    entries: [
      {
        id: "library-maintenance",
        source_id: "workflow-library-maintenance",
      },
      { id: "email-build", source_id: "workflow-email-build" },
    ],
  });
  const emailRoutes = manifest.routes.filter(({ id }) => id.startsWith("email-"));
  assert.deepEqual(emailRoutes.map(({ id }) => id), ["email-new-build", "email-continue-fix"]);
  assert.equal(emailRoutes.every(({ workflow_source_id }) => workflow_source_id === "workflow-email-build"), true);
  assert.equal(manifest.routes.filter(({ id }) => !id.startsWith("email-")).every(({ workflow_source_id }) => workflow_source_id === "workflow-paused"), true);
  for (const profile of manifest.bundle_profiles.filter(({ id }) => id.startsWith("email-"))) {
    assert.equal(profile.generated_bundle.status, "structured-active");
    assert.deepEqual(profile.generated_bundle.static_source_ids, profile.source_ids);
    assert.equal(profile.source_ids.includes("workflow-paused"), false);
    assert.equal(profile.source_ids.includes("workflow-email-build"), false);
  }
});

test("loads exact maintenance and email workflow registries", async () => {
  const maintenance = await canonicalWorkflow("library-maintenance");
  const email = await canonicalWorkflow("email-build");

  assert.equal(maintenance.schema_version, "1.0.0");
  assert.equal(maintenance.workflow.id, "library-maintenance");
  assert.equal(maintenance.workflow.status, "shadow");
  assert.equal(email.workflow.status, "active");
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
test("email workflow declares mode-specific orchestration boundaries", async () => {
  const email = await canonicalWorkflow("email-build");
  const modes = new Map(email.workflow.modes.map((mode) => [mode.id, mode]));
  const newBuild = modes.get("new-build");
  const designFix = modes.get("continue-fix-design");
  const technicalFix = modes.get("continue-fix-technical");
  const clarify = modes.get("clarify");
  const createVersion = newBuild.steps.find(
    (step) => step.id === "create-version-folder",
  );

  assert.ok(newBuild.required_inputs.includes("email-purpose"));
  assert.ok(createVersion.required_inputs.includes("email-purpose"));
  assert.deepEqual(
    newBuild.steps[0].blockers,
    ["request-missing", "figma-source-missing", "viewport-role-ambiguous", "email-instances-mismatch"],
  );
  assert.ok(designFix.required_inputs.includes("exact-change-scope"));
  assert.equal(technicalFix.required_inputs.includes("mobile-figma-instance"), false);
  assert.equal(technicalFix.required_inputs.includes("desktop-figma-instance"), false);
  assert.deepEqual(clarify.allowed_outputs, ["audit-findings", "clarification-request"]);
});
test("workflow semantics reject incomplete orchestration metadata", async () => {
  const workflow = structuredClone(await canonicalWorkflow("email-build"));
  const manifest = await loadSystemManifest({ repoRoot });
  const mode = workflow.workflow.modes.find(({ id }) => id === "new-build");
  const relation = mode.input_relations[0];

  mode.input_blockers = mode.input_blockers.filter(
    ({ input }) => input !== "request",
  );
  assert.ok(
    validateWorkflowRegistrySemantics(workflow, manifest).some(
      ({ code }) => code === "WORKFLOW_INPUT_BLOCKER_MISSING",
    ),
  );

  mode.input_blockers.push({ input: "email-purpose", blocker: "version-folder-exists" });
  assert.ok(
    validateWorkflowRegistrySemantics(workflow, manifest).some(
      ({ code }) => code === "WORKFLOW_INPUT_BLOCKER_DUPLICATE",
    ),
  );

  mode.input_blockers.push({ input: "unknown-input", blocker: "version-path-unsafe" });
  relation.inputs[0] = "unknown-input";
  relation.values.pop();
  relation.blocker = "unknown-blocker";
  const codes = new Set(
    validateWorkflowRegistrySemantics(workflow, manifest).map(({ code }) => code),
  );
  assert.ok(codes.has("WORKFLOW_INPUT_BLOCKER_INPUT_UNREQUIRED"));
  assert.ok(codes.has("WORKFLOW_INPUT_RELATION_INPUT_UNREQUIRED"));
  assert.ok(codes.has("WORKFLOW_INPUT_RELATION_VALUES_LENGTH"));
  assert.ok(codes.has("WORKFLOW_INPUT_RELATION_BLOCKER_UNDECLARED"));
});
