# Реестр описаний компонентов email-библиотек

Актуальность слепка: 2026-08-20.

Источник: Figma-файл `CD_Email_Шаблоны писем` (`8zka5bHkcrJVK9I9dKjnhC`), страница `30 — Email Components` (`5:6`).

Общие правила формирования и проверки имён находятся в [стандарте нейминга Figma-компонентов](../core/figma-component-naming-standard.md). Реестр не дублирует этот стандарт и фиксирует только фактическое состояние библиотеки.

Этот файл — канонический рабочий слепок описаний, variants и component properties. При проверке уже зафиксированных правил используй его вместо повторного чтения Figma. После изменения Figma-компонента или его Description в той же задаче обновляй соответствующую запись здесь. Реестр не заменяет визуальную проверку, когда меняется дизайн или структура компонента.

## Источники библиотек

- Marketing Emails: `538:17236`
- Service Emails: `538:17235`
- Assets: `1084:34054`
- Deprecated: `1084:34055`
- Icons: `539:38025`

## Маркетинговые письма (26)

### `Badge/Step-Number`

- Figma node: `18:2948`
- Тип: `COMPONENT_SET`
- Варианты (4):

  - `Viewport=Mobile, Style=Neutral` — `18:2942`
  - `Viewport=Mobile, Style=Accent` — `18:2947`
  - `Viewport=Desktop, Style=Accent` — `230:3849`
  - `Viewport=Desktop, Style=Neutral` — `230:3850`

Описание:

````text
Badge/Step-Number

SCOPE
Атомарный живой HTML-элемент. Не экспортировать как изображение.

IMPLEMENTATION
Собрать как inline presentation-table или отдельную table-cell с текстом номера шага. Фон, горизонтальный padding и radius задавать на ячейке. Бейдж не растягивать по ширине родителя.

MOBILE
Padding: 0 8px; radius 19px; текст 14px/140% Regular.

DESKTOP
Padding: 0 8px; radius 19px; текст 16px/140%.

Цвет текста и фона брать из Style конкретного инстанса. Текст остаётся HTML.
````

### `Email/Header`

- Figma node: `326:5159`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `15:2037`
  - `Viewport=Desktop` — `230:3679`

Описание:

````text
Email/Header

SCOPE
Полноширинная строка внутри 600px email-wrapper. Не помещать в общий email-padding.

STRUCTURE
Одна presentation-table на всю ширину: верхний spacer и центрированная ячейка с логотипом.
Отступ перед логотипом: Mobile 16px, Desktop 24px. Дополнительный боковой inset не добавлять.

FIGMA SOURCES
Mobile использует вложенный layout-source “header-logo-compact @4x” размером 212×33px. Desktop использует “header-logo @4x” размером 322×50px. Раздельные Figma sources нужны только для точного отображения вариантов и не означают два файла письма.

EXPORT
Экспортировать только внешний слой “header-logo @4x” из конкретного Desktop-инстанса как PNG @4x. Он уже содержит логотип и защитную подложку #F3F3F5. Вложенный Product Logo и Mobile layout-source отдельно не экспортировать.

В HTML использовать один общий файл и один src:
— Desktop display: 322×50px;
— Mobile display: 212×33px.

Изображение фиксированное и центрированное; не применять width:100%. Не добавлять отдельный dark-mode asset или HTML-подложку.
````

### `Block/Cards-Images`

- Figma node: `326:5806`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `398:7570`
  - `Viewport=Mobile` — `398:7598`

- Component properties:

  - `Show Caption` — `BOOLEAN`, default: true

Описание:

````text
Block/Cards-Images

SCOPE
Обычный контентный блок внутри общего email-padding. Не добавлять второй внешний боковой inset.
Top gap: Mobile 16px, Desktop 24px.

CONTENT AREA
Белая карточка с HTML heading, последовательностью Card/Image и optional block caption.
Mobile: padding 22px, radius 22px, gap между элементами верхнего уровня 22px. Heading 18px/120% SemiBold.
Desktop: padding 32px, radius 26px, gap между элементами верхнего уровня 32px. Heading 26px/120% SemiBold.

CARDS
Свойства Count нет. Рендерить все видимые Card/Image конкретного инстанса в их фактическом порядке; библиотечный пример содержит шесть карточек.

Mobile:
— одна Card/Image в строке;
— ширина карточки 100% внутренней области;
— 252px — контрольная ширина инстанса, не фиксированный HTML-width;
— расстояние между карточками 22px.

Desktop:
— одна Card/Image в строке на всю внутреннюю ширину 488px;
— расстояние между карточками 24px;
— не создавать двухколоночную сетку и equal-height оболочки.

Содержимое карточки реализовать по description Card/Image.

BLOCK CAPTION
Если Show Caption включён, после списка вывести отдельный HTML-текст на всю внутреннюю ширину: Mobile 12px/140% Regular, Desktop 14px/140% Regular, #98999C, слева. Gap от последней карточки: Mobile 22px, Desktop 32px.
````

### `Block/Icon-Cards`

- Figma node: `326:6342`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `398:7759`
  - `Viewport=Mobile` — `398:7953`

- Component properties:

  - `Show Caption` — `BOOLEAN`, default: true

Описание:

````text
Block/Icon-Cards

SCOPE
Обычный контентный блок внутри общего email-padding. Не добавлять второй внешний боковой inset.
Top gap: Mobile 16px, Desktop 24px.

CONTENT AREA
Белая карточка с HTML heading, последовательностью Card/Icon и optional block caption.
Mobile: padding 22px, radius 22px, gap между элементами верхнего уровня 22px. Heading 18px/120% SemiBold.
Desktop: padding 32px, radius 26px, gap между элементами верхнего уровня 32px. Heading 26px/120% SemiBold.

CARDS
Свойства Count нет. Рендерить все видимые Card/Icon конкретного инстанса в их фактическом порядке; библиотечный пример содержит шесть карточек.

Mobile:
— одна Card/Icon в строке;
— ширина карточки 100% внутренней области;
— 252px — контрольная ширина инстанса, не фиксированный HTML-width;
— расстояние между карточками 22px.

Desktop:
— одна Card/Icon в строке на всю внутреннюю ширину 488px;
— расстояние между карточками 24px;
— не создавать двухколоночную сетку, фон карточки или equal-height оболочку.

Содержимое карточки реализовать по description Card/Icon.

BLOCK CAPTION
Если Show Caption включён, после списка вывести отдельный HTML-текст на всю внутреннюю ширину: Mobile 12px/140% Regular, Desktop 14px/140% Regular, #98999C, слева. Gap от последней карточки: Mobile 22px, Desktop 32px.
````

### `Email/Footer`

- Figma node: `333:7477`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `17:2763`
  - `Viewport=Desktop` — `261:4020`

- Component properties:

  - `Show Caption` — `BOOLEAN`, default: false
  - `Show Social Links` — `BOOLEAN`, default: true

Описание:

````text
Email/Footer

SCOPE
Полноширинный footer внутри 600px email-wrapper. Не помещать в общий email-padding.

LAYOUT
Фон footer всегда #F3F3F5, без border, shadow и radius. Фон воспроизводить в HTML; отдельный фоновый asset не создавать.
Отступ перед footer: Mobile 16px, Desktop 24px.

