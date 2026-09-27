import assert from "node:assert/strict";
import test from "node:test";

const moduleUnderTest = await import("../../scripts/lib/figma-contract-facts.mjs").catch(() => ({}));
const auditFigmaContractFacts = moduleUnderTest.auditFigmaContractFacts;

function fixture() {
  const sourceNode = {
    node_id: "2:1",
    name: "Viewport=Mobile",
    node_type: "COMPONENT",
    visible: true,
    layout: { mode: "VERTICAL", item_spacing: 12, padding: { top: 16, right: 16, bottom: 0, left: 16 } },
    children: [{
      node_id: "3:1",
      name: "heading",
      node_type: "TEXT",
      visible: true,
      characters: "Помощь",
      fills: [{ type: "solid", color: "#48494A", opacity: 1, visible: true }],
      text_style: { font_family: "Roboto", font_size_px: 14, line_height: { unit: "PERCENT", value: 140 } },
    }],
  };
  const record = {
    id: "sample",
    figma: { file_key: "file-key", node_id: "1:1" },
    contracts: {
      mobile: {
        root: {
          facts: [
            { id: "gap", value: { type: "measure", value: 12, unit: "px" } },
            { id: "top", value: { type: "measure", value: 16, unit: "px" } },
          ],
          children: [{
            id: "heading",
            facts: [
              { id: "text", value: { type: "string", value: "Помощь" } },
              { id: "color", value: { type: "color", value: "#48494A" } },
              { id: "font-size", value: { type: "measure", value: 14, unit: "px" } },
            ],
            children: [],
          }],
        },
      },
      desktop: { root: { facts: [], children: [] } },
    },
  };
  const packet = {
    capture_version: "1.0.0",
    capture_errors: [],
    component_properties: [],
    file_key: "file-key",
    component_node_id: "1:1",
    variants: [
      { variant_node_id: "2:1", axes: [{ name: "Viewport", value: "Mobile" }], source_node: sourceNode },
      { variant_node_id: "2:2", axes: [{ name: "Viewport", value: "Desktop" }], source_node: { node_id: "2:2", name: "Viewport=Desktop", node_type: "COMPONENT", visible: true } },
    ],
  };
  const mappings = [
    ["2:1", "2:1", "/name", "/contracts/mobile/root/id", "identity"],
    ["2:1", "2:1", "/node_type", "/identity/node_kind", "lowercase"],
    ["2:1", "2:1", "/visible", "/contracts/mobile/root/visibility", "identity"],
    ["2:1", "2:1", "/layout/mode", "/contracts/mobile/root/layout", "lowercase"],
    ["2:1", "2:1", "/layout/item_spacing", "/contracts/mobile/root/facts/0/value/value", "identity"],
    ["2:1", "2:1", "/layout/padding/top", "/contracts/mobile/root/facts/1/value/value", "identity"],
    ["2:1", "3:1", "/characters", "/contracts/mobile/root/children/0/facts/0/value/value", "identity"],
    ["2:1", "3:1", "/fills/0/color", "/contracts/mobile/root/children/0/facts/1/value/value", "identity"],
    ["2:1", "3:1", "/text_style/font_size_px", "/contracts/mobile/root/children/0/facts/2/value/value", "identity"],
  ].map(([variant_node_id, node_id, source_path, contract_path, transform]) => ({
    variant_node_id, node_id, source_path, contract_path, transform,
  }));
  record.contracts.figma_fact_links = mappings;
  return { record, packet, mappings };
}

test("live Figma input is required even when a record contains source_variants", () => {
  assert.equal(typeof auditFigmaContractFacts, "function");
  const { record, mappings } = fixture();
  record.contracts.source_variants = [{ variant_node_id: "2:1", source_node: { node_id: "2:1" } }];
  const report = auditFigmaContractFacts({ record, mappings });
  assert.equal(report.ok, false);
  assert.ok(report.issues.some((issue) => issue.code === "LIVE_FIGMA_REQUIRED"));
});

test("a changed Figma gap is detected against the contract's exact value", () => {
  const { record, packet, mappings } = fixture();
  packet.variants[0].source_node.layout.item_spacing = 13;
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "FIGMA_CONTRACT_MISMATCH" && issue.source_path === "/layout/item_spacing"));
});

