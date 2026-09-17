import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadEmailModel } from "../../scripts/lib/email-model.mjs";
import { buildEmailPreview } from "../../scripts/lib/email-preview.mjs";
import { renderEmailDocument } from "../../scripts/lib/email-renderer.mjs";
import { loadRenderingFoundation } from "../../scripts/lib/rendering-foundation.mjs";

import {`n  indexComponentRegistries,`n  loadComponentRegistries,`n} from "../../scripts/lib/component-registry.mjs";
import {
  loadRendererRegistry,
  resolveRendererCoverage,
  validateRendererReadyComponent,
} from "../../scripts/lib/renderer-registry.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function componentById(registries, componentId) {
  for (const document of Object.values(registries)) {
    const record = document.components.find(({ id }) => id === componentId);
    if (record) return record;
  }
  throw new Error(`Unknown test component: ${componentId}`);
}

function fact(record, viewport, id) {
  return record.contracts[viewport].root.facts.find((item) => item.id === id)?.value;
}

test("Email/Header exact contracts are ready for narrow pilot coverage", async () => {
  const [registries, rendererRegistry] = await Promise.all([
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
  ]);
  const header = componentById(registries, "email-header");
  const coverage = resolveRendererCoverage(rendererRegistry, header.id);

  assert.deepEqual(coverage, { component_id: "email-header", mode: "interpreter" });
  assert.deepEqual(validateRendererReadyComponent(header, coverage), []);
  assert.deepEqual(fact(header, "mobile", "reference-size"), {
    type: "dimensions", width: 328, height: 49, unit: "px",
  });
  assert.deepEqual(fact(header, "desktop", "reference-size"), {
    type: "dimensions", width: 600, height: 74, unit: "px",
  });
  assert.equal(header.contracts.mobile.root.children[0].render_mode, "direct-image");
  assert.equal(header.contracts.desktop.root.children[0].render_mode, "direct-image");
});
async function pilot() {
  const [model, registries, rendererRegistry, rendering] = await Promise.all([
    loadEmailModel({
      modelPath: join(repoRoot, "tests", "fixtures", "rendering", "pilot-email.json"),
      schemaPath: join(repoRoot, "schemas", "email-model.schema.json"),
    }),
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadRenderingFoundation({ repoRoot }),
  ]);
  return {
    model,
    dependencies: {
      componentIndex: indexComponentRegistries(registries),
      rendererRegistry,
      foundations: { rendering },
    },
  };
}

test("representative pilot contains Header and Footer exactly once in canonical order", async () => {
  const { model, dependencies } = await pilot();
  const instances = model.root.slots[0].instances;
  assert.deepEqual(instances.map(({ component_id }) => component_id), [
    "email-header",
    "banner-secondary",
    "banner-app-download",
    "email-footer",
  ]);
  assert.equal(instances.filter(({ component_id }) => component_id === "email-header").length, 1);
  assert.equal(instances.filter(({ component_id }) => component_id === "email-footer").length, 1);

  const result = renderEmailDocument(model, dependencies);
  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /@media only screen and \(max-width:659px\)/u);
  assert.equal(result.assets.filter(({ path }) => path === "images/header-logo.png").length, 1);
  assert.equal(result.metrics.embedded_css_bytes < 16384, true);

  const noStyle = buildEmailPreview({ html: result.html, mode: "no-style" });
  assert.equal(noStyle, result.html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, ""));
  assert.match(noStyle, /images\/header-logo\.png/u);
  assert.match(noStyle, /images\/vk-icon\.png/u);
});
