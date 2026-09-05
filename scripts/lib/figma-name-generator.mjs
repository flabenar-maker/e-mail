import { SystemValidationError } from "./diagnostics.mjs";
import { validateFigmaName } from "./figma-name-validator.mjs";

function blocked(code, path, message) {
  return {
    status: "blocked",
    error: new SystemValidationError(code, path, message),
  };
}

function confirmedTokens(request, field) {
  const tokens = request?.[field];
  if (
    !Array.isArray(tokens) ||
    tokens.length === 0 ||
    tokens.some(
      (token) =>
        typeof token !== "string" ||
        !/^[A-Za-z0-9]+$/u.test(token),
    )
  ) {
    return null;
  }
  return tokens;
}

function lowerKebab(tokens) {
  return tokens.map((token) => token.toLowerCase()).join("-");
}

function titleWord(naming, token) {
  const abbreviation =
    naming.component_names.approved_abbreviations.find(
      (item) => item.toLowerCase() === token.toLowerCase(),
    );
  if (abbreviation) {
    return abbreviation;
  }
  return token[0].toUpperCase() + token.slice(1).toLowerCase();
}

function titleKebab(naming, tokens) {
  return tokens.map((token) => titleWord(naming, token)).join("-");
}

function titleWords(naming, tokens) {
  return tokens.map((token) => titleWord(naming, token)).join(" ");
}

function generated(naming, request, name, appliedRuleIds, validation) {
  const errors = validateFigmaName(naming, {
    objectKind: request.objectKind,
    name,
    ...validation,
  });
  if (errors.length > 0) {
    return { status: "blocked", error: errors[0] };
  }
  return {
    status: "generated",
    object_kind: request.objectKind,
    name,
    applied_rule_ids: appliedRuleIds,
  };
}

function generateComponent(naming, request) {
  const tokens = confirmedTokens(request, "semanticTokens");
  if (!tokens) {
    return blocked(
      "semantic-role-required",
      "/request/semanticTokens",
      "Confirmed semantic tokens are required before generating a name.",
    );
  }
  const namespace = naming.namespaces.find(
    (item) => item.id === request.namespaceId,
  );
  if (!namespace) {
    return blocked(
      "FIGMA_NAME_UNKNOWN_NAMESPACE",
      "/request/namespaceId",
      `Unknown component namespace: ${String(request.namespaceId)}.`,
    );
  }
  const name =
    namespace.label +
    naming.component_names.separator +
    titleKebab(naming, tokens);
  return generated(
    naming,
    request,
    name,
    [
      "component-pattern",
      `namespace-${namespace.id}`,
      "title-kebab",
    ],
    { namespaceId: namespace.id },
  );
}

function generateLayer(naming, request) {
  const role = request.roleId;
  if (
    typeof role !== "string" ||
    !naming.layer_names.controlled_roles.includes(role)
  ) {
    return blocked(
      "semantic-role-required",
      "/request/roleId",
      "A confirmed controlled layer role is required.",
    );
  }

  let name = role;
  if (request.qualifierTokens !== undefined) {
    const qualifier = confirmedTokens(request, "qualifierTokens");
    if (!qualifier) {
      return blocked(
        "semantic-role-required",
        "/request/qualifierTokens",
        "Confirmed qualifier tokens are required when a qualifier is used.",
      );
    }
    name += "-" + lowerKebab(qualifier);
  }
  if (request.repeatIndex !== undefined) {
    if (
      !Number.isInteger(request.repeatIndex) ||
      request.repeatIndex <
        naming.layer_names.repeater_index.starts_at ||
      request.repeatIndex > 99
    ) {
      return blocked(
        "FIGMA_NAME_REPEATER_INDEX",
        "/request/repeatIndex",
        "Repeated layer index must be an integer from 1 through 99.",
      );
    }
    name += "-" + String(request.repeatIndex).padStart(2, "0");
  }

  return generated(
    naming,
    request,
    name,
    ["lower-kebab", "controlled-layer-role"],
  );
}

