import { SystemValidationError } from "./diagnostics.mjs";

const ALLOWED = new Set([
  "normalize-attributes",
  "strip-technical-markers",
  "validate-local-src",
]);
const FORBIDDEN = new Set([
  "infer-contract",
  "change-layout",
  "change-dimensions",
  "suppress-diagnostic",
]);

function fail(code, path, message) {
  throw new SystemValidationError(code, path, message);
}

function normalizeAttributes(html) {
  return html
    .replace(/\r\n?/gu, "\n")
    .replace(/\b(width|height)="([0-9]+)px"/gu, '$1="$2"');
}

function stripTechnicalMarkers(html) {
  return html.replace(/<!--\s*cupis:technical[\s\S]*?-->/gu, "");
}

function validateLocalSources(html, assetPaths) {
  const declared = new Set(assetPaths ?? []);
  const references = [];
  const pattern = /\b(?:src|background)="([^"]+)"/gu;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    references.push(match[1]);
  }
  for (const reference of references) {
    if (!reference.startsWith("images/") || reference.includes("\\") || reference.includes("..")) {
      fail(
        "EMAIL_LOCAL_SRC_UNSAFE",
        "/html",
        "Rendered image reference must be a normalized path below images/: " + reference + ".",
      );
    }
    if (!declared.has(reference)) {
      fail(
        "EMAIL_LOCAL_SRC_MISSING",
        "/html",
        "Rendered image reference is not declared by the model: " + reference + ".",
      );
    }
  }
  return html;
}

const handlers = Object.freeze({
  "normalize-attributes": (html) => normalizeAttributes(html),
  "strip-technical-markers": (html) => stripTechnicalMarkers(html),
  "validate-local-src": (html, policy) =>
    validateLocalSources(html, policy.assetPaths),
});

export function postprocessEmail({ html, policy = {} }) {
  if (typeof html !== "string") {
    fail("EMAIL_POSTPROCESS_INPUT_INVALID", "/html", "Rendered HTML must be a string.");
  }
  let result = html;
  for (const [index, transformer] of (policy.transformers ?? []).entries()) {
    if (FORBIDDEN.has(transformer)) {
      fail(
        "EMAIL_POSTPROCESSOR_FORBIDDEN",
        "/policy/transformers/" + index,
        "Forbidden postprocessor: " + transformer + ".",
      );
    }
    if (!ALLOWED.has(transformer)) {
      fail(
        "EMAIL_POSTPROCESSOR_UNKNOWN",
        "/policy/transformers/" + index,
        "Unknown postprocessor: " + transformer + ".",
      );
    }
    result = handlers[transformer](result, policy);
  }
  return result;
}
