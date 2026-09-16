# Spacing foundation: Figma evidence audit

- Capture date: `2026-09-16T15:29:10+03:00`
- Figma file: `8zka5bHkcrJVK9I9dKjnhC`
- Scope: read-only inspection of the Marketing (`538:17236`) and Service (`538:17235`) libraries. No Figma objects were changed.
- Normative source: `data/foundations/spacing.yaml`.
- Capture source: `tests/fixtures/foundation/spacing-figma-capture.json`; this is evidence only and is never loaded by the renderer or bundle generator.

## Impact record

This package may change only the spacing foundation provenance, its schema/semantic validator, the context-bundle design-time metadata filter, focused tests, this audit, and the spacing design specification. It must not alter component contracts, their resolved numbers, Figma, the system manifest, renderer layout behavior, or local email projects.

## Directly confirmed role/viewports

The capture contains a unique address for every `role_id` + viewport. The following roles have a direct node → field → variable chain in both viewports and are promoted from registry literals to exact Figma-variable provenance:

- `self-horizontal-inset`
- `surface-padding-primary`
- `surface-padding-compact`
- `section-stack-standard`
- `collection-stack-spacious`
- `visual-item-stack`
- `details-row-stack`
- `inline-peer-compact`
- `text-stack-standard`
- `text-stack-tight`
- `asset-to-content-standard`
- `asset-to-content-compact`

Every confirmed address records component/variant node, exact field path, raw four-side padding, item/counter-axis spacing, alignment, sizing and the bound FLOAT variable ID/name. The test compares the observation with the structured source through `foundation-evidence.mjs`.

## Unresolved relationships

These values remain unchanged and retain `registry-literal` provenance:

- `outer-flow` (Mobile and Desktop): a standalone component’s top padding is observable, but the external relationship to the preceding email block is not represented inside that component.
- `common-horizontal-inset` (Mobile and Desktop): the observed owner is the top-level component root, not the declared `email-shell`.
- `inline-peer-standard` (Mobile and Desktop): a candidate row has the same number and a direct variable, but it does not prove the declared badge → details → status peer relationship.

They are intentionally not marked reviewed or converted to Figma provenance. No number was inferred from a matching token.

## Build boundary

A generated email context bundle receives only `{ value_px }` for a referenced spacing role. All `provenance` objects — including Figma node, ownership, relationship, candidates and capture data — are stripped before bundling. `email-interpreter.mjs` has no import or call to `spacing-foundation` or `resolveDesignSpacing`.