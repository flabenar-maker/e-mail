# CUPIS Figma Description Archive and Compact Sync Implementation Plan

> **Архив завершённого этапа.** Этот документ сохраняет исходные решения, команды, пути, чекбоксы и промежуточные статусы; они не являются текущей очередью или разрешением выполнять старые шаги. Часть работ могла быть отменена или передана в последующие этапы. Актуальный порядок и открытые обязательства находятся в [едином roadmap](../2026-08-25-cupis-migration-roadmap.md).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Сохранить все текущие Figma component descriptions как независимый raw archive, подтвердить единую компактную generated-логику и опубликовать короткие Description у каждого canonical component owner без изменения дизайна.

**Architecture:** Figma является источником старой metadata только на этапе capture. Raw snapshot хранится внутри `Legacy/` как несвязанный исторический файл без stable component IDs, manifest entry, runtime consumer или validation dependency. Новые Description детерминированно генерируются из валидированных `data/components/*.yaml` через существующий renderer в формате `CUPIS ID → PURPOSE → RENDER → optional CRITICAL`; после preview и отдельного разрешения они записываются только в allowlisted Description canonical owner nodes через Figma MCP.

**Tech Stack:** Figma MCP, existing component records/schema, Node.js 24 ESM, `node:test`, existing `renderFigmaComponentDescription`, GitHub cloud branch/PR.

**Spec:** `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`

## Global Constraints

- Использовать только Figma MCP. Browser scraping, REST token, ручное копирование и локальный Figma-файл запрещены.
- Capture охватывает все активные library roots, разрешённые из manifest и manifest-declared component sources: marketing, service, shared library и shared templates. Raw metadata сохраняется без преобразования текста.
- Archive path не объявляется в `system/manifest.yaml`, не входит в bundles/generated docs, не импортируется scripts/tests и не связывается со stable component IDs.
- Snapshot содержит Figma node ID и имя только как исторические координаты исходного снимка; поле `component_id` запрещено.
- Canonical component owner — component set для variant family или standalone component для одиночного компонента. Variant node не получает отдельный generated Description, потому что не имеет самостоятельного component record.
- Новые Description используют только `record.id`, `documentation.purpose`, derived render type и selected critical constraints.
- `PURPOSE` — одно человекочитаемое предложение на русском длиной не более 160 Unicode code points, без размеров, padding/gaps, цветов, variants, properties и общих правил письма.
- `CRITICAL` содержит от нуля до двух component-specific ограничений. Обычные contract facts и foundation rules туда не попадают.
- Figma Description не используется HTML-build routes и не является резервным implementation source.
- Description mutation не разрешает менять Documentation link, name, hierarchy, Auto Layout, geometry, variants, properties, bindings, visibility, assets или design.
- Любой missing/duplicate/ambiguous owner или неподтверждённый purpose блокирует массовую публикацию; ID и текст не угадываются.
- Persistent edits выполняются через cloud GitHub. Локальные снимки используются только для проверки; GitHub Actions и PR Checks не применяются.

---

### Task 1: Снять независимый raw snapshot Figma metadata

**Files:**
- Create: `Legacy/figma-component-descriptions/2026-09-17-pre-compact-sync.json`
- Preserve: `system/manifest.yaml`, `data/components/*.yaml`, Figma nodes

**Interfaces:**
- Consumes: Figma file key и library roots из pinned canonical manifest.
- Produces: один immutable raw snapshot без active-system references.

- [x] **Step 1: Объявить read-only impact boundary**

Зафиксировать exact Figma file key и четыре canonical roots: marketing `538:17236`, service `538:17235`, shared library `539:38025`, shared templates `1084:34055`. Зафиксировать типы читаемых узлов (`COMPONENT_SET`, `COMPONENT`), metadata fields (`id`, `name`, `type`, `description`, `documentationLinks`) и отсутствие любых Figma writes.

