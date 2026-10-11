import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {loadExecutionRequest,resolveExecutionContext,renderExecutionDecision} from './lib/execution-context.mjs';
import {loadExecutionPolicy} from './lib/execution-policy.mjs';
import {readExecutionProfile,readActiveProfileBinding,authorizedLocalBindingRoot} from './lib/machine-profile.mjs';
import {validatedProfileWrapper} from './lib/machine-profile-validation.mjs';
const usage="Usage: node scripts/resolve-execution-context.mjs --request FILE --capabilities FILE --repo-root DIR [--reference-root DIR] [(--profile FILE | --state-root DIR) (--pair-key KEY | --local-binding-root DIR)]\nSource: disposable pinned Git HEAD. References: distinct safe relative files under reference-root (default repo-root), {path,digest}, digest=SHA256(raw bytes); keep evidence outside source.\nRequest JSON (all shown keys required): {schema_version:\"1.0.0\",request_id,source_sha,route,mode,domain_context_ref,task_kind,operation:\"read\"|\"write\",allowed_paths:[],requirement_refs:[REF],artifact_refs:[],workload_ids:[]}. allowed_paths are exact authorized repository-relative outputs; each requirement ref is one primary requirement file. Artifacts are final actual outputs, not promises.\nOptional request fields: executor_agent_id (real spawned ID, rerun before acceptance), profile_pair_key (REQUIRED when reusing a saved profile for workloads; must match the trusted external pair and saved wrapper/binding), input_refs (named bound inventories for local-only checks).\nDomain envelope: {schema_version:\"1.0.0\",source_sha,route,mode,authorization:{operation,allowed_paths},context:UNCHANGED_DOMAIN_RESOLVER_JSON}. Preserve paused/blocked and the original authorized scope; context.route.id and context.workflow.mode must match the request. Never fabricate a resolved envelope.\nCapabilities JSON: {schema_version:\"1.0.0\",runtime_session_id,tool_signature,source:\"declared-runtime-tools\",models:[{id,efforts:[EFFORT],capabilities:[\"text\",\"code\",\"vision\"]}],max_subagents}. List only capabilities declared by actual tools. Reuse per session/signature; typed refusal may refresh. Catalog/cache availability is not tool availability.\nTask kinds: mechanical-read/run-prescribed-checks (read only); bounded-change/failure-diagnosis/visual-compare; architecture-change/policy-change/contract-change/ambiguous-task. Policy applies the critical mutation floor and one safety step.\nWorkloads: docs-scoped (one commit vs first parent), repository-full, windows-bootstrap, visual-fixtures; installed-skills/real-email-visual require fresh local inventories. No workloads means no profile/binding reads or setup. For saved-profile workloads, set request.profile_pair_key AND supply --pair-key or --local-binding-root. In a new chat, obtain the trusted pair once via init-execution-profile.mjs --action read --state-root STATE --local-binding-root BIND, then reuse it; do not read before every test, init/refresh or derive trust from a copied wrapper. Without workloads or a saved profile the field remains optional. Invalid/unbound/unknown signatures choose cloud. No collector runs here.\nOutput <=4KiB: resolved decision.executor/review/verification and bound refs, or typed blocked. Coordinator calls real agents with explicit model/effort and distinct review identity; helper never spawns. After final artifact/agent binding, finalize-execution.mjs --help describes acceptance receipts. PASS alone does not establish acceptance. Optional capabilities.refusals:[{runtime_session_id,tool_signature,model,effort,code}] records the actual typed MODEL_UNAVAILABLE/EFFORT_UNAVAILABLE/CAPABILITY_UNAVAILABLE rejection. One attempt per refused candidate/session/signature; retain that refusal when resolving again so the next permitted candidate is selected. Network failures never add model refusals.";
export function parseArguments(args){const parsed={};for(let i=0;i<args.length;i+=2){if(!['--request','--capabilities','--repo-root','--profile','--reference-root','--state-root','--pair-key','--local-binding-root'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--')||Object.hasOwn(parsed,args[i]))throw new Error(usage);parsed[args[i]]=args[i+1];}if(!parsed['--request']||!parsed['--capabilities']||!parsed['--repo-root'])throw new Error(usage);return parsed;}
const failure=(code,message)=>({schema_version:'1.0.0',status:'blocked',blockers:[{code,path:'/cli',message}]});
export async function main(args=process.argv.slice(2)){
 if(args.length===1&&args[0]==='--help'){process.stdout.write(usage+'\n');return 0;}
 let options;try{options=parseArguments(args);}catch{process.stdout.write(renderExecutionDecision(failure('EXECUTION_CLI_ARGUMENTS',usage)));return 2;}
 try{
  const raw=JSON.parse(await readFile(options['--request'],'utf8'));const root=resolve(options['--repo-root']);
  const sha=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  if(sha!==raw.source_sha){process.stdout.write(renderExecutionDecision(failure('EXECUTION_SOURCE_MISMATCH','Request source must match the actual repository snapshot HEAD.')));return 1;}
  const request=await loadExecutionRequest({request:raw,repoRoot:root,referenceRoot:resolve(options['--reference-root']??root)});
  const policy=await loadExecutionPolicy({repoRoot:root});const capabilities=JSON.parse(await readFile(options['--capabilities'],'utf8'));
  // Saved profile data only. Active pair binding is supplied by the coordinator, never inferred from hardware.
  let profile;
  if(request.workload_ids.length){
   if((options['--state-root']&&options['--profile'])||(options['--pair-key']&&options['--local-binding-root']))throw new Error('Conflicting profile sources.');
   let pairKey=options['--pair-key'];
   if(!pairKey&&options['--local-binding-root']){
    const bindingRoot=authorizedLocalBindingRoot({bindingRoot:options['--local-binding-root'],localAppData:process.env.LOCALAPPDATA,stateRoot:options['--state-root']});
    const binding=await readActiveProfileBinding({bindingRoot});if(binding.status==='resolved')pairKey=binding.pair_key;
   }
   if(pairKey&&options['--state-root'])profile=await readExecutionProfile({stateRoot:resolve(options['--state-root']),pairKey});
   else if(pairKey&&options['--profile']){
    try{profile=validatedProfileWrapper({wrapper:JSON.parse(await readFile(options['--profile'],'utf8')),pairKey});}
    catch{profile={status:'invalid',code:'PROFILE_STATE_INVALID'};}
   }
  }
  const decision=resolveExecutionContext({request,policy,capabilities,profile});process.stdout.write(renderExecutionDecision(decision));return decision.status==='resolved'?0:1;
 }catch(error){process.stdout.write(renderExecutionDecision(failure(error.code?.startsWith('EXECUTION_')?error.code:'EXECUTION_INPUT_INVALID','Execution input could not be loaded or verified.')));return 1;}
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)process.exitCode=await main();
