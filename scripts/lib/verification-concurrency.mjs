import {createHash} from 'node:crypto';
import {isValidMachineProfile} from './machine-profile-validation.mjs';
import {SystemValidationError} from './diagnostics.mjs';

const MAPPED_WORKLOAD_IDS=['docs-scoped','repository-full','visual-fixtures'];
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
const fail=(code,message)=>{throw new SystemValidationError(code,'/verification',message);};
const validChoice=value=>Number.isInteger(value)&&(value===2||value===4);
function assertChoice(value){if(!validChoice(value))fail('VERIFICATION_CONCURRENCY_INVALID','Local test concurrency must be the integer 2 or 4.');}
function permission(policy){
 if(!Object.hasOwn(policy,'local_test_concurrency'))return {allowed:[2],default:2,workload_ids:[]};
 const rule=policy.local_test_concurrency;
 if(!rule||Object.keys(rule).sort().join(',')!=='allowed,default,workload_ids'||JSON.stringify(rule.allowed)!=='[2,4]'||rule.default!==2||JSON.stringify(rule.workload_ids)!==JSON.stringify(MAPPED_WORKLOAD_IDS))fail('VERIFICATION_CONCURRENCY_UNSUPPORTED','The source policy does not contain the bounded local test concurrency permission.');
 return rule;
}

// Canonical signature bytes are the legacy API: choice2 must preserve them exactly.
export const workloadSignature=workload=>createHash('sha256').update(JSON.stringify(canonical({id:workload.id,commands:workload.commands,requirements:workload.requirements,limits:workload.limits}))).digest('hex');

// Only saved data for the already trusted pair is eligible; no reads, collectors or writes.
export function selectLocalTestConcurrency({policy,profile,pairKey}){
 if(!profile||typeof pairKey!=='string'||!pairKey||profile.pair_key!==pairKey)return 2;
 if(Object.hasOwn(profile,'test_concurrency'))assertChoice(profile.test_concurrency);
 if(!isValidMachineProfile(profile,pairKey)||profile.local_limits.concurrency!==policy.local_limits.concurrency||profile.local_limits.timeout_minutes!==policy.local_limits.timeout_minutes||profile.local_limits.max_heavy_batches!==policy.local_limits.max_heavy_batches)return 2;
 const choice=Object.hasOwn(profile,'test_concurrency')?profile.test_concurrency:2;
 if(!permission(policy).allowed.includes(choice))fail('VERIFICATION_CONCURRENCY_UNSUPPORTED','The saved choice is not supported by this source policy.');
 return choice;
}

// Derive only from the canonical source workload, never from caller command overrides.
export function deriveVerificationWorkload({workload,target,testConcurrency=2,policy}){
 assertChoice(testConcurrency);
 if(!['local','github-hosted'].includes(target)||!policy||!Array.isArray(policy.workloads))fail('VERIFICATION_WORKLOAD_MISMATCH','A canonical source workload and verification target are required.');
 const matches=policy.workloads.filter(source=>source.id===workload?.id),source=matches[0];
 if(matches.length!==1||JSON.stringify(canonical(workload))!==JSON.stringify(canonical(source))||source.limits.concurrency!==2||source.limits.timeout_minutes!==30||source.limits.max_heavy_batches!==1)fail('VERIFICATION_WORKLOAD_MISMATCH','The workload must exactly match the source policy and baseline budget.');
 if(target==='github-hosted'&&testConcurrency!==2)fail('VERIFICATION_CONCURRENCY_UNSUPPORTED','GitHub-hosted verification remains on concurrency 2.');
 const rule=permission(policy);
 if(target==='local'&&testConcurrency===4&&!rule.allowed.includes(4))fail('VERIFICATION_CONCURRENCY_UNSUPPORTED','The source policy does not permit local concurrency 4.');
 const effective=structuredClone(source);
 if(!MAPPED_WORKLOAD_IDS.includes(source.id))return effective;
 if(source.id==='docs-scoped'){
  if(JSON.stringify(source.commands)!==JSON.stringify([{executable:'node',args:['scripts/lib/execution-docs-check.mjs']}]))fail('VERIFICATION_WORKLOAD_MISMATCH','Docs verification must use its fixed canonical wrapper.');
  if(target==='local'&&testConcurrency===4)effective.commands[0].args.push('--test-concurrency','4');
 }else{
  let testCommands=0;
  for(const command of effective.commands){
   if(command.executable!=='node')continue;
   const flags=command.args.filter(arg=>arg.startsWith('--test-concurrency'));
   const testFlags=command.args.filter(arg=>arg==='--test');
   if(!testFlags.length){if(flags.length)fail('VERIFICATION_WORKLOAD_MISMATCH','Concurrency flags belong only to a canonical Node test command.');continue;}
   if(testFlags.length!==1||flags.length!==1||flags[0]!=='--test-concurrency=2')fail('VERIFICATION_WORKLOAD_MISMATCH','A Node test command requires one canonical concurrency 2 flag.');
   testCommands++;
   if(target==='local'&&testConcurrency===4)command.args[command.args.indexOf('--test-concurrency=2')]='--test-concurrency=4';
  }
  if(testCommands!==1)fail('VERIFICATION_WORKLOAD_MISMATCH','The mapped workload requires one canonical Node test command.');
 }
 if(target==='local'&&rule.workload_ids.includes(source.id))effective.limits.concurrency=testConcurrency;
 return effective;
}
