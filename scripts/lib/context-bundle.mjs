import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  loadAssetsFoundation,
  validateAssetsSemantics,
} from "./assets-foundation.mjs";
import {
  collectComponentReferences,
  indexComponentRegistries,
  loadComponentRegistries,
  resolveComponentContracts,
  resolveComponentFoundationReference,
  validateComponentRegistrySemantics,
} from "./component-registry.mjs";
import {
  canonicalize,
  digestStructuredEntries,
  digestTextEntries,
} from "./content-digest.mjs";
import { SystemValidationError } from "./diagnostics.mjs";
import {
  loadFigmaNamingFoundation,
  validateFigmaNamingSemantics,
} from "./figma-naming-foundation.mjs";
import {
  loadSpacingFoundation,
  validateSpacingSemantics,
} from "./spacing-foundation.mjs";
import {
  loadSystemManifest,
  resolveGeneratedBundleProfile,
} from "./system-manifest.mjs";
import {
  loadTypographyFoundation,
  validateTypographySemantics,
} from "./typography-foundation.mjs";

const VIEWPORTS = ["mobile", "desktop"];
const FOUNDATION_IDS = ["typography", "spacing", "assets", "figma-naming"];
const ASSET_DEFINITION_FIELDS = [
  ["source_modes", "source_mode_id"],
  ["display_modes", "display_mode_id"],
  ["export_profiles", "export_profile_id"],
  ["alpha_modes", "alpha_mode_id"],
  ["clipping_policies", "clipping_policy_id"],
];

function diagnostic(code, path, message, handoff) {
  const result = { code, path, message };
  if (handoff !== undefined) result.handoff = structuredClone(handoff);
  return result;
}

function asBlocker(error) {
  return diagnostic(error.code, error.path, error.message, error.handoff);
}

function compareDiagnostics(left, right) {
  return (
    left.path.localeCompare(right.path) ||
    left.code.localeCompare(right.code) ||
    left.message.localeCompare(right.message)
  );
}

function stableBlockers(blockers) {
  const unique = new Map();
  for (const blocker of blockers) {
    const key = canonicalize(blocker);
    if (!unique.has(key)) unique.set(key, blocker);
  }
  return [...unique.values()].sort(compareDiagnostics);
}

function blocked(blockers) {
  return { status: "blocked", blockers: stableBlockers(blockers) };
}

function caughtBlockers(error) {
  if (error instanceof AggregateError) {
    return error.errors.flatMap(caughtBlockers);
  }
  if (error instanceof SystemValidationError) {
    return [asBlocker(error)];
  }
  return [
    diagnostic(
      "CONTEXT_BUNDLE_READ_FAILED",
      "/",
      "The context bundle source data could not be read.",
    ),
  ];
}

function uniqueStrings(values) {
  return [...new Set(values ?? [])];
}

function sourceById(manifest, id) {
  return manifest.sources.find((source) => source.id === id) ?? null;
}

function requireSource(manifest, id) {
  const source = sourceById(manifest, id);
  if (!source) {
    throw new SystemValidationError(
      "CONTEXT_BUNDLE_SOURCE_UNKNOWN",
      `/sources/${id}`,
      `Unknown source: ${id}.`,
    );
  }
  return source;
}

function sourcePath(manifest, id) {
  return requireSource(manifest, id).path;
}

