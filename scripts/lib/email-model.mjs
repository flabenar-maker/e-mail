import { readFile } from "node:fs/promises";
import { isAbsolute, posix, win32 } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";

const SUPPORTED_VERSION = "1.0.0";
const VIEWPORTS = ["mobile", "desktop"];

function diagnostic(code, path, message) {
  return new SystemValidationError(code, path, message);
}

function sortDiagnostics(errors) {
  const unique = new Map();
  for (const error of errors) {
    unique.set(error.code + "\0" + error.path + "\0" + error.message, error);
  }
  return [...unique.values()].sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );
}

function normalizeRichText(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeRichText);
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  if (value.type === "rich-text" && Array.isArray(value.segments)) {
    return {
      type: "rich-text",
      value: value.segments.map((segment) => segment.value).join(""),
    };
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, normalizeRichText(child)]),
  );
}

export async function loadEmailModel({ modelPath, schemaPath }) {
  let model;
  let schema;
  try {
    const [modelText, schemaText] = await Promise.all([
      readFile(modelPath, "utf8"),
      readFile(schemaPath, "utf8"),
    ]);
    model = JSON.parse(modelText);
    schema = JSON.parse(schemaText);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw diagnostic(
        "email-model-json",
        modelPath,
        "Email model or schema contains invalid JSON.",
      );
    }
    throw error;
  }

  const errors = validateDocumentShape({
    document: model,
    schema,
    supportedVersion: SUPPORTED_VERSION,
    versionCode: "email-model-version-unsupported",
    schemaCode: "email-model-schema",
  });
  if (errors.length > 0) {
    throw new AggregateError(errors, "Email model validation failed.");
  }
  return normalizeRichText(model);
}

function componentRecord(dependencies, componentId) {
  return dependencies?.componentIndex?.bySystemId?.get(componentId) ?? null;
}

function coverageRecord(dependencies, componentId) {
  return dependencies?.rendererRegistry?.coverage?.find(
    (entry) => entry.component_id === componentId,
  ) ?? null;
}

function bindingFor(items, viewport, matches) {
  const candidates = (items ?? []).filter(
    (item) => matches(item) && ["all", viewport].includes(item.scope),
  );
  return candidates.find((item) => item.scope === viewport) ??
    candidates.find((item) => item.scope === "all") ??
    null;
}

function propertyValue(instance, propertyId, viewport) {
  return bindingFor(
    instance.property_values,
    viewport,
    (item) => item.property_id === propertyId,
  )?.value;
}

function contentValue(instance, elementId, slotId, viewport) {
  return bindingFor(
    instance.content_values,
    viewport,
    (item) => item.element_id === elementId && item.slot_id === slotId,
  )?.value;
}

function elementMap(root) {
  const map = new Map();
  function visit(element) {
    if (!element) return;
    map.set(element.id, element);
    for (const child of element.children ?? []) visit(child);
  }
  visit(root);
  return map;
}

function validateScopedBindings(errors, items, path, keyOf) {
  const scopesByKey = new Map();
  (items ?? []).forEach((item, index) => {
    const key = keyOf(item);
    const scopes = scopesByKey.get(key) ?? new Map();
    if (scopes.has(item.scope)) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_BINDING_CONFLICT",
          path + "/" + index,
          "Duplicate " + item.scope + " binding for " + key + ".",
        ),
      );
    }
    if (
      (item.scope === "all" && scopes.size > 0) ||
      (item.scope !== "all" && scopes.has("all"))
    ) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_BINDING_CONFLICT",
          path + "/" + index,
          "The all scope cannot be combined with a viewport binding for " + key + ".",
        ),
      );
    }
    scopes.set(item.scope, index);
    scopesByKey.set(key, scopes);
  });
}

function validateUniqueBindings(errors, items, path, keyOf, label) {
  const seen = new Map();
  (items ?? []).forEach((item, index) => {
    const key = keyOf(item);
    if (seen.has(key)) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_BINDING_CONFLICT",
          path + "/" + index,
          "Duplicate " + label + " binding for " + key + ".",
        ),
      );
    } else {
      seen.set(key, index);
    }
  });
}

function safeAssetPath(value) {
  if (
    typeof value !== "string" ||
    value.includes("\\") ||
    isAbsolute(value) ||
    win32.isAbsolute(value) ||
    /^[a-z][a-z0-9+.-]*:/iu.test(value)
  ) {
    return false;
  }
  const normalized = posix.normalize(value);
  return (
    normalized === value &&
    value.startsWith("images/") &&
    !value.split("/").includes("..") &&
    value.length > "images/".length
  );
}

