import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  indexComponentRegistries,
  loadComponentRegistries,
  walkComponentElements,
} from "../../scripts/lib/component-registry.mjs";
import {
  listComponentDocumentationSections,
  renderComponentRegistrySection,
  resolveFoundationReference,
} from "../../scripts/lib/component-registry-doc.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function loadContext() {
  const [registries, typography, spacing, assets] = await Promise.all([
    loadComponentRegistries({ repoRoot }),
    readStrictYaml(join(repoRoot, "data/foundations/typography.yaml")),
    readStrictYaml(join(repoRoot, "data/foundations/spacing.yaml")),
    readStrictYaml(join(repoRoot, "data/foundations/assets.yaml")),
  ]);
  const foundations = { typography, spacing, assets };
  const index = indexComponentRegistries(registries, foundations);
  return { registries, foundations, index };
}

function record(index, id) {
  const result = index.bySystemId.get(id);
  assert.ok(result, `Missing fixture component ${id}.`);
  return result;
}

test("section model has one fixed order and skips empty optional sections", async () => {
  const { index } = await loadContext();
  const banner = record(index, "banner-secondary");
  assert.deepEqual(
    listComponentDocumentationSections(banner).map(({ id, title }) => [id, title]),
    [
      ["identity-and-purpose", "Identity and purpose"],
      ["structure-and-rendering", "Structure and rendering"],
      ["desktop", "Desktop"],
      ["mobile", "Mobile"],
      ["properties-and-variants", "Properties and variants"],
      ["assets-and-interaction", "Assets and interaction"],
      ["constraints-and-dependencies", "Constraints and dependencies"],
    ],
  );

  const minimal = structuredClone(record(index, "email-template"));
  minimal.variants = [];
  minimal.properties = [];
  minimal.constraints = [];
  minimal.documentation.critical_constraint_ids = [];
  minimal.evidence_links = { foundation_values: [], source_dependencies: [] };
  assert.deepEqual(
    listComponentDocumentationSections(minimal).map(({ id }) => id),
    [
      "identity-and-purpose",
      "structure-and-rendering",
      "desktop",
      "mobile",
    ],
  );
});

test("foundation references resolve to stable ids and exact values", async () => {
  const { foundations } = await loadContext();
  assert.equal(
    resolveFoundationReference(
      {
        foundationId: "spacing",
        group: "roles",
        id: "outer-flow",
        viewport: "mobile",
        path: "/fact",
      },
      foundations,
    ),
    "`spacing/roles/outer-flow` = `16px`",
  );
  assert.equal(
    resolveFoundationReference(
      {
        foundationId: "typography",
        group: "styles",
        id: "mobile-body-large",
        viewport: "mobile",
        path: "/fact",
      },
      foundations,
    ),
    "`typography/styles/mobile-body-large` = `Mobile/Body/Large` (Roboto 400, 14px, line-height 140%, letter-spacing 0%)",
  );

  assert.throws(
    () =>
      resolveFoundationReference(
        {
          foundationId: "spacing",
          group: "roles",
          id: "unknown-role",
          viewport: "mobile",
          path: "/fact",
        },
        foundations,
      ),
    (error) => error?.code === "COMPONENT_REGISTRY_UNKNOWN_SPACING_REFERENCE",
  );
});

