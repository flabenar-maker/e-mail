# CUPIS: доказательство реализационных фактов без подмены их источника

Дата: 03.10.2026. Статус: одобрено пользователем («Делай сразу весь»); реализация выполняется по [дочернему плану](../plans/cutover/2026-10-03-cupis-contract-fact-proof-repair.md). Это уточнение оставшейся области P2, не новый глобальный этап.

Основание: cloud candidate PR #110, `ae71f358a8360e8c087021dba0847195dbaf60e5`, при `main@618d124df0a664c84d23a724ba50ef2b324e9b97`. Порядок и открытые обязанности остаются в [roadmap](../plans/2026-08-25-cupis-migration-roadmap.md) и [журнале cutover](../plans/2026-10-01-cupis-final-maintenance-cutover.md#остаток-directcross-sourcederivednormative-proof--03102026). Уже реализованные T1/S1 и nested-artwork не заменяются; их граница находится в [предыдущей спецификации](2026-10-02-cupis-template-shared-evidence-links-design.md).

## 1. Что исправляем и что сохраняем

Цель — честно и проверяемо выразить происхождение уже существующих фактов. Машина должна отличать значение, буквально прочитанное из Figma, от размера использования у другого владельца, HTML-интерпретации и согласованного HTML-решения.

Сохраняются все текущие значения: размеры, цвета, шрифты, отступы, `auto`, `content-driven-cover`, 25°, crop, alpha, export profiles, asset boundaries, структура Mobile/Desktop и поведение HTML. Не меняются Figma, короткие Description, локальные письма и изображения, renderer, статусы маршрутов, навыки, PR #109 или `main`. Слияние, P3 и cutover не входят в разрешение на этот ремонт.

Сверка на `9af5fad12c044c6173c4686cbd7e46b6333ec38a` обнаружила 18 unmapped leaves: 3 единицы измерения и 15 остальных. Среди имеющихся scalar mappings было 0 value mismatches. Это не приёмка компонентов: непокрытые native facts, capture diagnostics, F2, binding/visual evidence и F7 остаются отдельными обязанностями. Семь свежих packets и два supplemental reads сохраняют исходные SHA, receipts и даты; они не становятся evidence будущего code commit.

Подтверждены пять неверных provenance-ссылок: старые sections Description отсутствуют у двух Primary CSS-angle facts, Hero mobile-auto и Secondary mobile-auto/desktop-cover. Исправление provenance не разрешает менять их значения или возвращать подробные Description.

## 2. Выбор метода

Выбран небольшой typed слой в существующем component-audit, а не новый рендерер или универсальный язык выражений.

- Существующие `contracts.figma_fact_links` продолжают проверять прямые собственные Figma-значения. Их source/target rules и диагностика не ослабляются.
- Дополнительные обязанности хранятся как optional `evidence_links.fact_proofs` в том же component record. Пустой/отсутствующий массив не освобождает от проверки фактов. Идентификаторы уникальны среди всех evidence links этой записи.
- Закрытый набор proof kinds проверяет только описанные ниже отношения. Нет `ignore`, `approved: true`, caller-provided expected values, wildcard pointers, JavaScript expressions, допусков или ветвей по конкретным CUPIS component IDs.
- Ожидаемое значение читается по точному contract path из canonical record закреплённого SHA. Source и foundation targets разрешаются через тот же canonical model и manifest.

Отклонены две альтернативы: маппить Figma `FIXED` прямо в HTML `auto`/выдавать gradient transform за CSS25° — ложное доказательство; заводить отдельный ручной реестр чисел и условий — второй владелец тех же фактов.

## 3. Общая форма и границы владения

Каждый proof содержит `id`, `kind`, точный `contract_path` на собственный atomic fact/value и типизированные ссылки на необходимые sources/consumer/asset/foundation либо decision. Допустимые поля зависят от kind; неизвестные поля отклоняются.

Точные selectors хранят ссылки, а не снимки ожидаемых native значений. Canonical source не заменяется caller object. Identity включает component, variant, node и file, а не совпадение имени, чисел или последней части compound ID. Для общих source-only facts proof охватывает все применимые зарегистрированные variants; одного совпавшего Product variant недостаточно. Множество обязанностей выводится из canonical variants и типа факта независимо от списка успешных links.

