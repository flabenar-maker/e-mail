import {execFile,spawn} from 'node:child_process';
import {promisify} from 'node:util';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {safeExecutionPath} from './execution-context.mjs';
const exec=promisify(execFile);
const fail=(code,message)=>Object.assign(new Error(message),{code});
const COMPLETE_GUARDS=[
 'tests/skills/cupis-email-task-router.test.mjs',
 'tests/skills/maintenance-skill-boundary.test.mjs',
 'tests/skills/email-build-skill-boundary.test.mjs',
 'tests/skills/execution-policy.test.mjs',
 'tests/skills/model-selection.test.mjs',
 'tests/skills/execution-context.test.mjs',
 'tests/skills/execution-context-cli.test.mjs',
 'tests/skills/execution-receipt.test.mjs',
 'tests/skills/machine-profile.test.mjs',
 'tests/skills/verification-runner.test.mjs',
 'tests/foundation/local-only-verification.test.mjs',
].sort();
const guardMap=[
 ['.agents/skills/building-cupis-emails/',['tests/skills/email-build-skill-boundary.test.mjs']],
 ['.agents/skills/maintaining-cupis-email-system/',['tests/skills/maintenance-skill-boundary.test.mjs']],
 ['.agents/skills/cupis-email-task-router/',['tests/skills/cupis-email-task-router.test.mjs']],
 ['data/execution/',COMPLETE_GUARDS],
 ['schemas/execution-',COMPLETE_GUARDS],
 ['scripts/lib/verification-runner.mjs',['tests/skills/verification-runner.test.mjs']],
 ['.github/workflows/',['tests/foundation/local-only-verification.test.mjs']],
];
export function selectDocsTests(changedPaths){
 if(!Array.isArray(changedPaths)||changedPaths.some(p=>!safeExecutionPath(p)))throw fail('VERIFICATION_CHANGED_PATH_INVALID','Changed paths must be safe source-relative paths.');
 const selected=new Set();for(const path of changedPaths){const match=guardMap.find(([prefix])=>path.startsWith(prefix));if(!match)return [...COMPLETE_GUARDS];for(const test of match[1])selected.add(test);}
 // An empty commit still runs the complete guards; absence of selected tests cannot pass vacuously.
 return selected.size?[...selected].sort():[...COMPLETE_GUARDS];
}
export async function deriveDocsScope({repoRoot,sourceSha,readGit}={}){
 const git=readGit??(async args=>(await exec('git',args,{cwd:repoRoot,timeout:10000,maxBuffer:1024*1024})).stdout);
 const actual=(await git(['rev-parse','HEAD'])).trim();if(!/^[a-f0-9]{40}$/u.test(actual)||(sourceSha&&sourceSha!==actual))throw fail('VERIFICATION_SOURCE_MISMATCH','Docs source must equal exact checkout.');
 // cat-file reads parent metadata even in shallow clones; rev-list would hide a missing parent.
 const metadata=await git(['cat-file','-p',actual]);const parent=/^parent ([a-f0-9]{40})$/mu.exec(metadata)?.[1]??null;
 if(parent)try{await git(['cat-file','-e',parent+'^{commit}']);}catch{throw fail('VERIFICATION_DOCS_BASE_MISSING','Prepare exact source and its first parent before verification; runner does not fetch.');}
 const raw=parent?await git(['diff','--name-only','-z','--no-renames',parent,actual,'--']):await git(['ls-tree','--name-only','-r','-z',actual]);
 const changed_paths=[...new Set(raw.split('\0').filter(Boolean))].sort(),tests=selectDocsTests(changed_paths);
 return {scope:'one-commit-first-parent',source_sha:actual,base_sha:parent,changed_paths,changed_paths_digest:createHash('sha256').update(JSON.stringify(changed_paths)).digest('hex'),tests,commands:[{executable:'node',args:['--test','--test-concurrency=2',...tests]}]};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{
  if(process.argv.length!==2)throw fail('VERIFICATION_ARGUMENTS_INVALID','Docs scope is derived from exact source; no caller paths or commands.');
  const scope=await deriveDocsScope({repoRoot:process.cwd()});process.stdout.write(JSON.stringify({docs_scope:scope})+'\n');
  const command=scope.commands[0];const child=spawn(process.execPath,command.args,{cwd:process.cwd(),shell:false,windowsHide:true,stdio:'inherit'});
  // The outer verification runner owns this process tree and the shared 30-minute budget.
  child.once('error',()=>{process.exitCode=1;});child.once('close',code=>{process.exitCode=Number.isInteger(code)?code:1;});
 }catch(error){process.stderr.write(JSON.stringify({code:error.code??'VERIFICATION_DOCS_SCOPE_INVALID'})+'\n');process.exitCode=1;}
}
