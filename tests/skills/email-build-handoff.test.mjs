import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdtemp,
  mkdir,
  cp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  createEmailVersion,
  executeEmailBuildHandoff,
  prepareEmailBuildHandoff,
  resolveEmailBuildRequest,
} from "../../scripts/lib/email-build-orchestration.mjs";
import {
  indexComponentRegistries,
  loadComponentRegistries,
} from "../../scripts/lib/component-registry.mjs";
import { loadAssetsFoundation } from "../../scripts/lib/assets-foundation.mjs";
import { loadRendererRegistry } from "../../scripts/lib/renderer-registry.mjs";
import { loadWorkflowRegistry } from "../../scripts/lib/workflow-registry.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const VIEWPORTS = ["mobile", "desktop"];
let registryIndex;

function everyInstance(instance, output = []) {
  output.push(instance);
  for (const slot of instance.slots ?? []) {
    for (const child of slot.instances ?? []) everyInstance(child, output);
  }
  for (const nested of instance.nested_components ?? []) everyInstance(nested.instance, output);
  return output;
}

function semanticVisible(element, record, propertyValues, viewport) {
  if (element.visibility?.mode !== "property") return true;
  const configured = propertyValues.find(({ property_id, scope }) =>
    property_id === element.visibility.property_id && scope === viewport)
    ?? propertyValues.find(({ property_id, scope }) =>
      property_id === element.visibility.property_id && scope === "all");
  if (configured) return configured.value === true;
  return record.properties.find(({ id }) => id === element.visibility.property_id)?.default === true;
}

function renderedByDefault(element) {
  return element.visibility?.mode !== "instance" || element.visibility.default_visible !== false;
}

function contentValue(type, marker, element) {
  if (type === "url") return { type, value: `https://example.test/${marker}` };
  if (type === "alt-text") return { type, purpose: "informative", value: marker };
  if (type === "rich-text") {
    const source = element.facts?.find(({ id }) => id === "source-text")?.value?.value;
    return { type, segments: [{ type: "text", value: source }] };
  }
  return { type, value: marker };
}

function collectVisibleContract(record, viewport, propertyValues) {
  const content = [];
  const assets = new Set();
  const nested = new Map();
  const visit = (element, parentRendered = true) => {
    if (!element || !semanticVisible(element, record, propertyValues, viewport)) return;
    const rendered = parentRendered && renderedByDefault(element);
    for (const slot of element.content_slots ?? []) {
      if (slot.type !== "placeholder" && (rendered || slot.required)) {
        content.push({ element_id: element.id, slot, element, rendered });
      }
    }
    if (["direct-image", "background-image"].includes(element.render_mode)) {
      assets.add(element.asset_contract_id);
    }
    if (element.render_mode === "nested-component") nested.set(element.id, element.component_id);
    for (const child of element.children ?? []) visit(child, rendered);
  };
  visit(record.contracts[viewport].root);
  return { content, assets, nested };
}

