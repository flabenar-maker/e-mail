# Служебные связи Template и Shared — Implementation Plan T1/S1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Рутинные тесты, разбор failures и regression поручать GPT-5.6 Terra Medium; координатор выполняет реализацию. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Проверять связи Template → shell и Shared → фактический instance → asset owner, не изменяя визуальные факты, HTML или экспорт.

**Architecture:** `evidence_links` — отдельные служебные metadata component record. Offline-проверка ссылок, fresh-Figma сверка и reverse dependency projection разделены; ожидаемые значения разрешаются из canonical sources одного SHA. Механизм подключается к текущему auditor, а не к HTML-деревьям; maintenance bundle/workflow подключается позднее в P3.

**Tech Stack:** Node.js `>=24 <25`, ESM, текущие Ajv 8.20.0/YAML 2.9.0, node:test; Figma Plugin API только через MCP. Новых npm-зависимостей нет.

**Spec:** [Согласованная спецификация T1/S1](../../specs/2026-10-02-cupis-template-shared-evidence-links-design.md). Владелец архитектуры — [master-spec](../../specs/2026-08-24-cupis-structured-email-system-design.md); родитель и общий журнал — [P2 cutover plan](../2026-10-01-cupis-final-maintenance-cutover.md). [Roadmap](../2026-08-25-cupis-migration-roadmap.md) остаётся единственной глобальной очередью.

Дата: 02.10.2026. Письменная спецификация одобрена пользователем. Implementation plan подтверждён пользователем; задачи 1–3 выполнены в кандидате PR #110; следующая задача 4, задачи 4–7 ещё не начаты. База: `main@618d124df0a664c84d23a724ba50ef2b324e9b97`, candidate `c076b4e1f365d3c59f115590f35ef65485f7a9bf`, draft PR #110 / `codex/maintenance-cutover-p2-evidence`. Это ограниченный ремонт внутри P2, не новый этап и не приёмка P2 целиком.

## Global Constraints

- `evidence_links` находится рядом с `contracts`; его поля — `foundation_values` и `source_dependencies`. Старые `contracts.figma_fact_links` и их целевые пути не расширять произвольно.
- Начальные foundation targets: только `rendering-foundation` и `/shell/background_color`, `/shell/max_width_px`, `/shell/horizontal_inset_px`. Comparisons: `pixel-number`, `opaque-solid-color`. Никаких вторых expected values, формул или новых допусков.
- Shared не является отдельным блоком письма; Template — корневая композиция и источник её оболочки. Native 62, glyph 46.5 и badge 72 — разные существующие размеры, не повод пересчитывать контракт.
- Перед каждым data mapping получить новый адресный MCP-пакет source/target/owner. История чата, сохранённый `source_variants`, старые captures и статус `verified` не заменяют этот вызов.
- Figma, descriptions, naming, geometry, display/export contracts, foundations, renderer, локальные письма, routes и навыки не менять. PR #109, остальные P2 facts/F2/F7 и P3 не входят в этот ремонт.
- GitHub — постоянный источник и транспорт. Авторить через cloud API; изолированные exact-cloud snapshots — только execution/verification. Не делать из них рабочую копию. Перед каждым cloud ref update проверять ожидаемый parent, не force-push.
- Все тесты локально через явно выбранную `gpt-5.6-terra` / `medium`. Actions/PR Checks не читать и не запускать. При недоступности модели сообщить, не подменять молча.
- Внутри задач — targeted RED/GREEN. Полный `npm run verify` — один раз на финальном code/data SHA перед разрешённым merge; новые code/data commits требуют нового финального результата. Слияние отдельно, после review пользователя.

## Review Focus

1. Удалённый `evidence_links` или один пропущенный link не должен превращать неполную сверку в успех — задачи 3–5.
2. Одинаковые числа/цвета у чужого variant/Slot или повторное имя export owner не подтверждают принадлежность — задачи 2–4.
3. Реальный Receipt override не равен default Lock: reverse impact различает подтверждённое и возможное использование — задача 4.
4. Частично полученный MCP-пакет, чужой SHA, старый timestamp и асинхронно недоступный main component не должны исчезать из диагностики — задачи 2 и 5.
5. Безопасная metadata-правка меняет source digests, но не HTML/render-impact/assets/compact Description; schema-version bump не разрешает обновлять эталоны вслепую — задачи 1, 6 и 7.

## Файлы и точные границы

