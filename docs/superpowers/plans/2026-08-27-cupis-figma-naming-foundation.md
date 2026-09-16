# CUPIS Figma Naming Foundation Implementation Plan

> **Исторический implementation plan.** Реализован в [PR #37](https://github.com/flabenar-maker/e-mail/pull/37). Команды, пути и чекбоксы ниже описывают выполнение того этапа, а не текущий рабочий маршрут: старый контур находится в Legacy/, маршруты остановлены, проверки теперь локальные. Для продолжения использовать свежие manifest и [roadmap](2026-08-25-cupis-migration-roadmap.md).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перенести универсальные правила нейминга Figma в строгий shadow-foundation и создать независимые generator и validator, которые помогают maintenance skill безопасно предлагать имена без автоматического аудита или изменения Figma.

**Architecture:** `data/foundations/figma-naming.yaml` владеет машинно-читаемыми naming definitions. `figma-naming-foundation.mjs` загружает и проверяет эти definitions, `figma-name-generator.mjs` детерминированно формирует рекомендацию из явно подтверждённой семантики, а `figma-name-validator.mjs` отдельно проверяет существующее или предлагаемое имя. Foundation объявляется в manifest как shadow-source и не добавляется в рабочие bundles; Figma mutation и подключение maintenance skill выполняются на более поздних этапах.

**Tech Stack:** Node.js 24, ESM, YAML 2.9, Ajv 8, встроенный `node:test`, GitHub Contents API, GitHub Actions.

**Spec:** [CUPIS structured email system design](../specs/2026-08-24-cupis-structured-email-system-design.md), раздел 5.1; текущий этап — [migration roadmap, 5Б](2026-08-25-cupis-migration-roadmap.md).

## Global Constraints

- Работать только через облачный GitHub: отдельная branch, draft PR и GitHub Actions. Локальный checkout и локальную копию системы не использовать.
- Перед первым техническим изменением закрепить актуальный SHA `main`. Implementation branch должна начинаться от commit, в котором уже слиты архитектурное уточнение и этот plan.
- Не менять Figma, component contracts, descriptions, registry, `core/figma-component-naming-standard.md`, `core/email-figma-prompt.md`, готовые письма или assets.
- Не добавлять figma-naming foundation ни в один `bundle_profiles[*].source_ids`. До generated context bundles это только shadow-source.
- Generator не читает Figma, не выполняет rename, не выбирает семантическую функцию объекта и не содержит копии naming rules.
- Validator проверяет только переданный candidate. Он не сканирует library roots и не запускает полный naming audit.
- При недоказанной семантике generator возвращает typed blocker `semantic-role-required`. Fallback, guessed namespace и guessed semantic tokens запрещены.
- Обычный asset rename обязан сохранять действующий `@2x` или `@4x`. Generator не принимает изменение scale как часть обычного naming request.
- Foundation не содержит component IDs, Figma node IDs, текущих component names, descriptions, geometry, bindings или rename maps.
- Любая diagnostic имеет стабильные `code`, `path` и `message`; массив diagnostics сортируется по `path → code → message`.
- Каждый RED и GREEN подтверждается GitHub Actions. Merge выполняется только после отдельного разрешения пользователя.

## File Map

Создать:

- `data/foundations/figma-naming.yaml` — универсальные naming definitions и provenance;
- `schemas/figma-naming.schema.json` — строгая JSON Schema без неизвестных полей;
- `scripts/lib/figma-naming-foundation.mjs` — shape/semantic validation и loader;
- `scripts/lib/figma-name-generator.mjs` — чистая детерминированная генерация рекомендаций;
- `scripts/lib/figma-name-validator.mjs` — проверка одного явно переданного candidate;
- `tests/foundation/figma-naming-foundation.test.mjs`;
- `tests/foundation/figma-name-generator.test.mjs`;
- `tests/foundation/figma-name-validator.test.mjs`;
- `tests/characterization/figma-naming-shadow.test.mjs`.

Изменить:

- `system/manifest.yaml` — объявить foundation и schema как shadow sources;
- `scripts/lib/system-manifest.mjs` — разрешать и валидировать новые sources;
- `tests/helpers/system-fixture.mjs` — включить foundation и schema в canonical fixture;
- `tests/foundation/system-manifest.test.mjs` — проверить shadow-регистрацию и ошибки source wiring;
- `tests/foundation/validator-cli.test.mjs` — проверить sanitized CLI diagnostic;
- `tests/characterization/foundation-preserved-files.test.mjs` — закрепить blobs файлов, которые этап обязан сохранить;
- `README.md` — описать назначение нового shadow-foundation без изменения рабочих режимов.

Не изменять в implementation PR:

- `core/figma-component-naming-standard.md`;
- `registry/**`;
- `workflows/**`;
- `.agents/skills/**`;
- `bundle_profiles[*].source_ids`;
- любые Figma nodes.

## Canonical Data Contract

`data/foundations/figma-naming.yaml` использует `schema_version: 1.0.0` и содержит следующие root groups:

| Group | Responsibility |
|---|---|
| `foundation` | ID `figma-naming`, status `shadow`, language `English` |
| `object_kinds` | Поддерживаемые категории candidate: component, layer, property, asset-owner, page, section, example |
| `component_names` | Separator `/`, slash count `1`, Title-Kebab и approved abbreviations |
| `namespaces` | Email, Banner, Block, Card, Item, Button, Badge, Details, NPS, Icon, Asset |
| `variant_axes` | Viewport, Layout, Style, State, Count, Context в утверждённом порядке |
| `property_names` | Boolean `Show <Role>`, text roles, instance-swap roles и Title Case |
| `layer_names` | lower-kebab-case, controlled roles, qualifier и two-digit repeater forms |
| `asset_owners` | `@2x`/`@4x`, suffix-at-end, filename basename mapping и запреты |
| `organizational_names` | Page, Section, `Email/Template`, `Content` Slot и Example pattern |
| `provenance` | Comparison sources и baseline commit |

Точные controlled definitions:

~~~yaml
component_names:
  separator: "/"
  slash_count: 1
  segment_case: title-kebab
  approved_abbreviations: [NPS, QR, VK]

namespaces:
  - { id: email, label: Email }
  - { id: banner, label: Banner }
  - { id: block, label: Block }
  - { id: card, label: Card }
  - { id: item, label: Item }
  - { id: button, label: Button }
  - { id: badge, label: Badge }
  - { id: details, label: Details }
  - { id: nps, label: NPS }
  - { id: icon, label: Icon }
  - { id: asset, label: Asset }

variant_axes:
  - { id: viewport, label: Viewport, order: 1, values: [Mobile, Desktop] }
  - { id: layout, label: Layout, order: 2 }
  - { id: style, label: Style, order: 3 }
  - { id: state, label: State, order: 4 }
  - { id: count, label: Count, order: 5 }
  - { id: context, label: Context, order: 6 }

layer_names:
  case: lower-kebab
  controlled_roles:
    - image-area
    - content-area
    - text-content
    - heading
    - body
    - caption
    - supporting-text
    - label
    - link
    - actions
    - cards
    - items
    - steps
    - bullets
    - rows
    - divider
    - social-links
    - background
    - glyph
    - artwork
  extension_forms: [role, role-qualifier, role-two-digit-index]
  repeater_index:
    digits: 2
    starts_at: 1
~~~

`asset_owners.scale_suffixes` содержит ровно:

~~~yaml
- { scale: 2, suffix: "@2x" }
- { scale: 4, suffix: "@4x" }
~~~

Foundation также хранит запрещённые generic/default patterns и запрещённые semantic categories, достаточные для validator: default Figma names, `Wrapper`/`Container`, viewport words в обычных layer/asset names, расширения файлов, HTML tags, цвета, размеры, padding, gap и позиции. Конкретные legacy names и карта миграции в foundation не входят.

## Public Module Contracts

### Foundation

`scripts/lib/figma-naming-foundation.mjs` экспортирует:

~~~js
export function validateFigmaNamingShape(naming, schema);
export async function loadFigmaNamingFoundation({
  repoRoot,
  dataPath = "data/foundations/figma-naming.yaml",
  schemaPath = "schemas/figma-naming.schema.json",
});
export function validateFigmaNamingSemantics(naming);
export async function validateFigmaNamingFoundation({
  repoRoot,
  dataPath = "data/foundations/figma-naming.yaml",
  schemaPath = "schemas/figma-naming.schema.json",
});
~~~

Stable foundation diagnostics:

- `figma-naming-version-unsupported`;
- `figma-naming-schema`;
- `figma-naming-read`;
- `FIGMA_NAMING_DUPLICATE_ID`;
- `FIGMA_NAMING_DUPLICATE_LABEL`;
- `FIGMA_NAMING_AXIS_ORDER_INVALID`;
- `FIGMA_NAMING_SCALE_SUFFIX_MISMATCH`;
- `FIGMA_NAMING_UNKNOWN_REFERENCE`;
- `FIGMA_NAMING_CONCRETE_RECORD_FORBIDDEN`.

### Generator

`scripts/lib/figma-name-generator.mjs` экспортирует:

~~~js
export function generateFigmaName(naming, request);
~~~

Поддерживаемые request shapes:

~~~js
{ objectKind: "component", namespaceId, semanticTokens }
{ objectKind: "layer", roleId, qualifierTokens, repeatIndex }
{ objectKind: "property", propertyKind, roleTokens, axisId }
{ objectKind: "asset-owner", semanticTokens, currentScale }
{ objectKind: "page", semanticTokens }
{ objectKind: "section", semanticTokens }
{
  objectKind: "example",
  familyTokens,
  semanticTokens,
  viewportValue,
}
~~~

Ненужные полю candidate поля отсутствуют, а не получают defaults. `semanticTokens`, `roleTokens` и `qualifierTokens` — уже подтверждённые английские semantic tokens без visual/layout guesses.

Успешный результат:

~~~js
{
  status: "generated",
  object_kind: "component",
  name: "Block/Cards-Icons",
  applied_rule_ids: [
    "component-pattern",
    "namespace-block",
    "title-kebab",
  ],
}
~~~

Недостаточный вход:

~~~js
{
  status: "blocked",
  error: new SystemValidationError(
    "semantic-role-required",
    "/request/semanticTokens",
    "Confirmed semantic tokens are required before generating a name.",
  ),
}
~~~

Generator не возвращает несколько вариантов. Неоднозначность решается до его вызова пользователем и maintenance workflow.

### Validator

`scripts/lib/figma-name-validator.mjs` экспортирует:

~~~js
export function validateFigmaName(
  naming,
  {
    objectKind,
    name,
    namespaceId,
    propertyKind,
    expectedScale,
  },
);
~~~

Validator возвращает отсортированный массив `SystemValidationError` и не читает Figma. Stable candidate diagnostics:

- `FIGMA_NAME_UNKNOWN_OBJECT_KIND`;
- `FIGMA_NAME_COMPONENT_PATTERN`;
- `FIGMA_NAME_UNKNOWN_NAMESPACE`;
- `FIGMA_NAME_CASE`;
- `FIGMA_NAME_GENERIC`;
- `FIGMA_NAME_PROPERTY_PATTERN`;
- `FIGMA_NAME_REPEATER_INDEX`;
- `FIGMA_NAME_SCALE_SUFFIX_REQUIRED`;
- `FIGMA_NAME_SCALE_SUFFIX_MISMATCH`;
- `FIGMA_NAME_SUFFIX_POSITION`;
- `FIGMA_NAME_EXTENSION_FORBIDDEN`;
- `FIGMA_NAME_VIEWPORT_WORD_FORBIDDEN`.

---

### Task 1: Freeze the approved naming baseline

**Files:**
- Create: `tests/characterization/figma-naming-shadow.test.mjs`
- Reference only: `core/figma-component-naming-standard.md`
- Reference only: `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`

**Interfaces:**
- Consumes: действующий Markdown naming standard и одобренный раздел 5.1 master-spec.
- Produces: characterization assertions, которые следующие tasks должны удовлетворить structured data.

- [ ] **Step 1: Create the failing characterization test**

Проверить anchors `COMPONENT_PATTERN`, `Show <Role>`, полный список namespaces, полный controlled layer vocabulary, порядок variant axes, `@2x | @4x`, `Email/Template`, `Example · <Family>` и `old → new`. Затем попытаться прочитать ещё не существующий `data/foundations/figma-naming.yaml`.

~~~js
test("figma naming shadow preserves the approved universal rules", async () => {
  const standard = await readFile(
    join(repoRoot, "core/figma-component-naming-standard.md"),
    "utf8",
  );
  for (const anchor of [
    "COMPONENT_PATTERN = <Namespace>/<Semantic-Name>",
    "BOOLEAN_PROPERTY_PATTERN = Show <Role>",
    "ASSET_SCALE_SUFFIX = @2x | @4x",
    "Email/Template",
    "Example · <Family> · <Semantic-Name> · <Viewport>",
  ]) {
    assert.match(standard, new RegExp(escapeRegExp(anchor), "u"));
  }

  const naming = await readStrictYaml(
    join(repoRoot, "data/foundations/figma-naming.yaml"),
  );
  assert.equal(naming.foundation.id, "figma-naming");
  assert.equal(naming.foundation.status, "shadow");
});
~~~

- [ ] **Step 2: Push RED commit and verify GitHub Actions fails**

Expected failure: missing `data/foundations/figma-naming.yaml`.

- [ ] **Step 3: Commit**

~~~text
test: freeze Figma naming comparison baseline
~~~

### Task 2: Add the strict foundation data and loader

**Files:**
- Create: `data/foundations/figma-naming.yaml`
- Create: `schemas/figma-naming.schema.json`
- Create: `scripts/lib/figma-naming-foundation.mjs`
- Create: `tests/foundation/figma-naming-foundation.test.mjs`

**Interfaces:**
- Consumes: Canonical Data Contract above, `readStrictYaml`, `validateDocumentShape` and `SystemValidationError`.
- Produces: the four Foundation exports and canonical in-memory naming definitions.

- [ ] **Step 1: Write failing shape and semantic tests**

Tests must cover: canonical load, unknown root/nested fields, unsupported version, duplicate namespace ID/label, duplicate layer role, broken axis order, mismatched scale/suffix, unknown references and forbidden concrete fields such as `component_id`, `node_id`, `description`, `width`, `height` and `rename_map`.

~~~js
test("canonical Figma naming foundation is strict and semantic-valid", async () => {
  const naming = await loadFigmaNamingFoundation({ repoRoot });
  assert.equal(naming.foundation.id, "figma-naming");
  assert.deepEqual(validateFigmaNamingSemantics(naming), []);
});

test("rejects a duplicate namespace label", async () => {
  const naming = await canonicalNaming();
  naming.namespaces[1].label = naming.namespaces[0].label;
  assert.ok(
    validateFigmaNamingSemantics(naming).some(
      (error) => error.code === "FIGMA_NAMING_DUPLICATE_LABEL",
    ),
  );
});
~~~

- [ ] **Step 2: Push RED commit and verify the focused tests fail**

Run in GitHub Actions:

~~~text
node --test tests/foundation/figma-naming-foundation.test.mjs
~~~

Expected failure: missing module/data/schema.

- [ ] **Step 3: Implement the YAML and strict JSON Schema**

Use JSON Schema draft 2020-12, `additionalProperties: false` at every object level, exact enums for stable IDs, non-empty arrays and repository-relative provenance paths. YAML anchors, aliases and merge keys remain forbidden through `readStrictYaml`.

- [ ] **Step 4: Implement shape loading and semantic validation**

Follow existing foundation modules: deterministic sorting, `AggregateError` for shape failures and sanitized `figma-naming-read` on unreadable input. Semantic validation must reject concrete component data recursively.

- [ ] **Step 5: Run the focused test and the characterization test**

~~~text
node --test tests/foundation/figma-naming-foundation.test.mjs tests/characterization/figma-naming-shadow.test.mjs
~~~

Expected: PASS.

- [ ] **Step 6: Commit**

~~~text
feat: add structured Figma naming foundation
~~~

### Task 3: Implement the scoped candidate validator

**Files:**
- Create: `scripts/lib/figma-name-validator.mjs`
- Create: `tests/foundation/figma-name-validator.test.mjs`

**Interfaces:**
- Consumes: validated naming object from Task 2 and one explicit candidate object.
- Produces: `validateFigmaName(naming, candidate)` and stable sorted diagnostics.

- [ ] **Step 1: Write failing validator tests**

Cover valid component, layer, boolean property and asset owner names. Cover unknown namespace, extra slash, wrong case, generic Figma name, invalid repeater index, file extension, viewport word and scale mismatch.

~~~js
test("validator checks one explicit candidate without scanning Figma", async () => {
  const naming = await loadFigmaNamingFoundation({ repoRoot });

  assert.deepEqual(
    validateFigmaName(naming, {
      objectKind: "component",
      name: "Block/Cards-Icons",
      namespaceId: "block",
    }),
    [],
  );

  const errors = validateFigmaName(naming, {
    objectKind: "asset-owner",
    name: "feature-image @2x",
    expectedScale: 4,
  });
  assert.deepEqual(errors.map((error) => error.code), [
    "FIGMA_NAME_SCALE_SUFFIX_MISMATCH",
  ]);
});
~~~

- [ ] **Step 2: Push RED commit and verify the focused test fails**

Expected failure: missing `figma-name-validator.mjs`.

- [ ] **Step 3: Implement candidate-only validation**

The module must be pure: no filesystem, network, Figma MCP or mutation imports. Every rule comes from the passed foundation. It must not iterate repository files or infer expected semantic roles.

- [ ] **Step 4: Run focused tests**

~~~text
node --test tests/foundation/figma-name-validator.test.mjs
~~~

Expected: PASS.

- [ ] **Step 5: Commit**

~~~text
feat: add scoped Figma name validator
~~~

### Task 4: Implement the controlled name generator

**Files:**
- Create: `scripts/lib/figma-name-generator.mjs`
- Create: `tests/foundation/figma-name-generator.test.mjs`

**Interfaces:**
- Consumes: validated naming object and one request matching Public Module Contracts.
- Produces: one `generated` result or one `blocked` result; never Figma side effects.

- [ ] **Step 1: Write failing generator tests**

Cover components, controlled layers, qualified/indexed layers, Boolean/Text/Instance properties, asset owners, page, section and example. Cover missing semantic tokens, unknown namespace, unsupported scale and attempts to change `currentScale` indirectly.

~~~js
test("generator uses confirmed semantics and preserves asset scale", async () => {
  const naming = await loadFigmaNamingFoundation({ repoRoot });

  assert.deepEqual(
    generateFigmaName(naming, {
      objectKind: "component",
      namespaceId: "block",
      semanticTokens: ["cards", "icons"],
    }),
    {
      status: "generated",
      object_kind: "component",
      name: "Block/Cards-Icons",
      applied_rule_ids: [
        "component-pattern",
        "namespace-block",
        "title-kebab",
      ],
    },
  );

  assert.equal(
    generateFigmaName(naming, {
      objectKind: "asset-owner",
      semanticTokens: ["feature", "image"],
      currentScale: 4,
    }).name,
    "feature-image @4x",
  );
});
~~~

Typed blocker test:

~~~js
test("generator blocks instead of guessing missing semantics", async () => {
  const naming = await loadFigmaNamingFoundation({ repoRoot });
  const result = generateFigmaName(naming, {
    objectKind: "component",
    namespaceId: "block",
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.error.code, "semantic-role-required");
  assert.equal(result.error.path, "/request/semanticTokens");
});
~~~

- [ ] **Step 2: Push RED commit and verify the focused test fails**

Expected failure: missing `figma-name-generator.mjs`.

- [ ] **Step 3: Implement deterministic generation**

Generation consists only of token normalization permitted by foundation, pattern composition and an internal call to `validateFigmaName` for the final candidate. If final validation fails, return `blocked` with the first sorted diagnostic; do not emit a partially valid name or alternatives.

- [ ] **Step 4: Prove the module has no I/O or mutation**

Add a source-boundary test that rejects imports from `node:fs`, `node:child_process`, network modules, Figma modules and GitHub modules in generator/validator source text.

- [ ] **Step 5: Run generator and validator tests**

~~~text
node --test tests/foundation/figma-name-generator.test.mjs tests/foundation/figma-name-validator.test.mjs
~~~

Expected: PASS.

- [ ] **Step 6: Commit**

~~~text
feat: add controlled Figma name generator
~~~

### Task 5: Register and validate the shadow sources

**Files:**
- Modify: `system/manifest.yaml`
- Modify: `scripts/lib/system-manifest.mjs`
- Modify: `tests/helpers/system-fixture.mjs`
- Modify: `tests/foundation/system-manifest.test.mjs`
- Modify: `tests/foundation/validator-cli.test.mjs`

**Interfaces:**
- Consumes: `validateFigmaNamingFoundation` from Task 2.
- Produces: complete system validation for two new declared sources.

- [ ] **Step 1: Write failing manifest tests**

Expected declarations:

~~~yaml
- { id: figma-naming-foundation, kind: registry, path: data/foundations/figma-naming.yaml }
- { id: figma-naming-schema, kind: schema, path: schemas/figma-naming.schema.json }
~~~

Assert both IDs are absent from every bundle profile. Add missing-source and wrong-kind cases using codes:

- `missing-figma-naming-source`;
- `missing-figma-naming-schema-source`;
- `invalid-figma-naming-source-kind`.

- [ ] **Step 2: Add both files to canonicalSystemFixtureFiles**

Append schema before data, following existing foundation ordering.

- [ ] **Step 3: Push RED commit and verify focused manifest tests fail**

~~~text
node --test tests/foundation/system-manifest.test.mjs tests/foundation/validator-cli.test.mjs
~~~

Expected failure: missing declarations/resolver integration.

- [ ] **Step 4: Add manifest sources without changing bundles**

Do not modify `routes` or `bundle_profiles`.

- [ ] **Step 5: Integrate validation into validateSystem**

Add `resolveFigmaNamingSources(manifest)`, import `validateFigmaNamingFoundation` and include its errors in the existing deterministic aggregate. Validate all foundations in the existing `Promise.all`.

- [ ] **Step 6: Add sanitized CLI failure test**

Corrupt a copied `figma-naming.yaml` with duplicate IDs plus a secret scalar; assert exit code `1`, diagnostic `FIGMA_NAMING_DUPLICATE_ID` and absence of the secret in stdout/stderr.

- [ ] **Step 7: Run focused tests**

~~~text
node --test tests/foundation/system-manifest.test.mjs tests/foundation/validator-cli.test.mjs
~~~

Expected: PASS.

- [ ] **Step 8: Commit**

~~~text
feat: register Figma naming shadow foundation
~~~

### Task 6: Prove foundation boundaries and preserved sources

**Files:**
- Modify: `tests/characterization/figma-naming-shadow.test.mjs`
- Modify: `tests/characterization/foundation-preserved-files.test.mjs`

**Interfaces:**
- Consumes: complete foundation and canonical legacy sources.
- Produces: regression protection against component data, automatic migration and unrelated edits.

- [ ] **Step 1: Add boundary assertions**

Recursively collect keys and scalar values from YAML. Assert absence of:

- current component names such as `Banner/Hero`, `Banner/Secondary` and `Block/Cards-Icons`;
- any `^[0-9]+:[0-9]+$` Figma node ID;
- keys `component_id`, `node_id`, `description`, `width`, `height`, `rename_map`, `figma_write` and `auto_migrate`;
- concrete maps `old → new`.

Also assert the full namespace list, layer vocabulary, variant axis order and exact scale suffix list.

- [ ] **Step 2: Refresh only approved preserved hashes**

Use the implementation base commit to calculate expected Git blob hashes. Preserve `core/figma-component-naming-standard.md`, both registries, both workflows, skill files and email prompt exactly. Do not alter a protected source merely to make its hash pass.

- [ ] **Step 3: Run characterization tests**

~~~text
node --test tests/characterization/*.test.mjs
~~~

Expected: PASS.

- [ ] **Step 4: Commit**

~~~text
test: protect Figma naming foundation boundaries
~~~

### Task 7: Document the shadow source and verify the implementation

**Files:**
- Modify: `README.md`
- Reference only: every file changed by Tasks 1–6

**Interfaces:**
- Consumes: implemented shadow foundation.
- Produces: user-facing ownership explanation and verified draft PR.

- [ ] **Step 1: Add a concise README section**

State:

- definitions, generator and validator are separate modules;
- generator receives confirmed semantics and only proposes one name;
- validator checks one explicit candidate;
- maintenance skill activation comes later;
- foundation is absent from working bundles and does not authorize Figma rename.

Add the new data, schema and three module paths to the responsibility table.

- [ ] **Step 2: Run complete verification**

~~~text
npm run verify
~~~

Expected stdout includes `[PASS] CUPIS system validation passed.` and all tests pass.

- [ ] **Step 3: Verify the allowed path diff**

Allowed implementation paths are exactly those in File Map plus this plan if its formatting is corrected during execution. Reject changes under `core/`, `registry/`, `workflows/`, `.agents/skills/` and any local email output.

- [ ] **Step 4: Verify shadow isolation**

Assert:

~~~js
for (const profile of manifest.bundle_profiles) {
  assert.equal(
    profile.source_ids.includes("figma-naming-foundation"),
    false,
  );
  assert.equal(
    profile.source_ids.includes("figma-naming-schema"),
    false,
  );
}
~~~

- [ ] **Step 5: Re-read all new sources from the final branch**

Confirm schema version, diagnostic codes, exported function names and `@2x`/`@4x` values exactly match this plan.

- [ ] **Step 6: Commit**

~~~text
docs: document Figma naming shadow foundation
~~~

- [ ] **Step 7: Request code review and keep the PR unmerged**

Do not mark roadmap stage 5Б complete and do not merge without a separate user command.

### Task 8: Update migration status after merge

**Files:**
- Modify in a separate post-merge branch: `docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md`
- Optional only on direct user request: `docs/superpowers/plans/cupis-active-work-context.md`

**Interfaces:**
- Consumes: merged implementation PR SHA and URL.
- Produces: factual stage status.

- [ ] **Step 1: Pin fresh main and verify all 5Б artifacts are merged**

Required artifacts: YAML, schema, three modules, foundation tests, generator tests, validator tests, characterization, manifest wiring and README.

- [ ] **Step 2: Mark 5Б complete and record the implementation PR**

Also mark общий этап 5 complete only if 5А and 5Б are both present in `main` and verification confirms no Figma/component-contract changes.

- [ ] **Step 3: Leave active-work-context unchanged unless the user explicitly requests its refresh**

- [ ] **Step 4: Open a separate draft PR and wait for merge authorization**

## Self-Review Checklist

Before publishing this plan:

- Every requirement in master-spec section 5.1 maps to a task.
- Generator, validator and foundation have separate files and interfaces.
- No step authorizes Figma mutation, background audit or automatic rename.
- `semantic-role-required` is used consistently.
- `@2x` and `@4x` preservation is covered by data, generator and tests.
- Shadow sources are declared but absent from every working bundle.
- There are no unresolved placeholders, hidden defaults or component-specific exceptions.
- The final implementation can be rejected task-by-task without changing the architecture.
