import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  compareFigmaComponentSnapshot,
  fingerprintFigmaComponent,
  normalizeFigmaComponentSnapshot,
} from "../../scripts/lib/figma-component-snapshot.mjs";
import {
  indexComponentRegistries,
  loadComponentRegistry,
} from "../../scripts/lib/component-registry.mjs";
import { renderComponentDescription } from "../../scripts/lib/component-description.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const fileKey = "8zka5bHkcrJVK9I9dKjnhC";

function rawComponent(overrides = {}) {
  return {
    node_id: "1102:8",
    name: "Email/Template",
    node_kind: "component-set",
    description: "Email/Template\r\n\r\nROLE\r\nRoot\r\n",
    variants: [
      {
        node_id: "1102:7",
        axes: [{ name: "Viewport", value: "Desktop" }],
        width: 600,
        height: 1000,
        absoluteBoundingBox: { x: 999, y: 999 },
      },
      {
        node_id: "1102:6",
        axes: [{ name: "Viewport", value: "Mobile" }],
        width: 328,
        height: 1000,
      },
    ],
    properties: [{ name: "Content", type: "slot", default: null }],
    semantic_children: [
      { path: "root/content", semantic_role: "content", node_kind: "frame" },
    ],
    bindings: [
      { node_id: "1102:6", binding_name: "mobile/block-margin" },
    ],
    contract_geometry: {
      desktop: { width: 600, height: 1000 },
      mobile: { width: 328, height: 1000 },
    },
    metadata: { request_id: "volatile" },
    ...overrides,
  };
}

function rawSnapshot(component = rawComponent()) {
  return {
    schema_version: "1.0.0",
    file_key: fileKey,
    captured_at: "2026-09-06T12:14:00Z",
    roots: [
      {
        node_id: "1084:34055",
        components: [component],
        mcp_metadata: { cursor: "volatile" },
      },
    ],
    request_id: "volatile",
  };
}

function emptyRegistry(library, root) {
  return {
    schema_version: "1.0.0",
    registry: {
      id: `components-${library}`,
      library,
      status: "shadow",
      source: {
        figma_file_key: fileKey,
        roots: [{ role: "library", node_id: root }],
        baseline_path: "registry/email-component-descriptions-registry.md",
        baseline_commit: "397e13a916e9af1c2dfd8af663de730bcc2e1874",
        verified_at: "2026-09-06",
      },
    },
    components: [],
  };
}

async function comparisonFixture() {
  const shared = await loadComponentRegistry({
    repoRoot,
    dataPath: "data/components/shared.yaml",
  });
  const record = structuredClone(
    shared.components.find((item) => item.id === "email-template"),
  );
  const registries = {
    marketing: emptyRegistry("marketing", "538:17236"),
    service: emptyRegistry("service", "538:17235"),
    shared: { ...shared, components: [record] },
  };
  const index = indexComponentRegistries(registries);
  const component = rawComponent({
    description: renderComponentDescription(record, index),
    variants: record.variants.map((variant) => ({
      node_id: variant.node_id,
      axes: variant.axes,
    })),
    properties: record.properties.map((property) => ({
      name: property.figma_name,
      type: property.type,
      default: property.default,
    })),
    semantic_children: [],
    bindings: [],
    contract_geometry: {},
  });
  const snapshot = normalizeFigmaComponentSnapshot(rawSnapshot(component));
  record.figma.structure_fingerprint = fingerprintFigmaComponent(
    snapshot.roots[0].components[0],
  );
  return { registries, index: indexComponentRegistries(registries), snapshot };
}

