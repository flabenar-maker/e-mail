import { createHash } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, win32 } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { loadSystemManifest } from "./system-manifest.mjs";
import { listComponentRecords, loadComponentRegistries } from "./component-registry.mjs";
import { loadRenderingFoundation, validateRenderingSemantics } from "./rendering-foundation.mjs";
import { resolveEvidenceTargets } from "./component-evidence-links.mjs";

// This loader proves input consistency, not MCP origin or a cloud commit's
// identity. The executing agent must verify raw snapshot bytes against the
// pinned Git tree and retain real MCP call receipts. No network or writes here.
const SHA = /^[a-f0-9]{40}$/u;
const SHA256 = /^[a-f0-9]{64}$/u;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ROOT_ID = /^[0-9]+:[0-9]+$/u;
const NODE_ID = /^(?:[0-9]+:[0-9]+|I[0-9]+:[0-9]+(?:;[0-9]+:[0-9]+)+)$/u;
const UTC = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]{3})?Z$/u;
const CONTAINERS = new Set(["COMPONENT", "COMPONENT_SET", "FRAME", "GROUP", "INSTANCE", "SECTION", "SLOT"]);

function fail(code, path, message) {
  throw new SystemValidationError(code, path, message);
}

function matches(pattern, value) {
  return typeof value === "string" && !/[\r\n]/u.test(value) && pattern.test(value);
}

function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function closed(value, keys) {
  return object(value) && keys.every((key) => Object.hasOwn(value, key)) &&
    Object.keys(value).every((key) => keys.includes(key));
}

function requireSha(value) {
  if (!matches(SHA, value)) fail("EVIDENCE_CANONICAL_SHA_INVALID", "/canonical_sha", "Canonical SHA must be exactly 40 lowercase hexadecimal characters.");
}

function timestamp(value, path) {
  const parsed = matches(UTC, value) ? Date.parse(value) : NaN;
  // Date.parse normalizes impossible calendar dates; round-trip rejects them.
  const normalized = typeof value === "string" && !value.includes(".") ? value.replace("Z", ".000Z") : value;
  if (!Number.isFinite(parsed) || new Date(parsed).toISOString() !== normalized) {
    fail("EVIDENCE_TIMESTAMP_INVALID", path, "Timestamp must be a real UTC date, with seconds or millisecond precision and a Z suffix.");
  }
  return parsed;
}

function inside(root, target) {
  const relation = relative(root, target);
  return relation !== "" && relation !== ".." && !relation.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) && !isAbsolute(relation);
}

async function containedFile(root, path, diagnosticPath, code, readCode) {
  // Reject both Windows and POSIX spellings independently of execution OS.
  if (typeof path !== "string" || !path || /[\u0000-\u001f:]/u.test(path) ||
      isAbsolute(path) || win32.isAbsolute(path) ||
      path.split(/[\\/]/u).some((part) => part === "..")) {
    fail(code, diagnosticPath, "Path must be relative and stay inside the declared input directory.");
  }
  const candidate = resolve(root, path.replaceAll("\\", "/"));
  if (!inside(root, candidate)) fail(code, diagnosticPath, "Path escapes the declared input directory.");
  let actual;
  try { actual = await realpath(candidate); }
  catch { fail(readCode, diagnosticPath, "Input file could not be resolved."); }
  if (!inside(root, actual)) fail(code, diagnosticPath, "Resolved path escapes the declared input directory.");
  return actual;
}

async function requiredSource(manifest, root, id, kind) {
  const entries = manifest.sources.filter((source) => source.id === id);
  if (entries.length !== 1 || entries[0].kind !== kind) {
    fail("EVIDENCE_SOURCE_UNREGISTERED", `/sources/${id}`, `Exactly one ${kind} source must be registered for ${id}.`);
  }
  await containedFile(root, entries[0].path, `/sources/${id}/path`, "EVIDENCE_SOURCE_PATH_INVALID", "EVIDENCE_SOURCE_READ");
  return entries[0];
}

