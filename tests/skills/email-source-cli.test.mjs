import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const command = new URL("../../scripts/verify-email-source.mjs", import.meta.url);
const workflow = new URL("../../data/workflows/email-build.yaml", import.meta.url);

function minimalInput() {
  const variants = { mobile: "mobile", desktop: "desktop" };
  const root = { instance_id: "letter", component_id: "email-template", variants,
    property_values: [], content_values: [], asset_files: [], slots: [] };
  return {
    model: { schema_version: "1.1.0", id: "source-cli", metadata: { language: "ru", direction: "ltr" }, root },
    readings: { capture_id: "capture-1", file_key: "file", captured_at: "2026-09-23T12:00:00Z", complete: true,
      selection: { mobile: { root_node_id: "m-root", terminal: true, truncated: false },
        desktop: { root_node_id: "d-root", terminal: true, truncated: false } },
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
  const pass = spawnSync(process.execPath, [command.pathname, path], { encoding: "utf8" });
  assert.equal(pass.status, 0);
  assert.deepEqual(JSON.parse(pass.stdout).diagnostics, []);

  const bad = minimalInput();
  bad.readings.instances[0].variant_id = "desktop";
  await writeFile(path, JSON.stringify(bad), "utf8");
  const fail = spawnSync(process.execPath, [command.pathname, path], { encoding: "utf8" });
  assert.equal(fail.status, 1);
  assert.ok(JSON.parse(fail.stdout).diagnostics.some(({ code }) => code === "EMAIL_SOURCE_VARIANT_MISMATCH"));
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
