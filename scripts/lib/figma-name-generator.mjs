import { SystemValidationError } from "./diagnostics.mjs";
import { validateFigmaNameProposal } from "./figma-name-validator.mjs";

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
  const errors = validateFigmaNameProposal(naming, {
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
  if (request.namingScope === "implementation-geometry") {
    return blocked(
      "FIGMA_NAME_GEOMETRY_RENAME_NOT_REQUIRED",
      "/request/namingScope",
      "Atomic implementation geometry remains unnamed semantically under its confirmed parent boundary.",
    );
  }
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
    { roleId: role, semanticCategory: "role" },
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

  const scale = naming.asset_owners.scale_suffixes.find((item) =>
    typeof request.existingName === "string" &&
    request.existingName.endsWith(" " + item.suffix),
  );
  if (!scale) {
    return blocked(
      "FIGMA_NAME_SCALE_SUFFIX_REQUIRED",
      "/request/existingName",
      "An existing @2x or @4x asset owner name is required for an asset owner rename.",
    );
  }

  const kind = request.assetOwnerKind;
  if (kind !== "internal" && kind !== "component") {
    return blocked(
      "semantic-role-required",
      "/request/assetOwnerKind",
      "A confirmed internal or component asset owner kind is required.",
    );
  }
  if (
    (kind === "internal" && request.existingName.startsWith("Asset/")) ||
    (kind === "component" && !request.existingName.startsWith("Asset/"))
  ) {
    return blocked(
      "FIGMA_NAME_ASSET_OWNER_KIND_MISMATCH",
      "/request/existingName",
      "Ordinary naming requests cannot change the asset owner kind.",
    );
  }

  const semanticName =
    kind === "component" ? titleKebab(naming, tokens) : lowerKebab(tokens);
  const name =
    (kind === "component" ? "Asset/" : "") +
    semanticName +
    " " +
    scale.suffix;
  return generated(
    naming,
    request,
    name,
    [
      "asset-owner",
      kind === "component" ? "title-kebab-component-segment" : "lower-kebab",
      `preserve-${scale.suffix}`,
    ],
    {
      expectedScale: scale.scale,
      assetOwnerKind: kind,
      existingName: request.existingName,
    },
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

export function renderFigmaNamingReference(naming) {
  const examples = [
    {
      objectKind: "component",
      namespaceId: "block",
      semanticTokens: ["cards", "images"],
    },
    { objectKind: "layer", roleId: "artwork" },
    {
      objectKind: "asset-owner",
      assetOwnerKind: "internal",
      existingName: "hero-image @2x",
      semanticTokens: ["feature", "image"],
    },
    {
      objectKind: "asset-owner",
      assetOwnerKind: "component",
      existingName: "Asset/Bank-Badge @4x",
      semanticTokens: ["feature", "icon"],
    },
  ].map((request) => generateFigmaName(naming, request));

  return JSON.stringify(
    {
      generated_examples: examples.map((result) => ({
        object_kind: result.object_kind,
        name: result.name,
        applied_rule_ids: result.applied_rule_ids,
      })),
      proposal_gate: "semantic-role-required",
      existing_name_audit: "syntax-valid is not semantic-confirmed",
      scale_change: "requires a separate export-contract decision",      implementation_geometry: "not assigned a semantic name under a confirmed parent boundary",

    },
    null,
    2,
  ) + "\n";
}
