# CUPIS: машинная политика исполнения навыков — Design


## Цель и принятые требования

Три существующих навыка получают общую программную политику исполнения. Работа делегируется подходящим субагентам; слабый исполнитель не решает сам, достаточно ли хорош его результат. Содержательная приёмка независима от его самооценки и прохождения тестов. Выбираются назначенные конкретные версии моделей и заранее разрешённые замены; поиска новинок, ценового ранжирования и сравнительных прогонов при обычной работе нет.

Профиль среды создаётся один раз для одной пары пользователь + ПК. Перед каждым тестом аппаратная диагностика, оценка текущей загрузки и переопределение среды не выполняются. При достаточном сохранённом запасе проверки выполняются локально; иначе переносимые проверки идут на GitHub-hosted runners. После окончания облачного прогона предлагается локальная проверка с объяснением пользы и возможных замедлений.

Принцип «перестраховаться»: сначала определяется базовый уровень задачи по статической матрице, затем один раз выбирается следующая ступень качества. Повышение не применяется повторно к уже повышенному результату. На максимальной ступени используется максимальная доступная разрешённая модель и независимый рецензент той же ступени.

## Организация

1. CUPIS task router определяет только область запроса: email или maintenance, сохраняет закреплённый SHA и передаёт управление одной специализации.
2. Специализация получает один предметный bundle и workflow, определяет конкретную ограниченную задачу, её task_kind, operation и разрешённые выходы.
3. Execution resolver сохраняет предметные paused/blocked и authorization boundaries: нерассмотренный domain context не разрешает mutations, смена модели или тестовой среды не расширяет allowed outputs. Общий execution resolver читает структурированную политику, краткие возможности текущего инструмента и сохранённый профиль среды; возвращает короткое решение JSON.
4. Координатор вызывает реальные инструменты субагентов и тестов по этому решению. Вспомогательный Node-процесс не имеет доступа к инструментам spawn_agent и не выдаётся за самостоятельный оркестратор.
5. Независимый рецензент оценивает исходное требование и фактический результат. Acceptance gate проверяет привязку заключения к версии источников и результату, полноту обязательных подтверждений и отдельную личность исполнителя/проверяющего.

Граф исполнения: task router → specialization + domain resolver → execution resolver → executor → independent reviewer → acceptance gate → handoff.

Новый четвёртый пользовательский навык не создаётся. Общая логика живёт в небольших модулях; предметные правила и модели писем остаются у нынешних владельцев.

## Источники и контекст

Все новые schema_version имеют точное значение 1.0.0. File refs имеют форму {path, digest}; loader проверяет разрешённые пути и digest. Decision не расширяет разрешения инструментов текущего чата.

Канонический владелец правил выбора — data/execution/policy.yaml, зарегистрированный через system/manifest.yaml. Схемы проверяют политику, runtime capabilities, локальный профиль и receipt. Источники читаются с того же закреплённого SHA, что и предметный workflow.

Политика не включается целиком в предметный bundle; схемы, исходники helper и планы не загружаются в обычный чат. Каждая специализация добавляет только вызов execution helper, короткую форму handoff и существенные запреты. Router не загружает execution policy до выбора специализации.

Execution JSON содержит только выбранные модель/effort, параметры проверки, обязательные review gates, диагностические коды и ссылки с digest. Цель обычного вывода: не более 4 KiB JSON; полные результаты и доказательства остаются файлами и передаются нужному исполнителю по ссылкам. Превышение лимита не обрезает обязательные поля: возвращается компактная диагностика EXECUTION_CONTEXT_TOO_LARGE.

## Уровни моделей и запас качества

Ступени 1–4 — утверждённая для проекта классификация, а не вычисляемый рейтинг OpenAI. Предлагаемая исходная таблица конкретных версий для принятия этого плана:

