import assert from "node:assert/strict";
import test from "node:test";
import { collectEmailActions } from "../../scripts/lib/email-action-inventory.mjs";
import { actionModel, actionComponents, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";

function labeledCards() {
  const componentIndex = structuredClone(actionComponents);
  const card = componentIndex.bySystemId.get("card");
  const title = { id: "card-title", semantic_role: "title", render_mode: "html-text", visibility: { mode: "always" }, facts: [], content_slots: [{ id: "text", type: "plain-text", required: true }], children: [] };
  for (const viewport of ["mobile", "desktop"]) card.contracts[viewport].root.children.unshift(structuredClone(title));
  const model = actionModel();
  for (const entry of model.root.nested_components.filter(entry => entry.instance.component_id === "card")) entry.instance.content_values.push({ element_id: "card-title", slot_id: "text", scope: "all", value: { type: "plain-text", value: entry.instance.instance_id === "card" ? "Первый бонус" : "Второй бонус" } });
  return { model, componentIndex };
}

test("identical CTA text is disambiguated by its actual visible card owner text", () => {
  const { fields, diagnostics } = collectEmailActions({ ...labeledCards(), profile });
  assert.deepEqual(diagnostics, []);
  const first = fields.find(field => field.bindings.some(binding => binding.instance_path === "email/card/cta"));
  const second = fields.find(field => field.bindings.some(binding => binding.instance_path === "email/card-2/cta-2"));
  assert.equal(first.label, "Подробнее"); assert.equal(second.label, "Подробнее");
  assert.match(first.block_label, /Первый бонус/); assert.match(second.block_label, /Второй бонус/);
});

test("registered action descriptions never replace the concrete visible button text", () => {
  const configured = { ...profile, roles: [...profile.roles, { id: "cta-link", label: "Системное имя роли", component_id: "button", bindings: ["mobile", "desktop"].map(viewport => ({ viewport, element_id: "button-root", slot_id: "href", kind: "slot-link" })) }] };
  const { fields } = collectEmailActions({ ...labeledCards(), profile: configured });
  const button = fields.find(field => field.role === "cta-link");
  assert.equal(button.label, "Подробнее");
  assert.match(button.block_label, /Первый бонус/);
});

import { inlineDeliveryScenario } from '../fixtures/rendering/email-delivery-fixtures.mjs';

// Break caught: a paragraph or original contract caption replacing the target's current run.
for (const [kind, slot, bindingKind, expectedId] of [
  ['href', 'href', 'slot-link', 'email%2Fnotice~notice-text~href~~both'],
  ['numbered', 'link-2-url', 'slot-link', 'email%2Fnotice~notice-text~link-2-url~~both'],
  ['shared', 'help-url', 'slot-link', 'email%2Fnotice~notice-text~help-url~~both'],
  ['output', 'text', 'output-range-link', 'email%2Fnotice~notice-text~text~3~both'],
]) {
  test(`Task10 ${kind} labels the exact current run without moving its target`, () => {
    const scenario = inlineDeliveryScenario({ kind, currentRuns: ['До ', '«Поддержка»', ' после'] });
    const result = collectEmailActions(scenario);
    assert.deepEqual(result.diagnostics, []);
    assert.equal(result.fields.length, 1);
    const field = result.fields[0];
    assert.equal(field.id, expectedId); assert.equal(field.label, '«Поддержка»');
    assert.equal(field.required, true); assert.equal(field.managed, false); assert.equal(field.value, ''); assert.equal(field.role, null);
    assert.deepEqual(field.bindings, ['mobile', 'desktop'].map(viewport => ({ instance_path: 'email/notice', component_id: 'notice', viewport, element_id: 'notice-text', slot_id: slot, kind: bindingKind, ...(kind === 'output' ? { range: { start: 3, end: 11, text: '«Помощь»', href: '' } } : {}) })));
    assert.equal(result.text_bindings[0].value, 'До «Поддержка» после');
    assert.deepEqual(result.text_bindings[0].runs, scenario.segments);
  });
}

test('Task10 unchanged scalar uses proven source ranges and counts every numbered style segment', () => {
  const result = collectEmailActions(inlineDeliveryScenario({ scalar: 'До «Помощь» после' }));
  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(result.fields.map(field => [field.id, field.label]), [['email%2Fnotice~notice-text~link-2-url~~both', '«Помощь»']]);
});

test('Task10 shared nonadjacent runs exclude intervening prose while keeping one URL', () => {
  const result = collectEmailActions(inlineDeliveryScenario({ kind: 'shared', runs: ['«Помощь»', ' или ', '1cupis.ru'], underlined: [0, 2] }));
  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(result.fields.map(field => [field.id, field.label]), [['email%2Fnotice~notice-text~help-url~~both', '«Помощь» · 1cupis.ru']]);
});

test('Task10 adjacent shared runs concatenate but adjacent numbered targets stay separate', () => {
  const input = { runs: ['службу ', 'поддержки'], underlined: [0, 1] };
  const shared = collectEmailActions(inlineDeliveryScenario({ ...input, kind: 'shared' }));
  assert.deepEqual(shared.diagnostics, []);
  assert.deepEqual(shared.fields.map(field => [field.id, field.label]), [['email%2Fnotice~notice-text~help-url~~both', 'службу поддержки']]);
  const numbered = collectEmailActions(inlineDeliveryScenario({ ...input, kind: 'numbered' }));
  assert.deepEqual(numbered.diagnostics, []);
  assert.deepEqual(numbered.fields.map(field => [field.id, field.label]), [['email%2Fnotice~notice-text~link-1-url~~both', 'службу '], ['email%2Fnotice~notice-text~link-2-url~~both', 'поддержки']]);
});

test('Task10 current emoji newline and changed prefix lengths do not reuse original offsets', () => {
  const result = collectEmailActions(inlineDeliveryScenario({ kind: 'output', currentRuns: ['Новый длинный префикс ', '🧭\nПоддержка', ' конец'] }));
  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.fields[0].label, '🧭\nПоддержка');
  assert.equal(result.fields[0].id, 'email%2Fnotice~notice-text~text~3~both');
  assert.deepEqual(result.fields[0].bindings[0].range, { start: 3, end: 11, text: '«Помощь»', href: '' });
});

