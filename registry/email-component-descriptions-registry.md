# Реестр описаний компонентов email-библиотек

Актуальность слепка: 2026-08-12.

Источник: Figma-файл `CD_Email_Шаблоны писем` (`8zka5bHkcrJVK9I9dKjnhC`).

Этот файл — локальный рабочий слепок описаний компонентов. При проверке уже зафиксированных правил используй его вместо повторного чтения Figma. После любого изменения описания компонента в Figma в той же задаче обновляй соответствующую запись здесь. Реестр фиксирует описания и состав вариантов, но не заменяет визуальную проверку Figma, когда меняется сам дизайн или структура компонента.

## Источники библиотек

- Marketing Emails: `538:17236`
- Service Emails: `538:17235`

## Маркетинговые письма (26)

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
Собрать как компактную inline-table или отдельную table-cell с текстом номера шага. Фон, padding и скругление задавать на ячейке, текст не растрировать.

VARIANTS
Использовать Color и Type конкретного инстанса. Mobile и Desktop могут отличаться размером текста и итоговой шириной; значения брать из выбранных вариантов. Бейдж не растягивать по ширине родителя.
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
— Desktop display: 321.125×50px;
— Mobile display: ширина 210px, высота по исходной пропорции ≈32.70px.

Изображение фиксированное, центрированное, не width:100%. Не добавлять отдельный dark-mode asset и не включать в экспорт тёмный презентационный фон вокруг компонента.
````

### `Block/Cards-Steps`

- Figma node: `326:5449`
- Тип: `COMPONENT_SET`
- Варианты (8):

  - `Type=Mobile, Count=4` — `11:911`
  - `Type=Desktop, Count=4` — `260:850`
  - `Type=Desktop, Count=2` — `395:7743`
  - `Type=Desktop, Count=6` — `395:7779`
  - `Type=Mobile, Count=2` — `398:2238`
  - `Type=Mobile, Count=3` — `398:2273`
  - `Type=Mobile, Count=6` — `398:2308`
  - `Type=Desktop, Count=3` — `398:2359`

Описание:

````text
Block/Cards-Steps

SCOPE
Обычный контентный блок внутри общего email-padding. Не добавлять второй внешний боковой inset.
Top gap: Mobile 16px, Desktop 24px. Боковые 16px/24px уже обеспечивает общий email-padding.

OUTER CARD
Белая карточка: Mobile padding 22px, radius 22px, gap после заголовка 22px; Desktop padding 32px, radius 26px, gap после заголовка 24px. Заголовок центрирован.

RESPONSIVE STRUCTURE
Использовать две полные таблицы сетки: Mobile и Desktop. Классы переключения размещать только на внешних wrapper этих таблиц.

Mobile:
— одна Card/Step в каждой строке;
— карточка занимает 100% доступной ширины Mobile-сетки;
— 252px — контрольная ширина карточки в макете, а не фиксированная CSS-ширина;
— image-area внутри карточки изменяет высоту пропорционально фактической ширине карточки по description Card/Step;
— между карточками отдельная spacer-row высотой 22px;
— не использовать Desktop ghost-cells.

Desktop:
— внутренняя ширина сетки 488px;
— две карточки по 239px в строке;
— горизонтальный и вертикальный gap 10px отдельными spacer-cells/rows;
— карточки одного ряда находятся в соседних td и получают одинаковую высоту.

COUNT
2: один ряд из двух карточек.
3: первый ряд из двух; третья карточка отдельной строкой по центру.
4: два ряда по две.
6: три ряда по две.

Не применять d_mobile/d_desktop к внутренним spacer-строкам или ячейкам. Содержимое каждой карточки реализовать по description Card/Step.
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

OUTER CARD
Белая карточка: Mobile padding 22px, radius 22px, gap после заголовка 22px; Desktop padding 32px, radius 26px, gap после заголовка 24px. Заголовок центрирован.

