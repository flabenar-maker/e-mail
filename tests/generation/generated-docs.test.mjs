import test from "node:test";
import assert from "node:assert/strict";
import { appendFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  listComponentRecords,
  loadComponentRegistries,
} from "../../scripts/lib/component-registry.mjs";
import {
  compareGeneratedDocs,
  loadGeneratedDocModel,
  renderGeneratedDoc,
  renderAllGeneratedDocs,
} from "../../scripts/lib/generated-docs.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import {
  canonicalSystemFixtureFiles,
  copyFixtureFile,
  createSystemFixture,
  writeFixtureFile,
} from "../helpers/system-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

const generatedSources = [
  {
    id: "generated-component-registry",
    kind: "generated",
    path: "docs/generated/component-registry.md",
  },
  {
    id: "generated-typography-registry",
    kind: "generated",
    path: "docs/generated/typography-registry.md",
  },
  {
    id: "generated-asset-registry",
    kind: "generated",
    path: "docs/generated/asset-registry.md",
  },
  {
    id: "generated-naming-reference",
    kind: "generated",
    path: "docs/generated/naming-reference.md",
  },
];

const generatedDefinitions = [
  {
    id: "component-registry",
    output_source_id: "generated-component-registry",
    renderer: "component-registry",
    input_source_ids: [
      "components-shared",
      "components-marketing",
      "components-service",
      "components-schema",
      "typography-foundation",
      "typography-schema",
      "spacing-foundation",
      "spacing-schema",
      "assets-foundation",
      "assets-schema",
    ],
  },
  {
    id: "typography-registry",
    output_source_id: "generated-typography-registry",
    renderer: "typography-registry",
    input_source_ids: [
      "typography-foundation",
      "typography-schema",
      "components-shared",
      "components-marketing",
      "components-service",
      "components-schema",
    ],
  },
  {
    id: "asset-registry",
    output_source_id: "generated-asset-registry",
    renderer: "asset-registry",
    input_source_ids: [
      "assets-foundation",
      "assets-schema",
      "components-shared",
      "components-marketing",
      "components-service",
      "components-schema",
    ],
  },
  {
    id: "naming-reference",
    output_source_id: "generated-naming-reference",
    renderer: "naming-reference",
    input_source_ids: [
      "figma-naming-foundation",
      "figma-naming-schema",
    ],
  },
];

async function manifestWithGeneratedDocs(root = repoRoot) {
  const manifest = await readStrictYaml(join(root, "system/manifest.yaml"));
  if (!manifest.generated_docs) {
    manifest.sources.push(...structuredClone(generatedSources));
    manifest.generated_docs = structuredClone(generatedDefinitions);
  }
  return manifest;
}

async function renderCanonical(root = repoRoot) {
  const manifest = await manifestWithGeneratedDocs(root);
  return renderAllGeneratedDocs({ repoRoot: root, manifest });
}

function contentAt(rendered, path) {
  const content = rendered.get(path);
  assert.equal(typeof content, "string", `Missing rendered output: ${path}`);
  return content;
}

function sourceDigest(content) {
  return /^<!-- source-digest: (sha256:[0-9a-f]{64}) -->$/mu.exec(content)?.[1];
}

test("component traversal uses library order and stable ids", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const records = listComponentRecords(registries);

  assert.equal(records.length, 61);
  assert.deepEqual(
    [...new Set(records.map(({ library }) => library))],
    ["shared", "marketing", "service"],
  );
  for (const library of ["shared", "marketing", "service"]) {
    const ids = records
      .filter((entry) => entry.library === library)
      .map(({ record }) => record.id);
    assert.deepEqual(ids, [...ids].sort((left, right) => left.localeCompare(right)));
  }
});

