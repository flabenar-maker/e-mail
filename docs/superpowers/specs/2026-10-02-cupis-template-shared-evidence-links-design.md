# CUPIS: служебные связи Template и Shared — дизайн T1/S1

Дата: 02.10.2026. Статус: направление и письменная спецификация одобрены пользователем. [Implementation plan T1/S1](../plans/cutover/2026-10-02-cupis-template-shared-evidence-links.md) подтверждён; задачи 1–4 выполнены в кандидате PR #110 (формат/offline references, capture/canonical-session inputs, T1 и S1 checkers). Задачи 5–7 и реальные mappings ещё не начаты.

Основание: `main@618d124df0a664c84d23a724ba50ef2b324e9b97`, кандидат [PR #110](https://github.com/flabenar-maker/e-mail/pull/110) `e544e303f7d5ebf3e7b3ea01f87a7c19234a95d2`. Это дочернее уточнение [master-spec](2026-08-24-cupis-structured-email-system-design.md), а не второй глобальный план. Последовательность остаётся в [roadmap](../plans/2026-08-25-cupis-migration-roadmap.md), исходные факты и карта владельцев — в [журнале P2](../plans/2026-10-01-cupis-final-maintenance-cutover.md).

## 1. Цель и граница

Сделать машинно-проверяемыми две уже выявленные связи:

- T1: фактические параметры корневого Template → существующие параметры HTML-оболочки в rendering foundation;
- S1: исходный Shared-элемент → конкретное место использования → владелец составного ассета.

Один факт сохраняет одного владельца. Новые записи описывают, **что с чем проверять**, а не содержат вторую копию цвета, размера, HTML или export policy. Shared не становится самостоятельным блоком письма; Template остаётся корнем композиции и источником её оболочки, не дополнительным элементом content.

Не входят: изменение чисел, цветов, шрифтов, asset contracts, HTML-деревьев, дизайна/Description/нейминга Figma, локальных писем, активация маршрутов, PR #109, остальные незакрытые факты P2 и автоматическое слияние. Проверка конкретного Template-инстанса при сборке письма не объявляется реализованной библиотечной сверкой.

## 2. Выбранное решение

Добавить `evidence_links` на верхний уровень существующего component record, рядом с `contracts`, а не внутри него. Это служебные canonical metadata для поддержки библиотеки.

Два массива: `foundation_values` и `source_dependencies`. Оба обязательны при наличии `evidence_links`; каждый может быть пустым. У links обязательный уникальный внутри записи `id`. Неизвестные поля запрещены. Отсутствие раздела допускается для постепенного внедрения, но **не означает проверенную полноту**.

Существующие `contracts.figma_fact_links` сохраняют свою функцию: прямое сопоставление Figma с собственными реализационными фактами записи. Новая модель их не заменяет, не ослабляет и не меняет их target-prefix на произвольный внешний путь.

Альтернативы отклонены:

- отдельный вручную поддерживаемый реестр зависимостей создаёт второй источник и риск рассинхронизации;
- использование HTML `nested_components` смешивает устройство картинки с устройством письма;
- свободные ссылки на любые файлы/значения позволят подтвердить факт сторонним или неканоническим источником.

## 3. T1: ссылки на foundation values

Формат одной записи:

```yaml
id: desktop-shell-width
source:
  variant_node_id: '1102:7'
  node_id: '1102:7'
  field_path: /reference_dimensions/width
target:
  source_id: rendering-foundation
  pointer: /shell/max_width_px
comparison: pixel-number
```

Это пример структуры по ранее проверенному узлу, не запись новых данных в действующий контракт.

Правила:

- Владелец source — текущий record; file key берётся из его `figma.file_key`. Variant должен принадлежать ему, node — находиться в свежем дереве именно этого variant. Поиск по имени вместо ID запрещён.
- `target.source_id` разрешается только текущим закреплённым manifest. `pointer` — точный JSON Pointer без wildcard. Файл и ожидаемое значение загружаются с того же Git SHA; link не хранит `expected_value`.
- Первый объём ограничен source `rendering-foundation` и targets `/shell/background_color`, `/shell/max_width_px`, `/shell/horizontal_inset_px`. Другие targets не принимаются как якобы поддержанные. Это ограничение механизма по домену значений, не список исключений для конкретных component IDs.
- `comparison` имеет два значения: `pixel-number` и `opaque-solid-color`. Произвольные выражения, допуски, пересчёт размеров и вычисление export scale не поддерживаются.
- `pixel-number` принимает конечное число из поля capture с известной пиксельной семантикой. Используется существующая нормализация float-погрешности Figma; новое округление до целых не вводится. Для desktop shell width проверяется фиксированный горизонтальный sizing источника.
- `opaque-solid-color` использует существующее преобразование RGB 0–1 в sRGB HEX. Проверяются тип SOLID, видимость, непрозрачность paint и узла, отсутствие других видимых fills и влияющей прозрачности предков внутри проверяемого variant. Совпадение HEX скрытого или полупрозрачного Fill не даёт успеха. Недоступный контекст paint оставляет связь непроверенной.
- Один target может иметь несколько независимых source assertions, например фон Mobile и Desktop. Они не заменяют друг друга: требуется успех каждого обязательного assertion.

Для первого Template проверяются фон обоих корней и Slots, desktop width, left/right padding обоих корней. Нулевой padding Slot не добавляется к root inset и не превращается в дополнительный HTML-отступ. Его прочие параметры сохраняются в отдельной области фактов; совпадение этого набора не объявляет весь Template проверенным.

Измеренные Mobile 328 и HUG-height 1000 не сопоставляются с `min_supported_viewport_px` или фиксированной HTML-высотой. Breakpoint 659 и минимальная ширина 300 остаются rendering policies, а не выведенными из Template числами.

## 4. S1: зависимости исходных элементов

Link хранится **у потребителя**. Обратная карта «какие потребители затронуты» вычисляется, вручную на стороне исходной иконки не дублируется.

Формат:

```yaml
id: desktop-header-logo-source
source:
  variant_node_id: '230:3679'
  node_id: '1008:1823'
target:
  component_id: asset-header-logo-4x
  variant_id: product-cupis
asset_owner:
  node_id: '1008:1823'
  asset_id: header-logo
```

- `source.node_id` — реальный INSTANCE внутри указанного variant текущего record. Проверяемое поле всегда `main_component_id`, поэтому отдельное свободное поле пути не требуется.
- `target.component_id` — зарегистрированный стабильный CUPIS ID. `variant_id` обязателен для источника с variants и отсутствует у отдельного COMPONENT. Ожидаемый Figma main ID выводится из текущей target-записи; второй literal main ID в link не хранится.
- Источник и потребитель должны находиться в одном проверяемом Figma-файле. Неизвестный, удалённый, detached или недоступный source не заменяется похожим по имени.
- `asset_owner.node_id` — точная внешняя граница в дереве потребителя; она равна source instance либо является его предком в том же variant. Соседний узел не может подтвердить эту границу.
- `asset_id`, когда задан, разрешается в собственном `asset_contracts` потребителя. Он обязателен для использования внутри существующего экспортируемого ассета. Для Shared композиции без собственного файла допускается его отсутствие: такая связь описывает исходную графику, но не создаёт новый экспорт.
- Наличие `asset_id` и предка недостаточно: owner должен однозначно соответствовать уже заданной export boundary этого asset contract в данном variant. Произвольный родитель не становится export owner. Если действующие selectors не позволяют подтвердить границу, результат — `unverified`, а не новый selector или guessed owner.
- Node IDs поддерживают обычные `number:number` и фактически встречающиеся составные instance IDs `I<number:number>;<number:number>[;...]`. Сравнение полное; нельзя отбросить префикс instance и принять узел master за вложенный объект.
- Незарегистрированную или неоднозначную export boundary нельзя угадать по ближайшему имени. Это отдельная диагностика; текущая граница экспорта не меняется автоматически.

### Default и instance override

Default glyph принадлежит записи исходного badge. Фактический glyph внутри конкретного badge instance принадлежит записи использующего его блока. Обе связи проверяются в своём контексте и могут законно указывать на разные иконки.

В `block-receipt-info` положительный badge по-прежнему связан с тем же badge component, но его вложенный glyph указывает на `icon-receipt-fill`, а не на default `icon-lock-password-fill`. Проверка должна сохранить обе ступени. Целый badge остаётся единственным изображением; glyph не получает HTML-узел или отдельный файл.

Карта воздействия различает прямую/default-зависимость и подтверждённое фактическое использование. Транзитивная default-цепочка может обозначить возможного потребителя для проверки, но не доказывает использование заменённого glyph в instance. Изменение default Lock нельзя выдать за доказанную смену Receipt в таком instance.

Мобильный Compact Header остаётся собственным источником дизайна, но использует уже существующий общий `header-logo` asset. Link не предписывает новый mobile export и не подменяет display-размер нативным размером Product-Logo.

## 5. Проверка и достоверность результата

Проверка состоит из двух разных уровней:

1. **Без сети:** schema, уникальность ID, разрешение target source/component/variant/asset, типы, точные пути, отсутствие конфликтующих дубликатов и циклов dependency graph. Это проверка структуры ссылок, не совпадения с Figma.
2. **Свежий MCP:** source identity, variant membership, структура, ancestry, фактические значения и main-component references. Default target сверяется по свежему target-пакету, а не только по сохранённому `source_variants`.

Live checker получает канонические записи/manifest/foundations одного SHA и отдельно пакеты текущего read-only MCP-сеанса. Ожидаемые targets разрешает сам из canonical metadata: caller не может передать произвольные «ожидаемые значения» как замену каноническим.

Для сеанса явно фиксируются SHA, выбранные owners, время начала и receipts фактических вызовов; пакет имеет время capture и точные file/component identities. Пакет до начала сеанса, с отсутствующим временем, неполным/усечённым деревом или без требуемого source не подтверждает связь. Capture 1.1.0 фиксирует timestamps внутри вызова, полноту дерева и число сериализованных узлов. Старый capture 1.0.0 остаётся допустимым для прежнего scalar audit, но не подтверждает новые evidence links; добавление даты к старому файлу не заменяет новое чтение. Чтение main component использует поддерживаемый асинхронный API.

Формат JSON сам по себе не доказывает происхождение данных: время и ID не являются криптографической аттестацией MCP. Ответственность агента — реальный вызов и сохранение receipt; автоматическая проверка проверяет согласованность этого входа и не обещает распознать намеренно подделанный пакет.

Результаты links: `verified`, `mismatch`, `unverified`. Каждый результат содержит owner/link ID, точные source и target, ожидаемое и фактическое значение при их наличии, причину. В canonical record не записывается постоянный «успех» вместо следующего чтения.

### Полнота отдельно от совпадения

Проверка не ограничивается перебором имеющихся links. Обязательный scope задаётся role-aware аудитом до сравнения:

- для Template — названные в §3 shell assertions на Mobile/Desktop и Slots;
- для Shared/asset boundaries — обнаруженные INSTANCE-связи выбранных полных поддеревьев, включая nested overrides;
- обычные HTML nested components сохраняют отдельные существующие contracts; artwork traversal не превращается в scalar HTML-layout audit.

Отсутствующий link на обязательный факт даёт missing-link diagnostic. Пустой массив, удаление `evidence_links` или совпадение оставшихся links не закрывают обязанность. Внешний список выборки выбирает область чтения, но не подставляет нормативные links.

Успешная новая связь не снимает чужие value mismatches, неподдержанные capture fields, непроверенное artwork или остальные diagnostics существующего auditor. Для covered paths учитываются только реальные успешно проверенные assertions, не все поля узла и не все содержимое export boundary.

Отсутствие consumer в прочитанной области не означает неиспользование во всём файле. Результат указывает scope; неполное чтение не выдаётся за пустой полный результат.

## 6. Потребители и отсутствие влияния на письма

`evidence_links` не передаётся HTML-интерпретатору, не входит в email model, не создаёт asset output и не становится foundation fact для дизайна. Его добавление не должно менять HTML, export contracts, compact Description или render-impact projection при прежних rendering inputs.

При этом SHA исходного data-файла и связанные source-version digests закономерно изменятся от добавления metadata. Их неизменность не является критерием; неизменность проверяется у rendering projection и результата на одинаковых входах.

Новый механизм вызывается из существующего component audit: общий результат включает отдельные diagnostics связей и прежние diagnostics фактов. Успех только новой секции не равен успеху всего компонента.

Полный generated registry может показывать эти ссылки в существующей секции зависимостей, помечая их как служебные: это проекция, не новая база. Никаких ручных копий реестра. Compact Description остаётся побайтово прежним.

P2 реализует schema, проверку и разрешённые mappings в candidate. Подключение служебной проекции к route-specific maintenance bundle/workflow относится к уже запланированному P3: оно должно использовать те же canonical поля и необходимые manifest-resolved sources. Email bundles не расширяются этими metadata. P2 не считается активацией maintenance; P3 не считается выполненным от наличия checker.

## 7. Первая область данных и сохраняемые границы

Первое внедрение использует карту P2, а не заново обходит всю библиотеку:

- `email-template` — T1;
- большой и компактный Header-Logo, Product-варианты, `email-header` — S1;
- positive/negative status badges и прочитанные `block-personal-data-update` / `block-receipt-info` — S1, включая реальные glyph overrides;
- исходные icons служат targets; отсутствие найденного consumer у остальных десяти иконок не исправляется вымышленными links.

До записи каждого mapping — адресное свежее чтение его source/target/owner. Подтверждение отдельных связей не переутверждает всю запись или все 61 компонент. Числа, alpha/radius, старые дубли asset contracts и спорный mobile-display fact большого логотипа не переписываются в рамках этой работы.

## 8. Область реализации по согласованной спецификации

Карта ответственности утверждённого implementation plan; задачи 1–4 реализуют форму/offline references, capture/canonical-session inputs, T1 и S1 checkers; общая интеграция и mappings остаются следующими задачами:

| Область | Владелец изменения |
| --- | --- |
| Форма links | `schemas/components.schema.json`; служебный раздел в разрешённых записях `data/components/{shared,marketing,service}.yaml` |
| Семантические ссылки | `scripts/lib/component-registry.mjs` и узкий отдельный модуль проверки evidence links; типы и известные source IDs берутся из текущей системы |
| Сверка с Figma | `scripts/audit-figma-contract-facts.mjs`, минимальная интеграция в `scripts/lib/figma-contract-facts.mjs`; переиспользование `scripts/lib/foundation-evidence.mjs` для значения после проверки identity/ownership |
| Capture metadata и main-component read | `scripts/figma/capture-contract-source.js`; без изменения визуальных узлов и числовых фактов |
| Нормативная граница и readable projection | `core/component-contract-standard.md`, `scripts/lib/component-registry-doc.mjs`, производный `docs/generated/component-registry.md` |
| Проверки | Schema/semantic, fact audit/CLI, capture, generated projection, сохранность email bundles/render-impact/HTML и export inputs |
| Дальнейшее подключение | Карта P3 в текущем cutover plan; не изменение статуса маршрутов или навыков в P2 |

Точные имена функций, новые файлы и тестовые команды определены в связанном implementation plan, подтверждённом пользователем. Он встраивается в текущий P2, не создаёт новый глобальный этап или параллельный список задач.

## 9. Критерии приёмки реализации

- Свежие правильные связи проходят; изменение цвета/desktop width Template или реального main component обнаруживается точным diagnostic.
- Чужой file/node/variant, подставленный canonical target, неправильный asset owner и отсутствующий link не дают успеха.
- Compound instance IDs и реальные overrides проходят без сведения к master; default и actual различаются.
- Скрытый/полупрозрачный/multi-fill источник не подтверждает opaque shell background только совпадением HEX.
- Native 62×62 не превращается в display 46.5×46.5 или badge 72×72; существующие правила экспорта не меняются.
- Отсутствующий/старый/усечённый пакет остаётся unverified. Сохранённый `source_variants` не используется вместо нового чтения.
- Новые metadata не изменяют render-impact projection, HTML, export inputs и compact Figma Description на неизменных моделях.
- Есть двусторонняя проверка coverage, не только happy path объявленных links; остальные blockers P2 сохранены.
- Targeted проверки выполняет Terra Medium локально на точных cloud commits; перед разрешённым merge кода — полный локальный gate. Actions/PR Checks не используются.

## 10. Текущее состояние и следующий шаг

Задачи 1–4 реализованы в кандидате PR #110: schema 2.2.0/typed metadata/offline references, capture 1.1.0 с async main lookup и metadata, manifest-resolved canonical model и проверяемый временный session. Code/test SHA задачи 2 — `98b8b7633d689badc21ecf15241fdd54a9cbc30d`; 161/161 scoped tests, validator/generated check PASS. Проверки, уточнения test fixtures и ограничения записаны в implementation plan/журнале P2. Это не подтверждение live-связей и не приёмка всего ремонта.

T1 checker задачи 3 реализован на `f0237a32727a54a8c5b503918cdd8bcc40e435ee`: девять обязательств независимо от links, exact identity/paint/sizing и canonical targets; 152/152 scoped tests, validator/generated check PASS через Terra Medium. Это synthetic gate механизма, не подтверждение фактических библиотечных links.

S1 задачи 4 реализован на `931c764a03215213448b67d7aa3b56c21aabc3dc`: scope не зависит от объявленных links; проверяются actual nested main IDs, точные owner/boundary и свежая target identity; confirmed impact отделён от possible default-цепочек. 191/191 scoped tests, validator/generated check PASS через Terra Medium. Это synthetic gate, не новое MCP-подтверждение библиотеки.

Факты компонентов, foundation values и HTML/export policy не менялись; реальные evidence links ещё не добавлены. Следующая задача 5 — общая интеграция с auditor/CLI без снятия прежних diagnostics. Запись links требует нового адресного MCP-чтения согласно §§5–7; ранее полученный audit не выдаётся за fresh acceptance нового механизма. P2 открыт; P3 и merge отдельно.
