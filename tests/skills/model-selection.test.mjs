import test from 'node:test';
import assert from 'node:assert/strict';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadExecutionPolicy} from '../../scripts/lib/execution-policy.mjs';
import * as api from '../../scripts/lib/model-selection.mjs';
import {createRuntimeCapabilityCache,validateRuntimeCapabilities} from '../../scripts/lib/runtime-capabilities.mjs';
const repoRoot=dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const inherited={binding:'inherited',id:null};
const explicit={binding:'explicit',id:'user-selected-model'};
const caps=(selected_model=inherited,supported_efforts=['low','medium','high','xhigh'])=>({schema_version:'1.0.0',runtime_session_id:'test-session',tool_signature:'actual-spawn-tool',source:'declared-runtime-tools',max_subagents:3,selected_model,supported_efforts,capabilities:['text','code','vision']});
async function select(taskKind='bounded-change',runtime=caps(),extra={}){
 assert.equal(typeof api.selectEffort,'function','execution chooses effort on one selected model');
 return api.selectEffort({policy:await loadExecutionPolicy({repoRoot}),taskKind,operation:'read',allowedPaths:['docs/example.md'],capabilities:runtime,...extra});
}
test('task matrix takes one supported effort step while preserving hidden selected model',async()=>{
 for(const [kind,base,target] of [['mechanical-read','low','medium'],['run-prescribed-checks','low','medium'],['bounded-change','medium','high'],['failure-diagnosis','medium','high'],['visual-compare','medium','high'],['architecture-change','high','xhigh'],['policy-change','high','xhigh'],['contract-change','high','xhigh'],['ambiguous-task','high','xhigh']]){
  const result=await select(kind);assert.equal(result.status,'resolved');assert.equal(result.base_effort,base);assert.equal(result.target_effort,target);assert.equal(result.executor.effort,target);assert.deepEqual(result.executor.selected_model,inherited);assert.deepEqual(result.review.reviewer.selected_model,inherited);assert.equal(result.review.distinct_agent_required,true);assert.equal(result.review.primary_sources_required,true);assert.deepEqual(result,await select(kind));
 }
});
test('reliably declared selected ID is preserved without a version registry',async()=>{
 const result=await select('bounded-change',caps(explicit));assert.equal(result.status,'resolved');assert.deepEqual(result.executor.selected_model,explicit);assert.deepEqual(result.review.reviewer.selected_model,explicit);assert.equal(result.executor.effort,result.review.reviewer.effort);assert.equal('tier' in result.executor,false);
});
test('effort cushion uses supported order and saturates at supported ceiling',async()=>{
 const sparse=await select('bounded-change',caps(inherited,['low','high','max']));assert.equal(sparse.executor.effort,'max');
 const ceiling=await select('architecture-change',caps(inherited,['low','medium','high']));assert.equal(ceiling.executor.effort,'high');assert.equal(ceiling.safety_ceiling_reached,true);
 const unsupportedFloor=await select('architecture-change',caps(inherited,['low','medium']));assert.equal(unsupportedFloor.status,'blocked');assert.equal(unsupportedFloor.blockers[0].code,'EFFORT_UNAVAILABLE');
});
test('critical scopes raise effort floor and Windows aliases cannot bypass it',async()=>{
 for(const path of ['schemas/x.json','.agents/skills/x/SKILL.md','scripts/lib/execution-context.mjs','scripts/lib/email-renderer.mjs','system/manifest.yaml','AGENTS.md','ScHeMaS\\x.json']){const result=await select('bounded-change',caps(),{operation:'write',allowedPaths:[path]});assert.equal(result.base_effort,'high',path);assert.equal(result.executor.effort,'xhigh',path);}
 for(const path of ['../schemas/x.json','schemas./x.json','schema~1/x.json','NUL/x.md'])assert.equal((await select('bounded-change',caps(),{operation:'write',allowedPaths:[path]})).status,'blocked',path);
 for(const kind of ['mechanical-read','run-prescribed-checks'])assert.equal((await select(kind,caps(),{operation:'write',allowedPaths:['docs/x.md']})).blockers[0].code,'EXECUTION_TASK_KIND_SCOPE_MISMATCH');
});
test('typed effort refusal retries the same selection; actual model rejection never substitutes',async()=>{
 const runtime=caps();runtime.refusals=[{runtime_session_id:runtime.runtime_session_id,tool_signature:runtime.tool_signature,selected_model:inherited,effort:'high',code:'EFFORT_UNAVAILABLE'}];let result=await select('bounded-change',runtime);assert.equal(result.executor.effort,'xhigh');assert.deepEqual(result.executor.selected_model,inherited);
 runtime.refusals[0].code='MODEL_UNAVAILABLE';result=await select('bounded-change',runtime);assert.equal(result.status,'blocked');assert.equal(result.blockers[0].code,'MODEL_UNAVAILABLE');
 runtime.refusals[0].tool_signature='old-tool';assert.equal((await select('bounded-change',runtime)).executor.effort,'high');
 runtime.refusals[0].tool_signature=runtime.tool_signature;runtime.refusals[0].selected_model=explicit;assert.equal((await select('bounded-change',runtime)).executor.effort,'high');
});
test('only actual selected runtime capabilities qualify; unknown ID itself does not block',async()=>{
 assert.equal((await select('visual-compare',caps())).status,'resolved');const noVision=caps();noVision.capabilities=['text','code'];assert.equal((await select('visual-compare',noVision)).blockers[0].code,'CAPABILITY_UNAVAILABLE');
 for(const change of [{source:'models-cache'},{runtime_session_id:''},{tool_signature:''},{max_subagents:0},{selected_model:{binding:'inherited',id:'invented'}},{supported_efforts:['unsupported']},{supported_efforts:['high','low']},{models:[{id:'other-model'}]}])assert.equal(validateRuntimeCapabilities({...caps(),...change}),false,JSON.stringify(change));
});
test('session cache binds selected model and one-shot attempts; network errors remain transient',()=>{
 const cache=createRuntimeCapabilityCache(),runtime=caps(),key={runtime_session_id:runtime.runtime_session_id,tool_signature:runtime.tool_signature};let reads=0;const read=()=>{reads++;return runtime;};cache.get({...key,read});cache.get({...key,read});assert.equal(reads,1);
 const attempt={...key,selected_model:inherited,effort:'high'};assert.equal(cache.beginAttempt({...attempt,selected_model:explicit}),false);assert.equal(cache.recordRefusal({...attempt,code:'EFFORT_UNAVAILABLE'}),false);
 for(const outcome of ['success','network-error']){assert.equal(cache.beginAttempt(attempt),true);assert.equal(cache.finishAttempt({...attempt,outcome}),true);}
 assert.equal(cache.beginAttempt(attempt),true);assert.equal(cache.beginAttempt(attempt),false);assert.equal(cache.recordRefusal({...attempt,code:'NETWORK_ERROR'}),false);assert.equal(cache.recordRefusal({...attempt,code:'EFFORT_UNAVAILABLE'}),true);assert.equal(cache.finishAttempt({...attempt,outcome:'success'}),false);assert.equal(cache.beginAttempt(attempt),false);assert.equal(cache.get({...key,read}).refusals.length,1);assert.equal(reads,1);
 assert.equal(cache.beginAttempt({...attempt,effort:'xhigh'}),true);
 const newKey={...key,tool_signature:'new-tool'};cache.get({...newKey,read:()=>({...read(),tool_signature:'new-tool'})});assert.equal(reads,2);assert.equal(cache.beginAttempt({...attempt,...newKey}),true);
});
test('a user selection change invalidates the same-session cached binding and refusals',()=>{
 const cache=createRuntimeCapabilityCache(),initial=caps(),key={runtime_session_id:initial.runtime_session_id,tool_signature:initial.tool_signature};cache.get({...key,selected_model:inherited,read:()=>initial});const attempt={...key,selected_model:inherited,effort:'high'};assert.equal(cache.beginAttempt(attempt),true);assert.equal(cache.recordRefusal({...attempt,code:'EFFORT_UNAVAILABLE'}),true);
 const updated=cache.get({...key,selected_model:explicit,read:()=>caps(explicit)});assert.deepEqual(updated.selected_model,explicit);assert.equal(updated.refusals?.length??0,0);assert.equal(cache.beginAttempt(attempt),false);assert.equal(cache.beginAttempt({...attempt,selected_model:explicit}),true);
});

