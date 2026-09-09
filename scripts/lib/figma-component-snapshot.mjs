import { createHash } from "node:crypto";

import {
  compareFigmaComponentDescription,
  renderFigmaComponentDescription,
} from "./component-description.mjs";
import { SystemValidationError } from "./diagnostics.mjs";

const SNAPSHOT_VERSION = "1.0.0";
const VOLATILE_KEYS = new Set([
  "absoluteBoundingBox",
  "absoluteRenderBounds",
  "captured_at",
  "characters",
  "content",
  "instance_content",
  "last_modified",
  "mcp_metadata",
  "metadata",
  "request_id",
  "updated_at",
]);

function invalid(path, message) {
  throw new SystemValidationError(
    "FIGMA_COMPONENT_SNAPSHOT_INVALID",
    path,
    message,
  );
}

function normalizeLf(value) {
  return value.replace(/\r\n?/gu, "\n");
}

function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (!value || typeof value !== "object") {
    return typeof value === "string" ? normalizeLf(value) : value;
  }
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !VOLATILE_KEYS.has(key))
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, stableValue(child)]),
  );
}

function requireString(value, path) {
  if (typeof value !== "string" || value.length === 0) {
    invalid(path, "Required snapshot string is missing.");
  }
  return value;
}

function normalizeNodeKind(value, path) {
  const normalized = requireString(value, path)
    .trim()
    .toLowerCase()
    .replaceAll("_", "-");
  if (!["component", "component-set"].includes(normalized)) {
    invalid(path, "Unsupported component node kind.");
  }
  return normalized;
}

function normalizeNodeId(value, path) {
  return requireString(value?.node_id ?? value?.id, path);
}

function normalizeAxes(axes, path) {
  let entries;
  if (Array.isArray(axes)) {
    entries = axes.map((axis, index) => ({
      name: requireString(axis?.name, `${path}/${index}/name`),
      value: requireString(axis?.value, `${path}/${index}/value`),
    }));
  } else if (axes && typeof axes === "object") {
    entries = Object.entries(axes).map(([name, value]) => ({
      name: requireString(name, `${path}/name`),
      value: requireString(value, `${path}/${name}`),
    }));
  } else {
    invalid(path, "Variant axes must be an array or object.");
  }
  return entries.sort(
    (left, right) =>
      left.name.localeCompare(right.name) ||
      left.value.localeCompare(right.value),
  );
}

function normalizeVariant(variant, path) {
  const result = {
    node_id: normalizeNodeId(variant, `${path}/node_id`),
    axes: normalizeAxes(variant?.axes, `${path}/axes`),
  };
  for (const key of ["width", "height"]) {
    if (variant?.[key] !== undefined) {
      if (typeof variant[key] !== "number" || !Number.isFinite(variant[key])) {
        invalid(`${path}/${key}`, "Variant geometry must be finite.");
      }
      result[key] = variant[key];
    }
  }
  return result;
}

function normalizePropertyType(value, path) {
  return requireString(value, path)
    .trim()
    .toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-");
}

function normalizeProperty(property, path) {
  const name = requireString(property?.name, `${path}/name`)
    .replace(/#\d+:\d+$/u, "");
  const type = normalizePropertyType(property?.type, `${path}/type`);
  const result = {
    name: requireString(name, `${path}/name`),
    type,
  };
  const hasDefault = Object.hasOwn(property ?? {}, "default");
  const hasDefaultValue = Object.hasOwn(property ?? {}, "defaultValue");
  if (!hasDefault && !hasDefaultValue && type !== "slot") {
    invalid(`${path}/default`, "Property default is required.");
  }
  result.default = stableValue(
    hasDefault
      ? property.default
      : hasDefaultValue
        ? property.defaultValue
        : null,
  );
  return result;
}

function normalizeCollection(
  value,
  path,
  normalizeItem = stableValue,
  { sort = true } = {},
) {
  if (!Array.isArray(value)) {
    invalid(path, "Snapshot collection must be an array.");
  }
  const normalized = value.map(
    (item, index) => normalizeItem(item, `${path}/${index}`),
  );
  return sort
    ? normalized.sort((left, right) =>
        JSON.stringify(left).localeCompare(JSON.stringify(right)),
      )
    : normalized;
}

function normalizeComponent(component, path) {
  const nodeKind = normalizeNodeKind(
    component?.node_kind ?? component?.type,
    `${path}/node_kind`,
  );
  const description = component?.description ?? "";
  if (typeof description !== "string") {
    invalid(`${path}/description`, "Component Description must be a string.");
  }
  const contractGeometry = component?.contract_geometry ?? {};
  if (
    !contractGeometry ||
    typeof contractGeometry !== "object" ||
    Array.isArray(contractGeometry)
  ) {
    invalid(`${path}/contract_geometry`, "Contract geometry must be an object.");
  }
  return {
    node_id: normalizeNodeId(component, `${path}/node_id`),
    name: requireString(component?.name, `${path}/name`),
    node_kind: nodeKind,
    description: normalizeLf(description),
    variants: normalizeCollection(
      component?.variants ?? [],
      `${path}/variants`,
      normalizeVariant,
    ),
    properties: normalizeCollection(
      component?.properties ?? [],
      `${path}/properties`,
      normalizeProperty,
    ).filter((property) => property.type !== "variant"),
    semantic_children: normalizeCollection(
      component?.semantic_children ?? [],
      `${path}/semantic_children`,
      stableValue,
      { sort: false },
    ),
    bindings: normalizeCollection(
      component?.bindings ?? [],
      `${path}/bindings`,
    ),
    contract_geometry: stableValue(contractGeometry),
  };
}

export function normalizeFigmaComponentSnapshot(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    invalid("/", "Snapshot root must be an object.");
  }
  if (input.schema_version !== SNAPSHOT_VERSION) {
    invalid("/schema_version", "Unsupported component snapshot version.");
  }
  const fileKey = requireString(input.file_key, "/file_key");
  const capturedAt = requireString(input.captured_at, "/captured_at");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u.test(capturedAt)) {
    invalid("/captured_at", "Snapshot timestamp must be UTC ISO-8601.");
  }
  const roots = normalizeCollection(
    input.roots,
    "/roots",
    (root, path) => ({
      node_id: normalizeNodeId(root, `${path}/node_id`),
      components: normalizeCollection(
        root?.components,
        `${path}/components`,
        normalizeComponent,
      ),
    }),
  );
  return {
    schema_version: SNAPSHOT_VERSION,
    file_key: fileKey,
    captured_at: capturedAt,
    roots,
  };
}

