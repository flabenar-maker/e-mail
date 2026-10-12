import {validateRuntimeCapabilities,sameSelectedModel} from './runtime-capabilities.mjs';
// Pure effort evaluation on the user's selected model. No discovery or model ranking.
const blocker=(code,path,message)=>({code,path,message});
const nonempty=value=>typeof value==='string'&&value.trim().length>0;
function scopePath(path){
 if(!nonempty(path))return null;const normalized=path.replaceAll('\\','/').toLowerCase();
 if(normalized.startsWith('/')||/[:<>"|\x00-\x1f]/u.test(normalized)||normalized.split('/').some(part=>part==='..'||part==='.'||part===''||/[. ]$/u.test(part)||/~[0-9]/u.test(part)||/^(?:con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)/u.test(part)))return null;return normalized;
}
function criticalScope(paths,rule){return paths.some(path=>(rule.wildcard_scope_is_critical&&/[*?\[\]{}]/u.test(path))||rule.prefixes.some(prefix=>path===prefix.replace(/\/$/u,'')||path.startsWith(prefix))||rule.basenames.includes(path.split('/').at(-1))||rule.path_fragments.some(fragment=>path.includes(fragment))||rule.scoped_fragments.some(scope=>path.startsWith(scope.prefix)&&scope.fragments.some(fragment=>path.includes(fragment))));}
export function selectEffort({policy,taskKind,operation,allowedPaths,capabilities}){
 const result={status:'blocked',base_effort:null,target_effort:null,executor:null,review:null,safety_ceiling_reached:false,blockers:[]};
 const blocked=(code,path,message)=>({...result,blockers:[blocker(code,path,message)]});
 const rule=Object.hasOwn(policy.task_kinds,taskKind)?policy.task_kinds[taskKind]:null;
 if(!rule)return blocked('EXECUTION_TASK_KIND_UNKNOWN','/task_kind','Task kind is not registered in execution policy.');
 if(!['read','write'].includes(operation)||!Array.isArray(allowedPaths)||(operation==='write'&&!allowedPaths.length)||(rule.mechanical&&operation==='write'))return blocked('EXECUTION_TASK_KIND_SCOPE_MISMATCH','/operation','Task kind, operation and writable scope do not agree.');
 const paths=allowedPaths.map(scopePath);if(paths.some(path=>path===null))return blocked('EXECUTION_TASK_KIND_SCOPE_MISMATCH','/allowed_paths','Scope must contain explicit repository-relative paths without traversal.');
 if(!validateRuntimeCapabilities(capabilities)||capabilities.source!==policy.runtime_capabilities.source)return blocked('EXECUTION_RUNTIME_INVALID','/capabilities','Actual runtime selection and supported effort attestation are required.');
 const order=policy.effort_order,base=Math.max(order.indexOf(rule.base_effort),operation==='write'&&criticalScope(paths,policy.critical_mutations)?order.indexOf(policy.critical_mutations.minimum_base_effort):0);result.base_effort=order[base];
 const required=[...new Set([...rule.required_capabilities,...policy.operation_capabilities[operation]])];
 if(!required.every(capability=>capabilities.capabilities.includes(capability)))return blocked('CAPABILITY_UNAVAILABLE','/capabilities','The selected runtime lacks required task capabilities.');
 const refusals=(capabilities.refusals??[]).filter(x=>x.runtime_session_id===capabilities.runtime_session_id&&x.tool_signature===capabilities.tool_signature&&sameSelectedModel(x.selected_model,capabilities.selected_model));
 const terminal=refusals.find(x=>['MODEL_UNAVAILABLE','CAPABILITY_UNAVAILABLE'].includes(x.code));if(terminal)return blocked(terminal.code,'/executor','Actual selected-model rejection prevents this role; another model is not substituted.');
 const supported=capabilities.supported_efforts;
 const baseline=supported.findIndex(effort=>order.indexOf(effort)>=base);
 if(baseline<0)return blocked('EFFORT_UNAVAILABLE','/executor','The selected model has no supported effort at the task floor.');
 const target=Math.min(baseline+policy.safety_steps,supported.length-1);result.target_effort=supported[target];
 const refused=new Set(refusals.filter(x=>x.code==='EFFORT_UNAVAILABLE').map(x=>x.effort));
 const effort=supported.slice(target).find(value=>!refused.has(value));if(!effort)return blocked('EFFORT_UNAVAILABLE','/executor','No remaining supported effort meets the quality cushion on the selected model.');
 result.executor={selected_model:structuredClone(capabilities.selected_model),effort};result.safety_ceiling_reached=effort===supported.at(-1);
 result.review={required:true,mode:rule.mechanical?policy.review.mechanical_mode:policy.review.semantic_mode,distinct_agent_required:true,primary_sources_required:true,all_requirements_required:true,reviewer:structuredClone(result.executor)};
 return {...result,status:'resolved'};
}
