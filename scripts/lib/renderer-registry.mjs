import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";

const SUPPORTED_RENDERER_REGISTRY_VERSION = "1.0.0";

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

export function validateRendererRegistryShape(document, schema) {
  const errors = validateDocumentShape({
    document,
    schema,
    supportedVersion: SUPPORTED_RENDERER_REGISTRY_VERSION,
    versionCode: "renderer-registry-version-unsupported",
    schemaCode: "renderer-registry-schema",
  });
  const byOwnedRecord = new Map();
  for (const error of errors) {
    const match = error.path.match(/^\/coverage\/\d+/u);
    const path = match?.[0] ?? error.path;
    if (!byOwnedRecord.has(path)) {
      error.path = path;
      byOwnedRecord.set(path, error);
    }
  }
  return sortDiagnostics([...byOwnedRecord.values()]);
}

export function validateRendererRegistrySemantics(registry) {
  const errors = [];
  const firstIndexByComponentId = new Map();

  (registry?.coverage ?? []).forEach((entry, index) => {
    const componentId = entry?.component_id;
    if (firstIndexByComponentId.has(componentId)) {
      errors.push(
        diagnostic(
          "RENDERER_COVERAGE_DUPLICATE",
          `/coverage/${index}/component_id`,
          `Duplicate renderer coverage for component ${String(componentId)}; first declared at /coverage/${firstIndexByComponentId.get(componentId)}/component_id.`,
        ),
      );
      return;
    }
    firstIndexByComponentId.set(componentId, index);
  });

  return sortDiagnostics(errors);
}

export async function loadRendererRegistry({
  repoRoot,
  dataPath = "data/renderers/registry.yaml",
  schemaPath = "schemas/renderer-registry.schema.json",
}) {
  const [registry, schemaText] = await Promise.all([
    readStrictYaml(join(repoRoot, dataPath)),
    readFile(join(repoRoot, schemaPath), "utf8"),
  ]);
  const errors = [
    ...validateRendererRegistryShape(registry, JSON.parse(schemaText)),
    ...validateRendererRegistrySemantics(registry),
  ];
  if (errors.length > 0) {
    throw new AggregateError(
      sortDiagnostics(errors),
      `Renderer registry validation failed: ${dataPath}.`,
    );
  }
  return registry;
}

export function resolveRendererCoverage(registry, componentId) {
  const semanticErrors = validateRendererRegistrySemantics(registry);
  if (semanticErrors.length > 0) {
    throw new AggregateError(
      semanticErrors,
      "Renderer registry semantic validation failed.",
    );
  }

  const coverage = (registry?.coverage ?? []).find(
    (entry) => entry.component_id === componentId,
  );
  if (!coverage) {
    throw diagnostic(
      "RENDERER_COVERAGE_UNKNOWN",
      "/coverage",
      `Renderer coverage is not declared for component ${componentId}.`,
    );
  }
  return structuredClone(coverage);
}
