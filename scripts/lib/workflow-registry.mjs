import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml, parseStrictYaml } from "./strict-yaml.mjs";
import { isDeepStrictEqual } from "node:util";
import { validateFigmaNameProposal } from "./figma-name-validator.mjs";
import { auditFigmaComponentEvidence } from "./figma-component-evidence.mjs";

const SUPPORTED_WORKFLOW_VERSION = "1.0.0";

function diagnostic(code, path, message) {
  return new SystemValidationError(code, path, message);
}

function sortDiagnostics(errors) {
  return errors.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );
}

function duplicates(items) {
  const seen = new Set();
  const result = new Set();
  for (const item of items) {
    if (seen.has(item)) result.add(item);
    seen.add(item);
  }
  return [...result].sort();
}

export function validateWorkflowRegistryShape(workflow, schema) {
  return validateDocumentShape({
    document: workflow,
    schema,
    supportedVersion: SUPPORTED_WORKFLOW_VERSION,
    versionCode: "workflow-registry-version-unsupported",
    schemaCode: "workflow-registry-schema",
  });
}

export function validateWorkflowRegistrySemantics(workflow, manifest) {
  const errors = [];
  const sourceIds = new Set(manifest?.sources?.map(({ id }) => id) ?? []);
  const declaredSources = new Set(workflow?.workflow?.source_ids ?? []);

  for (const id of duplicates(workflow?.workflow?.modes?.map(({ id }) => id) ?? [])) {
    errors.push(
      diagnostic(
        "WORKFLOW_MODE_DUPLICATE",
        "/workflow/modes",
        `Duplicate workflow mode: ${id}.`,
      ),
    );
  }

  (workflow?.workflow?.source_ids ?? []).forEach((sourceId, index) => {
    if (!sourceIds.has(sourceId)) {
      errors.push(
        diagnostic(
          "WORKFLOW_SOURCE_UNKNOWN",
          `/workflow/source_ids/${index}`,
          `Unknown manifest source: ${sourceId}.`,
        ),
      );
    }
  });

  (workflow?.workflow?.modes ?? []).forEach((mode, modeIndex) => {
    if (mode.input_blockers !== undefined || mode.input_relations !== undefined) {
    const requiredInputs = new Set(mode.required_inputs ?? []);
    const stepBlockers = new Set((mode.steps ?? []).flatMap((step) => step.blockers ?? []));
    const inputBlockers = new Map();
    (mode.input_blockers ?? []).forEach(({ input, blocker }, inputIndex) => {
      if (inputBlockers.has(input)) errors.push(diagnostic("WORKFLOW_INPUT_BLOCKER_DUPLICATE", `/workflow/modes/${modeIndex}/input_blockers/${inputIndex}/input`, `Required input has more than one blocker mapping: ${input}.`));
      inputBlockers.set(input, blocker);
      if (!requiredInputs.has(input)) errors.push(diagnostic("WORKFLOW_INPUT_BLOCKER_INPUT_UNREQUIRED", `/workflow/modes/${modeIndex}/input_blockers/${inputIndex}/input`, `Input blocker must reference a mode required input: ${input}.`));
      if (!stepBlockers.has(blocker)) errors.push(diagnostic("WORKFLOW_INPUT_BLOCKER_UNDECLARED", `/workflow/modes/${modeIndex}/input_blockers/${inputIndex}/blocker`, `Input blocker must be declared by a mode step: ${blocker}.`));
    });
    for (const input of requiredInputs) {
      if (!inputBlockers.has(input)) errors.push(diagnostic("WORKFLOW_INPUT_BLOCKER_MISSING", `/workflow/modes/${modeIndex}/required_inputs`, `Required input has no typed blocker mapping: ${input}.`));
    }
    (mode.input_relations ?? []).forEach((relation, relationIndex) => {
      relation.inputs.forEach((input, inputIndex) => {
        if (!requiredInputs.has(input)) errors.push(diagnostic("WORKFLOW_INPUT_RELATION_INPUT_UNREQUIRED", `/workflow/modes/${modeIndex}/input_relations/${relationIndex}/inputs/${inputIndex}`, `Input relation must reference a mode required input: ${input}.`));
      });
      if (relation.kind === "ordered-field-values" && relation.values.length !== relation.inputs.length) errors.push(diagnostic("WORKFLOW_INPUT_RELATION_VALUES_LENGTH", `/workflow/modes/${modeIndex}/input_relations/${relationIndex}/values`, "Ordered input relation values must match the input count."));
      if (!stepBlockers.has(relation.blocker)) errors.push(diagnostic("WORKFLOW_INPUT_RELATION_BLOCKER_UNDECLARED", `/workflow/modes/${modeIndex}/input_relations/${relationIndex}/blocker`, `Input relation blocker must be declared by a mode step: ${relation.blocker}.`));
    });    }
    for (const id of duplicates(mode.steps.map(({ id }) => id))) {
      errors.push(
        diagnostic(
          "WORKFLOW_STEP_DUPLICATE",
          `/workflow/modes/${modeIndex}/steps`,
          `Duplicate workflow step: ${id}.`,
        ),
      );
    }
    const availableInputs = new Set(mode.required_inputs ?? []);
    mode.steps.forEach((step, stepIndex) => {
      for (const input of step.required_inputs) {
        if (!availableInputs.has(input)) errors.push(diagnostic("WORKFLOW_STEP_INPUT_UNAVAILABLE", `/workflow/modes/${modeIndex}/steps/${stepIndex}/required_inputs`, `Step input must be a mode input or a preceding output: ${input}.`));
      }
      for (const output of step.allowed_outputs) availableInputs.add(output);
      const expectedOrder = stepIndex + 1;
      if (step.order !== expectedOrder) {
        errors.push(
          diagnostic(
            "WORKFLOW_STEP_ORDER_INVALID",
            `/workflow/modes/${modeIndex}/steps/${stepIndex}/order`,
            `Step order must be ${expectedOrder}; received ${String(step.order)}.`,
          ),
        );
      }
      step.source_ids.forEach((sourceId, sourceIndex) => {
        if (!declaredSources.has(sourceId)) {
          errors.push(
            diagnostic(
              "WORKFLOW_STEP_SOURCE_UNDECLARED",
              `/workflow/modes/${modeIndex}/steps/${stepIndex}/source_ids/${sourceIndex}`,
              `Step source is outside workflow.source_ids: ${sourceId}.`,
            ),
          );
        }
      });
      const expectedSuccess =
        stepIndex === mode.steps.length - 1 ? "complete" : "next";
      if (step.handoff.on_success !== expectedSuccess) {
        errors.push(
          diagnostic(
            "WORKFLOW_STEP_HANDOFF_INVALID",
            `/workflow/modes/${modeIndex}/steps/${stepIndex}/handoff/on_success`,
            `Step success handoff must be ${expectedSuccess}.`,
          ),
        );
      }
    });
  });

  return sortDiagnostics(errors);
}

