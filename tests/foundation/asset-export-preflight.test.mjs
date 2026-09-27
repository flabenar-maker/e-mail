import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

async function assess(input) {
  const module = await import("../../scripts/lib/asset-export-preflight.mjs").catch(() => ({}));
  return module.assessAssetExport?.(input);
}

const asset = {
  id: "secondary-image",
  source_viewport: "mobile",
  source_mode_id: "image-fill",
  export_boundary: { kind: "fill", semantic_node_name: "secondary-image @2x" },
  pixel_dimensions: { width: 592, height: 376, unit: "px" },
  aspect_ratio: { width: 296, height: 188 },
  crop: { mode: "figma-fill", position_source: "concrete-mobile-instance" },
};

function evidence(overrides = {}) {
  return {
    emailId: "sample-email-1.0",
    assetId: "secondary-image",
    sourceViewport: "mobile",
    concreteInstanceId: "sample-instance",
    sourceNodeName: "secondary-image @2x",
    sourceNodeId: "sample-secondary-node",
    sourceNodeDimensions: { width: 296, height: 188 },
    sourceHash: "source-hash-1",
    sourcePixelDimensions: { width: 984, height: 696 },
    fillScaleMode: "FILL",
    imageTransform: [[1, 0, 0], [0, 1, 0]],
    cropRect: { x: 0, y: 35.5135135135, width: 984, height: 624.972972973 },
    outputPixelDimensions: { width: 592, height: 376 },
    outputHasBakedPresentationRadius: false,
    ...overrides,
  };
}

test("accepts a rectangular Mobile Fill crop that covers both display variants", async () => {
  const result = await assess({ asset, evidence: evidence() });
  assert.equal(result?.status, "ready");
  assert.deepEqual(result?.issues, []);
});

test("blocks a claimed crop when the concrete Figma Fill node has another aspect ratio", async () => {
  const result = await assess({
    asset,
    evidence: evidence({ sourceNodeDimensions: { width: 296, height: 296 } }),
  });
  assert.equal(result?.status, "blocked");
  assert.ok(result?.issues.some((entry) => entry.code === "source-node-ratio-mismatch"));
});

test("requires the concrete source node identity and dimensions", async () => {
  const result = await assess({
    asset,
    evidence: evidence({ sourceNodeId: "", sourceNodeDimensions: null }),
  });
  assert.equal(result?.status, "blocked");
  assert.ok(result?.issues.some((entry) => entry.code === "source-node-id-missing"));
  assert.ok(result?.issues.some((entry) => entry.code === "source-node-dimensions-missing"));
});

test("keeps Banner/Secondary export dimensions anchored to the current registry", async () => {
  const registry = JSON.parse(readFileSync(new URL("../../data/components/marketing.yaml", import.meta.url), "utf8"));
  const current = registry.components.find((component) => component.id === "banner-secondary")
    ?.asset_contracts.find((entry) => entry.id === "secondary-image");
  assert.ok(current);
  assert.deepEqual(
    { width: current.pixel_dimensions.width, height: current.pixel_dimensions.height },
    { width: 592, height: 376 },
  );
  const result = await assess({
    asset: current,
    evidence: evidence({
      sourceViewport: current.source_viewport,
      outputPixelDimensions: { width: 814, height: 517 },
    }),
  });
  assert.equal(result?.status, "blocked");
  assert.ok(result?.issues.some((entry) => entry.code === "output-dimensions-mismatch"));
});

test("blocks a Desktop source or changed crop rather than silently substituting it", async () => {
  const wrongViewport = await assess({ asset, evidence: evidence({ sourceViewport: "desktop" }) });
  assert.equal(wrongViewport?.status, "blocked");
  assert.ok(wrongViewport?.issues.some((issue) => issue.code === "source-viewport-mismatch"));

  const wrongCrop = await assess({ asset, evidence: evidence({ cropRect: { x: 0, y: 0, width: 984, height: 696 } }) });
  assert.equal(wrongCrop?.status, "blocked");
  assert.ok(wrongCrop?.issues.some((issue) => issue.code === "crop-ratio-mismatch"));
});

