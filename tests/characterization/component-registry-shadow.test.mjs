import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const registryPath = join(
  repoRoot,
  "registry/email-component-descriptions-registry.md",
);

const sectionSpecs = [
  {
    key: "marketing",
    heading: "## Маркетинговые письма (26)",
    nextHeading: "## Шаблоны сборки (1)",
    declaredCount: 26,
  },
  {
    key: "template",
    heading: "## Шаблоны сборки (1)",
    nextHeading: "## Сервисные письма (18)",
    declaredCount: 1,
  },
  {
    key: "service",
    heading: "## Сервисные письма (18)",
    nextHeading: "## Shared (16)",
    declaredCount: 18,
  },
  {
    key: "shared",
    heading: "## Shared (16)",
    nextHeading: null,
    declaredCount: 16,
  },
];

const expectedIconGlyphs = [
  { id: "icon-bank-card-2-line", figmaName: "Icon/Bank-Card-2-Line", nodeId: "1009:2505" },
  { id: "icon-fingerprint-2-line", figmaName: "Icon/Fingerprint-2-Line", nodeId: "491:22370" },
  { id: "icon-gift-2-line", figmaName: "Icon/Gift-2-Line", nodeId: "946:25576" },
  { id: "icon-global-line", figmaName: "Icon/Global-Line", nodeId: "1009:2506" },
  { id: "icon-lock-password-fill", figmaName: "Icon/Lock-Password-Fill", nodeId: "491:22369" },
  { id: "icon-mail-fill", figmaName: "Icon/Mail-Fill", nodeId: "491:22372" },
  { id: "icon-mir-logo", figmaName: "Icon/MIR-Logo", nodeId: "946:25485" },
  { id: "icon-receipt-fill", figmaName: "Icon/Receipt-Fill", nodeId: "491:22374" },
  { id: "icon-shopping-basket-2-line", figmaName: "Icon/Shopping-Basket-2-Line", nodeId: "946:25480" },
  { id: "icon-smartphone-fill", figmaName: "Icon/Smartphone-Fill", nodeId: "491:22371" },
  { id: "icon-user-follow-fill", figmaName: "Icon/User-Follow-Fill", nodeId: "491:22375" },
  { id: "icon-user-forbid-fill", figmaName: "Icon/User-Forbid-Fill", nodeId: "491:22373" },
  { id: "icon-user-unfollow-fill", figmaName: "Icon/User-Unfollow-Fill", nodeId: "491:22376" },
];

function normalizeLf(value) {
  return value.replace(/\r\n/gu, "\n");
}

function section(markdown, { heading, nextHeading }) {
  const start = markdown.indexOf(heading);
  assert.notEqual(start, -1, `Missing registry section: ${heading}`);
  const end = nextHeading
    ? markdown.indexOf(nextHeading, start + heading.length)
    : markdown.length;
  assert.notEqual(end, -1, `Missing section boundary: ${nextHeading}`);
  return markdown.slice(start, end);
}

