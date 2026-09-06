import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  indexComponentRegistries,
  loadComponentRegistry,
  validateComponentRegistrySemantics,
  validateComponentRegistryShape,
} from "../../scripts/lib/component-registry.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schemaPath = join(repoRoot, "schemas/components.schema.json");
const baselinePath = "registry/email-component-descriptions-registry.md";
const fileKey = "8zka5bHkcrJVK9I9dKjnhC";
const roots = {
  marketing: "538:17236",
  service: "538:17235",
  shared: "539:38025",
};

async function readSchema() {
  return JSON.parse(await readFile(schemaPath, "utf8"));
}

function registryEnvelope(library, components = []) {
  return {
    schema_version: "1.0.0",
    registry: {
      id: `components-${library}`,
      library,
      status: "shadow",
      source: {
        figma_file_key: fileKey,
        roots: [
          {
            role: "library",
            node_id: roots[library],
          },
        ],
        baseline_path: baselinePath,
        baseline_commit: "397e13a916e9af1c2dfd8af663de730bcc2e1874",
        verified_at: "2026-09-06",
      },
    },
    components,
  };
}

function literalFact(id = "gap") {
  return {
    id,
    value: { type: "measure", value: 22, unit: "px" },
    provenance: {
      kind: "registry-literal",
      source_path: baselinePath,
    },
  };
}

function element(id, renderMode, extra = {}) {
  return {
    id,
    semantic_role: id,
    render_mode: renderMode,
    visibility: { mode: "always" },
    facts: [],
    children: [],
    ...extra,
  };
}

function viewportContract() {
  return {
    root: element("root", "presentation-table", {
      semantic_role: "banner",
      facts: [literalFact()],
      children: [
        element("visual", "direct-image", {
          semantic_role: "image",
          asset_contract_id: "visual",
        }),
        element("body", "html-text", {
          semantic_role: "body",
          visibility: {
            mode: "property",
            property_id: "show-body",
          },
        }),
      ],
    }),
  };
}

function validRecord(overrides = {}) {
  return {
    id: "banner-test",
    status: "active",
    identity: {
      figma_name: "Banner/Test",
      node_kind: "component-set",
      library: "marketing",
      semantic_role: "banner",
      category: "test",
    },
    figma: {
      file_key: fileKey,
      node_id: "2000:1",
      source_root_node_id: roots.marketing,
      verified_at: "2026-09-06",
      structure_fingerprint:
        "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    variants: [
      {
        id: "mobile",
        node_id: "2000:2",
        axes: [{ name: "Viewport", value: "Mobile" }],
      },
      {
        id: "desktop",
        node_id: "2000:3",
        axes: [{ name: "Viewport", value: "Desktop" }],
      },
    ],
    properties: [
      {
        id: "show-body",
        figma_name: "Show Body",
        type: "boolean",
        default: true,
      },
    ],
    asset_contracts: [
      {
        id: "visual",
        owner_layer_name: "visual @2x",
        source_viewport: "desktop",
        source_mode_id: "image-fill",
        display_mode_id: "direct-image",
        export_profile_id: "jpeg-2x",
        alpha_mode_id: "none",
        clipping_policy_id: "preserve-artwork",
        export_boundary: {
          kind: "fill",
          semantic_node_name: "visual @2x",
        },
        pixel_dimensions: { width: 464, height: 296, unit: "px" },
        aspect_ratio: { width: 232, height: 148 },
        crop: {
          mode: "figma-fill",
          position_source: "concrete-desktop-instance",
        },
        background: {
          own_visible_boundary_fill: "preserve",
          artificial_matte: "forbid",
        },
      },
    ],
    contracts: {
      mobile: viewportContract(),
      desktop: viewportContract(),
    },
    description: {
      mode: "rendered",
      blocks: [
        { type: "heading", value: "SCOPE" },
        {
          type: "line",
          tokens: [{ type: "text", value: "Контентный блок." }],
        },
      ],
    },
    provenance: {
      baseline_path: baselinePath,
      baseline_heading: "Banner/Test",
      baseline_blob_sha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    },
    ...overrides,
  };
}

