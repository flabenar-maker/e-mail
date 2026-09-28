import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const command = new URL("../../scripts/verify-email-source.mjs", import.meta.url);
const workflow = new URL("../../data/workflows/email-build.yaml", import.meta.url);

function minimalInput() {
  const variants = { mobile: "mobile", desktop: "desktop" };
  const root = { instance_id: "letter", component_id: "email-template", variants,
    property_values: [], content_values: [], asset_files: [], slots: [] };
  return {
    model: { schema_version: "1.1.0", id: "source-cli", metadata: { language: "ru", direction: "ltr" }, root },
    readings: { capture_id: "capture-1", file_key: "file", captured_at: "2026-09-23T12:00:00Z", complete: true,
      selection: { mobile: { root_node_id: "m-root", terminal: true, truncated: false, scope: "full-email", expected_top_level_count: 0 },
        desktop: { root_node_id: "d-root", terminal: true, truncated: false, scope: "full-email", expected_top_level_count: 0 } },
      instances: [
        { viewport: "mobile", node_id: "m-root", parent_node_id: null, order: 0, relation: null, variant_id: "mobile" },
        { viewport: "desktop", node_id: "d-root", parent_node_id: null, order: 0, relation: null, variant_id: "desktop" },
      ], fields: [], assets: [] },
    correspondence: { capture_id: "capture-1", file_key: "file",
      instances: [{ instance_id: "letter", nodes: { mobile: "m-root", desktop: "d-root" } }],
      fields: [], assets: [] },
    authorizedInputs: [], assetEvidence: [],
  };
}

test("source CLI is a failing pre-render gate, not a manual passed flag", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "cupis-source-cli-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const path = join(dir, "source.json");
  await writeFile(path, JSON.stringify(minimalInput()), "utf8");
  const pass = spawnSync(process.execPath, [fileURLToPath(command), path], { encoding: "utf8" });
  assert.equal(pass.status, 0);
  assert.deepEqual(JSON.parse(pass.stdout).diagnostics, []);
  assert.equal(JSON.parse(pass.stdout).scope, "full-email");

  const bad = minimalInput();
  bad.readings.instances[0].variant_id = "desktop";
  await writeFile(path, JSON.stringify(bad), "utf8");
  const fail = spawnSync(process.execPath, [fileURLToPath(command), path], { encoding: "utf8" });
  assert.equal(fail.status, 1);
  assert.ok(JSON.parse(fail.stdout).diagnostics.some(({ code }) => code === "EMAIL_SOURCE_VARIANT_MISMATCH"));
});

test("source CLI resolves concrete variant axes without inline text", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "cupis-source-axis-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const path = join(dir, "source.json");
  const input = minimalInput();
  const child = { instance_id: "nps-1", component_id: "nps-options",
    variants: { mobile: "mobile", desktop: "desktop" },
    variant_axes: { mobile: { Count: "2" }, desktop: { Count: "2" } },
    property_values: [], content_values: [], asset_files: [], slots: [] };
  input.model.root.slots = [{ element_id: "content", instances: [child] }];
  for (const viewport of ["mobile", "desktop"]) {
    input.readings.selection[viewport].expected_top_level_count = 1;
    input.readings.instances.push({ viewport, node_id: `${viewport}-nps`,
      parent_node_id: viewport === "mobile" ? "m-root" : "d-root", order: 0,
      relation: { kind: "slot", element_id: "content" }, variant_id: `${viewport}-2` });
  }
  input.correspondence.instances.push({ instance_id: "nps-1",
    nodes: { mobile: "mobile-nps", desktop: "desktop-nps" } });
  await writeFile(path, JSON.stringify(input), "utf8");
  const result = spawnSync(process.execPath, [fileURLToPath(command), path], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stdout || result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).diagnostics, []);
});
test("new-build workflow requires source correspondence after model assembly and before render", async () => {
  const data = JSON.parse(await readFile(workflow, "utf8"));
  const steps = data.workflow.modes.find(({ id }) => id === "new-build").steps;
  const model = steps.findIndex(({ id }) => id === "build-temporary-email-model");
  const source = steps.findIndex(({ id }) => id === "verify-model-source");
  const render = steps.findIndex(({ id }) => id === "render-email-cli");
  assert.ok(model >= 0 && source > model && render > source);
  assert.ok(steps[source].required_inputs.includes("temporary-email-model"));
  assert.ok(steps[source].required_inputs.includes("source-correspondence"));
  assert.ok(steps[render].required_inputs.includes("source-comparison"));
});



