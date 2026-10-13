import { applyOutputLink } from "./email-service-fragments.mjs";
import { findGreetingRule, greetingValue, matchesTemplateTarget, renderStyledGreeting } from "./email-template-rules.mjs";
import { createViewportRules } from "./email-emission-profile.mjs";
import { renderPrimitive } from "./email-primitives.mjs";

function clone(value) {
  return value === undefined ? undefined : structuredClone(value);
}

function structureOf(element) {
  return {
    id: element?.id ?? null,
    semantic_role: element?.semantic_role ?? null,
    render_mode: element?.render_mode ?? null,
    visibility: element?.visibility ?? null,
    component_id: element?.component_id ?? null,
    asset_contract_id: element?.asset_contract_id ?? null,
    content_slots: element?.content_slots ?? [],
    action: element?.action ?? null,
  };
}

function pairNodes(mobile, desktop) {
  if (
    !mobile ||
    !desktop ||
    JSON.stringify(structureOf(mobile)) !== JSON.stringify(structureOf(desktop))
  ) {
    return { kind: "split", mobile: clone(mobile), desktop: clone(desktop), children: [] };
  }

  const count = Math.max(mobile.children?.length ?? 0, desktop.children?.length ?? 0);
  const children = Array.from({ length: count }, (_, index) =>
    pairNodes(mobile.children?.[index], desktop.children?.[index]),
  );
  return {
    kind: "paired",
    mobile: clone(mobile),
    desktop: clone(desktop),
    children,
  };
}

export function pairViewportTrees({ mobile, desktop }) {
  return pairNodes(mobile, desktop);
}

function diagnostic(code, path, message) {
  return { code, path, message };
}

function sortDiagnostics(items) {
  const unique = new Map();
  for (const item of items) {
    unique.set(`${item.code}\0${item.path}\0${item.message}`, item);
  }
  return [...unique.values()].sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );
}

function scopedEntry(collection, viewport, id) {
  if (collection?.[viewport] && Object.hasOwn(collection[viewport], id)) {
    return collection[viewport][id];
  }
  const common = collection?.[id];
  if (common && typeof common === "object" && common[viewport]) {
    return { ...common, ...common[viewport], mobile: undefined, desktop: undefined };
  }
  return common;
}

function slotValue(entry, id) {
  const value = entry?.[id];
  return value && typeof value === "object" && Object.hasOwn(value, "value")
    ? value.value
    : value;
}

function resolveProperty(properties, viewport, id) {
  const value = scopedEntry(properties, viewport, id);
  return typeof value === "boolean" ? value : undefined;
}

function valueWithUnit(value) {
  if (value?.type === "measure") return `${value.value}${value.unit === "percent" ? "%" : value.unit}`;
  if (["color", "string", "keyword"].includes(value?.type)) return value.value;
  return undefined;
}

function isIntrinsicLabel(facts = [], { mode, semanticRole } = {}) {
  const fact = (id) => facts.find((item) => item.id === id)?.value;
  const sizing = fact("horizontal-sizing")?.value;
  return mode === "html-text" && semanticRole === "label" &&
    fact("text-auto-resize")?.value === "width_and_height" &&
    (sizing === undefined || sizing === "hug");
}

