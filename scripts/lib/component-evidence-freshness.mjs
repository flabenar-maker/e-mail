// Pure input-consistency checks, not an attestation of MCP origin. The caller
// must generate fresh host challenges and retain the actual MCP call receipt.
const NONCE = /^[a-f0-9]{64}$/u;
const SHA = /^[a-f0-9]{40}$/u;
const UTC = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]{3})?Z$/u;
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const matches = (pattern, value) => typeof value === "string" && !/[\r\n]/u.test(value) && pattern.test(value);
const issue = (code, path, message) => ({ code, path, message });

function timestamp(value, path, issues) {
  const parsed = matches(UTC, value) ? Date.parse(value) : NaN;
  const normalized = typeof value === "string" && !value.includes(".") ? value.replace("Z", ".000Z") : value;
  if (!Number.isFinite(parsed) || new Date(parsed).toISOString() !== normalized) {
    issues.push(issue("EVIDENCE_TIMESTAMP_INVALID", path, "Timestamp must be a real UTC date with seconds or millisecond precision and a Z suffix."));
    return NaN;
  }
  return parsed;
}

// All envelopes are checked before file reads. One MCP call may supply several
// owners, but its request nonce and exact receipt envelope form a bijection.
export function validateEvidenceSessionFreshness({ session, canonicalSha, path = "/session" } = {}) {
  const issues = [];
  if (!object(session) || session.schema_version !== "1.1.0") {
    return [issue("EVIDENCE_SESSION_VERSION_UNSUPPORTED", `${path}/schema_version`, "Fresh evidence requires session version 1.1.0.")];
  }
  if (!matches(SHA, canonicalSha) || session.canonical_git_sha !== canonicalSha) {
    issues.push(issue("EVIDENCE_SESSION_SHA_MISMATCH", `${path}/canonical_git_sha`, "Session and canonical model must share one pinned SHA."));
  }
  if (!matches(NONCE, session.session_nonce)) {
    issues.push(issue("EVIDENCE_REQUEST_IDENTITY_MISMATCH", `${path}/session_nonce`, "Session nonce must be a fresh host-generated 256-bit lowercase hexadecimal challenge."));
  }
  const start = timestamp(session.started_at, `${path}/started_at`, issues);
  const end = timestamp(session.completed_at, `${path}/completed_at`, issues);
  if (Number.isFinite(start) && Number.isFinite(end) && start > end) {
    issues.push(issue("EVIDENCE_CAPTURE_TIME_INVALID", `${path}/completed_at`, "Session completion precedes its start on the host clock."));
  }
  if (!Array.isArray(session.captures)) {
    issues.push(issue("EVIDENCE_SESSION_SHAPE_INVALID", `${path}/captures`, "Capture receipt array is required."));
    return issues;
  }
  const requests = new Map(), receipts = new Map();
  for (const [index, capture] of session.captures.entries()) {
    const at = `${path}/captures/${index}`;
    if (!object(capture) || capture.tool !== "use_figma" || typeof capture.receipt_id !== "string" || !capture.receipt_id.trim()) {
      issues.push(issue("EVIDENCE_SESSION_SHAPE_INVALID", at, "An actual use_figma receipt is required."));
      continue;
    }
    if (!matches(NONCE, capture.request_nonce)) {
      issues.push(issue("EVIDENCE_REQUEST_IDENTITY_MISMATCH", `${at}/request_nonce`, "Request nonce must be a fresh host-generated 256-bit lowercase hexadecimal challenge."));
    }
    const requested = timestamp(capture.requested_at, `${at}/requested_at`, issues);
    const received = timestamp(capture.received_at, `${at}/received_at`, issues);
    if ([start, requested, received, end].every(Number.isFinite) && !(start <= requested && requested <= received && received <= end)) {
      issues.push(issue("EVIDENCE_CAPTURE_TIME_INVALID", at, "Host ordering: session start <= request <= receipt <= session end."));
    }
    const envelope = JSON.stringify([capture.receipt_id, capture.requested_at, capture.received_at]);
    const receiptRequest = JSON.stringify([capture.request_nonce, capture.requested_at, capture.received_at]);
    if ((requests.has(capture.request_nonce) && requests.get(capture.request_nonce) !== envelope) ||
        (receipts.has(capture.receipt_id) && receipts.get(capture.receipt_id) !== receiptRequest)) {
      issues.push(issue("EVIDENCE_RECEIPT_REQUEST_AMBIGUOUS", at, "A shared batch must have one exact request nonce and receipt envelope; neither may be reused with another envelope."));
    }
    requests.set(capture.request_nonce, envelope);
    receipts.set(capture.receipt_id, receiptRequest);
  }
  return issues;
}

// Used by both disk-backed input loading and direct in-memory audits.
// Host and Figma timestamps are NEVER compared across their clock domains.
export function validateCaptureFreshness({ session, capture, canonicalSha, path = "/capture" } = {}) {
  const issues = validateEvidenceSessionFreshness({ session, canonicalSha });
  const packet = capture?.packet;
  if (!object(packet) || !["1.2.0", "1.3.0"].includes(packet.capture_version)) {
    issues.push(issue("EVIDENCE_CAPTURE_VERSION_UNSUPPORTED", `${path}/packet/capture_version`, "Fresh evidence requires request-bound capture version 1.2.0 or 1.3.0."));
    return issues;
  }
  const request = packet.capture_meta?.request;
  const keys = ["session_nonce", "request_nonce", "canonical_git_sha"];
  if (!object(request) || keys.some(key => !Object.hasOwn(request, key)) || Object.keys(request).some(key => !keys.includes(key)) ||
      !matches(NONCE, request.session_nonce) || !matches(NONCE, request.request_nonce) || !matches(SHA, request.canonical_git_sha) ||
      request.session_nonce !== session?.session_nonce || request.request_nonce !== capture?.request_nonce || request.canonical_git_sha !== canonicalSha) {
    issues.push(issue("EVIDENCE_REQUEST_IDENTITY_MISMATCH", `${path}/packet/capture_meta/request`, "Capture must echo the exact host session nonce, request nonce and pinned canonical SHA."));
  }
  const start = timestamp(packet.capture_meta?.started_at, `${path}/packet/capture_meta/started_at`, issues);
  const end = timestamp(packet.capture_meta?.completed_at, `${path}/packet/capture_meta/completed_at`, issues);
  if (Number.isFinite(start) && Number.isFinite(end) && start > end) {
    issues.push(issue("EVIDENCE_CAPTURE_TIME_INVALID", `${path}/packet/capture_meta`, "Capture completion precedes its start on the Figma clock."));
  }
  return issues;
}
