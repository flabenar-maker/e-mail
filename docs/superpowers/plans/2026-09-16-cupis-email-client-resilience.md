# CUPIS Email Client Resilience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать client-resilience свойства CUPIS renderer точными, машинно-проверяемыми и доказанными локальными и целевыми клиентскими проверками до расширения renderer coverage на всю библиотеку.

**Architecture:** Общие политики принадлежат rendering foundation; язык, направление и alt-решение принадлежат конкретной email model; renderer только исполняет эти данные и возвращает стабильные diagnostics/metrics. Browser/no-style preview служит диагностикой, а выбор responsive baseline выполняется только после доставки того же пилота через Altcraft.

**Tech Stack:** Node.js 24, npm 11, ECMAScript modules, JSON Schema 2020-12, YAML, `node:test`, локальный browser preview, Figma MCP read-only visual reference, Altcraft delivery.

**Spec:** `docs/superpowers/specs/2026-09-16-cupis-email-client-resilience-design.md`

## Global Constraints

- Persistent source: only cloud GitHub repository `flabenar-maker/e-mail`; implementation starts from fresh pinned `main` SHA.
- Use Node.js `>=24 <25`; run tests locally, never through GitHub Actions or PR Checks.
- Routine tests and visual regression are delegated explicitly to `gpt-5.6-terra` with reasoning `medium`.
- Component geometry, typography, spacing, colors and asset boundaries remain sourced from structured contracts/foundations; no inferred replacement values.
- Figma is read-only during this plan. Any visual mutation requires a separate impact report and explicit authorization.
- `Buffer.byteLength(css, "utf8")` must be strictly less than `16384`; equality is failure.
- `min_supported_viewport_px` is the entire viewport width. Inner minimum content width is computed, not stored.
- `language`, `direction` and image alt purpose are required input; renderer does not guess defaults.
- Dark-mode declaration remains exactly `none`; renderer adds no dark variant, asset swap or artificial background.
- Package 11 cannot start until Package 10A–10D and the final Header/Footer pilot gate are complete.

---

### Task 1: Package 10A — Rendering foundation contract

**Files:**
- Modify: `data/foundations/rendering.yaml`
- Modify: `schemas/rendering.schema.json`
- Modify: `scripts/lib/rendering-foundation.mjs`
- Test: `tests/foundation/rendering-foundation.test.mjs`

**Interfaces:**
- Consumes: existing `loadRenderingFoundation({ repoRoot })`.
- Produces: rendering foundation schema `1.1.0` with `shell.min_supported_viewport_px`, `embedded_css`, `color_scheme` and `responsive_fallback`.

- [ ] **Step 1: Write failing canonical-shape tests**

Add assertions equivalent to:

```js
assert.deepEqual(rendering.shell, {
  background_color: "#F3F3F5",
  horizontal_inset_px: 15,
  max_width_px: 600,
  min_supported_viewport_px: 300,
});
assert.deepEqual(rendering.embedded_css, { max_bytes_exclusive: 16384 });
assert.deepEqual(rendering.color_scheme, {
  declaration: "none",
  dark_variant: "none",
});
assert.deepEqual(rendering.responsive_fallback, {
  without_embedded_css: "desktop",
  validation: "required-before-change",
});
```

Also assert rejection of `max_bytes_exclusive: 0`, an unknown color declaration, and the removed `shell.min_width_px`.

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```powershell
node --test tests/foundation/rendering-foundation.test.mjs
```

Expected: FAIL because the four exact policy fields and schema version `1.1.0` are not implemented.

- [ ] **Step 3: Implement schema and canonical YAML**

Use this exact canonical data:

```yaml
schema_version: 1.1.0
shell:
  background_color: '#F3F3F5'
  horizontal_inset_px: 15
  max_width_px: 600
  min_supported_viewport_px: 300
embedded_css:
  max_bytes_exclusive: 16384
color_scheme:
  declaration: none
  dark_variant: none
responsive_fallback:
  without_embedded_css: desktop
  validation: required-before-change
```

Preserve all existing breakpoint, primitive, postprocessing and support-profile records unchanged. Update `SUPPORTED_RENDERING_VERSION` to `1.1.0`.

