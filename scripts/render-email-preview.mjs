import { spawnSync } from "node:child_process";
import { readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const widths = { mobile: 360, desktop: 800 };
const usage = "Usage: node scripts/render-email-preview.mjs --model <temp-json> --viewport mobile|desktop --output <temp-folder>";

function parseArguments(argv) {
  if (argv.length !== 6) throw new Error(usage);
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!["--model", "--viewport", "--output"].includes(flag) || !value || values[flag]) {
      throw new Error(usage);
    }
    values[flag] = value;
  }
  if (!values["--model"] || !values["--output"] || !Object.hasOwn(widths, values["--viewport"])) {
    throw new Error(usage);
  }
  return {
    modelPath: resolve(values["--model"]),
    viewport: values["--viewport"],
    outputDir: resolve(values["--output"]),
  };
}

function previewPage(viewport) {
  const width = widths[viewport];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CUPIS ${viewport} email preview</title>
<style>html,body{margin:0;padding:0;background:#e8e8e8}iframe{display:block;margin:0 auto;border:0;background:white;min-height:2200px}</style>
</head>
<body>
<iframe title="CUPIS ${viewport} email" src="email.html" width="${width}" data-viewport="${viewport}"></iframe>
<script>
const frame = document.querySelector("iframe");
frame.addEventListener("load", () => {
  try {
    frame.style.height = frame.contentDocument.documentElement.scrollHeight + "px";
  } catch {
    // The iframe remains scrollable if the browser restricts local-file access.
  }
});
</script>
</body>
</html>
`;
}

function localImageRefs(html) {
  const references = new Set();
  for (const match of html.matchAll(/\b(?:src|background)="([^"]+)"/gu)) {
    if (match[1].startsWith("images/")) references.add(match[1]);
  }
  for (const match of html.matchAll(/url\(\s*["']?(images\/[^"'\)]+)["']?\s*\)/gu)) {
    references.add(match[1]);
  }
  return [...references].sort();
}

async function assertPreviewImages(outputDir) {
  const html = await readFile(join(outputDir, "email.html"), "utf8");
  for (const reference of localImageRefs(html)) {
    const path = join(outputDir, ...reference.split("/"));
    const info = await stat(path);
    if (!info.isFile() || info.size === 0) {
      throw new Error("Preview image is empty or invalid: " + reference);
    }
  }
}

async function main() {
  const { modelPath, viewport, outputDir } = parseArguments(process.argv.slice(2));
  const result = spawnSync(process.execPath, [
    join(repoRoot, "scripts/render-email.mjs"),
    "--model", modelPath,
    "--output", outputDir,
  ], { cwd: repoRoot, encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.stderr.write(result.stderr || "Email rendering failed.\n");
    process.exitCode = result.status ?? 1;
    return;
  }
  await assertPreviewImages(outputDir);
  await writeFile(join(outputDir, "preview.html"), previewPage(viewport), "utf8");
  process.stdout.write(join(outputDir, "preview.html") + "\n");
}

main().catch((error) => {
  process.stderr.write(error.message + "\n");
  process.exitCode = error.message === usage ? 2 : 1;
});
