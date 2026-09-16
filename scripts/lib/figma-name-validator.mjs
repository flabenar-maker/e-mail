import { SystemValidationError } from "./diagnostics.mjs";

function diagnostic(code, path, message) {
  return new SystemValidationError(code, path, message);
}

function sortDiagnostics(errors) {
  return errors.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );
}

function isTitleCaseWords(value) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.split(" ").every(
      (word) =>
        /^[A-Z][A-Za-z0-9]*$/u.test(word) ||
        /^[A-Z][A-Z0-9]*$/u.test(word),
    )
  );
}

function isTitleKebab(value, abbreviations) {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }
  return value.split("-").every(
    (part) =>
      abbreviations.includes(part) ||
      /^[A-Z][a-z0-9]*$/u.test(part),
  );
}

function validateComponent(naming, candidate, errors) {
  const name = candidate.name;
  const separator = naming.component_names.separator;
  if (
    typeof name !== "string" ||
    name.split(separator).length - 1 !==
      naming.component_names.slash_count
  ) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_COMPONENT_PATTERN",
        "/candidate/name",
        "Component name must contain exactly one namespace separator.",
      ),
    );
    return;
  }

  const [namespaceLabel, semanticName] = name.split(separator);
  const namespace = naming.namespaces.find(
    (item) =>
      item.id === candidate.namespaceId ||
      item.label === namespaceLabel,
  );
  if (
    !namespace ||
    (candidate.namespaceId && namespace.id !== candidate.namespaceId) ||
    namespace.label !== namespaceLabel
  ) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_UNKNOWN_NAMESPACE",
        "/candidate/name",
        `Unknown or mismatched component namespace: ${namespaceLabel}.`,
      ),
    );
    return;
  }

  if (
    !isTitleKebab(
      semanticName,
      naming.component_names.approved_abbreviations,
    )
  ) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_CASE",
        "/candidate/name",
        "Component semantic name must use Title-Kebab.",
      ),
    );
  }
}

function validateLayer(naming, candidate, errors) {
  const name = candidate.name;
  if (typeof name !== "string") {
    errors.push(
      diagnostic(
        "FIGMA_NAME_CASE",
        "/candidate/name",
        "Layer name must be a string in lower-kebab-case.",
      ),
    );
    return;
  }

  const generic = naming.layer_names.forbidden_patterns.some(
    (rule) => new RegExp(rule.pattern, "u").test(name),
  );
  if (generic) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_GENERIC",
        "/candidate/name",
        "Generic Figma layer names are forbidden.",
      ),
    );
    return;
  }

  if (/(?:^|-)(?:mobile|desktop)(?:-|$)/iu.test(name)) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_VIEWPORT_WORD_FORBIDDEN",
        "/candidate/name",
        "Viewport words are forbidden in semantic layer names.",
      ),
    );
    return;
  }

  if (
    /-[0-9]+$/u.test(name) &&
    !/-(?:0[1-9]|[1-9][0-9])$/u.test(name)
  ) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_REPEATER_INDEX",
        "/candidate/name",
        "Repeated layer indices must use two digits starting at 01.",
      ),
    );
    return;
  }

  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u.test(name)) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_CASE",
        "/candidate/name",
        "Layer name must use lower-kebab-case.",
      ),
    );
  }
}

function validateImplementationGeometry(naming, candidate) {
  if (candidate.namingScope !== "implementation-geometry") return null;
  const errors = [];
  const contract = naming.layer_names.implementation_geometry;
  if (
    contract.parent_semantic_boundary_required &&
    candidate.parentSemanticBoundaryConfirmed !== true
  ) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_GEOMETRY_BOUNDARY_REQUIRED",
        "/candidate/parentSemanticBoundaryConfirmed",
        "Atomic implementation geometry is outside semantic naming only under a confirmed semantic parent boundary.",
      ),
    );
  }
  if (!contract.node_types.includes(candidate.nodeType)) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_GEOMETRY_NODE_TYPE_INVALID",
        "/candidate/nodeType",
        "The candidate node type is not atomic implementation geometry.",
      ),
    );
  }
  return errors;
}

