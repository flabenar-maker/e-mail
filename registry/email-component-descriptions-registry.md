# Реестр описаний компонентов email-библиотек

Актуальность слепка: 2026-08-18.

Источник: Figma-файл `CD_Email_Шаблоны писем` (`8zka5bHkcrJVK9I9dKjnhC`).

Этот файл — локальный рабочий слепок описаний компонентов. При проверке уже зафиксированных правил используй его вместо повторного чтения Figma. После любого изменения описания компонента в Figma в той же задаче обновляй соответствующую запись здесь. Реестр фиксирует описания и состав вариантов, но не заменяет визуальную проверку Figma, когда меняется сам дизайн или структура компонента.

## Источники библиотек

- Marketing Emails: `538:17236`
- Service Emails: `538:17235`

## Маркетинговые письма (25)

### `Badge/Step-Number`

- Figma node: `18:2948`
- Тип: `COMPONENT_SET`
- Варианты (4):

  - `Type=Mobile, Color=Grey` — `18:2942`
  - `Type=Mobile, Color=Green` — `18:2947`
  - `Type=Desktop, Color=Green` — `230:3849`
  - `Type=Desktop, Color=Grey` — `230:3850`

Описание:

````text
Badge/Step-Number

SCOPE
Атомарный живой HTML-элемент. Не экспортировать как изображение.

IMPLEMENTATION
Собрать как inline presentation-table или отдельную table-cell с текстом номера шага. Фон, padding и radius задавать на ячейке. Бейдж не растягивать по ширине родителя.

MOBILE
Padding 8px; radius 19px; текст 12px.

DESKTOP
Padding 8px; radius 19px; текст 16px.

Цвет текста и фона брать из Color конкретного инстанса. Текст остаётся HTML.
````

### `Email/Header`

- Figma node: `326:5159`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `15:2037`
  - `Type=Desktop` — `230:3679`

Описание:

````text
Email/Header

SCOPE
Полноширинная строка внутри 600px email-wrapper. Не помещать в общий email-padding.

STRUCTURE
Одна presentation-table на всю ширину: верхний spacer и центрированная ячейка с логотипом.

SPACING
Внешний отступ перед логотипом: Mobile 16px, Desktop 24px. Боковой email-padding не добавлять.

ASSET
Экспортировать из конкретного Desktop-инстанса внешний слой “logo @4x” целиком. Он уже содержит логотип и защитную подложку #F3F3F5. Вложенный cupis-logo отдельно не экспортировать и подложку в HTML не воспроизводить.

Использовать один общий src:
— Desktop display: 322×50px;
— Mobile display: 212×33px.

Изображение фиксированное, центрированное, не width:100%. Не добавлять отдельный dark-mode asset и не включать в экспорт тёмный презентационный фон вокруг компонента.
````

### `Block/Cards-Images`

- Figma node: `326:5806`
- Тип: `COMPONENT_SET`
- Варианты (8):

  - `Type=Mobile, Count=4` — `326:5807`
  - `Type=Desktop, Count=4` — `326:5814`
  - `Type=Desktop, Count=2` — `398:7570`
  - `Type=Mobile, Count=2` — `398:7598`
  - `Type=Desktop, Count=3` — `398:7625`
  - `Type=Mobile, Count=3` — `398:7653`
  - `Type=Desktop, Count=6` — `398:7680`
  - `Type=Mobile, Count=6` — `398:7720`

Описание:

````text
Block/Cards-Images

SCOPE
Обычный контентный блок внутри общего email-padding. Не добавлять второй внешний боковой inset.
Top gap: Mobile 16px, Desktop 24px. Боковые 16px/24px уже обеспечивает общий email-padding.

CONTENT AREA
Белый контейнер с центрированным HTML heading.
Mobile: padding 22px, radius 22px, основной gap 22px.
Desktop: padding 32px, radius 26px, основной gap 32px.

RESPONSIVE STRUCTURE
Использовать две полные presentation-table сетки: Mobile и Desktop. Классы переключения размещать только на внешних wrapper этих таблиц.

Mobile:
— одна Card в каждой строке;
— карточка занимает 100% доступной внутренней ширины;
— 252px — контрольная ширина библиотечного инстанса, а не фиксированный HTML-width;
— между карточками отдельная spacer-row 22px.

Desktop:
— внутренняя ширина сетки 488px;
— две колонки Card по 232px;
— горизонтальный gap 24px отдельной spacer-cell;
— вертикальный gap 24px отдельной spacer-row;
— card-cells выравнивать по верхнему краю;
— не добавлять общий фон карточки и не растягивать соседние карточки до одинаковой высоты.

COUNT
2: один ряд из двух.
3: два в первом ряду, третья слева во втором.
4: два ряда по две.
6: три ряда по две.

CARD
Содержимое каждой карточки реализовать по description Card. Изображение каждой карточки является одним DIRECT IMAGE по description Card Image @2x.

BLOCK CAPTION
Boolean-свойство Caption, по умолчанию включено. Если оно включено, после сетки вывести отдельный HTML-текст на всю внутреннюю ширину: 12px/140% Regular, #98999C, выравнивание влево. Gap grid→caption: Mobile 22px, Desktop 32px.
````

### `Block/Cards-Icons`

