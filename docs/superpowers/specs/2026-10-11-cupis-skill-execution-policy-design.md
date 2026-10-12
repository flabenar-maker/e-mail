# CUPIS: машинная политика исполнения навыков — Design

Уточнено 2026-10-12: модель выбирает пользователь, программная политика выбирает только поддерживаемое усилие. Источник текущих значений — `data/execution/policy.yaml`; этот документ объясняет архитектуру, а не задаёт второй реестр.


## Цель и принятые требования

Три существующих навыка получают общую программную политику исполнения. Работа делегируется подходящим субагентам; слабый исполнитель не решает сам, достаточно ли хорош его результат. Содержательная приёмка независима от его самооценки и прохождения тестов. Исполнители и проверяющие сохраняют модель, выбранную пользователем; подбирается только её поддерживаемое усилие. Поиск версий, ценовое ранжирование и замена модели отсутствуют.

Профиль среды создаётся один раз для одной пары пользователь + ПК. Перед каждым тестом аппаратная диагностика, оценка текущей загрузки и переопределение среды не выполняются. При достаточном сохранённом запасе проверки выполняются локально; иначе переносимые проверки идут на GitHub-hosted runners. После окончания облачного прогона предлагается локальная проверка с объяснением пользы и возможных замедлений.

Принцип «перестраховаться»: определить базовое усилие задачи и применить один следующий поддерживаемый шаг, ограниченный максимумом выбранной модели. Повышение не применяется повторно к уже повышенному результату. На пределе сохраняются та же модель и отдельный независимый рецензент.

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

## Модель пользователя и запас усилия

`selected_model` содержит надёжно сообщённый текущей средой ID (`binding: explicit`) либо наследование текущей модели (`binding: inherited`, `id: null`). Скрытое имя не означает недоступность. Координатор не выбирает модель по версиям, стоимости, рейтингу или каталогу приложения и не запрашивает замену у пользователя.

| Тип задачи | Базовое усилие |
| --- | --- |
| mechanical-read, run-prescribed-checks | low |
| bounded-change, failure-diagnosis, visual-compare | medium |
| architecture-change, policy-change, contract-change, ambiguous-task | high |

Критичная разрешённая область устанавливает минимум high. Политика находит подходящее поддерживаемое усилие и один раз повышает его на следующий поддерживаемый шаг; максимум той же модели ограничивает повышение. Пропуски в списке усилий учитываются, неподдерживаемое значение не назначается. Механические роли не получают право писать; неизвестный task_kind остаётся диагностикой.

Независимый reviewer сохраняет выбранную модель и назначенное усилие, получает исходные требования и фактические разрешённые изменения. Его действительный agent ID отличается от executor. Тесты и уверенность исполнителя не заменяют содержательное принятие. При непонимании допускается более высокое поддерживаемое усилие той же модели, а на её пределе — другой независимый агент; ожидание внешней операции не меняет модель.

Один coordinator и не более трёх одновременно работающих субагентов в пределах реального инструмента. Для наследования модель в spawn не переопределяется; явный ID допустим только из надёжных данных о текущем выборе. Усилие передаётся явно с `fork_turns: none` и ограниченным brief. Пересекающиеся записи выполняются последовательно.

## Возможности текущей выбранной модели

RuntimeCapabilities поступает из объявленных возможностей реального инструмента и содержит одну выбранную привязку, поддерживаемые усилия и capabilities. Каталоги, файлы авторизации, prices и benchmark не служат источником решения.

Кэш связан с runtime_session_id, tool_signature и выбранной моделью. Явная смена выбранного ID инвалидирует привязку. При смене пользователем скрытой наследуемой модели вызывается `cache.invalidate({runtime_session_id,tool_signature})`; смена аккаунта вызывает `cache.reset()`. Следующее чтение получает свежие реальные объявления, а исполнители и проверяющие создаются заново.

Типизированный EFFORT_UNAVAILABLE допускает ограниченный повтор со следующим подходящим поддерживаемым усилием на той же модели. MODEL_UNAVAILABLE или CAPABILITY_UNAVAILABLE останавливает соответствующую роль без подмены модели. Ошибка сети не объявляется недоступностью модели. Не нужны ключи API, веб-поиск новинок или отдельный реестр версий.

## Однократный профиль пользователь + ПК

initExecutionProfile запускается при восстановлении среды или первой явной задаче проверки без профиля. Диагностика читает только разрешённые локальные сведения: platform/architecture, логические CPU, physical/free RAM, свободный диск для temporary workspace и наличие нужных runtime. Она не запрашивает полный доступ и не меняет настройки Windows.

