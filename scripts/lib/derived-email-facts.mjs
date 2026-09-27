import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const CAPTURE_PATH = "tests/rendering/fixtures/qr-artwork-figma-capture.json";
const CAPTURE_BLOB_SHA = "39e7a05f3383baf0d2effd27cdf9976c970f7b81";

function requireEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("QR Figma derivation mismatch: " + label);
  }
}

function nodeAt(root, targetId) {
  function walk(node, path) {
    if (node.id === targetId) return { node, path };
    for (const [index, child] of (node.children ?? []).entries()) {
      const found = walk(child, path + "/children/" + index);
      if (found) return found;
    }
    return null;
  }
  const found = walk(root, "/contracts/desktop/root");
  if (!found) throw new Error("QR contract node missing: " + targetId);
  return found;
}

function dimensions(width, height) {
  return { type: "dimensions", width, height, unit: "px" };
}

function pixels(value) {
  return { type: "measure", value, unit: "px" };
}

export async function loadDerivedEmailEvidence({ repoRoot, record }) {
  if (record.id !== "banner-app-download") return [];
  const text = (await readFile(resolve(repoRoot, CAPTURE_PATH), "utf8")).replace(/\r\n/gu, "\n");
  const actualSha = createHash("sha1")
    .update("blob " + Buffer.byteLength(text) + "\0")
    .update(text).digest("hex");
  requireEqual(actualSha, CAPTURE_BLOB_SHA, "capture blob SHA");
  const capture = JSON.parse(text);
  requireEqual(capture.figma_file_key, record.figma.file_key, "Figma file identity");
  const source = capture.library;
  const bleed = Math.round(-source.qr_artwork.x);
  const artwork = Math.round(source.qr_artwork.width);
  requireEqual(source.qr_artwork.x, source.qr_artwork.y, "centered artwork offset");
  requireEqual(source.qr_artwork.width, source.qr_artwork.height, "square artwork");
  requireEqual(source.qr_owner.clips_content, false, "unclipped QR owner");
  requireEqual(source.qr_owner.corner_radius, 0, "unrounded QR owner");
  if (Math.abs((source.qr_artwork.width - source.qr_owner.width) / 2 - -source.qr_artwork.x) > 0.0001) {
    throw new Error("QR artwork is not centered in its owner.");
  }
  requireEqual(capture.mcp_export.pixel_width,
    Math.round(source.qr_artwork.width * capture.mcp_export.scale), "export pixel width");
  requireEqual(capture.mcp_export.pixel_height,
    Math.round(source.qr_artwork.height * capture.mcp_export.scale), "export pixel height");
  const qrAsset = record.asset_contracts.find((asset) => asset.id === "qr-code");
  requireEqual(qrAsset?.pixel_dimensions, {
    width: capture.mcp_export.pixel_width,
    height: capture.mcp_export.pixel_height,
    unit: "px",
  }, "asset contract pixels");

  const grid = capture.email_integer_grid;
  requireEqual(grid.artwork_size, artwork, "rounded artwork size");
  requireEqual(grid.centered_bleed, bleed, "rounded centered bleed");
  requireEqual(grid.content_padding, {
    top: source.content_area.padding.top - bleed,
    right: source.content_area.padding.right - bleed,
    bottom: source.content_area.padding.bottom,
    left: source.content_area.padding.left,
  }, "content padding");
  requireEqual(grid.content_layout_gap, source.content_area.layout_gap - bleed, "content gap");
  requireEqual(grid.text_qr_size, {
    width: source.text_qr.width + bleed,
    height: source.text_qr.height + 2 * bleed,
  }, "row size");
  requireEqual(grid.text_qr_layout_gap, source.text_qr.layout_gap - bleed, "row gap");
  requireEqual(grid.header_cell_inset_top, bleed, "header inset");
  requireEqual(grid.content_padding.left + grid.text_qr_size.width + grid.content_padding.right,
    source.content_area.width, "outer width");
  const stores = nodeAt(record.contracts.desktop.root, "root-content-area-store-buttons").node;
  const storeSize = stores.facts.find((fact) => fact.id === "reference-size")?.value;
  requireEqual(storeSize?.width, source.text_qr.width, "store button row width");
  requireEqual(grid.content_padding.top + grid.text_qr_size.height +
    grid.content_layout_gap + storeSize.height + grid.content_padding.bottom,
    source.content_area.height, "outer height");
  requireEqual(source.header_row.width + grid.text_qr_layout_gap + artwork,
    grid.text_qr_size.width, "row column widths");

  const expected = [
    ["root-content-area", "email-render-size",
      dimensions(source.content_area.width, source.content_area.height)],
    ["root-content-area", "email-render-padding-top", pixels(grid.content_padding.top)],
    ["root-content-area", "email-render-padding-right", pixels(grid.content_padding.right)],
    ["root-content-area", "email-render-layout-gap", pixels(grid.content_layout_gap)],
    ["root-content-area-text-qr", "email-render-size",
      dimensions(grid.text_qr_size.width, grid.text_qr_size.height)],
    ["root-content-area-text-qr", "email-render-layout-gap", pixels(grid.text_qr_layout_gap)],
    ["root-content-area-text-qr-header-row", "email-cell-inset-top",
      pixels(grid.header_cell_inset_top)],
    ["root-content-area-text-qr-qr-code", "email-render-size",
      dimensions(artwork, artwork)],
  ];
  return expected.map(([nodeId, factId, value]) => {
    const { node, path } = nodeAt(record.contracts.desktop.root, nodeId);
    const index = node.facts.findIndex((fact) => fact.id === factId);
    if (index < 0) throw new Error("QR derived contract fact missing: " + factId);
    return {
      component_id: record.id,
      source_blob_sha: actualSha,
      contract_path: path + "/facts/" + index + "/value",
      value,
    };
  });
}
