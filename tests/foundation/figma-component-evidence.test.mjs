import assert from "node:assert/strict";
import test from "node:test";
import { auditComponentEvidenceLinks, collectRequiredComponentEvidence } from "../../scripts/lib/figma-component-evidence.mjs";

// Synthetic model/session, never evidence of a real Figma reading.
const SHA = "a".repeat(40);
const nonce = value => value.toString(16).padStart(64, "0");
const SESSION_NONCE = nonce(1);
const REQUEST_NONCE = nonce(2);
const color = () => ({ type: "solid", visible: true, opacity: 1, color: "#F3F3F5" });
function node(id, type, width) {
  return { node_id: id, name: "arbitrary label", node_type: type, visible: true, opacity: 1,
    reference_dimensions: { width, height: 1000, unit: "px" }, fills: [color()],
    layout: { mode: "VERTICAL", horizontal_sizing: "FIXED", vertical_sizing: "HUG", padding: { top: 0, right: 0, bottom: 0, left: 0 } }, children: [] };
}
function fixture() {
  const record = { id: "synthetic-envelope", identity: { semantic_role: "template", node_kind: "component-set" },
    figma: { file_key: "synthetic-file", node_id: "77:1" }, asset_contracts: [],
    variants: [{ id: "wide", node_id: "77:2", axes: [{ name: "Viewport", value: "Desktop" }] },
      { id: "narrow", node_id: "77:3", axes: [{ name: "Viewport", value: "Mobile" }] }],
    contracts: Object.fromEntries(["desktop", "mobile"].map(viewport => [viewport, { root: { render_mode: "presentation-table", children: [{ render_mode: "slot", children: [] }] } }])),
    evidence_links: { foundation_values: [], source_dependencies: [] } };
  const desktop = node("77:2", "COMPONENT", 600), mobile = node("77:3", "COMPONENT", 328);
  desktop.children.push(node("77:4", "SLOT", 600)); mobile.children.push(node("77:5", "SLOT", 328));
  for (const [viewport, root] of [["desktop", desktop], ["mobile", mobile]]) {
    const add = (suffix, targetNode, field, pointer, comparison) => record.evidence_links.foundation_values.push({
      id: `${viewport}-${suffix}`, source: { variant_node_id: root.node_id, node_id: targetNode.node_id, field_path: field },
      target: { source_id: "rendering-foundation", pointer }, comparison });
    add("root-background", root, "/fills/0/color", "/shell/background_color", "opaque-solid-color");
    add("slot-background", root.children[0], "/fills/0/color", "/shell/background_color", "opaque-solid-color");
    if (viewport === "desktop") add("width", root, "/reference_dimensions/width", "/shell/max_width_px", "pixel-number");
    for (const side of ["left", "right"]) add(side, root, `/layout/padding/${side}`, "/shell/horizontal_inset_px", "pixel-number");
  }
  const packet = { capture_version: "1.2.0", file_key: record.figma.file_key, component_node_id: record.figma.node_id,
    component_properties: [], capture_errors: [], capture_meta: { started_at: "2040-01-01T09:00:01.000Z", completed_at: "2040-01-01T09:00:02.000Z", request: { session_nonce: SESSION_NONCE, request_nonce: REQUEST_NONCE, canonical_git_sha: SHA }, tree_complete: true, node_count: 4 },
    variants: record.variants.map((variant, i) => ({ variant_node_id: variant.node_id, axes: structuredClone(variant.axes), source_node: i ? mobile : desktop })) };
  const foundation = { shell: { background_color: "#F3F3F5", max_width_px: 600, horizontal_inset_px: 0 } };
  const model = { canonical_sha: SHA, records: [record], manifest: { sources: [{ id: "rendering-foundation", kind: "registry", path: "data/foundations/rendering.yaml" }] }, source_documents: new Map([["rendering-foundation", foundation]]), targets: new Map() };
  const session = { schema_version: "1.1.0", canonical_git_sha: SHA, session_nonce: SESSION_NONCE, started_at: "2026-10-02T09:00:00.000Z", completed_at: "2026-10-02T09:00:04.000Z", component_ids: [record.id], captures: [{ component_id: record.id, receipt_id: "synthetic-receipt", tool: "use_figma", request_nonce: REQUEST_NONCE, requested_at: "2026-10-02T09:00:01.000Z", received_at: "2026-10-02T09:00:03.000Z", packet_path: "packet.json", packet_sha256: "0".repeat(64), packet }] };
  return { record, packet, model, session, desktop, mobile, foundation };
}
const audit = f => auditComponentEvidenceLinks({ recordId: f.record.id, model: f.model, session: f.session });
const link = (f, id) => f.record.evidence_links.foundation_values.find(v => v.id === id);
const result = (r, id) => r.results.find(v => v.link_id === id);
const code = (r, value) => r.issues.some(v => v.code === value);
const key = s => JSON.stringify([s.variant_node_id, s.node_id, s.field_path]);
const keys = sources => sources.map(key).sort();
function recount(f) {
  let count = 0;
  const walk = n => { count++; (n.children ?? []).forEach(walk); };
  f.packet.variants.forEach(v => walk(v.source_node)); f.packet.capture_meta.node_count = count;
}

