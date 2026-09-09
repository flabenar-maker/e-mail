import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  SystemValidationError,
  formatDiagnostic,
} from "./lib/diagnostics.mjs";
import {
  compareGeneratedDocs,
  renderAllGeneratedDocs,
} from "./lib/generated-docs.mjs";
import { loadSystemManifest } from "./lib/system-manifest.mjs";

const USAGE =
  "Usage: node scripts/generate-docs.mjs (--write|--check) [--repo-root <path>]";

function argumentError(message = USAGE) {
  return new SystemValidationError("cli-arguments", "/cli", message);
}

export function parseArguments(args) {
  let mode = null;
  let repoRoot = process.cwd();
  const errors = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--write" || argument === "--check") {
      const nextMode = argument.slice(2);
      if (mode) {
        errors.push(argumentError());
      } else {
        mode = nextMode;
      }
      continue;
    }
    if (argument === "--repo-root") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        errors.push(argumentError());
      } else {
        repoRoot = resolve(value);
        index += 1;
      }
      continue;
    }
    errors.push(argumentError());
  }

  if (!mode) errors.push(argumentError());
  return { mode, repoRoot, errors: errors.slice(0, 1) };
}

function outputPath(repoRoot, path) {
  const root = resolve(repoRoot);
  const target = resolve(root, path);
  const relation = relative(root, target);
  if (relation.startsWith("..") || isAbsolute(relation)) {
    throw new SystemValidationError(
      "GENERATED_DOC_PATH_ESCAPE",
      `/${String(path).replaceAll("\\", "/")}`,
      `Generated documentation path escapes the repository root: ${path}.`,
    );
  }
  return target;
}

async function writeGeneratedDocs({ repoRoot, rendered }) {
  for (const [path, content] of [...rendered].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const target = outputPath(repoRoot, path);
    await mkdir(dirname(target), { recursive: true });
    let current = null;
    try {
      current = await readFile(target, "utf8");
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    if (current !== content) {
      await writeFile(target, content, "utf8");
    }
  }
}

function diagnosticsFrom(error) {
  if (error instanceof AggregateError) return error.errors;
  if (error instanceof SystemValidationError) return [error];
  return [
    new SystemValidationError(
      "GENERATED_DOC_FAILURE",
      "/generated_docs",
      "Generated documentation operation failed.",
    ),
  ];
}

export async function main(args = process.argv.slice(2)) {
  const parsed = parseArguments(args);
  if (parsed.errors.length > 0) {
    for (const error of parsed.errors) console.error(formatDiagnostic(error));
    return 1;
  }

  try {
    const manifest = await loadSystemManifest({ repoRoot: parsed.repoRoot });
    const rendered = await renderAllGeneratedDocs({
      repoRoot: parsed.repoRoot,
      manifest,
    });

    if (parsed.mode === "check") {
      const errors = await compareGeneratedDocs({
        repoRoot: parsed.repoRoot,
        rendered,
      });
      if (errors.length > 0) {
        for (const error of errors) console.error(formatDiagnostic(error));
        return 1;
      }
      console.log("[PASS] Generated documentation is current.");
      return 0;
    }

    await writeGeneratedDocs({ repoRoot: parsed.repoRoot, rendered });
    console.log(`[PASS] Wrote ${rendered.size} generated documentation files.`);
    return 0;
  } catch (error) {
    for (const diagnostic of diagnosticsFrom(error)) {
      console.error(formatDiagnostic(diagnostic));
    }
    return 1;
  }
}

const isDirectExecution =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
  process.exitCode = await main();
}
