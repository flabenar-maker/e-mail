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

// Task8: literal registered identities are expectations; full/compact parity is secondary.
async function task8RegisteredRecords() {
  const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
  const registries = await loadComponentRegistries({ repoRoot: root });
  const { buildContextBundle } = await import("../../scripts/lib/context-bundle.mjs");
  const result = await buildContextBundle({ repoRoot: root, routeId: "email-new-build", candidates: [{ id: "nps-options" }, { id: "asset-card-image-2x" }, { id: "button-primary" }], viewports: ["mobile", "desktop"] });
  assert.equal(result.status, "resolved", JSON.stringify(result.blockers));
  return { full: new Map(listComponentRecords(registries).map(({record}) => [record.id, record])), compact: new Map(result.bundle.components.map(record => [record.id, record])) };
}
function task8TreeIds(root) { return root ? [root.id, ...(root.children ?? []).flatMap(task8TreeIds)] : []; }
for (const [label, axes, neutral] of [["Count2", { Count: "2" }, false], ["Count3", { Count: 3 }, true], ["default", {}, true]]) {
  test("registered NPS " + label + " retains literal options in full and compact both-view selectors", async () => {
    const records = await task8RegisteredRecords();
    const { selectVariantRoot } = await import("../../scripts/lib/email-interpreter.mjs");
    const expected = ["root", "root-content-area", "root-content-area-heading", "root-content-area-emoji-buttons", "root-content-area-emoji-buttons-good", "root-content-area-emoji-buttons-good-happy-face-icon", ...(neutral ? ["root-content-area-emoji-buttons-neutral", "root-content-area-emoji-buttons-neutral-neutral-face-icon"] : []), "root-content-area-emoji-buttons-bad", "root-content-area-emoji-buttons-bad-sad-face-icon"];
    for (const viewport of ["mobile", "desktop"]) {
      const observations = [];
      for (const mode of ["full", "compact"]) {
        const selected = selectVariantRoot(records[mode].get("nps-options"), viewport, axes);
        assert.deepEqual(selected.diagnostics, [], mode + "/" + viewport);
        assert.deepEqual(task8TreeIds(selected.root), expected, mode + "/" + viewport);
        observations.push(selected.root);
      }
      assert.deepEqual(task8TreeIds(observations[0]), task8TreeIds(observations[1]));
    }
  });
}
for (const [label, id, axes] of [["unknown Count", "nps-options", { Count: "999" }], ["unknown axis", "nps-options", { Missing: "2" }], ["no-extras unknown axis", "button-primary", { Missing: "2" }], ["reserved Viewport", "nps-options", { Viewport: "Desktop", Count: "2" }]]) {
  test("explicit " + label + " blocks full and compact selection and emits no HTML", async () => {
    const records = await task8RegisteredRecords();
    const { selectVariantRoot } = await import("../../scripts/lib/email-interpreter.mjs");
    for (const mode of ["full", "compact"]) {
      const record = records[mode].get(id);
      const output = await render({ component: record, coverage: { component_id: id, mode: "interpreter" }, variantAxes: axes });
      assert.equal(output.html, "", mode + " must reject before emitting HTML");
      assert.ok(output.diagnostics.length > 0 && output.diagnostics.every(x => x.code === "RENDER_VARIANT_UNRESOLVED"));
      for (const viewport of ["mobile", "desktop"]) {
        const selected = selectVariantRoot(record, viewport, axes);
        assert.equal(selected.root, null, mode + "/" + viewport);
        assert.deepEqual(selected.diagnostics.map(x => [x.code, x.path]), [["RENDER_VARIANT_UNRESOLVED", `/contracts/${viewport}/variant_contracts`]]);
      }
    }
  });
}
test("registered viewport-less card-image Style selects exact shared identity in both views", async () => {
  const records = await task8RegisteredRecords();
  const { selectVariantRoot } = await import("../../scripts/lib/email-interpreter.mjs");
  for (const [style, nodeId] of [["numbered", "911:3991"], ["pLaIn", "911:3990"]]) for (const viewport of ["mobile", "desktop"]) for (const mode of ["full", "compact"]) {
    const selected = selectVariantRoot(records[mode].get("asset-card-image-2x"), viewport, { Style: style });
    assert.deepEqual(selected.diagnostics, [], mode + "/" + viewport + "/" + style);
    if (mode === "full") assert.equal(selected.root?.facts.find(f => f.id === "reference-size")?.provenance?.node_id, nodeId);
    else if (nodeId === "911:3991") assert.equal(selected.root, records.compact.get("asset-card-image-2x").contracts[viewport].root);
    else { const extra = records.compact.get("asset-card-image-2x").contracts.variant_contracts.find(x => x.variant_node_id === "911:3990"); assert.ok(extra); assert.equal(selected.root, extra.root); }
    assert.deepEqual(task8TreeIds(selected.root), ["root"]);
  }
});
test("incomplete and ambiguous exact variant selectors fail closed without guessing", async () => {
  const root = node({ id: "base" });
  const registered = component(root, [{ variant_node_id: "1:2", axes: [{ name: "Viewport", value: "Mobile" }, { name: "Style", value: "Accent" }, { name: "Tone", value: "Warm" }], root: node({ id: "accent" }) }]);
  const { selectVariantRoot } = await import("../../scripts/lib/email-interpreter.mjs");
  assert.equal(selectVariantRoot(registered, "mobile", { Style: "Accent" }).root, null);
  registered.contracts.variant_contracts = ["1:2", "1:3"].map((variant_node_id, i) => ({ variant_node_id, axes: [{ name: "Viewport", value: "Mobile" }, { name: "Style", value: "Accent" }], root: node({ id: "accent-" + i }) }));
  const selected = selectVariantRoot(registered, "mobile", { Style: "Accent" });
  assert.equal(selected.root, null);
  assert.deepEqual(selected.diagnostics.map(x => x.code), ["RENDER_VARIANT_UNRESOLVED"]);
});


