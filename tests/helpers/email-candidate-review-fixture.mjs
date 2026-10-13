// Formal binding fixture only. Test aliases and PNGs are not an actual visual review.
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile, readdir, lstat } from 'node:fs/promises';
import { dirname, join, relative, sep, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEmailModel } from '../../scripts/lib/email-model.mjs';
import { indexComponentRegistries, loadComponentRegistries } from '../../scripts/lib/component-registry.mjs';
import { loadAssetsFoundation } from '../../scripts/lib/assets-foundation.mjs';
import { loadRendererRegistry } from '../../scripts/lib/renderer-registry.mjs';
import { selectVariantRoot } from '../../scripts/lib/email-interpreter.mjs';
import { prepareEmailDelivery } from '../../scripts/lib/email-delivery.mjs';
import { loadEmailDeliveryProfiles, selectDeliveryProfile } from '../../scripts/lib/email-delivery-profile.mjs';
import { collectEmailActions } from '../../scripts/lib/email-action-inventory.mjs';
import { createDeliveryDraft } from '../../scripts/lib/email-delivery-form.mjs';
import { workloadInputDigest } from '../../scripts/lib/execution-context.mjs';
import { encodeZipStore } from '../../scripts/lib/zip-store.mjs';
import { physicalEmailSourceFixture } from './email-physical-source-fixture.mjs';

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const VIEWPORTS = ['mobile', 'desktop'];
let registryIndex;
let registryPromise;
const execFileAsync = promisify(execFile);
export const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const TEST_QUALIFICATION = Object.freeze({ executor_agent_id: 'test-formal-executor', reviewer_agent_id: 'test-formal-independent-reviewer', selected_model: { binding: 'inherited', id: null }, runtime_session_id: 'test-formal-session', tool_signature: 'test-formal-tools', effort: 'high', supported_efforts: ['low', 'medium', 'high'], capabilities: ['text', 'vision'] });
export const TEST_CANDIDATE_HTML = Buffer.from('<!doctype html><html><body>FORMAL TEST CANDIDATE</body></html>', 'utf8');
export const TEST_CANDIDATE_ZIP = encodeZipStore([{ path: 'email.html', bytes: TEST_CANDIDATE_HTML }]);
const TEST_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aazsAAAAASUVORK5CYII=', 'base64');

async function indexFor(root) {
  if (root !== repoRoot) return indexComponentRegistries(await loadComponentRegistries({ repoRoot: root }));
  registryPromise ??= loadComponentRegistries({ repoRoot }).then(indexComponentRegistries);
  return registryPromise;
}

export async function expectedPreparedInput({ root = repoRoot, assetRoot, model, deliveryDocument, sourceSha, autoDelivery = false }) {
  const path = join(assetRoot, `.test-design-${randomUUID()}.json`);
  await mkdir(assetRoot, { recursive: true });
  await writeFile(path, JSON.stringify(model));
  const originalModel = await loadEmailModel({ modelPath: path, schemaPath: join(root, 'schemas/email-model.schema.json') });
  const canonicalDesign = JSON.parse(await readFile(path, 'utf8'));
  let document = deliveryDocument;
  const componentIndex = await indexFor(root);
  if (autoDelivery && !document) {
    const profile = selectDeliveryProfile(await loadEmailDeliveryProfiles({ repoRoot: root, componentIndex }));
    const inventory = collectEmailActions({ model: originalModel, componentIndex, profile });
    assert.deepEqual(inventory.diagnostics, []);
    document = createDeliveryDraft({ emailId: originalModel.id, sourceSha, profile, inventory });
  }
  const projected = document ? await prepareEmailDelivery({ repoRoot: root, model: canonicalDesign, componentIndex, document, purpose: 'final', sourceSha }) : undefined;
  const canonicalModel = projected?.model ?? canonicalDesign;
  const modelBytes = Buffer.from(JSON.stringify(canonicalModel), 'utf8');
  const canonicalPath = join(assetRoot, `.test-canonical-${randomUUID()}.json`);
  await writeFile(canonicalPath, modelBytes);
  const renderModel = await loadEmailModel({ modelPath: canonicalPath, schemaPath: join(root, 'schemas/email-model.schema.json') });
  return { originalModel, canonicalModel, finalModel: canonicalModel, renderModel, modelBytes, modelDigest: digest(modelBytes), document, modelPath: path, canonicalPath };
}

