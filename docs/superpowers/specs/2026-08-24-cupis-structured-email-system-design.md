# Master-дизайн структурированной CUPIS email-системы

Статус: дизайн согласован в рабочем чате; документ ожидает финального review пользователя.
Дата: 24 августа 2026 года.
Последнее архитектурное уточнение: 7 сентября 2026 года — component documentation contracts.
Репозиторий: `flabenar-maker/e-mail`.
Baseline: `main@48e4d6c5f51e1ccd2311b52f5805616f183150a8`.
Резервная точка: `backup/pre-structured-migration-2026-08-24`.

## 1. Назначение

Система должна поддерживать две рабочие задачи:

1. обслуживание CUPIS email-библиотеки в Figma и связанных канонических источников GitHub;
2. сборку новых и изменение существующих HTML-писем в локальных версионных папках.

Переход заменяет набор вручную согласуемых Markdown-источников гибридной архитектурой:

- точные факты и связи хранятся в структурированных данных;
- смысловые и нормативные правила остаются в Markdown;
- workflows описываются в проверяемом формате;
- документация для человека генерируется;
- Codex получает один resolved context bundle под конкретную задачу;
- навыки остаются тонкими маршрутизаторами.

Конкретные `email.html`, `images/`, тестовые результаты и финальные письма не хранятся в системном репозитории.

## 2. Принципы

1. У каждого факта один владелец.
2. В системе один manifest.
3. Mobile и Desktop имеют самостоятельные законченные контракты.
4. Скрытые цепочки inheritance и override запрещены.
5. Общие foundations переиспользуются по стабильным ID.
6. Generated-файлы не редактируются вручную.
7. Figma-запись всегда ограничивается заранее подтверждённой областью.
8. Точный результат важнее автоматического продолжения при расхождении.
9. Миграция выполняется по доменам с shadow-сравнением.
10. Старые дубли удаляются только после подтверждённого cutover.
11. Полный component registry и компактный Figma Description генерируются из одной structured component-записи.
12. Figma Description не является источником implementation semantics и не входит в HTML-build context.
13. Полный component contract содержит только факты, влияющие на реализацию; безвредный внутренний инвентарь Figma в него не переносится.

## 3. Владение данными

### 3.1. Figma

Figma владеет фактическим визуальным устройством библиотеки:

- типом и иерархией узлов;
- geometry;
- variants;
- component properties;
- semantic layers;
- Auto Layout;
- visibility;
- variable и style bindings;
- фактическими Fill;
- границами и устройством export assets.

Конкретные Mobile/Desktop-инстансы письма владеют содержанием, порядком, видимостью и визуальным результатом конкретного письма.

### 3.2. Структурированные данные GitHub

Структурированные данные владеют:

- стабильными системными ID;
- формализованными component contracts;
- точными foundation definitions;
- Mobile/Desktop implementation semantics;
- asset export contracts;
- каноническими purpose и component-specific constraints для generated registry и Figma Description;
- Figma identity и последним проверенным fingerprint;
- связями между компонентами, foundations и workflows.

Полный Markdown-реестр является generated-представлением component contract для человека. Figma Description является отдельной компактной generated-проекцией: stable ID, purpose, вычисленный render type и выбранные critical constraints. Ни один из этих outputs не редактируется как самостоятельный источник.

### 3.3. Core

Core владеет нормативными правилами и принципами:

- общим email rendering standard;
- общей адаптивностью и совместимостью;
- нормативными правилами типографики;
- глобальными правилами assets;
- правилами устройства Figma-библиотеки.

Core не содержит перечень компонентов, node IDs, компонентные размеры или component descriptions.

### 3.4. Workflows и skills

Workflow владеет последовательностью действий, gates, разрешёнными записями, обязательными проверками и stop conditions.

Skill определяет тип задачи, выбирает workflow, запрашивает bundle и выполняет handoff. Skill не владеет техническими правилами, списками путей, node IDs или component contracts.

## 4. Единый manifest