- [x] **Step 2: Загрузить обязательные Figma skills**

Перед каждым `use_figma` action использовать `figma:figma-use`; для чтения nodes и metadata использовать общий `figma` workflow. Не переходить к browser или REST fallback при ошибке.

- [x] **Step 3: Выполнить MCP capture всех четырёх roots**

Обойти все component sets и components внутри marketing, service, shared library и shared templates roots. Включить canonical owners, variant nodes и пустые Description, чтобы snapshot доказывал полноту, а не только наличие текста. Для каждого node получить:

```json
{
  "node_id": "326:5159",
  "name": "Email/Header",
  "node_kind": "COMPONENT_SET",
  "description": "raw text exactly as returned",
  "documentation_links": []
}
```

- [x] **Step 4: Нормализовать только контейнер snapshot**

Записать UTF-8 JSON с LF, отсортировать nodes по `node_id`, удалить дубли одного node, но не изменять пробелы, регистр, переносы или содержание `description`. Верхний уровень содержит только `schema_version`, `captured_at`, `figma_file_key`, `roots` и `nodes`.

- [x] **Step 5: Проверить архивную изоляцию**

Подтвердить поиском, что новый path не упоминается в manifest, schemas, Core, active scripts, tests, bundles или generated docs. Snapshot не должен содержать `component_id`, contract path, foundation ID или generated Description.

---

### Task 2: Сопоставить canonical owners с structured records

**Files:**
- Create temporarily outside repository: `figma-description-reconciliation.json`
- Preserve: archive snapshot and every structured component record

**Interfaces:**
- Consumes: raw Figma snapshot, `data/components/shared.yaml`, `marketing.yaml`, `service.yaml`.
- Produces: ephemeral exact owner mapping and typed blockers; mapping is not committed.

- [x] **Step 1: Построить expected owner set**

Для каждого active component record взять `figma.node_id`, `identity.figma_name` и `identity.node_kind`. Это используется только для reconciliation и не записывается в archive.

- [x] **Step 2: Сравнить по node ID и identity**

Для каждого record требуется ровно один captured canonical owner с совпадающими node ID, name и node kind. Variant nodes учитываются в raw capture, но не считаются отдельными records.

- [x] **Step 3: Выдать typed reconciliation result**

Отчёт содержит группы:

- `matched`;
- `record-owner-missing`;
- `figma-owner-unregistered`;
- `duplicate-node-id`;
- `identity-mismatch`;
- `variant-metadata-only`.

Массовая генерация продолжается только при отсутствии первых пяти blocker-групп. Временный отчёт показывается пользователю и удаляется после handoff; он не становится вторым registry.

---

### Task 3: Зафиксировать компактность Description машинными ограничениями

**Files:**
- Modify: `core/figma-component-description-standard.md`
- Modify: `schemas/components.schema.json`
- Modify: `scripts/lib/component-description.mjs`
- Modify: `tests/components/figma-component-description.test.mjs`
- Modify: `tests/components/component-documentation-model.test.mjs`
- Regenerate source-digest metadata: `docs/generated/asset-registry.md`
- Regenerate source-digest metadata: `docs/generated/component-registry.md`
- Regenerate source-digest metadata: `docs/generated/typography-registry.md`

**Interfaces:**
- Consumes: existing `documentation.purpose`, `critical_constraint_ids` and derived render type.
- Produces: same four-section output with exact bounded content.

- [x] **Step 1: Написать RED schema tests**

Добавить failing fixtures для `purpose` длиной 161 code point, purpose с переносом строки и трёх `critical_constraint_ids`. Expected validation errors должны указывать точные documentation paths.

- [x] **Step 2: Написать RED renderer tests**

Проверить typed errors `COMPONENT_PURPOSE_TOO_LONG`, `COMPONENT_PURPOSE_MULTILINE` и `COMPONENT_DESCRIPTION_CRITICAL_LIMIT`, когда renderer вызывается напрямую на невалидном record.

