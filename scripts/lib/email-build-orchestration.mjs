import { access, cp, mkdir, readdir, writeFile, realpath, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
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

function assetKey(componentId, assetContractId, path) {
  return `${componentId}\0${assetContractId}\0${path}`;
}
const execFileAsync = promisify(execFile);
function contractElement(record, viewport, id) { const walk = (n) => !n ? null : n.id === id ? n : (n.children ?? []).map(walk).find(Boolean); return walk(record.contracts?.[viewport]?.root); }
function placement(model, index, resolved) {
  const blockers = new Set(); const ids = new Set(resolved.map(({ id }) => id));
  const visit = (instance, parent = null, placementId = null, top = false) => {
    const record = index.bySystemId.get(instance.component_id);
    if (!ids.has(instance.component_id)) blockers.add("contract-ambiguous");
    if (!record) return;
    if (top && !["email", "block", "banner", "nps"].includes(record.identity.semantic_role)) blockers.add("contract-ambiguous");
    if (parent && placementId) for (const viewport of ["mobile", "desktop"]) { const element = contractElement(parent, viewport, placementId); if (!element || (element.render_mode === "nested-component" && element.component_id !== instance.component_id)) blockers.add("contract-ambiguous"); }
    for (const slot of instance.slots ?? []) { for (const viewport of ["mobile", "desktop"]) { const el = contractElement(record, viewport, slot.element_id); if (!el || el.render_mode !== "slot") blockers.add("contract-ambiguous"); } for (const child of slot.instances ?? []) visit(child, record, slot.element_id, record.id === "email-template"); }
    for (const nested of instance.nested_components ?? []) visit(nested.instance, record, nested.element_id, false);
  }; visit(model.root); return blockers;
}

async function exists(path) {
  try {
    await access(path);
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

  for (const viewport of ["mobile", "desktop"]) {
    const resolved = resolveComponentContracts({ index: componentIndex, candidates, viewport });
    if (resolved.status === "blocked") {
      resolved.blockers.forEach((item) => blockers.add(handoffBlocker(item.code)));
    } else {
      resolvedContracts.push(...resolved.components.map((component) => ({ viewport, ...component })));
    }
  }
  if (blockers.size > 0) return { blockers: [...blockers].sort(), model, resolvedContracts, assetContracts: [] };

  if (model?.root?.component_id !== "email-template") blockers.add("renderer-diagnostic");
  for (const value of placement(model, componentIndex, resolvedContracts)) blockers.add(value);
  const semantics = validateEmailModelSemantics(model, {
    componentIndex,
    rendererRegistry,
  });
  if (semantics.length > 0) blockers.add("renderer-diagnostic");
  if (blockers.size > 0) return { blockers: [...blockers].sort(), model, resolvedContracts, assetContracts: [] };

  const evidence = new Map((assetEvidence ?? []).map((item) => [
    assetKey(item.component_id, item.asset_contract_id, item.path), item,
  ]));
  const assetContracts = [];
  for (const instance of instances(model.root)) {
    const component = componentIndex.bySystemId.get(instance.component_id);
    for (const asset of instance.asset_files ?? []) {
      const item = evidence.get(assetKey(instance.component_id, asset.asset_contract_id, asset.path));
      const contract = component?.asset_contracts?.find(({ id }) => id === asset.asset_contract_id);
      if (!item?.mcp_export?.evidence_id || item.mcp_export.source !== "figma-mcp" || !contract) {
        blockers.add("asset-contract-missing");
        continue;
      }
      const sourcePath = join(assetRoot, ...asset.path.split("/"));
      if (!(await exists(sourcePath))) {
        blockers.add("asset-contract-missing");
        continue;
      }
      const physical = await realpath(sourcePath); const physicalRoot = await realpath(assetRoot);
      const digest = createHash("sha256").update(await readFile(physical)).digest("hex");
      if (!inside(physicalRoot, physical) || (item.sha256 && item.sha256 !== digest) || (item.mcp_export.owner_layer_name && item.mcp_export.owner_layer_name !== contract.owner_layer_name) || (item.mcp_export.file_key && item.mcp_export.file_key !== component.figma.file_key) || (item.mcp_export.source_node_id !== undefined && typeof item.mcp_export.source_node_id !== "string")) { blockers.add("asset-contract-missing"); continue; }
      try {
        assetContracts.push({
          component_id: instance.component_id,
          asset_contract_id: asset.asset_contract_id,
          path: asset.path,
          resolved: resolveAssetContract(assets, {
            sourceModeId: contract.source_mode_id,
            displayModeId: contract.display_mode_id,
            exportProfileId: contract.export_profile_id,
            expectedAlphaId: contract.alpha_mode_id,
            clippingPolicyId: contract.clipping_policy_id,
          }),
        });
      } catch {
        blockers.add("asset-contract-missing");
      }
    }
  }
  return {
    blockers: [...blockers].sort(),
    model: structuredClone(model),
    resolvedContracts,
    assetContracts,
  };
}

export async function executeEmailBuildHandoff({ outputDir, ...input }) {
  const handoff = await prepareEmailBuildHandoff(input);
  if (handoff.blockers.length) return { ...handoff, executed: false };
  const modelPath = join(input.assetRoot, "temporary-email-model.json");
  await writeFile(modelPath, JSON.stringify(handoff.model), "utf8");
  await execFileAsync(process.execPath, [join(input.repoRoot, "scripts", "render-email.mjs"), "--model", modelPath, "--output", outputDir], { cwd: input.repoRoot });
  return { ...handoff, executed: true };
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
