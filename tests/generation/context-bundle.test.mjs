import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildContextBundle,
  renderContextBundle,
  validateBundleClosure,
} from "../../scripts/lib/context-bundle.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
import {
  canonicalSystemFixtureFiles,
  copyFixtureFile,
  createSystemFixture,
  writeFixtureFile,
} from "../helpers/system-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function build(options) {
  return buildContextBundle({ repoRoot, ...options });
}

function blockerCodes(result) {
  assert.equal(result.status, "blocked");
  return result.blockers.map(({ code }) => code);
}

async function canonicalFixture(t) {
  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);
  await Promise.all(
    canonicalSystemFixtureFiles.map((path) =>
      copyFixtureFile(repoRoot, fixture.root, path),
    ),
  );
  return fixture;
}

async function mutateComponent(root, library, componentId, mutate) {
  const path = `data/components/${library}.yaml`;
  const document = await readStrictYaml(join(root, path));
  const record = document.components.find(({ id }) => id === componentId);
  assert.ok(record, componentId);
  mutate(record);
  await writeFixtureFile(root, path, `${JSON.stringify(document, null, 2)}\n`);
}

test("unknown route preserves the manifest route blocker", async () => {
  const result = await build({ routeId: "missing-route" });

  assert.deepEqual(blockerCodes(result), ["CONTEXT_BUNDLE_ROUTE_UNKNOWN"]);
  assert.equal(result.blockers[0].path, "/route_id");
});

test("route policies block missing, forbidden, and incomplete selections", async () => {
  const required = await build({
    routeId: "email-new-build",
    viewports: ["mobile", "desktop"],
  });
  assert.deepEqual(blockerCodes(required), [
    "CONTEXT_BUNDLE_COMPONENT_REQUIRED",
  ]);

  const forbidden = await build({
    routeId: "migration-progress",
    candidates: [{ id: "banner-hero" }],
  });
  assert.deepEqual(blockerCodes(forbidden), [
    "CONTEXT_BUNDLE_COMPONENT_FORBIDDEN",
  ]);

  const viewportRequired = await build({ routeId: "library-maintenance" });
  assert.deepEqual(blockerCodes(viewportRequired), [
    "CONTEXT_BUNDLE_VIEWPORT_REQUIRED",
  ]);

  const bothRequired = await build({
    routeId: "email-new-build",
    candidates: [{ id: "banner-hero" }],
    viewports: ["mobile"],
  });
  assert.deepEqual(blockerCodes(bothRequired), [
    "CONTEXT_BUNDLE_BOTH_VIEWPORTS_REQUIRED",
  ]);
});

test("component selection stays exact and preserves onboarding handoff", async () => {
  const unknown = await build({
    routeId: "email-new-build",
    candidates: [{ id: "unknown-component" }],
    viewports: ["mobile", "desktop"],
  });
  assert.deepEqual(blockerCodes(unknown), ["COMPONENT_UNREGISTERED"]);

  const fuzzy = await build({
    routeId: "email-new-build",
    candidates: [{ figma_name: "Banner/Hero" }],
    viewports: ["mobile", "desktop"],
  });
  assert.deepEqual(blockerCodes(fuzzy), ["COMPONENT_IDENTITY_REQUIRED"]);

  const unregisteredIdentity = await build({
    routeId: "email-new-build",
    candidates: [
      {
        figma_identity: {
          file_key: "8zka5bHkcrJVK9I9dKjnhC",
          node_id: "999:999",
          figma_name: "Banner/Unknown",
        },
      },
    ],
    viewports: ["mobile", "desktop"],
  });
  assert.deepEqual(blockerCodes(unregisteredIdentity), [
    "COMPONENT_UNREGISTERED",
  ]);
  assert.equal(
    unregisteredIdentity.blockers[0].handoff.route_id,
    "component-onboarding",
  );
});

test("inactive root component preserves the component resolver blocker", async (t) => {
  const fixture = await canonicalFixture(t);
  await mutateComponent(
    fixture.root,
    "marketing",
    "banner-hero",
    (record) => {
      record.status = "draft";
    },
  );

  const result = await buildContextBundle({
    repoRoot: fixture.root,
    routeId: "email-new-build",
    candidates: [{ id: "banner-hero" }],
    viewports: ["mobile", "desktop"],
  });

  assert.deepEqual(blockerCodes(result), ["COMPONENT_NOT_ACTIVE"]);
});

