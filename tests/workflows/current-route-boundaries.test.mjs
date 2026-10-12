import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";

import { createSystemFixture, copyFixtureFile, canonicalSystemFixtureFiles } from "../helpers/system-fixture.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import { resolveSkillContext } from "../../scripts/lib/skill-context.mjs";
import { validateWorkflowRegistrySemantics } from "../../scripts/lib/workflow-registry.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function fixture(t) {
  const result = await createSystemFixture();
  t.after(result.cleanup);
  for (const path of canonicalSystemFixtureFiles) await copyFixtureFile(repoRoot, result.root, path);
  return result.root;
}

test("resolved workflow steps cannot cite absent bundle source content", async (t) => {
  const root = await fixture(t);
  const manifest = await readStrictYaml(join(root, "system/manifest.yaml"));
  const profile = manifest.bundle_profiles.find(({ id }) => id === "library-maintenance");
  profile.source_ids = profile.source_ids.filter((id) => id !== "component-contract-standard");
  profile.generated_bundle.static_source_ids = [...profile.source_ids];
  await writeFile(join(root, "system/manifest.yaml"), `${JSON.stringify(manifest, null, 2)}\n`);
  const result = await resolveSkillContext({ repoRoot: root, routeId: "library-maintenance", workflowMode: "read-only", viewports: ["mobile", "desktop"] });
  assert.equal(result.status, "blocked");
  assert.ok(result.blockers.some(({ code, path }) => code === "SKILL_WORKFLOW_SOURCE_MISSING" && path.includes("component-contract-standard")));
});

test("each required step input must be available before that step", () => {
  const workflow = { workflow: { source_ids: ["repository-readme"], modes: [{ id: "read-only", required_inputs: ["request"], steps: [{ id: "inspect", order: 1, source_ids: ["repository-readme"], required_inputs: ["unproduced-facts"], blockers: ["facts-missing"], allowed_outputs: ["report"], handoff: { on_success: "complete", on_blocked: "stop" } }] }] } };
  const errors = validateWorkflowRegistrySemantics(workflow, { sources: [{ id: "repository-readme" }] });
  assert.ok(errors.some(({ code }) => code === "WORKFLOW_STEP_INPUT_UNAVAILABLE"));
});
