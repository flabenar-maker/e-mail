# Email Link Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать компактную локальную форму недостающих адресов в порядке блоков письма, с точными подписями действий и сохранением существующей адресации JSON.

**Architecture:** Существующий `collectEmailActions()` уточняет presentation metadata из уже полученной модели и контрактов. Существующий `renderDeliveryForm()` строит фиксированный адаптивный шаблон из inventory, сохраняя фильтрацию pending URLs и download draft. Renderer письма, delivery schema и gates остаются действующими.

**Tech Stack:** JavaScript ESM, Node `>=24 <25`, встроенный `node:test`, HTML/CSS и локальный браузер; существующие зависимости и lock-файл.

**Spec:** [Согласованный дизайн](../specs/2026-10-12-email-link-form-design.md).

## Global Constraints

- Убрать видимые подписи экземпляров и технические ID.
- В «Текст кнопки» выводить точную надпись кнопки, для текстовой ссылки только её подчёркнутый фрагмент.
- Компактная локальная HTML-форма по блокам/порядку письма, только недостающие адреса.
- Повторяющиеся действия остаются отдельными; Mobile/Desktop различаются только при отдельных bindings.
- Фиксированный программный шаблон; без дополнительной работы нейросети, нового чтения Figma/превью.
- `delivery.json` сохраняет точную привязку ответов и существующие проверки.
- Delivery schema `1.0.0`; IDs, binding kinds, original ranges, managed URLs и source/digest gates не менять ради presentation.
- Label/group изменения меняют digest; старые answers автоматически не мигрировать. HTML-only изменение не меняет inventory IDs/digest.
- Пользователь разрешил только PR с этим планом и spec. Код, тестовые изменения, merge и установка сейчас не разрешены.
- Постоянные правки публиковать в каноническом cloud repository; локальный точный снимок — только чтение и проверки. Не запускать и не использовать Actions/PR Checks.

## Review Focus

- Shared `help-url` на нескольких несмежных underline runs сохраняет один адрес; подпись исключает промежуточный текст — тесты Task 1.
- Изменённый rich-text и Unicode не позволяют угадывать диапазон по совпадению подстрок — Task 1.
- Два структурных блока с одинаковым heading и slot descendants не сливаются и не теряют владельца — Task 2.
- Единственная pending половина split пары сохраняет hint; lone mobile-only action его не получает — Task 2.
- Повторные captions, HTML-подобный текст и hidden state IDs не меняют адресацию скачанного JSON — Task 3, browser check Task 4.

---

## Карта файлов и порядок выполнения

Исходная база: `flabenar-maker/e-mail`, `b8ee255bde370a9b932cf36071904be771d86d8e`. При отдельном запуске реализации закрепить актуальную базу и проверить расхождения с этим планом до правок. Плановый PR добавляет только два Markdown-файла; перечень ниже относится к будущей реализации.

| Файл | Будущая ответственность |
| --- | --- |
| `scripts/lib/email-action-inventory.mjs` | Точный action label; структурная группа, контекст, viewport hint; digest |
| `scripts/lib/email-delivery-form.mjs` | Компактный шаблон, доступность, безопасное сохранение; draft/reuse без изменения gates |
| `tests/fixtures/rendering/email-delivery-fixtures.mjs` | Синтетические inline/shared/group/split cases; реальные письма не копировать |
| `tests/rendering/email-action-labels.test.mjs` | Подписи всех URL путей, current runs, diagnostics, стабильные bindings |
| `tests/rendering/email-action-inventory.test.mjs` | Владельцы, порядок, visibility, split/shared cases |
| `tests/rendering/email-delivery-form.test.mjs` | Видимый UI, pending controls, escaping и submit/download |
| `tests/rendering/email-delivery-reuse.test.mjs` | Caption/group digest changes, reuse и HTML-only invariance |
| `tests/rendering/email-delivery-link-only.test.mjs`, `email-delivery.test.mjs` | Существующие readiness/projection gates и их регрессии |
| `docs/user-guide.md` | Раздел `#form` и оба упоминания «Скачать заполненные ссылки» |
| `scripts/prepare-email-delivery.mjs` | Интеграционная точка; менять только при доказанной необходимости, интерфейс сохранять |

