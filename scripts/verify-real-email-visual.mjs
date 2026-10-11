import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {readBoundInventory,readImageBytes,inputFailure} from './lib/execution-inputs.mjs';
import {readExecutionRef,workloadInputDigest} from './lib/execution-context.mjs';
import {validateDocumentShape} from './lib/schema-validation.mjs';
import emailSchema from '../schemas/email-model.schema.json' with {type:'json'};
const identifier=value=>typeof value==='string'&&value.trim()===value&&value.length>0&&value.length<=200&&!/[\x00-\x1f]/u.test(value);
// This verifies formal evidence binding. It cannot replace actual rendering or visual review.
export async function verifyRealEmailVisual({inputRefs,referenceRoot,inputRoots,identity,reviewQualification}={}){
 if(!inputRefs||!referenceRoot||!inputRoots||!identity||!reviewQualification)throw inputFailure('VISUAL_EVIDENCE_MISSING','Bound model, reference/rendered image inventories and qualified independent review are required.');
 const q=reviewQualification;
 if(!identifier(identity.request_id)||!/^[a-f0-9]{40}$/u.test(identity.source_sha??'')||!/^[a-f0-9]{64}$/u.test(identity.artifact_digest??''))throw inputFailure('VISUAL_REVIEW_INVALID','Exact request, source and artifact identities are mandatory.');
 if(!identifier(q.executor_agent_id)||!identifier(q.reviewer_agent_id)||q.executor_agent_id===q.reviewer_agent_id||!identifier(q.model)||!identifier(q.effort)||!Array.isArray(q.capabilities)||new Set(q.capabilities).size!==q.capabilities.length||q.capabilities.some(c=>!identifier(c))||!q.capabilities.includes('vision'))throw inputFailure('VISUAL_REVIEW_INVALID','Coordinator-selected qualification requires distinct actual agent IDs, model, effort and a capability array including vision.');
 const inventories={};for(const name of ['email_model','reference_manifest','evidence_root']){
  if(!inputRefs[name]||!inputRoots[name])throw inputFailure('VISUAL_EVIDENCE_MISSING','All three bound inventories and local roots are required.');
  inventories[name]=await readBoundInventory({ref:inputRefs[name],referenceRoot,root:inputRoots[name],kind:name});
 }
 if(inventories.email_model.inventory.files.length!==1)throw inputFailure('VISUAL_EVIDENCE_UNSUPPORTED','Exactly one model file is required.');
 const model=JSON.parse(await readExecutionRef({referenceRoot:inputRoots.email_model,ref:inventories.email_model.inventory.files[0]}));
 if(validateDocumentShape({document:model,schema:emailSchema,supportedVersion:'1.1.0',versionCode:'email-model-version-unsupported',schemaCode:'email-model-schema'}).length)throw inputFailure('VISUAL_EVIDENCE_UNSUPPORTED','Email model must match the canonical email-model schema.');
 const reference= inventories.reference_manifest.inventory,rendered=inventories.evidence_root.inventory;
 if(!reviewQualification.review_ref)throw inputFailure('VISUAL_EVIDENCE_MISSING','An independently bound visual-review attestation is required.');
 const reviewed=[];for(const [name,inventory] of [['reference_manifest',reference],['evidence_root',rendered]])for(const ref of inventory.files){await readImageBytes(inputRoots[name],ref);reviewed.push({input:name,...ref});}
 let review;try{review=JSON.parse(await readExecutionRef({referenceRoot,ref:reviewQualification.review_ref}));}catch{throw inputFailure('VISUAL_EVIDENCE_MISSING','Bound visual-review attestation is unavailable or changed.');}
 if(!review||typeof review!=='object'||Array.isArray(review)||Object.keys(review).sort().join(',')!==['schema_version','request_id','source_sha','artifact_digest','input_digest','executor_agent_id','reviewer_agent_id','reviewer_model','reviewer_effort','primary_sources_reviewed','verdict','reviewed_model','reviewed_images','results'].sort().join(','))throw inputFailure(review&&review.reviewed_model===undefined?'VISUAL_REVIEW_INCOMPLETE':'VISUAL_REVIEW_INVALID','Visual review requires the complete strict attestation shape.');
 if(review.schema_version!=='1.0.0'||review.request_id!==identity.request_id||review.source_sha!==identity.source_sha||review.artifact_digest!==identity.artifact_digest||review.input_digest!==workloadInputDigest(inputRefs)||!identifier(review.executor_agent_id)||!identifier(review.reviewer_agent_id)||!identifier(review.reviewer_model)||!identifier(review.reviewer_effort)||review.executor_agent_id!==q.executor_agent_id||review.reviewer_agent_id!==q.reviewer_agent_id||review.reviewer_model!==q.model||review.reviewer_effort!==q.effort||review.primary_sources_reviewed!==true||review.verdict!=='accepted')throw inputFailure('VISUAL_REVIEW_INVALID','Visual review must match exact inputs, artifact and selected qualified independent reviewer.');
 const modelRef=inventories.email_model.inventory.files[0];if(review.reviewed_model?.input!=='email_model'||review.reviewed_model.path!==modelRef.path||review.reviewed_model.digest!==modelRef.digest)throw inputFailure('VISUAL_REVIEW_INCOMPLETE','Reviewer must explicitly inspect the actual canonical model.');
 const key=x=>JSON.stringify([x.input,x.path,x.digest]);if(!Array.isArray(review.reviewed_images)||review.reviewed_images.length!==reviewed.length||new Set(review.reviewed_images.map(key)).size!==reviewed.length||reviewed.some(x=>!review.reviewed_images.some(y=>key(x)===key(y))))throw inputFailure('VISUAL_REVIEW_INCOMPLETE','Reviewer must inspect every actual reference and rendered image.');
 for(const category of ['geometry','layout','spacing','visibility','image','text'])if(review.results?.[category]!=='accepted')throw inputFailure('VISUAL_REVIEW_INCOMPLETE','Each visual regression category requires explicit acceptance.');
 return {status:'success',formal_evidence_only:true,reviewer_agent_id:review.reviewer_agent_id,fresh_inventories:Object.fromEntries(Object.entries(inventories).map(([k,v])=>[k,v.fresh]))};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{
 if(!process.env.CUPIS_VERIFICATION_CONTEXT)throw inputFailure('VISUAL_EVIDENCE_MISSING','Expected private runner context.');
 const context=JSON.parse(await readFile(process.env.CUPIS_VERIFICATION_CONTEXT,'utf8'));
 const expected=['--model',resolve(context.referenceRoot,context.inputRefs.email_model.path),'--references',resolve(context.referenceRoot,context.inputRefs.reference_manifest.path),'--evidence-inventory',resolve(context.referenceRoot,context.inputRefs.evidence_root.path)];
 if(JSON.stringify(process.argv.slice(2))!==JSON.stringify(expected))throw inputFailure('VISUAL_EVIDENCE_MISSING','Arguments must identify bound inventory files.');
 const result=await verifyRealEmailVisual(context);process.stdout.write(JSON.stringify(result)+'\n');
 }catch(error){process.stderr.write(JSON.stringify({code:error.code??'VISUAL_EVIDENCE_UNSUPPORTED'})+'\n');process.exitCode=1;}}
