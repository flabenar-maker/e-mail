# Служебные связи Template и Shared

Технические правила связывают точный источник, потребителя и владельца факта. Полнота ссылок проверяется отдельно от совпадения значений.

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
- Наличие `asset_id` и предка недостаточно: owner должен однозначно соответствовать существующей границе artwork в данном variant. Для export viewport действуют точные export/owner selectors. Для другого viewport rendered-node граница потребителя разрешается по единственному direct-image элементу этого asset, его reference-size provenance и точной паре width/height `contracts.figma_fact_links` в том же variant. Это проверка фактического потребителя, не изменение экспортного источника. Произвольный родитель, имя Shared/master или selector другой версии не заменяют такую привязку. Отсутствующая/противоречивая/неоднозначная привязка остаётся `unverified`; новый selector и guessed owner не создаются.
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

Для свежего evidence используется session 1.1.0 и request-bound capture 1.2.0. Host перед вызовом создаёт случайные 256-bit `session_nonce` и `request_nonce` (64 lowercase hex), передаёт оба вместе с закреплённым `canonical_git_sha` (40 lowercase hex) в `captureFigmaContractFacts(nodeId, request)`. Collector проверяет закрытую форму request до чтения узлов и возвращает точный echo в `capture_meta.request`; полнота дерева и node count сохраняются. No-argument capture остаётся 1.1.0 для scalar diagnostics; capture 1.0/1.1 не подтверждают свежие evidence links. Старый файл не повышается до 1.2 добавлением полей задним числом.

В session сохраняются выбранные owners, canonical SHA, session nonce, host start/end и receipts реальных вызовов. У capture entry обязательны request nonce, host `requested_at` до вызова и `received_at` после ответа, tool, receipt ID, относительный packet path и SHA-256 точных file bytes. Host порядок: session start ≤ request ≤ receipt ≤ session end. Figma порядок: capture start ≤ capture end. Эти две шкалы часов не сравниваются между собой: рассинхрон не исправляется подменой даты или произвольным допуском.

Один batch может вернуть несколько owners только с одним точным request/receipt envelope (nonce, receipt ID, requested/received). Связь request nonce ↔ envelope однозначна; повтор nonce с другим receipt либо receipt с другим nonce отклоняется до чтения файлов. Packet echo обязан совпасть с session, соответствующим request entry и SHA модели. Файловый loader и in-memory auditor используют общий pure validator `component-evidence-freshness.mjs`; containment/hash/full-tree проверки остаются отдельными обязательными gates. Отсутствующие timestamp/echo/source, неполный пакет или неверная identity не подтверждают связь. Чтение main component использует поддерживаемый асинхронный API.

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

Служебная проекция maintenance использует те же canonical поля и manifest-resolved sources. Email bundles не расширяются этими metadata. Наличие checker не заменяет разрешение на запись или проверку фактических источников.
