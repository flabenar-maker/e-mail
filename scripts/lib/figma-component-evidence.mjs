import { resolveEvidenceTargets } from "./component-evidence-links.mjs";
import { compareFoundationObservation } from "./foundation-evidence.mjs";

// Pure checker over Model/Session from component-evidence-inputs. Those loaders
// own schemas, raw packet hashes and filesystem containment. The executing
// agent still owns proof of the pinned Git tree and genuine MCP receipts.
// This module never reads persisted source_variants or modifies rendering data.
const sourceKey = source => JSON.stringify([source.variant_node_id, source.node_id, source.field_path]);
const order = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const orderedSources = sources => [...sources].sort((a, b) => order(sourceKey(a), sourceKey(b)));
const orderedIssues = issues => issues.sort((a, b) => order(a.path, b.path) || order(a.code, b.code) || order(a.message, b.message));
const issue = (code, path, message, extra = {}) => ({ code, path, message, ...extra });
const finite = value => typeof value === "number" && Number.isFinite(value);
const hex = value => typeof value === "string" && /^#[0-9a-fA-F]{6}$/u.test(value) && value.length === 7;

function axesKey(axes) {
  if (!Array.isArray(axes) || axes.some(axis => typeof axis?.name !== "string" || typeof axis.value !== "string") ||
      new Set(axes.map(axis => axis.name)).size !== axes.length) return null;
  return JSON.stringify(axes.map(({ name, value }) => [name, value]).sort((a, b) => order(a[0], b[0])));
}

function countContractSlots(node) {
  if (!node || typeof node !== "object") return 0;
  return (node.render_mode === "slot" ? 1 : 0) + (node.children ?? []).reduce((count, child) => count + countContractSlots(child), 0);
}

