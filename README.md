# Рабочая система email-библиотеки

Этот репозиторий хранит канонические инструкции и рабочие процессы для поддержки Figma-библиотеки и вёрстки HTML-писем, а также рабочие навыки Codex, которые маршрутизируют задачи к этим источникам.

Сами письма здесь не хранятся. `email.html`, папка `images/`, тестовые результаты, архивы и прочие файлы конкретного письма остаются в отдельной локальной рабочей папке.

`system/manifest.yaml` — единственная машинно-читаемая карта системы. Она связывает текущие источники, маршруты, наборы контекста, навыки, плагины и bootstrap-команды. Пути нужно разрешать через manifest; будущие или сгенерированные файлы нельзя считать существующими, пока они явно не добавлены в него.

### Теневой пилот типографики

`data/foundations/typography.yaml` — проверяемый структурированный пилот определений текстовых стилей. `registry/email-typography-registry.md` пока остаётся контрольным Markdown-снимком и текущим владельцем списков компонентов-потребителей. Рабочие bundle profiles продолжают использовать Markdown-реестр до отдельного этапа перехода на generated docs и context bundles.

### Structured foundation отступов

`data/foundations/spacing.yaml` — машинно-проверяемый shadow-источник золотого правила отступов для поддержки и разработки библиотеки. Он подключён только к maintenance-маршрутам и не входит в `email-new-build` или `email-continue-fix`.

При проектировании нового или изменении существующего компонента foundation разрешает semantic role в одно точное Mobile- и Desktop-значение. После этого значения фиксируются в Figma, Description и реестре. При вёрстке конкретного письма Codex не применяет золотое правило, не вызывает spacing resolver и использует только фактические значения конкретного инстанса и component contract.


### Теневая база правил ассетов

[data/foundations/assets.yaml](data/foundations/assets.yaml) — структурированный shadow-источник общих asset/export definitions; пока generated bundles работают в shadow-режиме, он не является отдельной инструкцией для HTML-сборки. Структура проверяется [машинной схемой](schemas/assets.schema.json), а этап внедрения описан в [implementation plan](docs/superpowers/plans/2026-08-26-cupis-assets-foundation.md).

Foundation владеет общими definitions и совместимостью режимов. [Реестр компонентов](registry/email-component-descriptions-registry.md) владеет конкретным выбором asset, границей экспорта и отображаемыми размерами; [текущий Markdown-промт](core/email-figma-prompt.md) остаётся активной контрольной базой до отдельного cutover.

### Теневая база нейминга Figma

[data/foundations/figma-naming.yaml](data/foundations/figma-naming.yaml) хранит проверяемые универсальные определения нейминга отдельно от generator и validator. Generator получает уже подтверждённую семантику и предлагает одно имя; validator проверяет только один явно переданный вариант.

Этот foundation пока не входит в рабочие bundle profiles, не активирует maintenance skill и не разрешает переименование в Figma. Подключение навыка и любые Figma-записи выполняются на последующих этапах через отдельное согласование.

### Теневой реестр и документация компонентов

Три файла — `data/components/shared.yaml`, `data/components/marketing.yaml` и `data/components/service.yaml` — являются структурированным источником component-specific данных. Общая проверка контролирует их схему, связи, независимые Mobile/Desktop-контракты и документационную семантику.

Из одной записи строятся два разных представления:

- `scripts/lib/component-registry-doc.mjs` формирует полную документацию компонента в generated registry;
- `scripts/lib/component-description.mjs` формирует компактный Figma Description: идентификатор, назначение, тип рендера и только выбранные критические ограничения.

Generated registry является читаемым представлением данных, а не новым источником. Файлы в `docs/generated/` не редактируются вручную: изменения вносятся в structured data, после чего документация пересобирается.

Figma Description также не является входом для вёрстки письма. Email build должен получать выбранные фактические Mobile/Desktop-контракты из component data; отсутствие или устаревание Description не должно менять HTML-результат.

