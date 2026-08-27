import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

test("assets shadow source preserves the approved global contracts", async () => {
  const [prompt, registry, spec] = await Promise.all([
    readFile(join(repoRoot, "core/email-figma-prompt.md"), "utf8"),
    readFile(
      join(repoRoot, "registry/email-component-descriptions-registry.md"),
      "utf8",
    ),
    readFile(
      join(
        repoRoot,
        "docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md",
      ),
      "utf8",
    ),
  ]);

  for (const anchor of [
    "IMAGE FILL",
    "RENDERED NODE",
    "DIRECT IMAGE",
    "FILL IMAGE",
    "@2x",
    "@4x",
    "sRGB",
    "начальное качество: 82%",
    "height:auto",
  ]) {
    assert.match(prompt, new RegExp(escapeRegExp(anchor), "u"));
  }

  for (const anchor of [
    "Banner/Hero",
    "Banner/Secondary",
    "Asset/Card-Image",
    "Asset/Feature-Icon",
  ]) {
    assert.match(registry, new RegExp(escapeRegExp(anchor), "u"));
  }

  for (const anchor of [
    "Image contract",
    "@2x",
    "@4x",
    "transparency",
    "structured data",
  ]) {
    assert.match(spec, new RegExp(escapeRegExp(anchor), "u"));
  }

  const assetsText = await readFile(
    join(repoRoot, "data/foundations/assets.yaml"),
    "utf8",
  );
  assert.match(assetsText, /^schema_version:\s+1\.0\.0$/mu);
});