Рекомендуется один координатор-исполнитель для четырёх связанных задач через `superpowers:executing-plans`, с делегированными локальными проверками и независимым итоговым ревью. Не создавать агента на каждую маленькую правку. Требования AGENTS обязательны: routine test/regression и все visual comparisons выполняет субагент на выбранной пользователем модели, координатор получает только команды, failed tests, root cause, changes и status. Для routine verification medium с запасом до high; повышать усилие, а не заменять модель. Сложность архитектуры/неоднозначности или 2–3 неудачных ремонта возвращаются координатору. Executor/reviewer сохраняют выбранную модель; reviewer — отдельный агент с первичными источниками и проверкой всех требований.

### Task 1: Точный текст действий без изменения bindings

**Files:** Modify `scripts/lib/email-action-inventory.mjs`, `tests/fixtures/rendering/email-delivery-fixtures.mjs`; Test `tests/rendering/email-action-labels.test.mjs`.

**Interfaces:** Сохранить export `collectEmailActions({ model, componentIndex, profile }) -> { email_id, fields, text_bindings, inventory_digest, diagnostics }`. Добавить private `resolveActionLabel({ element, instance, viewport, slotId, kind, range }) -> { label: string, diagnostics: Array<{ code: string, path: string, message: string }> }`. Он использует `deliveryBinding()` и текущие plain/rich-text runs; не создаёт actions. Сигнатура `deliveryText(value) -> string` сохраняется.

- [ ] **Step 1: Добавить failing cases** `html-link href labels only underlined current content`, `numbered URL uses all styled segment indices`, `shared help URL labels fragments without adding actions`, `output range label uses current rich text run`, `ambiguous text range blocks intake`. Fixtures задают заранее известные literal binding/ID expectations, а не вызывают production label helper для вычисления expected. Обычный CTA «Подробнее» и зарегистрированная role label остаются существующими regression cases.

  Ключевые assertions для fixture `email/notice`, `notice-text`, сегментов «До », ««Помощь»», « после»: numbered target имеет ID `email%2Fnotice~notice-text~link-2-url~~both`, label `«Помощь»`, kind `slot-link`. При current rich-text run `«Поддержка»` label равен `«Поддержка»`; исходный output range `{ start: 3, end: 11, text: '«Помощь»' }` и прежний ID остаются неизменными. Shared case с двумя underline runs получает один field, label `«Помощь» · 1cupis.ru`, без слова «или» из промежуточного run. Adjacent runs одного target дают точное `службу поддержки`; два соседних numbered targets остаются двумя прежними fields. Для изменённого scalar без доказанного run mapping ожидается `EMAIL_DELIVERY_LABEL_RANGE_AMBIGUOUS`, а не label всего абзаца. Добавить case emoji/переноса в current run и case несовпадающего числа runs.

- [ ] **Step 2: Делегировать red run** `node --test tests/rendering/email-action-labels.test.mjs`. Ожидается FAIL новых label/mapping assertions, существующие тесты не должны неожиданно ломаться; получить компактную классификацию failures.
- [ ] **Step 3: Реализовать resolver** в inventory. Для numbered target индексировать все style segments; применять существующий `help-url` precedence. Соседние/несмежные fragments брать лишь из сегментов прежнего target; не сливать output-range fields и не создавать targets по числу styles. Mapping разрешён при точном source scalar либо typed rich-text с одним текущим run на исходный segment; не искать substring. При неоднозначности добавить bounded diagnostic с path, без текста всего письма. `add()` меняет только label и diagnostics; текущие ID, kind, slot, required, value и range остаются прежними.
- [ ] **Step 4: Делегировать green run** той же команды. Ожидается PASS всех label cases, exact binding/ID assertions и исходных CTA tests; при обычном дефекте субагент делает ограниченный repair/rerun.
- [ ] **Step 5: Опубликовать отдельный commit** с тремя файлами задачи, сообщение `fix: label delivery actions with their exact current text`. Cloud commit — рабочий источник; локальные тесты проверяют его точный снимок.