`system/manifest.yaml` является единственной картой системы. Он содержит:

- версию manifest schema;
- идентификатор и репозиторий системы;
- entrypoints;
- каталоги Core, data, schemas, workflows и generated docs;
- route definitions и bundle profiles;
- repo-scoped skills;
- обязательные и необязательные плагины;
- Figma file key и library roots;
- bootstrap config и verifier;
- команды проверки и генерации.

Manifest не содержит component contracts или копии нормативных правил.

При foundation-миграции все потребители атомарно переключаются на `system/manifest.yaml`, после чего `bootstrap/manifest.yaml` удаляется в том же PR. Redirect, compatibility copy или второй manifest не создаются.

## 5. Целевая структура

```text
/
├─ AGENTS.md
├─ README.md
├─ package.json
├─ package-lock.json
│
├─ system/
│  ├─ manifest.yaml
│  └─ migrations/
│
├─ data/
│  ├─ foundations/
│  │  ├─ typography.yaml
│  │  ├─ spacing.yaml
│  │  ├─ assets.yaml
│  │  └─ figma-naming.yaml
│  └─ components/
│     ├─ shared.yaml
│     ├─ marketing.yaml
│     └─ service.yaml
│
├─ schemas/
│  ├─ manifest.schema.json
│  ├─ typography.schema.json
│  ├─ spacing.schema.json
│  ├─ assets.schema.json
│  ├─ figma-naming.schema.json
│  ├─ components.schema.json
│  └─ workflow.schema.json
│
├─ core/
│  ├─ email-rendering-standard.md
│  ├─ typography-standard.md
│  ├─ asset-export-standard.md
│  ├─ component-contract-standard.md
│  ├─ figma-component-description-standard.md
│  └─ figma-library-standard.md
│
├─ workflows/
│  ├─ library-maintenance.yaml
│  └─ email-build.yaml
│
├─ scripts/
│  ├─ lib/
│  │  ├─ figma-naming-foundation.mjs
│  │  ├─ figma-name-generator.mjs
│  │  └─ figma-name-validator.mjs
│  ├─ validate-system.mjs
│  ├─ generate-docs.mjs
│  ├─ build-context-bundle.mjs
│  ├─ normalize-figma-snapshot.mjs
│  └─ compare-figma-registry.mjs
│
├─ tests/
│  ├─ fixtures/
│  ├─ validation/
│  ├─ generation/
│  └─ characterization/
│
├─ docs/generated/
│  ├─ component-registry.md
│  ├─ typography-registry.md
│  ├─ asset-registry.md
│  ├─ naming-reference.md
│  └─ workflow-checklists/
│
├─ .agents/skills/
│  ├─ maintaining-cupis-email-system/
│  └─ building-cupis-email/
│
├─ bootstrap/
│  ├─ README.md
│  ├─ config.portable.toml
│  └─ verify.ps1
│
└─ templates/
   └─ email-project-brief.md
```

Компонент существует ровно в одном из файлов:

- `shared.yaml` — общий для библиотек;
- `marketing.yaml` — только маркетинговый;
- `service.yaml` — только сервисный.

После cutover старый `registry/`, прежние Markdown-checkpoints и разобранный общий prompt удаляются, когда их содержимое подтверждённо представлено новыми владельцами.

### 5.1. Подсистема Figma naming

Подсистема разделяется на независимые части с одним владельцем правил:

- `data/foundations/figma-naming.yaml` хранит машинно-читаемые naming definitions, контролируемые словари, шаблоны, порядок осей и обязательные служебные части имени;
- `schemas/figma-naming.schema.json` задаёт строгую форму foundation;
- `scripts/lib/figma-naming-foundation.mjs` загружает foundation и проверяет его внутреннюю согласованность;
- `scripts/lib/figma-name-validator.mjs` проверяет существующее или предлагаемое имя по foundation и возвращает точные diagnostics;
- `scripts/lib/figma-name-generator.mjs` детерминированно собирает рекомендуемое имя из явно подтверждённой семантики объекта.

