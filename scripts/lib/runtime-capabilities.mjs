import Ajv2020 from 'ajv/dist/2020.js';
import schema from '../../schemas/runtime-capabilities.schema.json' with {type:'json'};
const validate=new Ajv2020({strict:true,allErrors:true}).compile(schema);
const effortOrder=['none','minimal','low','medium','high','xhigh','max','ultra'];
const typedCodes=new Set(['MODEL_UNAVAILABLE','EFFORT_UNAVAILABLE','CAPABILITY_UNAVAILABLE']);
export const validSelectedModel=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join(',')==='binding,id'&&((value.binding==='inherited'&&value.id===null)||(value.binding==='explicit'&&typeof value.id==='string'&&value.id.trim()===value.id&&value.id.length>0));
export const sameSelectedModel=(a,b)=>validSelectedModel(a)&&validSelectedModel(b)&&a.binding===b.binding&&a.id===b.id;
export function validateRuntimeCapabilities(value){return validate(value)&&validSelectedModel(value.selected_model)&&value.supported_efforts.every((effort,index)=>index===0||effortOrder.indexOf(effort)>effortOrder.indexOf(value.supported_efforts[index-1]))&&(value.refusals??[]).every(x=>validSelectedModel(x.selected_model));}
// Cache only actual runtime declarations. Never reads model catalogs, prices or auth files.
// A selected-model change is explicit input from the current user/runtime, never discovery.
export function createRuntimeCapabilityCache(){
 const snapshots=new Map(),attempts=new Set();
 const key=x=>JSON.stringify([x.runtime_session_id,x.tool_signature]);
 const attemptKey=x=>JSON.stringify([x.runtime_session_id,x.tool_signature,x.selected_model?.binding,x.selected_model?.id,x.effort]);
 const supportedAttempt=(snapshot,x)=>snapshot&&sameSelectedModel(snapshot.selected_model,x.selected_model)&&snapshot.supported_efforts.includes(x.effort);
 const invalidate=identity=>{const id=key(identity),removed=snapshots.delete(id);for(const attempt of attempts){const parsed=JSON.parse(attempt);if(parsed[0]===identity.runtime_session_id&&parsed[1]===identity.tool_signature)attempts.delete(attempt);}return removed;};
 return {
  // Explicit user selection events also invalidate inherited/null, whose ID stays hidden.
  invalidate,
  // Account changes discard every snapshot and active attempt before any future delegation.
  reset(){snapshots.clear();attempts.clear();},
  get({runtime_session_id,tool_signature,selected_model,read}){
   const identity={runtime_session_id,tool_signature},id=key(identity),previous=snapshots.get(id);
   if(selected_model!==undefined&&!validSelectedModel(selected_model))throw Object.assign(new Error('Invalid selected model binding.'),{code:'EXECUTION_RUNTIME_INVALID'});
   if(previous&&selected_model!==undefined&&!sameSelectedModel(previous.selected_model,selected_model)){invalidate(identity);}
   if(!snapshots.has(id)){const value=read();if(!validateRuntimeCapabilities(value)||value.runtime_session_id!==runtime_session_id||value.tool_signature!==tool_signature||(selected_model!==undefined&&!sameSelectedModel(value.selected_model,selected_model)))throw Object.assign(new Error('Invalid actual-runtime snapshot.'),{code:'EXECUTION_RUNTIME_INVALID'});snapshots.set(id,structuredClone(value));}
   return structuredClone(snapshots.get(id));
  },
  finishAttempt(attempt){const snapshot=snapshots.get(key(attempt)),id=attemptKey(attempt);if(!['success','network-error'].includes(attempt.outcome)||!attempts.has(id)||snapshot?.refusals?.some(x=>attemptKey(x)===id))return false;attempts.delete(id);return true;},
  beginAttempt(attempt){const snapshot=snapshots.get(key(attempt)),id=attemptKey(attempt);if(!supportedAttempt(snapshot,attempt)||attempts.has(id)||snapshot.refusals?.some(x=>attemptKey(x)===id))return false;attempts.add(id);return true;},
  recordRefusal(refusal){const snapshot=snapshots.get(key(refusal));if(!typedCodes.has(refusal.code)||!attempts.has(attemptKey(refusal))||!supportedAttempt(snapshot,refusal))return false;snapshot.refusals??=[];if(!snapshot.refusals.some(x=>attemptKey(x)===attemptKey(refusal)))snapshot.refusals.push({runtime_session_id:refusal.runtime_session_id,tool_signature:refusal.tool_signature,selected_model:structuredClone(refusal.selected_model),effort:refusal.effort,code:refusal.code});return true;}
 };
}
