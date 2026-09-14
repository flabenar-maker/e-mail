import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { postprocessEmail } from "../../scripts/lib/email-postprocess.mjs";
import { publishEmailAtomically } from "../../scripts/lib/email-output.mjs";

const execFileAsync = promisify(execFile);
const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function treeDigest(root) {
  const hash = createHash("sha256");
  async function visit(folder) {
    const entries = await readdir(folder, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const path = join(folder, entry.name);
      hash.update(relative(root, path).replaceAll("\\", "/"));
      hash.update("\0");
      if (entry.isDirectory()) await visit(path);
      else hash.update(await readFile(path));
      hash.update("\0");
    }
  }
  await visit(root);
  return hash.digest("hex");
}

function collectAssets(instance, output = new Set()) {
  for (const asset of instance.asset_files ?? []) output.add(asset.path);
  for (const slot of instance.slots ?? []) {
    for (const child of slot.instances ?? []) collectAssets(child, output);
  }
  for (const nested of instance.nested_components ?? []) {
    if (nested.instance) collectAssets(nested.instance, output);
  }
  return output;
}

test("allowlisted postprocessing is narrow and validates local references", () => {
  const html = '<!-- cupis:technical trace --><img src="images/card.jpg" width="232px" height="148px">';
  assert.equal(
    postprocessEmail({
      html,
      policy: {
        transformers: ["normalize-attributes", "strip-technical-markers", "validate-local-src"],
        assetPaths: ["images/card.jpg"],
      },
    }),
    '<img src="images/card.jpg" width="232" height="148">',
  );
});

test("postprocessing rejects unknown, forbidden and missing-local-source operations", () => {
  assert.throws(
    () => postprocessEmail({ html: "<p>Safe</p>", policy: { transformers: ["invent-layout"], assetPaths: [] } }),
    (error) => error.code === "EMAIL_POSTPROCESSOR_UNKNOWN",
  );
  assert.throws(
    () => postprocessEmail({ html: "<p>Safe</p>", policy: { transformers: ["change-layout"], assetPaths: [] } }),
    (error) => error.code === "EMAIL_POSTPROCESSOR_FORBIDDEN",
  );
  assert.throws(
    () => postprocessEmail({ html: '<img src="images/missing.jpg">', policy: { transformers: ["validate-local-src"], assetPaths: [] } }),
    (error) => error.code === "EMAIL_LOCAL_SRC_MISSING",
  );
});

test("atomic publisher creates only email.html and images", async () => {
  const folder = await mkdtemp(join(tmpdir(), "cupis-email-output-"));
  const source = join(folder, "source.jpg");
  const outputDir = join(folder, "campaign-1.0");
  await writeFile(source, "image-bytes", "utf8");
  try {
    await publishEmailAtomically({
      outputDir,
      html: "<!doctype html><p>Ready</p>",
      assets: [{ path: "images/card.jpg", sourcePath: source }],
    });
    assert.deepEqual(await readdir(outputDir), ["email.html", "images"]);
    assert.equal(await readFile(join(outputDir, "email.html"), "utf8"), "<!doctype html><p>Ready</p>");
    assert.equal(await readFile(join(outputDir, "images", "card.jpg"), "utf8"), "image-bytes");
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test("failed publish never changes an existing non-empty output folder", async () => {
  const folder = await mkdtemp(join(tmpdir(), "cupis-email-output-"));
  const outputDir = join(folder, "campaign-1.0");
  await mkdir(join(outputDir, "images"), { recursive: true });
  await writeFile(join(outputDir, "email.html"), "original", "utf8");
  await writeFile(join(outputDir, "images", "original.jpg"), "asset", "utf8");
  const before = await treeDigest(outputDir);
  try {
    await assert.rejects(
      publishEmailAtomically({ outputDir, html: "replacement", assets: [] }),
      (error) => error.code === "EMAIL_OUTPUT_EXISTS",
    );
    assert.equal(await treeDigest(outputDir), before);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test("CLI renders the raw valid pilot model into the canonical responsive email shell", async () => {
  const folder = await mkdtemp(join(tmpdir(), "cupis-email-cli-"));
  const modelPath = join(folder, "email-model.json");
  const outputDir = join(folder, "rendered-1.0");
  const model = JSON.parse(await readFile(join(repoRoot, "tests", "fixtures", "rendering", "pilot-email.json"), "utf8"));
  for (const assetPath of collectAssets(model.root)) {
    const source = join(folder, ...assetPath.split("/"));
    await mkdir(dirname(source), { recursive: true });
    await writeFile(source, "asset", "utf8");
  }
  await writeFile(modelPath, JSON.stringify(model), "utf8");
  try {
    await execFileAsync(process.execPath, [
      join(repoRoot, "scripts", "render-email.mjs"),
      "--model", modelPath,
      "--output", outputDir,
    ], { cwd: repoRoot });
    assert.deepEqual(await readdir(outputDir), ["email.html", "images"]);
    const html = await readFile(join(outputDir, "email.html"), "utf8");
    assert.match(html, /Скачайте приложение/u);
    assert.match(html, /<body style="margin:0;padding:0">/u);
    assert.match(html, /background-color:#F3F3F5/u);
    assert.match(html, /padding:0 15px/u);
    assert.match(html, /max-width:600px/u);
    assert.match(html, /<!--\[if \(gte mso 9\)\|\(IE\)\]><table role="presentation" width="600" align="center"/u);
    assert.match(html, /@media only screen and \(max-width:659px\)/u);
    const styleStripped = html.replace(/<style>[\s\S]*?<\/style>/u, "");
    assert.match(styleStripped, /class="cupis-[^"]+-mobile" style="display:none;max-height:0;overflow:hidden"/u);
    assert.match(styleStripped, /class="cupis-[^"]+-desktop"/u);
    assert.doesNotMatch(styleStripped, /class="cupis-[^"]+-desktop" style="display:none/u);
    assert.equal((await readdir(outputDir)).includes("email-model.json"), false);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
