<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->
<!-- renderer: typography-registry -->
<!-- source-digest: sha256:5974c4bd437a4ec3fda7be8b5aff07ef9c79960db37252695b137eeb2d330ff7 -->
<!-- schema-versions: components=2.1.0, typography=1.0.0 -->
# CUPIS typography registry

Typography definitions come from the structured foundation. Consumers are computed from component contracts.

## Responsive pairs

- Responsive pair `action` — role `action`; Desktop `desktop-action`; Mobile `mobile-action`.
- Responsive pair `body-large` — role `body`; Desktop `desktop-body-large`; Mobile `mobile-body-large`.
- Responsive pair `body-medium` — role `body`; Desktop `desktop-body-medium`; Mobile `mobile-body-medium`.
- Responsive pair `caption` — role `caption`; Desktop `desktop-caption`; Mobile `mobile-caption`.
- Responsive pair `display` — role `display`; Desktop `desktop-display`; Mobile `mobile-display`.
- Responsive pair `heading` — role `heading`; Desktop `desktop-heading`; Mobile `mobile-heading`.
- Responsive pair `heading-compact` — role `heading`; Desktop `desktop-heading-compact`; Mobile `mobile-heading`.
- Responsive pair `title` — role `title`; Desktop `desktop-title`; Mobile `mobile-title`.

## Styles

### Desktop/Action

- Stable ID: `desktop-action`
- Viewport: `desktop`
- Role: `action`
- Variant: `default`
- Font: `Roboto` `Medium`; CSS weight `500`
- Font size: `16px`
- Line-height: `140%`
- Letter-spacing: `0%`
- Responsive pair: `action`
- Consumers: none
- Figma description: CTA-текст в Desktop внутри Primary/Secondary-кнопок и самостоятельных action-ссылок. Не применять к обычной inline-ссылке внутри Body-текста только из-за кликабельности. Пара: Mobile/Action. Roboto Medium, 16px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Desktop/Body/Large

- Stable ID: `desktop-body-large`
- Viewport: `desktop`
- Role: `body`
- Variant: `large`
- Font: `Roboto` `Regular`; CSS weight `400`
- Font size: `18px`
- Line-height: `140%`
- Letter-spacing: `0%`
- Responsive pair: `body-large`
- Consumers: none
- Figma description: Основной или акцентный содержательный текст в Desktop. Использовать для заметного текста блока; не применять к плотным подписям и значениям только ради увеличения размера. Основная мобильная пара: Mobile/Body/Large. Roboto Regular, 18px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Desktop/Body/Medium

- Stable ID: `desktop-body-medium`
- Viewport: `desktop`
- Role: `body`
- Variant: `medium`
- Font: `Roboto` `Regular`; CSS weight `400`
- Font size: `16px`
- Line-height: `140%`
- Letter-spacing: `0%`
- Responsive pair: `body-medium`
- Consumers: none
- Figma description: Плотный информационный и вспомогательный текст в Desktop: подписи, значения и описания внутри компонентов. Не использовать как Caption или CTA. Основная мобильная пара: Mobile/Body/Medium; точный выбор задаёт контракт компонента. Roboto Regular, 16px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Desktop/Caption

- Stable ID: `desktop-caption`
- Viewport: `desktop`
- Role: `caption`
- Variant: `default`
- Font: `Roboto` `Regular`; CSS weight `400`
- Font size: `14px`
- Line-height: `140%`
- Letter-spacing: `0%`
- Responsive pair: `caption`
- Consumers: none
- Figma description: Вспомогательный, предупреждающий и юридический текст в Desktop: дисклеймеры, сроки действия и второстепенные пояснения. Не использовать для основного содержательного текста. Пара: Mobile/Caption. Roboto Regular, 14px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Desktop/Display

- Stable ID: `desktop-display`
- Viewport: `desktop`
- Role: `display`
- Variant: `default`
- Font: `Roboto` `Bold`; CSS weight `700`
- Font size: `32px`
- Line-height: `120%`
- Letter-spacing: `0%`
- Responsive pair: `display`
- Consumers: none
- Figma description: Главный выразительный текст Desktop для Hero-заголовка и крупного результата операции. Не использовать как обычный заголовок блока или карточки. Пара: Mobile/Display. Roboto Bold, 32px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Desktop/Heading

- Stable ID: `desktop-heading`
- Viewport: `desktop`
- Role: `heading`
- Variant: `default`
- Font: `Roboto` `SemiBold`; CSS weight `600`
- Font size: `26px`
- Line-height: `120%`
- Letter-spacing: `0%`
- Responsive pair: `heading`
- Consumers: none
- Figma description: Основной заголовок самостоятельного контентного блока в Desktop. Не использовать для Hero или заголовка карточки. Пара: Mobile/Heading. Roboto SemiBold, 26px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Desktop/Heading/Compact