- Figma node: `326:6342`
- Тип: `COMPONENT_SET`
- Варианты (6):

  - `Type=Mobile, Count=4` — `326:6343`
  - `Type=Desktop, Count=4` — `326:6349`
  - `Type=Desktop, Count=2` — `398:7759`
  - `Type=Mobile, Count=2` — `398:7795`
  - `Type=Desktop, Count=6` — `398:7901`
  - `Type=Mobile, Count=6` — `398:7953`

Описание:

````text
Block/Cards-Icons

SCOPE
Обычный контентный блок внутри общего email-padding. Не добавлять второй внешний боковой inset.
Top gap: Mobile 16px, Desktop 24px.

CONTENT AREA
Белый контейнер с центрированным HTML heading.
Mobile: padding 22px, radius 22px, основной gap 22px.
Desktop: padding 32px, radius 26px, основной gap 32px.

RESPONSIVE STRUCTURE
Использовать две полные presentation-table сетки: Mobile и Desktop. Переключение видимости размещать только на внешних wrapper этих таблиц.

Mobile:
— одна Card/Icon в строке;
— карточка занимает 100% внутренней ширины;
— 252px — контрольная ширина инстанса, не фиксированный HTML-width;
— между карточками spacer-row 22px.

Desktop:
— внутренняя ширина сетки 488px;
— две колонки Card/Icon по 232px;
— горизонтальный spacer-cell 24px;
— вертикальный spacer-row 24px;
— card-cells выровнены по верхнему краю;
— не добавлять фон, radius или equal-height оболочку карточки.

COUNT
2: один ряд из двух.
4: два ряда по две.
6: три ряда по две.

CARD
Содержимое и фиксированный размер иконки реализовать по description Card/Icon. Иконку не растягивать по ширине карточки.

BLOCK CAPTION
Boolean-свойство Caption. Если включено, после сетки вывести отдельный HTML-текст на всю внутреннюю ширину: 12px/140% Regular, #98999C, слева.
Gap grid→caption: Mobile 22px, Desktop 32px.
````

### `Card/Icon`

- Figma node: `326:5580`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `11:1020`
  - `Type=Desktop` — `260:662`

Описание:

````text
Card/Icon

SCOPE
Вложенная контентная карточка для Block/Cards-Icons. Ширину задаёт родительская сетка; собственный внешний top gap не добавлять.

STRUCTURE
1. Фиксированная иконка.
2. HTML text-content: optional heading, затем optional description.

У карточки нет собственного фона, padding, border или radius. Высота определяется видимым контентом; соседние карточки не растягивать до одинаковой высоты. Всё содержимое центрировано.

MOBILE
Иконка 64×64px. Gap icon→text 8px. Внутри text-content gap 8px.
Heading 16px/120% Medium, description 14px/140% Regular.

DESKTOP
Иконка 72×72px. Gap icon→text 12px. Внутри text-content gap 12px.
Heading 20px/120% Medium, description 16px/140% Regular.

ICON ASSET
Из конкретного Desktop-инстанса письма экспортировать внешний визуальный слой “Icon @4x” целиком, включая видимый круглый фон и glyph. Не экспортировать glyph отдельно и не добавлять фон в HTML.
Использовать один PNG и один src: display 64×64px Mobile / 72×72px Desktop. Иконка фиксированная; не применять width:100%.

Видимость heading и description брать из свойств конкретного инстанса.
````

### `Icon @4x`

- Figma node: `946:25769`
- Тип: `COMPONENT`

Описание:

````text
Icon @4x

ASSET ROLE
Атомарный составной visual asset для карточек и строк с иконками.

EXPORT
Из конкретного Desktop-инстанса письма экспортировать внешний слой Icon @4x целиком, включая собственный круглый фон и glyph.
Формат PNG @4x с прозрачностью за пределами собственного визуала. Не экспортировать glyph отдельно, не добавлять HTML-подложку и не запекать дополнительный фон.

USAGE
Использовать один файл и один src в Mobile и Desktop. Display-size задаёт родительский компонент. Иконка остаётся фиксированной и не получает width:100%.
````

### `NPS/3-Options`

- Figma node: `326:6583`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `15:599`
  - `Type=Desktop` — `260:3974`

Описание:

````text
NPS/3-Options

SCOPE
Self-inset компонент: отдельная полноширинная строка email-wrapper со своими боковыми inset. Не помещать внутрь общего email-padding.
Outer inset: Mobile 16px сверху и по бокам; Desktop 24px.

CARD
Mobile: width 100% оставшегося пространства, контрольная ширина 296px, padding 22px, radius 22px, gap heading→buttons 16px.
Desktop: width 552px, padding 32px, radius 26px, gap heading→buttons 24px.
Heading — живой HTML, по центру; Mobile 18px, Desktop 22px. Высота карточки определяется контентом.

MOBILE BUTTONS
Три кнопки расположить вертикально. Каждая занимает 100% внутренней ширины, height 44px; между кнопками spacer-row 8px.
Иконка фиксированная 32×32px и центрируется внутри linked button-cell. Не создавать горизонтальную строку из трёх кнопок.

DESKTOP BUTTONS
Три кнопки расположить в одной строке. Button-cells поровну делят пространство, оставшееся после двух обязательных spacer-cells по 12px.
Каждая кнопка height 54px; иконка 42×42px, центрирована. Не задавать старые фиксированные ширины кнопок.