| Ступень | Назначенная версия / effort | Разрешённая замена на этой ступени |
| --- | --- | --- |
| 1 / economy | gpt-6-luna / low | gpt-5.6-luna / low |
| 2 / standard | gpt-5.6-terra / medium | gpt-5.6-sol / medium |
| 3 / strong | gpt-6.1-sol / high | нет; проверяется ступень 4 |
| 4 / expert | gpt-6-astra / high | нет |

Порядок выбора: target_tier = min(base_tier + 1, 4); выбрать первый разрешённый вариант target_tier, доступный текущему инструменту с требуемыми effort и capabilities. Если ступень недоступна, проверять следующие более высокие ступени в фиксированном порядке. Поиск более дешёвой, более новой или произвольной модели отсутствует. При отсутствии допустимых вариантов — MODEL_ROLE_UNAVAILABLE. На верхней ступени result содержит safety_ceiling_reached=true.

| task_kind | Базовая ступень | Итоговая ступень исполнителя |
| --- | --- | --- |
| mechanical-read, run-prescribed-checks | 1 | 2 |
| bounded-change, failure-diagnosis, visual-compare | 2 | 3 |
| architecture-change, policy-change, contract-change, ambiguous-task | 3 | 4 |

Механическая роль не может менять файлы: mechanical-read/run-prescribed-checks с operation=write дают EXECUTION_TASK_KIND_SCOPE_MISMATCH. Для mutation в навыках, разрешениях, schemas, Core, workflow contracts и стратегии renderer код устанавливает базовую ступень не ниже 3, даже если координатор запросил механическую роль. Неизвестный task_kind даёт EXECUTION_TASK_KIND_UNKNOWN.

Для механического результата требуется непосредственная независимая сверка первичных данных квалифицированным координатором либо рецензентом. Для содержательного результата обязателен отдельный агент reviewer с reviewer_tier = min(executor_tier + 1, 4), исходным заданием, требованиями, полными фактическими изменениями и нужными источниками. Reviewer не принимает только отчёт executor и не рассматривает PASS тестов как достаточную приёмку. Ему доступен весь разрешённый scope; большие материалы можно просматривать частями, без потери обязательной области.

Если рецензент установил существенное непонимание задания, исправление сразу передаётся более сильной ступени; обычная локальная test repair допускает до 2 попыток тем же исполнителем. На потолке используется другой независимый агент той же ступени и сообщается конкретный blocker, если задача остаётся неразрешённой. Не повышать модель только из-за ожидания внешней операции.

Один coordinator и не более 3 одновременно работающих субагентов, в пределах фактического лимита инструмента. Все spawn имеют явные model и reasoning_effort, fork_turns=none и ограниченный brief. Исполнители с пересекающимися writable paths выполняются последовательно. Семантическое ревью не доказывает отсутствие всех ошибок; код доказывает наличие и точную привязку приёмки, а её содержательность проверяет квалифицированный агент.

## Доступность назначенных версий

RuntimeCapabilities передаётся координатором из объявленных возможностей реального инструмента текущего чата. Каталог приложения, доступность обычных чатов и возможности субагентов не смешиваются. Существующий недокументированный models_cache.json не является источником разрешения.

Один snapshot на runtime_session_id + tool_signature, повторно используется всеми задачами чата. Обновление только при новом чате/смене аккаунта, изменении инструмента либо явной ошибке model/effort unavailable. Для каждого отказавшего кандидата разрешена одна попытка; typed отказ инвалидирует выбор, повторное разрешение использует следующий допустимый вариант. HTTP/network outage не выдаётся за отсутствие модели.

Никаких ключей API, чтения auth-файлов, веб-поиска моделей, benchmark, ценового ранжирования или автоматической замены основного coordinator в этом механизме. Новые версии и tier assignments меняются отдельным принятым изменением policy.yaml.

## Однократный профиль пользователь + ПК