export async function loadComponentEvidenceModel({ repoRoot, canonicalSha } = {}) {
  requireSha(canonicalSha);
  const root = await realpath(repoRoot);
  const manifest = await loadSystemManifest({ repoRoot: root });
  const sources = new Map();
  for (const [id, kind] of [
    ["components-shared", "registry"], ["components-marketing", "registry"], ["components-service", "registry"],
    ["components-schema", "schema"], ["rendering-foundation", "registry"], ["rendering-schema", "schema"],
  ]) sources.set(id, await requiredSource(manifest, root, id, kind));

  const [registries, rendering] = await Promise.all([
    loadComponentRegistries({ repoRoot: root,
      sources: Object.fromEntries(["shared", "marketing", "service"].map((library) => [library, sources.get(`components-${library}`).path])),
      schemaPath: sources.get("components-schema").path,
    }),
    loadRenderingFoundation({ repoRoot: root,
      dataPath: sources.get("rendering-foundation").path, schemaPath: sources.get("rendering-schema").path,
    }),
  ]);
  const records = listComponentRecords(registries).map(({ record }) => record);
  const sourceDocuments = new Map([
    ...Object.entries(registries).map(([library, document]) => [`components-${library}`, document]),
    ["rendering-foundation", rendering],
  ]);
  // resolveEvidenceTargets includes pure reference validation; no second copy
  // of identity/target rules and no recursive full-system validator invocation.
  const { targets, issues } = resolveEvidenceTargets({ records, manifest, sourceDocuments });
  const errors = [...validateRenderingSemantics(rendering), ...issues];
  if (errors.length) throw new AggregateError(errors, "Component evidence model validation failed.");
  return { canonical_sha: canonicalSha, manifest, records, source_documents: sourceDocuments, targets };
}

async function readJson(path, diagnosticPath, code) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch { fail(code, diagnosticPath, "JSON input could not be read or parsed."); }
}

function validatePacket(packet, path) {
  if (!object(packet)) fail("EVIDENCE_PACKET_SHAPE_INVALID", path, "Capture packet must be an object.");
  if (packet.capture_version !== "1.1.0") {
    fail("EVIDENCE_CAPTURE_VERSION_UNSUPPORTED", `${path}/capture_version`, "Component evidence requires capture version 1.1.0.");
  }
  if (typeof packet.file_key !== "string" || !packet.file_key.trim() || !matches(ROOT_ID, packet.component_node_id) ||
      !Array.isArray(packet.component_properties) || !Array.isArray(packet.capture_errors) ||
      !Array.isArray(packet.variants) || packet.variants.length === 0 ||
      !closed(packet.capture_meta, ["started_at", "completed_at", "tree_complete", "node_count"])) {
    fail("EVIDENCE_PACKET_SHAPE_INVALID", path, "Capture identity, variants, prior fact fields and complete metadata are required.");
  }
  if (packet.capture_meta.tree_complete !== true) {
    fail("EVIDENCE_CAPTURE_INCOMPLETE", `${path}/capture_meta/tree_complete`, "A partial capture cannot prove component evidence.");
  }
  const queue = [];
  for (const [index, variant] of packet.variants.entries()) {
    if (!object(variant) || !matches(ROOT_ID, variant.variant_node_id) || !Array.isArray(variant.axes) || !object(variant.source_node)) {
      fail("EVIDENCE_PACKET_SHAPE_INVALID", `${path}/variants/${index}`, "Each variant requires an exact ID, axes and source tree.");
    }
    queue.push(variant.source_node);
  }
  let count = 0;
  while (queue.length) {
    const node = queue.pop();
    if (!object(node) || !matches(NODE_ID, node.node_id) || typeof node.node_type !== "string" || !node.node_type ||
        ((Object.hasOwn(node, "children") || CONTAINERS.has(node.node_type)) && !Array.isArray(node.children))) {
      fail("EVIDENCE_PACKET_SHAPE_INVALID", `${path}/variants`, "Every node needs identity and every container needs its full children array.");
    }
    count += 1;
    if (node.children) queue.push(...node.children);
  }
  if (!Number.isSafeInteger(packet.capture_meta.node_count) || packet.capture_meta.node_count !== count) {
    fail("EVIDENCE_CAPTURE_NODE_COUNT_MISMATCH", `${path}/capture_meta/node_count`, "Captured node count must equal all serialized variant-tree nodes, including hidden descendants.");
  }
}