function propsFromFacts(facts = [], { viewport, mode, isRoot = false, parentAxis, semanticRole } = {}) {
  const props = { style: {} };
  const fact = (id) => facts.find((item) => item.id === id)?.value;
  const size = fact("reference-size");
  const sizing = fact("horizontal-sizing")?.value;
  if (size?.type === "dimensions") {
    if (["direct-image", "background-image"].includes(mode)) {
      props.width = size.width;
      props.height = size.height;
      if (sizing === "fill" && mode === "direct-image") {
        props.fluid = true;
      }
    } else if (mode === "html-text") {
      const expands = viewport === "mobile" && (
        sizing === "fill" ||
        (parentAxis === "vertical" && fact("layout-align")?.value === "stretch") ||
        (parentAxis === "horizontal" && (fact("layout-grow")?.value ?? 0) > 0)
      );
      if (expands) props.style.width = "100%";
      else props.style["max-width"] = `${size.width}px`;
    } else if (mode === "presentation-table" && viewport === "mobile" && semanticRole === "block") {
      // A block fills its email slot even when its standalone Figma root hugs content.
      props.width = "100%";
    } else if (mode === "presentation-table" && sizing === "hug") {
      props.width = "auto";
    } else if (isRoot && viewport === "mobile") {
      props.width = "100%";
    } else if (isRoot && viewport === "desktop") {
      props.width = size.width;
    }
  }
  // A native Fill link occupies the same text column in either viewport.
  if (mode === "html-link" && sizing === "fill") {
    props.style.display = "block";
    props.style.width = "100%";
    props.style["overflow-wrap"] = "anywhere";
  }
  // Email-only geometry keeps exported artwork at its actual displayed size.
  const emailSize = fact("email-render-size");
  if (emailSize?.type === "dimensions") {
    props.width = emailSize.width;
    props.height = emailSize.height;
  }

  for (const item of facts) {
    const id = item.id;
    const value = item.value;
    if (value?.type === "dimensions" && id.endsWith("-dimensions")) {
      props.width = value.width;
      props.height = value.height;
      continue;
    }
    if (
      value?.type === "keyword" &&
      ((id.endsWith("width-behavior") && value.value === "fluid-to-container") ||
        (id.endsWith("height-behavior") && value.value === "auto"))
    ) {
      props.fluid = true;
      continue;
    }
    if (id === "font-weight" && value?.type === "number") { props.style["font-weight"] = value.value; continue; }
    if (id === "clip-content" && value?.type === "boolean") { if (value.value) props.style.overflow = "hidden"; continue; }
    const resolved = valueWithUnit(value);
    if (resolved === undefined) continue;
    if (id === "minimum-width") { props.style["min-width"] = resolved; continue; }
    if (id === "font-size" || id.endsWith("-font-size") || id.endsWith("-text-size")) props.style["font-size"] = resolved;
    else if (id === "font-family") props.style["font-family"] = `${resolved},Arial,sans-serif`;
    else if (id === "font-style") {
      const weights = { Thin: 100, ExtraLight: 200, Light: 300, Regular: 400,
        Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800, Black: 900 };
      if (weights[resolved]) props.style["font-weight"] = weights[resolved];
    }
    else if (id === "line-height") props.style["line-height"] = resolved;
    else if (id === "letter-spacing") props.style["letter-spacing"] = value.value === 0 ? "0px" : resolved;
    else if (id === "text-align") props.style["text-align"] = resolved;
    else if (id === "text-decoration") props.style["text-decoration"] = resolved;
    else if (id === "text-color" || id.endsWith("-text-color")) props.style.color = resolved;
    else if (mode !== "direct-image" && (id === "background" || id.endsWith("-background") || id === "background-fallback")) props.style["background-color"] = resolved;
    else if (id === "border-radius" || id.endsWith("-border-radius")) props.style["border-radius"] = resolved;
    else if (/^border-radius-(?:top|bottom)-(?:left|right)$/u.test(id)) {
      const [, , side, corner] = id.split("-");
      props.style[`border-${side}-${corner}-radius`] = resolved;
    }
    else if (mode !== "direct-image" && ["padding-top", "padding-right", "padding-bottom", "padding-left"].includes(id)) props.style[id] = resolved;
    else if (mode !== "direct-image" && id.endsWith("-padding-inline")) {
      props.style["padding-left"] = resolved;
      props.style["padding-right"] = resolved;
    } else if (mode !== "direct-image" && id.endsWith("-padding-block")) {
      props.style["padding-bottom"] = resolved;
      props.style["padding-top"] = resolved;
    } else if (mode !== "direct-image" && id.endsWith("-padding")) props.style.padding = resolved;
    else if (id.endsWith("-width")) props.width = value.value;
    else if (id.endsWith("-height")) props.height = value.value;
  }
  for (const side of ["top", "right", "bottom", "left"]) {
    const override = fact(`email-render-padding-${side}`);
    if (mode !== "direct-image" && override?.type === "measure") {
      props.style[`padding-${side}`] = valueWithUnit(override);
    }
  }
  if (mode === "presentation-table" && semanticRole === "status-container" && fact("vertical-sizing")?.value === "fill" && size?.height > 0) {
    props.width = size.width;
    props.height = size.height;
  }
  if (fact("shape")?.value === "ellipse") {
    props.style["border-radius"] = "50%";
  }
  const gradientStart = fact("background-gradient-start")?.value;
  const gradientEnd = fact("background-gradient-end")?.value;
  const gradientAngle = fact("background-gradient-css-angle-degrees")?.value;
  if (gradientStart && gradientEnd && Number.isFinite(gradientAngle)) {
    props.style["background-image"] = `linear-gradient(${gradientAngle}deg,${gradientStart},${gradientEnd})`;
  }
  return props;
}

