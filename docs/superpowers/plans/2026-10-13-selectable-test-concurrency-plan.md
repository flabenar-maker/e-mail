# Selectable Local Test Concurrency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Дать пользователю один сохраняемый выбор параллельности локальных Node-тестов 2 или 4, который можно изменить позже без повторной диагностики ПК и повторных вопросов перед запуском.

**Architecture:** Предпочтение хранится в существующем профиле пары пользователя/ПК; resolver фиксирует его на request. Общий helper выводит effective source-approved команды и подписи для resolver/runner/acceptance. Базовая policy и legacy поведение на 2 сохраняются, локальный override 4 является явным ограниченным выбором.

**Tech Stack:** JavaScript ESM, Node >=24 <25, node:test, существующие Ajv и YAML; same-lock dependencies, без новых пакетов.

**Spec:** [Сохраняемый выбор 2/4](../specs/2026-10-13-selectable-test-concurrency-design.md).

## Global Constraints

- Этот коммит содержит только spec и plan; будущая реализация не выполняется им автоматически. User scope: planning + independent review + local plan checks on 4.
- Base parent PR #134: 7f03aaf9e66afc79ad7321f7d120152b17af6cda, runtime b766c52f639d45a3e098a00cfce2b80a3131673c. Перед реализацией закрепить разрешённую свежую cloud base и проверить конфликты с другими PR. Шаги 11/12 не входят в изменение.
- Разрешены ровно целые 2/4; legacy missing preference → 2; текущий пользователь уже выбрал 4. Выбор спрашивается один раз только при необходимости и сохраняется до явного изменения.
- Cloud execution остаётся на 2. Hardware thresholds, deadline 30 минут и max_heavy_batches 1 сохраняются.
- Schema_version 1.0.0 сохраняется; новые optional fields, strict additionalProperties и прежние default signatures 2. Snapshot/commands не переписываются для временной настройки.
- Source edits публикуются только в cloud; exact-SHA локальные снимки нужны для проверки. Private профили/инвентари/benchmark logs остаются локально.
- Routine tests делегируются на выбранной пользователем модели; effort с одним поддерживаемым шагом quality cushion. Independent reviewer и executor — разные actual agents. Actions/PR Checks не запускаются и не читаются.
- Merge, установка навыков и изменение живого пользовательского профиля требуют соответствующей отдельной области задания; данный план их не выполняет.

## Review Focus

1. Старый профиль без поля, профиль другой пары, повреждённый JSON и неизвестная базовая workload signature: нормальный toggle не теряет local target, чужие/неизвестные данные не становятся trusted (Task 2).
2. Choice 4 только в metadata, скрытый docs child на 2 или несовпадение CLI/decision: запрет до spawn, actual child получает выбранное значение (Tasks 1/3).
3. Receipt 2 после decision 4, обратная подмена, изменение preference во время запуска: signatures и frozen request не допускают stale acceptance (Tasks 1/4).
4. Local choice 4 в cloud carrier/signature или invalid numeric/string input: remote остаётся 2, неизвестные значения не исполняются (Tasks 1/3).
5. Одновременная смена preference, повторный init collector, чужой heavy lock, timeout/неподтверждённое завершение: baseline bytes сохраняются, один heavy batch и process ownership не ослабляются (Tasks 2/4).

## Карта файлов

| Группа | Точные будущие изменения |
| --- | --- |
| Policy и общий derivation | `data/execution/policy.yaml`, `schemas/execution-policy.schema.json`, `schemas/execution-decision.schema.json`, `schemas/execution-receipt.schema.json`; Create `scripts/lib/verification-concurrency.mjs`; Modify `scripts/lib/execution-context.mjs`, `scripts/lib/execution-receipt.mjs` |
| Сохраняемое предпочтение | `schemas/machine-profile.schema.json`, `scripts/lib/machine-profile.mjs`, `scripts/lib/machine-profile-validation.mjs`, `scripts/init-execution-profile.mjs` |
| Команды и CLI | `scripts/lib/verification-runner.mjs`, `scripts/run-verification.mjs`, `scripts/lib/execution-docs-check.mjs`, `scripts/resolve-execution-context.mjs`, `package.json`; Create `scripts/test-system.mjs` |
| Workflow handoff и пояснения | `scripts/lib/cloud-verification.mjs` только local offer; `.agents/skills/building-cupis-emails/SKILL.md`, `.agents/skills/maintaining-cupis-email-system/SKILL.md`, `bootstrap/README.md`, `README.md`, `docs/user-guide.md` |
| Сохраняемые источники | `.github/workflows/cupis-verification.yml`, `scripts/lib/execution-cloud-event.mjs`, cloud argv/limits, contracts/rendering/Figma/email assets, hardware collector и thresholds |

