import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import {
  createEmailVersion,
  prepareEmailBuildHandoff,
  resolveEmailBuildRequest,
} from "../../scripts/lib/email-build-orchestration.mjs";
import { loadWorkflowRegistry } from "../../scripts/lib/workflow-registry.mjs";

const execFileAsync = promisify(execFile);
const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const pilotPath = join(repoRoot, "tests", "fixtures", "rendering", "pilot-email.json");

function instances(instance, output = []) {
  output.push(instance);
  for (const slot of instance.slots ?? []) for (const child of slot.instances) instances(child, output);
  for (const nested of instance.nested_components ?? []) instances(nested.instance, output);
  return output;
}

async function fixture(root) {
  const model = JSON.parse(await readFile(pilotPath, "utf8"));
  const all = instances(model.root);
  for (const instance of all) {
    for (const asset of instance.asset_files ?? []) {
      const source = join(root, ...asset.path.split("/"));
      await mkdir(dirname(source), { recursive: true });
      await writeFile(source, `mcp-export:${asset.path}`, "utf8");
    }
  }
  return {
    model,
    candidates: [...new Set(all.map(({ component_id: id }) => id))].map((id) => ({ id })),
    assetEvidence: all.flatMap((instance) => (instance.asset_files ?? []).map((asset) => ({
      component_id: instance.component_id,
      asset_contract_id: asset.asset_contract_id,
      path: asset.path,
      mcp_export: { evidence_id: `export:${asset.path}`, source: "figma-mcp" },
    }))),
  };
}

test("resolved marketing and service handoff data reaches the renderer only through a temporary Email/Template model", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-email-handoff-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const { model, candidates, assetEvidence } = await fixture(root);

  const handoff = await prepareEmailBuildHandoff({
    repoRoot,
    model,
    candidates,
    assetEvidence,
    assetRoot: root,
  });

  assert.deepEqual(handoff.blockers, []);
  assert.equal(handoff.model.root.component_id, "email-template");
  assert.equal(handoff.model.root.slots[0].instances.some(({ component_id }) => component_id === "banner-secondary"), true);
  const secondary = handoff.model.root.slots[0].instances.find(({ component_id }) => component_id === "banner-secondary");
  assert.equal(secondary.nested_components[0].instance.component_id, "button-secondary");
  assert.equal(handoff.assetContracts.every(({ resolved }) => resolved.export_profile && resolved.expected_alpha), true);

  const temporaryModel = join(root, "temporary-email-model.json");
  const output = join(root, "handoff_1.0");
  await writeFile(temporaryModel, JSON.stringify(handoff.model), "utf8");
  await execFileAsync(process.execPath, [join(repoRoot, "scripts", "render-email.mjs"), "--model", temporaryModel, "--output", output], { cwd: repoRoot });
  const html = await readFile(join(output, "email.html"), "utf8");
  assert.match(html, /Небольшой заголовок/u);
  assert.match(html, /href="https:\/\/example\.test\/secondary"/u);
  assert.deepEqual(await readdir(output), ["email.html", "images"]);
});

test("handoff stops before rendering for resolver, asset-evidence, and renderer diagnostics", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-email-handoff-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = await fixture(root);

  const unregistered = await prepareEmailBuildHandoff({ ...source, repoRoot, assetRoot: root, candidates: [{ id: "missing-component" }] });
  assert.ok(unregistered.blockers.includes("component-unregistered"));

  const ambiguous = await prepareEmailBuildHandoff({
    ...source,
    repoRoot,
    assetRoot: root,
    candidates: [{ id: "banner-secondary", figma_identity: { file_key: "wrong", node_id: "wrong" } }],
  });
  assert.ok(ambiguous.blockers.includes("contract-ambiguous"));

  const missingAsset = await prepareEmailBuildHandoff({ ...source, repoRoot, assetRoot: root, assetEvidence: [] });
  assert.ok(missingAsset.blockers.includes("asset-contract-missing"));

  const malformed = structuredClone(source.model);
  malformed.root.component_id = "banner-secondary";
  const renderer = await prepareEmailBuildHandoff({ ...source, repoRoot, model: malformed, assetRoot: root });
  assert.ok(renderer.blockers.includes("renderer-diagnostic"));
});

test("design fixes remain Figma-gated while technical fixes preserve the source sibling", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-email-continue-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const workflow = await loadWorkflowRegistry({ repoRoot, workflowId: "email-build" });
  const design = resolveEmailBuildRequest({
    workflow,
    inputs: { request: true, "source-email-html": true, "source-images-directory": true, "exact-change-scope": "copy", "mobile-figma-instance": { role: "mobile", emailId: "same" } },
  });
  assert.equal(design.blocker, "figma-source-missing");
  const technical = resolveEmailBuildRequest({
    workflow,
    inputs: { request: true, "source-email-html": true, "source-images-directory": true, "exact-change-scope": "copy" },
  });
  assert.equal(technical.mode, "continue-fix-technical");
  assert.equal(technical.blocker, null);

  const source = await createEmailVersion({ resolution: { ...technical, allowedOutputs: ["version-folder", "email-html", "images-directory"] }, workspaceRoot: root, outputParent: root, purpose: "Technical proof" });
  await writeFile(join(source.target, "email.html"), "<p>source</p>", "utf8");
  await writeFile(join(source.target, "images", "proof.png"), "source-image", "utf8");
  const sourceHtml = await readFile(join(source.target, "email.html"), "utf8");
  const next = await createEmailVersion({ resolution: { ...technical, allowedOutputs: ["version-folder", "email-html", "images-directory"] }, workspaceRoot: root, outputParent: root, purpose: "ignored", sourceFolder: source.folder });
  assert.equal(await readFile(join(source.target, "email.html"), "utf8"), sourceHtml);
  assert.deepEqual(await readdir(next.target), ["email.html", "images"]);
});