- [x] **Step 3: Уточнить standard без второго формата**

Сохранить порядок:

```text
CUPIS ID: <stable-id>
PURPOSE: <one human-readable sentence>
RENDER: HTML | ASSET | HYBRID

CRITICAL
- <zero to two selected constraints>
```

Добавить exact limits: `PURPOSE <= 160` code points, без line breaks; `critical_constraint_ids.maxItems = 2`. PURPOSE вложенного компонента прямо называет его вложенную функцию; отдельное поле composition role не вводится.

- [x] **Step 4: Реализовать минимальные guards**

Schema и renderer отклоняют только новые запрещённые состояния. Rendered labels, порядок, LF normalization и derived `RENDER` не меняются. Terminal line break отсутствует, потому что Figma удаляет завершающий перенос при сохранении Description.

- [x] **Step 5: Запустить focused tests**

```powershell
node --test tests/components/figma-component-description.test.mjs tests/components/component-documentation-model.test.mjs
npm run validate
npm run generate:check
```

Expected: все 61 текущих records проходят limits. Человекочитаемое содержимое generated docs не меняется; source-digest metadata обновляется, потому что `schemas/components.schema.json` входит в их declared inputs.

---

### Task 4: Сформировать полный old → new preview

**Files:**
- Create temporarily outside repository: `figma-description-preview.json`
- Preserve: Figma descriptions and Documentation links

**Interfaces:**
- Consumes: matched canonical owners and `renderFigmaComponentDescription(record)`.
- Produces: user-reviewable preview for every owner; no mutation.

- [x] **Step 1: Сгенерировать expected text для каждого record**

Не использовать raw archive как semantic input. Expected Description строится только из current validated component record.

- [x] **Step 2: Сравнить expected с current raw text**

Для каждого canonical owner показать `node_id`, Figma name, stable component ID, exact old text, exact new text и status `unchanged | replace | blocked`.

- [x] **Step 3: Проверить содержательную краткость**

Автоматически проверить ID, limits, exact `RENDER`, отсутствие запрещённых contract/foundation fields и максимум две CRITICAL lines. Затем вручную проверить, что PURPOSE понятно объясняет функцию, а nested components прямо названы вложенными.

- [x] **Step 4: Показать impact report и запросить отдельное разрешение**

Impact report перечисляет exact canonical node IDs, writable field `description`, preserved Documentation links и structural fingerprint каждого owner. До ответа пользователя Figma write не выполняется.

---

### Task 5: Опубликовать compact Description через Figma MCP

**Files:**
- Modify in Figma only: allowlisted `description` field canonical component owners
- Preserve: all repository files during Figma mutation, variant metadata and every non-description Figma field

**Interfaces:**
- Consumes: approved old → new preview.
- Produces: exact generated Description on every canonical owner.

- [x] **Step 1: Повторно открыть mutation gate**

Перед первой записью проверить, что GitHub branch SHA, generated expected text, node IDs и fingerprints не изменились после approval. Любой drift возвращает задачу к Task 4.

- [x] **Step 2: Записать только Description**

Использовать Figma MCP. Не изменять Documentation link и не очищать Description variant nodes: их metadata архивирована, но они не являются canonical owners и требуют отдельного решения.

- [x] **Step 3: Остановиться при первой неожиданной мутации**

Если MCP изменил name, hierarchy, property, geometry, binding или другой неразрешённый field, прекратить batch и сообщить diff. Не расширять scope для автоматического исправления.

---

### Task 6: Выполнить read-back, локальные проверки и публикацию

**Files:**
- Modify only paths declared in Tasks 1 and 3, this implementation plan and the migration roadmap.
- Preserve: `system/manifest.yaml`, component facts, foundations, renderer, workflows and local emails.

**Interfaces:**
- Consumes: post-write Figma state and final cloud branch SHA.
- Produces: verified compact-description sync and reusable rollback evidence.

