# CUPIS Codex Task Router and Web Email Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Codex автоматически направляет CUPIS-запрос к нужному существующему навыку, а подтверждённое письмо из Codex Web отдаёт скачиваемым пакетом `email.html + images/`.

**Architecture:** Верхнеуровневый repo-scoped навык выбирает между двумя существующими навыками и не копирует их правила. Сборка в вебе проходит тот же resolver, workflow, renderer и проверку, что локальная; отдельный delivery-адаптер после проверки упаковывает чистую версию в ZIP. Система остаётся облачной в GitHub, конкретные письма остаются вне репозитория.

**Tech Stack:** Codex repo skills, `AGENTS.md`, Node.js 24 ESM, действующие YAML manifest/workflow и resolver, Figma MCP, `fflate@0.8.3` с точной записью в `package-lock.json`, Node test runner, PowerShell bootstrap.

**Spec:** [CUPIS Codex routing and Web delivery design](../specs/2026-09-28-cupis-codex-routing-web-delivery-design.md). Исходные архитектурные ограничения: [master-spec](../specs/2026-08-24-cupis-structured-email-system-design.md), [roadmap](2026-08-25-cupis-migration-roadmap.md).

## Global Constraints

- Это отдельный пакет **после этапа 10 и до этапа 11**. Этапы 11–12, Figma и paused routes не включать.
- Область продукта: Codex локально и Codex Web, не обычный ChatGPT.
- Не добавлять HTML/CSS/Figma/component/asset факты в маршрутизатор, не менять structured contracts, foundations или renderer ради выдачи.
- `system/manifest.yaml` — единственный каталог routes и skills; специализация использует один resolved bundle и возвращённые `workflow.steps`.
- Локальный результат — версионная папка с `email.html` и `images/`. Веб-результат — ZIP с теми же двумя корневыми объектами, после полного gate. Никаких готовых писем/ZIP в GitHub.
- Cloud GitHub — постоянный источник. Для выполнения скриптов и тестов разрешён только временный exact-SHA snapshot, не рабочая копия; PR публикуется через облачный GitHub.
- Не запускать, читать или использовать GitHub Actions/PR Checks. После каждой задачи запускать узкие локальные проверки, полный `npm run verify` и `npm run generate:check` — один раз на точном финальном commit перед merge.
- Обычные тесты, failures/fixes и visual regression поручать `gpt-5.6-terra` с `medium`; координатор получает краткий итог, а не полный лог. Веб-готовность требует фактического smoke в Codex Web.
- Нельзя объединять локальную и веб-ветви «примерной» реализацией. Если Web не предоставляет Figma MCP, Node 24 или скачиваемые артефакты, вернуть проверенный blocker.

## Review Focus

1. Запрос «исправь письмо и контракт» может затронуть два навыка: тест маршрутизатора должен потребовать разделения и не дать записи в чужой области.
2. Веб-задача без Figma MCP/Node/канала скачивания: capability-smoke должен зафиксировать blocker, а не ложный «готовый ZIP».
3. Входной ZIP для continue/fix с `../`, абсолютным путём, symlink, повторным или лишним файлом: importer должен отклонить его до записи версии.
4. HTML с отсутствующим/выходящим за `images/` локальным `src`: packager должен отказать, даже если предыдущая проверка была заявлена как пройденная.
5. Неудачная упаковка или уже существующий ZIP: тест должен доказать неизменность исходной папки и невозможность частичного либо перезаписанного результата.

---

## Карта файлов и порядок пакетов

**Пакет A — маршрутизатор:** `.agents/skills/cupis-email-task-router/SKILL.md`, `AGENTS.md`, `system/manifest.yaml`, `README.md`, `bootstrap/README.md`, новые интеграционные тесты `tests/skills/cupis-email-task-router.test.mjs` и синхронизация `tests/helpers/system-fixture.mjs`. Существующие `bootstrap/verify.ps1` и `tests/foundation/system-manifest.test.mjs` проверяются без дублирующих изменений. Это только выбор специализации. Независимое review выявило доказанную потребность в узкой синхронизации `.agents/skills/building-cupis-emails/SKILL.md` и `.agents/skills/maintaining-cupis-email-system/SKILL.md`: сохранить переданный pinned SHA вместо повторного выбора `main`. Остальные инструкции и их технические правила не переписываются.

