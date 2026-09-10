import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  canonicalSystemFixtureFiles,
  copyFixtureFile,
  createSystemFixture,
} from "../helpers/system-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const cliPath = join(repoRoot, "scripts/build-context-bundle.mjs");

async function prepareFixture(t) {
  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);
  await Promise.all(
    canonicalSystemFixtureFiles.map((path) =>
      copyFixtureFile(repoRoot, fixture.root, path),
    ),
  );
  return fixture;
}

async function runCli(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, ...args], {
      cwd,
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

test("bundle CLI renders deterministic route-specific Markdown without writing files", async (t) => {
  const fixture = await prepareFixture(t);
  const before = await snapshotTree(fixture.root);
  const args = ["--route", "migration-progress"];

  const first = await runCli(args, fixture.root);
  const second = await runCli(args, fixture.root);

  assert.equal(first.code, 0, first.stderr);
  assert.equal(first.stderr, "");
  assert.equal(first.stdout, second.stdout);
  assert.match(
    first.stdout,
    /^---\nbundle_schema_version: 1\.0\.0\nmode: shadow\nroute_id: migration-progress\nbundle_profile_id: migration-progress\ndigest: sha256:[0-9a-f]{64}\n---\n\n# CUPIS resolved context bundle\n/u,
  );
  assert.match(first.stdout, /## Static sources\n/u);
  assert.match(first.stdout, /### repository-readme\n/u);
  assert.match(first.stdout, /Source: `README\.md`/u);
  assert.match(first.stdout, /## Components\n\n_None\._/u);
  assert.match(first.stdout, /## Foundation definitions\n\n_None\._/u);
  assert.deepEqual(await snapshotTree(fixture.root), before);
});

test("bundle CLI accepts repeated exact selections and keeps component boundaries", async (t) => {
  const fixture = await prepareFixture(t);
  const result = await runCli(
    [
      "--route",
      "email-new-build",
      "--component",
      "banner-hero",
      "--component",
      "button-secondary",
      "--viewport",
      "both",
    ],
    fixture.root,
  );

  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.match(result.stdout, /## Components\n/u);
  assert.match(result.stdout, /### button-primary\n/u);
  assert.match(result.stdout, /### button-secondary\n/u);
  assert.match(result.stdout, /### banner-hero\n/u);
  assert.match(result.stdout, /## Foundation definitions\n/u);
  assert.match(result.stdout, /### assets\/export_profiles\/jpeg-2x\n/u);
  assert.doesNotMatch(
    result.stdout,
    /^### component-descriptions-registry$/mu,
  );
  assert.doesNotMatch(result.stdout, /^### typography-registry$/mu);
});

test("bundle CLI accepts repeated explicit foundations for an allowed route", async (t) => {
  const fixture = await prepareFixture(t);
  const result = await runCli(
    [
      "--route",
      "library-maintenance",
      "--viewport",
      "mobile",
      "--foundation",
      "typography",
      "--foundation",
      "figma-naming",
    ],
    fixture.root,
  );

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /### typography\/foundation\/all\n/u);
  assert.match(result.stdout, /### figma-naming\/foundation\/all\n/u);
});

test("bundle CLI reports usage errors with empty stdout", async (t) => {
  const fixture = await prepareFixture(t);
  const cases = [
    { args: [], code: "CONTEXT_BUNDLE_CLI_ARGUMENTS" },
    {
      args: ["--route", "migration-progress", "--route", "email-new-build"],
      code: "CONTEXT_BUNDLE_CLI_ARGUMENTS",
    },
    {
      args: ["--route", "migration-progress", "--viewport", "mobile", "--viewport", "desktop"],
      code: "CONTEXT_BUNDLE_CLI_ARGUMENTS",
    },
    {
      args: ["--route", "migration-progress", "--component"],
      code: "CONTEXT_BUNDLE_CLI_ARGUMENTS",
    },
    {
      args: ["--route", "migration-progress", "--foundation"],
      code: "CONTEXT_BUNDLE_CLI_ARGUMENTS",
    },
    {
      args: ["--route", "migration-progress", "--viewport", "tablet"],
      code: "CONTEXT_BUNDLE_VIEWPORT_INVALID",
    },
    {
      args: ["--route", "migration-progress", "--unknown"],
      code: "CONTEXT_BUNDLE_CLI_ARGUMENTS",
    },
  ];

  for (const { args, code } of cases) {
    await t.test(args.length === 0 ? "no arguments" : args.join(" "), async () => {
      const result = await runCli(args, fixture.root);
      assert.equal(result.code, 1);
      assert.equal(result.stdout, "");
      assert.match(result.stderr, new RegExp(`\\[${code}\\]`, "u"));
      assert.match(result.stderr, /Usage:/u);
    });
  }
});

test("bundle CLI prints builder blockers only to stderr", async (t) => {
  const fixture = await prepareFixture(t);

  const missingComponent = await runCli(
    ["--route", "email-new-build", "--viewport", "both"],
    fixture.root,
  );
  assert.equal(missingComponent.code, 1);
  assert.equal(missingComponent.stdout, "");
  assert.match(missingComponent.stderr, /CONTEXT_BUNDLE_COMPONENT_REQUIRED/u);

  const incompleteViewport = await runCli(
    [
      "--route",
      "email-new-build",
      "--component",
      "banner-hero",
      "--viewport",
      "mobile",
    ],
    fixture.root,
  );
  assert.equal(incompleteViewport.code, 1);
  assert.equal(incompleteViewport.stdout, "");
  assert.match(
    incompleteViewport.stderr,
    /CONTEXT_BUNDLE_BOTH_VIEWPORTS_REQUIRED/u,
  );
});
