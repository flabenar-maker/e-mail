// Validate a transient Figma foundation observation and compare it with a
// structured-source value. Audit records document observations; they are never
// read as comparison rules.
function issue(code, fields = {}) {
  return { code, ...fields };
}

function exactString(value) {
  return typeof value === "string" && value.trim() === value && value.length > 0;
}

function exactFieldPath(value) {
  return exactString(value) && value.startsWith("/") && !value.includes("*");
}

function exactSourcePath(value) {
  return exactFieldPath(value) ||
    (exactString(value) && /^data\/[^#\s]+#\/.+/u.test(value) && !value.includes("*"));
}

function canonicalFigmaNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return value;
  const nearestInteger = Math.round(value);
  return Math.abs(value - nearestInteger) < 0.0001 ? nearestInteger : value;
}

function canonicalCapturedValue(value) {
  if (Array.isArray(value)) return value.map(canonicalCapturedValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, canonicalCapturedValue(child)]));
  }
  return canonicalFigmaNumber(value);
}

function equal(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function bindingClaim(observation) {
  return ["variable", "style"].includes(observation?.binding_claim)
    ? observation.binding_claim
    : null;
}

function bindingMissing(binding, claim) {
  if (!binding || typeof binding !== "object" ||
      !exactString(binding.id) || !exactString(binding.name)) return true;
  if (claim === "variable" && !exactString(binding.resolved_type)) return true;
  return false;
}

export function foundationObservationKey(observation, { viewport_specific = false } = {}) {
  const fields = [observation?.file_key, observation?.node_id, observation?.variant];
  if (viewport_specific) fields.push(observation?.viewport);
  fields.push(observation?.field_path);
  return JSON.stringify(fields);
}

export function validateFoundationObservation(observation, { viewport_specific = false } = {}) {
  const issues = [];
  if (!exactString(observation?.file_key)) issues.push(issue("FOUNDATION_OBSERVATION_FILE_KEY_MISSING"));
  if (!exactString(observation?.node_id)) issues.push(issue("FOUNDATION_OBSERVATION_NODE_ID_MISSING"));
  if (!exactString(observation?.variant)) issues.push(issue("FOUNDATION_OBSERVATION_VARIANT_MISSING"));
  if (!exactFieldPath(observation?.field_path)) issues.push(issue("FOUNDATION_OBSERVATION_FIELD_PATH_MISSING"));
  if (!exactSourcePath(observation?.expected_source_path)) {
    issues.push(issue("FOUNDATION_OBSERVATION_EXPECTED_SOURCE_PATH_MISSING"));
  }
  if (!exactString(observation?.captured_at) || !observation.captured_at.includes("T") ||
      !Number.isFinite(Date.parse(observation.captured_at))) {
    issues.push(issue("FOUNDATION_OBSERVATION_CAPTURED_AT_INVALID"));
  }
  if (viewport_specific && !exactString(observation?.viewport)) {
    issues.push(issue("FOUNDATION_OBSERVATION_VIEWPORT_MISSING"));
  }
  if (!Object.hasOwn(observation ?? {}, "raw_value")) {
    issues.push(issue("FOUNDATION_OBSERVATION_RAW_VALUE_MISSING"));
  }
  const claim = bindingClaim(observation);
  if (claim && bindingMissing(observation.binding, claim)) {
    issues.push(issue("FOUNDATION_OBSERVATION_BINDING_MISSING"));
  } else if (claim && observation.binding.kind !== claim) {
    issues.push(issue("FOUNDATION_OBSERVATION_BINDING_KIND_MISMATCH"));
  }
  return {
    status: issues.length === 0 ? "valid" : "unverified",
    observation_key: foundationObservationKey(observation, { viewport_specific }),
    issues,
  };
}

export function compareFoundationObservation({ observation, expected, viewport_specific = false } = {}) {
  const validation = validateFoundationObservation(observation, { viewport_specific });
  if (validation.status !== "valid") {
    return { status: "unverified", observation_key: validation.observation_key, issue: validation.issues[0], issues: validation.issues };
  }
  if (!expected || !exactSourcePath(expected.source_path) || !Object.hasOwn(expected, "value")) {
    return { status: "unverified", observation_key: validation.observation_key, issue: issue("FOUNDATION_EXPECTED_SOURCE_INVALID") };
  }
  if (observation.expected_source_path !== expected.source_path) {
    return { status: "unverified", observation_key: validation.observation_key, issue: issue("FOUNDATION_EVIDENCE_SOURCE_PATH_MISMATCH") };
  }
  const claim = bindingClaim(observation);
  if (claim && (bindingMissing(expected.binding, claim) || expected.binding.kind !== claim ||
      !equal(observation.binding, expected.binding))) {
    return { status: "unverified", observation_key: validation.observation_key, issue: issue("FOUNDATION_EVIDENCE_BINDING_MISMATCH") };
  }
  if (!equal(canonicalCapturedValue(observation.raw_value), expected.value)) {
    return { status: "unverified", observation_key: validation.observation_key, issue: issue("FOUNDATION_EVIDENCE_MISMATCH") };
  }
  return { status: "verified", observation_key: validation.observation_key, issue: issue("FOUNDATION_EVIDENCE_MATCH") };
}