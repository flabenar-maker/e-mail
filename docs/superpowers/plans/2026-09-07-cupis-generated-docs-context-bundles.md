# План реализации этапа 7 CUPIS: генерируемая документация и контекстные пакеты

> **Для выполнения агентом:** ОБЯЗАТЕЛЬНЫЙ НАВЫК: используйте `superpowers:subagent-driven-development` (рекомендуется) или `superpowers:executing-plans`, чтобы выполнять план последовательно по задачам. Для отслеживания используются чекбоксы (`- [ ]`).

**Цель:** Реализовать этап 7 миграции: детерминированно генерировать человекочитаемые справочники из структурированных источников и собирать по каждому route временный, минимальный и полностью разрешимый контекстный пакет без переключения действующих рабочие процессы и навыки.

**Архитектура:** `system/manifest.yaml` остаётся единственной картой системы. В существующих `bundle_profiles` сохраняется действующий `source_ids`, а рядом добавляется отдельная shadow-конфигурация будущего bundle; текущий навык поддержки библиотеки продолжает читать старый список и не меняет поведение. Генерируемая документация коммитятся в `docs/generated/`, но всегда пересобираются из `data/` и проверяются побайтово. Контекстный пакет строится только в памяти и выводится в стандартный вывод: он включает специальные для маршрута статические источники, только явно выбранные активные компоненты и их транзитивные зависимости, только необходимые viewport-контракты и замкнутый набор реально использованных определения основ.

**Технологии:** Node.js 24, ECMAScript modules (`.mjs`), YAML 2.9.0, AJV 8.20.0, JSON Schema Draft 2020-12, `node:test`, PowerShell bootstrap wrapper, GitHub Actions.

**Спецификация:** `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`, разделы 2, 3, 4, 6, 9, 10, 13–16.

## Общие ограничения

- Перед реализацией повторно закрепить актуальный `main`; этот план подготовлен по `main@90f1e01365c80b7553b520e8d47c2e5bb7f88660`.
- Этап остаётся shadow: не менять действующие `bundle_profiles[].source_ids`, `routes[].bundle_profile_id`, repo-scoped skill, Core, workflows или Figma.
- Не редактировать `registry/email-component-descriptions-registry.md` и `registry/email-typography-registry.md`; на этапе 7 они остаются comparison контрольным состоянием.
- Не включать старый Markdown-реестр компонентов или типографики в новый bundle одновременно со structured records.
- Не извлекать отдельные секции из монолитных Markdown-файлов по заголовкам. Сужение Core до отдельных файлов выполняется на этапе 8.
- Генерируемая документация являются представлением, а не источником истины. В каждом файле должен быть запрет ручного редактирования, версии входных schemas и детерминированный SHA-256 digest.
- Контекстный пакет не коммитится, не содержит timestamp и не пишет файлы. Одинаковый вход обязан давать побайтово одинаковый стандартный вывод.
- Выбор компонента допускается только по stable ID или полной Figma identity. Fuzzy name matching запрещён.
- Неактивный, неизвестный, неполный или неразрешимый компонент блокирует bundle с точным diagnostic; автоматическое продолжение запрещено.
- Mobile и Desktop не наследуются друг от друга. Для `email-new-build` bundle всегда требует оба viewport-контракта.
- Spacing для HTML не выдаётся как design-time «золотое правило». Если component contract ссылается на spacing definition, bundle включает только эту точную definition как зависимость контракта.
- Не добавлять чек-лист рабочего процесса в `docs/generated/` на этапе 7: workflows станут структурированными только на этапе 8.
- Не добавлять локальные письма, `email.html`, `images/`, Figma snapshots, отчёты или архивы.
- Каждый task завершается отдельным проверяемым commit. Слияние implementation PR выполняется только по отдельной команде пользователя.

---

## Целевая карта файлов

### Создать

- `scripts/lib/content-digest.mjs` — единая детерминированная canonical serialization и SHA-256 digest.
- `scripts/lib/generated-docs.mjs` — загрузка structured inputs, четыре Markdown-renderer и stale comparison.
- `scripts/generate-docs.mjs` — CLI `write/check` для `docs/generated/`.
- `scripts/lib/context-bundle.mjs` — route resolution, exact component selection, dependency closure и сборка bundle object.
- `scripts/build-context-bundle.mjs` — read-only CLI, печатающий один bundle в стандартный вывод.
- `docs/generated/component-registry.md` — полный читаемый каталог structured component records.
- `docs/generated/typography-registry.md` — типографика и вычисленные component consumers.
- `docs/generated/asset-registry.md` — общие asset definitions и component-specific consumers.
- `docs/generated/naming-reference.md` — читаемое представление naming foundation.
- `tests/generation/content-digest.test.mjs`
- `tests/generation/generated-docs.test.mjs`
- `tests/generation/generated-docs-cli.test.mjs`
- `tests/generation/context-bundle.test.mjs`
- `tests/generation/context-bundle-cli.test.mjs`
- `tests/characterization/generated-layer-shadow.test.mjs`

### Изменить

- `schemas/manifest.schema.json` — добавить optional capability-поля этапа 7 и поднять manifest schema до `1.1.0`.
- `system/manifest.yaml` — объявить generated outputs, shadow bundle policy и новые команды, сохранив действующие списки источников.
- `scripts/lib/system-manifest.mjs` — проверить новые manifest references и generated-doc equivalence.
- `scripts/validate-system.mjs` — сохранить один общий validation entrypoint.
- `tests/foundation/system-manifest.test.mjs` — shape/semantic tests новой capability.
- `tests/helpers/system-fixture.mjs` — добавить новые канонические входы и generated outputs в fixture.
- `package.json` — добавить `generate`, `generate:check` и `bundle`; расширить test glob каталогом `tests/generation`.
- `README.md` — объяснить generated docs, shadow bundles, команды и запрет ручного редактирования.

