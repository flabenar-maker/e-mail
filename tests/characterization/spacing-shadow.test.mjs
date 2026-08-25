import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function componentSection(registry, componentName) {
  const heading = `## \\`${componentName}\\``;
  const start = registry.indexOf(heading);
  assert.notEqual(start, -1, `Missing registry component: ${componentName}`);
  const next = registry.indexOf("\n## ", start + heading.length);
  return registry.slice(start, next === -1 ? registry.length : next);
}

test("structured spacing preserves confirmed registry values", async () => {
  const [spacing, registry] = await Promise.all([
    readStrictYaml(join(repoRoot, "data/foundations/spacing.yaml")),
    readFile(
      join(repoRoot, "registry/email-component-descriptions-registry.md"),
      "utf8",
    ),
  ]);

  const roles = new Map(spacing.roles.map((role) => [role.id, role]));
  assert.deepEqual(roles.get("outer-flow").resolutions, {
    mobile: {
      value_px: 16,
      provenance: {
        kind: "registry-literal",
        source_path: "registry/email-component-descriptions-registry.md",
      },
    },
    desktop: {
      value_px: 24,
      provenance: {
        kind: "registry-literal",
        source_path: "registry/email-component-descriptions-registry.md",
      },
    },
  });

  assert.match(
    componentSection(registry, "Block/Content"),
    /Mobile: top gap 16px, padding 22px[\s\S]*Desktop: top gap 24px, padding 32px/u,
  );
  assert.match(
    componentSection(registry, "Block/Icon-List"),
    /Rows: вертикально, gap 22px[\s\S]*Rows: вертикально, gap 24px/u,
  );
  assert.match(
    componentSection(registry, "Details/Receipt"),
    /rows с вертикальным gap 16px[\s\S]*rows с gap 12px/u,
  );
});
