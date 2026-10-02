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

test("evidence links are projected only in dependencies with canonical source and foundation forms", async () => {
  const { index } = await loadContext();
  const source = structuredClone(record(index, "email-template"));
  source.evidence_links = [
    { id: "template-padding", kind: "foundation", source_variant: "Mobile", node: "1:2", field: "padding", foundation: { source_id: "spacing", pointer: "/roles/outer-flow" }, comparison: "exact" },
    { id: "template-logo", kind: "source", source_variant: "Desktop", instance: "header", component_id: "asset-header-logo-4x", component_name: "Asset/Header-Logo @4x", target_variant: "Desktop", asset_owner: "email-template", asset: "header-logo" },
  ];
  const output = renderComponentRegistrySection(source, index);
  assert.match(output, /- Evidence link \(foundation\): `template-padding` — source variant `Mobile`, node `1:2`, field `padding` → foundation `spacing` `\/roles\/outer-flow`; comparison `exact`/u);
  assert.match(output, /- Evidence link \(source\):/u);
});
