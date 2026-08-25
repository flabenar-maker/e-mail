import Ajv2020 from "ajv/dist/2020.js";

import { SystemValidationError } from "./diagnostics.mjs";

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
  return error.message ?? "Document does not match its schema.";
}

export function validateDocumentShape({
  document,
  schema,
  supportedVersion,
  versionCode,
  schemaCode,
}) {
  if (document?.schema_version !== supportedVersion) {
    return [
      new SystemValidationError(
        versionCode,
        "/schema_version",
        `Expected ${supportedVersion}, received ${String(document?.schema_version)}.`,
      ),
    ];
  }

  assertNoRemoteRefs(schema);
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  if (validate(document)) {
    return [];
  }

  return validate.errors.map(
    (error) =>
      new SystemValidationError(
        schemaCode,
        error.instancePath || "/",
        schemaErrorMessage(error),
      ),
  );
}