| Файлы | Ответственность |
| --- | --- |
| `schemas/components.schema.json`, `scripts/lib/component-registry.mjs` | Components schema 2.2.0 и offline-проверка локальных/межкомпонентных ссылок |
| **Новый** `scripts/lib/component-evidence-links.mjs` | Pure reference validation, нормализованные ссылки и reverse impact; без чтения файлов и без зависимости от renderer |
| **Новый** `scripts/lib/component-evidence-inputs.mjs` | Manifest-resolved загрузка canonical inputs и отдельного временного MCP session; без сети/записей |
| **Новый** `scripts/lib/figma-component-evidence.mjs` | Pure live checker T1/S1, обязательная coverage, identity/ancestry/freshness |
| `scripts/figma/capture-contract-source.js` | Capture metadata, полнота дерева, async main lookup; остальные факты прежние |
| `scripts/audit-figma-contract-facts.mjs`, `scripts/lib/figma-contract-facts.mjs` | CLI handoff и объединение отчётов без снятия прежних blockers |
| `scripts/lib/system-manifest.mjs` | Включить проверку foundation targets в общий offline validator после загрузки rendering foundation; routes не менять |
| `data/components/{shared,marketing,service}.yaml` | Только версия документа 2.2.0; позднее `evidence_links` восьми разрешённых owners |
| `core/component-contract-standard.md`, `scripts/lib/component-registry-doc.mjs` | Короткая нормативная граница и generated service-dependency section |
| `docs/generated/component-registry.md` | Генерация service-link projection и штатного заголовка |
| `docs/generated/{typography-registry,asset-registry}.md` | Только производные source-digest/schema-version заголовки, если их меняют действующие input dependencies |
| Tests, перечисленные в задачах | Прямые regression cases, без глобального snapshot replacement |

Остальные production paths запрещены. `system/manifest.yaml`, `scripts/lib/context-bundle.mjs`, rendering/export modules и generated naming reference должны остаться побайтово прежними. Если реализация требует расширить allowlist, сначала сообщить конкретную причину и зависимость.

## Общие интерфейсы

`records` ниже — полный массив исходных component records, не урезанные email bundle projections. `Issue` — `{code, path, message, ...точная диагностика}`. Никаких записанных статусов успеха в canonical records.

- `validateEvidenceLinkReferences({records}) -> Issue[]` (`component-evidence-links.mjs`): closed domains/IDs/variant/asset references/duplicates/cycles. Не утверждает live identity или принадлежность узла.
- `resolveEvidenceTargets({records, manifest, sourceDocuments}) -> {targets, issues}` (тот же модуль): targets Map по `componentId/linkId`; ожидаемые данные извлекаются из canonical records и manifest sources. `sourceDocuments` — Map source ID → загруженный документ. Пользовательские expected values не поддерживаются.
- `loadComponentEvidenceModel({repoRoot, canonicalSha}) -> Promise<Model>` (`component-evidence-inputs.mjs`): `{canonical_sha, manifest, records, source_documents, targets}` с manifest-resolved путями и проверенными типами. `canonicalSha` — 40 lowercase hex; совпадение raw snapshot с cloud commit отдельно доказывает проверяющий агент.
- `loadComponentEvidenceSession({sessionPath, canonicalSha}) -> Promise<Session>` (тот же модуль): проверяет временный session и загружает точные packet bytes. `Session` содержит `canonical_git_sha`, `started_at`, `completed_at`, `component_ids`, `captures`; каждый capture — metadata receipt плюс `packet`.
- `auditComponentEvidenceLinks({recordId, model, session}) -> EvidenceReport` (`figma-component-evidence.mjs`): `{ok, component_id, canonical_git_sha, session_started_at, receipt_ids, results, issues, required_sources, verified_sources}`. Result содержит `link_id`, `kind`, `status: verified|mismatch|unverified`, source, target, expected/actual при наличии, reason. Source key — точная тройка `{variant_node_id,node_id,field_path}`, не имя слоя.
- `collectRequiredComponentEvidence({record, live}) -> {required_sources, issues}` (тот же модуль): независимое от имеющихся links определение scope для Template и artwork. Отсутствующее/неполное дерево даёт issue, а не успешный пустой scope. Этот проход используется и при старом CLI-вызове без session.
- `collectEvidenceConsumers({model, session, sourceComponentId, reports}) -> {confirmed, possible, issues}` (`component-evidence-links.mjs`): элементы `{component_id, asset_owner_node_id, asset_id?, via}`. Использует `model.records`; `confirmed` основан только на успешных actual-instance links reports того же SHA/сеанса/receipt. Чужой или старый report даёт issue, а не confirmed edge. Транзитивные default-цепочки без такого доказательства остаются `possible`. Непроверенный link сам по себе не подтверждает actual use.

## Задача 1. Typed metadata и offline reference validation

**Files:** Modify schema/component-registry; Create `scripts/lib/component-evidence-links.mjs`, `tests/foundation/component-evidence-links.test.mjs`; Modify version headers трёх data-файлов, `tests/foundation/component-registry.test.mjs`, `tests/components/component-documentation-model.test.mjs`, `tests/components/component-documentation-migration.test.mjs`, `tests/generation/generated-docs.test.mjs`; regenerate три документа из таблицы при изменении headers.

**Interfaces:** Produces `validateEvidenceLinkReferences`, `resolveEvidenceTargets`; остальные exports из общей таблицы ещё не используются. `validateComponentRegistrySemantics` вызывает первую функцию; `collectComponentReferences` и HTML dependency closure не менять.

