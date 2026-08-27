import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";
import { validateTypographyFoundation } from "./typography-foundation.mjs";
import { validateSpacingFoundation } from "./spacing-foundation.mjs";
import { validateAssetsFoundation } from "./assets-foundation.mjs";

const SUPPORTED_MANIFEST_VERSION = "1.0.0";

export function validateManifestShape(manifest, schema) {
  return validateDocumentShape({
    document: manifest,
    schema,
    supportedVersion: SUPPORTED_MANIFEST_VERSION,
    versionCode: "manifest-version-unsupported",
    schemaCode: "manifest-schema",
  });
}

export async function loadSystemManifest({
  repoRoot,
  manifestPath = "system/manifest.yaml",
}) {
  const manifest = await readStrictYaml(join(repoRoot, manifestPath));
  const schema = JSON.parse(
    await readFile(join(repoRoot, "schemas/manifest.schema.json"), "utf8"),
  );
  const errors = validateManifestShape(manifest, schema);
  if (errors.length > 0) {
    throw new AggregateError(errors, "System manifest validation failed.");
  }
  return manifest;
}

function duplicateValues(items, key) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items) {
    const value = item[key];
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }
  return [...duplicates].sort();
}

function diagnostic(code, path, message) {
  return new SystemValidationError(code, path, message);
}

