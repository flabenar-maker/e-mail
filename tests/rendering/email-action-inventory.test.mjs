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

test('inventory exposes early duplicate bare identities across distinct card owners', () => {
  const model = actionModel();
  model.root.nested_components[1].instance.nested_components[0].instance.instance_id = 'cta';
  const result = collectEmailActions({ model, componentIndex: actionComponents, profile });
  const locations = [
    '/root/nested_components/0/instance/nested_components/0/instance/instance_id',
    '/root/nested_components/1/instance/nested_components/0/instance/instance_id',
  ];
  const duplicates = result.diagnostics.filter(d => d.code === 'EMAIL_MODEL_INSTANCE_DUPLICATE');
  assert.equal(duplicates.length, 2);
  assert.deepEqual(duplicates.map(d => d.path).sort(), [...locations].sort());
  assert.ok(duplicates.every(d => typeof d.message === 'string' && d.message.includes('cta') && locations.every(p => d.message.includes(p))));
});

test('inventory reports a global bare duplicate even when the second CTA belongs to a hidden card', () => {
  const model = actionModel({ hiddenSecondCard: true });
  model.root.nested_components[1].instance.nested_components[0].instance.instance_id = 'cta';
  const result = collectEmailActions({ model, componentIndex: actionComponents, profile });
  assert.deepEqual(result.diagnostics.filter(d => d.code === 'EMAIL_MODEL_INSTANCE_DUPLICATE').map(d => d.path).sort(), [
    '/root/nested_components/0/instance/nested_components/0/instance/instance_id',
    '/root/nested_components/1/instance/nested_components/0/instance/instance_id',
  ]);
});

test('existing delivery path guard continues rejecting duplicate sibling paths', () => {
  const model = actionModel();
  model.root.nested_components[1].instance.instance_id = 'card';
  const result = collectEmailActions({ model, componentIndex: actionComponents, profile });
  assert.ok(result.diagnostics.some(d => d.code === 'EMAIL_DELIVERY_INSTANCE_DUPLICATE' && d.message.includes('email/card')));
});


import { structuralDeliveryScenario } from '../fixtures/rendering/email-delivery-fixtures.mjs';
import { missingDeliveryFields } from '../../scripts/lib/email-delivery-form.mjs';

// Break caught: model array ordinals or all-slot-first traversal overriding contract insertion order.
test('Task10 mixed slot nested descendants follow structural order including desktop-only placement', () => {
  const expected = ['email/cards/first/first-cta', 'email/cards/middle/middle-cta', 'email/cards/desktop-cta', 'email/cards/last/last-cta', 'email/other/other-cta'];
  for (const reverseModelOrder of [false, true]) {
    const result = collectEmailActions(structuralDeliveryScenario({ reverseModelOrder }));
    assert.deepEqual(result.diagnostics, []);
    assert.deepEqual(result.fields.map(field => field.bindings[0].instance_path), expected);
    assert.deepEqual(result.fields.map(field => field.id), [
      'email%2Fcards%2Ffirst%2Ffirst-cta~button-root~href~~both',
      'email%2Fcards%2Fmiddle%2Fmiddle-cta~button-root~href~~both',
      'email%2Fcards%2Fdesktop-cta~button-root~href~~desktop',
      'email%2Fcards%2Flast%2Flast-cta~button-root~href~~both',
      'email%2Fother%2Fother-cta~button-root~href~~both',
    ]);
  }
});

test('Task10 root cannot swallow sections and same-caption owners retain different structural group IDs', () => {
  const result = collectEmailActions(structuralDeliveryScenario({ sameHeadings: true }));
  assert.deepEqual(result.diagnostics, []);
  const grouped = result.fields.filter(field => field.bindings[0].instance_path.startsWith('email/cards/'));
  assert.equal(grouped.length, 4);
  assert.ok(grouped.every(field => field.display_group?.id === 'email/cards'));
  assert.ok(grouped.every(field => field.display_group?.label === 'Акции'));
  const other = result.fields.find(field => field.bindings[0].instance_path === 'email/other/other-cta');
  assert.deepEqual(other.display_group, { id: 'email/other', label: 'Акции' });
  assert.notEqual(other.display_group.id, grouped[0].display_group.id);
});

test('Task10 nested and slot CTA inherit nearest actual heading within their shared section', () => {
  const result = collectEmailActions(structuralDeliveryScenario());
  assert.deepEqual(result.diagnostics, []);
  const field = path => result.fields.find(item => item.bindings[0].instance_path === path);
  assert.equal(field('email/cards/first/first-cta').label, 'Подробнее');
  assert.equal(field('email/cards/first/first-cta').display_context, 'Первый бонус');
  assert.equal(field('email/cards/middle/middle-cta').display_context, 'Второй бонус');
  assert.equal(field('email/cards/last/last-cta').display_context, 'Третий бонус');
  assert.deepEqual(field('email/cards/middle/middle-cta').display_group, { id: 'email/cards', label: 'Акции' });
});

test('Task10 nonheading paragraphs never become invented card context', () => {
  const result = collectEmailActions(structuralDeliveryScenario({ paragraphOnly: true }));
  assert.deepEqual(result.diagnostics, []);
  assert.ok(result.fields.filter(field => field.bindings[0].instance_path.includes('/cards/')).every(field => field.display_context === ''));
});

test('Task10 viewport hints distinguish real split targets but not shared or lone viewport actions', () => {
  const shared = collectEmailActions({ model: actionModel(), componentIndex: actionComponents, profile });
  assert.ok(shared.fields.every(field => field.viewport_hint === null));
  const split = collectEmailActions({ model: actionModel({ ambiguousViewport: true }), componentIndex: actionComponents, profile });
  const pair = split.fields.filter(field => field.bindings[0].instance_path === 'email/card' && field.bindings[0].element_id === 'card-link');
  assert.deepEqual(pair.map(field => [field.id, field.viewport_hint]), [['email%2Fcard~card-link~href~~mobile', 'Mobile'], ['email%2Fcard~card-link~href~~desktop', 'Desktop']]);
  const loneModel = actionModel();
  loneModel.root.nested_components[0].instance.nested_components[0].instance.visibility_values = [{ element_id: 'button-root', scope: 'desktop', value: false }];
  const lone = collectEmailActions({ model: loneModel, componentIndex: actionComponents, profile }).fields.find(field => field.id === 'email%2Fcard%2Fcta~button-root~href~~mobile');
  assert.ok(lone); assert.equal(lone.viewport_hint, null);
  const knownMobile = pair.find(field => field.viewport_hint === 'Mobile');
  const pending = missingDeliveryFields({ inventory: split, deliveryDraft: { answers: { [knownMobile.id]: 'https://1cupis.ru/mobile-known' } } });
  const half = pending.find(field => field.id === 'email%2Fcard~card-link~href~~desktop');
  assert.equal(half.viewport_hint, 'Desktop');
});