- [x] Написать RED cases с точными assertions:

```js
assert.deepEqual(validateEvidenceLinkReferences({records: validRecords}), []);
assert.ok(codes(withDuplicateId).includes('EVIDENCE_LINK_ID_DUPLICATE'));
assert.ok(codes(withUnknownComponent).includes('EVIDENCE_TARGET_COMPONENT_UNKNOWN'));
assert.ok(codes(withWrongVariant).includes('EVIDENCE_TARGET_VARIANT_INVALID'));
assert.ok(codes(withUnknownAsset).includes('EVIDENCE_ASSET_UNKNOWN'));
assert.ok(codes(withCycle).includes('EVIDENCE_DEPENDENCY_CYCLE'));
```

  `codes` — локальный helper, вызывающий `validateEvidenceLinkReferences` над указанным fixture. Дополнительно schema cases: оба массива обязательны, поля закрыты, link IDs уникальны между массивами; `source.variant_node_id` обычный Figma ID, node/owner могут быть полными `I...;...`; malformed ID, неизвестный comparison, wildcard, `expected_value` и произвольный file path отвергаются. Роль source/target определяется canonical записью, не названием.
- [x] Terra: `node --test tests/foundation/component-evidence-links.test.mjs` → RED на отсутствии нового API/поля; не считать ошибку fixture доказательством дефекта.
- [x] Реализовать optional top-level раздел по spec. Добавление поля — minor schema change: `2.1.0 → 2.2.0` атомарно в schema const, loader supported-version и трёх envelope headers. Старый format не объявлять новым без смены версии; глобальный schema validator не переделывать. В раннем коммите реальных links ещё нет.
- [x] Reference validation: exact source variant принадлежит owner (standalone root допускается вместо variants); target component/variant существует, source/target file key совпадает; asset ID принадлежит потребителю; ссылки не содержат дубликат одного source assertion или конфликтующих targets. Проверять циклы только нового dependency graph, не смешивать с HTML graph.
- [x] `resolveEvidenceTargets`: manifest source должен существовать; source ID/JSON Pointer — только разрешённые spec домены; background target — точный HEX, width/inset — конечные числа. Не использовать fallback-файл, native size или guessed default. Неиспользуемые metadata не заставляют загружать произвольные sources.
- [x] Поднять версии в synthetic current-format fixtures. Историческую `migrateComponentDocument` не переписывать: её результат остаётся 2.1.0; compatibility assertion сравнивает все record fields с текущими данными, отдельно нормализовав только envelope version. Новые evidence metadata не вырезать из сравнения и не удалять существующие assertions.
- [x] Terra GREEN: новый test плюс четыре изменённых test-файла (включая current-format consumer генератора); `node scripts/validate-system.mjs`; `node scripts/generate-docs.mjs --check`. Generated output получать отдельно как derivation, публиковать через cloud, не редактировать snapshot/source вручную. Отличия body типографики/ассетов запрещены.
- [x] Cloud commit: `feat: add typed non-rendering evidence link metadata`. В журнале записать SHA/RED/GREEN; следующий шаг — capture/context, не data mappings.

### Задача 1 — контрольная точка 02.10.2026

Выполнена в кандидате `7adff9c75d6f0fb319f9ab5cb8e8499177a58ccb`: 108/108 targeted tests в пяти файлах, validator и generated check PASS через Terra Medium. Source-consumer scan дополнительно выявил старое ожидание версии в generated-docs test: RED подтвердил actual 2.2.0 против stale 2.1.0; изменено только это ожидание. Поэтому test allowlist задачи расширен на данный файл, без расширения production scope. Test-first RED и полный перечень сохранённых областей — в [журнале P2](../2026-10-01-cupis-final-maintenance-cutover.md). Реальные links не записаны; полного merge gate ещё нет. Следующая задача — 2; в этом продолжении она не начата.

## Задача 2. Свежий capture и проверяемые входы

**Files:** Modify capture script и существующий capture test; `scripts/lib/figma-contract-facts.mjs` — только совместимость capture version 1.1.0 на этом шаге; Create `scripts/lib/component-evidence-inputs.mjs`, `tests/foundation/component-evidence-inputs.test.mjs`; использовать `tests/helpers/system-fixture.mjs`, не создавать второй fixture loader.

**Interfaces:** Produces `loadComponentEvidenceModel`, `loadComponentEvidenceSession`; consumes reference/target resolver задачи 1. Capture сохраняет вызов `captureFigmaContractFacts(componentNodeId)`.

