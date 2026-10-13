import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const artifactHash=refs=>createHash('sha256').update(JSON.stringify([...refs].sort((a,b)=>a.path.localeCompare(b.path)).map(r=>({digest:r.digest,path:r.path})))).digest('hex');
const inputHash=inputs=>createHash('sha256').update(JSON.stringify(Object.fromEntries(Object.keys(inputs).sort().map(k=>[k,{digest:inputs[k].digest,path:inputs[k].path}])))).digest('hex');
const api=await import('../../scripts/lib/execution-receipt.mjs').catch(()=>({}));
const ref=(path)=>({path,digest:'a'.repeat(64)});
function fixture(){
 const domain=ref('domain.json'),requirement=ref('requirement.txt'),artifact=ref('artifact.txt');
 const decision={schema_version:'1.0.0',status:'resolved',domain_status:'resolved',request_id:'r1',source_sha:'a'.repeat(40),policy_digest:'b'.repeat(64),route:'maintenance',mode:'write',operation:'write',allowed_paths:['docs/change.md'],executor_agent_id:'worker',domain_context_ref:domain,requirement_refs:[requirement],artifact_refs:[artifact],base_effort:'medium',target_effort:'high',runtime_identity:{runtime_session_id:'actual-session',tool_signature:'actual-tool'},executor:{selected_model:{binding:'inherited',id:null},effort:'high'},review:{required:true,mode:'independent-agent',distinct_agent_required:true,primary_sources_required:true,all_requirements_required:true,reviewer:{selected_model:{binding:'inherited',id:null},effort:'high'}},verification:[],safety_ceiling_reached:false,blockers:[]};
 const review={schema_version:'1.0.0',request_id:'r1',source_sha:'a'.repeat(40),artifact_digest:artifactHash([artifact]),executor_agent_id:'worker',reviewer_agent_id:'independent',reviewer_model_binding:{binding:'inherited',id:null},runtime_session_id:'actual-session',tool_signature:'actual-tool',reviewer_effort:'high',review_mode:'independent-agent',primary_sources_reviewed:true,reviewed_refs:[domain,requirement,artifact],requirement_results:[{ref:requirement,status:'accepted'}],findings:[],verdict:'accepted'};
 return {decision,reviewReceipts:[review],verificationReceipts:[],expectedArtifactDigest:artifactHash([artifact])};
}
function run(f){assert.equal(typeof api.validateExecutionAcceptance,'function','independent acceptance gate must exist');return api.validateExecutionAcceptance(f);}
test('matching independent review of complete actual sources can be formally accepted',()=>assert.equal(run(fixture()).status,'accepted'));
test('PASS tests cannot replace substantive independent review',()=>{const f=fixture();f.reviewReceipts=[];f.verificationReceipts=[{schema_version:'1.0.0',request_id:'r1',source_sha:'a'.repeat(40),workflow_sha:null,target:'local',workload_results:[],conclusion:'success',evidence_refs:[]}];assert.equal(run(f).status,'blocked');});
test('same agent, stale source/artifact, substituted reviewer, missing requirement or source review all reject',()=>{
 const changes=[{reviewer_agent_id:'worker'},{executor_agent_id:'other'},{source_sha:'b'.repeat(40)},{artifact_digest:'d'.repeat(64)},{reviewer_model_binding:{binding:'explicit',id:'injected-model'}},{reviewer_effort:'low'},{requirement_results:[]},{reviewed_refs:[]},{primary_sources_reviewed:false},{findings:[{id:'f1',status:'open',message:'unresolved'}]},{verdict:'changes-required'},{schema_version:'2.0.0'}];
 for(const change of changes){const f=fixture();Object.assign(f.reviewReceipts[0],change);assert.equal(run(f).status,'blocked',JSON.stringify(change));}
});
test('malformed receipts reject explicitly and never default to PASS',()=>{for(const receipt of [null,{},'PASS',{verdict:'accepted'}]){const f=fixture();f.reviewReceipts=[receipt];const result=run(f);assert.equal(result.status,'blocked');assert.equal(result.blockers.some(b=>b.code==='EXECUTION_RECEIPT_INVALID'),true);}});
test('local-only workload must have matching local successful evidence',()=>{
 const f=fixture();f.decision.input_refs={installed_skills_root:ref('input.json')};f.reviewReceipts[0].reviewed_refs.push(f.decision.input_refs.installed_skills_root);f.decision.verification=[{input_names:['installed_skills_root'],input_digest:inputHash(f.decision.input_refs),id:'installed-skills',portability:'local-only',target:'local',signature:'d'.repeat(64),limits:{concurrency:2,timeout_minutes:30,max_heavy_batches:1}}];assert.equal(run(f).status,'blocked');
 const v={artifact_digest:f.expectedArtifactDigest,schema_version:'1.0.0',request_id:'r1',source_sha:'a'.repeat(40),workflow_sha:null,target:'local',workload_results:[{id:'installed-skills',signature:'d'.repeat(64),input_digest:inputHash(f.decision.input_refs),status:'success',exit_code:0}],conclusion:'success',evidence_refs:[ref('evidence.txt')]};f.verificationReceipts=[v];assert.equal(run(f).status,'accepted');
 for(const change of [{target:'github-hosted',workflow_sha:'a'.repeat(40)},{source_sha:'b'.repeat(40)},{workload_results:[]},{conclusion:'failure'}]){f.verificationReceipts=[{...v,...change}];assert.equal(run(f).status,'blocked');}
});
test('blocked or edited incomplete decisions cannot bypass the gate',()=>{for(const change of [{status:'blocked'},{review:null},{requirement_refs:[]},{executor:null},{domain_status:'paused'}]){const f=fixture();Object.assign(f.decision,change);assert.equal(run(f).status,'blocked');}});

