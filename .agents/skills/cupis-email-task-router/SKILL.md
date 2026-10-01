---
name: cupis-email-task-router
description: Use when a CUPIS email or email-system request needs a task entrypoint in Codex, including unclear or mixed email/library scope; not for unrelated work.
---

# CUPIS Email Task Router

Select a specialization, not a rendering strategy or workflow. Use this entrypoint after the repository's project context or this skill is loaded in local Codex or Codex Web. A remote AGENTS pointer does not autoactivate it in an unrelated/projectless chat.

Through authenticated gh CLI (GitHub MCP fallback), resolve and pin current `main` of `flabenar-maker/e-mail`; an explicitly authorized candidate test pins its specified cloud SHA instead. Read skill registrations in `system/manifest.yaml` and the selected skill at that exact SHA. A missing manifest, registration or skill gives `not-ready`; do not substitute a remembered or installed copy.

## Decide before writing

| Request scope | Outcome and handoff |
| --- | --- |
| Create, change or read-only inspect a concrete email | `email` → `building-cupis-emails` |
| Audit/change the existing library, contracts, instructions, registry or synchronization; ask about migration | `maintenance` → `maintaining-cupis-email-system` |
| Design a new block/component | `not-ready`: the dedicated component-development specialization is not active. Do not substitute component onboarding or email build. |
| Scope is unknown, or new versus existing email is unclear | `clarify`: ask only for the missing distinction before any write. |

Respect an explicitly selected specialization. If the requested scope conflicts with it, explain the boundary and clarify rather than silently switching. New-component design remains `not-ready` even when the user authorizes it.

For a mixed email/library request, identify separate scopes and their dependency, then route each separately. Clear authorized scopes need no repeated consent; unclear order or scope needs clarification. One scope's authorization never permits the other's writes, and a stopped dependency prevents dependent work.

## Hand off once

Briefly name the outcome and selected specialization (or the one missing fact/blocker). **REQUIRED SUB-SKILL:** Read and use only the selected specialization from its manifest registration; pass the request, pinned SHA, evidence and scope boundary. It retains the handed-off SHA without repinning and owns route/mode selection, resolver invocation and execution. If the skill or task sources do not match that SHA, stop and report the mismatch. Do not load both specializations for a single-scope task, fetch a bundle here, or bypass their stopped routes.

Bootstrap/setup requests follow the project bootstrap entrypoint instead. This router does not claim Web delivery readiness.
