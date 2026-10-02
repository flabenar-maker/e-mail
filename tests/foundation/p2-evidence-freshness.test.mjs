// RED staging for tests/foundation/p2-evidence-freshness.test.mjs.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

import { createSystemFixture, writeFixtureFile } from "../helpers/system-fixture.mjs";
import { loadComponentEvidenceSession } from "../../scripts/lib/component-evidence-inputs.mjs";
import { auditFigmaComponentEvidence } from "../../scripts/lib/figma-component-evidence.mjs";

const CAPTURE_PATH = new URL("../../scripts/figma/capture-contract-source.js", import.meta.url);
const SHA = "a".repeat(40);
const SESSION_NONCE = "1".repeat(64);
const REQUEST_NONCE = "2".repeat(64);
const digest = (value) => createHash("sha256").update(value).digest("hex");
const hasCode = (code) => (error) => error.code === code || error.errors?.some((entry) => entry.code === code);

function packet12({ captureStart = "2040-01-01T00:00:00.000Z", captureEnd = "2040-01-01T00:00:01.000Z", request = {} } = {}) {
  return {
    capture_version: "1.2.0", file_key: "synthetic-file", component_node_id: "1:1", component_properties: [], capture_errors: [],
    capture_meta: { started_at: captureStart, completed_at: captureEnd, tree_complete: true, node_count: 1,
      request: { session_nonce: SESSION_NONCE, request_nonce: REQUEST_NONCE, canonical_git_sha: SHA, ...request } },
    variants: [{ variant_node_id: "1:1", axes: [], source_node: { node_id: "1:1", node_type: "COMPONENT", children: [] } }],
  };
}

async function session12(t, change = () => {}) {
  const fixture = await createSystemFixture();
  t.after(() => fixture.cleanup());
  const packet = packet12();
  const session = {
    schema_version: "1.1.0", canonical_git_sha: SHA, session_nonce: SESSION_NONCE,
    started_at: "2026-10-02T09:00:00.000Z", completed_at: "2026-10-02T09:00:04.000Z", component_ids: ["synthetic-owner"],
    captures: [{ component_id: "synthetic-owner", receipt_id: "receipt-1", request_nonce: REQUEST_NONCE,
      tool: "use_figma", requested_at: "2026-10-02T09:00:01.000Z", received_at: "2026-10-02T09:00:03.000Z", packet_path: "packets/owner.json", packet_sha256: "" }],
  };
  await change({ session, packet, fixture });
  const bytes = JSON.stringify(packet);
  session.captures[0].packet_sha256 = digest(bytes);
  await writeFixtureFile(fixture.root, "packets/owner.json", bytes);
  const sessionPath = await writeFixtureFile(fixture.root, "session.json", JSON.stringify(session));
  return { ...fixture, packet, session, sessionPath };
}

function templateAuditorFixture() {
  const variants = [
    { id: "template-mobile", node_id: "1:1", axes: [{ name: "Viewport", value: "Mobile" }] },
    { id: "template-desktop", node_id: "1:2", axes: [{ name: "Viewport", value: "Desktop" }] },
  ];
  const record = {
    id: "synthetic-template", identity: { semantic_role: "template", node_kind: "component-set" },
    figma: { file_key: "synthetic-file", node_id: "1:0" }, variants,
    assets: [], evidence_links: { foundation_values: [], source_dependencies: [] }, contracts: [],
  };
  const packet = packet12();
  packet.component_node_id = record.figma.node_id;
  packet.variants = variants.map((variant) => ({ variant_node_id: variant.node_id, axes: variant.axes,
    source_node: { node_id: variant.node_id, node_type: "COMPONENT", visible: true, children: [] } }));
  packet.capture_meta.node_count = packet.variants.length;
  const capture = { component_id: record.id, receipt_id: "receipt-template", tool: "use_figma", request_nonce: REQUEST_NONCE,
    requested_at: "2026-10-02T09:00:01.000Z", received_at: "2026-10-02T09:00:03.000Z", packet_path: "packets/template.json",
    packet_sha256: digest(JSON.stringify(packet)), packet };
  const session = { schema_version: "1.1.0", canonical_git_sha: SHA, session_nonce: SESSION_NONCE,
    started_at: "2026-10-02T09:00:00.000Z", completed_at: "2026-10-02T09:00:04.000Z", component_ids: [record.id], captures: [capture] };
  return { record, packet, session, model: { canonical_sha: SHA, records: [record], manifest: { sources: [] }, source_documents: new Map(), targets: new Map() } };
}

