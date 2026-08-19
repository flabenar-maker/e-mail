---
name: maintaining-cupis-email-system
description: Use when auditing or changing the CUPIS email-system instruction, Figma component descriptions or design, component registry, maintenance workflow, repository structure, or their synchronization.
---

# Maintaining the CUPIS Email System

## Overview

Act as a thin router over the canonical CUPIS system. Load current rules from GitHub; never copy HTML rules, component contracts, Figma descriptions, or library values into this skill.

## Canonical Set

**REQUIRED SUB-SKILL:** Use `github:github` for repository reads and writes.

Treat `flabenar-maker/e-mail` as the only persistent source. Resolve the current `main` commit, then fetch all of these paths at that exact SHA:

- `README.md`
- `core/email-figma-prompt.md`
- `registry/email-component-descriptions-registry.md`
- `workflows/library-maintenance-checkpoint.md`

Stop if any file is missing or cannot be read at the pinned SHA. Do not substitute a local checkout, attachment, cached copy, or older commit.

Use the README to assign file responsibility and the maintenance checkpoint to classify the task, set scope, select sources, synchronize dependencies, and choose checks. Use the instruction and registry only for their canonical technical and component content.

## Route

1. State whether the task is read-only or allows writes. For writes, name the permitted objects, properties, dependent synchronization, and preserved areas before changing anything.
2. If the request is precise and consistent with the canonical set, proceed without ceremonial clarification. If it is vague, conflicting, or expands scope, perform only the necessary read-only diagnosis and ask for the missing decision.
3. Open Figma only when the checkpoint makes it relevant. **REQUIRED SUB-SKILL:** Use `figma` for Figma nodes and `figma:figma-use` before any `use_figma` action. A description-only request permits only description writes plus required registry synchronization. A Figma design write requires explicit user authorization.
4. Make the smallest canonical change. Do not edit local system copies. Do not build or modify a concrete `email.html` or `images/` set with this skill.
5. For a no-op, report the existing canonical rule with its commit and create no branch. For a write, re-read and validate the changed source before publication.
6. Publish only through GitHub: create `codex/<semantic-slug>` from the pinned SHA, commit only the approved paths, and open one draft PR after the required publication authorization. Never update `main` or merge without separate authorization.
7. Fetch the branch after the final write. Apply exactly the relevant checkpoint checklist plus changed-content, required-synchronization, allowed-path-diff, and preserved-blob checks. Add no generic codebase, build, visual, Figma-publishing, or delivery checks. Verify that no local email outputs, archives, reports, or duplicated system rules were added.

## Boundary Check

The skill owns routing, cloud-source selection, and handoff shape. The canonical files own all email rules and workflows. Change this skill only when its trigger, repository locator, canonical-set paths, routing boundary, or cloud publication model changes.

Handoff with the pinned base SHA, inspected sources, classification and scope, changed paths, checks actually run, branch/commit/PR when created, and actual limitations. Never claim Figma or GitHub verification that was not performed.
