# CUPIS Email Build Skill Stage 10 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать и установить repo-scoped навык сборки и точечного изменения конкретных CUPIS-писем, доказать его на двух реальных письмах и включить только два проверенных email routes для повседневной работы.

**Architecture:** `building-cupis-emails` является тонким маршрутизатором: он классифицирует запрос, выбирает `email-new-build` или `email-continue-fix`, вызывает существующий `resolve:skill-context` и исполняет только возвращённый режим workflow. Точные component facts, HTML-правила, typography, spacing и asset profiles остаются в structured owners; локальная папка письма является только выходом конкретной задачи. После fixture shadow tests email-only cutover сначала готовится только в candidate branch. На её exact SHA из чистого контекста выполняются реальные marketing/service builds и versioned continue/fix; только затем branch может быть слита, а exact skill установлен. Остальные routes остаются paused до этапа 14.

**Tech Stack:** Markdown skill, YAML/JSON-compatible manifest и workflows, Node.js 24 ESM, `node:test`, существующие context resolver, renderer CLI и bootstrap verifier.

**Spec:** `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`

## Уточнение продолжения от 2026-09-18

Tasks 7–8 выполняются по [детальному плану заполнения модели и E2E](2026-09-18-cupis-email-model-assembly-and-e2e.md), с предварительными пакетами уточнения входного процесса и проверки переноса данных. Существующий `email-model` сохраняется единственным форматом композиции; отсутствие отдельного автоматического Figma-импортёра само по себе не является блокером. Этот план не объявляет Tasks 7–8 завершёнными и не меняет их итоговые acceptance gates.

## Global Constraints

- Канонический репозиторий — `flabenar-maker/e-mail`; persistent edits выполняются через cloud GitHub branch и PR.
- До Task 6 routes в candidate остаются `workflow-paused`; Task 6 явно активирует только `email-new-build`, `email-continue-fix` и их зависимости в candidate для реальных E2E Task 7. До успешного Task 7 и разрешённого merge Task 8 маршруты `main` остаются paused. Остальные routes candidate и main остаются paused до этапа 14.
- Готовые `email.html`, `images/`, Figma exports, screenshots и временные модели не добавляются в репозиторий.
- Skill не содержит копий component contracts, foundation values, HTML/CSS recipes, export profiles, workflow steps или списка canonical paths.
- Для нового письма и design-dependent изменения требуются проверенные Mobile/Desktop-инстансы конкретного письма. Technical continue/fix не требует Figma, если изменение действительно не зависит от дизайна.
- Конкретный HTML строится только из зарегистрированных компонентов и точных resolved contracts. Неизвестный component, неполный viewport contract или asset contract — blocker, а не повод проектировать новый блок внутри email-build задачи.
- Экспорт ассетов выполняется только через Figma MCP по resolved asset contract. Renderer остаётся детерминированным и не обращается к Figma или сети.
- Каждое изменение существующего письма создаёт новую версию; исходная папка и её файлы не перезаписываются.
- Итоговая версия письма содержит только `email.html` и `images/`.
- Корнем сборки является конкретный Email/Template-инстанс. Вложенные cards, items, buttons, badges и asset sources не поднимаются в самостоятельные блоки только потому, что имеют отдельный component record.
- Точный пользовательский текст берётся из конкретного инстанса или явно переданного content input. Skill не восстанавливает контент по памяти и не заменяет его демонстрационными значениями.
- Финальные marketing URLs могут быть заменены вручную в Altcraft: skill сохраняет предоставленные ссылки или разрешённые безопасные placeholders, но не выполняет отправку через CRM и не блокирует техническую сборку из-за отсутствия финальной campaign-ссылки.
- Проверки выполняются локально на точном cloud SHA. GitHub Actions и PR Checks не запускаются и не используются как evidence.
- Figma-библиотека не меняется в этом этапе. Component contracts, foundations, renderer или workflow разрешено менять только отдельным scoped repair PR после воспроизведённого E2E-дефекта; такие изменения повторно проходят точную Figma-проверку, когда затрагивают implementation-significant fact.

## Entry Gate

До первого implementation commit пользователь предоставляет четыре точные Figma-ссылки:

1. Mobile-инстанс одного маркетингового тестового письма;
2. Desktop-инстанс того же маркетингового письма;
3. Mobile-инстанс одного сервисного тестового письма;
4. Desktop-инстанс того же сервисного письма.

