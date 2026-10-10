// Audit-only consumer of an independently qualified shared Fill source.
// Consumer reference geometry/layout is owned separately; no export re-sizing.
import {isDeepStrictEqual as equal} from 'node:util';
import {ownedContextStructure} from './native-artwork-context.mjs';
import {resolveImageFillContextReference,verifyImageFillPaintContext} from './native-image-fill-context.mjs';
const pointer=(v,p)=>p.split('/').slice(1).reduce((a,k)=>a?.[k],v);
export function resolveImageFillConsumerContextReference({record,proof}) {
  const relation=ownedContextStructure(record,proof),element=pointer(record,relation.element_path);
  if(['asset','icon','template'].includes(record.identity?.semantic_role)||!['direct-image','background-image'].includes(element?.render_mode)||element.children?.length!==0)throw Error('owned flat Fill consumer required');
  const sourceProofs=(record.evidence_links?.native_context_proofs??[]).filter(p=>p.kind==='image-fill-paint-context'&&p.structure_proof_id===proof.source_structure_proof_id);
  if(sourceProofs.length!==1)throw Error('one independently declared source Fill paint context required');
  const sourceProof=sourceProofs[0],source=resolveImageFillContextReference({record,proof:sourceProof});
  if(element.asset_contract_id!==source.asset.id||relation.source.component_id!==record.id)throw Error('consumer and source must share the exact same owned asset');
  return{relation,element,sourceProof,source};
}
export function verifyImageFillConsumerContext({record,proof,entry,env,model,relationsFor,add}) {
  const boundary=resolveImageFillConsumerContextReference({record,proof}),{source,sourceProof}=boundary;
  const qualified=relationsFor(record).results.filter(p=>p.proof_id===source.relation.id&&p.status==='verified');
  if(qualified.length!==1)throw Error('independent exact source structure required');
  const original=env.selected(source.relation.source),paths=[];
  const foundationPaths=verifyImageFillPaintContext({record,proof:sourceProof,entry:original,model,add:p=>paths.push(p)});
  const node=entry.node;
  if(entry.selector.component_id!==record.id||entry.selector.variant_node_id!==boundary.relation.source.variant_node_id||entry.selector.node_id!==boundary.relation.source.node_id||
      node.node_type!=='FRAME'||node.name!==source.asset.owner_layer_name||!Array.isArray(node.children)||node.children.length||
      [node,...entry.ancestors].some(n=>n.visible!==true||n.opacity!==1)||entry.packet.capture_errors.some(e=>e.node_id===node.node_id&&(e.field==='fills'||e.code==='PAINT_UNSUPPORTED'))||!equal(node.fills,original.node.fills))throw Error('complete actual consumer paint must equal its independently qualified source tuple');
  for(const path of paths)add(path);
  return foundationPaths;
}