function roleRequired(path = "/candidate/roleId") {
  return diagnostic(
    "semantic-role-required",
    path,
    "A confirmed controlled semantic role is required for a naming proposal.",
  );
}

function semanticCategoryRequired(path = "/candidate/semanticCategory") {
  return diagnostic(
    "semantic-category-required",
    path,
    "A confirmed non-prohibited semantic category is required for a layer naming proposal.",
  );
}

function resolveLayerSemantics(naming, candidate) {
  const role = candidate.roleId;
  if (
    typeof role !== "string" ||
    !naming.layer_names.controlled_roles.includes(role)
  ) {
    return { confirmed: false, errors: [roleRequired()] };
  }

  const category = candidate.semanticCategory;
  if (typeof category !== "string" || category.length === 0) {
    return { confirmed: false, errors: [semanticCategoryRequired()] };
  }
  if (naming.layer_names.forbidden_categories.includes(category)) {
    return {
      confirmed: false,
      errors: [
        diagnostic(
          "FIGMA_NAME_PROHIBITED_SEMANTIC_CATEGORY",
          "/candidate/semanticCategory",
          `Layer proposals cannot be based on the prohibited ${category} category.`,
        ),
      ],
    };
  }
  if (category !== "role") {
    return { confirmed: false, errors: [semanticCategoryRequired()] };
  }
  return { confirmed: true, errors: [] };
}

function assetOwnerKindFromName(name) {
  return typeof name === "string" && name.startsWith("Asset/")
    ? "component"
    : "internal";
}

function scaleFromAssetOwnerName(naming, name) {
  if (typeof name !== "string") return null;
  return naming.asset_owners.scale_suffixes.find((item) =>
    name.endsWith(" " + item.suffix),
  ) ?? null;
}

function validateProperty(naming, candidate, errors) {
  const name = candidate.name;
  const kind = candidate.propertyKind;

  if (kind === "variant-axis") {
    if (!naming.variant_axes.some((axis) => axis.label === name)) {
      errors.push(
        diagnostic(
          "FIGMA_NAME_PROPERTY_PATTERN",
          "/candidate/name",
          "Variant property must use an approved axis label.",
        ),
      );
    }
    return;
  }

  if (kind === "boolean") {
    const prefix = naming.property_names.boolean.prefix + " ";
    if (
      typeof name !== "string" ||
      !name.startsWith(prefix) ||
      !isTitleCaseWords(name.slice(prefix.length))
    ) {
      errors.push(
        diagnostic(
          "FIGMA_NAME_PROPERTY_PATTERN",
          "/candidate/name",
          "Boolean property must use the positive Show <Role> pattern.",
        ),
      );
    }
    return;
  }

  const allowed =
    kind === "text"
      ? naming.property_names.text_roles
      : kind === "instance-swap"
        ? naming.property_names.instance_swap_roles
        : null;
  if (!allowed || !allowed.includes(name)) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_PROPERTY_PATTERN",
        "/candidate/name",
        "Property name must use an approved semantic role.",
      ),
    );
  }
}

