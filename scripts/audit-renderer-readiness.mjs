import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { loadComponentRegistries } from "./lib/component-registry.mjs";
import { loadRendererRegistry } from "./lib/renderer-registry.mjs";
import {
  SystemValidationError,
  formatDiagnostic,
} from "./lib/diagnostics.mjs";
import { auditRendererReadiness } from "./lib/renderer-readiness.mjs";

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
        "Usage: node scripts/audit-renderer-readiness.mjs [--repo-root <path>]",
      ),
    ],
  };
}

function reportErrors(errors) {
  for (const error of errors) {
    console.error(formatDiagnostic(error));
  }
}

export async function main(args = process.argv.slice(2)) {
  const parsed = parseArguments(args);
  if (parsed.errors.length > 0) {
    reportErrors(parsed.errors);
    return 1;
  }

  try {
    const [registries, rendererRegistry] = await Promise.all([
      loadComponentRegistries({ repoRoot: parsed.repoRoot }),
      loadRendererRegistry({ repoRoot: parsed.repoRoot }),
    ]);
    console.log(
      JSON.stringify(
        auditRendererReadiness(registries, rendererRegistry),
        null,
        2,
      ),
    );
    return 0;
  } catch (error) {
    if (error instanceof AggregateError) {
      reportErrors(error.errors);
    } else if (error instanceof SystemValidationError) {
      reportErrors([error]);
    } else {
      reportErrors([
        new SystemValidationError(
          "renderer-readiness-read",
          "/data/components",
          "Component registries could not be read for renderer readiness.",
        ),
      ]);
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
