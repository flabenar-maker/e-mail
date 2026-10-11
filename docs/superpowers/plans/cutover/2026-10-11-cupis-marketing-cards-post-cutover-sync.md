# CUPIS marketing cards 5 fix 1.1–1.4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. The current coordinator's explicit author/verifier/reviewer handoff controls execution; immutable source snapshots must never become working copies.

**Goal:** Synchronize the five marketing card owners to the 11.10.2026 actual Figma design, preserve responsive/live-action/asset semantics, and leave a locally verified candidate ready for separate merge.

**Architecture:** Keep one canonical implementation per child component. Update parent composition and exact source mappings; capture direct native TEXT sizing independently of container layoutMode. Reuse the existing interpreter and Button/Secondary; no schema or foundation changes.

**Tech Stack:** Node24, JSON-compatible YAML registries, node:test, existing Figma capture/mapping pipeline and table email renderer.

**Spec:** [Current cutover 5 fix 1](../2026-10-01-cupis-final-maintenance-cutover.md#p5-fix-1-cards), the user's explicit full1–4 clarification, and the frozen primary observations in tests/foundation/fixtures/marketing-card-layout-figma-capture.json. Base ccf5f2fc0b72bd9491254c4a053692a99777a8f5. The old PR109 plan is historical mapping only; its statuses are not imported.

## Global constraints

- Only block-cards-images, block-icon-cards, block-icon-list, card-image, card-icon may change in marketing.yaml. Button/Secondary and all other records remain protected.
- Figma is the design authority. Six complete MCP captures356nodes and separate native TEXT-sizing sidecars are frozen; their receipt is retained locally. A fixture is not a new freshness receipt.
- Persistent changes are cloud GitHub writes only; author transports expectedParent/message/files JSON. Verifier receives an exact immutable cloud snapshot. No local working tree edits, Actions, PR Checks, user emails, profiles/collector or Figma mutations.
- Live href actions stay separate from card assets; Mobile Card/Icon remains fluid. HUG reference heights never become fixed HTML height.
- Frame 1 remains the actual physical source name. Internal wrapper role image-area-icon is semantic; cosmetic Frame 1 → image-area-icon for the13named wrappers is a proposal only. Preserve @2x/@4x suffixes and actual asset ancestry.
- Renderer paths remain excluded until a real generic RED establishes their ownership and the coordinator extends the allowlist. No component-ID exceptions, schema extensions or proof masks.
- Preserve raw ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW diagnostics inside artwork and classify only exact export boundaries. Existing native proof omissions are disclosed; no blanket native audit PASS claim.
- Card/Icon master wrapper gap10 and six actual projected instance gap0 remain exact. Their one visible child/zero padding/empty fill+stroke condition makes the inter-item gap currently inert; a second/hidden extra child or changed appearance invalidates that disposition.
- Description diff is none while existing purposes/critical constraints stay accurate. Generate registry via the canonical generator. Merge/status closure requires separate user authorization and accepted merged evidence.

## Review focus

- Hidden button or caption must remove exactly its section gap; tests exercise all four combinations in each viewport.
- Long link/text and narrow300–659px containers must grow naturally, retain one live action, and cause no horizontal overflow; node guards plus actual browser measurements are required.
- A Mobile nested Card/Icon must not inherit its271px master width as a cap; protected contract digest and actual nested rendering cover this.
- Stale Desktop Icon-List graphic identities must not survive a wrapper insertion; exact current child IDs are asserted for all twelve rows.
- The inert master10/projected0 difference must not hide future multi-child behavior; exact native topology and a two-child invalidation control are asserted.

---

### Task 1 — 5 fix 1.1: source impact and meaningful RED

**Files:** Create this plan; create tests/foundation/fixtures/marketing-card-layout-figma-capture.json and tests/rendering/marketing-card-layout-refresh.test.mjs; modify tests/foundation/figma-contract-source-capture.test.mjs.

**Interfaces:** Consumes the six raw packets+sidecars+high-fidelity contexts, canonical five owner records and readonly button dependency at the pinned SHA. Produces frozen literal expected values, protected digests, test-only cloud commit and verifier RED report.

- [x] Inspect full six trees, existing scalar links and dependencies. Existing scalar deltas: Cards-Images4; Icon-Cards16 including all six Desktop placements; Icon-List20 links target five now-absent asset IDs; Card/Image2 link widths; Card/Icon2 alignment fields; Button/Secondary0. New properties/wrappers/TEXT sizing are additionally required.
- [x] Preview exact semantic/asset/name impact before production change. Preserve current Description. Record no external mutation.
- [ ] Publish only focused tests/fixture plus this plan through cloud GitHub. Tests expect direct TEXT FILL/HUG+HEIGHT and FIXED/FIXED+NONE without layoutMode; missing or synthetic capture fields are errors.
- [ ] Verifier runs node --test tests/foundation/figma-contract-source-capture.test.mjs tests/rendering/marketing-card-layout-refresh.test.mjs on the exact RED commit. Expected implementation failures are missing two button compositions, missing link Fill/width, missing13wrappers/current asset identities, wrong six nested alignments and direct TEXT capture omission. Harness failures are repaired as tests, never counted as meaningful RED.
- [ ] Coordinator records confirmed real RED before author may write production changes.

### Task 2 — 5 fix 1.2: native capture, buttons and link width

**Files:** Modify scripts/figma/capture-contract-source.js and data/components/marketing.yaml (four composition/source paths within the five-owner boundary); test the focused capture/render files and existing nested-composition-contract.test.mjs/component-root-sizing-regressions.test.mjs.

**Interfaces:** captureFigmaContractFacts preserves native layout.horizontal_sizing/vertical_sizing on ordinary TEXT without manufacturing layout.mode. contracts.mobile/desktop.root remain the canonical trees; contracts.figma_fact_links points to exact same-node native paths.

- [ ] Move only directional native sizing capture outside the layoutMode conditional; preserve HEIGHT/text geometry, fields, request binding and error behavior.
- [ ] Add show-button=true/Show Button to block-cards-images and block-icon-cards. Insert Desktop/Mobile button pairs1802:3594/3598 and1802:3856/3854 after all six cards before caption; nested component button-secondary owns the child implementation. Parent instance is Mobile252×44 Fill/Hug, Desktop230×46 Hug/Hug/min230. Existing Icon-List button remains.
- [ ] Update root/content reference heights: Cards-Images Desktop1320/1296 Mobile2087/2071; Icon-Cards Desktop1260/1236 Mobile1433/1417. Keep32/22section gaps conditional on actual surviving children.
- [ ] Card/Image links1015:18459/1015:18276 use252/232reference widths and native FILL/HUG while keeping separate required href/text slots and HEIGHT. Preserve card/image action boundaries and @2x asset contract.
- [ ] Rebuild exact source mappings after insertion; preserve already-correct facts/provenance. Do not blanket-refresh verified_at/fingerprint or fabricate source equality.
- [ ] Cloud-publish the bounded production diff. Verifier reruns the focused task tests plus existing nested/root-sizing regressions. Coordinator handles a demonstrated generic renderer defect only through an explicit allowlist extension.

### Task 3 — 5 fix 1.3: wrapper topology and preserved graphics

**Files:** Modify only card-icon, block-icon-list and six block-icon-cards Desktop placement facts in data/components/marketing.yaml. Focused tests own exact wrapper identities/render output; existing renderer-contract-semantics.test.mjs remains regression coverage.

**Interfaces:** semantic wrapper role image-area-icon is a normal presentation-table; child graphic retains its stable semantic ID/asset contract. Parent nested-component continues to reference canonical card-icon without copied descendants.

- [ ] Card/Icon Desktop root260:662 uses MIN/CENTER and wrapper1802:3992 HORIZONTAL HUG/FILL MIN/MIN zero padding/fill/radius, gap10, child946:25834. Mobile contract stays byte-equivalent.
- [ ] Icon-List Desktop wrappers1802:3506,3512,3522,3532,3566,3576 own actual children1015:18565,1802:3513,3523,3533,3567,3577. Mobile wrappers1817:4786–4791 own1015:18589,18593,18597,18601,18605,18609. Every wrapper is HUG/FILL MIN/MIN gap0, zero padding/fill/radius; graphic sizes56Desktop/42Mobile remain.
- [ ] Preserve Desktop items container with24gap and Mobile six direct rows with22section gap. Remap old absent Desktop graphic IDs1015:18569/18573/18577/18581/18585 to the exact actual IDs above; stable asset contract/name/scale and current graphics stay intact.
- [ ] Six Desktop Icon-Cards placement roots398:7763,398:7764,1015:18859,1015:18869,1015:18879,1015:18899 use MIN/CENTER. Freeze projected wrapper gaps0 and master10, prove one-child rendered equivalence plus second-child invalidation; add no override schema or fictitious proof.
- [ ] Cloud-publish and have verifier run the focused tests with short/long text, independent Show Description/Link and existing renderer semantics/verified-block-mini regressions. Inspect actual top icon/middle text cell alignment and no fixed HUG row height.

### Task 4 — 5 fix 1.4: derived documentation and acceptance

**Files:** Generate docs/generated/component-registry.md; update this plan and the current #p5-fix-1-cards/roadmap status only. No old109status edits or unrelated task closures.

**Interfaces:** generator output is returned by the verifier as exact candidate-derived bytes for cloud publication. Final review/verification receipts bind the exact final cloud SHA.

- [ ] Verifier runs canonical generator on the pinned candidate; coordinator publishes exactly those bytes. Compare protected button section, all outside records, MobileCardIcon/assets/descriptions and allowed-path diff.
- [ ] Verifier renders all12variant references and compares actual local browser output to full Figma PNGs. Check both viewports at native widths,300/328/375/659mobile and600/660+desktop contexts, default/short/long text and long link, all four Button/Caption states, Show Description/Link, no overflow and direct-image proportions. Include representative Marketing/Service and existing outside button consumers. No screenshots or logs are committed.
- [ ] Verifier performs fresh exact-final local validate, full tests and generated check (npm run verify plus npm run generate:check, or the honest direct equivalents with verified same-lock dependencies), then source-link/identity/preserved-object audit. Capture/export/raw-native limitations stay visible and separate from functional acceptance.
- [ ] Distinct selected expert reviewer reads all five primary requirements, fresh actual sources, final permitted diff, RED/GREEN/local visual receipts and this plan. Resolve actionable findings within scope; reverify any changed final commit.
- [ ] Mark candidate prepared/open/unmerged in current status. Attach one draft PR. Separate merge authorization and exact accepted merged evidence are required to close5fix1;5fix2/P6 remain pending.

## Current status

Fresh inspection and change preview are prepared. RED tests/fixture and the addressed plan are authored for cloud publication. No production implementation, actual RED/GREEN run, generated output, visual acceptance, final review or merge is claimed by this status.
