import {execFile} from 'node:child_process';
import * as filesystem from 'node:fs/promises';
import * as syncFilesystem from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {inflateRawSync} from 'node:zlib';
import Ajv2020 from 'ajv/dist/2020.js';
import receiptSchema from '../../schemas/execution-receipt.schema.json' with {type:'json'};
import {validateCloudRequest,writeCloudRequestMarker,readCloudEventRequest} from './execution-cloud-event.mjs';

const WORKFLOW='.github/workflows/cupis-verification.yml';
const LABEL='cupis-cloud-verification';
const SHA=/^[a-f0-9]{40}$/u,HASH=/^[a-f0-9]{64}$/u,REPOSITORY=/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u;
const MAX_API=2*1024*1024,MAX_ARCHIVE=16*1024*1024,MAX_FILE=8*1024*1024,MAX_FILES=5;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const fail=(code,message)=>Object.assign(new Error(message),{code});
const blocked=(code,message)=>({status:'blocked',code,message});
const positive=value=>/^[1-9][0-9]*$/u.test(String(value))&&Number.isSafeInteger(Number(value));
const time=value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const validReceipt=new Ajv2020({strict:true,allErrors:true}).compile({$defs:receiptSchema.$defs,$ref:'#/$defs/verification'});
const terminal=new Set(['success','failure','cancelled','timed_out','infrastructure-error']);

// Stores are local coordination records, never cloud carriers. A failed or interrupted
// mutation keeps its durable uncertain record; automatic stale-lock stealing is forbidden.
export function createCloudRequestStore({stateRoot,fs=filesystem}){
 const root=resolve(stateRoot),lock=join(root,'cloud-request.lock');
 return {async transact(key,action){
  await fs.mkdir(root,{recursive:true});
  try{await fs.mkdir(lock);}catch(error){if(error.code==='EEXIST')throw fail('CLOUD_REQUEST_IN_PROGRESS','A request owns the persistent lock.');throw error;}
  const file=join(root,'cloud-request-'+hash(key)+'.json');
  try{
   let old=null;try{old=JSON.parse(await fs.readFile(file,'utf8'));}catch(error){if(error.code!=='ENOENT')throw fail('CLOUD_REQUEST_STATE_INVALID','Saved request cannot be read safely.');}
   const save=async record=>{
    const temporary=file+'.'+randomUUID()+'.pending';
    const handle=await fs.open(temporary,'wx');
    try{await handle.writeFile(JSON.stringify(record)+'\n');await handle.sync();}finally{await handle.close();}
    await fs.rename(temporary,file);
   };
   return await action(old,save);
  }finally{await fs.rmdir(lock);}
 }};
}
export function createLocalOfferStore({stateRoot,fs=syncFilesystem}){
 const root=resolve(stateRoot);
 return {claim(key){fs.mkdirSync(root,{recursive:true});try{fs.mkdirSync(join(root,'local-offer-'+hash(key)));return true;}catch(error){if(error.code==='EEXIST')return false;throw fail('LOCAL_OFFER_STATE_UNWRITABLE','The once-only offer could not be persisted.');}}};
}

