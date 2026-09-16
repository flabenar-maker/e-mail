import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { compareFoundationObservation } from "../../scripts/lib/foundation-evidence.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const capturePath = join(repoRoot, "tests/fixtures/foundation/spacing-figma-capture.json");
const spacingPath = join(repoRoot, "data/foundations/spacing.yaml");

async function capture() {
  return JSON.parse(await readFile(capturePath, "utf8"));
}

function sourcePath(roleId, viewport) {
  return `data/foundations/spacing.yaml#/roles[id=${roleId}]/resolutions/${viewport}/value_px`;
}

function expectedResolution(role, viewport) {
  const resolution = role.resolutions[viewport];
  const provenance = resolution.provenance;
  return {
    source_path: sourcePath(role.id, viewport),
    value: resolution.value_px,
    binding: provenance.kind === "figma-variable"
      ? {
          kind: "variable",
          id: provenance.variable_id,
          name: provenance.variable_name,
          resolved_type: provenance.variable_resolved_type,
        }
      : undefined,
  };
}

function capturedFieldValue(address) {
  const paddingIndex = {
    "/paddingTop": 0,
    "/paddingRight": 1,
    "/paddingBottom": 2,
    "/paddingLeft": 3,
  }[address.field_path];
  return address.field_path === "/itemSpacing"
    ? address.raw.itemSpacing
    : address.raw.padding[paddingIndex];
}

function observation(address, fixture) {
  return {
    file_key: fixture.file_key,
    node_id: address.node_id,
    variant: address.variant,
    viewport: address.viewport,
    field_path: address.field_path,
    expected_source_path: sourcePath(address.role_id, address.viewport),
    raw_value: capturedFieldValue(address),
    captured_at: fixture.captured_at,
    binding_claim: "variable",
    binding: address.binding,
  };
}

test("spacing Figma capture covers each role and viewport once with an auditable address", async () => {
  const [fixture, spacing] = await Promise.all([capture(), readStrictYaml(spacingPath)]);
  assert.equal(fixture.kind, "non-normative-figma-capture");
  assert.equal(fixture.addresses.length, spacing.roles.length * 2);

  const keys = fixture.addresses.map(({ role_id, viewport }) => `${role_id}/${viewport}`);
  assert.equal(new Set(keys).size, keys.length);
  for (const role of spacing.roles) {
    for (const viewport of ["mobile", "desktop"]) {
      const address = fixture.addresses.find((item) => item.role_id === role.id && item.viewport === viewport);
      assert.ok(address, `${role.id}/${viewport}`);
      assert.match(address.node_id, /^\d+:\d+$/u);
      assert.match(address.field_path, /^\/(?:paddingTop|paddingLeft|itemSpacing)$/u);
      assert.equal(address.raw.padding.length, 4);
      assert.equal(Number.isFinite(address.raw.itemSpacing), true);
      assert.equal(Number.isFinite(address.raw.counterAxisSpacing), true);
      assert.equal(address.raw.alignment.length, 2);
      assert.equal(address.raw.sizing.length, 4);
      assert.equal(["confirmed", "unresolved"].includes(address.result), true);
    }
  }
});

test("confirmed Figma spacing capture exactly matches the structured role resolution and binding", async () => {
  const [fixture, spacing] = await Promise.all([capture(), readStrictYaml(spacingPath)]);
  for (const address of fixture.addresses.filter(({ result }) => result === "confirmed")) {
    const role = spacing.roles.find(({ id }) => id === address.role_id);
    assert.ok(role, address.role_id);
    const result = compareFoundationObservation({
      observation: observation(address, fixture),
      expected: expectedResolution(role, address.viewport),
      viewport_specific: true,
    });
    assert.equal(result.status, "verified", `${address.role_id}/${address.viewport}: ${result.issue?.code}`);
  }
});

test("unresolved Figma spacing relationships remain visibly unpromoted", async () => {
  const [fixture, spacing] = await Promise.all([capture(), readStrictYaml(spacingPath)]);
  for (const address of fixture.addresses.filter(({ result }) => result === "unresolved")) {
    const role = spacing.roles.find(({ id }) => id === address.role_id);
    assert.ok(address.reason?.length > 0, `${address.role_id}/${address.viewport}`);
    assert.equal(role.resolutions[address.viewport].provenance.kind, "registry-literal");
  }
});