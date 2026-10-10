import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadComponentEvidenceModel} from '../../scripts/lib/component-evidence-inputs.mjs';
import {auditFigmaContractFacts} from '../../scripts/lib/figma-contract-facts.mjs';
import {auditNativeContextProofs, applyNativeContextCoverage} from '../../scripts/lib/native-context-coverage.mjs';

// Controlled regression fixture only: byte-exact packets/session from the
// admitted 67 capture. No live MCP data and no component facts are authored.
const SOURCE_SHA = '67feb7c15bb5b7fcea082f67222d9b8ced909978';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const fixturePath = name => join(root, 'tests/foundation/fixtures/final-banners-67feb7c', name);
const ids = ['banner-hero', 'banner-secondary', 'button-primary', 'button-secondary'];
const imageTuplePaths = ['/fills/0/type', '/fills/0/visible', '/fills/0/opacity', '/fills/0/image_hash', '/fills/0/scale_mode', '/fills/0/image_transform/0/0', '/fills/0/image_transform/0/1', '/fills/0/image_transform/0/2', '/fills/0/image_transform/1/0', '/fills/0/image_transform/1/1', '/fills/0/image_transform/1/2', '/fills/0/scaling_factor', '/fills/0/rotation', '/fills/0/filters/exposure', '/fills/0/filters/contrast', '/fills/0/filters/saturation', '/fills/0/filters/temperature', '/fills/0/filters/tint', '/fills/0/filters/highlights', '/fills/0/filters/shadows'];

async function admittedFixture() {
  const model = await loadComponentEvidenceModel({repoRoot: root, canonicalSha: SOURCE_SHA});
  const session = JSON.parse(await readFile(fixturePath('session.json'), 'utf8'));
  const packets = Object.fromEntries(await Promise.all(ids.map(async id => [id, JSON.parse(await readFile(fixturePath(`${id}.json`), 'utf8'))])));
  for (const capture of session.captures) capture.packet = packets[capture.component_id];
  return {model, session, packets};
}
const clone = value => structuredClone(value);
const record = (model, id) => model.records.find(item => item.id === id);
const relation = (r, id) => r.evidence_links.native_relation_proofs.find(item => item.id === id);
function sourceNode(packet, nodeId) {
  const visit = node => {
    if (node?.node_id === nodeId) return node;
    for (const child of node?.children ?? []) { const found = visit(child); if (found) return found; }
  };
  for (const variant of packet.variants ?? []) { const found = visit(variant.source_node); if (found) return found; }
  throw new Error(`static packet does not contain node ${nodeId}`);
}
function addProof(r, proof) {
  r.evidence_links ??= {};
  r.evidence_links.native_context_proofs ??= [];
  if (!r.evidence_links.native_context_proofs.some(item => item.id === proof.id)) r.evidence_links.native_context_proofs.push(proof);
}
function prepared(base, spec) {
  const model = clone(base.model), session = clone(base.session), packets = clone(base.packets);
  for (const capture of session.captures) capture.packet = packets[capture.component_id];
  const owner = record(model, spec.componentId), consumer = relation(owner, spec.consumerStructureProofId), source = relation(owner, spec.sourceStructureProofId);
  assert.ok(consumer, `actual consumer relation ${spec.consumerStructureProofId}`);
  assert.ok(source, `actual source relation ${spec.sourceStructureProofId}`);
  // This is the existing strict source kind. The source structure is real
  // capture metadata, not a copied consumer id or a fabricated component fact.
  addProof(owner, {id: spec.sourcePaintProofId, kind: 'image-fill-paint-context', structure_proof_id: source.id});
  addProof(owner, {id: spec.consumerProofId, kind: 'image-fill-consumer-context', structure_proof_id: consumer.id, source_structure_proof_id: source.id});
  return {model, session, packet: packets[spec.componentId], record: owner, consumer: sourceNode(packets[spec.componentId], consumer.source.node_id), source: sourceNode(packets[spec.componentId], source.source.node_id), spec};
}
function reports(f) {
  const facts = auditFigmaContractFacts({record: f.record, live: f.packet});
  const context = auditNativeContextProofs({record: f.record, model: f.model, session: f.session});
  return {facts, context, effective: applyNativeContextCoverage({facts, coverage: context})};
}
function assertOnlyImageTupleCovered(f) {
  const {context, effective} = reports(f);
  assert.equal(context.ok, true, JSON.stringify(context.issues));
  for (const path of imageTuplePaths) assert.equal(effective.issues.some(issue => issue.node_id === f.consumer.node_id && issue.source_path === path), false, path);
  assert.ok(effective.issues.some(issue => issue.node_id !== f.consumer.node_id), 'proof does not waive unrelated parent obligations');
}
function assertRejected(f) {
  const {context, effective} = reports(f);
  assert.equal(context.ok, false, JSON.stringify(context.issues));
  assert.ok(effective.issues.some(issue => issue.node_id === f.consumer.node_id && imageTuplePaths.includes(issue.source_path)), 'the image tuple remains uncovered');
}