async function loadModel(repoRoot, manifest) {
  const componentSources = {
    shared: sourcePath(manifest, "components-shared"),
    marketing: sourcePath(manifest, "components-marketing"),
    service: sourcePath(manifest, "components-service"),
  };
  const componentSchemaPath = sourcePath(manifest, "components-schema");
  const [registries, typography, spacing, assets, figmaNaming] =
    await Promise.all([
      loadComponentRegistries({
        repoRoot,
        sources: componentSources,
        schemaPath: componentSchemaPath,
      }),
      loadTypographyFoundation({
        repoRoot,
        dataPath: sourcePath(manifest, "typography-foundation"),
        schemaPath: sourcePath(manifest, "typography-schema"),
      }),
      loadSpacingFoundation({
        repoRoot,
        dataPath: sourcePath(manifest, "spacing-foundation"),
        schemaPath: sourcePath(manifest, "spacing-schema"),
      }),
      loadAssetsFoundation({
        repoRoot,
        dataPath: sourcePath(manifest, "assets-foundation"),
        schemaPath: sourcePath(manifest, "assets-schema"),
      }),
      loadFigmaNamingFoundation({
        repoRoot,
        dataPath: sourcePath(manifest, "figma-naming-foundation"),
        schemaPath: sourcePath(manifest, "figma-naming-schema"),
      }),
    ]);

  const errors = [
    ...validateTypographySemantics(typography),
    ...validateSpacingSemantics(spacing),
    ...validateAssetsSemantics(assets),
    ...validateFigmaNamingSemantics(figmaNaming),
    ...validateComponentRegistrySemantics({
      registries,
      typography,
      spacing,
      assets,
    }),
  ];
  if (errors.length > 0) {
    throw new AggregateError(errors, "Context bundle sources are invalid.");
  }

  return {
    registries,
    index: indexComponentRegistries(registries, {
      typography,
      spacing,
      assets,
    }),
    foundations: {
      typography,
      spacing,
      assets,
      "figma-naming": figmaNaming,
    },
  };
}

function validateSelections(profile, candidates, viewports, foundationIds) {
  const blockers = [];
  const policy = profile.generated_bundle;

  if (policy.component_selection === "required" && candidates.length === 0) {
    blockers.push(
      diagnostic(
        "CONTEXT_BUNDLE_COMPONENT_REQUIRED",
        "/candidates",
        `Bundle profile ${profile.id} requires at least one component.`,
      ),
    );
  } else if (
    policy.component_selection === "none" &&
    candidates.length > 0
  ) {
    blockers.push(
      diagnostic(
        "CONTEXT_BUNDLE_COMPONENT_FORBIDDEN",
        "/candidates",
        `Bundle profile ${profile.id} does not accept components.`,
      ),
    );
  }

  for (const [index, viewport] of viewports.entries()) {
    if (!VIEWPORTS.includes(viewport)) {
      blockers.push(
        diagnostic(
          "CONTEXT_BUNDLE_VIEWPORT_UNKNOWN",
          `/viewports/${index}`,
          `Unknown viewport: ${String(viewport)}.`,
        ),
      );
    }
  }
  if (
    policy.viewport_selection === "one-or-both" &&
    viewports.length === 0
  ) {
    blockers.push(
      diagnostic(
        "CONTEXT_BUNDLE_VIEWPORT_REQUIRED",
        "/viewports",
        `Bundle profile ${profile.id} requires one or both viewports.`,
      ),
    );
  } else if (
    (policy.viewport_selection === "both" ||
      (policy.viewport_selection === "both-when-components" &&
        candidates.length > 0)) &&
    !VIEWPORTS.every((viewport) => viewports.includes(viewport))
  ) {
    blockers.push(
      diagnostic(
        "CONTEXT_BUNDLE_BOTH_VIEWPORTS_REQUIRED",
        "/viewports",
        `Bundle profile ${profile.id} requires mobile and desktop.`,
      ),
    );
  } else if (
    policy.viewport_selection === "none" &&
    viewports.length > 0
  ) {
    blockers.push(
      diagnostic(
        "CONTEXT_BUNDLE_VIEWPORT_FORBIDDEN",
        "/viewports",
        `Bundle profile ${profile.id} does not accept viewports.`,
      ),
    );
  }

  if (policy.foundation_selection === "none" && foundationIds.length > 0) {
    blockers.push(
      diagnostic(
        "CONTEXT_BUNDLE_FOUNDATION_FORBIDDEN",
        "/foundation_ids",
        `Bundle profile ${profile.id} does not accept foundations.`,
      ),
    );
  } else if (
    policy.foundation_selection === "referenced" &&
    foundationIds.length > 0
  ) {
    blockers.push(
      diagnostic(
        "CONTEXT_BUNDLE_FOUNDATION_EXPLICIT_FORBIDDEN",
        "/foundation_ids",
        `Bundle profile ${profile.id} accepts referenced foundations only.`,
      ),
    );
  }

  foundationIds.forEach((id, index) => {
    if (!FOUNDATION_IDS.includes(id)) {
      blockers.push(
        diagnostic(
          "CONTEXT_BUNDLE_FOUNDATION_UNKNOWN",
          `/foundation_ids/${index}`,
          `Unknown foundation: ${String(id)}.`,
        ),
      );
    } else if (!policy.allowed_foundation_ids.includes(id)) {
      blockers.push(
        diagnostic(
          "CONTEXT_BUNDLE_FOUNDATION_NOT_ALLOWED",
          `/foundation_ids/${index}`,
          `Foundation ${id} is not allowed by bundle profile ${profile.id}.`,
        ),
      );
    }
  });

  return stableBlockers(blockers);
}

