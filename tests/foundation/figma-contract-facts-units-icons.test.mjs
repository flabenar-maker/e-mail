import assert from "node:assert/strict";
import test from "node:test";

import { auditFigmaContractFacts } from "../../scripts/lib/figma-contract-facts.mjs";

function set(object, pointer, value) {
  const keys = pointer.slice(1).split("/");
  let target = object;
  for (const key of keys.slice(0, -1)) target = target[key] ??= {};
  target[keys.at(-1)] = value;
}

function hasUnitUnmapped(report) {
  return report.issues.some((issue) =>
    issue.code === "CONTRACT_FACT_UNMAPPED" && issue.contract_path.endsWith("/value/unit"));
}

function unitFixture({
  sourcePath = "/layout/item_spacing",
  sourceValue = 12,
  unit = "px",
  sourceUnit = undefined,
  dimensions = false,
  transform = "identity",
  provenanceNode = "mobile:1",
  captureVersion = "1.0.0",
  fileKey = "file-key",
  componentNodeId = "component:1",
} = {}) {
  const mobile = { node_id: "mobile:1", node_type: "COMPONENT" };
  if (dimensions) {
    mobile.reference_dimensions = { width: sourceValue, height: sourceValue + 1, unit: sourceUnit ?? "px" };
  } else {
    set(mobile, sourcePath, sourceValue);
    if (sourceUnit !== undefined) set(mobile, sourcePath.replace(/\/value$/u, "/unit"), sourceUnit);
  }
  const fact = dimensions
    ? { id: "size", value: { type: "dimensions", width: sourceValue, height: sourceValue + 1, unit }, provenance: { kind: "figma-literal", node_id: provenanceNode } }
    : { id: "measure", value: { type: "measure", value: sourceValue, unit }, provenance: { kind: "figma-literal", node_id: provenanceNode } };
  const base = "/contracts/mobile/root/facts/0/value";
  const mappings = [
    { variant_node_id: "mobile:1", node_id: "mobile:1", source_path: "/node_type", contract_path: "/identity/node_kind", transform: "lowercase" },
    ...(dimensions
      ? [
        { variant_node_id: "mobile:1", node_id: "mobile:1", source_path: "/reference_dimensions/width", contract_path: `${base}/width`, transform },
        { variant_node_id: "mobile:1", node_id: "mobile:1", source_path: "/reference_dimensions/height", contract_path: `${base}/height`, transform },
      ]
      : [{ variant_node_id: "mobile:1", node_id: "mobile:1", source_path: sourcePath, contract_path: `${base}/value`, transform }]),
  ];
  const record = {
    id: "unit-example",
    identity: { semantic_role: "block", node_kind: "component" },
    figma: { file_key: "file-key", node_id: "component:1" },
    variants: [{ node_id: "mobile:1" }, { node_id: "desktop:1" }],
    contracts: {
      mobile: { root: { facts: [fact], children: [] } },
      desktop: { root: { facts: [], children: [] } },
      figma_fact_links: mappings,
    },
  };
  const live = {
    capture_version: captureVersion,
    capture_errors: [], component_properties: [], file_key: fileKey, component_node_id: componentNodeId,
    variants: [
      { variant_node_id: "mobile:1", axes: [{ name: "Viewport", value: "Mobile" }], source_node: mobile },
      { variant_node_id: "desktop:1", axes: [{ name: "Viewport", value: "Desktop" }], source_node: { node_id: "desktop:1" } },
    ],
  };
  return { record, live, mappings };
}

const unitFamilies = [
  { name: "dimensions", dimensions: true, unit: "px" },
  { name: "reference radius", sourcePath: "/corner_radius", unit: "px" },
  ...["top_left", "top_right", "bottom_left", "bottom_right"].map((edge) => ({ name: `corner radii ${edge}`, sourcePath: `/corner_radii/${edge}`, unit: "px" })),
  { name: "item spacing", sourcePath: "/layout/item_spacing", unit: "px" },
  ...["top", "right", "bottom", "left"].map((edge) => ({ name: `padding ${edge}`, sourcePath: `/layout/padding/${edge}`, unit: "px" })),
  { name: "font size", sourcePath: "/text_style/font_size_px", unit: "px" },
  { name: "minimum width", sourcePath: "/minimum_width_px", unit: "px" },
  { name: "stroke weight", sourcePath: "/stroke_weight", unit: "px" },
  { name: "line height pixels", sourcePath: "/text_style/line_height/value", sourceValue: 20, sourceUnit: "PIXELS", unit: "px" },
  { name: "line height percent", sourcePath: "/text_style/line_height/value", sourceValue: 140, sourceUnit: "PERCENT", unit: "percent" },
  { name: "letter spacing pixels", sourcePath: "/text_style/letter_spacing/value", sourceValue: 0, sourceUnit: "PIXELS", unit: "px" },
  { name: "letter spacing percent", sourcePath: "/text_style/letter_spacing/value", sourceValue: 8, sourceUnit: "PERCENT", unit: "percent" },
];

