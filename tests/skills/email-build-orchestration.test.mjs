import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createEmailVersion, executeEmailBuildHandoff, resolveEmailBuildRequest } from "../../scripts/lib/email-build-orchestration.mjs";
import { resolveSkillContext } from "../../scripts/lib/skill-context.mjs";
import { loadWorkflowRegistry } from "../../scripts/lib/workflow-registry.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function workflow() {
  return loadWorkflowRegistry({ repoRoot, workflowId: "email-build" });
}

function input(value = true) {
  return value;
}

async function directoryHash(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const digests = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) digests.push(`${entry.name}/${await directoryHash(path)}`);
    else digests.push(`${entry.name}:${createHash("sha256").update(await readFile(path)).digest("hex")}`);
  }
  return createHash("sha256").update(digests.join("\n")).digest("hex");
}

test("resolved workflow classifies typed inputs and only exposes that mode's outputs", async () => {
  const emailWorkflow = await workflow();
  const base = { request: input(), "email-purpose": "Billing renewal notice", "output-parent": input() };

  assert.deepEqual(
    resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: { "email-purpose": "Billing renewal notice", "output-parent": input(), "mobile-figma-instance": { role: "mobile", emailId: "a" }, "desktop-figma-instance": { role: "desktop", emailId: "a" } } }),
    { mode: "new-build", blocker: "request-missing", allowedOutputs: [] },
  );  assert.deepEqual(
    resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: { ...base, "mobile-figma-instance": { role: "mobile", emailId: "a" } } }),
    { mode: "new-build", blocker: "figma-source-missing", allowedOutputs: [] },
  );
  assert.deepEqual(
    resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: { ...base, "mobile-figma-instance": { role: "desktop", emailId: "a" }, "desktop-figma-instance": { role: "mobile", emailId: "a" } } }),
    { mode: "new-build", blocker: "viewport-role-ambiguous", allowedOutputs: [] },
  );
  assert.deepEqual(
    resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: { ...base, "mobile-figma-instance": { role: "mobile", emailId: "a" }, "desktop-figma-instance": { role: "desktop", emailId: "b" } } }),
    { mode: "new-build", blocker: "email-instances-mismatch", allowedOutputs: [] },
  );
  assert.deepEqual(
    resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: { ...base, "mobile-figma-instance": { role: "mobile", emailId: "a" }, "desktop-figma-instance": { role: "desktop", emailId: "a" } } }),
    { mode: "new-build", blocker: null, allowedOutputs: ["version-folder", "email-html", "images-directory", "source-comparison", "verification-summary", "handoff-summary"] },
  );
  assert.deepEqual(
    resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: { request: input(), "source-email-html": input(), "source-images-directory": input(), "mobile-figma-instance": input(), "desktop-figma-instance": input() } }),
    { mode: "continue-fix-design", blocker: "change-scope-ambiguous", allowedOutputs: [] },
  );
  assert.deepEqual(
    resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: { request: input(), "source-email-html": input(), "source-images-directory": input(), "exact-change-scope": input() } }),
    { mode: "continue-fix-technical", blocker: null, allowedOutputs: ["version-folder", "email-html", "images-directory", "verification-summary", "handoff-summary"] },
  );
  assert.deepEqual(
    resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: { request: input() } }),
    { mode: "clarify", blocker: null, allowedOutputs: ["audit-findings", "clarification-request"] },
  );
  assert.deepEqual(
    resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: { request: input(), "output-parent": input(), "mobile-figma-instance": input(), "desktop-figma-instance": input() } }),
    { mode: "new-build", blocker: "version-path-unsafe", allowedOutputs: [] },
  );
});

test("actual resolver workflow modes gate source proof and design continuation evidence", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "resolver-mode-gate-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const resolve = (routeId, workflowMode) => resolveSkillContext({
    repoRoot,
    routeId,
    workflowMode,
    candidates: routeId === "email-new-build" ? [{ id: "banner-hero" }] : [],
    viewports: routeId === "email-new-build" ? ["mobile", "desktop"] : [],
  });
  const newBuild = await resolve("email-new-build", "new-build");
  const designFix = await resolve("email-continue-fix", "continue-fix-design");
  const technicalFix = await resolve("email-continue-fix", "continue-fix-technical");
  assert.equal(newBuild.workflow.mode, "new-build");
  assert.equal(designFix.workflow.mode, "continue-fix-design");
  assert.equal(technicalFix.workflow.mode, "continue-fix-technical");

  let invocations = 0;
  const handoff = (resolution) => executeEmailBuildHandoff({
    repoRoot,
    assetRoot: root,
    outputDir: join(root, "output"),
    model: { root: { component_id: "unregistered", slots: [] } },
    candidates: [],
    assetEvidence: [],
    resolution,
    rendererRunner: async () => { invocations += 1; },
  });
  const missingSource = await handoff(newBuild);
  assert.ok(missingSource.blockers.includes("source-evidence-missing"));
  const missingDesignEvidence = await handoff(designFix);
  assert.ok(missingDesignEvidence.blockers.includes("figma-source-missing"));
  assert.ok(missingDesignEvidence.blockers.includes("visual-regression"));
  const technical = await handoff(technicalFix);
  assert.equal(technical.blockers.includes("figma-source-missing"), false);
  assert.equal(technical.blockers.includes("visual-regression"), false);
  assert.equal(invocations, 0);
});

