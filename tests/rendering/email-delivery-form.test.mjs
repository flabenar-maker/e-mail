import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { createDeliveryDraft, renderDeliveryForm } from "../../scripts/lib/email-delivery-form.mjs";
import { inventory, draft, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";

const managedFields = profile.roles.filter(({ href }) => href).map((role) => ({
  id: `managed/${role.id}`, label: role.label, block_label: role.component_id, instance_label: role.id,
  kind: "url", required: true, managed: true, value: role.href, bindings: role.bindings
}));

test("draft defaults metadata without asking for new text or replacing it with body headings", () => {
  const document = createDeliveryDraft({ emailId: draft.email_id, sourceSha: draft.source_sha, profile, inventory });
  assert.equal(document.subject, ""); assert.equal(document.preheader, "");
  assert.deepEqual(document.sender, { mode: "inherit" }); assert.deepEqual(document.reply_to, { mode: "inherit" });
  assert.deepEqual(document.plain_text, { mode: "auto" });
});

test("draft preserves already provided metadata and current known answers", () => {
  const deliveryMetadata = { ...draft, subject: "Согласованная тема", sender: { mode: "explicit", name: "ЦУПИС", address: "info@1cupis.ru" }, plain_text: { mode: "manual", value: "Готовый текст" }, answers: { [inventory.fields[0].id]: "https://1cupis.ru/action" } };
  const document = createDeliveryDraft({ emailId: draft.email_id, sourceSha: draft.source_sha, profile, inventory, deliveryMetadata });
  for (const key of ["subject", "preheader", "sender", "reply_to", "plain_text", "answers"]) assert.deepEqual(document[key], deliveryMetadata[key]);
  assert.notStrictEqual(document.sender, deliveryMetadata.sender);
});

test("form requests only missing action links; known, managed and non-link content are not inputs", () => {
  const missing = { ...inventory.fields[0], id: "missing", label: "<img src=x onerror=1>", block_label: "Бонусная карта" };
  const known = { ...inventory.fields[0], id: "known", value: "https://1cupis.ru/action" };
  const answered = { ...inventory.fields[0], id: "answered" };
  const html = renderDeliveryForm({ inventory: { ...inventory, fields: [missing, known, answered, ...managedFields] }, deliveryDraft: { ...draft, answers: { answered: "https://1cupis.ru/saved" } } });
  assert.match(html, /Ссылки в письме/); assert.match(html, /Бонусная карта/);
  assert.equal((html.match(/<input\b/g) ?? []).length, 1);
  for (const id of ["subject", "preheader", "sender-name", "sender-address", "reply_to-name", "reply_to-address", "plain-text", "text-auto", "alt", "model"]) assert.doesNotMatch(html, new RegExp('id="' + id + '"'));
  assert.equal(html.includes("<img src=x onerror=1>"), false);
  assert.equal(/\b(fetch|XMLHttpRequest|navigator\.sendBeacon)\b/.test(html), false);
});

test("submitting missing links preserves known metadata, managed and existing links", () => {
  const existing = { ...inventory.fields[0], id: "existing", value: "https://1cupis.ru/existing" };
  const fields = [...inventory.fields, existing, ...managedFields];
  const document = createDeliveryDraft({ emailId: draft.email_id, sourceSha: draft.source_sha, profile, inventory: { ...inventory, fields }, deliveryMetadata: { ...draft, sender: { mode: "explicit", name: "ЦУПИС", address: "info@1cupis.ru" } } });
  const html = renderDeliveryForm({ inventory: { ...inventory, fields }, deliveryDraft: document });
  const state = JSON.parse(html.match(/id="delivery-state">([\s\S]*?)<\/script>/)[1]);
  const script = html.match(/<\/script><script>([\s\S]*?)<\/script>/)[1];
  let submit, saved;
  const context = { structuredClone, document: { getElementById(id) { if (id === "delivery-state") return { textContent: JSON.stringify(state) }; if (id === "delivery-form") return { addEventListener(name, callback) { submit = callback; } }; if (id === "status") return {}; if (id === "link-0") return { value: "https://1cupis.ru/new" }; throw new Error("Unexpected user text control: " + id); }, createElement() { return { click() {} }; } }, Blob: class { constructor(parts) { saved = JSON.parse(parts.join("")); } }, URL: { createObjectURL() { return "blob:local"; }, revokeObjectURL() {} } };
  vm.runInNewContext(script, context); submit({ preventDefault() {} });
  for (const key of ["subject", "preheader", "sender", "reply_to", "plain_text"]) assert.deepEqual(saved[key], document[key]);
  assert.equal(saved.answers[inventory.fields[0].id], "https://1cupis.ru/new");
  assert.equal(saved.answers.existing, existing.value);
  for (const field of managedFields) assert.equal(saved.answers[field.id], field.value);
});

test("form with no missing links contains no editable controls or answer-save prompt", () => {
  const html = renderDeliveryForm({ inventory: { ...inventory, fields: managedFields }, deliveryDraft: draft });
  assert.doesNotMatch(html, /<input\b|<textarea\b|type="submit"/);
  assert.match(html, /Все ссылки уже заданы/);
});
