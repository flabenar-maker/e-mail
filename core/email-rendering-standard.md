# Стандарт HTML-рендеринга писем

Единственная ответственность этого файла — общие принципы HTML-рендеринга.

Этот документ объясняет, как превращать уже разрешённый контракт письма в устойчивый HTML. Он не хранит точные размеры, значения токенов, факты конкретных компонентов или порядок этапов сборки.

## Источники истины

- Точные общие параметры рендеринга находятся в `data/foundations/rendering.yaml` и проверяются его схемой.
- Точная структура, геометрия и различия между версиями находятся в разрешённых контрактах компонентов.
- Точные значения типографики, отступов и ассетов приходят из соответствующих структурированных foundation-файлов.
- Порядок действий при сборке письма определяет workflow, а не этот стандарт.

Если источники расходятся, нельзя выбирать значение по смыслу или по памяти. Сборка останавливается до разрешения расхождения в источнике-владельце.

## Принципы

- HTML письма строится из совместимых с почтовыми клиентами примитивов; критичные для отображения свойства должны быть доступны клиенту без выполнения скриптов.
- Мобильная и десктопная версии разрешаются как самостоятельные фактические контракты. Различия между ними не выводятся автоматически.
- Структура HTML следует семантике разрешённого дерева: текст остаётся текстом, ссылка — ссылкой, вложенный компонент — вложенным компонентом, а слот — точкой сборки.
- На Mobile внешний контейнер блока занимает доступную ширину слота письма, даже если его исходный Auto Layout в Figma имеет `hug`. Это правило действует и при отдельном рендере блока, и после вложения в шаблон; внутренние `hug`-элементы оно не растягивает.
- Точные ширины, высоты, отступы, выравнивания и правила видимости берутся только из разрешённого контракта и foundation-значений.
- Адаптивное растровое изображение не деформируется: изменение ширины сопровождается автоматическим пересчётом высоты с сохранением исходных пропорций.
- Изображение, которое должно заполнять область с кадрированием, реализуется через отдельный контейнер и режим отображения из asset-контракта. Это правило нельзя переносить на обычное адаптивное изображение.
- Текстовые области растут по содержимому, если точный контракт не требует другого поведения. Переносы строк не подменяются ручными разрывами без явного факта.
- `reference-size.width` текстового узла — опорная ширина в Figma, а не автоматический верхний предел. На Mobile `horizontal-sizing: fill` заполняет доступную ширину непосредственного родителя. `layout-align: stretch` растягивает текст по ширине только при вертикальной оси родителя (поперечная ось Figma), а `layout-grow > 0` — только при горизонтальной оси (основная ось Figma). В других сочетаниях эти факты сами по себе не задают ширину текста. Высота текстовой области следует за переносами, а `text-align` действует внутри фактически выделенной ширины.
- Способ определения ширины текста зависит от фактов контракта и оси родительского контейнера, а не от названия компонента или библиотеки.
- Доступность, резервные шрифты и клиентские защитные приёмы применяются по разрешённой политике, не меняя визуальный контракт.
- Защита от тёмной темы или особенностей почтового клиента не должна добавлять фон, рамку либо другую графику, отсутствующую в разрешённом дизайне или asset-контракте.

## Граница ответственности

Этот файл не:

- перечисляет конкретные компоненты и их варианты;
- задаёт точные токены, размеры, цвета или точки переключения;
- определяет профиль экспорта изображения;
- хранит готовые HTML-шаблоны;
- описывает файловую структуру конкретного письма, проверки и итоговый ответ пользователю.

Такие данные принадлежат структурированным источникам, компонентным контрактам, renderer-слою и workflow сборки.

## Delivery intake and output policy

For an Altcraft release, inspect both design instances into a logical model before exporting images. Run `node scripts/prepare-email-delivery.mjs --model <draft.json> --output <new-intake-folder>` and give the user its Russian `form.html`. The local form saves `delivery.json`; it does not send data. Inherit sender and reply settings unless the user explicitly supplies them.

Delivery values belong to the separate strict delivery schema. `data/delivery/profiles.yaml` owns fixed addresses, exact element selectors, and emission/package policy. Component contracts, the design model schema, and Figma remain unchanged. Recompute the visible action inventory and reject stale source SHA, profile version, or inventory digest. Required Footer/support/NPS addresses must be supplied before image export and final release.

Render with `--delivery <delivery.json>` for an Altcraft release. Validate the original design model against source evidence; validate and project only the exact inventoried URL targets into a clone for emission. An address assignment never authorizes changes to text, geometry, assets, or neighboring actions. Legacy rendering without a delivery document remains a design HTML operation; it is not an Altcraft release.

Installing or restoring context uses the manifest-selected email workflow, which includes intake and readiness steps. Do not copy URLs, service macros, or serializer recipes into skill Markdown. Real import, sending, and mail-client acceptance require external evidence and remain `not-run` after local verification.
