import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {auditNativeVariableProofs, validateNativeVariableProofReferences} from '../../scripts/lib/native-variable-coverage.mjs';
import {fixture as relationFixture} from './native-relationship-coverage.test.mjs';
import {contractDecisionContextDigest, contractDecisionValueDigest} from '../../scripts/lib/contract-fact-proofs.mjs';

const sha='a'.repeat(40), nonce='b'.repeat(64), request='c'.repeat(64);
const collectionId='VariableCollectionId:1:0';
const green300='VariableID:704582647f9b095771e51ba7ff67468e310de275/22:5';
const green400='VariableID:a9015ac7b09ab50dccace9cd298b46dada8b4520/22:4';
const grey400='VariableID:ee519cb1483388c831c3ea1ab0cedfaf4c143618/17:138';
const green500='VariableID:9ca87e868c2b5c348498f505a95a6049f5ac9df2/22:3';
function qualifiedGradientFixture(){
  const f=relationFixture(), node=f.packet.variants[0].source_node, root=f.record.contracts.mobile.root;
  const owner='relationship-fixture', source={component_id:owner,variant_node_id:'101:1',node_id:'101:1'};
  f.record.identity={...f.record.identity,semantic_role:'button'};root.semantic_role='button';
  Object.assign(node,{layout_positioning:'AUTO',layout_grow:0,minimum_width_px:null,opacity:1,rotation:0,strokes:[],effects:[],variable_bindings:{fills:[{id:green300},{id:green400}]},layout:{mode:'VERTICAL',wrap:'NO_WRAP',counter_axis_spacing:0},fills:[{type:'gradient_linear',visible:true,opacity:1,gradient_stops:[{position:0,color:'#18B037',alpha:1},{position:1,color:'#3DD55C',alpha:1}],stops:[{position:0,color:'#18B037',alpha:1},{position:1,color:'#3DD55C',alpha:1}],gradient_transform:[[1,0,0],[0,1,0]]}]});
  const add=(id,value,path)=>{root.facts.push({id,value,provenance:{kind:'figma-literal',node_id:node.node_id}});f.record.contracts.figma_fact_links.push({variant_node_id:'101:1',node_id:node.node_id,source_path:path,contract_path:`/contracts/mobile/root/facts/${root.facts.length-1}/value/value`,transform:'identity'});};
  add('layout-orientation',{type:'keyword',value:'vertical'},'/layout/mode');f.record.contracts.figma_fact_links.at(-1).transform='lowercase';
  add('layout-wrap',{type:'keyword',value:'no_wrap'},'/layout/wrap');f.record.contracts.figma_fact_links.at(-1).transform='lowercase';
  add('background-gradient-start',{type:'color',value:'#18B037'},'/fills/0/stops/0/color');add('background-gradient-end',{type:'color',value:'#3DD55C'},'/fills/0/stops/1/color');
  root.facts.push({id:'background-gradient-css-angle-degrees',value:{type:'number',value:25},provenance:{kind:'contract-proof',proof_id:'angle'}});
  const anglePath=`/contracts/mobile/root/facts/${root.facts.length-1}/value`, selector={component_id:owner,variant_node_id:'101:1',node_id:'101:1'};
  f.record.evidence_links.fact_proofs=[{id:'angle',kind:'approved-css-gradient-angle',contract_path:anglePath,source:selector,paint_index:0,decision_id:'decision-angle'}];
  f.record.evidence_links.normative_decisions=[{id:'decision-angle',kind:'css-linear-gradient-angle',owner_id:owner,targets:[{viewport:'mobile',element_id:root.id,fact_id:'background-gradient-css-angle-degrees',contract_path:anglePath,value_sha256:contractDecisionValueDigest({record:f.record,contractPath:anglePath}),context_sha256:contractDecisionContextDigest({selector,paintIndex:0,model:f.model,session:f.session}),source:selector,paint_index:0}],authorization:{user_instruction:'Exact 25 degrees',scope:{owner_id:owner,contract_paths:[anglePath]},approved_spec:{path:'docs/superpowers/specs/2026-10-03-cupis-contract-fact-proof-design.md',git_sha:'a'.repeat(40)}}}];
  f.record.evidence_links.native_context_proofs=[{id:'gradient-context',kind:'html-element-context',structure_proof_id:'root-structure'}];
  f.record.evidence_links.native_variable_proofs=[
    {id:'gradient-start-variable',kind:'variable-binding',source,contract_path:'/contracts/mobile/root/facts/'+(root.facts.length-3)+'/value',binding_path:'/variable_bindings/fills/1/id',paint_source_path:'/fills/0/stops/0/color',variable:{id:green400,name:'Green/400',key:'a9015ac7b09ab50dccace9cd298b46dada8b4520',collection_id:collectionId,collection_name:'Green',resolved_type:'COLOR'}},
    {id:'gradient-end-variable',kind:'variable-binding',source,contract_path:'/contracts/mobile/root/facts/'+(root.facts.length-2)+'/value',binding_path:'/variable_bindings/fills/0/id',paint_source_path:'/fills/0/stops/1/color',variable:{id:green300,name:'Green/300',key:'704582647f9b095771e51ba7ff67468e310de275',collection_id:collectionId,collection_name:'Green',resolved_type:'COLOR'}}
  ];
  f.packet.binding_evidence={variables:[{id:green300,name:'Green/300',key:'704582647f9b095771e51ba7ff67468e310de275',remote:true,collection_id:collectionId,resolved_type:'COLOR',values_by_mode:{'1:0':{r:.2392156869,g:.8352941274,b:.360784322,a:1}}},{id:green400,name:'Green/400',key:'a9015ac7b09ab50dccace9cd298b46dada8b4520',remote:true,collection_id:collectionId,resolved_type:'COLOR',values_by_mode:{'1:0':{r:.0941176489,g:.6901960968,b:.2156862765,a:1}}}],collections:[{id:collectionId,name:'Green',default_mode:'1:0',modes:[{id:'1:0',name:'Default'}]}],usages:[{node_id:'101:1',binding_path:'/variable_bindings/fills/0',variable_id:green300,resolved_type:'COLOR',resolved_value:{r:.2392156869,g:.8352941274,b:.360784322,a:1},mode_selections:[{collection_id:collectionId,mode_id:'1:0'}]},{node_id:'101:1',binding_path:'/variable_bindings/fills/1',variable_id:green400,resolved_type:'COLOR',resolved_value:{r:.0941176489,g:.6901960968,b:.2156862765,a:1},mode_selections:[{collection_id:collectionId,mode_id:'1:0'}]}],paint_locations:{schema_version:'1.0.0',items:[{node_id:'101:1',source_path:'/fills/0/stops/0/color',variable_id:green400},{node_id:'101:1',source_path:'/fills/0/stops/1/color',variable_id:green300}]}};
  return f;
}
test('direct gradient stop locations verify reversed aggregate bindings without index inference',()=>{const x=qualifiedGradientFixture();assert.deepEqual(validateNativeVariableProofReferences({records:[x.record]}),[]);assert.equal(auditNativeVariableProofs({record:x.record,model:x.model,session:x.session}).ok,true);});
test('closed paint-location evidence rejects duplicate, foreign, malformed, and aggregate-only location records',()=>{for(const mutate of [x=>x.packet.binding_evidence.paint_locations.items.push(structuredClone(x.packet.binding_evidence.paint_locations.items[0])),x=>x.packet.binding_evidence.paint_locations.items[0].node_id='999:1',x=>delete x.packet.binding_evidence.paint_locations.schema_version,x=>delete x.packet.binding_evidence.paint_locations]){const x=qualifiedGradientFixture();mutate(x);assert.equal(auditNativeVariableProofs({record:x.record,model:x.model,session:x.session}).ok,false);}});
test('wrong alias or a changed direct location is refused',()=>{for(const mutate of [x=>x.packet.binding_evidence.paint_locations.items[0].variable_id=green300,x=>x.packet.binding_evidence.paint_locations.items[1].source_path='/fills/0/stops/0/color']){const x=qualifiedGradientFixture();mutate(x);assert.equal(auditNativeVariableProofs({record:x.record,model:x.model,session:x.session}).ok,false);}});

