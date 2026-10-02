// Run through Figma MCP use_figma, not through Node or the Figma web UI.
// Scalar diagnostics: captureFigmaContractFacts("exact-component-node-id").
// Fresh evidence: supply { session_nonce, request_nonce, canonical_git_sha } from the host request.
async function captureFigmaContractFacts(componentNodeId, request) {
  // Validate and copy the host challenge BEFORE reading nodes or API settings.
  const keys = ["session_nonce", "request_nonce", "canonical_git_sha"];
  let requestContext = null;
  if (request !== undefined) {
    const validHex = (value, length) => typeof value === "string" && value.length === length && /^[a-f0-9]+$/u.test(value);
    if (!request || typeof request !== "object" || Array.isArray(request) || keys.some(key => !Object.hasOwn(request, key)) ||
        Object.keys(request).some(key => !keys.includes(key)) || !validHex(request.session_nonce, 64) ||
        !validHex(request.request_nonce, 64) || !validHex(request.canonical_git_sha, 40)) {
      const error = new Error("Evidence request requires exact session/request nonces and canonical SHA.");
      error.code = "EVIDENCE_REQUEST_IDENTITY_MISMATCH";
      throw error;
    }
    requestContext = { session_nonce: request.session_nonce, request_nonce: request.request_nonce, canonical_git_sha: request.canonical_git_sha };
  }
  const startedAt = new Date().toISOString();
  const previousSkip = figma.skipInvisibleInstanceChildren;
  try {
    // Dev Mode may hide invisible instance descendants from children entirely.
    // This is an API traversal setting, not a mutation of the design.
    figma.skipInvisibleInstanceChildren = false;
    const packet = await captureFigmaContractFactsBody(componentNodeId);
    const pending = packet.variants.map((variant) => variant.source_node);
    let nodeCount = 0;
    while (pending.length) {
      const node = pending.pop();
      nodeCount += 1;
      for (const child of node.children ?? []) pending.push(child);
    }
    return {
      ...packet,
      capture_version: requestContext ? "1.2.0" : packet.capture_version,
      capture_meta: {
        started_at: startedAt, completed_at: new Date().toISOString(),
        tree_complete: packet.variants.length > 0, node_count: nodeCount,
        ...(requestContext ? { request: requestContext } : {}),
      },
    };
  } finally {
    figma.skipInvisibleInstanceChildren = previousSkip;
  }
}