У literal atomic facts, значение которых подтверждает новый слой вместо прямого native mapping, provenance становится `contract-proof` с `proof_id` той же записи. Такая provenance обязана разрешиться ровно в один proof правильного kind и exact target, иначе это missing-proof/invalid-provenance failure. Исчезнувшие Description sections и старый registry blob не переименовываются в якобы native источник. Proof на fact/value не распространяется на соседние facts, весь элемент или весь asset. Для нескольких viewports остаются отдельные exact targets.

Обязательные contract targets сначала перечисляются самим существующим contract-fact walker по canonical contracts и semantic роли элементов, независимо от наличия `fact_proofs`. Ни оставленный `figma-description`/`registry-literal`, ни удалённые `proof_id`/proof array не дают покрытие: target без допустимого direct mapping, существующего exact QR derivation либо нового verified proof остаётся `CONTRACT_FACT_UNMAPPED`; malformed или отсутствующая обязательная provenance дополнительно отклоняется схемой. После этого target классифицируется по типу/value shape, fact ID, viewport и semantic role, а не CUPIS component ID. Пустой массив никогда не устанавливает success сам по себе.

`style-usage` является дополнительной проверкой связи уже directly mapped style-ID fact с foundation и source name/run values: его native provenance/direct mapping сохраняются. Такой supplementary proof может подтвердить только перечисленные source relationships, но не заменить direct proof значения самого ID. Присоединение supplementary proof не превращает любой другой literal в подтверждённый.

Существующая `asset-reference` остаётся ссылкой без нового literal/provenance: proof проверяет разрешение этой ссылки и export relationship. Это не число из Figma. Другие reference types не получают автоматического освобождения от live проверки только потому, что ссылка валидна.

Форма machine fields и диагностики должна быть полностью описана в implementation plan после одобрения этой спецификации. Нельзя начинать canonical mapping changes по одним названиям kinds.

## 4. Закрытый набор проверок

### 4.1. `source-value-set`: прямой факт общих source variants

Предназначен для source-only helper, чей общий fact описывает несколько Product variants без Viewport axis. Каждый фактический source variant и нужный node читаются свежо. Значение сравнивается с единственным canonical fact; неизвестный, пропущенный или несогласный variant не подтверждает общий факт.

В первой области — собственный Fill #F3F3F5 и source geometry 322×50 обычного Header-Logo; 212×33 Compact. Цвет требует точного SOLID paint, явной видимости/opacity и достаточного ancestor context. Скрытый или полупрозрачный совпадающий HEX не считается доказательством. Размеры подтверждаются парой width/height одного node с native unit `px`. Существующая нормализация float-погрешности сохраняется; новые округления не вводятся.

Три unit leaves закрываются только вместе с доказанной парой ширины/высоты их собственного источника или потребителя. `px` нельзя подтвердить отдельным ожидаемым literal или взять от другого node.

### 4.2. `consumer-geometry`: размер использования, не исходного знака

Обычный Header-Logo имеет source 322×50. Его mobile-display fact 212×33 описывает использование в Email/Header, не геометрию обычного source variant. Точный consumer — Mobile Header instance1008:1709; его native main — Compact source1008:1686. Desktop instance1008:1823 использует обычный source1008:1473.

Проверяется полный путь использования: asset принадлежит указанному canonical владельцу; Desktop consumer связан с его source через существующий `source_dependencies`; Mobile и Desktop элементы Header ссылаются на один существующий собственный asset contract; Mobile placement связан со своим Compact source. Source и consumer captures, variants, ancestry, direct-image placement и обе dimensions должны совпасть. Равенства строк `header-logo` или размеров недостаточно: это scoped IDs разных владельцев, и их связь требуется доказать отдельно.

Обе стороны и Product-Logo dependencies требуют свежих packets в текущей session. Отсутствующий Product target остаётся unverified, даже если раньше проходил. Не создаются mobile export, второй asset, reverse-link data или HTML-контракт для Shared. Описываемый размер явно помечается consumer usage; его нельзя выдавать за native source geometry.

### 4.3. `asset-profile`: связь ассета и scale suffix

`export-asset-reference` подтверждается существующим собственным asset contract и проверенным artwork ownership/source path. Суффикс `@4x` подтверждается фактическим именем выбранного semantic owner и зарегистрированным export profile, не настроенной exportSettings Figma.