function buildInstance(assets, componentId, instanceId, blueprint = null) {
  const record = registryIndex.bySystemId.get(componentId);
  const concreteInput = blueprint?.component_inputs?.[componentId];
  const property_values = (record.properties ?? [])
    .filter(({ type }) => type === "boolean")
    .map((property) => concreteInput?.property_values?.find(({ property_id, scope }) =>
      property_id === property.id && scope === "all")
      ?? { property_id: property.id, scope: "all", value: property.default });
  const byViewport = new Map(VIEWPORTS.map((viewport) => [
    viewport,
    collectVisibleContract(record, viewport, property_values),
  ]));

  const contentMap = new Map();
  for (const viewport of VIEWPORTS) {
    for (const { element_id, slot, element, rendered } of byViewport.get(viewport).content) {
      const sourceKey = slot.type === "rich-text"
        ? element.facts?.find(({ id }) => id === "source-text")?.value?.value ?? ""
        : "";
      const key = `${element_id}\0${slot.id}\0${slot.type}\0${sourceKey}`;
      const entry = contentMap.get(key) ?? { element_id, slot, element, rendered: false, viewports: [] };
      entry.rendered ||= rendered;
      entry.viewports.push(viewport);
      contentMap.set(key, entry);
    }
  }
  const content_values = [...contentMap.values()].map(({ element_id, slot, element, rendered, viewports }) => {
    const marker = `${rendered ? "" : "hidden-"}${instanceId}-${element_id}-${slot.id}`;
    return {
      element_id,
      slot_id: slot.id,
      scope: viewports.length === VIEWPORTS.length ? "all" : viewports[0],
      value: contentValue(slot.type, marker, element),
    };
  });

  const assetIds = new Set(VIEWPORTS.flatMap((viewport) => [...byViewport.get(viewport).assets]));
  const profileById = new Map(assets.export_profiles.map((profile) => [profile.id, profile]));
  const asset_files = [...assetIds].map((assetId) => {
    const contract = record.asset_contracts.find(({ id }) => id === assetId);
    const extension = profileById.get(contract.export_profile_id).contract.extension;
    return { asset_contract_id: assetId, path: `images/${assetId}${extension}` };
  });

  const nestedMap = new Map();
  for (const viewport of VIEWPORTS) {
    const occurrences = new Map();
    for (const [elementId, nestedId] of byViewport.get(viewport).nested) {
      const ordinal = occurrences.get(nestedId) ?? 0;
      occurrences.set(nestedId, ordinal + 1);
      const key = `${nestedId}\0${ordinal}`;
      const entry = nestedMap.get(key) ?? { nestedId, elementIds: {} };
      entry.elementIds[viewport] = elementId;
      nestedMap.set(key, entry);
    }
  }
  const nested_components = [...nestedMap.values()].map(({ nestedId, elementIds }, index) => ({
    ...(elementIds.mobile && elementIds.desktop && elementIds.mobile !== elementIds.desktop
      ? { element_ids: elementIds }
      : { element_id: elementIds.mobile ?? elementIds.desktop }),
    instance: buildInstance(assets, nestedId, `${instanceId}-nested-${index}`, blueprint),
  }));

  return {
    instance_id: instanceId,
    component_id: componentId,
    variants: { mobile: "mobile", desktop: "desktop" },
    property_values,
    content_values,
    asset_files,
    slots: [],
    ...(nested_components.length > 0 ? { nested_components } : {}),
  };
}

function buildEmailModel({ index, assets, id, topLevel, blueprint = null }) {
  registryIndex = index;
  const root = buildInstance(assets, "email-template", `${id}-template`, blueprint);
  root.slots = [{
    element_id: "content",
    instances: topLevel.map((componentId, indexValue) =>
      buildInstance(assets, componentId, `${id}-${indexValue}`, blueprint)),
  }];
  return { schema_version: "1.1.0", id, metadata: { language: "ru", direction: "ltr" }, root };
}

function applyConcreteEmailBlueprint(model, blueprint) {
  const expectedTopLevel = blueprint.top_level.map(({ component_id }) => component_id);
  const actualTopLevel = model.root.slots.find(({ element_id }) => element_id === "content")
    ?.instances.map(({ component_id }) => component_id);
  assert.deepEqual(actualTopLevel, expectedTopLevel);

  const seen = new Set();
  for (const instance of everyInstance(model.root)) {
    const concreteInput = blueprint.component_inputs[instance.component_id];
    if (!concreteInput) {
      assert.equal(
        instance.content_values.length,
        0,
        `missing concrete content map for ${instance.component_id}`,
      );
      continue;
    }
    seen.add(instance.component_id);
    if (concreteInput.content_values) {
      instance.content_values = structuredClone(concreteInput.content_values);
    }
    if (concreteInput.property_values) {
      assert.deepEqual(instance.property_values, concreteInput.property_values);
    }
  }
  for (const componentId of Object.keys(blueprint.component_inputs)) {
    assert.ok(seen.has(componentId), `unused concrete input for ${componentId}`);
  }
}

function candidatesFor(model) {
  return [...new Set(everyInstance(model.root).map(({ component_id }) => component_id))]
    .map((id) => ({ id }));
}

async function writeAssetsAndEvidence(root, model, index) {
  const evidence = [];
  for (const instance of everyInstance(model.root)) {
    const record = index.bySystemId.get(instance.component_id);
    for (const asset of instance.asset_files ?? []) {
      const contract = record.asset_contracts.find(({ id }) => id === asset.asset_contract_id);
      const target = join(root, ...asset.path.split("/"));
      const bytes = Buffer.from(`mcp-export:${asset.path}`, "utf8");
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, bytes);
      evidence.push({
        instance_id: instance.instance_id,
        component_id: instance.component_id,
        asset_contract_id: asset.asset_contract_id,
        path: asset.path,
        sha256: createHash("sha256").update(bytes).digest("hex"),
        mcp_export: {
          source: "figma-mcp",
          evidence_id: `export:${instance.instance_id}:${asset.asset_contract_id}`,
          owner_layer_name: contract.owner_layer_name,
          file_key: record.figma.file_key,
          source_node_id: `I${record.figma.node_id};${record.figma.node_id}`,
        },
      });
    }
  }
  return evidence;
}

