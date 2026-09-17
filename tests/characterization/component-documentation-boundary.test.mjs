import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  indexComponentRegistries,
  loadComponentRegistries,
} from "../../scripts/lib/component-registry.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function read(relativePath) {
  return readFile(join(repoRoot, relativePath), "utf8");
}

function sortJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map(sortJsonValue);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortJsonValue(value[key])]),
    );
  }
  return value;
}

function projectMigrationSignificantFields(record) {
  return {
    id: record.id,
    status: record.status,
    identity: record.identity,
    figma: record.figma,
    variants: record.variants,
    properties: record.properties,
    asset_contracts: record.asset_contracts,
    contracts: record.contracts,
    provenance: record.provenance,
  };
}

function digest(value) {
  return `sha256:${createHash("sha256")
    .update(JSON.stringify(sortJsonValue(value)), "utf8")
    .digest("hex")}`;
}

function findElement(element, predicate) {
  if (predicate(element)) {
    return element;
  }
  for (const child of element.children ?? []) {
    const found = findElement(child, predicate);
    if (found) {
      return found;
    }
  }
  return null;
}

function findFact(record, viewport, factId) {
  const element = findElement(
    record.contracts[viewport].root,
    (candidate) => (candidate.facts ?? []).some((fact) => fact.id === factId),
  );
  return element?.facts.find((fact) => fact.id === factId)?.value;
}

test("component documentation standards keep the full contract and Figma projection separate", async () => {
  const [contractStandard, figmaStandard] = await Promise.all([
    read("core/component-contract-standard.md"),
    read("core/figma-component-description-standard.md"),
  ]);

  assert.match(contractStandard, /structured component contract/u);
  assert.match(contractStandard, /Mobile[^\n]*Desktop|Desktop[^\n]*Mobile/u);
  assert.match(contractStandard, /не дублиру/u);
  assert.match(contractStandard, /purpose/u);
  assert.match(contractStandard, /foundation references/u);
  assert.match(contractStandard, /asset contracts/u);
  assert.match(contractStandard, /onboarding/u);

  assert.match(figmaStandard, /CUPIS ID/u);
  assert.match(figmaStandard, /PURPOSE/u);
  assert.match(figmaStandard, /RENDER/u);
  assert.match(figmaStandard, /CRITICAL/u);
  assert.match(figmaStandard, /не является[^\n]*HTML/u);
  assert.match(figmaStandard, /Documentation link/u);

  assert.doesNotMatch(
    figmaStandard,
    /полны(?:й|е) (?:таблиц|секци)[^\n]*(?:typography|spacing)/iu,
  );
  assert.doesNotMatch(figmaStandard, /весь email workflow/u);
});

test("direct Figma source capture preserves shared and service registries and marks marketing verification", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const projected = Object.fromEntries(
    Object.entries(registries).map(([library, document]) => [
      library,
      document.components.map(projectMigrationSignificantFields),
    ]),
  );
  const allRecords = Object.values(projected).flat();
  const systemIds = allRecords.map((record) => record.id);
  const figmaIdentities = allRecords.map(
    (record) => `${record.figma.file_key}#${record.figma.node_id}`,
  );

  assert.deepEqual(
    Object.fromEntries(
      Object.entries(projected).map(([library, records]) => [
        library,
        records.length,
      ]),
    ),
    { shared: 17, marketing: 26, service: 18 },
  );
  assert.equal(allRecords.length, 61);
  assert.equal(new Set(systemIds).size, 61);
  assert.equal(new Set(figmaIdentities).size, 61);

  assert.equal(
    digest(projected.shared),
    "sha256:352dbe44834ff570012af0e46cc6adb8a2f00e08aedc59cac44ee7f744e6c08d",
  );
  assert.equal(
    digest(projected.service),
    "sha256:a85eee27bb2b1bbc13b4e19dfa21c23e382ef9a676e4eb0b4c94326f905f98ba",
  );

  const blocked = projected.marketing
    .filter((record) => record.figma.verification.status === "blocked-ambiguous-description")
    .map((record) => record.id)
    .sort();
  assert.deepEqual(blocked, []);
  const recorded = projected.marketing.filter(
    (record) => record.figma.verification.status === "figma-source-recorded",
  );
  assert.equal(recorded.length, 26);
  assert.equal(recorded.reduce((total, record) => total + record.contracts.source_variants.length, 0), 55);
  for (const record of recorded) {
    assert.deepEqual(
      record.contracts.source_variants.map(({ variant_node_id }) => variant_node_id).sort(),
      (record.variants.length > 0 ? record.variants.map(({ node_id }) => node_id) : [record.figma.node_id]).sort(),
    );
  }
  const primary = projected.marketing.find((record) => record.id === "button-primary");
  for (const viewport of ["mobile", "desktop"]) {
    assert.deepEqual(findFact(primary, viewport, "background-gradient-css-angle-degrees"), {
      type: "number",
      value: 25,
    });
  }

  for (const record of allRecords) {
    assert.ok(record.contracts.mobile?.root, `${record.id}: missing Mobile`);
    assert.ok(record.contracts.desktop?.root, `${record.id}: missing Desktop`);
    assert.notStrictEqual(record.contracts.mobile, record.contracts.desktop);
    assert.notStrictEqual(
      record.contracts.mobile.root,
      record.contracts.desktop.root,
    );
  }
});

