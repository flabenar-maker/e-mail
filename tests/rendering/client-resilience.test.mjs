import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
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