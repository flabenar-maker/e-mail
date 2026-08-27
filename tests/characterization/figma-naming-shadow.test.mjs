import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function escapeRegExp(value) {
  return value.replace(/[.*+?^$()|[\]\\]/gu, "\\$&");
}

test("Figma naming shadow preserves the approved universal rules", async () => {
  const [standard, spec] = await Promise.all([
    readFile(
      join(repoRoot, "core/figma-component-naming-standard.md"),
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
    "COMPONENT_PATTERN = <Namespace>/<Semantic-Name>",
    "BOOLEAN_PROPERTY_PATTERN = Show <Role>",
    "ASSET_SCALE_SUFFIX = @2x | @4x",
    "Email/Template",
    "Example · <Family> · <Semantic-Name> · <Viewport>",
    "old → new",
  ]) {
    assert.match(standard + spec, new RegExp(escapeRegExp(anchor), "u"));
  }

  const naming = await readStrictYaml(
    join(repoRoot, "data/foundations/figma-naming.yaml"),
  );

  assert.equal(naming.schema_version, "1.0.0");
  assert.equal(naming.foundation.id, "figma-naming");
  assert.equal(naming.foundation.status, "shadow");
  assert.equal(naming.foundation.language, "English");
  assert.deepEqual(
    naming.namespaces.map((item) => item.label),
    [
      "Email",
      "Banner",
      "Block",
      "Card",
      "Item",
      "Button",
      "Badge",
      "Details",
      "NPS",
      "Icon",
      "Asset",
    ],
  );
  assert.deepEqual(
    naming.variant_axes.map((item) => item.label),
    ["Viewport", "Layout", "Style", "State", "Count", "Context"],
  );
  assert.deepEqual(naming.asset_owners.scale_suffixes, [
    { scale: 2, suffix: "@2x" },
    { scale: 4, suffix: "@4x" },
  ]);
});
