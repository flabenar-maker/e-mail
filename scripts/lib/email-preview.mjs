function unsupportedMode(mode) {
  const error = new Error(`Unsupported email preview mode: ${String(mode)}.`);
  error.code = "EMAIL_PREVIEW_MODE_UNSUPPORTED";
  return error;
}

export function buildEmailPreview({ html, mode }) {
  if (mode === "normal") return html;
  if (mode === "no-style") {
    return html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, "");
  }
  throw unsupportedMode(mode);
}