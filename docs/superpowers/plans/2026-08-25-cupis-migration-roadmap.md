# CUPIS Structured System Migration Roadmap

Актуальность: 2026-09-14.

## Назначение

Этот файл — единый источник порядка и статуса этапов перехода CUPIS email-системы. Он не заменяет [master-спецификацию](../specs/2026-08-24-cupis-structured-email-system-design.md) и не дублирует подробные implementation plans отдельных этапов.

Master-спецификация владеет архитектурными решениями. Roadmap показывает только последовательность, зависимости и текущий статус. Перед началом каждого технического этапа создаётся отдельный implementation plan с точными файлами, проверками и commits.

## Статусы

- `[x]` — этап завершён и находится в `main`;
- `[ ]` — этап ещё не начат;
- один технический этап выполняется в отдельной branch и PR;
- следующий этап начинается после проверки и слияния предыдущего;
- если этап требует нового архитектурного решения, сначала обновляется master-спецификация.

## Обязательная сверка прогресса

Перед любым ответом о текущем этапе, завершённой работе или следующем шаге:

1. закрепить актуальный SHA ветки `main`;
2. повторно открыть этот roadmap из `docs/superpowers/plans/`;
3. проверить состав папки `docs/superpowers/plans/` и наличие связанного implementation plan текущего этапа;
4. сверить отмеченный статус с фактически слитыми в `main` артефактами;
5. не восстанавливать статус только по памяти чата.