function validateAssetOwner(naming, candidate, errors) {
  const name = candidate.name;
  if (typeof name !== "string") {
    errors.push(
      diagnostic(
        "FIGMA_NAME_SCALE_SUFFIX_REQUIRED",
        "/candidate/name",
        "Asset owner name must include a scale suffix.",
      ),
    );
    return;
  }

  if (/\.(?:png|jpe?g|gif|webp|svg)$/iu.test(name)) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_EXTENSION_FORBIDDEN",
        "/candidate/name",
        "File extensions are forbidden in Figma asset owner names.",
      ),
    );
  }

  if (/(?:^|[- /])(?:mobile|desktop)(?:[- /]|$)/iu.test(name)) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_VIEWPORT_WORD_FORBIDDEN",
        "/candidate/name",
        "Viewport words are forbidden in asset owner names.",
      ),
    );
  }

  const suffixes = naming.asset_owners.scale_suffixes;
  const present = suffixes.find((item) => name.includes(item.suffix));
  if (!present) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_SCALE_SUFFIX_REQUIRED",
        "/candidate/name",
        "Asset owner name must include @2x or @4x.",
      ),
    );
    return;
  }

  if (!name.endsWith(" " + present.suffix)) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_SUFFIX_POSITION",
        "/candidate/name",
        "Asset scale suffix must follow the semantic name after a space and remain at the end.",
      ),
    );
    return;
  }

  if (
    candidate.expectedScale !== undefined &&
    present.scale !== candidate.expectedScale
  ) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_SCALE_SUFFIX_MISMATCH",
        "/candidate/name",
        `Expected @${String(candidate.expectedScale)}x, received ${present.suffix}.`,
      ),
    );
    return;
  }

  const semantic = name.slice(0, -present.suffix.length).trimEnd();
  if (semantic.startsWith("Asset/")) {
    const componentCandidate = {
      objectKind: "component",
      name: semantic,
      namespaceId: "asset",
    };
    validateComponent(naming, componentCandidate, errors);
  } else if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u.test(semantic)) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_CASE",
        "/candidate/name",
        "Internal asset owner semantic name must use lower-kebab-case.",
      ),
    );
  }
}

function validateOrganizational(candidate, errors) {
  const name = candidate.name;
  if (candidate.objectKind === "example") {
    if (
      typeof name !== "string" ||
      !/^Example · .+ · .+ · (?:Mobile|Desktop)$/u.test(name)
    ) {
      errors.push(
        diagnostic(
          "FIGMA_NAME_CASE",
          "/candidate/name",
          "Example name must follow the approved four-part pattern.",
        ),
      );
    }
    return;
  }

  if (!isTitleCaseWords(name)) {
    errors.push(
      diagnostic(
        "FIGMA_NAME_CASE",
        "/candidate/name",
        "Page and Section names must use readable English Title Case.",
      ),
    );
  }
}

export function validateFigmaName(naming, candidate = {}) {
  const errors = [];
  const knownKinds = new Set(
    (naming?.object_kinds ?? []).map((item) => item.id),
  );
  if (!knownKinds.has(candidate.objectKind)) {
    return [
      diagnostic(
        "FIGMA_NAME_UNKNOWN_OBJECT_KIND",
        "/candidate/objectKind",
        `Unknown Figma naming object kind: ${String(candidate.objectKind)}.`,
      ),
    ];
  }

  if (candidate.objectKind === "component") {
    validateComponent(naming, candidate, errors);
  } else if (candidate.objectKind === "layer") {
    const geometryErrors = validateImplementationGeometry(naming, candidate);
    if (geometryErrors === null) validateLayer(naming, candidate, errors);
    else errors.push(...geometryErrors);
  } else if (candidate.objectKind === "property") {
    validateProperty(naming, candidate, errors);
  } else if (candidate.objectKind === "asset-owner") {
    validateAssetOwner(naming, candidate, errors);
  } else {
    validateOrganizational(candidate, errors);
  }

  return sortDiagnostics(errors);
}

/**
 * Checks a proposed future name. Unlike an audit of an existing Figma node,
 * this API must have independently confirmed semantics before it can return
 * an empty diagnostic set.
 */