- [ ] **Step 4: Run focused tests and validation**

```powershell
node --test tests/foundation/rendering-foundation.test.mjs
npm run validate
```

Expected: PASS; no component-specific or Figma-node data appears in rendering foundation.

- [ ] **Step 5: Commit Package 10A foundation**

```powershell
git add data/foundations/rendering.yaml schemas/rendering.schema.json scripts/lib/rendering-foundation.mjs tests/foundation/rendering-foundation.test.mjs
git commit -m "feat: define client resilience rendering policies"
```

---

### Task 2: Package 10A — Required document metadata and alt values

**Files:**
- Modify: `schemas/email-model.schema.json`
- Modify: `scripts/lib/email-model.mjs`
- Modify: `tests/fixtures/rendering/pilot-email.json`
- Modify: every active test fixture matching `tests/fixtures/rendering/*.json`
- Test: `tests/rendering/email-model.test.mjs`

**Interfaces:**
- Consumes: email model schema `1.0.0` and existing `{ type: "alt-text", value }` values.
- Produces: email model schema `1.1.0`, required `metadata`, and tagged alt values.

- [ ] **Step 1: Write failing schema and semantic tests**

Test these exact accepted values:

```js
model.metadata = { language: "ru", direction: "ltr" };
const informative = {
  type: "alt-text",
  purpose: "informative",
  value: "Преимущества CUPIS",
};
const decorative = {
  type: "alt-text",
  purpose: "decorative",
  value: "",
};
```

Test these exact failures:

```js
delete model.metadata;
model.metadata.language = "";
model.metadata.direction = "auto";
alt.purpose = "informative"; alt.value = "";
alt.purpose = "decorative"; alt.value = "Logo";
delete alt.purpose;
```

Expected diagnostics must point to the exact model path.

- [ ] **Step 2: Run the focused model test and confirm RED**

```powershell
node --test tests/rendering/email-model.test.mjs
```

Expected: FAIL because metadata and tagged alt semantics are absent.

- [ ] **Step 3: Extend the schema and semantic validator**

Require at root:

```json
{
  "required": ["schema_version", "id", "metadata", "root"]
}
```

Define `metadata.language` as a non-empty BCP 47-shaped string and `metadata.direction` as enum `ltr|rtl`. Define `alt-text` as a tagged union whose `informative` branch requires non-empty `value` and whose `decorative` branch requires `value` equal to `""`.

Update the model loader supported version to `1.1.0`. Keep plain text, URL, placeholder, number and rich-text branches unchanged.

- [ ] **Step 4: Audit direct-image alt capability before fixture migration**

Add a read-only test that walks all structured component trees and reports every `render_mode: direct-image` without exactly one `content_slots` entry of `type: alt-text`. The test must fail with component ID and element path; do not insert missing slots automatically.

Run:

```powershell
node --test tests/rendering/renderer-contract-semantics.test.mjs
```

Expected: PASS only when every rendered direct image is alt-capable; any failure becomes a contract blocker for a separate Figma-backed decision.

- [ ] **Step 5: Migrate pilot fixtures explicitly**

Add:

```json
"metadata": { "language": "ru", "direction": "ltr" }
```

Convert every existing `alt-text` value to either `informative` with its existing non-empty text or `decorative` with exact empty text. Do not invent replacement copy.

- [ ] **Step 6: Run model and contract-semantic tests**

```powershell
node --test tests/rendering/email-model.test.mjs tests/rendering/renderer-contract-semantics.test.mjs
```

Expected: PASS; no fixture relies on an implicit alt default.

- [ ] **Step 7: Commit Package 10A model**

```powershell
git add schemas/email-model.schema.json scripts/lib/email-model.mjs tests/fixtures/rendering tests/rendering/email-model.test.mjs tests/rendering/renderer-contract-semantics.test.mjs
git commit -m "feat: require email metadata and explicit alt semantics"
```

---

### Task 3: Package 10B — Document shell and explicit image alt

