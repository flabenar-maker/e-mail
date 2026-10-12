import { selectVariantRoot } from './email-interpreter.mjs';
import { EMAIL_VIEWPORTS, hasInstanceVisibility, visibleContractElements } from './email-instance-visibility.mjs';

const key = (...parts) => parts.join('\0');
const issue = (code, path, message) => ({ code, path, message });
const relationId = (relation, viewport) => relation?.element_ids?.[viewport] ?? relation?.element_id;
const rootSources = new WeakMap();

function elementChain(root, id, chain = []) {
  if (!root) return null;
  const next = [...chain, root];
  if (root.id === id) return next;
  for (const child of root.children ?? []) {
    const found = elementChain(child, id, next);
    if (found) return found;
  }
  return null;
}

function expectedNode(element, root, owner) {
  if (element === root) return owner;
  const nodes = new Set((element.facts ?? []).filter(fact =>
    ['figma-literal', 'figma-binding'].includes(fact.provenance?.kind) && fact.provenance.node_id,
  ).map(fact => fact.provenance.node_id));
  if (nodes.size === 1) return owner + ';' + [...nodes][0];
  const source = rootSources.get(root);
  // The geometry-free Email/Template Content slot has no element facts. Its
  // exact source node is still registered in the foundation evidence link.
  if (nodes.size === 0 && source?.record.id === 'email-template' && element.id === 'content' && element.render_mode === 'slot') {
    const proof = source.record.evidence_links?.foundation_values?.find(link => link.id === source.viewport + '-slot-background');
    if (proof?.source?.variant_node_id === registeredVariantNode(source.record, source.viewport) && proof.source.node_id)
      return owner + ';' + proof.source.node_id;
  }
  return null;
}

function registeredVariantNode(record, viewport, axes = {}) {
  const entries = Object.entries(axes);
  const candidates = (record.variants ?? []).filter(variant =>
    (entries.length === 0 && variant.id === viewport) ||
    (variant.axes?.some(axis => axis.name === 'Viewport' && String(axis.value).toLowerCase() === viewport) &&
      variant.axes.filter(axis => axis.name !== 'Viewport').length === entries.length &&
      entries.every(([name, value]) => variant.axes.some(axis => axis.name === name && String(axis.value).toLowerCase() === String(value).toLowerCase()))),
  );
  return candidates.length === 1 ? candidates[0].node_id : null;
}

