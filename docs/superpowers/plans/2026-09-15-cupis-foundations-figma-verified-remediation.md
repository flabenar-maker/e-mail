# CUPIS Foundations 2–5 Figma-Verified Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Устранить установленные ревизией недостатки этапов 2–5 и доказать актуальность implementation-significant фактов прямой проверкой Figma на каждом пакете, не меняя без разрешения дизайн или действующие component contracts.

**Architecture:** Это единый корректирующий маршрут из последовательно проверяемых пакетов, а не повторная миграция foundations. Figma владеет фактическим устройством библиотеки; структурированные файлы владеют подтверждёнными машинными данными; отдельные audit records фиксируют проверку, но не становятся вторым источником правил. Каждый пакет имеет собственный Figma gate, точную область изменений, локальные проверки и отдельный PR.

**Tech Stack:** Figma MCP для read-only фактов; GitHub CLI как основной облачный канал; Node.js 24, YAML, JSON Schema, node:test; PowerShell 7 и Windows PowerShell 5.1 для bootstrap; изолированный локальный снимок только для проверок.

**Spec:** docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md. Статус и зависимости: docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md. Исходная ревизия выполнена на main@0dd2bd6fbabbd36993713aaf654f6ed2fa4c2b71.

**Status:** план опубликован для review; пакеты 0–6 не начаты. Этот документ не является Figma-разрешением или разрешением на merge.

## Global Constraints

- До каждого пакета заново закрепить SHA main, прочитать system/manifest.yaml, маршрут migration-progress, README, текущий roadmap и применимые Core/foundation/component sources. SHA в заголовке — исторический baseline, не разрешение работать с устаревшей версией.
- В каждом пакете до первого изменения и перед его закрытием обратиться к живой Figma только через MCP. Проверять точные данные затронутой области, а не принимать старый Markdown, дату verified_at, скриншот или прежний audit report за живое доказательство.
- Для каждого наблюдения фиксировать file key, node/style ID, variant и viewport, точный путь поля, фактическое значение, binding, время чтения, сопоставляемый source path и результат сравнения. Скриншот дополняет, но не заменяет машинные значения.
- Figma MCP не даёт неизменяемый revision всей библиотеки. Поэтому перед merge повторно считать затронутые узлы и сравнить их fingerprint с исходным чтением. Если они изменились, повторить затронутую сверку.
- Если факт расходится, зафиксировать точную разницу и решение пользователя до изменения значения. Не переносить число из Figma автоматически, если оно может быть ошибкой дизайна; не объявлять расхождение допустимым по памяти.
- Ни один пакет не разрешает Figma write, переименование, изменение Auto Layout, геометрии, properties, bindings или Description. Для этого нужен отдельный scope и разрешение. Успешная сверка сама по себе не разрешает запись.
- HTML конкретного письма, images, локальные рабочие папки, production routes, Legacy/ и generated docs как ручной источник не меняются. Generated docs изменяются только генератором после изменения их structured inputs.
- GitHub — единственный постоянный источник. Правки через branch и PR от закреплённого SHA; локальный изолированный снимок точного commit допускается только для проверки. GitHub Actions и PR Checks не запускать и не использовать как gate.
- Рутинные тесты, test-fix loops и visual regression делегировать GPT-5.6 Terra Medium согласно AGENTS.md. Перед merge кода или контрактов выполнить свежий локальный полный прогон на точном финальном commit. Merge — только по отдельной команде пользователя.
- Галочки исторических этапов 2–5 не сбрасывать. Этот план не завершает этап 8, не заменяет полное shadow comparison этапа 13 и не включает paused routes до этапа 14.

## File Responsibility Map

Ниже — разрешённые кандидаты для будущих implementation PR, а не изменения, разрешённые самим созданием этого плана.

