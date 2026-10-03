import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { auditRendererReadiness } from "../../scripts/lib/renderer-readiness.mjs";
import {
  loadRendererRegistry,
  resolveRendererCoverage,
} from "../../scripts/lib/renderer-registry.mjs";
import { renderContractTree } from "../../scripts/lib/email-interpreter.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

const sharedSourceOnlyIds = [
  "asset-header-logo-4x",
  "asset-header-logo-compact-4x",
  "asset-product-logo",
  "icon-bank-card-2-line",
  "icon-fingerprint-2-line",
  "icon-gift-2-line",
  "icon-global-line",
  "icon-lock-password-fill",
  "icon-mail-fill",
  "icon-mir-logo",
  "icon-receipt-fill",
  "icon-shopping-basket-2-line",
  "icon-smartphone-fill",
  "icon-user-follow-fill",
  "icon-user-forbid-fill",
  "icon-user-unfollow-fill",
  "icon-account-circle-line-remote",
];

const marketingInterpreterIds = [
  "badge-step-number",
  "banner-hero",
  "banner-inline",
  "block-bullet-list",
  "block-cards-images",
  "block-content",
  "block-icon-cards",
  "block-icon-list",
  "block-info-alert",
  "block-steps",
  "card-icon",
  "email-footer-legal",
  "item-alert",
  "item-bullet",
  "item-notification",
  "item-step",
  "nps-options",
];

const marketingSourceOnlyIds = [
  "asset-card-image-2x",
  "asset-feature-icon-4x",
];

const serviceInterpreterIds = [
  "badge-operation-status",
  "banner-fiscal-check-link",
  "block-contact-support",
  "block-instruction-steps",
  "block-personal-data-update",
  "block-receipt-info",
  "block-transaction-error",
  "block-transaction-success",
  "details-operation",
  "details-operation-plain",
  "details-receipt",
  "details-suspicious-operation",
  "details-transfer",
];

const serviceSourceOnlyIds = [
  "asset-bank-badge-4x",
  "asset-icon-badge-4x",
  "asset-partner-badge-4x",
  "asset-status-badge-negative-4x",
  "asset-status-badge-positive-4x",
];

function componentById(registries, componentId) {
  for (const document of Object.values(registries)) {
    const record = document.components.find(({ id }) => id === componentId);
    if (record) return record;
  }
  throw new Error(`Unknown test component: ${componentId}`);
}

test("Package 11 Shared classifies every non-HTML source explicitly", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const rendererRegistry = await loadRendererRegistry({ repoRoot });
  const report = auditRendererReadiness(registries, rendererRegistry);

  for (const componentId of sharedSourceOnlyIds) {
    const coverage = resolveRendererCoverage(rendererRegistry, componentId);
    assert.equal(coverage.mode, "source-only", componentId);
    assert.ok(coverage.reason.trim().length > 0, componentId);

    const audited = report.components.find(({ id }) => id === componentId);
    assert.deepEqual(audited.issues, [], componentId);
    assert.equal(audited.ready, false, componentId);
  }

  assert.equal(report.summary.generic_description_facts, 0);
});

test("source-only Shared records fail standalone rendering without guessed HTML", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const rendererRegistry = await loadRendererRegistry({ repoRoot });
  const component = componentById(registries, "icon-mail-fill");
  const coverage = resolveRendererCoverage(rendererRegistry, component.id);

  const result = renderContractTree({ component, coverage });

  assert.equal(result.html, "");
  assert.deepEqual(result.diagnostics.map(({ code }) => code), [
    "RENDER_INTERPRETER_COVERAGE_REQUIRED",
  ]);
});

test("Package 11 Marketing gives every active record exact coverage", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const rendererRegistry = await loadRendererRegistry({ repoRoot });
  const report = auditRendererReadiness(registries, rendererRegistry);

  for (const componentId of marketingInterpreterIds) {
    const coverage = resolveRendererCoverage(rendererRegistry, componentId);
    assert.equal(coverage.mode, "interpreter", componentId);
    const audited = report.components.find(({ id }) => id === componentId);
    assert.deepEqual(audited.issues, [], componentId);
    assert.equal(audited.ready, true, componentId);
  }

  for (const componentId of marketingSourceOnlyIds) {
    const coverage = resolveRendererCoverage(rendererRegistry, componentId);
    assert.equal(coverage.mode, "source-only", componentId);
    assert.ok(coverage.reason.trim().length > 0, componentId);
    const audited = report.components.find(({ id }) => id === componentId);
    assert.deepEqual(audited.issues, [], componentId);
    assert.equal(audited.ready, false, componentId);
  }

  assert.equal(report.summary.generic_description_facts, 0);
});

test("Package 11 Service closes exact coverage for every active component", async () => {
  const registries = await loadComponentRegistries({ repoRoot });
  const rendererRegistry = await loadRendererRegistry({ repoRoot });
  const report = auditRendererReadiness(registries, rendererRegistry);

  for (const componentId of serviceInterpreterIds) {
    const coverage = resolveRendererCoverage(rendererRegistry, componentId);
    assert.equal(coverage.mode, "interpreter", componentId);
    const audited = report.components.find(({ id }) => id === componentId);
    assert.deepEqual(audited.issues, [], componentId);
    assert.equal(audited.ready, true, componentId);
  }

  for (const componentId of serviceSourceOnlyIds) {
    const coverage = resolveRendererCoverage(rendererRegistry, componentId);
    assert.equal(coverage.mode, "source-only", componentId);
    assert.ok(coverage.reason.trim().length > 0, componentId);
    const audited = report.components.find(({ id }) => id === componentId);
    assert.deepEqual(audited.issues, [], componentId);
    assert.equal(audited.ready, false, componentId);
  }

  assert.equal(report.summary.covered_active_components, 61);
  assert.equal(report.summary.ready_components, 38);
  assert.equal(report.summary.missing_coverage, 0);
  assert.equal(report.summary.generic_description_facts, 0);
});