async function fixture(root, topLevel, id = "fixture", blueprint = null) {
  const [registries, rendererRegistry, assetsFoundation] = await Promise.all([
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadAssetsFoundation({ repoRoot }),
  ]);
  const index = indexComponentRegistries(registries);
  const model = buildEmailModel({ index, assets: assetsFoundation, id, topLevel, blueprint });
  if (blueprint) applyConcreteEmailBlueprint(model, blueprint);
  return {
    model,
    candidates: candidatesFor(model),
    assetEvidence: await writeAssetsAndEvidence(root, model, index),
    registries,
    rendererRegistry,
    assetsFoundation,
  };
}

function sourceValue(value) {
  if (value?.type === "rich-text") return value.segments.map(({ value: text }) => text).join("");
  if (value?.type === "alt-text") return { purpose: value.purpose, value: value.value };
  return value?.value;
}

function sourceEvidenceFor(model, assetEvidence, { scope = "full-email" } = {}) {
  const entries = [];
  const visit = (instance, parent = null, relation = null) => {
    entries.push({ instance, parent, relation });
    for (const [slotIndex, slot] of (instance.slots ?? []).entries()) {
      for (const [order, child] of slot.instances.entries()) {
        visit(child, instance, { kind: "slot", element_id: slot.element_id, order, slotIndex });
      }
    }
    for (const [order, nested] of (instance.nested_components ?? []).entries()) {
      visit(nested.instance, instance, {
        kind: "nested", element_id: nested.element_id, element_ids: nested.element_ids, order,
      });
    }
  };
  visit(model.root);
  const capture_id = "capture:source-gate";
  const file_key = "source-gate-file";
  const nodeId = (viewport, instance) => `source-${viewport}-${instance.instance_id}`;
  const readings = { instances: [], fields: [], assets: [] };
  const correspondence = { capture_id, file_key, instances: [], fields: [], assets: [] };
  correspondence.instances = entries.map(({ instance }) => ({
    instance_id: instance.instance_id,
    nodes: Object.fromEntries(VIEWPORTS.map((viewport) => [viewport, nodeId(viewport, instance)])),
  }));
  const receipts = structuredClone(assetEvidence);
  for (const viewport of VIEWPORTS) {
    for (const { instance, parent, relation } of entries) {
      const node_id = nodeId(viewport, instance);
      readings.instances.push({
        viewport, node_id, variant_id: instance.variants[viewport],
        parent_node_id: parent ? nodeId(viewport, parent) : null,
        relation: relation && {
          kind: relation.kind,
          element_id: relation.element_ids?.[viewport] ?? relation.element_id,
        },
        order: relation?.order ?? null,
      });
      for (const item of instance.property_values ?? []) {
        if (item.scope !== "all" && item.scope !== viewport) continue;
        const field = `property:${item.property_id}`;
        readings.fields.push({ viewport, node_id, owner_node_id: node_id, field, value: item.value });
        correspondence.fields.push({
          instance_id: instance.instance_id, kind: "property", property_id: item.property_id,
          viewport, node_id, field, origin: "figma",
        });
      }
      for (const item of instance.content_values ?? []) {
        if (item.scope !== "all" && item.scope !== viewport) continue;
        const field = `content:${item.element_id}:${item.slot_id}`;
        readings.fields.push({ viewport, node_id, owner_node_id: node_id, field, value: sourceValue(item.value) });
        correspondence.fields.push({
          instance_id: instance.instance_id, kind: "content", element_id: item.element_id,
          slot_id: item.slot_id, viewport, node_id, field, origin: "figma",
        });
      }
    }
  }
  for (const entry of entries) {
    for (const asset of entry.instance.asset_files ?? []) {
      const viewport = "mobile";
      const node_id = nodeId(viewport, entry.instance);
      const evidence_id = `export:${entry.instance.instance_id}:${asset.asset_contract_id}`;
      readings.assets.push({ viewport, node_id, owner_node_id: node_id, evidence_id });
      correspondence.assets.push({
        instance_id: entry.instance.instance_id,
        asset_contract_id: asset.asset_contract_id,
        viewport,
        node_id,
      });
      const receipt = receipts.find((item) =>
        item.instance_id === entry.instance.instance_id && item.asset_contract_id === asset.asset_contract_id &&
        item.path === asset.path);
      assert.ok(receipt, `missing asset receipt for ${entry.instance.instance_id}/${asset.asset_contract_id}`);
      receipt.mcp_export.capture_id = capture_id;
      receipt.mcp_export.file_key = file_key;
      receipt.mcp_export.source_node_id = node_id;
      receipt.mcp_export.evidence_id = evidence_id;
    }
  }
  return {
    readings: {
      complete: true, capture_id, file_key, captured_at: "2026-09-28T00:00:00.000Z",
      ...readings,
      selection: Object.fromEntries(VIEWPORTS.map((viewport) => [viewport, {
        scope, root_node_id: nodeId(viewport, model.root), expected_top_level_count: 1,
        terminal: true, truncated: false, capture_id, file_key,
      }])),
    },
    correspondence,
    authorizedInputs: [],
    assetEvidence: receipts,
  };
}

