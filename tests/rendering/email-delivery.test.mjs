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

import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { collectEmailActions } from '../../scripts/lib/email-action-inventory.mjs';
import { createDeliveryDraft } from '../../scripts/lib/email-delivery-form.mjs';
import { loadEmailModel } from '../../scripts/lib/email-model.mjs';
import { loadComponentRegistries, indexComponentRegistries } from '../../scripts/lib/component-registry.mjs';
import { loadEmailDeliveryProfiles, selectDeliveryProfile } from '../../scripts/lib/email-delivery-profile.mjs';
import { inlineDeliveryScenario, typedSupportDeliveryModel } from '../fixtures/rendering/email-delivery-fixtures.mjs';

const task10RepoRoot = fileURLToPath(new URL('../../', import.meta.url));
const task10SourceSha = '8f4648681bd7ac72c5217190f1d523c0cb5f85f4';
const task10HelpId = 'email%2Fnotice~root-content-area-help-notice-help-text~help-url~~both';
function task10RunCli(name, args) {
  return spawnSync(process.execPath, [join(task10RepoRoot, 'scripts', name+'.mjs'), ...args], { cwd: task10RepoRoot, encoding: 'utf8', timeout: 60000, env: { ...process.env, CUPIS_SYSTEM_COMMIT: task10SourceSha } });
}
async function task10RegisteredDependencies() {
  const componentIndex = indexComponentRegistries(await loadComponentRegistries({ repoRoot: task10RepoRoot }));
  const profile = selectDeliveryProfile(await loadEmailDeliveryProfiles({ repoRoot: task10RepoRoot, componentIndex }));
  return { componentIndex, profile };
}
function task10DownloadedDocument(html, answer) {
  const stateText = html.match(/id="delivery-state"[^>]*>([\s\S]*?)<\/script>/u)[1];
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gu)], script = scripts.find(match => !/application\/json/u.test(match[1]))[2];
  let submit, downloaded, downloadName;
  vm.runInNewContext(script, { structuredClone, document: {
    getElementById(id) { if (id === 'delivery-state') return { textContent: stateText }; if (id === 'delivery-form') return { addEventListener(_, callback) { submit = callback; } }; if (id === 'status') return {}; if (id === 'link-0') return { value: answer }; throw Error('Unexpected intake input '+id); },
    createElement() { const anchor = { click() { downloadName = anchor.download; } }; return anchor; },
  }, Blob: class { constructor(parts) { downloaded = JSON.parse(parts.join('')); } }, URL: { createObjectURL() { return 'blob:local'; }, revokeObjectURL() {} } });
  submit({ preventDefault() {} }); assert.equal(downloadName, 'delivery.json');
  return { downloaded, state: JSON.parse(stateText) };
}

// Break caught: exact labels working only for direct helper inputs while prepare/render loaders erase runs.
test('Task10 actual prepare CLI form download validate projection and render CLI retain current typed runs and digest', async t => {
  const folder = await mkdtemp(join(tmpdir(), 'cupis-task10-cli-')); t.after(() => rm(folder, { recursive: true, force: true }));
  const model = typedSupportDeliveryModel(), original = structuredClone(model), modelPath = join(folder, 'model.json'), intake = join(folder, 'intake');
  await writeFile(modelPath, JSON.stringify(model));
  const supplied = { ...draft, email_id: model.id, source_sha: task10SourceSha, subject: 'Согласованная тема', preheader: 'Согласованный прехедер', sender: { mode: 'explicit', name: 'ЦУПИС', address: 'info@1cupis.ru' }, answers: {} }, suppliedPath = join(folder, 'metadata.json');
  await writeFile(suppliedPath, JSON.stringify(supplied));
  const prepared = task10RunCli('prepare-email-delivery', ['--model', modelPath, '--output', intake, '--delivery', suppliedPath]);
  assert.equal(prepared.status, 0, prepared.stderr);
  const html = await readFile(join(intake, 'form.html'), 'utf8'), initial = JSON.parse(await readFile(join(intake, 'delivery.json'), 'utf8'));
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gu, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gu, '');
  assert.match(visible, /«Поддержка»/u); assert.doesNotMatch(visible, /Как снизить риски операций/u);
  assert.deepEqual(Object.keys(initial.answers).sort(), ['email%2Fnotice~root-content-area-phone-cta-phone-number~href~~both', task10HelpId].sort());
  const { downloaded, state } = task10DownloadedDocument(html, '  https://1cupis.ru/help-current  ');
  assert.deepEqual(state.fields, [{ id: task10HelpId, required: true }]);
  assert.deepEqual(downloaded, { ...initial, answers: { ...initial.answers, [task10HelpId]: 'https://1cupis.ru/help-current' } });
  for (const key of ['subject', 'preheader', 'sender', 'reply_to', 'plain_text']) assert.deepEqual(downloaded[key], supplied[key]);
  assert.equal(downloaded.answers['email%2Fnotice~root-content-area-phone-cta-phone-number~href~~both'], 'https://1cupis.ru/phone');
  const deps = await task10RegisteredDependencies(), canonicalInventory = collectEmailActions({ model, ...deps });
  assert.deepEqual(canonicalInventory.diagnostics, []); assert.equal(initial.inventory_digest, canonicalInventory.inventory_digest);
  assert.deepEqual(validateDeliveryDocument({ document: downloaded, inventory: canonicalInventory, profile: deps.profile, sourceSha: task10SourceSha, purpose: 'final', emailId: model.id }), []);
  const projected = projectDeliveryBindings({ model, document: downloaded, inventory: canonicalInventory, profile: deps.profile });
  assert.deepEqual(model, original); assert.deepEqual(projected.model.root.slots[0].instances[0].content_values.find(item => item.slot_id === 'text' && item.element_id === 'root-content-area-help-notice-help-text').value, original.root.slots[0].instances[0].content_values.find(item => item.slot_id === 'text' && item.element_id === 'root-content-area-help-notice-help-text').value);
  assert.equal(projected.model.schema_version, '1.1.0');
  const deliveryPath = join(folder, 'downloaded.json'), output = join(folder, 'rendered'), evidenceOutput = join(folder, 'rendered-evidence'); await writeFile(deliveryPath, JSON.stringify(downloaded));
  const rendered = task10RunCli('render-email', ['--model', modelPath, '--delivery', deliveryPath, '--output', output, '--evidence-output', evidenceOutput]);
  assert.equal(rendered.status, 0, rendered.stderr);
  const finalHtml = await readFile(join(output, 'email.html'), 'utf8'), report = JSON.parse(await readFile(join(evidenceOutput, 'release-report.json'), 'utf8'));
  assert.match(finalHtml, /«Поддержка»/u); assert.match(finalHtml, /href="https:\/\/1cupis\.ru\/help-current"/u); assert.doesNotMatch(finalHtml, /«Помощь»/u);
  assert.equal(report.link_readiness.inventory_digest, downloaded.inventory_digest); assert.equal(report.source_sha, task10SourceSha); assert.equal(report.readiness, 'ready');
  assert.deepEqual(JSON.parse(await readFile(modelPath, 'utf8')), original);
});

