import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { auditRendererReadiness } from "../../scripts/lib/renderer-readiness.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

test("reports the measured renderer-readiness gaps without mutating contracts", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const before = structuredClone(registries);

  const report = auditRendererReadiness(registries);

  assert.equal(report.summary.components, 61);
  assert.equal(report.summary.active_components, 61);
  assert.equal(report.summary.facts, 395);
  assert.equal(report.summary.generic_description_facts, 386);
  assert.equal(report.summary.components_with_generic_facts, 46);
  assert.equal(report.summary.components_with_properties, 16);
  assert.equal(report.summary.components_with_assets, 27);
  assert.equal(report.summary.missing_coverage, 61);
  assert.deepEqual(registries, before);

  const cardImage = report.components.find(({ id }) => id === "card-image");
  assert.equal(cardImage.ready, false);
  assert.ok(
    cardImage.issues.some(({ code }) => code === "RENDER_FACT_ID_GENERIC"),
  );
});

test("returns stable issue shapes and deterministic ordering", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const report = auditRendererReadiness(registries);

  for (const component of report.components) {
    assert.deepEqual(
      component.issues,
      [...component.issues].sort(
        (left, right) =>
          left.component_id.localeCompare(right.component_id) ||
          left.viewport.localeCompare(right.viewport) ||
          left.path.localeCompare(right.path) ||
          left.code.localeCompare(right.code),
      ),
    );
    for (const issue of component.issues) {
      assert.deepEqual(Object.keys(issue).sort(), [
        "code",
        "component_id",
        "path",
        "viewport",
      ]);
    }
  }

  assert.deepEqual(
    report.components.map(({ id }) => id),
    report.components.map(({ id }) => id).toSorted(),
  );
  assert.ok(
    report.components.some(({ issues }) =>
      issues.some(({ code }) => code === "RENDER_FACT_OWNER_ROOT"),
    ),
  );
  assert.ok(
    report.components.some(({ issues }) =>
      issues.some(({ code }) => code === "RENDER_CONTENT_SLOT_MISSING"),
    ),
  );
  assert.ok(
    report.components.every(({ issues }) =>
      issues.some(({ code }) => code === "RENDER_COVERAGE_MISSING"),
    ),
  );
});