**Пакет B — веб-выдача:** новый `scripts/lib/email-delivery-bundle.mjs` отвечает только за проверку, импорт безопасного входного пакета и упаковку готовой версии; `scripts/package-email-version.mjs` — CLI-обёртка. `data/workflows/email-build.yaml` и `.agents/skills/building-cupis-emails/SKILL.md` объявляют Web как тип итоговой выдачи существующего `handoff`. `package.json` / `package-lock.json` фиксируют переносимую ZIP-зависимость. Тесты — `tests/workflows/email-delivery-bundle.test.mjs` и существующие workflow/skill tests. Никакой второй renderer, Web-only component contract или копии workflow.

**Пакет C — интеграция и приёмка:** `README.md` и bootstrap объясняют, как использовать тот же repo skill в локальном/Web Codex; локальные и реальные Web smoke фиксируются в implementation PR. После приёмки обновляются master-spec и roadmap статусы. Пакеты A и B публикуются разными implementation PR; B опирается на слитый A. Этот PR содержит только дизайн и план.

### Task 1: Зафиксировать архитектурные границы перед кодом

**Files:**
- Modify: `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`
- Modify: `docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md`
- Test: `tests/foundation/system-manifest.test.mjs` (сохранить текущие routes/status)

**Interfaces:**
- Consumes: согласованный spec этого плана и фактический `main`.
- Produces: явная граница «верхний выбор навыка / специализированный route / surface delivery» без нового владельца технических правил.

- [x] **Step 1: Дополнить master-spec.** Добавить ровно два решения: верхний выбор между специализированными навыками и surface-specific delivery после verified email output; не менять описание владельцев Figma/контрактов/renderer. В roadmap сохранить пакет 10A запланированным, этап 11 оставить незатронутым.
- [x] **Step 2: Проверить документационный diff.** Ручной review: ни одного утверждения о готовой Web-поддержке до smoke; `git diff --check` и `npm run validate` на exact-SHA snapshot должны пройти.
- [x] **Step 3: Зафиксировать отдельный commit.** `docs: define Codex task routing and Web delivery boundary`.

### Task 2: Тонкий skill выбора задачи (пакет A)

**Files:**
- Create: `.agents/skills/cupis-email-task-router/SKILL.md`
- Create: `tests/skills/cupis-email-task-router.test.mjs`
- Modify: `system/manifest.yaml`
- Modify: `tests/helpers/system-fixture.mjs` (добавить обязательный skill в существующий набор fixtures)
- Test: `tests/foundation/system-manifest.test.mjs`

**Interfaces:**
- Consumes: `skills.required` в manifest; только имена `building-cupis-emails` и `maintaining-cupis-email-system`.
- Produces: repo skill `cupis-email-task-router` с исходом `email`, `maintenance`, `clarify` или `not-ready`; выбранный специализированный навык сам разрешает route/mode.

- [x] **Step 1: Написать RED-тесты.** Интеграционные Node-тесты проверяют manifest registration, discoverable frontmatter и реальный отказ validator при отсутствующем/переименованном skill. Выбор направления, явный выбор, неоднозначность и смешанная область проверяются независимыми поведенческими probes модели без текстовых grep/assertions. До SKILL выполнить baseline без router; «новый блок» не должен подменяться onboarding, смешанный запрос не разрешает cross-scope write.
- [x] **Step 2: Запустить узкие тесты.** `node --test tests/skills/cupis-email-task-router.test.mjs tests/foundation/system-manifest.test.mjs` → ожидаемый FAIL до появления skill.
- [x] **Step 3: Добавить минимальный SKILL и manifest entry.** Текст skill содержит только критерии выбора и handoff, использует два существующих идентификатора навыков и не угадывает paused route. В `skills.required` добавить `cupis-email-task-router` с repo path; `routes` и `bundle_profiles` не менять.
- [x] **Step 4: Повторить те же тесты.** Ожидаемый PASS, затем `npm run validate` и `npm run generate:check` без новых generated-doc diffs.
- [x] **Step 5: Commit.** `feat: add top-level CUPIS task router skill`.