Генератор не читает и не изменяет Figma, не угадывает назначение неоднозначного объекта и не хранит собственные naming rules. Его вход обязан явно задавать классификацию и подтверждённую функцию объекта; для asset owner также передаётся действующий scale suffix. Если этих данных недостаточно, workflow возвращает typed blocker `semantic-role-required` вместо имени.

Maintenance skill не запускает полный naming-аудит при каждой работе с библиотекой. Он применяет проверку только к объектам в явно заданной области, когда объект создаётся или переименовывается, когда внутри исследуемого target обнаружено непонятное имя либо когда пользователь отдельно запросил naming-аудит. Объекты вне области остаются без изменений.

Управляемое переименование выполняется последовательно:

1. read-only чтение target и связанных contract-significant данных;
2. обнаружение непонятного или не соответствующего foundation имени в текущей области;
3. уточнение функции объекта у пользователя, если семантика не доказана;
4. генерация рекомендации и точной карты `old → new`;
5. impact report по variants, properties, Slots, asset owners, descriptions, registry records и связанным компонентам;
6. отдельное согласование карты пользователем;
7. изменение только разрешённых полей имени;
8. отдельный Figma read-back, validation предложенного результата, fingerprint и dependency checks.

Рекомендация генератора никогда не является разрешением на Figma mutation. Обычный rename сохраняет конечный `@2x` или `@4x`; изменение scale suffix требует отдельного изменения export contract. Генератор, validator и skill не выполняют фоновое или автоматическое переименование библиотеки.

## 6. Модель component contract

Каждый компонент имеет один стабильный ID и одну запись. Переименование Figma-объекта не меняет системный ID.

Обязательные группы полей:

- identity и library ownership;
- status: `draft`, `active` или `deprecated`;
- Figma identity;
- semantic role и category;
- краткий implementation-purpose;
- независимый `desktop` contract;
- независимый `mobile` contract;
- variants и properties с явным эффектом;
- ссылки на typography, spacing, assets и вложенные components;
- типизированные component-specific constraints;
- список critical constraint IDs для компактного Figma Description;
- provenance и fingerprint.

Mobile и Desktop не наследуются друг от друга и не используют `base → override → exception`. Context builder выдаёт полностью разрешённый контракт выбранной версии.

Общее значение записывается ссылкой на foundation ID. Если Figma variable или style binding отсутствует, компонент хранит фактическое literal value. Токен нельзя выводить только по совпадению числа. Generated registry показывает stable reference и разрешённое точное значение, но не создаёт второго владельца foundation.

Полная prose-копия контракта внутри component record запрещена. Registry renderer обходит identity, contracts, properties, assets, constraints и dependencies; Figma Description renderer использует только stable ID, purpose, вычисленный render type и явно выбранные critical constraints.

### 6.1. Изображения и assets

Image contract явно задаёт:

- owner и asset ID;
- export scale;
- format;
- pixel dimensions;
- crop и aspect ratio;
- transparency;
- background policy;
- Desktop/Mobile display behavior.

Для `@2x` фиксируются JPEG contract и сохранение пропорций. Изменение ширины при фиксированной высоте запрещено для `intrinsic-ratio`.

Для `@4x` фиксируются PNG и transparency contract. Подложка не добавляется, если её нет в Fill экспортируемого Figma-owner.

Asset owner сохраняет `@2x` или `@4x` при обычном rename.

### 6.2. Документация компонента

`core/component-contract-standard.md` определяет, какие implementation-significant данные обязан иметь любой текущий или новый component contract и в каком порядке они показываются в полном generated registry.

`core/figma-component-description-standard.md` определяет компактную Figma-проекцию. Её фиксированный порядок: `CUPIS ID`, `PURPOSE`, `RENDER`, затем optional `CRITICAL`. `RENDER` вычисляется из contract tree; `CRITICAL` выводит только выбранные critical constraints и отсутствует при пустом списке.