test("migration preserves high-risk responsive, asset, property and template contracts", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const index = indexComponentRegistries(registries);

  const cardImage = index.bySystemId.get("card-image");
  assert.deepEqual(findFact(cardImage, "mobile", "reference-size"), { type: "dimensions", width: 252, height: 291, unit: "px" });
  assert.deepEqual(findFact(cardImage, "mobile", "layout-axis"), { type: "keyword", value: "vertical" });
  assert.deepEqual(cardImage.asset_contracts[0].aspect_ratio, {
    width: 232,
    height: 148,
  });

  const cardAssetOwner = index.bySystemId.get("asset-card-image-2x");
  assert.deepEqual(
    {
      owner: cardAssetOwner.asset_contracts[0].owner_layer_name,
      sourceMode: cardAssetOwner.asset_contracts[0].source_mode_id,
      exportProfile: cardAssetOwner.asset_contracts[0].export_profile_id,
      boundary: cardAssetOwner.asset_contracts[0].export_boundary.kind,
      clipping: cardAssetOwner.asset_contracts[0].clipping_policy_id,
      ratio: cardAssetOwner.asset_contracts[0].aspect_ratio,
    },
    {
      owner: "Asset/Card-Image @2x",
      sourceMode: "rendered-node",
      exportProfile: "jpeg-2x",
      boundary: "node",
      clipping: "neutralize-presentation-only",
      ratio: { width: 232, height: 148 },
    },
  );

  const featureIcon = index.bySystemId.get("asset-feature-icon-4x");
  assert.deepEqual(
    {
      owner: featureIcon.asset_contracts[0].owner_layer_name,
      profile: featureIcon.asset_contracts[0].export_profile_id,
      alpha: featureIcon.asset_contracts[0].alpha_mode_id,
      boundary: featureIcon.asset_contracts[0].export_boundary.kind,
    },
    {
      owner: "Asset/Feature-Icon @4x",
      profile: "png-4x",
      alpha: "transparent",
      boundary: "node",
    },
  );

  const iconCard = index.bySystemId.get("card-icon");
  const mobileLink = findElement(
    iconCard.contracts.mobile.root,
    (element) => element.semantic_role === "link",
  );
  const desktopLink = findElement(
    iconCard.contracts.desktop.root,
    (element) => element.semantic_role === "link",
  );
  assert.equal(
    iconCard.properties.find((property) => property.id === "show-link")?.type,
    "boolean",
  );
  assert.deepEqual(mobileLink.visibility, {
    mode: "property",
    property_id: "show-link",
  });
  assert.deepEqual(desktopLink.visibility, {
    mode: "property",
    property_id: "show-link",
  });

  const template = index.bySystemId.get("email-template");
  assert.equal(template.identity.semantic_role, "template");
  assert.deepEqual(
    template.properties.find((property) => property.id === "content"),
    {
      id: "content",
      figma_name: "Content",
      type: "slot",
      default: null,
    },
  );
  for (const viewport of ["mobile", "desktop"]) {
    assert.equal(template.contracts[viewport].root.semantic_role, "template");
    assert.equal(
      template.contracts[viewport].root.children[0].render_mode,
      "slot",
    );
    assert.deepEqual(
      template.contracts[viewport].root.children[0].content_slots,
      [{ id: "content", type: "placeholder", required: true }],
    );
  }
});
