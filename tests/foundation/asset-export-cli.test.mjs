import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const command = join(root, "scripts/check-asset-export.mjs");
const asset = {
  id: "hero-image",
  source_viewport: "desktop",
  source_mode_id: "image-fill",
  export_boundary: { kind: "fill", semantic_node_name: "hero-image @2x" },
  pixel_dimensions: { width: 1104, height: 706, unit: "px" },
  aspect_ratio: { width: 552, height: 353 },
  crop: { mode: "figma-fill", position_source: "concrete-desktop-instance" },
};
const evidence = {
  emailId: "sample-1.0",
  assetId: "hero-image",
  sourceViewport: "desktop",
  concreteInstanceId: "sample-instance",
  sourceNodeName: "hero-image @2x",
  sourceNodeId: "sample-hero-node",
  sourceNodeDimensions: { width: 552, height: 353 },
  sourceHash: "fill-a",
  sourcePixelDimensions: { width: 984, height: 696 },
  fillScaleMode: "FILL",
  imageTransform: [[1, 0, 0], [0, 1, 0]],
  cropRect: { x: 0, y: 33.3695652174, width: 984, height: 629.260869565 },
  outputPixelDimensions: { width: 1104, height: 706 },
  outputHasBakedPresentationRadius: false,
};

function run(payload) {
  const result = spawnSync(process.execPath, [command], {
    cwd: root,
    input: JSON.stringify(payload),
    encoding: "utf8",
  });
  return { exitCode: result.status, output: JSON.parse(result.stdout || "null") };
}

test("CLI pauses low-resolution export and accepts only scoped approval", () => {
  const pending = run({ asset, evidence });
  assert.equal(pending.exitCode, 2);
  assert.equal(pending.output.status, "needs-user-decision");

  const approved = run({
    asset,
    evidence,
    lowResolutionDecision: {
      action: "continue",
      emailId: "sample-1.0",
      assetId: "hero-image",
      sourceHash: "fill-a",
      targetWidth: 1104,
      targetHeight: 706,
    },
  });
  assert.equal(approved.exitCode, 0);
  assert.equal(approved.output.lowResolutionAccepted, true);
});

test("CLI never lets a waiver bypass a rounded export", () => {
  const blocked = run({
    asset,
    evidence: { ...evidence, outputHasBakedPresentationRadius: true },
    lowResolutionDecision: {
      action: "continue",
      emailId: "sample-1.0",
      assetId: "hero-image",
      sourceHash: "fill-a",
      targetWidth: 1104,
      targetHeight: 706,
    },
  });
  assert.equal(blocked.exitCode, 1);
  assert.ok(blocked.output.issues.some((entry) => entry.code === "presentation-radius-baked"));
});