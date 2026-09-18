import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadSystemManifest } from "../../scripts/lib/system-manifest.mjs";
import { resolveSkillContext } from "../../scripts/lib/skill-context.mjs";
import { loadWorkflowRegistry, resolveWorkflowSteps } from "../../scripts/lib/workflow-registry.mjs";
import {
  canonicalSystemFixtureFiles,
  copyFixtureFile,
  createSystemFixture,
  writeFixtureFile,
} from "../helpers/system-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function systemFixture(t) {
  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);
  for (const path of canonicalSystemFixtureFiles) {
    await copyFixtureFile(repoRoot, fixture.root, path);
  }
  return fixture;
}

async function writeManifest(root, manifest) {
  await writeFixtureFile(
    root,
    "system/manifest.yaml",
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}

function replaceWorkflowSource(manifest, routeId, sourceId) {
  const route = manifest.routes.find(({ id }) => id === routeId);
  const profile = manifest.bundle_profiles.find(
    ({ id }) => id === route.bundle_profile_id,
  );
  route.workflow_source_id = sourceId;
  profile.source_ids = profile.source_ids.filter(
    (id) => id !== "workflow-paused",
  );
  profile.generated_bundle.static_source_ids =
    profile.generated_bundle.static_source_ids.filter(
      (id) => id !== "workflow-paused",
    );
}

test("canonical maintenance routes resolve one paused shadow context", async () => {
  const result = await resolveSkillContext({
    repoRoot,
    routeId: "migration-progress",
  });

  assert.equal(result.status, "paused");
  assert.equal(result.route.id, "migration-progress");
  assert.equal(result.bundle.mode, "structured-shadow");
  assert.equal(result.workflow, undefined);
  assert.deepEqual(result.blockers.map(({ code }) => code), [
    "SKILL_ROUTE_PAUSED",
  ]);
});

test("temporary email shadow fixture resolves every structured mode without activating canonical routes", async (t) => {
  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  replaceWorkflowSource(manifest, "email-new-build", "workflow-email-build");
  replaceWorkflowSource(manifest, "email-continue-fix", "workflow-email-build");
  await writeManifest(fixture.root, manifest);

  const owner = await loadWorkflowRegistry({ repoRoot: fixture.root, workflowId: "email-build" });
  const modes = ["new-build", "continue-fix-design", "continue-fix-technical", "read-only", "clarify"];
  for (const mode of modes) {
    const result = await resolveSkillContext({
      repoRoot: fixture.root,
      routeId: mode === "new-build" ? "email-new-build" : "email-continue-fix",
      workflowMode: mode,
      candidates: mode === "new-build" ? [{ id: "banner-hero" }] : [],
      viewports: mode === "new-build" ? ["mobile", "desktop"] : [],
    });

    assert.equal(result.status, "resolved", mode);
    assert.deepEqual(result.workflow.steps, resolveWorkflowSteps(owner, mode), mode);
    assert.deepEqual(
      result.workflow.steps.map(({ order }) => order),
      result.workflow.steps.map((_, index) => index + 1),
      mode,
    );
    for (const step of result.workflow.steps) {
      assert.ok(Array.isArray(step.required_inputs), `${mode}/${step.id} inputs`);
      assert.ok(Array.isArray(step.blockers), `${mode}/${step.id} blockers`);
      assert.ok(Array.isArray(step.allowed_outputs), `${mode}/${step.id} outputs`);
      assert.ok(["next", "complete"].includes(step.handoff.on_success), `${mode}/${step.id} handoff`);
      assert.ok(["request-input", "stop"].includes(step.handoff.on_blocked), `${mode}/${step.id} blocked handoff`);
    }

    if (mode === "new-build") {
      assert.deepEqual(result.bundle.components.map(({ id }) => id), ["button-primary", "banner-hero"]);
      assert.deepEqual(
        [...new Set(result.bundle.foundation_definitions.map(({ foundation_id }) => foundation_id))],
        ["assets"],
      );
      const staticSourceIds = result.bundle.static_sources.map(({ id }) => id);
      for (const excluded of [
        "workflow-paused",
        "workflow-email-build",
        "figma-component-description-standard",
        "workflow-library-maintenance",
        "generated-component-registry",
        "generated-typography-registry",
        "generated-asset-registry",
      ]) assert.equal(staticSourceIds.includes(excluded), false, excluded);
    }
  }

  for (const routeId of ["email-new-build", "email-continue-fix"]) {
    const canonical = await resolveSkillContext({
      repoRoot,
      routeId,
      candidates: routeId === "email-new-build" ? [{ id: "banner-hero" }] : [],
      viewports: routeId === "email-new-build" ? ["mobile", "desktop"] : [],
    });
    assert.equal(canonical.status, "paused", routeId);
    assert.deepEqual(canonical.blockers.map(({ code }) => code), ["SKILL_ROUTE_PAUSED"]);
  }
});

test("an explicitly active maintenance route resolves exact ordered steps", async (t) => {
  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  replaceWorkflowSource(
    manifest,
    "library-maintenance",
    "workflow-library-maintenance",
  );
  await writeManifest(fixture.root, manifest);

  const result = await resolveSkillContext({
    repoRoot: fixture.root,
    routeId: "library-maintenance",
    workflowMode: "read-only",
    viewports: ["mobile"],
  });

  assert.equal(result.status, "resolved");
  assert.equal(
    result.bundle.static_sources.some(({ kind }) => kind === "workflow"),
    false,
  );
  assert.deepEqual(
    result.workflow.steps.map(({ id }) => id),
    [
      "pin-canonical-state",
      "assess-impact",
      "inspect-canonical-sources",
      "inspect-figma-read-only",
      "verify-read-only-findings",
    ],
  );
  assert.equal(Object.isFrozen(result.workflow.steps), true);
  assert.equal(Object.isFrozen(result.workflow.steps[0]), true);
});

test("unknown route returns the context-bundle blocker", async () => {
  const result = await resolveSkillContext({
    repoRoot,
    routeId: "missing-route",
  });

  assert.equal(result.status, "blocked");
  assert.deepEqual(result.blockers.map(({ code }) => code), [
    "CONTEXT_BUNDLE_ROUTE_UNKNOWN",
  ]);
});

test("active route requires an exact workflow mode", async (t) => {
  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  replaceWorkflowSource(
    manifest,
    "library-maintenance",
    "workflow-library-maintenance",
  );
  await writeManifest(fixture.root, manifest);

  const missing = await resolveSkillContext({
    repoRoot: fixture.root,
    routeId: "library-maintenance",
    viewports: ["mobile"],
  });
  const unknown = await resolveSkillContext({
    repoRoot: fixture.root,
    routeId: "library-maintenance",
    workflowMode: "missing-mode",
    viewports: ["mobile"],
  });

  assert.deepEqual(missing.blockers.map(({ code }) => code), [
    "SKILL_WORKFLOW_MODE_REQUIRED",
  ]);
  assert.deepEqual(unknown.blockers.map(({ code }) => code), [
    "WORKFLOW_MODE_UNKNOWN",
  ]);
});

test("active route blocks a workflow source absent from structured capability", async (t) => {
  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  await writeFixtureFile(
    fixture.root,
    "workflows/unstructured.md",
    "# Unstructured workflow\n",
  );
  manifest.sources.push({
    id: "workflow-unstructured",
    kind: "workflow",
    path: "workflows/unstructured.md",
  });
  replaceWorkflowSource(
    manifest,
    "library-maintenance",
    "workflow-unstructured",
  );
  await writeManifest(fixture.root, manifest);

  const result = await resolveSkillContext({
    repoRoot: fixture.root,
    routeId: "library-maintenance",
    workflowMode: "read-only",
    viewports: ["mobile"],
  });

  assert.equal(result.status, "blocked");
  assert.deepEqual(result.blockers.map(({ code }) => code), [
    "SKILL_WORKFLOW_UNSTRUCTURED",
  ]);
});
