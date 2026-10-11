import { planTemplateRules, buildPersonalizationPreview } from "./lib/email-template-rules.mjs";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { serializeEmailHtml } from "./lib/email-html-serializer.mjs";
import { rebasePackageResources } from "./lib/email-resource-references.mjs";
import { buildPlainText } from "./lib/email-plain-text.mjs";
import { buildAltcraftEntries } from "./lib/email-altcraft-package.mjs";
import { encodeZipStore } from "./lib/zip-store.mjs";
import { validateEmbeddedCssBudget, measureEmailOutput } from "./lib/email-metrics.mjs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { formatRendererDiagnostics } from "./lib/diagnostics.mjs";
import {
  indexComponentRegistries,
  loadComponentRegistries,
} from "./lib/component-registry.mjs";
import {
  loadEmailModel,
  validateEmailModelSemantics,
} from "./lib/email-model.mjs";
import { publishEmailAtomically, publishFileSetAtomically } from "./lib/email-output.mjs";
import { postprocessEmail } from "./lib/email-postprocess.mjs";
import { renderEmailDocument } from "./lib/email-renderer.mjs";
import { loadDeliveryDocument } from "./lib/email-delivery-profile.mjs";
import { prepareEmailDelivery } from "./lib/email-delivery.mjs";
import { loadRendererRegistry } from "./lib/renderer-registry.mjs";
import { loadRenderingFoundation } from "./lib/rendering-foundation.mjs";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!["--model", "--output", "--delivery"].includes(flag) || !value) {
      throw new Error("Usage: node scripts/render-email.mjs --model <temp-json> --output <version-folder>");
    }
    values[flag.slice(2)] = value;
  }
  if (!values.model || !values.output || ![4,6].includes(argv.length)) {
    throw new Error("Usage: node scripts/render-email.mjs --model <temp-json> --output <version-folder>");
  }
  return values;
}