function validRegistries() {
  return {
    marketing: registryEnvelope("marketing", [validRecord()]),
    service: registryEnvelope("service"),
    shared: registryEnvelope("shared"),
  };
}

async function foundations() {
  const [typography, spacing, assets] = await Promise.all([
    readStrictYaml(join(repoRoot, "data/foundations/typography.yaml")),
    readStrictYaml(join(repoRoot, "data/foundations/spacing.yaml")),
    readStrictYaml(join(repoRoot, "data/foundations/assets.yaml")),
  ]);
  return { typography, spacing, assets };
}

function diagnosticCodes(errors) {
  return errors.map((error) => error.code);
}

test("strict schema accepts the complete component registry envelope", async () => {
  const schema = await readSchema();
  assert.deepEqual(
    validateComponentRegistryShape(
      registryEnvelope("marketing", [validRecord()]),
      schema,
    ),
    [],
  );
});

test("schema rejects unknown root and nested fields", async () => {
  const schema = await readSchema();
  const document = registryEnvelope("marketing", [validRecord()]);
  document.unexpected = true;
  document.components[0].contracts.mobile.root.unexpected = true;

  const errors = validateComponentRegistryShape(document, schema);
  assert.ok(
    errors.some(
      (error) => error.code === "components-schema" && error.path === "/",
    ),
  );
  assert.ok(
    errors.some(
      (error) =>
        error.code === "components-schema" &&
        error.path === "/components/0/contracts/mobile/root",
    ),
  );
});

test("shape validation rejects an unsupported component registry version", async () => {
  const schema = await readSchema();
  const document = registryEnvelope("marketing", [validRecord()]);
  document.schema_version = "1.1.0";

  const errors = validateComponentRegistryShape(document, schema);
  assert.ok(
    errors.some(
      (error) =>
        error.code === "components-version-unsupported" &&
        error.path === "/schema_version",
    ),
  );
});

test("schema supports every approved fact type and recursive elements", async () => {
  const schema = await readSchema();
  const document = registryEnvelope("marketing", [validRecord()]);
  const facts = [
    { id: "string", value: { type: "string", value: "value" } },
    { id: "boolean", value: { type: "boolean", value: true } },
    { id: "integer", value: { type: "integer", value: 2 } },
    { id: "number", value: { type: "number", value: 1.5 } },
    { id: "keyword", value: { type: "keyword", value: "center" } },
    { id: "measure", value: { type: "measure", value: 22, unit: "px" } },
    {
      id: "dimensions",
      value: { type: "dimensions", width: 296, height: 190, unit: "px" },
    },
    { id: "ratio", value: { type: "ratio", width: 296, height: 190 } },
    { id: "color", value: { type: "color", value: "#F3F3F5" } },
  ].map((fact) => ({
    ...fact,
    provenance: {
      kind: "figma-literal",
      node_id: "2000:2",
    },
  }));
  facts.push(
    {
      id: "typography",
      value: {
        type: "foundation-reference",
        foundation_id: "typography",
        definition_group: "styles",
        definition_id: "mobile-body-large",
      },
    },
    {
      id: "component",
      value: {
        type: "component-reference",
        component_id: "banner-test",
      },
    },
    {
      id: "property",
      value: {
        type: "property-reference",
        property_id: "show-body",
      },
    },
    {
      id: "asset",
      value: {
        type: "asset-reference",
        asset_contract_id: "visual",
      },
    },
  );
  document.components[0].contracts.mobile.root.facts = facts;
  document.components[0].contracts.mobile.root.children[1].children.push(
    element("nested-link", "html-link"),
  );

  assert.deepEqual(validateComponentRegistryShape(document, schema), []);
});

test("schema rejects inheritance and fallback fields", async () => {
  const schema = await readSchema();
  const document = registryEnvelope("marketing", [validRecord()]);
  document.components[0].contracts.mobile.extends = "desktop";
  document.components[0].contracts.desktop.root.fallback_contract = "mobile";

  const errors = validateComponentRegistryShape(document, schema);
  assert.ok(
    errors.some((error) => error.path === "/components/0/contracts/mobile"),
  );
  assert.ok(
    errors.some(
      (error) =>
        error.path === "/components/0/contracts/desktop/root",
    ),
  );
});

