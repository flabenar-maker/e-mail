# CUPIS Active Work Context

Статус документа: ручной checkpoint для восстановления контекста.

Последнее ручное обновление: 2026-09-14.

Снимок main на момент обновления: d9f866be17664fce5a6da223144c2b1939a5c9b0 (после PR #69–70; восстановление generated registry ведётся в отдельном PR).

## 1. Зачем нужен этот файл

Этот файл помогает восстановить смысл, ограничения и текущее состояние длительной работы над CUPIS email-системой в новом чате или на другом компьютере.

Он отвечает на четыре вопроса:

1. что мы строим и зачем;
2. какие решения уже приняты;
3. на каком этапе остановились;
4. что разрешено делать дальше.

Это навигационный и контекстный checkpoint, а не новый источник технических правил.

## 2. Политика обновления

Этот файл:

- обновляется только по прямой команде пользователя;
- никогда не обновляется автоматически после commit, PR, merge или Figma-изменения;
- не используется как единственное доказательство актуального статуса;
- не переопределяет более свежие канонические источники;
- не должен разрастаться копиями точных правил из Core, foundations, registry или workflows.

Если пользователь не попросил обновить checkpoint, изменение других файлов системы не разрешает менять этот файл.

## 3. Иерархия источников

При конфликте действует не «последний прочитанный текст», а ответственность файлов:

1. `system/manifest.yaml` — существующие источники, routes, bundles, skills и plugins;
2. master-спецификация — целевая архитектура и системные решения;
3. migration roadmap — последовательность и подтверждённый статус этапов;
4. implementation plan текущего этапа — точный порядок его реализации;
5. Core, foundations, registry и workflows — правила и факты своих доменов;
6. этот checkpoint — объяснение контекста и маршрут чтения.

Более свежий `main` всегда важнее SHA и состояния, записанных в этом checkpoint. Если найдено расхождение, сначала остановиться и сообщить о нём, затем опираться на актуальные канонические файлы. Нельзя незаметно «исправлять» систему по памяти этого документа.

## 4. Что представляет собой проект

Репозиторий `flabenar-maker/e-mail` хранит систему разработки и поддержки CUPIS email-библиотеки:

- общие стандарты;
- структурированные foundations;
- component contracts и реестры;
- workflows;
- repo-scoped skills;
- schemas, validators и characterization tests;
- планы миграции.

Финальные письма в репозитории не хранятся. `email.html`, `images/`, версии конкретного письма, тестовые экспорты и локальные результаты остаются в отдельной рабочей папке письма.

Основная цель текущей миграции — перейти от большого набора пересекающихся языковых инструкций к системе, где:

- у каждого факта один владелец;
- точные определения машинно проверяются;
- для каждой задачи собирается минимальный применимый контекст;
- Codex не получает одновременно старые и новые дубли правил;
- новый компонент можно добавить без перестройки всей архитектуры;
- Figma и GitHub синхронизируются контролируемо;
- вёрстка конкретного письма использует готовые component contracts и фактические значения.

## 5. Почему система меняется поэтапно

Прежние Markdown-источники временно сохранены в `Legacy/` только как read-only baseline. Все маршруты указывают на `workflow-paused`; structured-файлы и generated bundles ещё не переключены в production. Архивирование не означает, что сравнение или миграция завершены.

Это предотвращает две ошибки:

- внезапную потерю уже согласованных правил;
- одновременное применение двух версий одного правила.

Каждый технический этап выполняется в собственной GitHub branch и PR. Следующий этап начинается после проверки предыдущего. Merge всегда требует отдельного разрешения пользователя.

## 6. Уже подтверждённое состояние

На снимке main@d9f866be17664fce5a6da223144c2b1939a5c9b0 этапы 1–7 исторически реализованы, но PR #69 ошибочно перенёс полный generated component registry вместе со старым контуром в `Legacy/`; PR #70 восстановил согласованность тестов с временной изоляцией. Текущий PR возвращает производный реестр и его blocking-проверки. Все routes пока остановлены.

В этапе 8 слиты пакеты 1–9 через PR #50–58. Созданы rendering foundation, разделённые Core-стандарты, пилотный renderer registry, HTML-примитивы, contract-tree interpreter, модель письма, CLI с атомарным выводом, render-impact diagnostics и автоматические HTML-инварианты. PR #59 скорректировал пилотные Mobile/Desktop layout contracts. Техническое ядро существует, но ещё не покрывает всю библиотеку и не является готовым процессом сборки произвольного production-письма.

После неубедительного пилотного результата проведена прямая Figma-сверка фактов компонентов: маркетинговые и сервисные контракты и механизм проверки уточнены в слитых PR #61–64. Эти изменения не заменяют Mobile/Desktop visual scenarios и расширение renderer coverage. На данном снимке registry содержит шесть пилотных записей, включая Email/Footer, но без Email/Header.

## 7. Текущий этап и исследовательское ответвление

Этап 8 остаётся в работе. PR #66 исправил оболочку пилота и границу Mobile/Desktop, а PR #67–68 перевели проверки на локальный режим без GitHub Actions. Пакеты 10–12 не завершены: visual scenarios и проверка фактического HTML обновлённого пилота, coverage остальных активных компонентов, structured workflows и shadow comparison. Не отмечать этап 8 завершённым только по факту наличия CLI или автоматических тестов.

[PR #60](https://github.com/flabenar-maker/e-mail/pull/60) открыт отдельно как read-only исследование Good Email Code, Email Guidelines, Cerberus и Can I Email. Изучение источников проведено 14.09.2026; проверка отправленного письма в мобильных приложениях Яндекс Почты, Mail.ru и Gmail и обсуждение выводов ещё не выполнены. PR #60 содержит только исследовательский документ, не содержит viewport preview и не разрешает менять текущие контракты, Core или renderer.

Целевая аудитория в основном использует эти мобильные приложения. Данных по версиям приложений и распределению iOS/Android пока нет. Preheader можно настраивать вручную в Altcraft; его обработка text/plain пока не выяснена и не блокирует текущую HTML-работу.

## 8. Следующий точный шаг

1. После восстановления полного generated registry и его локальных проверок проверить read-only выходной HTML, который фактически создаёт текущий пилотный renderer, и классифицировать расхождения: входная модель, точный contract, renderer code или только браузерный preview. Не объявлять гипотезу о поведении без style подтверждённой ошибкой без воспроизведения.
2. Сопоставить подтверждённые наблюдения с исследованием PR #60. Не менять правила и контракты автоматически по внешнему примеру.
3. После обсуждения продолжить пакет 10 с Mobile/Desktop visual scenarios; явно учесть, что Email/Header ещё не входит в pilot coverage, хотя его тестирование вместе с Email/Footer ранее запрошено.
4. Затем выполнить пакеты 11–12 и финальную проверку этапа 8. Maintenance skill cutover и следующие этапы начинаются только после завершения этапа 8.

## 9. Стабильная граница component documentation

- `data/components/*.yaml` владеют component-specific implementation facts.
- Полный Markdown component registry является generated human-readable projection.
- Figma Description содержит только `CUPIS ID`, `PURPOSE`, derived `RENDER` и optional `CRITICAL`.
- PURPOSE и critical constraints принадлежат structured record, а не Figma.
- Полная prose-копия contracts внутри component record запрещена.
- Mobile и Desktop остаются независимыми законченными contracts.
- Email-build bundle получает selected resolved contracts и не получает component-authoring standards или Figma Description.
- Figma Description может быть синхронизирован только после GitHub data validation и отдельного Figma mutation gate.
- Figma sync изменяет только явно разрешённые metadata fields и заканчивается MCP readback.
- Старый рукописный Markdown registry находится в `Legacy/` только для read-only сравнения; полный `docs/generated/component-registry.md` остаётся постоянной производной проекцией structured contracts.

## 10. Карта этапов миграции

| Этап | Содержание | Статус на 2026-09-14 |
|---:|---|---|
| 1–7 | Архитектура, foundations, component registry, документация и bundles | Исторически реализованы; полный generated registry восстанавливается после регрессии PR #69 |
| 8 | Core, workflows и HTML rendering | В работе: пакеты 1–9, Figma-сверка PR #61–64 и pilot fix PR #66 слиты; пакеты 10–12 открыты; routes остановлены |
| 9 | Maintenance skill cutover | Ожидает завершения этапа 8 |
| 10–11 | Стандарт, workflow и навык разработки новых блоков | Ожидают этап 9 |
| 12 | Навык HTML-вёрстки конкретных писем | Ожидает этапы 10–11 |
| 13 | Shadow comparison | Ожидает готовности маршрутов; сравнение только с read-only `Legacy/` |
| 14 | Общий cutover | Ожидает shadow comparison; paused routes переключаются прямо на structured |
| 15 | Ревизия `Legacy/` и migration-артефактов | Только после стабильного cutover; решение `remove`/`preserve` по каждому файлу |

Статус всегда перепроверяется по свежему main, roadmap, implementation plan и merged PR. Эта таблица — снимок на дату ручного обновления, а не автоматический трекер.

## 11. Стабильные рабочие решения

### GitHub

- Постоянные системные файлы меняются только в облачном GitHub.
- Локальный checkout репозитория не используется как источник.
- Каждая запись начинается от зафиксированного SHA `main`.
- Изменения идут через `codex/<semantic-slug>`, commit и draft PR.
- До записи объявляется разрешённая область изменений и сохраняемые области.
- После записи проверяются branch, allowed diff и применимые локальные тесты на временном изолированном снимке точного SHA; GitHub Actions и PR Checks не используются.
- Merge выполняется только после отдельной команды пользователя.
- Историю и rollback обеспечивает Git; `Legacy/` — явно согласованный временный архив PR #69, дополнительные произвольные копии не создаются.

### Figma

- Figma читается и изменяется только через Figma MCP.
- Перед любой записью выполняется read-only impact report:
  - что изменится;
  - какие nodes/variants затрагиваются;
  - какие поля разрешены к записи;
  - что должно сохраниться;
  - какие GitHub-файлы зависят от изменения;
  - как будет проверен результат.
- Первоначальная просьба изменить компонент не отменяет отдельную паузу после impact report.
- Description-only изменение не разрешает менять структуру, свойства, геометрию или дизайн.
- Rename не разрешает Component ↔ Frame conversion, reparenting, Slot/property changes или другие структурные операции.
- После записи выполняется отдельный MCP readback.
- При неожиданном diff работа останавливается; область исправления не расширяется автоматически.

### Component descriptions и registry

- Полное точное описание реализации хранится в structured component contract и показывается в generated registry.
- Figma Description является короткой generated-проекцией, а не вторым источником и не инструкцией HTML-build.
- Общие правила письма, typography, spacing, assets и naming не копируются в component records.
- Component record хранит purpose, independent Mobile/Desktop contracts, properties, assets, dependencies и component-specific constraints.
- Email template/root shell является корневой оболочкой письма, а не обычным content component; его contract всё равно описывает assembly semantics.
- Новый незарегистрированный component сначала проходит анализ и onboarding; визуальное сходство не делает его автоматически допустимым.
- Изменение contract сначала проходит GitHub validation/generated preview; Figma Description меняется только отдельной разрешённой MCP-only операцией.

### HTML-вёрстка

- Готовые письма остаются локальными и версионируются отдельными папками.
- Для изменения готового письма создаётся новая версия, исходная папка не перезаписывается.
- Вёрстка опирается на фактический Mobile/Desktop-инстанс и component contract.
- Design-time золотые правила библиотеки не используются как свобода выбора значений в HTML.
- Если запрос точный и не конфликтует с источниками, лишнее уточнение не требуется.
- Ссылки обычно позднее заменяются маркетологом в Altcraft, но структура и безопасные значения должны оставаться корректными.

### Assets

Assets foundation существует как валидируемый structured-источник и объявлен в manifest. Старый Core prompt находится в `Legacy/` только для сравнения; production-маршруты остановлены, а пилотный renderer читает structured foundations и component contracts. Стабильные решения, которые нельзя потерять:

- `@2x` и `@4x` сохраняются в имени asset owner;
- один визуальный asset использует общий файл для Mobile и Desktop;
- `@2x` использует JPEG contract и сохраняет intrinsic proportions;
- адаптивное изменение ширины не допускает независимой фиксированной высоты;
- `@4x` использует PNG и установленный transparency/background contract;
- искусственная подложка не добавляется;
- source mode и display mode — разные решения;
- конкретная export boundary принадлежит component contract;
- export из Figma выполняется только через MCP;
- placeholder или main component не подменяют конкретный инстанс письма.

Этот список — страховочная карта миграции. Точные исполняемые формулировки всегда берутся из актуальных канонических источников.

### Figma naming

Figma naming foundation является structured shadow-источником; прежний naming standard сохранён в `Legacy/` как read-only baseline, но не подключён к остановленным маршрутам. Нельзя потерять следующие решения:

- definitions, generator и validator остаются отдельными модулями;
- непонятная семантика блокирует рекомендацию, а не запускает угадывание;
- validator работает только с явно заданным candidate;
- генерация имени не означает разрешение переименовать объект;
- обычное переименование сохраняет текущий `@2x` или `@4x`;
- конкретные компоненты и карты миграции не переносятся в общий foundation;
- Figma write требует impact report, отдельного разрешения и readback.

## 12. Пользовательские требования к процессу

При продолжении этой работы:

- объяснять технические решения простым языком: что делаем, зачем и на что это влияет;
- после каждого крупного этапа давать очень короткое напоминание о следующем шаге;
- не менять дополнительные компоненты или файлы «заодно»;
- перед изменением компонента, Description или системного правила сначала сообщать последствия;
- если найдено новое расхождение, сначала анализировать его, а не автоматически исправлять;
- не проводить повторный полный Figma-аудит, когда достаточно точечной проверки;
- не заходить в локальные письма в maintenance-задаче;
- не сливать старые или уже неактуальные изменения;
- не обновлять этот checkpoint без прямой просьбы.

## 13. Протокол восстановления контекста в новом чате

Использовать такой порядок:

1. открыть репозиторий `flabenar-maker/e-mail`;
2. закрепить текущий SHA `main`;
3. прочитать этот checkpoint как навигацию, не как окончательный статус;
4. прочитать `system/manifest.yaml` на закреплённом SHA;
5. выбрать route `migration-progress`;
6. разрешить его profile и sources через manifest;
7. прочитать README, migration roadmap и maintenance checkpoint на том же SHA;
8. заново получить список `docs/superpowers/plans/`;
9. сравнить roadmap с реально присутствующими merged-артефактами;
10. открыть implementation plan фактически текущего этапа; если его ещё нет, следующим действием считать создание и review плана, а не реализацию;
11. проверить открытые или недавно слитые PR, если они влияют на статус;
12. только после этого предлагать или выполнять следующий шаг.

Если checkpoint и актуальный `main` расходятся, явно назвать расхождение пользователю. Не обновлять checkpoint без команды и не продолжать по устаревшему пути.

## 14. Stop conditions

Остановиться и запросить решение пользователя, если:

- непонятно, поддерживаем существующую систему или меняем её архитектуру;
- запрос конфликтует с roadmap, master-spec или current plan;
- требуется расширить заявленный список файлов или Figma-полей;
- появляется новая универсальная возможность, которую текущая schema не выражает;
- Figma readback показывает неожиданные изменения;
- branch больше не основана на ожидаемом `main`;
- источник отсутствует в manifest;
- изменение требует merge или Figma mutation без отдельного разрешения;
- новый компонент требует component-specific исключения в общей schema.

## 15. Быстрый запрос для нового чата

Пользователь может написать:

> Открой `flabenar-maker/e-mail`. Восстанови контекст по `docs/superpowers/plans/cupis-active-work-context.md`, но обязательно перепроверь его по актуальному `main`, manifest, migration roadmap и папке plans. Ничего не меняй до определения текущего этапа и разрешённой области работы.

После такой команды сначала выполняется read-only восстановление. Она не разрешает GitHub merge, Figma mutation или изменение локального письма.

## 16. Ключевые ссылки

- [README](../../../README.md)
- [System manifest](../../../system/manifest.yaml)
- [Master-spec](../specs/2026-08-24-cupis-structured-email-system-design.md)
- [Migration roadmap](2026-08-25-cupis-migration-roadmap.md)
- [Structured component registry plan](2026-09-05-cupis-structured-component-registry.md)
- [Structured component registry PR #40](https://github.com/flabenar-maker/e-mail/pull/40)
- [Component documentation contracts plan](2026-09-07-cupis-component-documentation-contracts.md)
- [Component documentation plan PR #44](https://github.com/flabenar-maker/e-mail/pull/44)
- [Component documentation implementation PR #45](https://github.com/flabenar-maker/e-mail/pull/45)
- [Generated docs and context bundles plan](2026-09-07-cupis-generated-docs-context-bundles.md)
- [Generated docs and context bundles PR #43](https://github.com/flabenar-maker/e-mail/pull/43)
- [Stage 8 implementation plan](2026-09-10-cupis-html-rendering-stage-8.md)
- [Figma-grounded rendering contracts PR #64](https://github.com/flabenar-maker/e-mail/pull/64)
- [Read-only email practices research PR #60](https://github.com/flabenar-maker/e-mail/pull/60)
- [Assets foundation](../../../data/foundations/assets.yaml)
- [Figma naming foundation](../../../data/foundations/figma-naming.yaml)
- [Archived library maintenance checkpoint](../../../Legacy/workflows/library-maintenance-checkpoint.md)
- [Archived Core email/Figma prompt](../../../Legacy/core/email-figma-prompt.md)
- [Generated component registry](../../../docs/generated/component-registry.md)
