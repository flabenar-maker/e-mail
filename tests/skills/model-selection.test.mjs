import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const selectionModule = await import("../../scripts/lib/model-selection.mjs").catch(() => ({}));
const policyModule = await import("../../scripts/lib/execution-policy.mjs").catch(() => ({}));
async function setup() {
  assert.equal(typeof selectionModule.selectModel, "function", "pure model selection must exist");
  assert.equal(typeof policyModule.loadExecutionPolicy, "function", "typed execution policy loader must exist");
  return policyModule.loadExecutionPolicy({ repoRoot });
}
function caps() {
  return { schema_version: "1.0.0", runtime_session_id: "test-session", tool_signature: "declared-spawn-v1", source: "declared-runtime-tools", max_subagents: 3,
    models: [ ["gpt-6-luna", "low"], ["gpt-5.6-luna", "low"], ["gpt-5.6-terra", "medium"], ["gpt-5.6-sol", "medium"], ["gpt-6.1-sol", "high"], ["gpt-6-astra", "high"] ].map(([id, effort]) => ({ id, efforts: [effort], capabilities: ["text", "code", "vision"] })) };
}
const select = (policy, taskKind, capabilities = caps(), extra = {}) => selectionModule.selectModel({ policy, taskKind, operation: "read", allowedPaths: ["docs/example.md"], capabilities, ...extra });
test("approved task matrix applies exactly one safety tier and remains deterministic", async () => {
 const policy = await setup();
 for (const [kind, base, tier] of [["mechanical-read",1,2],["run-prescribed-checks",1,2],["bounded-change",2,3],["failure-diagnosis",2,3],["visual-compare",2,3],["architecture-change",3,4],["policy-change",3,4],["contract-change",3,4],["ambiguous-task",3,4]]) {
  const result = select(policy, kind); assert.equal(result.status,"resolved"); assert.equal(result.base_tier,base); assert.equal(result.target_tier,tier); assert.equal(result.executor.tier,tier); assert.deepEqual(result,select(policy,kind));
 }
 const top = structuredClone(policy); top.task_kinds["architecture-change"].base_tier = 4;
 const result = select(top,"architecture-change"); assert.equal(result.target_tier,4); assert.equal(result.safety_ceiling_reached,true);
});
test("fixed ordered replacement checks effort and never downgrades", async () => {
 const policy=await setup(); const runtime=caps(); runtime.models=runtime.models.filter(x=>x.id!=="gpt-5.6-terra");
 assert.equal(select(policy,"mechanical-read",runtime).executor.model,"gpt-5.6-sol");
 runtime.models.find(x=>x.id==="gpt-5.6-sol").efforts=["low"];
 assert.equal(select(policy,"mechanical-read",runtime).executor.model,"gpt-6.1-sol");
 runtime.models=runtime.models.filter(x=>!["gpt-6.1-sol","gpt-6-astra"].includes(x.id));
 assert.equal(select(policy,"mechanical-read",runtime).blockers[0].code,"MODEL_ROLE_UNAVAILABLE");
});
test("visual roles require actual declared vision for both executor and reviewer", async () => {
 const policy=await setup(); const runtime=caps(); runtime.models.find(x=>x.id==="gpt-6.1-sol").capabilities=["text","code"];
 assert.equal(select(policy,"visual-compare",runtime).executor.model,"gpt-6-astra");
 runtime.models.find(x=>x.id==="gpt-6-astra").capabilities=["text","code"];
 assert.equal(select(policy,"visual-compare",runtime).status,"blocked");
});
test("semantic review is independent and one tier above actual executor", async () => {
 const policy=await setup(); const result=select(policy,"bounded-change");
 assert.equal(result.review.mode,"independent-agent"); assert.equal(result.review.required,true); assert.equal(result.review.reviewer.tier,4); assert.equal(result.review.reviewer.model,"gpt-6-astra");
 const runtime=caps(); runtime.models=runtime.models.filter(x=>x.id!=="gpt-6-astra"); assert.equal(select(policy,"bounded-change",runtime).status,"blocked");
 assert.equal(select(policy,"mechanical-read").review.mode,"independent-source-check");
});
test("unknown kind and mechanical mutation are typed blockers", async () => {
 const policy=await setup(); assert.equal(select(policy,"invented").blockers[0].code,"EXECUTION_TASK_KIND_UNKNOWN");
 for (const kind of ["mechanical-read","run-prescribed-checks"]) assert.equal(select(policy,kind,caps(),{operation:"write",allowedPaths:["schemas/x.json"]}).blockers[0].code,"EXECUTION_TASK_KIND_SCOPE_MISMATCH");
});
test("critical writable scopes cannot lower their tier with a bounded label", async () => {
 const policy=await setup();
 for (const path of ["schemas/x.json",".agents/skills/example/SKILL.md","core/example.md","data/workflows/email-build.yaml","scripts/lib/maintenance-authorization.mjs","scripts/lib/model-selection.mjs","scripts/lib/email-renderer.mjs","system/manifest.yaml","bootstrap/config.portable.toml","AGENTS.md"]) {
  const result=select(policy,"bounded-change",caps(),{operation:"write",allowedPaths:[path]}); assert.equal(result.base_tier,3,path); assert.equal(result.executor.tier,4,path);
 }
 assert.equal(select(policy,"bounded-change",caps(),{operation:"write",allowedPaths:["docs/example.md"]}).base_tier,2);
 for (const path of ["../schemas/x.json","C:/unknown/x","docs/../schemas/x.json"]) assert.equal(select(policy,"bounded-change",caps(),{operation:"write",allowedPaths:[path]}).blockers[0].code,"EXECUTION_TASK_KIND_SCOPE_MISMATCH");
});
test("untrusted catalog or absent runtime identity never grants model availability", async () => {
 const policy=await setup(); for (const change of [{source:"models-cache"},{runtime_session_id:""},{tool_signature:""},{max_subagents:0}]) assert.equal(select(policy,"bounded-change",{...caps(),...change}).status,"blocked");
});
test("explicit typed refusals skip a candidate only for the current runtime signature", async () => {
 const policy=await setup(); const runtime=caps(); runtime.refusals=[{runtime_session_id:"test-session",tool_signature:"declared-spawn-v1",model:"gpt-5.6-terra",effort:"medium",code:"MODEL_UNAVAILABLE"}];
 assert.equal(select(policy,"mechanical-read",runtime).executor.model,"gpt-5.6-sol");
 runtime.refusals[0].tool_signature="old-tool"; assert.equal(select(policy,"mechanical-read",runtime).executor.model,"gpt-5.6-terra");
 runtime.refusals[0].tool_signature="declared-spawn-v1"; runtime.refusals[0].code="NETWORK_ERROR"; assert.equal(select(policy,"mechanical-read",runtime).executor.model,"gpt-5.6-terra");
});