`schemas/execution-request.schema.json` не получает новый пользовательский per-run override: preference принадлежит профилю. `system/manifest.yaml` менять только если его реальная команда регистрации требует нового CLI entry; существующие IDs/маршруты не переименовывать. Generated документы меняет только штатный generator при доказанной зависимости. Карту уточнить по свежей base до тестов, не расширять scope вслед за предположением.

## Task 1: Effective команды, signatures и схемы

**Files:** policy/три execution schemas, новый `scripts/lib/verification-concurrency.mjs`, `scripts/lib/execution-context.mjs`; Tests `tests/skills/execution-policy.test.mjs`, `tests/skills/execution-context.test.mjs`, `tests/skills/execution-context-cli.test.mjs`; Create `tests/skills/verification-concurrency.test.mjs`.

**Interfaces:**
- Новый `selectLocalTestConcurrency({policy, profile, pairKey}) -> 2 | 4`: читает только уже проверенный профиль; missing preference → 2, explicit invalid field отвергается. Legacy policy без разрешения4 поддерживает только2; сохранённое4 при такой policy даёт typed unsupported-choice, а не тихий fallback2.
- Новый `deriveVerificationWorkload({workload, target, testConcurrency=2, policy}) -> effectiveWorkload`: source-approved clone, target local для policy.local_test_concurrency.workload_ids accepts2/4; остальные workloads остаются unchanged2. Github-hosted uses2 and rejects an explicit request for4. Ни caller commands, ни arbitrary argv не принимаются. Mixed batch проверяет effective limits/signature каждой строки, а общий budget остаётся30minutes/oneheavybatch.
- Перенести canonical hashing `workloadSignature(workload) -> sha256` в этот helper и re-export из execution-context, сохранив существующий API и байты default-2 hash. Helper не импортирует execution-context: циклическая зависимость не создаётся.
- `resolveExecutionContext({request,policy,capabilities,profile})` сохраняет сигнатуру. Проверяет base signature/target прежним способом, затем строит effective local workload и decision limits/signature. Cloud derivation всегда получает 2 независимо от local preference.

- [ ] **RED:** `local choice 4 changes actual argv and effective signature`; `default 2 preserves legacy canonical bytes/hash`; `cloud remains byte-identical 2 with a local profile preference 4`; `invalid values 0/1/3/6/8/null/string4 rejected`; `unknown base workload still selects existing conservative target`. Проверять literal argv, source-policy immutability и hashes, а не только новую property.
- [ ] Запустить delegated `node --test --test-concurrency=4 tests/skills/verification-concurrency.test.mjs tests/skills/execution-policy.test.mjs tests/skills/execution-context.test.mjs tests/skills/execution-context-cli.test.mjs`; сохранить actual RED по причине отсутствия разрешённого выбора.
- [ ] Добавить policy `local_test_concurrency: {allowed:[2,4],default:2,workload_ids:[docs-scoped,repository-full,visual-fixtures]}` с exact allowed IDs. Base local/workload/cloud limits и canonical commands остаются2; legacy policy без property разрешает только2. Extend schemas строго: decision local mapped-workload limits enum2/4, cloud и остальные workloads const2, остальные budget fields прежние; receipt optional explicit `workload_results[i].test_concurrency` enum2/4 только mapped workloads, root receipt не получает этого поля. Не расширять значения других числовых полей.
- [ ] Реализовать helper: для source-approved Node `--test` заменить единственный canonical flag; duplicate/неожиданный flag блокирует derivation. Docs-scoped default-2 outer argv оставить прежним; при local4 добавить bounded `--test-concurrency 4` фиксированной docs программе. Для не-Node команд argv не менять. Effective signature включает resulting commands и limits.
- [ ] GREEN: делегировать те же suites и проверить local2/cloud2 прежнее равенство, local4 отличие, readonly policy, bounded decision output <=4096 bytes и mixed batch с неизменёнными2 non-Node rows. Publish bounded cloud commit, независимое review Task1.

## Task 2: Разовый сохранённый выбор и изменение позже

**Files:** profile schema/validation/module/CLI; Tests `tests/skills/machine-profile.test.mjs`, `tests/skills/execution-context-cli.test.mjs`, `tests/execution-profile.Tests.ps1`.