test("snapshot normalization is deterministic and removes volatile metadata", () => {
  const first = rawSnapshot();
  const second = rawSnapshot({
    ...rawComponent(),
    variants: [...rawComponent().variants].reverse(),
    bindings: [...rawComponent().bindings].reverse(),
  });
  second.roots = [...second.roots].reverse();

  const a = normalizeFigmaComponentSnapshot(first);
  const b = normalizeFigmaComponentSnapshot(second);
  assert.deepEqual(a, b);
  assert.equal(a.roots[0].components[0].description.includes("\r"), false);
  assert.equal("metadata" in a.roots[0].components[0], false);
  assert.equal("absoluteBoundingBox" in a.roots[0].components[0].variants[0], false);
  assert.match(
    fingerprintFigmaComponent(a.roots[0].components[0]),
    /^sha256:[0-9a-f]{64}$/,
  );
  assert.equal(
    fingerprintFigmaComponent(a.roots[0].components[0]),
    fingerprintFigmaComponent(b.roots[0].components[0]),
  );
});

test("snapshot normalization rejects malformed input without echoing content", () => {
  const secret = "TOP-SECRET-SNAPSHOT-CONTENT";
  assert.throws(
    () => normalizeFigmaComponentSnapshot({ file_key: secret, roots: "bad" }),
    (error) =>
      error.code === "FIGMA_COMPONENT_SNAPSHOT_INVALID" &&
      !error.message.includes(secret),
  );
});

test("snapshot comparison classifies visual, description and identity drift", async () => {
  const { registries, index, snapshot } = await comparisonFixture();
  assert.deepEqual(
    compareFigmaComponentSnapshot({ snapshot, registries, componentIndex: index }),
    [],
  );

  const visual = structuredClone(snapshot);
  visual.roots[0].components[0].contract_geometry = { width: 601 };
  assert.equal(
    compareFigmaComponentSnapshot({ snapshot: visual, registries, componentIndex: index })[0].type,
    "visual-drift",
  );

  const description = structuredClone(snapshot);
  description.roots[0].components[0].description = "changed\n";
  assert.equal(
    compareFigmaComponentSnapshot({ snapshot: description, registries, componentIndex: index })[0].type,
    "description-drift",
  );

  const identity = structuredClone(snapshot);
  identity.roots[0].components[0].name = "Email/Renamed";
  assert.equal(
    compareFigmaComponentSnapshot({ snapshot: identity, registries, componentIndex: index })[0].type,
    "identity-drift",
  );
});

test("snapshot comparison reports unregistered and missing records", async () => {
  const { registries, index, snapshot } = await comparisonFixture();
  const unregistered = structuredClone(snapshot);
  unregistered.roots[0].components.push(
    rawComponent({ node_id: "9999:1", name: "Block/New" }),
  );
  assert.ok(
    compareFigmaComponentSnapshot({
      snapshot: normalizeFigmaComponentSnapshot(unregistered),
      registries,
      componentIndex: index,
    }).some((drift) => drift.type === "unregistered"),
  );

  const missing = structuredClone(snapshot);
  missing.roots[0].components = [];
  assert.equal(
    compareFigmaComponentSnapshot({ snapshot: missing, registries, componentIndex: index })[0].type,
    "missing",
  );
});

test("description mode none never creates description drift", async () => {
  const shared = await loadComponentRegistry({
    repoRoot,
    dataPath: "data/components/shared.yaml",
  });
  const icon = structuredClone(
    shared.components.find((item) => item.description.mode === "none"),
  );
  const registries = {
    marketing: emptyRegistry("marketing", "538:17236"),
    service: emptyRegistry("service", "538:17235"),
    shared: { ...shared, components: [icon] },
  };
  const snapshot = normalizeFigmaComponentSnapshot({
    schema_version: "1.0.0",
    file_key: fileKey,
    captured_at: "2026-09-06T12:14:00Z",
    roots: [{
      node_id: "539:38025",
      components: [rawComponent({
        node_id: icon.figma.node_id,
        name: icon.identity.figma_name,
        node_kind: icon.identity.node_kind,
        description: "arbitrary Figma text",
        variants: [],
        properties: [],
        semantic_children: [],
        bindings: [],
        contract_geometry: {},
      })],
    }],
  });
  icon.figma.structure_fingerprint = fingerprintFigmaComponent(
    snapshot.roots[0].components[0],
  );
  const drifts = compareFigmaComponentSnapshot({
    snapshot,
    registries,
    componentIndex: indexComponentRegistries(registries),
  });
  assert.equal(drifts.some((drift) => drift.type === "description-drift"), false);
});

