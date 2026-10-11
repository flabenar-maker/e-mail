import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..'),read=p=>readFile(resolve(root,p),'utf8');
for(const name of ['building-cupis-emails','maintaining-cupis-email-system'])test(name+' exposes a thin execution binding without duplicating policy',async()=>{
 const text=await read('.agents/skills/'+name+'/SKILL.md');const block=text.match(/<!-- CUPIS_EXECUTION_BINDING -->([\s\S]*?)<!-- END_CUPIS_EXECUTION_BINDING -->/u)?.[1];assert.ok(block,'bounded integration block');assert.ok(block.trim().split('\n').length<=25);for(const token of ['resolve-execution-context.mjs','--help','decision.executor','decision.review','fork_turns=none','finalize-execution.mjs','same-lock'])assert.ok(block.includes(token),token);assert.doesNotMatch(block,/gpt-[0-9]|physical RAM|target_tier/u);assert.doesNotMatch(text,/Never start, read or rely on GitHub Actions|No GitHub Actions or PR Checks\.|If neither runner is available, stop/u);
});
test('router selects one domain specialization without loading execution policy',async()=>{const text=await read('.agents/skills/cupis-email-task-router/SKILL.md');assert.doesNotMatch(text,/resolve-execution-context.mjs|gpt-[0-9]/u);assert.match(text,/specialization owns execution/u);});
test('CLI help contains a usable bounded request and domain envelope contract',()=>{const help=execFileSync(process.execPath,['scripts/resolve-execution-context.mjs','--help'],{cwd:root,encoding:'utf8'});assert.ok(Buffer.byteLength(help)<=4096);for(const field of ['task_kind','workload_ids','requirement_refs','artifact_refs','domain_context_ref','authorization','executor_agent_id','declared-runtime-tools'])assert.ok(help.includes(field),field);});
test('active entrypoints use canonical policy and preserve optional cloud readiness',async()=>{for(const p of ['AGENTS.md','README.md','bootstrap/README.md','bootstrap/config.portable.toml']){const text=await read(p);assert.match(text,/data\/execution\/policy.yaml/u,p);assert.doesNotMatch(text,/Never start, inspect, or rely on GitHub Actions|не отменяет действующий запрет Actions|GitHub Actions и PR Checks не запускаются/u,p);}});
