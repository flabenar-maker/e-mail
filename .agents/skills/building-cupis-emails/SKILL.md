---
name: building-cupis-emails
description: Use when creating, changing, or read-only inspecting a concrete CUPIS email; not for library maintenance or new-component design.
---

# Building CUPIS Emails

<!-- EMAIL_BUILD_ROUTE_POLICY
{"routes":["email-new-build","email-continue-fix"],"resolvedBundle":"exactly-one","steps":"returned-workflow.steps-only","onPaused":"stop-without-manual-fallback"}
-->

Route a concrete email request through one machine-resolved context. This skill owns request classification and operating boundaries only; the resolver provides all task material.

## Classify the request

| Request | Route | Mode |
| --- | --- | --- |
| New email with exact Mobile/Desktop links | email-new-build | new-build |
| Existing email change that depends on design | email-continue-fix | continue-fix-design |
| Existing email technical change without a design change | email-continue-fix | continue-fix-technical |
| Read-only audit of a concrete email | appropriate email route | read-only |
| Unclear new-versus-existing request | appropriate email route | clarify |

If the task type is unknown, clarify that boundary. For missing design URLs, use separate free-text question fields in one request: “Ссылка на Desktop-макет в Figma” and “Ссылка на Mobile-макет в Figma”. Ask only for missing roles; do not combine both into one answer field or ask again for known URLs. Immediately after the design-link request is answered, ask for a missing mailing subject in a separate free-text field labelled “Тема письма для Альткрафта”; if both links were already supplied, ask for the subject next. Reuse an explicitly supplied subject without asking again. The mailing subject is separate from the email body and must not be inferred from its text or the design. Keep the answer in delivery metadata so the Altcraft release writes it to `email/subject.txt`. If the subject is missing, design-only HTML may continue but the final Altcraft release waits for it. Do not use this skill for library maintenance or new-component design.

During layout, request only missing user action links from the visible concrete email, in one form labelled by block and actual action text. Reuse existing copy and suitable source text for image alternatives under the assembly standard; do not ask for alt, preheader, sender, text version or model. If all required links are known, continue without a questionnaire. Hidden elements follow per-viewport instance visibility, including hidden ancestors, and need no content, links or exports where hidden. The resolved schema and source-fidelity standard define these bindings.

During email layout, report an error and its immediately known cause briefly; if the cause is unconfirmed, say so without deep diagnosis. Correct only the concrete email within existing rules and authorization; if continuation is impossible, stop and preserve completed work. Never propose, plan or apply system changes, ask approval for them, or invite a maintenance request as part of layout. A later explicit user request to address the cause is a separate task, reclassified by the CUPIS task-router.

## Resolve and operate

Reuse the selected repository and pinned cloud SHA supplied by a trusted CUPIS task-router or bootstrap handoff for this task; do not repin main during that handoff. For a standalone invocation, resolve the trusted selected repository through bootstrap/README.md#repository-binding and pin its current main SHA through authenticated gh CLI, or GitHub MCP if CLI is unavailable. An explicitly authorized candidate test uses its exact cloud SHA instead. The specialization and task sources must match the selected SHA; on mismatch stop rather than silently switching versions. Read system/manifest.yaml at that SHA; resolve the selected route, profile and workflow through its source references. Missing sources stop the request.

Before a full bundle, prepare resolver inputs read-only. For design-dependent work, use Figma MCP to identify the pair's roles, email root and components in the model tree, including visible nested components declared by their parent's contract. Read own visible states and their relevant ancestors independently for each viewport; hidden branches are not required component candidates, but preserve the owner/node graph needed to prove visibility bindings. Match registered owner/variant identities in the workflow's component records. Asset wrappers and internal graphics belong to their registered export owner, not separate resolver candidates. Names, visual similarity and Description are not identity proof. Unknown or ambiguous required component or asset-owner matches require the affected node ID and a diagnostic.

This preparation reads identity and routing data only; it does not authorize asset export or HTML output. It must not change a paused route. Technical fixes require no Figma input. Read-only requests inspect only the evidence needed for the question; when no components are selected, email-continue-fix supports read-only and clarify modes without a component prerequisite.

The resolver and handoff read execution files from repoRoot; they do not automatically fetch the pinned cloud commit. Before invoking either, verify that those files match the pinned cloud commit. Candidate tests use an authorized disposable exact-SHA verification snapshot, never a local authoring copy. If a matching execution environment cannot be verified, stop and report it; do not use an arbitrary checkout. This is an execution prerequisite, not a claim of an implemented runtime SHA gate.

Use an available package runner for the same repository script. Prefer npm; pnpm is also supported. With verified same-lock dependencies, direct Node is the equivalent when those runners are absent. The command requires the chosen route and mode:

```text
npm run resolve:skill-context -- --route ROUTE --mode MODE
# Or, when npm is unavailable:
pnpm run resolve:skill-context --route ROUTE --mode MODE
# Same-lock direct equivalent:
node scripts/resolve-skill-context.mjs --route ROUTE --mode MODE
```

Replace ROUTE and MODE with the classified values. For design-dependent work append `--viewport both` and repeat `--component ID` for each confirmed stable component ID, including the root. For other modes, component and viewport arguments must match the selected profile and available evidence.