### Task 2: Структурные группы, контекст карточек и viewport hints

**Files:** Modify `scripts/lib/email-action-inventory.mjs`, fixtures; Test `tests/rendering/email-action-inventory.test.mjs`, `tests/rendering/email-action-labels.test.mjs`, `tests/rendering/email-delivery-reuse.test.mjs`.

**Interfaces:** Каждый collected field дополнительно содержит `display_group: { id: string, label: string }`, `display_context: string`, `viewport_hint: 'Mobile' | 'Desktop' | null`. Export/answer ID формат остаётся прежним. Private `viewportHintsForFields(fields) -> Map<string, 'Mobile' | 'Desktop'>` сравнивает structural binding identity без viewport и без label/instance_label, работает на полном inventory до pending filter. `createDeliveryDraft({ emailId, sourceSha, profile, inventory, deliveryMetadata? })` сохраняет существующую сигнатуру и gates.

- [ ] **Step 1: Добавить failing cases** `same headings remain separate structural sections`, `slot and nested descendants inherit the block owner`, `repeated CTA retains actual card heading`, `inventory follows mixed slot nested element order`, `viewport hint requires a split counterpart`, `caption and group changes invalidate old answers`. Fixture включает два блока с heading «Акции», в первом две карточки с «Первый бонус»/«Второй бонус», nested CTA и slot CTA; второй блок имеет собственный path, даже при одинаковом heading. Проверить `first.display_group.id !== otherBlock.display_group.id`, один group ID у дочерних CTA первого блока, labels CTA `Подробнее`, контексты равны фактическим headings. Exact action order соответствует смешанным siblings в контракте; desktop-only action находится в своей секции. Shared обеих версий: null hint; scoped пара: Mobile/Desktop; lone mobile-only: null; половина split пары known: pending другая имеет правильный hint.

  Reuse assertions: изменение только label или group identity меняет digest; draft со старым digest не получает прежний answer, но subject/sender сохраняются. Новый документ с прежним digest отклоняется `EMAIL_DELIVERY_INVENTORY_STALE`. Существующие visibility/source-change cases остаются.

- [ ] **Step 2: Делегировать red run** `node --test tests/rendering/email-action-inventory.test.mjs tests/rendering/email-action-labels.test.mjs tests/rendering/email-delivery-reuse.test.mjs`. Ожидается FAIL новой metadata/order/hint/digest coverage.
- [ ] **Step 3: Реализовать metadata**. Пронести structural owner через nested и slot transitions; содержательные блоки внутри root создают секции, карточки внутри блока наследуют секцию и обновляют короткий heading context. Не использовать одинаковый heading как key и не брать длинный абзац. Порядок задавать обходом выбранных contract elements с местом slot/nested child, объединяя viewport representations по существующей identity. Hints вычислять после existing merge decision на полном inventory; label split не определяет. Включить presentation metadata в существующую hashed structure; не изменять source/digest reuse logic или delivery schema.
- [ ] **Step 4: Делегировать green run** той же команды; ожидается PASS, без потери hidden-action/NPS и viewport-addressing regressions.
- [ ] **Step 5: Опубликовать commit** затронутых inventory/fixture/test файлов, сообщение `feat: group delivery actions by structural email blocks`.

### Task 3: Компактный HTML, доступность и точное скачивание JSON

**Files:** Modify `scripts/lib/email-delivery-form.mjs`, fixtures; Test `tests/rendering/email-delivery-form.test.mjs`.

**Interfaces:** Сохранить exports `missingDeliveryFields({ inventory, deliveryDraft }) -> Field[]`, `renderDeliveryForm({ inventory, deliveryDraft }) -> string`. Renderer читает Task 2 metadata. Старые ручные test inventories без metadata группировать по `bindings[0].instance_path`, с label из `block_label`, context пустой; не объединять по label. Internal state остаётся `{ document: deliveryDraft, fields: [{ id, required }] }`, не добавлять presentation поля в скачиваемый delivery document.

