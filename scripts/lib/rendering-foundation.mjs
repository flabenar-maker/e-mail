import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";

const SUPPORTED_RENDERING_VERSION = "1.0.0";
const DEFINITION_GROUPS = [
  "breakpoints",
  "responsive_strategies",
  "primitives",
  "support_profiles",
];
const FORBIDDEN_CONCRETE_KEYS = new Set([
  "component_id",
  "component_ids",
  "figma_id",
  "figma_node_id",
  "node_id",
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

function duplicateIds(items) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items ?? []) {
    if (seen.has(item?.id)) {
      duplicates.add(item?.id);
    }
    seen.add(item?.id);
  }
  return [...duplicates]
    .filter((value) => value !== undefined)
    .sort();
}

function findConcreteRecords(value, path = "") {
  const errors = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      errors.push(...findConcreteRecords(item, `${path}/${index}`));
    });
    return errors;
  }
  if (!value || typeof value !== "object") {
    if (typeof value === "string" && /^[0-9]+:[0-9]+$/u.test(value)) {
      errors.push(
        diagnostic(
          "RENDERING_CONCRETE_RECORD_FORBIDDEN",
          path || "/",
          "Concrete Figma node IDs are forbidden in the rendering foundation.",
        ),
      );
    }
    return errors;
  }

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}/${key}`;
    if (FORBIDDEN_CONCRETE_KEYS.has(key)) {
      errors.push(
        diagnostic(
          "RENDERING_CONCRETE_RECORD_FORBIDDEN",
          childPath,
          `Concrete component or Figma field is forbidden in the rendering foundation: ${key}.`,
        ),
      );
    }
    errors.push(...findConcreteRecords(child, childPath));
  }
  return errors;
}

export function validateRenderingShape(rendering, schema) {
  return validateDocumentShape({
    document: rendering,
    schema,
    supportedVersion: SUPPORTED_RENDERING_VERSION,
    versionCode: "rendering-version-unsupported",
    schemaCode: "rendering-schema",
  });
}

export async function loadRenderingFoundation({
  repoRoot,
  dataPath = "data/foundations/rendering.yaml",
  schemaPath = "schemas/rendering.schema.json",
}) {
  const [rendering, schemaText] = await Promise.all([
    readStrictYaml(join(repoRoot, dataPath)),
    readFile(join(repoRoot, schemaPath), "utf8"),
  ]);
  const schema = JSON.parse(schemaText);
  const errors = validateRenderingShape(rendering, schema);
  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      "Rendering foundation validation failed.",
    );
  }
  return rendering;
}

export function validateRenderingSemantics(rendering) {
  const errors = [];

  for (const group of DEFINITION_GROUPS) {
    for (const id of duplicateIds(rendering?.[group])) {
      errors.push(
        diagnostic(
          "RENDERING_DUPLICATE_ID",
          `/${group}`,
          `Duplicate ${group} id: ${id}.`,
        ),
      );
    }
  }

  errors.push(...findConcreteRecords(rendering));
  return sortDiagnostics(errors);
}

export function resolveRenderingDefinition(rendering, { group, id }) {
  const errors = validateRenderingSemantics(rendering);
  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      "Rendering foundation semantic validation failed.",
    );
  }

  if (!DEFINITION_GROUPS.includes(group)) {
    throw diagnostic(
      "RENDERING_DEFINITION_UNKNOWN",
      "/selection/group",
      `Unknown rendering definition group: ${String(group)}.`,
    );
  }

  const definition = (rendering[group] ?? []).find((item) => item.id === id);
  if (!definition) {
    throw diagnostic(
      "RENDERING_DEFINITION_UNKNOWN",
      "/selection/id",
      `Unknown rendering definition: ${String(id)}.`,
    );
  }

  return structuredClone(definition);
}

export async function validateRenderingFoundation({
  repoRoot,
  dataPath = "data/foundations/rendering.yaml",
  schemaPath = "schemas/rendering.schema.json",
}) {
  try {
    const rendering = await loadRenderingFoundation({
      repoRoot,
      dataPath,
      schemaPath,
    });
    return {
      rendering,
      errors: validateRenderingSemantics(rendering),
    };
  } catch (error) {
    if (error instanceof AggregateError) {
      return { rendering: null, errors: sortDiagnostics(error.errors) };
    }
    if (error instanceof SystemValidationError) {
      return { rendering: null, errors: [error] };
    }
    return {
      rendering: null,
      errors: [
        diagnostic(
          "rendering-read",
          `/${dataPath.replaceAll("\\", "/")}`,
          "Rendering foundation could not be read.",
        ),
      ],
    };
  }
}