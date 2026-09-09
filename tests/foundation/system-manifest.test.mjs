import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadSystemManifest,
  validateSystem,
  validateManifestShape,
  validateManifestSemantics,
} from "../../scripts/lib/system-manifest.mjs";
import {
  canonicalSystemFixtureFiles,
  copyFixtureFile,
  createSystemFixture,
  writeFixtureFile,
} from "../helpers/system-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schema = JSON.parse(
  await readFile(join(repoRoot, "schemas/manifest.schema.json"), "utf8"),
);

async function canonicalManifest() {
  return loadSystemManifest({ repoRoot });
}

const fixtureFiles = canonicalSystemFixtureFiles;

async function validFixture(t) {
  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);
  for (const relativePath of fixtureFiles) {
    await copyFixtureFile(repoRoot, fixture.root, relativePath);
  }
  return fixture.root;
}

async function mutateFixtureManifest(root, mutate) {
  const manifest = await loadSystemManifest({ repoRoot: root });
  mutate(manifest);
  await writeFixtureFile(
    root,
    "system/manifest.yaml",
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  return manifest;
}

test("loads the repository canonical manifest", async () => {
  const manifest = await canonicalManifest();
  assert.equal(manifest.schema_version, "1.0.0");
  assert.equal(manifest.system.id, "cupis-email-system");
});

test("migration progress resolves the canonical roadmap bundle", async () => {
  const manifest = await canonicalManifest();
  const source = manifest.sources.find(
    (item) => item.id === "migration-roadmap",
  );
  const profile = manifest.bundle_profiles.find(
    (item) => item.id === "migration-progress",
  );
  const route = manifest.routes.find(
    (item) => item.id === "migration-progress",
  );

  assert.deepEqual(source, {
    id: "migration-roadmap",
    kind: "entrypoint",
    path: "docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md",
  });
  assert.deepEqual(profile.source_ids, [
    "repository-readme",
    "migration-roadmap",
    "library-maintenance-checkpoint",
  ]);
  assert.equal(route.workflow_source_id, "library-maintenance-checkpoint");
  assert.equal(route.bundle_profile_id, "migration-progress");
});

test("rejects an unsupported manifest schema version", async () => {
  const manifest = structuredClone(await canonicalManifest());
  manifest.schema_version = "1.1.0";

  const errors = validateManifestShape(manifest, schema);

  assert.equal(errors[0].code, "manifest-version-unsupported");
  assert.equal(errors[0].path, "/schema_version");
});

test("rejects an unknown root property", async () => {
  const manifest = structuredClone(await canonicalManifest());
  manifest.unexpected = true;

  const errors = validateManifestShape(manifest, schema);

  assert.ok(
    errors.some(
      (error) =>
        error.code === "manifest-schema" &&
        error.path === "/" &&
        error.message.includes("unexpected"),
    ),
  );
});

test("rejects an unknown nested property", async () => {
  const manifest = structuredClone(await canonicalManifest());
  manifest.system.unexpected = true;

  const errors = validateManifestShape(manifest, schema);

  assert.ok(
    errors.some(
      (error) =>
        error.code === "manifest-schema" &&
        error.path === "/system" &&
        error.message.includes("unexpected"),
    ),
  );
});

test("rejects a missing required section", async () => {
  const manifest = structuredClone(await canonicalManifest());
  delete manifest.commands;

  const errors = validateManifestShape(manifest, schema);

  assert.ok(
    errors.some(
      (error) =>
        error.code === "manifest-schema" &&
        error.path === "/" &&
        error.message.includes("commands"),
    ),
  );
});

for (const invalidPath of [
  "/absolute/path.md",
  "C:\\absolute\\path.md",
  "../outside.md",
  "core/../outside.md",
  "core\\windows.md",
]) {
  test(`rejects unsafe repository path: ${invalidPath}`, async () => {
    const manifest = structuredClone(await canonicalManifest());
    manifest.entrypoints.repository = invalidPath;

    const errors = validateManifestShape(manifest, schema);

    assert.ok(
      errors.some(
        (error) =>
          error.code === "manifest-schema" &&
          error.path === "/entrypoints/repository",
      ),
    );
  });
}

for (const [name, mutate, code] of [
  [
    "duplicate source id",
    (manifest) =>
      manifest.sources.push({
        id: manifest.sources[0].id,
        kind: "core",
        path: "core/duplicate-id.md",
      }),
    "duplicate-source-id",
  ],
  [
    "duplicate source path",
    (manifest) =>
      manifest.sources.push({
        id: "duplicate-source-path",
        kind: "core",
        path: manifest.sources[0].path,
      }),
    "duplicate-source-path",
  ],
  [
    "duplicate bundle profile id",
    (manifest) =>
      manifest.bundle_profiles.push({
        id: manifest.bundle_profiles[0].id,
        source_ids: ["repository-readme"],
      }),
    "duplicate-bundle-profile-id",
  ],
  [
    "duplicate route id",
    (manifest) =>
      manifest.routes.push({
        id: manifest.routes[0].id,
        workflow_source_id: "email-build-checkpoint",
        bundle_profile_id: "email-new-build",
      }),
    "duplicate-route-id",
  ],
  [
    "unknown source reference",
    (manifest) =>
      manifest.bundle_profiles[0].source_ids.push("unknown-source"),
    "unknown-source-reference",
  ],
  [
    "invalid workflow reference",
    (manifest) =>
      (manifest.routes[0].workflow_source_id = "repository-readme"),
    "invalid-workflow-reference",
  ],
  [
    "unknown bundle profile reference",
    (manifest) => (manifest.routes[0].bundle_profile_id = "unknown-profile"),
    "unknown-bundle-profile-reference",
  ],
]) {
  test(`reports ${name}`, async (t) => {
    const root = await validFixture(t);
    const manifest = await mutateFixtureManifest(root, mutate);

    const errors = await validateManifestSemantics(manifest, root);

    assert.ok(errors.some((error) => error.code === code));
  });
}

test("reports duplicate skill id and path across required and optional", async (t) => {
  const root = await validFixture(t);
  const manifest = await mutateFixtureManifest(root, (value) => {
    value.skills.optional.push({
      id: value.skills.required[0].id,
      path: value.skills.required[0].path,
    });
  });

  const errors = await validateManifestSemantics(manifest, root);

  assert.ok(errors.some((error) => error.code === "duplicate-skill-id"));
  assert.ok(errors.some((error) => error.code === "duplicate-skill-path"));
});

for (const [name, removePath] of [
  ["source", "core/email-figma-prompt.md"],
  ["repository entrypoint", "README.md"],
  ["portable config", "bootstrap/config.portable.toml"],
  ["verifier", "bootstrap/verify.ps1"],
]) {
  test(`reports missing declared ${name}`, async (t) => {
    const root = await validFixture(t);
    const { rm } = await import("node:fs/promises");
    await rm(join(root, removePath));
    const manifest = await loadSystemManifest({ repoRoot: root });

    const errors = await validateManifestSemantics(manifest, root);

    assert.ok(
      errors.some(
        (error) =>
          error.code === "missing-declared-path" &&
          error.path.includes(removePath),
      ),
    );
  });
}

test("reports a missing required skill", async (t) => {
  const root = await validFixture(t);
  const { rm } = await import("node:fs/promises");
  await rm(join(root, ".agents/skills/maintaining-cupis-email-system"), {
    recursive: true,
  });
  const manifest = await loadSystemManifest({ repoRoot: root });

  const errors = await validateManifestSemantics(manifest, root);

  assert.ok(errors.some((error) => error.code === "missing-required-skill"));
});

test("allows a missing optional skill", async (t) => {
  const root = await validFixture(t);
  const manifest = await mutateFixtureManifest(root, (value) => {
    value.skills.optional.push({
      id: "optional-email-skill",
      path: ".agents/skills/optional-email-skill",
    });
  });

  const errors = await validateManifestSemantics(manifest, root);

  assert.ok(
    !errors.some(
      (error) =>
        error.code === "missing-required-skill" ||
        error.path.includes("optional-email-skill"),
    ),
  );
});

test("reports a present optional skill with mismatched frontmatter", async (t) => {
  const root = await validFixture(t);
  const manifest = await mutateFixtureManifest(root, (value) => {
    value.skills.optional.push({
      id: "optional-email-skill",
      path: ".agents/skills/optional-email-skill",
    });
  });
  await writeFixtureFile(
    root,
    ".agents/skills/optional-email-skill/SKILL.md",
    "---\nname: wrong-skill-name\n---\n",
  );

  const errors = await validateManifestSemantics(manifest, root);

  assert.ok(errors.some((error) => error.code === "skill-name-mismatch"));
});

test("reports a required skill with mismatched frontmatter", async (t) => {
  const root = await validFixture(t);
  await writeFixtureFile(
    root,
    ".agents/skills/maintaining-cupis-email-system/SKILL.md",
    "---\nname: wrong-skill-name\n---\n",
  );
  const manifest = await loadSystemManifest({ repoRoot: root });

  const errors = await validateManifestSemantics(manifest, root);

  assert.ok(errors.some((error) => error.code === "skill-name-mismatch"));
});

test("reports the legacy duplicate skill directory", async (t) => {
  const root = await validFixture(t);
  await writeFixtureFile(
    root,
    "skills/maintaining-cupis-email-system/SKILL.md",
    "duplicate\n",
  );
  const manifest = await loadSystemManifest({ repoRoot: root });

  const errors = await validateManifestSemantics(manifest, root);

  assert.ok(errors.some((error) => error.code === "legacy-skill-path"));
});

test("the repository has exactly one manifest", async () => {
  const { access } = await import("node:fs/promises");
  await access(join(repoRoot, "system/manifest.yaml"));
  await assert.rejects(access(join(repoRoot, "bootstrap/manifest.yaml")));
});

test("reports the legacy bootstrap manifest", async (t) => {
  const root = await validFixture(t);
  await writeFixtureFile(root, "bootstrap/manifest.yaml", "legacy: true\n");
  const manifest = await loadSystemManifest({ repoRoot: root });

  const errors = await validateManifestSemantics(manifest, root);

  assert.ok(errors.some((error) => error.code === "legacy-manifest-path"));
});

for (const [sourceId, code] of [
  ["typography-foundation", "missing-typography-source"],
  ["typography-schema", "missing-typography-schema-source"],
]) {
  test(`reports missing ${sourceId} declaration`, async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      manifest.sources = manifest.sources.filter(
        (source) => source.id !== sourceId,
      );
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(result.errors.some((error) => error.code === code));
  });
}