### Сохранить без изменений

- `core/**`
- `workflows/**`
- `.agents/skills/**`
- `data/foundations/**`
- `data/components/**`
- `registry/**`
- `bootstrap/**`
- `.github/workflows/system-validation.yml`
- любые Figma-объекты и локальные проекты писем.

---

### Задача 1: Зафиксировать границу теневого режима этапа 7

**Файлы:**
- Создать: `tests/characterization/generated-layer-shadow.test.mjs`

**Интерфейсы:**
- Использует: текущие manifest, Core, рабочие процессы, навыки, structured foundations и component registries.
- Создаёт: characterization-защиту, запрещающую незаметный cutover и смешивание старого и нового контекста.

- [ ] **Шаг 1: Написать характеризационный тест неизменяемых рабочих профилей**

В тесте зафиксировать точные текущие `source_ids` всех семи профилей:

```js
const expectedLegacyProfiles = {
  "library-maintenance": [
    "repository-readme",
    "email-figma-prompt",
    "figma-component-naming-standard",
    "component-descriptions-registry",
    "typography-registry",
    "spacing-foundation",
    "library-maintenance-checkpoint",
  ],
  "component-onboarding": [
    "repository-readme",
    "email-figma-prompt",
    "figma-component-naming-standard",
    "component-descriptions-registry",
    "typography-registry",
    "spacing-foundation",
    "library-maintenance-checkpoint",
  ],
  "figma-description-sync": [
    "repository-readme",
    "email-figma-prompt",
    "component-descriptions-registry",
    "typography-registry",
    "library-maintenance-checkpoint",
  ],
  "figma-naming-audit": [
    "repository-readme",
    "figma-component-naming-standard",
    "component-descriptions-registry",
    "library-maintenance-checkpoint",
  ],
  "migration-progress": [
    "repository-readme",
    "migration-roadmap",
    "library-maintenance-checkpoint",
  ],
  "email-new-build": [
    "repository-readme",
    "email-figma-prompt",
    "figma-component-naming-standard",
    "component-descriptions-registry",
    "typography-registry",
    "email-build-checkpoint",
    "email-project-brief",
  ],
  "email-continue-fix": [
    "repository-readme",
    "email-figma-prompt",
    "figma-component-naming-standard",
    "component-descriptions-registry",
    "typography-registry",
    "email-build-checkpoint",
  ],
};
```

Проверить, что добавление теневой конфигурации не меняет эти массивы, а `routes` продолжают ссылаться на те же profile IDs.

- [ ] **Шаг 2: Добавить boundary assertions, проходящие до и после внедрения**

Проверить, что:

```js
assert.equal(await exists("docs/generated/workflow-checklists"), false);
assert.equal(await exists("schemas/workflow.schema.json"), false);
assert.equal(await exists("email.html"), false);
assert.equal(await exists("images"), false);

for (const profile of manifest.bundle_profiles) {
  const shadow = profile.generated_bundle;
  if (!shadow) continue;
  assert.equal(
    shadow.static_source_ids.includes("component-descriptions-registry"),
    false,
  );
  assert.equal(
    shadow.static_source_ids.includes("typography-registry"),
    false,
  );
}
```

Такой guard проходит на исходном состоянии, а после появления capability проверяет её границы.

- [ ] **Шаг 3: Запустить тест и подтвердить GREEN контрольным состоянием**

Запуск:

```powershell
node --test tests/characterization/generated-layer-shadow.test.mjs
```

Ожидаемый результат: PASS на исходном `main`.

- [ ] **Шаг 4: Commit**

```powershell
git add tests/characterization/generated-layer-shadow.test.mjs
git commit -m "test: lock генерируемый слой граница теневого режима"
```

---

### Задача 2: Расширить manifest как единственную карту генерируемый слой

**Файлы:**
- Изменить: `schemas/manifest.schema.json`
- Изменить: `system/manifest.yaml`
- Изменить: `scripts/lib/system-manifest.mjs`
- Изменить: `tests/foundation/system-manifest.test.mjs`
- Проверить: `tests/characterization/generated-layer-shadow.test.mjs`

**Интерфейсы:**
- Использует: `loadSystemManifest`, `validateManifestShape`, `validateManifestSemantics`.
- Создаёт:
  - manifest schema `1.1.0`;
  - `manifest.generated_docs`;
  - `bundle_profiles[].generated_bundle`;
  - `resolveGeneratedDocDefinitions(manifest)`;
  - `resolveGeneratedBundleProfile(manifest, routeId)`.

- [ ] **Шаг 1: Написать проверки структуры для optional capability**

Проверить принятие следующей формы:

```js
manifest.generated_docs = [
  {
    id: "component-registry",
    output_source_id: "generated-component-registry",
    renderer: "component-registry",
    input_source_ids: [
      "components-shared",
      "components-marketing",
      "components-service",
      "components-schema",
    ],
  },
];

manifest.bundle_profiles[0].generated_bundle = {
  status: "shadow",
  static_source_ids: [
    "repository-readme",
    "email-figma-prompt",
    "figma-component-naming-standard",
    "library-maintenance-checkpoint",
  ],
  component_selection: "optional",
  viewport_selection: "one-or-both",
  foundation_selection: "explicit-or-referenced",
  allowed_foundation_ids: ["typography", "spacing", "assets", "figma-naming"],
  required_foundation_ids: [],
};
```

Добавить отрицательные тесты для unknown fields, unsafe path через output source, повторяющихся IDs и неизвестных enum values.

- [ ] **Шаг 2: Поднять schema version как minor capability**

Изменить:

```js
const SUPPORTED_MANIFEST_VERSION = "1.1.0";
```

и JSON Schema:

```json
"schema_version": { "const": "1.1.0" }
```

Новые поля оставить optional на уровне общей schema; canonical semantic validation потребует их полноту, когда capability присутствует. Это сохраняет SemVer-правило «новое необязательное универсальное поле → minor».

