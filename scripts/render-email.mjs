import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  indexComponentRegistries,
  loadComponentRegistries,
} from "./lib/component-registry.mjs";
import {
  loadEmailModel,
  validateEmailModelSemantics,
} from "./lib/email-model.mjs";
import { publishEmailAtomically } from "./lib/email-output.mjs";
import { postprocessEmail } from "./lib/email-postprocess.mjs";
import { renderEmailDocument } from "./lib/email-renderer.mjs";
import { loadRendererRegistry } from "./lib/renderer-registry.mjs";
import { loadRenderingFoundation } from "./lib/rendering-foundation.mjs";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!["--model", "--output"].includes(flag) || !value) {
      throw new Error("Usage: node scripts/render-email.mjs --model <temp-json> --output <version-folder>");
    }
    values[flag.slice(2)] = value;
  }
  if (!values.model || !values.output || argv.length !== 4) {
    throw new Error("Usage: node scripts/render-email.mjs --model <temp-json> --output <version-folder>");
  }
  return values;
}

function printDiagnostic(error) {
  const path = error?.path ?? "/";
  const code = error?.code ?? "EMAIL_RENDER_FAILED";
  const message = error?.message ?? String(error);
  return path + ": [" + code + "] " + message;
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  const modelPath = resolve(args.model);
  const outputDir = resolve(args.output);
  const [model, registries, rendererRegistry, rendering] = await Promise.all([
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
  };
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
  await publishEmailAtomically({
    outputDir,
    html,
    assets: rendered.assets.map((asset) => ({
      path: asset.path,
      sourcePath: join(modelFolder, ...asset.path.split("/")),
    })),
  });
  process.stdout.write(outputDir + "\n");
}

main().catch((error) => {
  const errors = error instanceof AggregateError ? error.errors : [error];
  for (const item of errors) {
    process.stderr.write(printDiagnostic(item) + "\n");
  }
  process.exitCode = error?.message?.startsWith("Usage:") ? 2 : 1;
});
