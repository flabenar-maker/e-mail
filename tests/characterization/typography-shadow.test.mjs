import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function section(markdown, startHeading, endHeading) {
  const start = markdown.indexOf(startHeading);
  const end = markdown.indexOf(endHeading, start + startHeading.length);
  assert.notEqual(start, -1, `Missing section: ${startHeading}`);
  assert.notEqual(end, -1, `Missing section boundary: ${endHeading}`);
  return markdown.slice(start, end);
}

function tableCells(line) {
  return line
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function stripCode(value) {
  return value.replace(/^`|`$/gu, "");
}

function extractCatalog(markdown) {
  const catalog = section(
    markdown,
    "## Каталог активных стилей",
    "## Семантическое применение",
  );
  return catalog
    .split(/\r?\n/gu)
    .filter((line) => /^\| `(?:Desktop|Mobile)\//u.test(line))
    .map((line) => {
      const [name, familyAndStyle, size, lineHeight, letterSpacing] =
        tableCells(line);
      const [family, figmaStyle] = familyAndStyle.split(/\s+/u);
      const cssWeight = {
        Regular: 400,
        Medium: 500,
        SemiBold: 600,
        Bold: 700,
      }[figmaStyle];
      assert.ok(cssWeight, `Unknown Figma font style: ${figmaStyle}`);
      return {
        figma_name: stripCode(name),
        font: {
          family,
          figma_style: figmaStyle,
          css_weight: cssWeight,
        },
        font_size_px: Number.parseInt(size, 10),
        line_height: {
          unit: "percent",
          value: Number.parseInt(lineHeight, 10),
        },
        letter_spacing: {
          unit: "percent",
          value: Number.parseFloat(letterSpacing),
        },
      };
    })
    .sort((left, right) => left.figma_name.localeCompare(right.figma_name));
}

function extractDescriptions(markdown) {
  const descriptions = section(
    markdown,
    "## Канонические Figma descriptions",
    "## Текущие компоненты-потребители",
  );
  const result = [];
  const pattern = /^### `([^`]+)`\r?\n\r?\n([^\r\n]+)$/gmu;
  for (const match of descriptions.matchAll(pattern)) {
    result.push({ figma_name: match[1], figma_description: match[2] });
  }
  return result.sort((left, right) =>
    left.figma_name.localeCompare(right.figma_name),
  );
}

function extractResponsivePairs(markdown) {
  const pairs = section(
    markdown,
    "## Соответствия Desktop и Mobile",
    "## Канонические Figma descriptions",
  );
  return pairs
    .split(/\r?\n/gu)
    .filter((line) => /^\| [^|-].*`Desktop\//u.test(line))
    .map((line) => {
      const [, desktop, mobile] = tableCells(line);
      return {
        desktop_figma_name: stripCode(desktop),
        mobile_figma_name: stripCode(mobile),
      };
    })
    .sort((left, right) =>
      left.desktop_figma_name.localeCompare(right.desktop_figma_name),
    );
}

function normalizeStructuredStyles(typography) {
  return typography.styles
    .map((style) => ({
      figma_name: style.figma_name,
      font: style.font,
      font_size_px: style.font_size_px,
      line_height: style.line_height,
      letter_spacing: style.letter_spacing,
    }))
    .sort((left, right) => left.figma_name.localeCompare(right.figma_name));
}

function structuredDescriptions(typography) {
  return typography.styles
    .map(({ figma_name, figma_description }) => ({
      figma_name,
      figma_description,
    }))
    .sort((left, right) => left.figma_name.localeCompare(right.figma_name));
}

function normalizeStructuredPairs(typography) {
  const styleById = new Map(
    typography.styles.map((style) => [style.id, style]),
  );
  return typography.responsive_pairs
    .map((pair) => ({
      desktop_figma_name: styleById.get(pair.desktop_style_id).figma_name,
      mobile_figma_name: styleById.get(pair.mobile_style_id).figma_name,
    }))
    .sort((left, right) =>
      left.desktop_figma_name.localeCompare(right.desktop_figma_name),
    );
}

test("structured typography matches the confirmed Markdown shadow baseline", async () => {
  const [typography, markdown] = await Promise.all([
    readStrictYaml(join(repoRoot, "data/foundations/typography.yaml")),
    readFile(join(repoRoot, "registry/email-typography-registry.md"), "utf8"),
  ]);

  assert.equal(typography.styles.length, 15);
  assert.deepEqual(normalizeStructuredStyles(typography), extractCatalog(markdown));
  assert.deepEqual(structuredDescriptions(typography), extractDescriptions(markdown));
  assert.deepEqual(
    normalizeStructuredPairs(typography),
    extractResponsivePairs(markdown),
  );
});
