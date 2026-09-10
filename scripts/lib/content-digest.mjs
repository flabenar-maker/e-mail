import { createHash } from "node:crypto";

function sortJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map(sortJsonValue);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortJsonValue(value[key])]),
    );
  }
  return value;
}

export function canonicalize(value) {
  return JSON.stringify(sortJsonValue(value));
}

function normalizeLf(value) {
  return value.replace(/\r\n/gu, "\n");
}

export function digestTextEntries(entries) {
  const hash = createHash("sha256");
  const orderedEntries = [...entries].sort((left, right) =>
    left.path.localeCompare(right.path),
  );

  for (const entry of orderedEntries) {
    hash.update(entry.path, "utf8");
    hash.update("\0", "utf8");
    hash.update(normalizeLf(entry.content), "utf8");
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
