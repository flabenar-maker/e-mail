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
test('docs workload narrows guard tests from changed paths without accepting arbitrary argv',async()=>{const {selectDocsTests}=await api();assert.deepEqual(selectDocsTests(['.agents/skills/building-cupis-emails/SKILL.md']),['tests/skills/email-build-skill-boundary.test.mjs','tests/skills/execution-skill-boundary.test.mjs']);assert.throws(()=>selectDocsTests(['../outside']),{code:'VERIFICATION_CHANGED_PATH_INVALID'});});
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
test('a final command returning after the total deadline cannot publish success',async t=>{
 const f=await fixture(t);let now=0;f.options.runner.now=()=>now;f.options.runner.execute=async()=>{now=1800001;return {status:'success',exitCode:0};};
 const receipt=await (await api()).runVerification(f.options);assert.equal(receipt.conclusion,'timed_out');assert.equal(receipt.workload_results[0].status,'timed_out');
});
test('cancellation during the final command cannot publish success',async t=>{
 const f=await fixture(t),controller=new AbortController();f.options.signal=controller.signal;f.options.runner.execute=async()=>{controller.abort();return {status:'success',exitCode:0};};
 assert.equal((await (await api()).runVerification(f.options)).conclusion,'cancelled');
});
test('input inventory stops on an already cancelled batch before reading files',async t=>{
 const f=await fixture(t),controller=new AbortController();await writeFile(join(f.root,'data'),'actual');controller.abort();
 await assert.rejects((await import('../../scripts/lib/execution-inputs.mjs')).validateInputInventory({inventory:{schema_version:'1.0.0',kind:'email_model',files:[{path:'data',digest:hash('actual')}]},root:f.root,signal:controller.signal}),{code:'VERIFICATION_CANCELLED'});
});
test('an output parent alias resolving into source is refused',async t=>{
 const f=await fixture(t),{copyFile,symlink}=await import('node:fs/promises');const source=join(f.root,'source');
 for(const p of ['system/manifest.yaml','data/execution/policy.yaml','schemas/execution-policy.schema.json']){await mkdir(join(source,p.slice(0,p.lastIndexOf('/'))),{recursive:true});await copyFile(join(repoRoot,p),join(source,p));}
 await symlink(source,join(f.root,'alias'),'junction');
 await assert.rejects((await api()).runVerification({...f.options,repoRoot:source,outputRoot:join(f.root,'alias','evidence')}),{code:'VERIFICATION_OUTPUT_ROOT_INVALID'});
});
async function visualFixture(t){
 const f=await fixture(t),{workloadInputDigest}=await import('../../scripts/lib/execution-context.mjs');const inputRefs={},inputRoots={},files={};
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aazsAAAAASUVORK5CYII=','base64');
 for(const name of ['email_model','reference_manifest','evidence_root']){
  const dir=join(f.root,name);await mkdir(dir);inputRoots[name]=dir;
  const content=name==='email_model'?await readFile(join(repoRoot,'tests/fixtures/rendering/pilot-email.json')):png;
  const path=name==='email_model'?'model.json':'image.png';await writeFile(join(dir,path),content);files[name]={path,digest:hash(content)};
  const inventory=JSON.stringify({schema_version:'1.0.0',kind:name,files:[files[name]]});await writeFile(join(f.root,name+'.json'),inventory);inputRefs[name]={path:name+'.json',digest:hash(inventory)};
 }
 const identity={request_id:'visual-task',source_sha:sha,artifact_digest:'d'.repeat(64)};
 const review={schema_version:'1.0.0',...identity,input_digest:workloadInputDigest(inputRefs),executor_agent_id:'executor',reviewer_agent_id:'actual-reviewer',reviewer_model_binding:{binding:'inherited',id:null},runtime_session_id:'actual-session',tool_signature:'actual-tool',reviewer_effort:'high',primary_sources_reviewed:true,verdict:'accepted',reviewed_model:{input:'email_model',...files.email_model},reviewed_images:['reference_manifest','evidence_root'].map(input=>({input,...files[input]})),results:Object.fromEntries(['geometry','layout','spacing','visibility','image','text'].map(x=>[x,'accepted']))};
 const reviewQualification={executor_agent_id:'executor',reviewer_agent_id:'actual-reviewer',selected_model:{binding:'inherited',id:null},runtime_session_id:'actual-session',tool_signature:'actual-tool',effort:'high',supported_efforts:['low','medium','high'],capabilities:['text','vision']};
 const options={inputRefs,inputRoots,referenceRoot:f.root,identity,reviewQualification};
 const save=async()=>{const bytes=JSON.stringify(review);await writeFile(join(f.root,'review.json'),bytes);reviewQualification.review_ref={path:'review.json',digest:hash(bytes)};};await save();
 return {f,options,review,save,files};
}
test('complete formal image review remains accepted but incomplete qualification cannot pass',async t=>{
 const {verifyRealEmailVisual}=await import('../../scripts/verify-real-email-visual.mjs');const valid=await visualFixture(t);assert.equal((await verifyRealEmailVisual(valid.options)).status,'success');
 for(const field of ['selected_model','effort','runtime_session_id','tool_signature']){const f=await visualFixture(t);delete f.options.reviewQualification[field];delete f.review[field==='selected_model'?'reviewer_model_binding':field==='effort'?'reviewer_effort':field];await f.save();await assert.rejects(verifyRealEmailVisual(f.options),{code:'VISUAL_REVIEW_INVALID'});}
 for(const change of [{capabilities:'vision'},{reviewer_agent_id:''},{reviewer_agent_id:37},{reviewer_agent_id:'other-reviewer'},{selected_model:{binding:'inherited',id:'invented'}},{effort:[]},{executor_agent_id:3}]){const f=await visualFixture(t);Object.assign(f.options.reviewQualification,change);await assert.rejects(verifyRealEmailVisual(f.options),{code:'VISUAL_REVIEW_INVALID'});}
});
test('visual reviewer must explicitly cover the actual canonical email model',async t=>{
 const {verifyRealEmailVisual}=await import('../../scripts/verify-real-email-visual.mjs');const f=await visualFixture(t);delete f.review.reviewed_model;await f.save();await assert.rejects(verifyRealEmailVisual(f.options),{code:'VISUAL_REVIEW_INCOMPLETE'});
});
test('arbitrary JSON object cannot stand in for a canonical email model',async t=>{
 const {verifyRealEmailVisual}=await import('../../scripts/verify-real-email-visual.mjs'),{workloadInputDigest}=await import('../../scripts/lib/execution-context.mjs');const f=await visualFixture(t);
 await writeFile(join(f.options.inputRoots.email_model,'model.json'),'{}');f.files.email_model.digest=hash('{}');
 const inv=JSON.stringify({schema_version:'1.0.0',kind:'email_model',files:[f.files.email_model]});await writeFile(join(f.f.root,'email_model.json'),inv);f.options.inputRefs.email_model.digest=hash(inv);f.review.input_digest=workloadInputDigest(f.options.inputRefs);f.review.reviewed_model={input:'email_model',...f.files.email_model};await f.save();
 await assert.rejects(verifyRealEmailVisual(f.options),{code:'VISUAL_EVIDENCE_UNSUPPORTED'});
});
test('docs scope cannot be narrowed by caller paths while keeping a broad signature',async t=>{
 const f=await fixture(t);await assert.rejects((await api()).runVerification({...f.options,changedPaths:['.agents/skills/building-cupis-emails/SKILL.md']}),{code:'VERIFICATION_ARGUMENTS_INVALID'});
});
test('docs policy signs one canonical first-parent source program',async()=>{
 const policy=await loadExecutionPolicy({repoRoot}),docs=policy.workloads.find(w=>w.id==='docs-scoped');assert.equal(docs.requirements.docs_scope,'first-parent');assert.deepEqual(docs.commands,[{executable:'node',args:['scripts/lib/execution-docs-check.mjs']}]);
});
test('docs scope derives the same exact first-parent paths, commands and digest',async()=>{
 const {deriveDocsScope}=await import('../../scripts/lib/execution-docs-check.mjs');
 const calls=[];const readGit=async args=>{calls.push(args);if(args[0]==='rev-parse')return sha;if(args[0]==='cat-file'&&args[1]==='-p')return 'tree '+other+'\nparent '+other+'\n\nmessage';if(args[0]==='cat-file'&&args[1]==='-e')return '';if(args[0]==='diff')return '.agents/skills/building-cupis-emails/SKILL.md\0';throw new Error('unexpected git call');};
 const scope=await deriveDocsScope({repoRoot,sourceSha:sha,readGit});assert.equal(scope.source_sha,sha);assert.equal(scope.base_sha,other);assert.deepEqual(scope.changed_paths,['.agents/skills/building-cupis-emails/SKILL.md']);assert.deepEqual(scope.tests,['tests/skills/email-build-skill-boundary.test.mjs','tests/skills/execution-skill-boundary.test.mjs']);assert.match(scope.changed_paths_digest,/^[a-f0-9]{64}$/u);assert.deepEqual(scope.commands,[{executable:'node',args:['--test','--test-concurrency=2',...scope.tests]}]);assert.ok(calls.some(args=>args[0]==='diff'&&args.includes(other)&&args.includes(sha)));
});
test('docs root commit uses all tracked paths and unknown source paths use complete guard set',async()=>{
 const {deriveDocsScope}=await import('../../scripts/lib/execution-docs-check.mjs');const readGit=async args=>{if(args[0]==='rev-parse')return sha;if(args[0]==='cat-file')return 'tree '+other+'\n\nroot';if(args[0]==='ls-tree')return 'README.md\0';throw new Error('unexpected git call');};const scope=await deriveDocsScope({repoRoot,sourceSha:sha,readGit});assert.equal(scope.base_sha,null);for(const name of ['tests/skills/execution-context.test.mjs','tests/skills/execution-receipt.test.mjs','tests/skills/verification-runner.test.mjs','tests/foundation/local-only-verification.test.mjs'])assert.ok(scope.tests.includes(name),name);
});
test('missing immutable first parent is a typed docs scope failure',async()=>{
 const {deriveDocsScope}=await import('../../scripts/lib/execution-docs-check.mjs');const readGit=async args=>{if(args[0]==='rev-parse')return sha;if(args[0]==='cat-file'&&args[1]==='-p')return 'tree '+other+'\nparent '+other+'\n\nmessage';throw Object.assign(new Error('missing parent'),{code:128});};await assert.rejects(deriveDocsScope({repoRoot,sourceSha:sha,readGit}),{code:'VERIFICATION_DOCS_BASE_MISSING'});
});
test('root commit message text cannot invent an immutable first parent',async()=>{
 const {deriveDocsScope}=await import('../../scripts/lib/execution-docs-check.mjs');
 const readGit=async args=>{if(args[0]==='rev-parse')return sha;if(args[0]==='cat-file'&&args[1]==='-p')return 'tree '+other+'\nauthor Synthetic\n\nA root commit message\nparent '+other+'\n';if(args[0]==='ls-tree')return 'README.md\0';throw new Error('Root commit must not probe a message-invented parent');};
 const scope=await deriveDocsScope({repoRoot,sourceSha:sha,readGit});assert.equal(scope.base_sha,null);assert.deepEqual(scope.changed_paths,['README.md']);
});

