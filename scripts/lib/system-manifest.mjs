import { readFile } from "node:fs/promises";
import { join } from "node:path";

import Ajv2020 from "ajv/dist/2020.js";

import { SystemValidationError } from "./diagnostics.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";

const SUPPORTED_MANIFEST_VERSION = "1.0.0";

function assertNoRemoteRefs(value, path = "#") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoRemoteRefs(item, `${path}/${index}`));
    return;
  }
  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}/${key}`;
    if (
      key === "$ref" &&
      typeof child === "string" &&
      /^https?:\/\//u.test(child)
    ) {
      throw new SystemValidationError(
        "remote-schema-reference",
        childPath,
        "Remote schema references are forbidden.",
      );
    }
    assertNoRemoteRefs(child, childPath);
  }
}

function schemaErrorMessage(error) {
  if (error.keyword === "additionalProperties") {
    return `${error.message}: ${error.params.additionalProperty}`;
  }
  if (error.keyword === "required") {
    return `${error.message}: ${error.params.missingProperty}`;
  }
  return error.message ?? "Manifest does not match its schema.";
}

export function validateManifestShape(manifest, schema) {
  if (manifest?.schema_version !== SUPPORTED_MANIFEST_VERSION) {
    return [
      new SystemValidationError(
        "manifest-version-unsupported",
        "/schema_version",
        `Expected ${SUPPORTED_MANIFEST_VERSION}, received ${String(manifest?.schema_version)}.`,
      ),
    ];
  }

  assertNoRemoteRefs(schema);
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  if (validate(manifest)) {
    return [];
  }

  return validate.errors.map(
    (error) =>
      new SystemValidationError(
        "manifest-schema",
        error.instancePath || "/",
        schemaErrorMessage(error),
      ),
  );
}

export async function loadSystemManifest({
  repoRoot,
  manifestPath = "system/manifest.yaml",
}) {
  const manifest = await readStrictYaml(join(repoRoot, manifestPath));
  const schema = JSON.parse(
    await readFile(join(repoRoot, "schemas/manifest.schema.json"), "utf8"),
  );
  const errors = validateManifestShape(manifest, schema);
  if (errors.length > 0) {
    throw new AggregateError(errors, "System manifest validation failed.");
  }
  return manifest;
}
