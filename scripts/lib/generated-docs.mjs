import { readFile } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";

import { loadAssetsFoundation } from "./assets-foundation.mjs";
import {
  collectComponentReferences,
  indexComponentRegistries,
  listComponentRecords,
  loadComponentRegistries,
  walkComponentElements,
} from "./component-registry.mjs";
import { renderFigmaComponentDescription } from "./component-description.mjs";
import { renderComponentRegistrySection } from "./component-registry-doc.mjs";
import { digestTextEntries, canonicalize } from "./content-digest.mjs";
import { SystemValidationError } from "./diagnostics.mjs";
import { loadFigmaNamingFoundation } from "./figma-naming-foundation.mjs";
import { loadSpacingFoundation } from "./spacing-foundation.mjs";
import { loadTypographyFoundation } from "./typography-foundation.mjs";

const LIBRARY_ORDER = ["shared", "marketing", "service"];
const SCHEMA_ORDER = [
  "components",
  "typography",
  "spacing",
  "assets",
  "figma-naming",
];

const SOURCE_IDS = Object.freeze({
  components: Object.freeze({
    shared: "components-shared",
    marketing: "components-marketing",
    service: "components-service",
    schema: "components-schema",
  }),
  typography: Object.freeze({
    data: "typography-foundation",
    schema: "typography-schema",
  }),
  spacing: Object.freeze({
    data: "spacing-foundation",
    schema: "spacing-schema",
  }),
  assets: Object.freeze({
    data: "assets-foundation",
    schema: "assets-schema",
  }),
  figmaNaming: Object.freeze({
    data: "figma-naming-foundation",
    schema: "figma-naming-schema",
  }),
});

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

function sourceIndex(manifest) {
  return new Map((manifest?.sources ?? []).map((source) => [source.id, source]));
}

function requireSource(sources, id) {
  const source = sources.get(id);
  if (!source) {
    throw diagnostic(
      "GENERATED_DOC_INPUT_UNKNOWN",
      `/sources/${id}`,
      `Generated documentation source is missing: ${id}.`,
    );
  }
  return source;
}

function safeRepoPath(repoRoot, path) {
  const root = resolve(repoRoot);
  const target = resolve(root, path);
  const relation = relative(root, target);
  if (relation.startsWith("..") || isAbsolute(relation)) {
    throw diagnostic(
      "GENERATED_DOC_PATH_ESCAPE",
      `/${String(path).replaceAll("\\", "/")}`,
      `Generated documentation path escapes the repository root: ${path}.`,
    );
  }
  return target;
}

