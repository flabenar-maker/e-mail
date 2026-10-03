// Pure, offline metadata checks. Live identity, ancestry and completeness
// require a separate fresh capture; a valid reference is not that proof.
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ROOT_ID = /^[0-9]+:[0-9]+$/u;
const NODE_ID = /^(?:[0-9]+:[0-9]+|I[0-9]+:[0-9]+(?:;[0-9]+:[0-9]+)+)$/u;
const POINTER = /^(?:\/(?:[^~/*]|~[01])*)+$/u;
const TARGET_COMPARISONS = new Map([
  ["/shell/background_color", "opaque-solid-color"],
  ["/shell/max_width_px", "pixel-number"],
  ["/shell/horizontal_inset_px", "pixel-number"],
]);

function matches(pattern, value) {
  return typeof value === "string" && pattern.test(value);
}

function closedObject(value, required, optional = []) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    required.every(key => Object.hasOwn(value, key)) &&
    Object.keys(value).every(key => required.includes(key) || optional.includes(key));
}

// Native current-file IDs identify the lookup; publication key identifies its remote source.
export function matchesRemoteSourceIdentity(record, sourceNode) {
  const expected = record?.figma?.remote_source;
  if (expected === undefined) return true;
  const actual = sourceNode?.remote_source;
  return sourceNode?.node_type === "COMPONENT" &&
    closedObject(expected, ["component_key"]) && typeof expected.component_key === "string" && !!expected.component_key.trim() &&
    closedObject(actual, ["remote", "component_key"]) && actual.remote === true && actual.component_key === expected.component_key;
}

function issue(issues, code, path, message) {
  issues.push({code, path, message});
}

function sorted(issues) {
  return issues.sort((a, b) => a.path.localeCompare(b.path) || a.code.localeCompare(b.code) || a.message.localeCompare(b.message));
}

function linkShape(link, kind) {
  const foundation = kind === "foundation_values";
  return closedObject(link, foundation ? ["id", "source", "target", "comparison"] : ["id", "source", "target", "asset_owner"]) &&
    matches(ID, link.id) &&
    closedObject(link.source, foundation ? ["variant_node_id", "node_id", "field_path"] : ["variant_node_id", "node_id"]) &&
    matches(ROOT_ID, link.source.variant_node_id) && matches(NODE_ID, link.source.node_id) &&
    (foundation
      ? matches(POINTER, link.source.field_path) && closedObject(link.target, ["source_id", "pointer"]) &&
        typeof link.target.source_id === "string" && typeof link.target.pointer === "string" &&
        ["pixel-number", "opaque-solid-color"].includes(link.comparison)
      : closedObject(link.target, ["component_id"], ["variant_id"]) && matches(ID, link.target.component_id) &&
        (!Object.hasOwn(link.target, "variant_id") || matches(ID, link.target.variant_id)) &&
        closedObject(link.asset_owner, ["node_id"], ["asset_id"]) && matches(NODE_ID, link.asset_owner.node_id) &&
        (!Object.hasOwn(link.asset_owner, "asset_id") || matches(ID, link.asset_owner.asset_id)));
}

function entries(records, issues) {
  const result = [];
  records.forEach((record, index) => {
    if (!Object.hasOwn(record, "evidence_links")) return;
    const links = record.evidence_links;
    const path = `/records/${index}/evidence_links`;
    if (!closedObject(links, ["foundation_values", "source_dependencies"], ["fact_proofs", "normative_decisions"]) ||
        !Array.isArray(links.foundation_values) || !Array.isArray(links.source_dependencies)) {
      issue(issues, "EVIDENCE_LINK_SHAPE_INVALID", path, "Evidence links require exactly two arrays: foundation_values and source_dependencies.");
      return;
    }
    const ids = new Set();
    for (const kind of ["foundation_values", "source_dependencies"]) {
      links[kind].forEach((link, linkIndex) => {
        const linkPath = `${path}/${kind}/${linkIndex}`;
        if (!linkShape(link, kind)) {
          issue(issues, "EVIDENCE_LINK_SHAPE_INVALID", linkPath, "Evidence link contains missing, malformed or unsupported fields.");
          return;
        }
        if (ids.has(link.id)) issue(issues, "EVIDENCE_LINK_ID_DUPLICATE", `${linkPath}/id`, `Duplicate evidence link ID: ${link.id}.`);
        ids.add(link.id);
        result.push({record, kind, link, path: linkPath});
      });
    }
  });
  return result;
}

function ownsVariant(record, nodeId) {
  if (record.identity.node_kind === "component" && record.variants.length === 0) return record.figma.node_id === nodeId;
  return record.identity.node_kind === "component-set" && record.variants.filter(variant => variant.node_id === nodeId).length === 1;
}

function targetNode(record, target) {
  if (record.identity.node_kind === "component" && record.variants.length === 0) {
    return Object.hasOwn(target, "variant_id") ? null : record.figma.node_id;
  }
  if (record.identity.node_kind !== "component-set" || !Object.hasOwn(target, "variant_id")) return null;
  const variants = record.variants.filter(variant => variant.id === target.variant_id);
  return variants.length === 1 ? variants[0].node_id : null;
}

function validateCycles(graph, issues) {
  const state = new Map();
  const stack = [];
  function visit(id) {
    state.set(id, 1); stack.push(id);
    for (const {target, path} of [...(graph.get(id) ?? [])].sort((a, b) => a.target.localeCompare(b.target) || a.path.localeCompare(b.path))) {
      if (state.get(target) === 1) {
        const chain = [...stack.slice(stack.indexOf(target)), target];
        issue(issues, "EVIDENCE_DEPENDENCY_CYCLE", path, `Evidence dependency cycle: ${chain.join(" -> ")}.`);
      } else if (!state.has(target)) visit(target);
    }
    stack.pop(); state.set(id, 2);
  }
  for (const id of [...graph.keys()].sort()) if (!state.has(id)) visit(id);
}

export function validateEvidenceLinkReferences({records}) {
  const issues = [];
  const links = entries(records, issues);
  const byId = new Map();
  records.forEach((record, index) => {
    if (byId.has(record.id)) issue(issues, "EVIDENCE_RECORD_ID_DUPLICATE", `/records/${index}/id`, `Ambiguous component ID: ${record.id}.`);
    else byId.set(record.id, record);
  });
  const assertions = new Set();
  const graph = new Map();
  for (const {record, kind, link, path} of links) {
    const source = link.source;
    if (!ownsVariant(record, source.variant_node_id)) {
      issue(issues, "EVIDENCE_SOURCE_VARIANT_INVALID", `${path}/source/variant_node_id`, "Source variant must belong to this component, or be its standalone root.");
    }
    const assertion = JSON.stringify([record.id, source.variant_node_id, source.node_id, kind === "foundation_values" ? source.field_path : "main_component_id"]);
    if (assertions.has(assertion)) issue(issues, "EVIDENCE_SOURCE_DUPLICATE", `${path}/source`, "One source assertion cannot have duplicate or conflicting evidence links.");
    assertions.add(assertion);
    if (kind === "foundation_values") {
      const comparison = TARGET_COMPARISONS.get(link.target.pointer);
      if (link.target.source_id !== "rendering-foundation" || !comparison) {
        issue(issues, "EVIDENCE_TARGET_DOMAIN_INVALID", `${path}/target`, "Only the registered rendering shell background, maximum width and horizontal inset are supported.");
      } else if (link.comparison !== comparison) {
        issue(issues, "EVIDENCE_COMPARISON_INVALID", `${path}/comparison`, `Target requires ${comparison}.`);
      }
      continue;
    }
    const assetId = link.asset_owner.asset_id;
    if (assetId !== undefined && record.asset_contracts.filter(asset => asset.id === assetId).length !== 1) {
      issue(issues, "EVIDENCE_ASSET_UNKNOWN", `${path}/asset_owner/asset_id`, `Asset ${assetId} must belong unambiguously to the consumer.`);
    }
    const target = byId.get(link.target.component_id);
    if (!target) {
      issue(issues, "EVIDENCE_TARGET_COMPONENT_UNKNOWN", `${path}/target/component_id`, `Unknown component: ${link.target.component_id}.`);
      continue;
    }
    if (!targetNode(target, link.target)) {
      issue(issues, "EVIDENCE_TARGET_VARIANT_INVALID", `${path}/target`, "A component set requires an exact registered variant; a standalone component forbids variant_id.");
    }
    if (record.figma.file_key !== target.figma.file_key) {
      issue(issues, "EVIDENCE_TARGET_FILE_MISMATCH", `${path}/target`, "Source and target must belong to the same Figma file.");
    }
    if (!graph.has(record.id)) graph.set(record.id, []);
    graph.get(record.id).push({target: target.id, path: `${path}/target/component_id`});
  }
  validateCycles(graph, issues);
  return sorted(issues);
}

function pointerValue(document, pointer) {
  let value = document;
  for (const token of pointer.slice(1).split("/")) {
    const key = token.replaceAll("~1", "/").replaceAll("~0", "~");
    if (value === null || typeof value !== "object" || !Object.hasOwn(value, key)) return {found: false};
    value = value[key];
  }
  return {found: true, value};
}

// sourceDocuments is supplied by the manifest-resolved canonical model loader.
// This pure function never reads a path, accepts a value in a link, or asserts
// that an arbitrary caller's in-memory document came from a verified Git SHA.
export function resolveEvidenceTargets({records, manifest, sourceDocuments}) {
  const issues = validateEvidenceLinkReferences({records});
  const targets = new Map();
  if (issues.length) return {targets, issues};
  const byId = new Map(records.map(record => [record.id, record]));
  const links = entries(records, []).sort((a, b) => a.record.id.localeCompare(b.record.id) || a.link.id.localeCompare(b.link.id));
  for (const {record, kind, link, path} of links) {
    const common = {component_id: record.id, link_id: link.id, source: {file_key: record.figma.file_key, ...link.source}};
    const key = `${record.id}/${link.id}`;
    if (kind === "source_dependencies") {
      const targetRecord = byId.get(link.target.component_id);
      targets.set(key, {kind: "source-dependency", ...common,
        target: {...link.target, file_key: targetRecord.figma.file_key, node_id: targetNode(targetRecord, link.target)},
        asset_owner: {...link.asset_owner}});
      continue;
    }
    const id = link.target.source_id;
    const registered = (manifest?.sources ?? []).filter(source => source.id === id);
    if (registered.length !== 1 || registered[0].kind !== "registry" || typeof registered[0].path !== "string" || !registered[0].path) {
      issue(issues, "EVIDENCE_SOURCE_UNREGISTERED", `${path}/target/source_id`, `A unique canonical registry source must be registered for ${id}.`);
      continue;
    }
    if (!(sourceDocuments instanceof Map) || !sourceDocuments.has(id)) {
      issue(issues, "EVIDENCE_SOURCE_DOCUMENT_MISSING", `${path}/target/source_id`, `Canonical source document was not loaded: ${id}.`);
      continue;
    }
    const resolved = pointerValue(sourceDocuments.get(id), link.target.pointer);
    if (!resolved.found) {
      issue(issues, "EVIDENCE_TARGET_POINTER_MISSING", `${path}/target/pointer`, `Canonical source has no ${link.target.pointer}.`);
      continue;
    }
    const validValue = link.comparison === "pixel-number"
      ? typeof resolved.value === "number" && Number.isFinite(resolved.value)
      : matches(/^#[0-9a-fA-F]{6}$/u, resolved.value);
    if (!validValue) {
      issue(issues, "EVIDENCE_TARGET_VALUE_INVALID", `${path}/target/pointer`, "Target must be a finite pixel number or exact opaque six-digit HEX, according to its comparison.");
      continue;
    }
    targets.set(key, {kind: "foundation-value", ...common, target: {...link.target}, comparison: link.comparison, expected: resolved.value});
  }
  return {targets, issues: sorted(issues)};
}

// Read-only projection. Default transitive paths are review candidates, never
// evidence that an overridden glyph is used by a particular instance.
export function collectEvidenceConsumers({ model, session, sourceComponentId, reports = [] } = {}) {
  const issues = [], confirmed = new Map(), possible = new Map();
  const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  const resultKey = edge => JSON.stringify([edge.component_id, edge.asset_owner_node_id, edge.asset_id ?? null]);
  const stepKey = step => `${step.component_id}/${step.link_id}`;
  if (!model?.records || model.records.filter(record => record.id === sourceComponentId).length !== 1) {
    return { confirmed: [], possible: [], issues: [{ code: "EVIDENCE_TARGET_COMPONENT_UNKNOWN", path: "/sourceComponentId", message: "One canonical source component is required." }] };
  }
  const resolved = resolveEvidenceTargets({ records: model.records, manifest: model.manifest, sourceDocuments: model.source_documents });
  issues.push(...resolved.issues);
  if (issues.length) return { confirmed: [], possible: [], issues: sorted(issues) };
  const edges = [...resolved.targets.values()].filter(target => target.kind === "source-dependency");
  const byId = new Map(model.records.map(record => [record.id, record]));
  const captures = new Map();
  for (const capture of session?.captures ?? []) {
    if (!captures.has(capture.component_id)) captures.set(capture.component_id, []);
    captures.get(capture.component_id).push(capture);
  }
  const oneCapture = id => captures.get(id)?.length === 1 ? captures.get(id)[0] : null;
  function add(map, edge, via) {
    const item = { component_id: edge.component_id, asset_owner_node_id: edge.asset_owner.node_id,
      ...(edge.asset_owner.asset_id === undefined ? {} : { asset_id: edge.asset_owner.asset_id }), via: [] };
    const key = resultKey(item), current = map.get(key) ?? item;
    const steps = new Map([...current.via, ...via].map(step => [stepKey(step), step]));
    current.via = [...steps.values()].sort((a, b) => compare(stepKey(a), stepKey(b))); map.set(key, current);
  }
  const allReceipts = new Set((session?.captures ?? []).map(capture => capture.receipt_id));
  const seenReports = new Set();
  function mismatch(path, message) { issue(issues, "EVIDENCE_REPORT_CONTEXT_MISMATCH", path, message); }
  function nodeFrom(capture, variantId, nodeId) {
    const variants = capture?.packet?.variants?.filter(variant => variant.variant_node_id === variantId);
    if (variants?.length !== 1) return null;
    const queue = [variants[0].source_node], nodes = [], visited = new Set();
    while (queue.length) {
      const node = queue.pop(); if (!node || visited.has(node)) return null;
      visited.add(node); if (node.node_id === nodeId) nodes.push(node); queue.push(...(node.children ?? []));
    }
    return nodes.length === 1 ? nodes[0] : null;
  }
  for (const report of reports) {
    const path = `/reports/${report.component_id}`, owner = byId.get(report.component_id), capture = oneCapture(report.component_id);
    if (seenReports.has(report.component_id) || !owner || !capture || session?.canonical_git_sha !== model.canonical_sha ||
        report.canonical_git_sha !== model.canonical_sha || report.session_started_at !== session.started_at ||
        !Array.isArray(report.receipt_ids) || report.receipt_ids.length === 0 ||
        report.receipt_ids.some(id => !allReceipts.has(id)) || !report.receipt_ids.includes(capture.receipt_id) ||
        !session.component_ids?.includes(report.component_id) || !Array.isArray(report.results) || !Array.isArray(report.verified_sources)) {
      mismatch(path, "Report must match the canonical SHA, selected owner, current session and its actual receipts."); continue;
    }
    seenReports.add(report.component_id);
    for (const item of report.results.filter(item => item.kind === "source-dependency" && item.status === "verified")) {
      const edge = resolved.targets.get(`${report.component_id}/${item.link_id}`), targetCapture = edge && oneCapture(edge.target.component_id);
      const sameSource = edge && ["file_key", "variant_node_id", "node_id"].every(key => item.source?.[key] === edge.source[key]);
      const sameTarget = edge && ["component_id", "variant_id", "file_key", "node_id"].every(key => item.target?.[key] === edge.target[key]);
      const covered = edge && report.verified_sources.some(source => source.variant_node_id === edge.source.variant_node_id && source.node_id === edge.source.node_id && source.field_path === "/main_component_id");
      const actualNode = edge && nodeFrom(capture, edge.source.variant_node_id, edge.source.node_id);
      const targetNode = edge && nodeFrom(targetCapture, edge.target.node_id, edge.target.node_id);
      if (!edge || edge.kind !== "source-dependency" || !sameSource || !sameTarget || !covered || !targetCapture ||
          !report.receipt_ids.includes(targetCapture.receipt_id) || !session.component_ids.includes(edge.target.component_id) ||
          item.asset_owner?.node_id !== edge.asset_owner.node_id || item.asset_owner?.asset_id !== edge.asset_owner.asset_id ||
          item.expected !== edge.target.node_id || item.actual !== edge.target.node_id || actualNode?.node_type !== "INSTANCE" || actualNode.main_component_id !== edge.target.node_id ||
          targetNode?.node_type !== "COMPONENT" || !matchesRemoteSourceIdentity(byId.get(edge.target.component_id), targetNode) || capture.packet.file_key !== owner.figma.file_key || capture.packet.component_node_id !== owner.figma.node_id ||
          targetCapture.packet.file_key !== edge.target.file_key || targetCapture.packet.component_node_id !== byId.get(edge.target.component_id).figma.node_id) {
        mismatch(`${path}/${item.link_id}`, "Verified assertion must retain its exact canonical source/target/owner and current source/target packet receipts."); continue;
      }
      if (edge.target.component_id === sourceComponentId) add(confirmed, edge, [{ component_id: edge.component_id, link_id: edge.link_id }]);
    }
  }
  function reverse(id, via, visited) {
    for (const edge of edges.filter(edge => edge.target.component_id === id)) {
      if (visited.has(edge.component_id)) continue;
      const next = [...via, { component_id: edge.component_id, link_id: edge.link_id }];
      add(possible, edge, next);
      reverse(edge.component_id, next, new Set([...visited, edge.component_id]));
    }
  }
  reverse(sourceComponentId, [], new Set([sourceComponentId]));
  for (const key of confirmed.keys()) possible.delete(key);
  const output = map => [...map.values()].sort((a, b) => compare(resultKey(a), resultKey(b)));
  return { confirmed: output(confirmed), possible: output(possible), issues: sorted(issues) };
}
