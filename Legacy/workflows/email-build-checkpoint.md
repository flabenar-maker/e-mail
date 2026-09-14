# Email build checkpoint

## Purpose and active set

Use this workflow only together with the [common email instruction](../core/email-figma-prompt.md) and the [component descriptions registry](../registry/email-component-descriptions-registry.md). It organizes the work; it does not redefine their technical HTML, responsive, export, asset, or component-contract rules.

A completed `email-project-brief.md` is an optional supporting input. Use it with the request when present, but do not require it when the request already supplies the necessary information. Keep specific email projects only in their local working directories, not in this repository.

The active set is:

- concrete Mobile and Desktop email instances define what is in the email;
- a `REGISTRY` record or `FIGMA VERIFIED` description defines how each semantic component is implemented;
- the common instruction defines global implementation and verification constraints;
- this checkpoint defines the sequence, gates, versioning, and handoff.

## TASK MODE GATE

Before making any write, classify the request as exactly one mode:

- `NEW BUILD` — create an email from the supplied designs;
- `CONTINUE / FIX` — change an existing local `email.html` and `images/` set;
- `READ-ONLY` — audit, diagnosis, or advice with no writes.

If the mode is ambiguous, stop and ask for clarification. In `READ-ONLY`, do not create a version or write files.

For `CONTINUE / FIX`, treat the folder containing the supplied `email.html` as the source. Inspect its `email.html` and `images/` without changing them first. A precise, non-conflicting request is authorization to proceed: do not ask again merely for confirmation. Use the exact scope to classify the change as design-dependent or design-independent technical work. For a vague request, perform read-only analysis, then request an exact change scope before choosing either write route. If a required action would extend the agreed scope, obtain separate approval.

## MODE/STAGE APPLICABILITY

Use this matrix before entering any stage. A skipped stage does not create its usual artifacts or handoff fields.

| Route | Sources | Version creation | Source analysis | Preflight / contract scope | ASSET PASS | HTML PASS | QA baseline | Figma comparison | OUTPUT CLEANUP | HANDOFF |
|---|---|---|---|---|---|---|---|---|---|---|
| `NEW BUILD` | Request or optional brief, verified Mobile/Desktop Figma instances, registry, and common instruction | Required; create the next free immutable version | Full design context, screenshots, content, geometry, variants, and responsive differences | Full maps; every used semantic component | Required for every mapped asset | Required for the complete email | Common-instruction static, asset, viewport, and render checks | Required for corresponding Mobile/Desktop renders | Required | Build handoff with output path, slug/version, checks, full contract sources, placeholders, and actual limitations |
| Design-dependent `CONTINUE / FIX` | Immutable local source `email.html` and `images/`, relevant verified Mobile/Desktop Figma instances, registry, and common instruction | Required; create the next free immutable version and copy only `email.html` plus `images/` | Inspect the local source and collect Figma context/screenshots for the requested design change | Change map plus affected components and potentially affected shared structures; whole email only if shared shell or responsive system is reached | Required only for affected or demonstrably incorrect assets | Required only in the copied version and agreed scope | Immutable source for regression plus all applicable common-instruction checks | Required for corresponding Mobile/Desktop renders | Required | Build handoff with output path, slug/version, source regressions, checks, scoped contract sources, placeholders, and actual limitations |
| Design-independent technical `CONTINUE / FIX` | Immutable local source `email.html` and `images/`, request, common instruction, and registry only where an affected contract exists; Figma is not required | Required; create the next free immutable version and copy only `email.html` plus `images/` | Inspect current HTML, assets, references, changed behavior, and unaffected invariants | Change map; contracts only for components or shared structures actually affected by the technical change | Apply only to in-scope existing assets/references; no Figma export requirement | Required only in the copied version and agreed scope | Immutable source is the regression baseline; render applicable viewports and compare changed and unaffected behavior at the same widths | Not applicable | Required | Build handoff with output path, slug/version, source-baseline regressions, applicable checks, scoped or not-applicable contract audit, placeholders, actual limitations, and `Figma: not applicable` |
| Vague `CONTINUE / FIX` before clarification | Local source `email.html` and `images/`; inspect supplied Figma only when needed to identify the ambiguity | None | Read-only diagnosis only, sufficient to state what is unclear | No execution preflight; inspect a contract only if needed to clarify scope | Skip | Skip | Only checks needed to explain the ambiguity; no implementation QA | Only if needed to clarify the request | Skip | Clarification request with inspected sources, findings, unknown scope, checks performed, limitations, and confirmation that no files or version were created |
| `READ-ONLY` | Only sources required by the question: Figma, local email, or both | None | Only analysis required to answer the question | No execution preflight; contracts or audits only when relevant to the question | Skip | Skip | Only checks needed to support the requested finding; renders are optional and question-dependent | Only when the question requires comparison with Figma | Skip | Read-only handoff with inspected sources, checks actually performed, findings, limitations, and confirmation that no files or version were created; no output path, slug/version, render, or contract-audit field is required when irrelevant |