function workflowEntry(manifest, workflowId) {
  return manifest?.structured_workflows?.entries?.find(
    ({ id }) => id === workflowId,
  );
}

export async function loadWorkflowRegistry({
  repoRoot,
  workflowId,
  manifest: suppliedManifest,
}) {
  const manifest =
    suppliedManifest ??
    (await (await import("./system-manifest.mjs")).loadSystemManifest({
      repoRoot,
    }));
  const entry = workflowEntry(manifest, workflowId);
  if (!entry) {
    throw diagnostic(
      "WORKFLOW_UNKNOWN",
      "/workflow_id",
      `Unknown structured workflow: ${String(workflowId)}.`,
    );
  }
  const source = manifest.sources.find(({ id }) => id === entry.source_id);
  const schemaSource = manifest.sources.find(
    ({ id }) => id === manifest.structured_workflows.schema_source_id,
  );
  if (!source || !schemaSource) {
    throw diagnostic(
      "WORKFLOW_SOURCE_UNKNOWN",
      "/structured_workflows",
      `Structured workflow sources are unresolved for ${workflowId}.`,
    );
  }
  const [workflow, schemaText] = await Promise.all([
    readStrictYaml(join(repoRoot, source.path)),
    readFile(join(repoRoot, schemaSource.path), "utf8"),
  ]);
  const errors = [
    ...validateWorkflowRegistryShape(workflow, JSON.parse(schemaText)),
    ...validateWorkflowRegistrySemantics(workflow, manifest),
  ];
  if (workflow?.workflow?.id !== workflowId) {
    errors.push(
      diagnostic(
        "WORKFLOW_ID_MISMATCH",
        "/workflow/id",
        `Expected workflow id ${workflowId}; received ${String(workflow?.workflow?.id)}.`,
      ),
    );
  }
  if (errors.length > 0) {
    throw new AggregateError(
      sortDiagnostics(errors),
      `Structured workflow validation failed: ${workflowId}.`,
    );
  }
  return workflow;
}