- Stable ID: `desktop-heading-compact`
- Viewport: `desktop`
- Role: `heading`
- Variant: `compact`
- Font: `Roboto` `SemiBold`; CSS weight `600`
- Font size: `20px`
- Line-height: `120%`
- Letter-spacing: `0%`
- Responsive pair: `heading-compact`
- Consumers: none
- Figma description: Компактный заголовок Desktop для ограниченного текстового контейнера; сейчас используется в Banner/Secondary. Не заменять обычным Desktop/Heading без проверки макета и контракта компонента. Мобильная роль: Mobile/Heading. Roboto SemiBold, 20px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Desktop/Title

- Stable ID: `desktop-title`
- Viewport: `desktop`
- Role: `title`
- Variant: `default`
- Font: `Roboto` `Medium`; CSS weight `500`
- Font size: `20px`
- Line-height: `120%`
- Letter-spacing: `0%`
- Responsive pair: `title`
- Consumers: none
- Figma description: Заголовок карточки или внутренней сущности в Desktop, включая имя партнёра и локальный результат внутри блока. Не использовать как заголовок самостоятельного блока. Пара: Mobile/Title. Roboto Medium, 20px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Mobile/Action

- Stable ID: `mobile-action`
- Viewport: `mobile`
- Role: `action`
- Variant: `default`
- Font: `Roboto` `Medium`; CSS weight `500`
- Font size: `14px`
- Line-height: `140%`
- Letter-spacing: `0%`
- Responsive pair: `action`
- Consumers: none
- Figma description: CTA-текст в Mobile внутри Primary/Secondary-кнопок, store-кнопок и самостоятельных action-ссылок. Не применять к обычной inline-ссылке внутри Body-текста только из-за кликабельности. Пара: Desktop/Action. Roboto Medium, 14px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Mobile/Body/Large

- Stable ID: `mobile-body-large`
- Viewport: `mobile`
- Role: `body`
- Variant: `large`
- Font: `Roboto` `Regular`; CSS weight `400`
- Font size: `14px`
- Line-height: `140%`
- Letter-spacing: `0%`
- Responsive pair: `body-large`
- Consumers: none
- Figma description: Основной содержательный текст и значения в Mobile. Использовать для основной читаемой информации блока; не применять к Caption или CTA. Основная desktop-пара: Desktop/Body/Large; точный выбор задаёт контракт компонента. Roboto Regular, 14px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Mobile/Body/Medium

- Stable ID: `mobile-body-medium`
- Viewport: `mobile`
- Role: `body`
- Variant: `medium`
- Font: `Roboto` `Regular`; CSS weight `400`
- Font size: `12px`
- Line-height: `140%`
- Letter-spacing: `0%`
- Responsive pair: `body-medium`
- Consumers: none
- Figma description: Компактный информационный и вспомогательный текст в Mobile. Использовать только там, где компоненту нужен более плотный уровень Body; не подменять им Caption. Основная desktop-пара: Desktop/Body/Medium; точный выбор задаёт контракт компонента. Roboto Regular, 12px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Mobile/Caption

- Stable ID: `mobile-caption`
- Viewport: `mobile`
- Role: `caption`
- Variant: `default`
- Font: `Roboto` `Regular`; CSS weight `400`
- Font size: `12px`
- Line-height: `140%`
- Letter-spacing: `0%`
- Responsive pair: `caption`
- Consumers: none
- Figma description: Вспомогательный, предупреждающий и юридический текст в Mobile: дисклеймеры, сроки действия и второстепенные пояснения. Не использовать как Mobile/Body/Medium только из-за совпадения параметров. Пара: Desktop/Caption. Roboto Regular, 12px, line-height 140%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Mobile/Display

- Stable ID: `mobile-display`
- Viewport: `mobile`
- Role: `display`
- Variant: `default`
- Font: `Roboto` `Bold`; CSS weight `700`
- Font size: `20px`
- Line-height: `120%`
- Letter-spacing: `0%`
- Responsive pair: `display`
- Consumers: none
- Figma description: Главный выразительный текст Mobile для Hero-заголовка и крупного результата операции. Не использовать как обычный заголовок блока или карточки. Пара: Desktop/Display. Roboto Bold, 20px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Mobile/Heading

- Stable ID: `mobile-heading`
- Viewport: `mobile`
- Role: `heading`
- Variant: `default`
- Font: `Roboto` `SemiBold`; CSS weight `600`
- Font size: `18px`
- Line-height: `120%`
- Letter-spacing: `0%`
- Responsive pair: `heading`
- Consumers: none
- Figma description: Основной заголовок самостоятельного контентного блока в Mobile. В Banner/Secondary также выполняет мобильную роль компактного заголовка. Не использовать для Hero или заголовка карточки. Основная пара: Desktop/Heading. Roboto SemiBold, 18px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.

### Mobile/Title

- Stable ID: `mobile-title`
- Viewport: `mobile`
- Role: `title`
- Variant: `default`
- Font: `Roboto` `Medium`; CSS weight `500`
- Font size: `16px`
- Line-height: `120%`
- Letter-spacing: `0%`
- Responsive pair: `title`
- Consumers: none
- Figma description: Заголовок карточки или внутренней сущности в Mobile, включая имя партнёра и локальный результат внутри блока. Не использовать как заголовок самостоятельного блока. Пара: Desktop/Title. Roboto Medium, 16px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.
