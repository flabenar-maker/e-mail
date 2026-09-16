# Figma evidence audit: asset foundation

- Captured: 2026-09-16
- File: `8zka5bHkcrJVK9I9dKjnhC`
- Read-only scopes: `538:17236` (Marketing Emails), `538:17235` (Service Emails), then the representative descendant nodes recorded in `tests/foundation/fixtures/assets-figma-capture.json`.
- This is an observation record, not an export recipe. Exact component selections remain in the structured component contracts; the foundation remains component-neutral.

## Provenance chain

| Foundation rule | Historical comparison source | Live Figma observation |
| --- | --- | --- |
| Source boundary, background exclusion and rendered nested graphics | `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md` | `1008:1823`, `911:3991`, `961:37495`, `946:25769` |
| JPEG @2x / PNG @4x profiles and proportional display | `core/asset-export-standard.md` | `230:3689`, `326:6618`, `946:25769` |
| Presentation-only neutralization | `core/asset-export-standard.md` | `911:3991` with presentation instance `911:4005` |

The machine-checkable, non-normative record is `tests/foundation/fixtures/assets-figma-capture.json`. Its test requires one representative for every active source/display/profile/alpha/clipping combination and validates its selection against active component contracts and `assets.yaml`.

## Confirmed boundary evidence

| Combination | Representative Figma node | Confirmed fact |
| --- | --- | --- |
| rendered-node / direct-image / PNG @4x / opaque / preserve | `1008:1823` `header-logo @4x` | Owned visible fill and nested logo graphics are inside the selected boundary; no parent fill is included. |
| rendered-node / direct-image / JPEG @2x / none / neutralize | `911:3991` `Style=Numbered` | Image Fill and `Number` graphic are both inside the boundary. The 18px radius is on instance `911:4005`, so only that presentation property may be neutralized on a temporary copy. |
| rendered-node / direct-image / PNG @4x / source / preserve | `961:37495` `app-logo @4x` | The logo has its own white Fill and nested artwork; the Fill belongs to the exported boundary. |
| rendered-node / direct-image / PNG @4x / transparent / preserve | `946:25769` `Asset/Feature-Icon @4x` | Visible artwork is nested; the owner has no visible own Fill. Figma reports PNG @4x with `contentsOnly: true`. |

## Typed unresolved observations

| Fixture id | Observation | Status |
| --- | --- | --- |
| `hero-image-fill-jpeg-direct` | Figma export settings on `230:3689` are PNG @2x although the active component contract selects JPEG @2x. | `FIGMA_NODE_EXPORT_PROFILE_CONFLICT` |
| `secondary-image-fill-jpeg-wrapper-crop` | Figma export settings on `326:6618` are PNG @2x; its observed 252×238 geometry does not match the active component contract display geometry 296×188. | `FIGMA_NODE_EXPORT_PROFILE_CONFLICT`, `FIGMA_OWNER_DISPLAY_GEOMETRY_MISMATCH` |
| `nps-face-image-fill-png-source-alpha` | The observed `Good` button is a presentation container, not an isolated face-image owner. | `FIGMA_IMAGE_OWNER_NODE_NOT_ISOLATED` |
| all records | A reusable library component cannot prove a concrete email instance's marketer overrides. | `concrete-desktop-instance-overrides` build-time gate is `unverified` |

No component contract, Figma object, export setting or design value was changed by this package. These unresolved records intentionally block a claim that a library read alone can authorize an export from a real email instance.

## Result

The foundation now makes source boundaries and responsive ratio protection immutable semantic rules. The capture fixture provides a checked link from every currently used abstract asset combination to a concrete Figma observation while keeping instance-specific choices at build time.