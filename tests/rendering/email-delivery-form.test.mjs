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

function task10VisibleText(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, '').replace(/<[^>]+>/gu, ' ').replace(/&lt;/gu, '<').replace(/&gt;/gu, '>').replace(/&quot;/gu, '"').replace(/&#39;/gu, "'").replace(/&amp;/gu, '&').replace(/\s+/gu, ' ').trim();
}
function task10FormFixture() {
  const pending = ['owner-a/opaque-role-alpha', 'owner-b/opaque-role-beta'].map((id, index) => ({ ...structuredClone(inventory.fields[0]), id, block_label: 'LEGACY_BLOCK_DIAGNOSTIC', instance_label: 'Экземпляр TECHNICAL_INSTANCE', label: 'Подробнее', display_group: { id: `email/block-${index}`, label: 'Акции' }, display_context: index === 0 ? 'Первый бонус' : 'Второй бонус', viewport_hint: index === 0 ? 'Desktop' : null }));
  const known = { ...pending[0], id: 'known-id', label: 'Уже известная ссылка', value: 'https://1cupis.ru/known?x=<safe>&y=1', display_context: 'Известный контекст' };
  const answered = { ...pending[1], id: 'answered-id', label: 'Полученный ответ', value: '' };
  const managed = { ...pending[0], id: 'managed-id', label: 'Фиксированное действие', managed: true, value: 'https://1cupis.ru/managed' };
  const fields = [...pending, known, answered, managed];
  const document = { ...structuredClone(draft), subject: 'Согласованная тема', sender: { mode: 'explicit', name: 'ЦУПИС', address: 'info@1cupis.ru' }, plain_text: { mode: 'manual', value: 'Готовый текст' }, answers: { [pending[0].id]: '', [pending[1].id]: '', [known.id]: known.value, [answered.id]: 'https://1cupis.ru/answered', [managed.id]: managed.value } };
  return { inventory: { ...inventory, fields }, deliveryDraft: document, pending };
}
function task10Submit(html, values) {
  const stateText = html.match(/<script\b[^>]*id="delivery-state"[^>]*>([\s\S]*?)<\/script>/u)[1];
  const state = JSON.parse(stateText), script = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gu)].find(match => !/application\/json/u.test(match[1]))[2];
  let submit, saved, download; const status = {}, urls = [], controls = values.map(value => ({ value }));
  vm.runInNewContext(script, { structuredClone, document: {
    getElementById(id) { if (id === 'delivery-state') return { textContent: stateText }; if (id === 'delivery-form') return { addEventListener(name, fn) { assert.equal(name, 'submit'); submit = fn; } }; if (id === 'status') return status; const index = /^link-(\d+)$/u.exec(id)?.[1]; if (index !== undefined) return controls[Number(index)]; throw Error('Unexpected control '+id); },
    createElement(tag) { assert.equal(tag, 'a'); const anchor = { click() { download = { name: anchor.download, href: anchor.href }; } }; return anchor; },
  }, Blob: class { constructor(parts, options) { assert.match(options.type, /^application\/json/u); saved = JSON.parse(parts.join('')); } }, URL: { createObjectURL() { urls.push('create'); return 'blob:local-only'; }, revokeObjectURL(value) { assert.equal(value, 'blob:local-only'); urls.push('revoke'); } }, fetch() { throw Error('Unexpected network'); }, XMLHttpRequest: class { constructor() { throw Error('Unexpected network'); } }, navigator: { sendBeacon() { throw Error('Unexpected network'); } } });
  submit({ preventDefault() {} });
  return { state, saved, download, status, urls };
}

test('Task10 compact form presents structural sections and exact approved copy without exposing technical captions', () => {
  const fixture = task10FormFixture(), before = structuredClone(fixture);
  const html = renderDeliveryForm(fixture), visible = task10VisibleText(html);
  assert.equal((html.match(/<h1\b/gu) ?? []).length, 1);
  assert.match(visible, /Заполните только недостающие адреса\. Прикрепите скачанный delivery\.json в чат, чтобы продолжить сборку письма\./u);
  assert.match(visible, /Текст кнопки/u); assert.match(visible, /Ссылка/u); assert.match(visible, /Скачать заполненные ссылки/u);
  const pendingPresentation = html.replace(/<details\b[^>]*>[\s\S]*?<\/details>/gu, '');
  assert.equal((pendingPresentation.match(/<section\b/gu) ?? []).length, 2);
  assert.equal((pendingPresentation.match(/<h2\b[^>]*>Акции<\/h2>/gu) ?? []).length, 2);
  assert.match(visible, /Первый бонус/u); assert.match(visible, /Второй бонус/u); assert.match(visible, /Desktop/u);
  assert.doesNotMatch(visible, /Экземпляр|TECHNICAL_INSTANCE|LEGACY_BLOCK_DIAGNOSTIC|opaque-role|owner-a|owner-b/u);
  const state = JSON.parse(html.match(/id="delivery-state"[^>]*>([\s\S]*?)<\/script>/u)[1]);
  assert.deepEqual(state, { document: fixture.deliveryDraft, fields: fixture.pending.map(field => ({ id: field.id, required: true })) });
  assert.deepEqual(fixture, before);
});

