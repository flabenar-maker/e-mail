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
    content: { "secondary-image": { alt: "" } },
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


for(const spec of [
    {name:"fixed",sizing:"fixed",fixed:true},
    {name:"fill",sizing:"fill",fluid:true},
    {name:"hug",sizing:"hug"},
    {name:"unspecified"},
    {name:"fixed-with-fluid-policy",sizing:"fixed",fluid:true,behavior:"width-behavior",behaviorValue:"fluid-to-container"},
    {name:"fixed-with-auto-height-policy",sizing:"fixed",fluid:true,behavior:"height-behavior",behaviorValue:"auto"},
  ])test("direct image sizing in Hug wrappers: "+spec.name,async()=>{
    const picture=node({id:"picture",mode:"direct-image",facts:[
      fact("reference-size",{type:"dimensions",width:72,height:72,unit:"px"}),
      ...(spec.sizing?[fact("horizontal-sizing",{type:"keyword",value:spec.sizing})]:[]),
      fact("vertical-sizing",{type:"keyword",value:"fixed"}),
      ...(spec.behavior?[fact(spec.behavior,{type:"keyword",value:spec.behaviorValue})]:[]),
    ]});picture.asset_contract_id="picture";
    const wrapper=node({id:"image-column",facts:[
      fact("reference-size",{type:"dimensions",width:72,height:160,unit:"px"}),
      fact("layout-axis",{type:"keyword",value:"horizontal"}),
      fact("horizontal-sizing",{type:"keyword",value:"hug"}),
      fact("vertical-sizing",{type:"keyword",value:"fill"}),
    ],children:[picture]});
    const link=node({id:"text-column",mode:"html-link",facts:[
      fact("reference-size",{type:"dimensions",width:156,height:160,unit:"px"}),
      fact("horizontal-sizing",{type:"keyword",value:"fill"}),
      fact("vertical-sizing",{type:"keyword",value:"hug"}),
    ],slots:[{id:"text",required:true},{id:"href",required:true}]});
    const root=node({id:"root",facts:[
      fact("reference-size",{type:"dimensions",width:252,height:160,unit:"px"}),
      fact("layout-axis",{type:"keyword",value:"horizontal"}),measure("layout-gap",24),
    ],children:[wrapper,link]});
    const result=await render({component:component(root),content:{picture:{alt:"Native icon"},"text-column":{text:"x".repeat(160),href:"https://example.test/live"}},assets:{picture:{src:"icon.png",width:288,height:288}}});
    assert.deepEqual(result.diagnostics,[],spec.name);
    const images=[...result.html.matchAll(/<img\b[^>]*>/gu)];assert.ok(images.length>0,spec.name);
    for(const [image]of images){
      const style=image.match(/style="([^"]*)"/u)?.[1]??"";
      if(spec.fixed){
        assert.match(style,/(?:^|;)min-width:72px(?:;|$)/u,"native Fixed width is a non-compressible table-layout minimum");
        assert.match(style,/(?:^|;)width:72px(?:;|$)/u);assert.match(style,/(?:^|;)height:72px(?:;|$)/u);
      }else{
        assert.doesNotMatch(style,/(?:^|;)min-width:/u,spec.name+" must not inherit Fixed protection");
        assert.match(style,/(?:^|;)max-width:100%(?:;|$)/u,spec.name+" retains responsive cap");
        if(spec.fluid){assert.match(style,/(?:^|;)width:100%(?:;|$)/u);assert.match(style,/(?:^|;)height:auto(?:;|$)/u);assert.doesNotMatch(image,/\sheight="/u);}
        else{assert.match(style,/(?:^|;)width:72px(?:;|$)/u);assert.match(style,/(?:^|;)height:72px(?:;|$)/u);}
      }
    }
    assert.doesNotMatch(result.html,/<(?:table|td)[^>]*height="160"/u,"Hug/Fill wrapper reference height is not a fixed row height");
});

test("native Fixed image protection follows email-render-size instead of source or export pixel dimensions",async()=>{
  const image=node({id:"picture",mode:"direct-image",facts:[
    fact("reference-size",{type:"dimensions",width:72,height:72,unit:"px"}),
    fact("horizontal-sizing",{type:"keyword",value:"fixed"}),
    fact("vertical-sizing",{type:"keyword",value:"fixed"}),
    fact("email-render-size",{type:"dimensions",width:24,height:24,unit:"px"}),
  ]});image.asset_contract_id="picture";
  const result=await render({component:component(node({id:"root",children:[image]})),content:{picture:{alt:""}},assets:{picture:{src:"icon.png",width:288,height:288}}});
  assert.deepEqual(result.diagnostics,[]);
  for(const [tag]of result.html.matchAll(/<img\b[^>]*>/gu)){
    assert.match(tag,/min-width:24px/u);assert.match(tag,/\swidth="24"/u);assert.match(tag,/\sheight="24"/u);
    assert.doesNotMatch(tag,/min-width:(?:72|288)px/u);
  }
});
