import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readStrictYaml} from '../../scripts/lib/strict-yaml.mjs';
import {loadGeneratedDocModel, renderAllGeneratedDocs, renderGeneratedDoc, compareGeneratedDocs} from '../../scripts/lib/generated-docs.mjs';
import {validateManifestShape, validateManifestSemantics} from '../../scripts/lib/system-manifest.mjs';
import {canonicalSystemFixtureFiles, copyFixtureFile, createSystemFixture, writeFixtureFile} from '../helpers/system-fixture.mjs';

const repoRoot=dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const checkpoint=(id, source)=>({id:`${id}-checkpoint`,output_source_id:`generated-${id}-checkpoint`,renderer:'workflow-checkpoint',workflow_source_id:source,input_source_ids:[source,'workflows-schema','manifest-schema','system-manifest']});
function enableCheckpoints(manifest){
  const next=structuredClone(manifest); next.schema_version='1.3.0';
  if(!next.sources.some(s=>s.id==='system-manifest'))next.sources.push({id:'system-manifest',kind:'entrypoint',path:'system/manifest.yaml'});
  for(const [id,source] of [['library-maintenance','workflow-library-maintenance'],['email-build','workflow-email-build']]){
    if(!next.sources.some(s=>s.id===`generated-${id}-checkpoint`))next.sources.push({id:`generated-${id}-checkpoint`,kind:'generated',path:`docs/generated/${id}-checkpoint.md`});
    if(!next.generated_docs.some(d=>d.id===`${id}-checkpoint`))next.generated_docs.push(checkpoint(id,source));
  }
  return next;
}
async function fixture(){
  const f=await createSystemFixture();
  for(const path of canonicalSystemFixtureFiles)await copyFixtureFile(repoRoot,f.root,path);
  const manifest=enableCheckpoints(await readStrictYaml(join(f.root,'system/manifest.yaml')));
  await writeFixtureFile(f.root,'system/manifest.yaml',JSON.stringify(manifest,null,2)+'\n');
  return {...f,manifest};
}
const workflowDefinition=m=>m.generated_docs.find(d=>d.id==='library-maintenance-checkpoint');
const codes=e=>(e instanceof AggregateError?e.errors:[e]).map(x=>x.code);

// Removing renderer/registration loses a declared output; a second prose source
// or rewriting the old four outputs would violate the public projection boundary.
test('two workflow checkpoints are deterministic projections and preserve existing four outputs',async()=>{
  const f=await fixture(); try{
    const schema=JSON.parse(await readFile(join(f.root,'schemas/manifest.schema.json'),'utf8'));
    assert.deepEqual(validateManifestShape(f.manifest,schema),[]);
    assert.deepEqual(await validateManifestSemantics(f.manifest,f.root),[]);
    const first=await renderAllGeneratedDocs({repoRoot:f.root,manifest:f.manifest});
    const second=await renderAllGeneratedDocs({repoRoot:f.root,manifest:f.manifest});
    assert.deepEqual(first,second); assert.equal(first.size,6);
    for(const name of ['component-registry','typography-registry','asset-registry','naming-reference']){
      assert.equal(first.get(`docs/generated/${name}.md`),await readFile(join(repoRoot,`docs/generated/${name}.md`),'utf8'));
    }
    for(const name of ['library-maintenance','email-build'])assert.match(first.get(`docs/generated/${name}-checkpoint.md`),/GENERATED FILE/);
  }finally{await f.cleanup();}
});

