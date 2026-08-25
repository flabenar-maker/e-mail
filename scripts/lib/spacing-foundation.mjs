import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";

const SUPPORTED_SPACING_VERSION = "1.0.0";
const VIEWPORTS = ["mobile", "desktop"];
const FORBIDDEN_BUILD_CHOICE_KEYS = new Set([
  "allowed_values",
  "candidate_values",
  "range",
  "min",
  "max",
  "nearest",
  "fallback_viewport",
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
    const value = item?.[key];
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }
  return [...duplicates].filter((value) => value !== undefined).sort();
}

function findBuildChoiceFields(value, path = "") {
  const errors = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      errors.push(...findBuildChoiceFields(item, `${path}/${index}`));
    });
    return errors;
  }
  if (!value || typeof value !== "object") {
    return errors;
  }

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}/${key}`;
    if (FORBIDDEN_BUILD_CHOICE_KEYS.has(key)) {
      errors.push(
        diagnostic(
          "SPACING_BUILD_CHOICE_FORBIDDEN",
          childPath || "/",
          `Build-time spacing choice field is forbidden: ${key}.`,
        ),
      );
    }
    errors.push(...findBuildChoiceFields(child, childPath));
  }
  return errors;
}

function validFigmaNodeId(value) {
  return typeof value === "string" && /^[0-9]+:[0-9]+$/u.test(value);
}

function validateResolution(errors, role, roleIndex, viewport) {
  const path = `/roles/${roleIndex}/resolutions/${viewport}`;
  const resolution = role?.resolutions?.[viewport];
  if (!resolution) {
    errors.push(
      diagnostic(
        "SPACING_UNRESOLVED_ROLE",
        path,
        `Spacing role ${String(role?.id)} has no exact ${viewport} resolution.`,
      ),
    );
    return;
  }

  if (
    !Number.isInteger(resolution.value_px) ||
    resolution.value_px < 0
  ) {
    errors.push(
      diagnostic(
        "SPACING_NON_EXACT_VALUE",
        `${path}/value_px`,
        "Spacing resolution must be a non-negative integer pixel value.",
      ),
    );
  }

  const provenance = resolution.provenance;
  const registryLiteral =
    provenance?.kind === "registry-literal" &&
    typeof provenance.source_path === "string" &&
    provenance.source_path.length > 0 &&
    provenance.variable_name === undefined &&
    provenance.evidence_node_id === undefined;
  const figmaVariable =
    provenance?.kind === "figma-variable" &&
    typeof provenance.variable_name === "string" &&
    provenance.variable_name.length > 0 &&
    validFigmaNodeId(provenance.evidence_node_id) &&
    provenance.source_path === undefined;

  if (!registryLiteral && !figmaVariable) {
    errors.push(
      diagnostic(
        "SPACING_INVALID_BINDING_PROVENANCE",
        `${path}/provenance`,
        "Spacing provenance must be a complete registry literal or inspected Figma variable reference.",
      ),
    );
  }
}

function validateExceptions(errors, exceptions) {
  for (const [index, exception] of (exceptions ?? []).entries()) {
    const path = `/exceptions/${index}`;
    const valid =
      typeof exception?.id === "string" &&
      exception.id.length > 0 &&
      typeof exception.component_id === "string" &&
      exception.component_id.length > 0 &&
      VIEWPORTS.includes(exception.viewport) &&
      typeof exception.relationship_path === "string" &&
      exception.relationship_path.length > 0 &&
      Number.isInteger(exception.value_px) &&
      exception.value_px >= 0 &&
      [
        "optical-compensation",
        "fixed-geometry",
        "component-specific",
      ].includes(exception.reason_category) &&
      typeof exception.rationale === "string" &&
      exception.rationale.trim().length > 0 &&
      validFigmaNodeId(exception.evidence_node_id);

    if (!valid) {
      errors.push(
        diagnostic(
          "SPACING_INVALID_EXCEPTION",
          path,
          "Spacing exception must contain a complete approved exact-value record.",
        ),
      );
    }
  }
}

export function validateSpacingShape(spacing, schema) {
  return validateDocumentShape({
    document: spacing,
    schema,
    supportedVersion: SUPPORTED_SPACING_VERSION,
    versionCode: "spacing-version-unsupported",
    schemaCode: "spacing-schema",
  });
}

export async function loadSpacingFoundation({
  repoRoot,
  dataPath,
  schemaPath,
}) {
  const [spacing, schemaText] = await Promise.all([
    readStrictYaml(join(repoRoot, dataPath)),
    readFile(join(repoRoot, schemaPath), "utf8"),
  ]);
  const schema = JSON.parse(schemaText);
  const errors = validateSpacingShape(spacing, schema);
  if (errors.length > 0) {
    throw new AggregateError(errors, "Spacing foundation validation failed.");
  }
  return spacing;
}

export function validateSpacingSemantics(spacing) {
  const errors = [];

  for (const value of duplicateValues(spacing?.roles, "id")) {
    errors.push(
      diagnostic(
        "SPACING_DUPLICATE_ROLE_ID",
        "/roles",
        `Duplicate spacing role id: ${value}.`,
      ),
    );
  }

  (spacing?.roles ?? []).forEach((role, roleIndex) => {
    for (const viewport of VIEWPORTS) {
      validateResolution(errors, role, roleIndex, viewport);
    }
  });

  validateExceptions(errors, spacing?.exceptions);
  errors.push(...findBuildChoiceFields(spacing));

  return sortDiagnostics(errors);
}

export function resolveDesignSpacing(spacing, { roleId, viewport }) {
  if (!VIEWPORTS.includes(viewport)) {
    throw diagnostic(
      "SPACING_UNKNOWN_VIEWPORT",
      "/viewport",
      `Unknown spacing viewport: ${String(viewport)}.`,
    );
  }

  const role = spacing?.roles?.find((item) => item.id === roleId);
  const resolution = role?.resolutions?.[viewport];
  if (
    !role ||
    !resolution ||
    !Number.isInteger(resolution.value_px) ||
    resolution.value_px < 0
  ) {
    throw diagnostic(
      "SPACING_UNRESOLVED_ROLE",
      `/roles/${String(roleId)}/resolutions/${viewport}`,
      `Spacing role ${String(roleId)} has no exact ${viewport} resolution.`,
    );
  }

  return resolution.value_px;
}

export async function validateSpacingFoundation({
  repoRoot,
  dataPath,
  schemaPath,
}) {
  try {
    const spacing = await loadSpacingFoundation({
      repoRoot,
      dataPath,
      schemaPath,
    });
    return {
      spacing,
      errors: validateSpacingSemantics(spacing),
    };
  } catch (error) {
    if (error instanceof AggregateError) {
      return { spacing: null, errors: sortDiagnostics(error.errors) };
    }
    if (error instanceof SystemValidationError) {
      return { spacing: null, errors: [error] };
    }
    return {
      spacing: null,
      errors: [
        diagnostic(
          "spacing-read",
          `/${dataPath.replaceAll("\\", "/")}`,
          "Spacing foundation could not be read.",
        ),
      ],
    };
  }
}