test("nine exact Template shell assertions verify with canonical values and receipts", () => {
  const f = fixture(), r = audit(f);
  assert.equal(r.ok, true); assert.deepEqual(r.issues, []);
  assert.equal(r.component_id, f.record.id); assert.equal(r.canonical_git_sha, SHA);
  assert.equal(r.session_started_at, f.session.started_at); assert.deepEqual(r.receipt_ids, ["synthetic-receipt"]);
  assert.equal(r.results.length, 9); assert.ok(r.results.every(v => v.status === "verified" && v.kind === "foundation-value"));
  assert.deepEqual(keys(r.required_sources), keys(f.record.evidence_links.foundation_values.map(v => v.source)));
  assert.deepEqual(keys(r.verified_sources), keys(r.required_sources));
  assert.equal(result(r, "desktop-width").expected, 600); assert.equal(result(r, "desktop-width").actual, 600);
  assert.equal(result(r, "desktop-width").source.file_key, "synthetic-file");
});

test("required collector is independent of evidence links and persisted snapshots", () => {
  const f = fixture(); const expected = keys(f.record.evidence_links.foundation_values.map(v => v.source));
  delete f.record.evidence_links; f.record.contracts.source_variants = [{ fake: true }];
  const r = collectRequiredComponentEvidence({ record: f.record, live: f.packet });
  assert.deepEqual(r.issues, []); assert.deepEqual(keys(r.required_sources), expected);
});
for (const mode of ["one", "all", "property"]) test(`missing ${mode} links cannot pass on remaining matches`, () => {
  const f = fixture();
  if (mode === "one") f.record.evidence_links.foundation_values.pop();
  else if (mode === "all") f.record.evidence_links.foundation_values = [];
  else delete f.record.evidence_links;
  const r = audit(f); assert.equal(r.ok, false); assert.equal(r.required_sources.length, 9);
  assert.equal(r.issues.filter(v => v.code === "EVIDENCE_REQUIRED_LINK_MISSING").length, mode === "one" ? 1 : 9);
});
for (const [label, id, change, expected, actual] of [
  ["width", "desktop-width", f => { f.desktop.reference_dimensions.width = 601; }, 600, 601],
  ["background", "desktop-root-background", f => { f.desktop.fills[0].color = "#FFFFFF"; }, "#F3F3F5", "#FFFFFF"],
  ["padding", "mobile-left", f => { f.mobile.layout.padding.left = 1; }, 0, 1],
]) test(`${label} mismatch is not unverified and not covered`, () => {
  const f = fixture(); change(f); const r = audit(f), item = result(r, id);
  assert.equal(r.ok, false); assert.equal(item.status, "mismatch"); assert.equal(item.expected, expected); assert.equal(item.actual, actual);
  assert.ok(!keys(r.verified_sources).includes(key(link(f, id).source)));
});