test("canonical manifest generates the full component registry", async () => {
  const manifest = await readStrictYaml(join(repoRoot, "system/manifest.yaml"));
  const rendered = await renderAllGeneratedDocs({ repoRoot, manifest });
  const content = contentAt(rendered, "docs/generated/component-registry.md");

  assert.match(content, /Block\/Cards-Images/u);
  assert.match(content, /source-digest: sha256:[0-9a-f]{64}/u);
  const registries = await loadComponentRegistries({ repoRoot });
  assert.equal(
    (content.match(/^## /gmu) ?? []).length,
    listComponentRecords(registries).length,
  );
});

test("all generated references share a deterministic provenance header", async () => {
  const first = await renderCanonical();
  const second = await renderCanonical();

  assert.deepEqual(first, second);
  assert.equal(first.size, 4);

  for (const [path, content] of first) {
    assert.match(
      content,
      /^<!-- GENERATED FILE — DO NOT EDIT MANUALLY\. -->\n<!-- renderer: (component-registry|typography-registry|asset-registry|naming-reference) -->\n<!-- source-digest: sha256:[0-9a-f]{64} -->\n<!-- schema-versions: [^\n]+ -->\n/u,
      path,
    );
    assert.doesNotMatch(content.slice(0, 300), /generated-at|timestamp/iu);
    assert.equal(content.endsWith("\n"), true);
  }
});

test("generated references expose complete facts without mixing responsibilities", async () => {
  const rendered = await renderCanonical();
  const componentDoc = contentAt(rendered, "docs/generated/component-registry.md");
  const typographyDoc = contentAt(rendered, "docs/generated/typography-registry.md");
  const assetDoc = contentAt(rendered, "docs/generated/asset-registry.md");
  const namingDoc = contentAt(rendered, "docs/generated/naming-reference.md");

  assert.match(componentDoc, /Block\/Cards-Images/u);

  assert.match(typographyDoc, /Desktop\/Caption/u);
  assert.match(
    typographyDoc,
    /Figma style ID: `S:4d43ca77a0bc52ca7e43f97a078a4d69cee87651,`/u,
  );
  assert.match(typographyDoc, /Consumers/u);
  assert.match(typographyDoc, /Responsive pair/u);

  assert.match(assetDoc, /jpeg-2x/u);
  assert.match(assetDoc, /png-4x/u);
  assert.match(assetDoc, /Export boundary/u);
  assert.match(assetDoc, /banner-secondary/u);
  assert.match(assetDoc, /Identity policy/u);
  assert.match(assetDoc, /Background policy/u);
  assert.match(assetDoc, /shared_mobile_desktop_file/u);
  assert.match(assetDoc, /artificial_matte/u);

  assert.match(namingDoc, /@2x/u);
  assert.match(namingDoc, /@4x/u);
  assert.match(namingDoc, /Variant axis ordering/u);
  assert.doesNotMatch(namingDoc, /326:5159/u);
});

test("each generated source digest changes when one declared input changes", async (t) => {
  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);
  await Promise.all(
    canonicalSystemFixtureFiles.map((path) =>
      copyFixtureFile(repoRoot, fixture.root, path),
    ),
  );

  const baseline = await renderCanonical(fixture.root);
  const cases = [
    ["data/components/marketing.yaml", "docs/generated/component-registry.md"],
    ["data/foundations/typography.yaml", "docs/generated/typography-registry.md"],
    ["data/foundations/assets.yaml", "docs/generated/asset-registry.md"],
    ["data/foundations/figma-naming.yaml", "docs/generated/naming-reference.md"],
  ];

  for (const [inputPath, outputPath] of cases) {
    const before = sourceDigest(contentAt(baseline, outputPath));
    await appendFile(join(fixture.root, inputPath), "\n# digest-test-byte\n", "utf8");
    const changed = await renderCanonical(fixture.root);
    const after = sourceDigest(contentAt(changed, outputPath));
    assert.notEqual(after, before, `${outputPath} digest ignored ${inputPath}`);
  }
});

test("typography registry derives the Figma description from semantic text and fields", async (t) => {
  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);
  await Promise.all(
    canonicalSystemFixtureFiles.map((path) =>
      copyFixtureFile(repoRoot, fixture.root, path),
    ),
  );

  const typography = await readStrictYaml(
    join(fixture.root, "data/foundations/typography.yaml"),
  );
  const style = typography.styles.find(({ id }) => id === "desktop-display");
  delete style.figma_description;
  style.figma_description_semantics =
    "Главный выразительный текст Desktop для Hero-заголовка и крупного результата операции. Не использовать как обычный заголовок блока или карточки. Пара: Mobile/Display.";
  style.font_size_px = 33;
  style.font.figma_style = "Medium";
  style.line_height = { unit: "px", value: 30 };
  style.letter_spacing = { unit: "px", value: 1 };
  style.figma_name = "Desktop/Display/Test";
  await writeFixtureFile(
    fixture.root,
    "data/foundations/typography.yaml",
    `${JSON.stringify(typography, null, 2)}\n`,
  );

  const rendered = await renderCanonical(fixture.root);
  const content = contentAt(rendered, "docs/generated/typography-registry.md");
  assert.match(content, /### Desktop\/Display\/Test/u);
  assert.match(content, /Roboto Medium, 33px, line-height 30px, letter-spacing 1px/u);
  assert.doesNotMatch(content, /Roboto Bold, 32px, line-height 120%, letter-spacing 0/u);
});
test("generated comparison reports missing and stale files by exact path", async (t) => {
  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);
  await Promise.all(
    canonicalSystemFixtureFiles.map((path) =>
      copyFixtureFile(repoRoot, fixture.root, path),
    ),
  );
  await Promise.all(
    generatedSources.map(({ path }) =>
      rm(join(fixture.root, path), { force: true }),
    ),
  );

  const manifest = await manifestWithGeneratedDocs(fixture.root);
  const model = await loadGeneratedDocModel({ repoRoot: fixture.root, manifest });
  assert.equal(model.schemaVersions.components, "2.1.0");

  const rendered = await renderAllGeneratedDocs({
    repoRoot: fixture.root,
    manifest,
  });
  const missing = await compareGeneratedDocs({
    repoRoot: fixture.root,
    rendered,
  });
  assert.deepEqual(
    missing.map(({ code, path }) => [code, path]),
    [...rendered.keys()].sort().map((path) => [
      "GENERATED_DOC_MISSING",
      `/${path}`,
    ]),
  );

  for (const [path, content] of rendered) {
    await writeFixtureFile(fixture.root, path, content);
  }
  assert.deepEqual(
    await compareGeneratedDocs({ repoRoot: fixture.root, rendered }),
    [],
  );

  const stalePath = "docs/generated/typography-registry.md";
  await appendFile(join(fixture.root, stalePath), "manual edit\n", "utf8");
  assert.deepEqual(
    (await compareGeneratedDocs({ repoRoot: fixture.root, rendered })).map(
      ({ code, path }) => [code, path],
    ),
    [["GENERATED_DOC_STALE", `/${stalePath}`]],
  );
});

