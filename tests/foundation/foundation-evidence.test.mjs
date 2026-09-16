import assert from "node:assert/strict";
import test from "node:test";

const moduleUnderTest = await import("../../scripts/lib/foundation-evidence.mjs").catch(() => ({}));
const { compareFoundationObservation, validateFoundationObservation } = moduleUnderTest;

// Captured example, not a live Figma test. Read-only observation captured 2026-09-16 Europe/Moscow.
function mobileItemSpacing() {
  return {
    file_key: "8zka5bHkcrJVK9I9dKjnhC",
    node_id: "497:26102",
    variant: "Mobile",
    viewport: "Mobile",
    field_path: "/layout/itemSpacing",
    expected_source_path: "/contracts/mobile/root/facts/0/value/value",
    raw_value: 12.0000001,
    captured_at: "2026-09-16T00:00:00+03:00",
    binding_claim: "variable",
    binding: {
      id: "VariableID:556:1863",
      name: "mobile/text-gap-lg",
      kind: "FLOAT",
    },
  };
}

const expectedMobileItemSpacing = {
  source_path: "/contracts/mobile/root/facts/0/value/value",
  value: 12,
  binding: {
    id: "VariableID:556:1863",
    name: "mobile/text-gap-lg",
    kind: "FLOAT",
  },
};

test("captured Mobile itemSpacing has typed exact-match evidence", () => {
  assert.equal(typeof compareFoundationObservation, "function");
  const result = compareFoundationObservation({
    observation: mobileItemSpacing(),
    expected: expectedMobileItemSpacing,
    viewport_specific: true,
  });
  assert.equal(result.status, "verified");
  assert.deepEqual(result.issue, { code: "FOUNDATION_EVIDENCE_MATCH" });
});

test("a changed captured Mobile itemSpacing is a typed mismatch", () => {
  const observation = mobileItemSpacing();
  observation.raw_value = 13;
  const result = compareFoundationObservation({
    observation,
    expected: expectedMobileItemSpacing,
    viewport_specific: true,
  });
  assert.equal(result.status, "unverified");
  assert.equal(result.issue.code, "FOUNDATION_EVIDENCE_MISMATCH");
});

test("incomplete observations never verify and report typed missing-evidence issues", () => {
  assert.equal(typeof validateFoundationObservation, "function");
  const cases = [
    ["node_id", "FOUNDATION_OBSERVATION_NODE_ID_MISSING"],
    ["variant", "FOUNDATION_OBSERVATION_VARIANT_MISSING"],
    ["field_path", "FOUNDATION_OBSERVATION_FIELD_PATH_MISSING"],
    ["captured_at", "FOUNDATION_OBSERVATION_CAPTURED_AT_INVALID"],
    ["viewport", "FOUNDATION_OBSERVATION_VIEWPORT_MISSING"],
    ["expected_source_path", "FOUNDATION_OBSERVATION_EXPECTED_SOURCE_PATH_MISSING"],
    ["binding", "FOUNDATION_OBSERVATION_BINDING_MISSING"],
  ];
  for (const [field, code] of cases) {
    const observation = mobileItemSpacing();
    if (field === "captured_at") observation[field] = "not-a-timestamp";
    else delete observation[field];
    const result = validateFoundationObservation(observation, {
      viewport_specific: field === "viewport",
    });
    assert.equal(result.status, "unverified", field);
    assert.ok(result.issues.some((issue) => issue.code === code), field);
  }
});

test("a claimed variable binding must exactly match the expected binding", () => {
  const observation = mobileItemSpacing();
  observation.binding.name = "mobile/text-gap-md";
  const result = compareFoundationObservation({
    observation,
    expected: expectedMobileItemSpacing,
    viewport_specific: true,
  });
  assert.equal(result.status, "unverified");
  assert.equal(result.issue.code, "FOUNDATION_EVIDENCE_BINDING_MISMATCH");
});