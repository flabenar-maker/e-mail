import test from "node:test";
import assert from "node:assert/strict";

import { parseStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

test("parses plain YAML mappings and arrays", () => {
  assert.deepEqual(
    parseStrictYaml(
      "schema_version: 1.0.0\nitems:\n  - alpha\n",
      "fixture.yaml",
    ),
    { schema_version: "1.0.0", items: ["alpha"] },
  );
});

for (const [name, yaml, code] of [
  ["duplicate keys", "value: 1\nvalue: 2\n", "yaml-duplicate-key"],
  ["anchors", "value: &shared 1\n", "yaml-anchor-forbidden"],
  [
    "aliases",
    "value: &shared 1\ncopy: *shared\n",
    "yaml-alias-forbidden",
  ],
  [
    "merge keys",
    "base: &base\n  a: 1\ncopy:\n  <<: *base\n",
    "yaml-merge-key-forbidden",
  ],
]) {
  test(`rejects ${name}`, () => {
    assert.throws(
      () => parseStrictYaml(yaml, "fixture.yaml"),
      (error) => error.code === code && error.path === "fixture.yaml",
    );
  });
}
