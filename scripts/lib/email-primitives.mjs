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
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => `${name}:${String(value)}`)
    .join(";");
}

function attributes(entries) {
  return entries
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
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
    ...(props.style ?? {}),
  };
  const attrs = withStyle(
    [
      ["role", "presentation"],
      ["width", width],
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
    ...(props.style ?? {}),
  };
  return `<td${withStyle([["valign", valign]], style)}>${children}</td>`;
}

function renderText(props, children) {
  const body = `${props.text === undefined ? "" : escapeHtml(props.text)}${children}`;
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
      ["height", props.height],
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

export function renderPrimitive(id, props = {}, children = "") {
  const handlers = {
    "email-shell": renderTable,
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
