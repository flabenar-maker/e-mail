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
 const caps={schema_version:'1.0.0',runtime_session_id:'synthetic-cli',tool_signature:'synthetic',source:'declared-runtime-tools',max_subagents:3,models:[{id:'gpt-5.6-terra',efforts:['medium'],capabilities:['text','code']}]};
 await writeFile(join(dir,'request.json'),JSON.stringify(request));await writeFile(join(dir,'caps.json'),JSON.stringify(caps));
 const args=['--request',join(dir,'request.json'),'--capabilities',join(dir,'caps.json'),'--repo-root',root,'--profile',join(dir,'DOES-NOT-EXIST')];
 let result=cli('resolve-execution-context.mjs',args);assert.equal(result.status,0,result.stderr+result.stdout);assert.equal(result.json().status,'resolved');assert.equal(Buffer.byteLength(result.stdout)<=4096,true);
 request.source_sha='b'.repeat(40);await writeFile(join(dir,'request.json'),JSON.stringify(request));result=cli('resolve-execution-context.mjs',args);assert.equal(result.status,1);assert.equal(result.json().blockers[0].code,'EXECUTION_SOURCE_MISMATCH');request.source_sha=sourceSha;
 request.domain_context_ref.digest='0'.repeat(64);await writeFile(join(dir,'request.json'),JSON.stringify(request));result=cli('resolve-execution-context.mjs',args);assert.equal(result.status,1);assert.equal(result.json().status,'blocked');
});
test('finalize rejects malformed JSON receipt as blocked exit1',async t=>{const dir=await mkdtemp(join(tmpdir(),'execution-finalize-'));t.after(()=>rm(dir,{recursive:true,force:true}));await writeFile(join(dir,'bad.json'),'{}');const result=cli('finalize-execution.mjs',['--decision',join(dir,'bad.json'),'--review',join(dir,'bad.json'),'--verification',join(dir,'bad.json'),'--artifact-digest','a'.repeat(64)]);assert.equal(result.status,1);assert.equal(result.json().status,'blocked');});
