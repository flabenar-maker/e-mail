import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  indexComponentRegistries,
  loadComponentRegistries,
} from "./lib/component-registry.mjs";
import {
  compareFigmaComponentSnapshot,
  normalizeFigmaComponentSnapshot,
} from "./lib/figma-component-snapshot.mjs";
import { formatDiagnostic, SystemValidationError } from "./lib/diagnostics.mjs";

function parseArguments(args) {
  const values = new Map();
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (
      !["--repo-root", "--snapshot"].includes(key) ||
      !value ||
      values.has(key)
    ) {
      return null;
    }
    values.set(key, value);
  }
  if (
    args.length !== 4 ||
    !values.has("--repo-root") ||
    !values.has("--snapshot")
  ) {
    return null;
  }
  return {
    repoRoot: resolve(values.get("--repo-root")),
    snapshot: resolve(values.get("--snapshot")),
  };
}

function reportError(code, message) {
  console.error(
    formatDiagnostic(new SystemValidationError(code, "/cli", message)),
  );
}

export async function main(args = process.argv.slice(2)) {
  const parsed = parseArguments(args);
  if (!parsed) {
    reportError(
      "cli-arguments",
      "Usage: node scripts/compare-figma-registry.mjs --repo-root <path> --snapshot <path>",
    );
    return 1;
  }

  try {
    const [rawSnapshot, registries] = await Promise.all([
      readFile(parsed.snapshot, "utf8").then(JSON.parse),
      loadComponentRegistries({ repoRoot: parsed.repoRoot }),
    ]);
    const snapshot = normalizeFigmaComponentSnapshot(rawSnapshot);
    const componentIndex = indexComponentRegistries(registries);
    const drifts = compareFigmaComponentSnapshot({
      snapshot,
      registries,
      componentIndex,
    });
    console.log(
      JSON.stringify(
        {
          status: drifts.length === 0 ? "clean" : "drift",
          drifts,
        },
        null,
        2,
      ),
    );
    return drifts.length === 0 ? 0 : 1;
  } catch {
    reportError(
      "figma-component-snapshot-read",
      "Figma component snapshot or component registries could not be read.",
    );
    return 1;
  }
}

const isDirectExecution =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
  process.exitCode = await main();
}
