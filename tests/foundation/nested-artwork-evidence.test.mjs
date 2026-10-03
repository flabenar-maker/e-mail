import assert from "node:assert/strict";
import test from "node:test";
import * as evidence from "../../scripts/lib/figma-component-evidence.mjs";
import { validateEvidenceLinkReferences } from "../../scripts/lib/component-evidence-links.mjs";
import { auditFigmaContractFacts } from "../../scripts/lib/figma-contract-facts.mjs";

// Synthetic contract/capture model, not a stored or real Figma observation.
const SHA = "a".repeat(40), nonce = n => n.toString(16).padStart(64, "0"), SN = nonce(1);
const axes = viewport => [{ name: "Viewport", value: viewport }];
const node = (id, type, children = [], name = id) => ({ node_id: id, node_type: type, name,
  visible: true, opacity: 1, reference_dimensions: { width: 24, height: 24, unit: "px" }, children });
const record = (id, owner, role, variants) => ({ id, identity: { semantic_role: role, node_kind: variants.length ? "component-set" : "component" },
  figma: { file_key: "synthetic-nesting", node_id: owner }, variants, asset_contracts: [],
  contracts: { mobile: { root: { render_mode: "presentation-table", facts: [], children: [] } },
    desktop: { root: { render_mode: "presentation-table", facts: [], children: [] } }, figma_fact_links: [] } });
