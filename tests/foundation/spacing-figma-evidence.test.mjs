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
  if (address.field_path === "/itemSpacing") return address.raw.itemSpacing;
  if (address.field_path === "/counterAxisSpacing") return address.raw.counterAxisSpacing;
  return address.raw.padding[paddingIndex];
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

const CONFIRMED_ROLE_IDS = Object.freeze([
  "self-horizontal-inset",
  "surface-padding-primary",
  "surface-padding-compact",
  "section-stack-standard",
  "collection-stack-spacious",
  "visual-item-stack",
  "details-row-stack",
  "inline-peer-compact",
  "text-stack-standard",
  "text-stack-tight",
  "asset-to-content-standard",
  "asset-to-content-compact",
]);
const UNRESOLVED_ROLE_IDS = Object.freeze([
  "outer-flow",
  "common-horizontal-inset",
  "inline-peer-standard",
]);
const VIEWPORTS = Object.freeze(["mobile", "desktop"]);
const REQUIRED_ADDRESS_KEYS = Object.freeze([
  "role_id",
  "viewport",
  "node_id",
  "variant",
  "field_path",
  "relationship",
  "owner",
  "raw",
  "binding",
  "result",
]);

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

function capturedAddress(fixture, roleId, viewport) {
  const matches = fixture.addresses.filter(
    (address) => address.role_id === roleId && address.viewport === viewport,
  );
  assert.equal(matches.length, 1, `expected one capture address for ${roleId}/${viewport}`);
  return matches[0];
}

test("spacing Figma capture has the required auditable address shape and exact role/viewport coverage", async () => {
  const [fixture, spacing] = await Promise.all([capture(), readStrictYaml(spacingPath)]);
  const expectedRoleIds = [...CONFIRMED_ROLE_IDS, ...UNRESOLVED_ROLE_IDS].sort();

  assert.match(fixture.file_key, /^[A-Za-z0-9]+$/u);
  assert.match(fixture.captured_at, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/u);

  assert.deepEqual(sortedUnique(spacing.roles.map(({ id }) => id)), expectedRoleIds);
  assert.equal(fixture.addresses.length, expectedRoleIds.length * VIEWPORTS.length);
  assert.deepEqual(
    sortedUnique(fixture.addresses.map(({ role_id }) => role_id)),
    expectedRoleIds,
  );

  for (const roleId of expectedRoleIds) {
    for (const viewport of VIEWPORTS) {
      const address = capturedAddress(fixture, roleId, viewport);
      for (const key of REQUIRED_ADDRESS_KEYS) {
        assert.equal(Object.hasOwn(address, key), true, `${roleId}/${viewport} missing ${key}`);
      }
      assert.match(address.node_id, /^\d+:\d+$/u);
      assert.equal(typeof address.variant, "string");
      assert.ok(address.variant.length > 0);
      assert.match(address.field_path, /^\/(?:paddingTop|paddingLeft|itemSpacing)$/u);
      assert.equal(typeof address.relationship, "string");
      assert.ok(address.relationship.length > 0);
      assert.equal(typeof address.owner, "string");
      assert.ok(address.owner.length > 0);
      assert.deepEqual(Object.keys(address.raw).sort(), [
        "alignment",
        "counterAxisSpacing",
        "itemSpacing",
        "padding",
        "sizing",
      ]);
      assert.equal(address.raw.padding.length, 4);
      assert.equal(address.raw.padding.every(Number.isFinite), true);
      assert.equal(Number.isFinite(address.raw.itemSpacing), true);
      assert.equal(Number.isFinite(address.raw.counterAxisSpacing), true);
      assert.equal(address.raw.alignment.length, 2);
      assert.equal(address.raw.alignment.every((value) => typeof value === "string" && value.length > 0), true);
      assert.equal(address.raw.sizing.length, 4);
      assert.equal(address.raw.sizing.every((value) => typeof value === "string" && value.length > 0), true);
      assert.deepEqual(Object.keys(address.binding).sort(), ["id", "kind", "name", "resolved_type"]);
      assert.equal(address.binding.kind, "variable");
      assert.match(address.binding.id, /^VariableID:\d+:\d+$/u);
      assert.equal(typeof address.binding.name, "string");
      assert.ok(address.binding.name.length > 0);
      assert.equal(address.binding.resolved_type, "FLOAT");
      assert.equal(Number.isFinite(capturedFieldValue(address)), true);
    }
  }
});

test("each confirmed spacing resolution exactly matches its Figma capture provenance", async () => {
  const [fixture, spacing] = await Promise.all([capture(), readStrictYaml(spacingPath)]);
  for (const roleId of CONFIRMED_ROLE_IDS) {
    const role = spacing.roles.find(({ id }) => id === roleId);
    assert.ok(role, roleId);
    for (const viewport of VIEWPORTS) {
      const address = capturedAddress(fixture, roleId, viewport);
      assert.equal(address.result, "confirmed", `${roleId}/${viewport}`);
      assert.deepEqual(role.resolutions[viewport].provenance, {
        kind: "figma-variable",
        file_key: fixture.file_key,
        evidence_node_id: address.node_id,
        field_path: address.field_path,
        variable_id: address.binding.id,
        variable_name: address.binding.name,
        variable_resolved_type: address.binding.resolved_type,
        captured_at: fixture.captured_at,
      });
    }
  }
});

