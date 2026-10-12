<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: workflow-checkpoint -->
<!-- source-digest: sha256:038254b1963df731a56ddd268a2f5b69755a83db5e11fc2bb765061162844196 -->
<!-- schema-versions: manifest=1.4.0, workflows=1.0.0 -->
# Workflow checkpoint: `system-progress`

Status: `active`

This is a generated reading projection of the structured workflow. It does not activate a route, authorize a write, or add a runtime instruction.

Canonical workflow: [workflow-system-progress](../../data/workflows/system-progress.yaml)

## Current manifest routing

| Route | Assigned workflow source | Bundle status |
| --- | --- | --- |
| `component-onboarding` | `workflow-component-onboarding` | `structured-active` |
| `email-continue-fix` | `workflow-email-build` | `structured-active` |
| `email-new-build` | `workflow-email-build` | `structured-active` |
| `figma-description-sync` | `workflow-figma-description-sync` | `structured-active` |
| `figma-naming-audit` | `workflow-figma-naming-audit` | `structured-active` |
| `library-maintenance` | `workflow-library-maintenance` | `structured-active` |
| `system-progress` | `workflow-system-progress` | `structured-active` |

The routing table describes current assignments only; workflow status is not a readiness guarantee.

## Workflow sources

- [repository-readme](../../README.md)
- [system-status](../system-status.md)

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

### 2. `compare-status-with-cloud-state`

- Condition: always
- Sources: [system-status](../system-status.md), [repository-readme](../../README.md)
- Required inputs: `pinned-sha`, `cloud-state-evidence`
- Blockers: `source-pin-mismatch`, `cloud-state-unverified`
- Allowed outputs: `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 3. `verify-read-only-findings`

- Condition: always
- Sources: [system-status](../system-status.md)
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
