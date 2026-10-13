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
 type: "dimensions", width: 117, height: 72, unit: "px" }
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
  test("Item/Bullet renders the 8px Figma ellipse without a square horizontal wrapper", () => {
   const result = render(node("bullet-indicator", [keyword("layout-axis", "horizontal"), measure("layout-gap", 0)], [
     node("bullet-dot", [dimensions("reference-size", 8, 8), color("background", "#18B037"), keyword("shape", "ellipse")]),
   ]));
   assert.deepEqual(result.diagnostics, []);
   assert.match(result.html, /<table\b[^>]*width="8"[^>]*style="[^"]*background-color:#18B037[^"]*border-radius:50%/u);
   assert.doesNotMatch(result.html, /<td\b(?=[^>]*bgcolor="#18B037")(?=[^>]*style="[^"]*background-color:#18B037)(?![^>]*style="[^"]*border-radius:50%)[^>]*>/u);
  }
);
  test("Banner/App-Download renders the 50px desktop store radius without a square horizontal wrapper", () => {
   const result = render(node("store-button-row", [keyword("layout-axis", "horizontal"), measure("layout-gap", 0)], [
     node("store-button", [dimensions("reference-size", 116, 56), color("background", "#1E60DD"), measure("border-radius", 50)], [
       node("store-button-content", [dimensions("reference-size", 228, 26)]),
     ]),
   ]));
   assert.deepEqual(result.diagnostics, []);
   assert.match(result.html, /<table\b[^>]*style="[^"]*background-color:#1E60DD[^"]*border-radius:50px/u);
   assert.doesNotMatch(result.html, /<td\b(?=[^>]*bgcolor="#1E60DD")(?=[^>]*style="[^"]*background-color:#1E60DD)(?![^>]*style="[^"]*border-radius:50px)[^>]*>/u);
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

// Task9 intrinsic labels: literal text/width expectations precede browser geometry evidence.
async function task9LabelOutput({ text, sizing, role = "label", rich = false, stretch = false, parentAxis = "vertical", grow = false }) {
  const roots = {};
  for (const [viewport, width, fontSize] of [["mobile", 40, 14], ["desktop", 46, 16]]) {
    const label = { id: "probe-label", semantic_role: role, render_mode: "html-text", visibility: { mode: "always" }, children: [],
      content_slots: [{ id: "text", type: rich ? "rich-text" : "plain-text", required: true }],
      facts: [dimensions("reference-size", width, 22), keyword("text-auto-resize", "width_and_height"), measure("font-size", fontSize),
        ...(sizing ? [keyword("horizontal-sizing", sizing)] : []), ...(stretch ? [keyword("layout-align", "stretch")] : []),
        ...(grow ? [{ id: "layout-grow", value: { type: "number", value: 1 } }] : []),
        ...(rich ? [{ id: "source-text", value: { type: "string", value: text } }, { id: "styled-text-segments", value: { type: "segments", items: [{ start: 0, end: text.length, characters: text, font_family: "Arial", font_style: "Regular", font_size_px: fontSize, fills: [{ type: "solid", visible: true, color: "#112233" }], line_height: { value: 20, unit: "PIXELS" }, text_decoration: "NONE" }] } }] : []),
      ] };
    roots[viewport] = node("label-parent", [keyword("layout-axis", parentAxis), measure("layout-gap", 0)], [label]);
  }
  const record = { id: "task9-label-probe", properties: [], asset_contracts: [], variants: [{ id: "mobile" }, { id: "desktop" }], contracts: { mobile: { root: roots.mobile }, desktop: { root: roots.desktop } } };
  const value = { type: rich ? "rich-text" : "plain-text", value: text };
  const model = { root: { instance_id: "task9-label", component_id: record.id, variants: { mobile: "mobile", desktop: "desktop" }, content_values: [{ element_id: "probe-label", slot_id: "text", scope: "all", value }], property_values: [], asset_files: [], slots: [] } };
  const { validateEmailModelSemantics } = await import("../../scripts/lib/email-model.mjs");
  assert.deepEqual(validateEmailModelSemantics(model, { componentIndex: { bySystemId: new Map([[record.id, record]]) }, rendererRegistry: { coverage: [{ component_id: record.id, mode: "interpreter" }] } }), [], "synthetic label semantic precondition");
  const result = renderContractTree({ component: record, coverage: { component_id: record.id, mode: "interpreter" }, content: { "probe-label": { text: value } }, foundations: { rendering } });
  assert.deepEqual(result.diagnostics, []);
  const paragraphs = [...result.html.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gu)].map(x => x[0]);
  assert.equal(paragraphs.length, 2, "distinct 14px/16px branches remain observable");
  return { result, paragraphs };
}
for (const sizing of [undefined, "hug"]) for (const text of ["2  шаг", "3  шаг"]) {
  test("intrinsic plain " + (sizing ?? "absent-sizing") + " label preserves literal " + text + " in both serialized branches", async () => {
    const { paragraphs } = await task9LabelOutput({ text, sizing });
    for (const paragraph of paragraphs) {
      assert.ok(paragraph.endsWith(">" + text + "</p>"), "literal double ASCII space text remains unchanged");
      assert.match(paragraph, /(?:^|[";])white-space:pre(?:;|")/u);
    }
  });
}
for (const sizing of [undefined, "hug"]) test("long intrinsic " + (sizing ?? "absent-sizing") + " label has no 40px or 46px reference cap", async () => {
  const text = "Значительно более длинная метка 2  шаг";
  const { paragraphs } = await task9LabelOutput({ text, sizing });
  for (const paragraph of paragraphs) {
    assert.ok(paragraph.endsWith(">" + text + "</p>"));
    assert.doesNotMatch(paragraph, /max-width:(?:40|46)px/u);
    assert.doesNotMatch(paragraph, /(?:^|[";])width:(?:40|46)px(?:;|")/u);
  }
});
for (const spec of [
  { name: "single space", text: "2 шаг" },
  { name: "multiline", text: "2  шаг\nСледующая строка" },
  { name: "rich text", text: "2  шаг", rich: true },
  { name: "ordinary body", text: "2  шаг", role: "body" },
  { name: "fixed label", text: "2  шаг", sizing: "fixed" },
  { name: "fill label", text: "2  шаг", sizing: "fill" },
]) test("significant-space behavior stays local: " + spec.name, async () => {
  const { paragraphs } = await task9LabelOutput(spec);
  for (const paragraph of paragraphs) assert.doesNotMatch(paragraph, /(?:^|[";])white-space:pre(?:;|")/u);
  if (spec.name === "multiline") for (const paragraph of paragraphs) assert.match(paragraph, />2  шаг<br(?:\s*\/)?>(?:Следующая строка)<\/p>$/u);
  if (spec.rich) for (const paragraph of paragraphs) { assert.match(paragraph, /<span\b[^>]*>2  шаг<\/span>/u); assert.match(paragraph, /color:#112233/u); }
  if (spec.rich || spec.name === "multiline") { assert.match(paragraphs[0], /max-width:40px/u); assert.match(paragraphs[1], /max-width:46px/u); }
  if (spec.role === "body" || spec.sizing === "fixed") { assert.match(paragraphs[0], /max-width:40px/u); assert.match(paragraphs[1], /max-width:46px/u); }
  if (spec.sizing === "fill") { assert.match(paragraphs[0], /width:100%/u); assert.doesNotMatch(paragraphs[0], /max-width:/u); assert.match(paragraphs[1], /max-width:46px/u); }
});
test("Mobile intrinsic label stretch retains its existing width100 priority", async () => {
  const { paragraphs } = await task9LabelOutput({ text: "2  шаг", sizing: "hug", stretch: true });
  assert.match(paragraphs[0], /width:100%/u); assert.doesNotMatch(paragraphs[0], /max-width:/u);
  assert.doesNotMatch(paragraphs[0], /(?:^|[";])white-space:pre(?:;|")/u);
  assert.ok(paragraphs.every(p => p.endsWith(">2  шаг</p>")));
});
test("intrinsic significant spaces preserve normal escaping rather than introducing markup", async () => {
  const { paragraphs } = await task9LabelOutput({ text: '2  шаг & <b>"literal"</b>' });
  for (const paragraph of paragraphs) { assert.match(paragraph, /2  шаг &amp; &lt;b&gt;&quot;literal&quot;&lt;\/b&gt;/u); assert.doesNotMatch(paragraph, /<b>/u); }
});

test("Mobile intrinsic label horizontal grow retains width100 without pre or a reference cap", async () => {
  const { paragraphs } = await task9LabelOutput({ text: "2  шаг", sizing: "hug", parentAxis: "horizontal", grow: true });
  assert.match(paragraphs[0], /width:100%/u);
  assert.doesNotMatch(paragraphs[0], /max-width:/u);
  assert.doesNotMatch(paragraphs[0], /(?:^|[";])white-space:pre(?:;|")/u);
  assert.ok(paragraphs.every(paragraph => paragraph.endsWith(">2  шаг</p>")), "literal double ASCII spaces remain in both branches");
});
