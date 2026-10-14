import { constants } from "node:fs";
import { open, realpath, stat } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import { SystemValidationError } from "./diagnostics.mjs";
import { validateZipEntryPath } from "./zip-store.mjs";

function fail(code, path, message) {
  throw new SystemValidationError("EMAIL_ASSET_" + code, path, message);
}

function inside(root, path) {
  const remainder = relative(root, path);
  return remainder === "" || (!isAbsolute(remainder) && remainder !== ".." &&
    !remainder.startsWith("../") && !remainder.startsWith("..\\"));
}

function sameIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode;
}

function sameFile(left, right) {
  return left.isFile() && right.isFile() && sameIdentity(left, right) &&
    left.size === right.size && left.mtimeNs === right.mtimeNs && left.ctimeNs === right.ctimeNs;
}

// Content is read once through an owned handle. Consumers publish or hash this result.
export async function readContainedAssetBytes({ assetRoot, assets = [] } = {}) {
  if (!Array.isArray(assets)) fail("DESCRIPTORS_INVALID", "/assets", "Assets must be an array.");
  if (assets.length === 0) return [];
  if (typeof assetRoot !== "string" || assetRoot.trim() === "") {
    fail("ROOT_REQUIRED", "/assetRoot", "A trusted asset root is required.");
  }
  const root = resolve(assetRoot);
  const targets = new Map(), folded = new Map();
  // Copy all descriptor strings before the first asynchronous operation.
  for (const [index, asset] of assets.entries()) {
    const path = asset?.path;
    if (!validateZipEntryPath(path) || !path.startsWith("images/")) {
      fail("PATH_UNSAFE", `/assets/${index}/path`, "Asset target must be a safe path below images/.");
    }
    const explicit = Object.hasOwn(asset, "sourcePath");
    const supplied = explicit ? asset.sourcePath : join(root, ...path.split("/"));
    if (typeof supplied !== "string" || supplied.trim() === "") {
      fail("SOURCE_MISSING", `/assets/${index}/sourcePath`, "Asset source is required.");
    }
    // Explicit paths retain Node's existing CWD-relative filesystem semantics.
    const sourcePath = resolve(supplied);
    if (!inside(root, sourcePath)) {
      fail("SOURCE_OUTSIDE_ROOT", `/assets/${index}/sourcePath`, "Asset source escapes its trusted root.");
    }
    const previous = targets.get(path), caseAlias = folded.get(path.toLowerCase());
    if ((previous && previous.sourcePath !== sourcePath) || (caseAlias && caseAlias !== path)) {
      fail("TARGET_CONFLICT", `/assets/${index}/path`, "Asset targets must be unique, including case.");
    }
    if (!previous) targets.set(path, { path, sourcePath, index });
    folded.set(path.toLowerCase(), path);
  }

  let physicalRoot, rootIdentity;
  try {
    physicalRoot = await realpath(root);
    rootIdentity = await stat(physicalRoot, { bigint: true });
  } catch {
    fail("ROOT_INVALID", "/assetRoot", "Asset root must be an existing directory.");
  }
  if (!rootIdentity.isDirectory()) fail("ROOT_INVALID", "/assetRoot", "Asset root must be a directory.");

  const entries = [];
  for (const asset of [...targets.values()].sort((left, right) => left.path.localeCompare(right.path))) {
    const diagnosticPath = `/assets/${asset.index}/sourcePath`;
    let handle;
    try {
      const physical = await realpath(asset.sourcePath);
      if (!inside(physicalRoot, physical)) {
        fail("SOURCE_OUTSIDE_ROOT", diagnosticPath, "Asset link escapes its trusted root.");
      }
      const before = await stat(physical, { bigint: true });
      if (!before.isFile()) fail("SOURCE_INVALID", diagnosticPath, "Asset source must be an ordinary file.");
      handle = await open(physical, constants.O_RDONLY | (constants.O_NONBLOCK ?? 0));
      const opened = await handle.stat({ bigint: true });
      if (!sameFile(before, opened)) fail("SOURCE_CHANGED", diagnosticPath, "Asset changed before reading.");
      const bytes = await handle.readFile();
      const after = await handle.stat({ bigint: true });
      const currentRoot = await realpath(root);
      const currentPhysical = await realpath(asset.sourcePath);
      const currentRootIdentity = await stat(currentRoot, { bigint: true });
      const currentSource = await stat(currentPhysical, { bigint: true });
      if (!sameFile(opened, after) || BigInt(bytes.length) !== after.size ||
          currentRoot !== physicalRoot || !currentRootIdentity.isDirectory() ||
          !sameIdentity(rootIdentity, currentRootIdentity) || currentPhysical !== physical ||
          !inside(currentRoot, currentPhysical) || !sameFile(after, currentSource)) {
        fail("SOURCE_CHANGED", diagnosticPath, "Asset or trusted root changed while reading.");
      }
      entries.push({ path: asset.path, bytes });
    } catch (error) {
      if (error instanceof SystemValidationError) throw error;
      if (error?.code === "ENOENT" || error?.code === "ENOTDIR") {
        fail("SOURCE_MISSING", diagnosticPath, "Asset source does not exist.");
      }
      fail("SOURCE_INVALID", diagnosticPath, "Asset source could not be read as an ordinary file.");
    } finally {
      if (handle) await handle.close();
    }
  }
  return entries;
}