test("only the exact unresolved spacing roles remain registry literals in both viewports", async () => {
  const [fixture, spacing] = await Promise.all([capture(), readStrictYaml(spacingPath)]);
  assert.deepEqual(
    sortedUnique(fixture.addresses.filter(({ result }) => result === "unresolved").map(({ role_id }) => role_id)),
    [...UNRESOLVED_ROLE_IDS].sort(),
  );
  assert.deepEqual(
    sortedUnique(fixture.addresses.filter(({ result }) => result === "confirmed").map(({ role_id }) => role_id)),
    [...CONFIRMED_ROLE_IDS].sort(),
  );

  for (const roleId of UNRESOLVED_ROLE_IDS) {
    const role = spacing.roles.find(({ id }) => id === roleId);
    assert.ok(role, roleId);
    for (const viewport of VIEWPORTS) {
      const address = capturedAddress(fixture, roleId, viewport);
      assert.equal(address.result, "unresolved", `${roleId}/${viewport}`);
      assert.equal(typeof address.reason, "string");
      assert.ok(address.reason.length > 0);
      assert.equal(role.resolutions[viewport].provenance.kind, "registry-literal");
    }
  }
});


const CONFIRMED_CAPTURE_EXPECTATIONS = Object.freeze({
  "self-horizontal-inset": {
    mobile: { node_id: "15:599", variant: "Viewport=Mobile, Count=3", field_path: "/paddingLeft" },
    desktop: { node_id: "260:3974", variant: "Viewport=Desktop, Count=3", field_path: "/paddingLeft" },
  },
  "surface-padding-primary": {
    mobile: { node_id: "11:773", variant: "Viewport=Mobile", field_path: "/paddingTop" },
    desktop: { node_id: "230:3756", variant: "Viewport=Desktop", field_path: "/paddingTop" },
  },
  "surface-padding-compact": {
    mobile: { node_id: "16:2734", variant: "Viewport=Mobile", field_path: "/paddingTop" },
    desktop: { node_id: "260:562", variant: "Viewport=Desktop", field_path: "/paddingTop" },
  },
  "section-stack-standard": {
    mobile: { node_id: "11:773", variant: "Viewport=Mobile", field_path: "/itemSpacing" },
    desktop: { node_id: "230:3756", variant: "Viewport=Desktop", field_path: "/itemSpacing" },
  },
  "collection-stack-spacious": {
    mobile: { node_id: "398:7599", variant: "Viewport=Mobile", field_path: "/itemSpacing" },
    desktop: { node_id: "398:7571", variant: "Viewport=Desktop", field_path: "/itemSpacing" },
  },
  "visual-item-stack": {
    mobile: { node_id: "398:7599", variant: "Viewport=Mobile", field_path: "/itemSpacing" },
    desktop: { node_id: "398:7573", variant: "Viewport=Desktop", field_path: "/itemSpacing" },
  },
  "details-row-stack": {
    mobile: { node_id: "502:24639", variant: "Viewport=Mobile", field_path: "/itemSpacing" },
    desktop: { node_id: "502:24638", variant: "Viewport=Desktop", field_path: "/itemSpacing" },
  },
  "inline-peer-compact": {
    mobile: { node_id: "17:2749", variant: "Viewport=Mobile", field_path: "/itemSpacing" },
    desktop: { node_id: "261:4006", variant: "Viewport=Desktop", field_path: "/itemSpacing" },
  },
  "text-stack-standard": {
    mobile: { node_id: "11:774", variant: "Viewport=Mobile", field_path: "/itemSpacing" },
    desktop: { node_id: "230:3757", variant: "Viewport=Desktop", field_path: "/itemSpacing" },
  },
  "text-stack-tight": {
    mobile: { node_id: "222:699", variant: "Viewport=Mobile", field_path: "/itemSpacing" },
    desktop: { node_id: "234:577", variant: "Viewport=Desktop", field_path: "/itemSpacing" },
  },
  "asset-to-content-standard": {
    mobile: { node_id: "459:28003", variant: "Viewport=Mobile", field_path: "/itemSpacing" },
    desktop: { node_id: "459:27423", variant: "Viewport=Desktop", field_path: "/itemSpacing" },
  },
  "asset-to-content-compact": {
    mobile: { node_id: "222:702", variant: "Viewport=Mobile", field_path: "/itemSpacing" },
    desktop: { node_id: "234:580", variant: "Viewport=Desktop", field_path: "/itemSpacing" },
  },
});

test("each confirmed capture proves the exact role semantics, variant, node, field, and value", async () => {
  const [fixture, spacing] = await Promise.all([capture(), readStrictYaml(spacingPath)]);
  assert.deepEqual(Object.keys(CONFIRMED_CAPTURE_EXPECTATIONS).sort(), [...CONFIRMED_ROLE_IDS].sort());

  for (const roleId of CONFIRMED_ROLE_IDS) {
    const role = spacing.roles.find(({ id }) => id === roleId);
    assert.ok(role, roleId);
    for (const viewport of VIEWPORTS) {
      const address = capturedAddress(fixture, roleId, viewport);
      const expectedAddress = CONFIRMED_CAPTURE_EXPECTATIONS[roleId][viewport];
      assert.deepEqual(
        {
          node_id: address.node_id,
          variant: address.variant,
          field_path: address.field_path,
        },
        expectedAddress,
        `${roleId}/${viewport}`,
      );
      assert.equal(address.relationship, role.relationship, `${roleId}/${viewport} relationship`);
      assert.equal(address.owner, role.owner, `${roleId}/${viewport} owner`);
      assert.equal(
        capturedFieldValue(address),
        role.resolutions[viewport].value_px,
        `${roleId}/${viewport} exact ${address.field_path} value`,
      );
    }
  }
});
