import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { indexComponentRegistries, loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { loadRenderingFoundation } from "../../scripts/lib/rendering-foundation.mjs";
import { loadRendererRegistry } from "../../scripts/lib/renderer-registry.mjs";
import { loadEmailModel } from "../../scripts/lib/email-model.mjs";
import { renderComponent, renderEmailDocument } from "../../scripts/lib/email-renderer.mjs";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const fixture = join(root, "tests/fixtures/rendering/pilot-email.json");
const schema = join(root, "schemas/email-model.schema.json");

async function context() {
  const [model, registries, rendererRegistry, rendering] = await Promise.all([
    loadEmailModel({ modelPath: fixture, schemaPath: schema }),
    loadComponentRegistries({ repoRoot: root }),
    loadRendererRegistry({ repoRoot: root }),
    loadRenderingFoundation({ repoRoot: root }),
  ]);
  return {
    model,
    deps: { rendererRegistry, componentIndex: indexComponentRegistries(registries), foundations: { rendering } },
  };
}

async function rendered(componentId) {
  const { model, deps } = await context();
  if (!componentId) return renderEmailDocument(model, deps);
  const instance = model.root.slots[0].instances.find((item) => item.component_id === componentId);
  assert.ok(instance, "missing pilot component " + componentId);
  return renderComponent({ componentId, viewportData: instance, ...deps });
}

function imageTag(html, source, last = false) {
  const tags = [...html.matchAll(/<img\b[^>]*>/gu)].map((match) => match[0]);
  const found = tags.filter((tag) => tag.includes('src="' + source + '"'));
  assert.ok(found.length > 0, "missing image " + source);
  return last ? found.at(-1) : found[0];
}

function nearestTable(html, marker, last = false) {
  const position = last ? html.lastIndexOf(marker) : html.indexOf(marker);
  assert.ok(position >= 0, "missing marker " + marker);
  const stack = [];
  for (const match of html.slice(0, position).matchAll(/<\/?table\b[^>]*>/gu)) {
    if (match[0].startsWith("</")) stack.pop();
    else stack.push(match[0]);
  }
  assert.ok(stack.length > 0, "missing table for " + marker);
  return stack.at(-1);
}

test("pilot uses the Figma-default Secondary CTA with its nested component", async () => {
  const { model, deps } = await context();
  const secondary = model.root.slots[0].instances.find((item) => item.component_id === "banner-secondary");
  assert.equal(secondary.property_values.find((item) => item.property_id === "show-button")?.value, true);
  assert.equal(secondary.nested_components?.find((item) => item.element_id === "root-card-content-area-button")?.instance.component_id, "button-secondary");
  assert.ok(deps.rendererRegistry.coverage.some((item) => item.component_id === "button-secondary"));
  const result = renderEmailDocument(model, deps);
  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /Какая-то кнопка/u);
  assert.match(result.html, /href="https:\/\/example\.test\/secondary"/u);
});

test("pilot text and fixed store names use source-like Figma content", async () => {
  const { model } = await context();
  const instances = model.root.slots[0].instances;
  const secondary = instances.find((item) => item.component_id === "banner-secondary");
  const app = instances.find((item) => item.component_id === "banner-app-download");
  const footer = instances.find((item) => item.component_id === "email-footer");
  assert.equal(secondary.content_values.find((item) => item.element_id.endsWith("-heading"))?.value.value, "Небольшой заголовок\u2028на пару строк");
  assert.equal(secondary.content_values.find((item) => item.element_id.endsWith("-body"))?.value.value, "Поясняющая подпись на несколько красивых строк");
  assert.equal(app.content_values.find((item) => item.element_id.endsWith("google-play-button-button-text-title"))?.value.value, "GooglePlay");
  assert.ok(footer.content_values.find((item) => item.element_id.endsWith("disclaimer-text-01"))?.value.value.includes("Мобильная карта"));
});