Полный generated registry должен включать идентификацию и назначение, structure/rendering, независимые Desktop и Mobile contracts, properties/variants, assets/interaction, constraints/dependencies и resolved foundation references. Это человекочитаемый output, а не редактируемый источник.

HTML routes получают selected resolved component contracts. Они не получают стандарт авторинга component contract или компактный Figma Description как instruction. Figma Description может отсутствовать или быть stale без потери implementation semantics; такое состояние блокирует только explicit description-sync или maintenance verification.


## 7. Onboarding нового компонента

Незарегистрированный Figma-компонент не используется как `active`-контракт по визуальному сходству.

Onboarding выполняет:

1. классификацию роли: component, item, asset, template или example;
2. проверку naming и, при подтверждённой семантике, генерацию согласуемой рекомендации без автоматического rename;
3. аудит Mobile/Desktop variants, properties, layers, Auto Layout, typography, spacing, assets и адаптивности;
4. сопоставление с существующими patterns и foundations;
5. формирование component contract;
6. создание записи со статусом `draft`;
7. schema и cross-reference validation;
8. генерацию полного registry-представления и compact Figma Description preview;
9. отдельное разрешение на публикацию Description через Figma MCP;
10. отдельную Figma read-back проверку;
11. перевод в `active` после успешных проверок.

Обычный новый компонент добавляется новой записью и не требует изменения manifest, Core, workflows или skills.

Если существующая schema не может выразить новую универсальную возможность, сначала проектируется общее расширение schema и migration. Локальное schema-исключение под один компонент запрещено.

Если незарегистрированный компонент найден во время сборки письма, build workflow не меняет библиотеку скрытно. Он возвращает типизированный blocker и maintenance handoff для onboarding.

## 8. Синхронизация Figma и GitHub

Направление синхронизации зависит от типа данных:

- визуальные факты: Figma → structured data;
- component contract: structured data → полный generated registry и resolved context bundles;
- compact Description: structured data → Figma Description;
- structured data → остальные generated docs.

Запись хранит Figma file key, node/component-set ID, имя, дату последней проверки и `structure_fingerprint`.

Fingerprint рассчитывается по нормализованным контрактно значимым данным: типу узла, variants, properties, semantic children, bindings и contract geometry.

Стандартная синхронизация:

1. pin текущего GitHub SHA;
2. read-only чтение Figma target;
3. классификация роли и mutation scope;
4. нормализация Figma snapshot;
5. сравнение со structured record и генерация expected full registry/compact Description preview;
6. предварительный impact report;
7. отдельное разрешение пользователя;
8. сначала изменение и validation structured record в GitHub;
9. отдельное разрешение на Figma metadata write;
10. выполнение только разрешённых Description/Documentation-link записей через Figma MCP;
11. отдельный Figma read-back;
12. fingerprint, cross-reference, generated-equivalence и allowed-diff проверки.

Типы расхождений:

- `visual drift`;
- `description drift`;
- `identity drift`;
- `unregistered`;
- `missing`.

Расхождение не исправляется автоматически до определения фактического источника изменения.

CI не заявляет live-проверку Figma. Codex получает Figma snapshot через MCP, а pure scripts нормализуют и сравнивают временный вход. Временный snapshot не коммитится.

## 9. Generated docs и context bundles

### 9.1. Generated docs

`docs/generated/` содержит Markdown-представления для человека. Они:

- генерируются из structured data;
- содержат детерминированный digest исходных data-файлов и schema versions;
- не редактируются вручную;
- проверяются повторной детерминированной генерацией в CI.

Generated docs являются представлением, а не источником истины. Полный component registry строится напрямую из structured contracts и не вставляет сохранённую prose-копию Figma Description. Compact Figma Description может показываться только как вспомогательная generated-проекция.

### 9.2. Context bundles

Bundle создаётся на лету под конкретную route и не коммитится.

Поддерживаемые профили:

- `library-maintenance`;
- `component-onboarding`;
- `figma-description-sync`;
- `figma-naming-audit`;
- `email-new-build`;
- `email-continue-fix`.