Consume exactly one resolved bundle and only returned workflow.steps. A changed component selection replaces the entire bundle at the same pinned SHA; do not combine old and new contexts. Model construction is performed by the agent under the returned workflow using its verified inputs; the absence of a separate automatic importer is not itself a blocker.

When the manifest route is paused or the resolver reports SKILL_ROUTE_PAUSED, stop execution without a manual fallback; only read-only navigation is permitted. When the resolver returns blocked, report its diagnostics. A resolved route on an explicitly authorized candidate SHA permits that candidate test before merge. Production readiness still requires the acceptance and publication gates; a resolved status alone does not prove fidelity.

<!-- CUPIS_EXECUTION_BINDING -->
## Execution handoff

After the domain gate, consult node scripts/resolve-execution-context.mjs --help for the short request/envelope contract; no full policy, schema, plan or other specialization is needed.
Use the pinned snapshot with verified same-lock dependencies; npm ci --ignore-scripts is preferred, and the identical direct Node script is allowed when npm/pnpm is absent. Record actual dependency/lock evidence; never claim npm ci if it was not performed.
Save the unchanged domain JSON in its source/route/mode/authorization envelope. Bind requirements, permitted outputs and actual artifacts with raw-byte SHA256 refs below one explicit reference root outside source.
Preserve the user's current selected model. Runtime capabilities attest selected_model (explicit reliable ID, otherwise inherited/null), supported_efforts and capabilities for the actual session/tool signature; do not inspect catalogs, auth files, prices or newer versions. An undisclosed name is not unavailability and never requires a model-choice question.
Call node scripts/resolve-execution-context.mjs --request REQUEST --capabilities CAPABILITIES --repo-root SNAPSHOT --reference-root EVIDENCE; saved-profile workloads also pass --profile PROFILE_READ_JSON --pair-key PAIR. Save the resolved frozen decision for this request. It chooses only supported effort, including one supported step of quality cushion capped at the same model's maximum.
To reuse a saved profile for workloads, request.profile_pair_key is REQUIRED alongside --pair-key or --local-binding-root. Obtain the trusted pair and saved wrapper once per new chat with node scripts/init-execution-profile.mjs --action read --state-root STATE --local-binding-root BIND, then reuse the wrapper and test_concurrency choice; never init/collect before tests. No-workload reads need no pair and touch no profile.
Initial bootstrap uses the already approved 2/4 choice; ask once only for a new profile with no prior choice. A valid legacy profile missing test_concurrency reads as 2 without writes or questions. CHOICE is the approved integer 2 or 4. Only an explicit user change uses node scripts/init-execution-profile.mjs --action set-concurrency --test-concurrency CHOICE --state-root STATE --pair-key PAIR; retain the current request's unchanged wrapper/frozen decision and use the updated saved wrapper for future requests.
Use decision.executor and decision.review.reviewer selected_model and effort with actual agent tools. Omit a model override for inherited binding; for explicit binding pass only its attested ID. Set reasoning_effort with fork_turns=none and bounded briefs; serialize overlapping writes. Never substitute a different model. The Node helper does not spawn agents.
When the user changes the selected model or account, invalidate the capability cache and create fresh agents; an inherited/null binding cannot reveal that change by its name. A typed effort refusal may retry the helper's next supported effort on the same binding. A model/capability refusal blocks that role without substitution; a network failure is not a model refusal.
Bind actual executor_agent_id and final artifact refs by resolving again before acceptance with the same request-bound saved wrapper; a later preference change cannot replace the current frozen choice. The independent reviewer inspects original requirements and actual permitted sources/changes, covers every requirement and has a distinct actual ID. Review receipts bind reviewer_model_binding plus runtime_session_id/tool_signature; test PASS and executor confidence are insufficient.
Selected local verification passes --decision DECISION --profile PROFILE_READ_JSON to node scripts/run-verification.mjs with the same request/source/workloads; --test-concurrency CHOICE is optional and must match the frozen decision before spawn. Bare legacy npm test runs 2; controlled 4 npm test requires a local repository-full decision. Selected cloud verification uses node scripts/request-cloud-verification.mjs only within current user authorization and remains 2. Actual emails/images, installed discovery and live Figma remain local and are never uploaded automatically. PR Checks never replace evidence.
Record actual test concurrency in each mapped local workload_results[].test_concurrency and compare actual command evidence with the frozen signature; local 4 requires explicit 4, while a missing legacy field means 2 only with matching identities. Finalize bound review/verification receipts with node scripts/finalize-execution.mjs --help. Missing local-only evidence remains blocked; local_offer is informational and never starts another run or collects hardware.
Handoff includes source/route/mode, decision, actual agent IDs, bound artifacts/receipts, acceptance status and limitations. Domain gates, permitted outputs and separate merge/install permissions remain in force.
<!-- END_CUPIS_EXECUTION_BINDING -->

## Operating boundaries

No Figma mutation.
No new-component design.
No production email outputs committed to GitHub.
No overwrite of a source email version.
Actual email verification stays local; PR Checks never replace receipts.
