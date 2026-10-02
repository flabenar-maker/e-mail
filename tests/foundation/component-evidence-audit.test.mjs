import assert from "node:assert/strict";
import test from "node:test";
import * as combined from "../../scripts/lib/figma-component-evidence.mjs";
import { auditFigmaContractFacts } from "../../scripts/lib/figma-contract-facts.mjs";

// Synthetic inputs, not real MCP evidence or new canonical library mappings.
const SHA = "a".repeat(40);
function fixture() {
  const record = { id: "synthetic-template", identity: { semantic_role: "template", node_kind: "component-set" },
    figma: { file_key: "synthetic", node_id: "71:1" }, asset_contracts: [],
    variants: ["Desktop", "Mobile"].map((value,i) => ({id:value.toLowerCase(),node_id:`71:${i+2}`,axes:[{name:"Viewport",value}]})),
    contracts: {figma_fact_links: []}, evidence_links: {foundation_values:[],source_dependencies:[]} };
  const node = (id,type,width) => ({node_id:id,node_type:type,visible:true,opacity:1,
    reference_dimensions:{width,height:1000,unit:"px"},fills:[{type:"solid",visible:true,opacity:1,color:"#F3F3F5"}],
    layout:{mode:"VERTICAL",horizontal_sizing:"FIXED",vertical_sizing:"HUG",padding:{top:0,right:0,bottom:0,left:0}},children:[]});
  const variants=record.variants.map((variant,i)=> {
    const root=node(variant.node_id,"COMPONENT",i?328:600);
    root.children=[node(`72:${i+1}`,"SLOT",i?328:600)];
    const viewport=variant.id;
    record.contracts[viewport]={root:{render_mode:"presentation-table",facts:[],children:[{render_mode:"slot",facts:[],children:[]}]}};
    const add=(id,n,field,pointer,comparison)=>record.evidence_links.foundation_values.push({id:`${viewport}-${id}`,source:{variant_node_id:root.node_id,node_id:n.node_id,field_path:field},target:{source_id:"rendering-foundation",pointer},comparison});
    add("background",root,"/fills/0/color","/shell/background_color","opaque-solid-color");
    add("slot",root.children[0],"/fills/0/color","/shell/background_color","opaque-solid-color");
    if(!i)add("width",root,"/reference_dimensions/width","/shell/max_width_px","pixel-number");
    for(const side of ["left","right"])add(side,root,`/layout/padding/${side}`,"/shell/horizontal_inset_px","pixel-number");
    return {variant_node_id:root.node_id,axes:variant.axes,source_node:root};
  });
  const live={capture_version:"1.1.0",file_key:"synthetic",component_node_id:"71:1",component_properties:[],capture_errors:[],variants,
    capture_meta:{started_at:"2026-10-02T09:00:01.000Z",completed_at:"2026-10-02T09:00:02.000Z",tree_complete:true,node_count:4}};
  const model={canonical_sha:SHA,records:[record],manifest:{sources:[{id:"rendering-foundation",kind:"registry",path:"data/foundations/rendering.yaml"}]},
    source_documents:new Map([["rendering-foundation",{shell:{background_color:"#F3F3F5",max_width_px:600,horizontal_inset_px:0}}]])};
  const session={schema_version:"1.0.0",canonical_git_sha:SHA,started_at:"2026-10-02T09:00:00.000Z",completed_at:"2026-10-02T09:00:04.000Z",component_ids:[record.id],
    captures:[{component_id:record.id,receipt_id:"synthetic",tool:"use_figma",received_at:"2026-10-02T09:00:03.000Z",packet:live}]};
  return {record,live,model,session};
}
const audit = input => combined.auditFigmaComponentEvidence(input);
const has = (report,code) => report.issues.some(i=>i.code===code);