test("Mobile Secondary direct image has fluid CSS but no fixed HTML height attribute", async () => {
  const result = await rendered("banner-secondary");
  assert.deepEqual(result.diagnostics, []);
  const tag = imageTag(result.html, "images/secondary.jpg");
  assert.match(tag, /height:auto/u);
  assert.doesNotMatch(tag, /\sheight="/u);
});

test("Desktop Secondary image follows content height and the white area paints its full column", async () => {
  const result = await rendered("banner-secondary");
  assert.deepEqual(result.diagnostics, []);
  const tag = result.html.match(/<td\b[^>]*background="images\/secondary\.jpg"[^>]*>/u)?.[0];
  assert.ok(tag, "missing Desktop background-image cell");
  assert.doesNotMatch(tag, /\sheight="238"|height:238px/u);
  assert.match(result.html, /<td\b[^>]*bgcolor="#FFFFFF"[^>]*>/u);
});

test("Footer social icon group is centered inside its own table", async () => {
  const result = await rendered("email-footer");
  assert.deepEqual(result.diagnostics, []);
  for (const match of result.html.matchAll(/src="images\/vk-icon\.png"/gu)) {
    const tag = nearestTable(result.html.slice(0, match.index + match[0].length), 'src="images/vk-icon.png"', true);
    assert.match(tag, /align="center"/u);
  }
});

test("direct-image assets do not receive an HTML background already baked into the export", async () => {
  const result = await rendered("banner-app-download");
  assert.deepEqual(result.diagnostics, []);
  assert.doesNotMatch(imageTag(result.html, "images/rustore-icon.png", true), /background-color:/u);
});

test("flattened store label preserves the Figma no-wrap contract", async () => {
  const result = await rendered("banner-app-download");
  assert.deepEqual(result.diagnostics, []);
  const mobileGooglePlay = actionAnchors(result.html, "https://example.test/google-play")
    .find((anchor) => anchor.includes("GooglePlay"));
  assert.ok(mobileGooglePlay, "missing Mobile GooglePlay action");
  assert.match(mobileGooglePlay, /white-space:nowrap/u);
});

function actionAnchors(html, href) {
  return [...html.matchAll(new RegExp(
    '<a\\b[^>]*href="' + href + '"[^>]*>[\\s\\S]*?<\\/a>',
    "gu",
  ))].map((match) => match[0]);
}

test("pilot whole-button anchors own their visible-cell padding without nested tables", async () => {
  const result = await rendered();
  assert.deepEqual(result.diagnostics, []);

  const secondary = actionAnchors(result.html, "https://example.test/secondary");
  assert.equal(secondary.length, 2);
  for (const anchor of secondary) {
    assert.match(anchor, /display:block/u);
    assert.match(anchor, /padding-top:12px/u);
    assert.match(anchor, /padding-right:24px/u);
    assert.match(anchor, /padding-bottom:12px/u);
    assert.match(anchor, /padding-left:24px/u);
    assert.doesNotMatch(anchor, /<table\b/u);
  }

  for (const store of ["rustore", "google-play", "appgallery", "getapps"]) {
    const anchors = actionAnchors(result.html, "https://example.test/" + store);
    assert.equal(anchors.length, 2, store + " needs one anchor per viewport");
    for (const anchor of anchors) {
      assert.match(anchor, /display:block/u);
      assert.match(anchor, /padding-left:12px/u);
      assert.match(anchor, /padding-right:12px/u);
      assert.match(anchor, /padding-top:(?:9|12)px/u);
      assert.match(anchor, /padding-bottom:(?:9|12)px/u);
      assert.doesNotMatch(anchor, /<table\b/u);
    }
  }
});

function openingParagraphTag(html, marker) {
  const paragraph = [...html.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gu)]
    .find((match) => match[0].includes(marker))?.[0];
  assert.ok(paragraph, "missing paragraph " + marker);
  return paragraph.slice(0, paragraph.indexOf(">") + 1);
}