async function contractRepoCopy(root, name) {
  const target = join(root, name);
  await cp(join(repoRoot, "data"), join(target, "data"), { recursive: true });
  await cp(join(repoRoot, "schemas"), join(target, "schemas"), { recursive: true });
  return target;
}

function suppliedValues(model) {
  const text = [];
  const urls = [];
  for (const instance of everyInstance(model.root)) {
    for (const { value } of instance.content_values ?? []) {
      if (value.type === "url") {
        urls.push(value.value);
      } else if (typeof value.value === "string" && !value.value.startsWith("hidden-")) {
        text.push(value.value);
      } else {
        text.push(...(value.segments ?? []).map((segment) => segment.value));
      }
    }
  }
  return { text, urls };
}

async function executeFixture(root, source) {
  const outputDir = join(root, "output_1.0");
  const result = await executeEmailBuildHandoff({
    repoRoot,
    outputDir,
    assetRoot: root,
    ...source,
  });
  assert.deepEqual(result.blockers, []);
  assert.equal(result.executed, true);
  const html = await readFile(join(outputDir, "email.html"), "utf8");
  const plainText = html
    .replace(/<[^>]+>/gu, "")
    .replaceAll("&nbsp;", "\u00a0")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'");
  const supplied = suppliedValues(source.model);
  for (const literal of supplied.text) {
    for (const fragment of literal.split(/\r?\n/u)) {
      assert.ok(html.includes(fragment) || plainText.includes(fragment), fragment);
    }
  }
  for (const url of supplied.urls) assert.ok(html.includes(`href="${url}"`), url);
  assert.deepEqual(await readdir(outputDir), ["email.html", "images"]);
}

test("marketing and service fixtures follow resolved contracts through the real renderer CLI", async (t) => {
  const marketingRoot = await mkdtemp(join(tmpdir(), "cupis-marketing-handoff-"));
  const serviceRoot = await mkdtemp(join(tmpdir(), "cupis-service-handoff-"));
  t.after(() => Promise.all([
    rm(marketingRoot, { recursive: true, force: true }),
    rm(serviceRoot, { recursive: true, force: true }),
  ]));
  const marketing = await fixture(marketingRoot, [
    "email-header", "banner-secondary", "banner-app-download", "email-footer",
  ], "marketing");
  const serviceBlueprint = JSON.parse(await readFile(
    new URL("../fixtures/skills/service-email-template-figma.json", import.meta.url),
    "utf8",
  ));
  const service = await fixture(
    serviceRoot,
    serviceBlueprint.top_level.map(({ component_id }) => component_id),
    "service",
    serviceBlueprint,
  );
  assert.deepEqual(serviceBlueprint.figma.mobile, {
    node_id: "1533:20379", role: "mobile", width: 328, height: 2223,
  });
  assert.deepEqual(serviceBlueprint.figma.desktop, {
    node_id: "1533:20380", role: "desktop", width: 600, height: 1847,
  });
  assert.ok(suppliedValues(service.model).text.every((value) => !value.includes("service-")));
  await executeFixture(marketingRoot, marketing);
  await executeFixture(serviceRoot, service);
});