// Production mutation caught: restoring a single cross-clock inequality.
test("accepts Session 1.1 / Capture 1.2 for large positive and negative capture-clock offsets", async (t) => {
  const future = await session12(t);
  const past = await session12(t, ({ packet }) => Object.assign(packet.capture_meta, {
    started_at: "2000-01-01T00:00:00.000Z", completed_at: "2000-01-01T00:00:01.000Z",
  }));
  await assert.doesNotReject(loadComponentEvidenceSession({ sessionPath: future.sessionPath, canonicalSha: SHA }));
  await assert.doesNotReject(loadComponentEvidenceSession({ sessionPath: past.sessionPath, canonicalSha: SHA }));
});

// Production mutation caught: accepting obsolete unbound evidence as fresh.
test("requires Session 1.1 and Capture 1.2 on the evidence path", async (t) => {
  const oldSession = await session12(t, ({ session }) => { session.schema_version = "1.0.0"; });
  const oldCapture = await session12(t, ({ packet }) => { packet.capture_version = "1.1.0"; });
  await assert.rejects(loadComponentEvidenceSession({ sessionPath: oldSession.sessionPath, canonicalSha: SHA }), hasCode("EVIDENCE_SESSION_VERSION_UNSUPPORTED"));
  await assert.rejects(loadComponentEvidenceSession({ sessionPath: oldCapture.sessionPath, canonicalSha: SHA }), hasCode("EVIDENCE_CAPTURE_VERSION_UNSUPPORTED"));
});

// Production mutation caught: dropping any nonce/SHA binding or accepting a partial echo.
for (const [name, change] of [
  ["session nonce", ({ packet }) => { packet.capture_meta.request.session_nonce = "3".repeat(64); }],
  ["request nonce", ({ packet }) => { packet.capture_meta.request.request_nonce = "3".repeat(64); }],
  ["canonical SHA", ({ packet }) => { packet.capture_meta.request.canonical_git_sha = "b".repeat(40); }],
  ["missing request echo", ({ packet }) => { delete packet.capture_meta.request; }],
]) {
  test(`rejects request identity mismatch: ${name}`, async (t) => {
    const fixture = await session12(t, change);
    await assert.rejects(loadComponentEvidenceSession({ sessionPath: fixture.sessionPath, canonicalSha: SHA }), hasCode("EVIDENCE_REQUEST_IDENTITY_MISMATCH"));
  });
}

// Production mutation caught: accepting a replayed packet merely because hash and host times look valid.
test("rejects a valid prior request replayed under a new session nonce", async (t) => {
  const fixture = await session12(t, ({ session }) => { session.session_nonce = "4".repeat(64); });
  await assert.rejects(loadComponentEvidenceSession({ sessionPath: fixture.sessionPath, canonicalSha: SHA }), hasCode("EVIDENCE_REQUEST_IDENTITY_MISMATCH"));
});

// Production mutation caught: relaxing real ordering while removing only the invalid cross-clock comparison.
test("rejects inverted host and capture timelines independently", async (t) => {
  const host = await session12(t, ({ session }) => { session.captures[0].requested_at = "2026-10-02T09:00:03.500Z"; });
  const capture = await session12(t, ({ packet }) => { packet.capture_meta.started_at = "2040-01-01T00:00:02.000Z"; });
  await assert.rejects(loadComponentEvidenceSession({ sessionPath: host.sessionPath, canonicalSha: SHA }), hasCode("EVIDENCE_CAPTURE_TIME_INVALID"));
  await assert.rejects(loadComponentEvidenceSession({ sessionPath: capture.sessionPath, canonicalSha: SHA }), hasCode("EVIDENCE_CAPTURE_TIME_INVALID"));
});