Пока рабочим источником для поддержки библиотеки и вёрстки остаётся `registry/email-component-descriptions-registry.md`. Structured component-файлы и generated-представления работают в shadow-режиме, поэтому текущие маршруты и сборка писем не меняются.

Для доказательной сверки конкретной structured-записи используется свежий read-only пакет Figma MCP и `scripts/audit-figma-contract-facts.mjs`. Проверка сравнивает фактические Mobile/Desktop-данные (включая тексты, типографику, отступы, цвета и свойства) с точными contract-полями в обе стороны. Связи полей принадлежат самой записи в `contracts.figma_fact_links`; миграционный статус и Markdown-снимок не заменяют эту проверку. Пока запись не прошла её, её нельзя считать подтверждённой Figma.

На этом этапе Figma не изменялась. Фактическое переключение рабочих маршрутов на structured sources выполняется отдельно на этапах 8–9 после проверки shadow-слоя.

### Generated docs и shadow context bundles

`docs/generated/` содержит удобные для чтения справочники компонентов, типографики, ассетов и нейминга. Они автоматически строятся из структурированных данных в `data/` и связанных schemas, поэтому не являются самостоятельным источником правил.

Ручное изменение generated-файла будет отклонено общей проверкой. Используются следующие команды:

- `npm run generate` — пересобрать все generated docs после подтверждённого изменения structured data;
- `npm run generate:check` — ничего не менять и проверить, что сохранённые файлы совпадают с текущими данными;
- `npm run bundle -- --route <route>` — временно собрать минимальный контекст для конкретного маршрута и вывести его в stdout;
- `npm run validate` — проверить foundations, component contracts, generated docs и собираемость route bundles одной командой.

Все применимые тесты и проверки выполняются локально на временном изолированном снимке точного коммита облачной ветки с Node.js 24; этот снимок не является рабочей копией для правок. Для изменений кода запускаются `npm run validate` и `npm test`, а Windows-специфичные проверки — локально в Windows. GitHub Actions и PR Checks не запускаются и не используются как критерий готовности или условие слияния. Упоминания Actions в старых планах и спецификациях описывают прошлый процесс, а не действующее правило.

Context bundle не сохраняется в репозитории: он собирается под конкретную задачу из выбранных active-компонентов, нужных viewport-контрактов, связанных foundations и статических источников маршрута.

На этапе 7 этот механизм остаётся `shadow`: он проверяет новую архитектуру, но не переключает рабочие навыки и не заменяет источники, перечисленные ниже в режимах 1 и 2. Фактическое переключение выполняется только на этапах 8–9 отдельными изменениями.

## Восстановление контекста

После открытия этого репозитория достаточно сказать Codex:

- «Ознакомься с проектом» — только прочитать актуальный контекст и ничего не менять;
- «Восстанови рабочую среду проекта» — проверить и безопасно подключить зависимости по [bootstrap-протоколу](bootstrap/README.md).

В пустой задаче сначала укажи репозиторий: «Открой `flabenar-maker/e-mail` и восстанови рабочую среду проекта».

Первая фраза всегда означает read-only режим. Вторая разрешает только обратимые setup-действия из bootstrap-протокола; авторизацию GitHub и Figma подтверждает пользователь.

## Режим 1. Поддержка библиотеки

Используй этот режим для изменения общей инструкции, descriptions компонентов, реестра и самих компонентов Figma.

Перед началом задачи прочитай одним комплектом:

1. [общую инструкцию по вёрстке](core/email-figma-prompt.md);
2. [стандарт нейминга Figma-компонентов](core/figma-component-naming-standard.md);
3. [реестр descriptions компонентов](registry/email-component-descriptions-registry.md);
4. [реестр типографики](registry/email-typography-registry.md);
5. [чек-пойнт поддержки библиотеки](workflows/library-maintenance-checkpoint.md).

Чек-пойнт задаёт порядок работы и границы изменений. Общая инструкция содержит общие технические правила вёрстки, naming standard — универсальные правила имён и классификации Figma-объектов, реестр descriptions — актуальный фактический слепок состава и контрактов компонентов, реестр типографики — текущие текстовые стили, их параметры, семантику и компоненты-потребители, а spacing foundation — правила выбора точных отступов только при поддержке и разработке библиотеки.

