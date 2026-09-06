import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { resolveAssetContract } from "./assets-foundation.mjs";
import { validateDescriptionModel } from "./component-description.mjs";
import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";

const SUPPORTED_COMPONENTS_VERSION = "1.0.0";
const LIBRARIES = ["shared", "marketing", "service"];
const VIEWPORTS = ["mobile", "desktop"];
const FINGERPRINT = /^sha256:[0-9a-f]{64}$/u;
const FORBIDDEN_INHERITANCE_KEYS = new Set([
  "base",
  "inherit",
  "inherits",
  "extends",
  "override",
  "overrides",
  "fallback",
  "fallback_contract",
]);

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

function registryDocuments(registries) {
  return LIBRARIES.flatMap((library) => {
    const document = registries?.[library];
    return document ? [[library, document]] : [];
  });
}

function recordsIn(registries) {
  return registryDocuments(registries).flatMap(([library, document]) =>
    (document.components ?? []).map((record, index) => ({
      library,
      document,
      record,
      index,
      path: `/registries/${library}/components/${index}`,
    })),
  );
}

function readonlyMap(entries) {
  const target = new Map(entries);
  const proxy = new Proxy(target, {
    get(map, property) {
      if (["set", "delete", "clear"].includes(property)) {
        return () => {
          throw new TypeError("Component registry index is immutable.");
        };
      }
      const value = Reflect.get(map, property, map);
      return typeof value === "function" ? value.bind(map) : value;
    },
  });
  return Object.freeze(proxy);
}

function pushDuplicate(errors, seen, value, code, path, label) {
  if (seen.has(value)) {
    errors.push(
      diagnostic(code, path, `Duplicate ${label}: ${String(value)}.`),
    );
  } else {
    seen.add(value);
  }
}

function walkElements(element, path, visit) {
  if (!element || typeof element !== "object") {
    return;
  }
  visit(element, path);
  (element.children ?? []).forEach((child, index) => {
    walkElements(child, `${path}/children/${index}`, visit);
  });
}

function walkFacts(record, visit) {
  for (const viewport of VIEWPORTS) {
    const root = record?.contracts?.[viewport]?.root;
    walkElements(root, `/contracts/${viewport}/root`, (element, path) => {
      (element.facts ?? []).forEach((fact, index) =>
        visit(fact, `${path}/facts/${index}`),
      );
    });
  }
}

function findForbiddenInheritance(value, path = "") {
  const found = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      found.push(...findForbiddenInheritance(item, `${path}/${index}`));
    });
    return found;
  }
  if (!value || typeof value !== "object") {
    return found;
  }
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}/${key}`;
    if (FORBIDDEN_INHERITANCE_KEYS.has(key)) {
      found.push(childPath);
    }
    found.push(...findForbiddenInheritance(child, childPath));
  }
  return found;
}

function addReference(target, id, path) {
  target.push({ id, path });
}

export function validateComponentRegistryShape(document, schema) {
  return validateDocumentShape({
    document,
    schema,
    supportedVersion: SUPPORTED_COMPONENTS_VERSION,
    versionCode: "components-version-unsupported",
    schemaCode: "components-schema",
  });
}

export async function loadComponentRegistry({
  repoRoot,
  dataPath,
  schemaPath = "schemas/components.schema.json",
}) {
  const [document, schemaText] = await Promise.all([
    readStrictYaml(join(repoRoot, dataPath)),
    readFile(join(repoRoot, schemaPath), "utf8"),
  ]);
  const errors = validateComponentRegistryShape(
    document,
    JSON.parse(schemaText),
  );
  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      `Component registry validation failed: ${dataPath}.`,
    );
  }
  return document;
}

export async function loadComponentRegistries({
  repoRoot,
  sources = {
    shared: "data/components/shared.yaml",
    marketing: "data/components/marketing.yaml",
    service: "data/components/service.yaml",
  },
  schemaPath = "schemas/components.schema.json",
}) {
  const entries = await Promise.all(
    LIBRARIES.map(async (library) => [
      library,
      await loadComponentRegistry({
        repoRoot,
        dataPath: sources[library],
        schemaPath,
      }),
    ]),
  );
  return Object.freeze(Object.fromEntries(entries));
}

export function indexComponentRegistries(registries) {
  const systemEntries = [];
  const identityEntries = [];
  const nameEntries = [];
  const seenSystem = new Set();
  const seenIdentity = new Set();
  const seenName = new Set();

  for (const { record } of recordsIn(registries)) {
    const identity = `${record?.figma?.file_key}#${record?.figma?.node_id}`;
    if (!seenSystem.has(record.id)) {
      systemEntries.push([record.id, record]);
      seenSystem.add(record.id);
    }
    if (!seenIdentity.has(identity)) {
      identityEntries.push([identity, record]);
      seenIdentity.add(identity);
    }
    if (!seenName.has(record.identity.figma_name)) {
      nameEntries.push([record.identity.figma_name, record]);
      seenName.add(record.identity.figma_name);
    }
  }

  return Object.freeze({
    bySystemId: readonlyMap(systemEntries),
    byFigmaIdentity: readonlyMap(identityEntries),
    byFigmaName: readonlyMap(nameEntries),
  });
}