**Interfaces:**
- Profile optional `test_concurrency: 2 | 4`, schema1.0.0. Existing local_limits baseline2/workload_decisions/observations сохраняются.
- `initExecutionProfile(options)` принимает optional `testConcurrency`; старый caller без него остаётся 2, новый approved bootstrap передаёт разовый выбор.
- Create export `setExecutionTestConcurrency({stateRoot,pairKey,testConcurrency,explicitSelection}) -> validatedProfile`, где explicitSelection должен быть true. Требует существующий валидный профиль, существующий init.lock/atomicJson, не принимает collectOnce.
- CLI `init-execution-profile --action set-concurrency --test-concurrency 2|4` с прежними trusted state-root/pair-key либо permitted local binding. Action init принимает тот же optional numeric flag; read/refresh semantics сохранены, read не пишет и не спрашивает.
- Action set-concurrency использует `readActiveProfileBinding`, а не ensure/create. Повторный init с существующим валидным профилем не пишет preference; differing init flag даёт typed selection-conflict. Explicit hardware refresh сохраняет existing preference при обновлении разрешённого baseline. Flag выбора при read/refresh отвергается.

- [ ] **RED:** `legacy missing preference reads as 2 without writes`; `persist 4 then2 preserves baseline and signatures`; `different bound pair/invalid/unavailable state cannot save`; `preference mutation never calls collector`; `normal choice change does not fall back to cloud`; `unknown workload signature remains unknown after toggle`; `repeat init and authorized hardware refresh preserve preference4`; `init differing choice/read or refresh choice flag reject`; `missing active binding setter refuses without creating pair`.
- [ ] RED командой `node --test --test-concurrency=4 tests/skills/machine-profile.test.mjs tests/skills/execution-context-cli.test.mjs`; отдельно `powershell -NoProfile -NonInteractive -File tests/execution-profile.Tests.ps1 -RepositoryRoot <EXACT_SNAPSHOT>`. Fake collector count должен оставаться прежним; production hardware не собирать ради теста. PowerShell проверка сама не является Node-test файлом и не получает новый concurrency flag.
- [ ] Реализовать atomic setter под существующим init.lock: read/validate под lock, clone только preference field, validate, atomic write, отдельный read-back; refuse malformed value или init in progress. Сохранить baseline field values, markers и чужой active binding. При ошибке write не сообщать success. Для explicit hardware refresh перечитать прежний preference под тем же lock и перенести его в refreshed profile; отсутствие старого поля остаётся legacy2. Это не вызывает collector при смене preference и не даёт setter право на refresh.
- [ ] Не изменять strict profile local_limits match и base workload signatures ради выбора: они остаются прежними2. Validated wrapper добавляет только optional preference; profile eligibility и trustPair guards не обходятся.
- [ ] GREEN/negative controls: unavailable observations, missing Node/PowerShell, threshold boundaries, concurrent setter, read during atomic replace, locked/unwritable file, symbolic/junction state, interrupted init. Делегировать прежние suites; Publish и отдельное review Task2.

## Task 3: Frozen handoff → runner → docs child → npm entry

**Files:** `scripts/lib/verification-runner.mjs`, `scripts/run-verification.mjs`, `scripts/lib/execution-docs-check.mjs`, `scripts/resolve-execution-context.mjs`, `package.json`; Create `scripts/test-system.mjs`, `tests/skills/test-system-cli.test.mjs`; Tests `tests/skills/verification-runner.test.mjs`, `tests/skills/execution-source-identity.test.mjs`, `tests/skills/execution-skill-boundary.test.mjs`.

**Interfaces:**
- `runVerification(options)` добавляет optional `testConcurrency` и `executionDecision`. Legacy call без обоих выполняет2. Local4 требует resolved frozen decision с теми же sourceSha/requestId/target/workload IDs/effective signatures. Choice и optional limits должны совпасть с decision; mismatch отвергается ДО spawn.
- Runner CLI добавляет `--decision FILE` и внутренний `--test-concurrency 2|4`. Из decision можно вывести число; явно переданное число обязано совпасть. Profile CLI input по-прежнему задаёт persistent lock root; runner не перечитывает изменённое предпочтение поверх frozen decision.
- `deriveDocsScope({repoRoot,sourceSha,readGit,testConcurrency=2})` принимает только2/4, сохраняет first-parent scope/test selection. CLI программы допускает только bounded concurrency flag; actual child argv содержит один `--test-concurrency=N`.
- Новый `runSystemTests({repoRoot,args,runner})` в scripts/test-system.mjs обрабатывает fixed script flags `--validate-first`, `--decision FILE`, `--test-concurrency 2|4`; все остальные argv отвергаются. Fixed test file list совпадает с текущим package.json. Для controlled4 обязателен matching LOCAL repository-full decision: docs-scoped/visual-fixtures-only либо cloud decision не разрешает полный список. Legacy bare command выполняет2. `npm test` → `node scripts/test-system.mjs`; `npm run verify` → та же программа с `--validate-first`. Сигналы передаются owned children; executable = process.execPath, shell=false, windowsHide=true.