test('unbound decision cannot accept an asserted executor identity',()=>{const f=fixture();f.decision.executor_agent_id=null;assert.equal(run(f).status,'blocked');});

test('actual artifact is mandatory even after executor binding',()=>{const f=fixture();f.decision.artifact_refs=[];assert.equal(run(f).status,'blocked');});
test('mechanical acceptance still needs qualified independent direct source review',()=>{const f=fixture();f.decision.review.mode='independent-source-check';f.decision.review.reviewer=f.decision.executor;Object.assign(f.reviewReceipts[0],{review_mode:'independent-source-check',reviewer_model_binding:f.decision.executor.selected_model,reviewer_effort:f.decision.executor.effort});assert.equal(run(f).status,'accepted');f.reviewReceipts[0].reviewer_agent_id='worker';assert.equal(run(f).status,'blocked');});

test('artifact aggregate must describe actual decision refs',()=>{const f=fixture();f.decision.artifact_refs[0].digest='d'.repeat(64);assert.equal(run(f).status,'blocked');});
test('local-only evidence is bound to reviewed artifact and named input bytes',()=>{
 const f=fixture();f.decision.input_refs={installed_skills_root:ref('input.json')};f.decision.verification=[{id:'installed-skills',portability:'local-only',target:'local',signature:'d'.repeat(64),input_names:['installed_skills_root'],input_digest:inputHash(f.decision.input_refs),limits:{concurrency:2,timeout_minutes:30,max_heavy_batches:1}}];f.reviewReceipts[0].reviewed_refs.push(f.decision.input_refs.installed_skills_root);
 const v={schema_version:'1.0.0',request_id:'r1',source_sha:f.decision.source_sha,workflow_sha:null,target:'local',artifact_digest:f.expectedArtifactDigest,workload_results:[{id:'installed-skills',signature:'d'.repeat(64),input_digest:inputHash(f.decision.input_refs),status:'success',exit_code:0}],conclusion:'success',evidence_refs:[ref('evidence.txt')]};f.verificationReceipts=[v];assert.equal(run(f).status,'accepted');
 for(const changes of [{artifact_digest:'f'.repeat(64)},{artifact_digest:undefined},{workload_results:[{...v.workload_results[0],input_digest:'0'.repeat(64)}]},{workload_results:[{id:'installed-skills',signature:'d'.repeat(64),status:'success',exit_code:0}]}]){f.verificationReceipts=[{...v,...changes}];assert.equal(run(f).status,'blocked');}
});

