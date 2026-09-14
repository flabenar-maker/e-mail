import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const preserved = {
  ".agents/skills/maintaining-cupis-email-system/SKILL.md":
    "5bf171527cd2e4737997397f4e7fcdcf48857c23",
  ".agents/skills/maintaining-cupis-email-system/agents/openai.yaml":
    "5bc8931c02b653295005bb955172c2c62f6bdf41",
  "core/email-figma-prompt.md":
    "b4fc6d5c2d4b32f0d6b0ce2cd567ca8078945068",
  "core/figma-component-naming-standard.md":
    "97c922e918244d6142d3e82bc89f9ca09652389d",
  "registry/email-component-descriptions-registry.md":
    "be2203aef82db093fca37857f060d552b254c579",
  "registry/email-typography-registry.md":
    "12e5ae0b0aa1c5f18f9132e2e948e6a712c0f1bd",
  "workflows/library-maintenance-checkpoint.md":
    "0fe0abb332876c55613c0503fa20dc6b260eff16",
  "workflows/email-build-checkpoint.md":
    "42f8f91ca6e867b514c6d1af3dbef5c292cb8106",
  "docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md":
    "42346b3abbb04903d36934feb4b024175c073815",
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