const unverified = [
  ["wrong file", "desktop-width", f => { f.packet.file_key = "foreign-file"; }],
  ["wrong owner", "desktop-width", f => { f.packet.component_node_id = "88:1"; }],
  ["wrong variant", "desktop-width", f => { link(f, "desktop-width").source.variant_node_id = "77:3"; }],
  ["wrong variant axes", "desktop-width", f => { f.packet.variants[0].axes[0].value = "Mobile"; }],
  ["wrong root", "desktop-width", f => { f.desktop.node_id = "88:2"; }],
  ["wrong root type", "desktop-width", f => { f.desktop.node_type = "FRAME"; }],
  ["foreign same HEX", "desktop-root-background", f => { const other = node("88:9", "RECTANGLE", 10); f.desktop.children.push(other); link(f, "desktop-root-background").source.node_id = other.node_id; recount(f); }],
  ["paint opacity", "desktop-root-background", f => { f.desktop.fills[0].opacity = 0.5; }],
  ["node opacity", "desktop-root-background", f => { f.desktop.opacity = 0.5; }],
  ["ancestor opacity", "desktop-slot-background", f => { f.desktop.opacity = 0.5; }],
  ["hidden source", "desktop-slot-background", f => { f.desktop.children[0].visible = false; }],
  ["hidden ancestor", "desktop-slot-background", f => { f.desktop.visible = false; }],
  ["hidden paint", "desktop-root-background", f => { f.desktop.fills[0].visible = false; }],
  ["unknown paint visibility", "desktop-root-background", f => { delete f.desktop.fills[0].visible; }],
  ["missing node opacity", "desktop-root-background", f => { delete f.desktop.opacity; }],
  ["second visible Fill", "desktop-root-background", f => { f.desktop.fills.push(color()); }],
  ["gradient", "desktop-root-background", f => { f.desktop.fills[0].type = "gradient_linear"; }],
  ["unsupported color", "desktop-root-background", f => { f.desktop.fills[0].color = "grey"; }],
  ["nonfixed desktop width", "desktop-width", f => { f.desktop.layout.horizontal_sizing = "HUG"; }],
  ["unknown width units", "desktop-width", f => { f.desktop.reference_dimensions.unit = "%"; }],
  ["nonfinite width", "desktop-width", f => { f.desktop.reference_dimensions.width = Infinity; }],
  ["missing padding", "mobile-left", f => { delete f.mobile.layout.padding.left; }],
  ["wrong target pairing", "desktop-width", f => { link(f, "desktop-width").target.pointer = "/shell/horizontal_inset_px"; f.desktop.reference_dimensions.width = 0; }],
  ["session SHA", "desktop-width", f => { f.session.canonical_git_sha = "b".repeat(40); }],
  ["request before session", "desktop-width", f => { f.session.captures[0].requested_at = "2026-10-02T08:00:00.000Z"; }],
  ["incomplete tree", "desktop-width", f => { f.packet.capture_meta.tree_complete = false; }],
  ["missing receipt", "desktop-width", f => { f.session.captures[0].receipt_id = ""; }],
  ["duplicate node identity", "desktop-width", f => { f.desktop.children.push(node("77:2", "FRAME", 600)); recount(f); }],
  ["duplicate live variant", "desktop-width", f => { f.packet.variants.push(structuredClone(f.packet.variants[0])); recount(f); }],
];
for (const [label, id, change] of unverified) test(`unverified: ${label}`, () => {
  const f = fixture(); change(f); const r = audit(f);
  assert.equal(r.ok, false); assert.notEqual(result(r, id)?.status, "verified"); assert.ok(r.issues.length);
});
for (const [label, change] of [
  ["no Slot", f => { f.desktop.children = []; }],
  ["two Slots", f => { f.desktop.children.push(node("77:6", "SLOT", 600)); }],
  ["nested instead of direct Slot", f => { const wrapper = node("77:6", "FRAME", 600); wrapper.children = f.desktop.children; f.desktop.children = [wrapper]; }],
  ["missing contract slot", f => { f.record.contracts.desktop.root.children = []; }],
  ["two contract slots", f => { f.record.contracts.desktop.root.children.push({ render_mode: "slot", children: [] }); }],
  ["two canonical Desktop variants", f => { f.record.variants.push({ id: "other-wide", node_id: "88:2", axes: [{ name: "Viewport", value: "Desktop" }] }); }],
]) test(`ambiguous scope: ${label}`, () => {
  const f = fixture(); change(f); recount(f);
  const r = audit(f); assert.equal(r.ok, false); assert.ok(code(r, "EVIDENCE_SCOPE_AMBIGUOUS"));
});
test("hidden extra Fill uses actual visible index, not first paint", () => {
  const f = fixture(); f.desktop.fills.unshift({ ...color(), visible: false, color: "#FFFFFF" });
  link(f, "desktop-root-background").source.field_path = "/fills/1/color";
  assert.equal(audit(f).ok, true);
  link(f, "desktop-root-background").source.field_path = "/fills/0/color";
  const r = audit(f); assert.equal(r.ok, false); assert.ok(code(r, "EVIDENCE_REQUIRED_LINK_MISSING"));
});
test("mobile reference width, HUG heights and Slot padding are not shell obligations", () => {
  const f = fixture(); f.mobile.reference_dimensions.width = 375;
  f.desktop.reference_dimensions.height = 4321; f.mobile.reference_dimensions.height = 1234;
  f.desktop.children[0].layout.padding.left = 99;
  const r = audit(f); assert.equal(r.ok, true); assert.equal(r.required_sources.length, 9);
});
test("uses only existing float normalization, no visual tolerance", () => {
  const f = fixture(); f.desktop.reference_dimensions.width = 600.00001;
  assert.equal(audit(f).ok, true);
  f.desktop.reference_dimensions.width = 600.001; assert.equal(result(audit(f), "desktop-width").status, "mismatch");
});
test("canonical foundation values are resolved afresh, not hardcoded or cached", () => {
  const f = fixture(); f.foundation.shell.max_width_px = 640; f.desktop.reference_dimensions.width = 640;
  f.model.targets.set(`${f.record.id}/desktop-width`, { expected: 600 });
  const r = audit(f); assert.equal(r.ok, true); assert.equal(result(r, "desktop-width").expected, 640);
  f.model.manifest.sources = []; assert.equal(audit(f).ok, false);
});
test("unrelated capture errors remain present without claiming whole-node coverage", () => {
  const f = fixture(), error = { code: "UNSUPPORTED_FIELD", node_id: "77:4", field: "effects" };
  f.packet.capture_errors.push(error); const r = audit(f);
  assert.equal(r.ok, false); assert.ok(r.issues.some(i => i.code === "EVIDENCE_CAPTURE_ERROR" && JSON.stringify(i.capture_error) === JSON.stringify(error)));
  assert.ok(r.verified_sources.every(s => s.field_path !== "/fills" && s.field_path !== "/"));
});
test("deterministic sorted results and no input mutation or label selectors", () => {
  const f = fixture(); const before = structuredClone(f);
  const a = audit(f); assert.deepEqual(f, before);
  f.record.evidence_links.foundation_values.reverse(); f.packet.variants.reverse(); f.record.variants.reverse();
  f.desktop.children[0].name = "not Content";
  assert.deepEqual(audit(f), a);
});

