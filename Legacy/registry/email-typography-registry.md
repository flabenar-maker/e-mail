# Реестр типографики email-библиотеки CUPIS

Этот файл хранит актуальный фактический слепок текстовых стилей CUPIS, их параметров, семантического назначения и текущего использования в email-компонентах.

Статус: начальная версия реестра.  
Последняя сверка с Figma: 24 августа 2026 года.  
Источник проверки: [страница Email Components](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/CD_Email_%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B-%D0%BF%D0%B8%D1%81%D0%B5%D0%BC?node-id=5-6).

## Роль реестра

Используй реестр, чтобы без повторного полного обхода Figma определить:

- какие текстовые стили существуют;
- какие фактические параметры закреплены за каждым стилем;
- какую смысловую роль выполняет стиль;
- в каких компонентах стиль применяется сейчас;
- какой стиль относится к Desktop- или Mobile-версии;
- какие части системы нужно синхронизировать при изменении типографики.

Figma остаётся источником фактических значений и привязок текстовых слоёв. Реестр является их каноническим облачным слепком для работы Codex. Если реестр расходится с Figma, не выбирай источник по предположению: проведи точечный аудит и синхронизируй расхождение в одной задаче.

Реестр не заменяет:

- общую инструкцию по HTML-вёрстке и правила font fallback;
- descriptions конкретных компонентов;
- будущий нормативный стандарт типографики в `core/`.

До появления отдельного стандарта этот файл фиксирует текущую семантику стилей, но не вводит новую типографическую шкалу.

## Текущее основание системы

- Основной шрифт в Figma: Roboto.
- Используемые начертания: Regular, Medium, SemiBold и Bold.
- Заголовочные роли используют line-height 120%.
- Body, Caption и Action используют line-height 140%.
- Letter-spacing всех активных стилей визуально равен 0.
- Цвет текста не входит в текстовый стиль и управляется отдельно.
- В библиотеке 15 активных локальных текстовых стилей: 8 Desktop и 7 Mobile.
- Неиспользуемые Deprecated-стили удалены после постраничной проверки файла.

HTML-стек `Roboto, Arial, sans-serif` и способ подключения Roboto определяются [общей инструкцией](../core/email-figma-prompt.md), а не этим реестром.

## Логика текущих имён

Имена строятся от контекста к семантической роли:

`Viewport/Role[/Variant]`

- `Desktop` и `Mobile` показывают версию компонента.
- `Display` — главный выразительный текст.
- `Heading` — заголовок контентного блока.
- `Title` — заголовок карточки или внутреннего элемента.
- `Body` — основной и вспомогательный содержательный текст.
- `Caption` — подписи, предупреждения, дисклеймеры и юридический текст.
- `Action` — CTA-текст кнопки или самостоятельной action-ссылки.
- `Compact` — намеренно более компактный вариант роли в ограниченном контейнере.

Физические параметры не включаются в имя. Они хранятся в определении стиля и в этом реестре, поэтому изменение размера не делает имя ложным.

## Каталог активных стилей

| Стиль | Семейство и начертание | Размер | Line-height | Letter-spacing | Текущее назначение |
|---|---|---:|---:|---:|---|
| `Desktop/Display` | Roboto Bold | 32px | 120% | 0 | Главный выразительный текст: Hero-заголовок и сумма/результат транзакции. |
| `Desktop/Heading` | Roboto SemiBold | 26px | 120% | 0 | Основной заголовок контентного блока. |
| `Desktop/Title` | Roboto Medium | 20px | 120% | 0 | Заголовок карточки, элемента или партнёра. |
| `Desktop/Heading/Compact` | Roboto SemiBold | 20px | 120% | 0 | Компактный заголовок ограниченного текстового контейнера; сейчас только Banner/Secondary. |
| `Desktop/Body/Large` | Roboto Regular | 18px | 140% | 0 | Основной или акцентный текст контентного блока. |
| `Desktop/Body/Medium` | Roboto Regular | 16px | 140% | 0 | Плотный информационный текст, подписи и значения. |
| `Desktop/Caption` | Roboto Regular | 14px | 140% | 0 | Вспомогательный, юридический и предупреждающий текст. |
| `Desktop/Action` | Roboto Medium | 16px | 140% | 0 | CTA-текст кнопок и самостоятельных action-ссылок. |
| `Mobile/Display` | Roboto Bold | 20px | 120% | 0 | Мобильная версия главного выразительного текста. |
| `Mobile/Heading` | Roboto SemiBold | 18px | 120% | 0 | Основной заголовок мобильного контентного блока. |
| `Mobile/Title` | Roboto Medium | 16px | 120% | 0 | Заголовок мобильной карточки или элемента. |
| `Mobile/Body/Large` | Roboto Regular | 14px | 140% | 0 | Основной мобильный текст и значения. |
| `Mobile/Body/Medium` | Roboto Regular | 12px | 140% | 0 | Компактный вспомогательный мобильный текст. |
| `Mobile/Caption` | Roboto Regular | 12px | 140% | 0 | Мобильный юридический, предупреждающий и поясняющий текст. |
| `Mobile/Action` | Roboto Medium | 14px | 140% | 0 | CTA-текст мобильных кнопок и action-ссылок. |

