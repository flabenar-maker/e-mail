import {posix} from 'node:path';
import {canonicalize} from './content-digest.mjs';
import {SystemValidationError} from './diagnostics.mjs';
import {parseStrictYaml} from './strict-yaml.mjs';
import {loadWorkflowRegistry} from './workflow-registry.mjs';

const MANIFEST_SOURCE='system-manifest';
const MANIFEST_SCHEMA='manifest-schema';
const diagnostic=(code,path,message)=>new SystemValidationError(code,path,message);

// Only the manifest selects workflows. No component facts, second source
// catalog or manually maintained workflow/checkpoint text lives here.
export function validateWorkflowCheckpointDefinition(manifest,definition,index=0){
  const path=`/generated_docs/${index}`;
  if(definition.renderer!=='workflow-checkpoint')return definition.workflow_source_id===undefined?[]:[diagnostic('generated-workflow-checkpoint-invalid',path,'Only workflow-checkpoint may select a workflow source.')];
  const sources=new Map((manifest.sources??[]).map(s=>[s.id,s]));
  const entry=(manifest.structured_workflows?.entries??[]).filter(e=>e.source_id===definition.workflow_source_id);
  const schemaId=manifest.structured_workflows?.schema_source_id;
  const selected=sources.get(definition.workflow_source_id);
  const control=sources.get(MANIFEST_SOURCE), manifestSchema=sources.get(MANIFEST_SCHEMA);
  const expected=[definition.workflow_source_id,schemaId,MANIFEST_SCHEMA,MANIFEST_SOURCE];
  if(entry.length!==1||selected?.kind!=='workflow'||sources.get(schemaId)?.kind!=='schema'||
      control?.kind!=='entrypoint'||control.path!=='system/manifest.yaml'||
      manifestSchema?.kind!=='schema'||manifestSchema.path!=='schemas/manifest.schema.json'||
      new Set(expected).size!==4||definition.input_source_ids?.length!==4||
      expected.some(id=>!definition.input_source_ids.includes(id))){
    return [diagnostic('generated-workflow-checkpoint-invalid',path,'Checkpoint requires one registered workflow selector and exactly its workflow/schema plus manifest/schema provenance inputs.')];
  }
  return [];
}

export async function loadWorkflowCheckpointModels({repoRoot,manifest,sourceTexts}){
  const definitions=(manifest.generated_docs??[]).filter(d=>d.renderer==='workflow-checkpoint');
  if(definitions.length===0)return new Map();
  const errors=definitions.flatMap(d=>validateWorkflowCheckpointDefinition(manifest,d,manifest.generated_docs.indexOf(d)));
  if(errors.length)throw new AggregateError(errors,'Workflow checkpoint definitions are invalid.');
  const raw=sourceTexts.get(MANIFEST_SOURCE);
  if(typeof raw!=='string'||canonicalize(parseStrictYaml(raw,'system/manifest.yaml'))!==canonicalize(manifest)){
    throw diagnostic('GENERATED_WORKFLOW_MANIFEST_MISMATCH','/system/manifest.yaml','Checkpoint routing must match the actual manifest bytes included in its source digest.');
  }
  const result=new Map();
  for(const sourceId of [...new Set(definitions.map(d=>d.workflow_source_id))].sort()){
    const entry=manifest.structured_workflows.entries.find(e=>e.source_id===sourceId);
    const doc=await loadWorkflowRegistry({repoRoot,workflowId:entry.id,manifest});
    const source=manifest.sources.find(s=>s.id===sourceId), text=sourceTexts.get(sourceId);
    if(typeof text!=='string'||canonicalize(parseStrictYaml(text,source.path))!==canonicalize(doc)){
      throw diagnostic('GENERATED_WORKFLOW_INPUT_MISMATCH',`/sources/${sourceId}`,'Validated workflow must match the bytes included in the source digest.');
    }
    result.set(sourceId,doc);
  }
  return result;
}

