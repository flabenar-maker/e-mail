import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { loadRendererRegistry, resolveRendererCoverage } from "../../scripts/lib/renderer-registry.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import { renderContractTree } from "../../scripts/lib/email-interpreter.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const content = {
  "root-content-area-heading": { text: "Понравилось это письмо?" },
  "root-content-area-emoji-buttons-good": { href: "https://example.test/nps/good" },
  "root-content-area-emoji-buttons-neutral": { href: "https://example.test/nps/neutral" },
  "root-content-area-emoji-buttons-bad": { href: "https://example.test/nps/bad" },
  "root-content-area-emoji-buttons-good-happy-face-icon": { alt: "Хорошо" },
  "root-content-area-emoji-buttons-neutral-neutral-face-icon": { alt: "Нейтрально" },
  "root-content-area-emoji-buttons-bad-sad-face-icon": { alt: "Плохо" },
};
const assets = {
  "happy-face-icon": { src: "images/happy-face-icon.png" },
  "neutral-face-icon": { src: "images/neutral-face-icon.png" },
  "sad-face-icon": { src: "images/sad-face-icon.png" },
};

for (const count of [2, 3]) {
  test(`NPS/Options Desktop Count=${count} has rounded controls without square painted cells`, async () => {
    const registries = await loadComponentRegistries({ repoRoot });
    const component = registries.marketing.components.find(({ id }) => id === "nps-options");
    assert.ok(component);
    const coverage = resolveRendererCoverage(
      await loadRendererRegistry({ repoRoot }),
      component.id,
    );
    const foundations = {
      rendering: await readStrictYaml(join(repoRoot, "data/foundations/rendering.yaml")),
    };
    const result = renderContractTree({
      component,
      coverage,
      content,
      assets,
      variantAxes: { Count: String(count) },
      foundations,
    });

    assert.deepEqual(result.diagnostics, []);
    const desktop = result.html.match(/<div class="cupis-root-desktop">([\s\S]*?)<\/div>/u)?.[1];
    assert.ok(desktop, "desktop NPS variant must be rendered");
    const roundedButtons = [...desktop.matchAll(/<table\b[^>]*>/gu)]
      .map(([tag]) => tag)
      .filter((tag) => tag.includes("background-color:#F8F8FA") &&
        tag.includes("border-radius:32px"));
    assert.equal(roundedButtons.length, count);

    const squarePaintedCells = [...desktop.matchAll(/<td\b[^>]*>/gu)]
      .map(([tag]) => tag)
      .filter((tag) => tag.includes('bgcolor="#F8F8FA"') ||
        tag.includes("background-color:#F8F8FA"));
    assert.deepEqual(squarePaintedCells, []);
  });
}