import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  indexComponentRegistries,
  loadComponentRegistries,
} from "../../scripts/lib/component-registry.mjs";
import { loadEmailModel } from "../../scripts/lib/email-model.mjs";
import { buildEmailPreview } from "../../scripts/lib/email-preview.mjs";
import { renderEmailDocument } from "../../scripts/lib/email-renderer.mjs";
import { loadRendererRegistry } from "../../scripts/lib/renderer-registry.mjs";
import { loadRenderingFoundation } from "../../scripts/lib/rendering-foundation.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const NORMAL_WIDTHS = [300, 320, 360, 600, 659, 660];
const NO_STYLE_WIDTHS = [300, 320, 360, 600];

async function renderPilot() {
  const [model, registries, rendererRegistry, rendering] = await Promise.all([
    loadEmailModel({
      modelPath: join(repoRoot, "tests", "fixtures", "rendering", "pilot-email.json"),
      schemaPath: join(repoRoot, "schemas", "email-model.schema.json"),
    }),
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadRenderingFoundation({ repoRoot }),
  ]);
  return renderEmailDocument(model, {
    componentIndex: indexComponentRegistries(registries),
    rendererRegistry,
    foundations: { rendering },
  });
}

function attribute(tag, name) {
  return new RegExp("(?:^|\\s)" + name + "=\"([^\"]*)\"", "u").exec(tag)?.[1];
}

test("visual scenario matrix covers both sides of the exact responsive boundary", () => {
  assert.deepEqual(NORMAL_WIDTHS, [300, 320, 360, 600, 659, 660]);
  assert.deepEqual(NO_STYLE_WIDTHS, [300, 320, 360, 600]);
  assert.deepEqual(
    NORMAL_WIDTHS.map((width) => [width, width <= 659 ? "mobile" : "desktop"]),
    [
      [300, "mobile"],
      [320, "mobile"],
      [360, "mobile"],
      [600, "mobile"],
      [659, "mobile"],
      [660, "desktop"],
    ],
  );
});

test("normal and no-style scenarios preserve safe shell and proportional direct images", async () => {
  const result = await renderPilot();
  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /@media only screen and \(max-width:659px\)/u);
  assert.doesNotMatch(result.html, /@media only screen and \(max-width:(?!659px)[^)]+\)/u);
  assert.match(result.html, /max-width:600px/u);
  assert.match(result.html, /min-width:270px/u);
  assert.match(result.html, /padding:0 15px/u);
  assert.equal(result.metrics.embedded_css_bytes < 16384, true);

  const images = [...result.html.matchAll(/<img\b[^>]*>/gu)].map((match) => match[0]);
  assert.ok(images.length > 0);
  for (const image of images) {
    const style = attribute(image, "style") ?? "";
    if (/(?:^|;)width:100%(?:;|$)/u.test(style)) {
      assert.match(style, /(?:^|;)height:auto(?:;|$)/u);
      assert.equal(attribute(image, "height"), undefined);
    }
  }

  const noStyle = buildEmailPreview({ html: result.html, mode: "no-style" });
  assert.doesNotMatch(noStyle, /<style\b/iu);
  assert.equal(noStyle, result.html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, ""));
  for (const asset of result.assets) {
    assert.match(noStyle, new RegExp(asset.path.replaceAll(".", "\\."), "u"));
  }
});