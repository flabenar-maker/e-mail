import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { renderContractTree } from "../../scripts/lib/email-interpreter.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const rendering = {
  breakpoints: [{ id: "cupis-mobile", query: "max-width", value: 659, unit: "px" }],
};

function findAssetElement(node, assetId) {
  if (node.asset_contract_id === assetId) return node;
  for (const child of node.children ?? []) {
    const found = findAssetElement(child, assetId);
    if (found) return found;
  }
  return null;
}

test("QR export retains the full opaque Figma artwork outside its 130px layout slot", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const app = Object.values(registries).flatMap((registry) => registry.components)
    .find((component) => component.id === "banner-app-download");
  assert.ok(app);
  const asset = app.asset_contracts.find((entry) => entry.id === "qr-code");
  assert.ok(asset);
  assert.deepEqual(asset.pixel_dimensions, { width: 554, height: 554, unit: "px" });
  assert.equal(asset.alpha_mode_id, "opaque");
  assert.equal(asset.source_viewport, "desktop");

  const image = findAssetElement(app.contracts.desktop.root, "qr-code");
  assert.ok(image);
  assert.deepEqual(image.facts.find((fact) => fact.id === "reference-size")?.value,
    { type: "dimensions", width: 130, height: 130, unit: "px" });
  assert.deepEqual(image.facts.find((fact) => fact.id === "visible-artwork-size")?.value,
    { type: "dimensions", width: 138.3870849609375, height: 138.3870849609375, unit: "px" });
});

test("QR renderer keeps the 130px table slot and scales only the image around its center", () => {
  const image = {
    id: "qr",
    semantic_role: "qr-code",
    render_mode: "direct-image",
    visibility: { mode: "always" },
    asset_contract_id: "qr-code",
    content_slots: [{ id: "alt", type: "alt-text", required: true }],
    facts: [
      { id: "reference-size", value: { type: "dimensions", width: 130, height: 130, unit: "px" } },
      { id: "visible-artwork-size", value: { type: "dimensions", width: 138.3870849609375, height: 138.3870849609375, unit: "px" } },
    ],
    children: [],
  };
  const result = renderContractTree({
    component: { id: "qr-probe", contracts: { mobile: { root: image }, desktop: { root: structuredClone(image) } } },
    coverage: { component_id: "qr-probe", mode: "interpreter" },
    content: { qr: { alt: { type: "alt-text", purpose: "informative", value: "QR" } } },
    assets: { "qr-code": { src: "images/qr-code.png", width: 130, height: 130 } },
    foundations: { rendering },
  });
  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /<img[^>]*width="130" height="130"/u);
  assert.match(result.html, /transform:scale\(1\.064516/u);
  assert.match(result.html, /transform-origin:center center/u);
});