function code(value){
  const text=String(value), fence='`'.repeat(Math.max(0,...(text.match(/`+/gu)??[]).map(v=>v.length))+1);
  return `${fence}${text}${fence}`;
}
const list=values=>values?.length?values.map(code).join(', '):'none';
function sourceLink(model,definition,id){
  const source=model.sources.get(id), output=model.sources.get(definition.output_source_id);
  if(!source||!output)throw diagnostic('GENERATED_DOC_INPUT_UNKNOWN',`/sources/${id}`,'Checkpoint link must resolve through the manifest.');
  const path=posix.relative(posix.dirname(output.path),source.path).split('/').map(p=>encodeURIComponent(p).replace(/[!'()*]/gu,c=>`%${c.charCodeAt(0).toString(16).toUpperCase()}`)).join('/');
  return `[${id}](${path})`;
}
function typedRelationKinds(value){
  return [...new Set((Array.isArray(value)?value:[])
    .map(relation=>relation?.kind)
    .filter(kind=>typeof kind==='string'))];
}
function jsonSection(lines,title,value){
  lines.push(`### ${title}`,'');
  if(value===undefined)lines.push('Not declared.','');
  else {
    lines.push('```json',JSON.stringify(JSON.parse(canonicalize(value)),null,2),'```','');
    if(title==='Input relations'){
      const kinds=typedRelationKinds(value);
      if(kinds.length)lines.push(`- Relation kinds: ${kinds.map(code).join(', ')}`,'');
    }
  }
}

export function renderWorkflowCheckpoint(model,definition){
  const doc=model.workflowCheckpoints.get(definition.workflow_source_id);
  if(!doc)throw diagnostic('GENERATED_WORKFLOW_INPUT_MISSING',`/generated_docs/${definition.id}`,'Selected validated workflow was not loaded.');
  const workflow=doc.workflow;
  const lines=[`# Workflow checkpoint: ${code(workflow.id)}`,'',`Status: ${code(workflow.status)}`,'',
    'This is a generated reading projection of the structured workflow. It does not activate a route, authorize a write, or add a runtime instruction.','',
    `Canonical workflow: ${sourceLink(model,definition,definition.workflow_source_id)}`,'',
    '## Current manifest routing','',
    '| Route | Assigned workflow source | Bundle status |','| --- | --- | --- |'];
  for(const route of [...model.manifest.routes].sort((a,b)=>a.id.localeCompare(b.id))){
    const profile=model.manifest.bundle_profiles.find(p=>p.id===route.bundle_profile_id);
    lines.push(`| ${code(route.id)} | ${code(route.workflow_source_id)} | ${code(profile?.generated_bundle?.status??'not-declared')} |`);
  }
  lines.push('','The routing table describes current assignments only; workflow status is not a readiness guarantee.','',
    '## Workflow sources','');
  for(const id of workflow.source_ids)lines.push(`- ${sourceLink(model,definition,id)}`);
  lines.push('');
  for(const mode of workflow.modes){
    lines.push(`## Mode: ${code(mode.id)}`,'',`- Required inputs: ${list(mode.required_inputs)}`,`- Allowed outputs: ${list(mode.allowed_outputs)}`,'');
    jsonSection(lines,'Input blocker mappings',mode.input_blockers);
    jsonSection(lines,'Input relations',mode.input_relations);
    for(const step of mode.steps){
      lines.push(`### ${step.order}. ${code(step.id)}`,'',
        `- Condition: ${step.condition_id===undefined?'always':code(step.condition_id)}`,
        `- Sources: ${step.source_ids.map(id=>sourceLink(model,definition,id)).join(', ')}`,
        `- Required inputs: ${list(step.required_inputs)}`,
        `- Blockers: ${list(step.blockers)}`,
        `- Allowed outputs: ${list(step.allowed_outputs)}`,
        `- Success handoff: ${code(step.handoff.on_success)}`,
        `- Blocked handoff: ${code(step.handoff.on_blocked)}`,'');
    }
  }
  return `${lines.join('\n').trimEnd()}\n`;
}
