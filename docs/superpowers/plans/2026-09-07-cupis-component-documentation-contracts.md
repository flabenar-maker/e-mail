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
- tests/characterization/component-documentation-boundary.test.mjs
- tests/components/component-documentation-model.test.mjs
- tests/components/component-registry-doc.test.mjs
- tests/components/figma-component-description.test.mjs

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

- [ ] **Step 1: Написать failing boundary test**

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

- [ ] **Step 2: Запустить RED**

Run:

~~~powershell
node --test tests/characterization/component-documentation-boundary.test.mjs
~~~

Expected: FAIL, потому что стандарты отсутствуют.

- [ ] **Step 3: Написать component contract standard**

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

- [ ] **Step 4: Написать Figma Description standard**

Задать единственный порядок:

~~~text
CUPIS ID: <stable-id>
PURPOSE: <one sentence>
RENDER: HTML | ASSET | HYBRID

CRITICAL
- <only selected critical constraints>
~~~

CRITICAL отсутствует при пустом списке. PURPOSE и CRITICAL берутся только из component record. Documentation link хранится отдельным полем Figma. Description не используется email-build routes.

- [ ] **Step 5: Обновить master-spec**

Добавить новую ответственность источников, два target Core-файла, full registry projection, thin Figma projection и разделение route consumers.

- [ ] **Step 6: Запустить GREEN и commit**

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

- [ ] **Step 1: Сформировать characterization snapshot в тесте**

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

- [ ] **Step 2: Зафиксировать high-risk assertions**

Проверить representative contracts:

- adaptive @2x image сохраняет aspect ratio;
- @4x asset сохраняет PNG/alpha contract;
- composite/card export boundary не заменяется Fill-only экспортом;
- Mobile/Desktop contracts существуют независимо;
- property-controlled visibility сохраняет property reference;
- root template остаётся assembly shell, а не обычным content component.

- [ ] **Step 3: Запустить baseline**

Run:

~~~powershell
node --test tests/characterization/component-documentation-boundary.test.mjs
~~~

Expected: PASS до и после migration.

- [ ] **Step 4: Commit**

~~~powershell
git add tests/characterization/component-documentation-boundary.test.mjs
git commit -m "test: preserve component documentation semantics"
~~~

---

### Task 3: Заменить prose Description типизированной documentation-моделью

**Files:**
- Modify: schemas/components.schema.json
- Modify: scripts/lib/component-registry.mjs
- Create: tests/components/component-documentation-model.test.mjs

**Interfaces:**
- Produces:
  - documentation.purpose: non-empty string;
  - documentation.critical_constraint_ids: unique stable IDs;
  - constraints[]: typed component-specific rules;
  - deriveComponentRenderType(record): HTML | ASSET | HYBRID;
  - validateComponentDocumentation(record, index): diagnostics[].
- Removes after migration: description.mode и description.blocks как canonical model.

- [ ] **Step 1: Написать failing shape tests**

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

- [ ] **Step 2: Запустить RED**

Run:

~~~powershell
node --test tests/components/component-documentation-model.test.mjs
~~~

Expected: FAIL на старой schema.

- [ ] **Step 3: Поднять component schema major version**

Удаление/rename обязательного description field является breaking migration. Поднять schema version согласно master-spec, не поддерживать два runtime-формата параллельно.

- [ ] **Step 4: Реализовать semantic validation**

Обязательные diagnostics:

- COMPONENT_PURPOSE_MISSING;
- COMPONENT_CONSTRAINT_ID_DUPLICATE;
- COMPONENT_CRITICAL_CONSTRAINT_UNKNOWN;
- COMPONENT_CRITICAL_CONSTRAINT_NOT_CRITICAL;
- COMPONENT_RENDER_TYPE_UNRESOLVED;
- COMPONENT_DOCUMENTATION_LEGACY_BLOCKS_FORBIDDEN.

Каждый diagnostic содержит component ID и JSON-pointer path.

- [ ] **Step 5: Реализовать render-type derivation**

Алгоритм читает все фактически выводимые render modes выбранных contracts:

- только HTML/presentation/nested без image modes → HTML;
- только image output без HTML content → ASSET;
- HTML и image output вместе → HYBRID;
- none или неоднозначный Figma-source-only contract → typed blocker, не догадка.

- [ ] **Step 6: Запустить GREEN и commit**

Run:

~~~powershell
node --test tests/components/component-documentation-model.test.mjs
~~~

Expected: PASS на fixture новой модели.

Commit:

~~~powershell
git add schemas/components.schema.json scripts/lib/component-registry.mjs tests/components/component-documentation-model.test.mjs
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

- [ ] **Step 1: Мигрировать shared records**

Для каждой записи:

- добавить purpose;
- вынести только уникальные implementation rules в constraints;
- выбрать critical constraints по формальным категориям;
- удалить prose-повторы contracts, properties, assets и foundations;
- сохранить identity, Figma provenance, viewport trees и fingerprints.

Run tests. Expected: PASS.

- [ ] **Step 2: Commit shared migration**

~~~powershell
git add data/components/shared.yaml
git commit -m "data: migrate shared component documentation"
~~~

- [ ] **Step 3: Мигрировать marketing records**

Повторить ту же операцию. Особо проверить cards, Banner/Secondary, Banner/App-Download, adaptive @2x images и composite export boundaries.

Run tests. Expected: PASS.

- [ ] **Step 4: Commit marketing migration**

~~~powershell
git add data/components/marketing.yaml
git commit -m "data: migrate marketing component documentation"
~~~

- [ ] **Step 5: Мигрировать service records**

Особо проверить root/self inset, NPS gaps, alert/notification nested components и property-controlled visibility.

Run tests. Expected: PASS.

- [ ] **Step 6: Commit service migration**

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

- [ ] **Step 1: Написать failing renderer tests**

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

- [ ] **Step 2: Запустить RED**

Run:

~~~powershell
node --test tests/components/component-registry-doc.test.mjs
~~~

Expected: FAIL, module отсутствует.

- [ ] **Step 3: Реализовать deterministic renderer**

Renderer обходит существующую contract tree через exported traversal helpers, не создаёт второй reference resolver и не меняет record. Optional sections пропускаются, но порядок остальных стабилен.

- [ ] **Step 4: Проверить representative records**

Проверить HTML-only, asset-only, hybrid, nested component, property-controlled и template shell cases. Два render одного input должны быть побайтово равны.

- [ ] **Step 5: Запустить GREEN и commit**

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

- [ ] **Step 1: Написать failing exact-output tests**

Expected:

~~~text
CUPIS ID: banner-secondary
PURPOSE: Вторичный промобаннер с текстовой и визуальной областями.
RENDER: HYBRID

CRITICAL
- Изображение меняет ширину только с пропорциональным изменением высоты.
~~~

Проверить вариант без CRITICAL, LF normalization и deterministic output.

- [ ] **Step 2: Добавить forbidden-content tests**

Description не должен выводить:

- полный Desktop/Mobile tree;
- таблицы typography/spacing;
- все properties или variants;
- provenance/fingerprint/node ID;
- правила сборки всего письма;
- факты, не выбранные critical_constraint_ids.

- [ ] **Step 3: Реализовать renderer и comparison**

Comparison возвращает exact description drift. Никакой Figma client и write в модуле не добавляется.

- [ ] **Step 4: Запустить GREEN и commit**

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
- Modify: schemas/manifest.schema.json только если новый source kind/reference требует изменения
- Modify: scripts/validate-system.mjs
- Modify: tests/foundation/system-manifest.test.mjs
- Modify: README.md
- Test: tests/characterization/component-documentation-boundary.test.mjs

**Interfaces:**
- Produces: manifest source IDs для двух стандартов и validation новой component model.
- Preserves: legacy bundle_profiles[].source_ids и skill behavior.

- [ ] **Step 1: Написать failing manifest assertions**

Проверить существование source IDs:

~~~text
component-contract-standard
figma-component-description-standard
~~~

На shadow-этапе не добавлять их одновременно в legacy source_ids и generated bundle для одного route.

- [ ] **Step 2: Объявить новые sources**

Добавить оба core paths в manifest. Подключение к итоговым generated bundles выполняется только в Task 9 после обновления плана этапа 7.