function qualifiedMixedFixture(){
  const f=relationFixture(), node=f.packet.variants[0].source_node.children[0], element=f.record.contracts.mobile.root.children[0], source={component_id:f.record.id,variant_node_id:'101:1',node_id:node.node_id};
  element.render_mode='html-text';Object.assign(node,{characters:'Body link tail',fills:[],text_case:'ORIGINAL',layout_positioning:'AUTO',layout_grow:0,minimum_width_px:null,opacity:1,rotation:0,strokes:[],effects:[],layout:{mode:'VERTICAL',wrap:'NO_WRAP',counter_axis_spacing:0},variable_bindings:{fills:[{id:green500},{id:grey400}],textRangeFills:[{id:green500},{id:grey400}]},text_style:{font_family:null,font_style:null,text_decoration:null}});
  const runs=[
    {start:0,end:4,characters:'Body',font_family:'Roboto',font_style:'Regular',font_size_px:14,line_height:{unit:'PERCENT',value:140},text_decoration:'NONE',fills:[{type:'solid',visible:true,opacity:1,color:'#757678'}]},
    {start:4,end:9,characters:' link',font_family:'Roboto',font_style:'Regular',font_size_px:14,line_height:{unit:'PERCENT',value:140},text_decoration:'NONE',fills:[{type:'solid',visible:true,opacity:1,color:'#00991F'}]},
    {start:9,end:14,characters:' tail',font_family:'Roboto',font_style:'Regular',font_size_px:14,line_height:{unit:'PERCENT',value:140},text_decoration:'NONE',fills:[{type:'solid',visible:true,opacity:1,color:'#757678'}]}
  ];node.styled_text_segments=structuredClone(runs);element.facts.push({id:'styled-text-segments',value:{type:'segments',items:structuredClone(runs)},provenance:{kind:'figma-literal',node_id:node.node_id}});const index=element.facts.length-1, base=`/contracts/mobile/root/children/0/facts/${index}/value/items`;
  const leaves=(value,path=[])=>value&&typeof value==='object'&&!Array.isArray(value)?Object.entries(value).flatMap(([key,item])=>leaves(item,[...path,key])):Array.isArray(value)?value.flatMap((item,index)=>leaves(item,[...path,index])):[path];
  for(const [runIndex,run] of runs.entries())for(const leaf of leaves(run)){const suffix=leaf.join('/');f.record.contracts.figma_fact_links.push({variant_node_id:'101:1',node_id:node.node_id,source_path:`/styled_text_segments/${runIndex}/${suffix}`,contract_path:`${base}/${runIndex}/${suffix}`,transform:'identity'});}
  f.packet.capture_errors.push({node_id:node.node_id,code:'MIXED_VALUE',field:'fills'});f.record.evidence_links.native_context_proofs=[{id:'mixed-text-context',kind:'html-element-context',structure_proof_id:'title-structure'}];
  f.record.evidence_links.native_variable_proofs=[
    {id:'body-grey-variable',kind:'variable-binding',source,contract_path:`/contracts/mobile/root/children/0/facts/${index}/value`,binding_path:'/variable_bindings/textRangeFills/1/id',paint_source_path:'/styled_text_segments/0/fills/0/color',variable:{id:grey400,name:'Grey/400',key:'ee519cb1483388c831c3ea1ab0cedfaf4c143618',collection_id:collectionId,collection_name:'Palette',resolved_type:'COLOR'}},
    {id:'link-green-variable',kind:'variable-binding',source,contract_path:`/contracts/mobile/root/children/0/facts/${index}/value`,binding_path:'/variable_bindings/textRangeFills/0/id',paint_source_path:'/styled_text_segments/1/fills/0/color',variable:{id:green500,name:'Green/500',key:'9ca87e868c2b5c348498f505a95a6049f5ac9df2',collection_id:collectionId,collection_name:'Palette',resolved_type:'COLOR'}}
  ];
  const value=(r,g,b)=>({r,g,b,a:1});f.packet.binding_evidence={variables:[{id:grey400,name:'Grey/400',key:'ee519cb1483388c831c3ea1ab0cedfaf4c143618',remote:true,collection_id:collectionId,resolved_type:'COLOR',values_by_mode:{'1:0':value(117/255,118/255,120/255)}},{id:green500,name:'Green/500',key:'9ca87e868c2b5c348498f505a95a6049f5ac9df2',remote:true,collection_id:collectionId,resolved_type:'COLOR',values_by_mode:{'1:0':value(0,153/255,31/255)}}],collections:[{id:collectionId,name:'Palette',default_mode:'1:0',modes:[{id:'1:0',name:'Default'}]}],usages:[{node_id:node.node_id,binding_path:'/variable_bindings/textRangeFills/0',variable_id:green500,resolved_type:'COLOR',resolved_value:value(0,153/255,31/255),mode_selections:[{collection_id:collectionId,mode_id:'1:0'}]},{node_id:node.node_id,binding_path:'/variable_bindings/textRangeFills/1',variable_id:grey400,resolved_type:'COLOR',resolved_value:value(117/255,118/255,120/255),mode_selections:[{collection_id:collectionId,mode_id:'1:0'}]}],paint_locations:{schema_version:'1.0.0',items:[{node_id:node.node_id,source_path:'/styled_text_segments/0/fills/0/color',variable_id:grey400},{node_id:node.node_id,source_path:'/styled_text_segments/1/fills/0/color',variable_id:green500},{node_id:node.node_id,source_path:'/styled_text_segments/2/fills/0/color',variable_id:grey400}]}};
  return f;
}
test('direct mixed-run locations require every captured same-ID location to agree with the selected Grey anchor',()=>{const f=qualifiedMixedFixture();assert.deepEqual(validateNativeVariableProofReferences({records:[f.record]}),[]);assert.equal(auditNativeVariableProofs({record:f.record,model:f.model,session:f.session}).ok,true);for(const mutate of [x=>x.packet.binding_evidence.paint_locations.items[2].variable_id=green500,x=>x.packet.binding_evidence.paint_locations.items[2].source_path='/styled_text_segments/1/fills/0/color']){const x=qualifiedMixedFixture();mutate(x);assert.equal(auditNativeVariableProofs({record:x.record,model:x.model,session:x.session}).ok,false);}});

