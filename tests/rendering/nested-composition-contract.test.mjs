import test from "node:test";
import assert from "node:assert/strict";
import { renderComponent } from "../../scripts/lib/email-renderer.mjs";

const foundations = { rendering: { breakpoints: [{ id: "cupis-mobile", query: "max-width", value: 660, unit: "px" }] } };
const variants = { mobile: "mobile", desktop: "desktop" };

function text(id) {
  return { id, semantic_role: "copy", render_mode: "html-text", visibility: { mode: "always" }, facts: [], children: [], content_slots: [{ id: "text", type: "plain-text", required: true }] };
}
function image(id) {
  return { id, semantic_role: "image", render_mode: "direct-image", visibility: { mode: "always" }, facts: [], children: [], asset_contract_id: "image", content_slots: [{ id: "alt", type: "alt-text", required: true }] };
}
function root(id, children) {
  const facts = children.length > 1
    ? [
      { id: "layout-axis", value: { type: "keyword", value: "vertical" } },
      { id: "layout-gap", value: { type: "measure", value: 0, unit: "px" } },
    ]
    : [];
  return { id, semantic_role: "section", render_mode: "presentation-table", visibility: { mode: "always" }, facts, children };
}
function record(id, mobileRoot, desktopRoot = structuredClone(mobileRoot), variantContracts = []) {
  return { id, properties: [], asset_contracts: [{ id: "image" }], contracts: { mobile: { root: mobileRoot }, desktop: { root: desktopRoot }, ...(variantContracts.length ? { variant_contracts: variantContracts } : {}) } };
}
function instance(instanceId, componentId, extra = {}) {
  return { instance_id: instanceId, component_id: componentId, variants: structuredClone(variants), property_values: [], content_values: [], asset_files: [], slots: [], ...extra };
}
function deps(records) {
  return { componentIndex: { bySystemId: new Map(records.map((item) => [item.id, item])) }, rendererRegistry: { coverage: records.map(({ id: component_id }) => ({ component_id, mode: "interpreter" })) }, foundations };
}

// Distinct child instances must keep their own content/assets and choose their own
// mobile/desktop Style+State contract rather than silently rendering the base root.
test("slot composition resolves each Card/Image instance with scoped content, asset and axes", () => {
  const block = record("block-cards-images", root("block-root", [{
    id: "cards", semantic_role: "cards", render_mode: "slot", visibility: { mode: "always" }, facts: [], children: [],
    content_slots: [{ id: "content", type: "slot", required: true }],
  }]));
  const base = root("card-base", [text("title"), image("hero")]);
  const card = record("card-image", base, structuredClone(base), [
    { variant_node_id: "1:1", axes: [{ name: "Viewport", value: "Mobile" }, { name: "Style", value: "Image" }, { name: "State", value: "Default" }], root: root("card-mobile-image", [text("mobile-title"), image("mobile-hero")]) },
    { variant_node_id: "1:2", axes: [{ name: "Viewport", value: "Desktop" }, { name: "Style", value: "Image" }, { name: "State", value: "Default" }], root: root("card-desktop-image", [text("desktop-title"), image("desktop-hero")]) },
  ]);
  const first = instance("first-card", "card-image", {
    variant_axes: { mobile: { Style: "Image", State: "Default" }, desktop: { Style: "Image", State: "Default" } },
    content_values: [
      { element_id: "mobile-title", slot_id: "text", scope: "mobile", value: { type: "plain-text", value: "First mobile" } },
      { element_id: "desktop-title", slot_id: "text", scope: "desktop", value: { type: "plain-text", value: "First desktop" } },
      { element_id: "mobile-hero", slot_id: "alt", scope: "mobile", value: { type: "alt-text", value: "First image" } },
      { element_id: "desktop-hero", slot_id: "alt", scope: "desktop", value: { type: "alt-text", value: "First image" } },
    ], asset_files: [{ asset_contract_id: "image", path: "first.png" }],
  });
  const second = instance("second-card", "card-image", {
    variant_axes: { mobile: { Style: "Image", State: "Default" }, desktop: { Style: "Image", State: "Default" } },
    content_values: [
      { element_id: "mobile-title", slot_id: "text", scope: "mobile", value: { type: "plain-text", value: "Second mobile" } },
      { element_id: "desktop-title", slot_id: "text", scope: "desktop", value: { type: "plain-text", value: "Second desktop" } },
      { element_id: "mobile-hero", slot_id: "alt", scope: "mobile", value: { type: "alt-text", value: "Second image" } },
      { element_id: "desktop-hero", slot_id: "alt", scope: "desktop", value: { type: "alt-text", value: "Second image" } },
    ], asset_files: [{ asset_contract_id: "image", path: "second.png" }],
  });
  const result = renderComponent({ componentId: "block-cards-images", viewportData: instance("block", "block-cards-images", { slots: [{ element_id: "cards", instances: [first, second] }] }), ...deps([block, card]) });
  assert.deepEqual(result.diagnostics, []);
  for (const value of ["First mobile", "First desktop", "Second mobile", "Second desktop", "first.png", "second.png"]) assert.match(result.html, new RegExp(value, "u"));
  assert.equal(result.assets.filter(({ instance_id }) => instance_id === "first-card").length, 1);
  assert.equal(result.assets.filter(({ instance_id }) => instance_id === "second-card").length, 1);
});

