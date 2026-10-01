# CUPIS: финальный cutover поддержки системы — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans для последовательного выполнения. Шаги отмечаются чекбоксами; тесты и visual regression делегируются GPT-5.6 Terra Medium.

**Goal:** Доказать готовность пяти маршрутов поддержки, включить только прошедшие проверку и завершить миграцию без нарушения уже работающей сборки писем.

**Architecture:** Manifest остаётся единственной картой; навыки получают один bundle и его workflow. 11A доказывает цепочку источников и действий, 11B выполняет разрешённое переключение, 11C отдельно убирает ненужные переходные артефакты. План не вводит новый навык, формат контрактов или владельца правил.

**Tech Stack:** Node.js 24, YAML/JSON Schema, resolver, GitHub CLI, Figma MCP, локальные Node/PowerShell проверки.

**Spec:** [Master-spec, §§15–18](../specs/2026-08-24-cupis-structured-email-system-design.md#16-cutover-и-rollback), [roadmap](2026-08-25-cupis-migration-roadmap.md), [локальная маршрутизация](../specs/2026-09-28-cupis-codex-routing-web-delivery-design.md).

## Статус и основание

План подготовлен 01.10.2026 на `main@e08b5099f72b9ac3aa7aff33df6a3a3526868232` и после review слит через PR #106 в `09537effc89daadacaed1d05497a1e75beb18152`. Prerequisite 10A выполнен: итоговый router синхронизирован после отдельного разрешения; canonical byte-match, catalog/frontmatter, сохранность специализаций/config и локальные handoff/boundary gates подтверждены. По следующей команде начат пакет 1 на main@ace7725d6e88dce0b9b130cd5610f4bcade4feb9; его source-closure findings записаны ниже. Пакет 1 слит через PR #108 на `6c0bf7d0d3b1ca7909b692541883d2b0e9788709`. Пакет 2 продолжается отдельно в [draft PR #110](https://github.com/flabenar-maker/e-mail/pull/110); свежая точка возврата и весь неслитый журнал находятся [на его зафиксированном head](https://github.com/flabenar-maker/e-mail/blob/fbf428ab25bd6bdb33bb4429d24bf0a0acc1241a/docs/superpowers/plans/2026-10-01-cupis-final-maintenance-cutover.md). Не заменять этот журнал коротким статусом из main. 11A ещё не завершён; пакеты 3–6 и production cutover не выполнены.

Два email routes уже активны; пять маршрутов поддержки пока указывают на `workflow-paused`. `data/workflows/library-maintenance.yaml` существует со статусом `shadow`, но сам этот файл не доказывает достаточность каждого профиля. В частности, его общие steps ссылаются на component/naming sources; профиль `migration-progress` содержит README, roadmap и paused boundary. До переключения надо проверить фактическую совместимость, а не назначать общий workflow всем маршрутам.

Исходный `backup/pre-structured-migration-2026-08-24` сохранить. Каждый пакет начинает с нового pinned main и собственной облачной ветки; merge и следующий пакет — только после успешных проверок и отдельной команды.

После принятого пакета 5, до отдельно разрешённого пакета 6, предусмотрен [follow-up карточных блоков, draft PR #109](https://github.com/flabenar-maker/e-mail/pull/109). Полная актуальная очередь, ссылки на его план и границы интеграции документов находятся в [roadmap](2026-08-25-cupis-migration-roadmap.md#единый-актуальный-список). Организация папки plans и удаление ручного checkpoint не являются выполнением пакета 6.

## Global Constraints

- Cloud GitHub — постоянный источник; локальный exact-SHA snapshot — только исполнение/проверка, не рабочая копия для правок.
- Только локальный Codex, две специализации и thin router. Нет Web-выдачи или разработки новых блоков; onboarding готового одобренного компонента сохраняется.
- Не менять факты контрактов, дизайн Figma или активные email routes ради формального зелёного статуса. Обнаруженное расхождение сообщить; изменение требует собственной согласованной области.
- Каждое Figma-зависимое доказательство включает свежие MCP-факты и визуальный снимок, когда он нужен для результата. Перенесённый Markdown, старый fingerprint и статус не заменяют чтение значимых фактов.
- Figma write требует impact report и отдельного разрешения точных полей; read-back выполняется отдельным вызовом. Нельзя расширять allowlist ради исправления неожиданных изменений.
- Не выполнять или использовать Actions/PR Checks. Terra Medium делает локальные tests/validation/visual comparisons; coordinator получает компактный итог.
- В ходе пакета — targeted проверки. Перед merge кода/контрактов/активации — один полный gate точного финального commit; новый commit отменяет прежний финальный результат. Docs-only пакет — scoped gate.
- Архив — только comparison baseline. Не подключать его к runtime и не удалять автоматически. Текущий статус хранится в roadmap, факты и точка возврата пакета — в его implementation plan.
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

- [x] **Step 1:** На точном main выполнить resolver для всех пяти routes с применимыми component/viewport/foundation inputs. Сохранить локально полный bundle и typed diagnostics; ожидается текущий paused, не pretend-ready.
- [x] **Step 2:** Для каждого route/mode сравнить returned bundle с каждым `workflow.steps[].source_ids`, input/output и condition. Определить недостающие или лишние источники и несовместимые steps; отдельной строкой показать migration-progress.
- [x] **Step 3:** В изолированных test fixtures доказать конкретные найденные gaps отрицательными тестами: отсутствие источника step, несовместимый mode, неизвестный component/foundation, inactive dependency. Исходный exact-SHA snapshot не редактировать.
- [x] **Step 4:** Зафиксировать минимальную карту исправлений и allowed paths. Где общего workflow недостаточно, показать конкретные steps/источники и решение до кода. Новая архитектурная развилка требует review master-spec, а не скрытого исключения в плане.
- [x] **Step 5:** Опубликовать findings и targeted результаты в отдельном PR; statuses/routes в main сохранить. Вспомогательные raw bundles/logs не коммитить.

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
- [ ] **Step 5:** Выполнить scoped или full local gate по фактическому типу diff, merge отдельно. Только после выполненных решений и итоговой source/route проверки закрыть этап 11 в roadmap.

**Acceptance:** Каждый архивный/временный объект имеет выполненное решение; постоянная система самодостаточна; нет неразрешённых route или потребителей удалённых paths.

## Порядок PR и продолжения

Пакеты выполняются последовательно, не одним длинным запуском: 1 → 2 → 3 → 4 → разрешение cutover → 5 → отдельное разрешение cleanup → 6. Если 1–2 дают blocker, пакет 3 исправляет только одобренные причины. Merge плана не начинает пакет 1. Для каждого пакета в журнале сохраняются pinned base/final SHA, разрешённые paths, команды, результаты, причины отклонений и следующий gate; нельзя закрывать этап одной пометкой статуса.

## Журнал

- 01.10.2026: план подготовлен на e08b5099; пять maintenance routes paused, два email routes active. Реализация 11A/11B/11C не начата.
- 01.10.2026: после независимого review усилен пакет 3: обязательные позитивные preservation diff и отрицательный read-back сценарий до 11B. Это требование будущих проверок, не сообщение об уже выполненной записи или тестах Figma.
- 01.10.2026: PR #106 слит; prerequisite 10A фактически выполнен локальной синхронизацией router из `09537effc89daadacaed1d05497a1e75beb18152` и post-install gates. Пять maintenance routes по-прежнему paused; два email routes active. Ни один пакет этого плана не начат.

### 01.10.2026 — пакет 1: source closure и карта последующих исправлений

**Область и основание.** По команде пользователя «Давай дальше» сначала слит статусный PR #107: `main@ace7725d6e88dce0b9b130cd5610f4bcade4feb9`, дерево `1eb7567b30e84a79ec9a7fb989a32c50d71f3e69` совпадает с проверенным head #107. Это новый pinned base пакета 1; router/специализация и источники прочитаны на этой версии. Prerequisite 10A выполнен. Пакет 1 исследует источники и сохраняет findings, а не реализует пакет 3 и не включает маршруты.

**Impact boundary текущего PR:** меняется только этот implementation plan: статус текущего пакета, чекбоксы пакета 1 и проверяемый журнал. Не меняются manifest, workflows, schemas, модули, structured contracts, foundations, generated docs, skills/bootstrap, Figma или локальные письма. Глобальный roadmap в main ещё не отмечает исполнительные gates 11A выполненными; результаты этого кандидата попадают в его статус после отдельного merge, а не заранее.

**Pre-flight / Rulings.**

- Пакет 1 → пакет 2: карта определяет, какие значимые свойства и возможности требуют свежего Figma-backed evidence; текущие CLI/fixture результаты не подтверждают визуальные факты.
- Пакеты 1–2 → пакет 3: разрешённые paths и причины ниже; unresolved semantic drift пакета 2 не разрешает автоматически менять component facts.
- Пакет 3 → пакет 4 → пакет 5: coherent local fixture не является production cutover; сначала source/gate implementation, затем email regression и полный exact-SHA gate, затем отдельное разрешение переключения.
- Ruling: cloud-only источник исключает авторинг в worktree и локальный SDD ledger. Журнал хранится здесь и в PR; одноразовый exact-SHA архив используется только для исполнения. Изменяемые fixture-копии существуют отдельно от неизменного архива.
- Ruling: отдельные workflows для уже существующих маршрутов реализуют master-spec §§4, 11, 15–16, а не вводят новый владелец правил или новый формат. Manifest остаётся единственной картой. Модель контрактов и HTML-стратегия не меняются.

#### 1. Что действительно проверено

Terra Medium выполнила на точном `ace7725d6e88dce0b9b130cd5610f4bcade4feb9`:

```text
node --test tests/skills/skill-context.test.mjs tests/skills/skill-context-cli.test.mjs tests/generation/context-bundle.test.mjs tests/workflows/structured-workflows.test.mjs
exit 0; tests 37; pass 37; fail 0; skipped 0
```

Среда: Node.js 24; изолированный архив точного cloud SHA; зависимости через pnpm без lifecycle scripts. npm недоступен, использован прямой эквивалент Node-команды. Полный suite в этом docs-only пакете не повторяется. Actions/PR Checks не запускались, не читались и не используются.

Актуальный `migration-progress/read-only` bundle имеет режим `structured-shadow`, статус `paused`, blocker `SKILL_ROUTE_PAUSED` по `/route/workflow_source_id`; 0 component projections и 0 foundation definitions. Static IDs: `repository-readme`, `migration-roadmap`, `workflow-paused`. Digest: `sha256:d93c34659ac9802cdb8083bda85ae3ee2816b804be7578fbfaaffc4dd3cd8732`.

Полные baseline bundles, raw typed diagnostics, TAP и fixture probes сохранены только локально. В репозиторий они не добавляются. Отдельные fixture-проверки — исследования текущего поведения, не новые production-тесты и не evidence live Figma mutation.

#### 2. Точная текущая карта пяти маршрутов

Сокращения **только для этого отчёта**, не новый каталог:

- `B` = `repository-readme`, `figma-library-standard`.
- `C` = `component-contract-standard`, `figma-component-description-standard`.
- `P` = `workflow-paused`.
- `F` = только действительно выбранные/referenced definitions `typography`, `spacing`, `assets`, `figma-naming`.
- Component projections — выбранные active contracts и их dependency closure, не все три исходных реестра целиком.

У всех пяти route записей сейчас `workflow_source_id: workflow-paused`; у их generated profiles — `structured-shadow`. Текущий кандидат `workflow-library-maintenance` имеет статус `shadow`, два объявленных mode: `read-only` (5 steps) и `write` (11 steps). Он не является действующим workflow этих routes.

| Route / profile ID | Текущий static bundle | Точная selection policy | Проверенные baseline inputs и результат |
| --- | --- | --- | --- |
| `library-maintenance` | B + C + P | components optional; viewport one-or-both; foundations explicit-or-referenced; allowed typography/spacing/assets/figma-naming; required [] | `email-header`, mobile, explicit typography; отдельно read-only и write → paused/SKILL_ROUTE_PAUSED |
| `component-onboarding` | B + C + P | components optional; viewport both; foundations explicit-or-referenced; allowed typography/spacing/assets/figma-naming; required [] | зарегистрированный `email-header`, both; read-only и write → paused/SKILL_ROUTE_PAUSED; это не тест нового Figma-компонента |
| `figma-description-sync` | B + C + P | components required; viewport both; foundations referenced; allowed typography/spacing/assets; required [] | `email-header`, both, без explicit foundation; read-only и write → paused/SKILL_ROUTE_PAUSED |
| `figma-naming-audit` | B + P | components optional; viewport none; foundations explicit; allowed/required figma-naming | naming foundation; read-only и write → paused/SKILL_ROUTE_PAUSED |
| `migration-progress` | repository-readme + migration-roadmap + P | components none; viewport none; foundations none; allowed/required [] | read-only, без component/viewport/foundation → paused/SKILL_ROUTE_PAUSED |

Получены 9 фактических вызовов API для указанной mode-матрицы. `write` здесь является входным значением, не разрешением записи. Paused exit происходит **до** `resolveWorkflowSteps`; поэтому возвращённый paused не доказывает поддержку mode. Ранние probe labels `draft`, `preview`, `audit` также не являются объявленными mode текущего общего workflow и не учитываются как успешная mode-проверка.

Selection validation выполняется до paused. Отсутствие обязательного viewport/component даёт соответственно `CONTEXT_BUNDLE_VIEWPORT_REQUIRED`, `CONTEXT_BUNDLE_BOTH_VIEWPORTS_REQUIRED`, `CONTEXT_BUNDLE_COMPONENT_REQUIRED`. В description-sync explicit foundation запрещён policy, а не «не найден»: `CONTEXT_BUNDLE_FOUNDATION_EXPLICIT_FORBIDDEN`.

#### 3. Сопоставление steps, inputs/outputs и conditions

Для каждого маршрута повторное назначение общего workflow без изменений **не является решением**:

- **library-maintenance.** read-only `inspect-canonical-sources` требует source IDs всех `components-shared`, `components-marketing`, `components-service`; conditional `inspect-figma-read-only` требует `figma-naming-foundation`. write `assess-impact` требует naming foundation без condition, а `synchronize-dependents` снова требует все три registries. В текущем selected bundle есть конкретные component projections/F, но naming не обязателен. Нужно различать источники нормативных правил и типизированные inputs выбранных фактов; не подгружать все registries ради совпадения source ID. Для repository-only задачи не требовать Figma write/read-back; условные steps должны зависеть от точной boundary.
- **component-onboarding.** Общие steps не выражают собственную последовательность «готовый одобренный MCP target → точные факты обеих версий → draft record → schema/cross-reference/generated preview → отдельное metadata-разрешение/read-back → active». `collectDependencyClosure` пропускает только active records; draft нельзя выдавать за active selected contract. Staged draft должен быть отдельным типизированным input workflow и проверяться existing component schema; selected active components остаются comparison context. Пустой список selected components не означает, что новый target уже проверен.
- **figma-description-sync.** Требуются expected compact Description и actual MCP Description, preview/drift без записи, description-only scope, отдельный read-back и preservation. Общий write workflow дополнительно допускает repository-change/naming и не выделяет эту последовательность. Profile намеренно не даёт naming foundation. Не расширять его автоматически; убрать чужие steps и потребности.
- **figma-naming-audit.** Нужны подтверждённые identity/семантика target, scoped validator/generator, согласуемая карта old → new и dependent/preservation checks. Общий workflow не выделяет эти inputs и recommendation handoff. При выборе `email-header` с viewport none projection содержит пустые contracts/properties/assets; это ограничение проекции, не удаление фактов реестра. Нельзя использовать её как доказательство сохранности Slots, properties, bindings или export owners: нужны отдельные MCP facts/evidence пакета 2 и проверки пакета 3.
- **migration-progress.** Доступны README/roadmap/P, но общий read-only workflow требует C, component registries и conditional naming; в его steps вообще нет roadmap, чтения папки plans и сверки фактически слитых artifacts. Output `audit-findings` сам по себе не задаёт эту проверку. Нужен собственный read-only workflow; modes/steps записи и Figma mutation для этого route отсутствуют.

Conditions общего workflow: `figma-evidence-required`, `figma-in-scope`, `repository-write-in-scope`, `figma-write-in-scope`, `figma-write-performed`. Они являются метками steps, а не разрешением пользователя. После stop/request-input нельзя продолжать зависимые writes/sync/publication. Mode-level inputs `request`, `target-scope`, `write-authorization` и outputs не проверяют конкретную rename map, staged draft или description allowlist: их обязаны явно задать специализированные steps/inputs. Common schema уже поддерживает required_inputs, blockers, conditions, handoff, input_blockers и input_relations; новый формат ради этой карты не требуется.

#### 4. Воспроизводимые findings и их значимость

| Finding | Фактическое доказательство | Влияние и решение |
| --- | --- | --- |
| **F1 — отсутствует workflow-step / returned-source closure** | В coherent fixture удалён зарегистрированный `figma-library-standard` только из profile.source_ids и generated_bundle.static_source_ids; общий workflow продолжает требовать его. `resolveSkillContext` возвращает resolved и 5 steps. Manifest registration/файл остаются. | Критично для готовности: skill не должен получать исполнимые steps без их rules. Пакет 3 добавляет typed refusal до handoff и проверяет closure выбранного mode. Projection facts не заменяются raw registry prose. |
| **F2 — topology жёстко связана с прежним email-only cutover** | `system-manifest.mjs` в partial требует ровно 2 active email routes, все non-email paused; в active требует все routes и для каждого non-email именно `workflow-library-maintenance`. Реальный blocker: `structured-workflow-status-topology-invalid` по `/structured_workflows/status`. | Критично для следующих steps: невозможно отдельно включить доказанный maintenance route или назначить route-specific workflow. Валидировать coherence по объявленным manifest mappings/registered workflows, не снимать kind/source/status checks. Email route records сохранить. |
| **F3 — общий workflow не соответствует пяти разным задачам** | Точная source/mode/step карта выше; migration profile не имеет C/naming/components и workflow не содержит roadmap step; остальные specialization inputs отсутствуют. | Критично для корректного handoff. Разделить steps по уже существующим routes, оставляя общие правила в Core; не копировать contracts или business constants в workflows. |
| **F4 — naming foundation ещё не допускает final active status** | `schemas/figma-naming.schema.json`: /properties/foundation/properties/status const shadow; `data/foundations/figma-naming.yaml`: foundation.status shadow. В coherent active fixture naming read-only разрешается с этим shadow foundation. | До 11B требуется согласованный schema/version/status переход и guard доказанных route dependencies. Нельзя просто заменить shadow на active в data: schema этого не допускает. Пакет 3 готовит и проверяет формат, пакет 5 меняет status только после evidence. |
| **F5 — onboarding draft нельзя использовать как selected active contract** | В coherent fixture зарегистрированный component со status draft → `COMPONENT_NOT_ACTIVE`; неизвестный component → `COMPONENT_UNREGISTERED`. | Защиту HTML/active closure сохранить. Workflow должен принять подтверждённый ready target и staged draft отдельными inputs; фактический draft→active gate проверить в пакете 3. Не добавлять active-подмену или новый дизайн. |
| **F6 — статус доступности ошибочно описан общей Core-фразой** | `core/figma-library-standard.md` связывает доступность с workflow-paused; владельцем фактических routes является manifest, и email routes уже активны. | Перед maintenance cutover убрать копию статуса и оставить ссылку на текущий manifest/resolved workflow. Менять только эту нормативную связку, не дизайн или правила компонентов. |
| **F7 — обещанный generated workflow checkpoint пока не имеет активного producer/output** | Master-spec §11.1 требует человекочитаемые checkpoints из workflows. Manifest.generated_docs и `scripts/lib/generated-docs.mjs` RENDERERS содержат только component-registry, typography-registry, asset-registry, naming-reference; схема manifest допускает те же 4 renderer ID. В текущем tree checkpoints есть только в архиве. | Архитектурный/spec blocker до реализации пакета 3: провести review master-spec и определить producer, manifest source/output registrations, generated paths и tests либо отдельно согласовать изменение этого требования. Копия archived checkpoint не является решением. |

Негативные probes, подтвердившие существующие guards:

- Unknown workflow mode в coherent fixture → `WORKFLOW_MODE_UNKNOWN`.
- Unknown foundation → `CONTEXT_BUNDLE_FOUNDATION_UNKNOWN`.
- Shadow maintenance workflow при согласованных active route/profile arrays → `structured-workflow-status-topology-invalid`.
- Draft registered component → `COMPONENT_NOT_ACTIVE`; unknown component → `COMPONENT_UNREGISTERED`.

**Точная fixture-методика F1/F2/F4/F5.** Отдельная локальная копия: aggregate active, все 7 profiles structured-active, каждый route указывает на существующий зарегистрированный workflow (2 email → email-build, 5 maintenance → общий library-maintenance); оба workflow documents active; source_ids/static_source_ids равны, содержат свой workflow, не содержат workflow-paused, дедуплицированы. Это только средство пройти прежний topology gate для проверки внутренних API, не рекомендуемая production-активация. Затем изменяется ровно поле исследуемого случая.

Ранние неполные fixture arrays и повторное добавление уже имеющегося workflow-email-build дали topology/schema blockers; они исправлены **только в fixtures** и не являются продуктовыми findings. Значение status `draft` для naming foundation не разрешено schema: такой probe — construction-negative, не доказательство runtime inactive-status guard. Точный canonical shadow probe F4 приведён отдельно.

#### 5. Минимальная карта пакета 3 до написания кода

Текущая схема workflows допускает форму документов с перечисленными ниже modes; корректность source registrations, coherence и семантики inputs/gates требует отдельных проверок. Новые paths ниже — **предложенная карта реализации**, не существующие sources и не разрешение cutover; они сначала добавляются в candidate manifest. Все 5 main routes сохраняют P до пакета 5.

| Existing route | Workflow ID / source ID / exact path | Modes и применимые данные | Обязательные stop/handoff gates |
| --- | --- | --- | --- |
| library-maintenance | library-maintenance / workflow-library-maintenance / `data/workflows/library-maintenance.yaml` (существует) | read-only, write; B+C; выбранные component projections/F как scoped inputs; naming только при подтверждённом naming scope | scope ambiguous/conflict → request-input; missing source/evidence → stop; exact repository boundary; Figma allowlist/read-back только при соответствующем отдельном разрешении |
| component-onboarding | component-onboarding / workflow-component-onboarding / `data/workflows/component-onboarding.yaml` (новый) | read-only, write; B+C, naming definitions при naming-проверке, выбранные foundations; approved ready target/MCP facts и staged draft как inputs, не active contract | identity/семантика/полнота обеих версий/schema/reference/evidence → stop; Description write требует отдельной boundary; active только после успешных gates |
| figma-description-sync | figma-description-sync / workflow-figma-description-sync / `data/workflows/figma-description-sync.yaml` (новый) | read-only, write; B+C, selected both contracts и expected/actual Description; без обязательного naming foundation | drift preview не пишет; разрешённые target/Description fields; отдельный read-back/preservation; mismatch → stop, без auto-repair/sync/publication |
| figma-naming-audit | figma-naming-audit / workflow-figma-naming-audit / `data/workflows/figma-naming-audit.yaml` (новый) | read-only, write; B + полный figma-naming; MCP identity/confirmed semantic role/scale suffix/dependents; точная approved map для write | semantic-role-required или неподтверждённая карта → request-input/stop; только имена из карты; сохранение @2x/@4x и отдельный allowlist/preservation read-back |
| migration-progress | migration-progress / workflow-migration-progress / `data/workflows/migration-progress.yaml` (новый) | **только read-only**; repository-readme + migration-roadmap; свежие pinned SHA, listing plans и факты merge/artifacts как inputs; no components/foundations/Figma | cloud/source mismatch, отсутствующий roadmap/plan/artifact → stop; вывод различает выполненные, кандидатные и pending steps; никакого write-mode |

Для каждого step в пакете 3 явно сопоставить required_inputs с mode inputs/предыдущими outputs, typed blockers и on_blocked stop/request-input. Типизированные projections должны покрывать выбранные факты; один только source_versions или digest не доказывает наличие содержимого. Source closure guard проверяет действительную доступность правил выбранного mode и применимых условий, а не тупое равенство списка всех registry IDs и static_sources.

**Подтверждённые allowed paths пакета 3 по F1–F6.** Это ещё не закрытый список всей реализации: F7 требует review master-spec и дополнения карты producer/output paths до начала пакета 3. Отсутствие producer не разрешает молча опустить generated checkpoint.

1. `system/manifest.yaml`: новые source/workflow entries и подготовленные profile declarations; пять route.workflow_source_id не включать, email records сохранять.
2. `data/workflows/library-maintenance.yaml`.
3. Новые `data/workflows/component-onboarding.yaml`, `data/workflows/figma-description-sync.yaml`, `data/workflows/figma-naming-audit.yaml`, `data/workflows/migration-progress.yaml`.
4. `scripts/lib/system-manifest.mjs`: F2 и регистрационная/coherence-защита новых declarations.
5. `scripts/lib/skill-context.mjs`: F1 и доказанный dependency status gate; поддержка typed source/mode failures.
6. `scripts/lib/context-bundle.mjs`: только если нужен доказанный projection/source coverage интерфейс F1; не менять HTML projections ради удобства.
7. `scripts/lib/workflow-registry.mjs`: explicit step/input/source consistency checks по F1/F3; текущая `schemas/workflows.schema.json` не расширяется без отдельного доказательства недостаточности.
8. `core/figma-library-standard.md`: только F6 status-owner clause.
9. `schemas/figma-naming.schema.json`, при требуемом version change `scripts/lib/figma-naming-foundation.mjs` и version metadata `data/foundations/figma-naming.yaml`: только schema/version preparation F4. До записи обосновать version по master-spec §10 и закрепить её RED-тестом; не назначать bump вслепую, foundation.status оставить shadow до пакета 5. Naming definitions не изменять.
10. Тесты `tests/foundation/system-manifest.test.mjs`, `tests/foundation/figma-naming-foundation.test.mjs`, `tests/workflows/structured-workflows.test.mjs`, `tests/skills/skill-context.test.mjs`, `tests/skills/skill-context-cli.test.mjs`, `tests/skills/maintenance-skill-boundary.test.mjs`, `tests/generation/context-bundle.test.mjs`; остальные предусмотренные пакетом 3 generator/Description tests запускать без правок, если их поведения не изменяются.
11. `docs/generated/naming-reference.md`: только автоматическая регенерация при фактическом изменении naming schema/version inputs; не вручную.
12. Этот implementation plan — evidence/journal. Roadmap — только соответствующая фактическому merge статусная синхронизация.

**Зависимость F7:** пакет 2 сравнивает obligations существующих и архивных workflows/checkpoints; после этого до кода пакета 3 оформляется архитектурное решение по master-spec §11.1. До его review и добавления точных producer/schema/manifest/output/test paths пакет 3 не начинается. Master-spec в пакете 1 не меняется, требование генерации не отменяется.

Нельзя по этой карте менять `data/components/*.yaml`, typography/spacing/assets values, renderer, email workflow/skills, bootstrap или Figma. Новый path вне списка, расширение schema, смена версии с архитектурным эффектом или component fact change требует отдельного impact/review до записи. Карта должна быть сверена с semantic evidence пакета 2 перед implementation пакета 3.

#### 6. Следующий gate

Этот PR сохраняет findings пакета 1. Его final cloud head проходит scoped docs validation/generation, ссылки и exact allowed-path/preserved-blob gate, затем независимый review. Final SHA, результаты и PR-ссылка фиксируются в PR body, чтобы не создавать self-referential commit SHA внутри собственного файла.

Пакет 2 начинается **только после** проверки/отдельного merge этого PR и команды пользователя. Он снимает свежие Figma-backed факты representative owners обоих roots и сравнивает relevant archival obligations. Ни один визуальный факт, live mutation gate, полный 11A или cutover этим пакетом не объявляется выполненным. Резервная ветка `backup/pre-structured-migration-2026-08-24` подтверждена и сохранена на `48e4d6c5f51e1ccd2311b52f5805616f183150a8`.