- [x] RED capture tests: getter `mainComponent` бросает ошибку, но async `getMainComponentAsync()` возвращает реальный main — capture обязан сохранить его ID; async rejection/null даёт `MAIN_COMPONENT_UNRESOLVED`, а не молчаливый успех. Составной instance ID сохраняется целиком. Ранее captured text/style/layout/fill значения сравнить без новых metadata полей — они прежние.
- [x] RED input tests: неверный session SHA, повторный capture, missing packet, traversal/symlink за папку session, hash mismatch, захват до начала сеанса, capture после его окончания, неизвестная версия и `tree_complete:false` дают input diagnostic. Перемещение rendering source на другой разрешённый manifest path работает; отсутствие регистрации не заменяется старым путём.
- [x] Terra: `node --test tests/foundation/figma-contract-source-capture.test.mjs tests/foundation/component-evidence-inputs.test.mjs` → ожидаемый RED.
- [x] Capture выдаёт `capture_version: "1.1.0"` и `capture_meta: {started_at, completed_at, tree_complete, node_count}`. UTC timestamps создаются внутри MCP-вызова. `tree_complete:true` только после полного обхода, без фильтрации скрытых children; количество должно совпасть с фактическим деревом. Lookup failure не удаляет instance: null плюс точный capture_error. Metadata расположена на уровне packet, не среди source numeric facts. Исходные v1 поля не переименовывать. В этом же коммите scalar auditor принимает версии 1.0.0 и 1.1.0, чтобы существующие capture→audit tests не ломались до задачи 5; неизвестные версии остаются ошибкой.
- [x] Зафиксировать transient session format `schema_version: "1.0.0"`, `canonical_git_sha`, `started_at`, `completed_at`, `component_ids`, `captures`. Capture entry: `{component_id, receipt_id, tool:"use_figma", received_at, packet_path, packet_sha256}`. Путь относителен папке session и не выходит за неё после realpath; hash — SHA-256 точных bytes. Один packet на selected owner. Receipt — ID реального MCP-вызова, не тестовая метка в live-проверке. В unit tests эти поля явно synthetic.
- [x] Model loader использует существующие manifest/component/rendering loaders, передаёт зарегистрированные paths, не импортирует `system-manifest` обратно в pure reference module. Session SHA равен model SHA; `session.start ≤ capture.start ≤ capture.end ≤ received_at ≤ session.end`; finite UTC, complete tree и node count обязательны для новой evidence-проверки. Неправдоподобные даты не округлять и не исправлять автоматически. Старые v1 packets могут оставаться входом старого scalar auditor, но не доказывают новые links.
- [x] Документировать предел: локальный формат проверяет непротиворечивость входа, не криптографически удостоверяет MCP/облачный SHA. Raw-cloud byte verification и реальное получение receipt обязательны у исполнителя; runtime не обращается в GitHub/Figma сам.
- [x] Terra GREEN теми же командами. Cloud commit: `feat: capture fresh source identities for component evidence`. Следующий шаг — T1; все live mappings ещё отсутствуют.

### Задача 2 — контрольная точка 02.10.2026

Выполнена на exact cloud SHA `98b8b7633d689badc21ecf15241fdd54a9cbc30d`. Test-first RED `795c99d2`: отсутствие input loader, async main lookup/metadata и scalar-совместимости 1.1.0 воспроизведено локально. Реализация `545b0e7b`; уточнение только synthetic fixtures `98b8b763`: один реальный MCP-вызов вправе возвращать packets разных owners с общим receipt ID, а семантический negative case должен проходить schema перед проверкой comparison. Эти уточнения не меняют факты библиотеки.

Через GPT-5.6 Terra Medium: шесть targeted test files — **161/161 PASS**, `validate-system` и `generate-docs --check` PASS. Проверены все 236 blobs итогового cloud tree; первоначальный локальный счётчик обходил только 234 baseline-файла, это исправлено в служебной проверке, два новых файла также совпали с cloud bytes. Независимое read-only review: actionable issues 0. Полный merge gate не запускался; Actions/PR Checks не использовались.

Capture 1.1.0 включает скрытые descendants и восстанавливает API traversal setting даже при ошибке; `node_count` считает сериализованные корни вариантов и их descendants, не обёртку component set. При сбое обхода нет успешного частичного packet; недоступный main остаётся null с `MAIN_COMPONENT_UNRESOLVED`. Прежние visual facts сохранены, scalar reader принимает 1.0.0/1.1.0; новые evidence inputs требуют 1.1.0. Model берёт полные canonical records и foundation по зарегистрированным paths; session проверяет SHA, точные bytes/hash, realpath, календарные UTC-даты, временной порядок и полноту дерева.

Это механизм проверки согласованности входа, не удостоверение происхождения MCP-данных. Реальные receipts и raw-cloud SHA доказывает исполнитель. Здесь не было Figma-чтений/записей или mappings. Контракты, foundations, generated docs, manifest, renderer/export, context-bundle, workflows, навыки и письма побайтово сохранены относительно базы задачи. Следующая **задача 3 — T1: Template → shell**; затем S1/identity/coverage и live mappings по очереди, не автоматическое продолжение. P2 остаётся открытым; PR draft, merge отдельно.

## Задача 3. T1: Template → существующие shell values

**Files:** Create `scripts/lib/figma-component-evidence.mjs`, `tests/foundation/figma-component-evidence.test.mjs`; `foundation-evidence.mjs` переиспользуется без изменения его глобальной семантики.