for (const family of unitFamilies) {
  test(`owned identity mappings prove the ${family.name} unit`, () => {
    const { record, live, mappings } = unitFixture(family);
    const report = auditFigmaContractFacts({ record, live, mappings });
    assert.equal(hasUnitUnmapped(report), false, family.name);
    assert.equal(report.issues.some((issue) => issue.code === "FIGMA_CONTRACT_UNIT_MISMATCH"), false, family.name);
  });
}

test("units stay unmapped for closed-rule negatives", () => {
  const cases = [
    ["unknown numeric source", (input) => { input.mappings[1].source_path = "/opacity"; set(input.live.variants[0].source_node, "/opacity", 12); }],
    ["unknown *_px source", (input) => { input.mappings[1].source_path = "/unknown_px"; set(input.live.variants[0].source_node, "/unknown_px", 12); }],
    ["missing explicit line-height unit", (input) => { delete input.live.variants[0].source_node.text_style.line_height.unit; }],
    ["mismatched explicit line-height unit", (input) => { input.live.variants[0].source_node.text_style.line_height.unit = "PIXELS"; }],
    ["unknown explicit line-height unit", (input) => { input.live.variants[0].source_node.text_style.line_height.unit = "AUTO"; }],
    ["numeric drift", (input) => { input.live.variants[0].source_node.layout.item_spacing = 13; }],
    ["wrong provenance node", (input) => { input.record.contracts.mobile.root.facts[0].provenance.node_id = "other:1"; }],
    ["registry literal provenance", (input) => { input.record.contracts.mobile.root.facts[0].provenance = { kind: "registry-literal", source_path: "/data/example" }; }],
    ["missing dimensions height mapping", (input) => { input.mappings.splice(2, 1); }],
    ["dimensions from different nodes", (input) => { input.live.variants[0].source_node.children = [{ node_id: "other:1", node_type: "FRAME", reference_dimensions: { height: input.live.variants[0].source_node.reference_dimensions.height } }]; input.mappings[2].node_id = "other:1"; }],
    ["external-only mapping", (input) => { input.record.contracts.figma_fact_links = []; }],
    ["non-identity transform", (input) => { input.mappings[1].transform = "lowercase"; }],
    ["invalid capture profile", (input) => { input.live.capture_version = "0.0.0"; }],
    ["invalid Figma identity", (input) => { input.live.component_node_id = "other:component"; }],
    ["conflicting numeric target mapping", (input) => {
      input.live.variants[0].source_node.minimum_width_px = 12;
      input.mappings.push({ variant_node_id: "mobile:1", node_id: "mobile:1", source_path: "/minimum_width_px", contract_path: "/contracts/mobile/root/facts/0/value/value", transform: "identity" });
    }],
    ["duplicate exact numeric target mapping", (input) => { input.mappings.push({ ...input.mappings[1] }); }],
  ];
  for (const [name, mutate] of cases) {
    const input = unitFixture(name.includes("dimensions") ? { dimensions: true } : name.includes("line-height") ? { sourcePath: "/text_style/line_height/value", sourceValue: 140, sourceUnit: "PERCENT", unit: "percent" } : {});
    mutate(input);
    const report = auditFigmaContractFacts({ record: input.record, live: input.live, mappings: input.mappings });
    assert.equal(hasUnitUnmapped(report), true, name);
  }
});

