import { renderContractTree, selectVariantRoot } from "./email-interpreter.mjs";
import { renderPrimitive } from "./email-primitives.mjs";
import {
  buildRenderImpactProjection,
  digestRenderImpact,
} from "./render-impact.mjs";

const VIEWPORTS = ["mobile", "desktop"];

export const EMAIL_RENDERER_VERSION = "1.0.0";

function diagnostic(code, path, message) {
  return { code, path, message };
}

function sortDiagnostics(items) {
  const unique = new Map();
  for (const item of items) {
    unique.set(`${item.code}\0${item.path}\0${item.message}`, item);
  }
  return [...unique.values()].sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );
}

function withComponentContext(items, componentId) {
  return sortDiagnostics(
    items.map((item) => ({
      ...item,
      component_id: item.component_id ?? componentId,
    })),
  );
}

function componentRecord(componentIndex, componentId) {
  return componentIndex?.bySystemId?.get(componentId) ?? null;
}

function rendererCoverage(rendererRegistry, componentId) {
  return rendererRegistry?.coverage?.find(
    ({ component_id: candidate }) => candidate === componentId,
  ) ?? null;
}

function scopedId(instancePath, id) {
  return `${instancePath}::${id}`;
}

function bindingFor(items, viewport, matches) {
  const applicable = (items ?? []).filter(
    (item) => matches(item) && ["all", viewport].includes(item.scope),
  );
  return applicable.find(({ scope }) => scope === viewport) ??
    applicable.find(({ scope }) => scope === "all") ??
    null;
}

function propertyValue(instance, propertyId, viewport) {
  return bindingFor(
    instance.property_values,
    viewport,
    ({ property_id: candidate }) => candidate === propertyId,
  )?.value;
}

function contentValue(instance, elementId, slotId, viewport) {
  return bindingFor(
    instance.content_values,
    viewport,
    ({ element_id: candidate, slot_id: candidateSlot }) =>
      candidate === elementId && candidateSlot === slotId,
  )?.value;
}

function assetValue(instance, assetContractId) {
  return (instance.asset_files ?? []).find(
    ({ asset_contract_id: candidate }) => candidate === assetContractId,
  ) ?? null;
}

function slotValue(instance, elementId) {
  return (instance.slots ?? []).find(
    ({ element_id: candidate }) => candidate === elementId,
  ) ?? null;
}

function nestedValue(instance, elementId) {
  return (instance.nested_components ?? []).find(
    ({ element_id: candidate }) => candidate === elementId,
  ) ?? null;
}

function collectAsset(accumulator, instance, assetContractId, path) {
  const key = `${instance.instance_id}\0${assetContractId}\0${path}`;
  accumulator.assetFiles.set(key, {
    instance_id: instance.instance_id,
    asset_contract_id: assetContractId,
    path,
  });
}

