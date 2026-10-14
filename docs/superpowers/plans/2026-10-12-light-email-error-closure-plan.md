# Закрытие ошибок облегчённого письма: план реализации

> **Для исполнителя:** использовать `superpowers:executing-plans` последовательно, с делегированными локальными тестами/визуальными сравнениями и отдельным reviewer. Все пункты ниже относятся к будущей реализации; текущий PR публикует только документы.

**Цель:** убрать подтверждённые причины повторной работы и дефекты HTML, сохранив письмо, дизайн, адреса, видимость и защитные проверки.

**Архитектура:** компактный resolver передаёт все необходимые runtime-варианты и зависимости; renderer соблюдает layout независимо от служебных комментариев и сохраняет значимые пробелы. Ограничения чтения/экспорта обрабатываются на правильной границе, а известная разница crop получает отдельное решение, без скрытого изменения контракта.

**Стек:** JavaScript ESM, Node 24, существующие Node tests и локальный browser; действующий lock, без новых зависимостей.

**Основание:** [диагностика E01–E24](../specs/2026-10-12-light-email-error-diagnosis.md). Исходная база `b8ee255b`; отдельный запуск закрепляет актуальный cloud SHA и сверяет различия до правок.

## Общие ограничения

- Не редактировать исходный HTML, previews, изображения, ZIP, отчёты и подготовительные доказательства этого письма. Любое будущее сравнение пишет новые локальные артефакты отдельно.
- Не публиковать частное письмо или raw captures в GitHub. Постоянные изменения системы — только cloud PR; локальный снимок — только чтение/проверки.
- Не менять Figma и канонические контракты в задачах 1–3/5. Задача 4 фиксирует отдельное решение, не разрешает контрактную правку автоматически.
- Не ослаблять identity, source gate, required/managed URL, stale-answer, asset geometry/alpha/hash и independent acceptance.
- Сохранять выбранную пользователем модель; повышать только поддерживаемое усилие. Все routine tests и визуальные сравнения делегируются.
- Не запускать/читать Actions или PR Checks. Приёмка привязана к точному финальному коммиту и свежим локальным результатам.
- При обычной вёрстке навык коротко сообщает блокирующую ошибку и останавливается; системное исправление выполняется только отдельным заданием.

## Приоритеты и зависимости

| Очередь | Работа | Граница |
| --- | --- | --- |
| P0 | E13: выполнить план корневого слота | Уже PR #130; здесь без дублирования |
| P1, сначала архитектура | E04: полноценный компактный вариант; E05: согласовать имена | Задача 1; независимые fixtures не требуют исправленного root gate |
| P1, затем HTML | E14: центрирование; E15: значимые пробелы | Задача 2; рендерер и тесты, без изменения дизайна |
| P1, решение отдельно | E16: конфликт shared crop и Desktop источника | Задача 4; до решения расхождение не считать закрытым |
| P2 | E17: оставшаяся геометрия | Задача 3 после E14/E15; только доказанные локальные причины |
| P2 | E08: просмотр заполненных ссылок | Дополнение существующего PR #128, задача 5 |
| P2 | Остальные события: профилактика чтения и вызовов | Задача 6; компактные инструкции и существующие guards |

PR #131 закрывает площадь NPS-ссылок отдельно. До его renderer-правки завершить E04 и согласовать общие изменения `email-interpreter.mjs`, чтобы не вести пересекающиеся правки одновременно. Итоговое сравнение конкретного письма требует исправления #130. PR #129 уже содержит понятные пояснения и может завершаться независимо. PR #127 остаётся крайне низким и отложенным; не расширять область Banner/Inline здесь.

## Review Focus

- Count=3 base остаётся выбираемым после восстановления extras; неизвестная ось не превращается в default.
- Variant-only nested component/property/asset/foundation reference не исчезает из closure; иной viewport не попадает в bundle.
- Комментарии, условные адаптивные фрагменты и repeated scoped IDs не меняют положение кнопки и не теряются при центрировании.
- Significant spaces сохраняются без запрета переноса обычного body copy и без необоснованного снятия width ограничений.
- Тестовое продолжение, управляемые URL и исторические локальные исправления не становятся production/формальной приёмкой.

## Задача 1. Runtime-варианты и точная инструкция по именам

