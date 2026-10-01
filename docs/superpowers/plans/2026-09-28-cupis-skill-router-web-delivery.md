# CUPIS Local Task Router Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Закрыть локальный маршрутизатор и привести глобальный маршрут к двум специализациям и финальному cutover, без Web-выдачи или проектирования новых блоков.

**Architecture:** Слитый thin router выбирает существующий email или maintenance skill и передаёт один pinned SHA. Система остаётся в cloud GitHub, письма — локально. Этот план закрывает документацию/установку 10A; финальный cutover имеет собственный последующий implementation plan.

**Tech Stack:** Repo skills, Markdown, manifest-driven resolver, Node.js 24, локальный Node test runner, PowerShell bootstrap, GitHub CLI.

**Spec:** [Локальная маршрутизация](../specs/2026-09-28-cupis-codex-routing-web-delivery-design.md), [master-spec](../specs/2026-08-24-cupis-structured-email-system-design.md), [roadmap](2026-08-25-cupis-migration-roadmap.md).

## Global Constraints

- Только локальный Codex. Постоянный источник — cloud GitHub; snapshot — только exact-SHA execution/verification, не авторинг.
- Сохранить пакет A, уже слитый PR #103/#104. Отмена Web и design-time частей не является откатом router.
- Не менять Figma, component contracts, foundations, renderer, route/profile статусы или конкретные письма в документационном пакете.
- Три зарегистрированных skill entries — две специализации и один thin router. Не создавать `developing-cupis-email-components`, design-time workflow/standard/route.
- Существующий onboarding готового одобренного компонента сохранить как maintenance. Email-build не проектирует и не регистрирует неизвестный компонент скрытно.
- Все проверки локально через Terra Medium, без Actions/PR Checks. Для docs-only пакета scoped gate; полный suite не повторять без изменения кода/контрактов.
- Локальную установку/обновление навыков и merge выполнять только по отдельным разрешениям. Ручной context checkpoint не обновлять без прямого запроса.

## Review Focus

1. Отмена будущего design-time контура не удаляет onboarding, naming generator или validators уже существующей библиотеки.
2. Старые номера этапов 13–15 в истории не создают обязательство разработать отменённые этапы 11–12.
3. Repo registration и merged tests не доказывают, что router установлен и обнаруживается в локальном Codex.
4. Документальная корректировка не переключает paused route и не выдаёт status label за доказательство фактических Figma/contract данных.
5. Web-сценарии и ZIP код не возвращаются в будущие задачи через journal, README, master-spec или критерий приёмки.

---

## Завершённый пакет A

