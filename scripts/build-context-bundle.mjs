import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  buildContextBundle,
  renderContextBundle,
} from "./lib/context-bundle.mjs";
import {
  SystemValidationError,
  formatDiagnostic,
} from "./lib/diagnostics.mjs";

const USAGE =
  "Usage: node scripts/build-context-bundle.mjs --route <route-id> [--component <stable-id>]... [--viewport mobile|desktop|both] [--foundation typography|spacing|assets|figma-naming]...";

function argumentError(code = "CONTEXT_BUNDLE_CLI_ARGUMENTS") {
  return new SystemValidationError(code, "/cli", USAGE);
}

export function parseViewport(value) {
  if (value === "both") return ["mobile", "desktop"];
  if (value === "mobile" || value === "desktop") return [value];
  throw argumentError("CONTEXT_BUNDLE_VIEWPORT_INVALID");
}

export function parseArguments(args) {
  let routeId = null;
  let viewportValue = null;
  const componentIds = [];
  const foundationIds = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    const value = args[index + 1];
    if (
      !["--route", "--component", "--viewport", "--foundation"].includes(
        argument,
      ) ||
      !value ||
      value.startsWith("--")
    ) {
      throw argumentError();
    }

    if (argument === "--route") {
      if (routeId !== null) throw argumentError();
      routeId = value;
    } else if (argument === "--component") {
      componentIds.push(value);
    } else if (argument === "--viewport") {
      if (viewportValue !== null) throw argumentError();
      viewportValue = value;
    } else {
      foundationIds.push(value);
    }
    index += 1;
  }

  if (routeId === null) throw argumentError();
  return {
    routeId,
    candidates: componentIds.map((id) => ({ id })),
    viewports: viewportValue === null ? [] : parseViewport(viewportValue),
    foundationIds,
  };
}

function diagnosticsFrom(error) {
  if (error instanceof AggregateError) return error.errors;
  if (error instanceof SystemValidationError) return [error];
  return [
    new SystemValidationError(
      "CONTEXT_BUNDLE_CLI_FAILURE",
      "/cli",
      "The context bundle command failed.",
    ),
  ];
}

export async function main(args = process.argv.slice(2)) {
  let selection;
  try {
    selection = parseArguments(args);
  } catch (error) {
    for (const diagnostic of diagnosticsFrom(error)) {
      console.error(formatDiagnostic(diagnostic));
    }
    return 1;
  }

  try {
    const result = await buildContextBundle({
      repoRoot: process.cwd(),
      ...selection,
    });
    if (result.status === "blocked") {
      for (const blocker of result.blockers) {
        console.error(formatDiagnostic(blocker));
      }
      return 1;
    }
    process.stdout.write(renderContextBundle(result.bundle));
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
