// Audit-only: an explicitly hidden, complete SOLID stroke renders no border.
// Preserve raw geometry/alias metadata; never invent a typed HTML border color.
import {isDeepStrictEqual as equal} from 'node:util';
const closed=(v,keys)=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&keys.every(k=>Object.hasOwn(v,k))&&Object.keys(v).every(k=>keys.includes(k));
export function verifyInactiveHtmlStrokes({node,packet,add,addNotRequired}) {
  if(equal(node.strokes,[])){add('/strokes');return;}
  const stroke=node.strokes?.[0];
  if(!Array.isArray(node.strokes)||node.strokes.length!==1||!closed(stroke,['type','visible','opacity','color'])||
      stroke.type!=='solid'||stroke.visible!==false||stroke.opacity!==1||!/^#[0-9A-Fa-f]{6}$/u.test(stroke.color)||
      packet.capture_errors.some(e=>e.node_id===node.node_id&&(e.field==='strokes'||e.code==='PAINT_UNSUPPORTED')))throw Error('only complete explicitly hidden SOLID stroke is inert');
  if(typeof node.stroke_weight!=='number'||!Number.isFinite(node.stroke_weight)||node.stroke_weight<0||!['INSIDE','CENTER','OUTSIDE'].includes(node.stroke_align))throw Error('complete inactive stroke geometry required');
  for(const key of ['type','visible','opacity','color'])addNotRequired('/strokes/0/'+key);
  for(const key of ['stroke_weight','stroke_align'])addNotRequired('/'+key);
  const bindings=node.variable_bindings?.strokes;
  if(bindings!==undefined){
    const alias=bindings?.[0];
    if(!Array.isArray(bindings)||bindings.length!==1||!closed(alias,['id'])||typeof alias.id!=='string'||!alias.id.trim())throw Error('complete inactive stroke alias required');
    const evidence=packet.binding_evidence,variables=evidence?.variables?.filter(v=>v.id===alias.id),usages=evidence?.usages?.filter(u=>u.node_id===node.node_id&&u.binding_path==='/variable_bindings/strokes/0');
    const collections=evidence?.collections?.filter(c=>c.id===variables?.[0]?.collection_id);
    if(variables?.length!==1||collections?.length!==1||!closed(variables[0],['id','name','key','remote','collection_id','resolved_type','values_by_mode'])||variables[0].resolved_type!=='COLOR'||
        !closed(collections[0],['id','name','default_mode','modes'])||usages?.length!==1||!closed(usages[0],['node_id','binding_path','variable_id','resolved_type','resolved_value','mode_selections'])||
        usages[0].variable_id!==alias.id||usages[0].resolved_type!=='COLOR'||!Array.isArray(usages[0].mode_selections)||!usages[0].mode_selections.length||
        usages[0].mode_selections.some(m=>!closed(m,['collection_id','mode_id'])||evidence.collections.filter(c=>c.id===m.collection_id&&c.modes.some(v=>v.id===m.mode_id)).length!==1))throw Error('actual inactive stroke binding identity/usage required');
    addNotRequired('/variable_bindings/strokes/0/id');
  }else if(packet.binding_evidence?.usages?.some(u=>u.node_id===node.node_id&&u.binding_path==='/variable_bindings/strokes/0'))throw Error('inactive stroke usage cannot exist without its actual alias');
}