test("viewport-specific nested element IDs require exact placement in both variants", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-viewport-nested-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = await fixture(root, ["banner-secondary"]);
  const contractRepo = await contractRepoCopy(root, "viewport-nested-repo");
  const marketingPath = join(contractRepo, "data", "components", "marketing.yaml");
  const marketing = JSON.parse(await readFile(marketingPath, "utf8"));
  const banner = marketing.components.find(({ id }) => id === "banner-secondary");
  const mobileId = "root-card-content-area-button";
  const desktopId = "root-card-content-area-desktop-button";
  const stack = [banner.contracts.desktop.root];
  let desktopElement;
  while (stack.length) {
    const element = stack.pop();
    if (element.id === mobileId) desktopElement = element;
    stack.push(...(element.children ?? []));
  }
  assert.ok(desktopElement);
  desktopElement.id = desktopId;
  await writeFile(marketingPath, JSON.stringify(marketing), "utf8");

  const nested = source.model.root.slots[0].instances[0].nested_components[0];
  delete nested.element_id;
  nested.element_ids = { mobile: mobileId, desktop: desktopId };
  const exact = await prepareEmailBuildHandoff({
    ...source, repoRoot: contractRepo, assetRoot: root,
  });
  assert.deepEqual(exact.blockers, []);

  nested.element_ids.desktop = "wrong-desktop-element";
  const wrong = await prepareEmailBuildHandoff({
    ...source, repoRoot: contractRepo, assetRoot: root,
  });
  assert.ok(wrong.blockers.includes("contract-ambiguous"));
});
test("handoff placement uses the model-selected variant contract", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-axis-placement-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = await fixture(root, ["banner-secondary"]);
  const contractRepo = await contractRepoCopy(root, "axis-placement-repo");
  const marketingPath = join(contractRepo, "data", "components", "marketing.yaml");
  const marketing = JSON.parse(await readFile(marketingPath, "utf8"));
  const banner = marketing.components.find(({ id }) => id === "banner-secondary");
  const instance = source.model.root.slots[0].instances[0];
  const nested = instance.nested_components[0];
  const originalId = nested.element_id;
  const variantId = `${originalId}-alternate`;
  const mobileRoot = structuredClone(banner.contracts.mobile.root);
  const desktopRoot = structuredClone(banner.contracts.desktop.root);
  const stack = [desktopRoot];
  let target;
  while (stack.length) {
    const element = stack.pop();
    if (element.id === originalId) target = element;
    stack.push(...(element.children ?? []));
  }
  assert.ok(target);
  target.id = variantId;
  banner.contracts.variant_contracts = [
    { variant_node_id: "999:1", axes: [{ name: "Viewport", value: "Mobile" }, { name: "Mode", value: "Alternate" }], root: mobileRoot },
    { variant_node_id: "999:2", axes: [{ name: "Viewport", value: "Desktop" }, { name: "Mode", value: "Alternate" }], root: desktopRoot },
  ];
  banner.variants.push(
    { id: "mobile-alternate", node_id: "999:1", axes: [{ name: "Viewport", value: "Mobile" }, { name: "Mode", value: "Alternate" }] },
    { id: "desktop-alternate", node_id: "999:2", axes: [{ name: "Viewport", value: "Desktop" }, { name: "Mode", value: "Alternate" }] },
  );
  instance.variant_axes = { mobile: { Mode: "Alternate" }, desktop: { Mode: "Alternate" } };
  nested.element_ids = { mobile: originalId, desktop: variantId };
  delete nested.element_id;
  await writeFile(marketingPath, JSON.stringify(marketing), "utf8");
  const result = await prepareEmailBuildHandoff({ ...source, repoRoot: contractRepo, assetRoot: root });
  assert.deepEqual(result.blockers, []);
});
test("top-level promotion rejects components nested only in alternate variants", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-axis-nested-only-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = await fixture(root, ["banner-secondary", "banner-inline"]);
  const contractRepo = await contractRepoCopy(root, "axis-nested-only-repo");
  const marketingPath = join(contractRepo, "data", "components", "marketing.yaml");
  const marketing = JSON.parse(await readFile(marketingPath, "utf8"));
  const banner = marketing.components.find(({ id }) => id === "banner-secondary");
  const mobileRoot = structuredClone(banner.contracts.mobile.root);
  const desktopRoot = structuredClone(banner.contracts.desktop.root);
  for (const variantRoot of [mobileRoot, desktopRoot]) {
    variantRoot.children.push({ id: "variant-inline", semantic_role: "banner",
      render_mode: "nested-component", component_id: "banner-inline",
      visibility: { mode: "always" }, facts: [], children: [] });
  }
  banner.contracts.variant_contracts = [
    { variant_node_id: "998:1", axes: [{ name: "Viewport", value: "Mobile" }, { name: "Mode", value: "Alternate" }], root: mobileRoot },
    { variant_node_id: "998:2", axes: [{ name: "Viewport", value: "Desktop" }, { name: "Mode", value: "Alternate" }], root: desktopRoot },
  ];
  banner.variants.push(
    { id: "mobile-alternate", node_id: "998:1", axes: [{ name: "Viewport", value: "Mobile" }, { name: "Mode", value: "Alternate" }] },
    { id: "desktop-alternate", node_id: "998:2", axes: [{ name: "Viewport", value: "Desktop" }, { name: "Mode", value: "Alternate" }] },
  );
  source.model.root.slots[0].instances[0].variant_axes = {
    mobile: { Mode: "Alternate" }, desktop: { Mode: "Alternate" },
  };
  await writeFile(marketingPath, JSON.stringify(marketing), "utf8");
  const result = await prepareEmailBuildHandoff({ ...source, repoRoot: contractRepo, assetRoot: root });
  assert.ok(result.blockers.includes("contract-ambiguous"), result.blockers.join(","));
});
test("resolved dual-viewport placement rejects standalone nested-only components", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-placement-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = await fixture(root, ["banner-secondary"]);
  registryIndex = indexComponentRegistries(source.registries);
  source.model.root.slots[0].instances.push(
    buildInstance(source.assetsFoundation, "button-secondary", "promoted-button"),
  );
  source.candidates = candidatesFor(source.model);
  const result = await prepareEmailBuildHandoff({ ...source, repoRoot, assetRoot: root });
  assert.ok(result.blockers.includes("contract-ambiguous"));

  const wrongParentSource = await fixture(root, ["banner-secondary"], "wrong-parent");
  const secondary = wrongParentSource.model.root.slots[0].instances[0];
  secondary.nested_components[0].element_id = "root-card-content-area-text-content-heading";
  const wrongParent = await prepareEmailBuildHandoff({ ...wrongParentSource, repoRoot, assetRoot: root });
  assert.ok(wrongParent.blockers.includes("contract-ambiguous"));

  const slotRepo = await contractRepoCopy(root, "slot-repo");
  const marketingPath = join(slotRepo, "data", "components", "marketing.yaml");
  const marketing = JSON.parse(await readFile(marketingPath, "utf8"));
  const banner = marketing.components.find(({ id }) => id === "banner-secondary");
  for (const viewport of VIEWPORTS) {
    banner.contracts[viewport].root.children.push({
      id: "injected-slot",
      semantic_role: "content",
      render_mode: "slot",
      visibility: { mode: "always" },
      facts: [],
      children: [],
      content_slots: [{ id: "content", type: "placeholder", required: true }],
    });
  }
  await writeFile(marketingPath, JSON.stringify(marketing), "utf8");
  const slotSource = await fixture(root, ["banner-secondary"], "slot-attack");
  registryIndex = indexComponentRegistries(slotSource.registries);
  const slotBanner = slotSource.model.root.slots[0].instances[0];
  slotBanner.slots.push({
    element_id: "injected-slot",
    instances: [buildInstance(slotSource.assetsFoundation, "button-secondary", "slot-button")],
  });
  slotSource.candidates = candidatesFor(slotSource.model);
  const slotAttack = await prepareEmailBuildHandoff({
    ...slotSource,
    repoRoot: slotRepo,
    assetRoot: root,
  });
  assert.ok(slotAttack.blockers.includes("contract-ambiguous"));
});

