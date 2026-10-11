import test from 'node:test';
import assert from 'node:assert/strict';
const api=await import('../../scripts/lib/execution-receipt.mjs').catch(()=>({}));
const ref=(path)=>({path,digest:'a'.repeat(64)});
function fixture(){
 const domain=ref('domain.json'),requirement=ref('requirement.txt'),artifact=ref('artifact.txt');
 const decision={schema_version:'1.0.0',status:'resolved',domain_status:'resolved',request_id:'r1',source_sha:'a'.repeat(40),policy_digest:'b'.repeat(64),route:'maintenance',mode:'write',operation:'write',allowed_paths:['docs/change.md'],executor_agent_id:'worker',domain_context_ref:domain,requirement_refs:[requirement],artifact_refs:[artifact],base_tier:2,target_tier:3,executor:{tier:3,model:'gpt-6.1-sol',effort:'high'},review:{required:true,mode:'independent-agent',distinct_agent_required:true,primary_sources_required:true,all_requirements_required:true,reviewer:{tier:4,model:'gpt-6-astra',effort:'high'}},verification:[],safety_ceiling_reached:false,blockers:[]};
 const review={schema_version:'1.0.0',request_id:'r1',source_sha:'a'.repeat(40),artifact_digest:'c'.repeat(64),executor_agent_id:'worker',reviewer_agent_id:'independent',reviewer_model:'gpt-6-astra',reviewer_effort:'high',review_mode:'independent-agent',primary_sources_reviewed:true,reviewed_refs:[domain,requirement,artifact],requirement_results:[{ref:requirement,status:'accepted'}],findings:[],verdict:'accepted'};
 return {decision,reviewReceipts:[review],verificationReceipts:[],expectedArtifactDigest:'c'.repeat(64)};
}
function run(f){assert.equal(typeof api.validateExecutionAcceptance,'function','independent acceptance gate must exist');return api.validateExecutionAcceptance(f);}
test('matching independent review of complete actual sources can be formally accepted',()=>assert.equal(run(fixture()).status,'accepted'));
test('PASS tests cannot replace substantive independent review',()=>{const f=fixture();f.reviewReceipts=[];f.verificationReceipts=[{schema_version:'1.0.0',request_id:'r1',source_sha:'a'.repeat(40),workflow_sha:null,target:'local',workload_results:[],conclusion:'success',evidence_refs:[]}];assert.equal(run(f).status,'blocked');});
test('same agent, stale source/artifact, substituted reviewer, missing requirement or source review all reject',()=>{
 const changes=[{reviewer_agent_id:'worker'},{executor_agent_id:'other'},{source_sha:'b'.repeat(40)},{artifact_digest:'d'.repeat(64)},{reviewer_model:'injected-model'},{reviewer_effort:'low'},{requirement_results:[]},{reviewed_refs:[]},{primary_sources_reviewed:false},{findings:[{id:'f1',status:'open',message:'unresolved'}]},{verdict:'changes-required'},{schema_version:'2.0.0'}];
 for(const change of changes){const f=fixture();Object.assign(f.reviewReceipts[0],change);assert.equal(run(f).status,'blocked',JSON.stringify(change));}
});
test('malformed receipts reject explicitly and never default to PASS',()=>{for(const receipt of [null,{},'PASS',{verdict:'accepted'}]){const f=fixture();f.reviewReceipts=[receipt];const result=run(f);assert.equal(result.status,'blocked');assert.equal(result.blockers.some(b=>b.code==='EXECUTION_RECEIPT_INVALID'),true);}});
test('local-only workload must have matching local successful evidence',()=>{
 const f=fixture();f.decision.verification=[{id:'installed-skills',portability:'local-only',target:'local',signature:'d'.repeat(64),limits:{concurrency:2,timeout_minutes:30,max_heavy_batches:1}}];assert.equal(run(f).status,'blocked');
 const v={schema_version:'1.0.0',request_id:'r1',source_sha:'a'.repeat(40),workflow_sha:null,target:'local',workload_results:[{id:'installed-skills',signature:'d'.repeat(64),status:'success',exit_code:0}],conclusion:'success',evidence_refs:[ref('evidence.txt')]};f.verificationReceipts=[v];assert.equal(run(f).status,'accepted');
 for(const change of [{target:'github-hosted',workflow_sha:'a'.repeat(40)},{source_sha:'b'.repeat(40)},{workload_results:[]},{conclusion:'failure'}]){f.verificationReceipts=[{...v,...change}];assert.equal(run(f).status,'blocked');}
});
test('blocked or edited incomplete decisions cannot bypass the gate',()=>{for(const change of [{status:'blocked'},{review:null},{requirement_refs:[]},{executor:null},{domain_status:'paused'}]){const f=fixture();Object.assign(f.decision,change);assert.equal(run(f).status,'blocked');}});