function resolveRootIds(index, candidates, viewports) {
  const blockers = [];
  const ids = new Set();
  const resolverViewports = viewports.length > 0 ? viewports : ["mobile"];

  for (const viewport of resolverViewports) {
    const result = resolveComponentContracts({ index, candidates, viewport });
    if (result.status === "blocked") {
      blockers.push(...result.blockers.map(asBlocker));
    } else {
      result.components.forEach(({ id }) => ids.add(id));
    }
  }
  return blockers.length > 0
    ? blocked(blockers)
    : { status: "resolved", ids: [...ids].sort() };
}

function collectDependencyClosure(index, rootIds, viewports) {
  const ordered = [];
  const state = new Map();
  const blockers = [];

  function visit(id, reference = null) {
    if (state.get(id) === "done") return;
    if (state.get(id) === "visiting") {
      blockers.push(
        diagnostic(
          "CONTEXT_BUNDLE_COMPONENT_CYCLE",
          reference?.path ?? `/components/${id}`,
          `Component dependency cycle includes ${id}.`,
        ),
      );
      return;
    }

    const record = index.bySystemId.get(id);
    if (!record) {
      blockers.push(
        diagnostic(
          "CONTEXT_BUNDLE_COMPONENT_UNRESOLVED",
          reference?.path ?? `/components/${id}`,
          `Referenced component ${id} is not registered.`,
        ),
      );
      return;
    }
    if (record.status !== "active") {
      blockers.push(
        diagnostic(
          "COMPONENT_NOT_ACTIVE",
          reference?.path ?? `/components/${id}`,
          `Component ${id} is not active.`,
        ),
      );
      return;
    }
    for (const viewport of viewports) {
      if (!record.contracts?.[viewport]?.root) {
        blockers.push(
          diagnostic(
            "COMPONENT_REGISTRY_INCOMPLETE_VIEWPORT",
            reference?.path ?? `${id}/contracts/${viewport}`,
            `Component ${id} has no ${viewport} contract.`,
          ),
        );
      }
    }
    if (blockers.length > 0 && !viewports.every((v) => record.contracts?.[v])) {
      return;
    }

    state.set(id, "visiting");
    const references = collectComponentReferences(record, { viewports })
      .components.map((item) => ({
        id: item.id,
        path: `${record.id}${item.path}`,
      }))
      .sort(
        (left, right) =>
          left.id.localeCompare(right.id) || left.path.localeCompare(right.path),
      );
    for (const child of references) visit(child.id, child);
    state.set(id, "done");
    ordered.push(record);
  }

  for (const id of [...rootIds].sort()) visit(id);
  return blockers.length > 0
    ? blocked(blockers)
    : { status: "resolved", records: ordered };
}

function relevantVariants(variants, viewports) {
  const selected = new Set(viewports.map((viewport) => viewport.toLowerCase()));
  return (variants ?? []).filter((variant) => {
    const axis = variant.axes?.find(({ name }) => name === "Viewport");
    return !axis || selected.has(String(axis.value).toLowerCase());
  });
}

function referencedIds(record, viewports, key) {
  return new Set(
    collectComponentReferences(record, { viewports })[key].map(({ id }) => id),
  );
}

function projectComponent(record, viewports) {
  const propertyIds = referencedIds(record, viewports, "properties");
  const assetIds = referencedIds(record, viewports, "assets");
  return {
    id: record.id,
    status: record.status,
    identity: structuredClone(record.identity),
    figma: structuredClone(record.figma),
    variants: structuredClone(relevantVariants(record.variants, viewports)),
    properties: structuredClone(
      (record.properties ?? []).filter(({ id }) => propertyIds.has(id)),
    ),
    asset_contracts: structuredClone(
      (record.asset_contracts ?? []).filter(({ id }) => assetIds.has(id)),
    ),
    contracts: Object.fromEntries(
      viewports.map((viewport) => [
        viewport,
        structuredClone(record.contracts[viewport]),
      ]),
    ),
    documentation: structuredClone(record.documentation),
    constraints: structuredClone(record.constraints),
    provenance: structuredClone(record.provenance),
  };
}