test("an unrepresented Figma text or typography field blocks approval", () => {
  const { record, packet, mappings } = fixture();
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "FIGMA_FACT_UNCOVERED" && issue.source_path === "/text_style/line_height/value"));
});

test("a mapping to a wrong source node cannot pass by matching a value elsewhere", () => {
  const { record, packet, mappings } = fixture();
  const mapping = mappings.find((item) => item.source_path === "/fills/0/color");
  mapping.node_id = "2:1";
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "FIGMA_SOURCE_PATH_MISSING"));
});

test("both Mobile and Desktop variants are required", () => {
  const { record, packet, mappings } = fixture();
  packet.variants.pop();
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "FIGMA_VARIANT_MISSING" && issue.viewport === "desktop"));
});

test("a contract value without Figma evidence blocks approval", () => {
  const { record, packet, mappings } = fixture();
  record.contracts.mobile.root.facts.push({ id: "orphan", value: { type: "measure", value: 99, unit: "px" } });
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "CONTRACT_FACT_UNMAPPED" && issue.contract_path === "/contracts/mobile/root/facts/2/value/value"));
});

test("a new Figma layer is not silently omitted", () => {
  const { record, packet, mappings } = fixture();
  packet.variants[0].source_node.children.push({ node_id: "3:2", name: "new-label", node_type: "TEXT", visible: true, characters: "Новое" });
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "FIGMA_FACT_UNCOVERED" && issue.node_id === "3:2"));
});

test("an exact fully mapped Mobile/Desktop example passes", () => {
  const record = {
    id: "exact-sample",
    figma: { file_key: "file-key", node_id: "1:1" },
    variants: [{ node_id: "2:1" }, { node_id: "2:2" }],
    contracts: {
      mobile: { root: { facts: [{ id: "gap", value: { type: "integer", value: 12 } }], children: [] } },
      desktop: { root: { facts: [{ id: "gap", value: { type: "integer", value: 16 } }], children: [] } },
    },
  };
  const live = {
    capture_version: "1.0.0",
    capture_errors: [],
    component_properties: [],
    file_key: "file-key",
    component_node_id: "1:1",
    variants: [
      { variant_node_id: "2:1", axes: [{ name: "Viewport", value: "Mobile" }], source_node: { node_id: "2:1", layout: { item_spacing: 12 } } },
      { variant_node_id: "2:2", axes: [{ name: "Viewport", value: "Desktop" }], source_node: { node_id: "2:2", layout: { item_spacing: 16 } } },
    ],
  };
  const mappings = [
    { variant_node_id: "2:1", node_id: "2:1", source_path: "/layout/item_spacing", contract_path: "/contracts/mobile/root/facts/0/value/value", transform: "identity" },
    { variant_node_id: "2:2", node_id: "2:2", source_path: "/layout/item_spacing", contract_path: "/contracts/desktop/root/facts/0/value/value", transform: "identity" },
  ];
  record.contracts.figma_fact_links = mappings;
  record.contracts.mobile.root.facts[0].provenance = { kind: "figma-literal", node_id: "2:1" };
  record.contracts.desktop.root.facts[0].provenance = { kind: "figma-literal", node_id: "2:2" };
  const report = auditFigmaContractFacts({ record, live, mappings });
  assert.equal(report.ok, true, JSON.stringify(report.issues));
  assert.equal(report.source_fact_count, 2);
  assert.equal(report.mapped_contract_fact_count, 2);
});

test("a Mobile source fact cannot certify a Desktop contract fact", () => {
  const { record, packet, mappings } = fixture();
  mappings.find((item) => item.source_path === "/layout/item_spacing").contract_path =
    "/contracts/desktop/root/facts/0/value/value";
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "CONTRACT_VIEWPORT_MISMATCH"));
});

test("capture errors cannot be waived by mappings or a verification label", () => {
  const { record, packet, mappings } = fixture();
  record.figma.verification = { status: "figma-source-recorded" };
  packet.capture_errors = [{ node_id: "3:1", code: "PAINT_UNSUPPORTED" }];
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "FIGMA_CAPTURE_UNSUPPORTED"));
});

