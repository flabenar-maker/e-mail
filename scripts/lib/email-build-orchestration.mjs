import { visibleModelAssets, modelAssetKey, hasInstanceVisibility } from "./email-instance-visibility.mjs";
import { cp, lstat, mkdir, mkdtemp, readdir, writeFile, realpath, readFile, rm } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { isDeepStrictEqual, promisify } from "node:util";
import { isAbsolute, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { inflateSync } from "node:zlib";

import {
  indexComponentRegistries,
  loadComponentRegistries,
  resolveComponentContracts,
} from "./component-registry.mjs";
import { loadAssetsFoundation, resolveAssetContract } from "./assets-foundation.mjs";
import { loadRendererRegistry } from "./renderer-registry.mjs";
import { validateEmailModelSemantics } from "./email-model.mjs";
import { selectVariantRoot } from "./email-interpreter.mjs";
import { prepareEmailDelivery } from "./email-delivery.mjs";
import { loadEmailDeliveryProfiles, selectDeliveryProfile } from "./email-delivery-profile.mjs";
import { collectEmailActions } from "./email-action-inventory.mjs";
import { createDeliveryDraft, missingDeliveryFields } from "./email-delivery-form.mjs";
import { loadEmailModel } from "./email-model.mjs";
import { prepareEmailRenderInput } from "../render-email.mjs";
import { verifyRealEmailVisual } from "../verify-real-email-visual.mjs";
import { readBoundInventory, inventoryTreePaths } from "./execution-inputs.mjs";
import { validSelectedModel, validateRuntimeCapabilities } from "./runtime-capabilities.mjs";
import { publishFileSetAtomically } from "./email-output.mjs";
import { validateZipEntryPath } from "./zip-store.mjs";

function failure(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

function handoffBlocker(code) {
  if (code === "COMPONENT_UNREGISTERED") return "component-unregistered";
  if (code === "COMPONENT_REGISTRY_INCOMPLETE_VIEWPORT") return "viewport-contract-missing";
  return "contract-ambiguous";
}

function instances(instance, output = []) {
  output.push(instance);
  for (const slot of instance?.slots ?? []) {
    for (const child of slot.instances ?? []) instances(child, output);
  }
  for (const nested of instance?.nested_components ?? []) instances(nested.instance, output);
  return output;
}

function assetKey(instanceId, componentId, assetContractId, path) {
  return `${instanceId}\0${componentId}\0${assetContractId}\0${path}`;
}

const execFileAsync = promisify(execFile);
const VIEWPORTS = ["mobile", "desktop"];
const TOP_LEVEL_ROLES = new Set(["email", "block", "banner", "nps"]);
const EXECUTABLE_WORKFLOW_MODES = new Set(["new-build", "continue-fix-design", "continue-fix-technical"]);
const FIGMA_NODE_ID = /^(?:I)?[0-9]+:[0-9]+(?:;[0-9]+:[0-9]+)*$/u;
const SHA256 = /^[0-9a-f]{64}$/u;

function contractElement(record, viewport, id, variantAxes = {}) {
  const visit = (element) => {
    if (!element) return null;
    if (element.id === id) return element;
    for (const child of element.children ?? []) {
      const match = visit(child);
      if (match) return match;
    }
    return null;
  };
  return visit(selectVariantRoot(record, viewport, variantAxes).root);
}

function nestedComponentIds(record, viewport, variantAxes = {}) {
  const result = new Set();
  const visit = (element) => {
    if (!element) return;
    if (element.render_mode === "nested-component") result.add(element.component_id);
    for (const child of element.children ?? []) visit(child);
  };
  visit(selectVariantRoot(record, viewport, variantAxes).root);
  return result;
}

function nestedOnlyComponentIds(index) {
  const result = new Set();
  const visit = (element) => {
    if (!element) return;
    if (element.render_mode === "nested-component") result.add(element.component_id);
    for (const child of element.children ?? []) visit(child);
  };
  for (const record of index.bySystemId.values()) {
    for (const viewport of VIEWPORTS) visit(record.contracts?.[viewport]?.root);
    for (const variant of record.contracts?.variant_contracts ?? []) visit(variant.root);
  }
  return result;
}
function validateModelPlacement(model, index, resolvedContracts) {
  const blockers = new Set();
  const idsByViewport = new Map(VIEWPORTS.map((viewport) => [
    viewport,
    new Set(resolvedContracts.filter((item) => item.viewport === viewport).map((item) => item.id)),
  ]));
  const nestedOnly = nestedOnlyComponentIds(index);

  const visit = (instance, relation = null) => {
    const record = index.bySystemId.get(instance.component_id);
    if (VIEWPORTS.some((viewport) => !idsByViewport.get(viewport).has(instance.component_id))) {
      blockers.add("contract-ambiguous");
    }
    if (!record) return;

    if (relation?.kind === "top-level") {
      if (!TOP_LEVEL_ROLES.has(record.identity.semantic_role) || nestedOnly.has(record.id)) {
        blockers.add("contract-ambiguous");
      }
    }

    if (relation?.kind === "nested") {
      let exactPlacementCount = 0;
      for (const viewport of VIEWPORTS) {
        const elementId = relation.elementIds?.[viewport] ?? relation.elementId;
        const axes = relation.parentInstance?.variant_axes?.[viewport] ?? {};
        const element = contractElement(relation.parent, viewport, elementId, axes);
        if (element) {
          exactPlacementCount += 1;
          if (
            element.render_mode !== "nested-component" ||
            element.component_id !== instance.component_id
          ) {
            blockers.add("contract-ambiguous");
          }
        } else if (relation.elementIds || !nestedComponentIds(relation.parent, viewport, axes).has(instance.component_id)) {
          blockers.add("contract-ambiguous");
        }
      }
      if (exactPlacementCount === 0) blockers.add("contract-ambiguous");
    }

    for (const slot of instance.slots ?? []) {
      const slotElements = VIEWPORTS
        .map((viewport) => contractElement(record, viewport, slot.element_id, instance.variant_axes?.[viewport] ?? {}))
        .filter(Boolean);
      if (
        slotElements.length !== VIEWPORTS.length ||
        slotElements.some((element) => element.render_mode !== "slot")
      ) {
        blockers.add("contract-ambiguous");
      }
      for (const child of slot.instances ?? []) {
        const relationKind = record.id === "email-template" && slot.element_id === "content"
          ? "top-level"
          : "slot";
        const childRecord = index.bySystemId.get(child.component_id);
        if (
          relationKind === "slot" &&
          (nestedOnly.has(child.component_id) || !TOP_LEVEL_ROLES.has(childRecord?.identity?.semantic_role))
        ) {
          blockers.add("contract-ambiguous");
        }
        visit(child, {
          kind: relationKind,
          parent: record,
          elementId: slot.element_id,
        });
      }
    }

    for (const nested of instance.nested_components ?? []) {
      visit(nested.instance, {
        kind: "nested",
        parent: record,
        elementId: nested.element_id,
        elementIds: nested.element_ids,
        parentInstance: instance,
      });
    }
  };

  visit(model.root);
  return blockers;
}

function resolvedAssetSelection(assets, contract) {
  return resolveAssetContract(assets, {
    sourceModeId: contract.source_mode_id,
    displayModeId: contract.display_mode_id,
    exportProfileId: contract.export_profile_id,
    expectedAlphaId: contract.alpha_mode_id,
    clippingPolicyId: contract.clipping_policy_id,
  });
}

const PNG_SIGNATURE = Buffer.from("89504e470d0a1a0a", "hex");

function assetPathMatchesProfile(path, contract, profile) {
  if (typeof path !== "string" || !path.startsWith("images/")) return false;
  const filename = path.slice("images/".length);
  const ending = profile.suffix + profile.extension;
  if (!filename.endsWith(ending)) return false;
  const base = filename.slice(0, -ending.length);
  if (/(?:^|-)(?:mobile|desktop)(?:-|$)/iu.test(base)) return false;
  return new RegExp("^(?:[a-z0-9]+-)*" + contract.id + "(?:-[0-9]+)?$", "u").test(base);
}

function pngAlphaBounds(bytes) {
  if (!Buffer.isBuffer(bytes) || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) return null;
  let offset = 8;
  let width = 0;
  let height = 0;
  let validHeader = false;
  let finished = false;
  const compressed = [];
  while (offset + 12 <= bytes.length) {
    const size = bytes.readUInt32BE(offset);
    if (size > bytes.length - offset - 12) return null;
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    const chunk = bytes.subarray(offset + 8, offset + 8 + size);
    offset += size + 12;
    if (type === "IHDR") {
      if (validHeader || size !== 13 || chunk[8] !== 8 || chunk[9] !== 6 ||
          chunk[10] !== 0 || chunk[11] !== 0 || chunk[12] !== 0) return null;
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      validHeader = true;
    } else if (type === "IDAT") {
      compressed.push(chunk);
    } else if (type === "IEND") {
      finished = true;
      break;
    }
  }
  if (!validHeader || !finished || compressed.length === 0 || width === 0 || height === 0) return null;
  const rowBytes = width * 4;
  const expectedLength = height * (rowBytes + 1);
  if (!Number.isSafeInteger(expectedLength) || expectedLength > 100_000_000) return null;
  let raw;
  try {
    raw = inflateSync(Buffer.concat(compressed), { maxOutputLength: expectedLength });
  } catch {
    return null;
  }
  if (raw.length !== expectedLength) return null;
  let previous = Buffer.alloc(rowBytes);
  let current = Buffer.alloc(rowBytes);
  let min = 255;
  let max = 0;
  let cursor = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[cursor++];
    if (filter > 4) return null;
    for (let x = 0; x < rowBytes; x += 1) {
      const left = x >= 4 ? current[x - 4] : 0;
      const up = previous[x];
      const upperLeft = x >= 4 ? previous[x - 4] : 0;
      let predictor = 0;
      if (filter === 1) predictor = left;
      else if (filter === 2) predictor = up;
      else if (filter === 3) predictor = Math.floor((left + up) / 2);
      else if (filter === 4) {
        const p = left + up - upperLeft;
        const a = Math.abs(p - left);
        const b = Math.abs(p - up);
        const c = Math.abs(p - upperLeft);
        predictor = a <= b && a <= c ? left : b <= c ? up : upperLeft;
      }
      current[x] = (raw[cursor++] + predictor) & 255;
    }
    for (let x = 3; x < rowBytes; x += 4) {
      min = Math.min(min, current[x]);
      max = Math.max(max, current[x]);
    }
    [previous, current] = [current, previous];
  }
  return { min, max };
}

async function validateAssetEvidence({ assetRoot, component, contract, asset, item, resolved }) {
  const profile = resolved.export_profile.contract;
  if (
    !assetPathMatchesProfile(asset.path, contract, profile) ||
    item?.mcp_export?.source !== "figma-mcp" ||
    typeof item.mcp_export.evidence_id !== "string" ||
    item.mcp_export.evidence_id.trim() === "" ||
    item.mcp_export.owner_layer_name !== contract.owner_layer_name ||
    item.mcp_export.file_key !== component.figma.file_key ||
    !FIGMA_NODE_ID.test(item.mcp_export.source_node_id ?? "") ||
    !SHA256.test(item.sha256 ?? "")
  ) {
    return false;
  }

  try {
    const physicalRoot = await realpath(assetRoot);
    const sourcePath = join(assetRoot, ...asset.path.split("/"));
    const physical = await realpath(sourcePath);
    if (!inside(physicalRoot, physical)) return false;
    const bytes = await readFile(physical);
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (item.sha256 !== digest) return false;
    if (profile.format === "PNG" && (contract.alpha_mode_id === "opaque" ||
        contract.alpha_mode_id === "transparent")) {
      const alpha = pngAlphaBounds(bytes);
      if (!alpha) return false;
      if (contract.alpha_mode_id === "opaque") return alpha.min === 255;
      return alpha.min === 0 && alpha.max > 0;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates the handoff inputs owned by orchestration.  It deliberately
 * returns the supplied normalized model unchanged: HTML remains exclusively
 * owned by the renderer CLI.
 */
export async function prepareEmailBuildHandoff({
  repoRoot,
  model,
  candidates,
  assetEvidence,
  assetRoot,
}) {
  const [registries, rendererRegistry, assets] = await Promise.all([
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadAssetsFoundation({ repoRoot }),
  ]);
  const componentIndex = indexComponentRegistries(registries);
  const blockers = new Set();
  const resolvedContracts = [];

  for (const viewport of VIEWPORTS) {
    const resolved = resolveComponentContracts({ index: componentIndex, candidates, viewport });
    if (resolved.status === "blocked") {
      resolved.blockers.forEach((item) => blockers.add(handoffBlocker(item.code)));
    } else {
      resolvedContracts.push(...resolved.components.map((component) => ({ viewport, ...component })));
    }
  }
  if (blockers.size > 0) return { blockers: [...blockers].sort(), model, resolvedContracts, assetContracts: [] };

  if (model?.root?.component_id !== "email-template") blockers.add("renderer-diagnostic");
  for (const value of validateModelPlacement(model, componentIndex, resolvedContracts)) blockers.add(value);
  const semantics = validateEmailModelSemantics(model, {
    componentIndex,
    rendererRegistry,
  });
  if (semantics.length > 0) blockers.add("renderer-diagnostic");
  if (blockers.size > 0) return { blockers: [...blockers].sort(), model, resolvedContracts, assetContracts: [] };

  const evidence = new Map((assetEvidence ?? []).map((item) => [
    assetKey(item.instance_id, item.component_id, item.asset_contract_id, item.path), item,
  ]));
  const assetContracts = [];
  const activeAssets = hasInstanceVisibility(model.root) ? visibleModelAssets(model, componentIndex) : null;
  for (const instance of instances(model.root)) {
    const component = componentIndex.bySystemId.get(instance.component_id);
    for (const asset of instance.asset_files ?? []) {
      if (activeAssets && !activeAssets.has(modelAssetKey(instance, asset.asset_contract_id))) continue;
      const item = evidence.get(assetKey(
        instance.instance_id,
        instance.component_id,
        asset.asset_contract_id,
        asset.path,
      ));
      const contract = component?.asset_contracts?.find(({ id }) => id === asset.asset_contract_id);
      if (!contract) {
        blockers.add("asset-contract-missing");
        continue;
      }
      let resolved;
      try {
        resolved = resolvedAssetSelection(assets, contract);
      } catch {
        blockers.add("asset-contract-missing");
        continue;
      }
      if (!await validateAssetEvidence({
        assetRoot,
        instance,
        component,
        contract,
        asset,
        item,
        resolved,
      })) {
        blockers.add("asset-contract-missing");
        continue;
      }
      assetContracts.push({
        component_id: instance.component_id,
        asset_contract_id: asset.asset_contract_id,
        path: asset.path,
        resolved,
      });
    }
  }
  return {
    blockers: [...blockers].sort(),
    model: structuredClone(model),
    resolvedContracts,
    assetContracts,
  };
}

async function defaultRendererRunner({ repoRoot, modelPath, outputDir, deliveryPath, sourceSha }, expectedModelDigest) {
  await execFileAsync(
    process.execPath,
    [join(repoRoot, "scripts", "render-email.mjs"), "--model", modelPath, "--output", outputDir, ...(deliveryPath ? ["--delivery", deliveryPath] : [])],
    { cwd: repoRoot, env:{...process.env, CUPIS_EXPECTED_EMAIL_MODEL_DIGEST: expectedModelDigest ?? "", ...(sourceSha ? {CUPIS_SYSTEM_COMMIT:sourceSha} : {})} },
  );
}

async function verifyNewBuildSource({ workflowMode, sourceEvidence, repoRoot, assetRoot, model, assetEvidence }) {
  if (!["new-build", "continue-fix-design"].includes(workflowMode)) return { blockers: [], diagnostics: [] };
  if (!sourceEvidence?.readings || !sourceEvidence?.correspondence) {
    return { blockers: ["source-evidence-missing"], diagnostics: [] };
  }

  const proofPath = join(tmpdir(), ".temporary-email-source-" + randomUUID() + ".json");
  try {
    await writeFile(proofPath, JSON.stringify({
      ...sourceEvidence,
      selectedTest: false,
      model,
      assetEvidence,
    }), "utf8");
    const { stdout } = await execFileAsync(
      process.execPath,
      [join(repoRoot, "scripts", "verify-email-source.mjs"), proofPath],
      { cwd: repoRoot },
    );
    const report = JSON.parse(stdout);
    if (report.status === "passed" && report.scope === "full-email" &&
        Array.isArray(report.diagnostics) && report.diagnostics.length === 0) {
      return { blockers: [], diagnostics: [], report };
    }
    return { blockers: ["source-evidence-mismatch"], diagnostics: report.diagnostics ?? [] };
  } catch (error) {
    let report;
    try {
      report = JSON.parse(error.stdout);
    } catch {
      report = { diagnostics: [{ code: "EMAIL_SOURCE_VERIFY_FAILED", message: error.message }] };
    }
    return { blockers: ["source-evidence-mismatch"], diagnostics: report.diagnostics ?? [] };
  } finally {
    await rm(proofPath, { force: true });
  }
}

function continueFixEvidenceBlockers(workflowMode, evidence) {
  if (workflowMode !== "continue-fix-design") return [];
  const blockers = new Set();
  const mobile = evidence?.figma_instances?.mobile;
  const desktop = evidence?.figma_instances?.desktop;
  const validFigma =
    mobile?.role === "mobile" &&
    desktop?.role === "desktop" &&
    typeof mobile.email_id === "string" &&
    mobile.email_id === desktop.email_id &&
    typeof mobile.file_key === "string" &&
    mobile.file_key === desktop.file_key &&
    FIGMA_NODE_ID.test(mobile.node_id ?? "") &&
    FIGMA_NODE_ID.test(desktop.node_id ?? "");
  if (!validFigma) blockers.add("figma-source-missing");
  const visual = evidence?.visual_regression;
  if (
    visual?.status !== "passed" ||
    typeof visual.reference_id !== "string" ||
    visual.reference_id.trim() === "" ||
    typeof visual.render_id !== "string" ||
    visual.render_id.trim() === ""
  ) {
    blockers.add("visual-regression");
  }
  return [...blockers].sort();
}

const bytesDigest = bytes => createHash("sha256").update(bytes).digest("hex");
const exactKeys = (value, names) => value && typeof value === "object" && !Array.isArray(value) &&
  Object.keys(value).sort().join(",") === [...names].sort().join(",");
const identifier = value => typeof value === "string" && value.trim() === value && value.length > 0 && !/[\x00-\x1f]/u.test(value);

function selectedBinding(value) {
  if (!exactKeys(value, ["email_id", "file_key", "roots", "source_sha", "model_digest"]) ||
      !exactKeys(value.roots, VIEWPORTS) || !identifier(value.email_id) || !identifier(value.file_key) ||
      VIEWPORTS.some(viewport => !FIGMA_NODE_ID.test(value.roots[viewport] ?? "")) ||
      !/^[0-9a-f]{40}$/u.test(value.source_sha ?? "") || !SHA256.test(value.model_digest ?? "")) return null;
  // Stable serialization order is part of the candidate manifest contract.
  return { email_id: value.email_id, file_key: value.file_key,
    roots: { mobile: value.roots.mobile, desktop: value.roots.desktop },
    source_sha: value.source_sha, model_digest: value.model_digest };
}

function qualifiedCandidateReviewer(q) {
  if (!exactKeys(q, ["executor_agent_id", "reviewer_agent_id", "selected_model", "runtime_session_id", "tool_signature", "effort", "supported_efforts", "capabilities"]) ||
      !identifier(q.executor_agent_id) || !identifier(q.reviewer_agent_id) || q.executor_agent_id === q.reviewer_agent_id ||
      !validSelectedModel(q.selected_model) || !Array.isArray(q.capabilities) || !q.capabilities.includes("vision")) return false;
  return validateRuntimeCapabilities({ schema_version: "1.0.0", source: "declared-runtime-tools",
    runtime_session_id: q.runtime_session_id, tool_signature: q.tool_signature, selected_model: q.selected_model,
    supported_efforts: q.supported_efforts, capabilities: q.capabilities, max_subagents: 1 }) && q.supported_efforts.includes(q.effort);
}

function selectionDiagnostics({ binding, canonicalModel, modelBytes, sourceEvidence, sourceSha }) {
  if (!binding) return [{ code: "EMAIL_SOURCE_SELECTION_INVALID", path: "/selectedSourceBinding", message: "An exact coordinator-selected source binding is required." }];
  const root = sourceEvidence?.correspondence?.instances?.find(item => item.instance_id === canonicalModel.root.instance_id);
  const matches = binding.email_id === canonicalModel.id && binding.source_sha === sourceSha &&
    binding.model_digest === bytesDigest(modelBytes) && binding.file_key === sourceEvidence?.readings?.file_key &&
    binding.file_key === sourceEvidence?.correspondence?.file_key && VIEWPORTS.every(viewport =>
      binding.roots[viewport] === sourceEvidence?.readings?.selection?.[viewport]?.root_node_id && binding.roots[viewport] === root?.nodes?.[viewport]);
  return matches ? [] : [{ code: "EMAIL_SOURCE_SELECTION_MISMATCH", path: "/selectedSourceBinding", message: "Final model and full source evidence must match the selected email, file, roots, source and exact model bytes." }];
}

function selectedDesignBlockers(mode, evidence, binding) {
  if (mode !== "continue-fix-design") return [];
  return binding && VIEWPORTS.every(viewport => {
    const item = evidence?.figma_instances?.[viewport];
    return item?.role === viewport && item.email_id === binding.email_id && item.file_key === binding.file_key && item.node_id === binding.roots[viewport];
  }) ? [] : ["figma-source-missing"];
}

async function captureFiles(paths) {
  const entries = new Map();
  for (const path of new Set(paths)) entries.set(path, await readFile(path));
  return entries;
}

async function assertFilesUnchanged(entries) {
  for (const [path, bytes] of entries) if (!(await readFile(path)).equals(bytes)) throw failure("EMAIL_BUILD_INPUT_CHANGED");
}

async function captureCandidate(candidateDir) {
  const info = await lstat(candidateDir);
  if (!info.isDirectory() || info.isSymbolicLink()) throw failure("EMAIL_CANDIDATE_INVALID");
  const paths = await inventoryTreePaths(candidateDir);
  if (!paths.includes("email.html") || new Set(paths.map(path => path.toLowerCase())).size !== paths.length) throw failure("EMAIL_CANDIDATE_INVALID");
  const entries = [];
  for (const path of paths) {
    if (!validateZipEntryPath(path)) throw failure("EMAIL_CANDIDATE_INVALID");
    const bytes = await readFile(join(candidateDir, ...path.split("/")));
    if (path === "email.html" && !bytes.length) throw failure("EMAIL_CANDIDATE_INVALID");
    entries.push({ path, bytes });
  }
  return entries;
}

async function assertEvidenceOutsideCandidate(path, candidateDir) {
  if (typeof path !== "string" || !isAbsolute(path) || inside(candidateDir, path) ||
      inside(await realpath(candidateDir), await realpath(path))) throw failure("EMAIL_CANDIDATE_EVIDENCE_INSIDE_OUTPUT");
}

async function verifySelectedCandidate(context, { binding, identity, qualification, candidateDir }) {
  if (!context || !isDeepStrictEqual(context.identity, identity)) throw failure("EMAIL_CANDIDATE_REVIEW_MISMATCH");
  const { review_ref, ...returnedQualification } = context.reviewQualification ?? {};
  if (!review_ref || !isDeepStrictEqual(returnedQualification, qualification)) throw failure("EMAIL_CANDIDATE_REVIEW_MISMATCH");
  await assertEvidenceOutsideCandidate(context.referenceRoot, candidateDir);
  await assertEvidenceOutsideCandidate(resolve(context.referenceRoot, review_ref.path), candidateDir);
  const inventories = {};
  for (const kind of ["email_model", "reference_manifest", "evidence_root"]) {
    await assertEvidenceOutsideCandidate(context.inputRoots?.[kind], candidateDir);
    await assertEvidenceOutsideCandidate(resolve(context.referenceRoot, context.inputRefs?.[kind]?.path ?? ""), candidateDir);
    inventories[kind] = await readBoundInventory({ ref: context.inputRefs?.[kind], referenceRoot: context.referenceRoot, root: context.inputRoots?.[kind], kind });
    for (const file of inventories[kind].inventory.files) {
      await assertEvidenceOutsideCandidate(resolve(context.inputRoots[kind], file.path), candidateDir);
    }
  }
  const modelFiles = inventories.email_model.inventory.files;
  if (modelFiles.length !== 1 || modelFiles[0].digest !== binding.model_digest || !exactKeys(context.viewportImageRefs, VIEWPORTS)) throw failure("EMAIL_CANDIDATE_REVIEW_MISMATCH");
  for (const [name, kind] of [["reference", "reference_manifest"], ["rendered", "evidence_root"]]) {
    const mapped = VIEWPORTS.map(viewport => context.viewportImageRefs[viewport]?.[name]);
    if (mapped.some(ref => !inventories[kind].inventory.files.some(file => isDeepStrictEqual(file, ref))) || mapped[0].path === mapped[1].path) throw failure("EMAIL_CANDIDATE_REVIEW_MISMATCH");
  }
  return verifyRealEmailVisual(context);
}

async function executeProtectedEmailBuildHandoff({ outputDir, rendererRunner = defaultRendererRunner, resolution, continueFixEvidence,
  sourceEvidence, deliveryDocument, sourceSha, selectedSourceBinding, candidateReviewQualification, candidateReviewer, ...input }) {
  let ownedRoot, modelPath, deliveryPath, handoff;
  let failureBlocker = "renderer-diagnostic";
  try {
    // No callback-reachable object is used as a later comparison baseline.
    const callerState = { model: input.model, delivery: deliveryDocument, source: sourceEvidence,
      binding: selectedSourceBinding, qualification: candidateReviewQualification, design: continueFixEvidence,
      candidates: input.candidates, assets: input.assetEvidence };
    const baseline = structuredClone(callerState);
    const assertCallerUnchanged = () => { if (!isDeepStrictEqual(callerState, baseline)) throw failure("EMAIL_BUILD_INPUT_CHANGED"); };
    const binding = selectedBinding(baseline.binding);
    const qualification = baseline.qualification;
    sourceSha ??= process.env.CUPIS_SYSTEM_COMMIT;
    sourceSha ??= (await execFileAsync("git", ["rev-parse", "HEAD"], { cwd: input.repoRoot })).stdout.trim();
    if (!/^[0-9a-f]{40}$/u.test(sourceSha ?? "")) throw failure("EMAIL_DELIVERY_SOURCE_UNKNOWN");
    ownedRoot = await mkdtemp(join(tmpdir(), "cupis-email-candidate-"));
    modelPath = join(input.assetRoot, `.temporary-email-model-${randomUUID()}.json`);
    const designBytes = Buffer.from(JSON.stringify(baseline.model), "utf8");
    await writeFile(modelPath, designBytes);
    const expectedFiles = new Map([[modelPath, designBytes]]);
    // Retain the existing loader contract; canonical design bytes stay intact.
    await loadEmailModel({ modelPath, schemaPath: join(input.repoRoot, "schemas", "email-model.schema.json") });
    let document = baseline.delivery;
    const deliveryRequired = resolution?.workflow?.steps?.some(step => step.id === "validate-delivery-answers");
    if (deliveryRequired && !document) {
      failureBlocker = "delivery-not-ready";
      const componentIndex = indexComponentRegistries(await loadComponentRegistries({ repoRoot: input.repoRoot }));
      const profile = selectDeliveryProfile(await loadEmailDeliveryProfiles({ repoRoot: input.repoRoot, componentIndex }));
      const inventory = collectEmailActions({ model: baseline.model, componentIndex, profile });
      if (inventory.diagnostics.length) throw new AggregateError(inventory.diagnostics, "Delivery research is blocked.");
      document = createDeliveryDraft({ emailId: baseline.model.id, sourceSha, profile, inventory });
      if (missingDeliveryFields({ inventory, deliveryDraft: document }).length) return { blockers: ["delivery-required"], executed: false };
    }
    if (document) {
      failureBlocker = "delivery-not-ready";
      deliveryPath = join(input.assetRoot, `.temporary-email-delivery-${randomUUID()}.json`);
      const documentBytes = Buffer.from(JSON.stringify(document), "utf8");
      await writeFile(deliveryPath, documentBytes);
      expectedFiles.set(deliveryPath, documentBytes);
    }
    const prepared = await prepareEmailRenderInput({ repoRoot: input.repoRoot, modelPath, deliveryPath, sourceSha });
    failureBlocker = "renderer-diagnostic";
    handoff = await prepareEmailBuildHandoff({ ...input, candidates: baseline.candidates, assetEvidence: baseline.assets, model: prepared.canonicalModel });
    const mode = resolution.workflow.mode;
    const diagnostics = selectionDiagnostics({ binding, canonicalModel: prepared.canonicalModel, modelBytes: prepared.modelBytes, sourceEvidence: baseline.source, sourceSha });
    const finalModelPath = join(ownedRoot, "final-model.json");
    await writeFile(finalModelPath, prepared.modelBytes);
    expectedFiles.set(finalModelPath, prepared.modelBytes);
    const protectedFiles = await captureFiles([modelPath, finalModelPath, ...(deliveryPath ? [deliveryPath] : []),
      ...handoff.assetContracts.map(asset => join(input.assetRoot, ...asset.path.split("/")))]);
    for (const [path, bytes] of expectedFiles) if (!protectedFiles.get(path)?.equals(bytes)) throw failure("EMAIL_BUILD_INPUT_CHANGED");
    for (const asset of handoff.assetContracts) {
      const receipts = (baseline.assets ?? []).filter(item => item.path === asset.path &&
        item.component_id === asset.component_id && item.asset_contract_id === asset.asset_contract_id);
      const digest = bytesDigest(protectedFiles.get(join(input.assetRoot, ...asset.path.split("/"))));
      if (!receipts.length || receipts.some(item => item.sha256 !== digest)) throw failure("EMAIL_BUILD_INPUT_CHANGED");
    }
    assertCallerUnchanged();
    const sourceGate = await verifyNewBuildSource({ workflowMode: mode, sourceEvidence: baseline.source, repoRoot: input.repoRoot,
      model: prepared.canonicalModel, assetEvidence: baseline.assets });
    assertCallerUnchanged();
    await assertFilesUnchanged(protectedFiles);
    const blockers = [...new Set([...handoff.blockers, ...sourceGate.blockers,
      ...(diagnostics.length ? [selectedSourceBinding ? "source-evidence-mismatch" : "source-evidence-missing"] : []),
      ...selectedDesignBlockers(mode, baseline.design, binding),
      ...(typeof candidateReviewer !== "function" || !qualifiedCandidateReviewer(qualification) ? ["visual-regression"] : []),
    ])].sort();
    if (blockers.length) return { ...handoff, blockers, sourceDiagnostics: [...sourceGate.diagnostics, ...diagnostics], executed: false };
    const reportPath = join(ownedRoot, "source-report.json");
    const reportBytes = Buffer.from(JSON.stringify(sourceGate.report), "utf8");
    await writeFile(reportPath, reportBytes);
    protectedFiles.set(reportPath, reportBytes);
    assertCallerUnchanged();
    const candidateDir = join(ownedRoot, "candidate");
    const rendererArguments = { repoRoot: input.repoRoot, modelPath, outputDir: candidateDir, deliveryPath, sourceSha };
    if (rendererRunner === defaultRendererRunner) await defaultRendererRunner(rendererArguments, binding.model_digest);
    else await rendererRunner(rendererArguments);
    assertCallerUnchanged();
    await assertFilesUnchanged(protectedFiles);
    const entries = await captureCandidate(candidateDir);
    const files = entries.map(({ path, bytes }) => ({ path, digest: bytesDigest(bytes) }));
    const identity = { request_id: `email-candidate-${randomUUID()}`, source_sha: sourceSha,
      artifact_digest: bytesDigest(Buffer.from(JSON.stringify({ selectedSourceBinding: binding, files }), "utf8")) };
    const comparisonPath = join(ownedRoot, "source-comparison.json");
    const comparisonBytes = Buffer.from(JSON.stringify({ final_model_path: finalModelPath, model_digest: binding.model_digest,
      source_report: sourceGate.report, selectedSourceBinding: binding, identity, files }), "utf8");
    await writeFile(comparisonPath, comparisonBytes);
    protectedFiles.set(comparisonPath, comparisonBytes);
    const callbackSelection = structuredClone(binding);
    const callbackRef = { path: comparisonPath, digest: bytesDigest(comparisonBytes) };
    const originalRef = structuredClone(callbackRef);
    failureBlocker = "visual-regression";
    const returnedContext = await candidateReviewer({ candidateDir, selectedSourceBinding: callbackSelection, sourceComparisonRef: callbackRef });
    const context = structuredClone(returnedContext);
    const assertReviewUnchanged = () => {
      if (!isDeepStrictEqual(returnedContext, context)) throw failure("EMAIL_BUILD_INPUT_CHANGED");
    };
    assertCallerUnchanged();
    if (!isDeepStrictEqual(callbackSelection, binding) || !isDeepStrictEqual(callbackRef, originalRef)) throw failure("EMAIL_BUILD_INPUT_CHANGED");
    const visual = await verifySelectedCandidate(context, { binding, identity, qualification, candidateDir });
    assertReviewUnchanged();
    await assertFilesUnchanged(protectedFiles);
    const current = await captureCandidate(candidateDir);
    if (current.length !== entries.length || current.some((entry, index) => entry.path !== entries[index].path || !entry.bytes.equals(entries[index].bytes))) throw failure("EMAIL_CANDIDATE_CHANGED");
    // Re-read all visual inventories immediately before committing checked bytes.
    await verifySelectedCandidate(context, { binding, identity, qualification, candidateDir });
    assertReviewUnchanged();
    await assertFilesUnchanged(protectedFiles);
    const finalCandidate = await captureCandidate(candidateDir);
    if (finalCandidate.length !== entries.length || finalCandidate.some((entry, index) => entry.path !== entries[index].path || !entry.bytes.equals(entries[index].bytes))) throw failure("EMAIL_CANDIDATE_CHANGED");
    assertCallerUnchanged();
    assertReviewUnchanged();
    failureBlocker = "renderer-diagnostic";
    const publication = await publishFileSetAtomically({ outputDir, entries });
    return { ...handoff, sourceDiagnostics: [], executed: true, sourceReport: sourceGate.report,
      release: { source_sha: sourceSha, model_digest: binding.model_digest, artifact_digest: identity.artifact_digest, files },
      visualVerification: visual, publication };
  } catch (error) {
    const diagnostics = error instanceof AggregateError ? error.errors.map(({ code, path, message }) => ({ code, path, message }))
      : [{ code: error.code ?? "EMAIL_BUILD_FAILED", message: error.message }];
    return { ...handoff, blockers: [failureBlocker], ...(failureBlocker === "delivery-not-ready" ? { deliveryDiagnostics: diagnostics } : { releaseDiagnostics: diagnostics }), executed: false };
  } finally {
    if (modelPath) await rm(modelPath, { force: true });
    if (deliveryPath) await rm(deliveryPath, { force: true });
    if (ownedRoot) await rm(ownedRoot, { recursive: true, force: true });
  }
}

export async function executeEmailBuildHandoff(input) {
  return ["new-build", "continue-fix-design"].includes(input.resolution?.workflow?.mode)
    ? executeProtectedEmailBuildHandoff(input) : executeLegacyEmailBuildHandoff(input);
}

async function executeLegacyEmailBuildHandoff({
  outputDir,
  rendererRunner = defaultRendererRunner,
  resolution,
  continueFixEvidence,
  sourceEvidence,
  deliveryDocument,
  sourceSha,
  ...input
}) {
  const workflowMode = resolution?.workflow?.mode;
  const workflowModeBlockers = EXECUTABLE_WORKFLOW_MODES.has(workflowMode)
    ? []
    : ["workflow-mode-invalid"];
  const deliveryRequired = resolution?.workflow?.steps?.some(step => step.id === "validate-delivery-answers");
  if (deliveryRequired && !deliveryDocument) {
    try {
      sourceSha ??= process.env.CUPIS_SYSTEM_COMMIT;
      sourceSha ??= (await execFileAsync("git", ["rev-parse","HEAD"], {cwd:input.repoRoot})).stdout.trim();
      if (!/^[0-9a-f]{40}$/u.test(sourceSha)) throw failure("EMAIL_DELIVERY_SOURCE_UNKNOWN");
      const componentIndex = indexComponentRegistries(await loadComponentRegistries({repoRoot:input.repoRoot}));
      const profile = selectDeliveryProfile(await loadEmailDeliveryProfiles({repoRoot:input.repoRoot,componentIndex}));
      const inventory = collectEmailActions({model:input.model,componentIndex,profile});
      if (inventory.diagnostics.length) throw new AggregateError(inventory.diagnostics, "Delivery research is blocked.");
      const deliveryDraft = createDeliveryDraft({emailId:input.model.id,sourceSha,profile,inventory});
      if (missingDeliveryFields({inventory,deliveryDraft}).length) return { blockers:["delivery-required"], executed:false };
      deliveryDocument = deliveryDraft;
    } catch (error) {
      return {blockers:["delivery-not-ready"],deliveryDiagnostics:error instanceof AggregateError ? error.errors : [{code:error.code ?? "EMAIL_DELIVERY_FAILED",message:error.message}],executed:false};
    }
  }
  let delivery;
  if (deliveryDocument) {
    try {
      sourceSha ??= process.env.CUPIS_SYSTEM_COMMIT;
      sourceSha ??= (await execFileAsync("git", ["rev-parse","HEAD"], {cwd:input.repoRoot})).stdout.trim();
      if (!/^[0-9a-f]{40}$/u.test(sourceSha)) throw failure("EMAIL_DELIVERY_SOURCE_UNKNOWN");
      const componentIndex = indexComponentRegistries(await loadComponentRegistries({repoRoot:input.repoRoot}));
      delivery = await prepareEmailDelivery({repoRoot:input.repoRoot, model:input.model, componentIndex, document:deliveryDocument, purpose:"final", sourceSha});
    } catch (error) {
      return {blockers:["delivery-not-ready"], deliveryDiagnostics:error instanceof AggregateError ? error.errors : [{code:error.code ?? "EMAIL_DELIVERY_FAILED",message:error.message}],executed:false};
    }
  }
  const handoff = await prepareEmailBuildHandoff({...input, model:delivery?.model ?? input.model});
  const sourceGate = workflowModeBlockers.length
    ? { blockers: [], diagnostics: [] }
    : await verifyNewBuildSource({
      workflowMode,
      sourceEvidence,
      repoRoot: input.repoRoot,
      assetRoot: input.assetRoot,
      model: input.model,
      assetEvidence: input.assetEvidence,
    });
  const blockers = [...new Set([
    ...handoff.blockers,
    ...workflowModeBlockers,
    ...continueFixEvidenceBlockers(workflowMode, continueFixEvidence),
    ...sourceGate.blockers,
  ])].sort();
  if (blockers.length) return { ...handoff, blockers, sourceDiagnostics: sourceGate.diagnostics, executed: false };
  const modelPath = join(input.assetRoot, `.temporary-email-model-${randomUUID()}.json`);
  const deliveryPath = delivery ? join(input.assetRoot, `.temporary-email-delivery-${randomUUID()}.json`) : undefined;
  try {
    await writeFile(modelPath, JSON.stringify(delivery ? input.model : handoff.model), "utf8");
    if (deliveryPath) await writeFile(deliveryPath, JSON.stringify(deliveryDocument), "utf8");
    await rendererRunner({ repoRoot: input.repoRoot, modelPath, outputDir, deliveryPath, sourceSha });
    return { ...handoff, sourceDiagnostics: sourceGate.diagnostics, executed: true };
  } finally {
    await rm(modelPath, { force: true });
    if (deliveryPath) await rm(deliveryPath, { force:true });
  }
}

function hasValue(value) {
  return value !== undefined && value !== null && (typeof value !== "string" || value.trim() !== "");
}

function selectMode(workflow, inputs) {
  return [...workflow.workflow.modes]
    .map((mode) => {
      const matched = mode.required_inputs.filter((id) => hasValue(inputs[id])).length;
      return { mode, matched, missing: mode.required_inputs.length - matched };
    })
    .sort((left, right) =>
      right.matched - left.matched ||
      left.missing - right.missing ||
      right.mode.required_inputs.length - left.mode.required_inputs.length ||
      left.mode.id.localeCompare(right.mode.id),
    )[0].mode;
}

function declaredBlocker(mode, input) {
  const mappings = mode.input_blockers?.filter((entry) => entry.input === input) ?? [];
  if (mappings.length === 0) throw failure("WORKFLOW_INPUT_BLOCKER_MISSING");
  if (mappings.length > 1) throw failure("WORKFLOW_INPUT_BLOCKER_DUPLICATE");
  const [configured] = mappings;
  if (!mode.steps.some((step) => step.blockers.includes(configured.blocker))) {
    throw failure("WORKFLOW_INPUT_BLOCKER_UNDECLARED");
  }
  return configured.blocker;
}

function relationBlocker(mode, inputs) {
  for (const relation of mode.input_relations ?? []) {
    if (!relation.inputs.every((id) => hasValue(inputs[id]))) continue;
    const values = relation.inputs.map((id) => inputs[id][relation.field]);
    if (values.some((value) => !hasValue(value))) return relation.blocker;
    const invalid = relation.kind === "ordered-field-values"
      ? values.some((value, index) => value !== relation.values[index])
      : new Set(values).size !== 1;
    if (invalid) return relation.blocker;
  }
  return null;
}

export function resolveEmailBuildRequest({ workflow, inputs }) {
  const mode = selectMode(workflow, inputs);
  const missing = mode.required_inputs.find((id) => !hasValue(inputs[id]));
  const blocker = missing ? declaredBlocker(mode, missing) : relationBlocker(mode, inputs);
  return {
    mode: mode.id,
    blocker,
    allowedOutputs: blocker ? [] : [...mode.allowed_outputs],
  };
}

function inside(root, candidate) {
  const path = relative(resolve(root), resolve(candidate));
  return path === "" || (!path.startsWith("..") && !isAbsolute(path));
}

function semanticSlug(purpose) {
  if (typeof purpose !== "string" || !/^[\x00-\x7F]*$/u.test(purpose)) throw failure("version-path-unsafe");
  const slug = purpose.toLowerCase().match(/[a-z0-9]+/gu)?.join("-") ?? "";
  if (!slug) throw failure("version-path-unsafe");
  return slug;
}

function safeSourceFolder(folder) {
  return typeof folder === "string" && /^[a-z0-9]+(?:[-_][a-z0-9]+)*_[0-9]+\.[0-9]+$/u.test(folder);
}

async function assertNoLinkedDescendants(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw failure("version-path-unsafe");
    if (entry.isDirectory()) await assertNoLinkedDescendants(join(directory, entry.name));
  }
}

function assertOutputContract(resolution) {
  for (const output of ["version-folder", "email-html", "images-directory"]) {
    if (!resolution.allowedOutputs.includes(output)) throw failure("version-path-unsafe");
  }
}

export async function createEmailVersion({ resolution, workspaceRoot, outputParent, purpose, sourceFolder }) {
  assertOutputContract(resolution);
  if (!inside(workspaceRoot, outputParent) || (sourceFolder && !safeSourceFolder(sourceFolder))) {
    throw failure("version-path-unsafe");
  }

  let physicalWorkspace;
  let physicalParent;
  let physicalSource;
  try {
    physicalWorkspace = await realpath(workspaceRoot);
    physicalParent = await realpath(outputParent);
    if (!inside(physicalWorkspace, physicalParent)) throw failure("version-path-unsafe");
    if (sourceFolder) {
      physicalSource = await realpath(join(physicalParent, sourceFolder));
      if (!inside(physicalParent, physicalSource)) throw failure("version-path-unsafe");
      const emailPath = join(physicalSource, "email.html");
      const imagesPath = join(physicalSource, "images");
      if ((await lstat(emailPath)).isSymbolicLink() || (await lstat(imagesPath)).isSymbolicLink()) {
        throw failure("version-path-unsafe");
      }
      const emailFile = await realpath(emailPath);
      const imagesDirectory = await realpath(imagesPath);
      if (!inside(physicalSource, emailFile) || !inside(physicalSource, imagesDirectory)) {
        throw failure("version-path-unsafe");
      }
      await assertNoLinkedDescendants(imagesDirectory);
    }
  } catch {
    throw failure("version-path-unsafe");
  }

  const base = sourceFolder ? sourceFolder.replace(/_[0-9]+\.[0-9]+$/u, "") : semanticSlug(purpose);
  const version = sourceFolder?.match(/_([0-9]+)\.([0-9]+)$/u);
  const major = version ? Number(version[1]) : 1;
  let minor = version ? Number(version[2]) + 1 : 0;
  if (!Number.isSafeInteger(major) || !Number.isSafeInteger(minor)) throw failure("version-path-unsafe");
  const entries = new Set(await readdir(physicalParent));
  let folder = base + "_" + major + "." + minor;
  while (entries.has(folder)) {
    minor += 1;
    if (!Number.isSafeInteger(minor)) throw failure("version-path-unsafe");
    folder = base + "_" + major + "." + minor;
  }
  const target = join(physicalParent, folder);
  if (!inside(physicalWorkspace, target)) throw failure("version-path-unsafe");
  await mkdir(target);
  if (sourceFolder) {
    await cp(join(physicalSource, "email.html"), join(target, "email.html"));
    await cp(join(physicalSource, "images"), join(target, "images"), { recursive: true });
  }
  return { folder, target };
}