**Interfaces:** Produces `auditComponentEvidenceLinks` и `collectRequiredComponentEvidence`, T1 branch; consumes Model/Session задачи 2. Source keys/diagnostics детерминированно сортируются; никаких значений, взятых из persisted `source_variants`.

- [x] RED fixtures: Template D600/M328, roots/Slots `#F3F3F5`, root left/right 0. Ожидания берутся из fixture foundation. Assertions: все 9 обязательных assertions verified; поменять desktop width на 601 → `mismatch`, root Fill на `#FFFFFF` → `mismatch`; убрать link → `EVIDENCE_REQUIRED_LINK_MISSING` даже если остальные совпали.
- [x] Дополнительно RED: правильный HEX у чужого узла, неверный source variant, opacity 0.5, hidden source/ancestor, второй видимый Fill, gradient вместо SOLID, неправильный desktop sizing → не verified. Скрытый дополнительный Fill сам по себе не заменяет единственный допустимый видимый SOLID. Новая ширина Mobile и HUG-height не проверяются как min-width/HTML-height. Допуски остаются только существующей нормализацией float, а не погрешностью дизайна.
- [x] Terra: `node --test tests/foundation/figma-component-evidence.test.mjs` → RED.
- [x] Найти обязательные источники независимо от links: record с semantic_role `template`, canonical Mobile/Desktop variants, roots и единственный Slot каждого variant. Viewport определяется по зарегистрированной оси; Slot — единственный прямой child типа `SLOT` при единственном объявленном contract `render_mode:slot`. Его текущее имя `Content` не является selector. Нет/два подходящих Slot или slots в contract → `EVIDENCE_SCOPE_AMBIGUOUS`; нельзя выбрать первый или выводить обязательный узел из самого проверяемого link. Не хардкодить IDs `email-template`/`1102:*` в production checker.
- [x] Проверять 9 обязательств: 4 backgrounds (roots+Slots), 1 desktop width, 4 root horizontal paddings. Source paths: `/fills/<actual-visible-index>/color`, `/reference_dimensions/width`, `/layout/padding/left|right`; target pairing только соответствующее им по spec. Slot padding не становится дополнительным shell inset; прочие Slot facts остаются вне закрытия T1.
- [x] До value comparison проверить exact file/owner/variant/root/node, ancestry, visible paint/type/opacity, source node и влияющие ancestors до variant. Для desktop width required horizontal_sizing `FIXED`. Передавать точный canonical expected в `compareFoundationObservation`; его `FOUNDATION_EVIDENCE_MISMATCH` преобразовать в новый link status `mismatch`, не менять старый comparator. Missing/unsupported input → `unverified`.
- [x] `verified_sources` содержит только реально подтверждённые source keys; успешный цвет не покрывает всю fills-ветку, узел или Template. Чужие capture errors и scalar issues не исключаются.
- [x] Terra GREEN: T1 tests и `tests/foundation/foundation-evidence.test.mjs`. Cloud commit: `feat: verify Template shell evidence with required coverage`. Следующий шаг — S1.

### Результат задачи 3 — 02.10.2026

Выполнена на code/test SHA `f0237a32727a54a8c5b503918cdd8bcc40e435ee`. Test-only RED `f1f9de3cf3612eee13edb30fadb22213c771fa13`: ожидаемый missing-module, raw237/237 до/после. Затем добавлен только pure T1 checker. Локально GPT-5.6 Terra Medium: четыре scoped файла (новый checker, foundation comparator, evidence links, evidence inputs) — **152/152 PASS**; validator и generated check PASS. Итоговый raw tree238/238 проверен; новый checker/test — единственные code/test изменения задачи. Полный suite и Actions не запускались.

Обязательные девять источников определяются независимо от links; проверяются exact file/owner/variant/root/node, уникальный прямой SLOT и один contract slot, paint/ancestor visibility/opacity, FIXED Desktop width и точное target pairing. Ожидания разрешаются из canonical foundation; исходный comparator и float-нормализация не изменены. Удаление links, чужой слой с тем же HEX и неподтверждённый paint не проходят. Mobile reference width, HUG-height и Slot padding не становятся shell policy. Сохранённые snapshots не читаются; capture errors остаются явными, покрываются только конкретные успешные source triples.

Это синтетическая проверка механизма, не новая сверка библиотеки. Реальные mappings и Figma не изменялись; контракты, foundations, scalar auditor, renderer/export, manifest/context-bundle, workflows/skills и письма сохранены. Следующая **задача 4 — S1: instance dependencies и impact**; CLI/integration — задача 5, свежие MCP mappings — задача 6, whole-branch review/full gate — задача 7. P2 открыт, PR #110 draft, merge отдельно.

## Задача 4. S1: фактические instance dependencies и impact

**Files:** Modify оба pure evidence modules; extend `tests/foundation/component-evidence-links.test.mjs`, `tests/foundation/figma-component-evidence.test.mjs`.

