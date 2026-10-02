import assert from "node:assert/strict";
import test from "node:test";
import { auditComponentEvidenceLinks, collectRequiredComponentEvidence } from "../../scripts/lib/figma-component-evidence.mjs";

// Synthetic model/session, never evidence of a real Figma reading.
const SHA = "a".repeat(40);
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
  const packet = { capture_version: "1.1.0", file_key: record.figma.file_key, component_node_id: record.figma.node_id,
    component_properties: [], capture_errors: [], capture_meta: { started_at: "2026-10-02T09:00:01.000Z", completed_at: "2026-10-02T09:00:02.000Z", tree_complete: true, node_count: 4 },
    variants: record.variants.map((variant, i) => ({ variant_node_id: variant.node_id, axes: structuredClone(variant.axes), source_node: i ? mobile : desktop })) };
  const foundation = { shell: { background_color: "#F3F3F5", max_width_px: 600, horizontal_inset_px: 0 } };
  const model = { canonical_sha: SHA, records: [record], manifest: { sources: [{ id: "rendering-foundation", kind: "registry", path: "data/foundations/rendering.yaml" }] }, source_documents: new Map([["rendering-foundation", foundation]]), targets: new Map() };
  const session = { schema_version: "1.0.0", canonical_git_sha: SHA, started_at: "2026-10-02T09:00:00.000Z", completed_at: "2026-10-02T09:00:04.000Z", component_ids: [record.id], captures: [{ component_id: record.id, receipt_id: "synthetic-receipt", tool: "use_figma", received_at: "2026-10-02T09:00:03.000Z", packet_path: "packet.json", packet_sha256: "0".repeat(64), packet }] };
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
  ["capture before session", "desktop-width", f => { f.packet.capture_meta.started_at = "2026-10-02T08:00:00.000Z"; }],
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
