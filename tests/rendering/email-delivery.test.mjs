import assert from "node:assert/strict";
import test from "node:test";
import { projectDeliveryBindings, validateDeliveryDocument } from "../../scripts/lib/email-delivery.mjs";
import { actionModel, draft, inventory, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";

test("final readiness rejects stale inventories, missing required URLs, and example domains", () => {
  assert.ok(validateDeliveryDocument({ document: { ...draft, inventory_digest: "stale" }, inventory, profile, purpose: "final" }).some(item => /STALE|DIGEST/i.test(item.code)));
  assert.ok(validateDeliveryDocument({ document: draft, inventory, profile, purpose: "final" }).some(item => /REQUIRED/i.test(item.code)));
  assert.ok(validateDeliveryDocument({ document: { ...draft, answers: { [inventory.fields[0].id]: "https://example.com/test" } }, inventory, profile, purpose: "final" }).some(item => /EXAMPLE/i.test(item.code)));
});

test("managed values cannot be overridden and projection does not mutate the original model", () => {
  const model = actionModel();
  const original = structuredClone(model);
  const document = { ...draft, answers: { [inventory.fields[0].id]: "https://valid.test/path", logo: "https://attacker.test" } };
  assert.ok(validateDeliveryDocument({ document, inventory, profile, purpose: "final" }).some(item => /MANAGED|UNKNOWN/i.test(item.code)));
  const result = projectDeliveryBindings({ model, document: { ...document, answers: { [inventory.fields[0].id]: "https://valid.test/path" } }, inventory, profile });
  assert.deepEqual(model, original);
  assert.notStrictEqual(result.model, model);
});
