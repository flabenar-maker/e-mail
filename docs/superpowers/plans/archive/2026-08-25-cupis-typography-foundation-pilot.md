# CUPIS Typography Foundation Pilot Implementation Plan

> **Архив завершённого этапа.** Этот документ сохраняет исходные решения, команды, пути, чекбоксы и промежуточные статусы; они не являются текущей очередью или разрешением выполнять старые шаги. Часть работ могла быть отменена или передана в последующие этапы. Актуальный порядок и открытые обязательства находятся в [едином roadmap](../2026-08-25-cupis-migration-roadmap.md).

> **Исторический implementation plan.** Реализован в [PR #19](https://github.com/flabenar-maker/e-mail/pull/19). Команды, пути и чекбоксы ниже описывают выполнение того этапа, а не текущий рабочий маршрут: старый контур находится в Legacy/, маршруты остановлены, проверки теперь локальные. Для продолжения использовать свежие manifest и [roadmap](../2026-08-25-cupis-migration-roadmap.md).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать первый структурированный foundation-домен CUPIS: типографику с одним YAML-контрактом, строгой schema/semantic validation и проверяемым теневым соответствием действующему Markdown-реестру.

**Architecture:** `data/foundations/typography.yaml` хранит машинные определения 15 активных стилей и их responsive-пары. JSON Schema проверяет форму данных, отдельный Node-модуль — ссылки и семантическую целостность, а characterization test сравнивает новый источник с действующим Markdown-снимком. Новый источник объявляется в manifest, но до общего cutover не подменяет старый реестр в bundle profiles и навыках.

**Tech Stack:** Node.js 24 LTS; ECMAScript modules; built-in `node:test`; `ajv@8.20.0`; `yaml@2.9.0`; JSON Schema 2020-12; GitHub Actions через существующий `System validation` workflow.

**Spec:** `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`

## Global Constraints

- Реализация начинается от merge-коммита foundation-этапа `main@cea5bd65000cdfa8efead987efcfada2498ac5eb`.
- Persistent source of truth — только GitHub-репозиторий `flabenar-maker/e-mail`; локальная копия допустима только как одноразовый staging/test workspace.
- Figma не открывается и не изменяется: пилот переносит подтверждённый снимок от 24 августа 2026 года.
- `registry/email-typography-registry.md` остаётся без изменений и используется только как shadow baseline.
- Списки компонентов-потребителей пока не становятся structured cross-references: стабильные component IDs появятся на этапе component registry.
- `core/`, component descriptions, workflows, skills, конкретные письма и локальные email-проекты не изменяются.
- Новый typography source не добавляется в `bundle_profiles` до отдельного этапа cutover.
- YAML anchors, aliases, merge keys, duplicate keys и remote schema references запрещены.
- JSON Schema использует `additionalProperties: false` на каждом объектном уровне.
- Typography schema version — `1.0.0`; runtime поддерживает только эту версию.
- Все проверки read-only, детерминированы и не требуют сети.
- Merge требует отдельного разрешения пользователя; реализация заканчивается draft PR.

---

## File Responsibility Map

### Новые файлы

- `data/foundations/typography.yaml` — единственный structured source для определений стилей пилота.
- `schemas/typography.schema.json` — строгая форма typography foundation версии `1.0.0`.
- `scripts/lib/schema-validation.mjs` — переиспользуемая локальная JSON Schema boundary.
- `scripts/lib/typography-foundation.mjs` — загрузка и semantic validation типографики.
- `tests/foundation/schema-validation.test.mjs` — регрессии общей schema boundary.
- `tests/foundation/typography-foundation.test.mjs` — shape и semantic contracts типографики.
- `tests/characterization/typography-shadow.test.mjs` — эквивалентность подтверждённому Markdown-снимку.

### Изменяемые файлы

- `scripts/lib/system-manifest.mjs` — использует общую schema boundary и подключает объявленный typography domain.
- `system/manifest.yaml` — объявляет typography data и schema, но не меняет bundle profiles.
- `tests/foundation/system-manifest.test.mjs` — fixtures и ошибки manifest/domain integration.
- `README.md` — явно объясняет shadow ownership без изменения рабочих routes.

### Неизменяемые файлы

- `registry/email-typography-registry.md`
- `registry/email-component-descriptions-registry.md`
- `core/email-figma-prompt.md`
- `core/figma-component-naming-standard.md`
- `workflows/library-maintenance-checkpoint.md`
- `workflows/email-build-checkpoint.md`
- `.agents/skills/maintaining-cupis-email-system/SKILL.md`
- `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`

---

### Task 1: Reusable Local JSON Schema Boundary

**Files:**
- Create: `scripts/lib/schema-validation.mjs`
- Modify: `scripts/lib/system-manifest.mjs`
- Test: `tests/foundation/schema-validation.test.mjs`

**Interfaces:**
- Consumes: `SystemValidationError` from `scripts/lib/diagnostics.mjs`.
- Produces: `validateDocumentShape({ document, schema, supportedVersion, versionCode, schemaCode }): SystemValidationError[]`.
- Preserves: current `validateManifestShape(manifest, schema)` result codes and messages.

- [ ] **Step 1: Write failing tests for the shared boundary**

Create tests that assert:

```js
const schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "value"],
  properties: {
    schema_version: { const: "1.0.0" },
    value: { type: "string" },
  },
};

assert.deepEqual(
  validateDocumentShape({
    document: { schema_version: "1.0.0", value: "ok" },
    schema,
    supportedVersion: "1.0.0",
    versionCode: "fixture-version-unsupported",
    schemaCode: "fixture-schema",
  }),
  [],
);
```

Also assert exact codes for unsupported version, missing required property, unknown property and forbidden remote `$ref`.

- [ ] **Step 2: Confirm the red state**

Run:

```bash
node --test tests/foundation/schema-validation.test.mjs
```

Expected: `ERR_MODULE_NOT_FOUND` for `scripts/lib/schema-validation.mjs`.

- [ ] **Step 3: Implement the shared boundary**

Create `scripts/lib/schema-validation.mjs` with:

```js
export function validateDocumentShape({
  document,
  schema,
  supportedVersion,
  versionCode,
  schemaCode,
}) {
  if (document?.schema_version !== supportedVersion) {
    return [
      new SystemValidationError(
        versionCode,
        "/schema_version",
        `Expected ${supportedVersion}, received ${String(document?.schema_version)}.`,
      ),
    ];
  }

  assertNoRemoteRefs(schema);
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  if (validate(document)) return [];

  return validate.errors.map(
    (error) =>
      new SystemValidationError(
        schemaCode,
        error.instancePath || "/",
        schemaErrorMessage(error),
      ),
  );
}
```

Move `assertNoRemoteRefs` and `schemaErrorMessage` from `system-manifest.mjs` into this file without changing their messages. Export only `validateDocumentShape`.

- [ ] **Step 4: Delegate manifest shape validation to the shared boundary**

Keep the public function and exact codes:

```js
export function validateManifestShape(manifest, schema) {
  return validateDocumentShape({
    document: manifest,
    schema,
    supportedVersion: "1.0.0",
    versionCode: "manifest-version-unsupported",
    schemaCode: "manifest-schema",
  });
}
```

- [ ] **Step 5: Verify no manifest regression and commit**

Run:

```bash
node --test tests/foundation/schema-validation.test.mjs tests/foundation/system-manifest.test.mjs
npm test
```

Expected: PASS with the same manifest diagnostics as before.

```bash
git add scripts/lib/schema-validation.mjs scripts/lib/system-manifest.mjs tests/foundation/schema-validation.test.mjs
git commit -m "refactor: share local schema validation"
```

---

### Task 2: Typography Schema and Canonical Data

**Files:**
- Create: `schemas/typography.schema.json`
- Create: `data/foundations/typography.yaml`
- Test: `tests/foundation/typography-foundation.test.mjs`

**Interfaces:**
- Consumes: `readStrictYaml` and `validateDocumentShape`.
- Produces: typography document with `schema_version`, `foundation`, `styles` and `responsive_pairs`.
- Does not contain: component consumer lists or HTML implementation rules.

- [ ] **Step 1: Write failing shape tests**

Tests must cover:

- canonical typography document loads;
- exactly version `1.0.0` is accepted;
- unknown root and nested fields are rejected;
- missing required sections are rejected;
- `font_size_px` and `css_weight` must be positive integers with weight divisible by 100;
- line-height and letter-spacing require explicit units;
- viewport, role and variant use closed enums;
- remote `$ref`, YAML duplicate keys, anchors, aliases and merge keys are rejected.

Run:

```bash
node --test tests/foundation/typography-foundation.test.mjs
```

Expected: missing schema/data/module failures.

- [ ] **Step 2: Create strict typography schema**

`schemas/typography.schema.json` uses JSON Schema 2020-12 and requires:

```text
root: schema_version, foundation, styles, responsive_pairs
foundation: id, source
source: figma_file_key, page_node_id, verified_at
style: id, figma_name, viewport, role, variant, font,
       font_size_px, line_height, letter_spacing, figma_description
font: family, figma_style, css_weight
measure: unit, value
responsive pair: id, role, desktop_style_id, mobile_style_id
```

Closed enums:

```text
viewport: desktop | mobile
role: display | heading | title | body | caption | action
variant: default | compact | large | medium
measure unit: percent | px
```

Use the repository ID pattern `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`, `^[0-9]+:[0-9]+$` for Figma node IDs and `^\\d{4}-\\d{2}-\\d{2}$` for `verified_at`. Set `additionalProperties: false` on root and every object definition.

- [ ] **Step 3: Create the canonical typography dataset**

Top-level provenance is exact:

```yaml
schema_version: 1.0.0
foundation:
  id: typography
  source:
    figma_file_key: 8zka5bHkcrJVK9I9dKjnhC
    page_node_id: "5:6"
    verified_at: "2026-08-24"
```

Create exactly these 15 style records:

| ID | Figma name | Viewport | Role | Variant | Figma style / CSS weight | Size | LH |
|---|---|---|---|---|---|---:|---:|
| `desktop-display` | `Desktop/Display` | desktop | display | default | Bold / 700 | 32 | 120% |
| `desktop-heading` | `Desktop/Heading` | desktop | heading | default | SemiBold / 600 | 26 | 120% |
| `desktop-title` | `Desktop/Title` | desktop | title | default | Medium / 500 | 20 | 120% |
| `desktop-heading-compact` | `Desktop/Heading/Compact` | desktop | heading | compact | SemiBold / 600 | 20 | 120% |
| `desktop-body-large` | `Desktop/Body/Large` | desktop | body | large | Regular / 400 | 18 | 140% |
| `desktop-body-medium` | `Desktop/Body/Medium` | desktop | body | medium | Regular / 400 | 16 | 140% |
| `desktop-caption` | `Desktop/Caption` | desktop | caption | default | Regular / 400 | 14 | 140% |
| `desktop-action` | `Desktop/Action` | desktop | action | default | Medium / 500 | 16 | 140% |
| `mobile-display` | `Mobile/Display` | mobile | display | default | Bold / 700 | 20 | 120% |
| `mobile-heading` | `Mobile/Heading` | mobile | heading | default | SemiBold / 600 | 18 | 120% |
| `mobile-title` | `Mobile/Title` | mobile | title | default | Medium / 500 | 16 | 120% |
| `mobile-body-large` | `Mobile/Body/Large` | mobile | body | large | Regular / 400 | 14 | 140% |
| `mobile-body-medium` | `Mobile/Body/Medium` | mobile | body | medium | Regular / 400 | 12 | 140% |
| `mobile-caption` | `Mobile/Caption` | mobile | caption | default | Regular / 400 | 12 | 140% |
| `mobile-action` | `Mobile/Action` | mobile | action | default | Medium / 500 | 14 | 140% |

Every style uses `font.family: Roboto`, `letter_spacing: { unit: percent, value: 0 }` and the exact canonical paragraph under its matching heading in `registry/email-typography-registry.md` as `figma_description`.

Create these eight responsive pairs:

```text
display: desktop-display -> mobile-display
heading: desktop-heading -> mobile-heading
heading-compact: desktop-heading-compact -> mobile-heading
title: desktop-title -> mobile-title
body-large: desktop-body-large -> mobile-body-large
body-medium: desktop-body-medium -> mobile-body-medium
caption: desktop-caption -> mobile-caption
action: desktop-action -> mobile-action
```

- [ ] **Step 4: Add a minimal shape loader and verify green state**

In the test, load YAML through `readStrictYaml`, load the local JSON schema and call `validateDocumentShape` with:

```js
{
  supportedVersion: "1.0.0",
  versionCode: "typography-version-unsupported",
  schemaCode: "typography-schema",
}
```

Run the typography test. Expected: all shape tests PASS.

- [ ] **Step 5: Commit schema and data**

```bash
git add schemas/typography.schema.json data/foundations/typography.yaml tests/foundation/typography-foundation.test.mjs
git commit -m "feat: add structured typography foundation"
```

---

### Task 3: Typography Loader and Semantic Validation

**Files:**
- Create: `scripts/lib/typography-foundation.mjs`
- Modify: `tests/foundation/typography-foundation.test.mjs`

**Interfaces:**
- Produces: `loadTypographyFoundation({ repoRoot, dataPath, schemaPath }): Promise<object>`.
- Produces: `validateTypographyShape(document, schema): SystemValidationError[]`.
- Produces: `validateTypographySemantics(document): SystemValidationError[]`.
- Produces: `validateTypographyFoundation({ repoRoot, dataPath, schemaPath }): Promise<{ typography: object|null, errors: SystemValidationError[] }>`.

- [ ] **Step 1: Write failing semantic tests**

Cover exact diagnostics:

```text
duplicate-typography-style-id
duplicate-typography-figma-name
duplicate-typography-pair-id
unknown-typography-desktop-style
unknown-typography-mobile-style
typography-pair-desktop-viewport
typography-pair-mobile-viewport
typography-pair-role-mismatch
typography-style-unpaired
typography-figma-name-viewport-mismatch
```

Also assert deterministic sorting by path, code and message and that ordinary validation failures return data rather than throwing a stack trace.

- [ ] **Step 2: Confirm the red state**

Run:

```bash
node --test tests/foundation/typography-foundation.test.mjs
```

Expected: `ERR_MODULE_NOT_FOUND` or missing exports for `typography-foundation.mjs`.

- [ ] **Step 3: Implement shape loading**

`loadTypographyFoundation` reads only the supplied repository-relative paths, uses strict YAML for data and JSON for schema, then throws `AggregateError` only from the low-level loader when shape validation fails. `validateTypographyFoundation` converts expected errors into its return object and sanitizes unexpected read errors as:

```text
/data/foundations/typography.yaml: [typography-read] Typography foundation could not be read.
```

- [ ] **Step 4: Implement semantic validation**

Build maps for style IDs and Figma names. For every pair verify that:

- both referenced styles exist;
- desktop target has `viewport: desktop`;
- mobile target has `viewport: mobile`;
- both style roles equal the pair role;
- every style occurs in at least one pair.

For every style verify `Desktop/` or `Mobile/` prefix against its viewport. Return each duplicate value once and sort all diagnostics deterministically.

- [ ] **Step 5: Verify and commit**

Run:

```bash
node --test tests/foundation/typography-foundation.test.mjs
npm test
```

Expected: PASS.

```bash
git add scripts/lib/typography-foundation.mjs tests/foundation/typography-foundation.test.mjs
git commit -m "feat: validate typography semantics"
```

---

### Task 4: Shadow Equivalence with the Current Registry

**Files:**
- Create: `tests/characterization/typography-shadow.test.mjs`

**Interfaces:**
- Consumes: `data/foundations/typography.yaml` and `registry/email-typography-registry.md`.
- Proves: style definitions, exact Figma descriptions and responsive pairs were transferred without loss.
- Explicitly excludes: component-consumer lists, which remain owned by the Markdown baseline until component contracts exist.

- [ ] **Step 1: Write the characterization parser inside the test**

Implement three read-only extractors:

```js
extractCatalog(markdown)       // rows between the catalog and semantics headings
extractDescriptions(markdown)  // ### style paragraphs in the descriptions section
extractResponsivePairs(markdown) // rows in Desktop/Mobile correspondence table
```

The catalog extractor converts `Roboto Bold`, `Roboto SemiBold`, `Roboto Medium` and `Roboto Regular` into family/style values and maps them to CSS weights 700/600/500/400. It converts `32px` to `32`, `120%` to `{ unit: "percent", value: 120 }` and `0` to `{ unit: "percent", value: 0 }`.

- [ ] **Step 2: Write the failing parity assertions**

Assert:

```js
assert.equal(typography.styles.length, 15);
assert.deepEqual(normalizeStructuredStyles(typography), extractCatalog(markdown));
assert.deepEqual(structuredDescriptions(typography), extractDescriptions(markdown));
assert.deepEqual(normalizeStructuredPairs(typography), extractResponsivePairs(markdown));
```

The comparisons sort by Figma style name and compare exact values; they must not normalize or rewrite prose beyond line-ending normalization.

- [ ] **Step 3: Run and correct only migration mistakes**

Run:

```bash
node --test tests/characterization/typography-shadow.test.mjs
```

Expected initial result: FAIL if any YAML value or description was copied incorrectly. Correct only `data/foundations/typography.yaml`; do not edit the Markdown baseline.

- [ ] **Step 4: Verify and commit**

Run:

```bash
node --test tests/characterization/typography-shadow.test.mjs
npm test
```

Expected: PASS and exactly 15 matching styles.

```bash
git add data/foundations/typography.yaml tests/characterization/typography-shadow.test.mjs
git commit -m "test: guard typography shadow equivalence"
```

---

### Task 5: Manifest and System Validator Integration

**Files:**
- Modify: `system/manifest.yaml`
- Modify: `scripts/lib/system-manifest.mjs`
- Modify: `tests/foundation/system-manifest.test.mjs`
- Modify: `tests/foundation/validator-cli.test.mjs`

**Interfaces:**
- Manifest source IDs: `typography-foundation` and `typography-schema`.
- Existing `validateSystem({ repoRoot, manifestPath? })` additionally returns typography errors.
- Existing CLI command and success message do not change.

- [ ] **Step 1: Add failing integration tests**

Extend valid fixtures with:

```text
data/foundations/typography.yaml
schemas/typography.schema.json
```

Tests must assert:

- missing `typography-foundation` source declaration reports `missing-typography-source`;
- missing `typography-schema` source declaration reports `missing-typography-schema-source`;
- wrong source kinds report `invalid-typography-source-kind`;
- missing declared data/schema paths still use `missing-declared-path`;
- malformed typography makes `npm run validate` fail with a sanitized typography diagnostic;
- successful validation leaves every file byte-identical.

- [ ] **Step 2: Confirm the red state**

Run:

```bash
node --test tests/foundation/system-manifest.test.mjs tests/foundation/validator-cli.test.mjs
```

Expected: failures because typography sources and integration are absent.

- [ ] **Step 3: Declare the two new sources atomically**

Add to `system/manifest.yaml`:

```yaml
  - { id: typography-foundation, kind: registry, path: data/foundations/typography.yaml }
  - { id: typography-schema, kind: schema, path: schemas/typography.schema.json }
```

Do not add either ID to any `bundle_profiles.source_ids` in this phase.

- [ ] **Step 4: Resolve typography only through manifest IDs**

After manifest shape/semantic validation, locate both source records by ID. Validate expected kinds (`registry` and `schema`) and call:

```js
await validateTypographyFoundation({
  repoRoot,
  dataPath: typographySource.path,
  schemaPath: typographySchemaSource.path,
});
```

Merge typography diagnostics with manifest diagnostics and apply the existing path/code/message sort. Do not hardcode filesystem paths in `validateSystem`.

- [ ] **Step 5: Verify CLI and commit**

Run:

```bash
npm run validate
npm test
npm run verify
```

Expected:

```text
[PASS] CUPIS system validation passed.
```

```bash
git add system/manifest.yaml scripts/lib/system-manifest.mjs tests/foundation/system-manifest.test.mjs tests/foundation/validator-cli.test.mjs
git commit -m "feat: integrate typography validation"
```

---

### Task 6: Shadow-Mode Documentation and Publication Gate

**Files:**
- Modify: `README.md`
- Verify only: every protected file listed in Global Constraints.

**Interfaces:**
- Human readers can distinguish structured pilot data from the runtime Markdown baseline.
- No route, bundle, skill or Figma behavior changes.

- [ ] **Step 1: Document ownership without cutover**

Add a short typography pilot note to README stating:

```text
data/foundations/typography.yaml is the validated structured pilot for style definitions.
registry/email-typography-registry.md remains the shadow comparison baseline and current owner of component-consumer lists.
Runtime bundle profiles continue to use the Markdown registry until the generated-doc and bundle cutover phase.
```

Do not copy the 15 style values, semantic rules or descriptions into README.

- [ ] **Step 2: Run clean-install and complete verification**

Run from a clean disposable checkout of the feature branch:

```bash
npm ci --ignore-scripts
npm run validate
npm test
npm run verify
pwsh -NoProfile -File bootstrap/verify.ps1
pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1
```

On a Windows host also run the last two scripts with Windows PowerShell 5.1. Expected: every command exits 0.

- [ ] **Step 3: Verify scope and preservation**

Confirm:

- the Markdown typography registry Git blob is still `12e5ae0b0aa1c5f18f9132e2e948e6a712c0f1bd`;
- all other protected blobs are unchanged from `main@cea5bd65000cdfa8efead987efcfada2498ac5eb`;
- no bundle profile contains `typography-foundation` or `typography-schema`;
- no Figma, `email.html`, `images/`, archive, generated document or local output is present in the diff;
- allowed changed paths equal the File Responsibility Map and contain no extras.

- [ ] **Step 4: Commit documentation**

```bash
git add README.md
git commit -m "docs: explain typography shadow pilot"
```

- [ ] **Step 5: Publish a draft PR and stop**

Push branch `codex/structured-typography-foundation` and create one draft PR against `main`. The PR body records:

- pinned base SHA;
- structured data/schema paths;
- exact test counts and commands actually run;
- shadow baseline preservation;
- no Figma access;
- no runtime bundle cutover;
- rollback branch `backup/pre-structured-migration-2026-08-24`;
- explicit statement that merge requires a separate user command.

Do not merge the PR.

---

## Completion Criteria

The typography pilot is complete when:

1. all 15 active styles have one valid structured record;
2. all eight responsive pairs resolve and are semantically consistent;
3. exact style values and Figma descriptions match the Markdown baseline;
4. the system validator fails on malformed typography data;
5. the manifest is the only resolver of typography data/schema paths;
6. current runtime bundles still use the Markdown registry;
7. Figma and protected content remain unchanged;
8. Linux and Windows checks pass in GitHub Actions;
9. a draft PR exists and remains unmerged pending separate approval.

