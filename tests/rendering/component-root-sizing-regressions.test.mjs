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
      if (element.visibility?.mode === "property") {
        const property = component.properties?.find(({ id }) => id === element.visibility.property_id);
        properties[viewport][element.visibility.property_id] = property?.default ?? true;
      }
      for (const child of element.children ?? []) visit(child);
    };
    visit(component.contracts[viewport].root);
  }
  return { content, properties };
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
  const mobile = html.match(/<div class="cupis-root-mobile">([\s\S]*?)<\/div>/u)?.[1];
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
  assert.match(root, /width:auto/u);
  assert.doesNotMatch(root, /width:100%/u);
});

test("actual button-secondary Mobile root remains hug-sized instead of filling", async () => {
  const root = mobileRootTable(await renderActualComponent("button-secondary"));
  assert.match(root, /width:auto/u);
  assert.doesNotMatch(root, /width:100%/u);
});

test("actual badge-step-number Mobile root remains hug-sized instead of filling", async () => {
  const root = mobileRootTable(await renderActualComponent("badge-step-number"));
  assert.match(root, /width:auto/u);
  assert.doesNotMatch(root, /width:100%/u);
});