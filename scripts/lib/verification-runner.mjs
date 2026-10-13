import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,writeFile,mkdir,rm,rename,realpath,lstat,readdir,unlink,rmdir} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createHash,randomUUID} from 'node:crypto';
import {resolve,join,relative,isAbsolute,dirname,basename} from 'node:path';
import {performance} from 'node:perf_hooks';
import {loadExecutionPolicy} from './execution-policy.mjs';
import {workloadSignature,workloadInputDigest,artifactDigest,readExecutionRef,safeExecutionPath,isResolvedExecutionDecision} from './execution-context.mjs';
import {deriveVerificationWorkload} from './verification-concurrency.mjs';
import {bytesDigest,inputFailure,readBoundInventory,INPUT_MAX_BYTES} from './execution-inputs.mjs';
export {selectDocsTests} from './execution-docs-check.mjs';
const exec=promisify(execFile),fail=inputFailure;
const SHA=/^[a-f0-9]{40}$/u,MAX_LOG=1024*1024,DEADLINE=30*60*1000;
const BASE_LIMITS={concurrency:2,timeout_minutes:30,max_heavy_batches:1};
const MAPPED_IDS=['docs-scoped','repository-full','visual-fixtures'];
// Both entrypoints load their own validated exact-source policy before this pure handoff.
export function resolveVerificationSelection({policy,requestId,sourceSha,workloadIds,target,testConcurrency,executionDecision,limits,inputRefs={}}){
 if(testConcurrency!==undefined&&(!Number.isInteger(testConcurrency)||![2,4].includes(testConcurrency)))throw fail('VERIFICATION_CONCURRENCY_INVALID','Test concurrency must be the integer 2 or 4.');
 if(target==='github-hosted'&&testConcurrency===4)throw fail('VERIFICATION_CONCURRENCY_UNSUPPORTED','Cloud verification remains on concurrency 2.');
 const sources=workloadIds.map(id=>policy.workloads.find(w=>w.id===id));if(sources.some(w=>!w))throw fail('VERIFICATION_WORKLOAD_UNKNOWN','Unknown workload.');
 let choice=2;
 if(executionDecision!==undefined){
  const d=executionDecision;
  if(!isResolvedExecutionDecision(d)||d.request_id!==requestId||d.source_sha!==sourceSha||d.policy_digest!==policy.policy_digest||JSON.stringify(d.verification.map(row=>row.id))!==JSON.stringify(workloadIds)||d.verification.some(row=>row.target!==target))throw fail('VERIFICATION_DECISION_MISMATCH','Frozen decision identity, source policy and workload selection must match.');
  const choices=new Set(d.verification.filter(row=>target==='local'&&MAPPED_IDS.includes(row.id)).map(row=>row.limits.concurrency));
  if(choices.size>1)throw fail('VERIFICATION_DECISION_MISMATCH','Frozen mapped workloads must share one test concurrency choice.');
  choice=choices.size?[...choices][0]:2;
  if(testConcurrency!==undefined&&testConcurrency!==choice)throw fail('VERIFICATION_DECISION_MISMATCH','Explicit test concurrency differs from the frozen decision.');
 }else if(testConcurrency===4)throw fail('VERIFICATION_DECISION_MISMATCH','Local4 requires a matching frozen execution decision.');
 const workloads=sources.map(workload=>deriveVerificationWorkload({policy,workload,target,testConcurrency:choice}));
 if(executionDecision!==undefined)for(let index=0;index<workloads.length;index++){
  const w=workloads[index],row=executionDecision.verification[index],names=[...w.required_inputs].sort(),digest=names.length?workloadInputDigest(Object.fromEntries(names.map(name=>[name,inputRefs[name]]))):null;
  if(row.portability!==w.portability||row.signature!==workloadSignature(w)||Object.keys(row.limits).length!==3||Object.entries(w.limits).some(([key,value])=>row.limits[key]!==value)||JSON.stringify(row.input_names??[])!==JSON.stringify(names)||(row.input_digest??null)!==digest)throw fail('VERIFICATION_DECISION_MISMATCH','Frozen workload signatures, input identities and effective budgets must match the source-derived commands.');
 }
 const budget={...BASE_LIMITS,concurrency:choice};if(limits!==undefined&&(!limits||Object.keys(limits).length!==3||Object.entries(budget).some(([key,value])=>limits[key]!==value)))throw fail('VERIFICATION_LIMITS_INVALID','The selected concurrency, total timeout30 and one heavy batch are fixed.');
 return {workloads,testConcurrency:choice,limits:budget};
}
const within=(root,child)=>{const rel=relative(root,child);return !rel||(!rel.startsWith('..')&&!isAbsolute(rel));};
function batchBudget({signal,now,started}){
 const controller=new AbortController(),deadline=started+DEADLINE;
 const timeout=()=>controller.abort(fail('VERIFICATION_TIMED_OUT','The total verification deadline expired.'));
 const cancel=()=>controller.abort(fail('VERIFICATION_CANCELLED','Verification was cancelled.'));
 const timer=setTimeout(timeout,Math.max(1,deadline-now()));timer.unref?.();
 signal?.addEventListener('abort',cancel,{once:true});if(signal?.aborted)cancel();
 const check=()=>{if(now()>=deadline&&!controller.signal.aborted)timeout();controller.signal.throwIfAborted();};
 const run=async task=>{
  check();let onAbort;
  try{
   const aborted=new Promise((_,reject)=>{onAbort=()=>reject(controller.signal.reason);controller.signal.addEventListener('abort',onAbort,{once:true});});
   const value=await Promise.race([Promise.resolve().then(task),aborted]);check();return value;
  }finally{controller.signal.removeEventListener('abort',onAbort);}
 };
 return {signal:controller.signal,check,run,remaining:()=>Math.max(1,deadline-now()),dispose:()=>{clearTimeout(timer);signal?.removeEventListener('abort',cancel);}};
}
const terminalStatus=error=>error?.code==='VERIFICATION_TIMED_OUT'?'timed_out':error?.code==='VERIFICATION_CANCELLED'?'cancelled':'infrastructure-error';
async function ownHeavyLock(lock){
 const identity=await lstat(lock),token=randomUUID(),marker=join(lock,'owner-'+token+'.json'),body=JSON.stringify({token}),controller=new AbortController();
 await writeFile(marker,body,{flag:'wx'});
 const lose=()=>{if(!controller.signal.aborted)controller.abort(fail('VERIFICATION_HEAVY_LOCK_LOST','The batch lost ownership of its persistent heavy lock.'));};
 const owns=async()=>{
  try{const current=await lstat(lock),owner=await lstat(marker);if(!current.isDirectory()||current.isSymbolicLink()||current.ino!==identity.ino||current.birthtimeMs!==identity.birthtimeMs||!owner.isFile()||owner.isSymbolicLink()||owner.size!==Buffer.byteLength(body)||await readFile(marker,'utf8')!==body)throw new Error();return true;}catch{lose();return false;}
 };
 let pending=null;const poll=()=>{if(!pending)pending=owns().finally(()=>{pending=null;});};
 const timer=setInterval(poll,100);timer.unref?.();
 return {signal:controller.signal,check:async()=>{if(!await owns())throw controller.signal.reason;controller.signal.throwIfAborted();},dispose:async()=>{clearInterval(timer);if(pending)await pending;},release:async()=>{if(!await owns())return;await unlink(marker).catch(error=>{if(error.code!=='ENOENT')throw error;});try{await rmdir(lock);}catch(error){if(!['ENOENT','ENOTEMPTY','EEXIST'].includes(error.code))throw error;}}};
}
// Git status applies clean filters and cannot establish raw source identity.
const SOURCE_LIST_LIMIT=16*1024*1024,DEPENDENCY_JSON_LIMIT=2*1024*1024,ENTRY_LIMIT=100000;
async function boundedJson(file,signal){
 signal?.throwIfAborted();const st=await lstat(file);if(!st.isFile()||st.isSymbolicLink()||st.size>DEPENDENCY_JSON_LIMIT)throw new Error('invalid metadata');
 return JSON.parse(await readFile(file,{encoding:'utf8',signal}));
}
async function checkDependencies(repoRoot,{signal}={}){
 try{
  const source=await realpath(repoRoot),dependencyRoot=await realpath(join(repoRoot,'node_modules'));
  // A top-level approved junction is permitted; it cannot alias source or an ancestor of it.
  if(dependencyRoot!==join(source,'node_modules')&&(within(source,dependencyRoot)||within(dependencyRoot,source)))throw new Error('source alias');
  const lock=await boundedJson(join(source,'package-lock.json'),signal),installed=await boundedJson(join(dependencyRoot,'.package-lock.json'),signal);
  const entries=Object.entries(lock.packages).filter(([name])=>name);
  if(entries.length>10000||Object.keys(installed.packages).length!==entries.length)throw new Error('extra dependency');
  const packageRoots=[],bins=new Set();
  for(const [name,spec] of entries){
   signal?.throwIfAborted();if(!safeExecutionPath(name)||!name.startsWith('node_modules/'))throw new Error('invalid package path');
   const actual=installed.packages[name];if(!actual||['version','resolved','integrity'].some(k=>actual[k]!==spec[k]))throw new Error('lock mismatch');
   const relativeName=name.slice('node_modules/'.length),pkgPath=join(dependencyRoot,relativeName,'package.json');
   const pkg=await boundedJson(pkgPath,signal);if(pkg.version!==spec.version)throw new Error('version mismatch');
   packageRoots.push(relativeName);const bin=pkg.bin;if(typeof bin==='string')bins.add((pkg.name??relativeName).split('/').at(-1));else if(bin&&typeof bin==='object')for(const key of Object.keys(bin))bins.add(key);
  }
  // Admit only locked package trees, their scope parents, metadata and npm bin shims.
  let count=0;const walk=async(relativePath='')=>{
   signal?.throwIfAborted();for(const entry of await readdir(join(dependencyRoot,relativePath),{withFileTypes:true})){
    if(++count>ENTRY_LIMIT)throw new Error('dependency inventory too large');signal?.throwIfAborted();
    const p=relativePath?relativePath+'/'+entry.name:entry.name,absolute=join(dependencyRoot,p);
    const packagePath=packageRoots.some(name=>p===name||p.startsWith(name+'/')),parent=packageRoots.some(name=>name.startsWith(p+'/'));
    const binPath=p.startsWith('.bin/')&&bins.has(p.slice(5).replace(/\.(?:cmd|ps1)$/u,''));
    if(!(packagePath||parent||p==='.package-lock.json'||p==='.bin'||binPath))throw new Error('unregistered dependency path');
    const st=await lstat(absolute);
    if(st.isSymbolicLink()){
     if(!binPath||!within(dependencyRoot,await realpath(absolute)))throw new Error('dependency alias');
    }else if(st.isDirectory())await walk(p);else if(!st.isFile())throw new Error('unsupported dependency type');
   }
  };await walk();
  return {mode:'direct-equivalent',lock_digest:bytesDigest(await readFile(join(source,'package-lock.json'),{signal}))};
 }catch(error){signal?.throwIfAborted();throw fail('VERIFICATION_DEPENDENCIES_UNVERIFIED','Install exact locked dependencies or provide the same-lock direct Node equivalent; npm ci was not run by this runner.');}
}
async function readSourceSha(repoRoot,{signal}={}){
 const git=async args=>(await exec('git',args,{cwd:repoRoot,timeout:10000,maxBuffer:SOURCE_LIST_LIMIT,signal})).stdout;
 try{
  signal?.throwIfAborted();const sha=(await git(['rev-parse','HEAD'])).trim(),root=await realpath(repoRoot);
  if(!SHA.test(sha))throw new Error('invalid HEAD');
  const records=(await git(['ls-tree','-r','-z',sha])).split('\0').filter(Boolean);if(records.length>ENTRY_LIMIT)throw new Error('source inventory too large');
  const directories=new Set([root]);
  for(const record of records){
   signal?.throwIfAborted();const match=/^(100644|100755) blob ([a-f0-9]{40})\t(.+)$/su.exec(record);
   if(!match||!safeExecutionPath(match[3]))throw new Error('unsupported tracked type/path');
   let current=root;const parts=match[3].split('/');
   for(const segment of parts.slice(0,-1)){current=join(current,segment);if(!directories.has(current)){const st=await lstat(current);if(!st.isDirectory()||st.isSymbolicLink())throw new Error('tracked parent alias');directories.add(current);}}
   const file=join(root,...parts),before=await lstat(file);if(!before.isFile()||before.isSymbolicLink())throw new Error('tracked type changed');
   if(process.platform!=='win32'&&Boolean(before.mode&0o111)!==(match[1]==='100755'))throw new Error('tracked executable mode changed');
   const hash=createHash('sha1').update('blob '+before.size+'\0');let bytes=0;
   for await(const chunk of createReadStream(file,{signal})){signal?.throwIfAborted();bytes+=chunk.length;hash.update(chunk);}
   const after=await lstat(file);if(after.isSymbolicLink()||!after.isFile()||before.ino!==after.ino||before.size!==after.size||before.mtimeMs!==after.mtimeMs||bytes!==before.size||hash.digest('hex')!==match[2])throw new Error('tracked bytes changed');
  }
  const untracked=(await git(['ls-files','--others','-z'])).split('\0').filter(Boolean);
  if(untracked.some(p=>p!=='node_modules'&&!p.startsWith('node_modules/')))throw new Error('untracked source');
  if(untracked.length)await checkDependencies(root,{signal});
  if((await git(['rev-parse','HEAD'])).trim()!==sha)throw new Error('HEAD changed');return sha;
 }catch(error){signal?.throwIfAborted();if(error.code==='VERIFICATION_DEPENDENCIES_UNVERIFIED')throw error;throw fail('VERIFICATION_SOURCE_DIRTY','Exact source requires unchanged raw tracked file bytes/types and only verified same-lock dependencies.');}
}
export {readSourceSha as readVerificationSourceSha};
async function checkRuntime(workloads,{signal}={}){
 if(Number(process.versions.node.split('.')[0])!==24||process.platform!=='win32'||!['x64','arm64'].includes(process.arch))throw fail('VERIFICATION_RUNTIME_UNAVAILABLE','Selected workloads require Windows x64/arm64 and Node 24.');
 if(workloads.some(w=>w.requirements.runtimes.includes('powershell')))await exec('powershell',['-NoProfile','-NonInteractive','-Command','$PSVersionTable.PSVersion.ToString()'],{timeout:10000,maxBuffer:65536,signal});
}
// A timeout holds the heavy lock until the owned process tree is known to have terminated.
export function executeVerificationCommand(command,{repoRoot,timeoutMs,signal,contextFile}={}){
 return new Promise(resolveResult=>{
  let child,stdout='',stderr='',truncated=false,terminal=null,settled=false,timer,killPending=null;
  const append=(value,text)=>{const bytes=Buffer.byteLength(value+text);if(bytes>MAX_LOG){truncated=true;return Buffer.from(value+text).subarray(0,MAX_LOG).toString('utf8');}return value+text;};
  const finish=(status,exitCode,terminationConfirmed=true,exitSignal=null)=>{if(settled)return;settled=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);resolveResult({status,exitCode,signal:exitSignal,stdout,stderr,truncated,terminationConfirmed});};
  const stop=reason=>{
   if(terminal||settled)return;terminal=reason;
   killPending=(async()=>{
    if(!child?.pid)return true;
    if(process.platform==='win32'){try{await exec('taskkill',['/PID',String(child.pid),'/T','/F'],{timeout:10000,maxBuffer:65536});return true;}catch{return false;}}
    try{process.kill(-child.pid,'SIGKILL');return true;}catch{return false;}
   })();
   killPending.then(ok=>{if(!ok)finish('infrastructure-error',-1,false);});
  };
  const cancel=()=>stop(signal?.reason?.code==='VERIFICATION_TIMED_OUT'?'timed_out':'cancelled');
  if(signal?.aborted){finish(signal.reason?.code==='VERIFICATION_TIMED_OUT'?'timed_out':'cancelled',-1);return;}
  try{child=spawn(command.executable==='node'?process.execPath:command.executable,command.args,{cwd:repoRoot,shell:false,windowsHide:true,detached:process.platform!=='win32',env:{...process.env,...(contextFile?{CUPIS_VERIFICATION_CONTEXT:contextFile}:{})},stdio:['ignore','pipe','pipe']});}
  catch{finish('infrastructure-error',-1);return;}
  child.stdout.on('data',b=>stdout=append(stdout,b.toString()));child.stderr.on('data',b=>stderr=append(stderr,b.toString()));
  child.once('error',()=>finish('infrastructure-error',-1));
  child.once('close',async (code,exitSignal)=>{const confirmed=killPending?await killPending:true;finish(confirmed?(terminal??(code===0?'success':'failure')):'infrastructure-error',Number.isInteger(code)?code:-1,confirmed,exitSignal);});
  signal?.addEventListener('abort',cancel,{once:true});timer=setTimeout(()=>stop('timed_out'),Math.max(1,timeoutMs));timer.unref?.();
 });
}
async function prepareInputs({workload,inputRefs,inputRoots,referenceRoot,repoRoot,artifactRefs,artifactHash,requestId,sourceSha,reviewQualification,privateRoot,signal}){
 const selected=Object.fromEntries(workload.required_inputs.map(name=>[name,inputRefs[name]]));
 for(const name of workload.required_inputs){signal?.throwIfAborted();const kind=name==='installed_skills_root'?'installed-skills':name;await readBoundInventory({ref:selected[name],referenceRoot,root:inputRoots[name],kind,signal});}
 for(const ref of artifactRefs)await readExecutionRef({referenceRoot,ref,signal,maxBytes:INPUT_MAX_BYTES});
 const context=workload.id==='installed-skills'?{inventoryRef:selected.installed_skills_root,referenceRoot,skillsRoot:inputRoots.installed_skills_root,repoRoot}:{inputRefs:selected,referenceRoot,inputRoots:Object.fromEntries(workload.required_inputs.map(name=>[name,inputRoots[name]])),identity:{request_id:requestId,source_sha:sourceSha,artifact_digest:artifactHash},reviewQualification};
 const contextFile=join(privateRoot,workload.id+'.json');await writeFile(contextFile,JSON.stringify(context),{flag:'wx',signal});return {contextFile,inputDigest:workloadInputDigest(selected)};
}
export async function runVerification(options){
 const allowed=['requestId','sourceSha','workloadIds','target','limits','testConcurrency','executionDecision','runner','outputRoot','repoRoot','lockRoot','cloudIdentity','inputRefs','inputRoots','referenceRoot','artifactRefs','artifactHash','reviewQualification','signal'];
 if(!options||Object.keys(options).some(k=>!allowed.includes(k)))throw fail('VERIFICATION_ARGUMENTS_INVALID','Unknown runner option. Commands come only from exact-source policy.');
 const {requestId,sourceSha,target,limits,testConcurrency,repoRoot=process.cwd(),outputRoot,lockRoot,cloudIdentity,inputRefs={},inputRoots={},referenceRoot=repoRoot,artifactRefs=[],artifactHash,reviewQualification,signal}=options;
 const workloadIds=Array.isArray(options.workloadIds)?[...options.workloadIds]:options.workloadIds;let executionDecision;
 try{executionDecision=options.executionDecision===undefined?undefined:structuredClone(options.executionDecision);}catch{throw fail('VERIFICATION_DECISION_MISMATCH','Frozen decision must be JSON data.');}
 if(!/^[-A-Za-z0-9_.]{1,100}$/u.test(requestId??'')||!SHA.test(sourceSha??'')||!['local','github-hosted'].includes(target)||!outputRoot||!Array.isArray(workloadIds)||!workloadIds.length||new Set(workloadIds).size!==workloadIds.length)throw fail('VERIFICATION_ARGUMENTS_INVALID','Exact identity, nonempty unique workload selection, target and evidence root are required.');
 const runner={readSourceSha,checkRuntime,checkDependencies,execute:executeVerificationCommand,now:()=>performance.now(),...options.runner};
 const started=runner.now();
 const budget=batchBudget({signal,now:runner.now,started});
 try{
 if(await budget.run(()=>runner.readSourceSha(repoRoot,{signal:budget.signal}))!==sourceSha)throw fail('VERIFICATION_SOURCE_MISMATCH','Checkout must equal requested source SHA before workloads.');
 const policy=await loadExecutionPolicy({repoRoot}),selection=resolveVerificationSelection({policy,requestId,sourceSha,workloadIds,target,limits,testConcurrency,executionDecision,inputRefs}),workloads=selection.workloads;
 if(target==='github-hosted'&&workloads.some(w=>w.portability!=='portable'))throw fail('VERIFICATION_LOCAL_ONLY','Actual user inputs and installed skills stay local.');
 if(target==='github-hosted'&&(!cloudIdentity||Object.keys(cloudIdentity).sort().join(',')!=='event_sha,run_attempt,run_id,workflow_sha'||!SHA.test(cloudIdentity.workflow_sha)||!SHA.test(cloudIdentity.event_sha)||!/^\d+$/u.test(cloudIdentity.run_id)||!/^\d+$/u.test(cloudIdentity.run_attempt)))throw fail('VERIFICATION_CLOUD_IDENTITY_INVALID','Cloud workflow, event and actual run identities are distinct required fields.');
 if(target==='github-hosted'&&(Object.keys(inputRefs).length||Object.keys(inputRoots).length||artifactRefs.length||reviewQualification))throw fail('VERIFICATION_LOCAL_ONLY','No private input metadata is accepted by cloud execution.');
 for(const workload of workloads)if(workload.required_inputs.length&&(workload.required_inputs.some(name=>!inputRefs[name]||!inputRoots[name])||!artifactRefs.length||artifactDigest(artifactRefs)!==artifactHash))throw fail('VERIFICATION_INPUT_MISSING','Consuming workloads require bound file inventories, authorized local roots and artifact identity.');
 const sourceRoot=await realpath(repoRoot),output=join(await realpath(dirname(resolve(outputRoot))),basename(resolve(outputRoot)));
 if(within(sourceRoot,output))throw fail('VERIFICATION_OUTPUT_ROOT_INVALID','Evidence must be outside exact source.');
 let lock,lockGuard,keepLock=false,privateRoot;
 if(target==='local'&&workloads.some(w=>w.heavy)){
  if(!lockRoot||within(sourceRoot,resolve(lockRoot))||within(output,resolve(lockRoot)))throw fail('VERIFICATION_LOCK_ROOT_INVALID','Use persistent Task3 runner_lock_root outside source and evidence directories.');
  await mkdir(lockRoot,{recursive:true});const actual=await realpath(lockRoot);if(within(sourceRoot,actual)||within(output,actual))throw fail('VERIFICATION_LOCK_ROOT_INVALID','Persistent lock root cannot resolve into source/evidence.');
  lock=join(actual,'heavy-batch.lock');try{await mkdir(lock);}catch(error){if(error.code==='EEXIST')throw fail('VERIFICATION_HEAVY_BATCH_ACTIVE','A heavy batch owns the persistent lock; no automatic stale-lock stealing.');throw error;}
  lockGuard=await ownHeavyLock(lock);
 }
 try{
  // Never overwrite an earlier run's evidence. Runtime/dependency failures are execution failures.
  await mkdir(output,{recursive:false});
  const results=[],evidence=[];let dependencyMode=null,preflightError=null,stopStatus=null;
  try{await budget.run(()=>runner.checkRuntime(workloads,{signal:budget.signal}));dependencyMode=await budget.run(()=>runner.checkDependencies(repoRoot,{signal:budget.signal}));if(lockGuard)await lockGuard.check();}catch(error){preflightError=error.code??'VERIFICATION_RUNTIME_UNAVAILABLE';stopStatus=terminalStatus(error);}
  if(workloads.some(w=>w.required_inputs.length)){privateRoot=join(output,'.private');await mkdir(privateRoot);}
  for(const workload of workloads){
   const result={id:workload.id,signature:workloadSignature(workload),status:stopStatus??'success',exit_code:stopStatus?-1:0,...(executionDecision!==undefined&&target==='local'&&MAPPED_IDS.includes(workload.id)?{test_concurrency:workload.limits.concurrency}:{})};const records=[];let contextFile;
   if(!stopStatus){
    try{
     if(workload.required_inputs.length){const bound=await budget.run(()=>prepareInputs({workload,inputRefs,inputRoots,referenceRoot,repoRoot,artifactRefs,artifactHash,requestId,sourceSha,reviewQualification,privateRoot,signal:budget.signal}));contextFile=bound.contextFile;result.input_digest=bound.inputDigest;}
     const commands=structuredClone(workload.commands);
     for(const command of commands){
      budget.check();
      if(lockGuard)await lockGuard.check();
      // Only placeholders named in fixed source policy can be substituted, with verified files.
      const concrete={executable:command.executable,args:command.args.map(arg=>/^\{[a-z_]+\}$/u.test(arg)?resolve(referenceRoot,inputRefs[arg.slice(1,-1)].path):arg)};
      // Do not race this promise: actual owned process termination precedes heavy-lock release.
      const execution=await runner.execute(concrete,{repoRoot,timeoutMs:budget.remaining(),signal:lockGuard?AbortSignal.any([budget.signal,lockGuard.signal]):budget.signal,contextFile});
      if(execution.terminationConfirmed===false)keepLock=true;
      const status=['success','failure','cancelled','timed_out','infrastructure-error','skipped'].includes(execution.status)?execution.status:'infrastructure-error';
      result.exit_code=Number.isInteger(execution.exitCode)?execution.exitCode:-1;result.status=status==='success'&&result.exit_code!==0?'failure':status;
      records.push({command:workload.required_inputs.length?command:concrete,status:result.status,exit_code:result.exit_code,stdout:String(execution.stdout??'').slice(0,MAX_LOG),stderr:String(execution.stderr??'').slice(0,MAX_LOG),truncated:execution.truncated===true,termination_confirmed:execution.terminationConfirmed!==false});
      if(lockGuard)await lockGuard.check();
      if(!keepLock)budget.check();
      if(result.status!=='success')break;
     }
     // Fresh validation after a consuming process catches changes made during that process.
     if(result.status==='success'&&workload.required_inputs.length)for(const name of workload.required_inputs)await budget.run(()=>readBoundInventory({ref:inputRefs[name],referenceRoot,root:inputRoots[name],kind:name==='installed_skills_root'?'installed-skills':name,signal:budget.signal}));
     if(result.status==='success')budget.check();
    }catch(error){result.status=terminalStatus(error);result.exit_code=-1;records.push({code:error.code??'VERIFICATION_EXECUTION_ERROR'});}
   }
   if(result.status!=='success')stopStatus=result.status==='skipped'?'failure':result.status;
   let body=JSON.stringify({request_id:requestId,source_sha:sourceSha,workload_id:workload.id,signature:result.signature,limits:workload.limits,dependency_mode:dependencyMode,preflight_error:preflightError,records},null,2)+'\n';
   const file=workload.id+'.json',filePath=join(output,file);
   if(!stopStatus)try{await budget.run(()=>writeFile(filePath,body,{flag:'wx',signal:budget.signal}));}
   catch(error){result.status=terminalStatus(error);result.exit_code=-1;stopStatus=result.status;await rm(filePath,{force:true});body=JSON.stringify({request_id:requestId,source_sha:sourceSha,workload_id:workload.id,code:error.code??'VERIFICATION_EVIDENCE_WRITE_FAILED'})+'\n';await writeFile(filePath,body,{flag:'wx',signal:AbortSignal.timeout(10000)});}
   else await writeFile(filePath,body,{flag:'wx',signal:AbortSignal.timeout(10000)});
   evidence.push({path:file,digest:bytesDigest(body)});results.push(result);
  }
  if(!stopStatus)try{budget.check();}catch(error){stopStatus=terminalStatus(error);for(const result of results){result.status=stopStatus;result.exit_code=-1;}}
  if(!stopStatus&&await budget.run(()=>runner.readSourceSha(repoRoot,{signal:budget.signal}))!==sourceSha)throw fail('VERIFICATION_SOURCE_MISMATCH','Source changed during verification.');
  const receipt={schema_version:'1.0.0',request_id:requestId,source_sha:sourceSha,workflow_sha:target==='github-hosted'?cloudIdentity.workflow_sha:null,...(target==='github-hosted'?{event_sha:cloudIdentity.event_sha,run_id:cloudIdentity.run_id,run_attempt:cloudIdentity.run_attempt}:{}),target,workload_results:results,conclusion:stopStatus??'success',evidence_refs:evidence,...(workloads.some(w=>w.required_inputs.length)?{artifact_digest:artifactHash}:{})};
  const receiptPath=join(output,'receipt.json'),temporary=join(output,'receipt.pending');
  if(receipt.conclusion==='success'){
   try{if(lockGuard)await lockGuard.check();await budget.run(()=>writeFile(temporary,JSON.stringify(receipt,null,2)+'\n',{flag:'wx',signal:budget.signal}));budget.check();await rename(temporary,receiptPath);budget.check();if(lockGuard)await lockGuard.check();}
   catch(error){await rm(temporary,{force:true});await rm(receiptPath,{force:true});throw error;}
  }else await writeFile(receiptPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx',signal:AbortSignal.timeout(10000)});
  return receipt;
 }finally{
  if(privateRoot)await rm(privateRoot,{recursive:true,force:true});
  if(lockGuard){await lockGuard.dispose();if(!keepLock)await lockGuard.release();}
 }
 }finally{budget.dispose();}
}
