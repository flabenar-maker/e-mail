import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

test("current system uses the Node test runner and has no concrete email output", async () => {
  const packageJson = JSON.parse(await readFile(join(repoRoot, "package.json"), "utf8"));
  assert.match(packageJson.scripts.test, /node/u);
  for (const output of ["email.html", "images"]) {
    await assert.rejects(readFile(join(repoRoot, output), "utf8"));
  }
});

test("current system routes and interpreter coverage remain explicit", async () => {
  const [manifest, rendererRegistry] = await Promise.all([
    readStrictYaml(join(repoRoot, "system/manifest.yaml")),
    readStrictYaml(join(repoRoot, "data/renderers/registry.yaml")),
  ]);
  const coverage = new Map(rendererRegistry.coverage.map(({ component_id, mode }) => [component_id, mode]));
  const expectedWorkflows = new Map([
    ["library-maintenance", "workflow-library-maintenance"],
    ["component-onboarding", "workflow-component-onboarding"],
    ["figma-description-sync", "workflow-figma-description-sync"],
    ["figma-naming-audit", "workflow-figma-naming-audit"],
    ["system-progress", "workflow-system-progress"],
    ["email-new-build", "workflow-email-build"],
    ["email-continue-fix", "workflow-email-build"],
  ]);
  assert.equal(manifest.routes.length, expectedWorkflows.size);
  for (const { id, workflow_source_id } of manifest.routes) assert.equal(workflow_source_id, expectedWorkflows.get(id), id);
  for (const componentId of ["email-template", "button-primary", "button-secondary", "card-image", "banner-secondary", "banner-app-download", "email-footer"]) assert.equal(coverage.get(componentId), "interpreter", componentId);
});