// A happy-path-only renderer must fail: conditions, blockers and blocked handoffs
// are visible instructions, not optional decoration.
test('checkpoint preserves every mode and typed stop/input/condition boundary',async()=>{
  const f=await fixture();try{
    const docs=await renderAllGeneratedDocs({repoRoot:f.root,manifest:f.manifest});
    const maintenance=docs.get('docs/generated/library-maintenance-checkpoint.md');
    assert.match(maintenance,/## Mode: `read-only`/); assert.match(maintenance,/## Mode: `write`/);
    assert.match(maintenance,/Status: `shadow`/);
    assert.match(maintenance,/`figma-write-in-scope`/);assert.match(maintenance,/`figma-write-outside-allowlist`/);
    assert.match(maintenance,/`request-input`/); assert.match(maintenance,/`stop`/);
    assert.ok(maintenance.indexOf('### 1. `pin-canonical-state`')<maintenance.indexOf('### 2. `assess-impact`'));
    assert.match(maintenance,/\[figma-library-standard\]\(\.\.\/\.\.\/core\/figma-library-standard\.md\)/);
    const email=docs.get('docs/generated/email-build-checkpoint.md');
    for(const mode of ['new-build','continue-fix-design','continue-fix-technical','read-only'])assert.ok(email.includes(`## Mode: \`${mode}\``));
    assert.match(email,/`ordered-field-values`/);assert.match(email,/`same-field`/);assert.match(email,/`viewport-role-ambiguous`/);
    assert.match(email,/`asset-resolution-decision-required`/);assert.match(email,/`source-evidence-mismatch`/);
    assert.match(email,/manifest=1\.3\.0/); assert.match(email,/workflows=1\.0\.0/);
  }finally{await f.cleanup();}
});

// A shadow workflow cannot masquerade as an active route; changes to actual
// routing must change both the visible map and source digest.
test('checkpoint readiness and digest come from actual manifest routing',async()=>{
  const f=await fixture();try{
    const model=await loadGeneratedDocModel({repoRoot:f.root,manifest:f.manifest});
    const before=renderGeneratedDoc({definition:workflowDefinition(f.manifest),model});
    assert.match(before,/`library-maintenance`[^\n]*`workflow-paused`[^\n]*`structured-shadow`/);
    assert.match(before,/not activate/);
    const next=structuredClone(f.manifest);next.routes.find(r=>r.id==='library-maintenance').workflow_source_id='workflow-library-maintenance';
    await writeFixtureFile(f.root,'system/manifest.yaml',JSON.stringify(next,null,2)+'\n');
    const after=renderGeneratedDoc({definition:workflowDefinition(next),model:await loadGeneratedDocModel({repoRoot:f.root,manifest:next})});
    assert.match(after,/`library-maintenance`[^\n]*`workflow-library-maintenance`/);
    assert.notEqual(before.match(/source-digest: ([^ ]+)/)[1],after.match(/source-digest: ([^ ]+)/)[1]);
  }finally{await f.cleanup();}
});

test('checkpoint schema rejects missing selectors and selectors on other renderers',async()=>{
  const f=await fixture();try{
    const schema=JSON.parse(await readFile(join(f.root,'schemas/manifest.schema.json'),'utf8'));
    const missing=structuredClone(f.manifest);delete workflowDefinition(missing).workflow_source_id;
    assert.ok(validateManifestShape(missing,schema).some(e=>e.code==='manifest-schema'));
    const other=structuredClone(f.manifest);other.generated_docs[0].workflow_source_id='workflow-email-build';
    assert.ok(validateManifestShape(other,schema).some(e=>e.code==='manifest-schema'));
  }finally{await f.cleanup();}
});

test('checkpoint semantic validation rejects unregistered selectors and incomplete provenance inputs',async()=>{
  const f=await fixture();try{
    for(const mutate of [
      d=>{d.workflow_source_id='workflow-paused';},
      d=>{d.input_source_ids=d.input_source_ids.filter(id=>id!=='system-manifest');},
      d=>{d.input_source_ids=d.input_source_ids.filter(id=>id!=='workflows-schema');},
      d=>{d.input_source_ids.push('components-service');},
    ]){
      const next=structuredClone(f.manifest);mutate(workflowDefinition(next));
      assert.ok((await validateManifestSemantics(next,f.root)).some(e=>e.code==='generated-workflow-checkpoint-invalid'));
    }
  }finally{await f.cleanup();}
});

test('checkpoint model rejects raw manifest bytes that do not describe supplied routing',async()=>{
  const f=await fixture();try{
    const altered=structuredClone(f.manifest);altered.routes[0].workflow_source_id='workflow-library-maintenance';
    await assert.rejects(loadGeneratedDocModel({repoRoot:f.root,manifest:altered}),e=>codes(e).includes('GENERATED_WORKFLOW_MANIFEST_MISMATCH'));
  }finally{await f.cleanup();}
});

test('checkpoint loader rejects invalid workflow shape rather than rendering it',async()=>{
  const f=await fixture();try{
    const doc=await readStrictYaml(join(f.root,'data/workflows/library-maintenance.yaml'));
    doc.workflow.modes[0].steps[0].handoff.on_blocked='pretend-success';
    await writeFixtureFile(f.root,'data/workflows/library-maintenance.yaml',JSON.stringify(doc));
    await assert.rejects(loadGeneratedDocModel({repoRoot:f.root,manifest:f.manifest}),e=>codes(e).includes('workflow-registry-schema'));
  }finally{await f.cleanup();}
});

test('checkpoint source links encode Markdown control characters in paths',async()=>{
  const f=await fixture();try{
    const next=structuredClone(f.manifest);next.sources.find(s=>s.id==='figma-library-standard').path='core/library (notes)[v2].md';
    await writeFixtureFile(f.root,'system/manifest.yaml',JSON.stringify(next));
    const doc=renderGeneratedDoc({definition:workflowDefinition(next),model:await loadGeneratedDocModel({repoRoot:f.root,manifest:next})});
    assert.match(doc,/\.\.\/\.\.\/core\/library%20%28notes%29%5Bv2%5D\.md/);
    assert.doesNotMatch(doc,/\]\(\.\.\/\.\.\/core\/library \(notes\)/);
  }finally{await f.cleanup();}
});

test('workflow edits make generated checkpoints stale without rewriting runtime source lists',async()=>{
  const f=await fixture();try{
    const initial=await renderAllGeneratedDocs({repoRoot:f.root,manifest:f.manifest});
    for(const [path,text] of initial)await writeFixtureFile(f.root,path,text);
    const doc=await readStrictYaml(join(f.root,'data/workflows/library-maintenance.yaml'));
    doc.workflow.modes[0].steps[0].blockers.push('new-source-blocker');
    await writeFixtureFile(f.root,'data/workflows/library-maintenance.yaml',JSON.stringify(doc));
    const after=await renderAllGeneratedDocs({repoRoot:f.root,manifest:f.manifest});
    const errors=await compareGeneratedDocs({repoRoot:f.root,rendered:after});
    assert.deepEqual(errors.filter(e=>e.code==='GENERATED_DOC_STALE').map(e=>e.path),['/docs/generated/library-maintenance-checkpoint.md']);
    assert.equal(after.get('docs/generated/email-build-checkpoint.md'),initial.get('docs/generated/email-build-checkpoint.md'));
    for(const p of f.manifest.bundle_profiles)assert.ok(p.source_ids.every(id=>!id.endsWith('-checkpoint')));
    const canonical=await readStrictYaml(join(repoRoot,'system/manifest.yaml'));
    assert.deepEqual(f.manifest.routes,canonical.routes); assert.deepEqual(f.manifest.bundle_profiles,canonical.bundle_profiles);
  }finally{await f.cleanup();}
});
