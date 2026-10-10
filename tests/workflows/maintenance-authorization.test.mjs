import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSystemFixture,copyFixtureFile,canonicalSystemFixtureFiles} from '../helpers/system-fixture.mjs';
import {readStrictYaml} from '../../scripts/lib/strict-yaml.mjs';
import {resolveSkillContext} from '../../scripts/lib/skill-context.mjs';
import * as workflows from '../../scripts/lib/workflow-registry.mjs';
import {validateFigmaNamingShape} from '../../scripts/lib/figma-naming-foundation.mjs';
const root=dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const SHA='a'.repeat(40);
const write=(r,p,v)=>writeFile(join(r,p),JSON.stringify(v,null,2)+'\n');
async function fixture(){const f=await createSystemFixture();for(const p of canonicalSystemFixtureFiles)await copyFixtureFile(root,f.root,p);return f;}
async function activate(r,id,{naming=false}={}){
 const m=await readStrictYaml(join(r,'system/manifest.yaml'));
 const route=m.routes.find(v=>v.id===id),p=m.bundle_profiles.find(v=>v.id===id);
 route.workflow_source_id='workflow-'+id;p.generated_bundle.status='structured-active';
 p.source_ids=[...new Set(p.source_ids.map(s=>s==='workflow-paused'?route.workflow_source_id:s))];p.generated_bundle.static_source_ids=[...p.source_ids];
 const w=await readStrictYaml(join(r,'data/workflows/'+id+'.yaml'));w.workflow.status='active';await write(r,'data/workflows/'+id+'.yaml',w);
 if(naming){const n=await readStrictYaml(join(r,'data/foundations/figma-naming.yaml'));n.foundation.status='active';await write(r,'data/foundations/figma-naming.yaml',n);}
 await write(r,'system/manifest.yaml',m);
 return resolveSkillContext({repoRoot:r,routeId:id,workflowMode:'write',candidates:id==='figma-description-sync'?['button-secondary']:[],viewports:id==='figma-description-sync'?['mobile','desktop']:[]});
}
test('P3: naming format admits active but canonical status stays shadow',async()=>{
 const n=await readStrictYaml(join(root,'data/foundations/figma-naming.yaml'));
 const s=JSON.parse(await readFile(join(root,'schemas/figma-naming.schema.json'),'utf8'));
 assert.equal(n.foundation.status,'shadow');n.foundation.status='active';
 assert.deepEqual(validateFigmaNamingShape(n,s),[]);
});
test('P3: active naming candidate cannot consume a shadow naming foundation',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-naming-audit');assert.equal(c.status,'blocked');assert.ok(c.blockers.some(v=>v.code==='SKILL_ROUTE_STATUS_INACTIVE'&&v.path.includes('figma-naming')));}finally{await f.cleanup();}
});
const before=[{node_id:'1:2',name:'feature-icon@4x',description:'old',type:'FRAME',layoutMode:'HORIZONTAL',width:48,height:48,children:[{node_id:'1:3',type:'VECTOR'}],componentPropertyReferences:{visible:'Show Icon'},boundVariables:{paddingTop:'token'},fills:[]}];
function execution(c,{rename=false,damage=false,authorize=true,noop=false}={}){
 const nodes=structuredClone(before),field=rename?'name':'description',next=noop?nodes[0][field]:(rename?'benefit-icon@4x':'new precise description');
 const preview={pinned_sha:SHA,route_id:c.route.id,file_key:'file',changes:[{node_id:'1:2',pointer:'/'+field,before:nodes[0][field],after:next}],repository_paths:[]};
 const calls=[];
 const handlers=Object.fromEntries(c.workflow.steps.map(s=>[s.id,async()=>{
  calls.push(s.id);
  if(s.id==='pin-canonical-state')return {'pinned-sha':SHA};
  if(s.id==='assess-impact')return {'impact-report':{scope:'fixture'}};
  if(s.id==='inspect-canonical-sources'||s.id==='confirm-naming-semantics')return {'audit-findings':{semantics:[{node_id:'1:2',role:'feature-icon',confirmed:true}]}};
  if(s.id==='inspect-figma-read-only')return {'figma-before':structuredClone(nodes),'audit-findings':{semantics:[{node_id:'1:2',role:'feature-icon',confirmed:true}]}};
  if(s.id==='preview-exact-change')return {'change-preview':preview};
  if(s.id==='apply-authorized-figma-change'){nodes[0][field]=next;if(damage)nodes[0].height=49;return {'figma-change':{node_ids:['1:2']}};}
  if(s.id==='verify-figma-readback')return {'figma-readback':structuredClone(nodes)};
  if(s.id==='synchronize-dependents')return {'repository-change':{paths:[],cloud_sha:SHA}};
  if(s.id==='verify-exact-cloud-commit')return {'verification-summary':{pinned_sha:SHA,checks:[{command:'controlled-fixture-check',exit_code:0}],limitations:['controlled fixture, not live mutation']}};
  if(s.id==='handoff')return {'handoff-summary':{}};
  throw Error('Unexpected handler '+s.id);
 }]));
 return {nodes,calls,preview,options:{context:c,pinnedSha:SHA,inputs:{request:'fixture','target-scope':{file_key:'file',node_ids:['1:2'],repository_paths:[]},'write-authorization':authorize?structuredClone(preview):true},conditions:{},handlers}};
}
test('P3: controlled description write preserves every field except the exact authorized description',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-description-sync');assert.equal(c.status,'resolved');const e=execution(c);const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'complete');assert.equal(e.nodes[0].description,'new precise description');const preserved=structuredClone(e.nodes);preserved[0].description='old';assert.deepEqual(preserved,before);assert.equal(result.handoff.pinned_sha,SHA);assert.ok(e.calls.includes('verify-figma-readback'));}finally{await f.cleanup();}
});
test('P3: mapped rename preserves @4x and all structure; no-op still requires separate readback',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-naming-audit',{naming:true});assert.equal(c.status,'resolved');for(const noop of [false,true]){const e=execution(c,{rename:true,noop});const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'complete');assert.match(e.nodes[0].name,/@4x$/);assert.ok(e.calls.includes('verify-figma-readback'));}}finally{await f.cleanup();}
});
test('P3: unexpected geometry diff stops before dependent sync, verification and publication',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-description-sync');const e=execution(c,{damage:true});const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'blocked');assert.ok(result.blockers.some(v=>v.code==='figma-readback-mismatch'));assert.ok(!e.calls.includes('synchronize-dependents'));assert.ok(!e.calls.includes('verify-exact-cloud-commit'));assert.ok(!e.calls.includes('publish-review'));}finally{await f.cleanup();}
});
test('P3: boolean authorization is not exact authorization and never reaches a write',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-description-sync');const e=execution(c,{authorize:false});const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'blocked');assert.ok(result.blockers.some(v=>v.code==='authorization-scope-mismatch'));assert.ok(!e.calls.includes('apply-authorized-figma-change'));}finally{await f.cleanup();}
});
