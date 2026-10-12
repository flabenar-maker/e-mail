import assert from "node:assert/strict";
import test from "node:test";
import { createDeliveryDraft } from "../../scripts/lib/email-delivery-form.mjs";
import { inventory, draft, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";

test("regenerating intake after a visibility digest change preserves metadata and discards stale answers", () => {
  const current = { ...inventory, inventory_digest: "new-visible-mask", fields: inventory.fields.map(field => ({ ...field, value: "" })) };
  const previous = { ...draft, subject: "Существующая тема", answers: { [inventory.fields[0].id]: "https://1cupis.ru/old-target" } };
  const document = createDeliveryDraft({ emailId: draft.email_id, sourceSha: draft.source_sha, inventory: current, profile, deliveryMetadata: previous });
  assert.equal(document.subject, previous.subject);
  assert.equal(document.inventory_digest, current.inventory_digest);
  assert.equal(document.answers[inventory.fields[0].id], "");
});

test("previous answers from another source revision do not replace a current source link", () => {
  const current = { ...inventory, fields: inventory.fields.map(field => ({ ...field, value: "https://1cupis.ru/current" })) };
  const previous = { ...draft, source_sha: "b".repeat(40), answers: { [inventory.fields[0].id]: "https://1cupis.ru/old-target" } };
  const document = createDeliveryDraft({ emailId: draft.email_id, sourceSha: draft.source_sha, inventory: current, profile, deliveryMetadata: previous });
  assert.equal(document.source_sha, draft.source_sha);
  assert.equal(document.answers[inventory.fields[0].id], "https://1cupis.ru/current");
});
