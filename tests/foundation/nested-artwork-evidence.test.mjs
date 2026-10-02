import assert from "node:assert/strict";
import test from "node:test";

import * as evidence from "../../scripts/lib/figma-component-evidence.mjs";
import { auditFigmaContractFacts } from "../../scripts/lib/figma-contract-facts.mjs";

const SHA = "a".repeat(40);
const nonce = value => value.toString(16).padStart(64, "0");
const SESSION_NONCE = nonce(1);
const REQUEST_NONCE = nonce(2);
const api = evidence.auditNestedArtworkEvidence;

// The first RED is intentionally only the public export. Every semantic case
// below is skipped until the feature exists, so preimplementation failure is
// never confused with malformed synthetic evidence.
test("nested artwork public auditor is exported", () => {
  assert.equal(typeof api, "function");
});

function node(node_id, node_type, children = []) {
  return { node_id, node_type, name: "Owned Glyph", visible: true, opacity: 1,
    reference_dimensions: { width: 24, height: 24, unit: "px" }, children };
}
function packet({ owner, root, request = REQUEST_NONCE, complete = true } = {}) {
  const count = current => 1 + (current.children ?? []).reduce((n, child) => n + count(child), 0);
  return {
    capture_version: "1.2.0", file_key: "synthetic", component_node_id: owner,
    component_properties: [], capture_errors: [],
    capture_meta: { started_at: "2040-01-01T00:00:00.000Z", completed_at: "2040-01-01T00:00:01.000Z",
      request: { session_nonce: SESSION_NONCE, request_nonce: request, canonical_git_sha: SHA },
      tree_complete: complete, node_count: count(root) },
    variants: [{ variant_node_id: owner, axes: [{ name: "Viewport", value: "Desktop" }], source_node: root }],
  };
}
function fixture(kind = "instance") {
  const glyph = { ...node("200:2", "COMPONENT", []), name: "Glyph" };
  const inner = kind === "frame" ? node("100:2", "FRAME", [node("100:3", "VECTOR", [])]) :
    { ...node("I100:1;200:2", "INSTANCE", []), main_component_id: "200:2" };
  const outer = node("100:1", "COMPONENT", [node("100:9", "FRAME", [inner])]);
  const parent = {
    id: "parent", identity: { semantic_role: "block", node_kind: "component" }, figma: { file_key: "synthetic", node_id: "100:1" },
    variants: [{ node_id: "100:1", axes: [{ name: "Viewport", value: "Desktop" }] }], asset_contracts: [{ id: "owned-glyph", owner_layer_name: "Owned Glyph", export_boundary: { kind: "node", semantic_node_name: "Owned Glyph" } }],
    contracts: { desktop: { root: { render_mode: "html", children: [] } }, mobile: { root: { render_mode: "html", children: [] } }, figma_fact_links: [
      { variant_node_id: "100:1", node_id: "100:2", source_path: "/reference_dimensions/width", contract_path: "/contracts/desktop/root/reference_dimensions/width", transform: "identity" },
      { variant_node_id: "100:1", node_id: "100:2", source_path: "/reference_dimensions/height", contract_path: "/contracts/desktop/root/reference_dimensions/height", transform: "identity" },
    ] },
    evidence_links: { source_dependencies: kind === "instance" ? [{ id: "glyph", source: { variant_node_id: "100:1", node_id: "I100:1;200:2" }, target: { component_id: "child", node_id: "200:2" }, asset_owner: { node_id: "100:2", asset_id: "owned-glyph" } }] : [] },
  };
  const child = {
    id: "child", identity: { semantic_role: "asset", node_kind: "component" }, figma: { file_key: "synthetic", node_id: "200:2" },
    variants: [{ node_id: "200:2", axes: [{ name: "Viewport", value: "Desktop" }] }], asset_contracts: [{ id: "child-glyph", owner_layer_name: "Glyph", export_boundary: { kind: "node", semantic_node_name: "Glyph" } }],
    contracts: { desktop: { root: { render_mode: "figma-source-only", children: [] } }, mobile: { root: { render_mode: "figma-source-only", children: [] } }, figma_fact_links: [] }, evidence_links: { source_dependencies: [] },
  };
  const parentPacket = packet({ owner: "100:1", root: outer });
  const childPacket = packet({ owner: "200:2", root: glyph, request: nonce(3) });
  const session = { schema_version: "1.1.0", canonical_git_sha: SHA, session_nonce: SESSION_NONCE, started_at: "2026-10-02T00:00:00.000Z", completed_at: "2026-10-02T00:00:03.000Z", component_ids: ["parent", "child"], captures: [
    { component_id: "parent", receipt_id: "parent-receipt", tool: "use_figma", request_nonce: REQUEST_NONCE, requested_at: "2026-10-02T00:00:00.000Z", received_at: "2026-10-02T00:00:01.000Z", packet_path: "parent.json", packet_sha256: "a".repeat(64), packet: parentPacket },
    { component_id: "child", receipt_id: "child-receipt", tool: "use_figma", request_nonce: nonce(3), requested_at: "2026-10-02T00:00:01.000Z", received_at: "2026-10-02T00:00:02.000Z", packet_path: "child.json", packet_sha256: "b".repeat(64), packet: childPacket },
  ] };
  return { parent, child, model: { canonical_sha: SHA, records: [parent, child], manifest: { sources: [] }, source_documents: new Map(), targets: new Map() }, session, parentPacket, childPacket, inner };
}
function run(f) { return api({ recordId: "parent", model: f.model, session: f.session }); }
function expectRejected(label, mutate) {
  test(label, { skip: typeof api !== "function" }, () => { const f = fixture(); mutate(f); const report = run(f); assert.equal(report.ok, false); assert.ok(report.issues.length > 0); });
}