function escapeInline(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function richTextFromFacts(element, entry, style, context, viewport) {
  const textOrigin={...element.output_origin,slot_id:"text"};
  const fact = element.facts?.find(({ id }) => id === "styled-text-segments");
  if (!fact) return null;
  const segments = fact.value?.items ?? [];
  const supplied = slotValue(entry, "text");
  const source = element.facts?.find(({ id }) => id === "source-text")?.value?.value;
  if (!Array.isArray(supplied) && supplied !== source) return {html:"",error:"Rich text requires source text or one text run per styled segment."};
  const runs = Array.isArray(supplied) ? supplied : segments.map(({characters}) => characters);
  if (runs.length !== segments.length || runs.some(run => typeof run !== "string")) return {html:"",error:"Rich text run count does not match the exact Figma segments."};
  const span = (segment, value, raw = false, href) => {
    const color=segment.fills?.find(({type,visible})=>type==="solid"&&visible!==false)?.color;
    const decoration=segment.text_decoration==="UNDERLINE"?"underline":"none";
    const weight={Regular:400,Medium:500,SemiBold:600,Bold:700}[segment.font_style];
    const inlineStyle=`color:${color};font-family:${segment.font_family},Arial,sans-serif;font-size:${segment.font_size_px}px;font-weight:${weight};line-height:${segment.line_height.value}${segment.line_height.unit==="PERCENT"?"%":"px"};text-decoration:${decoration}`;
    const text=raw?value:escapeInline(value).replaceAll("\u2028","<br>").replaceAll("\n","<br>");
    return href?`<a href="${escapeInline(href)}" style="${inlineStyle}">${text}</a>`:`<span style="${inlineStyle}">${text}</span>`;
  };
  const fullRule=findGreetingRule({templateRules:context.templateRules,origin:textOrigin});
  if(fullRule) {
    const value=greetingValue({rule:fullRule,origin:textOrigin,previewValues:context.previewValues});
    const body=renderStyledGreeting({text:source,segments,span,previewValue:value===fullRule.emitted_template?undefined:value});
    if(body!==null)return {html:renderPrimitive("text",{style},body),error:null};
  }
  const body=segments.map((segment,index)=>{
    const range={start:segment.start,end:segment.end};
    const rule=findGreetingRule({templateRules:context.templateRules,origin:textOrigin,range});
    const value=rule?greetingValue({rule,origin:textOrigin,range,previewValues:context.previewValues}):runs[index];
    const output=(context.outputBindings??[]).find(binding=>binding.kind==="output-range-link"&&matchesTemplateTarget(binding.target,textOrigin)&&binding.target.range?.start===segment.start&&binding.target.range?.end===segment.end);
    const href=output?.href??slotValue(entry,"help-url")??slotValue(entry,`link-${index+1}-url`);
    if((output||segment.text_decoration==="UNDERLINE")&&!href)return null;
    if(output&&context.anchorContexts?.[viewport])return null;
    return span(segment,value,false,(output||segment.text_decoration==="UNDERLINE")?href:undefined);
  });
  if(body.some(run=>run===null))return {html:"",error:"Inline link has no URL or would create a nested anchor."};
  return {html:renderPrimitive("text",{style},body.join("")),error:null};
}

function emittedSlotText(element,entry,context,slotId="text") {
  const origin={...element.output_origin,slot_id:slotId};
  const rule=findGreetingRule({templateRules:context.templateRules,origin});
  return rule?greetingValue({rule,origin,previewValues:context.previewValues}):slotValue(entry,slotId);
}
function contentFor(context, viewport, element) {
  const entry = scopedEntry(context.content, viewport, element.id) ?? {};
  const diagnostics = [];
  for (const slot of element.content_slots ?? []) {
    if (slot.required && slotValue(entry, slot.id) === undefined) {
      diagnostics.push(
        diagnostic(
          "RENDER_CONTENT_MISSING",
          `/contracts/${viewport}/${context.path}/content_slots/${slot.id}`,
          `Required content is missing for ${element.id}.${slot.id}.`,
        ),
      );
    }
  }
  return { entry, diagnostics };
}


function visibilityFor(element, viewport, context, path) {
  const visibility = element.visibility ?? { mode: "always" };
  if (visibility.mode === "always") return { visible: true, diagnostics: [] };
  if (visibility.mode === "property") {
    const visible = resolveProperty(context.properties, viewport, visibility.property_id);
    return visible === undefined
      ? { visible: false, diagnostics: [diagnostic("RENDER_PROPERTY_UNRESOLVED", `/contracts/${viewport}/${path}/visibility/property_id`, `Property ${visibility.property_id} is not resolved.`)] }
      : { visible, diagnostics: [] };
  }
  if (visibility.mode === "instance") {
    const override = scopedEntry(context.visibility, viewport, element.id);
    if (override !== undefined && typeof override !== "boolean") {
      return { visible: false, diagnostics: [diagnostic("RENDER_INSTANCE_VISIBILITY_INVALID", `/contracts/${viewport}/${path}/visibility`, "Instance visibility override must be boolean.")] };
    }
    return { visible: override ?? visibility.default_visible, diagnostics: [] };
  }
  return { visible: false, diagnostics: [diagnostic("RENDER_VISIBILITY_UNSUPPORTED", `/contracts/${viewport}/${path}/visibility`, `Unsupported visibility mode: ${visibility.mode}.`)] };
}

function actionHref(element, entry) {
  if (!element.action) return undefined;
  return slotValue(entry, element.action.href_slot);
}

function wrapAction(element, entry, html) {
  const href = actionHref(element, entry);
  if (!href || !html) return html;
  return renderPrimitive("link", { href, style: { display: "block", color: "inherit" } }, html);
}

function isWholeButtonAction(element) {
  return element.action?.kind === "whole-element" && (
    element.semantic_role === "button" || element.semantic_role?.endsWith("-button")
  );
}

function inlineActionParts(childHtml, childNodes, gap) {
  const parts = childHtml.flatMap((html, index) => {
    if (!html) return [];
    const nodeFacts = childNodes?.[index]?.facts ?? [];
    const fact = (id) => nodeFacts.find((item) => item.id === id)?.value;
    const hugText = fact("text-auto-resize")?.value === "width_and_height";
    const noWrap = html.includes("white-space:nowrap") || hugText;
    const fixedWidth = fact("horizontal-sizing")?.value === "fixed"
      ? fact("reference-size")?.width
      : undefined;
    return [...html.matchAll(/<img\b[^>]*>|<p\b[^>]*>[\s\S]*?<\/p>/gu)].map((match) => ({
      html: match[0],
      noWrap,
      hugText: match[0].startsWith("<p") && hugText,
      fixedWidth: match[0].startsWith("<p") ? fixedWidth : undefined,
    }));
  });
  if (parts.length === 0) return null;

  return parts.map(({ html, noWrap, hugText, fixedWidth }, index) => {
    const offset = index > 0 && gap > 0 ? "margin-left:" + gap + "px;" : "";
    const whitespace = noWrap ? "white-space:nowrap;" : "";
    const column = Number.isFinite(fixedWidth) ? "width:" + fixedWidth + "px;" : "";
    if (html.startsWith("<img")) {
      return html.replace(/style="([^"]*)"/u, (_match, style) =>
        'style="' + style + ';display:inline-block;vertical-align:middle;' + whitespace + column + offset + '"',
      );
    }
    return html.replace(/^<p([^>]*)>([\s\S]*)<\/p>$/u, (_match, attrs, body) => {
      const style = attrs.match(/\sstyle="([^"]*)"/u);
      const paragraphWhitespace = /(?:^|;)white-space:pre(?:;|$)/u.test(style?.[1] ?? "")
        ? "" : whitespace;
      const textStyle = Number.isFinite(fixedWidth) || hugText
        ? style?.[1].replace(/(?:^|;)max-width:[^;]*/u, "")
        : style?.[1];
      const nextAttrs = style
        ? attrs.replace(style[0], ' style="' + textStyle + ';display:inline-block;vertical-align:middle;' + paragraphWhitespace + column + offset + '"')
        : attrs + ' style="display:inline-block;vertical-align:middle;' + paragraphWhitespace + column + offset + '"';
      return "<span" + nextAttrs + ">" + body + "</span>";
    });
  });
}