## FIGMA SOURCE GATE

For `NEW BUILD`, require links to the specific Mobile and Desktop instances, or one parent frame containing both. Open the sources and verify each type from geometry, structure, and content, then verify they belong to the same email. Do not trust labels alone; do not silently remap swapped links.

Stop and request corrected sources when an applicable required link is missing, does not identify a specific email, has an ambiguous type, is swapped, or belongs to a different email. For `CONTINUE / FIX`, require Figma only when the requested change depends on the design; a narrowly technical change to a completed email proceeds without Figma context or screenshots. For `READ-ONLY`, inspect Figma only when the question requires it.

## SCOPE GATE

Before creating a working version, record the allowed files and elements, kinds of change, required dependent changes, preserved content/properties/blocks, and the checks that will prove the boundary was respected. A precise and consistent request is sufficient authorization. Never re-request confirmation solely as a formality. For `READ-ONLY`, scope only the question and evidence needed to answer it.

## VERSION GATE

Create a local versioned folder only for `NEW BUILD` or a clarified `CONTINUE / FIX`, after the mode and scope gates pass. Use `<semantic_slug>_vN.N`, where `semantic_slug` is meaningful English lowercase `snake_case`. A vague `CONTINUE / FIX` awaiting clarification and `READ-ONLY` skip this gate without deriving a slug or version.

For `NEW BUILD`, create the first version as `v1.0`; inspect sibling folders with the same slug and use the version after the maximum existing version. Increment by `0.1`: `v1.0` → `v1.1` → … → `v1.9` → `v2.0`. Never overwrite an existing folder.

For `CONTINUE / FIX`, never modify the source folder. Extract its slug and version when it has a suffix; a folder with no suffix is `v1.0`. Find the maximum sibling version for that email, create the next free version, and copy only `email.html` and the complete `images/` folder into it. Perform every write in that new version, then verify the source folder remains unchanged.

## SOURCE ANALYSIS

For `NEW BUILD` and design-dependent `CONTINUE / FIX`, collect design context and screenshots from the verified Mobile and Desktop instances. Record the top-level order, content and visibility, component variants, nested semantic components, cross-viewport differences, and visual geometry needed to implement and compare the result.

For design-independent technical `CONTINUE / FIX`, do not require Figma context or screenshots. Inspect the current HTML, assets, and references; record the intended technical behavior and preserved behavior; and use the immutable source version as the regression baseline for changed and unaffected areas.

For `READ-ONLY`, inspect only the local email, Figma, or both as required by the question. A vague `CONTINUE / FIX` uses only enough read-only analysis to identify the missing scope.

Use the registry first. For every semantic component in a `NEW BUILD`, every affected component or potentially affected shared structure in design-dependent `CONTINUE / FIX`, and only components or shared structures actually affected in design-independent technical `CONTINUE / FIX`, match its name, main component or `COMPONENT_SET`, node ID, variants, and visible structure against the registry. Assign a contract source. In `READ-ONLY`, do this only when a component contract is relevant to the question.

