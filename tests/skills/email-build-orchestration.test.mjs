import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

test("new build requires a typed email purpose before creating its version folder", async () => {
  const workflow = await emailWorkflow();
  const mode = modeById(workflow, "new-build");
  const createVersionFolder = mode.steps.find(
    (step) => step.id === "create-version-folder",
  );

  assert.ok(mode.required_inputs.includes("email-purpose"));
  assert.ok(createVersionFolder.required_inputs.includes("email-purpose"));
});