Каждая пара должна относиться к одному письму, использовать существующие active компоненты библиотеки и содержать хотя бы один реальный asset, чтобы проверить MCP-export path. Если ссылки отсутствуют, роли Mobile/Desktop перепутаны или пары относятся к разным письмам, Stage 10 не начинается и запрашивает только недостающие или исправленные ссылки.

---

### Task 1: Зафиксировать машинную границу email-build skill

**Files:**
- Create: `tests/skills/email-build-skill-boundary.test.mjs`
- Modify: `docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md` только после слияния реализации

**Interfaces:**
- Consumes: существующие route IDs `email-new-build`, `email-continue-fix`; workflow modes `new-build`, `continue-fix-design`, `continue-fix-technical`, `read-only`, `clarify`.
- Produces: исполняемый набор boundary assertions для будущего `building-cupis-emails/SKILL.md`.

- [ ] **Step 1: Написать RED-тест маршрутизации**

Проверить, что будущий skill:

- вызывает `npm run resolve:skill-context`;
- выбирает только `email-new-build` или `email-continue-fix`;
- использует ровно один resolved bundle и только возвращённые `workflow.steps`;
- останавливается на `SKILL_ROUTE_PAUSED` без ручного fallback;
- не вызывает maintenance или component-development route.

- [ ] **Step 2: Написать RED-тест отсутствия дублирования**

Запретить в skill:

- пути `data/components/`, `data/foundations/` и `core/*.md`;
- точные размеры, цвета, breakpoint, export quality и перечень компонентов;
- копии workflow step IDs кроме команды machine resolver;
- готовые HTML/CSS-фрагменты.

- [ ] **Step 3: Написать RED-тест операционных границ**

Проверить явные запреты на Figma mutation, проектирование нового компонента, запись production-писем в GitHub, перезапись исходной версии и использование GitHub Actions.

- [ ] **Step 4: Запустить RED**

```powershell
node --test tests/skills/email-build-skill-boundary.test.mjs
```

Expected: FAIL, потому что `.agents/skills/building-cupis-emails/SKILL.md` ещё не существует.

---

### Task 2: Создать тонкий repo-scoped skill

**Files:**
- Create: `.agents/skills/building-cupis-emails/SKILL.md`
- Modify: `system/manifest.yaml`
- Modify: `README.md`
- Test: `tests/skills/email-build-skill-boundary.test.mjs`
- Test: `tests/foundation/system-manifest.test.mjs`
- Test: `tests/bootstrap-contract.Tests.ps1`

**Interfaces:**
- Consumes: `npm run resolve:skill-context -- --route <route-id> --mode <workflow-mode> ...`.
- Produces: skill `building-cupis-emails`, зарегистрированный в `manifest.skills.required`.

- [ ] **Step 1: Добавить skill frontmatter и trigger**

Использовать имя `building-cupis-emails`. Trigger должен покрывать создание нового CUPIS-письма, изменение существующего письма и read-only проверку конкретного письма, но не поддержку библиотеки и не проектирование новых компонентов.

- [ ] **Step 2: Описать выбор route и mode**

Зафиксировать только логику оркестрации:

| Запрос | Route | Mode |
|---|---|---|
| новое письмо с точными Mobile/Desktop-ссылками | `email-new-build` | `new-build` |
| изменение готового письма, зависящее от дизайна | `email-continue-fix` | `continue-fix-design` |
| техническое изменение готового письма без изменения дизайна | `email-continue-fix` | `continue-fix-technical` |
| аудит конкретного письма без изменений | подходящий email route | `read-only` |
| неясно, новое это письмо или изменение готового | подходящий email route | `clarify` |

Если запрос однозначен и не конфликтует с resolved workflow, дополнительный вопрос запрещён. Если тип задачи или Mobile/Desktop-роли не определены, skill обязан запросить ровно недостающий факт.

- [ ] **Step 3: Описать paused и active поведение**

До публикации cutover в Task 8 при `paused` разрешены только read-only navigation и реализация этого migration plan. Production build и изменение пользовательского письма не выполняются. После cutover при `resolved` skill исполняет только returned bundle и ordered workflow steps, не открывая источники по памяти или ручному списку.

- [ ] **Step 4: Зарегистрировать skill**

Добавить в `manifest.skills.required`:

```yaml
- { id: building-cupis-emails, path: .agents/skills/building-cupis-emails }
```

README должен сообщать, что skill становится рабочим только после успешного E2E-gate Task 7 и публикации email-only cutover в Task 8; наличие каталога skill до этого момента не разрешает production-сборку.

