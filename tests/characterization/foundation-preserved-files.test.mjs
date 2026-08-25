import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const preserved = {
  "core/email-figma-prompt.md":
    "37ff4cdf5910e39b712decd85898be29d2283563",
  "core/figma-component-naming-standard.md":
    "97c922e918244d6142d3e82bc89f9ca09652389d",
  "registry/email-component-descriptions-registry.md":
    "5bc4c21b4aae17ab8a15d182e8904b914198fbf9",
  "registry/email-typography-registry.md":
    "12e5ae0b0aa1c5f18f9132e2e948e6a712c0f1bd",
  "workflows/library-maintenance-checkpoint.md":
    "81d951189f73a65efb74d70cc390c5213c5f2e9f",
  "workflows/email-build-checkpoint.md":
    "42f8f91ca6e867b514c6d1af3dbef5c292cb8106",
  "docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md":
    "b3891c0f0a31e14ea8bd9a4e192d1366351ec489",
};

async function gitBlobSha(relativePath) {
  const diskContent = await readFile(join(repoRoot, relativePath), "utf8");
  const content = Buffer.from(diskContent.replace(/\r\n/gu, "\n"), "utf8");
  return createHash("sha1")
    .update(`blob ${content.length}\0`)
    .update(content)
    .digest("hex");
}

for (const [relativePath, expected] of Object.entries(preserved)) {
  test(`preserves ${relativePath}`, async () => {
    const actual = await gitBlobSha(relativePath);
    assert.equal(
      actual,
      expected,
      `${relativePath}: expected blob ${expected}, received ${actual}`,
    );
  });
}
