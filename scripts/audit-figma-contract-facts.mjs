import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  listComponentRecords,
  loadComponentRegistries,
} from "./lib/component-registry.mjs";
import { auditFigmaContractFacts } from "./lib/figma-contract-facts.mjs";

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
    const proofManifest = JSON.parse(await readFile(
      resolve(parsed.repoRoot, "data/evidence/derived-email-geometry.json"), "utf8"));
    const derivedEvidence = [];
    for (const bundle of proofManifest.evidence ?? []) {
      if (bundle.component_id !== parsed.componentId) continue;
      const capturePath = resolve(parsed.repoRoot, bundle.capture_path);
      const relation = relative(parsed.repoRoot, capturePath);
      if (relation.startsWith("..") || isAbsolute(relation)) {
        throw new Error("Derived evidence path escapes repository root.");
      }
      const captureText = (await readFile(capturePath, "utf8")).replace(/\r\n/gu, "\n");
      const capture = JSON.parse(captureText);
      if (capture.figma_file_key !== entry.record.figma.file_key) {
        throw new Error("Derived evidence refers to a different Figma file.");
      }
      const actualSha = createHash("sha1")
        .update(`blob ${Buffer.byteLength(captureText)}\0`)
        .update(captureText).digest("hex");
      if (actualSha !== bundle.source_blob_sha) {
        throw new Error("Derived evidence capture SHA does not match its pinned blob.");
      }
      derivedEvidence.push(...bundle.facts.map((fact) => ({
        component_id: bundle.component_id,
        source_blob_sha: actualSha,
        contract_path: fact.contract_path,
        value: fact.value,
      })));
    }
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