for (const [sourceId, kind] of [
  ["typography-foundation", "core"],
  ["typography-schema", "registry"],
]) {
  test(`reports invalid ${sourceId} kind`, async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      let source = manifest.sources.find((item) => item.id === sourceId);
      if (!source) {
        source = {
          id: sourceId,
          kind: sourceId === "typography-schema" ? "schema" : "registry",
          path:
            sourceId === "typography-schema"
              ? "schemas/typography.schema.json"
              : "data/foundations/typography.yaml",
        };
        manifest.sources.push(source);
      }
      source.kind = kind;
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) => error.code === "invalid-typography-source-kind",
      ),
    );
  });
}

for (const relativePath of [
  "data/foundations/typography.yaml",
  "schemas/typography.schema.json",
]) {
  test(`reports missing declared typography path: ${relativePath}`, async (t) => {
    const root = await validFixture(t);
    const { rm } = await import("node:fs/promises");
    await rm(join(root, relativePath));
    const manifest = await loadSystemManifest({ repoRoot: root });

    const errors = await validateManifestSemantics(manifest, root);

    assert.ok(
      errors.some(
        (error) =>
          error.code === "missing-declared-path" &&
          error.path.includes(relativePath),
      ),
    );
  });
}

for (const [sourceId, code] of [
  ["spacing-foundation", "missing-spacing-source"],
  ["spacing-schema", "missing-spacing-schema-source"],
]) {
  test(`reports missing ${sourceId} declaration`, async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      manifest.sources = manifest.sources.filter(
        (source) => source.id !== sourceId,
      );
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(result.errors.some((error) => error.code === code));
  });
}