RESPONSIVE STRUCTURE
Использовать две полные таблицы сетки: Mobile и Desktop. Классы переключения размещать только на внешних wrapper этих таблиц.

Mobile:
— одна Card/Image в каждой строке;
— карточка занимает 100% доступной ширины Mobile-сетки;
— 252px — контрольная ширина карточки в макете, а не фиксированная CSS-ширина;
— image-area внутри карточки изменяет высоту пропорционально фактической ширине карточки по description Card/Image;
— между карточками spacer-row 22px.

Desktop:
— внутренняя ширина 488px;
— две карточки по 239px;
— горизонтальный и вертикальный gap 10px;
— одинаковая высота карточек внутри ряда обеспечивается соседними td.

COUNT
2: один ряд из двух.
3: два в первом ряду, третья по центру во втором.
4: два ряда по две.
6: три ряда по две.

IMAGE DELEGATION
Экспорт и отображение изображения каждой вложенной карточки выполнять по description Card/Image и контракту @2x Fill основной инструкции.

Ширина карточки и размеры image-area, указанные в этом компоненте, относятся только к контейнерам сетки. Не использовать их как одновременно принудительные width и height тега HTML-тег img.
````

### `Block/Cards-Icons`

- Figma node: `326:6342`
- Тип: `COMPONENT_SET`
- Варианты (8):

  - `Type=Mobile, Count=4` — `326:6343`
  - `Type=Desktop, Count=4` — `326:6349`
  - `Type=Desktop, Count=2` — `398:7759`
  - `Type=Mobile, Count=2` — `398:7795`
  - `Type=Desktop, Count=3` — `398:7830`
  - `Type=Mobile, Count=3` — `398:7866`
  - `Type=Desktop, Count=6` — `398:7901`
  - `Type=Mobile, Count=6` — `398:7953`

Описание:

````text
Block/Cards-Icons

SCOPE
Обычный контентный блок внутри общего email-padding. Не добавлять второй внешний боковой inset.
Top gap: Mobile 16px, Desktop 24px. Боковые 16px/24px уже обеспечивает общий email-padding.

OUTER CARD
Белая карточка: Mobile padding 22px, radius 22px, gap после заголовка 22px; Desktop padding 32px, radius 26px, gap после заголовка 24px. Заголовок центрирован.

RESPONSIVE STRUCTURE
Использовать отдельные полные таблицы Mobile и Desktop; классы переключения — только на их внешних wrapper.

Mobile:
— одна Card/Icon в строке;
— ширина 252px;
— вертикальный gap 22px.

Desktop:
— сетка 488px;
— две карточки по 239px;
— gap 10px по обеим осям;
— одинаковая высота карточек одного ряда через соседние td.

Count=3: третья карточка центрируется отдельной строкой. Остальные Count раскладываются 1×2, 2×2 или 3×2.

Иконка остаётся отдельным фиксированным изображением; её display-размер определяет конкретная Card/Icon.
````

### `Card/Step`

- Figma node: `326:5578`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `11:1018`
  - `Type=Desktop` — `260:635`

Описание:

````text
Card/Step

STRUCTURE
Карточка внутри родительской сетки: image-area → живой Badge/Step-Number → text-content. Фон и равную высоту ряда задаёт родительский card-td.

IMAGE SOURCE AND PROPORTIONAL CROP @2x
Экспортировать исходный растр из Fill слоя Image @2x соответствующей карточки конкретного Desktop-инстанса письма. Не экспортировать image-area целиком и не создавать отдельный Mobile-asset. Один файл и один src использовать в Mobile и Desktop.

Реализовать изображение строго по контракту @2x Fill основной инструкции.

MOBILE RESPONSIVE IMAGE
Mobile image-area 252×160px является контрольным размером и задаёт соотношение сторон 252:160, а не фиксированную высоту.

Карточка занимает 100% доступной ширины внутри Mobile-сетки. Mobile crop-wrapper не получает фиксированную высоту и HTML-атрибут height. При фактической ширине W его высота должна составлять:

H = W × 160 / 252

Пропорциональное img остаётся в обычном потоке, получает height:auto и формирует высоту wrapper. Для горизонтального crop ширина img может превышать 100%; лишняя ширина обрезается wrapper через overflow:hidden. Позицию воспроизводить процентным смещением по Fill Mobile-инстанса.

DESKTOP IMAGE
Desktop crop-wrapper остаётся фиксированным контейнером 239×160px. Пропорции исходного img сохранять; crop и позицию воспроизводить по Fill Desktop-инстанса.

Не приравнивать img одновременно к width и height wrapper. Не использовать height:100%, object-fit или object-position.

Badge/Step-Number не включать в изображение.

BADGE
Badge/Step-Number — живой HTML. Он визуально перекрывает границу image/content. Размещать его отдельной строкой вне clipping-контейнера изображения. В non-MSO допустим контролируемый отрицательный верхний offset из геометрии инстанса. Для MSO допускается расположение бейджа сразу под изображением без перекрытия.

TEXT
Heading и description остаются HTML. Padding, gaps, типографику, фон и радиус брать из конкретного Mobile/Desktop-варианта.
````

### `Card/Image`

- Figma node: `326:5579`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `11:1019`
  - `Type=Desktop` — `260:652`

Описание:

````text
Card/Image

STRUCTURE
Карточка внутри родительской сетки: image-area сверху, затем HTML text-content. Фон, радиус и одинаковую высоту карточек ряда задаёт родительский card-td.

TEXT
Heading и optional description остаются HTML. Внутренние padding, gaps и типографику брать из выбранного Mobile/Desktop-варианта.

IMAGE SOURCE AND PROPORTIONAL CROP @2x
Экспортировать исходный растр из Fill слоя Image @2x соответствующей карточки конкретного Desktop-инстанса письма. Не экспортировать image-area целиком и не создавать отдельный Mobile-asset. Один файл и один src использовать в Mobile и Desktop.

Реализовать изображение строго по контракту @2x Fill основной инструкции.

MOBILE RESPONSIVE IMAGE
Mobile image-area 252×160px является контрольным размером и задаёт соотношение сторон 252:160, а не фиксированную высоту.

Карточка занимает 100% доступной ширины внутри Mobile-сетки. Mobile crop-wrapper не получает фиксированную высоту и HTML-атрибут height. При фактической ширине W его высота должна составлять:

H = W × 160 / 252

Пропорциональное img остаётся в обычном потоке, получает height:auto и формирует высоту wrapper. Для горизонтального crop ширина img может превышать 100%; лишняя ширина обрезается wrapper через overflow:hidden. Позицию воспроизводить процентным смещением по Fill Mobile-инстанса.

DESKTOP IMAGE
Desktop crop-wrapper остаётся фиксированным контейнером 239×160px. Пропорции исходного img сохранять; crop и позицию воспроизводить по Fill Desktop-инстанса.

Не приравнивать img одновременно к width и height wrapper. Не использовать height:100%, object-fit или object-position.
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

STRUCTURE
Карточка внутри родительской сетки: фиксированная иконка → HTML heading → optional HTML description. Фон, радиус и одинаковую высоту карточек ряда задаёт родительский card-td.

ICON
Экспортировать только визуальный слой иконки из конкретного Desktop-инстанса письма. Не включать в изображение padding, фон карточки или текст. Использовать один src; display-размер задаёт выбранный Mobile/Desktop-вариант карточки. Не применять width:100%.

TEXT
Heading и description остаются HTML. Padding, gaps, alignment и типографику брать из конкретного варианта.
````

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
Композиционный корень письма. Сам не добавляет декоративный фон, padding, gap или контент сверх дочерних инстансов.

IMPLEMENTATION
Собрать дочерние компоненты конкретного Mobile/Desktop-инстанса в том же порядке и с той же видимостью. Slot-контейнеры используются только для определения состава и не создают дополнительные HTML-обёртки, меняющие геометрию.