- [ ] **Шаг 3: Описать строгие `$defs`**

Добавить:

```json
"generatedDoc": {
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "output_source_id", "renderer", "input_source_ids"],
  "properties": {
    "id": { "$ref": "#/$defs/id" },
    "output_source_id": { "$ref": "#/$defs/id" },
    "renderer": {
      "enum": [
        "component-registry",
        "typography-registry",
        "asset-registry",
        "naming-reference"
      ]
    },
    "input_source_ids": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": { "$ref": "#/$defs/id" }
    }
  }
}
```

`generated_bundle` должен разрешать только перечисленные policy values:

```json
{
  "status": { "const": "shadow" },
  "component_selection": { "enum": ["none", "optional", "required"] },
  "viewport_selection": { "enum": ["none", "one-or-both", "both"] },
  "foundation_selection": {
    "enum": ["none", "referenced", "explicit", "explicit-or-referenced"]
  }
}
```

- [ ] **Шаг 4: Написать семантические проверки**

Проверить diagnostics:

- `duplicate-generated-doc-id`;
- `unknown-generated-output-source`;
- `invalid-generated-output-kind`;
- `unknown-generated-input-source`;
- `generated-input-cannot-be-generated`;
- `duplicate-generated-output-source`;
- `unknown-generated-bundle-source`;
- `generated-bundle-source-cannot-be-generated`;
- `generated-bundle-legacy-registry-forbidden`;
- `unknown-foundation-id`;
- `route-generated-profile-missing`.

Каждая ошибка должна содержать JSON-pointer path.

- [ ] **Шаг 5: Реализовать manifest semantics**

Экспортировать:

```js
export function resolveGeneratedDocDefinitions(manifest) {
  return Object.freeze(
    (manifest.generated_docs ?? []).map((definition) =>
      Object.freeze(structuredClone(definition)),
    ),
  );
}

export function resolveGeneratedBundleProfile(manifest, routeId) {
  const route = manifest.routes.find((item) => item.id === routeId);
  if (!route) {
    return {
      status: "blocked",
      blockers: [
        diagnostic(
          "CONTEXT_BUNDLE_ROUTE_UNKNOWN",
          "/route_id",
          `Unknown route: ${routeId}.`,
        ),
      ],
    };
  }
  const profile = manifest.bundle_profiles.find(
    (item) => item.id === route.bundle_profile_id,
  );
  if (!profile?.generated_bundle) {
    return {
      status: "blocked",
      blockers: [
        diagnostic(
          "CONTEXT_BUNDLE_PROFILE_MISSING",
          `/bundle_profiles/${route.bundle_profile_id}`,
          `Route ${routeId} has no generated bundle profile.`,
        ),
      ],
    };
  }
  return { status: "resolved", route, profile };
}
```

- [ ] **Шаг 6: Проверить generated-doc capability на изолированной fixture**

В semantic tests временно добавить в fixture четыре файла с `kind: generated` и соответствующий `generated_docs`. Это проверяет новую форму и references, не объявляя отсутствующие outputs в canonical manifest раньше Task 5.

- [ ] **Шаг 7: Добавить теневую политику каждому canonical route profile**

Использовать следующие `static_source_ids`:

```js
const shadowStaticSources = {
  "library-maintenance": [
    "repository-readme",
    "email-figma-prompt",
    "figma-component-naming-standard",
    "library-maintenance-checkpoint",
  ],
  "component-onboarding": [
    "repository-readme",
    "email-figma-prompt",
    "figma-component-naming-standard",
    "library-maintenance-checkpoint",
  ],
  "figma-description-sync": [
    "repository-readme",
    "email-figma-prompt",
    "library-maintenance-checkpoint",
  ],
  "figma-naming-audit": [
    "repository-readme",
    "figma-component-naming-standard",
    "library-maintenance-checkpoint",
  ],
  "migration-progress": [
    "repository-readme",
    "migration-roadmap",
    "library-maintenance-checkpoint",
  ],
  "email-new-build": [
    "repository-readme",
    "email-figma-prompt",
    "email-build-checkpoint",
    "email-project-brief",
  ],
  "email-continue-fix": [
    "repository-readme",
    "email-figma-prompt",
    "email-build-checkpoint",
  ],
};
```

Policy:

- `library-maintenance`: components optional, viewport one-or-both, foundations explicit-or-referenced, allow all four.
- `component-onboarding`: components optional, viewport both, foundations explicit-or-referenced, allow all four.
- `figma-description-sync`: components required, viewport both, foundations referenced, allow typography/spacing/assets.
- `figma-naming-audit`: components optional, viewport none, foundations explicit, require and allow only figma-naming.
- `migration-progress`: components none, viewport none, foundations none.
- `email-new-build`: components required, viewport both, foundations referenced, allow typography/spacing/assets.
- `email-continue-fix`: components optional, viewport both when components supplied, foundations referenced, allow typography/spacing/assets.

- [ ] **Шаг 8: Запустить тесты**

Запуск:

```powershell
node --test tests/foundation/system-manifest.test.mjs tests/characterization/generated-layer-shadow.test.mjs
```

Ожидаемый результат: PASS; legacy `source_ids` полностью совпадают с контрольным состоянием.

- [ ] **Шаг 9: Commit**

```powershell
git add schemas/manifest.schema.json system/manifest.yaml scripts/lib/system-manifest.mjs tests/foundation/system-manifest.test.mjs tests/characterization/generated-layer-shadow.test.mjs
git commit -m "feat: declare генерируемый слой in manifest"
```

---

### Задача 3: Создать единый детерминированный digest

**Файлы:**
- Создать: `scripts/lib/content-digest.mjs`
- Создать: `tests/generation/content-digest.test.mjs`

