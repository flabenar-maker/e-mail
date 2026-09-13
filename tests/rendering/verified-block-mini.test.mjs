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
    if (element.content_slots?.some((slot) => slot.id === "text")) {
      const entry = { text: sourceText(element) };
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
  assert.ok(!/<table[^>]*height="(?:\d+)"/u.test(output.html), "Block height must grow with reflow");
  const missing = contentFor(component);
  delete missing.mobile["root-content-area-help-notice-help-text"]["help-url"];
  assert.ok(render(component, missing).diagnostics.some((d) => d.code === "RENDER_CONTENT_MISSING"));
});

test("Figma-verified Card/Image @2x keeps mobile fluid ratio and desktop exact dimensions", async () => {
  const component = await record("marketing", "card-image");
  const content = contentFor(component);
  for (const viewport of ["mobile", "desktop"]) {
    content[viewport]["root-text-content-link"].href = "https://example.invalid/card";
  }
  const output = renderContractTree({
    component,
    coverage: { component_id: component.id, mode: "interpreter" },
    content,
    assets: { "card-image": { src: svg } },
    foundations,
  });
  assert.deepEqual(output.diagnostics, []);
  assert.match(output.html, /<img[^>]*width="252"[^>]*height="161"[^>]*style="[^"]*height:auto[^"]*width:100%/u);
  assert.match(output.html, /<img[^>]*width="232"[^>]*height="148"[^>]*style="[^"]*height:148px[^"]*width:232px/u);
  assert.doesNotMatch(output.html, /width="252"[^>]*style="[^"]*height:161px/u);
});