PLACEMENT
Полноширинные дочерние компоненты размещать отдельными строками email-wrapper. Обычные padded-компоненты объединять только тем способом, который не добавляет повторный боковой padding. Компоненты с собственным self-inset размещать по их descriptions.

Не переносить компоненты, свойства или видимость между Mobile и Desktop автоматически.
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

OUTER INSET
Mobile: 16px с боков и 16px сверху.
Desktop: 24px с боков и 24px сверху.

MOBILE RESPONSIVE
Mobile-wrapper занимает 100% доступной ширины email-wrapper. После боковых inset карточка занимает 100% оставшейся ширины; не задавать ей фиксированную ширину.
Высота wrapper и карточки определяется контентом. Заголовок может переноситься, карточка должна увеличиваться по высоте без обрезки.
При ширине Mobile-инстанса 328px карточка равна 296px — это контрольное значение макета, а не фиксированный HTML-размер.

CARD
Mobile: width 100%, padding 22px, radius 22px, gap heading→buttons 16px.
Desktop: ширина 536px, padding 32px, radius 26px, gap 24px.
Heading центрирован.

BUTTON TABLE
Mobile: таблица кнопок занимает 100% внутренней ширины карточки и использует table-layout:fixed. Структура строки: button-cell → spacer-cell 8px → button-cell → spacer-cell 8px → button-cell.
Три button-cells не получают width 33.333% и не получают фиксированную ширину: при table-layout:fixed они поровну делят только пространство, оставшееся после двух spacer-cells. Не складывать три процентные ширины до 100% и gaps сверх них — в таком варианте spacer может схлопнуться.
Каждая Mobile spacer-cell обязательна, имеет HTML-атрибут width со значением 8, inline width:8px; min-width:8px; font-size:0; line-height:0, содержит неразрывный пробел, не имеет фона и ссылки и не может быть удалена или объединена с button-cell.
При Mobile-инстансе 328px ширина каждой кнопки ≈79px является только контрольным результатом адаптивного расчёта.
Desktop: три равные кликабельные ячейки по 148px и две обязательные spacer-cells по 14px; сумма 148+14+148+14+148 равна внутренней ширине 472px.
Иконки не растягивать: Mobile 31/32/32px, Desktop 42px; центрировать внутри кнопок.

Каждая оценка — отдельная ссылка, кликабельная по всей площади своей адаптивной button-cell. Фон и radius задавать на linked button-cell. Использовать один общий Desktop-source каждой иконки для Mobile и Desktop. URL каждой оценки брать из данных письма; при отсутствии не придумывать.
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

OUTER INSET
Mobile: 16px с боков и 16px сверху.
Desktop: 24px с боков и 24px сверху.

MOBILE RESPONSIVE
Mobile-wrapper занимает 100% доступной ширины email-wrapper. После боковых inset карточка занимает 100% оставшейся ширины; не задавать ей фиксированную ширину.
Высота wrapper и карточки определяется контентом. Заголовок может переноситься, карточка должна увеличиваться по высоте без обрезки.
При ширине Mobile-инстанса 328px карточка равна 296px — это контрольное значение макета, а не фиксированный HTML-размер.

CARD
Mobile: width 100%, padding 22px, radius 22px, gap heading→buttons 16px.
Desktop: ширина 536px, padding 32px, radius 26px, gap 24px.
Heading центрирован.

BUTTON TABLE
Mobile: таблица кнопок занимает 100% внутренней ширины карточки и использует table-layout:fixed. Структура строки: button-cell → spacer-cell 8px → button-cell.
Две button-cells не получают width 50% и не получают фиксированную ширину: при table-layout:fixed они поровну делят только пространство, оставшееся после spacer-cell. Не складывать две ширины 50% и gap 8px сверх них — в таком варианте spacer может схлопнуться и кнопки прилипнут друг к другу.
Mobile spacer-cell обязательна, имеет HTML-атрибут width со значением 8, inline width:8px; min-width:8px; font-size:0; line-height:0, содержит неразрывный пробел, не имеет фона и ссылки и не может быть удалена или объединена с button-cell.
При Mobile-инстансе 328px ширина каждой кнопки 122px является только контрольным результатом адаптивного расчёта.
Desktop: две равные кликабельные ячейки по 229px и одна обязательная spacer-cell 14px; сумма 229+14+229 равна внутренней ширине 472px.
Иконки не растягивать: Mobile happy 31px, sad 32px; Desktop обе 42px. Центрировать внутри кнопок.

