import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";

const SUPPORTED_WORKFLOW_VERSION = "1.0.0";

function diagnostic(code, path, message) {
  return new SystemValidationError(code, path, message);
}

function sortDiagnostics(errors) {
  return errors.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );
}

function duplicates(items) {
  const seen = new Set();
  const result = new Set();
  for (const item of items) {
    if (seen.has(item)) result.add(item);
    seen.add(item);
  }
  return [...result].sort();
}

export function validateWorkflowRegistryShape(workflow, schema) {
  return validateDocumentShape({
    document: workflow,
    schema,
    supportedVersion: SUPPORTED_WORKFLOW_VERSION,
    versionCode: "workflow-registry-version-unsupported",
    schemaCode: "workflow-registry-schema",
  });
}

export function validateWorkflowRegistrySemantics(workflow, manifest) {
  const errors = [];
  const sourceIds = new Set(manifest?.sources?.map(({ id }) => id) ?? []);
  const declaredSources = new Set(workflow?.workflow?.source_ids ?? []);

  for (const id of duplicates(workflow?.workflow?.modes?.map(({ id }) => id) ?? [])) {
    errors.push(
      diagnostic(
        "WORKFLOW_MODE_DUPLICATE",
        "/workflow/modes",
        `Duplicate workflow mode: ${id}.`,
      ),
    );
  }

  (workflow?.workflow?.source_ids ?? []).forEach((sourceId, index) => {
    if (!sourceIds.has(sourceId)) {
      errors.push(
        diagnostic(
          "WORKFLOW_SOURCE_UNKNOWN",
          `/workflow/source_ids/${index}`,
          `Unknown manifest source: ${sourceId}.`,
        ),
      );
    }
  });

  (workflow?.workflow?.modes ?? []).forEach((mode, modeIndex) => {
    if (mode.input_blockers !== undefined || mode.input_relations !== undefined) {
    const requiredInputs = new Set(mode.required_inputs ?? []);
    const stepBlockers = new Set((mode.steps ?? []).flatMap((step) => step.blockers ?? []));
    const inputBlockers = new Map();
    (mode.input_blockers ?? []).forEach(({ input, blocker }, inputIndex) => {
      inputBlockers.set(input, blocker);
      if (!requiredInputs.has(input)) errors.push(diagnostic("WORKFLOW_INPUT_BLOCKER_INPUT_UNREQUIRED", `/workflow/modes/${modeIndex}/input_blockers/${inputIndex}/input`, `Input blocker must reference a mode required input: ${input}.`));
      if (!stepBlockers.has(blocker)) errors.push(diagnostic("WORKFLOW_INPUT_BLOCKER_UNDECLARED", `/workflow/modes/${modeIndex}/input_blockers/${inputIndex}/blocker`, `Input blocker must be declared by a mode step: ${blocker}.`));
    });
    for (const input of requiredInputs) {
      if (!inputBlockers.has(input)) errors.push(diagnostic("WORKFLOW_INPUT_BLOCKER_MISSING", `/workflow/modes/${modeIndex}/required_inputs`, `Required input has no typed blocker mapping: ${input}.`));
    }
    (mode.input_relations ?? []).forEach((relation, relationIndex) => {
      relation.inputs.forEach((input, inputIndex) => {
        if (!requiredInputs.has(input)) errors.push(diagnostic("WORKFLOW_INPUT_RELATION_INPUT_UNREQUIRED", `/workflow/modes/${modeIndex}/input_relations/${relationIndex}/inputs/${inputIndex}`, `Input relation must reference a mode required input: ${input}.`));
      });
      if (relation.kind === "ordered-field-values" && relation.values.length !== relation.inputs.length) errors.push(diagnostic("WORKFLOW_INPUT_RELATION_VALUES_LENGTH", `/workflow/modes/${modeIndex}/input_relations/${relationIndex}/values`, "Ordered input relation values must match the input count."));
      if (!stepBlockers.has(relation.blocker)) errors.push(diagnostic("WORKFLOW_INPUT_RELATION_BLOCKER_UNDECLARED", `/workflow/modes/${modeIndex}/input_relations/${relationIndex}/blocker`, `Input relation blocker must be declared by a mode step: ${relation.blocker}.`));
    });    }
    for (const id of duplicates(mode.steps.map(({ id }) => id))) {
      errors.push(
        diagnostic(
          "WORKFLOW_STEP_DUPLICATE",
          `/workflow/modes/${modeIndex}/steps`,
          `Duplicate workflow step: ${id}.`,
        ),
      );
    }
    mode.steps.forEach((step, stepIndex) => {
      const expectedOrder = stepIndex + 1;
      if (step.order !== expectedOrder) {
        errors.push(
          diagnostic(
            "WORKFLOW_STEP_ORDER_INVALID",
            `/workflow/modes/${modeIndex}/steps/${stepIndex}/order`,
            `Step order must be ${expectedOrder}; received ${String(step.order)}.`,
          ),
        );
      }
      step.source_ids.forEach((sourceId, sourceIndex) => {
        if (!declaredSources.has(sourceId)) {
          errors.push(
            diagnostic(
              "WORKFLOW_STEP_SOURCE_UNDECLARED",
              `/workflow/modes/${modeIndex}/steps/${stepIndex}/source_ids/${sourceIndex}`,
              `Step source is outside workflow.source_ids: ${sourceId}.`,
            ),
          );
        }
      });
      const expectedSuccess =
        stepIndex === mode.steps.length - 1 ? "complete" : "next";
      if (step.handoff.on_success !== expectedSuccess) {
        errors.push(
          diagnostic(
            "WORKFLOW_STEP_HANDOFF_INVALID",
            `/workflow/modes/${modeIndex}/steps/${stepIndex}/handoff/on_success`,
            `Step success handoff must be ${expectedSuccess}.`,
          ),
        );
      }
    });
  });

  return sortDiagnostics(errors);
}

