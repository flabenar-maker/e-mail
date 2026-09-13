# Прямая сверка маркетинговых structured contracts с Figma

Дата чтения: 2026-09-13. Figma: file key `8zka5bHkcrJVK9I9dKjnhC`, Marketing Emails `538:17236`. Проверяемый черновик: [`data/components/marketing.yaml`](https://github.com/flabenar-maker/e-mail/blob/7347406001e5a5403d2bb2abd8dbac85aab518cc/data/components/marketing.yaml), blob `fbe0f4c8f7572674dfc557a921a6f269e7de75e6`.

Проверены непосредственно через Figma MCP все 26 component/component-set и 55 вариантов на этой Section: структура, размеры, Auto Layout, padding/gap/radius, видимые Fill, текстовые стили, component property definitions и ссылки видимости. Отдельно разрешены 33 наблюдаемые variable bindings, 15 текстовых стилей и размеры пяти уникальных IMAGE Fill-источников. Вложенные в export-owner векторные контуры не трактовались как HTML-элементы. Figma MCP не выдаёт в этих чтениях неизменяемый revision id; дата и node ID фиксируют область повторной проверки.

## Итог

**0 из 26 контрактов пока нельзя признать полным и без потерь.** Это статус именно текущего structured-представления, а не оценка качества дизайна. В нём 348 facts, из них 343 с provenance `registry-literal`, 190 с безымянными ID `description-N`; в 21 компоненте Desktop root не содержит ни одного fact. Числовое совпадение с Figma само по себе не устанавливает владельца значения, Viewport, Style/Count-ветвь или источник Fill. Поля `verified_at` в черновике не являются доказательством такой проверки.

Проверка node ID вариантов и Boolean defaults не выявила расхождений: эти части черновика можно использовать как указатели для аудита. Для Style/Count нужно сверять и структуру конкретного варианта, а не только его ID. Ни один новый implementation fact в контракт не записан.

## По каждому компоненту

| Figma-компонент | Непосредственно подтверждённый факт | Почему текущий контракт ещё нельзя принять |
|---|---|---|
| [Badge/Step-Number](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=18-2948) | Style=Neutral `#F8F8FA`, Accent `#B0FCC0`; текст Mobile 14px, Desktop 16px. | Числа Style/Desktop находятся в `description-*` Mobile; цветовые ветви Style не адресованы. |
| [Email/Header](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=326-5159) | Logo Mobile `212×33`, Desktop `322×50`; собственный Fill `#F3F3F5`; верх `16/24px`. | Desktop root без фактов; общий PNG/source и размеры не доказаны адресными фактами. |
| [Block/Cards-Images](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=326-5806) | Mobile карточки вертикально `252px`, Desktop горизонтально `488px`; padding `22/32px`, gap карточек `22/24px`. | 11 безымянных фактов только в Mobile; ownership padding/gap/цвета и Desktop-композиция теряются. |
| [Block/Icon-Cards](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=326-6342) | Шесть Card/Icon; Mobile вертикально, Desktop горизонтально; padding `22/32px`, gap карточек `22/24px`. | 11 безымянных фактов только в Mobile; точные значения не привязаны к узлам/вариантам. |
| [Email/Footer](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=333-7477) | Fill `#F3F3F5`; два icon-asset: `vk-icon @4x` и `telegram-icon @4x`; gap `8/12px`. | Asset contract и render tree содержат только VK; отдельные disclaimer-сегменты и Telegram потеряны. |
| [Banner/Hero](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-4460) | Image frame `296×190` / `552×353`; Fill-raster Figma `984×696`; CTA привязан к Show Button. | Desktop root пуст; для `image-fill` заявлены `1104×706`, не подтверждённые исходным Fill; crop/типографика не адресованы. |
| [Block/Steps](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-4491) | Пять Item/Step; card padding `22/32px`, основной gap `16/24px`; 4 Boolean-привязки подтверждены. | 12 безымянных фактов в Mobile, Desktop пуст; порядок и вложенные значения выражены неполно. |
| [Button/Secondary](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-4710) | Fill `#48494A`, текст `#FFFFFF`; padding `12×24px`, текст `14/16px`. | 6 безымянных фактов в Mobile, Desktop пуст; белый текст назван словом без кода. |
| [Button/Primary](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-4713) | Fill: linear gradient stops `#18B037`→`#3DD55C`; у вариантов один Figma gradientTransform, размеры разные. | Описание задаёт «примерно 22°/25°»; контракт хранит stops, но не точный transform/position. |
| [Block/Content](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-4766) | Card `#FFFFFF`, padding `22/32px`, text gap `8/12px`; Notification, Alert, Button, Caption связаны с Boolean. | 10 безымянных фактов в Mobile, Desktop пуст; нет адресных цветов/типографики/секций. |
| [Banner/Secondary](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-4870) | Mobile image `296×188`; Desktop image-area `252×238`, text-area `300px`; исходный Fill `984×696`. | Контракт указывает `592×376` для `image-fill`; это не размер исходного растра. Crop и live-height не выражены полностью. |
| [Block/Bullet-List](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-4898) | Три Item/Bullet; gap пунктов `16/24px`; Alert/Button/Caption имеют Boolean bindings. | 9 безымянных фактов только в Mobile; Desktop и вложенные элементы без точной адресации. |
| [Item/Bullet](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-4958) | Bullet-dot `8×8`, Fill `#18B037`; gap до текста `8/12px`. | 8 безымянных фактов в Mobile, Desktop пуст; описание называет цвет только «зелёным». |
| [Item/Step](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-5039) | Badge→text `8/12px`; heading `14/18px`; Caption управляется Show Caption. | 4 безымянных факта в Mobile, Desktop пуст; типографика/цвета и свойство не раскрыты адресно. |
| [Banner/Inline](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-5040) | Feature icon `42/48px`, chevron `24px`; card padding `16/24px`; два export-owner. | 11 безымянных фактов в Mobile, Desktop пуст; asset display/цвета не выражены по ветвям. |
| [Block/Info-Alert](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-5041) | Alert icon `24/26px`; card `#FFFFFF`, padding `16/24px`. | 11 безымянных фактов в Mobile, Desktop пуст; asset и layout не привязаны к точным узлам. |
| [Banner/App-Download](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=337-6569) | RuStore background `#1E60DD`, mobile dark text `#2B2C2E`; logo widths Figma `162.6428528/218.8787994px`. | Описание пишет «синий/тёмный» и округляет logo `163/219px`; весь компонент отложен. |
| [Email/Footer-Legal](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=499-2431) | Fill `#F3F3F5`; padding `0 16px 16px` / `0 24px 24px`; только disclaimer-section. | 8 безымянных фактов в Mobile, Desktop пуст; структура текстовых сегментов не закреплена. |
| [Asset/Card-Image @2x](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=911-3992) | Style=Numbered добавляет Number `32×22` поверх image `232×148`; Style=Plain без Number. | Контракт имеет viewport-root Mobile/Desktop вместо ветвей Style; raw Fill `888×480` и rendered export `464×296` не разделены. |
| [Card/Image](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=911-4132) | Mobile вертикально `252×291`, Desktop горизонтально `488×148`; display image `232×148`, radius `14/18px`. | Нет полного текста/цвета/типографики и машинного запрета на размещение карточки как корневого блока; отдельный root сейчас не исключён. |
| [Block/Icon-List](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=946-26516) | Шесть item; icon `42/56px`; card `#FFFFFF`, padding `22/32px`, item gap `22/24px`. | 14 безымянных фактов в Mobile, Desktop пуст; описание называет фон «белым» без кода. |
| [Card/Icon](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=326-5580) | Mobile вертикально icon `52px`; Desktop строка icon `72px`, text-cell `392px`, gap `24px`. | 10 безымянных фактов в Mobile, Desktop пуст; иконка/текст не имеют адресных exact facts. |
| [Asset/Feature-Icon @4x](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=946-25769) | Boundary `64×64`; radial Fill stops `#3DD55C`→`#18B037`; glyph внутри. | Один компонент без Viewport, но контракт создаёт Mobile/Desktop; radial transform и Fill не выражены. |
| [Item/Alert](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=1024-19226) | Background `#F8F8FA`; padding `16/24px`, icon `24/26px`, gap `12/16px`. | 10 безымянных фактов в Mobile, Desktop пуст; параметры семантических узлов не адресованы. |
| [Item/Notification](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=1024-19285) | Background `#F8F8FA`; padding `16/24px`, icon `42/48px`, gap `16/20px`. | 10 безымянных фактов в Mobile, Desktop пуст; параметры семантических узлов не адресованы. |
| [NPS/Options](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email?node-id=1084-16995) | Count=2/3 меняет состав: Neutral отсутствует при Count=2; gap кнопок `8/12px`, icons `32/42px`. | Viewport-only contract включает Neutral всегда; 14 безымянных фактов в Mobile, Desktop пуст; raw Fill icons `1024×1024`, не `168×168`. |

## Описания, которые требуют точного значения

Эти компоненты помечены и пропущены для внесения новых facts. Значения справа считаны из Figma только как диагностическое доказательство; они не становятся контрактом автоматически.

| Компонент | Неоднозначное слово в Description | Что показывает Figma |
|---|---|---|
| Block/Cards-Images | «Белая карточка» | Fill content-area `#FFFFFF`. |
| Block/Icon-Cards | «Белая карточка» | Fill content-area `#FFFFFF`. |
| Button/Secondary | «текст белый» | Fill label `#FFFFFF`. |
| Button/Primary | «текст белый», «примерно 22° Mobile / 25° Desktop» | Label `#FFFFFF`; у обоих вариантов один gradientTransform `[[1.0291286707,-0.5773161054,0.0627517179],[23.9045963287,1.0291286707,-12.4814271927]]`. CSS-угол нельзя утверждать из этих приблизительных слов. |
| Item/Bullet | «зелёного bullet-indicator» | Fill bullet-dot `#18B037`. |
| Banner/App-Download | «синий фон», «тёмный текст»; logo `163/219px` | RuStore `#1E60DD`, mobile dark text `#2B2C2E`, фактические ширины logo `162.6428528/218.8787994px`. |
| Block/Icon-List | «Белая карточка» | Fill content-area `#FFFFFF`. |

Другие недостающие значения также нельзя восстанавливать из словесного описания. Например, у Banner/Hero, Block/Content и Block/Steps видимый фон и стили есть в Figma, но в их Mobile/Desktop facts нет полного адресного отображения.

## Особо важные границы источника и экспорта

- `Banner/Hero` и `Banner/Secondary` в библиотечных вариантах используют один placeholder IMAGE Fill с исходным растром `984×696`. Контракты с `source_mode_id: image-fill` заявляют соответственно `1104×706` и `592×376`. Эти числа получены из display-boundary, но не подтверждены как размеры исходного Fill. Контракт должен различать исходный растр, Figma crop и выходной файл после экспорта. Реальный email-инстанс может переопределить Fill; его источник проверяется отдельно при сборке письма.
- `Asset/Card-Image @2x` имеет исходный IMAGE Fill `888×480`; его rendered boundary — `232×148`, что даёт `464×296` при экспорте @2x. Здесь raw Fill и rendered-node принципиально разные объекты. Style=Numbered добавляет Number в экспортируемую композицию.
- У NPS три библиотечных IMAGE Fill исходно `1024×1024`; `168×168` — размер результата @4x от Desktop display `42×42`, а не размер исходного Fill. Кроме того, Count=2 исключает Neutral целиком.
- `Email/Footer` содержит две соц-иконки. Текущий contract описывает только VK.
- `Card/Image` является внутренним компонентом Block/Cards-Images. Его запрет как самостоятельного верхнеуровневого блока должен быть машинным, поскольку одно название/semantic_role этого не обеспечивает.

## Граница этой записи

Это диагностический снимок, не источник параметров для рендера. До восстановления адресных фактов по Mobile/Desktop/Style/Count и разрешения помеченных описаний `data/components/marketing.yaml` остаётся миграционным черновиком. В ходе аудита не менялись Figma, descriptions, registry, renderer, письмо или текущие contracts.
