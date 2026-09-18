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
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

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
  assert.equal(manifest.schema_version, "1.2.0");
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
    "workflow-paused",
  ]);
  assert.equal(route.workflow_source_id, "workflow-paused");
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
  ["source", "core/email-rendering-standard.md"],
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

test("reports the retired duplicate skill directory", async (t) => {
  const root = await validFixture(t);
  await writeFixtureFile(
    root,
    "skills/maintaining-cupis-email-system/SKILL.md",
    "retired duplicate\n",
  );
  const manifest = await loadSystemManifest({ repoRoot: root });

  const errors = await validateManifestSemantics(manifest, root);

  assert.ok(errors.some((error) => error.code === "retired-skill-path"));
});

test("the repository has exactly one manifest", async () => {
  const { access } = await import("node:fs/promises");
  await access(join(repoRoot, "system/manifest.yaml"));
  await assert.rejects(access(join(repoRoot, "bootstrap/manifest.yaml")));
});

test("reports the retired bootstrap manifest", async (t) => {
  const root = await validFixture(t);
  await writeFixtureFile(root, "bootstrap/manifest.yaml", "retired: true\n");
  const manifest = await loadSystemManifest({ repoRoot: root });

  const errors = await validateManifestSemantics(manifest, root);

  assert.ok(errors.some((error) => error.code === "retired-manifest-path"));
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

test("all active bundle profiles keep registry foundations out of static sources", async () => {
  const manifest = await canonicalManifest();
  const profiles = new Map(
    manifest.bundle_profiles.map((profile) => [profile.id, profile.source_ids]),
  );

  for (const sourceIds of profiles.values()) {
    assert.equal(sourceIds.includes("spacing-foundation"), false);
  }
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


const testGeneratedBundle = {
  status: "structured-shadow",
  static_source_ids: ["repository-readme"],
  component_selection: "none",
  viewport_selection: "none",
  foundation_selection: "none",
  allowed_foundation_ids: [],
  required_foundation_ids: [],
};

function addGeneratedCapability(manifest) {
  manifest.schema_version = "1.2.0";
  manifest.sources = manifest.sources.filter(
    (source) => source.kind !== "generated",
  );
  manifest.sources.push({
    id: "generated-component-registry",
    kind: "generated",
    path: "docs/generated/component-registry.md",
  });
  manifest.sources.push({
    id: "generated-typography-registry",
    kind: "generated",
    path: "docs/generated/typography-registry.md",
  });
  manifest.generated_docs = [
    {
      id: "component-registry",
      output_source_id: "generated-component-registry",
      renderer: "component-registry",
      input_source_ids: [
        "components-shared",
        "components-marketing",
        "components-service",
        "components-schema",
      ],
    },
  ];
  for (const profile of manifest.bundle_profiles) {
    profile.generated_bundle = structuredClone(testGeneratedBundle);
  }
  return manifest;
}

async function generatedFixture(t) {
  const root = await validFixture(t);
  await writeFixtureFile(
    root,
    "docs/generated/component-registry.md",
    "generated component registry\n",
  );
  await writeFixtureFile(
    root,
    "docs/generated/typography-registry.md",
    "generated typography registry\n",
  );
  const manifest = await mutateFixtureManifest(root, addGeneratedCapability);
  return { root, manifest };
}

test("accepts optional generated docs and structured-shadow bundle capability", async () => {
  const manifest = addGeneratedCapability(
    structuredClone(await canonicalManifest()),
  );
  manifest.bundle_profiles[0].generated_bundle = {
    status: "structured-shadow",
    static_source_ids: [
      "repository-readme",
      "email-figma-prompt",
      "figma-component-naming-standard",
      "library-maintenance-checkpoint",
    ],
    component_selection: "optional",
    viewport_selection: "one-or-both",
    foundation_selection: "explicit-or-referenced",
    allowed_foundation_ids: [
      "typography",
      "spacing",
      "assets",
      "figma-naming",
    ],
    required_foundation_ids: [],
  };

  assert.deepEqual(validateManifestShape(manifest, schema), []);
});

test("rejects unknown generated capability fields", async () => {
  const manifest = addGeneratedCapability(
    structuredClone(await canonicalManifest()),
  );
  manifest.generated_docs[0].unexpected = true;
  manifest.bundle_profiles[0].generated_bundle.unexpected = true;

  const errors = validateManifestShape(manifest, schema);

  assert.ok(
    errors.some(
      (error) =>
        error.code === "manifest-schema" &&
        error.path === "/generated_docs/0",
    ),
  );
  assert.ok(
    errors.some(
      (error) =>
        error.code === "manifest-schema" &&
        error.path === "/bundle_profiles/0/generated_bundle",
    ),
  );
});

test("rejects unsafe generated output paths and unknown policy enums", async () => {
  const manifest = addGeneratedCapability(
    structuredClone(await canonicalManifest()),
  );
  const outputIndex = manifest.sources.findIndex(
    (source) => source.id === "generated-component-registry",
  );
  manifest.sources[outputIndex].path = "../outside.md";
  manifest.bundle_profiles[0].generated_bundle.component_selection = "sometimes";

  const errors = validateManifestShape(manifest, schema);

  assert.ok(
    errors.some(
      (error) =>
        error.code === "manifest-schema" &&
        error.path === `/sources/${outputIndex}/path`,
    ),
  );
  assert.ok(
    errors.some(
      (error) =>
        error.code === "manifest-schema" &&
        error.path ===
          "/bundle_profiles/0/generated_bundle/component_selection",
    ),
  );
});

for (const [name, mutate, code] of [
  [
    "duplicate generated doc id",
    (manifest) =>
      manifest.generated_docs.push({
        ...structuredClone(manifest.generated_docs[0]),
        output_source_id: "generated-typography-registry",
      }),
    "duplicate-generated-doc-id",
  ],
  [
    "unknown generated output source",
    (manifest) =>
      (manifest.generated_docs[0].output_source_id = "missing-generated-output"),
    "unknown-generated-output-source",
  ],
  [
    "non-generated output source",
    (manifest) =>
      (manifest.generated_docs[0].output_source_id = "repository-readme"),
    "invalid-generated-output-kind",
  ],
  [
    "unknown generated input source",
    (manifest) =>
      (manifest.generated_docs[0].input_source_ids = ["missing-generated-input"]),
    "unknown-generated-input-source",
  ],
  [
    "generated source used as generated input",
    (manifest) =>
      (manifest.generated_docs[0].input_source_ids = [
        "generated-typography-registry",
      ]),
    "generated-input-cannot-be-generated",
  ],
  [
    "duplicate generated output source",
    (manifest) =>
      manifest.generated_docs.push({
        ...structuredClone(manifest.generated_docs[0]),
        id: "typography-registry",
      }),
    "duplicate-generated-output-source",
  ],
  [
    "unknown generated bundle source",
    (manifest) =>
      manifest.bundle_profiles[0].generated_bundle.static_source_ids.push(
        "missing-static-source",
      ),
    "unknown-generated-bundle-source",
  ],
  [
    "generated source in generated bundle",
    (manifest) =>
      manifest.bundle_profiles[0].generated_bundle.static_source_ids.push(
        "generated-component-registry",
      ),
    "generated-bundle-source-cannot-be-generated",
  ],
  [
    "legacy registry in generated bundle",
    (manifest) =>
      manifest.bundle_profiles[0].generated_bundle.static_source_ids.push(
        "component-descriptions-registry",
      ),
    "generated-bundle-retired-registry-forbidden",
  ],
  [
    "unknown foundation id",
    (manifest) =>
      manifest.bundle_profiles[0].generated_bundle.allowed_foundation_ids.push(
        "unknown-foundation",
      ),
    "unknown-foundation-id",
  ],
  [
    "required foundation outside the allowed set",
    (manifest) => {
      manifest.bundle_profiles[0].generated_bundle.allowed_foundation_ids = [];
      manifest.bundle_profiles[0].generated_bundle.required_foundation_ids = [
        "spacing",
      ];
    },
    "required-foundation-not-allowed",
  ],
  [
    "route without generated profile",
    (manifest) => delete manifest.bundle_profiles[0].generated_bundle,
    "route-generated-profile-missing",
  ],
]) {
  test(`reports ${name}`, async (t) => {
    const { root, manifest } = await generatedFixture(t);
    mutate(manifest);

    const errors = await validateManifestSemantics(manifest, root);

    assert.ok(
      errors.some((error) => error.code === code),
      `Missing diagnostic ${code}: ${errors.map((error) => error.code).join(", ")}`,
    );
    const diagnostic = errors.find((error) => error.code === code);
    assert.match(diagnostic.path, /^\//u);
  });
}

test("resolves immutable generated definitions and route policy", async () => {
  const manifestModule = await import(
    "../../scripts/lib/system-manifest.mjs"
  );
  assert.equal(
    typeof manifestModule.resolveGeneratedDocDefinitions,
    "function",
  );
  assert.equal(
    typeof manifestModule.resolveGeneratedBundleProfile,
    "function",
  );

  const manifest = addGeneratedCapability(
    structuredClone(await canonicalManifest()),
  );
  const definitions =
    manifestModule.resolveGeneratedDocDefinitions(manifest);
  const resolved = manifestModule.resolveGeneratedBundleProfile(
    manifest,
    "library-maintenance",
  );
  const blocked = manifestModule.resolveGeneratedBundleProfile(
    manifest,
    "missing-route",
  );

  assert.deepEqual(definitions, manifest.generated_docs);
  assert.ok(Object.isFrozen(definitions));
  assert.ok(Object.isFrozen(definitions[0]));
  assert.equal(resolved.status, "resolved");
  assert.equal(resolved.route.id, "library-maintenance");
  assert.equal(resolved.profile.id, "library-maintenance");
  assert.equal(blocked.status, "blocked");
  assert.equal(blocked.blockers[0].code, "CONTEXT_BUNDLE_ROUTE_UNKNOWN");
  assert.equal(blocked.blockers[0].path, "/route_id");
});


test("canonical routes declare exact partial-cutover bundle policies", async () => {
  const manifest = await canonicalManifest();
  for (const profile of manifest.bundle_profiles) {
    assert.deepEqual(profile.generated_bundle.static_source_ids, profile.source_ids);
    const email = ["email-new-build", "email-continue-fix"].includes(profile.id);
    assert.equal(profile.generated_bundle.status, email ? "structured-active" : "structured-shadow");
    assert.equal(profile.generated_bundle.static_source_ids.includes("workflow-paused"), !email);
  }
  assert.deepEqual(
    manifest.generated_docs.map(({ id, output_source_id }) => ({
      id,
      output_source_id,
    })),
    [
      {
        id: "component-registry",
        output_source_id: "generated-component-registry",
      },
      {
        id: "typography-registry",
        output_source_id: "generated-typography-registry",
      },
      {
        id: "asset-registry",
        output_source_id: "generated-asset-registry",
      },
      {
        id: "naming-reference",
        output_source_id: "generated-naming-reference",
      },
    ],
  );
});


const componentDocumentationStandardSources = [
  [
    "component-contract-standard",
    "core/component-contract-standard.md",
    ["library-maintenance", "component-onboarding", "figma-description-sync", "email-new-build", "email-continue-fix"],
  ],
  [
    "figma-component-description-standard",
    "core/figma-component-description-standard.md",
    ["library-maintenance", "component-onboarding", "figma-description-sync"],
  ],
];

test("declares component documentation standards for library-facing bundles", async () => {
  const manifest = await canonicalManifest();
  const sources = new Map(
    manifest.sources.map((source) => [source.id, source]),
  );

  for (const [id, path, profileIds] of componentDocumentationStandardSources) {
    assert.deepEqual(sources.get(id), { id, kind: "core", path });
    assert.deepEqual(
      manifest.bundle_profiles
        .filter((profile) => profile.source_ids.includes(id))
        .map((profile) => profile.id),
      profileIds,
    );
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
test("declares the shadow rendering sources outside every active bundle", async () => {
  const manifest = await canonicalManifest();
  const sources = new Map(
    manifest.sources.map((source) => [source.id, source]),
  );

  assert.deepEqual(sources.get("rendering-foundation"), {
    id: "rendering-foundation",
    kind: "registry",
    path: "data/foundations/rendering.yaml",
  });
  assert.deepEqual(sources.get("rendering-schema"), {
    id: "rendering-schema",
    kind: "schema",
    path: "schemas/rendering.schema.json",
  });

  for (const profile of manifest.bundle_profiles) {
    assert.equal(profile.source_ids.includes("rendering-foundation"), false);
    assert.equal(profile.source_ids.includes("rendering-schema"), false);
  }
});

for (const [sourceId, code] of [
  ["rendering-foundation", "missing-rendering-source"],
  ["rendering-schema", "missing-rendering-schema-source"],
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
  ["rendering-foundation", "core"],
  ["rendering-schema", "registry"],
]) {
  test("reports invalid " + sourceId + " kind", async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      let source = manifest.sources.find((item) => item.id === sourceId);
      if (!source) {
        source = {
          id: sourceId,
          kind: sourceId === "rendering-schema" ? "schema" : "registry",
          path:
            sourceId === "rendering-schema"
              ? "schemas/rendering.schema.json"
              : "data/foundations/rendering.yaml",
        };
        manifest.sources.push(source);
      }
      source.kind = kind;
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) => error.code === "invalid-rendering-source-kind",
      ),
    );
  });
}

test("invalid rendering data blocks system validation", async (t) => {
  const root = await validFixture(t);
  await copyFixtureFile(
    repoRoot,
    root,
    "schemas/rendering.schema.json",
  );
  await copyFixtureFile(
    repoRoot,
    root,
    "data/foundations/rendering.yaml",
  );
  await mutateFixtureManifest(root, (manifest) => {
    if (!manifest.sources.some((item) => item.id === "rendering-foundation")) {
      manifest.sources.push({
        id: "rendering-foundation",
        kind: "registry",
        path: "data/foundations/rendering.yaml",
      });
    }
    if (!manifest.sources.some((item) => item.id === "rendering-schema")) {
      manifest.sources.push({
        id: "rendering-schema",
        kind: "schema",
        path: "schemas/rendering.schema.json",
      });
    }
  });
  const invalidData = (
    await readFile(join(root, "data/foundations/rendering.yaml"), "utf8")
  ).replace("value: 659", "value: 659.5");
  await writeFixtureFile(
    root,
    "data/foundations/rendering.yaml",
    invalidData,
  );

  const result = await validateSystem({ repoRoot: root });

  assert.ok(
    result.errors.some((error) => error.code === "rendering-schema"),
  );
});

test("declares the shadow renderer registry outside every active bundle", async () => {
  const manifest = await canonicalManifest();
  const sources = new Map(
    manifest.sources.map((source) => [source.id, source]),
  );

  assert.deepEqual(sources.get("renderer-registry"), {
    id: "renderer-registry",
    kind: "registry",
    path: "data/renderers/registry.yaml",
  });
  assert.deepEqual(sources.get("renderer-registry-schema"), {
    id: "renderer-registry-schema",
    kind: "schema",
    path: "schemas/renderer-registry.schema.json",
  });

  for (const profile of manifest.bundle_profiles) {
    assert.equal(profile.source_ids.includes("renderer-registry"), false);
    assert.equal(profile.source_ids.includes("renderer-registry-schema"), false);
  }
});

for (const [sourceId, code] of [
  ["renderer-registry", "missing-renderer-registry-source"],
  ["renderer-registry-schema", "missing-renderer-registry-schema-source"],
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
  ["renderer-registry", "core"],
  ["renderer-registry-schema", "registry"],
]) {
  test("reports invalid " + sourceId + " kind", async (t) => {
    const root = await validFixture(t);
    await mutateFixtureManifest(root, (manifest) => {
      const source = manifest.sources.find((item) => item.id === sourceId);
      source.kind = kind;
    });

    const result = await validateSystem({ repoRoot: root });

    assert.ok(
      result.errors.some(
        (error) => error.code === "invalid-renderer-registry-source-kind",
      ),
    );
  });
}

test("renderer coverage cannot reference an unknown component", async (t) => {
  const root = await validFixture(t);
  const registry = await readStrictYaml(
    join(root, "data/renderers/registry.yaml"),
  );
  registry.coverage[0].component_id = "missing-component";
  await writeFixtureFile(
    root,
    "data/renderers/registry.yaml",
    `${JSON.stringify(registry, null, 2)}\n`,
  );

  const result = await validateSystem({ repoRoot: root });

  assert.ok(
    result.errors.some(
      (error) => error.code === "RENDERER_COVERAGE_COMPONENT_UNKNOWN",
    ),
  );
});
