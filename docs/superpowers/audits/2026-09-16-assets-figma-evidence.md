# Figma evidence audit: asset foundation

- Captured: 2026-09-16
- File: `8zka5bHkcrJVK9I9dKjnhC`
- Read-only scopes: `538:17236` (Marketing Emails), `538:17235` (Service Emails), then the representative descendant nodes recorded in `tests/foundation/fixtures/assets-figma-capture.json`.
- This is an observation record, not an export recipe. Exact component selections remain in the structured component contracts; the foundation remains component-neutral.

## Provenance chain

| Foundation rule | Historical comparison source | Live Figma observation |
| --- | --- | --- |
| Source boundary, background exclusion and rendered nested graphics | `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md` | `1008:1823`, `911:3991`, `961:37495`, `946:25769` |
| JPEG @2x / PNG @4x profiles and proportional display | `core/asset-export-standard.md` | `230:3689`, `326:6618`, `946:25769`, `260:3969` |
| Presentation-only neutralization | `core/asset-export-standard.md` | `911:3991` with presentation instance `911:4005` |

The machine-checkable, non-normative record is `tests/foundation/fixtures/assets-figma-capture.json`. Its test requires one representative for every active source/display/profile/alpha/clipping combination and validates its selection against active component contracts and `assets.yaml`.

## Confirmed boundary evidence

| Combination | Representative Figma node | Confirmed fact |
| --- | --- | --- |
| rendered-node / direct-image / PNG @4x / opaque / preserve | `1008:1823` `header-logo @4x` | Owned visible fill and nested logo graphics are inside the selected boundary; no parent fill is included. |
| rendered-node / direct-image / JPEG @2x / none / neutralize | `911:3991` `Style=Numbered` | Image Fill and `Number` graphic are both inside the boundary. The 18px radius is on instance `911:4005`, so only that presentation property may be neutralized on a temporary copy. |
| rendered-node / direct-image / PNG @4x / source / preserve | `961:37495` `app-logo @4x` | The logo has its own white Fill and nested artwork; the Fill belongs to the exported boundary. |
| rendered-node / direct-image / PNG @4x / transparent / preserve | `946:25769` `Asset/Feature-Icon @4x` | Visible artwork is nested; the owner has no visible own Fill. Figma reports PNG @4x with `contentsOnly: true`. |

## Resolved evidence distinctions

- `hero-image-fill-jpeg-direct`: the node’s configured PNG @2x setting is recorded as an observation, not as the final delivery profile. The selected `jpeg-2x` foundation contract owns JPEG, scale, suffix, sRGB and quality 82/90.
- `secondary-image-fill-jpeg-wrapper-crop`: the Desktop node is exactly the 252×238 crop-owning wrapper. The shared source raster keeps its intrinsic ratio; Mobile direct-image geometry 296×188 and Desktop wrapper geometry 252×238 are different display contracts, not a conflict.
- `nps-face-image-fill-png-source-alpha`: `260:3969` is the isolated 42×42 IMAGE Fill owner `happy-face-icon @4x`, configured PNG @4x with `contentsOnly: true`.

The reusable library still cannot prove marketer overrides of a concrete email instance. `concrete-desktop-instance-overrides` therefore remains a required runtime prerequisite, but it is not a library-evidence mismatch and is not included in the fixture’s unresolved records.

No component contract, Figma object, export setting or design value was changed by this package.
## Result

The foundation now makes source boundaries and responsive ratio protection immutable semantic rules. The capture fixture provides a checked link from every currently used abstract asset combination to a concrete Figma observation while keeping instance-specific choices at build time.