DISCLAIMER
Порядок видимых элементов:
1. Optional block caption.
2. Основной disclaimer paragraph.
3. Текст для ошибочного получателя.
4. Отдельная unsubscribe link.

Mobile: padding 0 16px 16px, gap 8px.
Desktop: padding 0 24px 24px, gap 12px.
Текст: Mobile 12px/140% Regular, Desktop 14px/140% Regular; #98999C, по центру. Ссылки того же цвета и подчёркнуты. Сохранять только смысловые hard breaks.

CAPTION
Boolean-свойство Show Caption, по умолчанию выключено. Если включено, caption становится первым элементом disclaimer-section и использует ту же типографику.

SOCIAL ICONS
Boolean-свойство Show Social Links управляет всей social-section. Если выключено, не выводить секцию и не оставлять её padding или пустой spacer.
Mobile: padding 0 16px 16px; icon 32×32px; gap между видимыми иконками 8px.
Desktop: padding 0 24px 24px; icon 42×42px; gap 12px.
Группа иконок центрирована.

ASSETS
Экспортировать каждый видимый внешний слой вида “*-icon @4x” целиком из конкретного Desktop-инстанса как PNG @4x с прозрачностью. Один src использовать в Mobile и Desktop; display-size задаёт вариант. Скрытые иконки не экспортировать. Не добавлять HTML-подложку.

Каждую иконку оборачивать в ссылку только при наличии утверждённого URL; URL не придумывать.
````

### `Banner/Hero`

- Figma node: `337:4460`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `337:4359`
  - `Viewport=Desktop` — `230:3680`

- Component properties:

  - `Show Body` — `BOOLEAN`, default: true
  - `Show Button` — `BOOLEAN`, default: true

Описание:

````text
Banner/Hero

SCOPE
Обычный контентный блок внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px.

STRUCTURE
Одна карточка-table: image-area → content-area с живыми HTML heading, optional body и optional CTA. Текст поверх изображения не размещается. Radius и clipping задаёт только внешняя карточка.

MOBILE
Image-area занимает 100% доступной ширины; контрольная пропорция 296:190.
Content-area: padding 22px, gap 16px.
Text-content: gap 12px; heading 20px Bold; body 14px/140%.
CTA — instance Button/Primary, Viewport=Mobile, full-width.

DESKTOP
Image-area: контрольный контейнер 552×353px.
Content-area: padding 32px, gap 22px.
Text-content: gap 14px; heading 32px Bold; body 18px/140%.
CTA — instance Button/Primary, Viewport=Desktop, content-width по содержимому.

IMAGE @2x
Из конкретного Desktop-инстанса экспортировать исходный растр из Fill слоя hero-image @2x как один JPEG @2x. Один файл и один src использовать в Mobile и Desktop.

На Mobile img остаётся в обычном потоке, получает width:100%; height:auto и формирует высоту image-area; фиксированный height и HTML-атрибут height запрещены.
На Desktop воспроизвести crop и позицию по Fill выбранного инстанса внутри контейнера 552×353px без искажения.

Не приравнивать img одновременно к width и height контейнера. Не использовать VML, пока в инстансе нет текста поверх изображения.
````

### `Block/Steps`

- Figma node: `337:4491`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `12:1347`
  - `Viewport=Desktop` — `230:3832`

- Component properties:

  - `Show Alert` — `BOOLEAN`, default: true
  - `Show Button` — `BOOLEAN`, default: true
  - `Show Caption` — `BOOLEAN`, default: true
  - `Show Notification` — `BOOLEAN`, default: true

Описание:

````text
Block/Steps

SCOPE
Обычный контентный блок внутри общего email-padding.

CARD
Mobile: top gap 16px, padding 22px, radius 22px, основной gap 16px.
Desktop: top gap 24px, padding 32px, radius 26px, основной gap 24px.

ORDER
1. HTML heading.
2. Таблица Item/Step.
3. Optional Item/Notification.
4. Optional Item/Alert.
5. Optional Button/Secondary.
6. Optional block caption.
Состав определяется Boolean-свойствами конкретного инстанса.

HEADING AND STEPS
Heading: Mobile 18px, Desktop 26px.
Визуальный gap heading→первый шаг: Mobile 22px, Desktop 30px.
Gap между шагами: Mobile 16px, Desktop 24px.

Каждый шаг — отдельная presentation-table строка: живой Badge/Step-Number, spacer, затем HTML heading и optional item caption. Бейдж не экспортировать.
Mobile: badge→text 8px; heading→item caption 4px; heading 14px; item caption 12px.
Desktop: badge→text 12px; heading→item caption 6px; heading 18px; item caption 16px.

NESTED ITEMS
Notification реализовать строго по description Item/Notification.
Alert реализовать строго по description Item/Alert, не как standalone Block/Info-Alert.
Button/Secondary: full-width Mobile, content-width Desktop.
Gap между последующими видимыми элементами верхнего уровня: Mobile 16px, Desktop 24px.

BLOCK CAPTION
Если Show Caption включён, вывести последним отдельный HTML-текст: Mobile 12px/140% Regular, Desktop 14px/140% Regular, #98999C, слева.
````

### `Button/Secondary`

- Figma node: `337:4710`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `337:4576`
  - `Viewport=Desktop` — `337:4699`

Описание:

````text
Button/Secondary

IMPLEMENTATION
Кликабельная email-кнопка: presentation-table → button-cell → &amp;lt;a&amp;gt;. Вся видимая площадь кнопки находится внутри ссылки; таблицу внутрь &amp;lt;a&amp;gt; не помещать.
Full-width или content-width определяется конкретным инстансом и родительским блоком.

MOBILE
Viewport=Mobile. Padding 12px 24px, radius 26px, HTML-текст 14px/140% Medium.

DESKTOP
Viewport=Desktop. Padding 12px 24px, radius 26px, HTML-текст 16px/140% Medium.

Фон #48494A, текст белый. Для белого текста применять предусмотренную основной инструкцией защиту.
````

### `Button/Primary`

- Figma node: `337:4713`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `337:4694`
  - `Viewport=Mobile` — `337:4691`

Описание:

````text
Button/Primary

IMPLEMENTATION
Кликабельная email-кнопка: presentation-table → button-cell → &amp;lt;a&amp;gt;. Вся видимая площадь кнопки находится внутри ссылки; таблицу внутрь &amp;lt;a&amp;gt; не помещать.
Full-width или content-width определяется конкретным инстансом и родительским блоком. Для content-width ширина следует за текстом и padding; минимальную ширину не добавлять, если её не задаёт родитель.

MOBILE
Viewport=Mobile. Padding 12px 24px, radius 32px, HTML-текст 14px/140% Medium.

DESKTOP
Viewport=Desktop. Padding 16px 32px, radius 32px, HTML-текст 16px/140% Medium.

BACKGROUND
Solid fallback green400 #18B037, затем CSS linear-gradient по Fill варианта: green400 #18B037 → green300 #3DD55C; направление примерно 22° Mobile / 25° Desktop.
Не заменять градиент сплошным #00991F.

Текст белый и остаётся HTML. Применять предусмотренную основной инструкцией защиту белого текста.
````

### `Block/Content`

- Figma node: `337:4766`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `11:861`
  - `Viewport=Desktop` — `230:3770`

