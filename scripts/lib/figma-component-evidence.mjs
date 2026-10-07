import { isDeepStrictEqual } from "node:util";
import {artworkPlacementName, isSharedArtworkReference, verifyRegisteredArtworkInstance} from "./native-owned-artwork.mjs";
import { validateCaptureFreshness } from "./component-evidence-freshness.mjs";
import { auditFigmaContractFacts, hasCompleteMixedTextRuns } from "./figma-contract-facts.mjs";
import { auditContractFactProofs } from "./contract-fact-proofs.mjs";
import { auditNativeFactProofs } from "./native-fact-coverage.mjs";
import { auditNativeRelationProofs } from "./native-relationship-coverage.mjs";
import { auditNativeVariableProofs } from "./native-variable-coverage.mjs";
import { auditNativeContextProofs, applyNativeContextCoverage } from "./native-context-coverage.mjs";
import { matchesRemoteSourceIdentity, resolveEvidenceTargets } from "./component-evidence-links.mjs";
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
  if (!live || !["1.1.0", "1.2.0", "1.3.0"].includes(live.capture_version) || live.capture_meta?.tree_complete !== true || !Array.isArray(live.variants)) {
    invalid("EVIDENCE_CAPTURE_INCOMPLETE", "/capture", "A complete capture 1.1.0 or 1.2.0 tree is required.");
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

// Artwork duties come from roles, export contracts or declared artwork links,
// not from the mere presence of independently checked HTML proof metadata.
function requiresEvidenceScope(record) {
  return ["template", "asset", "icon"].includes(record?.identity?.semantic_role) ||
    (record?.asset_contracts?.length ?? 0) > 0 ||
    (record?.evidence_links?.foundation_values?.length ?? 0) > 0 ||
    (record?.evidence_links?.source_dependencies?.length ?? 0) > 0;
}

// Independently determined requirements: removing links cannot remove duties.
// No claim about the entire Template or about a future email instance.
export function collectRequiredComponentEvidence({ record, live } = {}) {
  if (!requiresEvidenceScope(record)) return { required_sources: [], issues: [] };
  const scope = record?.identity?.semantic_role === "template" ? templateScope(record, live) : artworkScope(record, live);
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

function selectCapture(recordId, model, session, issues) {
  const selected = session?.component_ids?.filter(id => id === recordId), captures = session?.captures?.filter(c => c.component_id === recordId);
  if (selected?.length !== 1 || captures?.length !== 1) {
    issues.push(issue("EVIDENCE_CAPTURE_MISSING", "/session/captures", "Exactly one selected owner and capture receipt are required.")); return null;
  }
  const capture = captures[0];
  const freshnessIssues = validateCaptureFreshness({ session, capture, canonicalSha: model?.canonical_sha, path: "/session/captures" });
  if (freshnessIssues.length) { issues.push(...freshnessIssues); return null; }
  return capture;
}

function auditTemplateEvidence({ recordId, model, session } = {}) {
  const issues = [], results = [], verified = [];
  const report = { ok: false, component_id: recordId, canonical_git_sha: model?.canonical_sha ?? null,
    session_started_at: session?.started_at ?? null, receipt_ids: [], results, issues, capture_diagnostics: [], required_sources: [], verified_sources: [] };
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
  classifyEvidenceCaptureDiagnostics(report, { recordId, model, session });
  orderedIssues(issues);
  report.ok = issues.length === 0 && report.required_sources.length > 0 && report.verified_sources.length === report.required_sources.length;
  return report;
}

// Generic identity proof for artwork owners and targets (not Template policy).
// Only loaded, complete packets are inputs; no saved source_variants fallback.
function inspectArtworkTree(record, live) {
  const issues = [], nodes = new Map(), variants = new Map();
  let identityValid = true, count = 0;
  const fail = (code, path, message) => { identityValid = false; issues.push(issue(code, path, message, { component_id: record.id })); };
  let expected;
  if (record.identity.node_kind === "component" && record.variants.length === 0) expected = [{ node_id: record.figma.node_id, axes: [] }];
  else if (record.identity.node_kind === "component-set" && record.variants.length > 0) expected = record.variants;
  else expected = [];
  if (!expected.length || new Set(expected.map(v => v.node_id)).size !== expected.length) fail("EVIDENCE_SCOPE_AMBIGUOUS", "/variants", "Canonical root/variant identities are ambiguous.");
  if (!live || !["1.1.0", "1.2.0", "1.3.0"].includes(live.capture_version) || live.capture_meta?.tree_complete !== true || !Array.isArray(live.variants)) {
    fail("EVIDENCE_CAPTURE_INCOMPLETE", "/capture", "A complete capture 1.1.0, 1.2.0, or 1.3.0 is required."); return { issues, nodes, variants, identityValid };
  }
  if (live.file_key !== record.figma.file_key || live.component_node_id !== record.figma.node_id) fail("EVIDENCE_CAPTURE_IDENTITY_MISMATCH", "/capture", "Exact canonical file and component owner are required.");
  if (live.variants.length !== expected.length || new Set(live.variants.map(v => v.variant_node_id)).size !== live.variants.length) fail("EVIDENCE_CAPTURE_IDENTITY_MISMATCH", "/capture/variants", "Captured variants must exactly match all canonical variants.");
  const seen = new Set();
  function walk(node, variantId, ancestors) {
    if (!node || typeof node !== "object" || seen.has(node) || typeof node.node_id !== "string" ||
        (Object.hasOwn(node, "children") && !Array.isArray(node.children)) ||
        (["COMPONENT", "COMPONENT_SET", "FRAME", "GROUP", "INSTANCE", "SECTION", "SLOT"].includes(node.node_type) && !Array.isArray(node.children))) {
      fail("EVIDENCE_CAPTURE_INCOMPLETE", "/capture/variants", "Source tree must include complete container children and exact identities."); return;
    }
    seen.add(node); count++;
    if (nodes.has(node.node_id)) fail("EVIDENCE_SOURCE_ID_AMBIGUOUS", `/capture/${node.node_id}`, "Node identity occurs more than once in the owner packet.");
    else nodes.set(node.node_id, { node, variantId, ancestors });
    for (const child of node.children ?? []) walk(child, variantId, [...ancestors, node]);
  }
  for (const variant of live.variants) {
    const registered = expected.filter(v => v.node_id === variant.variant_node_id);
    if (registered.length !== 1 || axesKey(variant.axes) === null || axesKey(variant.axes) !== axesKey(registered[0].axes) ||
        variant.source_node?.node_id !== variant.variant_node_id || variant.source_node.node_type !== "COMPONENT") {
      fail("EVIDENCE_CAPTURE_IDENTITY_MISMATCH", `/capture/variants/${variant.variant_node_id}`, "Variant axes, COMPONENT root and exact root ID must match registration.");
    }
    if (!matchesRemoteSourceIdentity(record, variant.source_node)) {
      fail("EVIDENCE_REMOTE_SOURCE_IDENTITY_MISMATCH", `/capture/variants/${variant.variant_node_id}/remote_source`, "Fresh remote status and publication key must exactly match the registered lookup source.");
    }
    variants.set(variant.variant_node_id, variant.source_node);
    walk(variant.source_node, variant.variant_node_id, []);
  }
  if (!Number.isSafeInteger(live.capture_meta.node_count) || live.capture_meta.node_count !== count) fail("EVIDENCE_CAPTURE_INCOMPLETE", "/capture/capture_meta/node_count", "Serialized node count must match complete capture metadata.");
  if (!Array.isArray(live.capture_errors) || !Array.isArray(live.component_properties)) fail("EVIDENCE_CAPTURE_INCOMPLETE", "/capture", "Capture fact fields and diagnostics are required.");
  for (const error of live.capture_errors ?? []) issues.push(issue("EVIDENCE_CAPTURE_ERROR", `/capture/${error.node_id ?? ""}/${error.field ?? ""}`, "Original capture diagnostic remains unresolved.", { component_id: record.id, capture_error: error }));
  return { issues, nodes, variants, identityValid };
}

// The export selector belongs to source_viewport. A different viewport's
// artwork consumer is identified by its existing contract fact links, not by
// substituting the export layer name or a Shared master's name.
function consumerArtworkNode(record, asset, viewport, variantId, entries) {
  const matches = [];
  function visit(element, path) {
    if (!element) return;
    if (element.asset_contract_id === asset.id) matches.push({ element, path });
    for (const [index, child] of (element.children ?? []).entries()) visit(child, path + '/children/' + index);
  }
  visit(record.contracts?.[viewport]?.root, '/contracts/' + viewport + '/root');
  if (matches.length !== 1 || matches[0].element.render_mode !== 'direct-image') return undefined;
  const { element, path } = matches[0];
  const facts = (element.facts ?? []).map((fact, index) => ({ fact, index })).filter(({ fact }) => fact.id === 'reference-size');
  if (facts.length !== 1) return undefined;
  const { fact, index } = facts[0];
  if (fact.value?.type !== 'dimensions' || fact.value.unit !== 'px' ||
      !finite(fact.value.width) || fact.value.width <= 0 || !finite(fact.value.height) || fact.value.height <= 0 ||
      fact.provenance?.kind !== 'figma-literal' || typeof fact.provenance.node_id !== 'string') return undefined;
  for (const dimension of ['width', 'height']) {
    const pointer = path + '/facts/' + index + '/value/' + dimension;
    const links = (record.contracts.figma_fact_links ?? []).filter(link => link.contract_path === pointer);
    if (links.length !== 1 || links[0].variant_node_id !== variantId ||
        links[0].node_id !== fact.provenance.node_id || links[0].transform !== 'identity' ||
        links[0].source_path !== '/reference_dimensions/' + dimension) return undefined;
  }
  const selected = entries.filter(entry => entry.node.node_id === fact.provenance.node_id && entry.ancestors.length > 0);
  if (selected.length !== 1) return undefined;
  try { if (selected[0].node.name !== artworkPlacementName({record, element, asset, variant_node_id: variantId})) return undefined; }
  catch { return undefined; }
  return selected[0].node;
}

function artworkScope(record, live) {
  const scope = inspectArtworkTree(record, live);
  scope.obligations = [];
  scope.boundaries = [];
  if (!scope.identityValid) return scope;
  const assets = record.asset_contracts;
  const sourceOnly = ["asset", "icon"].includes(record.identity.semantic_role) &&
    ["mobile", "desktop"].every(viewport => record.contracts?.[viewport]?.root?.render_mode === "figma-source-only");
  if (!sourceOnly && assets.length === 0) {
    scope.issues.push(issue("EVIDENCE_SCOPE_UNSUPPORTED", "/asset_contracts", "No declared artwork boundary or source-only artwork role is available.")); return scope;
  }
  for (const [variantId, root] of scope.variants) {
    const entries = [...scope.nodes.values()].filter(entry => entry.variantId === variantId);
    const boundaries = [];
    if (sourceOnly && assets.length === 0) boundaries.push({ node: root });
    for (const asset of assets) {
      const boundary = asset.export_boundary;
      if (!["node", "fill"].includes(boundary?.kind) || typeof boundary.semantic_node_name !== "string" || !boundary.semantic_node_name || typeof asset.owner_layer_name !== "string" || !asset.owner_layer_name) {
        scope.issues.push(issue("EVIDENCE_ASSET_BOUNDARY_UNVERIFIED", `/asset_contracts/${asset.id}`, "Existing export boundary and owner selector are required.")); continue;
      }
      const variant = record.variants.find(candidate => candidate.node_id === variantId);
      const viewport = variant?.axes.find(axis => axis.name === 'Viewport')?.value.toLowerCase();
      const localConsumer = !sourceOnly && boundary.kind === 'node' && asset.source_mode_id === 'rendered-node' &&
        ['mobile', 'desktop'].includes(viewport) && ['mobile', 'desktop'].includes(asset.source_viewport) && viewport !== asset.source_viewport;
      let node;
      if (localConsumer) {
        const sameViewport = record.variants.filter(candidate => candidate.axes.some(axis => axis.name === 'Viewport' && axis.value.toLowerCase() === viewport));
        if (sameViewport.length === 1) node = consumerArtworkNode(record, asset, viewport, variantId, entries);
      } else {
        const selected = entries.filter(({ node }) => node.name === boundary.semantic_node_name);
        const owners = entries.filter(({ node }) => node.name === asset.owner_layer_name);
        if (selected.length === 1 && owners.length === 1 && selected[0].node.node_id === owners[0].node.node_id) node = selected[0].node;
        // A sole node-export of an asset-role record may be its canonical root.
        // Never use this allowance to resolve duplicate or conflicting selectors.
        else if (selected.length === 0 && owners.length === 0 && record.identity.semantic_role === "asset" && assets.length === 1 && boundary.kind === "node") node = root;
      }
      if (!node) {
        scope.issues.push(issue("EVIDENCE_ASSET_BOUNDARY_UNVERIFIED", `/asset_contracts/${asset.id}/${variantId}`, "The export selector or exact viewport consumer links must resolve unambiguously to one existing boundary.")); continue;
      }
      const elements = [];
      function elementForAsset(element) { if (element.asset_contract_id === asset.id) elements.push(element); (element.children ?? []).forEach(elementForAsset); }
      if (['mobile', 'desktop'].includes(viewport)) elementForAsset(record.contracts[viewport].root);
      if (elements.length === 1 && elements[0].visibility?.mode === 'always' && node.visible !== true) {
        scope.issues.push(issue("EVIDENCE_ASSET_BOUNDARY_UNVERIFIED", '/asset_contracts/' + asset.id + '/' + variantId, "The always-visible actual artwork boundary must be visible.")); continue;
      }
      boundaries.push({ node, asset_id: asset.id });
    }
    scope.boundaries.push(...boundaries.map(boundary => ({ ...boundary, variant_node_id: variantId })));
    for (const entry of entries.filter(entry => entry.node.node_type === "INSTANCE")) {
      const owners = boundaries.filter(boundary => entry.node.node_id === boundary.node.node_id || entry.ancestors.some(ancestor => ancestor.node_id === boundary.node.node_id));
      if (owners.length === 0) continue; // HTML nested components outside artwork.
      if (owners.length !== 1) {
        scope.issues.push(issue("EVIDENCE_SCOPE_AMBIGUOUS", `/capture/${entry.node.node_id}`, "Instance belongs to overlapping or duplicate asset boundaries.")); continue;
      }
      const owner = owners[0];
      scope.obligations.push({ source: { variant_node_id: variantId, node_id: entry.node.node_id, field_path: "/node_id" },
        asset_owner: { node_id: owner.node.node_id, ...(owner.asset_id === undefined ? {} : { asset_id: owner.asset_id }) } });
    }
  }
  return scope;
}

// Ephemeral diagnostic disposition, never a fact-coverage exemption. Keep raw
// errors in the packet and in the report; only the unresolved errors block this
// branch. Layout inside a proven raster boundary is not separate HTML layout.
function classifyEvidenceCaptureDiagnostics(report, { recordId, model, session }, inherited = []) {
  report.capture_diagnostics = [];
  const resolved = resolveEvidenceTargets({ records: model.records, manifest: model.manifest, sourceDocuments: model.source_documents });
  const loaded = new Map(), complete = new Map();
  function load(id) {
    if (!loaded.has(id)) {
      const records = model.records.filter(record => record.id === id), errors = [];
      const capture = records.length === 1 ? selectCapture(id, model, session, errors) : null;
      const record = records[0];
      const tree = capture && record ? inspectArtworkTree(record, capture.packet) : null;
      const scope = tree?.identityValid && record.identity.semantic_role !== "template" &&
        (record.asset_contracts.length || ["asset", "icon"].includes(record.identity.semantic_role))
        ? artworkScope(record, capture.packet) : tree;
      loaded.set(id, { record, capture, scope, valid: !!scope?.identityValid && !errors.length });
      if (capture) report.receipt_ids = [...new Set([...report.receipt_ids, capture.receipt_id])].sort(order);
    }
    return loaded.get(id);
  }
  function eligible(record, boundary) {
    if (boundary.asset_id === undefined) return ["asset", "icon"].includes(record.identity.semantic_role) &&
      record.asset_contracts.length === 0 && ["mobile", "desktop"].every(viewport =>
        record.contracts[viewport].root.render_mode === "figma-source-only" && record.contracts[viewport].root.children.length === 0);
    const assets = record.asset_contracts.filter(asset => asset.id === boundary.asset_id);
    if (assets.length !== 1 || assets[0].source_mode_id !== "rendered-node" || assets[0].export_boundary.kind !== "node") return false;
    const variant = record.variants.find(variant => variant.node_id === boundary.variant_node_id);
    const viewport = variant?.axes?.find(axis => axis.name === "Viewport")?.value.toLowerCase();
    const viewports = ["mobile", "desktop"].includes(viewport) ? [viewport] : ["mobile", "desktop"];
    return viewports.every(viewport => {
      const elements = [];
      function visit(element) { if (element.asset_contract_id === boundary.asset_id) elements.push(element); (element.children ?? []).forEach(visit); }
      visit(record.contracts[viewport].root);
      return elements.length === 1 && elements[0].render_mode === "direct-image" && elements[0].children.length === 0;
    });
  }
  const contains = (entry, id) => entry?.node.node_id === id || entry?.ancestors.some(node => node.node_id === id);
  function ownBoundary(current, entry) {
    const boundaries = (current.scope?.boundaries ?? []).filter(boundary => boundary.variant_node_id === entry?.variantId && contains(entry, boundary.node.node_id));
    return boundaries.length === 1 && eligible(current.record, boundaries[0]) ? boundaries[0] : null;
  }
  const nativeAbsolute = entry => entry?.node.layout?.mode === "NONE" && Array.isArray(entry.node.children) && entry.node.children.length > 0;
  const unresolvedMain = (entry, raw) => raw.code === "MAIN_COMPONENT_UNRESOLVED" && raw.field === undefined &&
    entry?.node.node_type === "INSTANCE" && entry.node.main_component_id === null;
  function unusedOwnSharedOrigin(current, entry, raw) {
    if (!unresolvedMain(entry, raw) || isSharedArtworkReference(current.record)) return false;
    const boundary = ownBoundary(current, entry);
    if (!boundary || boundary.asset_id === undefined) return false;
    const links = (current.record.evidence_links?.source_dependencies ?? []).filter(link =>
      link.source.variant_node_id === entry.variantId && link.source.node_id === entry.node.node_id &&
      link.asset_owner.node_id === boundary.node.node_id && link.asset_owner.asset_id === boundary.asset_id);
    if (links.length !== 1 || !isSharedArtworkReference(model.records.find(record => record.id === links[0].target.component_id))) return false;
    try { verifyRegisteredArtworkInstance({record: current.record, link: links[0], node: entry.node, records: model.records}); return true; }
    catch { return false; }
  }
  function closure(id, trail = new Set()) {
    if (trail.has(id) || resolved.issues.length) return false;
    if (complete.has(id)) return complete.get(id);
    const current = load(id), scope = current.scope;
    let ok = current.valid && Array.isArray(scope?.boundaries) &&
      !scope.issues.some(value => value.code !== "EVIDENCE_CAPTURE_ERROR");
    if (ok) for (const error of current.capture.packet.capture_errors) {
      const entry = scope.nodes.get(error.node_id);
      if (unusedOwnSharedOrigin(current, entry, error)) continue;
      if (error.code === "MIXED_VALUE" && hasCompleteMixedTextRuns(entry?.node, error.field)) continue;
      if (error.code === "ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW" && nativeAbsolute(entry) && ownBoundary(current, entry)) continue;
      ok = false; break;
    }
    if (ok) for (const obligation of scope.obligations ?? []) {
      const links = (current.record.evidence_links?.source_dependencies ?? []).filter(link =>
        link.source.variant_node_id === obligation.source.variant_node_id && link.source.node_id === obligation.source.node_id);
      const link = links.length === 1 ? links[0] : null, target = link && resolved.targets.get(`${id}/${link.id}`);
      const actual = scope.nodes.get(obligation.source.node_id)?.node;
      if (!link || !target || link.asset_owner.node_id !== obligation.asset_owner.node_id || link.asset_owner.asset_id !== obligation.asset_owner.asset_id ||
          actual?.node_type !== "INSTANCE") { ok = false; break; }
       if (isSharedArtworkReference(model.records.find(record => record.id === target.target.component_id))) {
         try {verifyRegisteredArtworkInstance({record: current.record, link, node: actual, records: model.records});}
         catch {ok = false; break;}
       } else if (actual.main_component_id !== target.target.node_id ||
          !load(target.target.component_id).scope?.variants.has(target.target.node_id) ||
          !closure(target.target.component_id, new Set([...trail, id]))) { ok = false; break; }
    }
    complete.set(id, !!ok); return !!ok;
  }
  function unusedProjectedSharedOrigin(componentId, current, entry, raw) {
    if (componentId !== recordId || !unresolvedMain(entry, raw) ||
        report.issues.some(value => value.code !== "EVIDENCE_CAPTURE_ERROR") ||
        !Array.isArray(report.dependencies) || !report.dependencies.every(value => value.status === "verified")) return false;
    const boundaries = inherited.filter(boundary => boundary.consumer_variant_node_id === entry.variantId && contains(entry, boundary.consumer_node_id));
    if (boundaries.length !== 1) return false;
    const boundary = boundaries[0], child = load(boundary.owner_component_id);
    const native = (child.scope?.boundaries ?? []).filter(value => value.variant_node_id === boundary.source_variant_node_id &&
      value.node.node_id === boundary.source_node_id && value.asset_id === boundary.asset_id);
    if (native.length !== 1 || !eligible(child.record, native[0]) || !closure(boundary.owner_component_id)) return false;
    const proofs = report.dependencies.filter(value => value.source?.variant_node_id === entry.variantId && value.source.node_id === entry.node.node_id &&
      value.source.field_path === "/node_id" && value.owner_component_id === boundary.owner_component_id &&
      value.asset_owner.node_id === boundary.consumer_node_id && value.asset_owner.asset_id === boundary.asset_id &&
      isSharedArtworkReference(model.records.find(record => record.id === value.target.component_id)));
    return current.valid && proofs.length === 1;
  }
  const rawIssues = report.issues.filter(value => value.code === "EVIDENCE_CAPTURE_ERROR");
  const unresolved = [];
  for (const diagnostic of rawIssues) {
    const componentId = diagnostic.component_id ?? recordId, current = load(componentId), raw = diagnostic.capture_error;
    const entry = current.scope?.nodes.get(raw.node_id);
    let verified = false, notRequired = false, reason = "EVIDENCE_CAPTURE_DIAGNOSTIC_UNVERIFIED";
    if (current.valid && (unusedOwnSharedOrigin(current, entry, raw) && closure(componentId) ||
        unusedProjectedSharedOrigin(componentId, current, entry, raw))) {
      notRequired = true; reason = "EVIDENCE_SHARED_ORIGIN_NOT_REQUIRED";
    } else if (current.valid && raw.code === "MIXED_VALUE" && hasCompleteMixedTextRuns(entry?.node, raw.field)) {
      verified = true; reason = "EVIDENCE_COMPLETE_MIXED_TEXT_RUNS";
    } else if (current.valid && raw.code === "ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW" && nativeAbsolute(entry)) {
      const own = ownBoundary(current, entry);
      if (own && closure(componentId)) { verified = true; reason = "EVIDENCE_NODE_ARTWORK_LAYOUT"; }
      else {
        const boundaries = inherited.filter(boundary => componentId === recordId && boundary.consumer_variant_node_id === entry.variantId && contains(entry, boundary.consumer_node_id));
        // A projected boundary is usable only after every placement/dependency
        // check passed. It never relaxes an unrelated parent HTML layout.
        if (boundaries.length === 1 && !report.issues.some(value => value.code !== "EVIDENCE_CAPTURE_ERROR") &&
            report.dependencies?.every(value => value.status === "verified")) {
          const boundary = boundaries[0], child = load(boundary.owner_component_id);
          const native = (child.scope?.boundaries ?? []).filter(value => value.variant_node_id === boundary.source_variant_node_id &&
            value.node.node_id === boundary.source_node_id && value.asset_id === boundary.asset_id);
          if (native.length === 1 && eligible(child.record, native[0]) && closure(boundary.owner_component_id)) {
            verified = true; reason = "EVIDENCE_PROJECTED_NODE_ARTWORK_LAYOUT";
          }
        }
      }
    }
    report.capture_diagnostics.push({ component_id: componentId, raw: structuredClone(raw), status: notRequired ? "not-required" : verified ? "verified" : "unverified", reason });
    if (!verified && !notRequired) unresolved.push(diagnostic);
  }
  report.issues.splice(0, report.issues.length, ...report.issues.filter(value => value.code !== "EVIDENCE_CAPTURE_ERROR"), ...unresolved);
}

function auditArtworkEvidence({ recordId, model, session }) {
  const issues = [], results = [], verified = [], receipts = new Set();
  const report = { ok: false, component_id: recordId, canonical_git_sha: model?.canonical_sha ?? null,
    session_started_at: session?.started_at ?? null, receipt_ids: [], results, issues, capture_diagnostics: [], required_sources: [], verified_sources: [] };
  const records = model?.records?.filter(record => record.id === recordId);
  if (records?.length !== 1) { issues.push(issue("EVIDENCE_RECORD_ID_AMBIGUOUS", "/records", "Exactly one canonical owner is required.")); return report; }
  const record = records[0], capture = selectCapture(recordId, model, session, issues);
  if (capture) receipts.add(capture.receipt_id);
  const scope = artworkScope(record, capture?.packet);
  issues.push(...scope.issues);
  report.required_sources = orderedSources(scope.obligations.map(o => o.source));
  const resolved = resolveEvidenceTargets({ records: model.records, manifest: model.manifest, sourceDocuments: model.source_documents });
  issues.push(...resolved.issues);
  const links = record.evidence_links?.source_dependencies ?? [];
  const source = link => ({ ...link.source, field_path: "/node_id" });
  const obligations = new Map(scope.obligations.map(o => [sourceKey(o.source), o]));
  for (const obligation of scope.obligations) {
    if (links.filter(link => sourceKey(source(link)) === sourceKey(obligation.source)).length !== 1) issues.push(issue("EVIDENCE_REQUIRED_LINK_MISSING", `/evidence_links/${sourceKey(obligation.source)}`, "Every actual INSTANCE in artwork requires its own dependency link.", { source: { ...obligation.source } }));
  }
  const targets = new Map();
  function targetTree(id) {
    if (!targets.has(id)) {
      const targetRecord = model.records.find(candidate => candidate.id === id);
      const targetCapture = selectCapture(id, model, session, issues);
      if (targetCapture) receipts.add(targetCapture.receipt_id);
      const tree = inspectArtworkTree(targetRecord, targetCapture?.packet);
      issues.push(...tree.issues); targets.set(id, tree);
    }
    return targets.get(id);
  }
  for (const link of links) {
    const target = resolved.targets.get(`${recordId}/${link.id}`), obligation = obligations.get(sourceKey(source(link)));
    const item = { link_id: link.id, kind: "source-dependency", status: "unverified", source: { file_key: record.figma.file_key, ...link.source },
      target: target ? { ...target.target } : { ...link.target }, asset_owner: { ...link.asset_owner }, reason: "EVIDENCE_INPUT_UNVERIFIED" };
    if (target) item.expected = target.target.node_id;
    if (!capture || !scope.identityValid || resolved.issues.length) { /* identity precedes values */ }
    else if (!obligation) item.reason = "EVIDENCE_SOURCE_OUTSIDE_REQUIRED_SCOPE";
    else if (link.asset_owner.node_id !== obligation.asset_owner.node_id || link.asset_owner.asset_id !== obligation.asset_owner.asset_id) item.reason = "EVIDENCE_ASSET_OWNER_MISMATCH";
    else if (target) {
      const actual = scope.nodes.get(link.source.node_id)?.node, targetRecord = model.records.find(record => record.id === link.target.component_id);
      const shared = isSharedArtworkReference(targetRecord), tree = shared ? null : targetTree(link.target.component_id);
      if (shared) {
        item.expected = link.source.node_id;
        try {
          verifyRegisteredArtworkInstance({record, link, node: actual, records: model.records});
          item.actual = actual.node_id; item.status = "verified"; item.reason = "EVIDENCE_ACTUAL_ARTWORK_NODE_MATCH";
        } catch { item.reason = "EVIDENCE_ACTUAL_ARTWORK_NODE_UNVERIFIED"; }
      }
      else if (!tree.identityValid || !tree.variants.has(target.target.node_id)) item.reason = "EVIDENCE_TARGET_IDENTITY_UNVERIFIED";
      else if (actual?.node_type !== "INSTANCE" || typeof actual.main_component_id !== "string" || !actual.main_component_id) item.reason = "EVIDENCE_MAIN_COMPONENT_UNVERIFIED";
      else {
        item.actual = actual.main_component_id;
        item.status = item.actual === item.expected ? "verified" : "mismatch";
        item.reason = item.status === "verified" ? "EVIDENCE_MAIN_COMPONENT_MATCH" : "EVIDENCE_MAIN_COMPONENT_MISMATCH";
      }
    }
    if (item.status === "verified") verified.push({ ...link.source,
      field_path: isSharedArtworkReference(model.records.find(record => record.id === link.target.component_id)) ? "/node_id" : "/main_component_id" });
    else issues.push(issue(item.reason, `/evidence_links/${link.id}`, `Source dependency is ${item.status}.`, { link_id: link.id }));
    results.push(item);
  }
  for (const link of record.evidence_links?.foundation_values ?? []) {
    results.push({ link_id: link.id, kind: "foundation-value", status: "unverified", source: { file_key: record.figma.file_key, ...link.source }, target: { ...link.target }, reason: "EVIDENCE_SCOPE_UNSUPPORTED" });
    issues.push(issue("EVIDENCE_SCOPE_UNSUPPORTED", `/evidence_links/${link.id}`, "Shell assertions require Template role."));
  }
  report.receipt_ids = [...receipts].sort(order);
  report.required_sources = orderedSources(scope.obligations.map(obligation => {
    const candidates = links.filter(link => sourceKey(source(link)) === sourceKey(obligation.source));
    return candidates.length === 1 && !isSharedArtworkReference(model.records.find(record => record.id === candidates[0].target.component_id))
      ? { ...obligation.source, field_path: "/main_component_id" } : obligation.source;
  }));
  report.verified_sources = orderedSources(verified);
  classifyEvidenceCaptureDiagnostics(report, { recordId, model, session });
  results.sort((a, b) => order(a.link_id, b.link_id)); orderedIssues(issues);
  report.ok = issues.length === 0 && verified.length === scope.obligations.length;
  return report;
}

export function auditComponentEvidenceLinks(input = {}) {
  const record = input.model?.records?.find(candidate => candidate.id === input.recordId);
  return record?.identity?.semantic_role === "template" ? auditTemplateEvidence(input) : auditArtworkEvidence(input);
}

function nestedReferences(record, viewport) {
  const result = [];
  function walk(element, path) {
    if (!element) return;
    if (element.render_mode === "nested-component") result.push({ element, path });
    for (const [index, child] of (element.children ?? []).entries()) walk(child, `${path}/children/${index}`);
  }
  for (const value of viewport ? [viewport] : ["mobile", "desktop"]) walk(record.contracts?.[value]?.root, `/contracts/${value}/root`);
  return result;
}

// Resolve nested HTML placement independently of the graphic's own export
// selector. Width/height are native facts in THIS owner's current packet, not
// dimensions borrowed from the child master or its exported file.
function nestedPlacement(record, reference, variantId, tree) {
  const sizes = (reference.element.facts ?? []).map((fact, index) => ({ fact, index })).filter(({ fact }) => fact.id === "reference-size");
  if (sizes.length !== 1) return null;
  const { fact, index } = sizes[0], size = fact.value, id = fact.provenance?.node_id;
  if (fact.provenance?.kind !== "figma-literal" || size?.type !== "dimensions" || size.unit !== "px" ||
      !finite(size.width) || size.width <= 0 || !finite(size.height) || size.height <= 0) return null;
  const entry = tree.nodes.get(id);
  if (!entry || entry.variantId !== variantId || entry.ancestors.length === 0 || entry.node.node_type !== "INSTANCE" || entry.node.reference_dimensions?.unit !== "px") return null;
  for (const dimension of ["width", "height"]) {
    const path = `${reference.path}/facts/${index}/value/${dimension}`;
    const links = (record.contracts.figma_fact_links ?? []).filter(link => link.contract_path === path);
    if (links.length !== 1 || links[0].variant_node_id !== variantId || links[0].node_id !== id ||
        links[0].source_path !== `/reference_dimensions/${dimension}` || links[0].transform !== "identity") return null;
    const actual = entry.node.reference_dimensions[dimension];
    if (!finite(actual) || (Math.abs(actual - Math.round(actual)) < 0.0001 ? Math.round(actual) : actual) !== size[dimension]) return null;
  }
  return entry.node;
}

// A full compound ID is constructed from the proven actual instance and the
// exact native descendant identity, then looked up in the complete parent tree.
// No lookup by a stripped suffix, label, position or matching geometry.
function projectedNodeId(nativeId, nativeRoot, actualRoot) {
  if (nativeId === nativeRoot) return actualRoot;
  const valid = /^(?:[0-9]+:[0-9]+|I[0-9]+:[0-9]+(?:;[0-9]+:[0-9]+)+)$/u;
  if (!valid.test(nativeId) || !valid.test(actualRoot)) return null;
  return "I" + actualRoot.replace(/^I/u, "") + ";" + nativeId.replace(/^I/u, "");
}

// Qualified, ephemeral proof over existing contracts and fresh packets. The
// parent never acquires the child's assets. Scalar facts stay independent;
// original capture diagnostics receive only the narrow ephemeral disposition
// below. Shared graphics are checked only inside the actual consuming boundary.
export function auditNestedArtworkEvidence({ recordId, model, session } = {}) {
  const issues = [], boundaries = [], dependencies = [], receipts = new Set();
  const report = { ok: false, component_id: recordId, canonical_git_sha: model?.canonical_sha ?? null,
    session_started_at: session?.started_at ?? null, receipt_ids: [], boundaries, dependencies, issues, capture_diagnostics: [] };
  const fail = (code, path, message, extra = {}) => issues.push(issue(code, path, message, extra));
  const owners = model?.records?.filter(record => record.id === recordId);
  if (owners?.length !== 1) { fail("EVIDENCE_RECORD_ID_AMBIGUOUS", "/records", "Exactly one canonical parent is required."); return report; }
  const byId = new Map(), duplicates = new Set();
  for (const record of model.records) {
    if (byId.has(record.id)) duplicates.add(record.id);
    else byId.set(record.id, record);
  }
  const owner = owners[0], trees = new Map(), scopes = new Map(), reachable = new Map();
  function hasArtwork(id, visiting = new Set()) {
    if (visiting.has(id)) { fail("EVIDENCE_DEPENDENCY_CYCLE", "/contracts", "Nested component dependency cycle.", { component_id: id }); return false; }
    if (reachable.has(id)) return reachable.get(id);
    const record = byId.get(id);
    if (!record || duplicates.has(id)) { fail("EVIDENCE_NESTED_TARGET_UNKNOWN", "/contracts", "Nested component must name one registered canonical record.", { component_id: id }); return false; }
    const path = new Set([...visiting, id]);
    const own = (record.asset_contracts?.length ?? 0) > 0 || ["asset", "icon"].includes(record.identity?.semantic_role);
    // Do not short-circuit the graph: an unknown/cyclic nested child is still a
    // diagnostic even if this component already has its own graphic.
    const children = nestedReferences(record).map(reference => hasArtwork(reference.element.component_id, path));
    const result = own || children.some(Boolean); reachable.set(id, result); return result;
  }
  function treeFor(id) {
    if (!trees.has(id)) {
      const record = byId.get(id);
      if (!record || duplicates.has(id)) { fail("EVIDENCE_NESTED_TARGET_UNKNOWN", "/records", "A unique registered source is required.", { component_id: id }); return null; }
      const capture = selectCapture(id, model, session, issues);
      if (!capture) { trees.set(id, null); return null; }
      receipts.add(capture.receipt_id);
      const tree = inspectArtworkTree(record, capture.packet); issues.push(...tree.issues);
      trees.set(id, { record, capture, tree });
    }
    return trees.get(id);
  }
  function scopeFor(id) {
    if (!scopes.has(id)) {
      const current = treeFor(id);
      if (!current || !current.tree.identityValid) { scopes.set(id, null); return null; }
      const scope = (current.record.asset_contracts.length || ["asset", "icon"].includes(current.record.identity.semantic_role))
        ? artworkScope(current.record, current.capture.packet) : { ...current.tree, boundaries: [], obligations: [] };
      // treeFor already retained original diagnostics; scope adds only its
      // selector/ownership diagnostics, not duplicate raw capture errors.
      for (const diagnostic of scope.issues) if (!current.tree.issues.some(existing => isDeepStrictEqual(existing, diagnostic))) issues.push(diagnostic);
      if (scope.issues.some(diagnostic => ["EVIDENCE_ASSET_BOUNDARY_UNVERIFIED", "EVIDENCE_SCOPE_AMBIGUOUS"].includes(diagnostic.code))) {
        fail("EVIDENCE_NESTED_SELECTOR_UNVERIFIED", `/records/${id}/asset_contracts`, "Child export scope is not unambiguous.");
      }
      scopes.set(id, scope);
    }
    return scopes.get(id);
  }
  const relevant = nestedReferences(owner).filter(reference => hasArtwork(reference.element.component_id));
  if (!relevant.length) { report.ok = issues.length === 0; orderedIssues(issues); return report; }
  const parent = treeFor(recordId);
  if (!parent || !parent.tree.identityValid) return report;
  const resolved = resolveEvidenceTargets({ records: model.records, manifest: model.manifest, sourceDocuments: model.source_documents });
  issues.push(...resolved.issues);
  function actualNode(nativeNode, context, actualVariantId) {
    const id = context ? projectedNodeId(nativeNode.node_id, context.nativeRoot, context.actualRoot) : nativeNode.node_id;
    const entry = id && parent.tree.nodes.get(id);
    if (!entry || entry.variantId !== actualVariantId || (context && entry.node.node_id !== context.actualRoot &&
        !entry.ancestors.some(ancestor => ancestor.node_id === context.actualRoot))) return null;
    return entry;
  }
  function visit(currentId, nativeVariantId, viewport, context, actualVariantId, trail) {
    const current = treeFor(currentId);
    if (!current || !current.tree.identityValid) return;
    for (const reference of nestedReferences(current.record, viewport)) {
      const targetId = reference.element.component_id;
      if (!hasArtwork(targetId)) continue;
      if (trail.has(targetId)) { fail("EVIDENCE_DEPENDENCY_CYCLE", reference.path, "Nested component cycle."); continue; }
      const placement = nestedPlacement(current.record, reference, nativeVariantId, current.tree);
      if (!placement) { fail("EVIDENCE_NESTED_GEOMETRY_UNVERIFIED", reference.path, "Exact owned placement size/provenance and both identity mappings are required."); continue; }
      const actual = actualNode(placement, context, actualVariantId);
      if (!actual || actual.node.node_type !== "INSTANCE") { fail("EVIDENCE_NESTED_ANCESTRY_UNVERIFIED", reference.path, "Actual placement must retain its complete compound identity and ancestry."); continue; }
      const target = byId.get(targetId), viewportFacts = (reference.element.facts ?? []).filter(fact => fact.id === "instance-viewport");
      const targetViewport = viewportFacts.length ? viewportFacts.length === 1 && viewportFacts[0].value?.type === "keyword" ? viewportFacts[0].value.value : null : viewport;
      const variants = target.variants.filter(variant => variant.axes?.some(axis => axis.name === "Viewport" && axis.value.toLowerCase() === targetViewport));
      if (!["mobile", "desktop"].includes(targetViewport) || variants.length !== 1 ||
          placement.main_component_id !== variants[0].node_id || actual.node.main_component_id !== variants[0].node_id || current.record.figma.file_key !== target.figma.file_key) {
        fail("EVIDENCE_NESTED_PLACEMENT_UNVERIFIED", reference.path, "Current placement main, viewport and exact canonical child variant must agree."); continue;
      }
      const targetVariant = variants[0].node_id, child = scopeFor(targetId);
      if (!child || !child.identityValid || !child.variants.has(targetVariant)) continue;
      const nextContext = { nativeRoot: targetVariant, actualRoot: actual.node.node_id };
      const childBoundaries = (child.boundaries ?? []).filter(boundary => boundary.variant_node_id === targetVariant);
      for (const boundary of childBoundaries) {
        const entry = actualNode(boundary.node, nextContext, actualVariantId);
        const expectedType = boundary.node.node_id === targetVariant ? "INSTANCE" : boundary.node.node_type;
        if (!entry || entry.node.node_type !== expectedType) { fail("EVIDENCE_NESTED_ANCESTRY_UNVERIFIED", reference.path, "Exact child-owned artwork boundary is missing from the current consumer."); continue; }
        boundaries.push({ owner_component_id: targetId, ...(boundary.asset_id === undefined ? {} : { asset_id: boundary.asset_id }),
          source_variant_node_id: targetVariant, source_node_id: boundary.node.node_id,
          consumer_variant_node_id: actualVariantId, consumer_instance_node_id: actual.node.node_id, consumer_node_id: entry.node.node_id, contract_path: reference.path });
        for (const obligation of child.obligations.filter(value => value.source.variant_node_id === targetVariant && value.asset_owner.node_id === boundary.node.node_id)) {
          const native = child.nodes.get(obligation.source.node_id)?.node, sourceEntry = native && actualNode(native, nextContext, actualVariantId);
          const links = (target.evidence_links?.source_dependencies ?? []).filter(link => link.source.variant_node_id === targetVariant && link.source.node_id === obligation.source.node_id);
          const link = links.length === 1 ? links[0] : null;
          const item = { owner_component_id: targetId, link_id: link?.id ?? null,
            source: { variant_node_id: actualVariantId, node_id: projectedNodeId(obligation.source.node_id, targetVariant, actual.node.node_id), field_path: "/main_component_id" },
            asset_owner: { component_id: targetId, node_id: entry.node.node_id, ...(boundary.asset_id === undefined ? {} : { asset_id: boundary.asset_id }) },
            target: link ? { ...link.target } : {}, status: "unverified", reason: "EVIDENCE_REQUIRED_LINK_MISSING" };
          if (!sourceEntry || sourceEntry.node.node_type !== "INSTANCE" || !sourceEntry.ancestors.some(ancestor => ancestor.node_id === entry.node.node_id) && sourceEntry.node.node_id !== entry.node.node_id) item.reason = "EVIDENCE_NESTED_ANCESTRY_UNVERIFIED";
          else if (!link) {
            if (!model.records.some(record => record.figma.node_id === sourceEntry.node.main_component_id || record.variants.some(variant => variant.node_id === sourceEntry.node.main_component_id))) item.reason = "EVIDENCE_NESTED_TARGET_UNKNOWN";
          } else if (link.asset_owner.node_id !== obligation.asset_owner.node_id || link.asset_owner.asset_id !== obligation.asset_owner.asset_id) item.reason = "EVIDENCE_ASSET_OWNER_MISMATCH";
          else if (!byId.has(link.target.component_id)) item.reason = "EVIDENCE_NESTED_TARGET_UNKNOWN";
          else {
            const canonical = resolved.targets.get(`${targetId}/${link.id}`), shared = isSharedArtworkReference(byId.get(link.target.component_id)), graphic = shared ? null : treeFor(link.target.component_id);
            if (canonical) { item.target = { ...canonical.target }; item.expected = canonical.target.node_id; }
            if (!canonical || resolved.issues.length) item.reason = "EVIDENCE_INPUT_UNVERIFIED";
            else if (shared) {
              item.source.field_path = "/node_id"; item.expected = item.source.node_id;
              try {
                verifyRegisteredArtworkInstance({record: target, link, node: sourceEntry.node, records: model.records, expected_node_id: item.source.node_id});
                item.actual = sourceEntry.node.node_id; item.status = "verified"; item.reason = "EVIDENCE_ACTUAL_ARTWORK_NODE_MATCH";
              } catch { item.reason = "EVIDENCE_ACTUAL_ARTWORK_NODE_UNVERIFIED"; }
            }
            else if (!graphic?.tree.identityValid || !graphic.tree.variants.has(canonical.target.node_id)) item.reason = "EVIDENCE_TARGET_IDENTITY_UNVERIFIED";
            else {
              item.actual = sourceEntry.node.main_component_id;
              item.status = item.actual === item.expected ? "verified" : "mismatch";
              item.reason = item.status === "verified" ? "EVIDENCE_MAIN_COMPONENT_MATCH" : "EVIDENCE_NESTED_PLACEMENT_UNVERIFIED";
            }
          }
          dependencies.push(item);
          if (item.status !== "verified") fail(item.reason, reference.path, "Actual nested artwork dependency remains unverified.", { component_id: targetId, source: item.source });
        }
      }
      visit(targetId, targetVariant, targetViewport, nextContext, actualVariantId, new Set([...trail, targetId]));
    }
  }
  for (const variant of owner.variants) {
    const viewport = variant.axes?.find(axis => axis.name === "Viewport")?.value.toLowerCase();
    if (!["mobile", "desktop"].includes(viewport)) { fail("EVIDENCE_SCOPE_AMBIGUOUS", "/variants", "Nested HTML proof requires one exact viewport variant."); continue; }
    visit(recordId, variant.node_id, viewport, null, variant.node_id, new Set([recordId]));
  }
  report.receipt_ids = [...receipts].sort(order);
  classifyEvidenceCaptureDiagnostics(report, { recordId, model, session }, boundaries);
  orderedIssues(issues);
  report.ok = issues.length === 0 && dependencies.every(item => item.status === "verified");
  return report;
}

// Orchestration only: neither link proof nor successful identity verification
// waives a scalar fact. Keep the old report intact for comparison and handoff.
export function auditFigmaComponentEvidence({ record, live, model, session, derivedEvidence = [] } = {}) {
  const facts = auditFigmaContractFacts({ record, live, derivedEvidence });
  let evidence = { ok: false, component_id: record?.id ?? null, canonical_git_sha: null,
    session_started_at: null, receipt_ids: [], results: [], issues: [], required_sources: [], verified_sources: [] };
  let nested = { ok: true, component_id: record?.id ?? null, canonical_git_sha: model?.canonical_sha ?? null, session_started_at: session?.started_at ?? null, receipt_ids: [], boundaries: [], dependencies: [], issues: [] };
  const requiredProofs = (record?.evidence_links?.fact_proofs?.length ?? 0) > 0 || (record?.evidence_links?.normative_decisions?.length ?? 0) > 0;
  let factProofs = {ok: !requiredProofs, results: [], verified_contract_paths: [], verified_sources: [], issues: requiredProofs ? [issue("CONTRACT_PROOF_INPUT_UNVERIFIED", "/session", "Typed proofs require the same canonical record and actual live session packet.")] : []};
  const requiredNativeProofs = (record?.evidence_links?.native_fact_proofs?.length ?? 0) > 0;
  let nativeProofs = {ok: !requiredNativeProofs, results: [], verified_sources: [], issues: requiredNativeProofs ? [issue("NATIVE_PROOF_INPUT_UNVERIFIED", "/session", "Native reductions require the same canonical record and actual live session packet.")] : []};
  const requiredRelations = (record?.evidence_links?.native_relation_proofs?.length ?? 0) > 0;
  let relations = {ok: !requiredRelations, results: [], verified_sources: [], issues: requiredRelations ? [issue("NATIVE_RELATION_INPUT_UNVERIFIED", "/session", "Relations require the exact canonical record and actual live session packet.")] : []};
  const requiredVariables = (record?.evidence_links?.native_variable_proofs?.length ?? 0) > 0;
  let variableProofs = {ok: !requiredVariables, results: [], verified_sources: [], issues: requiredVariables ? [issue("NATIVE_VARIABLE_INPUT_UNVERIFIED", "/session", "Bindings require actual definitions, consumer resolution and an exact live session packet.")] : []};
  const requiredContexts = (record?.evidence_links?.native_context_proofs?.length ?? 0) > 0;
  let contexts = {ok: !requiredContexts, results: [], verified_sources: [], issues: requiredContexts ? [issue("NATIVE_CONTEXT_INPUT_UNVERIFIED", "/session", "Context requires an exact canonical element, native structure and live session packet.")] : []};
  const finish = () => {
    const base = applyNativeContextCoverage({facts, coverage: contexts, nativeVariableProofs: variableProofs, nativeRelationProofs: relations, nativeFactProofs: nativeProofs, contractProofs: factProofs});
    // Internal, freshly computed owner proofs qualify only an exact diagnostic.
    // The genuine raw facts/packet remain unchanged; no caller mask is accepted.
    const notRequired = [...(evidence.capture_diagnostics ?? []), ...(nested.capture_diagnostics ?? [])].filter(value =>
      value.component_id === record.id && value.status === "not-required" && value.reason === "EVIDENCE_SHARED_ORIGIN_NOT_REQUIRED");
    const unnecessary = raw => notRequired.some(value => isDeepStrictEqual(value.raw, raw));
    let effective = base;
    if (notRequired.length) {
      const issues = base.issues.flatMap(value => {
        if (value.code !== "FIGMA_CAPTURE_UNSUPPORTED" || !Array.isArray(value.details)) return [value];
        const details = value.details.filter(raw => !unnecessary(raw));
        return details.length === value.details.length ? [value] : details.length ? [{...value, details}] : [];
      });
      const capture_diagnostics = (base.capture_diagnostics ?? []).map(value => unnecessary(value.raw)
        ? {...value, status: "not-required", reason: "EVIDENCE_SHARED_ORIGIN_NOT_REQUIRED"} : value);
      effective = {...base, ok: issues.length === 0, issues, capture_diagnostics};
    }
    return {ok: effective.ok && evidence.ok && nested.ok && factProofs.ok && nativeProofs.ok && relations.ok && variableProofs.ok && contexts.ok, facts, effective_facts: effective, fact_proofs: factProofs, native_fact_proofs: nativeProofs, native_relation_proofs: relations, native_variable_proofs: variableProofs, native_context_proofs: contexts, evidence_links: evidence, nested_artwork: nested,
      issues: [...effective.issues, ...evidence.issues, ...nested.issues, ...factProofs.issues, ...nativeProofs.issues, ...relations.issues, ...variableProofs.issues, ...contexts.issues]};
  };
  if (!model || !session) {
    if (nestedReferences(record ?? {}).length) {
      nested.ok = false; nested.issues.push(issue("EVIDENCE_SESSION_REQUIRED", "/session", "Nested artwork needs canonical sources and a fresh complete MCP session."));
    }
    const scope = collectRequiredComponentEvidence({ record, live });
    evidence.required_sources = scope.required_sources;
    evidence.issues.push(...scope.issues);
    if (requiresEvidenceScope(record) || model || session) {
      evidence.issues.push(issue("EVIDENCE_SESSION_REQUIRED", "/session", "Evidence scope requires both a pinned canonical model and a validated fresh MCP session."));
    }
    evidence.ok = evidence.issues.length === 0;
    return finish();
  }

  evidence.canonical_git_sha = model.canonical_sha ?? null;
  evidence.session_started_at = session.started_at ?? null;
  const records = model.records?.filter(candidate => candidate.id === record?.id);
  if (records?.length !== 1 || !isDeepStrictEqual(records[0], record)) {
    evidence.issues.push(issue("EVIDENCE_CANONICAL_RECORD_MISMATCH", "/record", "The supplied record must equal the one canonical record in the loaded model."));
    return finish();
  }
  const capture = selectCapture(record.id, model, session, evidence.issues);
  if (!capture) return finish();
  if (!isDeepStrictEqual(capture.packet, live)) {
    evidence.issues.push(issue("EVIDENCE_LIVE_PACKET_MISMATCH", "/live", "The fact audit and link audit must use the same session packet."));
    return finish();
  }
  factProofs = auditContractFactProofs({record, model, session});
  nativeProofs = auditNativeFactProofs({record, model, session});
  relations = auditNativeRelationProofs({record, model, session});
  variableProofs = auditNativeVariableProofs({record, model, session});
  contexts = auditNativeContextProofs({record, model, session});
  if (!requiresEvidenceScope(record)) {
    evidence.receipt_ids = [capture.receipt_id];
    evidence.ok = true;
  } else evidence = auditComponentEvidenceLinks({ recordId: record.id, model, session });
  if (nestedReferences(record).length) nested = auditNestedArtworkEvidence({ recordId: record.id, model, session });
  return finish();
}
