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
  if (!profile.source_ids.includes(sourceId)) profile.source_ids.push(sourceId);
  if (!profile.generated_bundle.static_source_ids.includes(sourceId)) {
    profile.generated_bundle.static_source_ids.push(sourceId);
  }
}

async function activateEmailRoutesExceptTypography(root, manifest) {
  await activateEmailRoutes(root, manifest, { includeTypography: false });
}

async function activateEmailRoutes(root, manifest, { includeTypography = true } = {}) {
  manifest.structured_workflows.status = "partial";
  for (const routeId of ["email-new-build", "email-continue-fix"]) {
    replaceWorkflowSource(manifest, routeId, "workflow-email-build");
    manifest.bundle_profiles.find(({ id }) => id === routeId).generated_bundle.status = "structured-active";
  }
  const dependencies = [
    ["data/workflows/email-build.yaml", "workflow"],
    ["data/components/shared.yaml", "registry"],
    ["data/components/marketing.yaml", "registry"],
    ["data/components/service.yaml", "registry"],
    ["data/foundations/spacing.yaml", "foundation"],
    ["data/foundations/assets.yaml", "foundation"],
    ["data/foundations/rendering.yaml", "foundation"],
    ["data/renderers/registry.yaml", "registry"],
  ];
  if (includeTypography) dependencies.push(["data/foundations/typography.yaml", "foundation"]);
  await Promise.all(dependencies.map(([path, section]) => writeStatusFixture(root, path, (document) => {
    document[section].status = "active";
  })));
}
async function activateAllRoutes(root, manifest) {
  manifest.structured_workflows.status = "active";
  for (const route of manifest.routes) {
    route.workflow_source_id = route.id.startsWith("email-")
      ? "workflow-email-build"
      : "workflow-library-maintenance";
    const profile = manifest.bundle_profiles.find(
      ({ id }) => id === route.bundle_profile_id,
    );
    profile.source_ids = profile.source_ids.filter((id) => id !== "workflow-paused");
    profile.generated_bundle.static_source_ids = profile.generated_bundle.static_source_ids.filter(
      (id) => id !== "workflow-paused",
    );
    if (!profile.source_ids.includes(route.workflow_source_id)) {
      profile.source_ids.push(route.workflow_source_id);
      profile.generated_bundle.static_source_ids.push(route.workflow_source_id);
    }
  }
  for (const profile of manifest.bundle_profiles) {
    profile.generated_bundle.status = "structured-active";
  }
  await activateEmailRoutes(root, manifest);
  manifest.structured_workflows.status = "active";
  await writeStatusFixture(root, "data/workflows/library-maintenance.yaml", (document) => {
    document.workflow.status = "active";
  });
}

test("email routes deliver model assembly material to the workflow steps that consume it", async (t) => {
  const sourceDefinitions = [
    {
      id: "email-model-assembly-standard",
      kind: "core",
      path: "core/email-model-assembly-standard.md",
      stepIds: {
        "email-new-build": ["inspect-design", "resolve-component-contracts", "build-temporary-email-model"],
        "email-continue-fix": ["inspect-design", "resolve-component-contracts", "apply-scoped-html-change"],
      },
    },
    {
      id: "email-model-schema",
      kind: "schema",
      path: "schemas/email-model.schema.json",
      stepIds: {
        "email-new-build": ["build-temporary-email-model"],
        "email-continue-fix": ["apply-scoped-html-change"],
      },
    },
  ];
  const routeRequests = [
    ["email-new-build", "new-build", [{ id: "banner-hero" }], ["mobile", "desktop"]],
    ["email-continue-fix", "continue-fix-design", [], ["mobile", "desktop"]],
  ];

  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  await activateEmailRoutes(fixture.root, manifest);
  await writeManifest(fixture.root, manifest);
  for (const [routeId, workflowMode, candidates, viewports] of routeRequests) {
    const result = await resolveSkillContext({ repoRoot: fixture.root, routeId, workflowMode, candidates, viewports });
    assert.equal(result.status, "resolved", routeId);
    const steps = new Map(result.workflow.steps.map((step) => [step.id, step]));
    for (const source of sourceDefinitions) {
      const delivered = result.bundle.static_sources.filter(({ id }) => id === source.id);
      assert.equal(delivered.length, 1, `${routeId}/${source.id} delivery`);
      assert.equal(delivered[0].kind, source.kind, `${routeId}/${source.id} kind`);
      assert.equal(delivered[0].path, source.path, `${routeId}/${source.id} path`);
      assert.equal(
        delivered[0].content,
        await readFile(join(fixture.root, source.path), "utf8"),
        `${routeId}/${source.id} content`,
      );
      for (const stepId of source.stepIds[routeId]) {
        assert.ok(steps.get(stepId).source_ids.includes(source.id), `${routeId}/${stepId}/${source.id}`);
      }
    }
  }
});

