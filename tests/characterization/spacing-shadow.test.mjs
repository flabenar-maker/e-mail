import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function componentSection(registry, componentName) {
  const heading = "## `" + componentName + "`";
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

test("every approved role has one exact pair and registry evidence", async () => {
  const [spacing, registry] = await Promise.all([
    readStrictYaml(join(repoRoot, "data/foundations/spacing.yaml")),
    readFile(
      join(repoRoot, "registry/email-component-descriptions-registry.md"),
      "utf8",
    ),
  ]);
  const expected = new Map([
    ["outer-flow", [16, 24]],
    ["common-horizontal-inset", [16, 24]],
    ["self-horizontal-inset", [16, 24]],
    ["surface-padding-primary", [22, 32]],
    ["surface-padding-compact", [16, 24]],
    ["section-stack-standard", [16, 24]],
    ["collection-stack-spacious", [22, 32]],
    ["visual-item-stack", [22, 24]],
    ["details-row-stack", [12, 16]],
    ["inline-peer-standard", [16, 24]],
    ["inline-peer-compact", [8, 12]],
    ["text-stack-standard", [8, 12]],
    ["text-stack-tight", [4, 6]],
    ["asset-to-content-standard", [16, 24]],
    ["asset-to-content-compact", [8, 12]],
  ]);

  assert.equal(spacing.roles.length, expected.size);
  for (const role of spacing.roles) {
    assert.deepEqual(
      [
        role.resolutions.mobile.value_px,
        role.resolutions.desktop.value_px,
      ],
      expected.get(role.id),
      `Unexpected exact pair for ${role.id}`,
    );
    assert.ok(role.evidence.length > 0, `Missing evidence for ${role.id}`);
    for (const evidence of role.evidence) {
      assert.ok(
        registry.includes(`## \`${evidence.component}\``),
        `Missing registry evidence component: ${evidence.component}`,
      );
    }
  }
});

test("shadow foundation contains no build choices or component contracts", async () => {
  const spacing = await readStrictYaml(
    join(repoRoot, "data/foundations/spacing.yaml"),
  );
  const serialized = JSON.stringify(spacing);

  assert.equal(spacing.exceptions.length, 0);
  assert.doesNotMatch(
    serialized,
    /allowed_values|candidate_values|fallback_viewport|"range"|"min"|"max"/u,
  );
  for (const role of spacing.roles) {
    assert.equal(role.description, undefined);
    assert.equal(role.component_id, undefined);
    assert.equal(role.html, undefined);
  }
});