function selectedRequest(decision){
 if(decision?.status!=='resolved'||!Array.isArray(decision.verification))throw fail('CLOUD_REQUEST_INVALID','A resolved selected decision is required.');
 const selected=decision.verification.filter(w=>w.target==='github-hosted');
 if(!selected.length)return null;
 if(selected.some(w=>w.portability!=='portable'||!HASH.test(w.signature??'')||(w.input_names?.length??0)>0||w.input_digest!=null))throw fail('CLOUD_REQUEST_INVALID','Cloud selection cannot carry private or local-only inputs.');
 const carrier=validateCloudRequest({schema_version:'1.0.0',request_id:decision.request_id,source_sha:decision.source_sha,workload_ids:selected.map(w=>w.id)});
 return {carrier,workloads:selected.map(w=>({id:w.id,signature:w.signature}))};
}
function prReady(pr,repository,number,source){
 return pr?.number===number&&pr.state==='open'&&pr.merged!==true&&pr.mergeable===true&&pr.head?.repo?.full_name===repository&&pr.base?.repo?.full_name===repository&&pr.head.sha===source&&SHA.test(pr.base.sha)&&SHA.test(pr.merge_commit_sha)&&typeof pr.head.ref==='string'&&pr.head.ref.length>0;
}
function prUnchanged(a,b){return a.head.sha===b.head?.sha&&a.base.sha===b.base?.sha&&a.merge_commit_sha===b.merge_commit_sha&&a.body===b.body&&same(a.labels,b.labels);}
export async function requestCloudVerification({decision,prIdentity,gh,requestStore}){
 try{
  const selected=selectedRequest(decision);if(!selected)return {status:'not-requested',code:'CLOUD_WORKLOAD_NOT_SELECTED'};
  const {repository,number,explicitlySelected}=prIdentity??{};
  if(!REPOSITORY.test(repository??'')||!Number.isSafeInteger(number)||number<1||explicitlySelected!==true)throw fail('CLOUD_REQUEST_INVALID','An explicit selected same-repository PR is required.');
  const fingerprint=hash(JSON.stringify({repository,number,...selected}));
  return await requestStore.transact(repository+':'+selected.carrier.request_id,async(old,save)=>{
   if(old){if(old.fingerprint!==fingerprint)return blocked('CLOUD_REQUEST_CONFLICT','Request ID is already bound to different source, PR or workloads.');if(!['requested','uncertain'].includes(old.status)||!requestValid(old.request))return blocked('CLOUD_REQUEST_STATE_INVALID','Saved request is incomplete.');return old;}
   // Always inspect actual repository service state before any transport mutation.
   const permissions=await gh.getActionsPermissions({repository});
   if(permissions?.enabled!==true)return blocked('CLOUD_WORKFLOW_NOT_READY','Repository Actions are unavailable; no settings are changed.');
   const repo=await gh.getRepository({repository});
   if(repo.full_name!==repository||repo.permissions?.push!==true||!repo.default_branch)return blocked('CLOUD_WORKFLOW_NOT_READY','Selected request needs repository write permission.');
   const pr=await gh.getPullRequest({repository,number});
   if(!prReady(pr,repository,number,selected.carrier.source_sha))return blocked('CLOUD_WORKFLOW_NOT_READY','The selected PR must be open, same-repository, conflict-free and at the exact source SHA.');
   const defaultWorkflow=await gh.getWorkflowAtRef({repository,ref:repo.default_branch});
   const sourceWorkflow=await gh.getWorkflowAtRef({repository,ref:selected.carrier.source_sha});
   if(!sourceWorkflow?.content)return blocked('CLOUD_WORKFLOW_NOT_READY','The workflow is absent at the selected source.');
   const event=defaultWorkflow?'workflow_dispatch':'pull_request';
   const workflow=await gh.getWorkflow({repository});
   if(workflow&&(workflow.path!==WORKFLOW||workflow.state!=='active'))return blocked('CLOUD_WORKFLOW_NOT_READY','The selected workflow is not active.');
   if(event==='workflow_dispatch'&&!workflow)return blocked('CLOUD_WORKFLOW_NOT_READY','Dispatch workflow is not registered.');
   const eventSha=event==='workflow_dispatch'?selected.carrier.source_sha:pr.merge_commit_sha;
   if(event==='workflow_dispatch'){
    const ref=await gh.getRef({repository,ref:'heads/'+pr.head.ref});
    if(ref.object?.sha!==selected.carrier.source_sha)return blocked('CLOUD_WORKFLOW_NOT_READY','Dispatch branch moved from the selected source.');
   }else{
    if(pr.labels?.some(x=>(typeof x==='string'?x:x.name)===LABEL))return blocked('CLOUD_WORKFLOW_NOT_READY','The opt-in label is already present; it is never automatically toggled.');
    const merge=await gh.getCommit({repository,sha:eventSha});
    if(merge.sha!==eventSha||merge.parents?.length!==2||merge.parents[0].sha!==pr.base.sha||merge.parents[1].sha!==selected.carrier.source_sha)return blocked('CLOUD_WORKFLOW_NOT_READY','The selected merge commit does not bind the exact PR head and base.');
   }
   const eventWorkflow=await gh.getWorkflowAtRef({repository,ref:eventSha});
   if(eventWorkflow?.content!==sourceWorkflow.content)return blocked('CLOUD_WORKFLOW_NOT_READY','Event workflow must equal the selected source workflow.');
   const fresh=await gh.getPullRequest({repository,number});
   if(!prReady(fresh,repository,number,selected.carrier.source_sha)||!prUnchanged(pr,fresh))return blocked('CLOUD_WORKFLOW_NOT_READY','PR changed during request preparation.');
   const created=gh.now?.()??new Date(),createdAt=created.toISOString();
   const request={...selected.carrier,workloads:selected.workloads,repository,pr_number:number,event,workflow_id:workflow?String(workflow.id):null,workflow_path:WORKFLOW,workflow_sha:eventSha,event_sha:eventSha,workflow_digest:hash(sourceWorkflow.content),base_sha:pr.base.sha,ref:pr.head.ref,display_title:`cupis-cloud:${event}:${event==='workflow_dispatch'?selected.carrier.request_id:number}:${selected.carrier.source_sha}`,created_at:createdAt,discovery_until:new Date(created.getTime()+120000).toISOString(),run_id:null};
   const pending={status:'uncertain',code:'CLOUD_REQUEST_OUTCOME_UNKNOWN',fingerprint,request};
   // Write-ahead uncertainty includes body mutation: interrupted body/label operations
   // must never be resumed by guessing which remote side effect happened.
   await save(pending);
   try{
    if(event==='workflow_dispatch'){
     const response=await gh.dispatch({repository,workflowId:workflow.id,ref:pr.head.ref,inputs:{request_id:request.request_id,source_sha:request.source_sha,workloads:request.workload_ids.join(',')}});
     if(!positive(response?.workflow_run_id)||response.run_url!==`https://api.github.com/repos/${repository}/actions/runs/${response.workflow_run_id}`||response.html_url!==`https://github.com/${repository}/actions/runs/${response.workflow_run_id}`)return pending;
     request.run_id=String(response.workflow_run_id);
    }else{
     const body=writeCloudRequestMarker(pr.body??'',selected.carrier);
     await gh.updatePullRequest({repository,number,body});
     const updated=await gh.getPullRequest({repository,number});
     if(!prReady(updated,repository,number,request.source_sha)||updated.base.sha!==pr.base.sha||updated.merge_commit_sha!==pr.merge_commit_sha||updated.body!==body||!same(updated.labels,pr.labels))return pending;
     readCloudEventRequest({eventName:'pull_request',event:{action:'labeled',label:{name:LABEL},repository:{full_name:repository},pull_request:updated}});
     await gh.addLabel({repository,number,label:LABEL});
    }
    const result={status:'requested',fingerprint,request};await save(result);return result;
   }catch{return pending;}
  });
 }catch(error){return blocked(error.code?.startsWith('CLOUD_')?error.code:'CLOUD_WORKFLOW_NOT_READY','Selected cloud request could not be safely prepared or persisted.');}
}