for (const [sourceId, kind] of [
  ["spacing-foundation", "core"],
  ["spacing-schema", "registry"],
]) {
  test(`reports invalid ${sourceId} kind`, async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      let source = manifest.sources.find((item) => item.id === sourceId);
      if (!source) {
        source = {
          id: sourceId,
          kind: sourceId === "spacing-schema" ? "schema" : "registry",
          path:
            sourceId === "spacing-schema"
              ? "schemas/spacing.schema.json"
              : "data/foundations/spacing.yaml",
        };
        manifest.sources.push(source);
      }
      source.kind = kind;
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) => error.code === "invalid-spacing-source-kind",
      ),
    );
  });
}

test("maintenance profiles include spacing while email build profiles do not", async () => {
  const manifest = await canonicalManifest();
  const profiles = new Map(
    manifest.bundle_profiles.map((profile) => [profile.id, profile.source_ids]),
  );

  assert.ok(profiles.get("library-maintenance").includes("spacing-foundation"));
  assert.ok(profiles.get("component-onboarding").includes("spacing-foundation"));
  assert.ok(!profiles.get("email-new-build").includes("spacing-foundation"));
  assert.ok(!profiles.get("email-continue-fix").includes("spacing-foundation"));
});


test("declares the shadow assets sources outside every bundle", async () => {
  const manifest = await canonicalManifest();
  const sources = new Map(
    manifest.sources.map((source) => [source.id, source]),
  );

  assert.deepEqual(sources.get("assets-foundation"), {
    id: "assets-foundation",
    kind: "registry",
    path: "data/foundations/assets.yaml",
  });
  assert.deepEqual(sources.get("assets-schema"), {
    id: "assets-schema",
    kind: "schema",
    path: "schemas/assets.schema.json",
  });

  for (const profile of manifest.bundle_profiles) {
    assert.equal(profile.source_ids.includes("assets-foundation"), false);
    assert.equal(profile.source_ids.includes("assets-schema"), false);
  }
});