function typographyDefinition() {
  return generatedDefinitions.find(({ id }) => id === "typography-registry");
}

async function typographyModel() {
  const canonical = await loadGeneratedDocModel({
    repoRoot,
    manifest: await manifestWithGeneratedDocs(),
  });
  return {
    ...canonical,
    registries: structuredClone(canonical.registries),
    typography: structuredClone(canonical.typography),
  };
}

function renderTypography(model) {
  return renderGeneratedDoc({ definition: typographyDefinition(), model });
}

function styleSection(content, name) {
  const start = content.indexOf(`### ${name}\n`);
  assert.notEqual(start, -1, name);
  const next = content.indexOf("\n### ", start + 1);
  return content.slice(start, next === -1 ? undefined : next);
}

function recordAt(model, id) {
  return listComponentRecords(model.registries).find(({ record }) => record.id === id)?.record;
}

function pointer(root, path) {
  return path.slice(1).split("/").reduce((value, key) => value?.[key], root);
}

function semanticStyleLink(record) {
  const link = record.contracts.figma_fact_links.find(
    ({ source_path }) => source_path === "/text_style/figma_style_id",
  );
  assert.ok(link);
  return link;
}

test("typography registry records exact semantic consumers with base and variant ownership", async () => {
  const model = await typographyModel();
  const before = structuredClone({ registries: model.registries, typography: model.typography });
  const content = renderTypography(model);
  const section = styleSection(content, "Mobile/Body/Large");

  assert.match(section, /- Consumers: `badge-step-number`/u);
  assert.match(section, /  - Component `badge-step-number`; viewport `mobile`; variant `mobile-neutral`; element `root-label`/u);
  assert.match(section, /  - Component `badge-step-number`; viewport `mobile`; variant `mobile-accent`; element `root-label`/u);
  assert.match(section, /Figma style ID: `S:a3c66207faa33c3c4f22e054bd4d177b33d616c8,`/u);
  assert.deepEqual({ registries: model.registries, typography: model.typography }, before, "projection must not rewrite local contract facts");
  assert.equal((content.match(/^  - Component /gmu) ?? []).length, 364);
  assert.equal((content.match(/^- Consumers: `.+$/gmu) ?? []).length, 15);
});

test("typography registry deduplicates an identical semantic link but retains typed references and distinct tuple identity", async () => {
  const model = await typographyModel();
  const badge = recordAt(model, "badge-step-number");
  const link = semanticStyleLink(badge);
  badge.contracts.figma_fact_links.push(structuredClone(link));
  badge.contracts.mobile.root.facts.push({
    id: "typed-typography-reference",
    value: {
      type: "foundation-reference", foundation_id: "typography",
      definition_group: "styles", definition_id: "mobile-display",
    },
  });
  const content = renderTypography(model);
  const mobile = styleSection(content, "Mobile/Body/Large");
  const detail = "Component `badge-step-number`; viewport `mobile`; variant `mobile-neutral`; element `root-label`";
  assert.equal(mobile.split(detail).length - 1, 1);
  const desktop = styleSection(content, "Mobile/Display");
  assert.match(desktop, /- Consumers: `badge-step-number`/u);
  assert.match(desktop, /  - Component `badge-step-number`; viewport `mobile`; variant `default`; element `root`/u);
});

test("typography registry rejects malformed advertised semantic links instead of rendering them unused", async () => {
  const mutations = [
    (record, link) => { pointer(record, link.contract_path.replace(/\/value\/value$/u, "")).value.value = "S:unknown,"; },
    (record, link) => { pointer(record, link.contract_path.replace(/\/value\/value$/u, "")).provenance.node_id = "18:2947"; },
    (_record, link) => { link.variant_node_id = "18:2947"; },
    (_record, link) => { link.contract_path = link.contract_path.replace(/\/value\/value$/u, "/value/not-value"); },
  ];
  for (const mutate of mutations) {
    const model = await typographyModel();
    const badge = recordAt(model, "badge-step-number");
    mutate(badge, semanticStyleLink(badge));
    assert.throws(
      () => renderTypography(model),
      (error) => error?.code === "GENERATED_TYPOGRAPHY_CONSUMER_INVALID",
    );
  }
});

test("snapshot-only, detached, and empty style IDs do not become typography consumers", async () => {
  const model = await typographyModel();
  const badge = recordAt(model, "badge-step-number");
  badge.contracts.source_variants = [{
    variant_node_id: "snapshot-only", source_node: {
      node_id: "snapshot-only", text_style: { figma_style_id: "S:a3c66207faa33c3c4f22e054bd4d177b33d616c8," },
    },
  }];
  badge.contracts.mobile.root.facts.push({
    id: "detached-empty-style-id",
    value: { type: "string", value: "" },
    provenance: { kind: "figma-literal", node_id: "18:2942" },
  });
  const content = renderTypography(model);
  assert.doesNotMatch(content, /snapshot-only/u);
  assert.match(styleSection(content, "Mobile/Body/Large"), /Component `badge-step-number`/u);
});
test("typography consumer projection rejects missing ownership and ambiguous exact style identities", async () => {
  const cases = [
    (model, record, link) => { record.contracts.figma_fact_links = record.contracts.figma_fact_links.filter((item) => item !== link); },
    (model) => { model.typography.styles[1].figma_style_id = model.typography.styles[0].figma_style_id; },
  ];
  for (const mutate of cases) {
    const model = await typographyModel();
    const record = recordAt(model, "badge-step-number");
    mutate(model, record, semanticStyleLink(record));
    assert.throws(() => renderTypography(model), (error) => error?.code === "GENERATED_TYPOGRAPHY_CONSUMER_INVALID");
  }
});

test("snapshot-only record and detached empty ID do not create a typography consumer", async () => {
  const model = await typographyModel();
  const snapshot = structuredClone(recordAt(model, "badge-step-number"));
  snapshot.id = "snapshot-only-consumer";
  snapshot.contracts.figma_fact_links = [];
  const stripSemanticStyleFacts = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node.facts)) node.facts = node.facts.filter(({ id }) => id !== "figma-style-id");
    for (const child of node.children ?? []) stripSemanticStyleFacts(child);
  };
  for (const contract of [...Object.values(snapshot.contracts).filter((value) => value?.root), ...(snapshot.contracts.variant_contracts ?? [])]) stripSemanticStyleFacts(contract.root);
  snapshot.contracts.source_variants = [{ variant_node_id: "snapshot-only", source_node: { node_id: "snapshot-only", text_style: { figma_style_id: "S:a3c66207faa33c3c4f22e054bd4d177b33d616c8," } } }];
  snapshot.contracts.mobile.root.facts.push({ id: "detached-empty-style-id", value: { type: "string", value: "" }, provenance: { kind: "figma-literal", node_id: "18:2942" } });
  model.registries.shared.components.push(snapshot);
  assert.doesNotMatch(renderTypography(model), /snapshot-only-consumer|snapshot-only/u);
});

test("typography consumer association preserves a local numeric override without metric matching", async () => {
  const model = await typographyModel();
  const badge = recordAt(model, "badge-step-number");
  badge.contracts.mobile.root.children[0].facts.push({ id: "local-font-weight-override", value: { type: "number", value: 900 }, provenance: { kind: "figma-literal", node_id: "18:2941" } });
  assert.match(styleSection(renderTypography(model), "Mobile/Body/Large"), /Component `badge-step-number`; viewport `mobile`; variant `mobile-neutral`; element `root-label`/u);
  assert.equal(badge.contracts.mobile.root.children[0].facts.at(-1).value.value, 900);
});