const variants = (mobile, desktop) => [{ id: "mobile", node_id: mobile, axes: axes("Mobile") }, { id: "desktop", node_id: desktop, axes: axes("Desktop") }];
function element(owner, viewport, variantId, id, mode, target) {
  const value = { id: "owned-child", render_mode: mode, ...target, children: [], facts: [{ id: "reference-size",
    value: { type: "dimensions", width: 24, height: 24, unit: "px" }, provenance: { kind: "figma-literal", node_id: id } }] };
  owner.contracts[viewport].root.children.push(value);
  for (const dimension of ["width", "height"]) owner.contracts.figma_fact_links.push({ variant_node_id: variantId, node_id: id,
    source_path: "/reference_dimensions/" + dimension, contract_path: `/contracts/${viewport}/root/children/0/facts/0/value/${dimension}`, transform: "identity" });
  return value;
}
function packet(owner, trees, requestNonce) {
  const count = n => 1 + (n.children ?? []).reduce((sum, child) => sum + count(child), 0);
  return { capture_version: "1.2.0", file_key: owner.figma.file_key, component_node_id: owner.figma.node_id,
    component_properties: [], capture_errors: [], capture_meta: { started_at: "2040-01-01T00:00:01.000Z", completed_at: "2040-01-01T00:00:02.000Z",
      request: { session_nonce: SN, request_nonce: requestNonce, canonical_git_sha: SHA }, tree_complete: true,
      node_count: trees.reduce((sum, root) => sum + count(root), 0) },
    variants: trees.map((root, index) => ({ variant_node_id: root.node_id, axes: owner.variants[index]?.axes ?? [], source_node: root })) };
}
function fixture(frame = false) {
  const parent = record("parent", "300:0", "block", variants("301:1", "301:2"));
  const item = record("item", "400:0", "item", variants("401:1", "401:2"));
  const glyph = record("glyph", "500:1", "icon", []);
  for (const viewport of ["mobile", "desktop"]) glyph.contracts[viewport].root.render_mode = "figma-source-only";
  item.asset_contracts = [{ id: "item-artwork", owner_layer_name: "artwork @4x", source_viewport: "desktop", source_mode_id: "rendered-node",
    export_boundary: { kind: "node", semantic_node_name: "artwork @4x" } }];
  item.evidence_links = { foundation_values: [], source_dependencies: [] };
  const parentTrees = [], itemTrees = [];
  for (const [viewport, rootId, itemRoot, placementId, artworkId, vectorId] of [
    ["mobile", "301:1", "401:1", "301:10", "401:10", "401:11"],
    ["desktop", "301:2", "401:2", "301:20", "401:20", "401:21"],
  ]) {
    const graphic = frame ? node(artworkId, "FRAME", [node(vectorId, "VECTOR")], "artwork @4x") :
      { ...node(artworkId, "INSTANCE", [node(`I${artworkId};500:2`, "VECTOR")], "artwork @4x"), main_component_id: "500:1" };
    const actualGraphic = frame ? node(`I${placementId};${artworkId}`, "FRAME", [node(`I${placementId};${vectorId}`, "VECTOR")], "artwork @4x") :
      { ...node(`I${placementId};${artworkId}`, "INSTANCE", [node(`I${placementId};${artworkId};500:2`, "VECTOR")], "artwork @4x"), main_component_id: "500:1" };
    const actualItem = { ...node(placementId, "INSTANCE", [node(`I${placementId};402:1`, "TEXT", [], "body"), actualGraphic], "item"), main_component_id: itemRoot };
    parentTrees.push(node(rootId, "COMPONENT", [actualItem]));
    itemTrees.push(node(itemRoot, "COMPONENT", [node("402:" + (viewport === "mobile" ? 1 : 2), "TEXT", [], "body"), graphic]));
    // Desktop parent's body identity is not used for artwork matching.
    if (viewport === "desktop") actualItem.children[0].node_id = `I${placementId};402:2`;
    element(parent, viewport, rootId, placementId, "nested-component", { component_id: "item" });
    element(item, viewport, itemRoot, artworkId, "direct-image", { asset_contract_id: "item-artwork" });
    if (!frame) item.evidence_links.source_dependencies.push({ id: viewport + "-glyph", source: { variant_node_id: itemRoot, node_id: artworkId },
      target: { component_id: "glyph" }, asset_owner: { node_id: artworkId, asset_id: "item-artwork" } });
  }
  const model = { canonical_sha: SHA, records: [parent, item, glyph], manifest: { sources: [] }, source_documents: new Map(), targets: new Map() };
  const session = { schema_version: "1.1.0", canonical_git_sha: SHA, session_nonce: SN,
    started_at: "2026-10-02T00:00:00.000Z", completed_at: "2026-10-02T00:00:10.000Z", component_ids: ["parent", "item", "glyph"], captures: [] };
  const add = (owner, roots) => {
    const i = session.captures.length, requestNonce = nonce(i + 10), p = packet(owner, roots, requestNonce);
    session.captures.push({ component_id: owner.id, receipt_id: owner.id + "-receipt", tool: "use_figma", request_nonce: requestNonce,
      requested_at: `2026-10-02T00:00:0${i}.000Z`, received_at: `2026-10-02T00:00:0${i+1}.000Z`, packet: p }); return p;
  };
  const pp = add(parent, parentTrees), ip = add(item, itemTrees), gp = add(glyph, [node("500:1", "COMPONENT", [node("500:2", "VECTOR")])]);
  return { parent, item, glyph, model, session, pp, ip, gp, add };
}
const run = f => {
  assert.equal(typeof evidence.auditNestedArtworkEvidence, "function", "nested ownership auditor is missing");
  return evidence.auditNestedArtworkEvidence({ recordId: "parent", model: f.model, session: f.session });
};
const has = (r, c) => r.issues.some(i => i.code === c);
function reject(name, expected, mutate) {
  test(name, () => { const f = fixture(); mutate(f); const r = run(f); assert.equal(r.ok, false); assert.ok(has(r, expected), JSON.stringify(r)); });
}
test("synthetic source link shapes and independently collected Item artwork are valid", () => {
  const f = fixture(); assert.deepEqual(validateEvidenceLinkReferences({ records: f.model.records }), []);
  assert.deepEqual(evidence.collectRequiredComponentEvidence({ record: f.item, live: f.ip }).issues, []);
  assert.deepEqual(evidence.collectRequiredComponentEvidence({ record: f.item, live: f.ip }).required_sources.map(s => s.node_id), ["401:10", "401:20"]);
});
test("nested FRAME+VECTOR retains two child-owned boundaries without fabricated INSTANCE targets", () => {
  const f = fixture(true), r = run(f); assert.equal(r.ok, true, JSON.stringify(r.issues)); assert.equal(r.boundaries.length, 2);
  assert.deepEqual(r.dependencies, []); assert.deepEqual(r.boundaries.map(b => [b.owner_component_id, b.asset_id, b.consumer_node_id]),
    [["item", "item-artwork", "I301:10;401:10"], ["item", "item-artwork", "I301:20;401:20"]]);
});
test("nested INSTANCE proves its Item-owned glyph from current source and target receipts", () => {
  const r = run(fixture()); assert.equal(r.ok, true, JSON.stringify(r.issues)); assert.equal(r.dependencies.length, 2);
  assert.deepEqual(r.receipt_ids, ["glyph-receipt", "item-receipt", "parent-receipt"]);
  assert.ok(r.dependencies.every(d => d.asset_owner.component_id === "item" && d.target.component_id === "glyph" && d.expected === "500:1" && d.actual === "500:1" && d.status === "verified"));
});
test("hidden artwork remains required and missing source links cannot opt it out", () => {
  const f = fixture(); f.pp.variants[0].source_node.children[0].children[1].visible = false;
  assert.equal(run(f).dependencies.length, 2); assert.equal(run(f).ok, true);
  f.item.evidence_links.source_dependencies.shift(); assert.ok(has(run(f), "EVIDENCE_REQUIRED_LINK_MISSING"));
});
test("compound identities propagate through a second real nested-component reference", () => {
  const f = fixture(true), middle = record("middle", "600:0", "item", variants("601:1", "601:2")), trees = [];
  for (const [viewport, variantId, placement, innerId] of [["mobile", "601:1", "301:10", "601:10"], ["desktop", "601:2", "301:20", "601:20"]]) {
    const index = viewport === "mobile" ? 0 : 1, actual = f.pp.variants[index].source_node.children[0], original = structuredClone(actual);
    actual.main_component_id = variantId; actual.children = [{ ...node(`I${placement};${innerId}`, "INSTANCE", [
      node(`I${placement};${innerId};402:${index+1}`, "TEXT", [], "body"),
      node(`I${placement};${innerId};401:${index?20:10}`, "FRAME", [node(`I${placement};${innerId};401:${index?21:11}`, "VECTOR")], "artwork @4x"),
    ], "item"), main_component_id: index ? "401:2" : "401:1" }];
    trees.push(node(variantId, "COMPONENT", [{ ...node(innerId, "INSTANCE", original.children.map(c => ({ ...c, node_id: c.node_type === "TEXT" ? `I${innerId};402:${index+1}` : `I${innerId};401:${index?20:10}`, children: c.node_type === "TEXT" ? [] : [node(`I${innerId};401:${index?21:11}`, "VECTOR")] })), "item"), main_component_id: index ? "401:2" : "401:1" }]));
    element(middle, viewport, variantId, innerId, "nested-component", { component_id: "item" }); f.parent.contracts[viewport].root.children[0].component_id = "middle";
  }
  f.model.records.push(middle); f.session.component_ids.push("middle"); f.add(middle, trees);
  const count = n => 1 + (n.children ?? []).reduce((s,c) => s + count(c), 0); f.pp.capture_meta.node_count = f.pp.variants.reduce((s,v) => s + count(v.source_node), 0);
  const r = run(f); assert.equal(r.ok, true, JSON.stringify(r.issues));
  assert.deepEqual(r.boundaries.map(b => b.consumer_node_id), ["I301:10;601:10;401:10", "I301:20;601:20;401:20"]);
});
test("combined audit retains all scalar and capture diagnostics while adding nested proof", () => {
  const f = fixture(), before = auditFigmaContractFacts({ record: f.parent, live: f.pp });
  const r = evidence.auditFigmaComponentEvidence({ record: f.parent, live: f.pp, model: f.model, session: f.session });
  assert.deepEqual(r.facts, before); assert.ok(r.nested_artwork); assert.equal(r.nested_artwork.ok, true); assert.equal(r.ok, false);
});
for (const [label, mutate] of [
  ["missing", f => f.parent.contracts.figma_fact_links.pop()],
  ["duplicate", f => f.parent.contracts.figma_fact_links.push(structuredClone(f.parent.contracts.figma_fact_links[0]))],
  ["wrong node", f => { f.parent.contracts.figma_fact_links[0].node_id = "301:1"; }],
  ["wrong units", f => { f.parent.contracts.desktop.root.children[0].facts[0].value.unit = "%"; }],
]) reject("nested placement rejects " + label + " owned geometry proof", "EVIDENCE_NESTED_GEOMETRY_UNVERIFIED", mutate);
reject("wrong Item placement main is unverified", "EVIDENCE_NESTED_PLACEMENT_UNVERIFIED", f => { f.pp.variants[0].source_node.children[0].main_component_id = "401:2"; });
reject("native source selector cannot be replaced by a similar boundary", "EVIDENCE_NESTED_SELECTOR_UNVERIFIED", f => { f.item.asset_contracts[0].export_boundary.semantic_node_name = "missing @4x"; });
reject("stale child source capture is not accepted", "EVIDENCE_REQUEST_IDENTITY_MISMATCH", f => { f.ip.capture_meta.request.request_nonce = nonce(99); });
reject("missing glyph target receipt blocks actual dependency", "EVIDENCE_CAPTURE_MISSING", f => { f.session.captures.pop(); });
reject("incomplete child source tree blocks scope propagation", "EVIDENCE_CAPTURE_INCOMPLETE", f => { f.ip.capture_meta.tree_complete = false; });
reject("wrong target owner cannot prove an equal main ID", "EVIDENCE_CAPTURE_IDENTITY_MISMATCH", f => { f.gp.component_node_id = "500:9"; });
reject("unknown glyph source is explicitly unverified without inventing a record", "EVIDENCE_NESTED_TARGET_UNKNOWN", f => { f.item.evidence_links.source_dependencies[0].target.component_id = "unregistered-glyph"; });
reject("ancestor HTML wrapper cannot become the asset owner", "EVIDENCE_ASSET_OWNER_MISMATCH", f => { f.item.evidence_links.source_dependencies[0].asset_owner.node_id = "401:1"; });
reject("stripped master ID cannot substitute actual compound ancestry", "EVIDENCE_NESTED_ANCESTRY_UNVERIFIED", f => { f.pp.variants[0].source_node.children[0].children[1].node_id = "401:10"; });
reject("actual overridden glyph main is compared instead of inheriting its default", "EVIDENCE_NESTED_PLACEMENT_UNVERIFIED", f => { f.pp.variants[0].source_node.children[0].children[1].main_component_id = "500:99"; });
test("ordinary HTML is outside this extra scope and caller inputs are immutable", () => {
  const f = fixture(true); f.item.asset_contracts = []; const before = structuredClone({ model: f.model, session: f.session });
  const r = run(f); assert.equal(r.ok, true); assert.deepEqual(r.boundaries, []); assert.deepEqual(r.dependencies, []);
  assert.deepEqual({ model: f.model, session: f.session }, before);
});
test("nested child capture errors stay visible and never certify whole artwork", () => {
  const f = fixture(true); f.ip.capture_errors.push({ code: "MIXED_VALUE", node_id: "401:10", field: "fills" });
  const r = run(f); assert.equal(r.ok, false); assert.ok(has(r, "EVIDENCE_CAPTURE_ERROR"));
});


