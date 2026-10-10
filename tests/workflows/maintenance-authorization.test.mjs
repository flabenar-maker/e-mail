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
async function activate(r,id,{naming=false,mode='write'}={}){
 const m=await readStrictYaml(join(r,'system/manifest.yaml'));
 const route=m.routes.find(v=>v.id===id),p=m.bundle_profiles.find(v=>v.id===id);
 route.workflow_source_id='workflow-'+id;p.generated_bundle.status='structured-active';
 p.source_ids=[...new Set(p.source_ids.map(s=>s==='workflow-paused'?route.workflow_source_id:s))];p.generated_bundle.static_source_ids=[...p.source_ids];
 const w=await readStrictYaml(join(r,'data/workflows/'+id+'.yaml'));w.workflow.status='active';await write(r,'data/workflows/'+id+'.yaml',w);
 if(naming){const n=await readStrictYaml(join(r,'data/foundations/figma-naming.yaml'));n.foundation.status='active';await write(r,'data/foundations/figma-naming.yaml',n);}
 await write(r,'system/manifest.yaml',m);
 return resolveSkillContext({repoRoot:r,routeId:id,workflowMode:mode,candidates:id==='figma-description-sync'?[{id:'button-secondary'}]:[],viewports:['figma-description-sync','component-onboarding'].includes(id)?['mobile','desktop']:id==='library-maintenance'?['mobile']:[]});
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
const before=[{node_id:'1:2',name:'feature-icon @4x',description:'old',type:'FRAME',layoutMode:'HORIZONTAL',width:48,height:48,children:[{node_id:'1:3',type:'VECTOR'}],componentPropertyReferences:{visible:'Show Icon'},boundVariables:{paddingTop:'token'},fills:[]}];
function execution(c,{rename=false,damage=false,authorize=true,noop=false}={}){
 const nodes=structuredClone(before),field=rename?'name':'description',next=noop?nodes[0][field]:(rename?'benefit-icon @4x':'new precise description');
 const preview={pinned_sha:SHA,route_id:c.route.id,file_key:'file',changes:[{node_id:'1:2',pointer:'/'+field,before:nodes[0][field],after:next}],repository_paths:[]};
 const calls=[];
 const handlers=Object.fromEntries(c.workflow.steps.map(s=>[s.id,async()=>{
  calls.push(s.id);
  if(s.id==='pin-canonical-state')return {'pinned-sha':SHA};
  if(s.id==='assess-impact')return {'impact-report':{scope:'fixture'}};
  if(s.id==='inspect-canonical-sources'||s.id==='confirm-naming-semantics')return {'audit-findings':{semantics:[{node_id:'1:2',role:'feature-icon',objectKind:'asset-owner',assetOwnerKind:'internal',confirmed:true}]}};
  if(s.id==='inspect-figma-read-only')return {'figma-before':structuredClone(nodes),'audit-findings':{semantics:[{node_id:'1:2',role:'feature-icon',objectKind:'asset-owner',assetOwnerKind:'internal',confirmed:true}]}};
  if(s.id==='preview-exact-change')return {'change-preview':preview};
  if(s.id==='apply-authorized-figma-change'){nodes[0][field]=next;if(damage)nodes[0].height=49;return {'figma-change':{node_ids:['1:2']}};}
  if(s.id==='verify-figma-readback')return {'figma-readback':structuredClone(nodes)};
  if(s.id==='synchronize-dependents')return {'repository-change':{paths:[],cloud_sha:SHA,branch:'codex/fixture'}};
  if(s.id==='verify-exact-cloud-commit')return {'verification-summary':{pinned_sha:SHA,checks:[{command:'controlled-fixture-check',exit_code:0}],limitations:['controlled fixture, not live mutation']}};
  if(s.id==='publish-review')return {'github-pr':{url:'https://github.com/flabenar-maker/e-mail/pull/999',head_sha:SHA,base:'main',draft:true}};
  if(s.id==='handoff')return {'handoff-summary':{}};
  throw Error('Unexpected handler '+s.id);
 }]));
 return {nodes,calls,preview,options:{context:c,pinnedSha:SHA,inputs:{request:'fixture','target-scope':{file_key:'file',node_ids:['1:2'],repository_paths:[]},'write-authorization':authorize?structuredClone(preview):true},conditions:{},handlers}};
}
test('P3: controlled description write preserves every field except the exact authorized description',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-description-sync');assert.equal(c.status,'resolved');const e=execution(c);const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'complete');assert.equal(e.nodes[0].description,'new precise description');const preserved=structuredClone(e.nodes);preserved[0].description='old';assert.deepEqual(preserved,before);assert.equal(result.handoff.pinned_sha,SHA);assert.equal(result.handoff.github_pr?.draft,true);assert.equal(result.handoff.github_pr?.head_sha,SHA);assert.ok(e.calls.includes('verify-figma-readback'));}finally{await f.cleanup();}
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


test('P3: unproven staged component blocks despite a handler claiming success',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'component-onboarding');assert.equal(c.status,'resolved');
 const calls=[];const handlers=Object.fromEntries(c.workflow.steps.map(s=>[s.id,async()=>{calls.push(s.id);return Object.fromEntries(s.allowed_outputs.map(key=>[key,key==='pinned-sha'?SHA:{}]));}]));
 const result=await workflows.executeMaintenanceWorkflow({context:c,pinnedSha:SHA,inputs:{request:'fixture','target-scope':{file_key:'file',node_ids:['1:2'],repository_paths:['data/components/marketing.yaml']},'approved-ready-component':{node_id:'1:2'},'staged-component-record':{id:'incomplete'},'figma-factual-evidence':{ok:true},'write-authorization':true},handlers});
 assert.equal(result.status,'blocked');assert.ok(result.blockers.some(b=>b.code==='fact-unproven'));assert.ok(!calls.includes('apply-minimal-repository-change'));
 }finally{await f.cleanup();}
});
test('P3: migration progress is read-only and binds actual cloud evidence to the same pin',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'migration-progress',{mode:'read-only'});assert.equal(c.status,'resolved');const calls=[];
 const handlers=Object.fromEntries(c.workflow.steps.map(s=>[s.id,async()=>{calls.push(s.id);return Object.fromEntries(s.allowed_outputs.map(key=>[key,key==='pinned-sha'?SHA:{}]));}]));
 const result=await workflows.executeMaintenanceWorkflow({context:c,pinnedSha:SHA,inputs:{request:'status','cloud-state-evidence':{canonical_sha:'b'.repeat(40),tree_sha:'c'.repeat(40),cloud_channel:'github'}},handlers});
 assert.equal(result.status,'blocked');assert.ok(result.blockers.some(b=>b.code==='source-pin-mismatch'));assert.ok(!calls.includes('compare-roadmap-with-cloud-state'));
 const forbidden=await resolveSkillContext({repoRoot:f.root,routeId:'migration-progress',workflowMode:'write'});assert.equal(forbidden.status,'blocked');assert.ok(forbidden.blockers.some(b=>b.code==='WORKFLOW_MODE_UNKNOWN'));
 }finally{await f.cleanup();}
});
test('P3: a callback cannot turn a description route into a name mutation',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-description-sync');const e=execution(c);e.preview.changes[0].pointer='/name';e.preview.changes[0].before='feature-icon @4x';e.preview.changes[0].after='benefit-icon @4x';e.options.inputs['write-authorization']=structuredClone(e.preview);
 const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'blocked');assert.ok(!e.calls.includes('apply-authorized-figma-change'));
 }finally{await f.cleanup();}
});
test('P3: export-scale change and missing semantics stop mapped renames before write',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-naming-audit',{naming:true});for(const what of ['scale','semantics']){const e=execution(c,{rename:true});if(what==='scale'){e.preview.changes[0].after='benefit-icon @2x';e.options.inputs['write-authorization']=structuredClone(e.preview);}else e.options.handlers['confirm-naming-semantics']=async()=>({'audit-findings':{semantics:[]}});
 const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'blocked');assert.ok(!e.calls.includes('apply-authorized-figma-change'));}
 }finally{await f.cleanup();}
});
test('P3: read-only consumer ignores all supplied write capabilities',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-description-sync',{mode:'read-only'});assert.equal(c.status,'resolved');const e=execution(c);let writes=0;e.options.handlers['apply-authorized-figma-change']=async()=>{writes++;return {'figma-change':{}}};delete e.options.inputs['write-authorization'];e.options.handlers['verify-read-only-findings']=async()=>({'verification-summary':{limitations:['fixture']}});
 const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'complete');assert.equal(writes,0);assert.ok(!result.executed.some(id=>id.startsWith('apply-')));
 }finally{await f.cleanup();}
});
test('P3: missing required input and tampered workflow handoff stop before tool callbacks',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-description-sync');for(const what of ['input','handoff','paused']){const e=execution(c);if(what==='input')delete e.options.inputs['target-scope'];if(what==='handoff'){e.options.context=structuredClone(c);e.options.context.workflow.steps[0].source_ids=[];}if(what==='paused'){e.options.context={...c,status:'paused'};}
 const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'blocked');assert.equal(e.calls.length,0);}
 }finally{await f.cleanup();}
});


