import { buildContextBundle } from "./context-bundle.mjs";
import { SystemValidationError } from "./diagnostics.mjs";
import { loadSystemManifest } from "./system-manifest.mjs";
import {
  loadWorkflowRegistry,
  resolveWorkflowSteps,
} from "./workflow-registry.mjs";

function diagnostic(code, path, message) {
  return { code, path, message };
}

function compareDiagnostics(left, right) {
  return (
    left.path.localeCompare(right.path) ||
    left.code.localeCompare(right.code) ||
    left.message.localeCompare(right.message)
  );
}

function blocked(blockers) {
  return {
    status: "blocked",
    blockers: [...blockers].sort(compareDiagnostics),
  };
}

function blockersFrom(error) {
  if (error instanceof AggregateError) {
    return error.errors.flatMap(blockersFrom);
  }
  if (error instanceof SystemValidationError) {
    return [diagnostic(error.code, error.path, error.message)];
  }
  return [
    diagnostic(
      "SKILL_CONTEXT_FAILED",
      "/",
      "The skill context could not be resolved.",
    ),
  ];
}

export async function resolveSkillContext({
  repoRoot,
  routeId,
  workflowMode = null,
  candidates = [],
  viewports = [],
  foundationIds = [],
}) {
  const bundleResult = await buildContextBundle({
    repoRoot,
    routeId,
    candidates,
    viewports,
    foundationIds,
  });
  if (bundleResult.status === "blocked") return bundleResult;

  const { bundle } = bundleResult;
  const route = structuredClone(bundle.route);
  if (route.workflow_source_id === "workflow-paused") {
    return {
      status: "paused",
      route,
      bundle,
      blockers: [
        diagnostic(
          "SKILL_ROUTE_PAUSED",
          "/route/workflow_source_id",
          `Route ${route.id} is paused and has no active structured workflow.`,
        ),
      ],
    };
  }

  let manifest;
  try {
    manifest = await loadSystemManifest({ repoRoot });
  } catch (error) {
    return blocked(blockersFrom(error));
  }
  const entry = manifest.structured_workflows.entries.find(
    ({ source_id: sourceId }) => sourceId === route.workflow_source_id,
  );
  if (!entry) {
    return blocked([
      diagnostic(
        "SKILL_WORKFLOW_UNSTRUCTURED",
        "/route/workflow_source_id",
        `Route workflow is not declared by structured_workflows: ${route.workflow_source_id}.`,
      ),
    ]);
  }
  if (workflowMode === null) {
    return blocked([
      diagnostic(
        "SKILL_WORKFLOW_MODE_REQUIRED",
        "/workflow_mode",
        `Route ${route.id} requires an exact structured workflow mode.`,
      ),
    ]);
  }

  try {
    const registry = await loadWorkflowRegistry({
      repoRoot,
      workflowId: entry.id,
      manifest,
    });
    const steps = resolveWorkflowSteps(registry, workflowMode);
    return {
      status: "resolved",
      route,
      bundle,
      workflow: {
        id: entry.id,
        mode: workflowMode,
        steps,
      },
    };
  } catch (error) {
    return blocked(blockersFrom(error));
  }
}