// A failed traversal throws, so no partially collected tree gets certified.
// node_count counts serialized variant roots and descendants, not the set wrapper.
async function captureFigmaContractFactsBody(componentNodeId) {
  const component = await figma.getNodeByIdAsync(componentNodeId);
  if (!component || !["COMPONENT_SET", "COMPONENT"].includes(component.type)) {
    return {
      capture_version: "1.1.0",
      file_key: figma.fileKey,
      component_node_id: componentNodeId,
      variants: [],
      capture_errors: [{ node_id: componentNodeId, code: "COMPONENT_NOT_FOUND" }],
    };
  }

  const errors = [];
  const rgb = (value) => "#" + [value.r, value.g, value.b]
    .map((channel) => Math.round(channel * 255).toString(16).padStart(2, "0"))
    .join("").toUpperCase();
  const rgba = (value) => ({ color: rgb(value), alpha: value.a });
  const mixed = (value, nodeId, field) => {
    if (value === figma.mixed) {
      errors.push({ node_id: nodeId, code: "MIXED_VALUE", field });
      return null;
    }
    return value;
  };
  const paints = (list, nodeId) => list.map((paint, index) => {
    const result = {
      type: paint.type.toLowerCase(),
      visible: paint.visible !== false,
      opacity: paint.opacity ?? 1,
    };
    if (paint.type === "SOLID") {
      result.color = rgb(paint.color);
    } else if (paint.type.startsWith("GRADIENT_")) {
      result.gradient_stops = paint.gradientStops.map((stop) => ({
        position: stop.position,
        ...rgba(stop.color),
      }));
      // Existing fact links use stops; keep the original v1 field too.
      result.stops = result.gradient_stops;
      result.gradient_transform = paint.gradientTransform;
    } else if (paint.type === "IMAGE") {
      result.image_hash = paint.imageHash;
      result.scale_mode = paint.scaleMode;
      if ("imageTransform" in paint) result.image_transform = paint.imageTransform;
      if ("scalingFactor" in paint) result.scaling_factor = paint.scalingFactor;
      if ("rotation" in paint) result.rotation = paint.rotation;
      if ("filters" in paint) result.filters = paint.filters;
    } else {
      errors.push({ node_id: nodeId, code: "PAINT_UNSUPPORTED", index, type: paint.type });
    }
    return result;
  });
  const binding = (value) => {
    if (Array.isArray(value)) return value.map(binding);
    if (!value || typeof value !== "object") return value;
    if (value.type === "VARIABLE_ALIAS" && typeof value.id === "string") {
      return { id: value.id };
    }
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, binding(item)]));
  };

  const textStyles = new Map();
  async function textStyleName(styleId, nodeId) {
    // Empty means unlinked; null comes from an explicitly reported mixed ID.
    if (styleId === "" || styleId === null) return null;
    if (typeof styleId !== "string") {
      errors.push({ node_id: nodeId, code: "TEXT_STYLE_UNRESOLVED" });
      return null;
    }
    if (!textStyles.has(styleId)) {
      try {
        const style = await figma.getStyleByIdAsync(styleId);
        textStyles.set(styleId, style?.type === "TEXT" &&
          style.id === styleId && typeof style.name === "string"
          ? { name: style.name }
          : { error: "TEXT_STYLE_UNRESOLVED" });
      } catch {
        textStyles.set(styleId, { error: "TEXT_STYLE_LOOKUP_FAILED" });
      }
    }
    const result = textStyles.get(styleId);
    if (result.error) {
      errors.push({ node_id: nodeId, code: result.error, style_id: styleId });
      return null;
    }
    return result.name;
  }

  async function serialize(node) {
    const result = {
      node_id: node.id,
      name: node.name,
      node_type: node.type,
      visible: node.visible,
      reference_dimensions: { width: node.width, height: node.height, unit: "px" },
    };

    // Remote publication identity is evidence metadata, never export geometry.
    if (node.type === "COMPONENT") {
      try {
        if (node.remote === true) {
          const key = node.key;
          if (typeof key === "string" && key.trim()) result.remote_source = { remote: true, component_key: key };
          else errors.push({ node_id: node.id, code: "REMOTE_SOURCE_UNRESOLVED" });
        }
      } catch { errors.push({ node_id: node.id, code: "REMOTE_SOURCE_UNRESOLVED" }); }
    }

    if ("layoutMode" in node) {
      result.layout = {
        mode: node.layoutMode,
        horizontal_sizing: node.layoutSizingHorizontal,
        vertical_sizing: node.layoutSizingVertical,
        primary_axis_sizing: node.primaryAxisSizingMode,
        counter_axis_sizing: node.counterAxisSizingMode,
        item_spacing: node.itemSpacing,
        counter_axis_spacing: node.counterAxisSpacing,
        wrap: node.layoutWrap,
        primary_axis_alignment: node.primaryAxisAlignItems,
        counter_axis_alignment: node.counterAxisAlignItems,
        padding: {
          top: node.paddingTop, right: node.paddingRight,
          bottom: node.paddingBottom, left: node.paddingLeft,
        },
      };
      if (node.layoutMode === "NONE" && node.children.length > 0) {
        errors.push({ node_id: node.id, code: "ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW" });
      }
    }
    if ("minWidth" in node) result.minimum_width_px = node.minWidth;
    if ("layoutAlign" in node) result.layout_align = node.layoutAlign;
    if ("layoutGrow" in node) result.layout_grow = node.layoutGrow;
    if ("layoutPositioning" in node) result.layout_positioning = node.layoutPositioning;
    if ("clipsContent" in node) result.clips_content = node.clipsContent;
    if ("cornerRadius" in node) result.corner_radius = mixed(node.cornerRadius, node.id, "cornerRadius");
    if ("topLeftRadius" in node) result.corner_radii = {
      top_left: node.topLeftRadius, top_right: node.topRightRadius,
      bottom_right: node.bottomRightRadius, bottom_left: node.bottomLeftRadius,
    };
    if ("fills" in node) result.fills = paints(mixed(node.fills, node.id, "fills") ?? [], node.id);
    if ("strokes" in node) result.strokes = paints(mixed(node.strokes, node.id, "strokes") ?? [], node.id);
    if (result.strokes?.length > 0 && "strokeWeight" in node) result.stroke_weight = mixed(node.strokeWeight, node.id, "strokeWeight");
    if (result.strokes?.length > 0 && "strokeAlign" in node) result.stroke_align = node.strokeAlign;
    if ("opacity" in node) result.opacity = node.opacity;
    if ("rotation" in node) result.rotation = node.rotation;
    if ("boundVariables" in node && node.boundVariables) {
      result.variable_bindings = binding(node.boundVariables);
    }
    if ("componentPropertyReferences" in node && node.componentPropertyReferences) {
      result.component_property_references = node.componentPropertyReferences;
    }
    if (node.type === "INSTANCE") {
      result.instance_properties = binding(node.componentProperties);
      result.main_component_id = null;
      try {
        const main = await node.getMainComponentAsync();
        if (main?.type === "COMPONENT" && typeof main.id === "string" && main.id) {
          result.main_component_id = main.id;
        }
      } catch {
        // Keep the instance and its actual children; never guess its source.
      }
      if (result.main_component_id === null) {
        errors.push({ node_id: node.id, code: "MAIN_COMPONENT_UNRESOLVED" });
      }
    }
    if (node.type === "TEXT") {
      result.characters = node.characters;
      const styleId = mixed(node.textStyleId, node.id, "textStyleId");
      const weight = mixed(node.fontWeight, node.id, "fontWeight");
      if (node.fontWeight !== figma.mixed && !Number.isFinite(weight)) {
        errors.push({ node_id: node.id, code: "FONT_WEIGHT_UNAVAILABLE", field: "fontWeight" });
      }
      result.text_geometry = {
        auto_resize: node.textAutoResize,
        vertical_alignment: node.textAlignVertical,
      };
      result.text_style = {
        font_family: mixed(node.fontName, node.id, "fontName")?.family ?? null,
        font_style: mixed(node.fontName, node.id, "fontName")?.style ?? null,
        font_size_px: mixed(node.fontSize, node.id, "fontSize"),
        font_weight: Number.isFinite(weight) ? weight : null,
        line_height: mixed(node.lineHeight, node.id, "lineHeight"),
        letter_spacing: mixed(node.letterSpacing, node.id, "letterSpacing"),
        horizontal_alignment: node.textAlignHorizontal,
        vertical_alignment: node.textAlignVertical,
        text_case: mixed(node.textCase, node.id, "textCase"),
        text_decoration: mixed(node.textDecoration, node.id, "textDecoration"),
        text_auto_resize: node.textAutoResize,
        figma_style_id: styleId ?? null,
        figma_style_name: await textStyleName(styleId, node.id),
      };
      if (["fontName", "fontSize", "lineHeight", "fills", "textDecoration"].some(
        (field) => node[field] === figma.mixed
      )) {
        result.styled_text_segments = node.getStyledTextSegments([
          "fontName", "fontSize", "lineHeight", "fills", "textDecoration",
        ]).map((segment) => ({
          start: segment.start, end: segment.end, characters: segment.characters,
          font_family: segment.fontName.family, font_style: segment.fontName.style,
          font_size_px: segment.fontSize, line_height: segment.lineHeight,
          text_decoration: segment.textDecoration,
          fills: paints(segment.fills, node.id),
        }));
      }
    }
    if ("effects" in node && node.effects.length > 0) {
      const active = node.effects.filter((effect) => effect.visible !== false);
      if (active.length > 0) result.effects = active.map((effect, index) => {
        const captured = { type: effect.type, visible: true };
        if (["DROP_SHADOW", "INNER_SHADOW"].includes(effect.type)) {
          captured.color = rgba(effect.color);
          captured.radius = effect.radius;
          captured.offset = { x: effect.offset.x, y: effect.offset.y };
          captured.spread = effect.spread ?? 0;
          captured.blend_mode = effect.blendMode;
          captured.show_shadow_behind_node = effect.showShadowBehindNode ?? false;
        } else if (["LAYER_BLUR", "BACKGROUND_BLUR"].includes(effect.type)) {
          captured.radius = effect.radius;
        } else {
          errors.push({ node_id: node.id, code: "EFFECT_UNSUPPORTED", index, type: effect.type });
        }
        return captured;
      });
    }
    if ("children" in node) {
      result.children = [];
      for (const child of node.children) result.children.push(await serialize(child));
    }
    return result;
  }

  const variantNodes = component.type === "COMPONENT_SET"
    ? component.children.filter((child) => child.type === "COMPONENT")
    : [component];
  const variants = [];
  for (const variant of variantNodes) {
    const axes = variant.type === "COMPONENT" && variant.parent?.type === "COMPONENT_SET"
      ? Object.entries(variant.variantProperties ?? {}).map(([name, value]) => ({ name, value }))
      : [];
    variants.push({
      variant_node_id: variant.id,
      axes,
      source_node: await serialize(variant),
    });
  }
  const owner = component.type === "COMPONENT_SET" ? component : component.parent?.type === "COMPONENT_SET" ? component.parent : component;
  const componentProperties = Object.entries(owner.componentPropertyDefinitions ?? {})
    .map(([name, definition]) => ({
      name: name.replace(/#\d+:\d+$/, ""),
      type: definition.type,
      default: definition.defaultValue ?? null,
      variant_options: definition.variantOptions ?? null,
    }));
  return {
    capture_version: "1.1.0",
    file_key: figma.fileKey,
    component_node_id: component.id,
    component_properties: componentProperties,
    variants,
    capture_errors: errors,
  };
}