test('P3: a proposed name must pass the delivered naming foundation, not only preserve its scale',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-naming-audit',{naming:true});const e=execution(c,{rename:true});e.preview.changes[0].after='benefit-icon@4x';e.options.inputs['write-authorization']=structuredClone(e.preview);const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'blocked');assert.ok(result.blockers.some(b=>b.code==='naming-proposal-invalid'));assert.ok(!e.calls.includes('apply-authorized-figma-change'));}finally{await f.cleanup();}
});


test('P3: dependent synchronization cannot report a file outside the approved preview',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-description-sync');const e=execution(c);e.options.handlers['synchronize-dependents']=async()=>({'repository-change':{paths:['core/unauthorized.md'],cloud_sha:SHA,branch:'codex/fixture'}});
 const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'blocked');assert.ok(result.blockers.some(b=>b.code==='repository-change-outside-scope'));assert.ok(!e.calls.includes('publish-review'));}finally{await f.cleanup();}
});
test('P3: tool capabilities receive the actual immutable resolved bundle, not reopen paths',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-description-sync',{mode:'read-only'});const e=execution(c);e.options.handlers['inspect-canonical-sources']=async({bundle})=>{assert.ok(Object.isFrozen(bundle));assert.ok(bundle.static_sources.find(s=>s.id==='component-contract-standard').content.length);assert.ok(bundle.components.some(record=>record.id==='button-secondary'));return {'audit-findings':{inspected:true}};};e.options.handlers['verify-read-only-findings']=async()=>({'verification-summary':{limitations:['fixture']}});
 const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'complete');}finally{await f.cleanup();}
});
test('P3: non-draft PR response is not accepted as an authorized publication',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'figma-description-sync');const e=execution(c);e.options.handlers['publish-review']=async()=>({'github-pr':{url:'https://github.com/flabenar-maker/e-mail/pull/999',head_sha:SHA,base:'main',draft:false}});const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'blocked');assert.ok(result.blockers.some(b=>b.code==='publication-boundary-invalid'));}finally{await f.cleanup();}
});

