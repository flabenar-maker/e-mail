# Стандарт Figma Component Description

## Назначение

Figma Description — короткая автоматически формируемая подсказка рядом с компонентом. Она помогает быстро распознать компонент и увидеть только те исключения, которые опасно пропустить при его использовании.

Figma Description не является источником HTML-вёрстки и не содержит полный component contract. Полные и проверяемые факты хранятся в structured component record и выводятся в generated registry.

## Единственный формат

Поля выводятся строго в таком порядке:

~~~text
CUPIS ID: <stable-id>
PURPOSE: <one sentence>
RENDER: HTML | ASSET | HYBRID

CRITICAL
- <only selected critical constraints>
~~~

Правила форматирования:

- `CUPIS ID`, `PURPOSE` и `RENDER` обязательны;
- между `RENDER` и `CRITICAL` — одна пустая строка;
- секция `CRITICAL` полностью отсутствует, если список пуст;
- каждый critical constraint выводится отдельным пунктом;
- переносы строк нормализуются в LF;
- одинаковый component record всегда даёт побайтово одинаковый результат;
- произвольный текст до, после или между секциями не добавляется.

## Источники полей

### CUPIS ID

Берётся из стабильного ID component record. Имя Figma-компонента, название variant и node ID не используются вместо него.

### PURPOSE

Берётся только из поля `purpose` той же component-записи. Это одно предложение о функции компонента, без геометрии, перечня свойств и общих правил письма.

### RENDER

Тип выводится детерминированно из полного contract:

- `HTML` — значимый production-результат собирается email-разметкой, а экспортируемый визуальный asset не является владельцем блока;
- `ASSET` — production-результат компонента представляет один экспортируемый визуальный asset;
- `HYBRID` — HTML-структура компонента использует один или несколько экспортируемых визуальных assets.

Тип нельзя выбирать вручную отдельно от component record.

### CRITICAL

Секция получает только constraints, на которые ссылается `critical_constraint_ids` component record.

Допустимые категории:

- необычное responsive behavior, которое нельзя надёжно вывести из обычной структуры;
- составная или нетривиальная export boundary;
- неочевидный side effect component property;
- component-specific ограничение email-реализации, без которого результат может выглядеть правдоподобно, но быть неверным.

Обычные размеры, стандартные padding/gaps, полный перечень properties, повтор структуры Mobile/Desktop и общие foundation rules не становятся CRITICAL.

## Что не входит в Description

Figma Description не содержит:

- полный Mobile- или Desktop-contract;
- таблицы typography или spacing;
- определения foundations и списки допустимых значений;
- полный перечень variants и properties;
- provenance, fingerprint, file key или node IDs;
- правила сборки целого письма;
- порядок maintenance, onboarding, экспорта или HTML-проверки;
- сведения, которых нет в component record;
- ручные пояснения, дублирующие generated registry.

Такое разделение сохраняет Description коротким и не заставляет поддерживать две полные версии документации.

## Documentation link

`Documentation link` хранится отдельным полем Figma и не вставляется в текст Description. Ссылка ведёт к опубликованной полной generated-документации компонента или к её устойчивой точке входа.

Отсутствие ссылки не меняет component contract и не блокирует HTML build. Некорректная ссылка считается отдельным metadata drift.

## Генерация и синхронизация

Description создаётся только детерминированным renderer из валидированного component record. Ручное редактирование сгенерированного текста не допускается.

Порядок синхронизации:

1. Изменить canonical component record в GitHub.
2. Выполнить schema-, semantic- и cross-reference-проверки.
3. Сгенерировать полный registry и ожидаемый compact Description.
4. Показать пользователю точный old → new diff и impact report.
5. После отдельного разрешения изменить только allowlisted Description и, если отдельно согласовано, Documentation link.
6. Использовать только Figma MCP.
7. Отдельным read-only запросом проверить записанный текст и неизменность structural fingerprint.

Разрешение на Description не включает geometry, hierarchy, Auto Layout, variants, properties, bindings, asset suffixes или дизайн.

## Граница с HTML build

Маршруты сборки письма получают выбранные resolved component contracts. Они не получают этот стандарт и не читают Figma Description для восстановления размеров, адаптивности, ассетов или структуры.

Поэтому отсутствие, устаревание или временная недоступность Figma Description не должны менять результат HTML-вёрстки, если canonical record и generated contract актуальны.
