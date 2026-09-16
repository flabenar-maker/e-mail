# Figma naming evidence audit

- Captured: 2026-09-16
- File: `8zka5bHkcrJVK9I9dKjnhC`
- Read-only roots: `538:17236` Marketing Emails and `538:17235` Service Emails.

This is an observation record, not a naming migration, a mass-rename plan, an export rule, or a normative replacement for `data/foundations/figma-naming.yaml`.

## What the capture proves

`tests/foundation/fixtures/figma-naming-capture.json` records exact representative component names, variant strings, raw property-definition names, controlled layer roles and both asset-owner kinds. It confirms the suffix grammar for a direct internal owner (`hero-image @2x`), a published component owner (`Asset/Feature-Icon @4x`) and `vk-icon @4x`. The scale marker is owned by the semantic asset name; an empty optional export-settings suffix does not invalidate an existing `@4x` name.

`tests/foundation/fixtures/figma-naming-generated-reference.json` is generated from the name generator and checked byte-for-byte. It demonstrates that a proposal has a separate semantic gate and that a normal asset rename keeps its existing `@2x` or `@4x` suffix. Changing scale is not a naming operation: it requires an export-contract decision.

## Boundary between audit and proposal

An existing node is audited as observed. Syntax validity is useful evidence, but it never implies that a name should change. A new proposal is generated only after its semantic role is confirmed. This prevents a syntactically valid lower-kebab string from becoming a trusted recommendation just because it looks tidy.

## Semantic naming boundary

Semantic naming applies to structural layers, properties, asset owners and meaningful containers. Atomic VECTOR, BOOLEAN_OPERATION, RECTANGLE, ELLIPSE, LINE, POLYGON or STAR geometry is outside that scope only when its parent semantic boundary is independently confirmed. Therefore the observed `Vector`, `Subtract` and `Rectangle 3946` nodes do not require individual semantic renames; they remain implementation geometry inside named assets.

The exact unresolved set now contains one item:

- `OBSERVED_FIGMA_LAYER_SEMANTIC_ROLE_UNPROVEN`: `Clip path group` is a GROUP that owns meaningful VK artwork, so it is not atomic geometry. Its intended controlled role must be confirmed before an explicitly authorized rename.

No Figma node, component contract or export setting was changed by this package. The empty configured export suffix on `vk-icon @4x` is no longer treated as a naming mismatch because the required `@4x` marker already exists in the owner name.