function requestValid(r){
 try{validateCloudRequest({schema_version:r.schema_version,request_id:r.request_id,source_sha:r.source_sha,workload_ids:r.workload_ids});}catch{return false;}
 return REPOSITORY.test(r.repository??'')&&Number.isSafeInteger(r.pr_number)&&r.pr_number>0&&['workflow_dispatch','pull_request'].includes(r.event)&&r.workflow_path===WORKFLOW&&SHA.test(r.workflow_sha)&&SHA.test(r.event_sha)&&SHA.test(r.base_sha)&&HASH.test(r.workflow_digest)&&time(r.created_at)&&time(r.discovery_until)&&Date.parse(r.discovery_until)-Date.parse(r.created_at)===120000&&(r.run_id===null||positive(r.run_id))&&(r.workflow_id===null||positive(r.workflow_id))&&Array.isArray(r.workloads)&&r.workloads.length===r.workload_ids.length&&r.workloads.every((w,i)=>w.id===r.workload_ids[i]&&HASH.test(w.signature));
}
function matchingRun(run,r){
 const created=Date.parse(run?.created_at),start=Date.parse(r.created_at),end=Date.parse(r.discovery_until);
 if(!positive(run?.id)||String(run.run_attempt)!=='1'||run.repository?.full_name!==r.repository||run.head_repository?.full_name!==r.repository||run.event!==r.event||run.path?.split('@')[0]!==WORKFLOW||(r.workflow_id!==null&&String(run.workflow_id)!==r.workflow_id)||run.display_title!==r.display_title||run.head_branch!==r.ref||!Number.isFinite(created)||created<start||created>end)return false;
 if(r.event==='workflow_dispatch')return run.head_sha===r.source_sha;
 // API head_sha is not treated as GITHUB_SHA. Both explicitly known source/event
 // identities are allowed, with a separate exact PR head/base association required.
 return [r.source_sha,r.event_sha].includes(run.head_sha)&&Array.isArray(run.pull_requests)&&run.pull_requests.some(pr=>pr.number===r.pr_number&&pr.head?.sha===r.source_sha&&pr.base?.sha===r.base_sha);
}
function terminalReceipt(request,run){
 return {schema_version:'1.0.0',request_id:request.request_id,source_sha:request.source_sha,workflow_sha:request.workflow_sha,event_sha:request.event_sha,run_id:String(run.id),run_attempt:String(run.run_attempt),target:'github-hosted',workload_results:[],conclusion:['failure','cancelled','timed_out'].includes(run.conclusion)?run.conclusion:'infrastructure-error',evidence_refs:[]};
}
function receiptMatches(receipt,request,run,files){
 if(!validReceipt(receipt)||receipt.target!=='github-hosted'||receipt.request_id!==request.request_id||receipt.source_sha!==request.source_sha||receipt.workflow_sha!==request.workflow_sha||receipt.event_sha!==request.event_sha||receipt.run_id!==String(run.id)||receipt.run_attempt!==String(run.run_attempt)||receipt.artifact_digest!==undefined||receipt.workload_results.length!==request.workloads.length||receipt.evidence_refs.length!==request.workloads.length)return false;
 const ids=new Set();
 for(const result of receipt.workload_results){const expected=request.workloads.find(w=>w.id===result.id);if(!expected||ids.has(result.id)||result.signature!==expected.signature||result.input_digest!==undefined)return false;ids.add(result.id);}
 const paths=new Set();
 for(const ref of receipt.evidence_refs){
  if(paths.has(ref.path)||!request.workload_ids.some(id=>ref.path===id+'.json')||!Buffer.isBuffer(files[ref.path])||files[ref.path].length>MAX_FILE||hash(files[ref.path])!==ref.digest)return false;
  paths.add(ref.path);
  let evidence;try{evidence=JSON.parse(files[ref.path].toString('utf8'));}catch{return false;}
  if(evidence.request_id!==request.request_id||evidence.source_sha!==request.source_sha||ref.path!==evidence.workload_id+'.json')return false;
  if(evidence.signature!==undefined&&evidence.signature!==request.workloads.find(w=>w.id===evidence.workload_id)?.signature)return false;
 }
 if(receipt.conclusion==='success')return run.conclusion==='success'&&receipt.workload_results.every(w=>w.status==='success'&&w.exit_code===0);
 if(run.conclusion==='success')return false;
 // A product FAIL is never promoted by a successful job label or by an offer.
 if(receipt.conclusion==='failure'&&!receipt.workload_results.some(w=>w.status==='failure'||w.status==='skipped'||w.exit_code!==0))return false;
 return run.conclusion===(receipt.conclusion==='infrastructure-error'?'failure':receipt.conclusion);
}
export async function readCloudVerification({request,gh}){
 let run,trustedRun=false;
 const reject=(code,message)=>({...blocked(code,message),...(trustedRun&&run?.status==='completed'?{terminal_receipt:terminalReceipt(request,run)}:{})});
 try{
  if(!requestValid(request))return blocked('CLOUD_REQUEST_INVALID','A durable selected request record is required.');
  if(request.run_id){run=await gh.getRun({repository:request.repository,runId:request.run_id});if(!matchingRun(run,request))return blocked('CLOUD_RUN_IDENTITY_MISMATCH','Selected API run does not match the exact request identity.');}
  else{
   const found=await gh.listRuns({repository:request.repository,event:request.event,created:request.created_at+'..'+request.discovery_until});
   if(!Array.isArray(found?.workflow_runs)||found.total_count!==found.workflow_runs.length||found.total_count>100)return blocked('CLOUD_RUN_AMBIGUOUS','Bounded discovery cannot prove a unique selected run.');
   const candidates=found.workflow_runs.filter(item=>matchingRun(item,request));
   if(candidates.length>1)return blocked('CLOUD_RUN_AMBIGUOUS','Multiple selected event candidates exist; no artifact was downloaded.');
   if(!candidates.length)return {status:'pending',code:'CLOUD_RUN_NOT_FOUND'};
   run=await gh.getRun({repository:request.repository,runId:String(candidates[0].id)});
   if(!matchingRun(run,request)||String(run.id)!==String(candidates[0].id))return blocked('CLOUD_RUN_IDENTITY_MISMATCH','Discovered run identity changed.');
  }
  if(request.workflow_id===null){const workflow=await gh.getWorkflow({repository:request.repository,workflowId:run.workflow_id});if(!workflow||workflow.path!==WORKFLOW||String(workflow.id)!==String(run.workflow_id))return blocked('CLOUD_RUN_IDENTITY_MISMATCH','Unregistered bring-up workflow identity is not proven.');}
  trustedRun=true;
  if(run.status!=='completed')return {status:'pending',run_id:String(run.id)};
  const list=await gh.listArtifacts({repository:request.repository,runId:String(run.id)});
  if(!Array.isArray(list?.artifacts)||list.total_count!==list.artifacts.length||list.total_count>100)return reject('CLOUD_ARTIFACT_INVALID','Artifact discovery was incomplete.');
  const matching=list.artifacts.filter(a=>a.name===`cupis-verification-${run.id}-${run.run_attempt}`);
  if(matching.length!==1)return reject('CLOUD_ARTIFACT_MISSING','One exact selected run artifact is required.');
  const artifact=matching[0];
  if(!positive(artifact.id)||artifact.expired!==false||!Number.isSafeInteger(artifact.size_in_bytes)||artifact.size_in_bytes<1||artifact.size_in_bytes>MAX_ARCHIVE||!/^sha256:[a-f0-9]{64}$/u.test(artifact.digest??'')||String(artifact.workflow_run?.id)!==String(run.id)||artifact.workflow_run?.head_sha!==run.head_sha)return reject('CLOUD_ARTIFACT_INVALID','Selected artifact identity, digest or size is invalid.');
  const files=await gh.downloadArtifact({repository:request.repository,artifactId:artifact.id,digest:artifact.digest});
  if(!files||Object.keys(files).length!==request.workloads.length+1||Object.keys(files).some(name=>name!=='receipt.json'&&!request.workload_ids.some(id=>name===id+'.json'))||!Buffer.isBuffer(files['receipt.json'])||files['receipt.json'].length>65536)return reject('CLOUD_RECEIPT_INVALID','Artifact must contain only exact selected flat JSON evidence.');
  let receipt;try{receipt=JSON.parse(files['receipt.json'].toString('utf8'));}catch{return reject('CLOUD_RECEIPT_INVALID','Receipt JSON is malformed.');}
  if(!receiptMatches(receipt,request,run,files))return reject('CLOUD_RECEIPT_INVALID','Receipt source, workflow, event, run, workload signature or evidence does not match.');
  return receipt;
 }catch(error){return reject(error.code?.startsWith('CLOUD_')?error.code:'CLOUD_RESULT_UNAVAILABLE','Selected run results could not be verified.');}
}

