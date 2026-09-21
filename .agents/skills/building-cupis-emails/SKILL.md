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

If the task type or Mobile/Desktop roles are unknown, ask only for that missing fact. If the request is exact and compatible with the resolved workflow, proceed without another question. Do not use this skill for library maintenance or new-component design.

## Resolve and operate

Pin the current main SHA in flabenar-maker/e-mail through authenticated gh CLI, or GitHub MCP if CLI is unavailable. An explicitly authorized candidate test uses its exact cloud SHA instead. Read system/manifest.yaml at that SHA; resolve the selected route, profile and workflow through its source references. Missing sources stop the request.

Before a full bundle, prepare resolver inputs read-only. For a design-dependent request, use Figma MCP to establish the supplied pair's roles and exact canonical component identities, including nested instances. Match identities against the component records declared by the workflow, using registered owner/variant links. Layer names, visual similarity and Description are not identity proof. Unknown or ambiguous matches require the affected node ID and a diagnostic.

This preparation reads identity and routing data only; it does not authorize asset export or HTML output. It must not change a paused route. Technical fixes require no Figma input. Read-only requests inspect only the evidence needed for the question; when no components are selected, email-continue-fix supports read-only and clarify modes without a component prerequisite.

The command requires the chosen route and mode:

```text
npm run resolve:skill-context -- --route ROUTE --mode MODE
```

Replace ROUTE and MODE with the classified values. For design-dependent work append `--viewport both` and repeat `--component ID` for each confirmed stable component ID, including the root. For other modes, component and viewport arguments must match the selected profile and available evidence.

Consume exactly one resolved bundle and only returned workflow.steps. A changed component selection replaces the entire bundle at the same pinned SHA; do not combine old and new contexts. Model construction is performed by the agent under the returned workflow using its verified inputs; the absence of a separate automatic importer is not itself a blocker.

When the manifest route is paused or the resolver reports SKILL_ROUTE_PAUSED, stop execution without a manual fallback; only read-only navigation is permitted. When the resolver returns blocked, report its diagnostics. A resolved route on an explicitly authorized candidate SHA permits that candidate test before merge. Production readiness still requires the acceptance and publication gates; a resolved status alone does not prove fidelity.

## Operating boundaries

No Figma mutation.
No new-component design.
No production email outputs committed to GitHub.
No overwrite of a source email version.
No GitHub Actions or PR Checks.