test("Mobile stretch text fills its container while preserving Figma alignment", async () => {
  const secondary = await rendered("banner-secondary");
  const app = await rendered("banner-app-download");
  const footer = await rendered("email-footer");
  for (const result of [secondary, app, footer]) assert.deepEqual(result.diagnostics, []);

  for (const marker of ["Небольшой заголовок", "Поясняющая подпись"]) {
    const tag = openingParagraphTag(secondary.html, marker);
    assert.match(tag, /width:100%/u, marker + " must track the Mobile card width");
    assert.match(tag, /text-align:center/u);
    assert.doesNotMatch(tag, /max-width:/u);
  }

  const legal = openingParagraphTag(footer.html, "Мобильная карта");
  assert.match(legal, /width:100%/u);
  assert.match(legal, /text-align:center/u);
  assert.doesNotMatch(legal, /max-width:/u);

  const appBody = openingParagraphTag(app.html, "Единственный финансовый");
  assert.match(appBody, /width:100%/u);
  assert.match(appBody, /text-align:left/u, "App description intentionally remains left aligned");
  assert.doesNotMatch(appBody, /max-width:/u);
});

test("Mobile adaptive store buttons retain a fixed 76px text column for aligned icons", async () => {
  const result = await rendered("banner-app-download");
  assert.deepEqual(result.diagnostics, []);
  for (const [store, label] of [
    ["rustore", "RuStore"],
    ["google-play", "GooglePlay"],
    ["appgallery", "AppGallery"],
    ["getapps", "GetApps"],
  ]) {
    const mobile = actionAnchors(result.html, "https://example.test/" + store)
      .find((anchor) => anchor.includes(">" + label + "</span>"));
    assert.ok(mobile, "missing Mobile " + store + " action");
    const span = [...mobile.matchAll(/<span\b[^>]*>[^<]*<\/span>/gu)]
      .find((match) => match[0].includes(">" + label + "</span>"))?.[0];
    assert.ok(span, "missing " + store + " text column");
    assert.match(span, /width:76px/u);
    assert.doesNotMatch(span, /max-width:/u, "fixed text column must have one unambiguous width");
  }
});