- Component properties:

  - `Show Button` — `BOOLEAN`, default: true
  - `Show Notification` — `BOOLEAN`, default: true
  - `Show Alert` — `BOOLEAN`, default: true
  - `Show Caption` — `BOOLEAN`, default: true

Описание:

````text
Block/Content

SCOPE
Обычный контентный блок внутри общего email-padding.

CARD
Mobile: top gap 16px, padding 22px, radius 22px, основной gap 16px.
Desktop: top gap 24px, padding 32px, radius 26px, основной gap 24px.

ORDER
1. text-content: heading и видимые body paragraphs.
2. Optional Item/Notification.
3. Optional Item/Alert.
4. Optional Button/Secondary.
5. Optional block caption.
Состав определяется Boolean-свойствами конкретного инстанса.

TEXT
Mobile: heading 18px, body 14px/140%, gap внутри text-content 8px.
Desktop: heading 26px, body 18px/140%, gap внутри text-content 12px.

NESTED ITEMS
Notification реализовать строго по description Item/Notification.
Alert реализовать строго по description Item/Alert, не как standalone Block/Info-Alert.
Button/Secondary: full-width Mobile, content-width Desktop.
Gap между видимыми элементами верхнего уровня: Mobile 16px, Desktop 24px.

BLOCK CAPTION
Если Show Caption включён, вывести последним отдельный HTML-текст на всю внутреннюю ширину: Mobile 12px/140% Regular, Desktop 14px/140% Regular, #98999C, слева.
````

### `Banner/Secondary`

- Figma node: `337:4870`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `11:1218`
  - `Viewport=Desktop` — `337:4844`

- Component properties:

  - `Show Body` — `BOOLEAN`, default: true
  - `Show Button` — `BOOLEAN`, default: true

Описание:

````text
Banner/Secondary

SCOPE
Обычный контентный блок внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px. Mobile и Desktop имеют разные внешние структуры.

CONTENT
Heading, body и optional Button/Secondary остаются HTML. Высота определяется живым контентом; текст не обрезать. Radius и clipping задаёт внешняя карточка.

MOBILE
secondary-image @2x сверху: width:100%; height:auto; без HTML-атрибута height; контрольная пропорция 296:188.
Content-area снизу: padding 22px, gap 16px. Text-content gap 8px; heading 18px, body 14px/140%, по центру. Button/Secondary — full-width.

DESKTOP
Одна строка общей внутренней шириной 552px.
Content-area слева: фиксированная ширина 300px, padding 32px, внутреннее содержимое 236px, gap 24px.
Text-content gap 12px; heading 20px SemiBold, body 16px/140%, по левому краю. Button/Secondary — content-width.
Image-area справа: ширина 252px и высота всей строки.

IMAGE ASSET
Из конкретного Desktop-инстанса экспортировать исходный растр из Fill слоя secondary-image @2x как один JPEG @2x. Один файл и один src использовать в Mobile и Desktop.

На Mobile изображение остаётся обычным пропорциональным img. На Desktop использовать тот же JPEG как background ячейки: background-size:cover; background-repeat:no-repeat; background-position по Fill Desktop-инстанса. При росте текста изображение пропорционально кропается, но не растягивается. Не преобразовывать блок в Hero.
````

### `Block/Bullet-List`

- Figma node: `337:4898`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `222:786`
  - `Viewport=Desktop` — `234:607`

- Component properties:

  - `Show Alert` — `BOOLEAN`, default: true
  - `Show Button` — `BOOLEAN`, default: true
  - `Show Caption` — `BOOLEAN`, default: true

Описание:

````text
Block/Bullet-List

SCOPE
Обычный контентный блок внутри общего email-padding.

CARD
Mobile: top gap 16px, padding 22px, radius 22px, основной gap 16px.
Desktop: top gap 24px, padding 32px, radius 26px, основной gap 24px.

ORDER
1. HTML heading.
2. Таблица видимых Item/Bullet.
3. Optional Item/Alert.
4. Optional Button/Secondary.
5. Optional block caption.
Состав определяется Boolean-свойствами и содержимым конкретного инстанса.

HEADING AND BULLETS
Heading: Mobile 18px, Desktop 26px.
Каждый Item/Bullet — отдельная строка.
Gap между пунктами: Mobile 16px, Desktop 24px; использовать spacer-row, не margin на td.
Дополнительного padding перед контейнером bullets нет. Пункт реализовать по description Item/Bullet; список не растрировать.

NESTED ITEMS
Alert реализовать строго по description Item/Alert, не как standalone Block/Info-Alert.
Button/Secondary: full-width Mobile, content-width Desktop.
Gap от списка и между последующими видимыми элементами верхнего уровня: Mobile 16px, Desktop 24px.

BLOCK CAPTION
Если Show Caption включён, вывести последним отдельный HTML-текст: Mobile 12px/140% Regular, Desktop 14px/140% Regular, #98999C, слева.
````

### `Item/Bullet`

- Figma node: `337:4958`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `222:702`
  - `Viewport=Desktop` — `234:580`

- Component properties:

  - `Show Link` — `BOOLEAN`, default: true

Описание:

````text
Item/Bullet

IMPLEMENTATION
Одна вложенная presentation-table с двумя колонками:
— фиксированная колонка живого зелёного bullet-indicator;
— колонка живого HTML text-content.
Индикатор не экспортировать как изображение и выровнять по первой строке primary text.

GEOMETRY
Mobile: bullet 8×8px; gap bullet→text 8px; локальный gap между строками text-content 4px.
Desktop: bullet 8×8px; gap bullet→text 12px; локальный gap между строками text-content 6px.

TEXT CONTENT
Порядок видимых строк конкретного инстанса:
1. primary text — 14px/140% Mobile, 18px/140% Desktop;
2. supporting-text-01 — 12px/140% Mobile, 16px/140% Desktop;
3. supporting-text-02 — 12px/140% Mobile, 16px/140% Desktop;
4. optional link — живой &amp;amp;lt;a&amp;amp;gt;, 14px/140% Medium Mobile, 16px/140% Medium Desktop, green500.

Не объединять строки и ссылку в изображение. Внешний вертикальный интервал между пунктами задаёт Block/Bullet-List.
````

### `Item/Step`

- Figma node: `337:5039`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `18:2939`
  - `Viewport=Desktop` — `230:3839`

- Component properties:

  - `Show Caption` — `BOOLEAN`, default: true

Описание:

````text
Item/Step

IMPLEMENTATION
Вертикальная вложенная presentation-table:
1. живой Badge/Step-Number;
2. spacer;
3. HTML heading;
4. optional HTML caption.

Mobile: badge→text 8px, heading→caption 4px.
Desktop: badge→text 12px, heading→caption 6px.

Badge не экспортировать как изображение. Внешний интервал между шагами задаёт родительский Block/Steps. Наличие caption и значения Type/Color брать из конкретного инстанса.
````

### `Banner/Inline`

- Figma node: `337:5040`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `13:353`
  - `Viewport=Desktop` — `260:591`

Описание:

````text
Banner/Inline

SCOPE
Обычный контентный блок внутри общего email-padding.

STRUCTURE
Одна кликабельная строка-table: icon-cell → text-cell → chevron-cell. В каждой ячейке отдельный &lt;a&gt; с одинаковым href; таблицу внутрь ссылки не помещать.
Padding и gaps должны находиться внутри кликабельной площади соответствующих ссылок. Текст остаётся HTML.