function renderWholeButtonAction(element, entry, childHtml, factProps, gap) {
  if (!isWholeButtonAction(element)) return null;

  const href = actionHref(element, entry);
  const parts = inlineActionParts(childHtml, element.children, gap);
  if (!href || !parts) return null;

  const padding = Object.fromEntries(
    Object.entries(factProps.style).filter(([key]) => key === "padding" || key.startsWith("padding-")),
  );
  const style = { ...factProps.style };
  for (const key of Object.keys(padding)) delete style[key];

  const link = renderPrimitive("link", {
    href,
    style: { display: "block", color: "inherit", "text-align": "center", ...padding },
  }, parts.join(""));
  const cell = renderPrimitive("cell", { style: { "text-align": "center" } }, link);
  return renderPrimitive("table", { ...factProps, style }, "<tr>" + cell + "</tr>");
}

function renderShellNative(element, viewport, path, childHtml, context) {
  if (!element) return { html: "", diagnostics: [] };
  const visibility = visibilityFor(element, viewport, context, path);
  if (!visibility.visible) return { html: "", diagnostics: visibility.diagnostics };

  const { entry, diagnostics } = contentFor({ ...context, path }, viewport, element);
  if (diagnostics.length > 0) return { html: "", diagnostics };
  const factProps = propsFromFacts(element.facts, { viewport, mode: element.render_mode, isRoot: path === "root", parentAxis: context.parentLayoutAxis?.[viewport], semanticRole: element.semantic_role });
  if (element.render_mode === "presentation-table" && element.semantic_role === "social-icons" && factProps.width === "auto") {
    factProps.align = "center";
  }
  if (element.render_mode === "presentation-table" && context.parentCellCentersTable?.[viewport] && factProps.align === undefined) {
    factProps.align = "center";
  }
  if (element.render_mode === "presentation-table" && element.semantic_role === "button-text") {
    factProps.style["white-space"] = "nowrap";
  }
  const children = childHtml.filter(Boolean);
  const joined = children.join("");

  switch (element.render_mode) {
    case "presentation-table": {
      const dimensions = element.facts?.find(({ id }) => id === "reference-size")?.value;
      if (element.semantic_role?.includes("divider") && dimensions?.height === 1 && children.length === 0) {
        const cell = renderPrimitive("cell", {
          height: 1,
          style: { "background-color": factProps.style["background-color"], "font-size": "0", "line-height": "0" },
        }, "&nbsp;");
        return { html: renderPrimitive("table", { width: "100%" }, `<tr>${cell}</tr>`), diagnostics: [] };
      }
      if (children.length === 0 && dimensions?.width > 0 && dimensions?.height > 1 && factProps.style["background-color"]) {
        const background = factProps.style["background-color"];
        const radius = factProps.style["border-radius"];
        const cell = renderPrimitive("cell", {
          width: dimensions.width,
          height: dimensions.height,
          bgcolor: background,
          style: {
            "background-color": background,
            ...(radius ? { "border-radius": radius } : {}),
            "font-size": "0",
            "line-height": "0",
          },
        }, "&nbsp;");
        return {
          html: renderPrimitive("table", {
            ...factProps,
            width: dimensions.width,
            height: dimensions.height,
          }, "<tr>" + cell + "</tr>"),
          diagnostics: [],
        };
      }
      const axes = (element.facts ?? []).filter(({ id }) => id === "layout-axis" || id.endsWith("-layout-axis"));
      const gaps = (element.facts ?? []).filter(({ id }) =>
        id === "layout-gap" || (id.endsWith("-layout-gap") && !id.startsWith("email-render-")));
      if (children.length > 1 && (axes.length !== 1 || gaps.length !== 1)) {
        return {
          html: "",
          diagnostics: [diagnostic(
            "RENDER_LAYOUT_UNSPECIFIED",
            `/contracts/${viewport}/${path}/facts`,
            "Presentation-table with multiple visible children requires exactly one layout axis and one integer gap.",
          )],
        };
      }
      const axis = axes[0]?.value?.value ?? "vertical";
      const emailGap = element.facts?.find(({ id }) => id === "email-render-layout-gap")?.value;
      const gap = emailGap?.type === "measure" ? emailGap.value : (gaps[0]?.value?.value ?? 0);
      if (
        axes.length > 1 || gaps.length > 1 ||
        !["vertical", "horizontal"].includes(axis) ||
        !Number.isInteger(gap) || (gap < 0 && children.length > 1)
      ) {
        return {
          html: "",
          diagnostics: [diagnostic(
            "RENDER_LAYOUT_INVALID",
            `/contracts/${viewport}/${path}/facts`,
            "Presentation-table layout requires one valid axis and an integer gap; negative gap is only valid without an inter-item boundary.",
          )],
        };
      }
      if (isWholeButtonAction(element)) {
        const actionHtml = renderWholeButtonAction(element, entry, childHtml, factProps, gap);
        if (actionHtml) return { html: actionHtml, diagnostics: [] };
      }

      const visible = childHtml
        .map((html, index) => ({ html, node: element.children?.[index] }))
        .filter(({ html }) => Boolean(html));
      const primaryAlignment = element.facts?.find(({ id }) => id === "primary-alignment")?.value?.value;
      const centerGroup = axis === "horizontal" && primaryAlignment === "center";
      const centerGroupHasFillChild = centerGroup && visible.some(({ node }) =>
        node?.facts?.some(({ id, value }) => id === "horizontal-sizing" && value?.value === "fill"),
      );
      const spaceBetween = axis === "horizontal" && primaryAlignment === "space_between";
      const groupedAction = centerGroup && element.action?.kind === "whole-element" && visible.length > 1;
      const counterAlignment = element.facts?.find(({ id }) => id === "counter-alignment")?.value?.value;
      const cellFor = ({ html, node }) => {
        if (node?.render_mode === "background-image") return html;
        const nodeProps = propsFromFacts(node?.facts, { viewport, mode: node?.render_mode, semanticRole: node?.semantic_role });
        const centeredImage = axis === "vertical" && counterAlignment === "center" &&
          node?.render_mode === "direct-image" && !nodeProps.fluid
          ? html.replace(/(<img\b[^>]*\sstyle=")([^"]*)"/u,
            (_match, prefix, style) => prefix + style + ';margin:0 auto"')
          : html;
        const fillHeight = node?.facts?.some(({ id, value }) =>
          id === "vertical-sizing" && value?.value === "fill");
        const childRadius = nodeProps.style["border-radius"];
        const roundedChild = childRadius && !["0", "0px", "0%"].includes(String(childRadius));
        const paintCellBackground = axis === "horizontal" &&
          nodeProps.style["background-color"] && !roundedChild;
        const cellTopInset = node?.facts?.find(({ id }) => id === "email-cell-inset-top")?.value;
        const cellStyle = {
          ...(cellTopInset?.type === "measure"
            ? { "padding-top": valueWithUnit(cellTopInset) }
            : {}),
          ...(axis === "vertical" && counterAlignment === "center"
            ? { "text-align": "center" }
            : {}),
          ...(paintCellBackground
            ? { "background-color": nodeProps.style["background-color"] }
            : {}),
          ...(node?.render_mode === "html-link" && nodeProps.style["text-align"] === "center"
            ? { "text-align": "center" }
            : {}),
        };
        return renderPrimitive("cell", {
          width: spaceBetween ? node?.facts?.find(({ id }) => id === "reference-size")?.value?.width
            : nodeProps.width === "auto" ? undefined : nodeProps.width,
          valign: axis === "horizontal" && counterAlignment === "center" && !fillHeight ? "middle" : "top",
          ...(paintCellBackground
            ? { bgcolor: nodeProps.style["background-color"] }
            : {}),
          ...(Object.keys(cellStyle).length > 0 ? { style: cellStyle } : {}),
        }, groupedAction ? centeredImage : wrapAction(element, entry, centeredImage));
      };
      const rawRows = axis === "horizontal"
        ? `<tr>${visible.map(cellFor).join(gap > 0
          ? renderPrimitive("cell", { width: gap, style: { "font-size": "0", "line-height": "0" } }, "&nbsp;")
          : "")}</tr>`
        : visible.map((entry, index) => `${index > 0 && gap > 0
          ? `<tr>${renderPrimitive("cell", { height: gap, style: { "font-size": "0", "line-height": "0" } }, "&nbsp;")}</tr>`
          : ""}<tr>${cellFor(entry)}</tr>`).join("");
      const rows = centerGroup
        ? `<tr>${renderPrimitive("cell", { style: { "text-align": "center" } },
            wrapAction(groupedAction ? element : {}, entry,
              renderPrimitive("table", { width: centerGroupHasFillChild ? "100%" : "auto", align: "center" }, rawRows)))}</tr>`
        : rawRows;
      const padding = Object.fromEntries(
        Object.entries(factProps.style).filter(([key, value]) =>
          (key === "padding" || key.startsWith("padding-")) && value !== "0px" && value !== 0,
        ),
      );
      if (Object.keys(padding).length === 0) {
        return { html: renderPrimitive("table", factProps, rows), diagnostics: [] };
      }
      const style = { ...factProps.style };
      for (const key of Object.keys(padding)) delete style[key];
      const inner = renderPrimitive("table", { width: "100%" }, rows);
      const outer = renderPrimitive("table", { ...factProps, style },
        `<tr>${renderPrimitive("cell", { style: padding }, inner)}</tr>`);
      return { html: outer, diagnostics: [] };
    }
    case "html-text": {
      const rich = richTextFromFacts(element, entry, factProps.style, context, viewport);
      if (rich) {
        return rich.error
          ? { html: "", diagnostics: [diagnostic("RENDER_RICH_TEXT_INVALID", `/contracts/${viewport}/${path}`, rich.error)] }
          : { html: rich.html, diagnostics: [] };
      }
      const text = emittedSlotText(element,entry,context);
      const intrinsicPlainLabel = isIntrinsicLabel(element.facts, { mode: element.render_mode, semanticRole: element.semantic_role }) &&
        typeof text === "string" && !/[\r\n\u2028\u2029]/u.test(text);
      if (intrinsicPlainLabel) delete factProps.style["max-width"];
      if (intrinsicPlainLabel && factProps.style.width !== "100%" && / {2,}/u.test(text)) {
        factProps.style["white-space"] = "pre";
      }
      return {
        html: renderPrimitive("text", {
          text,
          style: factProps.style,
        }),
        diagnostics: [],
      };
    }
    case "html-link":
      return {
        html: renderPrimitive(
          "link",
          {
            href: slotValue(entry, "href"),
            ...(children.length === 0 ? { text: emittedSlotText(element,entry,context) } : {}),
            style: factProps.style,
          },
          joined,
        ),
        diagnostics: [],
      };
    case "direct-image": {
      const asset = scopedEntry(context.assets, viewport, element.asset_contract_id);
      if (!asset?.src) {
        return {
          html: "",
          diagnostics: [
            diagnostic(
              "RENDER_ASSET_MISSING",
              `/contracts/${viewport}/${path}/asset_contract_id`,
              `Asset ${element.asset_contract_id} is not resolved.`,
            ),
          ],
        };
      }
      const imageProps = {
        ...asset,
        ...factProps,
        height: factProps.height ?? asset.height,
        style: { ...(asset.style ?? {}), ...factProps.style },
        alt: slotValue(entry, "alt"),
      };
      // Native Fixed artwork reserves its final displayed width in auto-layout tables.
      // Resolve all fluid policies and email-render-size before setting the minimum.
      const fixedWidth = element.facts?.some(({ id, value }) =>
        id === "horizontal-sizing" && value?.value === "fixed");
      if (fixedWidth && !imageProps.fluid && Number.isFinite(imageProps.width) && imageProps.width > 0) {
        const minimum = imageProps.style["min-width"];
        const minimumPx = typeof minimum === "number" ? minimum
          : typeof minimum === "string" && /^\d+(?:\.\d+)?px$/u.test(minimum) ? Number.parseFloat(minimum) : undefined;
        // Keep explicit non-pixel constraints; never lower a declared pixel minimum.
        if (minimum === undefined || minimum === null || minimum === "" || Number.isFinite(minimumPx)) {
          imageProps.style["min-width"] = `${Math.max(imageProps.width, minimumPx ?? 0)}px`;
        }
      }
      return {
        html: wrapAction(element, entry, renderPrimitive("direct-image", imageProps)),
        diagnostics: [],
      };
    }
    case "background-image": {
      const asset = scopedEntry(context.assets, viewport, element.asset_contract_id);
      if (!asset?.src) {
        return {
          html: "",
          diagnostics: [
            diagnostic(
              "RENDER_ASSET_MISSING",
              `/contracts/${viewport}/${path}/asset_contract_id`,
              `Asset ${element.asset_contract_id} is not resolved.`,
            ),
          ],
        };
      }
      return {
        html: renderPrimitive(
          "background-image",
          {
            ...asset,
            ...factProps,
            height: element.facts?.some(({ id, value }) => id === "height-behavior" && value.value === "content-driven-cover") ? undefined : (factProps.height ?? asset.height),
            style: { ...(asset.style ?? {}), ...factProps.style },
          },
          joined,
        ),
        diagnostics: [],
      };
    }
    case "nested-component":
    case "slot":
      return { html: joined, diagnostics: [] };
    case "figma-source-only":
    case "none":
      return { html: "", diagnostics: [] };
    default:
      return {
        html: "",
        diagnostics: [
          diagnostic(
            "RENDER_MODE_UNSUPPORTED",
            `/contracts/${viewport}/${path}`,
            `Unsupported render mode: ${String(element.render_mode)}.`,
          ),
        ],
      };
  }
}