export function collectComponentReferences(record) {
  const references = {
    components: [],
    properties: [],
    assets: [],
    foundations: [],
  };

  for (const viewport of VIEWPORTS) {
    const root = record?.contracts?.[viewport]?.root;
    walkElements(root, `/contracts/${viewport}/root`, (element, path) => {
      if (element.render_mode === "nested-component") {
        addReference(
          references.components,
          element.component_id,
          `${path}/component_id`,
        );
      }
      if (
        ["direct-image", "background-image"].includes(element.render_mode)
      ) {
        addReference(
          references.assets,
          element.asset_contract_id,
          `${path}/asset_contract_id`,
        );
      }
      if (element.visibility?.mode === "property") {
        addReference(
          references.properties,
          element.visibility.property_id,
          `${path}/visibility/property_id`,
        );
      }
      (element.facts ?? []).forEach((fact, factIndex) => {
        const factPath = `${path}/facts/${factIndex}/value`;
        const value = fact.value;
        if (value?.type === "component-reference") {
          addReference(
            references.components,
            value.component_id,
            `${factPath}/component_id`,
          );
        } else if (value?.type === "property-reference") {
          addReference(
            references.properties,
            value.property_id,
            `${factPath}/property_id`,
          );
        } else if (value?.type === "asset-reference") {
          addReference(
            references.assets,
            value.asset_contract_id,
            `${factPath}/asset_contract_id`,
          );
        } else if (value?.type === "foundation-reference") {
          references.foundations.push({
            foundationId: value.foundation_id,
            group: value.definition_group,
            id: value.definition_id,
            path: factPath,
          });
        }
      });
    });
  }

  return references;
}

function validateInternalIds(errors, record, rootPath) {
  for (const [items, key, label, path] of [
    [record.variants, "id", "variant id", "variants"],
    [record.variants, "node_id", "variant node id", "variants"],
    [record.properties, "id", "property id", "properties"],
    [record.properties, "figma_name", "property name", "properties"],
    [record.asset_contracts, "id", "asset contract id", "asset_contracts"],
  ]) {
    const seen = new Set();
    (items ?? []).forEach((item, index) => {
      pushDuplicate(
        errors,
        seen,
        item?.[key],
        "COMPONENT_REGISTRY_DUPLICATE_ID",
        `${rootPath}/${path}/${index}/${key}`,
        label,
      );
    });
  }

  for (const viewport of VIEWPORTS) {
    const seenElements = new Set();
    const seenFacts = new Set();
    walkElements(
      record?.contracts?.[viewport]?.root,
      `${rootPath}/contracts/${viewport}/root`,
      (element, path) => {
        pushDuplicate(
          errors,
          seenElements,
          element.id,
          "COMPONENT_REGISTRY_DUPLICATE_ID",
          `${path}/id`,
          `${viewport} element id`,
        );
        (element.facts ?? []).forEach((fact, index) => {
          pushDuplicate(
            errors,
            seenFacts,
            fact.id,
            "COMPONENT_REGISTRY_DUPLICATE_ID",
            `${path}/facts/${index}/id`,
            `${viewport} fact id`,
          );
        });
      },
    );
  }
}

function validateFoundationReference(errors, reference, typography, spacing) {
  if (reference.foundationId === "typography") {
    const known =
      reference.group === "styles" &&
      (typography?.styles ?? []).some((item) => item.id === reference.id);
    if (!known) {
      errors.push(
        diagnostic(
          "COMPONENT_REGISTRY_UNKNOWN_TYPOGRAPHY_REFERENCE",
          reference.path,
          `Unknown typography reference: ${reference.group}/${reference.id}.`,
        ),
      );
    }
  } else if (reference.foundationId === "spacing") {
    const known =
      reference.group === "roles" &&
      (spacing?.roles ?? []).some((item) => item.id === reference.id);
    if (!known) {
      errors.push(
        diagnostic(
          "COMPONENT_REGISTRY_UNKNOWN_SPACING_REFERENCE",
          reference.path,
          `Unknown spacing reference: ${reference.group}/${reference.id}.`,
        ),
      );
    }
  }
}