// APPEND ONLY to tests/workflows/maintenance-authorization.test.mjs.
// Uses that file's fixture(), activate(), execution(), SHA, workflows and assert.

test('P3: library repository-only write completes with exact local receipt and draft publication',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'library-maintenance');assert.equal(c.status,'resolved');
  const preview={pinned_sha:SHA,route_id:'library-maintenance',file_key:'file',changes:[],repository_paths:['data/components/marketing.yaml']},calls=[];
  const handlers=Object.fromEntries(c.workflow.steps.map(s=>[s.id,async()=>{calls.push(s.id);
   if(s.id==='pin-canonical-state')return {'pinned-sha':SHA};if(s.id==='assess-impact')return {'impact-report':{scope:'fixture'}};
   if(s.id==='inspect-canonical-sources')return {'audit-findings':{inspected:true}};if(s.id==='preview-exact-change')return {'change-preview':preview};
   if(['apply-minimal-repository-change','synchronize-dependents'].includes(s.id))return {'repository-change':{paths:preview.repository_paths,cloud_sha:SHA,branch:'codex/fixture'}};
   if(s.id==='verify-exact-cloud-commit')return {'verification-summary':{pinned_sha:SHA,checks:[{command:'controlled-fixture-check',exit_code:0}],limitations:['fixture']}};
   if(s.id==='publish-review')return {'github-pr':{url:'https://github.com/flabenar-maker/e-mail/pull/999',head_sha:SHA,base:'main',draft:true}};if(s.id==='handoff')return {'handoff-summary':{}};throw Error('Unexpected '+s.id);
  }]));
  const result=await workflows.executeMaintenanceWorkflow({context:c,pinnedSha:SHA,inputs:{request:'fixture','target-scope':{file_key:'file',node_ids:[],repository_paths:preview.repository_paths},'write-authorization':structuredClone(preview)},handlers});
  assert.equal(result.status,'complete');assert.deepEqual(result.handoff.changed_paths,preview.repository_paths);assert.equal(result.handoff.verification_summary.checks[0].exit_code,0);assert.equal(result.handoff.github_pr.draft,true);assert.ok(!calls.includes('inspect-figma-read-only'));
 }finally{await f.cleanup();}
});