Каждая оценка — отдельная ссылка, кликабельная по всей площади своей адаптивной button-cell. Фон и radius задавать на linked button-cell. Использовать один общий Desktop-source каждой иконки для Mobile и Desktop. URL каждой оценки брать из данных письма; при отсутствии не придумывать.
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
Mobile: padding 0 16px 16px, gap между абзацами 8px.
Desktop: padding 0 24px 24px, gap 12px.
Текст 12px/140%, Regular, #98999C, по центру. Ссылки того же цвета и подчёркнуты. Сохранять только смысловые hard breaks исходного текста.

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
Top gap: Mobile 16px, Desktop 24px. Боковые 16px/24px уже обеспечивает общий email-padding.

STRUCTURE
Одна карточка-table: image-area → content-area → text-content → optional CTA. Изображение не является фоном и текст поверх него не размещается.

Mobile:
— image-area занимает 100% доступной ширины; 296×190px — контрольный размер и соотношение сторон, а не фиксированный CSS-размер;
— content padding 22px;
— внутренний gap 16px.

Desktop:
— image-area 552×353px;
— content padding 32px;
— внутренний gap 22px.

Heading, body и CTA остаются HTML. Наличие текста и кнопки определяется свойствами конкретного инстанса. Radius и clipping задавать только внешней карточке. Не добавлять VML, пока в инстансе нет текста поверх изображения.

IMAGE SOURCE AND PROPORTIONAL CROP @2x
Экспортировать исходный растр из Fill слоя hero-image @2x конкретного Desktop-инстанса письма. Не экспортировать image-area целиком и не создавать отдельный Mobile-asset. Один файл и один src использовать в Mobile и Desktop.

Реализовать изображение строго по контракту @2x Fill основной инструкции.

MOBILE RESPONSIVE IMAGE
Mobile image-area 296×190px является контрольным размером и задаёт соотношение сторон 296:190, а не фиксированную высоту.

Mobile crop-wrapper занимает 100% доступной ширины, не получает фиксированную высоту и HTML-атрибут height. При фактической ширине W:

H = W × 190 / 296

Пропорциональное img остаётся в обычном потоке, получает height:auto и формирует высоту wrapper. Для горизонтального crop ширина img может превышать 100%; лишняя ширина обрезается wrapper через overflow:hidden. Позицию воспроизводить процентным смещением по Fill Mobile-инстанса.

DESKTOP IMAGE
Desktop crop-wrapper остаётся фиксированным контейнером 552×353px. Пропорции исходного img сохранять; crop и позицию воспроизводить по Fill Desktop-инстанса.

Не приравнивать img одновременно к width и height wrapper. Не использовать height:100%, object-fit или object-position.
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

Показывать optional элементы только по свойствам инстанса.

STEPS
Каждый шаг — отдельная таблица: строка живого Badge/Step-Number, spacer, затем HTML heading и optional caption. Бейдж не экспортировать как изображение.

Mobile:
— gap между шагами 16px;
— badge→text 8px;
— heading/caption gap 4px;
— heading 14px, caption 12px.

Desktop:
— gap между шагами 24px;
— badge→text 12px;
— heading/caption gap 6px;
— heading 18px, caption 16px.

Порядок одинаков, поэтому допускается одна семантическая таблица с responsive размерами; не дублировать содержимое без необходимости.
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
Кликабельная email-кнопка из presentation-table → button-cell → &lt;a&gt;. Не использовать фиксированную ширину как свойство компонента: full-width или content-width определяется конкретным инстансом и родительским блоком.

