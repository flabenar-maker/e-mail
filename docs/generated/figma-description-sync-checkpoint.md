<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: workflow-checkpoint -->
<!-- source-digest: sha256:bf4446424599201f792ab0845e03ca90e1877242799c69a3ddbab56b6433aa38 -->
<!-- schema-versions: manifest=1.3.0, workflows=1.0.0 -->
# Workflow checkpoint: `figma-description-sync`

Status: `shadow`

This is a generated reading projection of the structured workflow. It does not activate a route, authorize a write, or add a runtime instruction.

Canonical workflow: [workflow-figma-description-sync](../../data/workflows/figma-description-sync.yaml)

## Current manifest routing

| Route | Assigned workflow source | Bundle status |
| --- | --- | --- |
| `component-onboarding` | `workflow-paused` | `structured-shadow` |
| `email-continue-fix` | `workflow-email-build` | `structured-active` |
| `email-new-build` | `workflow-email-build` | `structured-active` |
| `figma-description-sync` | `workflow-paused` | `structured-shadow` |
| `figma-naming-audit` | `workflow-paused` | `structured-shadow` |
| `library-maintenance` | `workflow-paused` | `structured-shadow` |
| `migration-progress` | `workflow-paused` | `structured-shadow` |

The routing table describes current assignments only; workflow status is not a readiness guarantee.

## Workflow sources

- [repository-readme](../../README.md)
- [figma-library-standard](../../core/figma-library-standard.md)
- [component-contract-standard](../../core/component-contract-standard.md)
- [figma-component-description-standard](../../core/figma-component-description-standard.md)

## Mode: `read-only`

- Required inputs: `request`, `target-scope`
- Allowed outputs: `pinned-sha`, `impact-report`, `audit-findings`, `figma-before`, `change-preview`, `verification-summary`, `handoff-summary`

### Input blocker mappings

```json
[
  {
    "blocker": "request-required",
    "input": "request"
  },
  {
    "blocker": "target-scope-required",
    "input": "target-scope"
  }
]
```

### Input relations

Not declared.

### 1. `pin-canonical-state`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `request`
- Blockers: `source-pin-missing`, `request-required`, `target-scope-required`
- Allowed outputs: `pinned-sha`
- Success handoff: `next`
- Blocked handoff: `stop`

### 2. `assess-impact`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md)
- Required inputs: `target-scope`, `pinned-sha`
- Blockers: `scope-ambiguous`, `source-conflict`
- Allowed outputs: `impact-report`
- Success handoff: `next`
- Blocked handoff: `stop`

### 3. `inspect-canonical-sources`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `impact-report`
- Blockers: `source-missing`, `contract-ambiguous`
- Allowed outputs: `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 4. `inspect-figma-read-only`

- Condition: always
- Sources: [figma-library-standard](../../core/figma-library-standard.md)
- Required inputs: `target-scope`
- Blockers: `identity-unconfirmed`, `fact-unproven`
- Allowed outputs: `figma-before`, `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 5. `preview-exact-change`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md)
- Required inputs: `impact-report`, `audit-findings`
- Blockers: `identity-unconfirmed`, `semantic-role-required`, `fact-unproven`
- Allowed outputs: `change-preview`
- Success handoff: `next`
- Blocked handoff: `stop`

### 6. `verify-read-only-findings`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `audit-findings`
- Blockers: `fact-unproven`
- Allowed outputs: `verification-summary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 7. `handoff`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `pinned-sha`, `impact-report`, `verification-summary`
- Blockers: `handoff-incomplete`
- Allowed outputs: `handoff-summary`
- Success handoff: `complete`
- Blocked handoff: `stop`

## Mode: `write`

- Required inputs: `request`, `target-scope`, `write-authorization`
- Allowed outputs: `pinned-sha`, `impact-report`, `audit-findings`, `figma-before`, `change-preview`, `change-boundary`, `figma-change`, `figma-readback`, `repository-change`, `verification-summary`, `handoff-summary`

### Input blocker mappings

```json
[
  {
    "blocker": "request-required",
    "input": "request"
  },
  {
    "blocker": "target-scope-required",
    "input": "target-scope"
  },
  {
    "blocker": "write-authorization-required",
    "input": "write-authorization"
  }
]
```

### Input relations

Not declared.

### 1. `pin-canonical-state`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `request`
- Blockers: `source-pin-missing`, `request-required`, `target-scope-required`, `write-authorization-required`
- Allowed outputs: `pinned-sha`
- Success handoff: `next`
- Blocked handoff: `stop`

### 2. `assess-impact`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md)
- Required inputs: `target-scope`, `pinned-sha`
- Blockers: `scope-ambiguous`, `source-conflict`
- Allowed outputs: `impact-report`
- Success handoff: `next`
- Blocked handoff: `stop`

### 3. `inspect-canonical-sources`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `impact-report`
- Blockers: `source-missing`, `contract-ambiguous`
- Allowed outputs: `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 4. `inspect-figma-read-only`

- Condition: always
- Sources: [figma-library-standard](../../core/figma-library-standard.md)
- Required inputs: `target-scope`
- Blockers: `identity-unconfirmed`, `fact-unproven`
- Allowed outputs: `figma-before`, `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 5. `preview-exact-change`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md)
- Required inputs: `impact-report`, `audit-findings`
- Blockers: `identity-unconfirmed`, `semantic-role-required`, `fact-unproven`
- Allowed outputs: `change-preview`
- Success handoff: `next`
- Blocked handoff: `stop`

### 6. `prepare-change-boundary`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md)
- Required inputs: `change-preview`, `write-authorization`, `pinned-sha`
- Blockers: `authorization-missing`, `authorization-scope-mismatch`
- Allowed outputs: `change-boundary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 7. `apply-authorized-figma-change`

- Condition: always
- Sources: [figma-component-description-standard](../../core/figma-component-description-standard.md), [figma-library-standard](../../core/figma-library-standard.md)
- Required inputs: `change-boundary`, `write-authorization`, `figma-before`
- Blockers: `authorization-scope-mismatch`
- Allowed outputs: `figma-change`
- Success handoff: `next`
- Blocked handoff: `stop`

### 8. `verify-figma-readback`

- Condition: always
- Sources: [figma-library-standard](../../core/figma-library-standard.md)
- Required inputs: `change-boundary`, `figma-before`, `figma-change`
- Blockers: `figma-readback-mismatch`
- Allowed outputs: `figma-readback`
- Success handoff: `next`
- Blocked handoff: `stop`

### 9. `synchronize-dependents`

- Condition: always
- Sources: [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `change-boundary`
- Blockers: `dependency-unresolved`
- Allowed outputs: `repository-change`
- Success handoff: `next`
- Blocked handoff: `stop`

### 10. `verify-exact-cloud-commit`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `repository-change`, `pinned-sha`
- Blockers: `local-verification-failed`
- Allowed outputs: `verification-summary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 11. `handoff`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `pinned-sha`, `impact-report`, `verification-summary`
- Blockers: `handoff-incomplete`
- Allowed outputs: `handoff-summary`
- Success handoff: `complete`
- Blocked handoff: `stop`
