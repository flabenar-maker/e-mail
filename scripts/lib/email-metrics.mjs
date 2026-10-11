import { Buffer } from "node:buffer";

function diagnostic(code, path, message) {
  return { code, path, message };
}

export function measureEmailOutput({ html, css, msoCss = "" }) {
  return {
    html_bytes: Buffer.byteLength(html, "utf8"),
    embedded_css_bytes: Buffer.byteLength(css + msoCss, "utf8"),
    ...(msoCss ? { ordinary_css_bytes:Buffer.byteLength(css,"utf8"),mso_css_bytes:Buffer.byteLength(msoCss,"utf8") } : {}),
  };
}

export function validateEmbeddedCssBudget(css, maxBytesExclusive) {
  const actualBytes = Buffer.byteLength(css, "utf8");
  if (actualBytes < maxBytesExclusive) return [];
  return [
    diagnostic(
      "RENDER_EMBEDDED_CSS_BUDGET_EXCEEDED",
      "/embedded_css",
      `Embedded CSS uses ${actualBytes} bytes; exclusive limit ${maxBytesExclusive} bytes.`,
    ),
  ];
}