function inlineCode(value) {
  const text = String(value);
  const longest = Math.max(
    0,
    ...(text.match(/`+/gu) ?? []).map((item) => item.length),
  );
  const fence = "`".repeat(longest + 1);
  return `${fence}${text}${fence}`;
}

function oneLine(value) {
  return String(value ?? "")
    .replace(/\r\n?|\u2028|\u2029/gu, "\n")
    .replaceAll("\n", " ")
    .trim();
}

function prettyJson(value) {
  return JSON.stringify(JSON.parse(canonicalize(value)), null, 2);
}

function fencedJson(value) {
  return ["```json", prettyJson(value), "```"];
}

function formatMeasure(measure) {
  if (!measure) return "";
  return `${measure.value}${measure.unit === "percent" ? "%" : measure.unit}`;
}

function renderHeader(definition, model) {
  const entries = definition.input_source_ids.map((id) => {
    const source = requireSource(model.sources, id);
    const content = model.sourceTexts.get(id);
    if (typeof content !== "string") {
      throw diagnostic(
        "GENERATED_DOC_INPUT_UNREAD",
        `/generated_docs/${definition.id}/input_source_ids/${id}`,
        `Generated documentation input was not loaded: ${id}.`,
      );
    }
    return { path: source.path, content };
  });

  const usedIds = new Set(definition.input_source_ids);
  const versionParts = [];
  const families = {
    components: Object.values(SOURCE_IDS.components),
    typography: Object.values(SOURCE_IDS.typography),
    spacing: Object.values(SOURCE_IDS.spacing),
    assets: Object.values(SOURCE_IDS.assets),
    "figma-naming": Object.values(SOURCE_IDS.figmaNaming),
  };
  for (const family of SCHEMA_ORDER) {
    if (families[family].some((id) => usedIds.has(id))) {
      versionParts.push(`${family}=${model.schemaVersions[family]}`);
    }
  }

  return [
    "<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->",
    `<!-- renderer: ${definition.renderer} -->`,
    `<!-- source-digest: ${digestTextEntries(entries)} -->`,
    `<!-- schema-versions: ${versionParts.join(", ")} -->`,
    "",
  ];
}

function lacksStandaloneOutputContract(record) {
  const modes = [];
  walkComponentElements(record, ({ element }) => {
    modes.push(element.render_mode);
  });
  return (
    modes.length > 0 &&
    modes.every((mode) => mode === "figma-source-only") &&
    (record.asset_contracts ?? []).length === 0
  );
}

function renderComponentRegistry(model) {
  const records = listComponentRecords(model.registries);
  const counts = Object.fromEntries(
    LIBRARY_ORDER.map((library) => [
      library,
      records.filter((entry) => entry.library === library).length,
    ]),
  );
  const lines = [
    "# CUPIS component registry",
    "",
    `${records.length} component records.`,
    "",
    "| Library | Records |",
    "|---|---:|",
    ...LIBRARY_ORDER.map(
      (library) => `| ${library} | ${counts[library]} |`,
    ),
    "",
  ];

  for (const { library, record } of records) {
    lines.push(
      `<!-- library: ${library}; component-id: ${record.id} -->`,
      renderComponentRegistrySection(record, model.componentIndex).trimEnd(),
      "",
      "### Output contract classification",
      "",
    );
    if (lacksStandaloneOutputContract(record)) {
      lines.push(
        "- No standalone output contract: `figma-source-only` component used inside a parent rendered asset.",
      );
    } else {
      lines.push(
        "- Standalone output is defined by the Mobile and Desktop contracts above.",
      );
    }
    lines.push(
      "",
      "### Auxiliary Figma Description",
      "",
      "This compact projection is metadata only and is not an HTML-build input.",
      "",
      "```text",
      renderFigmaComponentDescription(record).trimEnd(),
      "```",
      "",
    );
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function typographyConsumers(model) {
  const consumers = new Map(
    (model.typography.styles ?? []).map((style) => [style.id, new Set()]),
  );
  for (const { record } of listComponentRecords(model.registries)) {
    for (const reference of collectComponentReferences(record).foundations) {
      if (
        reference.foundationId === "typography" &&
        reference.group === "styles" &&
        consumers.has(reference.id)
      ) {
        consumers.get(reference.id).add(record.id);
      }
    }
  }
  return consumers;
}

function renderTypographyRegistry(model) {
  const lines = [
    "# CUPIS typography registry",
    "",
    "Typography definitions come from the structured foundation. Consumers are computed from component contracts.",
    "",
    "## Responsive pairs",
    "",
  ];
  const pairs = [...(model.typography.responsive_pairs ?? [])].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
  for (const pair of pairs) {
    lines.push(
      `- Responsive pair ${inlineCode(pair.id)} — role ${inlineCode(pair.role)}; Desktop ${inlineCode(pair.desktop_style_id)}; Mobile ${inlineCode(pair.mobile_style_id)}.`,
    );
  }

  lines.push("", "## Styles", "");
  const consumers = typographyConsumers(model);
  const styles = [...(model.typography.styles ?? [])].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
  for (const style of styles) {
    const pair = pairs.find(
      (item) =>
        item.desktop_style_id === style.id || item.mobile_style_id === style.id,
    );
    const usedBy = [...(consumers.get(style.id) ?? [])].sort();
    lines.push(
      `### ${style.figma_name}`,
      "",
      `- Stable ID: ${inlineCode(style.id)}`,
      `- Viewport: ${inlineCode(style.viewport)}`,
      `- Role: ${inlineCode(style.role)}`,
      `- Variant: ${inlineCode(style.variant)}`,
      `- Font: ${inlineCode(style.font.family)} ${inlineCode(style.font.figma_style)}; CSS weight ${inlineCode(style.font.css_weight)}`,
      `- Font size: ${inlineCode(`${style.font_size_px}px`)}`,
      `- Line-height: ${inlineCode(formatMeasure(style.line_height))}`,
      `- Letter-spacing: ${inlineCode(formatMeasure(style.letter_spacing))}`,
      `- Responsive pair: ${pair ? inlineCode(pair.id) : "none"}`,
      `- Consumers: ${usedBy.length > 0 ? usedBy.map(inlineCode).join(", ") : "none"}`,
      `- Figma description: ${oneLine(style.figma_description)}`,
      "",
    );
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderFoundationDefinitions(lines, title, items) {
  lines.push(`## ${title}`, "");
  for (const item of [...(items ?? [])].sort((left, right) =>
    String(left.id).localeCompare(String(right.id)),
  )) {
    lines.push(`### ${item.label ?? item.id}`, "");
    lines.push(`- Stable ID: ${inlineCode(item.id)}`);
    if (item.description) {
      lines.push(`- Description: ${oneLine(item.description)}`);
    }
    if (item.contract !== undefined) {
      lines.push("- Contract:", "", ...fencedJson(item.contract));
    } else {
      const rest = Object.fromEntries(
        Object.entries(item).filter(
          ([key]) => !["id", "label", "description"].includes(key),
        ),
      );
      if (Object.keys(rest).length > 0) {
        lines.push("- Definition:", "", ...fencedJson(rest));
      }
    }
    lines.push("");
  }
}

function renderAssetRegistry(model) {
  const assets = model.assets;
  const lines = [
    "# CUPIS asset registry",
    "",
    "General export definitions are listed first. Component-specific choices remain owned by component contracts.",
    "",
  ];
  for (const [key, title] of [
    ["source_modes", "Source modes"],
    ["display_modes", "Display modes"],
    ["export_profiles", "Export profiles"],
    ["alpha_modes", "Alpha modes"],
    ["clipping_policies", "Clipping policies"],
    ["compatibility", "Compatibility"],
    ["global_invariants", "Global invariants"],
  ]) {
    renderFoundationDefinitions(lines, title, assets[key]);
  }
  renderNamedJsonSection(lines, "Identity policy", assets.identity_policy);
  renderNamedJsonSection(lines, "Background policy", assets.background_policy);

  lines.push("## Component-specific asset contracts", "");
  for (const { record } of listComponentRecords(model.registries)) {
    if ((record.asset_contracts ?? []).length === 0) continue;
    lines.push(`### ${record.id}`, "");
    for (const asset of [...record.asset_contracts].sort((left, right) =>
      left.id.localeCompare(right.id),
    )) {
      lines.push(
        `- ${inlineCode(record.id)} → ${inlineCode(asset.owner_layer_name)} → ${inlineCode(asset.source_mode_id)} → ${inlineCode(asset.display_mode_id)} → ${inlineCode(asset.export_profile_id)} → ${inlineCode(asset.alpha_mode_id)}`,
        `  - Asset contract ID: ${inlineCode(asset.id)}`,
        `  - Export boundary: ${inlineCode(asset.export_boundary.kind)} / ${inlineCode(asset.export_boundary.semantic_node_name)}`,
        `  - Pixel dimensions: ${asset.pixel_dimensions.width}×${asset.pixel_dimensions.height}${asset.pixel_dimensions.unit}`,
        `  - Aspect ratio: ${asset.aspect_ratio.width}:${asset.aspect_ratio.height}`,
        `  - Crop: ${inlineCode(asset.crop.mode)}; position ${inlineCode(asset.crop.position_source)}`,
        `  - Background: own visible boundary fill ${inlineCode(asset.background.own_visible_boundary_fill)}; artificial matte ${inlineCode(asset.background.artificial_matte)}`,
        `  - Clipping policy: ${inlineCode(asset.clipping_policy_id)}`,
      );
    }
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderNamedJsonSection(lines, title, value) {
  lines.push(`## ${title}`, "", ...fencedJson(value), "");
}

function renderNamingReference(model) {
  const naming = model.figmaNaming;
  const lines = [
    "# CUPIS Figma naming reference",
    "",
    "This reference contains universal naming vocabulary and templates only. It does not contain component records, node IDs or a rename map.",
    "",
  ];

  renderNamedJsonSection(lines, "Object kinds", naming.object_kinds);
  renderNamedJsonSection(lines, "Component name template", naming.component_names);
  renderNamedJsonSection(lines, "Namespaces and semantic roles", naming.namespaces);

  lines.push("## Variant axis ordering", "");
  for (const axis of [...(naming.variant_axes ?? [])].sort(
    (left, right) => left.order - right.order,
  )) {
    lines.push(
      `- ${axis.order}. ${inlineCode(axis.label)} (${inlineCode(axis.id)})${axis.values ? `; values: ${axis.values.map(inlineCode).join(", ")}` : ""}`,
    );
  }
  lines.push("");

  renderNamedJsonSection(lines, "Property names", naming.property_names);
  renderNamedJsonSection(lines, "Layer semantic roles", naming.layer_names);
  renderNamedJsonSection(lines, "Asset owner names", naming.asset_owners);
  renderNamedJsonSection(
    lines,
    "Organizational and service names",
    naming.organizational_names,
  );

  return `${lines.join("\n").trimEnd()}\n`;
}

const RENDERERS = Object.freeze({
  "component-registry": renderComponentRegistry,
  "typography-registry": renderTypographyRegistry,
  "asset-registry": renderAssetRegistry,
  "naming-reference": renderNamingReference,
});

export async function loadGeneratedDocModel({ repoRoot, manifest }) {
  const sources = sourceIndex(manifest);
  const componentSources = SOURCE_IDS.components;
  const typographySources = SOURCE_IDS.typography;
  const spacingSources = SOURCE_IDS.spacing;
  const assetSources = SOURCE_IDS.assets;
  const namingSources = SOURCE_IDS.figmaNaming;

  const requiredIds = new Set([
    ...Object.values(componentSources),
    ...Object.values(typographySources),
    ...Object.values(spacingSources),
    ...Object.values(assetSources),
    ...Object.values(namingSources),
    ...(manifest.generated_docs ?? []).flatMap(
      (definition) => definition.input_source_ids,
    ),
  ]);
  for (const id of requiredIds) requireSource(sources, id);

  const [
    registries,
    typography,
    spacing,
    assets,
    figmaNaming,
    sourceTextEntries,
  ] = await Promise.all([
    loadComponentRegistries({
      repoRoot,
      sources: {
        shared: requireSource(sources, componentSources.shared).path,
        marketing: requireSource(sources, componentSources.marketing).path,
        service: requireSource(sources, componentSources.service).path,
      },
      schemaPath: requireSource(sources, componentSources.schema).path,
    }),
    loadTypographyFoundation({
      repoRoot,
      dataPath: requireSource(sources, typographySources.data).path,
      schemaPath: requireSource(sources, typographySources.schema).path,
    }),
    loadSpacingFoundation({
      repoRoot,
      dataPath: requireSource(sources, spacingSources.data).path,
      schemaPath: requireSource(sources, spacingSources.schema).path,
    }),
    loadAssetsFoundation({
      repoRoot,
      dataPath: requireSource(sources, assetSources.data).path,
      schemaPath: requireSource(sources, assetSources.schema).path,
    }),
    loadFigmaNamingFoundation({
      repoRoot,
      dataPath: requireSource(sources, namingSources.data).path,
      schemaPath: requireSource(sources, namingSources.schema).path,
    }),
    Promise.all(
      [...requiredIds].map(async (id) => {
        const source = requireSource(sources, id);
        return [
          id,
          await readFile(safeRepoPath(repoRoot, source.path), "utf8"),
        ];
      }),
    ),
  ]);

  const foundations = { typography, spacing, assets };
  return {
    sources,
    sourceTexts: new Map(sourceTextEntries),
    registries,
    typography,
    spacing,
    assets,
    figmaNaming,
    componentIndex: indexComponentRegistries(registries, foundations),
    schemaVersions: Object.freeze({
      components: registries.shared.schema_version,
      typography: typography.schema_version,
      spacing: spacing.schema_version,
      assets: assets.schema_version,
      "figma-naming": figmaNaming.schema_version,
    }),
  };
}

export function renderGeneratedDoc({ definition, model }) {
  const renderer = RENDERERS[definition?.renderer];
  if (!renderer) {
    throw diagnostic(
      "GENERATED_DOC_RENDERER_UNKNOWN",
      `/generated_docs/${String(definition?.id)}/renderer`,
      `Unknown generated documentation renderer: ${String(definition?.renderer)}.`,
    );
  }
  return `${renderHeader(definition, model).join("\n")}${renderer(model)}`;
}

export async function renderAllGeneratedDocs({ repoRoot, manifest }) {
  const model = await loadGeneratedDocModel({ repoRoot, manifest });
  const outputs = new Map();
  const definitions = [...(manifest.generated_docs ?? [])].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
  for (const definition of definitions) {
    const output = requireSource(model.sources, definition.output_source_id);
    outputs.set(
      output.path,
      renderGeneratedDoc({ definition, model }),
    );
  }
  return outputs;
}

export async function compareGeneratedDocs({ repoRoot, rendered }) {
  const errors = [];
  for (const [path, expected] of [...rendered].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    try {
      const actual = await readFile(safeRepoPath(repoRoot, path), "utf8");
      if (actual !== expected) {
        errors.push(
          diagnostic(
            "GENERATED_DOC_STALE",
            `/${path.replaceAll("\\", "/")}`,
            `Generated documentation is stale: ${path}.`,
          ),
        );
      }
    } catch (error) {
      if (error?.code === "ENOENT") {
        errors.push(
          diagnostic(
            "GENERATED_DOC_MISSING",
            `/${path.replaceAll("\\", "/")}`,
            `Generated documentation is missing: ${path}.`,
          ),
        );
      } else {
        throw error;
      }
    }
  }
  return sortDiagnostics(errors);
}
