import test from "node:test";
import assert from "node:assert/strict";
import uri from "fast-uri";

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

// Direct resolved dependency behavior, with literal expectations from the published advisories.
// These components are synthetic; no connection or remote schema request is made.
test("resolved URI serializer rejects an injected authority port and preserves a numeric port", () => {
  const components = { scheme: "https", host: "trusted.example", path: "/app" };
  assert.equal(uri.serialize({ ...components, port: 8124 }), "https://trusted.example:8124/app");
  assert.throws(() => uri.serialize({ ...components, port: "@127.0.0.1:8124" }));
});

test("resolved URI parser normalizer and equality use a lowercase encoded scheme-relative host", () => {
  const parsed = uri.parse("//%41.com");
  const normalized = uri.normalize("//%41.com");
  const equal = uri.equal("//%41.com", "//a.com");
  assert.deepEqual({ host: parsed.host, normalized, equal }, { host: "a.com", normalized: "//a.com", equal: true });
});

for (const id of ["https://trusted.example/local-schema.json", "local-schema.json", "urn:cupis:local-schema"]) {
  test(`production schema validator resolves only local fragment refs for ID ${id}`, () => {
    const local = {
      ...schema,
      $id: id,
      $defs: { localText: { type: "string", minLength: 3 } },
      properties: { ...schema.properties, value: { $ref: "#/$defs/localText" } },
    };
    assert.deepEqual(validate({ schema_version: "1.0.0", value: "literal-local-value" }, local), []);
    const errors = validate({ schema_version: "1.0.0", value: 8124 }, local);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].code, "fixture-schema");
    assert.equal(errors[0].path, "/value");
    assert.match(errors[0].message, /string/u);
  });
}

test("production schema validator resolves literal escaped slash and tilde JSON Pointer keys", () => {
  const local = {
    ...schema,
    $id: "urn:cupis:escaped-local-pointer",
    $defs: { "slash/key~tail": { type: "string", const: "literal escaped pointer value" } },
    properties: { ...schema.properties, value: { $ref: "#/$defs/slash~1key~0tail" } },
  };
  assert.deepEqual(validate({ schema_version: "1.0.0", value: "literal escaped pointer value" }, local), []);
  const errors = validate({ schema_version: "1.0.0", value: "different literal" }, local);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].code, "fixture-schema");
  assert.equal(errors[0].path, "/value");
  assert.match(errors[0].message, /constant/u);
});

test("production schema validator throws when a local fragment reference is unknown", () => {
  const local = {
    ...schema,
    $id: "urn:cupis:unknown-local-pointer",
    $defs: { present: { type: "string" } },
    properties: { ...schema.properties, value: { $ref: "#/$defs/absent" } },
  };
  assert.throws(
    () => validate({ schema_version: "1.0.0", value: "literal" }, local),
    (error) => error.code !== "remote-schema-reference" && error.message.includes("#/$defs/absent"),
  );
});


test("resolved URI parser rejects an unclosed authority bracket while preserving a valid IPv6 literal", () => {
  const valid = uri.parse("http://[::1]/app");
  assert.equal(valid.error, undefined);
  assert.equal(uri.serialize(valid), "http://[::1]/app");
  const malformed = uri.parse("http://[not-an-ip");
  assert.ok(typeof malformed.error === "string" && malformed.error.length > 0, "Malformed authority must have a nonempty parse error.");
});
