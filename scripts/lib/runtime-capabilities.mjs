import Ajv2020 from 'ajv/dist/2020.js';
import schema from '../../schemas/runtime-capabilities.schema.json' with {type:'json'};
const validate=new Ajv2020({strict:true,allErrors:true}).compile(schema);
const typedCodes=new Set(['MODEL_UNAVAILABLE','EFFORT_UNAVAILABLE','CAPABILITY_UNAVAILABLE']);
export function validateRuntimeCapabilities(value){return validate(value)&&new Set(value.models.map(x=>x.id)).size===value.models.length;}
// Coordinator adapter only: never discovers models, reads auth/cache files or starts agents.
// Cache lifetime is the caller's chat/account lifetime; create a new cache on account change.
export function createRuntimeCapabilityCache(){
 const snapshots=new Map(),attempts=new Set();
 const key=x=>JSON.stringify([x.runtime_session_id,x.tool_signature]);
 const candidateKey=x=>JSON.stringify([x.runtime_session_id,x.tool_signature,x.model,x.effort]);
 const candidateExists=(snapshot,x)=>snapshot?.models.some(m=>m.id===x.model&&m.efforts.includes(x.effort));
 return {
  get({runtime_session_id,tool_signature,read}) {
   const id=key({runtime_session_id,tool_signature});
   if(!snapshots.has(id)){const value=read();if(!validateRuntimeCapabilities(value)||value.runtime_session_id!==runtime_session_id||value.tool_signature!==tool_signature)throw Object.assign(new Error('Invalid declared-tool snapshot.'),{code:'MODEL_ROLE_UNAVAILABLE'});snapshots.set(id,structuredClone(value));}
   return structuredClone(snapshots.get(id));
  },
  beginAttempt(candidate){const id=candidateKey(candidate);if(!candidateExists(snapshots.get(key(candidate)),candidate)||attempts.has(id))return false;attempts.add(id);return true;},
  recordRefusal(refusal){const snapshot=snapshots.get(key(refusal));if(!typedCodes.has(refusal.code)||!attempts.has(candidateKey(refusal))||!candidateExists(snapshot,refusal))return false;
   snapshot.refusals??=[];if(!snapshot.refusals.some(x=>candidateKey(x)===candidateKey(refusal)))snapshot.refusals.push({runtime_session_id:refusal.runtime_session_id,tool_signature:refusal.tool_signature,model:refusal.model,effort:refusal.effort,code:refusal.code});return true;
  }
 };
}
