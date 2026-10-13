# Email System Remediation Implementation Plan

## Состояние реализации и остановка — 2026-10-13

Последнее указание пользователя: после приёмки шага 9 сохранить прогресс во всех активных планах и остановить работу чата. Шаг 9 принят в ветке [PR #134](https://github.com/flabenar-maker/e-mail/pull/134); actual finalizer `accepted`, workflow `complete`. Слияние не выполнялось. Реализация ведётся последовательно в одном PR #134; остальные открытые PR служат источниками, #127 исключён как низкоприоритетный. Этот статус уточняет прежние организационные указания плана и исторические записи ниже.

| Шаг | Текущий статус | Принятая версия |
| --- | --- | --- |
| 1 | Принят в ветке PR #134 | `c0808e1e` |
| 2 | Принят в ветке PR #134 | `9d1a19c8` |
| 3 | Принят в ветке PR #134 | `81052bdc` |
| 4 | Принят в ветке PR #134 | `5b557800` |
| 5 | Принят в ветке PR #134 | `e306f000` |
| 6 | Принят в ветке PR #134 | `5dbbaec6` |
| 7 | Принят в ветке PR #134 | `373934ba` |
| 8 | Принят в ветке PR #134 | `1e5e49be` |
| 9 | Принят в ветке PR #134 | `74857314` |
| 10 | Не начат; следующий после отдельного продолжения | — |
| 11 | Не начат; после 10 | — |
| 12 | Не начат; после 11, только доказанные причины | — |

Шаг 9: полный локальный прогон точного `7485731436f37d70b083128e9065c169cba31a35` — **2438 PASS / 0 FAIL / 0 SKIP**, включая 28 новых случаев; validator/generated/runner exit 0. Предыдущие 86 targeted PASS относятся к `fcf2d9f3`, два focused controls — к `74857314`; результаты не переименовываются под документные коммиты. Full receipt SHA256 `565c7585fe7712225a57819d0791c2703be8a8a172888b4145519996f2e8e47e`; независимая typed review receipt `70fdaa62bd125e63775bdc0f884317a9fad917a2f7563b230e6c60b8009a4a0a`.

Визуальная приёмка ограничена локальным Chromium и публичными synthetic fixtures: исходный корпус 80 native + 4 gallery и одна дополнительная диагностическая пара с четырьмя снимками. В паре доказаны одинаковые фактически возвращённые браузером JPEG-байты, computed styles/геометрия и Hero-пиксели; полный diff состоит только из согласованных CTA и badge изменений. Report SHA256 `65b1c69b085e0bfa1853659f746ead54ac8adf52ebd81a0abb864fafe6ca67b7`. **Причина исторического расхождения Hero в GREEN Altcraft Desktop остаётся UNKNOWN**; исходные 144119 изменённых пикселей и доказательства сохранены. Canvas-readback завершился SecurityError, трассировка достигла 16 MiB и неполна. Это scoped image-preservation acceptance, без причинного объяснения старого снимка или утверждения fidelity частной Figma/внешних почтовых клиентов.

Точка остановки: шаги 1–9 приняты; шаги 10–12 не реализованы. Следующее отдельное продолжение начинается с детализации шага 10 FIRST, затем тестов и реализации; за ним последовательно 11 и 12. Actions/PR Checks не используются. Документные коммиты с этой отметкой проверяются отдельно и не обозначаются как новый runtime full PASS.

**Выключение компьютера отменено пользователем при обоих исходах. Компьютер остаётся включённым.** Граница <=5% оставшегося лимита требует сохранения и безопасной остановки owned работы без выключения; текущий запуск останавливается по указанию пользователя после принятия шага 9.


> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Устранить R1–R6 и подтверждённые причины открытых PR точечными изменениями с проверяемым порядком и сохранением защит выпуска.

**Architecture:** Независимые resource/dependency/asset исправления отделены от source/model/release gates. Общие orchestration и interpreter файлы меняются последовательно; renderer создаёт candidate, независимый reviewer подтверждает его, затем публикуются те же bytes. Форму #128 и E08 реализовать одним PR.

**Tech Stack:** JavaScript ESM, Node `>=24 <25`, `node:test`, существующие Ajv/lock и локальный browser; без новых зависимостей, кроме совместимого lock обновления R4.

**Spec:** [Актуальная перепроверка R1–R6 и открытых PR](../specs/2026-10-13-email-system-remediation-recheck.md).

## Global Constraints

- Сейчас разрешены только новый draft planning PR и метка `план: порядок реализации`; реализация, merge, установка навыков и Figma writes требуют отдельного задания.
- Canonical base `b8ee255bde370a9b932cf36071904be771d86d8e`; перед каждой реализацией закрепить свежий main и перечитать primary sources после prerequisite merges.
- Постоянный источник изменений — cloud repository; disposable точный локальный snapshot используется только для чтения/проверки, не как источник редактирования.
- Routine tests/regressions и все visual comparisons делегируются агенту на выбранной пользователем модели; bounded brief, supported effort с quality cushion, без смены модели. Coordinator получает только run/fail/root cause/changes/status.
- Исполнитель и независимый reviewer различаются; architecture/ambiguous contracts или 2–3 неудачных ремонта возвращаются coordinator. Не эскалировать обычные визуальные различия.
- Только локальные exact-SHA результаты; не запускать, читать или использовать Actions/PR Checks. Требуемая protection check — blocker, без обхода.
- Email schema `1.1.0`, delivery schema `1.0.0`, current ID formats/managed URLs/visibility/projection и geometry/alpha/hash/profile gates сохраняются.
- Fast-uri `>=3.1.8` в `3.x`; Ajv `8.20.0` не обновлять major ради R4.
- Private emails/captures/assets остаются локально; generated docs изменяются только штатным generator, когда manifest требует.
- `external_acceptance: not-run` до реального внешнего import/send/client результата; browser PASS его не заменяет.

## Review Focus

- Сериализованный `url(&quot;images/...&quot;)`, entity/percent escaping и VML: Task 1 покрывает разрешение package path, отказ для чужих ресурсов и сохранение action href.
- Повтор bare ID под разными родителями и hidden subtree: Task 3 блокирует до Map overwrite, валидный общий Mobile/Desktop instance проходит.
- Изменённая normalized модель/источник/asset/candidate после visual receipt: Task 5 аннулирует proof и не публикует финальную папку.
- Typed rich-text changed runs проходят реальный prepare CLI без потери label mapping: Task 10 проверяет intake/inventory/digest/final render, не только unit helper.
- Ссылка/junction ведёт наружу либо asset меняется после проверки: Task 6 блокирует escape и публикует только ранее проверенные buffers.

---

## Очередь документов и очередь кода

Новый центральный planning PR рассматривается первым. Логический порядок принятия существующих документов: **#130 → #132 → #131 → #128**. Это порядок согласования связанных требований, не утверждение, что markdown files технически зависят друг от друга. **#129 независим и может идти первым. #127 крайне низкий, заморожен до отдельного явного решения.** Ни один docs merge сам по себе не реализует описанные исправления.

После отдельного разрешения на реализацию предлагается очередь ниже. Имена будущих PR семантические и предварительные, номера не созданы.

| Очередь | Будущий PR | Настоящая зависимость / сериализация |
| --- | --- | --- |
| Срочно, независимо | `fix: serialized package resource paths` (Task 1, R1) | Не ждёт source/interpreter/form fixes |
| Первая source lane | `fix: physical root-slot projection` (Task 2, #130/E13) | Нужен перед concrete-email source proof и интеграцией Task 5; synthetic work остальных не блокирует |
| Перед binding/inventory | `fix: logical instance identity guard` (Task 3, R3) | До R2 bare-ID binding и #128 inventory changes |
| Перед R2, общий файл | `fix: required workflow identity fields` (Task 4, R5) | Может идти независимо от root fixes, но сериализуется с Task 5 в orchestration |
| После 2/3/4 | `fix: current source candidate release binding` (Task 5, R2) | Source/model dependencies обязательны; candidate review перед release |
| Независимая bounded lane | `fix: contained asset byte publication` (Task 6, R6) | Общие render/output файлы сериализовать с Tasks 1/5; отдельный technical результат |
| Независимая maintenance lane | `fix: compatible fast-uri advisory update` (Task 7, R4) | Не ждёт renderer/source/form |
| До NPS | `fix: compact runtime variants and naming guidance` (Task 8, #132/E04/E05) | Synthetic acceptance независима от #130; interpreter changes сериализуются далее |
| После 8 | `fix: serialized CTA alignment and significant labels` (Task 9, #132/E14/E15) | Общий interpreter, перед Task 11; concrete-email proof после Tasks 2/5 |
| После 3, один form PR | `feat: compact missing-link form and optional review` (Task 10, #128/E08) | R3 — техническая зависимость inventory. После #132/#131 docs для согласованной spec; E08 не второй PR |
| После 8/9 | `fix: full NPS option link area` (Task 11, #131) | Compact selector correctness и сериализация interpreter; concrete proof после 2/5 |
| После 9/11 | `fix: measured element geometry contributors` (Task 12, #132/E17) | Только доказанные причины, не глобальная высота. Неизвестный residual остаётся diagnosis |

Tasks 1/7 не обязаны ждать друг друга. Tasks 2/3 и synthetic Task 8 допускают независимую подготовку; не вести одновременные edits одного файла. Для shared render/output ownership сначала завершить Task 1, затем candidate/release Task 5, затем Task 6. Для interpreter последовательно 8 → 9 → 11 → 12. Form Task 10 имеет отдельного владельца и не дублирует E08.

## Карта файлов и общий выпускной gate

Task blocks ниже содержат exact existing files/tests и предложенные bounded interfaces. Новая функция явно помечена proposed; никаких универсальных execution envelopes или вторых validator frameworks. Primary current sources и immutable head links всех шести PR находятся в spec; читать документы, а не только PR body.

**Gate F для каждого runtime PR:** targeted red test действительно падает по нужной причине; минимальное изменение; targeted green; cloud commit; disposable локальный snapshot точного финального SHA; делегированные `npm run verify` и `npm run generate:check` → exit 0; независимый reviewer сопоставляет spec/diff/results; новый draft implementation PR. Любая последующая правка делает старые результаты непригодными для нового SHA. Merge и установка не выполняются автоматически.

**Docs gate D:** allowed-path diff, unchanged base blobs, LF/UTF-8, relative links, один appended central link и independent primary-source review. Полный runtime suite для текущего docs-only PR не требуется и не заявляется. Для rebased #127/#130/#131/#132 сохранять все разделы system-status и заново проверить exact resulting commit. #128 проверяется как два docs; #129 повторно проверяет три skill/router/execution-boundary suites на resulting SHA.

### Task 1: R1 — serialized package resource paths

**Files:** Modify `scripts/lib/email-resource-references.mjs`; Test `tests/rendering/email-resource-references.test.mjs`, `email-primitives.test.mjs`, `email-html-serializer.test.mjs`, `email-altcraft-package.test.mjs` (все под `tests/rendering/`). Serializer менять только если offset probe доказывает его дефект.
**Interfaces:** Preserve `collectResourceReferences({html})` offsets и `rebasePackageResources({html,assetPaths,htmlEntry,assetRootEntry}) -> {html,references,diagnostics}`. Private proposed `decodeCssResourceValue(raw: string): string`; HTML entities распознаются в CSS wrapper без потери offsets.
**Acceptance:** Каждый объявленный ресурс serialized HTML разрешается к exact entry `images/...` из `email/html.html`; href actions и opaque service fragments сохраняются.

- [ ] Add red cases `serialized css entity quotes rebase into ZIP`, `CSS VML background share declared resource`, `unsafe encoded css resource fails closed`: литералы `url(&quot;images/card.png&quot;)`, `url(&#39;images/bg.png&#39;)`, `url(&#x27;images/bg.png&#x27;)`, HTML background и CSS/VML; expected relative resource `../images/card.png`, ZIP содержит exact image bytes.
- [ ] Delegate `node --test tests/rendering/email-resource-references.test.mjs tests/rendering/email-altcraft-package.test.mjs`; новые valid-path assertions FAIL на текущем collector. Отрицательные remote/data/absolute/traversal/case/undeclared cases остаются blocked; encoded action href unchanged.
- [ ] Implement bounded collector decoding с заменой только span ресурса; не делать глобальный HTML unescape/regex replacement. Сохранить entity/percent representation там, где она нужна serializer.
- [ ] Delegate green command плюс primitive/serializer suites; unpack synthetic ZIP и проверить разрешение всех ссылок resources. Проверка реального клиента не заявляется.
- [ ] Apply Gate F; отдельный commit `fix: rebase serialized CSS package resources`.

### Task 2: #130/E13 — physical root-slot projection

**Files:** Modify `scripts/lib/email-source-visibility.mjs`; Test `tests/rendering/email-instance-visibility.test.mjs`, `tests/skills/email-source-fidelity.test.mjs`, `email-source-cli.test.mjs`, `email-build-handoff.test.mjs` (последние три в `tests/skills/`).
**Interfaces:** Preserve `verifyEmailModelSource({model,readings,correspondence,resolvedContracts,selectedTest,authorizedInputs=[],assetEvidence=[]}) -> diagnostics[]`; proposed private `projectInstanceDescendantNodeId(ownerNodeId,nativeNodeId): string|null` используется обеими branches `expectedNode()`.
**Prerequisite:** Принят spec #130; для private concrete-email replay отдельно разрешены неизменённые локальные inputs. Synthetic graph достаточен для первой red/green проверки.

- [ ] Add red literals Mobile `I2021:4164;1103:7`, Desktop `I2021:4163;1103:8`; root stays `2021:4164`; nested owner `I2021:4164;1103:7;1104:1` + native `I1200:1;1200:2` gives full chain с одним начальным I.
- [ ] Delegate `node --test tests/rendering/email-instance-visibility.test.mjs tests/skills/email-source-cli.test.mjs tests/skills/email-build-handoff.test.mjs`; physical valid graph FAIL до изменения. Wrong owner/viewport/order/ancestry/hidden/unregistered slot evidence остаются diagnostics.
- [ ] Implement exact native/owner composition по существующему projectedNodeId convention; invalid inputs return null. Не переименовывать captured nodes и не принимать synthetic fallback в production.
- [ ] Delegate green плюс source-fidelity; production CLI без selected-test проходит valid full-email graph, foreign slot блокирует renderer. Исторические 26 errors не выдавать за свежий replay без фактического прогона.
- [ ] Apply Gate F; `fix: project physical email root-slot IDs`.

### Task 3: R3 — identity до bare-ID индексов

**Files:** Modify `scripts/lib/email-model.mjs`; Inspect `scripts/lib/email-renderer.mjs`, `email-source-fidelity.mjs`, `email-source-visibility.mjs`, `email-action-inventory.mjs`; conditional Modify только точного direct public entrypoint, если тест доказывает обход semantic guard или прежнего equivalent rejection; Test `tests/rendering/email-model.test.mjs`, `email-interpreter.test.mjs`, `email-action-inventory.test.mjs`, `tests/skills/email-source-fidelity.test.mjs`, `email-source-cli.test.mjs`, `email-build-handoff.test.mjs` (последние три в `tests/skills/`).
**Interfaces:** Preserve `validateEmailModelSemantics(model,dependencies,options={})`; proposed shared export `validateEmailInstanceIdentities(model) -> diagnostics` даёт `EMAIL_MODEL_INSTANCE_DUPLICATE` с обеими JSON locations, вызывается semantic validator до viewport visibility и Map creation. Inventory уже вызывает semantic validation до indexDeliveryInstances, поэтому получает guard без дублирующей правки. Production source verifier уже использует uniqueIndex по bare instance_id и блокирует duplicate; сохранять существующий диагностический контракт, менять source только при доказанной недостаточности. Shared export повторно используется direct renderer entrypoint лишь при установленном обходе guard.
**Rationale:** Existing assembly standard уже требует unique bare ID. Distinct parent paths не защищают current `byId`/mappedInstances Maps. Path guard delivery остаётся дополнительной защитой; формат IDs не меняется.

- [ ] Add red `duplicate sibling never overwrites first`, `duplicate across slots nested hidden blocked`: одинаковые bare IDs у root/descendant, разных родителей/slots/nested, hidden vs visible дают diagnostic; HTML/ZIP/intake не создаются.
- [ ] Delegate `node --test tests/rendering/email-model.test.mjs tests/rendering/email-action-inventory.test.mjs tests/skills/email-build-handoff.test.mjs`; новые direct semantic/render cases FAIL по отсутствующему early diagnostic; existing source global duplicate rejection и delivery path rejection должны уже PASS. Не заявлять отсутствующую production source защиту.
- [ ] Implement one tree traversal root → slots → nested, до фильтрации visibility; valid normalized IDs сохранять, не генерировать новые IDs и не менять public schema.
- [ ] Delegate green; positive unique descendants сохраняют оба markers, shared Mobile/Desktop logical instance проходит один раз; output exact order/URL assets unchanged. Все public paths достигают guard.
- [ ] Apply Gate F; `fix: reject duplicate logical instance identities`.

### Task 4: R5 — identity presence перед equality

**Files:** Modify `scripts/lib/email-build-orchestration.mjs`; Test `tests/skills/email-build-orchestration.test.mjs`, `email-build-handoff.test.mjs`; Inspect `data/workflows/email-build.yaml` (существующее relation definition, менять только при доказанной необходимости).
**Interfaces:** Preserve `resolveEmailBuildRequest({workflow,inputs}) -> {mode,blocker,allowedOutputs}`; relationBlocker сначала проверяет `hasValue` каждого `inputs[id][relation.field]`, затем ordered/equality relation. Внутренний Task 5 adapter `emailId -> email_id`, без глобального rename.
**Prerequisite:** Нет source dependency; сериализовать orchestration edits с Task 5.

- [ ] Add red `both same-field identities absent block`, `one absent identity blocks`, `blank null undefined identities block`, `different valid emailId blocks`; assert blocker equals declared relation blocker, outputs `[]`.
- [ ] Delegate `node --test tests/skills/email-build-orchestration.test.mjs`; absent pair currently проходит, red должен фиксировать именно это.
- [ ] Implement presence check только relation fields; сохранить mode selection, configured blocker и ordered-field behavior. Не заставлять несвязанные optional inputs становиться required.
- [ ] Delegate green plus handoff; matching nonblank emailId и correct ordered Mobile/Desktop проходят, no-output на mismatches, valid new-build/text/link-only regressions сохраняются.
- [ ] Apply Gate F; `fix: require workflow identity values before comparison`.

### Task 5: R2 — source → candidate → review → release

**Files:** Modify `scripts/lib/email-build-orchestration.mjs`, `scripts/render-email.mjs`; reuse `scripts/verify-email-source.mjs`, `scripts/verify-real-email-visual.mjs`, `scripts/lib/email-output.mjs`; Test `tests/skills/email-build-handoff.test.mjs`, `email-source-delivery.test.mjs`, `verification-runner.test.mjs`, `tests/rendering/email-delivery-link-only.test.mjs`, `email-preview.test.mjs`.
**Prerequisites:** Tasks 2/3/4; refreshed main и source fixture с physical root IDs. R1 уже завершён перед shared release edits.
**Proposed interfaces:** Add trusted `selectedSourceBinding` к `executeEmailBuildHandoff`, REQUIRED и validated для protected `new-build`/`continue-fix-design` modes; absent/null/blank/invalid binding блокирует до candidate. В других modes optional только по действующим границам technical/text/link-only. Shape: `{email_id:string,file_key:string,roots:{mobile:string,desktop:string},source_sha:string,model_digest:string}`. Binding поступает от coordinator-selected current source, а не из continueFixEvidence. `model_digest` — SHA-256 exact persisted final normalized model UTF-8 bytes, после current delivery projection/масок.
**Proposed callback:** `candidateReviewer({candidateDir,selectedSourceBinding,sourceComparisonRef}) -> Promise<VisualVerificationContext>`; context имеет existing `{inputRefs,referenceRoot,inputRoots,identity,reviewQualification}` для `verifyRealEmailVisual`. Existing `rendererRunner({repoRoot,modelPath,outputDir,deliveryPath,sourceSha})` signature сохраняется; его outputDir для protected workflow — isolated candidateDir, не final outputDir.
**Owned boundary:** Orchestrator фиксирует final normalized model bytes один раз; production source verification проверяет эту же модель, current roots/email/file/system SHA и actual applied scoped change, а не unrelated passed object. Renderer использует ту же подготовку current URL projection и не нормализует иной результат молча. Candidate entries читаются/хешируются до review и после сверяются; финальная публикация `publishFileSetAtomically({outputDir,entries})` использует frozen checked buffers, без повторного render.

- [ ] Add red source cases: absent/null/blank/invalid selectedSourceBinding; pair internally equal but other email/file/root/SHA; changed final model digest; selected-subtree/selected-test; scoped change absent from comparison; continue-fix skips source. Assert no candidate, no final folder, meaningful existing blocker.
- [ ] Add red release cases: bare `passed/reference_id/render_id`; missing receipt; same executor/reviewer; wrong selected model/effort; missing reviewed images/category; edited candidate/model/asset after review. Assert final folder absent, no publication; review cannot be supplied before candidate.
- [ ] Delegate `node --test tests/skills/email-build-handoff.test.mjs tests/skills/email-source-delivery.test.mjs tests/skills/verification-runner.test.mjs`; prove separate missing binding/source/release guards on actual handoff.
- [ ] Implement minimal selected binding adapter, reusable production source gate for new-build and design change before candidate. Replace continueFix arbitrary visual IDs with strict post-candidate helper; preserve technical/text/link-only routes and current masks/URL projection. Не требовать новый дизайн-review для чистого изменения URL/text, когда действующий workflow его не требует.
- [ ] Bind existing visual receipt `identity.source_sha/artifact_digest` к selected SHA и candidate manifest digest; model inventory digest к exact normalized bytes; reference/render inventories ко всем Mobile/Desktop images. Qualified actual independent reviewer examines six categories, callback itself не доказательство acceptance.
- [ ] Delegate green source/release suites plus delivery-link-only/preview. Positive complete current source → candidate → strict independent accepted review publishes byte-identical HTML/ZIP/assets; unchanged valid new-build and technical/text/link-only остаются supported.
- [ ] Delegate actual synthetic candidate/render/reference visual comparison отдельному агенту; private concrete-email proof только отдельно разрешёнными inputs. Apply Gate F; `fix: bind current email evidence to reviewed release bytes`.

### Task 6: R6 — общий loader проверенных bytes

**Files:** Create `scripts/lib/email-asset-bytes.mjs`; Modify `scripts/render-email.mjs`, `scripts/render-email-preview.mjs`, `scripts/lib/email-output.mjs`; integrate containment reuse in `email-build-orchestration.mjs` only where повторное чтение требуется; Test `tests/rendering/email-output.test.mjs`, `email-altcraft-package.test.mjs`, `email-preview.test.mjs`, `tests/skills/email-build-handoff.test.mjs`.
**Proposed interfaces:** `readContainedAssetBytes({assetRoot,assets}) -> Promise<Array<{path:string,bytes:Buffer}>>`; normalized `images/...`, physical root/target containment, regular files, target case/collision checks. `publishEmailAtomically({outputDir,html,assets,assetRoot})` сохраняет existing asset descriptors, читает их через helper и пишет checked bytes; CLI передаёт modelFolder как trusted assetRoot. Все существующие file-backed callers и их tests передают trusted root явно; missing-root file-backed call fail closed. При нуле assets вызов без root сохраняется. Никогда не выводить root из sourcePath. ZIP использует тот же helper.
**Prerequisite:** Serialize shared render/output with Tasks 1/5. Existing contract PNG geometry/alpha/hash rules не заменяются loader и не ослабляются.

- [ ] Add red direct CLI ZIP и folder cases: symlink/junction file or directory outside assetRoot, wrong type, missing trusted root для file-backed call, traversal/absolute/case collision, source changed between check/publication. Assert failure и no final output.
- [ ] Delegate `node --test tests/rendering/email-output.test.mjs tests/rendering/email-altcraft-package.test.mjs tests/rendering/email-preview.test.mjs`; escape must fail on actual entrypoints, not helper-only simulation. Platform inability create junction записать limit, не PASS.
- [ ] Implement bounded one-read buffers; resolve physical containment до read, validate file identity around read where available, reject target changes; publish frozen validated buffers instead of stat→copy/re-read. No new arbitrary size limits/profile rewrite.
- [ ] Delegate green plus handoff; zero-assets без root, normal in-root files/nested images and допустимый in-root link проходят одинаково; mutation after successful read either rejected or checked original buffers publish, никогда replacement bytes.
- [ ] Apply Gate F; `fix: publish physically contained checked asset bytes`.

### Task 7: R4 — compatible fast-uri maintenance

**Files:** Modify `package-lock.json`; `package.json` only если targeted supported override нужен; Test existing `tests/foundation/schema-validation.test.mjs`, `validator-cli.test.mjs`, `tests/skills/skill-context.test.mjs`.
**Interfaces:** Ajv public behavior и renderer APIs unchanged; resolved fast-uri `>=3.1.8 <4`, integrity согласован с lock. Advisory источник/affected range перепроверить перед actual update, текущий аудит не выдумывать.

- [ ] Зафиксировать failing baseline по exact lock/advisory inspection: resolved fast-uri `3.1.6` попадает в affected ranges двух primary GHSA; новый version-only unit test не создавать. Сохранить существующие behavioral schema/URI valid и invalid examples (relative/absolute/ref/escaped cases).
- [ ] Delegate targeted schema/validator suites и fresh lock inspection; record affected dependency path, без reliance on Actions. Fresh audit outcome отдельно от version check.
- [ ] Update targeted lock resolution в compatible 3.x; no broad dependency refresh, unrelated lock entries preserved.
- [ ] Delegate green targeted suites, fresh advisory check; если network advisory unavailable, отметить limitation вместо clean verdict. Apply Gate F.
- [ ] Independent reviewer checks minimal lock diff, resolved version/integrity and Ajv behavior; commit `fix: update fast-uri within compatible major`.

### Task 8: #132/E04/E05 — compact runtime variants/naming

**Files:** Modify `scripts/lib/context-bundle.mjs`, `scripts/lib/email-interpreter.mjs`, `core/email-model-assembly-standard.md`; Inspect `scripts/lib/component-registry.mjs`, conditional Modify только при доказанной необходимости за пределами private runtime collector; Test `tests/generation/context-bundle.test.mjs`, `context-bundle-cli.test.mjs`, `evidence-metadata-bundle.test.mjs`, `tests/rendering/renderer-contract-semantics.test.mjs`, `tests/skills/email-build-handoff.test.mjs`.
**Interfaces:** Preserve context bundle public shape and `selectVariantRoot(component,viewport,variantAxes={})`; compact contracts retain variant roots plus minimal base runtime identity/selector. Proposed private `collectRuntimeComponentReferences(component,viewport)` в context-bundle используется recursive/projected/foundation/closure путями, обходит все runtime roots только выбранного viewport и исключает metadata keys; common registry collector не менять без доказанной необходимости. Invalid selector emits diagnostic rather than base fallback.
**Prerequisite:** #132 spec accepted; synthetic fixtures independent of #130. Interpreter serialized before Task 9/11.

- [ ] Add red compact NPS Count=2/3/999 in both viewports; Count=2 excludes neutral; Count=3 includes neutral; 999 blocked; variant-only nested asset/foundation dependency present. Evidence/provenance bulk remains absent.
- [ ] Delegate `node --test tests/generation/context-bundle.test.mjs tests/generation/context-bundle-cli.test.mjs tests/generation/evidence-metadata-bundle.test.mjs tests/rendering/renderer-contract-semantics.test.mjs`; new compact cases FAIL on silent base fallback/closure.
- [ ] Implement minimum runtime variant selector/private closure в context-bundle, single-viewport filtering и metadata-key exclusion; no restoration всех design-time graphs или unconditional common registry rewrite. E05 instruction mirrors existing suffix/profile basename rules; guards unchanged.
- [ ] Delegate green plus handoff; full and compact inputs select equivalent runtime trees, irrelevant contracts excluded, naming matches current export profile.
- [ ] Apply Gate F; `fix: preserve compact runtime variant selection`.

### Task 9: #132/E14/E15 — serialized alignment/whitespace/hug

**Files:** Modify `scripts/lib/email-interpreter.mjs`; Test `tests/rendering/pilot-email-fidelity-feedback.test.mjs`, `pilot-fidelity-regressions.test.mjs`, `renderer-contract-semantics.test.mjs`, `html-invariants.test.mjs`.
**Interfaces:** Existing interpreter/propsFromFacts/whole-button paths; choose alignment by child render-mode/layout and actual wrapper, не first HTML character. Significant single-line hug label uses local whitespace style; width_and_height не ограничивается reference max-width.
**Prerequisite:** Task 8; serial CTA correction before NPS and residual geometry measurements.

- [ ] Add red leading comment/conditional marker before nested CTA; presentation table centered with comments retained. «2  шаг»/«3  шаг» preserve two spaces in both viewports; single-space/body paragraphs wrap normally. Long hug beyond reference width expands; fixed/fill unchanged.
- [ ] Delegate `node --test tests/rendering/pilot-email-fidelity-feedback.test.mjs tests/rendering/pilot-fidelity-regressions.test.mjs tests/rendering/html-invariants.test.mjs`; red asserts actual final serialized output/DOM geometry, не internal helper flag.
- [ ] Implement structural wrapper selection/local white-space/width fact projection; no global table rewriting, arbitrary padding, marker removal or body pre formatting. Long hug is separate proven case, не причина исходных коротких labels.
- [ ] Delegate green plus renderer-contract suite and visual compare Hero/Steps/CTA/App-Download both viewports. Preserve live text, link, images, responsive wrappers and comments.
- [ ] Apply Gate F; `fix: preserve serialized CTA layout and significant labels`.

### Task 10: #128 + E08 — одна компактная форма

**Files:** Modify `scripts/lib/email-action-inventory.mjs`, `email-delivery-form.mjs`, `docs/user-guide.md`, `tests/fixtures/rendering/email-delivery-fixtures.mjs`; Test `tests/rendering/email-action-labels.test.mjs`, `email-action-inventory.test.mjs`, `email-delivery-form.test.mjs`, `email-delivery-reuse.test.mjs`, `email-delivery-link-only.test.mjs`, `email-delivery.test.mjs`. Conditional narrow Modify `scripts/lib/email-model.mjs`, `scripts/prepare-email-delivery.mjs`, `scripts/render-email.mjs` only to preserve validated current typed-run mapping through real intake/render.
**Interfaces:** Preserve `collectEmailActions({model,componentIndex,profile})`, `validateDeliveryDocument({document,inventory,profile,purpose,sourceSha?,emailId?})`, `projectDeliveryBindings({model,document,inventory,profile})`. Presentation metadata `{display_group:{id,label},display_context,viewport_hint:'Mobile'|'Desktop'|null}`. `renderDeliveryForm()` adds optional read-only known/managed review; pending controls still only missing links.
**Prerequisite:** Task 3 before inventory changes; accepted #128 spec reconciled with E08 from #132. No second form PR, extra Figma read or AI presentation generation.

- [ ] Add red exact labels: «Помощь» → current typed run «Поддержка»; shared two nonadjacent underline fragments omit middle text; emoji/newline; ambiguous scalar mapping blocks, never guessed substring. IDs/kinds/ranges/source bindings unchanged; label/group changes invalidate digest, old answers not migrated.
- [ ] Add red structural groups/repeated heading/card CTA/order/split counterpart hints; HTML-like captions escaped; optional review shows known/managed read-only, zero pending produces no mandatory questionnaire, no known value re-request.
- [ ] Delegate `node --test tests/rendering/email-action-labels.test.mjs tests/rendering/email-action-inventory.test.mjs tests/rendering/email-delivery-form.test.mjs tests/rendering/email-delivery-reuse.test.mjs`; expected new assertions FAIL.
- [ ] Add actual `prepare-email-delivery.mjs --model <synthetic> --output <new-intake>` integration: current changed rich-text run remains exact label; downloaded delivery JSON digest equals intake inventory; final `render-email.mjs` uses same binding/digest/run without stale/ambiguous failure. Unit raw-run fixtures alone insufficient because loadEmailModel currently scalarizes segments.
- [ ] Implement minimum validated loader/intake preservation if integration proves loss; preserve normalization and model schema for all existing callers. Implement deterministic compact template/metadata/optional review; no extra prompts, old answer migration or visibility/required/managed gate weakening.
- [ ] Delegate green all listed suites and actual CLI path; inspect downloaded JSON IDs/values/digests. Delegate browser visual/keyboard at 360/1280 px and 200% zoom, no horizontal page scroll; split pending half keeps correct hint. No new pixel baseline claimed.
- [ ] Apply Gate F; `feat: compact link intake with optional filled-link review`.

### Task 11: #131 — NPS whole-button area

**Files:** Modify `scripts/lib/email-interpreter.mjs`; `scripts/lib/email-renderer.mjs` only если existing output_origin недостаточен; Test `tests/rendering/nps-options-rounded-controls.test.mjs`, `renderer-contract-semantics.test.mjs`, `pilot-fidelity-regressions.test.mjs`, `email-instance-visibility.test.mjs`.
**Interfaces:** Existing `output_origin.component_id/original_element_id`, `renderWholeButtonAction()`; exact nps-options option owner + whole-element + href_slot. Standalone `renderContractTree` receives trusted existing component context; bare role/suffix не identity proof.
**Prerequisite:** Tasks 8/9; concrete-email proof after 2/5. Banner/Inline #127 excluded.

- [ ] Add red Count=2/3 × 320/360/600/720 px: anchor rect covers painted button within rounding 0.5 px; elementFromPoint center/edge/padding resolves each own URL; gaps/outside do not link. No nested anchors/shared group URL/table anchor.
- [ ] Delegate focused NPS/contract tests plus local browser hit-area: current uncovered padding FAIL; existing App-Download/CTA baseline PASS. Include hidden icon/parent, disabled image/alt, separate viewport URL/masks, standalone/scoped/nested paths.
- [ ] Implement narrow trusted owner detection and existing whole-button path first; private NPS-only fallback only when measured empty/line-height/height cases require it. Contract facts supply dimensions; no new fixed 44/54/84 px constants or global fonts.
- [ ] Delegate green all listed suites and independent visual comparison both viewports; preserve radii, icon rects/alt, order, padding, no neutral Count=2; visible missing URL still blocks, hidden absent assets/URL.
- [ ] Apply Gate F; `fix: cover each NPS option with its own link`.

### Task 12: #132/E17 — proven element geometry only

**Files:** Initially local measurement/diagnostic artifacts outside repo; if proven Modify narrow `scripts/lib/email-interpreter.mjs` or `scripts/lib/email-primitives.mjs`; Test `tests/rendering/pilot-fidelity-regressions.test.mjs`, `component-root-sizing-regressions.test.mjs`, `email-primitives.test.mjs`.
**Interfaces:** Existing public renderer + source DOM bounds/computed styles. Output evidence: 13 block deltas, wrapping/font/line-height/fractional image/baseline contributors and explicit unknown residual. No general geometry correction interface.
**Prerequisite:** Tasks 9/11 before final residual measurement; source selection accepted via Tasks 2/5. Измерение одной rect не автоматически равно изменению высоты блока.

- [ ] Delegate matched-width/font/assets source/render measurements, classify per-element contributors. If причина не доказана single-variable probe, keep diagnosis open and do not manufacture code PR.
- [ ] For each proved contributor add red literal bounds/wrapping expectation к owning suite; negative neighboring QR/image critical path must not acquire compensation. Delegate focused command с exact listed suite/test name.
- [ ] Implement one bounded cause per independently reviewable commit; preserve fixed/fill/hug and all registered design values. Не компенсировать сумму arbitrary padding/height, не менять контракт ради общего delta.
- [ ] Delegate green and per-block independent visual comparison; record corrected contributors and unknown residual separately. Small total delta не acceptance unknown contributors.
- [ ] Apply Gate F only if code changed; `fix: measured element geometry contributors` name уточнить по реальной причине.

## Отдельные решения и профилактика

- **E16 crop:** отдельно сравнить исходный Desktop, общий Mobile-cropped asset и достижимый output; пользователь выбирает точную совместимость/экспорт либо ограниченный результат. До решения contract/Figma/export model changes не разрешены; CSS не возвращает вырезанные pixels.
- **#127 Banner/Inline:** после отдельного explicit выбора прочитать frozen research/plan и recheck feasibility для всей матрицы почтовиков; browser prototype не доказывает совместимость. Приоритет остаётся крайне низким.
- **#132 профилактика:** E01 nullable только внутри registered artwork boundary; E02/E19 bounded complete reads; E03 hidden graph read; E06/E07/E09–E12 retain correct guards; E18 actual stdout CLI; E20 existing bound inventory; E21 actual receipt ref; E22 preserve failed source history; E23 supported file URL/browser/read-only screenshot; E24 correct harness inventory/viewport/text selectors. Это bounded tool guidance в maintenance инструкции, не новый renderer framework.
- **Deferred:** property-capture breadth и cache/optimization не относятся к current fixes; отдельная задача/доказательства, без включения в эту очередь.

## Приёмка планового PR и self-review

- [ ] Gate D на actual published planning commit: только spec/plan + append link в system-status; distinctive label, draft status, pinned main не изменился либо scope повторно согласован.
- [ ] Independent reviewer читает primary code и immutable head docs всех #127–#132, проверяет R1–R6 coverage, true dependencies vs shared-file serialization и source→candidate→review→release.
- [ ] Executor self-review: spec coverage R1→1, R2→5, R3→3, R4→7, R5→4, R6→6; #130→2, #132→8/9/10/12/separate decisions, #131→11, #128→10, #129 independent, #127 frozen. Gaps: только явно deferred/decision/external work.
- [ ] Type consistency: emailId existing resolver/delivery → explicit email_id adapter; source_sha/model_digest same selected binding; candidateReviewer returns strict existing visual helper context; final entries checked/frozen, no rerender after proof.
- [ ] Review Focus tied to tests Tasks 1/3/5/6/10; each code PR has named files/interfaces, red/minimal/green/local exact-SHA and independent acceptance. No implementation step marked complete by this planning document.

Этот PR согласует порядок. Исполнение и изменение существующих PR начинаются только отдельным заданием; текущая работа не сливает документы и не запускает исправления.
