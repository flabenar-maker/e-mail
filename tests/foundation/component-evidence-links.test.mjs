import * as evidenceApi from "../../scripts/lib/component-evidence-links.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import { validateComponentRegistryShape, validateComponentRegistrySemantics, collectComponentReferences } from "../../scripts/lib/component-registry.mjs";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
// A missing new API is a deliberate RED assertion, not an uncaught import error.
const api = await import("../../scripts/lib/component-evidence-links.mjs").catch(error => {
  if (error.code === "ERR_MODULE_NOT_FOUND" && error.url?.endsWith("/component-evidence-links.mjs")) return {};
  throw error;
});
const shared = await readStrictYaml(join(root, "data/components/shared.yaml"));
const marketing = await readStrictYaml(join(root, "data/components/marketing.yaml"));
const schema = JSON.parse(await readFile(join(root, "schemas/components.schema.json"), "utf8"));
const foundationDocs = Object.fromEntries(await Promise.all(["typography", "spacing", "assets"].map(async id => [id, await readStrictYaml(join(root, `data/foundations/${id}.yaml`))])));

function records() {
  const owner = structuredClone(marketing.components.find(r => r.id === "email-header"));
  owner.id = "test-consumer";
  owner.figma.node_id = "10:1";
  owner.variants = [{id: "desktop", node_id: "10:2", axes: [{name: "Viewport", value: "Desktop"}]}, {id: "mobile", node_id: "10:3", axes: [{name: "Viewport", value: "Mobile"}]}];
  const target = structuredClone(shared.components.find(r => r.identity.node_kind === "component" && !r.variants.length));
  target.id = "test-artwork";
  target.figma.node_id = "20:1";
  owner.evidence_links = {foundation_values: [foundationLink()], source_dependencies: [dependencyLink()]};
  return [owner, target];
}
function foundationLink() {
  return {id: "desktop-width", source: {variant_node_id: "10:2", node_id: "10:2", field_path: "/reference_dimensions/width"}, target: {source_id: "rendering-foundation", pointer: "/shell/max_width_px"}, comparison: "pixel-number"};
}
function dependencyLink() {
  return {id: "artwork-source", source: {variant_node_id: "10:2", node_id: "I10:4;20:2;20:3"}, target: {component_id: "test-artwork"}, asset_owner: {node_id: "10:4", asset_id: "header-logo"}};
}
function validate(items) {
  assert.equal(typeof api.validateEvidenceLinkReferences, "function", "new reference validation API is required");
  return api.validateEvidenceLinkReferences({records: items});
}
function resolve(items, options = {}) {
  assert.equal(typeof api.resolveEvidenceTargets, "function", "new canonical target resolver is required");
  return api.resolveEvidenceTargets({records: items, manifest: {sources: [{id: "rendering-foundation", kind: "registry", path: "alternate/rendering.yaml"}]}, sourceDocuments: new Map([["rendering-foundation", {shell: {max_width_px: 600, horizontal_inset_px: 0, background_color: "#F3F3F5"}}]]), ...options});
}
function codes(items) { return validate(items).map(i => i.code); }
function shape(links) {
  const doc = structuredClone(marketing);
  doc.components = [records()[0]];
  doc.components[0].evidence_links = links;
  return validateComponentRegistryShape(doc, schema);
}

test("optional typed evidence metadata accepts exact compound instance IDs without changing inputs", () => {
  const items = records(); const before = structuredClone(items);
  assert.deepEqual(validate(items), []);
  assert.deepEqual(items, before);
  assert.deepEqual(shape(items[0].evidence_links), []);
  delete items[0].evidence_links;
  assert.deepEqual(validate(items), []);
  assert.deepEqual(validate([]), []);
  assert.deepEqual(shape({foundation_values: [], source_dependencies: []}), []);
});

test("native fact proofs are an optional closed evidence section", () => {
  const items = records();
  items[0].evidence_links.native_fact_proofs = [];
  assert.deepEqual(validate(items), []);
  assert.deepEqual(shape(items[0].evidence_links), []);
  items[0].evidence_links.future_proofs = [];
  assert.ok(shape(items[0].evidence_links).some(e => e.path.startsWith("/components/0/evidence_links")));
});

