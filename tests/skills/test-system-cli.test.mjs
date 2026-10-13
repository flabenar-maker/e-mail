import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,copyFile,readFile,writeFile,rm,symlink} from 'node:fs/promises';
import {execFileSync,spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,relative,isAbsolute} from 'node:path';
import {pathToFileURL} from 'node:url';
import {loadExecutionPolicy} from '../../scripts/lib/execution-policy.mjs';
import {workloadSignature} from '../../scripts/lib/execution-context.mjs';

const root=resolve(import.meta.dirname,'../..');
const FULL=['tests/foundation/*.test.mjs','tests/characterization/*.test.mjs','tests/components/*.test.mjs','tests/generation/*.test.mjs','tests/rendering/*.test.mjs','tests/workflows/*.test.mjs','tests/skills/*.test.mjs'];
const VISUAL=['tests/rendering/visual-scenarios.test.mjs','tests/rendering/pilot-fidelity-regressions.test.mjs','tests/rendering/qr-artwork-geometry.test.mjs'];
const DOCS=['tests/skills/email-build-skill-boundary.test.mjs','tests/skills/execution-skill-boundary.test.mjs'];
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
// Independently construct the frozen handoff; expected child argv below are literals.
function decision(policy,sha,ids,choice=2,target='local'){
 const selected_model={binding:'inherited',id:null},selection={selected_model,effort:'high'};
 const verification=ids.map(id=>{
  const w=structuredClone(policy.workloads.find(x=>x.id===id));
  if(choice===4&&target==='local'){
   w.limits.concurrency=4;
   if(id==='docs-scoped')w.commands[0].args.push('--test-concurrency','4');
   else for(const command of w.commands)command.args=command.args.map(arg=>arg==='--test-concurrency=2'?'--test-concurrency=4':arg);
  }
  return {id,portability:w.portability,target,signature:workloadSignature(w),limits:w.limits,input_names:[],input_digest:null};
 });
 return {schema_version:'1.0.0',status:'resolved',domain_status:'resolved',request_id:'task3-public',source_sha:sha,policy_digest:policy.policy_digest,route:'maintenance',mode:'write',operation:'write',allowed_paths:[],executor_agent_id:'fixture-executor',domain_context_ref:{path:'domain.json',digest:'d'.repeat(64)},requirement_refs:[{path:'requirement.txt',digest:'e'.repeat(64)}],artifact_refs:[],input_refs:{},base_effort:'medium',target_effort:'high',runtime_identity:{runtime_session_id:'fixture-session',tool_signature:'fixture-tools'},executor:selection,review:{required:true,mode:'independent-agent',distinct_agent_required:true,primary_sources_required:true,all_requirements_required:true,reviewer:selection},verification,safety_ceiling_reached:false,blockers:[]};
}
async function fixture(t,{legacy=false,validateExit=0}={}){
 const temporary=await mkdtemp(join(tmpdir(),'cupis-task3-public-')),repo=join(temporary,'source');await mkdir(repo);
 t.after(async()=>{const rel=relative(resolve(tmpdir()),resolve(temporary));assert.ok(rel&&!rel.startsWith('..')&&!isAbsolute(rel));await rm(temporary,{recursive:true,force:true});});
 for(const directory of ['scripts/lib','schemas'])await cp(join(root,directory),join(repo,directory),{recursive:true});
 for(const file of ['scripts/run-verification.mjs','system/manifest.yaml','data/execution/policy.yaml','package-lock.json']){await mkdir(dirname(join(repo,file)),{recursive:true});await copyFile(join(root,file),join(repo,file));}
 try{await copyFile(join(root,'scripts/test-system.mjs'),join(repo,'scripts/test-system.mjs'));}catch(error){if(error.code!=='ENOENT')throw error;}
 const probeFile=join(temporary,'argv.jsonl'),preload=join(temporary,'probe.mjs');
 // Observe the real process boundary, then delegate unchanged to native spawn.
 await writeFile(preload,"import cp from 'node:child_process';import {syncBuiltinESMExports} from 'node:module';import {appendFileSync} from 'node:fs';const original=cp.spawn;cp.spawn=function(executable,args,options){appendFileSync(process.env.CUPIS_TASK3_PROBE,JSON.stringify({kind:'spawn',executable,args,options:{shell:options.shell,windowsHide:options.windowsHide}})+'\\n');return original.call(this,executable,args,options);};syncBuiltinESMExports();appendFileSync(process.env.CUPIS_TASK3_PROBE,JSON.stringify({kind:'entry',argv:process.argv.slice(1),execArgv:process.execArgv})+'\\n');");
 const probe="import {appendFileSync} from 'node:fs';appendFileSync(process.env.CUPIS_TASK3_PROBE,JSON.stringify({kind:'ran',file:import.meta.url,argv:process.argv.slice(1),execArgv:process.execArgv})+'\\n');\n";
 for(const group of ['foundation','characterization','components','generation','rendering','workflows','skills']){await mkdir(join(repo,'tests',group),{recursive:true});await writeFile(join(repo,'tests',group,'bounded.test.mjs'),probe);}
 for(const file of [...VISUAL,...DOCS])await writeFile(join(repo,file),probe);
 await writeFile(join(repo,'scripts/validate-system.mjs'),probe+`process.exitCode=${validateExit};\n`);
 await writeFile(join(repo,'scripts/generate-docs.mjs'),probe);
 const pkg=JSON.parse(await readFile(join(root,'package.json'),'utf8'));await writeFile(join(repo,'package.json'),JSON.stringify(pkg));
 if(legacy){const policy=JSON.parse(await readFile(join(repo,'data/execution/policy.yaml'),'utf8'));delete policy.local_test_concurrency;await writeFile(join(repo,'data/execution/policy.yaml'),JSON.stringify(policy));}
 await symlink(await (await import('node:fs/promises')).realpath(join(root,'node_modules')),join(repo,'node_modules'),'junction');
 const git=(...args)=>execFileSync('git',args,{cwd:repo,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 git('init','--quiet');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');git('config','core.autocrlf','false');
 await writeFile(join(repo,'.gitignore'),'node_modules/\n');git('add','.');git('commit','--quiet','-m','fixture exact source');
 await mkdir(join(repo,'.agents/skills/building-cupis-emails'),{recursive:true});await writeFile(join(repo,'.agents/skills/building-cupis-emails/SKILL.md'),'fixture docs change\n');git('add','.');git('commit','--quiet','-m','one docs change');
 const sha=git('rev-parse','HEAD'),policy=await loadExecutionPolicy({repoRoot:repo}),profileFile=join(temporary,'profile.json');
 await writeFile(profileFile,JSON.stringify({runner_lock_root:join(temporary,'persistent','runner-locks'),test_concurrency:2}));
 const env={...process.env,NODE_OPTIONS:`--import=${pathToFileURL(preload).href}`,CUPIS_TASK3_PROBE:probeFile};
 const readProbe=async()=>{try{return (await readFile(probeFile,'utf8')).trim().split('\n').filter(Boolean).map(line=>JSON.parse(line));}catch(error){if(error.code==='ENOENT')return [];throw error;}};
 const save=async value=>{const file=join(temporary,'decision.json');await writeFile(file,JSON.stringify(value));return file;};
 return {temporary,repo,sha,policy,git,profileFile,env,readProbe,save};
}
async function cli(f,file,args=[]){
 return await new Promise((resolveResult,reject)=>{let stdout='',stderr='';const child=spawn(process.execPath,[file,...args],{cwd:f.repo,env:f.env,shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});const timer=setTimeout(()=>{child.kill();reject(new Error('Bounded CLI fixture exceeded 15s'));},15000);child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);child.once('error',reject);child.once('close',exitCode=>{clearTimeout(timer);resolveResult({exitCode,stdout,stderr});});});
}
const testSpawns=records=>records.filter(record=>record.kind==='spawn'&&record.args.includes('--test'));
function exactNodeCommand(command,args){assert.equal(command.executable,process.execPath);assert.deepEqual(command.args,args);assert.deepEqual(command.options,{shell:false,windowsHide:true});assert.equal(command.args.filter(arg=>arg.startsWith('--test-concurrency')).length,1);}
const runnerArgs=(f,id,extra=[])=>['--request-id','task3-public','--source-sha',f.sha,'--workloads',id,'--target','local','--output',join(f.temporary,'evidence'),'--profile',f.profileFile,...extra];

for(const choice of [2,4])for(const [id,files] of [['repository-full',FULL],['docs-scoped',DOCS],['visual-fixtures',VISUAL]])test(`public runner ${id} receives exact${choice} argv and executes bounded real children`,async t=>{
 const f=await fixture(t),file=await f.save(decision(f.policy,f.sha,[id],choice));
 const result=await cli(f,'scripts/run-verification.mjs',runnerArgs(f,id,['--decision',file]));assert.equal(result.exitCode,0,result.stderr+result.stdout);
 const receipt=JSON.parse(result.stdout.trim());assert.equal(receipt.conclusion,'success');assert.equal(receipt.workload_results[0].signature,JSON.parse(await readFile(file,'utf8')).verification[0].signature);
 const records=await f.readProbe(),commands=testSpawns(records);assert.equal(commands.length,1);exactNodeCommand(commands[0],['--test',`--test-concurrency=${choice}`,...files]);assert.ok(records.some(record=>record.kind==='ran'));
 const evidence=JSON.parse(await readFile(join(f.temporary,'evidence',id+'.json'),'utf8'));assert.equal(evidence.signature,receipt.workload_results[0].signature);assert.deepEqual(evidence.limits,{concurrency:choice,timeout_minutes:30,max_heavy_batches:1});
 if(id==='docs-scoped'){const scope=JSON.parse(evidence.records[0].stdout.trim().split('\n')[0]).docs_scope;assert.deepEqual(scope.commands,[{executable:'node',args:['--test',`--test-concurrency=${choice}`,...DOCS]}]);assert.equal(scope.base_sha,f.git('rev-parse','HEAD^'));}
});

for(const [saved,explicit] of [[4,2],[2,4]])test(`public runner decision${saved}/flag${explicit} rejects before child spawn`,async t=>{
 const f=await fixture(t),file=await f.save(decision(f.policy,f.sha,['repository-full'],saved));const result=await cli(f,'scripts/run-verification.mjs',runnerArgs(f,'repository-full',['--decision',file,'--test-concurrency',String(explicit)]));assert.notEqual(result.exitCode,0);assert.match(result.stderr,/VERIFICATION_DECISION_MISMATCH/u);assert.equal((await f.readProbe()).filter(x=>x.kind==='spawn').length,0);
});
test('public runner legacy source refuses handcrafted matching4 decision before children',async t=>{
 const f=await fixture(t,{legacy:true}),file=await f.save(decision(f.policy,f.sha,['repository-full'],4));const result=await cli(f,'scripts/run-verification.mjs',runnerArgs(f,'repository-full',['--decision',file]));assert.notEqual(result.exitCode,0);assert.match(result.stderr,/VERIFICATION_CONCURRENCY_UNSUPPORTED/u);assert.equal((await f.readProbe()).filter(x=>x.kind==='spawn').length,0);
});
test('public runner from-event carrier retains its original canonical2 command',async t=>{
 const f=await fixture(t),event=join(f.temporary,'event.json');await writeFile(event,JSON.stringify({inputs:{request_id:'task3-public',source_sha:f.sha,workloads:'docs-scoped'}}));
 Object.assign(f.env,{GITHUB_ACTIONS:'true',GITHUB_EVENT_PATH:event,GITHUB_EVENT_NAME:'workflow_dispatch',RUNNER_TEMP:f.temporary,GITHUB_WORKFLOW_SHA:'a'.repeat(40),GITHUB_SHA:f.sha,GITHUB_RUN_ID:'17',GITHUB_RUN_ATTEMPT:'1'});
 const result=await cli(f,'scripts/run-verification.mjs',['--from-event']);assert.equal(result.exitCode,0,result.stderr+result.stdout);const commands=testSpawns(await f.readProbe());assert.equal(commands.length,1);exactNodeCommand(commands[0],['--test','--test-concurrency=2',...DOCS]);
});
test('public runner refuses from-event concurrency or decision overrides before children',async t=>{
 const f=await fixture(t),file=await f.save(decision(f.policy,f.sha,['docs-scoped'],4));const result=await cli(f,'scripts/run-verification.mjs',['--from-event','--decision',file,'--test-concurrency','4']);assert.notEqual(result.exitCode,0);assert.equal((await f.readProbe()).filter(x=>x.kind==='spawn').length,0);
});

for(const choice of [2,4])test(`npm test wrapper receives exact${choice} full list through real child`,async t=>{
 const f=await fixture(t),file=await f.save(decision(f.policy,f.sha,['repository-full'],choice));const result=await cli(f,'scripts/test-system.mjs',['--decision',file]);assert.equal(result.exitCode,0,result.stderr+result.stdout);const commands=testSpawns(await f.readProbe());assert.equal(commands.length,1);exactNodeCommand(commands[0],['--test',`--test-concurrency=${choice}`,...FULL]);
});
test('legacy bare npm wrapper executes the fixed full list at2',async t=>{
 const f=await fixture(t),result=await cli(f,'scripts/test-system.mjs');assert.equal(result.exitCode,0,result.stderr+result.stdout);const commands=testSpawns(await f.readProbe());assert.equal(commands.length,1);exactNodeCommand(commands[0],['--test','--test-concurrency=2',...FULL]);
});
test('npm wrapper refuses explicit4 without a frozen decision before child spawn',async t=>{const f=await fixture(t),result=await cli(f,'scripts/test-system.mjs',['--test-concurrency','4']);assert.notEqual(result.exitCode,0);assert.match(result.stderr,/VERIFICATION_DECISION_MISMATCH/u);assert.equal((await f.readProbe()).filter(x=>x.kind==='spawn').length,0);});
for(const [ids,target] of [[['docs-scoped'],'local'],[['visual-fixtures'],'local'],[['repository-full'],'github-hosted']])test(`npm full wrapper rejects ${ids[0]} ${target} decision before spawn`,async t=>{
 const f=await fixture(t),file=await f.save(decision(f.policy,f.sha,ids,target==='local'?4:2,target));const result=await cli(f,'scripts/test-system.mjs',['--decision',file]);assert.notEqual(result.exitCode,0);assert.match(result.stderr,/VERIFICATION_DECISION_MISMATCH/u);assert.equal((await f.readProbe()).filter(x=>x.kind==='spawn').length,0);
});
test('npm wrapper legacy source independently refuses matching4 decision',async t=>{
 const f=await fixture(t,{legacy:true}),file=await f.save(decision(f.policy,f.sha,['repository-full'],4));const result=await cli(f,'scripts/test-system.mjs',['--decision',file]);assert.notEqual(result.exitCode,0);assert.match(result.stderr,/VERIFICATION_CONCURRENCY_UNSUPPORTED/u);assert.equal((await f.readProbe()).filter(x=>x.kind==='spawn').length,0);
});
for(const args of [['--test-concurrency','3'],['--test-concurrency','2','--test-concurrency','2'],['--test-concurrency=4'],['--decision'],['tests/skills/bounded.test.mjs'],['--exec','evil'],['--validate-first','--validate-first']])test('npm wrapper rejects bounded argv '+JSON.stringify(args),async t=>{
 const f=await fixture(t),result=await cli(f,'scripts/test-system.mjs',args);assert.notEqual(result.exitCode,0);assert.match(result.stderr,/VERIFICATION_CLI_ARGUMENTS/u);assert.equal((await f.readProbe()).filter(x=>x.kind==='spawn').length,0);
});
for(const [saved,explicit] of [[4,2],[2,4]])test(`npm wrapper decision${saved}/flag${explicit} rejects before spawn`,async t=>{
 const f=await fixture(t),file=await f.save(decision(f.policy,f.sha,['repository-full'],saved));const result=await cli(f,'scripts/test-system.mjs',['--decision',file,'--test-concurrency',String(explicit)]);assert.notEqual(result.exitCode,0);assert.match(result.stderr,/VERIFICATION_DECISION_MISMATCH/u);assert.equal((await f.readProbe()).filter(x=>x.kind==='spawn').length,0);
});
for(const changed of ['signature','source_sha','policy_digest','missing'])test('public decision '+changed+' cannot start full test children',async t=>{
 const f=await fixture(t),value=decision(f.policy,f.sha,['repository-full'],4);if(changed==='signature')value.verification[0].signature='0'.repeat(64);else if(changed==='missing')delete value.verification;else value[changed]='0'.repeat(changed==='source_sha'?40:64);const file=await f.save(value);
 const result=await cli(f,'scripts/test-system.mjs',['--decision',file]);assert.notEqual(result.exitCode,0);assert.match(result.stderr,/VERIFICATION_DECISION_MISMATCH/u);assert.equal((await f.readProbe()).filter(x=>x.kind==='spawn').length,0);
});
test('npm verify wrapper validates first and stops with the actual failing exit',async t=>{
 const f=await fixture(t,{validateExit:7}),result=await cli(f,'scripts/test-system.mjs',['--validate-first']);assert.equal(result.exitCode,7,result.stderr+result.stdout);const commands=(await f.readProbe()).filter(record=>record.kind==='spawn');assert.equal(commands.length,1);assert.deepEqual(commands[0].args,['scripts/validate-system.mjs']);assert.equal(testSpawns(commands).length,0);
});
test('npm verify wrapper preserves validate then fixed test command order',async t=>{
 const f=await fixture(t),result=await cli(f,'scripts/test-system.mjs',['--validate-first']);assert.equal(result.exitCode,0,result.stderr+result.stdout);const commands=(await f.readProbe()).filter(record=>record.kind==='spawn');assert.deepEqual(commands.map(record=>record.args),[['scripts/validate-system.mjs'],['--test','--test-concurrency=2',...FULL]]);
});
test('npm aliases route through the fixed wrapper',async()=>{const pkg=JSON.parse(await readFile(join(root,'package.json'),'utf8'));assert.equal(pkg.scripts.test,'node scripts/test-system.mjs');assert.equal(pkg.scripts.verify,'node scripts/test-system.mjs --validate-first');});

for(const args of [['--test-concurrency','3'],['--test-concurrency','2','--test-concurrency','4'],['tests/skills/bounded.test.mjs'],['--test-concurrency=4']])test('docs public wrapper rejects unbounded argv '+JSON.stringify(args),async t=>{const f=await fixture(t),result=await cli(f,'scripts/lib/execution-docs-check.mjs',args);assert.notEqual(result.exitCode,0);assert.equal(testSpawns(await f.readProbe()).length,0);});
test('exported system wrapper rejects unknown options and command injection',async()=>{const api=await import('../../scripts/test-system.mjs').catch(()=>({}));assert.equal(typeof api.runSystemTests,'function');await assert.rejects(api.runSystemTests({repoRoot:root,args:['--exec','evil']}),{code:'VERIFICATION_CLI_ARGUMENTS'});});
