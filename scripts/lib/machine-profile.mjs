import {readFile,lstat,mkdir,open,rename,unlink,rmdir} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import {resolve,join,dirname,parse,relative,isAbsolute,sep} from 'node:path';
import {isValidMachineProfile as validProfile} from './machine-profile-validation.mjs';
import {workloadSignature} from './execution-context.mjs';
import {SystemValidationError} from './diagnostics.mjs';

const fail=(code,message)=>new SystemValidationError(code,'/profile',message);
const pairValid=value=>typeof value==='string'&&value.length>0&&value.length<=200&&!/[\x00-\x1f]/u.test(value);
const within=(root,path)=>{const rel=relative(resolve(root),resolve(path));return !rel||(!rel.startsWith('..'+sep)&&rel!=='..'&&!isAbsolute(rel));};
// No identifying machine/user data participates in the opaque key or filenames.
export function executionProfilePath({stateRoot,pairKey}) {
 if(typeof stateRoot!=='string'||!isAbsolute(stateRoot)||!pairValid(pairKey))throw fail('PROFILE_ARGUMENTS_INVALID','An absolute authorized state root and trusted opaque pair key are required.');
 return join(resolve(stateRoot),'profiles',createHash('sha256').update(pairKey).digest('hex'),'profile.json');
}
async function noLinks(path) {
 const absolute=resolve(path);let current=parse(absolute).root;
 for(const part of relative(current,absolute).split(/[\\/]/u).filter(Boolean)){
  current=join(current,part);
  try{if((await lstat(current)).isSymbolicLink())throw fail('PROFILE_PATH_UNSAFE','Profile state and binding must not traverse symbolic links or junctions.');}
  catch(error){if(error.code==='ENOENT')return;throw error;}
 }
}
async function readJson(path) {
 await noLinks(path);
 const stat=await lstat(path);if(!stat.isFile()||stat.size>65536)throw fail('PROFILE_STATE_INVALID','Saved profile data must be a small regular JSON file.');
 return JSON.parse(await readFile(path,'utf8'));
}
// Read-only by construction: no collector argument, process API or runtime probes.
export async function readExecutionProfile({stateRoot,pairKey}) {
 try {
  const profile=await readJson(executionProfilePath({stateRoot,pairKey}));
  if(!validProfile(profile,pairKey))return {status:'invalid',pair_key:pairKey,code:'PROFILE_STATE_INVALID'};
  return {status:'resolved',pair_key:pairKey,profile};
 } catch(error) {
  if(['ENOENT','ENOTDIR'].includes(error.code))return {status:'absent',pair_key:pairKey};
  return {status:'invalid',pair_key:pairKey,code:['EACCES','EPERM'].includes(error.code)?'PROFILE_STATE_UNWRITABLE':error.code==='PROFILE_PATH_UNSAFE'?error.code:'PROFILE_STATE_INVALID'};
 }
}
async function atomicJson(path,value) {
 const temporary=path+'.'+randomUUID()+'.tmp';let handle;
 try {
  handle=await open(temporary,'wx',0o600);await handle.writeFile(JSON.stringify(value,null,2)+'\n');await handle.sync();await handle.close();handle=null;
  await rename(temporary,path);
 } finally {if(handle)await handle.close().catch(()=>{});await unlink(temporary).catch(()=>{});}
}
async function storageReady(directory) {
 try {
  await noLinks(directory);await mkdir(directory,{recursive:true});await noLinks(directory);
  const probe=join(directory,'.write-probe-'+randomUUID());const handle=await open(probe,'wx',0o600);await handle.close();await unlink(probe);
 }catch(error){if(error.code==='PROFILE_PATH_UNSAFE')throw error;throw fail('PROFILE_STATE_UNWRITABLE','Choose an authorized persistent state root that can save the profile.');}
}
const nullableNumber=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0?value:null;
function sanitizeObservations(value) {
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const boolean=value=>typeof value==='boolean'?value:null;
 const integer=value=>Number.isInteger(value)&&value>=0?value:null;
 return {
  platform:['win32','linux','darwin'].includes(value.platform)?value.platform:null,
  architecture:['x64','arm64','ia32','arm'].includes(value.architecture)?value.architecture:null,
  logical_cpus:integer(value.logical_cpus),physical_ram_gib:nullableNumber(value.physical_ram_gib),free_ram_gib:nullableNumber(value.free_ram_gib),free_temporary_disk_gib:nullableNumber(value.free_temporary_disk_gib),
  runtimes:{node:{present:boolean(value.runtimes?.node?.present),major:integer(value.runtimes?.node?.major)},powershell:{present:boolean(value.runtimes?.powershell?.present)}}
 };
}
function localEligible(observations,workload,policy) {
 if(!observations)return false;
 const o=observations,r=workload.requirements;
 const threshold=policy.hardware_thresholds.find(x=>x.platform===o.platform&&x.architectures.includes(o.architecture));
 if(!threshold||o.runtimes.node.present!==true||o.runtimes.node.major!==threshold.node_major)return false;
 if(!['logical_cpus','physical_ram_gib','free_ram_gib','free_temporary_disk_gib'].every(key=>typeof o[key]==='number'&&o[key]>=threshold[key]))return false;
 return r.platforms.includes(o.platform)&&r.architectures.includes(o.architecture)&&r.node_major===o.runtimes.node.major&&r.runtimes.every(name=>o.runtimes[name]?.present===true)&&['concurrency','timeout_minutes','max_heavy_batches'].every(key=>workload.limits[key]<=policy.local_limits[key]);
}
function validateTestConcurrency(value) {
 if(value!==2&&value!==4)throw fail('PROFILE_CONCURRENCY_INVALID','Choose integer test concurrency 2 or 4.');
}
function existingSelection(profile,testConcurrency) {
 if(testConcurrency!==undefined&&(profile.test_concurrency??2)!==testConcurrency)throw fail('PROFILE_SELECTION_CONFLICT','The saved test choice differs; change it with explicit set-concurrency.');
 return profile;
}
async function initialize({stateRoot,pairKey,collectOnce,policy,testConcurrency},refresh) {
 if(testConcurrency!==undefined)validateTestConcurrency(testConcurrency);
 const path=executionProfilePath({stateRoot,pairKey});
 if(!refresh){const saved=await readExecutionProfile({stateRoot,pairKey});if(saved.status==='resolved')return existingSelection(saved.profile,testConcurrency);if(saved.status==='invalid')throw fail(saved.code==='PROFILE_STATE_UNWRITABLE'?'PROFILE_STATE_UNWRITABLE':'PROFILE_STATE_INVALID',saved.code==='PROFILE_STATE_UNWRITABLE'?'Choose an authorized persistent state root that can save the profile.':'Saved profile is invalid; explicit reassessment is required.');}
 if(!policy||!Array.isArray(policy.workloads)||!Array.isArray(policy.hardware_thresholds)||!/^[a-f0-9]{64}$/u.test(policy.policy_digest??'')||policy.local_limits?.concurrency!==2||policy.local_limits?.timeout_minutes!==30||policy.local_limits?.max_heavy_batches!==1)throw fail('PROFILE_POLICY_INVALID','Use the validated execution policy for profile initialization.');
 const directory=dirname(path);await storageReady(directory);
 const lock=join(directory,'init.lock'),started=join(directory,'initialization-started.json');
 try{await mkdir(lock);}catch(error){if(error.code==='EEXIST')throw fail('PROFILE_INITIALIZATION_IN_PROGRESS','Initialization is already active or was interrupted; do not retry collection automatically.');throw fail('PROFILE_STATE_UNWRITABLE','The initialization lock could not be saved.');}
 try {
  // Read the previous preference under the same lock as explicit reassessment.
  const saved=await readExecutionProfile({stateRoot,pairKey});
  const preference=refresh?(saved.status==='resolved'?saved.profile.test_concurrency:undefined):testConcurrency;
  if(!refresh){
   if(saved.status==='resolved')return existingSelection(saved.profile,testConcurrency);if(saved.status==='invalid')throw fail(saved.code==='PROFILE_STATE_UNWRITABLE'?'PROFILE_STATE_UNWRITABLE':'PROFILE_STATE_INVALID',saved.code==='PROFILE_STATE_UNWRITABLE'?'Choose an authorized persistent state root that can save the profile.':'Saved profile is invalid; explicit reassessment is required.');
   try{await lstat(started);throw fail('PROFILE_INITIALIZATION_IN_PROGRESS','A previous initialization did not finish saving; explicit reassessment is required.');}catch(error){if(error.code!=='ENOENT')throw error;}
  }
  // A durable marker prevents automatic resampling after a crash or failed final save.
  await atomicJson(started,{schema_version:'1.0.0',started_at:new Date().toISOString()});
  let observations=null;
  try{if(typeof collectOnce==='function')observations=sanitizeObservations(await collectOnce());}catch{/* Permission denial and collector timeout become one saved unavailable baseline. */}
  const profile={schema_version:'1.0.0',pair_key:pairKey,initialized_at:new Date().toISOString(),observations_status:observations?'available':'unavailable',observations,baseline_policy_digest:policy.policy_digest,workload_decisions:policy.workloads.map(workload=>({id:workload.id,signature:workloadSignature(workload),target:localEligible(observations,workload,policy)?'local':'github-hosted'})),local_limits:structuredClone(policy.local_limits)};
  if(preference!==undefined)profile.test_concurrency=preference;
  if(!validProfile(profile,pairKey))throw fail('PROFILE_POLICY_INVALID','The policy cannot produce a valid persisted profile.');
  await atomicJson(path,profile);
  // Success is reported only after the actual persisted file validates.
  const persisted=await readExecutionProfile({stateRoot,pairKey});if(persisted.status!=='resolved')throw fail('PROFILE_STATE_UNWRITABLE','The persisted profile could not be verified.');
  await unlink(started).catch(()=>{});return persisted.profile;
 }catch(error){if(error instanceof SystemValidationError)throw error;throw fail('PROFILE_STATE_UNWRITABLE','Profile initialization could not be saved; no success is claimed.');}
 finally{await rmdir(lock).catch(()=>{});}
}
export const initExecutionProfile=options=>initialize(options,false);
export async function updateExecutionProfile(options) {
 if(options.explicitRefreshRequest!==true)throw fail('PROFILE_REFRESH_REQUIRED','Reassessing the saved baseline requires an explicit user request.');
 return initialize(options,true);
}
// This operation has no collector or policy argument and cannot create a pair.
export async function setExecutionTestConcurrency({stateRoot,pairKey,testConcurrency,explicitSelection}) {
 if(explicitSelection!==true)throw fail('PROFILE_SELECTION_REQUIRED','Changing the saved test choice requires explicit selection.');
 validateTestConcurrency(testConcurrency);
 const path=executionProfilePath({stateRoot,pairKey}),directory=dirname(path);
 try{await noLinks(directory);if(!(await lstat(directory)).isDirectory())throw fail('PROFILE_STATE_INVALID','Existing profile state must be a directory.');}
 catch(error){if(error instanceof SystemValidationError)throw error;if(['ENOENT','ENOTDIR'].includes(error.code))throw fail('PROFILE_STATE_ABSENT','Initialize the trusted profile before selecting test concurrency.');throw fail('PROFILE_STATE_UNWRITABLE','The existing profile state could not be accessed.');}
 const lock=join(directory,'init.lock'),started=join(directory,'initialization-started.json');
 try{await mkdir(lock);}catch(error){throw fail(error.code==='EEXIST'?'PROFILE_INITIALIZATION_IN_PROGRESS':'PROFILE_STATE_UNWRITABLE','The profile is initializing or its exclusive lock could not be saved.');}
 try {
  try{await lstat(started);throw fail('PROFILE_INITIALIZATION_IN_PROGRESS','A previous initialization is unfinished; selection cannot reassess or remove its marker.');}catch(error){if(error.code!=='ENOENT')throw error;}
  const saved=await readExecutionProfile({stateRoot,pairKey});
  if(saved.status!=='resolved')throw fail(saved.status==='absent'?'PROFILE_STATE_ABSENT':saved.code,'The existing trusted profile is unavailable or invalid; no selection was saved.');
  const profile=structuredClone(saved.profile);profile.test_concurrency=testConcurrency;
  if(!validProfile(profile,pairKey))throw fail('PROFILE_STATE_INVALID','The selected profile did not validate.');
  await atomicJson(path,profile);
  const persisted=await readExecutionProfile({stateRoot,pairKey});
  if(persisted.status!=='resolved'||JSON.stringify(persisted.profile)!==JSON.stringify(profile))throw fail('PROFILE_STATE_UNWRITABLE','The persisted selection could not be verified; no success is claimed.');
  return persisted.profile;
 }catch(error){if(error instanceof SystemValidationError)throw error;throw fail('PROFILE_STATE_UNWRITABLE','The preference could not be saved; no success is claimed.');}
 finally{await rmdir(lock).catch(()=>{});}
}
function bindingPath(bindingRoot) {
 if(typeof bindingRoot!=='string'||!isAbsolute(bindingRoot))throw fail('PROFILE_BINDING_INVALID','Use an explicitly authorized absolute nonportable local binding root.');
 return join(resolve(bindingRoot),'active-profile.json');
}
export async function readActiveProfileBinding({bindingRoot}) {
 try{const binding=await readJson(bindingPath(bindingRoot));if(binding.schema_version!=='1.0.0'||!pairValid(binding.pair_key)||Object.keys(binding).sort().join(',')!=='pair_key,schema_version')throw Error('invalid');return {status:'resolved',...binding};}
 catch(error){return {status:error.code==='ENOENT'?'absent':'invalid',code:error.code==='ENOENT'?'PROFILE_BINDING_ABSENT':'PROFILE_BINDING_INVALID'};}
}
// Caller authorizes this nonportable local root; CLI additionally restricts it to LOCALAPPDATA.
export async function ensureActiveProfileBinding({bindingRoot,stateRoot}) {
 const path=bindingPath(bindingRoot);
 if(within(stateRoot,bindingRoot)||within(bindingRoot,stateRoot))throw fail('PROFILE_BINDING_PORTABLE','Binding must be outside the persistent workspace profile tree.');
 const saved=await readActiveProfileBinding({bindingRoot});if(saved.status==='resolved')return saved;if(saved.status==='invalid')throw fail('PROFILE_BINDING_INVALID','Existing binding is invalid; do not silently replace it.');
 await storageReady(bindingRoot);const lock=join(bindingRoot,'binding.lock');
 try{await mkdir(lock);}catch(error){throw fail(error.code==='EEXIST'?'PROFILE_INITIALIZATION_IN_PROGRESS':'PROFILE_STATE_UNWRITABLE','Binding could not be created exclusively.');}
 try{const current=await readActiveProfileBinding({bindingRoot});if(current.status==='resolved')return current;if(current.status==='invalid')throw fail('PROFILE_BINDING_INVALID','Existing binding is invalid.');await atomicJson(path,{schema_version:'1.0.0',pair_key:randomUUID()});const result=await readActiveProfileBinding({bindingRoot});if(result.status!=='resolved')throw fail('PROFILE_STATE_UNWRITABLE','The binding could not be saved.');return result;}
 finally{await rmdir(lock).catch(()=>{});}
}
// Pure path check, no implicit file access or creation in the user profile directory.
export function authorizedLocalBindingRoot({bindingRoot,localAppData,workspace,stateRoot}) {
 if(!localAppData||!isAbsolute(localAppData)||!isAbsolute(bindingRoot)||!within(localAppData,bindingRoot)||resolve(localAppData)===resolve(bindingRoot)||(workspace&&within(workspace,bindingRoot))||(stateRoot&&within(stateRoot,bindingRoot)))throw fail('PROFILE_BINDING_PORTABLE','Explicit local binding root must be below permitted LOCALAPPDATA and outside the workspace. Use a trusted externally supplied pair key if that location is unavailable.');
 return resolve(bindingRoot);
}
