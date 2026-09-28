# CUPIS Structured System Migration Roadmap

Актуальность: 2026-09-17.

## Назначение

Этот файл — единый источник порядка и статуса этапов перехода CUPIS email-системы. Он не заменяет [master-спецификацию](../specs/2026-08-24-cupis-structured-email-system-design.md) и не дублирует подробные implementation plans отдельных этапов.

Master-спецификация владеет архитектурными решениями. Roadmap показывает только последовательность, зависимости и текущий статус. Перед началом каждого технического этапа создаётся отдельный implementation plan с точными файлами, проверками и commits.

## Статусы

- `[x]` — этап завершён и находится в `main`;
- `[ ]` — этап или пункт ещё не завершён;
- каждый технический пакет выполняется в отдельной branch и PR;
- следующий этап начинается после проверки и слияния предыдущего;
- если этап требует нового архитектурного решения, сначала обновляется master-спецификация.

## Обязательная сверка прогресса

Перед любым ответом о текущем этапе, завершённой работе или следующем шаге:

1. закрепить актуальный SHA ветки `main`;
2. повторно открыть этот roadmap из `docs/superpowers/plans/`;
3. проверить состав папки `docs/superpowers/plans/` и наличие связанного implementation plan текущего этапа;
4. сверить отмеченный статус с фактически слитыми в `main` артефактами;
5. не восстанавливать статус только по памяти чата.

