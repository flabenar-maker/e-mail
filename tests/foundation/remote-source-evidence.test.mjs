import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { auditComponentEvidenceLinks, auditNestedArtworkEvidence, auditFigmaComponentEvidence } from '../../scripts/lib/figma-component-evidence.mjs';
import { collectEvidenceConsumers, validateEvidenceLinkReferences } from '../../scripts/lib/component-evidence-links.mjs';
import { auditFigmaContractFacts } from '../../scripts/lib/figma-contract-facts.mjs';
import { validateComponentRegistryShape, validateComponentRegistrySemantics } from '../../scripts/lib/component-registry.mjs';

// Independent synthetic current-file lookup and publication identities, not live Figma measurements.
const SHA='a'.repeat(40), nonce=n=>n.toString(16).padStart(64,'0'), SN=nonce(1), KEY='synthetic-publication-key';
const axes=v=>[{name:'Viewport',value:v}];
const node=(id,type,children=[],name=id)=>({node_id:id,node_type:type,name,visible:true,opacity:1,reference_dimensions:{width:24,height:24,unit:'px'},children});
const record=(id,owner,role,variants)=>({id,status:'active',identity:{figma_name:id,node_kind:variants.length?'component-set':'component',library:'shared',semantic_role:role,category:id},
  figma:{file_key:'synthetic-current-file',node_id:owner,source_root_node_id:owner,verified_at:'2026-10-02',structure_fingerprint:'sha256:'+'0'.repeat(64)},variants,properties:[],asset_contracts:[],
  contracts:{mobile:{root:{id:'root',semantic_role:role,render_mode:'presentation-table',visibility:{mode:'always'},facts:[],children:[]}},
    desktop:{root:{id:'root',semantic_role:role,render_mode:'presentation-table',visibility:{mode:'always'},facts:[],children:[]}},figma_fact_links:[]},
  provenance:{node_id:owner,captured_at:'2026-10-02T00:00:00Z'},documentation:{purpose:'Synthetic source for mechanism regression.',critical_constraint_ids:[]},constraints:[]});
