import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

const coreSources = [
  {
    id: "email-rendering-standard",
    path: "core/email-rendering-standard.md",
    marker: "Единственная ответственность этого файла — общие принципы HTML-рендеринга.",
    structuredOwner: "data/foundations/rendering.yaml",
  },
  {
    id: "typography-standard",
    path: "core/typography-standard.md",
    marker: "Единственная ответственность этого файла — принципы применения типографики.",
    structuredOwner: "data/foundations/typography.yaml",
  },
  {
    id: "asset-export-standard",
    path: "core/asset-export-standard.md",
    marker: "Единственная ответственность этого файла — процесс подготовки и экспорта ассетов.",
    structuredOwner: "data/foundations/assets.yaml",
  },
  {
    id: "figma-library-standard",
    path: "core/figma-library-standard.md",
    marker: "Единственная ответственность этого файла — принципы поддержки Figma-библиотеки.",
    structuredOwner: "data/foundations/figma-naming.yaml",
  },
];

const legacyOwners = new Map([
  ["Источники спецификации", "email-build-workflow"],
  ["Figma-проход по применимости", "email-build-workflow"],
  ["HTML-документ", "email-rendering-standard"],
  ["Основная обёртка", "email-rendering-standard"],
  ["Внешние отступы верхнеуровневых компонентов", "email-rendering-standard"],
  ["Адаптивность", "email-rendering-standard"],
  ["Общие ограничения", "email-rendering-standard"],
  ["Gmail Android color override", "email-rendering-standard"],
  ["Изображения", "asset-export-standard"],
  ["Источник растрового asset", "asset-export-standard"],
  ["Режим отображения", "asset-export-standard"],
  ["Presentation-only clipping", "asset-export-standard"],
  ["@4x", "asset-export-standard"],
  ["Способ экспорта @4x", "asset-export-standard"],
  ["EXPECTED ALPHA", "asset-export-standard"],
  ["Проверка alpha-канала", "asset-export-standard"],
  ["Проверка на контрастных подложках", "asset-export-standard"],
  ["Постобработка PNG", "asset-export-standard"],
  ["@2x", "asset-export-standard"],
  ["@2x Fill", "asset-export-standard"],
  ["Выбор слоя", "asset-export-standard"],
  ["Типографика и геометрия", "typography-standard"],
  ["Доступность", "email-rendering-standard"],
  ["Структура архива", "email-build-workflow"],
  ["Проверка", "email-build-workflow"],
  ["Outlook и dark mode", "email-rendering-standard"],
  ["Итоговый ответ", "email-build-workflow"],
  ["Ссылки в футере", "email-build-workflow"],
]);

test("declares four focused Core documents", async () => {
  await Promise.all(
    coreSources.map(async ({ path, marker, structuredOwner }) => {
      const text = await readFile(join(repoRoot, path), "utf8");
      assert.equal(text.split(marker).length - 1, 1, `${path}: responsibility marker`);
      assert.match(text, new RegExp(structuredOwner.replaceAll(".", "\\."), "u"));
    }),
  );
});

test("preserves the legacy prompt byte-for-byte while the split is shadow-only", async () => {
  const text = (await readFile(join(repoRoot, "core/email-figma-prompt.md"), "utf8")).replaceAll("\r\n", "\n");
  const digest = `sha256:${createHash("sha256").update(text).digest("hex")}`;
  assert.equal(digest, "sha256:f25d073e5ecd5d135b28a040afeda4fc594fcb7f2f0dab220442c57488392665");
});

test("keeps Core explanatory and free of exact component or foundation definitions", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const componentIds = Object.values(registries).flatMap((document) =>
    document.components.map((component) => component.id),
  );

  for (const { path } of coreSources) {
    const text = await readFile(join(repoRoot, path), "utf8");
    assert.doesNotMatch(text, /^\|.*\|$/mu, `${path}: tables belong to structured sources or generated docs`);
    assert.doesNotMatch(text, /\b\d+:\d+\b/u, `${path}: Figma node IDs are forbidden`);
    assert.doesNotMatch(text, /\b\d+(?:\.\d+)?\s*px\b/iu, `${path}: exact dimensions belong to foundations or component records`);
    assert.doesNotMatch(text, /#[0-9a-f]{3,8}\b/iu, `${path}: exact colors belong to structured sources`);
    assert.doesNotMatch(text, /```(?:ya?ml|json)/iu, `${path}: structured definition blocks are forbidden`);
    for (const componentId of componentIds) {
      assert.equal(text.includes(componentId), false, `${path}: component ${componentId} belongs to the registry`);
    }
  }
});

test("maps every meaningful legacy section to exactly one future owner", async () => {
  const legacy = await readFile(join(repoRoot, "core/email-figma-prompt.md"), "utf8");
  const headings = [...legacy.matchAll(/^#{2,3}\s+(.+)$/gmu)].map((match) => match[1].trim());
  assert.deepEqual([...legacyOwners.keys()], headings);
  for (const heading of headings) {
    assert.equal(typeof legacyOwners.get(heading), "string", `${heading}: missing owner`);
  }
});

test("registers split Core sources without switching active routes", async () => {
  const manifest = await readStrictYaml(join(repoRoot, "system/manifest.yaml"));
  for (const source of coreSources) {
    assert.deepEqual(
      manifest.sources.find(({ id }) => id === source.id),
      { id: source.id, kind: "core", path: source.path },
    );
  }

  const activeSourceIds = new Set(
    manifest.bundle_profiles.flatMap((profile) => [
      ...profile.source_ids,
      ...profile.generated_bundle.static_source_ids,
    ]),
  );
  for (const { id } of coreSources) {
    assert.equal(activeSourceIds.has(id), false, `${id}: Package 4 must remain shadow-only`);
  }
});