**Файлы:** `scripts/lib/context-bundle.mjs`, `scripts/lib/email-interpreter.mjs`, `core/email-model-assembly-standard.md`; проверки `tests/generation/context-bundle.test.mjs`, `context-bundle-cli.test.mjs`, `evidence-metadata-bundle.test.mjs`, `tests/rendering/renderer-contract-semantics.test.mjs`, существующие handoff tests. Точное имя handoff suite найти через `rg --files`, не создавать второй validator.

**Интерфейсы:** сохранить `buildContextBundle({repoRoot, routeId, candidates, viewports, ...})`, `validateBundleClosure(bundle)` и `selectVariantRoot(component, viewport, variantAxes={}) -> {root, diagnostics}`. Приватные `projectRuntimeVariantContracts(record, viewports)` и `collectRuntimeVariantReferences(record, {viewports})` принадлежат context module; не добавлять поля модели письма или второй каталог компонентов.

- [ ] Добавить независимые failing cases: compact NPS Mobile/Desktop Count=2 без neutral; Count=3 с neutral; Count=999 и неизвестная ось дают `RENDER_VARIANT_UNRESOLVED`; пустые axes сохраняют зарегистрированный default. Ожидания literal, не из текущего selector.
- [ ] Дополнить synthetic variant-only cases: отдельные nested/property/asset/foundation refs существуют только в дополнительном root; отсутствующая зависимость даёт typed closure diagnostic. Проверить single-viewport фильтр, stable digest и отсутствие нерелевантных источников.
- [ ] Делегировать локальный red run этих cases; зафиксировать ошибочный Count=3 fallback и пробел dependency closure на неизменённом коде.
- [ ] Спроецировать выбранные base roots, `source_variants` и соответствующие `variant_contracts`. Сохранить исходную provenance только reference-size факта корня, нужную существующему `sourceFor` для выбора варианта; остальные design-time provenance и evidence metadata исключать. Это runtime identity, не независимое доказательство источника.
- [ ] Для closure/выбора properties/assets/foundations объединять ссылки base и отфильтрованных дополнительных roots. Использовать один приватный collector во всех context-местах: recursive dependency closure, projected IDs, foundation definitions и `validateBundleClosure`. Не менять общий registry collector для всех генераторов без установленной необходимости.
- [ ] В `validateBundleClosure` выбирать viewport только из `mobile/desktop`; metadata-ключи contracts не считать viewport. Проверять точность осей даже при отсутствии extras, когда axes явно заданы; не возвращать default для неподдерживаемого запроса. Сохранить существующий typed diagnostic и отсутствие HTML при ошибке.
- [ ] Исправить только неточную строку assembly-стандарта про имя: safe `images/`, фактический basename по handoff, обязательные `profile.suffix` и `profile.extension`, уникальность повторений через допустимый префикс/числовую часть и точную owner evidence. Не копировать регулярное выражение в навык.
- [ ] Проверить через public handoff положительные реальные формы имени с @2x/@4x и отрицательные suffixless/неверный профиль/viewport-tag/unsafe path; правила формата, crop и alpha остаются прежними.
- [ ] Делегировать green run context/CLI/evidence metadata/renderer/handoff suites. Проверить Count=2/3 с настоящим selector и сохранение компактности. Зафиксировать отдельный cloud commit и независимую проверку задачи.

## Задача 2. Центрирование CTA и значимые пробелы

**Файлы:** `scripts/lib/email-interpreter.mjs`; существующие `tests/rendering/pilot-email-fidelity-feedback.test.mjs`, `pilot-fidelity-regressions.test.mjs`, `renderer-contract-semantics.test.mjs`, `html-invariants.test.mjs`; source fixtures без копирования частного письма.

**Интерфейсы:** сохранить `renderContractTree()` и `renderComponent()`; приватная обработка центрирования остаётся внутри interpreter. `output_origin`/`output_block` уже существуют; новые публичные bindings не нужны.