Для Compact без своего export contract профиль берётся из конкретного подтверждённого использования у Header, а не создаётся искусственно. Фактические root names `Asset/Header-Logo @4x` и `Asset/Header-Logo-Compact @4x` читаются как identity component-set, не подставляются из canonical имени и не ищутся в названии Product variant.

Проверка требует точного конечного suffix, отсутствия конфликтующего profile и единственного owner; присутствия строки `@4x` где-то в имени недостаточно. Source/native geometry, display geometry и pixel output не смешиваются. Это scope proof, не доказательство успешно выполненного экспорта конкретного письма.

### 4.4. `style-usage`: имя через существующий style ID

Fresh node `figma_style_id` и `figma_style_name` разрешаются в единственную existing typography definition через её exact `figma_style_id`. Сравнивается пара ID/name, viewport и применимые native параметры текста. Имена и определения не копируются в новые component facts или ручную таблицу.

Первая область — шесть Contact-Support TEXT nodes: Desktop heading/phone/help и Mobile heading/phone/help. У обоих help-text aggregate font family/style может быть mixed/null, хотя вес400 и Roboto Regular подтверждаются runs. Null не переводится в CSS и не заменяется догадкой. Для run-based proof проверяются полные неперекрывающиеся ranges, точное совпадение characters с node text, family/style/size/line-height и существующие segment facts; локальная ссылка сохраняет свой underline и цвет.

Uniform font-weight допустимо подтвердить только при полном совместимом наборе runs и соответствии node/font foundation; смешанный или недоступный набор не даёт успеха. Этот proof не объявляет все Figma definitions/bindings библиотеки проверенными и не снимает остальные MIXED/capture diagnostics. Native parameters остаются отдельно проверяемыми direct/segment facts.

### 4.5. `mobile-image-auto`: HTML-интерпретация пропорционального изображения

Область — direct-image элемент Mobile со своим существующим asset contract. Проверяются exact element/asset pairing, placement в Mobile, source image identity/paint, native geometry/sizing и существующий assets display-mode contract с пропорциональной width и auto height. Canonical HTML keyword должен быть ровно `auto`.

Figma horizontal FILL и vertical FIXED остаются native значениями reference-макета. Одного FILL, HUG или FIXED недостаточно: вывод основан на связанном display policy и целостности нужного источника. В первой области — Hero296×190 и Secondary296×188. Эти высоты не становятся фиксированной HTML-высотой.

### 4.6. `content-height-cover`: HTML-интерпретация Desktop изображения рядом с текстом

Проверяются exact HORIZONTAL card, content-driven HUG height, существующий text sibling с HUG height и FIXED width, image sibling с vertical FILL и image paint FILL. Проверяются их общая ancestry и порядок, asset/display-mode `fill-image`, значения соответствующих собственных native facts и exact canonical keyword `content-driven-cover`.

Первое использование — Desktop Secondary. Width300 принадлежит text container; source mobile-image ratio принадлежит asset; высота238 — reference-результат текущего текста. Она не становится фиксированной высотой HTML или export target. Один paint FILL без связанной структуры не подтверждает этот режим. Crop, экспортный источник Mobile и отображение Desktop сохраняются.

### 4.7. `approved-css-gradient-angle`: отдельное HTML-решение

Точное25° сохраняется в обоих Primary facts. Native gradient stops #18B037→#3DD55C и transform проверяются отдельно; transform не используется как доказательство CSS25°.

Proof допускается только для числового CSS angle линейного gradient. Он связывает exact owner/viewport/element/fact target с decision ID, digest его текущего typed value и подлинным основанием человеческого решения. В digest входят owner/viewport/element/fact identity и typed value, не одно число25. Одна decision может явно перечислять оба approved targets; расширить её на третий target молча нельзя. Свободный `approved: true` или скопированный value/hash не являются основанием.

Основание уже дано пользователем: «По кнопке: делай 25 градусов точным значением». При одобрении этой спецификации повторно подтверждается применение именно к двум существующим Primary targets. Единственное canonical место decision — optional `evidence_links.normative_decisions` того же component record. Отдельного decision registry или нового файла с числом25 нет. Каждый decision обязан иметь уникальный `id`, закрытый `kind: css-linear-gradient-angle`, точный owner, непустой уникальный target-set и `authorization`. Каждый target содержит viewport/element/fact/contract-path, value digest и source-context digest с точными source selectors. Все targets принадлежат этой записи; proof ссылается на её decision ID. Value по-прежнему хранится только в существующем fact.