test('Task10 actual prepare CLI refuses collapsed typed mapping before issuing any intake files', async t => {
  const folder = await mkdtemp(join(tmpdir(), 'cupis-task10-ambiguous-cli-')); t.after(() => rm(folder, { recursive: true, force: true }));
  const modelPath = join(folder, 'model.json'), output = join(folder, 'intake'); await writeFile(modelPath, JSON.stringify(typedSupportDeliveryModel({ scalar: true })));
  const result = task10RunCli('prepare-email-delivery', ['--model', modelPath, '--output', output]);
  assert.equal(result.status, 1); assert.match(result.stderr, /EMAIL_DELIVERY_LABEL_RANGE_AMBIGUOUS/u);
  assert.doesNotMatch(result.stderr, /Как снизить риски операций|https:\/\/1cupis\.ru/u);
  assert.equal(await stat(output).then(() => true, error => { if (error.code === 'ENOENT') return false; throw error; }), false);
});

test('Task10 loader preserves its default scalar and ordinary CTA while opt-in run arrays match schema inventory', async t => {
  const folder = await mkdtemp(join(tmpdir(), 'cupis-task10-loader-')); t.after(() => rm(folder, { recursive: true, force: true }));
  const scenario = inlineDeliveryScenario({ currentRuns: ['До ', '«Поддержка»', ' после'] }), modelPath = join(folder, 'model.json'), schemaPath = join(task10RepoRoot, 'schemas/email-model.schema.json');
  await writeFile(modelPath, JSON.stringify(scenario.model));
  const standard = await loadEmailModel({ modelPath, schemaPath });
  assert.deepEqual(standard.root.nested_components[0].instance.content_values[0].value, { type: 'rich-text', value: 'До «Поддержка» после' });
  const opted = await loadEmailModel({ modelPath, schemaPath, preserveRichTextRuns: true });
  const canonical = collectEmailActions(scenario), normalized = collectEmailActions({ ...scenario, model: opted });
  assert.deepEqual(normalized.diagnostics, []); assert.deepEqual(normalized.fields, canonical.fields); assert.deepEqual(normalized.text_bindings, canonical.text_bindings); assert.equal(normalized.inventory_digest, canonical.inventory_digest);
  const ordinaryPath = join(folder, 'ordinary.json'); await writeFile(ordinaryPath, JSON.stringify(actionModel()));
  const ordinary = await loadEmailModel({ modelPath: ordinaryPath, schemaPath, preserveRichTextRuns: true });
  assert.equal(ordinary.root.nested_components[0].instance.nested_components[0].instance.content_values[0].value.value, 'Подробнее');
});