function templateScope(record, live) {
  const issues = [], obligations = [], nodes = new Map();
  let identityValid = true;
  function invalid(code, path, message) {
    identityValid = false; issues.push(issue(code, path, message));
  }
  if (record?.identity?.semantic_role !== "template") {
    invalid("EVIDENCE_SCOPE_UNSUPPORTED", "/identity/semantic_role", "This checker branch supports Template shell evidence only.");
    return { issues, obligations, nodes, identityValid };
  }
  if (record.identity.node_kind !== "component-set" || !Array.isArray(record.variants)) {
    invalid("EVIDENCE_SCOPE_AMBIGUOUS", "/variants", "Template requires canonical Desktop and Mobile variants.");
    return { issues, obligations, nodes, identityValid };
  }
  if (!live || live.capture_version !== "1.1.0" || live.capture_meta?.tree_complete !== true || !Array.isArray(live.variants)) {
    invalid("EVIDENCE_CAPTURE_INCOMPLETE", "/capture", "A complete capture 1.1.0 tree is required.");
    return { issues, obligations, nodes, identityValid };
  }
  if (live.file_key !== record.figma.file_key || live.component_node_id !== record.figma.node_id) {
    invalid("EVIDENCE_CAPTURE_IDENTITY_MISMATCH", "/capture", "Capture file and owner must exactly match the canonical record.");
  }
  const canonical = new Map();
  for (const viewport of ["desktop", "mobile"]) {
    const matches = record.variants.filter(variant => axesKey(variant.axes) !== null &&
      variant.axes.some(axis => axis.name === "Viewport" && axis.value.toLowerCase() === viewport));
    if (matches.length !== 1) invalid("EVIDENCE_SCOPE_AMBIGUOUS", `/variants/${viewport}`, "Exactly one canonical variant is required for each Viewport.");
    else canonical.set(viewport, matches[0]);
  }
  if (record.variants.length !== 2 || new Set(record.variants.map(v => v.node_id)).size !== record.variants.length) {
    invalid("EVIDENCE_SCOPE_AMBIGUOUS", "/variants", "Template variant identities must be unique and limited to the two canonical Viewports.");
  }
  if (live.variants.length !== record.variants.length || new Set(live.variants.map(v => v.variant_node_id)).size !== live.variants.length ||
      live.variants.some(v => !record.variants.some(c => c.node_id === v.variant_node_id))) {
    invalid("EVIDENCE_CAPTURE_IDENTITY_MISMATCH", "/capture/variants", "Captured variants must match the complete canonical variant set exactly.");
  }
  let count = 0;
  const seen = new Set();
  function visit(node, variantId, ancestors) {
    if (!node || typeof node !== "object" || seen.has(node) || typeof node.node_id !== "string" ||
        (Object.hasOwn(node, "children") && !Array.isArray(node.children)) ||
        (["COMPONENT", "FRAME", "GROUP", "INSTANCE", "SLOT"].includes(node.node_type) && !Array.isArray(node.children))) {
      invalid("EVIDENCE_CAPTURE_INCOMPLETE", "/capture/variants", "Source nodes and container children must be complete and acyclic."); return;
    }
    seen.add(node); count++;
    if (nodes.has(node.node_id)) invalid("EVIDENCE_SOURCE_ID_AMBIGUOUS", "/capture/variants", `Duplicate source node identity: ${node.node_id}.`);
    else nodes.set(node.node_id, { node, variantId, ancestors });
    for (const child of node.children ?? []) visit(child, variantId, [...ancestors, node]);
  }
  for (const variant of live.variants) visit(variant.source_node, variant.variant_node_id, []);
  if (!Number.isSafeInteger(live.capture_meta.node_count) || count !== live.capture_meta.node_count) {
    invalid("EVIDENCE_CAPTURE_INCOMPLETE", "/capture/capture_meta/node_count", "Complete serialized node count must match capture metadata.");
  }
  function add(variant, viewport, node, fieldPath, pointer, comparison) {
    obligations.push({ source: { variant_node_id: variant.node_id, node_id: node.node_id, field_path: fieldPath },
      target: { source_id: "rendering-foundation", pointer }, comparison, viewport });
  }
  function background(variant, viewport, node) {
    const paints = node.fills;
    const visible = Array.isArray(paints) ? paints.map((paint, index) => ({ paint, index })).filter(({ paint }) => paint?.visible === true) : [];
    if (!Array.isArray(paints) || paints.some(paint => typeof paint?.visible !== "boolean") || visible.length !== 1) {
      issues.push(issue("EVIDENCE_PAINT_CONTEXT_UNVERIFIED", `/capture/${node.node_id}/fills`, "Background requires exactly one explicitly visible paint; no first-paint fallback.")); return;
    }
    add(variant, viewport, node, `/fills/${visible[0].index}/color`, "/shell/background_color", "opaque-solid-color");
  }
  for (const [viewport, variant] of canonical) {
    const packets = live.variants.filter(v => v.variant_node_id === variant.node_id);
    if (packets.length !== 1) continue;
    const packet = packets[0], root = packet.source_node;
    if (axesKey(packet.axes) === null || axesKey(packet.axes) !== axesKey(variant.axes) ||
        root?.node_id !== variant.node_id || root.node_type !== "COMPONENT") {
      invalid("EVIDENCE_CAPTURE_IDENTITY_MISMATCH", `/capture/variants/${variant.node_id}`, "Variant axes, root ID and root type must match the canonical variant."); continue;
    }
    background(variant, viewport, root);
    if (viewport === "desktop") add(variant, viewport, root, "/reference_dimensions/width", "/shell/max_width_px", "pixel-number");
    for (const side of ["left", "right"]) add(variant, viewport, root, `/layout/padding/${side}`, "/shell/horizontal_inset_px", "pixel-number");
    const slots = (root.children ?? []).filter(node => node.node_type === "SLOT");
    if (slots.length !== 1 || countContractSlots(record.contracts?.[viewport]?.root) !== 1) {
      issues.push(issue("EVIDENCE_SCOPE_AMBIGUOUS", `/contracts/${viewport}/root`, "Exactly one declared contract slot and one direct live SLOT child are required.")); continue;
    }
    background(variant, viewport, slots[0]);
  }
  return { issues, obligations, nodes, identityValid };
}

// Independently determined requirements: removing links cannot remove duties.
// No claim about the entire Template or about a future email instance.
export function collectRequiredComponentEvidence({ record, live } = {}) {
  const scope = templateScope(record, live);
  return { required_sources: orderedSources(scope.obligations.map(o => o.source)), issues: orderedIssues(scope.issues) };
}

