import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadFigmaNamingFoundation } from "../../scripts/lib/figma-naming-foundation.mjs";
import { auditExistingFigmaName } from "../../scripts/lib/figma-name-validator.mjs";
import { renderFigmaNamingReference } from "../../scripts/lib/figma-name-generator.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function fixture(name) {
  return JSON.parse(
    await readFile(join(repoRoot, "tests/foundation/fixtures", name), "utf8"),
  );
}

test("non-normative Figma naming capture keeps exact roots, representatives, and mandatory unresolved observations", async () => {
  const capture = await fixture("figma-naming-capture.json");

  assert.deepEqual(capture.roots, [
    { id: "538:17236", name: "Marketing Emails" },
    { id: "538:17235", name: "Service Emails" },
  ]);
  assert.deepEqual(
    capture.unresolved.map((record) => record.code),
    [
      "OBSERVED_FIGMA_LAYER_SEMANTIC_ROLE_UNPROVEN",
    ],
  );
  assert.deepEqual(
    capture.asset_owners.map((owner) => [
      owner.kind,
      owner.name,
      owner.suffix,
      owner.scale,
    ]),
    [
      ["internal", "hero-image @2x", "@2x", 2],
      ["component", "Asset/Feature-Icon @4x", "@4x", 4],
      ["internal", "vk-icon @4x", "@4x", 4],
    ],
  );
  assert.deepEqual(capture.implementation_geometry, [
    { id: "531:14003", name: "Vector", node_type: "VECTOR", parent_semantic_boundary: "error-warning-line @4x" },
    { id: "491:22346", name: "Subtract", node_type: "BOOLEAN_OPERATION", parent_semantic_boundary: "Icon/Receipt-Fill" },
    { id: "13:344", name: "Rectangle 3946", node_type: "RECTANGLE", parent_semantic_boundary: "chevron-icon @4x" },
  ]);
  assert.deepEqual(
    capture.components.find(
      (component) => component.id === "1084:16996",
    ).variants,
    [
      "Viewport=Mobile, State=Pending",
      "Viewport=Mobile, State=Success",
      "Viewport=Mobile, State=Error",
      "Viewport=Desktop, State=Pending",
      "Viewport=Desktop, State=Success",
      "Viewport=Desktop, State=Error",
    ],
  );
});

test("capture audits existing observed names without proposing a rename", async () => {
  const naming = await loadFigmaNamingFoundation({ repoRoot });
  const capture = await fixture("figma-naming-capture.json");
  const audited = capture.layers.map(
    ({ name, role_id: roleId, semantic_category: semanticCategory }) =>
      auditExistingFigmaName(naming, {
        objectKind: "layer",
        name,
        ...(roleId ? { roleId } : {}),
        ...(semanticCategory ? { semanticCategory } : {}),
      }),
  );

  assert.equal(audited.every((result) => result.rename_proposal === null), true);
  assert.deepEqual(
    audited.map((result) => result.semantic_status),
    ["confirmed", "confirmed", "confirmed", "unresolved"],
  );
});

test("checked generated naming reference is canonically derived from the generator", async () => {
  const naming = await loadFigmaNamingFoundation({ repoRoot });
  const referencePath = join(
    repoRoot,
    "tests/foundation/fixtures/figma-naming-generated-reference.json",
  );

  const stored = await readFile(referencePath, "utf8");
  assert.equal(
    stored.replaceAll("\r\n", "\n"),
    renderFigmaNamingReference(naming),
  );
});