## Режим 2. Вёрстка конкретного письма

Для этого режима используются:

1. [общая инструкция по вёрстке](core/email-figma-prompt.md);
2. [реестр descriptions компонентов](registry/email-component-descriptions-registry.md);
3. [реестр типографики](registry/email-typography-registry.md);
4. [чек-пойнт вёрстки письма](workflows/email-build-checkpoint.md);
5. локальная заполненная копия [шаблона brief](templates/email-project-brief.md) — вспомогательный, а не обязательный вход: используй её, если данных запроса недостаточно; при достаточных данных запроса brief не нужен.

Чек-пойнт задаёт последовательность работы. Общая инструкция и реестр задают технические правила и component contracts; не дублируй их содержание в workflow.

## Рабочие навыки Codex

`.agents/skills/` — каталог repo-scoped навыков, которые Codex автоматически обнаруживает при работе с этим репозиторием. Каждый его непосредственный подкаталог представляет отдельный навык.

Сейчас доступен [навык поддержки CUPIS email-системы](.agents/skills/maintaining-cupis-email-system/). Он используется для аудита и изменения инструкции, реестра, Figma-компонентов, maintenance workflow и структуры репозитория.

Навык вёрстки конкретных писем запланирован, но ещё не создан. До его появления режим вёрстки выполняется непосредственно по общей инструкции, реестру и чек-пойнту вёрстки письма.

Навыки являются маршрутизаторами процессов, а не источниками технических правил или component contracts. Каноническое содержание остаётся в `core/`, `registry/` и `workflows/`.

### Добавление нового навыка

Чтобы новый repo-scoped навык автоматически учитывался при восстановлении среды:

1. Добавь `.agents/skills/<name>/SKILL.md` с тем же `name` во frontmatter.
2. Добавь его `id` и `path` в секцию `skills.required` или `skills.optional` файла `system/manifest.yaml`.
3. Если навык должен быть виден пользователю как отдельный рабочий режим, добавь его назначение и ссылку в этот раздел README.

Если навыку нужен новый плагин, добавь ID плагина в `plugins.required` или `plugins.optional` того же manifest. Только ради добавления навыка не изменяй `bootstrap/verify.ps1`, bootstrap-протокол или `.gitattributes`: структурный валидатор читает список навыков из manifest, а правило `.agents/skills/**` уже применяется ко всему каталогу.

## Ответственность файлов

