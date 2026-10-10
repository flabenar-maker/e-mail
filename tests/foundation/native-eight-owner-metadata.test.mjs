import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const ids = new Map([
  ['asset-header-logo-4x', 'product-cupis'],
  ['asset-header-logo-compact-4x', 'product-cupis'],
  ['asset-product-logo', 'product-cupis'],
  ['email-header', 'mobile'],
  ['banner-hero', 'mobile'],
  ['banner-secondary', 'mobile'],
  ['button-primary', 'desktop'],
  ['block-contact-support', 'desktop'],
]);
const htmlOwners = new Set(['email-header', 'banner-hero', 'banner-secondary', 'button-primary', 'block-contact-support']);
async function records() {
  const documents = await Promise.all(['shared', 'marketing', 'service'].map(async library =>
    JSON.parse(await readFile(join(repoRoot, `data/components/${library}.yaml`), 'utf8')),
  ));
  return documents.flatMap(document => document.components).filter(record => ids.has(record.id));
}

test('eight-owner repair declares one exact authenticated owner-controls proof per selected owner', async () => {
  const selected = await records();
  assert.equal(selected.length, 8, 'exact real canonical owner set');
  for (const record of selected) {
    const expectedVariantId = ids.get(record.id);
    const expectedVariant = record.variants.find(variant => variant.id === expectedVariantId);
    assert.ok(expectedVariant, `${record.id}: expected registered default variant`);
    const controls = (record.evidence_links?.native_relation_proofs ?? []).filter(proof => proof.kind === 'owner-controls');
    assert.equal(controls.length, 1, `${record.id}: one owner-controls proof`);
    assert.deepEqual(controls[0].source, {
      component_id: record.id,
      variant_node_id: expectedVariant.node_id,
      node_id: expectedVariant.node_id,
    }, `${record.id}: exact own default root`);
    assert.equal(controls[0].default_variant_id, expectedVariantId, `${record.id}: registered default variant`);
  }
});

test('five ordinary HTML owners retain typed aliases and own ordinary structure, without source-only blanket proofs', async () => {
  const selected = await records();
  for (const record of selected.filter(record => htmlOwners.has(record.id))) {
    const relations = record.evidence_links?.native_relation_proofs ?? [];
    const structures = relations.filter(proof => proof.kind === 'element-structure');
    assert.ok(structures.length > 0, `${record.id}: own structure proof`);
    assert.equal(structures.some(proof => /^\/contracts\/(?:mobile|desktop)\/root$/.test(proof.element_path)), true, `${record.id}: ordinary root structure proof`);
    const aliases = record.evidence_links?.native_fact_proofs ?? [];
    assert.ok(aliases.length > 0, `${record.id}: typed native aliases`);
    assert.equal(relations.some(proof => proof.kind === 'source-artwork-context' || proof.kind === 'rendered-artwork-context'), false, `${record.id}: no source-only blanket reference`);
  }
});