Исторические пункты завершённых этапов описывают состояние на момент их реализации. После [PR #69](https://github.com/flabenar-maker/e-mail/pull/69) старый контур находится в `Legacy/`, все маршруты временно указывают на `workflow-paused`, а [PR #70](https://github.com/flabenar-maker/e-mail/pull/70) привёл тесты к этой изоляции. Это не cutover и не завершение миграции. Старые формулировки «действующий Markdown-источник» в завершённых этапах не описывают текущий рабочий путь. После слияния в roadmap добавляются фактическая ссылка на implementation plan или PR и новый статус. Если подробный plan ещё не создан, следующим действием является его создание и review, а не начало реализации.

Для восстановления расширенного контекста в новом чате используй [ручной checkpoint текущей работы](cupis-active-work-context.md). Он является навигацией, не владельцем статуса, и обновляется только по прямой команде пользователя; его сведения всегда перепроверяются по актуальному `main`, manifest, этому roadmap и папке plans.

## Последовательность

### 1. Master-спецификация и первый implementation plan

- [x] Зафиксировать целевую архитектуру, ответственность источников и порядок миграции.
- [x] Подготовить первый технический план foundation-этапа.

Результаты:

- [master-спецификация](../specs/2026-08-24-cupis-structured-email-system-design.md);
- [foundation implementation plan](2026-08-24-cupis-structured-system-foundation.md).

### 2. Системный foundation

- [x] Ввести `system/manifest.yaml`, строгую schema, validation CLI и bootstrap cutover.
- [x] Подключить CI и characterization-защиту области миграции.
- [x] Сделать manifest единственной машинно-читаемой картой источников, routes, bundles, skills и plugins.

### 3. Typography foundation pilot

- [x] Создать и проверить shadow-источник типографики.
- [x] Сохранить Markdown-реестр текущим рабочим источником до общего cutover.

Подробный план: [typography foundation pilot](2026-08-25-cupis-typography-foundation-pilot.md).

### 4. Spacing foundation

- [x] Зафиксировать золотое правило отступов только для поддержки и разработки библиотеки.
- [x] Добавить exact-only resolver и проверки.
- [x] Не подключать spacing foundation к HTML-вёрстке конкретного письма.

Подробный план: [spacing foundation](2026-08-25-cupis-spacing-foundation.md).

### 5. Остальные foundations — завершён

Этап выполняется двумя последовательными подэтапами. Каждый подэтап получает отдельный implementation plan, branch и PR. Подэтап 5Б начинается только после слияния 5А.

#### 5А. Assets foundation — завершён

- [x] Создать и согласовать подробный implementation plan assets foundation.
- [x] Зафиксировать действующие asset/export rules из `core/email-figma-prompt.md` и component contracts как comparison baseline; не удалять старый активный источник до общего cutover.
- [x] Перенести общую структурированную модель в `data/foundations/assets.yaml`: source mode, export boundary, display mode, scale, format, alpha, Fill/background policy, crop, proportions и presentation-only clipping.
- [x] Создать `schemas/assets.schema.json`, semantic validation и characterization-проверки эквивалентности baseline.
- [x] Объявить assets foundation и schema в manifest как shadow-источники. Не подключать foundation параллельно к действующим email-build bundles до этапа generated context bundles.
- [x] Сохранить конкретные владельцы, границы экспорта, display-размеры и компонентные исключения в component contracts; не переносить их в общий foundation.
- [x] Не менять Figma-дизайн, descriptions, конкретные письма или готовые assets в рамках технической миграции foundation.

Уточнение export contract, слитое в PR #28, является актуальным baseline для этого подэтапа, а не окончательным местом хранения правил.

Подробный план: [assets foundation](2026-08-26-cupis-assets-foundation.md). Реализация слита в [PR #33](https://github.com/flabenar-maker/e-mail/pull/33), итоговый commit: `fe1a0e37b4d40533706c88d73f5c293c8860b3ee`.

#### 5Б. Figma naming foundation — завершён

- [x] Согласовать архитектурное уточнение master-спецификации: naming definitions, generator и validator являются отдельными модулями, а maintenance skill только оркестрирует безопасный процесс.
- [x] Создать и согласовать отдельный implementation plan figma-naming foundation.
- [x] Перенести универсальные naming definitions в `data/foundations/figma-naming.yaml` без миграции существующей библиотеки.
- [x] Создать schema, semantic validation, characterization и manifest references.
- [x] Создать чистый детерминированный generator рекомендаций, который использует только foundation и явно подтверждённую семантику; при неоднозначности возвращает `semantic-role-required`, не угадывает функцию объекта и не пишет в Figma.
- [x] Отделить validator существующих и предлагаемых имён от generator: validator проверяет только явно заданную область, а не запускает полный аудит библиотеки при каждой maintenance-задаче.
- [x] Сохранить `@2x` и `@4x` обязательной частью имени asset owner; не смешивать naming definitions с конкретными component records.
- [x] Зафиксировать будущую оркестрацию maintenance skill: локальное обнаружение непонятного имени → уточнение функции → рекомендация `old → new` → impact report → отдельное разрешение → Figma write → read-back и dependency checks.
- [x] Не менять Figma, component contracts, действующий naming standard или рабочие bundle profiles в технической реализации foundation.
- [x] Завершить общий этап 5 только после слияния обоих подэтапов и проверки отсутствия изменений Figma и component contracts.


Подробный план: [Figma naming foundation](2026-08-27-cupis-figma-naming-foundation.md). Реализация слита в [PR #37](https://github.com/flabenar-maker/e-mail/pull/37), итоговый commit: `edacb9376c66fe850a9418e57fe6e311b49bc00c`.

Общий этап 5 завершён: assets foundation и Figma naming foundation находятся в `main`; технические реализации не изменяли Figma и component contracts.

### 6. Структурированный component registry — завершён

- [x] Определить schema общего, маркетингового и сервисного реестров компонентов.
- [x] Перенести фактические component contracts без изменения их смысла.
- [x] Сохранить Figma provenance, variants, properties и ссылки на foundations.
- [x] Добавить unregistered-component blocker и проверки синхронизации.

Подробный план: [structured component registry](2026-09-05-cupis-structured-component-registry.md). Реализация слита в [PR #40](https://github.com/flabenar-maker/e-mail/pull/40), итоговый commit: `90f1e01365c80b7553b520e8d47c2e5bb7f88660`.

Structured records остаются shadow-источником до generated bundles и общего cutover. Figma и действующие рабочие bundle profiles этим этапом не изменялись.

### 7. Generated docs и context bundles — завершён

Подробный план: [generated docs и context bundles](2026-09-07-cupis-generated-docs-context-bundles.md).

До завершения generated layer был выполнен обязательный архитектурный prerequisite: [component documentation contracts](2026-09-07-cupis-component-documentation-contracts.md). Он не дал закрепить старую модель с повторением component facts в сохранённом prose Description.

#### 7A. Component documentation contracts — завершён

- [x] Зафиксировать `core/component-contract-standard.md` и `core/figma-component-description-standard.md`.
- [x] Заменить полный `description.blocks` типизированными purpose и component-specific constraints.
- [x] Сохранить независимые Mobile/Desktop contracts, properties, assets, provenance и fingerprints.
- [x] Создать полный registry renderer и отдельный compact Figma Description renderer.
- [x] Доказать semantic equivalence со старым registry без Figma mutation.
- [x] Объявить standards и validation в shadow-режиме.

Подробный план: [component documentation contracts](2026-09-07-cupis-component-documentation-contracts.md). Реализация слита в [PR #45](https://github.com/flabenar-maker/e-mail/pull/45), итоговый commit: `0eb8cfd4d2ff3401a6a7e91a80e8740435f7ab0e`. Figma, рабочие routes, workflows, skills и legacy registry этим подэтапом не изменялись.

#### 7B. Generated docs и route-specific context bundles — завершён

- [x] Обновить основание реализации после merge 7A и повторно проверить ранее выполненную часть.
- [x] Генерировать читаемые реестры и справочники из структурированных источников.
- [x] Полный component registry строить из contract tree, properties, assets, constraints и resolved foundation references.
- [x] Compact Figma Description показывать только как auxiliary projection, не как implementation source.
- [x] Формировать route-specific bundles без лишнего контекста.
- [x] Email routes снабжать selected resolved component contracts, но не authoring standards или Figma Description.
- [x] Проверять, что каждый bundle содержит только применимые rules, contracts и workflows.
- [x] Сохранить весь этап shadow до отдельного cutover.

Реализация этапа 7B слита в [PR #43](https://github.com/flabenar-maker/e-mail/pull/43), итоговый commit: `15a1c3ce09fec33d5aee82a87ffee4667e911702`. Generated docs и route-specific context bundles были реализованы как shadow-слой. После PR #69 полный `docs/generated/component-registry.md` ошибочно оказался в `Legacy/` вместе со старым контуром; его renderer и структурированные входы остались. Восстановление файла, регистрации в manifest и blocking-проверок не создаёт второго источника component facts и не переключает остановленные маршруты.

### 8. Core, workflows и HTML rendering cutover — в работе

Архитектурное основание: [CUPIS HTML Rendering Design](../specs/2026-09-10-cupis-html-rendering-design.md).

Подробный implementation plan: [CUPIS HTML Rendering Stage 8](2026-09-10-cupis-html-rendering-stage-8.md).

Фактический статус на 2026-09-14: пакеты 1–9 слиты в main через PR #50–58; [PR #59](https://github.com/flabenar-maker/e-mail/pull/59) исправил пилотные Mobile/Desktop layout contracts. Реализованы rendering foundation, реестр шести пилотных renderer coverage, разделённый Core, email-примитивы, contract-tree interpreter, пилот, временная модель, CLI с атомарным выводом, render-impact diagnostics и автоматические HTML-инварианты. Наличие этого кода не означает готовности сборки произвольного production-письма.

После неудачной попытки получить убедительный пилотный результат обнаружилась недостаточная точность части мигрированных component contracts. [PR #61](https://github.com/flabenar-maker/e-mail/pull/61), [#62](https://github.com/flabenar-maker/e-mail/pull/62), [#63](https://github.com/flabenar-maker/e-mail/pull/63) и [#64](https://github.com/flabenar-maker/e-mail/pull/64) выполнили прямую сверку с Figma, добавили проверку фактических данных и уточнили маркетинговые и сервисные контракты. Это корректирующая работа внутри этапа 8, а не завершение пакетов 10–12.

[PR #60](https://github.com/flabenar-maker/e-mail/pull/60) остаётся открытым исследовательским черновиком: в нём только план и результаты изучения внешних email-практик. Он не содержит реализацию viewport preview, не меняет действующие контракты и не закрывает пакет 10. Изучение источников выполнено; проверка готового письма в целевых мобильных почтовых приложениях и обсуждение выводов ещё впереди.

- [x] Зафиксировать characterization baseline и владельцев renderer-impacting данных — PR #50.
- [x] Создать rendering foundation и renderer-ready schema без дублирования существующих foundations и contracts — PR #51–52.
- [x] Нормализовать пилотные component contracts и сверить значимые факты с Figma — PR #52 и #61–64.
- [x] Разделить Core на четыре тематических стандарта — PR #53.
- [x] Реализовать email-примитивы, общий contract-tree interpreter и пилотный renderer registry — PR #54–55.
- [x] Добавить временную модель, CLI, типизированную диагностику и атомарную публикацию email.html + images/ — PR #56–57.
- [x] Вычислять render-impact digest автоматически только из данных, влияющих на HTML — PR #57.
- [x] Добавить автоматические HTML и property checks — PR #58.
- [ ] Проверить фактический HTML обновлённого пилота и выполнить representative Mobile/Desktop visual scenarios; тестовое покрытие Email/Header ещё отсутствует.
- [ ] Мигрировать renderer coverage остальных активных компонентов после успешного пилота.
- [ ] Перевести maintenance и email-build workflows в структурированный формат и выполнить shadow comparison без двойного контекста.
- [ ] Подтвердить, что HTML зависит от фактического инстанса и component contract, а не design-time золотых правил.
- [ ] Не подавать legacy и structured наборы правил одновременно в рабочий bundle.
- [ ] Завершить все проверки этапа 8 и только после этого отметить этап завершённым.

[PR #66](https://github.com/flabenar-maker/e-mail/pull/66) исправил оболочку пилотного письма и границу Mobile/Desktop. [PR #67–68](https://github.com/flabenar-maker/e-mail/pull/67) закрепили локальные проверки без GitHub Actions; [PR #69–70](https://github.com/flabenar-maker/e-mail/pull/69) изолировали Legacy и адаптировали тесты. Маршруты сейчас остановлены; восстановление полного generated component registry не означает завершения пакетов 10–12 или возобновления production-сборки.

### 9. Maintenance skill cutover

Manifest-driven разрешение source paths было выполнено на этапе 2. Этот этап не повторяет первоначальный переход на manifest: он переключает навык с временных Markdown-oriented profiles на итоговые generated context bundles.

- [ ] Перевести `maintaining-cupis-email-system` на итоговые route-specific context bundles.
- [ ] Сохранить навык тонким маршрутизатором без копий правил и жёсткого списка путей.
- [ ] Сохранить отдельный `migration-progress` route, требующий свежей сверки с roadmap перед ответом о статусе или следующих шагах.
- [ ] Проверить mutation impact gate, cloud-only GitHub flow и Figma mutation gate.

### 10. Стандарт и workflow разработки новых блоков

Этот этап выполняется после остальных foundations, component registry, generated bundles, Core/workflows и maintenance skill, но до создания навыка HTML-вёрстки.

- [ ] Обновить master-спецификацию и зафиксировать отдельный route разработки новых email-блоков.
- [ ] Создать отдельный стандарт проектирования email-компонентов; не добавлять эти design-time правила в HTML-rendering instruction.
- [ ] Зафиксировать в стандарте иерархию CTA, допустимое размещение `Button/Primary`, непрерывность линии чтения, роль изображения, Mobile/Desktop reading order и недопустимые композиционные разрывы.
- [ ] Создать отдельный component-development workflow: brief → анализ библиотеки → композиционная схема → wireframe → согласование → детальный дизайн → визуальная проверка → возможная productionization.
- [ ] Требовать промежуточное согласование wireframe для нового блока без готового референсного макета.
- [ ] Оставлять прототип example/frame без Component и Description, пока пользователь отдельно не разрешит productionization.
- [ ] Добавить route и bundle в manifest, не подключая design-time standard к `email-new-build` и `email-continue-fix`.

### 11. Навык разработки новых блоков

- [ ] Создать repo-scoped skill `developing-cupis-email-components`.
- [ ] Использовать skill только как маршрутизатор к component-development route, standard и workflow.
- [ ] Не дублировать в skill CTA rules, композиционные правила, naming constants, spacing values или component contracts.
- [ ] Разделить ответственность:
  - новый skill — проектирование и проверка новых прототипов;
  - component onboarding — регистрация уже одобренного компонента;
  - maintenance skill — поддержка существующей production-библиотеки.
- [ ] Проверить безопасный переход от одобренного прототипа к отдельной productionization-задаче.

### 12. Навык HTML-вёрстки конкретных писем

Этот этап начинается только после завершения этапов 10–11.

- [ ] Создать repo-scoped skill вёрстки конкретных CUPIS-писем.
- [ ] Подключить только `email-new-build` и `email-continue-fix` bundles.
- [ ] Не загружать в этот skill стандарт проектирования новых блоков и component-development workflow.
- [ ] Собирать HTML по готовым Mobile/Desktop-инстансам, resolved component contracts и фактическим значениям.
- [ ] Проверить создание нового письма, версионное изменение готового письма и границы локальной рабочей папки.

### 13. Shadow comparison

- [ ] Сравнить structured outputs и context bundles с сохранёнными read-only источниками в `Legacy/`; не подключать архив к действующим маршрутам и не считать перенос доказательством equivalence.
- [ ] Устранить semantic drift до cutover.
- [ ] Подтвердить, что маршруты maintenance, component development и email build получают разные минимальные наборы контекста.

### 14. Cutover

- [ ] Переключить временно остановленные маршруты `workflow-paused` на проверенные структурированные источники и generated bundles. Не возвращать `Legacy/` как промежуточный рабочий путь.
- [ ] Перевести foundations, прошедшие shadow comparison, из временного `shadow`-режима в итоговый рабочий статус.
- [ ] Подтвердить validation, bootstrap, skills и GitHub/Figma workflows.
- [ ] Зафиксировать rollback point и полный список временных migration/shadow-артефактов перед очисткой.

### 15. Ревизия `Legacy/` и временных migration-артефактов

- [ ] Выполнить отдельной задачей после успешного cutover.
- [ ] Для каждого migration/shadow-артефакта зафиксировать решение `remove` или `preserve` и его фактических потребителей.
- [ ] Для каждого файла `Legacy/` подтвердить structured replacement и отсутствие активных потребителей; только после этого удалить действительно ненужные дубли отдельным PR. Нужные исторические baseline и characterization-тесты сохранить с объяснением роли.
- [ ] Сохранить постоянные schemas, semantic validators/resolvers, локальные проверки и регрессионные тесты, которые защищают действующие правила после cutover.
- [ ] Подтвердить, что manifest, routes, bundles, skills и bootstrap не ссылаются на удалённые источники или временные механизмы; сохранённый архив не является активным владельцем правил.

## Правило обновления roadmap

После слияния этапа обновляется только его статус и ссылка на фактический implementation plan или PR. Перед таким обновлением статус повторно проверяется по актуальному `main` и содержимому `docs/superpowers/plans/`. Новое системное правило сначала фиксируется в master-спецификации; roadmap не используется как скрытый источник технических правил.