Фактический `Desktop/Caption` — Roboto Regular 14px / 140%. Прежнее значение 12px в старом имени и description являлось остатком предыдущей версии, а не параметром стиля.

## Семантическое применение

### Display

Используется для главного визуального сообщения, которое должно первым считываться в блоке: Hero-заголовка либо крупного результата операции. Не используется как обычный заголовок секции или карточки.

### Heading

Используется для заголовка самостоятельного контентного блока. Не заменяет Display в Hero и Title внутри карточки.

`Desktop/Heading/Compact` — отдельный фактически существующий вариант для ограниченного текстового контейнера `Banner/Secondary`. Его нельзя автоматически подменять обычным `Desktop/Heading`.

### Title

Используется для заголовков карточек и внутренних сущностей: карточки с изображением, карточки с иконкой, имени партнёра или локального результата внутри блока.

### Body

`Large` и `Medium` отражают два уровня содержательного текста внутри конкретного viewport. Выбор определяется фактической ролью текста в компоненте, а не попыткой подобрать ближайший размер.

- `Body/Large` — основной, более заметный или более свободно набираемый текст.
- `Body/Medium` — более плотный информационный, вспомогательный текст, подписи и значения.

Desktop и Mobile могут использовать разные физические размеры и не обязаны механически повторять друг друга. При адаптации сохраняется смысловая категория текста и фактический контракт конкретного компонента.

### Caption

Используется для дисклеймеров, юридических сообщений, предупреждений, сроков действия и второстепенных пояснений. Совпадение параметров `Mobile/Caption` и `Mobile/Body/Medium` не делает стили взаимозаменяемыми: их семантика и возможность дальнейшего изменения различаются.

### Action

Используется для текста внутри Primary/Secondary-кнопок и для самостоятельных CTA-ссылок в карточках и блоках. Не применяется к обычным inline-ссылкам внутри Body-текста только из-за их кликабельности.

## Соответствия Desktop и Mobile

| Семантика | Desktop | Mobile | Примечание |
|---|---|---|---|
| Главный выразительный текст | `Desktop/Display` | `Mobile/Display` | Одинаковая роль, разные размеры |
| Заголовок блока | `Desktop/Heading` | `Mobile/Heading` | Основная пара заголовков |
| Заголовок карточки/элемента | `Desktop/Title` | `Mobile/Title` | Основная пара внутренних заголовков |
| Компактный заголовок | `Desktop/Heading/Compact` | `Mobile/Heading` | Текущее исключение Banner/Secondary |
| Основной Body | `Desktop/Body/Large` | `Mobile/Body/Large` | Выбор уточняется контрактом компонента |
| Компактный Body | `Desktop/Body/Medium` | `Mobile/Body/Medium` | Не означает обязательную один-к-одному замену во всех слоях |
| Подписи и дисклеймеры | `Desktop/Caption` | `Mobile/Caption` | Семантическая пара |
| CTA | `Desktop/Action` | `Mobile/Action` | Кнопки и самостоятельные action-ссылки |

Таблица описывает семантические пары, а не автоматическое правило замены стиля. Источником выбора для конкретного слоя остаётся зафиксированный контракт компонента.

## Канонические Figma descriptions

Тексты ниже являются точными descriptions локальных TextStyle в Figma. В Figma переносится только соответствующий абзац без заголовка и Markdown-разметки. Подробные списки компонентов-потребителей остаются в реестре и не дублируются в descriptions.

### `Desktop/Display`

Главный выразительный текст Desktop для Hero-заголовка и крупного результата операции. Не использовать как обычный заголовок блока или карточки. Пара: Mobile/Display. Roboto Bold, 32px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Desktop/Heading`

Основной заголовок самостоятельного контентного блока в Desktop. Не использовать для Hero или заголовка карточки. Пара: Mobile/Heading. Roboto SemiBold, 26px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Desktop/Title`

Заголовок карточки или внутренней сущности в Desktop, включая имя партнёра и локальный результат внутри блока. Не использовать как заголовок самостоятельного блока. Пара: Mobile/Title. Roboto Medium, 20px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Desktop/Heading/Compact`

Компактный заголовок Desktop для ограниченного текстового контейнера; сейчас используется в Banner/Secondary. Не заменять обычным Desktop/Heading без проверки макета и контракта компонента. Мобильная роль: Mobile/Heading. Roboto SemiBold, 20px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Desktop/Body/Large`

