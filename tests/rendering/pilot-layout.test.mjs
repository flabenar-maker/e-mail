import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { indexComponentRegistries, loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { loadRenderingFoundation } from "../../scripts/lib/rendering-foundation.mjs";
import { loadRendererRegistry } from "../../scripts/lib/renderer-registry.mjs";
import { renderComponent, renderEmailDocument } from "../../scripts/lib/email-renderer.mjs";

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
  for (const match of html.slice(0, position).matchAll(/<\/?tr\b[^>]*>/gu)) {
    if (match[0].startsWith("</")) stack.pop();
    else stack.push(++nextId);
  }
  assert.ok(stack.length > 0, "Marker has no table row: " + marker);
  return stack;
}

test("Banner/Secondary Desktop places 300px content beside 252px background image", async () => {
  const result = await renderPilot("banner-secondary");
  const image = rowPathAt(result.html, 'background="images/secondary.jpg"');
  const heading = rowPathAt(result.html, "Небольшой заголовок", true);
  assert.equal(image[0], heading[0], "Desktop Secondary content and image must share a row");
  assert.doesNotMatch(result.html, /<td[^>]+background="images\/secondary\.jpg"[^>]+height="238"/u);
  assert.match(result.html, /<td[^>]+background="images\/secondary\.jpg"[^>]+width="252"/u);
});

test("Banner/App-Download Desktop puts all stores in one row and Mobile stacks them", async () => {
  const result = await renderPilot("banner-app-download");
  const stores = ["rustore", "google-play", "appgallery", "getapps"];
  const desktopRows = stores.map((store) =>
    rowPathAt(result.html, 'href="https://example.test/' + store + '"', true)
  );
  assert.equal(new Set(desktopRows.map((row) => row.at(-4))).size, 1, "Desktop store buttons must share one row");
  const mobileRows = stores.map((store) =>
    rowPathAt(result.html, 'href="https://example.test/' + store + '"').at(-1)
  );
  assert.equal(new Set(mobileRows).size, 4, "Mobile store buttons must remain stacked");
  assert.match(result.html, /<td[^>]+height="8"[^>]+font-size:0;[^"]*line-height:0[^>]*>&nbsp;<\/td>/u, "8px Mobile gaps must not expand to text line-height");
  const logo = rowPathAt(result.html, 'src="images/app-logo.png"', true);
  const qr = rowPathAt(result.html, 'src="images/qr-code.png"', true);
  assert.ok(logo.includes(qr.at(-1)), "Desktop logo and QR must share the header row");
});
test("pilot shell uses 270px inner minimum width for the 300px supported viewport", async () => {
  const [source, registries, rendererRegistry, rendering] = await Promise.all([
    readFile(fixturePath, "utf8"),
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadRenderingFoundation({ repoRoot }),
  ]);
  const result = renderEmailDocument(JSON.parse(source), {
    componentIndex: indexComponentRegistries(registries),
    rendererRegistry,
    foundations: { rendering },
  });

  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /min-width:270px/u);
  assert.doesNotMatch(result.html, /min-width:300px/u);
});

test("pilot renderer blocks an impossible minimum viewport instead of clamping", async () => {
  const [source, registries, rendererRegistry, rendering] = await Promise.all([
    readFile(fixturePath, "utf8"),
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadRenderingFoundation({ repoRoot }),
  ]);
  rendering.shell.min_supported_viewport_px = 30;
  const result = renderEmailDocument(JSON.parse(source), {
    componentIndex: indexComponentRegistries(registries),
    rendererRegistry,
    foundations: { rendering },
  });

  assert.equal(result.html, "");
  assert.ok(
    result.diagnostics.some(
      ({ code, path }) =>
        code === "RENDERING_SHELL_VIEWPORT_IMPOSSIBLE" &&
        path === "/shell/min_supported_viewport_px",
    ),
  );
});