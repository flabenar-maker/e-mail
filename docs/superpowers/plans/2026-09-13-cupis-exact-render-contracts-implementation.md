# Точные render contracts и корректная композиция — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task; do not delegate unless the user explicitly requests it. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Исправить Stage 8 pilot так, чтобы в HTML попадали только точные подтверждённые Mobile/Desktop-факты, а внутренние компоненты нельзя было вставить в письмо вне своего блока.

**Architecture:** Component records и foundations остаются единственными владельцами значений. Модель сначала проверяет допустимую вложенность, затем общий resolver превращает типизированные факты в точные render props; readiness и renderer используют один resolver и останавливаются при пропуске. Pilot получает фактические родительские Banner/Hero и Block/Cards-Images, после чего проходит browser gate.

**Tech Stack:** Node.js 24, ESM, Ajv, YAML/JSON component records, Figma MCP, GitHub CLI и GitHub Actions.

**Spec:** docs/superpowers/specs/2026-09-13-cupis-exact-render-contracts-design.md; дополнение к docs/superpowers/specs/2026-09-10-cupis-html-rendering-design.md.

## Global Constraints

- Источник системы — только облачный flabenar-maker/e-mail. Рабочая ветка: codex/email-viewport-preview, draft PR #60. Перед каждой записью сверить актуальный head SHA; писать через gh CLI в эту ветку, не в main. Не создавать локальный checkout.
- Figma читать только через MCP. Не менять макеты, свойства, нейминг и Description. Точный факт берётся из конкретного Mobile/Desktop-узла либо из уже подтверждённой foundation-ссылки; неполный ответ MCP — blocker, не повод для догадки.
- Не добавлять production email, реальные assets, временные модели и screenshots в репозиторий. Временные browser previews разрешены только вне репозитория.
- Не менять active route lists, maintenance skill, общий Markdown-промпт и docs/superpowers/plans/cupis-active-work-context.md без отдельной команды.
- Breakpoint: 660px. Рабочий font stack из текущей инструкции: Roboto, Arial, sans-serif. Внешняя оболочка текущей инструкции: width 100%, max-width 600px, min-width 300px; фон #F3F3F5. Контрольная ширина 328px у Mobile-варианта Figma не становится фиксированной HTML-шириной. Высота 1000px у Template.Content — плейсхолдер библиотеки и не переносится в HTML.
- Код и тесты должны отличать прямое адаптивное изображение (fluid width, auto height) от crop-wrapper/background-image. @2x не деформировать; @4x сохранять PNG и альфу. Никаких подложек без Fill.
- До завершения Task 9 PR остаётся draft. Промежуточный красный CI допустим только в draft как TDD-состояние; его нельзя объявлять готовностью. Expected HTML и визуальный эталон фиксируются только после фактического просмотра Mobile/Desktop.
- Пример компонента в Figma не равен конкретному письму. Визуально сверять каждый компонент с его вариантом, а корректную вложенность и ширину — на собранном pilot.

## Сделать завтра — исследование email-практик (2026-09-14, Europe/Moscow)

Обязательный исследовательский gate после готового плана исправления и до реализации Task 2–3 (resolver и email-примитивы). Сегодня ссылки только фиксируются: не делать выводов об их содержимом и не менять из-за них код, Core или foundations.

