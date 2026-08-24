import { readFile } from "node:fs/promises";

import { isAlias, isScalar, parseDocument, visit } from "yaml";

import { SystemValidationError } from "./diagnostics.mjs";

function parserErrorCode(error) {
  return error.code === "DUPLICATE_KEY" ||
    error.message.includes("Map keys must be unique")
    ? "yaml-duplicate-key"
    : "yaml-syntax";
}

export function parseStrictYaml(text, sourcePath) {
  const document = parseDocument(text, {
    merge: false,
    prettyErrors: false,
    strict: true,
    uniqueKeys: true,
  });

  if (document.errors.length > 0) {
    const error = document.errors[0];
    throw new SystemValidationError(
      parserErrorCode(error),
      sourcePath,
      error.message,
    );
  }

  let containsAnchor = false;
  let containsAlias = false;
  let containsMergeKey = false;

  visit(document, {
    Alias(_key, node) {
      if (isAlias(node)) {
        containsAlias = true;
      }
    },
    Node(_key, node) {
      if (node.anchor) {
        containsAnchor = true;
      }
    },
    Pair(_key, pair) {
      if (isScalar(pair.key) && pair.key.value === "<<") {
        containsMergeKey = true;
      }
    },
  });

  if (containsMergeKey) {
    throw new SystemValidationError(
      "yaml-merge-key-forbidden",
      sourcePath,
      "YAML merge keys are forbidden.",
    );
  }
  if (containsAlias) {
    throw new SystemValidationError(
      "yaml-alias-forbidden",
      sourcePath,
      "YAML aliases are forbidden.",
    );
  }
  if (containsAnchor) {
    throw new SystemValidationError(
      "yaml-anchor-forbidden",
      sourcePath,
      "YAML anchors are forbidden.",
    );
  }

  return document.toJS({ maxAliasCount: 0 });
}

export async function readStrictYaml(filePath) {
  const text = await readFile(filePath, "utf8");
  return parseStrictYaml(text, filePath);
}
