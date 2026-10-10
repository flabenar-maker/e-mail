<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: workflow-checkpoint -->
<!-- source-digest: sha256:e81b22a4052d2da4b239b3b70b781ff69e344befbaa3b045496c91bd6309d1d5 -->
<!-- schema-versions: manifest=1.3.0, workflows=1.0.0 -->
# Workflow checkpoint: `email-build`

Status: `active`

This is a generated reading projection of the structured workflow. It does not activate a route, authorize a write, or add a runtime instruction.

Canonical workflow: [workflow-email-build](../../data/workflows/email-build.yaml)

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
- [email-rendering-standard](../../core/email-rendering-standard.md)
- [email-model-assembly-standard](../../core/email-model-assembly-standard.md)
- [email-source-fidelity-standard](../../core/email-source-fidelity-standard.md)
- [email-model-schema](../../schemas/email-model.schema.json)
- [component-contract-standard](../../core/component-contract-standard.md)
- [typography-standard](../../core/typography-standard.md)
- [asset-export-standard](../../core/asset-export-standard.md)
- [rendering-foundation](../../data/foundations/rendering.yaml)
- [renderer-registry](../../data/renderers/registry.yaml)
- [components-shared](../../data/components/shared.yaml)
- [components-marketing](../../data/components/marketing.yaml)
- [components-service](../../data/components/service.yaml)

## Mode: `new-build`

- Required inputs: `request`, `email-purpose`, `mobile-figma-instance`, `desktop-figma-instance`, `output-parent`
- Allowed outputs: `version-folder`, `email-html`, `images-directory`, `source-comparison`, `verification-summary`, `handoff-summary`

### Input blocker mappings

```json
[
  {
    "blocker": "request-missing",
    "input": "request"
  },
  {
    "blocker": "figma-source-missing",
    "input": "mobile-figma-instance"
  },
  {
    "blocker": "figma-source-missing",
    "input": "desktop-figma-instance"
  },
  {
    "blocker": "version-path-unsafe",
    "input": "email-purpose"
  },
  {
    "blocker": "version-path-unsafe",
    "input": "output-parent"
  }
]
```

### Input relations

```json
[
  {
    "blocker": "viewport-role-ambiguous",
    "field": "role",
    "inputs": [
      "mobile-figma-instance",
      "desktop-figma-instance"
    ],
    "kind": "ordered-field-values",
    "values": [
      "mobile",
      "desktop"
    ]
  },
  {
    "blocker": "email-instances-mismatch",
    "field": "emailId",
    "inputs": [
      "mobile-figma-instance",
      "desktop-figma-instance"
    ],
    "kind": "same-field"
  }
]
```

- Relation kinds: `ordered-field-values`, `same-field`

### 1. `validate-specific-email-sources`

