# CUPIS Spacing Foundation Design

**Статус:** draft — частичная прямая Figma-проверка Checkpoint 3; полное подтверждение ещё не достигнуто
**Базовый commit:** `f46985e57b2058f86f91b78de8e37600b766c21c`  
**Источник фактических значений для этого документа:** актуальный `registry/email-component-descriptions-registry.md` на базовом commit; ранее согласованные результаты аудита библиотеки.

## 1. Назначение

Этот документ определяет золотое правило отступов для поддержки и разработки CUPIS email-библиотеки.

Правило отвечает только на вопрос:

> Как при создании или изменении компонента выбрать и зафиксировать точные Mobile- и Desktop-отступы, не нарушив пространственную логику библиотеки?

Правило не участвует в вёрстке конкретного письма. HTML-сборка не классифицирует расстояния, не выбирает spacing role и не сверяет компонент с foundation. Она использует только уже зафиксированные точные значения конкретного Figma-инстанса и component contract в реестре.

## 2. Область ответственности

Золотое правило применяется только в маршрутах:

- поддержка библиотеки;
- разработка нового компонента;
- структурное изменение существующего компонента;
- аудит и исправление spacing bindings;
- подготовка или обновление component Description и записи реестра.

Золотое правило не применяется в маршрутах:

- `email-new-build`;
- `email-continue-fix`;
- рендеринг или тестирование конкретного HTML-письма;
- экспорт изображений;
- выбор типографики, цвета, радиуса или размеров assets.

Будущие structured spacing sources не должны входить в email-build bundle profiles. Вёрстка получает только точные component values через активные источники конкретного письма.

## 3. Золотое правило

> Каждый отступ определяется смыслом отношения и единственным владельцем, а не совпадением чисел или названием компонента. При разработке библиотеки сначала определяется тип отношения, затем его владелец, после этого независимо разрешаются Mobile и Desktop, выбирается подтверждённая semantic role и получается одно точное целое значение. Результат фиксируется в Figma и component contract. HTML-вёрстка только воспроизводит эти значения и не выполняет данный алгоритм.

Обязательный порядок:

```text
relationship
→ owner
→ viewport
→ semantic role
→ exact integer value
→ Figma geometry/binding
→ Description and registry contract
```

Одинаковое число в разных отношениях не объединяет их в одну роль. Например, внешний отступ блока и внутренний section gap могут оба быть равны `16px` Mobile / `24px` Desktop, но имеют разных владельцев и остаются разными ролями.

## 4. Словарь отношений

| Relationship | Что разделяет | Допустимый владелец |
|---|---|---|
| `email-outer-flow` | верхнеуровневый блок и предшествующий блок письма | top-level component root |
| `email-common-inset` | общий край email-wrapper и обычный контентный блок | email shell |
| `component-self-inset` | край email-wrapper и self-inset-компонент | top-level component root |
| `component-container-padding` | граница самостоятельной поверхности и её контент | component content container |
| `component-section-stack` | крупные смысловые секции внутри поверхности | component content container |
| `collection-section-stack` | heading, коллекция и optional caption | collection container |
| `repeated-visual-item-stack` | соседние крупные визуальные карточки | repeated-item parent |
| `details-row-stack` | строки компактной таблицы реквизитов | details rows parent |
| `inline-peer-gap` | равноправные элементы одной строки или композиции | непосредственный inline parent |
| `text-stack` | связанные текстовые элементы одной группы | text group |
| `asset-to-content` | семантический asset и связанный с ним живой контент | их непосредственный parent |
| `control-content` | элементы внутри кнопки, бейджа или другого контрола | interactive control |
| `fixed-geometry-offset` | расстояние, являющееся частью фиксированной геометрии | компонент, владеющий геометрией |
| `optical-compensation` | подтверждённая визуальная компенсация | конкретный компонент и viewport |

У каждого фактического расстояния должен быть ровно один владелец. Родитель и вложенный компонент не могут одновременно задавать один и тот же интервал.

## 5. Подтверждённые системные роли