function fingerprintPayload(component) {
  return {
    node_kind: component.node_kind,
    variants: stableValue(component.variants),
    properties: stableValue(component.properties),
    semantic_children: stableValue(component.semantic_children),
    bindings: stableValue(component.bindings),
    contract_geometry: stableValue(component.contract_geometry),
  };
}

export function fingerprintFigmaComponent(component) {
  const hash = createHash("sha256")
    .update(JSON.stringify(fingerprintPayload(component)), "utf8")
    .digest("hex");
  return `sha256:${hash}`;
}

function recordsIn(registries) {
  return ["shared", "marketing", "service"].flatMap((library) =>
    (registries?.[library]?.components ?? []).map((record) => ({
      library,
      record,
    })),
  );
}

function drift(type, path, record = null, identity = null) {
  const result = { type, path };
  if (record) {
    result.component_id = record.id;
  }
  if (identity) {
    result.figma_identity = {
      file_key: identity.file_key,
      node_id: identity.node_id,
    };
  }
  return result;
}

function sortDrifts(drifts) {
  return drifts.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.type.localeCompare(right.type) ||
      String(left.component_id ?? "").localeCompare(
        String(right.component_id ?? ""),
      ),
  );
}

export function compareFigmaComponentSnapshot({
  snapshot,
  registries,
  componentIndex,
}) {
  const drifts = [];
  const matched = new Set();
  const rootIds = new Set(snapshot.roots.map((root) => root.node_id));

  snapshot.roots.forEach((root, rootIndex) => {
    root.components.forEach((component, componentIndexInRoot) => {
      const path = `/roots/${rootIndex}/components/${componentIndexInRoot}`;
      const identity = {
        file_key: snapshot.file_key,
        node_id: component.node_id,
      };
      const key = `${identity.file_key}#${identity.node_id}`;
      let record = componentIndex.byFigmaIdentity.get(key) ?? null;

      if (!record) {
        const sameName = componentIndex.byFigmaName.get(component.name) ?? null;
        if (sameName) {
          matched.add(sameName.id);
          drifts.push(drift("identity-drift", path, sameName, identity));
        } else {
          drifts.push(drift("unregistered", path, null, identity));
        }
        return;
      }

      matched.add(record.id);
      if (component.name !== record.identity.figma_name) {
        drifts.push(drift("identity-drift", path, record, identity));
        return;
      }
      if (
        fingerprintFigmaComponent(component) !==
        record.figma.structure_fingerprint
      ) {
        drifts.push(drift("visual-drift", path, record, identity));
      }
      if (
        compareFigmaComponentDescription(
          renderFigmaComponentDescription(record, componentIndex),
          component.description,
        ).length > 0
      ) {
        drifts.push(drift("description-drift", path, record, identity));
      }
    });
  });

  for (const { record } of recordsIn(registries)) {
    if (
      record.figma.file_key === snapshot.file_key &&
      rootIds.has(record.figma.source_root_node_id) &&
      !matched.has(record.id)
    ) {
      drifts.push(
        drift(
          "missing",
          `/registry/${record.identity.library}/${record.id}`,
          record,
          {
            file_key: record.figma.file_key,
            node_id: record.figma.node_id,
          },
        ),
      );
    }
  }

  return sortDrifts(drifts);
}
