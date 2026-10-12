import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadWorkflowRegistry,
  resolveWorkflowSteps,
} from "../../scripts/lib/workflow-registry.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function allStepIds(registry) {
  return new Set(
    registry.workflow.modes.flatMap(({ id }) =>
      resolveWorkflowSteps(registry, id).map((step) => step.id),
    ),
  );
}

test("maintenance responsibilities have structured step owners", async () => {
  const workflow = await loadWorkflowRegistry({
    repoRoot,
    workflowId: "library-maintenance",
  });
  const steps = allStepIds(workflow);

  for (const id of [
    "pin-canonical-state",
    "assess-impact",
    "prepare-change-boundary",
    "inspect-figma-read-only",
    "apply-authorized-figma-change",
    "verify-figma-readback",
    "synchronize-dependents",
    "verify-exact-cloud-commit",
    "publish-review",
  ]) {
    assert.equal(steps.has(id), true, id);
  }
});

test("email build responsibilities have structured step owners", async () => {
  const workflow = await loadWorkflowRegistry({
    repoRoot,
    workflowId: "email-build",
  });
  const steps = allStepIds(workflow);

  for (const id of [
    "validate-specific-email-sources",
    "inspect-source-email",
    "create-version-folder",
    "create-next-version-folder",
    "resolve-component-contracts",
    "export-assets-via-mcp",
    "build-temporary-email-model",
    "render-email-cli",
    "verify-rendered-email",
    "verify-source-regression",
    "clean-output-folder",
    "handoff",
  ]) {
    assert.equal(steps.has(id), true, id);
  }
});
