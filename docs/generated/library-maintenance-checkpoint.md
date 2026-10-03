<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: workflow-checkpoint -->
<!-- source-digest: sha256:0a7d4f65ed71750852375c976a6a5990e62b15827447a200760481cf22952d0a -->
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
- [figma-naming-foundation](../../data/foundations/figma-naming.yaml)
- [components-shared](../../data/components/shared.yaml)
- [components-marketing](../../data/components/marketing.yaml)
- [components-service](../../data/components/service.yaml)

## Mode: `read-only`

- Required inputs: `request`, `target-scope`
- Allowed outputs: `impact-report`, `audit-findings`, `verification-summary`

### Input blocker mappings

Not declared.

### Input relations

Not declared.

### 1. `pin-canonical-state`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `request`
- Blockers: `cloud-source-unavailable`
- Allowed outputs: `pinned-sha`
- Success handoff: `next`
- Blocked handoff: `stop`

### 2. `assess-impact`

- Condition: always
- Sources: [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md)
- Required inputs: `target-scope`
- Blockers: `scope-ambiguous`, `scope-conflicts-with-system`
- Allowed outputs: `impact-report`
- Success handoff: `next`
- Blocked handoff: `request-input`

### 3. `inspect-canonical-sources`

- Condition: always
- Sources: [component-contract-standard](../../core/component-contract-standard.md), [components-shared](../../data/components/shared.yaml), [components-marketing](../../data/components/marketing.yaml), [components-service](../../data/components/service.yaml)
- Required inputs: `impact-report`
- Blockers: `canonical-source-incomplete`
- Allowed outputs: `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 4. `inspect-figma-read-only`

- Condition: `figma-evidence-required`
- Sources: [figma-library-standard](../../core/figma-library-standard.md), [figma-naming-foundation](../../data/foundations/figma-naming.yaml)
- Required inputs: `target-scope`
- Blockers: `figma-source-unavailable`, `figma-fact-ambiguous`
- Allowed outputs: `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 5. `verify-read-only-findings`

- Condition: always
- Sources: [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `audit-findings`
- Blockers: `evidence-incomplete`
- Allowed outputs: `verification-summary`
- Success handoff: `complete`
- Blocked handoff: `stop`

## Mode: `write`

- Required inputs: `request`, `target-scope`, `write-authorization`
- Allowed outputs: `impact-report`, `github-pr`, `verification-summary`, `figma-readback`

### Input blocker mappings

Not declared.

### Input relations

Not declared.

### 1. `pin-canonical-state`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `request`
- Blockers: `cloud-source-unavailable`
- Allowed outputs: `pinned-sha`
- Success handoff: `next`
- Blocked handoff: `stop`

### 2. `assess-impact`

- Condition: always
- Sources: [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md), [figma-naming-foundation](../../data/foundations/figma-naming.yaml)
- Required inputs: `target-scope`
- Blockers: `scope-ambiguous`, `scope-conflicts-with-system`
- Allowed outputs: `impact-report`
- Success handoff: `next`
- Blocked handoff: `request-input`

### 3. `prepare-change-boundary`

- Condition: always
- Sources: [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `impact-report`, `write-authorization`
- Blockers: `write-boundary-incomplete`
- Allowed outputs: `change-boundary`
- Success handoff: `next`
- Blocked handoff: `request-input`

### 4. `inspect-canonical-sources`

- Condition: always
- Sources: [components-shared](../../data/components/shared.yaml), [components-marketing](../../data/components/marketing.yaml), [components-service](../../data/components/service.yaml)
- Required inputs: `change-boundary`
- Blockers: `canonical-source-incomplete`
- Allowed outputs: `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 5. `inspect-figma-read-only`

- Condition: `figma-in-scope`
- Sources: [figma-library-standard](../../core/figma-library-standard.md), [figma-naming-foundation](../../data/foundations/figma-naming.yaml)
- Required inputs: `change-boundary`
- Blockers: `figma-source-unavailable`, `figma-fact-ambiguous`
- Allowed outputs: `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 6. `apply-minimal-repository-change`

- Condition: `repository-write-in-scope`
- Sources: [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md)
- Required inputs: `change-boundary`
- Blockers: `repository-write-outside-boundary`
- Allowed outputs: `repository-change`
- Success handoff: `next`
- Blocked handoff: `stop`

### 7. `apply-authorized-figma-change`

- Condition: `figma-write-in-scope`
- Sources: [figma-library-standard](../../core/figma-library-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md), [figma-naming-foundation](../../data/foundations/figma-naming.yaml)
- Required inputs: `change-boundary`, `write-authorization`
- Blockers: `figma-write-outside-allowlist`, `figma-role-ambiguous`
- Allowed outputs: `figma-change`
- Success handoff: `next`
- Blocked handoff: `stop`

### 8. `verify-figma-readback`

- Condition: `figma-write-performed`
- Sources: [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `figma-change`
- Blockers: `figma-readback-mismatch`
- Allowed outputs: `figma-readback`
- Success handoff: `next`
- Blocked handoff: `stop`

### 9. `synchronize-dependents`

- Condition: always
- Sources: [component-contract-standard](../../core/component-contract-standard.md), [figma-component-description-standard](../../core/figma-component-description-standard.md), [components-shared](../../data/components/shared.yaml), [components-marketing](../../data/components/marketing.yaml), [components-service](../../data/components/service.yaml)
- Required inputs: `change-boundary`
- Blockers: `dependent-source-unsynchronized`
- Allowed outputs: `repository-change`
- Success handoff: `next`
- Blocked handoff: `stop`

### 10. `verify-exact-cloud-commit`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `repository-change`
- Blockers: `local-check-failed`, `allowed-diff-violated`
- Allowed outputs: `verification-summary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 11. `publish-review`

- Condition: always
- Sources: [repository-readme](../../README.md)
- Required inputs: `verification-summary`
- Blockers: `cloud-publication-failed`
- Allowed outputs: `github-pr`
- Success handoff: `complete`
- Blocked handoff: `stop`
