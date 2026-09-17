import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { SystemValidationError } from "./lib/diagnostics.mjs";
import { resolveSkillContext } from "./lib/skill-context.mjs";

const USAGE =
  "Usage: node scripts/resolve-skill-context.mjs --route <route-id> [--mode <workflow-mode>] [--component <stable-id>]... [--viewport mobile|desktop|both] [--foundation typography|spacing|assets|figma-naming]...";

function argumentError(code = "SKILL_CONTEXT_CLI_ARGUMENTS") {
  return new SystemValidationError(code, "/cli", USAGE);
}

export function parseViewport(value) {
  if (value === "both") return ["mobile", "desktop"];
  if (value === "mobile" || value === "desktop") return [value];
  throw argumentError("SKILL_CONTEXT_VIEWPORT_INVALID");
}

export function parseArguments(args) {
  let routeId = null;
  let workflowMode = null;
  let viewportValue = null;
  const componentIds = [];
  const foundationIds = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    const value = args[index + 1];
    if (
      ![
        "--route",
        "--mode",
        "--component",
        "--viewport",
        "--foundation",
      ].includes(argument) ||
      !value ||
      value.startsWith("--")
    ) {
      throw argumentError();
    }

    if (argument === "--route") {
      if (routeId !== null) throw argumentError();
      routeId = value;
    } else if (argument === "--mode") {
      if (workflowMode !== null) throw argumentError();
      workflowMode = value;
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
    workflowMode,
    candidates: componentIds.map((id) => ({ id })),
    viewports: viewportValue === null ? [] : parseViewport(viewportValue),
    foundationIds,
  };
}

function blockedFrom(error) {
  if (error instanceof SystemValidationError) {
    return {
      status: "blocked",
      blockers: [
        { code: error.code, path: error.path, message: error.message },
      ],
    };
  }
  return {
    status: "blocked",
    blockers: [
      {
        code: "SKILL_CONTEXT_CLI_FAILURE",
        path: "/cli",
        message: "The skill context command failed.",
      },
    ],
  };
}

function writeResult(result) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

export async function main(args = process.argv.slice(2)) {
  let selection;
  try {
    selection = parseArguments(args);
  } catch (error) {
    writeResult(blockedFrom(error));
    return 1;
  }

  try {
    const result = await resolveSkillContext({
      repoRoot: process.cwd(),
      ...selection,
    });
    writeResult(result);
    return result.status === "blocked" ? 1 : 0;
  } catch (error) {
    writeResult(blockedFrom(error));
    return 1;
  }
}

const isDirectExecution =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
  process.exitCode = await main();
}
