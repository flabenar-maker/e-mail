---
name: maintaining-cupis-email-system
description: Use when auditing or changing CUPIS email-system instructions, Figma naming, component descriptions or design, registries, workflows, repository structure, or their synchronization.
---

# Maintaining the CUPIS Email System

## Overview

Act as a thin router over one machine-resolved CUPIS context. GitHub owns persistent data; the skill owns route selection, authorization boundaries and handoff. Never copy HTML rules, component facts, naming constants, Figma descriptions or workflow steps into this skill.

## Resolve the task context

1. Prefer the authenticated `gh CLI` for cloud GitHub reads and writes. If it is unavailable or unauthenticated, use the GitHub MCP connector. Never expose credentials.
2. Reuse the selected repository and pinned cloud SHA supplied by a trusted CUPIS task-router or bootstrap handoff for this task; do not repin `main` during that handoff. For a standalone invocation, resolve the trusted selected repository through bootstrap/README.md#repository-binding and pin its current `main` SHA. An explicitly authorized scoped candidate test uses its exact cloud SHA. Read `system/manifest.yaml` at the selected SHA; the specialization and task sources must match it. On mismatch stop rather than silently switching versions. The manifest is the only route catalog.
3. Select the route from the request. For system status or next-step questions, select `system-progress` and compare `docs/system-status.md` with actual GitHub state at the pinned SHA before answering.
4. Materialize a disposable exact-SHA snapshot of the pinned cloud commit. Verify that the snapshot HEAD equals the pinned SHA and prepare verified same-lock dependencies (see execution handoff), then invoke:

   ```text
   npm run resolve:skill-context -- --route <route-id> [--mode <workflow-mode>] [--component <stable-id>]... [--viewport mobile|desktop|both] [--foundation <id>]...
   ```

   Use `read-only` mode for audits and answers and `write` mode only for an authorized change. The snapshot exists only to produce the resolver result and run local checks; it is not a persistent working copy or source fallback.
5. Pass the trusted selected `repository` and `pinnedSha` to executeMaintenanceWorkflow; do not derive them from handler outputs. Consume exactly one resolved bundle. When the result is `resolved`, also consume only its `workflow.steps`; do not reopen its sources by path.
6. A `blocked` result stops the task. Report its typed blockers and do not invent missing rules, components or source paths.

### Paused routes

When the resolver returns `paused` with `SKILL_ROUTE_PAUSED`, use its bundle only for read-only navigation or an explicitly scoped system maintenance plan. A paused result does not authorize a production library operation, Figma write or email build. Do not substitute another workflow, a manual source list, unregistered files or remembered chat context.

Repository maintenance work is allowed only when the user request names the change and an applicable implementation plan defines its boundary. It still requires cloud publication, exact-SHA local verification and separate merge authorization.

A direct user request does not replace an applicable implementation plan while the route is paused. If the task is neither read-only navigation nor covered by such a plan, return `not ready` without any mutation.

## Change boundary

1. State whether the request is read-only or a write. Before any write, produce an impact report naming the proposed change, affected objects and properties, dependent sources, preserved areas, expected generated outputs and checks.
2. If the request is precise and consistent with the resolved bundle and workflow, proceed within that boundary. If it is ambiguous, conflicting or expands scope, stop after read-only diagnosis and request the missing decision.
3. Open Figma only when the resolved task requires it. **REQUIRED SUB-SKILL:** Use `figma` for Figma nodes and `figma:figma-use` before any `use_figma` action. Figma design, structure, naming or metadata writes require explicit authorization.
4. Apply the resolved naming foundation only when creating, renaming or auditing names. Before a rename, show the exact old → new mapping and inspect dependent records. Preserve an asset owner's scale suffix unless the user explicitly changes its export contract.
5. Make the smallest permitted change. Do not build or modify a concrete `email.html` or `images/` set with this skill.
6. Publish persistent edits only through cloud GitHub. Create `codex/<semantic-slug>` from the pinned SHA, change only allowed paths and open one draft PR. Never update `main` or merge without separate authorization.
7. On the exact final cloud commit, obtain the workflow's relevant verification receipts plus changed-content, dependency synchronization, allowed-path-diff and preserved-blob checks under the execution decision. Selected portable GitHub Actions require the explicit verified request; PR Checks never replace receipts.

<!-- CUPIS_EXECUTION_BINDING -->
## Execution handoff

After the domain gate, consult node scripts/resolve-execution-context.mjs --help for the short request/envelope contract; no full policy, schema, plan or other specialization is needed.
Use the pinned snapshot with verified same-lock dependencies; npm ci --ignore-scripts is preferred, and the identical direct Node script is allowed when npm/pnpm is absent. Record actual dependency/lock evidence; never claim npm ci if it was not performed.
Save the unchanged domain JSON in its source/route/mode/authorization envelope. Bind exact requirements, permitted outputs and actual artifacts with raw-byte SHA256 refs below one explicit reference root outside source.
The coordinator records only actual declared spawn-tool capabilities for this runtime session/signature, then calls node scripts/resolve-execution-context.mjs --request REQUEST --capabilities CAPABILITIES --repo-root SNAPSHOT --reference-root EVIDENCE.
To reuse a saved profile for workloads, request.profile_pair_key is REQUIRED alongside --pair-key or --local-binding-root. Obtain the trusted pair once per new chat with init-execution-profile.mjs --action read --state-root STATE --local-binding-root BIND, then reuse it; never infer trust from a copied wrapper or init/collect before tests. No-workload reads need no pair and touch no profile.
The coordinator uses decision.executor and decision.review with real agent tools, explicit model/reasoning_effort and fork_turns=none; keep briefs bounded and overlapping writes sequential. The Node helper does not spawn agents.
Bind the real executor_agent_id and final artifact refs by resolving again before acceptance. The reviewer inspects original requirements and actual permitted changes/sources, covers every requirement, and has a distinct real agent ID; executor confidence or test PASS is insufficient.
A typed model/effort refusal refreshes the runtime choice through the helper; no arbitrary substitution, downgrade or model web search. Network failures are not model refusals.
Selected portable verification uses node scripts/run-verification.mjs or node scripts/request-cloud-verification.mjs; unavailable cloud gives CLOUD_WORKFLOW_NOT_READY. Actual emails/images, installed discovery and live Figma remain local and are never uploaded automatically.
Use node scripts/finalize-execution.mjs --help and finalize bound review/verification receipts. Missing local-only evidence remains blocked after green cloud results; local_offer is informational and never starts another run or collects hardware.
Handoff includes source/route/mode, decision and actual agent IDs, bound artifacts/receipts, acceptance status and limitations. Paused/blocked domains, allowed outputs and separate merge/install permissions still control the task.
<!-- END_CUPIS_EXECUTION_BINDING -->

## Figma mutation gate

Before any Figma mutation, declare the target role, exact writable fields, dependent metadata and preserved structural fingerprint. A rename never authorizes Component ↔ Frame conversion, property or Slot changes, reparenting, hierarchy, Auto Layout, geometry, variants or bindings unless each operation was separately named and authorized.

After the final write, perform a separate read-only read-back and compare the allowlist and fingerprint. Any unexpected diff stops the task; report it without expanding scope to repair it.

## Boundary check and handoff

Change this skill only when routing, cloud-source selection, resolver invocation, authorization gates, publication boundaries or handoff shape changes. Technical rules, component contracts and workflow steps belong to the machine sources returned by the resolver.

Handoff with the pinned SHA, selected route and mode, resolver status, inspected scope, changed paths, checks actually run, cloud channel, branch/commit/PR and real limitations. Never claim Figma or GitHub verification that was not performed.