- [ ] **Step 5: Запустить GREEN для skill и manifest**

```powershell
node --test tests/skills/email-build-skill-boundary.test.mjs tests/foundation/system-manifest.test.mjs
pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1
```

Expected: all tests pass; все routes по-прежнему `workflow-paused`.

---

### Task 3: Закрепить классификацию входов и локальное версионирование

**Files:**
- Modify: `data/workflows/email-build.yaml` только если тест докажет отсутствующее обязательство
- Modify: `schemas/workflows.schema.json` только если существующая schema не выражает нужный typed input/blocker
- Modify: `core/email-rendering-standard.md` только если общего правила действительно нет у текущего владельца
- Modify: `tests/workflows/structured-workflows.test.mjs`
- Create: `tests/skills/email-build-orchestration.test.mjs`

**Interfaces:**
- Consumes: mode-specific `required_inputs`, `blockers`, `allowed_outputs` из `email-build.yaml`.
- Produces: проверяемую классификацию без дублирования component/render facts в skill.

- [ ] **Step 1: Написать RED-сценарии классификации**

Покрыть:

- new build без одной из Figma-ссылок → `figma-source-missing`;
- перепутанные или относящиеся к разным письмам Mobile/Desktop → `viewport-role-ambiguous` или `email-instances-mismatch`;
- design fix без точного scope → `change-scope-ambiguous`;
- technical fix без Figma → допустим;
- неопределимый тип запроса → `clarify`, без создания папки и файлов.

- [ ] **Step 2: Написать RED-сценарии версий**

Проверить договорённость orchestration layer:

- новое имя папки выводится из смысла письма, первая версия — `1.0`;
- при существующей версии выбирается следующий свободный шаг `0.1`;
- изменение приложенного письма использует его папку как source baseline, но создаёт новую sibling version;
- в новую папку переносятся только необходимые `email.html` и `images/`;
- source hashes до и после операции совпадают;
- output folder не содержит model JSON, screenshots, logs или test artifacts.

- [ ] **Step 3: Устранить только доказанные пробелы владельцев**

Если workflow уже полностью выражает обязательство, код/документ не менять. Если точный факт отсутствует, добавить его один раз в правильного владельца и оставить skill ссылаться только на resolver result.

- [ ] **Step 4: Запустить focused tests**

```powershell
node --test tests/skills/email-build-orchestration.test.mjs tests/workflows/structured-workflows.test.mjs
```

Expected: классификация и version boundary проходят без включения routes.

---

### Task 4: Проверить контракт renderer и asset handoff

**Files:**
- Create: `tests/skills/email-build-handoff.test.mjs`
- Modify: `tests/rendering/email-model.test.mjs` только при доказанном пробеле
- Modify: `tests/rendering/email-output.test.mjs` только при доказанном пробеле
- Modify: `tests/rendering/html-invariants.test.mjs` только при доказанном пробеле
- Preserve: `data/components/*.yaml`, `data/foundations/*.yaml`, `data/renderers/registry.yaml`

**Interfaces:**
- Consumes: resolved component contracts, `temporary-email-model`, renderer CLI output and asset directory.
- Produces: evidence that the skill orchestrates existing owners instead of inventing HTML or asset rules.

- [ ] **Step 1: Написать RED-тест нового письма**

На representative marketing и service fixtures проверить путь:

```text
resolved contracts → temporary model → render-email CLI → email.html
```

Skill не должен писать HTML вручную. `component-unregistered`, `viewport-contract-missing`, `contract-ambiguous`, `asset-contract-missing` и `renderer-diagnostic` должны останавливать путь до handoff.

Модель должна начинаться с конкретного Email/Template-инстанса и сохранять фактическую иерархию. Отдельные records вложенных cards, items, buttons, badges и asset sources используются только в их разрешённых местах дерева и не становятся самостоятельными секциями письма.

- [ ] **Step 2: Написать RED-тест asset boundary**

Проверить, что orchestration требует MCP-export evidence для design-dependent asset changes, использует только разрешённые имена файлов и после сборки подтверждает существование каждого локального `src`. Точные format/scale/quality/transparency значения не копируются в skill и поступают из resolved asset contract.

- [ ] **Step 3: Написать RED-тест продолжения готового письма**

Для design fix проверить Figma-dependent path и visual regression. Для technical fix проверить отсутствие обязательного Figma-вызова, сохранение source folder и отсутствие изменений вне exact scope.

