import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createEmailVersion, resolveEmailBuildRequest } from "../../scripts/lib/email-build-orchestration.mjs";
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
    { mode: "new-build", blocker: null, allowedOutputs: ["version-folder", "email-html", "images-directory", "verification-summary", "handoff-summary"] },
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