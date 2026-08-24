import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { parseStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const workflowPath = join(
  repoRoot,
  ".github/workflows/system-validation.yml",
);

test("system validation workflow is read-only and cross-platform", async () => {
  const text = await readFile(workflowPath, "utf8");
  const workflow = parseStrictYaml(
    text,
    ".github/workflows/system-validation.yml",
  );

  assert.ok(Object.hasOwn(workflow.on, "pull_request"));
  assert.deepEqual(workflow.on.push.branches, ["main"]);
  assert.equal(workflow.permissions.contents, "read");
  assert.deepEqual(Object.keys(workflow.jobs).sort(), [
    "node-validation",
    "windows-bootstrap",
  ]);

  for (const job of Object.values(workflow.jobs)) {
    assert.ok(
      job.steps.some((step) => step.uses === "actions/checkout@v7"),
    );
    const setup = job.steps.find(
      (step) => step.uses === "actions/setup-node@v7",
    );
    assert.equal(setup.with["node-version"], "24");
    assert.equal(setup.with.cache, "npm");
    assert.ok(
      job.steps.some((step) => step.run === "npm ci --ignore-scripts"),
    );
  }

  const linuxRuns = workflow.jobs["node-validation"].steps
    .map((step) => step.run)
    .filter(Boolean);
  assert.ok(linuxRuns.includes("npm run validate"));
  assert.ok(linuxRuns.includes("npm test"));

  const windowsSteps = workflow.jobs["windows-bootstrap"].steps;
  assert.ok(
    windowsSteps.some(
      (step) =>
        step.shell === "pwsh" &&
        step.run === "pwsh -NoProfile -File bootstrap/verify.ps1",
    ),
  );
  assert.ok(
    windowsSteps.some(
      (step) =>
        step.shell === "pwsh" &&
        step.run ===
          "pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1",
    ),
  );

  assert.doesNotMatch(text, /figma/iu);
  assert.doesNotMatch(text, /contents:\s*write/iu);
  assert.doesNotMatch(text, /(?:token|secret|password)\s*:/iu);
});