Профиль хранится только локально в явно выбранном state_root, доступном текущему профилю разрешений; default — .cupis-local/execution внутри разрешённого пользовательского workspace, не внутри disposable Git snapshot. Bootstrap задаёт active binding пользователя и ПК с непрозрачным pair_key и хранит binding в локальном active-profile.json. Запрос без verification workloads не читает profile и не инициирует настройку ПК. Profile не переносится автоматически на другой ПК вместе с навыками; его binding при открытии другой среды устанавливает bootstrap, без повторной аппаратной диагностики уже настроенной пары. Не публиковать имена пользователя, machine GUID, SID, hostnames или hardware profile в GitHub.

Повторный init для той же pair_key возвращает existing profile и не вызывает collector. Повторные тесты читают файл; collector, текущие CPU/RAM/disk counters и recalibration не вызываются. Если collector запрещён, сохранить один профиль с observations_status=unavailable и предпочтением cloud; каждый тест не повторяет неудачную диагностику.

Первоначальные консервативные пороги для принятия плана: Windows x64/arm64 с подходящим Node 24; physical RAM не менее 16 GiB, free RAM при настройке не менее 8 GiB, logical CPU не менее 8, free temporary disk при настройке не менее 4 GiB. Все значения должны быть известны; иначе cloud. Это эвристика запаса, не гарантия скорости или отсутствия зависания. При другом поддерживаемом platform без принятого threshold table сохраняется cloud, а не догадка.

Сохранённый local режим использует test concurrency=2, timeout=30 минут, не более одного тяжёлого test batch одновременно. Сохранённый cloud режим использует соответствующий Windows GitHub-hosted runner, concurrency=2, timeout=30 минут. Данные при настройке имеют initialized_at; в каждом отчёте говорится, что текущая свободная память/загрузка не измерялись. Внешние приложения могут изменить нагрузку; возможные замедления не выдаются за измеренное состояние ПК.

Изменение только выбора усилия или independent review не инвалидирует hardware profile. workload_decisions привязаны к workload signature (ID, argv, платформенные requirements и resource limits), а не ко всему policy digest. Неизвестная signature → cloud без collector. Если state_root недоступен для сохранения, вернуть PROFILE_STATE_UNWRITABLE и предложить разрешённое место хранения; успешная однократная настройка без сохранённого профиля не заявляется.

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

    RuntimeCapabilities = { schema_version, runtime_session_id, tool_signature, source:"declared-runtime-tools", selected_model:{binding:"explicit"|"inherited",id:string|null}, supported_efforts, capabilities, max_subagents }
    ExecutionRequest = { schema_version, request_id, source_sha, route, mode, domain_context_ref, task_kind, operation:"read"|"write", allowed_paths, requirement_refs, artifact_refs, workload_ids }
    MachineProfile = { schema_version, pair_key, initialized_at, observations_status, observations, baseline_policy_digest, workload_decisions, local_limits }
    ExecutionDecision = { schema_version, status:"resolved"|"blocked", request_id, source_sha, policy_digest, base_effort, target_effort, runtime_identity, executor, review, verification, safety_ceiling_reached, blockers }
    ReviewReceipt = { schema_version, request_id, source_sha, artifact_digest, executor_agent_id, reviewer_agent_id, reviewer_model_binding, runtime_session_id, tool_signature, reviewer_effort, requirement_results, findings, verdict:"accepted"|"changes-required"|"blocked" }
    VerificationReceipt = { schema_version, request_id, source_sha, workflow_sha, target, workload_results, conclusion, evidence_refs }
    AcceptanceResult = { status:"accepted"|"blocked", request_id, blockers, evidence_refs, local_offer }

## Приёмка и границы

Обязательные проверки: сохранение explicit/inherited привязки; скрытое имя без блокировки; однократный запас поддерживаемого усилия; typed effort/model/vision refusal без подмены; сброс кэша при смене выбора/аккаунта; невозможность ослабить критичную область через task_kind; независимый reviewer и полное покрытие требований; stale artifact/source receipt; запрещённый collector после первого init; новый workload без аппаратного reinit; unknown hardware; cloud first bring-up; точный SHA; local-only scope; предложение после terminal cloud результата.

Отдельные clean-context сценарии проверяют реальное поведение агентов на фактических результатах, включая уверенный, но неверный отчёт executor. Структурные tests не заменяют это ревью.
