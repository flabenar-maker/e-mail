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
  return value?.value;
}

function equal(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
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

function bindingPath(instance, path, entry) {
  const kind = entry.kind === "property" ? "property_values" : "content_values";
  const index = (instance[kind] ?? []).findIndex((item) => item === bindingFor(instance, entry, entry.viewport));
  return `${path}/${kind}${index < 0 ? "" : `/${index}`}`;
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
  model, readings, correspondence, authorizedInputs = [], assetEvidence = [],
} = {}) {
  const errors = [];
  if (!readings || !correspondence || !model?.root) {
    return [issue("EMAIL_SOURCE_EVIDENCE_MISSING", "/source", "Model, source readings, and correspondence are required.")];
  }
  if (readings.complete !== true || !Array.isArray(readings.instances) || !Array.isArray(readings.fields) || !Array.isArray(readings.assets)) {
    errors.push(issue("EMAIL_SOURCE_EVIDENCE_INCOMPLETE", "/source", "The selected MCP reading is incomplete or truncated."));
  }
  if (!readings.capture_id || readings.capture_id !== correspondence.capture_id) {
    errors.push(issue("EMAIL_SOURCE_EVIDENCE_STALE", "/correspondence/capture_id", "Correspondence does not belong to this MCP capture."));
  }
  if (errors.length) return errors;

  const entries = instancesWithPaths(model.root);
  const byId = new Map(entries.map((entry) => [entry.instance.instance_id, entry]));
  const sourceInstances = new Map(readings.instances.map((item) => [key(item.viewport, item.node_id), item]));
  const sourceFields = new Map(readings.fields.map((item) => [key(item.viewport, item.node_id, item.field), item]));
  const sourceAssets = new Map(readings.assets.map((item) => [key(item.viewport, item.node_id), item]));
  const mappedInstances = new Map((correspondence.instances ?? []).map((item) => [item.instance_id, item]));
  const mappedFields = new Map((correspondence.fields ?? []).map((item) => [key(
    item.instance_id, item.kind, item.element_id ?? item.property_id, item.slot_id ?? "", item.viewport,
  ), item]));
  const mappedAssets = new Map((correspondence.assets ?? []).map((item) => [key(item.instance_id, item.asset_contract_id), item]));
  const inputs = new Map(authorizedInputs.map((item) => [key(
    item.instance_id, item.kind, item.element_id ?? item.property_id, item.slot_id ?? "", item.viewport,
  ), item]));
  const receipts = new Map(assetEvidence.map((item) => [key(item.instance_id, item.asset_contract_id, item.path), item]));
  const claimedSourceInstances = new Set();

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
      const expectedParent = parent ? mappedInstances.get(parent.instance_id)?.nodes?.[viewport] : null;
      if (observed.parent_node_id !== expectedParent) {
        errors.push(issue("EMAIL_SOURCE_PARENT_MISMATCH", path, `${instance.instance_id}: ${viewport} parent differs from MCP reading.`));
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
          if (target.origin === "figma" && observed.inline_runs?.length) {
            errors.push(issue("EMAIL_SOURCE_INLINE_UNSUPPORTED", itemPath, `${instance.instance_id}/${itemId}: ${viewport} inline styling requires an explicit supported mapping.`));
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
      const receipt = receipts.get(key(instance.instance_id, asset.asset_contract_id, asset.path));
      if (!receipt) {
        errors.push(issue("EMAIL_SOURCE_ASSET_MISSING", assetPath, `${instance.instance_id}/${asset.asset_contract_id}: export receipt is missing.`));
        continue;
      }
      const source = sourceAssets.get(key(target.viewport, target.node_id));
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
  for (const source of readings.instances) {
    if (!claimedSourceInstances.has(key(source.viewport, source.node_id))) {
      errors.push(issue("EMAIL_SOURCE_STRUCTURE_UNREPRESENTED", "/source/instances", `${source.viewport} source instance ${source.node_id} has no model correspondence.`));
    }
  }
  return errors.sort((left, right) => left.path.localeCompare(right.path) || left.code.localeCompare(right.code));
}
