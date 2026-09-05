import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadFigmaNamingFoundation } from "../../scripts/lib/figma-naming-foundation.mjs";
import { generateFigmaName } from "../../scripts/lib/figma-name-generator.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function canonicalNaming() {
  return loadFigmaNamingFoundation({ repoRoot });
}

test("generates a component from confirmed semantics", async () => {
  const naming = await canonicalNaming();

  assert.deepEqual(
    generateFigmaName(naming, {
      objectKind: "component",
      namespaceId: "block",
      semanticTokens: ["cards", "icons"],
    }),
    {
      status: "generated",
      object_kind: "component",
      name: "Block/Cards-Icons",
      applied_rule_ids: [
        "component-pattern",
        "namespace-block",
        "title-kebab",
      ],
    },
  );
});

for (const [request, expected] of [
  [
    {
      objectKind: "layer",
      roleId: "items",
      repeatIndex: 1,
    },
    "items-01",
  ],
  [
    {
      objectKind: "layer",
      roleId: "content-area",
      qualifierTokens: ["compact"],
    },
    "content-area-compact",
  ],
  [
    {
      objectKind: "property",
      propertyKind: "boolean",
      roleTokens: ["caption"],
    },
    "Show Caption",
  ],
  [
    {
      objectKind: "property",
      propertyKind: "text",
      roleTokens: ["supporting", "text"],
    },
    "Supporting Text",
  ],
  [
    {
      objectKind: "property",
      propertyKind: "instance-swap",
      roleTokens: ["icon"],
    },
    "Icon",
  ],
  [
    {
      objectKind: "property",
      propertyKind: "variant-axis",
      axisId: "viewport",
    },
    "Viewport",
  ],
  [
    {
      objectKind: "asset-owner",
      semanticTokens: ["feature", "image"],
      currentScale: 4,
    },
    "feature-image @4x",
  ],
  [
    {
      objectKind: "page",
      semanticTokens: ["email", "components"],
    },
    "Email Components",
  ],
  [
    {
      objectKind: "section",
      semanticTokens: ["shared"],
    },
    "Shared",
  ],
  [
    {
      objectKind: "example",
      familyTokens: ["cards"],
      semanticTokens: ["vacancy"],
      viewportValue: "Mobile",
    },
    "Example · Cards · Vacancy · Mobile",
  ],
]) {
  test("generates exactly one approved name: " + expected, async () => {
    const naming = await canonicalNaming();
    const result = generateFigmaName(naming, request);

    assert.equal(result.status, "generated");
    assert.equal(result.name, expected);
    assert.equal(result.object_kind, request.objectKind);
    assert.ok(result.applied_rule_ids.length > 0);
  });
}

test("blocks instead of guessing missing semantics", async () => {
  const naming = await canonicalNaming();
  const result = generateFigmaName(naming, {
    objectKind: "component",
    namespaceId: "block",
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.error.code, "semantic-role-required");
  assert.equal(result.error.path, "/request/semanticTokens");
});

test("blocks an unknown namespace", async () => {
  const naming = await canonicalNaming();
  const result = generateFigmaName(naming, {
    objectKind: "component",
    namespaceId: "unknown",
    semanticTokens: ["cards"],
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.error.code, "FIGMA_NAME_UNKNOWN_NAMESPACE");
});

test("blocks unsupported or attempted asset scale mutation", async () => {
  const naming = await canonicalNaming();

  const unsupported = generateFigmaName(naming, {
    objectKind: "asset-owner",
    semanticTokens: ["feature", "image"],
    currentScale: 3,
  });
  assert.equal(unsupported.status, "blocked");
  assert.equal(
    unsupported.error.code,
    "FIGMA_NAME_SCALE_SUFFIX_REQUIRED",
  );

  const mutation = generateFigmaName(naming, {
    objectKind: "asset-owner",
    semanticTokens: ["feature", "image"],
    currentScale: 4,
    targetScale: 2,
  });
  assert.equal(mutation.status, "blocked");
  assert.equal(
    mutation.error.code,
    "FIGMA_NAME_SCALE_SUFFIX_MISMATCH",
  );
});

test("generator does not mutate its inputs", async () => {
  const naming = await canonicalNaming();
  const request = {
    objectKind: "component",
    namespaceId: "block",
    semanticTokens: ["cards", "icons"],
  };
  const beforeNaming = structuredClone(naming);
  const beforeRequest = structuredClone(request);

  generateFigmaName(naming, request);

  assert.deepEqual(naming, beforeNaming);
  assert.deepEqual(request, beforeRequest);
});

test("generator and validator source contain no I/O or mutation imports", async () => {
  const sources = await Promise.all(
    ["figma-name-generator.mjs", "figma-name-validator.mjs"].map((name) =>
      readFile(join(repoRoot, "scripts/lib", name), "utf8"),
    ),
  );
  const forbidden = [
    "node:fs",
    "node:child_process",
    "node:http",
    "node:https",
    "figma",
    "github",
  ];

  for (const source of sources) {
    for (const importName of forbidden) {
      assert.doesNotMatch(
        source,
        new RegExp("from [\"']" + importName, "u"),
      );
    }
  }
});
