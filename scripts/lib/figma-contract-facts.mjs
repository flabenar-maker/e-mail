// Compare an independently supplied Figma MCP source packet with the semantic
// component contract. Stored source_variants and verification status are never inputs.
const VIEWPORTS = ["mobile", "desktop"];
const TARGET_PREFIX = /^\/(?:contracts\/(?:mobile|desktop)\/|asset_contracts\/|variants\/|properties\/|identity\/)/u;

function issue(code, fields = {}) {
  return { code, ...fields };
}

function pointerValue(root, pointer) {
  if (typeof pointer !== "string" || !pointer.startsWith("/")) return undefined;
  return pointer.slice(1).split("/").reduce((value, raw) => {
    const key = raw.replaceAll("~1", "/").replaceAll("~0", "~");
    return value?.[key];
  }, root);
}

function leafValues(value, path, emit) {
  if (Array.isArray(value)) {
    if (value.length === 0) emit(path, []);
    value.forEach((item, index) => leafValues(item, `${path}/${index}`, emit));
    return;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) emit(path, {});
    entries.forEach(([key, child]) => leafValues(child, `${path}/${key}`, emit));
    return;
  }
  emit(path, value);
}

function sourceFacts(variant, issues) {
  const result = new Map();
  const visited = new Set();
  function walk(node) {
    if (!node || typeof node.node_id !== "string" || visited.has(node.node_id)) {
      issues.push(issue("FIGMA_SOURCE_NODE_INVALID", { variant_node_id: variant.variant_node_id, node_id: node?.node_id ?? null }));
      return;
    }
    visited.add(node.node_id);
    for (const [key, value] of Object.entries(node)) {
      if (key === "node_id" || key === "children") continue;
      leafValues(value, `/${key}`, (source_path, actual) => {
        result.set(`${variant.variant_node_id}|^@${node.node_id}|^@${source_path}`, {
          variant_node_id: variant.variant_node_id,
          node_id: node.node_id,
          source_path,
          actual,
        });
      });
    }
    if (Array.isArray(node.children) && node.children.length > 0) {
      const source_path = "/children_order";
      result.set(`${variant.variant_node_id}|^@${node.node_id}|^@${source_path}`, {
        variant_node_id: variant.variant_node_id,
        node_id: node.node_id,
        source_path,
        actual: node.children.map((child) => child.node_id),
      });
      node.children.forEach(walk);
    }
  }
  if (variant.source_node?.node_id !== variant.variant_node_id) {
    issues.push(issue("FIGMA_VARIANT_ROOT_MISMATCH", { variant_node_id: variant.variant_node_id }));
  }
  walk(variant.source_node);
  return result;
}

function contractFactPaths(record) {
  const result = [];
  function walk(element, path) {
    if (!element || typeof element !== "object") return;
    (element.facts ?? []).forEach((fact, index) => {
      const base = `${path}/facts/${index}/value`;
      for (const [key, value] of Object.entries(fact.value ?? {})) {
        if (key === "type") continue;
        leafValues(value, `${base}/${key}`, (contract_path) => {
          result.push(contract_path);
        });
      }
    });
    (element.children ?? []).forEach((child, index) => walk(child, `${path}/children/${index}`));
  }
  for (const viewport of VIEWPORTS) {
    walk(record?.contracts?.[viewport]?.root, `/contracts/${viewport}/root`);
  }
  return result;
}

function canonicalFigmaNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return value;
  const nearestInteger = Math.round(value);
  return Math.abs(value - nearestInteger) < 0.0001 ? nearestInteger : value;
}

function transformed(value, transform) {
  if (transform === "identity") return canonicalFigmaNumber(value);
  if (transform === "lowercase" && typeof value === "string") return value.toLowerCase();
  return undefined;
}

