# CUPIS: обновлённые карточные блоки после cutover — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans для последовательной реализации. Шаги отмечаются чекбоксами. Рутинные тесты и visual regression делегируются GPT-5.6 Terra с reasoning medium; координатор получает краткий итог, не полные test logs.

**Goal:** После переключения поддержки синхронизировать три изменённых маркетинговых блока с фактической библиотекой Figma, сохранив адаптивность и точное выравнивание в HTML-письмах.

**Architecture:** Figma задаёт проверенные факты; structured contracts сохраняют структуру, значения и поведение; generated registry и route bundles производны. Новые кнопки используют существующий Button/Secondary. Новая обёртка иконки передаётся в контракт, а не компенсируется случайными CSS-исключениями. Переименование не меняет идентичность узлов или export owner.

**Tech Stack:** Figma MCP, Node.js 24, YAML contracts, существующий табличный email renderer, GitHub CLI для облачных правок, изолированные локальные снимки для проверок.

**Spec:** Пользовательская задача от 01.10.2026 по Block/Cards-Images, Block/Icon-Cards и Block/Icon-List и последующее решение выполнять её после переключения системы; [component standard](../../../core/component-contract-standard.md), [Figma library standard](../../../core/figma-library-standard.md), [description standard](../../../core/figma-component-description-standard.md), [cutover plan](2026-10-01-cupis-final-maintenance-cutover.md), [roadmap](2026-08-25-cupis-migration-roadmap.md).

## Статус и граница этого PR

- База анализа: `main@6c0bf7d0d3b1ca7909b692541883d2b0e9788709`, после слияния PR #108.
- Выполнены read-only чтения параметров, структуры, property bindings и изображений компонентов через Figma MCP; сопоставлены исходные Card/Image и Card/Icon с вложенными инстансами трёх блоков.
- Последняя точечная перепроверка links и свойств кнопок: **01.10.2026, 18:29:50 UTC / 21:29:50 МСК**. Figma менялась во время анализа: первоначальные наблюдения об отсутствии Show Button и фиксированном link больше не актуальны.
- Resolver на закреплённом SHA возвращает `SKILL_ROUTE_PAUSED` для поддержки. Этот PR содержит только план и его связи. Он не включает контрактные правки, рендеринг, переименования или публикацию Description.
- Реализация всех пакетов ниже **не начата**. Слияние документа не даёт разрешения обходить paused route, выполнять cutover или менять рискованную часть без отдельного согласования.

## Когда выполнять

Порядок: **11A → отдельно разрешённый и принятый 11B / пакет 5 → этот план → отдельно разрешённая 11C / пакет 6**.

Условия начала: пакет 5 слит; нужные maintenance routes действительно разрешаются; локальные навыки и clean-context handoff проверены по плану cutover; пользователь разрешил начать этот follow-up. Если включена лишь часть маршрутов, выполнять только доказанно доступную часть, не подменять недостающий маршрут другим.

Новые карточные изменения — известный отложенный design drift, а не доказательство готовности старых контрактов. В 11A нельзя объявлять их эквивалентными Figma. Representative проверки cutover должны явно учитывать этот drift: использовать подходящие неизменённые случаи для проверки инфраструктуры, а выявленную общую потерю фактов оценить в gate пакета 2/3. Если она блокирует саму готовность поддержки, сообщить об этом и пересогласовать зависимость; не ослаблять gate ради этого плана.

Пакет 2 cutover этим исследованием не считается начатым или завершённым. Здесь не создаются новый навык, новые foundations или новый этап глобальной миграции.

## Global Constraints

