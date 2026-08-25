import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";

const SUPPORTED_SPACING_VERSION = "1.0.0";

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

export function validateSpacingSemantics() {
  return [];
}

export function resolveDesignSpacing(spacing, { roleId, viewport }) {
  const role = spacing.roles.find((item) => item.id === roleId);
  return role.resolutions[viewport].value_px;
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
      return { spacing: null, errors: error.errors };
    }
    if (error instanceof SystemValidationError) {
      return { spacing: null, errors: [error] };
    }
    return {
      spacing: null,
      errors: [
        new SystemValidationError(
          "spacing-read",
          `/${dataPath.replaceAll("\\", "/")}`,
          "Spacing foundation could not be read.",
        ),
      ],
    };
  }
}
