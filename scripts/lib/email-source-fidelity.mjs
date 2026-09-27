import { SystemValidationError } from "./diagnostics.mjs";

const VIEWPORTS = ["mobile", "desktop"];

function issue(code, path, message) {
  return new SystemValidationError(code, path, message);
}

function key(...parts) {
  return parts.join("\0");
}

function normalizedValue(value) {
  if (value?.type === "rich-text") {
    return value.segments.map(({ value: text }) => text).join("");
  }
  if (value?.type === "alt-text") {
    return { purpose: value.purpose, value: value.value };
  }
  return value?.value;
}

function equal(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function findElement(root, id) {
  if (!root) return null;
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findElement(child, id);
    if (found) return found;
  }
  return null;
}

function instancesWithPaths(root) {
  const entries = [];
  function visit(instance, path, parent = null, relation = null) {
    entries.push({ instance, path, parent, relation });
    for (const [slotIndex, slot] of (instance.slots ?? []).entries()) {
      for (const [order, child] of slot.instances.entries()) {
        visit(child, `${path}/slots/${slotIndex}/instances/${order}`, instance, {
          kind: "slot", element_id: slot.element_id, order,
        });
      }
    }
    for (const [order, nested] of (instance.nested_components ?? []).entries()) {
      visit(nested.instance, `${path}/nested_components/${order}/instance`, instance, {
        kind: "nested", element_id: nested.element_id, order,
      });
    }
  }
  if (root) visit(root, "/root");
  return entries;
}

function bindingFor(instance, entry, viewport) {
  const items = entry.kind === "property" ? instance.property_values : instance.content_values;
  const matches = (items ?? []).filter((item) =>
    (entry.kind === "property"
      ? item.property_id === entry.property_id
      : item.element_id === entry.element_id && item.slot_id === entry.slot_id) &&
    (item.scope === viewport || item.scope === "all"));
  return matches.find((item) => item.scope === viewport) ??
    matches.find((item) => item.scope === "all") ?? null;
}

function uniqueIndex(items, keyOf, label, errors) {
  const result = new Map();
  for (const item of items) {
    const id = keyOf(item);
    if (result.has(id)) {
      errors.push(issue("EMAIL_SOURCE_DUPLICATE", `/source/${label}`, `Duplicate ${label} key: ${id.replaceAll("\\0", "/")}.`));
    }
    result.set(id, item);
  }
  return result;
}

function excluded(readings, kind, source) {
  return (readings.exclusions ?? []).some((item) =>
    item.kind === kind && item.viewport === source.viewport && item.node_id === source.node_id &&
    (kind !== "field" || item.field === source.field) && typeof item.reason === "string" && item.reason.trim().length > 0);
}

/**
 * Compare a model with independently captured, selected Figma observations.
 * `readings` contains normalized raw MCP observations, not values copied from
 * the model. `correspondence` connects model IDs to those observed node/field
 * IDs and carries the exact capture ID. This gate cannot prove that the MCP
 * capture itself was complete or correctly normalized; the caller must re-read
 * disputed nodes and run the separate visual gate.
 */