**Files:**
- Modify: `scripts/lib/email-renderer.mjs`
- Modify: `scripts/lib/email-interpreter.mjs`
- Modify: `scripts/lib/email-primitives.mjs`
- Test: `tests/rendering/email-primitives.test.mjs`
- Test: `tests/rendering/email-interpreter.test.mjs`
- Test: `tests/rendering/html-invariants.test.mjs`

**Interfaces:**
- Consumes: `model.metadata` and tagged alt values from Task 2.
- Produces: exact `<html lang dir>`, inner content wrapper, and direct images with explicit alt.

- [ ] **Step 1: Write failing shell and alt tests**

Assert the rendered document contains:

```html
<html lang="ru" dir="ltr">
<body style="margin:0;padding:0"><div lang="ru" dir="ltr">
```

Assert an informative image renders its escaped non-empty alt and a decorative image renders `alt=""`. Add a primitive test that calling `direct-image` without an own `alt` property fails with `DIRECT_IMAGE_ALT_REQUIRED`.

- [ ] **Step 2: Run focused tests and confirm RED**

```powershell
node --test tests/rendering/email-primitives.test.mjs tests/rendering/email-interpreter.test.mjs tests/rendering/html-invariants.test.mjs
```

Expected: FAIL because the current shell has no `lang`/`dir` and direct image uses `props.alt ?? ""`.

- [ ] **Step 3: Implement exact shell propagation**

In `renderEmailDocument`, escape and emit `model.metadata.language` and `model.metadata.direction` on `<html>` and on one wrapper immediately inside `<body>`. Do not duplicate visual styles on the wrapper.

- [ ] **Step 4: Remove implicit decorative fallback**

Make `renderDirectImage` require an own `alt` property, including an explicitly empty string. `email-interpreter.mjs` must resolve the tagged alt value and pass only its `value` after model validation.

- [ ] **Step 5: Run focused tests**

```powershell
node --test tests/rendering/email-primitives.test.mjs tests/rendering/email-interpreter.test.mjs tests/rendering/html-invariants.test.mjs
```

Expected: PASS; every rendered `<img>` has explicit alt and both language owners match.

- [ ] **Step 6: Commit Package 10B shell semantics**

```powershell
git add scripts/lib/email-renderer.mjs scripts/lib/email-interpreter.mjs scripts/lib/email-primitives.mjs tests/rendering
git commit -m "feat: render explicit language and image semantics"
```

---

### Task 4: Package 10B — CSS budget and output metrics

**Files:**
- Create: `scripts/lib/email-metrics.mjs`
- Modify: `scripts/lib/email-renderer.mjs`
- Modify: `scripts/lib/diagnostics.mjs` only if a new exported diagnostic helper is required
- Test: `tests/rendering/email-metrics.test.mjs`
- Test: `tests/rendering/html-invariants.test.mjs`

**Interfaces:**
- Produces: `measureEmailOutput({ html, css }) -> { html_bytes, embedded_css_bytes }`.
- Produces: renderer result `{ html, assets, diagnostics, metrics }`.

- [ ] **Step 1: Write exact boundary tests**

```js
assert.equal(measureEmailOutput({ html: "é", css: "" }).html_bytes, 2);
assert.equal(validateEmbeddedCssBudget("a".repeat(16383), 16384).length, 0);
assert.equal(
  validateEmbeddedCssBudget("a".repeat(16384), 16384)[0].code,
  "RENDER_EMBEDDED_CSS_BUDGET_EXCEEDED",
);
```

The diagnostic path is `/embedded_css` and its message includes actual bytes and exclusive limit.

- [ ] **Step 2: Run the focused test and confirm RED**

```powershell
node --test tests/rendering/email-metrics.test.mjs
```

Expected: FAIL because the metrics module does not exist.

- [ ] **Step 3: Implement metrics using UTF-8 byte length**

Use only:

```js
Buffer.byteLength(value, "utf8")
```

Do not use JavaScript string length. Validate the combined CSS string after all responsive rules are assembled and before HTML is published.

- [ ] **Step 4: Attach metrics and blocking diagnostic to renderer result**

Read `rendering.embedded_css.max_bytes_exclusive`; return metrics for successful output and a blocking diagnostic at or above the limit. Preserve existing CLI stdout path interface.

- [ ] **Step 5: Run metrics and invariant tests**