function sourceValue(obligation, scope) {
  const entry = scope.nodes.get(obligation.source.node_id);
  if (!entry || entry.variantId !== obligation.source.variant_node_id) return { reason: "EVIDENCE_SOURCE_IDENTITY_UNVERIFIED" };
  const { node, ancestors } = entry;
  if ([...ancestors, node].some(n => n.visible !== true)) return { reason: "EVIDENCE_SOURCE_VISIBILITY_UNVERIFIED" };
  if (obligation.comparison === "opaque-solid-color") {
    const index = Number(obligation.source.field_path.split("/")[2]), paint = node.fills?.[index];
    if (paint?.type !== "solid" || paint.visible !== true || paint.opacity !== 1 || !hex(paint.color) ||
        [...ancestors, node].some(n => n.opacity !== 1)) return { reason: "EVIDENCE_PAINT_CONTEXT_UNVERIFIED" };
    return { value: paint.color };
  }
  if (obligation.source.field_path === "/reference_dimensions/width") {
    if (node.layout?.horizontal_sizing !== "FIXED" || node.reference_dimensions?.unit !== "px" || !finite(node.reference_dimensions.width)) {
      return { reason: "EVIDENCE_PIXEL_CONTEXT_UNVERIFIED" };
    }
    return { value: node.reference_dimensions.width };
  }
  const side = obligation.source.field_path.split("/").at(-1);
  if (!["HORIZONTAL", "VERTICAL"].includes(node.layout?.mode) || !finite(node.layout?.padding?.[side])) return { reason: "EVIDENCE_PIXEL_CONTEXT_UNVERIFIED" };
  return { value: node.layout.padding[side] };
}

function validTime(value) {
  if (typeof value !== "string" || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]{3})?Z$/u.test(value)) return NaN;
  const parsed = Date.parse(value), normalized = value.includes(".") ? value : value.replace("Z", ".000Z");
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === normalized ? parsed : NaN;
}

function selectCapture(recordId, model, session, issues) {
  if (!/^[a-f0-9]{40}$/u.test(model.canonical_sha ?? "") || session?.schema_version !== "1.0.0" ||
      session.canonical_git_sha !== model.canonical_sha) {
    issues.push(issue("EVIDENCE_SESSION_SHA_MISMATCH", "/session", "A validated session and model must share one pinned canonical SHA.")); return null;
  }
  const selected = session.component_ids?.filter(id => id === recordId), captures = session.captures?.filter(c => c.component_id === recordId);
  if (selected?.length !== 1 || captures?.length !== 1) {
    issues.push(issue("EVIDENCE_CAPTURE_MISSING", "/session/captures", "Exactly one selected owner and capture receipt are required.")); return null;
  }
  const capture = captures[0];
  const times = [session.started_at, capture.packet?.capture_meta?.started_at, capture.packet?.capture_meta?.completed_at, capture.received_at, session.completed_at].map(validTime);
  if (capture.tool !== "use_figma" || typeof capture.receipt_id !== "string" || !capture.receipt_id.trim() ||
      times.some((time, i) => !Number.isFinite(time) || (i > 0 && time < times[i - 1]))) {
    issues.push(issue("EVIDENCE_CAPTURE_TIME_INVALID", "/session/captures", "A receipt from this MCP session and ordered capture timestamps are required.")); return null;
  }
  return capture;
}

