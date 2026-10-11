# CUPIS Skill Execution Policy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking. Read the execution boundary below before any work.

**Goal:** Ввести общую кодовую политику делегирования, обязательного ревью, фиксированных моделей и однократного выбора тестовой среды пользователь + ПК.

**Architecture:** Router выбирает одну специализацию; специализация определяет предметную задачу и workloads. Общий execution resolver возвращает компактный JSON для реальных инструментов coordinator. Модули выбора и receipts не являются заменой содержательного независимого ревью.

**Tech Stack:** Node.js 24 ESM, существующие yaml 2.9.0 / ajv 8.20.0, JSON Schema 2020-12, PowerShell для одноразовых Windows observations, gh CLI для cloud transport и GitHub-hosted Windows Actions. Новых package dependencies нет.

**Spec:** ../../specs/2026-10-11-cupis-skill-execution-policy-design.md.

**Status:** План подготовлен 11.10.2026 по уточнениям пользователя; код, локальные навыки, профили и workflows не изменены. План и конкретные matrix/threshold values подлежат просмотру пользователем перед реализацией.

## Global Constraints

- Canonical base: main bbc495d64cb0f4f486a8a62c8c732cbeb29c3f7b; документационное продолжение PR116/effab8d0f7e461f22fee21d0ea782c6ab126091f. Исполнение начинает с принятого документационного head, повторно фиксируя actual SHA.
- Новые schema_version = 1.0.0. Один manifest, три существующих навыка, один предметный bundle/workflow. Execution policy не копируется в Markdown навыков или bundle.
- target_tier = min(base_tier + 1, 4), применяется ровно один раз. Reviewer для содержательной работы: min(executor_tier + 1, 4), отдельный agent и фактические исходники/результат.
- Известные версии и разрешённые замены заданы в Spec. Нет поиска новых моделей, ranking по цене, benchmark в обычном исполнении или автоматической замены coordinator.
- Profile init один раз на pair_key; повторный test не вызывает collector, counters, reinit либо recalibration. Ручная переоценка — отдельная явная просьба.
- Пороги первичного local допуска: RAM 16 GiB / free RAM 8 GiB / logical CPU 8 / free temp disk 4 GiB; unknown → cloud. Concurrency 2 / один тяжёлый batch / timeout 30 минут.
- Не более 3 субагентов одновременно, с явными model и reasoning_effort, fork_turns=none и непересекающимися mutations.
- Обычный ExecutionDecision ≤4 KiB; исходники, схемы, планы и полная policy не загружаются в runtime context. Required fields не обрезаются.
- Actions — только выбранные portable workloads на точном SHA. Local-only checks, production emails/images, live Figma и пользовательское ПО не объявляются облачно проверенными.
- Persistent authoring через cloud GitHub; local snapshot только для исполнения/проверки. Отдельные merge и local backup/sync разрешения сохраняются.

## Execution boundary

Пользователь прямо заменил прежний полный запрет Actions условной политикой и требует роли с запасом качества. В реализации нужно согласованно заменить старые active local-only/fixed-Terra инструкции, а не добавлять противоречащие абзацы. Исторические receipts остаются историческими; факты выполненных тестов не меняются.

При подготовке этого плана текущий инструмент spawn_agent не предлагает gpt-5.6-terra, хотя она есть в каталоге обычных чатов. Поэтому новые Terra проверки/независимое agent review плана не заявляются. При исполнении после принятия плана применяются его явно разрешённые role replacements; предыдущие результаты effab/c246 не считаются проверкой нового head.

## Review Focus

1. Уверенный, но неверный executor скрывает пропуск требования: reviewer читает первичные данные и весь изменённый scope; Task 2 и Task 6.
2. Поддельный mechanical task_kind пытается изменить schema/authorization: mechanical mutation blocked, остальные mutation floors поднимаются по path scope; Task 1/2.
3. Профиль из другой пары или отсутствующий/повреждённый профиль вызывает повторную диагностику: normal resolve не вызывает collector; Task 3.
4. Первая cloud проверка ошибочно рассчитывает на workflow_dispatch до появления workflow в main или проверяет merge SHA: Task 4/5.
5. После облака local-only проверка или ревью остаётся невыполненным, но handoff сообщает общий PASS: Task 2/5/6.

## File responsibilities

