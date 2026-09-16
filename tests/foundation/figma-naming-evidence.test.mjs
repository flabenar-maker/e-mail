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
      "OBSERVED_FIGMA_EXPORT_SUFFIX_MISMATCH",
      "OBSERVED_FIGMA_LEGACY_DEFAULT_LAYER_NAME",
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
    ],
  );
});

test("capture audits existing observed names without proposing a rename", async () => {
  const naming = await loadFigmaNamingFoundation({ repoRoot });
  const capture = await fixture("figma-naming-capture.json");
  const audited = capture.layers.map(({ name, role_id: roleId }) =>
    auditExistingFigmaName(naming, {
      objectKind: "layer",
      name,
      ...(roleId ? { roleId } : {}),
    }),
  );

  assert.equal(audited.every((result) => result.rename_proposal === null), true);
  assert.deepEqual(
    audited.map((result) => result.semantic_status),
    ["confirmed", "confirmed", "confirmed", "unresolved"],
  );
});

test("checked generated naming reference is exactly derived from the generator", async () => {
  const naming = await loadFigmaNamingFoundation({ repoRoot });
  const referencePath = join(
    repoRoot,
    "tests/foundation/fixtures/figma-naming-generated-reference.json",
  );

  assert.equal(await readFile(referencePath, "utf8"), renderFigmaNamingReference(naming));
});
