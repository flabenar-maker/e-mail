import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const cli = await import("../../scripts/audit-figma-contract-facts.mjs").catch(() => ({}));
const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

test("CLI loads canonical component and rejects an incomplete live Figma packet", async () => {
  assert.equal(typeof cli.main, "function");
  const dir = await mkdtemp(join(tmpdir(), "cupis-figma-gate-"));
  try {
    const livePath = join(dir, "live.json");
    await writeFile(livePath, JSON.stringify({
      file_key: "8zka5bHkcrJVK9I9dKjnhC",
      component_node_id: "497:26103",
      variants: [],
    }));
    const lines = [];
    const oldLog = console.log;
    console.log = (value) => lines.push(value);
    let code;
    try {
      code = await cli.main([
        "--repo-root", repoRoot,
        "--component-id", "details-operation-plain",
        "--live", livePath,
      ]);
    } finally {
      console.log = oldLog;
    }
    assert.equal(code, 1);
    const report = JSON.parse(lines.join(""));
    assert.equal(report.ok, false);
    assert.ok(report.issues.some((issue) => issue.code === "FIGMA_VARIANT_MISSING"));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("CLI cannot run without separately supplied live Figma data", async () => {
  const result = await cli.main([
    "--repo-root", repoRoot,
    "--component-id", "details-operation-plain",
  ]);
  assert.equal(result, 1);
});


test("CLI refuses an externally supplied fact map", async () => {
  const result = await cli.main([
    "--repo-root", repoRoot,
    "--component-id", "details-operation-plain",
    "--live", "unused.json",
    "--mappings", "outside-contract.json",
  ]);
  assert.equal(result, 1);
});