function generateProperty(naming, request) {
  if (request.propertyKind === "variant-axis") {
    const axis = naming.variant_axes.find(
      (item) => item.id === request.axisId,
    );
    if (!axis) {
      return blocked(
        "semantic-role-required",
        "/request/axisId",
        "A confirmed variant axis is required.",
      );
    }
    return generated(
      naming,
      request,
      axis.label,
      ["variant-axis", `axis-${axis.id}`],
      { propertyKind: "variant-axis" },
    );
  }

  const tokens = confirmedTokens(request, "roleTokens");
  if (!tokens) {
    return blocked(
      "semantic-role-required",
      "/request/roleTokens",
      "Confirmed property role tokens are required.",
    );
  }

  const role = titleWords(naming, tokens);
  let name = role;
  if (request.propertyKind === "boolean") {
    name = naming.property_names.boolean.prefix + " " + role;
  }

  return generated(
    naming,
    request,
    name,
    [`property-${String(request.propertyKind)}`, "title-case"],
    { propertyKind: request.propertyKind },
  );
}

function generateAssetOwner(naming, request) {
  const tokens = confirmedTokens(request, "semanticTokens");
  if (!tokens) {
    return blocked(
      "semantic-role-required",
      "/request/semanticTokens",
      "Confirmed semantic tokens are required before generating an asset owner name.",
    );
  }

  if (
    Object.hasOwn(request, "targetScale") ||
    Object.hasOwn(request, "scale")
  ) {
    return blocked(
      "FIGMA_NAME_SCALE_SUFFIX_MISMATCH",
      "/request/targetScale",
      "Ordinary naming requests cannot change an asset scale.",
    );
  }

  const scale = naming.asset_owners.scale_suffixes.find(
    (item) => item.scale === request.currentScale,
  );
  if (!scale) {
    return blocked(
      "FIGMA_NAME_SCALE_SUFFIX_REQUIRED",
      "/request/currentScale",
      "An existing @2x or @4x scale is required for an asset owner.",
    );
  }

  const name = lowerKebab(tokens) + " " + scale.suffix;
  return generated(
    naming,
    request,
    name,
    ["asset-owner", "lower-kebab", `preserve-${scale.suffix}`],
    { expectedScale: scale.scale },
  );
}

function generateOrganization(naming, request) {
  if (request.objectKind === "example") {
    const family = confirmedTokens(request, "familyTokens");
    const semantic = confirmedTokens(request, "semanticTokens");
    const viewportAxis = naming.variant_axes.find(
      (axis) => axis.id === "viewport",
    );
    if (!family) {
      return blocked(
        "semantic-role-required",
        "/request/familyTokens",
        "Confirmed example family tokens are required.",
      );
    }
    if (!semantic) {
      return blocked(
        "semantic-role-required",
        "/request/semanticTokens",
        "Confirmed example semantic tokens are required.",
      );
    }
    if (!viewportAxis?.values?.includes(request.viewportValue)) {
      return blocked(
        "semantic-role-required",
        "/request/viewportValue",
        "An approved example viewport value is required.",
      );
    }
    const name =
      "Example · " +
      titleWords(naming, family) +
      " · " +
      titleWords(naming, semantic) +
      " · " +
      request.viewportValue;
    return generated(
      naming,
      request,
      name,
      ["example-pattern", "title-case", "viewport-value"],
    );
  }

  const tokens = confirmedTokens(request, "semanticTokens");
  if (!tokens) {
    return blocked(
      "semantic-role-required",
      "/request/semanticTokens",
      "Confirmed semantic tokens are required before generating an organizational name.",
    );
  }
  return generated(
    naming,
    request,
    titleWords(naming, tokens),
    [`${request.objectKind}-title-case`],
  );
}

export function generateFigmaName(naming, request = {}) {
  if (request.objectKind === "component") {
    return generateComponent(naming, request);
  }
  if (request.objectKind === "layer") {
    return generateLayer(naming, request);
  }
  if (request.objectKind === "property") {
    return generateProperty(naming, request);
  }
  if (request.objectKind === "asset-owner") {
    return generateAssetOwner(naming, request);
  }
  if (
    request.objectKind === "page" ||
    request.objectKind === "section" ||
    request.objectKind === "example"
  ) {
    return generateOrganization(naming, request);
  }
  return blocked(
    "FIGMA_NAME_UNKNOWN_OBJECT_KIND",
    "/request/objectKind",
    `Unknown Figma naming object kind: ${String(request.objectKind)}.`,
  );
}