Каждая оценка — отдельная ссылка на всю площадь кнопки. Фон и radius задавать на linked button-cell. Использовать один Desktop-source и один src для каждой иконки в обоих вариантах. Href брать из данных письма.
````

### `NPS/2-Options`

- Figma node: `333:7458`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `260:1346`
  - `Type=Desktop` — `260:3976`

Описание:

````text
NPS/2-Options

SCOPE
Self-inset компонент: отдельная полноширинная строка email-wrapper со своими боковыми inset. Не помещать внутрь общего email-padding.
Outer inset: Mobile 16px сверху и по бокам; Desktop 24px.

CARD
Mobile: width 100% оставшегося пространства, контрольная ширина 296px, padding 22px, radius 22px, gap heading→buttons 16px.
Desktop: width 552px, padding 32px, radius 26px, gap heading→buttons 24px.
Heading — живой HTML, по центру; Mobile 18px, Desktop 22px. Высота карточки определяется контентом.

MOBILE BUTTONS
Две кнопки расположить вертикально. Каждая занимает 100% внутренней ширины, height 44px; между кнопками spacer-row 8px.
Иконка фиксированная 32×32px и центрируется внутри linked button-cell. Не создавать горизонтальную строку из двух кнопок.

DESKTOP BUTTONS
Две кнопки расположить в одной строке. Button-cells поровну делят пространство, оставшееся после обязательной spacer-cell 12px.
Каждая кнопка height 54px; иконка 42×42px, центрирована. Не задавать старые фиксированные ширины кнопок.

Каждая оценка — отдельная ссылка на всю площадь кнопки. Фон и radius задавать на linked button-cell. Использовать один Desktop-source и один src для каждой иконки в обоих вариантах. Href брать из данных письма.
````

### `Email/Footer`

- Figma node: `333:7477`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `17:2763`
  - `Type=Desktop` — `261:4020`

Описание:

````text
Email/Footer

SCOPE
Полноширинный footer внутри 600px email-wrapper. Не помещать в общий email-padding.

LAYOUT
Фон всего footer #F3F3F5, без border, shadow и radius.
Отступ перед footer: Mobile 16px, Desktop 24px.

DISCLAIMER
Порядок:
1. Optional block caption.
2. Первый disclaimer paragraph.
3. Второй disclaimer paragraph.

Mobile: padding 0 16px 16px, gap между видимыми текстовыми элементами 8px.
Desktop: padding 0 24px 24px, gap 12px.
Текст 12px/140%, Regular, #98999C, по центру. Ссылки того же цвета и подчёркнуты. Сохранять только смысловые hard breaks исходного текста.

BLOCK CAPTION
Boolean-свойство Caption, по умолчанию выключено. Если оно включено, вывести отдельный HTML-текст первым элементом disclaimer-section. Типографика и alignment совпадают с disclaimer; gap до следующего абзаца 8px Mobile / 12px Desktop.

SOCIAL
Mobile: padding 0 16px 16px; VK 32×32px.
Desktop: padding 0 24px 24px; VK 42×42px.
Иконка центрирована.

ASSET
Экспортировать из конкретного Desktop-инстанса внешний слой “vk-icon @4x” 42×42 целиком и использовать один src во всех вариантах. Не экспортировать скрытые социальные иконки. Display-размер задавать по варианту, без width:100%.

VK оборачивать в ссылку только при наличии утверждённого VK URL. URL не придумывать.
````

### `Banner/Hero`

- Figma node: `337:4460`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `337:4359`
  - `Type=Desktop` — `230:3680`

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
Content-area: padding 22px, основной gap 16px.
Text-content: gap 12px; heading 20px Bold; body 16px/140%.
CTA — full-width, если видима.

DESKTOP
Image-area: контрольный контейнер 552×353px.
Content-area: padding 32px, основной gap 22px.
Text-content: gap 14px; heading 32px Bold; body 18px/140%.
CTA — content-width с контрольной минимальной шириной 230px, если видима.

IMAGE @2x
Из конкретного Desktop-инстанса письма экспортировать исходный растр из Fill слоя hero-image @2x. Один JPEG и один src использовать в Mobile и Desktop. Не экспортировать image-area целиком.

На Mobile пропорциональный img остаётся в обычном потоке, получает width:100%; height:auto и формирует высоту image-area. Не задавать фиксированный height или HTML-атрибут height.
На Desktop воспроизвести crop и позицию по Fill выбранного инстанса внутри контейнера 552×353px без искажения исходного изображения.

Не приравнивать img одновременно к width и height контейнера. Не использовать VML, пока в инстансе нет текста поверх изображения.
````

### `Block/Steps`

- Figma node: `337:4491`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `12:1347`
  - `Type=Desktop` — `230:3832`

Описание:

````text
Block/Steps

SCOPE
Обычный контентный блок внутри общего email-padding.

CARD
Mobile: top gap 16px, padding 22px, radius 22px, основной gap 16px.
Desktop: top gap 24px, padding 32px, radius 26px, основной gap 24px.

STRUCTURE
Вертикальная presentation-table:
1. HTML heading.
2. Таблица списка шагов.
3. Optional Alert/Info.
4. Optional Button/Secondary.
5. Optional block caption.

