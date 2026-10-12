# Восстановление рабочего контекста Codex

Этот файл — единственный источник setup-логики проекта. Он маршрутизирует Codex к каноническим источникам, но не копирует правила вёрстки или component contracts.

## Быстрый выбор

В новом чате укажи ссылку на канонический GitHub-репозиторий компании, затем выбери действие:

| Что нужно | Запрос | Результат |
| --- | --- | --- |
| Вернуться к работе и узнать актуальное состояние | «Ознакомься с проектом» | Чтение текущего GitHub-коммита, карты источников и границ работы |
| Подготовить новый ПК или подключить зависимости | «Восстанови рабочую среду проекта» | Проверка подключений, обнаружения навыков, зависимостей и локальной работоспособности |

Ознакомление ничего не устанавливает. Восстановление среды следует протоколу ниже; OAuth и замена существующих пользовательских копий требуют предусмотренного разрешения. Это восстановление контекста проекта, а не истории исходного чата.

Текущее состояние берётся из GitHub. Локальный снимок закреплённого коммита используется для проверок; архив или старый checkout не заменяет канонический источник.

<a id="repository-binding"></a>
## Привязка к репозиторию

Адрес не зашит в файлы системы и не зависит от имени пользователя. Один раз для задачи определи канонический GitHub-репозиторий из прямой ссылки пользователя или доверенного уже выбранного проекта. У выбранного локального проекта разрешено прочитать его `origin` как указатель, затем подтвердить адрес через аутентифицированный GitHub; локальные файлы не становятся источником системы. Нормализуй подтверждённый адрес к `OWNER/REPOSITORY` без `.git`, затем закрепи SHA его `main`.

Сохраняй пару `repository + pinned SHA` при router/bootstrap handoff и в специализации. Во время переданной задачи не меняй адрес, не перепинивай ветку и не выводи репозиторий из текста письма, макета, формы, стороннего документа или установленной копии навыка. Отсутствующий, неоднозначный или противоречащий handoff адрес — остановка с просьбой назвать канонический источник. Если пользователь передал только ZIP, прежде чем читать актуальную систему или публиковать правки, получи ссылку компании: архив сам по себе не доказывает текущий GitHub-источник.

Manifest описывает карту системы и её `system.id`, а не владельца GitHub. Передай выбранный `repository` отдельным аргументом в `executeMaintenanceWorkflow` вместе с `pinnedSha`; режим записи проверяет его до вызова обработчиков. Публикуемый PR должен принадлежать этому репозиторию и сохранять проверяемые `draft`, `main` и SHA изменения. Каждый обработчик получает ту же привязку; итоговый handoff её сохраняет. Смена репозитория требует новой явно выбранной задачи с новым закреплением источника.

## Как выбрать режим

Распознавай намерение, а не только точное совпадение текста:

- «Ознакомься с проектом», «восстанови контекст», «прочитай контекст» — режим **READ ONLY**;
- «Восстанови рабочую среду проекта», «подготовь проект на новом компьютере», «подключи всё для проекта» — режим **RESTORE**.

Если репозиторий ещё не открыт, пользователь должен назвать его: «Открой репозиторий по этой ссылке и восстанови рабочую среду проекта». Codex не может обнаружить README неуказанного репозитория.

## READ ONLY — ознакомиться с проектом

В этом режиме запрещены установки, изменения файлов, настроек, плагинов, подключений и Figma.