for (const [label, change, expectedCode] of [
  ["duplicate link ID across kinds", r => {r[0].evidence_links.source_dependencies[0].id = "desktop-width";}, "EVIDENCE_LINK_ID_DUPLICATE"],
  ["foreign source variant", r => {r[0].evidence_links.foundation_values[0].source.variant_node_id = "99:1";}, "EVIDENCE_SOURCE_VARIANT_INVALID"],
  ["node ID with trailing line break", r => {r[0].evidence_links.foundation_values[0].source.node_id = "10:2\n";}, "EVIDENCE_LINK_SHAPE_INVALID"],
  ["unknown target component", r => {r[0].evidence_links.source_dependencies[0].target.component_id = "absent";}, "EVIDENCE_TARGET_COMPONENT_UNKNOWN"],
  ["variant on standalone target", r => {r[0].evidence_links.source_dependencies[0].target.variant_id = "desktop";}, "EVIDENCE_TARGET_VARIANT_INVALID"],
  ["missing target variant", r => {r[1].identity.node_kind = "component-set"; r[1].variants = [{id: "product", node_id: "20:2", axes: []}];}, "EVIDENCE_TARGET_VARIANT_INVALID"],
  ["unknown target variant", r => {r[1].identity.node_kind = "component-set"; r[1].variants = [{id: "product", node_id: "20:2", axes: []}]; r[0].evidence_links.source_dependencies[0].target.variant_id = "absent";}, "EVIDENCE_TARGET_VARIANT_INVALID"],
  ["cross-file dependency", r => {r[1].figma.file_key = "another-file";}, "EVIDENCE_TARGET_FILE_MISMATCH"],
  ["asset from another owner", r => {r[0].evidence_links.source_dependencies[0].asset_owner.asset_id = "absent";}, "EVIDENCE_ASSET_UNKNOWN"],
  ["duplicate foundation assertion", r => {r[0].evidence_links.foundation_values.push({...foundationLink(), id: "duplicate-width"});}, "EVIDENCE_SOURCE_DUPLICATE"],
  ["conflicting foundation target for one assertion", r => {const link = {...foundationLink(), id: "conflicting-width", target: {source_id: "rendering-foundation", pointer: "/shell/horizontal_inset_px"}}; r[0].evidence_links.foundation_values.push(link);}, "EVIDENCE_SOURCE_DUPLICATE"],
  ["duplicate dependency source", r => {r[0].evidence_links.source_dependencies.push({...dependencyLink(), id: "second-source"});}, "EVIDENCE_SOURCE_DUPLICATE"],
  ["comparison incompatible with target", r => {r[0].evidence_links.foundation_values[0].comparison = "opaque-solid-color";}, "EVIDENCE_COMPARISON_INVALID"],
  ["unknown foundation source", r => {r[0].evidence_links.foundation_values[0].target.source_id = "other-source";}, "EVIDENCE_TARGET_DOMAIN_INVALID"],
  ["unsupported foundation pointer", r => {r[0].evidence_links.foundation_values[0].target.pointer = "/shell/min_supported_viewport_px";}, "EVIDENCE_TARGET_DOMAIN_INVALID"],
  ["self dependency", r => {r[0].evidence_links.source_dependencies[0].target = {component_id: "test-consumer", variant_id: "desktop"};}, "EVIDENCE_DEPENDENCY_CYCLE"],
  ["multi-record dependency cycle", r => {r[1].evidence_links = {foundation_values: [], source_dependencies: [{id: "back", source: {variant_node_id: "20:1", node_id: "20:2"}, target: {component_id: "test-consumer", variant_id: "mobile"}, asset_owner: {node_id: "20:1"}}]};}, "EVIDENCE_DEPENDENCY_CYCLE"],
]) test(`reference validation rejects ${label}`, () => {
  const items = records(); change(items);
  assert.ok(codes(items).includes(expectedCode), expectedCode);
});