When Figma is applicable to the route, read its description narrowly when the registry lacks the component or variant, IDs or variants disagree, visible structure conflicts, the design or description appears changed, or the implementation remains ambiguous. Use a confirmed Figma contract for this email when the registry is stale; report the discrepancy at handoff and do not automatically edit the registry. A purely graphical asset needs no separate description when its parent semantic component fully defines its contract.

## PREFLIGHT INVENTORY

Maintain this inventory for write routes as internal working material; do not save it in the delivered email folder. `READ-ONLY` and a vague `CONTINUE / FIX` skip the execution preflight and record only evidence needed for the question or clarification.

### Block map

For each semantic block in the route's preflight scope, record its email position, component name, Mobile/Desktop variants, nested semantic components, `SCOPE`, contract source, and cross-viewport differences. `NEW BUILD` includes every block; `CONTINUE / FIX` includes affected/shared blocks plus only the unaffected reference information needed for regression checks.

### Asset map

For each unique visual asset in the route's preflight scope, record its use sites, resolution designation, image role, `ASSET OWNER`, `EXPORT BOUNDARY`, final name and format, expected transparency, source dimensions, Desktop/Mobile display behavior, crop behavior, and shared-file reuse. `NEW BUILD` includes every asset; `CONTINUE / FIX` includes affected or demonstrably incorrect assets and the existing references needed to prove safe reuse or removal.

### Link map

For every clickable item in the route's preflight scope, record its destination and visible text, URL source, and status: a standard common-instruction link, a URL supplied by the request/materials, or `href="#"` for later replacement in Altcraft. `NEW BUILD` includes every clickable item; `CONTINUE / FIX` includes affected links and preserved link invariants. Missing non-standard URLs do not block a build and must never be invented; list every in-scope placeholder at handoff.

### Change map for CONTINUE / FIX

Record affected HTML nodes and assets, preserved invariants, changed-area checks, and regression checks for unaffected blocks.

## COMPONENT CONTRACT GATE

For each semantic component in the contract-audit scope of a write route, record: name, node ID, used variants, source (`REGISTRY` or `FIGMA VERIFIED`), `SCOPE`, structure, responsive composition, internal spacing, nested components, asset contract, required fallback, and a status of `PASS`, `FIGMA VERIFY`, or `BLOCKED`.

`PASS` means the record and variants match and visible structure does not conflict. `FIGMA VERIFY` requires targeted Figma reading. `BLOCKED` means no unambiguous contract remains after available checks; do not implement such a component by guesswork. Enter execution only when all in-scope semantic components have `PASS`, in-scope assets are fully mapped, every in-scope link has a status, and no contradiction remains.

For design-independent technical `CONTINUE / FIX`, an unaffected component is outside contract-audit scope. For `READ-ONLY`, perform a contract check only if it supports the requested finding; it is not an execution gate.

## ASSET PASS

`READ-ONLY` and a vague `CONTINUE / FIX` skip this stage.

Apply the common instruction and the accepted component contracts while exporting, processing, and checking assets. For `NEW BUILD`, create `images/`, process every preflight asset, export from the specific Desktop instance, verify each file before HTML use, and export a reused asset once.

For `CONTINUE / FIX`, inspect existing assets and their references, reuse unchanged correct files from the copied version, and re-export only affected or demonstrably incorrect assets. Do not mass-refactor, rename, optimize, or reformat outside scope. Delete an obsolete asset only after proving it has no references.

Proceed only when every required asset exists locally, has its final name, has been verified, and matches the preflight map. Do not keep a separate asset manifest in the final email folder.

## HTML PASS

`READ-ONLY` and a vague `CONTINUE / FIX` skip this stage.

Follow the common instruction for the HTML implementation details. For `NEW BUILD`, assemble the document and email shell, place top-level blocks in instance order, apply the recorded `SCOPE` and outer rhythm, build component structures from accepted contracts, implement cross-viewport differences, connect verified assets, add content/alt/links, and perform the static audit before the first render.

For `CONTINUE / FIX`, work only in the new version. Change only nodes and assets in the change map; do not rebuild adjacent blocks or make out-of-scope refactors. Preserve out-of-scope structure, styles, content, links, and visibility, then compare affected and unaffected areas with the source version.