function prepareElement({
  element,
  instance,
  instancePath,
  viewport,
  record,
  path,
  stack,
  accumulator,
  rendererRegistry,
  componentIndex,
}) {
  const originalId = element.id;
  const prepared = structuredClone(element);
  prepared.id = scopedId(instancePath, originalId);
  prepared.render_component_library = record.identity?.library;

  let visible = prepared.visibility?.mode === "instance" ? prepared.visibility.default_visible : true;
  if (prepared.visibility?.mode === "property") {
    const propertyId = prepared.visibility.property_id;
    const value = propertyValue(instance, propertyId, viewport);
    const propertyPath = `${path}/visibility/property_id`;
    if (typeof value !== "boolean") {
      accumulator.diagnostics.push(
        diagnostic(
          "RENDER_PROPERTY_UNRESOLVED",
          propertyPath,
          `Property ${propertyId} is not explicitly resolved for ${viewport}.`,
        ),
      );
    } else {
      const id = scopedId(instancePath, propertyId);
      prepared.visibility.property_id = id;
      accumulator.properties[viewport][id] = value;
      visible = value;
    }
  }

  for (const slot of visible ? (prepared.content_slots ?? []) : []) {
    let value = contentValue(instance, originalId, slot.id, viewport);
    if (prepared.render_mode === "slot" && slot.id === "content") {
      const children = slotValue(instance, originalId)?.instances ?? [];
      if (children.length > 0) {
        value = { type: "placeholder", value: "resolved-slot" };
      }
    }
    if (value !== null && value !== undefined) {
      accumulator.content[viewport][prepared.id] ??= {};
      accumulator.content[viewport][prepared.id][slot.id] = structuredClone(value);
    }
  }

  if (visible && prepared.asset_contract_id) {
    const originalAssetId = prepared.asset_contract_id;
    const asset = assetValue(instance, originalAssetId);
    if (typeof asset?.path === "string" && asset.path.length > 0) {
      const id = scopedId(instancePath, originalAssetId);
      prepared.asset_contract_id = id;
      accumulator.assets[viewport][id] = { src: asset.path };
      collectAsset(accumulator, instance, originalAssetId, asset.path);
    }
  }

  prepared.children = visible
    ? (element.children ?? []).map((child, index) =>
        prepareElement({
          element: child,
          instance,
          instancePath,
          viewport,
          record,
          path: `${path}/children/${index}`,
          stack,
          accumulator,
          rendererRegistry,
          componentIndex,
        }),
      ).filter(Boolean)
    : [];

  if (prepared.render_mode === "slot" && visible) {
    const slot = slotValue(instance, originalId);
    (slot?.instances ?? []).forEach((childInstance, index) => {
      const child = prepareInstance({
        instance: childInstance,
        expectedComponentId: childInstance?.component_id,
        viewport,
        path: `${path}/slots/${index}`,
        instancePath: `${instancePath}/${childInstance?.instance_id ?? index}`,
        stack,
        accumulator,
        rendererRegistry,
        componentIndex,
      });
      if (child) prepared.children.push(child);
    });
  }

  if (prepared.render_mode === "nested-component" && visible) {
    const nested = nestedValue(instance, originalId);
    if (!nested?.instance) {
      accumulator.diagnostics.push(
        diagnostic(
          "RENDER_NESTED_COMPONENT_DATA_MISSING",
          `${path}/component_id`,
          `Nested component data is missing for ${element.component_id}.`,
        ),
      );
    } else if (nested.instance.component_id !== element.component_id) {
      accumulator.diagnostics.push(
        diagnostic(
          "RENDER_NESTED_COMPONENT_MISMATCH",
          `${path}/component_id`,
          `Expected nested component ${element.component_id}, received ${String(nested.instance.component_id)}.`,
        ),
      );
    } else {
      const inferredAxes = Object.fromEntries((element.facts ?? [])
        .filter(({ id, value }) => id.startsWith("instance-") && id !== "instance-viewport" && typeof value?.value === "string")
        .map(({ id, value }) => [id.slice("instance-".length).replace(/^./u, (letter) => letter.toUpperCase()), value.value]));
      const childInstance = Object.keys(inferredAxes).length === 0 ? nested.instance : {
        ...nested.instance,
        variant_axes: {
          ...(nested.instance.variant_axes ?? {}),
          [viewport]: { ...inferredAxes, ...(nested.instance.variant_axes?.[viewport] ?? {}) },
        },
      };
      const child = prepareInstance({
        instance: childInstance,
        expectedComponentId: element.component_id,
        viewport,
        path: `${path}/nested`,
        instancePath: `${instancePath}/${nested.instance.instance_id}`,
        stack,
        accumulator,
        rendererRegistry,
        componentIndex,
      });
      if (child) {
        const instanceSizing = element.facts?.find(({ id }) => id === "horizontal-sizing")?.value?.value;
        if (instanceSizing === "fill") {
          child.facts = child.facts?.map((fact) => fact.id === "horizontal-sizing"
            ? { ...fact, value: { ...fact.value, value: "fill" } }
            : fact);
        }
        prepared.children.push(child);
      }
    }
  }

  return prepared;
}