test("technical and read-only email resolution has no Figma input prerequisite", async (t) => {
  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  await activateEmailRoutes(fixture.root, manifest);
  await writeManifest(fixture.root, manifest);
  for (const workflowMode of ["continue-fix-technical", "read-only"]) {
    const result = await resolveSkillContext({
      repoRoot: fixture.root,
      routeId: "email-continue-fix",
      workflowMode,
      candidates: [],
      viewports: [],
    });
    assert.equal(result.status, "resolved", workflowMode);
    assert.equal(
      result.workflow.steps.some((step) => step.required_inputs.some((input) => input.includes("figma"))),
      false,
      `${workflowMode} Figma prerequisite`,
    );
  }
});
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

test("canonical email cutover resolves only email routes", async () => {
  const manifest = await loadSystemManifest({ repoRoot });
  const emailRouteIds = new Set(["email-new-build", "email-continue-fix"]);

  for (const route of manifest.routes) {
    const result = await resolveSkillContext({
      repoRoot,
      ...(emailRouteIds.has(route.id) ? activeEmailRequest(route.id) : { routeId: route.id }),
    });
    if (emailRouteIds.has(route.id)) {
      assert.equal(result.status, "resolved", route.id);
    } else {
      assert.equal(result.status, "paused", route.id);
      assert.deepEqual(result.blockers.map(({ code }) => code), ["SKILL_ROUTE_PAUSED"], route.id);
    }
  }
});

test("explicit email activation still blocks when typography status is absent", async (t) => {
  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  await activateEmailRoutesExceptTypography(fixture.root, manifest);
  await writeManifest(fixture.root, manifest);
  const result = await resolveSkillContext({ repoRoot: fixture.root, ...activeEmailRequest("email-new-build") });
  assert.notEqual(result.status, "resolved");
  assert.ok(result.blockers.some(({ code, path }) => (
    code === "SKILL_ROUTE_STATUS_INACTIVE" &&
    path === "/sources/typography-foundation/status"
  )));
});
test("new-build preserves complete resolved contracts while declaring model handoff evidence", async (t) => {
  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  await activateEmailRoutes(fixture.root, manifest);
  await writeManifest(fixture.root, manifest);
  const result = await resolveSkillContext({
    repoRoot: fixture.root,
    routeId: "email-new-build",
    workflowMode: "new-build",
    candidates: [{ id: "banner-hero" }],
    viewports: ["mobile", "desktop"],
  });

  assert.equal(result.status, "resolved");
  assert.deepEqual(
    result.bundle.components.map(({ id }) => id),
    ["button-primary", "banner-hero"],
  );
  for (const component of result.bundle.components) {
    assert.ok(component.contracts.mobile.root, `${component.id}/mobile contract`);
    assert.ok(component.contracts.desktop.root, `${component.id}/desktop contract`);
  }

  const steps = new Map(result.workflow.steps.map((step) => [step.id, step]));
  const inspect = steps.get("inspect-design");
  const exportAssets = steps.get("export-assets-via-mcp");
  const buildModel = steps.get("build-temporary-email-model");
  const render = steps.get("render-email-cli");

  assert.ok(inspect.allowed_outputs.includes("component-map"));
  assert.ok(inspect.allowed_outputs.includes("instance-inputs"));
  assert.ok(exportAssets.allowed_outputs.includes("images-directory"));
  assert.ok(exportAssets.allowed_outputs.includes("asset-export-evidence"));
  for (const input of [
    "component-map",
    "instance-inputs",
    "resolved-component-contracts",
    "images-directory",
    "asset-export-evidence",
  ]) assert.ok(buildModel.required_inputs.includes(input), `model/${input}`);
  for (const input of [
    "temporary-email-model",
    "component-map",
    "asset-export-evidence",
    "images-directory",
    "version-folder",
  ]) assert.ok(render.required_inputs.includes(input), `render/${input}`);
});