function anchorContext(element,viewport,context) {
  const entry=scopedEntry(context.content,viewport,element?.id)??{};
  const href=element?.render_mode==="html-link"?slotValue(entry,"href"):actionHref(element??{},entry);
  return href?{href}:context.anchorContexts?.[viewport];
}
function renderShell(element,viewport,path,children,context) {
  const result=renderShellNative(element,viewport,path,children,context);
  if(result.diagnostics.length)return result;
  let html=result.html;
  if(element.render_mode==="direct-image") {
    const linked=applyOutputLink({html,origin:element.output_origin,outputBindings:context.outputBindings,existingAnchorContext:anchorContext(element,viewport,context)});
    if(linked.diagnostics.length)return linked;
    html=linked.html;
  }
  if(html&&element.output_block&&context.emissionProfile?.fallback_viewport==="mobile") {
    const label=element.output_block.replaceAll(/--+/gu,"-").replaceAll("<","&lt;").replaceAll(">","&gt;");
    html=`<!-- cupis:block ${label} -->${html}<!-- cupis:end ${label} -->`;
  }
  return {html,diagnostics:[]};
}
function layoutAxisFor(element) {
  const axis = element?.facts?.find(({ id }) => id === "layout-axis" || id.endsWith("-layout-axis"))?.value?.value;
  return ["horizontal", "vertical"].includes(axis) ? axis : undefined;
}

