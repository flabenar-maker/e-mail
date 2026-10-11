import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {loadExecutionRequest,resolveExecutionContext,renderExecutionDecision} from './lib/execution-context.mjs';
import {loadExecutionPolicy} from './lib/execution-policy.mjs';
import {readExecutionProfile,readActiveProfileBinding,authorizedLocalBindingRoot} from './lib/machine-profile.mjs';
import {validatedProfileWrapper} from './lib/machine-profile-validation.mjs';
const usage='Usage: resolve-execution-context --request FILE --capabilities FILE --repo-root DIR [(--profile FILE | --state-root DIR) (--pair-key KEY | --local-binding-root DIR)] [--reference-root DIR]. Git/policy source is repo-root; refs are {path,digest}, relative to the one explicit reference-root (default repo-root). Domain JSON envelope: {schema_version:"1.0.0",source_sha,route,mode,authorization:{operation,allowed_paths},context:<unchanged domain resolver output>}. Initial executor_agent_id is optional; rerun with actual spawned ID before acceptance. Profile is read only for workloads, never collected. Both profile inputs require a trusted external pair key or nonportable local binding; an unbound or invalid profile conservatively chooses cloud.';
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