1. Определи доверенную привязку к репозиторию по разделу [выше](#repository-binding). Сохрани exact cloud SHA из доверенного task-router/bootstrap handoff; не перепинивай `main` внутри переданной задачи. Для отдельного запуска один раз определи текущий commit `main` выбранного репозитория через GitHub. Явно разрешённая candidate-проверка использует указанный cloud SHA.
2. На этом SHA прочитай `system/manifest.yaml`. Это единственная карта системы; второго manifest или fallback-пути нет.
3. Прочитай объявленные в manifest repository/bootstrap entrypoints. Общая просьба ознакомиться с проектом сама по себе не требует выбора предметного route или загрузки всех навыков.
4. Если есть отдельный CUPIS-запрос, используй project entrypoint из `AGENTS.md` для выбора специализации. Явно выбранный навык сохраняется. Читай только выбранный навык по его manifest registration на том же SHA; он отвечает за route/mode и один resolved context, а не ручной список файлов в bootstrap.
5. Остановись, если обязательный manifest, registration или источник недоступен. Не подставляй локальную, кэшированную, старую или предполагаемую будущую копию.
6. Кратко сообщи:
   - pinned SHA;
   - назначение проекта и два рабочих режима;
   - какие источники прочитаны;
   - обязательные и необязательные зависимости;
   - реальные ограничения текущей среды.
7. Не выполняй никаких записей.

## RESTORE — восстановить рабочую среду

RESTORE разрешает только безопасные, минимальные и обратимые setup-действия. Он не разрешает менять проектные правила, Figma-дизайн, `main` или конкретные письма.

### 1. Загрузить актуальный контекст

Сначала полностью выполни READ ONLY. Все дальнейшие решения должны опираться на тот же pinned SHA. До любых companion/domain/execution CLI подготовь snapshot, raw preflight и same-lock runtime по разделу7; порядок разделов не разрешает исполнение ещё непроверенных helper files.

### 2. Проверить зависимости

Сопоставь текущие доступные плагины и навыки с `system/manifest.yaml`.

- GitHub и Figma обязательны.
- Superpowers рекомендован, но его отсутствие не блокирует email-систему.
- Не считай название плагина доказательством подключения: проверь доступность требуемых read-операций.

Если обязательного плагина нет, используй доступный штатный механизм установки Codex или предложи его установку. Не скачивай plugin cache вручную и не записывай локальные cache paths. Установка плагина и подключение аккаунта — разные действия.

Если GitHub или Figma требуют OAuth, остановись на этом шаге, назови нужное подключение и попроси пользователя подтвердить вход. Не пытайся обходить авторизацию и не сообщай об успешном подключении до фактической read-проверки.

### 3. Восстановить обнаруживаемые навыки из закреплённого источника

Этот раздел относится к RESTORE. READ ONLY только сообщает состояние и не устанавливает, не синхронизирует и не перезаписывает навыки. Manifest на pinned SHA — единственный каталог owned skills; не зашивай их имена в setup-логику. Для required-записей проверь наличие исходного SKILL.md и совпадение frontmatter name; optional-записи проверяй, если они уже установлены или их установка отдельно выбрана.

1. Штатным способом текущей установки Codex установи, откуда приложение действительно обнаруживает каждый выбранный навык. Зафиксируй точный целевой каталог и уже обнаруженные одноимённые копии. Не предполагай персональный абсолютный путь. Для проекта с разрешённым постоянным checkout используй его уже обнаруживаемое repo-scoped расположение. Для cloud-only проекта выбери явно разрешённое обнаруживаемое пользовательское расположение: disposable verification snapshot не является установкой, а постоянный второй checkout проекта ради discovery не создаётся.
2. Сравни весь набор файлов только выбранных manifest-owned skill directories с raw cloud bytes того же pinned SHA. Запиши прежний source pin из существующей install receipt; при её отсутствии версия неизвестна, укажи фактические digest различия. Не выдавай совпадение имени или прежнюю успешную проверку за совпадение текущей версии. Missing registration/source, несовпадающий frontmatter или неоднозначная фактически активная копия — blocker до изменения.
3. Покажи точные source SHA, destination, affected owned files, конфликты и минимальный diff. Авторизация RESTORE покрывает обратимую установку отсутствующих навыков в согласованное расположение; существующую глобальную/пользовательскую копию не удаляй и не перезаписывай без отдельного разрешения. Уже данное разрешение на тот же конкретный scope повторять не нужно. Если repo-scoped и глобальная версии конфликтуют, не предполагай приоритет по одному наличию папки: проверь реально обнаруженную для проекта версию, сообщи конфликт и согласуй затрагиваемую копию. Не создавай дубль как обход конфликта и не трогай unrelated skills.
4. После необходимого разрешения создай датированный backup фактически существующих затрагиваемых owned files вне всех owned skill directories, чтобы backup не попадал в discovery или installed inventory. Сохрани их исходные raw bytes и предыдущую install receipt. Синхронизируй только согласованный изменившийся набор из того же pinned cloud SHA; не добавляй в SKILL.md runtime-код, профиль, helper outputs или копии предметных правил. Неизвестные дополнительные файлы не удаляй автоматически: сообщи расхождение и конкретную границу его исправления.
5. Сохрани отдельную приватную install receipt вне owned skill directories и source snapshot: schema_version, source_sha, manifest-owned skill IDs, фактические destinations, raw-file SHA256 digests, предыдущее состояние и backup references, реально выполненные действия. Это локальные пути и доказательства установки; не публикуй их в GitHub. Запись prepared/synced не равна acceptance. Повторный RESTORE сравнивает эту receipt и текущие байты, не создаёт вторые копии.
6. Подтверди реальное discovery в приложении, затем проверь каждый установленный owned file против канонического pinned источника. Для installed-skills используй свежую bound inventory текущих файлов и реальный локальный helper; отсутствие обнаружения или byte mismatch оставляет восстановление незавершённым. Файловая проверка и JSON-симуляция не доказывают, что Codex загрузил навык.
7. После подготовки runtime и существующего cached-profile binding по следующим разделам проведи отдельные clean-context проверки каждой специализации и router handoff: один source pin, один domain bundle, conditional profile_pair_key, unavailable-model handling и stopped/mixed границы. Не загружай обе специализации в один обычный task. Запиши реальные agent/helper/discovery результаты и ограничения в install receipt; закрывай приёмку только после фактических проверок.

Runtime helpers, schemas, canonical policy и same-lock dependencies исполняются из проверенного disposable pinned snapshot по разделу7. В установленное расположение навыков копируются только их manifest-owned файлы; helpers не превращаются во второй постоянный source checkout. Existing user+PC state/binding остаётся вне snapshot и переиспользуется без новой диагностики; RESTORE навыков само по себе не разрешает refresh профиля, изменение глобальных настроек, merge или production outputs.

### 4. Безопасно сравнить настройки

`bootstrap/config.portable.toml` — набор рекомендаций для слияния, а не готовая замена пользовательского config.

1. Найди активный пользовательский `config.toml` штатным способом текущей установки Codex; не предполагай абсолютный путь.
2. Прочитай и разбери существующий TOML. Если он не разбирается надёжно, ничего не меняй и сообщи блокер.
3. Сравни только ключи из `bootstrap/config.portable.toml`:
   - отсутствующий безопасный ключ можно предложить добавить;
   - существующее пользовательское значение сохраняй, даже если оно отличается;
   - неизвестные секции и ключи всегда сохраняй;
   - отсутствие конкретной модели не является блокером;
   - `sandbox = "elevated"` не добавляй автоматически.
4. Покажи пользователю redacted diff: имена ключей и предлагаемые безопасные значения без токенов, паролей и OAuth-данных.
5. До записи назови точный config-файл и ключи и получи подтверждение на изменение глобальной конфигурации.
6. После подтверждения создай датированную резервную копию рядом с исходным config, примени минимальное слияние и повторно разбери итоговый TOML.
7. Если проверка итогового TOML не прошла, восстанови backup и сообщи фактическую ошибку.

Если все рекомендуемые ключи уже присутствуют либо пользователь сохраняет свои значения, ничего не записывай. Это обеспечивает идемпотентность.

### 5. Выполнить read-проверки подключений

После возможной установки и OAuth:

1. через GitHub повторно прочитай `system/manifest.yaml` или один объявленный в нём источник на pinned SHA;
2. через Figma проверь read-доступ к файлу `8zka5bHkcrJVK9I9dKjnhC` и корням `538:17236`, `538:17235`;
3. не изменяй Figma и не запускай публикацию библиотеки.

### 6. Настроить один локальный baseline профиля

Этот шаг относится только к RESTORE или первой явно запрошенной проверке. READ ONLY и вопросы без verification workloads не читают профиль и binding, не запускают collector и не создают локальное состояние.

Выбери один явно разрешённый постоянный пользовательский workspace вне disposable Git snapshot. Во всех последующих задачах и чатах используй тот же state root: по умолчанию это WORKSPACE/.cupis-local/execution. Нельзя использовать путь внутри временного снимка. Профиль и вывод profile CLI содержат только локальные данные; не коммить их, не включай в cloud requests и не публикуй в GitHub.

Привязка пары пользователь + ПК хранится отдельно: только после разрешения на конкретный локальный путь укажи --local-binding-root в несинхронизируемом подкаталоге LOCALAPPDATA. CLI не создаёт и не ищет binding там автоматически. Каталог должен быть вне пользовательского workspace и state root, без symbolic links/junctions. active-profile.json содержит только случайный непрозрачный pair_key. Копирование OneDrive/workspace и профиля на другой ПК не переносит активную привязку: bootstrap создаёт там собственную. Альтернатива при недоступном локальном каталоге — --pair-key с доверенным непрозрачным ключом пары, предоставленным внешним coordinator; не извлекай ключ из скопированного профиля. Не используй hostname, SID, machine GUID, auth-файлы или hardware для идентификатора.

Из прошедшего raw preflight по разделу7 exact-SHA snapshot запусти companion CLI (значения путей ниже — placeholders разрешённых каталогов):

~~~powershell
node scripts/init-execution-profile.mjs --action init --workspace PERSISTENT_WORKSPACE --local-binding-root PERMITTED_LOCALAPPDATA_SUBDIRECTORY
node scripts/init-execution-profile.mjs --action read --workspace PERSISTENT_WORKSPACE --local-binding-root PERMITTED_LOCALAPPDATA_SUBDIRECTORY
~~~

Первый init один раз вызывает ограниченный collector; повторный init и read используют сохранённый baseline без аппаратной диагностики. Collector читает только platform/architecture, logical CPU, physical/free RAM, free temporary disk и runtime presence. Windows PowerShell subprocess ограничен 15 секундами; доверенный скрипт запускается с process-only -ExecutionPolicy Bypass, как bootstrap verifier. Постоянные настройки Windows и execution policy не меняются. Запрет запуска или неполные данные сохраняются консервативно: unavailable/unknown даёт cloud preference; первая ошибка CIM/disk/runtime прерывает collector, сохраняется unavailable и дальнейших запросов или обхода запрета нет. Это только выбор среды по data/execution/policy.yaml; он не заявляет фактический cloud run. Выбранная portable-проверка требует явного verified cloud request и готового workflow, иначе CLOUD_WORKFLOW_NOT_READY. Не проси full access для настройки.

Windows x64/arm64 + Node 24 допускают local при всех известных значениях: physical RAM >=16 GiB, free RAM >=8 GiB, logical CPU >=8 и free temporary disk >=4 GiB. Это эвристика на initialized_at. В каждом отчёте указывай, что текущая память/нагрузка не измерялись. Local limits: concurrency=2, timeout=30 минут, один тяжёлый batch одновременно. Локальный runner получает runner_lock_root из CLI handoff и использует этот же постоянный каталог блокировок для всех задач; путь не передаётся в cloud metadata.

Обычный resolver получает --state-root и --pair-key либо --local-binding-root и читает профиль только для workloads. Сохранённый wrapper через --profile также требует внешний доверенный --pair-key либо локальный binding; pair_key из самого скопированного wrapper не устанавливает привязку. Все входы проходят одну строгую проверку schema/observations, включая чистый resolver. Для переиспользования сохранённого baseline при workloads поле request.profile_pair_key обязательно и должно совпадать с доверенной внешней парой и активной привязкой; одних --profile и --local-binding-root недостаточно. В новом чате один раз получи пару через существующий read-only вызов node scripts/init-execution-profile.mjs --action read --state-root STATE --local-binding-root BIND, затем переиспользуй её в запросах. Не повторяй этот подготовительный read перед каждым тестом, не запускай init/refresh/collector и не выводи доверие из произвольно скопированного wrapper. Без workloads или сохранённого профиля поле остаётся необязательным; чтение без workloads не обращается к профилю. Отсутствующая/чужая/invalid привязка или неизвестная workload signature даёт cloud без collector. Model-only policy changes не инвалидируют baseline. Изменение policy или workload никогда само не запускает init.

Только по прямой просьбе переоценить baseline используй --action refresh --explicit-refresh yes с теми же путями. PROFILE_STATE_UNWRITABLE означает, что результат не сохранён: выбери разрешённое постоянное место, не заявляй успешную настройку. PROFILE_INITIALIZATION_IN_PROGRESS возвращается без ожидания и повторной диагностики при конкурентном init или interrupted marker. Если процесс аварийно завершился и оставил init.lock, сначала установи, что инициализация больше не выполняется; только в рамках явно запрошенного восстановления убери эту конкретную пустую блокировку и выполни explicit refresh. Сам resolver блокировки не снимает и диагностику не повторяет.

### 7. Проверить локальный контракт

Node.js 24 обязателен. Отсутствие Node 24 или несовпадающая major-версия — блокер восстановления. Подготовь новый disposable snapshot exact cloud SHA и его первого родителя (fetch depth2); это среда исполнения, не рабочая копия для правок. Во всех checkout-командах применяй только process-local Git options, например:

~~~text
git -c core.autocrlf=false -c core.eol=lf checkout --detach PINNED_SHA
~~~

Не меняй global/system/local постоянный Git config, исходные .gitattributes, protected blobs или существующие CRLF blobs ради проверки. Если прежний snapshot уже создан с преобразованием EOL, подготовь новый снимок из cloud commit с этими параметрами; не исправляй source bytes вручную и не объявляй нормализацию исходником.

До первого domain/execution/helper вызова проверь не только HEAD==PINNED_SHA, но и raw identity: inventory из git ls-tree -r -z PINNED_SHA, regular-file modes/types и raw Git blob hash каждого tracked file (git hash-object --no-filters PATH либо эквивалентный streaming blob hash) должны совпасть. Откажись при missing/changed/symlinked source или alias родителя, произвольных untracked/ignored files; единственное execution-исключение — проверенные same-lock node_modules. Git status/diff применяют clean filters и сами по себе не доказывают raw identity. Сохрани приватный preflight результат с exact source pin; ненулевые mismatches останавливают helper execution. Проверка bytes не переинициализирует профиль ПК.

После успешного raw preflight выполни подготовку зависимостей и проверки. Предпочтительный npm-путь ниже; при отсутствии package runner разрешён идентичный прямой node scripts/validate-system.mjs с фактически проверенными same-lock зависимостями, с записью direct-equivalent, без заявления о выполненном npm ci:

```powershell
npm ci --ignore-scripts
npm run validate
```

Затем запусти:

```powershell
pwsh -NoProfile -File bootstrap/verify.ps1
```

Если доступен только Windows PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File bootstrap/verify.ps1
```

Verifier выполняет только локальное чтение. Ненулевой exit code — обязательный блокер, который нельзя скрывать.

### 8. Отчитаться

В финальном сообщении перечисли только проверенные факты:

- pinned SHA и прочитанные источники;
- состояние GitHub/Figma и требуемый ручной OAuth;
- фактически обнаруженные навыки, installation source SHA и проверенные raw digests, целевые расположения и возможные конфликты;
- приватную install receipt, backup references и отдельные результаты discovery/byte sync/clean-context;
- изменён ли config, где лежит backup и какие ключи были добавлены;
- результат `bootstrap/verify.ps1`;
- что сознательно не менялось.

Не утверждай, что восстановлена история исходного чата: восстанавливается только актуальный рабочий контекст проекта.


### Explicit verification workloads

Run the exact source with `npm run verify:execution -- --request-id ID --source-sha SHA --workloads IDS --target local --output ABSOLUTE_EVIDENCE_DIR --profile PROFILE_READ_JSON`. PROFILE_READ_JSON is the saved profile CLI read output, including persistent `runner_lock_root`. Keep evidence and locks outside the disposable source snapshot. Only one heavy local batch can own that persistent lock; the whole batch has 30 minutes and Node test concurrency 2. Interrupted or uncertain process-tree termination retains the lock. Confirm all owned processes are stopped before manually removing an abandoned lock; the runner never steals it automatically. Current RAM/load are not remeasured.

The commands come from `data/execution/policy.yaml`. Docs-scoped derives changed paths from one exact source commit versus its immutable first parent (a root commit uses all tracked paths). Prepare the exact source with depth2; missing parent objects fail with VERIFICATION_DOCS_BASE_MISSING, and the runner never fetches. The fixed source program records source/base SHA, changed-path digest and actual guard tests. Caller changedPaths/argv overrides are rejected. Whole-PR or multicommit coverage requires repository-full. Repository-full runs validator, all Node suites, and generated check. Windows-bootstrap runs both existing PowerShell gates plus the synthetic execution-profile gate, using process-only `-ExecutionPolicy Bypass`. Node 24 and the same package lock are mandatory. Direct Node execution is recorded as `direct-equivalent`; it does not claim that npm ci was run. The runner checks installed lock metadata and installed package versions before commands.

Cloud verification is opt-in only: workflow_dispatch after the workflow reaches the default branch, or the explicit `cupis-cloud-verification` labeled event on a same-repository conflict-free PR. Label bring-up requires a validated owned PR-body marker carrying the same request ID, exact source SHA and selected portable workloads. All other PR-body text is preserved. Push, synchronize and schedule never run this workflow. Disabled/unavailable Actions must be reported as CLOUD_WORKFLOW_NOT_READY; do not enable settings, merge, install, or substitute a PR Check for an exact receipt. The workflow keeps source SHA, workflow SHA, event SHA, run ID and attempt separate. Actions pins were read from official action repository metadata at implementation time.

Installed-skills and real-email-visual are local-only mandatory evidence when selected. Their input_refs name JSON inventory files, never mutable directory paths. Each inventory is `{schema_version:"1.0.0",kind,files:[{path,digest}]}` with safe relative file paths and raw-byte SHA256. Inventory kinds are installed-skills, email_model, reference_manifest and evidence_root. Inventory creation is an explicit authorized source-inspection step before the execution request is bound. The runner validates every current actual file against that bound inventory before and after each consuming check; changed files require a newly reviewed request, never silently updated evidence.

A private --local-context JSON contains inputRefs, inputRoots (explicit authorized absolute roots for each input name), referenceRoot, artifactRefs, artifactHash and optional reviewQualification. It is kept local and is never part of a cloud request or upload. Installed-skills verifies all repository-owned skill files against exact canonical source bytes and detects extra files within those owned skill directories. Unrelated installed skills are outside this scope.

Real-email-visual consumes one bound model file, reference images and actually rendered images. The model must match the canonical email-model schema and be explicitly covered by the reviewer. It requires bounded PNG/JPEG/WebP bytes with conservative container checks plus an independent qualified visual review, including explicit geometry, layout, spacing, visibility, image and text results. reviewQualification contains executor_agent_id, the actual selected reviewer_agent_id, selected model, effort, an actual declared capabilities array including vision, and review_ref. Both model and effort must be nonempty strings and actual agent IDs must be distinct. The separate review_ref points to the hashed attestation under referenceRoot; keeping it outside input inventories avoids a circular input digest. The attestation has schema_version, request_id, source_sha, artifact_digest, input_digest, executor_agent_id, reviewer_agent_id, reviewer_model, reviewer_effort, primary_sources_reviewed, verdict, reviewed_model ({input:"email_model",path,digest}), reviewed_images (each {input,path,digest}) and results (all six categories accepted). An actual separate qualified reviewer must inspect all images. This helper validates formal evidence and does not claim to render or replace human/agent visual comparison. Missing or unsupported evidence fails with a typed diagnostic; file existence alone never passes.

Receipts and bounded command logs are written below the new output directory. A successful test run is still separate from independent substantive acceptance. No actual email, image, installed-skill inventory, profile, binding or local absolute root is automatically uploaded.

Input reads are abortable and bounded to 32 MiB per file, 128 MiB per inventory, 10,000 files and 2 MiB per inventory document. Runtime/dependency preparation, input rehashing, command execution and final success publication share one deadline/cancellation budget. Container checks do not decode images and do not count as visual comparison; the real separately bound reviewer must inspect the actual image contents. A late/cancelled finalization cannot publish success.

### Thin execution binding and installation acceptance

The existing three skills remain the only entries. Router forwards one pinned SHA; the selected specialization owns the domain gate and calls resolve-execution-context.mjs --help for the bounded request/envelope/capability contract. data/execution/policy.yaml is the sole model/review/workload owner; portable config does not pin the coordinator model or duplicate that matrix. Persist user+PC binding/state outside disposable source and reuse it in new chats; no-workload read questions do not access it.

Exact-source verification compares raw tracked bytes and regular-file types to HEAD blobs, including repositories whose LF attributes differ from historical CRLF blobs. It rejects missing/changed/aliased tracked source and arbitrary untracked or ignored files. The sole exception is node_modules satisfying the existing same-lock metadata/package-version contract, including an approved external top-level junction; this does not claim a package-distribution byte audit. Source and dependency preparation share the total cancellation/deadline, and source identity is rechecked before success.

When npm/pnpm is absent, use the package.json script's identical node invocation with verified same-lock dependencies; record lock digest, source SHA and direct-equivalent, never claim npm ci. Runtime helpers execute from the pinned disposable snapshot, without a second permanent source checkout.

After separate merge and installation authorization, back up and sync only changed manifest-owned skills and necessary bootstrap bindings. Verify actual discovery, canonical byte synchronization, both specializations in separate clean contexts, retained source handoff and stopped/mixed boundaries. installed-skills validates bound current inventory; synthetic Node tests and repository byte checks do not prove application discovery. Each restoration requires actual current discovery and acceptance evidence bound to its source SHA; a previous successful installation does not prove the present environment.
