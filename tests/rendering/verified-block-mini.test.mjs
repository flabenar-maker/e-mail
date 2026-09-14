import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { renderContractTree } from "../../scripts/lib/email-interpreter.mjs";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const svg = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='26'%20height='26'%3E%3Crect%20fill='%2300991F'%20width='26'%20height='26'/%3E%3C/svg%3E";
const foundations = { rendering: { breakpoints: [{ id: "cupis-mobile", query: "max-width", value: 660, unit: "px" }] } };

async function record(library, componentId) {
  const document = JSON.parse(await readFile(join(root, "data/components", library + ".yaml"), "utf8"));
  return document.components.find((component) => component.id === componentId);
}

function sourceText(element) {
  return element.facts.find((fact) => fact.id === "source-text")?.value?.value;
}

function contentFor(component) {
  const content = { mobile: {}, desktop: {} };
  function walk(element, viewport) {
    if (element.content_slots?.some((slot) => slot.id === "text" || slot.id === "alt")) {
      const entry = { text: sourceText(element) };
      if (element.content_slots?.some((slot) => slot.id === "alt")) entry.alt = "Alert icon";
      if (element.id.endsWith("phone-number")) entry.href = "tel:+74951222088";
      if (element.id.endsWith("help-text")) entry["help-url"] = "https://example.invalid/help";
      content[viewport][element.id] = entry;
    }
    element.children.forEach((child) => walk(child, viewport));
  }
  for (const viewport of ["mobile", "desktop"]) walk(component.contracts[viewport].root, viewport);
  return content;
}

function render(component, content = contentFor(component)) {
  return renderContractTree({
    component, coverage: { component_id: component.id, mode: "interpreter" },
    content, assets: { "alert-icon": { src: svg } }, foundations,
  });
}

function allFacts(element) {
  return [...element.facts, ...element.children.flatMap(allFacts)];
}

test("Figma-verified Block/Info-Alert fully renders Mobile and Desktop from contracts", async () => {
  const component = await record("marketing", "block-info-alert");
  const output = render(component);
  assert.deepEqual(output.diagnostics, []);
  assert.match(output.css, /max-width:660px/u);
  assert.match(output.html, /width="600"/u);
  assert.match(output.html, /padding-left:16px/u);
  assert.match(output.html, /padding-left:24px/u);
  assert.match(output.html, /border-radius:22px/u);
  assert.match(output.html, /border-radius:26px/u);
  assert.match(output.html, /font-size:14px/u);
  assert.match(output.html, /font-size:18px/u);
  assert.match(output.html, /line-height:140%/u);
  assert.match(output.html, /<td width="228"[^>]*style="[^"]*width:228px[^"]*"[^>]*><p[^>]*>Небольшой текст с пояснением чего-либо<\/p>/u);
  assert.match(output.html, /<img[^>]*width="24"[^>]*height="24"/u);
  assert.match(output.html, /<img[^>]*width="26"[^>]*height="26"/u);
  assert.equal((output.html.match(/Небольшой текст с пояснением чего-либо/gu) ?? []).length, 2);
  assert.ok(!/<table[^>]*height="(?:\\d+)"/u.test(output.html), "Block height must grow with reflow");
  for (const viewport of ["mobile", "desktop"]) {
    assert.ok(allFacts(component.contracts[viewport].root).every((fact) =>
      fact.provenance?.kind === "figma-literal"), "No legacy Markdown values in pilot");
  }
});

