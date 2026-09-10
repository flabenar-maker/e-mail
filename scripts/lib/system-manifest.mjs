import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";
import { validateTypographyFoundation } from "./typography-foundation.mjs";
import { validateSpacingFoundation } from "./spacing-foundation.mjs";
import { validateAssetsFoundation } from "./assets-foundation.mjs";
import { validateFigmaNamingFoundation } from "./figma-naming-foundation.mjs";
import { validateComponentRegistries } from "./component-registry.mjs";
import {
  compareGeneratedDocs,
  renderAllGeneratedDocs,
} from "./generated-docs.mjs";

const SUPPORTED_MANIFEST_VERSION = "1.1.0";

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

function generatedBundleInputs(profile, activeCandidates) {
  const policy = profile.generated_bundle;
  const candidates =
    policy.component_selection === "none" ? [] : activeCandidates;
  const viewports =
    policy.viewport_selection === "none"
      ? []
      : policy.viewport_selection === "one-or-both"
        ? ["mobile"]
        : ["mobile", "desktop"];
  return { candidates, viewports, foundationIds: [] };
}

function routeBundleDiagnostic(route, routeIndex, error) {
  const suffix = error.path.startsWith("/") ? error.path : `/${error.path}`;
  return diagnostic(
    error.code,
    `/routes/${routeIndex}/generated_bundle${suffix}`,
    `Route ${route.id}: ${error.message}`,
  );
}

async function validateGeneratedRouteBundles({
  repoRoot,
  manifest,
  registries,
}) {
  // The bundle builder resolves route profiles through this module, so keep
  // this dependency dynamic and avoid a static ESM cycle.
  const { buildContextBundle, validateBundleClosure } = await import(
    "./context-bundle.mjs"
  );
  const activeCandidates = Object.values(registries)
    .flatMap(({ components }) => components)
    .filter(({ status }) => status === "active")
    .map(({ id }) => ({ id }))
    .sort((left, right) => left.id.localeCompare(right.id));
  const errors = [];

  for (const [routeIndex, route] of manifest.routes.entries()) {
    const profile = manifest.bundle_profiles.find(
      ({ id }) => id === route.bundle_profile_id,
    );
    const result = await buildContextBundle({
      repoRoot,
      routeId: route.id,
      ...generatedBundleInputs(profile, activeCandidates),
    });
    if (result.status === "blocked") {
      errors.push(
        ...result.blockers.map((error) =>
          routeBundleDiagnostic(route, routeIndex, error),
        ),
      );
      continue;
    }
    errors.push(
      ...validateBundleClosure(result.bundle).map((error) =>
        routeBundleDiagnostic(route, routeIndex, error),
      ),
    );
  }

  return sortDiagnostics(errors);
}

export function resolveGeneratedDocDefinitions(manifest) {
  return Object.freeze(
    (manifest.generated_docs ?? []).map((definition) =>
      Object.freeze(structuredClone(definition)),
    ),
  );
}