test('explicit hidden-selection event clears same-binding cache and active/refused attempts',()=>{
 const cache=createRuntimeCapabilityCache(),runtime=caps(),identity={runtime_session_id:runtime.runtime_session_id,tool_signature:runtime.tool_signature};let reads=0;const read=()=>{reads++;return runtime;};cache.get({...identity,read});
 const oldAttempt={...identity,selected_model:inherited,effort:'high'};assert.equal(cache.beginAttempt(oldAttempt),true);assert.equal(cache.recordRefusal({...oldAttempt,code:'EFFORT_UNAVAILABLE'}),true);assert.equal(cache.beginAttempt({...oldAttempt,effort:'xhigh'}),true);
 assert.equal(typeof cache.invalidate,'function','hidden model setting change needs an explicit invalidation hook');assert.equal(cache.invalidate(identity),true);assert.equal(cache.invalidate(identity),false);assert.equal(cache.finishAttempt({...oldAttempt,effort:'xhigh',outcome:'success'}),false);assert.equal(cache.beginAttempt(oldAttempt),false);
 const fresh=cache.get({...identity,selected_model:inherited,read});assert.equal(reads,2);assert.equal(fresh.refusals?.length??0,0);assert.equal(cache.beginAttempt(oldAttempt),true);
});
test('account reset drops all runtime snapshots and in-flight guards without model discovery',()=>{
 const cache=createRuntimeCapabilityCache();const a=caps(),b={...caps(),runtime_session_id:'other-session',tool_signature:'other-tool'};for(const runtime of [a,b]){cache.get({...runtime,read:()=>runtime});assert.equal(cache.beginAttempt({runtime_session_id:runtime.runtime_session_id,tool_signature:runtime.tool_signature,selected_model:inherited,effort:'high'}),true);}
 assert.equal(typeof cache.reset,'function');cache.reset();for(const runtime of [a,b]){const attempt={runtime_session_id:runtime.runtime_session_id,tool_signature:runtime.tool_signature,selected_model:inherited,effort:'high'};assert.equal(cache.finishAttempt({...attempt,outcome:'success'}),false);assert.equal(cache.beginAttempt(attempt),false);cache.get({...runtime,read:()=>runtime});assert.equal(cache.beginAttempt(attempt),true);}
});
