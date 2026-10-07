import {isDeepStrictEqual as equal} from 'node:util';
import {createContractProofEnvironment} from './contract-fact-proofs.mjs';
import {auditFigmaComponentEvidence} from './figma-component-evidence.mjs';
import {auditNativeRelationProofs} from './native-relationship-coverage.mjs';
import {auditNativeVariableProofs, auditProjectedNativeVariableProofs} from './native-variable-coverage.mjs';
import {auditNativeFactProofs} from './native-fact-coverage.mjs';
import {auditNativeContextProofs} from './native-context-coverage.mjs';
import {isSharedArtworkReference} from './native-owned-artwork.mjs';

// A separate actual-consumer audit. No packet/record is projected, rewritten or
// promoted to a new receipt. Parent placement and child implementation retain
// their independent canonical owners; artwork remains outside this scope.
const NODE=/^(?:[0-9]+:[0-9]+|I[0-9]+:[0-9]+(?:;[0-9]+:[0-9]+)+)$/u;
const pointer=(v,p)=>p.split('/').slice(1).reduce((a,k)=>a?.[k.replaceAll('~1','/').replaceAll('~0','~')],v);
const tuple=s=>JSON.stringify([s.component_id,s.variant_node_id,s.node_id,s.source_path]);
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const normalize=v=>finite(v)&&Math.abs(v-Math.round(v))<0.0001?Math.round(v):v;
const axes=a=>JSON.stringify(a?.map(v=>[v.name,v.value]).sort((a,b)=>a[0].localeCompare(b[0])));
const projected=(id,sourceRoot,actualRoot)=>id===sourceRoot?actualRoot:NODE.test(id)&&NODE.test(actualRoot)?'I'+actualRoot.replace(/^I/u,'')+';'+id.replace(/^I/u,''):null;
function roots(record){
  const all=['mobile','desktop'].flatMap(v=>record.contracts?.[v]?.root?[{root:record.contracts[v].root,path:`/contracts/${v}/root`}]:[]);
  return all.concat((record.contracts?.variant_contracts??[]).map((v,i)=>({root:v.root,path:`/contracts/variant_contracts/${i}/root`,axes:v.axes})));
}
function references(record){
  const out=[];
  function walk(e,path,row){
    if(!e)return;
    if(['direct-image','background-image'].includes(e.render_mode))return;
    if(e.render_mode==='nested-component'){out.push({element:e,path,row});return;}
    for(const [i,c]of(e.children??[]).entries())walk(c,`${path}/children/${i}`,row);
  }
  for(const row of roots(record))walk(row.root,row.path,row);
  return out;
}
function rootVariant(record,row){
  const size=(row.root?.facts??[]).filter(f=>f.id==='reference-size');
  const candidates=(record.variants??[]).filter(v=>v.node_id===size[0]?.provenance?.node_id&&(!row.axes||axes(v.axes)===axes(row.axes)));
  if(size.length!==1||candidates.length!==1)throw Error('unique canonical variant/root reference required');
  return candidates[0];
}
function elements(record,variant){
  const rows=roots(record).filter(row=>{try{return rootVariant(record,row).node_id===variant;}catch{return false;}});
  if(rows.length!==1)throw Error('unique selected child contract root required');
  const result=[];
  function walk(e,path){result.push({element:e,path});for(const[i,c]of(e.children??[]).entries())walk(c,`${path}/children/${i}`);}
  walk(rows[0].root,rows[0].path);return result;
}
function ownFact(record,link,nodeId){
  const split=link.contract_path.indexOf('/value');
  const fact=split<0?null:pointer(record,link.contract_path.slice(0,split));
  return fact&&['figma-literal','figma-binding'].includes(fact.provenance?.kind)&&fact.provenance.node_id===nodeId;
}
function mapped(record,variant,node,path,value,elementPath){
  const links=(record.contracts?.figma_fact_links??[]).filter(l=>l.variant_node_id===variant&&l.node_id===node&&l.source_path===path&&(!elementPath||l.contract_path.startsWith(elementPath+'/facts/')));
  if(links.length!==1||!ownFact(record,links[0],node))return false;
  const l=links[0],actual=l.transform==='identity'?normalize(value):l.transform==='lowercase'&&typeof value==='string'?value.toLowerCase():undefined;
  return actual!==undefined&&equal(pointer(record,l.contract_path),actual);
}
function contentAssociation(record,variant,nodeId,rows){
  const links=(record.contracts?.figma_fact_links??[]).filter(l=>l.variant_node_id===variant&&l.node_id===nodeId&&l.source_path==='/characters');
  if(links.length!==1||links[0].transform!=='identity'||!ownFact(record,links[0],nodeId))return null;
  const candidates=rows.filter(r=>['html-text','html-link'].includes(r.element.render_mode)&&links[0].contract_path.startsWith(r.path+'/facts/'));
  if(candidates.length!==1)return null;
  const {element,path}=candidates[0],source=(element.facts??[]).filter(f=>f.id==='source-text');
  const slots=(element.content_slots??[]).filter(s=>s.type==='plain-text');
  const expected=source.length===1?`${path}/facts/${element.facts.indexOf(source[0])}/value/value`:null;
  return slots.length===1&&expected===links[0].contract_path?{element,path,slot_id:slots[0].id}:null;
}

