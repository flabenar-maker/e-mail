import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";

const SUPPORTED_FIGMA_NAMING_VERSION = "1.1.0";
const FORBIDDEN_CONCRETE_KEYS = new Set([
  "component_id",
  "node_id",
  "description",
  "width",
  "height",
  "rename_map",
  "figma_write",
  "auto_migrate",
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

function duplicateValues(items, key) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items ?? []) {
    const value = typeof item === "object" ? item?.[key] : item;
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }
  return [...duplicates]
    .filter((value) => value !== undefined)
    .sort();
}

function pushDuplicateDiagnostics(errors, items, key, path) {
  for (const value of duplicateValues(items, key)) {
    errors.push(
      diagnostic(
        key === "label"
          ? "FIGMA_NAMING_DUPLICATE_LABEL"
          : "FIGMA_NAMING_DUPLICATE_ID",
        path,
        `Duplicate ${key} value: ${String(value)}.`,
      ),
    );
  }
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
    if (
      typeof value === "string" &&
      /^[0-9]+:[0-9]+$/u.test(value)
    ) {
      errors.push(
        diagnostic(
          "FIGMA_NAMING_CONCRETE_RECORD_FORBIDDEN",
          path || "/",
          "Concrete Figma node IDs are forbidden in the naming foundation.",
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
          "FIGMA_NAMING_CONCRETE_RECORD_FORBIDDEN",
          childPath,
          `Concrete component field is forbidden in the naming foundation: ${key}.`,
        ),
      );
    }
    errors.push(...findConcreteRecords(child, childPath));
  }
  return errors;
}

export function validateFigmaNamingShape(naming, schema) {
  return validateDocumentShape({
    document: naming,
    schema,
    supportedVersion: SUPPORTED_FIGMA_NAMING_VERSION,
    versionCode: "figma-naming-version-unsupported",
    schemaCode: "figma-naming-schema",
  });
}

export async function loadFigmaNamingFoundation({
  repoRoot,
  dataPath = "data/foundations/figma-naming.yaml",
  schemaPath = "schemas/figma-naming.schema.json",
}) {
  const [naming, schemaText] = await Promise.all([
    readStrictYaml(join(repoRoot, dataPath)),
    readFile(join(repoRoot, schemaPath), "utf8"),
  ]);
  const schema = JSON.parse(schemaText);
  const errors = validateFigmaNamingShape(naming, schema);
  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      "Figma naming foundation validation failed.",
    );
  }
  return naming;
}

export function validateFigmaNamingSemantics(naming) {
  const errors = [];

  for (const [items, path] of [
    [naming?.object_kinds, "/object_kinds"],
    [naming?.namespaces, "/namespaces"],
    [naming?.variant_axes, "/variant_axes"],
    [naming?.layer_names?.forbidden_patterns, "/layer_names/forbidden_patterns"],
  ]) {
    pushDuplicateDiagnostics(errors, items, "id", path);
    pushDuplicateDiagnostics(errors, items, "label", path);
  }
  pushDuplicateDiagnostics(
    errors,
    naming?.layer_names?.controlled_roles,
    null,
    "/layer_names/controlled_roles",
  );

  const axes = naming?.variant_axes ?? [];
  axes.forEach((axis, index) => {
    if (axis?.order !== index + 1) {
      errors.push(
        diagnostic(
          "FIGMA_NAMING_AXIS_ORDER_INVALID",
          `/variant_axes/${index}/order`,
          `Variant axis order must be ${index + 1} at this position.`,
        ),
      );
    }
  });

  (naming?.asset_owners?.scale_suffixes ?? []).forEach((item, index) => {
    const expected = `@${String(item?.scale)}x`;
    if (item?.suffix !== expected) {
      errors.push(
        diagnostic(
          "FIGMA_NAMING_SCALE_SUFFIX_MISMATCH",
          `/asset_owners/scale_suffixes/${index}/suffix`,
          `Scale ${String(item?.scale)} requires suffix ${expected}.`,
        ),
      );
    }
  });

  const viewportAxisId =
    naming?.organizational_names?.template?.viewport_axis_id;
  if (
    typeof viewportAxisId === "string" &&
    !axes.some((axis) => axis.id === viewportAxisId)
  ) {
    errors.push(
      diagnostic(
        "FIGMA_NAMING_UNKNOWN_REFERENCE",
        "/organizational_names/template/viewport_axis_id",
        `Unknown variant axis reference: ${viewportAxisId}.`,
      ),
    );
  }

  errors.push(...findConcreteRecords(naming));
  return sortDiagnostics(errors);
}

export async function validateFigmaNamingFoundation({
  repoRoot,
  dataPath = "data/foundations/figma-naming.yaml",
  schemaPath = "schemas/figma-naming.schema.json",
}) {
  try {
    const naming = await loadFigmaNamingFoundation({
      repoRoot,
      dataPath,
      schemaPath,
    });
    return {
      naming,
      errors: validateFigmaNamingSemantics(naming),
    };
  } catch (error) {
    if (error instanceof AggregateError) {
      return { naming: null, errors: sortDiagnostics(error.errors) };
    }
    if (error instanceof SystemValidationError) {
      return { naming: null, errors: [error] };
    }
    return {
      naming: null,
      errors: [
        diagnostic(
          "figma-naming-read",
          `/${dataPath.replaceAll("\\", "/")}`,
          "Figma naming foundation could not be read.",
        ),
      ],
    };
  }
}