- [ ] **RED:** actual child-process probe пишет полученный argv: local2 и4 для repository-full, docs-scoped и visual-fixtures. Assert exact test file set/order, ровно один flag и отсутствие нерегламентированных args. `decision4/flag2` и `decision2/flag4` должны завершиться typed mismatch до любого test child. Npm full-suite wrapper отвергает docs-scoped-only, visual-fixtures-only и cloud decisions до spawn; local repository-full проходит.
- [ ] RED `node --test --test-concurrency=4 tests/skills/verification-runner.test.mjs tests/skills/execution-source-identity.test.mjs tests/skills/test-system-cli.test.mjs tests/skills/execution-skill-boundary.test.mjs`. Не объявлять fake-runner проверку единственным доказательством; создать реальный bounded public CLI test.
- [ ] Runner и test-system wrapper независимо загружают validated exact-source policy и строят команды через Task1 helper с `policy`; даже matching вручную заданный decision4 не разрешает4 на legacy policy без allowlist. Проверять selected budget вместо прежнего единственного BASE_LIMITS.concurrency2, оставляя timeout30/maxbatch1 строгими. `--from-event` и cloud carrier сохраняют прежние args2 без decision4override. No command injection/caller paths.
- [ ] Docs-scoped default wrapper в source policy не меняется: существующий exact `validateReferences` продолжает принимать canonical source. Effective4 argv появляется только в helper; дочерний docs CLI validates2/4. Его child argv и limits входят в фактическое evidence; default2 signature остаётся прежней.
- [ ] New test-system wrapper не ищет профиль в snapshot/CWD и не изобретает pair key. Workflow передаёт frozen decision4; bare legacy npmtest2 явно документирован. Полный прямой диагностический запуск не заменяет heavy-lock штатного runner. Wrapper verify выполняет validate first, затем тесты, сохраняет exit/signal и не выдаёт passing при failed validate.
- [ ] GREEN: реальные bounded public runner/docs/npm wrapper commands на synthetic fixtures; cli invalid/duplicate flags, requested unknown tests, missing/altered decision, target cloud4, unsafe source/output, changed SHA, lost lock, cancellation/timeout controls. Делегировать listed suites, Publish и review Task3.

## Task 4: Receipt acceptance, пользовательский путь и итоговая приёмка

**Files:** `scripts/lib/execution-receipt.mjs`, `scripts/lib/cloud-verification.mjs` только local offer; profile/schema/docs из предыдущих tasks; `.agents/skills/building-cupis-emails/SKILL.md`, `.agents/skills/maintaining-cupis-email-system/SKILL.md`, `bootstrap/README.md`, `README.md`, `docs/user-guide.md`. Tests `tests/skills/execution-receipt.test.mjs`, `tests/skills/cloud-verification.test.mjs`, `tests/skills/local-verification-offer.test.mjs`, `tests/skills/maintenance-skill-boundary.test.mjs`, `tests/skills/email-build-skill-boundary.test.mjs`, `tests/skills/execution-skill-boundary.test.mjs`.

**Interfaces:**
- New local receipts for Node-test workloads содержат actual `workload_results[i].test_concurrency` на каждой mapped строке, а не root receipt. `validateExecutionAcceptance()` проверяет его вместе с effective signature; missing legacy field означает2 только после совпадения всех прежних guards. Local4 требует явное4. Nonmapped строки и cloud receipt форматы/команды не переписывать.
- `buildLocalVerificationOffer()` получает local selection из trusted saved wrapper, не переносит его в cloud result. Offer остаётся informational, ничего не запускает и не собирает оборудование; выполнение требует нового frozen local decision.
- Навыки используют initial approved choice при bootstrap и сохранённое значение в последующих contexts. Только явное изменение пользователя вызывает setter; вопросы не повторяются. В каждой записи результата указывается фактическое число.

