import { createHash } from "node:crypto";

function canonicalValue(value, stack) {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Canonical JSON accepts only finite numbers.");
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (stack.has(value)) {
      throw new TypeError("Canonical JSON cannot contain cycles.");
    }
    stack.add(value);
    const result = value.map((item) => canonicalValue(item, stack));
    stack.delete(value);
    return result;
  }
  if (typeof value === "object") {
    if (stack.has(value)) {
      throw new TypeError("Canonical JSON cannot contain cycles.");
    }
    stack.add(value);
    const result = {};
    for (const key of Object.keys(value).sort()) {
      result[key] = canonicalValue(value[key], stack);
    }
    stack.delete(value);
    return result;
  }
  if (
    value === undefined ||
    typeof value === "function" ||
    typeof value === "symbol"
  ) {
    return undefined;
  }
  throw new TypeError(`Canonical JSON does not support ${typeof value}.`);
}

export function canonicalize(value) {
  const serialized = JSON.stringify(canonicalValue(value, new Set()));
  if (serialized === undefined) {
    throw new TypeError("Canonical JSON requires a serializable value.");
  }
  return serialized;
}

function normalizeLf(value) {
  return value.replace(/\r\n/gu, "\n");
}

function normalizeTextEntries(entries) {
  const paths = new Set();
  return entries
    .map((entry) => {
      if (
        !entry ||
        typeof entry.path !== "string" ||
        typeof entry.content !== "string"
      ) {
        throw new TypeError(
          "Text digest entries require string path and content fields.",
        );
      }
      if (paths.has(entry.path)) {
        throw new TypeError(`Duplicate digest entry path: ${entry.path}.`);
      }
      paths.add(entry.path);
      return {
        path: entry.path,
        content: normalizeLf(entry.content),
      };
    })
    .sort((left, right) => left.path.localeCompare(right.path));
}

export function digestTextEntries(entries) {
  const hash = createHash("sha256");
  for (const entry of normalizeTextEntries(entries)) {
    hash.update(entry.path, "utf8");
    hash.update("\0", "utf8");
    hash.update(entry.content, "utf8");
    hash.update("\0", "utf8");
  }
  return `sha256:${hash.digest("hex")}`;
}

export function digestStructuredEntries(entries) {
  return digestTextEntries(
    entries.map((entry) => ({
      path: entry.path,
      content: canonicalize(entry.value),
    })),
  );
}
