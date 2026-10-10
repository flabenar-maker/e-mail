<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: workflow-checkpoint -->
<!-- source-digest: sha256:93010d3af882bed295d12986038c197dbcd4cfab1fecebad691601865d249e73 -->
<!-- schema-versions: manifest=1.3.0, workflows=1.0.0 -->
# Workflow checkpoint: `library-maintenance`

Status: `shadow`

This is a generated reading projection of the structured workflow. It does not activate a route, authorize a write, or add a runtime instruction.

Canonical workflow: [workflow-library-maintenance](../../data/workflows/library-maintenance.yaml)

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
- Allowed outputs: `pinned-sha`, `impact-report`, `audit-findings`, `verification-summary`, `handoff-summary`

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

- Condition: `figma-evidence-required`
- Sources: [figma-library-standard](../../core/figma-library-standard.md)
- Required inputs: `target-scope`
- Blockers: `identity-unconfirmed`, `fact-unproven`
- Allowed outputs: `audit-findings`, `figma-before`
- Success handoff: `next`
- Blocked handoff: `stop`

### 5. `verify-read-only-findings`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `audit-findings`
- Blockers: `fact-unproven`
- Allowed outputs: `verification-summary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 6. `handoff`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `pinned-sha`, `impact-report`, `verification-summary`
- Blockers: `handoff-incomplete`
- Allowed outputs: `handoff-summary`
- Success handoff: `complete`
- Blocked handoff: `stop`

## Mode: `write`

- Required inputs: `request`, `target-scope`, `write-authorization`
- Allowed outputs: `pinned-sha`, `impact-report`, `audit-findings`, `change-preview`, `change-boundary`, `figma-before`, `repository-change`, `figma-change`, `figma-readback`, `verification-summary`, `github-pr`, `handoff-summary`

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

### 4. `preview-exact-change`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md)
- Required inputs: `impact-report`, `audit-findings`
- Blockers: `identity-unconfirmed`, `semantic-role-required`, `fact-unproven`
- Allowed outputs: `change-preview`
- Success handoff: `next`
- Blocked handoff: `stop`

### 5. `prepare-change-boundary`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md)
- Required inputs: `change-preview`, `write-authorization`, `pinned-sha`
- Blockers: `authorization-missing`, `authorization-scope-mismatch`
- Allowed outputs: `change-boundary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 6. `inspect-figma-read-only`

- Condition: `figma-write-in-scope`
- Sources: [figma-library-standard](../../core/figma-library-standard.md)
- Required inputs: `change-boundary`
- Blockers: `identity-unconfirmed`, `fact-unproven`
- Allowed outputs: `figma-before`, `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 7. `apply-minimal-repository-change`

- Condition: `repository-write-in-scope`
- Sources: [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `change-boundary`
- Blockers: `authorization-scope-mismatch`
- Allowed outputs: `repository-change`
- Success handoff: `next`
- Blocked handoff: `stop`

### 8. `apply-authorized-figma-change`

- Condition: `figma-write-in-scope`
- Sources: [figma-library-standard](../../core/figma-library-standard.md)
- Required inputs: `change-boundary`, `write-authorization`, `figma-before`
- Blockers: `authorization-scope-mismatch`
- Allowed outputs: `figma-change`
- Success handoff: `next`
- Blocked handoff: `stop`

### 9. `verify-figma-readback`

- Condition: `figma-write-in-scope`
- Sources: [figma-library-standard](../../core/figma-library-standard.md)
- Required inputs: `change-boundary`, `figma-before`, `figma-change`
- Blockers: `figma-readback-mismatch`
- Allowed outputs: `figma-readback`
- Success handoff: `next`
- Blocked handoff: `stop`

### 10. `synchronize-dependents`

- Condition: always
- Sources: [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `change-boundary`
- Blockers: `dependency-unresolved`
- Allowed outputs: `repository-change`
- Success handoff: `next`
- Blocked handoff: `stop`

### 11. `verify-exact-cloud-commit`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `repository-change`, `pinned-sha`
- Blockers: `local-verification-failed`
- Allowed outputs: `verification-summary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 12. `publish-review`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `verification-summary`, `repository-change`
- Blockers: `publication-boundary-invalid`
- Allowed outputs: `github-pr`
- Success handoff: `next`
- Blocked handoff: `stop`

### 13. `handoff`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `pinned-sha`, `change-boundary`, `verification-summary`, `github-pr`
- Blockers: `handoff-incomplete`
- Allowed outputs: `handoff-summary`
- Success handoff: `complete`
- Blocked handoff: `stop`
