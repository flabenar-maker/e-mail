import { randomUUID } from "node:crypto";
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  rmdir,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateZipEntryPath } from "./zip-store.mjs";
import { readContainedAssetBytes } from "./email-asset-bytes.mjs";

function fail(code, path, message) {
  throw new SystemValidationError(code, path, message);
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function validateAssets(assets, assetRoot) {
  if (Array.isArray(assets)) {
    for (const [index, asset] of assets.entries()) {
      if (!validateZipEntryPath(asset.path) || !asset.path.startsWith("images/")) {
        fail("EMAIL_OUTPUT_ASSET_PATH_UNSAFE", `/assets/${index}/path`, "Asset target must be a safe path below images/.");
      }
      if (typeof asset.sourcePath !== "string" || asset.sourcePath.trim() === "") {
        fail("EMAIL_OUTPUT_ASSET_SOURCE_MISSING", `/assets/${index}/sourcePath`, "Asset source is required.");
      }
    }
  }
  try {
    return await readContainedAssetBytes({ assets, assetRoot });
  } catch (error) {
    if (error instanceof SystemValidationError && error.code.startsWith("EMAIL_ASSET_")) {
      fail(error.code.replace(/^EMAIL_ASSET_/u, "EMAIL_OUTPUT_ASSET_"), error.path, error.message);
    }
    throw error;
  }
}

async function assertOutputAvailable(outputDir) {
  if (!(await exists(outputDir))) return false;
  const outputStat = await stat(outputDir);
  if (!outputStat.isDirectory()) {
    fail(
      "EMAIL_OUTPUT_EXISTS",
      "/outputDir",
      "The output path already exists and is not an empty directory.",
    );
  }
  if ((await readdir(outputDir)).length > 0) {
    fail(
      "EMAIL_OUTPUT_EXISTS",
      "/outputDir",
      "The output directory already exists and is not empty.",
    );
  }
  return true;
}

export async function publishEmailAtomically({ outputDir, html, assets = [], assetRoot }) {
  if (typeof html !== "string" || html.length === 0) {
    fail("EMAIL_OUTPUT_HTML_INVALID", "/html", "Email HTML must be non-empty.");
  }
  const finalDir = resolve(outputDir);
  const parent = dirname(finalDir);
  const basename = finalDir.slice(parent.length + 1);
  if (!basename) {
    fail("EMAIL_OUTPUT_PATH_UNSAFE", "/outputDir", "Output directory is unsafe.");
  }

  const privateAssets = assets == null ? [] : Array.isArray(assets)
    ? assets.map(asset => ({ path: asset?.path, sourcePath: asset?.sourcePath })) : assets;
  const finalWasEmpty = await assertOutputAvailable(finalDir);
  const preparedAssets = await validateAssets(privateAssets, assetRoot);
  await mkdir(parent, { recursive: true });

  const stagingDir = join(parent, "." + basename + ".staging-" + randomUUID());
  const expectedPrefix = join(parent, "." + basename + ".staging-");
  if (dirname(stagingDir) !== parent || !stagingDir.startsWith(expectedPrefix)) {
    fail("EMAIL_OUTPUT_STAGING_UNSAFE", "/outputDir", "Staging path escaped its parent.");
  }

  try {
    await mkdir(stagingDir);
    await writeFile(join(stagingDir, "email.html"), html, "utf8");
    await mkdir(join(stagingDir, "images"));
    for (const asset of preparedAssets) {
      const target = join(stagingDir, ...asset.path.split("/"));
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, asset.bytes);
      if (!(await readFile(target)).equals(asset.bytes)) {
        fail("EMAIL_OUTPUT_VALIDATION_FAILED", "/" + asset.path, "Staged asset bytes differ.");
      }
    }

    if (await readFile(join(stagingDir, "email.html"), "utf8") !== html) {
      fail("EMAIL_OUTPUT_VALIDATION_FAILED", "/email.html", "Staged HTML did not validate.");
    }
    if (finalWasEmpty) await rmdir(finalDir);
    else if (await exists(finalDir)) fail("EMAIL_OUTPUT_EXISTS", "/outputDir", "Destination appeared during staging.");
    await rename(stagingDir, finalDir);
  } catch (error) {
    if (dirname(stagingDir) === parent && stagingDir.startsWith(expectedPrefix)) {
      await rm(stagingDir, { recursive: true, force: true });
    }
    throw error;
  }

  return {
    outputDir: finalDir,
    files: ["email.html", "images/"],
  };
}

export async function publishFileSetAtomically({outputDir,entries}) {
  const targets=new Set(),folded=new Set();
  if(!Array.isArray(entries)||!entries.length)fail('EMAIL_OUTPUT_ENTRIES_INVALID','/entries','At least one file is required.');
  for(const entry of entries) {
    if(!validateZipEntryPath(entry.path)||targets.has(entry.path)||folded.has(entry.path.toLowerCase())||!Buffer.isBuffer(entry.bytes))fail('EMAIL_OUTPUT_ENTRY_INVALID','/entries','Unsafe, duplicate, or incomplete file entry.');
    targets.add(entry.path);folded.add(entry.path.toLowerCase());
  }
  const finalDir=resolve(outputDir),parent=dirname(finalDir),basename=finalDir.slice(parent.length+1);
  if(!basename)fail('EMAIL_OUTPUT_PATH_UNSAFE','/outputDir','Output directory is unsafe.');
  const wasEmpty=await assertOutputAvailable(finalDir);
  await mkdir(parent,{recursive:true});
  const staging=join(parent,'.'+basename+'.staging-'+randomUUID());
  try {
    await mkdir(staging);
    for(const entry of entries) {
      const target=join(staging,...entry.path.split('/'));
      await mkdir(dirname(target),{recursive:true});await writeFile(target,entry.bytes);
      if(!(await readFile(target)).equals(entry.bytes))fail('EMAIL_OUTPUT_VALIDATION_FAILED','/'+entry.path,'Staged bytes differ.');
    }
    // rmdir only accepts an empty destination; a concurrent writer blocks publish.
    if(wasEmpty)await rmdir(finalDir);
    else if(await exists(finalDir))fail('EMAIL_OUTPUT_EXISTS','/outputDir','Destination appeared during staging.');
    await rename(staging,finalDir);
  } catch(error) {
    if(dirname(staging)===parent && staging.startsWith(join(parent,'.'+basename+'.staging-')))await rm(staging,{recursive:true,force:true});
    throw error;
  }
  return {outputDir:finalDir,files:[...targets].sort()};
}
