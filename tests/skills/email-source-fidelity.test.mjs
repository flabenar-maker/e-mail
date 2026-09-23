import assert from "node:assert/strict";
import test from "node:test";

import { verifyEmailModelSource } from "../../scripts/lib/email-source-fidelity.mjs";

const variants = { mobile: "mobile", desktop: "desktop" };
const plain = (value) => ({ type: "plain-text", value });
const empty = (instance_id, component_id) => ({
  instance_id, component_id, variants,
  property_values: [], content_values: [], asset_files: [], slots: [],
});

function scenario() {
  const root = empty("letter", "email-template");
  const a = empty("a", "block-sample");
  const b = empty("b", "block-sample");
  const aChild = empty("a-child", "item-sample");
  const bChild = empty("b-child", "item-sample");
  for (const [block, name] of [[a, "A"], [b, "B"]]) {
    block.property_values.push({ property_id: "show-body", scope: "all", value: false });
    block.content_values.push(
      { element_id: "mobile-title", slot_id: "text", scope: "mobile", value: plain(`${name} mobile`) },
      { element_id: "desktop-title", slot_id: "text", scope: "desktop", value: plain(`${name} desktop`) },
    );
    block.asset_files.push({ asset_contract_id: "photo", path: `images/photo-${name.toLowerCase()}.jpg` });
  }
  aChild.content_values.push({ element_id: "label", slot_id: "text", scope: "all", value: plain("first") });
  bChild.content_values.push({ element_id: "label", slot_id: "text", scope: "all", value: plain("second") });
  a.nested_components = [{ element_id: "child", instance: aChild }];
  b.nested_components = [{ element_id: "child", instance: bChild }];
  root.slots = [{ element_id: "content", instances: [a, b] }];

  const readings = {
    capture_id: "capture-1", file_key: "design-file", complete: true, captured_at: "2026-09-23T12:00:00Z",
    selection: { mobile: { root_node_id: "m-root", terminal: true, truncated: false }, desktop: { root_node_id: "d-root", terminal: true, truncated: false } },
    instances: [], fields: [], assets: [],
  };
  const correspondence = { capture_id: "capture-1", file_key: "design-file", instances: [], fields: [], assets: [] };
  for (const viewport of ["mobile", "desktop"]) {
    const prefix = viewport === "mobile" ? "m" : "d";
    readings.instances.push(
      { viewport, node_id: `${prefix}-root`, parent_node_id: null, order: 0, relation: null },
      { viewport, node_id: `${prefix}-a`, parent_node_id: `${prefix}-root`, order: 0, relation: { kind: "slot", element_id: "content" } },
      { viewport, node_id: `${prefix}-b`, parent_node_id: `${prefix}-root`, order: 1, relation: { kind: "slot", element_id: "content" } },
      { viewport, node_id: `${prefix}-a-child`, parent_node_id: `${prefix}-a`, order: 0, relation: { kind: "nested", element_id: "child" } },
      { viewport, node_id: `${prefix}-b-child`, parent_node_id: `${prefix}-b`, order: 0, relation: { kind: "nested", element_id: "child" } },
    );
    for (const [id, name, order] of [["a", "A", 0], ["b", "B", 1]]) {
      readings.fields.push(
        { viewport, node_id: `${prefix}-${id}-title`, owner_node_id: `${prefix}-${id}`, field: "characters", value: `${name} ${viewport}` },
        { viewport, node_id: `${prefix}-${id}`, owner_node_id: `${prefix}-${id}`, field: "componentProperty:Show Body", value: false },
      );
      correspondence.fields.push(
        { instance_id: id, kind: "content", element_id: `${viewport}-title`, slot_id: "text", viewport, node_id: `${prefix}-${id}-title`, field: "characters", origin: "figma" },
        { instance_id: id, kind: "property", property_id: "show-body", viewport, node_id: `${prefix}-${id}`, field: "componentProperty:Show Body", origin: "figma" },
      );
      assert.equal(order, id === "a" ? 0 : 1);
    }
    for (const [id, value] of [["a-child", "first"], ["b-child", "second"]]) {
      readings.fields.push({ viewport, node_id: `${prefix}-${id}-label`, owner_node_id: `${prefix}-${id}`, field: "characters", value });
      correspondence.fields.push({ instance_id: id, kind: "content", element_id: "label", slot_id: "text", viewport, node_id: `${prefix}-${id}-label`, field: "characters", origin: "figma" });
    }
  }
  for (const id of ["letter", "a", "b", "a-child", "b-child"]) {
    correspondence.instances.push({ instance_id: id, nodes: { mobile: `m-${id === "letter" ? "root" : id}`, desktop: `d-${id === "letter" ? "root" : id}` } });
  }
  const assetEvidence = [];
  for (const id of ["a", "b"]) {
    const node_id = `d-${id}-asset`;
    const evidence_id = `export-${id}`;
    readings.assets.push({ viewport: "desktop", node_id, owner_node_id: `d-${id}`, evidence_id });
    correspondence.assets.push({ instance_id: id, asset_contract_id: "photo", viewport: "desktop", node_id });
    assetEvidence.push({ instance_id: id, asset_contract_id: "photo", path: `images/photo-${id}.jpg`, mcp_export: { source_node_id: node_id, evidence_id, capture_id: "capture-1", file_key: "design-file" } });
  }
  return {
    model: { schema_version: "1.1.0", id: "source-check", metadata: { language: "ru", direction: "ltr" }, root },
    readings, correspondence, assetEvidence, authorizedInputs: [],
  };
}

