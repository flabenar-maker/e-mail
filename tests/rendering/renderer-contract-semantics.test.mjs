import test from "node:test";
import assert from "node:assert/strict";

const rendering = {
  breakpoints: [{ id: "cupis-mobile", query: "max-width", value: 660, unit: "px" }],
};
const coverage = { component_id: "contract-semantics", mode: "interpreter" };

async function render(input) {
  const { renderContractTree } = await import("../../scripts/lib/email-interpreter.mjs");
  return renderContractTree({ coverage, assets: {}, properties: {}, foundations: { rendering }, ...input });
}

function fact(id, value) {
  return { id, value };
}
function measure(id, value, unit = "px") {
  return fact(id, { type: "measure", value, unit });
}
function node({ id, role = id, mode = "presentation-table", facts = [], children = [], slots = [], visibility = { mode: "always" }, action }) {
  return {
    id, semantic_role: role, render_mode: mode, visibility, facts, children,
    ...(slots.length ? { content_slots: slots } : {}),
    ...(action ? { action } : {}),
  };
}
function component(root, variants = []) {
  return {
    id: "contract-semantics",
    contracts: {
      mobile: { root: structuredClone(root) },
      desktop: { root: structuredClone(root) },
      ...(variants.length ? { variant_contracts: variants } : {}),
    },
  };
}

// The selector must choose one exact contract by its non-viewport axes; no fallback
// to the base viewport root is valid when an exact variant exists.
test("selects the exact variant-contract root for the requested axes", async () => {
  const base = node({ id: "root", children: [node({ id: "copy", mode: "html-text", slots: [{ id: "text", required: true }] })] });
  const accent = node({ id: "accent-root", children: [node({ id: "accent-copy", mode: "html-text", slots: [{ id: "text", required: true }] })] });
  const result = await render({
    component: component(base, [{
      variant_node_id: "1:1",
      axes: [{ name: "Viewport", value: "Mobile" }, { name: "Style", value: "Accent" }],
      root: accent,
    }]),
    variantAxes: { Style: "Accent" },
    content: { copy: { text: "Base" }, "accent-copy": { text: "Accent" } },
  });
  assert.match(result.html, />Accent</u);
  assert.doesNotMatch(result.html, />Base</u);
  assert.deepEqual(result.diagnostics, []);
});

test("default-hidden instance subtree neither renders nor requires its slots", async () => {
  const root = node({ id: "root", children: [node({
    id: "hidden-copy", mode: "html-text",
    visibility: { mode: "instance", default_visible: false },
    slots: [{ id: "text", required: true }],
  })] });
  const result = await render({ component: component(root), content: {} });
  assert.doesNotMatch(result.html, /hidden-copy/u);
  assert.deepEqual(result.diagnostics, []);
});

test("mobile secondary direct image remains fluid with height:auto", async () => {
  const root = node({ id: "root", children: [node({
    id: "secondary-image", role: "secondary-image", mode: "direct-image",
    facts: [fact("reference-size", { type: "dimensions", width: 296, height: 188, unit: "px" }), fact("height-behavior", { type: "keyword", value: "auto" })],
  })] });
  root.children[0].asset_contract_id = "secondary-image";
  const result = await render({
    component: component(root),
    content: {},
    assets: { "secondary-image": { src: "secondary.png", width: 296, height: 188 } },
  });
  assert.match(result.html, /<img[^>]*src="secondary\.png"[^>]*style="[^"]*height:auto/u);
  assert.deepEqual(result.diagnostics, []);
});

test("whole-element action wraps the table-cell payload in one anchor", async () => {
  const root = node({
    id: "button", action: { kind: "whole-element", href_slot: "href", required: true },
    slots: [{ id: "href", required: true }],
    children: [node({ id: "label", mode: "html-text", slots: [{ id: "text", required: true }] })],
  });
  const result = await render({
    component: component(root),
    content: { button: { href: "https://example.test/button" }, label: { text: "Continue" } },
  });
  assert.match(result.html, /<td[^>]*><a href="https:\/\/example\.test\/button"[^>]*>.*Continue.*<\/a><\/td>/u);
  assert.equal((result.html.match(/<a href=/gu) ?? []).length, 1);
  assert.deepEqual(result.diagnostics, []);
});

test("distributed-cells action creates one same-href anchor per cell, without an outer anchor", async () => {
  const root = node({
    id: "row", facts: [fact("layout-axis", { type: "keyword", value: "horizontal" }), measure("layout-gap", 0)],
    action: { kind: "distributed-cells", href_slot: "href", required: true },
    slots: [{ id: "href", required: true }],
    children: ["one", "two", "three"].map((id) => node({ id, mode: "html-text", slots: [{ id: "text", required: true }] })),
  });
  const result = await render({
    component: component(root),
    content: { row: { href: "https://example.test/row" }, one: { text: "One" }, two: { text: "Two" }, three: { text: "Three" } },
  });
  assert.equal((result.html.match(/<a href="https:\/\/example\.test\/row"/gu) ?? []).length, 3);
  assert.doesNotMatch(result.html, /<a[^>]*>\s*<table/u);
  assert.deepEqual(result.diagnostics, []);
});

test("divider reference dimensions and background render as an exact one-pixel rule", async () => {
  const root = node({ id: "divider", role: "divider", facts: [
    fact("reference-size", { type: "dimensions", width: 296, height: 1, unit: "px" }),
    fact("background", { type: "color", value: "#DFDFE0" }),
  ] });
  const result = await render({ component: component(root), content: {} });
  assert.match(result.html, /height="1"/u);
  assert.match(result.html, /height:1px/u);
  assert.match(result.html, /background-color:#DFDFE0/u);
  assert.deepEqual(result.diagnostics, []);
});

test("linear-gradient facts preserve the approved 25 degree CSS direction and stops", async () => {
  const root = node({ id: "gradient", facts: [
    fact("background-gradient-start", { type: "color", value: "#B0FCC0" }),
    fact("background-gradient-end", { type: "color", value: "#2F80ED" }),
    fact("background-gradient-css-angle-degrees", { type: "number", value: 25 }),
  ] });
  const result = await render({ component: component(root), content: {} });
  assert.match(result.html, /linear-gradient\(25deg,#B0FCC0,#2F80ED\)/u);
  assert.deepEqual(result.diagnostics, []);
});