// S1 fixtures deliberately use synthetic geometry-free data, not saved Figma facts.
function s1Fixture() {
  const asset = (id, name) => ({ id, owner_layer_name: name, export_boundary: { kind: "node", semantic_node_name: name }, source_viewport: "desktop" });
  const record = (id, rootId, role, variants = []) => ({ id, identity: { semantic_role: role, node_kind: variants.length ? "component-set" : "component" },
    figma: { file_key: "synthetic-s1", node_id: rootId }, variants, asset_contracts: [],
    contracts: { mobile: { root: { render_mode: role === "asset" || role === "icon" ? "figma-source-only" : "presentation-table", children: [] } }, desktop: { root: { render_mode: role === "asset" || role === "icon" ? "figma-source-only" : "presentation-table", children: [] } } },
    evidence_links: { foundation_values: [], source_dependencies: [] } });
  const variant = (id, nodeId, name, value) => ({ id, node_id: nodeId, axes: [{ name, value }] });
  const root = (id, name = "component") => ({ node_id: id, node_type: "COMPONENT", name, children: [] });
  const instance = (id, name, main, children = []) => ({ node_id: id, node_type: "INSTANCE", name, main_component_id: main, children });
  const product = record("synthetic-product", "801:1", "asset", [variant("brand", "801:2", "Product", "Brand")]);
  const big = record("synthetic-big-logo", "802:1", "asset", [variant("brand", "802:2", "Product", "Brand")]);
  big.asset_contracts = [asset("logo", "logo @4x")];
  for (const viewport of ["mobile", "desktop"]) big.contracts[viewport].root = { render_mode: "presentation-table", children: [{ render_mode: "direct-image", asset_contract_id: "logo", children: [] }] };
  const compact = record("synthetic-compact", "803:1", "asset", [variant("brand", "803:2", "Product", "Brand")]);
  const header = record("synthetic-header", "804:1", "email", [variant("desktop", "804:2", "Viewport", "Desktop"), variant("mobile", "804:3", "Viewport", "Mobile")]);
  header.asset_contracts = [asset("header-logo", "header-logo @4x")];
  const lock = record("synthetic-lock", "805:1", "icon"), receipt = record("synthetic-receipt", "806:1", "icon");
  const badge = record("synthetic-badge", "807:1", "asset"); badge.asset_contracts = [asset("badge", "Badge @4x")];
  const block = record("synthetic-receipt-block", "808:1", "block"); block.asset_contracts = [asset("status", "status @4x")];
  const records = [product, big, compact, header, lock, receipt, badge, block];
  const roots = new Map([
    [product.id, [root("801:2")]],
    [big.id, [{ ...root("802:2", "Product=Brand"), children: [instance("802:3", "product", "801:2")] }]],
    [compact.id, [{ ...root("803:2"), children: [instance("803:3", "product", "801:2")] }]],
    [header.id, [{ ...root("804:2"), children: [instance("804:4", "header-logo @4x", "802:2", [instance("I804:4;802:3", "product", "801:2")])] },
      { ...root("804:3"), children: [instance("804:5", "header-logo @4x", "803:2", [instance("I804:5;803:3", "product", "801:2")])] }]],
    [lock.id, [root("805:1")]], [receipt.id, [root("806:1")]],
    [badge.id, [{ ...root("807:1", "Badge @4x"), children: [instance("807:2", "glyph", "805:1")] }]],
    [block.id, [{ ...root("808:1"), children: [instance("502:24255", "status @4x", "807:1", [instance("I502:24255;491:22378", "glyph", "806:1")])] }]],
  ]);
  const add = (owner, id, variantId, nodeId, target, ownerId, assetId) => owner.evidence_links.source_dependencies.push({ id,
    source: { variant_node_id: variantId, node_id: nodeId }, target,
    asset_owner: { node_id: ownerId, ...(assetId ? { asset_id: assetId } : {}) } });
  add(big, "product", "802:2", "802:3", { component_id: product.id, variant_id: "brand" }, "802:2", "logo");
  add(compact, "product", "803:2", "803:3", { component_id: product.id, variant_id: "brand" }, "803:2");
  add(header, "desktop-logo", "804:2", "804:4", { component_id: big.id, variant_id: "brand" }, "804:4", "header-logo");
  add(header, "desktop-product", "804:2", "I804:4;802:3", { component_id: product.id, variant_id: "brand" }, "804:4", "header-logo");
  add(header, "mobile-logo", "804:3", "804:5", { component_id: compact.id, variant_id: "brand" }, "804:5", "header-logo");
  add(header, "mobile-product", "804:3", "I804:5;803:3", { component_id: product.id, variant_id: "brand" }, "804:5", "header-logo");
  add(badge, "default-glyph", "807:1", "807:2", { component_id: lock.id }, "807:1", "badge");
  add(block, "badge", "808:1", "502:24255", { component_id: badge.id }, "502:24255", "status");
  add(block, "override-glyph", "808:1", "I502:24255;491:22378", { component_id: receipt.id }, "502:24255", "status");
  const session = { schema_version: "1.1.0", canonical_git_sha: SHA, session_nonce: SESSION_NONCE, started_at: "2026-10-02T09:00:00.000Z", completed_at: "2026-10-02T09:00:04.000Z", component_ids: records.map(r => r.id), captures: [] };
  for (const owner of records) {
    const trees = roots.get(owner.id), count = n => 1 + n.children.reduce((sum, child) => sum + count(child), 0);
    const requestNonce = nonce(session.captures.length + 10);
    const packet = { capture_version: "1.2.0", file_key: owner.figma.file_key, component_node_id: owner.figma.node_id, component_properties: [], capture_errors: [],
      capture_meta: { started_at: "2040-01-01T09:00:01.000Z", completed_at: "2040-01-01T09:00:02.000Z", request: { session_nonce: SESSION_NONCE, request_nonce: requestNonce, canonical_git_sha: SHA }, tree_complete: true, node_count: trees.reduce((sum, tree) => sum + count(tree), 0) },
      variants: trees.map((tree, i) => ({ variant_node_id: tree.node_id, axes: structuredClone(owner.variants[i]?.axes ?? []), source_node: tree })) };
    session.captures.push({ component_id: owner.id, receipt_id: `synthetic-${owner.id}`, tool: "use_figma", request_nonce: requestNonce, requested_at: "2026-10-02T09:00:01.000Z", received_at: "2026-10-02T09:00:03.000Z", packet_path: `${owner.id}.json`, packet_sha256: "0".repeat(64), packet });
  }
  const model = { canonical_sha: SHA, records, manifest: { sources: [] }, source_documents: new Map(), targets: new Map() };
  return { model, session, product, big, compact, header, lock, receipt, badge, block, roots, instance };
}
const s1Audit = (f, record = f.block) => auditComponentEvidenceLinks({ recordId: record.id, model: f.model, session: f.session });
const s1Packet = (f, record) => f.session.captures.find(c => c.component_id === record.id).packet;
function s1Count(f, record) { const p = s1Packet(f, record), count = n => 1 + (n.children ?? []).reduce((s, c) => s + count(c), 0); p.capture_meta.node_count = p.variants.reduce((s, v) => s + count(v.source_node), 0); }