// Task9: public preparation emits its own scope/markers; expectations inspect serialized outer tables.
let task9BaseContext;
const task9Fact = (id, value) => ({ id, value });
const task9Keyword = (id, value) => task9Fact(id, { type: "keyword", value });
const task9Size = (id, width, height) => task9Fact(id, { type: "dimensions", width, height, unit: "px" });
function task9Node(id, overrides = {}) { return { id, semantic_role: id, render_mode: "presentation-table", visibility: { mode: "always" }, facts: [], children: [], ...overrides }; }
function task9TableStackAt(html, position) {
  const stack = [];
  for (const match of html.slice(0, position).matchAll(/<\/?table\b[^>]*>/gu)) { if (match[0].startsWith("</")) stack.pop(); else stack.push(match[0]); }
  assert.ok(stack.length); return stack;
}
function task9HrefTables(html, href) {
  const token = 'href="' + href + '"'; const output = []; let at = -1;
  while ((at = html.indexOf(token, at + 1)) >= 0) output.push(task9TableStackAt(html, at).at(-1));
  return output;
}
async function task9CenterFixture({ mode = "nested", repeated = false, center = true, axis = "vertical", hiddenMobile = false, profile = "default", identicalLabel = false, nativeLabel = null } = {}) {
  task9BaseContext ??= context(); const { deps: base } = await task9BaseContext;
  const template = base.componentIndex.bySystemId.get("button-primary");
  const coverage = id => ({ component_id: id, mode: "interpreter" });
  const roots = {};
  for (const [viewport, fontSize] of [["mobile", 14], ["desktop", identicalLabel ? 14 : 16]]) {
    const label = task9Node("label", { semantic_role: "label", render_mode: "html-text", facts: [task9Fact("font-size", { type: "measure", value: fontSize, unit: "px" }), ...(nativeLabel ? [task9Size("reference-size", viewport === "mobile" ? 40 : 46, 22), task9Keyword("text-auto-resize", "width_and_height"), ...(nativeLabel.sizing ? [task9Keyword("horizontal-sizing", nativeLabel.sizing)] : [])] : [])], content_slots: [{ id: "text", type: "plain-text", required: true }] });
    roots[viewport] = task9Node("root", { semantic_role: "button", facts: [task9Size("reference-size", 230, 46), task9Size("email-render-size", 230, 46), task9Keyword("horizontal-sizing", "hug"), task9Keyword("layout-axis", "vertical"), task9Fact("layout-gap", { type: "measure", value: 0, unit: "px" })], content_slots: [{ id: "href", type: "url", required: true }], action: { kind: "whole-element", href_slot: "href", required: true }, children: [label] });
  }
  const button = { ...structuredClone(template), id: "task9-button", properties: [], asset_contracts: [], contracts: { mobile: { root: roots.mobile }, desktop: { root: roots.desktop } } };
  const makeButton = (instanceId, ordinal) => ({ instance_id: instanceId, component_id: button.id, variants: { mobile: "mobile", desktop: "desktop" }, property_values: [], content_values: [
    { element_id: "root", slot_id: "href", scope: "all", value: { type: "url", value: `https://example.test/task9-cta-${ordinal}` } },
    ...["mobile", "desktop"].map(viewport => ({ element_id: "label", slot_id: "text", scope: viewport, value: { type: "plain-text", value: nativeLabel?.text ?? `${ordinal === 1 ? "FIRST" : "SECOND"} ${identicalLabel ? "shared" : viewport} CTA` } })),
  ], asset_files: [], slots: [] });
  const instances = [makeButton("scoped-first", 1), ...(repeated ? [makeButton("scoped-second", 2)] : [])];
  const carrier = task9Node("content", { render_mode: "slot", content_slots: [{ id: "content", type: "placeholder", required: true }] });
  const bridgeRoot = mode === "drawn" ? task9Node("bridge-root", { facts: [task9Size("email-render-size", 500, 60), task9Keyword("layout-axis", "vertical"), task9Keyword("counter-alignment", "min"), task9Fact("layout-gap", { type: "measure", value: 0, unit: "px" })], children: [carrier] }) : carrier;
  const bridge = { ...structuredClone(template), id: "task9-bridge", properties: [], asset_contracts: [], contracts: { mobile: { root: bridgeRoot }, desktop: { root: structuredClone(bridgeRoot) } } };
  const nested = instances.map((child, i) => task9Node("cta-" + i, { render_mode: "nested-component", component_id: button.id, visibility: hiddenMobile ? { mode: "property", property_id: "show-cta" } : { mode: "always" } }));
  const childNodes = mode === "slot" ? [carrier] : ["bridge", "drawn"].includes(mode) ? [task9Node("bridge", { render_mode: "nested-component", component_id: bridge.id })] : nested;
  const parentRoot = task9Node("root", { facts: [task9Size("reference-size", 600, 100), task9Size("email-render-size", 600, 100), task9Keyword("layout-axis", axis), task9Keyword("counter-alignment", center ? "center" : "min"), task9Fact("layout-gap", { type: "measure", value: 0, unit: "px" })], children: childNodes });
  const parent = { ...structuredClone(template), id: "task9-center", properties: hiddenMobile ? [{ id: "show-cta", type: "boolean", default: true }] : [], asset_contracts: [], contracts: { mobile: { root: parentRoot }, desktop: { root: structuredClone(parentRoot) } } };
  const instance = { instance_id: "scope-parent", component_id: parent.id, variants: { mobile: "mobile", desktop: "desktop" }, property_values: hiddenMobile ? [{ property_id: "show-cta", scope: "mobile", value: false }, { property_id: "show-cta", scope: "desktop", value: true }] : [], content_values: [], asset_files: [], slots: [] };
  if (mode === "slot") instance.slots = [{ element_id: "content", instances }];
  else if (["bridge", "drawn"].includes(mode)) instance.nested_components = [{ element_id: "bridge", instance: { instance_id: "transparent-bridge", component_id: bridge.id, variants: { mobile: "mobile", desktop: "desktop" }, property_values: [], content_values: [], asset_files: [], slots: [{ element_id: "content", instances }] } }];
  else instance.nested_components = instances.map((child, i) => ({ element_id: "cta-" + i, instance: child }));
  const model = { schema_version: "1.1.0", id: "task9-center-model", metadata: { language: "ru", direction: "ltr" }, root: instance };
  const deps = { ...base, componentIndex: { bySystemId: new Map([...base.componentIndex.bySystemId, ...[parent, button, bridge].map(record => [record.id, record])]) }, rendererRegistry: { ...base.rendererRegistry, coverage: [...base.rendererRegistry.coverage, ...[parent, button, bridge].map(record => coverage(record.id))] } };
  const { validateEmailModelSemantics } = await import("../../scripts/lib/email-model.mjs");
  assert.deepEqual(validateEmailModelSemantics(model, deps), [], "public synthetic center model semantic precondition");
  if (profile === "altcraft-mobile-base-v1") {
    const { loadEmailDeliveryProfiles, selectDeliveryProfile } = await import("../../scripts/lib/email-delivery-profile.mjs");
    deps.deliveryProfile = selectDeliveryProfile(await loadEmailDeliveryProfiles({ repoRoot: root }), profile);
  }
  const result = renderEmailDocument(model, deps);
  assert.deepEqual(result.diagnostics, []);
  return { result, model, deps };
}
for (const profile of ["default", "altcraft-mobile-base-v1"]) {
  test("public serialized CTA outer table centers through nested/slot/transparent carriers: " + profile, async () => {
    for (const mode of ["nested", "slot", "bridge"]) {
      const { result } = await task9CenterFixture({ mode, profile });
      const tags = task9HrefTables(result.html, "https://example.test/task9-cta-1");
      assert.equal(tags.length, 2, mode + " one native outer table per viewport for differing labels and styles");
      for (const tag of tags) { assert.match(tag, /\swidth="230"/u); assert.equal((tag.match(/\salign="center"/gu) ?? []).length, 1, mode + " exact OUTER drawing table"); assert.match(tag, /(?:^|[";])margin:0 auto(?:;|")/u); }
      assert.match(result.html, /FIRST mobile CTA/u); assert.match(result.html, /FIRST desktop CTA/u);
      if (profile === "altcraft-mobile-base-v1") {
        assert.equal((result.html.match(/<!-- cupis:block task9-button \/ /gu) ?? []).length, 2);
        assert.equal((result.html.match(/<!-- cupis:end task9-button \/ /gu) ?? []).length, 2);
        assert.match(result.html, /<!--\[if !mso\]><!-->/u); assert.match(result.html, /<!--\[if mso\]>/u);
      }
    }
  });
  test("repeated scoped CTA order and hidden Mobile branch preserve structural markers: " + profile, async () => {
    const repeated = await task9CenterFixture({ repeated: true, profile });
    for (const ordinal of [1, 2]) { const tags = task9HrefTables(repeated.result.html, `https://example.test/task9-cta-${ordinal}`); assert.equal(tags.length, 2); for (const tag of tags) assert.match(tag, /\salign="center"/u); }
    assert.ok(repeated.result.html.indexOf("FIRST mobile CTA") < repeated.result.html.indexOf("SECOND mobile CTA"));
    assert.ok(repeated.result.html.indexOf("FIRST desktop CTA") < repeated.result.html.indexOf("SECOND desktop CTA"));
    if (profile === "altcraft-mobile-base-v1") {
      assert.equal((repeated.result.html.match(/<!-- cupis:block task9-button \/ /gu) ?? []).length, 4);
      assert.equal((repeated.result.html.match(/<!-- cupis:end task9-button \/ /gu) ?? []).length, 4);
    }
    const conditional = await task9CenterFixture({ hiddenMobile: true, profile });
    assert.doesNotMatch(conditional.result.html, /FIRST mobile CTA/u); assert.match(conditional.result.html, /FIRST desktop CTA/u);
    assert.equal(task9HrefTables(conditional.result.html, "https://example.test/task9-cta-1").length, 1);
    assert.match(task9HrefTables(conditional.result.html, "https://example.test/task9-cta-1")[0], /\salign="center"/u);
  });
}
test("center intent does not escape left/horizontal/drawing boundaries or standalone scope", async () => {
  for (const config of [{ center: false }, { axis: "horizontal" }, { mode: "drawn" }]) {
    const { result } = await task9CenterFixture({ ...config, profile: "altcraft-mobile-base-v1" });
    for (const tag of task9HrefTables(result.html, "https://example.test/task9-cta-1")) assert.doesNotMatch(tag, /\salign="center"/u);
    if (config.mode === "drawn") { const at = result.html.indexOf('href="https://example.test/task9-cta-1"'); assert.match(task9TableStackAt(result.html, at).at(-2), /\salign="center"/u); }
  }
  const { model, deps } = await task9CenterFixture();
  const standalone = renderComponent({ componentId: "task9-button", viewportData: model.root.nested_components[0].instance, ...deps });
  assert.deepEqual(standalone.diagnostics, []);
  for (const tag of task9HrefTables(standalone.html, "https://example.test/task9-cta-1")) assert.doesNotMatch(tag, /\salign="center"/u);
});

test("already-centered native outer table has one align attribute and leaves unrelated inner tables alone", async () => {
  const { model, deps } = await task9CenterFixture({ profile: "altcraft-mobile-base-v1" });
  const record = deps.componentIndex.bySystemId.get("task9-button");
  for (const viewport of ["mobile", "desktop"]) { const root = record.contracts[viewport].root; root.semantic_role = "social-icons"; root.facts = root.facts.filter(({ id }) => id !== "email-render-size"); root.facts.push(task9Fact("email-render-padding", { type: "measure", value: 4, unit: "px" })); delete root.action; root.content_slots = []; }
  const instance = model.root.nested_components[0].instance; instance.content_values = instance.content_values.filter(value => value.slot_id !== "href");
  const { validateEmailModelSemantics } = await import("../../scripts/lib/email-model.mjs");
  assert.deepEqual(validateEmailModelSemantics(model, deps), []);
  const result = renderEmailDocument(model, deps); assert.deepEqual(result.diagnostics, []);
  for (const marker of ["FIRST mobile CTA", "FIRST desktop CTA"]) {
    const stack = task9TableStackAt(result.html, result.html.indexOf(marker));
    assert.ok(stack.length >= 2, marker + " needs a native outer table and a real inner padding table");
    const outer = stack.at(-2); const inner = stack.at(-1);
    assert.ok(outer); assert.ok(inner); assert.notEqual(outer, inner);
    assert.equal((outer.match(/\salign="center"/gu) ?? []).length, 1);
    assert.equal((outer.match(/\salign=/gu) ?? []).length, 1);
    assert.match(inner, /\swidth="100%"/u);
    assert.doesNotMatch(inner, /\salign=/u);
  }
});

for (const profile of ["default", "altcraft-mobile-base-v1"]) {
  test("public serialized whole-button anchors preserve viewport label and style ownership: " + profile, async () => {
    const { result } = await task9CenterFixture({ profile });
    const anchors = actionAnchors(result.html, "https://example.test/task9-cta-1");
    assert.equal(anchors.length, 2, "differing Mobile/Desktop labels and styles need two native anchors");
    const mobile = anchors.filter(anchor => anchor.includes("FIRST mobile CTA"));
    const desktop = anchors.filter(anchor => anchor.includes("FIRST desktop CTA"));
    assert.equal(mobile.length, 1, "exactly one Mobile label owner");
    assert.equal(desktop.length, 1, "exactly one Desktop label owner");
    assert.notEqual(mobile[0], desktop[0], "the viewport labels must own distinct anchors");
    assert.match(mobile[0], /<span\b[^>]*font-size:14px[^>]*>FIRST mobile CTA<\/span>/u);
    assert.doesNotMatch(mobile[0], /FIRST desktop CTA|font-size:16px/u);
    assert.match(desktop[0], /<span\b[^>]*font-size:16px[^>]*>FIRST desktop CTA<\/span>/u);
    assert.doesNotMatch(desktop[0], /FIRST mobile CTA|font-size:14px/u);
    for (const anchor of anchors) assert.doesNotMatch(anchor, /<table\b/u);
  });
}

test("public serialized identical whole-button labels and styles retain one coalesced native outer", async () => {
  for (const profile of ["default", "altcraft-mobile-base-v1"]) {
    const { result } = await task9CenterFixture({ profile, identicalLabel: true });
    const anchors = actionAnchors(result.html, "https://example.test/task9-cta-1");
    assert.equal(anchors.length, 1, "identical text and 14px font preserve one native anchor: " + profile);
    assert.equal((anchors[0].match(/FIRST shared CTA/gu) ?? []).length, 1);
    assert.match(anchors[0], /<span\b[^>]*font-size:14px[^>]*>FIRST shared CTA<\/span>/u);
    assert.doesNotMatch(anchors[0], /FIRST mobile CTA|FIRST desktop CTA|font-size:16px|<table\b/u);
    const tables = task9HrefTables(result.html, "https://example.test/task9-cta-1");
    assert.equal(tables.length, 1);
    assert.match(tables[0], /\swidth="230"/u);
    if (profile === "altcraft-mobile-base-v1") {
      assert.equal((result.html.match(/<!-- cupis:block task9-button \/ /gu) ?? []).length, 1);
      assert.equal((result.html.match(/<!-- cupis:end task9-button \/ /gu) ?? []).length, 1);
    }
  }
});

test("public serialized native intrinsic label preserves exact pre and literal double spaces through paragraph conversion", async () => {
  function nativeSpans(result, text, expectedWhitespace) {
    const anchors = actionAnchors(result.html, "https://example.test/task9-cta-1");
    const spans = anchors.flatMap(anchor => [...anchor.matchAll(/<span\b[^>]*>[^<]*<\/span>/gu)]
      .map(match => match[0]).filter(span => span.endsWith(">" + text + "</span>")));
    assert.ok(spans.length > 0, "native href retains the literal label text");
    for (const span of spans) {
      const style = span.match(/\sstyle="([^"]*)"/u)?.[1];
      assert.ok(style, "native paragraph-converted label has an emitted style");
      const whitespace = style.split(";").map(declaration => declaration.trim())
        .filter(declaration => declaration.startsWith("white-space:"))
        .map(declaration => declaration.slice("white-space:".length).trim());
      assert.deepEqual(whitespace, [expectedWhitespace], "native span must retain exactly its own whitespace declaration");
      assert.ok(span.endsWith(">" + text + "</span>"), "literal text bytes survive paragraph conversion");
    }
    assert.equal(spans.length, 2, "both 14px/16px native label styles remain observable after checking whitespace");
    return spans;
  }
  for (const profile of ["default", "altcraft-mobile-base-v1"]) {
    const intrinsic = await task9CenterFixture({ profile, nativeLabel: { text: "2  шаг" } });
    nativeSpans(intrinsic.result, "2  шаг", "pre");
    for (const sizing of ["fixed", "fill"]) {
      const control = await task9CenterFixture({ profile, nativeLabel: { text: "2  шаг", sizing } });
      const spans = nativeSpans(control.result, "2  шаг", "nowrap");
      if (sizing === "fixed") {
        assert.match(spans.find(span => span.includes("font-size:14px")), /(?:^|[";])width:40px(?:;|")/u);
        assert.match(spans.find(span => span.includes("font-size:16px")), /(?:^|[";])width:46px(?:;|")/u);
      }
    }
    const ordinary = await task9CenterFixture({ profile, nativeLabel: { text: "2 шаг" } });
    nativeSpans(ordinary.result, "2 шаг", "nowrap");
  }
});
