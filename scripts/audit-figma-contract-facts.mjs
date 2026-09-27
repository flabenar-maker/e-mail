import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  listComponentRecords,
  loadComponentRegistries,
} from "./lib/component-registry.mjs";
import { auditFigmaContractFacts } from "./lib/figma-contract-facts.mjs";
import { loadDerivedEmailEvidence } from "./lib/derived-email-facts.mjs";

function parseArguments(args) {
  if (args.length !== 6) return null;
  const values = new Map();
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    const value = args[index + 1];
    if (!["--repo-root", "--component-id", "--live"].includes(name) ||
        typeof value !== "string" || !value || values.has(name)) return null;
    values.set(name, value);
  }
  if (values.size !== 3) return null;
  return {
    repoRoot: resolve(values.get("--repo-root")),
    componentId: values.get("--component-id"),
    livePath: resolve(values.get("--live")),
  };
}

export async function main(args = process.argv.slice(2)) {
  const parsed = parseArguments(args);
  if (!parsed) {
    console.error(JSON.stringify({
      ok: false,
      issues: [{ code: "LIVE_FIGMA_REQUIRED", message: "Usage: node scripts/audit-figma-contract-facts.mjs --repo-root <path> --component-id <id> --live <fresh-Figma-MCP-packet.json>" }],
    }));
    return 1;
  }
  try {
    const [registries, live] = await Promise.all([
      loadComponentRegistries({ repoRoot: parsed.repoRoot }),
      readFile(parsed.livePath, "utf8").then(JSON.parse),
    ]);
    const entry = listComponentRecords(registries).find(({ record }) => record.id === parsed.componentId);
    if (!entry) {
      console.error(JSON.stringify({
        ok: false,
        issues: [{ code: "COMPONENT_UNKNOWN", component_id: parsed.componentId }],
      }));
      return 1;
    }
    const derivedEvidence = await loadDerivedEmailEvidence({
      repoRoot: parsed.repoRoot,
      record: entry.record,
    });
    const report = auditFigmaContractFacts({
      record: entry.record,
      live,
      derivedEvidence,
    });
    console.log(JSON.stringify(report, null, 2));
    return report.ok ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({
      ok: false,
      issues: [{
        code: "FIGMA_FACT_AUDIT_INPUT_INVALID",
        component_id: parsed.componentId,
        message: error instanceof Error ? error.message : String(error),
      }],
    }));
    return 1;
  }
}

const isDirectExecution =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
  process.exitCode = await main();
}