test('mechanical direct source review retains selected model, supported effort and runtime identity',()=>{const f=fixture();f.decision.review.mode='independent-source-check';f.decision.review.reviewer=f.decision.executor;f.reviewReceipts[0].review_mode='independent-source-check';assert.equal(run(f).status,'accepted');for(const change of [{reviewer_model_binding:{binding:'explicit',id:'other'}},{reviewer_effort:'medium'},{runtime_session_id:'stale-session'},{tool_signature:'stale-tool'},{reviewer_agent_id:'worker'}]){const g=structuredClone(f);Object.assign(g.reviewReceipts[0],change);assert.equal(run(g).status,'blocked');}});

test('changed named input refs invalidate stale selected input digest before receipt acceptance',()=>{const f=fixture();f.decision.input_refs={installed_skills_root:ref('input.json')};f.decision.verification=[{id:'installed-skills',portability:'local-only',target:'local',signature:'d'.repeat(64),input_names:['installed_skills_root'],input_digest:inputHash(f.decision.input_refs),limits:{concurrency:2,timeout_minutes:30,max_heavy_batches:1}}];f.decision.input_refs.installed_skills_root.digest='f'.repeat(64);assert.equal(run(f).status,'blocked');assert.ok(run(f).blockers.some(b=>b.code==='EXECUTION_INPUT_BINDING_INVALID'));});


test('strict receipt schema compiles and requires separate cloud run identities only for cloud',async()=>{
 const {default:Ajv2020}=await import('ajv/dist/2020.js');const {readFile}=await import('node:fs/promises');
 const schema=JSON.parse(await readFile(new URL('../../schemas/execution-receipt.schema.json',import.meta.url),'utf8'));
 const validate=new Ajv2020({strict:true,allErrors:true}).compile({$defs:schema.$defs,$ref:'#/$defs/verification'});
 const cloud={schema_version:'1.0.0',request_id:'request',source_sha:'a'.repeat(40),workflow_sha:'b'.repeat(40),event_sha:'c'.repeat(40),run_id:'17',run_attempt:'2',target:'github-hosted',workload_results:[],conclusion:'failure',evidence_refs:[]};
 assert.equal(validate(cloud),true,JSON.stringify(validate.errors));
 for(const name of ['workflow_sha','event_sha','run_id','run_attempt']){const missing={...cloud};delete missing[name];assert.equal(validate(missing),false,name);}
 const local={...cloud,target:'local',workflow_sha:null};for(const name of ['event_sha','run_id','run_attempt'])delete local[name];assert.equal(validate(local),true);
 for(const name of ['event_sha','run_id','run_attempt'])assert.equal(validate({...local,[name]:cloud[name]}),false,name);
});

test('explicit selected model acceptance binds ID and rejects inherited or switched review',()=>{const f=fixture();const binding={binding:'explicit',id:'user-selected-model'};f.decision.executor.selected_model=binding;f.decision.review.reviewer.selected_model=binding;f.reviewReceipts[0].reviewer_model_binding=binding;assert.equal(run(f).status,'accepted');for(const other of [{binding:'inherited',id:null},{binding:'explicit',id:'other-model'}]){const g=structuredClone(f);g.reviewReceipts[0].reviewer_model_binding=other;assert.equal(run(g).status,'blocked');}});


