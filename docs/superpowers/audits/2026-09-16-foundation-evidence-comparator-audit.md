# Foundation Evidence Comparator Audit — 2026-09-16

This audit record documents a captured example; it is not a normative source and is not read by the comparator.

## Existing component comparator coverage

`scripts/lib/figma-contract-facts.mjs` remains component-contract-specific. It checks component identity, capture profile and errors, Mobile/Desktop variants and viewports, mapped leaf facts, component properties, Figma provenance node, source/contract coverage, and asset boundaries. It cannot represent an independent foundation observation whose expected value is supplied by a structured foundation source rather than a component-contract mapping.

## Narrow foundation evidence mechanism

`scripts/lib/foundation-evidence.mjs` validates one transient observation, then compares it to a caller-supplied structured-source value. Its key includes file key, node ID, variant, field path, and viewport when the fact is viewport-specific. It requires an exact expected source locator, raw value, capture time, and complete variable/style binding evidence when claimed. The comparator normalizes only captured Figma numeric values that are integer serialization noise; expected structured values stay exact. This record supplies neither rules nor expected values to the mechanism.

## Read-only captured Figma example

Repeat read captured at `2026-09-16T12:52:52.735+03:00` (Europe/Moscow) from file `8zka5bHkcrJVK9I9dKjnhC`:

- Marketing root: `538:17236`; Service root: `538:17235`.
- Component set `Details/Operation-Plain`: `497:26103`.
- Mobile variant `497:26102`, `Viewport=Mobile`, `252 × 156`, vertical, direct Plugin API `/itemSpacing: 12`, variable binding `{ kind: "variable", id: "VariableID:556:1863", name: "mobile/text-gap-lg", resolved_type: "FLOAT" }`.
- Desktop variant `497:26101`, `Viewport=Desktop`, `488 × 98`, vertical, direct Plugin API `/itemSpacing: 16`, variable binding `{ kind: "variable", id: "VariableID:556:1864", name: "desktop/text-gap-lg", resolved_type: "FLOAT" }`.

`get_variable_defs` independently confirmed both bindings. The Mobile observation maps to `data/foundations/spacing.yaml#/roles[id=details-row-stack]/resolutions/mobile/value_px`, whose expected value is `12`. The targeted captured-example test demonstrates exact pass for raw `12` and deliberate typed mismatch `FOUNDATION_EVIDENCE_MISMATCH` for raw `13`.