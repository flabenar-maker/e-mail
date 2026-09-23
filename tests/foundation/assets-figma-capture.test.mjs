import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { resolveAssetContract } from "../../scripts/lib/assets-foundation.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const fixturePath = join(repoRoot, "tests/foundation/fixtures/assets-figma-capture.json");
const expectedGate = {
  id: "concrete-desktop-instance-overrides",
  required: true,
  status: "unverified",
  code: "CONCRETE_DESKTOP_INSTANCE_OVERRIDES_UNVERIFIED",
  reason: "The library exposes placeholder component state, not a concrete email instance with marketer overrides.",
};
const expectedUnresolved = [];

const expectedChildren = {
  "header-logo-rendered-png-opaque": ["Asset/Product-Logo"],
  "hero-image-fill-jpeg-direct": [],
  "secondary-image-fill-jpeg-wrapper-crop": [],
  "card-image-rendered-jpeg-neutralized": ["Number"],
  "app-logo-rendered-png-source-alpha": ["artwork"],
  "feature-icon-rendered-png-transparent": ["background", "account-circle-line"],
  "nps-face-image-fill-png-source-alpha": ["happy-face-icon @4x"],
};
const expectedRepresentatives = {
  "header-logo-rendered-png-opaque": {
    selection: { component_id: "email-header", asset_contract_id: "header-logo" },
    foundation_selection: { sourceModeId: "rendered-node", displayModeId: "direct-image", exportProfileId: "png-4x", expectedAlphaId: "opaque", clippingPolicyId: "preserve-artwork" },
    component_asset: { owner_layer_name: "header-logo @4x", source_viewport: "desktop", export_boundary: { kind: "node", semantic_node_name: "header-logo @4x" } },
    source_boundary: { source_content: "exact-node-after-overrides", concrete_email_instance_required: true, own_visible_fill_included: true, visible_nested_graphics_included: true, parent_fill_included: false, unrelated_layout_included: false, live_html_included: false },
    live_figma: { file_key: "8zka5bHkcrJVK9I9dKjnhC", node_id: "1008:1823", node_name: "header-logo @4x", variant: "Viewport=Desktop", viewport: "desktop", geometry: { width: 322, height: 50 }, own_visible_fill: true, visible_nested_graphics: true, parent_fill_included: false, presentation: { clips_content: false, corner_radius: 55 }, export_settings: [] },
    boundary_status: "confirmed", build_time_gate_id: "concrete-desktop-instance-overrides",
  },
  "hero-image-fill-jpeg-direct": {
    selection: { component_id: "banner-hero", asset_contract_id: "hero-image" },
    foundation_selection: { sourceModeId: "image-fill", displayModeId: "direct-image", exportProfileId: "jpeg-2x", expectedAlphaId: "none", clippingPolicyId: "preserve-artwork" },
    component_asset: { owner_layer_name: "hero-image @2x", source_viewport: "desktop", export_boundary: { kind: "fill", semantic_node_name: "hero-image @2x" } },
    source_boundary: { source_content: "source-raster-only", concrete_email_instance_required: true, own_visible_fill_included: true, visible_nested_graphics_included: false, parent_fill_included: false, unrelated_layout_included: false, live_html_included: false },
    live_figma: { file_key: "8zka5bHkcrJVK9I9dKjnhC", node_id: "230:3689", node_name: "hero-image @2x", variant: "Viewport=Desktop", viewport: "desktop", geometry: { width: 552, height: 353 }, own_visible_fill: true, own_fill_type: "IMAGE", visible_nested_graphics: false, parent_fill_included: false, presentation: { clips_content: true, corner_radius: 0 }, export_settings: [{ format: "PNG", suffix: "@2x", scale: 2, contents_only: true }] },
    boundary_status: "confirmed", build_time_gate_id: "concrete-desktop-instance-overrides",
  },
  "secondary-image-fill-jpeg-wrapper-crop": {
    selection: { component_id: "banner-secondary", asset_contract_id: "secondary-image" },
    foundation_selection: { sourceModeId: "image-fill", displayModeId: "fill-image", exportProfileId: "jpeg-2x", expectedAlphaId: "none", clippingPolicyId: "preserve-artwork" },
    component_asset: { owner_layer_name: "secondary-image @2x", source_viewport: "mobile", export_boundary: { kind: "fill", semantic_node_name: "secondary-image @2x" } },
    source_boundary: { source_content: "source-raster-only", concrete_email_instance_required: true, own_visible_fill_included: true, visible_nested_graphics_included: false, parent_fill_included: false, unrelated_layout_included: false, live_html_included: false },
    live_figma: { file_key: "8zka5bHkcrJVK9I9dKjnhC", node_id: "11:1184", node_name: "secondary-image @2x", variant: "Viewport=Mobile", viewport: "mobile", geometry: { width: 296, height: 188 }, own_visible_fill: true, own_fill_type: "IMAGE", visible_nested_graphics: false, parent_fill_included: false, presentation: { clips_content: true, corner_radius: 0 }, export_settings: [{ format: "PNG", suffix: "@2x", scale: 2, contents_only: true }] },
    boundary_status: "confirmed", build_time_gate_id: "concrete-desktop-instance-overrides",
  },
  "card-image-rendered-jpeg-neutralized": {
    selection: { component_id: "card-image", asset_contract_id: "card-image" },
    foundation_selection: { sourceModeId: "rendered-node", displayModeId: "direct-image", exportProfileId: "jpeg-2x", expectedAlphaId: "none", clippingPolicyId: "neutralize-presentation-only" },
    component_asset: { owner_layer_name: "card-image @2x", source_viewport: "desktop", export_boundary: { kind: "node", semantic_node_name: "card-image @2x" } },
    source_boundary: { source_content: "exact-node-after-overrides", concrete_email_instance_required: true, own_visible_fill_included: true, visible_nested_graphics_included: true, parent_fill_included: false, unrelated_layout_included: false, live_html_included: false },
    live_figma: { file_key: "8zka5bHkcrJVK9I9dKjnhC", node_id: "911:3991", node_name: "Style=Numbered", variant: "Style=Numbered, Viewport=Desktop", viewport: "desktop", geometry: { width: 232, height: 148 }, own_visible_fill: true, own_fill_type: "IMAGE", visible_nested_graphics: true, nested_graphic_names: ["Number"], parent_fill_included: false, presentation: { source_owner_clips_content: true, source_owner_corner_radius: 0, instance_node_id: "911:4005", instance_corner_radius: 18, neutralize_only_presentation_radius: true }, export_settings: [] },
    boundary_status: "confirmed", build_time_gate_id: "concrete-desktop-instance-overrides",
  },
  "app-logo-rendered-png-source-alpha": {
    selection: { component_id: "banner-app-download", asset_contract_id: "app-logo" },
    foundation_selection: { sourceModeId: "rendered-node", displayModeId: "direct-image", exportProfileId: "png-4x", expectedAlphaId: "source", clippingPolicyId: "preserve-artwork" },
    component_asset: { owner_layer_name: "app-logo @4x", source_viewport: "desktop", export_boundary: { kind: "node", semantic_node_name: "app-logo @4x" } },
    source_boundary: { source_content: "exact-node-after-overrides", concrete_email_instance_required: true, own_visible_fill_included: true, visible_nested_graphics_included: true, parent_fill_included: false, unrelated_layout_included: false, live_html_included: false },
    live_figma: { file_key: "8zka5bHkcrJVK9I9dKjnhC", node_id: "961:37495", node_name: "app-logo @4x", variant: "Viewport=Desktop", viewport: "desktop", geometry: { width: 219, height: 62 }, own_visible_fill: true, own_fill_type: "SOLID", visible_nested_graphics: true, parent_fill_included: false, presentation: { clips_content: false, corner_radius: 0 }, export_settings: [] },
    boundary_status: "confirmed", build_time_gate_id: "concrete-desktop-instance-overrides",
  },
  "feature-icon-rendered-png-transparent": {
    selection: { component_id: "asset-feature-icon-4x", asset_contract_id: "feature-icon" },
    foundation_selection: { sourceModeId: "rendered-node", displayModeId: "direct-image", exportProfileId: "png-4x", expectedAlphaId: "transparent", clippingPolicyId: "preserve-artwork" },
    component_asset: { owner_layer_name: "Asset/Feature-Icon @4x", source_viewport: "desktop", export_boundary: { kind: "node", semantic_node_name: "Asset/Feature-Icon @4x" } },
    source_boundary: { source_content: "exact-node-after-overrides", concrete_email_instance_required: true, own_visible_fill_included: true, visible_nested_graphics_included: true, parent_fill_included: false, unrelated_layout_included: false, live_html_included: false },
    live_figma: { file_key: "8zka5bHkcrJVK9I9dKjnhC", node_id: "946:25769", node_name: "Asset/Feature-Icon @4x", variant: "Asset", viewport: "desktop", geometry: { width: 64, height: 64 }, own_visible_fill: false, visible_nested_graphics: true, nested_graphic_names: ["background", "account-circle-line"], parent_fill_included: false, presentation: { clips_content: true, corner_radius: 0 }, export_settings: [{ format: "PNG", suffix: "@4x", scale: 4, contents_only: true }] },
    boundary_status: "confirmed", build_time_gate_id: "concrete-desktop-instance-overrides",
  },
  "nps-face-image-fill-png-source-alpha": {
    selection: { component_id: "nps-options", asset_contract_id: "happy-face-icon" },
    foundation_selection: { sourceModeId: "image-fill", displayModeId: "direct-image", exportProfileId: "png-4x", expectedAlphaId: "source", clippingPolicyId: "preserve-artwork" },
    component_asset: { owner_layer_name: "happy-face-icon @4x", source_viewport: "desktop", export_boundary: { kind: "fill", semantic_node_name: "happy-face-icon @4x" } },
    source_boundary: { source_content: "source-raster-only", concrete_email_instance_required: true, own_visible_fill_included: true, visible_nested_graphics_included: false, parent_fill_included: false, unrelated_layout_included: false, live_html_included: false },
    live_figma: { file_key: "8zka5bHkcrJVK9I9dKjnhC", node_id: "260:3969", node_name: "happy-face-icon @4x", variant: "Viewport=Desktop, Count=3", viewport: "desktop", geometry: { width: 42, height: 42 }, own_visible_fill: true, own_fill_type: "IMAGE", visible_nested_graphics: false, parent_fill_included: false, presentation: { clips_content: false, corner_radius: 0 }, export_settings: [{ format: "PNG", suffix: "@4x", scale: 4, contents_only: true }] },
    boundary_status: "confirmed", build_time_gate_id: "concrete-desktop-instance-overrides",
  },
};