test("Figma-verified Block/Contact-Support preserves both inline links and rich text", async () => {
  const component = await record("service", "block-contact-support");
  const output = render(component);
  assert.deepEqual(output.diagnostics, []);
  assert.match(output.html, /href="tel:\+74951222088"/u);
  assert.match(output.html, /href="https:\/\/example.invalid\/help"/u);
  assert.equal((output.html.match(/href="tel:\+74951222088"/gu) ?? []).length, 2);
  assert.equal((output.html.match(/href="https:\/\/example.invalid\/help"/gu) ?? []).length, 2);
  assert.match(output.html, /border-radius:14px/u);
  assert.match(output.html, /border-radius:18px/u);
  assert.match(output.html, /background-color:#F8F8FA/u);
  assert.match(output.html, /font-size:12px/u);
  assert.match(output.html, /font-size:16px/u);
  assert.match(output.html, /text-decoration:underline/u);
  assert.match(output.html, /<td width="220"[^>]*style="[^"]*width:220px[^"]*"[^>]*><p[^>]*>/u);
  assert.ok(!/<table[^>]*height="(?:\d+)"/u.test(output.html), "Block height must grow with reflow");
  const missing = contentFor(component);
  delete missing.mobile["root-content-area-help-notice-help-text"]["help-url"];
  assert.ok(render(component, missing).diagnostics.some((d) => d.code === "RENDER_CONTENT_MISSING"));
});

test("Figma-verified Block/Contact-Support centers each phone link in its enclosing cell", async () => {
  const component = await record("service", "block-contact-support");
  const output = render(component);
  const phoneCells = [...output.html.matchAll(/<td\b[^>]*style="[^"]*text-align:center[^"]*"[^>]*><a href="tel:\+74951222088"/gu)];
  assert.equal(phoneCells.length, 2);
});
test("Figma-verified Card/Image @2x keeps mobile fluid ratio and desktop exact dimensions", async () => {
  const component = await record("marketing", "card-image");
  const content = contentFor(component);
  for (const viewport of ["mobile", "desktop"]) {
    content[viewport]["root-card-image"] = { alt: "Команда CUPIS" };
  }
  for (const viewport of ["mobile", "desktop"]) {
    content[viewport]["root-text-content-link"].href = "https://example.invalid/card";
  }
  const output = renderContractTree({
    component,
    coverage: { component_id: component.id, mode: "interpreter" },
    content,
    assets: { "card-image": { src: svg, width: 504, height: 322 } },
    foundations,
  });
  assert.deepEqual(output.diagnostics, []);
  const mobileImage = component.contracts.mobile.root.children[0];
  const desktopImage = component.contracts.desktop.root.children[0];
  assert.deepEqual(mobileImage.facts.find(({ id }) => id === "reference-size").value, { type: "dimensions", width: 252, height: 161, unit: "px" });
  assert.deepEqual(desktopImage.facts.find(({ id }) => id === "reference-size").value, { type: "dimensions", width: 232, height: 148, unit: "px" });
  assert.match(output.html, /<img[^>]*width="252"[^>]*style="[^"]*height:auto[^"]*width:100%/u);
  assert.match(output.html, /<img[^>]*width="232"[^>]*style="[^"]*height:auto[^"]*width:100%/u);
  assert.doesNotMatch(output.html, /width="252"[^>]*style="[^"]*height:161px/u);
  function rowPathAt(marker) {
    const position = output.html.lastIndexOf(marker);
    assert.ok(position >= 0, "Missing marker: " + marker);
    const rows = []; let nextId = 0;
    for (const match of output.html.slice(0, position).matchAll(/<\/?tr\b[^>]*>/gu)) {
      if (match[0].startsWith("</")) rows.pop(); else rows.push(++nextId);
    }
    return rows;
  }
  const imageRow = rowPathAt('src="data:image/svg+xml');
  const headingRow = rowPathAt("Небольшой заголовок");
  assert.equal(imageRow[0], headingRow[0], "Desktop Card image and text must share the outer row");
  assert.match(output.html, /width="488"/u);
  assert.match(output.html, /<img[^>]*width="232"[^>]*height="148"/u);
  assert.doesNotMatch(output.html, /<img[^>]*height="322"/u);
});
test("Figma-verified Block/Receipt-Info preserves exact paired corner radii", async () => {
  const component = await record("service", "block-receipt-info");
  const output = render(component);
  assert.match(output.html, /border-top-left-radius:22px/u);
  assert.match(output.html, /border-top-right-radius:22px/u);
  assert.match(output.html, /border-bottom-left-radius:22px/u);
  assert.match(output.html, /border-bottom-right-radius:22px/u);
  assert.match(output.html, /border-top-left-radius:26px/u);
  assert.match(output.html, /border-top-right-radius:26px/u);
  assert.match(output.html, /border-bottom-left-radius:26px/u);
  assert.match(output.html, /border-bottom-right-radius:26px/u);
});
function withHref(component) {
  const content = contentFor(component);
  function walk(element, viewport) {
    const entry = (content[viewport][element.id] ??= {});
    for (const slot of element.content_slots ?? []) {
      if (!slot.required) continue;
      if (slot.id === "href") entry.href ??= "https://example.invalid/action";
      else if (slot.id === "alt") entry.alt ??= "Store icon";
      else if (slot.id === "text") entry.text ??= sourceText(element) ?? "Store";
    }
    for (const child of element.children ?? []) walk(child, viewport);
  }
  for (const viewport of ["mobile", "desktop"]) walk(component.contracts[viewport].root, viewport);
  return content;
}

test("Figma-verified Details/Transfer Desktop retains 200px label and 288px right value columns", async () => {
  const component = await record("service", "details-transfer");
  const output = render(component, withHref(component));
  assert.match(output.html, /<td width="200"[^>]*style="[^"]*width:200px/u);
  assert.match(output.html, /<td width="288"[^>]*style="[^"]*width:288px[^>]*>.*<p style="[^"]*text-align:right/u);
  assert.match(output.css, /max-width:660px/u);
});

test("Figma-verified Banner/App-Download mobile action is full-width with one centered anchor group", async () => {
  const component = await record("marketing", "banner-app-download");
  const content = withHref(component);
  for (const viewport of ["mobile", "desktop"]) {
    for (const element of [component.contracts[viewport].root, ...component.contracts[viewport].root.children]) {
      if (element.action?.href_slot) (content[viewport][element.id] ??= {})[element.action.href_slot] = "https://example.invalid/action";
    }
  }
  const assets = Object.fromEntries((component.asset_contracts ?? []).map(({ id }) => [id, { src: svg }]));
  const output = renderContractTree({ component, coverage: { component_id: component.id, mode: "interpreter" }, content, assets, foundations });
  assert.deepEqual(output.diagnostics, []);
  assert.equal(component.contracts.mobile.root.children.flatMap((node) => node.children ?? []).flatMap((node) => node.children ?? []).some((node) => node.facts?.some(({ id, value }) => id === "reference-size" && value.width === 252)), true);
  assert.match(output.html, /style="[^"]*width:100%/u);
  assert.match(output.html, /text-align:center/u);
  assert.equal((output.html.match(/<a href="https:\/\/example\.invalid\/action"/gu) ?? []).length, 8);
});