function validateAssetSelection(errors, asset, path, assets) {
  try {
    resolveAssetContract(assets, {
      sourceModeId: asset.source_mode_id,
      displayModeId: asset.display_mode_id,
      exportProfileId: asset.export_profile_id,
      expectedAlphaId: asset.alpha_mode_id,
      clippingPolicyId: asset.clipping_policy_id,
    });
  } catch (error) {
    const unknown =
      error instanceof SystemValidationError &&
      error.code === "ASSETS_UNKNOWN_CONTRACT_VALUE";
    errors.push(
      diagnostic(
        unknown
          ? "COMPONENT_REGISTRY_UNKNOWN_ASSET_REFERENCE"
          : "COMPONENT_REGISTRY_ASSET_INCOMPATIBLE",
        path,
        unknown
          ? "Asset contract contains an unknown Assets foundation reference."
          : "Asset contract selection is incompatible with the Assets foundation.",
      ),
    );
  }
}

export function validateComponentRegistrySemantics({
  registries,
  typography,
  spacing,
  assets,
}) {
  const errors = [];
  const seenIds = new Set();
  const seenIdentities = new Set();
  const seenNames = new Set();
  const index = indexComponentRegistries(registries);

  for (const [library, document] of registryDocuments(registries)) {
    const registryPath = `/registries/${library}/registry`;
    if (
      document.registry.library !== library ||
      document.registry.id !== `components-${library}`
    ) {
      errors.push(
        diagnostic(
          "COMPONENT_REGISTRY_LIBRARY_MISMATCH",
          registryPath,
          `Registry envelope does not match library ${library}.`,
        ),
      );
    }

    (document.components ?? []).forEach((record, recordIndex) => {
      const rootPath = `/registries/${library}/components/${recordIndex}`;
      pushDuplicate(
        errors,
        seenIds,
        record.id,
        "COMPONENT_REGISTRY_DUPLICATE_ID",
        `${rootPath}/id`,
        "component id",
      );
      const figmaIdentity = `${record?.figma?.file_key}#${record?.figma?.node_id}`;
      pushDuplicate(
        errors,
        seenIdentities,
        figmaIdentity,
        "COMPONENT_REGISTRY_DUPLICATE_FIGMA_IDENTITY",
        `${rootPath}/figma/node_id`,
        "Figma identity",
      );
      pushDuplicate(
        errors,
        seenNames,
        record?.identity?.figma_name,
        "COMPONENT_REGISTRY_DUPLICATE_FIGMA_NAME",
        `${rootPath}/identity/figma_name`,
        "Figma name",
      );

      if (record?.identity?.library !== library) {
        errors.push(
          diagnostic(
            "COMPONENT_REGISTRY_LIBRARY_MISMATCH",
            `${rootPath}/identity/library`,
            `Component library must be ${library}.`,
          ),
        );
      }

      const allowedRoots = new Set(
        (document.registry.source.roots ?? []).map((root) => root.node_id),
      );
      if (
        record?.figma?.file_key !==
          document.registry.source.figma_file_key ||
        !allowedRoots.has(record?.figma?.source_root_node_id)
      ) {
        errors.push(
          diagnostic(
            "COMPONENT_REGISTRY_ROOT_MISMATCH",
            `${rootPath}/figma`,
            "Component Figma identity is outside its registry source roots.",
          ),
        );
      }

      if (!FINGERPRINT.test(record?.figma?.structure_fingerprint ?? "")) {
        errors.push(
          diagnostic(
            "COMPONENT_REGISTRY_FINGERPRINT_INVALID",
            `${rootPath}/figma/structure_fingerprint`,
            "Component structure fingerprint must be sha256 plus 64 lowercase hex characters.",
          ),
        );
      }

      if (record.status === "active") {
        for (const viewport of VIEWPORTS) {
          if (!record?.contracts?.[viewport]?.root) {
            errors.push(
              diagnostic(
                "COMPONENT_REGISTRY_INCOMPLETE_VIEWPORT",
                `${rootPath}/contracts/${viewport}`,
                `Active component has no complete ${viewport} contract.`,
              ),
            );
          }
        }
      }

      for (const forbiddenPath of findForbiddenInheritance(record.contracts)) {
        errors.push(
          diagnostic(
            "COMPONENT_REGISTRY_INCOMPLETE_VIEWPORT",
            `${rootPath}/contracts${forbiddenPath}`,
            "Viewport inheritance, overrides and fallback contracts are forbidden.",
          ),
        );
      }

      validateInternalIds(errors, record, rootPath);
      const propertyIds = new Set(
        (record.properties ?? []).map((property) => property.id),
      );
      const assetIds = new Set(
        (record.asset_contracts ?? []).map((asset) => asset.id),
      );
      const references = collectComponentReferences(record);

      for (const reference of references.properties) {
        if (!propertyIds.has(reference.id)) {
          errors.push(
            diagnostic(
              "COMPONENT_REGISTRY_UNKNOWN_PROPERTY",
              `${rootPath}${reference.path}`,
              `Unknown component property: ${String(reference.id)}.`,
            ),
          );
        }
      }
      for (const reference of references.components) {
        if (!index.bySystemId.has(reference.id)) {
          errors.push(
            diagnostic(
              "COMPONENT_REGISTRY_UNKNOWN_COMPONENT_REFERENCE",
              `${rootPath}${reference.path}`,
              `Unknown component reference: ${String(reference.id)}.`,
            ),
          );
        }
      }
      for (const reference of references.assets) {
        if (!assetIds.has(reference.id)) {
          errors.push(
            diagnostic(
              "COMPONENT_REGISTRY_UNKNOWN_ASSET_REFERENCE",
              `${rootPath}${reference.path}`,
              `Unknown local asset contract: ${String(reference.id)}.`,
            ),
          );
        }
      }
      for (const reference of references.foundations) {
        validateFoundationReference(
          errors,
          {
            ...reference,
            path: `${rootPath}${reference.path}`,
          },
          typography,
          spacing,
        );
      }

      (record.asset_contracts ?? []).forEach((asset, assetIndex) => {
        validateAssetSelection(
          errors,
          asset,
          `${rootPath}/asset_contracts/${assetIndex}`,
          assets,
        );
      });

      for (const descriptionError of validateDescriptionModel(record, index)) {
        errors.push(
          diagnostic(
            descriptionError.code,
            `${rootPath}${descriptionError.path}`,
            descriptionError.message,
          ),
        );
      }
    });
  }

  return sortDiagnostics(errors);
}