export function buildLocalVerificationOffer(options){
 const {decision,receipt}=options;
 if(!decision?.verification?.length)return null;
 if(!receipt||!validReceipt(receipt)||receipt.target!=='github-hosted'||!terminal.has(receipt.conclusion)||receipt.request_id!==decision.request_id||receipt.source_sha!==decision.source_sha)return null;
 const selected=decision.verification.filter(w=>w.target==='github-hosted');
 if(!selected.length||receipt.workload_results.some(w=>!selected.some(s=>s.id===w.id&&s.signature===w.signature)))return null;
 const {offerStore,profile}=options;if(!offerStore)return null;
 const identity=[receipt.request_id,receipt.source_sha,receipt.workflow_sha,receipt.event_sha,receipt.run_id,receipt.run_attempt];
 if(!offerStore.claim(JSON.stringify(identity)))return null;
 const cached=profile?.status==='resolved'?profile.profile:null;
 const initialized=cached&&time(cached.initialized_at)?cached.initialized_at:null;
 const scopes=selected.map(w=>w.id),failed=receipt.workload_results.filter(w=>w.status!=='success'||w.exit_code!==0).map(w=>w.id);
 const reproduction=receipt.conclusion!=='success';
 return {execution_id:hash(JSON.stringify(identity)),conclusion:receipt.conclusion,goal:reproduction?'Reproduce the selected cloud failure with the smallest relevant local scope.':'Optionally check the selected scope in this local environment.',scopes,baseline_initialized_at:initialized,current_load_measured:false,baseline_note:initialized?'Saved baseline only; current free memory, CPU load and disk availability were not measured.':'Saved baseline unavailable or unknown; current load was not measured.',limits:{concurrency:2,timeout_minutes:30,max_heavy_batches:1},risks:[{kind:'hang',description:'A local batch may slow or hang this PC when other applications consume resources.'},{kind:'software-opening',description:'Any check that needs local software may open applications; that requires a separately selected action.'},{kind:'time',description:'A full batch may take up to 30 minutes and delay other work; the saved baseline is not a duration guarantee.'}],choices:[{id:'lightweight',action:reproduction?'scoped-reproduction':'scoped-check',scopes:failed.length?failed:scopes,requires_explicit_selection:true},{id:'full-later',action:'defer-full-local-check',scopes,requires_explicit_selection:true},{id:'skip-additional',action:'skip-optional-only',scopes:[],requires_explicit_selection:true}],required_checks_note:'Skipping an additional run cannot satisfy missing mandatory local-only verification or independent semantic review.'};
}
export function finalizeWithLocalOffer({acceptance,...options}){return {...acceptance,local_offer:buildLocalVerificationOffer(options)};}