test("standalone source uses only its own root, and distinct source assertions can share a target", () => {
  const items = records();
  items[0].identity.node_kind = "component"; items[0].variants = [];
  for (const link of [...items[0].evidence_links.foundation_values, ...items[0].evidence_links.source_dependencies]) link.source.variant_node_id = "10:1";
  const second = structuredClone(items[0].evidence_links.foundation_values[0]);
  second.id = "second-width"; second.source.node_id = "10:5";
  items[0].evidence_links.foundation_values.push(second);
  assert.deepEqual(validate(items), []);
  items[0].evidence_links.foundation_values[0].source.variant_node_id = "20:1";
  assert.ok(codes(items).includes("EVIDENCE_SOURCE_VARIANT_INVALID"));
});

for (const [label, change] of [
  ["missing foundation array", l => {delete l.foundation_values;}],
  ["missing dependency array", l => {delete l.source_dependencies;}],
  ["unknown section field", l => {l.verified = true;}],
  ["unknown link field", l => {l.foundation_values[0].expected_value = 600;}],
  ["arbitrary target file", l => {l.foundation_values[0].target.path = "custom.yaml";}],
  ["unknown source field", l => {l.foundation_values[0].source.name = "root";}],
  ["stored main-component ID", l => {l.source_dependencies[0].target.main_component_id = "20:1";}],
  ["unknown owner field", l => {l.source_dependencies[0].asset_owner.filename = "logo.png";}],
  ["malformed variant ID", l => {l.foundation_values[0].source.variant_node_id = "I10:2;20:1";}],
  ["malformed node ID", l => {l.foundation_values[0].source.node_id = "10-2";}],
  ["node ID with trailing line break", l => {l.foundation_values[0].source.node_id = "10:2\n";}],
  ["link ID with trailing line break", l => {l.foundation_values[0].id = "desktop-width\n";}],
  ["owner ID with trailing line break", l => {l.source_dependencies[0].asset_owner.node_id = "10:4\n";}],
  ["incomplete compound owner", l => {l.source_dependencies[0].asset_owner.node_id = "I10:4;";}],
  ["non-kebab link ID", l => {l.foundation_values[0].id = "Desktop Width";}],
  ["unknown comparison", l => {l.foundation_values[0].comparison = "approximately";}],
  ["wildcard source path", l => {l.foundation_values[0].source.field_path = "/fills/*/color";}],
  ["invalid JSON Pointer escape", l => {l.foundation_values[0].source.field_path = "/a~2b";}],
  ["wildcard target", l => {l.foundation_values[0].target.pointer = "/shell/*";}],
]) test(`closed evidence schema rejects ${label}`, () => {
  const links = records()[0].evidence_links; change(links);
  assert.ok(shape(links).some(e => e.path.startsWith("/components/0/evidence_links")));
});

test("canonical target resolver derives numeric/color values and exact main identities without input mutation", () => {
  const items = records();
  items[0].evidence_links.foundation_values.push({id: "background", source: {variant_node_id: "10:3", node_id: "10:3", field_path: "/fills/0/color"}, target: {source_id: "rendering-foundation", pointer: "/shell/background_color"}, comparison: "opaque-solid-color"});
  const before = structuredClone(items);
  const result = resolve(items);
  assert.deepEqual(result.issues, []);
  assert.deepEqual(result.targets.get("test-consumer/desktop-width"), {kind: "foundation-value", component_id: "test-consumer", link_id: "desktop-width", source: {file_key: items[0].figma.file_key, variant_node_id: "10:2", node_id: "10:2", field_path: "/reference_dimensions/width"}, target: {source_id: "rendering-foundation", pointer: "/shell/max_width_px"}, comparison: "pixel-number", expected: 600});
  assert.equal(result.targets.get("test-consumer/background").expected, "#F3F3F5");
  assert.deepEqual(result.targets.get("test-consumer/artwork-source"), {kind: "source-dependency", component_id: "test-consumer", link_id: "artwork-source", source: {file_key: items[0].figma.file_key, variant_node_id: "10:2", node_id: "I10:4;20:2;20:3"}, target: {component_id: "test-artwork", file_key: items[1].figma.file_key, node_id: "20:1"}, asset_owner: {node_id: "10:4", asset_id: "header-logo"}});
  assert.deepEqual(items, before);
  items[1].identity.node_kind = "component-set";
  items[1].variants = [{id: "product", node_id: "20:8", axes: []}];
  items[0].evidence_links.source_dependencies[0].target.variant_id = "product";
  assert.equal(resolve(items).targets.get("test-consumer/artwork-source").target.node_id, "20:8");
});

