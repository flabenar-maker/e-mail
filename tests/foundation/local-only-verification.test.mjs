import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import YAML from 'yaml';
const root=resolve(import.meta.dirname,'../..');
test('only explicit opt-in verification workflow; no automatic push, synchronize or schedule',async()=>{
 const dir=resolve(root,'.github/workflows');assert.deepEqual((await readdir(dir)).filter(x=>/\.ya?ml$/u.test(x)),['cupis-verification.yml']);
 const raw=await readFile(resolve(dir,'cupis-verification.yml'),'utf8'),w=YAML.parse(raw);
 assert.deepEqual(Object.keys(w.on).sort(),['pull_request','workflow_dispatch']);assert.deepEqual(w.on.pull_request.types,['labeled']);assert.deepEqual(w.permissions,{contents:'read'});
 assert.match(w.jobs.verify.if,/cupis-cloud-verification/u);assert.match(w.jobs.verify.if,/head.repo.full_name/u);assert.match(w.jobs.verify.if,/mergeable/u);
 assert.equal(w.jobs.verify['runs-on'],'windows-2025');assert.equal(w.jobs.verify['timeout-minutes'],30);
 for(const step of w.jobs.verify.steps){if(step.uses)assert.match(step.uses,/^[\w-]+\/[\w-]+@[a-f0-9]{40}$/u);if(step.run)assert.doesNotMatch(step.run,/\$\{\{/u);}
 assert.match(raw,/persist-credentials: false/u);assert.match(raw,/GITHUB_EVENT_PATH/u);assert.match(raw,/run-verification\.mjs/u);assert.doesNotMatch(raw,/pull_request_target|secrets\.|npm run verify/u);
});
test('owned label marker carries exact selection and preserves every other PR body byte',async()=>{
 const {writeCloudRequestMarker,readCloudEventRequest}=await import('../../scripts/lib/execution-cloud-event.mjs');const request={schema_version:'1.0.0',request_id:'same-request',source_sha:'a'.repeat(40),workload_ids:['docs-scoped']};
 const original='User text\n```json\n{"untrusted":"$(whoami)"}\n```\n';const body=writeCloudRequestMarker(original,request);assert.ok(body.startsWith(original));assert.equal(writeCloudRequestMarker(body,request),body);
 const event={action:'labeled',label:{name:'cupis-cloud-verification'},repository:{full_name:'owner/repo'},pull_request:{body,head:{sha:request.source_sha,repo:{full_name:'owner/repo'}},mergeable:true}};
 assert.deepEqual(readCloudEventRequest({eventName:'pull_request',event}),request);
 for(const mutate of [e=>e.pull_request.head.sha='b'.repeat(40),e=>e.pull_request.head.repo.full_name='fork/repo',e=>e.pull_request.mergeable=null,e=>e.action='synchronize',e=>e.pull_request.body+='\n'+body]){const e=structuredClone(event);mutate(e);assert.throws(()=>readCloudEventRequest({eventName:'pull_request',event:e}));}
 assert.throws(()=>writeCloudRequestMarker(original,{...request,commands:['evil']}));
});