Основной или акцентный содержательный текст в Desktop. Использовать для заметного текста блока; не применять к плотным подписям и значениям только ради увеличения размера. Основная мобильная пара: Mobile/Body/Large. Roboto Regular, 18px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Desktop/Body/Medium`

Плотный информационный и вспомогательный текст в Desktop: подписи, значения и описания внутри компонентов. Не использовать как Caption или CTA. Основная мобильная пара: Mobile/Body/Medium; точный выбор задаёт контракт компонента. Roboto Regular, 16px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Desktop/Caption`

Вспомогательный, предупреждающий и юридический текст в Desktop: дисклеймеры, сроки действия и второстепенные пояснения. Не использовать для основного содержательного текста. Пара: Mobile/Caption. Roboto Regular, 14px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Desktop/Action`

CTA-текст в Desktop внутри Primary/Secondary-кнопок и самостоятельных action-ссылок. Не применять к обычной inline-ссылке внутри Body-текста только из-за кликабельности. Пара: Mobile/Action. Roboto Medium, 16px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Mobile/Display`

Главный выразительный текст Mobile для Hero-заголовка и крупного результата операции. Не использовать как обычный заголовок блока или карточки. Пара: Desktop/Display. Roboto Bold, 20px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Mobile/Heading`

Основной заголовок самостоятельного контентного блока в Mobile. В Banner/Secondary также выполняет мобильную роль компактного заголовка. Не использовать для Hero или заголовка карточки. Основная пара: Desktop/Heading. Roboto SemiBold, 18px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Mobile/Title`

Заголовок карточки или внутренней сущности в Mobile, включая имя партнёра и локальный результат внутри блока. Не использовать как заголовок самостоятельного блока. Пара: Desktop/Title. Roboto Medium, 16px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Mobile/Body/Large`

Основной содержательный текст и значения в Mobile. Использовать для основной читаемой информации блока; не применять к Caption или CTA. Основная desktop-пара: Desktop/Body/Large; точный выбор задаёт контракт компонента. Roboto Regular, 14px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Mobile/Body/Medium`

