import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";

const SUPPORTED_ASSETS_VERSION = "1.0.0";

export function validateAssetsShape(assets, schema) {
  return validateDocumentShape({
    document: assets,
    schema,
    supportedVersion: SUPPORTED_ASSETS_VERSION,
    versionCode: "assets-version-unsupported",
    schemaCode: "assets-schema",
  });
}

export async function loadAssetsFoundation({
  repoRoot,
  dataPath = "data/foundations/assets.yaml",
  schemaPath = "schemas/assets.schema.json",
}) {
  const [assets, schemaText] = await Promise.all([
    readStrictYaml(join(repoRoot, dataPath)),
    readFile(join(repoRoot, schemaPath), "utf8"),
  ]);
  const schema = JSON.parse(schemaText);
  const errors = validateAssetsShape(assets, schema);
  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      "Assets foundation validation failed.",
    );
  }
  return assets;
}