test("handoff fails closed without a recognized nested workflow mode", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "invalid-workflow-mode-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const resolution of [{}, { mode: "new-build" }, { workflow: { mode: "unknown" } }]) {
    const result = await executeEmailBuildHandoff({
      repoRoot,
      assetRoot: root,
      outputDir: join(root, "output"),
      model: { root: { component_id: "unregistered", slots: [] } },
      candidates: [],
      assetEvidence: [],
      resolution,
      rendererRunner: async () => { throw new Error("renderer must stay gated"); },
    });
    assert.ok(result.blockers.includes("workflow-mode-invalid"));
  }
});

test("versioning rejects unsafe paths and writes only allowed output artifacts", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "email-build-orchestration-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const emailWorkflow = await workflow();
  const resolved = resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: { request: input(), "email-purpose": "Billing renewal notice", "output-parent": input(), "mobile-figma-instance": { role: "mobile", emailId: "a" }, "desktop-figma-instance": { role: "desktop", emailId: "a" } } });

  await assert.rejects(
    createEmailVersion({ workflow: emailWorkflow, resolution: resolved, workspaceRoot: root, outputParent: join(root, "..", "outside"), purpose: "Billing renewal notice" }),
    (error) => error.code === "version-path-unsafe",
  );
  for (const purpose of ["", "!!!", "Счёт на оплату"]) {
    await assert.rejects(
      createEmailVersion({ workflow: emailWorkflow, resolution: resolved, workspaceRoot: root, outputParent: root, purpose }),
      (error) => error.code === "version-path-unsafe",
    );
  }
  await assert.rejects(
    createEmailVersion({ workflow: emailWorkflow, resolution: resolved, workspaceRoot: root, outputParent: root, purpose: "Billing renewal notice", sourceFolder: "../escape_1.0" }),
    (error) => error.code === "version-path-unsafe",
  );

  const first = await createEmailVersion({ workflow: emailWorkflow, resolution: resolved, workspaceRoot: root, outputParent: root, purpose: "Billing renewal notice" });
  assert.equal(first.folder, "billing-renewal-notice_1.0");
  await writeFile(join(first.target, "email.html"), "<html>source</html>");
  await writeFile(join(first.target, "images", "logo.png"), "image");
  await mkdir(join(root, "billing-renewal-notice_1.2"));
  const before = await directoryHash(first.target);
  const next = await createEmailVersion({ workflow: emailWorkflow, resolution: resolved, workspaceRoot: root, outputParent: root, purpose: "ignored", sourceFolder: first.folder });

  assert.equal(next.folder, "billing-renewal-notice_1.1");
  assert.equal(await directoryHash(first.target), before);
  assert.deepEqual((await readdir(next.target)).sort(), ["email.html", "images"]);
  assert.deepEqual((await readdir(join(next.target, "images"))).sort(), ["logo.png"]);
});
test("versioning continues underscore service folders and rejects unsafe source names", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "service-versioning-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const emailWorkflow = await workflow();
  const resolution = resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: {
    request: input(), "source-email-html": input(), "source-images-directory": input(), "exact-change-scope": input(),
  } });
  const source = join(root, "service_transaction_success_1.6");
  await mkdir(join(source, "images"), { recursive: true });
  await writeFile(join(source, "email.html"), "<html>source</html>");
  await writeFile(join(source, "images", "asset.png"), "asset");
  const before = await directoryHash(source);
  const next = await createEmailVersion({ resolution, workspaceRoot: root, outputParent: root, sourceFolder: "service_transaction_success_1.6" });
  assert.equal(next.folder, "service_transaction_success_1.7");
  assert.equal(await directoryHash(source), before);
  assert.deepEqual((await readdir(next.target)).sort(), ["email.html", "images"]);
  for (const unsafe of ["../service_transaction_success_1.6", "C:/service_transaction_success_1.6", "service_transaction_success_1.6/escape", "service_transaction_success_1.x"]) {
    await assert.rejects(createEmailVersion({ resolution, workspaceRoot: root, outputParent: root, sourceFolder: unsafe }), (error) => error.code === "version-path-unsafe");
  }
});
test("versioning rejects junction source and output-parent escapes", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "junction-versioning-"));
  const outside = await mkdtemp(join(tmpdir(), "junction-outside-"));
  t.after(() => Promise.all([rm(root, { recursive: true, force: true }), rm(outside, { recursive: true, force: true })]));
  const emailWorkflow = await workflow();
  const resolution = resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: {
    request: input(), "source-email-html": input(), "source-images-directory": input(), "exact-change-scope": input(),
  } });
  await mkdir(join(outside, "images"));
  await writeFile(join(outside, "email.html"), "outside");
  try {
    await symlink(outside, join(root, "service_transaction_success_1.6"), "junction");
  } catch (error) {
    if (["EPERM", "ENOTSUP"].includes(error.code)) return t.skip(`junction unavailable: ${error.code}`);
    throw error;
  }
  const parentLink = join(root, "output-parent");
  try {
    await symlink(outside, parentLink, "junction");
  } catch (error) {
    if (["EPERM", "ENOTSUP"].includes(error.code)) return t.skip(`junction unavailable: ${error.code}`);
    throw error;
  }
  const results = await Promise.allSettled([
    createEmailVersion({ resolution, workspaceRoot: root, outputParent: root, sourceFolder: "service_transaction_success_1.6" }),
    createEmailVersion({ resolution, workspaceRoot: root, outputParent: parentLink, purpose: "safe purpose" }),
  ]);
  for (const result of results) {
    assert.equal(result.status, "rejected");
    assert.equal(result.reason.code, "version-path-unsafe");
  }
});
test("versioning rejects linked image descendants before target creation", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "linked-image-versioning-"));
  const outside = await mkdtemp(join(tmpdir(), "linked-image-outside-"));
  t.after(() => Promise.all([rm(root, { recursive: true, force: true }), rm(outside, { recursive: true, force: true })]));
  const emailWorkflow = await workflow();
  const resolution = resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: {
    request: input(), "source-email-html": input(), "source-images-directory": input(), "exact-change-scope": input(),
  } });
  const sourceFolder = "service_transaction_success_1.6";
  const source = join(root, sourceFolder);
  await mkdir(join(source, "images"), { recursive: true });
  await writeFile(join(source, "email.html"), "<html>source</html>");
  const outsideImage = join(outside, "outside.png");
  await writeFile(outsideImage, "outside");
  try {
    await symlink(outsideImage, join(source, "images", "linked.png"), "file");
  } catch (error) {
    if (["EPERM", "ENOTSUP"].includes(error.code)) return t.skip(`file symlink unavailable: ${error.code}`);
    throw error;
  }

  await assert.rejects(
    createEmailVersion({ resolution, workspaceRoot: root, outputParent: root, sourceFolder }),
    (error) => error.code === "version-path-unsafe",
  );
  assert.deepEqual(await readdir(root), [sourceFolder]);
});
test("versioning rejects linked root email and images entries", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "linked-root-versioning-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const emailWorkflow = await workflow();
  const resolution = resolveEmailBuildRequest({ workflow: emailWorkflow, inputs: {
    request: input(), "source-email-html": input(), "source-images-directory": input(), "exact-change-scope": input(),
  } });

  const linkedImages = join(root, "service_transaction_success_1.6");
  await mkdir(join(linkedImages, "actual-images"), { recursive: true });
  await writeFile(join(linkedImages, "email.html"), "<html>source</html>");
  try {
    await symlink(join(linkedImages, "actual-images"), join(linkedImages, "images"), "junction");
  } catch (error) {
    if (["EPERM", "ENOTSUP"].includes(error.code)) return t.skip(`junction unavailable: ${error.code}`);
    throw error;
  }
  await assert.rejects(
    createEmailVersion({ resolution, workspaceRoot: root, outputParent: root, sourceFolder: "service_transaction_success_1.6" }),
    (error) => error.code === "version-path-unsafe",
  );

  const linkedEmail = join(root, "service_transaction_success_1.7");
  await mkdir(join(linkedEmail, "images"), { recursive: true });
  await writeFile(join(linkedEmail, "actual.html"), "<html>source</html>");
  try {
    await symlink(join(linkedEmail, "actual.html"), join(linkedEmail, "email.html"), "file");
  } catch (error) {
    if (["EPERM", "ENOTSUP"].includes(error.code)) return t.skip(`file symlink unavailable: ${error.code}`);
    throw error;
  }
  await assert.rejects(
    createEmailVersion({ resolution, workspaceRoot: root, outputParent: root, sourceFolder: "service_transaction_success_1.7" }),
    (error) => error.code === "version-path-unsafe",
  );
});
