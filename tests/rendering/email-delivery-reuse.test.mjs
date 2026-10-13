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

import { collectEmailActions } from '../../scripts/lib/email-action-inventory.mjs';
import { renderDeliveryForm } from '../../scripts/lib/email-delivery-form.mjs';
import { validateDeliveryDocument } from '../../scripts/lib/email-delivery.mjs';
import { inlineDeliveryScenario, structuralDeliveryScenario } from '../fixtures/rendering/email-delivery-fixtures.mjs';

test('Task10 changed current caption invalidates old answers while preserving mailing metadata', () => {
  const old = collectEmailActions(inlineDeliveryScenario());
  const current = collectEmailActions(inlineDeliveryScenario({ currentRuns: ['До ', '«Поддержка»', ' после'] }));
  assert.equal(old.fields[0].id, 'email%2Fnotice~notice-text~link-2-url~~both');
  assert.equal(current.fields[0].id, old.fields[0].id); assert.notEqual(current.inventory_digest, old.inventory_digest);
  const previous = { ...draft, email_id: 'inline-test', subject: 'Согласованная тема', inventory_digest: old.inventory_digest, answers: { [old.fields[0].id]: 'https://1cupis.ru/old' } };
  const renewed = createDeliveryDraft({ emailId: 'inline-test', sourceSha: draft.source_sha, inventory: current, profile, deliveryMetadata: previous });
  assert.equal(renewed.answers[current.fields[0].id], ''); assert.equal(renewed.subject, previous.subject); assert.deepEqual(renewed.sender, previous.sender);
  assert.ok(validateDeliveryDocument({ document: previous, inventory: current, profile, purpose: 'final', sourceSha: draft.source_sha }).some(error => error.code === 'EMAIL_DELIVERY_INVENTORY_STALE'));
});

test('Task10 changed section presentation invalidates answer reuse through the existing digest gate', () => {
  const input = structuralDeliveryScenario(), old = collectEmailActions(input);
  const renamed = collectEmailActions({ ...input, profile: { ...input.profile, block_labels: { ...input.profile.block_labels, 'task10-block': 'Новая секция' } } });
  assert.deepEqual(renamed.fields.map(field => field.id), old.fields.map(field => field.id)); assert.notEqual(renamed.inventory_digest, old.inventory_digest);
  const previous = { ...draft, email_id: 'structural-test', inventory_digest: old.inventory_digest, answers: Object.fromEntries(old.fields.map(field => [field.id, 'https://1cupis.ru/old'])) };
  const renewed = createDeliveryDraft({ emailId: 'structural-test', sourceSha: draft.source_sha, profile, inventory: renamed, deliveryMetadata: previous });
  assert.ok(Object.values(renewed.answers).every(value => value === ''));
  assert.equal(renewed.preheader, previous.preheader); assert.deepEqual(renewed.plain_text, previous.plain_text);
});

test('Task10 rendering presentation repeatedly cannot change inventory IDs digest or reusable answers', () => {
  const current = collectEmailActions(inlineDeliveryScenario()), before = structuredClone(current);
  const previous = { ...draft, email_id: 'inline-test', inventory_digest: current.inventory_digest, answers: { [current.fields[0].id]: 'https://1cupis.ru/current' } };
  const document = createDeliveryDraft({ emailId: 'inline-test', sourceSha: draft.source_sha, profile, inventory: current, deliveryMetadata: previous });
  renderDeliveryForm({ inventory: current, deliveryDraft: document }); renderDeliveryForm({ inventory: current, deliveryDraft: document });
  assert.deepEqual(current, before); assert.deepEqual(document.answers, previous.answers);
  assert.equal(document.inventory_digest, current.inventory_digest);
});