- [ ] **Step 3: Подключить system validation**

Порядок:

~~~text
manifest
→ foundations
→ component schema/cross-references
→ documentation semantics
→ generated layer
~~~

Validation остаётся read-only.

- [ ] **Step 4: Обновить README**

Объяснить простым языком:

- component data — источник;
- generated registry — полная документация;
- Figma Description — компактная проекция;
- generated outputs не редактируются;
- email build не зависит от Figma Description.

- [ ] **Step 5: Запустить проверки и commit**

~~~powershell
npm run validate
npm test
npm run verify
~~~

Expected: PASS, 0 failed.

Commit:

~~~powershell
git add system/manifest.yaml schemas/manifest.schema.json scripts/validate-system.mjs tests/foundation/system-manifest.test.mjs README.md
git commit -m "feat: integrate component documentation foundation"
~~~

---

### Task 8: Обновить generated-docs plan и реализовать пакет №2

**Files:**
- Modify: docs/superpowers/plans/2026-09-07-cupis-generated-docs-context-bundles.md
- Later modify under that plan: scripts/lib/generated-docs.mjs
- Later create under that plan: docs/generated/component-registry.md

**Interfaces:**
- Consumes: renderComponentRegistrySection и renderFigmaComponentDescription.
- Produces: full generated component registry without legacy prose ownership.

- [ ] **Step 1: Заменить Task 4 assumptions**

Task 4 должен:

- использовать full registry renderer;
- показывать compact Figma Description только как auxiliary projection;
- не читать description.blocks;
- не считать Figma Description источником implementation semantics.

- [ ] **Step 2: Обновить context-bundle contract**

Email bundles включают selected resolved component contracts. Compact Figma Description допускается только в figma-description-sync bundle; email-new-build и email-continue-fix его не получают как instruction.

- [ ] **Step 3: Возобновить PR №43 на обновлённом main**

Сохранить смысл пакета №1, повторно запустить его tests и только затем выполнять изменённый Task 4. Не переписывать уже проверенный digest/manifest foundation без необходимости.

- [ ] **Step 4: Выполнить Tasks 4–10 плана generated docs**

Следовать обновлённому implementation plan отдельными commits и завершить shadow generated layer.

---

### Task 9: Интегрировать routes и workflows на этапах 8–9

**Files:**
- Later modify: structured workflow sources этапа 8
- Later modify: system/manifest.yaml
- Later modify: workflows/library-maintenance-checkpoint.md during cutover
- Later preserve: workflows/email-build-checkpoint.md semantics
- Later modify: .agents/skills/maintaining-cupis-email-system/SKILL.md only at skill cutover

**Interfaces:**
- library-maintenance consumes full selected component contract and contract standard.
- component-onboarding consumes both standards and applicable foundations.
- figma-description-sync consumes expected compact projection and Figma sync workflow.
- email routes consume resolved component contracts, not authoring standards or Figma Description.

- [ ] **Step 1: Зафиксировать route-specific bundle ownership**

Expected routing:

~~~text
library-maintenance → contract standard + selected contract
component-onboarding → contract standard + Figma Description standard + foundations
figma-description-sync → Figma Description standard + expected compact descriptions
email-new-build → selected Mobile/Desktop contracts
email-continue-fix → affected selected contracts
~~~

- [ ] **Step 2: Обновить maintenance workflow**

Порядок изменения contract/Description:

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

- [ ] **Step 3: Сохранить email workflow узким**

Не загружать design-time authoring standard, Figma Description standard или sync workflow в HTML build. Кодекс использует exact resolved values выбранного instance и component contract.

- [ ] **Step 4: Переключить maintenance skill**

Skill остаётся тонким router: выбирает route и bundle, не содержит копий section names, constraints или paths. Локальная установка обновляется только из merged GitHub version.

- [ ] **Step 5: Проверить skill boundary**

Characterization tests должны доказать, что:

- maintenance skill выполняет impact gate;
- HTML skill не получает authoring rules;
- unknown component возвращает onboarding handoff;
- route paths разрешаются только через manifest.

---

