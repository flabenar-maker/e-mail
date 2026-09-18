import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadSystemManifest } from "../../scripts/lib/system-manifest.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
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

async function writeStatusFixture(root, path, mutate) {
  const document = await readStrictYaml(join(root, path));
  mutate(document);
  await writeFixtureFile(root, path, `${JSON.stringify(document, null, 2)}\n`);
}

const activeEmailRequest = (routeId) => ({
  routeId,
  workflowMode: routeId === "email-new-build" ? "new-build" : "continue-fix-design",
  candidates: routeId === "email-new-build" ? [{ id: "banner-hero" }] : [],
  viewports: ["mobile", "desktop"],
});

async function fixtureSnapshot(root, relative = "") {
  const snapshot = [];
  for (const entry of await readdir(
    relative ? join(root, relative) : root,
    { withFileTypes: true },
  )) {
    const path = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) snapshot.push(...await fixtureSnapshot(root, path));
    else snapshot.push([path, (await readFile(join(root, path))).toString("base64")]);
  }
  return snapshot.sort(([left], [right]) => left.localeCompare(right));
}

async function productionOutputSnapshot(root, relative = "") {
  const snapshot = [];
  for (const entry of await readdir(
    relative ? join(root, relative) : root,
    { withFileTypes: true },
  )) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const path = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (entry.name === "images") snapshot.push(["directory", path]);
      snapshot.push(...await productionOutputSnapshot(root, path));
    } else if (entry.name === "email.html" || path.includes("/images/")) {
      snapshot.push(["file", path, (await readFile(join(root, path))).toString("base64")]);
    }
  }
  return snapshot.sort((left, right) => left[1].localeCompare(right[1]));
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

test("canonical email-only cutover resolves email routes and pauses every other route", async () => {
  const manifest = await loadSystemManifest({ repoRoot });
  for (const route of manifest.routes) {
    const email = ["email-new-build", "email-continue-fix"].includes(route.id);
    const profile = manifest.bundle_profiles.find(({ id }) => id === route.bundle_profile_id);
    const bothViewports = ["both", "both-when-components"].includes(profile.generated_bundle.viewport_selection);
    const needsComponent = profile.generated_bundle.component_selection === "required";
    const result = await resolveSkillContext({
      repoRoot,
      routeId: route.id,
      workflowMode: email ? (route.id === "email-new-build" ? "new-build" : "continue-fix-design") : null,
      candidates: email || needsComponent ? [{ id: "banner-hero" }] : [],
      viewports: profile.generated_bundle.viewport_selection === "none" ? [] : bothViewports ? ["mobile", "desktop"] : ["mobile"],
    });
    assert.equal(result.status, email ? "resolved" : "paused", route.id);
    if (email) {
      assert.equal(result.route.workflow_source_id, "workflow-email-build", route.id);
      assert.equal(result.bundle.mode, "structured-active", route.id);
      assert.deepEqual(result.blockers, undefined, route.id);
    } else {
      assert.deepEqual(result.blockers.map(({ code }) => code), ["SKILL_ROUTE_PAUSED"], route.id);
    }
  }
});

test("active email routes refuse every shadow status dependency", async (t) => {
  const cases = [
    ["aggregate", async (root) => { const manifest = await loadSystemManifest({ repoRoot: root }); manifest.structured_workflows.status = "shadow"; await writeManifest(root, manifest); }],
    ["aggregate-active-with-paused-routes", async (root) => { const manifest = await loadSystemManifest({ repoRoot: root }); manifest.structured_workflows.status = "active"; await writeManifest(root, manifest); }],
    ["profile", async (root) => { const manifest = await loadSystemManifest({ repoRoot: root }); for (const profile of manifest.bundle_profiles.filter(({ id }) => id.startsWith("email-"))) profile.generated_bundle.status = "structured-shadow"; await writeManifest(root, manifest); }],
    ["workflow", (root) => writeStatusFixture(root, "data/workflows/email-build.yaml", (document) => { document.workflow.status = "shadow"; })],
    ["components-shared", (root) => writeStatusFixture(root, "data/components/shared.yaml", (document) => { document.registry.status = "shadow"; })],
    ["components-marketing", (root) => writeStatusFixture(root, "data/components/marketing.yaml", (document) => { document.registry.status = "shadow"; })],
    ["components-service", (root) => writeStatusFixture(root, "data/components/service.yaml", (document) => { document.registry.status = "shadow"; })],
    ["typography", (root) => writeStatusFixture(root, "data/foundations/typography.yaml", (document) => { document.foundation.status = "shadow"; })],
    ["spacing", (root) => writeStatusFixture(root, "data/foundations/spacing.yaml", (document) => { document.foundation.status = "shadow"; })],
    ["assets", (root) => writeStatusFixture(root, "data/foundations/assets.yaml", (document) => { document.foundation.status = "shadow"; })],
    ["rendering", (root) => writeStatusFixture(root, "data/foundations/rendering.yaml", (document) => { document.foundation.status = "shadow"; })],
    ["renderer-registry", (root) => writeStatusFixture(root, "data/renderers/registry.yaml", (document) => { document.registry.status = "shadow"; })],
  ];
  await Promise.all(cases.map(async ([dependency, mutate]) => {
    const fixture = await systemFixture(t);
    await mutate(fixture.root);
    const results = await Promise.all(["email-new-build", "email-continue-fix"].map(async (routeId) => [
      routeId,
      await resolveSkillContext({ repoRoot: fixture.root, ...activeEmailRequest(routeId) }),
    ]));
    for (const [routeId, result] of results) {
      assert.notEqual(result.status, "resolved", `${dependency}/${routeId}`);
      assert.deepEqual(result.blockers.map(({ code }) => code), ["SKILL_ROUTE_STATUS_INACTIVE"], `${dependency}/${routeId}`);
    }
  }));
});

test("email workflow resolves every structured mode without changing output artifacts", async (t) => {
  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  replaceWorkflowSource(manifest, "email-new-build", "workflow-email-build");
  replaceWorkflowSource(manifest, "email-continue-fix", "workflow-email-build");
  await writeManifest(fixture.root, manifest);
  const snapshotBeforeResolution = await fixtureSnapshot(fixture.root);

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
        "figma-library-standard",
        "figma-component-description-standard",
        "workflow-library-maintenance",
        "generated-component-registry",
        "generated-typography-registry",
        "generated-asset-registry",
      ]) assert.equal(staticSourceIds.includes(excluded), false, excluded);
    }
  }

  const canonicalOutputBefore = await productionOutputSnapshot(repoRoot);
  assert.deepEqual(
    await productionOutputSnapshot(repoRoot),
    canonicalOutputBefore,
    "canonical resolution must not create or change production email output artifacts",
  );

  assert.deepEqual(
    await fixtureSnapshot(fixture.root),
    snapshotBeforeResolution,
    "resolving the shadow fixture must not create a production email output",
  );
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