test('Contact owns six ORIGINAL text-case facts with one exact lowercase source mapping each',()=>{
  const registry=JSON.parse(readFileSync(new URL('../../data/components/service.yaml',import.meta.url),'utf8'));
  const record=registry.components.find(item=>item.id==='block-contact-support');
  const expected=[['desktop','459:27583'],['desktop','459:27584'],['desktop','459:27586'],['mobile','459:27604'],['mobile','459:27605'],['mobile','459:27607']];
  const found=[];
  function walk(element,path,viewport){
    for(const [index,fact] of (element.facts??[]).entries())if(fact.id==='text-case')found.push({viewport,node_id:fact.provenance?.node_id,path:`${path}/facts/${index}`,fact});
    for(const [index,child] of (element.children??[]).entries())walk(child,`${path}/children/${index}`,viewport);
  }
  for(const viewport of ['desktop','mobile'])walk(record.contracts[viewport].root,'root',viewport);
  assert.deepEqual(found.map(item=>[item.viewport,item.node_id]).sort(),expected.sort());
  for(const item of found){
    assert.deepEqual(item.fact.value,{type:'keyword',value:'original'});
    const variant=record.variants.find(value=>value.id===item.viewport);
    const contractPath=`/contracts/${item.viewport}/${item.path}/value/value`;
    const maps=record.contracts.figma_fact_links.filter(link=>link.variant_node_id===variant.node_id&&link.node_id===item.node_id&&link.source_path==='/text_style/text_case'&&link.contract_path===contractPath&&link.transform==='lowercase');
    assert.equal(maps.length,1,`one lowercase mapping for ${item.node_id}`);
  }
});

