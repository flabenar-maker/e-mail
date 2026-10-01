import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const remediationPlanPath = "docs/superpowers/plans/2026-09-15-cupis-foundations-figma-verified-remediation.md";
const roadmapPath = "docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md";

async function exists(relativePath) {
  try {
    await access(join(repoRoot, relativePath));
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function collectRecursivePathFields(value, key = "", paths = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectRecursivePathFields(item, "", paths);
    return paths;
  }
  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      collectRecursivePathFields(childValue, childKey, paths);
    }
    return paths;
  }
  if (typeof value === "string" && (key === "path" || key.endsWith("_path"))) {
    paths.push(value);
  }
  return paths;
}

function activeManifestPaths(manifest) {
  return [
    ...collectRecursivePathFields(manifest),
    manifest.entrypoints.repository,
    manifest.entrypoints.bootstrap,
    manifest.bootstrap.portable_config,
    manifest.bootstrap.verifier,
  ];
}

function assertNoLegacyActivePath(manifest) {
  const paths = activeManifestPaths(manifest);
  assert.ok(paths.length > 0);
  assert.equal(
    paths.some((path) => path.startsWith("Legacy/")),
    false,
  );
}

function numberedStage(markdown, number) {
  const startPattern = new RegExp(`^### ${number}\\..*$`, "mu");
  const start = markdown.search(startPattern);
  assert.notEqual(start, -1, `Missing stage ${number}`);
  const afterHeading = markdown.indexOf("\n", start) + 1;
  const end = markdown.slice(afterHeading).search(/^### \d+\./mu);
  return end === -1
    ? markdown.slice(start)
    : markdown.slice(start, afterHeading + end);
}

test("the active system remains isolated from archived Legacy paths and concrete email output", async () => {
  const [manifest, packageJsonText] = await Promise.all([
    readStrictYaml(join(repoRoot, "system/manifest.yaml")),
    readFile(join(repoRoot, "package.json"), "utf8"),
  ]);
  const packageJson = JSON.parse(packageJsonText);

  assertNoLegacyActivePath(manifest);
  assert.match(
    packageJson.scripts.test,
    /^node\s+--test\b/u,
    "npm test must invoke the Node test runner",
  );
  assert.match(
    packageJson.scripts.test,
    /tests\/characterization\/\*\.test\.mjs/u,
    "npm test must execute active characterization checks",
  );

  for (const path of ["email.html", "images"]) {
    assert.equal(await exists(path), false, `Remediation must not ship ${path}`);
  }
});

test("semantic manifest paths cannot silently move into Legacy", async () => {
  const manifest = await readStrictYaml(join(repoRoot, "system/manifest.yaml"));
  const mutations = [
    ["entrypoints.repository", (value) => { value.entrypoints.repository = "Legacy/README.md"; }],
    ["entrypoints.bootstrap", (value) => { value.entrypoints.bootstrap = "Legacy/bootstrap/README.md"; }],
    ["bootstrap.portable_config", (value) => { value.bootstrap.portable_config = "Legacy/bootstrap/config.portable.toml"; }],
    ["bootstrap.verifier", (value) => { value.bootstrap.verifier = "Legacy/bootstrap/verify.ps1"; }],
  ];

  for (const [name, mutate] of mutations) {
    const altered = structuredClone(manifest);
    mutate(altered);
    assert.throws(() => assertNoLegacyActivePath(altered), undefined, name);
  }
});

test("remediation preserves paused routes and required current pilot coverage without freezing future additions", async () => {
  const [manifest, rendererRegistry] = await Promise.all([
    readStrictYaml(join(repoRoot, "system/manifest.yaml")),
    readStrictYaml(join(repoRoot, "data/renderers/registry.yaml")),
  ]);
  const coverage = new Map(
    rendererRegistry.coverage.map(({ component_id, mode }) => [component_id, mode]),
  );

  assert.ok(manifest.routes.length > 0);
  assert.equal(
    manifest.routes.every(({ id, workflow_source_id }) => ["email-new-build", "email-continue-fix"].includes(id) ? workflow_source_id === "workflow-email-build" : workflow_source_id === "workflow-paused"),
    true,
  );
  for (const componentId of [
    "email-template",
    "button-primary",
    "button-secondary",
    "card-image",
    "banner-secondary",
    "banner-app-download",
    "email-footer",
  ]) {
    assert.equal(coverage.get(componentId), "interpreter", componentId);
  }
});

test("roadmap records completed Stage 8 and retains incomplete 11A–11C cutover gates", async () => {
  const [roadmap, remediationPlan] = await Promise.all([
    readFile(join(repoRoot, roadmapPath), "utf8"),
    readFile(join(repoRoot, remediationPlanPath), "utf8"),
  ]);

  assert.doesNotMatch(numberedStage(roadmap, 8), /- \[ \] /u);
  assert.match(numberedStage(roadmap, 8), /- \[x\] /u);
  const stage11 = numberedStage(roadmap, 11);
  for (const phase of ["11A", "11B", "11C"]) {
    const headings = [...stage11.matchAll(new RegExp(`^#### ${phase}\\..*$`, "gmu"))];
    assert.equal(headings.length, 1, `Expected exactly one ${phase} heading`);
    assert.match(
      stage11,
      new RegExp(
        `^#### ${phase}\\..*\\r?\\n(?:(?!^#### 11[A-C]\\.)[\\s\\S])*?^- \\[ \\] `,
        "mu",
      ),
      `${phase} must retain an unchecked gate`,
    );
  }
  assert.match(stage11, /Web-часть 10A отменена/u);
  assert.match(
    stage11,
    /новый `component-development` route, design standard\/workflow и третий специализированный навык не создаются/u,
  );
  assert.match(
    remediationPlan,
    /Актуальная очередь после завершённых этапов 8–10 — proof-gate 11A и cutover 11B/u,
  );
});