function expectedPropertyType(property) {
  if (property.type === "boolean") return "boolean";
  if (property.type === "text") return "string";
  if (property.type === "slot") return "object";
  if (property.type === "instance-swap") return ["string", "object"];
  return null;
}

function propertyTypeMatches(value, expected) {
  if (Array.isArray(expected)) {
    return expected.includes(typeof value);
  }
  return expected === null || typeof value === expected;
}

function visible(element, instance, viewport, errors, path) {
  if (element.visibility?.mode !== "property") return true;
  const propertyId = element.visibility.property_id;
  const value = propertyValue(instance, propertyId, viewport);
  if (typeof value !== "boolean") {
    errors.push(
      diagnostic(
        "EMAIL_MODEL_REQUIRED_PROPERTY_MISSING",
        path + "/visibility/property_id",
        "Boolean property " + propertyId + " is not resolved for " + viewport + ".",
      ),
    );
    return false;
  }
  return value;
}

function validateDeclaredBindings(instance, record, maps, errors, path) {
  const properties = new Map((record.properties ?? []).map((item) => [item.id, item]));
  const assets = new Set((record.asset_contracts ?? []).map((item) => item.id));

  (instance.property_values ?? []).forEach((item, index) => {
    const property = properties.get(item.property_id);
    const itemPath = path + "/property_values/" + index;
    if (!property) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_PROPERTY_UNKNOWN",
          itemPath + "/property_id",
          "Unknown property " + item.property_id + " for " + record.id + ".",
        ),
      );
      return;
    }
    const expected = expectedPropertyType(property);
    if (!propertyTypeMatches(item.value, expected)) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_PROPERTY_TYPE_MISMATCH",
          itemPath + "/value",
          "Property " + item.property_id + " expects " + String(expected) + ".",
        ),
      );
    }
  });

  (instance.content_values ?? []).forEach((item, index) => {
    const itemPath = path + "/content_values/" + index;
    const targetViewports = item.scope === "all" ? VIEWPORTS : [item.scope];
    const matches = targetViewports.flatMap((viewport) => {
      const element = maps[viewport].get(item.element_id);
      return element ? [{ viewport, element }] : [];
    });
    if (matches.length === 0) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_ELEMENT_UNKNOWN",
          itemPath + "/element_id",
          "Unknown element " + item.element_id + " for scope " + item.scope + ".",
        ),
      );
      return;
    }
    for (const { element } of matches) {
      const slot = (element.content_slots ?? []).find(
        (candidate) => candidate.id === item.slot_id,
      );
      if (!slot) {
        errors.push(
          diagnostic(
            "EMAIL_MODEL_CONTENT_SLOT_UNKNOWN",
            itemPath + "/slot_id",
            "Unknown content slot " + item.slot_id + " on " + item.element_id + ".",
          ),
        );
      } else if (slot.type !== item.value.type) {
        errors.push(
          diagnostic(
            "EMAIL_MODEL_CONTENT_TYPE_MISMATCH",
            itemPath + "/value/type",
            "Content slot " + item.element_id + "/" + item.slot_id + " expects " + slot.type + ".",
          ),
        );
      }
    }
  });

  (instance.asset_files ?? []).forEach((item, index) => {
    const itemPath = path + "/asset_files/" + index;
    if (!assets.has(item.asset_contract_id)) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_ASSET_UNKNOWN",
          itemPath + "/asset_contract_id",
          "Unknown asset contract " + item.asset_contract_id + " for " + record.id + ".",
        ),
      );
    }
    if (!safeAssetPath(item.path)) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_ASSET_PATH_UNSAFE",
          itemPath + "/path",
          "Asset path must be a normalized relative path below images/.",
        ),
      );
    }
  });
}

