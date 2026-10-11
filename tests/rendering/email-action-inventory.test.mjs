import assert from "node:assert/strict";
import test from "node:test";
import { collectEmailActions } from "../../scripts/lib/email-action-inventory.mjs";
import { actionComponents, actionModel, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";

test("inventory collects visible nested actions without requiring URLs", () => {
  const result = collectEmailActions({ model: actionModel(), componentIndex: actionComponents, profile });
  assert.ok(result.fields.length >= 4);
  assert.equal(result.diagnostics.some(({ code }) => /MISSING_(URL|HREF)/i.test(code)), false);
  assert.ok(result.fields.some(({ bindings }) => bindings.some(({ instance_path }) => instance_path === "email/card/cta")));
});
test("same CTA label in separate cards remains separately addressable", () => {
  const { fields } = collectEmailActions({ model: actionModel(), componentIndex: actionComponents, profile });
  const ctas = fields.filter(({ label }) => label === "Подробнее");
  assert.ok(ctas.length >= 2); assert.notEqual(ctas[0].id, ctas[1].id);
});
test("hidden actions are omitted and visible NPS contributes exactly three required fields", () => {
  const hidden = collectEmailActions({ model: actionModel({ hiddenSecondCard: true }), componentIndex: actionComponents, profile });
  assert.equal(hidden.fields.some(({ id }) => id.includes("card-2")), false);
  const nps = collectEmailActions({ model: actionModel({ includeNps: true }), componentIndex: actionComponents, profile });
  assert.equal(nps.fields.filter(({ id, required }) => id.includes("nps") && required).length, 3);
});
test("scoped mobile and desktop href values stay separate without a proven pairing", () => {
  const { fields } = collectEmailActions({ model: actionModel({ ambiguousViewport: true }), componentIndex: actionComponents, profile });
  const destinations = fields.filter(({ bindings }) => bindings.some(({ element_id, instance_path }) => element_id === "card-link" && instance_path === "email/card"));
  assert.deepEqual(destinations.map(({ bindings }) => bindings[0].viewport).sort(), ["desktop", "mobile"]);
});

test("research purpose preserves malformed model diagnostics beyond absent URLs", () => {
  const model = actionModel();
  model.root.property_values.push({ property_id: "unknown-visibility-property", scope: "all", value: true });
  const result = collectEmailActions({ model, componentIndex: actionComponents, profile });
  assert.ok(result.diagnostics.some(({ code }) => /PROPERTY|UNKNOWN/i.test(code)));
});