function blocker(code, path, message, candidate) {
  const result = { code, path, message };
  if (candidate?.figma_identity) {
    result.handoff = {
      route_id: "component-onboarding",
      figma_identity: structuredClone(candidate.figma_identity),
    };
  }
  return result;
}

export function resolveComponentContracts({ index, candidates, viewport }) {
  const blockers = [];
  const components = [];

  (candidates ?? []).forEach((candidate, candidateIndex) => {
    const path = `/candidates/${candidateIndex}`;
    let record = null;
    if (typeof candidate?.id === "string") {
      record = index.bySystemId.get(candidate.id) ?? null;
    } else if (
      typeof candidate?.figma_identity?.file_key === "string" &&
      typeof candidate?.figma_identity?.node_id === "string"
    ) {
      const key = `${candidate.figma_identity.file_key}#${candidate.figma_identity.node_id}`;
      record = index.byFigmaIdentity.get(key) ?? null;
    } else {
      blockers.push(
        blocker(
          "COMPONENT_IDENTITY_REQUIRED",
          path,
          "A stable component id or exact Figma identity is required.",
          candidate,
        ),
      );
      return;
    }

    if (!record) {
      const identity = candidate?.figma_identity;
      blockers.push(
        blocker(
          "COMPONENT_UNREGISTERED",
          path,
          identity
            ? `Figma component ${identity.node_id} is not registered.`
            : `Component ${String(candidate.id)} is not registered.`,
          candidate,
        ),
      );
      return;
    }
    if (record.status !== "active") {
      blockers.push(
        blocker(
          "COMPONENT_NOT_ACTIVE",
          path,
          `Component ${record.id} is not active.`,
          candidate,
        ),
      );
      return;
    }
    if (!VIEWPORTS.includes(viewport) || !record.contracts?.[viewport]) {
      blockers.push(
        blocker(
          "COMPONENT_REGISTRY_INCOMPLETE_VIEWPORT",
          path,
          `Component ${record.id} has no ${String(viewport)} contract.`,
          candidate,
        ),
      );
      return;
    }
    components.push({
      id: record.id,
      contract: record.contracts[viewport],
    });
  });

  if (blockers.length > 0) {
    return { status: "blocked", blockers: sortDiagnostics(blockers) };
  }
  return { status: "resolved", viewport, components };
}

export async function validateComponentRegistries(options) {
  try {
    const registries = await loadComponentRegistries(options);
    return {
      registries,
      errors: validateComponentRegistrySemantics({
        registries,
        typography: options.typography,
        spacing: options.spacing,
        assets: options.assets,
      }),
    };
  } catch (error) {
    if (error instanceof AggregateError) {
      return { registries: null, errors: sortDiagnostics(error.errors) };
    }
    if (error instanceof SystemValidationError) {
      return { registries: null, errors: [error] };
    }
    return {
      registries: null,
      errors: [
        diagnostic(
          "components-read",
          "/data/components",
          "Component registries could not be read.",
        ),
      ],
    };
  }
}
