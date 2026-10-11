import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {tmpdir} from 'node:os';
import {resolve,dirname,join,relative,isAbsolute,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {initExecutionProfile,readExecutionProfile,updateExecutionProfile,ensureActiveProfileBinding,readActiveProfileBinding,authorizedLocalBindingRoot} from './lib/machine-profile.mjs';
import {loadExecutionPolicy} from './lib/execution-policy.mjs';
import {SystemValidationError} from './lib/diagnostics.mjs';

const sourceRoot=dirname(dirname(fileURLToPath(import.meta.url)));
const fail=(code,message)=>new SystemValidationError(code,'/profile',message);
const usage='Usage: init-execution-profile --action init|read|refresh [--workspace AUTHORIZED_PERSISTENT_DIR | --state-root ABSOLUTE_DIR] [--pair-key TRUSTED_OPAQUE_KEY | --local-binding-root PERMITTED_LOCALAPPDATA_SUBDIR] [--explicit-refresh yes]. State must be outside the source snapshot. Default state: WORKSPACE/.cupis-local/execution. Only explicit init/refresh may collect once. Read never collects. Profile output is local-only baseline data, never current load; do not upload it.';
function parseArguments(args) {
 const options={};for(let i=0;i<args.length;i+=2){if(!['--action','--workspace','--state-root','--pair-key','--local-binding-root','--explicit-refresh'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--')||Object.hasOwn(options,args[i]))throw fail('PROFILE_CLI_ARGUMENTS',usage);options[args[i]]=args[i+1];}
 if(!['init','read','refresh'].includes(options['--action'])||(!options['--workspace']&&!options['--state-root'])||Boolean(options['--pair-key'])===Boolean(options['--local-binding-root'])||(options['--explicit-refresh']&&options['--explicit-refresh']!=='yes'))throw fail('PROFILE_CLI_ARGUMENTS',usage);
 return options;
}
async function collectMachineProfile() {
 if(process.platform!=='win32')throw fail('PROFILE_COLLECTOR_UNAVAILABLE','No approved collector is available on this platform.');
 const {stdout}=await promisify(execFile)('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',join(sourceRoot,'bootstrap','collect-machine-profile.ps1'),'-NodeExecutable',process.execPath,'-TemporaryRoot',tmpdir()],{timeout:15000,maxBuffer:65536,windowsHide:true,encoding:'utf8'});
 return JSON.parse(stdout.replace(/^\uFEFF/u,'').trim());
}
export async function runExecutionProfile(args,{collectOnce=collectMachineProfile,repoRoot=sourceRoot}={}) {
 const options=parseArguments(args),action=options['--action'];
 const workspace=options['--workspace']?resolve(options['--workspace']):undefined;
 const stateRoot=options['--state-root']?resolve(options['--state-root']):join(workspace,'.cupis-local','execution');
 const relativeState=relative(resolve(repoRoot),stateRoot);
 if(!relativeState||(!relativeState.startsWith('..'+sep)&&relativeState!=='..'&&!isAbsolute(relativeState)))throw fail('PROFILE_STATE_IN_SOURCE','Choose persistent state outside the disposable source snapshot.');
 if(action==='refresh'&&options['--explicit-refresh']!=='yes')throw fail('PROFILE_REFRESH_REQUIRED','Reassessment requires an explicit user request and --explicit-refresh yes.');
 let pairKey=options['--pair-key'];
 if(!pairKey){
  const bindingRoot=authorizedLocalBindingRoot({bindingRoot:options['--local-binding-root'],localAppData:process.env.LOCALAPPDATA,workspace,stateRoot});
  const binding=action==='read'?await readActiveProfileBinding({bindingRoot}):await ensureActiveProfileBinding({bindingRoot,stateRoot});
  if(binding.status!=='resolved')return binding;pairKey=binding.pair_key;
 }
 const identity={stateRoot,pairKey};
 if(action!=='read'){
  const policy=await loadExecutionPolicy({repoRoot});
  if(action==='init')await initExecutionProfile({...identity,collectOnce,policy});
  else await updateExecutionProfile({...identity,explicitRefreshRequest:true,collectOnce,policy});
 }
 const result=await readExecutionProfile(identity);
 return {...result,runner_lock_root:join(stateRoot,'runner-locks'),baseline_note:'Saved setup baseline; current free memory, CPU load and disk space were not measured for this read.'};
}
export async function main(args=process.argv.slice(2)) {
 if(args.length===1&&args[0]==='--help'){process.stdout.write(usage+'\n');return 0;}
 try{const result=await runExecutionProfile(args);process.stdout.write(JSON.stringify(result)+'\n');return result.status==='resolved'?0:1;}
 catch(error){process.stdout.write(JSON.stringify({status:'blocked',code:error.code?.startsWith('PROFILE_')?error.code:'PROFILE_INPUT_INVALID',message:error instanceof SystemValidationError?error.message:'Profile command could not complete.'})+'\n');return error.code==='PROFILE_CLI_ARGUMENTS'?2:1;}
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)process.exitCode=await main();
