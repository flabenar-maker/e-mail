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

function isExportBoundary(node, variant, record) {
  return (record?.identity?.semantic_role === "asset" &&
      node.node_id === variant.variant_node_id) ||
    (record?.asset_contracts ?? []).some((asset) =>
      asset.owner_layer_name === node.name);
}

function exportedArtworkIds(variant, record) {
  const ids = new Set();
  function collect(node) {
    ids.add(node.node_id);
    for (const child of node.children ?? []) collect(child);
  }
  function walk(node) {
    if (isExportBoundary(node, variant, record)) {
      collect(node);
      return;
    }
    for (const child of node.children ?? []) walk(child);
  }
  walk(variant.source_node);
  return ids;
}

function sourceFacts(variant, issues, record) {
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
    if (Array.isArray(node.children) && node.children.length > 0 &&
        !isExportBoundary(node, variant, record) && node.node_type !== "INSTANCE") {
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

export function auditFigmaContractFacts({ record, live, mappings } = {}) {
  const issues = [];
  const ownedMappings = record?.contracts?.figma_fact_links;
  if (!Array.isArray(ownedMappings) ||
      (mappings !== undefined && !equal(mappings, ownedMappings))) {
    issues.push(issue("EVIDENCE_LINKS_NOT_IN_CONTRACT", { component_id: record?.id ?? null }));
  }
  if (!live || !Array.isArray(live.variants)) {
    return { ok: false, issues: [issue("LIVE_FIGMA_REQUIRED", { component_id: record?.id ?? null })] };
  }
  if (live.capture_version !== "1.0.0" || !Array.isArray(live.capture_errors) || !Array.isArray(live.component_properties)) {
    issues.push(issue("FIGMA_CAPTURE_VERSION_UNSUPPORTED", { capture_version: live.capture_version ?? null }));
  }
  const artworkIds = new Set((live.variants ?? []).flatMap((variant) =>
    [...exportedArtworkIds(variant, record)]));
  const capturedNodes = new Map();
  function indexNode(node) {
    capturedNodes.set(node.node_id, node);
    for (const child of node.children ?? []) indexNode(child);
  }
  for (const variant of live.variants) indexNode(variant.source_node);
  const unsupportedCapture = (live.capture_errors ?? []).filter((error) => {
    if (artworkIds.has(error.node_id)) return false;
    const node = capturedNodes.get(error.node_id);
    if (error.code === "MIXED_VALUE" && node?.node_type === "TEXT" &&
        ["fontName", "fontSize", "lineHeight", "fills", "textDecoration"].includes(error.field) &&
        node.styled_text_segments?.length >= 2) return false;
    if (error.code === "MIXED_VALUE" && error.field === "cornerRadius" &&
        node?.corner_radii &&
        Object.values(node.corner_radii).every(Number.isFinite)) return false;
    return true;
  });
  if (unsupportedCapture.length > 0) {
    issues.push(issue("FIGMA_CAPTURE_UNSUPPORTED", { details: unsupportedCapture }));
  }
  if (live.file_key !== record?.figma?.file_key || live.component_node_id !== record?.figma?.node_id) {
    issues.push(issue("FIGMA_IDENTITY_MISMATCH", { component_id: record?.id ?? null }));
  }

  const sharedAsset = record?.identity?.semantic_role === "asset" &&
    live.variants.length > 0 &&
    live.variants.every((variant) =>
      !variant.axes?.some((axis) => axis.name === "Viewport"));
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
    if (sharedAsset) {
      // One exported artwork source is shared by both viewport presentations.
    } else if (!byViewport.has(viewport)) {
      issues.push(issue("FIGMA_VIEWPORT_UNKNOWN", { variant_node_id: variant.variant_node_id }));
    } else {
      byViewport.get(viewport).push(variant);
    }
    for (const [key, fact] of sourceFacts(variant, issues, record)) source.set(key, fact);
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
    if (!sharedAsset && byViewport.get(viewport).length === 0) {
      issues.push(issue("FIGMA_VARIANT_MISSING", { viewport }));
    }
  }
  if (Array.isArray(record?.variants)) {
    const declared = new Set(record.variants.map((variant) => variant.node_id));
    for (const id of liveVariantIds) {
      if (!declared.has(id) && !(sharedAsset && id === live.component_node_id)) issues.push(issue("FIGMA_VARIANT_UNDECLARED", { variant_node_id: id }));
    }
    for (const id of declared) {
      if (!liveVariantIds.has(id)) issues.push(issue("CONTRACT_VARIANT_NOT_IN_FIGMA", { variant_node_id: id }));
    }
  }

  const coveredSource = new Set();
  const coveredContract = new Set();
  const seenMappings = new Set();
  for (const mapping of Array.isArray(ownedMappings) ? ownedMappings : []) {
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
    if (targetViewport && !sharedAsset && targetViewport !== variantViewport.get(variant_node_id)) {
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
    const atomicFactPath = contract_path.match(/^(.*\/facts\/\d+)\/value(?:\/.*)?$/u)?.[1];
    if (atomicFactPath) {
      const provenance = pointerValue(record, `${atomicFactPath}/provenance`);
      if (!["figma-literal", "figma-binding"].includes(provenance?.kind) ||
          provenance?.node_id !== node_id) {
        issues.push(issue("CONTRACT_FACT_NOT_FIGMA_VERIFIED", {
          variant_node_id, node_id, source_path, contract_path,
          provenance: provenance ?? null,
        }));
      }
    }
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
