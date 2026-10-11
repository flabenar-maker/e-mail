import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {validateExecutionAcceptance} from './lib/execution-receipt.mjs';
import {readExecutionRef,artifactDigest,isResolvedExecutionDecision} from './lib/execution-context.mjs';
const usage='Usage: finalize-execution --decision FILE --review FILE --verification FILE --artifact-digest HASH. Review and verification files contain arrays. Run from the exact source snapshot root; all evidence refs are {path,digest} below that root. Artifact digest = SHA256 of canonical sorted artifact_refs (artifactDigest helper). Actual executor binding and independent primary-source review are required; test PASS alone is insufficient.';
const failure=(code,message)=>({status:'blocked',request_id:null,blockers:[{code,path:'/cli',message}],evidence_refs:[],local_offer:null});
export function parseArguments(args){const parsed={};for(let i=0;i<args.length;i+=2){if(!['--decision','--review','--verification','--artifact-digest'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--')||Object.hasOwn(parsed,args[i]))throw new Error(usage);parsed[args[i]]=args[i+1];}if(Object.keys(parsed).length!==4||!/^[a-f0-9]{64}$/u.test(parsed['--artifact-digest']))throw new Error(usage);return parsed;}
export async function main(args=process.argv.slice(2)){
 if(args.length===1&&args[0]==='--help'){process.stdout.write(usage+'\n');return 0;}
 let options;try{options=parseArguments(args);}catch{process.stdout.write(JSON.stringify(failure('EXECUTION_CLI_ARGUMENTS',usage))+'\n');return 2;}
 try{
  const [decision,reviewReceipts,verificationReceipts]=await Promise.all(['--decision','--review','--verification'].map(async key=>JSON.parse(await readFile(options[key],'utf8'))));
  const expectedArtifactDigest=options['--artifact-digest'];const result=validateExecutionAcceptance({decision,reviewReceipts,verificationReceipts,expectedArtifactDigest});
  if(result.status==='accepted'&&isResolvedExecutionDecision(decision)){
   const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
   if(sha!==decision.source_sha)throw Object.assign(new Error(),{code:'EXECUTION_SOURCE_MISMATCH'});
   for(const ref of [decision.domain_context_ref,...decision.requirement_refs,...decision.artifact_refs,...result.evidence_refs])await readExecutionRef({ref,repoRoot:process.cwd()});
   if(artifactDigest(decision.artifact_refs)!==expectedArtifactDigest)throw Object.assign(new Error(),{code:'EXECUTION_ARTIFACT_MISMATCH'});
  }
  process.stdout.write(JSON.stringify(result)+'\n');return result.status==='accepted'?0:1;
 }catch(error){process.stdout.write(JSON.stringify(failure(error.code?.startsWith('EXECUTION_')?error.code:'EXECUTION_RECEIPT_INVALID','Finalization inputs or evidence could not be verified.'))+'\n');return 1;}
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)process.exitCode=await main();