test('Task10 registered rich-text consumers all have styled html-text contracts required by the narrow loader bridge', async () => {
  const { componentIndex } = await task10RegisteredDependencies(), occurrences = [];
  for (const [componentId, record] of componentIndex.bySystemId) for (const viewport of ['mobile', 'desktop']) {
    const visit = element => { if (!element) return; for (const slot of element.content_slots ?? []) if (slot.type === 'rich-text') {
      assert.equal(slot.id, 'text'); assert.equal(element.render_mode, 'html-text');
      const styled = element.facts.filter(fact => fact.id === 'styled-text-segments'), source = element.facts.filter(fact => fact.id === 'source-text');
      assert.equal(styled.length, 1); assert.equal(source.length, 1); assert.equal(styled[0].value.items.map(run => run.characters).join(''), source[0].value.value);
      occurrences.push(componentId+' '+viewport);
    } for (const child of element.children ?? []) visit(child); }; visit(record.contracts[viewport].root);
  }
  assert.deepEqual(occurrences.sort(), [
    'block-contact-support desktop', 'block-contact-support mobile', 'block-instruction-steps desktop', 'block-instruction-steps mobile', 'block-personal-data-update desktop', 'block-personal-data-update mobile',
    'block-transaction-error desktop', 'block-transaction-error mobile', 'block-transaction-success desktop', 'block-transaction-success mobile', 'email-footer desktop', 'email-footer mobile',
  ].sort());
});

test('Task10 output range projection retains original range text and input typed bytes while applying current-label answer', () => {
  const scenario = inlineDeliveryScenario({ kind: 'output', currentRuns: ['До ', '«Поддержка»', ' после'] }), original = structuredClone(scenario.model), current = collectEmailActions(scenario);
  const document = createDeliveryDraft({ emailId: 'inline-test', sourceSha: draft.source_sha, profile, inventory: current });
  document.answers['email%2Fnotice~notice-text~text~3~both'] = 'https://1cupis.ru/current';
  const result = projectDeliveryBindings({ model: scenario.model, document, inventory: current, profile });
  assert.deepEqual(scenario.model, original); assert.deepEqual(result.model, original);
  assert.deepEqual(result.outputBindings.map(item => ({ href: item.href, kind: item.kind, range: item.target.range })), [
    { href: 'https://1cupis.ru/current', kind: 'output-range-link', range: { start: 3, end: 11, text: '«Помощь»', href: '' } },
    { href: 'https://1cupis.ru/current', kind: 'output-range-link', range: { start: 3, end: 11, text: '«Помощь»', href: '' } },
  ]);
});

// Compatibility: real preview CLI must consume the same current runs and digest as preparation.
test('Task10 compatibility actual prepare and normal preview retain current typed runs readiness and model bytes', async t => {
  const folder = await mkdtemp(join(tmpdir(), 'cupis-task10-preview-')); t.after(() => rm(folder, { recursive: true, force: true }));
  const model = typedSupportDeliveryModel(), modelBytes = Buffer.from(JSON.stringify(model)), modelPath = join(folder, 'model.json'), intake = join(folder, 'intake');
  await writeFile(modelPath, modelBytes);
  const supplied = { ...draft, email_id: model.id, source_sha: task10SourceSha, subject: 'Согласованная тема', preheader: 'Согласованный прехедер', sender: { mode: 'explicit', name: 'ЦУПИС', address: 'info@1cupis.ru' }, answers: {} }, suppliedPath = join(folder, 'metadata.json');
  await writeFile(suppliedPath, JSON.stringify(supplied));
  const prepared = task10RunCli('prepare-email-delivery', ['--model', modelPath, '--output', intake, '--delivery', suppliedPath]);
  assert.equal(prepared.status, 0, prepared.stderr);
  const initial = JSON.parse(await readFile(join(intake, 'delivery.json'), 'utf8')), dependencies = await task10RegisteredDependencies(), currentInventory = collectEmailActions({ model, ...dependencies });
  assert.deepEqual(currentInventory.diagnostics, []); assert.equal(initial.inventory_digest, currentInventory.inventory_digest);
  assert.equal(currentInventory.fields.find(field => field.id === task10HelpId).label, '«Поддержка»');
  const answered = { ...initial, answers: { ...initial.answers, [task10HelpId]: 'https://1cupis.ru/help-current' } }, deliveryPath = join(folder, 'answered.json');
  assert.equal(answered.answers['email%2Fnotice~root-content-area-phone-cta-phone-number~href~~both'], 'https://1cupis.ru/phone');
  assert.deepEqual(validateDeliveryDocument({ document: answered, inventory: currentInventory, profile: dependencies.profile, sourceSha: task10SourceSha, purpose: 'final', emailId: model.id }), []);
  await writeFile(deliveryPath, JSON.stringify(answered));
  const previewPath = join(folder, 'preview', 'email.html'), preview = task10RunCli('render-email-preview', ['--model', modelPath, '--delivery', deliveryPath, '--mode', 'normal', '--output', previewPath]);
  assert.equal(preview.status, 0, preview.stderr);
  const html = await readFile(previewPath, 'utf8');
  assert.match(html, /CUPIS preview: readiness=ready; purpose=preview/u);
  assert.match(html, /<a href="https:\/\/1cupis\.ru\/help-current"[^>]*>«Поддержка»<\/a>/u);
  assert.doesNotMatch(html, /«Помощь»/u);
  assert.deepEqual(await readFile(modelPath), modelBytes);
  assert.deepEqual(JSON.parse(await readFile(deliveryPath, 'utf8')), answered);
});
