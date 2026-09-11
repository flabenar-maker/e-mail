import {
  canonicalize,
  digestStructuredEntries,
} from "./content-digest.mjs";
import { SystemValidationError } from "./diagnostics.mjs";

const VIEWPORTS = ["mobile", "desktop"];

function diagnostic(code, path, message) {
  return new SystemValidationError(code, path, message);
}

function withoutProvenance(value) {
  if (Array.isArray(value)) return value.map(withoutProvenance);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !["provenance", "verified_at"].includes(key))
      .map(([key, child]) => [key, withoutProvenance(child)]),
  );
}

function projectVariants(variants = []) {
  return variants.map((variant) => ({
    id: variant.id,
    axes: structuredClone(variant.axes ?? []),
  }));
}

function projectProperties(properties = []) {
  return properties.map((property) => ({
    id: property.id,
    type: property.type,
    default: structuredClone(property.default),
  }));
}

function projectCoverage(coverage = {}) {
  return Object.fromEntries(
    ["component_id", "mode", "recipe_id", "handler_id"]
      .filter((key) => Object.hasOwn(coverage, key))
      .map((key) => [key, structuredClone(coverage[key])]),
  );
}

function walkElements(element, viewport, path, visit) {
  if (!element) return;
  visit(element, viewport, path);
  (element.children ?? []).forEach((child, index) => {
    walkElements(child, viewport, path + "/children/" + index, visit);
  });
}

function typographyProjection(style) {
  return {
    id: style.id,
    viewport: style.viewport,
    role: style.role,
    variant: style.variant,
    font: style.font
      ? { family: style.font.family, css_weight: style.font.css_weight }
      : null,
    font_size_px: style.font_size_px,
    line_height: structuredClone(style.line_height),
    letter_spacing: structuredClone(style.letter_spacing),
  };
}

function spacingProjection(role, viewport) {
  const valuePx =
    role.resolutions?.[viewport]?.value_px ?? role.values?.[viewport];
  if (!Number.isFinite(valuePx)) return null;
  return { id: role.id, viewport, value_px: valuePx };
}

function resolveFoundationReference(reference, viewport, foundations, path) {
  const definitions =
    foundations?.[reference.foundation_id]?.[reference.definition_group];
  const definition = Array.isArray(definitions)
    ? definitions.find((item) => item.id === reference.definition_id)
    : null;
  if (!definition) {
    throw diagnostic(
      "RENDER_IMPACT_FOUNDATION_UNRESOLVED",
      path,
      "Cannot resolve " +
        reference.foundation_id +
        "/" +
        reference.definition_group +
        "/" +
        reference.definition_id +
        ".",
    );
  }

  let resolved;
  if (
    reference.foundation_id === "typography" &&
    reference.definition_group === "styles"
  ) {
    resolved = typographyProjection(definition);
  } else if (
    reference.foundation_id === "spacing" &&
    reference.definition_group === "roles"
  ) {
    resolved = spacingProjection(definition, viewport);
  } else {
    resolved = withoutProvenance(definition);
  }
  if (!resolved) {
    throw diagnostic(
      "RENDER_IMPACT_FOUNDATION_UNRESOLVED",
      path,
      "Foundation reference has no exact " + viewport + " value.",
    );
  }

  return {
    foundation_id: reference.foundation_id,
    definition_group: reference.definition_group,
    definition_id: reference.definition_id,
    viewport,
    resolved,
  };
}

function resolvedFoundationProjection(component, foundations) {
  const entries = new Map();
  for (const viewport of VIEWPORTS) {
    walkElements(
      component?.contracts?.[viewport]?.root,
      viewport,
      "/contracts/" + viewport + "/root",
      (element, currentViewport, elementPath) => {
        (element.facts ?? []).forEach((fact, index) => {
          const reference = fact.value;
          if (reference?.type !== "foundation-reference") return;
          const resolved = resolveFoundationReference(
            reference,
            currentViewport,
            foundations,
            elementPath + "/facts/" + index + "/value",
          );
          const key =
            resolved.foundation_id +
            "/" +
            resolved.definition_group +
            "/" +
            resolved.definition_id +
            "/" +
            resolved.viewport;
          entries.set(key, resolved);
        });
      },
    );
  }
  return [...entries.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => value);
}

function renderingFoundationProjection(component, foundations) {
  const rendering = foundations?.rendering;
  if (!rendering) return null;
  const mobile = component?.contracts?.mobile?.root;
  const desktop = component?.contracts?.desktop?.root;
  const usesResponsiveSplit = canonicalize(mobile) !== canonicalize(desktop);
  const breakpoint = usesResponsiveSplit
    ? (rendering.breakpoints ?? []).find((item) => item.id === "cupis-mobile")
    : null;
  return {
    ...(breakpoint ? { breakpoint: withoutProvenance(breakpoint) } : {}),
    postprocessing: withoutProvenance(rendering.postprocessing ?? {}),
  };
}

export function buildRenderImpactProjection({
  component,
  coverage,
  foundations = {},
}) {
  if (!component?.id) {
    throw diagnostic(
      "RENDER_IMPACT_COMPONENT_INVALID",
      "/component",
      "A component with a stable id is required.",
    );
  }
  if (coverage?.component_id !== component.id) {
    throw diagnostic(
      "RENDER_IMPACT_COVERAGE_MISMATCH",
      "/coverage/component_id",
      "Renderer coverage must match " + component.id + ".",
    );
  }

  const projection = {
    component_id: component.id,
    variants: projectVariants(component.variants),
    properties: projectProperties(component.properties),
    asset_contracts: withoutProvenance(component.asset_contracts ?? []),
    contracts: withoutProvenance(component.contracts ?? {}),
    coverage: projectCoverage(coverage),
    resolved_foundations: resolvedFoundationProjection(component, foundations),
  };
  const rendering = renderingFoundationProjection(component, foundations);
  if (rendering) projection.rendering = rendering;
  return structuredClone(projection);
}

export function digestRenderImpact(input) {
  return digestStructuredEntries([
    { path: "render-impact", value: structuredClone(input) },
  ]);
}
