import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadFigmaNamingFoundation } from "../../scripts/lib/figma-naming-foundation.mjs";
import {
  auditExistingFigmaName,
  validateFigmaName,
  validateFigmaNameProposal,
} from "../../scripts/lib/figma-name-validator.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function canonicalNaming() {
  return loadFigmaNamingFoundation({ repoRoot });
}

function codes(errors) {
  return errors.map((error) => error.code);
}

for (const candidate of [
  {
    objectKind: "component",
    name: "Block/Cards-Icons",
    namespaceId: "block",
  },
  { objectKind: "layer", name: "item-01" },
  {
    objectKind: "property",
    propertyKind: "boolean",
    name: "Show Caption",
  },
  {
    objectKind: "property",
    propertyKind: "variant-axis",
    name: "Viewport",
  },
  {
    objectKind: "asset-owner",
    name: "feature-image @2x",
    expectedScale: 2,
  },
  { objectKind: "page", name: "Email Components" },
  { objectKind: "section", name: "Shared" },
  {
    objectKind: "example",
    name: "Example · Cards · Vacancy · Mobile",
  },
]) {
  test("accepts valid " + candidate.objectKind + " candidate", async () => {
    const naming = await canonicalNaming();

    assert.deepEqual(validateFigmaName(naming, candidate), []);
  });
}

for (const [name, candidate, expectedCodes] of [
  [
    "unknown object kind",
    { objectKind: "unknown", name: "Something" },
    ["FIGMA_NAME_UNKNOWN_OBJECT_KIND"],
  ],
  [
    "extra component slash",
    {
      objectKind: "component",
      name: "Block/Cards/Icon",
      namespaceId: "block",
    },
    ["FIGMA_NAME_COMPONENT_PATTERN"],
  ],
  [
    "unknown component namespace",
    {
      objectKind: "component",
      name: "Unknown/Cards",
      namespaceId: "unknown",
    },
    ["FIGMA_NAME_UNKNOWN_NAMESPACE"],
  ],
  [
    "component case",
    {
      objectKind: "component",
      name: "Block/cards-icons",
      namespaceId: "block",
    },
    ["FIGMA_NAME_CASE"],
  ],
  [
    "unapproved component abbreviation",
    {
      objectKind: "component",
      name: "Block/CARDS",
      namespaceId: "block",
    },
    ["FIGMA_NAME_CASE"],
  ],
  [
    "generic Figma layer",
    { objectKind: "layer", name: "Frame 12" },
    ["FIGMA_NAME_GENERIC"],
  ],
  [
    "one-digit repeater",
    { objectKind: "layer", name: "item-1" },
    ["FIGMA_NAME_REPEATER_INDEX"],
  ],
  [
    "viewport word in a layer",
    { objectKind: "layer", name: "mobile-image" },
    ["FIGMA_NAME_VIEWPORT_WORD_FORBIDDEN"],
  ],
  [
    "invalid Boolean property",
    {
      objectKind: "property",
      propertyKind: "boolean",
      name: "Caption Visible",
    },
    ["FIGMA_NAME_PROPERTY_PATTERN"],
  ],
  [
    "missing asset suffix",
    {
      objectKind: "asset-owner",
      name: "feature-image",
      expectedScale: 2,
    },
    ["FIGMA_NAME_SCALE_SUFFIX_REQUIRED"],
  ],
  [
    "asset scale mismatch",
    {
      objectKind: "asset-owner",
      name: "feature-image @2x",
      expectedScale: 4,
    },
    ["FIGMA_NAME_SCALE_SUFFIX_MISMATCH"],
  ],
  [
    "asset suffix outside the end",
    {
      objectKind: "asset-owner",
      name: "@4x feature-image",
      expectedScale: 4,
    },
    ["FIGMA_NAME_SUFFIX_POSITION"],
  ],
  [
    "asset suffix without the required separating space",
    {
      objectKind: "asset-owner",
      name: "feature-image@4x",
      expectedScale: 4,
    },
    ["FIGMA_NAME_SUFFIX_POSITION"],
  ],
  [
    "asset file extension",
    {
      objectKind: "asset-owner",
      name: "feature-image@4x.png",
      expectedScale: 4,
    },
    [
      "FIGMA_NAME_EXTENSION_FORBIDDEN",
      "FIGMA_NAME_SUFFIX_POSITION",
    ],
  ],
]) {
  test("reports " + name + " deterministically", async () => {
    const naming = await canonicalNaming();
    const errors = validateFigmaName(naming, candidate);

    assert.deepEqual(codes(errors), expectedCodes);
    assert.deepEqual(
      errors,
      [...errors].sort(
        (left, right) =>
          left.path.localeCompare(right.path) ||
          left.code.localeCompare(right.code) ||
          left.message.localeCompare(right.message),
      ),
    );
  });
}

test("validator does not mutate the candidate or foundation", async () => {
  const naming = await canonicalNaming();
  const candidate = {
    objectKind: "component",
    name: "Block/Cards-Icons",
    namespaceId: "block",
  };
  const beforeNaming = structuredClone(naming);
  const beforeCandidate = structuredClone(candidate);

  validateFigmaName(naming, candidate);

  assert.deepEqual(naming, beforeNaming);
  assert.deepEqual(candidate, beforeCandidate);
});

test("existing-name audit keeps a syntax-valid observed layer out of rename scope when its role is unproven", async () => {
  const naming = await canonicalNaming();
  const result = auditExistingFigmaName(naming, {
    objectKind: "layer",
    name: "artwork",
  });

  assert.deepEqual(result, {
    status: "observed",
    object_kind: "layer",
    name: "artwork",
    syntax_status: "valid",
    semantic_status: "unresolved",
    diagnostics: ["semantic-role-required"],
    rename_proposal: null,
  });
});

test("syntax-valid layers with an unknown or prohibited category cannot become confirmed proposals", async () => {
  const naming = await canonicalNaming();

  const unknown = validateFigmaNameProposal(naming, {
    objectKind: "layer",
    name: "custom-decoration",
    roleId: "custom-decoration",
  });
  const prohibited = validateFigmaNameProposal(naming, {
    objectKind: "layer",
    name: "blue-background",
    roleId: "background",
    semanticCategory: "color",
  });
  const missing = validateFigmaNameProposal(naming, {
    objectKind: "layer",
    name: "background",
  });

  assert.deepEqual(codes(unknown), ["semantic-role-required"]);
  assert.deepEqual(codes(prohibited), ["FIGMA_NAME_PROHIBITED_SEMANTIC_CATEGORY"]);
  assert.deepEqual(codes(missing), ["semantic-role-required"]);
});

test("validator distinguishes the two asset-owner kinds and requires a preserved existing scale for proposals", async () => {
  const naming = await canonicalNaming();

  assert.deepEqual(
    validateFigmaNameProposal(naming, {
      objectKind: "asset-owner",
      assetOwnerKind: "internal",
      name: "feature-image @2x",
      existingName: "hero-image @2x",
    }),
    [],
  );
  assert.deepEqual(
    validateFigmaNameProposal(naming, {
      objectKind: "asset-owner",
      assetOwnerKind: "component",
      name: "Asset/Feature-Icon @4x",
      existingName: "Asset/Bank-Badge @4x",
    }),
    [],
  );
  assert.deepEqual(
    codes(
      validateFigmaNameProposal(naming, {
        objectKind: "asset-owner",
        assetOwnerKind: "component",
        name: "Asset/Feature-Icon @2x",
        existingName: "Asset/Bank-Badge @4x",
      }),
    ),
    ["FIGMA_NAME_SCALE_SUFFIX_MISMATCH"],
  );
});