test("Figma float serialization noise is canonicalized, not a real 0.1 difference", () => {
  const { record, packet, mappings } = fixture();
  const lineHeight = {
    id: "line-height",
    value: { type: "measure", value: 140, unit: "percent" },
  };
  record.contracts.mobile.root.children[0].facts.push(lineHeight);
  packet.variants[0].source_node.children[0].text_style.line_height.value = 139.9999976158142;
  mappings.push({
    variant_node_id: "2:1", node_id: "3:1",
    source_path: "/text_style/line_height/value",
    contract_path: "/contracts/mobile/root/children/0/facts/3/value/value",
    transform: "identity",
  });
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.equal(report.issues.some((issue) =>
    issue.code === "FIGMA_CONTRACT_MISMATCH" &&
    issue.source_path === "/text_style/line_height/value"), false);
  packet.variants[0].source_node.children[0].text_style.line_height.value = 139.9;
  const changed = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(changed.issues.some((issue) =>
    issue.code === "FIGMA_CONTRACT_MISMATCH" &&
    issue.source_path === "/text_style/line_height/value"));
});

test("a packet without the approved capture profile cannot certify a component", () => {
  const { record, packet, mappings } = fixture();
  delete packet.capture_version;
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "FIGMA_CAPTURE_VERSION_UNSUPPORTED"));
});

test("Figma component property defaults are checked, not silently ignored", () => {
  const { record, packet, mappings } = fixture();
  packet.component_properties = [{
    name: "Show Alert", type: "BOOLEAN", default: true, variant_options: null,
  }];
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) =>
    issue.code === "FIGMA_FACT_UNCOVERED" &&
    issue.source_path === "/component_properties/0/default"));
});

test("caller-supplied mappings cannot certify facts absent from the component contract", () => {
  const { record, packet, mappings } = fixture();
  record.contracts.figma_fact_links = [];
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "EVIDENCE_LINKS_NOT_IN_CONTRACT"));
});


test("a migrated registry literal is not direct Figma evidence even if its value matches", () => {
  const { record, packet, mappings } = fixture();
  record.contracts.mobile.root.facts[0].provenance = { kind: "registry-literal", source_path: "legacy.md" };
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "CONTRACT_FACT_NOT_FIGMA_VERIFIED" &&
    issue.contract_path === "/contracts/mobile/root/facts/0/value/value"));
});

test("a provenance node different from the mapped Figma layer does not certify a fact", () => {
  const { record, packet, mappings } = fixture();
  record.contracts.mobile.root.children[0].facts[0].provenance = { kind: "figma-literal", node_id: "2:1" };
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.ok(report.issues.some((issue) => issue.code === "CONTRACT_FACT_NOT_FIGMA_VERIFIED" &&
    issue.contract_path === "/contracts/mobile/root/children/0/facts/0/value/value"));
});


test("mapped text, font size and color must match the live Figma values exactly", () => {
  const { record, packet, mappings } = fixture();
  const heading = packet.variants[0].source_node.children[0];
  heading.characters = "Помощь!";
  heading.text_style.font_size_px = 15;
  heading.fills[0].color = "#48494B";
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  for (const path of ["/characters", "/text_style/font_size_px", "/fills/0/color"]) {
    assert.ok(report.issues.some((issue) => issue.code === "FIGMA_CONTRACT_MISMATCH" && issue.source_path === path), path);
  }
});

test("a viewportless shared asset is checked once and may serve both viewports", () => {
  const record = {
    id: "asset-example",
    identity: { semantic_role: "asset" },
    figma: { file_key: "file-key", node_id: "1:1" },
    variants: [],
    asset_contracts: [],
    contracts: {
      mobile: { root: { facts: [], children: [] } },
      desktop: { root: { facts: [], children: [] } },
      figma_fact_links: [],
    },
  };
  const live = {
    capture_version: "1.0.0", capture_errors: [], component_properties: [],
    file_key: "file-key", component_node_id: "1:1",
    variants: [{ variant_node_id: "1:1", axes: [], source_node: { node_id: "1:1" } }],
  };
  const report = auditFigmaContractFacts({ record, live });
  assert.equal(report.ok, true, JSON.stringify(report.issues));
});

