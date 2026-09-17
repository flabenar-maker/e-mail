import { deriveComponentRenderType } from "./component-registry.mjs";
import { SystemValidationError } from "./diagnostics.mjs";

function normalizeLf(value) {
  return value.replace(/\r\n?|\u2028|\u2029/gu, "\n");
}

function descriptionError(code, path, message) {
  return new SystemValidationError(code, path, message);
}

function criticalConstraints(record) {
  const byId = new Map(
    (record?.constraints ?? []).map((constraint) => [constraint.id, constraint]),
  );
  const selectedIds = record?.documentation?.critical_constraint_ids ?? [];
  if (selectedIds.length > 2) {
    throw descriptionError(
      "COMPONENT_DESCRIPTION_CRITICAL_LIMIT",
      "/documentation/critical_constraint_ids",
      `Cannot render more than two critical constraints for ${String(record?.id)}.`,
    );
  }
  return selectedIds.map(
    (id, index) => {
      const constraint = byId.get(id);
      if (!constraint || constraint.severity !== "critical") {
        throw descriptionError(
          "COMPONENT_DESCRIPTION_CRITICAL_REFERENCE",
          `/documentation/critical_constraint_ids/${index}`,
          `Cannot render critical constraint ${String(id)} for ${String(record?.id)}.`,
        );
      }
      return constraint;
    },
  );
}

export function renderFigmaComponentDescription(record) {
  const purpose = record?.documentation?.purpose;
  if (typeof purpose !== "string" || purpose.trim().length === 0) {
    throw descriptionError(
      "COMPONENT_PURPOSE_MISSING",
      "/documentation/purpose",
      `Cannot render Description without a purpose for ${String(record?.id)}.`,
    );
  }
  const normalizedPurpose = normalizeLf(purpose);
  if (normalizedPurpose.includes("\n")) {
    throw descriptionError(
      "COMPONENT_PURPOSE_MULTILINE",
      "/documentation/purpose",
      `Cannot render a multiline purpose for ${String(record?.id)}.`,
    );
  }
  if ([...purpose].length > 160) {
    throw descriptionError(
      "COMPONENT_PURPOSE_TOO_LONG",
      "/documentation/purpose",
      `Cannot render a purpose longer than 160 Unicode code points for ${String(record?.id)}.`,
    );
  }

  const renderType = deriveComponentRenderType(record);
  if (renderType === null) {
    throw descriptionError(
      "COMPONENT_RENDER_TYPE_UNRESOLVED",
      "/contracts",
      `Cannot render Description with an unresolved type for ${String(record?.id)}.`,
    );
  }

  const lines = [
    `CUPIS ID: ${record.id}`,
    `PURPOSE: ${normalizedPurpose.trim()}`,
    `RENDER: ${renderType}`,
  ];
  const critical = criticalConstraints(record);
  if (critical.length > 0) {
    lines.push("", "CRITICAL");
    for (const constraint of critical) {
      lines.push(`- ${normalizeLf(constraint.statement).replaceAll("\n", " ").trim()}`);
    }
  }
  return lines.join("\n");
}

export function compareFigmaComponentDescription(expected, actual) {
  if (
    typeof expected === "string" &&
    typeof actual === "string" &&
    normalizeLf(expected) === normalizeLf(actual)
  ) {
    return [];
  }
  return [
    descriptionError(
      "FIGMA_COMPONENT_DESCRIPTION_DRIFT",
      "/description",
      "Figma Component Description differs from the generated compact projection.",
    ),
  ];
}

// Public alias for the schema 2 compact projection.
export const renderComponentDescription = renderFigmaComponentDescription;