// Task11 bounded identity proof matrix: foreign resemblance must keep baseline action shape.
function task11IdentityElement(){return node({id:"root-content-area-emoji-buttons-good",role:"good",facts:[measure("padding-top",6),measure("padding-right",24),measure("padding-bottom",6),measure("padding-left",24),fact("background",{type:"color",value:"#F8F8FA"}),measure("border-radius",32)],slots:[{id:"href",type:"url",required:true}],action:{kind:"whole-element",href_slot:"href",required:true},children:[node({id:"task11-label",mode:"html-text",slots:[{id:"text",type:"plain-text",required:true}]})]});}
async function task11IdentityRender(element,owner="nps-options"){
  const record=component(element);record.id=owner;
  return render({component:record,coverage:{component_id:owner,mode:"interpreter"},content:{[element.id]:{href:"https://example.test/task11/identity",other:"https://example.test/task11/identity"},"task11-label":{text:"TASK11 LABEL"},"task11-other":{text:"SECOND LITERAL"}}});
}
test("Task11 trusted raw standalone NPS option owns its padding",async()=>{const r=await task11IdentityRender(task11IdentityElement());assert.deepEqual(r.diagnostics,[]);const a=r.html.match(/<a\b[^>]*>[\s\S]*?<\/a>/u)?.[0];assert.ok(a);assert.match(a,/display:block/u);assert.match(a,/padding-left:24px/u);assert.doesNotMatch(a,/<table\b/u);});
function task11AssertRetainedIdentity(r,expectedUrl=true){assert.deepEqual(r.diagnostics,[],"negative identity fixture must render valid output");assert.match(r.html,/TASK11 LABEL/u);assert.match(r.html,/background-color:#F8F8FA/u);assert.match(r.html,/border-radius:32px/u);if(expectedUrl)assert.match(r.html,/href="https:\/\/example\.test\/task11\/identity"/u);else assert.doesNotMatch(r.html,/<a\b/u,"missing href slot retains paint/text without inventing a link");}
const task11RejectedOwners=[
  ["foreign exact ID",e=>e,"foreign"],
  ["foreign role",e=>({...e,id:"good"}),"foreign"],
  ["scoped suffix without origin",e=>({...e,id:"instance--root-content-area-emoji-buttons-good"}),"nps-options"],
  ["foreign origin",e=>({...e,output_origin:{component_id:"foreign",original_element_id:e.id}}),"nps-options"],
  ["missing origin owner",e=>({...e,output_origin:{original_element_id:e.id}}),"nps-options"],
  ["missing original ID",e=>({...e,output_origin:{component_id:"nps-options"}}),"nps-options"],
  ["wrong original ID",e=>({...e,output_origin:{component_id:"nps-options",original_element_id:"good"}}),"nps-options"],
  ["empty origin",e=>({...e,output_origin:{}}),"nps-options"],
  ["model owner spoof",e=>({...e,id:"scoped-good",component_id:"nps-options",owner:"nps-options"}),"foreign"],
  ["wrong href slot",e=>({...e,action:{kind:"whole-element",href_slot:"other",required:true}}),"nps-options"],
  ["missing href slot",e=>({...e,action:{kind:"whole-element",required:true}}),"nps-options"],
  ["distributed action",e=>({...e,action:{kind:"distributed-cells",href_slot:"href",required:true}}),"nps-options"],
];
for(const [name,mutate,owner] of task11RejectedOwners)test("Task11 NPS owner rejects "+name,async()=>{const r=await task11IdentityRender(mutate(task11IdentityElement()),owner);task11AssertRetainedIdentity(r,name!=="missing href slot");assert.doesNotMatch(r.html,/<a\b[^>]*padding-left:24px/u,"rejected identity cannot select button path");});
test("Task11 prepared exact NPS origin under foreign root owns its padding",async()=>{const e=task11IdentityElement();e.id="scope-option";e.output_origin={component_id:"nps-options",original_element_id:"root-content-area-emoji-buttons-good",instance_path:"nested",viewport:"mobile"};const r=await task11IdentityRender(e,"foreign");assert.deepEqual(r.diagnostics,[]);assert.match(r.html,/<a\b[^>]*padding-left:24px/u);});
for(const role of ["button","ordinary-button"])test("Task11 ordinary "+role+" control retains whole padding",async()=>{const e=task11IdentityElement();e.id="ordinary";e.semantic_role=role;const r=await task11IdentityRender(e,"foreign");assert.deepEqual(r.diagnostics,[]);assert.match(r.html,/<a\b[^>]*padding-left:24px/u);});
test("Task11 empty decorative painted container remains non-action",async()=>{const e=task11IdentityElement();delete e.action;e.children=[];e.content_slots=[];e.facts.push(fact("reference-size",{type:"dimensions",width:137,height:51,unit:"px"}));const r=await task11IdentityRender(e);assert.deepEqual(r.diagnostics,[]);assert.doesNotMatch(r.html,/<a\b/u);assert.match(r.html,/<table\b[^>]*width="137"[^>]*height="51"/u);assert.match(r.html,/<td\b[^>]*width="137"[^>]*height="51"[^>]*bgcolor="#F8F8FA"[^>]*>[\s\S]*?&nbsp;<\/td>/u);assert.match(r.html,/background-color:#F8F8FA/u);assert.match(r.html,/border-radius:32px/u);assert.match(r.html,/font-size:0;line-height:0/u);});

for(const [name,origin] of [["null",null],["string","nps-options"],["array",[]]])test("Task11 malformed "+name+" origin cannot fall back to standalone owner",async()=>{const e=task11IdentityElement();e.output_origin=origin;const r=await task11IdentityRender(e);task11AssertRetainedIdentity(r);assert.doesNotMatch(r.html,/<a\b[^>]*padding-left:24px/u);});
test("Task11 multi-child foreign action keeps ordinary table wrapping",async()=>{const e=task11IdentityElement();e.facts.push(fact("layout-axis",{type:"keyword",value:"horizontal"}),measure("layout-gap",8),fact("primary-alignment",{type:"keyword",value:"center"}));e.children.push(node({id:"task11-other",mode:"html-text",slots:[{id:"text",type:"plain-text",required:true}]}));const r=await task11IdentityRender(e,"foreign");task11AssertRetainedIdentity(r);assert.match(r.html,/SECOND LITERAL/u);assert.doesNotMatch(r.html,/<a\b[^>]*padding-left:24px/u);assert.match(r.html,/<a\b[^>]*>[\s\S]*?<table\b/u);});
test("Task11 differing native NPS child styles cannot share outer action",async()=>{
  const e=task11IdentityElement(),record=component(e);record.id="nps-options";
  record.contracts.mobile.root.children[0].facts.push(measure("font-size",14));record.contracts.desktop.root.children[0].facts.push(measure("font-size",19));
  const r=await render({component:record,coverage:{component_id:record.id,mode:"interpreter"},content:{[e.id]:{mobile:{href:"https://example.test/task11/style/mobile"},desktop:{href:"https://example.test/task11/style/desktop"}},"task11-label":{mobile:{text:"MOBILE STYLE"},desktop:{text:"DESKTOP STYLE"}}}});assert.deepEqual(r.diagnostics,[]);
  for(const viewport of ["mobile","desktop"]){const href="https://example.test/task11/style/"+viewport;const a=[...r.html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gu)].map(m=>m[0]).find(x=>x.includes(href));assert.ok(a);assert.match(a,/display:block/u);assert.ok(a.includes(viewport==="mobile"?"MOBILE STYLE":"DESKTOP STYLE"));assert.ok(!a.includes(viewport==="mobile"?"DESKTOP STYLE":"MOBILE STYLE"));assert.ok(a.includes(viewport==="mobile"?"font-size:14px":"font-size:19px"));}
});
