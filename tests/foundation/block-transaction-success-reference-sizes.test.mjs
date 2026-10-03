import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const servicePath = new URL("../../data/components/service.yaml", import.meta.url);
const expected = new Map([
  ["459:27425", { viewport: "desktop", width: 251, sizing: ["fill", "hug"] }],
  ["459:27428", { viewport: "desktop", width: 117, sizing: ["hug", "fill"] }],
  ["459:29356", { viewport: "desktop", width: 117, sizing: ["hug", "hug"] }],
  ["459:29376", { viewport: "mobile", width: 94, sizing: ["hug", "hug"] }],
]);

function indexedReferenceFacts(root) {
  const byNode = new Map();
  const visit = (element) => {
    const reference = element.facts?.find(({ id }) => id === "reference-size");
    if (reference?.provenance?.node_id) {
      byNode.set(reference.provenance.node_id, {
        width: reference.value.width,
        unit: reference.value.unit,
        sizing: ["horizontal-sizing", "vertical-sizing"].map((id) =>
          element.facts.find((fact) => fact.id === id)?.value?.value,
        ),
      });
    }
    for (const child of element.children ?? []) visit(child);
  };
  visit(root);
  return byNode;
}

test("Block/Transaction-Success F2 reference widths change without changing native sizing", async () => {
  const service = JSON.parse(await readFile(servicePath, "utf8"));
  const component = service.components.find(({ id }) => id === "block-transaction-success");
  assert.ok(component, "fixture must contain Block/Transaction-Success");

  for (const [nodeId, expectation] of expected) {
    const actual = indexedReferenceFacts(component.contracts[expectation.viewport].root).get(nodeId);
    assert.ok(actual, `missing reference-size fact for ${nodeId}`);
    assert.equal(actual.width, expectation.width, `${nodeId} exact approved F2 width`);
    assert.equal(actual.unit, "px", `${nodeId} remains a pixel reference size`);
    assert.deepEqual(actual.sizing, expectation.sizing, `${nodeId} native sizing remains unchanged`);
  }
});