**Интерфейсы:**
- Создаёт:
  - `canonicalize(value): string`;
  - `digestTextEntries(entries): string`;
  - `digestStructuredEntries(entries): string`.
- Digest format: `sha256:<64 lowercase hex>`.

- [ ] **Шаг 1: Написать падающий тестs**

```js
test("canonicalize ignores object key insertion order", () => {
  assert.equal(
    canonicalize({ b: 2, a: { d: 4, c: 3 } }),
    canonicalize({ a: { c: 3, d: 4 }, b: 2 }),
  );
});

test("digest includes paths and normalized LF bytes", () => {
  const first = digestTextEntries([
    { path: "b.yaml", content: "b: 2\r\n" },
    { path: "a.yaml", content: "a: 1\n" },
  ]);
  const second = digestTextEntries([
    { path: "a.yaml", content: "a: 1\n" },
    { path: "b.yaml", content: "b: 2\n" },
  ]);
  assert.equal(first, second);
  assert.match(first, /^sha256:[0-9a-f]{64}$/u);
});
```

Добавить тесты на изменение path, content, array order и numeric value.

- [ ] **Шаг 2: Запустить RED**

Запуск:

```powershell
node --test tests/generation/content-digest.test.mjs
```

Ожидаемый результат: FAIL with ошибкой отсутствующего модуля.

- [ ] **Шаг 3: Реализовать canonical serialization**

```js
function normalize(value) {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, normalize(value[key])]),
    );
  }
  return value;
}

export function canonicalize(value) {
  return `${JSON.stringify(normalize(value))}\n`;
}
```

Для текстового digest сортировать entries по path, нормализовать CRLF в LF и хэшировать `path`, нулевой разделитель и bytes содержимого.

- [ ] **Шаг 4: Запустить GREEN**

Запуск:

```powershell
node --test tests/generation/content-digest.test.mjs
```

Ожидаемый результат: PASS.

- [ ] **Шаг 5: Commit**

```powershell
git add scripts/lib/content-digest.mjs tests/generation/content-digest.test.mjs
git commit -m "feat: add deterministic content digest"
```

---

### Задача 4: Сгенерировать четыре человекочитаемых справочника

**Файлы:**
- Создать: `scripts/lib/generated-docs.mjs`
- Создать: `tests/generation/generated-docs.test.mjs`
- Изменить: `scripts/lib/component-registry.mjs`
- Использовать: `scripts/lib/component-description.mjs`

**Интерфейсы:**
- Использует: manifest-generated definitions, validated foundations, three component registries.
- Создаёт:
  - `loadGeneratedDocModel({ repoRoot, manifest })`;
  - `renderGeneratedDoc({ definition, model }): string`;
  - `renderAllGeneratedDocs({ repoRoot, manifest }): Map<path, content>`;
  - `compareGeneratedDocs({ repoRoot, rendered }): diagnostics[]`.

- [ ] **Шаг 1: Написать падающий тест общего заголовка**

Каждый файл начинается одинаково:

```md
<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: component-registry -->
<!-- source-digest: sha256:... -->
<!-- schema-versions: components=1.0.0 -->
```

Тест проверяет отсутствие даты/времени и равенство двух последовательных render.

- [ ] **Шаг 2: Экспортировать безопасные traversal helpers**

Из `component-registry.mjs` экспортировать только уже существующую семантику:

```js
export function listComponentRecords(registries) {
  return recordsIn(registries)
    .map(({ library, record }) => ({ library, record }))
    .sort(
      (left, right) =>
        left.library.localeCompare(right.library) ||
        left.record.id.localeCompare(right.record.id),
    );
}
```

Не дублировать обход facts и reference rules в генераторе.

- [ ] **Шаг 3: Реализовать `component-registry` renderer**

Документ должен содержать:

- количество записей по `shared`, `marketing`, `service` и общий итог;
- для каждого record: stable ID, status, Figma name/node ID, semantic role/category;
- variants и component properties;
- Mobile и Desktop как отдельные секции без inheritance;
- asset owner, export boundary, dimensions, ratio и profile IDs;
- rendered Description через `renderComponentDescription`;
- Figma provenance и structure fingerprint;
- для `description.mode: none` — явную отметку `Figma source only; independent Description absent`.

Порядок: library `shared → marketing → service`, затем stable ID.

- [ ] **Шаг 4: Реализовать `typography-registry` renderer**

Для каждого style вывести:

- stable ID и Figma name;
- viewport, role и variant;
- family/style/CSS weight;
- font size, line-height, letter-spacing;
- Figma description;
- responsive pair;
- вычисленный список component consumers.

Consumers вычислять через `collectComponentReferences(record)` по foundation references `typography/styles/<style-id>`; не хранить второй список вручную.

- [ ] **Шаг 5: Реализовать `asset-registry` renderer**

Вывести общие source modes, display modes, export profiles, alpha modes и clipping policies из `assets.yaml`. Затем вывести component-specific asset contracts, сгруппированные по component ID:

```text
component → owner_layer_name → source_mode_id → display_mode_id
→ export_profile_id → alpha_mode_id → export_boundary
→ pixel_dimensions → aspect_ratio → crop → background
```

Не превращать component-specific contract в новый общий foundation rule.

- [ ] **Шаг 6: Реализовать `naming-reference` renderer**

Вывести только универсальные данные `figma-naming.yaml`: controlled vocabulary, templates, axis ordering, semantic roles, service names и обязательное сохранение `@2x/@4x`. Не добавлять список текущих компонентов, node IDs или карту массовых переименований.

- [ ] **Шаг 7: Написать точные tests содержания**

Минимальные assertions:

```js
assert.match(componentDoc, /61 component records/u);
assert.match(componentDoc, /banner-secondary/u);
assert.match(componentDoc, /Icon\/Bank-Card-2-Line/u);
assert.match(typographyDoc, /Desktop\/Caption/u);
assert.match(typographyDoc, /Consumers/u);
assert.match(assetDoc, /jpeg-2x/u);
assert.match(assetDoc, /png-4x/u);
assert.match(namingDoc, /@2x/u);
assert.match(namingDoc, /@4x/u);
assert.doesNotMatch(namingDoc, /326:5159/u);
```

