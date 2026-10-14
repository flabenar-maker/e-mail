import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { collectResourceReferences } from "../../scripts/lib/email-resource-references.mjs";

import { collectEmailActions } from "../../scripts/lib/email-action-inventory.mjs";
import { indexComponentRegistries, loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";
import { createDeliveryDraft } from "../../scripts/lib/email-delivery-form.mjs";
import { loadEmailDeliveryProfiles } from "../../scripts/lib/email-delivery-profile.mjs";
import { loadEmailModel } from "../../scripts/lib/email-model.mjs";
import { selectVariantRoot } from "../../scripts/lib/email-interpreter.mjs";

const execFileAsync = promisify(execFile);
const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const sourceSha = process.env.CUPIS_SYSTEM_COMMIT;
const png = Buffer.from("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6360000002000154a24f9d0000000049454e44ae426082", "hex");
function makeNativeInstance({ componentId, index, axesByViewport = {}, prefix }) {
  const record = index.bySystemId.get(componentId); if (!record) throw new Error(`missing ${componentId}`);
  const resolvedAxes=structuredClone(axesByViewport);
  if(Object.values(resolvedAxes).some(axes=>Object.keys(axes).length)) {
    for(const viewport of ["mobile","desktop"]) {
      if(Object.keys(resolvedAxes[viewport]??{}).length)continue;
      const known=resolvedAxes[viewport==="mobile"?"desktop":"mobile"]??{};
      const candidates=(record.variants??[]).filter(variant=>variant.axes?.some(axis=>axis.name==="Viewport"&&axis.value.toLowerCase()===viewport));
      const candidate=candidates.find(variant=>Object.entries(known).every(([name,value])=>variant.axes.some(axis=>axis.name===name&&axis.value.toLowerCase()===value.toLowerCase())))??candidates[0];
      const axes=Object.fromEntries((candidate?.axes??[]).filter(axis=>axis.name!=="Viewport").map(axis=>[axis.name,axis.value]));
      if(!Object.keys(axes).length)throw new Error(`missing complementary axes ${componentId}/${viewport}`);
      resolvedAxes[viewport]=axes;
    }
  }
  const instance = { instance_id: prefix, component_id: componentId, variants: {}, property_values: (record.properties ?? []).filter((p) => p.type === "boolean").map((p) => ({ property_id: p.id, scope: "all", value: true })), content_values: [], asset_files: [], slots: [], nested_components: [] };
  const assets = new Set(), nested = new Map();
  for (const viewport of ["mobile", "desktop"]) {
    const axes = resolvedAxes[viewport] ?? {}; const selected = selectVariantRoot(record, viewport, axes); if (selected.diagnostics.length) throw new Error(`variant ${componentId}/${viewport}`);
    instance.variants[viewport] = viewport; if (Object.keys(axes).length) (instance.variant_axes ??= {})[viewport] = axes;
    const visit = (element) => { if (element.visibility?.mode === "instance" && !element.visibility.default_visible) return; const text = element.facts?.find((f) => f.id === "source-text")?.value?.value ?? element.facts?.find((f) => f.id === "styled-text-segments")?.value?.items?.map((run) => run.characters).join(""); for (const slot of element.content_slots ?? []) if (!['url','placeholder'].includes(slot.type)) instance.content_values.push({ element_id: element.id, slot_id: slot.id, scope: viewport, value: slot.type === 'alt-text' ? { type:'alt-text',purpose:'informative',value:'Синтетическое изображение' } : slot.type === 'rich-text' ? { type:'rich-text',segments:[{type:'text',value:text ?? 'Синтетический текст'}] } : { type:'plain-text',value:text ?? 'Синтетический текст' } }); if (element.asset_contract_id) assets.add(element.asset_contract_id); if (element.render_mode === 'nested-component') { const entry = nested.get(element.id) ?? { element_id:element.id, component_id:element.component_id, axes:{} }; entry.axes[viewport] = Object.fromEntries((element.facts ?? []).filter((f) => f.id.startsWith('instance-') && f.id !== 'instance-viewport' && typeof f.value?.value === 'string').map((f) => [f.id.slice(9).replace(/^./u,(c) => c.toUpperCase()),f.value.value])); nested.set(element.id,entry); } for (const child of element.children ?? []) visit(child); };
    visit(selected.root);
  }
  for (const id of assets) instance.asset_files.push({ asset_contract_id:id,path:`images/${prefix}-${id}.png` });
  // This fixture declares the actual cross-viewport badge placement explicitly.
  const mobileBadge=nested.get("root-card-summary-area-partner-info-row-status");
  const desktopBadge=nested.get("root-card-summary-area-partner-info-row-status-container-status");
  if(componentId==="block-transaction-error"&&mobileBadge&&desktopBadge) {
    assert.equal(mobileBadge.component_id,"badge-operation-status");
    assert.equal(desktopBadge.component_id,mobileBadge.component_id);
    instance.nested_components.push({element_ids:{mobile:mobileBadge.element_id,desktop:desktopBadge.element_id},instance:makeNativeInstance({componentId:mobileBadge.component_id,index,axesByViewport:{mobile:mobileBadge.axes.mobile,desktop:desktopBadge.axes.desktop},prefix:`${prefix}-status-badge`})});
    nested.delete(mobileBadge.element_id);nested.delete(desktopBadge.element_id);
  }
  for (const entry of nested.values()) instance.nested_components.push({ element_id:entry.element_id, instance:makeNativeInstance({ componentId:entry.component_id,index,axesByViewport:entry.axes,prefix:`${prefix}-${entry.element_id}` }) });
  return instance;
}

async function releaseInput(folder, { includeNps = false } = {}) {
  const modelPath = join(repoRoot, "tests", "fixtures", "rendering", "pilot-email.json");
  const raw = JSON.parse(await readFile(modelPath, "utf8"));
  const model = structuredClone(raw);
  const [registries, profiles] = await Promise.all([
    loadComponentRegistries({ repoRoot }),
    loadEmailDeliveryProfiles({ repoRoot }),
  ]);
  const componentIndex = indexComponentRegistries(registries);
  const content = model.root.slots.find((slot) => slot.element_id === "content").instances;
  const footer = content.findIndex((item) => item.component_id === "email-footer");
  const additions = [makeNativeInstance({ componentId:"block-transaction-error",index:componentIndex,prefix:"synthetic-greeting" }), ...(includeNps ? [makeNativeInstance({ componentId:"nps-options",index:componentIndex,axesByViewport:{mobile:{Count:"3"},desktop:{Count:"3"}},prefix:"synthetic-nps" })] : [])];
  content.splice(footer, 0, ...additions);
  await writeFile(join(folder, "model.json"), JSON.stringify(model));
  const assetPaths = [...JSON.stringify(model).matchAll(/"path":"(images\/[^"]+)"/gu)].map((match) => match[1]);
  for (const path of new Set(assetPaths)) {
    const target = join(folder, ...path.split("/"));
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, png);
  }
  const profile = profiles.profiles.find(({ id }) => id === "altcraft-mobile-base-v1");
  const inventory = collectEmailActions({ model, componentIndex, profile });
  const document = createDeliveryDraft({ emailId: model.id, sourceSha, profile, inventory });
  document.subject = "Синтетический релиз";
  document.preheader = "Синтетический прехедер";
  document.answers = Object.fromEntries(inventory.fields.map((field, index) => [
    field.id,
    field.managed ? field.value : `https://1cupis.ru/synthetic/${index + 1}`,
  ]));
  await writeFile(join(folder, "delivery.json"), JSON.stringify(document));
  return { model, profile, inventory, document, assetPaths:[...new Set(assetPaths)] };
}