export function resolveWorkflowSteps(workflow, modeId) {
  const mode = workflow?.workflow?.modes?.find(({ id }) => id === modeId);
  if (!mode) {
    throw diagnostic(
      "WORKFLOW_MODE_UNKNOWN",
      "/mode",
      `Unknown workflow mode: ${String(modeId)}.`,
    );
  }
  return Object.freeze(
    mode.steps.map((step) => Object.freeze(structuredClone(step))),
  );
}

export async function validateStructuredWorkflows({ repoRoot, manifest }) {
  const errors = [];
  for (const entry of manifest.structured_workflows.entries) {
    try {
      await loadWorkflowRegistry({ repoRoot, workflowId: entry.id, manifest });
    } catch (error) {
      if (error instanceof AggregateError) errors.push(...error.errors);
      else if (error instanceof SystemValidationError) errors.push(error);
      else {
        errors.push(
          diagnostic(
            "WORKFLOW_READ_FAILED",
            `/structured_workflows/${entry.id}`,
            `Structured workflow could not be read: ${entry.id}.`,
          ),
        );
      }
    }
  }
  return sortDiagnostics(errors);
}

// A bounded consumer of the maintenance steps returned by the resolver.
// Tool handlers are explicit capabilities: this module owns no Figma/GitHub client.
const MAINTENANCE_ROUTES = new Set(['library-maintenance','component-onboarding','figma-description-sync','figma-naming-audit','migration-progress']);
const exact = (a,b) => isDeepStrictEqual(a,b);
const present = value => value !== undefined && value !== null;
function deepFreeze(value){if(value&&typeof value==='object'){for(const child of Object.values(value))deepFreeze(child);Object.freeze(value);}return value;}
function workflowStop(code,path,executed=[]){return {status:'blocked',blockers:[{code,path}],executed:[...executed]};}
function pointerParts(pointer){
 if(typeof pointer!=='string'||!pointer.startsWith('/')||pointer==='/')throw Error('Invalid pointer');
 const parts=pointer.slice(1).split('/').map(v=>v.replaceAll('~1','/').replaceAll('~0','~'));
 if(parts.some(v=>!v||['__proto__','constructor','prototype'].includes(v)))throw Error('Unsafe pointer');return parts;
}
function pointerValue(object,pointer){return pointerParts(pointer).reduce((value,key)=>value?.[key],object);}
function assignPointer(object,pointer,value){const parts=pointerParts(pointer);let owner=object;for(const key of parts.slice(0,-1)){if(!owner||!Object.hasOwn(owner,key))throw Error('Missing path');owner=owner[key];}const key=parts.at(-1);if(!Object.hasOwn(owner,key))throw Error('Missing field');owner[key]=structuredClone(value);}
function nodeIndex(nodes){
 const result=new Map();const visit=value=>{if(!value||typeof value!=='object')return;if(typeof value.node_id==='string'){if(result.has(value.node_id))throw Error('Ambiguous identity');result.set(value.node_id,value);}for(const child of Object.values(value))if(child&&typeof child==='object')visit(child);};visit(nodes);return result;
}
function exactBoundary(preview,authorization,scope,route,pin){
 if(!preview||!authorization||!exact(preview,authorization)||preview.route_id!==route||preview.pinned_sha!==pin||preview.file_key!==scope?.file_key||
  !Array.isArray(preview.changes)||!Array.isArray(preview.repository_paths)||!Array.isArray(scope.node_ids)||!Array.isArray(scope.repository_paths))return false;
 const paths=new Set(),keys=new Set();
 for(const path of preview.repository_paths){if(typeof path!=='string'||path.startsWith('/')||path.includes('\\')||path.split('/').some(v=>!v||v==='..'||v==='.')||!scope.repository_paths.includes(path)||paths.has(path))return false;paths.add(path);}
 for(const change of preview.changes){
  if(!change||Object.keys(change).sort().join(',')!=='after,before,node_id,pointer'||!scope.node_ids.includes(change.node_id)||!present(change.before)||!present(change.after))return false;
  let parts;try{parts=pointerParts(change.pointer);}catch{return false;}
  const key=change.node_id+'\0'+change.pointer;if(keys.has(key)||parts[0]==='node_id')return false;keys.add(key);
  if(route==='figma-description-sync'&&(change.pointer!=='/description'||typeof change.after!=='string'))return false;
  if(route==='figma-naming-audit'){
   if(change.pointer!=='/name'||typeof change.before!=='string'||typeof change.after!=='string')return false;
   const suffix=value=>value.match(/@(?:2|4)x$/u)?.[0]??null;
   if(suffix(change.before)!==suffix(change.after))return false;
  }
 }
 if(['migration-progress','component-onboarding'].includes(route)&&preview.changes.length)return false;
 return preview.changes.length>0||preview.repository_paths.length>0;
}
function expectedReadback(before,boundary){
 const expected=structuredClone(before),index=nodeIndex(expected);
 for(const change of boundary.changes){const node=index.get(change.node_id);if(!node||!exact(pointerValue(node,change.pointer),change.before))throw Error('Stale before');assignPointer(node,change.pointer,change.after);}return expected;
}

