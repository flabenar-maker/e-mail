import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { indexComponentRegistries, loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { loadRenderingFoundation } from "../../scripts/lib/rendering-foundation.mjs";
import { loadRendererRegistry } from "../../scripts/lib/renderer-registry.mjs";
import { renderComponent } from "../../scripts/lib/email-renderer.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const fixturePath = join(repoRoot, "tests/fixtures/rendering/pilot-email.json");

async function renderPilot(componentId) {
  const [source, registries, rendererRegistry, rendering] = await Promise.all([
    readFile(fixturePath, "utf8"),
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadRenderingFoundation({ repoRoot }),
  ]);
  const model = JSON.parse(source);
  const instance = model.root.slots[0].instances.find((entry) => entry.component_id === componentId);
  assert.ok(instance, "Missing pilot instance: " + componentId);
  const result = renderComponent({
    componentId,
    viewportData: instance,
    rendererRegistry,
    componentIndex: indexComponentRegistries(registries),
    foundations: { rendering },
  });
  assert.deepEqual(result.diagnostics, []);
  return result;
}

function rowPathAt(html, marker, last = false) {
  const position = last ? html.lastIndexOf(marker) : html.indexOf(marker);
  assert.ok(position >= 0, "Missing marker: " + marker);
  const stack = [];
  let nextId = 0;
  for (const match of html.slice(0, position).matchAll(/<\\/?tr\\b[^>]*>/gu)) {
    if (match[0].startsWith("</")) stack.pop();
    else stack.push(++nextId);
  }
  assert.ok(stack.length > 0, "Marker has no table row: " + marker);
  return stack;
}

test("Card/Image Desktop places image and text in one outer row, unlike Mobile", async () => {
  const result = await renderPilot("card-image");
  const image = rowPathAt(result.html, 'src="images/card-image.jpg"', true);
  const heading = rowPathAt(result.html, "Работайте с нами", true);
  assert.equal(image[0], heading[0], "Desktop Card image and text must share the outer row");
  assert.ok(result.html.includes('width="488"'), "Desktop Card width is 488px in Figma node 911:4131");
  assert.match(result.html, /<img[^>]+src="images\\/card-image\\.jpg"[^>]+width="232"[^>]+height="148"/u);
  assert.match(result.html, /<img[^>]+src="images\\/card-image\\.jpg"[^>]+height:auto[^>]+width:100%/u);
});

test("Banner/Secondary Desktop places 300px content beside 252px background image", async () => {
  const result = await renderPilot("banner-secondary");
  const image = rowPathAt(result.html, 'background="images/secondary.jpg"');
  const heading = rowPathAt(result.html, "Всё важное рядом", true);
  assert.equal(image[0], heading[0], "Desktop Secondary content and image must share a row");
  assert.match(result.html, /<table[^>]+width="552"/u);
  assert.match(result.html, /<td[^>]+background="images\\/secondary\\.jpg"[^>]+width="252"/u);
});

test("Banner/App-Download Desktop puts all stores in one row and Mobile stacks them", async () => {
  const result = await renderPilot("banner-app-download");
  const stores = ["rustore", "google-play", "appgallery", "getapps"];
  const desktopRows = stores.map((store) =>
    rowPathAt(result.html, 'href="https://example.test/' + store + '"', true)[0]
  );
  assert.equal(new Set(desktopRows).size, 1, "Desktop store buttons must share one row");
  const mobileRows = stores.map((store) =>
    rowPathAt(result.html, 'href="https://example.test/' + store + '"')[0]
  );
  assert.equal(new Set(mobileRows).size, 4, "Mobile store buttons must remain stacked");
  const logo = rowPathAt(result.html, 'src="images/app-logo.png"', true);
  const qr = rowPathAt(result.html, 'src="images/qr-code.png"', true);
  assert.equal(logo[0], qr[0], "Desktop logo and QR must share the header row");
});