import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { formatDiagnostic, SystemValidationError } from "./lib/diagnostics.mjs";
import { normalizeFigmaComponentSnapshot } from "./lib/figma-component-snapshot.mjs";

function parseArguments(args) {
  const values = new Map();
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (
      !["--input", "--output"].includes(key) ||
      !value ||
      values.has(key)
    ) {
      return null;
    }
    values.set(key, value);
  }
  if (args.length !== 4 || !values.has("--input") || !values.has("--output")) {
    return null;
  }
  return {
    input: resolve(values.get("--input")),
    output: resolve(values.get("--output")),
  };
}

function cliError(code, message) {
  return new SystemValidationError(code, "/cli", message);
}

export async function main(args = process.argv.slice(2)) {
  const parsed = parseArguments(args);
  if (!parsed) {
    console.error(
      formatDiagnostic(
        cliError(
          "cli-arguments",
          "Usage: node scripts/normalize-figma-snapshot.mjs --input <path> --output <path>",
        ),
      ),
    );
    return 1;
  }

  try {
    const raw = JSON.parse(await readFile(parsed.input, "utf8"));
    const normalized = normalizeFigmaComponentSnapshot(raw);
    await writeFile(parsed.output, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
    console.log("[PASS] Figma component snapshot normalized.");
    return 0;
  } catch {
    console.error(
      formatDiagnostic(
        cliError(
          "figma-component-snapshot-read",
          "Figma component snapshot could not be read or normalized.",
        ),
      ),
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