function childTableCentering(element, viewport, context) {
  if (["nested-component", "slot"].includes(element?.render_mode)) {
    return context.parentCellCentersTable?.[viewport] ?? false;
  }
  return element?.render_mode === "presentation-table" &&
    (layoutAxisFor(element) ?? "vertical") === "vertical" &&
    element.facts?.find(({ id }) => id === "counter-alignment")?.value?.value === "center";
}

function renderSingle(element, viewport, path, context) {
  if (!element) return { html: "", diagnostics: [] };
  const visibility = visibilityFor(element, viewport, context, path);
  if (!visibility.visible) return { html: "", diagnostics: visibility.diagnostics };
  const childContext = {
    ...context,
    parentLayoutAxis: { ...context.parentLayoutAxis, [viewport]: layoutAxisFor(element) },
    parentCellCentersTable: { ...context.parentCellCentersTable, [viewport]: childTableCentering(element, viewport, context) },
    anchorContexts:{...context.anchorContexts,[viewport]:anchorContext(element,viewport,context)},
  };
  const children = (element.children ?? []).map((child, index) =>
    renderSingle(child, viewport, `${path}/children/${index}`, childContext),
  );
  const shell = renderShell(
    element,
    viewport,
    path,
    children.map(({ html }) => html),
    context,
  );
  return {
    html: shell.html,
    diagnostics: sortDiagnostics([
      ...children.flatMap(({ diagnostics }) => diagnostics),
      ...shell.diagnostics,
    ]),
  };
}

