import test from "node:test";
import assert from "node:assert/strict";
import {
  appendFile,
  readFile,
  readdir,
  rm,
  stat,
} from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import {
  canonicalSystemFixtureFiles,
  copyFixtureFile,
  createSystemFixture,
  writeFixtureFile,
} from "../helpers/system-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const cliPath = join(repoRoot, "scripts/generate-docs.mjs");

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

async function prepareFixture(t) {
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

  const manifestPath = join(fixture.root, "system/manifest.yaml");
  const manifest = await readStrictYaml(manifestPath);
  if (!manifest.generated_docs) {
    const sourceIds = new Set(manifest.sources.map(({ id }) => id));
    manifest.sources.push(
      ...generatedSources
        .filter(({ id }) => !sourceIds.has(id))
        .map((source) => structuredClone(source)),
    );
    manifest.generated_docs = structuredClone(generatedDefinitions);
    await writeFixtureFile(
      fixture.root,
      "system/manifest.yaml",
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
  }
  return fixture;
}

async function runCli(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, ...args], {
      cwd: repoRoot,
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

async function snapshotTree(root) {
  const snapshot = new Map();

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const absolute = join(directory, entry.name);
      const path = relative(root, absolute).replaceAll("\\", "/");
      if (entry.isDirectory()) {
        snapshot.set(`${path}/`, "directory");
        await visit(absolute);
      } else {
        const details = await stat(absolute);
        snapshot.set(path, `${details.size}:${await readFile(absolute, "utf8")}`);
      }
    }
  }

  await visit(root);
  return [...snapshot];
}

test("generated docs CLI checks, writes, and rechecks exact outputs", async (t) => {
  const fixture = await prepareFixture(t);

  const missing = await runCli(["--check", "--repo-root", fixture.root]);
  assert.equal(missing.code, 1);
  assert.match(missing.stderr, /GENERATED_DOC_MISSING/u);

  const written = await runCli(["--write", "--repo-root", fixture.root]);
  assert.equal(written.code, 0, written.stderr);

  const clean = await runCli(["--check", "--repo-root", fixture.root]);
  assert.equal(clean.code, 0, clean.stderr);

  for (const source of generatedSources) {
    assert.equal(typeof await readFile(join(fixture.root, source.path), "utf8"), "string");
  }
});

test("generated docs CLI reports one stale output by exact path", async (t) => {
  const fixture = await prepareFixture(t);
  assert.equal(
    (await runCli(["--write", "--repo-root", fixture.root])).code,
    0,
  );

  const stalePath = "docs/generated/typography-registry.md";
  await appendFile(join(fixture.root, stalePath), "manual edit\n", "utf8");

  const checked = await runCli(["--check", "--repo-root", fixture.root]);
  assert.equal(checked.code, 1);
  assert.match(checked.stderr, /GENERATED_DOC_STALE/u);
  assert.equal(checked.stderr.includes(`/${stalePath}`), true);
  assert.doesNotMatch(checked.stderr, /GENERATED_DOC_MISSING/u);
});

test("invalid generated docs CLI arguments are read-only usage errors", async (t) => {
  const cases = [
    [],
    ["--unknown"],
    ["--write", "--check"],
    ["--repo-root"],
    ["--write", "--repo-root"],
  ];

  for (const args of cases) {
    await t.test(args.length === 0 ? "no arguments" : args.join(" "), async (subtest) => {
      const fixture = await prepareFixture(subtest);
      const before = await snapshotTree(fixture.root);
      const result = await runCli([...args, ...(args.includes("--repo-root") ? [] : ["--repo-root", fixture.root])]);
      assert.equal(result.code, 1);
      assert.match(result.stderr, /Usage:/u);
      assert.deepEqual(await snapshotTree(fixture.root), before);
    });
  }
});
