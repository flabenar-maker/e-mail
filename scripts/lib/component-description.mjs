import { SystemValidationError } from "./diagnostics.mjs";

const EXACT_LITERAL_PATTERNS = [
  /#[0-9A-F]{6}\b/u,
  /\b\d+(?:\.\d+)?(?:px|%)\b/u,
  /\b\d+(?:\.\d+)?\s*[×x]\s*\d+(?:\.\d+)?(?:px)?\b/u,
  /@(?:2x|4x)\b/u,
];

function diagnostic(path, message) {
  return new SystemValidationError(
    "COMPONENT_REGISTRY_DESCRIPTION_REFERENCE",
    path,
    message,
  );
}

function duplicateDiagnostic(path) {
  return new SystemValidationError(
    "COMPONENT_REGISTRY_DESCRIPTION_LITERAL_DUPLICATE",
    path,
    "Description text duplicates an exact structured fact.",
  );
}

function sortDiagnostics(errors) {
  return errors.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );
}

function propertyById(record, propertyId) {
  return (record?.properties ?? []).find(
    (property) => property.id === propertyId,
  );
}

function assetById(record, assetId) {
  return (record?.asset_contracts ?? []).find((asset) => asset.id === assetId);
}

function findFact(record, path) {
  if (typeof path !== "string") {
    return null;
  }
  const parts = path.split("/");
  const viewport = parts.shift();
  let element = record?.contracts?.[viewport]?.root;
  if (!element) {
    return null;
  }
  if (parts[0] === element.id) {
    parts.shift();
  }
  const factId = parts.pop();
  for (const elementId of parts) {
    element = (element?.children ?? []).find((child) => child.id === elementId);
    if (!element) {
      return null;
    }
  }
  return (element?.facts ?? []).find((fact) => fact.id === factId) ?? null;
}

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : String(value);
}

function renderFoundationReference(value, index, path) {
  const key = [
    value.foundation_id,
    value.definition_group,
    value.definition_id,
  ].join("/");
  const resolved = index?.foundationValues?.get(key);
  if (resolved === undefined) {
    throw diagnostic(path, `Unknown rendered foundation reference: ${key}.`);
  }
  if (resolved && typeof resolved === "object" && "value" in resolved) {
    return renderFactValue(resolved, null, index, path);
  }
  return String(resolved);
}

function renderFactValue(value, record, index, path) {
  switch (value?.type) {
    case "string":
    case "keyword":
      return value.value;
    case "boolean":
    case "integer":
    case "number":
      return formatNumber(value.value);
    case "measure":
      return `${formatNumber(value.value)}${value.unit === "percent" ? "%" : "px"}`;
    case "dimensions":
      return `${formatNumber(value.width)}×${formatNumber(value.height)}px`;
    case "ratio":
      return `${formatNumber(value.width)}:${formatNumber(value.height)}`;
    case "color":
      return value.value;
    case "foundation-reference":
      return renderFoundationReference(value, index, path);
    case "component-reference": {
      const component = index?.bySystemId?.get(value.component_id);
      if (!component) {
        throw diagnostic(
          path,
          `Unknown component reference: ${String(value.component_id)}.`,
        );
      }
      return component.identity.figma_name;
    }
    case "property-reference": {
      const property = propertyById(record, value.property_id);
      if (!property) {
        throw diagnostic(
          path,
          `Unknown property reference: ${String(value.property_id)}.`,
        );
      }
      return property.figma_name;
    }
    case "asset-reference": {
      const asset = assetById(record, value.asset_contract_id);
      if (!asset) {
        throw diagnostic(
          path,
          `Unknown asset reference: ${String(value.asset_contract_id)}.`,
        );
      }
      return asset.owner_layer_name;
    }
    default:
      throw diagnostic(path, "Unknown fact value type.");
  }
}

