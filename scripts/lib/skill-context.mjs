import { buildContextBundle } from "./context-bundle.mjs";
import { join } from "node:path";
import { SystemValidationError } from "./diagnostics.mjs";
import { loadSystemManifest, validateManifestSemantics } from "./system-manifest.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";
import {
  loadWorkflowRegistry,
  resolveWorkflowSteps,
} from "./workflow-registry.mjs";

function diagnostic(code, path, message) {
  return { code, path, message };
}

const EMAIL_ROUTE_IDS = new Set(["email-new-build", "email-continue-fix"]);

async function activeEmailRouteStatusBlocker({ repoRoot, manifest, route, profile }) {
  if (!EMAIL_ROUTE_IDS.has(route.id) || route.workflow_source_id === "workflow-paused") return null;
  const sources = new Map(manifest.sources.map((source) => [source.id, source]));
  const sourcePath = (id) => sources.get(id)?.path;
  const dependencies = [
    ["workflow", "workflow-email-build", (document) => document.workflow?.status],
    ["components-shared", "components-shared", (document) => document.registry?.status],
    ["components-marketing", "components-marketing", (document) => document.registry?.status],
    ["components-service", "components-service", (document) => document.registry?.status],
    ["typography", "typography-foundation", (document) => document.foundation?.status],
    ["spacing", "spacing-foundation", (document) => document.foundation?.status],
    ["assets", "assets-foundation", (document) => document.foundation?.status],
    ["rendering", "rendering-foundation", (document) => document.foundation?.status],
    ["renderer-registry", "renderer-registry", (document) => document.registry?.status],
  ];
  const activeRouteCount = manifest.routes.filter(
    ({ workflow_source_id }) => workflow_source_id !== "workflow-paused",
  ).length;
  const pausedRouteCount = manifest.routes.length - activeRouteCount;
  const aggregateActive =
    (manifest.structured_workflows.status === "partial" && activeRouteCount > 0 && pausedRouteCount > 0) ||
    (manifest.structured_workflows.status === "active" && activeRouteCount === manifest.routes.length);
  const profileActive = profile.generated_bundle.status === "structured-active";
  if (!aggregateActive || !profileActive) {
    return diagnostic(
      "SKILL_ROUTE_STATUS_INACTIVE",
      !aggregateActive ? "/structured_workflows/status" : "/generated_bundle/status",
      `Email route ${route.id} requires explicit partial-or-active aggregate and structured-active profile status.`,
    );
  }
  for (const [name, sourceId, selectStatus] of dependencies) {
    const path = sourcePath(sourceId);
    const document = path ? await readStrictYaml(join(repoRoot, path)) : null;
    if (selectStatus(document) !== "active") {
      return diagnostic(
        "SKILL_ROUTE_STATUS_INACTIVE",
        `/sources/${sourceId}/status`,
        `Email route ${route.id} requires active ${name} status.`,
      );
    }
  }
  return null;
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
  let manifest;
  try {
    manifest = await loadSystemManifest({ repoRoot });
  } catch (error) {
    return blocked(blockersFrom(error));
  }
  const semanticErrors = await validateManifestSemantics(manifest, repoRoot);
  if (semanticErrors.length > 0) return blocked(semanticErrors);
  const manifestRoute = manifest.routes.find(({ id }) => id === routeId);
  const manifestProfile = manifest.bundle_profiles.find(
    ({ id }) => id === manifestRoute?.bundle_profile_id,
  );
  const statusBlocker = manifestRoute
    ? await activeEmailRouteStatusBlocker({
      repoRoot,
      manifest,
      route: manifestRoute,
      profile: manifestProfile,
    })
    : null;
  if (statusBlocker) return blocked([statusBlocker]);
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
    if (!EMAIL_ROUTE_IDS.has(route.id) && registry.workflow.id !== route.id) return blocked([diagnostic("SKILL_WORKFLOW_ROUTE_MISMATCH", "/workflow/id", "Maintenance workflow must match the declared task route.")]);
    if (!EMAIL_ROUTE_IDS.has(route.id) && (foundationIds.includes("figma-naming") || manifestProfile.generated_bundle.required_foundation_ids.includes("figma-naming"))) {
      const source = manifest.sources.find(({id}) => id === "figma-naming-foundation");
      const naming = await readStrictYaml(join(repoRoot,source.path));
      if (naming.foundation.status !== "active") return blocked([diagnostic("SKILL_ROUTE_STATUS_INACTIVE", "/sources/figma-naming-foundation/status", "An active maintenance naming task requires an active naming foundation.")]);
    }
    const steps = resolveWorkflowSteps(registry, workflowMode);
    const delivered = new Set(bundle.static_sources.filter(({content}) => typeof content === "string" && content.length > 0).map(({id}) => id));
    // Email catalog IDs refer to the typed selection capability, never raw registry prose.
    // Optional continue/fix discovery may have an empty selection; it is not a contract-free render permission.
    const selectedComponentInput = EMAIL_ROUTE_IDS.has(route.id) && (bundle.components.length > 0 || manifestProfile.generated_bundle.component_selection === "optional");
    const componentCatalogIds = new Set(["components-shared", "components-marketing", "components-service"]);
    const missing = [...new Set(steps.flatMap(({source_ids}) => source_ids))].filter(id => !delivered.has(id) && !(selectedComponentInput && componentCatalogIds.has(id)));
    if (missing.length) return blocked(missing.map(id => diagnostic("SKILL_WORKFLOW_SOURCE_MISSING", `/workflow/source_ids/${id}`, `Workflow steps require actual source content in this bundle: ${id}.`)));
    const selectedMode = registry.workflow.modes.find(({id}) => id === workflowMode);
    return {
      status: "resolved",
      route,
      bundle,
      workflow: {
        id: entry.id,
        mode: workflowMode,
        required_inputs: structuredClone(selectedMode.required_inputs),
        input_blockers: structuredClone(selectedMode.input_blockers ?? []),
        steps,
      },
    };
  } catch (error) {
    return blocked(blockersFrom(error));
  }
}