function definitionKey(definition) {
  return [
    definition.foundation_id,
    definition.definition_group,
    definition.definition_id,
    definition.viewport ?? "",
  ].join("/");
}

function compareDefinitions(left, right) {
  const base =
    left.foundation_id.localeCompare(right.foundation_id) ||
    left.definition_group.localeCompare(right.definition_group) ||
    left.definition_id.localeCompare(right.definition_id);
  if (base !== 0) return base;
  return (
    VIEWPORTS.indexOf(left.viewport) - VIEWPORTS.indexOf(right.viewport)
  );
}

function fullFoundationDefinition(id, foundation) {
  return {
    foundation_id: id,
    schema_version: foundation.schema_version,
    definition_group: "foundation",
    definition_id: "all",
    value: structuredClone(foundation),
  };
}

function referencedFoundationDefinition(reference, model) {
  const resolved = resolveComponentFoundationReference(reference, {
    typography: model.foundations.typography,
    spacing: model.foundations.spacing,
  });
  if (reference.foundationId === "typography") {
    return {
      foundation_id: "typography",
      schema_version: model.foundations.typography.schema_version,
      definition_group: reference.group,
      definition_id: reference.id,
      viewport: reference.viewport,
      value: structuredClone(resolved.definition),
    };
  }
  const role = resolved.definition;
  return {
    foundation_id: "spacing",
    schema_version: model.foundations.spacing.schema_version,
    definition_group: reference.group,
    definition_id: reference.id,
    viewport: reference.viewport,
    value: structuredClone(role.resolutions[reference.viewport]),
  };
}

function assetFoundationDefinitions(component, assets) {
  const definitions = [];
  for (const contract of component.asset_contracts) {
    for (const [group, field] of ASSET_DEFINITION_FIELDS) {
      const id = contract[field];
      const value = assets[group].find((item) => item.id === id);
      if (value) {
        definitions.push({
          foundation_id: "assets",
          schema_version: assets.schema_version,
          definition_group: group,
          definition_id: id,
          value: structuredClone(value),
        });
      }
    }
  }
  return definitions;
}

function collectFoundationDefinitions({
  components,
  viewports,
  model,
  requestedIds,
  policy,
}) {
  const blockers = [];
  const definitions = [];
  const explicitIds = new Set([
    ...requestedIds,
    ...policy.required_foundation_ids,
  ]);

  for (const id of [...explicitIds].sort()) {
    if (!policy.allowed_foundation_ids.includes(id)) continue;
    definitions.push(fullFoundationDefinition(id, model.foundations[id]));
  }

  for (const component of components) {
    const references = collectComponentReferences(component, { viewports });
    for (const reference of references.foundations) {
      if (!policy.allowed_foundation_ids.includes(reference.foundationId)) {
        blockers.push(
          diagnostic(
            "CONTEXT_BUNDLE_FOUNDATION_NOT_ALLOWED",
            `${component.id}${reference.path}`,
            `Foundation ${reference.foundationId} is not allowed by this route.`,
          ),
        );
        continue;
      }
      try {
        definitions.push(referencedFoundationDefinition(reference, model));
      } catch (error) {
        blockers.push(...caughtBlockers(error));
      }
    }
    if (
      component.asset_contracts.length > 0 &&
      !explicitIds.has("assets")
    ) {
      if (!policy.allowed_foundation_ids.includes("assets")) {
        blockers.push(
          diagnostic(
            "CONTEXT_BUNDLE_FOUNDATION_NOT_ALLOWED",
            `${component.id}/asset_contracts`,
            "The Assets foundation is not allowed by this route.",
          ),
        );
      } else {
        definitions.push(
          ...assetFoundationDefinitions(
            component,
            model.foundations.assets,
          ),
        );
      }
    }
  }

  const unique = new Map();
  for (const definition of definitions) {
    const key = definitionKey(definition);
    if (!unique.has(key)) unique.set(key, definition);
  }
  return blockers.length > 0
    ? blocked(blockers)
    : {
        status: "resolved",
        definitions: [...unique.values()].sort(compareDefinitions),
      };
}

