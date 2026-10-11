import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadExecutionPolicy} from '../../scripts/lib/execution-policy.mjs';
const api=await import('../../scripts/lib/execution-context.mjs').catch(()=>({}));
const runtime=await import('../../scripts/lib/runtime-capabilities.mjs').catch(()=>({}));
const repoRoot=dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const digest=value=>createHash('sha256').update(value).digest('hex');
const caps=()=>({schema_version:'1.0.0',runtime_session_id:'synthetic-test',tool_signature:'synthetic-tool',source:'declared-runtime-tools',max_subagents:3,models:[['gpt-5.6-terra','medium'],['gpt-5.6-sol','medium'],['gpt-6.1-sol','high'],['gpt-6-astra','high']].map(([id,effort])=>({id,efforts:[effort],capabilities:['text','code','vision']}))});
async function fixture(t,change={}) {
 assert.equal(typeof api.loadExecutionRequest,'function','verified request loader must exist');
 assert.equal(typeof api.resolveExecutionContext,'function','pure context resolver must exist');
 const root=await mkdtemp(join(tmpdir(),'execution-context-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const domain={schema_version:'1.0.0',source_sha:'a'.repeat(40),route:'maintenance',mode:'write',authorization:{operation:'write',allowed_paths:['docs/change.md']},context:{status:'resolved',route:{id:'maintenance'},workflow:{mode:'write'}}};
 Object.assign(domain,change);
 async function ref(path,content){await writeFile(join(root,path),content);return {path,digest:digest(content)};}
 const request={schema_version:'1.0.0',request_id:'request-1',source_sha:'a'.repeat(40),route:'maintenance',mode:'write',executor_agent_id:'actual-worker',task_kind:'bounded-change',operation:'write',allowed_paths:['docs/change.md'],domain_context_ref:await ref('domain.json',JSON.stringify(domain)),requirement_refs:[await ref('requirement.txt','Implement the requested change.')],artifact_refs:[await ref('artifact.txt','Actual complete change.')],workload_ids:[]};
 return {root,domain,request,policy:await loadExecutionPolicy({repoRoot}),capabilities:caps(),ref};
}
test('verified compact decision preserves authorization and source refs',async t=>{
 const f=await fixture(t);const request=await api.loadExecutionRequest({request:f.request,repoRoot:f.root});const result=api.resolveExecutionContext({...f,request});
 assert.equal(result.status,'resolved');assert.deepEqual(result.allowed_paths,f.request.allowed_paths);assert.equal(result.source_sha,f.request.source_sha);assert.deepEqual(result.domain_context_ref,f.request.domain_context_ref);assert.equal(result.review.reviewer.model,'gpt-6-astra');assert.equal(Buffer.byteLength(api.renderExecutionDecision(result))<=4096,true);assert.equal(JSON.stringify(result).includes('task_kinds'),false);
});
test('paused and blocked domain status never authorize model-driven work',async t=>{
 for(const status of ['paused','blocked']) {const f=await fixture(t,{context:{status,blockers:[{code:'DOMAIN_STOP',path:'/',message:'Stop'}]}});const request=await api.loadExecutionRequest({request:f.request,repoRoot:f.root});const result=api.resolveExecutionContext({...f,request});assert.equal(result.status,'blocked');assert.equal(result.domain_status,status);assert.equal(result.executor,null);}
});
test('source, mode and writable scope mismatches fail closed',async t=>{
 for(const change of [{source_sha:'b'.repeat(40)},{mode:'read-only'},{authorization:{operation:'read',allowed_paths:[]}}]) {const f=await fixture(t,change);const request=await api.loadExecutionRequest({request:f.request,repoRoot:f.root});assert.equal(api.resolveExecutionContext({...f,request}).status,'blocked');}
});
test('bad digests, traversal, symlinks and injected domain objects cannot become verified references',async t=>{
 const f=await fixture(t);
 for(const domain_context_ref of [{...f.request.domain_context_ref,digest:'0'.repeat(64)},{path:'../escape',digest:'a'.repeat(64)},f.domain]) await assert.rejects(api.loadExecutionRequest({request:{...f.request,domain_context_ref},repoRoot:f.root}));
 assert.equal(api.resolveExecutionContext({...f,request:f.request}).status,'blocked');
 const loaded=await api.loadExecutionRequest({request:f.request,repoRoot:f.root});assert.throws(()=>{loaded.allowed_paths.push('schemas/injected.json');});
 try {await symlink(join(f.root,'domain.json'),join(f.root,'linked.json'));}catch(error){if(error.code==='EPERM')return;throw error;}
 await assert.rejects(api.loadExecutionRequest({request:{...f.request,domain_context_ref:{...f.request.domain_context_ref,path:'linked.json'}},repoRoot:f.root}));
});
test('runtime injection cannot select a model outside the policy and missing local-only inputs block',async t=>{
 const f=await fixture(t);let request=await api.loadExecutionRequest({request:f.request,repoRoot:f.root});
 assert.equal(api.resolveExecutionContext({...f,request,capabilities:{...caps(),models:[{id:'injected-model',efforts:['high'],capabilities:['text','code']}]}}).status,'blocked');
 request=await api.loadExecutionRequest({request:{...f.request,workload_ids:['installed-skills']},repoRoot:f.root});assert.equal(api.resolveExecutionContext({...f,request}).status,'blocked');
});
test('overflow produces explicit compact diagnostic without truncating a required decision',async t=>{
 const f=await fixture(t);f.request.request_id='x'.repeat(10000);const request=await api.loadExecutionRequest({request:f.request,repoRoot:f.root});const result=api.resolveExecutionContext({...f,request});const output=api.renderExecutionDecision(result);assert.equal(Buffer.byteLength(output)<=4096,true);assert.equal(JSON.parse(output).status,'blocked');assert.equal(JSON.parse(output).blockers[0].code,'EXECUTION_CONTEXT_TOO_LARGE');
});
test('runtime cache reads declarations once per session signature and typed refusals are one-shot',()=>{
 assert.equal(typeof runtime.createRuntimeCapabilityCache,'function','session cache must exist');const cache=runtime.createRuntimeCapabilityCache();let reads=0;const read=()=>{reads++;return caps();};
 const key={runtime_session_id:'synthetic-test',tool_signature:'synthetic-tool'};cache.get({...key,read});cache.get({...key,read});assert.equal(reads,1);
 const candidate={model:'gpt-5.6-terra',effort:'medium'};assert.equal(cache.beginAttempt({...key,...candidate}),true);assert.equal(cache.beginAttempt({...key,...candidate}),false);
 assert.equal(cache.recordRefusal({...key,...candidate,code:'NETWORK_ERROR'}),false);assert.equal(cache.get({...key,read}).refusals?.length??0,0);
 assert.equal(cache.recordRefusal({...key,...candidate,code:'MODEL_UNAVAILABLE'}),true);assert.equal(cache.get({...key,read}).refusals.length,1);assert.equal(reads,1);
 cache.get({...key,tool_signature:'new-tool',read:()=>({...read(),tool_signature:'new-tool'})});assert.equal(reads,2);
});

test('initial unbound resolution works and bound rerun keeps the same tier',async t=>{const f=await fixture(t);delete f.request.executor_agent_id;let request=await api.loadExecutionRequest({request:f.request,repoRoot:f.root});const initial=api.resolveExecutionContext({...f,request});assert.equal(initial.status,'resolved');assert.equal(initial.executor_agent_id,null);request=await api.loadExecutionRequest({request:{...f.request,executor_agent_id:'actual-worker'},repoRoot:f.root});const bound=api.resolveExecutionContext({...f,request});assert.deepEqual(bound.executor,initial.executor);assert.equal(bound.executor_agent_id,'actual-worker');});

test('saved profile needs the active pair and exact workload signature and never widens outputs',async t=>{
 const f=await fixture(t);f.request.workload_ids=['docs-scoped'];f.request.profile_pair_key='opaque-pair';
 const request=await api.loadExecutionRequest({request:f.request,repoRoot:f.root});const workload=f.policy.workloads.find(x=>x.id==='docs-scoped');
 const p={schema_version:'1.0.0',pair_key:'opaque-pair',initialized_at:'2026-10-11T00:00:00Z',observations_status:'available',observations:{platform:'win32'},baseline_policy_digest:f.policy.policy_digest,local_limits:f.policy.local_limits,workload_decisions:[{id:'docs-scoped',signature:api.workloadSignature(workload),target:'local'}]};
 const profile={status:'resolved',pair_key:'opaque-pair',profile:p};let result=api.resolveExecutionContext({...f,request,profile});assert.equal(result.verification[0].target,'local');assert.deepEqual(result.allowed_paths,f.request.allowed_paths);
 for(const invalid of [undefined,{...profile,pair_key:'other'},{...profile,profile:{...p,schema_version:'2.0.0'}},{...profile,profile:{...p,workload_decisions:[{...p.workload_decisions[0],signature:'0'.repeat(64)}]}},{status:'resolved',pair_key:'opaque-pair',profile:{schema_version:'1.0.0',pair_key:'opaque-pair',workload_decisions:p.workload_decisions}}]) assert.equal(api.resolveExecutionContext({...f,request,profile:invalid}).verification[0].target,'github-hosted');
});
test('initial model selection can precede artifact creation',async t=>{const f=await fixture(t);delete f.request.executor_agent_id;f.request.artifact_refs=[];const request=await api.loadExecutionRequest({request:f.request,repoRoot:f.root});assert.equal(api.resolveExecutionContext({...f,request}).status,'resolved');});

test('successful attempts and network outages release the transient guard, typed refusals stay one-shot',()=>{
 assert.equal(typeof runtime.createRuntimeCapabilityCache,'function');const cache=runtime.createRuntimeCapabilityCache();const identity={runtime_session_id:'synthetic-test',tool_signature:'synthetic-tool'};cache.get({...identity,read:caps});const candidate={...identity,model:'gpt-5.6-terra',effort:'medium'};
 assert.equal(typeof cache.finishAttempt,'function','coordinator must be able to finish a successful actual spawn');
 for(const outcome of ['success','network-error']){assert.equal(cache.beginAttempt(candidate),true);assert.equal(cache.finishAttempt({...candidate,outcome}),true);assert.equal(cache.get({...identity,read:caps}).refusals?.length??0,0);}
 assert.equal(cache.beginAttempt(candidate),true);assert.equal(cache.recordRefusal({...candidate,code:'MODEL_UNAVAILABLE'}),true);assert.equal(cache.finishAttempt({...candidate,outcome:'success'}),false);assert.equal(cache.beginAttempt(candidate),false);
});

test('consuming workloads preserve verified named inputs and bind the selected input digest',async t=>{const f=await fixture(t);f.request.workload_ids=['installed-skills'];f.request.input_refs={installed_skills_root:await f.ref('input.json',JSON.stringify({root:'explicit-authorized-local-root'}))};const request=await api.loadExecutionRequest({request:f.request,repoRoot:f.root});const result=api.resolveExecutionContext({...f,request});assert.equal(result.status,'resolved');assert.deepEqual(result.input_refs,f.request.input_refs);assert.match(result.verification[0].input_digest,/^[a-f0-9]{64}$/);});
