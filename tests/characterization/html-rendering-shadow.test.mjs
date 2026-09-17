import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadWorkflowRegistry,
  resolveWorkflowSteps,
} from "../../scripts/lib/workflow-registry.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

function allStepIds(registry) {
  return new Set(
    registry.workflow.modes.flatMap(({ id }) =>
      resolveWorkflowSteps(registry, id).map((step) => step.id),
    ),
  );
}

test("structured workflows preserve the archived workflow files byte-for-byte", async () => {
  const maintenance = await readFile(
    join(repoRoot, "Legacy/workflows/library-maintenance-checkpoint.md"),
  );
  const email = await readFile(
    join(repoRoot, "Legacy/workflows/email-build-checkpoint.md"),
  );

  assert.equal(
    digest(maintenance),
    "bfccff80d4dd4eff0d439660c28bbc4e6607631d530dfea8cea165c96fdb6f51",
  );
  assert.equal(
    digest(email),
    "31558913bf66d0530c5111f68b306c1e379f48af19a022168de61da9d92476a7",
  );
});

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