// Raw nodes belong to the same complete capture as the instance/field readings.
// Own visibility is observed; effective visibility is recomputed through actual
// parents. Free-text exclusion reasons cannot establish any hidden state.
export function verifyInstanceVisibilitySource({ model, readings, correspondence, resolvedContracts, entries, mappedInstances }) {
  const enabled = hasInstanceVisibility(model?.root);
  const diagnostics = [];
  const never = () => false;
  const failed = () => ({ enabled, diagnostics, isHidden: never, isHiddenTarget: never, modelVisible: new Map() });
  if (!enabled) return failed();
  if (!Array.isArray(readings.nodes) || !Array.isArray(correspondence.visibility)) {
    diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_EVIDENCE_MISSING', '/readings/nodes', 'Instance visibility requires independent complete node and element correspondence readings.'));
    return failed();
  }
  const nodes = new Map();
  for (const [index, node] of readings.nodes.entries()) {
    const path = '/readings/nodes/' + index;
    if (!node || !EMAIL_VIEWPORTS.includes(node.viewport) || typeof node.node_id !== 'string' || !node.node_id.trim() ||
        typeof node.visible !== 'boolean' || !(node.parent_node_id === null || typeof node.parent_node_id === 'string' && node.parent_node_id.trim())) {
      diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_NODE_INVALID', path, 'Visibility nodes require exact viewport, node, parent and own boolean visibility.'));
      continue;
    }
    const id = key(node.viewport, node.node_id);
    if (nodes.has(id)) diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_DUPLICATE', path, 'Duplicate source visibility node.'));
    nodes.set(id, node);
  }
  const ancestry = new Map();
  function chainFor(viewport, nodeId, stack = []) {
    const id = key(viewport, nodeId);
    if (ancestry.has(id)) return ancestry.get(id);
    const node = nodes.get(id);
    if (!node || stack.includes(nodeId)) {
      diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_ANCESTRY_INVALID', '/readings/nodes', `${viewport} visibility has a missing parent or cycle at ${nodeId}.`));
      return null;
    }
    const selectedRoot = readings.selection[viewport]?.root_node_id;
    if (nodeId === selectedRoot) {
      if (node.parent_node_id !== null) {
        diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_SCOPE_MISMATCH', '/readings/nodes', 'The selected graph root must have a normalized null parent.'));
        return null;
      }
      ancestry.set(id, [node]); return [node];
    }
    if (node.parent_node_id === null) {
      diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_SCOPE_MISMATCH', '/readings/nodes', `${viewport} node ${nodeId} lies outside the selected root.`));
      return null;
    }
    const parents = chainFor(viewport, node.parent_node_id, [...stack, nodeId]);
    if (!parents) return null;
    const chain = [...parents, node]; ancestry.set(id, chain); return chain;
  }
  for (const node of nodes.values()) {
    const chain = chainFor(node.viewport, node.node_id);
    if (chain && Object.hasOwn(node, 'effective_visible') && node.effective_visible !== chain.every(item => item.visible))
      diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_EFFECTIVE_MISMATCH', '/readings/nodes', 'Observed effective visibility disagrees with independently read ancestors.'));
  }
  for (const group of ['instances', 'fields', 'assets']) for (const source of readings[group] ?? []) {
    if (!nodes.has(key(source.viewport, source.node_id))) diagnostics.push(issue(
      'EMAIL_SOURCE_VISIBILITY_NODE_MISSING', '/readings/' + group, `${source.viewport} source ${source.node_id} is absent from the complete node graph.`,
    ));
    if (group !== 'instances' && !ancestry.get(key(source.viewport, source.node_id))?.some(node => node.node_id === source.owner_node_id)) diagnostics.push(issue(
      'EMAIL_SOURCE_VISIBILITY_OWNER_MISMATCH', '/readings/' + group, 'Observed source field or asset is outside its exact source owner ancestry.',
    ));
  }
  if (diagnostics.length) return failed();

  const byId = new Map(entries.map(entry => [entry.instance.instance_id, entry]));
  const modelVisible = new Map();
  const modelRoots = new Map();
  const modelActive = new Map();
  function checkComponentNode(record, node, viewport, axes, path) {
    if (!record?.figma) return; // Legacy test-only contracts have no Figma identity.
    if (record.figma.file_key !== readings.file_key || node?.owner_component_id !== record.figma.node_id) diagnostics.push(issue(
      'EMAIL_SOURCE_VISIBILITY_OWNER_MISMATCH', path, `${viewport} observed instance has the wrong or unproven registered component owner.`,
    ));
    const expected = registeredVariantNode(record, viewport, axes);
    if (!expected || node?.main_component_id !== expected) diagnostics.push(issue(
      'EMAIL_SOURCE_VISIBILITY_VARIANT_MISMATCH', path, `${viewport} observed main component differs from the selected registered variant.`,
    ));
  }
  for (const entry of entries) {
    const { instance, parent, relation, path } = entry;
    const record = resolvedContracts.get(instance.component_id);
    const visible = {}; const roots = {}; const active = {};
    for (const viewport of EMAIL_VIEWPORTS) {
      const root = selectVariantRoot(record, viewport, instance.variant_axes?.[viewport] ?? {}).root;
      roots[viewport] = root;
      if (!root) {
        diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_CONTRACT_MISSING', path, 'Visibility proof requires the exact selected component contract.'));
        visible[viewport] = new Set(); active[viewport] = false; continue;
      }
      rootSources.set(root, { record, viewport });
      const parentVisible = !parent || (modelActive.get(parent)?.[viewport] && modelVisible.get(parent)?.[viewport]?.has(relationId(relation, viewport)));
      visible[viewport] = parentVisible ? visibleContractElements(root, instance, viewport) : new Set();
      active[viewport] = visible[viewport].has(root.id);
      const ownerNode = mappedInstances.get(instance.instance_id)?.nodes?.[viewport];
      const sourceNode = nodes.get(key(viewport, ownerNode));
      checkComponentNode(record, sourceNode, viewport, instance.variant_axes?.[viewport], path);
      const sourceChain = ancestry.get(key(viewport, ownerNode));
      if (parent) {
        const parentRoot = modelRoots.get(parent)?.[viewport];
        const parentOwner = mappedInstances.get(parent.instance_id)?.nodes?.[viewport];
        const position = elementChain(parentRoot, relationId(relation, viewport))?.at(-1);
        const expectedPosition = position && expectedNode(position, parentRoot, parentOwner);
        const exact = relation?.kind === 'nested' ? expectedPosition === ownerNode :
          !!expectedPosition && sourceChain?.some(node => node.node_id === expectedPosition);
        if (!exact) diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_RELATION_MISMATCH', path, 'Mapped instance does not belong to its exact registered source position.'));
      }
      if (sourceChain && active[viewport] !== sourceChain.every(node => node.visible)) diagnostics.push(issue(
        'EMAIL_SOURCE_VISIBILITY_EFFECTIVE_MISMATCH', path, `${instance.instance_id}: ${viewport} model activity differs from its source ancestors.`,
      ));
    }
    modelVisible.set(instance, visible); modelRoots.set(instance, roots); modelActive.set(instance, active);
  }

  const targets = new Map();
  for (const [index, target] of correspondence.visibility.entries()) {
    const id = key(target.instance_id, target.element_id, target.viewport);
    if (!byId.has(target.instance_id) || !EMAIL_VIEWPORTS.includes(target.viewport) || typeof target.node_id !== 'string' || !target.node_id.trim() || targets.has(id))
      diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_TARGET_INVALID', '/correspondence/visibility/' + index, 'Visibility correspondence requires one exact instance, element, viewport and node.'));
    targets.set(id, target);
  }
  const hiddenWitnesses = new Set(); const claims = new Set(); const usedTargets = new Set();
  for (const { instance, path } of entries) for (const [index, binding] of (instance.visibility_values ?? []).entries()) {
    for (const viewport of binding.scope === 'all' ? EMAIL_VIEWPORTS : [binding.scope]) {
      const targetId = key(instance.instance_id, binding.element_id, viewport);
      const target = targets.get(targetId); const targetPath = `${path}/visibility_values/${index}`;
      const root = modelRoots.get(instance)?.[viewport];
      const contractChain = elementChain(root, binding.element_id);
      const owner = mappedInstances.get(instance.instance_id)?.nodes?.[viewport];
      const expected = contractChain && expectedNode(contractChain.at(-1), root, owner);
      const source = nodes.get(key(viewport, target?.node_id));
      const chain = ancestry.get(key(viewport, target?.node_id));
      const before = diagnostics.length;
      if (typeof binding.value !== 'boolean' || !target || !source || !expected || target.node_id !== expected) {
        diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_TARGET_MISMATCH', targetPath, 'Instance visibility must map to the exact registered element within its concrete source owner.'));
        continue;
      }
      usedTargets.add(targetId);
      if (source.visible !== binding.value) diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_VALUE_MISMATCH', targetPath, `${viewport} own visibility differs from the independently captured node.`));
      let previous = -1;
      for (const ancestor of contractChain) {
        const ancestorId = expectedNode(ancestor, root, owner);
        const position = chain.findIndex(node => node.node_id === ancestorId);
        if (!ancestorId || position <= previous) diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_ANCESTRY_MISMATCH', targetPath, 'Source parents do not establish the exact registered element ancestor chain.'));
        previous = position;
      }
      const effective = chain.every(node => node.visible);
      if (effective !== modelVisible.get(instance)?.[viewport]?.has(binding.element_id)) diagnostics.push(issue(
        'EMAIL_SOURCE_VISIBILITY_EFFECTIVE_MISMATCH', targetPath, 'Model visibility omits or revives a state not proved by the actual ancestor graph.',
      ));
      const claim = key(viewport, target.node_id);
      if (claims.has(claim)) diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_TARGET_COLLISION', targetPath, 'One physical source node cannot prove multiple visibility bindings.'));
      claims.add(claim);
      if (before === diagnostics.length && !effective) hiddenWitnesses.add(claim);
    }
  }
  for (const [id] of targets) if (!usedTargets.has(id)) diagnostics.push(issue(
    'EMAIL_SOURCE_VISIBILITY_UNBOUND', '/correspondence/visibility', 'Visibility correspondence has no matching concrete model binding.',
  ));
  function isHidden(viewport, nodeId) {
    const chain = ancestry.get(key(viewport, nodeId));
    return !!chain && chain.some(node => hiddenWitnesses.has(key(viewport, node.node_id))) && !chain.every(node => node.visible);
  }
  // A supplied field mapping cannot use somebody else's hidden node to excuse a
  // missing visible model binding. Contract identity is checked before omission.
  function isHiddenTarget(target) {
    const entry = byId.get(target.instance_id);
    const root = modelRoots.get(entry?.instance)?.[target.viewport];
    const owner = mappedInstances.get(target.instance_id)?.nodes?.[target.viewport];
    const chain = target.kind === 'property' ? [root] : elementChain(root, target.element_id);
    const element = chain?.at(-1);
    return !!element && expectedNode(element, root, owner) === target.node_id &&
      !modelVisible.get(entry.instance)?.[target.viewport]?.has(element.id) && isHidden(target.viewport, target.node_id);
  }
  // Even an omitted hidden nested INSTANCE must retain its exact contract role
  // and registered component identity; a wrong sibling cannot prove absence.
  for (const source of readings.instances) {
    if (!isHidden(source.viewport, source.node_id) || source.relation?.kind !== 'nested') continue;
    const parentEntry = entries.find(entry => mappedInstances.get(entry.instance.instance_id)?.nodes?.[source.viewport] === source.parent_node_id);
    const root = modelRoots.get(parentEntry?.instance)?.[source.viewport];
    const element = elementChain(root, source.relation.element_id)?.at(-1);
    if (!element || element.render_mode !== 'nested-component' || expectedNode(element, root, source.parent_node_id) !== source.node_id) {
      diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_RELATION_MISMATCH', '/readings/instances', 'Hidden nested source does not match its exact registered position.'));
      continue;
    }
    const childRecord = resolvedContracts.get(element.component_id);
    if (!childRecord) diagnostics.push(issue('EMAIL_SOURCE_VISIBILITY_CONTRACT_MISSING', '/readings/instances', 'Hidden nested source component is not registered.'));
    checkComponentNode(childRecord, nodes.get(key(source.viewport, source.node_id)), source.viewport, {}, '/readings/instances');
  }
  return { enabled, diagnostics, isHidden, isHiddenTarget, modelVisible };
}