test('visual acceptance preserves inherited model and rejects switched selection or runtime identity',async t=>{const {verifyRealEmailVisual}=await import('../../scripts/verify-real-email-visual.mjs');const f=await visualFixture(t);assert.equal((await verifyRealEmailVisual(f.options)).status,'success');for(const change of [{reviewer_model_binding:{binding:'explicit',id:'other-model'}},{runtime_session_id:'stale-session'},{tool_signature:'stale-tool'}]){const g=await visualFixture(t);Object.assign(g.review,change);await g.save();await assert.rejects(verifyRealEmailVisual(g.options),{code:'VISUAL_REVIEW_INVALID'});}});

test('visual qualification rejects an effort outside the selected model support even with matching receipt',async t=>{
 const {verifyRealEmailVisual}=await import('../../scripts/verify-real-email-visual.mjs');
 for(const effort of ['ultra','made-up']){const f=await visualFixture(t);f.options.reviewQualification.effort=effort;f.review.reviewer_effort=effort;await f.save();await assert.rejects(verifyRealEmailVisual(f.options),{code:'VISUAL_REVIEW_INVALID'});}
 for(const supported_efforts of [undefined,[],['high','low'],['high','high'],['made-up']]){const f=await visualFixture(t);f.options.reviewQualification.supported_efforts=supported_efforts;await assert.rejects(verifyRealEmailVisual(f.options),{code:'VISUAL_REVIEW_INVALID'});}
});
