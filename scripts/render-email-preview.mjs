import { planTemplateRules, buildPersonalizationPreview } from "./lib/email-template-rules.mjs";
import { serializeEmailHtml } from "./lib/email-html-serializer.mjs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";

import { formatRendererDiagnostics } from "./lib/diagnostics.mjs";
import { readContainedAssetBytes } from "./lib/email-asset-bytes.mjs";
import {
  indexComponentRegistries,
  loadComponentRegistries,
} from "./lib/component-registry.mjs";
import {
  loadEmailModel,
  validateEmailModelSemantics,
} from "./lib/email-model.mjs";
import { postprocessEmail } from "./lib/email-postprocess.mjs";
import { buildEmailPreview } from "./lib/email-preview.mjs";
import { renderEmailDocument } from "./lib/email-renderer.mjs";
import { loadDeliveryDocument } from "./lib/email-delivery-profile.mjs";
import { prepareEmailDelivery, validateDeliveryDocument } from "./lib/email-delivery.mjs";
import { loadRendererRegistry } from "./lib/renderer-registry.mjs";
import { loadRenderingFoundation } from "./lib/rendering-foundation.mjs";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const USAGE = "Usage: node scripts/render-email-preview.mjs --model <json> --mode normal|no-style --output <html-file>";

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!["--model", "--mode", "--output", "--delivery", "--name"].includes(flag) || !value) {
      throw new Error(USAGE);
    }
    values[flag.slice(2)] = value;
  }
  if (!values.model || !values.mode || !values.output || ![6,8,10].includes(argv.length)) {
    throw new Error(USAGE);
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
  const outputPath = resolve(args.output);
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
    purpose:"preview", sourceSha:dependencies.systemCommit,
  }) : undefined;
  const model = delivery?.model ?? originalModel;
  if (delivery) Object.assign(dependencies, {deliveryProfile:delivery.profile, outputBindings:delivery.outputBindings, deliveryDocument:delivery.document, deliveryInventory:delivery.inventory, designModel:originalModel});
  if (delivery) dependencies.templateRules = planTemplateRules({model:originalModel,inventory:delivery.inventory,profile:delivery.profile});
  const semanticErrors = validateEmailModelSemantics(model, dependencies);
  if (semanticErrors.length > 0) {
    throw new AggregateError(semanticErrors, "Email model semantic validation failed.");
  }

  if (args.name && !delivery) throw new Error("A personalization preview requires --delivery.");
  if (args.name) { const input = buildPersonalizationPreview({emissionInput:{model,templateRules:dependencies.templateRules},scenario:{first_name:args.name === "empty" ? "" : args.name}}); dependencies.previewValues=input.previewValues; }
  const rendered = renderEmailDocument(model, dependencies);
  if (rendered.diagnostics.length > 0) {
    throw new AggregateError(rendered.diagnostics, "Email rendering failed.");
  }
  await readContainedAssetBytes({ assetRoot: dirname(modelPath), assets: rendered.assets });
  const html = postprocessEmail({
    html: rendered.html,
    policy: {
      transformers: rendering.postprocessing.allowed,
      assetPaths: rendered.assets.map((asset) => asset.path),
    },
  });
  const structured = delivery ? serializeEmailHtml({html,protectedFragments:(rendered.protectedFragments??[]).map(fragment=>{const start=html.indexOf(fragment.text);if(start<0)throw new Error("EMAIL_SERVICE_FRAGMENT_MISSING");return {start,end:start+fragment.text.length};})}) : {html,diagnostics:[]};
  if (structured.diagnostics.length) throw new AggregateError(structured.diagnostics,"HTML serialization failed.");
  const finalDiagnostics=delivery?validateDeliveryDocument({document:delivery.document,inventory:delivery.inventory,profile:delivery.profile,purpose:"final",sourceSha:dependencies.systemCommit,emailId:originalModel.id}):[];
  const labelledHtml=delivery?structured.html.replace("<head>",`<head>\n<title>Предпросмотр${finalDiagnostics.length?" — данные для выпуска неполные":""}</title>\n<!-- CUPIS preview: readiness=${finalDiagnostics.length?"incomplete":"ready"}; purpose=preview; emission_profile=${rendered.emission_profile.id}@${rendered.emission_profile.version}; effective_fallback=${rendered.effective_fallback}; service_rules_version=${dependencies.templateRules.version} -->`):structured.html;
  const preview = buildEmailPreview({ html:labelledHtml, mode: args.mode });
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, preview, "utf8");
  process.stdout.write(outputPath + "\n");
}

main().catch((error) => {
  const errors = error instanceof AggregateError ? error.errors : [error];
  const output = formatRendererDiagnostics(errors);
  if (output) process.stderr.write(output + "\n");
  process.exitCode = error?.message === USAGE ? 2 : 1;
});