Bundle содержит только применимый workflow, нужные Core sections, выбранные resolved component contracts, используемые foundations, Figma provenance и schema/source versions. Email-build bundles не включают component-authoring standards или compact Figma Description; figma-description-sync получает только данные, необходимые для expected Description и drift comparison.

Если ссылка не разрешается, schema несовместима или обязательный компонент не `active`, bundle не создаётся. Ошибка называет record и field.

## 10. Schemas, версии и validation

Каждый домен имеет собственную `schema_version` в формате SemVer.

- Фактическое обновление записи без изменения формата не меняет schema version.
- Уточнение schema, не меняющее множество допустимых данных, повышает patch version.
- Новое необязательное универсальное поле повышает minor version и не требует migration существующих records.
- Удаление, rename, новое обязательное поле или изменение смысла повышает major version и требует migration script.
- Data-файл объявляет точную версию schema, которой соответствует.
- `main` содержит только текущий формат.
- Runtime не поддерживает параллельно несколько старых форматов.

Validation выполняется в порядке:

1. manifest syntax и schema;
2. существование объявленных путей;
3. domain schemas;
4. уникальность IDs;
5. cross-references;
6. полнота `active` Mobile/Desktop contracts;
7. запрет неизвестных полей и override-каскадов;
8. image и export contracts;
9. generated-doc equivalence;
10. route, bundle и skill references;
11. fingerprint requirements для Figma-зависимых изменений.

YAML anchors, aliases, merge keys и remote schema references запрещены.

Ошибка блокирует PR и указывает точный путь, например:

```text
components.banner-secondary.mobile.image_behavior:
expected intrinsic-ratio, received fixed-height
```

Warning допустим только для некритичного состояния, которое не делает результат неоднозначным. Неразрешённая ссылка, неполный contract или stale fingerprint в Figma-зависимом изменении являются errors.

## 11. Core, workflows и skills

### 11.1. Structured workflows

Workflows задают inputs, steps, required bundle, write allowlist, validations, stop conditions и handoff.

Maintenance routes:

- read-only audit;
- component onboarding;
- component contract update;
- Figma Description sync;
- Figma naming audit и управляемая генерация naming-рекомендаций;
- foundation update;
- schema migration.

Email routes:

- new email build;
- continue/fix existing email;
- design-independent technical fix;
- email diagnosis.

Человекочитаемые checkpoints генерируются из workflows.

### 11.2. Skills

Skill:

1. находит manifest;
2. классифицирует задачу;
3. выбирает route;
4. получает bundle;
5. применяет scope gates;
6. выполняет workflow;
7. запускает validators;
8. формирует handoff.

Skill не содержит копии правил или жёсткий список канонических путей.

## 12. Обязательный mutation impact gate

Перед изменением Figma-компонента, Description, naming, properties, structure или component contract выполняется read-only анализ.

Impact report обязан назвать:

1. предлагаемое изменение;
2. Figma targets и variants;
3. writable fields или layers;
4. визуальное и implementation-влияние;
5. зависимые structured records;
6. изменяемые GitHub paths;
7. generated outputs;
8. preserved objects и properties;
9. неоднозначности и риски;
10. проверки результата.

После impact report workflow останавливается до отдельного разрешения пользователя. Первоначальный mutation-запрос не заменяет эту паузу.

Если фактическое влияние расширяется, workflow снова останавливается. Allowlist нельзя расширять задним числом.

После записи отдельный read-back сравнивает заявленный и фактический diff. Unexpected diff останавливает работу без автоматического исправления.

Для repository-only системных изменений точный запрос разрешает рабочую ветку и draft PR. Merge всегда требует отдельной команды пользователя.

## 13. Техническая основа

Automation использует:

- Node.js scripts в формате `.mjs` без compilation step;
- YAML для human-editable structured data;
- JSON Schema для контрактов данных;
- dependency lockfile;
- PowerShell только как bootstrap wrapper.

Один Node major должен быть зафиксирован одинаково в package metadata, документации bootstrap и GitHub Actions во время foundation implementation.