function splitClasses(path) {
  const base = `cupis-${path.replaceAll(/[^a-z0-9]+/gu, "-").replaceAll(/^-|-$/gu, "")}`;
  return { mobile: `${base}-mobile`, desktop: `${base}-desktop` };
}

function renderSplit(pair, path, context) {
  const mobile = renderSingle(pair.mobile, "mobile", path.replaceAll("-", "/children/"), context);
  const desktop = renderSingle(pair.desktop, "desktop", path.replaceAll("-", "/children/"), context);
  const diagnostics = sortDiagnostics([...mobile.diagnostics, ...desktop.diagnostics]);
  if (!mobile.html && !desktop.html) return { html: "", rules: [], diagnostics };
  const classes = splitClasses(path);
  if (context.emissionProfile?.fallback_viewport === "mobile") {
    const mobileWrapper = mobile.html ? '<!--[if !mso]><!-->' + renderPrimitive("responsive-visibility", {className:classes.mobile,hidden:false}, mobile.html) + '<!--<![endif]-->' : '';
    // Word gets a visible opening wrapper; ordinary clients get the inline-hidden
    // wrapper. Content and its closing tag occur once, without a third tree.
    const desktopWrapper = desktop.html ? `<!--[if mso]><div class="${classes.desktop}" style="display:block;max-height:none;overflow:visible"><![endif]--><!--[if !mso]><!--><div class="${classes.desktop}" style="display:none;max-height:0;overflow:hidden"><!--<![endif]-->${desktop.html}</div>` : '';
    const rules = createViewportRules({profile:context.emissionProfile,classes,mobileDisplay:"block",desktopDisplay:"block"});
    return {html:mobileWrapper + desktopWrapper,rules:rules.ordinaryRules,msoRules:rules.msoRules,diagnostics};
  }
  const html = [
    mobile.html
      ? renderPrimitive("responsive-visibility", { className: classes.mobile, hidden: true }, mobile.html)
      : "",
    desktop.html
      ? renderPrimitive("responsive-visibility", { className: classes.desktop, hidden: false }, desktop.html)
      : "",
  ].join("");
  const rule = `.${classes.desktop}{display:none!important;max-height:0!important;overflow:hidden!important}.${classes.mobile}{display:block!important;max-height:none!important;overflow:visible!important}`;
  return { html, rules: [rule], diagnostics };
}

function renderPaired(pair, path, context) {
  if (pair.kind === "split") return renderSplit(pair, path, context);
  if (pair.mobile.visibility?.mode !== "always" || pair.desktop.visibility?.mode !== "always") {
    return renderSplit(pair, path, context);
  }
  if (
    pair.mobile.render_mode === "presentation-table" &&
    pair.children.some(
      ({ mobile, desktop }) =>
        mobile?.render_mode === "background-image" ||
        desktop?.render_mode === "background-image",
    )
  ) {
    return renderSplit(pair, path, context);
  }

  const childContext = {
    ...context,
    parentLayoutAxis: { mobile: layoutAxisFor(pair.mobile), desktop: layoutAxisFor(pair.desktop) },
    parentCellCentersTable: {
      mobile: childTableCentering(pair.mobile, "mobile", context),
      desktop: childTableCentering(pair.desktop, "desktop", context),
    },
    anchorContexts:{mobile:anchorContext(pair.mobile,"mobile",context),desktop:anchorContext(pair.desktop,"desktop",context)},
  };
  const children = pair.children.map((child, index) =>
    renderPaired(child, `${path}-${index}`, childContext),
  );
  const nativeWholeButton = [pair.mobile, pair.desktop].some((element) =>
    element.render_mode === "presentation-table" && isWholeButtonAction(element));
  if (nativeWholeButton && children.some((child) => child.rules.length > 0 || (child.msoRules?.length ?? 0) > 0)) {
    return renderSplit(pair, path, context);
  }
  const combinedChildren = children.map(({ html }) => html);
  const mobileShell = renderShell(pair.mobile, "mobile", path.replaceAll("-", "/children/"), combinedChildren, context);
  const desktopShell = renderShell(pair.desktop, "desktop", path.replaceAll("-", "/children/"), combinedChildren, context);
  const childDiagnostics = children.flatMap(({ diagnostics }) => diagnostics);

  if (
    mobileShell.html === desktopShell.html &&
    JSON.stringify(mobileShell.diagnostics) === JSON.stringify(desktopShell.diagnostics)
  ) {
    return {
      html: mobileShell.html,
      rules: children.flatMap(({ rules }) => rules),
      msoRules: children.flatMap(child => child.msoRules ?? []),
      diagnostics: sortDiagnostics([...childDiagnostics, ...mobileShell.diagnostics]),
    };
  }

  return renderSplit(pair, path, context);
}