function prepareInstance({
  instance,
  expectedComponentId,
  viewport,
  path,
  instancePath,
  stack,
  accumulator,
  rendererRegistry,
  componentIndex,
}) {
  if (!instance || instance.component_id !== expectedComponentId) {
    accumulator.diagnostics.push(
      diagnostic(
        "RENDER_COMPONENT_MISMATCH",
        `${path}/component_id`,
        `Expected component ${String(expectedComponentId)}, received ${String(instance?.component_id)}.`,
      ),
    );
    return null;
  }

  if (stack.includes(expectedComponentId)) {
    accumulator.diagnostics.push(
      diagnostic(
        "RENDER_COMPONENT_CYCLE",
        `${path}/component_id`,
        `Component cycle detected: ${[...stack, expectedComponentId].join(" -> ")}.`,
      ),
    );
    return null;
  }

  const record = componentRecord(componentIndex, expectedComponentId);
  if (!record) {
    accumulator.diagnostics.push(
      diagnostic(
        "RENDER_COMPONENT_UNKNOWN",
        `${path}/component_id`,
        `Component ${expectedComponentId} is not registered.`,
      ),
    );
    return null;
  }

  const coverage = rendererCoverage(rendererRegistry, expectedComponentId);
  if (!coverage) {
    accumulator.diagnostics.push(
      diagnostic(
        "RENDER_COVERAGE_MISSING",
        `${path}/component_id`,
        `Renderer coverage is missing for ${expectedComponentId}.`,
      ),
    );
    return null;
  }
  if (coverage.mode !== "interpreter") {
    accumulator.diagnostics.push(
      diagnostic(
        "RENDER_COVERAGE_MODE_UNSUPPORTED",
        `${path}/component_id`,
        `Coverage mode ${coverage.mode} is not supported by the pilot renderer.`,
      ),
    );
    return null;
  }

  if (instance.variants?.[viewport] !== viewport) {
    accumulator.diagnostics.push(
      diagnostic(
        "RENDER_VARIANT_UNRESOLVED",
        `${path}/variants/${viewport}`,
        `The ${viewport} variant must be explicitly resolved.`,
      ),
    );
    return null;
  }

  for (const property of record.properties ?? []) {
    if (property.type !== "boolean") continue;
    const value = propertyValue(instance, property.id, viewport);
    if (typeof value !== "boolean") {
      accumulator.diagnostics.push(
        diagnostic(
          "RENDER_PROPERTY_UNRESOLVED",
          `${path}/property_values/${property.id}`,
          `Boolean property ${property.id} is not explicitly resolved for ${viewport}.`,
        ),
      );
    }
  }

  const selection = selectVariantRoot(record, viewport, instance.variant_axes?.[viewport] ?? {});
  for (const item of selection.diagnostics) {
    accumulator.diagnostics.push({ ...item, path: `${path}${item.path}` });
  }
  if (selection.diagnostics.length > 0) return null;
  const root = selection.root;
  if (!root) {
    accumulator.diagnostics.push(
      diagnostic(
        "RENDER_VIEWPORT_CONTRACT_MISSING",
        `${path}/contracts/${viewport}`,
        `Component ${expectedComponentId} has no ${viewport} contract.`,
      ),
    );
    return null;
  }

  return prepareElement({
    element: root,
    instance,
    instancePath,
    viewport,
    record,
    path: `${path}/contracts/${viewport}/root`,
    stack: [...stack, expectedComponentId],
    accumulator,
    rendererRegistry,
    componentIndex,
  });
}

function createAccumulator() {
  return {
    content: { mobile: {}, desktop: {} },
    assets: { mobile: {}, desktop: {} },
    properties: { mobile: {}, desktop: {} },
    assetFiles: new Map(),
    diagnostics: [],
  };
}

