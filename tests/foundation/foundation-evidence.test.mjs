import assert from "node:assert/strict";
import test from "node:test";

const moduleUnderTest = await import("../../scripts/lib/foundation-evidence.mjs").catch(() => ({}));
const { compareFoundationObservation } = moduleUnderTest;

const sourcePath = "data/foundations/spacing.yaml#/roles[id=details-row-stack]/resolutions/mobile/value_px";

// Captured example, not a live Figma test. Read-only observation captured 2026-09-16T12:52:52.735+03:00.
function mobileItemSpacing() {
  return {
    file_key: "8zka5bHkcrJVK9I9dKjnhC",
    node_id: "497:26102",
    variant: "Viewport=Mobile",
    viewport: "mobile",
    field_path: "/itemSpacing",
    expected_source_path: sourcePath,
    raw_value: 12,
    captured_at: "2026-09-16T12:52:52.735+03:00",
    binding_claim: "variable",
    binding: {
      kind: "variable",
      id: "VariableID:556:1863",
      name: "mobile/text-gap-lg",
      resolved_type: "FLOAT",
    },
  };
}

const expectedMobileItemSpacing = {
  source_path: sourcePath,
  value: 12,
  binding: {
    kind: "variable",
    id: "VariableID:556:1863",
    name: "mobile/text-gap-lg",
    resolved_type: "FLOAT",
  },
};

function compare(observation, expected = expectedMobileItemSpacing, viewport_specific = true) {
  return compareFoundationObservation({ observation, expected, viewport_specific });
}

test("captured Mobile itemSpacing has typed exact-match evidence", () => {
  assert.equal(typeof compareFoundationObservation, "function");
  const result = compare(mobileItemSpacing());
  assert.equal(result.status, "verified");
  assert.deepEqual(result.issue, { code: "FOUNDATION_EVIDENCE_MATCH" });
});

test("a changed captured Mobile itemSpacing is a typed mismatch", () => {
  const observation = mobileItemSpacing();
  observation.raw_value = 13;
  const result = compare(observation);
  assert.equal(result.status, "unverified");
  assert.equal(result.issue.code, "FOUNDATION_EVIDENCE_MISMATCH");
});

test("only captured integer serialization noise is canonicalized", () => {
  const syntheticCapture = mobileItemSpacing();
  syntheticCapture.raw_value = 12.0000001;
  assert.equal(compare(syntheticCapture).status, "verified");

  const normativeSerializationNoise = { ...expectedMobileItemSpacing, value: 12.0000001 };
  assert.equal(compare(mobileItemSpacing(), normativeSerializationNoise).issue.code,
    "FOUNDATION_EVIDENCE_MISMATCH");

  const changedCapture = mobileItemSpacing();
  changedCapture.raw_value = 12.1;
  assert.equal(compare(changedCapture).issue.code, "FOUNDATION_EVIDENCE_MISMATCH");
});

test("incomplete observations never verify through comparison", () => {
  const cases = [
    ["file_key", "FOUNDATION_OBSERVATION_FILE_KEY_MISSING"],
    ["node_id", "FOUNDATION_OBSERVATION_NODE_ID_MISSING"],
    ["variant", "FOUNDATION_OBSERVATION_VARIANT_MISSING"],
    ["field_path", "FOUNDATION_OBSERVATION_FIELD_PATH_MISSING"],
    ["captured_at", "FOUNDATION_OBSERVATION_CAPTURED_AT_INVALID"],
    ["viewport", "FOUNDATION_OBSERVATION_VIEWPORT_MISSING"],
    ["expected_source_path", "FOUNDATION_OBSERVATION_EXPECTED_SOURCE_PATH_MISSING"],
    ["raw_value", "FOUNDATION_OBSERVATION_RAW_VALUE_MISSING"],
    ["binding", "FOUNDATION_OBSERVATION_BINDING_MISSING"],
  ];
  for (const [field, code] of cases) {
    const observation = mobileItemSpacing();
    delete observation[field];
    const result = compare(observation);
    assert.equal(result.status, "unverified", field);
    assert.equal(result.issue.code, code, field);
  }

  const invalidTimestamp = mobileItemSpacing();
  invalidTimestamp.captured_at = "not-a-timestamp";
  assert.equal(compare(invalidTimestamp).issue.code, "FOUNDATION_OBSERVATION_CAPTURED_AT_INVALID");

  for (const binding_claim of ["variable", "style"]) {
    const observation = mobileItemSpacing();
    observation.binding_claim = binding_claim;
    delete observation.binding;
    assert.equal(compare(observation).issue.code, "FOUNDATION_OBSERVATION_BINDING_MISSING", binding_claim);
  }
});

test("claimed bindings have matching semantic kinds and exact evidence", () => {
  const wrongKind = mobileItemSpacing();
  wrongKind.binding.kind = "style";
  assert.equal(compare(wrongKind).issue.code, "FOUNDATION_OBSERVATION_BINDING_KIND_MISMATCH");

  const changedVariable = mobileItemSpacing();
  changedVariable.binding.name = "mobile/text-gap-md";
  assert.equal(compare(changedVariable).issue.code, "FOUNDATION_EVIDENCE_BINDING_MISMATCH");

  const styleObservation = mobileItemSpacing();
  styleObservation.binding_claim = "style";
  styleObservation.binding = { kind: "style", id: "S:123", name: "Body" };
  const styleExpected = { source_path: sourcePath, value: 12, binding: { kind: "style", id: "S:123", name: "Body" } };
  assert.equal(compare(styleObservation, styleExpected).status, "verified");
});