Также проверить, что все четыре declared input digests меняются при изменении одного входного byte.

- [ ] **Шаг 8: Запустить GREEN**

Запуск:

```powershell
node --test tests/generation/content-digest.test.mjs tests/generation/generated-docs.test.mjs
```

Ожидаемый результат: PASS.

- [ ] **Шаг 9: Commit**

```powershell
git add scripts/lib/component-registry.mjs scripts/lib/generated-docs.mjs tests/generation/generated-docs.test.mjs
git commit -m "feat: render structured system references"
```

---

### Задача 5: Добавить CLI записи и проверки и закоммитить generated docs

**Файлы:**
- Создать: `scripts/generate-docs.mjs`
- Создать: `tests/generation/generated-docs-cli.test.mjs`
- Создать: `docs/generated/component-registry.md`
- Создать: `docs/generated/typography-registry.md`
- Создать: `docs/generated/asset-registry.md`
- Создать: `docs/generated/naming-reference.md`
- Изменить: `package.json`
- Изменить: `scripts/lib/system-manifest.mjs`
- Изменить: `tests/helpers/system-fixture.mjs`

**Интерфейсы:**
- Создаёт:
  - `node scripts/generate-docs.mjs --write [--repo-root <path>]`;
  - `node scripts/generate-docs.mjs --check [--repo-root <path>]`;
  - `npm run generate`;
  - `npm run generate:check`.

- [ ] **Шаг 1: Написать failing CLI tests**

Проверить:

```js
assert.equal(await run(["--check", "--repo-root", fixture.root]), 1);
assert.match(поток ошибок, /GENERATED_DOC_MISSING/u);

assert.equal(await run(["--write", "--repo-root", fixture.root]), 0);
assert.equal(await run(["--check", "--repo-root", fixture.root]), 0);
```

После изменения одного generated byte `--check` обязан вернуть code 1 и `GENERATED_DOC_STALE` с точным path.

Unknown argument, отсутствие mode и одновременные `--write --check` возвращают usage error и ничего не пишут.

- [ ] **Шаг 2: Атомарно объявить outputs в canonical manifest**

Добавить в `sources` четыре записи с `kind: generated`:

```yaml
- { id: generated-component-registry, kind: generated, path: docs/generated/component-registry.md }
- { id: generated-typography-registry, kind: generated, path: docs/generated/typography-registry.md }
- { id: generated-asset-registry, kind: generated, path: docs/generated/asset-registry.md }
- { id: generated-naming-reference, kind: generated, path: docs/generated/naming-reference.md }
```

Добавить `generated_docs` с точными input идентификаторы источников. Компонентный и потребительские справочники обязаны учитывать `components-shared`, `components-marketing`, `components-service` и `components-schema`. Эти manifest-изменения, CLI и четыре созданных файла входят в один коммит с проходящими проверками.

- [ ] **Шаг 3: Реализовать безопасный CLI parser**

```js
export function parseArguments(args) {
  const mode = args.includes("--write")
    ? "write"
    : args.includes("--check")
      ? "check"
      : null;
  // Accept only one mode and optional --repo-root <path>.
}
```

`--write` записывает только paths, объявленные через `generated_docs[].output_source_id`. Перед записью path разрешается относительно repo root и проверяется на выход за root.

- [ ] **Шаг 4: Добавить npm scripts**

```json
{
  "scripts": {
    "validate": "node scripts/validate-system.mjs",
    "generate": "node scripts/generate-docs.mjs --write",
    "generate:check": "node scripts/generate-docs.mjs --check",
    "test": "node --test tests/foundation/*.test.mjs tests/generation/*.test.mjs tests/characterization/*.test.mjs",
    "verify": "npm run validate && npm test"
  }
}
```

Команду `bundle` добавить только в Task 7 одновременно с существующим CLI-файлом.

- [ ] **Шаг 5: Сгенерировать файлы только через CLI**

Запуск:

```powershell
npm run generate
npm run generate:check
```

Ожидаемый результат: обе команды PASS; четыре файла существуют и совпадают с результатом генератора.

- [ ] **Шаг 6: Подключить stale check к общей проверке**

После успешной domain validation вызвать `compareGeneratedDocs`. Diagnostics `GENERATED_DOC_MISSING` и `GENERATED_DOC_STALE` должны войти в общий отсортированный список ошибок.

Не генерировать файлы автоматически из `npm run validate`: validation остаётся read-only.

- [ ] **Шаг 7: Проверить цикл**

Запуск:

```powershell
npm run validate
node --test tests/generation/generated-docs-cli.test.mjs
npm run generate:check
```

Ожидаемый результат: PASS.

- [ ] **Шаг 8: Commit**

```powershell
git add package.json system/manifest.yaml scripts/generate-docs.mjs scripts/lib/system-manifest.mjs tests/generation/generated-docs-cli.test.mjs tests/helpers/system-fixture.mjs docs/generated
git commit -m "feat: add checked generated documentation"
```

---

### Задача 6: Реализовать точный выбор компонентов и замыкание зависимостей для контекстного пакета

**Файлы:**
- Создать: `scripts/lib/context-bundle.mjs`
- Создать: `tests/generation/context-bundle.test.mjs`
- Изменить: `scripts/lib/component-registry.mjs`
- Изменить: `tests/helpers/system-fixture.mjs`

**Интерфейсы:**
- Использует:
  - `resolveGeneratedBundleProfile(manifest, routeId)`;
  - `resolveComponentContracts({ index, candidates, viewport })`;
  - `collectComponentReferences(record)`;
  - validated typography, spacing, assets и figma-naming foundations.