MOBILE
Top gap 16px; card padding 16px; gap 16px; radius 22px.
Icon 42×42px; chevron 24×24px; text 14px.

DESKTOP
Top gap 24px; card padding 24px; gap 24px; radius 26px.
Icon 48×48px; chevron 24×24px; text 18px.

ASSETS
Экспортировать из конкретного Desktop-инстанса внешний визуальный слой Icon @4x и слой chevron-icon @4x отдельно. Оба — PNG @4x с прозрачностью за пределами собственного визуала.
Использовать один файл/src каждого asset в Mobile и Desktop. Не добавлять HTML-подложку, отсутствующую внутри экспортируемого слоя. Размеры фиксированные; не применять width:100%.
````

### `Block/Info-Alert`

- Figma node: `337:5041`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `16:2738`
  - `Viewport=Desktop` — `260:571`

Описание:

````text
Block/Info-Alert

SCOPE
Самостоятельный контентный блок внутри общего email-padding. Не использовать его для вложенных alert-элементов внутри Block/Steps, Block/Content или Block/Bullet-List: там применяется Item/Alert.

STRUCTURE
Одна presentation-table строка: фиксированная icon-cell слева и живой HTML text-cell справа.

MOBILE
Standalone top gap 16px; padding 16px; gap 12px; radius 22px.
Icon 24×24px; text 14px/140%.

DESKTOP
Standalone top gap 24px; padding 24px; gap 16px; radius 26px.
Icon 26×26px; text 18px/140%.

ASSET
Из конкретного Desktop-инстанса экспортировать внешний слой “alert-icon @4x” отдельно от HTML-фона и текста как PNG @4x с прозрачностью за пределами собственного визуала. Один файл/src использовать в Mobile и Desktop. Не добавлять подложку, если её нет внутри alert-icon @4x; иконка фиксированная, без width:100%.
````

### `Banner/App-Download`

- Figma node: `337:6569`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `15:2586`
  - `Viewport=Desktop` — `260:1494`

Описание:

````text
Banner/App-Download

SCOPE
Обычный контентный блок внутри общего email-padding. Не добавлять второй боковой inset. Mobile и Desktop реализовать отдельными внешними вариантами.

ASSETS
Все assets экспортировать из конкретного Desktop-инстанса письма.
— app-logo @4x: экспортировать внешний визуальный слой без HTML-padding; один PNG/src; display 163×46px Mobile и 219×62px Desktop.
— store-buttons: общий контейнер четырёх кнопок в каждом варианте.
— store icons: экспортировать только вложенные слои rustore-icon @4x, google-play-icon @4x, appgallery-icon @4x и getapps-icon @4x без button-фона, radius, padding и текста; PNG с прозрачностью; один src; display 26×26px Mobile и 32×32px Desktop.
— QR: экспортировать целиком слой qr-code @4x со знаком в центре; display 130×130px; только Desktop.
Не добавлять asset-подложку в HTML, если её нет внутри экспортируемого слоя.

MOBILE
Top gap 16px. Белая карточка: padding 22px, radius 22px, основной gap 16px.
Порядок:
1. app logo 163×46px;
2. HTML description 14px/140%;
3. четыре store buttons вертикально на всю внутреннюю ширину.

Store buttons: width 100%, height 44px, vertical gap 8px, radius 24px. Каждая кнопка — отдельная ссылка на всю площадь.
Внутри: icon 26×26px → gap 8px → живой HTML-текст 14px/140% Medium; вся группа центрируется внутри кнопки.
RuStore: синий фон и белый текст. GooglePlay, AppGallery и GetApps: #F8F8FA и тёмный текст.
Не собирать кнопки в сетку 2×2.

DESKTOP
Top gap 24px. Белая карточка: padding 32px, radius 26px, основной gap 24px.
Верхняя строка: слева вертикальная группа app logo 219×62px и HTML description 18px/140% с gap 16px; справа QR 130×130px; gap между колонками 24px.
Нижняя строка: четыре icon-only ссылки 116×56px, gap 8px, radius 50px. Иконки 32×32px центрированы. RuStore — синий фон, остальные — #F8F8FA. Видимого текста нет; alt содержит название магазина.

Href каждой кнопки брать из данных конкретного письма.
````

### `Email/Footer-Legal`

- Figma node: `499:2431`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `499:2430`
  - `Viewport=Desktop` — `499:2429`

Описание:

````text
Email/Footer-Legal

SCOPE
Полноширинный footer внутри 600px email-wrapper. Не помещать в общий email-padding. Использовать только когда этот компонент выбран в конкретном инстансе письма; тип письма сам по себе не заменяет выбранный footer.

LAYOUT
Фон #F3F3F5, без border, shadow и radius.
Отступ перед footer: Mobile 16px, Desktop 24px.

CONTENT
Mobile: внутренний padding 0 16px 16px, gap между текстовыми блоками 8px.
Desktop: padding 0 24px 24px, gap 12px.

Текст: Roboto/Arial; Mobile 12px/140% Regular, Desktop 14px/140% Regular; #98999C, по центру. Содержимое брать из конкретного инстанса. Сохранять смысловые hard breaks, но не превращать автоматический перенос Figma в &lt;br&gt;.

Не добавлять social-section, иконки или ссылки, которых нет в выбранном инстансе. Тёмный фон вокруг библиотечного компонента является только презентационным.
````

### `Asset/Card-Image @2x`