function workflowEntry(manifest, workflowId) {
  return manifest?.structured_workflows?.entries?.find(
    ({ id }) => id === workflowId,
  );
}

export async function loadWorkflowRegistry({
  repoRoot,
  workflowId,
  manifest: suppliedManifest,
}) {
  const manifest =
    suppliedManifest ??
    (await (await import("./system-manifest.mjs")).loadSystemManifest({
      repoRoot,
    }));
  const entry = workflowEntry(manifest, workflowId);
  if (!entry) {
    throw diagnostic(
      "WORKFLOW_UNKNOWN",
      "/workflow_id",
      `Unknown structured workflow: ${String(workflowId)}.`,
    );
  }
  const source = manifest.sources.find(({ id }) => id === entry.source_id);
  const schemaSource = manifest.sources.find(
    ({ id }) => id === manifest.structured_workflows.schema_source_id,
  );
  if (!source || !schemaSource) {
    throw diagnostic(
      "WORKFLOW_SOURCE_UNKNOWN",
      "/structured_workflows",
      `Structured workflow sources are unresolved for ${workflowId}.`,
    );
  }
  const [workflow, schemaText] = await Promise.all([
    readStrictYaml(join(repoRoot, source.path)),
    readFile(join(repoRoot, schemaSource.path), "utf8"),
  ]);
  const errors = [
    ...validateWorkflowRegistryShape(workflow, JSON.parse(schemaText)),
    ...validateWorkflowRegistrySemantics(workflow, manifest),
  ];
  if (workflow?.workflow?.id !== workflowId) {
    errors.push(
      diagnostic(
        "WORKFLOW_ID_MISMATCH",
        "/workflow/id",
        `Expected workflow id ${workflowId}; received ${String(workflow?.workflow?.id)}.`,
      ),
    );
  }
  if (errors.length > 0) {
    throw new AggregateError(
      sortDiagnostics(errors),
      `Structured workflow validation failed: ${workflowId}.`,
    );
  }
  return workflow;
}

export function resolveWorkflowSteps(workflow, modeId) {
  const mode = workflow?.workflow?.modes?.find(({ id }) => id === modeId);
  if (!mode) {
    throw diagnostic(
      "WORKFLOW_MODE_UNKNOWN",
      "/mode",
      `Unknown workflow mode: ${String(modeId)}.`,
    );
  }
  return Object.freeze(
    mode.steps.map((step) => Object.freeze(structuredClone(step))),
  );
}

export async function validateStructuredWorkflows({ repoRoot, manifest }) {
  const errors = [];
  for (const entry of manifest.structured_workflows.entries) {
    try {
      await loadWorkflowRegistry({ repoRoot, workflowId: entry.id, manifest });
    } catch (error) {
      if (error instanceof AggregateError) errors.push(...error.errors);
      else if (error instanceof SystemValidationError) errors.push(error);
      else {
        errors.push(
          diagnostic(
            "WORKFLOW_READ_FAILED",
            `/structured_workflows/${entry.id}`,
            `Structured workflow could not be read: ${entry.id}.`,
          ),
        );
      }
    }
  }
  return sortDiagnostics(errors);
}
