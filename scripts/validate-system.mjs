import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  SystemValidationError,
  formatDiagnostic,
} from "./lib/diagnostics.mjs";
import { validateSystem } from "./lib/system-manifest.mjs";

function parseArguments(args) {
  if (args.length === 0) {
    return { repoRoot: process.cwd(), errors: [] };
  }
  if (args.length === 2 && args[0] === "--repo-root" && args[1]) {
    return { repoRoot: resolve(args[1]), errors: [] };
  }
  return {
    repoRoot: null,
    errors: [
      new SystemValidationError(
        "cli-arguments",
        "/cli",
        "Usage: node scripts/validate-system.mjs [--repo-root <path>]",
      ),
    ],
  };
}

export async function main(args = process.argv.slice(2)) {
  const parsed = parseArguments(args);
  if (parsed.errors.length > 0) {
    for (const error of parsed.errors) {
      console.error(formatDiagnostic(error));
    }
    return 1;
  }

  const result = await validateSystem({ repoRoot: parsed.repoRoot });
  if (result.errors.length > 0) {
    for (const error of result.errors) {
      console.error(formatDiagnostic(error));
    }
    return 1;
  }

  console.log("[PASS] CUPIS system validation passed.");
  return 0;
}

const isDirectExecution =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
  process.exitCode = await main();
}
