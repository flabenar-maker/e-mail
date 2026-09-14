# CUPIS Structured Component Registry Implementation Plan

> **Исторический implementation plan.** Реализован в [PR #40](https://github.com/flabenar-maker/e-mail/pull/40). Команды, пути и чекбоксы ниже описывают выполнение того этапа, а не текущий рабочий маршрут: старый контур находится в Legacy/, маршруты остановлены, проверки теперь локальные. Для продолжения использовать свежие manifest и [roadmap](2026-08-25-cupis-migration-roadmap.md).

> **Для выполнения:** использовать superpowers:executing-plans. Выполнять задачи последовательно, с RED/GREEN-проверками и review checkpoints.

**Goal:** Перенести фактические контракты CUPIS email-компонентов из текущего Markdown-реестра в три строгих shadow-реестра, сохранить независимые Mobile/Desktop-контракты и Figma provenance, добавить точное разрешение зарегистрированных компонентов, blocker для неизвестного компонента и чистые проверки синхронизации без изменения Figma или рабочих HTML-bundles.

**Architecture:** Компонент существует ровно в одном из файлов data/components/shared.yaml, data/components/marketing.yaml или data/components/service.yaml. Один schemas/components.schema.json задаёт одинаковую строгую форму всех трёх файлов. scripts/lib/component-registry.mjs загружает записи, проверяет глобальную уникальность и cross-references и разрешает только точную identity. scripts/lib/component-description.mjs детерминированно собирает Figma Description из структурированных фактов и текстовых токенов, поэтому точные значения не дублируются в prose. scripts/lib/figma-component-snapshot.mjs нормализует временный MCP-снимок и классифицирует drift; CLI-обёртки не подключаются к Figma и не выполняют записи. Старый registry/email-component-descriptions-registry.md остаётся активным comparison baseline до generated-docs и bundle cutover.

**Tech Stack:** Node.js 24, ESM, YAML 2.9, Ajv 8, node:test, GitHub Contents API, GitHub Actions, Figma MCP только для read-only подтверждения мигрируемых фактов.

**Spec:** docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md, разделы 3.2, 5, 6–10, 12–16. Текущий этап: docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md, этап 6.

## Global Constraints

- Работать только через облачный GitHub: отдельная implementation branch, draft PR и GitHub Actions. Локальный checkout системы не использовать как источник.
- Implementation branch начинать от свежего main, в котором уже слит этот plan.
- До первой записи закрепить SHA main и повторно открыть master-spec, roadmap, system/manifest.yaml и этот plan на одном SHA.
- Не менять Figma nodes, descriptions, component properties, variants, geometry, styles, variables, assets или публикацию библиотеки. Figma разрешена только для read-only подтверждения фактов.
- Не менять registry/email-component-descriptions-registry.md. Он остаётся comparison baseline и рабочим источником до будущего cutover.
- Не менять core/**, workflows/**, .agents/skills/**, готовые письма, локальные images или bundle_profiles[*].source_ids.
- Не подключать новые component registries к рабочим bundles. На этом этапе они объявляются только как shadow sources и проходят validation.
- Не выводить typography или spacing reference только по совпадению числа. Reference допустим только при подтверждённом Figma binding или уже доказанной структурированной связи; иначе хранить literal с provenance.
- Не подменять конкретный Figma component похожим компонентом. Разрешение выполняется только по stable system ID либо по точной Figma identity.
- Mobile и Desktop являются двумя полными контрактами. Поля base, inherit, extends, override cascade и fallback contract запрещены.
- Один точный факт имеет одно место хранения. Description использует ссылки на structured facts, component/property names и не повторяет размеры, цвета, проценты, scale или другие точные значения в text tokens.
- Все diagnostics имеют стабильные code, path и message и сортируются по path → code → message.
- Временный Figma snapshot не коммитится. Скрипты не выполняют сеть или внешние записи.
- Любое расхождение между Figma и Markdown baseline во время миграции блокирует конкретную запись: не выбирать источник истины автоматически, а сообщить пользователю.
- Каждый RED и GREEN подтверждать GitHub Actions. Merge implementation PR выполняется только после отдельной команды пользователя.

## Scope and inventory

Целевой реестр содержит 61 Figma-компонент:

- marketing.yaml: 26 records из раздела «Маркетинговые письма»;
- service.yaml: 18 records из раздела «Сервисные письма»;
- shared.yaml: 17 records — Email/Template, 3 описанных Shared assets и 13 вложенных Icon glyph components.

Из 61 records ровно 48 имеют канонический Description в текущем Markdown baseline. Тринадцать Icon glyph components регистрируются как внутренние Figma sources без самостоятельного email Description: description.mode = none, а Mobile/Desktop contracts явно фиксируют figma-source-only. Это не делает их доступными для самостоятельного экспорта или HTML-рендера.

Если read-only Figma inventory не подтверждает 26 + 18 + 17, реализация останавливается с inventory mismatch. Нельзя изменять counts, переносить запись между libraries или придумывать отсутствующий record без review пользователя.

## File Map

Создать:

- data/components/marketing.yaml — 26 маркетинговых component records;
- data/components/service.yaml — 18 сервисных component records;
- data/components/shared.yaml — Email/Template, Shared assets и вложенные Icon glyph records;
- schemas/components.schema.json — общая строгая schema трёх реестров;
- scripts/lib/component-registry.mjs — loader, index, semantic/cross-reference validation и exact resolver;
- scripts/lib/component-description.mjs — deterministic Description renderer и token validation;
- scripts/lib/figma-component-snapshot.mjs — snapshot normalization, fingerprint и drift comparison;
- scripts/normalize-figma-snapshot.mjs — pure local-file CLI без Figma/network access;
- scripts/compare-figma-registry.mjs — pure comparison CLI;
- tests/foundation/component-registry.test.mjs;
- tests/foundation/component-description.test.mjs;
- tests/foundation/figma-component-snapshot.test.mjs;
- tests/characterization/component-registry-shadow.test.mjs.

Изменить:

- system/manifest.yaml — объявить три shadow registries и одну schema;
- scripts/lib/system-manifest.mjs — разрешать и валидировать component registry sources;
- tests/helpers/system-fixture.mjs — включить новые canonical files;
- tests/foundation/system-manifest.test.mjs — проверить wiring и source failures;
- tests/foundation/validator-cli.test.mjs — проверить sanitized component diagnostic;
- tests/characterization/foundation-preserved-files.test.mjs — сохранить действующие Markdown/Core/workflow/skill baselines;
- README.md — объяснить shadow registry простым языком и не менять рабочие режимы.

Не изменять в implementation PR:

- registry/email-component-descriptions-registry.md;
- registry/email-typography-registry.md;
- data/foundations/**;
- core/**;
- workflows/**;
- .agents/skills/**;
- schemas/manifest.schema.json;
- package.json и package-lock.json;
- bundle_profiles[*].source_ids;
- любые Figma nodes и descriptions;
- docs/superpowers/plans/cupis-active-work-context.md.

## Canonical registry envelope

Каждый data/components/*.yaml использует schema_version: 1.0.0 и содержит:

~~~yaml
schema_version: 1.0.0
registry:
  id: components-marketing
  library: marketing
  status: shadow
  source:
    figma_file_key: 8zka5bHkcrJVK9I9dKjnhC
    roots:
      - { role: library, node_id: "538:17236" }
    baseline_path: registry/email-component-descriptions-registry.md
    baseline_commit: c2be95b42b2b995bb7b5a2dc38661fd3a51c10bb
    verified_at: "2026-09-05"
components: []
~~~

Допустимые registry.id и library:

- components-marketing / marketing;
- components-service / service;
- components-shared / shared.

Roots:

- marketing: library 538:17236;
- service: library 538:17235;
- shared: library 539:38025 и templates 1084:34055.

baseline_commit заполняется фактическим SHA main, от которого создана implementation branch. verified_at заполняется датой read-only проверки. Это фактические provenance values, а не placeholders в итоговых YAML.

## Canonical component record

Каждая запись имеет только следующие root groups:

~~~yaml
- id: banner-hero
  status: active
  identity: {}
  figma: {}
  variants: []
  properties: []
  asset_contracts: []
  contracts:
    mobile: {}
    desktop: {}
  description: {}
  provenance: {}
~~~

### Identity

~~~yaml
identity:
  figma_name: Banner/Hero
  node_kind: component-set
  library: marketing
  semantic_role: banner
  category: hero
~~~

node_kind: component или component-set.

semantic_role использует один из общих видов: email, template, banner, block, card, item, button, badge, details, nps, asset, icon. category — lower-kebab semantic label и не кодирует viewport, размер или цвет.

### Figma identity and fingerprint

~~~yaml
figma:
  file_key: 8zka5bHkcrJVK9I9dKjnhC
  node_id: "337:4460"
  source_root_node_id: "538:17236"
  verified_at: "2026-09-05"
  structure_fingerprint: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
~~~

Fingerprint вычисляется только из нормализованных contract-significant полей: node kind, variants, component properties, semantic children, bindings и contract geometry. Имя и Description сравниваются отдельно и не входят в structure_fingerprint.

### Variants and component properties

~~~yaml
variants:
  - id: mobile
    node_id: "337:4359"
    axes:
      - { name: Viewport, value: Mobile }
properties:
  - id: show-body
    figma_name: Show Body
    type: boolean
    default: true
~~~

Variant axes являются ordered array точных пар name/value. Допустимые property types: boolean, text, slot, instance-swap. default обязателен, когда Figma предоставляет default; для slot и instance-swap допускается null. IDs уникальны внутри записи.

### Asset contracts

Asset contract хранится один раз на компонент и переиспользуется обоими viewport contracts:

~~~yaml
asset_contracts:
  - id: hero-image
    owner_layer_name: hero-image @2x
    source_viewport: desktop
    source_mode_id: image-fill
    display_mode_id: direct-image
    export_profile_id: jpeg-2x
    alpha_mode_id: none
    clipping_policy_id: preserve-artwork
    export_boundary:
      kind: fill
      semantic_node_name: hero-image @2x
    pixel_dimensions:
      width: 1104
      height: 706
      unit: px
    aspect_ratio: { width: 552, height: 353 }
    crop:
      mode: figma-fill
      position_source: concrete-desktop-instance
    background:
      own_visible_boundary_fill: preserve
      artificial_matte: forbid
~~~

IDs source_mode_id, display_mode_id, export_profile_id, alpha_mode_id и clipping_policy_id обязаны разрешаться через data/foundations/assets.yaml и проходить resolveAssetContract. owner_layer_name, export boundary, dimensions, ratio, crop и background являются component-owned facts.

Компонент без asset имеет пустой asset_contracts. Вложенный Icon glyph source не становится самостоятельным asset contract только потому, что он является Figma component.

### Independent viewport contracts

contracts.mobile и contracts.desktop обязательны для каждого active record, включая asset и template records. Они не наследуются друг от друга.

Каждый viewport contract содержит root element tree и ordered facts:

~~~yaml
contracts:
  mobile:
    root:
      id: root
      semantic_role: banner
      render_mode: presentation-table
      visibility: { mode: always }
      facts: []
      children: []
  desktop:
    root:
      id: root
      semantic_role: banner
      render_mode: presentation-table
      visibility: { mode: always }
      facts: []
      children: []
~~~

Допустимые render_mode:

- presentation-table;
- html-text;
- html-link;
- direct-image;
- background-image;
- nested-component;
- slot;
- figma-source-only;
- none.

visibility:

- mode: always;
- mode: property с property_id, который существует в properties текущей записи.

Для nested-component обязателен component_id. Для direct-image/background-image обязателен asset_contract_id. Для остальных эти поля запрещены. children задают фактический порядок элементов конкретного viewport.

Fact имеет id и одно typed value:

~~~yaml
facts:
  - id: padding
    value:
      type: foundation-reference
      foundation_id: spacing
      definition_group: roles
      definition_id: surface-padding-primary
  - id: radius
    value: { type: measure, value: 22, unit: px }
  - id: alignment
    value: { type: keyword, value: center }
  - id: image-size
    value: { type: dimensions, width: 296, height: 190, unit: px }
  - id: image-ratio
    value: { type: ratio, width: 296, height: 190 }
  - id: background
    value: { type: color, value: "#F3F3F5" }
~~~

Допустимые value.type:

- string;
- boolean;
- integer;
- number;
- keyword;
- measure с unit px или percent;
- dimensions с width, height и unit px;
- ratio с положительными width и height;
- color с uppercase six-digit hex;
- foundation-reference;
- component-reference;
- property-reference;
- asset-reference.

foundation-reference допускает foundation_id typography или spacing и точный definition_group/definition_id. Asset selections живут только в asset_contracts, а не маскируются generic foundation-reference.

Каждый literal fact содержит provenance:

~~~yaml
provenance:
  kind: figma-binding | figma-literal | registry-literal
  node_id: "337:4359"
  source_path: registry/email-component-descriptions-registry.md
~~~

Для figma-binding обязателен binding_name или style_name. Для registry-literal обязателен source_path. Совпадение числа с foundation definition не является основанием менять registry-literal на foundation-reference.

### Description model

Description не хранится вторым свободным текстом. Он собирается из ordered blocks:

~~~yaml
description:
  mode: rendered
  blocks:
    - { type: heading, value: SCOPE }
    - type: line
      tokens:
        - { type: text, value: "Обычный контентный блок внутри " }
        - { type: fact, path: "mobile/root/common-inset-policy" }
        - { type: text, value: "." }
    - { type: blank }
    - type: bullet
      tokens:
        - { type: component-name, component_id: button-primary }
        - { type: text, value: " остаётся HTML." }
~~~

Допустимые block types: heading, line, bullet, ordered, blank. ordered требует index. heading и plain text tokens не содержат точные размеры, проценты, hex colors, @2x/@4x, property defaults или component names, если эти данные уже представлены record fields. Для них используются token types fact, component-name и property-name.

Renderer:

1. выводит identity.figma_name;
2. выводит одну пустую строку;
3. последовательно рендерит blocks;
4. line не получает prefix;
5. bullet получает prefix «— »;
6. ordered получает prefix «значение index + точка + пробел»;
7. blank создаёт ровно одну пустую строку;
8. fact разрешает только существующий path текущей записи;
9. component-name и property-name разрешаются из index/record;
10. завершает Description одним LF.

Для вложенных Icon glyph components:

~~~yaml
description:
  mode: none
  reason: nested-figma-glyph-without-independent-email-contract
~~~

mode none запрещает blocks. mode rendered требует непустой blocks.

### Provenance

~~~yaml
provenance:
  baseline_path: registry/email-component-descriptions-registry.md
  baseline_heading: "Banner/Hero"
  baseline_blob_sha: 52893694e97a8751517f9174a90376e1eb849e0c
~~~

baseline_heading обязателен для 48 Description-backed records. Для 13 glyph records используется Figma inventory provenance с node_id и captured_at; baseline_heading отсутствует.

## Stable system IDs for the 48 Description-backed records

### Marketing: 26

- badge-step-number → Badge/Step-Number
- email-header → Email/Header
- block-cards-images → Block/Cards-Images
- block-icon-cards → Block/Icon-Cards
- email-footer → Email/Footer
- banner-hero → Banner/Hero
- block-steps → Block/Steps
- button-secondary → Button/Secondary
- button-primary → Button/Primary
- block-content → Block/Content
- banner-secondary → Banner/Secondary
- block-bullet-list → Block/Bullet-List
- item-bullet → Item/Bullet
- item-step → Item/Step
- banner-inline → Banner/Inline
- block-info-alert → Block/Info-Alert
- banner-app-download → Banner/App-Download
- email-footer-legal → Email/Footer-Legal
- asset-card-image-2x → Asset/Card-Image @2x
- card-image → Card/Image
- block-icon-list → Block/Icon-List
- card-icon → Card/Icon
- asset-feature-icon-4x → Asset/Feature-Icon @4x
- item-alert → Item/Alert
- item-notification → Item/Notification
- nps-options → NPS/Options

### Service: 18

- block-transaction-success → Block/Transaction-Success
- block-transaction-error → Block/Transaction-Error
- block-contact-support → Block/Contact-Support
- asset-bank-badge-4x → Asset/Bank-Badge @4x
- asset-partner-badge-4x → Asset/Partner-Badge @4x
- asset-icon-badge-4x → Asset/Icon-Badge @4x
- details-transfer → Details/Transfer
- asset-status-badge-positive-4x → Asset/Status-Badge-Positive @4x
- asset-status-badge-negative-4x → Asset/Status-Badge-Negative @4x
- details-suspicious-operation → Details/Suspicious-Operation
- block-personal-data-update → Block/Personal-Data-Update
- details-operation-plain → Details/Operation-Plain
- details-receipt → Details/Receipt
- block-receipt-info → Block/Receipt-Info
- banner-fiscal-check-link → Banner/Fiscal-Check-Link
- block-instruction-steps → Block/Instruction-Steps
- details-operation → Details/Operation
- badge-operation-status → Badge/Operation-Status

### Shared and templates: 4 Description-backed records

- email-template → Email/Template
- asset-product-logo → Asset/Product-Logo
- asset-header-logo-4x → Asset/Header-Logo @4x
- asset-header-logo-compact-4x → Asset/Header-Logo-Compact @4x

Тринадцать Icon glyph IDs назначаются один раз из подтверждённых текущих Figma names по правилу lower-kebab с namespace icon. Эти IDs и node IDs фиксируются в shared.yaml и после этого не меняются при обычном Figma rename.

## Public module contracts

### component-registry.mjs

~~~js
export function validateComponentRegistryShape(document, schema);
export async function loadComponentRegistry({ repoRoot, dataPath, schemaPath });
export async function loadComponentRegistries({
  repoRoot,
  sources = {
    shared: "data/components/shared.yaml",
    marketing: "data/components/marketing.yaml",
    service: "data/components/service.yaml",
  },
  schemaPath = "schemas/components.schema.json",
});
export function indexComponentRegistries(registries);
export function collectComponentReferences(record);
export function validateComponentRegistrySemantics({
  registries,
  typography,
  spacing,
  assets,
});
export function resolveComponentContracts({ index, candidates, viewport });
export async function validateComponentRegistries(options);
~~~

indexComponentRegistries создаёт immutable maps bySystemId и byFigmaIdentity. Точная Figma identity состоит из file_key + main component/component-set node_id. Name используется для identity-drift проверки, но не как визуальный fallback.

Успешное разрешение:

~~~js
{
  status: "resolved",
  viewport: "mobile",
  components: [
    { id: "banner-hero", contract: index.bySystemId.get("banner-hero").contracts.mobile },
  ],
}
~~~

Blocker:

~~~js
{
  status: "blocked",
  blockers: [
    {
      code: "COMPONENT_UNREGISTERED",
      path: "/candidates/0",
      message: "Figma component 123:456 is not registered.",
      handoff: {
        route_id: "component-onboarding",
        figma_identity: {
          file_key: "8zka5bHkcrJVK9I9dKjnhC",
          node_id: "123:456",
          figma_name: "Block/New",
        },
      },
    },
  ],
}
~~~

Resolver не пишет в registry, не ищет похожий name и не вызывает Figma.

Stable registry diagnostics:

- components-version-unsupported;
- components-schema;
- components-read;
- COMPONENT_REGISTRY_DUPLICATE_ID;
- COMPONENT_REGISTRY_DUPLICATE_FIGMA_IDENTITY;
- COMPONENT_REGISTRY_DUPLICATE_FIGMA_NAME;
- COMPONENT_REGISTRY_LIBRARY_MISMATCH;
- COMPONENT_REGISTRY_ROOT_MISMATCH;
- COMPONENT_REGISTRY_INCOMPLETE_VIEWPORT;
- COMPONENT_REGISTRY_UNKNOWN_PROPERTY;
- COMPONENT_REGISTRY_UNKNOWN_COMPONENT_REFERENCE;
- COMPONENT_REGISTRY_UNKNOWN_TYPOGRAPHY_REFERENCE;
- COMPONENT_REGISTRY_UNKNOWN_SPACING_REFERENCE;
- COMPONENT_REGISTRY_UNKNOWN_ASSET_REFERENCE;
- COMPONENT_REGISTRY_ASSET_INCOMPATIBLE;
- COMPONENT_REGISTRY_DESCRIPTION_REFERENCE;
- COMPONENT_REGISTRY_DESCRIPTION_LITERAL_DUPLICATE;
- COMPONENT_REGISTRY_FINGERPRINT_INVALID;
- COMPONENT_IDENTITY_REQUIRED;
- COMPONENT_UNREGISTERED;
- COMPONENT_NOT_ACTIVE.

### component-description.mjs

~~~js
export function validateDescriptionModel(record, index);
export function renderComponentDescription(record, index);
~~~

renderComponentDescription не читает Figma и не изменяет файлы. Для description.mode none возвращает null. Для rendered возвращает точный LF-normalized string.

### figma-component-snapshot.mjs

~~~js
export function normalizeFigmaComponentSnapshot(input);
export function fingerprintFigmaComponent(component);
export function compareFigmaComponentSnapshot({
  snapshot,
  registries,
  componentIndex,
});
~~~

Normalized snapshot root:

~~~json
{
  "schema_version": "1.0.0",
  "file_key": "8zka5bHkcrJVK9I9dKjnhC",
  "captured_at": "2026-09-05T00:00:00Z",
  "roots": [
    {
      "node_id": "538:17236",
      "components": []
    }
  ]
}
~~~

Normalized component содержит node_id, name, node_kind, description, variants, properties, semantic_children, bindings и contract_geometry. Все unordered collections сортируются; volatile MCP metadata отбрасывается.

compareFigmaComponentSnapshot возвращает sorted drift records только следующих типов:

- visual-drift;
- description-drift;
- identity-drift;
- unregistered;
- missing.

Ни один drift не исправляется автоматически.

### CLI contracts

~~~text
node scripts/normalize-figma-snapshot.mjs --input INPUT_PATH --output OUTPUT_PATH
node scripts/compare-figma-registry.mjs --repo-root REPO_ROOT --snapshot SNAPSHOT_PATH
~~~

Обе CLI принимают только перечисленные arguments, используют local UTF-8 JSON files, не вызывают сеть и не пишут вне явно переданного output. Comparison CLI ничего не изменяет и возвращает exit 0 при отсутствии drift, exit 1 при blocker/drift. Diagnostics не печатают Description, контент письма или произвольные snapshot values.

## Task 1: Freeze the current registry baseline and Figma inventory gate

**Files:**

- Create: tests/characterization/component-registry-shadow.test.mjs
- Reference only: registry/email-component-descriptions-registry.md
- Reference only: data/foundations/typography.yaml
- Reference only: data/foundations/spacing.yaml
- Reference only: data/foundations/assets.yaml

- [ ] **Step 1: Pin implementation main and capture read-only inventory**

Через Figma MCP прочитать только roots 538:17236, 538:17235, 539:38025 и 1084:34055. Сохранить inventory только в рабочей памяти: current component/component-set names, node IDs, variants, properties, descriptions, semantic children, bindings и contract geometry.

Проверить counts 26 marketing, 18 service, 16 shared и 1 template. Проверить 48 exact Markdown headings и 13 current Icon glyph components. При несовпадении остановиться и выдать inventory mismatch до GitHub data migration.

- [ ] **Step 2: Write the failing characterization test**

Тест парсит Markdown baseline и фиксирует:

- 26 marketing headings, 18 service headings, 1 template heading и 3 Shared Description headings;
- exact Figma name, node ID, node kind, variants, properties и Description для 48 записей;
- declared Shared count 16 и факт, что 13 Icon glyphs не имеют отдельных Description entries;
- ожидаемые structured counts 26, 18 и 17;
- renderComponentDescription(record) строго равен LF-normalized содержимому каждого из 48 fenced Description blocks.

Первая версия теста импортирует ещё не существующие modules/data и должна упасть.

- [ ] **Step 3: Push RED commit and verify GitHub Actions fails**

Expected: missing component registry module/data/schema.

- [ ] **Step 4: Commit**

~~~text
test: freeze component registry shadow baseline
~~~

## Task 2: Add the strict schema, description model and loaders

**Files:**

- Create: schemas/components.schema.json
- Create: scripts/lib/component-registry.mjs
- Create: scripts/lib/component-description.mjs
- Create: tests/foundation/component-registry.test.mjs
- Create: tests/foundation/component-description.test.mjs

- [ ] **Step 1: Write failing unit tests with inline valid records**

Покрыть envelope, record groups, strict additionalProperties false на каждом уровне, supported version, independent viewport contracts, recursive element tree, typed facts, variant/property shape, asset contract shape, rendered/none descriptions и provenance.

- [ ] **Step 2: Add semantic RED tests**

Покрыть duplicate IDs, duplicate Figma identity/name, library/root mismatch, incomplete active viewport, invalid property visibility, invalid nested component/asset references, invalid fingerprint, unknown description fact/component/property token, raw duplicated exact fact в text token и запрещённые inheritance keys.

- [ ] **Step 3: Push RED and verify focused tests fail**

~~~text
node --test tests/foundation/component-registry.test.mjs tests/foundation/component-description.test.mjs
~~~

- [ ] **Step 4: Implement the schema**

JSON Schema draft 2020-12, local refs only, additionalProperties false, exact enums and path patterns. YAML anchors, aliases и merge keys остаются запрещены readStrictYaml.

- [ ] **Step 5: Implement loader, index and renderer**

Следовать существующим foundation modules: AggregateError для shape failures, sanitized read diagnostic, deterministic sorting. Renderer реализует только утверждённую token grammar и exact line output.

- [ ] **Step 6: Run focused GREEN tests**

~~~text
node --test tests/foundation/component-registry.test.mjs tests/foundation/component-description.test.mjs
~~~

- [ ] **Step 7: Commit**

~~~text
feat: add structured component registry contracts
~~~

## Task 3: Migrate the 26 marketing records without semantic change

**Files:**

- Create: data/components/marketing.yaml
- Modify: tests/characterization/component-registry-shadow.test.mjs
- Modify: tests/foundation/component-registry.test.mjs

- [ ] **Step 1: Add expected marketing coverage tests**

Assert exact 26 stable IDs/names, global node IDs, variant/property parity, complete mobile/desktop contracts, asset compatibility and Description equality for every marketing record.

- [ ] **Step 2: Encode records from baseline plus confirmed Figma facts**

Перенести structure, exact facts, references, asset contracts и Description tokens. Привязывать typography/spacing только по подтверждённым bindings. Сохранить intrinsic-ratio requirements Card/Image, Banner/Hero и Banner/Secondary; не превращать Mobile width:100% в fixed height.

- [ ] **Step 3: Run marketing GREEN**

~~~text
node --test tests/foundation/component-registry.test.mjs tests/foundation/component-description.test.mjs tests/characterization/component-registry-shadow.test.mjs
~~~

На этом commit full characterization ещё может оставаться RED из-за отсутствующих service/shared files; focused marketing assertions должны быть GREEN.

- [ ] **Step 4: Commit**

~~~text
data: migrate marketing component contracts
~~~

## Task 4: Migrate the 18 service records without semantic change

**Files:**

- Create: data/components/service.yaml
- Modify: tests/characterization/component-registry-shadow.test.mjs
- Modify: tests/foundation/component-registry.test.mjs

- [ ] **Step 1: Add expected service coverage tests**

Assert exact 18 stable IDs/names, node IDs, variants/properties, two complete viewport contracts, nested Details links, asset contracts and rendered Description parity.

- [ ] **Step 2: Encode service records**

Сохранить exact details row behavior, single-divider contracts, nested versus standalone scopes, status badges, Mobile stacking и Desktop columns. Не унифицировать различающиеся фактические значения.

- [ ] **Step 3: Run service GREEN**

~~~text
node --test tests/foundation/component-registry.test.mjs tests/foundation/component-description.test.mjs tests/characterization/component-registry-shadow.test.mjs
~~~

- [ ] **Step 4: Commit**

~~~text
data: migrate service component contracts
~~~

## Task 5: Migrate shared assets, template and 13 Icon glyphs

**Files:**

- Create: data/components/shared.yaml
- Modify: tests/characterization/component-registry-shadow.test.mjs
- Modify: tests/foundation/component-registry.test.mjs

- [ ] **Step 1: Add shared coverage tests**

Assert 17 records: Email/Template, three Description-backed Shared assets and exact 13 glyph records from confirmed Figma inventory. Assert global total 61 and Description-backed total 48.

- [ ] **Step 2: Encode Email/Template as a real root contract**

Email/Template status active, semantic_role template, Content property type slot, separate Mobile/Desktop contracts and ordered Slot behavior. Не описывать его как «не верстать»: contract обязан задавать корневую assembly role, не добавляя Slot geometry.

- [ ] **Step 3: Encode Shared assets**

Сохранить Product variants, Header source/display roles, один Desktop export source и общий Mobile/Desktop src. @4x остаётся частью owner name, но не системного ID.

- [ ] **Step 4: Register 13 Icon glyph components**

Использовать точные current Figma names/node IDs. Для каждого record: status active, semantic_role icon, оба viewport contracts с render_mode figma-source-only, description.mode none. Не создавать export contract, HTML contract или Figma Description.

- [ ] **Step 5: Run all registry and characterization tests GREEN**

~~~text
node --test tests/foundation/component-registry.test.mjs tests/foundation/component-description.test.mjs tests/characterization/component-registry-shadow.test.mjs
~~~

Expected: exact counts 26 + 18 + 17, 61 globally unique IDs/identities, 48 rendered descriptions equal baseline.

- [ ] **Step 6: Commit**

~~~text
data: migrate shared component contracts
~~~

## Task 6: Add cross-foundation validation and exact component resolution

**Files:**

- Modify: scripts/lib/component-registry.mjs
- Modify: tests/foundation/component-registry.test.mjs

- [ ] **Step 1: Write failing cross-reference tests**

Проверить unknown typography/spacing/component/asset references, incompatible asset selections, wrong viewport typography reference, component cycles, property visibility targets и record library/root mismatch.

- [ ] **Step 2: Write failing resolver tests**

Проверить success по stable ID и exact Figma identity; COMPONENT_IDENTITY_REQUIRED; COMPONENT_UNREGISTERED с component-onboarding handoff; COMPONENT_NOT_ACTIVE; отсутствие fallback по похожему имени.

- [ ] **Step 3: Implement semantic validation**

Загрузить typography, spacing и assets foundations один раз. Собрать reference maps, проверить каждый inline reference и вызвать resolveAssetContract для каждого asset_contract.

- [ ] **Step 4: Implement exact resolver**

Stable ID или file_key + node_id — единственные keys. Если candidate также передал figma_name и оно отличается, вернуть identity drift blocker, а не разрешённый record.

- [ ] **Step 5: Run focused GREEN**

~~~text
node --test tests/foundation/component-registry.test.mjs
~~~

- [ ] **Step 6: Commit**

~~~text
feat: validate and resolve component contracts
~~~

## Task 7: Add pure Figma snapshot normalization and sync comparison

**Files:**

- Create: scripts/lib/figma-component-snapshot.mjs
- Create: scripts/normalize-figma-snapshot.mjs
- Create: scripts/compare-figma-registry.mjs
- Create: tests/foundation/figma-component-snapshot.test.mjs

- [ ] **Step 1: Write failing normalization tests**

Проверить deterministic ordering, volatile metadata removal, LF normalization, stable SHA-256 fingerprint и identical output при reordered input.

- [ ] **Step 2: Write failing drift tests**

Покрыть visual-drift, description-drift, identity-drift, unregistered и missing. Проверить, что Description comparison используется только для description.mode rendered.

- [ ] **Step 3: Write failing CLI tests**

Проверить allowed arguments, invalid input, output confinement, exit codes, deterministic JSON и sanitized diagnostics. Убедиться, что modules не импортируют network/Figma clients и не выполняют writes кроме normalize output path.

- [ ] **Step 4: Implement normalizer, fingerprint and comparator**

Fingerprint не включает name/Description/volatile instance content. Comparator не выбирает source of truth и не возвращает mutation instructions.

- [ ] **Step 5: Implement CLI wrappers**

Использовать явные paths, UTF-8 JSON и существующий diagnostics format. compare CLI read-only.

- [ ] **Step 6: Run focused GREEN**

~~~text
node --test tests/foundation/figma-component-snapshot.test.mjs
~~~

- [ ] **Step 7: Commit**

~~~text
feat: add component registry sync checks
~~~

## Task 8: Wire the shadow registries into manifest validation

**Files:**

- Modify: system/manifest.yaml
- Modify: scripts/lib/system-manifest.mjs
- Modify: tests/helpers/system-fixture.mjs
- Modify: tests/foundation/system-manifest.test.mjs
- Modify: tests/foundation/validator-cli.test.mjs

- [ ] **Step 1: Add manifest RED tests**

Ожидаемые source IDs:

- components-shared → data/components/shared.yaml, kind registry;
- components-marketing → data/components/marketing.yaml, kind registry;
- components-service → data/components/service.yaml, kind registry;
- components-schema → schemas/components.schema.json, kind schema.

Проверить missing source, wrong kind, wrong path, missing file и отсутствие всех четырёх IDs в bundle_profiles.

- [ ] **Step 2: Add validateSystem and CLI RED tests**

Invalid component data должна давать stable sanitized diagnostic и exit 1. Valid canonical system — прежнюю единственную PASS line.

- [ ] **Step 3: Update fixture list and manifest**

Добавить только sources. Не менять routes или bundle profiles.

- [ ] **Step 4: Integrate validateComponentRegistries**

resolveComponentRegistrySources(manifest) проверяет ровно три data sources и одну schema. validateSystem запускает component validation после prerequisite source diagnostics и объединяет errors в общий deterministic sort.

- [ ] **Step 5: Run focused GREEN**

~~~text
node --test tests/foundation/system-manifest.test.mjs tests/foundation/validator-cli.test.mjs
~~~

- [ ] **Step 6: Commit**

~~~text
feat: validate component registries in system manifest
~~~

## Task 9: Document shadow status and enforce boundaries

**Files:**

- Modify: README.md
- Modify: tests/characterization/foundation-preserved-files.test.mjs
- Modify: tests/characterization/component-registry-shadow.test.mjs

- [ ] **Step 1: Update README responsibility table**

Простым языком объяснить:

- три YAML-файла — будущий машинно-проверяемый владелец component contracts;
- Markdown registry пока остаётся активным рабочим источником;
- новые files не входят в email-build или maintenance bundles;
- Figma не изменялась;
- generated docs и bundle switch будут отдельным этапом 7.

- [ ] **Step 2: Strengthen preserved-source tests**

Сохранить blob checks для Markdown registry, typography registry, Core, workflows, skill и master-spec. Этот этап не обновляет их содержимое.

- [ ] **Step 3: Add boundary assertions**

Проверить:

- никаких component data в foundations;
- никаких foundations rules, node maps или component lists в skill;
- ровно три component data files;
- no component source IDs in bundle profiles;
- no committed snapshot files;
- no Figma write client/import;
- no final email files or images.

- [ ] **Step 4: Run full verification**

~~~text
npm run validate
npm test
npm run verify
~~~

Expected: all pass, validator remains read-only and deterministic.

- [ ] **Step 5: Review allowed diff against implementation base SHA**

Разрешены только paths из File Map. Особенно проверить отсутствие изменений registry/**, core/**, workflows/**, .agents/skills/**, data/foundations/**, bundle profiles и Figma.

- [ ] **Step 6: Commit**

~~~text
docs: document structured component registry shadow mode
~~~

## Task 10: Final PR verification and handoff

- [ ] **Step 1: Confirm branch and commit chain**

Каждый commit относится только к своему task; implementation branch основана на fresh main с этим plan.

- [ ] **Step 2: Confirm GitHub Actions**

Все обязательные jobs GREEN на head SHA.

- [ ] **Step 3: Produce migration evidence**

В PR summary зафиксировать:

- 61 records: 26 marketing, 18 service, 17 shared/template;
- 48 Description renderings exact-match Markdown baseline;
- 13 Icon glyphs зарегистрированы без самостоятельного Description/export contract;
- все active records имеют independent mobile/desktop contracts;
- all references resolve;
- unregistered component produces typed blocker and onboarding handoff;
- sync comparator detects five approved drift classes;
- Figma, Markdown registry, Core, workflows, skills и bundles не изменены.

- [ ] **Step 4: Keep PR draft until user review**

Не обновлять roadmap status и не начинать этап 7 до отдельного разрешения пользователя и merge реализации этапа 6.

## Completion criteria

Этап 6 технически завершён только когда:

1. три registry files и общая schema находятся в implementation PR;
2. exact inventory содержит 61 globally unique record;
3. 48 rendered descriptions совпадают с Markdown baseline;
4. 13 nested Icon glyphs зарегистрированы без выдуманного email contract;
5. active Mobile/Desktop contracts полны и независимы;
6. typography, spacing, asset и nested-component references разрешаются;
7. exact resolver блокирует unknown/draft/deprecated component;
8. snapshot comparison детектирует visual, description, identity, unregistered и missing drift;
9. system validator и полный Node test suite GREEN;
10. working bundle profiles не изменены;
11. Figma и старые активные источники не изменены;
12. implementation PR прошёл review и слит только по отдельной команде пользователя.

После merge реализации отдельной короткой задачей обновить roadmap фактической ссылкой на implementation plan/PR и отметить этап 6 завершённым. Затем подготовить отдельный implementation plan этапа 7 — generated docs и route-specific context bundles.
