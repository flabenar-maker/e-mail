import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,writeFile,rm,symlink} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {runVerification} from '../../scripts/lib/verification-runner.mjs';
const source=resolve(import.meta.dirname,'../..');
async function fixture(t,{crlf=false,deps=false}={}){
 const root=await mkdtemp(join(tmpdir(),'cupis-source-')),repo=join(root,'source');await mkdir(repo);t.after(()=>rm(root,{recursive:true,force:true}));
 const git=(...args)=>execFileSync('git',args,{cwd:repo,encoding:'utf8',stdio:['pipe','pipe','pipe']}).trim();git('init','--quiet');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');git('config','core.autocrlf','false');
 for(const p of ['system/manifest.yaml','data/execution/policy.yaml','schemas/execution-policy.schema.json']){await mkdir(join(repo,p,'..'),{recursive:true});await copyFile(join(source,p),join(repo,p));}
 const lock={name:'fixture',lockfileVersion:3,packages:{'':{name:'fixture'},'node_modules/dependency':{version:'1.0.0',resolved:'https://example.invalid/dependency.tgz',integrity:'sha512-fixture'}}};
 await writeFile(join(repo,'package-lock.json'),JSON.stringify(lock));await writeFile(join(repo,'tracked.txt'),crlf?'raw\r\n':'raw\n');
 git('add','.');git('commit','--quiet','-m','raw fixture');
 if(crlf){await writeFile(join(repo,'.gitattributes'),'tracked.txt text eol=lf\n');git('add','.gitattributes');git('commit','--quiet','-m','LF policy keeps existing raw blob');}
 if(deps){await mkdir(join(repo,'node_modules/dependency'),{recursive:true});await writeFile(join(repo,'node_modules/.package-lock.json'),JSON.stringify({...lock,packages:{'node_modules/dependency':lock.packages['node_modules/dependency']}}));await writeFile(join(repo,'node_modules/dependency/package.json'),JSON.stringify({name:'dependency',version:'1.0.0'}));}
 let executions=0;const options={requestId:'source-identity',sourceSha:git('rev-parse','HEAD'),workloadIds:['docs-scoped'],target:'local',repoRoot:repo,outputRoot:join(root,'evidence'),runner:{checkRuntime:async()=>{},...(deps?{}:{checkDependencies:async()=>({mode:'direct-equivalent'})}),execute:async()=>{executions++;return {status:'success',exitCode:0};}}};
 return {repo,root,git,options,executions:()=>executions};
}
test('raw CRLF HEAD bytes survive later LF attributes without dirty false positive',async t=>{const f=await fixture(t,{crlf:true});assert.notEqual(f.git('status','--porcelain'),'');assert.equal((await runVerification(f.options)).conclusion,'success');assert.equal(f.executions(),1);});
test('raw edit hidden by Git clean normalization is rejected',async t=>{const f=await fixture(t);await writeFile(join(f.repo,'.gitattributes'),'tracked.txt text eol=lf\n');f.git('add','.gitattributes');f.git('commit','--quiet','-m','LF policy');f.options.sourceSha=f.git('rev-parse','HEAD');await writeFile(join(f.repo,'tracked.txt'),'raw\r\n');f.git('diff','--quiet','HEAD','--');await assert.rejects(runVerification(f.options),{code:'VERIFICATION_SOURCE_DIRTY'});assert.equal(f.executions(),0);});
test('verified same-lock untracked dependencies are allowed',async t=>{const f=await fixture(t,{deps:true});assert.equal((await runVerification(f.options)).conclusion,'success');});
test('arbitrary untracked source remains rejected beside verified dependencies',async t=>{const f=await fixture(t,{deps:true});await writeFile(join(f.repo,'surprise.mjs'),'changed');await assert.rejects(runVerification(f.options),{code:'VERIFICATION_SOURCE_DIRTY'});assert.equal(f.executions(),0);});
test('unverified dependency exception cannot authorize a run',async t=>{const f=await fixture(t,{deps:true});await writeFile(join(f.repo,'node_modules/dependency/package.json'),'{}');await assert.rejects(runVerification(f.options),{code:'VERIFICATION_DEPENDENCIES_UNVERIFIED'});assert.equal(f.executions(),0);});
test('missing tracked file is a typed exact-source failure',async t=>{const f=await fixture(t);await rm(join(f.repo,'tracked.txt'));await assert.rejects(runVerification(f.options),{code:'VERIFICATION_SOURCE_DIRTY'});});
test('tracked parent junction cannot redirect source bytes',async t=>{const f=await fixture(t);await mkdir(join(f.root,'outside'));await copyFile(join(f.repo,'system/manifest.yaml'),join(f.root,'outside/manifest.yaml'));await rm(join(f.repo,'system'),{recursive:true});await symlink(join(f.root,'outside'),join(f.repo,'system'),'junction');await assert.rejects(runVerification(f.options),{code:'VERIFICATION_SOURCE_DIRTY'});});
test('pre-cancelled source inspection runs no commands',async t=>{const f=await fixture(t),controller=new AbortController();controller.abort();await assert.rejects(runVerification({...f.options,signal:controller.signal}),{code:'VERIFICATION_CANCELLED'});assert.equal(f.executions(),0);});