- [ ] **Step 1: Добавить failing cases** `compact form hides visible instance captions`, `groups show action context and real split hints`, `duplicate captions save separate answers`, `hostile captions cannot escape markup or JSON state`, `form rendering leaves inventory unchanged`. Проверять видимый markup/DOM отдельно от `delivery-state`: IDs обязательны во внутреннем JSON, утверждение «ID отсутствует во всём HTML» неверно. Ожидать заголовки «Текст кнопки»/«Ссылка», одну секцию на structural group, input count строго равен pending count, отсутствие видимых «Экземпляр …», technical path и лишних user text controls. У каждого input проверить label/for и describedby; required не включать native submit blocking.

  Существующий VM submit harness расширить на две pending строки `Подробнее` с разными IDs и URL `https://1cupis.ru/first`, `https://1cupis.ru/second`; saved.answers по каждому ID равен своему URL. Metadata и known/managed answers равны входному draft; непоказанный answer не меняется. `</script><img src=x onerror=1>`, кавычки, `&` и Unicode остаются текстом; JSON state парсится в исходные значения; отсутствуют сетевые API. Deep-copy inventory до/после render строго равен, digest и IDs не меняются. Zero-pending case без controls/save button остаётся.

- [ ] **Step 2: Делегировать red run** `node --test tests/rendering/email-delivery-form.test.mjs`. Ожидается FAIL нового visible presentation/accessibility coverage; download regressions классифицировать отдельно.
- [ ] **Step 3: Реализовать фиксированный шаблон**. Section heading и compact rows читают group/context/hint; отдельные label for input с доступным именем, required hint и видимым focus. Точные UI copy, 880 px max width, 16 px column gap, 12 px row padding, breakpoint 600 px, mobile margins 16 px и 44 px controls взять из spec. Не выводить instance_label. Сохранить `type="text"`, pending filter, trim, clone draft, Blob download `delivery.json`, JSON escaping, status `aria-live` и zero-pending сообщение. Введённые URL не открывать; remote assets/dependencies не добавлять.
- [ ] **Step 4: Делегировать green run** той же команды. Ожидается PASS всех form/submit/security и существующих known/managed/metadata tests. DOM harness проверяет наблюдаемое поведение, не заменяет browser download acceptance.
- [ ] **Step 5: Опубликовать commit** form/fixture/tests задачи, сообщение `feat: render a compact local delivery link form`.

### Task 4: Интеграция, пользовательская инструкция и локальная приёмка

**Files:** Modify `docs/user-guide.md`; Test существующие delivery suites; Inspect `scripts/prepare-email-delivery.mjs`. Для browser evidence используются локальные synthetic artifacts вне repository, новые производственные fixtures/renderer modules не создавать ради отчёта.

**Interfaces:** CLI сохраняет `node scripts/prepare-email-delivery.mjs --model <logical-model.json> --output <new-intake-folder> [--profile <id>] [--delivery <known-delivery.json>]`; writes `form.html`/`delivery.json` в новую папку. `validateDeliveryDocument({ document, inventory, profile, purpose, sourceSha?, emailId? })` и `projectDeliveryBindings({ model, document, inventory, profile })` сохраняют signatures и semantics.