test("S1 verifies whole actual chains, source-only Compact and compound override without changing assets", () => {
  const f = s1Fixture();
  const { instance: ignoredInstance, ...cloneableFixture } = f;
  const before = structuredClone(cloneableFixture);
  for (const owner of [f.big, f.compact, f.header, f.badge, f.block]) {
    const r = s1Audit(f, owner); assert.equal(r.ok, true, JSON.stringify(r.issues));
    assert.ok(r.results.every(i => i.status === "verified" && i.kind === "source-dependency"));
  }
  const r = s1Audit(f); assert.equal(r.required_sources.length, 2);
  assert.deepEqual(r.verified_sources, [
    { variant_node_id: "808:1", node_id: "502:24255", field_path: "/main_component_id" },
    { variant_node_id: "808:1", node_id: "I502:24255;491:22378", field_path: "/main_component_id" },
  ]);
  assert.equal(result(r, "override-glyph").actual, "806:1");
  assert.equal(result(r, "override-glyph").asset_owner.node_id, "502:24255");
  assert.ok(r.receipt_ids.includes("synthetic-synthetic-receipt"));
  const { instance: ignoredAfter, ...after } = f;
  assert.deepEqual(after, before); assert.equal(f.compact.asset_contracts.length, 0);
});
test("S1 actual override does not inherit target default glyph", () => {
  const f = s1Fixture(); f.roots.get(f.block.id)[0].children[0].children[0].main_component_id = "805:1";
  const r = s1Audit(f); assert.equal(result(r, "override-glyph").status, "mismatch");
  assert.ok(code(r, "EVIDENCE_MAIN_COMPONENT_MISMATCH")); assert.equal(r.ok, false);
});
for (const mode of ["nested", "all"]) test(`S1 missing ${mode} links cannot hide actual instances`, () => {
  const f = s1Fixture(); if (mode === "nested") f.block.evidence_links.source_dependencies.pop(); else delete f.block.evidence_links;
  const r = s1Audit(f); assert.equal(r.ok, false); assert.equal(r.required_sources.length, 2);
  assert.equal(r.issues.filter(i => i.code === "EVIDENCE_REQUIRED_LINK_MISSING").length, mode === "nested" ? 1 : 2);
});
const s1Invalid = [
  ["neighbor variant", f => { f.header.evidence_links.source_dependencies[0].source.variant_node_id = "804:3"; }, "header"],
  ["master suffix without instance prefix", f => { f.block.evidence_links.source_dependencies[1].source.node_id = "491:22378"; }],
  ["detached node", f => { f.roots.get(f.block.id)[0].children[0].children[0].node_type = "FRAME"; }],
  ["null main", f => { f.roots.get(f.block.id)[0].children[0].main_component_id = null; }],
  ["target absent", f => { f.session.captures = f.session.captures.filter(c => c.component_id !== f.receipt.id); }],
  ["target wrong file", f => { s1Packet(f, f.receipt).file_key = "foreign"; }],
  ["target wrong owner", f => { s1Packet(f, f.receipt).component_node_id = "999:1"; }],
  ["target wrong root", f => { f.roots.get(f.receipt.id)[0].node_id = "999:2"; }],
  ["target missing variant", f => { s1Packet(f, f.product).variants = []; }, "header"],
  ["target wrong axes", f => { s1Packet(f, f.product).variants[0].axes[0].value = "other"; }, "header"],
  ["target duplicate variant", f => { const p = s1Packet(f, f.product); p.variants.push(structuredClone(p.variants[0])); s1Count(f, f.product); }, "header"],
  ["target duplicate node", f => { f.roots.get(f.receipt.id)[0].children.push({ node_id: "806:1", node_type: "VECTOR" }); s1Count(f, f.receipt); }],
  ["target incomplete capture", f => { s1Packet(f, f.receipt).capture_meta.tree_complete = false; }],
  ["target older session", f => { s1Packet(f, f.receipt).capture_meta.request.request_nonce = nonce(63); }],
  ["target missing receipt", f => { f.session.captures.find(c => c.component_id === f.receipt.id).receipt_id = ""; }],
  ["owner outside ancestry", f => { f.block.evidence_links.source_dependencies[1].asset_owner.node_id = "808:99"; }],
  ["ancestor outside boundary", f => { f.block.evidence_links.source_dependencies[1].asset_owner.node_id = "808:1"; }],
  ["two named export owners", f => { f.roots.get(f.block.id)[0].children.push(f.instance("808:99", "status @4x", "807:1")); s1Count(f, f.block); }],
  ["unknown asset", f => { f.block.evidence_links.source_dependencies[1].asset_owner.asset_id = "missing"; }],
  ["omitted owned asset", f => { delete f.block.evidence_links.source_dependencies[1].asset_owner.asset_id; }],
  ["missing export selector", f => { f.block.asset_contracts[0].export_boundary.semantic_node_name = "not-found @4x"; }],
  ["missing full children", f => { delete f.roots.get(f.block.id)[0].children[0].children; }],
  ["duplicate source IDs", f => { f.roots.get(f.block.id)[0].children.push(f.instance("502:24255", "other", "807:1")); s1Count(f, f.block); }],
];
for (const [label, change, owner = "block"] of s1Invalid) test(`S1 refuses ${label}`, () => {
  const f = s1Fixture(); change(f); const r = s1Audit(f, f[owner]); assert.equal(r.ok, false); assert.ok(r.issues.length);
});
test("S1 coverage is independent of links and excludes ordinary HTML nested components", () => {
  const f = s1Fixture(); f.roots.get(f.block.id)[0].children.push(f.instance("808:99", "HTML button", "999:1")); s1Count(f, f.block);
  delete f.block.evidence_links;
  const r = collectRequiredComponentEvidence({ record: f.block, live: s1Packet(f, f.block) });
  assert.deepEqual(r.issues, []); assert.deepEqual(r.required_sources.map(v => v.node_id), ["502:24255", "I502:24255;491:22378"]);
});
test("S1 source-only leaf has a genuinely complete empty scope", () => {
  const f = s1Fixture(); const r = s1Audit(f, f.lock); assert.equal(r.ok, true); assert.deepEqual(r.required_sources, []);
});
test("S1 target capture errors remain visible even when main identity matches", () => {
  const f = s1Fixture(); s1Packet(f, f.receipt).capture_errors.push({ code: "MIXED_VALUE", node_id: "806:1", field: "fills" });
  const r = s1Audit(f); assert.equal(r.ok, false); assert.ok(code(r, "EVIDENCE_CAPTURE_ERROR"));
});
test("S1 hidden instances stay in full dependency coverage", () => {
  const f = s1Fixture(); f.roots.get(f.block.id)[0].children[0].children[0].visible = false;
  assert.equal(s1Audit(f).ok, true); assert.equal(s1Audit(f).required_sources.length, 2);
});

