import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createSystemFixture,cleanupSystemFixture} from '../helpers/system-fixture.mjs';
import {readStrictYaml} from '../../scripts/lib/strict-yaml.mjs';
import {resolveSkillContext} from '../../scripts/lib/skill-context.mjs';
import {validateManifestSemantics} from '../../scripts/lib/system-manifest.mjs';
import {validateWorkflowRegistrySemantics} from '../../scripts/lib/workflow-registry.mjs';

const write=(root,path,value)=>writeFile(join(root,path),JSON.stringify(value,null,2)+'\n');
async function candidate(root,routeId='migration-progress'){
  const manifest=await readStrictYaml(join(root,'system/manifest.yaml'));
  const route=manifest.routes.find(r=>r.id===routeId);
  const profile=manifest.bundle_profiles.find(p=>p.id===route.bundle_profile_id);
  route.workflow_source_id='workflow-library-maintenance';
  profile.generated_bundle.status='structured-active';
  profile.source_ids=profile.source_ids.map(id=>id==='workflow-paused'?route.workflow_source_id:id);
  profile.generated_bundle.static_source_ids=[...profile.source_ids];
  const wf=await readStrictYaml(join(root,'data/workflows/library-maintenance.yaml'));
  wf.workflow.status='active';
  await write(root,'data/workflows/library-maintenance.yaml',wf);
  await write(root,'system/manifest.yaml',manifest);
  return {manifest,wf,profile,route};
}
test('P3: partial topology admits a coherent maintenance candidate without activating other routes',async()=>{
  const root=await createSystemFixture();
  try{
    const {manifest}=await candidate(root);
    const errors=await validateManifestSemantics(manifest,root);
    assert.deepEqual(errors.filter(e=>e.code==='structured-workflow-status-topology-invalid'),[]);
  }finally{await cleanupSystemFixture(root);}
});
test('P3: resolved steps cannot cite absent actual bundle source content',async()=>{
  const root=await createSystemFixture();
  try{
    // Use the pre-P3 coherent all-active fixture topology to isolate source closure.
    const manifest=await readStrictYaml(join(root,'system/manifest.yaml'));
    manifest.structured_workflows.status='active';
    for(const entry of manifest.structured_workflows.entries){
      const source=manifest.sources.find(s=>s.id===entry.source_id);
      const wf=await readStrictYaml(join(root,source.path));wf.workflow.status='active';await write(root,source.path,wf);
    }
    for(const route of manifest.routes){
      if(route.workflow_source_id==='workflow-paused')route.workflow_source_id='workflow-library-maintenance';
      const profile=manifest.bundle_profiles.find(p=>p.id===route.bundle_profile_id);
      profile.generated_bundle.status='structured-active';
      profile.source_ids=profile.source_ids.map(s=>s==='workflow-paused'?route.workflow_source_id:s);
      profile.generated_bundle.static_source_ids=[...profile.source_ids];
    }
    await write(root,'system/manifest.yaml',manifest);
    const result=await resolveSkillContext({repoRoot:root,routeId:'migration-progress',workflowMode:'read-only'});
    assert.equal(result.status,'blocked');
    assert.ok(result.blockers.some(b=>b.code==='SKILL_WORKFLOW_SOURCE_MISSING'&&b.path.includes('figma-library-standard')));
  }finally{await cleanupSystemFixture(root);}
});
test('P3: every required step input must exist before that step, not merely later',()=>{
  const workflow={workflow:{source_ids:['repository-readme'],modes:[{id:'read-only',required_inputs:['request'],steps:[{id:'inspect',order:1,source_ids:['repository-readme'],required_inputs:['unproduced-facts'],blockers:['facts-missing'],allowed_outputs:['report'],handoff:{on_success:'complete',on_blocked:'stop'}}]}]}};
  const errors=validateWorkflowRegistrySemantics(workflow,{sources:[{id:'repository-readme'}]});
  assert.ok(errors.some(e=>e.code==='WORKFLOW_STEP_INPUT_UNAVAILABLE'));
});