test('Task10 typed schema segments and normalized run arrays produce identical inventory and digest', () => {
  const input = { kind: 'shared', currentRuns: ['До ', '«Поддержка»', ' после'] };
  const typed = collectEmailActions(inlineDeliveryScenario(input));
  const normalized = collectEmailActions(inlineDeliveryScenario({ ...input, representation: 'array' }));
  assert.deepEqual(typed.diagnostics, []); assert.deepEqual(normalized.diagnostics, []);
  assert.deepEqual(normalized.fields, typed.fields); assert.deepEqual(normalized.text_bindings, typed.text_bindings);
  assert.equal(normalized.inventory_digest, typed.inventory_digest);
});

test('Task10 href owner uses only its descendant underlined current text without splitting the action', () => {
  const scenario = inlineDeliveryScenario({ kind: 'href', currentRuns: ['До ', '«Поддержка»', ' после'] });
  for (const viewport of ['mobile', 'desktop']) {
    const owner = scenario.componentIndex.bySystemId.get('notice').contracts[viewport].root.children[0];
    const inline = structuredClone(owner); inline.id = 'notice-inline'; inline.render_mode = 'html-text'; inline.content_slots = inline.content_slots.filter(slot => slot.type !== 'url');
    owner.facts = []; owner.content_slots = owner.content_slots.filter(slot => slot.type === 'url'); owner.children = [inline];
  }
  scenario.model.root.nested_components[0].instance.content_values[0].element_id = 'notice-inline';
  const result = collectEmailActions(scenario);
  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(result.fields.map(field => [field.id, field.label]), [['email%2Fnotice~notice-text~href~~both', '«Поддержка»']]);
});

