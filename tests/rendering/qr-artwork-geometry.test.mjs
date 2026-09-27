import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { renderContractTree } from "../../scripts/lib/email-interpreter.mjs";
import { loadDerivedEmailEvidence } from "../../scripts/lib/derived-email-facts.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const captureText = await readFile(new URL("./fixtures/qr-artwork-figma-capture.json", import.meta.url), "utf8");
const capture = JSON.parse(captureText);

const captureBlobSha = "39e7a05f3383baf0d2effd27cdf9976c970f7b81";
const rendering = {
  breakpoints: [{ id: "cupis-mobile", query: "max-width", value: 659, unit: "px" }],
};

function findElement(node, id) {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findElement(child, id);
    if (found) return found;
  }
  return null;
}

function findFact(node, id) {
  return node.facts?.find((fact) => fact.id === id);
}

function literal(id, value) {
  return { id, value };
}

test("QR Figma capture traces the complete opaque export and exact email grid", async () => {
  const normalizedCaptureText = captureText.replace(/\r\n/gu, "\n");
  const actualBlobSha = createHash("sha1").update(`blob ${Buffer.byteLength(normalizedCaptureText)}\0`)
    .update(normalizedCaptureText).digest("hex");
  assert.equal(actualBlobSha, captureBlobSha);
  const registries = await loadComponentRegistries({ repoRoot });
  const app = Object.values(registries).flatMap((registry) => registry.components)
    .find((component) => component.id === "banner-app-download");
  assert.ok(app);
  const source = capture.library;
  const grid = capture.email_integer_grid;
  const asset = app.asset_contracts.find((entry) => entry.id === "qr-code");
  assert.ok(asset);
  assert.equal(asset.alpha_mode_id, "opaque");
  assert.equal(asset.source_viewport, "desktop");
  assert.deepEqual(asset.pixel_dimensions, {
    width: capture.mcp_export.pixel_width,
    height: capture.mcp_export.pixel_height,
    unit: "px",
  });
  assert.equal(capture.mcp_export.pixel_width, Math.round(source.qr_artwork.width * capture.mcp_export.scale));
  assert.equal(grid.artwork_size, Math.round(source.qr_artwork.width));
  assert.equal(grid.centered_bleed, Math.round(-source.qr_artwork.x));
  assert.equal(grid.text_qr_size.width, source.text_qr.width + grid.centered_bleed);
  assert.equal(grid.text_qr_size.height, source.text_qr.height + 2 * grid.centered_bleed);
  assert.equal(grid.content_padding.top, source.content_area.padding.top - grid.centered_bleed);
  assert.equal(grid.content_padding.right, source.content_area.padding.right - grid.centered_bleed);
  assert.equal(grid.content_layout_gap, source.content_area.layout_gap - grid.centered_bleed);
  assert.equal(grid.text_qr_layout_gap, source.text_qr.layout_gap - grid.centered_bleed);
  assert.equal(grid.header_cell_inset_top, grid.centered_bleed);

  const root = app.contracts.desktop.root;
  const content = findElement(root, "root-content-area");
  const row = findElement(root, "root-content-area-text-qr");
  const header = findElement(root, "root-content-area-text-qr-header-row");
  const image = findElement(root, "root-content-area-text-qr-qr-code");
  for (const element of [content, row, header, image]) assert.ok(element);
  assert.deepEqual(findFact(image, "reference-size")?.value,
    { type: "dimensions", width: source.qr_owner.width, height: source.qr_owner.height, unit: "px" });
  assert.equal(findFact(image, "visible-artwork-size"), undefined);
  assert.equal(source.qr_artwork.width, source.qr_artwork.height);
  assert.equal(source.qr_artwork.node_id, "961:37516");
  const expected = [
    [content, "email-render-size", { type: "dimensions", width: source.content_area.width, height: source.content_area.height, unit: "px" }],
    [content, "email-render-padding-top", { type: "measure", value: grid.content_padding.top, unit: "px" }],
    [content, "email-render-padding-right", { type: "measure", value: grid.content_padding.right, unit: "px" }],
    [content, "email-render-layout-gap", { type: "measure", value: grid.content_layout_gap, unit: "px" }],
    [row, "email-render-size", { type: "dimensions", ...grid.text_qr_size, unit: "px" }],
    [row, "email-render-layout-gap", { type: "measure", value: grid.text_qr_layout_gap, unit: "px" }],
    [header, "email-cell-inset-top", { type: "measure", value: grid.header_cell_inset_top, unit: "px" }],
    [image, "email-render-size", { type: "dimensions", width: grid.artwork_size, height: grid.artwork_size, unit: "px" }],
  ];
  const proof = await loadDerivedEmailEvidence({ repoRoot, record: app });
  assert.equal(proof.length, expected.length);
  assert.ok(proof.every((item) => item.source_blob_sha === captureBlobSha));
  const elementPaths = new Map([
    [content, "/contracts/desktop/root/children/0"],
    [row, "/contracts/desktop/root/children/0/children/0"],
    [header, "/contracts/desktop/root/children/0/children/0/children/0"],
    [image, "/contracts/desktop/root/children/0/children/0/children/1"],
  ]);
  for (const [element, id, value] of expected) {
    const fact = findFact(element, id);
    assert.deepEqual(fact?.value, value, element.id + ":" + id);
    assert.deepEqual(fact?.provenance, { kind: "registry-literal", source_blob_sha: captureBlobSha });
    const index = element.facts.findIndex((item) => item.id === id);
    const path = `${elementPaths.get(element)}/facts/${index}/value`;
    assert.deepEqual(proof.find((item) => item.contract_path === path)?.value, value);
  }
});