Основные команды:

```text
npm test
npm run validate
npm run generate
npm run generate:check
npm run bundle -- --route <route>
```

GitHub Actions выполняет tests, schemas, cross-references, generated-doc check и forbidden-duplicate/path checks.

Validation и generation детерминированы и не требуют сети. Scripts не выполняют внешние записи.

## 14. Тестирование

Обязательны:

- unit tests;
- valid и failing fixtures;
- characterization tests текущей системы;
- cross-reference tests;
- golden tests full generated registry и compact Figma Description;
- context-bundle tests;
- regression tests выявленных ошибок;
- allowed-path и preserved-content checks.

Проверяемые сценарии включают:

- full component registry generation;
- compact Figma Description preview и drift;
- description-only;
- naming audit;
- component onboarding;
- foundation update;
- new marketing email;
- new service email;
- design-dependent continue/fix;
- design-independent technical fix;
- адаптивные `@2x` images;
- прозрачные `@4x` assets;
- unregistered component blocker.

## 15. Миграция

Миграция выполняется последовательно:

1. master-spec и implementation plan;
2. foundation: manifest, schema, validation и bootstrap switch;
3. typography pilot;
4. остальные foundations;
5. component registry;
6. component documentation contracts как prerequisite generated registry;
7. generated docs и bundles;
8. Core и workflows;
9. maintenance skill;
10. стандарт и навык разработки компонентов;
11. email-build skill;
12. shadow comparison;
13. cutover;
14. отдельное удаление старых дублей.

На каждом этапе создаются отдельные branch и PR. Следующий этап начинается после проверки предыдущего.

Master-спецификация остаётся единственным владельцем архитектурных решений. Единый migration roadmap хранит порядок и статус этапов. Перед каждым техническим этапом создаётся отдельный implementation plan только с точными файлами, действиями, тестами и commits этого этапа; он ссылается на master-спецификацию и не повторяет её правила.

Если во время этапа обнаруживается новая архитектурная развилка, сначала обновляется master-спецификация и проходит review. Phase plan не может самостоятельно вводить новое системное правило.

Во время shadow mode старые источники используются только как comparison baseline. Новая runtime-логика не смешивает старый и новый контекст.

## 16. Cutover и rollback

Cutover разрешён, когда:

- все records и references валидны;
- Mobile/Desktop contracts полны;
- generated docs эквивалентны подтверждённому baseline;
- representative maintenance routes проходят;
- representative local email builds не показывают новых нарушений;
- skills используют manifest и bundles;
- старые источники больше не читаются runtime.

После cutover старые дубли удаляются отдельным PR.

Rollback не выполняется force-reset. Используется исправляющий или revert PR. Резервная ветка сохраняет состояние до миграции.

Figma не откатывается автоматически. Сначала определяется, относится ли проблема к GitHub data, generated Description или визуальному состоянию Figma; любая Figma mutation снова проходит impact gate.

## 17. Не входит в систему

Система не выполняет:

- Figma design mutation без impact report и подтверждения;
- автоматическую naming-миграцию найденных legacy-объектов;
- публикацию Figma library;
- автоматический merge;
- хранение финальных писем;
- CRM delivery;
- автоматическую установку маркетинговых ссылок;
- угадывание tokens;
- скрытые component-specific schema exceptions;
- полный Figma audit вместо достаточной точечной проверки.

## 18. Критерии завершения перехода

Переход завершён, если:

1. действует один manifest;
2. у каждого факта один владелец;
3. все `active` components имеют законченные Mobile/Desktop contracts;
4. новый компонент проходит onboarding без перестройки системы;
5. images имеют явное responsive behavior;
6. foundations подключаются по проверяемым references;
7. Description и implementation используют один contract;
8. task получает один resolved bundle;
9. CI блокирует structural errors;
10. Figma mutations проходят impact gate;
11. skills не дублируют rules;
12. shadow scenarios подтверждены;
13. старые дубли удалены;
14. резервная ветка сохранена.