Create data/execution/policy.yaml и schemas/execution-policy.schema.json: versioned task floors, tier candidates, workload argv/eligibility, initial hardware thresholds и limits.
Create schemas/runtime-capabilities.schema.json, schemas/machine-profile.schema.json и schemas/execution-receipt.schema.json: реальные tool capabilities, local state и review/verification/acceptance contracts.
Create scripts/lib/execution-policy.mjs: strict loader и cross-reference validation, используя existing strict-yaml.mjs/schema-validation.mjs.
Create scripts/lib/model-selection.mjs: pure fixed-order выбор, одна safety ступень и availability refusals.
Create scripts/lib/execution-context.mjs: композиция request + policy + capabilities + saved profile; без side effects, shell, network или spawn.
Create scripts/lib/execution-receipt.mjs: независимость reviewer, coverage, source/artifact/workload identity и local_offer.
Create scripts/lib/machine-profile.mjs: init/read/update-on-request и локальное хранение.
Create bootstrap/collect-machine-profile.ps1: единственный hardware collector; читаются только белые поля.
Create scripts/resolve-execution-context.mjs, scripts/init-execution-profile.mjs, scripts/finalize-execution.mjs: отдельные CLI resolve/init/finalize.
Create scripts/run-verification.mjs и scripts/lib/verification-runner.mjs: единый проверяемый runner и receipt.
Create scripts/request-cloud-verification.mjs и scripts/lib/cloud-verification.mjs: gh adapter для выбранного запроса и результата.
Create .github/workflows/cupis-verification.yml: explicit-request GitHub-hosted runner.
Modify system/manifest.yaml, package.json, scripts/validate-system.mjs: регистрация источников/CLI, validation и test glob.
Modify AGENTS.md, README.md, bootstrap/README.md, bootstrap/verify.ps1, bootstrap/config.portable.toml, обе specialization SKILL.md: короткие bindings новой политики, install artifacts и удаление active противоречий. Router SKILL.md остаётся domain-only; меняется лишь handoff reference при необходимости.
Modify соответствующие mode gates data/workflows/*.yaml только там, где hardcoded local verification требуется заменить evidence decision; renderer/model/component/foundation facts не менять. Generated checkpoint outputs пересобираются только при фактическом изменении их inputs.
Modify tests/foundation/local-only-verification.test.mjs: проверка нового opt-in workflow contract вместо запрета всех workflow files; существующие assertions вне сменившегося поведения сохраняются.

## Task 1: Typed policy и deterministic model selection

**Files:** policy/schema/loader/model-selection из File responsibilities; новые tests/skills/execution-policy.test.mjs и tests/skills/model-selection.test.mjs; manifest/validator.

**Interfaces:**
    loadExecutionPolicy({repoRoot, manifest}) -> Promise<ExecutionPolicy>
    selectModel({policy, taskKind, operation, allowedPaths, capabilities}) -> SelectionResult
    SelectionResult = {status, base_tier, target_tier, executor, review, safety_ceiling_reached, blockers}

- [ ] Step 1: Создать RED tests safety bump 1→2, 2→3, 3→4, 4→4; primary missing/effort missing/vision missing; ordered replacements; no candidate → MODEL_ROLE_UNAVAILABLE; unknown kind → EXECUTION_TASK_KIND_UNKNOWN; mechanical write → EXECUTION_TASK_KIND_SCOPE_MISMATCH.
- [ ] Step 2: Запустить node --test tests/skills/execution-policy.test.mjs tests/skills/model-selection.test.mjs и подтвердить предметные RED, без создания runtime facts ради PASS.
- [ ] Step 3: Реализовать loader, registration и pure selection с точными значениями Spec. Добавить tests bounded-change в schema/authorization → tier3 baseline и одинаковый selection на повторном вызове без повторной safety bump.
- [ ] Step 4: Проверить GREEN этих двух файлов, validator и согласованность manifest sources.
- [ ] Step 5: Независимый reviewer сверяет всю matrix с Spec и реальным delta; publish accepted task commit через cloud transport.

## Task 2: Compact execution contract и содержательная приёмка

**Files:** execution-context/receipt и три CLI resolve/finalize; runtime/receipt schemas; tests/skills/execution-context.test.mjs, tests/skills/execution-receipt.test.mjs, tests/skills/execution-context-cli.test.mjs.

**Interfaces:**
    resolveExecutionContext({request, policy, capabilities, profile}) -> ExecutionDecision
    validateExecutionAcceptance({decision, reviewReceipts, verificationReceipts, expectedArtifactDigest}) -> AcceptanceResult
    renderExecutionDecision(decision) -> string
CLI resolve inputs: --request FILE --capabilities FILE --repo-root DIR, optional --profile FILE только при verification workloads; finalize inputs: --decision FILE --review FILE --verification FILE --artifact-digest HASH. Exit 0 resolved/accepted, 1 typed blocked, 2 malformed CLI.

- [ ] Step 1: RED tests domain paused/blocked/mismatched ref не расширяет authorization; no semantic review despite test PASS; reviewer same agent; stale source/artifact; missing requirement result; uncovered local-only workload; injected candidate not in capabilities; output limit with no field truncation.
- [ ] Step 2: Запустить три test files и зафиксировать RED cases.
- [ ] Step 3: Реализовать interfaces, refs/digests вместо full sources, ≤4 KiB JSON и explicit blockers. Не добавлять execution policy к static_sources предметного bundle; existing resolve-skill-context output сохраняется.
- [ ] Step 4: GREEN targeted и existing tests/skills/skill-context.test.mjs, skill-context-cli.test.mjs; проверить, что обычный output не содержит полного policy/схем/планов и референсы reviewer дают весь нужный scope, bind source/artifact digest и не подменяют runtime permissions.
- [ ] Step 5: Независимый reviewer проверяет формальную gate логику и недостаточность self-report/PASS; publish task commit.

## Task 3: Once-per-user-PC profile

**Files:** machine-profile module, init CLI, collector PS, profile schema; tests/skills/machine-profile.test.mjs; tests/execution-profile.Tests.ps1; bootstrap docs/verifier.

**Interfaces:**
    initExecutionProfile({stateRoot, pairKey, collectOnce, policy}) -> Promise<MachineProfile>
    readExecutionProfile({stateRoot, pairKey}) -> Promise<ProfileReadResult>
    updateExecutionProfile({stateRoot, pairKey, explicitRefreshRequest, collectOnce, policy}) -> Promise<MachineProfile>
read имеет status resolved/absent/invalid; он не получает collector. Init existing pair читает файл и возвращает его без collector. Atomic write и binding сохраняются вне disposable snapshot.

- [ ] Step 1: RED tests первый init вызывает collector 1 раз; второй init и 100 resolve calls вызывают его 0 раз; collector forbidden сохраняет observations_status=unavailable; чужая pair/invalid JSON не диагностируют ПК; новый workload не делает reinit; model-only policy update сохраняет решение; changed workload signature → cloud; unwritable state → PROFILE_STATE_UNWRITABLE.
- [ ] Step 2: Запустить node --test tests/skills/machine-profile.test.mjs и Windows direct tests/execution-profile.Tests.ps1; fake collector после первого вызова бросает COLLECTOR_MUST_NOT_RUN.
- [ ] Step 3: Реализовать минимальный whitelisted collector и local state, параметры/пороги Spec. Новая/чужая среда привязывает собственную pair через bootstrap; неполный профиль ведёт portable workloads в cloud.
- [ ] Step 4: Проверить GREEN и existing bootstrap contract; доказать отсутствие counters/collector import в normal execution resolver. Подготовить профиль установки без broad/full-access write requirement.
- [ ] Step 5: Reviewer отдельно оценивает ограниченность первичной оценки, pair binding, отсутствие утечек hardware/user data и повторной диагностики; publish task commit.

## Task 4: Одинаковые workloads локально и в облаке

**Files:** verification runner/CLI, package scripts, opt-in workflow, обновлённый local-only guard; tests/skills/verification-runner.test.mjs, tests/foundation/local-only-verification.test.mjs.

**Interfaces:**
    runVerification({requestId, sourceSha, workloadIds, target, limits, runner, outputRoot}) -> Promise<VerificationReceipt>
CLI: --request-id ID --source-sha SHA --workloads IDS --target local|github-hosted --output DIR. Commands — executable + args arrays; source checkout identity проверяется до workloads.

- [ ] Step 1: RED tests exact SHA mismatch; skipped workload; timeout/cancelled/nonzero exit; unavailable executable; identical workload argv for local/cloud; installed-skills/real-email-visual forbidden in cloud; no auto push/synchronize/schedule trigger.
- [ ] Step 2: Запустить targeted runner + workflow contract tests, подтвердить RED.
- [ ] Step 3: Реализовать portable workload matrix и receipts. repository-full включает validate/test/generated; windows-bootstrap запускает существующие два Windows gates и новый profile contract с fake collector; targeted docs выбирает конкретные guard tests по changed source paths. Fixed Node24 и lock; direct equivalent отмечается как direct equivalent.
- [ ] Step 4: Добавить workflow_dispatch и узкий same-repository pull_request/labeled bring-up, label cupis-cloud-verification. Явный checkout request/event head SHA; сохранить workflow/source/event SHA отдельно. Проверить Actions metadata права, полные action pins при реализации и отсутствие production inputs.
- [ ] Step 5: GREEN targeted; выполнить реальный exact-SHA gate в выбранной один раз среде, не тестируя параллельно оба исполнения без причины. Независимое ревью runner/workflow и publish task commit.

## Task 5: Cloud request/result и однократное предложение локальной проверки

**Files:** cloud-verification module/CLI; receipt helpers; tests/skills/cloud-verification.test.mjs, tests/skills/local-verification-offer.test.mjs.

**Interfaces:**
    requestCloudVerification({decision, prIdentity, gh, requestStore}) -> Promise<CloudRequestResult>
    readCloudVerification({request, gh}) -> Promise<VerificationReceipt>
    buildLocalVerificationOffer({decision, receipt, profile, offerStore}) -> LocalOffer|null
gh и filesystem injected, чтобы tests не создавали remote runs. CLI request: --decision FILE --pr NUMBER; result: --request FILE; предложение создаётся finalize.

- [ ] Step 1: RED tests workflow not in default branch; labeled opt-in first bring-up; stale/multiple run identity; missing artifact; every terminal conclusion; same execution twice yields no second offer; run with product FAIL stays FAIL; no local test/collector executed by offer.
- [ ] Step 2: Запустить targeted fake-gh tests и подтвердить RED.
- [ ] Step 3: Реализовать idempotent request_id привязку, bounded чтение результатов, source SHA/workloads/receipt validation. Labeled bring-up требует права пользователя и same-repository PR; недоступность → CLOUD_WORKFLOW_NOT_READY.
- [ ] Step 4: GREEN targeted. Fresh reviewer сверяет фактические runtime adapters; максимум один live smoke выбранного cloud request при принятой реализации и наличии доступа. Не читать/запускать чужие исторические Actions как доказательство.
- [ ] Step 5: Проверить local_offer цель/риск/варианты и cached-profile timestamp, отсутствие фиктивных текущих измерений; publish task commit.

## Task 6: Тонкое подключение навыков, actual clean-context и закрытие Step5

**Files:** active instruction/binding paths из File responsibilities, tests/skills/execution-skill-boundary.test.mjs, обновлённые существующие skill/router/bootstrap boundaries, workflow gates и только зависимые generated outputs; current Step5 docs.

**Interfaces:** Existing domain resolver и selected workflow неизменны; специализация добавляет request refs и вызывает новый execution CLI. Реальный coordinator использует decision.executor/decision.review через actual spawn tools. Skill текст содержит минимальный вызов, output contract и сохранённые authority boundaries; лимит нового shared-routing текста — 25 строк на специализацию, без duplicate matrices.

- [ ] Step 1: RED behavioural baselines с прежними skills: уверенный неверный executor, PASS с пропущенным требованием, unavailable Terra, новый чат с cached machine profile, local-only scope после green cloud run. Expected outputs проверяются по artifacts, не совпадением Markdown слов.
- [ ] Step 2: Реализовать короткие bindings и заменить только active fixed-Terra/no-Actions policies на ссылку канонической execution policy; исключить широкую загрузку обоих skills или controller исходников. Новые skills не создавать.
- [ ] Step 3: Проверить targeted skill/router/workflow/bootstrap tests и зависимые generated outputs; выполнить независимые clean-context сценарии с фактическими task/model/receipt artifacts. Рецензент получает первичные requirements и весь разрешённый delta.
- [ ] Step 4: На exact final candidate выполнить один выбранный полноценный gate, allowed-path/protected-blob и email-output preservation, затем whole-branch semantic review expert уровня. Предыдущие 1915 или effab receipts не перепинивать.
- [ ] Step 5: После отдельного merge-разрешения проверить actual cloud SHA; после отдельного local install-разрешения backup/sync только изменённых skills и нужных bootstrap binding/state artifacts; канонические helper/scripts исполняются из проверенного pinned snapshot и не становятся вторым постоянным source checkout. Реальные discovery, обе специализации, pinned handoff, stopped/mixed scopes и user-PC profile подтвердить локально; этот этап не заменяется green Actions.
- [ ] Step 6: Зафиксировать реальные результаты в единственной Step5 точке, закрыть Step5/11B только при выполненной приёмке. Переход к 5fix1 отдельно; 5fix2/P6/Figma/существующие письма этим не разрешены.

## Self-review и handoff

До исполнения сверить все task interfaces со Spec; конкретные tiers/fallbacks/thresholds должны быть явно приняты вместе с планом. План сам по себе не даёт разрешение на merge, установку или продукционные Figma mutations.

Проверяемая компактность: только один domain bundle; execution JSON ≤4 KiB; ≤25 новых routing строк на specialization; full evidence только нужным executor/reviewer. Проверяемая однократность: init collector=1; 100 последующих resolve collector=0; offer collector=0; policy/workload update collector=0.

Это документационный план, без выполненного RED/GREEN, runtime gate, agent acceptance или installation. После просмотра пользователем рекомендуем исполнение с ограниченными субагентами и независимым review каждой содержательной задачи: разделены policy, profile и cloud transport, но общие интерфейсы требуют последовательного принятия.
