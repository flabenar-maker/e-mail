import test from "node:test";
import assert from "node:assert/strict";
import { cp, mkdtemp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function emailWorkflow() {
  return JSON.parse(
    await readFile(join(repoRoot, "data/workflows/email-build.yaml"), "utf8"),
  );
}

function modeById(workflow, id) {
  return workflow.workflow.modes.find((mode) => mode.id === id);
}

function stepById(mode, id) {
  return mode.steps.find((step) => step.id === id);
}

function classify(workflow, request) {
  if (request.type === "new-build") {
    const mode = modeById(workflow, "new-build");
    const validate = stepById(mode, "validate-specific-email-sources");
    if (!request.mobile || !request.desktop) {
      return { mode: mode.id, blocker: validate.blockers.find((id) => id === "figma-source-missing") };
    }
    if (request.mobile.role !== "mobile" || request.desktop.role !== "desktop") {
      return { mode: mode.id, blocker: validate.blockers.find((id) => id === "viewport-role-ambiguous") };
    }
    if (request.mobile.emailId !== request.desktop.emailId) {
      return { mode: mode.id, blocker: validate.blockers.find((id) => id === "email-instances-mismatch") };
    }
    return { mode: mode.id, blocker: null };
  }
  if (request.type === "design-fix") {
    const mode = modeById(workflow, "continue-fix-design");
    const inspect = stepById(mode, "inspect-source-email");
    return {
      mode: mode.id,
      blocker: request.exactChangeScope ? null : inspect.blockers.find((id) => id === "change-scope-ambiguous"),
    };
  }
  if (request.type === "technical-fix") return { mode: modeById(workflow, "continue-fix-technical").id, blocker: null };
  return { mode: modeById(workflow, "clarify").id, blocker: null, createdPaths: [] };
}

function semanticName(purpose) {
  return purpose.toLowerCase().trim().replaceAll(/[^a-z0-9]+/gu, "-").replaceAll(/^-|-$/gu, "");
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

async function createSiblingVersion({ outputParent, purpose, sourceFolder }) {
  const base = sourceFolder ? sourceFolder.replace(/_[0-9]+\.[0-9]+$/u, "") : semanticName(purpose);
  const entries = new Set(await readdir(outputParent));
  let minor = 0;
  let folder = `${base}_1.${minor}`;
  while (entries.has(folder)) folder = `${base}_1.${++minor}`;
  const target = join(outputParent, folder);
  await mkdir(target);
  if (sourceFolder) {
    await cp(join(outputParent, sourceFolder, "email.html"), join(target, "email.html"));
    await cp(join(outputParent, sourceFolder, "images"), join(target, "images"), { recursive: true });
  } else {
    await writeFile(join(target, "email.html"), "");
    await mkdir(join(target, "images"));
  }
  return { folder, target };
}

test("new build requires a typed email purpose before creating its version folder", async () => {
  const workflow = await emailWorkflow();
  const mode = modeById(workflow, "new-build");
  const createVersionFolder = stepById(mode, "create-version-folder");

  assert.ok(mode.required_inputs.includes("email-purpose"));
  assert.ok(createVersionFolder.required_inputs.includes("email-purpose"));
});

test("classification uses each mode's typed inputs, blockers, and allowed outputs", async () => {
  const workflow = await emailWorkflow();
  const newBuild = modeById(workflow, "new-build");
  const designFix = modeById(workflow, "continue-fix-design");
  const technicalFix = modeById(workflow, "continue-fix-technical");
  const clarify = modeById(workflow, "clarify");

  assert.deepEqual(classify(workflow, { type: "new-build", desktop: { role: "desktop", emailId: "a" } }), { mode: "new-build", blocker: "figma-source-missing" });
  assert.deepEqual(classify(workflow, { type: "new-build", mobile: { role: "desktop", emailId: "a" }, desktop: { role: "mobile", emailId: "a" } }), { mode: "new-build", blocker: "viewport-role-ambiguous" });
  assert.deepEqual(classify(workflow, { type: "new-build", mobile: { role: "mobile", emailId: "a" }, desktop: { role: "desktop", emailId: "b" } }), { mode: "new-build", blocker: "email-instances-mismatch" });
  assert.deepEqual(classify(workflow, { type: "design-fix", exactChangeScope: false }), { mode: "continue-fix-design", blocker: "change-scope-ambiguous" });
  assert.deepEqual(classify(workflow, { type: "technical-fix" }), { mode: "continue-fix-technical", blocker: null });
  assert.deepEqual(classify(workflow, { type: "indeterminate" }), { mode: "clarify", blocker: null, createdPaths: [] });

  assert.ok(newBuild.required_inputs.includes("mobile-figma-instance"));
  assert.ok(newBuild.required_inputs.includes("desktop-figma-instance"));
  assert.ok(designFix.required_inputs.includes("exact-change-scope"));
  assert.equal(technicalFix.required_inputs.includes("mobile-figma-instance"), false);
  assert.equal(technicalFix.required_inputs.includes("desktop-figma-instance"), false);
  assert.deepEqual(new Set(newBuild.allowed_outputs).has("version-folder"), true);
  assert.equal(clarify.allowed_outputs.includes("version-folder"), false);
  assert.equal(clarify.allowed_outputs.includes("email-html"), false);
  assert.equal(clarify.allowed_outputs.includes("images-directory"), false);
});

test("versioned output derives a semantic name, preserves source bytes, and contains only email artifacts", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "email-build-orchestration-"));
  t.after(() => rm(root, { recursive: true, force: true }));

  const first = await createSiblingVersion({ outputParent: root, purpose: "Billing renewal notice" });
  assert.equal(first.folder, "billing-renewal-notice_1.0");
  await writeFile(join(first.target, "email.html"), "<html>source</html>");
  await writeFile(join(first.target, "images", "logo.png"), "image");
  const before = await directoryHash(first.target);

  const next = await createSiblingVersion({ outputParent: root, sourceFolder: first.folder });
  assert.equal(next.folder, "billing-renewal-notice_1.1");
  assert.equal(await directoryHash(first.target), before);
  assert.deepEqual((await readdir(next.target)).sort(), ["email.html", "images"]);
  assert.deepEqual((await readdir(join(next.target, "images"))).sort(), ["logo.png"]);
});