test("the actual handoff gate prevents renderer invocation for every required blocker", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-blockers-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = await fixture(root, ["banner-secondary"]);
  let invocations = 0;
  const rendererRunner = async () => { invocations += 1; };
  const execute = (overrides) => executeEmailBuildHandoff({
    ...source,
    repoRoot,
    assetRoot: root,
    outputDir: join(root, `blocked-${invocations}`),
    rendererRunner,
    ...overrides,
  });

  assert.ok((await execute({ candidates: [{ id: "missing-component" }] })).blockers.includes("component-unregistered"));
  const incompleteRepo = await contractRepoCopy(root, "incomplete-repo");
  const marketingPath = join(incompleteRepo, "data", "components", "marketing.yaml");
  const incomplete = JSON.parse(await readFile(marketingPath, "utf8"));
  delete incomplete.components.find(({ id }) => id === "banner-secondary").contracts.desktop;
  await writeFile(marketingPath, JSON.stringify(incomplete), "utf8");
  assert.ok((await execute({ repoRoot: incompleteRepo })).blockers.includes("viewport-contract-missing"));
  const ambiguousCandidates = source.candidates.map((candidate) =>
    candidate.id === "banner-secondary"
      ? { ...candidate, figma_identity: { file_key: "wrong", node_id: "1:1" } }
      : candidate);
  assert.ok((await execute({ candidates: ambiguousCandidates })).blockers.includes("contract-ambiguous"));
  assert.ok((await execute({ assetEvidence: [] })).blockers.includes("asset-contract-missing"));
  const malformed = structuredClone(source.model);
  malformed.root.component_id = "banner-secondary";
  assert.ok((await execute({ model: malformed })).blockers.includes("renderer-diagnostic"));
  const designWithoutVisualProof = await execute({
    resolution: { mode: "continue-fix-design" },
    continueFixEvidence: {
      figma_instances: {
        mobile: { role: "mobile", email_id: "same", file_key: "file", node_id: "1:1" },
        desktop: { role: "desktop", email_id: "same", file_key: "file", node_id: "1:2" },
      },
    },
  });
  assert.ok(designWithoutVisualProof.blockers.includes("visual-regression"));
  assert.equal(invocations, 0);
  const verifiedDesign = await execute({
    resolution: { mode: "continue-fix-design" },
    continueFixEvidence: {
      figma_instances: {
        mobile: { role: "mobile", email_id: "same", file_key: "file", node_id: "1:1" },
        desktop: { role: "desktop", email_id: "same", file_key: "file", node_id: "1:2" },
      },
      visual_regression: {
        status: "passed",
        reference_id: "figma-reference",
        render_id: "local-render",
      },
    },
  });
  assert.equal(verifiedDesign.executed, true);
  assert.equal(invocations, 1);
});

