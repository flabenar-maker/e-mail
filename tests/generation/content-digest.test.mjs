import test from "node:test";
import assert from "node:assert/strict";

async function digestModule() {
  const module = await import("../../scripts/lib/content-digest.mjs").catch(
    () => null,
  );
  assert.ok(module, "The content digest module must exist.");
  return module;
}

test("canonicalize sorts object keys recursively and preserves array order", async () => {
  const { canonicalize } = await digestModule();
  const left = {
    z: 1,
    nested: { second: 2, first: 1 },
    list: [{ b: 2, a: 1 }, 3],
  };
  const right = {
    list: [{ a: 1, b: 2 }, 3],
    nested: { first: 1, second: 2 },
    z: 1,
  };

  assert.equal(canonicalize(left), canonicalize(right));
  assert.equal(
    canonicalize(left),
    '{"list":[{"a":1,"b":2},3],"nested":{"first":1,"second":2},"z":1}',
  );
  assert.notEqual(canonicalize([1, 2]), canonicalize([2, 1]));
});

test("text digest is stable across entry order and CRLF line endings", async () => {
  const { digestTextEntries } = await digestModule();
  const left = digestTextEntries([
    { path: "z.md", content: "last\r\nline\r\n" },
    { path: "a.md", content: "first\r\nline\r\n" },
  ]);
  const right = digestTextEntries([
    { path: "a.md", content: "first\nline\n" },
    { path: "z.md", content: "last\nline\n" },
  ]);

  assert.match(left, /^sha256:[0-9a-f]{64}$/u);
  assert.equal(left, right);
});

test("text digest changes when either path or content changes", async () => {
  const { digestTextEntries } = await digestModule();
  const baseline = digestTextEntries([
    { path: "a.md", content: "same\n" },
  ]);

  assert.notEqual(
    baseline,
    digestTextEntries([{ path: "b.md", content: "same\n" }]),
  );
  assert.notEqual(
    baseline,
    digestTextEntries([{ path: "a.md", content: "changed\n" }]),
  );
});

test("structured digest ignores object insertion order but not data changes", async () => {
  const { digestStructuredEntries } = await digestModule();
  const baseline = digestStructuredEntries([
    {
      path: "data/example.yaml",
      value: { count: 1, values: ["a", "b"], nested: { z: 2, a: 1 } },
    },
  ]);
  const reorderedObject = digestStructuredEntries([
    {
      path: "data/example.yaml",
      value: { nested: { a: 1, z: 2 }, values: ["a", "b"], count: 1 },
    },
  ]);

  assert.equal(baseline, reorderedObject);
  assert.notEqual(
    baseline,
    digestStructuredEntries([
      {
        path: "data/example.yaml",
        value: { count: 1, values: ["b", "a"], nested: { a: 1, z: 2 } },
      },
    ]),
  );
  assert.notEqual(
    baseline,
    digestStructuredEntries([
      {
        path: "data/example.yaml",
        value: { count: 2, values: ["a", "b"], nested: { a: 1, z: 2 } },
      },
    ]),
  );
});