test("CLI delivers exactly root HTML and byte-identical images with explicit native metadata", async (t) => {
  const folder = await mkdtemp(join(tmpdir(), "cupis-source-delivery-"));
  t.after(() => rm(folder, { recursive: true, force: true }));
  const { inventory, document, assetPaths } = await releaseInput(folder);
  document.sender={mode:"explicit",name:"ЕДИНЫЙ ЦУПИС",address:"info@1cupis.ru"};
  document.reply_to={mode:"explicit",name:"Поддержка",address:"help@1cupis.ru"};
  await writeFile(join(folder,"delivery.json"),JSON.stringify(document));
  assert.equal(inventory.fields.some(({ role }) => String(role).startsWith("nps-")), false);
  const output = join(folder, "release");
  await execFileAsync(process.execPath, ["scripts/render-email.mjs", "--model", join(folder, "model.json"), "--delivery", join(folder, "delivery.json"), "--output", output], {
    cwd: repoRoot,
    env: { ...process.env, CUPIS_SYSTEM_COMMIT: sourceSha },
  });
  const files = await readdir(output);
  assert.deepEqual(files,["email.html","images"]);
  assert.equal(files.some((name) => /^(from_|replyto_)/u.test(name)), false);
  const html = await readFile(join(output, "email.html"), "utf8");
  assert.match(html, /https:\/\/1cupis\.ru\/\?utm_source=crm&amp;utm_medium=email&amp;utm_campaign=logo/u);
  assert.match(html, /redirect\.appmetrica\.yandex\.com\/serve\/461821467231807192/u);
  assert.match(html, /\{unsubscribe\}/u);
  assert.match(html, /\{if lead\._fname\}Здравствуйте,/u);
  assert.match(html, /\u034f\u200c <vk-snippet-end>/u);
  assert.doesNotMatch(html, /(?:src|background)="(?!images\/)/u);
  for(const ref of collectResourceReferences({html})){
    const value=decodeURIComponent(ref.raw_value.replaceAll("&amp;","&"));
    assert.ok(assetPaths.includes(value),value);
    assert.deepEqual(await readFile(join(output,...value.split("/"))),png);
  }
  assert.doesNotMatch(html,/Алексей|Александра-Виктория/u);
});

test("registered Count=3 NPS derives three required actions and projects their URLs", async (t) => {
  const folder = await mkdtemp(join(tmpdir(), "cupis-source-delivery-nps-")); t.after(() => rm(folder, { recursive: true, force: true }));
  const { inventory } = await releaseInput(folder, { includeNps: true });
  const nps = inventory.fields.filter(({ role }) => String(role).startsWith("nps-"));
  assert.equal(nps.length, 3); assert.ok(nps.every(({ required }) => required));
});

test("each required NPS URL blocks its own release output when absent", async (t) => {
  const folder = await mkdtemp(join(tmpdir(), "cupis-source-delivery-nps-blocked-")); t.after(() => rm(folder, { recursive: true, force: true }));
  const { inventory, document } = await releaseInput(folder, { includeNps: true });
  for (const field of inventory.fields.filter(({ role }) => String(role).startsWith("nps-"))) {
    const blocked = { ...document, answers: { ...document.answers, [field.id]: "" } }; await writeFile(join(folder, "delivery.json"), JSON.stringify(blocked)); const output = join(folder, `blocked-${field.role}`);
    await assert.rejects(execFileAsync(process.execPath, ["scripts/render-email.mjs", "--model", join(folder, "model.json"), "--delivery", join(folder, "delivery.json"), "--output", output], { cwd: repoRoot, env: { ...process.env, CUPIS_SYSTEM_COMMIT: sourceSha } }), /REQUIRED_URL|Fill the address/u); await assert.rejects(readdir(output), /ENOENT/u);
  }
});

test("removing a collected required URL blocks the release before any output is published", async (t) => {
  const folder = await mkdtemp(join(tmpdir(), "cupis-source-delivery-missing-"));
  t.after(() => rm(folder, { recursive: true, force: true }));
  const { inventory, document } = await releaseInput(folder);
  const required = inventory.fields.filter(({ role }) => ["footer-site", "footer-support"].includes(role));
  assert.equal(required.length, 2);
  for (const field of required) {
    const blocked = { ...document, answers: { ...document.answers, [field.id]: "" } }; await writeFile(join(folder, "delivery.json"), JSON.stringify(blocked)); const output = join(folder, `blocked-${field.role}`);
    await assert.rejects(execFileAsync(process.execPath, ["scripts/render-email.mjs", "--model", join(folder, "model.json"), "--delivery", join(folder, "delivery.json"), "--output", output], { cwd: repoRoot, env: { ...process.env, CUPIS_SYSTEM_COMMIT: sourceSha } }), /REQUIRED_URL|Fill the address/u); await assert.rejects(readdir(output), /ENOENT/u);
  }
});

test("blank subject preserves a ready link-only preview and never creates an archive", async (t) => {
  const folder = await mkdtemp(join(tmpdir(), "cupis-source-delivery-preview-"));
  t.after(() => rm(folder, { recursive: true, force: true }));
  const { document } = await releaseInput(folder);
  const blank = { ...document, subject: "" };
  const delivery = join(folder, "blank-subject-delivery.json");
  const preview = join(folder, "preview", "email.html");
  await writeFile(delivery, JSON.stringify(blank));
  await execFileAsync(process.execPath, ["scripts/render-email-preview.mjs", "--model", join(folder, "model.json"), "--delivery", delivery, "--mode", "normal", "--output", preview], { cwd: repoRoot, env: { ...process.env, CUPIS_SYSTEM_COMMIT: sourceSha } });
  const html = await readFile(preview, "utf8");
  assert.match(html, /<title>Предпросмотр<\/title>/u);
  assert.match(html, /CUPIS preview: readiness=ready; purpose=preview/u);
  await assert.rejects(readFile(join(folder, "preview", "altcraft.zip")), /ENOENT/u);
  const release = join(folder, "release");
  const evidence = join(folder,"evidence");
  await execFileAsync(process.execPath, ["scripts/render-email.mjs", "--model", join(folder, "model.json"), "--delivery", join(folder, "delivery.json"), "--output", release,"--evidence-output",evidence], { cwd: repoRoot, env: { ...process.env, CUPIS_SYSTEM_COMMIT: sourceSha } });
  const report = JSON.parse(await readFile(join(evidence, "release-report.json"), "utf8"));
  assert.equal(report.emission_profile.id, "altcraft-mobile-base-v1");
  assert.equal(report.effective_fallback, "mobile");
  assert.equal(report.service_rules_version, "1.0.0");
});

test("CLI stores requested reports and personalization previews only in separate evidence output",async(t)=>{
  const folder=await mkdtemp(join(tmpdir(),"cupis-source-evidence-"));t.after(()=>rm(folder,{recursive:true,force:true}));
  const {assetPaths}=await releaseInput(folder);const output=join(folder,"release"),evidence=join(folder,"evidence");
  await execFileAsync(process.execPath,["scripts/render-email.mjs","--model",join(folder,"model.json"),"--delivery",join(folder,"delivery.json"),"--output",output,"--evidence-output",evidence],{cwd:repoRoot,env:{...process.env,CUPIS_SYSTEM_COMMIT:sourceSha}});
  assert.deepEqual(await readdir(output),["email.html","images"]);
  assert.deepEqual(await readdir(evidence),["images","preview-empty-name.html","preview-long-name.html","preview-name.html","release-report.json"]);
  const report=JSON.parse(await readFile(join(evidence,"release-report.json"),"utf8"));
  assert.equal(report.external_acceptance,"not-run");assert.equal(report.source_sha,sourceSha);assert.equal(report.package_id,"altcraft-root-html-v1");
  assert.equal(report.link_readiness.resolved_required_count,report.link_readiness.required_count);
  assert.equal(report.local_checks.personalization_previews,"passed");
  const previews=await Promise.all(["preview-name.html","preview-empty-name.html","preview-long-name.html"].map(name=>readFile(join(evidence,name),"utf8")));
  assert.match(previews[0],/Алексей/u);assert.match(previews[1],/Здравствуйте!/u);assert.match(previews[2],/Александра-Виктория/u);
  for(const html of previews)for(const ref of collectResourceReferences({html}))assert.deepEqual(await readFile(join(evidence,...decodeURIComponent(ref.raw_value).split("/"))),png);
  const releaseHtml=await readFile(join(output,"email.html"),"utf8");
  const releaseReferences=collectResourceReferences({html:releaseHtml});
  assert.ok(releaseReferences.length>0);
  for(const ref of releaseReferences){const value=decodeURIComponent(ref.raw_value.replaceAll("&amp;","&"));assert.ok(assetPaths.includes(value),value);assert.deepEqual(await readFile(join(output,...value.split("/"))),png);}
});
test("CLI rejects overlapping delivery and evidence destinations before publishing",async(t)=>{
  const folder=await mkdtemp(join(tmpdir(),"cupis-source-overlap-"));t.after(()=>rm(folder,{recursive:true,force:true}));await releaseInput(folder);
  for(const [output,evidence] of [[join(folder,"same"),join(folder,"same")],[join(folder,"parent"),join(folder,"parent","evidence")],[join(folder,"ancestor","release"),join(folder,"ancestor")]]){
    await assert.rejects(execFileAsync(process.execPath,["scripts/render-email.mjs","--model",join(folder,"model.json"),"--delivery",join(folder,"delivery.json"),"--output",output,"--evidence-output",evidence],{cwd:repoRoot,env:{...process.env,CUPIS_SYSTEM_COMMIT:sourceSha}}),/EMAIL_OUTPUT_OVERLAP/u);
    await assert.rejects(readdir(output),/ENOENT/u);await assert.rejects(readdir(evidence),/ENOENT/u);
  }
});
test("CLI preserves existing delivery and evidence bytes when either destination is occupied",async(t)=>{
  const folder=await mkdtemp(join(tmpdir(),"cupis-source-occupied-"));t.after(()=>rm(folder,{recursive:true,force:true}));await releaseInput(folder);
  for(const occupied of ["release","evidence"]){
    const base=join(folder,occupied),output=join(base,"release"),evidence=join(base,"evidence"),target=occupied==="release"?output:evidence;
    await mkdir(target,{recursive:true});await writeFile(join(target,"keep.txt"),"original");
    await assert.rejects(execFileAsync(process.execPath,["scripts/render-email.mjs","--model",join(folder,"model.json"),"--delivery",join(folder,"delivery.json"),"--output",output,"--evidence-output",evidence],{cwd:repoRoot,env:{...process.env,CUPIS_SYSTEM_COMMIT:sourceSha}}),/EMAIL_OUTPUT_EXISTS/u);
    assert.deepEqual(await readdir(target),["keep.txt"]);assert.equal(await readFile(join(target,"keep.txt"),"utf8"),"original");
    await assert.rejects(readdir(occupied==="release"?evidence:output),/ENOENT/u);
  }
});