function codes(input) {
  return verifyEmailModelSource(input).map(({ code }) => code);
}

test("independent source readings confirm a valid pair with distinct viewport element IDs and repeated children", () => {
  assert.deepEqual(verifyEmailModelSource(scenario()), []);
});

test("missing content and asset are reported before render with instance paths", () => {
  const input = scenario();
  const a = input.model.root.slots[0].instances[0];
  a.content_values.splice(0, 1);
  a.asset_files.splice(0, 1);
  const diagnostics = verifyEmailModelSource(input);
  assert.ok(diagnostics.some(({ code, path }) => code === "EMAIL_SOURCE_CONTENT_MISSING" && path.includes("/instances/0/content_values")));
  assert.ok(diagnostics.some(({ code, path }) => code === "EMAIL_SOURCE_ASSET_MISSING" && path.includes("/instances/0/asset_files")));
});

test("a schema-valid text change fails source correspondence", () => {
  const input = scenario();
  input.model.root.slots[0].instances[0].content_values[0].value.value = "plausible but wrong";
  const diagnostics = verifyEmailModelSource(input);
  assert.ok(diagnostics.some(({ code, path, message }) => code === "EMAIL_SOURCE_VALUE_MISMATCH" && path.includes("/content_values/0") && message.includes("mobile")));
});

test("false-to-true property mutation identifies viewport", () => {
  const input = scenario();
  input.model.root.slots[0].instances[0].property_values[0].value = true;
  assert.ok(verifyEmailModelSource(input).some(({ code, message }) => code === "EMAIL_SOURCE_VALUE_MISMATCH" && message.includes("mobile")));
});

test("same-type blocks swapped in the root slot fail source order", () => {
  const input = scenario();
  input.model.root.slots[0].instances.reverse();
  assert.ok(codes(input).includes("EMAIL_SOURCE_ORDER_MISMATCH"));
});

test("swapped asset receipts fail concrete source-owner comparison", () => {
  const input = scenario();
  [input.assetEvidence[0].mcp_export, input.assetEvidence[1].mcp_export] = [input.assetEvidence[1].mcp_export, input.assetEvidence[0].mcp_export];
  assert.ok(codes(input).includes("EMAIL_SOURCE_ASSET_OWNER_MISMATCH"));
});

test("a nested child lifted into the root slot fails placement comparison", () => {
  const input = scenario();
  const a = input.model.root.slots[0].instances[0];
  input.model.root.slots[0].instances.push(a.nested_components.pop().instance);
  assert.ok(codes(input).includes("EMAIL_SOURCE_PARENT_MISMATCH"));
});

test("two identical nested types retain independent content", () => {
  const input = scenario();
  input.model.root.slots[0].instances[1].nested_components[0].instance.content_values[0].value.value = "first";
  assert.ok(codes(input).includes("EMAIL_SOURCE_VALUE_MISMATCH"));
});

test("all scope cannot hide a one-sided source element", () => {
  const input = scenario();
  const a = input.model.root.slots[0].instances[0];
  a.content_values = a.content_values.filter(({ scope }) => scope !== "desktop");
  a.content_values[0].scope = "all";
  assert.ok(codes(input).includes("EMAIL_SOURCE_TARGET_MISSING"));
});