- [x] **Step 1: Выполнить отдельный MCP read-back**

Повторно прочитать каждый canonical owner и подтвердить побайтовое совпадение Description с generated expected text. Проверить прежние Documentation links и structural fingerprints.

- [x] **Step 2: Проверить охват**

Количество успешно синхронизированных owners должно равняться количеству active component records. Не допускаются silent skip, duplicate ID или owner без expected text.

- [x] **Step 3: Проверить GitHub boundaries**

`git diff` содержит только raw Legacy snapshot, standard/schema/renderer guards, tests, source-digest refresh трёх generated registries и этот implementation plan/roadmap update. Archive path отсутствует во всех active references. Figma exports, screenshots, emails и reconciliation/preview reports в репозиторий не попадают.

- [x] **Step 4: Запустить локальный gate на exact final SHA**

```powershell
npm ci --ignore-scripts
node --test tests/components/*.test.mjs tests/characterization/component-documentation-boundary.test.mjs
npm run generate:check
npm run verify
pwsh -NoProfile -File bootstrap/verify.ps1
```

Expected: all checks pass locally; GitHub Actions/Checks не использовались.

- [x] **Step 5: Опубликовать один PR и handoff**

PR перечисляет capture count, owner count, replaced/unchanged counts, exact Figma fields changed, read-back result, preserved areas, local checks and rollback base. Merge требует отдельного разрешения пользователя.

## Success Criteria

- Raw description snapshot содержит все component/component-set nodes из четырёх canonical roots, включая пустые и variant metadata, но не содержит stable component IDs или active-system links.
- Каждый active component record сопоставлен ровно одному canonical Figma owner; отсутствуют missing, unregistered, duplicate и identity mismatch blockers.
- Compact format остаётся `CUPIS ID`, `PURPOSE`, `RENDER`, optional `CRITICAL`; PURPOSE не длиннее 160 code points, CRITICAL содержит не более двух пунктов.
- Каждый canonical owner получил exact generated Description через MCP; Figma read-back совпал побайтово.
- Documentation links, variants, properties, layers, geometry, bindings, assets and design не изменены.
- Figma Description не вошёл в email-build runtime и не стал вторым implementation source.
- Archive не объявлен и не потребляется активной системой.

## Execution Result

- Через Figma MCP снят raw snapshot 156 `COMPONENT`/`COMPONENT_SET` nodes из четырёх canonical roots: 48 узлов с Description и 108 с пустым Description; Documentation links отсутствовали у всех 156 узлов.
- Все 61 active component records однозначно сопоставлены 61 canonical owners; 95 variant nodes сохранены только как metadata. Missing, unregistered, duplicate и identity mismatch blockers отсутствуют.
- Preview содержал 61 `replace`, 0 `unchanged`, 0 `blocked`. После разрешения пользователя изменено только поле `description` у 61 canonical owners.
- Figma удаляет terminal newline при сохранении Description, поэтому renderer и стандарт закрепляют Figma-stable output без завершающего переноса. Read-back подтвердил точное совпадение всех 61 Description, имён и Documentation links.
- Для 60 owners исходный ad hoc structural fingerprint совпал побайтово. У `Block/Receipt-Info` (`502:24695`) изменился только нестабильный hash сериализации при неизменной длине; повторная проверка всех 272 contract-linked Figma facts, включая 8 полей, прочитанных напрямую через MCP, не выявила ни одного изменения design/contract fact. Этот hash не используется как canonical evidence и не заменяет проверку фактических полей.
- Изменения репозитория ограничены архивом, compact-description standard/schema/renderer/tests, source-digest metadata generated registries и планами. Component contracts, foundations, HTML renderer/runtime, manifest и локальные письма не менялись.
- Работа опубликована в draft PR [#87](https://github.com/flabenar-maker/e-mail/pull/87). Слияние требует отдельного разрешения пользователя.