export async function deliveryDocumentFor({ root, model, sourceSha, answer = (field, index) => `https://1cupis.ru/task5-final/${index}` }) {
  const prepared = await expectedPreparedInput({ assetRoot: root, model, sourceSha });
  const componentIndex = await indexFor(repoRoot);
  const profile = selectDeliveryProfile(await loadEmailDeliveryProfiles({ repoRoot, componentIndex }));
  const inventory = collectEmailActions({ model: prepared.originalModel, componentIndex, profile });
  assert.deepEqual(inventory.diagnostics, []);
  const document = createDeliveryDraft({ emailId: model.id, sourceSha, profile, inventory });
  inventory.fields.forEach((field, index) => { if (!field.managed) document.answers[field.id] = answer(field, index); });
  return { document, inventory, profile };
}

// Exact test-only authorized URL inputs; no rich-text/source/style observations are removed.
export function authorizeProjectedUrls({ sourceEvidence, canonicalModel, document, inventory }) {
  const entries = new Map(everyInstance(canonicalModel.root).map(instance => [instance.instance_id, instance]));
  for (const target of sourceEvidence.correspondence.fields) {
    if (target.kind !== 'content') continue;
    const instance = entries.get(target.instance_id);
    const items = (instance.content_values ?? []).filter(item => item.element_id === target.element_id && item.slot_id === target.slot_id && (item.scope === target.viewport || item.scope === 'all'));
    const item = items.find(item => item.scope === target.viewport) ?? items.find(item => item.scope === 'all');
    if (item?.value?.type !== 'url') continue;
    const field = inventory.fields.find(field => field.bindings.some(binding => binding.instance_path.split('/').at(-1) === target.instance_id && binding.element_id === target.element_id && binding.slot_id === target.slot_id && binding.viewport === target.viewport));
    assert.ok(field, 'authorized URL has a concrete delivery answer binding');
    sourceEvidence.readings.fields = sourceEvidence.readings.fields.filter(observed => !(observed.viewport === target.viewport && observed.node_id === target.node_id && observed.field === target.field));
    target.origin = field.managed ? 'policy-derived' : 'user'; delete target.node_id; delete target.field;
    sourceEvidence.authorizedInputs.push({ instance_id: target.instance_id, kind: 'content', element_id: target.element_id, slot_id: target.slot_id, viewport: target.viewport, origin: target.origin, value: item.value.value, source_ref: { source_id: field.managed ? 'test-delivery-profile' : 'test-user-delivery-answers', field_path: '/answers/' + field.id, ...(field.managed ? { version: document.profile_version } : {}) } });
  }
}

export function canonicalSelection({ model, sourceEvidence, sourceSha, modelDigest }) {
  return { email_id: model.id, file_key: sourceEvidence.readings.file_key, roots: { mobile: sourceEvidence.readings.selection.mobile.root_node_id, desktop: sourceEvidence.readings.selection.desktop.root_node_id }, source_sha: sourceSha, model_digest: modelDigest };
}

export async function candidateFiles(directory) {
  const output = [];
  const visit = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const absolute = join(dir, entry.name), stat = await lstat(absolute);
      assert.equal(stat.isSymbolicLink(), false, 'formal fixture only reviews ordinary files');
      if (stat.isDirectory()) await visit(absolute);
      else {
        assert.equal(stat.isFile(), true);
        const bytes = await readFile(absolute);
        output.push({ path: relative(directory, absolute).split(sep).join('/'), digest: digest(bytes), bytes });
      }
    }
  };
  await visit(directory);
  return output.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}

export async function emitTestCandidate({ outputDir }) {
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, 'email.html'), TEST_CANDIDATE_HTML);
  await writeFile(join(outputDir, 'altcraft.zip'), TEST_CANDIDATE_ZIP);
}