test("validated nested direct-image boundary gives its raw absolute warning a separate verified disposition", () => {
  const f = fixture();
  const artwork = f.ip.variants[0].source_node.children.find(child => child.node_id === "401:10");
  artwork.layout = { mode: "NONE", horizontal_sizing: "FIXED", vertical_sizing: "FIXED", padding: { top: 0, right: 0, bottom: 0, left: 0 } };
  const raw = { code: "ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW", node_id: "401:10" };
  f.ip.capture_errors.push(raw);
  const before = structuredClone(f.ip.capture_errors), report = run(f);
  assert.ok(Array.isArray(report.capture_diagnostics), "nested report must expose target raw diagnostic dispositions");
  const disposition = report.capture_diagnostics.find(value => value.raw?.node_id === raw.node_id);
  assert.deepEqual(disposition?.raw, raw); assert.equal(disposition?.status, "verified"); assert.ok(disposition?.reason);
  assert.ok(!report.issues.some(issue => issue.code === "EVIDENCE_CAPTURE_ERROR" && issue.capture_error?.node_id === raw.node_id));
  assert.deepEqual(f.ip.capture_errors, before);
});

test("absolute warning outside an exact node-export boundary remains unresolved", () => {
  const f = fixture();
  const artwork = f.ip.variants[0].source_node.children.find(child => child.node_id === "401:10");
  artwork.layout = { mode: "NONE", horizontal_sizing: "FIXED", vertical_sizing: "FIXED", padding: { top: 0, right: 0, bottom: 0, left: 0 } };
  f.item.asset_contracts[0].export_boundary.kind = "fill";
  const raw = { code: "ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW", node_id: "401:10" };
  f.ip.capture_errors.push(raw);
  const report = run(f), disposition = report.capture_diagnostics?.find(value => value.raw?.node_id === raw.node_id);
  assert.equal(disposition?.status, "unverified"); assert.ok(disposition?.reason);
  assert.ok(report.issues.some(issue => issue.code === "EVIDENCE_CAPTURE_ERROR" && issue.capture_error?.node_id === raw.node_id));
});

