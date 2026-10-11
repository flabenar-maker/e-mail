import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, rm, writeFile, mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {loadExecutionPolicy} from '../../scripts/lib/execution-policy.mjs';
import {workloadSignature} from '../../scripts/lib/execution-context.mjs';
const repoRoot=resolve(import.meta.dirname,'../..');
const sha='a'.repeat(40), other='b'.repeat(40);
const hash=x=>createHash('sha256').update(x).digest('hex');
const api=()=>import('../../scripts/lib/verification-runner.mjs');
async function fixture(t, extra={}) {
 const root=await mkdtemp(join(tmpdir(),'cupis-runner-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const calls=[];
 return {calls,root,options:{requestId:'task4-contract',sourceSha:sha,workloadIds:['docs-scoped'],target:'local',repoRoot,outputRoot:join(root,'evidence'),lockRoot:join(root,'persistent','runner-locks'),runner:{readSourceSha:async()=>sha,checkRuntime:async()=>{},checkDependencies:async()=>({mode:'direct-equivalent'}),execute:async command=>{calls.push(command);return {status:'success',exitCode:0,stdout:'actual synthetic command evidence',stderr:''};}},...extra}};
}
test('exact checkout SHA mismatch refuses before any workload',async t=>{const f=await fixture(t);f.options.runner.readSourceSha=async()=>other;await assert.rejects((await api()).runVerification(f.options),{code:'VERIFICATION_SOURCE_MISMATCH'});assert.equal(f.calls.length,0);});
test('same fixed source commands and signatures on local and cloud',async t=>{
 const f=await fixture(t),{runVerification}=await api(), policy=await loadExecutionPolicy({repoRoot});
 const local=await runVerification(f.options);const localCommands=structuredClone(f.calls);f.calls.length=0;
 const cloud=await runVerification({...f.options,target:'github-hosted',outputRoot:join(f.root,'cloud'),cloudIdentity:{workflow_sha:other,event_sha:'c'.repeat(40),run_id:'17',run_attempt:'2'}});
 assert.deepEqual(f.calls,localCommands);assert.equal(local.workflow_sha,null);assert.equal(cloud.workflow_sha,other);assert.equal(cloud.event_sha,'c'.repeat(40));assert.equal(cloud.run_id,'17');assert.equal(cloud.run_attempt,'2');
 assert.equal(local.workload_results[0].signature,workloadSignature(policy.workloads.find(x=>x.id==='docs-scoped')));
 assert.equal(local.conclusion,'success');assert.ok(local.evidence_refs.length);for(const ref of local.evidence_refs)assert.equal(hash(await readFile(join(f.options.outputRoot,ref.path))),ref.digest);
});
for(const status of ['skipped','timed_out','cancelled','failure','infrastructure-error'])test(status+' is never successful evidence',async t=>{const f=await fixture(t);f.options.runner.execute=async()=>({status,exitCode:status==='failure'?7:-1});const result=await (await api()).runVerification(f.options);assert.notEqual(result.conclusion,'success');assert.equal(result.workload_results[0].status,status);});
test('nonzero and unavailable executable preserve failure',async t=>{const f=await fixture(t);f.options.runner.execute=async()=>({status:'success',exitCode:3});const bad=await (await api()).runVerification(f.options);assert.equal(bad.conclusion,'failure');assert.equal(bad.workload_results[0].exit_code,3);f.options.outputRoot=join(f.root,'missing');f.options.runner.execute=async()=>{throw Object.assign(new Error('not found'),{code:'ENOENT'});};assert.equal((await (await api()).runVerification(f.options)).conclusion,'infrastructure-error');});
for(const id of ['installed-skills','real-email-visual'])test(id+' forbidden in cloud before execution',async t=>{const f=await fixture(t,{target:'github-hosted',workloadIds:[id],cloudIdentity:{workflow_sha:sha,event_sha:other,run_id:'1',run_attempt:'1'}});await assert.rejects((await api()).runVerification(f.options),{code:'VERIFICATION_LOCAL_ONLY'});assert.equal(f.calls.length,0);});
test('caller command injection and weakened limits rejected',async t=>{const f=await fixture(t);await assert.rejects((await api()).runVerification({...f.options,commands:[{executable:'evil',args:[]}]}),{code:'VERIFICATION_ARGUMENTS_INVALID'});await assert.rejects((await api()).runVerification({...f.options,limits:{concurrency:9,timeout_minutes:31,max_heavy_batches:2}}),{code:'VERIFICATION_LIMITS_INVALID'});});
test('persistent heavy lock prevents concurrent batches across distinct evidence roots',async t=>{const f=await fixture(t,{workloadIds:['repository-full']});let release,entered;const started=new Promise(r=>entered=r);f.options.runner.execute=async()=>{entered();await new Promise(r=>release=r);return {status:'failure',exitCode:1};};const {runVerification}=await api();const first=runVerification(f.options);await started;try{await assert.rejects(runVerification({...f.options,outputRoot:join(f.root,'second')}),{code:'VERIFICATION_HEAVY_BATCH_ACTIVE'});}finally{release();await first;}});
test('lock inside disposable source is refused',async t=>{const f=await fixture(t,{workloadIds:['repository-full'],lockRoot:join(repoRoot,'.locks')});await assert.rejects((await api()).runVerification(f.options),{code:'VERIFICATION_LOCK_ROOT_INVALID'});});
test('consuming workload requires file input refs and artifact identity',async t=>{const f=await fixture(t,{workloadIds:['installed-skills']});await assert.rejects((await api()).runVerification(f.options),{code:'VERIFICATION_INPUT_MISSING'});});
test('inventory validator rehashes actual authorized files every call',async t=>{const f=await fixture(t),{validateInputInventory}=await import('../../scripts/lib/execution-inputs.mjs');const root=join(f.root,'skills');await mkdir(root);await writeFile(join(root,'SKILL.md'),'first');const inventory={schema_version:'1.0.0',kind:'installed-skills',files:[{path:'SKILL.md',digest:hash('first')}]};await validateInputInventory({inventory,root});await writeFile(join(root,'SKILL.md'),'second');await assert.rejects(validateInputInventory({inventory,root}),{code:'VERIFICATION_INPUT_CHANGED'});});
test('visual helper rejects file-only evidence without independent qualified image review',async t=>{await assert.rejects((await import('../../scripts/verify-real-email-visual.mjs')).verifyRealEmailVisual({}),{code:'VISUAL_EVIDENCE_MISSING'});});
test('installed helper rejects unbound paths rather than claiming PASS',async t=>{await assert.rejects((await import('../../scripts/verify-installed-skills.mjs')).verifyInstalledSkills({}),{code:'INSTALLED_SKILLS_EVIDENCE_MISSING'});});
test('Windows workload uses process-only ExecutionPolicy Bypass on every fixed command',async()=>{const p=await loadExecutionPolicy({repoRoot});for(const command of p.workloads.find(x=>x.id==='windows-bootstrap').commands){assert.deepEqual(command.args.slice(0,5),['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File']);}});
test('docs workload narrows guard tests from changed paths without accepting arbitrary argv',async()=>{const {selectDocsTests}=await api();assert.deepEqual(selectDocsTests(['.agents/skills/building-cupis-emails/SKILL.md']),['tests/skills/email-build-skill-boundary.test.mjs']);assert.throws(()=>selectDocsTests(['../outside']),{code:'VERIFICATION_CHANGED_PATH_INVALID'});});
test('total deadline is shared across commands and workloads',async t=>{
 const f=await fixture(t,{workloadIds:['repository-full','docs-scoped']});let now=100,executions=0;f.options.runner.now=()=>now;f.options.runner.execute=async(command,options)=>{executions++;assert.equal(options.timeoutMs,1800000);now+=1800001;return {status:'success',exitCode:0};};
 const receipt=await (await api()).runVerification(f.options);assert.equal(executions,1);assert.equal(receipt.conclusion,'timed_out');assert.equal(receipt.workload_results.length,2);assert.ok(receipt.workload_results.every(r=>r.status==='timed_out'));
});
test('unconfirmed termination retains persistent heavy lock for manual recovery',async t=>{
 const f=await fixture(t,{workloadIds:['repository-full']});f.options.runner.execute=async()=>({status:'infrastructure-error',exitCode:-1,terminationConfirmed:false});const {runVerification}=await api();assert.equal((await runVerification(f.options)).conclusion,'infrastructure-error');await assert.rejects(runVerification({...f.options,outputRoot:join(f.root,'another-run')}),{code:'VERIFICATION_HEAVY_BATCH_ACTIVE'});
});
test('owned process times out and confirms termination before returning',async()=>{
 const {executeVerificationCommand}=await api();const result=await executeVerificationCommand({executable:'node',args:['--eval','setInterval(()=>{},1000)']},{repoRoot,timeoutMs:250});assert.equal(result.status,'timed_out');assert.equal(result.terminationConfirmed,true);
});
test('owned process cancellation does not produce a successful result',async()=>{
 const {executeVerificationCommand}=await api(),controller=new AbortController();const pending=executeVerificationCommand({executable:'node',args:['--eval','setInterval(()=>{},1000)']},{repoRoot,timeoutMs:5000,signal:controller.signal});setTimeout(()=>controller.abort(),250);const result=await pending;assert.equal(result.status,'cancelled');assert.equal(result.terminationConfirmed,true);
});
