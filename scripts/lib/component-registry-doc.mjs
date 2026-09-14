import { resolveAssetContract } from "./assets-foundation.mjs";
import {
  collectComponentReferences,
  deriveComponentRenderType,
  resolveComponentFoundationReference,
  walkComponentElements,
} from "./component-registry.mjs";
import { SystemValidationError } from "./diagnostics.mjs";

const SECTION_DEFINITIONS = Object.freeze([
  Object.freeze({ id: "identity-and-purpose", title: "Identity and purpose" }),
  Object.freeze({ id: "structure-and-rendering", title: "Structure and rendering" }),
  Object.freeze({ id: "desktop", title: "Desktop" }),
  Object.freeze({ id: "mobile", title: "Mobile" }),
  Object.freeze({ id: "properties-and-variants", title: "Properties and variants" }),
  Object.freeze({ id: "assets-and-interaction", title: "Assets and interaction" }),
  Object.freeze({ id: "constraints-and-dependencies", title: "Constraints and dependencies" }),
]);

function registryDocError(code, path, message) {
  return new SystemValidationError(code, path, message);
}

function inlineCode(value) {
  const text = String(value);
  const longest = Math.max(0, ...(text.match(/`+/gu) ?? []).map((item) => item.length));
  const fence = "`".repeat(longest + 1);
  return `${fence}${text}${fence}`;
}

function oneLine(value) {
  return String(value).replace(/\r\n?/gu, "\n").replaceAll("\n", " ").trim();
}

function formatUnit(value, unit) {
  return `${String(value)}${unit === "percent" ? "%" : unit}`;
}

function formatTypographyMeasure(measure) {
  return formatUnit(measure?.value, measure?.unit);
}

function formatProvenance(provenance) {
  if (!provenance) {
    return "";
  }
  if (provenance.kind === "registry-literal") {
    return "";
  }
  if (provenance.kind === "figma-literal") {
    return `${inlineCode(provenance.kind)} at ${inlineCode(provenance.node_id)}`;
  }
  const details = [
    `${inlineCode(provenance.kind)} at ${inlineCode(provenance.node_id)}`,
  ];
  if (provenance.binding_name) {
    details.push(`binding ${inlineCode(provenance.binding_name)}`);
  }
  if (provenance.style_name) {
    details.push(`style ${inlineCode(provenance.style_name)}`);
  }
  return details.join("; ");
}

function propertyLabel(record, propertyId) {
  const property = (record?.properties ?? []).find((item) => item.id === propertyId);
  return property
    ? `${inlineCode(property.id)} (${inlineCode(property.figma_name)})`
    : inlineCode(propertyId);
}

function componentLabel(index, componentId) {
  const component = index?.bySystemId?.get(componentId);
  return component
    ? `${inlineCode(componentId)} (${inlineCode(component.identity.figma_name)})`
    : inlineCode(componentId);
}

function formatFactValue(value, { record, index, foundations, viewport, path }) {
  switch (value?.type) {
    case "string":
    case "keyword":
    case "color":
      return inlineCode(value.value);
    case "boolean":
    case "integer":
    case "number":
      return inlineCode(value.value);
    case "measure":
      return inlineCode(formatUnit(value.value, value.unit));
    case "dimensions":
      return inlineCode(`${value.width}×${value.height}${value.unit}`);
    case "ratio":
      return inlineCode(`${value.width}:${value.height}`);
    case "foundation-reference":
      return resolveFoundationReference(
        {
          foundationId: value.foundation_id,
          group: value.definition_group,
          id: value.definition_id,
          viewport,
          path,
        },
        foundations,
      );
    case "component-reference":
      return `component ${componentLabel(index, value.component_id)}`;
    case "property-reference":
      return `property ${propertyLabel(record, value.property_id)}`;
    case "asset-reference":
      return `asset ${inlineCode(value.asset_contract_id)}`;
    case "segments":
      return inlineCode(JSON.stringify(value.items));
    default:
      throw registryDocError(
        "COMPONENT_REGISTRY_DOC_UNKNOWN_FACT",
        path,
        `Cannot render fact value type ${String(value?.type)}.`,
      );
  }
}

function elementDepth(path) {
  return (path.match(/\/children\//gu) ?? []).length;
}

function renderViewport(record, viewport, index) {
  const lines = [];
  walkComponentElements(record, (entry) => {
    if (entry.viewport !== viewport) {
      return;
    }
    const { element, path } = entry;
    const indent = "  ".repeat(elementDepth(path));
    let line =
      `${indent}- ${inlineCode(element.id)} — role ${inlineCode(element.semantic_role)}; ` +
      `render ${inlineCode(element.render_mode)}; visibility `;

    if (element.visibility.mode === "property") {
      line += `property ${propertyLabel(record, element.visibility.property_id)}`;
    } else if (element.visibility.mode === "variant-axis") {
      line += `variant ${inlineCode(`${element.visibility.axis}=${element.visibility.value}`)}`;
    } else {
      line += inlineCode("always");
    }
    if (element.component_id) {
      line += `; component ${componentLabel(index, element.component_id)}`;
    }
    if (element.asset_contract_id) {
      line += `; asset ${inlineCode(element.asset_contract_id)}`;
    }
    lines.push(line);

    (element.facts ?? []).forEach((fact, factIndex) => {
      const factPath = `${path}/facts/${factIndex}/value`;
      const renderedValue = formatFactValue(fact.value, {
        record,
        index,
        foundations: index?.foundations,
        viewport,
        path: factPath,
      });
      const provenance = formatProvenance(fact.provenance);
      lines.push(
        `${indent}  - Fact ${inlineCode(fact.id)}: ${renderedValue}` +
          (provenance ? `; provenance: ${provenance}` : ""),
      );
    });
  });
  return lines.length > 0 ? lines : ["- No contract."];
}

function formatDefault(value) {
  if (typeof value === "string") {
    return inlineCode(JSON.stringify(value));
  }
  return inlineCode(value === null ? "null" : value);
}

function renderPropertiesAndVariants(record) {
  const lines = [];
  for (const variant of record.variants ?? []) {
    const axes = (variant.axes ?? [])
      .map((axis) => inlineCode(`${axis.name}=${axis.value}`))
      .join(", ");
    lines.push(
      `- Variant ${inlineCode(variant.id)} — Figma node ${inlineCode(variant.node_id)}` +
        (axes ? `; axes: ${axes}` : ""),
    );
  }
  for (const source of record.contracts?.source_variants ?? []) {
    const axes = source.axes.map((axis) => `${axis.name}=${axis.value}`).join(", ");
    lines.push(`- Direct Figma source: ${inlineCode(source.variant_node_id)}${axes ? `; ${inlineCode(axes)}` : ""}; reference frame ${source.source_node.reference_dimensions.width}×${source.source_node.reference_dimensions.height}px`);
  }
  for (const property of record.properties ?? []) {
    lines.push(
      `- Property ${propertyLabel(record, property.id)} — ${inlineCode(property.type)}; default ${formatDefault(property.default)}`,
    );
  }
  return lines;
}

function renderAssetContract(asset, foundations) {
  if (!foundations?.assets) {
    throw registryDocError(
      "COMPONENT_REGISTRY_DOC_FOUNDATIONS_REQUIRED",
      `/asset_contracts/${asset.id}`,
      "Assets foundation is required to render a resolved asset contract.",
    );
  }
  const resolved = resolveAssetContract(foundations.assets, {
    sourceModeId: asset.source_mode_id,
    displayModeId: asset.display_mode_id,
    exportProfileId: asset.export_profile_id,
    expectedAlphaId: asset.alpha_mode_id,
    clippingPolicyId: asset.clipping_policy_id,
  });
  const profile = resolved.export_profile.contract;
  return [
    `- Asset contract: ${inlineCode(asset.id)}`,
    `  - Owner layer: ${inlineCode(asset.owner_layer_name)}`,
    `  - Source viewport: ${inlineCode(asset.source_viewport)}`,
    `  - Source mode: ${inlineCode(asset.source_mode_id)}`,
    `  - Display mode: ${inlineCode(asset.display_mode_id)}`,
    `  - Export profile: ${inlineCode(asset.export_profile_id)} — ${profile.format}, ${inlineCode(profile.extension)}, scale ${profile.scale}, suffix ${inlineCode(profile.suffix)}, ${profile.color_space}`,
    `  - Alpha: ${inlineCode(asset.alpha_mode_id)} — ${inlineCode(resolved.expected_alpha.contract.expectation)}`,
    `  - Clipping: ${inlineCode(asset.clipping_policy_id)}`,
    `  - Export boundary: ${inlineCode(asset.export_boundary.kind)} ${inlineCode(asset.export_boundary.semantic_node_name)}`,
    `  - Pixel dimensions: ${asset.pixel_dimensions.width}×${asset.pixel_dimensions.height}${asset.pixel_dimensions.unit}`,
    ...(asset.figma_raw_source_dimensions ? [`  - Raw Figma Fill dimensions: ${asset.figma_raw_source_dimensions.width}×${asset.figma_raw_source_dimensions.height}${asset.figma_raw_source_dimensions.unit}`] : []),
    `  - Aspect ratio: ${asset.aspect_ratio.width}:${asset.aspect_ratio.height}`,
    `  - Crop: ${inlineCode(asset.crop.mode)}; position ${inlineCode(asset.crop.position_source)}`,
    `  - Background: own fill ${inlineCode(asset.background.own_visible_boundary_fill)}; artificial matte ${inlineCode(asset.background.artificial_matte)}`,
  ];
}

function renderAssetsAndInteraction(record, index) {
  const lines = [];
  for (const asset of record.asset_contracts ?? []) {
    lines.push(...renderAssetContract(asset, index?.foundations));
  }
  walkComponentElements(record, ({ viewport, element, path }) => {
    if (["direct-image", "background-image"].includes(element.render_mode)) {
      lines.push(
        `- Asset usage: ${inlineCode(viewport)} ${inlineCode(path)} → ${inlineCode(element.asset_contract_id)} as ${inlineCode(element.render_mode)}`,
      );
    }
    if (element.render_mode === "html-link") {
      lines.push(`- Link: ${inlineCode(viewport)} ${inlineCode(path)}`);
    }
  });
  return lines;
}

function renderConstraintsAndDependencies(record, index) {
  const lines = [];
  const selectedCritical = new Set(
    record?.documentation?.critical_constraint_ids ?? [],
  );
  for (const constraint of record.constraints ?? []) {
    const marker = selectedCritical.has(constraint.id) ? "; Description critical" : "";
    lines.push(
      `- Constraint ${inlineCode(constraint.id)} — scope ${inlineCode(constraint.scope)}; kind ${inlineCode(constraint.kind)}; severity ${inlineCode(constraint.severity)}${marker}: ${oneLine(constraint.statement)}`,
    );
  }
  for (const reference of collectComponentReferences(record).components) {
    lines.push(
      `- Dependency: ${inlineCode(reference.path)} → component ${componentLabel(index, reference.id)}`,
    );
  }
  return lines;
}

function hasAssetsOrInteraction(record) {
  if ((record.asset_contracts ?? []).length > 0) {
    return true;
  }
  let found = false;
  walkComponentElements(record, ({ element }) => {
    found ||= ["direct-image", "background-image", "html-link"].includes(
      element.render_mode,
    );
  });
  return found;
}

function hasConstraintsOrDependencies(record) {
  return (
    (record.constraints ?? []).length > 0 ||
    collectComponentReferences(record).components.length > 0
  );
}

export function listComponentDocumentationSections(record) {
  const optional = {
    "properties-and-variants":
      (record.variants ?? []).length > 0 || (record.properties ?? []).length > 0,
    "assets-and-interaction": hasAssetsOrInteraction(record),
    "constraints-and-dependencies": hasConstraintsOrDependencies(record),
  };
  return SECTION_DEFINITIONS.filter(
    (section) => optional[section.id] ?? true,
  ).map((section) => ({ ...section }));
}

export function resolveFoundationReference(reference, foundations) {
  const resolved = resolveComponentFoundationReference(reference, foundations);
  const stableId = inlineCode(
    `${resolved.foundationId}/${resolved.group}/${resolved.id}`,
  );
  if (resolved.foundationId === "spacing") {
    return `${stableId} = ${inlineCode(`${resolved.valuePx}px`)}`;
  }

  const style = resolved.definition;
  return (
    `${stableId} = ${inlineCode(style.figma_name)} ` +
    `(${style.font.family} ${style.font.css_weight}, ${style.font_size_px}px, ` +
    `line-height ${formatTypographyMeasure(style.line_height)}, ` +
    `letter-spacing ${formatTypographyMeasure(style.letter_spacing)})`
  );
}

function renderSection(record, index, sectionId) {
  switch (sectionId) {
    case "identity-and-purpose":
      return [
        `- CUPIS ID: ${inlineCode(record.id)}`,
        `- Status: ${inlineCode(record.status)}`,
        `- Library: ${inlineCode(record.identity.library)}`,
        `- Semantic role: ${inlineCode(record.identity.semantic_role)}`,
        `- Category: ${inlineCode(record.identity.category)}`,
        `- Figma: ${inlineCode(`${record.figma.file_key}#${record.figma.node_id}`)} (${inlineCode(record.identity.node_kind)})`,
        `- Source root: ${inlineCode(record.figma.source_root_node_id)}`,
        `- Verified: ${inlineCode(record.figma.verified_at)}`,
        ...(record.figma.verification ? [`- Figma source check: ${inlineCode(record.figma.verification.status)} on ${inlineCode(record.figma.verification.checked_at)}; ${oneLine(record.figma.verification.reason)}`] : []),
        `- Structure fingerprint: ${inlineCode(record.figma.structure_fingerprint)}`,
        `- Purpose: ${oneLine(record.documentation.purpose)}`,
      ];
    case "structure-and-rendering": {
      const renderType = deriveComponentRenderType(record);
      if (renderType === null) {
        throw registryDocError(
          "COMPONENT_RENDER_TYPE_UNRESOLVED",
          "/contracts",
          `Cannot render registry documentation for ${record.id} with an unresolved type.`,
        );
      }
      return [
        `- Render type: ${inlineCode(renderType)}`,
        `- Desktop root: ${inlineCode(record.contracts.desktop.root.id)} — ${inlineCode(record.contracts.desktop.root.render_mode)}`,
        `- Mobile root: ${inlineCode(record.contracts.mobile.root.id)} — ${inlineCode(record.contracts.mobile.root.render_mode)}`,
        ...(record.figma.verification ? ["- The direct Figma source is recorded separately; the Mobile/Desktop HTML trees remain a migration draft, not a verified build input."] : []),
      ];
    }
    case "desktop":
      return renderViewport(record, "desktop", index);
    case "mobile":
      return renderViewport(record, "mobile", index);
    case "properties-and-variants":
      return renderPropertiesAndVariants(record);
    case "assets-and-interaction":
      return renderAssetsAndInteraction(record, index);
    case "constraints-and-dependencies":
      return renderConstraintsAndDependencies(record, index);
    default:
      throw registryDocError(
        "COMPONENT_REGISTRY_DOC_UNKNOWN_SECTION",
        "/sections",
        `Unknown component documentation section: ${sectionId}.`,
      );
  }
}

export function renderComponentRegistrySection(record, index) {
  const lines = [`## ${record.identity.figma_name}`, ""];
  for (const section of listComponentDocumentationSections(record)) {
    lines.push(`### ${section.title}`, "");
    lines.push(...renderSection(record, index, section.id), "");
  }
  return `${lines.slice(0, -1).join("\n")}\n`;
}