for (const [label, mutate] of [
  ["missing native NONE layout", f => { delete f.ip.variants[0].source_node.children.find(child => child.node_id === "401:10").layout; }],
  ["non-NONE native layout", f => { f.ip.variants[0].source_node.children.find(child => child.node_id === "401:10").layout.mode = "VERTICAL"; }],
  ["incomplete artwork children", f => { f.ip.variants[0].source_node.children.find(child => child.node_id === "401:10").children = []; }],
  ["missing source dependency", f => { f.item.evidence_links.source_dependencies = []; }],
  ["unknown canonical target", f => { f.item.evidence_links.source_dependencies[0].target.component_id = "missing-remote-target"; }],
]) test("absolute warning is unresolved with " + label, () => {
  const f = fixture();
  const artwork = f.ip.variants[0].source_node.children.find(child => child.node_id === "401:10");
  artwork.layout = { mode: "NONE", horizontal_sizing: "FIXED", vertical_sizing: "FIXED", padding: { top: 0, right: 0, bottom: 0, left: 0 } };
  mutate(f); const raw = { code: "ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW", node_id: "401:10" }; f.ip.capture_errors.push(raw);
  const report = run(f), disposition = report.capture_diagnostics?.find(value => value.raw?.node_id === raw.node_id);
  assert.equal(disposition?.status, "unverified"); assert.ok(disposition?.reason);
  assert.ok(report.issues.some(issue => issue.code === "EVIDENCE_CAPTURE_ERROR" && issue.capture_error?.node_id === raw.node_id));
});