test("new-build handoff blocks rendering without full source comparison evidence", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-source-gate-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = await fixture(root, ["banner-secondary"]);
  let invocations = 0;
  const result = await executeEmailBuildHandoff({
    ...source,
    repoRoot,
    assetRoot: root,
    outputDir: join(root, "new-build"),
    resolution: { mode: "new-build" },
    rendererRunner: async () => { invocations += 1; },
  });
  assert.ok(result.blockers.includes("source-evidence-missing"));
  assert.equal(invocations, 0);
});

test("new-build handoff renders when complete source observations match the model", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-source-positive-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = await fixture(root, ["block-content"]);
  const evidence = sourceEvidenceFor(source.model, source.assetEvidence);
  let invocations = 0;
  const result = await executeEmailBuildHandoff({
    ...source,
    repoRoot,
    assetRoot: root,
    outputDir: join(root, "new-build"),
    resolution: { mode: "new-build" },
    sourceEvidence: evidence,
    assetEvidence: evidence.assetEvidence,
    rendererRunner: async () => { invocations += 1; },
  });
  assert.deepEqual(result.blockers, []);
  assert.equal(result.executed, true);
  assert.equal(invocations, 1);
});

test("new-build handoff rejects selected-subtree proof and a passed claim without readings", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-source-scope-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = await fixture(root, ["block-content"]);
  const selectedEvidence = sourceEvidenceFor(source.model, source.assetEvidence, { scope: "selected-subtree" });
  const selected = await executeEmailBuildHandoff({
    ...source,
    repoRoot,
    assetRoot: root,
    outputDir: join(root, "selected-subtree"),
    resolution: { mode: "new-build" },
    sourceEvidence: selectedEvidence,
    assetEvidence: selectedEvidence.assetEvidence,
    rendererRunner: async () => { throw new Error("renderer must stay gated"); },
  });
  assert.ok(selected.blockers.includes("source-evidence-mismatch"));
  assert.ok(selected.sourceDiagnostics.some(({ code }) => code === "EMAIL_SOURCE_SCOPE_INCOMPLETE"));

  const claimed = await executeEmailBuildHandoff({
    ...source,
    repoRoot,
    assetRoot: root,
    outputDir: join(root, "claimed-pass"),
    resolution: { mode: "new-build" },
    sourceEvidence: { status: "passed" },
    rendererRunner: async () => { throw new Error("renderer must stay gated"); },
  });
  assert.ok(claimed.blockers.includes("source-evidence-missing"));
});