function closurePath(componentId, path) {
  return `${componentId}${path}`;
}

export function validateBundleClosure(bundle) {
  const errors = [];
  const componentIds = new Set(bundle.components.map(({ id }) => id));
  const foundationKeys = new Set(
    bundle.foundation_definitions.map(definitionKey),
  );

  for (const component of bundle.components) {
    const viewports = Object.keys(component.contracts);
    const references = collectComponentReferences(component, { viewports });
    const propertyIds = new Set(component.properties.map(({ id }) => id));
    const assetIds = new Set(component.asset_contracts.map(({ id }) => id));

    for (const reference of references.components) {
      if (!componentIds.has(reference.id)) {
        errors.push(
          diagnostic(
            "CONTEXT_BUNDLE_COMPONENT_UNRESOLVED",
            closurePath(component.id, reference.path),
            `Component reference ${reference.id} is outside the bundle.`,
          ),
        );
      }
    }
    for (const reference of references.properties) {
      if (!propertyIds.has(reference.id)) {
        errors.push(
          diagnostic(
            "CONTEXT_BUNDLE_PROPERTY_UNRESOLVED",
            closurePath(component.id, reference.path),
            `Property reference ${reference.id} is outside the component projection.`,
          ),
        );
      }
    }
    for (const reference of references.assets) {
      if (!assetIds.has(reference.id)) {
        errors.push(
          diagnostic(
            "CONTEXT_BUNDLE_ASSET_UNRESOLVED",
            closurePath(component.id, reference.path),
            `Asset reference ${reference.id} is outside the component projection.`,
          ),
        );
      }
    }
    for (const reference of references.foundations) {
      const exactKey = [
        reference.foundationId,
        reference.group,
        reference.id,
        reference.viewport,
      ].join("/");
      const fullKey = [
        reference.foundationId,
        "foundation",
        "all",
        "",
      ].join("/");
      if (!foundationKeys.has(exactKey) && !foundationKeys.has(fullKey)) {
        errors.push(
          diagnostic(
            "CONTEXT_BUNDLE_FOUNDATION_UNRESOLVED",
            closurePath(component.id, reference.path),
            `Foundation reference ${reference.foundationId}/${reference.group}/${reference.id} is outside the bundle.`,
          ),
        );
      }
    }

    component.asset_contracts.forEach((contract, contractIndex) => {
      for (const [group, field] of ASSET_DEFINITION_FIELDS) {
        const exactKey = ["assets", group, contract[field], ""].join("/");
        const fullKey = ["assets", "foundation", "all", ""].join("/");
        if (!foundationKeys.has(exactKey) && !foundationKeys.has(fullKey)) {
          errors.push(
            diagnostic(
              "CONTEXT_BUNDLE_FOUNDATION_UNRESOLVED",
              `${component.id}/asset_contracts/${contractIndex}/${field}`,
              `Assets definition ${group}/${contract[field]} is outside the bundle.`,
            ),
          );
        }
      }
    });
  }
  return stableBlockers(errors);
}

async function collectStaticSources(repoRoot, manifest, ids) {
  const result = [];
  for (const id of ids) {
    const source = requireSource(manifest, id);
    const content = await readFile(join(repoRoot, source.path), "utf8");
    result.push({
      id: source.id,
      kind: source.kind,
      path: source.path,
      digest: digestTextEntries([{ path: source.path, content }]),
      content,
    });
  }
  return result;
}

function sourceVersions(manifest, model) {
  const componentVersions = uniqueStrings(
    Object.values(model.registries).map(({ schema_version: version }) => version),
  );
  return {
    manifest: manifest.schema_version,
    components: componentVersions[0],
    typography: model.foundations.typography.schema_version,
    spacing: model.foundations.spacing.schema_version,
    assets: model.foundations.assets.schema_version,
    figma_naming: model.foundations["figma-naming"].schema_version,
  };
}

