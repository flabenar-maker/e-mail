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

function propsFromFacts(facts = [], { viewport, mode, isRoot = false } = {}) {
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
      props.style["max-width"] = `${size.width}px`;
    } else if (mode === "presentation-table" && sizing === "hug") {
      props.width = "auto";
    } else if (isRoot && viewport === "desktop") {
      props.width = size.width;
    }
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
    else if (["padding-top", "padding-right", "padding-bottom", "padding-left"].includes(id)) props.style[id] = resolved;
    else if (id.endsWith("-padding-inline")) {
      props.style["padding-left"] = resolved;
      props.style["padding-right"] = resolved;
    } else if (id.endsWith("-padding-block")) {
      props.style["padding-bottom"] = resolved;
      props.style["padding-top"] = resolved;
    } else if (id.endsWith("-padding")) props.style.padding = resolved;
    else if (id.endsWith("-width")) props.width = value.value;
    else if (id.endsWith("-height")) props.height = value.value;
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

function richTextFromFacts(element, entry, style) {
  const fact = element.facts?.find(({ id }) => id === "styled-text-segments");
  if (!fact) return null;
  const segments = fact.value?.items ?? [];
  const supplied = slotValue(entry, "text");
  const source = element.facts?.find(({ id }) => id === "source-text")?.value?.value;
  if (!Array.isArray(supplied) && supplied !== source) {
    return { html: "", error: "Rich text requires source text or one text run per styled segment." };
  }
  const runs = Array.isArray(supplied) ? supplied : segments.map(({ characters }) => characters);
  if (runs.length !== segments.length || runs.some((run) => typeof run !== "string")) {
    return { html: "", error: "Rich text run count does not match the exact Figma segments." };
  }
  const body = segments.map((segment, index) => {
    const color = segment.fills?.find(({ type, visible }) => type === "solid" && visible !== false)?.color;
    const decoration = segment.text_decoration === "UNDERLINE" ? "underline" : "none";
    const text = escapeInline(runs[index]).replaceAll("\u2028", "<br>").replaceAll("\n", "<br>");
    const weight = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 }[segment.font_style];
    const inlineStyle = `color:${color};font-family:${segment.font_family},Arial,sans-serif;font-size:${segment.font_size_px}px;font-weight:${weight};line-height:${segment.line_height.value}${segment.line_height.unit === "PERCENT" ? "%" : "px"};text-decoration:${decoration}`;
    if (decoration !== "underline") return `<span style="${inlineStyle}">${text}</span>`;
    const href = slotValue(entry, "help-url") ?? slotValue(entry, `link-${index + 1}-url`);
    if (!href) return null;
    return `<a href="${escapeInline(href)}" style="${inlineStyle}">${text}</a>`;
  });
  if (body.some((run) => run === null)) return { html: "", error: "Underlined link segment has no URL." };
  return { html: renderPrimitive("text", { style }, body.join("")), error: null };
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

