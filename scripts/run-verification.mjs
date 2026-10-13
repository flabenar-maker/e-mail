import {readFile,lstat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {runVerification} from './lib/verification-runner.mjs';
import {readCloudEventRequest} from './lib/execution-cloud-event.mjs';
const usage='Usage: node scripts/run-verification.mjs --request-id ID --source-sha SHA --workloads IDS --target local --output DIR [--repo-root DIR] [--profile FILE] [--local-context FILE] [--decision FILE] [--test-concurrency 2|4]. A resolved frozen decision binds request/source/target/workloads/effective signatures and selects2/4; an explicit flag must match. Legacy calls run2. Profile FILE supplies persistent runner_lock_root; its current preference never overrides the frozen decision. Local context holds inputRefs/inputRoots/referenceRoot/artifactRefs/artifactHash/reviewQualification. Docs scope is one exact commit vs immutable first parent; prepare depth2, whole PR requires repository-full. --from-event uses only fixed GitHub event data and2. Same-lock direct Node equivalent; no npm ci claim.';
const bad=()=>Object.assign(new Error(usage),{code:'VERIFICATION_CLI_ARGUMENTS'});
export async function runVerificationCli(args,{env=process.env,signal}={}){
 if(args.length===1&&args[0]==='--help')return {exitCode:0,output:usage};
 let options;
 if(args.length===1&&args[0]==='--from-event'){
  if(env.GITHUB_ACTIONS!=='true'||!env.GITHUB_EVENT_PATH||!env.RUNNER_TEMP)throw bad();
  const request=readCloudEventRequest({eventName:env.GITHUB_EVENT_NAME,event:JSON.parse(await readFile(env.GITHUB_EVENT_PATH,'utf8'))});
  options={requestId:request.request_id,sourceSha:request.source_sha,workloadIds:request.workload_ids,target:'github-hosted',repoRoot:process.cwd(),outputRoot:join(env.RUNNER_TEMP,'cupis-verification-evidence'),cloudIdentity:{workflow_sha:env.GITHUB_WORKFLOW_SHA,event_sha:env.GITHUB_SHA,run_id:env.GITHUB_RUN_ID,run_attempt:env.GITHUB_RUN_ATTEMPT}};
 }else{
  const supported=['--request-id','--source-sha','--workloads','--target','--output','--repo-root','--profile','--local-context','--decision','--test-concurrency'],values={};
  for(let i=0;i<args.length;i+=2){if(!supported.includes(args[i])||Object.hasOwn(values,args[i])||!args[i+1]||args[i+1].startsWith('--'))throw bad();values[args[i]]=args[i+1];}
  for(const key of supported.slice(0,5))if(!values[key])throw bad();
  options={requestId:values['--request-id'],sourceSha:values['--source-sha'],workloadIds:values['--workloads'].split(','),target:values['--target'],repoRoot:resolve(values['--repo-root']??process.cwd()),outputRoot:resolve(values['--output'])};
  // A github-hosted receipt is produced only inside the actual event/run environment.
  if(options.target==='github-hosted')throw bad();
  if(values['--test-concurrency']){if(!['2','4'].includes(values['--test-concurrency']))throw bad();options.testConcurrency=Number(values['--test-concurrency']);}
  if(values['--decision']){
   try{const st=await lstat(values['--decision']);if(!st.isFile()||st.isSymbolicLink()||st.size>4096)throw new Error();options.executionDecision=JSON.parse(await readFile(values['--decision'],'utf8'));}
   catch{throw Object.assign(new Error('Frozen decision could not be read.'),{code:'VERIFICATION_DECISION_MISMATCH'});}
  }
  if(values['--profile']){const profile=JSON.parse(await readFile(values['--profile'],'utf8'));if(typeof profile.runner_lock_root!=='string')throw bad();options.lockRoot=profile.runner_lock_root;}
  if(values['--local-context']){
   const context=JSON.parse(await readFile(values['--local-context'],'utf8'));const fields=['inputRefs','inputRoots','referenceRoot','artifactRefs','artifactHash','reviewQualification'];if(Object.keys(context).some(k=>!fields.includes(k)))throw bad();Object.assign(options,context);
  }
 }
 const receipt=await runVerification({...options,signal});return {exitCode:receipt.conclusion==='success'?0:1,output:JSON.stringify(receipt)};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const controller=new AbortController();for(const name of ['SIGINT','SIGTERM'])process.on(name,()=>controller.abort());
 try{const result=await runVerificationCli(process.argv.slice(2),{signal:controller.signal});process.stdout.write(result.output+'\n');process.exitCode=result.exitCode;}
 catch(error){process.stderr.write(JSON.stringify({code:error.code??'VERIFICATION_INFRASTRUCTURE_ERROR',message:error.code==='VERIFICATION_CLI_ARGUMENTS'?usage:'Verification could not complete; no successful evidence was produced.'})+'\n');process.exitCode=error.code==='VERIFICATION_CLI_ARGUMENTS'?2:1;}
}
