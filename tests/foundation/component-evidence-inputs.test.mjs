import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, symlink } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { createSystemFixture, copyFixtureFile, writeFixtureFile } from "../helpers/system-fixture.mjs";
import { parseStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import { loadComponentEvidenceModel, loadComponentEvidenceSession } from "../../scripts/lib/component-evidence-inputs.mjs";

const REPO = fileURLToPath(new URL("../../", import.meta.url));
const SHA = "a".repeat(40);
const nonce = value => value.toString(16).padStart(64, "0");
const SESSION_NONCE = nonce(1);
const REQUEST_NONCE = nonce(2);
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const hasCode = (code) => (error) => error.code === code || error.errors?.some((entry) => entry.code === code);

// All packets, timestamps and receipt IDs here are synthetic, not live MCP proof.
function packetFixture() {
  return {
    capture_version: "1.2.0", file_key: "synthetic-file", component_node_id: "1:1",
    component_properties: [], capture_errors: [],
    capture_meta: { started_at: "2040-01-01T09:00:01.000Z", completed_at: "2040-01-01T09:00:02.000Z", request: { session_nonce: SESSION_NONCE, request_nonce: REQUEST_NONCE, canonical_git_sha: SHA }, tree_complete: true, node_count: 2 },
    variants: [{ variant_node_id: "1:1", axes: [], source_node: {
      node_id: "1:1", node_type: "COMPONENT", children: [{ node_id: "I1:1;2:1", node_type: "INSTANCE", main_component_id: "3:1", children: [] }],
    } }],
  };
}

async function sessionFixture(t, change = () => {}) {
  const fixture = await createSystemFixture();
  t.after(() => fixture.cleanup());
  const packet = packetFixture();
  const session = {
    schema_version: "1.1.0", canonical_git_sha: SHA, session_nonce: SESSION_NONCE,
    started_at: "2026-10-02T09:00:00.000Z", completed_at: "2026-10-02T09:00:04.000Z",
    component_ids: ["synthetic-owner"], captures: [{ component_id: "synthetic-owner", receipt_id: "synthetic-receipt-1",
      tool: "use_figma", request_nonce: REQUEST_NONCE, requested_at: "2026-10-02T09:00:01.000Z", received_at: "2026-10-02T09:00:03.000Z", packet_path: "packets/owner.json", packet_sha256: "" }],
  };
  change({ session, packet });
  const bytes = JSON.stringify(packet);
  if (!session.captures[0].packet_sha256) session.captures[0].packet_sha256 = digest(bytes);
  await writeFixtureFile(fixture.root, "packets/owner.json", bytes);
  const sessionPath = await writeFixtureFile(fixture.root, "session.json", JSON.stringify(session));
  return { ...fixture, session, packet, sessionPath };
}

test("session loads exact bytes, full compound IDs and receipt metadata without certifying MCP origin", async (t) => {
  const fixture = await sessionFixture(t);
  const result = await loadComponentEvidenceSession({ sessionPath: fixture.sessionPath, canonicalSha: SHA });
  assert.deepEqual(result, { ...fixture.session, captures: [{ ...fixture.session.captures[0], packet: fixture.packet }] });
});

const invalidSessions = [
  ["wrong SHA", "EVIDENCE_SESSION_SHA_MISMATCH", ({ session }) => { session.canonical_git_sha = "b".repeat(40); }],
  ["unknown session version", "EVIDENCE_SESSION_VERSION_UNSUPPORTED", ({ session }) => { session.schema_version = "2.0.0"; }],
  ["duplicate owner capture", "EVIDENCE_CAPTURE_DUPLICATE", ({ session }) => { session.captures.push({ ...session.captures[0], receipt_id: "synthetic-receipt-2" }); }],
  ["duplicate selected owner", "EVIDENCE_SESSION_SHAPE_INVALID", ({ session }) => { session.component_ids.push("synthetic-owner"); }],
  ["missing selected capture", "EVIDENCE_CAPTURE_MISSING", ({ session }) => { session.component_ids.push("synthetic-other"); }],
  ["unselected capture", "EVIDENCE_CAPTURE_UNSELECTED", ({ session }) => { session.component_ids = ["synthetic-other"]; }],
  ["missing packet", "EVIDENCE_PACKET_READ", ({ session }) => { session.captures[0].packet_path = "missing.json"; }],
  ["hash mismatch", "EVIDENCE_PACKET_HASH_MISMATCH", ({ session }) => { session.captures[0].packet_sha256 = "0".repeat(64); }],
  ["parent traversal", "EVIDENCE_PACKET_PATH_INVALID", ({ session }) => { session.captures[0].packet_path = "../owner.json"; }],
  ["backslash traversal", "EVIDENCE_PACKET_PATH_INVALID", ({ session }) => { session.captures[0].packet_path = "..\\owner.json"; }],
  ["absolute path", "EVIDENCE_PACKET_PATH_INVALID", ({ session }) => { session.captures[0].packet_path = "/tmp/owner.json"; }],
  ["Windows path", "EVIDENCE_PACKET_PATH_INVALID", ({ session }) => { session.captures[0].packet_path = "C:\\temp\\owner.json"; }],
  ["wrong tool", "EVIDENCE_SESSION_SHAPE_INVALID", ({ session }) => { session.captures[0].tool = "get_metadata"; }],
  ["empty receipt", "EVIDENCE_SESSION_SHAPE_INVALID", ({ session }) => { session.captures[0].receipt_id = ""; }],
  ["caller packet injection", "EVIDENCE_SESSION_SHAPE_INVALID", ({ session }) => { session.captures[0].packet = packetFixture(); }],
  ["start missing", "EVIDENCE_SESSION_SHAPE_INVALID", ({ session }) => { delete session.started_at; }],
  ["invalid calendar date", "EVIDENCE_TIMESTAMP_INVALID", ({ session }) => { session.started_at = "2026-02-30T09:00:00.000Z"; }],
  ["non-UTC timestamp", "EVIDENCE_TIMESTAMP_INVALID", ({ session }) => { session.started_at = "2026-10-02T12:00:00.000+03:00"; }],
  ["infinite date", "EVIDENCE_TIMESTAMP_INVALID", ({ session }) => { session.started_at = "Infinity"; }],
  ["timestamp suffix", "EVIDENCE_TIMESTAMP_INVALID", ({ session }) => { session.started_at += "\n"; }],
  ["request before session", "EVIDENCE_CAPTURE_TIME_INVALID", ({ session }) => { session.captures[0].requested_at = "2026-10-02T08:59:59.000Z"; }],
  ["request after receipt", "EVIDENCE_CAPTURE_TIME_INVALID", ({ session }) => { session.captures[0].requested_at = "2026-10-02T09:00:04.000Z"; }],
  ["request replay", "EVIDENCE_REQUEST_IDENTITY_MISMATCH", ({ packet }) => { packet.capture_meta.request.request_nonce = nonce(3); }],
  ["receipt after session", "EVIDENCE_CAPTURE_TIME_INVALID", ({ session }) => { session.captures[0].received_at = "2026-10-02T09:00:05.000Z"; }],
  ["reversed capture", "EVIDENCE_CAPTURE_TIME_INVALID", ({ packet }) => { packet.capture_meta.started_at = "2040-01-01T09:00:03.000Z"; }],
  ["reversed session", "EVIDENCE_CAPTURE_TIME_INVALID", ({ session }) => { session.completed_at = "2026-10-02T08:59:59.000Z"; }],
  ["old capture", "EVIDENCE_CAPTURE_VERSION_UNSUPPORTED", ({ packet }) => { packet.capture_version = "1.0.0"; }],
  ["unknown capture", "EVIDENCE_CAPTURE_VERSION_UNSUPPORTED", ({ packet }) => { packet.capture_version = "2.0.0"; }],
  ["incomplete tree", "EVIDENCE_CAPTURE_INCOMPLETE", ({ packet }) => { packet.capture_meta.tree_complete = false; }],
  ["missing capture metadata", "EVIDENCE_PACKET_SHAPE_INVALID", ({ packet }) => { delete packet.capture_meta; }],
  ["wrong node count", "EVIDENCE_CAPTURE_NODE_COUNT_MISMATCH", ({ packet }) => { packet.capture_meta.node_count = 1; }],
  ["empty variants", "EVIDENCE_PACKET_SHAPE_INVALID", ({ packet }) => { packet.variants = []; }],
  ["omitted container subtree", "EVIDENCE_PACKET_SHAPE_INVALID", ({ packet }) => { delete packet.variants[0].source_node.children; }],
];
for (const [label, code, change] of invalidSessions) {
  test(`session rejects ${label} with a typed input diagnostic`, async (t) => {
    const fixture = await sessionFixture(t, change);
    await assert.rejects(loadComponentEvidenceSession({ sessionPath: fixture.sessionPath, canonicalSha: SHA }), hasCode(code));
  });
}

test("session permits two selected owners with distinct packets from one synthetic receipt", async (t) => {
  const fixture = await sessionFixture(t);
  const otherPacket = packetFixture();
  otherPacket.component_node_id = "2:1";
  otherPacket.variants[0].variant_node_id = "2:1";
  otherPacket.variants[0].source_node.node_id = "2:1";
  const otherBytes = JSON.stringify(otherPacket);
  fixture.session.component_ids.push("synthetic-other");
  fixture.session.captures.push({
    ...fixture.session.captures[0],
    component_id: "synthetic-other",
    packet_path: "packets/other.json",
    packet_sha256: digest(otherBytes),
  });
  await writeFixtureFile(fixture.root, "session.json", JSON.stringify(fixture.session));
  await writeFixtureFile(fixture.root, "packets/other.json", otherBytes);
  const result = await loadComponentEvidenceSession({ sessionPath: fixture.sessionPath, canonicalSha: SHA });
  assert.deepEqual(result.captures.map(({ component_id, receipt_id, packet }) => ({ component_id, receipt_id, component_node_id: packet.component_node_id })), [
    { component_id: "synthetic-owner", receipt_id: "synthetic-receipt-1", component_node_id: "1:1" },
    { component_id: "synthetic-other", receipt_id: "synthetic-receipt-1", component_node_id: "2:1" },
  ]);
});

test("session rejects a directory symlink escaping its root even when bytes and hash match", async (t) => {
  const fixture = await sessionFixture(t);
  const outside = await createSystemFixture();
  t.after(() => outside.cleanup());
  await writeFixtureFile(outside.root, "owner.json", JSON.stringify(fixture.packet));
  // Directory junction works without file-symlink privileges on Windows.
  await symlink(outside.root, join(fixture.root, "escape"), process.platform === "win32" ? "junction" : "dir");
  fixture.session.captures[0].packet_path = "escape/owner.json";
  await writeFixtureFile(fixture.root, "session.json", JSON.stringify(fixture.session));
  await assert.rejects(loadComponentEvidenceSession({ sessionPath: fixture.sessionPath, canonicalSha: SHA }), hasCode("EVIDENCE_PACKET_PATH_INVALID"));
});

test("session hashes exact file bytes, not parsed-and-reserialized JSON", async (t) => {
  const fixture = await sessionFixture(t);
  await writeFixtureFile(fixture.root, "packets/owner.json", JSON.stringify(fixture.packet, null, 2));
  await assert.rejects(loadComponentEvidenceSession({ sessionPath: fixture.sessionPath, canonicalSha: SHA }), hasCode("EVIDENCE_PACKET_HASH_MISMATCH"));
});

test("session accepts equal timestamps and retains explicit main lookup errors", async (t) => {
  const fixture = await sessionFixture(t, ({ session, packet }) => {
    session.completed_at = session.started_at;
    session.captures[0].requested_at = session.started_at;
    session.captures[0].received_at = session.started_at;
    packet.capture_meta.started_at = session.started_at;
    packet.capture_meta.completed_at = session.started_at;
    packet.variants[0].source_node.children[0].main_component_id = null;
    packet.capture_errors.push({ node_id: "I1:1;2:1", code: "MAIN_COMPONENT_UNRESOLVED" });
  });
  const result = await loadComponentEvidenceSession({ sessionPath: fixture.sessionPath, canonicalSha: SHA });
  assert.deepEqual(result.captures[0].packet.capture_errors, fixture.packet.capture_errors);
});

const MODEL_FILES = ["system/manifest.yaml", "schemas/manifest.schema.json", "schemas/components.schema.json",
  "data/components/shared.yaml", "data/components/marketing.yaml", "data/components/service.yaml",
  "data/foundations/rendering.yaml", "schemas/rendering.schema.json"];
async function modelFixture(t) {
  const fixture = await createSystemFixture();
  t.after(() => fixture.cleanup());
  await Promise.all(MODEL_FILES.map((path) => copyFixtureFile(REPO, fixture.root, path)));
  const manifest = parseStrictYaml(await readFile(join(fixture.root, "system/manifest.yaml"), "utf8"));
  const shared = parseStrictYaml(await readFile(join(fixture.root, "data/components/shared.yaml"), "utf8"));
  const record = shared.components.find(({ id }) => id === "email-template");
  record.evidence_links = { foundation_values: [{ id: "synthetic-width", source: {
    variant_node_id: record.variants[0].node_id, node_id: record.variants[0].node_id, field_path: "/reference_dimensions/width",
  }, target: { source_id: "rendering-foundation", pointer: "/shell/max_width_px" }, comparison: "pixel-number" }], source_dependencies: [] };
  await writeFixtureFile(fixture.root, "data/components/shared.yaml", JSON.stringify(shared));
  return { ...fixture, manifest, shared };
}

test("model loads complete records and resolves expected values only from registered canonical sources", async (t) => {
  const fixture = await modelFixture(t);
  const model = await loadComponentEvidenceModel({ repoRoot: fixture.root, canonicalSha: SHA });
  const expected = parseStrictYaml(await readFile(join(fixture.root, "data/foundations/rendering.yaml"), "utf8"));
  assert.equal(model.canonical_sha, SHA);
  const remote = model.records.filter(({ id }) => id === "icon-account-circle-line-remote");
  assert.equal(model.records.length, 62);
  assert.equal(model.records.filter(({ id }) => id !== "icon-account-circle-line-remote").length, 61);
  assert.deepEqual(remote.map(({ id, figma, contracts }) => ({
    id,
    component_key: figma.remote_source?.component_key,
    root_modes: ["mobile", "desktop"].map((viewport) => contracts[viewport].root.render_mode),
  })), [{ id: "icon-account-circle-line-remote", component_key: "8ea141edd5ec0679825e7fde633e211282b2405b", root_modes: ["figma-source-only", "figma-source-only"] }]);
  assert.ok(model.records.every((record) => Object.hasOwn(record, "contracts")));
  assert.deepEqual(model.manifest, fixture.manifest);
  assert.deepEqual(model.source_documents.get("rendering-foundation"), expected);
  assert.equal(model.targets.get("email-template/synthetic-width").expected, expected.shell.max_width_px);
});

test("model follows relocated rendering document and schema without fallback to old paths", async (t) => {
  const fixture = await modelFixture(t);
  const rendering = parseStrictYaml(await readFile(join(fixture.root, "data/foundations/rendering.yaml"), "utf8"));
  rendering.shell.max_width_px = 620; // Explicit synthetic value, not a proposed canonical design change.
  await writeFixtureFile(fixture.root, "relocated/rendering.yaml", JSON.stringify(rendering));
  await writeFixtureFile(fixture.root, "relocated/rendering.schema.json", await readFile(join(fixture.root, "schemas/rendering.schema.json"), "utf8"));
  fixture.manifest.sources.find(({ id }) => id === "rendering-foundation").path = "relocated/rendering.yaml";
  fixture.manifest.sources.find(({ id }) => id === "rendering-schema").path = "relocated/rendering.schema.json";
  await writeFixtureFile(fixture.root, "system/manifest.yaml", JSON.stringify(fixture.manifest));
  const model = await loadComponentEvidenceModel({ repoRoot: fixture.root, canonicalSha: SHA });
  assert.equal(model.targets.get("email-template/synthetic-width").expected, 620);
});

for (const sourceId of ["rendering-foundation", "rendering-schema", "components-shared", "components-schema"]) {
  test(`model rejects missing ${sourceId} registration even when default file exists`, async (t) => {
    const fixture = await modelFixture(t);
    fixture.manifest.sources = fixture.manifest.sources.filter(({ id }) => id !== sourceId);
    await writeFixtureFile(fixture.root, "system/manifest.yaml", JSON.stringify(fixture.manifest));
    await assert.rejects(loadComponentEvidenceModel({ repoRoot: fixture.root, canonicalSha: SHA }), hasCode("EVIDENCE_SOURCE_UNREGISTERED"));
  });
}

test("model propagates a schema-valid semantic target mismatch rather than returning a partial model", async (t) => {
  const fixture = await modelFixture(t);
  fixture.shared.components.find(({ id }) => id === "email-template").evidence_links.foundation_values[0].comparison = "pixel-number";
  fixture.shared.components.find(({ id }) => id === "email-template").evidence_links.foundation_values[0].target.pointer = "/shell/background_color";
  await writeFixtureFile(fixture.root, "data/components/shared.yaml", JSON.stringify(fixture.shared));
  await assert.rejects(loadComponentEvidenceModel({ repoRoot: fixture.root, canonicalSha: SHA }), hasCode("EVIDENCE_COMPARISON_INVALID"));
});

for (const canonicalSha of [undefined, "main", "A".repeat(40), `${SHA}\n`]) {
  test(`both loaders reject invalid canonical SHA ${JSON.stringify(canonicalSha)}`, async () => {
    await assert.rejects(loadComponentEvidenceModel({ repoRoot: REPO, canonicalSha }), hasCode("EVIDENCE_CANONICAL_SHA_INVALID"));
    await assert.rejects(loadComponentEvidenceSession({ sessionPath: "absent.json", canonicalSha }), hasCode("EVIDENCE_CANONICAL_SHA_INVALID"));
  });
}
