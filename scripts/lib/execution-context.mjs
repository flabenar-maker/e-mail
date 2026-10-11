import {readFile,realpath,lstat} from 'node:fs/promises';
import {resolve,relative,join,isAbsolute} from 'node:path';
import {createHash} from 'node:crypto';
import Ajv2020 from 'ajv/dist/2020.js';
import requestSchema from '../../schemas/execution-request.schema.json' with {type:'json'};
import decisionSchema from '../../schemas/execution-decision.schema.json' with {type:'json'};
import {selectModel} from './model-selection.mjs';
import {validateRuntimeCapabilities} from './runtime-capabilities.mjs';
import {SystemValidationError} from './diagnostics.mjs';
const ajv=new Ajv2020({strict:true,allErrors:true});
const requestValid=ajv.compile(requestSchema),decisionValid=ajv.compile(decisionSchema);
const verified=new WeakMap();
const hash=value=>createHash('sha256').update(value).digest('hex');
const diagnostic=(code,path,message)=>({code,path,message});
const fail=(code,message,path='/')=>new SystemValidationError(code,path,message);
const blocked=(code,message,extra={})=>({schema_version:'1.0.0',status:'blocked',blockers:[diagnostic(code,'/',message)],...extra});
const freeze=value=>{if(value&&typeof value==='object'){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;};
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;
export const workloadSignature=workload=>hash(JSON.stringify(canonical({id:workload.id,commands:workload.commands,requirements:workload.requirements,limits:workload.limits})));
export const artifactDigest=refs=>hash(JSON.stringify(canonical([...refs].sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0))));
export const workloadInputDigest=inputs=>hash(JSON.stringify(canonical(inputs)));
export const isResolvedExecutionDecision=decision=>decisionValid(decision)&&decision.status==='resolved';
export function safeExecutionPath(value){
 if(typeof value!=='string'||!value.length||value.includes('\\')||isAbsolute(value)||/[:<>"|?*\[\]{}\x00-\x1f]/u.test(value))return false;
 return value.split('/').every(part=>part&&part!=='.'&&part!=='..'&&!/[. ]$/u.test(part)&&!/~[0-9]/u.test(part)&&!/^(?:con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)/iu.test(part));
}
// All refs are explicit files under this root. No absolute refs, glob scopes, aliases or symlinks.
export async function readExecutionRef({ref,repoRoot,referenceRoot=repoRoot}){
 if(!ref||Object.keys(ref).sort().join(',')!=='digest,path'||!safeExecutionPath(ref.path)||!/^[a-f0-9]{64}$/u.test(ref.digest))throw fail('EXECUTION_REFERENCE_INVALID','Expected a safe repository-relative {path,digest} file reference.');
 const root=await realpath(referenceRoot);let file=root;
 try {
  for(const segment of ref.path.split('/')){file=join(file,segment);if((await lstat(file)).isSymbolicLink())throw fail('EXECUTION_REFERENCE_UNSAFE','Symbolic links are not permitted in execution references.');}
  const actual=await realpath(file),rel=relative(root,actual);if(rel.startsWith('..')||isAbsolute(rel))throw fail('EXECUTION_REFERENCE_UNSAFE','Reference escaped its allowed root.');
  const before=await lstat(file);if(!before.isFile())throw fail('EXECUTION_REFERENCE_INVALID','Reference must name a regular file.');
  const bytes=await readFile(file);const after=await lstat(file);if(after.isSymbolicLink()||before.ino!==after.ino||before.size!==after.size||before.mtimeMs!==after.mtimeMs)throw fail('EXECUTION_REFERENCE_CHANGED','Reference changed while reading.');
  if(hash(bytes)!==ref.digest)throw fail('EXECUTION_REFERENCE_DIGEST_MISMATCH','Reference digest does not match the actual file bytes.');return bytes.toString('utf8');
 }catch(error){if(error instanceof SystemValidationError)throw error;throw fail('EXECUTION_REFERENCE_READ','Execution reference could not be read.');}
}
// Preserve the existing domain resolver output in context; the envelope binds its trusted handoff.
export async function loadExecutionRequest({request,repoRoot,referenceRoot=repoRoot}){
 if(!requestValid(request))throw fail('EXECUTION_REQUEST_INVALID','Execution request does not match schema 1.0.0.');
 const copy=structuredClone(request);const paths=[...copy.allowed_paths];
 if(paths.some(p=>!safeExecutionPath(p)))throw fail('EXECUTION_SCOPE_INVALID','Allowed outputs must be exact safe relative paths.');
 const refs=[copy.domain_context_ref,...copy.requirement_refs,...copy.artifact_refs,...Object.values(copy.input_refs??{})];
 if(new Set(refs.map(r=>r.path)).size!==refs.length)throw fail('EXECUTION_REFERENCE_INVALID','Reference roles must use distinct files.');
 const contents=await Promise.all(refs.map(ref=>readExecutionRef({ref,referenceRoot})));
 let domain;try{domain=JSON.parse(contents[0]);}catch{throw fail('EXECUTION_DOMAIN_INVALID','Domain reference must contain a JSON handoff envelope.');}
 if(domain?.schema_version!=='1.0.0'||!['resolved','paused','blocked'].includes(domain.context?.status))throw fail('EXECUTION_DOMAIN_INVALID','Expected schema_version, source_sha, route, mode, authorization and context in domain envelope.');
 freeze(copy);verified.set(copy,freeze(structuredClone(domain)));return copy;
}
export async function validateExecutionSchemas({repoRoot,manifest}){
 for(const name of ['runtime-capabilities','execution-request','execution-decision','execution-receipt','machine-profile']){
  const path='schemas/'+name+'.schema.json',entries=manifest.sources.filter(x=>x.id===name+'-schema');
  if(entries.length!==1||entries[0].kind!=='schema'||entries[0].path!==path)throw fail('execution-schema-source','Expected one canonical execution schema registration.');
  const root=await realpath(repoRoot),actual=await realpath(join(root,path));if(relative(root,actual).startsWith('..'))throw fail('execution-schema-source','Execution schema escaped repository.');
  try{new Ajv2020({strict:true}).compile(JSON.parse(await readFile(actual,'utf8')));}catch{throw fail('execution-schema-invalid','Execution schema could not be compiled.');}
 }
}
// Pure decision function: no collector, process, network, environment setup or profile mutation.
export function resolveExecutionContext({request,policy,capabilities,profile}){
 const domain=verified.get(request);if(!domain)return blocked('EXECUTION_REQUEST_UNVERIFIED','Read and verify the request references before resolving.');
 if(domain.context.status!=='resolved')return blocked('EXECUTION_DOMAIN_'+domain.context.status.toUpperCase(),'Domain status does not authorize execution.',{domain_status:domain.context.status,executor:null});
 const authorization=domain.authorization;
 if(domain.source_sha!==request.source_sha||domain.route!==request.route||domain.mode!==request.mode||domain.context.route?.id!==request.route||domain.context.workflow?.mode!==request.mode)return blocked('EXECUTION_DOMAIN_MISMATCH','Domain source, route and mode must match the request.',{domain_status:'resolved',executor:null});
 if(!authorization||!['read','write'].includes(authorization.operation)||!Array.isArray(authorization.allowed_paths)||authorization.allowed_paths.some(p=>!safeExecutionPath(p))||request.allowed_paths.some(p=>!authorization.allowed_paths.includes(p))||(request.operation==='write'&&(authorization.operation!=='write'||request.mode==='read-only')))return blocked('EXECUTION_AUTHORIZATION_MISMATCH','Execution scope cannot widen the domain authorization.',{domain_status:'resolved',executor:null});
 if(!validateRuntimeCapabilities(capabilities))return blocked('MODEL_ROLE_UNAVAILABLE','A valid actual-tool capability snapshot is required.');
 const selected=selectModel({policy,taskKind:request.task_kind,operation:request.operation,allowedPaths:request.allowed_paths,capabilities});
 if(selected.status!=='resolved')return {schema_version:'1.0.0',status:'blocked',blockers:selected.blockers};
 const review={...selected.review,distinct_agent_required:true,all_requirements_required:true,reviewer:selected.review.reviewer??selected.executor};
 if(review.mode==='independent-source-check'){
  const required=[...policy.task_kinds[request.task_kind].required_capabilities,...policy.operation_capabilities[request.operation]];
  review.eligible_reviewers=policy.tiers.filter(t=>t.tier>=selected.executor.tier).flatMap(t=>t.candidates.filter(candidate=>{
   const declared=capabilities.models.find(m=>m.id===candidate.model);
   const refused=(capabilities.refusals??[]).some(r=>r.runtime_session_id===capabilities.runtime_session_id&&r.tool_signature===capabilities.tool_signature&&r.model===candidate.model&&r.effort===candidate.effort&&policy.runtime_capabilities.typed_refusal_codes.includes(r.code));
   return declared&&declared.efforts.includes(candidate.effort)&&required.every(c=>declared.capabilities.includes(c))&&!refused;
  }).map(candidate=>({tier:t.tier,...candidate})));
 }
 const verification=[];
 for(const id of request.workload_ids){
  const workload=policy.workloads.find(x=>x.id===id);if(!workload)return blocked('EXECUTION_WORKLOAD_UNKNOWN','Requested workload is not in the policy.');
  if(workload.required_inputs.some(input=>!Object.hasOwn(request.input_refs??{},input)))return blocked('EXECUTION_WORKLOAD_INPUT_MISSING','Workload requires verified input references.');
  const signature=workloadSignature(workload);const p=profile?.status==='resolved'&&request.profile_pair_key&&profile.pair_key===request.profile_pair_key&&profile.profile?.pair_key===request.profile_pair_key?profile.profile:null;
  const validProfile=p?.schema_version==='1.0.0'&&typeof p.initialized_at==='string'&&Number.isFinite(Date.parse(p.initialized_at))&&p.observations_status==='available'&&p.observations&&typeof p.observations==='object'&&/^[a-f0-9]{64}$/u.test(p.baseline_policy_digest??'')&&p.local_limits?.concurrency===policy.local_limits.concurrency&&p.local_limits?.timeout_minutes===policy.local_limits.timeout_minutes&&p.local_limits?.max_heavy_batches===policy.local_limits.max_heavy_batches&&Array.isArray(p.workload_decisions)&&p.workload_decisions.every(x=>typeof x?.id==='string'&&/^[a-f0-9]{64}$/u.test(x.signature??'')&&['local','github-hosted'].includes(x.target))&&new Set(p.workload_decisions.map(x=>x.id)).size===p.workload_decisions.length;
  const saved=validProfile?p.workload_decisions.find(x=>x.id===id&&x.signature===signature):null;
  const target=workload.portability==='local-only'?'local':saved?.target==='local'?'local':'github-hosted';
  const input_names=[...workload.required_inputs].sort();const input_digest=input_names.length?workloadInputDigest(Object.fromEntries(input_names.map(name=>[name,request.input_refs[name]]))):null;
  verification.push({id,portability:workload.portability,target,signature,input_names,input_digest,limits:structuredClone(workload.limits)});
 }
 const result={schema_version:'1.0.0',status:'resolved',domain_status:'resolved',request_id:request.request_id,source_sha:request.source_sha,policy_digest:policy.policy_digest,route:request.route,mode:request.mode,operation:request.operation,allowed_paths:[...request.allowed_paths],executor_agent_id:request.executor_agent_id??null,domain_context_ref:request.domain_context_ref,requirement_refs:request.requirement_refs,artifact_refs:request.artifact_refs,input_refs:request.input_refs??{},base_tier:selected.base_tier,target_tier:selected.target_tier,executor:selected.executor,review,verification,safety_ceiling_reached:selected.safety_ceiling_reached,blockers:[]};
 return Buffer.byteLength(JSON.stringify(result)+'\n','utf8')<=4096?result:blocked('EXECUTION_CONTEXT_TOO_LARGE','Required execution fields exceed the 4096-byte limit; split the scoped request.');
}
export function renderExecutionDecision(decision){const json=JSON.stringify(decision)+'\n';return Buffer.byteLength(json,'utf8')<=4096?json:JSON.stringify(blocked('EXECUTION_CONTEXT_TOO_LARGE','Required execution fields exceed the 4096-byte limit; split the scoped request.'))+'\n';}