Mobile: padding 16px 32px.
Desktop: padding 12px 24px.
Фон #00991F, текст белый, radius из выбранного варианта. Вся видимая площадь кнопки должна находиться внутри ссылки.

Текст остаётся HTML. Для белого текста применять предусмотренный общей инструкцией класс защиты. Не помещать таблицу внутрь &lt;a&gt;.
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
Top gap: Mobile 16px, Desktop 24px. Боковые 16px/24px уже обеспечивает общий email-padding.

RESPONSIVE STRUCTURE
Использовать отдельные внешние Mobile и Desktop варианты разметки.

Mobile:
— image-area занимает 100% доступной ширины сверху; 296×188px — контрольный размер и соотношение сторон, а не фиксированный CSS-размер;
— content-area снизу, padding 22px, gap 16px;
— heading/body по центру;
— optional Button/Secondary по ширине контента.

Desktop:
— одна строка из content-area слева и image-area справа;
— content-area 312px, padding 32px, gap 24px;
— image-area 240px и равна высоте строки;
— текст слева; optional button по свойствам инстанса.

Heading, body и button остаются HTML. Radius и clipping задавать внешней карточке.

IMAGE SOURCE AND PROPORTIONAL CROP @2x
Экспортировать исходный растр из Fill слоя Image @2x конкретного Desktop-инстанса письма. Не экспортировать image-area целиком и не создавать отдельный Mobile-asset. Один файл и один src использовать в обоих вариантах.

Реализовать изображение строго по контракту @2x Fill основной инструкции.

MOBILE RESPONSIVE IMAGE
Mobile image-area 296×188px является контрольным размером и задаёт соотношение сторон 296:188, а не фиксированную высоту.

Mobile crop-wrapper занимает 100% доступной ширины, не получает фиксированную высоту и HTML-атрибут height. При фактической ширине W:

H = W × 188 / 296

Пропорциональное img остаётся в обычном потоке, получает height:auto и формирует высоту wrapper. Для горизонтального crop ширина img может превышать 100%; лишняя ширина обрезается wrapper через overflow:hidden. Позицию воспроизводить процентным смещением по Fill Mobile-инстанса.

DESKTOP IMAGE
Desktop image-area остаётся правой колонкой шириной 240px и высотой строки карточки. Пропорции исходного img сохранять; crop и позицию воспроизводить по Fill Desktop-инстанса. Адаптивные правила Mobile нельзя переносить на Desktop-композицию.

Не приравнивать img одновременно к width и height wrapper. Не использовать height:100%, object-fit или object-position.

Не менять структуру Banner/Secondary и не преобразовывать его в Hero.
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
Состав определяется свойствами и содержимым конкретного инстанса.

CARD
Mobile: top gap 16px, padding 22px, radius 22px, основной gap 16px.
Desktop: top gap 24px, padding 32px, radius 26px, основной gap 24px.

Каждый bullet — отдельная строка с живым индикатором и HTML-текстом. Между пунктами использовать spacer-строки по геометрии выбранного варианта, не margin на td. Не объединять список в одно изображение.
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
— колонка HTML text-content.

Индикатор не экспортировать как изображение. Выровнять его по верхней строке текста; размер, цвет, ширину колонки и gap брать из выбранного Mobile/Desktop-варианта.

Text-content содержит heading и optional description. Сохранять их порядок, локальный gap и типографику варианта. Внешний вертикальный интервал между пунктами задаёт родительский Block/Bullet-List.
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
Одна кликабельная строка-table: icon-cell → text-cell → chevron-cell. В каждой из трёх ячеек находится отдельный &lt;a&gt; с одинаковым href; таблицу внутрь ссылки не помещать.

Чтобы вся площадь ячеек была кликабельной, горизонтальные padding/gap размещать внутри соответствующих &lt;a&gt;, а не снаружи ссылки на td.

