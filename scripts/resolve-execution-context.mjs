import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {loadExecutionRequest,resolveExecutionContext,renderExecutionDecision} from './lib/execution-context.mjs';
import {loadExecutionPolicy} from './lib/execution-policy.mjs';
const usage='Usage: resolve-execution-context --request FILE --capabilities FILE --repo-root DIR [--profile FILE]. Request refs are {path,digest}, relative to repo-root. Domain JSON envelope: {schema_version:"1.0.0",source_sha,route,mode,authorization:{operation,allowed_paths},context:<unchanged domain resolver output>}. Initial executor_agent_id is optional; rerun with actual spawned ID before acceptance. Profile is read only for workloads, never collected.';
export function parseArguments(args){const parsed={};for(let i=0;i<args.length;i+=2){if(!['--request','--capabilities','--repo-root','--profile'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--')||Object.hasOwn(parsed,args[i]))throw new Error(usage);parsed[args[i]]=args[i+1];}if(!parsed['--request']||!parsed['--capabilities']||!parsed['--repo-root'])throw new Error(usage);return parsed;}
const failure=(code,message)=>({schema_version:'1.0.0',status:'blocked',blockers:[{code,path:'/cli',message}]});
export async function main(args=process.argv.slice(2)){
 if(args.length===1&&args[0]==='--help'){process.stdout.write(usage+'\n');return 0;}
 let options;try{options=parseArguments(args);}catch{process.stdout.write(renderExecutionDecision(failure('EXECUTION_CLI_ARGUMENTS',usage)));return 2;}
 try{
  const raw=JSON.parse(await readFile(options['--request'],'utf8'));const root=resolve(options['--repo-root']);
  const sha=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  if(sha!==raw.source_sha){process.stdout.write(renderExecutionDecision(failure('EXECUTION_SOURCE_MISMATCH','Request source must match the actual repository snapshot HEAD.')));return 1;}
  const request=await loadExecutionRequest({request:raw,repoRoot:root});
  const policy=await loadExecutionPolicy({repoRoot:root});const capabilities=JSON.parse(await readFile(options['--capabilities'],'utf8'));
  // Saved profile data only. Active pair binding is supplied by the coordinator, never inferred from hardware.
  const profile=request.workload_ids.length&&options['--profile']?JSON.parse(await readFile(options['--profile'],'utf8')):undefined;
  const decision=resolveExecutionContext({request,policy,capabilities,profile});process.stdout.write(renderExecutionDecision(decision));return decision.status==='resolved'?0:1;
 }catch(error){process.stdout.write(renderExecutionDecision(failure(error.code?.startsWith('EXECUTION_')?error.code:'EXECUTION_INPUT_INVALID','Execution input could not be loaded or verified.')));return 1;}
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)process.exitCode=await main();
