import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

import { auditFigmaContractFacts } from "../../scripts/lib/figma-contract-facts.mjs";

const STYLE_ID = "S:780f997658bfc56dc4db512b20c92d16c415c3f3,";
const CAPTURE_PATH = new URL("../../scripts/figma/capture-contract-source.js", import.meta.url);

async function captureWith(figma) {
  const source = await readFile(CAPTURE_PATH, "utf8");
  const context = vm.createContext({ figma });
  new vm.Script(`${source}\nglobalThis.__capture = captureFigmaContractFacts;`).runInContext(context);
  return JSON.parse(JSON.stringify(await context.__capture("1:1")));
}

function textNode(overrides = {}) {
  return {
    type: "TEXT", id: "2:1", name: "Label", visible: true, width: 110, height: 20,
    fills: [], strokes: [], opacity: 1, rotation: 0, characters: "Какая-то кнопка",
    fontName: { family: "Roboto", style: "Medium" }, fontWeight: 500, fontSize: 14,
    lineHeight: { unit: "PERCENT", value: 140 }, letterSpacing: { unit: "PERCENT", value: 0 },
    textAlignHorizontal: "CENTER", textAlignVertical: "TOP", textCase: "ORIGINAL",
    textDecoration: "NONE", textAutoResize: "HEIGHT", textStyleId: STYLE_ID,
    ...overrides,
  };
}

function component(children = [textNode()], overrides = {}) {
  return {
    type: "COMPONENT", id: "1:1", name: "Button/Primary", visible: true,
    width: 230, height: 44, minWidth: 230,
    fills: [{
      type: "GRADIENT_LINEAR", visible: true, opacity: 1,
      gradientStops: [
        { position: 0, color: { r: 24 / 255, g: 176 / 255, b: 55 / 255, a: 1 } },
        { position: 1, color: { r: 61 / 255, g: 213 / 255, b: 92 / 255, a: 1 } },
      ],
      gradientTransform: [[1, 0, 0], [0, 1, 0]],
    }],
    strokes: [], opacity: 1, rotation: 0, children,
    ...overrides,
  };
}

function componentSet() {
  const mobile = component([textNode({ id: "2:mobile" })], {
    id: "1:mobile", name: "Viewport=Mobile", variantProperties: { Viewport: "Mobile" }, minWidth: 230,
  });
  const desktop = component([textNode({ id: "2:desktop" })], {
    id: "1:desktop", name: "Viewport=Desktop", variantProperties: { Viewport: "Desktop" }, minWidth: 0,
  });
  return {
    type: "COMPONENT_SET", id: "1:1", name: "Button/Primary", visible: true,
    width: 230, height: 44, children: [mobile, desktop], componentPropertyDefinitions: {},
  };
}

function fakeFigma({
  node = component(),
  styles = new Map([[STYLE_ID, { id: STYLE_ID, type: "TEXT", name: "Mobile/Action", fontWeight: 400 }]]),
  mixed = Symbol("mixed"),
} = {}) {
  const styleIds = [];
  return {
    figma: {
      fileKey: "test-file", mixed,
      async getNodeByIdAsync(id) { return id === "1:1" ? node : null; },
      async getStyleByIdAsync(id) {
        styleIds.push(id);
        const result = styles.get(id);
        if (result instanceof Error) throw result;
        return result ?? null;
      },
    },
    styleIds,
  };
}

function mappedRecord() {
  const values = ["HEIGHT", "TOP", 500, "Mobile/Action", 230, "#18B037", "#3DD55C"];
  const paths = [
    "/text_geometry/auto_resize", "/text_geometry/vertical_alignment",
    "/text_style/font_weight", "/text_style/figma_style_name", "/minimum_width_px",
    "/fills/0/stops/0/color", "/fills/0/stops/1/color",
  ];
  const facts = values.map((value, index) => ({
    id: `fact-${index}`, value: { type: typeof value === "number" ? "number" : "string", value },
    provenance: { kind: "figma-literal", node_id: index === 4 || index > 4 ? "1:1" : "2:1" },
  }));
  const figma_fact_links = paths.map((source_path, index) => ({
    variant_node_id: "1:1", node_id: index === 4 || index > 4 ? "1:1" : "2:1", source_path,
    contract_path: `/contracts/mobile/root/facts/${index}/value/value`, transform: "identity",
  }));
  return {
    id: "button-primary", figma: { file_key: "test-file", node_id: "1:1" }, variants: [{ node_id: "1:1" }],
    contracts: {
      figma_fact_links,
      mobile: { root: { facts, children: [] } },
      desktop: { root: { facts: [], children: [] } },
    },
  };
}