test("QR email layout uses real table and image dimensions without CSS transform", () => {
  const header = {
    id: "header", render_mode: "direct-image", semantic_role: "header",
    visibility: { mode: "always" }, asset_contract_id: "header-image",
    content_slots: [{ id: "alt", type: "alt-text", required: true }],
    facts: [
      literal("reference-size", { type: "dimensions", width: 334, height: 128, unit: "px" }),
      literal("email-cell-inset-top", { type: "measure", value: 4, unit: "px" }),
    ], children: [],
  };
  const image = {
    id: "qr", render_mode: "direct-image", semantic_role: "qr-code",
    visibility: { mode: "always" }, asset_contract_id: "qr-code",
    content_slots: [{ id: "alt", type: "alt-text", required: true }],
    facts: [
      literal("reference-size", { type: "dimensions", width: 130, height: 130, unit: "px" }),
      literal("visible-artwork-size", { type: "dimensions", width: 138.38710021972656, height: 138.38710021972656, unit: "px" }),
      literal("email-render-size", { type: "dimensions", width: 138, height: 138, unit: "px" }),
    ], children: [],
  };
  const row = {
    id: "text-qr", render_mode: "presentation-table", semantic_role: "text-qr",
    visibility: { mode: "always" },
    facts: [
      literal("reference-size", { type: "dimensions", width: 488, height: 130, unit: "px" }),
      literal("layout-axis", { type: "keyword", value: "horizontal" }),
      literal("layout-gap", { type: "measure", value: 24, unit: "px" }),
      literal("email-render-size", { type: "dimensions", width: 492, height: 138, unit: "px" }),
      literal("email-render-layout-gap", { type: "measure", value: 20, unit: "px" }),
    ], children: [header, image],
  };
  const stores = {
    id: "stores", render_mode: "direct-image", semantic_role: "store-buttons",
    visibility: { mode: "always" }, asset_contract_id: "store-buttons",
    content_slots: [{ id: "alt", type: "alt-text", required: true }],
    facts: [literal("reference-size", { type: "dimensions", width: 488, height: 56, unit: "px" })],
    children: [],
  };
  const root = {
    id: "content", render_mode: "presentation-table", semantic_role: "content-area",
    visibility: { mode: "always" },
    facts: [
      literal("reference-size", { type: "dimensions", width: 552, height: 274, unit: "px" }),
      literal("layout-axis", { type: "keyword", value: "vertical" }),
      literal("layout-gap", { type: "measure", value: 24, unit: "px" }),
      literal("padding-top", { type: "measure", value: 32, unit: "px" }),
      literal("padding-right", { type: "measure", value: 32, unit: "px" }),
      literal("padding-bottom", { type: "measure", value: 32, unit: "px" }),
      literal("padding-left", { type: "measure", value: 32, unit: "px" }),
      literal("email-render-size", { type: "dimensions", width: 552, height: 274, unit: "px" }),
      literal("email-render-padding-top", { type: "measure", value: 28, unit: "px" }),
      literal("email-render-padding-right", { type: "measure", value: 28, unit: "px" }),
      literal("email-render-layout-gap", { type: "measure", value: 20, unit: "px" }),
    ], children: [row, stores],
  };
  const result = renderContractTree({
    component: { id: "qr-probe", contracts: { mobile: { root }, desktop: { root: structuredClone(root) } } },
    coverage: { component_id: "qr-probe", mode: "interpreter" },
    content: {
      header: { alt: { type: "alt-text", purpose: "informative", value: "Header" } },
      qr: { alt: { type: "alt-text", purpose: "informative", value: "QR" } },
      stores: { alt: { type: "alt-text", purpose: "informative", value: "Stores" } },
    },
    assets: {
      "header-image": { src: "images/header.png" },
      "qr-code": { src: "images/qr-code.png" },
      "store-buttons": { src: "images/stores.png" },
    },
    foundations: { rendering },
  });
  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /<table[^>]*width="552" height="274"/u);
  assert.match(result.html, /<table[^>]*width="492" height="138"/u);
  assert.match(result.html, /<td width="334"[^>]*padding-top:4px/u);
  assert.match(result.html, /<td width="20"[^>]*>/u);
  assert.match(result.html, /<td width="138"[^>]*><img[^>]*width="138" height="138"/u);
  assert.match(result.html, /<td height="20"[^>]*>/u);
  assert.match(result.html, /padding-right:28px/u);
  assert.match(result.html, /padding-top:28px/u);
  assert.doesNotMatch(result.html, /transform|margin-top:-|margin-left:-/u);
});