export async function executeMaintenanceWorkflow({context,pinnedSha,inputs={},conditions={},handlers={}}={}){
 const executed=[];
 const stop=(code,path)=>workflowStop(code,path,executed);
 if(context?.status!=='resolved'||!MAINTENANCE_ROUTES.has(context.route?.id)||context.route.workflow_source_id==='workflow-paused')return stop('maintenance-context-not-resolved','/context');
 if(!/^[a-f0-9]{40}$/u.test(pinnedSha??''))return stop('source-pin-missing','/pinnedSha');
 const source=context.bundle?.static_sources?.find(s=>s.id===context.route.workflow_source_id);
 let registry,mode;
 try{
  registry=parseStrictYaml(source?.content,source?.path);
  mode=registry.workflow.modes.find(m=>m.id===context.workflow.mode);
  if(registry.workflow.id!==context.route.id||registry.workflow.status!=='active'||!mode||
   !exact(mode.steps,context.workflow.steps)||!exact(mode.required_inputs,context.workflow.required_inputs))return stop('workflow-handoff-mismatch','/workflow');
  const available=new Set(context.bundle.static_sources.filter(s=>typeof s.content==='string'&&s.content.length).map(s=>s.id));
  if(mode.steps.some(s=>s.source_ids.some(id=>!available.has(id))))return stop('workflow-source-missing','/bundle/static_sources');
 }catch{return stop('workflow-handoff-mismatch','/workflow');}
 // Capabilities consume this one closed bundle; they cannot mutate later steps' context.
 const bundle=deepFreeze(structuredClone(context.bundle));
 const state=structuredClone(inputs);
 for(const input of mode.required_inputs)if(!present(state[input]))return stop(mode.input_blockers?.find(v=>v.input===input)?.blocker??'workflow-input-missing','/inputs/'+input);
 if(mode.id==='read-only'&&mode.steps.some(s=>/^(?:apply-|synchronize-|publish-)/u.test(s.id)))return stop('read-only-write-forbidden','/workflow/steps');
 let before=null,boundary=null,readbackVerified=false;
 for(const step of mode.steps){
  let enabled=true;
  if(step.condition_id){
   if(step.condition_id==='figma-write-in-scope')enabled=(boundary?.changes.length??0)>0;
   else if(step.condition_id==='repository-write-in-scope')enabled=(boundary?.repository_paths.length??0)>0;
   else if(step.condition_id==='figma-evidence-required')enabled=Array.isArray(state['target-scope']?.node_ids)&&state['target-scope'].node_ids.length>0;
   else if(typeof conditions[step.condition_id]==='boolean')enabled=conditions[step.condition_id];
   else return stop('workflow-condition-unresolved','/conditions/'+step.condition_id);
  }
  if(!enabled)continue;
  for(const input of step.required_inputs)if(!present(state[input]))return stop('workflow-input-missing','/steps/'+step.id+'/inputs/'+input);
  let output;
  if(step.id==='validate-staged-onboarding'){
   const record=state['staged-component-record'], evidence=state['figma-factual-evidence'], approval=state['approved-ready-component'];
   if(!record?.id||!record.contracts?.mobile?.root||!record.contracts?.desktop?.root||!evidence?.model||!evidence?.session||!evidence?.live||
      evidence.model.canonical_sha!==pinnedSha||approval?.id!==record.id||approval?.file_key!==record.figma?.file_key||approval?.node_id!==record.figma?.node_id)
      return stop('fact-unproven','/staged-component-record');
   try{const report=auditFigmaComponentEvidence({record,live:evidence.live,model:evidence.model,session:evidence.session,derivedEvidence:evidence.derived_evidence??[]});
    if(!report.ok)return stop('fact-unproven','/figma-factual-evidence');output={'audit-findings':report};
   }catch{return stop('fact-unproven','/figma-factual-evidence');}
  }else if(step.id==='prepare-change-boundary'){
   const preview=state['change-preview'];
   if(!exactBoundary(preview,state['write-authorization'],state['target-scope'],context.route.id,pinnedSha))return stop('authorization-scope-mismatch','/write-authorization');
   if(context.route.id==='figma-naming-audit'){
    const naming=context.bundle.foundation_definitions.find(d=>d.foundation_id==='figma-naming'&&d.definition_group==='foundation')?.value;
    const semantics=state['audit-findings']?.semantics??[];
    if(!naming)return stop('naming-foundation-missing','/bundle/foundation_definitions');
    for(const change of preview.changes){const semantic=semantics.find(v=>v.node_id===change.node_id&&v.confirmed===true);
     if(!semantic)return stop('semantic-role-required','/audit-findings/semantics');
     if(validateFigmaNameProposal(naming,{...semantic,name:change.after,existingName:change.before}).length)return stop('naming-proposal-invalid','/change-preview');
    }
   }
   boundary=structuredClone(preview);output={'change-boundary':boundary};
  }else{
   if(/^(?:apply-|synchronize-|publish-)/u.test(step.id)&&mode.id!=='write')return stop('read-only-write-forbidden','/steps/'+step.id);
   if(step.id==='apply-authorized-figma-change'){
    if(!boundary||!before)return stop('authorization-scope-mismatch','/change-boundary');
    try{expectedReadback(before,boundary);}catch{return stop('authorization-scope-mismatch','/figma-before');}
   }
   if(['synchronize-dependents','verify-exact-cloud-commit','publish-review','handoff'].includes(step.id)&&boundary?.changes.length&&!readbackVerified)return stop('figma-readback-mismatch','/figma-readback');
   if(step.id==='confirm-naming-semantics'){
    // A tool adapter must provide exact confirmed roles; names are never inferred here.
    if(!Array.isArray(state['target-scope']?.node_ids)||!before)return stop('identity-unconfirmed','/target-scope');
   }
   if(typeof handlers[step.id]!=='function')return stop('workflow-handler-missing','/handlers/'+step.id);
   try{output=await handlers[step.id]({step:deepFreeze(structuredClone(step)),inputs:deepFreeze(structuredClone(state)),bundle,pinned_sha:pinnedSha,route_id:context.route.id});}
   catch{return stop('workflow-handler-failed','/steps/'+step.id);}
   if(output?.blockers?.length)return stop(output.blockers[0].code??'workflow-handler-blocked','/steps/'+step.id);
  }
  if(!output||typeof output!=='object'||Object.keys(output).some(key=>!step.allowed_outputs.includes(key))||step.allowed_outputs.some(key=>!present(output[key])))return stop('workflow-output-invalid','/steps/'+step.id);
  if(step.id==='pin-canonical-state'&&output['pinned-sha']!==pinnedSha)return stop('source-pin-mismatch','/pinned-sha');
  if(step.id==='pin-canonical-state'&&context.route.id==='migration-progress'){
   const cloud=state['cloud-state-evidence'];
   if(!cloud||cloud.cloud_channel!=='github'||!(/^[a-f0-9]{40}$/u.test(cloud.tree_sha??'')))return stop('cloud-state-unverified','/cloud-state-evidence');
   if(cloud.canonical_sha!==pinnedSha)return stop('source-pin-mismatch','/cloud-state-evidence/canonical_sha');
  }
  if(step.id==='inspect-figma-read-only'){
   try{before=structuredClone(output['figma-before']);const index=nodeIndex(before);if(!state['target-scope'].node_ids.every(id=>index.has(id)))return stop('identity-unconfirmed','/figma-before');}
   catch{return stop('identity-unconfirmed','/figma-before');}
  }
  if(step.id==='confirm-naming-semantics'){
   const semantics=output['audit-findings']?.semantics;
   if(!Array.isArray(semantics)||!state['target-scope'].node_ids.every(id=>semantics.filter(v=>v.node_id===id&&typeof v.role==='string'&&v.role.length&&v.confirmed===true).length===1))return stop('semantic-role-required','/audit-findings/semantics');
  }
  if(step.id==='verify-figma-readback'){
   try{if(!exact(expectedReadback(before,boundary),output['figma-readback']))return stop('figma-readback-mismatch','/figma-readback');}
   catch{return stop('figma-readback-mismatch','/figma-readback');}
   readbackVerified=true;
  }
  if(step.allowed_outputs.includes('repository-change')){
    const change=output['repository-change'];
    if(!boundary||!Array.isArray(change?.paths)||new Set(change.paths).size!==change.paths.length||change.paths.some(path=>!boundary.repository_paths.includes(path)))return stop('repository-change-outside-scope','/repository-change/paths');
   }
   if(step.id==='verify-exact-cloud-commit'){
   const summary=output['verification-summary'];
   if(summary?.pinned_sha!==state['repository-change']?.cloud_sha||!Array.isArray(summary?.checks)||!summary.checks.length||summary.checks.some(c=>typeof c.command!=='string'||c.exit_code!==0))return stop('local-verification-failed','/verification-summary');
  }
  if(step.id==='publish-review'){
   const pr=output['github-pr'];
   if(pr?.draft!==true||pr.base!=='main'||pr.head_sha!==state['repository-change']?.cloud_sha||!/^https:\/\/github\.com\/flabenar-maker\/e-mail\/pull\/[1-9][0-9]*$/u.test(pr.url??''))return stop('publication-boundary-invalid','/github-pr');
  }
  Object.assign(state,structuredClone(output));executed.push(step.id);
 }
 const verification=state['verification-summary'];
 return {status:'complete',executed,outputs:state,handoff:{pinned_sha:pinnedSha,route_id:context.route.id,mode:mode.id,bundle_digest:bundle.digest,cloud_commit:state['repository-change']?.cloud_sha??null,cloud_branch:state['repository-change']?.branch??null,inspected_scope:state['target-scope']??null,changed_paths:state['repository-change']?.paths??[],verification_summary:verification??null,cloud_channel:'github',github_pr:state['github-pr']??null,limitations:verification?.limitations??[]}};
}