test("capture preserves v1 fields while adding exact geometry, local weight, style name, min-width, and gradient stops", async () => {
  const fake = fakeFigma();
  const packet = await captureWith(fake.figma);
  const root = packet.variants[0].source_node;
  const label = root.children[0];
  assert.deepEqual(label.text_geometry, { auto_resize: "HEIGHT", vertical_alignment: "TOP" });
  assert.equal(label.text_style.font_weight, 500);
  assert.equal(label.text_style.figma_style_name, "Mobile/Action");
  assert.equal(root.minimum_width_px, 230);
  assert.deepEqual(root.fills[0].stops.map(({ color }) => color), ["#18B037", "#3DD55C"]);
  assert.equal(label.text_style.text_auto_resize, "HEIGHT");
  assert.equal(label.text_style.vertical_alignment, "TOP");
  assert.equal(label.text_style.horizontal_alignment, "CENTER");
  assert.equal(root.fills[0].gradient_stops.length, 2);
  assert.deepEqual(fake.styleIds, [STYLE_ID]);
});

test("capture preserves both variants in Figma order and distinguishes min-width zero, null, and absent", async () => {
  const paired = await captureWith(fakeFigma({ node: componentSet() }).figma);
  assert.deepEqual(paired.variants.map(({ variant_node_id }) => variant_node_id), ["1:mobile", "1:desktop"]);
  assert.equal(paired.variants[0].source_node.minimum_width_px, 230);
  assert.equal(paired.variants[1].source_node.minimum_width_px, 0);
  const nullable = await captureWith(fakeFigma({ node: component([], { minWidth: null }) }).figma);
  assert.equal(nullable.variants[0].source_node.minimum_width_px, null);
  const absentNode = component();
  delete absentNode.minWidth;
  const absent = await captureWith(fakeFigma({ node: absentNode }).figma);
  assert.equal(Object.hasOwn(absent.variants[0].source_node, "minimum_width_px"), false);
});

test("added capture paths satisfy their exact owned mappings and still report a changed local value", async () => {
  const packet = await captureWith(fakeFigma().figma);
  const record = mappedRecord();
  const baseline = auditFigmaContractFacts({ record, live: packet });
  const addedPaths = new Set(record.contracts.figma_fact_links.map(({ source_path }) => source_path));
  assert.equal(baseline.issues.some((issue) => issue.code === "FIGMA_SOURCE_PATH_MISSING" && addedPaths.has(issue.source_path)), false);
  record.contracts.mobile.root.facts[2].value.value = 400;
  const changed = auditFigmaContractFacts({ record, live: packet });
  assert.ok(changed.issues.some((issue) => issue.code === "FIGMA_CONTRACT_MISMATCH" && issue.source_path === "/text_style/font_weight"));
});

test("capture keeps style lookup failure and unresolved style explicit and serializable", async () => {
  const unresolved = await captureWith(fakeFigma({ styles: new Map([[STYLE_ID, null]]) }).figma);
  const failed = await captureWith(fakeFigma({ styles: new Map([[STYLE_ID, new Error("denied")]]) }).figma);
  for (const [packet, code] of [[unresolved, "TEXT_STYLE_UNRESOLVED"], [failed, "TEXT_STYLE_LOOKUP_FAILED"]]) {
    const label = packet.variants[0].source_node.children[0];
    assert.equal(label.text_style.figma_style_name, null);
    assert.ok(packet.capture_errors.some((error) => error.code === code && error.node_id === "2:1"));
    assert.doesNotThrow(() => JSON.stringify(packet));
  }
});

test("capture leaves unlinked style IDs unguessed and resolves local font weight from the node", async () => {
  const unlinked = await captureWith(fakeFigma({ node: component([textNode({ textStyleId: "" })]) }).figma);
  const unlinkedText = unlinked.variants[0].source_node.children[0].text_style;
  assert.equal(unlinkedText.figma_style_id, "");
  assert.equal(unlinkedText.figma_style_name, null);
  const override = await captureWith(fakeFigma().figma);
  assert.equal(override.variants[0].source_node.children[0].text_style.font_weight, 500);
});

test("capture does not guess mixed font weight or mixed style ID", async () => {
  const mixed = Symbol("mixed");
  const packet = await captureWith(fakeFigma({ mixed, node: component([textNode({ fontWeight: mixed, textStyleId: mixed })]) }).figma);
  const label = packet.variants[0].source_node.children[0];
  assert.equal(label.text_style.font_weight, null);
  assert.equal(label.text_style.figma_style_id, null);
  assert.equal(label.text_style.figma_style_name, null);
  for (const field of ["fontWeight", "textStyleId"]) {
    assert.ok(packet.capture_errors.some((error) => error.code === "MIXED_VALUE" && error.node_id === "2:1" && error.field === field), field);
  }
  assert.doesNotThrow(() => JSON.stringify(packet));
});