for (const [id, expected] of Object.entries(expectedRepresentatives)) {
  expected.child_boundary = {
    required_visible_child_names: expectedChildren[id],
    forbidden_visible_child_names: [],
  };
}

async function capture() { return JSON.parse(await readFile(fixturePath, "utf8")); }
async function componentRecords() {
  const families = await Promise.all(["marketing", "service", "shared"].map((family) => readStrictYaml(join(repoRoot, "data/components", `${family}.yaml`))));
  return families.flatMap((family) => family.components ?? []);
}
function key(selection) { return [selection.sourceModeId, selection.displayModeId, selection.exportProfileId, selection.expectedAlphaId, selection.clippingPolicyId].join("/"); }
function selectionFromAsset(asset) { return { sourceModeId: asset.source_mode_id, displayModeId: asset.display_mode_id, exportProfileId: asset.export_profile_id, expectedAlphaId: asset.alpha_mode_id, clippingPolicyId: asset.clipping_policy_id }; }
function projection(item) {
  const expected = expectedRepresentatives[item.id];
  return Object.fromEntries(Object.keys(expected).map((field) => [field, item[field]]));
}

test("Figma asset capture matches the canonical exact representative map", async () => {
  const evidence = await capture();
  assert.equal(evidence.schema_version, "1.0.0");
  assert.deepEqual(evidence.build_time_gates, [expectedGate]);
  assert.deepEqual(evidence.unresolved, expectedUnresolved);
  assert.deepEqual(Object.fromEntries(evidence.representatives.map((item) => [item.id, projection(item)])), expectedRepresentatives);
});

