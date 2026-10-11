import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,writeFile,mkdir,rm,lstat,realpath} from 'node:fs/promises';
import {resolve,join,relative,isAbsolute} from 'node:path';
import {performance} from 'node:perf_hooks';
import {loadExecutionPolicy} from './execution-policy.mjs';
import {workloadSignature,workloadInputDigest,artifactDigest,readExecutionRef,safeExecutionPath} from './execution-context.mjs';
import {bytesDigest,inputFailure,readBoundInventory} from './execution-inputs.mjs';
const exec=promisify(execFile),fail=inputFailure;
const SHA=/^[a-f0-9]{40}$/u,MAX_LOG=1024*1024,DEADLINE=30*60*1000;
const BASE_LIMITS={concurrency:2,timeout_minutes:30,max_heavy_batches:1};
const within=(root,child)=>{const rel=relative(root,child);return !rel||(!rel.startsWith('..')&&!isAbsolute(rel));};
const guardMap=[
 ['.agents/skills/building-cupis-emails/',['tests/skills/email-build-skill-boundary.test.mjs']],
 ['.agents/skills/maintaining-cupis-email-system/',['tests/skills/maintenance-skill-boundary.test.mjs']],
 ['.agents/skills/cupis-email-task-router/',['tests/skills/cupis-email-task-router.test.mjs']],
 ['data/execution/',['tests/skills/execution-policy.test.mjs','tests/skills/model-selection.test.mjs']],
 ['schemas/execution-',['tests/skills/execution-context.test.mjs','tests/skills/execution-receipt.test.mjs']],
 ['scripts/lib/verification-runner.mjs',['tests/skills/verification-runner.test.mjs']],
 ['.github/workflows/',['tests/foundation/local-only-verification.test.mjs']],
];
export function selectDocsTests(changedPaths){
 if(!Array.isArray(changedPaths)||!changedPaths.length||changedPaths.some(p=>!safeExecutionPath(p)))throw fail('VERIFICATION_CHANGED_PATH_INVALID','Changed paths must be nonempty safe source-relative paths.');
 const selected=new Set();for(const path of changedPaths){const hit=guardMap.find(([prefix])=>path.startsWith(prefix));if(!hit)return null;for(const test of hit[1])selected.add(test);}return [...selected].sort();
}
async function readSourceSha(repoRoot){
 const {stdout}=await exec('git',['rev-parse','HEAD'],{cwd:repoRoot,timeout:10000,maxBuffer:65536});
 await exec('git',['diff','--quiet','HEAD','--'],{cwd:repoRoot,timeout:10000,maxBuffer:65536});
 // Untracked source can affect a test import. Dependencies are the only permitted untracked tree.
 const extra=await exec('git',['ls-files','--others','--exclude-standard'],{cwd:repoRoot,timeout:10000,maxBuffer:65536});
 if(extra.stdout.trim())throw fail('VERIFICATION_SOURCE_DIRTY','Exact-source verification excludes untracked source files.');return stdout.trim();
}
async function checkDependencies(repoRoot){
 try{
  const lock=JSON.parse(await readFile(join(repoRoot,'package-lock.json'),'utf8'));
  const installed=JSON.parse(await readFile(join(repoRoot,'node_modules/.package-lock.json'),'utf8'));
  const entries=Object.entries(lock.packages).filter(([name])=>name);
  if(Object.keys(installed.packages).length!==entries.length)throw new Error('extra dependency');
  for(const [name,spec] of entries){const actual=installed.packages[name];if(!actual||['version','resolved','integrity'].some(k=>actual[k]!==spec[k]))throw new Error('lock mismatch');const pkg=JSON.parse(await readFile(join(repoRoot,name,'package.json'),'utf8'));if(pkg.version!==spec.version)throw new Error('version mismatch');}
  return {mode:'direct-equivalent',lock_digest:bytesDigest(await readFile(join(repoRoot,'package-lock.json')))};
 }catch{throw fail('VERIFICATION_DEPENDENCIES_UNVERIFIED','Install exact locked dependencies or provide the same-lock direct Node equivalent; npm ci was not run by this runner.');}
}
async function checkRuntime(workloads){
 if(Number(process.versions.node.split('.')[0])!==24||process.platform!=='win32'||!['x64','arm64'].includes(process.arch))throw fail('VERIFICATION_RUNTIME_UNAVAILABLE','Selected workloads require Windows x64/arm64 and Node 24.');
 if(workloads.some(w=>w.requirements.runtimes.includes('powershell')))await exec('powershell',['-NoProfile','-NonInteractive','-Command','$PSVersionTable.PSVersion.ToString()'],{timeout:10000,maxBuffer:65536});
}
// A timeout holds the heavy lock until the owned process tree is known to have terminated.
export function executeVerificationCommand(command,{repoRoot,timeoutMs,signal,contextFile}={}){
 return new Promise(resolveResult=>{
  let child,stdout='',stderr='',truncated=false,terminal=null,settled=false,timer,killPending=null;
  const append=(value,text)=>{const bytes=Buffer.byteLength(value+text);if(bytes>MAX_LOG){truncated=true;return Buffer.from(value+text).subarray(0,MAX_LOG).toString('utf8');}return value+text;};
  const finish=(status,exitCode,terminationConfirmed=true)=>{if(settled)return;settled=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);resolveResult({status,exitCode,stdout,stderr,truncated,terminationConfirmed});};
  const stop=reason=>{
   if(terminal||settled)return;terminal=reason;
   killPending=(async()=>{
    if(!child?.pid)return true;
    if(process.platform==='win32'){try{await exec('taskkill',['/PID',String(child.pid),'/T','/F'],{timeout:10000,maxBuffer:65536});return true;}catch{return false;}}
    try{process.kill(-child.pid,'SIGKILL');return true;}catch{return false;}
   })();
   killPending.then(ok=>{if(!ok)finish('infrastructure-error',-1,false);});
  };
  const cancel=()=>stop('cancelled');
  if(signal?.aborted){finish('cancelled',-1);return;}
  try{child=spawn(command.executable==='node'?process.execPath:command.executable,command.args,{cwd:repoRoot,shell:false,windowsHide:true,detached:process.platform!=='win32',env:{...process.env,...(contextFile?{CUPIS_VERIFICATION_CONTEXT:contextFile}:{})},stdio:['ignore','pipe','pipe']});}
  catch{finish('infrastructure-error',-1);return;}
  child.stdout.on('data',b=>stdout=append(stdout,b.toString()));child.stderr.on('data',b=>stderr=append(stderr,b.toString()));
  child.once('error',()=>finish('infrastructure-error',-1));
  child.once('close',async code=>{const confirmed=killPending?await killPending:true;finish(confirmed?(terminal??(code===0?'success':'failure')):'infrastructure-error',Number.isInteger(code)?code:-1,confirmed);});
  signal?.addEventListener('abort',cancel,{once:true});timer=setTimeout(()=>stop('timed_out'),Math.max(1,timeoutMs));timer.unref?.();
 });
}
async function prepareInputs({workload,inputRefs,inputRoots,referenceRoot,repoRoot,artifactRefs,artifactHash,requestId,sourceSha,reviewQualification,privateRoot}){
 const selected=Object.fromEntries(workload.required_inputs.map(name=>[name,inputRefs[name]]));
 for(const name of workload.required_inputs){const kind=name==='installed_skills_root'?'installed-skills':name;await readBoundInventory({ref:selected[name],referenceRoot,root:inputRoots[name],kind});}
 for(const ref of artifactRefs)await readExecutionRef({referenceRoot,ref});
 const context=workload.id==='installed-skills'?{inventoryRef:selected.installed_skills_root,referenceRoot,skillsRoot:inputRoots.installed_skills_root,repoRoot}:{inputRefs:selected,referenceRoot,inputRoots:Object.fromEntries(workload.required_inputs.map(name=>[name,inputRoots[name]])),identity:{request_id:requestId,source_sha:sourceSha,artifact_digest:artifactHash},reviewQualification};
 const contextFile=join(privateRoot,workload.id+'.json');await writeFile(contextFile,JSON.stringify(context),{flag:'wx'});return {contextFile,inputDigest:workloadInputDigest(selected)};
}
export async function runVerification(options){
 const allowed=['requestId','sourceSha','workloadIds','target','limits','runner','outputRoot','repoRoot','lockRoot','cloudIdentity','changedPaths','inputRefs','inputRoots','referenceRoot','artifactRefs','artifactHash','reviewQualification','signal'];
 if(!options||Object.keys(options).some(k=>!allowed.includes(k)))throw fail('VERIFICATION_ARGUMENTS_INVALID','Unknown runner option. Commands come only from exact-source policy.');
 const {requestId,sourceSha,workloadIds,target,limits=BASE_LIMITS,repoRoot=process.cwd(),outputRoot,lockRoot,cloudIdentity,changedPaths,inputRefs={},inputRoots={},referenceRoot=repoRoot,artifactRefs=[],artifactHash,reviewQualification,signal}=options;
 if(!/^[-A-Za-z0-9_.]{1,100}$/u.test(requestId??'')||!SHA.test(sourceSha??'')||!['local','github-hosted'].includes(target)||!outputRoot||!Array.isArray(workloadIds)||!workloadIds.length||new Set(workloadIds).size!==workloadIds.length)throw fail('VERIFICATION_ARGUMENTS_INVALID','Exact identity, nonempty unique workload selection, target and evidence root are required.');
 if(Object.keys(limits).length!==3||Object.entries(BASE_LIMITS).some(([key,value])=>limits[key]!==value))throw fail('VERIFICATION_LIMITS_INVALID','Concurrency 2, total timeout 30 minutes and one heavy batch are fixed.');
 const runner={readSourceSha,checkRuntime,checkDependencies,execute:executeVerificationCommand,now:()=>performance.now(),...options.runner};
 if(await runner.readSourceSha(repoRoot)!==sourceSha)throw fail('VERIFICATION_SOURCE_MISMATCH','Checkout must equal requested source SHA before workloads.');
 const policy=await loadExecutionPolicy({repoRoot}),workloads=workloadIds.map(id=>policy.workloads.find(w=>w.id===id));
 if(workloads.some(w=>!w))throw fail('VERIFICATION_WORKLOAD_UNKNOWN','Unknown workload.');
 if(target==='github-hosted'&&workloads.some(w=>w.portability!=='portable'))throw fail('VERIFICATION_LOCAL_ONLY','Actual user inputs and installed skills stay local.');
 if(target==='github-hosted'&&(!cloudIdentity||Object.keys(cloudIdentity).sort().join(',')!=='event_sha,run_attempt,run_id,workflow_sha'||!SHA.test(cloudIdentity.workflow_sha)||!SHA.test(cloudIdentity.event_sha)||!/^\d+$/u.test(cloudIdentity.run_id)||!/^\d+$/u.test(cloudIdentity.run_attempt)))throw fail('VERIFICATION_CLOUD_IDENTITY_INVALID','Cloud workflow, event and actual run identities are distinct required fields.');
 if(target==='github-hosted'&&(Object.keys(inputRefs).length||Object.keys(inputRoots).length||artifactRefs.length||reviewQualification))throw fail('VERIFICATION_LOCAL_ONLY','No private input metadata is accepted by cloud execution.');
 for(const workload of workloads)if(workload.required_inputs.length&&(workload.required_inputs.some(name=>!inputRefs[name]||!inputRoots[name])||!artifactRefs.length||artifactDigest(artifactRefs)!==artifactHash))throw fail('VERIFICATION_INPUT_MISSING','Consuming workloads require bound file inventories, authorized local roots and artifact identity.');
 const sourceRoot=await realpath(repoRoot),output=resolve(outputRoot);
 if(within(sourceRoot,output))throw fail('VERIFICATION_OUTPUT_ROOT_INVALID','Evidence must be outside exact source.');
 let lock,keepLock=false,privateRoot;
 if(target==='local'&&workloads.some(w=>w.heavy)){
  if(!lockRoot||within(sourceRoot,resolve(lockRoot))||within(output,resolve(lockRoot)))throw fail('VERIFICATION_LOCK_ROOT_INVALID','Use persistent Task3 runner_lock_root outside source and evidence directories.');
  await mkdir(lockRoot,{recursive:true});const actual=await realpath(lockRoot);if(within(sourceRoot,actual)||within(output,actual))throw fail('VERIFICATION_LOCK_ROOT_INVALID','Persistent lock root cannot resolve into source/evidence.');
  lock=join(actual,'heavy-batch.lock');try{await mkdir(lock);}catch(error){if(error.code==='EEXIST')throw fail('VERIFICATION_HEAVY_BATCH_ACTIVE','A heavy batch owns the persistent lock; no automatic stale-lock stealing.');throw error;}
 }
 try{
  // Never overwrite an earlier run's evidence. Runtime/dependency failures are execution failures.
  await mkdir(output,{recursive:false});
  const results=[],evidence=[],deadline=runner.now()+DEADLINE;let dependencyMode=null,preflightError=null,stopStatus=null;
  try{await runner.checkRuntime(workloads);dependencyMode=await runner.checkDependencies(repoRoot);}catch(error){preflightError=error.code??'VERIFICATION_RUNTIME_UNAVAILABLE';stopStatus='infrastructure-error';}
  if(workloads.some(w=>w.required_inputs.length)){privateRoot=join(output,'.private');await mkdir(privateRoot);}
  for(const workload of workloads){
   const result={id:workload.id,signature:workloadSignature(workload),status:stopStatus??'success',exit_code:stopStatus?-1:0};const records=[];let contextFile;
   if(!stopStatus){
    try{
     if(workload.required_inputs.length){const bound=await prepareInputs({workload,inputRefs,inputRoots,referenceRoot,repoRoot,artifactRefs,artifactHash,requestId,sourceSha,reviewQualification,privateRoot});contextFile=bound.contextFile;result.input_digest=bound.inputDigest;}
     let commands=structuredClone(workload.commands);
     if(workload.id==='docs-scoped'&&changedPaths){const selected=selectDocsTests(changedPaths);if(selected)commands=[{executable:'node',args:['--test','--test-concurrency=2',...selected]}];}
     for(const command of commands){
      if(signal?.aborted||runner.now()>=deadline){result.status=signal?.aborted?'cancelled':'timed_out';result.exit_code=-1;break;}
      // Only placeholders named in fixed source policy can be substituted, with verified files.
      const concrete={executable:command.executable,args:command.args.map(arg=>/^\{[a-z_]+\}$/u.test(arg)?resolve(referenceRoot,inputRefs[arg.slice(1,-1)].path):arg)};
      const execution=await runner.execute(concrete,{repoRoot,timeoutMs:Math.max(1,deadline-runner.now()),signal,contextFile});
      if(execution.terminationConfirmed===false)keepLock=true;
      const status=['success','failure','cancelled','timed_out','infrastructure-error','skipped'].includes(execution.status)?execution.status:'infrastructure-error';
      result.exit_code=Number.isInteger(execution.exitCode)?execution.exitCode:-1;result.status=status==='success'&&result.exit_code!==0?'failure':status;
      records.push({command:workload.required_inputs.length?command:concrete,status:result.status,exit_code:result.exit_code,stdout:String(execution.stdout??'').slice(0,MAX_LOG),stderr:String(execution.stderr??'').slice(0,MAX_LOG),truncated:execution.truncated===true,termination_confirmed:execution.terminationConfirmed!==false});
      if(result.status!=='success')break;
     }
     // Fresh validation after a consuming process catches changes made during that process.
     if(result.status==='success'&&workload.required_inputs.length)for(const name of workload.required_inputs)await readBoundInventory({ref:inputRefs[name],referenceRoot,root:inputRoots[name],kind:name==='installed_skills_root'?'installed-skills':name});
    }catch(error){result.status='infrastructure-error';result.exit_code=-1;records.push({code:error.code??'VERIFICATION_EXECUTION_ERROR'});}
   }
   if(result.status!=='success')stopStatus=result.status==='skipped'?'failure':result.status;
   const body=JSON.stringify({request_id:requestId,source_sha:sourceSha,workload_id:workload.id,signature:result.signature,dependency_mode:dependencyMode,preflight_error:preflightError,records},null,2)+'\n';
   const file=workload.id+'.json';await writeFile(join(output,file),body,{flag:'wx'});evidence.push({path:file,digest:bytesDigest(body)});results.push(result);
  }
  const receipt={schema_version:'1.0.0',request_id:requestId,source_sha:sourceSha,workflow_sha:target==='github-hosted'?cloudIdentity.workflow_sha:null,...(target==='github-hosted'?{event_sha:cloudIdentity.event_sha,run_id:cloudIdentity.run_id,run_attempt:cloudIdentity.run_attempt}:{}),target,workload_results:results,conclusion:stopStatus??'success',evidence_refs:evidence,...(workloads.some(w=>w.required_inputs.length)?{artifact_digest:artifactHash}:{})};
  await writeFile(join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});return receipt;
 }finally{
  if(privateRoot)await rm(privateRoot,{recursive:true,force:true});
  if(lock&&!keepLock)await rm(lock,{recursive:true});
 }
}