export function auditNestedHtmlEvidence({recordId,model,session}={}){
  const report={ok:false,component_id:recordId,canonical_git_sha:model?.canonical_sha??null,receipt_ids:[],placements:[],observed_content_overrides:[],observed_reference_measurements:[],issues:[]};
  const fail=(code,path,message,extra={})=>report.issues.push({code,path,message,...extra});
  const matches=model?.records?.filter(r=>r.id===recordId);
  if(matches?.length!==1){fail('NESTED_HTML_OWNER_UNVERIFIED','/records','Exactly one canonical owner is required.');return report;}
  const owner=matches[0],lookup=id=>{const found=model.records.filter(r=>r.id===id);if(found.length!==1)throw Error('canonical child identity missing/ambiguous');return found[0];};
  const genuine=r=>!isSharedArtworkReference(r)&&!['asset','icon','template'].includes(r.identity?.semantic_role);
  let refs;
  try{refs=references(owner).filter(r=>genuine(lookup(r.element.component_id)));}
  catch(e){fail('NESTED_HTML_OWNER_UNVERIFIED','/contracts',e.message);return report;}
  if(!refs.length){report.ok=true;return report;}
  const seen=new Set();
  function cycle(r,trail){
    if(trail.has(r.id))throw Error('genuine nested HTML dependency cycle');
    if(seen.has(r.id))return;
    for(const ref of references(r)){const c=lookup(ref.element.component_id);if(genuine(c))cycle(c,new Set([...trail,r.id]));}
    seen.add(r.id);
  }
  try{cycle(owner,new Set());}catch(e){fail('NESTED_HTML_DEPENDENCY_CYCLE','/contracts',e.message);return report;}
  for(const id of new Set([owner.id,...refs.map(r=>r.element.component_id)]))if((session?.captures??[]).filter(c=>c.component_id===id).length!==1)fail('EVIDENCE_CAPTURE_MISSING','/session/captures','One actual receipt per selected genuine owner is required.',{component_id:id});
  if(report.issues.length)return report;
  const env=createContractProofEnvironment(model,session),receipts=new Set(),sourceAudits=new Map();
  if(env.issues.length){report.issues.push(...env.issues);return report;}
  const relations=auditNativeRelationProofs({record:owner,model,session});
  const parentCoverage=[relations,auditNativeVariableProofs({record:owner,model,session}),auditNativeFactProofs({record:owner,model,session}),auditNativeContextProofs({record:owner,model,session})];
  const covered=new Set(parentCoverage.flatMap(r=>r.verified_sources??[]).map(tuple));
  for(const ref of refs){
    const before=report.issues.length,placement={actual_node_id:null,component_id:ref.element.component_id,status:'unverified'};
    report.placements.push(placement);
    try{
      const variant=rootVariant(owner,ref.row),size=(ref.element.facts??[]).filter(f=>f.id==='reference-size');
      if(size.length!==1)throw Error('one independently owned placement size required');
      const actualId=size[0].provenance?.node_id,entry=env.selected({component_id:owner.id,variant_node_id:variant.node_id,node_id:actualId}),actual=entry.node,child=lookup(ref.element.component_id);
      placement.actual_node_id=actualId;placement.variant_node_id=variant.node_id;
      receipts.add(entry.capture.receipt_id);
      const structure=(owner.evidence_links?.native_relation_proofs??[]).filter(p=>p.kind==='element-structure'&&p.element_path===ref.path&&p.source.node_id===actualId&&p.source.variant_node_id===variant.node_id);
      if(structure.length!==1||relations.results.filter(r=>r.proof_id===structure[0].id&&r.status==='verified').length!==1)throw Error('exact independently verified parent placement structure required');
      for(const axis of ['width','height'])if(!mapped(owner,variant.node_id,actualId,`/reference_dimensions/${axis}`,actual.reference_dimensions?.[axis],ref.path))throw Error('parent-owned placement measurement mapping unverified');
      const selected=child.variants.filter(v=>v.node_id===actual.main_component_id);
      if(actual.node_type!=='INSTANCE'||selected.length!==1||child.figma.file_key!==owner.figma.file_key||child.properties?.length!==0)throw Error('registered genuine child main variant/controls unverified');
      const expected=Object.fromEntries(selected[0].axes.map(a=>[a.name,{type:'VARIANT',value:a.value,boundVariables:{}}]));
      if(!equal(actual.instance_properties,expected))throw Error('complete exact child variant axes required');
      const source=env.selected({component_id:child.id,variant_node_id:selected[0].node_id,node_id:selected[0].node_id});
      receipts.add(source.capture.receipt_id);
      const rows=elements(child,selected[0].node_id);
      if(!sourceAudits.has(child.id))sourceAudits.set(child.id,auditFigmaComponentEvidence({record:child,live:source.packet,model,session}));
      const sourceAudit=sourceAudits.get(child.id);
      if(!sourceAudit.ok)fail('NESTED_HTML_SOURCE_UNVERIFIED',ref.path,'The independently captured canonical child implementation has open obligations.',{component_id:child.id});
      function compareValue(s,a,path,node,actualNode,isRoot){
        if(equal(s,a))return;
        if(isRoot&&s&&a&&typeof s==='object'&&typeof a==='object'&&!Array.isArray(s)&&!Array.isArray(a)){
          for(const key of new Set([...Object.keys(s),...Object.keys(a)]))compareValue(s[key],a[key],`${path}/${key}`,node,actualNode,true);
          return;
        }
        if(isRoot){
          if(mapped(owner,variant.node_id,actualId,path,a,ref.path)||covered.has(tuple({component_id:owner.id,variant_node_id:variant.node_id,node_id:actualId,source_path:path})))return;
          fail('NESTED_HTML_PLACEMENT_UNVERIFIED',ref.path,'A root override needs exact independently verified parent-owned evidence.',{node_id:actualId,source_path:path});return;
        }
        if(path==='/characters'){
          const association=contentAssociation(child,selected[0].node_id,node.node_id,rows);
          if(association&&typeof a==='string')report.observed_content_overrides.push({component_id:child.id,variant_node_id:selected[0].node_id,source_node_id:node.node_id,actual_node_id:actualNode.node_id,source_path:path,kind:'plain-text',slot_id:association.slot_id,observed_value:a});
          else fail('NESTED_HTML_CONTENT_UNVERIFIED',ref.path,'Changed text needs a unique attached canonical slot and same-element characters mapping.',{node_id:actualNode.node_id,source_path:path});
          return;
        }
        if(path.startsWith('/reference_dimensions/')){
          report.observed_reference_measurements.push({actual_node_id:actualNode.node_id,source_path:path,observed_value:a,status:'unverified'});
          fail('NESTED_HTML_REFERENCE_UNVERIFIED',ref.path,'A changed observation is not automatically a fixed or adaptive implementation value.',{node_id:actualNode.node_id,source_path:path});return;
        }
        if(s&&a&&typeof s==='object'&&typeof a==='object'&&Array.isArray(s)===Array.isArray(a)){
          if(Array.isArray(s)&&s.length!==a.length){fail('NESTED_HTML_DESCENDANT_UNVERIFIED',ref.path,'Complete actual array/order differs from verified child.',{node_id:actualNode.node_id,source_path:path});return;}
          for(const key of new Set([...Object.keys(s),...Object.keys(a)]))compareValue(s[key],a[key],`${path}/${key}`,node,actualNode,false);
          return;
        }
        fail('NESTED_HTML_DESCENDANT_UNVERIFIED',ref.path,'Actual descendant differs from the independently verified child implementation.',{node_id:actualNode.node_id,source_path:path});
      }
      function walk(s,a,isRoot=false){
        const id=projected(s.node_id,source.node.node_id,actualId);
        const found=id&&env.tree(owner.id).nodes.get(id);
        if(!a||a.node_id!==id||!found||found.variantId!==variant.node_id||(!isRoot&&!found.ancestors.some(n=>n.node_id===actualId))){fail('NESTED_HTML_ANCESTRY_UNVERIFIED',ref.path,'Exact projected identity and complete actual ancestry are required.');return;}
        // Root class/name/main/axes are already independently checked by the
        // parent's structure proof. Other root extras stay ordinary parent
        // obligations; this branch never masks them or counts them as mapped.
        const skip=new Set(['node_id','children',...(isRoot?['node_type','name','main_component_id','instance_properties']:[])]);
        const keys=isRoot?Object.keys(s):[...new Set([...Object.keys(s),...Object.keys(a)])];
        for(const key of keys)if(!skip.has(key))compareValue(s[key],a[key],'/'+key,s,a,isRoot);
        const asset=(child.asset_contracts??[]).some(v=>v.owner_layer_name===s.name);
        if(asset)return;
        const ss=s.children??[],aa=a.children??[];
        if(!equal(ss.map(n=>projected(n.node_id,source.node.node_id,actualId)),aa.map(n=>n.node_id))){fail('NESTED_HTML_DESCENDANT_UNVERIFIED',ref.path,'Exact complete child order differs from verified source.');return;}
        for(let i=0;i<ss.length;i++)walk(ss[i],aa[i]);
      }
      walk(source.node,actual,true);
      const variables=auditProjectedNativeVariableProofs({record:child,model,session,placement:{component_id:owner.id,variant_node_id:variant.node_id,node_id:actualId},source_variant_node_id:selected[0].node_id});
      if(!variables.ok)fail('NESTED_HTML_VARIABLE_UNVERIFIED',ref.path,'Actual descendant aliases, selected modes and consumer resolution require independent verification.',{details:variables.issues});
      placement.checked_variable_bindings=variables.results.filter(r=>r.status==='verified').length;
      placement.status=report.issues.length===before?'verified':'unverified';
    }catch(e){fail('NESTED_HTML_PLACEMENT_UNVERIFIED',ref.path,e.message);}
  }
  report.receipt_ids=[...receipts].sort();report.ok=report.issues.length===0;return report;
}
