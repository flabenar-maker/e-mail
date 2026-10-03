import { createHash } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { listComponentRecords, loadComponentRegistries } from "./lib/component-registry.mjs";
import { auditFigmaComponentEvidence } from "./lib/figma-component-evidence.mjs";
import { loadComponentEvidenceModel, loadComponentEvidenceSession } from "./lib/component-evidence-inputs.mjs";
import { loadDerivedEmailEvidence } from "./lib/derived-email-facts.mjs";
import { SystemValidationError } from "./lib/diagnostics.mjs";

function parseArguments(args) {
  if (![6, 10].includes(args.length)) return null;
  const values = new Map();
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index], value = args[index + 1];
    if (!["--repo-root", "--component-id", "--live", "--canonical-sha", "--evidence-session"].includes(name) ||
        typeof value !== "string" || !value || values.has(name)) return null;
    values.set(name, value);
  }
  if (!["--repo-root", "--component-id", "--live"].every(name => values.has(name)) ||
      values.has("--canonical-sha") !== values.has("--evidence-session")) return null;
  return { repoRoot: resolve(values.get("--repo-root")), componentId: values.get("--component-id"),
    livePath: resolve(values.get("--live")), canonicalSha: values.get("--canonical-sha"),
    sessionPath: values.has("--evidence-session") ? resolve(values.get("--evidence-session")) : undefined };
}

// Session loader owns containment and recorded hashes. Bind the CLI's separate
// --live argument to that very file and its exact bytes, not equivalent JSON.
async function bindLivePacket(parsed, session, liveBytes) {
  const captures = session.captures.filter(capture => capture.component_id === parsed.componentId);
  const mismatch = () => { throw new SystemValidationError("EVIDENCE_LIVE_PACKET_MISMATCH", "/live", "--live must name the selected owner's exact session packet and match its recorded bytes."); };
  if (captures.length !== 1) mismatch();
  const capture = captures[0];
  const sessionDirectory = dirname(await realpath(parsed.sessionPath));
  const packetPath = await realpath(resolve(sessionDirectory, capture.packet_path.replaceAll("\\", "/")));
  if (await realpath(parsed.livePath) !== packetPath ||
      createHash("sha256").update(liveBytes).digest("hex") !== capture.packet_sha256) mismatch();
}

function inputIssues(error, componentId) {
  if (error instanceof AggregateError) return error.errors.flatMap(item => inputIssues(item, componentId));
  if (error instanceof SystemValidationError || /^EVIDENCE_/u.test(error?.code ?? "")) {
    return [{ code: error.code, path: error.path, message: error.message, component_id: componentId }];
  }
  return [{ code: "FIGMA_FACT_AUDIT_INPUT_INVALID", component_id: componentId,
    message: error instanceof Error ? error.message : String(error) }];
}

export async function main(args = process.argv.slice(2)) {
  const parsed = parseArguments(args);
  if (!parsed) {
    console.error(JSON.stringify({ ok: false, issues: [{ code: "LIVE_FIGMA_REQUIRED",
      message: "Usage: node scripts/audit-figma-contract-facts.mjs --repo-root <path> --component-id <id> --live <fresh-Figma-MCP-packet.json> [--canonical-sha <sha> --evidence-session <session.json>]" }] }));
    return 1;
  }
  try {
    const liveBytes = await readFile(parsed.livePath);
    const live = JSON.parse(liveBytes.toString("utf8"));
    let model, session, records;
    if (parsed.sessionPath) {
      [model, session] = await Promise.all([
        loadComponentEvidenceModel({ repoRoot: parsed.repoRoot, canonicalSha: parsed.canonicalSha }),
        loadComponentEvidenceSession({ sessionPath: parsed.sessionPath, canonicalSha: parsed.canonicalSha }),
      ]);
      records = model.records;
      await bindLivePacket(parsed, session, liveBytes);
    } else records = listComponentRecords(await loadComponentRegistries({ repoRoot: parsed.repoRoot })).map(({ record }) => record);
    const record = records.find(candidate => candidate.id === parsed.componentId);
    if (!record) {
      console.error(JSON.stringify({ ok: false, issues: [{ code: "COMPONENT_UNKNOWN", component_id: parsed.componentId }] }));
      return 1;
    }
    const derivedEvidence = await loadDerivedEmailEvidence({ repoRoot: parsed.repoRoot, record });
    const report = auditFigmaComponentEvidence({ record, live, model, session, derivedEvidence });
    console.log(JSON.stringify(report, null, 2));
    return report.ok ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({ ok: false, issues: inputIssues(error, parsed.componentId) }));
    return 1;
  }
}

const isDirectExecution = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isDirectExecution) process.exitCode = await main();