test("remote source-only root lacking NONE layout remains unresolved when artificially warned", () => {
  const f = fixture();
  f.glyph.identity.library = "shared"; f.glyph.figma.remote_source = { component_key: "remote-key" };
  const root = f.gp.variants[0].source_node;
  root.remote_source = { remote: true, component_key: "remote-key" };
  const raw = { code: "ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW", node_id: root.node_id };
  f.gp.capture_errors.push(raw);
  const report = run(f), disposition = report.capture_diagnostics?.find(value => value.raw?.node_id === raw.node_id);
  assert.equal(disposition?.status, "unverified"); assert.ok(disposition?.reason);
  assert.ok(report.issues.some(issue => issue.code === "EVIDENCE_CAPTURE_ERROR" && issue.capture_error?.node_id === raw.node_id));
});

test("remote key mismatch leaves an otherwise-NONE source-only warning unresolved", () => {
  const f = fixture(); f.glyph.identity.library = "shared"; f.glyph.figma.remote_source = { component_key: "remote-key" };
  const root = f.gp.variants[0].source_node;
  root.remote_source = { remote: true, component_key: "wrong-key" };
  root.layout = { mode: "NONE", horizontal_sizing: "FIXED", vertical_sizing: "FIXED", padding: { top: 0, right: 0, bottom: 0, left: 0 } };
  const raw = { code: "ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW", node_id: root.node_id }; f.gp.capture_errors.push(raw);
  const report = run(f), disposition = report.capture_diagnostics?.find(value => value.raw?.node_id === raw.node_id);
  assert.equal(disposition?.status, "unverified"); assert.ok(disposition?.reason);
  assert.ok(report.issues.some(issue => issue.code === "EVIDENCE_CAPTURE_ERROR" && issue.capture_error?.node_id === raw.node_id));
});

test("unsupported paint diagnostic inside declared artwork remains unresolved", () => {
  const f = fixture();
  const artwork = f.ip.variants[0].source_node.children.find(child => child.node_id === "401:10");
  artwork.layout = { mode: "NONE", horizontal_sizing: "FIXED", vertical_sizing: "FIXED", padding: { top: 0, right: 0, bottom: 0, left: 0 } };
  const raw = { code: "UNSUPPORTED_FIELD", node_id: artwork.node_id, field: "fills" }; f.ip.capture_errors.push(raw);
  const report = run(f), disposition = report.capture_diagnostics?.find(value => value.raw?.node_id === raw.node_id && value.raw?.field === raw.field);
  assert.equal(disposition?.status, "unverified"); assert.ok(report.issues.some(issue => issue.code === "EVIDENCE_CAPTURE_ERROR" && issue.capture_error?.field === "fills"));
});