test("unknown nested component reference returns a diagnostic instead of blank success", () => {
  const block = record("block-cards-images", root("block-root", [{ id: "cards", semantic_role: "cards", render_mode: "slot", visibility: { mode: "always" }, facts: [], children: [], content_slots: [{ id: "content", type: "slot", required: true }] }]));
  const result = renderComponent({ componentId: "block-cards-images", viewportData: instance("block", "block-cards-images", { slots: [{ element_id: "cards", instances: [instance("unknown-card", "missing-card")] }] }), ...deps([block]) });
  assert.equal(result.html, "");
  assert.deepEqual(result.diagnostics.map(({ code }) => code), ["RENDER_COMPONENT_UNKNOWN", "RENDER_COMPONENT_UNKNOWN"]);
});
test("nested-component block reference resolves its Card/Image instance rather than a blank base tree", () => {
  const block = record("block-cards-images", root("block-root", [{
    id: "featured-card", semantic_role: "card", render_mode: "nested-component", visibility: { mode: "always" }, facts: [], children: [], component_id: "card-image",
  }]));
  const base = root("card-base", [text("title"), image("hero")]);
  const card = record("card-image", base, structuredClone(base), [
    { variant_node_id: "2:1", axes: [{ name: "Viewport", value: "Mobile" }, { name: "Style", value: "Image" }, { name: "State", value: "Default" }], root: root("card-mobile-image", [text("mobile-title"), image("mobile-hero")]) },
    { variant_node_id: "2:2", axes: [{ name: "Viewport", value: "Desktop" }, { name: "Style", value: "Image" }, { name: "State", value: "Default" }], root: root("card-desktop-image", [text("desktop-title"), image("desktop-hero")]) },
  ]);
  const child = instance("featured", "card-image", {
    variant_axes: { mobile: { Style: "Image", State: "Default" }, desktop: { Style: "Image", State: "Default" } },
    content_values: [
      { element_id: "mobile-title", slot_id: "text", scope: "mobile", value: { type: "plain-text", value: "Nested mobile" } },
      { element_id: "desktop-title", slot_id: "text", scope: "desktop", value: { type: "plain-text", value: "Nested desktop" } },
      { element_id: "mobile-hero", slot_id: "alt", scope: "mobile", value: { type: "alt-text", value: "Nested image" } },
      { element_id: "desktop-hero", slot_id: "alt", scope: "desktop", value: { type: "alt-text", value: "Nested image" } },
    ], asset_files: [{ asset_contract_id: "image", path: "nested.png" }],
  });
  const result = renderComponent({ componentId: "block-cards-images", viewportData: instance("block", "block-cards-images", { nested_components: [{ element_id: "featured-card", instance: child }] }), ...deps([block, card]) });
  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, />Nested mobile</u);
  assert.match(result.html, />Nested desktop</u);
  assert.match(result.html, /src="nested\.png"/u);
});
