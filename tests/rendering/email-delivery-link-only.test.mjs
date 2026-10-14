import assert from "node:assert/strict";
import test from "node:test";
import { validateDeliveryDocument } from "../../scripts/lib/email-delivery.mjs";
import { collectEmailActions } from "../../scripts/lib/email-action-inventory.mjs";
import { actionModel, actionComponents, draft, inventory, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";

test("missing mailing metadata does not block final links readiness", () => {
  const document = { ...draft, subject: "", preheader: "", answers: { [inventory.fields[0].id]: "https://1cupis.ru/action" } };
  assert.deepEqual(validateDeliveryDocument({ document, inventory, profile, purpose: "final" }), []);
});

test("link-only readiness still rejects missing NPS and unsafe or test destinations", () => {
  const npsInventory = collectEmailActions({ model: actionModel({ includeNps: true }), componentIndex: actionComponents, profile });
  const answers = Object.fromEntries(npsInventory.fields.map(field => [field.id, field.id.includes("nps") ? "" : "https://1cupis.ru/action"]));
  const document = { ...draft, subject: "", inventory_digest: npsInventory.inventory_digest, answers };
  const errors = validateDeliveryDocument({ document, inventory: npsInventory, profile, purpose: "final" });
  assert.equal(errors.filter(item => item.code === "EMAIL_DELIVERY_REQUIRED_URL" && item.path.includes("nps")).length, 3);
  assert.equal(errors.some(item => /SUBJECT/.test(item.code)), false);
  for (const value of ["javascript:alert(1)", "https://user:pass@1cupis.ru", "https://example.com/test", "{arbitrary}", "https://1cupis.ru/<bad>"]) {
    const errors = validateDeliveryDocument({ document: { ...draft, subject: "", answers: { [inventory.fields[0].id]: value } }, inventory, profile, purpose: "final" });
    assert.ok(errors.some(item => /URL_INVALID|EXAMPLE_URL|TEMPLATE_INVALID/.test(item.code)), value);
  }
});

test("provided metadata retains its original validation even though it is not requested", () => {
  const document = { ...draft, subject: "Bad\nSubject", sender: { mode: "explicit", name: "Name", address: "invalid" }, answers: { [inventory.fields[0].id]: "https://1cupis.ru/action" } };
  const errors = validateDeliveryDocument({ document, inventory, profile, purpose: "final" });
  assert.ok(errors.some(item => item.code === "EMAIL_DELIVERY_SUBJECT_INVALID"));
  assert.ok(errors.some(item => item.code === "EMAIL_DELIVERY_SENDER_INVALID"));
});

test('Task10 presentation metadata does not weaken source email profile and unknown-answer gates', () => {
  const presentation = { ...inventory, fields: inventory.fields.map(field => ({ ...field, display_group: { id: 'email/card', label: 'Карточка' }, display_context: 'Бонус', viewport_hint: null })) };
  const good = { ...draft, answers: { [inventory.fields[0].id]: 'https://1cupis.ru/action' } };
  assert.deepEqual(validateDeliveryDocument({ document: good, inventory: presentation, profile, purpose: 'final', sourceSha: draft.source_sha }), []);
  for (const [change, code] of [
    [{ source_sha: 'b'.repeat(40) }, 'EMAIL_DELIVERY_SOURCE_STALE'],
    [{ email_id: 'different-letter' }, 'EMAIL_DELIVERY_EMAIL_MISMATCH'],
    [{ profile_version: '9.0.0' }, 'EMAIL_DELIVERY_PROFILE_STALE'],
    [{ answers: { ...good.answers, unknown: 'https://1cupis.ru/unknown' } }, 'EMAIL_DELIVERY_ANSWER_UNKNOWN'],
  ]) {
    const errors = validateDeliveryDocument({ document: { ...good, ...change }, inventory: { ...presentation, email_id: draft.email_id }, profile, purpose: 'final', sourceSha: draft.source_sha });
    assert.ok(errors.some(error => error.code === code), code);
  }
});
