import { execFileSync } from 'node:child_process';
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEmailModel } from './lib/email-model.mjs';
import { loadComponentRegistries, indexComponentRegistries } from './lib/component-registry.mjs';
import { loadEmailDeliveryProfiles, selectDeliveryProfile, loadDeliveryDocument } from './lib/email-delivery-profile.mjs';
import { collectEmailActions } from './lib/email-action-inventory.mjs';
import { createDeliveryDraft, renderDeliveryForm } from './lib/email-delivery-form.mjs';
import { formatRendererDiagnostics } from './lib/diagnostics.mjs';

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const usage = 'Usage: node scripts/prepare-email-delivery.mjs --model <logical-model.json> --output <new-intake-folder> [--profile <id>] [--delivery <known-delivery.json>]';
async function main() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 2) {
    if (!['--model','--output','--profile','--delivery'].includes(argv[i]) || !argv[i + 1] || Object.hasOwn(args, argv[i])) throw new Error(usage);
    args[argv[i]] = argv[i + 1];
  }
  if (!args['--model'] || !args['--output']) throw new Error(usage);
  const sourceSha = process.env.CUPIS_SYSTEM_COMMIT ?? execFileSync('git', ['rev-parse','HEAD'], {cwd:repoRoot,encoding:'utf8'}).trim();
  if (!/^[0-9a-f]{40}$/u.test(sourceSha)) throw new Error('EMAIL_DELIVERY_SOURCE_UNKNOWN');
  const [model, registries] = await Promise.all([
    loadEmailModel({ modelPath:resolve(args['--model']),schemaPath:join(repoRoot,'schemas/email-model.schema.json'),preserveRichTextRuns:true }),
    loadComponentRegistries({ repoRoot }),
  ]);
  const componentIndex = indexComponentRegistries(registries);
  const profile = selectDeliveryProfile(await loadEmailDeliveryProfiles({ repoRoot, componentIndex }), args['--profile']);
  const inventory = collectEmailActions({ model, componentIndex, profile });
  if (inventory.diagnostics.length) throw new AggregateError(inventory.diagnostics, 'Email research is blocked.');
  const deliveryMetadata = args['--delivery'] ? await loadDeliveryDocument(resolve(args['--delivery'])) : undefined;
  if (deliveryMetadata && deliveryMetadata.email_id !== model.id) throw new Error('EMAIL_DELIVERY_EMAIL_MISMATCH');
  const deliveryDraft = createDeliveryDraft({ emailId:model.id, inventory, profile, sourceSha, deliveryMetadata });
  const output = resolve(args['--output']);
  const staging = output + '.intake-' + randomUUID();
  await mkdir(dirname(output), {recursive:true});
  // Reserve a new destination; never replace an existing intake or its answers.
  await mkdir(output);
  try {
    await mkdir(staging);
    await writeFile(join(staging,'delivery.json'), JSON.stringify(deliveryDraft,null,2) + '\n', 'utf8');
    await writeFile(join(staging,'form.html'), renderDeliveryForm({ inventory, deliveryDraft }), 'utf8');
    await rename(join(staging,'delivery.json'),join(output,'delivery.json'));
    await rename(join(staging,'form.html'),join(output,'form.html'));
    process.stdout.write(join(output,'form.html') + '\n');
  } catch (error) {
    await rm(output, {recursive:true,force:true});
    throw error;
  } finally { await rm(staging, {recursive:true,force:true}); }
}
main().catch(error => {
  process.stderr.write(formatRendererDiagnostics(error instanceof AggregateError ? error.errors : [error]) + '\n');
  process.exitCode = error.message === usage ? 2 : 1;
});