Эти роли описывают повторяющуюся основную структуру библиотеки. Имена являются foundation IDs, а не обязательными именами Figma variables; привязка к конкретным variable names будет зафиксирована отдельно на этапе structured data.

| Role ID | Назначение | Mobile | Desktop |
|---|---|---:|---:|
| `outer-flow` | внешний вертикальный ритм верхнеуровневого блока | 16px | 24px |
| `common-horizontal-inset` | общий боковой inset обычных блоков | 16px | 24px |
| `self-horizontal-inset` | боковой inset self-inset-блока | 16px | 24px |
| `surface-padding-primary` | padding основной самостоятельной контентной поверхности | 22px | 32px |
| `surface-padding-compact` | padding вложенной или компактной поверхности | 16px | 24px |
| `section-stack-standard` | основной интервал между крупными секциями | 16px | 24px |
| `collection-stack-spacious` | heading → collection → caption в блоках-коллекциях | 22px | 32px |
| `visual-item-stack` | интервал между крупными визуальными карточками | 22px | 24px |
| `details-row-stack` | строки компактных details-таблиц | 12px | 16px |
| `inline-peer-standard` | крупные равноправные элементы строки или композиции | 16px | 24px |
| `inline-peer-compact` | компактные равноправные элементы | 8px | 12px |
| `text-stack-standard` | обычный heading/body/caption stack | 8px | 12px |
| `text-stack-tight` | тесно связанные строки одного элемента | 4px | 6px |
| `asset-to-content-standard` | крупный asset рядом со связанным контентом | 16px | 24px |
| `asset-to-content-compact` | компактный asset рядом с контентом | 8px | 12px |

Численно одинаковые пары сохраняются как отдельные роли, когда различаются relationship или owner.

## 6. Правило выбора для нового компонента

### 6.1 Верхнеуровневое размещение

- Самостоятельный верхнеуровневый компонент получает `outer-flow` ровно один раз.
- Вложенный item, alert, notification, details или другая внутренняя часть не получает собственного внешнего отступа.
- Обычный контентный блок использует `common-horizontal-inset`, которым владеет email shell.
- Self-inset-компонент использует `self-horizontal-inset`, которым владеет его root.
- Full-width-компонент не получает горизонтальный inset только из-за значения `outer-flow`.

### 6.2 Padding поверхности

Использовать `surface-padding-primary`, если поверхность:

- является самостоятельным крупным контентным блоком;
- содержит несколько смысловых секций;
- формирует основную белую карточку письма.

Использовать `surface-padding-compact`, если поверхность:

- вложена в другой компонент;
- является компактным alert, notification, row или inline-banner;
- выполняет локальную вспомогательную функцию.

Интерактивный control не выбирает padding поверхности. Его padding относится к `control-content` и задаётся собственным component contract.

### 6.3 Интервалы между секциями и элементами

- Обычные крупные секции последовательного content flow используют `section-stack-standard`.
- Heading, коллекция самостоятельных карточек и optional caption используют `collection-stack-spacious`.
- Соседние крупные визуальные карточки внутри такой коллекции используют `visual-item-stack`.
- Компактные rows реквизитов используют `details-row-stack`.
- Крупные равноправные элементы горизонтальной или адаптивной композиции используют `inline-peer-standard`.
- Компактные одноуровневые элементы используют `inline-peer-compact`.

### 6.4 Текст и assets

- Обычная группа heading/body/caption использует `text-stack-standard`.
- Строки, образующие один тесно связанный текстовый элемент, используют `text-stack-tight`.
- Крупная иконка, badge или изображение рядом со связанным живым контентом использует `asset-to-content-standard`.
- Небольшая иконка внутри компактного элемента использует `asset-to-content-compact`.
- Если расстояние является частью геометрии button, badge или другого control, применяется точное значение его component contract, а не роль поверхности или текста.

## 7. Локальные точные значения

Не каждое повторяемое число обязано становиться foundation role. Значение остаётся локальным component value, если одновременно выполняются условия:

1. расстояние находится внутри небольшого самостоятельного элемента;
2. оно не управляет внешним ритмом, основным padding или основными секциями блока;
3. его точное значение явно зафиксировано в компоненте и реестре;
4. оно не требуется как общее решение для создания других компонентов.

К текущим допустимым локальным решениям относятся, например:

- внутренние padding кнопок и бейджей;
- `12px / 16px` между элементами `Item/Alert`;
- `16px / 20px` между элементами `Item/Notification`;
- фиксированные gaps store-buttons;
- особый текстовый ритм Hero;
- локальные расстояния внутри details row;
- расстояния, вызванные фиксированной геометрией конкретного control.

Локальное значение не является исключением и не добавляется в общий foundation, пока оно соответствует этим условиям.

## 8. Расширение foundation и исключения

Если новое отношение управляет основной структурой, но ни одна подтверждённая роль не подходит, поддержка библиотеки должна остановиться с результатом:

```text
new universal spacing relationship required
```

После этого необходимо:

1. описать новое relationship и owner;
2. показать, почему существующие роли не подходят;
3. проверить применимость не только к одному компоненту;
4. определить точные Mobile- и Desktop-значения;
5. получить одобрение пользователя;
6. только затем расширить foundation.

Запрещено:

- выбирать ближайшее число;
- использовать диапазон;
- наследовать Desktop из Mobile или наоборот;
- создавать скрытое исключение для завершения задачи;
- считать равные числа доказательством общей роли.

Настоящее исключение допустимо только для подтверждённой optical compensation или неизбежной component-specific структуры. Оно должно содержать stable ID, component reference, viewport, relationship path, exact value, reason category, human-approved rationale и evidence reference. Формулировки «так красивее» или «значение отличается» недостаточны.

## 9. Design-time и build-time

### Library design-time

Поддержка библиотеки может:

- анализировать структуру нового или изменяемого компонента;
- применять decision tree;
- выбирать одну подтверждённую роль;
- получать одно точное значение для каждого viewport;
- блокировать изменение, если отношения не представлены;
- предлагать расширение foundation.

Результат design-time обязан быть записан в Figma geometry/binding и затем синхронизирован в Description и реестр.

### Email build-time

Вёрстка письма:

- не загружает spacing foundation;
- не вызывает spacing resolver;
- не классифицирует relationship;
- не выбирает role;
- не проверяет соответствие золотому правилу;
- не получает candidates, ranges, recommendations или confidence;
- использует только точные значения конкретного инстанса и component contract.

Если обязательное точное значение отсутствует или источники конфликтуют, это обычный blocker неполного component contract. Вёрстка не пытается восстановить значение через золотое правило.

## 10. Интерфейс будущей structured foundation

Foundation предоставляет только design-time интерфейс:

```text
resolveDesignSpacing(role_id, viewport)
→ exact integer
or
→ typed design-time blocker
```

Будущий structured component contract сохраняет:

```text
relationship
owner
viewport
role_reference
resolved_exact_value
```

Build-facing representation сохраняет только:

```text
viewport
resolved_exact_value
```

Ни spacing source, ни `role_reference` не требуются HTML-сборке.

## 11. Проверка на текущих семействах

| Семейство | Объяснение текущего ритма |
|---|---|
| Header, Footer, Footer-Legal | один `outer-flow`; full-width без общего inset; внутренний footer-body использует compact padding и standard section stack |
| Основные Block-компоненты | `common-horizontal-inset` + `outer-flow` + `surface-padding-primary` + `section-stack-standard` |
| Cards-Images, Icon-Cards, Icon-List | primary surface; spacious collection stack; отдельный visual item stack |
| Hero и Secondary | primary content-area; standard section/asset relationships; viewport-композиции разрешаются независимо |
| Inline и standalone Info-Alert | compact surface; точные локальные внутренние gaps остаются component values |
| App-Download и NPS | обычный или self inset согласно root; primary surface; store/control geometry остаётся локальной |
| Item/Alert и Item/Notification | без outer-flow; compact surface; собственный локальный content gap |
| Transaction, Receipt, Personal-Data | primary surface; standard section and asset-to-content roles |
| Details-компоненты | без outer-flow и внешнего padding; `details-row-stack`; label/value micro-spacing остаётся локальным |
| Buttons и Badges | fixed control geometry; не используют правила padding поверхности |

