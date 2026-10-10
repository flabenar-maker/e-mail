import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadComponentEvidenceModel} from '../../scripts/lib/component-evidence-inputs.mjs';
import {auditFigmaComponentEvidence} from '../../scripts/lib/figma-component-evidence.mjs';

// Controlled regression fixture only: byte-exact packets/session derived from
// the admitted 67 capture. It is not a new MCP capture or P2 acceptance.
const SOURCE_SHA = '67feb7c15bb5b7fcea082f67222d9b8ced909978';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ids = ['banner-hero', 'banner-secondary', 'button-primary', 'button-secondary'];
const fixturePath = name => join(root, 'tests/foundation/fixtures/final-banners-67feb7c', name);

async function fixture() {
  const model = await loadComponentEvidenceModel({repoRoot: root, canonicalSha: SOURCE_SHA});
  const session = JSON.parse(await readFile(fixturePath('session.json'), 'utf8'));
  const packets = Object.fromEntries(await Promise.all(ids.map(async id => [
    id,
    JSON.parse(await readFile(fixturePath(id + '.json'), 'utf8')),
  ])));
  for (const capture of session.captures) capture.packet = packets[capture.component_id];
  return {model, session, packets};
}

const record = (f, id) => f.model.records.find(item => item.id === id);
const secondarySourceIssues = report => report.issues.filter(item =>
  item.code === 'NESTED_HTML_SOURCE_UNVERIFIED' && item.component_id === 'button-secondary',
);

test('actual 67 Button/Secondary packet closes only with qualified owned proof metadata', async () => {
  const f = await fixture();
  const report = auditFigmaComponentEvidence({
    record: record(f, 'button-secondary'),
    live: f.packets['button-secondary'],
    model: f.model,
    session: f.session,
  });
  assert.equal(report.ok, true, JSON.stringify(report.issues));
  assert.equal(report.effective_facts.issues.length, 0, JSON.stringify(report.effective_facts.issues));
  assert.equal(report.native_relation_proofs.ok, true);
  assert.equal(report.native_context_proofs.ok, true);
  assert.equal(report.native_variable_proofs.ok, true);
});

test('Banner/Secondary can borrow only a qualified Button/Secondary child source', async () => {
  const f = await fixture();
  const report = auditFigmaComponentEvidence({
    record: record(f, 'banner-secondary'),
    live: f.packets['banner-secondary'],
    model: f.model,
    session: f.session,
  });
  assert.equal(report.nested_html.ok, true, JSON.stringify(report.nested_html.issues));
  assert.deepEqual(secondarySourceIssues(report), []);
  assert.ok(report.facts.issues.length > 0, 'unrelated parent source obligations stay separate');
});

test('Banner/Secondary refuses the child when its html-element boundary is removed', async () => {
  const f = await fixture();
  const child = record(f, 'button-secondary');
  child.evidence_links ??= {};
  child.evidence_links.native_context_proofs = (child.evidence_links.native_context_proofs ?? []).filter(
    proof => proof.kind !== 'html-element-context',
  );
  const report = auditFigmaComponentEvidence({
    record: record(f, 'banner-secondary'),
    live: f.packets['banner-secondary'],
    model: f.model,
    session: f.session,
  });
  assert.equal(report.nested_html.ok, false);
  assert.ok(secondarySourceIssues(report).length > 0);
});
