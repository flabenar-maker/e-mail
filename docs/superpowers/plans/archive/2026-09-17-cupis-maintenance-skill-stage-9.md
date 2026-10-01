# CUPIS Maintenance Skill Stage 9 Implementation Plan

> **Архив завершённого этапа.** Этот документ сохраняет исходные решения, команды, пути, чекбоксы и промежуточные статусы; они не являются текущей очередью или разрешением выполнять старые шаги. Часть работ могла быть отменена или передана в последующие этапы. Актуальный порядок и открытые обязательства находятся в [едином roadmap](../2026-08-25-cupis-migration-roadmap.md).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Подготовить maintenance skill к единственному машинно-разрешённому route-specific bundle и structured workflow, не включая остановленные маршруты и не создавая второй список правил или путей.

**Architecture:** Новый resolver связывает существующие manifest route, generated context bundle и structured workflow. Пока route указывает на `workflow-paused`, resolver возвращает typed paused-result с одним shadow bundle и без workflow steps; после отдельного cutover тот же интерфейс разрешит workflow по manifest source ID. Skill вызывает только этот resolver на временном снимке точного cloud SHA и не воспроизводит его логику языковыми инструкциями.

**Tech Stack:** Node.js 24, ECMAScript modules, YAML 2.9.0, AJV 8.20.0, `node:test`, PowerShell bootstrap, GitHub CLI.

