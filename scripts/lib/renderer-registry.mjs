import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";
import {
  walkComponentElements,
  walkComponentFacts,
} from "./component-registry.mjs";

const SUPPORTED_RENDERER_REGISTRY_VERSION = "1.0.0";
const GENERIC_FACT_ID = /^description-[0-9]+$/u;
const NON_VISIBLE_RENDER_MODES = new Set(["figma-source-only", "none"]);

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

export function validateRendererRegistryShape(document, schema) {
  const errors = validateDocumentShape({
    document,
    schema,
    supportedVersion: SUPPORTED_RENDERER_REGISTRY_VERSION,
    versionCode: "renderer-registry-version-unsupported",
    schemaCode: "renderer-registry-schema",
  });
  const byOwnedRecord = new Map();
  for (const error of errors) {
    const match = error.path.match(/^\/coverage\/\d+/u);
    const path = match?.[0] ?? error.path;
    if (!byOwnedRecord.has(path)) {
      error.path = path;
      byOwnedRecord.set(path, error);
    }
  }
  return sortDiagnostics([...byOwnedRecord.values()]);
}

export function validateRendererRegistrySemantics(registry) {
  const errors = [];
  const firstIndexByComponentId = new Map();

  (registry?.coverage ?? []).forEach((entry, index) => {
    const componentId = entry?.component_id;
    if (firstIndexByComponentId.has(componentId)) {
      errors.push(
        diagnostic(
          "RENDERER_COVERAGE_DUPLICATE",
          `/coverage/${index}/component_id`,
          `Duplicate renderer coverage for component ${String(componentId)}; first declared at /coverage/${firstIndexByComponentId.get(componentId)}/component_id.`,
        ),
      );
      return;
    }
    firstIndexByComponentId.set(componentId, index);
  });

  return sortDiagnostics(errors);
}

export function validateRendererCoverageReferences(registry, componentIds) {
  const knownIds = new Set(componentIds);
  const errors = [];
  (registry?.coverage ?? []).forEach((entry, index) => {
    if (!knownIds.has(entry.component_id)) {
      errors.push(
        diagnostic(
          "RENDERER_COVERAGE_COMPONENT_UNKNOWN",
          `/coverage/${index}/component_id`,
          `Renderer coverage references unknown component ${entry.component_id}.`,
        ),
      );
    }
  });
  return sortDiagnostics(errors);
}

export async function loadRendererRegistry({
  repoRoot,
  dataPath = "data/renderers/registry.yaml",
  schemaPath = "schemas/renderer-registry.schema.json",
}) {
  const [registry, schemaText] = await Promise.all([
    readStrictYaml(join(repoRoot, dataPath)),
    readFile(join(repoRoot, schemaPath), "utf8"),
  ]);
  const errors = [
    ...validateRendererRegistryShape(registry, JSON.parse(schemaText)),
    ...validateRendererRegistrySemantics(registry),
  ];
  if (errors.length > 0) {
    throw new AggregateError(
      sortDiagnostics(errors),
      `Renderer registry validation failed: ${dataPath}.`,
    );
  }
  return registry;
}

export function resolveRendererCoverage(registry, componentId) {
  const semanticErrors = validateRendererRegistrySemantics(registry);
  if (semanticErrors.length > 0) {
    throw new AggregateError(
      semanticErrors,
      "Renderer registry semantic validation failed.",
    );
  }

  const coverage = (registry?.coverage ?? []).find(
    (entry) => entry.component_id === componentId,
  );
  if (!coverage) {
    throw diagnostic(
      "RENDERER_COVERAGE_UNKNOWN",
      "/coverage",
      `Renderer coverage is not declared for component ${componentId}.`,
    );
  }
  return structuredClone(coverage);
}

function readinessIssue(code, path, componentId, viewport) {
  return {
    code,
    path,
    component_id: componentId,
    viewport,
  };
}

function sortReadinessIssues(issues) {
  return issues.sort(
    (left, right) =>
      left.component_id.localeCompare(right.component_id) ||
      left.viewport.localeCompare(right.viewport) ||
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code),
  );
}

