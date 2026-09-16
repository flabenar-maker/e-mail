# Final inventory of active foundation regressions

Date: 2026-09-16
Scope: remediation package 6 only. This is an audit record, not a normative source and not a replacement for a final common verification.

## Legacy characterization review

The archived tests were read only. Their useful assertions were compared against active, current-data checks rather than copied from archived Markdown sources.

| Archived check | Decision | Active owner |
| --- | --- | --- |
| `typography-shadow.test.mjs` | Not migrated: it compares YAML to archived Markdown. The current source is captured Figma styles, including the typed compact-heading mismatch. | `tests/foundation/typography-foundation.test.mjs` |
| `spacing-shadow.test.mjs` | Not migrated: its registry comparisons are legacy-only. Exact role, viewport, node, field, value and binding checks already exist. | `tests/foundation/spacing-figma-evidence.test.mjs` |
| `assets-shadow.test.mjs` | Not migrated: common export contracts, component boundaries and unresolved records are already covered from current YAML and Figma capture. | `tests/foundation/assets-foundation.test.mjs`, `tests/foundation/assets-figma-capture.test.mjs` |
| `figma-naming-shadow.test.mjs` | Not migrated: its former Core Markdown anchors are archived. Current naming definitions, candidates and unresolved observations are active. | `tests/foundation/figma-naming-foundation.test.mjs`, `tests/foundation/figma-naming-evidence.test.mjs` |
| `foundation-preserved-files.test.mjs`, `generated-layer-shadow.test.mjs`, `component-registry-shadow.test.mjs`, `core-split.test.mjs` | Not migrated: these freeze pre-isolation ownership or archived paths and would reintroduce Legacy as an active dependency. | No active replacement is appropriate before stages 13–15. |

The only uncovered current requirement was the package boundary itself. It is now covered by `tests/characterization/foundations-remediation-boundary.test.mjs`: the active Node test runner and characterization discovery; active manifest fields collected recursively as `path` or `*_path`, plus `entrypoints.repository`, `entrypoints.bootstrap`, `bootstrap.portable_config` and `bootstrap.verifier`, all outside `Legacy/`; no concrete `email.html` or `images/`; paused routes; required pilot renderer entries; and incomplete stages 8/13/14. A temporary allowed-path diff—not a permanent exhaustive coverage list—remains responsible for proving this remediation package does not expand renderer scope.

## Final read-only Figma inventory

All reads used file `8zka5bHkcrJVK9I9dKjnhC`; no Figma write was made.

- Typography: all 15 captured local styles still exist with the captured names, Roboto family/style, size, line height and description. Fourteen remain exact; `desktop-heading-compact` remains the typed `unresolved-mismatch` because Figma reports `letterSpacing: PIXELS 0` while the structured record is `percent 0`.
- Spacing: the 24 confirmed role/viewport observations retain their captured node, relevant raw padding or `itemSpacing`, and FLOAT variable binding. The six observations for `outer-flow`, `common-horizontal-inset` and `inline-peer-standard` remain unresolved registry literals; they were not promoted.
- Assets: all seven representative nodes still match their recorded name, visible Fill/child boundary and export state. The four blockers remain typed: Hero export-profile conflict; Secondary export-profile conflict and display-geometry mismatch; NPS image owner not isolated; concrete Desktop instance overrides unverified.
- Naming: the representative components, controlled layers and asset owners remain present. The unresolved `Clip path group` semantic role, `vk-icon @4x` export-suffix mismatch and legacy/default child names remain unresolved; no rename was proposed.

## Explicitly preserved scope

This package does not change Figma, `Legacy/`, component contracts, foundations, generated docs, HTML letters, images, paused workflows or Stage 8 renderer coverage. It also does not mark stages 8, 13 or 14 complete. Common full local verification and final allowed-path review are still required after every remediation package is present on the shared draft branch.