function parseDefault(value) {
  if (value === undefined) {
    return null;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return value;
}

function parseVariants(block) {
  const body =
    block.match(
      /^- Варианты \(\d+\):\n\n([\s\S]*?)(?=\n- Component properties:|\nОписание:)/mu,
    )?.[1] ?? "";
  return [...body.matchAll(/^  - `([^`]+)` — `([^`]+)`$/gmu)].map(
    (match) => ({
      name: match[1],
      nodeId: match[2],
    }),
  );
}

function parseProperties(block) {
  const body =
    block.match(
      /^- Component properties:\n\n([\s\S]*?)(?=\nОписание:)/mu,
    )?.[1] ?? "";
  return [
    ...body.matchAll(
      /^  - `([^`]+)` — `([^`]+)`(?:, default: ([^\n]+))?$/gmu,
    ),
  ].map((match) => ({
    figmaName: match[1],
    type: match[2].toLowerCase().replace("_", "-"),
    defaultValue: parseDefault(match[3]),
  }));
}

function parseEntries(markdown, spec) {
  const body = section(markdown, spec) + "\n## END";
  const entries = [];
  const pattern = /^### `([^`]+)`\n([\s\S]*?)(?=^### `|^## )/gmu;
  for (const match of body.matchAll(pattern)) {
    const block = match[2];
    const nodeId = block.match(/^- Figma node: `([^`]+)`$/mu)?.[1];
    const nodeKind = block.match(/^- Тип: `([^`]+)`$/mu)?.[1];
    const description = block.match(
      /Описание:\n\n````text\n([\s\S]*?)\n````/mu,
    )?.[1];
    assert.ok(nodeId, `Missing Figma node for ${match[1]}`);
    assert.ok(nodeKind, `Missing Figma type for ${match[1]}`);
    assert.notEqual(description, undefined, `Missing Description for ${match[1]}`);
    entries.push({
      section: spec.key,
      figmaName: match[1],
      nodeId,
      nodeKind: nodeKind.toLowerCase().replace("_", "-"),
      variants: parseVariants(block),
      properties: parseProperties(block),
      description: normalizeLf(description),
    });
  }
  return entries;
}

function variantName(variant) {
  return variant.axes.map(({ name, value }) => `${name}=${value}`).join(", ");
}

function normalizeStructuredVariants(record) {
  return record.variants.map((variant) => ({
    name: variantName(variant),
    nodeId: variant.node_id,
  }));
}

function normalizeStructuredProperties(record) {
  return record.properties.map((property) => ({
    figmaName: property.figma_name,
    type: property.type,
    defaultValue: property.default ?? null,
  }));
}

function recordsByLibrary(registries) {
  return {
    marketing: registries.marketing.components,
    service: registries.service.components,
    shared: registries.shared.components,
  };
}

test("Markdown component registry exposes the frozen 26 + 18 + 16 + 1 baseline", async () => {
  const markdown = normalizeLf(await readFile(registryPath, "utf8"));
  const parsed = Object.fromEntries(
    sectionSpecs.map((spec) => [spec.key, parseEntries(markdown, spec)]),
  );

  assert.equal(parsed.marketing.length, 26);
  assert.equal(parsed.service.length, 18);
  assert.equal(parsed.template.length, 1);
  assert.equal(parsed.shared.length, 3);
  assert.equal(
    Object.values(parsed).flat().length,
    48,
    "Exactly 48 records have canonical Description blocks.",
  );

  for (const spec of sectionSpecs) {
    assert.match(
      section(markdown, spec).split("\n", 1)[0],
      new RegExp(`\\(${spec.declaredCount}\\)$`, "u"),
    );
  }
  assert.match(
    section(markdown, sectionSpecs.at(-1)),
    /^### Иконки \(13\)$/mu,
  );
});

test("structured component registries preserve the frozen Markdown shadow exactly", async () => {
  const [
    markdown,
    { loadComponentRegistries, indexComponentRegistries },
    { renderComponentDescription },
  ] = await Promise.all([
    readFile(registryPath, "utf8"),
    import("../../scripts/lib/component-registry.mjs"),
    import("../../scripts/lib/component-description.mjs"),
  ]);

  const baseline = sectionSpecs.flatMap((spec) =>
    parseEntries(normalizeLf(markdown), spec),
  );
  const registries = await loadComponentRegistries({ repoRoot });
  const grouped = recordsByLibrary(registries);
  const index = indexComponentRegistries(registries);
  const allRecords = Object.values(grouped).flat();
  const byFigmaName = new Map(
    allRecords.map((record) => [record.identity.figma_name, record]),
  );

  assert.deepEqual(
    {
      marketing: grouped.marketing.length,
      service: grouped.service.length,
      shared: grouped.shared.length,
      total: allRecords.length,
    },
    { marketing: 26, service: 18, shared: 17, total: 61 },
  );

  for (const expected of baseline) {
    const record = byFigmaName.get(expected.figmaName);
    assert.ok(record, `Missing structured record: ${expected.figmaName}`);
    assert.equal(record.figma.node_id, expected.nodeId);
    assert.equal(record.identity.node_kind, expected.nodeKind);
    assert.deepEqual(normalizeStructuredVariants(record), expected.variants);
    assert.deepEqual(normalizeStructuredProperties(record), expected.properties);
    assert.equal(record.description.mode, "rendered");
    assert.equal(
      normalizeLf(renderComponentDescription(record, index)),
      expected.description,
      `Rendered Description drift: ${expected.figmaName}`,
    );
  }

  const renderedRecords = allRecords.filter(
    (record) => record.description.mode === "rendered",
  );
  assert.equal(renderedRecords.length, 48);

  for (const expected of expectedIconGlyphs) {
    const record = index.bySystemId.get(expected.id);
    assert.ok(record, `Missing Shared icon source: ${expected.id}`);
    assert.equal(record.identity.figma_name, expected.figmaName);
    assert.equal(record.identity.node_kind, "component");
    assert.equal(record.figma.node_id, expected.nodeId);
    assert.equal(record.description.mode, "none");
    assert.equal(record.contracts.mobile.root.render_mode, "figma-source-only");
    assert.equal(record.contracts.desktop.root.render_mode, "figma-source-only");
  }

  assert.equal(
    grouped.shared.filter((record) => record.description.mode === "none").length,
    13,
  );
});