Показывать optional элементы только по свойствам конкретного инстанса.

STEPS
Каждый шаг — отдельная таблица: живой Badge/Step-Number, spacer, затем HTML heading и optional item caption. Бейдж не экспортировать как изображение.

Mobile:
— gap между шагами 16px;
— badge→text 8px;
— heading→item caption 4px;
— heading 14px, item caption 12px.

Desktop:
— gap между шагами 24px;
— badge→text 12px;
— heading→item caption 6px;
— heading 18px, item caption 16px.

Порядок шагов одинаков, поэтому допускается одна семантическая таблица с responsive-размерами; не дублировать содержимое без необходимости.

BLOCK CAPTION
Boolean-свойство Caption, по умолчанию включено. Это отдельное примечание всего блока после optional Button/Secondary, а не caption отдельного шага.
HTML-текст на всю внутреннюю ширину: 12px/140% Regular, #98999C, выравнивание влево. Gap от предыдущего видимого элемента: Mobile 16px, Desktop 24px.
````

### `Button/Secondary`

- Figma node: `337:4710`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `337:4576`
  - `Type=Desktop` — `337:4699`

Описание:

````text
Button/Secondary

IMPLEMENTATION
Кликабельная email-кнопка из presentation-table → button-cell → &lt;a&gt;. Не использовать фиксированную ширину как свойство компонента: full-width или content-width определяется конкретным инстансом и родительским блоком.

Mobile и Desktop: внутренний padding 12px 24px. Фон #48494A, текст белый, radius из варианта. Вся видимая площадь кнопки должна находиться внутри ссылки.

Текст остаётся HTML. Для белого текста применять предусмотренный общей инструкцией класс защиты. Не помещать таблицу внутрь &lt;a&gt;.
````

### `Button/Primary`

- Figma node: `337:4713`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `337:4694`
  - `Type=Desktop` — `337:4691`

Описание:

````text
Button/Primary

IMPLEMENTATION
Кликабельная email-кнопка: presentation-table → button-cell → &lt;a&gt;. Вся видимая площадь кнопки находится внутри ссылки. Таблицу внутрь &lt;a&gt; не помещать.
Full-width или content-width определяется конкретным инстансом и родительским блоком; не фиксировать ширину на уровне компонента.

Mobile: padding 16px 32px, radius 32px, HTML-текст 14px.
Desktop: padding 12px 24px, radius 32px, HTML-текст 16px; контрольная минимальная ширина content-width кнопки 230px.

