import test from "node:test";
import assert from "node:assert/strict";

import {
  renderComponentDescription,
  validateDescriptionModel,
} from "../../scripts/lib/component-description.mjs";
import { indexComponentRegistries } from "../../scripts/lib/component-registry.mjs";

function element(id, extra = {}) {
  return {
    id,
    semantic_role: id,
    render_mode: "html-text",
    visibility: { mode: "always" },
    facts: [],
    children: [],
    ...extra,
  };
}

function record({
  id = "block-test",
  figmaName = "Block/Test",
  description,
} = {}) {
  return {
    id,
    status: "active",
    identity: {
      figma_name: figmaName,
      node_kind: "component",
      library: "marketing",
      semantic_role: "block",
      category: "test",
    },
    figma: {
      file_key: "8zka5bHkcrJVK9I9dKjnhC",
      node_id: id === "block-test" ? "3000:1" : "3000:2",
      source_root_node_id: "538:17236",
      verified_at: "2026-09-06",
      structure_fingerprint:
        "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    variants: [],
    properties: [
      {
        id: "show-body",
        figma_name: "Show Body",
        type: "boolean",
        default: true,
      },
    ],
    asset_contracts: [],
    contracts: {
      mobile: {
        root: element("root", {
          semantic_role: "block",
          render_mode: "presentation-table",
          facts: [
            {
              id: "padding",
              value: { type: "measure", value: 22, unit: "px" },
              provenance: {
                kind: "registry-literal",
                source_path: "registry/email-component-descriptions-registry.md",
              },
            },
            {
              id: "size",
              value: {
                type: "dimensions",
                width: 252,
                height: 148,
                unit: "px",
              },
              provenance: {
                kind: "figma-literal",
                node_id: "3000:1",
              },
            },
          ],
          children: [
            element("body", {
              visibility: {
                mode: "property",
                property_id: "show-body",
              },
            }),
          ],
        }),
      },
      desktop: {
        root: element("root", {
          semantic_role: "block",
          render_mode: "presentation-table",
          facts: [
            {
              id: "padding",
              value: { type: "measure", value: 32, unit: "px" },
              provenance: {
                kind: "registry-literal",
                source_path: "registry/email-component-descriptions-registry.md",
              },
            },
          ],
        }),
      },
    },
    description:
      description ?? {
        mode: "rendered",
        blocks: [
          { type: "heading", value: "IMPLEMENTATION" },
          {
            type: "line",
            tokens: [
              { type: "text", value: "Mobile padding: " },
              { type: "fact", path: "mobile/root/padding" },
              { type: "text", value: "." },
            ],
          },
          { type: "blank" },
          {
            type: "bullet",
            tokens: [
              {
                type: "component-name",
                component_id: "button-secondary",
              },
              { type: "text", value: " остаётся HTML." },
            ],
          },
          {
            type: "ordered",
            index: 1,
            tokens: [
              { type: "property-name", property_id: "show-body" },
              { type: "text", value: " управляет видимостью." },
            ],
          },
          {
            type: "line",
            tokens: [
              { type: "text", value: "Размер: " },
              { type: "fact", path: "mobile/root/size" },
              { type: "text", value: "." },
            ],
          },
        ],
      },
    provenance: {
      baseline_path: "registry/email-component-descriptions-registry.md",
      baseline_heading: figmaName,
      baseline_blob_sha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    },
  };
}

function registry(records) {
  return {
    schema_version: "1.0.0",
    registry: {
      id: "components-marketing",
      library: "marketing",
      status: "shadow",
      source: {
        figma_file_key: "8zka5bHkcrJVK9I9dKjnhC",
        roots: [{ role: "library", node_id: "538:17236" }],
        baseline_path: "registry/email-component-descriptions-registry.md",
        baseline_commit: "397e13a916e9af1c2dfd8af663de730bcc2e1874",
        verified_at: "2026-09-06",
      },
    },
    components: records,
  };
}

function descriptionIndex(target = record()) {
  const secondary = record({
    id: "button-secondary",
    figmaName: "Button/Secondary",
    description: {
      mode: "rendered",
      blocks: [
        { type: "heading", value: "SCOPE" },
        {
          type: "line",
          tokens: [{ type: "text", value: "Вторичная кнопка." }],
        },
      ],
    },
  });
  return indexComponentRegistries({
    marketing: registry([target, secondary]),
    service: {
      ...registry([]),
      registry: {
        ...registry([]).registry,
        id: "components-service",
        library: "service",
        source: {
          ...registry([]).registry.source,
          roots: [{ role: "library", node_id: "538:17235" }],
        },
      },
    },
    shared: {
      ...registry([]),
      registry: {
        ...registry([]).registry,
        id: "components-shared",
        library: "shared",
        source: {
          ...registry([]).registry.source,
          roots: [{ role: "library", node_id: "539:38025" }],
        },
      },
    },
  });
}

function codes(errors) {
  return errors.map((error) => error.code);
}

test("renderer produces one deterministic LF-normalized Description", () => {
  const target = record();
  const index = descriptionIndex(target);

  assert.equal(
    renderComponentDescription(target, index),
    [
      "Block/Test",
      "",
      "IMPLEMENTATION",
      "Mobile padding: 22px.",
      "",
      "— Button/Secondary остаётся HTML.",
      "1. Show Body управляет видимостью.",
      "Размер: 252×148px.",
      "",
    ].join("\n"),
  );
  assert.deepEqual(validateDescriptionModel(target, index), []);
});

test("description mode none returns null and forbids rendered blocks", () => {
  const target = record({
    description: {
      mode: "none",
      reason: "nested-figma-glyph-without-independent-email-contract",
    },
  });
  assert.equal(renderComponentDescription(target, descriptionIndex(target)), null);

  target.description.blocks = [{ type: "blank" }];
  assert.ok(
    codes(validateDescriptionModel(target, descriptionIndex(target))).includes(
      "COMPONENT_REGISTRY_DESCRIPTION_REFERENCE",
    ),
  );
});

for (const [name, mutate] of [
  [
    "unknown fact path",
    (target) => {
      target.description.blocks[1].tokens[1].path = "mobile/root/missing";
    },
  ],
  [
    "unknown component token",
    (target) => {
      target.description.blocks[3].tokens[0].component_id = "button-missing";
    },
  ],
  [
    "unknown property token",
    (target) => {
      target.description.blocks[4].tokens[0].property_id = "show-missing";
    },
  ],
]) {
  test(`description validation rejects ${name}`, () => {
    const target = record();
    mutate(target);
    const errors = validateDescriptionModel(target, descriptionIndex(target));
    assert.ok(
      codes(errors).includes("COMPONENT_REGISTRY_DESCRIPTION_REFERENCE"),
    );
  });
}

for (const duplicatedText of [
  "Использовать padding 22px.",
  "Цвет #F3F3F5.",
  "Экспортировать @2x.",
  "Размер 252×148px.",
  "Использовать Button/Secondary.",
  "Свойство Show Body включено.",
]) {
  test(`plain text cannot duplicate exact fact: ${duplicatedText}`, () => {
    const target = record();
    target.description.blocks.push({
      type: "line",
      tokens: [{ type: "text", value: duplicatedText }],
    });

    const errors = validateDescriptionModel(target, descriptionIndex(target));
    assert.ok(
      codes(errors).includes(
        "COMPONENT_REGISTRY_DESCRIPTION_LITERAL_DUPLICATE",
      ),
    );
  });
}

test("renderer refuses an unresolved token instead of guessing", () => {
  const target = record();
  target.description.blocks[1].tokens[1].path = "desktop/root/missing";
  const index = descriptionIndex(target);

  assert.throws(
    () => renderComponentDescription(target, index),
    (error) => error.code === "COMPONENT_REGISTRY_DESCRIPTION_REFERENCE",
  );
});

test("description diagnostics are sorted deterministically", () => {
  const target = record();
  target.description.blocks.push(
    {
      type: "line",
      tokens: [{ type: "text", value: "Цвет #F3F3F5." }],
    },
    {
      type: "line",
      tokens: [{ type: "component-name", component_id: "missing" }],
    },
  );

  const errors = validateDescriptionModel(target, descriptionIndex(target));
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
