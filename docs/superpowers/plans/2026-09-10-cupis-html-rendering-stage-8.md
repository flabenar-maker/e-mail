# CUPIS HTML Rendering Stage 8 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Реализовать contract-driven HTML-рендеринг CUPIS-писем, доказать его на representative-пилоте, подготовить все активные component contracts и структурированные workflows без скрытого переключения maintenance skill, Figma или production-писем.

**Architecture:** Фактические Mobile/Desktop-инстансы сначала разрешаются в зарегистрированные component contracts и временную типизированную модель. Общий contract-tree interpreter собирает большинство компонентов через email-примитивы; renderer registry явно фиксирует покрытие, а отдельный handler допускается только для доказанного исключения. Точный breakpoint, primitive policy и postprocessing policy принадлежат rendering foundation; финальная локальная публикация атомарно создаёт только `email.html` и `images/`.

**Tech Stack:** Node.js 24, ECMAScript modules (`.mjs`), YAML 2.9.0, AJV 8.20.0, JSON Schema Draft 2020-12, `node:test`; без нового runtime framework и без сетевого доступа из renderer CLI.

**Spec:** `docs/superpowers/specs/2026-09-10-cupis-html-rendering-design.md`.

## Фактический статус на 2026-09-14

Пакеты 1–9 слиты в main через PR #50–58; PR #59 исправил пилотный Mobile/Desktop layout. В main есть пилотное техническое ядро: foundation, шесть записей renderer coverage, примитивы, interpreter, модель, CLI, атомарная публикация, diagnostics и автоматические HTML-инварианты. Это не готовый маршрут сборки произвольного production-письма: для CLI ещё нужна подготовленная временная модель, а покрытие остальных компонентов не закончено.

PR #61–64 — корректирующая Figma-сверка и уточнение контрактов после неубедительного пилотного результата. Они слиты, но не заменяют проверки пакетов 10–12. Email/Footer находится в пилотном coverage, Email/Header пока отсутствует и не должен незаметно считаться протестированным.

