# CUPIS Email Build Skill Stage 10 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать repo-scoped навык сборки и точечного изменения конкретных CUPIS-писем, который управляет существующим structured email-build workflow через machine resolver, но не дублирует правила рендера и не включает paused routes.

**Architecture:** `building-cupis-emails` является тонким маршрутизатором: он классифицирует запрос, выбирает `email-new-build` или `email-continue-fix`, вызывает существующий `resolve:skill-context` и исполняет только возвращённый режим workflow. Точные component facts, HTML-правила, typography, spacing и asset profiles остаются в structured owners; локальная папка письма является только выходом конкретной задачи. Этап подготавливает и проверяет навык в shadow-режиме, а фактическое включение routes выполняется только на этапе 14 после сквозного сравнения этапа 13.

**Tech Stack:** Markdown skill, YAML/JSON-compatible manifest и workflows, Node.js 24 ESM, `node:test`, существующие context resolver, renderer CLI и bootstrap verifier.

**Spec:** `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`

## Global Constraints

- Канонический репозиторий — `flabenar-maker/e-mail`; persistent edits выполняются через cloud GitHub branch и PR.
- Все семь routes остаются `workflow-paused` до этапа 14; Stage 10 не выполняет cutover.
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
- Figma-библиотека, component contracts, foundations, renderer behavior и component-development route не меняются в этом этапе.

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

- [ ] **Step 3: Описать paused и future-active поведение**

При `paused` разрешены только read-only navigation и реализация этого migration plan. Production build и изменение локального письма не выполняются. При будущем `resolved` skill исполняет только returned bundle и ordered workflow steps, не открывая источники по памяти или ручному списку.

- [ ] **Step 4: Зарегистрировать skill**

Добавить в `manifest.skills.required`:

```yaml
- { id: building-cupis-emails, path: .agents/skills/building-cupis-emails }
```

README должен сообщать, что skill подготовлен в shadow-режиме и ещё не является разрешением production-сборки до cutover.

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

### Task 5: Выполнить shadow-проверку навыка без cutover

**Files:**
- Modify: test fixtures under `tests/skills/` only
- Preserve: `system/manifest.yaml` route workflow source IDs
- Preserve: Figma file and local production email folders

**Interfaces:**
- Consumes: подготовленный skill, resolver, structured email workflow and representative fixtures.
- Produces: Stage 10 verification summary для будущего сквозного сравнения этапа 13.

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

Expected: all tests pass; fixture proves future behavior, canonical routes remain paused.

---

### Task 6: Проверить exact cloud commit и опубликовать Stage 10

**Files:**
- Modify only paths explicitly introduced by Tasks 1–5.
- Modify after merge: `docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md`.

**Interfaces:**
- Consumes: final Stage 10 cloud branch SHA.
- Produces: reviewed PR, local verification evidence and exact Stage 10 status.

- [ ] **Step 1: Выполнить changed-content и preserved-boundary checks**

Проверить allowed-path diff, отсутствие Figma changes, отсутствие concrete email outputs, неизменность component/foundation/render facts и сохранение всех canonical routes на `workflow-paused`.

- [ ] **Step 2: Выполнить полный локальный gate на точном финальном SHA**

```powershell
npm ci --ignore-scripts
npm run verify
pwsh -NoProfile -File bootstrap/verify.ps1
```

Expected: all checks pass locally. GitHub Actions/Checks не запускались и не использовались.

- [ ] **Step 3: Открыть один draft PR**

PR должен перечислять: точный SHA, затронутые paths, локальные команды и результаты, сохранённые paused routes, отсутствие Figma и production-email изменений, а также отложенный Stage 13 shadow comparison и Stage 14 cutover.

- [ ] **Step 4: После отдельного разрешения на merge обновить roadmap**

Отметить Stage 10 завершённым только после появления implementation artifacts в `main`; добавить PR и merge commit. Не начинать Stage 11 автоматически.

## Success Criteria

- `building-cupis-emails` существует как repo-scoped thin router и зарегистрирован в manifest.
- Skill однозначно выбирает два email routes и пять workflow modes, не копируя domain facts или ordered steps.
- New build требует корректную пару конкретных Mobile/Desktop-инстансов; technical continue/fix не требует Figma без design dependency.
- Версионирование не перезаписывает исходник, использует шаг `0.1`, а output содержит только `email.html` и `images/`.
- Новый HTML проходит через resolved contracts, temporary model и renderer CLI; неизвестные или неполные факты дают typed blocker.
- Asset operations требуют MCP и resolved asset contract; все локальные `src` существуют.
- Representative marketing/service orchestration tests и локальные проверки проходят на точном cloud SHA.
- Canonical routes остаются `workflow-paused`; Figma, component contracts, foundations, renderer rules и local production emails не изменены.