Компактный информационный и вспомогательный текст в Mobile. Использовать только там, где компоненту нужен более плотный уровень Body; не подменять им Caption. Основная desktop-пара: Desktop/Body/Medium; точный выбор задаёт контракт компонента. Roboto Regular, 12px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Mobile/Caption`

Вспомогательный, предупреждающий и юридический текст в Mobile: дисклеймеры, сроки действия и второстепенные пояснения. Не использовать как Mobile/Body/Medium только из-за совпадения параметров. Пара: Desktop/Caption. Roboto Regular, 12px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### `Mobile/Action`

CTA-текст в Mobile внутри Primary/Secondary-кнопок, store-кнопок и самостоятельных action-ссылок. Не применять к обычной inline-ссылке внутри Body-текста только из-за кликабельности. Пара: Desktop/Action. Roboto Medium, 14px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

## Текущие компоненты-потребители

Перечни ниже получены по связанным текстовым слоям на странице `Email Components`. Они показывают наличие стиля внутри component set, но не означают, что стиль применяется к каждому текстовому слою компонента.

### `Desktop/Display`

`Block/Transaction-Success`, `Block/Transaction-Error`, `Banner/Hero`.

### `Desktop/Heading`

`NPS/Options`, `Block/Contact-Support`, `Block/Personal-Data-Update`, `Block/Receipt-Info`, `Block/Cards-Images`, `Block/Icon-Cards`, `Block/Steps`, `Block/Content`, `Block/Bullet-List`, `Block/Icon-List`.

### `Desktop/Title`

`Block/Cards-Images`, `Block/Icon-Cards`, `Block/Transaction-Success`, `Block/Transaction-Error`, `Card/Image`, `Card/Icon`.

### `Desktop/Heading/Compact`

`Banner/Secondary`.

### `Desktop/Body/Large`

`Block/Instruction-Steps`, `Block/Personal-Data-Update`, `Block/Icon-List`, `Block/Steps`, `Block/Content`, `Block/Bullet-List`, `Block/Transaction-Error`, `Banner/Fiscal-Check-Link`, `Block/Contact-Support`, `Banner/Hero`, `Item/Bullet`, `Item/Step`, `Banner/Inline`, `Block/Info-Alert`, `Banner/App-Download`.

### `Desktop/Body/Medium`

`Details/Transfer`, `Block/Transaction-Success`, `Details/Receipt`, `Block/Receipt-Info`, `Details/Operation`, `Block/Steps`, `Details/Suspicious-Operation`, `Block/Personal-Data-Update`, `Block/Bullet-List`, `Details/Operation-Plain`, `Block/Cards-Images`, `Block/Icon-Cards`, `Badge/Operation-Status`, `Badge/Step-Number`, `Block/Content`, `Item/Bullet`, `Item/Step`, `Block/Transaction-Error`, `Block/Contact-Support`, `Banner/Secondary`, `Card/Image`, `Card/Icon`, `Item/Alert`, `Item/Notification`.

### `Desktop/Caption`

`Email/Footer`, `Block/Transaction-Error`, `Block/Personal-Data-Update`, `Block/Transaction-Success`, `Block/Instruction-Steps`, `Email/Footer-Legal`, `Block/Cards-Images`, `Block/Icon-Cards`, `Block/Steps`, `Block/Content`, `Block/Bullet-List`, `Block/Icon-List`.

### `Desktop/Action`

`Block/Cards-Images`, `Block/Icon-Cards`, `Block/Bullet-List`, `Banner/Hero`, `Block/Steps`, `Button/Secondary`, `Button/Primary`, `Block/Content`, `Banner/Secondary`, `Item/Bullet`, `Card/Image`, `Block/Icon-List`, `Card/Icon`.

### `Mobile/Display`

`Block/Transaction-Success`, `Block/Transaction-Error`, `Banner/Hero`.

### `Mobile/Heading`

`NPS/Options`, `Block/Contact-Support`, `Block/Personal-Data-Update`, `Block/Receipt-Info`, `Block/Cards-Images`, `Block/Icon-Cards`, `Block/Steps`, `Block/Content`, `Banner/Secondary`, `Block/Bullet-List`, `Block/Icon-List`.

### `Mobile/Title`

`Block/Cards-Images`, `Block/Icon-Cards`, `Block/Transaction-Success`, `Block/Transaction-Error`, `Card/Image`, `Card/Icon`.

### `Mobile/Body/Large`

`Details/Transfer`, `Details/Receipt`, `Block/Receipt-Info`, `Block/Instruction-Steps`, `Block/Transaction-Success`, `Details/Operation`, `Block/Personal-Data-Update`, `Block/Steps`, `Details/Suspicious-Operation`, `Details/Operation-Plain`, `Block/Cards-Images`, `Block/Icon-Cards`, `Block/Icon-List`, `Block/Content`, `Block/Bullet-List`, `Block/Transaction-Error`, `Banner/Fiscal-Check-Link`, `Badge/Step-Number`, `Item/Step`, `Block/Contact-Support`, `Banner/Hero`, `Banner/Secondary`, `Item/Bullet`, `Banner/Inline`, `Block/Info-Alert`, `Banner/App-Download`, `Card/Image`, `Card/Icon`.

### `Mobile/Body/Medium`

`Block/Instruction-Steps`, `Block/Steps`, `Block/Bullet-List`, `Block/Transaction-Success`, `Badge/Operation-Status`, `Block/Transaction-Error`, `Block/Content`, `Item/Bullet`, `Block/Contact-Support`, `Block/Personal-Data-Update`, `Item/Step`, `Item/Alert`, `Item/Notification`.

### `Mobile/Caption`

`Email/Footer`, `Block/Transaction-Error`, `Block/Personal-Data-Update`, `Email/Footer-Legal`, `Block/Instruction-Steps`, `Block/Cards-Images`, `Block/Icon-Cards`, `Block/Steps`, `Block/Content`, `Block/Bullet-List`, `Block/Icon-List`.

### `Mobile/Action`

`Block/Cards-Images`, `Block/Icon-Cards`, `Block/Bullet-List`, `Banner/App-Download`, `Banner/Hero`, `Block/Steps`, `Button/Secondary`, `Button/Primary`, `Block/Content`, `Banner/Secondary`, `Item/Bullet`, `Card/Image`, `Block/Icon-List`, `Card/Icon`.

## Правила актуализации реестра

Обновляй этот файл в той же задаче, если в Figma:

- создан или удалён текстовый стиль;
- изменены имя, семейство, начертание, размер, line-height или letter-spacing;
- изменилось семантическое назначение стиля;
- компонент начал или перестал использовать стиль;
- появился новый viewport-вариант или отдельный семантический вариант;
- стиль помечен как Deprecated или окончательно удалён.

При обновлении:

1. Проверь фактическое определение стиля в Figma.
2. Проверь связанные текстовые слои на всех релевантных страницах.
3. Обнови каталог, семантическое применение и список компонентов-потребителей.
4. Не меняй глобальные правила типографики только ради фиксации нового факта библиотеки.
5. Не удаляй Deprecated-стиль, пока постраничный аудит не подтвердит отсутствие связанных текстовых сегментов.
6. После записи повторно сверь число стилей, имена, параметры и ограниченность GitHub diff.

## Границы начальной версии

В этой версии зафиксированы текущие стили, фактические параметры и потребители. Полные нормативные правила создания новых ролей, требования к descriptions и порядок применения типографики при вёрстке будут вынесены в отдельный стандарт в `core/` после отдельного согласования.
