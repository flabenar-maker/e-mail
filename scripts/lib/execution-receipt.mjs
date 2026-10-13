import {sameSelectedModel} from './runtime-capabilities.mjs';
import Ajv2020 from 'ajv/dist/2020.js';
import schema from '../../schemas/execution-receipt.schema.json' with {type:'json'};
import {isResolvedExecutionDecision,artifactDigest,workloadInputDigest} from './execution-context.mjs';
const ajv=new Ajv2020({strict:true,allErrors:true});
const {$defs}=schema;
const reviewValid=ajv.compile({$defs,$ref:'#/$defs/review'});
const verificationValid=ajv.compile({$defs,$ref:'#/$defs/verification'});
const key=ref=>JSON.stringify([ref.path,ref.digest]);
// This gate verifies identity and coverage, not truthfulness. A qualified real independent
// reviewer must read the original requirement and complete actual result before attesting.
export function validateExecutionAcceptance({decision,reviewReceipts,verificationReceipts,expectedArtifactDigest}){
 const blockers=[],evidence_refs=[];
 const reject=(code,message)=>blockers.push({code,path:'/',message});
 const finish=()=>({status:blockers.length?'blocked':'accepted',request_id:typeof decision?.request_id==='string'?decision.request_id:null,blockers,evidence_refs,local_offer:null});
 if(!isResolvedExecutionDecision(decision)||!decision.executor_agent_id||!decision.artifact_refs.length||!sameSelectedModel(decision.executor.selected_model,decision.review.reviewer.selected_model)||decision.executor.effort!==decision.review.reviewer.effort){reject('EXECUTION_DECISION_INVALID','Acceptance requires a resolved domain decision bound to the actual executor agent.');return finish();}
 if(!/^[a-f0-9]{64}$/u.test(expectedArtifactDigest??'')){reject('EXECUTION_ARTIFACT_INVALID','Expected actual artifact digest is required.');return finish();}
 if(artifactDigest(decision.artifact_refs)!==expectedArtifactDigest){reject('EXECUTION_ARTIFACT_MISMATCH','Expected artifact digest must describe the actual decision artifact references.');return finish();}
 for(const workload of decision.verification){
  const names=workload.input_names??[];
  if((workload.portability==='local-only'&&!names.length)||names.some(name=>!Object.hasOwn(decision.input_refs??{},name))||(names.length&&workloadInputDigest(Object.fromEntries(names.map(name=>[name,decision.input_refs[name]])))!==workload.input_digest)||(!names.length&&workload.input_digest!=null)){reject('EXECUTION_INPUT_BINDING_INVALID','Consuming workloads require complete named input references and their recomputed digest.');return finish();}
 }
 if(!Array.isArray(reviewReceipts)||!Array.isArray(verificationReceipts)){reject('EXECUTION_RECEIPT_INVALID','Receipt collections must be arrays.');return finish();}
 if(reviewReceipts.length===0)reject('EXECUTION_REVIEW_REQUIRED','A passing test is not independent substantive acceptance.');
 const requiredRefs=[decision.domain_context_ref,...decision.requirement_refs,...decision.artifact_refs,...Object.values(decision.input_refs??{})];
 for(const receipt of reviewReceipts){
  if(!reviewValid(receipt)){reject('EXECUTION_RECEIPT_INVALID','Review receipt does not match schema 1.0.0.');continue;}
  if(receipt.request_id!==decision.request_id||receipt.source_sha!==decision.source_sha||receipt.artifact_digest!==expectedArtifactDigest)reject('EXECUTION_REVIEW_IDENTITY_MISMATCH','Review is stale or belongs to a different request, source or artifact.');
  if(receipt.executor_agent_id!==decision.executor_agent_id||receipt.reviewer_agent_id===decision.executor_agent_id)reject('EXECUTION_REVIEW_NOT_INDEPENDENT','Reviewer must be distinct from the actual bound executor.');
  const role=decision.review.reviewer;
  if(!sameSelectedModel(receipt.reviewer_model_binding,role.selected_model)||receipt.reviewer_effort!==role.effort||receipt.review_mode!==decision.review.mode||receipt.runtime_session_id!==decision.runtime_identity.runtime_session_id||receipt.tool_signature!==decision.runtime_identity.tool_signature)reject('EXECUTION_REVIEW_ROLE_MISMATCH','Reviewer selected-model binding, supported effort, runtime and mode must match the resolved role.');
  const read=new Set(receipt.reviewed_refs.map(key)),results=new Map(receipt.requirement_results.map(x=>[key(x.ref),x.status]));
  if(!receipt.primary_sources_reviewed||requiredRefs.some(ref=>!read.has(key(ref))))reject('EXECUTION_REVIEW_SOURCE_MISSING','Reviewer must inspect complete domain, requirements and actual artifact references.');
  if(results.size!==receipt.requirement_results.length||results.size!==decision.requirement_refs.length||decision.requirement_refs.some(ref=>results.get(key(ref))!=='accepted'))reject('EXECUTION_REVIEW_COVERAGE_MISSING','Every requirement needs an explicit accepted result.');
  if(receipt.verdict!=='accepted'||receipt.findings.some(x=>x.status!=='resolved'))reject('EXECUTION_REVIEW_UNRESOLVED','Review verdict or unresolved findings prevent acceptance.');
  evidence_refs.push(...receipt.reviewed_refs);
 }
 const covered=new Set();
 for(const receipt of verificationReceipts){
  if(!verificationValid(receipt)){reject('EXECUTION_RECEIPT_INVALID','Verification receipt does not match schema 1.0.0.');continue;}
  if(receipt.request_id!==decision.request_id||receipt.source_sha!==decision.source_sha){reject('EXECUTION_VERIFICATION_IDENTITY_MISMATCH','Verification must identify the exact source and request.');continue;}
  if(receipt.target==='github-hosted'&&!receipt.workflow_sha)reject('EXECUTION_VERIFICATION_IDENTITY_MISMATCH','Cloud evidence must identify its workflow source.');
  if(receipt.conclusion!=='success')reject('EXECUTION_VERIFICATION_FAILED','Verification did not complete successfully.');
  const ids=new Set();
  for(const result of receipt.workload_results){
   const expected=decision.verification.find(x=>x.id===result.id);
   if(!expected||ids.has(result.id)){reject('EXECUTION_VERIFICATION_SCOPE_MISMATCH','Receipt contains an unknown or duplicate workload.');continue;}ids.add(result.id);
   if(result.signature!==expected.signature||receipt.target!==expected.target||(expected.portability==='local-only'&&receipt.target!=='local')){reject('EXECUTION_VERIFICATION_SCOPE_MISMATCH','Target and workload signature must match the decision.');continue;}
   // Frozen mapped local rows compare the actual reported value as well as the effective signature.
   // A missing legacy field means2 only after the existing request/source/target/signature guards.
   if(receipt.target==='local'&&['docs-scoped','repository-full','visual-fixtures'].includes(result.id)&&(result.test_concurrency??2)!==expected.limits.concurrency){reject('EXECUTION_VERIFICATION_CONCURRENCY_MISMATCH','Actual local test concurrency must match the frozen workload decision; local4 requires an explicit4 receipt field.');continue;}
   if((expected.portability==='local-only'||expected.input_names?.length)&&(receipt.artifact_digest!==expectedArtifactDigest||result.input_digest!==expected.input_digest)){reject('EXECUTION_VERIFICATION_INPUT_MISMATCH','Consuming verification must bind the actual artifact and named input digest.');continue;}
   if(result.status!=='success'||result.exit_code!==0||!receipt.evidence_refs.length||receipt.conclusion!=='success'){reject('EXECUTION_VERIFICATION_FAILED','Workload requires successful exit and actual evidence references.');continue;}
   covered.add(result.id);
  }
  evidence_refs.push(...receipt.evidence_refs);
 }
 if(decision.verification.some(x=>!covered.has(x.id)))reject('EXECUTION_VERIFICATION_MISSING','Every required workload needs matching successful evidence, including local-only scopes.');
 return finish();
}
