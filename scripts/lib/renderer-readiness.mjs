import {
  listComponentRecords,
  walkComponentElements,
  walkComponentFacts,
} from "./component-registry.mjs";
import { validateRendererReadyComponent } from "./renderer-registry.mjs";

const GENERIC_FACT_ID = /^description-[0-9]+$/u;

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

function auditComponent(record, library, coverageById) {
  const issues = [];
  let facts = 0;
  let genericFacts = 0;

  const coverage = coverageById.get(record.id);
  if (record.status === "active" && !coverage) {
    issues.push(
      issue("RENDER_COVERAGE_MISSING", "/coverage", record.id, "all"),
    );
  } else if (record.status === "active") {
    issues.push(...validateRendererReadyComponent(record, coverage));
  }

  walkComponentFacts(record, ({ fact }) => {
    facts += 1;
    if (GENERIC_FACT_ID.test(fact?.id ?? "")) genericFacts += 1;
  });

  sortIssues(issues);
  return {
    component: {
      id: record.id,
      library,
      status: record.status,
      ready: record.status === "active" && Boolean(coverage) && issues.length === 0,
      issues,
    },
    facts,
    genericFacts,
  };
}

export function auditRendererReadiness(registries, rendererRegistry = null) {
  const coverageById = new Map(
    (rendererRegistry?.coverage ?? []).map((entry) => [entry.component_id, entry]),
  );
  const coveredIds = new Set(coverageById.keys());
  const audited = listComponentRecords(registries)
    .map(({ library, record }) => auditComponent(record, library, coverageById))
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