for (const [sourceId, code] of [
  ["assets-foundation", "missing-assets-source"],
  ["assets-schema", "missing-assets-schema-source"],
]) {
  test("reports missing " + sourceId + " declaration", async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      manifest.sources = manifest.sources.filter(
        (source) => source.id !== sourceId,
      );
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(result.errors.some((error) => error.code === code));
  });
}

for (const [sourceId, kind] of [
  ["assets-foundation", "core"],
  ["assets-schema", "registry"],
]) {
  test("reports invalid " + sourceId + " kind", async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      let source = manifest.sources.find((item) => item.id === sourceId);
      if (!source) {
        source = {
          id: sourceId,
          kind: sourceId === "assets-schema" ? "schema" : "registry",
          path:
            sourceId === "assets-schema"
              ? "schemas/assets.schema.json"
              : "data/foundations/assets.yaml",
        };
        manifest.sources.push(source);
      }
      source.kind = kind;
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) => error.code === "invalid-assets-source-kind",
      ),
    );
  });
}

test("declares the shadow Figma naming sources outside every bundle", async () => {
  const manifest = await canonicalManifest();
  const sources = new Map(
    manifest.sources.map((source) => [source.id, source]),
  );

  assert.deepEqual(sources.get("figma-naming-foundation"), {
    id: "figma-naming-foundation",
    kind: "registry",
    path: "data/foundations/figma-naming.yaml",
  });
  assert.deepEqual(sources.get("figma-naming-schema"), {
    id: "figma-naming-schema",
    kind: "schema",
    path: "schemas/figma-naming.schema.json",
  });

  for (const profile of manifest.bundle_profiles) {
    assert.equal(
      profile.source_ids.includes("figma-naming-foundation"),
      false,
    );
    assert.equal(
      profile.source_ids.includes("figma-naming-schema"),
      false,
    );
  }
});

for (const [sourceId, code] of [
  ["figma-naming-foundation", "missing-figma-naming-source"],
  ["figma-naming-schema", "missing-figma-naming-schema-source"],
]) {
  test("reports missing " + sourceId + " declaration", async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      manifest.sources = manifest.sources.filter(
        (source) => source.id !== sourceId,
      );
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(result.errors.some((error) => error.code === code));
  });
}

