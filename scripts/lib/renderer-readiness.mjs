import {
  listComponentRecords,
  walkComponentElements,
  walkComponentFacts,
} from "./component-registry.mjs";

const GENERIC_FACT_ID = /^description-[0-9]+$/u;
const NON_VISIBLE_RENDER_MODES = new Set(["figma-source-only", "none"]);

function issue(code, path, componentId, viewport) {
  return {
    code,
    path,
    component_id: componentId,
    viewport,
  };
}

function sortIssues(issues) {
  return issues.sort(
    (left, right) =>
      left.component_id.localeCompare(right.component_id) ||
      left.viewport.localeCompare(right.viewport) ||
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code),
  );
}

function requiredContentSlots(element) {
  if (element.render_mode === "html-text") {
    return ["text"];
  }
  if (element.render_mode === "html-link") {
    const hasVisibleChildren = (element.children ?? []).some(
      (child) => !NON_VISIBLE_RENDER_MODES.has(child.render_mode),
    );
    return hasVisibleChildren ? ["href"] : ["href", "text"];
  }
  if (element.render_mode === "direct-image") {
    return ["alt"];
  }
  return [];
}

function coverageIds(rendererRegistry) {
  return new Set(
    (rendererRegistry?.coverage ?? [])
      .map((entry) => entry?.component_id)
      .filter((id) => typeof id === "string"),
  );
}

function auditComponent(record, library, coveredIds) {
  const issues = [];
  let facts = 0;
  let genericFacts = 0;

  if (record.status === "active" && !coveredIds.has(record.id)) {
    issues.push(
      issue("RENDER_COVERAGE_MISSING", "/coverage", record.id, "all"),
    );
  }

  walkComponentElements(record, ({ viewport, element, path }) => {
    const declaredSlots = new Set(
      (element.content_slots ?? [])
        .map((slot) => slot?.id)
        .filter((id) => typeof id === "string"),
    );
    for (const slotId of requiredContentSlots(element)) {
      if (!declaredSlots.has(slotId)) {
        issues.push(
          issue(
            "RENDER_CONTENT_SLOT_MISSING",
            `${path}/content_slots/${slotId}`,
            record.id,
            viewport,
          ),
        );
      }
    }
  });

  walkComponentFacts(record, ({ viewport, fact, path }) => {
    facts += 1;
    if (!GENERIC_FACT_ID.test(fact?.id ?? "")) {
      return;
    }

    genericFacts += 1;
    issues.push(
      issue("RENDER_FACT_ID_GENERIC", `${path}/id`, record.id, viewport),
    );
    if (path.startsWith(`/contracts/${viewport}/root/facts/`)) {
      issues.push(
        issue("RENDER_FACT_OWNER_ROOT", path, record.id, viewport),
      );
    }
  });

  sortIssues(issues);
  return {
    component: {
      id: record.id,
      library,
      status: record.status,
      ready: record.status === "active" && issues.length === 0,
      issues,
    },
    facts,
    genericFacts,
  };
}

export function auditRendererReadiness(registries, rendererRegistry = null) {
  const coveredIds = coverageIds(rendererRegistry);
  const audited = listComponentRecords(registries)
    .map(({ library, record }) => auditComponent(record, library, coveredIds))
    .sort((left, right) =>
      left.component.id.localeCompare(right.component.id),
    );
  const components = audited.map(({ component }) => component);

  return {
    summary: {
      components: components.length,
      active_components: components.filter(({ status }) => status === "active")
        .length,
      facts: audited.reduce((total, item) => total + item.facts, 0),
      generic_description_facts: audited.reduce(
        (total, item) => total + item.genericFacts,
        0,
      ),
      components_with_generic_facts: audited.filter(
        ({ genericFacts }) => genericFacts > 0,
      ).length,
      components_with_properties: listComponentRecords(registries).filter(
        ({ record }) => (record.properties ?? []).length > 0,
      ).length,
      components_with_assets: listComponentRecords(registries).filter(
        ({ record }) => (record.asset_contracts ?? []).length > 0,
      ).length,
      ready_components: components.filter(({ ready }) => ready).length,
      covered_active_components: components.filter(
        ({ status, id }) => status === "active" && coveredIds.has(id),
      ).length,
      missing_coverage: components.filter(
        ({ status, issues }) =>
          status === "active" &&
          issues.some(({ code }) => code === "RENDER_COVERAGE_MISSING"),
      ).length,
    },
    components,
  };
}