test("asset evidence binds exact filename, digest, owner, Figma node, and physical root", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-assets-"));
  const outside = await mkdtemp(join(tmpdir(), "cupis-assets-outside-"));
  t.after(() => Promise.all([
    rm(root, { recursive: true, force: true }),
    rm(outside, { recursive: true, force: true }),
  ]));
  const source = await fixture(root, ["banner-secondary"]);

  for (const mutate of [
    (copy) => { copy.assetEvidence[0].sha256 = "0".repeat(64); },
    (copy) => { copy.assetEvidence[0].mcp_export.owner_layer_name = "wrong"; },
    (copy) => { copy.assetEvidence[0].mcp_export.file_key = "wrong"; },
    (copy) => { copy.assetEvidence[0].mcp_export.source_node_id = "not-a-node"; },
    (copy) => {
      const target = everyInstance(copy.model.root).find(({ asset_files }) => asset_files?.length).asset_files[0];
      const item = copy.assetEvidence.find(({ path }) => path === target.path);
      const extension = target.path.slice(target.path.lastIndexOf("."));
      target.path = `images/${target.asset_contract_id}-arbitrary-suffix${extension}`;
      item.path = target.path;
    },
  ]) {
    const copy = structuredClone(source);
    mutate(copy);
    const result = await prepareEmailBuildHandoff({ ...copy, repoRoot, assetRoot: root });
    assert.ok(result.blockers.includes("asset-contract-missing"));
  }

  const linked = structuredClone(source);
  const linkedAsset = everyInstance(linked.model.root).find(({ asset_files }) => asset_files?.length).asset_files[0];
  const outsideFile = join(outside, "outside.jpg");
  await writeFile(outsideFile, "outside", "utf8");
  const localPath = join(root, ...linkedAsset.path.split("/"));
  await rm(localPath, { force: true });
  try {
    await symlink(outsideFile, localPath, "file");
    const linkedResult = await prepareEmailBuildHandoff({ ...linked, repoRoot, assetRoot: root });
    assert.ok(linkedResult.blockers.includes("asset-contract-missing"));
  } catch (error) {
    if (error?.code !== "EPERM") throw error;
  }
});

async function treeDigest(root) {
  const output = [];
  const visit = async (folder, relative = "") => {
    const entries = (await readdir(folder, { withFileTypes: true }))
      .sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const path = join(folder, entry.name);
      const key = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await visit(path, key);
      else output.push([key, createHash("sha256").update(await readFile(path)).digest("hex")]);
    }
  };
  await visit(root);
  return output;
}

test("design fixes stay Figma-gated and technical siblings preserve the complete source tree", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "cupis-email-continue-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const workflow = await loadWorkflowRegistry({ repoRoot, workflowId: "email-build" });
  const design = resolveEmailBuildRequest({
    workflow,
    inputs: {
      request: true,
      "source-email-html": true,
      "source-images-directory": true,
      "exact-change-scope": "copy",
      "mobile-figma-instance": { role: "mobile", emailId: "same" },
    },
  });
  assert.equal(design.blocker, "figma-source-missing");
  const technical = resolveEmailBuildRequest({
    workflow,
    inputs: {
      request: true,
      "source-email-html": true,
      "source-images-directory": true,
      "exact-change-scope": "copy",
    },
  });
  assert.equal(technical.mode, "continue-fix-technical");
  assert.equal(technical.blocker, null);

  const allowedOutputs = ["version-folder", "email-html", "images-directory"];
  const source = await createEmailVersion({
    resolution: { ...technical, allowedOutputs },
    workspaceRoot: root,
    outputParent: root,
    purpose: "Technical proof",
  });
  await writeFile(join(source.target, "email.html"), "<p>source</p>", "utf8");
  await writeFile(join(source.target, "images", "proof.png"), "source-image", "utf8");
  const before = await treeDigest(source.target);
  const next = await createEmailVersion({
    resolution: { ...technical, allowedOutputs },
    workspaceRoot: root,
    outputParent: root,
    purpose: "ignored",
    sourceFolder: source.folder,
  });
  await writeFile(join(next.target, "email.html"), "<p>changed sibling only</p>", "utf8");
  assert.deepEqual(await treeDigest(source.target), before);
  assert.deepEqual(await readdir(next.target), ["email.html", "images"]);
});
