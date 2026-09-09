# CUPIS Component Documentation Contracts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Ввести единые проверяемые правила полного component contract для generated registry и компактного Figma Description, удалить дублирующую prose-модель из structured component records и подготовить безопасную интеграцию с generated docs, routes, workflows и skills.

**Architecture:** data/components/*.yaml остаются единственным владельцем component-specific фактов. Полный Markdown-реестр и короткий Figma Description становятся двумя детерминированными представлениями одной записи: registry renderer выводит полный resolved contract, а Figma renderer публикует только stable ID, purpose, вычисленный render type и выбранные critical constraints. Общие правила остаются в Core/foundations, Figma Description не является входом HTML-вёрстки, а фактическая запись в Figma выполняется позднее отдельным MCP-only workflow после preview и разрешения пользователя.

**Tech Stack:** Node.js 24, ECMAScript modules (.mjs), YAML 2.9.0, AJV 8.20.0, JSON Schema Draft 2020-12, node:test, GitHub connector, Figma MCP.

**Spec:** docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md, разделы 2, 3, 5–12, 14–16.

## Global Constraints

- Перед реализацией закрепить свежий main и повторно прочитать manifest, roadmap, этот plan и план generated docs.
- Этот подэтап является prerequisite между пакетом №1 и пакетом №2 этапа 7; Task 4 generated-docs нельзя выполнять по прежней модели.
- Не терять ни один действующий component-specific факт, Mobile/Desktop contract, property, asset contract, provenance или structure fingerprint.
- Mobile и Desktop остаются самостоятельными полными контрактами; inheritance и формулировки «как Desktop» запрещены.
- Полное описание компонента выводится из structured contract; отдельный вручную составленный полный prose Description запрещён.
- Figma Description не является источником для email-new-build или email-continue-fix.
- Общие typography, spacing, assets, naming и HTML-правила не копируются в component records; references разрешаются renderer или context builder.
- Figma не изменяется в технических задачах этого плана. Figma sync выполняется отдельной задачей только после preview, impact report и отдельного разрешения пользователя.
- Existing legacy Markdown registry остаётся comparison baseline до shadow comparison и общего cutover.
- Core/workflows/skills не переключаются в implementation PR этого подэтапа; их интеграция выполняется на этапах 8–9.
- Конкретные email.html, images, Figma snapshots и локальные письма в репозиторий не добавляются.
- Каждый task заканчивается отдельным проверяемым commit; merge требует отдельной команды пользователя.

---

## Целевая карта файлов подэтапа

### Создать

- core/component-contract-standard.md — нормативные принципы полной component-записи и generated registry.
- core/figma-component-description-standard.md — правила компактной Figma-проекции.
- scripts/lib/component-registry-doc.mjs — полный human-readable renderer одного component contract.
- system/migrations/components-1-to-2.mjs — одноразовый deterministic converter старой component schema.
- system/migrations/components-1-to-2.yaml — reviewed mapping только для purpose и component-specific constraints, которые нельзя безопасно вывести из старого prose.
- tests/characterization/component-documentation-boundary.test.mjs
- tests/components/component-documentation-model.test.mjs
- tests/components/component-registry-doc.test.mjs
- tests/components/figma-component-description.test.mjs
- tests/components/component-documentation-migration.test.mjs

### Изменить

- docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md
- docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md
- docs/superpowers/plans/2026-09-07-cupis-generated-docs-context-bundles.md
- schemas/components.schema.json
- data/components/shared.yaml
- data/components/marketing.yaml
- data/components/service.yaml
- scripts/lib/component-description.mjs
- scripts/lib/component-registry.mjs
- scripts/validate-system.mjs
- tests/helpers/system-fixture.mjs
- system/manifest.yaml только для shadow source declarations после появления файлов стандартов
- README.md только для объяснения новой ответственности файлов

### Сохранить без изменений

- визуальный дизайн и структура Figma-компонентов;
- descriptions Figma до отдельного sync;
- data/foundations/**;
- core/email-figma-prompt.md;
- workflows/** и .agents/skills/** до этапов 8–9;
- legacy registry/** до общего cutover;
- пакет №1 PR №43 и его manifest/digest foundation по смыслу;
- локальные проекты писем.

---

### Task 1: Зафиксировать нормативную границу документации компонента

**Files:**
- Create: core/component-contract-standard.md
- Create: core/figma-component-description-standard.md
- Modify: docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md
- Test: tests/characterization/component-documentation-boundary.test.mjs

**Interfaces:**
- Produces: определения владельцев данных, обязательных полей полного contract и допустимой компактной Figma-проекции.
- Preserves: foundations как владельцы общих rules и values; component records как владельцы только component-specific фактов.

- [x] **Step 1: Написать failing boundary test**

Проверить наличие двух стандартов и обязательных утверждений:

~~~js
assert.match(contractStandard, /structured component contract/u);
assert.match(contractStandard, /Mobile.*Desktop/u);
assert.match(contractStandard, /не дублиру/u);
assert.match(figmaStandard, /CUPIS ID/u);
assert.match(figmaStandard, /PURPOSE/u);
assert.match(figmaStandard, /RENDER/u);
assert.match(figmaStandard, /CRITICAL/u);
assert.match(figmaStandard, /не является.*HTML/u);
~~~

Проверить, что Figma standard не объявляет полные sections typography, spacing или весь email workflow.

- [x] **Step 2: Запустить RED**

Run:

~~~powershell
node --test tests/characterization/component-documentation-boundary.test.mjs
~~~

Expected: FAIL, потому что стандарты отсутствуют.

- [x] **Step 3: Написать component contract standard**

Зафиксировать обязательные группы данных:

- identity, status, library и Figma provenance;
- purpose;
- independent Mobile/Desktop structure and facts;
- variants и properties с явным эффектом;
- nested component references;
- foundation references без копии общего правила;
- asset contracts;
- component-specific constraints;
- generated registry order;
- onboarding нового неизвестного компонента;
- запрет ручного полного prose-template.

Уточнить: «полный» означает достаточный для однозначной реализации, а не инвентарь всех безвредных Figma-настроек.

- [x] **Step 4: Написать Figma Description standard**

Задать единственный порядок:

~~~text
CUPIS ID: <stable-id>
PURPOSE: <one sentence>
RENDER: HTML | ASSET | HYBRID

CRITICAL
- <only selected critical constraints>
~~~

CRITICAL отсутствует при пустом списке. PURPOSE и CRITICAL берутся только из component record. Documentation link хранится отдельным полем Figma. Description не используется email-build routes.

- [x] **Step 5: Обновить master-spec**

Добавить новую ответственность источников, два target Core-файла, full registry projection, thin Figma projection и разделение route consumers.

- [x] **Step 6: Запустить GREEN и commit**

Run:

~~~powershell
node --test tests/characterization/component-documentation-boundary.test.mjs
~~~

Expected: PASS.

Commit:

~~~powershell
git add core/component-contract-standard.md core/figma-component-description-standard.md docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md tests/characterization/component-documentation-boundary.test.mjs
git commit -m "docs: define component documentation contracts"
~~~

---

### Task 2: Зафиксировать эквивалентность существующих component records

**Files:**
- Modify: tests/characterization/component-documentation-boundary.test.mjs
- Use: registry/email-component-descriptions-registry.md
- Use: data/components/shared.yaml
- Use: data/components/marketing.yaml
- Use: data/components/service.yaml

**Interfaces:**
- Produces: baseline обязательных component IDs, viewport trees, properties, assets, references, constraints и provenance, которые должны пережить migration.
- Does not produce: новый текст Description или Figma mutation.

- [x] **Step 1: Сформировать characterization snapshot в тесте**

Для каждой component-записи вычислить canonical object без старого description.blocks:

~~~js
{
  id,
  status,
  identity,
  figma,
  variants,
  properties,
  asset_contracts,
  contracts,
  provenance
}
~~~

Проверить точное число компонентов по трём библиотекам и уникальность stable IDs/Figma identity.

- [x] **Step 2: Зафиксировать high-risk assertions**

Проверить representative contracts:

- adaptive @2x image сохраняет aspect ratio;
- @4x asset сохраняет PNG/alpha contract;
- composite/card export boundary не заменяется Fill-only экспортом;
- Mobile/Desktop contracts существуют независимо;
- property-controlled visibility сохраняет property reference;
- root template остаётся assembly shell, а не обычным content component.

- [x] **Step 3: Запустить baseline**

Run:

~~~powershell
node --test tests/characterization/component-documentation-boundary.test.mjs
~~~

Expected: PASS до и после migration.

- [x] **Step 4: Commit**

~~~powershell
git add tests/characterization/component-documentation-boundary.test.mjs
git commit -m "test: preserve component documentation semantics"
~~~

---

### Исполнение Tasks 3–4 единым пакетом

Tasks 3 и 4 выполняются атомарно: schema 2.0.0, migration converter, reviewed mapping и все три canonical registry должны завершать пакет вместе. Тесты `tests/components/*.test.mjs` входят в общий `npm test`, поэтому промежуточный runtime с новой schema и старыми data-файлами не публикуется.

Компактный Description renderer и его comparison были подключены в этом пакете как обязательная runtime-зависимость существующей Figma snapshot-проверки. Это не закрывает Task 6: отдельные forbidden-content tests и окончательная проверка интерфейса остаются обязательными.

### Task 3: Заменить prose Description типизированной documentation-моделью

**Files:**
- Modify: schemas/components.schema.json
- Modify: scripts/lib/component-registry.mjs
- Create: system/migrations/components-1-to-2.mjs
- Create: system/migrations/components-1-to-2.yaml
- Create: tests/components/component-documentation-model.test.mjs
- Create: tests/components/component-documentation-migration.test.mjs

**Interfaces:**
- Produces:
  - deterministic migration from component schema 1.0.0 to 2.0.0;
  - documentation.purpose: non-empty string;
  - documentation.critical_constraint_ids: unique stable IDs;
  - constraints[]: typed component-specific rules;
  - deriveComponentRenderType(record): HTML | ASSET | HYBRID;
  - validateComponentDocumentation(record, index): diagnostics[].
- Removes after migration: description.mode и description.blocks как canonical model.

- [x] **Step 1: Написать failing shape tests**

Проверить accepted shape:

~~~yaml
documentation:
  purpose: Вторичный промобаннер с текстовой и визуальной областями.
  critical_constraint_ids:
    - mobile-image-preserve-ratio
constraints:
  - id: mobile-image-preserve-ratio
    scope: mobile
    kind: responsive-image
    severity: critical
    statement: Изображение меняет ширину только с пропорциональным изменением высоты.
~~~

Добавить negative cases: duplicate ID, unknown constraint reference, empty purpose, unsupported scope/kind/severity, extra field.

- [x] **Step 2: Запустить RED**

Run:

~~~powershell
node --test tests/components/component-documentation-model.test.mjs
~~~

Expected: FAIL на старой schema.

- [x] **Step 3: Поднять component schema major version**

Удаление/rename обязательного description field является breaking migration. Поднять schema version до `2.0.0`, не поддерживать два runtime-формата параллельно.

- [x] **Step 4: Написать failing migration tests**

Проверить, что converter:

- принимает только schema `1.0.0`;
- сохраняет identity, Figma, variants, properties, assets, contracts и provenance побайтово после canonical normalization;
- добавляет purpose и constraints только из reviewed mapping по stable component ID;
- блокирует отсутствующий или лишний mapping entry;
- не переносит `description.blocks` в output;
- выдаёт schema `2.0.0` и одинаковый output при повторном запуске.

Run:

~~~powershell
node --test tests/components/component-documentation-migration.test.mjs
~~~

Expected: FAIL, converter отсутствует.

- [x] **Step 5: Реализовать migration converter и reviewed mapping**

Converter не интерпретирует свободный prose автоматически. Mapping содержит только недостающие `purpose`, `constraints` и `critical_constraint_ids`; он является временным историческим migration input, а не runtime source или foundation.

- [x] **Step 6: Реализовать semantic validation**

Обязательные diagnostics:

- COMPONENT_PURPOSE_MISSING;
- COMPONENT_CONSTRAINT_ID_DUPLICATE;
- COMPONENT_CRITICAL_CONSTRAINT_UNKNOWN;
- COMPONENT_CRITICAL_CONSTRAINT_NOT_CRITICAL;
- COMPONENT_RENDER_TYPE_UNRESOLVED;
- COMPONENT_DOCUMENTATION_LEGACY_BLOCKS_FORBIDDEN.

Каждый diagnostic содержит component ID и JSON-pointer path.

- [x] **Step 7: Реализовать render-type derivation**

Алгоритм читает все фактически выводимые render modes выбранных contracts:

- только HTML/presentation/nested без image modes → HTML;
- только image output без HTML content → ASSET;
- HTML и image output вместе → HYBRID;
- none или неоднозначный Figma-source-only contract → typed blocker, не догадка.

- [x] **Step 8: Запустить GREEN и commit**

Run:

~~~powershell
node --test tests/components/component-documentation-model.test.mjs tests/components/component-documentation-migration.test.mjs
~~~

Expected: PASS на fixture новой модели и deterministic migration.

Commit:

~~~powershell
git add schemas/components.schema.json scripts/lib/component-registry.mjs system/migrations/components-1-to-2.mjs system/migrations/components-1-to-2.yaml tests/components/component-documentation-model.test.mjs tests/components/component-documentation-migration.test.mjs
git commit -m "feat: model component documentation contracts"
~~~

---

### Task 4: Мигрировать shared, marketing и service records без потери смысла

**Files:**
- Modify: data/components/shared.yaml
- Modify: data/components/marketing.yaml
- Modify: data/components/service.yaml
- Modify: tests/helpers/system-fixture.mjs
- Test: tests/characterization/component-documentation-boundary.test.mjs
- Test: tests/components/component-documentation-model.test.mjs

**Interfaces:**
- Consumes: новая schema и characterization baseline.
- Produces: один текущий format всех component records без description.blocks.

- [x] **Step 1: Сгенерировать и проверить migration output**

Run converter для всех трёх registries во временную папку fixture, проверить schema 2.0.0 и characterization equivalence. При blocker не исправлять mapping догадкой: вернуться к конкретной component-записи и доказать purpose/constraint по baseline.

- [x] **Step 2: Мигрировать shared records**

Для каждой записи:

- добавить purpose;
- вынести только уникальные implementation rules в constraints;
- выбрать critical constraints по формальным категориям;
- удалить prose-повторы contracts, properties, assets и foundations;
- сохранить identity, Figma provenance, viewport trees и fingerprints.

Run tests. Expected: PASS.

- [x] **Step 3: Commit shared migration**

~~~powershell
git add data/components/shared.yaml
git commit -m "data: migrate shared component documentation"
~~~

- [x] **Step 4: Мигрировать marketing records**

Повторить ту же операцию. Особо проверить cards, Banner/Secondary, Banner/App-Download, adaptive @2x images и composite export boundaries.

Run tests. Expected: PASS.

- [x] **Step 5: Commit marketing migration**

~~~powershell
git add data/components/marketing.yaml
git commit -m "data: migrate marketing component documentation"
~~~

- [x] **Step 6: Мигрировать service records**

Особо проверить root/self inset, NPS gaps, alert/notification nested components и property-controlled visibility.

Run tests. Expected: PASS.

- [x] **Step 7: Commit service migration**

~~~powershell
git add data/components/service.yaml tests/helpers/system-fixture.mjs
git commit -m "data: migrate service component documentation"
~~~

---

### Task 5: Реализовать полный registry renderer

**Files:**
- Create: scripts/lib/component-registry-doc.mjs
- Create: tests/components/component-registry-doc.test.mjs
- Modify: scripts/lib/component-registry.mjs

**Interfaces:**
- Produces:
  - renderComponentRegistrySection(record, index): string;
  - resolveFoundationReference(reference, foundations): resolved display value;
  - listComponentDocumentationSections(record): fixed ordered model.
- Consumes: validated component record и foundation index.

- [x] **Step 1: Написать failing renderer tests**

Проверить fixed order:

~~~text
Identity and purpose
Structure and rendering
Desktop
Mobile
Properties and variants
Assets and interaction
Constraints and dependencies
~~~

Проверить отсутствие «как Desktop», отсутствие ручного prose template и наличие resolved foundation ID + exact value.

- [x] **Step 2: Запустить RED**

Run:

~~~powershell
node --test tests/components/component-registry-doc.test.mjs
~~~

Expected: FAIL, module отсутствует.

- [x] **Step 3: Реализовать deterministic renderer**

Renderer обходит существующую contract tree через exported traversal helpers, не создаёт второй reference resolver и не меняет record. Optional sections пропускаются, но порядок остальных стабилен.

- [x] **Step 4: Проверить representative records**

Проверить HTML-only, asset-only, hybrid, nested component, property-controlled и template shell cases. Два render одного input должны быть побайтово равны.

- [x] **Step 5: Запустить GREEN и commit**

~~~powershell
node --test tests/components/component-registry-doc.test.mjs
~~~

Expected: PASS.

Commit:

~~~powershell
git add scripts/lib/component-registry-doc.mjs scripts/lib/component-registry.mjs tests/components/component-registry-doc.test.mjs
git commit -m "feat: render full component registry sections"
~~~

---

### Task 6: Сократить Figma Description до безопасной проекции

**Files:**
- Modify: scripts/lib/component-description.mjs
- Create: tests/components/figma-component-description.test.mjs

**Interfaces:**
- Produces:
  - renderFigmaComponentDescription(record, index): string;
  - compareFigmaComponentDescription(expected, actual): diagnostics[].
- Consumes: stable ID, purpose, derived render type и referenced critical constraints.

- [x] **Step 1: Написать failing exact-output tests**

Expected:

~~~text
CUPIS ID: banner-secondary
PURPOSE: Вторичный промобаннер с текстовой и визуальной областями.
RENDER: HYBRID

CRITICAL
- Изображение меняет ширину только с пропорциональным изменением высоты.
~~~

Проверить вариант без CRITICAL, LF normalization и deterministic output.

- [x] **Step 2: Добавить forbidden-content tests**

Description не должен выводить:

- полный Desktop/Mobile tree;
- таблицы typography/spacing;
- все properties или variants;
- provenance/fingerprint/node ID;
- правила сборки всего письма;
- факты, не выбранные critical_constraint_ids.

- [x] **Step 3: Реализовать renderer и comparison**

Comparison возвращает exact description drift. Никакой Figma client и write в модуле не добавляется.

- [x] **Step 4: Запустить GREEN и commit**

~~~powershell
node --test tests/components/figma-component-description.test.mjs
~~~

Expected: PASS.

Commit:

~~~powershell
git add scripts/lib/component-description.mjs tests/components/figma-component-description.test.mjs
git commit -m "feat: render compact Figma component descriptions"
~~~

---

### Task 7: Подключить стандарты и validation в shadow-режиме

**Files:**
- Modify: system/manifest.yaml
- Modify: scripts/lib/system-manifest.mjs
- Modify: tests/foundation/system-manifest.test.mjs
- Modify: tests/helpers/system-fixture.mjs
- Modify: README.md
- Preserve: scripts/validate-system.mjs как единый CLI entrypoint
- Test: tests/characterization/component-documentation-boundary.test.mjs

**Interfaces:**
- Produces: manifest source IDs для двух стандартов и обязательную проверку их canonical kind/path.
- Preserves: legacy bundle_profiles[].source_ids, routes, skill behavior и границу будущего generated layer.

- [x] **Step 1: Написать failing manifest assertions**

Проверено существование source IDs:

~~~text
component-contract-standard
figma-component-description-standard
~~~

Дополнительно зафиксированы canonical kind/path и отсутствие обоих sources во всех действующих bundle profiles.

RED evidence: System validation run #207 — прежние 305 тестов прошли; 7 новых assertions ожидаемо упали только из-за отсутствующих declarations и их semantic guards.

- [x] **Step 2: Объявить новые sources**

Оба Core-файла объявлены в manifest с `kind: core`. Ни один legacy `bundle_profiles[].source_ids` не изменён. Подключение к итоговым generated bundles остаётся отдельной задачей downstream-плана.

- [x] **Step 3: Подключить system validation без дублирования**

`validateSystem` теперь требует оба source ID, их canonical paths и `kind: core` до перехода к foundation/component validation.

Фактический порядок остаётся:

~~~text
manifest и обязательные source declarations
→ foundations
→ component schema/cross-references
→ documentation semantics
~~~

Documentation semantics уже вызывается внутри `validateComponentRegistries` после schema и cross-reference checks; второй вызов не добавлялся. Полный registry renderer и компактный Figma renderer проверяются общим `npm test`. Проверка будущих файлов `docs/generated/**` не имитируется до их появления и остаётся Task 5 generated-docs plan.

`scripts/validate-system.mjs` не менялся: он уже является единым read-only CLI entrypoint поверх `validateSystem`.

- [x] **Step 4: Обновить README**

README простым языком фиксирует:

- component data — владелец component-specific contract;
- registry renderer — полная документационная проекция;
- Figma Description — компактная вспомогательная проекция;
- будущие generated outputs пересобираются и не редактируются вручную;
- email build не зависит от Figma Description;
- до cutover legacy Markdown registry остаётся активным route input.

- [x] **Step 5: Запустить проверки и commit**

GREEN evidence: System validation run #208:

- `npm run validate` — success;
- `npm test` — 312/312 success;
- `bootstrap/verify.ps1` — success;
- `tests/bootstrap-contract.Tests.ps1` — success.

`npm run verify` является последовательностью тех же `npm run validate && npm test`; обе составляющие выполнены в одном fresh CI run.

Commits:

~~~text
60c3875 test: require component documentation shadow sources
c2eb80b feat: integrate component documentation foundation
~~~

---

### Task 8: Финальная проверка подэтапа и handoff в generated docs

**Files:**
- Modify only if a test exposes an in-scope defect.
- Preserve: workflows/**, .agents/skills/**, Figma, legacy registry/** и package №1 PR №43.

**Interfaces:**
- Produces: проверенное основание schema 2.0.0, full registry renderer и compact Figma renderer для продолжения существующего generated-docs plan.
- Does not produce: generated docs, workflow cutover, skill cutover или Figma mutation.

- [ ] **Step 1: Запустить targeted tests**

~~~powershell
node --test tests/characterization/component-documentation-boundary.test.mjs tests/components/component-documentation-model.test.mjs tests/components/component-documentation-migration.test.mjs tests/components/component-registry-doc.test.mjs tests/components/figma-component-description.test.mjs
~~~

Expected: PASS, 0 failed.

- [ ] **Step 2: Запустить полную system validation**

~~~powershell
npm run validate
npm test
npm run verify
~~~

Expected: PASS, 0 failed.

- [ ] **Step 3: Запустить Windows contracts**

~~~powershell
pwsh -NoProfile -File bootstrap/verify.ps1
pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1
~~~

Expected: оба exit 0.

- [ ] **Step 4: Проверить migration equivalence**

Подтвердить для всех трёх registries:

- unchanged canonical identity/contracts/properties/assets/provenance;
- отсутствует runtime description.blocks;
- каждый active component имеет purpose;
- все critical references разрешаются;
- два registry render и два Figma Description render дают одинаковые bytes.

- [ ] **Step 5: Проверить allowed path diff**

Допустимы только файлы из целевой карты подэтапа. Отдельно подтвердить отсутствие изменений:

~~~text
workflows/**
.agents/skills/**
registry/**
data/foundations/**
core/email-figma-prompt.md
bootstrap/**
email.html
images/**
Figma
~~~

- [ ] **Step 6: Открыть draft implementation PR и остановиться**

PR summary перечисляет schema migration, три data migrations, два standards, два renderer, validation evidence и сохранённые boundaries. Merge только по отдельной команде пользователя.

После merge обновить основание PR №43 и продолжить с изменённого Task 4 плана generated docs.

---

## Downstream integration roadmap

Следующие пункты обязательны для полного внедрения решения, но не выполняются и не коммитятся этим implementation plan. Каждый получает свой актуальный plan и отдельную approval/merge boundary.

### A. Возобновить этап 7: generated docs и context bundles

Источник действий: docs/superpowers/plans/2026-09-07-cupis-generated-docs-context-bundles.md.

- сохранить смысл уже реализованных Tasks 1–3 PR №43;
- обновить branch от main после merge подэтапа 7A;
- Task 4 использует renderComponentRegistrySection;
- compact Figma Description показывается только как auxiliary projection;
- email bundles включают selected resolved contracts и исключают Figma Description/component-authoring standards;
- завершить Tasks 4–10, validation и shadow PR.

### B. Этап 8: Core и workflows cutover

Создать отдельный implementation plan этапа 8. Он обязан распределить контекст:

~~~text
library-maintenance → contract standard + selected contract
component-onboarding → contract standard + Figma Description standard + foundations
figma-description-sync → Figma Description standard + expected compact projection
email-new-build → selected resolved Mobile/Desktop contracts
email-continue-fix → affected selected contracts
~~~

Maintenance workflow фиксирует:

~~~text
read-only analysis
→ impact report
→ user approval
→ GitHub structured data update
→ validation/generated preview
→ separate Figma approval
→ MCP write
→ readback/fingerprint/dependency checks
~~~

Email workflow не получает design-time authoring standard, Figma Description standard или Figma sync process.

### C. Отдельная Figma Description sync

Это не repository implementation task. После merge renderer и generated preview пользователь получает exact old → new Description diff по явно выбранным компонентам.

Запись разрешается только после отдельного impact report и подтверждения. Writable fields: Description и отдельно согласованный Documentation link. Используется только Figma MCP; geometry, hierarchy, properties, Auto Layout, bindings, variants, asset suffixes и design сохраняются. После записи обязателен отдельный MCP readback и fingerprint comparison.

### D. Этап 9: maintenance skill cutover

Создать отдельный implementation plan этапа 9 для .agents/skills/maintaining-cupis-email-system/SKILL.md.

Skill остаётся thin router и не копирует section names, constraints, source paths или component contracts. Он выбирает manifest route, требует impact gate, получает generated bundle и выполняет handoff. Локальная установка обновляется только из merged GitHub state.

### E. Будущие component-development и HTML-build skills

- developing-cupis-email-components использует design standard; после одобрения production component передаёт его в component-onboarding.
- будущий HTML-build skill использует только email-new-build/email-continue-fix bundles с selected resolved contracts.
- ни один из навыков не хранит собственную копию component contract или Figma Description rules.

### F. Shadow comparison, cutover и cleanup

На этапах 13–15:

- сравнить legacy и generated registry по всем component IDs и high-risk cases;
- проверить minimality/closure maintenance, onboarding, Figma sync и email bundles;
- выполнить общий cutover только после semantic equivalence;
- удалить legacy registry, migration mapping и временные comparison paths отдельной задачей после списка consumers и решения remove/preserve.

---

## Acceptance Criteria

1. Любой active component имеет полный проверяемый structured contract и purpose.
2. Mobile и Desktop описаны независимо; отсутствие обязательного viewport блокирует validation.
3. Общие foundation rules не копируются в component records.
4. Schema 2.0.0 migration детерминирована, сохраняет contract-significant данные и удаляет legacy description.blocks.
5. Полный registry renderer содержит всё необходимое для однозначной реализации компонента и показывает resolved foundation references.
6. Figma Description renderer содержит только CUPIS ID, purpose, derived render type и selected critical constraints.
7. Figma Description не является входом HTML build и может отсутствовать без потери implementation semantics.
8. Оба renderer детерминированы и не владеют отдельными facts.
9. Новый неизвестный component блокируется до onboarding и не получает component-specific schema exception.
10. Manifest объявляет два standards, но legacy routes и skills не переключаются.
11. Characterization доказывает отсутствие потери properties, assets, dependencies, provenance и fingerprints.
12. Full validation, Node tests, verify и Windows bootstrap contracts проходят.
13. Workflows, skills, Figma, legacy registries, foundations и локальные письма не изменены.
14. Existing generated-docs plan явно использует этот подэтап как prerequisite Task 4.
15. Downstream route разделяет generated docs, workflow cutover, Figma sync, skill cutover и cleanup отдельными approval boundaries.

## Self-Review Record

- **Spec coverage:** ownership, schema migration, full registry, thin Figma projection и new-component onboarding покрыты Tasks 1–8; generated docs, routes, workflows, skills, sync и cleanup имеют явные downstream plans/gates.
- **Boundary coverage:** Figma mutation, workflow cutover, skill cutover и legacy deletion отделены от implementation scope подэтапа 7A.
- **No placeholders:** каждый task содержит конкретные inputs, outputs, checks и stop conditions.
- **Interface consistency:** schema 1.0.0 + reviewed migration map → schema 2.0.0 record → full registry renderer / compact Figma renderer → downstream generated docs and route bundles.
- **Risk control:** package №1 PR №43 сохраняется; старый Task 4 блокируется до завершения prerequisite; email build не получает Figma Description или authoring standards.