Открытый [PR #60](https://github.com/flabenar-maker/e-mail/pull/60) содержит только read-only исследование внешних email-практик, а не реализацию viewport preview. Изучение источников проведено; тест готового письма в Яндекс Почте, Mail.ru и Gmail и обсуждение выводов ещё впереди. PR #60 не является gate-прохождением пакета 10 и не разрешает правку текущих контрактов.

[PR #66](https://github.com/flabenar-maker/e-mail/pull/66) дополнительно исправил оболочку пилота и границу Mobile/Desktop. [PR #69](https://github.com/flabenar-maker/e-mail/pull/69) временно вынес старый контур в `Legacy/` и остановил все маршруты; [PR #70](https://github.com/flabenar-maker/e-mail/pull/70) адаптировал тесты. Этот перенос не завершил shadow comparison и не разрешает использовать архивный контур для сборки. [PR #71](https://github.com/flabenar-maker/e-mail/pull/71) возвращает полный generated component registry и его проверку; это отдельная починка документационного слоя, не закрывающая пакеты 10–12.

Следующая работа: сначала диагностически проверить HTML, который реально создаёт обновлённый пилот, и отделить недостаток данных модели/контракта от ошибки renderer code. Затем обсудить выводы исследования и продолжить пакет 10; без доказанного расхождения не менять Core, contracts или renderer. Подробные checkbox-шаги ниже сохраняют исходную спецификацию реализации, а не отражают факт merge; актуальный статус пакетов указан в таблице.

## Global Constraints

- Перед каждым пакетом закрепить свежий `main`, перечитать manifest, roadmap, spec и этот plan на одном SHA.
- Один пакет выполняется в отдельной `codex/<semantic-slug>` branch и draft PR; следующий начинается только после review и merge предыдущего.
- Не использовать локальный checkout как канонический источник. Постоянные изменения публикуются через облачный GitHub; временный изолированный снимок точного SHA допускается только для локальных проверок.
- Не изменять Figma, Figma Description, component properties, variants, geometry или assets в технических пакетах. Неясный факт разрешается read-only проверкой; Figma mutation требует отдельной задачи и impact gate.
- Не добавлять в репозиторий production `email.html`, `images/`, реальные письма, временные модели, экспортированные assets или screenshots конкретной рассылки.
- До отдельного cutover сохранять текущие остановленные `bundle_profiles[].source_ids`, `routes[].bundle_profile_id` и repo-scoped maintenance skill. Старый active source list до PR #69 является историческим baseline, а не требованием повторно активировать его.
- Прежние Core prompt, Markdown registries и workflows хранятся в `Legacy/` только как read-only comparison baseline до отдельной ревизии после cutover; они не входят в runtime bundle.
- Один факт имеет одного владельца: rendering foundation не копирует typography, spacing, assets или component facts; renderer code не хранит размеры и контент компонентов.
- Spacing golden rule не вызывается при HTML-сборке. Renderer получает только точные факты resolved contract.
- Figma Description не входит в email-build input.
- Mobile и Desktop разрешаются независимо; одна версия не создаётся предположением из другой.
- Адаптивное изображение не получает независимую фиксированную высоту. `@2x`, `@4x`, source/export/display и alpha/background продолжают разрешаться через assets foundation и component asset contract.
- Renderer CLI не обращается к Figma, сети или GitHub. MCP-экспорт и построение временной модели выполняются внешним оркестратором до вызова CLI.
- Нельзя исправлять сгенерированный NEW BUILD вручную как штатный путь. Ошибка исправляется в contract, foundation, recipe или renderer, затем письмо пересобирается.
- CONTINUE/FIX остаётся отдельным режимом и всегда работает в новой локальной версии папки.
- Все diagnostics используют стабильные code/path/message и сортируются детерминированно.
- Никакой пакет не считается завершённым до свежих локальных `npm run verify`, Windows bootstrap check и allowed-diff проверки на точном SHA.
- Merge выполняется только по отдельной команде пользователя.

---

## Карта реализации

| Пакет | Результат | Исходный gate перед следующим | Фактический статус |
|---:|---|---|---|
| 1 | Characterization baseline и readiness-аудит | Подтверждены реальные gaps без изменения runtime | Слит: [PR #50](https://github.com/flabenar-maker/e-mail/pull/50) |
| 2 | Rendering foundation и schema | Общие исполняемые определения валидируются | Слит: [PR #51](https://github.com/flabenar-maker/e-mail/pull/51) |
| 3 | Renderer registry, content slots и pilot contracts | Шесть пилотных компонентов renderer-ready | Слит: [PR #52](https://github.com/flabenar-maker/e-mail/pull/52); факты дополнительно уточнены в PR #61–64 |
| 4 | Разделённый Core | Нет semantic loss и дублей structured definitions | Слит: [PR #53](https://github.com/flabenar-maker/e-mail/pull/53) |
| 5 | Email-примитивы и interpreter | Contract tree рендерится без component-specific HTML | Слит: [PR #54](https://github.com/flabenar-maker/e-mail/pull/54) |
| 6 | Representative pilot | Шесть типов проходят Mobile/Desktop проверки | Код слит: [PR #55](https://github.com/flabenar-maker/e-mail/pull/55); layout скорректирован в PR #59, визуальное доказательство ещё требуется |
| 7 | Временная модель, CLI и атомарный output | Ошибка не повреждает прежний результат | Слит: [PR #56](https://github.com/flabenar-maker/e-mail/pull/56) |
| 8 | Render-impact digest и diagnostics | Документация не инвалидирует renderer | Слит: [PR #57](https://github.com/flabenar-maker/e-mail/pull/57) |
| 9 | Автоматическая проверка | Property branches и HTML invariants покрыты | Слит: [PR #58](https://github.com/flabenar-maker/e-mail/pull/58) |
| 10 | Visual scenarios | Mobile/Desktop geometry подтверждена на пилоте | Не завершён; PR #60 больше не содержит его реализации |
| 11 | Все активные компоненты | Readiness/coverage blockers равны нулю | Не начат как пакет покрытия; PR #61–64 уточнили факты, но coverage остаётся пилотным |
| 12 | Structured workflows и shadow comparison | Новый маршрут готов к Stage 9 без двойного контекста | Не начат |

## Целевая карта файлов

### Создать

- `data/foundations/rendering.yaml`
- `data/renderers/registry.yaml`
- `data/workflows/library-maintenance.yaml`
- `data/workflows/email-build.yaml`
- `schemas/rendering.schema.json`
- `schemas/renderer-registry.schema.json`
- `schemas/email-model.schema.json`
- `schemas/workflows.schema.json`
- `scripts/lib/rendering-foundation.mjs`
- `scripts/lib/renderer-readiness.mjs`
- `scripts/lib/renderer-registry.mjs`
- `scripts/lib/email-primitives.mjs`
- `scripts/lib/email-interpreter.mjs`
- `scripts/lib/email-model.mjs`
- `scripts/lib/email-renderer.mjs`
- `scripts/lib/email-postprocess.mjs`
- `scripts/lib/email-output.mjs`
- `scripts/lib/render-impact.mjs`
- `scripts/lib/workflow-registry.mjs`
- `scripts/audit-renderer-readiness.mjs`
- `scripts/render-email.mjs`
- `scripts/render-email-preview.mjs`
- `core/email-rendering-standard.md`
- `core/typography-standard.md`
- `core/asset-export-standard.md`
- `core/figma-library-standard.md`
- специализированные tests и system fixtures, перечисленные в пакетах.

### Изменять по пакетам

- `data/components/shared.yaml`
- `data/components/marketing.yaml`
- `data/components/service.yaml`
- `schemas/components.schema.json`
- `system/manifest.yaml`
- `schemas/manifest.schema.json` — изменить только в Package 12 одновременно с добавлением structured-workflow capability и повышением manifest до `1.2.0`.
- `scripts/lib/component-registry.mjs`
- `scripts/lib/context-bundle.mjs`
- `scripts/lib/system-manifest.mjs`
- `scripts/lib/diagnostics.mjs`
- `scripts/validate-system.mjs`
- `tests/helpers/system-fixture.mjs`
- `package.json`
- generated docs после подтверждённого изменения их inputs.

### Сохранить до отдельного cutover

- Архивные версии Core prompt, registries, workflows и checkpoints в `Legacy/` как read-only baseline.
- Текущие остановленные routes и repo-scoped maintenance skill — до отдельного решения о переключении.
- Figma и production-письма.

---

### Package 1: Characterization baseline и readiness audit

**Files:**
- Create: `tests/fixtures/rendering/legacy-baseline.json`
- Create: `scripts/lib/renderer-readiness.mjs`
- Create: `scripts/audit-renderer-readiness.mjs`
- Create: `tests/rendering/renderer-readiness.test.mjs`
- Create: `tests/characterization/html-rendering-baseline.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `auditRendererReadiness(registries) -> { summary, components }`.
- Produces: `node scripts/audit-renderer-readiness.mjs [--repo-root <path>]`.
- Preserves all active routes and canonical content.

- [ ] **Step 1: Зафиксировать измеренный baseline**

```json
{
  "source_commit": "ba5cd1f4bc7af1ecb1987dc31bdf25725b5bef84",
  "components": 61,
  "active_components": 61,
  "facts": 395,
  "generic_description_facts": 386,
  "components_with_generic_facts": 46,
  "components_with_properties": 16,
  "components_with_assets": 27
}
```

Baseline описывает старое состояние, а не целевые требования.

- [ ] **Step 2: Написать failing unit tests auditor**

```js
const report = auditRendererReadiness(registries);
assert.equal(report.summary.components, 61);
assert.equal(report.summary.generic_description_facts, 386);
assert.equal(report.components.find(({ id }) => id === "card-image").ready, false);
assert.ok(report.components.find(({ id }) => id === "card-image").issues.some(
  ({ code }) => code === "RENDER_FACT_ID_GENERIC",
));
```

Issue shape: `{ code, path, component_id, viewport }`. Сортировка: component → viewport → path → code.

- [ ] **Step 3: Реализовать read-only auditor**

Использовать `listComponentRecords` и `walkComponentFacts`. Auditor ничего не переименовывает. Коды: `RENDER_FACT_ID_GENERIC`, `RENDER_FACT_OWNER_ROOT`, `RENDER_CONTENT_SLOT_MISSING`, `RENDER_COVERAGE_MISSING`.

- [ ] **Step 4: Добавить CLI и command**

```json
"audit:rendering": "node scripts/audit-renderer-readiness.mjs"
```

CLI печатает JSON в stdout и ничего не записывает.

- [ ] **Step 5: Зафиксировать characterization guards**

Проверить digests legacy Core/workflows/registries, точные active `source_ids`, отсутствие rendering sources в active bundles и отсутствие email outputs в репозитории.

- [ ] **Step 6: RED/GREEN и commit**

```powershell
npm run audit:rendering
node --test tests/rendering/renderer-readiness.test.mjs tests/characterization/html-rendering-baseline.test.mjs
npm run verify
git add package.json scripts/audit-renderer-readiness.mjs scripts/lib/renderer-readiness.mjs tests/fixtures/rendering/legacy-baseline.json tests/rendering/renderer-readiness.test.mjs tests/characterization/html-rendering-baseline.test.mjs
git commit -m "test: establish HTML rendering readiness baseline"
```

Gate: измерения подтверждены, runtime и sources не переключены.

---

### Package 2: Rendering foundation

**Files:**
- Create: `data/foundations/rendering.yaml`
- Create: `schemas/rendering.schema.json`
- Create: `scripts/lib/rendering-foundation.mjs`
- Create: `tests/foundation/rendering-foundation.test.mjs`
- Modify: manifest, system validation и fixture tests.

**Interfaces:**
- `loadRenderingFoundation({ repoRoot, dataPath?, schemaPath? })`.
- `validateRenderingShape(document, schema)`.
- `resolveRenderingDefinition(document, { group, id })`.

- [ ] **Step 1: Написать schema tests для формы**

```yaml
schema_version: 1.0.0
foundation: { id: rendering, status: shadow }
breakpoints:
  - { id: cupis-mobile, query: max-width, value: 660, unit: px }
responsive_strategies:
  - { id: shared-tree, contract: exact-structural-pairing }
  - { id: split-subtree, contract: explicit-viewport-subtree }
  - { id: split-component, contract: independent-viewport-contracts }
primitives:
  - { id: email-shell, contract: presentation-table }
  - { id: section, contract: presentation-table }
  - { id: table, contract: presentation-table }
  - { id: text, contract: html-text }
  - { id: link, contract: html-link }
  - { id: direct-image, contract: direct-image }
  - { id: background-image, contract: background-image }
  - { id: responsive-visibility, contract: media-query }
postprocessing:
  allowed: [normalize-attributes, strip-technical-markers, validate-local-src]
  forbidden: [infer-contract, change-layout, change-dimensions, suppress-diagnostic]
support_profiles:
  - id: cupis-default
    required: [table-layout, inline-style-output, media-query-responsive]
    optional: [legacy-outlook-vml, external-client-matrix]
```

Отклонять unknown fields, duplicate IDs, fractional breakpoint и component/Figma IDs внутри foundation.

- [ ] **Step 2: Реализовать loader/resolver**

Использовать `readStrictYaml`, `validateDocumentShape`, immutable clone и `RENDERING_DEFINITION_UNKNOWN`.

- [ ] **Step 3: Объявить manifest sources**

Добавить `rendering-foundation` и `rendering-schema`; active `source_ids` не менять. Текущая generic source schema уже допускает эти записи, поэтому manifest остаётся `1.1.0`, а `schemas/manifest.schema.json` в этом пакете не изменяется.

- [ ] **Step 4: Подключить validation и проверить**

```powershell
node --test tests/foundation/rendering-foundation.test.mjs tests/foundation/system-manifest.test.mjs
npm run validate
npm test
git commit -m "feat: add structured rendering foundation"
```

Gate: foundation не содержит component-specific значений.

---

### Package 3: Renderer registry, typed content slots и pilot contracts

**Files:**
- Create: `data/renderers/registry.yaml`
- Create: `schemas/renderer-registry.schema.json`
- Create: `scripts/lib/renderer-registry.mjs`
- Create: `tests/rendering/renderer-registry.test.mjs`
- Modify: component schema/loader, three registry documents, readiness auditor и manifest validation.

**Interfaces:**
- `loadRendererRegistry({ repoRoot })`.
- `resolveRendererCoverage(registry, componentId)`.
- `validateRendererReadyComponent(record, coverage)`.
- Pilot: `email-template`, `button-primary`, `card-image`, `banner-secondary`, `banner-app-download`, `email-footer`.

- [ ] **Step 1: Добавить optional `content_slots` в element schema**

```yaml
content_slots:
  - { id: text, type: rich-text, required: true }
  - { id: href, type: url, required: true }
```

Types: `plain-text`, `rich-text`, `url`, `placeholder`, `alt-text`, `number`. Поднять components schema/documents до `2.1.0`.

- [ ] **Step 2: Добавить readiness semantics**

`html-text` требует `text`; `html-link` требует `href`, а собственный `text` — только без видимых children; `direct-image` требует явный `alt` slot, где пустая строка допустима только как осознанная decorative value; `background-image` не получает HTML `alt`, а при смысловом изображении требует доступный live-text equivalent в том же компоненте; generic `description-N` запрещён covered-компоненту; layout fact принадлежит управляющему узлу.

- [ ] **Step 3: Создать registry**

```yaml
schema_version: 1.0.0
registry: { id: email-renderers, status: shadow }
coverage:
  - { component_id: email-template, mode: interpreter }
  - { component_id: button-primary, mode: interpreter }
  - { component_id: card-image, mode: interpreter }
  - { component_id: banner-secondary, mode: interpreter }
  - { component_id: banner-app-download, mode: interpreter }
  - { component_id: email-footer, mode: interpreter }
```

Modes: `interpreter`, `recipe`, `custom`, `source-only`, `unsupported`. `recipe_id`, `handler_id`, `reason` разрешаются только соответствующему mode.

- [ ] **Step 4: Нормализовать шесть pilot contracts**

Переименовать generic facts по фактическому смыслу, перенести их к точным children и добавить slots. Не менять числа, identities, fingerprints, properties, variants, assets, purpose или дизайн. Неясный факт блокирует пакет и выносится пользователю как exact path-вопрос.

- [ ] **Step 5: Проверить pilot contracts**

```js
for (const id of pilotIds) {
  const coverage = resolveRendererCoverage(registry, id);
  assert.equal(coverage.mode, "interpreter");
  assert.deepEqual(validateRendererReadyComponent(index.bySystemId.get(id), coverage), []);
}
```

Отдельно сохранить: Secondary Mobile direct/Desktop background, Card fluid width + auto height, Template shell/Slot, store icon/text separation.

- [ ] **Step 6: Проверить и commit**

```powershell
npm run audit:rendering
node --test tests/rendering/renderer-registry.test.mjs tests/rendering/renderer-readiness.test.mjs
npm run verify
git commit -m "feat: make pilot component contracts renderer ready"
```

Gate: меняется машинная семантика, но не Figma и не фактические значения.

---

### Package 4: Разделённый Core

**Files:** create four Core files and `tests/characterization/core-split.test.mjs`; modify manifest; preserve legacy prompt.

- [ ] **Step 1: Зафиксировать boundary test** — новые files не содержат component IDs, Figma node IDs и таблицы structured definitions.
- [ ] **Step 2: Разделить владельцев** — HTML principles, typography usage, asset export process и library maintenance получают по одному файлу.
- [ ] **Step 3: Создать semantic mapping legacy rule → new owner** — каждое значимое правило имеет ровно одного владельца.
- [ ] **Step 4: Объявить sources без active route switch**.
- [ ] **Step 5: Проверить и commit**.

```powershell
node --test tests/characterization/core-split.test.mjs
npm run verify
git commit -m "docs: split CUPIS core responsibilities"
```

---

### Package 5: Email-примитивы и contract-tree interpreter

**Files:** create `email-primitives.mjs`, `email-interpreter.mjs` и два unit test files.

**Interfaces:**
- `renderPrimitive(id, props, children = "") -> string`.
- `pairViewportTrees({ mobile, desktop }) -> paired tree`.
- `renderContractTree({ component, coverage, content, assets, properties, foundations }) -> { html, css, diagnostics }`.

- [ ] **Step 1: Snapshot tests** для table/cell, text, link, direct/background image и visibility; текст HTML-экранируется.
- [ ] **Step 2: Чистые primitives** без filesystem, registry, Figma и component IDs. Критические email-стили сразу выводятся inline; media-query rules используются только для responsive overrides.
- [ ] **Step 3: Viewport pairing tests** — объединение только при точном совпадении ID/role/mode/visibility/refs/order; иначе минимальный split subtree.
- [ ] **Step 4: Interpreter dispatch**.

```js
const handlers = Object.freeze({
  "presentation-table": renderPresentationTable,
  "html-text": renderText,
  "html-link": renderLink,
  "direct-image": renderDirectImage,
  "background-image": renderBackgroundImage,
  "nested-component": renderNestedComponent,
  slot: renderSlot,
  "figma-source-only": renderNothing,
  none: renderNothing,
});
```

Unknown mode → `RENDER_MODE_UNSUPPORTED`.

- [ ] **Step 5: Test no component-specific logic** — сканировать модули на pilot IDs.
- [ ] **Step 6: Verify and commit**.

```powershell
node --test tests/rendering/email-primitives.test.mjs tests/rendering/email-interpreter.test.mjs
npm run verify
git commit -m "feat: add deterministic email contract interpreter"
```

---

### Package 6: Representative pilot

**Files:** create `email-renderer.mjs`, `pilot-email.json`, `pilot-components.test.mjs`; registry меняется только при доказанном recipe.

**Interfaces:**
- `renderComponent({ componentId, viewportData, rendererRegistry, componentIndex, foundations })`.
- `renderEmailDocument(model, dependencies) -> { html, assets, diagnostics }`.

- [ ] **Step 1: Fixture** — root Template, explicit variants/properties, typed content и asset paths; без Figma response и raw HTML.
- [ ] **Step 2: Tests** — Slot without geometry; live Button; Card width 100% + Desktop width + height auto; Secondary Mobile direct/Desktop background; App Download icon/text + Mobile stacking; Footer properties.
- [ ] **Step 3: Recursive rendering** — nested components только exact ID; cycle → `RENDER_COMPONENT_CYCLE`.
- [ ] **Step 4: Stop on missing universal capability** — handler не добавлять молча; показать exact component/path и запросить review.
- [ ] **Step 5: Verify and commit**.

```powershell
node --test tests/rendering/pilot-components.test.mjs
npm run verify
git commit -m "feat: prove renderer on representative components"
```

Gate: пилот проходит без ручной правки HTML.

---

### Package 7: Нормализованная модель, CLI и atomic output

**Files:** create email model schema/loader, postprocess, output, CLI and tests; modify package commands.

**Interfaces:**
- `loadEmailModel({ modelPath, schemaPath })`.
- `validateEmailModelSemantics(model, dependencies)`.
- `postprocessEmail({ html, policy }) -> html`.
- `publishEmailAtomically({ outputDir, html, assets })`.
- CLI: `node scripts/render-email.mjs --model <temp-json> --output <version-folder>`.

- [ ] **Step 1: Model schema**.

```json
{
  "instance_id": "figma-instance-id",
  "component_id": "card-image",
  "variants": { "mobile": "mobile", "desktop": "desktop" },
  "property_values": [],
  "content_values": [
    { "element_id": "heading", "slot_id": "text", "scope": "all", "value": { "type": "rich-text", "segments": [{ "type": "text", "value": "Заголовок" }] } }
  ],
  "asset_files": [
    { "asset_contract_id": "card-image", "path": "images/card-image.jpg" }
  ]
}
```

Scopes: `all`, `mobile`, `desktop`; conflicting bindings forbidden.

- [ ] **Step 2: Semantic tests** — unknown IDs, missing slot, duplicate binding, absolute/escaping path, type mismatch.
- [ ] **Step 3: Allowlisted postprocess** — выполняет только normalize attributes, strip technical markers и local-src validation; unknown/forbidden transformer возвращает diagnostic. Общий CSS parser/inliner не добавляется, потому что критические стили уже создают primitives.
- [ ] **Step 4: Atomic output** — sibling staging, validation, rename; existing non-empty output never overwritten; safe cleanup only within staging.
- [ ] **Step 5: CLI** has no MCP/network and не копирует temp model в output.
- [ ] **Step 6: Failure test** подтверждает неизменный digest existing output.
- [ ] **Step 7: Verify and commit**.

```powershell
node --test tests/rendering/email-model.test.mjs tests/rendering/email-output.test.mjs
npm run verify
git commit -m "feat: add atomic email rendering CLI"
```

---

### Package 8: Render-impact digest и diagnostics

**Files:** create `render-impact.mjs` and test; modify diagnostics, renderer and CLI.

**Interfaces:**
- `buildRenderImpactProjection({ component, coverage, foundations })`.
- `digestRenderImpact(input) -> sha256:<hex>`.
- `formatRendererDiagnostics(errors) -> string`.

- [ ] **Step 1: Inclusion/exclusion tests** — tree/mode/visibility/property/variant/asset/resolved foundation/recipe меняют digest; purpose/docs/Description/verified_at не меняют.
- [ ] **Step 2: Projection** использует существующий `digestStructuredEntries`; digest нигде не хранится вручную.
- [ ] **Step 3: Stable diagnostics** печатают component/path без stack trace для expected blockers.
- [ ] **Step 4: Build metadata comment** содержит renderer version, system commit и digest без absolute paths/secrets.
- [ ] **Step 5: Verify and commit**.

```powershell
node --test tests/rendering/render-impact.test.mjs tests/rendering/pilot-components.test.mjs
npm run verify
git commit -m "feat: protect renderer compatibility with impact digests"
```

---

### Package 9: Автоматические HTML и property checks

**Files:** create `html-invariants.test.mjs`; extend pilot tests; modify test command/local validation only if needed.

- [ ] **Step 1:** проверить table structure, local src, forbidden filesystem paths, dimensions, fluid `@2x` height auto, placeholders и deterministic order.
- [ ] **Step 2:** small Boolean sets — exhaustive; остальные — every branch + declared critical interactions. Каждая visibility branch встречается в тесте.
- [ ] **Step 3:** добавить `tests/rendering/*.test.mjs` в package test command.
- [ ] **Step 4:** verify and commit.

```powershell
npm run verify
git commit -m "test: enforce rendered email invariants"
```

---

### Package 10: Mobile/Desktop visual scenarios

**Files:** create preview CLI, visual tests and deterministic Mobile/Desktop expected HTML fixtures.

**Interfaces:** `node scripts/render-email-preview.mjs --model <fixture> --viewport mobile|desktop --output <temp-path>`.

- [ ] **Step 1:** expected fixtures содержат только system pilot, не production письмо.
- [ ] **Step 2:** tests сравнивают declared widths, responsive classes и image ratios; Card отдельно доказывает пропорциональную высоту.
- [ ] **Step 3:** manual browser gate сравнивает временные Mobile/Desktop preview с pilot Figma variants; screenshots не коммитятся.
- [ ] **Step 4:** browser preview не подменяет Litmus/Email on Acid/CRM, которые остаются optional.
- [ ] **Step 5:** verify and commit.

```powershell
node --test tests/rendering/visual-scenarios.test.mjs
npm run verify
git commit -m "test: add representative viewport rendering scenarios"
```

---

### Package 11: Остальные active components

**Files:** modify three component files, renderer registry, generated docs; create `all-components.test.mjs`.

- [ ] **Step 1: Shared** — semantic facts/slots/coverage; internal glyphs → `source-only`.
- [ ] **Step 2: Marketing** — preserve exact contracts/properties/assets/numbers. `Banner/App-Download-Large` получает coverage mode `unsupported` и reason `visual-experiment-not-for-production`; его Figma status и дизайн не меняются.
- [ ] **Step 3: Service** — та же schema без service-specific foundation; ambiguity blocks exact record.
- [ ] **Step 4: Full coverage assertions**.

```js
const report = auditRendererReadiness(registries, rendererRegistry);
assert.equal(report.summary.generic_description_facts, 0);
assert.equal(report.summary.missing_coverage, 0);
assert.equal(report.summary.covered_active_components, 61);
```

Каждый active record имеет coverage. `source-only` и `unsupported` входят в covered count, но не в renderable count и при standalone render возвращают понятный blocker.

- [ ] **Step 5:** `npm run generate`, `generate:check`, all-components test, verify.
- [ ] **Step 6:** три reviewable commits: shared, marketing, service; generated docs в последнем.

Gate: no generic facts/unregistered active records/unexplained value changes; Figma unchanged.

---

### Package 12: Structured workflows и shadow comparison

**Files:** create two workflow data files, schema, loader, workflow and characterization tests; modify context bundle, `system/manifest.yaml`, `schemas/manifest.schema.json` and manifest tests; preserve archived Markdown workflows in `Legacy/` and current skill.

**Interfaces:**
- `loadWorkflowRegistry({ repoRoot, workflowId })`.
- `resolveWorkflowSteps(workflow, mode) -> ordered steps`.
- Bundle допускает только `structured-shadow`; архивный `Legacy/` не становится режимом bundle и читается отдельно только для comparison.

- [ ] **Step 1: Workflow schema** — ID, status shadow, modes, ordered steps, required inputs, blockers, allowed outputs, handoff; ссылки на manifest source IDs без копии technical rules. Добавить structured-workflow capability в manifest schema и поднять manifest/schema loader с `1.1.0` до `1.2.0` в одном commit.
- [ ] **Step 2: Maintenance workflow** — impact report, cloud GitHub, Figma gate/readback и stop conditions.
- [ ] **Step 3: Email workflow** — NEW BUILD/CONTINUE/FIX, link validation, local versions, MCP asset export, temp model, CLI, final `email.html` + `images/`.
- [ ] **Step 4: Structured shadow bundle** — архивные paths не допускаются в bundle; попытка смешать их со structured sources возвращает явную ошибку, а не активирует legacy mode.
- [ ] **Step 5: Semantic comparison** — каждое обязательство из сохранённого `Legacy/` read-only baseline связано с новым owner; различия объяснены проверенными фактами и approved renderer spec, а не автоматически перенесены в contracts.
- [ ] **Step 6: No hidden cutover** — текущие paused route lists и skill не переключены; `Legacy/`, Figma и письма не изменены.
- [ ] **Step 7: Verify and commit**.

```powershell
node --test tests/workflows/structured-workflows.test.mjs tests/characterization/html-rendering-shadow.test.mjs
npm run verify
git commit -m "feat: prepare structured email workflows in shadow mode"
```

Gate: Stage 8 готовит новый маршрут; Stage 9 отдельно переключает maintenance skill.

---

## Final Stage 8 Verification

- [ ] Свежий branch SHA сравнен с актуальным `main`.
- [ ] `npm run audit:rendering`: zero generic facts и zero missing coverage.
- [ ] `npm run generate:check`, `npm run validate`, `npm test`, `npm run verify` проходят.
- [ ] Node 24 и Windows bootstrap проверки локально пройдены на точном SHA.
- [ ] Representative NEW BUILD атомарно создаёт только `email.html` и `images/` во временной test folder.
- [ ] Intentional failure не меняет существующую version folder.
- [ ] Mobile/Desktop pilot previews проверены визуально.
- [ ] Текущие paused route source lists и maintenance skill не изменены; archived baseline не подключён к HTML-build bundle.
- [ ] Figma, production-письма и реальные assets не изменены.
- [ ] Allowed diff не содержит непредусмотренных файлов.
- [ ] Roadmap/active context обновляются после merge и по команде пользователя.

## Execution Rule

План выполняется пакетами 1–12. После каждого merge исполнитель простыми словами сообщает результат, фактические проверки и номер следующего доступного пакета. Pilot gates и зависимости нельзя перепрыгивать.