```powershell
node --test tests/rendering/email-metrics.test.mjs tests/rendering/html-invariants.test.mjs
```

Expected: PASS at `16383`, fail at `16384`, and pilot output exposes both byte metrics.

- [ ] **Step 6: Commit Package 10B metrics**

```powershell
git add scripts/lib/email-metrics.mjs scripts/lib/email-renderer.mjs scripts/lib/diagnostics.mjs tests/rendering/email-metrics.test.mjs tests/rendering/html-invariants.test.mjs
git commit -m "feat: enforce embedded CSS byte budget"
```

---

### Task 5: Package 10B — Minimum viewport shell semantics

**Files:**
- Modify: `scripts/lib/email-primitives.mjs`
- Modify: `scripts/lib/email-renderer.mjs`
- Test: `tests/rendering/email-primitives.test.mjs`
- Test: `tests/rendering/pilot-layout.test.mjs`

**Interfaces:**
- Consumes: `shell.min_supported_viewport_px`, `shell.horizontal_inset_px`.
- Produces: inner minimum width `max(1, min_supported_viewport_px - 2 * horizontal_inset_px)`.

- [ ] **Step 1: Write failing width arithmetic tests**

For canonical values assert:

```js
assert.equal(innerMinWidth, 270);
assert.match(html, /min-width:270px/);
assert.doesNotMatch(html, /min-width:300px/);
```

Also test that an impossible configuration where `2 * inset >= min_supported_viewport_px` returns a stable rendering-foundation semantic diagnostic instead of clamping silently.

- [ ] **Step 2: Run focused tests and confirm RED**

```powershell
node --test tests/rendering/email-primitives.test.mjs tests/rendering/pilot-layout.test.mjs
```

Expected: FAIL because the current primitive assigns `300px` directly to the inner table.

- [ ] **Step 3: Implement shell calculation and validation**

Compute inner minimum width once in the shell primitive. Preserve `max_width_px:600`, background `#F3F3F5`, inset `15px`, MSO wrapper and existing table attributes.

- [ ] **Step 4: Run focused tests**

```powershell
node --test tests/rendering/email-primitives.test.mjs tests/rendering/pilot-layout.test.mjs
```

Expected: PASS with no geometry change above the constrained narrow range.

- [ ] **Step 5: Commit Package 10B viewport semantics**

```powershell
git add scripts/lib/email-primitives.mjs scripts/lib/email-renderer.mjs tests/rendering/email-primitives.test.mjs tests/rendering/pilot-layout.test.mjs
git commit -m "fix: define minimum viewport without shell overflow"
```

---

### Task 6: Package 10C — Normal and no-style preview modes

