import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";

const SUPPORTED_TYPOGRAPHY_VERSION = "1.0.0";

function diagnostic(code, path, message) {
  return new SystemValidationError(code, path, message);
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

function pushDuplicateDiagnostics(errors, items, key, code, path) {
  for (const value of duplicateValues(items, key)) {
    errors.push(
      diagnostic(code, path, `Duplicate ${key} value: ${value}.`),
    );
  }
}

function sortDiagnostics(errors) {
  return errors.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );
}

export function validateTypographyShape(typography, schema) {
  return validateDocumentShape({
    document: typography,
    schema,
    supportedVersion: SUPPORTED_TYPOGRAPHY_VERSION,
    versionCode: "typography-version-unsupported",
    schemaCode: "typography-schema",
  });
}

export async function loadTypographyFoundation({
  repoRoot,
  dataPath,
  schemaPath,
}) {
  const [typography, schemaText] = await Promise.all([
    readStrictYaml(join(repoRoot, dataPath)),
    readFile(join(repoRoot, schemaPath), "utf8"),
  ]);
  const schema = JSON.parse(schemaText);
  const errors = validateTypographyShape(typography, schema);
  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      "Typography foundation validation failed.",
    );
  }
  return typography;
}

export function validateTypographySemantics(typography) {
  const errors = [];
  pushDuplicateDiagnostics(
    errors,
    typography.styles,
    "id",
    "duplicate-typography-style-id",
    "/styles",
  );
  pushDuplicateDiagnostics(
    errors,
    typography.styles,
    "figma_name",
    "duplicate-typography-figma-name",
    "/styles",
  );
  pushDuplicateDiagnostics(
    errors,
    typography.responsive_pairs,
    "id",
    "duplicate-typography-pair-id",
    "/responsive_pairs",
  );

  const styleById = new Map(
    typography.styles.map((style) => [style.id, style]),
  );
  const pairedStyleIds = new Set();

  typography.responsive_pairs.forEach((pair, pairIndex) => {
    const desktop = styleById.get(pair.desktop_style_id);
    const mobile = styleById.get(pair.mobile_style_id);

    if (!desktop) {
      errors.push(
        diagnostic(
          "unknown-typography-desktop-style",
          `/responsive_pairs/${pairIndex}/desktop_style_id`,
          `Unknown desktop typography style: ${pair.desktop_style_id}.`,
        ),
      );
    } else {
      pairedStyleIds.add(desktop.id);
      if (desktop.viewport !== "desktop") {
        errors.push(
          diagnostic(
            "typography-pair-desktop-viewport",
            `/responsive_pairs/${pairIndex}/desktop_style_id`,
            `Desktop pair target must use desktop viewport: ${desktop.id}.`,
          ),
        );
      }
    }

    if (!mobile) {
      errors.push(
        diagnostic(
          "unknown-typography-mobile-style",
          `/responsive_pairs/${pairIndex}/mobile_style_id`,
          `Unknown mobile typography style: ${pair.mobile_style_id}.`,
        ),
      );
    } else {
      pairedStyleIds.add(mobile.id);
      if (mobile.viewport !== "mobile") {
        errors.push(
          diagnostic(
            "typography-pair-mobile-viewport",
            `/responsive_pairs/${pairIndex}/mobile_style_id`,
            `Mobile pair target must use mobile viewport: ${mobile.id}.`,
          ),
        );
      }
    }

    if (
      desktop &&
      mobile &&
      (desktop.role !== pair.role || mobile.role !== pair.role)
    ) {
      errors.push(
        diagnostic(
          "typography-pair-role-mismatch",
          `/responsive_pairs/${pairIndex}/role`,
          `Pair role ${pair.role} must match ${desktop.id} and ${mobile.id}.`,
        ),
      );
    }
  });

  typography.styles.forEach((style, styleIndex) => {
    const expectedPrefix =
      style.viewport === "desktop" ? "Desktop/" : "Mobile/";
    if (!style.figma_name.startsWith(expectedPrefix)) {
      errors.push(
        diagnostic(
          "typography-figma-name-viewport-mismatch",
          `/styles/${styleIndex}/figma_name`,
          `Figma name must start with ${expectedPrefix} for ${style.id}.`,
        ),
      );
    }
    if (!pairedStyleIds.has(style.id)) {
      errors.push(
        diagnostic(
          "typography-style-unpaired",
          `/styles/${styleIndex}/id`,
          `Typography style is not in a responsive pair: ${style.id}.`,
        ),
      );
    }
  });

  return sortDiagnostics(errors);
}

export async function validateTypographyFoundation({
  repoRoot,
  dataPath,
  schemaPath,
}) {
  try {
    const typography = await loadTypographyFoundation({
      repoRoot,
      dataPath,
      schemaPath,
    });
    return {
      typography,
      errors: validateTypographySemantics(typography),
    };
  } catch (error) {
    if (error instanceof AggregateError) {
      return { typography: null, errors: sortDiagnostics(error.errors) };
    }
    if (error instanceof SystemValidationError) {
      return { typography: null, errors: [error] };
    }
    return {
      typography: null,
      errors: [
        diagnostic(
          "typography-read",
          `/${dataPath.replaceAll("\\", "/")}`,
          "Typography foundation could not be read.",
        ),
      ],
    };
  }
}
