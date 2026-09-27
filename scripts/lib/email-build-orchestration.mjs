import { cp, mkdir, readdir, writeFile, realpath, readFile, rm } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { isAbsolute, join, relative, resolve } from "node:path";

import {
  indexComponentRegistries,
  loadComponentRegistries,
  resolveComponentContracts,
} from "./component-registry.mjs";
import { loadAssetsFoundation, resolveAssetContract } from "./assets-foundation.mjs";
import { loadRendererRegistry } from "./renderer-registry.mjs";
import { validateEmailModelSemantics } from "./email-model.mjs";
import { selectVariantRoot } from "./email-interpreter.mjs";

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
  for (const record of index.bySystemId.values()) {
    for (const viewport of VIEWPORTS) {
      const visit = (element) => {
        if (!element) return;
        if (element.render_mode === "nested-component") result.add(element.component_id);
        for (const child of element.children ?? []) visit(child);
      };
      visit(record.contracts?.[viewport]?.root);
    }
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

async function validateAssetEvidence({ assetRoot, instance, component, contract, asset, item, resolved }) {
  const extension = resolved.export_profile.contract.extension;
  const allowedPaths = new Set([
    `images/${contract.id}${extension}`,
    `images/${contract.id}-${instance.instance_id}${extension}`,
  ]);
  if (
    !allowedPaths.has(asset.path) ||
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
    const digest = createHash("sha256").update(await readFile(physical)).digest("hex");
    return item.sha256 === digest;
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
  for (const instance of instances(model.root)) {
    const component = componentIndex.bySystemId.get(instance.component_id);
    for (const asset of instance.asset_files ?? []) {
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

async function defaultRendererRunner({ repoRoot, modelPath, outputDir }) {
  await execFileAsync(
    process.execPath,
    [join(repoRoot, "scripts", "render-email.mjs"), "--model", modelPath, "--output", outputDir],
    { cwd: repoRoot },
  );
}

function continueFixEvidenceBlockers(resolution, evidence) {
  if (resolution?.mode !== "continue-fix-design") return [];
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

export async function executeEmailBuildHandoff({
  outputDir,
  rendererRunner = defaultRendererRunner,
  resolution,
  continueFixEvidence,
  ...input
}) {
  const handoff = await prepareEmailBuildHandoff(input);
  const blockers = [...new Set([
    ...handoff.blockers,
    ...continueFixEvidenceBlockers(resolution, continueFixEvidence),
  ])].sort();
  if (blockers.length) return { ...handoff, blockers, executed: false };
  const modelPath = join(input.assetRoot, `.temporary-email-model-${randomUUID()}.json`);
  try {
    await writeFile(modelPath, JSON.stringify(handoff.model), "utf8");
    await rendererRunner({ repoRoot: input.repoRoot, modelPath, outputDir });
    return { ...handoff, executed: true };
  } finally {
    await rm(modelPath, { force: true });
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
  return typeof folder === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*_[0-9]+\.[0-9]+$/u.test(folder);
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
  const base = sourceFolder ? sourceFolder.replace(/_[0-9]+\.[0-9]+$/u, "") : semanticSlug(purpose);
  const entries = new Set(await readdir(outputParent));
  let minor = 0;
  let folder = `${base}_1.${minor}`;
  while (entries.has(folder)) folder = `${base}_1.${++minor}`;
  const target = join(outputParent, folder);
  if (!inside(workspaceRoot, target)) throw failure("version-path-unsafe");
  await mkdir(target);
  if (sourceFolder) {
    const source = join(outputParent, sourceFolder);
    if (!inside(workspaceRoot, source)) throw failure("version-path-unsafe");
    await cp(join(source, "email.html"), join(target, "email.html"));
    await cp(join(source, "images"), join(target, "images"), { recursive: true });
  } else {
    await writeFile(join(target, "email.html"), "");
    await mkdir(join(target, "images"));
  }
  return { folder, target };
}