**Files:**
- Create: `scripts/lib/email-preview.mjs`
- Create: `scripts/render-email-preview.mjs`
- Create: `tests/rendering/email-preview.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `buildEmailPreview({ html, mode }) -> string`, where mode is `normal|no-style`.
- Produces CLI: `node scripts/render-email-preview.mjs --model <json> --mode normal|no-style --output <html-file>`.

- [ ] **Step 1: Write failing preview transformation tests**

For `normal`, output must equal the rendered HTML byte-for-byte. For `no-style`, remove all `<style>...</style>` blocks and preserve body markup, inline styles, attributes, assets and order byte-for-byte.

- [ ] **Step 2: Run preview tests and confirm RED**

```powershell
node --test tests/rendering/email-preview.test.mjs
```

Expected: FAIL because preview module and CLI do not exist.

- [ ] **Step 3: Implement the minimal preview module and CLI**

The CLI loads the same model, registries and rendering foundation as `scripts/render-email.mjs`, blocks on diagnostics, and writes one HTML file. It must not publish an email folder or copy assets.

Add:

```json
"preview:email": "node scripts/render-email-preview.mjs"
```

- [ ] **Step 4: Run preview tests and both CLI modes**

```powershell
node --test tests/rendering/email-preview.test.mjs
npm run preview:email -- --model tests/fixtures/rendering/pilot-email.json --mode normal --output $env:TEMP\cupis-normal.html
npm run preview:email -- --model tests/fixtures/rendering/pilot-email.json --mode no-style --output $env:TEMP\cupis-no-style.html
```

Expected: both files are created; only the no-style file lacks `<style>`.

- [ ] **Step 5: Commit Package 10C preview tooling**

```powershell
git add scripts/lib/email-preview.mjs scripts/render-email-preview.mjs tests/rendering/email-preview.test.mjs package.json
git commit -m "feat: add normal and no-style email previews"
```

---

### Task 7: Package 10C — Narrow viewport and visual pilot gate

**Files:**
- Create: `tests/rendering/client-resilience.test.mjs`
- Create: `tests/rendering/visual-scenarios.test.mjs`
- Modify: `data/renderers/registry.yaml`
- Modify: `tests/fixtures/rendering/pilot-email.json`
- Modify: Header-related component contract only if a fresh read-only Figma check proves an implementation-significant mismatch; otherwise preserve component YAML.

**Interfaces:**
- Consumes: preview CLI and exact component contracts.
- Produces: representative pilot containing Email/Header, existing blocks and Email/Footer.

- [ ] **Step 1: Add Header readiness tests before registry coverage**

Assert that Email/Header has renderer-ready facts, both viewport contracts and no unresolved generic description facts. If a required fact is missing, stop and report the exact component path; do not invent it.

- [ ] **Step 2: Add the narrow Header coverage and pilot instance**

Register Email/Header using the existing generic interpreter or an already permitted declarative recipe. Preserve Email/Footer coverage. The root remains Email/Template; Header and Footer are not rendered as standalone body blocks outside the template.

- [ ] **Step 3: Add deterministic HTML assertions**

Assert:

- breakpoint remains exactly `max-width:659px`;
- Mobile/Desktop order matches their contracts;
- direct images retain `height:auto` when width is fluid;
- Header and Footer appear once each;
- normal and no-style previews use the same body tree and assets;
- no embedded style reaches `16384` bytes.

- [ ] **Step 4: Run automated Package 10C tests**

```powershell
node --test tests/rendering/client-resilience.test.mjs tests/rendering/visual-scenarios.test.mjs tests/rendering/html-invariants.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Perform local browser visual regression through Terra Medium**

Explicitly delegate to `gpt-5.6-terra`, reasoning `medium`. Compare normal preview at widths `300`, `320`, `360`, `600`, `659`, `660` and no-style preview at `300`, `320`, `360`, `600`. Compare normal Mobile/Desktop geometry, spacing, visibility, images and text against fresh read-only Figma screenshots for the scoped pilot components.

Success conditions:

- no horizontal scrollbar at the declared widths;
- no image distortion;
- exact Mobile/Desktop alignment and order in normal mode;
- no-style mode remains readable and branded;
- screenshots remain temporary and are not committed.

- [ ] **Step 6: Commit Package 10C pilot**

```powershell
git add data/renderers/registry.yaml tests/fixtures/rendering/pilot-email.json tests/rendering/client-resilience.test.mjs tests/rendering/visual-scenarios.test.mjs
git commit -m "test: add client resilience pilot scenarios"
```

---

### Task 8: Package 10D — Altcraft client evidence

**Files:**
- Create after actual delivery: `docs/qa/cupis-client-resilience-evidence-YYYY-MM-DD.md`
- Modify after decision: `data/foundations/rendering.yaml`
- Test after decision: `tests/foundation/rendering-foundation.test.mjs`

**Interfaces:**
- Consumes: the exact pilot HTML produced by Task 7.
- Produces: client evidence and one explicit responsive fallback decision.

- [ ] **Step 1: Deliver one unchanged pilot through Altcraft**

Use the same `email.html` and assets for every observation. Do not edit the HTML in Altcraft except fields owned by Altcraft, such as links or preheader; record every such change in the evidence document.

- [ ] **Step 2: Record exact coordinates for every observation**

The evidence table must contain:

```markdown
| Client | OS + version | App version | Account type | Theme | Mobile layout switched | Horizontal scroll | Images proportional | Logo/text/background readable | Result |
```

Required clients: mobile Яндекс Почта, Mail.ru and Gmail. For Gmail, distinguish Google account from a connected non-Google account when that scenario exists in the audience.