- [ ] Изучить [Good Email Code](https://www.goodemailcode.com/), [Email Guidelines](https://github.com/hteumeuleu/email-guidelines) и [Cerberus](https://github.com/emailmonday/Cerberus) досконально: документацию, актуальные исходники и применимые HTML/CSS-примеры; записать дату просмотра и commit SHA для GitHub-репозиториев. Особый приоритет — Email Guidelines и Cerberus.
- [ ] Составить source-linked матрицу практик: точный пример/правило → какую email-проблему решает → применимо ли к CUPIS и почему → что уже есть в системе → владелец изменения → проверка Mobile/Desktop. Отдельно проверить таблицы, адаптивность, изображения и пропорции, типографику, ссылки, fallback и реальные ограничения почтовых клиентов.
- [ ] По матрице предложить только нужные изменения в `core/email-rendering-standard.md`, `data/foundations/rendering.yaml`, `scripts/lib/email-primitives.mjs`, `scripts/lib/email-interpreter.mjs`, связанных schemas/tests и, лишь при глобальной необходимости, в `core/email-figma-prompt.md`. Не копировать чужой HTML как готовое письмо и не дублировать component-specific факты в общих правилах.
- [ ] Сверить предложения с согласованной спецификацией, фактическими Figma-контрактами и текущим планом. Сначала показать пользователю перечень «берём / не берём / почему» и impact по файлам; до отдельного согласования не менять правила и реализацию.

- [ ] Проанализировать репозиторий [HTeuMeuLeu/caniemail](https://github.com/HTeuMeuLeu/caniemail) как upstream-датасет совместимости HTML/CSS, а не как готовый HTML-renderer. Зафиксировать дату просмотра и commit SHA. Разобрать структуру `_features/*.md` и `_features`, frontmatter, стабильные поля `slug`, `title`, `description`, `category`, `tags`, `keywords`, `last_test_date`, `test_url`, `stats`, `notes`, `notes_by_num`; связь статусов `y`/ `a`/ `n`/ `u` и ссылок вида `a #1` с `notes_by_num`; идентификаторы, семейства, платформы и версии почтовых клиентов; выбор последнего актуального состояния для target.
- [ ] Сопоставить `test_url` с исходными тестами в `tests/` и изучить fixtures: минимальную HTML-структуру, совместно проверяемые свойства, inline CSS или `<style>`, таблицы, MSO conditional comments, Outlook XML/VML, media queries, HTML-атрибуты и `<head>`. Считать эти файлы доказательством тестируемой конструкции, не готовыми fallback-рецептами.
- [ ] Сравнить варианты получения данных: A — чтение `_features/*.md`; B — использование `api/data.json`; C — импорт в собственный `compatibility.json`. Предложить нормальную внутреннюю модель и парсер/нормализатор: `y → supported`, `a → partial`, `n → unsupported`, `u → unknown`, с сохранением notes и ограничений partial. Runtime интерпретатора не должен зависеть от Jekyll-структуры.
- [ ] Предложить typed target profile для конкретных клиентов (например, Gmail web/iOS, Outlook Windows, Outlook web, Apple Mail, Mail.ru) и API для будущего Compatibility/Policy Engine. Can I Email отвечает только «поддерживается ли feature X в target Y»; fallback-рецепты остаются нашим отдельным слоем. Не переносить процентный score автоматически — решение должно быть детерминированным по каждому target.

## Пакеты выполнения в пределах одного 5-часового окна

Пакет — это один самостоятельный заход в текущей ветке/PR. Каждый пакет рассчитан максимум на 3–4 часа активной работы с резервом на тесты, read-back, CI и публикацию. Оценка не обещает точное время ответа: при приближении к лимиту остановиться после последнего зелёного шага, оставить PR draft и продолжить со следующего пакета. Не начинать следующий пакет, пока текущий не прошёл свою проверку.

Каждый пакет завершается одним remote commit в `codex/email-viewport-preview`, проверкой изменённых путей, чтением опубликованных файлов и `gh pr checks 60 --repo flabenar-maker/e-mail`. Красный CI допустим только внутри TDD-пакета до реализации; перед переходом дальше он должен стать зелёным. Merge не выполняется без отдельной команды пользователя.

| Пакет | Связанные задачи плана | Результат одного захода | Ориентир |
|---|---|---|---|
| R0 — исследование | «Сделать завтра» | Матрица решений по Good Email Code, Email Guidelines, Cerberus и Can I Email; список «берём / не берём» и impact по файлам. Код не меняется. | 1.5–3 ч |
| R1 — композиция | Task 1 | Slot allowlists, проверка semantic role/component ID и тесты принятия/отклонения. Production-пилот пока не мигрируется. | 2–3.5 ч |
| R2a — typed facts | Task 2, Steps 1–3 | Схема и `resolveElementFacts` для точных literals, foundation refs, paint-none и linear-gradient; красно-зелёные resolver-тесты. | 3–4 ч |
| R2b — общие defaults | Task 2, Steps 4–5 | Точные исполняемые defaults rendering foundation и их render-impact digest; без component IDs. | 2–3 ч |
| R3a — interpreter contract | Task 3, Steps 1–2 | Interpreter использует единый resolver; убран suffix-`-width` mapper; добавлены диагностики unconsumed/unrepresentable facts. | 3–4 ч |
| R3b — email primitives | Task 3, Steps 3–5 | Inline typography/color/link policy, градиенты, padding на совместимом `td`, typography foundation loading и fail-closed render. | 3–4 ч |
| R4 — края письма | Task 4 | Template владеет шириной; Header и Footer имеют полные Mobile/Desktop-контракты, не вызывают Mobile overflow; тесты ширин и веток свойств. | 2.5–3.5 ч |
| R5 — Hero и Primary | Task 5 | Точные Hero/Button contracts, вложенный CTA, Show Button без пустого места, тесты градиента и display geometry. | 2.5–3.5 ч |
| R6 — Cards | Task 6 | Cards slot принимает несколько Card/Image; Mobile image fluid/auto, Desktop 232×148, порядок и gap доказаны тестами. | 3–4 ч |
| R7a — Secondary/App | Task 7, Steps 1–3 | Точные контракты Banner/Secondary и Banner/App-Download, включая Mobile/Desktop composition, Fill, asset mode и цвета. | 3–4 ч |
| R7b — pilot model | Task 7, Steps 4–6 | Валидная fixture с Header первым, Footer последним, Hero.cta и Cards-Images.cards; рекурсивный asset collection; активирован containment и pilot coverage. | 3–4 ч |
| R8a — readiness | Task 8, Steps 1–2 | Универсальный readiness gate на том же resolver; missing/unknown/approximate/unused facts блокируют рендер с точным path. | 3–4 ч |
| R8b — digest | Task 8, Steps 3–4 | Полный render-impact projection и audit: изменённый visual fact меняет digest, Description/purpose — нет; uncovered components остаются blocked. | 2.5–3.5 ч |
| R9a — visual gate | Task 9, Steps 1–4 | Browser preview Mobile 320/360 и Desktop 800, проверка overflow, ratio, порядка, локальных src и сравнение с Figma variants. | 3–4 ч |
| R9b — handoff | Task 9, Steps 5–6 | Generated docs, CI/read-back, отчёт metadata drift; PR остаётся draft. | 2–3 ч |

Порядок: R0 → R1 → R2a → R2b → R3a → R3b → R4 → R5 → R6 → R7a → R7b → R8a → R8b → R9a → R9b. R0 обязателен до решений, зависящих от внешних email-практик; остальные зависимости следуют из таблицы. Если пакет прерван лимитом, новый заход сначала перечитывает этот план, head PR и последний зелёный commit, затем продолжает только незавершённые пункты текущего пакета.

## Source checkpoints for this plan

| Компонент | Mobile node | Desktop node | Проверяемое различие |
|---|---|---|---|
| Email/Template | 1102:6 | 1102:7 | sample 328/600; общий фон #F3F3F5; Content slot без собственной production-высоты |
| Email/Header | 15:2037 | 230:3679 | верхняя секция pilot; один Desktop-source `header-logo @4x` PNG для обеих версий, display Mobile 212×33px и Desktop 322×50px по текущему registry; повторно сверить в Figma |
| Banner/Hero | 337:4359 | 230:3680 | Mobile изображение растёт пропорционально, CTA full-width; Desktop image-area 552×353px, CTA внутри Hero |
| Button/Primary | 337:4691 | 337:4694 | padding 12/24 и 16/32px; radius 32px; точный gradient из Fill, не направление «примерно» |
| Block/Cards-Images | 398:7598 | 398:7570 | список видимых Card/Image; Mobile одна в строке и fluid, Desktop одна в строке шириной внутренней области |
| Card/Image | 911:4130 | 911:4131 | Mobile direct image fluid/auto; Desktop 232×148px; текст живой |
| Banner/Secondary | 11:1218 | 337:4844 | Mobile direct image, Desktop отдельный image/crop behavior |
| Banner/App-Download | 15:2586 | 260:1494 | Mobile кнопки с иконкой и HTML-текстом, Desktop кнопки icon-only |
| Email/Footer | 17:2763 | 261:4020 | Footer fluid внутри wrapper; Mobile top gap 16px, Desktop 24px; фон #F3F3F5 |

При исполнении перечитать эти узлы через get_design_context с skillNames=figma-design-to-code и screenshot. Таблица — маршрутизация к источникам, а не копия полного component contract. Измеренные значения записывать только в data/components/*.yaml или профиль foundation, затем проверять provenance.

## File ownership map

- schemas/components.schema.json: новые типы точных render facts и ограничения slot-узлов.
- data/components/shared.yaml и data/components/marketing.yaml: только факты конкретных компонентов и их Mobile/Desktop-деревья; data/components/service.yaml сохраняется.
- data/foundations/rendering.yaml + schemas/rendering.schema.json: только общие исполняемые defaults, font stack и responsive policy; без component IDs.
- scripts/lib/render-contract-facts.mjs: единственный resolver typed facts → точные render props/diagnostics.
- scripts/lib/email-model.mjs: проверка допустимого дерева инстансов.
- scripts/lib/renderer-registry.mjs и scripts/lib/renderer-readiness.mjs: полнота interpreter coverage; source-only/unsupported не рендерятся.
- scripts/lib/email-interpreter.mjs и scripts/lib/email-primitives.mjs: применение разрешённых props без догадок.
- scripts/lib/email-renderer.mjs, scripts/render-email.mjs, scripts/lib/render-impact.mjs: ранний fail-closed, загрузка foundations и digest.
- tests/fixtures/rendering/pilot-email.json и tests/rendering/*: валидная representative-модель и регрессии; docs/generated/* обновляются только генератором после component data.

---

### Task 1: Проверка вложенности без списка запретных имён

**Files:** Modify schemas/components.schema.json, scripts/lib/email-model.mjs, tests/rendering/email-model.test.mjs. Do not yet change the production Email/Template record or pilot fixture.

**Interfaces:** A slot element may declare allowed_child_roles and/or allowed_child_component_ids. validateEmailModelSemantics(model, dependencies) returns EMAIL_MODEL_SLOT_CHILD_ROLE_INVALID or EMAIL_MODEL_SLOT_CHILD_COMPONENT_INVALID with the child instance path. A nested_components binding must target a declared nested-component element and its exact component_id.

- [ ] **Step 1: Write failing synthetic tests.** Build a template record with a content slot allowing roles email, banner, block; child records with root roles card and block. Assert that card is rejected and block accepted in both viewports. Add a list slot allowing only card-image and assert two card-image instances succeed but button-primary fails. Assert an extra nested_components binding to a non-nested element is rejected.

~~~js
// In tests/rendering/email-model.test.mjs, create invalidModel and dependencies
// with the existing fixture factory before this assertion.
const errors = validateEmailModelSemantics(invalidModel, dependencies);
assert.ok(errors.some((item) =>
  item.code === "EMAIL_MODEL_SLOT_CHILD_ROLE_INVALID" &&
  item.path.endsWith("/slots/0/instances/0/component_id")));
~~~

- [ ] **Step 2: Confirm red in the focused CI test.** Commit the test to the draft branch, inspect the node-validation job for the new assertion failure; existing green CI is not evidence of this behavior.
- [ ] **Step 3: Add schema fields and semantic check.** allowed_child_roles and allowed_child_component_ids are non-empty unique arrays of stable IDs, valid only when render_mode is slot. For each slot child and each viewport, resolve the child record, compare its root semantic_role and component ID to the parent slot allowlist. Reject undeclared extra nested bindings and mismatched component_id. Do not put Card/Image or any component ID into generic validator code.

~~~js
const childRole = childRecord.contracts[viewport].root.semantic_role;
if (slotElement.allowed_child_roles &&
    !slotElement.allowed_child_roles.includes(childRole)) {
  errors.push(diagnostic(
    "EMAIL_MODEL_SLOT_CHILD_ROLE_INVALID",
    childPath + "/component_id",
    "Child role " + childRole + " is not allowed in " + slotElement.id + ".",
  ));
}
~~~

- [ ] **Step 4: Re-run focused test and branch CI.** The new synthetic acceptance/rejection tests pass; the existing pilot is not yet rejected because its Template record does not carry the allowlist until Task 7. Commit schema, validator and test only.

### Task 2: Точный typed-fact resolver без renderer-specific списков компонентов

**Files:** Create scripts/lib/render-contract-facts.mjs and tests/rendering/render-contract-facts.test.mjs. Modify schemas/components.schema.json, data/foundations/rendering.yaml, schemas/rendering.schema.json and tests/rendering/render-impact.test.mjs.

**Interfaces:** resolveElementFacts({ element, viewport, foundations, path }) returns { props, consumedFactIds, diagnostics }. props contains style, layout, width/height behavior and image mode. No component ID appears in this module. A fact that changes HTML must be consumed here or by a named semantic validation rule.

- [ ] **Step 1: Add red tests for exact literals and foundation references.** Test Mobile/Action resolves from typography.styles to font-family Roboto, Arial, sans-serif; weight 500; size 14px; line-height 140%; letter-spacing 0. Test a wrong-viewport style ID, missing style ID, duplicate fact ID and unknown render-impact fact each return a path-specific error.
- [ ] **Step 2: Add precise paint tests.** Add a typed paint-none value and typed linear-gradient value with numeric angle_deg and ordered stops { color, position_percent }; keep solid fallback as a separate color fact. Reject “blue”, “dark”, “примерно” and an incomplete gradient at schema/resolver level. A transparent node must have verified paint-none, not an invented white fill.

~~~js
// In tests/rendering/render-contract-facts.test.mjs, build the full
// mobileButton element and foundations with local fixture factories.
const paint = {
  id: "paint",
  value: {
    type: "linear-gradient",
    angle_deg: 26.400843283750895,
    stops: [
      { color: "#18B037", position_percent: 32.031 },
      { color: "#3DD55C", position_percent: 94.281 },
    ],
  },
  provenance: { kind: "figma-literal", node_id: "337:4691" },
};
assert.equal(resolveElementFacts({
  element: mobileButton,
  viewport: "mobile",
  foundations,
  path: "/contracts/mobile/root",
}).props.style["background-image"],
"linear-gradient(26.400843283750895deg,#18B037 32.031%,#3DD55C 94.281%)");
~~~

- [ ] **Step 3: Implement the resolver and schema.** Canonical fact IDs are local to their element: layout-axis, layout-gap, width, height, width-behavior, height-behavior, padding-top/right/bottom/left, border-radius, paint, paint-fallback, typography-style, text-color, text-align, text-decoration, horizontal-align, vertical-align and image-aspect-ratio. Literal visual facts require exact type/unit and provenance; typography-style is a foundation-reference to styles with matching viewport. Constraint-only facts are moved to constraints during migration, not silently ignored.
- [ ] **Step 4: Make shared defaults explicit.** rendering foundation stores the exact font stack Roboto, Arial, sans-serif and only email-primitive defaults actually used by the renderer. Update render-impact projection so a change to those defaults changes the digest. No new component-specific constants enter rendering foundation.
- [ ] **Step 5: Verify tests and commit.** Focused resolver, schema and digest tests pass. The new resolver is not yet selected by the old interpreter; it becomes the only path in Tasks 3–7.

### Task 3: Подключить fail-closed к HTML-примитивам

**Files:** Modify scripts/lib/email-interpreter.mjs, scripts/lib/email-primitives.mjs, scripts/lib/email-renderer.mjs, scripts/render-email.mjs, tests/rendering/email-interpreter.test.mjs, tests/rendering/email-primitives.test.mjs and tests/rendering/html-invariants.test.mjs.

**Interfaces:** renderContractTree continues to return { html, css, diagnostics }, but calls resolveElementFacts for every potentially visible render node. renderEmailDocument returns empty HTML if any fact cannot be resolved. loadTypographyFoundation is called by render-email.mjs and passed as foundations.typography.

- [ ] **Step 1: Add failing synthetic tests.** A text node with Mobile/Action must output exact inline family/weight/size/line-height/letter-spacing/color; a link without text-color must return RENDER_FACT_REQUIRED rather than browser blue. A table with left/right padding must put it on a td, not only on table. A node with unsupported fact ID must return RENDER_FACT_UNCONSUMED. An absent Fill must not create background-color.
- [ ] **Step 2: Replace propsFromFacts.** The interpreter uses only resolveElementFacts; no generic id.endsWith("-width") or silent valueWithUnit fallback remains. Presentation-table places resolved padding, paint and alignment on compatible table/cell markup. Direct image uses one controlling axis and auto height when fluid. Background image gets its exact asset mode and geometry. Styling unsupported by an email primitive returns RENDER_FACT_UNREPRESENTABLE.
- [ ] **Step 3: Make primitives explicit.** Every visible p and text-bearing a gets complete inline typography/color. Link decoration comes from its resolved fact; browser default is never relied upon. Button gradient uses exact typed stops and solid fallback; no guessed angle. Keep protective email-safe markup only when the same visual result follows from the contract.
- [ ] **Step 4: Wire typography loading.** loadTypographyFoundation({ repoRoot, dataPath: "data/foundations/typography.yaml", schemaPath: "schemas/typography.schema.json" }) joins existing Promise.all in render-email.mjs. Component-level tests pass foundations: { rendering, typography }.
- [ ] **Step 5: Verify focused tests and commit.** Legacy pilot may remain red because its records are not yet fully migrated. Record the exact failing component/path; never re-enable the old suffix mapper merely to obtain green CI.

### Task 4: Оболочка письма, Header и Footer — точные края письма без переполнения Mobile

**Files:** Modify data/components/shared.yaml, data/components/marketing.yaml, scripts/lib/email-primitives.mjs, tests/rendering/pilot-layout.test.mjs and tests/rendering/email-primitives.test.mjs.

**Interfaces:** Email/Template owns fluid width and the 600px cap; Email/Header is a fluid, centered top section with one `header-logo` asset; Email/Footer owns only its top gap, fluid parent width, section padding/gaps, text and social assets.

- [ ] **Step 1: Re-read MCP nodes 1102:6, 1102:7, Header 15:2037/230:3679 and Footer 17:2763/261:4020; record exact facts/provenance.** Do not copy the 1000px Content placeholder height. Preserve Template background #F3F3F5. Check Header logo source Fill/export boundary and Footer text/link hierarchy plus both Show Caption/Show Social Links branches.
- [ ] **Step 2: Write failing contract/interpreter tests.** Render Header and Footer inside a synthetic Template shell at 320px, 360px and Desktop width: neither has fixed 600px Mobile width; shell alone owns the Desktop 600px cap. Assert one shared `header-logo` @4x PNG src, centered Mobile 212×33px and Desktop 322×50px display after Figma confirmation, no invented matte; verify Footer background/text/link styles and Show Caption/Show Social Links true/false branches. End-to-end pilot order is tested after fixture migration in Task 7.
- [ ] **Step 3: Move the width owner in component records.** Remove email-wrapper-width from Footer. Put exact shell behavior in Template root; do not put visual padding/height on Content slot. Replace Header description-N with root/logo facts for fluid width, centering, background and validated Mobile/Desktop display geometry; retain the existing `header-logo` asset contract and its actual Fill. Move Footer top gap, body padding, section gaps, caption/disclaimer/link typography, centered alignment and social icon sizes to their actual elements with Figma provenance or foundation references.
- [ ] **Step 4: Render and verify.** The table shell follows width 100% / max 600px / min 300px; Header and Footer inherit available width. Check no duplicate 600px owner remains and the logo keeps its intrinsic ratio. Commit Template/Header/Footer records and focused tests; generated docs are regenerated at Task 9.

### Task 5: Banner/Hero и Button/Primary — реальная кнопка, точный градиент

**Files:** Modify data/components/marketing.yaml, tests/rendering/pilot-components.test.mjs and tests/rendering/pilot-layout.test.mjs.

**Interfaces:** Banner/Hero.cta is the declared nested Button/Primary instance; show-button controls the full subtree. Button/Primary has exact per-viewport gradient and text/box facts.

- [ ] **Step 1: Re-read MCP nodes 337:4359, 230:3680, 337:4691, 337:4694, including source Fill and style metadata.** The code context presently reports Mobile gradient angle 26.400843283750895deg and Desktop 22.710553598290247deg, stops 32.031% and 94.281%, colors #18B037/#3DD55C. Confirm against the actual Fill before encoding; if MCP cannot establish the exact direction/stops, stop this task and report the missing source, not “примерно”.
- [ ] **Step 2: Write red tests.** Assert Mobile padding 12px 24px, Desktop 16px 32px, radius 32px, white text using Mobile/Action and Desktop/Action, exact solid fallback #18B037 and exact gradient. The clickable area is the link; no browser-blue text. Hero Mobile CTA is full-width; Desktop CTA follows its actual parent constraint (the inspected library variant has a 230px minimum); Show Button=false removes CTA without a spacer.
- [ ] **Step 3: Migrate the actual trees.** Replace Hero description-N root facts with facts on hero-image, content-area, heading/body and cta; keep direct-image Mobile fluid/auto and Desktop 552×353px crop-wrapper. Keep Button as nested-component, not a root Content child. Remove approximating prose-derived fact IDs and unconsumed constraint facts from renderable tree.
- [ ] **Step 4: Verify component-level rendering and commit.** Component tests must find the nested CTA in Hero. No additional Primary usage rule is inferred from its color or appearance.

### Task 6: Block/Cards-Images и Card/Image — список карточек внутри блока

**Files:** Modify data/components/marketing.yaml, tests/rendering/email-model.test.mjs, tests/rendering/pilot-components.test.mjs and tests/rendering/pilot-layout.test.mjs.

**Interfaces:** Block/Cards-Images.cards becomes a slot accepting multiple card-image instances in source order; Card/Image stays a single internal card with its own image/text contract. One slot child corresponds to one Card/Image instance; no Count property is introduced.

- [ ] **Step 1: Re-read MCP nodes 398:7598, 398:7570, 911:4130 and 911:4131.** Capture Mobile outer top/side 16px, content padding 22px, top-level gap 22px, card fluid width; Desktop top/side 24px, content padding 32px, top-level gap 32px, between-card gap 24px and Card/Image display 232×148px. Confirm per actual variants and source layers.
- [ ] **Step 2: Add red cardinality and ratio tests.** Build a block model with two Card/Image children under cards slot. Assert one card per row in both viewports, Mobile width 100% plus height auto with no HTML height attribute, Desktop 232×148px, and exact between-card spacer. Reject Button/Primary in the cards slot.
- [ ] **Step 3: Migrate parent and child records.** Block root/inner content/heading/cards/caption each receive their own exact facts. Change cards from one nested-component placeholder to a slot with allowed_child_component_ids: [card-image]. Preserve the Figma order of instances and optional Show Caption. Card/Image retains one source JPEG from its actual composite Asset/Card-Image @2x boundary; radius belongs to HTML clipping, not baked pixels.
- [ ] **Step 4: Verify and commit.** The standalone Card/Image unit test may render it for QA, but renderEmailDocument must reject the same card when placed directly in Email/Template.Content after Task 7.

### Task 7: Остальные pilot-компоненты и валидная модель письма

**Files:** Modify data/components/marketing.yaml, data/components/shared.yaml, data/renderers/registry.yaml, tests/fixtures/rendering/pilot-email.json, tests/rendering/pilot-components.test.mjs, tests/rendering/viewport-preview.test.mjs and scripts/lib/email-renderer.mjs.

**Interfaces:** Full pilot: Email/Template.Content contains Email/Header first, then Banner/Hero, Block/Cards-Images, Banner/Secondary, Banner/App-Download and Email/Footer last. Hero.cta contains Button/Primary; Cards-Images.cards contains one or more Card/Image instances. No direct card/button in Content.

- [ ] **Step 1: Re-read MCP nodes 11:1218, 337:4844, 15:2586 and 260:1494.** Confirm every live Mobile/Desktop text, Fill, alignment, padding, button size and source/export mode. For Banner/App-Download Mobile RuStore background is #1E60DD and text #FFFFFF; other button Fill is #F8F8FA and text #2B2C2E. Desktop store buttons are icon-only: remove Desktop store-text nodes rather than hiding their text by CSS.
- [ ] **Step 2: Add failing component checks for these exact values and viewport structures.** Secondary Mobile is a proportional direct image; Desktop is a separate crop/background behavior. App logo preserves its own source Fill. No store link relies on browser default color; Mobile icon/text are centered inside adaptive full-width buttons.
- [ ] **Step 3: Migrate Secondary/App exact facts.** Use typography references and literal colors with Figma provenance. Preserve one Desktop source asset where the asset contract requires it, correct @2x/@4x formats, and independent viewport composition.
- [ ] **Step 4: Make the fixture a valid schema 1.0.0 model.** Add schema_version to the fixture itself; remove the test helper's ad-hoc injection. Insert Email/Header first with `header-logo` → `images/header-logo.png` and alt, retain Email/Footer last, move Primary into Hero nested_components and Card into Cards-Images.cards instances. Use actual parent properties and required content; paths are test references, not committed image bytes. Collect assets recursively through slots and nested_components.
- [ ] **Step 5: Activate containment.** Add allowed_child_roles: [email, banner, block] to Email/Template.Content in both viewports and allowed_child_component_ids: [card-image] to the cards list slot. renderEmailDocument calls semantic validation before rendering so direct unit invocation cannot bypass the rule.
- [ ] **Step 6: Register Header/Hero/Cards-Images interpreter coverage only after each exact contract passes readiness.** The pilot then covers nine component types. Keep source-only and unsupported components non-renderable. Run focused model, pilot component and viewport-preview tests. Commit migrated data/fixture/tests; PR remains draft.

### Task 8: Универсальный readiness gate и render-impact safety

**Files:** Modify scripts/lib/renderer-registry.mjs, scripts/lib/renderer-readiness.mjs, scripts/lib/email-renderer.mjs, scripts/lib/render-impact.mjs, scripts/audit-renderer-readiness.mjs, tests/rendering/renderer-readiness.test.mjs and tests/rendering/render-impact.test.mjs.

**Interfaces:** validateRendererReadyComponent(record, coverage, foundations) checks both viewport trees using resolveElementFacts. renderComponent blocks an interpreter component with missing/unknown/unconsumed facts before prepareInstance. auditRendererReadiness reports exact readiness for covered components, while uncovered active records remain explicitly not ready.

- [ ] **Step 1: Write failing regressions.** Delete Mobile typography-style, delete RuStore paint, remove Header logo display geometry or asset binding, replace a color literal with the string “blue”, remove one gradient stop, insert email-wrapper-width back into Footer, and insert an unused render-impact fact. Each mutation must return a component/viewport/element-path error and empty HTML. A source-only record remains valid inventory but cannot render.
- [ ] **Step 2: Wire the one resolver into readiness and renderer.** Do not maintain a separate readiness-only list of acceptable facts. Required render facts are determined by visible render mode and explicit fact semantics; Для визуально прозрачного элемента paint-none фиксируется только после проверки отсутствия Fill; отсутствие факта само по себе не считается подтверждённой прозрачностью. Hidden branches are checked against their possible visible property state. Validate foundation IDs and viewport matches.
- [ ] **Step 3: Ensure digest coverage.** Projection includes every resolved typography/style, paint, layout fact and rendering primitive default that changes HTML. Documentation prose and Figma Description remain excluded. One changed resolved font weight or gradient stop must change digest; changing purpose alone must not.
- [ ] **Step 4: Run full audit and tests.** All interpreter-covered pilot components have zero readiness issues; uncovered active records remain blocked and are migrated in Package 11. No description-N on a renderable component and no silent unknown fact. Update numerical coverage assertions to nine after Header/Hero/Cards-Images are registered. Commit only after these checks.

### Task 9: Визуальный gate, generated docs и handoff

**Files:** Modify tests/rendering/viewport-preview.test.mjs, tests/rendering/pilot-layout.test.mjs, tests/rendering/html-invariants.test.mjs, docs/generated/component-registry.md, docs/generated/typography-registry.md, docs/generated/asset-registry.md and docs/superpowers/plans/2026-09-10-cupis-html-rendering-stage-8.md. Add deterministic expected HTML fixtures only after visual gate. Keep scripts/render-email-preview.mjs unless a test exposes a specific defect.

**Interfaces:** После исправления fixture CLI принимает `--model tests/fixtures/rendering/pilot-email.json --viewport mobile --output C:/Users/flabe/AppData/Local/Temp/cupis-preview-mobile` и аналогично `--viewport desktop` с отдельной временной папкой. Для production-сборки остаются только email.html и images/; preview.html существует лишь во временном preview.

- [ ] **Step 1: Prove red-green for original symptoms.** With the old pilot shape, semantic validation rejects root Card/Image/Button/Primary. With the corrected model and real temporary Figma assets, both viewports produce HTML. Assert Header first and Footer last, one shared logo src with per-viewport display dimensions, Footer property branches, and exact typography, colors, section widths, button backgrounds and image ratios.
- [ ] **Step 2: Browser-check Mobile at 320px and 360px, Desktop at 800px.** For each viewport check no horizontal overflow, Header first/Footer last, their centering/width and correct visible variants. For @2x direct images compare displayed width/height ratio with intrinsic ratio to within one rendered pixel; check Mobile height changes when width changes. Compare each rendered component to its corresponding Figma screenshot; do not pretend synthetic full-email copy matches one Figma letter.
- [ ] **Step 3: Resolve every visual difference at its owner.** Component value → data/components; shared behavior → rendering foundation/primitive; asset source/crop → asset contract and temporary export. Do not patch generated HTML, add a fake background or weaken the visual test. If exact Figma value is unavailable, leave PR draft and report the blocker.
- [ ] **Step 4: Only after browser gate passes, record expected HTML/viewport assertions.** Do not approve a screenshot of the previously broken output as golden. Preview CLI must verify all local src and background paths; temporary screenshots/assets are not committed.
- [ ] **Step 5: Regenerate documentation and verify cloud CI.** Generated docs reflect component data. GitHub Actions node-validation and windows-bootstrap pass; gh pr checks 60 --repo flabenar-maker/e-mail reports both green. Review PR diff for only planned paths and no production output.
- [ ] **Step 6: Report Figma metadata drift separately.** Present exact old → proposed Description corrections for Card/Image wording, Button/Primary approximate gradient and Banner/App-Download vague color words, based on generated compact-description standard. Do not write Figma without a new allowlist and explicit permission. Keep PR draft and do not merge without the user's separate command.

## Verification commands and stop rule

After each remote commit, use GitHub Actions for validation; the code remains sourced from the pinned cloud branch:

~~~powershell
gh pr checks 60 --repo flabenar-maker/e-mail
gh run list --repo flabenar-maker/e-mail --branch codex/email-viewport-preview --limit 3
~~~

The CI workflow runs npm run verify on Node 24 and its Windows bootstrap job. A failed job must be inspected before the next change. The final handoff must report the branch head SHA, exact files changed, actual passing checks, visual comparison outcome and any unresolved Figma Description drift. Never claim “fixed” from a green structural test alone.