- Создаёт:
  - `buildContextBundle(options): Promise<ResolvedResult | BlockedResult>`;
  - `renderContextBundle(bundle): string`.
- Expected blocker shape:

```js
{
  status: "blocked",
  blockers: [{ code, path, message, handoff? }],
}
```

- [ ] **Шаг 1: Написать failing route/component tests**

Проверить:

- unknown route → `CONTEXT_BUNDLE_ROUTE_UNKNOWN`;
- required components отсутствуют → `CONTEXT_BUNDLE_COMPONENT_REQUIRED`;
- component передан route с `component_selection: none` → `CONTEXT_BUNDLE_COMPONENT_FORBIDDEN`;
- viewport отсутствует при `one-or-both` → `CONTEXT_BUNDLE_VIEWPORT_REQUIRED`;
- `email-new-build` с одним viewport → `CONTEXT_BUNDLE_BOTH_VIEWPORTS_REQUIRED`;
- unknown/deprecated/draft component сохраняет точный blocker resolver;
- fuzzy Figma name не принимается;
- unregistered Figma identity содержит handoff `component-onboarding`.

- [ ] **Шаг 2: Добавить транзитивное разрешение component references**

```js
function collectDependencyClosure(index, rootIds) {
  const ordered = [];
  const seen = new Set();

  function visit(id) {
    if (seen.has(id)) return;
    seen.add(id);
    const record = index.bySystemId.get(id);
    if (!record) throw unresolvedComponent(id);
    for (const reference of collectComponentReferences(record).components) {
      visit(reference.id);
    }
    ordered.push(record);
  }

  [...rootIds].sort().forEach(visit);
  return ordered;
}
```

Каждая зависимость обязана быть `active`. Порядок стабилен и не зависит от порядка CLI-аргументов.

- [ ] **Шаг 3: Спроецировать только выбранные viewport contracts**

Bundle component entry:

```js
{
  id: record.id,
  status: record.status,
  identity: record.identity,
  figma: record.figma,
  variants: relevantVariants(record.variants, viewports),
  properties: referencedProperties(record, viewports),
  asset_contracts: referencedAssets(record, viewports),
  contracts: Object.fromEntries(
    viewports.map((viewport) => [viewport, record.contracts[viewport]]),
  ),
  rendered_description: renderComponentDescription(record, index),
  provenance: record.provenance,
}
```

Не создавать Mobile из Desktop и наоборот. Если выбранный contract отсутствует, вернуть blocker.

- [ ] **Шаг 4: Собрать замкнутый набор foundation references**

Из выбранных contracts и зависимостей получить `collectComponentReferences(record).foundations`. В bundle включить только referenced definition:

```js
{
  foundation_id: "typography",
  schema_version: "1.0.0",
  definition_group: "styles",
  definition_id: "mobile-caption",
  value: structuredClone(style),
}
```

Spacing definition выдаётся только как точная зависимость конкретного contract. Поля `purpose`, `applicability` и resolver logic общего spacing foundation не включать в email route bundle.

- [ ] **Шаг 5: Проверить closure**

Добавить функцию:

```js
export function validateBundleClosure(bundle) {
  // Every component-reference, property-reference, asset-reference and
  // foundation-reference resolves inside the emitted bundle.
}
```

Diagnostics должны указывать `component-id/contracts/<viewport>/...`.

- [ ] **Шаг 6: Собрать статические источники**

Каждый static source entry:

```js
{
  id: source.id,
  kind: source.kind,
  path: source.path,
  digest: digestTextEntries([{ path: source.path, content }]),
  content,
}
```

Запрещено включать source, которого нет в `generated_bundle.static_source_ids`.

- [ ] **Шаг 7: Сформировать итоговый object и digest**

```js
{
  schema_version: "1.0.0",
  mode: "shadow",
  route: {
    id: route.id,
    workflow_source_id: route.workflow_source_id,
    bundle_profile_id: route.bundle_profile_id,
  },
  source_versions: {
    manifest: manifest.schema_version,
    components: "1.0.0",
    typography: "1.0.0",
    spacing: "1.0.0",
    assets: "1.0.0",
    figma_naming: "1.0.0",
  },
  static_sources,
  components,
  foundation_definitions,
  digest,
}
```

Digest считается без собственного поля `digest`.

- [ ] **Шаг 8: Написать проверки минимальности**

Для `email-new-build` с `banner-hero` проверить:

- оба viewport contract присутствуют;
- не присутствуют unrelated component IDs;
- присутствуют только транзитивные nested components;
- не присутствуют `component-descriptions-registry`, `typography-registry`, naming standard и maintenance workflow;
- foundation list является точным множеством references выбранного closure;
- повторный build даёт deepEqual object и тот же digest.

Для `migration-progress` проверить отсутствие components и foundations.

Для `figma-naming-audit` проверить наличие только figma-naming foundation и отсутствие component registry, если компонент не выбран.

- [ ] **Шаг 9: Запустить GREEN**

Запуск:

```powershell
node --test tests/generation/context-bundle.test.mjs
```

Ожидаемый результат: PASS.

- [ ] **Шаг 10: Commit**

```powershell
git add scripts/lib/component-registry.mjs scripts/lib/context-bundle.mjs tests/generation/context-bundle.test.mjs
git commit -m "feat: build exact route контекстный пакетs"
```

---

### Задача 7: Добавить CLI контекстного пакета без записи

**Файлы:**
- Создать: `scripts/build-context-bundle.mjs`
- Создать: `tests/generation/context-bundle-cli.test.mjs`
- Изменить: `package.json`

**Интерфейсы:**
- Создаёт:

```text
npm run bundle -- --route <route-id>
  [--component <stable-id>]...
  [--viewport mobile|desktop|both]
  [--foundation typography|spacing|assets|figma-naming]...
```