export async function buildContextBundle({
  repoRoot,
  routeId,
  candidates = [],
  viewports = [],
  foundationIds = [],
}) {
  let manifest;
  try {
    manifest = await loadSystemManifest({ repoRoot });
  } catch (error) {
    return blocked(caughtBlockers(error));
  }

  const profileResult = resolveGeneratedBundleProfile(manifest, routeId);
  if (profileResult.status === "blocked") {
    return blocked(profileResult.blockers.map(asBlocker));
  }
  const { route, profile } = profileResult;
  const selectedViewports = VIEWPORTS.filter((viewport) =>
    uniqueStrings(viewports).includes(viewport),
  );
  const selectedFoundations = uniqueStrings(foundationIds);
  const selectionBlockers = validateSelections(
    profile,
    candidates,
    uniqueStrings(viewports),
    selectedFoundations,
  );
  if (selectionBlockers.length > 0) return blocked(selectionBlockers);

  let model;
  try {
    model = await loadModel(repoRoot, manifest);
  } catch (error) {
    return blocked(caughtBlockers(error));
  }

  const roots = resolveRootIds(model.index, candidates, selectedViewports);
  if (roots.status === "blocked") return roots;
  const closure = collectDependencyClosure(
    model.index,
    roots.ids,
    selectedViewports,
  );
  if (closure.status === "blocked") return closure;
  const components = closure.records.map((record) =>
    projectComponent(record, selectedViewports),
  );
  const foundations = collectFoundationDefinitions({
    components,
    viewports: selectedViewports,
    model,
    requestedIds: selectedFoundations,
    policy: profile.generated_bundle,
  });
  if (foundations.status === "blocked") return foundations;

  let staticSources;
  try {
    staticSources = await collectStaticSources(
      repoRoot,
      manifest,
      profile.generated_bundle.static_source_ids,
    );
  } catch (error) {
    return blocked(caughtBlockers(error));
  }

  const bundle = {
    schema_version: "1.0.0",
    mode: profile.generated_bundle.status,
    route: {
      id: route.id,
      workflow_source_id: route.workflow_source_id,
      bundle_profile_id: route.bundle_profile_id,
    },
    source_versions: sourceVersions(manifest, model),
    static_sources: staticSources,
    components,
    foundation_definitions: foundations.definitions,
  };
  const closureErrors = validateBundleClosure(bundle);
  if (closureErrors.length > 0) return blocked(closureErrors);
  bundle.digest = digestStructuredEntries([
    { path: "context-bundle", value: bundle },
  ]);
  return { status: "resolved", bundle };
}

export function renderContextBundle(bundle) {
  const renderCodeBlock = (value, language = "json") => {
    const content =
      typeof value === "string" ? value : `${canonicalize(value)}\n`;
    const longestFence = Math.max(
      0,
      ...[...content.matchAll(/`+/gu)].map(([run]) => run.length),
    );
    const fence = "`".repeat(Math.max(3, longestFence + 1));
    const body = content.endsWith("\n") ? content : `${content}\n`;
    return `${fence}${language}\n${body}${fence}`;
  };

  const staticSources = bundle.static_sources.length
    ? bundle.static_sources
        .map(
          (source) =>
            [
              `### ${source.id}`,
              "",
              `Source: \`${source.path}\``,
              "",
              `Kind: \`${source.kind}\``,
              "",
              `Digest: \`${source.digest}\``,
              "",
              renderCodeBlock(source.content, "markdown"),
            ].join("\n"),
        )
        .join("\n\n")
    : "_None._";
  const components = bundle.components.length
    ? bundle.components
        .map(
          (component) =>
            `### ${component.id}\n\n${renderCodeBlock(component)}`,
        )
        .join("\n\n")
    : "_None._";
  const foundations = bundle.foundation_definitions.length
    ? bundle.foundation_definitions
        .map((definition) => {
          const id = [
            definition.foundation_id,
            definition.definition_group,
            definition.definition_id,
            definition.viewport,
          ]
            .filter(Boolean)
            .join("/");
          return `### ${id}\n\n${renderCodeBlock(definition)}`;
        })
        .join("\n\n")
    : "_None._";

  return [
    "---",
    `bundle_schema_version: ${bundle.schema_version}`,
    `mode: ${bundle.mode}`,
    `route_id: ${bundle.route.id}`,
    `bundle_profile_id: ${bundle.route.bundle_profile_id}`,
    `digest: ${bundle.digest}`,
    "---",
    "",
    "# CUPIS resolved context bundle",
    "",
    "## Static sources",
    "",
    staticSources,
    "",
    "## Components",
    "",
    components,
    "",
    "## Foundation definitions",
    "",
    foundations,
    "",
  ].join("\n");
}