for (const [label, options, code] of [
  ["unregistered foundation", {manifest: {sources: []}}, "EVIDENCE_SOURCE_UNREGISTERED"],
  ["duplicate manifest source", {manifest: {sources: [{id: "rendering-foundation"}, {id: "rendering-foundation"}]}}, "EVIDENCE_SOURCE_UNREGISTERED"],
  ["missing loaded document", {sourceDocuments: new Map()}, "EVIDENCE_SOURCE_DOCUMENT_MISSING"],
  ["missing target pointer", {sourceDocuments: new Map([["rendering-foundation", {shell: {}}]])}, "EVIDENCE_TARGET_POINTER_MISSING"],
  ["numeric string", {sourceDocuments: new Map([["rendering-foundation", {shell: {max_width_px: "600"}}]])}, "EVIDENCE_TARGET_VALUE_INVALID"],
  ["non-finite number", {sourceDocuments: new Map([["rendering-foundation", {shell: {max_width_px: Infinity}}]])}, "EVIDENCE_TARGET_VALUE_INVALID"],
]) test(`target resolution rejects ${label} instead of using a fallback`, () => {
  const result = resolve(records(), options);
  assert.ok(result.issues.some(i => i.code === code));
  assert.equal(result.targets.has("test-consumer/desktop-width"), false);
});

test("target colors require exact opaque six-digit HEX, and inset zero stays numeric", () => {
  const items = records(); const link = items[0].evidence_links.foundation_values[0];
  link.target.pointer = "/shell/background_color"; link.comparison = "opaque-solid-color";
  for (const color of ["blue", "#FFF", "#11223380", null]) {
    const result = resolve(items, {sourceDocuments: new Map([["rendering-foundation", {shell: {background_color: color}}]])});
    assert.ok(result.issues.some(i => i.code === "EVIDENCE_TARGET_VALUE_INVALID"));
  }
  link.target.pointer = "/shell/horizontal_inset_px"; link.comparison = "pixel-number";
  assert.equal(resolve(items).targets.get("test-consumer/desktop-width").expected, 0);
});

test("no links require no foundation documents; invalid references cannot produce target entries", () => {
  const items = records(); delete items[0].evidence_links;
  assert.deepEqual(resolve(items, {manifest: {sources: []}, sourceDocuments: new Map()}), {targets: new Map(), issues: []});
  const invalid = records(); invalid[0].evidence_links.source_dependencies[0].target.component_id = "absent";
  const result = resolve(invalid);
  assert.ok(result.issues.some(i => i.code === "EVIDENCE_TARGET_COMPONENT_UNKNOWN"));
  assert.equal(result.targets.size, 0);
});

test("offline checks preserve optional owner metadata and return deterministic independent results", () => {
  const items = records();
  delete items[0].evidence_links.source_dependencies[0].asset_owner.asset_id;
  assert.deepEqual(validate(items), []);
  const first = resolve(items); const second = resolve(items);
  assert.deepEqual([...first.targets], [...second.targets]);
  first.targets.get("test-consumer/artwork-source").source.node_id = "99:99";
  first.targets.get("test-consumer/artwork-source").asset_owner.node_id = "99:99";
  assert.equal(items[0].evidence_links.source_dependencies[0].source.node_id, "I10:4;20:2;20:3");
  assert.equal(second.targets.get("test-consumer/artwork-source").asset_owner.node_id, "10:4");
  items[0].evidence_links.source_dependencies[0].target.component_id = "absent";
  assert.deepEqual(validate(items), validate(items));
});