// This remains synthetic: it specifies the resolver boundary and is not a Figma capture.
function mobileDirectImageFixture() {
  const f = s1Fixture(), header = f.header;
  const desktopImage = f.roots.get(header.id)[0].children[0];
  const mobileImage = f.roots.get(header.id)[1].children[0];
  mobileImage.name = "brand @4x";
  header.asset_contracts[0] = {
    ...header.asset_contracts[0], source_mode_id: "rendered-node", display_mode_id: "direct-image", export_profile_id: "png-4x", source_viewport: "desktop",
    owner_layer_name: "desktop-export-label", export_boundary: { kind: "node", semantic_node_name: "desktop-export-label" },
  };
  desktopImage.name = "desktop-export-label";
  header.contracts.mobile.root = { render_mode: "presentation-table", children: [{
    id: "mobile-direct-image", semantic_role: "brand", render_mode: "direct-image", asset_contract_id: "header-logo", children: [],
    facts: [{ id: "reference-size", value: { type: "dimensions", width: 322, height: 50, unit: "px" }, provenance: { kind: "figma-literal", node_id: mobileImage.node_id } }],
  }] };
  header.contracts.figma_fact_links = [
    { variant_node_id: "804:3", node_id: mobileImage.node_id, source_path: "/reference_dimensions/width", contract_path: "/contracts/mobile/root/children/0/facts/0/value/width", transform: "identity" },
    { variant_node_id: "804:3", node_id: mobileImage.node_id, source_path: "/reference_dimensions/height", contract_path: "/contracts/mobile/root/children/0/facts/0/value/height", transform: "identity" },
  ];
  s1Count(f, header);
  return { f, header, mobileImage };
}
const mobileScope = ({ f, header }) => collectRequiredComponentEvidence({ record: header, live: s1Packet(f, header) });
const boundaryCode = result => result.issues.some(item => item.code === "EVIDENCE_ASSET_BOUNDARY_UNVERIFIED");
const mobileAudit = ({ f, header }) => s1Audit(f, header);
const sourceIds = result => result.required_sources.map(source => source.node_id);
const headerSourceIds = ["804:4", "I804:4;802:3", "804:5", "I804:5;803:3"];