function resolveSystemCommit() {
  const explicit = process.env.CUPIS_SYSTEM_COMMIT;
  if (/^[0-9a-f]{40}$/u.test(explicit ?? "")) return explicit;
  try {
    const value = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return /^[0-9a-f]{40}$/u.test(value) ? value : "unknown";
  } catch {
    return "unknown";
  }
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  const modelPath = resolve(args.model);
  const outputDir = resolve(args.output);
  const [originalModel, registries, rendererRegistry, rendering] = await Promise.all([
    loadEmailModel({
      modelPath,
      schemaPath: join(repoRoot, "schemas", "email-model.schema.json"),
    }),
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadRenderingFoundation({ repoRoot }),
  ]);
  const dependencies = {
    rendererRegistry,
    componentIndex: indexComponentRegistries(registries),
    foundations: { rendering },
    systemCommit: resolveSystemCommit(),
  };
  const delivery = args.delivery ? await prepareEmailDelivery({
    repoRoot, model:originalModel, componentIndex:dependencies.componentIndex,
    document:await loadDeliveryDocument(resolve(args.delivery)),
    purpose:"final", sourceSha:dependencies.systemCommit,
  }) : undefined;
  const model = delivery?.model ?? originalModel;
  if (delivery) Object.assign(dependencies, {deliveryProfile:delivery.profile, outputBindings:delivery.outputBindings, deliveryDocument:delivery.document, deliveryInventory:delivery.inventory, designModel:originalModel});
  if (delivery) dependencies.templateRules = planTemplateRules({model:originalModel,inventory:delivery.inventory,profile:delivery.profile});
  const semanticErrors = validateEmailModelSemantics(model, dependencies);
  if (semanticErrors.length > 0) {
    throw new AggregateError(semanticErrors, "Email model semantic validation failed.");
  }

  const rendered = renderEmailDocument(model, dependencies);
  if (rendered.diagnostics.length > 0) {
    throw new AggregateError(rendered.diagnostics, "Email rendering failed.");
  }
  const html = postprocessEmail({
    html: rendered.html,
    policy: {
      transformers: rendering.postprocessing.allowed,
      assetPaths: rendered.assets.map((asset) => asset.path),
    },
  });
  const modelFolder = dirname(modelPath);
  if (delivery) {
    const structured = serializeEmailHtml({html,protectedFragments:(rendered.protectedFragments??[]).map(fragment=>{const start=html.indexOf(fragment.text);if(start<0)throw new Error("EMAIL_SERVICE_FRAGMENT_MISSING");return {start,end:start+fragment.text.length};})});
    if (structured.diagnostics.length) throw new AggregateError(structured.diagnostics, "HTML serialization failed.");
    const assetBuffers = new Map(await Promise.all(rendered.assets.map(async asset => [asset.path,await readFile(join(modelFolder,...asset.path.split("/")))])));
    const rebased = rebasePackageResources({html:structured.html,assetPaths:[...assetBuffers.keys()],htmlEntry:delivery.profile.package.html_entry,assetRootEntry:delivery.profile.package.asset_root_entry});
    if (rebased.diagnostics.length) throw new AggregateError(rebased.diagnostics, "Package resources failed.");
    const packageStructured = serializeEmailHtml({html:rebased.html,protectedFragments:(rendered.protectedFragments??[]).map(fragment=>{const start=rebased.html.indexOf(fragment.text);if(start<0)throw new Error("EMAIL_SERVICE_FRAGMENT_MISSING");return {start,end:start+fragment.text.length};})});
    if(packageStructured.diagnostics.length)throw new AggregateError(packageStructured.diagnostics,"Package HTML serialization failed.");
    const css = [...packageStructured.html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/giu)].map(match => match[1]).join("");
    const budget = validateEmbeddedCssBudget(css, rendering.embedded_css.max_bytes_exclusive);
    if (budget.length) throw new AggregateError(budget,"Final CSS budget exceeded.");
    const plainText = buildPlainText({model:originalModel,inventory:delivery.inventory,deliveryDocument:delivery.document,profile:delivery.profile,templateRules:dependencies.templateRules});
    const packaged = buildAltcraftEntries({html:packageStructured.html,assetBuffers,deliveryDocument:delivery.document,plainText,profile:delivery.profile});
    if (packaged.diagnostics.length) throw new AggregateError(packaged.diagnostics,"Package construction failed.");
    const zip = encodeZipStore(packaged.entries);
    const hash = bytes => createHash("sha256").update(bytes).digest("hex");
    const report = {schema_version:"1.0.0",source_sha:dependencies.systemCommit,profile_id:delivery.profile.id,profile_version:delivery.profile.version,serializer_version:"1.0.0",package_id:delivery.profile.package.id,readiness:"ready",external_acceptance:"not-run",metrics:measureEmailOutput({html:packageStructured.html,css}),html_sha256:hash(packageStructured.html),archive_sha256:hash(zip),assets:[...assetBuffers].map(([path,bytes])=>({path,sha256:hash(bytes)}))};
    const requiredFields=delivery.inventory.fields.filter(field=>field.required);
    report.link_readiness={status:"ready",inventory_digest:delivery.inventory.inventory_digest,field_count:delivery.inventory.fields.length,required_count:requiredFields.length,resolved_required_count:requiredFields.length};
    // These are checks performed by this build, not a claim about test suites or clients.
    report.local_checks={delivery_inputs:"passed",model_semantics:"passed",rendering:"passed",html_serialization:"passed",resource_references:"passed",css_budget:"passed",plain_text:"passed",package_entries:"passed"};
    report.package_file_count=packaged.entries.length;
    report.emission_profile=rendered.emission_profile;
    report.effective_fallback=rendered.effective_fallback;
    report.service_rules_version=dependencies.templateRules.version;
    const previews = [];
    for (const [path,first_name] of [["preview-name.html","алексей"],["preview-empty-name.html",""],["preview-long-name.html","Александра-Виктория"]]) {
      const input = buildPersonalizationPreview({emissionInput:{model,templateRules:dependencies.templateRules},scenario:{first_name}});
      const previewRendered = renderEmailDocument(input.model,{...dependencies,previewValues:input.previewValues});
      if(previewRendered.diagnostics.length)throw new AggregateError(previewRendered.diagnostics,"Personalization preview failed.");
      const previewStructured=serializeEmailHtml({html:previewRendered.html,protectedFragments:(previewRendered.protectedFragments??[]).map(fragment=>{const start=previewRendered.html.indexOf(fragment.text);return {start,end:start+fragment.text.length};})});
      if(previewStructured.diagnostics.length)throw new AggregateError(previewStructured.diagnostics,"Preview serialization failed.");
      previews.push({path,bytes:Buffer.from(previewStructured.html,"utf8")});
    }
    report.preview_files=previews.map(entry=>entry.path);
    report.local_checks.personalization_previews="passed";
    await publishFileSetAtomically({outputDir,entries:[
      ...previews,
      {path:"email.html",bytes:Buffer.from(structured.html,"utf8")},
      ...[...assetBuffers].map(([path,bytes])=>({path,bytes})),
      {path:"altcraft.zip",bytes:zip},
      {path:"release-report.json",bytes:Buffer.from(JSON.stringify(report,null,2)+"\n","utf8")},
    ]});
  } else {
  await publishEmailAtomically({
    outputDir,
    html,
    assets: rendered.assets.map((asset) => ({
      path: asset.path,
      sourcePath: join(modelFolder, ...asset.path.split("/")),
    })),
  });
  }
  process.stdout.write(outputDir + "\n");
}

main().catch((error) => {
  const errors = error instanceof AggregateError ? error.errors : [error];
  const output = formatRendererDiagnostics(errors);
  if (output) process.stderr.write(output + "\n");
  process.exitCode = error?.message?.startsWith("Usage:") ? 2 : 1;
});
