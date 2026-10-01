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

### Текущая точка возврата P2 — 02.10.2026, 01:31 МСК

**Сбор завершён: 61/61 полных packets; пакет 2 НЕ принят.** В этом продолжении получены все оставшиеся 24, затем выполнен локальный аудит всех 61. Нового quota error не было. Повторное чтение прежней очереди из 24 не является следующим шагом. Ниже сохранена историческая остановка, а не текущая команда повторить сбор.

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

**Coverage — не список визуальных дефектов.** Audit увидел 38 300 source facts / 15 046 mapped и 19 956 contract facts / 15 115 mapped. Открыты 23 254 `FIGMA_FACT_UNCOVERED`, 4 863 `CONTRACT_FACT_UNMAPPED`, 20 `FIGMA_SOURCE_PATH_MISSING` (все у deferred `block-icon-list`, обычных owners — 0), 18 unsupported diagnostics, 17 evidence-links-not-contract и topology diagnostics. Raw capture содержит 207 diagnostics: 160 `ABSOLUTE_CHILD_LAYOUT_REQUIRES_REVIEW` и 47 `MIXED_VALUE`. Это требует классификации значимости и exact mapping; blanket exclusions или переутверждения контрактов ради GREEN нет. Не использовать несуществующий diagnostic `SOURCE_PATH_MISSING` и не вычислять unmapped как разность агрегатов: raw fact paths и Set успешных mapping targets — разные множества.

**P2-F2 — уточнённая причина без автоматической правки.** В Desktop `text-details` 459:27425 — FILL 251 вместо reference 252; `status-container` 459:27428 и `status` 459:29356 — HUG 117 вместо 116. Сумма строки: 72 + 24 + 251 + 24 + 117 = 488. В Mobile `status` 459:29376 — HUG 94 вместо 93; x=79 в строке 252 подтверждает центрирование. Это сильное evidence устаревших измеренных ширин, зависящих от содержимого, а не доказательство поломки HTML. Причина изменения метрик текста во времени отдельно не установлена. Числа и правила адаптивности не переписываются; согласовать судьбу четырёх reference facts и затем выполнить отдельный scoped correction/read-back.

**Что foundation-сравнение не доказывает:** не проверены все text-style case/decoration/paragraph/description/variation settings, все места применения component bindings, asset/naming semantics и визуальный HTML output. Совпадение definition не заменяет сравнение каждого назначения в component contract. Наличие полей исправленного capture (609 text_geometry/font_weight/figma_style_name occurrences, 2 568 minimum_width_px, 53 gradient_stops) доказывает получение полей, но не их полное semantic mapping.

**Следующие действия, всё ещё в P2:**
- [ ] Разобрать coverage/mapping/topology/unsupported diagnostics по конкретному owner/node/path: implementation-significant факт, производное измерение, служебное поле или отложенный drift #109. Не менять auditor/contract автоматически.
- [ ] Принять решение по четырём F2 reference widths; HTML/layout strategy не менять по одному числовому снимку.
- [ ] Дозакрыть нужное foundation/binding и visual evidence для выбранных значимых обязанностей.
- [ ] Завершить сопоставление архивных обязательств с текущими владельцами; P2-F3 recorded association projection уже исправлен, но не доказывает live usage.
- [ ] Оформить F7 decision и exact producer/schema/manifest/output/test map для generated workflow checkpoints до начала P3. Генератор ещё не реализуется.
- [ ] После closure выполнить полный локальный gate точного финального SHA и независимое review перед отдельно разрешённым merge кода. P3 и cutover не начинать по факту одного успешного сбора.

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