test("exported asset artwork is an image boundary, not individually mapped vector CSS", () => {
  const record = {
    id: "header-example",
    identity: { semantic_role: "email" },
    figma: { file_key: "file-key", node_id: "1:1" },
    variants: [{ node_id: "2:1" }, { node_id: "2:2" }],
    asset_contracts: [{ owner_layer_name: "logo @4x" }],
    contracts: {
      mobile: { root: { facts: [], children: [] } },
      desktop: { root: { facts: [], children: [] } },
      figma_fact_links: [],
    },
  };
  const asset = {
    node_id: "3:1", name: "logo @4x", node_type: "FRAME",
    children: [{ node_id: "4:1", name: "Vector", node_type: "VECTOR", fills: [{ type: "solid", color: "#000000" }] }],
  };
  const live = {
    capture_version: "1.0.0", capture_errors: [{ node_id: "3:1", code: "ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW" }],
    component_properties: [], file_key: "file-key", component_node_id: "1:1",
    variants: [
      { variant_node_id: "2:1", axes: [{ name: "Viewport", value: "Mobile" }], source_node: { node_id: "2:1", children: [asset] } },
      { variant_node_id: "2:2", axes: [{ name: "Viewport", value: "Desktop" }], source_node: { node_id: "2:2" } },
    ],
  };
  const report = auditFigmaContractFacts({ record, live });
  assert.equal(report.issues.some((issue) => issue.code === "FIGMA_CAPTURE_UNSUPPORTED"), false);
  assert.equal(report.issues.some((issue) => issue.node_id === "4:1"), false);
});

test("mixed text is supported when every styled segment is captured exactly", () => {
  const record = {
    id: "mixed-text", figma: { file_key: "file-key", node_id: "1:1" },
    variants: [{ node_id: "2:1" }, { node_id: "2:2" }],
    contracts: {
      mobile: { root: { facts: [], children: [] } },
      desktop: { root: { facts: [], children: [] } },
      figma_fact_links: [],
    },
  };
  const live = {
    capture_version: "1.0.0", component_properties: [],
    file_key: "file-key", component_node_id: "1:1",
    capture_errors: [{ node_id: "3:1", code: "MIXED_VALUE", field: "fontName" }],
    variants: [
      { variant_node_id: "2:1", axes: [{ name: "Viewport", value: "Mobile" }],
        source_node: { node_id: "2:1", children: [{
          node_id: "3:1", node_type: "TEXT",
          styled_text_segments: [{ start: 0, end: 1 }, { start: 1, end: 2 }],
        }] } },
      { variant_node_id: "2:2", axes: [{ name: "Viewport", value: "Desktop" }],
        source_node: { node_id: "2:2" } },
    ],
  };
  const report = auditFigmaContractFacts({ record, live });
  assert.equal(report.issues.some((issue) => issue.code === "FIGMA_CAPTURE_UNSUPPORTED"), false);
});

test("a live Mobile Accent variant may certify its exact variant_contract root fact", () => {
  const { record, packet, mappings } = fixture();
  const contractPath = "/contracts/variant_contracts/0/root/facts/0/value/value";
  record.contracts.variant_contracts = [{
    variant_node_id: "2:1",
    axes: [{ name: "Viewport", value: "Mobile" }, { name: "Style", value: "Accent" }],
    root: {
      facts: [{
        id: "gap",
        value: { type: "integer", value: 12 },
        provenance: { kind: "figma-literal", node_id: "2:1" },
      }],
      children: [],
    },
  }];
  mappings.push({
    variant_node_id: "2:1",
    node_id: "2:1",
    source_path: "/layout/item_spacing",
    contract_path: contractPath,
    transform: "identity",
  });
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.equal(report.issues.some((issue) =>
    (issue.code === "CONTRACT_TARGET_INVALID" || issue.code === "CONTRACT_FACT_UNMAPPED") &&
    issue.contract_path === contractPath), false, JSON.stringify(report.issues));
});
test("a pinned derived email fact is audited by its evidence fixture, not as a direct Figma literal", () => {
  const { record, packet, mappings } = fixture();
  record.contracts.mobile.root.facts.push({
    id: "email-render-layout-gap",
    value: { type: "measure", value: 8, unit: "px" },
    provenance: { kind: "registry-literal", source_blob_sha: "39e7a05f3383baf0d2effd27cdf9976c970f7b81" },
  });
  const report = auditFigmaContractFacts({ record, live: packet, mappings });
  assert.equal(report.issues.some((item) =>
    item.code === "CONTRACT_FACT_UNMAPPED" &&
    item.contract_path === "/contracts/mobile/root/facts/2/value/value"), false);
});