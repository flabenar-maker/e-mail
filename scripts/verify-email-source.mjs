#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { indexComponentRegistries, loadComponentRegistries } from "./lib/component-registry.mjs";
import { verifyEmailModelSource } from "./lib/email-source-fidelity.mjs";

function hasAdditionalVariantAxes(instance) {
  if (!instance) return false;
  if (["mobile", "desktop"].some((viewport) =>
    Object.keys(instance.variant_axes?.[viewport] ?? {}).length > 0)) return true;
  return (instance.slots ?? []).some((slot) =>
    (slot.instances ?? []).some(hasAdditionalVariantAxes)) ||
    (instance.nested_components ?? []).some(({ instance: child }) => hasAdditionalVariantAxes(child));
}

function hasAssetFiles(instance) {
  if ((instance?.asset_files ?? []).length > 0) return true;
  return (instance?.slots ?? []).some((slot) => (slot.instances ?? []).some(hasAssetFiles)) ||
    (instance?.nested_components ?? []).some(({ instance: child }) => hasAssetFiles(child));
}

const path = process.argv[2];
const selectedTest = process.argv[3] === "--selected-test";
if (!path || process.argv.length > 4 || (process.argv.length === 4 && !selectedTest)) {
  process.stderr.write("Usage: node scripts/verify-email-source.mjs <source-evidence.json> [--selected-test]\n");
  process.exitCode = 2;
} else {
  try {
    const input = JSON.parse(await readFile(path, "utf8"));
    const hasInlineRuns = input.readings?.fields?.some(({ inline_runs }) => inline_runs?.length);
    const resolvedContracts = hasInlineRuns || hasAdditionalVariantAxes(input.model?.root) || hasAssetFiles(input.model?.root)
      ? indexComponentRegistries(await loadComponentRegistries({ repoRoot: fileURLToPath(new URL("../", import.meta.url)) })).bySystemId
      : new Map();
    const diagnostics = verifyEmailModelSource({ ...input, resolvedContracts }).map(({ code, path: fieldPath, message }) =>
      ({ code, path: fieldPath, message }));
    if (!selectedTest) {
      for (const viewport of ["mobile", "desktop"]) {
        const selection = input.readings?.selection?.[viewport];
        if (selection?.scope !== "full-email") {
          diagnostics.push({ code: "EMAIL_SOURCE_SCOPE_INCOMPLETE", path: `/readings/selection/${viewport}/scope`,
            message: `Production verification requires the complete ${viewport} email, not a selected subtree.` });
        }
        const modelCount = (input.model?.root?.slots ?? [])
          .filter(({ element_id }) => element_id === "content")
          .reduce((count, slot) => count + (slot.instances?.length ?? 0), 0);
        if (!Number.isInteger(selection?.expected_top_level_count) || selection.expected_top_level_count < 0 ||
            selection.expected_top_level_count !== modelCount) {
          diagnostics.push({ code: "EMAIL_SOURCE_SCOPE_INCOMPLETE", path: `/readings/selection/${viewport}/expected_top_level_count`,
            message: `The ${viewport} Figma Content slot child count must match the model root content count (${modelCount}).` });
        }
      }
      for (const [index, item] of (input.authorizedInputs ?? []).entries()) {
        if (!["user", "policy-derived"].includes(item.origin)) {
          diagnostics.push({ code: "EMAIL_SOURCE_INPUT_UNAUTHORIZED", path: `/authorizedInputs/${index}/origin`,
            message: `Production source verification cannot accept ${item.origin ?? "missing"} input provenance.` });
        }
      }
      for (const [index, item] of (input.correspondence?.fields ?? []).entries()) {
        if (!["figma", "user", "policy-derived"].includes(item.origin)) {
          diagnostics.push({ code: "EMAIL_SOURCE_INPUT_UNAUTHORIZED", path: `/correspondence/fields/${index}/origin`,
            message: `Production source verification cannot accept ${item.origin ?? "missing"} field provenance.` });
        }
      }
    }
    process.stdout.write(`${JSON.stringify({ status: diagnostics.length ? "failed" : "passed", scope: selectedTest ? "selected-test" : "full-email", diagnostics }, null, 2)}\n`);
    if (diagnostics.length) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`Source evidence could not be read: ${error.message}\n`);
    process.exitCode = 2;
  }
}