**Interfaces:** Complete `auditComponentEvidenceLinks` S1 branch и `collectEvidenceConsumers`; source identity всегда `main_component_id`, expected main ID только из canonical target variant/root и его fresh target packet.

- [ ] RED fixture цепочки: Header→BigLogo→Product; Compact→Product без нового mobile asset; Badge→Lock default; ReceiptBlock→Badge плюс `I502:24255;491:22378`→Receipt override. Assert full compound ID equality, обе ступени actual chain verified, glyph не появляется в HTML/asset contracts. Поменять actual main → `EVIDENCE_MAIN_COMPONENT_MISMATCH`.
- [ ] RED ownership cases: правильный main в соседнем variant, одинаковый suffix master ID без instance prefix, detached узел, недоступный target, owner не ancestor, ancestor не соответствует export boundary, два одноимённых owner, неизвестный asset ID → не verified. Удалить link вложенного override или весь раздел → missing-link. Эти случаи нельзя закрыть default-цепочкой.
- [ ] RED reverse impact: Lock default у badge может дать ReceiptBlock в `possible`, но не в `confirmed`; Receipt actual link даёт ReceiptBlock/точный badge owner в `confirmed`. Report другого SHA/сеанса или с receipt вне текущего session даёт `EVIDENCE_REPORT_CONTEXT_MISMATCH`, не confirmed edge. Дедупликация по consumer+owner+asset, сортировка стабильная, reverse map не записывается на стороне source.
- [ ] Terra: `node --test tests/foundation/component-evidence-links.test.mjs tests/foundation/figma-component-evidence.test.mjs` → RED.
- [ ] Scope traversal: у source-only asset record — полные variant subtrees; у остальных consumers — однозначно resolved существующие asset boundaries и их INSTANCE descendants. Обычные HTML nested components за пределами artwork остаются старому auditor. Нельзя формировать scope только из объявленных links. Неполная или неоднозначная boundary даёт scoped unverified issue, не пустой успешный scope.
- [ ] Owner resolution следует существующим `asset_contracts.export_boundary`/owner selectors, подтверждённым в текущем variant. Имя — только объявленный selector, не самостоятельное доказательство identity; после выбора обязательны единственность, exact ID, принадлежность и ancestry. У asset root допускается root owner; отсутствие asset_id допустимо только если у этой source-only композиции действительно нет соответствующего export contract. Отказ от asset_id не обходит существующий asset.
- [ ] Fresh target packet подтверждает target component identity и точный вариант. Generic duplicate node IDs/variant IDs, несовпадающий root и capture incompleteness не допускают verified. Default dependency хранится у source badge; nested override — у consumer. Ни native/display размеров, ни export scale эта проверка не вычисляет.
- [ ] Terra GREEN теми же командами. Cloud commit: `feat: verify Shared source dependencies and actual overrides`. Следующий шаг — общий auditor/CLI, не изменение данных.

## Задача 5. Объединение проверок без ложного PASS

**Files:** Modify `scripts/audit-figma-contract-facts.mjs`, `scripts/lib/figma-contract-facts.mjs`, `scripts/lib/system-manifest.mjs`; extend `tests/foundation/figma-contract-facts-cli.test.mjs`, `tests/foundation/figma-contract-facts.test.mjs`, `tests/foundation/system-manifest.test.mjs`; Create `tests/foundation/component-evidence-audit.test.mjs`.

**Interfaces:** Новый экспорт `auditFigmaComponentEvidence({record, live, model, session, derivedEvidence=[]})` из `figma-component-evidence.mjs` возвращает `{ok, facts, evidence_links, issues}`; вызывает старый fact auditor и новый link checker. При session record должен совпасть с canonical записью model. Без новых флагов model/session отсутствуют: старый scalar audit и независимый `collectRequiredComponentEvidence` не требуют выдумывать SHA; обнаруженная obligation даёт `EVIDENCE_SESSION_REQUIRED`. Pure fact auditor не импортирует evidence checker обратно. CLI сохраняет существующие три обязательных флага и добавляет парные `--evidence-session <path> --canonical-sha <sha>`.

