import test from "node:test";
import assert from "node:assert/strict";

import { validateDocumentShape } from "../../scripts/lib/schema-validation.mjs";

const schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "value"],
  properties: {
    schema_version: { const: "1.0.0" },
    value: { type: "string" },
  },
};

function validate(document, schemaOverride = schema) {
  return validateDocumentShape({
    document,
    schema: schemaOverride,
    supportedVersion: "1.0.0",
    versionCode: "fixture-version-unsupported",
    schemaCode: "fixture-schema",
  });
}

test("accepts a document matching its local schema", () => {
  assert.deepEqual(
    validate({ schema_version: "1.0.0", value: "ok" }),
    [],
  );
});

test("reports an unsupported document version", () => {
  const errors = validate({ schema_version: "2.0.0", value: "ok" });

  assert.equal(errors.length, 1);
  assert.equal(errors[0].code, "fixture-version-unsupported");
  assert.equal(errors[0].path, "/schema_version");
});

test("reports missing required data", () => {
  const errors = validate({ schema_version: "1.0.0" });

  assert.ok(
    errors.some(
      (error) =>
        error.code === "fixture-schema" &&
        error.path === "/" &&
        error.message.includes("value"),
    ),
  );
});

test("reports unknown data", () => {
  const errors = validate({
    schema_version: "1.0.0",
    value: "ok",
    unexpected: true,
  });

  assert.ok(
    errors.some(
      (error) =>
        error.code === "fixture-schema" &&
        error.path === "/" &&
        error.message.includes("unexpected"),
    ),
  );
});

test("rejects remote schema references", () => {
  const remoteSchema = {
    ...schema,
    properties: {
      ...schema.properties,
      value: { $ref: "https://example.com/value.schema.json" },
    },
  };

  assert.throws(
    () => validate({ schema_version: "1.0.0", value: "ok" }, remoteSchema),
    (error) =>
      error.code === "remote-schema-reference" &&
      error.path === "#/properties/value/$ref",
  );
});