- [ ] **Step 4: Проверить content и link handoff**

Проверить точное воспроизведение content inputs без восстановления по памяти. Предоставленный `href` сохраняется; если workflow разрешает placeholder, он остаётся безопасным и явно отмечается в handoff для последующей замены в Altcraft. Skill не отправляет письмо через CRM и не изменяет campaign data.

- [ ] **Step 5: Исправить только orchestration gap**

Если тест обнаружит renderer или contract defect, Stage 10 не маскирует его skill-инструкцией. Остановить пакет, классифицировать владельца и вынести исправление в отдельный scoped PR с Figma verification, когда меняется implementation-significant fact.

- [ ] **Step 6: Запустить focused tests**

```powershell
node --test tests/skills/email-build-handoff.test.mjs tests/rendering/email-model.test.mjs tests/rendering/email-output.test.mjs tests/rendering/html-invariants.test.mjs
```

Expected: orchestration boundary проходит; component, foundation и renderer files byte-identical, если отдельный defect не был доказан.

---

### Task 5: Выполнить shadow-проверку навыка до cutover

**Files:**
- Modify: test fixtures under `tests/skills/` only
- Preserve: `system/manifest.yaml` route workflow source IDs
- Preserve: Figma file and local production email folders

**Interfaces:**
- Consumes: подготовленный skill, resolver, structured email workflow and representative fixtures.
- Produces: pre-cutover verification summary и готовность к подготовке candidate cutover в Task 6 и реальным E2E-сборкам Task 7.

- [ ] **Step 1: В fixture явно активировать только тестируемый email route**

Как в Stage 9 resolver tests, заменить `workflow-paused` на `workflow-email-build` только внутри temporary fixture. Canonical manifest и cloud branch остаются paused.

- [ ] **Step 2: Проверить все пять режимов**

Проверить ordered steps, required inputs, blockers, allowed outputs и handoff для `new-build`, `continue-fix-design`, `continue-fix-technical`, `read-only`, `clarify`.

- [ ] **Step 3: Проверить минимальный контекст**

Убедиться, что email bundle содержит выбранные resolved contracts и referenced foundations, но не содержит maintenance rules, Figma Description, component-development standard/workflow или generated Markdown registry как runtime input.

- [ ] **Step 4: Проверить paused canonical behavior**

Canonical `email-new-build` и `email-continue-fix` должны возвращать `SKILL_ROUTE_PAUSED`; production email output отсутствует.

- [ ] **Step 5: Запустить shadow gate**

```powershell
node --test tests/skills/*.test.mjs tests/workflows/structured-workflows.test.mjs tests/generation/context-bundle*.test.mjs
npm run generate:check
```

Expected: all tests pass; fixture proves candidate behavior, canonical routes remain paused до реального E2E-gate.

---

### Task 6: Подготовить email-only cutover в candidate branch

**Files:**
- Modify: `system/manifest.yaml`
- Modify: `schemas/manifest.schema.json`
- Modify: `schemas/workflows.schema.json`
- Modify: `data/workflows/email-build.yaml`
- Modify: `schemas/components.schema.json`
- Modify: `data/components/shared.yaml`
- Modify: `data/components/marketing.yaml`
- Modify: `data/components/service.yaml`
- Modify: `schemas/typography.schema.json`
- Modify: `data/foundations/typography.yaml`
- Modify: `schemas/spacing.schema.json`
- Modify: `data/foundations/spacing.yaml`
- Modify: `schemas/assets.schema.json`
- Modify: `data/foundations/assets.yaml`
- Modify: `schemas/rendering.schema.json`
- Modify: `data/foundations/rendering.yaml`
- Modify: `schemas/renderer-registry.schema.json`
- Modify: `data/renderers/registry.yaml`
- Modify: `tests/foundation/system-manifest.test.mjs`
- Modify: `tests/workflows/structured-workflows.test.mjs`
- Modify: `tests/skills/skill-context.test.mjs`
- Preserve: Figma naming foundation, maintenance workflow/profile/routes and every non-email route

**Interfaces:**
- Consumes: successful Task 5 shadow gate.
- Produces: candidate branch с двумя active email routes и active email dependencies; cloud `main` и все non-email routes остаются paused.

- [ ] **Step 1: Написать RED-тесты частичного cutover**

Проверить следующие invariants:

- `structured_workflows.status` равен `partial`, когда email workflow active, а library maintenance workflow остаётся shadow;
- email bundle profiles имеют `structured-active`, не содержат `workflow-paused` и соответствуют active routes;
- `email-new-build` и `email-continue-fix` указывают на `workflow-email-build`;
- остальные routes продолжают указывать на `workflow-paused`;
- active email route не может разрешить shadow component registry, typography, spacing, assets, rendering foundation или renderer registry;
- resolver возвращает `resolved` для двух email routes и `paused` для остальных.

- [ ] **Step 2: Расширить status schemas без неявного перехода**

Разрешить точные состояния `shadow | partial | active` только там, где существует агрегированный статус, и `shadow | active` для отдельного registry/workflow/profile. Добавить cross-source semantic validation: статус `active` не выводится автоматически и допустим только при явном согласованном значении владельца.

- [ ] **Step 3: Активировать проверенные email dependencies**

Перевести в `active`:

- `data/workflows/email-build.yaml`;
- component registries shared/marketing/service;
- typography, spacing, assets и rendering foundations;
- renderer registry;
- bundle profiles `email-new-build` и `email-continue-fix`.

Figma naming foundation и library-maintenance workflow остаются shadow.

- [ ] **Step 4: Переключить только два route**

Для `email-new-build` и `email-continue-fix` установить `workflow_source_id: workflow-email-build`, удалить `workflow-paused` из их `source_ids` и `generated_bundle.static_source_ids`. Ни один другой route/profile не менять.

- [ ] **Step 5: Запустить cutover tests**

```powershell
node --test tests/foundation/system-manifest.test.mjs tests/workflows/structured-workflows.test.mjs tests/skills/skill-context.test.mjs tests/skills/skill-context-cli.test.mjs
npm run generate:check
```

Expected: на candidate SHA email routes resolve ordered workflow steps; remaining routes return `SKILL_ROUTE_PAUSED`; generated outputs do not drift unexpectedly. Branch не сливается до Task 7.

---

### Task 7: Собрать два реальных письма и выполнить versioned continue/fix

**Files:**
- Create locally only: `<marketing-semantic-name>_1.0/email.html`
- Create locally only: `<marketing-semantic-name>_1.0/images/`
- Create locally only: `<service-semantic-name>_1.0/email.html`
- Create locally only: `<service-semantic-name>_1.0/images/`
- Create locally only: `<selected-semantic-name>_1.1/email.html`
- Create locally only: `<selected-semantic-name>_1.1/images/`
- Preserve: repository tree, source Figma design and every `1.0` source folder during continue/fix

**Interfaces:**
- Consumes: four user-provided Figma instance URLs, exact candidate SHA from Task 6, candidate skill, Figma MCP and renderer CLI.
- Produces: two complete local builds, one versioned update and classified visual/technical evidence.

- [ ] **Step 1: Validate the four design inputs**

Через Figma MCP подтвердить для каждой пары Mobile/Desktop role, принадлежность одному письму, корневой Email/Template, только зарегистрированные active components и наличие asset path. Не выполнять полный library audit и не изменять Figma.

- [ ] **Step 2: Запустить candidate skill из чистого контекста**

Передать задачу fresh execution context, который получает только обычный пользовательский запрос, четыре ссылки и exact candidate SHA. Не использовать историю текущего чата, ручной список component facts, generated Markdown registry или Figma Description как implementation input.

- [ ] **Step 3: Собрать маркетинговое письмо**

Пройти полный `new-build`: validate sources → inspect design → resolve contracts → export assets через MCP → temporary model → renderer CLI → local output. Папка версии содержит только `email.html` и `images/`.

- [ ] **Step 4: Собрать сервисное письмо**

Повторить тот же путь независимо для сервисной пары. Использовать фактический component tree конкретного Email/Template и не поднимать nested-only records в самостоятельные блоки.

- [ ] **Step 5: Выполнить visual regression**

Сравнить обе сборки с соответствующими Mobile/Desktop Figma-инстансами. Классифицировать geometry, layout, spacing, visibility, image, typography/content и responsive regressions. Успех требует нуля неклассифицированных расхождений; различия браузерного antialiasing допускаются только как явно записанная неструктурная причина.

- [ ] **Step 6: Исправить доказанные defects в правильном владельце**

Skill wording не маскирует defect contract, renderer, asset foundation или workflow. Каждый implementation-significant Figma mismatch получает отдельный impact report и read-only перепроверку; изменение contract выполняется отдельным scoped PR. После любого исправления обе реальные сборки и focused regression запускаются заново.

