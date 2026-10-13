import {readFile,lstat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {performance} from 'node:perf_hooks';
import {loadExecutionPolicy} from './lib/execution-policy.mjs';
import {resolveVerificationSelection,readVerificationSourceSha,executeVerificationCommand} from './lib/verification-runner.mjs';

const usage='Usage: node scripts/test-system.mjs [--validate-first] [--decision FILE] [--test-concurrency 2|4]. Fixed full-suite files only. Legacy bare npm test runs2; controlled4 requires a matching frozen LOCAL repository-full decision from the same exact source policy. This direct diagnostic command does not replace the persistent heavy-lock verification runner.';
const fail=(code,message)=>Object.assign(new Error(message),{code});
const FULL=['tests/foundation/*.test.mjs','tests/characterization/*.test.mjs','tests/components/*.test.mjs','tests/generation/*.test.mjs','tests/rendering/*.test.mjs','tests/workflows/*.test.mjs','tests/skills/*.test.mjs'];
function parse(args){
 if(!Array.isArray(args))throw fail('VERIFICATION_CLI_ARGUMENTS',usage);const values={};
 for(let index=0;index<args.length;index++){
  const flag=args[index];if(!['--validate-first','--decision','--test-concurrency'].includes(flag)||Object.hasOwn(values,flag))throw fail('VERIFICATION_CLI_ARGUMENTS',usage);
  if(flag==='--validate-first'){values[flag]=true;continue;}
  const value=args[++index];if(typeof value!=='string'||!value||value.startsWith('--'))throw fail('VERIFICATION_CLI_ARGUMENTS',usage);values[flag]=value;
 }
 if(values['--test-concurrency']&&!['2','4'].includes(values['--test-concurrency']))throw fail('VERIFICATION_CLI_ARGUMENTS',usage);
 return values;
}
export async function runSystemTests({repoRoot=process.cwd(),args=[],runner={}}={}){
 const values=parse(args),source=resolve(repoRoot),signal=runner.signal;let decision;
 if(values['--decision']){
  try{const file=values['--decision'],st=await lstat(file);if(!st.isFile()||st.isSymbolicLink()||st.size>4096)throw new Error();decision=JSON.parse(await readFile(file,{encoding:'utf8',signal}));}
  catch(error){signal?.throwIfAborted();throw fail('VERIFICATION_DECISION_MISMATCH','Frozen full-suite decision could not be read.');}
 }
 const sourceSha=decision===undefined?undefined:await (runner.readSourceSha??readVerificationSourceSha)(source,{signal});
 const policy=await loadExecutionPolicy({repoRoot:source});
 const selected=resolveVerificationSelection({policy,requestId:decision?.request_id,sourceSha,workloadIds:['repository-full'],target:'local',executionDecision:decision,testConcurrency:values['--test-concurrency']===undefined?undefined:Number(values['--test-concurrency'])});
 const testCommand=selected.workloads[0].commands.find(command=>command.executable==='node'&&command.args.includes('--test'));
 if(!testCommand||JSON.stringify(testCommand.args)!==JSON.stringify(['--test',`--test-concurrency=${selected.testConcurrency}`,...FULL]))throw fail('VERIFICATION_WORKLOAD_MISMATCH','The source policy must admit the fixed full-suite file list and order.');
 const commands=[...(values['--validate-first']?[{executable:'node',args:['scripts/validate-system.mjs']}]:[]),testCommand],started=performance.now();
 for(const command of commands){
  signal?.throwIfAborted();const remaining=30*60*1000-(performance.now()-started);if(remaining<=0)return {exitCode:1,signal:null,status:'timed_out'};
  const result=await (runner.execute??executeVerificationCommand)(command,{repoRoot:source,signal,timeoutMs:remaining});
  if(result.stdout)process.stdout.write(result.stdout);if(result.stderr)process.stderr.write(result.stderr);
  if(result.status!=='success'||result.exitCode!==0)return {exitCode:Number.isInteger(result.exitCode)&&result.exitCode>0?result.exitCode:1,signal:signal?.reason?.signal??result.signal??null,status:result.status};
 }
 if(decision!==undefined&&await (runner.readSourceSha??readVerificationSourceSha)(source,{signal})!==sourceSha)throw fail('VERIFICATION_SOURCE_MISMATCH','Source changed during the controlled diagnostic run.');
 return {exitCode:0,signal:null,status:'success'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 if(process.argv.length===3&&process.argv[2]==='--help'){process.stdout.write(usage+'\n');}
 else{
  const controller=new AbortController(),handlers=new Map(['SIGINT','SIGTERM'].map(name=>[name,()=>controller.abort(Object.assign(fail('VERIFICATION_CANCELLED','Verification was cancelled.'),{signal:name}))]));
  for(const [name,handler] of handlers)process.on(name,handler);
  try{const result=await runSystemTests({args:process.argv.slice(2),runner:{signal:controller.signal}});for(const [name,handler] of handlers)process.removeListener(name,handler);if(result.signal)process.kill(process.pid,result.signal);else process.exitCode=result.exitCode;}
  catch(error){process.stderr.write(JSON.stringify({code:error.code??'VERIFICATION_INFRASTRUCTURE_ERROR',message:error.code==='VERIFICATION_CLI_ARGUMENTS'?usage:'System tests could not complete.'})+'\n');process.exitCode=error.code==='VERIFICATION_CLI_ARGUMENTS'?2:1;}
 }
}
