import {
  access,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";


export const canonicalSystemFixtureFiles = [
  "schemas/manifest.schema.json",
  "schemas/workflows.schema.json",
  "schemas/typography.schema.json",
  "system/manifest.yaml",
  "docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md",
  "data/foundations/typography.yaml",
  "schemas/spacing.schema.json",
  "data/foundations/spacing.yaml",
  "schemas/assets.schema.json",
  "data/foundations/assets.yaml",
  "schemas/figma-naming.schema.json",
  "data/foundations/figma-naming.yaml",
  "schemas/rendering.schema.json",
  "data/foundations/rendering.yaml",
  "schemas/renderer-registry.schema.json",
  "data/renderers/registry.yaml",
  "schemas/components.schema.json",
  "data/components/shared.yaml",
  "data/components/marketing.yaml",
  "data/components/service.yaml",
  "data/workflows/library-maintenance.yaml",
  "data/workflows/email-build.yaml",
  "docs/generated/component-registry.md",
  "docs/generated/typography-registry.md",
  "docs/generated/asset-registry.md",
  "docs/generated/naming-reference.md",
  "README.md",
  "bootstrap/README.md",
  "core/email-rendering-standard.md",
  "core/email-model-assembly-standard.md",
  "core/email-source-fidelity-standard.md",
  "schemas/email-model.schema.json",
  "core/typography-standard.md",
  "core/asset-export-standard.md",
  "core/figma-library-standard.md",
  "core/component-contract-standard.md",
  "core/figma-component-description-standard.md",
  "workflows/system-paused.md",
  "bootstrap/config.portable.toml",
  "bootstrap/verify.ps1",
  ".agents/skills/maintaining-cupis-email-system/SKILL.md",
  ".agents/skills/building-cupis-emails/SKILL.md",
  ".agents/skills/cupis-email-task-router/SKILL.md",
];

function fixturePath(root, relativePath) {
  if (isAbsolute(relativePath)) {
    throw new Error(`Fixture path must be relative: ${relativePath}`);
  }

  const resolvedRoot = resolve(root);
  const resolvedPath = resolve(root, relativePath);
  const relation = relative(resolvedRoot, resolvedPath);
  if (relation.startsWith("..") || isAbsolute(relation)) {
    throw new Error(`Fixture path escapes root: ${relativePath}`);
  }

  return resolvedPath;
}

export async function writeFixtureFile(root, relativePath, content) {
  const target = fixturePath(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
  return target;
}

export async function copyFixtureFile(sourceRoot, root, relativePath) {
  const source = fixturePath(sourceRoot, relativePath);
  const target = fixturePath(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
  return target;
}

export async function createSystemFixture() {
  const root = await mkdtemp(join(tmpdir(), "cupis-system-"));
  return {
    root,
    async cleanup() {
      const resolved = resolve(root);
      if (
        dirname(resolved) !== resolve(tmpdir()) ||
        !basename(resolved).startsWith("cupis-system-")
      ) {
        throw new Error(`Refusing to remove unsafe fixture path: ${resolved}`);
      }
      await rm(resolved, { recursive: true, force: true });
    },
  };
}

export async function fixtureDigest(root, relativePaths) {
  const crypto = await import("node:crypto");
  const hash = crypto.createHash("sha256");
  for (const relativePath of [...relativePaths].sort()) {
    await access(fixturePath(root, relativePath));
    hash.update(relativePath);
    hash.update(await readFile(fixturePath(root, relativePath)));
  }
  return hash.digest("hex");
}