test("S1 resolves the exact semantic other-viewport direct-image boundary from its local asset contract", () => {
  const fixture = mobileDirectImageFixture(), result = mobileAudit(fixture);
  assert.equal(result.ok, true, JSON.stringify(result.issues));
  assert.deepEqual(sourceIds(result), headerSourceIds);
});
test("S1 refuses missing, conflicting, duplicate, or unproven mobile direct-image identity facts", () => {
  const changes = [
    [fixture => { fixture.header.contracts.mobile.root.children[0].asset_contract_id = "other-asset"; }, "EVIDENCE_ASSET_BOUNDARY_UNVERIFIED"],
    [fixture => { fixture.header.contracts.mobile.root.children[0].facts[0].provenance.node_id = "804:wrong"; }, "EVIDENCE_ASSET_BOUNDARY_UNVERIFIED"],
    [fixture => { fixture.header.contracts.mobile.root.children[0].facts[0].provenance.kind = "derived"; }, "EVIDENCE_ASSET_BOUNDARY_UNVERIFIED"],
    [fixture => { fixture.header.contracts.figma_fact_links[0].variant_node_id = "804:2"; }, "EVIDENCE_ASSET_BOUNDARY_UNVERIFIED"],
    [fixture => { fixture.header.contracts.figma_fact_links[0].source_path = "/reference_dimensions/height"; }, "EVIDENCE_ASSET_BOUNDARY_UNVERIFIED"],
    [fixture => { fixture.header.contracts.figma_fact_links.pop(); }, "EVIDENCE_ASSET_BOUNDARY_UNVERIFIED"],
    [fixture => { fixture.header.contracts.figma_fact_links.push(structuredClone(fixture.header.contracts.figma_fact_links[0])); }, "EVIDENCE_ASSET_BOUNDARY_UNVERIFIED"],
    [fixture => { fixture.f.roots.get(fixture.header.id)[1].node_id = "804:missing"; }, "EVIDENCE_CAPTURE_IDENTITY_MISMATCH"],
  ];
  for (const [change, expectedCode] of changes) {
    const fixture = mobileDirectImageFixture(); change(fixture); s1Count(fixture.f, fixture.header);
    assert.ok(mobileScope(fixture).issues.some(issue => issue.code === expectedCode));
  }
});
test("S1 does not let a desktop-named sibling hijack mobile selection", () => {
  const fixture = mobileDirectImageFixture();
  fixture.f.roots.get(fixture.header.id)[1].children.push({ node_id: "804:desktop-name", name: "desktop-export-label", node_type: "FRAME", visible: true, opacity: 1, children: [] });
  s1Count(fixture.f, fixture.header);
  const result = mobileAudit(fixture);
  assert.equal(result.ok, true, JSON.stringify(result.issues));
  assert.deepEqual(sourceIds(result), headerSourceIds);
});
test("S1 rejects duplicate direct-image consumers for one mobile asset", () => {
  const fixture = mobileDirectImageFixture(); fixture.header.contracts.mobile.root.children.push(structuredClone(fixture.header.contracts.mobile.root.children[0]));
  assert.equal(boundaryCode(mobileScope(fixture)), true);
});
test("S1 still requires each mobile dependency link and exposes a nested main-component mismatch", () => {
  const missing = mobileDirectImageFixture();
  missing.header.evidence_links.source_dependencies = missing.header.evidence_links.source_dependencies.filter(link => link.source.node_id !== "I804:5;803:3");
  assert.ok(mobileAudit(missing).issues.some(item => item.code === "EVIDENCE_REQUIRED_LINK_MISSING"));
  const nested = mobileDirectImageFixture();
  nested.f.roots.get(nested.header.id)[1].children[0].children[0].main_component_id = "wrong-main";
  assert.ok(mobileAudit(nested).results.some(item => item.reason === "EVIDENCE_MAIN_COMPONENT_MISMATCH"));
});
test("S1 retains source export-selector, nested-main-component, capture, and scalar diagnostics", () => {
  const fixture = mobileDirectImageFixture(); fixture.header.asset_contracts[0].export_boundary.semantic_node_name = "missing-desktop-export";
  assert.equal(boundaryCode(mobileScope(fixture)), true);
  const nested = s1Fixture(); nested.roots.get(nested.block.id)[0].children[0].children[0].main_component_id = "wrong-main";
  assert.equal(s1Audit(nested).ok, false);
  nested.roots.get(nested.block.id)[0].children[0].children[0].main_component_id = "806:1";
  s1Packet(nested, nested.block).capture_errors.push({ code: "MIXED_VALUE", node_id: "502:24255", field: "fills" });
  assert.equal(s1Audit(nested).ok, false);
});