- Figma node: `911:3992`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Style=Numbered` — `911:3991`
  - `Style=Plain` — `911:3990`

Описание:

````text
Asset/Card-Image @2x

SCOPE
Атомарный составной DIRECT IMAGE внутри Card/Image. HTML-текст карточки в asset не входит.

VARIANTS
Image: только изображение.
Numbered Image: изображение вместе с видимым слоем Number. Номер является частью итогового JPEG; не верстать его живым HTML и не экспортировать отдельным файлом.

EXPORT BOUNDARY
Из конкретного Desktop-инстанса письма экспортировать весь видимый слой “Asset/Card-Image @2x” после применения варианта и overrides, включая все вложенные графические элементы. Не извлекать только исходный Fill и не отделять Number.

Применять контракт @2x DIRECT IMAGE основной инструкции. Использовать один JPEG и один src для Mobile и Desktop.

PROPORTIONS AND RADIUS
Asset остаётся прямоугольным в пропорции 232:148. Скругление 14px Mobile / 18px Desktop задаёт clipping-контейнер Card/Image в HTML; не запекать скругление или matte-подложку в JPEG.
````

### `Card/Image`

- Figma node: `911:4132`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `911:4131`
  - `Viewport=Mobile` — `911:4130`

Описание:

````text
Card/Image

STRUCTURE
Самостоятельная карточка без общего HTML-фона: Asset/Card-Image @2x, затем живые HTML heading, description и link. Слои текста: heading, description, link.

MOBILE
Вертикальная структура на 100% ширины родителя.
Image: width:100%; height:auto; без HTML-атрибута height; контрольная пропорция 232:148; radius 14px.
Gap image→text-content 16px. Внутри text-content gap 8px.
Heading 16px, description 14px/140%, link 14px/140%.

DESKTOP
Одна presentation-table строка: image-cell 232×148px, spacer-cell 24px, text-cell 232px; text-cell выровнена по верхнему краю.
Image radius 18px. Внутри text-content gap 6px.
Heading 20px, description 16px/140%, link 16px/140%.

ASSET
Из конкретного Desktop-инстанса экспортировать исходный растр из Fill слоя Asset/Card-Image @2x как один JPEG @2x. Один файл и один src использовать в Mobile и Desktop.

На Mobile изменение ширины изображения обязано пропорционально менять его высоту. Не задавать фиксированную высоту, не использовать cover и не растягивать изображение одновременно по двум осям.
````

### `Block/Icon-List`

- Figma node: `946:26516`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `946:26515`
  - `Viewport=Mobile` — `946:26514`

- Component properties:

  - `Show Button` — `BOOLEAN`, default: true
  - `Show Caption` — `BOOLEAN`, default: true

Описание:

````text
Block/Icon-List

SCOPE
Обычный контентный блок внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px.

STRUCTURE
Белая карточка: HTML heading → таблица видимых Row/Icon → optional Button/Secondary → optional block caption. Рендерить строки конкретного инстанса в их фактическом порядке.

MOBILE
Card: padding 22px, radius 22px, основной gap 22px.
Heading 18px.
Rows: вертикально, gap 22px.
Row/Icon: icon 42×42px → gap 16px → HTML text-content. Локальный text gap 4px; основной текст 14px/140%; optional supporting text 12px/140%.
Optional Button/Secondary — full-width.

DESKTOP
Card: padding 32px, radius 26px, основной gap 32px.
Heading 26px.
Rows: вертикально, gap 24px.
Row/Icon: icon 56×56px → gap 24px → HTML text-content. Локальный text gap 6px; основной текст 18px/140%; optional supporting text 16px/140%.
Optional Button/Secondary — content-width.

ICON ASSET
Каждую Asset/Feature-Icon @4x экспортировать целиком из конкретного Desktop-инстанса как PNG @4x с прозрачностью за пределами собственного визуала. Фон и glyph внутри asset входят в один файл. Один src использовать в Mobile и Desktop; display-size задаёт вариант. Не добавлять HTML-подложку и не применять width:100%.

BLOCK CAPTION
Если Show Caption включён, вывести отдельный HTML-текст на всю внутреннюю ширину: Mobile 12px/140% Regular, Desktop 14px/140% Regular, #98999C, слева. Gap от предыдущего видимого элемента: Mobile 22px, Desktop 32px.
````

### `Card/Icon`

- Figma node: `326:5580`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `11:1020`
  - `Viewport=Desktop` — `260:662`

- Component properties:

  - `Show Description` — `BOOLEAN`, default: true

Описание:

````text
Card/Icon

STRUCTURE
Карточка без общего HTML-фона: фиксированная Asset/Feature-Icon @4x и text-content с живыми HTML heading, optional description и link.
Boolean-свойство Show Description управляет только description; heading и link сохраняются.

MOBILE
Вертикальная структура на 100% ширины родителя, содержимое центрировано.
Icon 52×52px. Gap icon→text-content 16px. Внутри text-content gap 8px.
Heading 16px, description 14px/140%, link 14px/140%.

DESKTOP
Одна presentation-table строка: icon-cell 72×72px, spacer-cell 24px, text-cell шириной 392px; обе ячейки выровнены по верхнему краю.
Внутри text-content gap 12px.
Heading 20px, description 16px/140%, link 16px/140%.

ASSET
Asset/Feature-Icon @4x экспортировать целиком из конкретного Desktop-инстанса как PNG @4x с прозрачностью за пределами собственного визуала. Один файл/src использовать в Mobile и Desktop. Не добавлять HTML-подложку и не применять width:100% к иконке.
````

### `Asset/Feature-Icon @4x`

- Figma node: `946:25769`
- Тип: `COMPONENT`

Описание:

````text
Asset/Feature-Icon @4x

ASSET ROLE
Атомарный составной visual asset для карточек и строк с иконками.

EXPORT
Из конкретного Desktop-инстанса письма экспортировать внешний слой Asset/Feature-Icon @4x целиком, включая собственный круглый фон и glyph.
Формат PNG @4x с прозрачностью за пределами собственного визуала. Не экспортировать glyph отдельно, не добавлять HTML-подложку и не запекать дополнительный фон.

USAGE
Использовать один файл и один src в Mobile и Desktop. Display-size задаёт родительский компонент. Иконка остаётся фиксированной и не получает width:100%.
````

### `Item/Alert`

- Figma node: `1024:19226`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `1024:19224`
  - `Viewport=Desktop` — `1024:19225`

Описание:

````text
Item/Alert

SCOPE
Внутренний элемент для Block/Steps, Block/Content и Block/Bullet-List. Собственного внешнего top gap не имеет; расстояние задаёт родительский блок. Не заменять standalone-компонентом Block/Info-Alert.

STRUCTURE
Одна presentation-table строка: фиксированная icon-cell слева и живой HTML text-cell справа. Фон #F8F8FA.

MOBILE
Width 100% внутренней области; padding 16px; gap 12px; radius 14px.
Icon 24×24px; text 12px/140%.

DESKTOP
Width 100% внутренней области; padding 24px; gap 16px; radius 18px.
Icon 26×26px; text 16px/140%.

ASSET
Из конкретного Desktop-инстанса экспортировать внешний слой “alert-icon @4x” целиком как PNG @4x с прозрачностью за пределами собственного визуала. Один файл/src использовать в Mobile и Desktop. Не экспортировать текст и фон; не добавлять HTML-подложку. Иконка фиксированная, без width:100%.
````

### `Item/Notification`

- Figma node: `1024:19285`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `1024:19283`
  - `Viewport=Desktop` — `1024:19284`

Описание:

````text
Item/Notification

SCOPE
Внутренний элемент для Block/Steps и Block/Content. Собственного внешнего top gap не имеет; расстояние задаёт родительский блок.

STRUCTURE
Одна presentation-table строка: живой HTML text-cell слева и фиксированная icon-cell справа. Фон #F8F8FA. Ячейки выровнены по вертикальному центру.

MOBILE
Width 100% внутренней области; padding 16px; gap 16px; radius 14px.
Text 12px/140%; Asset/Feature-Icon @4x 42×42px.

DESKTOP
Width 100% внутренней области; padding 24px; gap 20px; radius 18px.
Text 16px/140%; Asset/Feature-Icon @4x 48×48px.

ASSET
Экспортировать Asset/Feature-Icon @4x целиком из конкретного Desktop-инстанса как PNG @4x с прозрачностью за пределами собственного визуала. Один файл/src использовать в Mobile и Desktop. Не экспортировать текст и фон; не добавлять HTML-подложку; не применять width:100% к иконке.
````

### `NPS/Options`

- Figma node: `1084:16995`
- Тип: `COMPONENT_SET`
- Варианты (4):

  - `Viewport=Mobile, Count=3` — `15:599`
  - `Viewport=Desktop, Count=3` — `260:3974`
  - `Viewport=Mobile, Count=2` — `260:1346`
  - `Viewport=Desktop, Count=2` — `260:3976`

Описание:

````text
NPS/Options

SCOPE
Self-inset компонент: отдельная полноширинная строка email-wrapper со своими боковыми inset. Не помещать внутрь общего email-padding.
Outer inset: Mobile 16px сверху и по бокам; Desktop 24px.

VARIANTS
Viewport=Mobile | Desktop.
Count=2 | 3 определяет число видимых вариантов оценки. Не добавлять и не скрывать кнопки независимо от Count.

CARD
Mobile: width 100% оставшегося пространства, контрольная ширина 296px, padding 22px, radius 22px, gap heading→buttons 16px.
Desktop: width 552px, padding 32px, radius 26px, gap heading→buttons 24px.
Heading остаётся HTML и выровнен по центру: Mobile 18px, Desktop 26px. Высота карточки определяется контентом.

MOBILE BUTTONS
Кнопки идут вертикально. Каждая занимает 100% внутренней ширины, height 44px; spacer-row между соседними кнопками 8px.
Иконка 32×32px и центрирована внутри linked button-cell.

DESKTOP BUTTONS
Кнопки идут в одной строке и поровну делят доступную ширину. Между соседними button-cells обязательна spacer-cell 12px.
Каждая кнопка height 54px; иконка 42×42px и центрирована. Фиксированные ширины отдельных кнопок не задавать.

Каждая оценка — отдельная ссылка на всю площадь кнопки. Фон и radius задавать на linked button-cell. Для каждой иконки использовать один Desktop-source и один src в обоих Viewport. Href брать из данных письма.
````

## Шаблоны сборки (2)

### `Template · Marketing · Mobile`

- Figma node: `1084:33308`
- Тип: `FRAME`

Назначение: обычный assembly frame для подстановки компонентов соответствующего Viewport. Не является компонентом и не создаёт собственного HTML-контракта.

### `Template · Marketing · Desktop`

- Figma node: `1084:33312`
- Тип: `FRAME`

Назначение: обычный assembly frame для подстановки компонентов соответствующего Viewport. Не является компонентом и не создаёт собственного HTML-контракта.

## Сервисные письма (18)

### `Block/Transaction-Success`

- Figma node: `459:29177`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `459:29175`
  - `Viewport=Mobile` — `459:29176`

- Component properties:

  - `Show Limit Alert` — `BOOLEAN`, default: true
  - `Show Description` — `BOOLEAN`, default: true

Описание:

````text
Block/Transaction-Success

SCOPE
Обычный контентный блок внутри общего email-padding. Внешний top gap: Mobile 16px, Desktop 24px.

CARD
Единая белая карточка с radius 22px Mobile / 26px Desktop. Она состоит из summary-area и details-area, между которыми находится ровно один divider 1px #DFDFE0.

SECTION 1 — HEADER
Mobile: padding 22px, gap 16px.
Desktop: padding 32px, gap 24px.

Partner row:
— Desktop: горизонтально [partner-badge @4x 72×72] → gap 24px → text-details → live status badge; все элементы выровнены по вертикальному центру;
— Mobile: вертикальный стек по центру [partner-badge @4x → text-details → status], gap 16px.

Partner name, amount и optional description остаются HTML. Описание показывать только при включённом свойстве Show Description.

SECTION 2 — DETAILS
Mobile: padding 22px, gap 16px.
Desktop: padding 32px, gap 24px.

Сначала Details/Operation, затем optional limit-alert (свойство Show Limit Alert). Внутри Details/Operation нет divider между строками; единственный divider компонента разделяет две основные секции.

ASSETS
Asset/Partner-Badge @4x экспортировать целиком из соответствующего слоя конкретного Desktop-инстанса. Использовать один src и display 72×72 в обоих вариантах. Status — живой HTML по Badge/Operation-Status.
````

### `Block/Transaction-Error`

- Figma node: `459:30151`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `459:29443`
  - `Viewport=Mobile` — `459:30150`

Описание:

````text
Block/Transaction-Error

SCOPE
Обычный контентный блок внутри общего email-padding. Внешний top gap: Mobile 16px, Desktop 24px.

CARD
Единая белая карточка radius 22px Mobile / 26px Desktop. summary-area и body-area разделены одним divider 1px #DFDFE0.

SECTION 1 — HEADER
Mobile: padding 22px, gap 16px.
Desktop: padding 32px, gap 24px.

Partner row:
— Desktop: горизонтально [partner-badge @4x 72×72] → gap 24px → text-details → error status; вертикальное выравнивание по центру;
— Mobile: вертикальный центрированный стек с gap 16px.

Partner name, amount и status остаются HTML, кроме графического partner-badge @4x.

SECTION 2 — BODY
Несколько HTML-параграфов в порядке конкретного инстанса.
Mobile: padding 22px, основной gap 16px, body 14px.
Desktop: padding 32px, основной gap 24px, body 16px.

Не добавлять divider между абзацами. Status реализовать живым Badge/Operation-Status с State=Error.
````

### `Block/Contact-Support`

- Figma node: `472:16999`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `472:16997`
  - `Viewport=Mobile` — `472:16998`

Описание:

````text
Block/Contact-Support

SCOPE
Обычный контентный блок внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px.

CARD
Белая content-area:
— Mobile: padding 22px, radius 22px, gap 16px;
— Desktop: padding 32px, radius 26px, gap 24px.
Всё содержимое центрировано.

ORDER
1. phone-cta: HTML heading → spacer 12px → кликабельный номер телефона.
2. help-notice: серый вложенный блок с HTML-текстом и ссылкой раздела помощи.

PHONE
Ссылка tel:+74951222088; видимый текст +7 (495) 122-20-88.
Mobile: heading 16px, phone 18px.
Desktop: heading 18px, phone 22px.

HELP NOTICE
Mobile: padding 16px, radius из инстанса.
Desktop: padding 24px.
Текст 12px, ссылка зелёная. Help URL брать из данных письма; не заменять автоматически ссылкой главной страницы.
````

### `Asset/Bank-Badge @4x`

- Figma node: `481:19664`
- Тип: `COMPONENT`

Описание:

````text
Asset/Bank-Badge @4x

Атомарный графический asset банковского бейджа. Мастер имеет размер 72×72px, но не задаёт универсальный HTML display-размер.

Экспортировать внешний визуальный badge целиком из соответствующего слоя конкретного Desktop-инстанса письма, включая круглый фон/рамку. Не экспортировать вложенный логотип отдельно и не добавлять HTML-padding внутрь изображения.

Display-размер определяет родительский layout-компонент. Использовать один общий src для Mobile и Desktop.
````

### `Asset/Partner-Badge @4x`

- Figma node: `481:19665`
- Тип: `COMPONENT`

Описание:

````text
Asset/Partner-Badge @4x

Атомарный графический asset партнёрского бейджа. Мастер имеет размер 72×72px, но не задаёт универсальный HTML display-размер.

Экспортировать внешний визуальный badge целиком из соответствующего слоя конкретного Desktop-инстанса письма, включая круглый фон и логотип. Не экспортировать вложенный логотип отдельно.

Display-размер определяет родительский layout-компонент. В Block/Transaction-Success и Block/Transaction-Error он равен 72×72px в обеих версиях. Использовать один общий src.
````

### `Asset/Icon-Badge @4x`

- Figma node: `484:20039`
- Тип: `COMPONENT`

Описание:

````text
Asset/Icon-Badge @4x

Универсальный атомарный графический badge. Мастер имеет размер 72×72px, но не задаёт универсальный HTML display-размер.

Экспортировать внешний визуальный badge целиком из соответствующего слоя конкретного Desktop-инстанса письма, включая круглый фон/рамку и внутреннюю иконку. Не добавлять HTML-padding внутрь изображения.

Display-размер определяет родительский layout-компонент. Использовать один общий src для Mobile и Desktop.
````

### `Details/Transfer`

- Figma node: `484:20761`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `484:20760`
  - `Viewport=Desktop` — `477:21326`

Описание:

````text
Details/Transfer

SCOPE
Вложенная таблица реквизитов перевода/возврата. Не добавляет внешний card, padding или section divider.

ROWS
Каждое видимое поле — отдельная presentation-table. Между полями нет линий.

Desktop:
— общий вертикальный gap между rows 16px;
— label-cell 200px слева;
— value-cell занимает остаток и выравнивается вправо;
— текст 16px/140%, Regular;
— label #98999C, value #000000.

Mobile:
— общий gap между rows 12px;
— внутри row label расположен над value с gap 4px;
— обе строки выровнены влево;
— текст 14px/140%, Regular.

Состав, порядок и текст полей брать из конкретного инстанса. Для Mobile допускается одна responsive-разметка со stacking td, поскольку порядок не меняется. Не добавлять divider и не делать values жирными.
````

### `Asset/Status-Badge-Positive @4x`

- Figma node: `491:22074`
- Тип: `COMPONENT`

Описание:

````text
Asset/Status-Badge-Positive @4x

Атомарная положительная status-иконка. Мастер имеет размер 72×72px.

Экспортировать внешний badge целиком из конкретного Desktop-инстанса, включая градиентный круг и белую иконку. Не экспортировать внутренний vector отдельно и не воспроизводить фон в HTML.

Display-размер определяет родительский компонент; в Block/Receipt-Info используется 72×72px. Один общий src для Mobile и Desktop.
````

### `Asset/Status-Badge-Negative @4x`

- Figma node: `491:22178`
- Тип: `COMPONENT`

Описание:

````text
Asset/Status-Badge-Negative @4x

Атомарная отрицательная status-иконка. Мастер имеет размер 72×72px.

Экспортировать внешний badge целиком из конкретного Desktop-инстанса, включая градиентный круг и белую иконку. Не экспортировать внутренний vector отдельно и не воспроизводить фон в HTML.

Display-размер определяет родительский компонент. Один общий src для Mobile и Desktop.
````

### `Details/Suspicious-Operation`

- Figma node: `497:25955`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `497:25953`
  - `Viewport=Mobile` — `497:25954`

Описание:

````text
Details/Suspicious-Operation

SCOPE
Вложенный notice-блок с заголовком и Details/Operation-Plain. Не добавляет внешний email-padding.

CONTAINER
Фон #F8F8FA.
Desktop: padding 24px, основной gap 24px, ширина по родителю.
Mobile: padding 16px, основной gap 16px.
Radius брать из соответствующего вложенного блока инстанса.

ORDER
1. HTML heading красного цвета.
2. Details/Operation-Plain.

Внутри таблицы реквизитов нет divider. Desktop строки горизонтальные с gap 16px; Mobile label/value stacked с внутренним gap 4px и gap между строками 12px. Состав полей определяет конкретный инстанс.
````

### `Block/Personal-Data-Update`

- Figma node: `497:26055`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `491:22454`
  - `Viewport=Mobile` — `497:26054`

- Component properties:

  - `Show Alert` — `BOOLEAN`, default: true
  - `Show Disclaimer` — `BOOLEAN`, default: true
  - `Show Operation Description` — `BOOLEAN`, default: true

Описание:

````text
Block/Personal-Data-Update

SCOPE
Обычный контентный блок, а не полный шаблон письма. Размещается внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px.

CARD
Единая белая карточка radius 22px Mobile / 26px Desktop. status-area и body-area разделены ровно одним divider 1px #DFDFE0.

HEADER SECTION
Mobile: padding 22px; вертикальный центрированный header [status icon 72×72 → heading], gap 16px.
Desktop: padding 32px; горизонтальный header [status icon 72×72 → heading], gap 24px, вертикальное выравнивание по центру.

BODY SECTION
Mobile: padding 22px, основной gap 16px, text-content gap 8px.
Desktop: padding 32px, основной gap 24px, text-content gap 12px.

Порядок:
1. HTML text-content внутри body-area конкретного инстанса.
2. Details/Suspicious-Operation.
3. alert.
4. legal disclaimer.

Alert и disclaimer выводить только при включённых свойствах Show Alert и Show Disclaimer. Status icon экспортировать целиком из конкретного Desktop-инстанса и использовать одним src. Не добавлять divider внутри Details или между обычными абзацами.
````

### `Details/Operation-Plain`

- Figma node: `497:26103`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `497:26102`
  - `Viewport=Desktop` — `497:26101`

Описание:

````text
Details/Operation-Plain

SCOPE
Вложенная таблица label/value без собственного заголовка, фона, padding и section divider.

Desktop:
— rows расположены вертикально с gap 16px;
— label-cell 200px слева;
— value-cell занимает остаток и выравнивается вправо;
— 16px/140% Regular;
— label #98999C, value #000000.

Mobile:
— rows с gap 12px;
— label расположен над value с внутренним gap 4px;
— обе строки слева;
— 14px/140% Regular.

Между полями нет линий. Values не делать жирными. Состав и порядок полей брать из конкретного инстанса.
````

### `Details/Receipt`

- Figma node: `502:24640`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `502:24638`
  - `Viewport=Mobile` — `502:24639`

Описание:

````text
Details/Receipt

SCOPE
Вложенная таблица реквизитов чека. Не добавляет внешний card, padding или section divider.

Desktop:
— rows с вертикальным gap 16px;
— label-cell 200px;
— value-cell занимает остаток и выравнивается вправо;
— 16px/140% Regular;
— label #98999C, value #000000.

Mobile:
— rows с gap 12px;
— внутри row label над value, gap 4px;
— обе строки слева;
— 14px/140% Regular.

Между строками нет divider. Values не делать жирными. Состав, порядок и значения полей брать из конкретного инстанса.
````

### `Block/Receipt-Info`

- Figma node: `502:24695`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `502:24693`
  - `Viewport=Mobile` — `502:24694`

Описание:

````text
Block/Receipt-Info

SCOPE
Обычный контентный блок внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px.

CARD
Белые status-area и receipt-area, разделённые одним divider 1px #DFDFE0. Внешний radius 22px Mobile / 26px Desktop.

HEADER SECTION
Mobile: padding 22px; вертикальный центрированный стек [status-badge-positive @4x 72×72 → HTML heading], gap 16px.
Desktop: padding 32px; горизонтальная строка [badge 72×72 → heading], gap 24px, вертикальное выравнивание по центру.

DETAILS SECTION
Mobile: padding 22px; Details/Receipt с gap строк 12px и stacked label/value.
Desktop: padding 32px; Details/Receipt с gap строк 16px и горизонтальными label/value.

Внутри Details/Receipt нет divider. Status icon экспортировать внешним badge целиком из конкретного Desktop-инстанса и использовать одним src.
````

### `Banner/Fiscal-Check-Link`

- Figma node: `502:25048`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `502:25046`
  - `Viewport=Mobile` — `502:25047`

Описание:

````text
Banner/Fiscal-Check-Link

SCOPE
Обычный контентный блок внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px.

STRUCTURE
Две отдельные белые кликабельные строки, между ними spacer:
— Mobile gap 8px;
— Desktop gap 12px.

Каждая строка — presentation-table: logo-cell → text-cell → chevron-cell. В каждой ячейке находится отдельный &lt;a&gt; с одинаковым URL соответствующей строки. Таблицу внутрь ссылки не помещать. Padding/gap размещать внутри linked cells, чтобы видимая площадь строки была кликабельной.

Mobile:
— row padding 16px, gap 16px;
— logo 48×48, chevron 24×24;
— text 14px;
— высота строки определяется текстом конкретного инстанса.

Desktop:
— row padding 24px, gap 24px;
— logo 48×48, chevron 24×24;
— text 18px.

Экспортировать фактические Desktop logo layers OFD/FNS и chevron без HTML-контейнеров. Один src для каждой иконки. URL OFD и ФНС брать из данных письма; не придумывать.
````

### `Block/Instruction-Steps`

- Figma node: `510:16701`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Mobile` — `510:16700`
  - `Viewport=Desktop` — `510:16699`