test("design fixes pass instance inputs without requiring conditional asset evidence", async (t) => {
  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  await activateEmailRoutes(fixture.root, manifest);
  await writeManifest(fixture.root, manifest);
  const result = await resolveSkillContext({
    repoRoot: fixture.root,
    routeId: "email-continue-fix",
    workflowMode: "continue-fix-design",
    viewports: ["mobile", "desktop"],
  });

  assert.equal(result.status, "resolved");
  const steps = new Map(result.workflow.steps.map((step) => [step.id, step]));
  const inspect = steps.get("inspect-design");
  const updateAssets = steps.get("update-assets-via-mcp");
  const apply = steps.get("apply-scoped-html-change");

  assert.ok(inspect.allowed_outputs.includes("component-map"));
  assert.ok(inspect.allowed_outputs.includes("instance-inputs"));
  assert.ok(updateAssets.allowed_outputs.includes("asset-export-evidence"));
  assert.ok(updateAssets.condition_id, "asset update stays conditional");
  for (const input of ["component-map", "instance-inputs", "images-directory"]) {
    assert.ok(apply.required_inputs.includes(input), `apply/${input}`);
  }
  assert.equal(
    apply.required_inputs.includes("asset-export-evidence"),
    false,
    "a no-asset design fix must not require conditional export evidence",
  );
});

test("fully active topology rejects a route cross-wired to the email workflow", async (t) => {
  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  await activateAllRoutes(fixture.root, manifest);
  replaceWorkflowSource(manifest, "library-maintenance", "workflow-email-build");
  await writeManifest(fixture.root, manifest);

  const result = await resolveSkillContext({
    repoRoot: fixture.root,
    routeId: "library-maintenance",
    workflowMode: "read-only",
    viewports: ["mobile"],
  });

  assert.equal(result.status, "blocked");
  assert.ok(
    result.blockers.some(({ code }) => code === "structured-workflow-status-topology-invalid"),
  );
});

