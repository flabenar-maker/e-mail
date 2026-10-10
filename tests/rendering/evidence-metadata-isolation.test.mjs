import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadComponentRegistries, indexComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { loadRendererRegistry, resolveRendererCoverage } from "../../scripts/lib/renderer-registry.mjs";
import { loadRenderingFoundation } from "../../scripts/lib/rendering-foundation.mjs";
import { buildRenderImpactProjection } from "../../scripts/lib/render-impact.mjs";
import { renderEmailDocument } from "../../scripts/lib/email-renderer.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const evidence = { foundation_values: [], source_dependencies: [{ id: "desktop-header-logo-source", source: { variant_node_id: "230:3679", node_id: "1008:1823" }, target: { component_id: "asset-header-logo-4x", variant_id: "product-cupis" }, asset_owner: { node_id: "1008:1823", asset_id: "header-logo" } }] };

function instance(component, index, ancestry = []) {
  const content = [];
  const seen = new Set();
  for (const viewport of ["mobile", "desktop"]) {
    const walk = (element) => {
      for (const slot of element.content_slots ?? []) {
        const key = viewport + ":" + element.id + ":" + slot.id;
        if (seen.has(key)) continue;
        seen.add(key);
        const sourceText = element.facts?.find(({ id }) => id === "source-text")?.value?.value;
        const styled = (element.facts ?? []).some(({ id }) => id === "styled-text-segments");
        if (slot.id === "text" && styled) assert.equal(typeof sourceText, "string", element.id);
        const value = slot.type === "url" ? { type: "url", value: "https://example.test/evidence" } : slot.type === "alt-text" ? { type: "alt-text", purpose: "informative", value: "Evidence" } : { type: "plain-text", value: slot.id === "text" && styled ? sourceText : "Evidence" };
        content.push({ element_id: element.id, slot_id: slot.id, scope: viewport, value });
      }
      for (const child of element.children ?? []) walk(child);
    };
    walk(component.contracts[viewport].root);
  }
  const nested = new Map();
  for (const viewport of ["mobile", "desktop"]) {
    const walk = (element) => { if (element.render_mode === "nested-component" && !nested.has(element.id) && !ancestry.includes(element.component_id)) nested.set(element.id, element.component_id); for (const child of element.children ?? []) walk(child); };
    walk(component.contracts[viewport].root);
  }
  return { instance_id: "evidence-" + component.id, component_id: component.id, variants: { mobile: "mobile", desktop: "desktop" }, property_values: (component.properties ?? []).map(({ id, default: value }) => ({ property_id: id, scope: "all", value })), content_values: content, asset_files: (component.asset_contracts ?? []).map(({ id }) => ({ asset_contract_id: id, path: "images/" + id + ".png" })), slots: [], nested_components: [...nested].map(([element_id, component_id]) => ({ element_id, instance: instance(index.bySystemId.get(component_id), index, [...ancestry, component.id]) })) };
}

test("metadata leaves render impact, asset contracts, and representative document bytes unchanged", async () => {
  const [registries, rendererRegistry, rendering] = await Promise.all([loadComponentRegistries({ repoRoot }), loadRendererRegistry({ repoRoot }), loadRenderingFoundation({ repoRoot })]);
  const actualIndex = indexComponentRegistries(registries);
  const baseline = structuredClone(registries);
  for (const document of Object.values(baseline)) for (const component of document.components) delete component.evidence_links;
  const beforeIndex = indexComponentRegistries(baseline);
  const records = ["email-header", "banner-hero", "block-contact-support", "block-personal-data-update", "block-receipt-info"].map((id) => beforeIndex.bySystemId.get(id));
  assert.ok(records.every(Boolean));
  const before = records.map((component) => buildRenderImpactProjection({ component, coverage: resolveRendererCoverage(rendererRegistry, component.id), foundations: { rendering } }));
  const afterIndex = actualIndex;
  const after = records.map(({ id }) => { const component = afterIndex.bySystemId.get(id); return buildRenderImpactProjection({ component, coverage: resolveRendererCoverage(rendererRegistry, id), foundations: { rendering } }); });
  assert.deepEqual(after, before);
  for (const component of records) assert.deepEqual(afterIndex.bySystemId.get(component.id).asset_contracts, component.asset_contracts, component.id);
  const template = beforeIndex.bySystemId.get("email-template");
  const model = { schema_version: "1.1.0", metadata: { language: "ru", direction: "ltr" }, root: { ...instance(template, beforeIndex), slots: [{ element_id: "content", instances: records.map((component) => instance(component, beforeIndex)) }] } };
  const dependencies = { rendererRegistry, foundations: { rendering } };
  const beforeResult = renderEmailDocument(model, { ...dependencies, componentIndex: beforeIndex });
  const afterResult = renderEmailDocument(model, { ...dependencies, componentIndex: afterIndex });
  assert.deepEqual(beforeResult.diagnostics, []);
  assert.deepEqual(afterResult.diagnostics, []);
  assert.ok(beforeResult.html.length > 0);
  assert.equal(afterResult.html, beforeResult.html);
});