- [ ] **RED:** successful2receipt rejected by4decision;4receipt rejected by2decision; changed preference after resolution cannot rewrite frozen acceptance; forged value or different effective signature rejected; default missing legacy field2 accepted only with matching exact identities; github-hosted4 rejected. Actual child argv mismatch принадлежит pre-spawn/real-CLI controls Task3: pure receipt validator не способен установить истинность произвольно сфабрикованной metadata.
- [ ] RED/ GREEN `node --test --test-concurrency=4 tests/skills/execution-receipt.test.mjs tests/skills/cloud-verification.test.mjs tests/skills/local-verification-offer.test.mjs tests/skills/maintenance-skill-boundary.test.mjs tests/skills/email-build-skill-boundary.test.mjs tests/skills/execution-skill-boundary.test.mjs`.
- [ ] Receipt приёмка сравнивает effective signature/value с frozen decision; actual command records проверяет независимый reviewer вместе с actual runner/CLI evidence. Сохранить существующую truth boundary комментария в execution-receipt: identity/coverage не равны доказательству выполнения произвольного JSON. Не изменять old receipt bytes и не пересчитывать их под новое предпочтение. Сохранить request/SHA/artifact/input/reviewer identity guards и same-selected-model checks.
- [ ] Обновить bootstrap/пользовательские инструкции: разовый вопрос2/4 при отсутствии уже выбранного значения; «переключи тесты на2/4» для сохранения следующего выбора; default2legacy без автозаписи; доверенная pair binding; новые чаты читают профиль, старые pinned tasks требуют обновления source/context. Никакого обещания retroactive обновления всех чатов.
- [ ] Обновить thin execution handoff обоих специализированных навыков: один saved-profile read на новый чат, passed decision/selected concurrency в runner, no per-run questions/recollect. Hardware thresholds не переписывать на основании одного benchmark; дать выбор2 для меньшей нагрузки.
- [ ] Actual synthetic round trip на2→сохранить4→новыйrequest4→сохранить2→новыйrequest2 через profile CLI/resolver/public runner/docs child/receipt/finalizer. Проверить invocation argv, единый persistent lock, interrupted owned processes и отсутствие collector calls. Сохранять новые evidence refs для каждого request; без live пользовательского профиля.
- [ ] Publish exact final cloud commit; delegated local `repository-full` и generated check на выбранных4 через реализованный runner. Перечитать final SHA, source blob identity/same-lock deps/allowed diff/preserved areas; одно полное выполнение, без Actions/PR Checks. Independent reviewer сверяет первичные requirements и все task artifacts, проверяет receipt/finalizer; отдельное merge/install разрешение.

## Проверка и независимое ревью данного планового коммита

Allowed paths ровно два новых файла: эта plan и связанная spec. Все существующие runtime/test/policy/profile/skill blobs сохраняются.

- [ ] Publish docs commit с parent7f03aaf на current PR134 branch после проверки branch head; если чужой head изменился, не force-update: остановить публикацию и пересверить базу.
- [ ] Подготовить отдельный exact-SHA snapshot вместе с parent и verified same-lock dependencies. Проверить allowed diff, unchanged blobs, LF/UTF8, ссылки и имена существующих proposed paths.
- [ ] `node scripts/validate-system.mjs` и `node scripts/generate-docs.mjs --check` должны завершиться exit0; `git diff --check PARENT HEAD` exit0.
- [ ] `deriveDocsScope()` на published commit получает фиксированный guard set от first-parent diff. Делегированный direct `node --test --test-concurrency=4 <ровно selected tests>` выполняется один раз. В evidence указать user-authorized4 и исходную derived command2: это проверка планового изменения, не заявление о поддержке4 действующим production runner. Полный runtime suite не требуется.
- [ ] Реальный независимый reviewer читает исходный запрос с уточнением persistent choice, spec/plan, primary sources, exact cloud diff и локальные summaries. Каждое R1–R4/Review Focus сопоставляет с tasks; unresolved findings исправляются в документах и проверяются на новом actual SHA.
- [ ] Self-review: нет per-run анкеты, hidden override source edits, подмены signatures, cloud4, повторного collector, wildcard scope, новых dependencies или обещания автоматически обновить старые pinned чаты. Все code tasks остаются unchecked; plan readiness не означает implemented feature.

## Точка продолжения

После принятого плана отдельная реализация следует Tasks1→2→3→4; overlapping execution/profile files меняются последовательно. Все proposed interfaces и выбранная база перед первой правкой перепроверяются. Текущая публикация не меняет выбор пользователя в живом профиле и не запускает продолжение Tasks11/12.