function breakpointCss(rules, foundations, diagnostics, emissionProfile) {
  if (rules.length === 0) return "";
  if (emissionProfile?.fallback_viewport === "mobile") return [...new Set(rules)].join("\n");
  const breakpoint = foundations?.rendering?.breakpoints?.find(
    ({ id }) => id === "cupis-mobile",
  );
  if (!breakpoint) {
    diagnostics.push(
      diagnostic(
        "RENDER_BREAKPOINT_MISSING",
        "/foundations/rendering/breakpoints",
        "Responsive split requires the canonical mobile breakpoint.",
      ),
    );
    return "";
  }
  return `@media only screen and (${breakpoint.query}:${breakpoint.value}${breakpoint.unit}){${[...new Set(rules)].join("")}}`;
}


export function selectVariantRoot(component, viewport, variantAxes = {}) {
  const unresolved = () => ({ root: null, diagnostics: [diagnostic(
    "RENDER_VARIANT_UNRESOLVED", `/contracts/${viewport}/variant_contracts`,
    `No exact ${viewport} variant for ${JSON.stringify(variantAxes)}.`,
  )] });
  if (!["mobile", "desktop"].includes(viewport) || variantAxes === null ||
    typeof variantAxes !== "object" || Array.isArray(variantAxes)) return unresolved();
  const base = component?.contracts?.[viewport]?.root;
  const expected = Object.entries(variantAxes).sort(([a], [b]) => a.localeCompare(b));
  if (expected.length === 0) return { root: base, diagnostics: [] };
  if (Object.hasOwn(variantAxes, "Viewport")) return unresolved();
  const sources = component?.contracts?.source_variants ?? [];
  const nodeId = base?.facts?.find(({ id }) => id === "reference-size")?.provenance?.node_id;
  const baseSource = typeof nodeId === "string"
    ? sources.find(({ source_node }) => source_node?.node_id === nodeId) : null;
  const candidates = [
    { root: base, axes: baseSource?.axes ?? [{ name: "Viewport", value: viewport }] },
    ...(component?.contracts?.variant_contracts ?? []).map(({ root, axes }) => ({ root, axes })),
  ];
  const selected = candidates.filter(({ root, axes }) => {
    if (!root || !Array.isArray(axes) || axes.some((axis) =>
      typeof axis?.name !== "string" || typeof axis?.value !== "string")) return false;
    const viewportAxes = axes.filter(({ name }) => name === "Viewport");
    if (viewportAxes.length > 1 || viewportAxes.some(({ value }) =>
      value.toLowerCase() !== viewport)) return false;
    const otherAxes = axes.filter(({ name }) => name !== "Viewport");
    return otherAxes.length === expected.length &&
      new Set(otherAxes.map(({ name }) => name)).size === otherAxes.length &&
      expected.every(([name, value]) => otherAxes.some((axis) =>
        axis.name === name && axis.value.toLowerCase() === String(value).toLowerCase()));
  });
  return selected.length === 1 ? { root: selected[0].root, diagnostics: [] } : unresolved();
}

export function renderContractTree({
  component,
  coverage,
  content = {},
  assets = {},
  properties = {},
  visibility = {},
  variantAxes = {},
  foundations = {},
  emissionProfile,
  outputBindings, templateRules, previewValues,
}) {
  if (coverage?.component_id !== component?.id || coverage?.mode !== "interpreter") {
    return {
      html: "",
      css: "",
      diagnostics: [
        diagnostic(
          "RENDER_INTERPRETER_COVERAGE_REQUIRED",
          "/coverage",
          `Interpreter coverage is required for ${String(component?.id)}.`,
        ),
      ],
    };
  }
  const selectedMobile = selectVariantRoot(component, "mobile", variantAxes);
  const selectedDesktop = selectVariantRoot(component, "desktop", variantAxes);
  const mobile = selectedMobile.root;
  const desktop = selectedDesktop.root;
  if (selectedMobile.diagnostics.length || selectedDesktop.diagnostics.length) {
    return { html: "", css: "", diagnostics: sortDiagnostics([...selectedMobile.diagnostics, ...selectedDesktop.diagnostics]) };
  }
  if (!mobile || !desktop) {
    return {
      html: "",
      css: "",
      diagnostics: [
        diagnostic(
          "RENDER_VIEWPORT_CONTRACT_MISSING",
          "/contracts",
          "Both mobile and desktop contract trees are required.",
        ),
      ],
    };
  }

  const result = renderPaired(
    pairViewportTrees({ mobile, desktop }),
    "root",
    { content, assets, properties, visibility, variantAxes, foundations, emissionProfile, outputBindings, templateRules, previewValues },
  );
  const diagnostics = [...result.diagnostics];
  const css = breakpointCss(result.rules, foundations, diagnostics, emissionProfile);
  const msoCss = [...new Set(result.msoRules ?? [])].join(emissionProfile?.fallback_viewport === "mobile" ? "\n" : "");
  return { html: result.html, css, msoCss, diagnostics: sortDiagnostics(diagnostics) };
}