test('Task10 every pending text control has unique label and required hint associations without native required blocking', () => {
  const html = renderDeliveryForm(task10FormFixture());
  const inputs = [...html.matchAll(/<input\b([^>]*)>/gu)].map(match => match[1]);
  assert.equal(inputs.length, 2);
  const ids = inputs.map(attributes => /\bid="([^"]+)"/u.exec(attributes)?.[1]);
  assert.equal(new Set(ids).size, 2);
  for (const [index, attributes] of inputs.entries()) {
    assert.match(attributes, /\btype="text"/u); assert.doesNotMatch(attributes, /\srequired(?:\s|=|$)/u);
    assert.match(html, new RegExp('<label\\b[^>]*for="'+ids[index]+'"'));
    const hintIds = /\baria-describedby="([^"]+)"/u.exec(attributes)?.[1]?.split(/\s+/u);
    assert.ok(hintIds?.length, 'Required hint must be accessible from the input');
    assert.ok(hintIds.some(id => new RegExp('id="'+id+'"[^>]*>[^<]*обязательно', 'u').test(html)));
  }
});

test('Task10 optional collapsed review shows known answered managed values read-only without exposing pending IDs', () => {
  const fixture = task10FormFixture(), html = renderDeliveryForm(fixture);
  const details = html.match(/<details\b([^>]*)>([\s\S]*?)<\/details>/u);
  assert.ok(details); assert.doesNotMatch(details[1], /\bopen\b/u);
  assert.match(task10VisibleText(details[2]), /Просмотреть заданные ссылки/u);
  assert.match(task10VisibleText(details[2]), /Уже известная ссылка/u); assert.match(task10VisibleText(details[2]), /Полученный ответ/u); assert.match(task10VisibleText(details[2]), /Фиксированное действие/u);
  assert.match(task10VisibleText(details[2]), /систем|профил|управляем/iu);
  assert.match(task10VisibleText(details[2]), /Известный контекст/u); assert.match(task10VisibleText(details[2]), /Desktop/u);
  assert.match(task10VisibleText(details[2]), /https:\/\/1cupis\.ru\/known\?x=<safe>&y=1/u);
  assert.match(task10VisibleText(details[2]), /https:\/\/1cupis\.ru\/answered/u); assert.match(task10VisibleText(details[2]), /https:\/\/1cupis\.ru\/managed/u);
  assert.doesNotMatch(details[2], /<input\b|<textarea\b|<a\b[^>]*href=|opaque-role/u);
  assert.doesNotMatch(details[2], /<safe>/u);
  assert.deepEqual(JSON.parse(html.match(/id="delivery-state"[^>]*>([\s\S]*?)<\/script>/u)[1]).document, fixture.deliveryDraft);
});

test('Task10 zero pending keeps optional review but no questionnaire or save button', () => {
  const fixture = task10FormFixture();
  for (const field of fixture.pending) fixture.deliveryDraft.answers[field.id] = 'https://1cupis.ru/resolved';
  const before = structuredClone(fixture), html = renderDeliveryForm(fixture);
  assert.doesNotMatch(html, /<input\b|<textarea\b|type="submit"/u);
  assert.match(task10VisibleText(html), /Все ссылки уже заданы\. Сборка продолжается без дополнительных ответов\./u);
  assert.match(html, /<details\b/u); assert.match(task10VisibleText(html), /Просмотреть заданные ссылки/u);
  assert.deepEqual(fixture, before);
});

test('Task10 context equal to a section heading is not repeated for each pending row', () => {
  const field = { ...structuredClone(inventory.fields[0]), display_group: { id: 'email/card', label: 'Первый бонус' }, display_context: 'Первый бонус', viewport_hint: null };
  const html = renderDeliveryForm({ inventory: { ...inventory, fields: [field] }, deliveryDraft: structuredClone(draft) });
  assert.equal((task10VisibleText(html).match(/Первый бонус/gu) ?? []).length, 1);
});

test('Task10 repeated visible captions download distinct trimmed answers and preserve all original document metadata', () => {
  const fixture = task10FormFixture(), before = structuredClone(fixture);
  const result = task10Submit(renderDeliveryForm(fixture), ['  https://1cupis.ru/first  ', 'https://1cupis.ru/second']);
  const expected = structuredClone(fixture.deliveryDraft); expected.answers['owner-a/opaque-role-alpha'] = 'https://1cupis.ru/first'; expected.answers['owner-b/opaque-role-beta'] = 'https://1cupis.ru/second';
  assert.deepEqual(result.saved, expected);
  assert.deepEqual(result.download, { name: 'delivery.json', href: 'blob:local-only' });
  assert.deepEqual(result.urls, ['create', 'revoke']);
  assert.equal(result.status.textContent, 'Ответы сохранены. Проверка готовности выполняется при сборке письма.');
  assert.deepEqual(fixture, before);
});

test('Task10 escaped label and inline JSON cannot terminate markup or introduce a network call', () => {
  const fixture = task10FormFixture(); fixture.pending[0].label = '</script><img src=x onerror=1> & "'; fixture.deliveryDraft.subject = '</script><script>fetch("https://private.test")</script>';
  const html = renderDeliveryForm(fixture);
  assert.doesNotMatch(html, /<img src=x onerror=1>/u);
  const state = JSON.parse(html.match(/id="delivery-state"[^>]*>([\s\S]*?)<\/script>/u)[1]);
  assert.equal(state.document.subject, fixture.deliveryDraft.subject);
  assert.deepEqual(task10Submit(html, ['', '']).saved.answers, { ...fixture.deliveryDraft.answers, 'owner-a/opaque-role-alpha': '', 'owner-b/opaque-role-beta': '' });
});