- [x] Тонкий `cupis-email-task-router`, registration и integration/negative fixtures.
- [x] Project entrypoint и bootstrap discovery; clean-context behavior probes.
- [x] SHA handoff исправлен в существующих специализациях без копии правил.
- [x] Exact-head local gate и merge [#103](https://github.com/flabenar-maker/e-mail/pull/103), [#104](https://github.com/flabenar-maker/e-mail/pull/104).

Локально проверенный head #104 — `51d6791c72f3f31298766087c6c560524a1664db`. Merge `main@03606db5319a94327dd6713ae529f40e4c068e7a` и этот head имеют одинаковый tree SHA `3f17c40506d0443cea35351b0c5b897df59de5f6`. Системная валидация, полный Node-набор (67 test files, exit 0), generate:check и Windows bootstrap выполнены до merge. Это доказательство исходного пакета A, не новых документов или локальной установки.

### Task 1: Документальная синхронизация нового объёма

**Files:**
- Modify: `docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md`
- Modify: `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`
- Modify: этот plan и его routing spec
- Modify: `README.md`
- Modify: downstream/navigation разделы plans component documentation, generated bundles, Stage 8, foundation remediation, Stage 9 и Stage 10
- Preserve: historical execution steps, raw context checkpoint, runtime/data/code и Figma

**Interfaces:** Consumes: merged A и прямые решения пользователя от 01.10.2026. Produces: согласованные архитектура, порядок 10A → 11A/11B/11C и отсутствие будущих Web/design-time обязательств.

- [x] **Step 1: Обновить только архитектурные и навигационные части.** Две специализации, локальный output, отмена B/C и прежних design-time этапов; прежние proof/switch/cleanup перенести в финальный cutover. Не сбрасывать завершённые этапы.
- [x] **Step 2: Проверить точный финальный cloud SHA локально.** `git diff --check`, `node scripts/validate-system.mjs`, `node scripts/generate-docs.mjs --check`, локальные Markdown links, allowed-path и preserved-blob checks. Отдельно проверить отсутствие новых активных Web/design-time tasks и сохранность cutover gates. При docs-only diff полный suite не нужен.
- [x] **Step 3: Обновить существующий draft PR #105.** В title/body указать новый объём, отменённые части, exact SHA и scoped результаты. Слияние отдельно, не автоматически.

Task 1 выполнен и слит через [PR #105](https://github.com/flabenar-maker/e-mail/pull/105). Проверенный head `284fdc658201ceacead1ef6cdd7592c91e7789f1` и merge `e08b5099f72b9ac3aa7aff33df6a3a3526868232` имеют одинаковый tree `fa68fb8dd241c0ffb45781378feaead4f84a0ca2`; scoped local gate и независимый review прошли.

### Task 2: Синхронизация навыков и локальное закрытие 10A

**Files:**
- Review/modify only if authorized: `.agents/skills/cupis-email-task-router/SKILL.md` (отменённые surface/ожидание design-time handoff)
- Verify: existing `.agents/skills/building-cupis-emails/SKILL.md`, `.agents/skills/maintaining-cupis-email-system/SKILL.md`, manifest registrations
- Local install: только manifest-declared навыки из одного слитого SHA после отдельного разрешения
- Test: `tests/skills/cupis-email-task-router.test.mjs`, `tests/skills/email-build-skill-boundary.test.mjs`, `tests/skills/maintenance-skill-boundary.test.mjs`, bootstrap verifier и independent clean-context probes

**Interfaces:** Consumes: merged Task 1, current manifest и bootstrap. Produces: фактически обнаруженные локальные навыки с подтверждённым SHA/handoff; никаких component facts в skill.

- [ ] **Step 1: Перед разрешённой skill-правкой прочитать skill-creator/writing-skills и снять конкретный handoff diff.** Убрать только устаревшие surface/будущую design-time специализацию; сохранить email/maintenance/clarify/not-ready, явный выбор, mixed scope, pinned SHA и gates. Не превращать отмену проектирования в разрешение onboarding по догадке.
- [ ] **Step 2: Проверить изменённую границу targeted tests и независимыми probes.** Новый email, existing technical fix, read-only письмо, maintenance, migration status, mixed/ambiguous request и новый дизайн вне scope. Если skill code/behavior изменён, перед merge выполнить финальный полный локальный gate на точном commit.
- [ ] **Step 3: После merge и отдельного разрешения синхронизировать локальные навыки по bootstrap.** Не перезаписать глобальный конфликт без разрешения; проверить byte/source соответствие, discovery и clean-context handoff. Не создавать письмо ради теста выбора.
- [ ] **Step 4: Обновить roadmap фактами.** Закрыть только подтверждённые пункты 10A. Затем подготовить detailed plan финального этапа 11; не переключать маршруты в этом пакете.

## Проверенные результаты локального закрытия — 01.10.2026

- Отдельным разрешением пользователь подтвердил merge #105 и установку/обновление. Три навыка установлены из `e08b5099`; четыре файла точно совпадают с canonical Git blobs, две прежние копии сохранены побайтово в резервной папке вне discovery root. Другие навыки/config/письма не менялись.
- На следующем пользовательском ходе `cupis-email-task-router` появился в реально предоставленном каталоге навыков Codex. Router прочитан и передал `e08b5099` навыку поддержки; fresh resolver `migration-progress/read-only` вернул `paused/SKILL_ROUTE_PAUSED`, без обхода границы.
- В PR #106 подготовлена разрешённая точечная правка: только локальная среда и out-of-scope вместо ожидания будущего design skill. Baseline прямо называл `local Codex or Codex Web` и `specialization is not active`; новая независимая probe читает только local Codex и возвращает not-ready для проектирования. Остальные девять сценариев сохраняют email/maintenance/clarify, явный выбор, mixed dependency и paused gates.
- Targeted gate на `bc7040adf3ed99eaef51ea63cb5e9e83cf08b716`: 10/10 Node boundary tests, validation, generate:check, Windows bootstrap и bootstrap contract PASS. Это результат skill-only коммита, не финального пакета с новым планом; final verification записывается в PR #106 на его точном head.
- **Ruling:** cloud-only требование пользователя исключает локальную authoring-worktree/ledger. Изменения делаются cloud branch/PR, журнал — здесь и в PR, exact-SHA snapshot используется лишь для исполнения; это сохраняет облачное владение источником.
- Итоговая правка ещё требует merge и отдельно разрешённой синхронизации установленной копии. 10A не объявляется завершённым только по подготовленному diff.
- [План финального cutover](2026-10-01-cupis-final-maintenance-cutover.md) подготовлен по master-spec и roadmap. Его пакеты ещё не выполнялись; старые unchecked задачи Task 2 закрываются только после фактических соответствующих gates.

## Отменённые части — не очередь выполнения

01.10.2026 отменены прежние Tasks 4–8 Web-ветви: capability-smoke, ZIP packager/import, Web handoff и Web acceptance. Продуктовый код не написан; удалять/откатывать нечего. Исходная версия плана доступна в Git history на `03606db5319a94327dd6713ae529f40e4c068e7a`.

Также отменены глобальные этапы design standard/workflow и design skill новых блоков. Onboarding готового компонента не отменён. Прежние глобальные 13–15 сохранены как проверки, включение и очистка финального cutover, не как дополнительные направления разработки.

## Self-review

- В каждом документе два владельца предметных задач и один thin entrypoint.
- Переключение paused routes, очистка архива и обновление установленной среды имеют отдельные gates.
- Завершённый A не спутан с локальной установкой; отменённые задачи не помечены выполненными.
- Финальный cutover не зависит от Web или design-time контура.
- Sources/data/code/Figma сохраняются; docs-only gate не превращается в повторный full suite.

## Исторический журнал исходного пакета A

Записи ниже описывают последовательность на момент выполнения; актуальный объём и следующие задачи находятся выше. Web-пробы являются историческими отрицательными проверками, не новой Web-приёмкой.

## Журнал выполнения пакета A — 2026-10-01

- План и решение одобрены командой пользователя «Делай». Реализация — отдельная branch `codex/cupis-task-router` поверх неслитого plan PR #103; его merge и merge реализации требуют отдельных команд.
- Baseline без router: новый дизайн блока был выбран как maintenance/component-onboarding. Это неверная подмена назначения; router должен вернуть `not-ready` для отдельного design-time маршрута.
- RED на `e32922e960ea930b0caf722b7243437d70807400`: 106 тестов, 103 PASS, 3 ожидаемых router-registration FAIL; validation и generate:check PASS локально.
- Интеграция проверяется действующим validator, выбор и границы — поведением независимой модели, не совпадением слов в SKILL. Это уточняет способ тестирования, а не продуктовые правила.
- В fixture helper добавляется новый обязательный skill: без этого имеющиеся системные fixtures стали бы неполными.
- Verifier уже вызывает manifest-driven validator для всех required skills; отдельный hardcoded router-check или второй каталог не нужен. Его реальный negative case проверяется локально.
- В двух существующих specialized skills меняется только выбор источника при handoff: они повторно не выбирают `main`, а сохраняют доверенный переданный SHA; standalone self-pin остаётся. Потребность подтверждена RED behavior-probe и независимым review. Routes/profiles/statuses, Figma, component contracts/foundations, renderer, generated docs и локальные письма сохраняются.
- GREEN Task 2 на `d024403c9f84afef62558fc69dfd38dcc3708b70`: 106/106 targeted tests, validation и generate:check PASS; оба negative fixtures дают path-specific diagnostics.
- Discovery candidate `6be4935f2274d341d41c4d7fd10e2c9340b14f11`: targeted skill/manifest tests и Windows bootstrap PASS. Удалённый из отдельного fixture router даёт ровно один `missing-required-skill` blocker; production snapshot не редактировался.
- Независимый обзор обнаружил handoff A→B: router закреплял A, а специализации выбирали новый `main` B. RED воспроизведён без записей. На `9ee5a39015d58d1a9add4f8dc354ac1bdf0bf317` оба навыка сохраняют A; standalone выбирает текущий B; явно разрешённый candidate использует его SHA; source mismatch останавливает работу. Повторный независимый review не нашёл блокирующих замечаний.
- Уточнена граница обнаружения: repo entrypoint или сам skill должен быть загружен. Remote `AGENTS.md` не устанавливает/активирует навык в projectless-чате. Candidate не устанавливается глобально до публикации.
- После handoff-правки на `9ee5a39015d58d1a9add4f8dc354ac1bdf0bf317`: все targeted skill/manifest tests, validation, generate:check и Windows bootstrap PASS; тесты не правились.
- Финальный package-A gate пройден локально на `51d6791c72f3f31298766087c6c560524a1664db`: системная валидация, полный Node-набор (67 test files, exit 0), generated-doc check, Windows bootstrap и его контрактные проверки. GitHub Actions/PR Checks не использовались. Последующий premerge recheck подтвердил неизменность heads, allowed-path diff и сохранённые blobs; повторены только узкие validation/generated-doc проверки.

### Независимая поведенческая проверка

На `6be4935f2274d341d41c4d7fd10e2c9340b14f11` Terra Medium из отдельного контекста читала project entrypoint, manifest и только выбранные навыки, не design/plan для угадывания ответа. Никаких Figma-операций или записей. Последующая handoff-проверка выполнена на `9ee5a39015d58d1a9add4f8dc354ac1bdf0bf317`.

| Запрос | Наблюдаемый выбор/граница |
| --- | --- |
| Новое письмо по точной паре | email → building |
| Только alt в готовом письме | email → building; technical, исходная версия сохраняется |
| Read-only проверка готового письма | email → building; без записи |
| Изменение контракта/реестра | maintenance → maintaining; paused не обходится |
| Статус миграции | maintenance → maintaining; read-only |
| Дизайн нового блока | not-ready; не onboarding и не email-build |
| Недостаточно данных о правке | clarify; до записи нужна конкретизация |
| Письмо + изменение контракта | раздельные области; stopped dependency не обходится |
| Явно выбран maintaining | выбор сохраняется, router не загружается повторно |
| Ознакомиться с проектом | bootstrap READ ONLY, без предметного skill |
| Явно выбран building для контракта | конфликт области объясняется; нет молчаливого переключения |
| Web ZIP с fallback-коммитом письма | нет ложной Web-ready; commit письма в GitHub запрещён |

Дополнительный неоднозначный запрос «Сделай письмо» без исходников даёт `clarify`: новое письмо или изменение существующего, без предположения о типе. Эти probes проверяли исполнение инструкций моделью, а не фактическую Web-среду. Пакет B отменён 01.10.2026 и не является следующим шагом.

## Переход после пакета A — решение 01.10.2026

Пакет A слит; пакеты B/C отменены. Предварительные ответы двух пользовательских облачных сред не доказали полный путь snapshot → resolver → Figma export и не являются условием локального cutover. Проверки Web не продолжаются. Ручной context checkpoint и продуктовые файлы в этой корректировке не меняются.