initExecutionProfile запускается при восстановлении среды или первой явной задаче проверки без профиля. Диагностика читает только разрешённые локальные сведения: platform/architecture, логические CPU, physical/free RAM, свободный диск для temporary workspace и наличие нужных runtime. Она не запрашивает полный доступ и не меняет настройки Windows.

Профиль хранится только локально в явно выбранном state_root, доступном текущему профилю разрешений; default — .cupis-local/execution внутри разрешённого пользовательского workspace, не внутри disposable Git snapshot. Bootstrap задаёт active binding пользователя и ПК с непрозрачным pair_key и хранит binding в локальном active-profile.json. Запрос без verification workloads не читает profile и не инициирует настройку ПК. Profile не переносится автоматически на другой ПК вместе с навыками; его binding при открытии другой среды устанавливает bootstrap, без повторной аппаратной диагностики уже настроенной пары. Не публиковать имена пользователя, machine GUID, SID, hostnames или hardware profile в GitHub.

Повторный init для той же pair_key возвращает existing profile и не вызывает collector. Повторные тесты читают файл; collector, текущие CPU/RAM/disk counters и recalibration не вызываются. Если collector запрещён, сохранить один профиль с observations_status=unavailable и предпочтением cloud; каждый тест не повторяет неудачную диагностику.

Первоначальные консервативные пороги для принятия плана: Windows x64/arm64 с подходящим Node 24; physical RAM не менее 16 GiB, free RAM при настройке не менее 8 GiB, logical CPU не менее 8, free temporary disk при настройке не менее 4 GiB. Все значения должны быть известны; иначе cloud. Это эвристика запаса, не гарантия скорости или отсутствия зависания. При другом поддерживаемом platform без принятого threshold table сохраняется cloud, а не догадка.

Сохранённый local режим использует test concurrency=2, timeout=30 минут, не более одного тяжёлого test batch одновременно. Сохранённый cloud режим использует соответствующий Windows GitHub-hosted runner, concurrency=2, timeout=30 минут. Данные при настройке имеют initialized_at; в каждом отчёте говорится, что текущая свободная память/загрузка не измерялись. Внешние приложения могут изменить нагрузку; возможные замедления не выдаются за измеренное состояние ПК.

Изменение только model/review assignments не инвалидирует hardware profile. workload_decisions привязаны к workload signature (ID, argv, платформенные requirements и resource limits), а не ко всему policy digest. Неизвестная signature → cloud без collector. Если state_root недоступен для сохранения, вернуть PROFILE_STATE_UNWRITABLE и предложить разрешённое место хранения; успешная однократная настройка без сохранённого профиля не заявляется.

Обновление hardware observations допускается только по прямой просьбе переоценить профиль. Изменение версии policy или состава тестов не запускает collector; если профиль не покрывает новый workload, новый workload консервативно направляется в cloud. Для local-only workloads остаётся требование отдельной локальной проверки. Диск/runtime ошибки при запуске — execution failures, не повод автоматически повторять аппаратную диагностику.

## Параметры и переносимость проверок

Policy хранит workload IDs и argv arrays, не произвольные shell strings: docs-scoped, repository-full, windows-bootstrap, visual-fixtures, installed-skills, real-email-visual. Resolver выбирает нужные workloads из task scope; детальные expected outputs и источники остаются в предметном workflow.

Repository-full выполняет validator + все Node tests + generated check; windows-bootstrap — существующие bootstrap/verify.ps1 и tests/bootstrap-contract.Tests.ps1, а также новый tests/execution-profile.Tests.ps1 с fake collector. Если npm отсутствует, разрешён только точно зафиксированный эквивалент с проверенными same-lock зависимостями и прямым Node; npm ci не заявляется. Wrapper и workflow исполняют одинаковую программу проверки и возвращают один schema receipt.

Portable repository checks и synthetic/уже отслеживаемые fixtures допускаются в GitHub-hosted Actions. Установленные навыки конкретного Codex, реальное письмо/images, live пользовательское ПО и live Figma MCP не переносятся автоматически. Реальные письма и их изображения не попадают в GitHub; если необходимые исходники недоступны облаку, такой scope не объявляется проверенным.

