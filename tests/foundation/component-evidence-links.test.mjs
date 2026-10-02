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

for (const [label, change, expectedCode] of [
  ["duplicate link ID across kinds", r => {r[0].evidence_links.source_dependencies[0].id = "desktop-width";}, "EVIDENCE_LINK_ID_DUPLICATE"],
  ["foreign source variant", r => {r[0].evidence_links.foundation_values[0].source.variant_node_id = "99:1";}, "EVIDENCE_SOURCE_VARIANT_INVALID"],
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

test("evidence semantic diagnostics are integrated without changing HTML dependency collection", () => {
  const registries = {shared: structuredClone(shared), marketing: structuredClone(marketing)};
  const record = registries.marketing.components.find(r => r.id === "email-header");
  const before = collectComponentReferences(record);
  record.evidence_links = {foundation_values: [], source_dependencies: [{...dependencyLink(), source: {variant_node_id: record.variants[0].node_id, node_id: "I10:4;20:2"}, target: {component_id: "absent"}}]};
  const errors = validateComponentRegistrySemantics({registries, ...foundationDocs});
  assert.ok(errors.some(e => e.code === "EVIDENCE_TARGET_COMPONENT_UNKNOWN" && e.path.startsWith("/registries/marketing/components/")));
  assert.deepEqual(collectComponentReferences(record), before);
});
