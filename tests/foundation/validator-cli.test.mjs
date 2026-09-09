import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { appendFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import {
  canonicalSystemFixtureFiles,
  copyFixtureFile,
  createSystemFixture,
  fixtureDigest,
  writeFixtureFile,
} from "../helpers/system-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const fixtureFiles = canonicalSystemFixtureFiles;

async function validFixture(t) {
  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);
  for (const relativePath of fixtureFiles) {
    await copyFixtureFile(repoRoot, fixture.root, relativePath);
  }
  return fixture.root;
}

function runValidator(root, extraArgs = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        join(repoRoot, "scripts/validate-system.mjs"),
        "--repo-root",
        root,
        ...extraArgs,
      ],
      { windowsHide: true },
    );
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (exitCode) => resolve({ exitCode, stdout, stderr }));
  });
}

test("valid fixture exits zero with one pass line", async (t) => {
  const root = await validFixture(t);

  const result = await runValidator(root);

  assert.equal(result.exitCode, 0);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, "[PASS] CUPIS system validation passed.\n");
});

test("invalid fixture exits one with a sanitized diagnostic", async (t) => {
  const root = await validFixture(t);
  const secret = "do-not-print-this-value";
  await writeFixtureFile(
    root,
    "bootstrap/config.portable.toml",
    `api_token = "${secret}"\n`,
  );
  const { rm } = await import("node:fs/promises");
  await rm(join(root, "core/email-figma-prompt.md"));

  const result = await runValidator(root);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /missing-declared-path/u);
  assert.doesNotMatch(result.stderr + result.stdout, new RegExp(secret, "u"));
});

test("missing generated documentation uses the generated-doc diagnostic", async (t) => {
  const root = await validFixture(t);
  const path = "docs/generated/component-registry.md";
  await rm(join(root, path));

  const result = await runValidator(root);

  assert.equal(result.exitCode, 1);
  assert.equal(result.stderr.includes("GENERATED_DOC_MISSING"), true);
  assert.equal(result.stderr.includes(`/${path}`), true);
  assert.doesNotMatch(result.stderr, /missing-declared-path/u);
});

test("stale generated documentation uses the generated-doc diagnostic", async (t) => {
  const root = await validFixture(t);
  const path = "docs/generated/component-registry.md";
  await appendFile(join(root, path), "manual edit\n", "utf8");

  const result = await runValidator(root);

  assert.equal(result.exitCode, 1);
  assert.equal(result.stderr.includes("GENERATED_DOC_STALE"), true);
  assert.equal(result.stderr.includes(`/${path}`), true);
});

test("unknown CLI option exits one", async (t) => {
  const root = await validFixture(t);

  const result = await runValidator(root, ["--unknown"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /cli-arguments/u);
});

test("invalid typography exits one with a sanitized diagnostic", async (t) => {
  const root = await validFixture(t);
  await writeFixtureFile(
    root,
    "data/foundations/typography.yaml",
    "schema_version: 2.0.0\nsecret: do-not-print-this-typography-value\n",
  );

  const result = await runValidator(root);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /typography-version-unsupported/u);
  assert.doesNotMatch(
    result.stderr + result.stdout,
    /do-not-print-this-typography-value/u,
  );
});

test("invalid spacing exits one with a sanitized diagnostic", async (t) => {
  const root = await validFixture(t);
  await writeFixtureFile(
    root,
    "data/foundations/spacing.yaml",
    "schema_version: 2.0.0\nsecret: do-not-print-this-spacing-value\n",
  );

  const result = await runValidator(root);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /spacing-version-unsupported/u);
  assert.doesNotMatch(
    result.stderr + result.stdout,
    /do-not-print-this-spacing-value/u,
  );
});

test("validator is read-only across repeated runs", async (t) => {
  const root = await validFixture(t);
  const before = await fixtureDigest(root, fixtureFiles);

  const first = await runValidator(root);
  const second = await runValidator(root);
  const after = await fixtureDigest(root, fixtureFiles);

  assert.equal(first.exitCode, 0);
  assert.equal(second.exitCode, 0);
  assert.equal(after, before);
});


test("invalid assets exits one with a stable sanitized diagnostic", async (t) => {
  const root = await validFixture(t);
  const assetsPath = join(root, "data/foundations/assets.yaml");
  const assets = await readStrictYaml(assetsPath);
  const duplicate = structuredClone(assets.source_modes[0]);
  duplicate.description = "Distinct record with a duplicate id.";
  assets.source_modes.push(duplicate);
  await writeFixtureFile(
    root,
    "data/foundations/assets.yaml",
    JSON.stringify(assets, null, 2) + "\n",
  );

  const result = await runValidator(root);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /ASSETS_DUPLICATE_ID/u);
  assert.doesNotMatch(
    result.stderr + result.stdout,
    /source-raster-only/u,
  );
});

test("invalid Figma naming exits one with a stable sanitized diagnostic", async (t) => {
  const root = await validFixture(t);
  const secret = "do-not-print-this-figma-naming-value";
  const naming = await readStrictYaml(
    join(root, "data/foundations/figma-naming.yaml"),
  );
  naming.namespaces[0].responsibility = secret;
  naming.object_kinds.push(structuredClone(naming.object_kinds[0]));
  await writeFixtureFile(
    root,
    "data/foundations/figma-naming.yaml",
    JSON.stringify(naming, null, 2) + "\n",
  );

  const result = await runValidator(root);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /FIGMA_NAMING_DUPLICATE_ID/u);
  assert.doesNotMatch(
    result.stderr + result.stdout,
    /do-not-print-this-figma-naming-value/u,
  );
});


test("invalid component registry exits one with a stable sanitized diagnostic", async (t) => {
  const root = await validFixture(t);
  const secret = "do-not-print-this-component-value";
  await writeFixtureFile(
    root,
    "data/components/marketing.yaml",
    "schema_version: 3.0.0\nsecret: " + secret + "\n",
  );

  const result = await runValidator(root);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /components-version-unsupported/u);
  assert.doesNotMatch(result.stderr + result.stdout, new RegExp(secret, "u"));
});
