# Master-дизайн структурированной CUPIS email-системы

Статус: дизайн согласован в рабочем чате; документ ожидает финального review пользователя.
Дата: 24 августа 2026 года.
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
- каноническими данными для Figma Description;
- Figma identity и последним проверенным fingerprint;
- связями между компонентами, foundations и workflows.

Figma Description является синхронизированной публикацией component contract, а не независимым источником текста.

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
│  └─ figma-library-standard.md
│
├─ workflows/
│  ├─ library-maintenance.yaml
│  └─ email-build.yaml
│
├─ scripts/
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

## 6. Модель component contract

Каждый компонент имеет один стабильный ID и одну запись. Переименование Figma-объекта не меняет системный ID.

Обязательные группы полей:

- identity и library ownership;
- status: `draft`, `active` или `deprecated`;
- Figma identity;
- semantic role и category;
- независимый `desktop` contract;
- независимый `mobile` contract;
- ссылки на typography, spacing, assets и вложенные components;
- component-specific implementation notes;
- данные для итогового Description;
- provenance и fingerprint.

Mobile и Desktop не наследуются друг от друга и не используют `base → override → exception`. Context builder выдаёт полностью разрешённый контракт выбранной версии.

Общее значение записывается ссылкой на foundation ID. Если Figma variable или style binding отсутствует, компонент хранит фактическое literal value. Токен нельзя выводить только по совпадению числа.

Итоговый Figma Description детерминированно собирается из структурированных полей и component-specific notes той же записи. Точные факты не поддерживаются вручную одновременно в contract и prose.

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

## 7. Onboarding нового компонента

Незарегистрированный Figma-компонент не используется как `active`-контракт по визуальному сходству.

Onboarding выполняет:

1. классификацию роли: component, item, asset, template или example;
2. проверку naming;
3. аудит Mobile/Desktop variants, properties, layers, Auto Layout, typography, spacing, assets и адаптивности;
4. сопоставление с существующими patterns и foundations;
5. формирование component contract;
6. создание записи со статусом `draft`;
7. schema и cross-reference validation;
8. формирование и публикацию Description;
9. отдельную Figma read-back проверку;
10. перевод в `active` после успешных проверок.

Обычный новый компонент добавляется новой записью и не требует изменения manifest, Core, workflows или skills.

Если существующая schema не может выразить новую универсальную возможность, сначала проектируется общее расширение schema и migration. Локальное schema-исключение под один компонент запрещено.

Если незарегистрированный компонент найден во время сборки письма, build workflow не меняет библиотеку скрытно. Он возвращает типизированный blocker и maintenance handoff для onboarding.

## 8. Синхронизация Figma и GitHub

Направление синхронизации зависит от типа данных:

- визуальные факты: Figma → structured data;
- component contract и Description: structured data → Figma Description;
- structured data → generated docs и bundles.

Запись хранит Figma file key, node/component-set ID, имя, дату последней проверки и `structure_fingerprint`.

Fingerprint рассчитывается по нормализованным контрактно значимым данным: типу узла, variants, properties, semantic children, bindings и contract geometry.

Стандартная синхронизация:

1. pin текущего GitHub SHA;
2. read-only чтение Figma target;
3. классификация роли и mutation scope;
4. нормализация Figma snapshot;
5. сравнение со structured record;
6. предварительный impact report;
7. отдельное разрешение пользователя;
8. выполнение только разрешённых записей;
9. отдельный Figma read-back;
10. синхронизация structured record и generated docs;
11. fingerprint, cross-reference и allowed-diff проверки.

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

Generated docs являются представлением, а не источником истины.

### 9.2. Context bundles

Bundle создаётся на лету под конкретную route и не коммитится.

Поддерживаемые профили:

- `library-maintenance`;
- `component-onboarding`;
- `figma-description-sync`;
- `figma-naming-audit`;
- `email-new-build`;
- `email-continue-fix`.

Bundle содержит только применимый workflow, нужные Core sections, выбранные resolved component contracts, используемые foundations, Figma provenance и schema/source versions.

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
- Figma naming audit;
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
- golden tests generated docs;
- context-bundle tests;
- regression tests выявленных ошибок;
- allowed-path и preserved-content checks.

Проверяемые сценарии включают:

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
6. generated docs и bundles;
7. Core и workflows;
8. maintenance skill;
9. email-build skill;
10. shadow comparison;
11. cutover;
12. отдельное удаление старых дублей.

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
