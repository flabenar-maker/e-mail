import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { resolveAssetContract } from "../../scripts/lib/assets-foundation.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const fixturePath = join(repoRoot, "tests/foundation/fixtures/assets-figma-capture.json");

async function capture() {
  return JSON.parse(await readFile(fixturePath, "utf8"));
}

async function componentRecords() {
  const families = await Promise.all(["marketing", "service", "shared"].map((family) =>
    readStrictYaml(join(repoRoot, "data/components", `${family}.yaml`)),
  ));
  return families.flatMap((family) => family.components ?? []);
}

function key(selection) {
  return [
    selection.sourceModeId,
    selection.displayModeId,
    selection.exportProfileId,
    selection.expectedAlphaId,
    selection.clippingPolicyId,
  ].join("/");
}

function selectionFromAsset(asset) {
  return {
    sourceModeId: asset.source_mode_id,
    displayModeId: asset.display_mode_id,
    exportProfileId: asset.export_profile_id,
    expectedAlphaId: asset.alpha_mode_id,
    clippingPolicyId: asset.clipping_policy_id,
  };
}

test("Figma asset capture covers every active source/display/profile/alpha/clipping combination", async () => {
  const [evidence, components, assets] = await Promise.all([
    capture(),
    componentRecords(),
    readStrictYaml(join(repoRoot, "data/foundations/assets.yaml")),
  ]);
  const active = new Map();
  for (const component of components) {
    for (const asset of component.asset_contracts ?? []) {
      active.set(key(selectionFromAsset(asset)), { component, asset });
    }
  }
  const captured = new Set(evidence.representatives.map((item) => key(item.foundation_selection)));

  assert.deepEqual([...captured].sort(), [...active.keys()].sort());
  for (const item of evidence.representatives) {
    const component = components.find((candidate) => candidate.id === item.selection.component_id);
    const asset = component?.asset_contracts?.find((candidate) => candidate.id === item.selection.asset_contract_id);
    assert.ok(component, `unknown component ${item.selection.component_id}`);
    assert.ok(asset, `unknown asset ${item.selection.asset_contract_id}`);
    assert.deepEqual(item.foundation_selection, selectionFromAsset(asset));
    assert.equal(resolveAssetContract(assets, item.foundation_selection).export_profile.id, asset.export_profile_id);
  }
});

test("Figma capture keeps export boundaries explicit and unresolved observations typed", async () => {
  const evidence = await capture();
  assert.equal(evidence.schema_version, "1.0.0");
  assert.ok(evidence.historical_comparison_sources.includes("core/asset-export-standard.md"));
  assert.deepEqual(evidence.build_time_gates.map((gate) => gate.status), ["unverified"]);

  for (const item of evidence.representatives) {
    const node = item.live_figma;
    assert.match(node.file_key, /^[A-Za-z0-9]+$/u);
    assert.match(node.node_id, /^\d+:\d+$/u);
    assert.equal(node.viewport, "desktop");
    assert.ok(node.geometry.width > 0 && node.geometry.height > 0);
    assert.equal(node.parent_fill_included, false);
    assert.equal(typeof node.own_visible_fill, "boolean");
    assert.equal(typeof node.visible_nested_graphics, "boolean");
    assert.ok(item.foundation_source_paths.every((path) => path.startsWith("data/foundations/assets.yaml#/")));
    assert.ok(evidence.build_time_gates.some((gate) => gate.id === item.build_time_gate_id));
    if (item.boundary_status === "unresolved") {
      assert.ok(item.unresolved_codes?.every((code) => /^[A-Z0-9_]+$/u.test(code)));
    } else {
      assert.equal(item.boundary_status, "confirmed");
      assert.equal(item.unresolved_codes, undefined);
    }
  }
});

test("rendered card evidence includes its own Fill and visible numbered graphic while excluding the parent Fill", async () => {
  const evidence = await capture();
  const card = evidence.representatives.find((item) => item.id === "card-image-rendered-jpeg-neutralized");

  assert.equal(card.foundation_selection.sourceModeId, "rendered-node");
  assert.equal(card.live_figma.own_visible_fill, true);
  assert.equal(card.live_figma.visible_nested_graphics, true);
  assert.deepEqual(card.live_figma.nested_graphic_names, ["Number"]);
  assert.equal(card.live_figma.parent_fill_included, false);
  assert.equal(card.live_figma.presentation.neutralize_only_presentation_radius, true);
});