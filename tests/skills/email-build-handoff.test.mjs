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

function semanticVisible(element, record) {
  if (element.visibility?.mode !== "property") return true;
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

function collectVisibleContract(record, viewport) {
  const content = [];
  const assets = new Set();
  const nested = new Map();
  const visit = (element, parentRendered = true) => {
    if (!element || !semanticVisible(element, record)) return;
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

function buildInstance(assets, componentId, instanceId) {
  const record = registryIndex.bySystemId.get(componentId);
  const property_values = (record.properties ?? [])
    .filter(({ type }) => type === "boolean")
    .map((property) => ({ property_id: property.id, scope: "all", value: property.default }));
  const byViewport = new Map(VIEWPORTS.map((viewport) => [
    viewport,
    collectVisibleContract(record, viewport),
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
    for (const [elementId, nestedId] of byViewport.get(viewport).nested) {
      nestedMap.set(elementId, nestedId);
    }
  }
  const nested_components = [...nestedMap].map(([element_id, nestedId], index) => ({
    element_id,
    instance: buildInstance(assets, nestedId, `${instanceId}-nested-${index}`),
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

function buildEmailModel({ index, assets, id, topLevel }) {
  registryIndex = index;
  const root = buildInstance(assets, "email-template", `${id}-template`);
  root.slots = [{
    element_id: "content",
    instances: topLevel.map((componentId, indexValue) =>
      buildInstance(assets, componentId, `${id}-${indexValue}`)),
  }];
  return { schema_version: "1.1.0", id, metadata: { language: "ru", direction: "ltr" }, root };
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

async function fixture(root, topLevel, id = "fixture") {
  const [registries, rendererRegistry, assetsFoundation] = await Promise.all([
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadAssetsFoundation({ repoRoot }),
  ]);
  const index = indexComponentRegistries(registries);
  const model = buildEmailModel({ index, assets: assetsFoundation, id, topLevel });
  return {
    model,
    candidates: candidatesFor(model),
    assetEvidence: await writeAssetsAndEvidence(root, model, index),
    registries,
    rendererRegistry,
    assetsFoundation,
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
    assert.ok(html.includes(literal) || plainText.includes(literal), literal);
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
  const service = await fixture(serviceRoot, [
    "email-header", "block-transaction-success", "banner-secondary",
    "block-contact-support", "banner-app-download", "email-footer",
  ], "service");
  await executeFixture(marketingRoot, marketing);
  await executeFixture(serviceRoot, service);
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