test('P3: migration progress completes read-only only on exact GitHub cloud evidence pin',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'migration-progress',{mode:'read-only'});assert.equal(c.status,'resolved');const calls=[];
  const handlers=Object.fromEntries(c.workflow.steps.map(s=>[s.id,async()=>{calls.push(s.id);if(s.id==='pin-canonical-state')return {'pinned-sha':SHA};if(s.id==='compare-roadmap-with-cloud-state')return {'audit-findings':{roadmap:'checked'}};if(s.id==='verify-read-only-findings')return {'verification-summary':{limitations:['fixture']}};if(s.id==='handoff')return {'handoff-summary':{}};throw Error('Unexpected '+s.id);}]));
  const result=await workflows.executeMaintenanceWorkflow({context:c,pinnedSha:SHA,inputs:{request:'status','cloud-state-evidence':{canonical_sha:SHA,tree_sha:'b'.repeat(40),cloud_channel:'github'}},handlers});
  assert.equal(result.status,'complete');assert.equal(result.handoff.cloud_commit,null);assert.equal(result.handoff.github_pr,null);assert.ok(calls.every(id=>!/(apply|synchronize|publish)/.test(id)));
 }finally{await f.cleanup();}
});

test('P3 RED: library name change cannot alter the delivered export scale',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'library-maintenance');assert.equal(c.status,'resolved');const e=execution(c,{rename:true});e.preview.changes[0].after='benefit-icon @2x';e.options.inputs['write-authorization']=structuredClone(e.preview);const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'blocked');assert.ok(result.blockers.some(v=>v.code==='naming-proposal-invalid'));assert.ok(!e.calls.includes('apply-authorized-figma-change'));}finally{await f.cleanup();}
});

test('P3 RED: library name change with preserved scale still needs one confirmed semantic role',async()=>{
 const f=await fixture();try{const c=await activate(f.root,'library-maintenance');assert.equal(c.status,'resolved');const e=execution(c,{rename:true});e.options.handlers['inspect-figma-read-only']=async()=>({'figma-before':structuredClone(e.nodes),'audit-findings':{semantics:[]}});const result=await workflows.executeMaintenanceWorkflow(e.options);assert.equal(result.status,'blocked');assert.ok(result.blockers.some(v=>v.code==='semantic-role-required'));assert.ok(!e.calls.includes('apply-authorized-figma-change'));}finally{await f.cleanup();}
});