| Путь | Назначение |
|---|---|
| `system/manifest.yaml` | Единственная машинно-читаемая карта источников, маршрутов и зависимостей системы |
| `core/email-figma-prompt.md` | Единственный источник общих технических правил вёрстки |
| `core/figma-component-naming-standard.md` | Единственный источник общих правил нейминга и классификации Figma-объектов |
| `core/component-contract-standard.md` | Нормативные правила полного structured component contract и его полной registry-проекции |
| `core/figma-component-description-standard.md` | Нормативные правила компактной Figma Description-проекции; не является входом HTML-вёрстки |
| `registry/email-component-descriptions-registry.md` | Актуальный фактический слепок descriptions и состава компонентов |
| `data/components/shared.yaml` | Теневые машинно-проверяемые контракты общих компонентов, корневого шаблона и внутренних Figma-источников |
| `data/components/marketing.yaml` | Теневые машинно-проверяемые контракты маркетинговых компонентов |
| `data/components/service.yaml` | Теневые машинно-проверяемые контракты сервисных компонентов |
| `schemas/components.schema.json` | Единая строгая схема трёх component-реестров |
| `docs/generated/` | Автоматически собранные читаемые представления structured data; не является каноническим источником |
| `scripts/lib/content-digest.mjs` | Детерминированная сериализация и digest для generated outputs и context bundles |
| `scripts/lib/generated-docs.mjs` | Сборка generated-справочников и проверка их точного соответствия structured data |
| `scripts/generate-docs.mjs` | CLI для пересборки или read-only проверки `docs/generated/` |
| `scripts/figma/capture-contract-source.js` | Read-only профиль снятия фактических значений узла через Figma MCP |
| `scripts/lib/figma-contract-facts.mjs` | Двусторонняя проверка фактов Figma против точных component contract-полей |
| `scripts/audit-figma-contract-facts.mjs` | CLI запуска проверки по component ID и свежему Figma MCP-пакету |
| `scripts/lib/context-bundle.mjs` | Read-only сборка route-specific контекста, exact component selection и проверка dependency closure |
| `scripts/build-context-bundle.mjs` | CLI, выводящий временный context bundle в stdout без записи в репозиторий |
| `data/foundations/typography.yaml` | Валидируемый structured-пилот определений текстовых стилей; ещё не подключён к рабочим bundle profiles |
| `schemas/typography.schema.json` | Строгая машинная схема structured-пилота типографики |
| `data/foundations/spacing.yaml` | Машинно-проверяемое золотое правило отступов для maintenance и component onboarding; не является входом HTML-вёрстки |
| `data/foundations/assets.yaml` | Валидируемый shadow-источник общих asset/export definitions; конкретные component contracts остаются в реестре |
| `data/foundations/figma-naming.yaml` | Валидируемый shadow-источник универсальных определений нейминга Figma; не содержит конкретных компонентов или карт переименований |
| `schemas/figma-naming.schema.json` | Строгая машинная схема Figma naming foundation |
| `scripts/lib/figma-naming-foundation.mjs` | Загрузка и проверка shape и семантики Figma naming foundation |
| `scripts/lib/figma-name-generator.mjs` | Чистая генерация одного имени из явно подтверждённой семантики без записи в Figma |
| `scripts/lib/figma-name-validator.mjs` | Проверка одного явно переданного имени без сканирования библиотеки |
| `schemas/spacing.schema.json` | Строгая schema spacing foundation и exact-only разрешений |
| `scripts/lib/spacing-foundation.mjs` | Design-time validation и resolver, возвращающий одно точное значение либо typed blocker |
| `registry/email-typography-registry.md` | Контрольный Markdown-снимок типографики и текущий владелец списков компонентов-потребителей до cutover |
| `workflows/library-maintenance-checkpoint.md` | Процесс поддержки инструкции, реестра и Figma-библиотеки |
| `workflows/email-build-checkpoint.md` | Процесс вёрстки нового или изменения существующего письма |
| `templates/email-project-brief.md` | Шаблон входных данных, копируемый в локальную папку письма |
| `.agents/skills/` | Каталог автоматически обнаруживаемых repo-scoped навыков Codex |
| `.agents/skills/maintaining-cupis-email-system/` | Маршрутизация задач поддержки CUPIS email-системы к каноническим источникам и GitHub-процессу |
| `bootstrap/` | Переносимый протокол восстановления, безопасные рекомендации и read-only проверка |

## Правила хранения

- Не дублируй общую инструкцию, naming standard или реестры внутри workflow-файлов.
- Не переноси технические правила, naming-константы, descriptions или значения библиотеки в навыки.
- Не дублируй в naming standard перечень существующих компонентов, IDs, descriptions, геометрию или компонентные исключения.
- Новые и явно переименовываемые Figma-объекты проверяй по naming standard; существующую библиотеку не мигрируй без отдельной команды.
- Изменяй навык только при изменении его области запуска, расположения канонических источников, границ маршрутизации, модели публикации через GitHub или границы локальной проверки.
- После изменения description компонента в Figma обновляй соответствующую запись реестра в той же задаче.
- После изменения текстового стиля или его использования в компонентах обновляй реестр типографики в той же задаче.
- Изменяй workflow только тогда, когда меняется последовательность работы или её проверки.
- Не добавляй в репозиторий локальные проекты писем и сгенерированные результаты.
- Не создавай архивные копии документов: историю изменений хранит Git.