- Component properties:

  - `Show Alert` — `BOOLEAN`, default: true
  - `Show Disclaimer` — `BOOLEAN`, default: true
  - `Show Warning` — `BOOLEAN`, default: true

Описание:

````text
Block/Instruction-Steps

SCOPE
Обычный контентный блок внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px.

CARD
Mobile: padding 22px, radius 22px, основной gap 16px.
Desktop: padding 32px, radius 26px, основной gap 24px.

ORDER
1. Optional warning heading.
2. Intro paragraphs и кастомный numbered-list.
3. Optional alert.
4. Optional disclaimer.
Видимость определяется свойствами конкретного инстанса.

WARNING HEADING
Mobile: icon 20px, gap 4px, red text 14px.
Desktop: icon 24px, gap 6px, red text 18px.
Иконка — отдельный фиксированный asset.

NUMBERED LIST
Не использовать браузерный &lt;ol&gt;. Каждый пункт — собственная таблица:
— number-cell 22px;
— gap до основного текста 12px;
— sub-item использует marker-cell 42px и символ “—”;
— текст остаётся HTML.

Mobile: основной текст 14px/140%, общий text gap 8px, gap внутри list-item 4px.
Desktop: 18px/140%, общий text gap 12px, gap внутри list-item 6px.

ALERT
Фон #FFF1C9, текст #AA7100.
Mobile: padding 16px, radius 14px.
Desktop: padding 24px, radius 18px.
Телефон и email внутри текста делать отдельными ссылками.