`authorization` содержит exact user instruction, явно записанный scope owner/targets и ссылку path+exact cloud commit на письменно одобренную спецификацию. Авторская запись разрешена только после реального явного пользовательского согласования; наличие файла или quote/hash не считается согласием. При реализации агент сохраняет фактическое разрешение, показывает decision payload в impact/read-back и не заполняет её автоматически по сохранённому status. Дата или URL сообщения не выдумываются. Внутренняя схема проверяет форму, owner/target consistency и наличие approval reference; машина не обещает криптографически доказать человеческое авторство. Digest связывает решение с конкретным значением/context, но не заменяет разрешение.

Checker требует зарегистрированный decision, target membership, совпадающий value digest/type и свежий native gradient context. Отдельный context digest связывает решение с exact source file/variant/node/paint index, типом/видимостью/opacity paint, gradient stops/transform и проверенным ancestor visibility/opacity context; это hash нормализованных точных данных, не вторая таблица значений. Его формирование требует фактического MCP-пакета и сохранённого разрешения, не реконструкции из Description. Без решения возвращается unverified; при смене25/owner/viewport/fact или native gradient context — соответствующий failure. Нормативный proof никогда не подтверждает native padding, color, dimensions или Figma angle. Он сообщает «согласованное HTML-значение», а не «снято с Figma».

## 5. Capture, canonical model и свежесть

Достаточно узкого нового поля `owner_identity`: exact selected component node ID, type и name, возвращённые непосредственно MCP. Для нового producer используется capture1.3.0; session1.1.0 и existing challenge/receipt envelope не меняются. Старый packet1.2 остаётся допустимым для прежних T1/S1 checks, но отсутствие owner metadata не подтверждает новый suffix proof. Packet не повышается в версии дописыванием поля после вызова.

Contact style ID/name уже присутствуют в текущем capture; не нужен повторный полный сбор текстовых стилей или новый параллельный style catalog. Этот шаг подтверждает usage и применимые native node/run values, не всю библиотеку definitions.

Canonical model дополнительно загружает existing assets/typography и их schemas через pinned manifest. Новых source IDs или foundation values нет. Свежие source/consumer/target packets получают текущий canonical SHA и новые request nonces. Hash bytes, file containment, complete tree/node-count, точные variants, remote identity, host/Figma clock domains и сохранение receipts остаются обязательными.

Generic proof-checker является отдельным небольшим pure module. Он получает validated canonical model/session; не получает caller expected values или готовый caller success report. Orchestrator сам вызывает checker. Public CLI и direct in-memory entrypoint должны одинаково проверять canonical record, session, identity и packet pairing до допуска новых proofs.

## 6. Диагностика и coverage

Результат различает direct match, verified relation, derived HTML rule и approved normative decision. Каждый item содержит proof/owner/target, kind, использованные source/consumer/foundation paths, receipts и точную причину. `mismatch` означает известное несовпадение; `unverified` — недостаток или недопустимость evidence.

Новая проверка сохраняет исходный scalar report отдельно и показывает effective coverage только для конкретных успешно доказанных contract/source paths. Она не стирает исходные diagnostics и не превращает все fields source node в covered. Report не переносится на другой SHA/session/owner. В effective fact report proof может закрыть лишь соответствующий coverage gap и неверный прежний provenance после его разрешённой замены. Value mismatch, чужая identity, capture error и несвязанная диагностика не закрываются. Combined результат требует effective facts, прежние evidence-links/nested-artwork и новый proof-checker; исходный raw report сохраняется для трассировки, но его уже доказанный coverage gap не делает effective report вечно ложным. Остальные blockers сохраняются.

Для 18 leaves составляется exact accounting: own-source geometry/color; consumer geometry; units той же пары; suffix; asset relationship; три responsive keywords и два нормативных CSS-angle targets. Неуспешный proof, неверный provenance или потеря одного обязательного variant оставляют соответствующий leaf непроверенным. Старая QR derivation сохраняется отдельно и не расширяется component-ID branches для нового scope.