// All remote calls pass structured argv and JSON stdin. There is no shell, no API
// endpoint for enable/rerun, no run-log reader, and no implicit retry of mutations.
function executeGh(executable,args,options){
 return new Promise((done,reject)=>{
  const {input,...settings}=options;
  const child=execFile(executable,args,settings,(error,stdout,stderr)=>{if(error){error.stderr=stderr;reject(error);}else done({stdout,stderr});});
  child.stdin.on('error',()=>{});child.stdin.end(input??'');
 });
}
export function createGhAdapter({execute=executeGh}={}){
 const call=async(method,endpoint,body,{binary=false,missing=false}={})=>{
  const args=['api',endpoint,'--method',method,'--header','Accept: application/vnd.github+json','--header','X-GitHub-Api-Version: 2026-03-10'];
  if(body!==undefined)args.push('--input','-');
  try{
   const output=await execute('gh',args,{shell:false,windowsHide:true,encoding:'buffer',timeout:30000,maxBuffer:binary?MAX_ARCHIVE:MAX_API,input:body===undefined?undefined:JSON.stringify(body)});
   const bytes=Buffer.from(output.stdout??'');if(bytes.length>(binary?MAX_ARCHIVE:MAX_API))throw fail('CLOUD_RESPONSE_TOO_LARGE','Bounded remote response exceeded limit.');
   return binary?bytes:bytes.length?JSON.parse(bytes.toString('utf8')):null;
  }catch(error){if(missing&&/\(HTTP 404\)/u.test(String(error.stderr??'')))return null;throw error;}
 };
 const root=repository=>{if(!REPOSITORY.test(repository??''))throw fail('CLOUD_REQUEST_INVALID','Invalid repository.');return 'repos/'+repository;};
 const id=value=>{if(!positive(value))throw fail('CLOUD_REQUEST_INVALID','Invalid remote ID.');return String(value);};
 return {
  now:()=>new Date(),
  getRepository:({repository})=>call('GET',root(repository)),
  getActionsPermissions:({repository})=>call('GET',root(repository)+'/actions/permissions'),
  getPullRequest:({repository,number})=>call('GET',root(repository)+'/pulls/'+id(number)),
  getWorkflow:({repository,workflowId})=>call('GET',root(repository)+'/actions/workflows/'+(workflowId?id(workflowId):'cupis-verification.yml'),undefined,{missing:true}),
  async getWorkflowAtRef({repository,ref}){const file=await call('GET',root(repository)+'/contents/'+WORKFLOW+'?ref='+encodeURIComponent(ref),undefined,{missing:true});if(!file)return null;if(file.type!=='file'||file.encoding!=='base64'||file.path!==WORKFLOW||typeof file.content!=='string')throw fail('CLOUD_WORKFLOW_NOT_READY','Workflow content is unavailable.');return {path:file.path,sha:file.sha,content:Buffer.from(file.content,'base64').toString('utf8')};},
  getRef:({repository,ref})=>call('GET',root(repository)+'/git/ref/'+ref.split('/').map(encodeURIComponent).join('/')),
  getCommit:({repository,sha})=>{if(!SHA.test(sha))throw fail('CLOUD_REQUEST_INVALID','Invalid commit.');return call('GET',root(repository)+'/git/commits/'+sha);},
  updatePullRequest:({repository,number,body})=>call('PATCH',root(repository)+'/pulls/'+id(number),{body}),
  addLabel:({repository,number,label})=>{if(label!==LABEL)throw fail('CLOUD_REQUEST_INVALID','Invalid opt-in label.');return call('POST',root(repository)+'/issues/'+id(number)+'/labels',{labels:[label]});},
  dispatch:({repository,workflowId,ref,inputs})=>call('POST',root(repository)+'/actions/workflows/'+id(workflowId)+'/dispatches',{ref,inputs}),
  listRuns:({repository,event,created})=>call('GET',root(repository)+'/actions/runs?'+new URLSearchParams({event,created,per_page:'100',page:'1',exclude_pull_requests:'false'})),
  getRun:({repository,runId})=>call('GET',root(repository)+'/actions/runs/'+id(runId)),
  listArtifacts:({repository,runId})=>call('GET',root(repository)+'/actions/runs/'+id(runId)+'/artifacts?per_page=100&page=1'),
  async downloadArtifact({repository,artifactId,digest}){const zip=await call('GET',root(repository)+'/actions/artifacts/'+id(artifactId)+'/zip',undefined,{binary:true});if('sha256:'+hash(zip)!==digest)throw fail('CLOUD_ARTIFACT_INVALID','Downloaded archive digest does not match selected metadata.');return decodeCloudArtifact(zip);}
 };
}