function sortDiagnostics(errors) {
  return errors.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function validateSkill(skill, required, repoRoot) {
  const skillFile = resolve(repoRoot, skill.path, "SKILL.md");
  if (!(await exists(skillFile))) {
    return required
      ? [
          diagnostic(
            "missing-required-skill",
            `/${skill.path}/SKILL.md`,
            `Required skill is missing: ${skill.id}.`,
          ),
        ]
      : [];
  }

  try {
    const content = await readFile(skillFile, "utf8");
    const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(content);
    if (!match) {
      return [
        diagnostic(
          "skill-name-mismatch",
          `/${skill.path}/SKILL.md`,
          `Skill frontmatter name must equal ${skill.id}.`,
        ),
      ];
    }
    const frontmatter = await import("./strict-yaml.mjs").then(
      ({ parseStrictYaml }) =>
        parseStrictYaml(match[1], `/${skill.path}/SKILL.md#frontmatter`),
    );
    if (frontmatter?.name !== skill.id) {
      return [
        diagnostic(
          "skill-name-mismatch",
          `/${skill.path}/SKILL.md`,
          `Skill frontmatter name must equal ${skill.id}.`,
        ),
      ];
    }
  } catch {
    return [
      diagnostic(
        "skill-name-mismatch",
        `/${skill.path}/SKILL.md`,
        `Skill frontmatter name must equal ${skill.id}.`,
      ),
    ];
  }

  return [];
}

function pushDuplicateDiagnostics(errors, items, key, code, path) {
  for (const value of duplicateValues(items, key)) {
    errors.push(
      diagnostic(code, path, `Duplicate ${key} value: ${value}.`),
    );
  }
}

export async function validateManifestSemantics(manifest, repoRoot) {
  const errors = [];
  pushDuplicateDiagnostics(
    errors,
    manifest.sources,
    "id",
    "duplicate-source-id",
    "/sources",
  );
  pushDuplicateDiagnostics(
    errors,
    manifest.sources,
    "path",
    "duplicate-source-path",
    "/sources",
  );
  pushDuplicateDiagnostics(
    errors,
    manifest.bundle_profiles,
    "id",
    "duplicate-bundle-profile-id",
    "/bundle_profiles",
  );
  pushDuplicateDiagnostics(
    errors,
    manifest.routes,
    "id",
    "duplicate-route-id",
    "/routes",
  );

  const allSkills = [
    ...manifest.skills.required,
    ...manifest.skills.optional,
  ];
  pushDuplicateDiagnostics(
    errors,
    allSkills,
    "id",
    "duplicate-skill-id",
    "/skills",
  );
  pushDuplicateDiagnostics(
    errors,
    allSkills,
    "path",
    "duplicate-skill-path",
    "/skills",
  );

  const sourceById = new Map(
    manifest.sources.map((source) => [source.id, source]),
  );
  const profileIds = new Set(
    manifest.bundle_profiles.map((profile) => profile.id),
  );

  manifest.bundle_profiles.forEach((profile, profileIndex) => {
    profile.source_ids.forEach((sourceId, sourceIndex) => {
      if (!sourceById.has(sourceId)) {
        errors.push(
          diagnostic(
            "unknown-source-reference",
            `/bundle_profiles/${profileIndex}/source_ids/${sourceIndex}`,
            `Unknown source reference: ${sourceId}.`,
          ),
        );
      }
    });
  });

  manifest.routes.forEach((route, routeIndex) => {
    const workflowSource = sourceById.get(route.workflow_source_id);
    if (!workflowSource || workflowSource.kind !== "workflow") {
      errors.push(
        diagnostic(
          "invalid-workflow-reference",
          `/routes/${routeIndex}/workflow_source_id`,
          `Workflow reference must resolve to a workflow source: ${route.workflow_source_id}.`,
        ),
      );
    }
    if (!profileIds.has(route.bundle_profile_id)) {
      errors.push(
        diagnostic(
          "unknown-bundle-profile-reference",
          `/routes/${routeIndex}/bundle_profile_id`,
          `Unknown bundle profile reference: ${route.bundle_profile_id}.`,
        ),
      );
    }
  });

  const declaredPaths = new Set([
    manifest.entrypoints.repository,
    manifest.entrypoints.bootstrap,
    ...manifest.sources.map((source) => source.path),
    manifest.bootstrap.portable_config,
    manifest.bootstrap.verifier,
  ]);
  for (const declaredPath of [...declaredPaths].sort()) {
    if (!(await exists(resolve(repoRoot, declaredPath)))) {
      errors.push(
        diagnostic(
          "missing-declared-path",
          `/${declaredPath}`,
          `Declared repository path is missing: ${declaredPath}.`,
        ),
      );
    }
  }

  for (const skill of manifest.skills.required) {
    errors.push(...(await validateSkill(skill, true, repoRoot)));
  }
  for (const skill of manifest.skills.optional) {
    errors.push(...(await validateSkill(skill, false, repoRoot)));
  }

  for (const skill of allSkills) {
    const legacyPath = resolve(repoRoot, "skills", skill.id);
    if (await exists(legacyPath)) {
      errors.push(
        diagnostic(
          "legacy-skill-path",
          `/skills/${skill.id}`,
          `Legacy skill directory must be removed: skills/${skill.id}.`,
        ),
      );
    }
  }

  if (await exists(resolve(repoRoot, "bootstrap/manifest.yaml"))) {
    errors.push(
      diagnostic(
        "legacy-manifest-path",
        "/bootstrap/manifest.yaml",
        "Legacy bootstrap manifest must be removed.",
      ),
    );
  }

  return sortDiagnostics(errors);
}

function resolveTypographySources(manifest) {
  const errors = [];
  const typographySource = manifest.sources.find(
    (source) => source.id === "typography-foundation",
  );
  const typographySchemaSource = manifest.sources.find(
    (source) => source.id === "typography-schema",
  );

  if (!typographySource) {
    errors.push(
      diagnostic(
        "missing-typography-source",
        "/sources",
        "Typography foundation source must be declared.",
      ),
    );
  } else if (typographySource.kind !== "registry") {
    errors.push(
      diagnostic(
        "invalid-typography-source-kind",
        "/sources/typography-foundation/kind",
        "Typography foundation source kind must be registry.",
      ),
    );
  }

  if (!typographySchemaSource) {
    errors.push(
      diagnostic(
        "missing-typography-schema-source",
        "/sources",
        "Typography schema source must be declared.",
      ),
    );
  } else if (typographySchemaSource.kind !== "schema") {
    errors.push(
      diagnostic(
        "invalid-typography-source-kind",
        "/sources/typography-schema/kind",
        "Typography schema source kind must be schema.",
      ),
    );
  }

  return {
    typographySource,
    typographySchemaSource,
    errors: sortDiagnostics(errors),
  };
}

function resolveSpacingSources(manifest) {
  const errors = [];
  const spacingSource = manifest.sources.find(
    (source) => source.id === "spacing-foundation",
  );
  const spacingSchemaSource = manifest.sources.find(
    (source) => source.id === "spacing-schema",
  );

  if (!spacingSource) {
    errors.push(
      diagnostic(
        "missing-spacing-source",
        "/sources",
        "Spacing foundation source must be declared.",
      ),
    );
  } else if (spacingSource.kind !== "registry") {
    errors.push(
      diagnostic(
        "invalid-spacing-source-kind",
        "/sources/spacing-foundation/kind",
        "Spacing foundation source kind must be registry.",
      ),
    );
  }

  if (!spacingSchemaSource) {
    errors.push(
      diagnostic(
        "missing-spacing-schema-source",
        "/sources",
        "Spacing schema source must be declared.",
      ),
    );
  } else if (spacingSchemaSource.kind !== "schema") {
    errors.push(
      diagnostic(
        "invalid-spacing-source-kind",
        "/sources/spacing-schema/kind",
        "Spacing schema source kind must be schema.",
      ),
    );
  }

  return {
    spacingSource,
    spacingSchemaSource,
    errors: sortDiagnostics(errors),
  };
}

function resolveAssetsSources(manifest) {
  const errors = [];
  const assetsSource = manifest.sources.find(
    (source) => source.id === "assets-foundation",
  );
  const assetsSchemaSource = manifest.sources.find(
    (source) => source.id === "assets-schema",
  );

  if (!assetsSource) {
    errors.push(
      diagnostic(
        "missing-assets-source",
        "/sources",
        "Assets foundation source must be declared.",
      ),
    );
  } else if (assetsSource.kind !== "registry") {
    errors.push(
      diagnostic(
        "invalid-assets-source-kind",
        "/sources/assets-foundation/kind",
        "Assets foundation source kind must be registry.",
      ),
    );
  }

  if (!assetsSchemaSource) {
    errors.push(
      diagnostic(
        "missing-assets-schema-source",
        "/sources",
        "Assets schema source must be declared.",
      ),
    );
  } else if (assetsSchemaSource.kind !== "schema") {
    errors.push(
      diagnostic(
        "invalid-assets-source-kind",
        "/sources/assets-schema/kind",
        "Assets schema source kind must be schema.",
      ),
    );
  }

  return {
    assetsSource,
    assetsSchemaSource,
    errors: sortDiagnostics(errors),
  };
}


export async function validateSystem({
  repoRoot,
  manifestPath = "system/manifest.yaml",
}) {
  try {
    const manifest = await loadSystemManifest({ repoRoot, manifestPath });
    const manifestErrors = await validateManifestSemantics(manifest, repoRoot);
    const typographySources = resolveTypographySources(manifest);
    const spacingSources = resolveSpacingSources(manifest);
    const assetsSources = resolveAssetsSources(manifest);
    const prerequisiteErrors = sortDiagnostics([
      ...manifestErrors,
      ...typographySources.errors,
      ...spacingSources.errors,
      ...assetsSources.errors,
    ]);
    if (prerequisiteErrors.length > 0) {
      return { manifest, errors: prerequisiteErrors };
    }

    const [typographyResult, spacingResult, assetsResult] = await Promise.all([
      validateTypographyFoundation({
        repoRoot,
        dataPath: typographySources.typographySource.path,
        schemaPath: typographySources.typographySchemaSource.path,
      }),
      validateSpacingFoundation({
        repoRoot,
        dataPath: spacingSources.spacingSource.path,
        schemaPath: spacingSources.spacingSchemaSource.path,
      }),
      validateAssetsFoundation({
        repoRoot,
        dataPath: assetsSources.assetsSource.path,
        schemaPath: assetsSources.assetsSchemaSource.path,
      }),
    ]);
    return {
      manifest,
      errors: sortDiagnostics([
        ...typographyResult.errors,
        ...spacingResult.errors,
        ...assetsResult.errors,
      ]),
    };
  } catch (error) {
    if (error instanceof AggregateError) {
      return { manifest: null, errors: error.errors };
    }
    if (error instanceof SystemValidationError) {
      return { manifest: null, errors: [error] };
    }
    return {
      manifest: null,
      errors: [
        diagnostic(
          "manifest-read",
          `/${manifestPath}`,
          "System manifest could not be read.",
        ),
      ],
    };
  }
}
