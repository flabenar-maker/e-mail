---
name: maintaining-cupis-email-system
description: Use when auditing or changing CUPIS email-system instructions, Figma naming, component descriptions or design, the registry, maintenance workflows, repository structure, or their synchronization.
---

# Maintaining the CUPIS Email System

## Overview

Act as a thin router over the canonical CUPIS system. Load current rules from GitHub; never copy HTML rules, naming constants, component contracts, Figma descriptions, or library values into this skill.

## Canonical Manifest

Use cloud GitHub access in this order:

1. Prefer the authenticated `gh` CLI for repository reads, writes, branch and PR operations. Before using it, check that `gh` is installed and that `gh auth status` succeeds.
2. If `gh` is unavailable, unauthenticated, or cannot perform the required operation, use the GitHub MCP tool through `github:github` as the fallback.

Both channels are equivalent cloud sources. Never use a local checkout, attachment, cached copy or manually pasted token as a fallback, and never expose an authentication token in chat.

A disposable isolated local snapshot of an exact cloud commit is allowed solely for validation; it is never a source fallback or working copy. Keep all repository edits in cloud GitHub. Run applicable tests and regression checks locally on that snapshot. Never start, read, or rely on GitHub Actions or PR Checks as evidence or merge gates.

Treat `flabenar-maker/e-mail` as the only persistent source. Resolve and pin the current `main` commit, then fetch `system/manifest.yaml` at that exact SHA.

Select the applicable `routes[].id`, resolve its `bundle_profile_id`, then resolve every listed `source_id` through `sources[]`. Fetch only those paths, always at the pinned SHA. Stop if the manifest, route, profile, source reference or file is missing or invalid. Never fall back to a second manifest, local checkout, attachment, cached copy, older commit or undeclared future path.

Use the resolved README to assign file responsibility and the resolved maintenance workflow to classify the task, set scope, synchronize dependencies and choose checks. Source roles come from manifest `kind`; this skill does not maintain a second path list.

For any question about migration status, the next stage, completed stages, or updating the migration sequence, select the `migration-progress` route. At the pinned SHA, list `docs/superpowers/plans/` and re-read the roadmap resolved by that route before answering. Never infer progress from chat memory. Mark a stage complete only after verifying its required artifacts are merged into `main`; record its implementation-plan or PR link when available.

## Route

1. State whether the task is read-only or allows writes. For writes, name the permitted objects, properties, dependent synchronization, and preserved areas before changing anything.
2. If the request is precise and consistent with the canonical set, proceed without ceremonial clarification. If it is vague, conflicting, or expands scope, perform only the necessary read-only diagnosis and ask for the missing decision.
3. Open Figma only when the checkpoint makes it relevant. **REQUIRED SUB-SKILL:** Use `figma` for Figma nodes and `figma:figma-use` before any `use_figma` action. A description-only request permits only the explicitly allowlisted description fields plus required registry synchronization. A Figma design or naming write requires explicit user authorization.
4. Apply the naming standard when creating, renaming or structurally changing a component, property, semantic layer or asset owner, and during an explicit naming audit. New objects must comply before completion. For an existing in-scope mismatch, show an exact old → new mapping and request authorization unless the rename was already requested. Treat out-of-scope existing mismatches as read-only findings; never expand the task automatically.
5. Before an authorized rename, identify references in the registry and Figma descriptions. Preserve an asset owner's existing scale suffix unless the user explicitly changes its export contract. After the write, verify scoped names, properties, children and required synchronization.
6. Make the smallest canonical change. Do not edit local system copies. Do not build or modify a concrete `email.html` or `images/` set with this skill.
7. For a no-op, report the existing canonical rule with its commit and create no branch. For a write, re-read and validate the changed source before publication.
8. Publish only through GitHub. Prefer authenticated `gh` CLI operations; use GitHub MCP only when the CLI is unavailable or insufficient. Create `codex/<semantic-slug>` from the pinned SHA, commit only the approved paths, and open one draft PR after the required publication authorization. Never update `main` or merge without separate authorization.
9. Fetch the branch after the final write. Run exactly the relevant checkpoint checklist plus changed-content, required-synchronization, allowed-path-diff, and preserved-blob checks locally against the exact final branch SHA. Add no generic codebase, build, visual, Figma-publishing, or delivery checks. Verify that no local email outputs, archives, reports, or duplicated system rules were added.

## Figma Mutation Gate

Before any Figma write, use the checkpoint to declare the node's current and intended semantic role, exact writable fields, dependent metadata to inspect, and preserved structural fingerprint. Treat a production component, root shell, assembly template, example, and export asset as different roles. If the role is unclear or would change, stop after read-only diagnosis and request explicit authorization.

A rename authorizes only the approved old → new mappings. It never authorizes Component ↔ Frame conversion, component-property or Slot creation/deletion, reparenting, hierarchy, Auto Layout, geometry, variant, or binding changes unless those operations were separately named and authorized.

After the last write, perform a separate read-only re-fetch and compare the allowlist and fingerprint. Any unexpected diff stops the task: report it and do not expand scope to repair it. Inspect related component-property and Slot descriptions for the same contract, but edit only metadata fields included in the allowlist.

## Boundary Check

The skill owns routing, cloud-source selection, naming-audit activation, Figma mutation-gate activation, and handoff shape. The canonical files own all email rules, naming constants, workflows, and component facts. Change this skill only when its trigger, repository locator, canonical-set paths, routing boundary, naming-audit activation model, cloud publication model, or local-verification boundary changes.

Handoff with the pinned base SHA, inspected sources, classification and scope, changed paths, checks actually run, cloud channel used (`gh` CLI or GitHub MCP), branch/commit/PR when created, and actual limitations. Never claim Figma or GitHub verification that was not performed.