- Источник правок — облачный GitHub. Локальный снимок точного SHA используется только для исполнения и проверок; существующие локальные письма не редактировать.
- До каждого пакета закрепить новый main, прочитать roadmap, этот план, manifest и выбранный route bundle. Не обходить paused/blocked status.
- Перед записью показать фактическую карту влияния: компоненты, инстансы, files, изменение внешнего вида/поведения. Рискованные изменения выполнять только после подтверждения пользователя.
- Figma читать и изменять только через MCP. Разрешённое переименование или Description не разрешает менять layout, размеры, bindings, значения свойств, Fill, типографику, состав и видимость.
- Не менять схемы ради удобства переноса. Если существующая модель не может выразить факт без потерь, зафиксировать точный пробел и согласовать минимальное расширение.
- Размеры на эталонном контенте не становятся фиксированными высотами HTML. Источник адаптивности — фактические sizing/align/constraints, а не предположение из чисел.
- Не менять правила экспорта: @2x и @4x остаются на существующих export owners, а не на новых layout-обёртках. Не запекать радиусы и не добавлять фон.
- Button/Secondary, Card/Image и Card/Icon остаются дочерними компонентами. Их нельзя выдавать за отдельные блоки письма или копировать как новую независимую реализацию.
- Тесты и visual regression — локально, Terra Medium. GitHub Actions и PR Checks не запускать, не читать и не использовать как quality gate.
- Generated-файлы обновлять только генератором. Полный прогон — один раз на финальном SHA изменения кода/контрактов; в процессе — проверки затронутой области. Merge — отдельным решением.
- Ручной `cupis-active-work-context.md` не обновлять без запроса.

## Проверенная карта Figma

Файл: `8zka5bHkcrJVK9I9dKjnhC`, страница `5:6`. Node IDs ниже — provenance этого плана, не новая константная карта внутри рендера.