После cloud conclusion success/failure/cancelled/timed_out/infrastructure-error формируется local_offer с целью, scopes, ограничениями, ожидаемым риском по сохранённому профилю и вариантами lightweight/full-later/skip-additional. При FAIL первым предлагается ограниченное воспроизведение ошибки. Предложение не запускает локальные тесты, не повторяет диагностику и не превращает отказ от дополнительного прогона в PASS отсутствующей обязательной проверки. Одна одинаковая cloud receipt даёт одно предложение на execution_id.

## Публикация и первый запуск Actions

Исходники остаются в cloud GitHub, проверки — на точном source_sha. Local snapshot по-прежнему disposable, без authoring. Actions разрешается только для выбранной cloud проверки; сохранённые исторические no-Actions receipts не переписываются.

Workflow dispatch содержит source_sha, workload IDs и request_id. Workflow отдельно проверяет SHA checkout; receipt отличает source SHA, workflow SHA и event/run SHA. Старый успешный run, skipped/отсутствующий job, чужой SHA и неполный набор workloads не дают accepted.

Первый candidate не может полагаться на workflow_dispatch отсутствующего в default branch workflow. Для первого bring-up предусмотрен только opt-in pull_request/labeled, label cupis-cloud-verification, только same-repository PR без merge conflict; source SHA берётся из event head и явно checkout-ится. Push/synchronize/schedule не запускают тесты. После появления workflow в main используется workflow_dispatch; повторное labeled событие — отдельный явный запрос, не постоянная подписка. При недоступности такого события/прав API — CLOUD_WORKFLOW_NOT_READY, без автоматического merge или подмены результата.

Workflow имеет contents:read, без deploy/write/production secrets; action versions закреплены по полным SHA при реализации. Проверки сохраняют реальные exit codes, run identity и артефакты. PR Checks не заменяют receipt. Merge и установка локальных навыков требуют прежнего отдельного разрешения; защиты GitHub не обходятся.

## Машинные интерфейсы

    RuntimeCapabilities = { schema_version, runtime_session_id, tool_signature, source:"declared-runtime-tools", models:[{id, efforts, capabilities}], max_subagents }
    ExecutionRequest = { schema_version, request_id, source_sha, route, mode, domain_context_ref, task_kind, operation:"read"|"write", allowed_paths, requirement_refs, artifact_refs, workload_ids }
    MachineProfile = { schema_version, pair_key, initialized_at, observations_status, observations, baseline_policy_digest, workload_decisions, local_limits }
    ExecutionDecision = { schema_version, status:"resolved"|"blocked", request_id, source_sha, policy_digest, base_tier, target_tier, executor, review, verification, safety_ceiling_reached, blockers }
    ReviewReceipt = { schema_version, request_id, source_sha, artifact_digest, executor_agent_id, reviewer_agent_id, reviewer_model, reviewer_effort, requirement_results, findings, verdict:"accepted"|"changes-required"|"blocked" }
    VerificationReceipt = { schema_version, request_id, source_sha, workflow_sha, target, workload_results, conclusion, evidence_refs }
    AcceptanceResult = { status:"accepted"|"blocked", request_id, blockers, evidence_refs, local_offer }

## Приёмка и границы

Обязательные проверки: однократное повышение; unavailable primary/effort/vision; невозможность ослабить minimum tier через task_kind; независимый reviewer и полное покрытие требований; stale artifact/source receipt; запрещённый collector после первого init; новый workload без аппаратного reinit; unknown hardware; cloud first bring-up; точный SHA; local-only scope; предложение после terminal cloud результата.

Отдельные clean-context сценарии проверяют реальное поведение агентов на фактических результатах, включая уверенный, но неверный отчёт слабого executor. Структурные tests не заменяют это ревью.