test("semantic validation accepts a complete active record", async () => {
  const registries = validRegistries();
  const errors = validateComponentRegistrySemantics({
    registries,
    ...(await foundations()),
  });
  assert.deepEqual(errors, []);

  const index = indexComponentRegistries(registries);
  assert.equal(index.bySystemId.get("banner-test").identity.figma_name, "Banner/Test");
  assert.equal(
    index.byFigmaIdentity.get(`${fileKey}#2000:1`).id,
    "banner-test",
  );
  assert.throws(() => index.bySystemId.set("mutated", validRecord()), TypeError);
});

test("semantic validation reports duplicate identities deterministically", async () => {
  const registries = validRegistries();
  const duplicate = structuredClone(registries.marketing.components[0]);
  duplicate.figma.node_id = "2000:4";
  registries.marketing.components.push(duplicate);

  const sameName = structuredClone(duplicate);
  sameName.id = "service-duplicate";
  sameName.identity.library = "service";
  sameName.figma.node_id = "2000:5";
  sameName.figma.source_root_node_id = roots.service;
  registries.service.components.push(sameName);

  const errors = validateComponentRegistrySemantics({
    registries,
    ...(await foundations()),
  });

  assert.ok(diagnosticCodes(errors).includes("COMPONENT_REGISTRY_DUPLICATE_ID"));
  assert.ok(
    diagnosticCodes(errors).includes("COMPONENT_REGISTRY_DUPLICATE_FIGMA_NAME"),
  );
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

test("semantic validation reports duplicate exact Figma identity", async () => {
  const registries = validRegistries();
  const duplicate = structuredClone(registries.marketing.components[0]);
  duplicate.id = "banner-other";
  duplicate.identity.figma_name = "Banner/Other";
  registries.marketing.components.push(duplicate);

  const errors = validateComponentRegistrySemantics({
    registries,
    ...(await foundations()),
  });
  assert.ok(
    diagnosticCodes(errors).includes(
      "COMPONENT_REGISTRY_DUPLICATE_FIGMA_IDENTITY",
    ),
  );
});

test("semantic validation rejects library and source-root mismatch", async () => {
  const registries = validRegistries();
  const record = registries.marketing.components[0];
  record.identity.library = "service";
  record.figma.source_root_node_id = roots.service;

  const errors = validateComponentRegistrySemantics({
    registries,
    ...(await foundations()),
  });
  assert.ok(
    diagnosticCodes(errors).includes("COMPONENT_REGISTRY_LIBRARY_MISMATCH"),
  );
  assert.ok(
    diagnosticCodes(errors).includes("COMPONENT_REGISTRY_ROOT_MISMATCH"),
  );
});

test("active viewports are complete and cannot contain inheritance keys", async () => {
  const registries = validRegistries();
  delete registries.marketing.components[0].contracts.mobile;
  registries.marketing.components[0].contracts.desktop.root.extends =
    "mobile-root";

  const errors = validateComponentRegistrySemantics({
    registries,
    ...(await foundations()),
  });
  assert.ok(
    diagnosticCodes(errors).includes("COMPONENT_REGISTRY_INCOMPLETE_VIEWPORT"),
  );
});

test("unknown property, component and local asset references are blockers", async () => {
  const registries = validRegistries();
  const root = registries.marketing.components[0].contracts.mobile.root;
  root.children[1].visibility.property_id = "show-missing";
  root.children.push(
    element("nested", "nested-component", {
      component_id: "missing-component",
    }),
    element("missing-image", "direct-image", {
      asset_contract_id: "missing-asset",
    }),
  );

  const errors = validateComponentRegistrySemantics({
    registries,
    ...(await foundations()),
  });
  assert.ok(
    diagnosticCodes(errors).includes("COMPONENT_REGISTRY_UNKNOWN_PROPERTY"),
  );
  assert.ok(
    diagnosticCodes(errors).includes(
      "COMPONENT_REGISTRY_UNKNOWN_COMPONENT_REFERENCE",
    ),
  );
  assert.ok(
    diagnosticCodes(errors).includes("COMPONENT_REGISTRY_UNKNOWN_ASSET_REFERENCE"),
  );
});

test("unknown foundation references and incompatible assets are blockers", async () => {
  const registries = validRegistries();
  const record = registries.marketing.components[0];
  record.contracts.mobile.root.facts.push(
    {
      id: "unknown-type",
      value: {
        type: "foundation-reference",
        foundation_id: "typography",
        definition_group: "styles",
        definition_id: "missing-style",
      },
    },
    {
      id: "unknown-space",
      value: {
        type: "foundation-reference",
        foundation_id: "spacing",
        definition_group: "roles",
        definition_id: "missing-role",
      },
    },
  );
  record.asset_contracts[0].alpha_mode_id = "transparent";

  const errors = validateComponentRegistrySemantics({
    registries,
    ...(await foundations()),
  });
  assert.ok(
    diagnosticCodes(errors).includes(
      "COMPONENT_REGISTRY_UNKNOWN_TYPOGRAPHY_REFERENCE",
    ),
  );
  assert.ok(
    diagnosticCodes(errors).includes(
      "COMPONENT_REGISTRY_UNKNOWN_SPACING_REFERENCE",
    ),
  );
  assert.ok(
    diagnosticCodes(errors).includes("COMPONENT_REGISTRY_ASSET_INCOMPATIBLE"),
  );
});

test("semantic validation rejects an invalid structure fingerprint", async () => {
  const registries = validRegistries();
  registries.marketing.components[0].figma.structure_fingerprint = "sha256:nope";

  const errors = validateComponentRegistrySemantics({
    registries,
    ...(await foundations()),
  });
  assert.ok(
    diagnosticCodes(errors).includes("COMPONENT_REGISTRY_FINGERPRINT_INVALID"),
  );
});


const expectedMarketingRecords = [
  ["badge-step-number", "Badge/Step-Number", "18:2948"],
  ["email-header", "Email/Header", "326:5159"],
  ["block-cards-images", "Block/Cards-Images", "326:5806"],
  ["block-icon-cards", "Block/Icon-Cards", "326:6342"],
  ["email-footer", "Email/Footer", "333:7477"],
  ["banner-hero", "Banner/Hero", "337:4460"],
  ["block-steps", "Block/Steps", "337:4491"],
  ["button-secondary", "Button/Secondary", "337:4710"],
  ["button-primary", "Button/Primary", "337:4713"],
  ["block-content", "Block/Content", "337:4766"],
  ["banner-secondary", "Banner/Secondary", "337:4870"],
  ["block-bullet-list", "Block/Bullet-List", "337:4898"],
  ["item-bullet", "Item/Bullet", "337:4958"],
  ["item-step", "Item/Step", "337:5039"],
  ["banner-inline", "Banner/Inline", "337:5040"],
  ["block-info-alert", "Block/Info-Alert", "337:5041"],
  ["banner-app-download", "Banner/App-Download", "337:6569"],
  ["email-footer-legal", "Email/Footer-Legal", "499:2431"],
  ["asset-card-image-2x", "Asset/Card-Image @2x", "911:3992"],
  ["card-image", "Card/Image", "911:4132"],
  ["block-icon-list", "Block/Icon-List", "946:26516"],
  ["card-icon", "Card/Icon", "326:5580"],
  ["asset-feature-icon-4x", "Asset/Feature-Icon @4x", "946:25769"],
  ["item-alert", "Item/Alert", "1024:19226"],
  ["item-notification", "Item/Notification", "1024:19285"],
  ["nps-options", "NPS/Options", "1084:16995"],
];

function marketingBaselineDescriptions(markdown) {
  const start = markdown.indexOf("## Маркетинговые письма (26)");
  const end = markdown.indexOf("## Шаблоны сборки (1)");
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const entries = new Map();
  const section = `${markdown.slice(start, end)}\n## END`;
  const pattern = /^### \`([^\`]+)\`\n([\s\S]*?)(?=^### \`|^## )/gmu;
  for (const match of section.matchAll(pattern)) {
    const description = match[2].match(
      /Описание:\n\n\`\`\`\`text\n([\s\S]*?)\n\`\`\`\`/mu,
    )?.[1];
    assert.notEqual(description, undefined, `Missing baseline Description: ${match[1]}`);
    entries.set(match[1], `${description.replace(/\r\n/gu, "\n")}\n`);
  }
  return entries;
}

function findAssetElement(element, assetContractId) {
  if (element.asset_contract_id === assetContractId) {
    return element;
  }
  for (const child of element.children ?? []) {
    const found = findAssetElement(child, assetContractId);
    if (found) {
      return found;
    }
  }
  return null;
}

test("marketing shadow preserves all 26 records and their baseline descriptions", async () => {
  const [registry, markdown, { renderComponentDescription }] = await Promise.all([
    loadComponentRegistry({
      repoRoot,
      dataPath: "data/components/marketing.yaml",
    }),
    readFile(join(repoRoot, baselinePath), "utf8"),
    import("../../scripts/lib/component-description.mjs"),
  ]);
  const emptyService = registryEnvelope("service");
  const emptyShared = registryEnvelope("shared");
  const index = indexComponentRegistries({
    marketing: registry,
    service: emptyService,
    shared: emptyShared,
  });
  const descriptions = marketingBaselineDescriptions(markdown);
  assert.deepEqual(
    registry.components.map((record) => [
      record.id,
      record.identity.figma_name,
      record.figma.node_id,
    ]),
    expectedMarketingRecords,
  );
  for (const record of registry.components) {
    assert.ok(record.contracts.mobile.root, `${record.id} needs a Mobile contract`);
    assert.ok(record.contracts.desktop.root, `${record.id} needs a Desktop contract`);
    assert.equal(
      renderComponentDescription(record, index),
      descriptions.get(record.identity.figma_name),
      `Rendered Description drift: ${record.identity.figma_name}`,
    );
  }
});

test("marketing image contracts preserve responsive ratios and export boundaries", async () => {
  const registry = await loadComponentRegistry({
    repoRoot,
    dataPath: "data/components/marketing.yaml",
  });
  const byId = new Map(registry.components.map((record) => [record.id, record]));

  const hero = byId.get("banner-hero");
  const heroAsset = hero.asset_contracts.find((asset) => asset.id === "hero-image");
  assert.deepEqual(
    {
      source: heroAsset.source_mode_id,
      display: heroAsset.display_mode_id,
      profile: heroAsset.export_profile_id,
      pixels: heroAsset.pixel_dimensions,
      ratio: heroAsset.aspect_ratio,
    },
    {
      source: "image-fill",
      display: "direct-image",
      profile: "jpeg-2x",
      pixels: { width: 1104, height: 706, unit: "px" },
      ratio: { width: 552, height: 353 },
    },
  );
  assert.equal(
    hero.contracts.mobile.root.facts.find((fact) => fact.id === "height-behavior").value.value,
    "auto",
  );
  assert.equal(
    hero.contracts.mobile.root.facts.find((fact) => fact.id === "fixed-height-forbidden").value.value,
    true,
  );

  const secondary = byId.get("banner-secondary");
  const secondaryAsset = secondary.asset_contracts.find(
    (asset) => asset.id === "secondary-image",
  );
  assert.equal(secondaryAsset.source_mode_id, "image-fill");
  assert.equal(secondaryAsset.display_mode_id, "fill-image");
  assert.deepEqual(secondaryAsset.aspect_ratio, { width: 296, height: 188 });
  assert.equal(
    findAssetElement(secondary.contracts.mobile.root, "secondary-image").render_mode,
    "direct-image",
  );
  assert.equal(
    findAssetElement(secondary.contracts.desktop.root, "secondary-image").render_mode,
    "background-image",
  );

  const card = byId.get("card-image");
  const cardAsset = card.asset_contracts.find((asset) => asset.id === "card-image");
  assert.deepEqual(
    {
      source: cardAsset.source_mode_id,
      display: cardAsset.display_mode_id,
      profile: cardAsset.export_profile_id,
      pixels: cardAsset.pixel_dimensions,
      ratio: cardAsset.aspect_ratio,
    },
    {
      source: "rendered-node",
      display: "direct-image",
      profile: "jpeg-2x",
      pixels: { width: 464, height: 296, unit: "px" },
      ratio: { width: 232, height: 148 },
    },
  );
  assert.equal(
    card.contracts.mobile.root.facts.find((fact) => fact.id === "height-behavior").value.value,
    "auto",
  );
});
