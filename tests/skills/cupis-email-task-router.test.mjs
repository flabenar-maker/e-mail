import test from "node:test";
import assert from "node:assert/strict";
import { readFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadSystemManifest,
  validateManifestSemantics,
} from "../../scripts/lib/system-manifest.mjs";
import { parseStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import {
  canonicalSystemFixtureFiles,
  copyFixtureFile,
  createSystemFixture,
  writeFixtureFile,
} from "../helpers/system-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const routerId = "cupis-email-task-router";
const routerPath = ".agents/skills/cupis-email-task-router";
const routerFile = routerPath + "/SKILL.md";

function registeredRouter(manifest) {
  const record = manifest.skills.required.find(({ id }) => id === routerId);
  assert.ok(record, "The project entrypoint must be a required repo-scoped skill");
  assert.equal(record.path, routerPath);
  return record;
}

async function fixture(t) {
  const result = await createSystemFixture();
  t.after(result.cleanup);
  for (const path of canonicalSystemFixtureFiles) {
    await copyFixtureFile(repoRoot, result.root, path);
  }
  return result.root;
}

test("the required task entrypoint resolves to a valid discoverable skill", async () => {
  const manifest = await loadSystemManifest({ repoRoot });
  registeredRouter(manifest);
  const content = await readFile(join(repoRoot, routerFile), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(content);
  assert.ok(match, "Codex skill discovery requires YAML frontmatter");
  const metadata = parseStrictYaml(match[1], routerFile);
  assert.equal(metadata.name, routerId);
  assert.equal(typeof metadata.description, "string");
  assert.ok(metadata.description.trim().length > 0);
  const errors = await validateManifestSemantics(manifest, repoRoot);
  assert.deepEqual(errors.filter(({ path }) => path.includes(routerPath)), []);
});

test("removing the task entrypoint blocks manifest validation", async (t) => {
  const root = await fixture(t);
  const manifest = await loadSystemManifest({ repoRoot: root });
  registeredRouter(manifest);
  await rm(join(root, routerFile));
  const errors = await validateManifestSemantics(manifest, root);
  assert.ok(errors.some(({ code, path }) =>
    code === "missing-required-skill" && path === "/" + routerFile));
});

test("renaming the task entrypoint without its registration blocks validation", async (t) => {
  const root = await fixture(t);
  const manifest = await loadSystemManifest({ repoRoot: root });
  registeredRouter(manifest);
  await writeFixtureFile(root, routerFile,
    "---\nname: a-different-entrypoint\ndescription: Test discovery mismatch.\n---\n");
  const errors = await validateManifestSemantics(manifest, root);
  assert.ok(errors.some(({ code, path }) =>
    code === "skill-name-mismatch" && path === "/" + routerFile));
});
