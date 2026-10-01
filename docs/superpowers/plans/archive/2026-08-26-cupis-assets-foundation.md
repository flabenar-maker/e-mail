# CUPIS Assets Foundation Implementation Plan

> **Архив завершённого этапа.** Этот документ сохраняет исходные решения, команды, пути, чекбоксы и промежуточные статусы; они не являются текущей очередью или разрешением выполнять старые шаги. Часть работ могла быть отменена или передана в последующие этапы. Актуальный порядок и открытые обязательства находятся в [едином roadmap](../2026-08-25-cupis-migration-roadmap.md).

> **Исторический implementation plan.** Реализован в [PR #33](https://github.com/flabenar-maker/e-mail/pull/33). Команды, пути и чекбоксы ниже описывают выполнение того этапа, а не текущий рабочий маршрут: старый контур находится в Legacy/, маршруты остановлены, проверки теперь локальные. Для продолжения использовать свежие manifest и [roadmap](../2026-08-25-cupis-migration-roadmap.md).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Зафиксировать общие правила источника, экспорта и отображения email-изображений в строгом shadow-foundation без изменения Figma, component contracts, HTML-писем или готовых assets.

**Architecture:** `data/foundations/assets.yaml` становится единственным структурированным shadow-источником общих asset/export definitions. JSON Schema проверяет форму, semantic validator — совместимость значений и ссылок, resolver — точное разрешение уже выбранного component contract без догадок. Действующие Markdown-правила остаются comparison baseline до общего cutover; foundation объявляется в manifest, но не добавляется ни в один рабочий bundle.

**Tech Stack:** Node.js 24, ESM, YAML 2.9, Ajv 8, встроенный `node:test`, GitHub Contents API, GitHub Actions.

**Spec:** [CUPIS structured email system design](../../specs/2026-08-24-cupis-structured-email-system-design.md); текущий этап — [migration roadmap, 5А](../2026-08-25-cupis-migration-roadmap.md).

## Global Constraints

- Работать только через облачный GitHub: отдельная branch, draft PR, GitHub Actions. Локальный checkout не создавать и локальные файлы системы не менять.
- Перед первым изменением закрепить актуальный SHA `main`. Если `main` изменился, перепривязать branch и обновить `provenance.baseline_commit`.
- Не менять Figma, descriptions, component registry, `core/email-figma-prompt.md`, готовые письма или файлы изображений.
- Не добавлять assets foundation в `bundle_profiles[*].source_ids`: до этапа generated context bundles это только shadow-source.
- Не переносить в foundation компонентные owner IDs, display sizes, конкретные export boundaries и исключения. Они остаются в component contracts.
- Resolver принимает только явно переданные значения component contract. Он не выбирает source/display/export mode по типу компонента и не содержит fallback.
- Любое диагностическое сообщение имеет стабильные `code`, `path`, `message` и сортируется существующим системным механизмом.
- Каждый RED и GREEN подтверждается GitHub Actions. Коммиты с падающими тестами допустимы только в draft PR.
- Слияние PR — только после отдельного разрешения пользователя.

## Canonical Data Contract

`data/foundations/assets.yaml` должен содержать ровно следующие группы:

| Group | IDs | Responsibility |
|---|---|---|
| `source_modes` | `image-fill`, `rendered-node` | Что именно является исходником экспорта |
| `display_modes` | `direct-image`, `fill-image` | Как готовый файл отображается в HTML |
| `export_profiles` | `jpeg-2x`, `png-4x` | Формат, scale, suffix, color space, quality/alpha |
| `alpha_modes` | `none`, `transparent`, `opaque`, `source` | Ожидаемая прозрачность результата |
| `clipping_policies` | `preserve-artwork`, `neutralize-presentation-only` | Как обращаться с clipping перед экспортом |
| `compatibility` | по одному правилу на export profile | Разрешённые сочетания source/display/alpha/clipping |
| `global_invariants` | фиксированный список ниже | Общие запреты и границы ответственности |
| `identity_policy` | один объект | Имя файла, asset owner, suffix, общий Mobile/Desktop файл |
| `background_policy` | один объект | Own Fill, parent Fill, invisible Fill, artificial matte |
| `provenance` | один объект | Baseline и источники сравнения |

Обязательные значения:

- `image-fill`: экспортируется исходный raster из Fill конкретного Desktop-инстанса; контейнер, вложенная графика и HTML не входят.
- `rendered-node`: экспортируется точная граница конкретного узла после overrides; входят собственный видимый Fill и видимая вложенная графика; parent Fill и нерелевантные layout/padding не входят.
- `direct-image`: intrinsic ratio обязателен; crop-owner — `none`; Mobile допускает `width:100%` только вместе с `height:auto`.
- `fill-image`: исходные пропорции файла сохраняются; crop принадлежит HTML-wrapper; фиксированная Mobile-высота, `height:100%` и деформация запрещены.
- `jpeg-2x`: suffix `@2x`, extension `.jpg`, format `JPEG`, scale `2`, `sRGB`, quality `82`, escalation `90` только при видимых артефактах, alpha `none`; для `rendered-node` обязателен lossless PNG intermediate.
- `png-4x`: suffix `@4x`, extension `.png`, format `PNG`, scale `4`, `sRGB`, alpha разрешён; node export использует `contentsOnly: true`.
- `neutralize-presentation-only` допустим только для `rendered-node` и только на временной копии; Fill/crop/ratio/variants/children не меняются, копия удаляется, затем выполняется readback.
- Видимый Fill самой export boundary сохраняется. Parent Fill, invisible Fill и искусственная подложка исключаются.
- Базовое имя берётся у ближайшего semantic asset owner; `@2x`/`@4x` обязательны; `Mobile`/`Desktop` в имени запрещены; один визуальный asset использует один файл и один `src` в обоих viewport.
- Источник всегда конкретный Desktop-инстанс, placeholder запрещён.
- Source mode и display mode независимы.
- Raster нельзя деформировать.
- Компонентные owner, boundary, display size и исключения остаются в component contracts.

## Public Module Contract

Создать `scripts/lib/assets-foundation.mjs` со следующими exports:

~~~js
export function validateAssetsShape(assets, schema);
export async function loadAssetsFoundation({
  repoRoot,
  dataPath = "data/foundations/assets.yaml",
  schemaPath = "schemas/assets.schema.json",
});
export function validateAssetsSemantics(assets);
export function resolveAssetContract(
  assets,
  {
    sourceModeId,
    displayModeId,
    exportProfileId,
    expectedAlphaId,
    clippingPolicyId,
  },
);
export async function validateAssetsFoundation({
  repoRoot,
  dataPath = "data/foundations/assets.yaml",
  schemaPath = "schemas/assets.schema.json",
});
~~~

`resolveAssetContract` возвращает глубокие копии пяти выбранных definitions и соответствующего compatibility rule:

~~~js
{
  source_mode,
  display_mode,
  export_profile,
  expected_alpha,
  clipping_policy,
  compatibility,
}
~~~

При неизвестном значении resolver выбрасывает `SystemValidationError` с code `ASSETS_UNKNOWN_CONTRACT_VALUE`. Никакой default-selection логики нет.

Стабильные semantic diagnostics:

- `ASSETS_DUPLICATE_ID`
- `ASSETS_UNKNOWN_REFERENCE`
- `ASSETS_PROFILE_COMPATIBILITY_MISSING`
- `ASSETS_INCOMPATIBLE_ALPHA`
- `ASSETS_INCOMPATIBLE_CLIPPING`
- `ASSETS_SCALE_SUFFIX_MISMATCH`
- `ASSETS_INVALID_JPEG_QUALITY`
- `ASSETS_BUILD_CHOICE_FORBIDDEN`

Shape/read diagnostics:

- `assets-version-unsupported`
- `assets-schema`
- `assets-read`

---

### Task 1: Freeze the comparison baseline and start the draft PR

**Files:**
- Create: `tests/characterization/assets-shadow.test.mjs`
- Reference only: `core/email-figma-prompt.md`
- Reference only: `registry/email-component-descriptions-registry.md`
- Reference only: `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`

- [ ] **Step 1: Pin the implementation branch to current `main`**

Fetch `main`, record its SHA, and verify the implementation branch starts exactly there. If it differs from the plan baseline, update `provenance.baseline_commit` planned below before writing data.

- [ ] **Step 2: Write the failing characterization test**

Create a test that loads the three baseline Markdown files and the not-yet-created `data/foundations/assets.yaml`. It must assert named baseline anchors, not hashes:

~~~js
test("assets shadow source preserves the approved global contracts", async () => {
  const prompt = await readFile(join(repoRoot, "core/email-figma-prompt.md"), "utf8");
  const registry = await readFile(
    join(repoRoot, "registry/email-component-descriptions-registry.md"),
    "utf8",
  );

  for (const anchor of [
    "IMAGE FILL",
    "RENDERED NODE",
    "DIRECT IMAGE",
    "FILL IMAGE",
    "@2x",
    "@4x",
    "sRGB",
    "начальное качество: 82%",
    "height:auto",
  ]) {
    assert.match(prompt, new RegExp(escapeRegExp(anchor), "u"));
  }

  for (const anchor of [
    "Banner/Hero",
    "Banner/Secondary",
    "Asset/Card-Image",
    "Asset/Feature-Icon",
  ]) {
    assert.match(registry, new RegExp(escapeRegExp(anchor), "u"));
  }

  const assetsText = await readFile(
    join(repoRoot, "data/foundations/assets.yaml"),
    "utf8",
  );
  assert.match(assetsText, /^schema_version:\\s+1\\.0\\.0$/mu);
});
~~~

Include a local `escapeRegExp` helper. Do not snapshot whole Markdown files: named anchors survive unrelated editorial changes and still prove the relevant baseline exists.

- [ ] **Step 3: Commit RED and open a draft PR**

Commit message:

~~~text
test: characterize assets foundation baseline
~~~

Open one draft PR for the whole implementation. GitHub Actions must fail because `assets.yaml` does not exist. Record the failing run URL in the PR body or a PR comment.

- [ ] **Step 4: Do not “fix” the baseline Markdown**

The RED condition must be removed only by adding the structured source in Task 2.

### Task 2: Add the canonical assets data, strict schema and shape loader

**Files:**
- Create: `data/foundations/assets.yaml`
- Create: `schemas/assets.schema.json`
- Create: `scripts/lib/assets-foundation.mjs`
- Create: `tests/foundation/assets-foundation.test.mjs`
- Modify: `tests/characterization/assets-shadow.test.mjs`

**Interfaces:**
- Produces: `validateAssetsShape(assets, schema)` and `loadAssetsFoundation({ repoRoot, dataPath, schemaPath })`.
- Leaves semantic validation and contract resolution for Task 3.

- [ ] **Step 1: Write the failing shape tests**

Create `tests/foundation/assets-foundation.test.mjs` against the desired module API. Cover:

1. canonical YAML passes schema through `loadAssetsFoundation`;
2. unknown top-level property fails with `assets-schema`;
3. duplicate YAML key is rejected by `readStrictYaml`;
4. unsupported `schema_version` fails with `assets-version-unsupported`;
5. each definition array requires at least one object and ID strings matching `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`;
6. build-time fields `owner`, `export_boundary`, `display_width`, `display_height`, `component_id` are rejected anywhere they can occur in the document.

Import the wished-for API exactly:

~~~js
import {
  loadAssetsFoundation,
  validateAssetsShape,
} from "../../scripts/lib/assets-foundation.mjs";
~~~

Use cloned fixtures, never mutate the canonical object shared across tests.

- [ ] **Step 2: Commit and verify RED**

Commit message:

~~~text
test: specify assets foundation shape contract
~~~

Run the draft PR in GitHub Actions. Expected failure: `ERR_MODULE_NOT_FOUND` for `scripts/lib/assets-foundation.mjs`. This is the intentionally missing production unit, not a typo or unrelated setup error.

- [ ] **Step 3: Implement the strict JSON Schema**

The schema must use Draft 2020-12, `additionalProperties: false` on every object, explicit `required` arrays, and enums for closed vocabularies. Required top-level keys:

~~~json
[
  "schema_version",
  "foundation",
  "source_modes",
  "display_modes",
  "export_profiles",
  "alpha_modes",
  "clipping_policies",
  "compatibility",
  "identity_policy",
  "background_policy",
  "global_invariants",
  "provenance"
]
~~~

Every object schema that can contain contract data must reject these component/build keys:

~~~json
{
  "not": {
    "anyOf": [
      { "required": ["owner"] },
      { "required": ["export_boundary"] },
      { "required": ["display_width"] },
      { "required": ["display_height"] },
      { "required": ["component_id"] }
    ]
  }
}
~~~

Apply the guard together with `additionalProperties: false`; do not describe it as recursive unless it is actually placed on every relevant nested object.

- [ ] **Step 4: Write the canonical YAML**

Use `schema_version: 1.0.0`, `foundation.id: assets`, `foundation.status: shadow`, and exactly the IDs and meanings from “Canonical Data Contract”.

Each definition object has:

~~~yaml
- id: image-fill
  label: IMAGE FILL
  contract:
    source_content: source-raster-only
    concrete_desktop_instance_required: true
  description: >-
    Export the original source raster from the Fill of the concrete Desktop
    email instance without the container, nested graphics or live HTML.
~~~

Use booleans/enums for enforceable facts; descriptions explain intent but are never parsed by validators.

For `provenance.baseline_commit`, write the exact 40-character implementation-branch merge-base captured in Task 1 Step 1. A placeholder value is forbidden. Set `reviewed_on: 2026-08-27` and use exactly these comparison sources:

~~~yaml
comparison_sources:
  - core/email-figma-prompt.md
  - registry/email-component-descriptions-registry.md
  - docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md
~~~

- [ ] **Step 5: Implement only shape validation and loading**

Create `scripts/lib/assets-foundation.mjs` with:

~~~js
export function validateAssetsShape(assets, schema);
export async function loadAssetsFoundation({
  repoRoot,
  dataPath = "data/foundations/assets.yaml",
  schemaPath = "schemas/assets.schema.json",
});
~~~

Reuse `readStrictYaml`, `validateDocumentShape` and existing diagnostic conventions. `loadAssetsFoundation` reads YAML and schema, calls `validateAssetsShape`, and throws `AggregateError` when shape errors exist. Do not add semantic validation or resolver behavior yet.

- [ ] **Step 6: Make characterization test compare structured facts**

Replace the file-existence assertion from Task 1 with exact checks that the parsed YAML exposes all canonical IDs and baseline values. Keep Markdown anchor checks. This proves coexistence in shadow mode without treating prose as executable data.

- [ ] **Step 7: Run cloud CI to GREEN and commit**

Commit message:

~~~text
feat: add shadow assets foundation shape contract
~~~

Expected: schema, shape and characterization tests pass; semantic and resolver tests do not exist yet.

### Task 3: Implement semantic validation and exact-only resolution

**Files:**
- Modify: `scripts/lib/assets-foundation.mjs`
- Modify: `tests/foundation/assets-foundation.test.mjs`

**Interfaces:**
- Consumes: `validateAssetsShape` and `loadAssetsFoundation` from Task 2.
- Produces: `validateAssetsSemantics`, `resolveAssetContract` and `validateAssetsFoundation` with the signatures in “Public Module Contract”.

- [ ] **Step 1: Add failing semantic tests**

Cover one test per diagnostic:

- duplicate ID within any definition group → `ASSETS_DUPLICATE_ID`;
- compatibility references unknown ID → `ASSETS_UNKNOWN_REFERENCE`;
- missing compatibility entry for an export profile → `ASSETS_PROFILE_COMPATIBILITY_MISSING`;
- `jpeg-2x` allowing non-`none` alpha → `ASSETS_INCOMPATIBLE_ALPHA`;
- `neutralize-presentation-only` allowed for `image-fill` → `ASSETS_INCOMPATIBLE_CLIPPING`;
- scale 2 with suffix other than `@2x`, or scale 4 with suffix other than `@4x` → `ASSETS_SCALE_SUFFIX_MISMATCH`;
- JPEG base quality other than 82 or escalation other than 90/visible-artifacts-only → `ASSETS_INVALID_JPEG_QUALITY`;
- forbidden build field detected defensively after schema bypass → `ASSETS_BUILD_CHOICE_FORBIDDEN`.

Assert full ordered `code` arrays so sort order is stable.

- [ ] **Step 2: Add failing resolver tests**

Exact valid resolutions:

1. `image-fill + direct-image + jpeg-2x + none + preserve-artwork`;
2. `rendered-node + direct-image + jpeg-2x + none + neutralize-presentation-only`;
3. `rendered-node + direct-image + png-4x + transparent + preserve-artwork`;
4. `rendered-node + direct-image + png-4x + opaque + preserve-artwork`;
5. `image-fill + fill-image + jpeg-2x + none + preserve-artwork`.

Invalid cases:

- missing any one argument;
- unknown ID;
- alpha outside profile compatibility;
- presentation-only clipping with `image-fill`.

Every invalid contract must fail; resolver must not substitute defaults.

Import the existing module as a namespace so the RED failure identifies the missing exports instead of failing module resolution:

~~~js
import * as assetsFoundation from "../../scripts/lib/assets-foundation.mjs";
~~~

- [ ] **Step 3: Commit and verify RED**

Commit message:

~~~text
test: specify assets semantic and resolver contracts
~~~

Run GitHub Actions. Expected failure: calls to the not-yet-exported `validateAssetsSemantics` or `resolveAssetContract` fail. Existing shape tests must remain green.

- [ ] **Step 4: Implement semantic validation**

Add `validateAssetsSemantics(assets)` and `validateAssetsFoundation({ repoRoot, dataPath, schemaPath })`.

Build ID maps once, validate duplicates before references, then compatibility and profile invariants. Reuse `SystemValidationError` and sort diagnostics by path/code/message exactly like existing foundations. `validateAssetsFoundation` calls the existing loader, returns shape/read errors consistently, and adds semantic errors only after a valid shape load.

- [ ] **Step 5: Implement the resolver**

Add `resolveAssetContract(assets, selection)`. First reject a semantically invalid foundation. Then require all five explicit IDs, resolve them from maps, locate the export-profile compatibility row, and validate the combination. Return deep copies via `structuredClone`.

Do not infer:

- profile from filename;
- source mode from Figma node type;
- display mode from component name;
- alpha from PNG;
- clipping from visual appearance.

Those are component-contract choices made before resolver invocation.

- [ ] **Step 6: Run cloud CI to GREEN and commit**

Commit message:

~~~text
feat: validate and resolve assets contracts
~~~

### Task 4: Prove the boundary between foundation and component contracts

**Files:**
- Modify: `tests/characterization/assets-shadow.test.mjs`
- Modify: `tests/foundation/assets-foundation.test.mjs`
- Reference only: `registry/email-component-descriptions-registry.md`

- [ ] **Step 1: Add representative component characterization**

Read the registry and assert these examples remain component-owned:

| Component | Component-owned fact to retain |
|---|---|
| `Banner/Hero` | concrete IMAGE FILL owner/boundary and display behavior |
| `Banner/Secondary` | Mobile proportional image vs Desktop wrapper crop behavior |
| `Asset/Card-Image` | rendered composite includes numbered badge; 232×148 display / 464×296 JPEG |
| `Asset/Feature-Icon` | exact node includes circular background and glyph; transparent outside |
| `Email/Header` | protective background is part of logo export boundary |
| `Banner/App-Download` | logo/store/QR have distinct exact boundaries |

Use targeted regex/section extraction. Do not hash the full registry.

- [ ] **Step 2: Assert those facts are absent from foundation**

Recursively collect keys and scalar strings from `assets.yaml`. Assert it does not contain component IDs, `232`, `148`, `464`, `296`, header-logo IDs, QR IDs, or concrete Figma node IDs.

- [ ] **Step 3: Assert global rules exist only as definitions**

Verify the foundation contains the generic ability to express the examples: source modes, display modes, alpha modes, clipping policies and export profiles. It must not pre-resolve any component.

- [ ] **Step 4: Run cloud CI to GREEN and commit**

Commit message:

~~~text
test: protect assets foundation ownership boundaries
~~~

### Task 5: Register the shadow foundation in the manifest

**Files:**
- Modify: `system/manifest.yaml`
- Modify: `scripts/lib/system-manifest.mjs`
- Modify: `tests/foundation/system-manifest.test.mjs`
- Modify: `tests/foundation/validator-cli.test.mjs`
- Modify: `tests/helpers/system-fixture.mjs`

- [ ] **Step 1: Add failing manifest tests**

Assert:

- sources include `assets-foundation` at `data/foundations/assets.yaml` with kind `registry`;
- sources include `assets-schema` at `schemas/assets.schema.json` with kind `schema`;
- neither ID appears in any `bundle_profiles[*].source_ids`;
- missing/wrong-kind assets source yields `missing-assets-source` or `invalid-assets-source-kind`;
- missing/wrong-kind schema yields `missing-assets-schema-source` or `invalid-assets-source-kind`;
- a semantic assets error makes validator CLI exit 1 and prints its stable diagnostic;
- valid fixture makes CLI exit 0.

- [ ] **Step 2: Update fixture helper**

Every synthetic valid repository must now copy/write the canonical assets YAML and schema because manifest validation will require them. Keep fixture setup centralized in `tests/helpers/system-fixture.mjs`.

- [ ] **Step 3: Add manifest sources only**

Append:

~~~yaml
  - { id: assets-foundation, kind: registry, path: data/foundations/assets.yaml }
  - { id: assets-schema, kind: schema, path: schemas/assets.schema.json }
~~~

Do not edit any `bundle_profiles`.

- [ ] **Step 4: Integrate assets validation**

Add `resolveAssetsSources(manifest)` parallel to typography and spacing. Import `validateAssetsFoundation`. Include assets prerequisite diagnostics, then run all three foundation validators with `Promise.all`.

Return a single sorted diagnostic list. Do not add an assets route or bundle.

- [ ] **Step 5: Run cloud CI to GREEN and commit**

Commit message:

~~~text
feat: register shadow assets foundation
~~~

### Task 6: Document the shadow source without changing runtime guidance

**Files:**
- Modify: `README.md`
- Reference only: `docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md`

- [ ] **Step 1: Add one repository-map entry**

Document `data/foundations/assets.yaml` as:

> структурированный shadow-источник общих asset/export definitions; до generated bundles не является отдельной инструкцией для HTML-сборки.

Link the schema and this implementation plan. Do not copy export rules into README.

- [ ] **Step 2: State the ownership boundary**

One concise note:

- foundation owns common definitions and compatibility;
- component registry owns concrete asset choices and dimensions;
- current Markdown prompt remains active comparison baseline until cutover.

- [ ] **Step 3: Run cloud CI to GREEN and commit**

Commit message:

~~~text
docs: map the assets foundation shadow source
~~~

### Task 7: Final verification and review handoff

**Files:**
- Verify all files changed in Tasks 1–6
- Do not modify roadmap completion status in this implementation PR

- [ ] **Step 1: Inspect allowed diff**

Compare implementation branch to pinned `main`. Allowed paths only:

~~~text
README.md
docs/superpowers/plans/2026-08-26-cupis-assets-foundation.md
data/foundations/assets.yaml
schemas/assets.schema.json
scripts/lib/assets-foundation.mjs
scripts/lib/system-manifest.mjs
system/manifest.yaml
tests/characterization/assets-shadow.test.mjs
tests/foundation/assets-foundation.test.mjs
tests/foundation/system-manifest.test.mjs
tests/foundation/validator-cli.test.mjs
tests/helpers/system-fixture.mjs
~~~

Any other changed path is a blocker until explained and separately approved.

- [ ] **Step 2: Run complete GitHub Actions verification**

Use the repository's existing workflow without changing CI configuration.

Required `node-validation` job steps:

~~~text
npm ci --ignore-scripts
npm run validate
npm test
~~~

Required `windows-bootstrap` job steps:

~~~text
npm ci --ignore-scripts
pwsh -NoProfile -File bootstrap/verify.ps1
pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1
~~~

Expected:

- `node-validation` passes and the validator reports `[PASS] CUPIS system validation passed.`;
- `windows-bootstrap` passes;
- no test is skipped or marked todo;
- no working bundle contains `assets-foundation` or `assets-schema`;
- `npm run verify` is not claimed as a separate CI step: its validation and test behavior is already covered by `npm run validate` plus `npm test`.

- [ ] **Step 3: Review architecture invariants**

Confirm in PR summary:

1. structured source is shadow-only;
2. old Markdown source is untouched;
3. component-specific choices remain in registry;
4. resolver is exact-only;
5. Figma, HTML and images were untouched;
6. no bundle/runtime cutover occurred.

- [ ] **Step 4: Request review; do not merge**

Leave PR draft or mark ready only after all checks pass. Ask the user for explicit merge authorization.

### Task 8: Post-merge roadmap update in a separate change

**Files:**
- Modify after implementation merge only: `docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md`

- [ ] **Step 1: Re-read current `main` and plans folder**

Verify the implementation PR is actually merged and all 5А files are present on `main`.

- [ ] **Step 2: Mark 5А complete**

Check every completed 5А item, retain the permanent constraints, and add links to this plan and the merged implementation PR.

- [ ] **Step 3: Set the next stage**

Declare 5Б Figma naming foundation as the next stage. Do not begin it until its separate implementation plan is reviewed.

- [ ] **Step 4: Open a small roadmap-only PR**

Run validation/CI, request explicit merge authorization, and merge only after approval.