function sourceOnlyIcon() {
  const record = {
    id: "source-only-icon",
    identity: { semantic_role: "icon", node_kind: "component" },
    figma: { file_key: "file-key", node_id: "icon:1" }, variants: [],
    contracts: {
      mobile: { root: { id: "root", render_mode: "figma-source-only", facts: [], children: [] } },
      desktop: { root: { id: "root", render_mode: "figma-source-only", facts: [], children: [] } },
    },
  };
  const live = {
    capture_version: "1.0.0", file_key: "file-key", component_node_id: "icon:1", component_properties: [],
    capture_errors: [{ node_id: "icon:1", code: "ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW" }],
    variants: [{ variant_node_id: "icon:1", axes: [], source_node: { node_id: "icon:1", node_type: "COMPONENT", name: "Icon" } }],
  };
  return { record, live };
}

test("a standalone source-only icon accepts its one shared component root but retains evidence diagnostics", () => {
  const { record, live } = sourceOnlyIcon();
  const report = auditFigmaContractFacts({ record, live });
  for (const code of ["FIGMA_VARIANT_MISSING", "FIGMA_VIEWPORT_UNKNOWN", "FIGMA_VARIANT_UNDECLARED", "FIGMA_IDENTITY_MISMATCH", "FIGMA_VARIANT_ROOT_MISMATCH"]) {
    assert.equal(report.issues.some((issue) => issue.code === code), false, code);
  }
  assert.ok(report.issues.some((issue) => issue.code === "EVIDENCE_LINKS_NOT_IN_CONTRACT"));
  assert.ok(report.issues.some((issue) => issue.code === "FIGMA_FACT_UNCOVERED" && issue.node_id === "icon:1"));
  assert.ok(report.issues.some((issue) => issue.code === "FIGMA_CAPTURE_UNSUPPORTED"));
});

test("a standalone source-only icon can own equivalent links in both viewport roots", () => {
  const { record, live } = sourceOnlyIcon();
  for (const viewport of ["mobile", "desktop"]) {
    record.contracts[viewport].root.facts.push({
      id: "icon-name",
      value: { type: "string", value: "Icon" },
      provenance: { kind: "figma-literal", node_id: "icon:1" },
    });
  }
  record.contracts.figma_fact_links = ["mobile", "desktop"].map((viewport) => ({
    variant_node_id: "icon:1", node_id: "icon:1", source_path: "/name",
    contract_path: `/contracts/${viewport}/root/facts/0/value/value`, transform: "identity",
  }));
  const report = auditFigmaContractFacts({ record, live });
  assert.equal(report.issues.some((issue) => issue.code === "CONTRACT_VIEWPORT_MISMATCH"), false);
});

test("a standalone source-only icon does not hide a vector child or its capture diagnostic", () => {
  const { record, live } = sourceOnlyIcon();
  live.variants[0].source_node.children = [{ node_id: "vector:1", node_type: "VECTOR", name: "Vector" }];
  live.capture_errors.push({ node_id: "vector:1", code: "ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW" });
  const report = auditFigmaContractFacts({ record, live });
  assert.ok(report.issues.some((issue) => issue.code === "FIGMA_FACT_UNCOVERED" && issue.node_id === "vector:1"));
  assert.ok(report.issues.some((issue) => issue.code === "FIGMA_CAPTURE_UNSUPPORTED" && issue.details.some((detail) => detail.node_id === "vector:1")));
});

test("source-only icon topology rejects invalid role, render roots, identity, type, and variants", () => {
  const cases = [
    ["non-icon role", (input) => { input.record.identity.semantic_role = "block"; }, "FIGMA_VARIANT_MISSING"],
    ["non-source-only root", (input) => { input.record.contracts.mobile.root.render_mode = "presentation-table"; }, "FIGMA_VARIANT_MISSING"],
    ["wrong component identity", (input) => { input.live.component_node_id = "other:1"; }, "FIGMA_IDENTITY_MISMATCH"],
    ["wrong root type", (input) => { input.live.variants[0].source_node.node_type = "FRAME"; }, "FIGMA_VARIANT_MISSING"],
    ["extra variant axes", (input) => { input.live.variants.push({ variant_node_id: "icon:2", axes: [{ name: "Viewport", value: "Mobile" }], source_node: { node_id: "icon:2", node_type: "COMPONENT" } }); }, "FIGMA_VARIANT_UNDECLARED"],
  ];
  for (const [name, mutate, code] of cases) {
    const { record, live } = sourceOnlyIcon(); mutate({ record, live });
    const report = auditFigmaContractFacts({ record, live });
    assert.ok(report.issues.some((issue) => issue.code === code), name);
  }
});