### Task 10: Выполнить отдельную Figma Description sync

**Files:**
- No repository content change unless verified provenance must be updated in the same approved task.
- Figma writable fields: Description and separately approved Documentation link only.

**Interfaces:**
- Consumes: expected compact descriptions generated from merged component records.
- Produces: synchronized Figma descriptions with unchanged design structure.

- [ ] **Step 1: Построить read-only preview**

Для каждого явно выбранного компонента показать stable ID, current Description, expected Description и exact diff.

- [ ] **Step 2: Выполнить impact report и остановиться**

Назвать target nodes/variants, writable metadata fields, dependent records и preserved fingerprint. Запросить отдельное разрешение пользователя.

- [ ] **Step 3: После разрешения выполнить MCP-only write**

Не использовать UI automation, локальные scripts или другой способ записи.

- [ ] **Step 4: Выполнить отдельный MCP readback**

Проверить exact Description, component properties, hierarchy, geometry, bindings, asset suffixes и structure fingerprint. Unexpected diff останавливает задачу.

- [ ] **Step 5: Синхронизировать provenance только при необходимости**

Если verification date/fingerprint меняются, обновить только связанные structured records через отдельную GitHub branch/PR и повторить validation.

---

### Task 11: Shadow comparison, cutover и cleanup

**Files:**
- Follow stages 13–15 of migration roadmap.
- Do not delete legacy registry before successful cutover.

**Interfaces:**
- Produces: доказательство semantic equivalence и безопасное удаление дублей.

- [ ] **Step 1: Сравнить legacy и generated registry**

Проверить все components и отдельную high-risk выборку: templates, cards, Banner/Secondary, App Download, footer/header, NPS, asset-only icons.

- [ ] **Step 2: Проверить representative context bundles**

Для maintenance, onboarding, Figma sync и двух email routes подтвердить minimality, closure и отсутствие противоречащих источников.

- [ ] **Step 3: Выполнить cutover**

Только после успешного shadow comparison переключить routes и skills на structured/generated sources.

- [ ] **Step 4: Удалить migration-дубли отдельной задачей**

Удалять legacy prose models, старые registries и временные comparison paths только после перечня consumers и решения remove/preserve по каждому файлу.

---

## Acceptance Criteria

1. Любой active component имеет полный проверяемый structured contract и purpose.
2. Mobile и Desktop описаны независимо; отсутствие обязательного viewport блокирует validation.
3. Полный generated registry содержит всё необходимое для однозначной реализации компонента.
4. Общие foundation rules не копируются в component records; generated docs показывают stable reference и resolved exact value.
5. Figma Description содержит только CUPIS ID, purpose, derived render type и selected critical constraints.
6. Figma Description не является входом HTML build и может отсутствовать без потери implementation semantics.
7. Старые description.blocks не остаются вторым владельцем фактов.
8. Generated registry и Figma Description детерминированы и не редактируются вручную.
9. Новый неизвестный component проходит onboarding и schema validation без component-specific schema exception.
10. Generated-docs Task 4 использует full registry renderer и не закрепляет старую prose-модель.
11. Maintenance, onboarding, Figma sync и email build получают разные минимальные context bundles.
12. Figma write выполняется только после preview, impact report, отдельного разрешения и MCP readback.
13. Skills остаются routers и не копируют стандарты или component contracts.
14. Legacy registry удаляется только после shadow comparison и общего cutover.
15. Full validation, Node tests, verify и Windows bootstrap contracts проходят.

## Self-Review Record

- **Spec coverage:** ownership, full registry, thin Figma projection, new-component onboarding, generated docs, routes, workflows, skills, sync и cleanup покрыты Tasks 1–11.
- **Boundary coverage:** Figma mutation, workflow cutover, skill cutover и legacy deletion отделены от технического data migration.
- **No placeholders:** каждый task содержит конкретные inputs, outputs, checks и stop conditions.
- **Interface consistency:** structured record → full registry renderer / compact Figma renderer → generated docs / route bundles → workflows / skills.
- **Risk control:** package №1 PR №43 сохраняется; старый Task 4 блокируется до завершения prerequisite; email build не получает Figma Description или authoring standards.