function equal(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function auditFigmaContractFacts({ record, live, mappings = [] }) {
  const issues = [];
  if (!live || !Array.isArray(live.variants)) {
    return { ok: false, issues: [issue("LIVE_FIGMA_REQUIRED", { component_id: record?.id ?? null })] };
  }
  if (live.capture_version !== "1.0.0" || !Array.isArray(live.capture_errors) || !Array.isArray(live.component_properties)) {
    issues.push(issue("FIGMA_CAPTURE_VERSION_UNSUPPORTED", { capture_version: live.capture_version ?? null }));
  }
  if (Array.isArray(live.capture_errors) && live.capture_errors.length > 0) {
    issues.push(issue("FIGMA_CAPTURE_UNSUPPORTED", { details: live.capture_errors }));
  }
  if (live.file_key !== record?.figma?.file_key || live.component_node_id !== record?.figma?.node_id) {
    issues.push(issue("FIGMA_IDENTITY_MISMATCH", { component_id: record?.id ?? null }));
  }

  const byViewport = new Map(VIEWPORTS.map((viewport) => [viewport, []]));
  const liveVariantIds = new Set();
  const variantViewport = new Map();
  const source = new Map();
  for (const variant of live.variants) {
    if (!variant || typeof variant.variant_node_id !== "string" || liveVariantIds.has(variant.variant_node_id)) {
      issues.push(issue("FIGMA_VARIANT_INVALID", { variant_node_id: variant?.variant_node_id ?? null }));
      continue;
    }
    liveVariantIds.add(variant.variant_node_id);
    const viewportAxis = variant.axes?.find((axis) => axis.name === "Viewport");
    const viewport = viewportAxis?.value?.toLowerCase();
    variantViewport.set(variant.variant_node_id, viewport);
    if (!byViewport.has(viewport)) {
      issues.push(issue("FIGMA_VIEWPORT_UNKNOWN", { variant_node_id: variant.variant_node_id }));
    } else {
      byViewport.get(viewport).push(variant);
    }
    for (const [key, fact] of sourceFacts(variant, issues)) source.set(key, fact);
  }

  if (Array.isArray(live.component_properties) && live.component_properties.length > 0) {
    leafValues(live.component_properties, "/component_properties", (source_path, actual) => {
      const variant_node_id = live.component_node_id;
      const node_id = live.component_node_id;
      source.set(`${variant_node_id}|^@${node_id}|^@${source_path}`, {
        variant_node_id, node_id, source_path, actual,
      });
    });
  }

  for (const viewport of VIEWPORTS) {
    if (!record?.contracts?.[viewport]?.root) {
      issues.push(issue("CONTRACT_VIEWPORT_MISSING", { viewport }));
    }
    if (byViewport.get(viewport).length === 0) {
      issues.push(issue("FIGMA_VARIANT_MISSING", { viewport }));
    }
  }
  if (Array.isArray(record?.variants)) {
    const declared = new Set(record.variants.map((variant) => variant.node_id));
    for (const id of liveVariantIds) {
      if (!declared.has(id)) issues.push(issue("FIGMA_VARIANT_UNDECLARED", { variant_node_id: id }));
    }
    for (const id of declared) {
      if (!liveVariantIds.has(id)) issues.push(issue("CONTRACT_VARIANT_NOT_IN_FIGMA", { variant_node_id: id }));
    }
  }

  const coveredSource = new Set();
  const coveredContract = new Set();
  const seenMappings = new Set();
  for (const mapping of mappings) {
    const { variant_node_id, node_id, source_path, contract_path, transform = "identity" } = mapping ?? {};
    const key = `${variant_node_id}|^@${node_id}|^@${source_path}`;
    const mapKey = `${key}|^@${contract_path}`;
    if (seenMappings.has(mapKey)) {
      issues.push(issue("FIGMA_MAPPING_DUPLICATE", { variant_node_id, node_id, source_path, contract_path }));
      continue;
    }
    seenMappings.add(mapKey);
    if (!TARGET_PREFIX.test(contract_path ?? "")) {
      issues.push(issue("CONTRACT_TARGET_INVALID", { variant_node_id, node_id, source_path, contract_path }));
      continue;
    }
    const targetViewport = contract_path.match(/^\/contracts\/(mobile|desktop)\//u)?.[1];
    if (targetViewport && targetViewport !== variantViewport.get(variant_node_id)) {
      issues.push(issue("CONTRACT_VIEWPORT_MISMATCH", { variant_node_id, node_id, source_path, contract_path }));
      continue;
    }
    const sourceFact = source.get(key);
    if (!sourceFact) {
      issues.push(issue("FIGMA_SOURCE_PATH_MISSING", { variant_node_id, node_id, source_path, contract_path }));
      continue;
    }
    coveredSource.add(key);
    const expected = pointerValue(record, contract_path);
    if (expected === undefined) {
      issues.push(issue("CONTRACT_PATH_MISSING", { variant_node_id, node_id, source_path, contract_path }));
      continue;
    }
    coveredContract.add(contract_path);
    const actual = transformed(sourceFact.actual, transform);
    if (actual === undefined) {
      issues.push(issue("FIGMA_TRANSFORM_UNSUPPORTED", { variant_node_id, node_id, source_path, contract_path, transform }));
    } else if (!equal(actual, expected)) {
      issues.push(issue("FIGMA_CONTRACT_MISMATCH", { variant_node_id, node_id, source_path, contract_path, figma_value: actual, contract_value: expected }));
    }
  }

  for (const [key, fact] of source) {
    if (!coveredSource.has(key)) {
      issues.push(issue("FIGMA_FACT_UNCOVERED", {
        variant_node_id: fact.variant_node_id,
        node_id: fact.node_id,
        source_path: fact.source_path,
      }));
    }
  }
  for (const contract_path of contractFactPaths(record)) {
    if (!coveredContract.has(contract_path)) {
      issues.push(issue("CONTRACT_FACT_UNMAPPED", { contract_path }));
    }
  }
  issues.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return {
    ok: issues.length === 0,
    component_id: record?.id ?? null,
    source_fact_count: source.size,
    mapped_source_fact_count: coveredSource.size,
    contract_fact_count: contractFactPaths(record).length,
    mapped_contract_fact_count: coveredContract.size,
    issues,
  };
}