Move to QA only when local `src` references resolve, temporary Figma URLs and deleted/intermediate asset references are absent, required values are filled except agreed `href="#"` placeholders, and the new folder is a self-contained email.

## COMPONENT CONTRACT AUDIT

Before final visual comparison in a write route, audit every semantic component in the contract-audit scope against its preflight contract: `SCOPE`, required Mobile/Desktop composition, structure, spacing, nested components, asset contract, and fallback. Visual similarity at one width is not a substitute for a contract.

In `NEW BUILD`, every used semantic component must finish `PASS`. In design-dependent `CONTINUE / FIX`, final `PASS` is required for affected components and shared structures that can be affected. In design-independent technical `CONTINUE / FIX`, apply final `PASS` only to components or shared structures actually affected by the technical change. Unaffected blocks receive regression checks. If a change reaches the shared shell or responsive system, extend the contract audit to the whole email. For `READ-ONLY`, audit contracts only when relevant to the question.

## QA AND ITERATION

For `NEW BUILD` and clarified `CONTINUE / FIX`, perform, in this order:

1. Static HTML audit under the common instruction.
2. Asset audit against the common instruction and preflight map.
3. Applicable render and viewport checks from the common instruction.
4. For `NEW BUILD` and design-dependent `CONTINUE / FIX`, compare each Mobile/Desktop render with its corresponding Figma screenshot.
5. For design-independent technical `CONTINUE / FIX`, render the applicable viewports and compare changed and unaffected behavior with the immutable source version at the same widths; do not require Figma comparison.
6. Change-scope and regression checks.
7. Source-folder unchanged check for `CONTINUE / FIX`.
8. Re-run affected checks after each correction.
9. Run a complete, fresh final check after the final write.

For `READ-ONLY`, and for a vague `CONTINUE / FIX` before clarification, run only checks needed to support the requested finding or explain the ambiguity. Do not require renders, a source regression suite, or a contract audit when they are irrelevant.

Correct implementation errors and repeat the affected checks. Preserve readable, supported fallbacks and report only actual deviations. Request a user decision for product/design ambiguity. Keep a missing non-standard URL as `href="#"` and report it for Altcraft. External delivery-service testing is not required by this workflow.

## Условия остановки

Stop and ask the user when the mode is unclear; Figma sources required by the applicable route are missing or unconfirmed; required Mobile/Desktop sources differ or have ambiguous type; versions require a user content choice; an in-scope semantic component lacks an unambiguous contract; instance and contract require mutually exclusive decisions; execution needs broader scope; a required asset cannot be obtained or checked; or a required local check still fails after corrections.

Do not stop solely because a non-standard URL is absent, an older Outlook fallback differs acceptably, external delivery-service testing is unavailable, or an ordinary compatible email implementation choice remains within the common instruction.

## OUTPUT CLEANUP

For `NEW BUILD` and clarified `CONTINUE / FIX`, before handoff the versioned output folder contains only:

```text
<semantic_slug>_vN.N/
├── email.html
└── images/
```

Do not leave a brief, preflight, screenshots, reports, temporary exports, caches, or tool sources there. Create an archive only on the user's direct request. `READ-ONLY` and a vague `CONTINUE / FIX` skip output cleanup because they create no output.

## HANDOFF

For `NEW BUILD` and clarified `CONTINUE / FIX`, report the absolute version path, semantic slug and version; a concise change summary; completed viewport/render checks; component-contract-audit confirmation or why it was not applicable; which contracts came from the registry and, for design-backed routes, which were checked in Figma; every `href="#"` needing replacement in Altcraft; and only actual conflicts, deviations, or limitations. For design-independent technical work, identify the immutable source regression baseline and state that Figma comparison was not applicable. Include an archive link only when an archive was requested.

For `READ-ONLY`, report the sources inspected, checks actually performed, findings, and limitations, and confirm that no files or version were created. Do not require an output path, semantic slug/version, render checks, or contract-audit confirmation when they are irrelevant to the question.

For a vague `CONTINUE / FIX` before clarification, report the sources inspected, checks performed, observed ambiguity, exact scope information still needed, and limitations, and confirm that no files or version were created.
