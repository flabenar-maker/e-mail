import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  copyFixtureFile,
  createSystemFixture,
  fixtureDigest,
  writeFixtureFile,
} from "../helpers/system-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const fixtureFiles = [
  "schemas/manifest.schema.json",
  "schemas/typography.schema.json",
  "system/manifest.yaml",
  "data/foundations/typography.yaml",
  "schemas/spacing.schema.json",
  "data/foundations/spacing.yaml",
  "README.md",
  "bootstrap/README.md",
  "core/email-figma-prompt.md",
  "core/figma-component-naming-standard.md",
  "registry/email-component-descriptions-registry.md",
  "registry/email-typography-registry.md",
  "workflows/library-maintenance-checkpoint.md",
  "workflows/email-build-checkpoint.md",
  "templates/email-project-brief.md",
  "bootstrap/config.portable.toml",
  "bootstrap/verify.ps1",
  ".agents/skills/maintaining-cupis-email-system/SKILL.md",
];

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