Эта матрица показывает, что текущие значения объясняются системными ролями либо допустимыми локальными component values. Она не заменяет фактические записи реестра и не объявляет Figma variable bindings без отдельного подтверждения.

## 12. Сценарии будущих компонентов

1. **Обычный content block:** outer-flow → common inset → primary surface → standard section stack.
2. **Full-width banner:** outer-flow → без common inset → собственный content container по semantic role.
3. **Self-inset block:** outer-flow + self inset → выбранная surface role.
4. **Icon + text item:** без outer-flow, если вложен; asset-to-content role + text-stack role.
5. **Коллекция больших карточек:** primary surface → spacious collection stack → visual item stack.
6. **Heading + body + optional caption:** text-stack-standard; caption не создаёт новый section gap, если остаётся частью той же text group.
7. **Button с иконкой и HTML-текстом:** только control contract; surface roles не применяются.
8. **Родительский блок с nested alert:** outer-flow принадлежит родителю; alert использует compact surface и локальный gap.
9. **Mobile vertical / Desktop horizontal:** relationship сохраняется, но role и exact value разрешаются отдельно для каждого viewport.

Если сценарий не даёт однозначного результата, создание компонента останавливается до расширения foundation.

## 13. Инварианты

- Один верхнеуровневый компонент — один внешний top spacing.
- Mobile outer-flow равен `16px`; Desktop outer-flow равен `24px`.
- Вложенные элементы не создают внешний ритм письма.
- Common inset и self inset не применяются одновременно.
- Container padding не используется как внешний inset.
- Значение не определяет semantic role.
- У одного расстояния ровно один owner.
- Mobile и Desktop не наследуют значения друг от друга.
- Основные структурные расстояния используют foundation roles.
- Локальные точные значения не становятся глобальными автоматически.
- HTML-вёрстка не применяет и не проверяет золотое правило.

## 14. Не входит в этот этап

Этот документ не разрешает:

- изменение Figma;
- изменение component Description;
- изменение реестра;
- изменение общей HTML-инструкции;
- изменение email-build checkpoint;
- подключение spacing source к email-build bundles;
- создание schema, YAML, resolver или tests до отдельного подтверждения документа;
- миграцию component contracts;
- изменение типографики, assets, цветов, размеров или радиусов.

## 15. Критерии принятия документа

Документ готов к следующему этапу, если пользователь подтверждает, что:

- золотое правило принадлежит только поддержке библиотеки;
- HTML использует только фактические точные значения;
- основной пространственный ритм текущей библиотеки объяснён;
- локальные значения не насильно превращены в глобальные роли;
- выбор для нового компонента детерминирован;
- неизвестное структурное отношение вызывает foundation-extension blocker;
- Mobile и Desktop разрешаются независимо;
- документ не меняет текущий дизайн или поведение писем.

## 16. Статус фактической Figma-проверки (2026-09-16)

Этот документ остаётся черновиком. Прямая read-only проверка Figma зафиксирована в `tests/fixtures/foundation/spacing-figma-capture.json` и аудите `docs/superpowers/audits/2026-09-16-spacing-figma-evidence-audit.md`.

- 12 из 15 ролей подтверждены для Mobile и Desktop прямой цепочкой: Figma node → exact field → FLOAT variable. Их structured provenance содержит только конкретные Figma-данные.
- `outer-flow`, `common-horizontal-inset` и `inline-peer-standard` остаются неподтверждёнными для обоих viewport. Их числа не меняются, но provenance остаётся `registry-literal`; это не является Figma-подтверждением.
- Полный статус не присваивается, пока каждая роль и каждый viewport не будут подтверждены без подмены relationship или owner.

Результат не меняет значения отступов, не меняет component contracts и не передаёт design-time relationship, owner, binding или provenance в HTML bundle.