test("skill resolution cannot bypass incoherent partial email-cutover topology", async (t) => {
  const cases = [
    ["wrong active route set", (manifest) => {
      manifest.routes.find(({ id }) => id === "email-continue-fix").workflow_source_id = "workflow-paused";
    }],
    ["non-email route active during partial", (manifest) => {
      manifest.routes.find(({ id }) => id === "library-maintenance").workflow_source_id = "workflow-library-maintenance";
    }],
    ["email route bound to wrong workflow", (manifest) => {
      manifest.routes.find(({ id }) => id === "email-new-build").workflow_source_id = "workflow-library-maintenance";
    }],
    ["email route profile mismatch", (manifest) => {
      manifest.routes.find(({ id }) => id === "email-new-build").bundle_profile_id = "email-continue-fix";
    }],
    ...["email-new-build", "email-continue-fix"].flatMap((profileId) => [
      [`${profileId} retains paused source`, (manifest) => {
        manifest.bundle_profiles.find(({ id }) => id === profileId).source_ids.push("workflow-paused");
      }],
      [`${profileId} retains paused static source`, (manifest) => {
        manifest.bundle_profiles.find(({ id }) => id === profileId).generated_bundle.static_source_ids.push("workflow-paused");
      }],
      [`${profileId} source and static lists differ`, (manifest) => {
        manifest.bundle_profiles.find(({ id }) => id === profileId).generated_bundle.static_source_ids.pop();
      }],
    ]),
    ["active aggregate with partial topology", (manifest) => {
      manifest.structured_workflows.status = "active";
    }],
    ["active aggregate routes everything to email while maintenance stays shadow", (manifest) => {
      manifest.structured_workflows.status = "active";
      for (const route of manifest.routes) route.workflow_source_id = "workflow-email-build";
      for (const profile of manifest.bundle_profiles) {
        profile.generated_bundle.status = "structured-active";
        profile.source_ids = profile.source_ids.filter((id) => id !== "workflow-paused");
        profile.generated_bundle.static_source_ids = profile.generated_bundle.static_source_ids.filter((id) => id !== "workflow-paused");
        if (!profile.source_ids.includes("workflow-email-build")) {
          profile.source_ids.push("workflow-email-build");
          profile.generated_bundle.static_source_ids.push("workflow-email-build");
        }
      }
    }],
    ["active aggregate route/profile/workflow association mismatch", (manifest) => {
      manifest.structured_workflows.status = "active";
      for (const route of manifest.routes) route.workflow_source_id = "workflow-email-build";
      for (const profile of manifest.bundle_profiles) {
        profile.generated_bundle.status = "structured-active";
        profile.source_ids = profile.source_ids.filter((id) => id !== "workflow-paused");
        profile.generated_bundle.static_source_ids = profile.generated_bundle.static_source_ids.filter((id) => id !== "workflow-paused");
        if (!profile.source_ids.includes("workflow-email-build")) {
          profile.source_ids.push("workflow-email-build");
          profile.generated_bundle.static_source_ids.push("workflow-email-build");
        }
      }
      manifest.routes.find(({ id }) => id === "email-new-build").workflow_source_id = "workflow-library-maintenance";
    }],
  ];

  for (const [name, mutate] of cases) {
    const fixture = await systemFixture(t);
    const manifest = await loadSystemManifest({ repoRoot: fixture.root });
    await activateEmailRoutes(fixture.root, manifest);
    mutate(manifest);
    await writeManifest(fixture.root, manifest);
    for (const routeId of ["email-new-build", "email-continue-fix"]) {
      const result = await resolveSkillContext({
        repoRoot: fixture.root,
        ...activeEmailRequest(routeId),
      });
      assert.equal(result.status, "blocked", `${name}/${routeId}`);
      assert.ok(
        result.blockers.some(({ code }) => code === "structured-workflow-status-topology-invalid"),
        `${name}/${routeId}`,
      );
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
    const manifest = await loadSystemManifest({ repoRoot: fixture.root });
    await activateEmailRoutes(fixture.root, manifest);
    await writeManifest(fixture.root, manifest);
    await mutate(fixture.root);
    const results = await Promise.all(["email-new-build", "email-continue-fix"].map(async (routeId) => [
      routeId,
      await resolveSkillContext({ repoRoot: fixture.root, ...activeEmailRequest(routeId) }),
    ]));
    for (const [routeId, result] of results) {
      assert.notEqual(result.status, "resolved", `${dependency}/${routeId}`);
      assert.ok(result.blockers.every(({ code }) => typeof code === "string" && code.length > 0), `${dependency}/${routeId}`);
    }
  }));
});

test("email workflow resolves every structured mode without changing output artifacts", async (t) => {
  const fixture = await systemFixture(t);
  const manifest = await loadSystemManifest({ repoRoot: fixture.root });
  await activateEmailRoutes(fixture.root, manifest);
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
      for (const required of ["workflow-email-build", "figma-library-standard", "rendering-foundation", "renderer-registry"]) {
        assert.equal(staticSourceIds.includes(required), true, required);
      }
      for (const excluded of [
        "workflow-paused",
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
  await activateAllRoutes(fixture.root, manifest);
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
    true,
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
  await activateAllRoutes(fixture.root, manifest);
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
  await activateAllRoutes(fixture.root, manifest);
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
    "structured-workflow-status-topology-invalid",
  ]);
});

