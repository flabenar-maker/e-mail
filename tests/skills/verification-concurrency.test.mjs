import test from 'node:test';
import assert from 'node:assert/strict';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import receiptSchema from '../../schemas/execution-receipt.schema.json' with {type:'json'};
import {loadExecutionPolicy} from '../../scripts/lib/execution-policy.mjs';
const api=await import('../../scripts/lib/verification-concurrency.mjs').catch(()=>({}));
const root=dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const mapped=['docs-scoped','repository-full','visual-fixtures'];
const baseHashes={'docs-scoped':'f47df6c522fe977991ff0746b476b12dc6606c28c0aef202ade0ca0db7ad1193','repository-full':'eadbe127cba50b6947eeb572fee1223463060340b45c90fd7de7ab396de61ab1','visual-fixtures':'b508433aa050c0671b90397f1024b135f6817ecc454df459f472b7e5bfdff319'};
function derive(options){assert.equal(typeof api.deriveVerificationWorkload,'function','source-approved concurrency derivation must exist');return api.deriveVerificationWorkload(options);}
function select(options){assert.equal(typeof api.selectLocalTestConcurrency,'function','trusted saved selection must exist');return api.selectLocalTestConcurrency(options);}
function profile(policy,extra={}){return {schema_version:'1.0.0',pair_key:'pair',initialized_at:'2026-10-11T00:00:00Z',observations_status:'unavailable',observations:null,baseline_policy_digest:policy.policy_digest,local_limits:structuredClone(policy.local_limits),workload_decisions:[],...extra};}
test('default2 preserves legacy command bytes and fixed canonical hashes',async()=>{
 const policy=await loadExecutionPolicy({repoRoot:root});
 for(const id of mapped){const workload=policy.workloads.find(x=>x.id===id);const effective=derive({policy,workload,target:'local'});assert.equal(JSON.stringify(effective),JSON.stringify(workload));assert.equal(api.workloadSignature(effective),baseHashes[id]);assert.notEqual(effective,workload);}
});
test('local4 derives literal full and visual Node argv without changing other commands or source policy',async()=>{
 const policy=await loadExecutionPolicy({repoRoot:root}),before=JSON.stringify(policy);
 const full=derive({policy,workload:policy.workloads.find(x=>x.id==='repository-full'),target:'local',testConcurrency:4});
 assert.deepEqual(full.commands,[{executable:'node',args:['scripts/validate-system.mjs']},{executable:'node',args:['--test','--test-concurrency=4','tests/foundation/*.test.mjs','tests/characterization/*.test.mjs','tests/components/*.test.mjs','tests/generation/*.test.mjs','tests/rendering/*.test.mjs','tests/workflows/*.test.mjs','tests/skills/*.test.mjs']},{executable:'node',args:['scripts/generate-docs.mjs','--check']}]);
 assert.deepEqual(full.limits,{concurrency:4,timeout_minutes:30,max_heavy_batches:1});assert.notEqual(api.workloadSignature(full),baseHashes['repository-full']);
 const visual=derive({policy,workload:policy.workloads.find(x=>x.id==='visual-fixtures'),target:'local',testConcurrency:4});assert.deepEqual(visual.commands,[{executable:'node',args:['--test','--test-concurrency=4','tests/rendering/visual-scenarios.test.mjs','tests/rendering/pilot-fidelity-regressions.test.mjs','tests/rendering/qr-artwork-geometry.test.mjs']}]);assert.notEqual(api.workloadSignature(visual),baseHashes['visual-fixtures']);assert.equal(JSON.stringify(policy),before);
});
test('docs local4 uses only the bounded fixed wrapper flag and default2 has no added argv',async()=>{
 const policy=await loadExecutionPolicy({repoRoot:root}),workload=policy.workloads.find(x=>x.id==='docs-scoped');
 assert.deepEqual(derive({policy,workload,target:'local',testConcurrency:4}).commands,[{executable:'node',args:['scripts/lib/execution-docs-check.mjs','--test-concurrency','4']}]);
 assert.deepEqual(derive({policy,workload,target:'local',testConcurrency:2}).commands,[{executable:'node',args:['scripts/lib/execution-docs-check.mjs']}]);
});
test('nonmapped rows stay unchanged2 and cloud rejects an explicit4 request',async()=>{
 const policy=await loadExecutionPolicy({repoRoot:root});
 for(const workload of policy.workloads){if(!mapped.includes(workload.id))assert.deepEqual(derive({policy,workload,target:'local',testConcurrency:4}),workload);assert.deepEqual(derive({policy,workload,target:'github-hosted'}),workload);assert.throws(()=>derive({policy,workload,target:'github-hosted',testConcurrency:4}),e=>e.code==='VERIFICATION_CONCURRENCY_UNSUPPORTED');}
});
test('only numeric2 and4 are accepted and an absent legacy choice reads2',async()=>{
 const policy=await loadExecutionPolicy({repoRoot:root}),workload=policy.workloads[0];
 assert.equal(select({policy,profile:profile(policy),pairKey:'pair'}),2);assert.equal(select({policy,profile:profile(policy,{test_concurrency:4}),pairKey:'pair'}),4);assert.equal(select({policy,profile:profile(policy,{test_concurrency:4}),pairKey:'other'}),2);
 for(const value of [0,1,3,6,8,null,'4']){assert.throws(()=>derive({policy,workload,target:'local',testConcurrency:value}),e=>e.code==='VERIFICATION_CONCURRENCY_INVALID');assert.throws(()=>select({policy,profile:profile(policy,{test_concurrency:value}),pairKey:'pair'}),e=>e.code==='VERIFICATION_CONCURRENCY_INVALID');}
});
test('legacy policy permits2 and refuses saved4 without silently downgrading',async()=>{
 const policy=await loadExecutionPolicy({repoRoot:root});delete policy.local_test_concurrency;
 assert.equal(select({policy,profile:profile(policy),pairKey:'pair'}),2);
 assert.throws(()=>select({policy,profile:profile(policy,{test_concurrency:4}),pairKey:'pair'}),e=>e.code==='VERIFICATION_CONCURRENCY_UNSUPPORTED');
 assert.throws(()=>derive({policy,workload:policy.workloads[0],target:'local',testConcurrency:4}),e=>e.code==='VERIFICATION_CONCURRENCY_UNSUPPORTED');
});
test('caller argv injection and duplicate or unexpected canonical concurrency flags are rejected',async()=>{
 const policy=await loadExecutionPolicy({repoRoot:root});const workload=policy.workloads.find(x=>x.id==='repository-full');const injected=structuredClone(workload);injected.commands[1].args.push('--import=caller.mjs');assert.throws(()=>derive({policy,workload:injected,target:'local',testConcurrency:4}),e=>e.code==='VERIFICATION_WORKLOAD_MISMATCH');
 for(const flag of ['--test-concurrency=4','--test-concurrency','--test-concurrency=2']){const altered=structuredClone(policy),source=altered.workloads.find(x=>x.id==='repository-full');source.commands[1].args.push(flag);assert.throws(()=>derive({policy:altered,workload:source,target:'local',testConcurrency:4}),e=>e.code==='VERIFICATION_WORKLOAD_MISMATCH');}
});
test('strict receipt schema admits optional mapped local values and rejects cloud or other row fields',()=>{
 const validate=new Ajv2020({strict:true,allErrors:true}).compile(receiptSchema);
 const receipt={schema_version:'1.0.0',request_id:'r',source_sha:'a'.repeat(40),workflow_sha:null,target:'local',workload_results:[{id:'docs-scoped',signature:baseHashes['docs-scoped'],status:'success',exit_code:0}],conclusion:'success',evidence_refs:[]};
 assert.equal(validate(receipt),true);for(const value of [2,4])assert.equal(validate({...receipt,workload_results:[{...receipt.workload_results[0],test_concurrency:value}]}),true);
 for(const value of [0,1,3,6,8,null,'4'])assert.equal(validate({...receipt,workload_results:[{...receipt.workload_results[0],test_concurrency:value}]}),false);
 assert.equal(validate({...receipt,test_concurrency:4}),false);assert.equal(validate({...receipt,workload_results:[{...receipt.workload_results[0],id:'installed-skills',test_concurrency:2}]}),false);
 const cloud={...receipt,target:'github-hosted',workflow_sha:'a'.repeat(40),event_sha:'a'.repeat(40),run_id:'1',run_attempt:'1'};assert.equal(validate(cloud),true);assert.equal(validate({...cloud,workload_results:[{...receipt.workload_results[0],test_concurrency:2}]}),false);
});