const variants=(m,d)=>[{id:'mobile',node_id:m,axes:axes('Mobile')},{id:'desktop',node_id:d,axes:axes('Desktop')}];
function addElement(owner,viewport,variantId,id,mode,target) {
  const value={id:'owned-child',semantic_role:'graphic',render_mode:mode,...target,visibility:{mode:'always'},children:[],facts:[{id:'reference-size',value:{type:'dimensions',width:24,height:24,unit:'px'},provenance:{kind:'figma-literal',node_id:id}}]};
  owner.contracts[viewport].root.children.push(value);
  for(const dimension of ['width','height']) owner.contracts.figma_fact_links.push({variant_node_id:variantId,node_id:id,source_path:'/reference_dimensions/'+dimension,contract_path:`/contracts/${viewport}/root/children/0/facts/0/value/${dimension}`,transform:'identity'});
}
function fixture() {
  const parent=record('parent','300:0','block',variants('301:1','301:2'));
  const item=record('item','400:0','item',variants('401:1','401:2'));
  const glyph=record('glyph','500:1','icon',[]);glyph.figma.remote_source={component_key:KEY};
  for(const v of ['mobile','desktop']) glyph.contracts[v].root.render_mode='figma-source-only';
  item.asset_contracts=[{id:'item-artwork',owner_layer_name:'artwork @4x',source_viewport:'desktop',source_mode_id:'rendered-node',export_boundary:{kind:'node',semantic_node_name:'artwork @4x'}}];
  item.evidence_links={foundation_values:[],source_dependencies:[]};
  const parentTrees=[],itemTrees=[];
  for(const [v,parentId,itemId,placement,artwork] of [['mobile','301:1','401:1','301:10','401:10'],['desktop','301:2','401:2','301:20','401:20']]) {
    const native={...node(artwork,'INSTANCE',[node(`I${artwork};500:2`,'VECTOR')],'artwork @4x'),main_component_id:'500:1'};
    const actual={...node(`I${placement};${artwork}`,'INSTANCE',[node(`I${placement};${artwork};500:2`,'VECTOR')],'artwork @4x'),main_component_id:'500:1'};
    parentTrees.push(node(parentId,'COMPONENT',[{...node(placement,'INSTANCE',[actual],'item'),main_component_id:itemId}]));
    itemTrees.push(node(itemId,'COMPONENT',[native]));
    addElement(parent,v,parentId,placement,'nested-component',{component_id:'item'});
    addElement(item,v,itemId,artwork,'direct-image',{asset_contract_id:'item-artwork'});
    item.evidence_links.source_dependencies.push({id:v+'-glyph',source:{variant_node_id:itemId,node_id:artwork},target:{component_id:'glyph'},asset_owner:{node_id:artwork,asset_id:'item-artwork'}});
  }
  const model={canonical_sha:SHA,records:[parent,item,glyph],manifest:{sources:[]},source_documents:new Map()};
  const session={schema_version:'1.1.0',canonical_git_sha:SHA,session_nonce:SN,started_at:'2026-10-02T00:00:00.000Z',completed_at:'2026-10-02T00:00:10.000Z',component_ids:['parent','item','glyph'],captures:[]};
  const count=n=>1+(n.children??[]).reduce((s,c)=>s+count(c),0);
  const add=(owner,trees)=>{const i=session.captures.length,rn=nonce(i+10);const packet={capture_version:'1.2.0',file_key:owner.figma.file_key,component_node_id:owner.figma.node_id,component_properties:[],capture_errors:[],
    capture_meta:{started_at:'2040-01-01T00:00:01.000Z',completed_at:'2040-01-01T00:00:02.000Z',tree_complete:true,node_count:trees.reduce((s,r)=>s+count(r),0),request:{session_nonce:SN,request_nonce:rn,canonical_git_sha:SHA}},
    variants:trees.map((root,j)=>({variant_node_id:root.node_id,axes:owner.variants[j]?.axes??[],source_node:root}))};
    session.captures.push({component_id:owner.id,receipt_id:owner.id+'-receipt',tool:'use_figma',request_nonce:rn,requested_at:`2026-10-02T00:00:0${i}.000Z`,received_at:`2026-10-02T00:00:0${i+1}.000Z`,packet});return packet;};
  const pp=add(parent,parentTrees),ip=add(item,itemTrees),gp=add(glyph,[{...node('500:1','COMPONENT',[node('500:2','VECTOR')]),remote_source:{remote:true,component_key:KEY}}]);
  return {parent,item,glyph,model,session,pp,ip,gp};
}
const run=f=>auditComponentEvidenceLinks({recordId:'item',model:f.model,session:f.session});
const nested=f=>auditNestedArtworkEvidence({recordId:'parent',model:f.model,session:f.session});
const has=(r,c)=>r.issues.some(i=>i.code===c);
test('synthetic registered remote target, own links and nested ancestry are otherwise valid',()=>{const f=fixture();assert.deepEqual(validateEvidenceLinkReferences({records:f.model.records}),[]);assert.equal(run(f).ok,true);assert.equal(nested(f).ok,true);assert.equal(nested(f).dependencies.length,2);});
for(const [label,value] of [['missing',undefined],['wrong key',{remote:true,component_key:'another-key'}],['local lookalike',{remote:false,component_key:KEY}],['empty key',{remote:true,component_key:''}],['extra field',{remote:true,component_key:KEY,ignored:true}]]) {
  test('own and nested proof reject remote '+label,()=>{const f=fixture();if(value===undefined)delete f.gp.variants[0].source_node.remote_source;else f.gp.variants[0].source_node.remote_source=structuredClone(value);
    for(const r of [run(f),nested(f)]){assert.equal(r.ok,false);assert.ok(has(r,'EVIDENCE_REMOTE_SOURCE_IDENTITY_MISMATCH'));}});
}
test('wrong root owner cannot be rescued by the correct publication key',()=>{const f=fixture();f.gp.component_node_id='500:9';assert.ok(has(run(f),'EVIDENCE_CAPTURE_IDENTITY_MISMATCH'));assert.equal(nested(f).ok,false);});
test('local source compatibility and all scalar/capture diagnostics remain',()=>{const f=fixture();delete f.glyph.figma.remote_source;delete f.gp.variants[0].source_node.remote_source;assert.equal(run(f).ok,true);assert.equal(nested(f).ok,true);
  f.ip.capture_errors.push({node_id:'401:10',code:'MIXED_VALUE',field:'fills'});const before=auditFigmaContractFacts({record:f.parent,live:f.pp});const r=auditFigmaComponentEvidence({record:f.parent,live:f.pp,model:f.model,session:f.session});assert.deepEqual(r.facts,before);assert.ok(has(r.nested_artwork,'EVIDENCE_CAPTURE_ERROR'));assert.equal(r.ok,false);});
