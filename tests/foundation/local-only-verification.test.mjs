import test from "node:test";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const workflowsDirectory = join(repoRoot, ".github/workflows");

test("repository has no GitHub Actions workflow files", async () => {
  let entries;

  try {
    entries = await readdir(workflowsDirectory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  const workflowFiles = entries
    .filter((entry) => entry.isFile() && /\.ya?ml$/iu.test(entry.name))
    .map((entry) => entry.name);

  assert.deepEqual(workflowFiles, []);
});