- docs/superpowers/audits/ — компактные адресные Figma-свидетельства и решения по расхождениям. Они не содержат копии общих правил или полного дерева библиотеки.
- scripts/audit-figma-contract-facts.mjs и scripts/lib/figma-contract-facts.mjs — существующий механизм сверки компонентных фактов. Переиспользовать для component-specific полей; не создавать параллельный полный registry.
- tests/bootstrap-contract.Tests.ps1 — fixture и Windows-контракты bootstrap.
- data/foundations/typography.yaml, scripts/lib/typography-foundation.mjs, scripts/lib/generated-docs.mjs и применимые tests/foundation/ — определения стилей, согласованность описаний и генерация документации.
- data/foundations/spacing.yaml, scripts/lib/spacing-foundation.mjs, docs/superpowers/specs/2026-08-25-cupis-spacing-foundation-design.md, scripts/lib/context-bundle.mjs и применимые тесты — design-time модель и точная граница HTML.
- data/foundations/assets.yaml, core/asset-export-standard.md, data/components/*.yaml и применимые тесты — общие правила экспорта и конкретные владельцы/границы. Component contracts изменять только по доказанному расхождению и решению пользователя.
- data/foundations/figma-naming.yaml, scripts/lib/figma-name-generator.mjs, scripts/lib/figma-name-validator.mjs и применимые тесты — определения и две глубины проверки имени.
- tests/characterization/, package.json и bootstrap/README.md — только необходимые активные регрессии и явные локальные команды проверки; Legacy не возвращать в активный маршрут.
- docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md — только ссылка на этот корректирующий маршрут и фактический статус его пакетов; не копировать в roadmap технические правила.
- docs/superpowers/plans/cupis-active-work-context.md не менять автоматически: это ручной checkpoint, обновляемый только по отдельной просьбе пользователя.

## Единый Figma Gate для каждого пакета

- [ ] Определить точные Figma-узлы/стили, их типы и связанные component IDs до чтения. Сверить file key с manifest.
- [ ] Снять через MCP свежие фактические поля нужных вариантов; если объект имеет Mobile/Desktop-версии, проверить обе независимо. Для property/variable claim проверить реальную binding, а не совпадение чисел. Для file/root metadata viewport не выдумывать.
- [ ] Сопоставить каждое наблюдение с конкретным structured field. Отметить exact match, доказанное расхождение, невыразимый факт или недоступные данные. Без Figma-доступа пакет не закрывать.
- [ ] Перед изменением показать impact report: какие определения, компоненты, generated outputs, bundle profiles и тесты будут затронуты; что должно остаться неизменным.
- [ ] После изменений перечитать Figma-объекты отдельно от исходного чтения. При новом fingerprint или расхождении вернуть пакет на сравнение; не использовать результат до изменения как финальный.
- [ ] Сохранить в audit record только наблюдения, расхождения и ссылки на источники. Никаких новых нормативных чисел в audit record.

### Task 0: Сделать фактическую проверку воспроизводимой

**Figma scope:** file key из manifest; фактические Marketing и Service roots; способ получения node/style IDs и bindings. Для проверки механизма достаточно одного узла каждого нужного типа; полная библиотека принадлежит пакетам 2–5.

**Files:** существующие scripts/audit-figma-contract-facts.mjs и scripts/lib/figma-contract-facts.mjs; при доказанной невозможности переиспользования — отдельный узкий comparator и его тесты; audit record в docs/superpowers/audits/.

- [ ] Пройти единый Figma Gate и зафиксировать, какие поля уже проверяет существующий comparator.
- [ ] На одном точном компонентном поле показать проход, на намеренно отличающемся поле — typed mismatch. Для фактов foundations, не представимых текущим comparator, описать минимальный отдельный record: observation key = file key + node/style ID + variant + field path; expected source path; raw value; binding; captured_at.
- [ ] Написать failing tests на отсутствие node ID, viewport для viewport-specific факта, точного поля или binding при заявлении о variable/style. Проверить, что неполная запись не получает статус verified.
- [ ] Добавить только необходимую проверку этого record, запустить целевые тесты и выполнить повторное MCP-чтение тестового объекта.
- [ ] Закрыть пакет, только если будущие задачи смогут отличить фактически считанное значение от унаследованного текста. Не строить новую общую систему хранения полного Figma-файла.

### Task 1: Исправить системный bootstrap gate после изоляции Legacy

**Figma scope:** проверить через MCP, что file key и оба рабочих корня, записанные в manifest, действительно ведут к текущей библиотеке. Figma не используется как доказательство корректности PowerShell.

**Files:** tests/bootstrap-contract.Tests.ps1; при необходимости bootstrap/README.md для явной Windows-команды. Не менять bootstrap/verify.ps1 без отдельного воспроизведения дефекта именно в нём.

- [ ] Пройти единый Figma Gate для file key и roots.
- [ ] В изолированном снимке точного commit воспроизвести падение Copy-ContractFixture: тест ожидает верхнеуровневые registry и templates, находящиеся в Legacy/.
- [ ] Написать проверку fixture, которая использует только реально необходимые активные источники текущего manifest и не копирует архив как рабочий dependency.
- [ ] Исправить fixture; запустить весь tests/bootstrap-contract.Tests.ps1 до последнего assertion под PowerShell 7 и Windows PowerShell 5.1. После первого исправления не объявлять успех, пока не раскрыты возможные следующие падения.
- [ ] Запустить bootstrap/verify.ps1 в обеих оболочках, проверить повторяемость и отсутствие изменения проверяемых файлов.
- [ ] Закрыть пакет, когда npm run verify, standalone bootstrap-contract и оба verifier-прогона зелёные на точном final commit; Figma roots перед закрытием перечитаны.

### Task 2: Проверить типографику и исключить расхождение описаний с числами

**Figma scope:** все 15 активных стилей из data/foundations/typography.yaml; имена/IDs, family, style, CSS weight equivalence, size, line height, letter spacing, Figma Description и фактические style bindings в затронутых компонентах. Mobile и Desktop сверять независимо.

**Files:** data/foundations/typography.yaml; scripts/lib/typography-foundation.mjs; scripts/lib/generated-docs.mjs; schemas/typography.schema.json только при необходимости изменения формы; tests/foundation/typography-foundation.test.mjs и generated-docs tests.

- [ ] Пройти единый Figma Gate для стилей и bindings. Не объявлять Figma style correct на основании verified_at или старого Markdown-снимка.
- [ ] Составить поле-за-полем таблицу Figma ↔ YAML. Каждый конфликт направить на решение пользователя до смены метрик. Смена Figma Description, даже текстовая, не входит в этот пакет автоматически.
- [ ] Добавить failing test: изменение font_size_px/weight/line_height/letter_spacing не может оставить в generated description прежнее число или старое имя начертания.
- [ ] Убрать независимую ручную копию числовых метрик из сохраняемого текста либо формировать её из тех же полей. Смысловое назначение и запреты использования стиля сохранить.
- [ ] Проверить 15 стилей, 8 responsive pairs, точные значения, generated typography registry и повторное чтение затронутых Figma styles.
- [ ] Закрыть пакет, когда нет неподтверждённого metric mismatch и описание не может расходиться с машинными числами.

### Task 3: Сделать доказуемым правило отступов и уточнить границу HTML

**Figma scope:** актуальные производственные Mobile/Desktop-варианты в Marketing, Service и реально существующих общих/root областях. Проверять parent/child ownership, padding по четырём сторонам, item/counter-axis gap, outer flow, локальные компенсации, alignment, sizing и binding каждого спорного поля. Не считать exported empty area отступом.

**Files:** data/foundations/spacing.yaml; docs/superpowers/specs/2026-08-25-cupis-spacing-foundation-design.md; component contracts только при доказанной ошибке и решении пользователя; tests/foundation/spacing-foundation.test.mjs; тесты context bundle. system/manifest.yaml и scripts/lib/context-bundle.mjs менять только если проверка выявит реальное нарушение текущей границы.

- [ ] Пройти единый Figma Gate и сохранить адресную таблицу наблюдений, которой не хватало историческому плану: node, viewport, field, relationship, owner, raw value, binding, выбранная роль либо доказанное исключение.
- [ ] Сопоставить все проверяемые отношения с 15 ролями spacing foundation. Показать каждый unexplained/ambiguous relationship отдельно; не создавать новую роль по одному совпавшему числу.
- [ ] Добавить failing tests для неверного разрешения конкретной роли/viewport и для утечки design-time выбора в HTML. Проверить, что bundle содержит максимум заранее разрешённое точное значение, а renderer не запускает golden-rule resolver.
- [ ] После подтверждения фактов убрать устаревший draft-статус design spec и сформулировать точную границу: resolved component value допустим в build context, алгоритм выбора spacing role — нет.
- [ ] Повторно прочитать через MCP затронутые Figma-отношения. Закрыть пакет при полном объяснении области аудита и отсутствии fallback/набора «допустимых» HTML-значений.

### Task 4: Подтвердить модель экспорта и происхождение asset-правил

**Figma scope:** каждый тип используемого asset contract в текущих компонентах: source node/FILL, собственный Fill и parent Fill, вложенная видимая графика, export owner, @2x/@4x, raw raster dimensions, rendered boundary, crop, alpha и Mobile/Desktop display geometry. Для реального письма исходником является конкретный Desktop-инстанс после overrides; библиотечный placeholder не подтверждает иной будущий инстанс.

**Files:** data/foundations/assets.yaml; core/asset-export-standard.md только при доказанном нормативном противоречии; применимые data/components/*.yaml только после решения пользователя; tests/foundation/assets-foundation.test.mjs; активные точечные characterization assertions и audit record.

- [ ] Пройти единый Figma Gate по всем asset owners, которые нужны для сравнения режимов и компонентных границ. Отдельно отметить факты, которые Figma не может подтвердить: JPEG quality 82/90 — правило экспорта, а не свойство дизайн-узла.
- [ ] Сопоставить каждый source_mode_id/display_mode_id/export_profile_id/expected_alpha_id/clipping_policy_id с фактическим owner и границей. Разделить raw Fill, отрендеренный файл и HTML display размер.
- [ ] Восстановить проверяемую карту происхождения общих правил: нынешнее поле foundation ↔ исторический comparison source ↔ прямой Figma-факт там, где он существует. Legacy использовать только как read-only baseline, не как действующую инструкцию.
- [ ] Добавить тесты, предотвращающие потерю own visible Fill, попадание parent Fill/искусственной подложки, замену @4x PNG, деформацию direct-image и выбор source/display mode по догадке.
- [ ] На временном тестовом asset проверить хотя бы каждую реально используемую комбинацию source mode и export profile; результат не добавлять в библиотеку и не менять локальные письма.
- [ ] Повторно прочитать Figma boundaries и закрыть пакет только при ясном owner/source/export/display для каждого проверяемого contract. Вопрос конкретных Desktop email-инстансов остаётся gate сборки соответствующего письма.

### Task 5: Разделить синтаксис и семантику нейминга

**Figma scope:** текущие production component/layer/property/variant/asset-owner имена в областях библиотеки; реальные роли объектов, связи свойств и действующие scale suffixes. Никаких массовых rename.

**Files:** data/foundations/figma-naming.yaml; scripts/lib/figma-name-validator.mjs; scripts/lib/figma-name-generator.mjs; tests/foundation/figma-name-validator.test.mjs и figma-name-generator.test.mjs; audit record.

- [ ] Пройти единый Figma Gate; для каждого спорного имени отдельно записать observed name и подтверждённую семантическую функцию. Если функцию нельзя установить, оставить typed semantic-role-required, не угадывать.
- [ ] Добавить failing tests: имя с корректной lower-kebab формой, но запрещённой смысловой категорией, не должно получать статус fully confirmed для нового предложения; отсутствующий controlled role не должен считаться доказанным.
- [ ] Развести результаты existing-name audit и new-name proposal: синтаксическая допустимость не равна семантическому подтверждению. Существующие имена вне области не переименовывать.
- [ ] Покрыть оба предусмотренных вида asset-owner имени явным видом объекта; обычный rename сохраняет действующий @2x/@4x, а смена scale требует отдельного export-contract решения.
- [ ] Повторно прочитать Figma names/properties/owners и закрыть пакет, когда генератор и валидатор не расходятся по одному и тому же подтверждённому candidate.

### Task 6: Свести регрессии и зафиксировать результат без преждевременного cutover

**Figma scope:** повторное MCP-чтение всех объектов, чьи факты использованы для итогового принятия пакетов 1–5; при изменении fingerprint перепроверить только затронутые сравнения. Важно отличать дату последнего чтения Figma от даты GitHub commit.

**Files:** tests/characterization/ и package.json только для необходимых активных проверок; generated docs только через generator; roadmap только для статуса этого корректирующего маршрута. Не менять Legacy/ и paused routes.

- [ ] Выбрать из архивных typography/spacing/assets/naming shadow tests утверждения, которые всё ещё выражают обязательный смысл; заменить устаревшие сравнения с Markdown проверками текущих точных данных и сохранённого Figma evidence.
- [ ] Проверить, что active npm test включает эти assertions, а не только наличие архивных файлов.
- [ ] Выполнить targeted tests после каждого изменения; на точном final commit — npm run verify, generate:check, bootstrap-contract под обеими PowerShell-оболочками и проверки bundle границы.
- [ ] Выполнить финальный Figma Gate и allowed-path diff. Отдельно проверить, что не менялись HTML-письма, images, Figma, Legacy, stage 8 renderer coverage и статусы 8/13/14.
- [ ] После слияния каждого implementation PR обновлять в roadmap только фактический статус этого корректирующего маршрута и ссылку на PR. Не отмечать этап 13 выполненным: он позже проверяет результат полных maintenance, development и email-build маршрутов.

## Порядок публикации и критерий успеха

Пакеты 0–6 идут последовательно; каждый — отдельный небольшой PR и самостоятельный review gate. Пакет 1 можно выполнить до остальных доменных пакетов только после обязательного Figma root check. Пакеты 2–5 не объединять в один массовый PR: расхождение в одной области не должно скрывать статус другой. Все Figma read-only observations относятся к фактическому времени чтения; перед merge каждого PR нужен новый read-back.

Итог успешен только если для каждого исправленного implementation-significant факта существует цепочка «актуальный Figma node/style и поле → точное structured field → действующая проверка → понятное действие при расхождении», а отдельные Windows и active characterization gates действительно выполняются. Готовность foundations не означает готовность произвольного production-письма, завершение этапа 8 или cutover.