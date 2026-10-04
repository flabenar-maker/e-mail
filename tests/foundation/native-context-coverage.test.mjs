import assert from 'node:assert/strict';
import test from 'node:test';
import {fixture as relationFixture} from './native-relationship-coverage.test.mjs';
import {auditFigmaContractFacts} from '../../scripts/lib/figma-contract-facts.mjs';
import {auditNativeRelationProofs} from '../../scripts/lib/native-relationship-coverage.mjs';
// Transport into tests/foundation: fixture() is imported by a data-URL transform
// of native-relationship-coverage.test.mjs, exposing its private base fixture.
const context=await import('../../scripts/lib/native-context-coverage.mjs').catch(e=>e?.code==='ERR_MODULE_NOT_FOUND'&&e.url===new URL('../../scripts/lib/native-context-coverage.mjs',import.meta.url).href?{}:Promise.reject(e));
const api=()=>{for(const k of ['validateNativeContextProofReferences','auditNativeContextProofs','applyNativeContextCoverage'])assert.equal(typeof context[k],'function',`missing native context coverage API: ${k}`);return context;};
const proof={id:'root-context',kind:'html-element-context',structure_proof_id:'root-structure'};
const paths=['/layout_positioning','/layout_grow','/minimum_width_px','/opacity','/rotation','/strokes','/variable_bindings','/effects','/layout/mode','/layout/wrap','/layout/counter_axis_spacing'];
function fixture(){
  const f=relationFixture(),root=f.record.contracts.mobile.root,node=f.packet.variants[0].source_node;
  Object.assign(node,{layout_positioning:'AUTO',layout_grow:0,minimum_width_px:null,opacity:1,rotation:0,strokes:[],variable_bindings:{},effects:[]});
  node.layout={mode:'VERTICAL',wrap:'NO_WRAP',counter_axis_spacing:0};
  root.facts.push(
    {id:'layout-orientation',value:{type:'keyword',value:'vertical'},provenance:{kind:'figma-literal',node_id:node.node_id}},
    {id:'layout-wrap',value:{type:'keyword',value:'no_wrap'},provenance:{kind:'figma-literal',node_id:node.node_id}}
  );
  f.record.contracts.figma_fact_links.push(
    {variant_node_id:'101:1',node_id:node.node_id,source_path:'/layout/mode',contract_path:`/contracts/mobile/root/facts/${root.facts.length-2}/value/value`,transform:'lowercase'},
    {variant_node_id:'101:1',node_id:node.node_id,source_path:'/layout/wrap',contract_path:`/contracts/mobile/root/facts/${root.facts.length-1}/value/value`,transform:'lowercase'}
  );
  f.record.evidence_links.native_context_proofs=[structuredClone(proof)];
  const raw=auditFigmaContractFacts({record:f.record,live:f.packet});
  assert.equal(raw.issues.some(x=>['FIGMA_CONTRACT_MISMATCH','CONTRACT_FACT_UNMAPPED'].includes(x.code)),false,'raw baseline');
  assert.equal(auditNativeRelationProofs({record:f.record,model:f.model,session:f.session}).ok,true,'relation baseline');
  return {...f,node,raw};
}
test('context metadata is closed and refers to an existing structure proof',()=>{const f=fixture();api().validateNativeContextProofReferences({records:[f.record]});});
test('mobile root context accepts default leaf paths and vertical no-wrap direct maps',()=>{const f=fixture();assert.equal(api().auditNativeContextProofs(f).ok,true);});
for(const [name,mutate] of [['opacity',f=>f.node.opacity=.5],['rotation',f=>f.node.rotation=1],['strokes',f=>f.node.strokes=[{}]],['effects',f=>f.node.effects=[{type:'DROP_SHADOW'}]],['minimum width',f=>f.node.minimum_width_px=20],['spacing',f=>f.node.layout.counter_axis_spacing=1],['absolute positioning',f=>f.node.layout_positioning='ABSOLUTE']])test(`rejects ${name} context drift`,()=>{const f=fixture();mutate(f);assert.equal(api().auditNativeContextProofs(f).ok,false);});
test('rejects a missing structure proof or wrong mobile root node',()=>{const f=fixture();f.record.evidence_links.native_context_proofs[0].structure_proof_id='missing';assert.equal(api().auditNativeContextProofs(f).ok,false);});
test('copied coverage cannot filter actual raw facts and future fields stay uncovered',()=>{const f=fixture(),coverage=api().auditNativeContextProofs(f),future=structuredClone(f.packet);future.variants[0].source_node.future_field=true;const raw=auditFigmaContractFacts({record:f.record,live:future});assert.equal(api().applyNativeContextCoverage({facts:raw,coverage:structuredClone(coverage)}),raw);});
