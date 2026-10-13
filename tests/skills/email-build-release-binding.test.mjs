import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readdir, readFile, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { executeEmailBuildHandoff } from '../../scripts/lib/email-build-orchestration.mjs';
import { workloadInputDigest } from '../../scripts/lib/execution-context.mjs';
import { validateDocumentShape } from '../../scripts/lib/schema-validation.mjs';
import modelSchema from '../../schemas/email-model.schema.json' with { type: 'json' };
import { physicalCandidateFixture, createCandidateReviewFixture, plainAssetSourceFixture, selectedDesignEvidence, candidateFiles, digest, emitTestCandidate, TEST_CANDIDATE_HTML, deliveryDocumentFor, authorizeProjectedUrls } from '../helpers/email-candidate-review-fixture.mjs';

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const execFileAsync = promisify(execFile);
async function physical(t, options = {}) {
  const root = await mkdtemp(join(tmpdir(), 'test-release-binding-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const f = await physicalCandidateFixture({ root, repository: repoRoot, ...options });
  f.outputDir = join(root, 'final-release');
  return f;
}
function argumentsFor(f, mode = 'new-build') {
  return { repoRoot, model: f.model, candidates: f.candidates, assetRoot: f.assetRoot, assetEvidence: f.assetEvidence, outputDir: f.outputDir, sourceSha: f.sourceSha, sourceEvidence: f.sourceEvidence, selectedSourceBinding: f.selectedSourceBinding, candidateReviewQualification: f.candidateReviewQualification, candidateReviewer: f.candidateReviewer, rendererRunner: f.rendererRunner, resolution: { workflow: { mode } }, ...(mode === 'continue-fix-design' ? { continueFixEvidence: { ...selectedDesignEvidence(f.selectedSourceBinding), visual_regression: { status: 'passed', reference_id: 'test-formal-legacy-reference', render_id: 'test-formal-legacy-render' } } } : {}) };
}
async function blocked(f, args, { beforeRenderer = false, afterReview = false } = {}) {
  const result = await executeEmailBuildHandoff(args);
  const finalEntries = await readdir(f.outputDir).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
  const observed = JSON.stringify({ executed: result.executed, blockers: result.blockers, rendererCalls: f.renderCalls, reviewCalls: f.reviewCalls, finalEntries });
  assert.equal(result.executed, false, observed);
  assert.ok(result.blockers.length > 0, observed);
  assert.equal(finalEntries, null, observed);
  if (beforeRenderer) assert.equal(f.renderCalls, 0, observed);
  if (afterReview) assert.equal(f.reviewCalls, 1, observed);
  return result;
}
async function assetFixture(t, topLevel = ['banner-secondary']) {
  const root = await mkdtemp(join(tmpdir(), 'test-active-asset-binding-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = await plainAssetSourceFixture(root, topLevel);
  const sourceSha = process.env.CUPIS_SYSTEM_COMMIT;
  const review = await createCandidateReviewFixture({ root, model: source.model, sourceEvidence: source.sourceEvidence, sourceSha });
  return Object.assign(review, { ...source, sourceSha, assetRoot: root, outputDir: join(root, 'final-release') });
}

for (const mode of ['new-build', 'continue-fix-design']) {
  for (const [label, change] of [
    ['missing selected binding', a => { delete a.selectedSourceBinding; }],
    ['unexpected binding key', a => { a.selectedSourceBinding = { ...a.selectedSourceBinding, self_report: true }; }],
    ['blank selected email', a => { a.selectedSourceBinding = { ...a.selectedSourceBinding, email_id: ' ' }; }],
    ['foreign selected email', a => { a.selectedSourceBinding = { ...a.selectedSourceBinding, email_id: 'unrelated-email' }; }],
    ['foreign selected file', a => { a.selectedSourceBinding = { ...a.selectedSourceBinding, file_key: 'unrelated-file' }; }],
    ['foreign mobile root', a => { a.selectedSourceBinding = { ...a.selectedSourceBinding, roots: { ...a.selectedSourceBinding.roots, mobile: '9999:1' } }; }],
    ['foreign desktop root', a => { a.selectedSourceBinding = { ...a.selectedSourceBinding, roots: { ...a.selectedSourceBinding.roots, desktop: '9999:2' } }; }],
    ['nonphysical root', a => { a.selectedSourceBinding = { ...a.selectedSourceBinding, roots: { ...a.selectedSourceBinding.roots, mobile: 'root-mobile' } }; }],
    ['foreign source SHA', a => { a.selectedSourceBinding = { ...a.selectedSourceBinding, source_sha: 'b'.repeat(40) }; }],
    ['stale canonical model digest', a => { a.selectedSourceBinding = { ...a.selectedSourceBinding, model_digest: '0'.repeat(64) }; }],
  ]) {
    test(`${mode}: ${label} stops before renderer and final publication`, async t => {
      const f = await physical(t), a = argumentsFor(f, mode); change(a); await blocked(f, a, { beforeRenderer: true });
    });
  }

  test(`${mode}: self-consistent foreign capture remains unrelated to the selected roots`, async t => {
    const f = await physical(t), a = argumentsFor(f, mode);
    const text = JSON.stringify(f.sourceEvidence).replaceAll('2021:4164', '3030:1').replaceAll('2021:4163', '3030:2');
    a.sourceEvidence = JSON.parse(text);
    if (mode === 'continue-fix-design') a.continueFixEvidence.figma_instances = { mobile: { role: 'mobile', email_id: f.model.id, file_key: f.sourceEvidence.readings.file_key, node_id: '3030:1' }, desktop: { role: 'desktop', email_id: f.model.id, file_key: f.sourceEvidence.readings.file_key, node_id: '3030:2' } };
    await blocked(f, a, { beforeRenderer: true });
  });

  test(`${mode}: actual full source evidence is required before rendering`, async t => {
    const f = await physical(t), a = argumentsFor(f, mode); a.sourceEvidence = { status: 'passed' };
    await blocked(f, a, { beforeRenderer: true });
  });

  test(`${mode}: real renderer runs once in isolated candidate and publishes exactly reviewed bytes`, async t => {
    const f = await physical(t), a = argumentsFor(f, mode); a.rendererRunner = f.realRendererRunner;
    const result = await executeEmailBuildHandoff(a);
    assert.deepEqual(result.blockers, []); assert.equal(result.executed, true);
    assert.equal(f.renderCalls, 1); assert.equal(f.reviewCalls, 1, JSON.stringify({ rendererCalls: f.renderCalls, reviewedFiles: f.reviewedFiles.length, outputDirs: f.candidateDirs }));
    assert.notEqual(f.candidateDirs[0], f.outputDir, 'renderer must not receive final outputDir');
    const published = await candidateFiles(f.outputDir);
    assert.deepEqual(published.map(({ path, digest }) => ({ path, digest })), f.reviewedFiles.map(({ path, digest }) => ({ path, digest })));
    for (const [index, item] of published.entries()) assert.deepEqual(item.bytes, f.reviewedFiles[index].bytes, item.path);
    assert.match((await readFile(join(f.outputDir, 'email.html'))).toString(), /<html\b/u);
    assert.doesNotMatch((await readFile(join(f.outputDir, 'email.html'))).toString(), /Понравилось это письмо\?/u);
    assert.deepEqual(await readFile(join(f.referenceRoot, 'email_model/model.json')), f.prepared.modelBytes);
  });
}

for (const [label, change] of [
  ['missing reviewer callback', a => { delete a.candidateReviewer; }],
  ['missing pinned qualification', a => { delete a.candidateReviewQualification; }],
  ['same executor and reviewer', a => { a.candidateReviewQualification = { ...a.candidateReviewQualification, reviewer_agent_id: a.candidateReviewQualification.executor_agent_id }; }],
  ['bare passed claim', a => { a.candidateReviewer = async () => ({ status: 'passed' }); }],
  ['reviewer throws', a => { a.candidateReviewer = async () => { throw new Error('test reviewer unavailable'); }; }],
]) {
  test(`protected candidate ${label} never publishes`, async t => { const f = await physical(t), a = argumentsFor(f); change(a); await blocked(f, a); });
}

for (const [label, mutate] of [
  ['missing bound receipt', async ({ context }) => { delete context.reviewQualification.review_ref; }],
  ['foreign reviewer model binding', async ({ context, review, saveReview }) => { context.reviewQualification.selected_model = { binding: 'explicit', id: 'test-other-model' }; review.reviewer_model_binding = { ...context.reviewQualification.selected_model }; await saveReview(); }],
  ['foreign pinned effort', async ({ context, review, saveReview }) => { context.reviewQualification.effort = 'medium'; review.reviewer_effort = 'medium'; await saveReview(); }],
  ['stale candidate identity', async ({ context, review, saveReview }) => { context.identity.artifact_digest = 'c'.repeat(64); review.artifact_digest = context.identity.artifact_digest; await saveReview(); }],
  ['schema-valid foreign canonical model with fresh inventory and receipt cannot change trusted digest', async ({ context, review, inputRoots, modelRef, saveReview }) => {
    const path = join(inputRoots.email_model, modelRef.path);
    const canonical = JSON.parse(await readFile(path, 'utf8')); canonical.metadata.language = 'en';
    assert.deepEqual(validateDocumentShape({ document: canonical, schema: modelSchema, supportedVersion: '1.1.0' }), []);
    const bytes = Buffer.from(JSON.stringify(canonical)); await writeFile(path, bytes);
    const inventoryPath = join(context.referenceRoot, context.inputRefs.email_model.path);
    const inventory = JSON.parse(await readFile(inventoryPath, 'utf8')); inventory.files[0].digest = digest(bytes);
    const inventoryBytes = Buffer.from(JSON.stringify(inventory)); await writeFile(inventoryPath, inventoryBytes);
    context.inputRefs.email_model.digest = digest(inventoryBytes);
    review.input_digest = workloadInputDigest(context.inputRefs); review.reviewed_model.digest = digest(bytes);
    await saveReview();
  }],
  ['stale canonical model inventory', async ({ inputRoots }) => { await writeFile(join(inputRoots.email_model, 'model.json'), '{}'); }],
  ['stale rendered image inventory', async ({ inputRoots, images }) => { await writeFile(join(inputRoots.evidence_root, images.evidence_root[0].path), Buffer.from('stale')); }],
  ['same image inventory entries reused for both viewports', async ({ context }) => { context.viewportImageRefs.desktop = structuredClone(context.viewportImageRefs.mobile); }],
  ['missing desktop viewport map', async ({ context }) => { delete context.viewportImageRefs.desktop; }],
  ['missing explicit text category', async ({ review, saveReview }) => { delete review.results.text; await saveReview(); }],
  ['missing actual image review entry', async ({ review, saveReview }) => { review.reviewed_images.pop(); await saveReview(); }],
  ['review changes completed comparison bytes', async ({ sourceComparisonRef }) => { await writeFile(sourceComparisonRef.path, '{}'); }],
  ['review changes final canonical model bytes', async ({ comparison }) => { await writeFile(comparison.final_model_path, '{}'); }],
  ['review changes candidate HTML', async ({ candidateDir }) => { await writeFile(join(candidateDir, 'email.html'), '<html>changed after freeze</html>'); }],
  ['review changes candidate ZIP', async ({ candidateDir }) => { await writeFile(join(candidateDir, 'altcraft.zip'), 'changed after freeze'); }],
  ['review adds unreviewed file', async ({ candidateDir }) => { await writeFile(join(candidateDir, 'added.txt'), 'unreviewed'); }],
]) {
  test(label, async t => { const f = await physical(t); f.onReview = mutate; await blocked(f, argumentsFor(f), { afterReview: true }); });
}

for (const [phase, target] of [['renderer', 'model'], ['renderer', 'model file'], ['renderer', 'delivery'], ['renderer', 'delivery file'], ['renderer', 'asset'], ['reviewer', 'model'], ['reviewer', 'delivery'], ['reviewer', 'asset'], ['reviewer', 'binding alias'], ['reviewer', 'nested binding roots alias'], ['reviewer', 'qualification alias'], ['reviewer', 'nested qualification model alias'], ['reviewer', 'callback selection clone']]) {
  test(`${phase}-time mutation of ${target} cannot become a new baseline`, async t => {
    const f = target === 'asset' ? await assetFixture(t) : await physical(t, { autoDelivery: target.startsWith('delivery') });
    const a = argumentsFor(f); if (target.startsWith('delivery')) { a.deliveryDocument = f.prepared.document; a.resolution.workflow.steps = [{ id: 'validate-delivery-answers' }]; }
    let mutated = false;
    const mutate = async last => {
      if (target === 'model') f.model.metadata.language = 'en';
      else if (target === 'model file') await writeFile(last.modelPath, '{}');
      else if (target === 'delivery file') await writeFile(last.deliveryPath, '{}');
      else if (target === 'delivery') a.deliveryDocument.subject = 'Changed after baseline';
      else if (target === 'asset') await writeFile(join(f.assetRoot, ...f.assetEvidence[0].path.split('/')), 'changed source asset');
      else if (target === 'binding alias') { f.selectedSourceBinding.email_id = 'changed alias'; last.callbackSelection.email_id = 'changed alias'; }
      else if (target === 'nested binding roots alias') { f.selectedSourceBinding.roots.mobile = '9090:1'; last.callbackSelection.roots.mobile = '9090:1'; }
      else if (target === 'nested qualification model alias') { f.candidateReviewQualification.selected_model.binding = 'explicit'; f.candidateReviewQualification.selected_model.id = 'test-other-pinned-model'; last.context.reviewQualification.selected_model = structuredClone(f.candidateReviewQualification.selected_model); last.review.reviewer_model_binding = structuredClone(f.candidateReviewQualification.selected_model); await last.saveReview(); }
      else if (target === 'qualification alias') { f.candidateReviewQualification.reviewer_agent_id = 'test-other-reviewer'; last.context.reviewQualification.reviewer_agent_id = 'test-other-reviewer'; last.review.reviewer_agent_id = 'test-other-reviewer'; await last.saveReview(); }
      else if (target === 'callback selection clone') last.callbackSelection.file_key = 'changed callback clone';
      mutated = true;
    };
    if (phase === 'renderer') a.rendererRunner = async args => { f.renderCalls += 1; await emitTestCandidate(args); await mutate(args); };
    else f.onReview = mutate;
    await blocked(f, a, { afterReview: phase === 'reviewer' });
    assert.equal(mutated, true, 'the mutation control must actually execute');
  });
}

for (const mode of ['new-build', 'continue-fix-design']) {
  test(`${mode}: unapproved final delivery URL projection stops before renderer`, async t => {
    let f = await assetFixture(t);
    const { document } = await deliveryDocumentFor({ root: f.assetRoot, model: f.model, sourceSha: f.sourceSha });
    const review = await createCandidateReviewFixture({ root: f.assetRoot, model: f.model, sourceEvidence: f.sourceEvidence, sourceSha: f.sourceSha, deliveryDocument: document });
    f = Object.assign(review, { model: f.model, sourceEvidence: f.sourceEvidence, sourceSha: f.sourceSha, assetEvidence: f.assetEvidence, candidates: f.candidates, assetRoot: f.assetRoot, outputDir: f.outputDir });
    assert.notEqual(f.prepared.modelDigest, digest(Buffer.from(JSON.stringify(f.model))), 'delivery really changes canonical URLs');
    const a = argumentsFor(f, mode); a.deliveryDocument = document; a.resolution.workflow.steps = [{ id: 'validate-delivery-answers' }];
    const result = await blocked(f, a, { beforeRenderer: true });
    assert.ok(result.sourceDiagnostics.some(d => d.code === 'EMAIL_SOURCE_VALUE_MISMATCH'), JSON.stringify(result.sourceDiagnostics));
  });
}

test('candidate links added during reviewer callback are rejected when platform supports links', async t => {
  const f = await physical(t); const target = join(f.assetRoot, 'test-link-target.txt'); await writeFile(target, 'ordinary local test file');
  const probe = join(f.assetRoot, 'test-link-support');
  try { await symlink(target, probe, 'file'); } catch (error) { if (['EPERM', 'ENOTSUP'].includes(error.code)) return t.skip(`file link unavailable: ${error.code}`); throw error; }
  await rm(probe);
  let added = false; f.onReview = async ({ candidateDir }) => { await symlink(target, join(candidateDir, 'added-link.txt'), 'file'); added = true; };
  await blocked(f, argumentsFor(f), { afterReview: true }); assert.equal(added, true);
});

test('shared preparation export is import-safe and returns exact canonical bytes and derived runtime model', async t => {
  const f = await physical(t); const config = join(f.assetRoot, 'test-shared-preparation-config.json');
  await writeFile(config, JSON.stringify({ moduleUrl: pathToFileURL(join(repoRoot, 'scripts/render-email.mjs')).href, args: { repoRoot, modelPath: f.prepared.modelPath, sourceSha: f.sourceSha } }));
  const child = `const fs=await import('node:fs/promises');const config=JSON.parse(await fs.readFile(process.argv[1],'utf8'));const api=await import(config.moduleUrl);if(typeof api.prepareEmailRenderInput!=='function'){process.stdout.write(JSON.stringify({missing:'prepareEmailRenderInput'}));process.exit(2);}const prepared=await api.prepareEmailRenderInput(config.args);process.stdout.write(JSON.stringify({canonicalModel:prepared.canonicalModel,renderModel:prepared.renderModel,modelBytes:prepared.modelBytes.toString('base64')}));`;
  let output, failure;
  try { output = (await execFileAsync(process.execPath, ['--input-type=module', '-e', child, config], { cwd: repoRoot, env: { ...process.env, CUPIS_SYSTEM_COMMIT: f.sourceSha } })).stdout; } catch (error) { failure = { code: error.code, stdout: error.stdout, stderr: error.stderr }; }
  assert.equal(failure, undefined, JSON.stringify(failure));
  const actual = JSON.parse(output);
  assert.deepEqual(actual.canonicalModel, f.prepared.canonicalModel);
  assert.deepEqual(Buffer.from(actual.modelBytes, 'base64'), f.prepared.modelBytes);
  assert.deepEqual(actual.renderModel, f.prepared.renderModel);
});

test('multi-segment canonical model remains schema-valid and binds source visual and actual rendered bytes', async t => {
  let f = await assetFixture(t, ['email-footer']);
  const visit = instance => [instance, ...(instance.slots ?? []).flatMap(slot => slot.instances.flatMap(visit)), ...(instance.nested_components ?? []).flatMap(nested => visit(nested.instance))];
  const item = visit(f.model.root).flatMap(instance => instance.content_values ?? []).find(item => item.value.type === 'rich-text');
  assert.ok(item, 'real registered source fixture contains rich-text');
  const literal = item.value.segments.map(segment => segment.value).join('');
  const midpoint = Math.max(1, Math.floor(literal.length / 2));
  item.value.segments = [{ type: 'text', value: literal.slice(0, midpoint) }, { type: 'text', value: literal.slice(midpoint) }];
  const selectedSegments = structuredClone(item.value.segments);
  const { document, inventory } = await deliveryDocumentFor({ root: f.assetRoot, model: f.model, sourceSha: f.sourceSha });
  const review = await createCandidateReviewFixture({ root: f.assetRoot, model: f.model, sourceEvidence: f.sourceEvidence, sourceSha: f.sourceSha, deliveryDocument: document });
  authorizeProjectedUrls({ sourceEvidence: f.sourceEvidence, canonicalModel: review.prepared.canonicalModel, document, inventory });
  f = Object.assign(review, { model: f.model, sourceEvidence: f.sourceEvidence, sourceSha: f.sourceSha, assetEvidence: f.assetEvidence, candidates: f.candidates, assetRoot: f.assetRoot, outputDir: f.outputDir });
  assert.deepEqual(validateDocumentShape({ document: f.prepared.canonicalModel, schema: modelSchema, supportedVersion: '1.1.0' }), []);
  const a = argumentsFor(f); a.rendererRunner = f.realRendererRunner; a.deliveryDocument = document; a.resolution.workflow.steps = [{ id: 'validate-delivery-answers' }];
  const result = await executeEmailBuildHandoff(a);
  assert.equal(result.executed, true); assert.deepEqual(result.blockers, []); assert.equal(f.reviewCalls, 1);
  const canonical = JSON.parse(await readFile(join(f.referenceRoot, 'email_model/model.json'), 'utf8'));
  const preserved = visit(canonical.root).flatMap(instance => instance.content_values ?? []).find(value => value.element_id === item.element_id && value.slot_id === item.slot_id);
  assert.deepEqual(preserved.value.segments, selectedSegments);
  assert.equal(digest(Buffer.from(JSON.stringify(canonical))), f.selectedSourceBinding.model_digest);
  assert.equal(f.last.comparison.model_digest, f.selectedSourceBinding.model_digest);
  assert.equal(f.last.modelRef.digest, f.selectedSourceBinding.model_digest);
  const urls = visit(canonical.root).flatMap(instance => instance.content_values ?? []).filter(value => value.value.type === 'url');
  assert.ok(urls.length > 0);
  assert.ok(urls.every(value => value.scope === 'all'), 'equal mobile and desktop answers retain explicit all scope');
  assert.ok(urls.some(value => value.value.value.startsWith('https://1cupis.ru/task5-final/')));
  assert.deepEqual(urls, visit(f.prepared.canonicalModel.root).flatMap(instance => instance.content_values ?? []).filter(value => value.value.type === 'url'));
  const html = await readFile(join(f.outputDir, 'email.html'), 'utf8');
  for (const field of inventory.fields.filter(field => !field.managed)) assert.ok(html.includes(document.answers[field.id]), `actual HTML contains final literal answer ${field.id}`);
  assert.match(html, /text-decoration:/u, 'existing registered inline styling is still rendered');
  const plain = html.replace(/<[^>]+>/gu, '');
  assert.ok(html.includes(literal) || plain.includes(literal), 'actual HTML retains joined literal source text');
});