Mobile:
— top gap 16px;
— card padding 16px, gap 16px, radius 22px;
— icon 42px, chevron 24px, text 14px.

Desktop:
— top gap 24px;
— card padding 24px, gap 24px, radius 26px;
— icon 48px, chevron 24px, text 18px.

Icon и chevron — фиксированные изображения. Использовать Desktop-source и один src для каждой иконки. Текст остаётся HTML.
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
Обычный контентный блок внутри общего email-padding. Если этот визуальный паттерн вложен в другой компонент, внешний top gap задаёт родитель и повторно не добавляется.

STRUCTURE
Одна presentation-table строка: фиксированная icon-cell слева и HTML text-cell справа.

Standalone Mobile:
— top gap 16px;
— padding 16px, gap 12px, radius 22px;
— icon 24px, text 14px.

Standalone Desktop:
— top gap 24px;
— padding 24px, gap 16px, radius 26px;
— icon 26px, text 18px.

Иконку экспортировать отдельно от HTML-фона и текста, использовать один Desktop-source. Текст не растрировать.
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
Все assets брать из конкретного Desktop-инстанса письма.

App logo:
— экспортировать внешний слой app-logo @4x без HTML-padding;
— один src;
— Desktop 233×66px, Mobile 163×46px.

Store icons:
— не экспортировать внешние button-containers;
— RuStore: внутренний Subtract;
— GooglePlay: внутренний Vector;
— AppGallery: внутренний Vector;
— GetApps: внутреннюю полную icon group со всеми mask/group слоями;
— фон, radius, padding и текст не включать;
— фиксированный slot 26×26px в обеих версиях;
— GooglePlay artwork центрировать в slot по фактическому размеру Desktop-слоя.

QR:
— экспортировать целиком Desktop QR Block со знаком в центре;
— display 132×132px;
— только Desktop.

MOBILE
Top gap 16px. Белая карточка: padding 22px, radius 22px, gap 16px.

Порядок:
1. app logo 163×46 слева;
2. HTML description 14px/140%;
3. таблица store buttons 2×2.

Таблица store buttons и каждый её row занимают 100% доступной внутренней ширины карточки. В каждом row две адаптивные кнопки поровну делят пространство, оставшееся после фиксированного gap 8px.
Mobile-кнопка: width fluid, height 42px, radius 24px. При ширине Mobile-инстанса 328px каждая кнопка равна 122px — это контрольный результат адаптивного расчёта, а не фиксированный HTML-размер. Не задавать кнопкам или ссылкам фиксированный width 122px.
Порядок: RuStore, GooglePlay / AppGallery, GetApps.
Каждая кнопка — отдельная ссылка, заполняющая всю ширину своей адаптивной button-cell.

Внутри кнопки: icon slot 26px → gap 8px → HTML text-area 60px. Вся эта группа целиком центрируется по горизонтали и вертикали внутри кнопки при любой её ширине; не растягивать содержимое по краям. Текст не включать в изображение.
RuStore: #1E60DD, белые строки “RuStore” и “ПОЛНАЯ ВЕРСИЯ”.
Остальные: #F8F8FA, живой текст “GooglePlay”, “AppGallery”, “GetApps”.

DESKTOP
Top gap 24px. Белая карточка: padding 32px, radius 26px, gap между основными строками 24px.

Header-row:
— logo 233×66;
— spacer 24px;
— HTML description в оставшейся колонке, 16px/140%.

Download-row:
— Notification 344px;
— spacer 12px;
— QR 132px.

Notification: #F8F8FA, padding 24px, radius 18px. Текст “Приложение доступно:” остаётся HTML. Gap до store row 20px.

Store row: четыре icon-only ссылки высотой 42px, gaps 6px, radius 24px. Порядок RuStore, GooglePlay, AppGallery, GetApps. RuStore #1E60DD, остальные #FFFFFF. Иконки центрированы; видимого текста нет, alt содержит название магазина.