test("FRAME artwork is a true owned boundary without a fabricated INSTANCE", { skip: typeof api !== "function" }, () => {
  const report = run(fixture("frame")); assert.equal(report.ok, true); assert.deepEqual(report.dependencies, []); assert.equal(report.boundaries.length, 1);
});
test("INSTANCE artwork proves a canonical child and preserves its child identity", { skip: typeof api !== "function" }, () => {
  const report = run(fixture()); assert.equal(report.ok, true); assert.deepEqual(report.receipt_ids.sort(), ["child-receipt", "parent-receipt"]); assert.equal(report.dependencies[0].target.component_id, "child");
});
test("combined audit adds nested_artwork without changing scalar facts", { skip: typeof api !== "function" }, () => {
  const f = fixture(); const scalar = auditFigmaContractFacts({ record: f.parent, live: f.parentPacket });
  const combined = evidence.auditFigmaComponentEvidence({ record: f.parent, live: f.parentPacket, model: f.model, session: f.session });
  assert.deepEqual(combined.facts, scalar); assert.ok(combined.nested_artwork); assert.equal(combined.ok, false);
});

expectRejected("nested artwork excludes an outer HTML wrapper from ownership", f => { f.parent.evidence_links.source_dependencies[0].asset_owner.node_id = "100:9"; });
expectRejected("nested artwork includes hidden owned descendants", f => { f.inner.visible = false; });
expectRejected("nested artwork preserves multilevel compound ancestry", f => { f.inner.node_id = "I100:1;101:1;200:2"; });
expectRejected("nested artwork rejects missing owned width provenance", f => { f.parent.contracts.figma_fact_links.pop(); });
expectRejected("nested artwork rejects duplicate owned width provenance", f => { f.parent.contracts.figma_fact_links.push(structuredClone(f.parent.contracts.figma_fact_links[0])); });
expectRejected("nested artwork rejects wrong owned geometry provenance", f => { f.parent.contracts.figma_fact_links[0].node_id = "100:9"; });
expectRejected("nested artwork rejects wrong instance placement main", f => { f.inner.main_component_id = "200:9"; });
expectRejected("nested artwork rejects wrong instance viewport", f => { f.child.variants[0].axes[0].value = "Mobile"; });
expectRejected("nested artwork rejects stale parent source packet", f => { f.parentPacket.capture_meta.request.request_nonce = nonce(9); });
expectRejected("nested artwork rejects incomplete parent source tree", f => { f.parentPacket.capture_meta.tree_complete = false; });
expectRejected("nested artwork rejects stale child target packet", f => { f.childPacket.capture_meta.request.request_nonce = nonce(9); });
expectRejected("nested artwork rejects incomplete child target tree", f => { f.childPacket.capture_meta.tree_complete = false; });
expectRejected("nested artwork rejects a child target with wrong identity", f => { f.childPacket.component_node_id = "200:9"; });
expectRejected("nested artwork rejects an absent child capture", f => { f.session.captures.pop(); });
expectRejected("nested artwork rejects wrong or overlapping export selectors", f => { f.child.asset_contracts[0].export_boundary.semantic_node_name = "Other"; });
expectRejected("nested artwork rejects a stripped compound alias", f => { f.inner.node_id = "200:2"; });
expectRejected("nested artwork rejects wrong compound ancestry", f => { f.inner.node_id = "I999:1;200:2"; });
expectRejected("nested artwork rejects unknown glyph targets without creating source records", f => { f.parent.evidence_links.source_dependencies[0].target.component_id = "unknown-glyph"; });
expectRejected("nested artwork compares overridden actual main instead of child default inheritance", f => { f.inner.main_component_id = "200:3"; });
expectRejected("ordinary HTML text does not acquire nested artwork proof", f => { f.parent.asset_contracts = []; f.parent.evidence_links.source_dependencies = []; });
expectRejected("an INSTANCE outside an artwork boundary does not acquire nested proof", f => { f.parent.asset_contracts = []; });
test("nested artwork does not mutate caller inputs", { skip: typeof api !== "function" }, () => {
  const f = fixture(), before = structuredClone({ model: f.model, session: f.session }); run(f); assert.deepEqual({ model: f.model, session: f.session }, before);
});
