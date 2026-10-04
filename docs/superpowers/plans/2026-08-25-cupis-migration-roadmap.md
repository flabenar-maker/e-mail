# CUPIS Structured System Migration Roadmap

Актуальность: 2026-10-05. Сверено с `main@618d124df0a664c84d23a724ba50ef2b324e9b97`; незавершённая работа в PR не считается слитой. Текущий объём: локальный Codex, поддержка системы и сборка писем; Web-выдача и проектирование новых блоков отменены.

## Единый актуальный список

Этот roadmap — единственная глобальная очередь. В корне `plans/` остаются он и подробный план текущего cutover; адресные технические под-планы текущего пакета лежат в [cutover/](cutover), без собственной глобальной очереди; завершённые implementation plans находятся в [archive/](archive). Исторические чекбоксы не создают новых задач. Для восстановления работы достаточно свежих manifest, этого roadmap и подробного плана текущего пакета; отдельный ручной context-файл больше не используется.

| Работа | Фактический статус | Зависимость и подробности |
| --- | --- | --- |
| Этапы 1–10 и 10A: foundations, контракты, документация, renderer, навыки и локальный router | Завершены в `main`; история и результаты — ниже | Поддержка ещё не активирована; готовность сборки не подменяет её cutover |
| 11A / пакет 1: карта источников и переключения | Слит [PR #108](https://github.com/flabenar-maker/e-mail/pull/108) | [План cutover](2026-10-01-cupis-final-maintenance-cutover.md), журнал пакета 1 |
| 11A / пакет 2: Figma-backed доказательство и сопоставление обязательств | В работе, draft [PR #110](https://github.com/flabenar-maker/e-mail/pull/110); пакет не принят и не слит | [Header-owned artwork](2026-10-01-cupis-final-maintenance-cutover.md#p2-header-owned-artwork-2026-10-05) реализован на `3b7ba245da389b5f5e9d0e368427d32ffa028b75`, final local 1625/1614/11 FAIL; remote source identity внутри actual owner ещё не доказан. Shared никогда не отдельный description/capture/audit gate. Далее owner-tree remote identity, затем appearance/export separation, nested HTML/overrides, gradient/mixed text; не P3 |
| 11A / пакет 3: workflow, authorization и handoff | Не начат | После завершения и приёмки пакета2; использовать реализованный F7 producer для обновлённых/новых workflow outputs, не возвращать ручные checkpoints |
| 11A / пакет 4: regression сборки писем и итоговая приёмка | Не начат | После пакета 3; локально доказать сохранность двух активных email routes |
| 11B / пакет 5: включение готовых маршрутов поддержки | Не начат; отдельное разрешение | После успешного 11A; rollback, merge, разрешённая локальная синхронизация навыков и clean-context приёмка |
| Обновлённые карточные блоки | Отложены; план только в draft [PR #109](https://github.com/flabenar-maker/e-mail/pull/109), не в `main` | [Точный план](https://github.com/flabenar-maker/e-mail/blob/bdb51edbac918255ac941f16f2c37645a15f3190/docs/superpowers/plans/2026-10-01-cupis-marketing-cards-post-cutover-sync.md); после слитого и принятого пакета 5, по отдельному разрешению, до пакета 6 |
| 11C / пакет 6: итоговая очистка переходных артефактов | Не начат; отдельное разрешение | После стабильного cutover и согласованного follow-up карточек; не равен текущей организации папки plans |
| Ссылки, подчёркнутые фрагменты и кнопки | Правила согласованы; реализация не начата; постоянные URL приложения/футера ожидаются от маркетологов | После приёмки P2 подготовить отдельный implementation plan по [единой очереди ссылок](2026-10-01-cupis-final-maintenance-cutover.md#links-and-underlines-follow-up); единый источник подтверждённых постоянных адресов, не подставлять отсутствующий URL и не менять порядок cutover |

**Ближайшая точка возврата:** 11A/P2, draft PR #110 без merge. [Header-owned artwork](2026-10-01-cupis-final-maintenance-cutover.md#p2-header-owned-artwork-2026-10-05) реализован на `3b7ba245da389b5f5e9d0e368427d32ffa028b75`: fresh Header-only admission и23 verified proofs, но local full 1625 total /1614 PASS /11 FAIL; Windows не запускался. Shared не описывается, не снимается и не аудируется отдельно — конкретные элементы проверяются внутри блока. Template остаётся источником размеров/фона оболочки, не блоком содержимого. Исторические восемь-owner counters не переносятся в текущий acceptance gate; raw reports остаются неизменными. Следующий bounded пункт — remote publication identity на actual consuming INSTANCE без target capture; сначала карта producer/checker/tests и owner evidence. После нового exact local PASS — appearance/export separation; затем nested HTML/overrides, gradient/mixed text. Step4 и весь P2 открыты; P3/#109/URL implementation/cutover/merge/local skill sync не начинать.

**История unit/icon → T1/S1 → freshness/native-source ремонта (не текущая команда повторить сбор):** в пакете 2 уже выполнен read-only разбор причин diagnostics на candidate `23c02336e578a38730ab57ebaf0f8faf2763e67f`. 4 828 из 4 863 unmapped contract paths — единицы измерения; отдельно разобраны остальные 35, source-only icons, отсутствующие owned links и nested artwork boundaries. В [плане cutover](2026-10-01-cupis-final-maintenance-cutover.md) зафиксирован согласованный bounded unit/icon repair на code SHA `78aaf0b9`: targeted 55/55, full Node 744/744, validator/generation и Windows gates PASS. Убраны только доказанные unit gaps и 52 ложных topology diagnostics; остались 62 unmapped contract paths (27 units + 35 non-unit), 21 640 uncovered source facts и прежние 17 owners без links. 28 mismatches, 20 missing paths и 18 unsupported reports сохранены; P2 не принят. Свежая сверка 17 shared-записей выполнена; пользовательская классификация зафиксирована в Core: Shared — вспомогательные элементы, Template — источник параметров корневой оболочки, не отдельный блок. Карта значимых shell/dependency связей по всем 17 ролям выполнена и записана в плане cutover; shell background/desktop width/inset совпали, запрет самостоятельного рендера Shared source-only работает. Обнаружены T1 (Template→foundation) и S1 (Shared→asset-owner) gaps в доказательном представлении, не текущая ошибка дизайна. Направление и [письменная спецификация T1/S1](../specs/2026-10-02-cupis-template-shared-evidence-links-design.md) одобрены. [Implementation sub-plan из семи задач](cutover/2026-10-02-cupis-template-shared-evidence-links.md) подготовлен внутри P2. План подтверждён. Задача 1 выполнена в кандидате PR #110: schema 2.2.0, typed metadata и offline reference validation; 108/108 scoped tests в пяти файлах и validator/generated check PASS на SHA `7adff9c75d6f0fb319f9ab5cb8e8499177a58ccb`. Задача 2 также выполнена: capture 1.1.0, async source identity и проверяемые canonical/session inputs; 161/161 scoped tests и validator/generated check PASS на `98b8b7633d689badc21ecf15241fdd54a9cbc30d`, полный итоговый tree 236/236 blobs подтверждён. Задача 3 выполнена: pure T1 checker с независимым набором девяти shell assertions; 152/152 scoped tests, validator/generated check PASS на `f0237a32727a54a8c5b503918cdd8bcc40e435ee`, raw238/238. Задача 4 выполнена: actual nested dependencies/overrides и confirmed/possible impact; 191/191 scoped tests, validator/generated check PASS на `931c764a03215213448b67d7aa3b56c21aabc3dc`, raw238/238. Задача 5 выполнена: общий auditor/CLI сохраняет все scalar diagnostics, проверяет точный session packet и canonical targets; 318/318 scoped tests, validator/generated check PASS на `59e8bbfbd50cadfa5db05e698201bd82fab2d979`, raw239/239. Задача 6 выполнена в кандидате: 29 обязательных служебных связей подтверждены свежим canonical MCP-сеансом, включая оба Mobile Header instances; generated projection и scoped локальная изоляция проверены. Ошибка определения Mobile asset boundary устранена без изменения дизайна или export contract. Итоговая проверка задачи 7 выполнена в кандидате; ограниченный ремонт T1/S1 принят в его собственной области, но P2 целиком не принят. Следующий read-only пункт выполнен: на candidate 2e5d4a свежие полные packets 14 owners/targets не дали numeric mismatches в existing mappings; 15 non-unit facts, Contact-Support и nested artwork получили точную классификацию. Исходные host/Figma timestamps обнаружили clock-domain blocker свежести — links этого сеанса не приняты. Детали и граница следующего targeted proof repair записаны в новом журнале плана cutover. По следующему разрешению выполнен bounded freshness repair: общий validator, session 1.1 / request-bound capture 1.2; новые 14/14 packets на code 2c49bc приняты по echo и раздельным host/Figma timelines, без retimestamp. Это не приёмка компонентов: combined audit остаётся 0/14 из-за прежних значимых proof/coverage/capture diagnostics. Точные результаты и граница записаны в свежем журнале cutover; local final gate фиксируется на точном final commit PR #110. Следующий bounded пункт — ownership и direct/cross-source/derived/normative proof, затем canonical mappings без изменения визуальных значений. F2 reference widths, foundation/binding evidence и F7 остаются открытыми. P3, #109, cutover и merge автоматически не начинаются. Значения, HTML и export policy сохраняются, Shared не становятся HTML-блоками. Закрыт только описанный scope T1/S1, не весь P2. Дальнейшие canonical values/links, alias/nested-artwork policy и остальные исправления требуют отдельного согласования. Затем — закрытие significant coverage, F2, foundation/binding/visual evidence и F7. Не повторять прежний сбор 24 owners, не возвращать отложенный #109 в текущий ремонт и не начинать P3. Сбор 61/61 и группировка диагностик не означают 61 успешно проверенный контракт.

**Текущий возврат после remote-source repair (03.10.2026):** свежие семь packets на production `9d1f9c2` подтверждают пять собственных Notification/Feature links, 10 nested boundaries и все восемь зависимостей. Внешний glyph теперь имеет отдельную Shared source-only reference и проверяемый publication key; это не HTML-блок или новый экспорт. Numeric mismatch0; scalar/capture diagnostics сохраняются. На `32b059f4` targeted277/277 PASS; generated registry механически обновлён до 62 records. Полный exact gate `5b00f3` выявил8 failures: пять устаревших expectations и три отсутствующих source-only coverage; validator/generated check PASS. Разрешённое дополнение выполнено в кандидате: clean RED наa6c125 (101/106,5 ожидаемых row-missing failures), ровно один source-only registry row наebf910 и test-only234520 дали targeted106/106 PASS. Исторические61 mapping IDs, Shared17/service digests и13local guards сохранены; catalog/covered62, ready interpreter38, missing0; remote standalone запрещён. Итоговое independent review и полный exact local gate относятся к final cloud commit после журнала; их actual receipt/SHA публикуется в PR #110 без переписывания historical failures. Исполнение и границы записаны в плане cutover. Затем direct/cross-source/derived/normative facts, F2/F7 и evidence; P2 не принят, P3/#109/merge/cutover не разрешены. Точные pins, сохранность и ограничения — в новом журнале плана cutover.

**История read-only сверки 03.10.2026 перед согласованным fact-proof ремонтом:** на exact `9af5fad12c044c6173c4686cbd7e46b6333ec38a` новый MCP session принял7/7 packets; existing scalar mappings дали mismatch0, но сохраняются18 unmapped leaves (15 non-unit +3units) и прежние coverage/capture diagnostics. Подтверждены точные Header source/consumer geometry, адаптивные source facts Hero/Secondary, gradient colors и6/6 Contact-Support style ID/name definitions. Актуальные компактные Description больше не содержат пяти старых sections, на которые ссылается provenance HTML25°/auto/cover: следующий ремонт должен исправить proof, не значения, дизайн или компактные Description. Прежний полный local gate1048/1048 относится только к9af; этот шаг — read-only diagnosis и docs-only journal, не новый full gate или приёмка P2. Точная классификация, отсутствие Product-Logo packet в узкой session, raw evidence и граница следующего согласования — в свежем разделе [плана cutover](2026-10-01-cupis-final-maintenance-cutover.md). Следующий шаг на момент этой historical записи был согласовать direct/cross-source/derived/normative proof method; теперь он одобрен и bounded repair выполнен, включая новый MCP/read-back на7cf. F2/binding/visual/F7 остаются вP2. P3/#109/activation/merge/cutover не начинаются.

**Последняя выполненная часть P2 (04.10.2026):**117px принят без нового production изменения. Bounded links/dispositions сохранены; единственный scoped bundle04e и fresh session5/5 остаются закреплены на04e, не перепиниваются на F7. Полный1838-row read-only inventory сохранён с exact values/ownership; это не PASS source coverage. F7 RED9/9expectedFAIL → product6/9 → correction517f9/9GREEN; adjacent147/154 выявил7stale1.2/4 expectations. В6bc опубликованы ровно3test-only поправки и2mechanical outputs; старые4docs побайтово прежние. Independent bounded review без новых findings; wholeP2/merge readiness не заявлена. Gate0973 выявил3Node fixture failures и1Windows stale fixture; product checks PASS. Test-only helper/bootstrap repair7318 дал WindowsPASS; CLI closure fixture исправлен real-generator refresh:0b9 targeted14/14PASS, full1110/1111/1FAIL обнаружил generated-comparison cleanup list4 вместо6. Исправляется только removal scope этого negative test по точному manifest, assertions сохраняются; Windows0b9 оба gates PASS. Новый exact final retry receipt — в PR #110; [текущий подробный журнал](2026-10-01-cupis-final-maintenance-cutover.md#текущая-точка-возврата-p2--точная-карта-remaining-proof-и-f7-03102026).

**Предыдущая точка внутри P2 (03.10.2026):** bounded fact-proof repair997 и F2 widths894 завершены в кандидате. Свежая read-only session на9c3 приняла3/3 native packets; existing value mismatches0, но сохранены Transaction capture10/required-links4/uncovered737, Badge251, Details780.15/15 typography definitions (75 comparisons),22 FLOAT definitions и24 owner bindings/value/mode rows совпали;20 binding rows вне deferred #109,4 карточных rows не входят в приёмку.3/3 source screenshots без видимых расхождений — не HTML/client regression. Архивные naming/typography/checkpoints/registry/characterization obligations сопоставлены с нынешними владельцами; F7 generated-checkpoint producer остаётся отсутствующим. Четыре links локализованы в local partner-badge и remote marafon; mixed text доказан range observations, исходные diagnostics не скрыты. **Дальше:** exact impact/map для remaining links/native proofs, затем F7 producer/schema/manifest/output/tests decision доP3. Нет новых contract/code/Figma/email изменений; опубликованы только2plans. Historical full1075/1075 относится к997, не9c3 или docs-only SHA; fresh evidence9c3 не repin. P2 не принят/не слит; P3/#109/activation/merge/cutover не начинать. [Подробная текущая точка](2026-10-01-cupis-final-maintenance-cutover.md#текущая-точка-возврата-p2--bounded-nativebinding-и-архивная-сверка-03102026).

**Открытые PR:** #110 — текущая работа; #109 — отложенный follow-up; [#90](https://github.com/flabenar-maker/e-mail/pull/90) помечен do-not-merge/superseded и не входит в очередь. [#60](https://github.com/flabenar-maker/e-mail/pull/60) уже слит 16.09.2026 (`acff87ac684ef502df1f2d70318c8f9ef0a62333`); исследование не является ожидающим слияния gate.

**Не входит в очередь:** Web-выдача и проектирование новых блоков отменены, а не завершены. Проверка реальных почтовых приложений/Altcraft (8 / Package 10D) исключена по отсутствию доступа, не выполнена и не возвращается автоматически. Её ограничения и результаты исследований сохранены в исторических планах; браузерная приёмка не доказывает real-client совместимость.

**Порядок интеграции документов:** организация plans слита PR #111; PR #110 согласован с ней двухродительским commit `51da5756777acacbd04ea1380568c93577456380` с сохранением пяти P2 repair/test/generated blobs и полного журнала. Отложенный #109 ещё требует сверки с актуальными планами перед отдельным разрешённым исполнением. Не возвращать старые статусы, корневые пути архивных планов или удалённый ручной checkpoint. Слияние любого PR требует отдельной команды.

## Назначение

Этот файл — единый источник порядка и статуса этапов перехода CUPIS email-системы. Он не заменяет [master-спецификацию](../specs/2026-08-24-cupis-structured-email-system-design.md) и не дублирует подробные implementation plans отдельных этапов.

Master-спецификация владеет архитектурными решениями. Roadmap показывает только последовательность, зависимости и текущий статус. Перед началом каждого технического этапа создаётся отдельный implementation plan с точными файлами, проверками и commits.

## Статусы

- `[x]` — этап завершён и находится в `main`;
- `[ ]` — этап или пункт ещё не завершён;
- каждый технический пакет выполняется в отдельной branch и PR;
- следующий этап начинается после проверки и слияния предыдущего;
- если этап требует нового архитектурного решения, сначала обновляется master-спецификация.

## Обязательная сверка прогресса

Перед любым ответом о текущем этапе, завершённой работе или следующем шаге:

1. закрепить актуальный SHA ветки `main`;
2. повторно открыть этот roadmap из `docs/superpowers/plans/`;
3. проверить состав папки `docs/superpowers/plans/` и наличие связанного implementation plan текущего этапа;
4. сверить отмеченный статус с фактически слитыми в `main` артефактами;
5. не восстанавливать статус только по памяти чата.

Исторические пункты ниже описывают состояние на момент реализации. PR #69/#70 временно изолировали прежний контур и остановили маршруты; позднее этап 10 включил два email routes. Сейчас сборка и изменение писем активны, пять маршрутов поддержки остановлены. Старые формулировки «действующий Markdown-источник», «все маршруты остановлены» или «shadow» в завершённых этапах не описывают текущий рабочий путь. Архивные планы сохраняют решения, но не используются как команды продолжения.

Этап отмечается завершённым только после его слияния в `main`. После слияния в roadmap добавляются фактическая ссылка на implementation plan или PR и новый статус. Если подробный plan ещё не создан, следующим действием является его создание и review, а не начало реализации.

## Последовательность

### 1. Master-спецификация и первый implementation plan

- [x] Зафиксировать целевую архитектуру, ответственность источников и порядок миграции.
- [x] Подготовить первый технический план foundation-этапа.

Результаты:

- [master-спецификация](../specs/2026-08-24-cupis-structured-email-system-design.md);
- [foundation implementation plan](archive/2026-08-24-cupis-structured-system-foundation.md).

### 2. Системный foundation

- [x] Ввести `system/manifest.yaml`, строгую schema, validation CLI и bootstrap cutover.
- [x] Подключить CI и characterization-защиту области миграции.
- [x] Сделать manifest единственной машинно-читаемой картой источников, routes, bundles, skills и plugins.

Этап реализован в [PR #17](https://github.com/flabenar-maker/e-mail/pull/17). CI был частью исторического результата; [PR #67](https://github.com/flabenar-maker/e-mail/pull/67) убрал GitHub Actions, и текущие проверки выполняются локально.

### 3. Typography foundation pilot

- [x] Создать и проверить shadow-источник типографики.
- [x] Сохранить Markdown-реестр текущим рабочим источником до общего cutover.

Подробный план: [typography foundation pilot](archive/2026-08-25-cupis-typography-foundation-pilot.md).

### 4. Spacing foundation

- [x] Зафиксировать золотое правило отступов только для поддержки и разработки библиотеки.
- [x] Добавить exact-only resolver и проверки.
- [x] Не подключать spacing foundation к HTML-вёрстке конкретного письма.

Подробный план: [spacing foundation](archive/2026-08-25-cupis-spacing-foundation.md).

### 5. Остальные foundations — завершён

Этап выполняется двумя последовательными подэтапами. Каждый подэтап получает отдельный implementation plan, branch и PR. Подэтап 5Б начинается только после слияния 5А.

#### 5А. Assets foundation — завершён

- [x] Создать и согласовать подробный implementation plan assets foundation.
- [x] Зафиксировать действующие asset/export rules из `core/email-figma-prompt.md` и component contracts как comparison baseline; не удалять старый активный источник до общего cutover.
- [x] Перенести общую структурированную модель в `data/foundations/assets.yaml`: source mode, export boundary, display mode, scale, format, alpha, Fill/background policy, crop, proportions и presentation-only clipping.
- [x] Создать `schemas/assets.schema.json`, semantic validation и characterization-проверки эквивалентности baseline.
- [x] Объявить assets foundation и schema в manifest как shadow-источники. Не подключать foundation параллельно к действующим email-build bundles до этапа generated context bundles.
- [x] Сохранить конкретные владельцы, границы экспорта, display-размеры и компонентные исключения в component contracts; не переносить их в общий foundation.
- [x] Не менять Figma-дизайн, descriptions, конкретные письма или готовые assets в рамках технической миграции foundation.

Уточнение export contract, слитое в PR #28, является актуальным baseline для этого подэтапа, а не окончательным местом хранения правил.

Подробный план: [assets foundation](archive/2026-08-26-cupis-assets-foundation.md). Реализация слита в [PR #33](https://github.com/flabenar-maker/e-mail/pull/33), итоговый commit: `fe1a0e37b4d40533706c88d73f5c293c8860b3ee`.

#### 5Б. Figma naming foundation — завершён

- [x] Согласовать архитектурное уточнение master-спецификации: naming definitions, generator и validator являются отдельными модулями, а maintenance skill только оркестрирует безопасный процесс.
- [x] Создать и согласовать отдельный implementation plan figma-naming foundation.
- [x] Перенести универсальные naming definitions в `data/foundations/figma-naming.yaml` без миграции существующей библиотеки.
- [x] Создать schema, semantic validation, characterization и manifest references.
- [x] Создать чистый детерминированный generator рекомендаций, который использует только foundation и явно подтверждённую семантику; при неоднозначности возвращает `semantic-role-required`, не угадывает функцию объекта и не пишет в Figma.
- [x] Отделить validator существующих и предлагаемых имён от generator: validator проверяет только явно заданную область, а не запускает полный аудит библиотеки при каждой maintenance-задаче.
- [x] Сохранить `@2x` и `@4x` обязательной частью имени asset owner; не смешивать naming definitions с конкретными component records.
- [x] Зафиксировать будущую оркестрацию maintenance skill: локальное обнаружение непонятного имени → уточнение функции → рекомендация `old → new` → impact report → отдельное разрешение → Figma write → read-back и dependency checks.
- [x] Не менять Figma, component contracts, действующий naming standard или рабочие bundle profiles в технической реализации foundation.
- [x] Завершить общий этап 5 только после слияния обоих подэтапов и проверки отсутствия изменений Figma и component contracts.


Подробный план: [Figma naming foundation](archive/2026-08-27-cupis-figma-naming-foundation.md). Реализация слита в [PR #37](https://github.com/flabenar-maker/e-mail/pull/37), итоговый commit: `edacb9376c66fe850a9418e57fe6e311b49bc00c`.

Общий этап 5 завершён: assets foundation и Figma naming foundation находятся в `main`; технические реализации не изменяли Figma и component contracts.

### 6. Структурированный component registry — завершён

- [x] Определить schema общего, маркетингового и сервисного реестров компонентов.
- [x] Перенести фактические component contracts без изменения их смысла.
- [x] Сохранить Figma provenance, variants, properties и ссылки на foundations.
- [x] Добавить unregistered-component blocker и проверки синхронизации.

Подробный план: [structured component registry](archive/2026-09-05-cupis-structured-component-registry.md). Реализация слита в [PR #40](https://github.com/flabenar-maker/e-mail/pull/40), итоговый commit: `90f1e01365c80b7553b520e8d47c2e5bb7f88660`.

Structured records остаются shadow-источником до generated bundles и общего cutover. Figma и действующие рабочие bundle profiles этим этапом не изменялись.

### 7. Generated docs и context bundles — завершён

Подробный план: [generated docs и context bundles](archive/2026-09-07-cupis-generated-docs-context-bundles.md).

До завершения generated layer был выполнен обязательный архитектурный prerequisite: [component documentation contracts](archive/2026-09-07-cupis-component-documentation-contracts.md). Он не дал закрепить старую модель с повторением component facts в сохранённом prose Description.

#### 7A. Component documentation contracts — завершён

- [x] Зафиксировать `core/component-contract-standard.md` и `core/figma-component-description-standard.md`.
- [x] Заменить полный `description.blocks` типизированными purpose и component-specific constraints.
- [x] Сохранить независимые Mobile/Desktop contracts, properties, assets, provenance и fingerprints.
- [x] Создать полный registry renderer и отдельный compact Figma Description renderer.
- [x] Доказать semantic equivalence со старым registry без Figma mutation.
- [x] Объявить standards и validation в shadow-режиме.

Подробный план: [component documentation contracts](archive/2026-09-07-cupis-component-documentation-contracts.md). Реализация слита в [PR #45](https://github.com/flabenar-maker/e-mail/pull/45), итоговый commit: `0eb8cfd4d2ff3401a6a7e91a80e8740435f7ab0e`. Figma, рабочие routes, workflows, skills и legacy registry этим подэтапом не изменялись.

#### 7B. Generated docs и route-specific context bundles — завершён

- [x] Обновить основание реализации после merge 7A и повторно проверить ранее выполненную часть.
- [x] Генерировать читаемые реестры и справочники из структурированных источников.
- [x] Полный component registry строить из contract tree, properties, assets, constraints и resolved foundation references.
- [x] Compact Figma Description показывать только как auxiliary projection, не как implementation source.
- [x] Формировать route-specific bundles без лишнего контекста.
- [x] Email routes снабжать selected resolved component contracts, но не authoring standards или Figma Description.
- [x] Проверять, что каждый bundle содержит только применимые rules, contracts и workflows.
- [x] Сохранить весь этап shadow до отдельного cutover.

Реализация этапа 7B слита в [PR #43](https://github.com/flabenar-maker/e-mail/pull/43), итоговый commit: `15a1c3ce09fec33d5aee82a87ffee4667e911702`. Generated docs и route-specific context bundles были реализованы как shadow-слой. После PR #69 полный `docs/generated/component-registry.md` ошибочно оказался в `Legacy/` вместе со старым контуром; его renderer и структурированные входы остались. [PR #71](https://github.com/flabenar-maker/e-mail/pull/71) восстановил полный generated registry, его регистрацию в manifest и blocking-проверки в `main`. Файл вновь является производным представлением 61 structured contracts, не вторым источником component facts; остановленные маршруты не переключались.

### 8. Core, workflows и подготовка HTML-рендера — завершён

Архитектурное основание: [CUPIS HTML Rendering Design](../specs/2026-09-10-cupis-html-rendering-design.md).

Подробный implementation plan: [CUPIS HTML Rendering Stage 8](archive/2026-09-10-cupis-html-rendering-stage-8.md).

Этап 8 готовит renderer и структурированные workflows, но не переключает остановленные маршруты. Оставшийся cutover выполняется на финальном этапе 11 после его собственного сквозного gate.

Фактический статус на 2026-09-17: пакеты 1–9 слиты в main через PR #50–58; [PR #59](https://github.com/flabenar-maker/e-mail/pull/59) исправил пилотные Mobile/Desktop layout contracts. Package 10A–10C слиты через PR #78–80; Package 10D исключён из текущего маршрута без имитации client evidence. Package 11 завершил coverage всех 61 active component records через PR #81–83. Package 12 добавил structured workflows, `structured-shadow` bundle mode и archive-path blocker в [PR #84](https://github.com/flabenar-maker/e-mail/pull/84). Все семь routes остаются `workflow-paused`; это завершение подготовки Stage 8, а не production cutover.

После неудачной попытки получить убедительный пилотный результат обнаружилась недостаточная точность части мигрированных component contracts. [PR #61](https://github.com/flabenar-maker/e-mail/pull/61), [#62](https://github.com/flabenar-maker/e-mail/pull/62), [#63](https://github.com/flabenar-maker/e-mail/pull/63) и [#64](https://github.com/flabenar-maker/e-mail/pull/64) выполнили прямую сверку с Figma, добавили проверку фактических данных и уточнили маркетинговые и сервисные контракты. Это корректирующая работа внутри этапа 8, а не завершение пакетов 10–12.

[Корректирующий план для foundations этапов 2–5](archive/2026-09-15-cupis-foundations-figma-verified-remediation.md) реализован и слит через [PR #75](https://github.com/flabenar-maker/e-mail/pull/75), merge commit `c8c485bde0d69316dac83925c40e4f6b2fc0037c`. Он усилил Figma-backed проверку typography, spacing, assets и naming, но не завершил Package 10–12, этап 8, проверки готовности и переключение маршрутов финального этапа 11.
[PR #60](https://github.com/flabenar-maker/e-mail/pull/60) слит 16.09.2026 как read-only исследование без изменения active rules, component contracts или renderer; [исследовательский план](archive/2026-09-14-cupis-email-practices-research.md) сохранён как история. Результаты исследования преобразованы в согласованную [client-resilience спецификацию](../specs/2026-09-16-cupis-email-client-resilience-design.md) и [implementation plan](archive/2026-09-16-cupis-email-client-resilience.md). Проверка через Altcraft была запланирована как Package 10D, но 17.09.2026 исключена из текущего маршрута по прямому решению пользователя из-за отсутствия доступа. Она не считается выполненной, а responsive fallback остаётся неподтверждённым (`required-before-change`).

- [x] Зафиксировать characterization baseline и владельцев renderer-impacting данных — PR #50.
- [x] Создать rendering foundation и renderer-ready schema без дублирования существующих foundations и contracts — PR #51–52.
- [x] Нормализовать пилотные component contracts и сверить значимые факты с Figma — PR #52 и #61–64.
- [x] Разделить Core на четыре тематических стандарта — PR #53.
- [x] Реализовать email-примитивы, общий contract-tree interpreter и пилотный renderer registry — PR #54–55.
- [x] Добавить временную модель, CLI, типизированную диагностику и атомарную публикацию email.html + images/ — PR #56–57.
- [x] Вычислять render-impact digest автоматически только из данных, влияющих на HTML — PR #57.
- [x] Добавить автоматические HTML и property checks — PR #58.
- [x] Проверить фактический HTML обновлённого пилота и классифицировать расхождения по входной модели, контракту, renderer code и browser preview — исправления оболочки и Mobile/Desktop границы слиты в PR #66.
- [x] Package 10A: exact client-resilience policies, обязательные document metadata и явная alt-семантика — [PR #78](https://github.com/flabenar-maker/e-mail/pull/78).
- [x] Package 10B: shell/alt propagation, exclusive CSS budget, output metrics и точная minimum-viewport семантика — [PR #79](https://github.com/flabenar-maker/e-mail/pull/79).
- [x] Package 10C: normal/no-style preview, узкие viewport, Email/Header рядом с Email/Footer и доступный browser visual gate — [PR #80](https://github.com/flabenar-maker/e-mail/pull/80). Normal mode прошёл; no-style выявил Desktop-fallback overflow на 300–360px.
- [x] Package 10D исключён из текущего маршрута по решению пользователя из-за отсутствия доступа к Altcraft и целевым приложениям. Проверка не выполнена; `responsive_fallback.validation` остаётся `required-before-change`.
- [x] Доступные representative Mobile/Desktop visual scenarios для Header, Footer и пилотных блоков выполнены в Package 10C; real-client evidence не заявляется.
- [x] Мигрировать renderer coverage остальных активных компонентов после успешного пилота — PR #81–83: 61 active/covered, 38 interpreter-ready и 23 source-only, zero missing coverage.
- [x] Перевести maintenance и email-build workflows в структурированный формат и сравнить их обязательства с read-only архивным baseline без двойного контекста — PR #84. Полное сквозное сравнение оставшихся маршрутов входит в gate финального этапа 11.
- [x] Подтвердить, что HTML зависит от фактического инстанса и component contract, а не design-time золотых правил — contract-tree interpreter и renderer coverage защищены локальными tests этапа 8.
- [x] Не подавать архивный и structured наборы правил одновременно в рабочий bundle — PR #84 возвращает `CONTEXT_BUNDLE_ARCHIVED_SOURCE_FORBIDDEN` для архивного path.
- [x] Завершить проверки этапа 8 — на финальном SHA PR #84 локально прошли rendering audit, generated-doc check, полный `npm run verify` и Windows bootstrap; GitHub Actions не использовались.

[PR #66](https://github.com/flabenar-maker/e-mail/pull/66) исправил оболочку пилотного письма и границу Mobile/Desktop. [PR #67](https://github.com/flabenar-maker/e-mail/pull/67) и [#68](https://github.com/flabenar-maker/e-mail/pull/68) закрепили локальные проверки без GitHub Actions; [PR #69](https://github.com/flabenar-maker/e-mail/pull/69) и [#70](https://github.com/flabenar-maker/e-mail/pull/70) изолировали Legacy и адаптировали тесты. На том историческом этапе маршруты были остановлены; восстановление registry само по себе не включало сборку. Пакеты 10–12 затем завершены в описанном выше объёме, а email routes включены на этапе 10.

### 9. Подготовка maintenance skill — завершён

Подробный implementation plan: [CUPIS Maintenance Skill Stage 9](archive/2026-09-17-cupis-maintenance-skill-stage-9.md).

Manifest-driven разрешение source paths было выполнено на этапе 2. Этот этап не повторяет первоначальный переход на manifest: он подготовил навык к итоговым generated context bundles, но не запустил временно остановленные маршруты. Каждый route включается только после собственного проверенного cutover: email routes — на этапе 10, остальные — на финальном этапе 11 после его проверок готовности.

- [x] Подготовить `maintaining-cupis-email-system` к итоговым route-specific context bundles, сохранив остановленные маршруты до отдельного проверенного cutover.
- [x] Сохранить навык тонким маршрутизатором без копий правил и жёсткого списка путей.
- [x] Сохранить отдельный `migration-progress` route, требующий свежей сверки с roadmap перед ответом о статусе или следующих шагах.
- [x] Проверить mutation impact gate, cloud-only GitHub flow и Figma mutation gate.

[PR #85](https://github.com/flabenar-maker/e-mail/pull/85), merge commit `258aa22e12b680ea54507d82430d325228c87bbe`, добавил machine resolver, CLI, boundary tests и тонкий maintenance skill. На точном финальном SHA локально прошли 585 тестов и Windows bootstrap; все семь routes остались `workflow-paused`.

### Prerequisite этапа 10: архив и публикация Figma Description

Подробный implementation plan: [CUPIS Figma Description Archive and Compact Sync](archive/2026-09-17-cupis-figma-description-archive-and-sync.md).

Это отдельный завершающий пакет component documentation, а не часть HTML-rendering runtime. До его выполнения пользователь предоставляет четыре ссылки на тестовые письма для этапа 10: Mobile/Desktop маркетингового и Mobile/Desktop сервисного письма.

- [x] Снять через Figma MCP raw Description и Documentation link всех component/component-set nodes внутри библиотечных roots, включая пустые значения и variant nodes с собственной metadata.
- [x] Сохранить один самостоятельный snapshot в `Legacy/` без stable component IDs, manifest source, bundle reference, runtime consumer или validation dependency.
- [x] Сопоставить canonical Figma owners с active component records и отдельно показать missing, duplicate и ambiguous mappings; не придумывать ID.
- [x] Зафиксировать compact generated format `CUPIS ID` → `PURPOSE` → `RENDER` → optional `CRITICAL`, ограничив PURPOSE 160 символами, а CRITICAL двумя пунктами.
- [x] Сгенерировать полный old → new preview и получить отдельное разрешение пользователя на Description-only Figma mutation.
- [x] Записать только Description canonical component owners через MCP и выполнить отдельный read-back с проверкой фактических полей и неизменности дизайна.

[PR №87](https://github.com/flabenar-maker/e-mail/pull/87) слит: raw snapshot 156 Figma nodes сохранён отдельно, guards compact-формата и Description 61 canonical owners опубликованы. Description/name/Documentation links подтверждены read-back, 272 contract-linked Figma facts повторно сверены без расхождений. Этот prerequisite завершён; четыре ссылки на два тестовых письма получены до сборки.

### 10. Навык HTML-вёрстки конкретных писем

Подробный implementation plan: [CUPIS Email Build Skill Stage 10](archive/2026-09-17-cupis-email-build-skill-stage-10.md).

Статус на 2026-09-28: этап 10 завершён. Два email routes активированы [PR №97](https://github.com/flabenar-maker/e-mail/pull/97), навык зарегистрирован [PR №98](https://github.com/flabenar-maker/e-mail/pull/98), Mobile shell исправлен [PR №99](https://github.com/flabenar-maker/e-mail/pull/99), а [PR №101](https://github.com/flabenar-maker/e-mail/pull/101) синхронизировал статус активных маршрутов и добавил выбор доступного package runner. На точном head №101 локально прошли 705/705 тестов, validation, generate:check и bootstrap; установленный навык побайтно совпадает со слитым источником. Оба тестовых письма собраны и пересобраны, пользователь визуально принял результат. Ранее измеренная разница высот сервисного примера принята только для этих конкретных инстансов, а не как общее допустимое отклонение. Изолированный запуск после merge создал версию `service-email-e2e_1.4` с одними тестовыми href-правками и неизменными изображениями. Реальные почтовые клиенты и Altcraft в этих проверках не испытывались; остальные маршруты остаются paused. Подробные факты — в [E2E-плане](archive/2026-09-18-cupis-email-model-assembly-and-e2e.md).

Этот этап начинается после завершённого maintenance skill, prerequisite-пакета Figma Description и получения четырёх ссылок на два тестовых письма. Он использует готовые renderer, structured email workflow и machine resolver и не зависит от стандарта или навыка разработки новых блоков: письмо собирается только из уже зарегистрированных компонентов, а неизвестный компонент остаётся typed blocker. После успешных реальных E2E-сборок этап включает только email routes; остальные routes остаются остановленными до финального этапа 11.

- [x] Создать repo-scoped skill `building-cupis-emails` как тонкий маршрутизатор к `email-new-build` и `email-continue-fix`.
- [x] Не копировать в skill HTML-правила, component contracts, foundation values, asset profiles, workflow steps или список canonical paths.
- [x] Проверить однозначную классификацию нового письма, design-dependent изменения, technical изменения, read-only задачи и запроса, требующего уточнения.
- [x] Проверить обязательные Mobile/Desktop Figma-входы только для design-dependent режимов и запрет догадок при отсутствующей или перепутанной паре.
- [x] Проверить локальное версионирование без перезаписи источника: новое письмо начинает с `1.0`, каждое следующее изменение создаёт новую папку с шагом `0.1`, а итоговая папка содержит только `email.html` и `images/`.
- [x] Проверить, что новое письмо проходит через temporary email model и renderer CLI, а незарегистрированный компонент, неполный contract или asset contract останавливают сборку.
- [x] Проверить сборку от корневого Email/Template-инстанса без подъёма вложенных cards, items, buttons, badges или assets в самостоятельные блоки письма.
- [x] Проверить MCP-only экспорт ассетов, локальные `src`, отсутствие лишних файлов и применение точных значений только из resolved bundle.
- [x] Проверить локальные HTML-инварианты, Mobile/Desktop и visual regression на representative marketing/service сценариях без GitHub Actions.
- [x] Собрать из чистого контекста реальное маркетинговое и реальное сервисное письмо по предоставленным Mobile/Desktop-инстансам и устранить все неклассифицированные расхождения в источнике-владельце.
- [x] Выполнить одно реальное continue/fix изменение с созданием версии `1.1`, сохранив исходную `1.0` побайтово неизменной.
- [x] Активировать только `email-new-build` и `email-continue-fix`, их bundle/workflow dependencies и проверенный local skill; сохранить остальные routes на `workflow-paused`.
- [x] Проверить обычный пользовательский запрос из чистого контекста (изолированный исполнитель по E2E-плану) без опоры на историю разработки.
- [x] Сохранить Figma-библиотеку и локальные исходные версии писем без изменений; не включать проектирование новых блоков в email-build.

### 10A. Локальный маршрутизатор задач Codex — завершён

- [x] Добавить тонкий repo-scoped навык выбора между сборкой письма и поддержкой системы, без копий технических правил.
- [x] Проверить локальную интеграцию, clean-context выбор специализации, явный выбор, неоднозначный и смешанный запросы, сохранение pinned SHA и отказ на остановленной зависимости.
- [x] Слить пакет A через [PR #103](https://github.com/flabenar-maker/e-mail/pull/103) и [PR #104](https://github.com/flabenar-maker/e-mail/pull/104). `main@03606db5319a94327dd6713ae529f40e4c068e7a` имеет то же дерево, что локально проверенный head #104.
- [x] Слить корректировку глобального маршрута и документации — [PR #105](https://github.com/flabenar-maker/e-mail/pull/105), `main@e08b5099f72b9ac3aa7aff33df6a3a3526868232`; отмену Web и разработки новых блоков не считать их успешной реализацией.
- [x] После отдельного разрешения установить маршрутизатор и обновить два существующих локальных навыка из одного слитого SHA `e08b5099f72b9ac3aa7aff33df6a3a3526868232`. Terra подтвердила точное совпадение четырёх файлов с Git blobs и сохранность резервных копий; независимые read-only routing probes выполнены. На следующем пользовательском ходе router присутствует в каталоге доступных навыков и прочитан; repo registration не выдаётся за discovery.
- [x] Слить отдельно проверенную правку устаревших Web/design-time формулировок — [PR #106](https://github.com/flabenar-maker/e-mail/pull/106), `main@09537effc89daadacaed1d05497a1e75beb18152`. Проверенный head `c1ad82d32770524b2bb2d6ff9f85df71c00620c8` и merge имеют одинаковое дерево; полный локальный gate — 708/708. Правила выбора и mutation gates сохранены.
- [x] После merge и отдельного разрешения синхронизировать итоговый локальный router с `09537effc89daadacaed1d05497a1e75beb18152`. Terra подтвердила byte-match канонического blob, сохранность старой копии и двух специализаций/config, текущие manifest/frontmatter/catalog registrations, 10/10 targeted tests, validator, generated check и Windows bootstrap/contract. Fresh `migration-progress/read-only` остаётся `paused/SKILL_ROUTE_PAUSED`; независимые cold-context probes применимы к тому же неизменному router blob. 10A закрыт; дальнейший текущий статус этапа 11 указан ниже.

[Решение](../specs/2026-09-28-cupis-codex-routing-web-delivery-design.md) и [план завершения локального маршрутизатора](archive/2026-09-28-cupis-skill-router-web-delivery.md) сохраняют существующие пути. По решению от 01.10.2026 пакеты Web capability, ZIP/import и Web-приёмки отменены до написания продуктового кода. Рабочий результат — локальная версионная папка `email.html + images/`; постоянный источник системы — облачный GitHub. Финальные письма в репозиторий не попадают.

<a id="stage-11"></a>

### 11. Финальный cutover поддержки системы и завершение миграции — в работе

Это единственный оставшийся глобальный технический этап после закрытия 10A. Он объединяет прежние проверки этапа 13, переключение этапа 14 и итоговую ревизию этапа 15 в последовательные подэтапы с самостоятельными gates и PR. Прежние этапы 11–12 по проектированию новых блоков отменены, а не завершены; новый `component-development` route, design standard/workflow и третий специализированный навык не создаются.

Итоговые специализации — `maintaining-cupis-email-system` и `building-cupis-emails`; `cupis-email-task-router` остаётся тонким входом, не третьим предметным навыком. Onboarding уже созданного и одобренного компонента остаётся частью поддержки, не проектированием нового блока. Неизвестный компонент по-прежнему блокирует email-build до регистрации.

Подробный [implementation plan этапа 11](2026-10-01-cupis-final-maintenance-cutover.md) слит в PR #106, пакет 1 — в PR #108. Пакет 2 выполняется в draft PR #110; 11A ещё не принят. Пакеты 3–6 и отложенный follow-up карточек не начаты; поддержка не включена.

#### 11A. Проверки готовности до переключения

- [x] Подготовить и слить отдельный подробный implementation plan финального cutover — PR #106: точные области проверки manifest/workflow/profile, gates, allowed paths, rollback и порядок PR. План не является разрешением включить маршруты.
- [x] Завершить пакет 1: source closure и точная карта переключения — PR #108. Findings F1–F7 переданы в следующие пакеты; факт их обнаружения не означает устранение.
- [ ] Завершить пакет 2 в PR #110: свежие Figma facts, покрытие и архивное сравнение. Не принимать старые capture packets за результат исправленного capture.
- [x] F7 реализован в кандидате PR #110: actual workflow-checkpoint producer, schema/manifest/output и локальные tests; два generated checkpoints не ручные копии. Это завершение F7, не приёмка всего P2 или разрешение начать пакет3. Точные product/gate receipts сохранены в плане cutover.
- [ ] Проверить каждый текущий остановленный маршрут: `library-maintenance`, `component-onboarding`, `figma-description-sync`, `figma-naming-audit`, `migration-progress`. Для каждого явно определить и доказать его workflow/modes, минимальный bundle, source closure, gates и handoff. Не создавать новый design-time маршрут.
- [ ] Сравнить generated docs, bundles и обязательства maintenance-сценариев с read-only архивным baseline; объяснить значимые отличия. Нужные characterization assertions восстановить или заменить активными проверками с тем же смыслом. Архив не подключать к runtime.
- [ ] Подтвердить contract-significant факты representative maintenance-сценариев свежими точечными Figma MCP reads там, где результат зависит от Figma. Migration status и перенесённый Markdown не являются доказательством. Найденные расхождения сообщать; не менять дизайн или точные component facts без разрешённой области.
- [ ] Проверить read-only audit, contract/description impact preview, naming recommendation, onboarding готового одобренного компонента и отрицательные mutation cases; отдельно доказать запрет записи вне allowlist и отказ при неполном контексте. Фактическая Figma-запись требует собственной точной авторизации.
- [ ] Проверить regression уже активных `email-new-build` и `email-continue-fix`, сохранность исходной версии и границы двух специализаций. Не начинать заново разработку HTML-ядра или дизайн библиотеки.

#### 11B. Переключение доказанно готовых маршрутов

- [ ] Только после успешного 11A направить оставшиеся готовые маршруты на проверенные structured workflows и bundles; для каждого записать доказанный результат resolver. Сохранить активные email routes без изменений, кроме отдельно подтверждённого regression defect.
- [ ] Перевести только прошедшие gate workflow/profile/foundation статусы из временных shadow-состояний в итоговые; не делать массовую замену статусов без проверки потребителей.
- [ ] Проверить validation, generated-doc equivalence, route closure, skill/bootstrap boundaries и один полный локальный прогон на точном финальном cloud commit. Рутинные тесты и visual regression — Terra Medium; GitHub Actions и PR Checks не использовать.
- [ ] Зафиксировать rollback point и изменения зависимостей; получить отдельное разрешение на merge. После слияния синхронизировать локальные навыки из слитого SHA с отдельным разрешением и подтвердить clean-context работу.

Между принятым и слитым пакетом 5 и отдельно разрешённой очисткой выполняется согласованный follow-up обновлённых карточек из PR #109. Этот порядок не позволяет обходить текущие paused gates или принимать известный drift за совпадение контрактов.

#### 11C. Итоговая очистка после стабильного cutover

- [ ] Для каждого файла `Legacy/` и временного migration/shadow-артефакта установить фактических потребителей, подтверждённую замену и решение `remove`/`preserve`.
- [ ] Удалять только доказанно ненужные дубли отдельным разрешённым PR; полезные исторические baselines сохранять с объяснением роли. Автоматического удаления всего архива нет.
- [ ] Удалить временные переходные указания из активных источников, сохранив постоянные schemas, validators/resolvers и regression tests. Для снятия каждой временной границы подтвердить её замену; документация не должна просто объявить paused-маршрут активным.
- [ ] Подтвердить, что manifest, workflows, bundles, skills и bootstrap не используют удалённые пути или архив как активного владельца правил. Выполнить финальные локальные проверки и зафиксировать завершение миграции в roadmap.

## Изменение маршрута от 01.10.2026

- Web-часть 10A отменена; локальный пакет A сохранён и уже слит.
- Прежние этапы 11–12 отменены: не создаются стандарт, workflow или навык проектирования новых блоков.
- Прежние этапы 13–15 стали подэтапами 11A–11C финального cutover. Проверки, rollback и обоснованная очистка сохранены, зависимость от отменённого design-time контура снята.
- Завершённые этапы и исходные журналы не переписываются как будто выполнялись по новому маршруту. Старые номера в исторических шагах не создают будущих задач; актуальный порядок задаёт этот раздел.
- По решению от 02.10.2026 отдельный ручной context-файл удалён. Глобальная очередь остаётся в этом roadmap, факты текущего пакета — в его implementation plan; удалённый документ восстанавливается только из истории Git, а не как рабочий источник.

## Правило обновления roadmap

После слияния этапа статус, ссылка на фактический implementation plan или PR, следующий gate и зависимости сверяются с актуальным `main` и содержимым `docs/superpowers/plans/`. Если реализация изменила путь к cutover, эти части roadmap корректируются без переписывания исторических задач как будто они выполнялись иначе. Новое системное правило сначала фиксируется в master-спецификации; roadmap не используется как скрытый источник технических правил.
