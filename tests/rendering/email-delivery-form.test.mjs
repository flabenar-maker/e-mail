import assert from "node:assert/strict";
import test from "node:test";
import { createDeliveryDraft, renderDeliveryForm } from "../../scripts/lib/email-delivery-form.mjs";
import { inventory, draft, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";

const managedFields = profile.roles.filter(({ href }) => href).map((role) => ({
  id: `managed/${role.id}`, label: role.label, block_label: role.component_id, instance_label: role.id,
  kind: "url", required: true, managed: true, value: role.href, bindings: role.bindings
}));

test("draft preserves explicit inheritance instead of writing an empty sender override", () => {
  const document = createDeliveryDraft({ emailId: draft.email_id, sourceSha: draft.source_sha, profile, inventory });
  assert.equal(document.sender.mode, "inherit"); assert.equal(document.reply_to.mode, "inherit");
});
test("Russian form pre-fills managed visible owner fields, escapes values, and contains no network request mechanism", () => {
  const fields = [...inventory.fields, ...managedFields, { ...inventory.fields[0], id: "unsafe", label: "<img src=x onerror=1>" }];
  const html = renderDeliveryForm({ inventory: { ...inventory, fields }, deliveryDraft: draft });
  assert.match(html, /Параметры письма/); assert.match(html, /Ссылки в письме/);
  assert.match(html, /https:\/\/1cupis\.ru/); assert.match(html, /\{unsubscribe\}/); assert.match(html, /533879077140969685/);
  assert.equal(html.includes("<img src=x onerror=1>"), false);
  assert.equal(/\b(fetch|XMLHttpRequest|navigator\.sendBeacon)\b/.test(html), false);
});