export function validateFigmaNameProposal(naming, candidate = {}) {
  const errors = validateFigmaName(naming, candidate);

  if (candidate.objectKind === "layer") {
    if (candidate.namingScope === "implementation-geometry") {
      errors.push(
        diagnostic(
          "FIGMA_NAME_GEOMETRY_RENAME_NOT_REQUIRED",
          "/candidate/namingScope",
          "Atomic implementation geometry under a confirmed semantic boundary does not receive a semantic rename.",
        ),
      );
    } else {
      errors.push(...resolveLayerSemantics(naming, candidate).errors);
    }
  }

  if (candidate.objectKind === "asset-owner") {
    const kind = candidate.assetOwnerKind;
    if (kind !== "internal" && kind !== "component") {
      errors.push(
        roleRequired("/candidate/assetOwnerKind"));
    } else if (typeof candidate.name === "string") {
      const actualKind = assetOwnerKindFromName(candidate.name);
      if (actualKind !== kind) {
        errors.push(
          diagnostic(
            "FIGMA_NAME_ASSET_OWNER_KIND_MISMATCH",
            "/candidate/name",
            `Asset owner name is ${actualKind}, not ${kind}.`,
          ),
        );
      }
    }

    const existingScale = scaleFromAssetOwnerName(
      naming,
      candidate.existingName,
    );
    const proposedScale = scaleFromAssetOwnerName(naming, candidate.name);
    if (!existingScale) {
      errors.push(
        diagnostic(
          "FIGMA_NAME_SCALE_SUFFIX_REQUIRED",
          "/candidate/existingName",
          "An existing @2x or @4x asset owner name is required to preserve scale during an ordinary rename.",
        ),
      );
    } else if (proposedScale && existingScale.scale !== proposedScale.scale) {
      errors.push(
        diagnostic(
          "FIGMA_NAME_SCALE_SUFFIX_MISMATCH",
          "/candidate/name",
          `Ordinary rename must preserve ${existingScale.suffix}.`,
        ),
      );
    }
    if (
      existingScale &&
      (kind === "internal" || kind === "component") &&
      assetOwnerKindFromName(candidate.existingName) !== kind
    ) {
      errors.push(
        diagnostic(
          "FIGMA_NAME_ASSET_OWNER_KIND_MISMATCH",
          "/candidate/existingName",
          "Ordinary rename cannot change the asset owner kind.",
        ),
      );
    }
  }

  return sortDiagnostics(errors);
}

/**
 * Records what Figma already contains. It never implies a rename and it does
 * not turn syntax alone into proof of a layer's semantic role.
 */
export function auditExistingFigmaName(naming, candidate = {}) {
  const diagnostics = validateFigmaName(naming, candidate).map(
    (error) => error.code,
  );
  if (candidate.objectKind === "layer" && candidate.namingScope === "implementation-geometry") {
    if (diagnostics.length > 0) {
      return {
        status: "observed",
        object_kind: candidate.objectKind,
        name: candidate.name,
        naming_scope: candidate.namingScope,
        syntax_status: "invalid",
        semantic_status: "unresolved",
        diagnostics: [...new Set(diagnostics)].sort(),
        rename_proposal: null,
      };
    }
    return {
      status: "observed",
      object_kind: candidate.objectKind,
      name: candidate.name,
      naming_scope: candidate.namingScope,
      syntax_status: "not-applicable",
      semantic_status: "not-applicable",
      diagnostics: [],
      rename_proposal: null,
    };
  }
  const syntaxStatus = diagnostics.length === 0 ? "valid" : "invalid";
  const isLayer = candidate.objectKind === "layer";
  const layerSemantics = isLayer
    ? resolveLayerSemantics(naming, candidate)
    : { confirmed: true, errors: [] };
  const semanticStatus =
    syntaxStatus !== "valid"
      ? "unresolved"
      : !layerSemantics.confirmed
        ? "unresolved"
        : "confirmed";
  const semanticDiagnostics = layerSemantics.errors.map((error) => error.code);

  return {
    status: "observed",
    object_kind: candidate.objectKind,
    name: candidate.name,
    syntax_status: syntaxStatus,
    semantic_status: semanticStatus,
    diagnostics: [...new Set([...diagnostics, ...semanticDiagnostics])].sort(),
    rename_proposal: null,
  };
}
