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
  if (value?.type === "measure") return `${value.value}${value.unit}`;
  if (["color", "string", "keyword"].includes(value?.type)) return value.value;
  return undefined;
}

function propsFromFacts(facts = []) {
  const props = { style: {} };
  for (const fact of facts) {
    const id = fact.id;
    const value = fact.value;
    if (value?.type === "dimensions" && id.endsWith("-dimensions")) {
      props.width = value.width;
      props.height = value.height;
      continue;
    }
    const resolved = valueWithUnit(value);
    if (resolved === undefined) {
      if (id.endsWith("width-behavior") && value?.value === "fluid-to-container") props.fluid = true;
      if (id.endsWith("height-behavior") && value?.value === "auto") props.fluid = true;
      continue;
    }
    if (id.endsWith("-font-size") || id.endsWith("-text-size")) props.style["font-size"] = resolved;
    else if (id.endsWith("-text-color")) props.style.color = resolved;
    else if (id.endsWith("-background") || id === "background-fallback") props.style["background-color"] = resolved;
    else if (id.endsWith("-border-radius")) props.style["border-radius"] = resolved;
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
  return props;
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

function renderShell(element, viewport, path, childHtml, context) {
  if (!element) return { html: "", diagnostics: [] };
  if (element.visibility?.mode === "property") {
    const visible = resolveProperty(context.properties, viewport, element.visibility.property_id);
    if (visible === undefined) {
      return {
        html: "",
        diagnostics: [
          diagnostic(
            "RENDER_PROPERTY_UNRESOLVED",
            `/contracts/${viewport}/${path}/visibility/property_id`,
            `Property ${element.visibility.property_id} is not resolved.`,
          ),
        ],
      };
    }
    if (!visible) return { html: "", diagnostics: [] };
  }

  const { entry, diagnostics } = contentFor({ ...context, path }, viewport, element);
  if (diagnostics.length > 0) return { html: "", diagnostics };
  const factProps = propsFromFacts(element.facts);
  const children = childHtml.filter(Boolean);
  const joined = children.join("");

  switch (element.render_mode) {
    case "presentation-table": {
      const rows = childHtml
        .map((child, index) => {
          if (!child) return "";
          const cell = element.children?.[index]?.render_mode === "background-image"
            ? child
            : renderPrimitive("cell", {}, child);
          return `<tr>${cell}</tr>`;
        })
        .join("");
      return { html: renderPrimitive("table", factProps, rows), diagnostics: [] };
    }
    case "html-text":
      return {
        html: renderPrimitive("text", {
          text: slotValue(entry, "text"),
          style: factProps.style,
        }),
        diagnostics: [],
      };
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
        html: renderPrimitive("direct-image", {
          ...asset,
          ...factProps,
          style: { ...(asset.style ?? {}), ...factProps.style },
          alt: slotValue(entry, "alt"),
        }),
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

export function renderContractTree({
  component,
  coverage,
  content = {},
  assets = {},
  properties = {},
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
  const mobile = component?.contracts?.mobile?.root;
  const desktop = component?.contracts?.desktop?.root;
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
    { content, assets, properties, foundations },
  );
  const diagnostics = [...result.diagnostics];
  const css = breakpointCss(result.rules, foundations, diagnostics);
  return { html: result.html, css, diagnostics: sortDiagnostics(diagnostics) };
}