Все URL брать из реестра письма.
````

### `Banner/App-Download-Large`

- Figma node: `337:7372`
- Тип: `COMPONENT_SET`
- Варианты (2):

  - `Type=Mobile` — `222:901`
  - `Type=Desktop` — `260:1495`

Описание:

````text
Banner/App-Download-Large

SCOPE
Обычный контентный блок внутри общего email-padding. Mobile и Desktop имеют разную композицию, поэтому реализовать их отдельными внешними вариантами. Не добавлять второй боковой inset.

MOBILE
Top gap 16px. Карточка занимает 100% доступной ширины внутри общего email-padding, radius 22px, overflow hidden; не задавать фиксированный HTML-width. При ширине Mobile-инстанса 328px карточка равна 296px — это контрольное значение макета.
Высота карточки определяется контентом.

Порядок:
1. image-area занимает 100% ширины карточки и сохраняет контрольное соотношение сторон 296:188; при Mobile-инстансе 328px её размер равен 296×188px;
2. белая content-area с padding 22px и gap 16px;
3. HTML heading 20px/120%;
4. HTML body 14px/140%;
5. таблица store buttons 2×2.

Store buttons реализовать по адаптивным Mobile-правилам Banner/App-Download: таблица и оба row занимают 100% доступной внутренней ширины; в каждом row две кнопки поровну делят пространство после фиксированного gap 8px. Высота кнопки 42px, radius 24px. Значение 122px при ширине Mobile-инстанса 328px является только контрольным результатом, а не фиксированным HTML-width. Группа icon slot → gap → HTML text-area центрируется по горизонтали и вертикали внутри каждой адаптивной кнопки. Изображением является только иконка; фон и текст кнопки остаются HTML.

DESKTOP
Top gap 24px. Карточка шириной 552px, radius 26px, overflow hidden. Две равные колонки по 276px.

Левая content-area: белый фон, padding 32px. Порядок:
1. логотип;
2. HTML body 18px/140%;
3. ряд QR + store buttons.

Правая image-area имеет ширину 276px и занимает всю высоту карточки.

QR выводить только на Desktop. Store buttons реализовать по Desktop-правилам Banner/App-Download: вертикальный столбец из четырёх icon-only ссылок 60×42px с gap 6px. Не экспортировать кнопки вместе с фоном или текстом.

SHARED ASSETS
Логотип и QR не экспортировать повторно: использовать те же файлы, что в Banner/App-Download. В этом блоке логотип отображать 200×56.6px, QR — 140×140px.

APP IMAGE SOURCE AND PROPORTIONAL CROP @2x
Экспортировать исходный растр из Fill слоя app-image @2x конкретного Desktop-инстанса письма. Не экспортировать image-area и не создавать отдельный Mobile-файл. Один файл и один src использовать в обоих вариантах.

Реализовать изображение строго по контракту @2x Fill основной инструкции.

MOBILE RESPONSIVE IMAGE
Mobile image-area 296×188px является контрольным размером и задаёт соотношение сторон 296:188. Размер 296×188px относится только к контрольному Mobile-инстансу и не является фиксированным CSS-размером.

Mobile crop-wrapper занимает 100% ширины карточки, не получает фиксированную высоту и HTML-атрибут height. При фактической ширине W:

H = W × 188 / 296

Пропорциональное img остаётся в обычном потоке, получает height:auto и формирует высоту wrapper. Для горизонтального crop ширина img может превышать 100%; лишняя ширина обрезается wrapper через overflow:hidden. Позицию воспроизводить процентным смещением по Fill Mobile-инстанса.

DESKTOP IMAGE
Desktop crop-wrapper остаётся правой колонкой шириной 276px и занимает высоту Desktop-карточки. Пропорции исходного img сохранять; crop и позицию воспроизводить по Fill Desktop-инстанса.

Не приравнивать img одновременно к width и height wrapper. Не использовать height:100%, object-fit или object-position.
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