### Task 3: Обнаружение навыка и clean-context маршрутизация (пакет A)

**Files:**
- Modify: `AGENTS.md`, `README.md`, `bootstrap/README.md`
- Test: `bootstrap/verify.ps1` и `tests/skills/cupis-email-task-router.test.mjs`
- Test: `tests/skills/email-build-skill-boundary.test.mjs`, `tests/skills/maintenance-skill-boundary.test.mjs`

**Interfaces:**
- Consumes: `cupis-email-task-router` из Task 2.
- Produces: один короткий entrypoint в `AGENTS.md`, при этом bootstrap READ ONLY/RESTORE и существующие специализированные навыки сохраняются.

- [x] **Step 1: Добавить RED-тесты обнаружения.** Проверить потребляющей моделью переход от `AGENTS.md` к выбранному навыку, явный выбор и однозначную область без загрузки обоих specialized skills. Убедиться реальным negative fixture, что существующий manifest-driven `bootstrap/verify.ps1` блокирует отсутствующий router наравне с другими required skills; второй hardcoded каталог не добавлять.
- [x] **Step 2: Запустить targeted tests/bootstrap до изменения.** До записи pointer зафиксировать baseline обнаружения; RED регистрационной интеграции уже зафиксирован в Task 2. Если bootstrap уже покрывает новый required skill через validator, сохранить его код.
- [x] **Step 3: Внести минимальные entrypoint-правки.** Одна строка в `AGENTS.md` для CUPIS-запросов; README объясняет назначение трёх навыков без дублирования маршрутов; bootstrap использует manifest как каталог.
- [x] **Step 4: Проверить сценарии в чистом контексте.** Новый email, existing-email fix, read-only письмо, library/contract, migration status, новый компонент, неоднозначный запрос, смешанный запрос. Записать фактически выбранный skill/блокер в PR; если модель неверно выбирает, исправлять только метаданные/границу router, не технические правила.
- [x] **Step 5: Запустить targeted tests и Windows bootstrap; commit.** `node --test tests/skills/*.test.mjs tests/foundation/system-manifest.test.mjs`; `pwsh -NoProfile -File bootstrap/verify.ps1` (или Windows PowerShell). `docs: expose CUPIS task router across Codex entrypoints`.
- [ ] **Step 6: Закрыть пакет A отдельным gate.** На точном финальном cloud SHA пакета A прогнать локальные `npm run verify`, `npm run generate:check` и bootstrap, открыть draft PR A и получить отдельное разрешение на merge. Пакет B начинается только после слияния A; если Web-среда недоступна, завершённый A остаётся полезным самостоятельным результатом.

### Task 4: Реальный capability-gate для Codex Web (начало пакета B)

**Files:**
- Modify: implementation PR description only; продуктовые файлы не меняются, пока не подтверждены возможности среды.

**Interfaces:**
- Consumes: проверенный пакет A и тот же cloud `main`/candidate SHA.
- Produces: протокол фактической доступности repo skill, GitHub read, Figma MCP read, Node 24 + npm, временной среды и скачиваемого файла в **реальной Codex Web задаче**.

- [ ] **Step 1: В уже доступной Codex Web-задаче этого репозитория, открытой пользователем, проверить все шесть возможностей read-only; если такой задачи нет, попросить пользователя её открыть.** Нельзя выводить поддержку из desktop или документации API.
- [ ] **Step 2: Зафиксировать точный результат и blocker.** Если хотя бы одна обязательная возможность отсутствует, не обещать Web-ready и не переходить к интеграции как к «успешной»; локальный router остаётся отдельным готовым результатом.
- [ ] **Step 3: Привязать delivery-решение к реально доступному механизму скачивания.** Никаких промежуточных писем в GitHub или неподтверждённых ссылок на временный файловый путь.

### Task 5: Самодостаточный ZIP проверенной версии (пакет B)