test("production CLI rejects a selected-subtree proof and test-only inputs", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "cupis-source-scope-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const path = join(dir, "source.json");
  const input = minimalInput();
  input.readings.selection.mobile.scope = "selected-subtrees";
  input.readings.selection.desktop.scope = "selected-subtrees";
  input.authorizedInputs.push({ instance_id: "letter", kind: "content", element_id: "none", slot_id: "text",
    viewport: "mobile", origin: "test-fixture", value: "example" });
  await writeFile(path, JSON.stringify(input), "utf8");
  const blocked = spawnSync(process.execPath, [fileURLToPath(command), path], { encoding: "utf8" });
  assert.equal(blocked.status, 1);
  const codes = JSON.parse(blocked.stdout).diagnostics.map(({ code }) => code);
  assert.ok(codes.includes("EMAIL_SOURCE_SCOPE_INCOMPLETE"));
  assert.ok(codes.includes("EMAIL_SOURCE_INPUT_UNAUTHORIZED"));
  const selected = spawnSync(process.execPath, [fileURLToPath(command), path, "--selected-test"], { encoding: "utf8" });
  assert.equal(selected.status, 0);
  assert.equal(JSON.parse(selected.stdout).scope, "selected-test");
});



test("production scope checks the Figma slot child count independently", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "cupis-source-count-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const path = join(dir, "source.json");
  const input = minimalInput();
  input.readings.selection.desktop.expected_top_level_count = 1;
  await writeFile(path, JSON.stringify(input), "utf8");
  const result = spawnSync(process.execPath, [fileURLToPath(command), path], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.ok(JSON.parse(result.stdout).diagnostics.some(({ code }) => code === "EMAIL_SOURCE_SCOPE_INCOMPLETE"));
});


function assetOnlyInput(assetContractId = "header-logo") {
  const input = minimalInput();
  const asset = {
    instance_id: "header-asset", component_id: "asset-header-logo-4x",
    variants: { mobile: "mobile", desktop: "desktop" },
    property_values: [], content_values: [],
    asset_files: [{ asset_contract_id: assetContractId, path: "images/header-logo.png" }], slots: [],
  };
  input.model.root.slots = [{ element_id: "content", instances: [asset] }];
  for (const viewport of ["mobile", "desktop"]) {
    input.readings.selection[viewport].expected_top_level_count = 1;
    input.readings.instances.push({ viewport, node_id: `${viewport}-header`,
      parent_node_id: viewport === "mobile" ? "m-root" : "d-root", order: 0,
      relation: { kind: "slot", element_id: "content" }, variant_id: viewport });
  }
  input.correspondence.instances.push({ instance_id: "header-asset",
    nodes: { mobile: "mobile-header", desktop: "desktop-header" } });
  input.readings.assets.push({ viewport: "mobile", node_id: "mobile-logo",
    owner_node_id: "mobile-header", evidence_id: "mobile-logo-export" });
  input.correspondence.assets.push({ instance_id: "header-asset", asset_contract_id: assetContractId,
    viewport: "mobile", node_id: "mobile-logo" });
  input.assetEvidence.push({ instance_id: "header-asset", asset_contract_id: assetContractId,
    path: "images/header-logo.png", mcp_export: { source_node_id: "mobile-logo", evidence_id: "mobile-logo-export",
      capture_id: "capture-1", file_key: "file" } });
  return input;
}

test("source CLI loads asset contracts for an asset-only model before renderer handoff", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "cupis-source-asset-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const path = join(dir, "source.json");

  await writeFile(path, JSON.stringify(assetOnlyInput()), "utf8");
  const wrongViewport = spawnSync(process.execPath, [fileURLToPath(command), path], { encoding: "utf8" });
  assert.equal(wrongViewport.status, 1, wrongViewport.stdout || wrongViewport.stderr);
  assert.ok(JSON.parse(wrongViewport.stdout).diagnostics
    .some(({ code }) => code === "EMAIL_SOURCE_ASSET_VIEWPORT_MISMATCH"));

  await writeFile(path, JSON.stringify(assetOnlyInput("unknown-logo")), "utf8");
  const missingContract = spawnSync(process.execPath, [fileURLToPath(command), path], { encoding: "utf8" });
  assert.equal(missingContract.status, 1, missingContract.stdout || missingContract.stderr);
  assert.ok(JSON.parse(missingContract.stdout).diagnostics
    .some(({ code }) => code === "EMAIL_SOURCE_ASSET_CONTRACT_MISSING"));
});