- [ ] RED: новый CLI session применим к точному `--live` из receipt; другой packet/hash/owner/SHA отвергается. Нельзя передать `--mappings`, expected value или внешний canonical target. Одного из двух новых flags недостаточно. Старый вызов сохраняет scalar диагностику, но scoped Template/asset dependencies без session получают `EVIDENCE_SESSION_REQUIRED`, а не PASS.
- [ ] RED union assertions: прежний `FIGMA_CONTRACT_MISMATCH`, missing path, unmapped contract и unsupported capture не исчезают при успешных links. Удаление обязательного link ловится и через CLI. Новый reader принимает capture 1.0.0/1.1.0 для scalar facts; неизвестная версия отвергается. Link proof требует metadata 1.1.0 независимо от scalar compatibility.
- [ ] Terra RED: `node --test tests/foundation/component-evidence-audit.test.mjs tests/foundation/figma-contract-facts-cli.test.mjs tests/foundation/system-manifest.test.mjs`.
- [ ] Объединить reports: `ok = facts.ok && evidence_links.ok`. Пока не менять coverage-политику старого fact auditor и не снимать даже `FIGMA_FACT_UNCOVERED` по новому report: отдельно показать точные `verified_sources`; дальнейший role-aware перенос обязанностей согласуется в оставшемся P2. Это сохраняет все старые blockers, не позволяет новым links скрыть отсутствие числовых данных. Общий report может оставаться nonzero при полностью успешном T1/S1 — это честный остаток P2.
- [ ] В system validator после существующей загрузки registries/rendering вызвать target resolution из задачи 1 с тем же manifest и загруженными документами. Missing source/path/type → typed validation error. Не добавлять новые input sources/profile fields в manifest и не включать service metadata в email bundles. `context-bundle` получает только существующую local semantic validation из задачи 1.
- [ ] Команда рабочего link-audit: `node scripts/audit-figma-contract-facts.mjs --repo-root <exact-snapshot> --component-id <id> --live <packet.json> --canonical-sha <sha> --evidence-session <session.json>`. Нет новых npm aliases. Конкретный packet загружается отдельно, не из record; expected targets всегда из model loader.
- [ ] Terra GREEN перечисленных файлов плюс `tests/foundation/figma-contract-facts.test.mjs`, `tests/foundation/figma-contract-facts-units-icons.test.mjs`; CLI exit 1 допустим только в negative fixtures с ожидаемыми codes. Cloud commit: `feat: integrate component evidence into audit diagnostics`. Следующий шаг — live mappings.

## Задача 6. Адресная Figma-сверка, mappings и generated projection

**Files:** Только `evidence_links` разрешённых записей в трёх registries; `core/component-contract-standard.md`, `scripts/lib/component-registry-doc.mjs`, generated docs из таблицы; extend `tests/components/component-registry-doc.test.mjs`, `tests/components/figma-component-description.test.mjs`; Create `tests/rendering/evidence-metadata-isolation.test.mjs`, `tests/generation/evidence-metadata-bundle.test.mjs`.

**Interfaces:** Data links используют форму задач 1–5. Registry renderer печатает canonical link IDs/source→target/owner без stored value или статуса «проверено»; `listComponentDocumentationSections` учитывает наличие ссылок для существующей секции dependencies. Compact renderer не меняется.

- [ ] Зафиксировать новый code SHA. Прочитать навыки `figma` и `figma:figma-use`, затем выполнить read-only MCP capture новыми средствами. Не менять Figma. Для задачи создания mappings сначала resolver `library-maintenance/read-only/both` с указанными ниже 12 IDs на том же SHA; paused используется только в границах этого плана. Старый migration-progress bundle полностью заменить, не дополнять вручную.
- [ ] **8 разрешённых writers:** shared `email-template`, `asset-header-logo-4x`, `asset-header-logo-compact-4x`; marketing `email-header`; service `asset-status-badge-positive-4x`, `asset-status-badge-negative-4x`, `block-personal-data-update`, `block-receipt-info`. **4 read-only targets:** `asset-product-logo`, `icon-lock-password-fill`, `icon-user-forbid-fill`, `icon-receipt-fill`. Node IDs брать из закреплённых records; spec примеры — точки проверки, не готовые разрешённые live значения.
- [ ] Снять полные нужные source/target варианты и реальные overrides. Перед записью каждого mapping повторно подтвердить точные node/path/owner в текущем сеансе; если лимит/связь прервались — записать last verified scope и остановить оставшиеся mappings, не переносить старые packets как свежие. Новые чужие расхождения сообщить, числовые facts не исправлять.
- [ ] Собрать transient proposed records, прогнать новый checker; этот dry run не является canonical CLI приёмкой и не заменяет cloud publication. В Template должно быть 9 assertions задачи 3. В S1 число берётся из полного фактического traversal, не подгоняется под заранее желаемый счётчик. Иконкам без найденного consumer не создавать вымышленных links.
- [ ] Написать generated/isolation tests: в полном registry служебные ссылки появляются ровно в deps section; compact descriptions всех 61 records равны baseline. Synthetic metadata add/remove не меняет `buildRenderImpactProjection`, `asset_contracts`, результат `renderEmailDocument` representative Header/PersonalData/Receipt моделей на Mobile/Desktop и projected `bundle.components` двух email routes. При сравнении всего bundle разрешено отличаться только штатным source/version digest полям и тексту обновлённого Core, не rendering inputs. RED ожидается для ещё не реализованного вывода links; isolation assertions — сохраняемые GREEN-контроли, их искусственно не ломать.
- [ ] Terra RED: `node --test tests/components/component-registry-doc.test.mjs tests/rendering/evidence-metadata-isolation.test.mjs tests/generation/evidence-metadata-bundle.test.mjs`; тесты synthetic и явные, не новые визуальные эталоны «на глаз».
- [ ] Добавить только подтверждённые metadata; не менять `contracts`, `asset_contracts`, `variants`, `properties`, `provenance`, fingerprint или общий `verified_at` как будто перепроверен весь record. Core — короткое правило ownership/fresh evidence; не копировать туда component IDs/числа/план. Generated вывод — без foundation value dereference, поэтому расширение его manifest inputs не требуется.
- [ ] Publish data/projection candidate, получить новый exact-SHA snapshot, создать новый session и адресно перечитать source/target/owner уже для этого SHA. Запустить настоящий canonical CLI по всем восьми owners. Сверить successful/missing/mismatch пообъектно; отдельно сохранить прежние scalar issues. Не ставить всему компоненту PASS только по секции links.
- [ ] Terra GREEN targeted tests + `tests/components/figma-component-description.test.mjs`, validator/generate-check. Сравнить компоненты с базой c076: кроме schema_version и восьми `evidence_links` никаких различий. Generated typography/asset body неизменны, naming reference побайтово прежний. Cloud commit(s): `feat: bind verified Template and Shared evidence sources` / `docs: project service evidence links without render changes`. Следующий шаг — итоговый gate этого ремонта.

