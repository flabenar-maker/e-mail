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
    validateLayer(naming, candidate, errors);
  } else if (candidate.objectKind === "property") {
    validateProperty(naming, candidate, errors);
  } else if (candidate.objectKind === "asset-owner") {
    validateAssetOwner(naming, candidate, errors);
  } else {
    validateOrganizational(candidate, errors);
  }

  return sortDiagnostics(errors);
}