**Files:**
- Create: `scripts/lib/email-delivery-bundle.mjs`
- Create: `scripts/package-email-version.mjs`
- Create: `tests/workflows/email-delivery-bundle.test.mjs`
- Modify: `package.json`, `package-lock.json`

**Interfaces:**
- Produces: `packageEmailVersion({ versionDir, outputZip }): Promise<{ outputZip: string, files: string[], sha256: string }>`. CLI: `npm run package:email -- --source <versionDir> --output <zip>`. ZIP-root: `email.html`, `images/`.
- Consumes: только уже проверенную версионную папку; не принимает temporary model и не запускает renderer.

- [ ] **Step 1: RED-тесты пакета.** Успешный ZIP распаковывается стандартным читателем и содержит только `email.html` + `images/*`; каждый локальный `src` существует. Отрицательные случаи: отсутствующий asset, путь наружу, лишний файл, symlink, пустой HTML, существующий output ZIP, сбой записи. Исходные байты до/после совпадают.
- [ ] **Step 2: Запустить `node --test tests/workflows/email-delivery-bundle.test.mjs`.** Ожидаемый FAIL из-за отсутствующих интерфейсов.
- [ ] **Step 3: Реализовать проверку и атомарную упаковку.** Использовать одну закреплённую portable ZIP-зависимость и lockfile; список файлов нормализован, ZIP создаётся рядом с версионной папкой во временном имени и переименовывается только после read-back; существующий ZIP не перезаписывается. Формат изображения и HTML не переписывать.
- [ ] **Step 4: Повторить targeted tests и CLI round-trip.** PASS; распакованное `email.html` и каждый image-файл побайтово совпадают с input; неуспех не оставляет частичный ZIP.
- [ ] **Step 5: Commit.** `feat: package verified email versions for download`.

### Task 6: Безопасный Web continue/fix без перезаписи источника (пакет B)

**Files:**
- Modify: `scripts/lib/email-delivery-bundle.mjs`
- Create: `scripts/import-email-source.mjs`
- Modify: `package.json`
- Modify: `tests/workflows/email-delivery-bundle.test.mjs`
- Test: `tests/skills/email-build-handoff.test.mjs`

**Interfaces:**
- Produces: `importEmailSourceBundle({ sourceZip, workspaceRoot }): Promise<{ sourceFolder: string, sourceDir: string }>`. CLI: `npm run import:email -- --source <zip> --workspace <temporary-root>`. Имя входа `<slug>_<major>.<minor>.zip` задаёт существующую версию; импортирует её в новую временную рабочую область.
- Consumes: `createEmailVersion` из `scripts/lib/email-build-orchestration.mjs` для следующего номера, не изменяя импортированный источник.

- [ ] **Step 1: RED-тесты входного архива.** Принять валидный пакет Task 5; отклонить произвольное имя без версии, дубли, `../`, абсолютные/Windows-пути, symlink, лишние root entries и несуществующие локальные `src` до создания новой версии.
- [ ] **Step 2: Запустить targeted tests.** Ожидаемый FAIL по отсутствующему importer.
- [ ] **Step 3: Реализовать безопасное чтение в отдельной временной папке.** Preflight читает metadata центрального каталога ZIP и отклоняет symlink; распаковка не использует входное имя как путь до проверки. Затем вызвать действующий механизм `createEmailVersion`; на сбое убрать только свою staging-папку, не источник.
- [ ] **Step 4: Повторить тесты.** Исходный ZIP и импортированная версия `1.0` побайтово сохранены, `continue/fix` создаёт `1.1`; при design-dependent изменении Figma-пара остаётся обязательной.
- [ ] **Step 5: Commit.** `feat: import versioned email bundle for Web fixes`.

### Task 7: Подключить surface delivery к действующему email handoff (пакет B)

**Files:**
- Modify: `data/workflows/email-build.yaml`
- Modify: `.agents/skills/building-cupis-emails/SKILL.md`
- Modify: `README.md`
- Modify: `tests/workflows/structured-workflows.test.mjs`
- Modify: `tests/skills/email-build-skill-boundary.test.mjs`
- Modify: `tests/skills/email-build-handoff.test.mjs`