- стандартный вывод: один deterministic Markdown bundle.
- поток ошибок: diagnostics.
- exit 0: resolved; exit 1: blocked/invalid.

- [ ] **Шаг 1: Написать failing parser tests**

Проверить повторяемые `--component` и `--foundation`, ровно один `--route`, один `--viewport`, запрет неизвестных аргументов и пустых значений.

- [ ] **Шаг 2: Реализовать viewport normalization**

```js
function parseViewport(value) {
  if (value === "both") return ["mobile", "desktop"];
  if (value === "mobile" || value === "desktop") return [value];
  throw cliDiagnostic("CONTEXT_BUNDLE_VIEWPORT_INVALID", "/viewport");
}
```

- [ ] **Шаг 3: Реализовать Markdown renderer без потери object boundaries**

Вывести:

```md
---
bundle_schema_version: 1.0.0
mode: shadow
route_id: email-new-build
bundle_profile_id: email-new-build
digest: sha256:...
---

# Разрешённый контекстный пакет CUPIS

## Статические источники
### repository-readme
Source: README.md
...
## Компоненты
### banner-hero
...
## Определения основ
### typography/styles/mobile-display
...
```

Structured fragments сериализовать canonical JSON в fenced blocks. Не добавлять timestamp или локальный absolute path.

- [ ] **Шаг 4: Проверить отсутствие файловых записей**

В fixture снять recursive file listing до и после команды и сравнить:

```js
assert.deepEqual(afterPaths, beforePaths);
```

Дополнительно проверить, что CLI source не импортирует `writeFile`, `appendFile`, `mkdir` или `rm`.

- [ ] **Шаг 5: Проверить характерные маршруты**

Запуск:

```powershell
npm run bundle -- --route migration-progress
npm run bundle -- --route figma-naming-audit --foundation figma-naming
npm run bundle -- --route email-new-build --component banner-hero --viewport both
```

Ожидаемый результат: exit 0, deterministic стандартный вывод, нет старых Markdown-реестров.

- [ ] **Шаг 6: Проверить blockers**

Run без component для `email-new-build` и с одним viewport. Expected: exit 1 и точный blocker; стандартный вывод пуст.

- [ ] **Шаг 7: Добавить npm script и проверить команду**

Добавить:

```json
"bundle": "node scripts/build-context-bundle.mjs"
```

Запуск:

```powershell
npm run bundle -- --route migration-progress
```

Ожидаемый результат: exit 0.

- [ ] **Шаг 8: Commit**

```powershell
git add scripts/build-context-bundle.mjs tests/generation/context-bundle-cli.test.mjs package.json
git commit -m "feat: expose read-only контекстный пакет cli"
```

---

### Задача 8: Подключить генерируемый слой к общей проверке

**Файлы:**
- Изменить: `scripts/lib/system-manifest.mjs`
- Изменить: `scripts/validate-system.mjs`
- Изменить: `tests/foundation/system-manifest.test.mjs`
- Изменить: `tests/foundation/validator-cli.test.mjs`
- Изменить: `tests/helpers/system-fixture.mjs`

**Интерфейсы:**
- Использует: domain validation, `compareGeneratedDocs`, `validateBundleClosure`.
- Создаёт: один `npm run validate`, блокирующий stale generated docs и некорректную route policy.

- [ ] **Шаг 1: Написать failing system tests**

В fixture:

1. удалить один generated file → `GENERATED_DOC_MISSING`;
2. изменить byte → `GENERATED_DOC_STALE`;
3. вставить старый registry source в shadow static list → `generated-bundle-legacy-registry-forbidden`;
4. удалить `generated_bundle` у одного canonical route → `route-generated-profile-missing`;
5. сломать foundation reference в component → существующий component diagnostic появляется раньше generated check.

- [ ] **Шаг 2: Сохранить порядок validation**

Порядок:

```text
manifest shape
→ manifest semantics
→ foundation schemas/semantics
→ component schemas/cross-references
→ generated-doc equivalence
→ generated bundle profile/closure invariants
```

Generated renderer не должен работать, если upstream data invalid.

- [ ] **Шаг 3: Не превращать validation в генерацию**

`validateSystem` только читает и сравнивает. Ни одна ветка не вызывает write mode.

- [ ] **Шаг 4: Проверить CLI diagnostics**

Запуск:

```powershell
node --test tests/foundation/system-manifest.test.mjs tests/foundation/validator-cli.test.mjs
```

Ожидаемый результат: PASS; diagnostics отсортированы и содержат path.

- [ ] **Шаг 5: Commit**

```powershell
git add scripts/lib/system-manifest.mjs scripts/validate-system.mjs tests/foundation/system-manifest.test.mjs tests/foundation/validator-cli.test.mjs tests/helpers/system-fixture.mjs
git commit -m "feat: validate generated system layer"
```

---

### Задача 9: Обновить README без переключения рабочих инструкций

**Файлы:**
- Изменить: `README.md`
- Проверить: `tests/characterization/generated-layer-shadow.test.mjs`

**Интерфейсы:**
- Создаёт: понятное человеку описание генерируемый слой и команд.
- Сохраняет: действующие разделы «Режим 1» и «Режим 2» как текущие рабочие маршруты.

- [ ] **Шаг 1: Написать failing README assertions**

README должен содержать:

```text
docs/generated/
npm run generate
npm run generate:check
npm run bundle -- --route
shadow
не редактируются вручную
не переключает рабочие навыки
```

- [ ] **Шаг 2: Добавить раздел «Генерируемая документация и shadow контекстный пакетs»**

Объяснить простым языком:

- файлы в `docs/generated/` удобны для чтения, но берут данные из `data/`;
- ручное изменение generated файла будет отклонено проверкой;
- bundle собирается временно под конкретную задачу и не сохраняется;
- на этапе 7 bundle используется для проверки новой архитектуры, а не repo-scoped skill;
- фактическое переключение выполняется только на этапах 8–9.

