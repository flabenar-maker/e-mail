import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadComponentRegistries, walkComponentElements } from "../../scripts/lib/component-registry.mjs";
import { loadRendererRegistry, resolveRendererCoverage } from "../../scripts/lib/renderer-registry.mjs";
import { renderContractTree } from "../../scripts/lib/email-interpreter.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function component(id) {
  const registries = await loadComponentRegistries({ repoRoot });
  for (const document of Object.values(registries)) {
    const record = document.components.find((item) => item.id === id);
    if (record) return record;
  }
  throw new Error("missing component " + id);
}

function element(record, id, viewport) {
  let found;
  walkComponentElements(record, ({ element: candidate, viewport: candidateViewport }) => {
    if (candidateViewport === viewport && candidate.id === id) found = candidate;
  });
  assert.ok(found, record.id + " " + viewport + " missing " + id);
  return found;
}

function fact(subject, id) {
  const found = subject.facts?.find((item) => item.id === id);
  assert.ok(found, subject.id + " missing fact " + id);
  return found.value;
}

async function html(id) {
  const [record, registry] = await Promise.all([
    component(id),
    loadRendererRegistry({ repoRoot }),
  ]);
  const result = renderContractTree({ record, component: record, coverage: resolveRendererCoverage(registry, id) });
  assert.deepEqual(result.diagnostics, []);
  return result.html;
}

test("Item/Bullet preserves the 8px green Figma ellipse as a painted dot", async () => {
  const record = await component("item-bullet");
  for (const viewport of ["mobile", "desktop"]) {
    const dot = element(record, "root-bullet-indicator-bullet-dot", viewport);
    assert.deepEqual(fact(dot, "reference-size"), { type: "dimensions", width: 8, height: 8, unit: "px" });
    assert.deepEqual(fact(dot, "background"), { type: "color", value: "#18B037" });
    assert.deepEqual(fact(dot, "shape"), { type: "keyword", value: "ellipse" });
  }
  const output = await html("item-bullet");
  assert.match(output, /background-color:#18B037/u);
  assert.match(output, /width:8px/u);
  assert.match(output, /height:8px/u);
  assert.match(output, /border-radius:50%/u);
});

test("real NPS and App actions carry their Figma corner radius to the painted table", async () => {
  const nps = await component("nps-options");
  const app = await component("banner-app-download");
  assert.deepEqual(fact(element(nps, "root-content-area-emoji-buttons-good", "mobile"), "corner-radius"), { type: "measure", value: 32, unit: "px" });
  assert.deepEqual(fact(element(app, "root-content-area-store-buttons-rustore-button", "mobile"), "corner-radius"), { type: "measure", value: 24, unit: "px" });
  assert.deepEqual(fact(element(app, "root-content-area-store-buttons-rustore-button", "desktop"), "corner-radius"), { type: "measure", value: 50, unit: "px" });
  for (const id of ["nps-options", "banner-app-download"]) {
    const output = await html(id);
    assert.match(output, /border-radius:(?:24|32|50)px/u, id + " must paint a rounded table");
    assert.match(output, /overflow:hidden/u, id + " must clip the painted table to its radius");
  }
});

test("Hero desktop centers its hug button with an explicit table alignment", async () => {
  const hero = await component("banner-hero");
  const button = element(hero, "root-card-content-area-button", "desktop");
  assert.deepEqual(fact(button, "horizontal-sizing"), { type: "keyword", value: "hug" });
  assert.deepEqual(fact(button, "primary-alignment"), { type: "keyword", value: "center" });
  const output = await html("banner-hero");
  assert.match(output, /align="center"/u);
});

test("Mobile Icon-Cards hug root remains fluid in the email shell", async () => {
  const cards = await component("block-icon-cards");
  assert.deepEqual(fact(element(cards, "root", "mobile"), "horizontal-sizing"), { type: "keyword", value: "hug" });
  const output = await html("block-icon-cards");
  assert.match(output, /width="100%"[^>]*style="[^"]*width:100%/u);
});

test("Transaction Success puts the desktop status at the top of its 72px row and centers mobile status", async () => {
  const transaction = await component("block-transaction-success");
  const statusDesktop = element(transaction, "root-card-content-area-status-container", "desktop");
  const statusMobile = element(transaction, "root-card-content-area-status-container", "mobile");
  assert.deepEqual(fact(statusDesktop, "counter-alignment"), { type: "keyword", value: "min" });
  assert.deepEqual(fact(statusMobile, "counter-alignment"), { type: "keyword", value: "center" });
  const output = await html("block-transaction-success");
  assert.match(output, /valign="top"/u);
  assert.match(output, /align="center"/u);
});

test("Mobile Secondary CTA keeps its auto-width label on one line", async () => {
  const secondary = await component("button-secondary");
  const label = element(secondary, "root-button-text", "mobile");
  assert.deepEqual(fact(label, "horizontal-sizing"), { type: "keyword", value: "hug" });
  assert.deepEqual(fact(label, "layout-wrap"), { type: "keyword", value: "no_wrap" });
  const output = await html("button-secondary");
  assert.match(output, /white-space:nowrap/u);
  assert.doesNotMatch(output, /max-width:110px/u);
});