export function auditComponentEvidenceLinks({ recordId, model, session } = {}) {
  const issues = [], results = [], verified = [];
  const report = { ok: false, component_id: recordId, canonical_git_sha: model?.canonical_sha ?? null,
    session_started_at: session?.started_at ?? null, receipt_ids: [], results, issues, required_sources: [], verified_sources: [] };
  const records = model?.records?.filter(record => record.id === recordId);
  if (records?.length !== 1) {
    issues.push(issue("EVIDENCE_RECORD_ID_AMBIGUOUS", "/records", "Exactly one canonical owner must be selected.")); return report;
  }
  const record = records[0], capture = selectCapture(recordId, model, session, issues);
  if (capture) report.receipt_ids = [capture.receipt_id];
  const scope = templateScope(record, capture?.packet);
  issues.push(...scope.issues);
  report.required_sources = orderedSources(scope.obligations.map(o => o.source));
  for (const error of capture?.packet?.capture_errors ?? []) issues.push(issue("EVIDENCE_CAPTURE_ERROR", `/capture/${error.node_id ?? ""}/${error.field ?? ""}`, "Original capture diagnostic remains unresolved.", { capture_error: error }));
  const resolved = resolveEvidenceTargets({ records: model.records, manifest: model.manifest, sourceDocuments: model.source_documents });
  issues.push(...resolved.issues);
  const links = record.evidence_links?.foundation_values ?? [];
  const obligations = new Map(scope.obligations.map(o => [sourceKey(o.source), o]));
  for (const obligation of scope.obligations) {
    const matches = links.filter(link => sourceKey(link.source) === sourceKey(obligation.source));
    if (matches.length !== 1) issues.push(issue("EVIDENCE_REQUIRED_LINK_MISSING", `/evidence_links/${sourceKey(obligation.source)}`, "Required source assertion needs exactly one evidence link.", { source: { ...obligation.source } }));
  }
  for (const link of links) {
    const target = resolved.targets.get(`${recordId}/${link.id}`);
    const item = { link_id: link.id, kind: "foundation-value", status: "unverified", source: { file_key: record.figma.file_key, ...link.source }, target: { ...link.target }, reason: "EVIDENCE_INPUT_UNVERIFIED" };
    if (target) item.expected = target.expected;
    const obligation = obligations.get(sourceKey(link.source));
    if (!capture || !scope.identityValid || resolved.issues.length) {
      // Invalid identity cannot be rescued by a matching scalar on another node.
    } else if (!obligation) item.reason = "EVIDENCE_SOURCE_OUTSIDE_REQUIRED_SCOPE";
    else if (!target || link.target.source_id !== obligation.target.source_id || link.target.pointer !== obligation.target.pointer || link.comparison !== obligation.comparison) {
      item.reason = "EVIDENCE_TARGET_PAIRING_MISMATCH";
    } else {
      const observed = sourceValue(obligation, scope);
      if (observed.reason) item.reason = observed.reason;
      else {
        item.actual = observed.value;
        // Canonical source ID plus exact pointer is a stable source path even
        // when manifest relocates the physical file. No caller expected scalar.
        const sourcePath = `/${target.target.source_id}${target.target.pointer}`;
        const compared = compareFoundationObservation({ observation: { file_key: record.figma.file_key, node_id: link.source.node_id,
          variant: link.source.variant_node_id, viewport: obligation.viewport, field_path: link.source.field_path,
          expected_source_path: sourcePath, captured_at: capture.packet.capture_meta.completed_at, raw_value: observed.value },
          expected: { source_path: sourcePath, value: target.expected }, viewport_specific: true });
        item.reason = compared.issue.code;
        item.status = compared.status === "verified" ? "verified" : compared.issue.code === "FOUNDATION_EVIDENCE_MISMATCH" ? "mismatch" : "unverified";
      }
    }
    if (item.status === "verified") verified.push({ ...link.source });
    else issues.push(issue(item.reason, `/evidence_links/${link.id}`, `Foundation assertion is ${item.status}.`, { link_id: link.id }));
    results.push(item);
  }
  for (const link of record.evidence_links?.source_dependencies ?? []) {
    results.push({ link_id: link.id, kind: "source-dependency", status: "unverified", source: { file_key: record.figma.file_key, ...link.source }, target: { ...link.target }, reason: "EVIDENCE_SCOPE_UNSUPPORTED" });
    issues.push(issue("EVIDENCE_SCOPE_UNSUPPORTED", `/evidence_links/${link.id}`, "Source-dependency verification belongs to the separate S1 branch."));
  }
  results.sort((a, b) => order(a.link_id, b.link_id)); orderedIssues(issues);
  report.verified_sources = orderedSources(verified);
  report.ok = issues.length === 0 && report.required_sources.length > 0 && report.verified_sources.length === report.required_sources.length;
  return report;
}