test('consumer impact cannot confirm a forged verified report with a wrong remote key',()=>{const f=fixture(),report=run(f);assert.equal(report.ok,true);f.gp.variants[0].source_node.remote_source.component_key='other';const r=collectEvidenceConsumers({model:f.model,session:f.session,reports:[report],sourceComponentId:'glyph'});assert.deepEqual(r.confirmed,[]);assert.ok(r.issues.some(i=>i.code==='EVIDENCE_REPORT_CONTEXT_MISMATCH'));});
test('remote inputs remain immutable',()=>{const f=fixture(),before=structuredClone(f);run(f);nested(f);assert.deepEqual(f,before);});

function envelope(glyph) {return {schema_version:'2.2.0',registry:{id:'components-shared',library:'shared',status:'active',source:{figma_file_key:'synthetic-current-file',roots:[{role:'remote-reference',node_id:'500:1'}],baseline_commit:'b'.repeat(40),verified_at:'2026-10-02'}},components:[glyph]};}
const semantics=document=>validateComponentRegistrySemantics({registries:{shared:document},typography:{},spacing:{},assets:{}});
test('schema and semantics permit only an explicit Shared source-only remote lookup',async()=>{const doc=envelope(fixture().glyph),schema=JSON.parse(await readFile(new URL('../../schemas/components.schema.json',import.meta.url),'utf8'));assert.deepEqual(validateComponentRegistryShape(doc,schema),[]);assert.deepEqual(semantics(doc),[]);});
for(const [label,mutate] of [
  ['missing key',d=>delete d.components[0].figma.remote_source],['empty key',d=>d.components[0].figma.remote_source.component_key=' '],
  ['local ancestry',d=>d.registry.source.roots[0].role='library'],['different root',d=>{d.registry.source.roots[0].node_id='600:1';d.components[0].figma.source_root_node_id='600:1';}],
  ['HTML',d=>d.components[0].contracts.mobile.root.render_mode='presentation-table'],['block role',d=>d.components[0].identity.semantic_role='block'],
  ['asset export',d=>d.components[0].asset_contracts.push({id:'fabricated-export'})],['child structure',d=>d.components[0].contracts.desktop.root.children.push({id:'child',render_mode:'figma-source-only',facts:[],children:[]})],
]) test('registry rejects remote '+label,()=>{const d=envelope(fixture().glyph);mutate(d);assert.ok(semantics(d).some(e=>e.code==='COMPONENT_REGISTRY_REMOTE_SOURCE_INVALID'));});
test('schema preserves remote status and key in captured source nodes',async()=>{const doc=envelope(fixture().glyph),schema=JSON.parse(await readFile(new URL('../../schemas/components.schema.json',import.meta.url),'utf8'));doc.components[0].contracts.source_variants=[{variant_node_id:'500:1',axes:[],source_node:fixture().gp.variants[0].source_node}];assert.deepEqual(validateComponentRegistryShape(doc,schema),[]);});
test('local names still require the CUPIS namespace when no remote source is registered',async()=>{const doc=envelope(fixture().glyph),schema=JSON.parse(await readFile(new URL('../../schemas/components.schema.json',import.meta.url),'utf8'));delete doc.components[0].figma.remote_source;doc.registry.source.roots[0].role='library';assert.ok(validateComponentRegistryShape(doc,schema).some(e=>e.path==='/components/0/identity/figma_name'));doc.components[0].identity.figma_name='Icon/Glyph';assert.deepEqual(validateComponentRegistryShape(doc,schema),[]);});

