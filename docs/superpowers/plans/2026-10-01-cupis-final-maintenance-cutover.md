# CUPIS: финальный cutover поддержки системы — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans для последовательного выполнения. Шаги отмечаются чекбоксами; тесты и visual regression делегируются GPT-5.6 Terra Medium.

**Goal:** Доказать готовность пяти маршрутов поддержки, включить только прошедшие проверку и завершить миграцию без нарушения уже работающей сборки писем.

**Architecture:** Manifest остаётся единственной картой; навыки получают один bundle и его workflow. 11A доказывает цепочку источников и действий, 11B выполняет разрешённое переключение, 11C отдельно убирает ненужные переходные артефакты. План не вводит новый навык, формат контрактов или владельца правил.

**Tech Stack:** Node.js 24, YAML/JSON Schema, resolver, GitHub CLI, Figma MCP, локальные Node/PowerShell проверки.

**Spec:** [Master-spec, §§15–18](../specs/2026-08-24-cupis-structured-email-system-design.md#16-cutover-и-rollback), [roadmap](2026-08-25-cupis-migration-roadmap.md), [локальная маршрутизация](../specs/2026-09-28-cupis-codex-routing-web-delivery-design.md).

## Статус и основание

План подготовлен 01.10.2026 на `main@e08b5099f72b9ac3aa7aff33df6a3a3526868232`. Реализация этапа 11 не начата. Перед пакетом 1 закрыть 10A: слить проверенную правку router, синхронизировать установленную копию после отдельного разрешения и подтвердить discovery/handoff.

Два email routes уже активны; пять маршрутов поддержки пока указывают на `workflow-paused`. `data/workflows/library-maintenance.yaml` существует со статусом `shadow`, но сам этот файл не доказывает достаточность каждого профиля. В частности, его общие steps ссылаются на component/naming sources; профиль `migration-progress` содержит README, roadmap и paused boundary. До переключения надо проверить фактическую совместимость, а не назначать общий workflow всем маршрутам.

Исходный `backup/pre-structured-migration-2026-08-24` сохранить. Каждый пакет начинает с нового pinned main и собственной облачной ветки; merge и следующий пакет — только после успешных проверок и отдельной команды.

## Global Constraints

- Cloud GitHub — постоянный источник; локальный exact-SHA snapshot — только исполнение/проверка, не рабочая копия для правок.
- Только локальный Codex, две специализации и thin router. Нет Web-выдачи или разработки новых блоков; onboarding готового одобренного компонента сохраняется.
- Не менять факты контрактов, дизайн Figma или активные email routes ради формального зелёного статуса. Обнаруженное расхождение сообщить; изменение требует собственной согласованной области.
- Каждое Figma-зависимое доказательство включает свежие MCP-факты и визуальный снимок, когда он нужен для результата. Перенесённый Markdown, старый fingerprint и статус не заменяют чтение значимых фактов.
- Figma write требует impact report и отдельного разрешения точных полей; read-back выполняется отдельным вызовом. Нельзя расширять allowlist ради исправления неожиданных изменений.
- Не выполнять или использовать Actions/PR Checks. Terra Medium делает локальные tests/validation/visual comparisons; coordinator получает компактный итог.
- В ходе пакета — targeted проверки. Перед merge кода/контрактов/активации — один полный gate точного финального commit; новый commit отменяет прежний финальный результат. Docs-only пакет — scoped gate.
- Архив — только comparison baseline. Не подключать его к runtime и не удалять автоматически. Ручной context checkpoint обновляется только по отдельной просьбе.
- Фактическое переключение, Figma mutation, локальная установка и очистка не разрешены публикацией этого плана.

## Review Focus

1. `resolved` у общего workflow не доказывает, что steps обеспечены источниками конкретного route/mode.
2. Read-only запрос, неоднозначная семантика или пустой/устаревший MCP-пакет не должны приводить к записи.
3. Description-only/rename не должны менять geometry, component type, properties, Slots, bindings или scale suffix.
4. Отмена design-time навыка не должна удалить onboarding, naming generator или checks готовой библиотеки.
5. Изменения поддержки не должны изменить HTML, export semantics, версии или сохранность исходных писем.

---

## 11A — доказательство готовности

### Пакет 1: Source closure и точная карта переключения

**Files:** Inspect: `system/manifest.yaml`, `data/workflows/library-maintenance.yaml`, `schemas/workflows.schema.json`, `scripts/lib/skill-context.mjs`, `scripts/lib/context-bundle.mjs`, `scripts/lib/workflow-registry.mjs`. Test: `tests/skills/skill-context.test.mjs`, `tests/skills/skill-context-cli.test.mjs`, `tests/generation/context-bundle.test.mjs`, `tests/workflows/structured-workflows.test.mjs`. Record: журнал этого плана.

**Interfaces:** Consumes: закрытый 10A и свежий main. Produces: проверенная карта каждого route → workflow/modes → profile → источники steps → gates/handoff; точный allowed-path список необходимой реализации пакета 3.

| Route | Обязательные сценарии |
| --- | --- |
| library-maintenance | read-only; разрешённая repository-only правка; отдельные Figma gates при применимости |
| component-onboarding | анализ уже созданного одобренного компонента; draft → проверки → active; неизвестный/неполный вход останавливает процесс |
| figma-description-sync | preview/drift без записи; description-only после отдельного разрешения; отдельный read-back |
| figma-naming-audit | audit/recommendation без записи; rename только по согласованной карте, с сохранением @2x/@4x |
| migration-progress | только read-only: свежие main, папка plans, roadmap и фактические артефакты |

- [ ] **Step 1:** На точном main выполнить resolver для всех пяти routes с применимыми component/viewport/foundation inputs. Сохранить локально полный bundle и typed diagnostics; ожидается текущий paused, не pretend-ready.
- [ ] **Step 2:** Для каждого route/mode сравнить returned bundle с каждым `workflow.steps[].source_ids`, input/output и condition. Определить недостающие или лишние источники и несовместимые steps; отдельной строкой показать migration-progress.
- [ ] **Step 3:** В изолированных test fixtures доказать конкретные найденные gaps отрицательными тестами: отсутствие источника step, несовместимый mode, неизвестный component/foundation, inactive dependency. Исходный exact-SHA snapshot не редактировать.
- [ ] **Step 4:** Зафиксировать минимальную карту исправлений и allowed paths. Где общего workflow недостаточно, показать конкретные steps/источники и решение до кода. Новая архитектурная развилка требует review master-spec, а не скрытого исключения в плане.
- [ ] **Step 5:** Опубликовать findings и targeted результаты в отдельном PR; statuses/routes в main сохранить. Вспомогательные raw bundles/logs не коммитить.

**Acceptance:** Пять карт с точными source IDs, modes и stop conditions; все проблемы имеют воспроизводимый тест или подтверждённое семантическое доказательство. Не включён ни один маршрут.

### Пакет 2: Figma-backed и архивное доказательство смысла

**Files:** Inspect: `data/components/{shared,marketing,service}.yaml`, `data/foundations/{typography,spacing,assets,figma-naming}.yaml`, применимые `core/*.md`, `docs/generated/`, read-only `Legacy/`. Reuse: `scripts/figma/capture-contract-source.js`, `scripts/audit-figma-contract-facts.mjs`, `scripts/lib/foundation-evidence.mjs`. Test: `tests/foundation/figma-contract-facts.test.mjs`, `tests/foundation/foundation-evidence.test.mjs`, `tests/characterization/component-documentation-boundary.test.mjs`, `tests/characterization/foundations-remediation-boundary.test.mjs`.

**Interfaces:** Consumes: scope/map пакета 1. Produces: фактическое evidence по значимым возможностям maintenance и таблица объяснённых различий с baseline; не новая prose-копия контрактов.

- [ ] **Step 1:** Выбрать зарегистрированные representative owners из обоих roots по покрываемым свойствам: responsive images, exact typography/spacing bindings, nested component/property visibility, export owner и description/naming. Записать stable IDs и реальные Figma IDs до чтения; не искать совпадения только по имени.
- [ ] **Step 2:** Свежими read-only MCP-вызовами снять значимые значения обоих variants и нужные screenshots. Сопоставить фактические числа, шрифты, alignment, padding/gap, visibility, hierarchy и asset boundary с contract. Не считать картинку или fingerprint достаточным числовым evidence.
- [ ] **Step 3:** Для каждого selected component выполнить `node scripts/audit-figma-contract-facts.mjs --repo-root SNAPSHOT --component-id ID --live MCP_PACKET`; foundation evidence проверить существующим механизмом. Ожидается полное покрытие выбранных фактов и 0 необъяснённых differences.
- [ ] **Step 4:** Сравнить relevant archived obligations с нынешними Core/workflow/contract/generated outputs. Для каждой существенной разницы указать текущего владельца и подтверждённую причину. Утраченное characterization-утверждение восстановить активным тестом того же поведения; не закреплять obsolete baseline как новый норматив.
- [ ] **Step 5:** Сообщить расхождения и недостающее evidence. Не править contract/Figma автоматически; расширить проверку только по найденной причине. Raw MCP-пакеты, screenshots и полные logs остаются локальными; краткие проверяемые выводы — в журнале/PR.

**Acceptance:** Все выбранные значимые факты подтверждены; различия классифицированы и разрешены пользователем либо остаются явными blockers. Onboarding проверяется на готовом компоненте или fixture, не создаётся новый дизайн.

### Пакет 3: Закрытие workflow, authorization и handoff

**Files:** Modify только paths карты пакета 1: существующие `data/workflows/library-maintenance.yaml`, profile/source declarations `system/manifest.yaml`, при доказанном gap resolver/bundle modules. Test: `tests/workflows/structured-workflows.test.mjs`, `tests/skills/skill-context.test.mjs`, `tests/skills/maintenance-skill-boundary.test.mjs`, `tests/generation/context-bundle.test.mjs`, `tests/foundation/figma-name-generator.test.mjs`, `tests/components/figma-component-description.test.mjs`. Новые source paths сначала фиксируются картой, не придумываются в ходе записи.

**Interfaces:** Consumes: карты и semantic evidence пакетов 1–2. Produces: проверенные route-specific steps и gates для кандидатного выполнения, но без production cutover.

- [ ] **Step 1:** Выполнить RED-тесты найденных gaps на baseline: route/mode/source closure и невозможность записи без конкретного разрешения. Тесты должны проверять поведение/diagnostic path, не совпадение слов SKILL.
- [ ] **Step 2:** Реализовать минимальные исправления в cloud candidate; не включать main routes. Проверить cold-context handoff каждого из пяти routes без ручного fallback. Для разрешённых candidate-проб зафиксировать точный SHA и отдельно разрешённую область.
- [ ] **Step 3:** Проверить negatives: отсутствующая identity/семантика, missing source, source mismatch, недоказанные данные; отказ менять Figma по read-only запросу; отказ rename без карты. В controlled fixture внедрить неожиданное изменение поля вне разрешённой области: сравнение до/после должно вернуть существующий blocker `figma-readback-mismatch`, остановить дальнейшие writes, зависимую синхронизацию и публикацию, не выполнять auto-repair. Дополнить guards только при показанном дефекте.
- [ ] **Step 4:** Доказать Figma write path controlled mock/fixture и отдельным read-only evidence. Для двух позитивных сценариев — Description-only и rename по одобренной карте — сравнить semantic pre/post diff с точным allowlist target/fields: меняются только разрешённые Description/name. Отдельная preservation projection обязана подтвердить неизменность геометрии, Auto Layout, типов узлов, иерархии, вариантов, component properties, Slots, bindings и экспортных суффиксов `@2x`/`@4x`. Не требовать неизменности полного fingerprint, если он включает разрешённое имя: проверять разрешённую разницу и неизменные поля раздельно. Live запись допустима только после отдельного разрешения target/fields; без него не заявлять live mutation gate выполненным. Даже одобренный no-op проверяется отдельным read-back.
- [ ] **Step 5:** Повторить targeted GREEN, generated equivalence и independent reviewer/behavior pass. Опубликовать проверенные изменения отдельным PR; доказательства всех пяти routes обязательны даже при переиспользовании workflow.

**Acceptance:** Нет необъяснённых gaps; skill действует по returned steps; позитивные и отрицательные сценарии подтверждены. Description-only и mapped rename проходят точный allowlist/preservation diff; неожиданный diff блокирует запись, зависимую синхронизацию и публикацию без auto-repair. Эти доказательства обязательны до 11B; main по-прежнему paused для поддержки.

### Пакет 4: Regression email и итоговый gate 11A

**Files:** Verify: `data/workflows/email-build.yaml`, `.agents/skills/building-cupis-emails/SKILL.md`, `tests/skills/email-build-{handoff,orchestration,skill-boundary}.test.mjs`, `tests/rendering/`, `tests/skills/cupis-email-task-router.test.mjs`, `bootstrap/verify.ps1`. Sources/letters preserved.

**Interfaces:** Consumes: final candidate/source maps пакета 3. Produces: exact-SHA proof record для допуска 11B.

- [ ] **Step 1:** Прогнать active new-build и continue/fix resolver и targeted email tests; проверить template-root, nested components, один bundle и остановку зависимого mixed scope.
- [ ] **Step 2:** На representative marketing/service моделях сравнить HTML/asset contracts и output metrics до/после maintenance-правок; сравнить источники моделей и render-impact digests. Отдельно проверить versions, локальные src и неизменность исходника при technical fix.
- [ ] **Step 3:** Если обнаружено render-impact изменение, не переутвердить эталон автоматически: классифицировать владельца причины и получить нужное разрешение; Terra сравнивает rendered/reference screenshots с сохранёнными Figma evidence. Нет изменения rendering strategy — нет новой имитации real-client приёмки.
- [ ] **Step 4:** На точном финальном cloud SHA выполнить `npm run verify`, `npm run generate:check`, применимый Windows bootstrap и allowed-path/preserved-blob gate. При отсутствии npm использовать существующий pnpm/эквивалентные Node scripts; не менять lockfile только ради среды.
- [ ] **Step 5:** Reviewer проверяет proof пяти routes, источник каждого значимого факта и отрицательные gates. 11A закрывается после local PASS, отдельного merge и фиксации фактов в roadmap; blocker оставляет конкретный route неподготовленным.

**Acceptance:** Работающие письма не регрессировали, полный final gate зелёный, каждая proposed activation имеет собственное достаточное evidence.

## 11B — отдельное разрешённое переключение

### Пакет 5: Активация, rollback и локальная приёмка

**Files:** Modify по проверенной карте: `system/manifest.yaml` (пять конкретных routes, их profiles, aggregate); `data/workflows/library-maintenance.yaml` и только доказанно требуемые status dependencies. Verify skills, bootstrap, validators. Update этот план и roadmap.

**Interfaces:** Consumes: merged 11A и разрешение cutover. Produces: active maintenance routes с подтверждённым resolver/handoff и точкой rollback.

- [ ] **Step 1:** Закрепить свежий main как rollback SHA, сохранить прежнюю резервную ветку и показать exact old → new таблицу route/workflow/profile/status. Не делать глобальный shadow → active replace.
- [ ] **Step 2:** Получить отдельное разрешение на эту карту. В candidate назначить только доказанные structured workflows, убрать paused source из их profiles и обновить только зависимые статусы. Email route records сохранить побайтово, если отдельного разрешённого defect fix нет.
- [ ] **Step 3:** Для каждого включаемого route доказать `resolved`, exact mode и нужные steps; negative dependency/source cases должны давать typed blocked. При частичном переключении aggregate остаётся partial; active допускается только когда все текущие routes готовы.
- [ ] **Step 4:** На exact final SHA выполнить один полный локальный gate, generated check, bootstrap и независимое ревью. Получить отдельное разрешение merge; защита GitHub, требующая remote check, является blocker, не повод обходить её.
- [ ] **Step 5:** После merge и отдельного разрешения синхронизировать изменённые локальные навыки с backup; подтвердить discovery и clean-context работу всех routes. Сбой исправляется corrective/revert PR, не force-reset; Figma не откатывается автоматически.

**Acceptance:** Включён только доказанный объём, локальный clean-context результат соответствует main, rollback имеет точный SHA/allowed diff. 11C ещё не выполнен.

## 11C — отдельная итоговая очистка

### Пакет 6: Решения по архиву и переходным артефактам

**Files:** Inspect: `Legacy/`, `workflows/system-paused.md`, `system/migrations/`, временные shadow/characterization guards и ссылки в manifest/skills/bootstrap. Modify/delete только явно одобренный список; исторические планы и резервная ветка сохраняются.

**Interfaces:** Consumes: стабильный merged 11B. Produces: обоснованная remove/preserve таблица, отсутствие активных архивных потребителей и завершённый roadmap.

- [ ] **Step 1:** Для каждого архивного файла/группы и переходного guard найти фактических потребителей, текущую замену и будущую роль. Generated registry, постоянные validators, Core и регрессионные tests не являются временными только из-за даты создания.
- [ ] **Step 2:** Принять отдельное remove/preserve решение с причиной. Связанные assertions сначала перенести/заменить проверкой действующей системы; удалить baseline только после подтверждённой замены. Не удалять весь Legacy одной командой.
- [ ] **Step 3:** Показать список удалений, зависимые links/tests и reversible rollback. Получить отдельное разрешение; разрешение cutover не является разрешением очистки.
- [ ] **Step 4:** Применить минимальный cloud diff и проверить отсутствие runtime paths в архив/удалённые источники. Сохранённые historical sources не становятся активными owners.
- [ ] **Step 5:** Выполнить scoped или full local gate по фактическому типу diff, merge отдельно. Только после выполненных решений и итоговой source/route проверки закрыть этап 11 в roadmap. Ручной context checkpoint — только по просьбе.

**Acceptance:** Каждый архивный/временный объект имеет выполненное решение; постоянная система самодостаточна; нет неразрешённых route или потребителей удалённых paths.

## Порядок PR и продолжения

Пакеты выполняются последовательно, не одним длинным запуском: 1 → 2 → 3 → 4 → разрешение cutover → 5 → отдельное разрешение cleanup → 6. Если 1–2 дают blocker, пакет 3 исправляет только одобренные причины. Merge плана не начинает пакет 1. Для каждого пакета в журнале сохраняются pinned base/final SHA, разрешённые paths, команды, результаты, причины отклонений и следующий gate; нельзя закрывать этап одной пометкой статуса.

## Журнал

- 01.10.2026: план подготовлен на e08b5099; пять maintenance routes paused, два email routes active. Реализация 11A/11B/11C не начата.
- 01.10.2026: после независимого review усилен пакет 3: обязательные позитивные preservation diff и отрицательный read-back сценарий до 11B. Это требование будущих проверок, не сообщение об уже выполненной записи или тестах Figma.