function visibleChildren(element) {
  return (element.children ?? []).filter(
    (child) => !NON_VISIBLE_RENDER_MODES.has(child.render_mode),
  );
}

function requiredSlots(element) {
  if (element.render_mode === "html-text") {
    return [{ id: "text", types: new Set(["plain-text", "rich-text"]) }];
  }
  if (element.render_mode === "html-link") {
    const slots = [{ id: "href", types: new Set(["url"]) }];
    if (visibleChildren(element).length === 0) {
      slots.push({ id: "text", types: new Set(["plain-text", "rich-text"]) });
    }
    return slots;
  }
  if (element.render_mode === "slot") {
    return [{ id: "content", types: new Set(["placeholder"]) }];
  }
  return [];
}

export function validateRendererReadyComponent(record, coverage) {
  const componentId = record?.id ?? "<unknown-component>";
  const issues = [];

  if (coverage?.component_id !== componentId || coverage?.mode !== "interpreter") {
    return [
      readinessIssue(
        "RENDER_INTERPRETER_COVERAGE_REQUIRED",
        "/coverage",
        componentId,
        "all",
      ),
    ];
  }

  const liveTextByViewport = new Map([
    ["mobile", false],
    ["desktop", false],
  ]);
  walkComponentElements(record, ({ viewport, element, path }) => {
    if (element.render_mode === "html-text") {
      liveTextByViewport.set(viewport, true);
    }

    const slots = element.content_slots ?? [];
    const slotIndices = new Map();
    slots.forEach((slot, index) => {
      const previous = slotIndices.get(slot.id);
      if (previous !== undefined) {
        issues.push(
          readinessIssue(
            "RENDER_CONTENT_SLOT_DUPLICATE",
            `${path}/content_slots/${index}/id`,
            componentId,
            viewport,
          ),
        );
      } else {
        slotIndices.set(slot.id, index);
      }
    });

    for (const required of requiredSlots(element)) {
      const slotIndex = slotIndices.get(required.id);
      if (slotIndex === undefined) {
        issues.push(
          readinessIssue(
            "RENDER_CONTENT_SLOT_MISSING",
            `${path}/content_slots/${required.id}`,
            componentId,
            viewport,
          ),
        );
        continue;
      }
      if (!required.types.has(slots[slotIndex].type)) {
        issues.push(
          readinessIssue(
            "RENDER_CONTENT_SLOT_TYPE_INVALID",
            `${path}/content_slots/${slotIndex}/type`,
            componentId,
            viewport,
          ),
        );
      }
    }

    if (element.render_mode === "direct-image") {
      const alt = slots.find((slot) => slot.id === "alt");
      if (!alt || alt.type !== "alt-text") {
        issues.push(
          readinessIssue(
            "RENDER_IMAGE_ALT_MISSING",
            `${path}/content_slots/alt`,
            componentId,
            viewport,
          ),
        );
      }
    }

    if (
      element.render_mode === "background-image" &&
      slots.some((slot) => slot.id === "alt")
    ) {
      issues.push(
        readinessIssue(
          "RENDER_BACKGROUND_ALT_FORBIDDEN",
          `${path}/content_slots/alt`,
          componentId,
          viewport,
        ),
      );
    }
  });

  walkComponentElements(record, ({ viewport, element, path }) => {
    if (
      element.render_mode === "background-image" &&
      !liveTextByViewport.get(viewport)
    ) {
      issues.push(
        readinessIssue(
          "RENDER_BACKGROUND_TEXT_EQUIVALENT_MISSING",
          path,
          componentId,
          viewport,
        ),
      );
    }
  });

  walkComponentFacts(record, ({ viewport, fact, path }) => {
    if (GENERIC_FACT_ID.test(fact?.id ?? "")) {
      issues.push(
        readinessIssue(
          "RENDER_FACT_ID_GENERIC",
          `${path}/id`,
          componentId,
          viewport,
        ),
      );
    }
  });

  return sortReadinessIssues(issues);
}