- [ ] **Шаг 3: Дополнить таблицу ответственности файлов**

Добавить новые scripts и generated paths. Не объявлять `docs/generated/*` каноническим владельцем.

- [ ] **Шаг 4: Запустить boundary test**

Запуск:

```powershell
node --test tests/characterization/generated-layer-shadow.test.mjs
```

Ожидаемый результат: PASS.

- [ ] **Шаг 5: Commit**

```powershell
git add README.md tests/characterization/generated-layer-shadow.test.mjs
git commit -m "docs: explain generated shadow layer"
```

---

### Задача 10: Финальная characterization и проверка этапа

**Файлы:**
- Modify only if a test exposes an in-scope defect.
- Не изменять: roadmap, active work context, Core, рабочие процессы, навыки, Figma, structured facts.

**Интерфейсы:**
- Создаёт: проверяемое доказательство готовности этапа 7 к отдельному merge review.

- [ ] **Шаг 1: Пересобрать docs и проверить отсутствие diff**

Запуск:

```powershell
npm run generate
git diff --exit-code -- docs/generated
npm run generate:check
```

Ожидаемый результат: PASS и пустой diff после повторной генерации.

- [ ] **Шаг 2: Запустить полную validation**

Запуск:

```powershell
npm run validate
```

Ожидаемый результат:

```text
[PASS] CUPIS system validation passed.
```

- [ ] **Шаг 3: Запустить полный Node suite**

Запуск:

```powershell
npm test
```

Ожидаемый результат: 0 failed.

- [ ] **Шаг 4: Запустить общий verify**

Запуск:

```powershell
npm run verify
```

Ожидаемый результат: exit 0.

- [ ] **Шаг 5: Запустить Windows bootstrap contract**

Запуск:

```powershell
pwsh -NoProfile -File bootstrap/verify.ps1
pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1
```

Ожидаемый результат: оба exit 0.

- [ ] **Шаг 6: Выполнить проверку характерных контекстных пакетов**

Для каждого route собрать bundle минимум один раз. Зафиксировать в review summary:

- exact static идентификаторы источников;
- количество selected и dependency components;
- количество определения основ;
- отсутствие legacy component/typography registries;
- отсутствие лишних Core/workflow sources;
- одинаковый digest двух последовательных запусков.

- [ ] **Шаг 7: Проверить границы изменённых путей**

Допустимы только пути из целевой карты этого плана. Отдельно проверить отсутствие:

```text
core/**
workflows/**
.agents/skills/**
data/**
registry/**
bootstrap/**
email.html
images/**
```

`system/manifest.yaml` и его schema изменяются только для теневую возможность; legacy `source_ids` остаются побайтово эквивалентны значениям из Task 1.

- [ ] **Шаг 8: Проверить отсутствие Figma и network clients**

Новые scripts не должны содержать `use_figma`, `@figma`, HTTP client или `fetch(`. Bundle и generation полностью offline.

- [ ] **Шаг 9: Commit возможных test-only corrections**

Если проверки не потребовали исправлений, commit не создавать. Если потребовали — добавить только минимальные in-scope файлы:

```powershell
git add <only-in-scope-paths>
git commit -m "test: harden generated bundle boundaries"
```

- [ ] **Шаг 10: Открыть draft PR и остановиться**

PR summary должен перечислить:

- generated docs;
- shadow bundle builder;
- manifest capability;
- validation/test evidence;
- сохранённые legacy routes;
- отсутствие Figma и cutover.

Не обновлять roadmap и не начинать этап 8 до merge этапа 7. После отдельного разрешения на merge и подтверждения `main` создать короткую status-задачу: отметить этап 7 завершённым, добавить ссылку на implementation plan/PR и назвать этап 8 следующим.

---

## Критерии готовности

1. Четыре файла `docs/generated/*.md` полностью выводятся из structured data и повторно генерируются без diff.
2. У каждого generated doc есть renderer ID, schema versions и deterministic source digest.
3. Ручное изменение или отсутствие generated doc блокирует `npm run validate`.
4. Все семь текущих routes имеют shadow bundle policy, но legacy `source_ids` и skill behavior не меняются.
5. Bundle создаётся только в памяти/стандартный вывод и не оставляет файлов.
6. Route получает только перечисленные static sources.
7. Bundle содержит только выбранные active components и транзитивные component dependencies.
8. Bundle содержит только запрошенные viewport contracts; `email-new-build` всегда содержит Mobile и Desktop.
9. Все component/property/asset/foundation references замкнуты внутри bundle.
10. Неизвестный или неактивный компонент, missing contract и unresolved reference блокируют сборку точным diagnostic.
11. Старые component/typography Markdown registries не смешиваются со structured records в bundle.
12. Spacing для email route присутствует только как точная referenced definition, а не как design-time resolver rule.
13. `npm run generate:check`, `npm run validate`, `npm test`, `npm run verify` и Windows bootstrap checks проходят.
14. Core, рабочие процессы, навыки, structured facts, Figma и локальные письма не изменены.
15. Implementation PR остаётся draft до отдельной команды пользователя на merge.

## Результаты самопроверки

- **Покрытие спецификации:** generated docs, digests, deterministic CI comparison, специальные для маршрута bundles, selected contracts, used foundations, provenance, blockers и граница теневого режима покрыты Tasks 2–10.
- **Проверка границ:** workflow generation, Core split и skill cutover явно исключены и остаются этапами 8–9.
- **Проверка полноты:** все действия, файлы, интерфейсы и ожидаемые результаты определены явно.
- **Согласованность интерфейсов:** manifest → generated docs/bundle resolvers → CLI → validation использует одинаковые IDs и function names.
- **Контроль рисков:** главный риск — случайный ранний cutover — закрыт неизменяемыми legacy `source_ids`, отдельным `generated_bundle.status: shadow` и characterization test.
