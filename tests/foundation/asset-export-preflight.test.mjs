import test from "node:test";
import assert from "node:assert/strict";

async function assess(input) {
  const module = await import("../../scripts/lib/asset-export-preflight.mjs").catch(() => ({}));
  return module.assessAssetExport?.(input);
}

const asset = {
  id: "secondary-image",
  source_viewport: "mobile",
  source_mode_id: "image-fill",
  export_boundary: { kind: "fill", semantic_node_name: "secondary-image @2x" },
  pixel_dimensions: { width: 814, height: 517, unit: "px" },
  aspect_ratio: { width: 296, height: 188 },
  crop: { mode: "figma-fill", position_source: "concrete-mobile-instance" },
};

function evidence(overrides = {}) {
  return {
    emailId: "sample-email-1.0",
    assetId: "secondary-image",
    sourceViewport: "mobile",
    concreteInstanceId: "1362:19151",
    sourceNodeName: "secondary-image @2x",
    sourceHash: "source-hash-1",
    sourcePixelDimensions: { width: 984, height: 696 },
    cropRect: { x: 0, y: 35.5135135135, width: 984, height: 624.972972973 },
    outputPixelDimensions: { width: 814, height: 517 },
    outputHasBakedPresentationRadius: false,
    ...overrides,
  };
}

test("accepts a rectangular Mobile Fill crop that covers both display variants", async () => {
  const result = await assess({ asset, evidence: evidence() });
  assert.equal(result?.status, "ready");
  assert.deepEqual(result?.issues, []);
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
      outputPixelDimensions: { width: 592, height: 376 },
      outputHasBakedPresentationRadius: true,
    }),
    lowResolutionDecision: {
      action: "continue",
      emailId: "sample-email-1.0",
      assetId: "secondary-image",
      sourceHash: "source-hash-1",
      targetWidth: 814,
      targetHeight: 517,
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
    cropRect: { x: 0, y: 33.1304347826, width: 984, height: 629.739130435 },
    outputPixelDimensions: { width: 1104, height: 706 },
  });
  const pending = await assess({ asset: hero, evidence: heroEvidence });
  assert.equal(pending?.status, "needs-user-decision");
  assert.deepEqual(pending?.sourceShortfall, { width: 120, height: 76.260869565 });

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