function renderShell(element, viewport, path, childHtml, context) {
  if (!element) return { html: "", diagnostics: [] };
  const visibility = visibilityFor(element, viewport, context, path);
  if (!visibility.visible) return { html: "", diagnostics: visibility.diagnostics };

  const { entry, diagnostics } = contentFor({ ...context, path }, viewport, element);
  if (diagnostics.length > 0) return { html: "", diagnostics };
  const factProps = propsFromFacts(element.facts, { viewport, mode: element.render_mode, isRoot: path === "root" });
  if (element.render_mode === "presentation-table" && element.semantic_role === "social-icons" && factProps.width === "auto") {
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
      const axes = (element.facts ?? []).filter(({ id }) => id === "layout-axis" || id.endsWith("-layout-axis"));
      const gaps = (element.facts ?? []).filter(({ id }) => id === "layout-gap" || id.endsWith("-layout-gap"));
      // Components without an explicit layout contract retain their legacy HTML.
      if (axes.length === 0 && gaps.length === 0) {
        const rows = childHtml
          .map((child, index) => {
            if (!child) return "";
            const cell = element.children?.[index]?.render_mode === "background-image"
              ? child
              : renderPrimitive("cell", {}, wrapAction(element, entry, child));
            return "<tr>" + cell + "</tr>";
          })
          .join("");
        return { html: renderPrimitive("table", factProps, rows), diagnostics: [] };
      }
      const axis = axes[0]?.value?.value ?? "vertical";
      const gap = gaps[0]?.value?.value ?? 0;
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
      const visible = childHtml
        .map((html, index) => ({ html, node: element.children?.[index] }))
        .filter(({ html }) => Boolean(html));
      const primaryAlignment = element.facts?.find(({ id }) => id === "primary-alignment")?.value?.value;
      const centerGroup = axis === "horizontal" && primaryAlignment === "center";
      const spaceBetween = axis === "horizontal" && primaryAlignment === "space_between";
      const groupedAction = centerGroup && element.action?.kind === "whole-element" && visible.length > 1;
      const cellFor = ({ html, node }) => {
        if (node?.render_mode === "background-image") return html;
        const nodeProps = propsFromFacts(node?.facts, { viewport, mode: node?.render_mode });
        return renderPrimitive("cell", {
          width: spaceBetween ? node?.facts?.find(({ id }) => id === "reference-size")?.value?.width : nodeProps.width,
          valign: element.facts?.some(({ id, value }) => id === "counter-alignment" && value.value === "center") ? "middle" : "top",
          ...(axis === "horizontal" && nodeProps.style["background-color"]
            ? { bgcolor: nodeProps.style["background-color"], style: { "background-color": nodeProps.style["background-color"] } }
            : {}),
          ...(node?.render_mode === "html-link" && nodeProps.style["text-align"] === "center"
            ? { style: { "text-align": "center" } }
            : {}),
        }, groupedAction ? html : wrapAction(element, entry, html));
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
              renderPrimitive("table", { width: "auto", align: "center" }, rawRows)))}</tr>`
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
      const rich = richTextFromFacts(element, entry, factProps.style);
      if (rich) {
        return rich.error
          ? { html: "", diagnostics: [diagnostic("RENDER_RICH_TEXT_INVALID", `/contracts/${viewport}/${path}`, rich.error)] }
          : { html: rich.html, diagnostics: [] };
      }
      return {
        html: renderPrimitive("text", {
          text: slotValue(entry, "text"),
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
            ...(children.length === 0 ? { text: slotValue(entry, "text") } : {}),
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
      return {
        html: wrapAction(element, entry, renderPrimitive("direct-image", {
          ...asset,
          ...factProps,
          height: factProps.height ?? asset.height,
          style: { ...(asset.style ?? {}), ...factProps.style },
          alt: slotValue(entry, "alt"),
        })),
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

function renderSingle(element, viewport, path, context) {
  if (!element) return { html: "", diagnostics: [] };
  const visibility = visibilityFor(element, viewport, context, path);
  if (!visibility.visible) return { html: "", diagnostics: visibility.diagnostics };
  const children = (element.children ?? []).map((child, index) =>
    renderSingle(child, viewport, `${path}/children/${index}`, context),
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

  const children = pair.children.map((child, index) =>
    renderPaired(child, `${path}-${index}`, context),
  );
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
      diagnostics: sortDiagnostics([...childDiagnostics, ...mobileShell.diagnostics]),
    };
  }

  return renderSplit(pair, path, context);
}

function breakpointCss(rules, foundations, diagnostics) {
  if (rules.length === 0) return "";
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
  const base = component?.contracts?.[viewport]?.root;
  const extras = component?.contracts?.variant_contracts ?? [];
  if (Object.keys(variantAxes).length === 0 || extras.length === 0) return { root: base, diagnostics: [] };
  const sources = component?.contracts?.source_variants ?? [];
  const sourceFor = (root) => sources.find(({ source_node }) =>
    source_node?.node_id === root?.facts?.find(({ id }) => id === "reference-size")?.provenance?.node_id);
  const candidates = [
    { root: base, axes: sourceFor(base)?.axes ?? [{ name: "Viewport", value: viewport }] },
    ...extras.map(({ root, axes }) => ({ root, axes })),
  ];
  const expected = Object.entries(variantAxes).sort(([a], [b]) => a.localeCompare(b));
  const selected = candidates.find(({ axes }) =>
    axes.some(({ name, value }) => name === "Viewport" && value.toLowerCase() === viewport) &&
    expected.every(([name, value]) => axes.some((axis) => axis.name === name && axis.value.toLowerCase() === String(value).toLowerCase())) &&
    axes.filter(({ name }) => name !== "Viewport").length === expected.length);
  return selected
    ? { root: selected.root, diagnostics: [] }
    : { root: null, diagnostics: [diagnostic("RENDER_VARIANT_UNRESOLVED",
      `/contracts/${viewport}/variant_contracts`, `No exact ${viewport} variant for ${JSON.stringify(variantAxes)}.`)] };
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
    { content, assets, properties, visibility, variantAxes, foundations },
  );
  const diagnostics = [...result.diagnostics];
  const css = breakpointCss(result.rules, foundations, diagnostics);
  return { html: result.html, css, diagnostics: sortDiagnostics(diagnostics) };
}