test("email bundle contains only exact component closure and referenced facts", async () => {
  const options = {
    routeId: "email-new-build",
    candidates: [{ id: "banner-hero" }],
    viewports: ["mobile", "desktop"],
  };
  const first = await build(options);
  const second = await build(options);

  assert.equal(first.status, "resolved");
  assert.deepEqual(first, second);
  assert.equal(first.bundle.digest, second.bundle.digest);
  assert.match(first.bundle.digest, /^sha256:[0-9a-f]{64}$/u);
  assert.deepEqual(
    first.bundle.static_sources.map(({ id }) => id),
    [
      "repository-readme",
      "email-figma-prompt",
      "email-build-checkpoint",
      "email-project-brief",
    ],
  );
  assert.deepEqual(
    first.bundle.components.map(({ id }) => id),
    ["button-primary", "banner-hero"],
  );

  const hero = first.bundle.components.find(({ id }) => id === "banner-hero");
  assert.deepEqual(Object.keys(hero.contracts), ["mobile", "desktop"]);
  assert.deepEqual(hero.variants.map(({ id }) => id), ["mobile", "desktop"]);
  assert.deepEqual(
    hero.properties.map(({ id }) => id),
    ["show-body", "show-button"],
  );
  assert.deepEqual(hero.asset_contracts.map(({ id }) => id), ["hero-image"]);
  assert.equal(Object.hasOwn(hero, "figma_description"), false);

  assert.deepEqual(
    [...new Set(first.bundle.foundation_definitions.map(
      ({ foundation_id }) => foundation_id,
    ))],
    ["assets"],
  );
  assert.deepEqual(
    first.bundle.foundation_definitions.map(
      ({ definition_group, definition_id }) =>
        `${definition_group}/${definition_id}`,
    ),
    [
      "alpha_modes/none",
      "clipping_policies/preserve-artwork",
      "display_modes/direct-image",
      "export_profiles/jpeg-2x",
      "source_modes/image-fill",
    ],
  );

  const sourceIds = first.bundle.static_sources.map(({ id }) => id);
  for (const forbidden of [
    "component-descriptions-registry",
    "typography-registry",
    "figma-component-naming-standard",
    "library-maintenance-checkpoint",
    "component-contract-standard",
    "figma-component-description-standard",
  ]) {
    assert.equal(sourceIds.includes(forbidden), false, forbidden);
  }

  assert.deepEqual(validateBundleClosure(first.bundle), []);
  assert.equal(typeof renderContextBundle(first.bundle), "string");
  assert.equal(
    renderContextBundle(first.bundle),
    renderContextBundle(second.bundle),
  );
});

test("dependency closure order is independent from candidate order", async () => {
  const left = await build({
    routeId: "email-new-build",
    candidates: [{ id: "banner-hero" }, { id: "button-secondary" }],
    viewports: ["mobile", "desktop"],
  });
  const right = await build({
    routeId: "email-new-build",
    candidates: [{ id: "button-secondary" }, { id: "banner-hero" }],
    viewports: ["mobile", "desktop"],
  });

  assert.equal(left.status, "resolved");
  assert.equal(right.status, "resolved");
  assert.deepEqual(left.bundle.components, right.bundle.components);
  assert.equal(left.bundle.digest, right.bundle.digest);
});

test("referenced spacing is projected as exact viewport values only", async (t) => {
  const fixture = await canonicalFixture(t);
  await mutateComponent(
    fixture.root,
    "marketing",
    "banner-hero",
    (record) => {
      for (const viewport of ["mobile", "desktop"]) {
        record.contracts[viewport].root.facts.push({
          id: "test-spacing-reference",
          value: {
            type: "foundation-reference",
            foundation_id: "spacing",
            definition_group: "roles",
            definition_id: "surface-padding-primary",
          },
        });
      }
    },
  );

  const result = await buildContextBundle({
    repoRoot: fixture.root,
    routeId: "email-new-build",
    candidates: [{ id: "banner-hero" }],
    viewports: ["mobile", "desktop"],
  });

  assert.equal(result.status, "resolved");
  const spacing = result.bundle.foundation_definitions.filter(
    ({ foundation_id }) => foundation_id === "spacing",
  );
  assert.deepEqual(
    spacing.map(({ viewport, value }) => [viewport, value.value_px]),
    [
      ["mobile", 22],
      ["desktop", 32],
    ],
  );
  for (const definition of spacing) {
    assert.equal(Object.hasOwn(definition.value, "purpose"), false);
    assert.equal(Object.hasOwn(definition.value, "applicability"), false);
    assert.equal(Object.hasOwn(definition.value, "resolutions"), false);
  }
});

test("closure validation reports the exact parent contract path", async () => {
  const result = await build({
    routeId: "email-new-build",
    candidates: [{ id: "banner-hero" }],
    viewports: ["mobile", "desktop"],
  });
  assert.equal(result.status, "resolved");

  const broken = structuredClone(result.bundle);
  broken.components = broken.components.filter(
    ({ id }) => id !== "button-primary",
  );
  const errors = validateBundleClosure(broken);

  assert.equal(
    errors.some(
      ({ code, path }) =>
        code === "CONTEXT_BUNDLE_COMPONENT_UNRESOLVED" &&
        path.startsWith("banner-hero/contracts/mobile/"),
    ),
    true,
  );
});

test("routes without component context stay minimal", async () => {
  const migration = await build({ routeId: "migration-progress" });
  assert.equal(migration.status, "resolved");
  assert.deepEqual(migration.bundle.components, []);
  assert.deepEqual(migration.bundle.foundation_definitions, []);
  assert.deepEqual(
    migration.bundle.static_sources.map(({ id }) => id),
    [
      "repository-readme",
      "migration-roadmap",
      "library-maintenance-checkpoint",
    ],
  );

  const naming = await build({
    routeId: "figma-naming-audit",
    foundationIds: ["figma-naming"],
  });
  assert.equal(naming.status, "resolved");
  assert.deepEqual(naming.bundle.components, []);
  assert.deepEqual(
    [...new Set(naming.bundle.foundation_definitions.map(
      ({ foundation_id }) => foundation_id,
    ))],
    ["figma-naming"],
  );
});

