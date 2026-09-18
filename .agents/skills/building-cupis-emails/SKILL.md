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

Run:

```text
npm run resolve:skill-context
```

Consume exactly one resolved bundle and only returned workflow.steps. When the resolver reports SKILL_ROUTE_PAUSED, stop execution without a manual fallback. Before Task 8 cutover, a paused route permits only read-only navigation and implementation of this migration plan; it does not permit a production build or user-email mutation. After a resolved cutover, use only the returned bundle and its ordered workflow steps; do not open sources from memory or a hardcoded list.

## Operating boundaries

No Figma mutation.
No new-component design.
No production email outputs committed to GitHub.
No overwrite of a source email version.
No GitHub Actions or PR Checks.
