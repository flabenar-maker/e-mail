function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cssUrl(value) {
  return String(value)
    .replaceAll("\\", "%5C")
    .replaceAll("'", "%27")
    .replaceAll('"', "%22")
    .replaceAll("(", "%28")
    .replaceAll(")", "%29")
    .replaceAll("\r", "")
    .replaceAll("\n", "");
}

function styleText(styles) {
  return Object.entries(styles)
    .filter(
      ([name, value]) =>
        value !== undefined &&
        value !== null &&
        (value !== "" || name === "alt"),
    )
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => `${name}:${String(value)}`)
    .join(";");
}

function attributes(entries) {
  return entries
    .filter(
      ([name, value]) =>
        value !== undefined &&
        value !== null &&
        (value !== "" || name === "alt"),
    )
    .map(([name, value]) => ` ${name}="${escapeHtml(value)}"`)
    .join("");
}

function withStyle(entries, styles) {
  const serialized = styleText(styles);
  return attributes(serialized ? [...entries, ["style", serialized]] : entries);
}

function pixels(value) {
  return typeof value === "number" ? `${value}px` : value;
}

function renderTable(props, children) {
  const width = props.width ?? "100%";
  const style = {
    "border-collapse": "collapse",
    "border-spacing": "0",
    ...(width === "100%" ? { width: "100%" } : {}),
    ...(props.align === "center" ? { margin: "0 auto" } : {}),
    ...(props.style ?? {}),
  };
  const attrs = withStyle(
    [
      ["role", "presentation"],
      ["width", width === "auto" ? undefined : width],
      ["cellpadding", "0"],
      ["cellspacing", "0"],
      ["border", "0"],
      ["align", props.align],
    ],
    style,
  );
  return `<table${attrs}><tbody>${children}</tbody></table>`;
}

function renderCell(props, children) {
  const valign = props.valign ?? props.style?.["vertical-align"] ?? "top";
  const style = {
    padding: "0",
    "text-align": "left",
    "vertical-align": valign,
    ...(props.width === undefined ? {} : { width: pixels(props.width) }),
    ...(props.height === undefined ? {} : { height: pixels(props.height) }),
    ...(props.style ?? {}),
  };
  const attrs = withStyle(
    [["width", props.width], ["height", props.height], ["valign", valign], ["bgcolor", props.bgcolor]],
    style,
  );
  return `<td${attrs}>${children}</td>`;
}

function renderText(props, children) {
  const body = `${props.text === undefined ? "" : escapeHtml(props.text).replaceAll("\u2028", "<br>").replaceAll("\n", "<br>")}${children}`;
  return `<p${withStyle([], { margin: "0", ...(props.style ?? {}) })}>${body}</p>`;
}

function renderLink(props, children) {
  const body = props.text === undefined ? children : escapeHtml(props.text);
  const attrs = withStyle(
    [
      ["href", props.href],
      ["target", props.target ?? "_blank"],
    ],
    {
      display: "inline-block",
      "text-decoration": "none",
      ...(props.style ?? {}),
    },
  );
  return `<a${attrs}>${body}</a>`;
}

function renderDirectImage(props) {
  if (!Object.hasOwn(props, "alt")) {
    const error = new Error("Direct images require an explicit alt property.");
    error.code = "DIRECT_IMAGE_ALT_REQUIRED";
    throw error;
  }
  const critical = {
    border: "0",
    display: "block",
    height: props.fluid ? "auto" : pixels(props.height) ?? "auto",
    "line-height": "100%",
    "max-width": "100%",
    outline: "none",
    "text-decoration": "none",
    width: props.fluid ? "100%" : pixels(props.width),
  };
  const attrs = withStyle(
    [
      ["src", props.src],
      ["width", props.width],
      ["height", props.fluid ? undefined : props.height],
      ["alt", props.alt ?? ""],
      ["border", "0"],
    ],
    { ...(props.style ?? {}), ...critical },
  );
  return `<img${attrs}>`;
}

function renderBackgroundImage(props, children) {
  const source = cssUrl(props.src);
  const style = {
    "background-image": `url('${source}')`,
    "background-position": props.position ?? "center",
    "background-repeat": "no-repeat",
    "background-size": props.size ?? "cover",
    height: pixels(props.height),
    width: pixels(props.width),
    ...(props.style ?? {}),
  };
  const attrs = withStyle(
    [
      ["background", props.src],
      ["width", props.width],
      ["height", props.height],
      ["valign", props.valign ?? "top"],
    ],
    style,
  );
  return `<td${attrs}>${children}</td>`;
}

function renderVisibility(props, children) {
  const style = props.hidden
    ? { display: "none", "max-height": "0", overflow: "hidden" }
    : {};
  return `<div${withStyle([["class", props.className]], style)}>${children}</div>`;
}

function renderEmailShell(props, children) {
  const maxWidth = props.max_width_px;
  const minWidth = props.min_width_px;
  const inset = props.horizontal_inset_px;
  const background = props.background_color;
  const inner = renderTable({
    width: "100%",
    align: "center",
    style: {
      "max-width": pixels(maxWidth),
      "min-width": pixels(minWidth),
    },
  }, "<tr>" + renderCell({}, children) + "</tr>");
  const outlookOpen = "<!--[if (gte mso 9)|(IE)]><table role=\"presentation\" width=\"" +
    maxWidth + "\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td><![endif]-->";
  const outlookClose = "<!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->";
  const cell = renderCell({
    bgcolor: background,
    style: {
      "background-color": background,
      padding: "0 " + pixels(inset),
      "text-align": "center",
    },
  }, outlookOpen + inner + outlookClose);
  return renderTable({ width: "100%" }, "<tr>" + cell + "</tr>");
}

export function renderPrimitive(id, props = {}, children = "") {
  const handlers = {
    "email-shell": renderEmailShell,
    section: renderTable,
    table: renderTable,
    cell: renderCell,
    text: renderText,
    link: renderLink,
    "direct-image": renderDirectImage,
    "background-image": renderBackgroundImage,
    "responsive-visibility": renderVisibility,
  };
  const handler = handlers[id];
  if (!handler) {
    const error = new Error(`Unsupported email primitive: ${String(id)}.`);
    error.code = "PRIMITIVE_UNSUPPORTED";
    throw error;
  }
  return handler(props, children);
}