test("combined audit preserves every scalar diagnostic even when all nine shell links pass",()=>{
  const f=fixture(), before=structuredClone(f), facts=auditFigmaContractFacts(f), report=audit(f);
  assert.equal(report.evidence_links.ok,true); assert.equal(report.evidence_links.verified_sources.length,9);
  assert.equal(facts.ok,false); assert.equal(report.ok,false);
  assert.deepEqual(report.facts,facts); assert.deepEqual(report.issues,facts.issues);
  assert.ok(has(report,"FIGMA_FACT_UNCOVERED")); assert.deepEqual(f,before);
});
for(const [label,mutate,code] of [
  ["mismatch",f=>{
    f.record.contracts.desktop.root.facts.push({id:"height",value:{type:"integer",value:999},provenance:{kind:"figma-literal",node_id:"71:2"}});
    f.record.contracts.figma_fact_links.push({variant_node_id:"71:2",node_id:"71:2",source_path:"/reference_dimensions/height",contract_path:"/contracts/desktop/root/facts/0/value/value",transform:"identity"});
  },"FIGMA_CONTRACT_MISMATCH"],
  ["missing source",f=>f.record.contracts.figma_fact_links.push({variant_node_id:"71:2",node_id:"71:2",source_path:"/missing",contract_path:"/contracts/desktop/root/facts/0/value/value",transform:"identity"}),"FIGMA_SOURCE_PATH_MISSING"],
  ["unmapped value",f=>f.record.contracts.mobile.root.facts.push({id:"orphan",value:{type:"integer",value:8}}),"CONTRACT_FACT_UNMAPPED"],
  ["unsupported capture",f=>f.live.capture_errors.push({node_id:"71:2",code:"PAINT_UNSUPPORTED",field:"fills"}),"FIGMA_CAPTURE_UNSUPPORTED"],
])test(`combined audit retains exact ${label} diagnostics`,()=>{
  const f=fixture();mutate(f);const facts=auditFigmaContractFacts(f), report=audit(f);
  assert.ok(has(report,code));assert.deepEqual(report.facts,facts);
  assert.deepEqual(report.issues.slice(0,facts.issues.length),facts.issues);assert.equal(report.ok,false);
});
test("combined audit reports missing links independently of successful scalar matches",()=>{
  const f=fixture();delete f.record.evidence_links;
  const r=audit(f);assert.equal(r.evidence_links.ok,false);
  assert.equal(r.evidence_links.issues.filter(i=>i.code==="EVIDENCE_REQUIRED_LINK_MISSING").length,9);
  assert.equal(r.ok,false);
});
for(const version of ["1.0.0","1.1.0"])test(`old call with ${version} cannot silently approve Template evidence`,()=>{
  const f=fixture();f.live.capture_version=version;
  const r=audit({record:f.record,live:f.live});
  assert.ok(has(r,"EVIDENCE_SESSION_REQUIRED"));assert.equal(r.evidence_links.canonical_git_sha,null);
  assert.deepEqual(r.facts,auditFigmaContractFacts(f));assert.equal(r.ok,false);
});
test("session cannot certify a caller-modified canonical record",()=>{
  const f=fixture();const record=structuredClone(f.record);record.contracts.mobile.root.facts.push({id:"injected",value:{type:"integer",value:9}});
  const r=audit({...f,record});assert.ok(has(r,"EVIDENCE_CANONICAL_RECORD_MISMATCH"));assert.equal(r.evidence_links.verified_sources.length,0);assert.equal(r.ok,false);
});
test("session cannot certify a separately supplied packet different from its captured packet",()=>{
  const f=fixture(),live=structuredClone(f.live);live.variants[0].source_node.reference_dimensions.height=999;
  const r=audit({...f,live});assert.ok(has(r,"EVIDENCE_LIVE_PACKET_MISMATCH"));assert.equal(r.evidence_links.verified_sources.length,0);
});
test("equivalent record and packet copies retain canonical equality",()=>{
  const f=fixture();const r=audit({...f,record:structuredClone(f.record),live:structuredClone(f.live)});
  assert.equal(r.evidence_links.ok,true);
});
for(const part of ["model","session"])test(`one missing context part ${part} cannot pass`,()=>{
  const f=fixture();delete f[part];const r=audit(f);assert.ok(has(r,"EVIDENCE_SESSION_REQUIRED"));assert.equal(r.ok,false);
});
test("unknown capture version remains unsupported in the combined report",()=>{
  const f=fixture();f.live.capture_version="9.0.0";const r=audit(f);assert.ok(has(r,"FIGMA_CAPTURE_VERSION_UNSUPPORTED"));assert.equal(r.ok,false);
});
test("ordinary HTML without artwork does not acquire a synthetic evidence scope",()=>{
  const record={id:"plain",identity:{semantic_role:"block"},figma:{file_key:"synthetic",node_id:"81:1"},asset_contracts:[],variants:[{node_id:"81:2"},{node_id:"81:3"}],contracts:{figma_fact_links:[],mobile:{root:{facts:[],children:[]}},desktop:{root:{facts:[],children:[]}}}};
  const live={capture_version:"1.0.0",file_key:"synthetic",component_node_id:"81:1",component_properties:[],capture_errors:[],variants:[{variant_node_id:"81:2",axes:[{name:"Viewport",value:"Mobile"}],source_node:{node_id:"81:2"}},{variant_node_id:"81:3",axes:[{name:"Viewport",value:"Desktop"}],source_node:{node_id:"81:3"}}]};
  const r=audit({record,live});assert.equal(r.ok,true);assert.equal(r.facts.ok,true);assert.equal(r.evidence_links.ok,true);assert.deepEqual(r.evidence_links.required_sources,[]);assert.deepEqual(r.issues,[]);
});
test("combined audit forwards existing derived evidence without treating it as link proof",()=>{
  const f=fixture();f.record.contracts.mobile.root.facts.push({id:"derived",value:{type:"integer",value:8},provenance:{kind:"registry-literal",source_blob_sha:"b".repeat(40)}});
  const derivedEvidence=[{component_id:f.record.id,contract_path:"/contracts/mobile/root/facts/0/value",source_blob_sha:"b".repeat(40),value:{type:"integer",value:8}}];
  const r=audit({...f,derivedEvidence});assert.deepEqual(r.facts,auditFigmaContractFacts({...f,derivedEvidence}));
  assert.equal(r.facts.issues.some(i=>i.code==="CONTRACT_FACT_UNMAPPED"&&i.contract_path==="/contracts/mobile/root/facts/0/value/value"),false);
  assert.equal(r.evidence_links.verified_sources.length,9);
});
for(const withSession of [false,true])test(`scalar PASS cannot hide an unproven source-only dependency, session=${withSession}`,()=>{
  const f=fixture();
  const record={id:"synthetic-artwork",identity:{semantic_role:"asset",node_kind:"component"},figma:{file_key:"synthetic",node_id:"88:1"},variants:[],asset_contracts:[],
    contracts:{mobile:{root:{render_mode:"figma-source-only",facts:[],children:[]}},desktop:{root:{render_mode:"figma-source-only",facts:[],children:[]}},
      figma_fact_links:[{variant_node_id:"88:1",node_id:"88:1",source_path:"/node_type",contract_path:"/identity/node_kind",transform:"lowercase"}]}};
  const live={...f.live,component_node_id:"88:1",capture_meta:{...f.live.capture_meta,node_count:2},variants:[{variant_node_id:"88:1",axes:[],source_node:{node_id:"88:1",node_type:"COMPONENT",children:[{node_id:"88:2",node_type:"INSTANCE",main_component_id:"88:3",children:[]}]}}]};
  f.model.records=[record];f.session.component_ids=[record.id];f.session.captures=[{...f.session.captures[0],component_id:record.id,packet:live}];
  const r=audit({record,live,...(withSession?{model:f.model,session:f.session}:{})});
  assert.equal(r.facts.ok,true,JSON.stringify(r.facts));assert.equal(r.evidence_links.ok,false);assert.equal(r.ok,false);
  assert.equal(r.evidence_links.required_sources.length,1);
  assert.ok(has(r,withSession?"EVIDENCE_REQUIRED_LINK_MISSING":"EVIDENCE_SESSION_REQUIRED"));
});
