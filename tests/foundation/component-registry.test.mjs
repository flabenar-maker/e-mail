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

function baselineDescriptions(markdown, startHeading, endHeading) {
  const start = markdown.indexOf(startHeading);
  const end = endHeading ? markdown.indexOf(endHeading) : markdown.length;
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const entries = new Map();
  const section = `${markdown.slice(start, end)}\n## END`;
  const pattern = /^### `([^`]+)`\n([\s\S]*?)(?=^### `|^## )/gmu;
  for (const match of section.matchAll(pattern)) {
    const description = match[2].match(
      /Описание:\n\n````text\n([\s\S]*?)\n````/mu,
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
  const descriptions = baselineDescriptions(
    markdown,
    "## Маркетинговые письма (26)",
    "## Шаблоны сборки (1)",
  );
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


const expectedServiceRecords = [
  ["block-transaction-success", "Block/Transaction-Success", "459:29177"],
  ["block-transaction-error", "Block/Transaction-Error", "459:30151"],
  ["block-contact-support", "Block/Contact-Support", "472:16999"],
  ["asset-bank-badge-4x", "Asset/Bank-Badge @4x", "481:19664"],
  ["asset-partner-badge-4x", "Asset/Partner-Badge @4x", "481:19665"],
  ["asset-icon-badge-4x", "Asset/Icon-Badge @4x", "484:20039"],
  ["details-transfer", "Details/Transfer", "484:20761"],
  ["asset-status-badge-positive-4x", "Asset/Status-Badge-Positive @4x", "491:22074"],
  ["asset-status-badge-negative-4x", "Asset/Status-Badge-Negative @4x", "491:22178"],
  ["details-suspicious-operation", "Details/Suspicious-Operation", "497:25955"],
  ["block-personal-data-update", "Block/Personal-Data-Update", "497:26055"],
  ["details-operation-plain", "Details/Operation-Plain", "497:26103"],
  ["details-receipt", "Details/Receipt", "502:24640"],
  ["block-receipt-info", "Block/Receipt-Info", "502:24695"],
  ["banner-fiscal-check-link", "Banner/Fiscal-Check-Link", "502:25048"],
  ["block-instruction-steps", "Block/Instruction-Steps", "510:16701"],
  ["details-operation", "Details/Operation", "477:21327"],
  ["badge-operation-status", "Badge/Operation-Status", "1084:16996"],
];

function nestedComponentIds(element, result = []) {
  if (element.component_id) {
    result.push(element.component_id);
  }
  for (const child of element.children ?? []) {
    nestedComponentIds(child, result);
  }
  return result;
}

test("service shadow preserves all 18 records and their baseline descriptions", async () => {
  const [registry, markdown, { renderComponentDescription }] = await Promise.all([
    loadComponentRegistry({
      repoRoot,
      dataPath: "data/components/service.yaml",
    }),
    readFile(join(repoRoot, baselinePath), "utf8"),
    import("../../scripts/lib/component-description.mjs"),
  ]);
  const index = indexComponentRegistries({
    marketing: registryEnvelope("marketing"),
    service: registry,
    shared: registryEnvelope("shared"),
  });
  const descriptions = baselineDescriptions(
    markdown,
    "## Сервисные письма (18)",
    "## Shared (16)",
  );
  assert.deepEqual(
    registry.components.map((record) => [
      record.id,
      record.identity.figma_name,
      record.figma.node_id,
    ]),
    expectedServiceRecords,
  );
  for (const record of registry.components) {
    assert.ok(record.contracts.mobile.root, record.id + " needs a Mobile contract");
    assert.ok(record.contracts.desktop.root, record.id + " needs a Desktop contract");
    assert.equal(
      renderComponentDescription(record, index),
      descriptions.get(record.identity.figma_name),
      "Rendered Description drift: " + record.identity.figma_name,
    );
  }
});

test("service records retain nested Details links and exact badge assets", async () => {
  const registry = await loadComponentRegistry({
    repoRoot,
    dataPath: "data/components/service.yaml",
  });
  const byId = new Map(registry.components.map((record) => [record.id, record]));

  assert.ok(
    nestedComponentIds(byId.get("block-transaction-success").contracts.desktop.root)
      .includes("details-operation"),
  );
  assert.ok(
    nestedComponentIds(byId.get("block-personal-data-update").contracts.desktop.root)
      .includes("details-suspicious-operation"),
  );
  assert.ok(
    nestedComponentIds(byId.get("block-receipt-info").contracts.desktop.root)
      .includes("details-receipt"),
  );

  const partner = byId.get("block-transaction-success").asset_contracts.find(
    (asset) => asset.id === "partner-badge",
  );
  assert.deepEqual(
    {
      source: partner.source_mode_id,
      profile: partner.export_profile_id,
      pixels: partner.pixel_dimensions,
      ratio: partner.aspect_ratio,
    },
    {
      source: "rendered-node",
      profile: "png-4x",
      pixels: { width: 288, height: 288, unit: "px" },
      ratio: { width: 72, height: 72 },
    },
  );

  const fiscal = byId.get("banner-fiscal-check-link");
  assert.deepEqual(
    fiscal.asset_contracts.map((asset) => [
      asset.id,
      asset.owner_layer_name,
      asset.pixel_dimensions,
    ]),
    [
      ["bank-badge", "bank-badge @4x", { width: 192, height: 192, unit: "px" }],
      ["chevron-icon", "chevron-icon @4x", { width: 96, height: 96, unit: "px" }],
    ],
  );
});


const expectedSharedRecords = [
  ["email-template", "Email/Template", "1102:8"],
  ["asset-product-logo", "Asset/Product-Logo", "1008:874"],
  ["asset-header-logo-4x", "Asset/Header-Logo @4x", "1008:1476"],
  ["asset-header-logo-compact-4x", "Asset/Header-Logo-Compact @4x", "1008:1708"],
  ["icon-bank-card-2-line", "Icon/Bank-Card-2-Line", "1009:2505"],
  ["icon-fingerprint-2-line", "Icon/Fingerprint-2-Line", "491:22370"],
  ["icon-gift-2-line", "Icon/Gift-2-Line", "946:25576"],
  ["icon-global-line", "Icon/Global-Line", "1009:2506"],
  ["icon-lock-password-fill", "Icon/Lock-Password-Fill", "491:22369"],
  ["icon-mail-fill", "Icon/Mail-Fill", "491:22372"],
  ["icon-mir-logo", "Icon/MIR-Logo", "946:25485"],
  ["icon-receipt-fill", "Icon/Receipt-Fill", "491:22374"],
  ["icon-shopping-basket-2-line", "Icon/Shopping-Basket-2-Line", "946:25480"],
  ["icon-smartphone-fill", "Icon/Smartphone-Fill", "491:22371"],
  ["icon-user-follow-fill", "Icon/User-Follow-Fill", "491:22375"],
  ["icon-user-forbid-fill", "Icon/User-Forbid-Fill", "491:22373"],
  ["icon-user-unfollow-fill", "Icon/User-Unfollow-Fill", "491:22376"],
];

test("shared shadow contains the root template, three assets, and 13 glyph sources", async () => {
  const [marketing, service, shared, markdown, { renderComponentDescription }] =
    await Promise.all([
      loadComponentRegistry({ repoRoot, dataPath: "data/components/marketing.yaml" }),
      loadComponentRegistry({ repoRoot, dataPath: "data/components/service.yaml" }),
      loadComponentRegistry({ repoRoot, dataPath: "data/components/shared.yaml" }),
      readFile(join(repoRoot, baselinePath), "utf8"),
      import("../../scripts/lib/component-description.mjs"),
    ]);
  const index = indexComponentRegistries({ marketing, service, shared });
  assert.deepEqual(
    shared.components.map((record) => [
      record.id,
      record.identity.figma_name,
      record.figma.node_id,
    ]),
    expectedSharedRecords,
  );
  assert.equal(
    shared.components.filter((record) => record.description.mode === "none").length,
    13,
  );

  const descriptions = new Map([
    ...baselineDescriptions(
      markdown,
      "## Шаблоны сборки (1)",
      "## Сервисные письма (18)",
    ),
    ...baselineDescriptions(markdown, "## Shared (16)", null),
  ]);
  for (const record of shared.components.filter(
    (candidate) => candidate.description.mode === "rendered",
  )) {
    assert.equal(
      renderComponentDescription(record, index),
      descriptions.get(record.identity.figma_name),
      "Rendered Description drift: " + record.identity.figma_name,
    );
  }
});

test("Email Template remains an assembly root and Shared export roles stay explicit", async () => {
  const shared = await loadComponentRegistry({
    repoRoot,
    dataPath: "data/components/shared.yaml",
  });
  const byId = new Map(shared.components.map((record) => [record.id, record]));
  const template = byId.get("email-template");
  assert.deepEqual(template.properties, [
    { id: "content", figma_name: "Content", type: "slot", default: null },
  ]);
  assert.equal(template.contracts.mobile.root.children[0].render_mode, "slot");
  assert.equal(template.contracts.mobile.root.children[0].semantic_role, "content");
  assert.equal(template.contracts.desktop.root.children[0].render_mode, "slot");
  assert.deepEqual(template.asset_contracts, []);

  const header = byId.get("asset-header-logo-4x");
  assert.deepEqual(
    header.asset_contracts.map((asset) => ({
      owner: asset.owner_layer_name,
      source: asset.source_mode_id,
      profile: asset.export_profile_id,
      pixels: asset.pixel_dimensions,
      ratio: asset.aspect_ratio,
    })),
    [{
      owner: "header-logo @4x",
      source: "rendered-node",
      profile: "png-4x",
      pixels: { width: 1288, height: 200, unit: "px" },
      ratio: { width: 322, height: 50 },
    }],
  );
  assert.equal(
    byId.get("asset-header-logo-compact-4x").contracts.mobile.root.render_mode,
    "figma-source-only",
  );
  for (const record of shared.components.filter(
    (candidate) => candidate.identity.semantic_role === "icon",
  )) {
    assert.equal(record.contracts.mobile.root.render_mode, "figma-source-only");
    assert.equal(record.contracts.desktop.root.render_mode, "figma-source-only");
    assert.deepEqual(record.asset_contracts, []);
  }
});
