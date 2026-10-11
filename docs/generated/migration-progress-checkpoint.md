<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: workflow-checkpoint -->
<!-- source-digest: sha256:5429695174a6636266754bca465c8d1c374c0a2089a2f925832efa3cc654a6b1 -->
<!-- schema-versions: manifest=1.3.0, workflows=1.0.0 -->
# Workflow checkpoint: `migration-progress`

Status: `active`

This is a generated reading projection of the structured workflow. It does not activate a route, authorize a write, or add a runtime instruction.

Canonical workflow: [workflow-migration-progress](../../data/workflows/migration-progress.yaml)

## Current manifest routing

| Route | Assigned workflow source | Bundle status |
| --- | --- | --- |
| `component-onboarding` | `workflow-component-onboarding` | `structured-active` |
| `email-continue-fix` | `workflow-email-build` | `structured-active` |
| `email-new-build` | `workflow-email-build` | `structured-active` |
| `figma-description-sync` | `workflow-figma-description-sync` | `structured-active` |
| `figma-naming-audit` | `workflow-figma-naming-audit` | `structured-active` |
| `library-maintenance` | `workflow-library-maintenance` | `structured-active` |
| `migration-progress` | `workflow-migration-progress` | `structured-active` |

The routing table describes current assignments only; workflow status is not a readiness guarantee.

## Workflow sources

- [repository-readme](../../README.md)
- [migration-roadmap](../superpowers/plans/2026-08-25-cupis-migration-roadmap.md)

## Mode: `read-only`

- Required inputs: `request`, `cloud-state-evidence`
- Allowed outputs: `pinned-sha`, `audit-findings`, `verification-summary`, `handoff-summary`

### Input blocker mappings

```json
[
  {
    "blocker": "request-required",
    "input": "request"
  },
  {
    "blocker": "cloud-state-evidence-required",
    "input": "cloud-state-evidence"
  }
]
```

### Input relations

Not declared.

### 1. `pin-canonical-state`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `request`
- Blockers: `source-pin-missing`, `request-required`, `cloud-state-evidence-required`
- Allowed outputs: `pinned-sha`
- Success handoff: `next`
- Blocked handoff: `stop`

### 2. `compare-roadmap-with-cloud-state`

- Condition: always
- Sources: [migration-roadmap](../superpowers/plans/2026-08-25-cupis-migration-roadmap.md), [repository-readme](../../README.md)
- Required inputs: `pinned-sha`, `cloud-state-evidence`
- Blockers: `source-pin-mismatch`, `cloud-state-unverified`
- Allowed outputs: `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 3. `verify-read-only-findings`

- Condition: always
- Sources: [migration-roadmap](../superpowers/plans/2026-08-25-cupis-migration-roadmap.md)
- Required inputs: `audit-findings`
- Blockers: `fact-unproven`
- Allowed outputs: `verification-summary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 4. `handoff`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `pinned-sha`, `verification-summary`
- Blockers: `handoff-incomplete`
- Allowed outputs: `handoff-summary`
- Success handoff: `complete`
- Blocked handoff: `stop`
