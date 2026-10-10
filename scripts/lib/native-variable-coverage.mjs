import {createHash} from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {createContractProofEnvironment} from './contract-fact-proofs.mjs';
import {applyNativeRelationCoverage, auditNativeRelationProofs} from './native-relationship-coverage.mjs';
import {isFigmaContractFactReportFor} from './figma-contract-facts.mjs';
import {NATIVE_PAINT_COLOR_PATH, readNativePaintLocations, createNativePaintVariableVerifier} from './native-paint-variable-context.mjs';

const ID=/^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ROOT=/^[0-9]+:[0-9]+$/u;
const NODE=/^(?:[0-9]+:[0-9]+|I[0-9]+:[0-9]+(?:;[0-9]+:[0-9]+)+)$/u;
const PATH=/^\/contracts\/(?:mobile|desktop|variant_contracts\/\d+)\/root(?:\/children\/\d+)*\/facts\/\d+\/value$/u;
const FIELDS={paddingLeft:'/layout/padding/left',paddingTop:'/layout/padding/top',paddingRight:'/layout/padding/right',paddingBottom:'/layout/padding/bottom',itemSpacing:'/layout/item_spacing',topLeftRadius:'/corner_radius',topRightRadius:'/corner_radius',bottomLeftRadius:'/corner_radius',bottomRightRadius:'/corner_radius'};
const CORNERS=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
const groups=['foundation_values','source_dependencies','fact_proofs','normative_decisions','native_fact_proofs','native_relation_proofs','native_variable_proofs', 'native_context_proofs'];
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const closed=(v,keys)=>object(v)&&keys.every(k=>Object.hasOwn(v,k))&&Object.keys(v).every(k=>keys.includes(k));
const text=v=>typeof v==='string'&&!!v.trim()&&!/[\r\n]/u.test(v);
const match=(re,v)=>typeof v==='string'&&!/[\r\n]/u.test(v)&&re.test(v);
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const number=v=>finite(v)&&Math.abs(v-Math.round(v))<0.0001?Math.round(v):v;
const pointer=(root,path)=>typeof path==='string'?path.split('/').slice(1).reduce((v,k)=>v?.[k],root):undefined;
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const tuple=s=>JSON.stringify([s.component_id,s.variant_node_id,s.node_id,s.source_path]);
const computed=new WeakMap();
const issue=(code,path,message)=>({code,path,message});
const ordered=issues=>issues.sort((a,b)=>a.path.localeCompare(b.path)||a.code.localeCompare(b.code));
const variants=r=>r?.variants?.length?r.variants:[{node_id:r?.figma?.node_id,axes:[]}];
const selector=s=>closed(s,['component_id','variant_node_id','node_id'])&&match(ID,s.component_id)&&match(ROOT,s.variant_node_id)&&match(NODE,s.node_id);
function field(path,paintPath){
 if(paintPath!==undefined)return match(NATIVE_PAINT_COLOR_PATH,paintPath)&&match(/^\/variable_bindings\/(?:fills|textRangeFills)\/\d+\/id$/u,path)?{field:'paint',source_path:paintPath,type:'COLOR',paint_context:paintPath.startsWith('/fills/')?'gradient':'mixed'}:null;
 const p=/^\/variable_bindings\/([^/]+)\/id$/u.exec(path)?.[1];
 return FIELDS[p]?{field:p,source_path:FIELDS[p],type:'FLOAT'}:path==='/variable_bindings/fills/0/id'?{field:'fills',source_path:'/fills/0/color',type:'COLOR'}:null;
}
function target(record,path){
 if(!match(PATH,path))return null;
 const value=pointer(record,path),fact=pointer(record,path.replace(/\/value$/u,''));
 const plain=/^\/contracts\/(mobile|desktop)\//u.exec(path)?.[1],index=/^\/contracts\/variant_contracts\/(\d+)\//u.exec(path)?.[1];
 return object(value)&&object(fact)?{value,fact,viewport:plain??record.contracts?.variant_contracts?.[index]?.axes?.find(a=>a.name==='Viewport')?.value?.toLowerCase()}:null;
}
function variableShape(v){return closed(v,['id','name','key','collection_id','collection_name','resolved_type'])&&['id','name','key','collection_id','collection_name'].every(k=>text(v[k]))&&['FLOAT','COLOR'].includes(v.resolved_type);}
function shape(p){return closed(p,['id','kind','source','contract_path','binding_path','variable',...(Object.hasOwn(p??{},'paint_source_path')?['paint_source_path']:[])])&&match(ID,p.id)&&p.kind==='variable-binding'&&selector(p.source)&&match(PATH,p.contract_path)&&!!field(p.binding_path,p.paint_source_path)&&variableShape(p.variable);}
export function validateNativeVariableProofReferences({records=[]}={}){
 const issues=[],owners=new Map();
 for(const [i,r]of records.entries()){if(owners.has(r.id))issues.push(issue('NATIVE_VARIABLE_OWNER_AMBIGUOUS',`/records/${i}`,'One canonical owner required.'));owners.set(r.id,r);}
 for(const [i,r]of records.entries()){
  const links=r.evidence_links??{},proofs=links.native_variable_proofs??[],base=`/records/${i}/evidence_links`;
  if(!Array.isArray(proofs)){issues.push(issue('NATIVE_VARIABLE_SHAPE_INVALID',base,'Variable proofs must be an array.'));continue;}
  if(!proofs.length)continue;
  const ids=new Set(),obligations=new Set();
  for(const group of groups)for(const [j,item]of(Array.isArray(links[group])?links[group]:[]).entries()){if(ids.has(item?.id))issues.push(issue('NATIVE_VARIABLE_ID_DUPLICATE',`${base}/${group}/${j}`,'IDs are unique across owned arrays.'));ids.add(item?.id);}
  for(const [j,p]of proofs.entries()){
   const at=`${base}/native_variable_proofs/${j}`;
   if(!shape(p)){issues.push(issue('NATIVE_VARIABLE_SHAPE_INVALID',at,'Closed variable-binding metadata required.'));continue;}
   const t=target(r,p.contract_path),f=field(p.binding_path,p.paint_source_path),vs=variants(r).filter(v=>v.node_id===p.source.variant_node_id),vp=vs[0]?.axes?.find(a=>a.name==='Viewport')?.value?.toLowerCase();
   if(owners.get(p.source.component_id)!==r||vs.length!==1||(vp&&vp!==t?.viewport))issues.push(issue('NATIVE_VARIABLE_SELECTOR_INVALID',at,'Exact owned source/target viewport required.'));
   if(!t||f.type!==p.variable.resolved_type||!(f.type==='FLOAT'?t.value.type==='measure'&&t.value.unit==='px'&&finite(t.value.value):f.paint_context==='mixed'?t.value.type==='segments'&&Array.isArray(t.value.items):t.value.type==='color'&&/^#[0-9a-fA-F]{6}$/u.test(t.value.value)))issues.push(issue('NATIVE_VARIABLE_TARGET_INVALID',at,'Compatible exact typed px/color target required.'));
   if(!['figma-literal','figma-binding'].includes(t?.fact.provenance?.kind)||t.fact.provenance.node_id!==p.source.node_id)issues.push(issue('NATIVE_VARIABLE_PROVENANCE_INVALID',at,'Independent same-node native provenance required.'));
   const key=JSON.stringify([p.source,p.binding_path]);if(obligations.has(key))issues.push(issue('NATIVE_VARIABLE_SOURCE_DUPLICATE',at,'One proof per exact binding leaf.'));obligations.add(key);
  }
 }
 return ordered(issues);
}
function catalog(packet){
 const root=packet.binding_evidence;
 if(!closed(root,['variables','collections','usages',...(Object.hasOwn(root??{},'paint_locations')?['paint_locations']:[])])||!['variables','collections','usages'].every(k=>Array.isArray(root[k])))throw Error('complete binding evidence required');
 const variables=new Map(),collections=new Map(),usages=new Map();
 for(const v of root.variables){
  if(!closed(v,['id','name','key','remote','collection_id','resolved_type','values_by_mode'])||!['id','name','key','collection_id'].every(k=>text(v[k]))||typeof v.remote!=='boolean'||!['FLOAT','COLOR','BOOLEAN','STRING'].includes(v.resolved_type)||!object(v.values_by_mode)||variables.has(v.id))throw Error('unique complete actual variable definitions required');
  variables.set(v.id,v);
 }
 for(const c of root.collections){
  if(!closed(c,['id','name','default_mode','modes'])||!['id','name','default_mode'].every(k=>text(c[k]))||!Array.isArray(c.modes)||!c.modes.length||c.modes.some(m=>!closed(m,['id','name'])||!text(m.id)||!text(m.name))||new Set(c.modes.map(m=>m.id)).size!==c.modes.length||!c.modes.some(m=>m.id===c.default_mode)||collections.has(c.id))throw Error('unique complete actual collections/modes required');
  collections.set(c.id,c);
 }
 for(const usage of root.usages){
  if(!closed(usage,['node_id','binding_path','variable_id','resolved_type','resolved_value','mode_selections'])||!match(NODE,usage.node_id)||!text(usage.binding_path)||!text(usage.variable_id)||!['FLOAT','COLOR','BOOLEAN','STRING'].includes(usage.resolved_type)||!Array.isArray(usage.mode_selections)||usage.mode_selections.some(m=>!closed(m,['collection_id','mode_id'])||!text(m.collection_id)||!text(m.mode_id))||new Set(usage.mode_selections.map(m=>m.collection_id)).size!==usage.mode_selections.length)throw Error('complete consumer binding usage required');
  const key=JSON.stringify([usage.node_id,usage.binding_path]);if(usages.has(key))throw Error('duplicate consumer binding usage');usages.set(key,usage);
 }
 return{variables,collections,usages,paintLocations:readNativePaintLocations(packet,variables)};
}
function opaqueColor(value){
 if(!(closed(value,['r','g','b'])||closed(value,['r','g','b','a']))||['r','g','b'].some(k=>!finite(value[k])||value[k]<0||value[k]>1)||(Object.hasOwn(value,'a')&&value.a!==1))throw Error('opaque exact RGB/RGBA color required');
 return '#'+['r','g','b'].map(k=>Math.round(value[k]*255).toString(16).padStart(2,'0')).join('').toUpperCase();
}
function terminal(id,type,c,usage,trail=new Set()){
 if(trail.has(id))throw Error('variable alias cycle');
 const v=c.variables.get(id),collection=v&&c.collections.get(v.collection_id);
 const mode=usage.mode_selections.filter(m=>m.collection_id===v?.collection_id);
 if(!v||!collection||v.resolved_type!==type||mode.length!==1||!collection.modes.some(m=>m.id===mode[0].mode_id)||!Object.hasOwn(v.values_by_mode,mode[0].mode_id))throw Error('exact consumer mode/variable type unavailable');
 const value=v.values_by_mode[mode[0].mode_id];
 if(closed(value,['type','id'])&&value.type==='VARIABLE_ALIAS'&&text(value.id))return terminal(value.id,type,c,usage,new Set([...trail,id]));
 if(type==='FLOAT'){if(!finite(value))throw Error('finite FLOAT terminal required');return number(value);}
 return opaqueColor(value);
}
function verify(record,p,env,c,consumer=p.source,paintVerifier){
 const selected=env.selected(consumer),node=selected.node,t=target(record,p.contract_path),f=field(p.binding_path,p.paint_source_path);
 const alias=pointer(node,p.binding_path.replace(/\/id$/u,'')),v=c.variables.get(p.variable.id),collection=c.collections.get(p.variable.collection_id);
 if(!closed(alias,['id'])||alias.id!==p.variable.id||!v||!collection||v.name!==p.variable.name||v.key!==p.variable.key||v.collection_id!==p.variable.collection_id||v.resolved_type!==p.variable.resolved_type||collection.name!==p.variable.collection_name)throw Error('exact binding variable/key/name/type/collection ownership mismatch');
 const usage=c.usages.get(JSON.stringify([node.node_id,p.binding_path.replace(/\/id$/u,'')]));
 if(!usage||usage.variable_id!==v.id||usage.resolved_type!==v.resolved_type)throw Error('exact consumer usage missing or mismatched');
 for(const mode of usage.mode_selections){const collection=c.collections.get(mode.collection_id);if(!collection||!collection.modes.some(m=>m.id===mode.mode_id))throw Error('actual selected mode unresolved');}
 const resolved=f.type==='FLOAT'?number(usage.resolved_value):opaqueColor(usage.resolved_value),value=terminal(v.id,f.type,c,usage);
 if(f.type==='FLOAT'&&!finite(usage.resolved_value))throw Error('finite resolveForConsumer value required');
 if(f.paint_context){
  if(!equal(consumer,p.source)||!paintVerifier)throw Error('projected paint-variable context is not independently qualified');
  if(value!==resolved)throw Error('terminal/consumer color mismatch');
  paintVerifier({proof:p,node,packet:selected.packet,locations:c.paintLocations,value});
  return {...consumer,source_path:p.binding_path};
 }
 const links=(record.contracts?.figma_fact_links??[]).filter(l=>l.contract_path===`${p.contract_path}/value`);
 if(links.length!==1||links[0].variant_node_id!==p.source.variant_node_id||links[0].node_id!==p.source.node_id||links[0].source_path!==f.source_path||links[0].transform!=='identity')throw Error('unique independent binding-to-field mapping required');
 const native=pointer(node,f.source_path),actual=f.type==='FLOAT'?number(native):native;
 if(value!==resolved||resolved!==actual||actual!==t.value.value)throw Error('terminal/consumer/native/canonical value mismatch');
 if(f.type==='FLOAT'){
  const radius=CORNERS.includes(f.field);
  if(!['COMPONENT','FRAME','INSTANCE',...(radius?['RECTANGLE']:[])].includes(node.node_type))throw Error('native field capability required');
  if(radius){
   if(!closed(node.corner_radii,['top_left','top_right','bottom_left','bottom_right'])||Object.values(node.corner_radii).some(n=>!finite(n)||number(n)!==actual)||CORNERS.some(k=>!equal(node.variable_bindings?.[k],{id:v.id})))throw Error('four equal native corners and uniform variable aliases required');
  }else if(!['HORIZONTAL','VERTICAL'].includes(node.layout?.mode))throw Error('known Auto Layout field required');
 }else if(!['COMPONENT','FRAME','INSTANCE','RECTANGLE','TEXT'].includes(node.node_type)||node.fills?.length!==1||node.fills[0].type!=='solid'||node.fills[0].visible!==true||node.fills[0].opacity!==1)throw Error('one opaque visible solid native paint required');
 return {...consumer,source_path:p.binding_path};
}
export function auditNativeVariableProofs({record,model,session}={}){
 const report={ok:false,component_id:record?.id??null,canonical_git_sha:model?.canonical_sha??null,receipt_ids:[],results:[],issues:[],verified_sources:[]};
 const proofs=record?.evidence_links?.native_variable_proofs??[];
 if(Array.isArray(proofs)&&!proofs.length){report.ok=true;return report;}
 const canonical=model?.records?.filter(r=>r.id===record?.id);
 if(canonical?.length!==1||!equal(canonical[0],record)){report.issues.push(issue('NATIVE_VARIABLE_CANONICAL_MISMATCH','/record','Exact canonical record required.'));return report;}
 const validation=validateNativeVariableProofReferences({records:model.records}),env=createContractProofEnvironment(model,session);
 report.issues.push(...validation,...env.issues);
 let c;
 const paintVerifier=createNativePaintVariableVerifier({record,model,session});
 for(const p of Array.isArray(proofs)?proofs:[]){
  const item={proof_id:p?.id??null,kind:p?.kind??null,status:'unverified'};env.beginProof();
  try{
   if(validation.length||env.issues.length)throw Error('variable metadata/session unverified');
   c??=catalog(env.tree(record.id).packet);const source=verify(record,p,env,c,p.source,paintVerifier);item.status='verified';item.source_paths=[source];report.verified_sources.push(source);
  }catch(e){item.reason=e.message;item.source_paths=[];report.issues.push(issue('NATIVE_VARIABLE_UNVERIFIED',`/evidence_links/native_variable_proofs/${p?.id??'invalid'}`,e.message));}
  Object.assign(item,env.proofTrace());report.results.push(item);
 }
 report.receipt_ids=[...env.receipts].sort();report.verified_sources=[...new Map(report.verified_sources.map(s=>[tuple(s),s])).values()].sort((a,b)=>tuple(a).localeCompare(tuple(b)));
 ordered(report.issues);report.ok=!report.issues.length&&report.results.every(r=>r.status==='verified');
 if(report.verified_sources.length)computed.set(report,{record:structuredClone(record),live:structuredClone(env.tree(record.id).packet),sources:structuredClone(report.verified_sources),digest:digest(report)});
 return report;
}
export function applyNativeVariableCoverage({facts,coverage,nativeRelationProofs,nativeFactProofs,contractProofs}={}){
 const base=applyNativeRelationCoverage({facts,coverage:nativeRelationProofs,nativeFactProofs,contractProofs}),trusted=computed.get(coverage);
 if(!trusted||digest(coverage)!==trusted.digest||!isFigmaContractFactReportFor({facts,record:trusted.record,live:trusted.live}))return base;
 const sources=new Set(trusted.sources.map(tuple)),issues=base.issues.filter(i=>!(i.code==='FIGMA_FACT_UNCOVERED'&&sources.has(tuple({component_id:facts.component_id,...i})))),removed=base.issues.length-issues.length;
 if(!removed)return base;
 return{...base,ok:!issues.length,...(typeof base.mapped_source_fact_count==='number'?{mapped_source_fact_count:base.mapped_source_fact_count+removed}:{}),issues};
}

// Verify the original canonical binding AND its independently captured actual
// consumer. Selectors change only the consumer read context, never the packet,
// canonical mapping/provenance, typed target, or source receipt.
export function auditProjectedNativeVariableProofs({record,model,session,placement,source_variant_node_id}={}){
 const report={ok:false,component_id:record?.id??null,canonical_git_sha:model?.canonical_sha??null,receipt_ids:[],results:[],issues:[],verified_sources:[]};
 const owners=model?.records?.filter(r=>r.id===record?.id);
 if(owners?.length!==1||!equal(owners[0],record)||!selector(placement)||!match(ROOT,source_variant_node_id)){report.issues.push(issue('NATIVE_PROJECTED_VARIABLE_INPUT_UNVERIFIED','/record','Canonical child and exact actual placement selectors required.'));return report;}
 const validation=validateNativeVariableProofReferences({records:model.records}),env=createContractProofEnvironment(model,session);
 report.issues.push(...validation,...env.issues);
 try{
  if(report.issues.length)throw Error('canonical variable metadata/session unverified');
  const parent=env.lookup(placement.component_id),actual=env.selected(placement),source=env.selected({component_id:record.id,variant_node_id:source_variant_node_id,node_id:source_variant_node_id});
  if(parent.figma.file_key!==record.figma.file_key||actual.node.node_type!=='INSTANCE'||actual.node.main_component_id!==source_variant_node_id||actual.ancestors.length===0)throw Error('genuine registered actual child identity/ancestry required');
  const declared=(parent.evidence_links?.native_relation_proofs??[]).filter(p=>p.kind==='element-structure'&&equal(p.source,placement)&&pointer(parent,p.element_path)?.render_mode==='nested-component'&&pointer(parent,p.element_path)?.component_id===record.id);
  const relations=auditNativeRelationProofs({record:parent,model,session});
  if(declared.length!==1||relations.results.filter(r=>r.proof_id===declared[0].id&&r.status==='verified').length!==1)throw Error('independent exact parent placement structure required');
  const sourceCatalog=catalog(source.packet),actualCatalog=catalog(actual.packet);
  const proofs=(record.evidence_links?.native_variable_proofs??[]).filter(p=>p.source.variant_node_id===source_variant_node_id&&p.source.node_id!==source_variant_node_id);
  for(const p of proofs){
   const item={proof_id:p.id,status:'unverified'};env.beginProof();
   try{
    const original=env.selected(p.source);
    if(!original.ancestors.some(n=>n.node_id===source_variant_node_id))throw Error('canonical descendant ancestry required');
    const actualId='I'+placement.node_id.replace(/^I/u,'')+';'+p.source.node_id.replace(/^I/u,'');
    const consumer={...placement,node_id:actualId},entry=env.selected(consumer);
    if(!entry.ancestors.some(n=>n.node_id===placement.node_id))throw Error('complete projected consumer ancestry required');
    verify(record,p,env,sourceCatalog);
    const actualSource=verify(record,p,env,actualCatalog,consumer);
    item.status='verified';item.source_paths=[actualSource];report.verified_sources.push(actualSource);
   }catch(e){item.reason=e.message;report.issues.push(issue('NATIVE_PROJECTED_VARIABLE_UNVERIFIED',`/evidence_links/native_variable_proofs/${p.id}`,e.message));}
   Object.assign(item,env.proofTrace());report.results.push(item);
  }
 }catch(e){report.issues.push(issue('NATIVE_PROJECTED_VARIABLE_UNVERIFIED','/placement',e.message));}
 report.receipt_ids=[...env.receipts].sort();ordered(report.issues);report.ok=!report.issues.length&&report.results.every(r=>r.status==='verified');return report;
}