test("registry renderer is deterministic, ordered and does not mutate input", async () => {
  const { index } = await loadContext();
  const source = record(index, "banner-secondary");
  const beforeRecord = structuredClone(source);
  const beforeFoundations = structuredClone(index.foundations);

  const first = renderComponentRegistrySection(source, index);
  const second = renderComponentRegistrySection(source, index);

  assert.equal(first, second);
  assert.deepEqual(source, beforeRecord);
  assert.deepEqual(index.foundations, beforeFoundations);
  assert.equal(first.endsWith("\n"), true);
  assert.doesNotMatch(first, /как Desktop/iu);
  assert.deepEqual(
    [...first.matchAll(/^### (.+)$/gmu)].map((match) => match[1]),
    [
      "Identity and purpose",
      "Structure and rendering",
      "Desktop",
      "Mobile",
      "Properties and variants",
      "Assets and interaction",
      "Constraints and dependencies",
    ],
  );
});

test("full registry projection covers HTML, ASSET, HYBRID and template cases", async () => {
  const { index } = await loadContext();
  const html = renderComponentRegistrySection(record(index, "button-secondary"), index);
  const asset = renderComponentRegistrySection(record(index, "asset-header-logo-4x"), index);
  const hybrid = renderComponentRegistrySection(record(index, "banner-secondary"), index);
  const template = renderComponentRegistrySection(record(index, "email-template"), index);
  const nested = renderComponentRegistrySection(record(index, "block-transaction-success"), index);

  assert.match(html, /^## Button\/Secondary$/mu);
  assert.match(html, /Render type: `HTML`/u);

  assert.match(asset, /^## Asset\/Header-Logo @4x$/mu);
  assert.match(asset, /Render type: `ASSET`/u);
  assert.match(asset, /Export profile: `png-4x` — PNG, `\.png`, scale 4, suffix `@4x`, sRGB/u);
  assert.match(asset, /Pixel dimensions: 1288×200px/u);

  assert.match(hybrid, /Render type: `HYBRID`/u);
  assert.match(hybrid, /property `show-body` \(`Show Body`\)/u);
  assert.match(hybrid, /component `button-secondary` \(`Button\/Secondary`\)/u);
  assert.match(hybrid, /Asset contract: `secondary-image`/u);

  assert.match(template, /render `slot`/u);
  assert.match(template, /slot-does-not-create-visual-geometry/u);

  assert.match(nested, /component `badge-operation-status`/u);
  assert.match(nested, /component `details-operation`/u);
});

test("renderer resolves foundation-valued facts without a prose copy", async () => {
  const { index } = await loadContext();
  const source = structuredClone(record(index, "banner-secondary"));
  source.contracts.mobile.root.facts.push(
    {
      id: "spacing-reference",
      value: {
        type: "foundation-reference",
        foundation_id: "spacing",
        definition_group: "roles",
        definition_id: "outer-flow",
      },
    },
    {
      id: "typography-reference",
      value: {
        type: "foundation-reference",
        foundation_id: "typography",
        definition_group: "styles",
        definition_id: "mobile-body-large",
      },
    },
  );

  const output = renderComponentRegistrySection(source, index);
  assert.match(output, /Fact `spacing-reference`: `spacing\/roles\/outer-flow` = `16px`/u);
  assert.match(output, /Fact `typography-reference`: `typography\/styles\/mobile-body-large` = `Mobile\/Body\/Large` \(Roboto 400, 14px, line-height 140%, letter-spacing 0%\)/u);
});

test("exported traversal preserves viewport and tree order", async () => {
  const { index } = await loadContext();
  const visited = [];
  walkComponentElements(record(index, "email-template"), ({ viewport, element, path }) => {
    visited.push(`${viewport}:${path}:${element.id}`);
  });
  assert.deepEqual(visited, [
    "mobile:/contracts/mobile/root:root",
    "mobile:/contracts/mobile/root/children/0:content",
    "desktop:/contracts/desktop/root:root",
    "desktop:/contracts/desktop/root/children/0:content",
  ]);
});


test("evidence links activate only the existing dependencies section and render canonical forms", async () => {
  const { index } = await loadContext();
  const empty = structuredClone(record(index, "email-template"));
  const before = listComponentDocumentationSections(empty);
  empty.evidence_links = { foundation_values: [], source_dependencies: [] };
  assert.deepEqual(listComponentDocumentationSections(empty), before);

  const template = structuredClone(record(index, "email-template"));
  template.evidence_links = {
    foundation_values: [{
      id: "mobile-shell-left-inset",
      source: { variant_node_id: "1102:6", node_id: "1102:6", field_path: "/layout/padding/left" },
      target: { source_id: "rendering-foundation", pointer: "/shell/horizontal_inset_px" },
      comparison: "pixel-number",
    }],
    source_dependencies: [],
  };
  const activation = structuredClone(template);
  activation.variants = [];
  activation.properties = [];
  activation.constraints = [];
  activation.documentation.critical_constraint_ids = [];
  const inactiveSections = listComponentDocumentationSections({ ...activation, evidence_links: { foundation_values: [], source_dependencies: [] } });
  assert.deepEqual(listComponentDocumentationSections(activation).map(({ id }) => id), [...inactiveSections.map(({ id }) => id), "constraints-and-dependencies"]);
  const output = renderComponentRegistrySection(template, index);
  assert.match(output, /- Evidence link \(foundation\): \x60mobile-shell-left-inset\x60 — source variant \x601102:6\x60, node \x601102:6\x60, field \x60\/layout\/padding\/left\x60 → foundation \x60rendering-foundation\x60 \x60\/shell\/horizontal_inset_px\x60; comparison \x60pixel-number\x60/u);
  const header = structuredClone(record(index, "email-header"));
  header.evidence_links = { foundation_values: [], source_dependencies: [{ id: "desktop-header-logo-source", source: { variant_node_id: "230:3679", node_id: "1008:1823" }, target: { component_id: "asset-header-logo-4x", variant_id: "product-cupis" }, asset_owner: { node_id: "1008:1823", asset_id: "header-logo" } }] };
  const sourceOutput = renderComponentRegistrySection(header, index);
  assert.match(sourceOutput, /- Evidence link \(source\): \x60desktop-header-logo-source\x60 — source variant \x60230:3679\x60, instance \x601008:1823\x60 → component \x60asset-header-logo-4x\x60 \(\x60Asset\/Header-Logo @4x\x60\); target variant \x60product-cupis\x60; asset owner \x601008:1823\x60; asset \x60header-logo\x60/u);
  assert.doesNotMatch(output, /Evidence link.*(?:#(?:[0-9A-F]{3}|[0-9A-F]{6})|verified)/iu);
});


test("canonical links add only evidence lines to existing dependency sections", async () => {
  const { index } = await loadContext();
  for (const id of ["block-personal-data-update", "block-receipt-info"]) {
    const after = record(index, id);
    const before = structuredClone(after);
    before.evidence_links = { foundation_values: [], source_dependencies: [] };
    const strip = (value) => value.split("\n").filter((line) => !line.startsWith("- Evidence link ")).join("\n");
    assert.equal(strip(renderComponentRegistrySection(after, index)), renderComponentRegistrySection(before, index), id);
  }
});