for (const [sourceId, kind] of [
  ["figma-naming-foundation", "core"],
  ["figma-naming-schema", "registry"],
]) {
  test("reports invalid " + sourceId + " kind", async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      let source = manifest.sources.find((item) => item.id === sourceId);
      if (!source) {
        source = {
          id: sourceId,
          kind:
            sourceId === "figma-naming-schema" ? "schema" : "registry",
          path:
            sourceId === "figma-naming-schema"
              ? "schemas/figma-naming.schema.json"
              : "data/foundations/figma-naming.yaml",
        };
        manifest.sources.push(source);
      }
      source.kind = kind;
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) => error.code === "invalid-figma-naming-source-kind",
      ),
    );
  });
}


const componentSources = [
  ["components-shared", "data/components/shared.yaml", "registry"],
  ["components-marketing", "data/components/marketing.yaml", "registry"],
  ["components-service", "data/components/service.yaml", "registry"],
  ["components-schema", "schemas/components.schema.json", "schema"],
];

test("declares all component registries as shadow sources outside every bundle", async () => {
  const manifest = await canonicalManifest();
  const sources = new Map(
    manifest.sources.map((source) => [source.id, source]),
  );

  for (const [id, path, kind] of componentSources) {
    assert.deepEqual(sources.get(id), { id, kind, path });
    for (const profile of manifest.bundle_profiles) {
      assert.equal(profile.source_ids.includes(id), false);
    }
  }
});

for (const [sourceId] of componentSources) {
  test("reports missing " + sourceId + " declaration", async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      manifest.sources = manifest.sources.filter(
        (source) => source.id !== sourceId,
      );
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) => error.code === "missing-" + sourceId + "-source",
      ),
    );
  });

  test("reports invalid kind for " + sourceId, async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      const source = manifest.sources.find((item) => item.id === sourceId);
      source.kind = source.kind === "schema" ? "registry" : "core";
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) => error.code === "invalid-component-registry-source-kind",
      ),
    );
  });

  test("reports invalid canonical path for " + sourceId, async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      const source = manifest.sources.find((item) => item.id === sourceId);
      source.path = "registry/email-component-descriptions-registry.md";
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) => error.code === "invalid-component-registry-source-path",
      ),
    );
  });
}

test("reports a missing declared component registry file", async (t) => {
  const root = await validFixture(t);
  const { rm } = await import("node:fs/promises");
  await rm(join(root, "data/components/shared.yaml"));

  const result = await validateSystem({ repoRoot: root });

  assert.ok(
    result.errors.some(
      (error) =>
        error.code === "missing-declared-path" &&
        error.path.includes("data/components/shared.yaml"),
    ),
  );
});


const componentDocumentationStandardSources = [
  [
    "component-contract-standard",
    "core/component-contract-standard.md",
  ],
  [
    "figma-component-description-standard",
    "core/figma-component-description-standard.md",
  ],
];

test("declares component documentation standards as shadow sources outside every bundle", async () => {
  const manifest = await canonicalManifest();
  const sources = new Map(
    manifest.sources.map((source) => [source.id, source]),
  );

  for (const [id, path] of componentDocumentationStandardSources) {
    assert.deepEqual(sources.get(id), { id, kind: "core", path });
    for (const profile of manifest.bundle_profiles) {
      assert.equal(profile.source_ids.includes(id), false);
    }
  }
});

for (const [sourceId, canonicalPath] of componentDocumentationStandardSources) {
  test("reports missing " + sourceId + " declaration", async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      manifest.sources = manifest.sources.filter(
        (source) => source.id !== sourceId,
      );
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) => error.code === "missing-" + sourceId + "-source",
      ),
    );
  });

  test("reports invalid kind for " + sourceId, async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      let source = manifest.sources.find((item) => item.id === sourceId);
      if (!source) {
        source = { id: sourceId, kind: "core", path: canonicalPath };
        manifest.sources.push(source);
      }
      source.kind = "registry";
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) =>
          error.code ===
          "invalid-component-documentation-standard-source-kind",
      ),
    );
  });

  test("reports invalid canonical path for " + sourceId, async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      let source = manifest.sources.find((item) => item.id === sourceId);
      if (!source) {
        source = { id: sourceId, kind: "core", path: canonicalPath };
        manifest.sources.push(source);
      }
      source.path = "core/email-figma-prompt.md";
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) =>
          error.code ===
          "invalid-component-documentation-standard-source-path",
      ),
    );
  });
}