test("Windows aliases cannot disguise critical writable directories",async()=>{
 const policy=await setup();
 for(const path of ["schemas./x.json","core /x.md","schemas.../x.json",".agents/skills /x/SKILL.md","schema~1/x.json","NUL/x.md","docs/con.txt"]) {
  const result=select(policy,"bounded-change",caps(),{operation:"write",allowedPaths:[path]}); assert.equal(result.status,"blocked",path);assert.equal(result.blockers[0].code,"EXECUTION_TASK_KIND_SCOPE_MISMATCH",path);
 }
 const mixed=select(policy,"bounded-change",caps(),{operation:"write",allowedPaths:["ScHeMaS\\x.json"]});assert.equal(mixed.base_tier,3);assert.equal(mixed.executor.tier,4);
});
test("every rendering strategy helper and execution workflow receives the critical floor",async()=>{
 const policy=await setup();
 for(const path of ["data/foundations/rendering.yaml","scripts/lib/render-impact.mjs","scripts/lib/rendering-foundation.mjs","scripts/lib/email-rendering.mjs",".github/workflows/execution-verification.yml"]) {
  const result=select(policy,"bounded-change",caps(),{operation:"write",allowedPaths:[path]});assert.equal(result.base_tier,3,path);assert.equal(result.executor.tier,4,path);
 }
});
test("malformed declared model entries return typed unavailable instead of throwing",async()=>{
 const policy=await setup();for(const entry of [null,undefined,42,"model",[],{}]) {const result=select(policy,"bounded-change",{...caps(),models:[entry]});assert.equal(result.status,"blocked");assert.equal(result.blockers[0].code,"MODEL_ROLE_UNAVAILABLE");}
});

test('all execution control modules and CLIs have a critical mutation floor',async()=>{
 const policy=await setup();for(const path of ['scripts/lib/runtime-capabilities.mjs','scripts/lib/execution-context.mjs','scripts/lib/execution-receipt.mjs','scripts/lib/verification-runner.mjs','scripts/lib/cloud-verification.mjs','scripts/lib/machine-profile.mjs','scripts/lib/machine-profile-validation.mjs','scripts/resolve-execution-context.mjs','scripts/finalize-execution.mjs','scripts/init-execution-profile.mjs','scripts/run-verification.mjs','scripts/request-cloud-verification.mjs','scripts/verify-installed-skills.mjs','scripts/verify-real-email-visual.mjs']){const r=select(policy,'bounded-change',caps(),{operation:'write',allowedPaths:[path]});assert.equal(r.base_tier,3,path);assert.equal(r.executor.tier,4,path);}
 assert.equal(select(policy,'bounded-change',caps(),{operation:'write',allowedPaths:['tests/skills/ordinary-fixture.test.mjs']}).base_tier,2);
});