test("normalizer CLI writes deterministic JSON only to the explicit output", async () => {
  const dir = await mkdtemp(join(tmpdir(), "cupis-component-normalize-"));
  const input = join(dir, "input.json");
  const output = join(dir, "output.json");
  const sentinel = join(dir, "sentinel.txt");
  await writeFile(input, JSON.stringify(rawSnapshot()), "utf8");
  await writeFile(sentinel, "unchanged", "utf8");

  const args = [
    join(repoRoot, "scripts/normalize-figma-snapshot.mjs"),
    "--input", input,
    "--output", output,
  ];
  const first = spawnSync(process.execPath, args, { encoding: "utf8" });
  assert.equal(first.status, 0, first.stderr);
  const firstOutput = await readFile(output, "utf8");
  const second = spawnSync(process.execPath, args, { encoding: "utf8" });
  assert.equal(second.status, 0, second.stderr);
  assert.equal(await readFile(output, "utf8"), firstOutput);
  assert.equal(await readFile(sentinel, "utf8"), "unchanged");
  assert.deepEqual((await readdir(dir)).sort(), ["input.json", "output.json", "sentinel.txt"]);
});

test("snapshot CLIs reject unknown arguments and sanitize invalid input", async () => {
  const dir = await mkdtemp(join(tmpdir(), "cupis-component-cli-"));
  const invalid = join(dir, "invalid.json");
  await writeFile(invalid, '{"secret":"DO-NOT-ECHO"', "utf8");

  const normalize = spawnSync(
    process.execPath,
    [
      join(repoRoot, "scripts/normalize-figma-snapshot.mjs"),
      "--input", invalid,
      "--output", join(dir, "output.json"),
      "--unknown", "value",
    ],
    { encoding: "utf8" },
  );
  assert.equal(normalize.status, 1);
  assert.match(normalize.stderr, /cli-arguments/u);
  assert.doesNotMatch(normalize.stderr, /DO-NOT-ECHO/u);

  const compare = spawnSync(
    process.execPath,
    [
      join(repoRoot, "scripts/compare-figma-registry.mjs"),
      "--repo-root", repoRoot,
      "--snapshot", invalid,
    ],
    { encoding: "utf8" },
  );
  assert.equal(compare.status, 1);
  assert.match(compare.stderr, /figma-component-snapshot-read/u);
  assert.doesNotMatch(compare.stderr, /DO-NOT-ECHO/u);
});

test("comparison CLI is read-only and uses exit codes for clean and drift", async () => {
  const dir = await mkdtemp(join(tmpdir(), "cupis-component-compare-"));
  const cleanPath = join(dir, "clean.json");
  const driftPath = join(dir, "drift.json");
  const clean = normalizeFigmaComponentSnapshot({
    schema_version: "1.0.0",
    file_key: fileKey,
    captured_at: "2026-09-06T12:14:00Z",
    roots: [],
  });
  const drift = normalizeFigmaComponentSnapshot({
    schema_version: "1.0.0",
    file_key: fileKey,
    captured_at: "2026-09-06T12:14:00Z",
    roots: [{
      node_id: "539:38025",
      components: [rawComponent({ node_id: "9999:1", name: "Block/New" })],
    }],
  });
  await writeFile(cleanPath, JSON.stringify(clean), "utf8");
  await writeFile(driftPath, JSON.stringify(drift), "utf8");

  const cli = join(repoRoot, "scripts/compare-figma-registry.mjs");
  const run = (path) => spawnSync(
    process.execPath,
    [cli, "--repo-root", repoRoot, "--snapshot", path],
    { encoding: "utf8" },
  );
  const cleanRun = run(cleanPath);
  assert.equal(cleanRun.status, 0, cleanRun.stderr);
  assert.deepEqual(JSON.parse(cleanRun.stdout), { status: "clean", drifts: [] });
  const driftRun = run(driftPath);
  assert.equal(driftRun.status, 1);
  assert.equal(JSON.parse(driftRun.stdout).status, "drift");
  assert.deepEqual((await readdir(dir)).sort(), ["clean.json", "drift.json"]);
});