async function captured(remote,key=KEY) {const component={id:'700:1',type:'COMPONENT',name:'synthetic-source',width:24,height:24,visible:true,remote,key,children:[],componentPropertyDefinitions:{}};
  const api={fileKey:'synthetic-current-file',skipInvisibleInstanceChildren:true,mixed:Symbol('mixed'),getNodeByIdAsync:async()=>component};const script=await readFile(new URL('../../scripts/figma/capture-contract-source.js',import.meta.url),'utf8');
  const result=await vm.runInNewContext(script+`\ncaptureFigmaContractFacts('700:1', ${JSON.stringify({session_nonce:SN,request_nonce:nonce(2),canonical_git_sha:SHA})})`,{figma:api,Date});assert.equal(api.skipInvisibleInstanceChildren,true);return JSON.parse(JSON.stringify(result));}
test('capture records actual remote publication identity without changing numeric facts',async()=>{const p=await captured(true);assert.deepEqual(p.variants[0].source_node.remote_source,{remote:true,component_key:KEY});assert.deepEqual(p.variants[0].source_node.reference_dimensions,{width:24,height:24,unit:'px'});assert.equal(p.capture_version,'1.2.0');assert.equal(p.capture_meta.request.canonical_git_sha,SHA);});
test('capture does not invent remote identity for a local source',async()=>{const p=await captured(false);assert.equal(Object.hasOwn(p.variants[0].source_node,'remote_source'),false);});
test('capture keeps an unresolved remote key as a diagnostic',async()=>{const p=await captured(true,'');assert.ok(p.capture_errors.some(e=>e.code==='REMOTE_SOURCE_UNRESOLVED'));assert.equal(Object.hasOwn(p.variants[0].source_node,'remote_source'),false);});


test("registry documentation renders a remote publication key only for remote sources", async () => {
  const { renderComponentRegistrySection } = await import("../../scripts/lib/component-registry-doc.mjs");
  const { indexComponentRegistries } = await import("../../scripts/lib/component-registry.mjs");
  const remote = fixture().glyph;
  const remoteIndex = indexComponentRegistries({ shared: envelope(remote) });
  const remoteOutput = renderComponentRegistrySection(remote, remoteIndex);
  assert.match(remoteOutput, /- Remote publication key: `synthetic-publication-key`/);
  const local = structuredClone(remote);
  delete local.figma.remote_source;
  const localIndex = indexComponentRegistries({ shared: envelope(local) });
  const localOutput = renderComponentRegistrySection(local, localIndex);
  assert.doesNotMatch(localOutput, /- Remote publication key:/);
});


test("schema permits null native minimum width without permitting other null or string dimensions", async () => {
  const schema = JSON.parse(await readFile(new URL("../../schemas/components.schema.json", import.meta.url), "utf8"));
  const f = fixture();
  const document = envelope(f.glyph);
  const sourceNode = structuredClone(f.gp.variants[0].source_node);
  sourceNode.minimum_width_px = null;
  sourceNode.children[0].minimum_width_px = null;
  document.components[0].contracts.source_variants = [{ variant_node_id: "500:1", axes: [], source_node: sourceNode }];
  assert.deepEqual(validateComponentRegistryShape(document, schema), []);
  const stringMinimum = structuredClone(document);
  stringMinimum.components[0].contracts.source_variants[0].source_node.minimum_width_px = "24";
  assert.ok(validateComponentRegistryShape(stringMinimum, schema).length > 0);
  const nullWidth = structuredClone(document);
  nullWidth.components[0].contracts.source_variants[0].source_node.reference_dimensions.width = null;
  assert.ok(validateComponentRegistryShape(nullWidth, schema).length > 0);
});