function renderToken(token, record, index, path) {
  switch (token?.type) {
    case "text":
      return token.value;
    case "fact": {
      const fact = findFact(record, token.path);
      if (!fact) {
        throw diagnostic(
          path,
          `Unknown Description fact path: ${String(token.path)}.`,
        );
      }
      return renderFactValue(fact.value, record, index, path);
    }
    case "component-name": {
      const component = index?.bySystemId?.get(token.component_id);
      if (!component) {
        throw diagnostic(
          path,
          `Unknown Description component: ${String(token.component_id)}.`,
        );
      }
      return component.identity.figma_name;
    }
    case "property-name": {
      const property = propertyById(record, token.property_id);
      if (!property) {
        throw diagnostic(
          path,
          `Unknown Description property: ${String(token.property_id)}.`,
        );
      }
      return property.figma_name;
    }
    default:
      throw diagnostic(path, "Unknown Description token type.");
  }
}

function textDuplicatesStructuredFact(text, record, index) {
  if (EXACT_LITERAL_PATTERNS.some((pattern) => pattern.test(text))) {
    return true;
  }
  for (const component of index?.bySystemId?.values?.() ?? []) {
    if (text.includes(component.identity.figma_name)) {
      return true;
    }
  }
  for (const property of record?.properties ?? []) {
    if (text.includes(property.figma_name)) {
      return true;
    }
  }
  return false;
}

export function validateDescriptionModel(record, index) {
  const errors = [];
  const description = record?.description;
  if (!description || !["rendered", "none"].includes(description.mode)) {
    return [
      diagnostic(
        "/description/mode",
        "Description mode must be rendered or none.",
      ),
    ];
  }

  if (description.mode === "none") {
    if ("blocks" in description) {
      errors.push(
        diagnostic(
          "/description/blocks",
          "Description mode none cannot contain blocks.",
        ),
      );
    }
    return sortDiagnostics(errors);
  }

  if (!Array.isArray(description.blocks) || description.blocks.length === 0) {
    errors.push(
      diagnostic(
        "/description/blocks",
        "Rendered Description requires at least one block.",
      ),
    );
    return sortDiagnostics(errors);
  }

  description.blocks.forEach((block, blockIndex) => {
    const blockPath = `/description/blocks/${blockIndex}`;
    if (!["line", "bullet", "ordered"].includes(block?.type)) {
      return;
    }
    (block.tokens ?? []).forEach((token, tokenIndex) => {
      const tokenPath = `${blockPath}/tokens/${tokenIndex}`;
      if (
        token?.type === "text" &&
        textDuplicatesStructuredFact(token.value ?? "", record, index)
      ) {
        errors.push(duplicateDiagnostic(tokenPath));
        return;
      }
      try {
        renderToken(token, record, index, tokenPath);
      } catch (error) {
        if (error instanceof SystemValidationError) {
          errors.push(error);
        } else {
          errors.push(diagnostic(tokenPath, "Description token could not be resolved."));
        }
      }
    });
  });

  return sortDiagnostics(errors);
}

export function renderComponentDescription(record, index) {
  if (record?.description?.mode === "none") {
    return null;
  }

  const errors = validateDescriptionModel(record, index);
  if (errors.length > 0) {
    throw errors[0];
  }

  const lines = [record.identity.figma_name, ""];
  record.description.blocks.forEach((block, blockIndex) => {
    if (block.type === "blank") {
      lines.push("");
      return;
    }
    if (block.type === "heading") {
      lines.push(block.value);
      return;
    }
    const body = block.tokens
      .map((token, tokenIndex) =>
        renderToken(
          token,
          record,
          index,
          `/description/blocks/${blockIndex}/tokens/${tokenIndex}`,
        ),
      )
      .join("");
    if (block.type === "bullet") {
      lines.push(`— ${body}`);
    } else if (block.type === "ordered") {
      lines.push(`${block.index}. ${body}`);
    } else {
      lines.push(body);
    }
  });

  return `${lines.join("\n")}\n`;
}
