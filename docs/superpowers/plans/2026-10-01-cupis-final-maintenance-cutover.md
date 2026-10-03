# CUPIS: финальный cutover поддержки системы — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans для последовательного выполнения. Шаги отмечаются чекбоксами; тесты и visual regression делегируются GPT-5.6 Terra Medium.

**Goal:** Доказать готовность пяти маршрутов поддержки, включить только прошедшие проверку и завершить миграцию без нарушения уже работающей сборки писем.

**Architecture:** Manifest остаётся единственной картой; навыки получают один bundle и его workflow. 11A доказывает цепочку источников и действий, 11B выполняет разрешённое переключение, 11C отдельно убирает ненужные переходные артефакты. План не вводит новый навык, формат контрактов или владельца правил.

**Tech Stack:** Node.js 24, YAML/JSON Schema, resolver, GitHub CLI, Figma MCP, локальные Node/PowerShell проверки.

**Spec:** [Master-spec, §§15–18](../specs/2026-08-24-cupis-structured-email-system-design.md#16-cutover-и-rollback), [roadmap](2026-08-25-cupis-migration-roadmap.md), [локальная маршрутизация](../specs/2026-09-28-cupis-codex-routing-web-delivery-design.md).

## Статус и основание

План подготовлен 01.10.2026 на `main@e08b5099f72b9ac3aa7aff33df6a3a3526868232` и после review слит через PR #106 в `09537effc89daadacaed1d05497a1e75beb18152`. Prerequisite 10A выполнен: итоговый router синхронизирован после отдельного разрешения; canonical byte-match, catalog/frontmatter, сохранность специализаций/config и локальные handoff/boundary gates подтверждены. По следующей команде начат пакет 1 на main@ace7725d6e88dce0b9b130cd5610f4bcade4feb9; его source-closure findings записаны ниже. Пакет 1 слит через PR #108 на `6c0bf7d0d3b1ca7909b692541883d2b0e9788709`. Пакет 2 продолжается отдельно в [draft PR #110](https://github.com/flabenar-maker/e-mail/pull/110); свежая точка возврата и весь неслитый журнал находятся ниже в этом плане. Bounded repairs capture и generated-карты типографики реализованы; это не приёмка пакета 2. 11A ещё не завершён; пакеты 3–6 и production cutover не выполнены.

Два email routes уже активны; пять маршрутов поддержки пока указывают на `workflow-paused`. `data/workflows/library-maintenance.yaml` существует со статусом `shadow`, но сам этот файл не доказывает достаточность каждого профиля. В частности, его общие steps ссылаются на component/naming sources; профиль `migration-progress` содержит README, roadmap и paused boundary. До переключения надо проверить фактическую совместимость, а не назначать общий workflow всем маршрутам.

Исходный `backup/pre-structured-migration-2026-08-24` сохранить. Каждый пакет начинает с нового pinned main и собственной облачной ветки; merge и следующий пакет — только после успешных проверок и отдельной команды.

После принятого пакета 5, до отдельно разрешённого пакета 6, предусмотрен [follow-up карточных блоков, draft PR #109](https://github.com/flabenar-maker/e-mail/pull/109). Полная актуальная очередь, ссылки на его план и границы интеграции документов находятся в [roadmap](2026-08-25-cupis-migration-roadmap.md#единый-актуальный-список). Организация папки plans и удаление ручного checkpoint не являются выполнением пакета 6.

### Текущая точка возврата P2 — 02.10.2026

**Сбор завершён: 61/61 полных packets; пакет 2 НЕ принят.** Согласованный bounded repair единиц и standalone-icon topology выполнен на code candidate `78aaf0b9`; подробные результаты и ограничения записаны ниже. Свежая read-only сверка 17 shared-записей выполнена; пользователь уточнил различие вспомогательных элементов и корневой оболочки Template (см. журнал ниже). Карта значимых Template→shell и Shared→asset-owner связей выполнена на candidate `50ad6e57` (см. новый журнал ниже). Текущие shell-значения совпадают; выявленный пробел межисточниковых связей T1/S1 закрыт ограниченным ремонтом ниже, без самостоятельных HTML-контрактов Shared. Направление и письменная [спецификация служебных evidence-связей T1/S1](../specs/2026-10-02-cupis-template-shared-evidence-links-design.md) одобрены. [Технический под-план из семи задач внутри P2](cutover/2026-10-02-cupis-template-shared-evidence-links.md) подтверждён; задачи 1–5 выполнены в кандидате (schema 2.2.0/offline validation, capture/canonical-session inputs, T1/S1 checkers и общий auditor/CLI, без изменения визуальных фактов). Задача 6 выполнена в кандидате:29 canonical links подтверждены, включая Mobile Header; projection/isolation проверены. Итоговый gate задачи 7 выполнен в области T1/S1. Следующая read-only сверка 14 owners/targets выполнена на 2e5d4a: числовых mismatches в existing mappings нет; классифицированы 15 non-unit facts, типографика Contact-Support и nested artwork. Найден host/Figma clock-domain blocker свежести; исходные timestamps сохранены. По следующей команде пользователя выполнен bounded ремонт свежести: session 1.1 / request-bound capture 1.2, общий validator и повторные 14 packets приняты по свежести; подробности ниже. Оставшийся ownership/direct/cross-source/derived/normative proof не закрыт этим результатом; canonical values/P3/merge не изменяются автоматически. Ранее дополнительный read-only разбор на candidate `23c02336e578a38730ab57ebaf0f8faf2763e67f` классифицировал причины diagnostics и определил точечные предложения ремонта; детали в разделе «Разбор причин P2» ниже. Этот разбор не менял code/contracts/Figma и не заменяет unresolved semantic checks. В предыдущем продолжении получены все оставшиеся 24, затем выполнен локальный аудит всех 61. Нового quota error не было. Повторное чтение прежней очереди из 24 не является следующим шагом. Ниже сохранена историческая остановка, а не текущая команда повторить сбор.

Основание: `main@618d124df0a664c84d23a724ba50ef2b324e9b97`; comparison candidate `51da5756777acacbd04ea1380568c93577456380`, оба его родителя — прежний PR #110 и слитая организация plans из PR #111. Пять P2 repair/test/generated blobs сохранены побайтово. Использован один candidate bundle `library-maintenance / read-only / both`: 61 record, четыре foundations, пять static sources; `paused / SKILL_ROUTE_PAUSED` разрешает только область этого миграционного плана, не production maintenance.

| Проверка | Результат |
| --- | --- |
| Capture | 37 полных packets предыдущего чтения + 24 новых одним исправленным capture blob `18e2ef8c8498629d8a54cf98cc46e0601fa2537d`; все 61 audited |
| Точные сравнения значений | 28 mismatches: 4 у обычного `block-transaction-success`; 24 у пяти owners отложенного PR #109 |
| Deferred #109 | `block-cards-images` 4; `card-image` 2; `card-icon` 2; `block-icon-cards` 16; `block-icon-list` 0 value mismatches, но 20 missing source paths. Владельцы не исключались целиком |
| Description | 61/61 совпали с canonical renderer; запись в Figma не нужна и не выполнялась |
| Typography definition | 15 live text styles; 75/75 сравнений family, Figma font style, size, line-height, letter-spacing прошли существующую числовую нормализацию |
| Spacing definition | Прочитаны 22 FLOAT variables и одна collection; 30/30 role×viewport assertions сопоставлены по value и точным variable id/name/type |
| F2 read-back | Четыре ширины подтверждены отдельным MCP read-back; свежие Desktop/Mobile Figma screenshots рассмотрены Terra |
| Локальная целостность кандидата | `validate-system`, `generate-docs --check`, targeted capture/fact/CLI/generated-doc tests: 46/46 PASS; main-docs organization и прежние пять P2 blobs сохранены |
| Граница результата | Нет новой HTML-сборки/HTML visual regression или real-client gate; нет Figma/contract/foundation/skill/route/letter mutations; PR остаётся draft, не слит |

**Baseline coverage до bounded unit/icon repair — не список визуальных дефектов.** Audit увидел 38 300 source facts / 15 046 mapped и 19 956 contract facts / 15 115 mapped. Открыты 23 254 `FIGMA_FACT_UNCOVERED`, 4 863 `CONTRACT_FACT_UNMAPPED`, 20 `FIGMA_SOURCE_PATH_MISSING` (все у deferred `block-icon-list`, обычных owners — 0), 18 unsupported diagnostics, 17 evidence-links-not-contract и topology diagnostics. Raw capture содержит 207 diagnostics: 160 `ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW` и 47 `MIXED_VALUE`. Это требует классификации значимости и exact mapping; blanket exclusions или переутверждения контрактов ради GREEN нет. Не использовать несуществующий diagnostic `SOURCE_PATH_MISSING` и не вычислять unmapped как разность агрегатов: raw atomic fact paths и Set разрешившихся mapping targets — разные множества; target попадает в Set до проверки provenance и совпадения значения.

**P2-F2 — уточнённая причина без автоматической правки.** В Desktop `text-details` 459:27425 — FILL 251 вместо reference 252; `status-container` 459:27428 и `status` 459:29356 — HUG 117 вместо 116. Сумма строки: 72 + 24 + 251 + 24 + 117 = 488. В Mobile `status` 459:29376 — HUG 94 вместо 93; x=79 в строке 252 подтверждает центрирование. Это сильное evidence устаревших измеренных ширин, зависящих от содержимого, а не доказательство поломки HTML. Причина изменения метрик текста во времени отдельно не установлена. Числа и правила адаптивности не переписываются; согласовать судьбу четырёх reference facts и затем выполнить отдельный scoped correction/read-back.

**Что foundation-сравнение не доказывает:** не проверены все text-style case/decoration/paragraph/description/variation settings, все места применения component bindings, asset/naming semantics и визуальный HTML output. Совпадение definition не заменяет сравнение каждого назначения в component contract. Наличие полей исправленного capture (609 text_geometry/font_weight/figma_style_name occurrences, 2 568 minimum_width_px, 53 gradient_stops) доказывает получение полей, но не их полное semantic mapping.

**Следующие действия, всё ещё в P2:**
- [x] Разделить diagnostics по подтверждённым причинам: units, source-only topology, missing owned links, nested artwork boundaries, derived behavior и deferred #109; записать точные примеры и карту дальнейшего ремонта.
- [ ] Закрыть оставшиеся значимые owner/node/path в отдельно согласованной области. Bounded unit/icon repair выполнен по разрешению; он не закрывает missing owned links и не разрешает следующие изменения canonical facts, alias/nested-artwork policy или blanket exclusions.
- [ ] Принять решение по четырём F2 reference widths; HTML/layout strategy не менять по одному числовому снимку.
- [ ] Дозакрыть нужное foundation/binding и visual evidence для выбранных значимых обязанностей.
- [ ] Завершить сопоставление архивных обязательств с текущими владельцами; P2-F3 recorded association projection уже исправлен, но не доказывает live usage.
- [ ] Оформить F7 decision и exact producer/schema/manifest/output/test map для generated workflow checkpoints до начала P3. Генератор ещё не реализуется.
- [ ] После closure выполнить полный локальный gate точного финального SHA и независимое review перед отдельно разрешённым merge кода. P3 и cutover не начинать по факту одного успешного сбора.

### Остаток direct/cross-source/derived/normative proof — 03.10.2026

**Выполнена read-only сверка на `9af5fad12c044c6173c4686cbd7e46b6333ec38a`, не очередной ремонт или приёмка P2.** Использован ровно один `library-maintenance / read-only / both` bundle: requested14/resolved18, `paused / SKILL_ROUTE_PAUSED`, SHA-256 `49fe907d7d3ddd18cc833401d68d18db3750bdc8bff4c99b1a620de894e0074e`. Exact execution snapshot сохранил 245/245 raw files. Native данные получены только через Figma MCP; ни изменения отложенного #109, ни повторный общий сбор библиотеки не выполнялись.

Семь новых request-bound capture 1.2.0: обычный и компактный Header-Logo, Email/Header, Hero, Secondary, Primary и Contact-Support. Session 1.1.0 закреплена на том же SHA, host interval `2026-10-03T10:59:03.420Z`–`2026-10-03T11:00:47.798Z` (13:59–14:00 МСК). Loader принял 7/7 exact packets. Два дополнительных raw MCP reads сохранили актуальные Description, шесть text-style definitions и точные имена владельцев Header-Logo; они не выдаются за дополнительные canonical session packets.

**Диагностика Terra Medium:** среди existing mappings `FIGMA_CONTRACT_MISMATCH` = 0. Scalar audit сохраняет 1 629 `FIGMA_FACT_UNCOVERED`, 18 `CONTRACT_FACT_UNMAPPED`, 2 `EVIDENCE_LINKS_NOT_IN_CONTRACT` и 1 `FIGMA_CAPTURE_UNSUPPORTED`. Capture errors: Header-Logo 3, Compact 3, Header 2 — `ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW`; Contact-Support 8 — `MIXED_VALUE`; Hero/Secondary/Primary 0. Это не перечень 1 629 визуальных дефектов и не основание исключить все непокрытые поля. Три из 18 unmapped leaves — units; остальные 15 — прежние non-unit obligations. В этой узкой session нет Product-Logo packet: восемь unverified source identities у двух Shared logos и Header не означают поломку ранее подтверждённых dependencies; старый packet вместо свежего не подставлялся. Hero/Secondary evidence links подтверждены в своей области, но combined acceptance не заявляется.

| Область | Свежие факты | Что именно осталось исправить в доказательном представлении |
| --- | --- | --- |
| Header-Logo / Compact | Три обычных source variants 322×50; три Compact 212×33. В Header instances 1008:1823 и 1008:1709 — соответственно 322×50 и 212×33. Собственный Fill #F3F3F5. Имена владельцев 1008:1476 / 1008:1708 действительно `Asset/Header-Logo @4x` / `Asset/Header-Logo-Compact @4x` | Direct proof цвета и source geometry отделить от cross-source consumer geometry. `@4x` подтверждать именем реального владельца и export profile; asset-reference — связью. Не объявлять 212×33 геометрией обычного source 322×50. Сохранить все текущие размеры и export policy |
| Hero / Secondary | Mobile image frames 296×190 / 296×188, horizontal FILL, vertical FIXED. Desktop Secondary: card HORIZONTAL/HUG; content-area width300, HUG; image252×238, vertical FILL, paint FILL | Native sizing остаётся native fact. HTML `auto` и `content-driven-cover` требуют явного typed interpretation proof из нужных source facts и существующего asset display contract. Не маппить Figma FIXED в `auto`, не замораживать HTML-высоту по 190/188/238 |
| Primary | Оба native gradients имеют stops #18B037→#3DD55C и gradient transform; contract содержит уже одобренное HTML-значение25° | 25° не является буквальным полем Figma. Нужен отдельный проверяемый нормативный источник/тип доказательства для утверждённого HTML-решения. Число25 и цвета сохраняются |
| Contact-Support | Шесть exact style ID/name pairs соответствуют Desktop/Mobile Body/Large, Heading, Body/Medium; фактические sizes18/26/16 и14/18/12. Heading/phone weights400/600; оба help-text weights400, все их runs Roboto Regular, node font_style null/mixed | Имена связывать через existing style ID с typography foundation, не добавлять вторую таблицу. Два help-text weights и mixed aggregate font_style классифицировать отдельно; `null` не становится CSS font-style и не заменяет полные segment facts |

**Дополнительно подтверждён реальный stale provenance:** актуальные Description `button-primary`, `banner-hero`, `banner-secondary` содержат только CUPIS ID/PURPOSE/RENDER. Разделов `BACKGROUND`, `IMAGE @2x`, `IMAGE ASSET`, на которые указывают пять существующих `figma-description` facts (два Primary25°, Hero mobile-auto, Secondary mobile-auto/desktop-cover), сейчас нет. Это не новое несовпадение чисел или разрешение вернуть подробные Description. Исправлять следует происхождение/способ проверки этих HTML-фактов; Compact Description остаётся компактной.

**Следующая область согласования внутри P2, без нового этапа:** general direct/cross-source proof для трёх units и Shared source/consumer/suffix/asset obligations; связь style IDs с существующей typography foundation; typed derived HTML proof и отдельно normative approval proof вместо отсутствующих Description sections. До schema/capture/auditor/canonical mapping changes согласовать конкретный способ доказательства. Значения не менять; не вводить component-ID branches, blanket exclusions или новые постоянные копии source facts. Затем целевой RED/GREEN, новый exact-SHA MCP session и локальная проверка. F2 widths, remaining binding/visual evidence и F7 остаются последующими открытыми обязанностями P2; P3/activation/#109/merge/cutover не начинаются.

**Evidence и сохранность:** `C:/Users/flabe/AppData/Local/Temp/cupis-p2-rolemap-20261002/fresh-remaining-facts-9af5fad/` хранит семь native responses/packets/receipts/session и два supplemental raw reads; компактный локальный отчёт `task7-fresh-remaining-facts-9af5fad-report.json`. Исходные timestamps/hash не переписаны. При потере этой временной evidence нужен новый MCP-вызов, не реконструкция результата из журнала. В GitHub публикуются только этот журнал и текущая точка roadmap; schemas, canonical values/mappings, runtime, generated docs, skills, Figma и письма не меняются. Нет visual regression, полной suite или GitHub Actions/Checks в этом read-only шаге. Docs-only gate относится к его точному final cloud SHA; прежний 9af full gate остаётся историческим результатом именно9af, не новым full gate следующего коммита.

### Ремонт fact proof: одобрен весь bounded scope — 03.10.2026

Пользователь одобрил всю спецификацию командой «Делай сразу весь». Реализация — [дочерний план](cutover/2026-10-03-cupis-contract-fact-proof-repair.md), без повторных промежуточных разрешений, но без merge/P3/cutover. Остальные обязанности P2 сохраняются.

### Способ ремонта fact proof: письменное согласование — 03.10.2026

По следующему разрешению пользователя исследована фактическая граница проверяющего кода на cloud candidate ae71f358a8360e8c087021dba0847195dbaf60e5. Использован один library-maintenance/read-only/both bundle: requested8/resolved9, assets+typography, paused/SKILL_ROUTE_PAUSED; SHA-256 48F4A3847491CF8D2A937ABC4F5C6EBA239443B8D91F1DA34F010D7ACBB3F022. Существующие T1/S1 подтверждают shell values и main-component dependencies; QR-only derivation не является общей моделью остальных HTML facts.

Подготовлена [письменная спецификация способа proof](../specs/2026-10-03-cupis-contract-fact-proof-design.md) для review, **не реализация и не одобренный implementation plan**. Предложено расширить существующие evidence metadata закрытыми typed proofs: own-source variants; consumer geometry; asset/profile relationship; style ID/name usage; Mobile proportional auto; Desktop content-height cover; отдельное нормативное CSS-angle решение. Direct mappings и исходные diagnostics сохраняются. Для suffix предлагается fresh owner identity в capture1.3 при сохранении session1.1/request-bound protocol и совместимости старых checks. Новые source IDs, второй numeric registry, component-ID exceptions и blanket coverage waivers не создаются.

**Следующая точка:** пользователь читает и согласует именно этот способ, включая meaning consumer212×33 и отдельный HTML25°. Затем дочерний implementation plan внутри P2, RED/GREEN и свежий exact-code-SHA MCP/audit. Пока опубликованы только spec и ссылки в plan/roadmap; schemas, canonical metadata/values, code, generated registry, skills, Figma и письма не изменены. В этом шаге нет нового Figma чтения или visual/full-suite gate; прежние receipts остаются закреплёнными на своих SHA. P2 не принят; F2/binding/visual/F7 открыты. P3/#109/activation/merge/cutover не начинаются. Exact docs-only gate относится к финальному cloud commit этой публикации.

### Ремонт clock-domain freshness — 02.10.2026

Пользователь разрешил следующий bounded repair; исходный кандидат — 66ceb135f62bdf486e8d6eca9e2ce598d724be9e, main — 618d124df0a664c84d23a724ba50ef2b324e9b97. В этом продолжении исправлен только механизм свежести, не оставшаяся модель proof значимых фактов. Работа остаётся в draft PR #110 без merge/P3/cutover.

**Исправление:** общий pure validator component-evidence-freshness используется файловым loader и прямым in-memory auditor. Session 1.1 / capture 1.2 связывают фактический host request с ответом через новые 256-bit session/request challenges и canonical SHA. Collector валидирует request до чтения узлов, возвращает точный echo; no-argument scalar capture 1.1 сохранён. Host session/request/receipt и Figma capture start/end проверяются отдельно, без cross-clock comparison и произвольного допуска. Для multi-owner batch разрешён один точный nonce/receipt/time envelope; коллизии проверяются до packet file reads. Старые session 1.0 / capture 1.1 не подтверждают новые links и задним числом не переутверждаются. Hash bytes, containment, complete-tree/node count и exact identity проверки сохранены. Формат и ответственность уточнены в §5 T1/S1 spec и proof-разделе Core; компонентные facts не переписаны.

**TDD и review:** clean RED на exact 8f51d9ed32c5cd92e21fcbabdae2e4efec0a7a32: 13 ожидаемых failures без setup defects. Code 2c49bc2408ab7c61a63977691b63b6b5376a5507: 13/13 GREEN. Затем обновлены только четыре synthetic fixture families в трёх существующих test files на 3828c686dee1c58f9e2e83ce8a9e02fc8e35e551; no-arg/scalar compatibility не заменена новым форматом. Narrow local gate — 18/18; затем все четыре targeted test files на exact 96ff0228baea96b9943d834345046396ad646f7b — 166/166 PASS (freshness 13, inputs 49, component evidence 86, combined audit 18), без repairs/skips. Независимое read-only review 66ceb1→96ff02 не нашло Critical/Important/Minor; не оценивало внешний origin/live content, полный suite или merge. Общий gate c82f6c0b548dc4f70ceefeb3ef352af57e603b6c: validator/generation и Windows bootstrap/contract PASS; Node 992/1000 PASS, восемь failures в отдельной CLI fixture со старым Session 1.0. До приёмки исправлена только эта synthetic fixture (пятый fixture family): request echo/nonce/host timeline приведены к текущему протоколу, отрицательные hash/path/identity/version assertions и production code сохранены. Повторный targeted/full local gate и scope-preservation фиксируются в PR на точном final commit; прежний неуспешный gate не переименован в PASS. Actions/PR Checks не выполняются.

**Свежий MCP:** повторно получены все те же 14 полных canonical packets на code SHA 2c49bc, с новыми host challenges и исходными Figma timestamps. Host session: 2026-10-02T19:34:58.745Z–19:39:13.783Z (22:34–22:39 МСК). Loader принял 14/14 зарегистрированных owners; echo, host order и отдельный capture order — 14/14. Product/Feature разрешены по реальным registered IDs, не по похожим именам. Один слишком большой compressed text response отброшен; file-output attempt не дал доступного полного packet и не использован. Повторный полный Bullet-List packet передан без потерь более эффективным LZSS/base64; length/checksum проверены, затем SHA-256 точных сохранённых bytes проверен loader. Даты прежних packets не менялись.

**Граница результата:** это PASS свежести, не приёмка компонентов. Exact numeric mismatch 0, missing source/contract paths 0 в сопоставленной части; сохраняются unmapped 18, uncovered 3828, links-not-in-contract 3 и capture-unsupported 4. Combined audit по-прежнему 0/14; scalar facts 0/14; evidence-section без ошибок 7/14, что не подтверждает всю графику и не отменяет пустой scope обычных HTML records. Сохранены unmapped/uncovered/unsupported и capture diagnostics, missing dependencies Notification/Feature и owner-boundary diagnostics логотипов. Остаток direct/cross-source/derived/normative proof и вложенного rendered-node artwork не реализован этим ремонтом. Нет автоматических numeric/reference corrections; F2 и deferred #109 остаются отдельно.

**Сохранность:** числовые/asset/HTML contracts, foundations, renderer/interpreter, письма, generated outputs, compact Descriptions, skills/routes, Figma design и PR #109 не изменены этим продолжением. MCP только read-only. Проверка источника считает entry receipt ID host correlation key; сохранён actual native MCP response transcript. Формат не объявляется криптографической аттестацией происхождения.

**Evidence:** временная папка C:/Users/flabe/AppData/Local/Temp/cupis-p2-rolemap-20261002/fresh-evidence-2c49bc/ содержит session.json, 14 packets и mcp-call-receipts.json; компактный результат Terra — fresh-evidence-2c49bc-report.json рядом. Raw packets и logs не коммитятся. При их потере требуется новый MCP-сеанс, не восстановление timestamps по журналу.

**Следующий пункт, всё ещё P2:** ограниченный ownership/передача export boundary через вложенный Item реализован в следующем журнале. Канонические зависимости Notification/Feature-Icon и точная identity внешнего glyph закрыты последующим bounded repair ниже. Остался direct/cross-source/derived/normative proof перечисленных в предыдущем разборе фактов. Не подавлять все INSTANCE/NONE, не приписывать native geometry потребителю, не выдавать утверждённый CSS angle или HTML auto за literal Figma. После каждого адресного ремонта — собственное свежее MCP proof и негативные controls. Затем отдельное решение F2, нужное foundation/binding/visual evidence и F7; пакет 3 и merge не начинаются автоматически.

### Ограниченный nested-artwork proof — 02–03.10.2026

**Область:** существующие HTML-ссылки Content/Steps → Item/Notification и Item/Alert; Bullet-List → Item/Alert, оба viewport. Repair не создаёт новые component/asset records, не переносит artwork ownership к родительскому блоку и не меняет описанные значения или экспорт. Правило владения находится в Core, не в этом журнале.

**Механизм на code SHA `eba2e0e5ddabeaa4bd64b4dab46de577e5af5bb9`:** новый отдельный `auditNestedArtworkEvidence` доказывает размещение по owned width/height links, reference-size provenance и полной фактической ancestry; берёт boundary у свежего дочернего владельца и разрешает точный compound ID в полном parent packet. Source/target/file/variant/actual main identity не заменяются совпадением имён или размеров. FRAME с Vector не объявляется INSTANCE. Existing scalar auditor и собственный T1/S1 evidence checker сохранены; combined result теперь `facts.ok && evidence_links.ok && nested_artwork.ok`. Недостающие source links и неизвестные targets остаются typed diagnostics. Это не доказательство всех Fill/Vector facts или всего компонента.

**TDD и review:** после двух непригодных synthetic fixture attempts до production выполнено coordinator-разрешение неоднозначной test/model specification. На exact `541c1abde53454d04cfada0d986c62636eff21b3` Terra подтвердила clean RED: 21 ожидаемый failure, один существующий ownership-invariant PASS, без skips. После production repair на exact code SHA — 188/188 targeted tests в шести полных файлах PASS, exit0. Независимое read-only review `93dda2→eba2e0` не нашло Critical/Important/Minor; оно не является whole-component acceptance или merge approval. Общий итоговый локальный gate фиксируется на точном final commit в PR; до этого пакет не принят.

**Новый MCP proof:** host session `2026-10-02T20:58:45.491Z–20:59:36.682Z` (23:58–23:59 МСК), exact code SHA без retimestamp/repin. Получены шесть полных capture1.2 packets: Content, Steps, Bullet-List, Alert, Notification, Feature-Icon. Session loader принял 6/6; длины, transport checksum и SHA-256 исходных bytes проверены. Terra нашла 10 точных boundaries: Content4, Steps4, Bullet2; numeric mismatch0. Scalar reports до/после combined audit deep-equal для всех трёх родителей.

**Остаток:** nested/combined остаются not-ok. Сохранены 28 capture-error occurrences, четыре missing canonical Notification links и четыре unknown-target occurrences внутреннего glyph `1331:1646` (в восьми зависимостях Content/Steps). Это счётчики данного трёхродительского proof, не суммарная статистика всей библиотеки. Glyph отсутствует в каталоге и не подменён похожей Shared-иконкой. Alert FRAME boundaries не создают выдуманных INSTANCE dependencies. Следующий адресный ремонт — решение для неизвестного source и недостающих canonical child dependencies; затем оставшийся fact proof. F2/F7, bindings/visual evidence и весь P2 остаются открытыми.

**Evidence и сохранность:** временная папка `C:/Users/flabe/AppData/Local/Temp/cupis-p2-rolemap-20261002/fresh-nested-artwork/` содержит native MCP responses/host receipts, session и шесть packets; компактный итог Terra — `fresh-nested-artwork-eba2e0-report.json` рядом. Host receipt ID — correlation key, не криптографическая аттестация MCP origin. При потере packets требуется новый сеанс. Source diff этого repair ограничен auditor, одним synthetic test file, Core и plan/spec/roadmap. Числовые contracts, foundations, renderer/interpreter, generated registry, skills/routes, Figma и локальные письма не менялись. No Actions/PR Checks, merge, P3, #109 или cutover.

### Ограниченные child dependencies и внешний glyph — 03.10.2026

**Область и фактический источник:** продолжение от `a2ff3e022b4bce2149c8dda0910d1a02900eac2e`, main неизменен. Notification и Feature-Icon получили пять точных source-dependency links, без изменения своих HTML/asset contracts. Read-only MCP подтвердил внешний main `1331:1646`, фактическое имя `account-circle-line`, `remote: true`, publication key `8ea141edd5ec0679825e7fde633e211282b2405b` и отсутствие локального parent. Он добавлен как один Shared source-only helper `icon-account-circle-line-remote` с self lookup-root `remote-reference`, а не как новый блок или самостоятельный экспорт. Текущий file key — контекст lookup; исходный файл внешней публикации не установлен. Исходный сбор 61/61 остаётся историческим; каталог теперь содержит 62 записи, из них одна новая remote reference. Нормативная граница принадлежит [Core](../../../core/component-contract-standard.md#служебные-связи-для-сверки), не этому журналу.

**Механизм:** capture фиксирует remote metadata только у фактического remote COMPONENT; неизвестный key остаётся diagnostic. Canonical schema и semantic registry ограничивают remote record Shared/self-root/source-only без variants, properties, asset contracts или реализации HTML. Own/nested аудит и confirmed impact требуют точного publication key вместе с node identity; чужой, отсутствующий, false или extra metadata не проходят. Локальный namespace имён не ослаблен. Raw `minimum_width_px: null` означает отсутствие native constraint: разрешён только в source capture, не как нулевая ширина или nullable HTML/reference dimension. Actual capture diagnostics сохраняются.

**TDD, runtime corrections и review:** два ранних fixture attempts не считались semantic RED; после разрешения model ambiguity exact `612ce7465d3516339b2e121055e607694ddcd4e7` дал clean RED (6 invariants PASS / 18 ожидаемых failures, без setup defects). Production начат после него. Найденные локальным прогоном ошибки strict-AJV conditional и exact native nullable minimum устранены без изменения числовых contracts; для nullable minimum и publication-key projection добавлены отдельные RED/GREEN cases. На `32b059f43bdfda2dc4917f45de069931eb93ec74` Terra выполнила 277/277 targeted PASS; count-инварианты сохраняют все прежние 61 records и 13 local helpers, отдельно проверяя новый remote helper. Независимое read-only review исходного диапазона и последующих schema/projection/test исправлений не нашло Critical/Important/Minor; оно не удостоверяет внешний origin, live capture, весь P2 или merge.

**Новый MCP proof на exact production `9d1f9c27d5ad73fd90a108c57911b291682a6225`:** семь полных capture1.2 packets с новыми request challenges; strict session1.1 loader принял 7/7, receipt hashes совпали 7/7. Собственные пять links Notification/Feature проверены явно. В Content/Steps/Bullet подтверждены 10 nested boundaries и все восемь зависимостей; неизвестный glyph и недостающие child links данного scope устранены. Numeric mismatches0; combined scalar reports deep-equal отдельным scalar reports. Raw сохраняет 23 capture diagnostics; combined отчёты остаются not-ok из-за FIGMA_CAPTURE_UNSUPPORTED / FIGMA_FACT_UNCOVERED / EVIDENCE_CAPTURE_ERROR. Wrong-key clone даёт EVIDENCE_REMOTE_SOURCE_IDENTITY_MISMATCH и EVIDENCE_TARGET_IDENTITY_UNVERIFIED. Это bounded identity/ownership proof, не полная приёмка Fill/Vector/scalar facts. Предыдущие семь packets на `ae512c9` не приняты как canonical-model proof при schema failures, не repinned и не retimestamped.

**Projection и сохранность:** generator inputs/code на `9d1f9c2` и `32b059f4` идентичны; последние отличаются только двумя count-test files. Механически обновлены только asset/component/typography registry; naming-reference bytes прежние. Marketing diff от базового a2ff ограничен ровно пятью evidence links двух owners; карточные факты, foundations и service data сохранены. PR #109 остаётся на `bdb51edbac918255ac941f16f2c37645a15f3190`. Renderer, export rules, skills/routes, Figma и локальные письма не менялись. Полный локальный gate точного итогового commit и итоговый scope review фиксируются отдельно в PR #110; свежие packets сохраняют исходный pin `9d1f9c2`, а не получают SHA документационного commit задним числом. Actions/PR Checks не используются.

**Исторический полный локальный gate выявил интеграционный остаток:** exact `5b00f334ddd4ddf63eccf0c699bc72602363f156`, tree `3bfb6fb9e33d253bfbc06b62e9333ecc851c76dd`: validator/generated check и bootstrap verifier PASS; Node gate FAIL:1040 из1048 тестов прошли,8 failures,exit1,316.492s,без skips. Bootstrap-contract остановлен без результата, не объявлен FAIL или PASS. Raw245/245 до/после,0missing/mismatch. Пять failures — прежние count/digest expectations; три выявили реальный RENDERER_COVERAGE_UNKNOWN для нового source-only helper: отсутствует запись в `data/renderers/registry.yaml`. Migration test ошибочно реконструирует новую remote v2-only запись как прежний v1 source; менять его reviewed mapping вслепую нельзя. Предлагаемое bounded дополнение: один явно source-only coverage row, без HTML/interpreter изменения; test invariant исходных 61 records и отдельная проверка новой remote reference, без удаления старых guards. Это затрагивает дополнительный ранее исключённый renderer registry, поэтому требует отдельного согласования scope перед записью. На тот момент исправления/повторный gate не выполнены; предыдущий f55 gate superseded,неPASS. Failed receipt: `task4b-final-gate-5b00f3-failed.json` в той же временной папке. Задача не принята целиком; ближайший шаг — решить этот интеграционный остаток, затем новый exact final gate и только потом оставшийся fact proof.

**Разрешённое интеграционное дополнение — 03.10.2026:** пользователь разрешил именно предложенную scope: один `source-only` row для уже подтверждённого `icon-account-circle-line-remote` в `data/renderers/registry.yaml` и узкие тестовые изменения. Предыдущий failed gate сохраняет свой SHA и результат. Это metadata покрытия, не новый HTML renderer; интерпретатор и исходные contracts не меняются.

Allowed paths дополнения: `data/renderers/registry.yaml`; `tests/characterization/component-documentation-boundary.test.mjs`; `tests/components/component-documentation-migration.test.mjs`; `tests/components/figma-component-description.test.mjs`; `tests/foundation/component-evidence-inputs.test.mjs`; `tests/rendering/renderer-readiness.test.mjs`; `tests/rendering/all-components.test.mjs`; этот план и roadmap только для журнала/точки возврата. Не изменять `system/migrations/components-1-to-2.*`, numeric/asset/component contracts, schemas, foundations, generated docs, runtime modules, skills/routes, Figma, локальные письма или PR #109.

**Ruling для migration boundary:** reviewed v1→v2 mapping остаётся ровно для исходных 61 записей. Новая remote reference создана непосредственно в текущей schema, поэтому не реконструируется как v1 и не получает вымышленный historical mapping. Test сохраняет прежний Shared17 digest, service digest и набор 13 local icons; отдельно проверяет одну новую remote reference, полный каталог62/уникальныеIDs и source-only semantics. Исключается только этот явный ID, не произвольные remote/draft/unmapped records. Стоимость ошибочной границы — пропуск исторического изменения; explicit complement/set assertions и прежние digests должны это обнаружить.

**Последовательность и успех:** Terra Medium сначала публикует test-only expectations/remote standalone guard и локально подтверждает semantic RED именно от отсутствующего coverage row. Затем coordinator добавляет ровно один существующего формата row; Terra запускает targeted GREEN. Число ready interpreter components остаётся38, covered active62, missing coverage0; standalone remote rendering запрещено. Independent scope review, журнал и один полный локальный gate на точном итоговом commit; source/hash preservation before/after, validator/generated check, Windows verifier/contract. npm-команды выполняются эквивалентным direct Node из package.json в exact runtime при недоступном npm; зависимости переиспользуются только при неизменных package/lock. Live proof на9d не repinned: component/capture inputs здесь неизменны; успешный coverage gate не подтверждает оставшиеся Figma facts или P2. После успеха — оставшийся direct/cross-source/derived/normative proof; P3/merge/activation не разрешены.

**Результат разрешённого интеграционного дополнения — 03.10.2026:** после test-only commits `b259030e` / `e82031a8` coordinator review потребовало явного равенства reviewed mapping IDs исходным 61 IDs, complement ровно одной remote reference и отдельного запрета её standalone HTML. Первый прогон `e82031a8` (99/106 PASS) содержал две ошибки самих новых assertions, поэтому не считается clean RED. После исправления только viewport root paths exact `a6c125fd8523040caa3adf3d233f5d7508d59f3b` / tree `f7c2f1bff042360ea3969963438efc2b22a570f9` дал clean RED:106 tests,101 PASS,5 ожидаемых failures от отсутствующего source-only coverage,54.556s; remote evidence26/26 PASS, setup failures0.

Production дополнение `ebf910ca0f6043dda1b562e1d6d0edfd22a3c893` / tree `5fc90d6ee0255e7afb9100b2bd2d7a3bd0fb538b` меняет ровно один row `data/renderers/registry.yaml`: `icon-account-circle-line-remote` → `source-only`. Не добавлены HTML renderer или самостоятельный экспорт. На этом SHA106-case gate ещё FAIL105/106 из-за одного старого общего coverage count в Service test, не из-за service contract. Узкое test-only исправление `2345200cefc3d8321caa588dc2134ab939f86932` / tree `95444c3a36daf11907492038f1e772cc140054f6` дало **targeted GREEN106/106**,exit0,57.332s. Catalog/covered active62, ready interpreter38, missing coverage0; standalone remote даёт пустой HTML и RENDER_INTERPRETER_COVERAGE_REQUIRED. Исторические mapping61, Shared17/service digests, 13local helpers и прежние record values сохранены; mapping source не менялся.

**Граница приёмки и дальнейшая зависимость:** итоговое independent review и полный локальный gate выполняются на точном итоговом cloud commit после этого журнала; exact SHA/tree, команды, raw before/after и результаты фиксируются receipt в PR #110 без нового source commit. Это gate только данного интеграционного дополнения. Внешний MCP proof сохраняет pin9d1f9c2; contract/capture inputs, geometry, HTML/export code, foundations, skills/routes, Figma и локальные письма не изменялись. Renderer registry metadata — явное единственное production дополнение, не заявление о неизменности всей registry. PR #109 не затронут. Далее — оставшийся direct/cross-source/derived/normative proof, F2/F7 и evidence, а не P3. P2 не принят; merge/activation/cutover не разрешены. Исторические failed receipts не переписываются в PASS.

**Evidence и следующий шаг:** локальная папка `C:/Users/flabe/AppData/Local/Temp/cupis-p2-rolemap-20261002/fresh-remote-artwork-9d1f9c2/` содержит native responses, packets/session и host receipts; компактный итог — `task4b-fresh9d1-report.json`. Raw packets/logs не коммитятся; при потере нужен новый MCP-сеанс. Далее остаются direct/cross-source/derived/normative facts, F2 reference widths, нужное foundation/binding/visual evidence и F7. P2 не принят; P3, #109, activation, merge и cutover не начинаются.

### Свежая сверка остатка significant facts — 02.10.2026, 21:25–21:40 МСК

**Выполнен следующий read-only пункт P2, а не новый repair.** Candidate закреплён на `2e5d4a09ce1951a7d349b3bf597a64e48ee2d672`; main остаётся `618d124df0a664c84d23a724ba50ef2b324e9b97`. Один `library-maintenance / read-only / both` bundle вернул `paused / SKILL_ROUTE_PAUSED`. Прочитаны десять выбранных owners и четыре непосредственно нужных источника вложенной графики: Primary, Hero, Secondary, оба Header-Logo, Header, Contact-Support, Content, Bullet-List, Steps; дополнительно Item/Alert, Item/Notification, Product-Logo и Feature-Icon. Получены **14 полных capture 1.1.0**, затем два точечных probes геометрии/main-component/ancestry. Все вызовы через Figma MCP, без mutations.

Две слишком большие передачи были усечены до 20 KB. Они отброшены целиком и заменены полными меньшими передачами с проверкой LZSS/base64, raw length и JSON parse. Ни один partial packet не участвовал в аудите. При адресном чтении 946:25769 сначала была ошибочно назначена транспортная метка shared icon; exact canonical lookup исправил только локальную метку на `asset-feature-icon-4x`. Shared `icon-user-forbid-fill` имеет другой owner 491:22373 и здесь не читался/не подменялся. Figma и canonical records не переименовывались.

**Локальный диагноз Terra Medium на точном candidate:** ordinary scalar audit всех 14 packets не нашёл `FIGMA_CONTRACT_MISMATCH` или `FIGMA_SOURCE_PATH_MISSING` среди существующих mappings. Это не подтверждение непокрытых фактов или всех компонентов. Остались **15 non-unit leaves + 3 unit leaves**. Raw packets сохраняют **41 capture_errors: 33 ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW + 8 MIXED_VALUE**; scalar-auditor отдельно удерживает 15 unsupported diagnostics. Эти множества различаются, ни одно не подавлено. Все 17 обнаруженных gradient alias pairs `stops / gradient_stops` равны; policy исключения дублей не менялась.

| Точная область | Что подтвердило чтение | Следствие для следующего ремонта, не текущая запись |
| --- | --- | --- |
| Header-Logo: 7 non-unit; Compact: 3 | Все три обычных variants 322×50, compact 212×33; собственный Fill #F3F3F5; owner names сохраняют @4x. Параметры Header совпадают с предыдущим capture после исключения только timestamps | Разделить native geometry, geometry потребителя, export suffix и ссылку на asset. Mobile 212×33 нельзя приписывать самому обычному source 322×50. Asset-reference проверять как связь, а suffix — по фактическому имени и export profile, не как выдуманное поле Figma |
| Hero: 1; Secondary: 2 | Mobile image frames 296×190 / 296×188, horizontal FILL, vertical FIXED. Desktop Secondary: card HUG; content-area width 300, vertical HUG; image 252×238, vertical FILL, paint scaleMode FILL | Значения HTML `auto` не являются буквальным значением Figma sizing. `content-driven-cover` требует совокупности layout/paint facts и явной HTML-интерпретации. Сохранить согласованную адаптивность и текущие значения; не превращать reference heights в fixed HTML height и не выводить auto только из HUG корня |
| Primary: 2 | Desktop/Mobile gradient stops #18B037→#3DD55C совпадают; Figma хранит transform, а не CSS angle 25 | 25° уже явно одобрены пользователем и записаны в verification reason как HTML-решение, не Fill angle. Нужен проверяемый нормативный источник; не создавать ложный direct mapping и не менять число |
| Contact-Support: 10 source paths | Шесть exact style ID/name pairs 1:1 совпали с typography foundation: Desktop/Mobile Body/Large, Heading, Body/Medium. Help-text node weights 400; обе полные rich-text runs Regular. Node font_style null/mixed | Шесть имён подтверждать через существующий exact style ID и foundation, не копировать вторую таблицу имён. Два числовых веса требуют отдельного точного mapping/owned fact; два null font_style — классификации mixed/segment evidence, не копирования null как CSS-значения. Heading/phone weights уже mapped |

**Вложенная графика — точная причина остатка, не дефект дизайна.** Read-back подтвердил Block/Content и Block/Steps → Item/Notification и Item/Alert в соответствующих Mobile/Desktop variants; Block/Bullet-List → Item/Alert. Alert asset owner — FRAME 1024:19221 / 1024:19217, 24×24 / 26×26, содержащий Vector. Его нельзя ошибочно объявлять вложенным компонентом. Notification owner — INSTANCE 1024:19279 / 1024:19273, 42×42 / 48×48, exact main 946:25769 `Asset/Feature-Icon @4x`. Этот существующий asset содержит artwork INSTANCE 1331:1355 → main 1331:1646 `account-circle-line`; прочитан COMPONENT 24×24 с Vector. У него нет собственного record в текущем каталоге; не подменять его похожим shared icon и не считать новым самостоятельным email-компонентом. Отсутствуют служебные source_dependencies у Notification/Feature-Icon и проверяемая передача экспортной границы через вложенный Item. Верхний rendered-node boundary должен охватывать artwork, сохраняя проверку реальной HTML-структуры вокруг него; blanket исключение всех INSTANCE/NONE не допускается.

**Новый технический blocker свежести.** В исходных host receipts время получения ответа на 1–3 секунды раньше `capture_meta.completed_at` сервера Figma; например Primary receipt `18:25:06.912Z` и capture end `18:25:08.494Z`. Текущий checker сравнивает эти часы как единую шкалу и выдал `EVIDENCE_CAPTURE_TIME_INVALID` для всех 14. Все исходные времена сохранены: ни retimestamp, ни перенос received_at на более позднее чтение локального файла не выполнен. Поэтому служебные links этого сеанса **не приняты**. Это ограничение механизма подтверждения, не опровержение прежнего bounded T1/S1 результата и не ошибка геометрии. Предложение для отдельно согласуемого ремонта: раздельно проверять порядок host request/receipt и Figma capture start/end, связывать свежий вызов с packet точным request/session token и receipt/hash; не вводить произвольное окно допуска и не переутверждать старые packets.

**Точный следующий объём согласования:** сначала исправить этот freshness механизм; затем ownership вложенного rendered-node artwork и direct/cross-source/derived/normative proof для перечисленных facts. Возможные владельцы — capture, canonical/session inputs, component-evidence и fact auditor, необходимые schemas/standard/provenance и targeted regression tests. Canonical mapping diff и generated projection готовить только после согласования способа доказательства, без изменения чисел, crop, размеров экспорта, структуры блоков или HTML. Для каждой ветви проверки нужны негативные cases: чужой/stale token, неправильный source/owner, ошибочный boundary, unknown target и различающийся alias. После ремонта нужен новый MCP-сеанс exact candidate, а не исправленные временные метки этого чтения. Это предложение области, не уже выполненная реализация или разрешение активировать routes.

**Evidence:** локальная папка `C:/Users/flabe/AppData/Local/Temp/cupis-p2-rolemap-20261002/`: `p2-next-*.json`, original `p2-next-session.json`, два nesting probes, `p2-ordinary-fact-audits-2e5d4a.json`, `p2-evidence-clock-diagnostics-2e5d4a.json`, `p2-supplemental-audit-2e5d4a.json`. Raw packets/архивы/logs в GitHub не добавлены; при потере временных данных требуется новое MCP-чтение. В этом продолжении нет code/data/Figma/HTML/skill/route mutation, visual regression, полной test suite или GitHub Actions/Checks. Запись — только этот журнал и roadmap; scoped docs gate точного final SHA фиксируется в PR #110. P2/F2/F7 остаются открытыми; P3, #109, cutover и merge не начаты.

### Уточнение Shared и Templates и свежая сверка 17 записей — 02.10.2026

**Решение пользователя:** Shared — вспомогательные элементы библиотеки, а не самостоятельные компоненты содержимого письма. Templates — контейнеры сборки дизайна **и** источник размеров/фактического фона корневой оболочки письма; не отдельные блоки в содержимом. Нельзя трактовать это как «Template не участвует в вёрстке» или «параметры оболочки не нужно проверять». Правило записано в [component contract standard](../../../core/component-contract-standard.md#роли-записей-блоки-shared-и-templates); план не является его параллельным нормативным владельцем.

**Что проверено:** candidate `197bcdf8ceb7cb2e437e1541fb7c72aa8cecff3f`, main `618d124df0a664c84d23a724ba50ef2b324e9b97`; один bundle `library-maintenance / read-only / both` с явным selection 17 и `paused / SKILL_ROUTE_PAUSED`. Свежие MCP packets получены без усечения сохранённых данных для 13 исходных иконок, трёх наборов логотипов и Email/Template на странице `5:6`. Три большие передачи логотипов были усечены транспортом; они не использованы как полные данные и заменены неусечёнными адресными передачами всех девяти вариантов. Сохранены 23 capture limitations: 22 `ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW` и один `MIXED_VALUE`; это не заявление о полной семантической проверке artwork. Figma, canonical records, renderer и письма не изменялись.

| Группа | Точная область | Вывод для дальнейшей работы |
| --- | --- | --- |
| Template | `email-template`, owner `1102:8`; Mobile `1102:6` / Slot `1103:7`; Desktop `1102:7` / Slot `1103:8` | Ширины 328 / 600 px, фон обоих `#F3F3F5`, вертикальный layout, gap/padding 0, высота HUG. Slot horizontal FILL; cross alignment Mobile MIN / Desktop CENTER. Значимые shell-факты проверять; измеренные 1000 px не назначать фиксированной HTML-высотой |
| Продуктовый логотип | `asset-product-logo`, owner `1008:874`; CUPIS `1008:871`, Card `1008:872`, Wallet `1008:873` | Источники 230×32 / 202×32 / 244×32 px без видимого собственного Fill; вложены в составные логотипы. Не создавать для них самостоятельные HTML-блоки или отдельный экспорт при наличии внешнего asset owner |
| Составной логотип | `asset-header-logo-4x`, owner `1008:1476`; variants `1008:1473–1475` | Все три 322×50 px; Fill `#F3F3F5`, radius 55 px, padding 6/24/6/24 px. Сопоставлять собственные параметры и экспорт; mobile display 212×33 относится к компактному источнику/размещению, не является размером этого Figma owner |
| Компактный источник | `asset-header-logo-compact-4x`, owner `1008:1708`; variants `1008:1686–1688` | Все три 212×33 px; Fill `#F3F3F5`, padding 4/16/4/16 px. Сохраняется существующее правило одного общего файла для письма; отдельный mobile export не предлагается |
| 13 иконок | `1009:2505`, `491:22370`, `946:25576`, `1009:2506`, `491:22369`, `491:22372`, `946:25485`, `491:22374`, `946:25480`, `491:22371`, `491:22375`, `491:22373`, `491:22376` | Исходные компоненты 62×62 px, без видимой белой подложки (Fill выключен). Это native source size, не требование размера в письме. В текущих прочитанных потребителях status-badge вложенный glyph имеет 46.5×46.5 px; переносить 62 px в его HTML нельзя |

**Дополнительные read-only evidence:** MCP discovery подтвердил страницу `5:6` и всех 17 owners; отдельный query потребителей на этой странице прочитан 02.10.2026 07:52:43 UTC. В нём `1008:1823` ссылается на `1008:1473` и имеет 322×50 px, `1008:1709` — на `1008:1686` и имеет 212×33 px; glyph `491:22378` внутри `491:22074` имеет 46.5×46.5 px. Локальные raw ответы: `dependency-readback.json`, `targeted-readback.json` рядом с 17 packets и capture receipts. Это scoped usage на странице библиотеки, не доказательство полного file-wide usage.

**Фон и размеры:** `data/foundations/rendering.yaml` уже содержит `shell.background_color: '#F3F3F5'`, `shell.max_width_px: 600`, `shell.horizontal_inset_px: 0`. Фон и desktop-ширина совпадают с живым Template. Read-back отдельно подтвердил Fill, sizing и выравнивание двух корней и слотов. Первоначальный вывод о том, что сам факт Fill у слота требует исправления, снят: техническое правило «не создавать дополнительную геометрию слота в HTML» не означает отсутствие Fill в Figma.

**Локальная проверка (Terra Medium):** existing fact auditor запущен на всех 17 полных packets против точного candidate, без тестовых исправлений. Identity/file key 17/17 совпали, наборы variant IDs четырёх variant-bearing owners совпали. 13 отдельных исходных иконок Shared закономерно представлены capture как один исходный узел без оси Viewport. Текущий auditor выдал 1 456 uncovered source facts, 17 missing owned-link diagnostics, 13 unmapped contract leaves (9 у большого и 4 у компактного логотипа), 13 unsupported reports. Эти diagnostics не означают 17 сломанных блоков и не являются обоснованием создавать для Shared самостоятельные HTML-контракты. No automatic exclusion, no GREEN claim; P2 не принят. Полный test suite в read-only продолжении не запускался.

**Что меняется в последовательности:**
- [x] Снять свежие данные 17 записей и отделить Shared dependencies от Template shell; сохранить исходные числа без записи в контракты.
- [x] Зафиксировать пользовательскую классификацию в нормативном стандарте и этом журнале.
- [x] По этой классификации составить точную карту значимых связей — отдельно параметры Template → shell, отдельно helper source → использующий asset owner. Не дополнять все 17 записей как блоки. Для подтверждённого числа без owned provenance предложить точечный mapping; для межкомпонентной/производной зависимости определить её владельца, не подставлять совпавшее число.
- [ ] Отдельно согласовать scope кода/schema/mappings, если текущий механизм не выражает эту границу. Только затем реализовывать и проверять; текущий docs-only commit не меняет механизм.
- [ ] Продолжить remaining P2: nested artwork/significant facts, F2, foundation/bindings и архивные обязательства, F7; после closure — финальный gate и отдельное разрешение merge. P3, #109 и cutover не начаты.

**Область текущей записи:** только `core/component-contract-standard.md`, этот план и roadmap. Core описывает роли без копирования чисел компонентов; конкретные свежие измерения здесь — evidence текущего P2, не второй контракт. Контракты, schema, capture/auditor/renderer, generated docs, Figma и локальные письма сохранены. Короткий local docs/scope gate выполняется на итоговом SHA; результаты фиксируются в PR #110.

### Карта Template → shell и Shared → asset owner — 02.10.2026

**Шаг выполнен как read-only анализ, не как ремонт contracts.** Основание: `main@618d124df0a664c84d23a724ba50ef2b324e9b97`, candidate `50ad6e57995791855ea4486c95f9803575444c4a`. Один bundle `library-maintenance / read-only / both`, те же 17 выбранных записей, `paused / SKILL_ROUTE_PAUSED`. Terra повторно подтвердила 230/230 raw Git blobs execution snapshot до и после resolver. Новые MCP reads: 02.10.2026 08:21:35 UTC / 11:21:35 МСК и 08:24:29 UTC / 11:24:29 МСК; только страница библиотеки `5:6`, без мутаций. Raw evidence: `live-role-dependencies.json`, `live-asset-owner-chains.json`, `canonical-owner-map.json` во временной папке `cupis-p2-rolemap-20261002`; они не являются runtime sources и не коммитятся.

#### 1. Template: дизайн, владелец данных и реальный потребитель

| Значимый факт / источник Figma | Текущий владелец и потребитель | Результат и точная граница |
| --- | --- | --- |
| Desktop `1102:7`, width 600 | `data/foundations/rendering.yaml#/shell/max_width_px` → `renderEmailDocument` → `renderEmailShell` | Значение совпало. Foundation хранит максимальную ширину HTML, а не копию высоты/размеров всего макета |
| Mobile `1102:6`, width 328; у обоих корней horizontal FIXED, vertical HUG | Mobile reference относится к макету; HTML shell имеет `width:100%`, max 600, min viewport 300 | Не назначать 328 фиксированной шириной HTML и не превращать измеренные 1000 px в фиксированную высоту. Min viewport 300 и breakpoint 659 — отдельные rendering policies, не значения, снятые с Template |
| Оба корня и Slots `1103:7` / `1103:8`: видимый SOLID Fill `#F3F3F5`, opacity 1 | `rendering.yaml#/shell/background_color` → outer shell cell `bgcolor` и CSS background | Реальный фон совпал. Нельзя заменять его цветом холста Figma или добавлять поверх второй слой фона Slot |
| Корни/Slots: padding и gap 0; root vertical MIN/MIN; Slot vertical FILL/HUG, Mobile cross MIN / Desktop CENTER | `rendering.yaml#/shell/horizontal_inset_px: 0`; Template contract содержит `content` Slot; interpreter разворачивает Slot без собственной HTML-геометрии | Нулевой inset соответствует измерению; референсный Slot не должен удваивать отступы. Различие Slot alignment записано как факт, но его эквивалентность для произвольного узкого дочернего блока не доказана одним совпадением full-width блоков; не переносить alignment на текст автоматически |
| Template owner `1102:8`; variants `1102:6` / `1102:7`; единственные child IDs `1103:7` / `1103:8` | `data/components/shared.yaml`: `email-template`, `/contracts/{viewport}/root/children/0` (`id: content`, `render_mode: slot`) → model root и упорядоченный `slots[].instances` | Роль корня, slot membership и порядок уже имеют потребителей. Template не становится ещё одним дочерним блоком |

Проверенные места кода: [renderer](../../../scripts/lib/email-renderer.mjs) `renderEmailDocument`; [primitive](../../../scripts/lib/email-primitives.mjs) `renderEmailShell`; [interpreter](../../../scripts/lib/email-interpreter.mjs) `propsFromFacts` / `case "slot"`; [placement](../../../scripts/lib/email-build-orchestration.mjs) `validateModelPlacement`; [source fidelity](../../../scripts/lib/email-source-fidelity.mjs) `verifyEmailModelSource`. Последний проверяет identity/variant/parent/order и модельные bindings; отдельного сравнения background/ширины корня с rendering shell в нём нет.

**Пробел T1:** сейчас совпадение Template с shell подтверждается адресной сверкой, но нет зарегистрированной машинной связи `Figma source → canonical shell path`, обязательной для этой проверки. `email-template` имеет пустые facts и не имеет `figma_fact_links`; renderer читает shell непосредственно из rendering foundation. Изменение фактического фона Template не обязано менять существующий component contract или давать diagnostic этого соответствия. Это пробел защиты от будущего drift, не найденная ошибка текущего цвета/ширины.

**Минимальное решение для согласования:** сохранить единственного владельца значений в rendering foundation и добавить проверяемую evidence-связь к Template, без второй копии цвета/600 в render-tree. Общий [foundation comparator](../../../scripts/lib/foundation-evidence.mjs) уже принимает точные `data/...#/...` paths и пригоден для value comparison; нужен явный выбор обязательных источников/targets и включение этого сравнения в maintenance verification. Текущие component `figma_fact_links` разрешают только пути внутри собственного record; ими нельзя честно сослаться на `/shell/...` другого источника. Если связь хранится в component metadata, её отдельную typed форму и валидацию надо сначала согласовать. Это не требует менять числа или HTML-renderer. Проверка конкретного Template-инстанса при сборке письма остаётся отдельным consumer gate: нельзя объявить его покрытым только библиотечным evidence.

#### 2. Shared: конкретная карта владельцев

| Shared запись и источник | Подтверждённая цепочка на странице библиотеки | Что принадлежит контракту использования |
| --- | --- | --- |
| `asset-product-logo`, `1008:874`, Product variants `1008:871/872/873` | Дочерние instances `1008:1309/1422/1455` → большой Header-Logo; `1008:1347/1635/1668` → Compact. Во всех случаях exact `mainComponent` соответствует Product-варианту | Внутренняя графика входит в составной asset, отдельный PNG и HTML-блок не нужны. Нативные 230×32 / 202×32 / 244×32 не являются display-размером в письме |
| `asset-header-logo-4x`, `1008:1476` | `1008:1473` → instance `1008:1823` в Header Desktop `230:3679`, owner `email-header` (`326:5159`) | В Header: `/contracts/desktop/root/children/0`, asset `header-logo`, display 322×50; `/asset_contracts/0` задаёт desktop rendered-node PNG 1288×200, transparent, собственный Fill сохранён |
| `asset-header-logo-compact-4x`, `1008:1708` | `1008:1686` → instance `1008:1709` в Header Mobile `15:2037` | В Header: `/contracts/mobile/root/children/0`, display 212×33 и **тот же** asset `header-logo`; компактный источник не создаёт отдельный mobile файл |
| `icon-lock-password-fill`, `491:22369` | glyph `491:22378` → `asset-status-badge-positive-4x` `491:22074`; instances `491:22406` / `497:25809` в `block-personal-data-update` `497:26055` | Glyph 46.5×46.5 внутри owner 72×72; в HTML выводится весь `status-badge-positive`, его экспорт 288×288, не отдельный знак 62×62 |
| `icon-receipt-fill`, `491:22374` | Положительный badge instances `502:24255` / `502:24533` в `block-receipt-info` `502:24695` сохраняют main `491:22074`, но их вложенные `I502:24255;491:22378` / `I502:24533;491:22378` ссылаются на Receipt `491:22374`, а не default Lock | Export boundary — весь badge 72×72 после overrides. Внутреннюю замену знака нельзя потерять, экспортировав main component вместо конкретного instance. Она не превращается в nested HTML component |
| `icon-user-forbid-fill`, `491:22373` | glyph `491:22481` → `asset-status-badge-negative-4x` `491:22178` | Glyph 46.5×46.5 внутри owner 72×72. В этой выборке найден внешний asset owner, но не доказан конкретный верхнеуровневый потребитель этого badge |
| Остальные 10 иконок, перечислены ниже | В query exact main-component IDs на странице `5:6` не найдено instances | Это **не** вывод о неиспользовании во всём файле и не разрешение на удаление, исключение из audit либо выдумывание потребителя. Записи остаются source-only |

Последняя группа: `icon-bank-card-2-line` (`1009:2505`), `icon-fingerprint-2-line` (`491:22370`), `icon-gift-2-line` (`946:25576`), `icon-global-line` (`1009:2506`), `icon-mail-fill` (`491:22372`), `icon-mir-logo` (`946:25485`), `icon-shopping-basket-2-line` (`946:25480`), `icon-smartphone-fill` (`491:22371`), `icon-user-follow-fill` (`491:22375`), `icon-user-unfollow-fill` (`491:22376`). Все 17 записей охвачены картой: 1 Template, 3 logo records, 3 используемых icon sources и 10 без найденного потребителя в ограниченной области.

**Что уже работает:** [renderer registry](../../../data/renderers/registry.yaml) помечает все 16 Shared helper records `source-only`; `email-template` — `interpreter`. [Model validator](../../../scripts/lib/email-model.mjs) не разрешает source-only как самостоятельный модельный компонент; placement gate не допускает asset/icon/template как верхнеуровневый content block. Asset profile `rendered-node` уже требует exact-node-after-overrides и включение видимой вложенной графики. Display facts Header принадлежат самому `email-header` и имеют точные owned links к `1008:1709` / `1008:1823`; их не требуется заново придумывать.

**Пробел S1:** в raw canonical records обнаружены только две межзаписные ссылки на IDs выбранных Shared-источников, обе в `email-header.contracts.source_variants[*].source_node.children[0].main_component_id`; они не входят в его `figma_fact_links`. Вложенные Product/glyph зависимости не выражены как проверяемая карта stable component ID → конкретное использование → внешний asset owner. Отсутствие этой карты не ломает уже разрешённый экспорт целого узла, но мешает автоматически определить затронутые owners при изменении Shared. Сохранённый `source_variants` не выдаётся за живую проверку.

**Минимальное решение для согласования:** типизированные non-rendering dependency links в canonical metadata плюс проверка их по свежему MCP: source component/variant, consumer instance, внешний export owner и фактическая вложенная замена. Использовать exact main-component IDs, а не совпадение имён или размера. Не добавлять эти связи в `nested_components` модели письма, не раскрывать векторную графику в HTML, не запрещать реальные instance overrides. Библиотечный default и фактический instance с override проверять как разные состояния. Capture уже сохраняет вложенные nodes и `main_component_id`; auditor намеренно прекращает scalar layout traversal на INSTANCE/asset boundary, поэтому для зависимостей нужен отдельный ограниченный проход, не превращение artwork в HTML-layout.

#### 3. Какие links можно и нельзя дописать обычным прямым mapping

- Для `asset-header-logo-4x` собственные факты `protective-background-color` и `desktop-display-size` подтверждаются узлами `1008:1473–1475`, `/fills/0/color` и `/reference_dimensions/{width,height}`. Сейчас они находятся в `/contracts/mobile/root/facts/0` и `/facts/3`; нет links/provenance. Это запись общей Shared-семантики в mobile-ветке, не основание переносить число в другой viewport вслепую. Сначала отделить собственный source fact от использования и согласовать узкую запись provenance.
- `asset-header-logo-4x` `/contracts/mobile/root/facts/4` (`mobile-display-size`, 212×33) **не** является собственным размером большого Figma owner 322×50. Источник — Compact/его применение в Header. Нельзя подставить `1008:1473` как доказательство этого числа; нужна межзаписная связь/проверка существующего владельца, без изменения display-размеров.
- Для Compact `/contracts/mobile/root/facts/0` (`mobile-display-size`) собственные 212×33 подтверждаются `1008:1686–1688`; обычные owned links и точный provenance применимы. Product axis не превращать в выдуманные Mobile/Desktop variants.
- `export-scale-suffix` и `export-asset-reference` — профиль/связь, не самостоятельные геометрические Figma-числа. Их проверять по export profile, owner name и зарегистрированному asset ID. `pixel_dimensions: 1288×200` — производное `322×50 × 4`, а не literal width/height Figma. Текущие transforms `identity|lowercase` этого вычисления не выражают; общий export preflight уже проверяет геометрию экспорта, его не заменять фиктивным direct link.
- Размеры, Fill/alpha, artwork clipping и native topology остальных source-only записей остаются значимыми в своей роли; пустой `figma_fact_links: []`, blanket ignore или статус «всё проверено» не закрывают их evidence. MIR overflow и Receipt mixed-vector-radius из предыдущего чтения не исправлялись и не объявляются доказанными этим relationship audit.

Не выполнялись alias deduplication, переименование, смена alpha/radius/размеров, повторный экспорт или визуальная приёмка писем. Совпадающие asset contracts Header/source record пока сохранены; выбор единственного нормативного владельца их общей части входит в отдельное согласование, не в этот docs-only шаг.

#### 4. Локальные диагностические пробы

Terra Medium на неизменном exact-SHA snapshot проверила три адресных observation через существующий `compareFoundationObservation`: нормализованный `#F3F3F5` → shell background, Desktop 600 → max width, Desktop left padding 0 → horizontal inset; 3/3 verified. Это не проверка всех Template facts или всех четырёх сторон padding. Проба production renderer с `icon-mail-fill` вернула пустой HTML и `RENDER_INTERPRETER_COVERAGE_REQUIRED`, как и требуется для source-only. В raw canonical Header найдены два main-component IDs, но ноль owned links к ним; у обоих status-badge records — ноль сохранённых main-component IDs и links, несмотря на подтверждённые живые glyph dependencies. Полный test suite и визуальные сравнения не запускались; probe inputs и отчёт `role-diagnostics.json` остаются локальными.

#### 5. Следующий ограниченный шаг и зависимости

1. **Направление и письменная спецификация T1/S1 одобрены.** Архитектура — в [дочерней спецификации master-spec](../specs/2026-10-02-cupis-template-shared-evidence-links-design.md); конкретные файлы, интерфейсы, RED/GREEN и preserved-output gates — в [implementation sub-plan](cutover/2026-10-02-cupis-template-shared-evidence-links.md). План подтверждён, задачи 1–2 выполнены в кандидате; далее задача 3: Template → shell. Реальных mappings ещё нет, значения и renderer сохранены. Это уточнение P2, не начало P3.
2. **Затем записать разрешённые metadata/mappings в своих владельцев**: Shared source records, Header и прочитанные service asset owners/consumers; generated projection обновить только если schema добавит выводимые поля. Существующие числовые значения, export/display policy, Figma и письма не менять. Перед записью подтвердить затронутые node/path ещё раз; не выдавать все raw-capture поля за обязательные HTML-facts.
3. **Успех ремонта:** изменённый Template Fill/desktop width или другая main-component связь дают точную диагностику; актуальные связи проходят; изменение внутреннего glyph отражается в dependency evidence, но не создаёт HTML/отдельный файл; 62px не становится display-size; отсутствие consumers в scoped read не считается unused. Нельзя подтвердить связь чужим node/variant/path, потерять override или выдать сохранённый snapshot за свежую сверку. HTML/export на неизменных inputs остаются прежними. Конкретный набор проверок определяется вместе с реализацией.
4. После этого вернуться к remaining P2: nested artwork/significant facts, F2 reference widths, foundation/binding и необходимое visual evidence, архивные обязательства/F7. Это не начало P3, не исполнение #109 и не разрешение merge/cutover.

**Область публикации этого шага:** только этот журнал и ближайшая точка возврата roadmap. Core, canonical records, schema, код, generated docs, навыки, Figma и письма не меняются. Проверки и точный итоговый docs SHA фиксируются в PR #110; read-only probes не считаются полным приёмочным gate P2.


### Спецификация T1/S1 — 02.10.2026

- Пользователь одобрил направление служебной модели. Подготовлен [документ дизайна](../specs/2026-10-02-cupis-template-shared-evidence-links-design.md); письменный review ещё не получен. Master-spec содержит ссылку и границу ответственности, roadmap — текущий следующий gate.
- Основание документа: candidate `e544e303`, закреплённый main `618d124d`, записанная карта владельцев и адресное read-only MCP-чтение 02.10.2026 08:47:15 UTC. Документ не выдаётся за новый аудит или работающий checker.
- Область этого изменения — только новый spec, его master-ссылка и два текущих плана. Код, schema, canonical values/links, foundations, generated docs, навыки, Figma и локальные письма не меняются.
- После review спецификации — implementation plan внутри P2; затем разрешённая реализация schema/checker/mappings с новым адресным MCP-чтением перед записью. Подключение maintenance bundle/workflow остаётся P3. Остальные unresolved P2 facts/F2/F7 сохраняются; документ не закрывает их и не возобновляет #109.
- Реализация T1/S1 не начата, P2 не принят, PR #110 остаётся draft. Слияние — отдельно после проверки и разрешения.

### Задача 7 T1/S1 — итоговая локальная проверка, 02.10.2026

Проверенный code/data SHA: `9b13db02afd4beb551353059fa8b053fd6f944d6`, база ремонта `c076b4e1f365d3c59f115590f35ef65485f7a9bf`; main остаётся `618d124df0a664c84d23a724ba50ef2b324e9b97`. GPT-5.6 Terra Medium выполнила локальный полный gate: **987/987 Node tests PASS**, validator, generated check, `bootstrap/verify.ps1` и непосредственно исполняемый `tests/bootstrap-contract.Tests.ps1` PASS. В среде нет npm binary: использованы точные прямые Node-эквиваленты `package.json`, без изменения списка тестов. Вызов Pester, не обнаруживший тестов, не засчитан. Raw source export не содержит `.git`; вместо заявления о локальном HEAD подтверждены все 241 cloud blobs и неизменность их хешей до/после. GitHub Actions/PR Checks не использовались.

Self-review координатора и отдельное read-only review Terra не выявили замечаний реализации. Проверены независимая required coverage, exact identity/ownership, actual overrides против defaults, сохранение diagnostics и отсутствие влияния metadata на rendering. Числовые контракты/asset contracts сохранены; допустимы только schema-version envelope и evidence metadata. 61 компактная Description неизменна. Прямое сравнение representative pilot model и результата между c076 и кандидатом: HTML **37 824 bytes** совпадает побайтово, список **9 assets** также. Новая сборка пользовательских писем и визуальная сверка не выполнялись и не требуются для этого неизменного HTML.

Сохранённые отчёты использованы только как regression-вход: все **1976 прежних diagnostics факт-аудита** сохранены (1959 uncovered, 13 unmapped, 3 EVIDENCE_LINKS_NOT_IN_CONTRACT, 1 capture unsupported). Полные combined issue arrays семи owners неизменны; у Header удалена ровно прежняя Mobile boundary error и добавлены три diagnostics ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW от теперь проверяемого Compact target. Свежая доказательная сверка остаётся сеансом задачи 6 на `9a671a5cbbef8157933cf326e90138b1ad9e95d5`: **29 required / 29 verified / 0 missing / 0 mismatch / 0 boundary errors**, 56 capture diagnostics. Сеанс не переносился на новый SHA и не выдаётся за новое чтение Figma.

Принимается только механизм и разрешённые mappings T1/S1. P2 целиком не принят, paused routes не включены. Исправлений кода по итогам gate не потребовалось. После gate меняются лишь эти связанные status docs; их итоговый SHA, проверка ссылок и сохранности остальных blobs фиксируются в PR вместе с локальным receipt. Полный результат выше относится к указанному code/data SHA, не к будущему коммиту. Перед отдельно разрешённым merge нужен свежий локальный gate точного merge-кандидата. PR #110 не слит; P3, #109, Figma, HTML/export policy, установленные навыки и локальные письма не изменены.

Следующий незакрытый пункт — оставшиеся значимые owner/node/path и nested artwork в P2: сначала определить точную область и владельца каждого факта, затем согласовать нужные исправления. F2 reference widths, foundation/binding evidence и F7 остаются открытыми. P3, #109, cutover и merge автоматически не начинаются.

### Задача 6 T1/S1 — выполнена в кандидате 02.10.2026

Задача 6 выполнена в кандидате: 29 обязательных служебных связей подтверждены свежим canonical MCP-сеансом, включая оба Mobile Header instances; generated projection и scoped локальная изоляция проверены. Ошибка определения Mobile asset boundary устранена без изменения дизайна или export contract. Итоговая проверка задачи 7 выполнена в кандидате; ограниченный ремонт T1/S1 принят в его собственной области, но P2 целиком не принят. Свежий canonical session всех 12 records и восемь CLI audits относятся к 9a671a5cbbef8157933cf326e90138b1ad9e95d5; 29/29 links verified, missing/mismatch/boundary — 0. 1976 scalar и 56 capture diagnostics сохранены. Scope исправления, точные результаты и исторический checkpoint — [результат задачи 6](cutover/2026-10-02-cupis-template-shared-evidence-links.md#результат-задачи-6--выполнена-в-кандидате-02102026).

Следующий незакрытый пункт — оставшиеся значимые owner/node/path и nested artwork в P2: сначала определить точную область и владельца каждого факта, затем согласовать нужные исправления. F2 reference widths, foundation/binding evidence и F7 остаются открытыми. P3, #109, cutover и merge автоматически не начинаются. Ниже исторические контрольные точки, не текущая очередь.

### Задача 5 T1/S1 — выполнена в кандидате 02.10.2026

- BASE `784f83e98698bf175db7dda3c65d3685a49e88bf`; RED `0fbb03a692cf23a238c330fcd3ff7eb7c15872c9` — 29 ожидаемых failures из 166 тестов на полном exact snapshot; production `59e8bbfbd50cadfa5db05e698201bd82fab2d979`; final code/test `59e8bbfbd50cadfa5db05e698201bd82fab2d979`.
- Общий отчёт сохраняет исходный scalar report без удаления diagnostics; итог — facts.ok AND evidence_links.ok. Проверка links не закрывает FIGMA_FACT_UNCOVERED. CLI связывает --live с точным receipt packet по owner, realpath и hash bytes; новые session/SHA flags парные, внешние mappings/expected targets не допускаются. Без session scoped Template/artwork получает EVIDENCE_SESSION_REQUIRED, а не успех. Обычный HTML без artwork не получает выдуманную новую обязанность. System validator разрешает foundation targets из уже загруженных canonical документов и возвращает точные ошибки с registry paths. Scalar auditor не изменён: capture 1.0/1.1 поддерживались ранее; новые regression controls это подтверждают, link proof по-прежнему требует 1.1.
- Локально GPT-5.6 Terra Medium: **318/318 PASS** в семи scoped files; validator/generated check PASS, raw239/239 до/после. Первая неполная подготовка RED не считалась результатом. Full suite/whole-branch review — задача 7; Actions/PR Checks не использовались.
- Изменены три production modules и четыре test files. Wrapper в evidence module предусмотрен Interfaces задачи; scalar module без изменений. Затем обновлены только пять связанных plan/spec/status docs; final docs SHA/receipt — в PR.
- Контракты/реальные links, foundations, generated registry, renderer/export, manifest/context-bundle, workflows/skills, Figma и письма сохранены. Нет объявления P2 PASS или нового live-подтверждения библиотеки.
- Следующая **задача 6 — адресная Figma-сверка, mappings и generated projection**, затем общий gate (7). Остальные P2 facts/F2/F7, P3 и #109 остаются открытыми. PR #110 draft, merge не выполнен. Ниже история, не текущая очередь.

### Задача 4 T1/S1 — выполнена в кандидате 02.10.2026

- BASE `40b5a9e59ce6b2f7ea5cf63fc998737560b22bae`; RED `8ef64f7f492e47b4360f37c0589a6e84b4dd0c9c`; production `3ca9dfc0f129c2364de6a1117352370d22401eb1`; final code/test `931c764a03215213448b67d7aa3b56c21aabc3dc`. Единственная последующая test fix исключает helper-функцию из structuredClone, не меняя поведенческие ожидания.
- Расширены только два pure evidence modules и два их test files. S1 выводит required INSTANCE-связи из полного дерева и existing asset boundaries до чтения links; проверяет compound ID, main-component, target packet identity, owner ancestry/boundary. Shared/Compact без файла не создаёт новый export. Source viewport не удаляет Mobile usage; display/native/export геометрия не вычисляется.
- Reverse impact подтверждает только фактические direct edges из отчётов текущего SHA/session/receipts с совпадающими source/target/owner. Transitive/default graph остаётся `possible`, поэтому Lock default не выдаётся за Receipt override. Canonical reverse registry не создаётся.
- Локально GPT-5.6 Terra Medium: **191/191 PASS** в четырёх scoped test files, validator/generated check PASS, полный raw238/238 до/после. Full suite — задача 7; GitHub Actions/PR Checks не использовались. Synthetic проверки не означают live acceptance реальных links.
- Контракты/реальные evidence links, foundations, scalar auditor, generated docs, renderer/export, manifest/context-bundle, workflows/skills, Figma и письма не менялись. Далее обновлены только пять связанных plan/spec/status документов; final docs SHA/receipt фиксируются в PR.
- Следующая **задача 5 — общий auditor/CLI без ложного PASS**, затем свежие mappings (6) и общий gate (7). Остальные P2 facts/F2/F7, P3 и #109 остаются открытыми. PR #110 draft; merge не выполнен. Записи ниже — история предыдущих задач, актуальная очередь указана здесь и в roadmap.

### Задача 3 T1/S1 — выполнена в кандидате 02.10.2026

- BASE `b965f749003bf282f4ed47815b7c7e68a2fcdec0`; test-only RED `f1f9de3cf3612eee13edb30fadb22213c771fa13` (missing new module, 237/237 raw blobs до/после); code/test gate `f0237a32727a54a8c5b503918cdd8bcc40e435ee`, полный tree238/238.
- Добавлены только `scripts/lib/figma-component-evidence.mjs` и `tests/foundation/figma-component-evidence.test.mjs`. T1 выводит девять обязательных source triples независимо от links; сравнивает canonical shell values через существующий foundation comparator. Нет новых tolerance, hardcoded component IDs или значений дизайна. Identity/ancestry, Slot scope, paint opacity/visibility, Desktop FIXED sizing и target pairing проверяются до сравнения; missing links не дают ложный PASS.
- Локально GPT-5.6 Terra Medium: четыре scoped test files — **152/152 PASS**, validator/generated check PASS. Full suite оставлен задаче 7; GitHub Actions/PR Checks не использовались. Проверка на synthetic fixtures не выдаётся за MCP-чтение. Capture errors сохраняются; старые scalar issues не снимаются.
- Сохранены component facts/links, foundations, comparator, scalar auditor, generated docs, renderer/export, manifest/context-bundle, workflows/skills и письма. Figma не читалась и не менялась. Обновлены только связанные status/plan/spec документы; финальный docs SHA и receipt фиксируются в PR.
- Следующая **задача 4 — S1: actual instance dependencies, overrides и reverse impact**. Задачи 4–7, остальные P2 facts/F2/F7, P3 и #109 не закрыты. PR #110 draft; merge не выполнялся. Исторические записи задач ниже сохраняют свой тогдашний следующий шаг; текущая очередь — здесь и в roadmap.

### Задача 2 T1/S1 — выполнена в кандидате 02.10.2026

- BASE `e157052c918db5949cb19a51e87563252410ee1c`; test-only RED `795c99d2f50f209816d53003cd626767da63cdf5` (15 tests: 7 PASS, 8 ожидаемых failures); production `545b0e7befe12eeede052104b811eb7f5026e8da`; final code/test `98b8b7633d689badc21ecf15241fdd54a9cbc30d` / tree `0927f72138b9f60e046d3237dccfd9e5b04b3c2f`.
- Capture 1.1.0 сохраняет v1 facts, добавляет время/полноту/count, читает main component асинхронно, включает скрытые children и восстанавливает traversal flag в finally. Ошибка lookup остаётся явным `MAIN_COMPONENT_UNRESOLVED`, instance не исчезает. Scalar auditor изменён только для принятия обеих capture versions.
- Новый `component-evidence-inputs.mjs` использует manifest/component/rendering loaders и pure target resolver. Session проверяет pinned SHA, один packet на owner, точные hash bytes, безопасный realpath, корректные UTC-даты/порядок и полноту/count. Runtime не подтверждает криптографически MCP origin: это по-прежнему обязанность исполнителя с реальными receipts и raw-cloud hashes.
- Локально GPT-5.6 Terra Medium: `node --test` шести файлов (capture, evidence inputs, evidence links, scalar facts, units/icons, scalar CLI) — **161/161 PASS**; `node scripts/validate-system.mjs` и `node scripts/generate-docs.mjs --check` PASS. Финальный tree — 236/236 matched. Служебный verifier первоначально считал только 234 baseline blobs; проверка исправлена, оба новых файла также подтверждены. Тесты выполнялись на этих же файлах, production после прогона не менялся. Полный набор не запускался; Actions/PR Checks не использовались.
- Уточнения synthetic tests: общему MCP receipt разрешено покрывать несколько разных owner packets; для semantic-negative используется schema-valid comparison mismatch. Это не изменение требований к реальным данным и не слепое обновление эталонов. Read-only review не нашло actionable Task2 issues; identity/duplicate nodes/required coverage/reverse impact обоснованно остаются задачам 3–4, live proof — задаче 6, общий gate — задаче 7.
- Diff задачи: ровно три production paths и два test paths, все в allowlist. Все component facts/assets, foundations, generated docs, renderer/export, manifest, context-bundle, workflows/skills сохранены; Figma и письма не читались и не менялись. Затем обновлены только пять связанных status/plan/spec docs; их финальный SHA и локальный receipt фиксируются в PR.
- Следующая **задача 3 — T1: Template → shell**. Задачи 3–7, остальные P2 facts/F2/F7, P3 и #109 не закрыты; новые live mappings отсутствуют. PR #110 остаётся draft, P2 not accepted; merge не выполнялся и не разрешён этим шагом.

### Задача 1 T1/S1 — выполнена в кандидате 02.10.2026

**Расширенный локальный gate:** `7adff9c75d6f0fb319f9ab5cb8e8499177a58ccb`, пять test files — 108/108 PASS; validator и generated check PASS. Дополнительно найден один current-format consumer: `tests/generation/generated-docs.test.mjs:285`. Terra воспроизвела старое ожидание 2.1.0 при фактическом 2.2.0; commit 7ad изменил только эту строку. Content assertions/эталоны не обновлялись. Test allowlist под-плана уточнён; production allowlist прежний. Финальный docs-only SHA и подтверждение сохранности code blobs фиксируются в PR receipt. Следующая задача 2 не начата.

- Scope: только typed metadata и offline reference validation; следующий шаг — задача 2 (fresh capture и canonical/session inputs). Задачи 2–7, реальные mappings, P3, #109 и merge не начаты.
- BASE исполнения: `949c81eaeacd862790b30d4fc22617db01439213`. Test-first commit `9da75e16047b9ec33ee31df5103768da7d83ce79`: Terra воспроизвела 44 ожидаемых failures отсутствующего API/schema/integration, без fixture/syntax ошибок. Реализация: `09c9d8ffa771c84d5fe9d6442f5a6aba64ccd9a9`; дополнительные boundary/immutability controls: `6da244739083417595c326e0e190965f4d0b6048`; generated headers: `e71f138dee71293b177e4b68a9c71104a19dce4f`.
- На exact code/generated SHA `e71f138dee71293b177e4b68a9c71104a19dce4f` локально через GPT-5.6 Terra Medium: 4 targeted test files — 94/94 PASS, `node scripts/validate-system.mjs` и `node scripts/generate-docs.mjs --check` PASS. Raw Git blobs сверены до/после. Это scoped Task1 gate, не полный merge gate PR; полный набор оставлен задаче 7/отдельно разрешённому merge. Actions/PR Checks не использовались.
- Components format 2.2.0; `evidence_links` optional, оба массива обязательны при наличии раздела. Разрешены только три shell targets; expected values разрешаются из canonical источника, не хранятся в link. Проверяются exact IDs, принадлежность variant/asset, cross-file targets, duplicates/conflicts и отдельные dependency cycles. Новый pure API не читает файлов и не заявляет live proof.
- Все 61 records сохранены по содержанию: в трёх envelopes изменён только schema_version. Реальных evidence links ещё нет. Старые fact links, contracts, provenance, display/export values, manifest, foundations, renderer, context-bundle, навыки, Figma и письма не менялись. Три generated docs отличаются только source-digest/schema-version headers; naming output побайтово прежний. Исторический migration helper остался 2.1.0, сравнение нормализует только envelope version, а не поля records.
- Формат служебных target results: Map по `componentId/linkId`; foundation entry содержит kind, component/link IDs, exact source/file, target source/pointer, comparison и resolved expected scalar; dependency entry — exact source/file, canonical target component/variant/file/node и asset owner. Это не runtime status и не HTML graph. Ошибки с `/records/<index>` перебазируются на registry paths.
- Режим выполнения адаптирован к пользовательским ограничениям: cloud branch и transport ledger вместо локальной рабочей копии; тесты только Terra; в этом продолжении только задача 1. Гипотеза о принятии ID с завершающим переносом строки не подтвердилась; тесты оставлены как GREEN controls, production-код без оснований не менялся.
- После обновления только status-документов exact final SHA и локальный receipt фиксируются в PR body. P2 not accepted; остальные significant facts/F2/F7 и предыдущие diagnostics этим шагом не закрываются.

### Implementation plan T1/S1 — 02.10.2026

- Пользователь подтвердил письменную спецификацию. Подготовлен [под-план реализации](cutover/2026-10-02-cupis-template-shared-evidence-links.md), связанный со spec и этой единой очередью P2; review плана ещё ожидается.
- Семь задач: typed metadata/offline validation → capture и canonical/session inputs → T1 → S1/overrides → auditor/CLI → свежие mappings и generated projection → итоговая проверка. Первым после разрешения выполняется только задача 1 с её RED/GREEN; остальные идут последовательно.
- Техническое следствие новой формы данных: components schema 2.2.0 и version/digest headers производных документов. Это не изменение точных component values. Capture 1.1.0 добавляет freshness metadata при сохранении старых scalar facts. Подробные allowlist и negative cases — только в под-плане.
- Текущий docs-only шаг меняет пять документов: новый под-план, статусы spec/master-spec и указатели в cutover/roadmap. Figma, письма, production-код, schema/data и generated outputs не менялись. Основание — `c076b4e1`; нового live-аудита на этом шаге не было.
- Остаток P2 facts/F2/F7 сохраняется. P3 подключает maintenance bundle/workflow позднее. Слияние, cutover и #109 не начаты.

### Результат bounded repair P2 — 02.10.2026

**Исправлен механизм, не переутверждены контракты.** Code candidate `78aaf0b99277eb953f560a9c7c061eb5b99ed8ed`; test-first commit `3b39a87b84eaa6d2b29b1f279279533170bc3aa5`. Изменения относительно base `1bef4ac9`: auditor, один новый regression-файл и два текущих плана. Ни значения/links canonical components, ни foundations, capture, renderer, Figma, письма, навыки или routes этим ремонтом не изменены.

Локальный RED: 18 unit-family positive cases и два icon-topology cases воспроизвели старый дефект. Две ошибки новых fixtures (selector и вложенный capture diagnostic) исправлены в самих тестах, не подменой production API; mixed-node negative усилен реальным дочерним node. Targeted GREEN: **55/55**, validator и generated check PASS.

**Повторный audit сохранённых 61 MCP packets** сравнен с baseline `51da5756` полными diagnostic objects, а не только агрегатами. Это regression механизма по сохранённым source data 02.10, не новое утверждение всей библиотеки на текущую минуту.

| Диагностика | Изменение и доказательная граница |
| --- | --- |
| `CONTRACT_FACT_UNMAPPED` | Удалены 4 801, все и только `/value/unit`, подтверждённые успешными owned numeric mappings и unit evidence |
| `FIGMA_FACT_UNCOVERED` | Удалены 1 614 explicit unit leaves: reference dimensions 886, line-height 364, letter-spacing 364; других source paths не снято |
| Source-only icon topology | Удалены 52 ложных findings у 13 icons: missing 26, undeclared 13, unknown viewport 13 |
| Реальные blockers | Пообъектно сохранены 28 value mismatches, 20 missing source paths, 17 missing owned links и 18 unsupported capture reports; новых diagnostics 0 |
| Текущий остаток | 21 640 source facts uncovered; 62 contract paths unmapped = 27 units + 35 non-unit. Эти числа не являются количеством визуальных ошибок |

Оставшиеся **27 units** не исключены: `block-icon-list` 10, `block-cards-images` 4, `block-icon-cards` 4, `block-transaction-success` 4, `asset-header-logo-4x` 2, `card-image` 2, `asset-header-logo-compact-4x` 1. Причины — соответствующие отсутствующие/несовпавшие numeric evidence или отсутствующие owned mappings. **35 non-unit** не изменились: IconList 20, HeaderLogo 7, CompactLogo 3, Secondary 2, Primary 2, Hero 1. Работа #109 и F2 по-прежнему отложена отдельно.

Счётчики `mapped_*` сохраняют прежнюю форму. В mapped contract paths теперь также входят unit leaves, доказанные этим bounded механизмом; explicit mapped targets по-прежнему учитываются до проверки provenance/value. Ни один из счётчиков не равен числу успешно проверенных контрактов или проценту готовности.

**Независимое review:** Critical 0, Important 0. Minor отложен: три admission guards иконки (непустой declared variants, несовпадающие variant/owner и source-root/owner IDs) реализованы, но не имеют трёх отдельных негативных regression cases. Это небольшой долг тестового покрытия, не разрешение ослабить guards.

**Review rulings:** результаты тестов закрываются отдельным локальным gate Terra; актуальность всей Figma-библиотеки этим code review не устанавливается; расширение unit/source-only policy за пределами закрытого списка и согласованной топологии не выполняется. Цена границы — такие будущие случаи останутся непроверенными, а не будут молча приняты.

**Локальные проверки exact code SHA `78aaf0b99277eb953f560a9c7c061eb5b99ed8ed`:** полный Node-набор **744/744 PASS**, 0 failures, 346,505 ms; запущен прямой Node-эквивалент команды `npm test`, поскольку npm в test environment недоступен. Windows bootstrap verifier и `bootstrap-contract.Tests.ps1` PASS. Все проверки выполняла GPT-5.6 Terra Medium локально; Actions/PR Checks не использовались. Между base `1bef4ac9` и code candidate изменены только четыре разрешённых пути; остальные tree blobs сохранены. После записи этого docs-only результата требуется короткая проверка точного documentation SHA и сохранности code/data blobs; повтор полного Node-набора ради двух планов не нужен. Receipt точного docs SHA фиксируется в PR #110.

**Дальше:** остаёмся в P2. Отдельно согласовать canonical mappings значимых фактов и 17 owners без links, правила nested artwork/derived evidence, F2 reference widths; затем foundation/binding/visual obligations и F7. Alias deduplication не выполнялась. Пакет 3, PR #109, cutover и merge не начинались.

### Согласованный bounded repair P2 — единицы и standalone icons (02.10.2026)

Пользователь разрешил исправить механизм сверки единиц и обработки отдельных иконок, сохранив дизайн и значения контрактов. Base: `1bef4ac90b148801e0c9ffcaeb58f63ea9debd8d`; main: `618d124df0a664c84d23a724ba50ef2b324e9b97`. Область записи: `scripts/lib/figma-contract-facts.mjs`, отдельный regression-файл `tests/foundation/figma-contract-facts-units-icons.test.mjs`, этот журнал и roadmap. Source-only topology не означает подтверждение artwork или достаточность links.

**Точный контракт ремонта:**
- `measure.unit` подтверждается только через успешный owned mapping числового sibling. Для `dimensions.unit` нужны оба успешных mappings width/height одного node/variant. Значение, provenance, identity-transform, capture profile и Figma identity должны совпасть; конфликтующие mappings не являются доказательством.
- Для reference dimensions используется явный `reference_dimensions.unit`; для line-height/letter-spacing — явные `PIXELS`/`PERCENT`. Неявные px допустимы только для закрытого списка полей существующего capture v1: corner radius/четыре угла, item spacing, четыре padding, font size, minimum width, stroke weight. Это семантика конкретных Figma API/capture полей, не догадка по числу или суффиксу. Неизвестная, отсутствующая или несовпавшая единица остаётся diagnostic.
- Source-only icon допускает общий источник для обоих contract roots только при role `icon`, kind `component`, обоих `figma-source-only` roots, пустом declared variants, одном live COMPONENT с пустыми axes и совпадающими owner/root IDs. Это не новый export boundary; отсутствующие links, uncovered leaves и capture errors сохраняются.
- Публичный формат отчёта, canonical facts/links, alias deduplication, nested artwork policy, F2 widths, PR #109, Figma, HTML, письма, routes и skills не меняются. P2 остаётся незавершённым; merge и P3 не разрешены.

**Evidence и рабочая последовательность:**
- Прочитан один explicit write/both bundle всех 61 owners; `SKILL_ROUTE_PAUSED` сохранён, работа разрешена только этой migration-областью. Canonical taxonomy читалась из raw records, не из resolver projection, которая не содержит evidence links.
- Новый read-only Figma metadata probe `1009:2505` подтвердил standalone `Icon/Bank-Card-2-Line` 62×62 с vector child. Полный repeat comparison использует уже сохранённые MCP packets 02.10, а не выдаётся за новый полный Figma audit.
- [x] RED: additive regression tests в облачной ветке, локальный прогон точного SHA через GPT-5.6 Terra Medium.
- [x] GREEN: bounded auditor implementation, targeted regressions и сравнение всех 61 сохранённых packets; реальные mismatches/missing links/capture errors сохранены.
- [x] Независимое review и итоговые результаты в этом журнале/roadmap; Minor по трём negative cases записан отдельно.
- [x] Полный локальный gate точного code SHA `78aaf0b9`; после docs-only фиксации — отдельный короткий exact-SHA gate с проверкой неизменности кода. Без GitHub Actions/Checks, без merge.

**Execution ruling:** cloud-only repo остаётся источником и местом изменений; disposable snapshots используются только для запуска. Этот журнал заменяет local-worktree ledger для согласованной области. Тесты и review делегированы Terra Medium по AGENTS; координатор не читает полные test logs.

### Разбор причин P2 — 02.10.2026

**Граница продолжения:** read-only разбор на candidate `23c02336e578a38730ab57ebaf0f8faf2763e67f`, без нового MCP-сбора и без ремонта кода/контрактов. Использованы полные packets и локальные audits предыдущего продолжения, а не новое доказательство состояния Figma на эту минуту. Canonical capture/auditor/component blobs кандидата не изменились относительно comparison SHA `51da5756777acacbd04ea1380568c93577456380`. Результат этого продолжения — классификация причин и предложение точечной области ремонта, не приёмка P2.

**Resolver:** принятый candidate bundle `library-maintenance / read-only / both` содержит явно выбранные 61 component IDs, четыре `foundation_definitions` и пять static sources; результат `paused / SKILL_ROUTE_PAUSED`. Первый диагностический запуск без повторяемых `--component` дал пустой selection: это ошибка аргументов, а не поведение paused-policy. Он не использован как доказательство отсутствия компонентов. Paused-route сохраняет явный selection и не разрешает production maintenance.

#### Что именно не закрыто

| Группа | Фактическая причина | Что исправлять и что сохранять |
| --- | --- | --- |
| 4 828 из 4 863 `CONTRACT_FACT_UNMAPPED` | Все эти paths заканчиваются на `/value/unit`. В источнике есть число/размер, в typed value контракта — отдельная единица; auditor перечисляет обе части, links часто покрывают только число | Сначала определить проверяемую семантику единиц для конкретных capture paths. Не исключать все `unit` и не признавать число проверенным без доказательства px/percent. Значения размеров и шрифтов не менять |
| Оставшиеся 35 unmapped paths | 20 у deferred `block-icon-list`, остальные 15 требуют раздельного решения по asset/reference/derived фактам | Подробности ниже; это не 35 дополнительных визуальных ошибок |
| 13 standalone icons | Identity role — `icon`, оба корня — `figma-source-only`, реальный component не имеет Viewport axis. Код допускает viewportless только для role `asset`, поэтому выдаёт отсутствующие Mobile/Desktop, unknown/undeclared variant | Нужен отдельный проверяемый путь для source-only dependencies, а не переименование role в asset и не изготовление фиктивных вариантов. Связи с экспортирующими родителями и свойства artwork остаются предметом проверки |
| 17 owners без `figma_fact_links` | Все 13 icons, `asset-header-logo-4x`, `asset-header-logo-compact-4x`, `asset-product-logo`, `email-template` действительно не имеют owned evidence links. Это не результат потери поля capture | Для source-only artwork определить собственную границу доказательства; для корня письма и применимых logo facts добавить точные links/provenance только после согласования области. Пустой список links не закрывает проверку |
| 18 `FIGMA_CAPTURE_UNSUPPORTED` reports | По предыдущим audits это absolute-child diagnostics: 13 icons и `block-content`, `block-bullet-list`, `block-steps`, `email-header`, deferred `block-icon-cards` | Разделить экспортируемый artwork, внутренности INSTANCE и настоящий HTML layout. Текущий capture не снимает относительные x/y. Нельзя снимать blocker для любого `layoutMode=NONE` или всех INSTANCE descendants |
| 23 254 `FIGMA_FACT_UNCOVERED` | Auditor превращает каждое оставшееся leaf-поле capture в обязанность mapping, включая новые значимые поля, дубли и неиспользуемые настройки | Требуется узкая классификация по field/node role и объяснение каждого исключения. Новые font weight/alignment/bindings не исключать как «служебные» |
| 28 value mismatches и 20 missing source paths | 4 F2 reference widths + 24 mismatches и все 20 missing paths у отложенных owners #109 | F2 решается отдельно; #109 не переносится в P2 под видом починки аудита |

Распределение `CONTRACT_FACT_UNMAPPED`: у 15 owners их нет; у 40 — только units (4 314); у шести — units и другие (549 = 514 + 35). Шесть owners: `asset-header-logo-4x` 9 (2 units + 7 других), `asset-header-logo-compact-4x` 4 (1 + 3), `banner-hero` 92 (91 + 1), `banner-secondary` 93 (91 + 2), `block-icon-list` 326 (306 + 20), `button-primary` 25 (23 + 2). Нулевой unmapped счётчик не означает достаточность record: у `email-template` вообще нет atomic facts, но есть 167 uncovered source facts.

**Оставшиеся 15 non-unit facts вне #109:**

| Owner | Факты без прямого mapping | Почему нельзя исправить простой подстановкой из capture |
| --- | --- | --- |
| `asset-header-logo-4x` | 7 leaves: `#F3F3F5`, asset reference `header-logo`, `@4x`, Desktop `322×50`, Mobile `212×33` | В facts отсутствует доказательная связь с узлом. Это параметры назначения/экспорта вместе с геометрией, а не семь одинаковых source properties |
| `asset-header-logo-compact-4x` | 3 leaves: `212×33`, `@4x` | Размер и export suffix требуют собственных exact источников и links; нельзя брать их из похожего логотипа |
| `banner-hero` | `height-behavior: auto` | Provenance ссылается на Description `337:4460`; raw HUG sizing не является полем с ключевым словом `auto` |
| `banner-secondary` | `content-driven-cover`, `auto` | Это поведение HTML/изображения из Description `337:4870`, а не прямое значение одного Figma-поля; требуется явное доказательство интерпретации |
| `button-primary` | Два факта CSS angle `25` | Provenance — Description `337:4713`; capture содержит gradient transform/stops, но не CSS angle. Число 25 не менять; отдельно определить проверяемый перевод или авторизованное нормативное основание |

Для этих случаев не создавать фиктивный `figma-literal`. Уже существующий `scripts/lib/derived-email-facts.mjs` подтверждает только восемь конкретных QR email-grid facts для `banner-app-download` через pinned capture blob и вычисления; он не подтверждает другие derived facts автоматически.

**Почему обычные блоки получили unsupported:** точные примеры из сохранённых packets:

| Owner | Node и имя | Причина |
| --- | --- | --- |
| `block-content` | `I1024:19304;1024:19279`, `feature-icon @4x`, INSTANCE | NONE + children; у родительского record нет собственного asset owner для этого вложенного artwork |
| `block-bullet-list` | `I1024:19267;1024:19221`, `alert-icon @4x`, FRAME | NONE + children внутри вложенной структуры; не сопоставлен с export boundary родительского record |
| `block-steps` | `I1024:19328;1024:19279`, `feature-icon @4x`, INSTANCE | Та же неподтверждённая граница вложенного artwork |
| `email-header` | `I1008:1709;1008:1347`, `Asset/Product-Logo`, INSTANCE | Exact owner string `header-logo @4x` не разрешает этот узел как artwork boundary |

Это аргумент в пользу проверки вложенных зависимостей и их export boundaries по подтверждённой identity/main-component связи. Само имя с `@4x` или тип INSTANCE не разрешают скрыть ошибку. До такой проверки нельзя считать layout подтверждённым, но эти diagnostics сами по себе не доказывают поломку HTML.

**Проверенные примеры причин, не разрешения на исключение:**

- `block-content`: `/contracts/mobile/root/facts/0/value` содержит dimensions `328 × 635 px`. Link из `/reference_dimensions/width` проверяет width, соседний `unit: px` остаётся unmapped. В этом случае сам capture также содержит `reference_dimensions.unit`; для gap/font fields единица задаётся capture/API-семантикой и требует отдельного строгого правила, а не той же автоматической подстановки.
- `block-contact-support`, текстовые nodes `459:27586` (Desktop) и `459:27607` (Mobile): исправленный capture уже снимает `/text_style/font_weight` и `/text_style/figma_style_name`, но эти source paths не имеют semantic links. Нужно проверить существующего владельца факта и local overrides; имя стиля не заменяет фактическую типографику узла.
- Capture намеренно сохраняет gradient alias `stops = gradient_stops` для совместимости v1. У `banner-app-download` эти массивы совпадают. Повтор поля можно дедуплицировать только после проверки равенства; несовпавший alias должен оставаться diagnostic. Это не разрешение исключать другие fills/gradients.
- Export boundary уже существует в auditor: корень role `asset` или layer с exact `asset_contract.owner_layer_name`. Он не обходит внутренние vectors и не требует отдельного HTML-CSS mapping для их геометрии. Нельзя «внедрять» эту уже работающую функцию повторно.
- `sourceFacts` не обходит детей INSTANCE, но capture-error обработка индексирует их и отдельно проверяет unsupported. Эти две границы различаются; отключение ошибок во всех дочерних узлах скрывало бы неподтверждённую семантику вложенных компонентов.

**Счётчики:** `mapped_contract_fact_count` — число уникальных target paths, для которых найдены source и target, **до** проверки provenance/transform/value. `contract_fact_count` считает leaves atomic facts, тогда как mapping targets могут вести также в properties/variants/identity и другие допустимые поля. Это разные множества, не «проверено / всего» и не процент готовности. Аналогично source count не означает успешное сравнение значений. Изменение названий/формы CLI-отчёта — отдельный небольшой repair с tests, не средство уменьшить diagnostics.

#### Предложенная последовательность ремонта — ещё не разрешение на запись

1. **Механизм доказательства:** согласовать узкую область units, доказанных alias duplicates и source-only dependencies; затем RED/GREEN на `tests/foundation/figma-contract-facts.test.mjs`, при изменении публичного отчёта — `tests/foundation/figma-contract-facts-cli.test.mjs`. Возможные владельцы кода: `scripts/lib/figma-contract-facts.mjs`, `scripts/audit-figma-contract-facts.mjs`; capture менять только для показанного отсутствующего значимого поля. Уникальные значения и provenance не подгонять.
2. **Canonical mappings:** после подтверждения модели единиц и source-only owner подготовить отдельный exact node/path → fact/link diff в `data/components/{shared,marketing,service}.yaml`. Только разрешённые links/provenance и недостающие значимые факты; существующие числа/цвета/поведение сохранить. Любое обнаруженное противоречие Figma остановить для решения пользователя. Generated docs пересобирать только от согласованного canonical diff.
3. **Необычные факты:** отдельно решить подтверждение derived значений и unsupported layout, F2 reference widths; не превращать HUG/FILL измерение в фиксированную HTML-ширину. Для изменяемых записей повторить точечное MCP-чтение и нужное визуальное evidence.
4. Повторить affected audits; только после объяснения оставшихся обязанностей завершать foundation/binding/visual evidence и F7. Полный local suite — один раз на финальном code/contract SHA перед отдельным разрешением merge. Пакет 3 не начат.

**Что изменено этим продолжением:** только этот журнал и текущая точка roadmap. Ни один диагностический код не подавлен, контракт не переутверждён; PR #109, Figma, renderer, письма, routes, schemas, skills и активные инструкции сохранены. Scope следующих исправлений сначала согласуется по этой карте.

### Журнал продолжения P2 — 02.10.2026, 01:15–01:31 МСК

Read-only probe 22:15:36 UTC восстановил доступ; все 24 недостающих owners сняты до повторной сверки foundations/F2. Первую попытку ответа 28 000 символов MCP обрезал до 20 KB: она отброшена целиком и не участвовала в аудите. Далее chunks по 8 000 символов проверялись по длине и FNV-32, целый packet — по total/hash и JSON parse. Текущий FNV в таблице — hex transport checksum, не статус проверенности контракта.

| CUPIS ID | Figma owner | Variants | Raw diagnostics | Serialized chars | FNV-32 |
| --- | --- | --- | --- | --- | --- |
| `block-icon-cards` | `326:6342` | 2 | 24 | 122508 | `34fb0377` |
| `block-icon-list` | `946:26516` | 2 | 24 | 97447 | `c5907e68` |
| `asset-bank-badge-4x` | `481:19664` | 1 | 2 | 3764 | `54023847` |
| `asset-card-image-2x` | `911:3992` | 2 | 1 | 4522 | `e0016722` |
| `asset-feature-icon-4x` | `946:25769` | 1 | 2 | 3535 | `f027de6a` |
| `asset-header-logo-4x` | `1008:1476` | 3 | 3 | 38136 | `4e005035` |
| `asset-header-logo-compact-4x` | `1008:1708` | 3 | 3 | 38381 | `eb0c4386` |
| `asset-icon-badge-4x` | `484:20039` | 1 | 2 | 15199 | `4b69a836` |
| `asset-partner-badge-4x` | `481:19665` | 1 | 2 | 2591 | `432b161f` |
| `asset-product-logo` | `1008:874` | 3 | 3 | 34378 | `e18da014` |
| `asset-status-badge-negative-4x` | `491:22178` | 1 | 2 | 3046 | `074dca7a` |
| `asset-status-badge-positive-4x` | `491:22074` | 1 | 2 | 3187 | `d0ad5748` |
| `badge-operation-status` | `1084:16996` | 6 | 0 | 12398 | `46435db4` |
| `badge-step-number` | `18:2948` | 4 | 0 | 8711 | `4928f642` |
| `banner-fiscal-check-link` | `502:25048` | 2 | 12 | 58068 | `a7e56877` |
| `button-primary` | `337:4713` | 2 | 0 | 5140 | `2b0fe867` |
| `banner-hero` | `337:4460` | 2 | 0 | 19655 | `4eb59d3a` |
| `banner-inline` | `337:5040` | 2 | 6 | 16730 | `3f40203c` |
| `button-secondary` | `337:4710` | 2 | 0 | 4521 | `0efbf3bb` |
| `banner-secondary` | `337:4870` | 2 | 0 | 19003 | `a9540684` |
| `item-alert` | `1024:19226` | 2 | 2 | 7961 | `90f4436b` |
| `icon-gift-2-line` | `946:25576` | 1 | 1 | 1575 | `a8286fc8` |
| `icon-receipt-fill` | `491:22374` | 1 | 2 | 4140 | `ce3e06cc` |
| `icon-user-forbid-fill` | `491:22373` | 1 | 1 | 1655 | `df687c69` |

Новые временные evidence находятся в `C:/Users/flabe/AppData/Local/Temp/codex-package2-6c0bf7/evidence/resume-20261002-0115`: `capture-manifest.json`, canonical packets/metadata/receipts, `audit-51da-all61-summary.json`, `audit-51da-all61-exact-mismatches.json`, `audit-51da-all61-targeted-findings.json`, `audit-51da-repaired-field-presence.json`, `foundation-comparison-51da.json`, `f2-transaction-width-readback.json` и два PNG reference. Предыдущие 37 evidence и весь прежний журнал сохранены. Эти временные данные не входят в runtime; при их недоступности нужный evidence воспроизводится через MCP, не по статусу таблицы.

### История остановки P2: повторно исчерпана квота Figma MCP

> Историческая запись 00:24:45 МСК. Очередь из 24 ниже уже выполнена; текущая точка возврата и результаты 61/61 находятся выше. Не исполнять этот старый resume checklist заново.

**Историческая остановка на 02.10.2026, 00:24:45 МСК: `BLOCKED_FIGMA_MCP_QUOTA`; пакет 2 не принят.** После подтверждённого восстановления MCP сбор возобновлён. Первый повторный quota error получен 01.10.2026 в 21:24:45 UTC (02.10, 00:24:45 МСК) при чтении `block-icon-cards`. Все дальнейшие MCP-вызовы, включая screenshots, остановлены; обходов и повторных попыток после ошибки не было. Время сброса неизвестно.

**Основание:** main по-прежнему `6c0bf7d0d3b1ca7909b692541883d2b0e9788709`; проверяемый кандидат [PR #110](https://github.com/flabenar-maker/e-mail/pull/110) — `212cb6d6dc7e7dac11177701bd71009e00dba8d2`. Исполнен именно исправленный `scripts/figma/capture-contract-source.js`, Git blob `18e2ef8c8498629d8a54cf98cc46e0601fa2537d`. Component/foundation records относительно main не менялись. Один candidate `library-maintenance / read-only / both` bundle содержит 61 record, четыре foundations и пять static sources; результат `paused / SKILL_ROUTE_PAUSED` использован только в границе этого миграционного плана.

| Область | Фактический результат этой сессии |
| --- | --- |
| 34 обычных records из прежней очереди | Полные свежие canonical packets сохранены для всех 34; это получение данных, не 34 успешных contract audit |
| 5 owners отложенного PR #109 | Полные packets: `card-image`, `block-cards-images`, `card-icon`. `block-icon-cards` прерван, `block-icon-list` не читался |
| Прежние 22 records | Старые packets сохранены отдельно; повторное чтение исправленным capture ещё не начато |
| Итого исправленным capture | **37/61 полных packets; 24/61 без полного свежего packet этим capture** |
| Полные packets в двух сессиях суммарно | 59 уникальных records, но разных дат/версий capture: не считать их единой завершённой свежей сверкой |
| Стили Figma | Отдельный предыдущий read-only запрос: ровно 15 локальных text styles, имена/ID совпали с реестром. Это не проверка параметров и всех мест применения |
| Визуальная приёмка | Свежих screenshots в этом продолжении нет; не выполнена |

Новые receipts, canonical JSON и отдельные metadata находятся в `C:/Users/flabe/AppData/Local/Temp/codex-package2-6c0bf7/evidence/full-library-20261002`. `capture-manifest.json` содержит SHA, список завершённых/незавершённых owners, время, полную длину и FNV-32 serialized payload. Для каждого chunk совпали размер/hash, после сборки проверены итоговая длина/hash и JSON parse. Незавершённые 28 000 символов `block-icon-cards` не опубликованы как packet и не идут в audit. Старые evidence `full-library-20261001` не перезаписаны. Raw evidence остаётся временным материалом, не источником контрактов.

**Результаты сравнения 37 packets:** см. датированный журнал ниже. Ни отсутствие value mismatch в покрытой части, ни совпадение Description не закрывают coverage/unsupported diagnostics и визуальную проверку.

#### Остаток и обязательный порядок возобновления

- [ ] Снова закрепить main/head PR и проверить изменения источников относительно указанных SHA. Одним маленьким read-only MCP-вызовом проверить доступ; при новом quota error сразу остановить всю очередь, без обходов.
- [ ] Снять **два оставшихся owners**: `block-icon-cards` (`326:6342`) заново целиком, затем `block-icon-list` (`946:26516`). Перед вызовом ID перепроверить по актуальным canonical contracts. Не склеивать новый packet с частичным старым чтением.
- [ ] Выполнить необходимое повторное чтение прежних **22 owners** исправленным capture: `asset-bank-badge-4x`, `asset-card-image-2x`, `asset-feature-icon-4x`, `asset-header-logo-4x`, `asset-header-logo-compact-4x`, `asset-icon-badge-4x`, `asset-partner-badge-4x`, `asset-product-logo`, `asset-status-badge-negative-4x`, `asset-status-badge-positive-4x`, `badge-operation-status`, `badge-step-number`, `banner-fiscal-check-link`, `button-primary`, `banner-hero`, `banner-inline`, `button-secondary`, `banner-secondary`, `item-alert`, `icon-gift-2-line`, `icon-receipt-fill`, `icon-user-forbid-fill`. Старые supplementary reads не превращать в новый canonical packet задним числом.
- [ ] По всем свежим packets завершить проверку значимых фактов, bindings и локальных text overrides; сопоставить оставшиеся coverage/mapping/variant/unsupported diagnostics. Не уменьшать покрытие и не подменять exact значения ради PASS.
- [ ] Для P2-F2 отдельно разобраться с четырьмя width observations и ролью reference geometry; сохранённые packets позволяют локальный анализ, но любое недостающее live evidence ждёт MCP. Никаких автоматических числовых исправлений.
- [ ] Получить необходимые screenshots и поручить визуальную сверку Terra Medium. Успешный числовой audit не заменяет визуального результата.
- [ ] Обновить журнал и статус PR по фактическому результату. Полный локальный gate точного финального SHA — перед отдельно разрешённым merge кода. Пакет 3/cutover не начинать, пока остаются предусмотренные gates.

**34 обычных records, для которых новые packets уже получены:** `banner-app-download`, `item-bullet`, `block-bullet-list`, `block-contact-support`, `item-notification`, `block-content`, `block-info-alert`, `block-instruction-steps`, `details-operation-plain`, `details-suspicious-operation`, `block-personal-data-update`, `details-receipt`, `block-receipt-info`, `item-step`, `block-steps`, `block-transaction-error`, `details-operation`, `block-transaction-success`, `details-transfer`, `email-footer`, `email-footer-legal`, `email-header`, `email-template`, `icon-bank-card-2-line`, `icon-fingerprint-2-line`, `icon-global-line`, `icon-lock-password-fill`, `icon-mail-fill`, `icon-mir-logo`, `icon-shopping-basket-2-line`, `icon-smartphone-fill`, `icon-user-follow-fill`, `icon-user-unfollow-fill`, `nps-options`.

**Граница PR #109:** все пять связанных owners остаются в инвентаризации. Известные изменения кнопок, link FILL и icon wrapper/alignment рассматриваются как отложенный refresh, не как неожиданная поломка. Остальные поля и общие зависимости не исключаются вместе с владельцем. Никакие изменения этого PR не перенесены.

#### Что остаётся открытым вне сбора

- [ ] **P2-F1:** bounded capture repair реализован и работает на новых live reads, но оставшееся покрытие/сопоставление ещё не доказано. Значимые поля, несовместимые paths, variant ownership и непокрытые факты требуют точной классификации, без blanket exclusions.
- [x] **P2-F3:** generated-карта 364 записанных semantic associations / 15 стилей исправлена и локально проверена; это не доказательство текущего live usage и не разрешение удалять стили.
- [ ] **F7:** решение по generated workflow checkpoints и exact producer/schema/manifest/output/test map остаётся открытым. В этом продолжении не выполнялось; пакет 3 не начат.

После повторного лимита выполняются только локальное сравнение уже полученных данных, фиксация журнала и scoped проверка документационной правки. Дизайн, Descriptions, component/foundation values, HTML, навыки, routes и письма не изменяются.

### P2-F1 — разрешённый локально проверяемый ремонт capture (01.10.2026)

Пользователь разрешил начать первый пункт работы во время лимита. Это bounded repository-only исправление уже существующего сборщика, не новый этап и не исправление фактов компонентов.

**Allowed paths:** `scripts/figma/capture-contract-source.js`, новый `tests/foundation/figma-contract-source-capture.test.mjs`, журнал этого плана. PR #110 продолжает пакет 2: после прежних docs-only commits в него добавляется этот узкий repair. PR #109 не включается.

**Причина и решение:** canonical capture пропускает реальные поля или выдаёт их не по уже используемым mapping paths. Добавить `text_geometry.auto_resize/vertical_alignment`, числовой `text_style.font_weight` непосредственно с TextNode, `text_style.figma_style_name` через точный `textStyleId → getStyleByIdAsync`, `minimum_width_px` из minWidth и `fills/strokes[*].stops` из фактических gradientStops. Существующие v1 поля сохранить; не переписывать packets, не менять mapping links, auditor, schema, числовые значения, renderer или generated docs. Дополнительные поля могут выявить новые uncovered facts; такие сообщения не скрывать.

**Границы неизвестных значений:** не выводить вес по строке Medium/Bold, имя — по размеру/семейству; detached style не подменять foundation. Пустой style ID означает отсутствие связи; неразрешённый/ошибочный ID и mixed значения остаются явными diagnostics и не превращаются в «проверено». Локальные font overrides читать с узла, а не из definition стиля.

**Шаги и критерии:**
- [x] Выполнить реальный capture-код в локальном mock Figma API и получить RED для пяти групп полей; использовать hand-checked fixture values из сохранённого read-only evidence, не новую live-верификацию.
- [x] Исправить capture минимально; вернуть точные значения и ожидаемые source paths, сохранить прежние данные и порядок дерева.
- [x] Получить GREEN для новых cases, проверить unlinked/unresolved/mixed/override ветви и интеграцию с неизменным auditor: реальные mismatches и недостающие факты всё ещё блокируют.
- [ ] Проверить exact cloud SHA локально, generated equivalence и preserved blobs; одно независимое review. Полный финальный gate нужен перед последующим merge кода, не после каждой мелкой правки.
- [x] Исправленный capture подтверждён живым чтением всех 61 owners; очередь чтений завершена 02.10.2026. Это закрывает получение packets, но не semantic coverage/приёмку P2-F1: diagnostics и отсутствующее evidence остаются открытыми.

**Решение об исполнении:** постоянные изменения публикуются через облачный GitHub; локальная копия остаётся одноразовым exact-SHA test snapshot. Поэтому локальные worktree/SDD authoring scripts не применяются, а ledger ведётся здесь. Routine tests и regression выполняет существующий Terra Medium; coordinator получает компактный отчёт. P2-F3 (карта шрифтов), F7, четыре width differences и вся активация остаются вне этой правки.

### P2-F3 — разрешённый ремонт generated-карты типографики (01.10.2026)

Пользователь разрешил следующий offline шаг. Исправляется потеря уже существующих semantic associations при генерации документации; новые факты Figma не устанавливаются.

**Allowed paths:** `scripts/lib/generated-docs.mjs`, `tests/generation/generated-docs.test.mjs`, автоматически созданный `docs/generated/typography-registry.md` и журнал этого плана. Ранее разрешённые capture-изменения PR #110 сохраняются без расширения. Контракты, foundations, schemas, HTML-рендерер, навыки, manifest, Figma и локальные письма не меняются.

**Решение:** сохранять поддержку typed foundation references; дополнительно разрешать exact `figma-style-id` atomic facts через принадлежащие компоненту `figma_fact_links`, совпадающий node/provenance, viewport и вариант. Не брать связи из `source_variants`, имён стилей, размеров или архивных списков. Генерировать компонентный summary и точные позиции component/viewport/variant/element. Одинаковые ссылки дедуплицировать, разные элементы и варианты не сливать. Неразрешимый, неоднозначный или повреждённый semantic link даёт явную typed diagnostic, а не «нет потребителей». Числовые local overrides остаются фактическими значениями узла; association не подменяет их definition стиля.

**Критерии и последовательность:**
- [x] Сначала regression RED: Mobile/Desktop + variant ownership; точный style ID; typed references; local overrides; неизвестные/неоднозначные IDs и повреждённые ссылки; snapshot-only не является consumer.
- [x] Минимально исправить projection и получить GREEN. Проверить детерминизм, 364 существующих associations / 15 стилей и неизменность входных facts.
- [x] Пересобрать typography registry каноническим генератором; другие generated outputs должны остаться побайтово прежними.
- [x] Независимое code review и targeted local tests (результаты в журнале ниже). Final artifact review и scoped exact-SHA gate фиксируются в PR body после journal commit.
- [ ] Перед будущим merge: полный локальный gate точного финального SHA; сейчас PR не сливается.

Generated usage отражает записанные контракты, не свежую живую Figma. Отсутствие recorded consumers не разрешает удалить стиль. Квота MCP, актуальный остаток из точки возврата выше, четыре P2-F2 width differences и F7 остаются открытыми; пакет 2 целиком не закрывается, пакет 3 не начинается. Ручной active-work-context не обновляется.


## Global Constraints

- Cloud GitHub — постоянный источник; локальный exact-SHA snapshot — только исполнение/проверка, не рабочая копия для правок.
- Только локальный Codex, две специализации и thin router. Нет Web-выдачи или разработки новых блоков; onboarding готового одобренного компонента сохраняется.
- Не менять факты контрактов, дизайн Figma или активные email routes ради формального зелёного статуса. Обнаруженное расхождение сообщить; изменение требует собственной согласованной области.
- Каждое Figma-зависимое доказательство включает свежие MCP-факты и визуальный снимок, когда он нужен для результата. Перенесённый Markdown, старый fingerprint и статус не заменяют чтение значимых фактов.
- Figma write требует impact report и отдельного разрешения точных полей; read-back выполняется отдельным вызовом. Нельзя расширять allowlist ради исправления неожиданных изменений.
- Не выполнять или использовать Actions/PR Checks. Terra Medium делает локальные tests/validation/visual comparisons; coordinator получает компактный итог.
- В ходе пакета — targeted проверки. Перед merge кода/контрактов/активации — один полный gate точного финального commit; новый commit отменяет прежний финальный результат. Docs-only пакет — scoped gate.
- Архив — только comparison baseline. Не подключать его к runtime и не удалять автоматически. Текущий статус хранится в roadmap, факты и точка возврата пакета — в его implementation plan.
- Фактическое переключение, Figma mutation, локальная установка и очистка не разрешены публикацией этого плана.

## Review Focus

1. `resolved` у общего workflow не доказывает, что steps обеспечены источниками конкретного route/mode.
2. Read-only запрос, неоднозначная семантика или пустой/устаревший MCP-пакет не должны приводить к записи.
3. Description-only/rename не должны менять geometry, component type, properties, Slots, bindings или scale suffix.
4. Отмена design-time навыка не должна удалить onboarding, naming generator или checks готовой библиотеки.
5. Изменения поддержки не должны изменить HTML, export semantics, версии или сохранность исходных писем.

---

## 11A — доказательство готовности

### Пакет 1: Source closure и точная карта переключения

**Files:** Inspect: `system/manifest.yaml`, `data/workflows/library-maintenance.yaml`, `schemas/workflows.schema.json`, `scripts/lib/skill-context.mjs`, `scripts/lib/context-bundle.mjs`, `scripts/lib/workflow-registry.mjs`. Test: `tests/skills/skill-context.test.mjs`, `tests/skills/skill-context-cli.test.mjs`, `tests/generation/context-bundle.test.mjs`, `tests/workflows/structured-workflows.test.mjs`. Record: журнал этого плана.

**Interfaces:** Consumes: закрытый 10A и свежий main. Produces: проверенная карта каждого route → workflow/modes → profile → источники steps → gates/handoff; точный allowed-path список необходимой реализации пакета 3.

| Route | Обязательные сценарии |
| --- | --- |
| library-maintenance | read-only; разрешённая repository-only правка; отдельные Figma gates при применимости |
| component-onboarding | анализ уже созданного одобренного компонента; draft → проверки → active; неизвестный/неполный вход останавливает процесс |
| figma-description-sync | preview/drift без записи; description-only после отдельного разрешения; отдельный read-back |
| figma-naming-audit | audit/recommendation без записи; rename только по согласованной карте, с сохранением @2x/@4x |
| migration-progress | только read-only: свежие main, папка plans, roadmap и фактические артефакты |

- [x] **Step 1:** На точном main выполнить resolver для всех пяти routes с применимыми component/viewport/foundation inputs. Сохранить локально полный bundle и typed diagnostics; ожидается текущий paused, не pretend-ready.
- [x] **Step 2:** Для каждого route/mode сравнить returned bundle с каждым `workflow.steps[].source_ids`, input/output и condition. Определить недостающие или лишние источники и несовместимые steps; отдельной строкой показать migration-progress.
- [x] **Step 3:** В изолированных test fixtures доказать конкретные найденные gaps отрицательными тестами: отсутствие источника step, несовместимый mode, неизвестный component/foundation, inactive dependency. Исходный exact-SHA snapshot не редактировать.
- [x] **Step 4:** Зафиксировать минимальную карту исправлений и allowed paths. Где общего workflow недостаточно, показать конкретные steps/источники и решение до кода. Новая архитектурная развилка требует review master-spec, а не скрытого исключения в плане.
- [x] **Step 5:** Опубликовать findings и targeted результаты в отдельном PR; statuses/routes в main сохранить. Вспомогательные raw bundles/logs не коммитить.

**Acceptance:** Пять карт с точными source IDs, modes и stop conditions; все проблемы имеют воспроизводимый тест или подтверждённое семантическое доказательство. Не включён ни один маршрут.

### Пакет 2: Figma-backed и архивное доказательство смысла

**Files:** Inspect: `data/components/{shared,marketing,service}.yaml`, `data/foundations/{typography,spacing,assets,figma-naming}.yaml`, применимые `core/*.md`, `docs/generated/`, read-only `Legacy/`. Reuse: `scripts/figma/capture-contract-source.js`, `scripts/audit-figma-contract-facts.mjs`, `scripts/lib/foundation-evidence.mjs`. Test: `tests/foundation/figma-contract-facts.test.mjs`, `tests/foundation/foundation-evidence.test.mjs`, `tests/characterization/component-documentation-boundary.test.mjs`, `tests/characterization/foundations-remediation-boundary.test.mjs`.

**Interfaces:** Consumes: scope/map пакета 1. Produces: фактическое evidence по значимым возможностям maintenance и таблица объяснённых различий с baseline; не новая prose-копия контрактов.

- [x] **Step 1:** Выбрать зарегистрированные representative owners из обоих roots по покрываемым свойствам: responsive images, exact typography/spacing bindings, nested component/property visibility, export owner и description/naming. Записать stable IDs и реальные Figma IDs до чтения; не искать совпадения только по имени.
- [x] **Step 2:** Свежими read-only MCP-вызовами снять значимые значения обоих variants и нужные screenshots. Сопоставить фактические числа, шрифты, alignment, padding/gap, visibility, hierarchy и asset boundary с contract. Не считать картинку или fingerprint достаточным числовым evidence.
- [x] **Step 3:** Для каждого selected component выполнить `node scripts/audit-figma-contract-facts.mjs --repo-root SNAPSHOT --component-id ID --live MCP_PACKET`; foundation evidence проверить существующим механизмом. Ожидается полное покрытие выбранных фактов и 0 необъяснённых differences.
- [ ] **Step 4:** Сравнить relevant archived obligations с нынешними Core/workflow/contract/generated outputs. Для каждой существенной разницы указать текущего владельца и подтверждённую причину. Утраченное characterization-утверждение восстановить активным тестом того же поведения; не закреплять obsolete baseline как новый норматив.
- [x] **Step 5:** Сообщить расхождения и недостающее evidence. Не править contract/Figma автоматически; расширить проверку только по найденной причине. Raw MCP-пакеты, screenshots и полные logs остаются локальными; краткие проверяемые выводы — в журнале/PR.

**Статус выполнения:** отмеченные steps означают проведённые чтения/сравнения и опубликованные выводы, а не успешную приемку. Live audits выявили открытые diagnostics; step 4 остаётся незавершённым из-за неразрешённых semantic obligations/F7, а не из-за P2-F3: recorded association projection исправлен. После продолжения 02.10 полный сбор 61/61 и сравнительные результаты описаны в текущей точке возврата выше. F2, coverage и недостающее evidence сохраняют P2 открытым.

**Acceptance:** Все выбранные значимые факты подтверждены; различия классифицированы и разрешены пользователем либо остаются явными blockers. Onboarding проверяется на готовом компоненте или fixture, не создаётся новый дизайн.

### Пакет 3: Закрытие workflow, authorization и handoff

**Files:** Modify только paths карты пакета 1: существующие `data/workflows/library-maintenance.yaml`, profile/source declarations `system/manifest.yaml`, при доказанном gap resolver/bundle modules. Test: `tests/workflows/structured-workflows.test.mjs`, `tests/skills/skill-context.test.mjs`, `tests/skills/maintenance-skill-boundary.test.mjs`, `tests/generation/context-bundle.test.mjs`, `tests/foundation/figma-name-generator.test.mjs`, `tests/components/figma-component-description.test.mjs`. Новые source paths сначала фиксируются картой, не придумываются в ходе записи.

**Interfaces:** Consumes: карты и semantic evidence пакетов 1–2. Produces: проверенные route-specific steps и gates для кандидатного выполнения, но без production cutover.

- [ ] **Step 1:** Выполнить RED-тесты найденных gaps на baseline: route/mode/source closure и невозможность записи без конкретного разрешения. Тесты должны проверять поведение/diagnostic path, не совпадение слов SKILL.
- [ ] **Step 2:** Реализовать минимальные исправления в cloud candidate; не включать main routes. Проверить cold-context handoff каждого из пяти routes без ручного fallback. Для разрешённых candidate-проб зафиксировать точный SHA и отдельно разрешённую область.
- [ ] **Step 3:** Проверить negatives: отсутствующая identity/семантика, missing source, source mismatch, недоказанные данные; отказ менять Figma по read-only запросу; отказ rename без карты. В controlled fixture внедрить неожиданное изменение поля вне разрешённой области: сравнение до/после должно вернуть существующий blocker `figma-readback-mismatch`, остановить дальнейшие writes, зависимую синхронизацию и публикацию, не выполнять auto-repair. Дополнить guards только при показанном дефекте.
- [ ] **Step 4:** Доказать Figma write path controlled mock/fixture и отдельным read-only evidence. Для двух позитивных сценариев — Description-only и rename по одобренной карте — сравнить semantic pre/post diff с точным allowlist target/fields: меняются только разрешённые Description/name. Отдельная preservation projection обязана подтвердить неизменность геометрии, Auto Layout, типов узлов, иерархии, вариантов, component properties, Slots, bindings и экспортных суффиксов `@2x`/`@4x`. Не требовать неизменности полного fingerprint, если он включает разрешённое имя: проверять разрешённую разницу и неизменные поля раздельно. Live запись допустима только после отдельного разрешения target/fields; без него не заявлять live mutation gate выполненным. Даже одобренный no-op проверяется отдельным read-back.
- [ ] **Step 5:** Повторить targeted GREEN, generated equivalence и independent reviewer/behavior pass. Опубликовать проверенные изменения отдельным PR; доказательства всех пяти routes обязательны даже при переиспользовании workflow.

**Acceptance:** Нет необъяснённых gaps; skill действует по returned steps; позитивные и отрицательные сценарии подтверждены. Description-only и mapped rename проходят точный allowlist/preservation diff; неожиданный diff блокирует запись, зависимую синхронизацию и публикацию без auto-repair. Эти доказательства обязательны до 11B; main по-прежнему paused для поддержки.

### Пакет 4: Regression email и итоговый gate 11A

**Files:** Verify: `data/workflows/email-build.yaml`, `.agents/skills/building-cupis-emails/SKILL.md`, `tests/skills/email-build-{handoff,orchestration,skill-boundary}.test.mjs`, `tests/rendering/`, `tests/skills/cupis-email-task-router.test.mjs`, `bootstrap/verify.ps1`. Sources/letters preserved.

**Interfaces:** Consumes: final candidate/source maps пакета 3. Produces: exact-SHA proof record для допуска 11B.

- [ ] **Step 1:** Прогнать active new-build и continue/fix resolver и targeted email tests; проверить template-root, nested components, один bundle и остановку зависимого mixed scope.
- [ ] **Step 2:** На representative marketing/service моделях сравнить HTML/asset contracts и output metrics до/после maintenance-правок; сравнить источники моделей и render-impact digests. Отдельно проверить versions, локальные src и неизменность исходника при technical fix.
- [ ] **Step 3:** Если обнаружено render-impact изменение, не переутвердить эталон автоматически: классифицировать владельца причины и получить нужное разрешение; Terra сравнивает rendered/reference screenshots с сохранёнными Figma evidence. Нет изменения rendering strategy — нет новой имитации real-client приёмки.
- [ ] **Step 4:** На точном финальном cloud SHA выполнить `npm run verify`, `npm run generate:check`, применимый Windows bootstrap и allowed-path/preserved-blob gate. При отсутствии npm использовать существующий pnpm/эквивалентные Node scripts; не менять lockfile только ради среды.
- [ ] **Step 5:** Reviewer проверяет proof пяти routes, источник каждого значимого факта и отрицательные gates. 11A закрывается после local PASS, отдельного merge и фиксации фактов в roadmap; blocker оставляет конкретный route неподготовленным.

**Acceptance:** Работающие письма не регрессировали, полный final gate зелёный, каждая proposed activation имеет собственное достаточное evidence.

## 11B — отдельное разрешённое переключение

### Пакет 5: Активация, rollback и локальная приёмка

**Files:** Modify по проверенной карте: `system/manifest.yaml` (пять конкретных routes, их profiles, aggregate); `data/workflows/library-maintenance.yaml` и только доказанно требуемые status dependencies. Verify skills, bootstrap, validators. Update этот план и roadmap.

**Interfaces:** Consumes: merged 11A и разрешение cutover. Produces: active maintenance routes с подтверждённым resolver/handoff и точкой rollback.

- [ ] **Step 1:** Закрепить свежий main как rollback SHA, сохранить прежнюю резервную ветку и показать exact old → new таблицу route/workflow/profile/status. Не делать глобальный shadow → active replace.
- [ ] **Step 2:** Получить отдельное разрешение на эту карту. В candidate назначить только доказанные structured workflows, убрать paused source из их profiles и обновить только зависимые статусы. Email route records сохранить побайтово, если отдельного разрешённого defect fix нет.
- [ ] **Step 3:** Для каждого включаемого route доказать `resolved`, exact mode и нужные steps; negative dependency/source cases должны давать typed blocked. При частичном переключении aggregate остаётся partial; active допускается только когда все текущие routes готовы.
- [ ] **Step 4:** На exact final SHA выполнить один полный локальный gate, generated check, bootstrap и независимое ревью. Получить отдельное разрешение merge; защита GitHub, требующая remote check, является blocker, не повод обходить её.
- [ ] **Step 5:** После merge и отдельного разрешения синхронизировать изменённые локальные навыки с backup; подтвердить discovery и clean-context работу всех routes. Сбой исправляется corrective/revert PR, не force-reset; Figma не откатывается автоматически.

**Acceptance:** Включён только доказанный объём, локальный clean-context результат соответствует main, rollback имеет точный SHA/allowed diff. 11C ещё не выполнен.

## 11C — отдельная итоговая очистка

### Пакет 6: Решения по архиву и переходным артефактам

**Files:** Inspect: `Legacy/`, `workflows/system-paused.md`, `system/migrations/`, временные shadow/characterization guards и ссылки в manifest/skills/bootstrap. Modify/delete только явно одобренный список; исторические планы и резервная ветка сохраняются.

**Interfaces:** Consumes: стабильный merged 11B. Produces: обоснованная remove/preserve таблица, отсутствие активных архивных потребителей и завершённый roadmap.

- [ ] **Step 1:** Для каждого архивного файла/группы и переходного guard найти фактических потребителей, текущую замену и будущую роль. Generated registry, постоянные validators, Core и регрессионные tests не являются временными только из-за даты создания.
- [ ] **Step 2:** Принять отдельное remove/preserve решение с причиной. Связанные assertions сначала перенести/заменить проверкой действующей системы; удалить baseline только после подтверждённой замены. Не удалять весь Legacy одной командой.
- [ ] **Step 3:** Показать список удалений, зависимые links/tests и reversible rollback. Получить отдельное разрешение; разрешение cutover не является разрешением очистки.
- [ ] **Step 4:** Применить минимальный cloud diff и проверить отсутствие runtime paths в архив/удалённые источники. Сохранённые historical sources не становятся активными owners.
- [ ] **Step 5:** Выполнить scoped или full local gate по фактическому типу diff, merge отдельно. Только после выполненных решений и итоговой source/route проверки закрыть этап 11 в roadmap.

**Acceptance:** Каждый архивный/временный объект имеет выполненное решение; постоянная система самодостаточна; нет неразрешённых route или потребителей удалённых paths.

## Порядок PR и продолжения

Пакеты выполняются последовательно, не одним длинным запуском: 1 → 2 → 3 → 4 → разрешение cutover → 5 → отдельное разрешение cleanup → 6. Если 1–2 дают blocker, пакет 3 исправляет только одобренные причины. Merge плана не начинает пакет 1. Для каждого пакета в журнале сохраняются pinned base/final SHA, разрешённые paths, команды, результаты, причины отклонений и следующий gate; нельзя закрывать этап одной пометкой статуса.

## Журнал

- 01.10.2026: план подготовлен на e08b5099; пять maintenance routes paused, два email routes active. Реализация 11A/11B/11C не начата.
- 01.10.2026: после независимого review усилен пакет 3: обязательные позитивные preservation diff и отрицательный read-back сценарий до 11B. Это требование будущих проверок, не сообщение об уже выполненной записи или тестах Figma.
- 01.10.2026: PR #106 слит; prerequisite 10A фактически выполнен локальной синхронизацией router из `09537effc89daadacaed1d05497a1e75beb18152` и post-install gates. Пять maintenance routes по-прежнему paused; два email routes active. Ни один пакет этого плана не начат.

### 01.10.2026 — пакет 1: source closure и карта последующих исправлений

**Область и основание.** По команде пользователя «Давай дальше» сначала слит статусный PR #107: `main@ace7725d6e88dce0b9b130cd5610f4bcade4feb9`, дерево `1eb7567b30e84a79ec9a7fb989a32c50d71f3e69` совпадает с проверенным head #107. Это новый pinned base пакета 1; router/специализация и источники прочитаны на этой версии. Prerequisite 10A выполнен. Пакет 1 исследует источники и сохраняет findings, а не реализует пакет 3 и не включает маршруты.

**Impact boundary текущего PR:** меняется только этот implementation plan: статус текущего пакета, чекбоксы пакета 1 и проверяемый журнал. Не меняются manifest, workflows, schemas, модули, structured contracts, foundations, generated docs, skills/bootstrap, Figma или локальные письма. Глобальный roadmap в main ещё не отмечает исполнительные gates 11A выполненными; результаты этого кандидата попадают в его статус после отдельного merge, а не заранее.

**Pre-flight / Rulings.**

- Пакет 1 → пакет 2: карта определяет, какие значимые свойства и возможности требуют свежего Figma-backed evidence; текущие CLI/fixture результаты не подтверждают визуальные факты.
- Пакеты 1–2 → пакет 3: разрешённые paths и причины ниже; unresolved semantic drift пакета 2 не разрешает автоматически менять component facts.
- Пакет 3 → пакет 4 → пакет 5: coherent local fixture не является production cutover; сначала source/gate implementation, затем email regression и полный exact-SHA gate, затем отдельное разрешение переключения.
- Ruling: cloud-only источник исключает авторинг в worktree и локальный SDD ledger. Журнал хранится здесь и в PR; одноразовый exact-SHA архив используется только для исполнения. Изменяемые fixture-копии существуют отдельно от неизменного архива.
- Ruling: отдельные workflows для уже существующих маршрутов реализуют master-spec §§4, 11, 15–16, а не вводят новый владелец правил или новый формат. Manifest остаётся единственной картой. Модель контрактов и HTML-стратегия не меняются.

#### 1. Что действительно проверено

Terra Medium выполнила на точном `ace7725d6e88dce0b9b130cd5610f4bcade4feb9`:

```text
node --test tests/skills/skill-context.test.mjs tests/skills/skill-context-cli.test.mjs tests/generation/context-bundle.test.mjs tests/workflows/structured-workflows.test.mjs
exit 0; tests 37; pass 37; fail 0; skipped 0
```

Среда: Node.js 24; изолированный архив точного cloud SHA; зависимости через pnpm без lifecycle scripts. npm недоступен, использован прямой эквивалент Node-команды. Полный suite в этом docs-only пакете не повторяется. Actions/PR Checks не запускались, не читались и не используются.

Актуальный `migration-progress/read-only` bundle имеет режим `structured-shadow`, статус `paused`, blocker `SKILL_ROUTE_PAUSED` по `/route/workflow_source_id`; 0 component projections и 0 foundation definitions. Static IDs: `repository-readme`, `migration-roadmap`, `workflow-paused`. Digest: `sha256:d93c34659ac9802cdb8083bda85ae3ee2816b804be7578fbfaaffc4dd3cd8732`.

Полные baseline bundles, raw typed diagnostics, TAP и fixture probes сохранены только локально. В репозиторий они не добавляются. Отдельные fixture-проверки — исследования текущего поведения, не новые production-тесты и не evidence live Figma mutation.

#### 2. Точная текущая карта пяти маршрутов

Сокращения **только для этого отчёта**, не новый каталог:

- `B` = `repository-readme`, `figma-library-standard`.
- `C` = `component-contract-standard`, `figma-component-description-standard`.
- `P` = `workflow-paused`.
- `F` = только действительно выбранные/referenced definitions `typography`, `spacing`, `assets`, `figma-naming`.
- Component projections — выбранные active contracts и их dependency closure, не все три исходных реестра целиком.

У всех пяти route записей сейчас `workflow_source_id: workflow-paused`; у их generated profiles — `structured-shadow`. Текущий кандидат `workflow-library-maintenance` имеет статус `shadow`, два объявленных mode: `read-only` (5 steps) и `write` (11 steps). Он не является действующим workflow этих routes.

| Route / profile ID | Текущий static bundle | Точная selection policy | Проверенные baseline inputs и результат |
| --- | --- | --- | --- |
| `library-maintenance` | B + C + P | components optional; viewport one-or-both; foundations explicit-or-referenced; allowed typography/spacing/assets/figma-naming; required [] | `email-header`, mobile, explicit typography; отдельно read-only и write → paused/SKILL_ROUTE_PAUSED |
| `component-onboarding` | B + C + P | components optional; viewport both; foundations explicit-or-referenced; allowed typography/spacing/assets/figma-naming; required [] | зарегистрированный `email-header`, both; read-only и write → paused/SKILL_ROUTE_PAUSED; это не тест нового Figma-компонента |
| `figma-description-sync` | B + C + P | components required; viewport both; foundations referenced; allowed typography/spacing/assets; required [] | `email-header`, both, без explicit foundation; read-only и write → paused/SKILL_ROUTE_PAUSED |
| `figma-naming-audit` | B + P | components optional; viewport none; foundations explicit; allowed/required figma-naming | naming foundation; read-only и write → paused/SKILL_ROUTE_PAUSED |
| `migration-progress` | repository-readme + migration-roadmap + P | components none; viewport none; foundations none; allowed/required [] | read-only, без component/viewport/foundation → paused/SKILL_ROUTE_PAUSED |

Получены 9 фактических вызовов API для указанной mode-матрицы. `write` здесь является входным значением, не разрешением записи. Paused exit происходит **до** `resolveWorkflowSteps`; поэтому возвращённый paused не доказывает поддержку mode. Ранние probe labels `draft`, `preview`, `audit` также не являются объявленными mode текущего общего workflow и не учитываются как успешная mode-проверка.

Selection validation выполняется до paused. Отсутствие обязательного viewport/component даёт соответственно `CONTEXT_BUNDLE_VIEWPORT_REQUIRED`, `CONTEXT_BUNDLE_BOTH_VIEWPORTS_REQUIRED`, `CONTEXT_BUNDLE_COMPONENT_REQUIRED`. В description-sync explicit foundation запрещён policy, а не «не найден»: `CONTEXT_BUNDLE_FOUNDATION_EXPLICIT_FORBIDDEN`.

#### 3. Сопоставление steps, inputs/outputs и conditions

Для каждого маршрута повторное назначение общего workflow без изменений **не является решением**:

- **library-maintenance.** read-only `inspect-canonical-sources` требует source IDs всех `components-shared`, `components-marketing`, `components-service`; conditional `inspect-figma-read-only` требует `figma-naming-foundation`. write `assess-impact` требует naming foundation без condition, а `synchronize-dependents` снова требует все три registries. В текущем selected bundle есть конкретные component projections/F, но naming не обязателен. Нужно различать источники нормативных правил и типизированные inputs выбранных фактов; не подгружать все registries ради совпадения source ID. Для repository-only задачи не требовать Figma write/read-back; условные steps должны зависеть от точной boundary.
- **component-onboarding.** Общие steps не выражают собственную последовательность «готовый одобренный MCP target → точные факты обеих версий → draft record → schema/cross-reference/generated preview → отдельное metadata-разрешение/read-back → active». `collectDependencyClosure` пропускает только active records; draft нельзя выдавать за active selected contract. Staged draft должен быть отдельным типизированным input workflow и проверяться existing component schema; selected active components остаются comparison context. Пустой список selected components не означает, что новый target уже проверен.
- **figma-description-sync.** Требуются expected compact Description и actual MCP Description, preview/drift без записи, description-only scope, отдельный read-back и preservation. Общий write workflow дополнительно допускает repository-change/naming и не выделяет эту последовательность. Profile намеренно не даёт naming foundation. Не расширять его автоматически; убрать чужие steps и потребности.
- **figma-naming-audit.** Нужны подтверждённые identity/семантика target, scoped validator/generator, согласуемая карта old → new и dependent/preservation checks. Общий workflow не выделяет эти inputs и recommendation handoff. При выборе `email-header` с viewport none projection содержит пустые contracts/properties/assets; это ограничение проекции, не удаление фактов реестра. Нельзя использовать её как доказательство сохранности Slots, properties, bindings или export owners: нужны отдельные MCP facts/evidence пакета 2 и проверки пакета 3.
- **migration-progress.** Доступны README/roadmap/P, но общий read-only workflow требует C, component registries и conditional naming; в его steps вообще нет roadmap, чтения папки plans и сверки фактически слитых artifacts. Output `audit-findings` сам по себе не задаёт эту проверку. Нужен собственный read-only workflow; modes/steps записи и Figma mutation для этого route отсутствуют.

Conditions общего workflow: `figma-evidence-required`, `figma-in-scope`, `repository-write-in-scope`, `figma-write-in-scope`, `figma-write-performed`. Они являются метками steps, а не разрешением пользователя. После stop/request-input нельзя продолжать зависимые writes/sync/publication. Mode-level inputs `request`, `target-scope`, `write-authorization` и outputs не проверяют конкретную rename map, staged draft или description allowlist: их обязаны явно задать специализированные steps/inputs. Common schema уже поддерживает required_inputs, blockers, conditions, handoff, input_blockers и input_relations; новый формат ради этой карты не требуется.

#### 4. Воспроизводимые findings и их значимость

| Finding | Фактическое доказательство | Влияние и решение |
| --- | --- | --- |
| **F1 — отсутствует workflow-step / returned-source closure** | В coherent fixture удалён зарегистрированный `figma-library-standard` только из profile.source_ids и generated_bundle.static_source_ids; общий workflow продолжает требовать его. `resolveSkillContext` возвращает resolved и 5 steps. Manifest registration/файл остаются. | Критично для готовности: skill не должен получать исполнимые steps без их rules. Пакет 3 добавляет typed refusal до handoff и проверяет closure выбранного mode. Projection facts не заменяются raw registry prose. |
| **F2 — topology жёстко связана с прежним email-only cutover** | `system-manifest.mjs` в partial требует ровно 2 active email routes, все non-email paused; в active требует все routes и для каждого non-email именно `workflow-library-maintenance`. Реальный blocker: `structured-workflow-status-topology-invalid` по `/structured_workflows/status`. | Критично для следующих steps: невозможно отдельно включить доказанный maintenance route или назначить route-specific workflow. Валидировать coherence по объявленным manifest mappings/registered workflows, не снимать kind/source/status checks. Email route records сохранить. |
| **F3 — общий workflow не соответствует пяти разным задачам** | Точная source/mode/step карта выше; migration profile не имеет C/naming/components и workflow не содержит roadmap step; остальные specialization inputs отсутствуют. | Критично для корректного handoff. Разделить steps по уже существующим routes, оставляя общие правила в Core; не копировать contracts или business constants в workflows. |
| **F4 — naming foundation ещё не допускает final active status** | `schemas/figma-naming.schema.json`: /properties/foundation/properties/status const shadow; `data/foundations/figma-naming.yaml`: foundation.status shadow. В coherent active fixture naming read-only разрешается с этим shadow foundation. | До 11B требуется согласованный schema/version/status переход и guard доказанных route dependencies. Нельзя просто заменить shadow на active в data: schema этого не допускает. Пакет 3 готовит и проверяет формат, пакет 5 меняет status только после evidence. |
| **F5 — onboarding draft нельзя использовать как selected active contract** | В coherent fixture зарегистрированный component со status draft → `COMPONENT_NOT_ACTIVE`; неизвестный component → `COMPONENT_UNREGISTERED`. | Защиту HTML/active closure сохранить. Workflow должен принять подтверждённый ready target и staged draft отдельными inputs; фактический draft→active gate проверить в пакете 3. Не добавлять active-подмену или новый дизайн. |
| **F6 — статус доступности ошибочно описан общей Core-фразой** | `core/figma-library-standard.md` связывает доступность с workflow-paused; владельцем фактических routes является manifest, и email routes уже активны. | Перед maintenance cutover убрать копию статуса и оставить ссылку на текущий manifest/resolved workflow. Менять только эту нормативную связку, не дизайн или правила компонентов. |
| **F7 — обещанный generated workflow checkpoint пока не имеет активного producer/output** | Master-spec §11.1 требует человекочитаемые checkpoints из workflows. Manifest.generated_docs и `scripts/lib/generated-docs.mjs` RENDERERS содержат только component-registry, typography-registry, asset-registry, naming-reference; схема manifest допускает те же 4 renderer ID. В текущем tree checkpoints есть только в архиве. | Архитектурный/spec blocker до реализации пакета 3: провести review master-spec и определить producer, manifest source/output registrations, generated paths и tests либо отдельно согласовать изменение этого требования. Копия archived checkpoint не является решением. |

Негативные probes, подтвердившие существующие guards:

- Unknown workflow mode в coherent fixture → `WORKFLOW_MODE_UNKNOWN`.
- Unknown foundation → `CONTEXT_BUNDLE_FOUNDATION_UNKNOWN`.
- Shadow maintenance workflow при согласованных active route/profile arrays → `structured-workflow-status-topology-invalid`.
- Draft registered component → `COMPONENT_NOT_ACTIVE`; unknown component → `COMPONENT_UNREGISTERED`.

**Точная fixture-методика F1/F2/F4/F5.** Отдельная локальная копия: aggregate active, все 7 profiles structured-active, каждый route указывает на существующий зарегистрированный workflow (2 email → email-build, 5 maintenance → общий library-maintenance); оба workflow documents active; source_ids/static_source_ids равны, содержат свой workflow, не содержат workflow-paused, дедуплицированы. Это только средство пройти прежний topology gate для проверки внутренних API, не рекомендуемая production-активация. Затем изменяется ровно поле исследуемого случая.

Ранние неполные fixture arrays и повторное добавление уже имеющегося workflow-email-build дали topology/schema blockers; они исправлены **только в fixtures** и не являются продуктовыми findings. Значение status `draft` для naming foundation не разрешено schema: такой probe — construction-negative, не доказательство runtime inactive-status guard. Точный canonical shadow probe F4 приведён отдельно.

#### 5. Минимальная карта пакета 3 до написания кода

Текущая схема workflows допускает форму документов с перечисленными ниже modes; корректность source registrations, coherence и семантики inputs/gates требует отдельных проверок. Новые paths ниже — **предложенная карта реализации**, не существующие sources и не разрешение cutover; они сначала добавляются в candidate manifest. Все 5 main routes сохраняют P до пакета 5.

| Existing route | Workflow ID / source ID / exact path | Modes и применимые данные | Обязательные stop/handoff gates |
| --- | --- | --- | --- |
| library-maintenance | library-maintenance / workflow-library-maintenance / `data/workflows/library-maintenance.yaml` (существует) | read-only, write; B+C; выбранные component projections/F как scoped inputs; naming только при подтверждённом naming scope | scope ambiguous/conflict → request-input; missing source/evidence → stop; exact repository boundary; Figma allowlist/read-back только при соответствующем отдельном разрешении |
| component-onboarding | component-onboarding / workflow-component-onboarding / `data/workflows/component-onboarding.yaml` (новый) | read-only, write; B+C, naming definitions при naming-проверке, выбранные foundations; approved ready target/MCP facts и staged draft как inputs, не active contract | identity/семантика/полнота обеих версий/schema/reference/evidence → stop; Description write требует отдельной boundary; active только после успешных gates |
| figma-description-sync | figma-description-sync / workflow-figma-description-sync / `data/workflows/figma-description-sync.yaml` (новый) | read-only, write; B+C, selected both contracts и expected/actual Description; без обязательного naming foundation | drift preview не пишет; разрешённые target/Description fields; отдельный read-back/preservation; mismatch → stop, без auto-repair/sync/publication |
| figma-naming-audit | figma-naming-audit / workflow-figma-naming-audit / `data/workflows/figma-naming-audit.yaml` (новый) | read-only, write; B + полный figma-naming; MCP identity/confirmed semantic role/scale suffix/dependents; точная approved map для write | semantic-role-required или неподтверждённая карта → request-input/stop; только имена из карты; сохранение @2x/@4x и отдельный allowlist/preservation read-back |
| migration-progress | migration-progress / workflow-migration-progress / `data/workflows/migration-progress.yaml` (новый) | **только read-only**; repository-readme + migration-roadmap; свежие pinned SHA, listing plans и факты merge/artifacts как inputs; no components/foundations/Figma | cloud/source mismatch, отсутствующий roadmap/plan/artifact → stop; вывод различает выполненные, кандидатные и pending steps; никакого write-mode |

Для каждого step в пакете 3 явно сопоставить required_inputs с mode inputs/предыдущими outputs, typed blockers и on_blocked stop/request-input. Типизированные projections должны покрывать выбранные факты; один только source_versions или digest не доказывает наличие содержимого. Source closure guard проверяет действительную доступность правил выбранного mode и применимых условий, а не тупое равенство списка всех registry IDs и static_sources.

**Подтверждённые allowed paths пакета 3 по F1–F6.** Это ещё не закрытый список всей реализации: F7 требует review master-spec и дополнения карты producer/output paths до начала пакета 3. Отсутствие producer не разрешает молча опустить generated checkpoint.

1. `system/manifest.yaml`: новые source/workflow entries и подготовленные profile declarations; пять route.workflow_source_id не включать, email records сохранять.
2. `data/workflows/library-maintenance.yaml`.
3. Новые `data/workflows/component-onboarding.yaml`, `data/workflows/figma-description-sync.yaml`, `data/workflows/figma-naming-audit.yaml`, `data/workflows/migration-progress.yaml`.
4. `scripts/lib/system-manifest.mjs`: F2 и регистрационная/coherence-защита новых declarations.
5. `scripts/lib/skill-context.mjs`: F1 и доказанный dependency status gate; поддержка typed source/mode failures.
6. `scripts/lib/context-bundle.mjs`: только если нужен доказанный projection/source coverage интерфейс F1; не менять HTML projections ради удобства.
7. `scripts/lib/workflow-registry.mjs`: explicit step/input/source consistency checks по F1/F3; текущая `schemas/workflows.schema.json` не расширяется без отдельного доказательства недостаточности.
8. `core/figma-library-standard.md`: только F6 status-owner clause.
9. `schemas/figma-naming.schema.json`, при требуемом version change `scripts/lib/figma-naming-foundation.mjs` и version metadata `data/foundations/figma-naming.yaml`: только schema/version preparation F4. До записи обосновать version по master-spec §10 и закрепить её RED-тестом; не назначать bump вслепую, foundation.status оставить shadow до пакета 5. Naming definitions не изменять.
10. Тесты `tests/foundation/system-manifest.test.mjs`, `tests/foundation/figma-naming-foundation.test.mjs`, `tests/workflows/structured-workflows.test.mjs`, `tests/skills/skill-context.test.mjs`, `tests/skills/skill-context-cli.test.mjs`, `tests/skills/maintenance-skill-boundary.test.mjs`, `tests/generation/context-bundle.test.mjs`; остальные предусмотренные пакетом 3 generator/Description tests запускать без правок, если их поведения не изменяются.
11. `docs/generated/naming-reference.md`: только автоматическая регенерация при фактическом изменении naming schema/version inputs; не вручную.
12. Этот implementation plan — evidence/journal. Roadmap — только соответствующая фактическому merge статусная синхронизация.

**Зависимость F7:** пакет 2 сравнивает obligations существующих и архивных workflows/checkpoints; после этого до кода пакета 3 оформляется архитектурное решение по master-spec §11.1. До его review и добавления точных producer/schema/manifest/output/test paths пакет 3 не начинается. Master-spec в пакете 1 не меняется, требование генерации не отменяется.

Нельзя по этой карте менять `data/components/*.yaml`, typography/spacing/assets values, renderer, email workflow/skills, bootstrap или Figma. Новый path вне списка, расширение schema, смена версии с архитектурным эффектом или component fact change требует отдельного impact/review до записи. Карта должна быть сверена с semantic evidence пакета 2 перед implementation пакета 3.

#### 6. Следующий gate

Этот PR сохраняет findings пакета 1. Его final cloud head проходит scoped docs validation/generation, ссылки и exact allowed-path/preserved-blob gate, затем независимый review. Final SHA, результаты и PR-ссылка фиксируются в PR body, чтобы не создавать self-referential commit SHA внутри собственного файла.

Пакет 2 начинается **только после** проверки/отдельного merge этого PR и команды пользователя. Он снимает свежие Figma-backed факты representative owners обоих roots и сравнивает relevant archival obligations. Ни один визуальный факт, live mutation gate, полный 11A или cutover этим пакетом не объявляется выполненным. Резервная ветка `backup/pre-structured-migration-2026-08-24` подтверждена и сохранена на `48e4d6c5f51e1ccd2311b52f5805616f183150a8`.

### 2026-10-01 — Пакет 2: read-only evidence, приемка остаётся открытой

**Основание:** `main@6c0bf7d0d3b1ca7909b692541883d2b0e9788709`. Повторная проверка main перед публикацией подтвердила тот же SHA. Пакет 1 слит через PR #108. [PR #109](https://github.com/flabenar-maker/e-mail/pull/109) остаётся отдельным draft для изменений карточек после cutover; его ветка и изменения не включены в этот пакет.

**Граница:** read-only Figma MCP, фактическое сравнение и журнал. Ни Figma, ни component/foundation facts, renderer, workflows, skills, письма и архив не изменяются. Облачная ветка создаётся от указанного main. Как в пакете 1, isolated exact-SHA snapshot используется только для проверки; этот журнал заменяет локальный рабочий ledger. Пакеты 3–6 не начаты.

#### 1. Выборка и метод

ID были прочитаны из canonical records и зафиксированы **до** запросов Figma. Файл: `8zka5bHkcrJVK9I9dKjnhC`, страница `5:6`.

| CUPIS ID | Component set | Desktop | Mobile | Проверяемая возможность |
| --- | --- | --- | --- | --- |
| email-header | 326:5159 | 230:3679 | 15:2037 | общий PNG-owner, центрирование, независимые display sizes, внешние отступы |
| banner-hero | 337:4460 | 230:3680 | 337:4359 | JPEG Fill, responsive image, связанная типографика, optional CTA/body |
| block-bullet-list | 337:4898 | 234:607 | 222:786 | повторяемые nested items, gaps, optional Alert/Button/Caption |
| block-transaction-success | 459:29177 | 459:29175 | 459:29176 | service composition, HUG/FILL, status/dependency, mixed text, properties |
| banner-fiscal-check-link | 502:25048 | 502:25046 | 502:25047 | service linked rows, отдельные export owners, собственный Fill |

Это representative выборка shared/marketing/service, **не аудит всей библиотеки**. Новые карточки PR #109 намеренно не включены. Dependency closure bundle содержит 11 records; пять root audits не объявляются отдельной полной сверкой всех вложенных records.

Получен один bundle `library-maintenance / read-only / both` с выбранными owners и foundations typography/spacing/assets/figma-naming. Resolver вернул ожидаемый `SKILL_ROUTE_PAUSED`; это не разрешение production maintenance и не отказ от разрешённой планом read-only проверки.

Canonical `scripts/figma/capture-contract-source.js` выполнен непосредственно через MCP для всех пяти sets. Transport обрезает длинные ответы, поэтому JSON передан кусками: длина и checksum полного serialized payload совпали между чтениями; склейка проверена перед JSON parse. Поля, capture errors и unsupported facts не удалялись ради результата. Свежие packets сняты 01.10.2026 18:46 UTC; отдельный read-back размеров — 18:51:42 UTC; определения styles/variables — 18:52:14–15 UTC. Для каждого set получен screenshot с обеими версиями.

Raw packets, screenshots, normalization evidence и полные logs остаются во временной локальной папке `C:/Users/flabe/AppData/Local/Temp/codex-package2-6c0bf7/evidence`. В PR входят только выводы и способ воспроизведения; после утраты временных файлов понадобится новое MCP-чтение, а не восстановление «доказательства» из журнала.

#### 2. Что подтвердилось и что не подтвердилось

Локальные targeted tests на исходном SHA: **35/35 PASS**:

- `tests/foundation/figma-contract-facts.test.mjs`;
- `tests/foundation/foundation-evidence.test.mjs`;
- `tests/characterization/component-documentation-boundary.test.mjs`;
- `tests/characterization/foundations-remediation-boundary.test.mjs`.

Но каждый свежий вызов `node scripts/audit-figma-contract-facts.mjs --repo-root SNAPSHOT --component-id ID --live MCP_PACKET` завершился **exit 1**:

| Root | Покрыто / source facts | Покрыто / contract facts | UNMAPPED | UNCOVERED | SOURCE_PATH_MISSING | MISMATCH | CAPTURE_UNSUPPORTED |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| email-header | 59 / 161 | 59 / 87 | 28 | 102 | 0 | 0 | 1 |
| banner-hero | 231 / 671 | 231 / 340 | 109 | 440 | 17 | 0 | 0 |
| block-bullet-list | 317 / 825 | 317 / 463 | 146 | 508 | 17 | 0 | 1 |
| block-transaction-success | 596 / 1349 | 596 / 820 | 224 | 753 | 36 | 4 | 0 |
| banner-fiscal-check-link | 262 / 729 | 262 / 356 | 94 | 467 | 16 | 0 | 0 |

Это количества диагностик/покрытия проверяющего механизма, **не число визуальных ошибок**. Unmapped/uncovered facts пока нельзя считать ни правильными, ни лишними. Отсутствие MISMATCH при неполном покрытии также не подтверждает полный contract.

Пять live Descriptions **5/5 точно совпали** с `renderFigmaComponentDescription`. Само совпадение короткой Description не подтверждает полноту implementation facts. Terra просмотрела пять Figma reference screenshots: явного дополнительного визуального расхождения не обнаружено. Это **не HTML-render/client regression**; письма в пакете 2 не собирались.

Foundation evidence проверен через существующий `compareFoundationObservation`, с временной нормализацией наблюдений, без изменения production source:

- **Typography:** 82 TEXT-node occurrences с фактическим `figma_style_id`, 14 различных live styles из 15 canonical; 410/410 сравнений пяти полей style definition прошли (family, Figma font style, size, line-height, letter-spacing). Значения взяты из live style definitions; expected — из точных `data/foundations/typography.yaml#/styles/<n>/...` pointers. Нормализация: `font_name.family/style` → `font.family/figma_style`, `font_size` → `font_size_px`, `PERCENT` → `percent`. Это проверка определения стиля и node→style identity, **не отдельное доказательство отсутствия локальных TEXT overrides** и не проверка всей библиотеки.
- **Spacing:** 6 точных value/binding observations прошли; например `15:2037 /paddingTop` → `roles/0/resolutions/mobile/value_px`, `VariableID:11:326`, 16; Desktop `230:3679`, `VariableID:510:20764`, 24. Также проверены selected Transaction nodes `459:28003`/`459:27423` и content-gap 16/24. У проверенных переменных один mode `11:0`.
- Остальные 24 foundation resolution observations **не проверены**, а не «не совпали»: для 20 нет точного provenance owner-node в выбранных пяти packets, для 4 нет live definition требуемой переменной. Значения/режимы не угаданы; scope не расширен до всей библиотеки.
- Asset owners/видимый состав проверены по capture и references; реальный экспорт файлов, pixel alpha и HTML clipping в этом пакете не проверялись. Naming definitions сопоставлены с архивом/активными модулями; массовый naming audit и rename не выполнялись.

Методика и pointers сохранены в локальном `package2-foundation-evidence-adapter.json`. Повторяющиеся 410 сравнения не являются 410 независимыми styles.

#### 3. Findings и влияние

**P2-F1 — capture / links / audit не имеют согласованного полного покрытия (blocker evidence).** Canonical capture пишет `text_style.text_auto_resize`, но links, например у Hero node `230:3637`, ожидают `/text_geometry/auto_resize`. Для `1045:18176` ожидается `/minimum_width_px`, которого capture не снимает. Дополнительные снятые поля `/clips_content`, `/corner_radii/*`, `/component_property_references/visible` дают uncovered facts. Audit обходит leaf-поля capture и требует owned links, а contract facts проверяет обратно; совпадение нескольких чисел не закрывает остальное.

Нужна согласованная карта значимых полей и один capture-профиль, который реально их выдаёт. Для каждого unmapped случая отделить: недостающий capture field; отсутствующий/неверный link; подтверждённый derived факт с отдельным evidence; узко обоснованное незначимое поле. Нельзя массово исключать defaults, менять значения contracts или подгонять live packet. Любое исправление provenance/links или contract факта должно иметь собственный impact и разрешённую область. Пути для будущего review: `scripts/figma/capture-contract-source.js`, `scripts/lib/figma-contract-facts.mjs`, `scripts/audit-figma-contract-facts.mjs`, соответствующие tests; `data/components/*.yaml` **не получают разрешение на запись** этим findings-пакетом.

**P2-F2 — четыре повторно подтверждённых width differences в Transaction-Success (decision required).**

| Node | Contract width | Live width | Live sizing H/V |
| --- | ---: | ---: | --- |
| 459:27425 text-details | 252 | 251 | FILL / HUG |
| 459:27428 status-container | 116 | 117 | HUG / FILL |
| 459:29356 status, Desktop | 116 | 117 | HUG / HUG |
| 459:29376 status, Mobile | 93 | 94 | HUG / HUG |

Это reference geometry узлов с зависимостью от текста/доступной ширины, а не доказательство необходимости задать фиксированную ширину в HTML. Повторное чтение исключает разовый испорченный transport, но не устанавливает причину изменения метрики. Не округлять и не менять числа автоматически. После сверки текстового содержимого, font metrics и роли reference dimensions отдельно решить, обновляется ли факт снимка или требуется уточнить его трактовку; дизайн и responsive behavior сохраняются.

**P2-F3 — карта потребителей типографики неполна (blocker impact analysis).** `docs/generated/typography-registry.md` выводит `Consumers: none` у всех 15 стилей. `typographyConsumers` в `scripts/lib/generated-docs.mjs` учитывает только collected typed foundation references; таких typography references в текущих records нет. При этом в component source snapshots и `figma_fact_links` есть `figma_style_id`: например, raw exact-SHA `marketing.yaml` содержит 309 вхождений поля/пути. Уточнение при последующей проверке: Hero Desktop node `230:3637` соответствует Desktop/Display; прежний пример Body/Large для этого узла был неточным. Семантические atomic facts и их owned links дополнительно разобраны в продолжении журнала ниже. Наличие snapshot ID **не превращает его автоматически в authoritative typed consumer link**. Поэтому «none» нельзя использовать для удаления стиля или оценки отсутствия влияния.

Это gap связки данных и generated projection, а не доказанная ошибка шрифта в HTML. До реализации нужно определить и review-нуть авторитетную связь style → component и способ подтверждения её свежими live facts. Затем RED-test воспроизводит потерянный usage на current-record/live-evidence case; GREEN требует согласованную модель и корректную generated карту. Не назначать заранее nonempty consumer старому snapshot как нормативу, не копировать архивные списки вручную и не угадывать стиль по размеру. Изменение модели/контрактов, если оно понадобится, требует отдельной области; при удалении стиля всё равно необходимо доказательство отсутствия фактического использования.

**P2-F4 — read-only numerical evidence не доказывает сохранность при будущей записи.** Capture не является полным pre/post preservation projection: в нём нет полного набора parent/ordered hierarchy metadata, property/Slot descriptions/settings и независимого разрешённого diff. Отдельного live write/read-back не было. Обязательства предыдущего checkpoint остаются в scope пакета 3: точные allowlists для description-only/rename, отдельная preservation projection и остановка зависимых writes после неожиданного diff. Нельзя объявлять этот gate пройденным только по текущим screenshots или digest.

#### 4. Архивные обязательства → нынешний владелец

Архив прочитан только как comparison baseline. Его прежние фразы «активный источник» не возвращают ему runtime-роль.

| Прежний источник / обязательство | Нынешний владелец и вывод |
| --- | --- |
| `Legacy/core/figma-component-naming-standard.md`: namespaces, casing, properties, Viewport, индексы, @2x/@4x | `data/foundations/figma-naming.yaml`, validator/generator, `docs/generated/naming-reference.md`. Definitions сохранены отдельно от recommendations и writes. Unknown semantics требует уточнения; ordinary rename сохраняет suffix. Status остаётся shadow — F4 пакета 1, не завершённый cutover. |
| Тот же naming standard: разрешение old → new, запрет структурных преобразований под видом rename, Slot/Template | Maintenance SKILL mutation boundary, component contracts и пакет 3 preservation gates. Новая публикация naming reference не разрешает массовую миграцию. Организационные/design-time рекомендации не становятся разрешением на новые блоки или изменение типов. |
| `Legacy/registry/email-typography-registry.md`: точные стили, пары и семантика | `data/foundations/typography.yaml`, `core/typography-standard.md`, generated typography registry. Параметры и семантика не должны жить в копии prose. Свежая выборка описана выше; все styles/все страницы этим аудитом не сертифицированы. |
| Тот же typography registry: consumers и проверка перед удалением Deprecated | **P2-F3:** generated consumer map сейчас непригодна для вывода «не используется». Проверка фактических связанных text segments/релевантных страниц не заменяется пустым generated списком. Исправление usage evidence — до соответствующих maintenance mutations. |
| `Legacy/workflows/library-maintenance-checkpoint.md`: scope/impact, точные Figma facts, permissions, no HTML writes, read-back, dependent sync | Core + maintenance SKILL сохраняют основные границы; route-specific orchestration и доказательство блокировки dependent writes ещё не выполнены — F1/F3 пакета 1 и P2-F4. Архивный длинный checkpoint не подключается обратно. |
| `Legacy/workflows/email-build-checkpoint.md`: new/fix/read-only, реальные D/M sources, immutable version, email.html + images, scoped QA/handoff | Активные `data/workflows/email-build.yaml`, building skill и email Core/renderer/orchestration владеют текущей последовательностью. Прежние REGISTRY/FIGMA VERIFIED prose fallback и общий Desktop-only экспорт не возвращаются: теперь typed selected contracts и contract-selected source_viewport. Это намеренная эволюция, не основание менять работающую сборку. |
| Оба checkpoint как удобные читаемые outputs | **F7 пакета 1 подтверждён:** master-spec §11.1 обещает generated checkpoints, но manifest/producer имеют только четыре других renderer IDs. Требование не отменено; producer/schema/manifest/output/test map нужно определить и review до пакета 3. |
| `Legacy/registry/email-component-descriptions-registry.md`: Header/Hero/Bullet/Transaction/Fiscal описания | Полные факты теперь в component records; `docs/generated/component-registry.md` — активная производная документация; compact Figma Description — другой output. Короткий текст не заменяет полный contract. Header fixed shared logo, Hero proportional Mobile, nested bullet/alert/button и service assets проверяются по нынешним records/live packets, а не по старому prose. |
| Архивные characterization-тесты: сохранность правил, а не вечный старый byte snapshot | Проверены архивные typography/spacing/component-registry/snapshot obligations и текущие typography-, spacing-evidence-, component-registry-, figma-contract-facts tests. Старый frozen Markdown baseline намеренно не восстановлен. Нового behavioral test для потерянной карты consumers нет; шаг 4 остаётся незавершённым до согласованного ремонта P2-F3. Перенос старого списка потребителей в ожидаемое значение теста недопустим. |

Ссылки на архив допустимы здесь, в плане аудита; в активные instructions/библиотеки никакой архивный контекст не добавляется.

#### 5. Граница готовности и следующий шаг

**Пакет 2 не имеет PASS по приемке.** Исследование выявило воспроизводимые blockers; 35 зелёных unit/characterization tests, 5 совпавших Descriptions и screenshots не перекрывают пять красных live fact audits.

До перехода к реализации пакета 3:

1. Разобрать P2-F1 до точной карты ремонта evidence; подтвердить область необходимых изменений и повторить свежий MCP audit. Не выдавать repair links за разрешение менять значения/дизайн.
2. Отдельно разрешить четыре P2-F2 после выяснения роли снимка и responsive sizing.
3. Определить исправление P2-F3 и behavioral test; не использовать `Consumers: none` как доказательство отсутствия использования.
4. Закрыть архитектурное решение F7 по generated workflow checkpoints и дополнить exact path map пакета 3. Не дублировать rules в новом ручном чек-листе.
5. Только после review этих gates возвращаться к пакетам 3–6. Ни один route не включён; PR #109 остаётся отложенным и не подмешивается.

Этот PR — только документация результатов. Для его финального cloud SHA выполняются scoped local validation/generated checks, разрешённый diff и независимое review; SHA и результаты фиксируются в PR body, без self-referential commit в документе. Полный code suite/HTML regeneration и GitHub Actions не запускаются. Merge не выполняется без отдельной команды.

### 2026-10-01 — Пакет 2: расширенная статическая проверка, MCP-сверка приостановлена

Пользователь разрешил продолжить ремонт P2 и проверить остальные компоненты, не включая ранее отложенные изменения карточек. Main повторно закреплён на `6c0bf7d0d3b1ca7909b692541883d2b0e9788709`; PR #109 остаётся отдельным draft. В этом продолжении изменён только журнал: production code, component/foundation values, Figma, письма и ручной context не менялись.

**Граница исключений.** Отложенные изменения `block-cards-images`, `block-icon-cards`, `block-icon-list` и затронутых child owners `card-image`, `card-icon` не классифицируются как неожиданное расхождение. Их raw records не удалены из инвентаризации и не объявлены прошедшими свежую сверку. Общие зависимости, в том числе `button-secondary`, не исключаются целиком. Реальное отделение изменённых полей от остальных требует живого чтения; статический анализ ниже его не заменяет.

**Свежий MCP недоступен.** Два read-only `use_figma` запроса к странице `5:6` завершились transport send error до получения данных. Поэтому на этом продолжении нет нового Figma evidence ни для одного компонента. Пять прежних packets остаются доказательством только ранее записанной выборки и времени. Проверку остальных компонентов по текущей Figma, локальных текстовых overrides, variable bindings и причин четырёх width differences не считать выполненной.

#### Статическая совместимость по всей зарегистрированной библиотеке

Terra Medium проверила точный canonical-byte архив указанного main: **61 record** (shared 17, marketing 26, service 18), **15 135 figma_fact_links**. Это проверка формы кода capture и путей mapping, не сравнение живых значений.

| Mapping path, который capture v1 не выдаёт в ожидаемой форме | Links | Records | Причина |
| --- | ---: | ---: | --- |
| `/text_geometry/*` | 728 | 36 | Resize/alignment размещены в `text_style`, а links ожидают отдельный `text_geometry` |
| `/text_style/font_weight` | 352 | 36 | Capture не снимает числовой font weight |
| `/text_style/figma_style_name` | 348 | 34 | Capture не получает имя связанного стиля |
| `/minimum_width_px` | 8 | 8 | Capture не снимает minWidth |
| `/fills/*/stops/*/color` | 6 | 1 | Capture выдаёт `gradient_stops`, а links ожидают `stops` |

Итого **1 442 заведомых несовпадения формы источника и mapping**. Это не 1 442 дефекта дизайна или неправильных числовых значения. Остальные 13 693 links лишь совместимы с формой capture: наличие нужного поля на конкретном узле и его значение ещё должны быть проверены через MCP. Counts records между строками пересекаются и не суммируются.

В статических counts сохранены пять связанных с PR #109 records: Cards-Images — 340 links / 16 gaps, Icon-Cards — 364 / 16, Icon-List — 807 / 65, Card/Image — 186 / 24, Card/Icon — 187 / 24. Здесь gaps означают только несовместимость capture-path, не оценку отложенного дизайна.

Полный локальный diagnostic inventory: `C:/Users/flabe/AppData/Local/Temp/codex-package2-6c0bf7/evidence/package2-capture-coverage-inventory.json`. В нём сохраняются точные owners и paths; файл временный, не runtime source.

#### Уточнение P2-F3: связь стилей уже есть в semantic facts

Во всех records найдены **364** links с source path `/text_style/figma_style_id`. Каждый указывает на atomic fact `figma-style-id` внутри `contracts`, с `value.type: string`, `figma-literal` provenance и совпадающим node ID. Все 364 значения разрешаются по точному ID в 15 canonical typography definitions. У 348 дополнительно есть согласованный sibling `figma-style-name`; отсутствие такого sibling у остальных 16 не означает mismatch.

Следовательно, сведения существуют не только в `source_variants`: версия P2-F3, которая сводила их к snapshot evidence, была неполной. Генератор действительно пропускает существующую форму atomic facts, учитывая лишь typed `foundation-reference`. Исправление можно прорабатывать как bounded projection repair с проверкой точного style ID, ownership/provenance и viewport; необходимость новой модели контрактов этими данными не доказана. Сопоставление по имени, похожим размерам и архивному списку потребителей не допускается. Semantic association не является доказательством актуального live usage или отсутствия локальных font overrides; перед изменением/удалением стиля требуется MCP-сверка.

Дополнительно исправлена неточность примера в журнале: Hero node `230:3637` соответствует **Desktop/Display**, `desktop-display`, Bold 32 px; точный style ID совпадает между semantic fact, canonical typography и прежним MCP packet. Ранее указанное Body/Large для этого узла неверно. Контракт и макет ради исправления текста отчёта не меняются.

#### Маршрутизация и следующий gate

Получен один расширенный `library-maintenance / read-only / both` bundle: все 61 component ID, четыре foundations, пять static sources. Resolver: exit 0, `paused`, `SKILL_ROUTE_PAUSED`. Это навигационный результат, не включение поддержки. Для byte-sensitive анализа использован canonical archive; EOL-normalized execution snapshot не принят за точный источник байтов.

Новые code/test fixes и полная тестовая серия в этом продолжении не выполнялись. Этот docs-only candidate проходит отдельный scoped local gate; точный head и результаты фиксируются в PR body. Приемка пакета 2 остаётся открытой. После восстановления MCP: снять остальные факты, классифицировать расхождения, определить точный repair diff capture/mapping/projection и выполнить его локальные regression checks; не уменьшать coverage и не менять значения ради PASS. Пакет 3 и cutover не начаты, PR #109 не подмешивается.

### 2026-10-01 — P2-F1: bounded capture-repair, локальный GREEN; живой gate открыт

Разрешённый repair реализован в `621d2c3c1e24f633badc2aec55db461e26d56559`. Добавлены пять групп ранее пропущенных/недоступных mapping-полей: text geometry, числовой вес шрифта с узла, имя по точному style ID, minWidth, stops градиента. Прежние v1 поля сохранены; дочерние слои и варианты обходятся в прежнем порядке. Ошибки style lookup, неизвестные связи и mixed значения не превращаются в guessed defaults; фактические локальные font overrides не подменяются definition стиля.

TDD: после исправления ошибок тестовой обвязки `e1c731d5944c4e1450d376f0779eaa412e12b44b` дал 6/6 ожидаемых RED именно по отсутствию нужных данных. На code candidate `621d2c3` новые cases стали GREEN 6/6. Terra Medium выполнила локально validator, generated-doc check и targeted capture/fact/CLI набор: 46/46 PASS, exit 0. Уже запущенный набор включал дополнительный validator-cli; его повтор не требуется для следующего docs-only шага. Полная test suite и GitHub Actions не запускались; merge не выполнялся.

Независимое review: критических проблем кода нет; Important по устаревшей фразе «код пока не исправляется» исправлен в текущем статусе плана. Minor отложен: отдельный тест счётчика cache lookup для повторного style ID и diagnostics каждого затронутого узла; текущие ошибки/значения и структура уже проверяются, отсутствие этого дополнительного теста не выдаётся за live evidence.

**Сохранность и приёмка:** component/foundation records, auditor, renderer, generated outputs, Figma и письма не изменены. Figma MCP во время ремонта не вызывался. Tests используют синтетический Plugin API fixture с ранее наблюдёнными literals, не подменяют живой packet. Полный Figma gate P2-F1 и пакет 2 остаются открытыми; очередь 39 и ограничения PR #109 сохранены. Новые capture-поля могут добавить честные uncovered diagnostics — их нельзя скрывать ради PASS.

Следующий шаг без Figma: P2-F3 (карта использования шрифтов) только в собственной ограниченной области; автоматически в эту правку не включён. После восстановления квоты выполнить точку возврата выше. Финальный SHA PR и scoped results после этого journal edit фиксируются в PR body.

### 2026-10-02 — P2-F3: generated-карта типографики восстановлена из semantic facts

Продолжение разрешённого offline ремонта во время лимита MCP. Один `library-maintenance / write / both / typography` bundle на pinned main `6c0bf7d0d3b1ca7909b692541883d2b0e9788709` вернул `paused / SKILL_ROUTE_PAUSED`; он использован только в границе этого миграционного плана, не для активации поддержки.

Генератор теперь разрешает существующие semantic style links по точному `figma_style_id`, atomic fact, node provenance и владельцу viewport/variant. Поддержка typed foundation references сохранена. В generated typography registry выводятся компонентный summary и точные позиции component/viewport/variant/element для **364 записанных associations, всех 15 стилей**. Повтор той же связи не создаёт дубль; разные варианты и элементы остаются отдельными. Неизвестная, неоднозначная или повреждённая semantic связь останавливает проекцию с `GENERATED_TYPOGRAPHY_CONSUMER_INVALID`; snapshot-only сведения и совпадения имён/размеров не используются.

TDD: после исправления ошибок тестовой обвязки `c7783a2e1903372b877ca43781f34f4882877557` дал 6 ожидаемых RED / 1 PASS именно по поведению проекции. Implementation `8c5158922ed18358dcaef34ff94ac163a7a7e427` исправляет только генератор; последующее узкое исправление synthetic fixture сохраняет реальный owner корневого узла. Новые проверки GREEN 7/7, весь `tests/generation/generated-docs.test.mjs` GREEN 14/14. Проверены unknown/ambiguous IDs, malformed/missing links, wrong node/variant ownership, distinct tuples, typed references, snapshot-only отсутствие потребителя и сохранность local numeric overrides.

Generated typography registry пересобран каноническим генератором, не вручную. Параметры и связи component/foundation records не менялись; HTML renderer, Figma, письма, навыки и routes не менялись. Три остальных generated outputs побайтово совпадают с исходными. Независимое code review не нашло критических проблем; замечание о старом generated artifact закрывается его пересборкой. Финальный exact SHA, artifact review и scoped local gate фиксируются в PR body после последнего journal commit; повтор полного test suite ради правки журнала не требуется. Перед отдельно разрешённым merge кода остаётся обязательный полный локальный gate точного финального коммита.

**Граница результата:** исправлена recorded consumer projection, а не доказано текущее live usage в Figma. Пустой recorded список не даёт разрешения удалить стиль. P2-F1 live gate, очередь 39, четыре P2-F2 width differences и F7 остаются открытыми. Пакет 2 не принят, PR #110 не слит, пакет 3/cutover не начаты. PR #109 и ручной context не затронуты.

**Дальше без MCP:** согласованная подготовка F7 — карта producer/schema/manifest/output/tests для generated workflow checkpoints. После восстановления квоты — обязательная точка возврата P2 выше; offline GREEN не отменяет ни одного её пункта.

### 2026-10-02 — P2: 37 новых canonical packets, повторная остановка по лимиту

**Разрешение и границы.** Пользователь разрешил продолжить свежую сверку исправленным сборщиком и потребовал остановиться при повторном лимите с фиксацией результата в плане. Main повторно подтверждён на `6c0bf7d0d3b1ca7909b692541883d2b0e9788709`; candidate PR #110 закреплён на `212cb6d6dc7e7dac11177701bd71009e00dba8d2`. Его diff к main — прежние шесть paths; component/foundation contracts не менялись. В этом продолжении постоянная запись — **только этот план и описание PR**; никакие fixes фактов, кода или Figma не выполнялись.

**Ход чтения.** Один `library-maintenance / read-only / both` bundle для 61 record и четырёх foundations получен на exact candidate, `paused / SKILL_ROUTE_PAUSED`; это scoped migration audit, не включение production maintenance. Canonical capture выполнен через MCP с `5:6`; данные передавались chunks по 14 000 символов. Длина/hash полного payload совпали между частями; полные packets отдельно проверены перед JSON parse и сохранением. Первое чтение: **01.10.2026 21:20:44 UTC**, последнее полное: **21:24:41 UTC**. В **21:24:45 UTC / 02.10.2026 00:24:45 МСК** MCP вернул «You've reached the Figma MCP tool call limit for your Full seat on the Professional plan». С этого момента MCP больше не вызывался.

Ниже именно **полученные полные packets**, а не компоненты с успешной приемкой. `capture_errors` — ограничения/смешанные значения сборщика, не автоматически дефекты дизайна.

| CUPIS ID | Figma owner | Variants | Raw capture errors |
| --- | --- | ---: | ---: |
| `banner-app-download` | `337:6569` | 2 | 11 |
| `item-bullet` | `337:4958` | 2 | 0 |
| `block-bullet-list` | `337:4898` | 2 | 2 |
| `block-contact-support` | `472:16999` | 2 | 8 |
| `item-notification` | `1024:19285` | 2 | 4 |
| `block-content` | `337:4766` | 2 | 6 |
| `block-info-alert` | `337:5041` | 2 | 2 |
| `block-instruction-steps` | `510:16701` | 2 | 8 |
| `details-operation-plain` | `497:26103` | 2 | 0 |
| `details-suspicious-operation` | `497:25955` | 2 | 0 |
| `block-personal-data-update` | `497:26055` | 2 | 10 |
| `details-receipt` | `502:24640` | 2 | 0 |
| `block-receipt-info` | `502:24695` | 2 | 10 |
| `item-step` | `337:5039` | 2 | 0 |
| `block-steps` | `337:4491` | 2 | 6 |
| `block-transaction-error` | `459:30151` | 2 | 10 |
| `details-operation` | `477:21327` | 2 | 0 |
| `block-transaction-success` | `459:29177` | 2 | 10 |
| `details-transfer` | `484:20761` | 2 | 0 |
| `email-footer` | `333:7477` | 2 | 10 |
| `email-footer-legal` | `499:2431` | 2 | 0 |
| `email-header` | `326:5159` | 2 | 2 |
| `email-template` | `1102:8` | 2 | 0 |
| `icon-bank-card-2-line` | `1009:2505` | 1 | 1 |
| `icon-fingerprint-2-line` | `491:22370` | 1 | 1 |
| `icon-global-line` | `1009:2506` | 1 | 1 |
| `icon-lock-password-fill` | `491:22369` | 1 | 1 |
| `icon-mail-fill` | `491:22372` | 1 | 1 |
| `icon-mir-logo` | `946:25485` | 1 | 1 |
| `icon-shopping-basket-2-line` | `946:25480` | 1 | 1 |
| `icon-smartphone-fill` | `491:22371` | 1 | 1 |
| `icon-user-follow-fill` | `491:22375` | 1 | 1 |
| `icon-user-unfollow-fill` | `491:22376` | 1 | 1 |
| `nps-options` | `1084:16995` | 4 | 0 |
| `card-image` | `911:4132` | 2 | 0 |
| `block-cards-images` | `326:5806` | 2 | 0 |
| `card-icon` | `326:5580` | 2 | 4 |

Итого 37 records = 34 обычных + 3 связанных с PR #109. `block-icon-cards` прерван на offset 28 000: partial не сохранён как canonical packet и не аудирован. `block-icon-list` ещё не читался. Повторное чтение прежних 22 не начато. Таким образом, 59 разных owners имеют packets двух сессий, но только 37 сняты исправленным capture; **24 остаются без такого свежего packet**. Это не 59/61 успешно проверенных контрактов.

#### Локальное сравнение полученного

Terra Medium выполнила canonical `audit-figma-contract-facts` на exact snapshot `212cb6…` для всех 37 полных packets и сравнение metadata Description с текущим renderer. Первые 15 не прогонялись повторно без изменения их файлов; остальные 22 добавлены к итоговой сводке. GitHub Actions/PR Checks, полный test suite, сборка HTML и Figma writes не выполнялись.

| Область | Source facts / linked | Contract facts / linked | Exact mismatches |
| --- | ---: | ---: | ---: |
| 34 обычных records | 27 644 / 11 644 | 15 239 / 11 644 | 4 |
| 3 deferred owners PR #109 | 1 943 / 713 | 960 / 713 | 8 |
| Всего 37 | 29 587 / 12 357 | 16 199 / 12 357 | 12 |

`linked` — покрытие связями, а не число всех совпавших значений. **Description 37/37 совпадают** с renderer; это отдельно от contract acceptance.

Сохраняются diagnostics: `FIGMA_FACT_UNCOVERED` **17 230**, `CONTRACT_FACT_UNMAPPED` **3 864**, `FIGMA_CAPTURE_UNSUPPORTED` **14**, `EVIDENCE_LINKS_NOT_IN_CONTRACT` **11**, `FIGMA_VARIANT_MISSING` **20**, `FIGMA_VARIANT_UNDECLARED` **10**, `FIGMA_VIEWPORT_UNKNOWN` **10**, exact value mismatches **12**. Эти счётчики отражают неполноту покрытия и неоднозначное владение вариантами, не десятки тысяч ошибок дизайна. Без устранения/обоснованной классификации покрытия пакет не имеет PASS. Raw capture_errors отдельно: **113 = 67 ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW + 46 MIXED_VALUE**; они не выброшены из evidence.

**Что подтвердилось в ремонте capture:** на этих 37 packets `SOURCE_PATH_MISSING = 0`. `text_geometry` получена для 514 TEXT nodes; числовой `font_weight` и exact linked style name — для 514/514 (null 0). `minimum_width_px` получен на 1 866 узлах, применимый non-null — на 5. Сняты 14 gradient paints / 30 stop entries. Это наблюдения полей, включая вложенные повторения, не 514 независимых стилей и не полная приемка P2-F1. Ремонт чтения заработал; оставшиеся проблемы покрытия/variant ownership им не решены.

#### Точные расхождения: ожидаемое в контракте → полученное в Figma

| Owner / viewport | Node | Source path | Контракт → Figma | Граница решения |
| --- | --- | --- | --- | --- |
| block-transaction-success / Desktop | `459:27425` | `/reference_dimensions/width` | 252 → 251 px | P2-F2; FILL horizontal / HUG vertical, не назначать фиксированную HTML-ширину |
| block-transaction-success / Desktop | `459:27428` | `/reference_dimensions/width` | 116 → 117 px | P2-F2; HUG horizontal |
| block-transaction-success / Desktop | `459:29356` | `/reference_dimensions/width` | 116 → 117 px | P2-F2; HUG horizontal |
| block-transaction-success / Mobile | `459:29376` | `/reference_dimensions/width` | 93 → 94 px | P2-F2; HUG horizontal |
| block-cards-images / Desktop | `398:7570` | `/reference_dimensions/height` | 1242 → 1320 px | Deferred PR #109 |
| block-cards-images / Desktop | `398:7571` | `/reference_dimensions/height` | 1218 → 1296 px | Deferred PR #109 |
| block-cards-images / Mobile | `398:7598` | `/reference_dimensions/height` | 2021 → 2087 px | Deferred PR #109 |
| block-cards-images / Mobile | `398:7599` | `/reference_dimensions/height` | 2005 → 2071 px | Deferred PR #109 |
| card-icon / Desktop | `260:662` | `/layout/counter_axis_alignment` | min → center | Deferred PR #109 |
| card-icon / Desktop | `260:662` | `/layout/primary_axis_alignment` | center → min | Deferred PR #109 |
| card-image / Mobile | `1015:18459` | `/reference_dimensions/width` | 236 → 252 px | Deferred PR #109; link FILL не разрешает автоматическое принятие любого размера |
| card-image / Desktop | `1015:18276` | `/reference_dimensions/width` | 176 → 232 px | Deferred PR #109; тот же принцип |

Четыре P2-F2 differences повторно видны на свежем packet. Их причина/решение остаются открытыми: reference geometry при HUG/FILL не равнозначна требованию fixed width в письме. Числа не исправлялись. Восемь differences внутри deferred owners сохранены для будущего scoped refresh; новые Show Button, link FILL и icon wrapper/alignment не подмешиваются в P2. Владельцы целиком не исключались, остальные их факты также прошли текущий audit. Новых typography value mismatch в сопоставленной части не выявлено; это не утверждение о всех непокрытых текстовых фактах.

**Локальные evidence:** `C:/Users/flabe/AppData/Local/Temp/codex-package2-6c0bf7/evidence/full-library-20261002/` — `capture-manifest.json`, 37 canonical packets + 37 metadata; `audit-212-final-37-summary.json`, `audit-212-final-37-exact-mismatches.json`, `audit-212-final-37-description-summary.json`, `audit-212-final-37-technical-classification.json`, `audit-212-final-37-coverage-supplement.json`. Полные logs остаются там же и в GitHub не попадают. При потере временных данных нужно повторное MCP-чтение.

**Следующее действие:** после восстановления лимита продолжить актуальную точку возврата в начале плана: два недочитанных owners → повторное чтение прежних 22 → завершение coverage/foundation/visual evidence и отдельное решение P2-F2/F7. В этом продолжении F7 и пакет 3 не начинались. PR #110 остаётся draft, merge не разрешён этой командой. Ручной context, PR #109, Figma, контракты и письма сохранены. Scoped validation и review документационного продолжения фиксируются в PR body на его точном final SHA, без заявления о полном release gate.
