import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadComponentRegistries,
  walkComponentElements,
} from "../../scripts/lib/component-registry.mjs";
import { auditRendererReadiness } from "../../scripts/lib/renderer-readiness.mjs";
import {
  loadRendererRegistry,
  resolveRendererCoverage,
  validateRendererReadyComponent,
} from "../../scripts/lib/renderer-registry.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function componentById(registries, componentId) {
  for (const document of Object.values(registries)) {
    const record = document.components.find(({ id }) => id === componentId);
    if (record) return record;
  }
  throw new Error(`Unknown test component: ${componentId}`);
}

function elementById(record, viewport, elementId) {
  let result = null;
  walkComponentElements(record, ({ viewport: current, element }) => {
    if (current === viewport && element.id === elementId) result = element;
  });
  return result;
}

test("uncovered components report coverage only without speculative interpretation", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const before = structuredClone(registries);

  const report = auditRendererReadiness(registries);

  assert.equal(report.summary.components, 61);
  assert.equal(report.summary.active_components, 61);
  assert.equal(report.summary.components_with_properties, 16);
  assert.equal(report.summary.components_with_assets, 27);
  assert.equal(report.summary.missing_coverage, 61);
  assert.deepEqual(registries, before);

  const cardImage = report.components.find(({ id }) => id === "card-image");
  assert.equal(cardImage.ready, false);
  assert.deepEqual(cardImage.issues.map(({ code }) => code), [
    "RENDER_COVERAGE_MISSING",
  ]);
});

test("all six pilot interpreter contracts are renderer-ready", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const rendererRegistry = await loadRendererRegistry({ repoRoot });

  for (const entry of rendererRegistry.coverage) {
    const record = componentById(registries, entry.component_id);
    assert.equal(entry.mode, "interpreter");
    assert.deepEqual(validateRendererReadyComponent(record, entry), []);
  }

  const report = auditRendererReadiness(registries, rendererRegistry);
  assert.equal(report.summary.covered_active_components, 6);
  assert.equal(report.summary.ready_components, 6);
  assert.equal(report.summary.missing_coverage, 55);
});

test("pilot contracts retain their critical rendering structures", async () => {
  const registries = await loadComponentRegistries({ repoRoot });

  const secondary = componentById(registries, "banner-secondary");
  assert.equal(
    elementById(secondary, "mobile", "secondary-image").render_mode,
    "direct-image",
  );
  assert.equal(
    elementById(secondary, "desktop", "secondary-image").render_mode,
    "background-image",
  );

  const card = componentById(registries, "card-image");
  const cardImage = elementById(card, "mobile", "card-image");
  const cardFacts = new Map(cardImage.facts.map((fact) => [fact.id, fact.value]));
  assert.equal(cardFacts.get("width-behavior").value, "fluid-to-container");
  assert.equal(cardFacts.get("height-behavior").value, "auto");
  assert.equal(cardFacts.get("fixed-height-forbidden").value, true);

  const template = componentById(registries, "email-template");
  for (const viewport of ["mobile", "desktop"]) {
    assert.deepEqual(
      elementById(template, viewport, "content").content_slots,
      [{ id: "content", type: "placeholder", required: true }],
    );
  }

  const appDownload = componentById(registries, "banner-app-download");
  for (const viewport of ["mobile", "desktop"]) {
    const storeLink = elementById(appDownload, viewport, "rustore-link");
    assert.deepEqual(
      storeLink.children.map(({ render_mode }) => render_mode),
      ["direct-image", "html-text"],
    );
  }
});

test("renderer-ready validation rejects missing, duplicate, and misplaced semantics", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const rendererRegistry = await loadRendererRegistry({ repoRoot });
  const card = structuredClone(componentById(registries, "card-image"));
  const coverage = resolveRendererCoverage(rendererRegistry, card.id);

  elementById(card, "mobile", "heading").content_slots = [];
  elementById(card, "desktop", "heading").content_slots.push({
    id: "text",
    type: "plain-text",
    required: true,
  });
  card.contracts.mobile.root.facts.push({
    id: "description-999",
    value: { type: "measure", value: 1, unit: "px" },
  });

  const errors = validateRendererReadyComponent(card, coverage);
  assert.ok(errors.some(({ code }) => code === "RENDER_CONTENT_SLOT_MISSING"));
  assert.ok(errors.some(({ code }) => code === "RENDER_CONTENT_SLOT_DUPLICATE"));
  assert.ok(errors.some(({ code }) => code === "RENDER_FACT_ID_GENERIC"));
});

test("background images reject HTML alt while direct images require it", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const rendererRegistry = await loadRendererRegistry({ repoRoot });
  const secondary = structuredClone(
    componentById(registries, "banner-secondary"),
  );
  const coverage = resolveRendererCoverage(rendererRegistry, secondary.id);

  elementById(secondary, "mobile", "secondary-image").content_slots = [];
  elementById(secondary, "desktop", "secondary-image").content_slots = [
    { id: "alt", type: "alt-text", required: true },
  ];

  const errors = validateRendererReadyComponent(secondary, coverage);
  assert.ok(errors.some(({ code }) => code === "RENDER_IMAGE_ALT_MISSING"));
  assert.ok(errors.some(({ code }) => code === "RENDER_BACKGROUND_ALT_FORBIDDEN"));
});

test("every active direct image has exactly one required alt-text slot", async () => {
  const registries = await loadComponentRegistries({ repoRoot });

  for (const document of Object.values(registries)) {
    for (const record of document.components) {
      if (record.status !== "active") continue;
      walkComponentElements(record, ({ element, path }) => {
        const altSlots = (element.content_slots ?? []).filter(
          ({ id }) => id === "alt",
        );
        if (element.render_mode === "direct-image") {
          assert.deepEqual(
            altSlots,
            [{ id: "alt", type: "alt-text", required: true }],
            `${record.id}${path} must declare one required alt-text slot`,
          );
        }
        if (element.render_mode === "background-image") {
          assert.deepEqual(
            altSlots,
            [],
            `${record.id}${path} must not declare an alt slot`,
          );
        }
      });
    }
  }
});

test("returns stable issue shapes and deterministic ordering", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const rendererRegistry = await loadRendererRegistry({ repoRoot });
  const report = auditRendererReadiness(registries, rendererRegistry);

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
  assert.equal(
    report.components.filter(({ issues }) =>
      issues.some(({ code }) => code === "RENDER_COVERAGE_MISSING"),
    ).length,
    55,
  );
});