// Production mutation caught: breaking the allowed one-request/one-receipt multi-owner batch.
test("accepts two complete distinct owners under one exact request and receipt envelope", async (t) => {
  const fixture = await session12(t, async ({ session, packet, fixture: system }) => {
    const other = structuredClone(packet);
    other.component_node_id = "2:1";
    other.variants[0].variant_node_id = "2:1";
    other.variants[0].source_node.node_id = "2:1";
    const bytes = JSON.stringify(other);
    session.component_ids.push("synthetic-other");
    session.captures.push({ ...session.captures[0], component_id: "synthetic-other", packet_path: "packets/other.json", packet_sha256: digest(bytes) });
    await writeFixtureFile(system.root, "packets/other.json", bytes);
  });
  await assert.doesNotReject(loadComponentEvidenceSession({ sessionPath: fixture.sessionPath, canonicalSha: SHA }));
});

// Production mutation caught: accepting one receipt ID with incompatible request nonces.
test("rejects one receipt reused under distinct request nonces", async (t) => {
  const fixture = await session12(t, async ({ session, packet, fixture: system }) => {
    const other = structuredClone(packet);
    other.component_node_id = "2:1";
    other.variants[0].variant_node_id = "2:1";
    other.variants[0].source_node.node_id = "2:1";
    other.capture_meta.request.request_nonce = "5".repeat(64);
    const bytes = JSON.stringify(other);
    session.component_ids.push("synthetic-other");
    session.captures.push({ ...session.captures[0], component_id: "synthetic-other", request_nonce: "5".repeat(64), packet_path: "packets/other.json", packet_sha256: digest(bytes) });
    await writeFixtureFile(system.root, "packets/other.json", bytes);
  });
  await assert.rejects(loadComponentEvidenceSession({ sessionPath: fixture.sessionPath, canonicalSha: SHA }), hasCode("EVIDENCE_RECEIPT_REQUEST_AMBIGUOUS"));
});

// Production mutation caught: changing capture wrapper behavior for scalar callers or failing to echo requested identity.
test("rejects one request nonce with incompatible receipt envelopes before reading packets", async (t) => {
  const fixture = await session12(t, ({ session }) => {
    session.component_ids.push("synthetic-other");
    session.captures.push({ ...session.captures[0], component_id: "synthetic-other", receipt_id: "receipt-other", packet_path: "missing.json" });
  });
  await assert.rejects(loadComponentEvidenceSession({ sessionPath: fixture.sessionPath, canonicalSha: SHA }), hasCode("EVIDENCE_RECEIPT_REQUEST_AMBIGUOUS"));
});

// Production mutation caught: changing capture wrapper behavior for scalar callers or failing to echo requested identity.
test("VM capture keeps no-argument 1.1 scalar compatibility and emits exact 1.2 request echo", async () => {
  const source = await readFile(CAPTURE_PATH, "utf8");
  let traversed = false;
  const figma = { fileKey: "synthetic-file", skipInvisibleInstanceChildren: true,
    getNodeByIdAsync: async () => { traversed = true; return { type: "COMPONENT", id: "1:1", name: "Synthetic", visible: true, parent: { type: "PAGE" }, children: [] }; },
    getLocalStylesAsync: async () => [], mixed: Symbol("mixed") };
  const context = vm.createContext({ figma });
  new vm.Script(`${source}\nglobalThis.__capture = captureFigmaContractFacts;`).runInContext(context);
  const scalar = await context.__capture("1:1");
  const request = { session_nonce: SESSION_NONCE, request_nonce: REQUEST_NONCE, canonical_git_sha: SHA };
  const evidence = await context.__capture("1:1", request);
  assert.equal(scalar.capture_version, "1.1.0");
  assert.ok(evidence.capture_meta.request, "request-mode capture must expose capture_meta.request");
  assert.deepEqual(JSON.parse(JSON.stringify(evidence.capture_meta.request)), request);
  assert.equal(evidence.capture_version, "1.2.0");
  traversed = false;
  await assert.rejects(context.__capture("1:1", { ...request, request_nonce: "not-hex" }), hasCode("EVIDENCE_REQUEST_IDENTITY_MISMATCH"));
  assert.equal(traversed, false);
});

// Production mutation caught: direct audit skipping the same freshness check as session loading.
test("direct auditor reports the loader's request-identity failure before evidence links", async (t) => {
  const { record, packet, session, model } = templateAuditorFixture();
  packet.capture_meta.request.request_nonce = "f".repeat(64);
  const report = auditFigmaComponentEvidence({ record, live: packet, model, session });
  assert.ok(report.issues.some((entry) => entry.code === "EVIDENCE_REQUEST_IDENTITY_MISMATCH"));
});

