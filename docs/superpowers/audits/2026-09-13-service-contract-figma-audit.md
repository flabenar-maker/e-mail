# Прямая сверка сервисных structured contracts с Figma

Дата чтения: 2026-09-13. Figma file key `8zka5bHkcrJVK9I9dKjnhC`, Service Emails `538:17235`. База GitHub: `ef1ff106a3fc665562c24171ef7e887945e8bd9e`.

Через Figma MCP проверены все 18 непосредственных компонентов сервисной Section: 13 component sets (30 вариантов) и 5 самостоятельных asset-компонентов. Сверены их имена, node ID, варианты, component-property definitions и значения, значимые для HTML/экспорта. Для незаблокированных компонентов сохранены исходные Figma-деревья с размерами, layout, padding/gap, Fill, текстовыми стилями, variable bindings и составом детей. Figma MCP при этом не выдаёт неизменяемый revision ID: дата и node ID задают область повторной проверки.

## Граница достоверности

Исходный `data/components/service.yaml` — миграционный черновик. В его Mobile/Desktop HTML-проекциях было 118 фактов с ID вида `description-N`, 115 с provenance `registry-literal`; Desktop root всех 18 компонентов был без фактов. Перенос из Markdown и совпадение отдельного числа не доказывают полноту HTML-контракта.

После адресной проверки неоднозначностей все **18 компонентов** имеют статус `figma-source-recorded` и 35 записанных source variants. У восьми ранее заблокированных компонентов дополнительно обновлены Mobile/Desktop semantic trees по непосредственно прочитанным Figma-узлам, property references, текстовым сегментам и двум отдельным фискальным бейджам. Статус означает, что источник и машинное выражение его фактов сверены; финальная применимость HTML-проекций в почтовых клиентах требует отдельной проверки рендера.

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
| Block/Transaction-Success | source-recorded | Прозрачный clipped card radius `22/26px`; `summary-area` и `details-area` имеют Fill `#FFFFFF`, divider `1px #DFDFE0`. Оба viewport и side effects Show Description/Show Limit Alert записаны. |
| Block/Transaction-Error | source-recorded | Прозрачный clipped card radius `22/26px`; белые `summary-area`/`body-area`, divider `1px #DFDFE0`; отдельно подтверждены Desktop/Mobile стили primary/notice/supporting text. |
| Block/Contact-Support | source-recorded | `content-area #FFFFFF`, `help-notice #F8F8FA` radius `14/18px`; Auto Layout gap `12px` без spacer; help-text — один rich-text узел с inline `«Помощь»` (`#00991F`, underline), база `#757678`. Исправлены фактические размеры heading/phone. |
| Details/Suspicious-Operation | source-recorded | Контейнер `#F8F8FA`, radius `14/18px`, heading `#DE2141`; Mobile/Desktop padding/gap и вложенный Details/Operation-Plain сверены. |
| Block/Personal-Data-Update | source-recorded | Прозрачный clipped card radius `22/26px`, два белых Fill `#FFFFFF`, divider `1px #DFDFE0`. Show Operation Description скрывает/показывает весь вложенный Details/Suspicious-Operation; action-link `#18B037`. |
| Block/Receipt-Info | source-recorded | Нет внешнего белого card: верхние углы status-area `22/26px`, нижние receipt-area `22/26px`, промежуточные `0px`; обе секции `#FFFFFF`, divider `1px #DFDFE0`. |
| Banner/Fiscal-Check-Link | source-recorded | Строки `#FFFFFF`, radius `22/26px`, gap корня `8/12px` без spacer. OFD и ФНС — разные artwork и отдельные `ofd-badge @4x`/`fns-badge @4x`; в каждой строке связанные ячейки используют её URL. |
| Block/Instruction-Steps | source-recorded | Белая content-area, warning `#DE2141`; number/dash columns `22/42px` Mobile и `32/64px` Desktop; disclaimer `12/14px` соответственно. Show Warning/Alert/Disclaimer references записаны. |

Восьми ранее заблокированным component sets обновлены подробные Figma Description; их текст синхронизирован с рабочим Markdown-реестром. У Banner/Fiscal-Check-Link переименованы только четыре вложенных инстанса бейджей OFD/ФНС с сохранением `@4x`. Отдельный read-only re-fetch подтвердил тексты Description и совпадение структурных fingerprint до/после для всех восьми sets.

## Дополнительные наблюдения

- `Details/Transfer` в библиотеке содержит 9 Mobile rows и 10 Desktop rows. Description корректно отдаёт состав полей конкретному инстансу; числа библиотеки не нужно превращать в обязательное количество строк письма.
- У `Asset/Bank-Badge @4x` и `Asset/Icon-Badge @4x` внешняя обводка была бы потеряна прежней моделью source-node. `schemas/components.schema.json` дополнена полями `strokes`, `stroke_weight`, `stroke_align`, а значения взяты непосредственно из Figma. Утверждение о точном размере конечного PNG требует отдельной проверки экспорта; старые `pixel_dimensions` остаются непроверенной HTML/export-проекцией.
- Для 18 компонентов проверены variant IDs и component-property definitions. При последующем исправлении неоднозначностей изменены только 8 Figma Description и 4 разрешённых имени вложенных инстансов. Дизайн, геометрия, Fill, варианты, bindings, маркетинговые contracts и готовые письма не изменялись.

Это evidence layer и подробная машинная запись Figma-фактов. HTML-проекции теперь привязаны к фактическим узлам, но качество конкретного email-rendering и export-assets будет отдельно подтверждаться тестовым письмом; один факт сверки Figma не является доказательством работы во всех почтовых клиентах.