test("inline styling absent from the model is diagnosed rather than flattened", () => {
  const input = scenario();
  input.readings.fields.find(({ node_id }) => node_id === "m-a-title").inline_runs = [{ start: 0, end: 1, decoration: "underline" }];
  assert.ok(codes(input).includes("EMAIL_SOURCE_INLINE_UNSUPPORTED"));
});

test("missing, incomplete, and stale evidence never pass", () => {
  const absent = scenario();
  delete absent.readings;
  assert.ok(codes(absent).includes("EMAIL_SOURCE_EVIDENCE_MISSING"));
  const incomplete = scenario();
  incomplete.readings.complete = false;
  assert.ok(codes(incomplete).includes("EMAIL_SOURCE_EVIDENCE_INCOMPLETE"));
  const stale = scenario();
  stale.correspondence.capture_id = "capture-old";
  assert.ok(codes(stale).includes("EMAIL_SOURCE_EVIDENCE_STALE"));
});


test("unclaimed source text and asset require an explicit exclusion", () => {
  const textInput = scenario();
  textInput.readings.fields.push({ viewport: "mobile", node_id: "m-extra", owner_node_id: "m-a", field: "characters", value: "unrepresented" });
  assert.ok(codes(textInput).includes("EMAIL_SOURCE_FIELD_UNREPRESENTED"));
  const assetInput = scenario();
  assetInput.readings.assets.push({ viewport: "desktop", node_id: "d-extra", owner_node_id: "d-a", evidence_id: "export-extra" });
  assert.ok(codes(assetInput).includes("EMAIL_SOURCE_ASSET_UNREPRESENTED"));
});

test("identical repeated content cannot be swapped between Figma owners", () => {
  const input = scenario();
  const children = input.model.root.slots[0].instances.map((block) => block.nested_components[0].instance);
  children[1].content_values[0].value.value = "first";
  for (const field of input.readings.fields.filter(({ node_id }) => node_id.endsWith("-b-child-label"))) field.value = "first";
  for (const viewport of ["mobile", "desktop"]) {
    const fields = input.correspondence.fields.filter((item) => item.kind === "content" && item.element_id === "label" && item.viewport === viewport);
    [fields[0].node_id, fields[1].node_id] = [fields[1].node_id, fields[0].node_id];
  }
  assert.ok(codes(input).includes("EMAIL_SOURCE_OWNER_MISMATCH"));
});

test("asset correspondence and receipt swapped together still fail independent owner", () => {
  const input = scenario();
  const first = input.correspondence.assets[0];
  const second = input.correspondence.assets[1];
  [first.node_id, second.node_id] = [second.node_id, first.node_id];
  [input.assetEvidence[0].mcp_export, input.assetEvidence[1].mcp_export] = [input.assetEvidence[1].mcp_export, input.assetEvidence[0].mcp_export];
  assert.ok(codes(input).includes("EMAIL_SOURCE_ASSET_OWNER_MISMATCH"));
});

test("missing or stale asset capture identifiers do not establish freshness", () => {
  const absent = scenario();
  delete absent.readings.assets[0].evidence_id;
  delete absent.assetEvidence[0].mcp_export.evidence_id;
  assert.ok(codes(absent).includes("EMAIL_SOURCE_ASSET_EVIDENCE_MISSING"));
  const stale = scenario();
  stale.assetEvidence[0].mcp_export.capture_id = "capture-old";
  assert.ok(codes(stale).includes("EMAIL_SOURCE_EVIDENCE_STALE"));
});

test("slot-vs-nested relationship and source scope are verified", () => {
  const relation = scenario();
  relation.readings.instances.find(({ node_id }) => node_id === "m-a").relation = { kind: "nested", element_id: "content" };
  assert.ok(codes(relation).includes("EMAIL_SOURCE_RELATION_MISMATCH"));
  const scope = scenario();
  scope.readings.selection.mobile.terminal = false;
  assert.ok(codes(scope).includes("EMAIL_SOURCE_EVIDENCE_INCOMPLETE"));
});

test("duplicate source or correspondence keys cannot be silently overwritten", () => {
  const source = scenario();
  source.readings.fields.push({ ...source.readings.fields[0] });
  assert.ok(codes(source).includes("EMAIL_SOURCE_DUPLICATE"));
  const mapped = scenario();
  mapped.correspondence.fields.push({ ...mapped.correspondence.fields[0] });
  assert.ok(codes(mapped).includes("EMAIL_SOURCE_DUPLICATE"));
});
