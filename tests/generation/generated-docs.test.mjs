import test from "node:test";
import assert from "node:assert/strict";
import { appendFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  listComponentRecords,
  loadComponentRegistries,
} from "../../scripts/lib/component-registry.mjs";
import {
  compareGeneratedDocs,
  loadGeneratedDocModel,
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
  manifest.sources.push(...structuredClone(generatedSources));
  manifest.generated_docs = structuredClone(generatedDefinitions);
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

  assert.match(componentDoc, /61 component records/u);
  assert.match(componentDoc, /banner-secondary/u);
  assert.match(componentDoc, /Icon\/Bank-Card-2-Line/u);
  assert.match(componentDoc, /Auxiliary Figma Description/u);
  assert.match(componentDoc, /CUPIS ID: banner-secondary/u);
  assert.match(componentDoc, /No standalone output contract/u);

  assert.match(typographyDoc, /Desktop\/Caption/u);
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
    ["data/components/shared.yaml", "docs/generated/component-registry.md"],
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

test("generated comparison reports missing and stale files by exact path", async (t) => {
  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);
  await Promise.all(
    canonicalSystemFixtureFiles.map((path) =>
      copyFixtureFile(repoRoot, fixture.root, path),
    ),
  );

  const manifest = await manifestWithGeneratedDocs(fixture.root);
  const model = await loadGeneratedDocModel({ repoRoot: fixture.root, manifest });
  assert.equal(model.schemaVersions.components, "2.0.0");

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

  const stalePath = "docs/generated/component-registry.md";
  await appendFile(join(fixture.root, stalePath), "manual edit\n", "utf8");
  assert.deepEqual(
    (await compareGeneratedDocs({ repoRoot: fixture.root, rendered })).map(
      ({ code, path }) => [code, path],
    ),
    [["GENERATED_DOC_STALE", `/${stalePath}`]],
  );
});
