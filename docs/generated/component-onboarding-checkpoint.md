<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: workflow-checkpoint -->
<!-- source-digest: sha256:8e8b86eeb2dd953c44cab383252757d4ece0c48eeb462461f69d29f70cdce171 -->
<!-- schema-versions: manifest=1.3.0, workflows=1.0.0 -->
# Workflow checkpoint: `component-onboarding`

Status: `active`

This is a generated reading projection of the structured workflow. It does not activate a route, authorize a write, or add a runtime instruction.

Canonical workflow: [workflow-component-onboarding](../../data/workflows/component-onboarding.yaml)

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
- [figma-library-standard](../../core/figma-library-standard.md)
- [component-contract-standard](../../core/component-contract-standard.md)
- [figma-component-description-standard](../../core/figma-component-description-standard.md)
- [components-schema](../../schemas/components.schema.json)

## Mode: `read-only`

- Required inputs: `request`, `target-scope`, `approved-ready-component`, `staged-component-record`, `figma-factual-evidence`
- Allowed outputs: `pinned-sha`, `impact-report`, `audit-findings`, `change-preview`, `verification-summary`, `handoff-summary`

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
    "blocker": "approved-ready-component-required",
    "input": "approved-ready-component"
  },
  {
    "blocker": "staged-component-record-required",
    "input": "staged-component-record"
  },
  {
    "blocker": "figma-factual-evidence-required",
    "input": "figma-factual-evidence"
  }
]
```

### Input relations

Not declared.

### 1. `pin-canonical-state`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `request`
- Blockers: `source-pin-missing`, `request-required`, `target-scope-required`, `approved-ready-component-required`, `staged-component-record-required`, `figma-factual-evidence-required`
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

### 3. `validate-staged-onboarding`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md), [components-schema](../../schemas/components.schema.json)
- Required inputs: `approved-ready-component`, `staged-component-record`, `figma-factual-evidence`
- Blockers: `identity-unconfirmed`, `contract-ambiguous`, `fact-unproven`, `viewport-contract-missing`
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

- Required inputs: `request`, `target-scope`, `approved-ready-component`, `staged-component-record`, `figma-factual-evidence`, `write-authorization`
- Allowed outputs: `pinned-sha`, `impact-report`, `audit-findings`, `change-preview`, `change-boundary`, `repository-change`, `verification-summary`, `github-pr`, `handoff-summary`

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
    "blocker": "approved-ready-component-required",
    "input": "approved-ready-component"
  },
  {
    "blocker": "staged-component-record-required",
    "input": "staged-component-record"
  },
  {
    "blocker": "figma-factual-evidence-required",
    "input": "figma-factual-evidence"
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
- Blockers: `source-pin-missing`, `request-required`, `target-scope-required`, `approved-ready-component-required`, `staged-component-record-required`, `figma-factual-evidence-required`, `write-authorization-required`
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

### 3. `validate-staged-onboarding`

- Condition: always
- Sources: [repository-readme](../../README.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md), [components-schema](../../schemas/components.schema.json)
- Required inputs: `approved-ready-component`, `staged-component-record`, `figma-factual-evidence`
- Blockers: `identity-unconfirmed`, `contract-ambiguous`, `fact-unproven`, `viewport-contract-missing`
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

### 6. `apply-minimal-repository-change`

- Condition: always
- Sources: [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `change-boundary`
- Blockers: `authorization-scope-mismatch`
- Allowed outputs: `repository-change`
- Success handoff: `next`
- Blocked handoff: `stop`

### 7. `synchronize-dependents`

- Condition: always
- Sources: [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `change-boundary`
- Blockers: `dependency-unresolved`
- Allowed outputs: `repository-change`
- Success handoff: `next`
- Blocked handoff: `stop`

### 8. `verify-exact-cloud-commit`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `repository-change`, `pinned-sha`
- Blockers: `execution-verification-failed`, `execution-acceptance-blocked`
- Allowed outputs: `verification-summary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 9. `publish-review`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `verification-summary`, `repository-change`
- Blockers: `publication-boundary-invalid`
- Allowed outputs: `github-pr`
- Success handoff: `next`
- Blocked handoff: `stop`

### 10. `handoff`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `pinned-sha`, `impact-report`, `verification-summary`, `github-pr`
- Blockers: `handoff-incomplete`
- Allowed outputs: `handoff-summary`
- Success handoff: `complete`
- Blocked handoff: `stop`
