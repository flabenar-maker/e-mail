import test from "node:test";
  import assert from "node:assert/strict";
  import {
 dirname }
 from "node:path";
  import {
 fileURLToPath }
 from "node:url";
   import {
 loadComponentRegistries }
 from "../../scripts/lib/component-registry.mjs";
  import {
 renderContractTree }
 from "../../scripts/lib/email-interpreter.mjs";
   const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
  const rendering = {
 breakpoints: [{
 id: "cupis-mobile", query: "max-width", value: 660, unit: "px" }
] }
;
   async function component(id) {
   const registries = await loadComponentRegistries({
 repoRoot }
);
    const record = Object.values(registries).flatMap((document) => document.components).find((item) => item.id === id);
    assert.ok(record, "missing component " + id);
    return record;
  }
  function element(record, viewport, id) {
   const walk = (node) => node.id === id ? node : node.children?.map(walk).find(Boolean);
    const found = walk(record.contracts[viewport].root);
    assert.ok(found, record.id + " " + viewport + " missing " + id);
    return found;
  }
  function fact(subject, id) {
   const value = subject.facts?.find((item) => item.id === id)?.value;
    assert.ok(value, subject.id + " missing fact " + id);
    return value;
  }
  function node(id, facts = [], children = []) {
   return {
 id, semantic_role: id, render_mode: "presentation-table", visibility: {
 mode: "always" }
, facts, children }
;
  }
 function keyword(id, value) {
 return {
 id, value: {
 type: "keyword", value }
 }
;
  }
 function measure(id, value) {
 return {
 id, value: {
 type: "measure", value, unit: "px" }
 }
;
  }
 function color(id, value) {
 return {
 id, value: {
 type: "color", value }
 }
;
  }
 function dimensions(id, width, height) {
 return {
 id, value: {
 type: "dimensions", width, height, unit: "px" }
 }
;
  }
 function render(root, content = {
}
) {
   const component = {
 id: "feedback-probe", contracts: {
 mobile: {
 root }
, desktop: {
 root: structuredClone(root) }
 }
 }
;
    return renderContractTree({
 component, coverage: {
 component_id: component.id, mode: "interpreter" }
, foundations: {
 rendering }
, content }
);
  }
  test("Item/Bullet preserves the 8px green Figma ellipse as a painted leaf", async () => {
   const record = await component("item-bullet");
    for (const viewport of ["mobile", "desktop"]) {
     const dot = element(record, viewport, "root-bullet-indicator-bullet-dot");
      assert.deepEqual(fact(dot, "reference-size"), {
 type: "dimensions", width: 8, height: 8, unit: "px" }
);
      assert.deepEqual(fact(dot, "background"), {
 type: "color", value: "#18B037" }
);
      assert.deepEqual(fact(dot, "shape"), {
 type: "keyword", value: "ellipse" }
);
    }
 }
);
   test("NPS and App contracts retain rounded painted controls without collapsed borders", async () => {
   const nps = await component("nps-options");
    const app = await component("banner-app-download");
    assert.equal(fact(element(nps, "mobile", "root-content-area-emoji-buttons-good"), "border-radius").value, 32);
    assert.equal(fact(element(app, "mobile", "root-content-area-store-buttons-rustore-button"), "border-radius").value, 24);
    assert.equal(fact(element(app, "desktop", "root-content-area-store-buttons-rustore-button"), "border-radius").value, 50);
    const result = render(node("painted", [dimensions("reference-size", 44, 44), color("background", "#F8F8FA"), measure("border-radius", 24), {
 id: "clip-content", value: {
 type: "boolean", value: true }
 }
]));
    assert.deepEqual(result.diagnostics, []);
    assert.match(result.html, /border-collapse:separate/u);
    assert.match(result.html, /border-radius:24px/u);
    assert.match(result.html, /overflow:hidden/u);
  }
);
   test("Hero desktop centers its hug button with explicit table alignment", async () => {
   const hero = await component("banner-hero");
    const button = element(hero, "desktop", "root-card-content-area-button");
    assert.equal(fact(button, "horizontal-sizing").value, "hug");
    assert.equal(fact(button, "primary-alignment").value, "center");
    const result = render(node("root", [keyword("layout-axis", "vertical"), keyword("counter-alignment", "center")], [node("button", [keyword("horizontal-sizing", "hug"), keyword("primary-alignment", "center")]) ]));
    assert.deepEqual(result.diagnostics, []);
    assert.match(result.html, /<table[^>]*align="center"/u);
  }
);
   test("Mobile Icon-Cards hug root remains fluid in the email shell", async () => {
   const cards = await component("block-icon-cards");
    assert.equal(fact(element(cards, "mobile", "root"), "horizontal-sizing").value, "hug");
    const result = render(node("root", [keyword("horizontal-sizing", "hug")]));
    assert.deepEqual(result.diagnostics, []);
    assert.match(result.html, /width="100%"/u);
    assert.match(result.html, /width:100%/u);
  }
);
   test("Transaction Success preserves desktop top status and centered mobile badge contracts", async () => {
   const transaction = await component("block-transaction-success");
    const desktop = element(transaction, "desktop", "root-card-summary-area-partner-info-row-status-container");
    const mobile = element(transaction, "mobile", "root-card-summary-area-partner-info-row-status");
    assert.deepEqual(fact(desktop, "reference-size"), {
 type: "dimensions", width: 116, height: 72, unit: "px" }
);
    assert.equal(fact(desktop, "vertical-sizing").value, "fill");
    assert.equal(fact(desktop, "primary-alignment").value, "min");
    assert.equal(fact(mobile, "counter-alignment").value, "center");
  }
);
   test("Mobile Icon-Cards observable root table fills the shell width", async () => {
   const cards = await component("block-icon-cards");
    assert.equal(fact(element(cards, "mobile", "root"), "horizontal-sizing").value, "hug");
    const result = render(node("root", [keyword("horizontal-sizing", "hug")]));
    assert.deepEqual(result.diagnostics, []);
    const mobileRoot = result.html.match(/^<table\b[^>]*>/u)?.[0];
    assert.ok(mobileRoot, "missing Mobile Icon-Cards root table");
    assert.match(mobileRoot, /width="100%"/u);
    assert.match(mobileRoot, /style="[^"]*width:100%/u);
  }
);
   test("Transaction Success observable wrappers keep a 72px desktop top badge and centered mobile badge table", () => {
   const desktop = render(node("root", [keyword("layout-axis", "horizontal"), measure("layout-gap", 0)], [     node("summary", [dimensions("reference-size", 348, 72)]),     node("status-container", [dimensions("reference-size", 116, 72), keyword("vertical-sizing", "fill"), keyword("primary-alignment", "min")], [       node("status", [dimensions("reference-size", 116, 30), color("background", "#FAE6AF"), measure("border-radius", 63)]),     ]),   ]));
    assert.deepEqual(desktop.diagnostics, []);
    assert.match(desktop.html, /height="72"/u);
    assert.match(desktop.html, /valign="top"/u);
     const mobile = render(node("root", [keyword("layout-axis", "vertical"), measure("layout-gap", 0), keyword("counter-alignment", "center")], [     node("status", [dimensions("reference-size", 93, 25), keyword("horizontal-sizing", "hug"), keyword("counter-alignment", "center"), color("background", "#FAE6AF"), measure("border-radius", 63)]),   ]));
    assert.deepEqual(mobile.diagnostics, []);
    assert.match(mobile.html, /<table\b[^>]*align="center"/u);
  }
);
  test("Bullet renderer paints the synthetic 8px green ellipse leaf", () => {
   const result = render(node("bullet-dot", [     dimensions("reference-size", 8, 8),     color("background", "#18B037"),     keyword("shape", "ellipse"),   ]));
   assert.deepEqual(result.diagnostics, []);
   assert.match(result.html, /width:8px/u);
   assert.match(result.html, /height:8px/u);
   assert.match(result.html, /background-color:#18B037/u);
   assert.match(result.html, /border-radius:50%/u);
   assert.doesNotMatch(result.html, /<tbody><\/tbody>/u);
 }
);
  test("Mobile Secondary CTA applies nowrap only to its whole-button label", async () => {
   const secondary = await component("button-secondary");
   const label = element(secondary, "mobile", "root-label");
   assert.equal(fact(label, "reference-size").width, 110);
   assert.equal(fact(label, "text-auto-resize").value, "width_and_height");
    const button = {
     id: "button",     semantic_role: "button",     render_mode: "presentation-table",     visibility: {
 mode: "always" }
,     facts: [keyword("horizontal-sizing", "hug"), keyword("layout-wrap", "no_wrap")],     action: {
 kind: "whole-element", href_slot: "href", required: true }
,     content_slots: [{
 id: "href", required: true }
],     children: [{
       id: "label",       semantic_role: "label",       render_mode: "html-text",       visibility: {
 mode: "always" }
,       facts: [dimensions("reference-size", 110, 20), keyword("text-auto-resize", "width_and_height"), keyword("layout-wrap", "no_wrap")],       content_slots: [{
 id: "text", type: "plain-text", required: true }
],       children: [],     }
],   }
;
   const result = render(button, {
 button: {
 href: "https://example.test/secondary" }
, label: {
 text: "Узнать подробнее" }
 }
);
   assert.deepEqual(result.diagnostics, []);
   assert.match(result.html, /<a\b[^>]*href="https:\/\/example\.test\/secondary"[^>]*>[\s\S]*<span\b[^>]*white-space:nowrap[^>]*>Узнать подробнее<\/span>[\s\S]*<\/a>/u);
   assert.doesNotMatch(result.html, /max-width:110px/u);
 }
);

test("Transaction Success desktop status-container observably wraps its 116px badge in a 72px top-aligned table", () => {

  const result = render(node("root", [keyword("layout-axis", "horizontal"), measure("layout-gap", 0)], [
    node("summary", [dimensions("reference-size", 348, 72)]),
    node("status-container", [dimensions("reference-size", 116, 72), keyword("vertical-sizing", "fill"), keyword("primary-alignment", "min")], [
      node("status", [dimensions("reference-size", 116, 30), color("background", "#FAE6AF"), measure("border-radius", 63)]),
    ]),
  ]));

  assert.deepEqual(result.diagnostics, []);

  assert.match(result.html, /<table\b[^>]*width="116"[^>]*height="72"[^>]*>[\s\S]*background-color:#FAE6AF/u);

  assert.match(result.html, /<td\b[^>]*valign="top"[^>]*>[\s\S]*background-color:#FAE6AF/u);

}
);


test("Transaction Success mobile badge table is observably centered", () => {

  const result = render(node("root", [keyword("layout-axis", "vertical"), measure("layout-gap", 0), keyword("counter-alignment", "center")], [
    node("status", [dimensions("reference-size", 93, 25), keyword("horizontal-sizing", "hug"), keyword("counter-alignment", "center"), color("background", "#FAE6AF"), measure("border-radius", 63)]),
  ]));

  assert.deepEqual(result.diagnostics, []);

  assert.match(result.html, /<table\b[^>]*align="center"[^>]*>[\s\S]*background-color:#FAE6AF/u);

}
);
