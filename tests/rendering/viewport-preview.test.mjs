import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const fixturePath = join(repoRoot, "tests/fixtures/rendering/pilot-email.json");
const previewScript = join(repoRoot, "scripts/render-email-preview.mjs");
const rendererScript = join(repoRoot, "scripts/render-email.mjs");

function richTextSegments(value) {
  if (Array.isArray(value)) return value.map(richTextSegments);
  if (!value || typeof value !== "object") return value;
  if (value.type === "rich-text" && typeof value.value === "string") {
    return { type: "rich-text", segments: [{ type: "text", value: value.value }] };
  }
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, richTextSegments(child)]));
}
async function withPilot(run, { missingAsset = false } = {}) {
  const temp = await mkdtemp(join(tmpdir(), "cupis-preview-test-"));
  try {
    const model = JSON.parse(await readFile(fixturePath, "utf8"));
    const modelPath = join(temp, "pilot.json");
    await writeFile(modelPath, JSON.stringify(richTextSegments({ schema_version: "1.0.0", ...model })), "utf8");
    const assets = model.root.slots[0].instances.flatMap((instance) => instance.asset_files);
    for (const asset of assets) {
      if (missingAsset && asset.path === "images/card-image.jpg") continue;
      const path = join(temp, ...asset.path.split("/"));
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, "temporary test asset");
    }
    await run({ temp, modelPath, assets });
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
}

function runPreview(modelPath, viewport, outputDir) {
  return spawnSync(process.execPath, [
    previewScript, "--model", modelPath, "--viewport", viewport, "--output", outputDir,
  ], { cwd: repoRoot, encoding: "utf8" });
}

test("preview uses the final email renderer and frames both viewports without altering email HTML", async () => {
  await withPilot(async ({ temp, modelPath, assets }) => {
    const productionDir = join(temp, "production");
    execFileSync(process.execPath, [
      rendererScript, "--model", modelPath, "--output", productionDir,
    ], { cwd: repoRoot });
    const productionHtml = await readFile(join(productionDir, "email.html"), "utf8");
    const breakpoint = Number(/@media only screen and \(max-width:(\d+)px\)/u.exec(productionHtml)?.[1]);
    assert.ok(Number.isInteger(breakpoint), "Pilot HTML must declare a mobile breakpoint");
    assert.ok(360 <= breakpoint && 800 > breakpoint, "Preview widths must exercise opposite sides of the breakpoint");

    for (const [viewport, width] of [["mobile", 360], ["desktop", 800]]) {
      const outputDir = join(temp, viewport);
      const result = runPreview(modelPath, viewport, outputDir);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(await readFile(join(outputDir, "email.html"), "utf8"), productionHtml);
      const helper = await readFile(join(outputDir, "preview.html"), "utf8");
      assert.match(helper, new RegExp('src="email\\.html"[^>]*width="' + width + '"', "u"));
      assert.match(helper, new RegExp('data-viewport="' + viewport + '"', "u"));
      for (const asset of assets) {
        assert.equal(
          (await readFile(join(outputDir, ...asset.path.split("/")))).length > 0,
          true,
          "Missing preview asset: " + asset.path,
        );
      }
      assert.deepEqual((await readdir(outputDir)).sort(), ["email.html", "images", "preview.html"]);
    }
  });
});

test("missing local image blocks preview publication", async () => {
  await withPilot(async ({ temp, modelPath }) => {
    const outputDir = join(temp, "missing-output");
    const result = runPreview(modelPath, "mobile", outputDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /email-output-asset-source-missing/u);
    await assert.rejects(readdir(outputDir), { code: "ENOENT" });
  }, { missingAsset: true });
});

test("preview rejects an unknown viewport before rendering", async () => {
  await withPilot(async ({ temp, modelPath }) => {
    const outputDir = join(temp, "unknown-output");
    const result = runPreview(modelPath, "tablet", outputDir);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /--viewport mobile\|desktop/u);
    await assert.rejects(readdir(outputDir), { code: "ENOENT" });
  });
});
