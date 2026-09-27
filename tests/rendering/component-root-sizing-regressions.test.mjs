import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { loadRenderingFoundation } from "../../scripts/lib/rendering-foundation.mjs";
import { loadRendererRegistry, resolveRendererCoverage } from "../../scripts/lib/renderer-registry.mjs";
import { renderContractTree } from "../../scripts/lib/email-interpreter.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function requiredInputs(component) {
  const content = { mobile: {}, desktop: {} };
  const properties = { mobile: {}, desktop: {} };
  const assets = { mobile: {}, desktop: {} };
  for (const viewport of ["mobile", "desktop"]) {
    const visit = (element) => {
      const entry = content[viewport][element.id] ??= {};
      const source = element.facts?.find(({ id }) => id === "source-text")?.value?.value;
      for (const slot of element.content_slots ?? []) {
        if (!slot.required) continue;
        entry[slot.id] = source ?? (/(?:href|url)/u.test(slot.id)
          ? "https://example.test/action"
          : "Regression content");
      }
      if (element.asset_contract_id) {
        assets[viewport][element.asset_contract_id] = { src: "images/regression.png" };
      }
      if (element.visibility?.mode === "property") {
        const property = component.properties?.find(({ id }) => id === element.visibility.property_id);
        properties[viewport][element.visibility.property_id] = property?.default ?? true;
      }
      for (const child of element.children ?? []) visit(child);
    };
    visit(component.contracts[viewport].root);
  }
  return { content, properties, assets };
}

async function renderActualComponent(componentId) {
  const [registries, rendererRegistry, rendering] = await Promise.all([
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadRenderingFoundation({ repoRoot }),
  ]);
  const component = Object.values(registries)
    .flatMap(({ components }) => components)
    .find(({ id }) => id === componentId);
  assert.ok(component, `missing actual component ${componentId}`);

  const result = renderContractTree({
    component,
    coverage: resolveRendererCoverage(rendererRegistry, componentId),
    foundations: { rendering },
    ...requiredInputs(component),
  });
  assert.deepEqual(result.diagnostics, []);
  return result.html;
}

function mobileRootTable(html) {
  const mobile = html.match(/<div class="cupis-root-mobile"[^>]*>([\s\S]*?)<\/div>/u)?.[1];
  assert.ok(mobile, "actual Mobile output must be isolated from Desktop output");
  const table = mobile.match(/<table\b[^>]*>/u)?.[0];
  assert.ok(table, "actual Mobile root must render as a presentation table");
  return table;
}

test("actual block-icon-cards Mobile root stretches to its available width", async () => {
  const root = mobileRootTable(await renderActualComponent("block-icon-cards"));
  assert.match(root, /width:100%/u);
});

test("actual button-primary Mobile root remains hug-sized instead of filling", async () => {
  const root = mobileRootTable(await renderActualComponent("button-primary"));
  assert.doesNotMatch(root, /width:100%/u);
});

test("actual button-secondary Mobile root remains hug-sized instead of filling", async () => {
  const root = mobileRootTable(await renderActualComponent("button-secondary"));
  assert.doesNotMatch(root, /width:100%/u);
});

test("actual badge-step-number Mobile root remains hug-sized instead of filling", async () => {
  const root = mobileRootTable(await renderActualComponent("badge-step-number"));
  assert.doesNotMatch(root, /width:100%/u);
});
function viewportHtml(html, viewport) {
  const match = html.match(new RegExp(`<div class="cupis-root-${viewport}"[^>]*>([\\s\\S]*?)<\\/div>`, "u"));
  assert.ok(match, `actual ${viewport} output must be isolated`);
  return match[1];
}
function findElement(element, predicate) {
  if (predicate(element)) return element;
  for (const child of element.children ?? []) {
    const found = findElement(child, predicate);
    if (found) return found;
  }
  return null;
}

function factValue(element, id) {
  return element.facts?.find((fact) => fact.id === id)?.value?.value;
}

async function actualRegistryComponent(componentId) {
  const registries = await loadComponentRegistries({ repoRoot });
  const component = Object.values(registries)
    .flatMap(({ components }) => components)
    .find(({ id }) => id === componentId);
  assert.ok(component, `missing actual component ${componentId}`);
  return component;
}

for (const [componentId, statusWidth] of [["block-transaction-success", 116], ["block-transaction-error", 106]]) {
  test(`actual ${componentId} keeps its Desktop status container hug-sized and vertically filled`, async () => {
    const component = await actualRegistryComponent(componentId);
    const statusContainer = findElement(component.contracts.desktop.root, ({ semantic_role }) => semantic_role === "status-container");
    assert.ok(statusContainer, "Desktop transaction summary needs a real status container");
    assert.equal(factValue(statusContainer, "horizontal-sizing"), "hug");
    assert.equal(factValue(statusContainer, "vertical-sizing"), "fill");
    assert.equal(factValue(statusContainer, "layout-align"), "stretch");
    const desktop = viewportHtml(await renderActualComponent(componentId), "desktop");
    assert.match(desktop, new RegExp(`<table[^>]*width="${statusWidth}"[^>]*height="72"`, "u"));
  });

  test(`actual ${componentId} keeps its Mobile transaction status centered`, async () => {
    const component = await actualRegistryComponent(componentId);
    const status = findElement(component.contracts.mobile.root, ({ semantic_role }) => semantic_role === "status");
    assert.ok(status, "Mobile transaction summary needs a real status");
    assert.equal(factValue(status, "primary-alignment"), "center");
    assert.equal(factValue(status, "counter-alignment"), "center");
    const mobile = viewportHtml(await renderActualComponent(componentId), "mobile");
    assert.match(mobile, /<table\b[^>]*align="center"[^>]*width="100%"[^>]*margin:0 auto/u);
    assert.match(mobile, /<img\b[^>]*width="72"[^>]*height="72"/u);
  });
}