function validateRequiredTree(element, instance, viewport, errors, path) {
  if (!visible(element, instance, viewport, errors, path)) return;

  for (const slot of element.content_slots ?? []) {
    if (!slot.required) continue;
    if (element.render_mode === "slot" && slot.id === "content") {
      const value = (instance.slots ?? []).find((item) => item.element_id === element.id);
      if (!value || value.instances.length === 0) {
        errors.push(
          diagnostic(
            "EMAIL_MODEL_REQUIRED_SLOT_MISSING",
            path + "/content_slots/" + slot.id,
            "Required component slot " + element.id + " is empty for " + viewport + ".",
          ),
        );
      }
      continue;
    }
    if (!contentValue(instance, element.id, slot.id, viewport)) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_REQUIRED_CONTENT_MISSING",
          path + "/content_slots/" + slot.id,
          "Required content " + element.id + "/" + slot.id + " is missing for " + viewport + ".",
        ),
      );
    }
  }

  if (["direct-image", "background-image"].includes(element.render_mode)) {
    const asset = (instance.asset_files ?? []).find(
      (item) => item.asset_contract_id === element.asset_contract_id,
    );
    if (!asset) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_REQUIRED_ASSET_MISSING",
          path + "/asset_contract_id",
          "Required asset " + element.asset_contract_id + " is missing for " + viewport + ".",
        ),
      );
    }
  }

  if (element.render_mode === "nested-component") {
    const nested = (instance.nested_components ?? []).find(
      (item) => item.element_id === element.id,
    );
    if (!nested) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_REQUIRED_NESTED_MISSING",
          path + "/component_id",
          "Nested component " + element.component_id + " is missing for " + viewport + ".",
        ),
      );
    } else if (nested.instance.component_id !== element.component_id) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_NESTED_COMPONENT_MISMATCH",
          path + "/component_id",
          "Expected nested component " + element.component_id + ".",
        ),
      );
    }
  }

  (element.children ?? []).forEach((child, index) => {
    validateRequiredTree(
      child,
      instance,
      viewport,
      errors,
      path + "/children/" + index,
    );
  });
}

function validateInstance(instance, dependencies, errors, path, stack) {
  const record = componentRecord(dependencies, instance.component_id);
  if (!record) {
    errors.push(
      diagnostic(
        "EMAIL_MODEL_COMPONENT_UNKNOWN",
        path + "/component_id",
        "Component " + instance.component_id + " is not registered.",
      ),
    );
    return;
  }
  const coverage = coverageRecord(dependencies, instance.component_id);
  if (!coverage || coverage.mode !== "interpreter") {
    errors.push(
      diagnostic(
        "EMAIL_MODEL_COVERAGE_UNAVAILABLE",
        path + "/component_id",
        "Component " + instance.component_id + " has no interpreter coverage.",
      ),
    );
  }
  if (stack.includes(instance.component_id)) {
    errors.push(
      diagnostic(
        "EMAIL_MODEL_COMPONENT_CYCLE",
        path + "/component_id",
        "Component cycle detected.",
      ),
    );
    return;
  }

  validateScopedBindings(
    errors,
    instance.property_values,
    path + "/property_values",
    (item) => item.property_id,
  );
  validateScopedBindings(
    errors,
    instance.content_values,
    path + "/content_values",
    (item) => item.element_id + "/" + item.slot_id,
  );
  validateUniqueBindings(
    errors,
    instance.asset_files,
    path + "/asset_files",
    (item) => item.asset_contract_id,
    "asset",
  );
  validateUniqueBindings(
    errors,
    instance.slots,
    path + "/slots",
    (item) => item.element_id,
    "slot",
  );
  validateUniqueBindings(
    errors,
    instance.nested_components,
    path + "/nested_components",
    (item) => item.element_id,
    "nested component",
  );

  const maps = Object.fromEntries(
    VIEWPORTS.map((viewport) => [
      viewport,
      elementMap(record.contracts?.[viewport]?.root),
    ]),
  );
  validateDeclaredBindings(instance, record, maps, errors, path);
  for (const viewport of VIEWPORTS) {
    const root = record.contracts?.[viewport]?.root;
    if (!root) {
      errors.push(
        diagnostic(
          "EMAIL_MODEL_VIEWPORT_CONTRACT_MISSING",
          path + "/variants/" + viewport,
          "Component " + record.id + " has no " + viewport + " contract.",
        ),
      );
      continue;
    }
    validateRequiredTree(
      root,
      instance,
      viewport,
      errors,
      path + "/contracts/" + viewport + "/root",
    );
  }

  const nextStack = [...stack, instance.component_id];
  (instance.slots ?? []).forEach((slot, slotIndex) => {
    slot.instances.forEach((child, childIndex) => {
      validateInstance(
        child,
        dependencies,
        errors,
        path + "/slots/" + slotIndex + "/instances/" + childIndex,
        nextStack,
      );
    });
  });
  (instance.nested_components ?? []).forEach((nested, index) => {
    validateInstance(
      nested.instance,
      dependencies,
      errors,
      path + "/nested_components/" + index + "/instance",
      nextStack,
    );
  });
}

export function validateEmailModelSemantics(model, dependencies) {
  const errors = [];
  if (!model?.root) {
    return [
      diagnostic(
        "EMAIL_MODEL_ROOT_MISSING",
        "/root",
        "The email model has no root instance.",
      ),
    ];
  }
  validateInstance(model.root, dependencies, errors, "/root", []);
  return sortDiagnostics(errors);
}