test("snapshot modules contain no network or Figma client imports", async () => {
  const files = await Promise.all([
    readFile(join(repoRoot, "scripts/lib/figma-component-snapshot.mjs"), "utf8"),
    readFile(join(repoRoot, "scripts/normalize-figma-snapshot.mjs"), "utf8"),
    readFile(join(repoRoot, "scripts/compare-figma-registry.mjs"), "utf8"),
  ]);
  for (const source of files) {
    assert.doesNotMatch(source, /from ["']node:(?:http|https|net|tls)["']/u);
    assert.doesNotMatch(source, /@figma|use_figma|\bfetch\s*\(/u);
  }
  assert.doesNotMatch(files[0], /writeFile|mkdir|rmSync|unlink/u);
  assert.doesNotMatch(files[2], /writeFile|mkdir|rmSync|unlink/u);
});


test("normalizer accepts the actual compact Figma MCP inventory shape", async () => {
  const shared = await loadComponentRegistry({
    repoRoot,
    dataPath: "data/components/shared.yaml",
  });
  const template = shared.components.find((record) => record.id === "email-template");
  const normalized = normalizeFigmaComponentSnapshot({
    schema_version: "1.0.0",
    file_key: fileKey,
    captured_at: "2026-09-06T12:14:00Z",
    roots: [{
      id: "1084:34055",
      components: [{
        id: "1102:8",
        name: "Email/Template",
        type: "COMPONENT_SET",
        description: "",
        variants: [
          {
            id: "1102:6",
            axes: { Viewport: "Mobile" },
            width: 328,
            height: 1000,
          },
          {
            id: "1102:7",
            axes: { Viewport: "Desktop" },
            width: 600,
            height: 1000,
          },
        ],
        properties: [{
          name: "Content#1102:0",
          type: "SLOT",
          defaultValue: null,
        }],
      }],
    }],
  });
  const component = normalized.roots[0].components[0];

  assert.equal(component.node_id, "1102:8");
  assert.equal(component.node_kind, "component-set");
  assert.deepEqual(component.properties, [
    { name: "Content", type: "slot", default: null },
  ]);
  assert.equal(
    fingerprintFigmaComponent(component),
    template.figma.structure_fingerprint,
  );
});


test("ordered semantic children and geometry arrays remain fingerprint-significant", () => {
  const first = normalizeFigmaComponentSnapshot(
    rawSnapshot(
      rawComponent({
        semantic_children: [
          { path: "root/first", semantic_role: "body" },
          { path: "root/second", semantic_role: "action" },
        ],
        contract_geometry: { corner_radii: [8, 16, 24, 32] },
      }),
    ),
  );
  const reorderedChildren = structuredClone(first);
  reorderedChildren.roots[0].components[0].semantic_children.reverse();
  const reorderedGeometry = structuredClone(first);
  reorderedGeometry.roots[0].components[0].contract_geometry.corner_radii.reverse();

  assert.notEqual(
    fingerprintFigmaComponent(first.roots[0].components[0]),
    fingerprintFigmaComponent(reorderedChildren.roots[0].components[0]),
  );
  assert.notEqual(
    fingerprintFigmaComponent(first.roots[0].components[0]),
    fingerprintFigmaComponent(reorderedGeometry.roots[0].components[0]),
  );
});
