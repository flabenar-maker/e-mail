import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  listComponentRecords,
  loadComponentRegistries,
  walkComponentElements,
} from "../../scripts/lib/component-registry.mjs";

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
  const mobileAccent = node({ id: "mobile-accent-root", children: [node({ id: "mobile-accent-copy", mode: "html-text", slots: [{ id: "text", required: true }] })] });
  const desktopAccent = node({ id: "desktop-accent-root", children: [node({ id: "desktop-accent-copy", mode: "html-text", slots: [{ id: "text", required: true }] })] });
  const result = await render({
    component: component(base, [
      {
        variant_node_id: "1:1",
        axes: [{ name: "Viewport", value: "Mobile" }, { name: "Style", value: "Accent" }],
        root: mobileAccent,
      },
      {
        variant_node_id: "1:2",
        axes: [{ name: "Viewport", value: "Desktop" }, { name: "Style", value: "Accent" }],
        root: desktopAccent,
      },
    ]),
    variantAxes: { Style: "Accent" },
    content: { copy: { text: "Base" }, "mobile-accent-copy": { text: "Mobile accent" }, "desktop-accent-copy": { text: "Desktop accent" } },
  });
  assert.match(result.html, />Mobile accent</u);
  assert.match(result.html, />Desktop accent</u);
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
// The interpreter consumes already-resolved contract facts. It must not import or invoke
// the design-time spacing resolver, so it cannot make a fresh spacing choice in HTML.
test("email interpreter has no design-time spacing resolver dependency", async () => {
  const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
  const source = await readFile(join(repoRoot, "scripts/lib/email-interpreter.mjs"), "utf8");
  assert.doesNotMatch(source, /spacing-foundation|resolveDesignSpacing/u);
});

test("every direct-image contract element exposes exactly one alt-text slot", async () => {
  const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
  const registries = await loadComponentRegistries({ repoRoot });
  const missing = [];

  for (const { record } of listComponentRecords(registries)) {
    walkComponentElements(record, ({ element, path }) => {
      if (element.render_mode !== "direct-image") return;
      const altSlots = (element.content_slots ?? []).filter(
        (slot) => slot.type === "alt-text",
      );
      if (altSlots.length !== 1) {
        missing.push({
          component_id: record.id,
          element_path: path,
          alt_slot_count: altSlots.length,
        });
      }
    });
  }

  assert.deepEqual(
    missing,
    [],
    "Every direct-image must expose exactly one alt-text slot: " +
      JSON.stringify(missing),
  );
});