Исторические пункты завершённых этапов описывают состояние на момент их реализации. После [PR #69](https://github.com/flabenar-maker/e-mail/pull/69) старый контур находится в `Legacy/`, все маршруты временно указывают на `workflow-paused`, а [PR #70](https://github.com/flabenar-maker/e-mail/pull/70) привёл тесты к этой изоляции. Это не cutover и не завершение миграции. Старые формулировки «действующий Markdown-источник» в завершённых этапах не описывают текущий рабочий путь.

Этап отмечается завершённым только после его слияния в `main`. После слияния в roadmap добавляются фактическая ссылка на implementation plan или PR и новый статус. Если подробный plan ещё не создан, следующим действием является его создание и review, а не начало реализации.

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

Этап реализован в [PR #17](https://github.com/flabenar-maker/e-mail/pull/17). CI был частью исторического результата; [PR #67](https://github.com/flabenar-maker/e-mail/pull/67) убрал GitHub Actions, и текущие проверки выполняются локально.

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

Реализация этапа 7B слита в [PR #43](https://github.com/flabenar-maker/e-mail/pull/43), итоговый commit: `15a1c3ce09fec33d5aee82a87ffee4667e911702`. Generated docs и route-specific context bundles были реализованы как shadow-слой. После PR #69 полный `docs/generated/component-registry.md` ошибочно оказался в `Legacy/` вместе со старым контуром; его renderer и структурированные входы остались. [PR #71](https://github.com/flabenar-maker/e-mail/pull/71) восстановил полный generated registry, его регистрацию в manifest и blocking-проверки в `main`. Файл вновь является производным представлением 61 structured contracts, не вторым источником component facts; остановленные маршруты не переключались.

### 8. Core, workflows и подготовка HTML-рендера — завершён

Архитектурное основание: [CUPIS HTML Rendering Design](../specs/2026-09-10-cupis-html-rendering-design.md).

Подробный implementation plan: [CUPIS HTML Rendering Stage 8](2026-09-10-cupis-html-rendering-stage-8.md).

Этап 8 готовит renderer и структурированные workflows, но не переключает остановленные маршруты. Фактический cutover выполняется только на этапе 14 после сквозного сравнения этапа 13.

Фактический статус на 2026-09-17: пакеты 1–9 слиты в main через PR #50–58; [PR #59](https://github.com/flabenar-maker/e-mail/pull/59) исправил пилотные Mobile/Desktop layout contracts. Package 10A–10C слиты через PR #78–80; Package 10D исключён из текущего маршрута без имитации client evidence. Package 11 завершил coverage всех 61 active component records через PR #81–83. Package 12 добавил structured workflows, `structured-shadow` bundle mode и archive-path blocker в [PR #84](https://github.com/flabenar-maker/e-mail/pull/84). Все семь routes остаются `workflow-paused`; это завершение подготовки Stage 8, а не production cutover.

После неудачной попытки получить убедительный пилотный результат обнаружилась недостаточная точность части мигрированных component contracts. [PR #61](https://github.com/flabenar-maker/e-mail/pull/61), [#62](https://github.com/flabenar-maker/e-mail/pull/62), [#63](https://github.com/flabenar-maker/e-mail/pull/63) и [#64](https://github.com/flabenar-maker/e-mail/pull/64) выполнили прямую сверку с Figma, добавили проверку фактических данных и уточнили маркетинговые и сервисные контракты. Это корректирующая работа внутри этапа 8, а не завершение пакетов 10–12.

[Корректирующий план для foundations этапов 2–5](2026-09-15-cupis-foundations-figma-verified-remediation.md) реализован и слит через [PR #75](https://github.com/flabenar-maker/e-mail/pull/75), merge commit `c8c485bde0d69316dac83925c40e4f6b2fc0037c`. Он усилил Figma-backed проверку typography, spacing, assets и naming, но не завершил Package 10–12, этап 8, сквозное сравнение этапа 13 или cutover этапа 14.
[PR #60](https://github.com/flabenar-maker/e-mail/pull/60) остаётся открытым исследовательским черновиком: он не меняет active rules, component contracts или renderer. Результаты исследования преобразованы в согласованную [client-resilience спецификацию](../specs/2026-09-16-cupis-email-client-resilience-design.md) и [implementation plan](2026-09-16-cupis-email-client-resilience.md). Проверка через Altcraft была запланирована как Package 10D, но 17.09.2026 исключена из текущего маршрута по прямому решению пользователя из-за отсутствия доступа. Она не считается выполненной, а responsive fallback остаётся неподтверждённым (`required-before-change`).

- [x] Зафиксировать characterization baseline и владельцев renderer-impacting данных — PR #50.
- [x] Создать rendering foundation и renderer-ready schema без дублирования существующих foundations и contracts — PR #51–52.
- [x] Нормализовать пилотные component contracts и сверить значимые факты с Figma — PR #52 и #61–64.
- [x] Разделить Core на четыре тематических стандарта — PR #53.
- [x] Реализовать email-примитивы, общий contract-tree interpreter и пилотный renderer registry — PR #54–55.
- [x] Добавить временную модель, CLI, типизированную диагностику и атомарную публикацию email.html + images/ — PR #56–57.
- [x] Вычислять render-impact digest автоматически только из данных, влияющих на HTML — PR #57.
- [x] Добавить автоматические HTML и property checks — PR #58.
- [x] Проверить фактический HTML обновлённого пилота и классифицировать расхождения по входной модели, контракту, renderer code и browser preview — исправления оболочки и Mobile/Desktop границы слиты в PR #66.
- [x] Package 10A: exact client-resilience policies, обязательные document metadata и явная alt-семантика — [PR #78](https://github.com/flabenar-maker/e-mail/pull/78).
- [x] Package 10B: shell/alt propagation, exclusive CSS budget, output metrics и точная minimum-viewport семантика — [PR #79](https://github.com/flabenar-maker/e-mail/pull/79).
- [x] Package 10C: normal/no-style preview, узкие viewport, Email/Header рядом с Email/Footer и доступный browser visual gate — [PR #80](https://github.com/flabenar-maker/e-mail/pull/80). Normal mode прошёл; no-style выявил Desktop-fallback overflow на 300–360px.
- [x] Package 10D исключён из текущего маршрута по решению пользователя из-за отсутствия доступа к Altcraft и целевым приложениям. Проверка не выполнена; `responsive_fallback.validation` остаётся `required-before-change`.
- [x] Доступные representative Mobile/Desktop visual scenarios для Header, Footer и пилотных блоков выполнены в Package 10C; real-client evidence не заявляется.
- [x] Мигрировать renderer coverage остальных активных компонентов после успешного пилота — PR #81–83: 61 active/covered, 38 interpreter-ready и 23 source-only, zero missing coverage.
- [x] Перевести maintenance и email-build workflows в структурированный формат и сравнить их обязательства с read-only архивным baseline без двойного контекста — PR #84. Полное сквозное сравнение маршрутов остаётся этапу 13.
- [x] Подтвердить, что HTML зависит от фактического инстанса и component contract, а не design-time золотых правил — contract-tree interpreter и renderer coverage защищены локальными tests этапа 8.
- [x] Не подавать архивный и structured наборы правил одновременно в рабочий bundle — PR #84 возвращает `CONTEXT_BUNDLE_ARCHIVED_SOURCE_FORBIDDEN` для архивного path.
- [x] Завершить проверки этапа 8 — на финальном SHA PR #84 локально прошли rendering audit, generated-doc check, полный `npm run verify` и Windows bootstrap; GitHub Actions не использовались.

[PR #66](https://github.com/flabenar-maker/e-mail/pull/66) исправил оболочку пилотного письма и границу Mobile/Desktop. [PR #67](https://github.com/flabenar-maker/e-mail/pull/67) и [#68](https://github.com/flabenar-maker/e-mail/pull/68) закрепили локальные проверки без GitHub Actions; [PR #69](https://github.com/flabenar-maker/e-mail/pull/69) и [#70](https://github.com/flabenar-maker/e-mail/pull/70) изолировали Legacy и адаптировали тесты. Маршруты сейчас остановлены; восстановленный полный generated component registry не означает завершения пакетов 10–12 или возобновления production-сборки.

### 9. Подготовка maintenance skill — завершён

Подробный implementation plan: [CUPIS Maintenance Skill Stage 9](2026-09-17-cupis-maintenance-skill-stage-9.md).

Manifest-driven разрешение source paths было выполнено на этапе 2. Этот этап не повторяет первоначальный переход на manifest: он подготовил навык к итоговым generated context bundles, но не запустил временно остановленные маршруты. Каждый route включается только после собственного проверенного cutover: email routes — на этапе 10, остальные — на этапе 14 после этапа 13.

- [x] Подготовить `maintaining-cupis-email-system` к итоговым route-specific context bundles, сохранив остановленные маршруты до отдельного проверенного cutover.
- [x] Сохранить навык тонким маршрутизатором без копий правил и жёсткого списка путей.
- [x] Сохранить отдельный `migration-progress` route, требующий свежей сверки с roadmap перед ответом о статусе или следующих шагах.
- [x] Проверить mutation impact gate, cloud-only GitHub flow и Figma mutation gate.

[PR #85](https://github.com/flabenar-maker/e-mail/pull/85), merge commit `258aa22e12b680ea54507d82430d325228c87bbe`, добавил machine resolver, CLI, boundary tests и тонкий maintenance skill. На точном финальном SHA локально прошли 585 тестов и Windows bootstrap; все семь routes остались `workflow-paused`.

### Prerequisite этапа 10: архив и публикация Figma Description

Подробный implementation plan: [CUPIS Figma Description Archive and Compact Sync](2026-09-17-cupis-figma-description-archive-and-sync.md).

Это отдельный завершающий пакет component documentation, а не часть HTML-rendering runtime. До его выполнения пользователь предоставляет четыре ссылки на тестовые письма для этапа 10: Mobile/Desktop маркетингового и Mobile/Desktop сервисного письма.

- [x] Снять через Figma MCP raw Description и Documentation link всех component/component-set nodes внутри библиотечных roots, включая пустые значения и variant nodes с собственной metadata.
- [x] Сохранить один самостоятельный snapshot в `Legacy/` без stable component IDs, manifest source, bundle reference, runtime consumer или validation dependency.
- [x] Сопоставить canonical Figma owners с active component records и отдельно показать missing, duplicate и ambiguous mappings; не придумывать ID.
- [x] Зафиксировать compact generated format `CUPIS ID` → `PURPOSE` → `RENDER` → optional `CRITICAL`, ограничив PURPOSE 160 символами, а CRITICAL двумя пунктами.
- [x] Сгенерировать полный old → new preview и получить отдельное разрешение пользователя на Description-only Figma mutation.
- [x] Записать только Description canonical component owners через MCP и выполнить отдельный read-back с проверкой фактических полей и неизменности дизайна.

[PR №87](https://github.com/flabenar-maker/e-mail/pull/87) слит: raw snapshot 156 Figma nodes сохранён отдельно, guards compact-формата и Description 61 canonical owners опубликованы. Description/name/Documentation links подтверждены read-back, 272 contract-linked Figma facts повторно сверены без расхождений. Этот prerequisite завершён; четыре ссылки на два тестовых письма получены до сборки.

### 10. Навык HTML-вёрстки конкретных писем

Подробный implementation plan: [CUPIS Email Build Skill Stage 10](2026-09-17-cupis-email-build-skill-stage-10.md).

Статус на 2026-09-28: этап 10 завершён. Два email routes активированы [PR №97](https://github.com/flabenar-maker/e-mail/pull/97), навык зарегистрирован [PR №98](https://github.com/flabenar-maker/e-mail/pull/98), Mobile shell исправлен [PR №99](https://github.com/flabenar-maker/e-mail/pull/99), а [PR №101](https://github.com/flabenar-maker/e-mail/pull/101) синхронизировал статус активных маршрутов и добавил выбор доступного package runner. На точном head №101 локально прошли 705/705 тестов, validation, generate:check и bootstrap; установленный навык побайтно совпадает со слитым источником. Оба тестовых письма собраны и пересобраны, пользователь визуально принял результат. Ранее измеренная разница высот сервисного примера принята только для этих конкретных инстансов, а не как общее допустимое отклонение. Изолированный запуск после merge создал версию `service-email-e2e_1.4` с одними тестовыми href-правками и неизменными изображениями. Реальные почтовые клиенты и Altcraft в этих проверках не испытывались; остальные маршруты остаются paused. Подробные факты — в [E2E-плане](2026-09-18-cupis-email-model-assembly-and-e2e.md).

Этот этап начинается после завершённого maintenance skill, prerequisite-пакета Figma Description и получения четырёх ссылок на два тестовых письма. Он использует готовые renderer, structured email workflow и machine resolver и не зависит от стандарта или навыка разработки новых блоков: письмо собирается только из уже зарегистрированных компонентов, а неизвестный компонент остаётся typed blocker. После успешных реальных E2E-сборок этап включает только email routes; остальные routes остаются остановленными до этапа 14.

- [x] Создать repo-scoped skill `building-cupis-emails` как тонкий маршрутизатор к `email-new-build` и `email-continue-fix`.
- [x] Не копировать в skill HTML-правила, component contracts, foundation values, asset profiles, workflow steps или список canonical paths.
- [x] Проверить однозначную классификацию нового письма, design-dependent изменения, technical изменения, read-only задачи и запроса, требующего уточнения.
- [x] Проверить обязательные Mobile/Desktop Figma-входы только для design-dependent режимов и запрет догадок при отсутствующей или перепутанной паре.
- [x] Проверить локальное версионирование без перезаписи источника: новое письмо начинает с `1.0`, каждое следующее изменение создаёт новую папку с шагом `0.1`, а итоговая папка содержит только `email.html` и `images/`.
- [x] Проверить, что новое письмо проходит через temporary email model и renderer CLI, а незарегистрированный компонент, неполный contract или asset contract останавливают сборку.
- [x] Проверить сборку от корневого Email/Template-инстанса без подъёма вложенных cards, items, buttons, badges или assets в самостоятельные блоки письма.
- [x] Проверить MCP-only экспорт ассетов, локальные `src`, отсутствие лишних файлов и применение точных значений только из resolved bundle.
- [x] Проверить локальные HTML-инварианты, Mobile/Desktop и visual regression на representative marketing/service сценариях без GitHub Actions.
- [x] Собрать из чистого контекста реальное маркетинговое и реальное сервисное письмо по предоставленным Mobile/Desktop-инстансам и устранить все неклассифицированные расхождения в источнике-владельце.
- [x] Выполнить одно реальное continue/fix изменение с созданием версии `1.1`, сохранив исходную `1.0` побайтово неизменной.
- [x] Активировать только `email-new-build` и `email-continue-fix`, их bundle/workflow dependencies и проверенный local skill; сохранить остальные routes на `workflow-paused`.
- [x] Проверить обычный пользовательский запрос из чистого контекста (изолированный исполнитель по E2E-плану) без опоры на историю разработки.
- [x] Сохранить Figma-библиотеку, component-development standard и локальные исходные версии писем без изменений.

### 11. Стандарт и workflow разработки новых блоков

Этот этап выполняется после подготовки навыка сборки писем. Он создаёт отдельный design-time маршрут и не расширяет email-build skill правилами проектирования новых компонентов.

- [ ] Обновить master-спецификацию и зафиксировать отдельный route разработки новых email-блоков.
- [ ] Создать отдельный стандарт проектирования email-компонентов; не добавлять эти design-time правила в HTML-rendering instruction.
- [ ] Зафиксировать в стандарте иерархию CTA, допустимое размещение `Button/Primary`, непрерывность линии чтения, роль изображения, Mobile/Desktop reading order и недопустимые композиционные разрывы.
- [ ] Создать отдельный component-development workflow: brief → анализ библиотеки → композиционная схема → wireframe → согласование → детальный дизайн → визуальная проверка → возможная productionization.
- [ ] Требовать промежуточное согласование wireframe для нового блока без готового референсного макета.
- [ ] Оставлять прототип example/frame без Component и Description, пока пользователь отдельно не разрешит productionization.
- [ ] Добавить route и bundle в manifest, не подключая design-time standard к `email-new-build` и `email-continue-fix`.

### 12. Навык разработки новых блоков

- [ ] Создать repo-scoped skill `developing-cupis-email-components`.
- [ ] Использовать skill только как маршрутизатор к component-development route, standard и workflow.
- [ ] Не дублировать в skill CTA rules, композиционные правила, naming constants, spacing values или component contracts.
- [ ] Разделить ответственность:
  - новый skill — проектирование и проверка новых прототипов;
  - component onboarding — регистрация уже одобренного компонента;
  - maintenance skill — поддержка существующей production-библиотеки.
- [ ] Проверить безопасный переход от одобренного прототипа к отдельной productionization-задаче.

### 13. Сквозное shadow comparison

Этап начинается после подготовки workflows, навыков и renderer coverage на этапах 8–12. Email-build к этому моменту уже активирован собственным E2E-gate этапа 10. Здесь проверяется результат оставшихся maintenance и component-development маршрутов до их включения, а также выполняется regression уже активного email-build.

- [ ] Сравнить generated docs, resolved context bundles и representative результаты maintenance и component development с сохранёнными read-only источниками в `Legacy/`; не подключать архив к действующим маршрутам и не считать перенос доказательством equivalence.
- [ ] Перенести необходимые characterization assertions из архивного baseline в активные проверки или заменить их проверками с тем же смыслом; тесты, лежащие в `Legacy/`, не считаются частью текущего `npm test`.
- [ ] Повторить representative email new-build и continue/fix regression без возврата к архивным runtime-источникам.
- [ ] Устранить semantic drift до cutover оставшихся routes и подтвердить, что три типа задач получают разные минимальные наборы контекста.

### 14. Cutover оставшихся маршрутов

- [ ] Только после успешного этапа 13 переключить оставшиеся maintenance/component-development routes и подготовленные навыки на проверенные structured workflows, источники и generated bundles. Не изменять уже активные email routes без доказанного regression defect и не возвращать `Legacy/` как промежуточный рабочий путь.
- [ ] Перевести оставшиеся foundations, прошедшие shadow comparison, из временного `shadow`-режима в итоговый рабочий статус.
- [ ] Подтвердить validation, bootstrap, skills и GitHub/Figma workflows.
- [ ] Зафиксировать rollback point и полный список временных migration/shadow-артефактов перед очисткой.

### 15. Ревизия `Legacy/` и временных migration-артефактов

- [ ] Выполнить отдельной задачей после успешного cutover.
- [ ] Для каждого migration/shadow-артефакта зафиксировать решение `remove` или `preserve` и его фактических потребителей.
- [ ] Для каждого файла `Legacy/` подтвердить structured replacement и отсутствие активных потребителей; только после этого удалить действительно ненужные дубли отдельным PR. Нужные исторические baseline и characterization-тесты сохранить с объяснением роли.
- [ ] Сохранить постоянные schemas, semantic validators/resolvers, локальные проверки и регрессионные тесты, которые защищают действующие правила после cutover.
- [ ] Подтвердить, что manifest, routes, bundles, skills и bootstrap не ссылаются на удалённые источники или временные механизмы; сохранённый архив не является активным владельцем правил.

## Правило обновления roadmap

После слияния этапа статус, ссылка на фактический implementation plan или PR, следующий gate и зависимости сверяются с актуальным `main` и содержимым `docs/superpowers/plans/`. Если реализация изменила путь к cutover, эти части roadmap корректируются без переписывания исторических задач как будто они выполнялись иначе. Новое системное правило сначала фиксируется в master-спецификации; roadmap не используется как скрытый источник технических правил.