- Condition: always
- Sources: [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `mobile-figma-instance`, `desktop-figma-instance`
- Blockers: `request-missing`, `figma-source-missing`, `viewport-role-ambiguous`, `email-instances-mismatch`
- Allowed outputs: `validated-design-sources`
- Success handoff: `next`
- Blocked handoff: `request-input`

### 2. `create-version-folder`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `request`, `email-purpose`, `output-parent`
- Blockers: `version-folder-exists`, `version-path-unsafe`
- Allowed outputs: `version-folder`
- Success handoff: `next`
- Blocked handoff: `stop`

### 3. `inspect-design`

- Condition: always
- Sources: [email-model-assembly-standard](../../core/email-model-assembly-standard.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `validated-design-sources`
- Blockers: `design-structure-ambiguous`
- Allowed outputs: `component-map`, `instance-inputs`, `source-readings`, `source-correspondence`
- Success handoff: `next`
- Blocked handoff: `request-input`

### 4. `resolve-component-contracts`

- Condition: always
- Sources: [email-model-assembly-standard](../../core/email-model-assembly-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [components-shared](../../data/components/shared.yaml), [components-marketing](../../data/components/marketing.yaml), [components-service](../../data/components/service.yaml)
- Required inputs: `component-map`
- Blockers: `component-unregistered`, `contract-ambiguous`, `viewport-contract-missing`
- Allowed outputs: `resolved-component-contracts`
- Success handoff: `next`
- Blocked handoff: `stop`

### 5. `export-assets-via-mcp`

- Condition: always
- Sources: [asset-export-standard](../../core/asset-export-standard.md), [components-shared](../../data/components/shared.yaml), [components-marketing](../../data/components/marketing.yaml), [components-service](../../data/components/service.yaml)
- Required inputs: `resolved-component-contracts`, `validated-design-sources`
- Blockers: `asset-contract-missing`, `asset-export-failed`, `asset-preflight-blocked`, `asset-resolution-decision-required`
- Allowed outputs: `images-directory`, `asset-export-evidence`
- Success handoff: `next`
- Blocked handoff: `request-input`

### 6. `build-temporary-email-model`

- Condition: always
- Sources: [email-model-schema](../../schemas/email-model.schema.json), [email-model-assembly-standard](../../core/email-model-assembly-standard.md), [email-rendering-standard](../../core/email-rendering-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [rendering-foundation](../../data/foundations/rendering.yaml), [renderer-registry](../../data/renderers/registry.yaml)
- Required inputs: `resolved-component-contracts`, `component-map`, `instance-inputs`, `images-directory`, `asset-export-evidence`
- Blockers: `email-model-incomplete`, `content-value-missing`
- Allowed outputs: `temporary-email-model`
- Success handoff: `next`
- Blocked handoff: `stop`

### 7. `verify-model-source`

- Condition: always
- Sources: [email-model-assembly-standard](../../core/email-model-assembly-standard.md), [email-source-fidelity-standard](../../core/email-source-fidelity-standard.md), [asset-export-standard](../../core/asset-export-standard.md)
- Required inputs: `temporary-email-model`, `source-readings`, `source-correspondence`, `asset-export-evidence`
- Blockers: `source-evidence-missing`, `source-evidence-mismatch`
- Allowed outputs: `source-comparison`
- Success handoff: `next`
- Blocked handoff: `stop`

### 8. `render-email-cli`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md), [email-source-fidelity-standard](../../core/email-source-fidelity-standard.md), [rendering-foundation](../../data/foundations/rendering.yaml), [renderer-registry](../../data/renderers/registry.yaml)
- Required inputs: `temporary-email-model`, `component-map`, `instance-inputs`, `source-readings`, `source-correspondence`, `asset-export-evidence`, `images-directory`, `source-comparison`, `version-folder`
- Blockers: `source-evidence-missing`, `source-evidence-mismatch`, `renderer-diagnostic`, `atomic-output-failed`
- Allowed outputs: `email-html`
- Success handoff: `next`
- Blocked handoff: `stop`

### 9. `verify-rendered-email`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md), [typography-standard](../../core/typography-standard.md), [asset-export-standard](../../core/asset-export-standard.md), [rendering-foundation](../../data/foundations/rendering.yaml)
- Required inputs: `email-html`, `images-directory`, `validated-design-sources`
- Blockers: `local-source-missing`, `viewport-regression`, `visual-regression`, `html-invariant-failed`
- Allowed outputs: `verification-summary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 10. `clean-output-folder`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `version-folder`, `email-html`, `images-directory`
- Blockers: `output-folder-contaminated`
- Allowed outputs: `version-folder`
- Success handoff: `next`
- Blocked handoff: `stop`

### 11. `handoff`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `version-folder`, `verification-summary`
- Blockers: none
- Allowed outputs: `handoff-summary`
- Success handoff: `complete`
- Blocked handoff: `stop`

## Mode: `continue-fix-design`

- Required inputs: `request`, `source-email-html`, `source-images-directory`, `exact-change-scope`, `mobile-figma-instance`, `desktop-figma-instance`
- Allowed outputs: `version-folder`, `email-html`, `images-directory`, `verification-summary`, `handoff-summary`

### Input blocker mappings

```json
[
  {
    "blocker": "request-missing",
    "input": "request"
  },
  {
    "blocker": "source-email-incomplete",
    "input": "source-email-html"
  },
  {
    "blocker": "source-email-incomplete",
    "input": "source-images-directory"
  },
  {
    "blocker": "change-scope-ambiguous",
    "input": "exact-change-scope"
  },
  {
    "blocker": "figma-source-missing",
    "input": "mobile-figma-instance"
  },
  {
    "blocker": "figma-source-missing",
    "input": "desktop-figma-instance"
  }
]
```

### Input relations

```json
[
  {
    "blocker": "viewport-role-ambiguous",
    "field": "role",
    "inputs": [
      "mobile-figma-instance",
      "desktop-figma-instance"
    ],
    "kind": "ordered-field-values",
    "values": [
      "mobile",
      "desktop"
    ]
  },
  {
    "blocker": "email-instances-mismatch",
    "field": "emailId",
    "inputs": [
      "mobile-figma-instance",
      "desktop-figma-instance"
    ],
    "kind": "same-field"
  }
]
```

- Relation kinds: `ordered-field-values`, `same-field`

### 1. `inspect-source-email`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `source-email-html`, `source-images-directory`, `exact-change-scope`
- Blockers: `request-missing`, `source-email-incomplete`, `change-scope-ambiguous`
- Allowed outputs: `source-baseline`
- Success handoff: `next`
- Blocked handoff: `request-input`

### 2. `validate-specific-email-sources`

- Condition: always
- Sources: [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `mobile-figma-instance`, `desktop-figma-instance`
- Blockers: `request-missing`, `figma-source-missing`, `viewport-role-ambiguous`, `email-instances-mismatch`
- Allowed outputs: `validated-design-sources`
- Success handoff: `next`
- Blocked handoff: `request-input`

### 3. `create-next-version-folder`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `source-baseline`
- Blockers: `version-path-unsafe`, `version-folder-exists`
- Allowed outputs: `version-folder`, `images-directory`
- Success handoff: `next`
- Blocked handoff: `stop`

### 4. `inspect-design`

- Condition: always
- Sources: [email-model-assembly-standard](../../core/email-model-assembly-standard.md), [figma-library-standard](../../core/figma-library-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `validated-design-sources`, `exact-change-scope`
- Blockers: `design-structure-ambiguous`
- Allowed outputs: `component-map`, `instance-inputs`
- Success handoff: `next`
- Blocked handoff: `request-input`

### 5. `resolve-component-contracts`

- Condition: always
- Sources: [email-model-assembly-standard](../../core/email-model-assembly-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [components-shared](../../data/components/shared.yaml), [components-marketing](../../data/components/marketing.yaml), [components-service](../../data/components/service.yaml)
- Required inputs: `component-map`, `exact-change-scope`
- Blockers: `component-unregistered`, `contract-ambiguous`, `viewport-contract-missing`
- Allowed outputs: `resolved-component-contracts`
- Success handoff: `next`
- Blocked handoff: `stop`

### 6. `update-assets-via-mcp`

- Condition: `asset-change-in-scope`
- Sources: [asset-export-standard](../../core/asset-export-standard.md), [components-shared](../../data/components/shared.yaml), [components-marketing](../../data/components/marketing.yaml), [components-service](../../data/components/service.yaml)
- Required inputs: `resolved-component-contracts`, `validated-design-sources`, `images-directory`
- Blockers: `asset-contract-missing`, `asset-export-failed`, `unreferenced-asset-proof-missing`, `asset-preflight-blocked`, `asset-resolution-decision-required`
- Allowed outputs: `images-directory`, `asset-export-evidence`
- Success handoff: `next`
- Blocked handoff: `request-input`

### 7. `apply-scoped-html-change`

- Condition: always
- Sources: [email-model-schema](../../schemas/email-model.schema.json), [email-model-assembly-standard](../../core/email-model-assembly-standard.md), [email-rendering-standard](../../core/email-rendering-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [typography-standard](../../core/typography-standard.md), [rendering-foundation](../../data/foundations/rendering.yaml), [renderer-registry](../../data/renderers/registry.yaml)
- Required inputs: `version-folder`, `exact-change-scope`, `resolved-component-contracts`, `component-map`, `instance-inputs`, `images-directory`
- Blockers: `change-outside-scope`, `renderer-diagnostic`
- Allowed outputs: `email-html`
- Success handoff: `next`
- Blocked handoff: `stop`

### 8. `verify-source-regression`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md), [rendering-foundation](../../data/foundations/rendering.yaml)
- Required inputs: `source-baseline`, `email-html`, `images-directory`, `validated-design-sources`
- Blockers: `source-folder-changed`, `viewport-regression`, `visual-regression`, `html-invariant-failed`
- Allowed outputs: `verification-summary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 9. `clean-output-folder`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `version-folder`, `email-html`, `images-directory`
- Blockers: `output-folder-contaminated`
- Allowed outputs: `version-folder`
- Success handoff: `next`
- Blocked handoff: `stop`

### 10. `handoff`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `version-folder`, `verification-summary`
- Blockers: none
- Allowed outputs: `handoff-summary`
- Success handoff: `complete`
- Blocked handoff: `stop`

## Mode: `continue-fix-technical`

- Required inputs: `request`, `source-email-html`, `source-images-directory`, `exact-change-scope`
- Allowed outputs: `version-folder`, `email-html`, `images-directory`, `verification-summary`, `handoff-summary`

### Input blocker mappings

```json
[
  {
    "blocker": "request-missing",
    "input": "request"
  },
  {
    "blocker": "source-email-incomplete",
    "input": "source-email-html"
  },
  {
    "blocker": "source-email-incomplete",
    "input": "source-images-directory"
  },
  {
    "blocker": "change-scope-ambiguous",
    "input": "exact-change-scope"
  }
]
```

### Input relations

```json
[]
```

### 1. `inspect-source-email`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `source-email-html`, `source-images-directory`, `exact-change-scope`
- Blockers: `request-missing`, `source-email-incomplete`, `change-scope-ambiguous`
- Allowed outputs: `source-baseline`
- Success handoff: `next`
- Blocked handoff: `request-input`

### 2. `create-next-version-folder`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `source-baseline`
- Blockers: `version-path-unsafe`, `version-folder-exists`
- Allowed outputs: `version-folder`, `images-directory`
- Success handoff: `next`
- Blocked handoff: `stop`

### 3. `resolve-component-contracts`

- Condition: `affected-contract-exists`
- Sources: [component-contract-standard](../../core/component-contract-standard.md), [components-shared](../../data/components/shared.yaml), [components-marketing](../../data/components/marketing.yaml), [components-service](../../data/components/service.yaml)
- Required inputs: `exact-change-scope`
- Blockers: `contract-ambiguous`
- Allowed outputs: `resolved-component-contracts`
- Success handoff: `next`
- Blocked handoff: `stop`

### 4. `apply-scoped-html-change`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md), [component-contract-standard](../../core/component-contract-standard.md), [typography-standard](../../core/typography-standard.md), [rendering-foundation](../../data/foundations/rendering.yaml), [renderer-registry](../../data/renderers/registry.yaml)
- Required inputs: `version-folder`, `exact-change-scope`
- Blockers: `change-outside-scope`, `renderer-diagnostic`
- Allowed outputs: `email-html`
- Success handoff: `next`
- Blocked handoff: `stop`

### 5. `verify-source-regression`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md), [rendering-foundation](../../data/foundations/rendering.yaml)
- Required inputs: `source-baseline`, `email-html`, `images-directory`
- Blockers: `source-folder-changed`, `viewport-regression`, `html-invariant-failed`
- Allowed outputs: `verification-summary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 6. `clean-output-folder`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `version-folder`, `email-html`, `images-directory`
- Blockers: `output-folder-contaminated`
- Allowed outputs: `version-folder`
- Success handoff: `next`
- Blocked handoff: `stop`

### 7. `handoff`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `version-folder`, `verification-summary`
- Blockers: none
- Allowed outputs: `handoff-summary`
- Success handoff: `complete`
- Blocked handoff: `stop`

## Mode: `read-only`

- Required inputs: `request`
- Allowed outputs: `audit-findings`, `verification-summary`, `handoff-summary`

### Input blocker mappings

```json
[
  {
    "blocker": "evidence-unavailable",
    "input": "request"
  }
]
```

### Input relations

```json
[]
```

### 1. `inspect-requested-evidence`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `request`
- Blockers: `request-missing`, `evidence-unavailable`
- Allowed outputs: `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 2. `verify-read-only-findings`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md), [rendering-foundation](../../data/foundations/rendering.yaml)
- Required inputs: `audit-findings`
- Blockers: `evidence-incomplete`
- Allowed outputs: `verification-summary`
- Success handoff: `next`
- Blocked handoff: `stop`

### 3. `handoff`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `verification-summary`
- Blockers: none
- Allowed outputs: `handoff-summary`
- Success handoff: `complete`
- Blocked handoff: `stop`

## Mode: `clarify`

- Required inputs: `request`
- Allowed outputs: `audit-findings`, `clarification-request`

### Input blocker mappings

```json
[
  {
    "blocker": "evidence-unavailable",
    "input": "request"
  }
]
```

### Input relations

```json
[]
```

### 1. `inspect-requested-evidence`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md), [component-contract-standard](../../core/component-contract-standard.md)
- Required inputs: `request`
- Blockers: `request-missing`, `evidence-unavailable`
- Allowed outputs: `audit-findings`
- Success handoff: `next`
- Blocked handoff: `stop`

### 2. `request-exact-scope`

- Condition: always
- Sources: [email-rendering-standard](../../core/email-rendering-standard.md)
- Required inputs: `audit-findings`
- Blockers: none
- Allowed outputs: `clarification-request`
- Success handoff: `complete`
- Blocked handoff: `stop`
