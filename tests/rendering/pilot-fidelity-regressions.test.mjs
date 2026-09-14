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
    assert.match(span, /max-width:none/u);
  }
});