- [ ] **Step 3: Apply the responsive decision gate**

- If all material target combinations apply embedded CSS and normal Mobile layout: change `responsive_fallback.validation` to `validated-current` and keep `without_embedded_css: desktop`.
- If a material target combination removes embedded CSS: implement and test `without_embedded_css: mobile-first` in a separate commit.
- Do not implement `hybrid` unless a recorded Mobile-first preview fails the agreed desktop fallback criterion.

- [ ] **Step 4: Apply the dark-mode decision gate**

If the existing single assets and exact backgrounds remain readable, keep both color-scheme values `none`. If a concrete component fails, stop this plan at the documented finding and open a separate Figma impact task; do not mutate Figma or add renderer graphics.

- [ ] **Step 5: Run the focused foundation and rendering tests**

```powershell
node --test tests/foundation/rendering-foundation.test.mjs tests/rendering/client-resilience.test.mjs tests/rendering/visual-scenarios.test.mjs
```

Expected: PASS for the selected evidence-backed baseline.

- [ ] **Step 6: Commit Package 10D evidence and decision**

```powershell
git add docs/qa data/foundations/rendering.yaml tests/foundation/rendering-foundation.test.mjs
git commit -m "docs: record target client fallback decision"
```

---

### Task 9: Active standards, stage status and workflow handoff

**Files:**
- Modify: `core/email-rendering-standard.md`
- Modify: `docs/superpowers/specs/2026-09-10-cupis-html-rendering-design.md`
- Modify: `docs/superpowers/plans/2026-09-10-cupis-html-rendering-stage-8.md`
- Modify: `docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md`
- Modify later with Package 12: structured email-build workflow files created by Package 12

**Interfaces:**
- Consumes: completed Package 10A–10D outputs.
- Produces: one unambiguous next step: Package 11.

- [ ] **Step 1: Add principles without duplicating exact values**

Core may state only:

- document locale and image semantics must be explicit;
- client fallback and output budgets come from rendering foundation;
- browser and real-client evidence are different gates;
- client safety cannot add visual design absent from contracts.

Do not copy `300`, `15`, `16384`, `ru`, `ltr` or current fallback value into Core.

- [ ] **Step 2: Mark Package 10 subpackages with actual evidence**

Check off 10A–10D only when their commits and tests exist. Link the evidence document and selected fallback. Do not mark Package 11 or Stage 8 complete.

- [ ] **Step 3: Preserve skill and workflow boundaries**

Do not copy policies into `maintaining-cupis-email-system/SKILL.md`. Package 12 email-build workflow must later consume the rendering foundation and model schema through manifest-driven routing.

- [ ] **Step 4: Run documentation and allowed-path checks**

```powershell
npm run generate:check
npm run validate
```

Expected: PASS; generated docs are changed only if their canonical renderer inputs require it.

- [ ] **Step 5: Commit documentation handoff**

```powershell
git add core/email-rendering-standard.md docs/superpowers
 git commit -m "docs: complete client resilience package handoff"
```

---

### Task 10: Exact-final-SHA verification and publication

**Files:**
- No source changes unless a failing check identifies a real defect in an already changed path.

**Interfaces:**
- Consumes: exact final cloud branch SHA.
- Produces: local verification summary sufficient for merge review.

- [ ] **Step 1: Fetch a disposable isolated snapshot of the exact cloud SHA**

Use official Node.js 24 and npm 11. The snapshot is verification-only and is never used as the edit source.

- [ ] **Step 2: Delegate routine checks to Terra Medium**

Explicitly create a `gpt-5.6-terra` subagent with reasoning `medium` to run:

```powershell
npm ci
npm run generate:check
npm run validate
npm test
npm run verify
```

The report must contain only commands run, failed tests, root cause, changes made and final status. Do not use GitHub Actions.

- [ ] **Step 3: Verify preserved boundaries**

Confirm the final diff contains no Figma mutation, no local email output, no committed screenshots, no component value changes without fresh Figma evidence, and no skill copy of rendering constants.

- [ ] **Step 4: Publish for review**

Push the exact verified cloud commit and update the PR body with final SHA and local results. Merge only after explicit user authorization.