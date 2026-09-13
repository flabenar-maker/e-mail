# Прямая сверка сервисных structured contracts с Figma

Дата чтения: 2026-09-13. Figma file key `8zka5bHkcrJVK9I9dKjnhC`, Service Emails `538:17235`. База GitHub: `ef1ff106a3fc665562c24171ef7e887945e8bd9e`.

Через Figma MCP проверены все 18 непосредственных компонентов сервисной Section: 13 component sets (30 вариантов) и 5 самостоятельных asset-компонентов. Сверены их имена, node ID, варианты, component-property definitions и значения, значимые для HTML/экспорта. Для незаблокированных компонентов сохранены исходные Figma-деревья с размерами, layout, padding/gap, Fill, текстовыми стилями, variable bindings и составом детей. Figma MCP при этом не выдаёт неизменяемый revision ID: дата и node ID задают область повторной проверки.

## Граница достоверности

Исходный `data/components/service.yaml` — миграционный черновик. В его Mobile/Desktop HTML-проекциях было 118 фактов с ID вида `description-N`, 115 с provenance `registry-literal`; Desktop root всех 18 компонентов был без фактов. Перенос из Markdown и совпадение отдельного числа не доказывают полноту HTML-контракта.

После текущей проверки **10 компонентов** имеют статус `figma-source-recorded` и 19 записанных source variants. Это точная запись прочитанных параметров Figma, **не утверждение о проверенной HTML-проекции**. Ещё **8 компонентов** имеют статус `blocked-ambiguous-description`: для них новые source facts не добавлялись. Старые Mobile/Desktop HTML-деревья всех 18 компонентов остаются непроверенной миграционной проекцией.

| Компонент | Статус | Основание |
|---|---|---|
| Asset/Bank-Badge @4x | source-recorded | Весь export-owner `72×72`; видимая внешняя обводка `#DFDFE0`, `0.5625px`, `OUTSIDE`; собственный Fill `#F8F8FA` скрыт. |
| Asset/Partner-Badge @4x | source-recorded | Весь export-owner `72×72`; видимый Fill artwork `#FF0C56`; собственный Fill `#FFFFFF` скрыт. |
| Asset/Icon-Badge @4x | source-recorded | Весь export-owner `72×72`; видимая внешняя обводка `#DFDFE0`, `0.5625px`, `OUTSIDE`; собственный Fill `#F8F8FA` скрыт. |
| Asset/Status-Badge-Positive @4x | source-recorded | `72×72`, radial gradient `#3DD55C → #00991F`, точный transform сохранён. Белый glyph входит в экспорт и не является отдельным HTML-цветом. |
| Asset/Status-Badge-Negative @4x | source-recorded | `72×72`, radial gradient `#FC7F94 → #DE2141`, точный transform сохранён. Белый glyph входит в экспорт и не является отдельным HTML-цветом. |
| Details/Transfer | source-recorded | Mobile vertical label/value `14px`, row gap `12px`, inner gap `4px`; Desktop horizontal `16px`, row gap `16px`, label `200px`; точные цвета `#98999C/#000000`. |
| Details/Operation-Plain | source-recorded | Те же точные Mobile/Desktop правила label/value, подтверждённые на обоих вариантах. |
| Details/Receipt | source-recorded | Те же точные Mobile/Desktop правила label/value, подтверждённые на обоих вариантах. |
| Details/Operation | source-recorded | Те же точные Mobile/Desktop правила label/value, подтверждённые на обоих вариантах. |
| Badge/Operation-Status | source-recorded | Все шесть Viewport×State вариантов: padding `4px 12px`, radius `63px`, Mobile `12px`, Desktop `16px`; три пары точных цветов совпали с Figma Description. |
| Block/Transaction-Success | blocked | «Белая карточка» задаёт HTML background словом; Figma показывает `#FFFFFF`. |
| Block/Transaction-Error | blocked | «Белая карточка» задаёт HTML background словом; Figma показывает `#FFFFFF`. |
| Block/Contact-Support | blocked | «Белая», «серый», «зелёная» и «radius из инстанса» не дают точный HTML-контракт; Figma показывает `#FFFFFF`, `#F8F8FA`, `#00991F`, help-notice radius `14px/18px`. |
| Details/Suspicious-Operation | blocked | «Красного цвета» и radius из инстанса; Figma показывает heading `#DE2141`, radius `14px/18px`. |
| Block/Personal-Data-Update | blocked | «Белая карточка» задаёт HTML background словом; Figma показывает `#FFFFFF`. |
| Block/Receipt-Info | blocked | «Белые status-area и receipt-area» задаёт HTML backgrounds словом; Figma показывает `#FFFFFF`. |
| Banner/Fiscal-Check-Link | blocked | «Белые кликабельные строки» задаёт HTML backgrounds словом; Figma показывает `#FFFFFF`. |
| Block/Instruction-Steps | blocked | «red text» задаёт HTML warning color словом; Figma показывает `#DE2141`. |

Значения в строках `blocked` — **диагностическое свидетельство**, не новый контракт. Перед их записью нужно точно уточнить соответствующие Figma Descriptions и синхронизировать Markdown-реестр. В текущем проходе Figma и реестр Descriptions не изменялись.

## Дополнительные наблюдения

- `Details/Transfer` в библиотеке содержит 9 Mobile rows и 10 Desktop rows. Description корректно отдаёт состав полей конкретному инстансу; числа библиотеки не нужно превращать в обязательное количество строк письма.
- У `Asset/Bank-Badge @4x` и `Asset/Icon-Badge @4x` внешняя обводка была бы потеряна прежней моделью source-node. `schemas/components.schema.json` дополнена полями `strokes`, `stroke_weight`, `stroke_align`, а значения взяты непосредственно из Figma. Утверждение о точном размере конечного PNG требует отдельной проверки экспорта; старые `pixel_dimensions` остаются непроверенной HTML/export-проекцией.
- Для 18 компонентов проверены variant IDs и component-property definitions. Ни один исходный Figma-component, Description, дизайн, маркетинговый contract или готовое письмо не менялись.

Это диагностический снимок и evidence layer, а не инструкция рендера. До отдельной адресной сверки HTML-проекций и разрешения восьми описаний нельзя объявлять сервисные structured contracts полностью доказанным источником истины.