export function resolveGeneratedBundleProfile(manifest, routeId) {
  const route = manifest.routes.find((item) => item.id === routeId);
  if (!route) {
    return {
      status: "blocked",
      blockers: [
        diagnostic(
          "CONTEXT_BUNDLE_ROUTE_UNKNOWN",
          "/route_id",
          `Unknown route: ${routeId}.`,
        ),
      ],
    };
  }
  const profile = manifest.bundle_profiles.find(
    (item) => item.id === route.bundle_profile_id,
  );
  if (!profile?.generated_bundle) {
    return {
      status: "blocked",
      blockers: [
        diagnostic(
          "CONTEXT_BUNDLE_PROFILE_MISSING",
          `/bundle_profiles/${route.bundle_profile_id}`,
          `Route ${routeId} has no generated bundle profile.`,
        ),
      ],
    };
  }
  return { status: "resolved", route, profile };
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
  const profileById = new Map(
    manifest.bundle_profiles.map((profile) => [profile.id, profile]),
  );
  const generatedDocs = manifest.generated_docs ?? [];
  pushDuplicateDiagnostics(
    errors,
    generatedDocs,
    "id",
    "duplicate-generated-doc-id",
    "/generated_docs",
  );
  pushDuplicateDiagnostics(
    errors,
    generatedDocs,
    "output_source_id",
    "duplicate-generated-output-source",
    "/generated_docs",
  );

  generatedDocs.forEach((definition, definitionIndex) => {
    const outputSource = sourceById.get(definition.output_source_id);
    if (!outputSource) {
      errors.push(
        diagnostic(
          "unknown-generated-output-source",
          `/generated_docs/${definitionIndex}/output_source_id`,
          `Unknown generated output source: ${definition.output_source_id}.`,
        ),
      );
    } else if (outputSource.kind !== "generated") {
      errors.push(
        diagnostic(
          "invalid-generated-output-kind",
          `/generated_docs/${definitionIndex}/output_source_id`,
          `Generated output source must use kind generated: ${definition.output_source_id}.`,
        ),
      );
    }

    definition.input_source_ids.forEach((sourceId, sourceIndex) => {
      const inputSource = sourceById.get(sourceId);
      if (!inputSource) {
        errors.push(
          diagnostic(
            "unknown-generated-input-source",
            `/generated_docs/${definitionIndex}/input_source_ids/${sourceIndex}`,
            `Unknown generated input source: ${sourceId}.`,
          ),
        );
      } else if (inputSource.kind === "generated") {
        errors.push(
          diagnostic(
            "generated-input-cannot-be-generated",
            `/generated_docs/${definitionIndex}/input_source_ids/${sourceIndex}`,
            `Generated document input cannot itself be generated: ${sourceId}.`,
          ),
        );
      }
    });
  });

  const foundationIds = new Set([
    "typography",
    "spacing",
    "assets",
    "figma-naming",
  ]);
  const legacyRegistryIds = new Set([
    "component-descriptions-registry",
    "typography-registry",
  ]);
  const generatedCapabilityEnabled =
    generatedDocs.length > 0 ||
    manifest.bundle_profiles.some((profile) => profile.generated_bundle);

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

    const generatedBundle = profile.generated_bundle;
    if (!generatedBundle) return;

    generatedBundle.static_source_ids.forEach((sourceId, sourceIndex) => {
      const source = sourceById.get(sourceId);
      const path =
        `/bundle_profiles/${profileIndex}/generated_bundle/static_source_ids/${sourceIndex}`;
      if (!source) {
        errors.push(
          diagnostic(
            "unknown-generated-bundle-source",
            path,
            `Unknown generated bundle source: ${sourceId}.`,
          ),
        );
      } else if (source.kind === "generated") {
        errors.push(
          diagnostic(
            "generated-bundle-source-cannot-be-generated",
            path,
            `Generated bundle static source cannot itself be generated: ${sourceId}.`,
          ),
        );
      }
      if (legacyRegistryIds.has(sourceId)) {
        errors.push(
          diagnostic(
            "generated-bundle-legacy-registry-forbidden",
            path,
            `Legacy registry is forbidden in generated bundle: ${sourceId}.`,
          ),
        );
      }
    });

    for (const field of [
      "allowed_foundation_ids",
      "required_foundation_ids",
    ]) {
      generatedBundle[field].forEach((foundationId, foundationIndex) => {
        if (!foundationIds.has(foundationId)) {
          errors.push(
            diagnostic(
              "unknown-foundation-id",
              `/bundle_profiles/${profileIndex}/generated_bundle/${field}/${foundationIndex}`,
              `Unknown foundation id: ${foundationId}.`,
            ),
          );
        }
      });
    }
    generatedBundle.required_foundation_ids.forEach(
      (foundationId, foundationIndex) => {
        if (!generatedBundle.allowed_foundation_ids.includes(foundationId)) {
          errors.push(
            diagnostic(
              "required-foundation-not-allowed",
              `/bundle_profiles/${profileIndex}/generated_bundle/required_foundation_ids/${foundationIndex}`,
              `Required foundation must also be allowed: ${foundationId}.`,
            ),
          );
        }
      },
    );
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
    const profile = profileById.get(route.bundle_profile_id);
    if (generatedCapabilityEnabled && profile && !profile.generated_bundle) {
      errors.push(
        diagnostic(
          "route-generated-profile-missing",
          `/routes/${routeIndex}/bundle_profile_id`,
          `Route ${route.id} has no generated bundle profile.`,
        ),
      );
    }
  });

  const declaredPaths = new Set([
    manifest.entrypoints.repository,
    manifest.entrypoints.bootstrap,
    ...manifest.sources
      .filter((source) => source.kind !== "generated")
      .map((source) => source.path),
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


function resolveFigmaNamingSources(manifest) {
  const errors = [];
  const figmaNamingSource = manifest.sources.find(
    (source) => source.id === "figma-naming-foundation",
  );
  const figmaNamingSchemaSource = manifest.sources.find(
    (source) => source.id === "figma-naming-schema",
  );

  if (!figmaNamingSource) {
    errors.push(
      diagnostic(
        "missing-figma-naming-source",
        "/sources",
        "Figma naming foundation source must be declared.",
      ),
    );
  } else if (figmaNamingSource.kind !== "registry") {
    errors.push(
      diagnostic(
        "invalid-figma-naming-source-kind",
        "/sources/figma-naming-foundation/kind",
        "Figma naming foundation source kind must be registry.",
      ),
    );
  }

  if (!figmaNamingSchemaSource) {
    errors.push(
      diagnostic(
        "missing-figma-naming-schema-source",
        "/sources",
        "Figma naming schema source must be declared.",
      ),
    );
  } else if (figmaNamingSchemaSource.kind !== "schema") {
    errors.push(
      diagnostic(
        "invalid-figma-naming-source-kind",
        "/sources/figma-naming-schema/kind",
        "Figma naming schema source kind must be schema.",
      ),
    );
  }

  return {
    figmaNamingSource,
    figmaNamingSchemaSource,
    errors: sortDiagnostics(errors),
  };
}


const COMPONENT_REGISTRY_SOURCES = [
  {
    id: "components-shared",
    key: "sharedSource",
    kind: "registry",
    path: "data/components/shared.yaml",
  },
  {
    id: "components-marketing",
    key: "marketingSource",
    kind: "registry",
    path: "data/components/marketing.yaml",
  },
  {
    id: "components-service",
    key: "serviceSource",
    kind: "registry",
    path: "data/components/service.yaml",
  },
  {
    id: "components-schema",
    key: "schemaSource",
    kind: "schema",
    path: "schemas/components.schema.json",
  },
];

export function resolveComponentRegistrySources(manifest) {
  const errors = [];
  const result = {};

  for (const expected of COMPONENT_REGISTRY_SOURCES) {
    const source = manifest.sources.find((item) => item.id === expected.id);
    result[expected.key] = source ?? null;
    if (!source) {
      errors.push(
        diagnostic(
          `missing-${expected.id}-source`,
          "/sources",
          `Component registry source must be declared: ${expected.id}.`,
        ),
      );
      continue;
    }
    if (source.kind !== expected.kind) {
      errors.push(
        diagnostic(
          "invalid-component-registry-source-kind",
          `/sources/${expected.id}/kind`,
          `Source ${expected.id} must use kind ${expected.kind}.`,
        ),
      );
    }
    if (source.path !== expected.path) {
      errors.push(
        diagnostic(
          "invalid-component-registry-source-path",
          `/sources/${expected.id}/path`,
          `Source ${expected.id} must use its canonical path.`,
        ),
      );
    }
  }

  return {
    ...result,
    errors: sortDiagnostics(errors),
  };
}


const COMPONENT_DOCUMENTATION_STANDARD_SOURCES = [
  {
    id: "component-contract-standard",
    kind: "core",
    path: "core/component-contract-standard.md",
  },
  {
    id: "figma-component-description-standard",
    kind: "core",
    path: "core/figma-component-description-standard.md",
  },
];

function resolveComponentDocumentationStandardSources(manifest) {
  const errors = [];

  for (const expected of COMPONENT_DOCUMENTATION_STANDARD_SOURCES) {
    const source = manifest.sources.find((item) => item.id === expected.id);
    if (!source) {
      errors.push(
        diagnostic(
          `missing-${expected.id}-source`,
          "/sources",
          `Component documentation standard source must be declared: ${expected.id}.`,
        ),
      );
      continue;
    }
    if (source.kind !== expected.kind) {
      errors.push(
        diagnostic(
          "invalid-component-documentation-standard-source-kind",
          `/sources/${expected.id}/kind`,
          `Source ${expected.id} must use kind ${expected.kind}.`,
        ),
      );
    }
    if (source.path !== expected.path) {
      errors.push(
        diagnostic(
          "invalid-component-documentation-standard-source-path",
          `/sources/${expected.id}/path`,
          `Source ${expected.id} must use its canonical path.`,
        ),
      );
    }
  }

  return { errors: sortDiagnostics(errors) };
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
    const figmaNamingSources = resolveFigmaNamingSources(manifest);
    const componentSources = resolveComponentRegistrySources(manifest);
    const componentDocumentationSources =
      resolveComponentDocumentationStandardSources(manifest);
    const prerequisiteErrors = sortDiagnostics([
      ...manifestErrors,
      ...typographySources.errors,
      ...spacingSources.errors,
      ...assetsSources.errors,
      ...figmaNamingSources.errors,
      ...componentSources.errors,
      ...componentDocumentationSources.errors,
    ]);
    if (prerequisiteErrors.length > 0) {
      return { manifest, errors: prerequisiteErrors };
    }

    const [typographyResult, spacingResult, assetsResult, figmaNamingResult] =
      await Promise.all([
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
      validateFigmaNamingFoundation({
        repoRoot,
        dataPath: figmaNamingSources.figmaNamingSource.path,
        schemaPath: figmaNamingSources.figmaNamingSchemaSource.path,
      }),
    ]);
    const foundationErrors = sortDiagnostics([
      ...typographyResult.errors,
      ...spacingResult.errors,
      ...assetsResult.errors,
      ...figmaNamingResult.errors,
    ]);
    if (foundationErrors.length > 0) {
      return { manifest, errors: foundationErrors };
    }

    const componentResult = await validateComponentRegistries({
      repoRoot,
      sources: {
        shared: componentSources.sharedSource.path,
        marketing: componentSources.marketingSource.path,
        service: componentSources.serviceSource.path,
      },
      schemaPath: componentSources.schemaSource.path,
      typography: typographyResult.typography,
      spacing: spacingResult.spacing,
      assets: assetsResult.assets,
    });

    if (componentResult.errors.length > 0) {
      return {
        manifest,
        errors: sortDiagnostics(componentResult.errors),
      };
    }

    const renderedDocs = await renderAllGeneratedDocs({ repoRoot, manifest });
    const generatedDocErrors = await compareGeneratedDocs({
      repoRoot,
      rendered: renderedDocs,
    });
    if (generatedDocErrors.length > 0) {
      return {
        manifest,
        errors: sortDiagnostics(generatedDocErrors),
      };
    }

    const generatedBundleErrors = await validateGeneratedRouteBundles({
      repoRoot,
      manifest,
      registries: componentResult.registries,
    });

    return {
      manifest,
      errors: generatedBundleErrors,
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