BACKGROUND
Задать solid fallback green400 (#18B037), затем CSS linear-gradient по Fill выбранного варианта: green400 (#18B037) → green300 (#3DD55C), направление примерно 22° Mobile / 25° Desktop.
Не заменять градиент сплошным #00991F.

Текст белый и остаётся HTML. Применять предусмотренную основной инструкцией защиту белого текста.
````

### `Block/Content`

- Figma node: `337:4766`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `11:861`
  - `Type=Desktop` — `230:3770`

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
2. optional Notification.
3. optional Alert/Info-style notice.
4. optional Button/Secondary.
5. optional block caption.

Показывать и располагать элементы строго по свойствам конкретного инстанса.

TEXT
Mobile: heading 18px, body 14px, text gap 8px.
Desktop: heading 22px, body 18px, text gap 12px.

NOTIFICATION
Серый вложенный блок: HTML-текст слева и фиксированная иконка справа.
Mobile: padding 16px, gap 16px, radius 14px, icon 42px.
Desktop: padding 24px, gap 20px, radius 18px, icon 48px.

ALERT
Иконка слева, HTML-текст справа.
Mobile: padding 16px, gap 12px, icon 24px.
Desktop: padding 24px, gap 16px, icon 26px.

Иконки экспортировать без HTML-фона и использовать как фиксированные изображения.

BLOCK CAPTION
Boolean-свойство Caption, по умолчанию включено. Если оно включено, после optional Button/Secondary вывести отдельный HTML-текст на всю внутреннюю ширину: 12px/140% Regular, #98999C, выравнивание влево. Gap от предыдущего видимого элемента: Mobile 16px, Desktop 24px.
````

### `Banner/Secondary`

- Figma node: `337:4870`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `11:1218`
  - `Type=Desktop` — `337:4844`

Описание:

````text
Banner/Secondary

SCOPE
Обычный контентный блок внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px. Использовать отдельные внешние Mobile и Desktop варианты.

CONTENT
Heading, body и optional Button/Secondary остаются HTML. Radius и clipping задаёт внешняя карточка. Высота карточки определяется живым контентом; текст не обрезать и не скрывать.

IMAGE ASSET
Из конкретного Desktop-инстанса письма экспортировать исходный растр из Fill слоя Image @2x. Один JPEG и один src использовать в Mobile и Desktop. Не экспортировать весь image-area и не создавать отдельный Mobile-asset.

MOBILE
Image-area расположен сверху и занимает 100% доступной ширины. Контрольная пропорция 296:188.
Пропорциональный img остаётся в обычном потоке, получает width:100%; height:auto и формирует высоту image-area. Не задавать фиксированный height или HTML-атрибут height.
Content-area расположен снизу: padding 22px, gap 16px; heading/body по центру; кнопка по ширине контента.

DESKTOP
Одна строка: content-area слева и image-area справа.
Content-area: общая ширина 312px с padding 32px, внутренний gap 24px.
Image-area: колонка 240px, равная высоте строки.

Desktop image-area реализовать как background ячейки: background-image из того же JPEG, background-size:cover, background-repeat:no-repeat, background-position по Fill Desktop-инстанса. При росте текста строка и image-area растут, изображение пропорционально кропается без растяжения.

Не использовать для Desktop прямой img с width и height, одновременно приравненными к контейнеру. Не преобразовывать блок в Hero.
````

### `Block/Bullet-List`

- Figma node: `337:4898`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `222:786`
  - `Type=Desktop` — `234:607`

Описание:

````text
Block/Bullet-List

SCOPE
Обычный контентный блок внутри общего email-padding.

STRUCTURE
Вертикальная presentation-table:
1. HTML heading.
2. Таблица видимых List-Item/Bullet.
3. Optional Alert/Info.
4. Optional Button/Secondary.
5. Optional block caption.
Состав определяется свойствами и содержимым конкретного инстанса.

CARD
Mobile: top gap 16px, padding 22px, radius 22px, основной gap 16px.
Desktop: top gap 24px, padding 32px, radius 26px, основной gap 24px.

BULLETS
Каждый List-Item/Bullet — отдельная строка. Между пунктами использовать spacer-row 16px в обоих вариантах, не margin на td.
Отдельного дополнительного padding перед таблицей Bullets нет.
Внутреннее содержимое пункта реализовать по description List-Item/Bullet. Не объединять список в изображение.

BLOCK CAPTION
Boolean-свойство Caption. Если включено, после предыдущего видимого элемента вывести отдельный HTML-текст на всю внутреннюю ширину: 12px/140% Regular, #98999C, слева.
Gap до caption: Mobile 16px, Desktop 24px.
````

### `List-Item/Bullet`

- Figma node: `337:4958`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `222:702`
  - `Type=Desktop` — `234:580`

Описание:

````text
List-Item/Bullet

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
2. supporting text 1 — 12px/140% Mobile, 16px/140% Desktop;
3. supporting text 2 — 12px/140% Mobile, 16px/140% Desktop;
4. optional link — живой &lt;a&gt;, 14px/140% Medium Mobile, 16px/140% Medium Desktop, green500.

Не объединять строки и ссылку в изображение. Внешний вертикальный интервал между пунктами задаёт Block/Bullet-List.
````

### `List-Item/Step`

- Figma node: `337:5039`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `18:2939`
  - `Type=Desktop` — `230:3839`

Описание:

````text
List-Item/Step

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

  - `Type=Mobile` — `13:353`
  - `Type=Desktop` — `260:591`

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

### `Alert/Info`

- Figma node: `337:5041`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `16:2738`
  - `Type=Desktop` — `260:571`

Описание:

````text
Alert/Info

SCOPE
Обычный контентный блок внутри общего email-padding. При вложении в другой компонент внешний top gap задаёт родитель.

STRUCTURE
Одна presentation-table строка: фиксированная icon-cell слева и живой HTML text-cell справа.

MOBILE
Standalone top gap 16px; padding 16px; gap 12px; radius 22px.
Icon 24×24px; text 14px.

DESKTOP
Standalone top gap 24px; padding 24px; gap 16px; radius 26px.
Icon 26×26px; text 18px.

ASSET
Из конкретного Desktop-инстанса экспортировать внешний визуальный слой Icon @4x отдельно от HTML-фона и текста. PNG @4x с прозрачностью за пределами собственного визуала; один файл/src для Mobile и Desktop.
Не добавлять подложку, если её нет внутри Icon @4x. Размер иконки фиксированный; не применять width:100%. Текст не растрировать.
````

### `Banner/App-Download`

- Figma node: `337:6569`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `15:2586`
  - `Type=Desktop` — `260:1494`

Описание:

````text
Banner/App-Download

SCOPE
Обычный контентный блок внутри общего email-padding. Не добавлять второй боковой inset. Mobile и Desktop реализовать отдельными внешними вариантами.

ASSETS
Все assets экспортировать из конкретного Desktop-инстанса письма.
— app-logo @4x: экспортировать внешний визуальный слой без HTML-padding; один PNG/src; display 163×46px Mobile и 219×62px Desktop.
— store icons @4x: экспортировать только вложенную видимую иконку без фона, radius, padding и текста; PNG с прозрачностью; один src; display 26×26px Mobile и 32×32px Desktop.
— QR: экспортировать целиком Desktop QR Block со знаком в центре; display 130×130px; только Desktop.
Не добавлять asset-подложку в HTML, если её нет внутри экспортируемого слоя.

MOBILE
Top gap 16px. Белая карточка: padding 22px, radius 22px, основной gap 16px.
Порядок:
1. app logo 163×46px;
2. HTML description 14px/140%;
3. четыре store buttons вертикально на всю внутреннюю ширину.

Store buttons: width 100%, height 44px, vertical gap 8px, radius 24px. Каждая кнопка — отдельная ссылка на всю площадь.
Внутри: icon 26×26px → gap 8px → живой HTML-текст; вся группа центрируется внутри кнопки.
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

  - `Type=Mobile` — `499:2430`
  - `Type=Desktop` — `499:2429`

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

Текст: Roboto/Arial, 12px/140%, Regular, #98999C, по центру. Содержимое брать из конкретного инстанса. Сохранять смысловые hard breaks, но не превращать автоматический перенос Figma в &lt;br&gt;.

Не добавлять social-section, иконки или ссылки, которых нет в выбранном инстансе. Тёмный фон вокруг библиотечного компонента является только презентационным.
````

### `Card Image @2x`

- Figma node: `911:3992`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Numbered Image` — `911:3991`
  - `Type=Image` — `911:3990`

Описание:

````text
Card Image @2x

SCOPE
Атомарный составной DIRECT IMAGE внутри Card. HTML-текст карточки в asset не входит.

VARIANTS
Image: только изображение.
Numbered Image: изображение вместе с видимым слоем Number. Номер является частью итогового JPEG; не верстать его живым HTML и не экспортировать отдельным файлом.

EXPORT BOUNDARY
Из конкретного Desktop-инстанса письма экспортировать весь видимый слой “Card Image @2x” после применения варианта и overrides, включая все вложенные графические элементы. Не извлекать только исходный Fill и не отделять Number.

Применять контракт @2x DIRECT IMAGE основной инструкции. Использовать один JPEG и один src для Mobile и Desktop.

PROPORTIONS AND RADIUS
Asset остаётся прямоугольным в пропорции 232:148. Скругление 14px Mobile / 18px Desktop задаёт clipping-контейнер Card в HTML; не запекать скругление или matte-подложку в JPEG.
````

### `Card`

- Figma node: `911:4132`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Desktop` — `911:4131`
  - `Type=Mobile` — `911:4130`

Описание:

````text
Card

SCOPE
Вложенная контентная карточка для Block/Cards-Images. Не добавляет внешний top gap.

STRUCTURE
1. Card Image @2x как один DIRECT IMAGE.
2. HTML text-content: heading, затем body.

У карточки нет собственного фона, общего padding, border или radius. Скругляется только clipping-контейнер изображения. Высота определяется контентом; соседние карточки не растягивать до одинаковой высоты.

MOBILE
Карточка занимает 100% доступной ширины родительской Mobile-сетки; 252px — контрольная ширина библиотечного инстанса, а не фиксированный HTML-width.
Изображение занимает ширину карточки и сохраняет пропорцию 232:148 через width:100%; height:auto. Radius изображения 14px.
Gap image→text 8px. Внутри text-content gap 8px. Heading 16px/120% Medium, body 14px/140% Regular, выравнивание влево.

DESKTOP
Ширина карточки 232px. Изображение 232×148px, radius 18px.
Gap image→text 12px. Внутри text-content gap 12px. Heading 20px/120% Medium, body 16px/140% Regular, выравнивание влево.

ASSET
Экспорт и состав изображения выполнять по description Card Image @2x. Один src использовать в обоих вариантах.
````

### `Block/Icons`

- Figma node: `946:26516`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Desktop` — `946:26515`
  - `Type=Mobile` — `946:26514`

Описание:

````text
Block/Icons

SCOPE
Обычный контентный блок внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px.

STRUCTURE
Белая карточка: HTML heading → таблица Row/Icon → optional Button/Secondary → optional block caption.
Сейчас компонент содержит шесть строк; не добавлять и не удалять строки относительно конкретного инстанса.

MOBILE
Card: padding 22px, radius 22px, основной gap 16px.
Heading 18px.
Rows: вертикально, gap 16px.
Row/Icon: icon 42×42px → gap 8px → HTML text-content. Локальный text gap 4px; основной текст 14px/140%; optional supporting text 12px/140%.
Optional Button/Secondary: full-width, контрольный размер 252×44px.

DESKTOP
Card: padding 32px, radius 26px, основной gap 24px.
Heading 22px.
Rows: вертикально, gap 24px.
Row/Icon: icon 56×56px → gap 12px → HTML text-content. Локальный text gap 6px; основной текст 18px/140%; optional supporting text 16px/140%.
Optional Button/Secondary: content-width, контрольный размер 230×46px.

ICON ASSET
Каждую Icon @4x экспортировать целиком из конкретного Desktop-инстанса письма как PNG @4x с прозрачностью за пределами собственного визуала. Фон и glyph внутри Icon @4x входят в один asset. Не экспортировать glyph отдельно и не добавлять HTML-подложку. Один src использовать в Mobile и Desktop; display-size задаёт выбранный вариант, иконку не растягивать через width:100%.

BLOCK CAPTION
Boolean-свойство Caption. Если включено, вывести отдельный HTML-текст на всю внутреннюю ширину: 12px/140% Regular, #98999C, слева. Gap от предыдущего видимого элемента: Mobile 16px, Desktop 24px.
````

## Шаблоны сборки (1)

### `Email/Template`

- Figma node: `326:6034`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `262:1302`
  - `Type=Desktop` — `264:2763`

Описание:

````text
Email/Template

ROLE
Не является семантическим email-компонентом и не имеет собственного HTML-контракта. Это демонстрационный assembly template: заполненный пример порядка и сочетания настоящих компонентов письма.

USAGE
Не реализовывать, не экспортировать и не добавлять в письмо сам узел Email/Template.
При работе с конкретным письмом использовать только видимые дочерние инстансы его Mobile/Desktop-примера, сверяя каждый из них с description соответствующего компонента.

Slot-контейнеры служат только для организации примера и не создают дополнительные HTML-обёртки, padding или gaps. Не переносить состав, свойства или видимость между Mobile и Desktop автоматически.
````

## Сервисные письма (19)

### `Block/Transaction-Success`

- Figma node: `459:29177`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Desktop` — `459:29175`
  - `Type=Mobile` — `459:29176`

Описание:

````text
Block/Transaction-Success

SCOPE
Обычный контентный блок внутри общего email-padding. Внешний top gap: Mobile 16px, Desktop 24px.

CARD
Единая белая карточка с radius 22px Mobile / 26px Desktop. Она состоит из двух content-area, между которыми находится ровно один divider 1px #DFDFE0.

SECTION 1 — HEADER
Mobile: padding 22px, gap 16px.
Desktop: padding 32px, gap 24px.

Partner row:
— Desktop: горизонтально [Badge/Partner 72×72] → gap 24px → text-details → live status badge; все элементы выровнены по вертикальному центру;
— Mobile: вертикальный стек по центру [Badge/Partner → text-details → status], gap 16px.

Partner name, amount и optional description остаются HTML. Description показывать только когда свойство инстанса включено.

SECTION 2 — DETAILS
Mobile: padding 22px, gap 16px.
Desktop: padding 32px, gap 24px.

Сначала Details/Operation, затем optional limit-attention. Внутри Details/Operation нет divider между строками; единственный divider компонента разделяет две основные секции.

ASSETS
Badge/Partner экспортировать целиком из соответствующего слоя конкретного Desktop-инстанса. Использовать один src и display 72×72 в обоих вариантах. Status — живой HTML по Badge/Operation-Status.
````

### `Badge/Operation-Status-Mobile`

- Figma node: `459:29366`
- Тип: `COMPONENT_SET`
- Варианты (3):

  - `status=wait` — `459:29367`
  - `status=done` — `459:29369`
  - `status=error` — `459:29371`

Описание:

````text
Badge/Operation-Status-Mobile

SCOPE
Атомарный живой HTML-status. Не экспортировать как изображение и не растягивать по ширине.

IMPLEMENTATION
Inline-table или compact table-cell: padding 4px 12px, radius 63px, текст 12px/140% Regular, nowrap.

VARIANTS
wait: “В обработке”, background #FAE6AF, text #8C5D00.
done: “Успешно”, background #B0FCC0, text #00991F.
error: “Отклонено”, background #FFC7C8, text #CC2944.

Расположение и alignment внутри родительского блока определяет родительский component description.
````

### `Block/Transaction-Error`

- Figma node: `459:30151`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Desktop` — `459:29443`
  - `Type=Mobile` — `459:30150`

Описание:

````text
Block/Transaction-Error

SCOPE
Обычный контентный блок внутри общего email-padding. Внешний top gap: Mobile 16px, Desktop 24px.

CARD
Единая белая карточка radius 22px Mobile / 26px Desktop. Две content-area разделены одним divider 1px #DFDFE0.

SECTION 1 — HEADER
Mobile: padding 22px, gap 16px.
Desktop: padding 32px, gap 24px.

Partner row:
— Desktop: горизонтально [Badge/Partner 72×72] → gap 24px → text-details → error status; вертикальное выравнивание по центру;
— Mobile: вертикальный центрированный стек с gap 16px.

Partner name, amount и status остаются HTML, кроме графического Badge/Partner.

SECTION 2 — BODY
Несколько HTML-параграфов в порядке конкретного инстанса.
Mobile: padding 22px, основной gap 16px, body 14px.
Desktop: padding 32px, основной gap 24px, body 16px.

Не добавлять divider между абзацами. Status реализовать живым Badge/Operation-Status error.
````

### `Badge/Operation-Status-Desktop`

- Figma node: `466:13296`
- Тип: `COMPONENT_SET`
- Варианты (3):

  - `status=wait` — `466:13290`
  - `status=done` — `466:13292`
  - `status=error` — `466:13294`

Описание:

````text
Badge/Operation-Status-Desktop

SCOPE
Атомарный живой HTML-status. Не экспортировать как изображение и не растягивать по ширине.

IMPLEMENTATION
Inline-table или compact table-cell: padding 4px 12px, radius 63px, текст 12px/140% Regular, nowrap.

VARIANTS
wait: “В обработке”, background #FAE6AF, text #8C5D00.
done: “Успешно”, background #B0FCC0, text #00991F.
error: “Отклонено”, background #FFC7C8, text #CC2944.

В Desktop родитель обычно размещает status в горизонтальном header-row и выравнивает его по вертикальному центру.
````

### `Block/Contact-Support`

- Figma node: `472:16999`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Desktop` — `472:16997`
  - `Type=Mobile` — `472:16998`

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

### `Badge/Bank @4x`

- Figma node: `481:19664`
- Тип: `COMPONENT`

Описание:

````text
Badge/Bank @4x

Атомарный графический asset банковского бейджа. Мастер имеет размер 72×72px, но не задаёт универсальный HTML display-размер.

Экспортировать внешний визуальный badge целиком из соответствующего слоя конкретного Desktop-инстанса письма, включая круглый фон/рамку. Не экспортировать вложенный логотип отдельно и не добавлять HTML-padding внутрь изображения.

Display-размер определяет родительский layout-компонент. Использовать один общий src для Mobile и Desktop.
````

### `Badge/Partner @4x`

- Figma node: `481:19665`
- Тип: `COMPONENT`

Описание:

````text
Badge/Partner @4x

Атомарный графический asset партнёрского бейджа. Мастер имеет размер 72×72px, но не задаёт универсальный HTML display-размер.

Экспортировать внешний визуальный badge целиком из соответствующего слоя конкретного Desktop-инстанса письма, включая круглый фон и логотип. Не экспортировать вложенный логотип отдельно.

Display-размер определяет родительский layout-компонент. В Block/Transaction-Success и Block/Transaction-Error он равен 72×72px в обеих версиях. Использовать один общий src.
````

### `Badge/Icon @4x`

- Figma node: `484:20039`
- Тип: `COMPONENT`

Описание:

````text
Badge/Icon @4x

Универсальный атомарный графический badge. Мастер имеет размер 72×72px, но не задаёт универсальный HTML display-размер.

Экспортировать внешний визуальный badge целиком из соответствующего слоя конкретного Desktop-инстанса письма, включая круглый фон/рамку и внутреннюю иконку. Не добавлять HTML-padding внутрь изображения.

Display-размер определяет родительский layout-компонент. Использовать один общий src для Mobile и Desktop.
````

### `Details/Transfer`

- Figma node: `484:20761`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `484:20760`
  - `Type=Desktop` — `477:21326`

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

### `Badge/Status-Icon-Positive @4x`

- Figma node: `491:22074`
- Тип: `COMPONENT`

Описание:

````text
Badge/Status-Icon-Positive @4x

Атомарная положительная status-иконка. Мастер имеет размер 72×72px.

Экспортировать внешний badge целиком из конкретного Desktop-инстанса, включая градиентный круг и белую иконку. Не экспортировать внутренний vector отдельно и не воспроизводить фон в HTML.

Display-размер определяет родительский компонент; в Block/Receipt-Info используется 72×72px. Один общий src для Mobile и Desktop.
````

### `Badge/Status-Icon-Negative @4x`

- Figma node: `491:22178`
- Тип: `COMPONENT`

Описание:

````text
Badge/Status-Icon-Negative @4x

Атомарная отрицательная status-иконка. Мастер имеет размер 72×72px.

Экспортировать внешний badge целиком из конкретного Desktop-инстанса, включая градиентный круг и белую иконку. Не экспортировать внутренний vector отдельно и не воспроизводить фон в HTML.

Display-размер определяет родительский компонент. Один общий src для Mobile и Desktop.
````

### `Details/Suspicious-Operation`

- Figma node: `497:25955`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Desktop` — `497:25953`
  - `Type=Mobile` — `497:25954`

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

  - `Type=Desktop` — `491:22454`
  - `Type=Mobile` — `497:26054`

Описание:

````text
Block/Personal-Data-Update

SCOPE
Обычный контентный блок, а не полный шаблон письма. Размещается внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px.

CARD
Единая белая карточка radius 22px Mobile / 26px Desktop. Две content-area разделены ровно одним divider 1px #DFDFE0.

HEADER SECTION
Mobile: padding 22px; вертикальный центрированный header [status icon 72×72 → heading], gap 16px.
Desktop: padding 32px; горизонтальный header [status icon 72×72 → heading], gap 24px, вертикальное выравнивание по центру.

BODY SECTION
Mobile: padding 22px, основной gap 16px, text-content gap 8px.
Desktop: padding 32px, основной gap 24px, text-content gap 12px.

Порядок:
1. HTML text-content конкретного инстанса.
2. Details/Suspicious-Operation.
3. attention-notice.
4. warning/legal notice.

Attention и warning выводить только если они видимы в инстансе. Status icon экспортировать целиком из конкретного Desktop-инстанса и использовать одним src. Не добавлять divider внутри Details или между обычными абзацами.
````

### `Details/Operation-Plain`

- Figma node: `497:26103`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `497:26102`
  - `Type=Desktop` — `497:26101`

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

  - `Type=Desktop` — `502:24638`
  - `Type=Mobile` — `502:24639`

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

  - `Type=Desktop` — `502:24693`
  - `Type=Mobile` — `502:24694`

Описание:

````text
Block/Receipt-Info

SCOPE
Обычный контентный блок внутри общего email-padding.
Top gap: Mobile 16px, Desktop 24px.

CARD
Две белые content-area, разделённые одним divider 1px #DFDFE0. Внешний radius 22px Mobile / 26px Desktop.

HEADER SECTION
Mobile: padding 22px; вертикальный центрированный стек [Badge/Status-Icon-Positive 72×72 → HTML heading], gap 16px.
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

  - `Type=Desktop` — `502:25046`
  - `Type=Mobile` — `502:25047`

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

  - `Type=Mobile` — `510:16700`
  - `Type=Desktop` — `510:16699`

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
3. Optional attention-notice.
4. Optional legal/disclaimer notice.
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

ATTENTION
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

  - `Type=Desktop` — `477:21325`
  - `Type=Mobile` — `484:20068`

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
