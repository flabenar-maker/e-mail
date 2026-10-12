import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const sourceSha=spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim();
const hash=x=>createHash('sha256').update(x).digest('hex');
const cli=(name,args)=>{const r=spawnSync(process.execPath,[join(root,'scripts',name),...args],{encoding:'utf8'});return {...r,json:()=>JSON.parse(r.stdout)};};
test('CLI malformed arguments use exit2 and typed JSON',()=>{for(const name of ['resolve-execution-context.mjs','finalize-execution.mjs']){const r=cli(name,['--unexpected','x']);assert.equal(r.status,2,'malformed arguments require exit 2');assert.equal(r.json().status,'blocked');}});
test('resolve CLI verifies refs and does not read optional profile without workloads',async t=>{
 const dir=await mkdtemp(join(tmpdir(),'execution-cli-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const domain={schema_version:'1.0.0',source_sha:sourceSha,route:'maintenance',mode:'read-only',authorization:{operation:'read',allowed_paths:['docs/change.md']},context:{status:'resolved',route:{id:'maintenance'},workflow:{mode:'read-only'}}};
 // Repo-root is the allowed reference root. Files live in an explicit temporary subdirectory.
 const {mkdir}=await import('node:fs/promises');const scratch=join(root,'.execution-cli-'+process.pid);await mkdir(scratch,{recursive:true});t.after(()=>rm(scratch,{recursive:true,force:true}));
 async function ref(name,value){const text=typeof value==='string'?value:JSON.stringify(value);await writeFile(join(scratch,name),text);return {path:scratch.slice(root.length+1).replaceAll('\\','/')+'/'+name,digest:hash(text)};}
 const request={schema_version:'1.0.0',request_id:'r1',source_sha:sourceSha,route:'maintenance',mode:'read-only',executor_agent_id:'worker',domain_context_ref:await ref('domain.json',domain),task_kind:'mechanical-read',operation:'read',allowed_paths:['docs/change.md'],requirement_refs:[await ref('requirement.txt','Read actual source')],artifact_refs:[await ref('artifact.txt','Actual result')],workload_ids:[]};
 const caps={schema_version:'1.0.0',runtime_session_id:'synthetic-cli',tool_signature:'synthetic',source:'declared-runtime-tools',max_subagents:3,selected_model:{binding:'inherited',id:null},supported_efforts:['low','medium','high'],capabilities:['text','code']};
 await writeFile(join(dir,'request.json'),JSON.stringify(request));await writeFile(join(dir,'caps.json'),JSON.stringify(caps));
 const args=['--request',join(dir,'request.json'),'--capabilities',join(dir,'caps.json'),'--repo-root',root,'--profile',join(dir,'DOES-NOT-EXIST')];
 let result=cli('resolve-execution-context.mjs',args);assert.equal(result.status,0,result.stderr+result.stdout);assert.equal(result.json().status,'resolved');assert.equal(Buffer.byteLength(result.stdout)<=4096,true);
 request.source_sha='b'.repeat(40);await writeFile(join(dir,'request.json'),JSON.stringify(request));result=cli('resolve-execution-context.mjs',args);assert.equal(result.status,1);assert.equal(result.json().blockers[0].code,'EXECUTION_SOURCE_MISMATCH');request.source_sha=sourceSha;
 request.domain_context_ref.digest='0'.repeat(64);await writeFile(join(dir,'request.json'),JSON.stringify(request));result=cli('resolve-execution-context.mjs',args);assert.equal(result.status,1);assert.equal(result.json().status,'blocked');
});
test('finalize rejects malformed JSON receipt as blocked exit1',async t=>{const dir=await mkdtemp(join(tmpdir(),'execution-finalize-'));t.after(()=>rm(dir,{recursive:true,force:true}));await writeFile(join(dir,'bad.json'),'{}');const result=cli('finalize-execution.mjs',['--decision',join(dir,'bad.json'),'--review',join(dir,'bad.json'),'--verification',join(dir,'bad.json'),'--artifact-digest','a'.repeat(64)]);assert.equal(result.status,1);assert.equal(result.json().status,'blocked');});

test('external real evidence uses one explicit reference root while source stays pinned to snapshot',async t=>{
 const dir=await mkdtemp(join(tmpdir(),'execution-external-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 async function ref(path,value){const bytes=typeof value==='string'?value:JSON.stringify(value);await writeFile(join(dir,path),bytes);return {path,digest:hash(bytes)};}
 const domain={schema_version:'1.0.0',source_sha:sourceSha,route:'maintenance',mode:'read-only',authorization:{operation:'read',allowed_paths:['docs/change.md']},context:{status:'resolved',route:{id:'maintenance'},workflow:{mode:'read-only'}}};
 const request={schema_version:'1.0.0',request_id:'external-1',source_sha:sourceSha,route:'maintenance',mode:'read-only',executor_agent_id:'actual-worker',domain_context_ref:await ref('domain.json',domain),task_kind:'mechanical-read',operation:'read',allowed_paths:['docs/change.md'],requirement_refs:[await ref('requirement.txt','Inspect the source')],artifact_refs:[await ref('artifact.txt','Complete actual inspection result')],workload_ids:[]};
 const caps={schema_version:'1.0.0',runtime_session_id:'synthetic-cli',tool_signature:'synthetic',source:'declared-runtime-tools',max_subagents:3,selected_model:{binding:'inherited',id:null},supported_efforts:['low','medium','high'],capabilities:['text','code']};await writeFile(join(dir,'request.json'),JSON.stringify(request));await writeFile(join(dir,'caps.json'),JSON.stringify(caps));
 const resolved=cli('resolve-execution-context.mjs',['--request',join(dir,'request.json'),'--capabilities',join(dir,'caps.json'),'--repo-root',root,'--reference-root',dir]);assert.equal(resolved.status,0,resolved.stdout);const decision=resolved.json();await writeFile(join(dir,'decision.json'),JSON.stringify(decision));
 const artifactDigest=hash(JSON.stringify(request.artifact_refs.map(r=>({digest:r.digest,path:r.path}))));
 const review={schema_version:'1.0.0',request_id:request.request_id,source_sha:sourceSha,artifact_digest:artifactDigest,executor_agent_id:'actual-worker',reviewer_agent_id:'actual-independent-reviewer',reviewer_model_binding:decision.review.reviewer.selected_model,runtime_session_id:decision.runtime_identity.runtime_session_id,tool_signature:decision.runtime_identity.tool_signature,reviewer_effort:decision.review.reviewer.effort,review_mode:decision.review.mode,primary_sources_reviewed:true,reviewed_refs:[request.domain_context_ref,...request.requirement_refs,...request.artifact_refs],requirement_results:request.requirement_refs.map(ref=>({ref,status:'accepted'})),findings:[],verdict:'accepted'};await writeFile(join(dir,'review.json'),JSON.stringify([review]));await writeFile(join(dir,'verification.json'),'[]');
 const args=['--decision',join(dir,'decision.json'),'--review',join(dir,'review.json'),'--verification',join(dir,'verification.json'),'--artifact-digest',artifactDigest,'--repo-root',root,'--reference-root',dir];let finalized=cli('finalize-execution.mjs',args);assert.equal(finalized.status,0,finalized.stdout);assert.equal(finalized.json().status,'accepted');
 await writeFile(join(dir,'artifact.txt'),'Changed after review');finalized=cli('finalize-execution.mjs',args);assert.equal(finalized.status,1);assert.equal(finalized.json().blockers[0].code,'EXECUTION_REFERENCE_DIGEST_MISMATCH');
});