Появление source path в новом proof не позволяет скрыть direct mismatch на нём. Пока оставшиеся implementation-significant fields не классифицированы/подтверждены, нет combined acceptance компонентов или P2. В частности, этот ремонт не автоматически закрывает absolute-child layout, все mixed fields или 1629 source coverage diagnostics.

## 7. Потребители и карта влияния реализации

| Область | Затронутые файлы и ответственность |
| --- | --- |
| Typed metadata/provenance | `schemas/components.schema.json`; только metadata/provenance согласованных записей `data/components/{shared,marketing,service}.yaml`; их rendering values/trees/assets сохраняются |
| Pure proof/target validation | новый узкий `scripts/lib/contract-fact-proofs.mjs`; минимальное подключение в `component-registry.mjs`, `component-evidence-links.mjs`, `component-evidence-inputs.mjs`, `figma-component-evidence.mjs`, `figma-contract-facts.mjs` и audit CLI |
| Capture identity | `scripts/figma/capture-contract-source.js`, совместимость version gating в freshness/inputs/auditors; не Figma mutation |
| Canonical foundations | existing assets/typography loaders и manifest registrations; новые definitions и реестры не создаются |
| Нормативная граница | `core/component-contract-standard.md`: только раздел proof ownership/доказательной сверки, не HTML-инструкция или дублирование component facts |
| Readable projection | `scripts/lib/component-registry-doc.mjs` и механический generated registry: видна категория происхождения и links, не вторая таблица чисел |
| Изоляция HTML | tests для `context-bundle.mjs`, render-impact/HTML/export inputs/compact Description; production rendering code не меняется |
| Локальные проверки | schema/reference/capture/audit/CLI/negative tests, сохранность projections и raw snapshot; никакие Actions/Checks |

`evidence_links` не входит в email bundle уже сейчас, а provenance исключается из его facts. Новые proof metadata не должны попадать в модель/рендер. Source digests и schema version могут измениться; rendering projection и итоговый HTML на одинаковых входах должны быть побайтово прежними. Типизированная provenance обновляет readable registry механически; Compact Description остаётся прежней.

Список выше — область будущей реализации, не отчёт о выполненных изменениях. Точный allowlist полей записей, новые версии схем, API shapes и команды RED/GREEN будут закреплены после письменного одобрения в дочернем implementation plan P2, без самостоятельного нового roadmap.

## 8. Критерии успеха и порядок следующего шага

1. Письменно согласован этот способ proof, включая consumer-size meaning и отдельное нормативное25°, без изменения текущих rendering values. Затем составлен и одобрен implementation plan; до этого нет product/schema/canonical writes.
2. RED cases показывают нынешние gaps; GREEN проверяет каждый kind и ошибки: wrong source/file/variant/owner/asset/path/style/decision, duplicate/cyclic links, missing variants, неполные/старые packets, same-value wrong-node, чужой receipt/SHA и попытка подменить expected value.
3. Проверены Mobile auto и Desktop content-driven cover как правила: при смене reference-height нельзя случайно закрепить HTML height; неподходящая source topology или display policy не проходят. Fixed geometry остаётся independently observable, не переписывается ради успеха.
4. Подтверждено, что три units закрываются доказанной парой своего источника; source322×50 не используется вместо consumer212×33, и обратная подмена отклоняется.
5. Fresh MCP session точного code commit включает реальные нужные targets, включая Product-Logo. Реальные новые receipts не заменяются прошлыми семью packets. Terra Medium выполняет локальный audit и сообщает exact accounting, не только зелёный общий статус.
6. Сохранность numeric values, структура, assets/foundations, compact Description, rendered/export projections и несвязанные records проверяются автоматически. Нет массового обхода всех62 записей ради одного scope.
7. Новый механизм проверен в собственной области; открытые F2 widths, оставшиеся binding/visual/significant coverage и F7 всё ещё записаны в текущем плане. После их closure — независимое review и полный локальный gate exact final SHA перед отдельным разрешением на merge.

Эта спецификация не означает приёмку P2, готовность cutover, изменение оставшихся правил или разрешение запустить P3/#109. Она устраняет одну конкретную неопределённость: каким способом доказывать уже записанные факты, не выдавая HTML-решения за буквальные поля Figma.