test("evidence semantic diagnostics are integrated without changing HTML dependency collection", () => {
  const registries = {shared: structuredClone(shared), marketing: structuredClone(marketing)};
  const record = registries.marketing.components.find(r => r.id === "email-header");
  const before = collectComponentReferences(record);
  record.evidence_links = {foundation_values: [], source_dependencies: [{...dependencyLink(), source: {variant_node_id: record.variants[0].node_id, node_id: "I10:4;20:2"}, target: {component_id: "absent"}}]};
  const errors = validateComponentRegistrySemantics({registries, ...foundationDocs});
  assert.ok(errors.some(e => e.code === "EVIDENCE_TARGET_COMPONENT_UNKNOWN" && e.path.startsWith("/registries/marketing/components/")));
  assert.deepEqual(collectComponentReferences(record), before);
});

// Hand-built canonical graph and same-session reports; not MCP provenance.
function impactFixture() {
  const sha = "a".repeat(40), start = "2026-10-02T09:00:00.000Z";
  const record = (id, node) => ({ id, identity: { node_kind: "component", semantic_role: "asset" }, figma: { file_key: "synthetic", node_id: node }, variants: [], asset_contracts: [{ id: "whole", owner_layer_name: "whole @4x", export_boundary: { kind: "node", semantic_node_name: "whole @4x" }, source_viewport: "desktop" }], evidence_links: { foundation_values: [], source_dependencies: [] } });
  const lock = record("lock", "1:1"), receipt = record("receipt", "2:1"), badge = record("badge", "3:1"), block = record("block", "4:1");
  const link = (id, root, node, target) => ({ id, source: { variant_node_id: root, node_id: node }, target: { component_id: target }, asset_owner: { node_id: root, asset_id: "whole" } });
  badge.evidence_links.source_dependencies = [link("glyph", "3:1", "3:2", "lock")];
  block.evidence_links.source_dependencies = [link("badge", "4:1", "4:2", "badge"), link("override", "4:1", "I4:2;3:2", "receipt")];
  const records = [lock, receipt, badge, block];
  const session = { canonical_git_sha: sha, started_at: start, component_ids: records.map(r => r.id), captures: records.map(r => ({ component_id: r.id, receipt_id: `receipt-${r.id}`, packet: { file_key: "synthetic", component_node_id: r.figma.node_id,
    variants: [{ variant_node_id: r.figma.node_id, source_node: { node_id: r.figma.node_id, node_type: "COMPONENT", children: r.evidence_links.source_dependencies.map(l => ({ node_id: l.source.node_id, node_type: "INSTANCE", main_component_id: records.find(t => t.id === l.target.component_id).figma.node_id, children: [] })) } }] } })) };
  const reports = [badge, block].map(r => ({ ok: true, component_id: r.id, canonical_git_sha: sha, session_started_at: start,
    receipt_ids: [r.id, ...r.evidence_links.source_dependencies.map(l => l.target.component_id)].map(id => `receipt-${id}`).sort(),
    verified_sources: r.evidence_links.source_dependencies.map(l => ({ ...l.source, field_path: "/main_component_id" })),
    results: r.evidence_links.source_dependencies.map(l => ({ kind: "source-dependency", link_id: l.id, status: "verified", source: { file_key: "synthetic", ...l.source }, target: { ...l.target, file_key: "synthetic", node_id: records.find(t => t.id === l.target.component_id).figma.node_id }, asset_owner: { ...l.asset_owner }, expected: records.find(t => t.id === l.target.component_id).figma.node_id, actual: records.find(t => t.id === l.target.component_id).figma.node_id })) }));
  session.schema_version = "1.0.0"; session.completed_at = "2026-10-02T09:00:04.000Z";
  for (const c of session.captures) {
    Object.assign(c, { tool: "use_figma", received_at: "2026-10-02T09:00:03.000Z", packet_path: `${c.component_id}.json`, packet_sha256: "0".repeat(64) });
    const root = c.packet.variants[0].source_node;
    if (c.component_id === "block") { const glyph = root.children.pop(); root.children[0].children.push(glyph); }
    const count = node => 1 + node.children.reduce((s, child) => s + count(child), 0);
    Object.assign(c.packet, { capture_version: "1.1.0", component_properties: [], capture_errors: [], capture_meta: { started_at: "2026-10-02T09:00:01.000Z", completed_at: "2026-10-02T09:00:02.000Z", tree_complete: true, node_count: count(root) } });
    c.packet.variants[0].axes = [];
  }
  return { model: { canonical_sha: sha, records, manifest: { sources: [] }, source_documents: new Map() }, session, reports };
}
test("reverse impact separates badge default from block actual override", () => {
  const f = impactFixture();
  const lock = evidenceApi.collectEvidenceConsumers({ ...f, sourceComponentId: "lock" });
  assert.deepEqual(lock.issues, []);
  assert.deepEqual(lock.confirmed.map(e => [e.component_id, e.asset_owner_node_id, e.asset_id]), [["badge", "3:1", "whole"]]);
  assert.deepEqual(lock.possible.map(e => e.component_id), ["block"]);
  const receipt = evidenceApi.collectEvidenceConsumers({ ...f, sourceComponentId: "receipt" });
  assert.deepEqual(receipt.confirmed.map(e => [e.component_id, e.asset_owner_node_id, e.asset_id]), [["block", "4:1", "whole"]]);
  assert.deepEqual(receipt.possible, []);
});
for (const [label, change] of [
  ["SHA", r => { r.canonical_git_sha = "b".repeat(40); }],
  ["session", r => { r.session_started_at = "2026-10-01T09:00:00.000Z"; }],
  ["foreign receipt", r => { r.receipt_ids.push("foreign"); }],
  ["missing target receipt", r => { r.receipt_ids = ["receipt-block"]; }],
]) test(`reverse rejects report from wrong ${label}`, () => {
  const f = impactFixture(); change(f.reports[1]);
  const r = evidenceApi.collectEvidenceConsumers({ ...f, sourceComponentId: "receipt" });
  assert.deepEqual(r.confirmed, []); assert.ok(r.issues.some(i => i.code === "EVIDENCE_REPORT_CONTEXT_MISMATCH"));
});
test("reverse never promotes a failed assertion or missing report", () => {
  const f = impactFixture(); f.reports[1].results[1].status = "unverified";
  const r = evidenceApi.collectEvidenceConsumers({ ...f, sourceComponentId: "receipt" }); assert.deepEqual(r.confirmed, []); assert.equal(r.possible.length, 1);
  assert.deepEqual(evidenceApi.collectEvidenceConsumers({ ...f, reports: [], sourceComponentId: "lock" }).confirmed, []);
});
test("reverse checks exact report source, target, owner and covered source triple", () => {
  for (const mutate of [r => { r.results[1].source.node_id = "3:2"; }, r => { r.results[1].asset_owner.node_id = "9:9"; }, r => { r.results[1].actual = "1:1"; }, r => { r.verified_sources = []; }]) {
    const f = impactFixture(); mutate(f.reports[1]);
    assert.deepEqual(evidenceApi.collectEvidenceConsumers({ ...f, sourceComponentId: "receipt" }).confirmed, []);
  }
});
test("reverse deduplicates consumer-owner-asset and remains deterministic without mutation", () => {
  const f = impactFixture(), block = f.model.records.find(r => r.id === "block");
  block.evidence_links.source_dependencies.push({ ...structuredClone(block.evidence_links.source_dependencies[1]), id: "another", source: { variant_node_id: "4:1", node_id: "4:99" } });
  const before = structuredClone(f);
  const r = evidenceApi.collectEvidenceConsumers({ ...f, reports: [], sourceComponentId: "receipt" });
  assert.equal(r.possible.length, 1); assert.deepEqual(f, before);
  f.model.records.reverse(); block.evidence_links.source_dependencies.reverse();
  assert.deepEqual(evidenceApi.collectEvidenceConsumers({ ...f, reports: [], sourceComponentId: "receipt" }), r);
});