## Задача 7. Итоговая проверка и возврат в P2

**Files:** Этот под-план и текущие status/журнал родительского cutover plan/roadmap. Production files не добавлять к allowlist по результатам тестов без отдельной оценки влияния.

**Interfaces:** Consumes итоговые canonical records/checker/reports и base `c076…`; produces exact-SHA локальный receipt, перечень закрытых T1/S1 obligations и незакрытых P2 diagnostics, без нового runtime status.

- [ ] Координатор self-review: покрытие каждого §spec задачами 1–6; отсутствие HTML/asset/core-value changes; честная граница P3. Проверить cloud diff, mapping ownership и запрет изменения #109. Обнаруженные неоднозначные контракты не исправлять в обход согласования.
- [ ] Terra на финальном exact cloud SHA: raw blob hashes до/после, `npm run verify`, `node scripts/generate-docs.mjs --check`, применимые существующие `bootstrap/verify.ps1` и `tests/bootstrap-contract.Tests.ps1`. Если npm недоступен, использовать документированный прямой Node-эквивалент команд package.json с тем же списком тестов и явно указать это в receipt. Никаких Actions. Полные logs остаются у Terra; координатор получает краткий итог.
- [ ] Применить сохранённый baseline факт-аудита только как regression-вход, не fresh evidence: до/после сравнить полные объекты issues, отдельно объяснить допустимые изменения metadata/version diagnostics. Fresh T1/S1 acceptance — только новые MCP sessions задачи 6. Не считать прежний полный тестовый PASS на `78aaf0b9` финальным тестом нового кода.
- [ ] Для одинаковых моделей/ссылок/контрактов HTML должен совпасть побайтово; если отличается, остановить приёмку и найти источник, а не обновить эталон. Поскольку expected HTML идентичен, новый рендер пользовательских писем или visual gate не требуется. Если выяснится, что требуется изменение стратегии HTML/layout, это за пределами данного плана.
- [ ] В родительском журнале: точные SHAs/receipts, проверенные owners и поля, количество обязательных/verified/missing links, причины непройденных, preserved scalar diagnostics. Пометить T1/S1 выполненным только по этим результатам; остальные significant facts/F2/F7, alias dedup и P3 остаются открытыми.
- [ ] Остановиться: сообщить результат и следующий незакрытый пункт P2 по родительскому плану. Не сливать автоматически и не начинать P3/#109. Merge — только после отдельной команды пользователя и локального gate точного финального commit.

## Порядок исполнения и остановки

Последовательность: 1 → 2 → 3 → 4 → 5 → 6 → 7. После каждой задачи — короткий итог и название следующей; targeted проверки не являются merge gate всего PR. При новом лимите Figma сохранить уже проверенный scope в родительском журнале и остановить зависящие от MCP записи. Независимые synthetic tests допустимы, но ими не закрывать live obligations.

Этот план описывает implementation, не повторяет глобальную очередь. P3 должен отдельно подключить готовые service metadata/необходимые sources к maintenance bundle и workflow; наличие checker не включает маршрут. Библиотечная T1-сверка не объявляет проверенным Template-инстанс каждого будущего письма.

## Self-review плана

- Spec §§2–4 → задачи 1, 3, 4; §5 → задачи 2–5; §6 → задачи 5–6 и сохранённый P3 handoff; §§7–9 → задачи 6–7.
- Входные/выходные функции заданы выше один раз; implementation не начинается с выдумывания второго API или реестра.
- Пять Review Focus cases имеют конкретные negative assertions; source digests не перепутаны с rendering equality.
- План подтверждён; задачи 1–2 реализовали формат/offline validation и fresh capture/canonical-session inputs без реальных links. Live проверки, mappings и общий gate остаются задачами 3–7.