test("blocks dimensions or baked presentation radius, even with a low-resolution waiver", async () => {
  const result = await assess({
    asset,
    evidence: evidence({
      outputPixelDimensions: { width: 600, height: 376 },
      outputHasBakedPresentationRadius: true,
    }),
    lowResolutionDecision: {
      action: "continue",
      emailId: "sample-email-1.0",
      assetId: "secondary-image",
      sourceHash: "source-hash-1",
      targetWidth: 592,
      targetHeight: 376,
    },
  });
  assert.equal(result?.status, "blocked");
  assert.ok(result?.issues.some((issue) => issue.code === "output-dimensions-mismatch"));
  assert.ok(result?.issues.some((issue) => issue.code === "presentation-radius-baked"));
});

test("low source resolution pauses for a per-email, per-asset decision and records exact shortfall", async () => {
  const hero = {
    ...asset,
    id: "hero-image",
    source_viewport: "desktop",
    export_boundary: { kind: "fill", semantic_node_name: "hero-image @2x" },
    pixel_dimensions: { width: 1104, height: 706, unit: "px" },
    aspect_ratio: { width: 552, height: 353 },
    crop: { mode: "figma-fill", position_source: "concrete-desktop-instance" },
  };
  const heroEvidence = evidence({
    assetId: "hero-image",
    sourceViewport: "desktop",
    sourceNodeName: "hero-image @2x",
    sourceNodeId: "sample-hero-node",
    sourceNodeDimensions: { width: 552, height: 353 },
    cropRect: { x: 0, y: 33.3695652174, width: 984, height: 629.260869565 },
    outputPixelDimensions: { width: 1104, height: 706 },
  });
  const pending = await assess({ asset: hero, evidence: heroEvidence });
  assert.equal(pending?.status, "needs-user-decision");
  assert.deepEqual(pending?.sourceShortfall, { width: 120, height: 77 });

  const unrelated = await assess({
    asset: hero,
    evidence: heroEvidence,
    lowResolutionDecision: {
      action: "continue",
      emailId: "another-email",
      assetId: "hero-image",
      sourceHash: "source-hash-1",
      targetWidth: 1104,
      targetHeight: 706,
    },
  });
  assert.equal(unrelated?.status, "needs-user-decision");

  const approved = await assess({
    asset: hero,
    evidence: heroEvidence,
    lowResolutionDecision: {
      action: "continue",
      emailId: "sample-email-1.0",
      assetId: "hero-image",
      sourceHash: "source-hash-1",
      targetWidth: 1104,
      targetHeight: 706,
    },
  });
  assert.equal(approved?.status, "ready");
  assert.equal(approved?.lowResolutionAccepted, true);
});
test("rejects a contract whose crop source disagrees with its selected viewport", async () => {
  const badAsset = {
    ...asset,
    crop: { mode: "figma-fill", position_source: "concrete-desktop-instance" },
  };
  const result = await assess({ asset: badAsset, evidence: evidence() });
  assert.equal(result?.status, "blocked");
  assert.ok(result?.issues.some((entry) => entry.code === "contract-crop-source-mismatch"));
});

test("rejects a target file whose declared dimensions deform its aspect ratio", async () => {
  const badAsset = {
    ...asset,
    pixel_dimensions: { width: 593, height: 376, unit: "px" },
  };
  const result = await assess({
    asset: badAsset,
    evidence: evidence({ outputPixelDimensions: { width: 593, height: 376 } }),
  });
  assert.equal(result?.status, "blocked");
  assert.ok(result?.issues.some((entry) => entry.code === "contract-ratio-mismatch"));
});
test("accepts a rendered Card/Image composite with its own exact-node crop source", async () => {
  const card = {
    ...asset,
    id: "card-image",
    source_viewport: "desktop",
    source_mode_id: "rendered-node",
    export_boundary: { kind: "node", semantic_node_name: "card-image @2x" },
    pixel_dimensions: { width: 464, height: 296, unit: "px" },
    aspect_ratio: { width: 232, height: 148 },
    crop: { mode: "none", position_source: "exact-node-after-overrides" },
  };
  const result = await assess({
    asset: card,
    evidence: evidence({
      assetId: "card-image",
      sourceViewport: "desktop",
      sourceNodeName: "card-image @2x",
      sourceNodeId: "sample-card-node",
      sourceNodeDimensions: { width: 232, height: 148 },
      outputPixelDimensions: { width: 464, height: 296 },
      effectiveSourcePixelDimensions: { width: 752, height: 480 },
      outputHasBakedPresentationRadius: false,
    }),
  });
  assert.equal(result?.status, "ready");
});