- [ ] **Step 7: Проверить continue/fix и версионирование**

На одном из двух писем выполнить одну точную design-dependent или technical правку через skill. Создать sibling version `1.1`; подтвердить hash исходных `1.0/email.html` и всех файлов `1.0/images/` до и после операции. Новая папка снова содержит только `email.html` и `images/`.

- [ ] **Step 8: Проверить output evidence**

Для всех трёх output folders подтвердить существование каждого локального `src`, отсутствие orphan assets и временных model/log/screenshot файлов, корректные HTML-инварианты и отсутствие ссылок за пределы своей `images/`, кроме разрешённых внешних URL.

---

### Task 8: Опубликовать cutover, установить skill и проверить чистый чат

**Files:**
- Deploy after merge: local Codex skill installation from `.agents/skills/building-cupis-emails/`
- Modify only paths explicitly introduced by Tasks 1–7.
- Modify after merge: `docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md`.

**Interfaces:**
- Consumes: final Stage 10 candidate SHA, real E2E evidence and two candidate active email routes.
- Produces: reviewed PR, installed exact skill, clean-chat acceptance and exact Stage 10 status.

- [ ] **Step 1: Выполнить changed-content и preserved-boundary checks**

Проверить allowed-path diff, отсутствие Figma changes и concrete email outputs в репозитории, объяснённость каждого status change и сохранение всех non-email routes на `workflow-paused`.

- [ ] **Step 2: Выполнить полный локальный gate на точном финальном SHA**

```powershell
npm ci --ignore-scripts
npm run verify
pwsh -NoProfile -File bootstrap/verify.ps1
```

Expected: all checks pass locally. GitHub Actions/Checks не запускались и не использовались.

- [ ] **Step 3: Открыть один draft PR**

PR должен перечислять: точный SHA, затронутые paths, локальные команды и результаты, две реальные сборки и versioned fix, активируемые email routes, сохранённые paused routes, отсутствие Figma и repository-email mutations, rollback commit и оставшиеся ограничения client evidence.

- [ ] **Step 4: После отдельного разрешения слить PR и установить exact skill**

Установить локальный skill только из merged commit и проверить побайтовое совпадение установленного `SKILL.md` с repo-scoped source. Локальная установка является deployment-копией, а не источником редактирования.

- [ ] **Step 5: Выполнить clean-chat acceptance**

В новом чате без истории разработки дать обычный read-only запрос по одной проверенной Mobile/Desktop-паре, затем при подтверждённом `resolved` route выполнить новый build или scoped continue/fix в новой версии. Skill должен самостоятельно выбрать route/mode и разрешить контекст из merged `main`. Любая необходимость в памяти старого чата означает провал gate и требует исправляющего или revert PR по rollback point.

- [ ] **Step 6: Обновить roadmap**

Отметить Stage 10 завершённым только после merge, установки exact skill и clean-chat acceptance; добавить PR и merge commit. Зафиксировать два активных email routes и остальные paused routes. Не начинать Stage 11 автоматически.

## Success Criteria

- `building-cupis-emails` существует как repo-scoped thin router и зарегистрирован в manifest.
- Skill однозначно выбирает два email routes и пять workflow modes, не копируя domain facts или ordered steps.
- New build требует корректную пару конкретных Mobile/Desktop-инстансов; technical continue/fix не требует Figma без design dependency.
- Версионирование не перезаписывает исходник, использует шаг `0.1`, а output содержит только `email.html` и `images/`.
- Новый HTML проходит через resolved contracts, temporary model и renderer CLI; неизвестные или неполные факты дают typed blocker.
- Asset operations требуют MCP и resolved asset contract; все локальные `src` существуют.
- Реальное маркетинговое и сервисное письмо собраны из чистого контекста по Figma через MCP; visual gate не содержит неклассифицированных отклонений.
- Одно существующее письмо изменено через `continue/fix` в версии `1.1`, исходная `1.0` побайтово сохранена.
- `email-new-build` и `email-continue-fix` возвращают `resolved` и используют active structured dependencies; остальные routes возвращают `SKILL_ROUTE_PAUSED`.
- Local skill установлен из merged SHA и проходит clean-chat acceptance без памяти предыдущего чата.
- Figma и local source emails не изменены; готовые письма, assets и visual reports не попали в репозиторий.
- Известное отсутствие Altcraft/real-client evidence явно указано и не выдается за browser-tested compatibility.