export async function loadComponentEvidenceSession({ sessionPath, canonicalSha } = {}) {
  requireSha(canonicalSha);
  let actualSessionPath;
  try { actualSessionPath = await realpath(sessionPath); }
  catch { fail("EVIDENCE_SESSION_READ", "/session", "Session file could not be resolved."); }
  const root = dirname(actualSessionPath);
  const session = await readJson(actualSessionPath, "/session", "EVIDENCE_SESSION_READ");
  if (!object(session) || session.schema_version !== "1.0.0") {
    fail("EVIDENCE_SESSION_VERSION_UNSUPPORTED", "/schema_version", "Component evidence session requires schema version 1.0.0.");
  }
  if (!closed(session, ["schema_version", "canonical_git_sha", "started_at", "completed_at", "component_ids", "captures"]) ||
      !Array.isArray(session.component_ids) || session.component_ids.length === 0 ||
      session.component_ids.some((id) => !matches(ID, id)) || new Set(session.component_ids).size !== session.component_ids.length ||
      !Array.isArray(session.captures)) {
    fail("EVIDENCE_SESSION_SHAPE_INVALID", "/session", "Session requires exact fields, unique selected component IDs and capture receipts.");
  }
  if (session.canonical_git_sha !== canonicalSha) {
    fail("EVIDENCE_SESSION_SHA_MISMATCH", "/canonical_git_sha", "Session and canonical model must use the same pinned SHA.");
  }
  const start = timestamp(session.started_at, "/started_at");
  const end = timestamp(session.completed_at, "/completed_at");
  if (start > end) fail("EVIDENCE_CAPTURE_TIME_INVALID", "/completed_at", "Session completion precedes its start.");
  const selected = new Set(session.component_ids);
  const seen = new Set();
  // Validate selection/duplicates before reading any packet, so duplicate
  // receipts cannot be hidden by an unrelated missing or malformed file.
  for (const [index, entry] of session.captures.entries()) {
    const path = `/captures/${index}`;
    if (!closed(entry, ["component_id", "receipt_id", "tool", "received_at", "packet_path", "packet_sha256"]) ||
        !matches(ID, entry.component_id) || entry.tool !== "use_figma" ||
        typeof entry.receipt_id !== "string" || !entry.receipt_id.trim() ||
        typeof entry.packet_sha256 !== "string") {
      fail("EVIDENCE_SESSION_SHAPE_INVALID", path, "Capture receipt fields must match the session format exactly.");
    }
    if (!selected.has(entry.component_id)) fail("EVIDENCE_CAPTURE_UNSELECTED", `${path}/component_id`, "Capture owner is not selected in this session.");
    if (seen.has(entry.component_id)) fail("EVIDENCE_CAPTURE_DUPLICATE", `${path}/component_id`, "Only one packet per selected owner is allowed.");
    seen.add(entry.component_id);
  }
  if (selected.size !== seen.size) fail("EVIDENCE_CAPTURE_MISSING", "/captures", "Every selected owner requires one capture packet.");

  const captures = [];
  for (const [index, entry] of session.captures.entries()) {
    const path = `/captures/${index}`;
    if (!matches(SHA256, entry.packet_sha256)) fail("EVIDENCE_SESSION_SHAPE_INVALID", `${path}/packet_sha256`, "Packet digest must be exactly 64 lowercase hexadecimal characters.");
    const packetPath = await containedFile(root, entry.packet_path, `${path}/packet_path`, "EVIDENCE_PACKET_PATH_INVALID", "EVIDENCE_PACKET_READ");
    let bytes;
    try { bytes = await readFile(packetPath); }
    catch { fail("EVIDENCE_PACKET_READ", `${path}/packet_path`, "Capture packet could not be read."); }
    if (createHash("sha256").update(bytes).digest("hex") !== entry.packet_sha256) {
      fail("EVIDENCE_PACKET_HASH_MISMATCH", `${path}/packet_sha256`, "Capture bytes do not match the recorded SHA-256 digest.");
    }
    let packet;
    try { packet = JSON.parse(bytes.toString("utf8")); }
    catch { fail("EVIDENCE_PACKET_READ", `${path}/packet_path`, "Capture packet is not valid JSON."); }
    validatePacket(packet, `${path}/packet`);
    const captureStart = timestamp(packet.capture_meta.started_at, `${path}/packet/capture_meta/started_at`);
    const captureEnd = timestamp(packet.capture_meta.completed_at, `${path}/packet/capture_meta/completed_at`);
    const received = timestamp(entry.received_at, `${path}/received_at`);
    if (!(start <= captureStart && captureStart <= captureEnd && captureEnd <= received && received <= end)) {
      fail("EVIDENCE_CAPTURE_TIME_INVALID", path, "Required ordering: session start <= capture start <= capture end <= receipt <= session end.");
    }
    captures.push({ ...entry, packet });
  }
  return { ...session, captures };
}