- [ ] Добавить failing Hero/Steps cases через публичный renderer: default emission и `altcraft-mobile-base-v1`, standalone и nested scoped CTA. Ожидать одинаковую центрированную геометрию: в synthetic wrapper шириной 600 и кнопке 230 x=(600−230)/2=185, при одинаковых согласованных отступах fixture.
- [ ] Отдельные отрицательные controls: left-aligned parent, direct image, body text, уже центрированная таблица, несколько repeated кнопок и условные Mobile/Desktop оболочки. Проверить сохранение порядка и всех `cupis:block`/`cupis:end` markers.
- [ ] Делегировать red DOM/geometry run: профили с markers должны воспроизвести расхождение до исправления. Не считать наличие `text-align:center` достаточным.
- [ ] Заменить предположение «первый символ HTML — table» структурным выбором из child render-mode/layout и фактического верхнего output wrapper. Применять align/margin к нужной presentation table, сохраняя ведущие комментарии/условные фрагменты и прочие атрибуты. Не удалять markers, не делать глобальную замену всех table и не оборачивать таблицу ссылкой.
- [ ] Добавить failing whitespace cases для `badge-step-number`: «2  шаг», «3  шаг» в обеих версиях; проверить DOM, реально измеренный текст и ширину label, а также одиночный пробел и обычный многострочный body copy.
- [ ] Сохранить значимые обычные пробелы в конкретном однострочном hug label через локальный whitespace style; не распространять `white-space:pre` на body или rich-text абзацы. Использовать факты/исходное происхождение label, не номер блока частного письма.
- [ ] Закрепить отдельную длинную hug-пробу: у `text-auto-resize: width_and_height` reference max-width не должен ограничивать фактическую ширину label. Исправить локальную проекцию этих фактов в `propsFromFacts`; fixed/fill widths сохранять. Не выдавать эту дополнительную причину за причину исходных строк «2  шаг»/«3  шаг», для которых cap не был ограничивающим.
- [ ] Делегировать green tests и снимки Mobile/Desktop, включая Hero, Steps, обычные CTA и App-Download. Проверить изображения, живой текст, ссылку, размеры, responsive branches и комментарии. Опубликовать отдельный commit после review.

## Задача 3. Закрыть причину геометрии по элементам, а не общей высотой

**Файлы:** сначала локальная таблица измерений/fixtures вне repository; при доказанном дефекте — узкие области interpreter/primitive renderer и существующие fidelity tests. Модель и контракты не меняются ради совпадения общей высоты.

**Интерфейсы:** source readings, публичный renderer и DOM rect/computed style measurements; выход — 13 block deltas, элементные contributors, доказательство single-variable probes и отдельно residual. Не вводить глобальный «корректирующий padding».

- [ ] После задачи 2 повторить источник/браузер на одинаковых ширинах и закреплённых assets/font environment. Сохранить actual font, wrapping, line count, tokens, fractional bounds и начало/конец каждого блока.
- [ ] Разделить доказанные механизмы: процентный line-height и критический путь высоты, дробная высота fluid image, inline baseline дополнительной ячейки. Высота соседнего image/QR может подавлять вклад текста; изменения отдельных rect нельзя автоматически суммировать в общий блок.
- [ ] Проверить отдельный Footer unsubscribe anchor: если block display снимает именно лишнюю inline baseline и сохраняет источник, URL, подчеркивание и геометрию текста, закрепить локальный positive/negative test перед исправлением. Не превращать встроенные ссылки в абзацах в блоки.
- [ ] Для обнаруженного дефекта добавить failing test, минимальную правку и green проверку. Дробные размеры, следующие из разрешённых font/image facts, описывать отдельно от ошибки. Не округлять все высоты вверх и не фиксировать высоту живого текста/адаптивных изображений без источника.
- [ ] Reviewer принимает каждую причину по её измерению и сохранению layout. Остаток с неизвестной причиной остаётся отдельной задачей диагностики; малое total delta само по себе не закрывает E17.

## Задача 4. Разрешить конфликт Secondary crop отдельным решением

**Файлы:** до решения только diagnosis/plan и локальная crop evidence. `data/components/marketing.yaml`, asset foundations, export/model schema и Figma не меняются этим планом автоматически.

- [ ] Подтвердить source rectangles обеих версий и потерянные пиксели shared Mobile-cropped файла на закреплённых чтениях; при будущей смене Figma повторно снять факты.
- [ ] Зафиксировать, что CSS текущего файла не может дать оба точных crop. Не «исправлять» различие заменой object-position, растягиванием или другим похожим изображением.
- [ ] Представить отдельную конкретную границу решения: сохранить существующую политику с явным known difference либо разрешить минимальную новую export/binding политику, способную представить обе source области. Для второго варианта потребуются самостоятельный impact и согласование контрактной области; число файлов заранее не объявлять обязательным.
- [ ] Только после решения написать отдельный failing crop/binding test и план реализации выбранного варианта. Проверять плотность, crop, alpha, source hashes, shared/different viewport linkage и форму модели; не смешивать это с безопасными HTML задачами 1–3.

E16 остаётся открытым, пока точная совместимость не реализована либо отдельно не принят ограниченный результат. Тестовое разрешение старой выдачи не является постоянной политикой для новых писем.

