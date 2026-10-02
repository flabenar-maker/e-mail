import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { buildContextBundle } from "../../scripts/lib/context-bundle.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import { canonicalSystemFixtureFiles, copyFixtureFile, createSystemFixture, writeFixtureFile } from "../helpers/system-fixture.mjs";

async function fixture(t) { const value = await createSystemFixture(); t.after(value.cleanup); await Promise.all(canonicalSystemFixtureFiles.map((path) => copyFixtureFile(process.cwd(), value.root, path))); return value; }
function metadata(id) { return { foundation_values: [{ id: id + "-foundation", source: { variant_node_id: "1:1", node_id: "1:1", field_path: "/fills/0/color" }, target: { source_id: "rendering-foundation", pointer: "/shell/background_color" }, comparison: "opaque-solid-color" }], source_dependencies: [{ id: id + "-source", source: { variant_node_id: "1:1", node_id: "1:2" }, target: { component_id: "asset-product-logo", variant_id: "product-cupis" }, asset_owner: { node_id: "1:2", asset_id: "header-logo" } }] }; }
function comparable(bundle) { const copy = structuredClone(bundle); delete copy.digest; for (const source of copy.static_sources) { delete source.digest; delete source.version; } return copy; }
test("email-route bundles exclude evidence metadata and change only source/version digests after documentation projection", async (t) => {
  const root = await fixture(t);
  const options = { candidates: [{ id: "email-header" }], viewports: ["mobile", "desktop"] };
  const before = {};
  for (const routeId of ["email-new-build", "email-continue-fix"]) { const result = await buildContextBundle({ repoRoot: root.root, routeId, ...options }); assert.equal(result.status, "resolved"); before[routeId] = result.bundle; }
  const document = await readStrictYaml(join(root.root, "data/components/marketing.yaml"));
  document.components.find(({ id }) => id === "email-header").evidence_links = metadata("header");
  await writeFixtureFile(root.root, "data/components/marketing.yaml", JSON.stringify(document, null, 2) + "\n");
  for (const routeId of Object.keys(before)) { const result = await buildContextBundle({ repoRoot: root.root, routeId, ...options }); assert.equal(result.status, "resolved"); assert.deepEqual(result.bundle.components, before[routeId].components); assert.deepEqual(comparable(result.bundle), comparable(before[routeId])); }
});
