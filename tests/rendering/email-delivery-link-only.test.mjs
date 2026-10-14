import assert from "node:assert/strict";
import test from "node:test";
import { validateDeliveryDocument } from "../../scripts/lib/email-delivery.mjs";
import { collectEmailActions } from "../../scripts/lib/email-action-inventory.mjs";
import { actionModel, actionComponents, draft, inventory, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";

test("final Altcraft release requires an explicit subject while preview can omit it", () => {
  const document = { ...draft, subject: "", preheader: "", answers: { [inventory.fields[0].id]: "https://1cupis.ru/action" } };
  assert.deepEqual(validateDeliveryDocument({ document, inventory, profile, purpose: "preview" }), []);
  assert.ok(validateDeliveryDocument({ document, inventory, profile, purpose: "final" }).some(item => item.code === "EMAIL_DELIVERY_SUBJECT_REQUIRED" && item.path === "/subject"));
  assert.ok(validateDeliveryDocument({ document: { ...document, subject: "   " }, inventory, profile, purpose: "final" }).some(item => item.code === "EMAIL_DELIVERY_SUBJECT_REQUIRED"));
  assert.deepEqual(validateDeliveryDocument({ document: { ...document, subject: "Отдельная тема" }, inventory, profile, purpose: "final" }), []);
});

test("link-only readiness still rejects missing NPS and unsafe or test destinations", () => {
  const npsInventory = collectEmailActions({ model: actionModel({ includeNps: true }), componentIndex: actionComponents, profile });
  const answers = Object.fromEntries(npsInventory.fields.map(field => [field.id, field.id.includes("nps") ? "" : "https://1cupis.ru/action"]));
  const document = { ...draft, subject: "", inventory_digest: npsInventory.inventory_digest, answers };
  const errors = validateDeliveryDocument({ document, inventory: npsInventory, profile, purpose: "final" });
  assert.equal(errors.filter(item => item.code === "EMAIL_DELIVERY_REQUIRED_URL" && item.path.includes("nps")).length, 3);
  assert.ok(errors.some(item => item.code === "EMAIL_DELIVERY_SUBJECT_REQUIRED"));
  for (const value of ["javascript:alert(1)", "https://user:pass@1cupis.ru", "https://example.com/test", "{arbitrary}", "https://1cupis.ru/<bad>"]) {
    const errors = validateDeliveryDocument({ document: { ...draft, subject: "Отдельная тема", answers: { [inventory.fields[0].id]: value } }, inventory, profile, purpose: "final" });
    assert.ok(errors.some(item => /URL_INVALID|EXAMPLE_URL|TEMPLATE_INVALID/.test(item.code)), value);
  }
});

test("provided metadata retains its original validation even though it is not requested", () => {
  const document = { ...draft, subject: "Bad\nSubject", sender: { mode: "explicit", name: "Name", address: "invalid" }, answers: { [inventory.fields[0].id]: "https://1cupis.ru/action" } };
  const errors = validateDeliveryDocument({ document, inventory, profile, purpose: "final" });
  assert.ok(errors.some(item => item.code === "EMAIL_DELIVERY_SUBJECT_INVALID"));
  assert.ok(errors.some(item => item.code === "EMAIL_DELIVERY_SENDER_INVALID"));
});