async function capturePaintLocations(figma){
  const source=readFileSync(new URL('../../scripts/figma/capture-contract-source.js',import.meta.url),'utf8');
  const context=vm.createContext({figma});new vm.Script(`${source}\nglobalThis.__capture=captureFigmaContractFacts;`).runInContext(context);
  return JSON.parse(JSON.stringify(await context.__capture('1:1',{session_nonce:nonce,request_nonce:request,canonical_git_sha:sha})));
}
test('request-bound producer records direct stop and mixed-run aliases without mutating raw paints or segment fills',async()=>{
  const mixed=Symbol('mixed'), color=(r,g,b)=>({r,g,b,a:1}), variables=new Map([
    [green300,{id:green300,name:'Green/300',key:'704582647f9b095771e51ba7ff67468e310de275',remote:true,variableCollectionId:collectionId,resolvedType:'COLOR',valuesByMode:{'1:0':color(61/255,213/255,92/255)},resolveForConsumer:async()=>({value:color(61/255,213/255,92/255),resolvedType:'COLOR'})}],
    [green400,{id:green400,name:'Green/400',key:'a9015ac7b09ab50dccace9cd298b46dada8b4520',remote:true,variableCollectionId:collectionId,resolvedType:'COLOR',valuesByMode:{'1:0':color(24/255,176/255,55/255)},resolveForConsumer:async()=>({value:color(24/255,176/255,55/255),resolvedType:'COLOR'})}],
    [grey400,{id:grey400,name:'Grey/400',key:'ee519cb1483388c831c3ea1ab0cedfaf4c143618',remote:true,variableCollectionId:collectionId,resolvedType:'COLOR',valuesByMode:{'1:0':color(117/255,118/255,120/255)},resolveForConsumer:async()=>({value:color(117/255,118/255,120/255),resolvedType:'COLOR'})}],
    [green500,{id:green500,name:'Green/500',key:'9ca87e868c2b5c348498f505a95a6049f5ac9df2',remote:true,variableCollectionId:collectionId,resolvedType:'COLOR',valuesByMode:{'1:0':color(0,153/255,31/255)},resolveForConsumer:async()=>({value:color(0,153/255,31/255),resolvedType:'COLOR'})}],
  ]);
  const fill=(value,id)=>({type:'SOLID',visible:true,opacity:1,color:value,boundVariables:{color:{type:'VARIABLE_ALIAS',id}}});
  const text={type:'TEXT',id:'2:1',name:'Help',visible:true,width:100,height:20,fills:mixed,strokes:[],opacity:1,rotation:0,characters:'Body link',fontName:{family:'Roboto',style:'Regular'},fontWeight:400,fontSize:12,lineHeight:{unit:'PERCENT',value:140},letterSpacing:{unit:'PERCENT',value:0},textAlignHorizontal:'LEFT',textAlignVertical:'TOP',textCase:'ORIGINAL',textDecoration:'NONE',textAutoResize:'HEIGHT',textStyleId:'',boundVariables:{textRangeFills:[{type:'VARIABLE_ALIAS',id:green500},{type:'VARIABLE_ALIAS',id:grey400}]},resolvedVariableModes:{[collectionId]:'1:0'},getStyledTextSegments:()=>[{start:0,end:4,characters:'Body',fontName:{family:'Roboto',style:'Regular'},fontSize:12,lineHeight:{unit:'PERCENT',value:140},textDecoration:'NONE',fills:[fill(color(117/255,118/255,120/255),grey400)]},{start:4,end:9,characters:' link',fontName:{family:'Roboto',style:'Regular'},fontSize:12,lineHeight:{unit:'PERCENT',value:140},textDecoration:'NONE',fills:[fill(color(0,153/255,31/255),green500)]}]};
  const component={type:'COMPONENT',id:'1:1',name:'Gradient',visible:true,width:120,height:40,variantProperties:{Viewport:'Mobile'},parent:{type:'COMPONENT_SET',componentPropertyDefinitions:{}},fills:[{type:'GRADIENT_LINEAR',visible:true,opacity:1,gradientStops:[{position:0,color:color(24/255,176/255,55/255),boundVariables:{color:{type:'VARIABLE_ALIAS',id:green400}}},{position:1,color:color(61/255,213/255,92/255),boundVariables:{color:{type:'VARIABLE_ALIAS',id:green300}}}],gradientTransform:[[1,0,0],[0,1,0]]}],strokes:[],opacity:1,rotation:0,children:[text],boundVariables:{fills:[{type:'VARIABLE_ALIAS',id:green300},{type:'VARIABLE_ALIAS',id:green400}]},resolvedVariableModes:{[collectionId]:'1:0'}};
  const figma={fileKey:'native-file',mixed,skipInvisibleInstanceChildren:false,getNodeByIdAsync:async id=>id==='1:1'?component:null,getStyleByIdAsync:async()=>null,variables:{getVariableByIdAsync:async id=>variables.get(id)??null,getVariableCollectionByIdAsync:async id=>id===collectionId?{id,name:'Palette',defaultModeId:'1:0',modes:[{modeId:'1:0',name:'Default'}]}:null,getLocalVariablesAsync:async()=>[...variables.values()],getLocalVariableCollectionsAsync:async()=>[{id:collectionId,name:'Palette',defaultModeId:'1:0',modes:[{modeId:'1:0',name:'Default'}]}]}};
  const packet=await capturePaintLocations(figma), locations=packet.binding_evidence.paint_locations;
  assert.deepEqual(locations,{schema_version:'1.0.0',items:[{node_id:'1:1',source_path:'/fills/0/stops/0/color',variable_id:green400},{node_id:'1:1',source_path:'/fills/0/stops/1/color',variable_id:green300},{node_id:'2:1',source_path:'/styled_text_segments/0/fills/0/color',variable_id:grey400},{node_id:'2:1',source_path:'/styled_text_segments/1/fills/0/color',variable_id:green500}]});
  assert.equal(Object.hasOwn(packet.variants[0].source_node.fills[0].gradient_stops[0],'boundVariables'),false);assert.equal(Object.hasOwn(packet.variants[0].source_node.children[0].styled_text_segments[0].fills[0],'boundVariables'),false);
});