function completeMixedText(id = "77:90") {
  return Object.assign(node(id, "TEXT", 10), {
    characters: "go!",
    styled_text_segments: [
      { start: 0, end: 2, characters: "go", font_family: "Roboto", font_style: "Regular", font_size_px: 14, line_height: { unit: "PERCENT", value: 140 }, fills: [color()], text_decoration: "NONE" },
      { start: 2, end: 3, characters: "!", font_family: "Roboto", font_style: "Regular", font_size_px: 14, line_height: { unit: "PERCENT", value: 140 }, fills: [color()], text_decoration: "UNDERLINE" },
    ],
  });
}

test("complete mixed TEXT runs are a verified disposition without erasing the raw capture error", () => {
  const f = fixture(), text = completeMixedText();
  f.desktop.children.push(text); recount(f);
  const raw = { code: "MIXED_VALUE", node_id: text.node_id, field: "textDecoration" };
  f.packet.capture_errors.push(raw);
  const before = structuredClone(f.packet.capture_errors), report = audit(f);
  assert.ok(Array.isArray(report.capture_diagnostics), "component evidence must expose raw diagnostic dispositions");
  const disposition = report.capture_diagnostics.find(value => value.raw?.node_id === text.node_id && value.raw?.field === raw.field);
  assert.deepEqual(disposition?.raw, raw); assert.equal(disposition?.status, "verified"); assert.ok(disposition?.reason);
  assert.ok(!report.issues.some(issue => issue.code === "EVIDENCE_CAPTURE_ERROR" && issue.capture_error?.node_id === text.node_id));
  assert.deepEqual(f.packet.capture_errors, before, "audit must not rewrite captured diagnostics");
});

for (const [label, mutate] of [
  ["gap", text => { text.styled_text_segments[0].end = 1; text.styled_text_segments[0].characters = "g"; }],
  ["overlap", text => { text.styled_text_segments[1].start = 1; }],
  ["foreign substring", text => { text.styled_text_segments[1].characters = "x"; }],
  ["missing family", text => { text.styled_text_segments[0].font_family = ""; }],
  ["invalid line height", text => { text.styled_text_segments[0].line_height = { unit: "AUTO", value: 0 }; }],
  ["unsupported mixed field", text => { text._mixedField = "fontWeight"; }],
]) test("mixed TEXT " + label + " remains an unresolved raw capture error", () => {
  const f = fixture(), text = completeMixedText(); f.desktop.children.push(text); recount(f); mutate(text);
  const field = text._mixedField ?? "textDecoration";
  f.packet.capture_errors.push({ code: "MIXED_VALUE", node_id: text.node_id, field });
  const report = audit(f), disposition = report.capture_diagnostics?.find(value => value.raw?.node_id === text.node_id && value.raw?.field === field);
  assert.equal(disposition?.status, "unverified"); assert.ok(disposition?.reason);
  assert.ok(report.issues.some(issue => issue.code === "EVIDENCE_CAPTURE_ERROR" && issue.capture_error?.node_id === text.node_id && issue.capture_error?.field === field));
});