export async function createCandidateReviewFixture({ root, model, sourceEvidence, sourceSha = process.env.CUPIS_SYSTEM_COMMIT, deliveryDocument, autoDelivery = false, repository = repoRoot }) {
  const prepared = await expectedPreparedInput({ root: repository, assetRoot: root, model, sourceSha, deliveryDocument, autoDelivery });
  const selectedSourceBinding = canonicalSelection({ model: prepared.finalModel, sourceEvidence, sourceSha, modelDigest: prepared.modelDigest });
  const candidateReviewQualification = structuredClone(TEST_QUALIFICATION);
  const referenceRoot = join(root, `formal-review-${randomUUID()}`);
  await mkdir(referenceRoot, { recursive: true });
  const state = { prepared, selectedSourceBinding, candidateReviewQualification, referenceRoot, reviewCalls: 0, renderCalls: 0, reviewedFiles: [], candidateDirs: [], last: null };
  state.rendererRunner = async (args) => { state.renderCalls += 1; state.candidateDirs.push(args.outputDir); await emitTestCandidate(args); };
  state.realRendererRunner = async (args) => {
    state.renderCalls += 1; state.candidateDirs.push(args.outputDir);
    await execFileAsync(process.execPath, [join(repository, 'scripts/render-email.mjs'), '--model', args.modelPath, '--output', args.outputDir, ...(args.deliveryPath ? ['--delivery', args.deliveryPath] : [])], { cwd: repository, env: { ...process.env, CUPIS_SYSTEM_COMMIT: args.sourceSha ?? sourceSha } });
  };
  state.candidateReviewer = async ({ candidateDir, selectedSourceBinding: callbackSelection, sourceComparisonRef }) => {
    state.reviewCalls += 1;
    assert.equal(isAbsolute(sourceComparisonRef.path), true);
    const comparisonBytes = await readFile(sourceComparisonRef.path);
    assert.equal(digest(comparisonBytes), sourceComparisonRef.digest);
    const comparison = JSON.parse(comparisonBytes);
    assert.equal(comparison.source_report.status, 'passed');
    assert.equal(comparison.source_report.scope, 'full-email');
    assert.deepEqual(comparison.source_report.diagnostics, []);
    assert.equal(comparison.model_digest, prepared.modelDigest);
    assert.deepEqual(callbackSelection, selectedSourceBinding);
    assert.deepEqual(comparison.selectedSourceBinding, selectedSourceBinding);
    const files = await candidateFiles(candidateDir);
    state.reviewedFiles = files.map(item => ({ ...item, bytes: Buffer.from(item.bytes) }));
    const manifest = files.map(({ path, digest }) => ({ path, digest }));
    assert.deepEqual(comparison.files, manifest);
    assert.equal(comparison.identity.source_sha, sourceSha);
    assert.equal(comparison.identity.artifact_digest, digest(Buffer.from(JSON.stringify({ selectedSourceBinding, files: manifest }), 'utf8')));
    assert.equal(typeof comparison.identity.request_id, 'string');
    assert.ok(comparison.identity.request_id.trim());
    const persistentModelBytes = await readFile(comparison.final_model_path);
    assert.deepEqual(persistentModelBytes, prepared.modelBytes);
    const inputRefs = {}, inputRoots = {}, images = {}, modelRef = { path: 'model.json', digest: prepared.modelDigest };
    for (const kind of ['email_model', 'reference_manifest', 'evidence_root']) {
      const inputRoot = join(referenceRoot, kind); await mkdir(inputRoot, { recursive: true }); inputRoots[kind] = inputRoot;
      const refs = kind === 'email_model' ? [modelRef] : VIEWPORTS.map(viewport => ({ path: `${kind === 'reference_manifest' ? 'reference' : 'rendered'}-${viewport}.png`, digest: digest(TEST_PNG) }));
      for (const ref of refs) await writeFile(join(inputRoot, ref.path), kind === 'email_model' ? persistentModelBytes : TEST_PNG);
      const inventoryBytes = Buffer.from(JSON.stringify({ schema_version: '1.0.0', kind, files: refs }), 'utf8');
      await writeFile(join(referenceRoot, `${kind}.json`), inventoryBytes); inputRefs[kind] = { path: `${kind}.json`, digest: digest(inventoryBytes) }; images[kind] = refs;
    }
    const identity = structuredClone(comparison.identity);
    const review = { schema_version: '1.0.0', ...identity, input_digest: workloadInputDigest(inputRefs), executor_agent_id: candidateReviewQualification.executor_agent_id, reviewer_agent_id: candidateReviewQualification.reviewer_agent_id, reviewer_model_binding: structuredClone(candidateReviewQualification.selected_model), runtime_session_id: candidateReviewQualification.runtime_session_id, tool_signature: candidateReviewQualification.tool_signature, reviewer_effort: candidateReviewQualification.effort, primary_sources_reviewed: true, verdict: 'accepted', reviewed_model: { input: 'email_model', ...modelRef }, reviewed_images: ['reference_manifest', 'evidence_root'].flatMap(input => images[input].map(ref => ({ input, ...ref }))), results: Object.fromEntries(['geometry', 'layout', 'spacing', 'visibility', 'image', 'text'].map(category => [category, 'accepted'])) };
    const context = { inputRefs, inputRoots, referenceRoot, identity, reviewQualification: structuredClone(candidateReviewQualification), viewportImageRefs: Object.fromEntries(VIEWPORTS.map((viewport, index) => [viewport, { reference: { ...images.reference_manifest[index] }, rendered: { ...images.evidence_root[index] } }])) };
    const saveReview = async () => { const bytes = Buffer.from(JSON.stringify(review), 'utf8'); await writeFile(join(referenceRoot, 'formal-review.json'), bytes); context.reviewQualification.review_ref = { path: 'formal-review.json', digest: digest(bytes) }; };
    await saveReview();
    state.last = { context, comparison, sourceComparisonRef, candidateDir, callbackSelection, review, saveReview, modelRef, inputRoots, images };
    if (state.onReview) await state.onReview(state.last);
    return context;
  };
  return state;
}