function assetList(accumulator) {
  return [...accumulator.assetFiles.values()].sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.instance_id.localeCompare(right.instance_id) ||
      left.asset_contract_id.localeCompare(right.asset_contract_id),
  );
}

export function renderComponent({
  componentId,
  viewportData,
  rendererRegistry,
  componentIndex,
  foundations,
}) {
  const accumulator = createAccumulator();
  const roots = {};

  for (const viewport of VIEWPORTS) {
    roots[viewport] = prepareInstance({
      instance: viewportData,
      expectedComponentId: componentId,
      viewport,
      path: "/root",
      instancePath: viewportData?.instance_id ?? "root",
      stack: [],
      accumulator,
      rendererRegistry,
      componentIndex,
    });
  }

  const preparationDiagnostics = sortDiagnostics(accumulator.diagnostics);
  if (preparationDiagnostics.length > 0 || !roots.mobile || !roots.desktop) {
    return {
      html: "",
      css: "",
      assets: assetList(accumulator),
      diagnostics: withComponentContext(preparationDiagnostics, componentId),
    };
  }

  const rendered = renderContractTree({
    component: {
      id: componentId,
      identity: componentRecord(componentIndex, componentId)?.identity,
      contracts: {
        mobile: { root: roots.mobile },
        desktop: { root: roots.desktop },
      },
    },
    coverage: { component_id: componentId, mode: "interpreter" },
    content: accumulator.content,
    assets: accumulator.assets,
    properties: accumulator.properties,
    foundations,
  });

  return {
    ...rendered,
    assets: assetList(accumulator),
    diagnostics: withComponentContext(rendered.diagnostics, componentId),
  };
}

function collectModelComponentIds(instance, output = new Set()) {
  if (!instance) return output;
  output.add(instance.component_id);
  for (const slot of instance.slots ?? []) {
    for (const child of slot.instances ?? []) {
      collectModelComponentIds(child, output);
    }
  }
  for (const nested of instance.nested_components ?? []) {
    collectModelComponentIds(nested.instance, output);
  }
  return output;
}

function buildMetadataComment(model, dependencies) {
  const projections = [...collectModelComponentIds(model?.root)]
    .sort()
    .map((componentId) =>
      buildRenderImpactProjection({
        component: componentRecord(dependencies.componentIndex, componentId),
        coverage: rendererCoverage(dependencies.rendererRegistry, componentId),
        foundations: dependencies.foundations,
      }),
    );
  const impact = digestRenderImpact(projections);
  const commit = /^[0-9a-f]{40}$/u.test(dependencies.systemCommit ?? "")
    ? dependencies.systemCommit
    : "unknown";
  return (
    "<!-- cupis:build renderer=" +
    EMAIL_RENDERER_VERSION +
    " system-commit=" +
    commit +
    " render-impact=" +
    impact +
    " -->"
  );
}

export function renderEmailDocument(model, dependencies) {
  const rendered = renderComponent({
    componentId: model?.root?.component_id,
    viewportData: model?.root,
    ...dependencies,
  });

  if (rendered.diagnostics.length > 0) {
    return {
      html: "",
      assets: rendered.assets,
      diagnostics: rendered.diagnostics,
    };
  }

  const shell = dependencies?.foundations?.rendering?.shell;
  if (!shell) {
    return {
      html: "",
      assets: rendered.assets,
      diagnostics: [diagnostic(
        "RENDER_EMAIL_SHELL_MISSING",
        "/foundations/rendering/shell",
        "The canonical email shell is missing.",
      )],
    };
  }
  const style = rendered.css ? `<style>${rendered.css}</style>` : "";
  const metadata = buildMetadataComment(model, dependencies);
  const body = renderPrimitive("email-shell", shell, rendered.html);
  return {
    html: `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${metadata}${style}</head><body style="margin:0;padding:0">${body}</body></html>`,
    assets: rendered.assets,
    diagnostics: [],
  };
}