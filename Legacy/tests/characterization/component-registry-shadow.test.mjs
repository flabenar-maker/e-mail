import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

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

const expectedMarketingIds = new Map([
  ["Badge/Step-Number", "badge-step-number"],
  ["Email/Header", "email-header"],
  ["Block/Cards-Images", "block-cards-images"],
  ["Block/Icon-Cards", "block-icon-cards"],
  ["Email/Footer", "email-footer"],
  ["Banner/Hero", "banner-hero"],
  ["Block/Steps", "block-steps"],
  ["Button/Secondary", "button-secondary"],
  ["Button/Primary", "button-primary"],
  ["Block/Content", "block-content"],
  ["Banner/Secondary", "banner-secondary"],
  ["Block/Bullet-List", "block-bullet-list"],
  ["Item/Bullet", "item-bullet"],
  ["Item/Step", "item-step"],
  ["Banner/Inline", "banner-inline"],
  ["Block/Info-Alert", "block-info-alert"],
  ["Banner/App-Download", "banner-app-download"],
  ["Email/Footer-Legal", "email-footer-legal"],
  ["Asset/Card-Image @2x", "asset-card-image-2x"],
  ["Card/Image", "card-image"],
  ["Block/Icon-List", "block-icon-list"],
  ["Card/Icon", "card-icon"],
  ["Asset/Feature-Icon @4x", "asset-feature-icon-4x"],
  ["Item/Alert", "item-alert"],
  ["Item/Notification", "item-notification"],
  ["NPS/Options", "nps-options"],
]);

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
      description: `${normalizeLf(description)}\n`,
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

test("structured registries preserve the frozen Markdown identity shadow", async () => {
  const [markdown, { loadComponentRegistries, indexComponentRegistries, deriveComponentRenderType }] =
    await Promise.all([
      readFile(registryPath, "utf8"),
      import("../../scripts/lib/component-registry.mjs"),
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
    if (expected.section === "marketing") {
      assert.equal(record.id, expectedMarketingIds.get(expected.figmaName));
    }
    assert.equal(record.figma.node_id, expected.nodeId);
    assert.equal(record.identity.node_kind, expected.nodeKind);
    assert.deepEqual(normalizeStructuredVariants(record), expected.variants);
    assert.deepEqual(normalizeStructuredProperties(record), expected.properties);
    assert.ok(record.documentation.purpose.trim().length > 0);
    assert.equal(Object.hasOwn(record, "description"), false);
    assert.ok(["HTML", "ASSET", "HYBRID"].includes(deriveComponentRenderType(record)));
  }

  for (const expected of expectedIconGlyphs) {
    const record = index.bySystemId.get(expected.id);
    assert.ok(record, `Missing Shared icon source: ${expected.id}`);
    assert.equal(record.identity.figma_name, expected.figmaName);
    assert.equal(record.identity.node_kind, "component");
    assert.equal(record.figma.node_id, expected.nodeId);
    assert.equal(record.contracts.mobile.root.render_mode, "figma-source-only");
    assert.equal(record.contracts.desktop.root.render_mode, "figma-source-only");
    assert.equal(deriveComponentRenderType(record), "ASSET");
  }
});

test("component registries stay isolated from foundations, skills and bundles", async () => {
  assert.deepEqual(
    (await readdir(join(repoRoot, "data/components"))).sort(),
    ["marketing.yaml", "service.yaml", "shared.yaml"],
  );

  for (const relativePath of [
    "data/foundations/typography.yaml",
    "data/foundations/spacing.yaml",
    "data/foundations/assets.yaml",
    "data/foundations/figma-naming.yaml",
  ]) {
    const foundation = await readStrictYaml(join(repoRoot, relativePath));
    assert.equal(Object.hasOwn(foundation, "components"), false);
    assert.equal(Object.hasOwn(foundation, "component_registry"), false);
  }

  const skill = await readFile(
    join(repoRoot, ".agents/skills/maintaining-cupis-email-system/SKILL.md"),
    "utf8",
  );
  assert.doesNotMatch(skill, /^\s*(?:node_id|figma_file_key|components|styles|roles):/gmu);

  const manifest = await readStrictYaml(join(repoRoot, "system/manifest.yaml"));
  const componentSourceIds = new Set([
    "components-shared",
    "components-marketing",
    "components-service",
    "components-schema",
  ]);
  for (const profile of manifest.bundle_profiles) {
    assert.equal(
      profile.source_ids.some((sourceId) => componentSourceIds.has(sourceId)),
      false,
    );
  }
});

test("component migration commits no Figma client, snapshots or concrete emails", async () => {
  const sources = await Promise.all([
    readFile(join(repoRoot, "scripts/lib/figma-component-snapshot.mjs"), "utf8"),
    readFile(join(repoRoot, "scripts/normalize-figma-snapshot.mjs"), "utf8"),
    readFile(join(repoRoot, "scripts/compare-figma-registry.mjs"), "utf8"),
    readFile(join(repoRoot, "scripts/lib/component-registry.mjs"), "utf8"),
  ]);
  for (const source of sources) {
    assert.doesNotMatch(source, /@figma|use_figma|\bfetch\s*\(/u);
  }

  const dataFiles = await readdir(join(repoRoot, "data"), { recursive: true });
  assert.equal(
    dataFiles.some((path) => /(?:^|[\\/])snapshot[^\\/]*\.json$/u.test(path)),
    false,
  );
  await assert.rejects(access(join(repoRoot, "email.html")));
  await assert.rejects(access(join(repoRoot, "images")));
});

test("README explains the component registry shadow boundary", async () => {
  const readme = await readFile(join(repoRoot, "README.md"), "utf8");
  for (const expected of [
    "data/components/shared.yaml",
    "data/components/marketing.yaml",
    "data/components/service.yaml",
    "registry/email-component-descriptions-registry.md",
    "generated docs",
    "Figma не изменялась",
  ]) {
    assert.ok(readme.includes(expected), "README is missing: " + expected);
  }
});
