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

function collectFoundationValues(value, keys = [], scalars = []) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectFoundationValues(item, keys, scalars);
    }
    return { keys, scalars };
  }
  if (value !== null && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      keys.push(key);
      collectFoundationValues(item, keys, scalars);
    }
    return { keys, scalars };
  }
  scalars.push(String(value));
  return { keys, scalars };
}

function containsRenameMap(value) {
  if (Array.isArray(value)) {
    return value.some(containsRenameMap);
  }
  if (value === null || typeof value !== "object") {
    return false;
  }
  const keys = Object.keys(value);
  return (
    (keys.includes("old") && keys.includes("new")) ||
    Object.values(value).some(containsRenameMap)
  );
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
    naming.layer_names.controlled_roles,
    [
      "image-area",
      "content-area",
      "text-content",
      "heading",
      "body",
      "caption",
      "supporting-text",
      "label",
      "link",
      "actions",
      "cards",
      "items",
      "steps",
      "bullets",
      "rows",
      "divider",
      "social-links",
      "background",
      "glyph",
      "artwork",
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

  const { keys, scalars } = collectFoundationValues(naming);
  for (const forbiddenKey of [
    "component_id",
    "node_id",
    "description",
    "width",
    "height",
    "rename_map",
    "figma_write",
    "auto_migrate",
  ]) {
    assert.equal(
      keys.includes(forbiddenKey),
      false,
      "Foundation must not contain concrete key: " + forbiddenKey,
    );
  }
  for (const componentName of [
    "Banner/Hero",
    "Banner/Secondary",
    "Block/Cards-Icons",
  ]) {
    assert.equal(
      scalars.includes(componentName),
      false,
      "Foundation must not contain current component name: " + componentName,
    );
  }
  assert.equal(
    scalars.some((value) => /^[0-9]+:[0-9]+$/u.test(value)),
    false,
    "Foundation must not contain Figma node IDs.",
  );
  assert.equal(
    scalars.some((value) => /\S+\s*→\s*\S+/u.test(value)),
    false,
    "Foundation must not contain concrete old → new mappings.",
  );
  assert.equal(
    containsRenameMap(naming),
    false,
    "Foundation must not contain old/new rename-map records.",
  );
});