**Spec:** `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`, разделы 9, 11, 12 и 15.\n\n**Implementation:** [PR #85](https://github.com/flabenar-maker/e-mail/pull/85). На `e35dd2e702656624913edbc718b3320d80df9981` локально прошли resolver check, targeted suite 40/40, `npm run generate:check`, `npm run verify` 585/585 и Windows bootstrap; все семь routes остались `workflow-paused`.

## Global Constraints

- `flabenar-maker/e-mail` в облачном GitHub остаётся единственным persistent source; изменения публикуются через branch и PR.
- Stage 9 сохранял все семь routes остановленными на момент своей реализации и не выполнял cutover. После Stage 10 два email routes активны; оставшиеся maintenance-маршруты включаются только после gate 11A в финальном cutover 11B по актуальному roadmap.
- Resolver не читает `Legacy/`, не принимает fallback source list и не содержит component, typography, spacing, asset или naming facts.
- Skill остаётся тонким маршрутизатором: route selection, cloud pinning, resolver invocation, mutation gates и handoff.
- Figma, component contracts, foundations, generated docs, конкретные письма и локальные папки писем не изменяются.
- Локальный снимок допустим только как временная материализация точного cloud SHA для resolver и проверок; он не становится рабочим источником или местом persistent-правок.
- Все проверки выполняются локально на точном final cloud commit; GitHub Actions и PR Checks не используются.

---

### Task 1: Зафиксировать статус Stage 8 и границу Stage 9

**Files:**
- Modify: `docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md`
- Create: `docs/superpowers/plans/archive/2026-09-17-cupis-maintenance-skill-stage-9.md`

**Interfaces:**
- Consumes: merged PR #81–84 and main SHA after Package 12.
- Produces: canonical roadmap status and this executable plan.

- [x] **Step 1: Mark Stage 8 complete from merged facts**

Record PR #81–84, 61 covered active records, structured workflows, `structured-shadow`, paused routes and local final verification. Do not mark Package 10D complete.

- [x] **Step 2: Link Stage 9 to this implementation plan**

Mark Stage 9 `в работе`; state that it prepares the skill but does not activate routes.

- [x] **Step 3: Verify documentation scope**

Run:

```powershell
git diff --name-only main...HEAD
```

Expected at this checkpoint: only the roadmap and this plan.

---

### Task 2: Define the skill-context resolver with RED tests

**Files:**
- Create: `tests/skills/skill-context.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `buildContextBundle`, `loadSystemManifest`, `loadWorkflowRegistry`, `resolveWorkflowSteps`.
- Produces: required behavior for `resolveSkillContext({ repoRoot, routeId, workflowMode, candidates, viewports, foundationIds })`.

- [x] **Step 1: Write the paused-route test**

```js
const result = await resolveSkillContext({
  repoRoot,
  routeId: "migration-progress",
});
assert.equal(result.status, "paused");
assert.equal(result.bundle.mode, "structured-shadow");
assert.equal(result.workflow, undefined);
assert.deepEqual(result.blockers.map(({ code }) => code), [
  "SKILL_ROUTE_PAUSED",
]);
```

- [x] **Step 2: Write the future-active fixture test**

In an isolated fixture, replace only the maintenance route/profile workflow source from `workflow-paused` to `workflow-library-maintenance`. Resolve `library-maintenance` / `read-only` with `viewports: ["mobile"]` and assert ordered step IDs `pin-canonical-state` through `verify-read-only-findings`.

- [x] **Step 3: Write deterministic blocker tests**

Cover unknown route, active route without `workflowMode`, unknown structured workflow source and unknown mode. Assert stable code/path/message ordering.

- [x] **Step 4: Add the tests to the local suite**

Extend `package.json` with `tests/skills/*.test.mjs` and add only required workflow/resolver files to `canonicalSystemFixtureFiles`.

- [x] **Step 5: Run RED**

```powershell
node --test tests/skills/skill-context.test.mjs
```

Expected: import failure for missing `scripts/lib/skill-context.mjs`.

---

### Task 3: Implement the machine resolver

**Files:**
- Create: `scripts/lib/skill-context.mjs`
- Test: `tests/skills/skill-context.test.mjs`

**Interfaces:**
- Produces: `resolveSkillContext(options)`.
- Result types:
  - paused: `{ status: "paused", route, bundle, blockers }`;
  - resolved: `{ status: "resolved", route, bundle, workflow: { id, mode, steps } }`;
  - blocked: `{ status: "blocked", blockers }`.

- [x] **Step 1: Resolve the generated bundle once**

Call `buildContextBundle` with the exact route selections. Reuse its typed blockers; do not reimplement bundle selection.

- [x] **Step 2: Return the paused boundary**

When `bundle.route.workflow_source_id === "workflow-paused"`, return one `SKILL_ROUTE_PAUSED` blocker, the resolved shadow bundle and no workflow.

- [x] **Step 3: Map an active route through manifest capability**

Find `manifest.structured_workflows.entries[].source_id` equal to the route workflow source. If absent, return `SKILL_WORKFLOW_UNSTRUCTURED`. Never infer workflow ID from a path or filename.

- [x] **Step 4: Resolve exact workflow mode and immutable steps**

Require `workflowMode` for a non-paused route, call the Package 12 loader/resolver and return the ordered frozen steps. Convert known validation errors to stable blockers.

- [x] **Step 5: Run GREEN**

```powershell
node --test tests/skills/skill-context.test.mjs
```

Expected: all tests pass.

---

### Task 4: Add the deterministic CLI boundary

**Files:**
- Create: `scripts/resolve-skill-context.mjs`
- Create: `tests/skills/skill-context-cli.test.mjs`
- Modify: `package.json`

**Interfaces:**
- CLI: `npm run resolve:skill-context -- --route <id> [--mode <id>] [--component <id>]... [--viewport mobile|desktop|both] [--foundation <id>]...`.
- Stdout: canonical JSON result followed by one newline.
- Exit codes: `0` for `paused` or `resolved`; `1` for invalid arguments or `blocked`.

- [x] **Step 1: Write RED CLI tests**

Assert deterministic JSON, no stderr for current paused route, repeated selectors, invalid viewport diagnostics and nonzero blocked status.

- [x] **Step 2: Reuse existing argument semantics**

Reuse the same route/component/viewport/foundation meanings as `build-context-bundle.mjs`; add only optional `--mode`.

- [x] **Step 3: Implement JSON-only output**

Do not render Markdown, read environment secrets or perform network/Figma/GitHub writes.

- [x] **Step 4: Run GREEN**

```powershell
node --test tests/skills/skill-context-cli.test.mjs
```

Expected: all tests pass.

---

### Task 5: Route the maintenance skill through the resolver

**Files:**
- Modify: `.agents/skills/maintaining-cupis-email-system/SKILL.md`
- Create: `tests/skills/maintenance-skill-boundary.test.mjs`

**Interfaces:**
- Consumes: `resolve:skill-context` output only.
- Preserves: cloud GitHub priority, migration-progress refresh, Figma mutation gate, naming gate, local exact-commit verification and separate merge authorization.

- [x] **Step 1: Write RED boundary tests**

Assert that the skill:

- invokes `npm run resolve:skill-context`;
- consumes exactly one resolved bundle and, only when active, one structured workflow;
- treats `SKILL_ROUTE_PAUSED` as a production/library-operation stop;
- does not list canonical source paths, component facts or workflow step copies;
- does not authorize Figma writes, email builds or route activation while paused;
- preserves migration-progress refresh and impact/read-back gates.

- [x] **Step 2: Replace manual source resolution with resolver invocation**

After pinning cloud `main`, materialize a disposable exact-SHA snapshot, run `npm ci --ignore-scripts`, invoke the resolver and verify the snapshot HEAD equals the pinned SHA. The snapshot is read-only input to the resolver and local checks, never the persistent edit source.

- [x] **Step 3: Define paused behavior without fallback**

For a paused result, permit only read-only navigation and an explicitly scoped migration implementation plan; stop production library operations, Figma mutation and email build. Never substitute another workflow or source list.

- [x] **Step 4: Define future active behavior**

For a resolved result, use only returned bundle and workflow steps. Do not reopen static sources by path or add prose copies to the skill.

- [x] **Step 5: Run GREEN**

```powershell
node --test tests/skills/maintenance-skill-boundary.test.mjs
```

Expected: all tests pass.

---

### Task 6: Verify exact cloud commit and publish

**Files:**
- Modify only the paths listed in Tasks 1–5.

- [x] **Step 1: Run focused checks locally**

```powershell
npm ci
node --test tests/skills/*.test.mjs tests/workflows/structured-workflows.test.mjs tests/generation/context-bundle*.test.mjs
npm run generate:check
```

- [x] **Step 2: Run the full gate once on the final cloud SHA**

```powershell
npm run verify
pwsh -NoProfile -File bootstrap/verify.ps1
```

- [x] **Step 3: Inspect preserved boundaries**

Confirm all route workflow source IDs remain `workflow-paused`, Figma/component/foundation/generated files are byte-identical to base, and no concrete email output or local system copy entered the diff.

- [x] **Step 4: Publish one PR**

The PR must state exact SHA, local commands/results, preserved paused routes, and that GitHub Actions/Checks were not used.

## Success Criteria

- Current canonical routes return one typed paused result with one `structured-shadow` bundle and no active workflow steps.
- A fixture with an explicitly active structured maintenance route resolves the exact workflow mode and ordered steps without any hard-coded file mapping.
- The skill has no duplicate rules or canonical path list and cannot bypass paused state.
- Cloud-only ownership, Figma mutation gate, impact report, read-back and separate merge authorization remain intact.
- All local checks pass on the exact final cloud SHA; Figma and email outputs remain unchanged.