export function verifyEmailModelSource({
  model, readings, correspondence, authorizedInputs = [], assetEvidence = [], resolvedContracts = new Map(),
} = {}) {
  const errors = [];
  if (!readings || !correspondence || !model?.root) {
    return [issue("EMAIL_SOURCE_EVIDENCE_MISSING", "/source", "Model, source readings, and correspondence are required.")];
  }
  if (readings.complete !== true || !Array.isArray(readings.instances) || !Array.isArray(readings.fields) || !Array.isArray(readings.assets) ||
      !readings.file_key || !readings.captured_at ||
      VIEWPORTS.some((viewport) => !readings.selection?.[viewport]?.root_node_id ||
        readings.selection[viewport].terminal !== true || readings.selection[viewport].truncated !== false)) {
    errors.push(issue("EMAIL_SOURCE_EVIDENCE_INCOMPLETE", "/source", "The selected MCP reading is incomplete or truncated."));
  }
  if (!readings.capture_id || readings.capture_id !== correspondence.capture_id || readings.file_key !== correspondence.file_key) {
    errors.push(issue("EMAIL_SOURCE_EVIDENCE_STALE", "/correspondence/capture_id", "Correspondence does not belong to this MCP capture."));
  }
  if (errors.length) return errors;

  const entries = instancesWithPaths(model.root);
  const byId = uniqueIndex(entries, (entry) => entry.instance.instance_id, "model-instances", errors);
  const sourceInstances = uniqueIndex(readings.instances, (item) => key(item.viewport, item.node_id), "instances", errors);
  const sourceFields = uniqueIndex(readings.fields, (item) => key(item.viewport, item.node_id, item.field), "fields", errors);
  const sourceAssets = uniqueIndex(readings.assets, (item) => key(item.viewport, item.node_id), "assets", errors);
  const mappedInstances = uniqueIndex(correspondence.instances ?? [], (item) => item.instance_id, "correspondence/instances", errors);
  const mappedFields = uniqueIndex(correspondence.fields ?? [], (item) => key(
    item.instance_id, item.kind, item.element_id ?? item.property_id, item.slot_id ?? "", item.viewport,
  ), "correspondence/fields", errors);
  const mappedAssets = uniqueIndex(correspondence.assets ?? [], (item) => key(item.instance_id, item.asset_contract_id), "correspondence/assets", errors);
  const inputs = uniqueIndex(authorizedInputs, (item) => key(
    item.instance_id, item.kind, item.element_id ?? item.property_id, item.slot_id ?? "", item.viewport,
  ), "authorized-inputs", errors);
  const receipts = uniqueIndex(assetEvidence, (item) => key(item.instance_id, item.asset_contract_id, item.path), "asset-receipts", errors);
  for (const [index, input] of authorizedInputs.entries()) {
    if (!["user", "policy-derived"].includes(input.origin)) continue;
    const reference = input.source_ref;
    if (!reference || typeof reference !== "object" || Array.isArray(reference) ||
        typeof reference.source_id !== "string" || !reference.source_id.trim() ||
        typeof reference.field_path !== "string" || !reference.field_path.trim() ||
        (input.origin === "policy-derived" &&
          (typeof reference.version !== "string" || !reference.version.trim()))) {
      errors.push(issue("EMAIL_SOURCE_INPUT_PROVENANCE_MISSING",
        "/authorizedInputs/" + index + "/source_ref",
        "Authorized input requires an exact user-input or versioned policy reference."));
    }
  }
  const claimedSourceInstances = new Set();
  const claimedSourceFields = new Set();
  const claimedSourceAssets = new Set();

  for (const { instance, path, parent, relation } of entries) {
    const mapped = mappedInstances.get(instance.instance_id);
    for (const viewport of VIEWPORTS) {
      const nodeId = mapped?.nodes?.[viewport];
      const observed = sourceInstances.get(key(viewport, nodeId));
      if (!nodeId || !observed) {
        errors.push(issue("EMAIL_SOURCE_TARGET_MISSING", path, `${instance.instance_id}: no ${viewport} source instance.`));
        continue;
      }
      const claim = key(viewport, nodeId);
      if (claimedSourceInstances.has(claim)) {
        errors.push(issue("EMAIL_SOURCE_TARGET_COLLISION", path, `${viewport} source node ${nodeId} is mapped to multiple model instances.`));
      }
      claimedSourceInstances.add(claim);
      if (!parent && readings.selection[viewport].root_node_id !== nodeId) {
        errors.push(issue("EMAIL_SOURCE_SCOPE_MISMATCH", path, `${viewport} selected root differs from the mapped model root.`));
      }
      if (!observed.variant_id || observed.variant_id !== instance.variants?.[viewport]) {
        errors.push(issue("EMAIL_SOURCE_VARIANT_MISMATCH", path, `${instance.instance_id}: ${viewport} variant differs from the selected Figma instance.`));
      }
      const expectedParent = parent ? mappedInstances.get(parent.instance_id)?.nodes?.[viewport] : null;
      if (observed.parent_node_id !== expectedParent) {
        errors.push(issue("EMAIL_SOURCE_PARENT_MISMATCH", path, `${instance.instance_id}: ${viewport} parent differs from MCP reading.`));
      }
      if (!equal(relation && { kind: relation.kind, element_id: relation.element_id }, observed.relation)) {
        errors.push(issue("EMAIL_SOURCE_RELATION_MISMATCH", path, `${instance.instance_id}: ${viewport} slot/nested relation differs from MCP reading.`));
      }
      if (relation) {
        const siblings = entries.filter((other) =>
          other.parent === parent && other.relation?.kind === relation.kind &&
          other.relation?.element_id === relation.element_id);
        const previous = siblings.filter((other) => other.relation.order < relation.order).at(-1);
        const previousNode = mappedInstances.get(previous?.instance.instance_id)?.nodes?.[viewport];
        const previousObserved = sourceInstances.get(key(viewport, previousNode));
        if (previousObserved && !(previousObserved.order < observed.order)) {
          errors.push(issue("EMAIL_SOURCE_ORDER_MISMATCH", path, `${instance.instance_id}: ${viewport} order differs from MCP reading.`));
        }
      }
    }

    for (const [kind, items] of [["property", instance.property_values ?? []], ["content", instance.content_values ?? []]]) {
      const listName = kind === "property" ? "property_values" : "content_values";
      for (const [index, item] of items.entries()) {
        for (const viewport of item.scope === "all" ? VIEWPORTS : [item.scope]) {
          const itemId = kind === "property" ? item.property_id : item.element_id;
          const slotId = kind === "property" ? "" : item.slot_id;
          const target = mappedFields.get(key(instance.instance_id, kind, itemId, slotId, viewport));
          const itemPath = `${path}/${listName}/${index}`;
          if (!target) {
            errors.push(issue("EMAIL_SOURCE_TARGET_MISSING", itemPath, `${instance.instance_id}/${itemId}: no ${viewport} source field correspondence.`));
            continue;
          }
          const observed = target.origin === "figma"
            ? sourceFields.get(key(viewport, target.node_id, target.field))
            : inputs.get(key(instance.instance_id, kind, itemId, slotId, viewport));
          if (!observed || (target.origin !== "figma" && observed.origin !== target.origin)) {
            errors.push(issue("EMAIL_SOURCE_EVIDENCE_MISSING", itemPath, `${instance.instance_id}/${itemId}: ${viewport} ${target.origin} evidence is missing.`));
            continue;
          }
          if (target.origin === "figma") {
            claimedSourceFields.add(key(viewport, target.node_id, target.field));
            const ownerNode = mapped?.nodes?.[viewport];
            if (!ownerNode || observed.owner_node_id !== ownerNode) {
              errors.push(issue("EMAIL_SOURCE_OWNER_MISMATCH", itemPath, `${instance.instance_id}/${itemId}: ${viewport} field belongs to another source instance.`));
            }
          }
          if (target.origin === "figma") {
            const contractRoot = resolvedContracts.get(instance.component_id)?.contracts?.[viewport]?.root;
            const contractElement = findElement(contractRoot, itemId);
            const contractRuns = contractElement?.facts?.find(({ id }) => id === "styled-text-segments")?.value?.items;
            const sourceRuns = observed.inline_runs;
            const hasContractRuns = Array.isArray(contractRuns) && contractRuns.length > 0;
            const hasSourceRuns = Array.isArray(sourceRuns) && sourceRuns.length > 0;
            if (item.value?.type === "rich-text" || hasContractRuns || hasSourceRuns) {
              if (kind !== "content" || item.value?.type !== "rich-text" || slotId !== "text" ||
                  !hasContractRuns || !hasSourceRuns || !equal(contractRuns, sourceRuns)) {
                errors.push(issue("EMAIL_SOURCE_INLINE_UNSUPPORTED", itemPath, `${instance.instance_id}/${itemId}: ${viewport} inline styling differs from the resolved component contract or has no supported mapping.`));
              }
            }
          }
          const actual = kind === "property" ? item.value : normalizedValue(item.value);
          if (!equal(actual, observed.value)) {
            errors.push(issue("EMAIL_SOURCE_VALUE_MISMATCH", itemPath, `${instance.instance_id}/${itemId}: ${viewport} model value differs from ${target.origin} source.`));
          }
        }
      }
    }

    for (const [index, asset] of (instance.asset_files ?? []).entries()) {
      const target = mappedAssets.get(key(instance.instance_id, asset.asset_contract_id));
      const assetPath = `${path}/asset_files/${index}`;
      if (!target || !sourceAssets.has(key(target.viewport, target.node_id))) {
        errors.push(issue("EMAIL_SOURCE_TARGET_MISSING", assetPath, `${instance.instance_id}/${asset.asset_contract_id}: source owner is missing.`));
        continue;
      }
      claimedSourceAssets.add(key(target.viewport, target.node_id));
      const source = sourceAssets.get(key(target.viewport, target.node_id));
      if (source.owner_node_id !== mapped?.nodes?.[target.viewport]) {
        errors.push(issue("EMAIL_SOURCE_ASSET_OWNER_MISMATCH", assetPath, `${instance.instance_id}/${asset.asset_contract_id}: asset belongs to another source instance.`));
      }
      const receipt = receipts.get(key(instance.instance_id, asset.asset_contract_id, asset.path));
      if (!receipt) {
        errors.push(issue("EMAIL_SOURCE_ASSET_MISSING", assetPath, `${instance.instance_id}/${asset.asset_contract_id}: export receipt is missing.`));
        continue;
      }
      if (!source.evidence_id || !receipt.mcp_export?.evidence_id) {
        errors.push(issue("EMAIL_SOURCE_ASSET_EVIDENCE_MISSING", assetPath, `${instance.instance_id}/${asset.asset_contract_id}: export evidence ID is missing.`));
      }
      if (!receipt.mcp_export?.capture_id || receipt.mcp_export.capture_id !== readings.capture_id ||
          !receipt.mcp_export?.file_key || receipt.mcp_export.file_key !== readings.file_key) {
        errors.push(issue("EMAIL_SOURCE_EVIDENCE_STALE", assetPath, `${instance.instance_id}/${asset.asset_contract_id}: export receipt belongs to another source capture.`));
      }
      if (receipt.mcp_export?.source_node_id !== target.node_id || receipt.mcp_export?.evidence_id !== source.evidence_id) {
        errors.push(issue("EMAIL_SOURCE_ASSET_OWNER_MISMATCH", assetPath, `${instance.instance_id}/${asset.asset_contract_id}: receipt does not belong to the observed Figma owner.`));
      }
    }
  }

  for (const target of correspondence.fields ?? []) {
    const entry = byId.get(target.instance_id);
    if (!entry || !bindingFor(entry.instance, target, target.viewport)) {
      const listName = target.kind === "property" ? "property_values" : "content_values";
      errors.push(issue("EMAIL_SOURCE_CONTENT_MISSING", `${entry?.path ?? "/root"}/${listName}`, `${target.instance_id}: ${target.viewport} ${target.kind} binding is absent from the model.`));
    }
  }
  for (const target of correspondence.assets ?? []) {
    const entry = byId.get(target.instance_id);
    if (!entry?.instance.asset_files?.some(({ asset_contract_id }) => asset_contract_id === target.asset_contract_id)) {
      errors.push(issue("EMAIL_SOURCE_ASSET_MISSING", `${entry?.path ?? "/root"}/asset_files`, `${target.instance_id}/${target.asset_contract_id}: asset binding is absent from the model.`));
    }
  }
  for (const source of readings.fields) {
    if (!claimedSourceFields.has(key(source.viewport, source.node_id, source.field)) && !excluded(readings, "field", source)) {
      errors.push(issue("EMAIL_SOURCE_FIELD_UNREPRESENTED", "/source/fields", `${source.viewport} source field ${source.node_id}/${source.field} has no model correspondence or justified exclusion.`));
    }
  }
  for (const source of readings.assets) {
    if (!claimedSourceAssets.has(key(source.viewport, source.node_id)) && !excluded(readings, "asset", source)) {
      errors.push(issue("EMAIL_SOURCE_ASSET_UNREPRESENTED", "/source/assets", `${source.viewport} source asset ${source.node_id} has no model correspondence or justified exclusion.`));
    }
  }
  for (const source of readings.instances) {
    if (!claimedSourceInstances.has(key(source.viewport, source.node_id)) && !excluded(readings, "instance", source)) {
      errors.push(issue("EMAIL_SOURCE_STRUCTURE_UNREPRESENTED", "/source/instances", `${source.viewport} source instance ${source.node_id} has no model correspondence.`));
    }
  }
  return errors.sort((left, right) => left.path.localeCompare(right.path) || left.code.localeCompare(right.code));
}