export async function physicalCandidateFixture({ root, repository = repoRoot, sourceSha = process.env.CUPIS_SYSTEM_COMMIT, deliveryDocument, autoDelivery = false } = {}) {
  const source = physicalEmailSourceFixture();
  const review = await createCandidateReviewFixture({ root, model: source.model, sourceEvidence: source, sourceSha, deliveryDocument, autoDelivery, repository });
  return Object.assign(review, { ...source, sourceEvidence: source, sourceSha, repository, assetRoot: root, candidates: [{ id: 'email-template' }, { id: 'nps-options' }] });
}

export function selectedDesignEvidence(binding) {
  return { figma_instances: Object.fromEntries(VIEWPORTS.map(viewport => [viewport, { role: viewport, email_id: binding.email_id, file_key: binding.file_key, node_id: binding.roots[viewport] }])) };
}
// Reused ordinary fixture mechanics; exact root IDs are independent literals.
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
    }
  }
  return (value ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const name = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function pngWithCornerAlpha(transparentCorner) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(2, 0);
  header.writeUInt32BE(2, 4);
  header[8] = 8;
  header[9] = 6;
  const alpha = transparentCorner ? 0 : 255;
  const rows = Buffer.from([
    0, 255, 255, 255, alpha, 255, 255, 255, 255,
    0, 255, 255, 255, 255, 255, 255, 255, 255,
  ]);
  return Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(rows)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

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
    const profile = profileById.get(contract.export_profile_id).contract;
    return {
      asset_contract_id: assetId,
      path: `images/${assetId}${profile.suffix ?? ""}${profile.extension}`,
    };
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
      const bytes = asset.path.endsWith(".png")
        ? pngWithCornerAlpha(contract.alpha_mode_id === "transparent")
        : Buffer.from(`mcp-export:${asset.path}`, "utf8");
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


function registeredInlineRuns(instance, viewport, elementId) {
  const record = registryIndex.bySystemId.get(instance.component_id);
  const root = selectVariantRoot(record, viewport, instance.variant_axes?.[viewport] ?? {}).root;
  const find = node => node.id === elementId ? node : (node.children ?? []).map(find).find(Boolean);
  const runs = find(root)?.facts?.find(fact => fact.id === 'styled-text-segments')?.value?.items;
  return Array.isArray(runs) && runs.length ? { inline_runs: structuredClone(runs) } : {};
}

function sourceValue(value) {
  if (value?.type === "rich-text") return value.value ?? value.segments.map(({ value: text }) => text).join("");
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
  const file_key = registryIndex.bySystemId.get(model.root.component_id).figma.file_key;
  assert.ok(entries.every(({ instance }) => registryIndex.bySystemId.get(instance.component_id).figma.file_key === file_key));
  const ids = new Map();
  for (const viewport of VIEWPORTS) for (const [index, entry] of entries.entries()) {
    const rootId = viewport === 'mobile' ? '2021:4164' : '2021:4163';
    const parentId = entry.parent && ids.get(`${viewport}:${entry.parent.instance_id}`);
    ids.set(`${viewport}:${entry.instance.instance_id}`, entry.instance === model.root ? rootId : `${parentId.startsWith('I') ? parentId : 'I' + parentId};9000:${index + 1}`);
  }
  const nodeId = (viewport, instance) => ids.get(`${viewport}:${instance.instance_id}`);
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
        readings.fields.push({ viewport, node_id, owner_node_id: node_id, field, value: sourceValue(item.value), ...registeredInlineRuns(instance, viewport, item.element_id) });
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


export async function plainAssetSourceFixture(root, topLevel = ["banner-secondary"]) { const source = await fixture(root, topLevel, "test-binding-assets"); const sourceEvidence = sourceEvidenceFor(source.model, source.assetEvidence); return { ...source, sourceEvidence, assetEvidence: sourceEvidence.assetEvidence }; }