## Задача 5. Дополнить просмотр ссылок в PR #128

**Файлы:** существующие `scripts/lib/email-delivery-form.mjs`, inventory и delivery tests, `docs/user-guide.md` — в общей реализации формы PR #128, без параллельного второго шаблона.

- [ ] Дополнить согласованный дизайн опциональным просмотром уже введённых ссылок: по тем же блокам/подписям, managed значения отдельно и без возможности заменить их. Zero-pending не должен останавливать сборку новым questionnaire.
- [ ] Failing browser cases: заполненные 23 пользовательских значения доступны для сверки, пустые поля по-прежнему единственные запрашиваемые; шесть managed не редактируются; отсутствие pending не теряет JSON или bindings.
- [ ] Реализовать через текущий фиксированный шаблон/inventory, без новой работы модели, чтения Figma или создания превью письма. Проверить repeated captions, split Mobile/Desktop, клавиатуру, escaping, download и stale-answer gates.
- [ ] Обновить инструкцию просмотра/сохранения и интеграционные tests. Не менять required URLs, final reserved-host policy и delivery schema ради UI.

## Задача 6. Компактная профилактика чтения и проверочных вызовов

**Файлы:** зарегистрированный `core/email-source-fidelity-standard.md` и только необходимые краткие пояснения `core/asset-export-standard.md`; существующие source/asset/CLI/execution tests. Не переносить большой Figma SDK или полный чеклист в SKILL.md.

- [ ] E01/E03: коротко закрепить nullable graphic identity внутри asset boundary, fail-closed model identity и явное чтение hidden descendants/ancestors. Проверить небольшие synthetic graphs: скрытый родитель, visible child, скрытый nested slot, null graphic и null model INSTANCE.
- [ ] E02/E19/E12: задавать bounded полные readings roots/blocks и необходимые rich-text fields; связать порции с capture ID/owner/order/digest. Оборванная порция или отсутствующий диапазон блокирует source proof; не использовать неполный ответ.
- [ ] E10/E11: выбирать transport из фактически доступного инструмента, сохранить исходный owner/Fill/hash и проверять локальные бинарные bytes. Existing roots-only download — допустимая техника сопоставления, не разрешение менять источник.
- [ ] E18/E20/E21: фактические CLI interfaces/stdout и returned receipt refs, один reference root и bound inventories; не добавлять новый CLI flag, не повышать 4 KiB и не исключать изображения из доказательств ради размера.
- [ ] E23/E24: проверочные probes используют `pathToFileURL`, существующий browser executable, полные public function arguments, attached/visible semantics по viewport и text selectors с headings/anchors. Проверять правильность harness; не считать начальный сбой harness ошибкой письма.
- [ ] E06/E07/E09/E22: подтвердить существующие guards отрицательными cases, не менять правильное поведение. Покрытие approval не переносится между assets; test artifact и source FAIL остаются отдельно от formal/production acceptance. Исторические ошибки не удаляются задним числом.

## Финальная проверка будущих изменений

- [ ] Каждый законченный пакет получает независимую содержательную проверку первичных требований и действительного diff; tests PASS не заменяют review.
- [ ] На точном окончательном cloud SHA делегировать целевые tests, browser comparisons и полный локальный `npm run verify` плюс `npm run generate:check`, если менялись runtime modules. Изменённый SHA требует свежих результатов.
- [ ] Перед публикацией согласовать allowed paths и реально затронутые generated outputs по manifest. Не редактировать производные документы вручную; не генерировать их для docs-only текущего PR.
- [ ] Повторно сверить hashes/размеры/mtime исходной папки и подготовительных доказательств. Новые diagnostic outputs остаются отдельно; конкретное письмо не обновляется этой работой.
- [ ] В отчёте закрытия E01–E24 указать: устранённая системная причина, сохранённая корректная защита, профилактика инструмента, отложенное решение либо доказанный residual. Не переводить всю матрицу в resolved одним общим PASS.
- [ ] Обновить состояние системы и соответствующие PR, не затирая соседние разделы. Слияние и установка требуют отдельной команды; реальные клиенты/импорт/отправка без внешнего результата остаются `not-run`.

## Проверка текущего планового PR

Сейчас разрешены только diagnosis, этот план и ссылка в `docs/system-status.md`. Проверка включает точный cloud diff, сохранность остальных blobs, relative links, полный охват E01–E24, соответствие первичным источникам, честные limits, неизменность всех исходных файлов и отдельное review. Будущие задачи выше не выполнены этой документацией.
