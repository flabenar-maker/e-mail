# CUPIS Structured System Migration Roadmap

Актуальность: 2026-08-25.

## Назначение

Этот файл — единый источник порядка и статуса этапов перехода CUPIS email-системы. Он не заменяет [master-спецификацию](../specs/2026-08-24-cupis-structured-email-system-design.md) и не дублирует подробные implementation plans отдельных этапов.

Master-спецификация владеет архитектурными решениями. Roadmap показывает только последовательность, зависимости и текущий статус. Перед началом каждого технического этапа создаётся отдельный implementation plan с точными файлами, проверками и commits.

## Статусы

- `[x]` — этап завершён и находится в `main`;
- `[ ]` — этап ещё не начат;
- один технический этап выполняется в отдельной branch и PR;
- следующий этап начинается после проверки и слияния предыдущего;
- если этап требует нового архитектурного решения, сначала обновляется master-спецификация.

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

### 5. Остальные foundations

- [ ] Перенести asset/export contracts в структурированный assets foundation.
- [ ] Перенести универсальные правила Figma naming в структурированный figma-naming foundation.
- [ ] Добавить schemas, validation, characterization и manifest references каждого foundation.
- [ ] Сохранить конкретные component contracts вне общих foundations.

### 6. Структурированный component registry

- [ ] Определить schema общего, маркетингового и сервисного реестров компонентов.
- [ ] Перенести фактические component contracts без изменения их смысла.
- [ ] Сохранить Figma provenance, variants, properties и ссылки на foundations.
- [ ] Добавить unregistered-component blocker и проверки синхронизации.

### 7. Generated docs и context bundles

- [ ] Генерировать читаемые реестры и справочники из структурированных источников.
- [ ] Формировать route-specific bundles без лишнего контекста.
- [ ] Проверять, что каждый bundle содержит только применимые rules, contracts и workflows.

### 8. Core и workflows cutover

- [ ] Разделить Core по утверждённой ответственности.
- [ ] Перевести maintenance и email-build workflows в структурированный формат.
- [ ] Сохранить HTML-вёрстку зависимой от фактического инстанса и component contract, а не от design-time золотых правил.
- [ ] Выполнить characterization comparison со старыми Markdown-источниками.

### 9. Maintenance skill cutover

- [ ] Перевести `maintaining-cupis-email-system` на manifest route и context bundle.
- [ ] Сохранить навык тонким маршрутизатором без копий правил и жёсткого списка путей.
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

- [ ] Сравнить structured outputs и context bundles с действующими Markdown-источниками.
- [ ] Устранить semantic drift до cutover.
- [ ] Подтвердить, что маршруты maintenance, component development и email build получают разные минимальные наборы контекста.

### 14. Cutover

- [ ] Переключить рабочие маршруты на структурированные источники и generated bundles.
- [ ] Подтвердить validation, bootstrap, skills и GitHub/Figma workflows.
- [ ] Зафиксировать rollback point перед удалением старых дублей.

### 15. Удаление старых дублей

- [ ] Выполнить отдельной задачей после успешного cutover.
- [ ] Удалить только источники, которые больше не используются manifest, routes, bundles, skills и bootstrap.
- [ ] Подтвердить отсутствие ссылок на удаляемые пути.

## Правило обновления roadmap

После слияния этапа обновляется только его статус и ссылка на фактический implementation plan или PR. Новое системное правило сначала фиксируется в master-спецификации; roadmap не используется как скрытый источник технических правил.
