---
name: maintaining-cupis-email-system
description: Use when auditing or changing CUPIS email-system instructions, Figma naming, component descriptions or design, the registry, maintenance workflows, repository structure, or their synchronization.
---

# Maintaining the CUPIS Email System

## Overview

Act as a thin router over the canonical CUPIS system. Load current rules from GitHub; never copy HTML rules, naming constants, component contracts, Figma descriptions, or library values into this skill.

## Canonical Set

**REQUIRED SUB-SKILL:** Use `github:github` for repository reads and writes.

Treat `flabenar-maker/e-mail` as the only persistent source. Resolve the current `main` commit, then fetch all of these paths at that exact SHA:

- `README.md`
- `core/email-figma-prompt.md`
- `core/figma-component-naming-standard.md`
- `registry/email-component-descriptions-registry.md`
- `workflows/library-maintenance-checkpoint.md`

Stop if any file is missing or cannot be read at the pinned SHA. Do not substitute a local checkout, attachment, cached copy, or older commit.

Use the README to assign file responsibility and the maintenance checkpoint to classify the task, set scope, select sources, synchronize dependencies, and choose checks. Use the instruction for global email rules, the naming standard for Figma naming decisions, and the registry for current factual component content.

## Route

1. State whether the task is read-only or allows writes. For writes, name the permitted objects, properties, dependent synchronization, and preserved areas before changing anything.
2. If the request is precise and consistent with the canonical set, proceed without ceremonial clarification. If it is vague, conflicting, or expands scope, perform only the necessary read-only diagnosis and ask for the missing decision.
3. Open Figma only when the checkpoint makes it relevant. **REQUIRED SUB-SKILL:** Use `figma` for Figma nodes and `figma:figma-use` before any `use_figma` action. A description-only request permits only description writes plus required registry synchronization. A Figma design or naming write requires explicit user authorization.
4. Apply the naming standard when creating, renaming or structurally changing a component, property, semantic layer or asset owner, and during an explicit naming audit. New objects must comply before completion. For an existing in-scope mismatch, show an exact old → new mapping and request authorization unless the rename was already requested. Treat out-of-scope legacy mismatches as read-only findings; never expand the task automatically.
5. Before an authorized rename, identify references in the registry and Figma descriptions. Preserve an asset owner's existing scale suffix unless the user explicitly changes its export contract. After the write, verify scoped names, properties, children and required synchronization.
6. Make the smallest canonical change. Do not edit local system copies. Do not build or modify a concrete `email.html` or `images/` set with this skill.
7. For a no-op, report the existing canonical rule with its commit and create no branch. For a write, re-read and validate the changed source before publication.
8. Publish only through GitHub: create `codex/<semantic-slug>` from the pinned SHA, commit only the approved paths, and open one draft PR after the required publication authorization. Never update `main` or merge without separate authorization.
9. Fetch the branch after the final write. Apply exactly the relevant checkpoint checklist plus changed-content, required-synchronization, allowed-path-diff, and preserved-blob checks. Add no generic codebase, build, visual, Figma-publishing, or delivery checks. Verify that no local email outputs, archives, reports, or duplicated system rules were added.

## Boundary Check

The skill owns routing, cloud-source selection, naming-audit activation, and handoff shape. The canonical files own all email rules, naming constants, workflows, and component facts. Change this skill only when its trigger, repository locator, canonical-set paths, routing boundary, naming-audit activation model, or cloud publication model changes.

Handoff with the pinned base SHA, inspected sources, classification and scope, changed paths, checks actually run, branch/commit/PR when created, and actual limitations. Never claim Figma or GitHub verification that was not performed.
