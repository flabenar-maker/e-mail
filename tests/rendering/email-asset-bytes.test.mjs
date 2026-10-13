import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rename, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { publishEmailAtomically } from "../../scripts/lib/email-output.mjs";
import { collectEmailActions } from "../../scripts/lib/email-action-inventory.mjs";
import { indexComponentRegistries, loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { createDeliveryDraft } from "../../scripts/lib/email-delivery-form.mjs";
import { loadEmailDeliveryProfiles } from "../../scripts/lib/email-delivery-profile.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const execFileAsync = promisify(execFile);
const ORIGINAL = Buffer.from("literal-original-asset", "utf8");
const REPLACEMENT = Buffer.from("literal-replacement-asset", "utf8");

async function ownedFixture(t) {
  const folder = await mkdtemp(join(tmpdir(), "cupis-contained-assets-"));
  t.after(() => rm(folder, { recursive: true, force: true }));
  const root = join(folder, "root"), outside = join(folder, "outside");
  await mkdir(join(root, "images", "nested"), { recursive: true });
  await mkdir(outside);
  const source = join(root, "images", "nested", "asset.bin");
  await writeFile(source, ORIGINAL);
  await writeFile(join(outside, "asset.bin"), REPLACEMENT);
  return { folder, root, outside, source, outputDir: join(folder, "published") };
}
async function exists(path) { try { await stat(path); return true; } catch (error) { if (error.code === "ENOENT") return false; throw error; } }
function assetError(error) { assert.match(error.code ?? "", /^EMAIL_.*ASSET_/u); return true; }
async function linkOrSkip(t, target, path, directory = false) {
  try { await symlink(target, path, directory ? (process.platform === "win32" ? "junction" : "dir") : "file"); return true; }
  catch (error) { if (["EPERM", "EACCES", "ENOTSUP", "EINVAL"].includes(error.code)) { t.skip(`Platform cannot create ${directory ? "directory link/junction" : "file link"}: ${error.code}`); return false; } throw error; }
}
async function loader() {
  // Import only inside helper cases: a missing new module must not suppress real API/CLI RED.
  const module = await import("../../scripts/lib/email-asset-bytes.mjs");
  assert.equal(typeof module.readContainedAssetBytes, "function");
  return module.readContainedAssetBytes;
}

// Literal byte expectations, independent of the planned helper implementation.
test("contained helper accepts empty assets without a root", async () => {
  const read = await loader(); assert.deepEqual(await read({ assets: [] }), []);
});
test("contained helper reads nested ordinary assets and deduplicates the same normalized source", async (t) => {
  const f = await ownedFixture(t), read = await loader();
  const entries = await read({ assetRoot: f.root, assets: [
    { path: "images/nested/asset.bin", sourcePath: f.source },
    { path: "images/nested/asset.bin", sourcePath: join(f.root, "images", "nested", ".", "asset.bin") },
  ] });
  assert.deepEqual(entries.map(({ path, bytes }) => ({ path, bytes })), [{ path: "images/nested/asset.bin", bytes: ORIGINAL }]);
});
test("contained helper preserves CWD-relative explicit sourcePath with an explicit trusted root", async (t) => {
  const f = await ownedFixture(t), read = await loader();
  const sourcePath = relative(process.cwd(), f.source);
  const entries = await read({ assetRoot: f.root, assets: [{ path: "images/nested/asset.bin", sourcePath }] });
  assert.deepEqual(entries, [{ path: "images/nested/asset.bin", bytes: ORIGINAL }]);
});
test("contained helper resolves source-less rendered descriptors only from explicit root", async (t) => {
  const f = await ownedFixture(t), read = await loader();
  const entries = await read({ assetRoot: f.root, assets: [{ path: "images/nested/asset.bin" }] });
  assert.deepEqual(entries, [{ path: "images/nested/asset.bin", bytes: ORIGINAL }]);
});
test("contained helper owns frozen bytes after actual source replacement", async (t) => {
  const f = await ownedFixture(t), read = await loader();
  const entries = await read({ assetRoot: f.root, assets: [{ path: "images/nested/asset.bin", sourcePath: f.source }] });
  await rename(f.source, join(f.root, "images", "nested", "old.bin"));
  await writeFile(f.source, REPLACEMENT);
  assert.deepEqual(await readFile(f.source), REPLACEMENT);
  assert.deepEqual(entries[0].bytes, ORIGINAL);
  // No timing claim: this proves ownership of the successful read result, not an in-flight race.
});
for (const kind of ["file", "directory"]) test(`contained helper accepts a ${kind} link wholly inside the trusted root`, async (t) => {
  const f = await ownedFixture(t), read = await loader();
  const path = join(f.root, kind === "file" ? "asset-link.bin" : "nested-link");
  if (!(await linkOrSkip(t, kind === "file" ? f.source : dirname(f.source), path, kind === "directory"))) return;
  const entries = await read({ assetRoot: f.root, assets: [{ path: "images/linked.bin", sourcePath: kind === "file" ? path : join(path, "asset.bin") }] });
  assert.deepEqual(entries, [{ path: "images/linked.bin", bytes: ORIGINAL }]);
});
for (const kind of ["missing-root", "wrong-root", "root-file", "source-directory", "missing-source", "case-collision", "different-source", "traversal", "absolute", "backslash", "unsafe-zip-target"]) {
  test(`contained helper rejects ${kind}`, async (t) => {
    const f = await ownedFixture(t), read = await loader();
    let assetRoot = f.root, assets = [{ path: "images/asset.bin", sourcePath: f.source }];
    if (kind === "missing-root") assetRoot = undefined;
    if (kind === "wrong-root") assetRoot = f.outside;
    if (kind === "root-file") assetRoot = f.source;
    if (kind === "source-directory") assets[0].sourcePath = dirname(f.source);
    if (kind === "missing-source") assets[0].sourcePath = join(f.root, "missing.bin");
    if (kind === "case-collision") assets.push({ path: "images/ASSET.bin", sourcePath: f.source });
    if (kind === "different-source") { const other = join(f.root, "other.bin"); await writeFile(other, REPLACEMENT); assets.push({ path: "images/asset.bin", sourcePath: other }); }
    if (kind === "traversal") assets[0].path = "images/../asset.bin";
    if (kind === "absolute") assets[0].path = join(f.root, "images", "asset.bin");
    if (kind === "backslash") assets[0].path = "images\\asset.bin";
    if (kind === "unsafe-zip-target") assets[0].path = "images/asset?.bin";
    await assert.rejects(read({ assetRoot, assets }), assetError);
  });
}
for (const kind of ["file", "directory"]) test(`contained helper rejects a ${kind} link outside the trusted root`, async (t) => {
  const f = await ownedFixture(t), read = await loader();
  const path = join(f.root, kind === "file" ? "outside-link.bin" : "outside-link");
  if (!(await linkOrSkip(t, kind === "file" ? join(f.outside, "asset.bin") : f.outside, path, kind === "directory"))) return;
  await assert.rejects(read({ assetRoot: f.root, assets: [{ path: "images/asset.bin", sourcePath: kind === "file" ? path : join(path, "asset.bin") }] }), assetError);
});

test("real publisher preserves CWD-relative explicit sourcePath with an explicit trusted root", async (t) => {
  const f = await ownedFixture(t);
  await publishEmailAtomically({ outputDir: f.outputDir, html: "<p>CWD-relative source</p>", assetRoot: f.root,
    assets: [{ path: "images/nested/asset.bin", sourcePath: relative(process.cwd(), f.source) }] });
  assert.deepEqual(await readdir(f.outputDir), ["email.html", "images"]);
  assert.equal(await readFile(join(f.outputDir, "email.html"), "utf8"), "<p>CWD-relative source</p>");
  assert.deepEqual(await readFile(join(f.outputDir, "images", "nested", "asset.bin")), ORIGINAL);
});
test("real publisher keeps rootless zero-asset compatibility", async (t) => {
  const f = await ownedFixture(t); await publishEmailAtomically({ outputDir: f.outputDir, html: "<p>rootless</p>" });
  assert.deepEqual(await readdir(f.outputDir), ["email.html", "images"]);
  assert.equal(await readFile(join(f.outputDir, "email.html"), "utf8"), "<p>rootless</p>");
});
for (const kind of ["missing-root", "wrong-root", "source-directory", "missing-source", "missing-source-path", "case-collision", "different-source", "traversal", "absolute", "backslash", "unsafe-zip-target"]) {
  test(`real publisher rejects ${kind} before creating final output`, async (t) => {
    const f = await ownedFixture(t);
    let assetRoot = f.root, assets = [{ path: "images/asset.bin", sourcePath: f.source }];
    if (kind === "missing-root") assetRoot = undefined;
    if (kind === "wrong-root") assetRoot = f.outside;
    if (kind === "source-directory") assets[0].sourcePath = dirname(f.source);
    if (kind === "missing-source") assets[0].sourcePath = join(f.root, "missing.bin");
    if (kind === "missing-source-path") delete assets[0].sourcePath;
    if (kind === "case-collision") assets.push({ path: "images/ASSET.bin", sourcePath: f.source });
    if (kind === "different-source") { const other = join(f.root, "other.bin"); await writeFile(other, REPLACEMENT); assets.push({ path: "images/asset.bin", sourcePath: other }); }
    if (kind === "traversal") assets[0].path = "images/../asset.bin";
    if (kind === "absolute") assets[0].path = join(f.root, "images", "asset.bin");
    if (kind === "backslash") assets[0].path = "images\\asset.bin";
    if (kind === "unsafe-zip-target") assets[0].path = "images/asset?.bin";
    let failure;
    try { await publishEmailAtomically({ outputDir: f.outputDir, html: "<p>not published</p>", assets, assetRoot }); } catch (error) { failure = error; }
    const observed = { error: failure?.code ?? null, finalExists: await exists(f.outputDir) };
    if (observed.finalExists) observed.files = await readdir(f.outputDir);
    assert.ok(failure, `Actual publisher must reject: ${JSON.stringify(observed)}`);
    assetError(failure);
    const legacyCodes = { "source-directory": "EMAIL_OUTPUT_ASSET_SOURCE_INVALID", "missing-source": "EMAIL_OUTPUT_ASSET_SOURCE_MISSING", "missing-source-path": "EMAIL_OUTPUT_ASSET_SOURCE_MISSING", "different-source": "EMAIL_OUTPUT_ASSET_TARGET_CONFLICT", traversal: "EMAIL_OUTPUT_ASSET_PATH_UNSAFE", absolute: "EMAIL_OUTPUT_ASSET_PATH_UNSAFE", backslash: "EMAIL_OUTPUT_ASSET_PATH_UNSAFE" };
    if (legacyCodes[kind]) assert.equal(failure.code, legacyCodes[kind]);
    assert.equal(observed.finalExists, false);
    assert.deepEqual((await readdir(f.folder)).sort(), ["outside", "root"]);
  });
}
for (const kind of ["file", "directory"]) test(`real publisher rejects an escaped ${kind} link and preserves an empty destination`, async (t) => {
  const f = await ownedFixture(t), path = join(f.root, kind === "file" ? "outside.bin" : "outside-dir");
  if (!(await linkOrSkip(t, kind === "file" ? join(f.outside, "asset.bin") : f.outside, path, kind === "directory"))) return;
  await mkdir(f.outputDir);
  await assert.rejects(publishEmailAtomically({ outputDir: f.outputDir, html: "<p>not published</p>", assetRoot: f.root,
    assets: [{ path: "images/asset.bin", sourcePath: kind === "file" ? path : join(path, "asset.bin") }] }), assetError);
  assert.deepEqual(await readdir(f.outputDir), []);
  assert.deepEqual((await readdir(f.folder)).sort(), ["outside", "published", "root"]);
});
for (const kind of ["file", "directory"]) test(`real publisher permits a contained ${kind} link with literal checked bytes`, async (t) => {
  const f = await ownedFixture(t), path = join(f.root, kind === "file" ? "inside.bin" : "inside-dir");
  if (!(await linkOrSkip(t, kind === "file" ? f.source : dirname(f.source), path, kind === "directory"))) return;
  await publishEmailAtomically({ outputDir: f.outputDir, html: "<p>contained link</p>", assetRoot: f.root,
    assets: [{ path: "images/nested/asset.bin", sourcePath: kind === "file" ? path : join(path, "asset.bin") }] });
  assert.deepEqual(await readdir(f.outputDir), ["email.html", "images"]);
  assert.deepEqual(await readFile(join(f.outputDir, "images", "nested", "asset.bin")), ORIGINAL);
});
test("real publisher existing-output precedence preserves every original byte", async (t) => {
  const f = await ownedFixture(t); await mkdir(f.outputDir); await writeFile(join(f.outputDir, "keep.txt"), ORIGINAL);
  await assert.rejects(publishEmailAtomically({ outputDir: f.outputDir, html: "replacement", assets: [{ path: "images/x.bin", sourcePath: f.source }] }), (e) => e.code === "EMAIL_OUTPUT_EXISTS");
  assert.deepEqual(await readdir(f.outputDir), ["keep.txt"]); assert.deepEqual(await readFile(join(f.outputDir, "keep.txt")), ORIGINAL);
});

function assetPaths(instance, paths = new Set()) {
  for (const asset of instance.asset_files ?? []) paths.add(asset.path);
  for (const slot of instance.slots ?? []) for (const child of slot.instances ?? []) assetPaths(child, paths);
  for (const nested of instance.nested_components ?? []) if (nested.instance) assetPaths(nested.instance, paths);
  return paths;
}
let deliveryDependencies;
async function deliveryFor(model) {
  deliveryDependencies ??= Promise.all([loadComponentRegistries({ repoRoot }), loadEmailDeliveryProfiles({ repoRoot })]);
  const [registries, profiles] = await deliveryDependencies;
  const componentIndex = indexComponentRegistries(registries), profile = profiles.profiles.find(({ id }) => id === "altcraft-mobile-base-v1");
  const inventory = collectEmailActions({ model, componentIndex, profile });
  assert.deepEqual(inventory.diagnostics, []);
  const document = createDeliveryDraft({ emailId: model.id, sourceSha: process.env.CUPIS_SYSTEM_COMMIT, profile, inventory });
  document.subject = "Synthetic containment release";
  document.answers = Object.fromEntries(inventory.fields.map((field, index) => [field.id, field.managed ? field.value : `https://1cupis.ru/test/${index + 1}`]));
  return document;
}
async function cliFixture(t, kind) {
  const f = await ownedFixture(t);
  const model = JSON.parse(await readFile(join(repoRoot, "tests", "fixtures", "rendering", "pilot-email.json"), "utf8"));
  const paths = [...assetPaths(model.root)]; assert.ok(paths.length);
  for (const path of paths) { const target = join(f.root, ...path.split("/")); await mkdir(dirname(target), { recursive: true }); await writeFile(target, ORIGINAL); }
  const activePath = paths[0], target = join(f.root, ...activePath.split("/"));
  await rm(target);
  if (kind === "directory-link") {
    // Replace the real images directory, preserving every declared asset outside root.
    await rm(join(f.root, "images"), { recursive: true });
    for (const path of paths) { const destination = join(f.outside, ...path.slice("images/".length).split("/")); await mkdir(dirname(destination), { recursive: true }); await writeFile(destination, REPLACEMENT); }
    if (!(await linkOrSkip(t, f.outside, join(f.root, "images"), true))) return;
  } else if (kind === "file-link") {
    if (!(await linkOrSkip(t, join(f.outside, "asset.bin"), target))) return;
  } else if (kind === "source-directory") await mkdir(target);
  else assert.equal(kind, "missing-source");
  const modelPath = join(f.root, "model.json"); await writeFile(modelPath, JSON.stringify(model));
  return { ...f, model, modelPath };
}
for (const mode of ["render-folder", "delivery-zip", "preview"]) for (const kind of ["directory-link", "file-link", "source-directory", "missing-source"]) {
  test(`actual ${mode} CLI rejects ${kind} before any final HTML or ZIP`, async (t) => {
    const f = await cliFixture(t, kind); if (!f) return;
    const output = mode === "preview" ? join(f.folder, "preview.html") : f.outputDir;
    const args = [join(repoRoot, "scripts", mode === "preview" ? "render-email-preview.mjs" : "render-email.mjs"), "--model", f.modelPath];
    if (mode === "preview") args.push("--mode", "normal");
    if (mode === "delivery-zip") { const path = join(f.root, "delivery.json"); await writeFile(path, JSON.stringify(await deliveryFor(f.model))); args.push("--delivery", path); }
    args.push("--output", output);
    let failure; try { await execFileAsync(process.execPath, args, { cwd: repoRoot, timeout: 120000, maxBuffer: 1024 * 1024 }); } catch (error) { failure = error; }
    const observed = { error: failure?.code ?? null, finalExists: await exists(output) };
    if (observed.finalExists && mode !== "preview") observed.files = await readdir(output);
    assert.ok(failure, `Actual ${mode} must reject before publication: ${JSON.stringify(observed)}`);
    assert.equal(failure.killed, false, "A timeout is not a containment validation result.");
    assert.match(failure.stderr ?? "", /EMAIL_.*ASSET_/u, "Reject must be an asset diagnostic, not model/delivery semantics.");
    assert.equal(await exists(output), false);
    assert.deepEqual((await readdir(f.folder)).sort(), ["outside", "root"]);
  });
}