DISCLAIMER
Текст 12px/140%, #98999C. Divider добавлять только если он видим в конкретном инстансе; в текущих библиотечных вариантах divider скрыт.
````

### `Details/Operation`

- Figma node: `477:21327`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Viewport=Desktop` — `477:21325`
  - `Viewport=Mobile` — `484:20068`

Описание:

````text
Details/Operation

SCOPE
Вложенная таблица реквизитов операции. Не добавляет внешний card, padding или section divider.

Desktop:
— rows расположены вертикально с gap 16px;
— label-cell 200px слева;
— value-cell занимает остаток и выравнивается вправо;
— текст 16px/140%, Regular;
— label #98999C, value #000000.

Mobile:
— rows с gap 12px;
— внутри каждого row label расположен над value с gap 4px;
— обе строки выровнены влево;
— текст 14px/140%, Regular.

Одна responsive-структура допустима: порядок полей не меняется, на Mobile td складываются вертикально. Между rows нет divider. Values не делать жирными. Состав и порядок брать из конкретного инстанса.
````

### `Badge/Operation-Status`

- Figma node: `1084:16996`
- Тип: `COMPONENT_SET`
- Варианты (6):

  - `Viewport=Mobile, State=Pending` — `459:29367`
  - `Viewport=Mobile, State=Success` — `459:29369`
  - `Viewport=Mobile, State=Error` — `459:29371`
  - `Viewport=Desktop, State=Pending` — `466:13290`
  - `Viewport=Desktop, State=Success` — `466:13292`
  - `Viewport=Desktop, State=Error` — `466:13294`

Описание:

````text
Badge/Operation-Status

SCOPE
Атомарный живой HTML-status. Не экспортировать как изображение и не растягивать по ширине.

VARIANTS
Viewport=Mobile | Desktop.
State=Pending | Success | Error.

IMPLEMENTATION
Inline-table или compact table-cell: padding 4px 12px, radius 63px, nowrap.
Mobile: текст 12px/140% Regular.
Desktop: текст 16px/140% Regular.

STATE
Pending: “В обработке”, background #FAE6AF, text #8C5D00.
Success: “Успешно”, background #B0FCC0, text #00991F.
Error: “Отклонено”, background #FFC7C8, text #CC2944.

Расположение и alignment внутри родительского блока определяет description родительского компонента.
````

## Общие assets (3)

### `Asset/Product-Logo`

- Figma node: `1008:874`
- Тип: `COMPONENT_SET`
- Варианты (3):

  - `Product=CUPIS` — `1008:871`
  - `Product=Card` — `1008:872`
  - `Product=Wallet` — `1008:873`

Описание:

````text
Asset/Product-Logo

ROLE
Внутренний набор векторных логотипов Product=CUPIS | Card | Wallet для сборки производных assets. Сам по себе не задаёт export boundary письма.

USAGE
Использовать как вложенный источник внутри семантического asset owner. Не экспортировать отдельно, если родительский component description требует внешний составной asset.
````

### `Asset/Header-Logo @4x`

- Figma node: `1008:1476`
- Тип: `COMPONENT_SET`
- Варианты (3):

  - `Product=CUPIS` — `1008:1473`
  - `Product=Card` — `1008:1474`
  - `Product=Wallet` — `1008:1475`

Описание:

````text
Asset/Header-Logo @4x

ASSET ROLE
Канонический общий Header asset для Product=CUPIS | Card | Wallet. Внешний компонент содержит логотип и защитную подложку #F3F3F5.

EXPORT
Экспортировать внешний слой header-logo @4x целиком из конкретного Desktop-инстанса как PNG @4x. Не экспортировать вложенный Product Logo отдельно и не добавлять HTML-подложку.

USAGE
Один файл и один src для Mobile и Desktop. Display-size определяет Email/Header: 322×50px Desktop и 212×33px Mobile.
````

### `Asset/Header-Logo-Compact @4x`

- Figma node: `1008:1708`
- Тип: `COMPONENT_SET`
- Варианты (3):

  - `Product=CUPIS` — `1008:1686`
  - `Product=Card` — `1008:1687`
  - `Product=Wallet` — `1008:1688`

Описание:

````text
Asset/Header-Logo-Compact @4x

ROLE
Вспомогательный Figma layout-source для точного отображения Mobile-варианта Email/Header в размере 212×33px.

EXPORT
Отдельно не экспортировать и не создавать для него Mobile-файл. Канонический файл письма экспортируется из Desktop-слоя header-logo @4x компонента Asset/Header-Logo @4x.

USAGE
Использовать только внутри Viewport=Mobile компонента Email/Header.
````

## Deprecated (0)

## Иконки

Компоненты раздела `Icons` используют namespace `Icon` по общему стандарту. Они служат вложенными векторными glyphs и не получают отдельные записи Description, пока у конкретной иконки не появляется самостоятельный email-контракт.