| Component / contract ID | Component set | Desktop | Mobile |
| --- | --- | --- | --- |
| Block/Cards-Images / block-cards-images | [326:5806](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/?node-id=326-5806) | 398:7570 | 398:7598 |
| Block/Icon-Cards / block-icon-cards | [326:6342](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/?node-id=326-6342) | 398:7759 | 398:7953 |
| Block/Icon-List / block-icon-list | [946:26516](https://www.figma.com/design/8zka5bHkcrJVK9I9dKjnhC/?node-id=946-26516) | 946:26515 | 946:26514 |
| Card/Image / card-image | 911:4132 | 911:4131 | 911:4130 |
| Card/Icon / card-icon | 326:5580 | 260:662 | 11:1020 |
| Button/Secondary / button-secondary | 337:4710 | 337:4699 | 337:4576 |

### 1. Кнопки и общая геометрия

Все три блока сейчас имеют Show Button с default=true и связанную видимость кнопки в обеих версиях. Это подтверждение чтением bindings, не проверка фактического переключения false.

| Блок | Boolean property | Desktop button instance | Mobile button instance |
| --- | --- | --- | --- |
| Cards-Images | Show Button#1817:3 | 1802:3594 | 1802:3598 |
| Icon-Cards | Show Button#1817:0 | 1802:3856 | 1802:3854 |
| Icon-List | Show Button#946:0 | 946:26508 | 946:26510 |

Для Icon-List кнопка и Show Button уже представлены в контракте на базе анализа. Не добавлять их второй раз: проверить существующий owner, binding, порядок, отступ и render composition. Для Cards-Images и Icon-Cards новые кнопки ещё требуется перенести в контракт.

Общие измеренные параметры трёх блоков:

| Параметр | Desktop | Mobile |
| --- | --- | --- |
| Ширина блока в библиотечном примере | 600 px | 328 px |
| Внешний top / right / bottom / left | 24 / 24 / 0 / 24 px | 16 / 16 / 0 / 16 px |
| Content-area width | 552 px | 296 px |
| Content-area padding, все стороны | 32 px | 22 px |
| Content-area radius / fill | 26 px / #FFFFFF | 22 px / #FFFFFF |
| Основной gap между секциями content-area | 32 px | 22 px |
| Внутренняя доступная ширина | 488 px | 252 px |
| Button/Secondary width | Hug, min-width 230 px | Fill; 252 px на этом примере |
| Button/Secondary padding top/right/bottom/left | 12 / 24 / 12 / 24 px | 12 / 24 / 12 / 24 px |
| Button radius / fill | 26 px / #48494A | 26 px / #48494A |
| Button label | Roboto 500, 16 px, 140%, #FFFFFF, center | Roboto 500, 14 px, 140%, #FFFFFF, center |

Desktop-кнопки расположены слева в content-area; не центрировать их по центрированному heading. Mobile-кнопки заполняют доступную ширину. Заголовки Cards-Images и Icon-Cards центрированы; Icon-List — слева в обеих версиях.

Контрольные высоты при текущем наполнении, **не фиксированные ограничения HTML**: Cards-Images D 1320 / M 2087 px; Icon-Cards D 1260 / M 1433 px; Icon-List D 768 / M 593 px. Первые два блока выросли на 78 / 66 px относительно контрактных примеров: button 46 / 44 px + gap 32 / 22 px. Нельзя добавлять этот gap при Show Button=false.

### 2. Card/Image: link теперь Fill

Финальное чтение мастер-компонента:

- Desktop `1015:18276`: 232×22 px, FILL / STRETCH, textAutoResize=HEIGHT, textAlignHorizontal=LEFT.
- Mobile `1015:18459`: 252×20 px, FILL / STRETCH, textAutoResize=HEIGHT, textAlignHorizontal=LEFT.
- Последнее сравнение всех 12 карточных инстансов в Block/Cards-Images не обнаружило отличия sizing link от этих мастеров. Раннее наблюдение master FIXED 176 / 236 px признано устаревшим.
- Desktop image-area 232×148 px, text column 232 px, межколоночный gap 24 px; Mobile image-area 252×161 px, gap до текста 16 px. Это геометрия контейнера на примере, не размер исходного растра Fill.

Fill текстового фрейма **не означает автоматически**, что вся его площадь должна стать новым кликабельным прямоугольником. Нужно сохранить action semantics и обеспечить правильную доступную ширину/перенос текста, не добавляя фону или высоте кнопочное поведение.

### 3. Card/Icon: Desktop меняется, Mobile не превращается в него

Desktop master `260:662`: горизонтальная строка 488×138 px на примере, primary MIN, counter CENTER. Иконка 72×72 px находится в отдельном `Frame 1` `1802:3992`: HUG по ширине, FILL по высоте, MIN/MIN, без padding, Fill и радиуса. Text-content — 392×138 px, FILL по ширине, HUG по высоте, gap 12 px; горизонтальный gap между колонками — 24 px.

Обёртка остаётся layout-узлом; именно она занимает высоту строки, а иконка сохраняет 72×72 px и находится сверху. Текстовая колонка центрируется по вертикали, если строка выше текста.

В master у однодочерней обёртки itemSpacing=10 px, в шести Desktop-инстансах блока — 0 px. Сейчас это не создаёт видимый gap, потому что ребёнок один. Сохранить как отдельное наблюдение; не нормализовать молча и не придумывать второй дочерний элемент.

Mobile Card/Icon остаётся **вертикальной** карточкой: иконка 52×52 px, gap до текста 16 px, text-content gap 8 px, горизонтальное центрирование текста. Новую Desktop-обёртку туда автоматически не переносить. Ширина Mobile master 271 px — пример, не ограничение для HTML: все шесть инстансов внутри блока имеют FILL и ширину 252 px при корне 328 px.

### 4. Icon-List: не путать высоту текста с высотой строки

Обе версии содержат шесть горизонтальных rows, counter CENTER. В каждой row есть отдельный `Frame 1`: HUG по ширине, FILL по высоте, MIN/MIN, нулевые padding/gap, без Fill.

| Параметр | Desktop | Mobile |
| --- | --- | --- |
| Row width на примере | 488 px | 252 px |
| Иконка | 56×56 px | 42×42 px |
| Межколоночный gap | 24 px | 16 px |
| Text width | 408 px | 194 px |
| Text height на примере | 50 px | 40 px |
| Положение текста относительно row top | 3 px | 1 px |

Точная логика: высота строки равна максимуму высот иконки и текста; иконка сверху; текст центрируется по вертикали. Поэтому формулировка «обёртка всегда равна высоте текста» неточна для короткого текста: строка не должна сжимать иконку.

Desktop rows находятся в отдельном items-контейнере с gap 24 px; Mobile rows — непосредственно в content-area с gap 22 px. Не унифицировать эти деревья ради упрощения.

## Оценка рисков и решения

| Область | Критичность | Что может сломаться | Решение и gate |
| --- | --- | --- | --- |
| Новая обёртка + вертикальное выравнивание | Высокая при потере структуры | Иконка по центру длинного текста; короткий текст прилип сверху | Сохранить wrapper и FILL, тестировать top icon / middle text на коротком и длинном тексте. Не применять ко всему ряду один valign |
| Mobile Card/Icon | Высокая, уже известный класс регрессии | Ширина 271 px из master становится жёсткой; блок перестаёт сжиматься | Проверить instance override/FILL и поведение на 300–659 px, не копировать Desktop layout |
| Снятие TEXT sizing | Высокая для полноты фактов | Число width сохранено, а смысл Fill снова теряется | Дополнить доказательство прямого sizing-факта и его переноса; mapping test до изменения контракта |
| Card/Image link | Средняя | Иное количество строк; случайное расширение кликабельной зоны | Разделить размер текстовой области и action; сравнить длинную подпись и скрытый link |
| Show Button и gap | Низкая при существующей композиции | Пустой gap при false, неверный viewport кнопки, потеря radius | Повторно использовать Button/Secondary, проверить true/false и правильный Desktop/Mobile |
| Переименование Frame 1 | Средняя для связей, не для геометрии | Потеря refs, изменение экспортируемого узла, override вместо наследования | Точная карта IDs, generator proposal, согласование и read-back; сохранять export owner |
| gap 10/0 у Card/Icon wrapper | Низкая сейчас | Невидимый сегодня override становится неучтённой разницей при дальнейшем развитии | Отдельно показать, сохранить точные значения до решения пользователя |

Табличная реализация предпочтительна: cell иконки получает top, cell HUG-текста — middle, ширины изображения фиксированы, высота строки определяется содержимым. Не строить решение на flex или процентной высоте пустой вложенной таблицы.

В текущем `scripts/lib/email-interpreter.mjs` уже есть выбор top для FILL-child при counter CENTER. Это основание сначала проверить новый контракт, а не заранее переписывать алгоритм. Совместимость свойства сама по себе не доказывает результат полного письма: нужны локальный render и visual regression. Справочные источники: [Can I Email — vertical-align](https://www.caniemail.com/features/css-vertical-align/), [height](https://www.caniemail.com/features/css-height/), [CSS table height layout](https://www.w3.org/TR/CSS22/tables.html#height-layout).

## Файлы и их ответственность

| Файл / область | Планируемая роль |
| --- | --- |
| `data/components/marketing.yaml` | Обновить только подтверждённые факты и composition пяти owners: три блока, card-image, card-icon; сохранить ID и остальные записи |
| `data/components/shared.yaml`, `data/components/service.yaml` | Read-only consumer/impact check; Button/Secondary и сервисные записи не менять без отдельного найденного дефекта и согласования |
| `scripts/figma/capture-contract-source.js` | При сохранении текущего пробела — прямое снятие TEXT horizontal/vertical sizing |
| `scripts/lib/figma-contract-facts.mjs` | Mapping/proof только если существующего недостаточно для нового sizing-факта |
| `scripts/lib/email-interpreter.mjs` | Только доказанный RED-тестом общий дефект sizing/alignment; без component-ID hardcode |
| `scripts/lib/email-primitives.mjs` | Read-only сначала; правка только при доказанной потере нужного inline/table свойства |
| `docs/generated/component-registry.md` | Регенерация из обновлённых владельцев; не ручной перенос нового текста |
| `data/foundations/figma-naming.yaml`, `scripts/lib/figma-name-generator.mjs` | Использовать существующие роли/генератор для rename proposal; новый стандарт не вводить |
| `scripts/lib/component-description.mjs` | Использовать для актуальных коротких Description; менять генератор только при доказанном общем дефекте и отдельном согласовании |
| Tests ниже | Закрепить source→contract→composition→HTML, а не только snapshots |
| Этот план, cutover plan, roadmap | Статус, evidence SHA, отдельное решение о рисках, следующий gate |

Файлы foundations/глобальных инструкций не требуют автоматической правки из-за добавления кнопки или wrapper. Окончательный allowed diff уточняется по свежему impact report, не по принципу «обновить всё».

## Пакет A — свежие факты и согласованная карта

**Files:** Read перечисленные contracts, capture/mapping, naming и bundle; Update только evidence/решения в этом плане. Возможный новый regression fixture — `tests/foundation/fixtures/marketing-card-layout-figma-capture.json`, только после чистого повторного capture.

**Interfaces:** Consumes актуальные SHA, resolved maintenance bundle и live Figma. Produces полную before/after карту пяти contract owners, consumer map, точный rename proposal и отдельное разрешение для рискованной части.

- [ ] **A1.** Проверить cutover prerequisite выше. Записать main SHA, resolver status и точные компоненты в bundle. При неполном наборе не подбирать contract из старого снимка.
- [ ] **A2.** Через MCP заново снять оба варианта всех шести sets из карты, включая вложенные инстансы: hierarchy/order, properties/defaults/bindings, visibility, width/height, min/max, sizing/align/grow, padding/gap, radius, fills/opacity, strokes/effects, полную typography и style/variable bindings. Сохранить capture без truncation и reference screenshots. Отдельно перечислить unsupported/mixed факты.
- [ ] **A3.** Сверить каждый implementation-significant факт с contract и его source proof. Числа из этого плана использовать лишь для обнаружения новых изменений. Проверить все 12 Card/Image и 12 Card/Icon инстансов, прямые rows Icon-List и фактических consumers child-компонентов вне трёх блоков.
- [ ] **A4.** Составить карту сохранения ID, properties, instance overrides и asset owners. Убедиться, что Show Button уже связан во всех вариантах и Icon-List не требует дублирования кнопки.
- [ ] **A5.** Сформировать naming proposal: для layout-обёртки иконки использовать существующую роль `image-area` с qualifier `icon` → **image-area-icon**. Сначала проверить предложение текущим генератором/валидатором. Дочерний **feature-icon @4x** не переименовывать; @4x на wrapper не переносить. Scope: Card/Icon Desktop wrapper и 12 wrappers Icon-List; наследуемые имена Card/Icon instances не заменять overrides без причины.
- [ ] **A6.** Показать пользователю: как изменятся короткий/длинный текст и mobile sizing, какие файлы/consumers затронуты, судьбу master gap=10 / instance gap=0. Получить решение по рискованной части и конкретному rename diff. Если часть отклонена, явно остановить только её; не делать скрытые «безопасные» замены.
- [ ] **A7.** Записать результат пакета отдельным docs/evidence commit. Не объявлять компоненты исправленными до пакетов B/C/D.

**Acceptance:** Нет непроверенных или расплывчатых contract facts; owners и исключения названы; любой неизвестный факт отмечен как открытый, не дополнен по аналогии. Свежие данные и разрешение дают однозначный allowed diff для следующих пакетов.

## Пакет B — полнота sizing и новые кнопки

**Files:** Modify `scripts/figma/capture-contract-source.js` и mapping только при подтверждённом пробеле; `data/components/marketing.yaml`; Test `tests/foundation/figma-contract-facts.test.mjs`, `tests/foundation/figma-contract-facts-cli.test.mjs`, `tests/rendering/nested-composition-contract.test.mjs`. Create focused `tests/rendering/marketing-card-layout-refresh.test.mjs`.

**Interfaces:** Consumes capture/allowed diff A. Produces проверяемые TEXT sizing facts и две новые button compositions с visibility; Icon-List сохраняет уже существующую композицию.

- [ ] **B1.** Terra добавляет/запускает RED case: TEXT с layoutSizingHorizontal=FILL и textAutoResize=HEIGHT должен сохранить прямой sizing-факт через capture→mapping, а FIXED-контроль — FIXED. На базе анализа capture пишет layout.horizontal_sizing только внутри проверки наличия layoutMode; TEXT эту ветку не проходит. Если cutover уже исправил пробел, подтвердить существующим тестом и не дублировать изменение.
- [ ] **B2.** Снять horizontal/vertical sizing для поддерживающих их TEXT-узлов независимо от наличия Auto Layout, сохранив текущий общий формат фактов. Не записывать фиктивный layoutMode для текста. Если формат требует изменения версии/схемы, остановиться с отдельной картой влияния, а не ломать существующие captures.
- [ ] **B3.** RED cases для Cards-Images и Icon-Cards: правильный nested button-secondary каждого viewport, Show Button true/false, единственный action, отсутствие дополнительного section gap при false. Контроль Icon-List: ровно одна кнопка, прежние property/identity.
- [ ] **B4.** Перенести подтверждённую кнопку, property binding и gap в два block owners; обновить доказательства по факту. Сохранить show-caption и остальные switches. Не копировать свойства Button/Secondary вручную поверх child-контракта.
- [ ] **B5.** Запустить targeted tests; убедиться, что radius 26 и Fill #48494A принадлежат реальному фону кнопки, D остаётся Hug/min230, M — fluid. Высоты 46/44 не навязывать длинной подписи как fixed height.
- [ ] **B6.** Обновить производную документацию штатным генератором, выполнить scoped validation, сохранить cloud commit и точный local verification SHA.

**Acceptance:** Новый факт не потерян; кнопки управляются свойством без пустого хвоста; существующий Icon-List не задублирован. Тексты/контейнеры ещё не объявляются визуально принятыми — это C/D.

## Пакет C — link, icon wrapper и точная табличная интерпретация

**Files:** Modify `data/components/marketing.yaml`; по результату RED — `scripts/lib/email-interpreter.mjs`; Figma только разрешённые names/Description. Test `tests/rendering/marketing-card-layout-refresh.test.mjs`, `tests/rendering/component-root-sizing-regressions.test.mjs`, `tests/rendering/renderer-contract-semantics.test.mjs`, `tests/rendering/nested-composition-contract.test.mjs`, `tests/foundation/figma-name-generator.test.mjs`.

**Interfaces:** Consumes свежие numeric/sizing facts, nested button support B и разрешённую карту A. Produces contract trees, в которых различие Desktop/Mobile, wrapper и instance sizing выражены без ручных исключений в письме.

- [ ] **C1.** RED cases: Card/Image link получает доступную text-column width, а не старые FIXED 176/236; многострочная подпись увеличивает высоту; Show Link=false не оставляет пустое место; link сохраняет исходную action semantics.
- [ ] **C2.** Обновить Card/Image master и только необходимые instance-specific facts по реальным IDs. Согласованность child/root render contract проверять через composition, а не только через standalone child render. Не менять asset crop, пропорции или форматы.
- [ ] **C3.** RED cases: Desktop Card/Icon и обе версии Icon-List дают top для icon-wrapper и middle для HUG text. Для short text row height=max(icon,text), для long text иконка остаётся сверху. Mobile Card/Icon остаётся вертикальным и заполняет доступную ширину.
- [ ] **C4.** Перенести wrapper, sizing, alignment и children order в подтверждённые контрактные деревья. Не превращать wrapper в export owner; не удалять instance override gap 0 ради сходства с master 10 без отдельного решения.
- [ ] **C5.** Проверить существующий renderContractTree/табличную ветку. Исправить интерпретатор только если новый подтверждённый контракт проваливает RED case. Не делать `if component.id === ...`; не задавать процентную высоту ради имитации FILL и не фиксировать высоту текста.
- [ ] **C6.** После утверждённого rename preview переименовать в Figma только выбранные wrappers. До/после сравнить IDs, hierarchy, component properties/references, visibility, sizing, fills, text styles, asset suffixes и inherited instance names. Любое лишнее изменение — остановка и отчёт, не «нормализация».
- [ ] **C7.** Переснять source proof после rename, выполнить naming и contract checks; актуализировать provenance без изменения числовых фактов. Если Rename/Description ещё не разрешены, отделить их от code commit и не отметить пункт выполненным.
- [ ] **C8.** Запустить targeted suites выше. Зафиксировать cloud commit, allowed diff и причины каждого изменения renderer; если renderer не требовал правки, записать это явно.

**Acceptance:** Ни одна версия не собрана по геометрии другой; короткий и длинный текст сохраняют нужную ось выравнивания; Mobile Icon-Cards не содержит жёсткой ширины 271 px из master; экспортные владельцы не изменены.

## Пакет D — документация, визуальная приёмка и слияние

**Files:** Generate `docs/generated/component-registry.md`; Figma Description только затронутых owners и только по одобренному diff. Tests из B/C, `tests/generation/generated-docs.test.mjs`, `tests/generation/generated-docs-cli.test.mjs`, `tests/components/figma-component-description.test.mjs`; Update этот план и ссылки статусов в двух связанных планах.

**Interfaces:** Consumes verified contracts и renderer из B/C. Produces актуальные generated docs/bundles, принятые локальные previews, final verification report и отдельное решение merge.

- [ ] **D1.** Сгенерировать registry из актуальных owners. Сверить короткие Figma Description: component ID остаётся первым, назначение понятно, нет утверждений о старой геометрии. Публиковать только действительно изменившиеся Description через штатный preview/read-back; длинные правила и числа не дублировать в Figma.
- [ ] **D2.** Получить новый email route bundle на точном candidate SHA. Собрать локальный тест из трёх блоков через штатный renderer, без добавления child-компонентов в тело письма. Исходные тестовые письма не перезаписывать; новая версия содержит email.html и images, технические reports/screenshots хранятся отдельно.
- [ ] **D3.** Terra сравнивает оба Figma reference variants с render: ширины, padding/gap, радиусы, цвет, текст/переносы, размещение/порядок, видимость и пропорции изображений. Отдельные сценарии короткого и длинного текста сверяются с согласованной закономерностью, а не с выдуманным Figma screenshot. Не менять библиотеку ради создания test content без разрешения.
- [ ] **D4.** Проверить reference Mobile 328 px и Desktop-ветку с shell 600 px при viewport >=660 px. Проверить viewport 300/360/430/659/660 px. На базе анализа breakpoint — max-width:659px, shell max600, inset0, min viewport300. Перед прогоном прочитать актуальный rendering foundation; не менять breakpoint этим планом.
- [ ] **D5.** Проверить четыре комбинации Show Caption/Show Button, существующие Show Link/Description, short и long text, длинную подпись ссылки. Нет overflow; нет лишнего gap при скрытых частях; пропорциональная высота @2x при изменении ширины; нет изменения PNG @4x. Сохраняются округления новых кнопок и ранее исправленных controls.
- [ ] **D6.** Проверить consumer impact вне трёх блоков, особенно другие uses Card/Icon и Card/Image и оба email routes. Только подтверждённые screenshots/геометрия могут обновить visual baseline; не обновлять эталон под текущий ошибочный output.
- [ ] **D7.** На финальном неизменяемом cloud SHA Terra выполняет `npm run validate`, `npm run generate:check`, `npm test` в точном изолированном снимке с Node24 и зависимостями через `npm ci --ignore-scripts`. Отдельно проверить allowed diff, локальные src, generated equivalence и read-back Figma. Если после этого есть code/contract change — проверка нового final SHA обязательна.
- [ ] **D8.** Выдать пользователю previews и краткий отчёт: что изменено, принятые риски, результат локальных проверок, какие почтовые клиенты фактически не проверялись. Браузерный visual pass не называть доказанным тестом всех почтовых приложений. Получить разрешение merge; после merge обновить статус этого follow-up и следующий gate 11C.

**Acceptance:** Три блока собираются из обновлённых контрактов без ручной правки HTML, optional controls работают, mobile адаптивен, структура/дизайн Figma не изменены вне разрешённого naming/Description, локальный final-SHA gate зелёный.

## Проверки текущего docs-only PR

Этот раздел не является отчётом о выполнении B/C/D.

- Проверить, что diff ограничен новым планом, ссылкой в cutover plan и корректировкой актуального статуса/порядка в roadmap.
- Проверить существование referenced repository paths, новые cross-links и неизменность активных источников/навыков/контрактов.
- Запустить локальные scoped documentation/generated checks и validation на exact PR head через Terra. Полный renderer suite и сборка писем для создания плана не нужны.
- Оставить PR draft, не сливать и не начинать реализацию.

## Продолжение и журнал

- 01.10.2026: read-only исследование на main@6c0bf7d0; пользователь выбрал подробный план вместо обхода maintenance pause.
- 01.10.2026: свежие Figma reads заменили устаревшие ранние предположения о Show Button и link sizing. Открытые риски и будущие проверки записаны выше; никакие fixes этим планом не выполнены.
- Следующий шаг основного трека — пакет 2 плана cutover по отдельной команде. Следующий шаг этого follow-up — A, только после принятого 11B и разрешения пользователя.