test("Figma capture keeps configured node export settings observational and final output contract-owned", async () => {
  const evidence = await capture();
  for (const item of evidence.representatives) {
    assert.deepEqual(item.final_output_profile, {
      source: "foundation-selection",
      figma_export_settings_authoritative: false,
    });
  }
  assert.equal(evidence.unresolved.some(({ codes }) => codes.includes("FIGMA_NODE_EXPORT_PROFILE_CONFLICT")), false);
  assert.equal(evidence.unresolved.some(({ codes }) => codes.includes("FIGMA_OWNER_DISPLAY_GEOMETRY_MISMATCH")), false);
});

test("Figma asset capture maps exact component asset owners and source boundaries", async () => {
  const [evidence, components, assets] = await Promise.all([capture(), componentRecords(), readStrictYaml(join(repoRoot, "data/foundations/assets.yaml"))]);
  const active = new Map();
  for (const component of components) for (const asset of component.asset_contracts ?? []) active.set(key(selectionFromAsset(asset)), { component, asset });
  assert.deepEqual([...new Set(evidence.representatives.map((item) => key(item.foundation_selection)))].sort(), [...active.keys()].sort());
  for (const item of evidence.representatives) {
    const component = components.find((candidate) => candidate.id === item.selection.component_id);
    const asset = component?.asset_contracts?.find((candidate) => candidate.id === item.selection.asset_contract_id);
    assert.ok(asset, `missing ${item.selection.component_id}/${item.selection.asset_contract_id}`);
    assert.deepEqual(item.foundation_selection, selectionFromAsset(asset));
    assert.deepEqual(item.component_asset, { owner_layer_name: asset.owner_layer_name, source_viewport: asset.source_viewport, export_boundary: asset.export_boundary });
    assert.deepEqual(item.source_boundary, resolveAssetContract(assets, item.foundation_selection).source_mode.contract);
  }
});

test("a changed capture field or unresolved code is detected", async () => {
  const evidence = await capture();
  const alteredGeometry = structuredClone(evidence);
  alteredGeometry.representatives.find((item) => item.id === "hero-image-fill-jpeg-direct").live_figma.geometry.width = 551;
  assert.throws(() => assert.deepEqual(Object.fromEntries(alteredGeometry.representatives.map((item) => [item.id, projection(item)])), expectedRepresentatives));
  const alteredProfileAuthority = structuredClone(evidence);
  alteredProfileAuthority.representatives[0].final_output_profile.source = "figma-export-settings";
  assert.throws(() => assert.deepEqual(
    alteredProfileAuthority.representatives[0].final_output_profile,
    evidence.representatives[0].final_output_profile,
  ));
  const missingGate = structuredClone(evidence);
  missingGate.build_time_gates = [];
  assert.throws(() => assert.deepEqual(missingGate.build_time_gates, [expectedGate]));
});