- [ ] **Step 1: Добавить только недостающий failing integration case**. Если Task 1–3 не закрыли projection/reuse boundary, расширить существующие tests literal scenarios: current source/digest answers применяются к правильным двум repeated CTA; stale source/digest и unknown ID отклоняются; managed override, пустой required NPS, unsafe/test URL и invalid supplied metadata остаются ошибками. Не создавать тест, который просто копирует реализацию. Проверить diagnostic из Task 1 проходит штатную блокировку CLI до выдачи формы.
- [ ] **Step 2: Делегировать red run** `node --test tests/rendering/email-action-labels.test.mjs tests/rendering/email-action-inventory.test.mjs tests/rendering/email-delivery-form.test.mjs tests/rendering/email-delivery-reuse.test.mjs tests/rendering/email-delivery-link-only.test.mjs tests/rendering/email-delivery.test.mjs`. Новые missing cases должны выявлять конкретный дефект; если соответствующие guards уже корректны, зафиксировать PASS существующего поведения, не менять их для искусственного red.
- [ ] **Step 3: Обновить пользовательскую инструкцию** в `#form` и согласовать оба button references. Описать секции в порядке письма, точный CTA/подчёркнутый фрагмент, реальные card headings и Mobile/Desktop только для split targets; сохранение/передача JSON, возможное имя `delivery (1).json`, stale-answer gate и zero-pending сценарий. Не добавлять технические IDs в пользовательский flow. CLI production edits допустимы лишь при найденном интеграционном дефекте и в этой узкой области.
- [ ] **Step 4: Делегировать green focused run** команды Step 2; ожидается PASS всех названных suites. Получить только краткий результат и root cause/repair при наличии.
- [ ] **Step 5: Делегировать browser/visual acceptance** на synthetic fixtures из задач 1–3. Один и тот же deterministic `renderDeliveryForm()` даёт form artifact для локального браузера; реальное письмо не рендерить, Figma не читать. На 1280 и 360 px, также 200% zoom проверить geometry, layout, spacing, visibility, точные тексты, keyboard order/focus, split hints и отсутствие horizontal page scroll. Проверить zero-pending page и скачивание: заполнить repeated captions разными адресами, открыть скачанный JSON как данные и сверить IDs/metadata/managed/known values с fixture. Субагент исправляет однозначные UI дефекты и сообщает ограничения; визуальный референс — copy/geometry spec, а не несуществующий утверждённый pixel baseline. При новой правке повторить только затронутые focused/browser проверки.
- [ ] **Step 6: Опубликовать commit** интеграционных test/doc изменений, сообщение `docs: explain compact delivery form and preserve its release gates`; зафиксировать финальный cloud SHA после всех исправлений.
- [ ] **Step 7: Делегировать полный локальный набор** на свежем disposable snapshot именно этого финального SHA, Node 24 и зависимости из его lock-файла: `npm run validate`, `npm test`, `npm run generate:check`. Ожидается exit 0 всех трёх; итоговый отчёт содержит exact SHA. Local snapshot не становится edit source. После изменения SHA прежние результаты не являются приёмкой; повторить полный набор на новом финальном commit. GitHub checks не читать и не запускать; обязательная branch protection check без разрешённого local механизма — сообщаемый blocker, не обход.
- [ ] **Step 8: Независимое содержательное ревью и handoff**. Distinct reviewer на выбранной модели/high читает spec, весь final diff, первичные модули и compact local verification/browser reports; сопоставляет каждый критерий матрицы со свидетельством. Закрыть замечания в разрешённой области и обновить проверки при изменении кода. Отчёт различает скачивание формы, финальную URL validation и внешнюю отправку; merge/установка требуют отдельного разрешения.

## Проверка именно планового PR

Для текущего задания Task 1–4 остаются незапущенными. Проверить на свежем снимке exact PR head SHA, что diff содержит только `docs/superpowers/specs/2026-10-12-email-link-form-design.md` и `docs/superpowers/plans/2026-10-12-email-link-form.md`, тексты UTF-8, относительные ссылки разрешаются, source paths и signatures соответствуют закреплённому источнику, приватных артефактов нет. Независимый reviewer сверяет approved design и оба документа с первичными источниками. Это docs-scope проверка, не claim `npm test` coverage реализации, не запуск Actions и не право выполнить план.

## Самопроверка плана

Проведена перед передачей: Task 1 закрывает точные labels и mapping, Task 2 — group identity/order/context/hints и digest, Task 3 — compact UI/pending/download/security/accessibility, Task 4 — integration/user guide/local final acceptance. Все пять Review Focus cases имеют названные assertions; exported signatures сохранены, presentation metadata не попадает в delivery schema. Последующие задачи читают ровно интерфейсы предыдущих. Plan steps имеют red/green/commit results без тел production functions; несогласованных областей и необработанных требований не найдено. Реализация и её проверки этим документом не выполнены.