// Break caught: guessing a substring when source facts cannot establish an unambiguous run map.
for (const [name, modify] of [
  ['changed scalar', scenario => { scenario.model.root.nested_components[0].instance.content_values[0].value = { type: 'rich-text', value: 'СЕКРЕТНЫЙ ПРЕФИКС «Поддержка» конец' }; }],
  ['run count mismatch', scenario => { scenario.model.root.nested_components[0].instance.content_values[0].value.segments.pop(); }],
  ['nonstring internal run', scenario => { scenario.model.root.nested_components[0].instance.content_values[0].value = { type: 'rich-text', value: ['До ', 42, ' после'] }; }],
  ['overlapping original ranges', scenario => { for (const viewport of ['mobile', 'desktop']) scenario.componentIndex.bySystemId.get('notice').contracts[viewport].root.children[0].facts[1].value.items[1].start = 2; }],
  ['out of bounds original range', scenario => { for (const viewport of ['mobile', 'desktop']) scenario.componentIndex.bySystemId.get('notice').contracts[viewport].root.children[0].facts[1].value.items[1].end = 200; }],
  ['noninteger original range', scenario => { for (const viewport of ['mobile', 'desktop']) scenario.componentIndex.bySystemId.get('notice').contracts[viewport].root.children[0].facts[1].value.items[1].start = 3.5; }],
  ['missing original source text', scenario => { for (const viewport of ['mobile', 'desktop']) scenario.componentIndex.bySystemId.get('notice').contracts[viewport].root.children[0].facts = scenario.componentIndex.bySystemId.get('notice').contracts[viewport].root.children[0].facts.filter(fact => fact.id !== 'source-text'); }],
  ['source character disagreement', scenario => { for (const viewport of ['mobile', 'desktop']) scenario.componentIndex.bySystemId.get('notice').contracts[viewport].root.children[0].facts[1].value.items[1].characters = '«Другое»'; }],
  ['split UTF16 surrogate boundary', scenario => { for (const viewport of ['mobile', 'desktop']) { const element = scenario.componentIndex.bySystemId.get('notice').contracts[viewport].root.children[0]; element.facts[0].value.value = '🧭«Помощь»'; element.facts[1].value.items = [{ start: 0, end: 1, characters: '\ud83e', text_decoration: 'NONE' }, { start: 1, end: 10, characters: '\udded«Помощь»', text_decoration: 'UNDERLINE' }]; } scenario.model.root.nested_components[0].instance.content_values[0].value = { type: 'rich-text', segments: [{ type: 'text', value: '🧭' }, { type: 'text', value: '«Поддержка»' }] }; }],
]) {
  test(`Task10 ${name} reports bounded target ambiguity`, () => {
    const scenario = inlineDeliveryScenario(); modify(scenario);
    const result = collectEmailActions(scenario);
    const errors = result.diagnostics.filter(error => error.code === 'EMAIL_DELIVERY_LABEL_RANGE_AMBIGUOUS');
    assert.ok(errors.length > 0, 'Unproved run mapping must be refused');
    for (const error of errors) { assert.match(error.path, /notice/u); assert.ok(error.message.length <= 240); assert.doesNotMatch(error.message, /СЕКРЕТНЫЙ ПРЕФИКС|https:\/\//u); }
  });
}

// Break caught: accepting individually valid ranges that omit part of the original source.
test('Task10 refinement missing middle original source range refuses typed current mapping', () => {
  const scenario = inlineDeliveryScenario({ currentRuns: ['До ', '«Поддержка»', ' после'] });
  for (const viewport of ['mobile', 'desktop']) {
    scenario.componentIndex.bySystemId.get('notice').contracts[viewport].root.children[0].facts[1].value.items = [
      { start: 0, end: 2, characters: 'До', text_decoration: 'NONE' },
      { start: 3, end: 11, characters: '«Помощь»', text_decoration: 'UNDERLINE' },
      { start: 11, end: 17, characters: ' после', text_decoration: 'NONE' },
    ];
  }
  const result = collectEmailActions(scenario);
  const errors = result.diagnostics.filter(error => error.code === 'EMAIL_DELIVERY_LABEL_RANGE_AMBIGUOUS');
  assert.ok(errors.length > 0, 'The missing source space at UTF16 offset 2 must make the typed map ambiguous');
  assert.ok(errors.every(error => /notice/u.test(error.path) && error.message.length <= 240));
});

test('Task10 refinement missing trailing original source range refuses typed current mapping', () => {
  const scenario = inlineDeliveryScenario({ currentRuns: ['До ', '«Поддержка»', ' после'] });
  for (const viewport of ['mobile', 'desktop']) {
    scenario.componentIndex.bySystemId.get('notice').contracts[viewport].root.children[0].facts[1].value.items = [
      { start: 0, end: 3, characters: 'До ', text_decoration: 'NONE' },
      { start: 3, end: 11, characters: '«Помощь»', text_decoration: 'UNDERLINE' },
      { start: 11, end: 16, characters: ' посл', text_decoration: 'NONE' },
    ];
  }
  const result = collectEmailActions(scenario);
  const errors = result.diagnostics.filter(error => error.code === 'EMAIL_DELIVERY_LABEL_RANGE_AMBIGUOUS');
  assert.ok(errors.length > 0, 'The missing final source character at UTF16 offset 16 must make the typed map ambiguous');
  assert.ok(errors.every(error => /notice/u.test(error.path) && error.message.length <= 240));
});

// Compatibility: unchanged joined source permits canonical resegmentation without guessing changed text.
for (const [name, representation, currentRuns] of [
  ['typed one run', 'segments', ['До «Помощь» после']],
  ['internal two runs', 'array', ['До «По', 'мощь» после']],
]) {
  test(`Task10 compatibility ${name} recovers original underlined source ranges and digest`, () => {
    const scenario = inlineDeliveryScenario({ kind: 'output', representation, currentRuns });
    const original = structuredClone(scenario.model), result = collectEmailActions(scenario);
    const exact = collectEmailActions(inlineDeliveryScenario({ kind: 'output', currentRuns: ['До ', '«Помощь»', ' после'] }));
    assert.deepEqual(result.diagnostics, []);
    assert.deepEqual(result.fields.map(field => [field.id, field.label]), [['email%2Fnotice~notice-text~text~3~both', '«Помощь»']]);
    assert.deepEqual(result.fields[0].bindings, ['mobile', 'desktop'].map(viewport => ({ instance_path: 'email/notice', component_id: 'notice', viewport, element_id: 'notice-text', slot_id: 'text', kind: 'output-range-link', range: { start: 3, end: 11, text: '«Помощь»', href: '' } })));
    assert.equal(result.text_bindings[0].value, 'До «Помощь» после');
    assert.deepEqual(result.text_bindings[0].runs, [
      { start: 0, end: 3, characters: 'До ', text_decoration: 'NONE' },
      { start: 3, end: 11, characters: '«Помощь»', text_decoration: 'UNDERLINE' },
      { start: 11, end: 17, characters: ' после', text_decoration: 'NONE' },
    ]);
    assert.equal(result.inventory_digest, exact.inventory_digest);
    assert.deepEqual(scenario.model, original);
  });
}

import { typedSupportDeliveryModel as task10CompatibilitySupport } from '../fixtures/rendering/email-delivery-fixtures.mjs';
import { loadComponentRegistries as task10CompatibilityRegistries, indexComponentRegistries as task10CompatibilityIndex } from '../../scripts/lib/component-registry.mjs';
import { loadRendererRegistry as task10CompatibilityRenderers } from '../../scripts/lib/renderer-registry.mjs';
import { loadRenderingFoundation as task10CompatibilityRendering } from '../../scripts/lib/rendering-foundation.mjs';
import { renderEmailDocument as task10CompatibilityRenderDocument } from '../../scripts/lib/email-renderer.mjs';
import { fileURLToPath as task10CompatibilityFilePath } from 'node:url';

// Already-working control: equal aggregate text must never erase a matching-count per-index change.
test('Task10 compatibility same-count source-equal boundary shift keeps current labels and rendering', async () => {
  const scenario = inlineDeliveryScenario({ kind: 'output', currentRuns: ['До «', 'Помощь»', ' после'] });
  const current = collectEmailActions(scenario), exact = collectEmailActions(inlineDeliveryScenario({ kind: 'output' }));
  assert.deepEqual(current.diagnostics, []);
  assert.deepEqual(current.fields.map(field => [field.id, field.label]), [['email%2Fnotice~notice-text~text~3~both', 'Помощь»']]);
  assert.deepEqual(current.fields[0].bindings.map(binding => binding.range), [
    { start: 3, end: 11, text: '«Помощь»', href: '' }, { start: 3, end: 11, text: '«Помощь»', href: '' },
  ]);
  assert.equal(current.text_bindings[0].value, 'До «Помощь» после');
  assert.notEqual(current.inventory_digest, exact.inventory_digest);
  const repoRoot = task10CompatibilityFilePath(new URL('../../', import.meta.url));
  const componentIndex = task10CompatibilityIndex(await task10CompatibilityRegistries({ repoRoot }));
  const model = task10CompatibilitySupport(), values = model.root.slots[0].instances[0].content_values;
  values.find(value => value.element_id === 'root-content-area-help-notice-help-text' && value.slot_id === 'text').value = { type: 'rich-text', value: ['Как снизить риски операций без согласия, читайте на нашем сайте в\u00a0разделе «', 'Помощь»'] };
  values.find(value => value.slot_id === 'help-url').value.value = 'https://1cupis.ru/help-current';
  const originalBytes = JSON.stringify(model);
  const rendered = task10CompatibilityRenderDocument(model, { componentIndex, rendererRegistry: await task10CompatibilityRenderers({ repoRoot }), foundations: { rendering: await task10CompatibilityRendering({ repoRoot }) } });
  assert.deepEqual(rendered.diagnostics, []);
  assert.match(rendered.html, /<a href="https:\/\/1cupis\.ru\/help-current"[^>]*>Помощь»<\/a>/u);
  assert.doesNotMatch(rendered.html, /<a href="https:\/\/1cupis\.ru\/help-current"[^>]*>«Помощь»<\/a>/u);
  assert.equal(JSON.stringify(model), originalBytes);
});
