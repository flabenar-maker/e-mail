# Spacing foundation: Figma evidence audit

- Capture date: `2026-09-16T15:29:10+03:00`
- Figma file: `8zka5bHkcrJVK9I9dKjnhC`
- Scope: read-only inspection of the Marketing (`538:17236`) and Service (`538:17235`) libraries. No Figma objects were changed.
- Normative source: `data/foundations/spacing.yaml`.
- Capture source: `tests/fixtures/foundation/spacing-figma-capture.json`; this is evidence only and is never loaded by the renderer or bundle generator.

## Impact record

This package may change only the spacing foundation provenance, its schema/semantic validator, the context-bundle design-time metadata filter, focused tests, this audit, and the spacing design specification. It must not alter component contracts, their resolved numbers, Figma, the system manifest, renderer layout behavior, or local email projects.

## Directly confirmed role/viewports

The capture contains one unique address for every `role_id` + viewport. All 15 roles now have a direct node → exact field → FLOAT variable chain in both Mobile and Desktop. The three previously unresolved roles are confirmed as follows:

- `outer-flow`: `Email/Header` root top padding owns the top-level block flow and is bound to `mobile/block-margin` / `desktop/block-margin`.
- `common-horizontal-inset`: the ordinary block root itself owns its left/right inset; the structured owner is therefore `top-level-component-root`, matching `Block/Content` in both viewports.
- `inline-peer-standard`: `Block/Transaction-Success` uses the same adaptive peer parent in Mobile and Desktop, bound to `mobile/content-gap` / `desktop/content-gap`.

Every confirmed address records component/variant node, exact field path, raw four-side padding, item/counter-axis spacing, alignment, sizing and the bound FLOAT variable ID/name. The test compares each observation with the structured source through `foundation-evidence.mjs`. No spacing number changed.
## Build boundary

A generated email context bundle receives only `{ value_px }` for a referenced spacing role. All `provenance` objects — including Figma node, ownership, relationship, candidates and capture data — are stripped before bundling. `email-interpreter.mjs` has no import or call to `spacing-foundation` or `resolveDesignSpacing`.