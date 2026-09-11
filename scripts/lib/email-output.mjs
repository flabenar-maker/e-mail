import { randomUUID } from "node:crypto";
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  rmdir,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, isAbsolute, join, posix, resolve, win32 } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";

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

function safeTarget(path) {
  return (
    typeof path === "string" &&
    path.startsWith("images/") &&
    !path.includes("\\") &&
    !path.split("/").includes("..") &&
    !isAbsolute(path) &&
    !win32.isAbsolute(path) &&
    posix.normalize(path) === path &&
    path.length > "images/".length
  );
}

async function validateAssets(assets) {
  const targets = new Map();
  for (const [index, asset] of (assets ?? []).entries()) {
    if (!safeTarget(asset.path)) {
      fail(
        "EMAIL_OUTPUT_ASSET_PATH_UNSAFE",
        "/assets/" + index + "/path",
        "Asset target must be a normalized relative path below images/.",
      );
    }
    const previous = targets.get(asset.path);
    if (previous && resolve(previous) !== resolve(asset.sourcePath)) {
      fail(
        "EMAIL_OUTPUT_ASSET_TARGET_CONFLICT",
        "/assets/" + index + "/path",
        "Different source files target " + asset.path + ".",
      );
    }
    targets.set(asset.path, asset.sourcePath);
    let source;
    try {
      source = await stat(asset.sourcePath);
    } catch {
      fail(
        "EMAIL_OUTPUT_ASSET_SOURCE_MISSING",
        "/assets/" + index + "/sourcePath",
        "Asset source does not exist.",
      );
    }
    if (!source.isFile()) {
      fail(
        "EMAIL_OUTPUT_ASSET_SOURCE_INVALID",
        "/assets/" + index + "/sourcePath",
        "Asset source must be a file.",
      );
    }
  }
  return [...targets.entries()]
    .map(([path, sourcePath]) => ({ path, sourcePath }))
    .sort((left, right) => left.path.localeCompare(right.path));
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

export async function publishEmailAtomically({ outputDir, html, assets = [] }) {
  if (typeof html !== "string" || html.length === 0) {
    fail("EMAIL_OUTPUT_HTML_INVALID", "/html", "Email HTML must be non-empty.");
  }
  const finalDir = resolve(outputDir);
  const parent = dirname(finalDir);
  const basename = finalDir.slice(parent.length + 1);
  if (!basename) {
    fail("EMAIL_OUTPUT_PATH_UNSAFE", "/outputDir", "Output directory is unsafe.");
  }

  const finalWasEmpty = await assertOutputAvailable(finalDir);
  const preparedAssets = await validateAssets(assets);
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
      await copyFile(asset.sourcePath, target);
    }

    if (await readFile(join(stagingDir, "email.html"), "utf8") !== html) {
      fail("EMAIL_OUTPUT_VALIDATION_FAILED", "/email.html", "Staged HTML did not validate.");
    }
    if (finalWasEmpty) await rmdir(finalDir);
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