**Interfaces:**
- Consumes: verified `version-folder` и `packageEmailVersion` / `importEmailSourceBundle`.
- Produces: существующий `handoff` возвращает локальную папку на desktop или скачиваемый ZIP на Web. Новый route, alternate renderer и новая component schema не создаются.

- [ ] **Step 1: RED-тесты выбора поверхности.** Проверить, что `new-build` и оба `continue-fix` объявляют разрешённый `download-archive` только как итог `handoff`; `read-only`/`clarify` не создают ZIP. Desktop output не меняется; Web handoff запрещён до `verify-rendered-email` и `clean-output-folder`.
- [ ] **Step 2: Запустить targeted workflow/skill tests.** Ожидаемый FAIL по отсутствующему разрешённому выходу.
- [ ] **Step 3: Расширить только финальный handoff.** В workflow разрешить `download-archive` в build/fix modes и `handoff`; в email skill кратко указать surface selection и CLI без копии правил ZIP. При недостатке Web-инструментов вернуть blocker. README описывает получение файла без обещания API-специфического механизма.
- [ ] **Step 4: Повторить targeted tests.** Проверить неизменность списка routes, paused statuses, renderer outputs и исходных локальных писем.
- [ ] **Step 5: Commit.** `feat: expose Web download at verified email handoff`.

### Task 8: Приёмка и публикация реализации (пакет C)

**Files:** только исправления, прямо вытекающие из обнаруженного defect в файлах Tasks 1–7; документация статуса — master-spec и roadmap после подтверждённой приёмки.

**Interfaces:** исполняемый пакет A+B на точном cloud commit.

- [ ] **Step 1: На финальном cloud commit создать изолированный exact-SHA snapshot и запустить узкие проверки затронутой области.** Node 24, `npm ci --ignore-scripts`, `npm run validate`, `npm run generate:check`, skill/workflow/package tests, Windows bootstrap. Тесты/логи — Terra Medium.
- [ ] **Step 2: Выполнить один полный локальный `npm run verify` на том же финальном SHA.** При правке кода/контрактов закрепить новый SHA и повторить финальную проверку; не обращаться к Actions/PR Checks.
- [ ] **Step 3: Проверить визуальную регрессию маркетингового и сервисного писем.** Terra Medium сравнивает Mobile/Desktop с принятыми референсами; упаковка не должна менять байты HTML/images или layout. Не подменять браузерную проверку почтовыми клиентами.
- [ ] **Step 4: Реальный clean-context smoke в доступной пользователю Codex Web-задаче.** Новое письмо по валидной Mobile/Desktop-паре, скачивание и повторное открытие ZIP; затем технический continue/fix из этого ZIP с новой версией. Если Figma/артефакты недоступны, отметить Web blocked и не заявлять полную готовность.
- [ ] **Step 5: Проверить allowed-path diff.** Нет новых готовых писем в GitHub, изменений Figma/контрактов/renderer, случайных файлов или повторных правил. Обновить roadmap фактами только после слияния соответствующего implementation PR.
- [ ] **Step 6: Handoff.** Предъявить пользователю PR, локальные результаты и ограничения. Слияние — только по отдельной команде; этап 11 не начинать.

## Self-review перед исполнением

- Все решения spec имеют владельца: router (Tasks 2–3), Web capability (Task 4), выдача/import (Tasks 5–6), workflow handoff (Task 7), приёмка (Task 8).
- Технические компоненты, значения контрактов, HTML и Figma остаются у прежних владельцев.
- Пакет A можно принять отдельно; пакет B не считается завершённым без реального Codex Web smoke.
- План не делает GitHub Actions gate и не меняет статус этапов 11–12.
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
- Финальный package-A gate и публикация candidate PR фиксируются локальными результатами на его точном SHA в PR. До merge пакет A не считается находящимся в `main`; пакет B/C и этап 11 не начаты.

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

Дополнительный неоднозначный запрос «Сделай письмо» без исходников даёт `clarify`: новое письмо или изменение существующего, без предположения о типе. Эти probes проверяют исполнение инструкций моделью; они не заменяют реальную Codex Web capability-проверку пакета B.
