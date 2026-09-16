# Figma naming evidence audit

- Captured: 2026-09-16
- File: `8zka5bHkcrJVK9I9dKjnhC`
- Read-only roots: `538:17236` Marketing Emails and `538:17235` Service Emails.

This is an observation record, not a naming migration, a mass-rename plan, an export rule, or a normative replacement for `data/foundations/figma-naming.yaml`.

## What the capture proves

`tests/foundation/fixtures/figma-naming-capture.json` records exact representative component names, variant strings, raw property-definition names, controlled layer roles and both asset-owner kinds. It confirms the suffix grammar as it is used by a direct internal owner (`hero-image @2x`) and a published component owner (`Asset/Feature-Icon @4x`). Both observed exports report the matching PNG scale and suffix.

`tests/foundation/fixtures/figma-naming-generated-reference.json` is generated from the name generator and checked byte-for-byte. It demonstrates that a proposal has a separate semantic gate and that a normal asset rename keeps its existing `@2x` or `@4x` suffix. Changing scale is not a naming operation: it requires an export-contract decision.

## Boundary between audit and proposal

An existing node is audited as observed. Syntax validity is useful evidence, but it never implies that a name should change. A new proposal is generated only after its semantic role is confirmed. This prevents a syntactically valid lower-kebab string from becoming a trusted recommendation just because it looks tidy.

## Mandatory unresolved observations

The capture contains an exact unresolved set:

- `OBSERVED_FIGMA_LAYER_SEMANTIC_ROLE_UNPROVEN`: `Clip path group` has an observed name but no proven controlled role.
- `OBSERVED_FIGMA_EXPORT_SUFFIX_MISMATCH`: desktop `vk-icon @4x` node `261:4007` has an empty configured export suffix despite its name.
- `OBSERVED_FIGMA_LEGACY_DEFAULT_LAYER_NAME`: `Vector`, `Subtract` and `Rectangle 3946` are observed defaults or legacy names.

No Figma node, component contract, foundation rule, or export setting was changed by this package. The unresolved set remains evidence for a later explicitly approved maintenance task.