async function localConcurrencyFixture(choice, id='docs-scoped') {
 const {loadExecutionPolicy}=await import('../../scripts/lib/execution-policy.mjs');
 const {deriveVerificationWorkload,workloadSignature}=await import('../../scripts/lib/verification-concurrency.mjs');
 const {fileURLToPath}=await import('node:url');
 const policy=await loadExecutionPolicy({repoRoot:fileURLToPath(new URL('../..',import.meta.url))});
 const source=policy.workloads.find(w=>w.id===id);
 const effective=deriveVerificationWorkload({policy,workload:source,target:'local',testConcurrency:choice});
 const f=fixture();
 f.decision.verification=[{id,portability:source.portability,target:'local',signature:workloadSignature(effective),input_names:[],input_digest:null,limits:effective.limits}];
 f.verificationReceipts=[{schema_version:'1.0.0',request_id:f.decision.request_id,source_sha:f.decision.source_sha,workflow_sha:null,target:'local',workload_results:[{id,signature:f.decision.verification[0].signature,test_concurrency:choice,status:'success',exit_code:0}],conclusion:'success',evidence_refs:[ref('actual-local-evidence.json')]}];
 return f;
}
for(const id of ['docs-scoped','repository-full','visual-fixtures'])for(const choice of [2,4])test(`local ${id} receipt reports and matches frozen concurrency ${choice}`,async()=>{
 const f=await localConcurrencyFixture(choice,id);assert.equal(run(f).status,'accepted');
 const changed=structuredClone(f);changed.verificationReceipts[0].workload_results[0].test_concurrency=choice===2?4:2;
 const result=run(changed);assert.equal(result.status,'blocked');assert.ok(result.blockers.some(b=>b.code==='EXECUTION_VERIFICATION_CONCURRENCY_MISMATCH'));
});
test('actual concurrency2 and concurrency4 receipts cannot cross frozen effective signatures',async()=>{
 const two=await localConcurrencyFixture(2),four=await localConcurrencyFixture(4);
 for(const [decisionFixture,receiptFixture] of [[two,four],[four,two]])assert.equal(run({...decisionFixture,verificationReceipts:receiptFixture.verificationReceipts}).status,'blocked');
 const forged=structuredClone(four);forged.verificationReceipts[0].workload_results[0].signature=two.decision.verification[0].signature;
 assert.equal(run(forged).status,'blocked');
});
test('legacy missing mapped concurrency means2 only after matching old identity and signature guards',async()=>{
 const two=await localConcurrencyFixture(2);delete two.verificationReceipts[0].workload_results[0].test_concurrency;
 const unchanged=JSON.stringify(two.verificationReceipts[0]);assert.equal(run(two).status,'accepted');assert.equal(JSON.stringify(two.verificationReceipts[0]),unchanged);
 for(const change of [{request_id:'other'},{source_sha:'f'.repeat(40)},{target:'github-hosted',workflow_sha:'a'.repeat(40),event_sha:'a'.repeat(40),run_id:'17',run_attempt:'1'},{workload_results:[{...two.verificationReceipts[0].workload_results[0],signature:'f'.repeat(64)}]}])assert.equal(run({...two,verificationReceipts:[{...two.verificationReceipts[0],...change}]}).status,'blocked');
 const four=await localConcurrencyFixture(4);delete four.verificationReceipts[0].workload_results[0].test_concurrency;const result=run(four);assert.equal(result.status,'blocked');assert.ok(result.blockers.some(b=>b.code==='EXECUTION_VERIFICATION_CONCURRENCY_MISMATCH'));
});
test('acceptance uses the resolved choice without reading changed profile or rewriting the decision',async()=>{
 const f=await localConcurrencyFixture(4),before=JSON.stringify(f.decision);const result=api.validateExecutionAcceptance({...f,get profile(){throw new Error('acceptance reread saved preference');}});
 assert.equal(result.status,'accepted');assert.equal(JSON.stringify(f.decision),before);
 const changed=structuredClone(f);changed.verificationReceipts[0].workload_results[0].test_concurrency=2;assert.equal(run(changed).status,'blocked');
});
test('concurrency fields remain forbidden on cloud rows nonmapped rows and receipt root',async()=>{
 const f=await localConcurrencyFixture(2),row=f.verificationReceipts[0].workload_results[0];
 for(const value of [1,3,8,'4',null])assert.equal(run({...f,verificationReceipts:[{...f.verificationReceipts[0],workload_results:[{...row,test_concurrency:value}]}]}).status,'blocked');
 const rootField=structuredClone(f);rootField.verificationReceipts[0].test_concurrency=2;assert.equal(run(rootField).status,'blocked');
 const cloud=structuredClone(f);Object.assign(cloud.verificationReceipts[0],{target:'github-hosted',workflow_sha:'a'.repeat(40),event_sha:'a'.repeat(40),run_id:'17',run_attempt:'1'});cloud.decision.verification[0].target='github-hosted';assert.equal(run(cloud).status,'blocked');
 const nonmapped=structuredClone(f);nonmapped.decision.verification[0].id='windows-bootstrap';nonmapped.verificationReceipts[0].workload_results[0].id='windows-bootstrap';assert.equal(run(nonmapped).status,'blocked');
});