// Decode only bounded flat JSON entries in memory. Never extract remote paths to disk.
export function decodeCloudArtifact(zip){
 const invalid=()=>{throw fail('CLOUD_ARTIFACT_INVALID','Artifact ZIP must be bounded flat JSON with ordinary stored/deflated entries.');};
 if(!Buffer.isBuffer(zip)||zip.length<22||zip.length>MAX_ARCHIVE)invalid();
 let end=-1;for(let i=zip.length-22;i>=Math.max(0,zip.length-65557);i--)if(zip.readUInt32LE(i)===0x06054b50&&i+22+zip.readUInt16LE(i+20)===zip.length){end=i;break;}
 if(end<0)invalid();const count=zip.readUInt16LE(end+10),offset=zip.readUInt32LE(end+16),size=zip.readUInt32LE(end+12);
 if(zip.readUInt16LE(end+4)!==0||zip.readUInt16LE(end+6)!==0||zip.readUInt16LE(end+8)!==count||count<1||count>MAX_FILES||offset+size!==end)invalid();
 const files=Object.create(null);let at=offset,total=0;
 for(let i=0;i<count;i++){
  if(at+46>end||zip.readUInt32LE(at)!==0x02014b50)invalid();
  const flags=zip.readUInt16LE(at+8),method=zip.readUInt16LE(at+10),compressed=zip.readUInt32LE(at+20),uncompressed=zip.readUInt32LE(at+24),nameSize=zip.readUInt16LE(at+28),extra=zip.readUInt16LE(at+30),comment=zip.readUInt16LE(at+32),local=zip.readUInt32LE(at+42),attributes=zip.readUInt32LE(at+38);
  if(at+46+nameSize+extra+comment>end||flags&1||![0,8].includes(method)||uncompressed>MAX_FILE||compressed>MAX_ARCHIVE||(attributes>>>16&0xf000)===0xa000)invalid();
  const name=zip.subarray(at+46,at+46+nameSize).toString('utf8');
  if(!/^[a-z][a-z0-9-]*\.json$/u.test(name)||Object.hasOwn(files,name)||local+30>offset||zip.readUInt32LE(local)!==0x04034b50||zip.readUInt16LE(local+8)!==method)invalid();
  const localName=zip.readUInt16LE(local+26),localExtra=zip.readUInt16LE(local+28),dataAt=local+30+localName+localExtra;
  if(zip.subarray(local+30,local+30+localName).toString('utf8')!==name||dataAt+compressed>offset)invalid();
  let bytes;try{const data=zip.subarray(dataAt,dataAt+compressed);bytes=method===0?Buffer.from(data):inflateRawSync(data,{maxOutputLength:MAX_FILE});}catch{invalid();}
  total+=bytes.length;if(bytes.length!==uncompressed||total>MAX_ARCHIVE)invalid();files[name]=bytes;at+=46+nameSize+extra+comment;
 }
 if(at!==end)invalid();return files;
}
