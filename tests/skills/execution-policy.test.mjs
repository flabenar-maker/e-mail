import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";
const repoRoot=dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const module=await import("../../scripts/lib/execution-policy.mjs").catch(()=>({}));
function loader() { assert.equal(typeof module.loadExecutionPolicy,"function","typed execution policy loader must exist"); return module.loadExecutionPolicy; }
async function fixture(t) {
 const root=await mkdtemp(join(tmpdir(),"cupis-policy-")); t.after(()=>rm(root,{recursive:true,force:true}));
 for(const path of ["data/execution/policy.yaml","schemas/execution-policy.schema.json"]) {await mkdir(dirname(join(root,path)),{recursive:true}); await writeFile(join(root,path),await readFile(join(repoRoot,path)));}
 return {root,manifest:{sources:[{id:"execution-policy",kind:"registry",path:"data/execution/policy.yaml"},{id:"execution-policy-schema",kind:"schema",path:"schemas/execution-policy.schema.json"}]}};
}
test("canonical strict policy is registered separately from domain bundles",async()=>{
 const policy=await loader()({repoRoot}); assert.equal(policy.schema_version,"1.0.0"); assert.match(policy.policy_digest,/^[a-f0-9]{64}$/);
 const manifest=await readStrictYaml(join(repoRoot,"system/manifest.yaml")); assert.ok(manifest.sources.some(x=>x.id==="execution-policy"));
 for(const bundle of manifest.bundle_profiles) assert.ok(!bundle.generated_bundle.static_source_ids.includes("execution-policy"));
 assert.equal(policy.delegation.max_subagents,3); assert.equal(policy.delegation.fork_turns,"none");
 assert.equal(policy.runtime_capabilities.source,"declared-runtime-tools"); assert.equal(policy.runtime_capabilities.max_candidate_attempts,1);
 assert.deepEqual(policy.tiers.map(x=>x.candidates.map(y=>[y.model,y.effort])),[[["gpt-6-luna","low"],["gpt-5.6-luna","low"]],[["gpt-5.6-terra","medium"],["gpt-5.6-sol","medium"]],[["gpt-6.1-sol","high"]],[["gpt-6-astra","high"]]]);
});
test("workloads have argv contracts, explicit portability and conservative fixed thresholds",async()=>{
 const policy=await loader()({repoRoot});
 assert.deepEqual(policy.workloads.map(x=>x.id),["docs-scoped","repository-full","windows-bootstrap","visual-fixtures","installed-skills","real-email-visual"]);
 for(const workload of policy.workloads) {assert.ok(workload.commands.length);for(const command of workload.commands){assert.equal(typeof command.executable,"string");assert.ok(Array.isArray(command.args));} assert.equal(workload.limits.concurrency,2);assert.equal(workload.limits.timeout_minutes,30);}
 for(const id of ["installed-skills","real-email-visual"]) assert.equal(policy.workloads.find(x=>x.id===id).portability,"local-only");
 const threshold=policy.hardware_thresholds[0];assert.equal(threshold.platform,"win32");assert.deepEqual(threshold.architectures,["x64","arm64"]);assert.equal(threshold.node_major,24);assert.equal(threshold.physical_ram_gib,16);assert.equal(threshold.free_ram_gib,8);assert.equal(threshold.logical_cpus,8);assert.equal(threshold.free_temporary_disk_gib,4);
 assert.equal(policy.local_limits.max_heavy_batches,1);
});
test("loader rejects unknown versions, unknown properties, duplicate YAML and invalid cross references",async(t)=>{
 const load=loader(); const f=await fixture(t); const target=join(f.root,"data/execution/policy.yaml"); const original=await readStrictYaml(target);
 for(const [mutate,code] of [[x=>x.schema_version="2.0.0","execution-policy-version"],[x=>x.surprise=true,"execution-policy-schema"],[x=>x.task_kinds["bounded-change"].required_capabilities=["telepathy"],"execution-policy-reference"]]) {const value=structuredClone(original);mutate(value);await writeFile(target,JSON.stringify(value));await assert.rejects(load({repoRoot:f.root,manifest:f.manifest}),e=>e.code===code);}
 await writeFile(target,"schema_version: 1.0.0\nschema_version: 1.0.0\n");await assert.rejects(load({repoRoot:f.root,manifest:f.manifest}),e=>e.code==="yaml-duplicate-key");
});
test("manifest lookup rejects unregistered or escaping policy sources",async()=>{
 const load=loader(); await assert.rejects(load({repoRoot,manifest:{sources:[]}}),e=>e.code==="execution-policy-source");
 await assert.rejects(load({repoRoot,manifest:{sources:[{id:"execution-policy",kind:"registry",path:"../policy.yaml"},{id:"execution-policy-schema",kind:"schema",path:"schemas/execution-policy.schema.json"}]}}),e=>e.code==="execution-policy-source");
});

test("manifest cannot redirect canonical policy or its strict schema",async(t)=>{
 const load=loader();const f=await fixture(t);
 await writeFile(join(f.root,"alternative-policy.yaml"),await readFile(join(f.root,"data/execution/policy.yaml")));
 await writeFile(join(f.root,"permissive-schema.json"),JSON.stringify({type:"object"}));
 for(const [id,path] of [["execution-policy","alternative-policy.yaml"],["execution-policy-schema","permissive-schema.json"]]) {
  const manifest=structuredClone(f.manifest);manifest.sources.find(source=>source.id===id).path=path;
  await assert.rejects(load({repoRoot:f.root,manifest}),error=>error.code==="execution-policy-source",path);
 }
});

test("schema parse and policy read failures retain typed loader diagnostics",async(t)=>{
 const load=loader(); const f=await fixture(t); const schemaPath=join(f.root,"schemas/execution-policy.schema.json");const schema=await readFile(schemaPath);
 await writeFile(schemaPath,"{broken json");await assert.rejects(load({repoRoot:f.root,manifest:f.manifest}),error=>error.code==="execution-policy-schema");
 await writeFile(schemaPath,schema);const policyPath=join(f.root,"data/execution/policy.yaml");await rm(policyPath);await mkdir(policyPath);
 await assert.rejects(load({repoRoot:f.root,manifest:f.manifest}),error=>error.code==="execution-policy-read");
});
