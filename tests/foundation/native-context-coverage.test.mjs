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



test('html-link receives ordinary HTML context only through its own structure proof', () => {
  const f = fixture(), element = f.record.contracts.mobile.root.children[1], node = f.packet.variants[0].source_node.children[1];
  element.render_mode = 'html-link'; element.semantic_role = 'help-link'; node.node_type = 'TEXT'; node.name = 'help-link';
  Object.assign(node, {layout_positioning: 'AUTO', layout_grow: 0, minimum_width_px: null, opacity: 1, rotation: 0, strokes: [], variable_bindings: {}, fills: []});
  f.record.evidence_links.native_context_proofs = [{id: 'link-context', kind: 'html-element-context', structure_proof_id: 'detail-structure'}];
  assert.equal(api().auditNativeContextProofs(f).ok, true);
});

test('ordinary false clips_content is semantic absence, while true needs an exact typed Boolean map', () => {
  const f = fixture(); f.node.clips_content = false;
  const coverage = api().auditNativeContextProofs(f); assert.equal(coverage.ok, true);
  assert.ok(coverage.verified_sources.some(source => source.source_path === '/clips_content'));
  f.node.clips_content = true;
  assert.equal(api().auditNativeContextProofs(f).ok, false);
  f.record.contracts.mobile.root.facts.push({id: 'clip-content', value: {type: 'boolean', value: true}, provenance: {kind: 'figma-literal', node_id: f.node.node_id}});
  f.record.contracts.figma_fact_links.push({variant_node_id: '101:1', node_id: f.node.node_id, source_path: '/clips_content', contract_path: `/contracts/mobile/root/facts/${f.record.contracts.mobile.root.facts.length - 1}/value/value`, transform: 'identity'});
  assert.equal(api().auditNativeContextProofs(f).ok, true);
});
for (const [label, mutate] of [
  ['wrong Boolean value', f => { f.record.contracts.mobile.root.facts.at(-1).value.value = false; }],
  ['wrong Boolean type', f => { f.record.contracts.mobile.root.facts.at(-1).value.type = 'keyword'; }],
  ['wrong Boolean provenance', f => { f.record.contracts.mobile.root.facts.at(-1).provenance.node_id = '101:2'; }],
  ['missing Boolean map', f => { f.record.contracts.figma_fact_links.pop(); }],
]) test(`active clips_content rejects ${label}`, () => {
  const f = fixture(); f.node.clips_content = true;
  f.record.contracts.mobile.root.facts.push({id: 'clip-content', value: {type: 'boolean', value: true}, provenance: {kind: 'figma-literal', node_id: f.node.node_id}});
  f.record.contracts.figma_fact_links.push({variant_node_id: '101:1', node_id: f.node.node_id, source_path: '/clips_content', contract_path: `/contracts/mobile/root/facts/${f.record.contracts.mobile.root.facts.length - 1}/value/value`, transform: 'identity'});
  mutate(f); assert.equal(api().auditNativeContextProofs(f).ok, false);
});

test('non-null minimum width needs a same-node mapped px measure', () => {
  const f = fixture(); f.node.minimum_width_px = 24;
  assert.equal(api().auditNativeContextProofs(f).ok, false);
  f.record.contracts.mobile.root.facts.push({id: 'minimum-width', value: {type: 'measure', value: 24, unit: 'px'}, provenance: {kind: 'figma-literal', node_id: f.node.node_id}});
  f.record.contracts.figma_fact_links.push({variant_node_id: '101:1', node_id: f.node.node_id, source_path: '/minimum_width_px', contract_path: `/contracts/mobile/root/facts/${f.record.contracts.mobile.root.facts.length - 1}/value/value`, transform: 'identity'});
  assert.equal(api().auditNativeContextProofs(f).ok, true);
});
for (const [label, mutate] of [
  ['wrong unit', f => { f.record.contracts.mobile.root.facts.at(-1).value.unit = 'percent'; }],
  ['wrong value type', f => { f.record.contracts.mobile.root.facts.at(-1).value.type = 'integer'; delete f.record.contracts.mobile.root.facts.at(-1).value.unit; }],
  ['wrong provenance', f => { f.record.contracts.mobile.root.facts.at(-1).provenance.node_id = '101:2'; }],
  ['wrong source path', f => { f.record.contracts.figma_fact_links.at(-1).source_path = '/minimum_width'; }],
  ['missing map', f => { f.record.contracts.figma_fact_links.pop(); }],
  ['wrong value', f => { f.record.contracts.mobile.root.facts.at(-1).value.value = 25; }],
]) test(`non-null minimum width rejects ${label}`, () => {
  const f = fixture(); f.node.minimum_width_px = 24;
  f.record.contracts.mobile.root.facts.push({id: 'minimum-width', value: {type: 'measure', value: 24, unit: 'px'}, provenance: {kind: 'figma-literal', node_id: f.node.node_id}});
  f.record.contracts.figma_fact_links.push({variant_node_id: '101:1', node_id: f.node.node_id, source_path: '/minimum_width_px', contract_path: `/contracts/mobile/root/facts/${f.record.contracts.mobile.root.facts.length - 1}/value/value`, transform: 'identity'});
  mutate(f); assert.equal(api().auditNativeContextProofs(f).ok, false);
});


// Break protected: an ordinary HTML boolean clipping value is accidentally
// accepted as PNG export preservation without its exact same-node fact map.
test('ordinary HTML clipping remains scalar coverage and never export preservation', () => {
  const f = fixture(); f.node.clips_content = false;
  let coverage = api().auditNativeContextProofs(f);
  assert.equal(coverage.ok, true);
  assert.ok(coverage.verified_sources.some(item => item.source_path === '/clips_content'));
  assert.ok(Array.isArray(coverage.export_preserved_sources), 'missing export_preserved_sources');
  assert.ok(Array.isArray(coverage.not_required_sources), 'missing not_required_sources');
  assert.deepEqual(coverage.export_preserved_sources, []);
  assert.deepEqual(coverage.not_required_sources, []);
  assert.equal(coverage.export_preserved_source_fact_count, 0);
  assert.equal(coverage.not_required_source_fact_count, 0);
  f.node.clips_content = true;
  assert.equal(api().auditNativeContextProofs(f).ok, false);
});