const cases = [
  // Consumer Hero Mobile is independently compared with actual Desktop Hero source.
  {label: 'Hero Mobile', componentId: 'banner-hero', consumerStructureProofId: 'native-mobile-root-card-hero-image-structure', sourceStructureProofId: 'native-desktop-root-card-hero-image-structure', sourcePaintProofId: 'native-image-fill-desktop-hero-source', consumerProofId: 'native-image-fill-mobile-hero-consumer'},
  // Consumer Secondary Desktop is independently compared with actual Mobile Secondary source.
  {label: 'Secondary Desktop', componentId: 'banner-secondary', consumerStructureProofId: 'native-desktop-root-card-secondary-image-structure', sourceStructureProofId: 'native-mobile-root-card-secondary-image-structure', sourcePaintProofId: 'native-image-fill-mobile-secondary-image', consumerProofId: 'native-image-fill-desktop-secondary-consumer'},
];
const base = await admittedFixture();
for (const spec of cases) test(`${spec.label}: equal flat IMAGE tuple is covered by its independent source`, () => assertOnlyImageTupleCovered(prepared(base, spec)));

test('consumer kind starts RED as unsupported, without an import or fixture harness failure', () => {
  const f = prepared(base, cases[0]);
  const {context} = reports(f);
  assert.equal(context.ok, true, JSON.stringify(context.issues));
});

const negativeCases = [
  ['different hash', f => { f.consumer.fills[0].image_hash = 'different'; }],
  ['active filter', f => { f.consumer.fills[0].filters.tint = 1; }],
  ['nonidentity transform', f => { f.consumer.fills[0].image_transform[0][2] = .1; }],
  ['source proof removed', f => { f.record.evidence_links.native_context_proofs = f.record.evidence_links.native_context_proofs.filter(proof => proof.id !== f.spec.sourcePaintProofId); }],
  ['source geometry invalid', f => { f.source.reference_dimensions.width += 1; }],
  ['unknown paint key', f => { f.consumer.fills[0].unknown = true; }],
  ['consumer minimum width unmapped', f => { f.consumer.minimum_width_px = 1; }],
  ['consumer grow unmapped', f => { f.consumer.layout_grow = 1; }],
];
for (const [label, mutate] of negativeCases) test(`Hero Mobile consumer rejects ${label}`, () => { const f = prepared(base, cases[0]); mutate(f); assertRejected(f); });

test('source image-fill-paint-context remains strict and is not replaced by consumer kind', () => {
  const f = prepared(base, cases[1]);
  const sourceProof = f.record.evidence_links.native_context_proofs.find(proof => proof.id === f.spec.sourcePaintProofId);
  sourceProof.kind = 'image-fill-consumer-context';
  assertRejected(f);
});
