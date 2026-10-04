# Стандарт component contract

## Назначение

Этот файл определяет, что считается полным `structured component contract` для компонента CUPIS email-библиотеки. Contract — каноническое машинно-проверяемое описание конкретного компонента, достаточное для его однозначной реализации и проверки.

Стандарт применяется при создании, анализе и изменении component records. Он не описывает сборку целого письма и не заменяет foundations, workflows или данные конкретного Figma-инстанса.

## Владение данными

- Component record владеет только фактами и ограничениями конкретного компонента.
- Foundations владеют общими определениями типографики, отступов, ассетов и нейминга.
- Generated registry превращает component records и разрешённые foundation references в читаемую полную документацию.
- Figma Description является отдельной компактной проекцией и не заменяет полный contract.
- Workflow определяет последовательность действий, но не копирует component facts.
- Skill выбирает нужный маршрут и источники, но не хранит собственную копию правил.

Один факт должен иметь одного владельца. Component record ссылается на общее правило через `foundation references`, а не дублирует его текст или допустимые значения.

## Роли записей: блоки, Shared и Templates

Запись в `data/components/` описывает объект Figma-библиотеки. Само наличие такой записи не делает объект самостоятельным блоком письма.

- **Блоки письма** — верхнеуровневые блоки, баннеры, NPS, хедер и футер, из которых составляется содержимое письма. Их контракт описывает реализацию соответствующего блока.
- **Shared** — вспомогательные элементы библиотеки: исходные иконки, логотипы и другие используемые внутри элементов письма объекты. Они не становятся отдельными блоками и не требуют самостоятельной HTML-вёрстки. Проверяются их фактическая роль, зависимости и параметры, влияющие на использование или экспорт внутри владельца. Размер исходного знака не подменяет display-размер вложенного ассета, заданный использующим его блоком.
- **Templates** — контейнеры для сборки дизайна, одновременно задающие корневую оболочку письма: размеры макета, фактический фон и размещение содержимого. Template не является отдельным блоком в списке содержимого; его параметры значимы для оболочки итогового HTML. Слот задаёт состав и порядок размещённых блоков.

Фактический фон и геометрия Template читаются из Figma. Общие параметры HTML-оболочки принадлежат `data/foundations/rendering.yaml` (`shell`) и должны быть сверены с этим источником, а не выбраны независимо. Роль корневой записи в модели письма не означает, что Template следует добавлять в содержимое как ещё один блок.

Геометрия читается вместе с режимами sizing: измеренная высота `HUG` не становится фиксированной высотой HTML-письма, а reference-ширина мобильного макета не отменяет адаптивную ширину письма. Видимый Fill Template — реальный фон письма; наличие такого же Fill у слота не требует создавать дополнительный HTML-слой или удваивать фон и отступы.

Для Shared отсутствие самостоятельного HTML-контракта не является само по себе дефектом. При сверке сначала определяется роль записи и владелец значимого параметра: нельзя механически требовать от вспомогательной графики полноту контракта блока или считать отсутствие `figma_fact_links` доказательством визуальной ошибки. Это не освобождает от проверки исходной графики, вложенных связей и экспортных границ. Для Templates проверка размеров, фона и поведения корневой оболочки сохраняется.

## Служебные связи для сверки

Связь `evidence_links` хранится в записи-потребителе: она указывает точный источник в Figma, канонический target и, для графики, владельца ассета. Ожидаемые значения разрешаются из канонических источников одного SHA; отдельные копии значений и постоянный статус успешной проверки в links не хранятся.

Каждая связь подтверждается свежим MCP-чтением источника, target и владельца. Default исходного компонента и фактическая замена внутри instance проверяются раздельно; неоднозначная граница остаётся непроверенной. Успех links не снимает диагностику остальных фактов.

Вложенная графика остаётся у владельца дочернего component record. При сверке HTML-ссылки `nested-component` её размещение подтверждается собственными geometry mappings и provenance родителя, свежим деревом дочернего компонента и точной compound-идентичностью внутри полного дерева родителя. Граница экспорта передаётся через эту ссылку без создания родительского asset contract или копии дочерних значений. Вложенные INSTANCE внутри границы проверяются по фактическому main component и каноническим связям дочернего владельца; неизвестный target или отсутствующая связь остаются непроверенными. Такой proof подтверждает только свою область и не снимает scalar, coverage или capture diagnostics.

Внешний опубликованный main component регистрируется как Shared source-only reference с собственным lookup-root `remote-reference` и точным `figma.remote_source.component_key`. `figma.file_key` обозначает контекст текущего чтения, а не неподтверждённый исходный файл публикации; фактическое опубликованное имя сохраняется. Такая запись не создаёт HTML-блок, независимый экспорт или display-размер потребителя. Свежий capture обязан подтвердить и точный node ID, и `remote: true` с тем же publication key; отсутствие или несовпадение metadata оставляет identity непроверенной.

Эти metadata не меняют HTML-контракт, границу экспорта или компактную Description. Полный generated registry показывает evidence links в разделе зависимостей, а publication key и lookup-контекст remote reference — в её identity; значения из внешних источников не подставляются в HTML-контракт.

## Что означает «полный»

Полный contract содержит всё, что влияет на результат реализации компонента, но не является инвентарём всех безвредных настроек Figma.

Факт входит в contract, если его изменение может повлиять хотя бы на одно из следующего:

- структуру и порядок элементов;
- отображение в Mobile или Desktop;
- текст, типографику, размеры, отступы или выравнивание;
- адаптивное поведение;
- видимость, вариант или результат component property;
- границу экспорта, crop, пропорции, прозрачность или display-размер ассета;
- ссылку, интерактивность или fallback;
- обязательную вложенность другого компонента;
- возможность однозначно сверстать или проверить результат.

В contract не включаются координаты служебных зон библиотеки, состояние раскрытия слоёв, порядок объектов на документационной странице и другие Figma-настройки, не влияющие на production-инстанс.

## Обязательные группы данных

### Identity, status и provenance

Каждая запись содержит:

- стабильный CUPIS ID;
- каноническое имя компонента;
- библиотеку или область применения;
- статус жизненного цикла;
- Figma provenance: file key, component set или component node references, если они нужны для точного чтения;
- structural fingerprint или эквивалентные данные для проверки непреднамеренных изменений.

Provenance помогает найти и проверить источник, но не заменяет реализационный contract.

### Purpose

Поле `purpose` — одно короткое предложение о функции компонента в письме. Оно отвечает на вопрос «зачем существует этот компонент», а не пересказывает его слои, размеры или правила всей рассылки.

### Независимые Mobile и Desktop contracts

Mobile и Desktop описываются независимо. Нельзя заменять одну версию формулировкой «как в другой версии» или молчаливым наследованием.

Для каждого обязательного viewport фиксируются применимые факты:

- корневая роль и способ отображения;
- дерево значимых элементов в порядке чтения;
- layout и направление;
- точные размеры или ссылки на их владельцев;
- padding, gaps, alignment и wrapping;
- типографические ссылки;
- адаптивное поведение и ограничения размеров;
- visibility и viewport-specific различия;
- nested component references;
- asset placement и presentation behavior.

Совпадающие значения Mobile и Desktop всё равно должны разрешаться однозначно для каждого viewport. Совместное хранение допустимо только как явная машинная ссылка без скрытого наследования.

### Variants и properties

Каждый поддерживаемый variant и component property должен иметь:

- стабильное имя или ID;
- тип и допустимые значения;
- значение по умолчанию, если оно существует;
- явный эффект на структуру, содержание, видимость, layout или ассеты;
- viewport-specific эффект, если он различается.

Нельзя перечислять property без объяснения результата её переключения.

### Nested components и зависимости

Если production-структура зависит от другого компонента, contract содержит ссылку на его стабильный ID и роль в дереве. Копировать внутрь родительской записи полный contract дочернего компонента нельзя.

Если дочерний компонент должен быть фиксированного variant или состояния property, это указывается в ссылке как component-specific требование.

### Foundation references

Общие типографические, spacing-, asset- и naming-правила указываются ссылками на соответствующие foundation IDs. Component record хранит место применения и конкретный выбор, но не копирует определение общего токена или алгоритм его выбора.

Если для компонента действительно нужен literal, он должен быть:

- точным;
- снабжён единицей измерения;
- привязан к конкретному субъекту и viewport;
- обоснован как component-specific значение, а не замена отсутствующей foundation-ссылки.

### Asset contracts

`asset contracts` описывают только конкретное применение визуального ассета:

- semantic asset ID и owner;
- source mode;
- export boundary;
- export profile reference;
- scale suffix;
- формат и alpha-требование через foundation reference;
- crop и пропорции;
- presentation-only clipping или radius;
- display width/height и responsive behavior отдельно для Mobile и Desktop;
- что входит и не входит в экспорт, если граница составная.

Нельзя подменять asset contract общим указанием «экспортировать картинку» или пытаться восстановить экспортный профиль по тому, что MCP отображает в интерфейсе.

### Component-specific constraints

В `constraints` остаются только правила, которые нельзя вывести из структуры, properties, assets или foundations. Каждое ограничение должно быть атомарным, проверяемым и относиться к названному субъекту.

Критическим считается ограничение, если без него реализация может выглядеть правдоподобно, но нарушить обязательный responsive behavior, export boundary, property side effect или email-совместимость именно этого компонента. Полный список constraints хранится в record; компактная Figma-проекция получает только явно выбранные critical constraint IDs.

## Правила формулировки

- Один факт — одно поле или одно атомарное утверждение.
- Указывать субъект, viewport и единицу измерения там, где они применимы.
- Использовать точные значения, стабильные IDs и явные ссылки.
- Не писать «примерно», «обычно», «по ситуации», «как в макете» или «как в Desktop».
- Не описывать прежние ошибки как отдельное постоянное правило, если текущее положительное правило уже однозначно.
- Не хранить ручной полный prose-template параллельно структурированным полям.
- Не копировать глобальные правила письма, foundation definitions или workflow-шаги.
- Не превращать ограничения маркетингового контента в технический contract, если они не влияют на реализацию компонента.

## Порядок generated registry

Полная читаемая документация генерируется в фиксированном порядке:

1. Identity and purpose
2. Structure and rendering
3. Desktop
4. Mobile
5. Properties and variants
6. Assets and interaction
7. Constraints and dependencies

Необязательная пустая секция пропускается, но порядок оставшихся секций не меняется. Foundation references выводятся вместе с разрешённым точным значением, чтобы читателю не приходилось угадывать результат.

Generated registry не редактируется вручную и не становится вторым владельцем фактов.

## Доказательная сверка с Figma

Значения, однажды перенесённые из Markdown, и метка `figma-source-recorded` не доказывают совпадение с текущей библиотекой. Перед тем как считать component contract проверенным, нужно получить свежий read-only пакет непосредственно через Figma MCP по точному `figma.node_id` и сопоставить его с канонической записью компонента.

Свежесть evidence требует request-bound capture: перед реальным MCP-вызовом host создаёт новые случайные session/request challenges и передаёт закреплённый SHA; пакет возвращает их точный echo. Host request/receipt и Figma capture start/end проверяются в своих шкалах времени, не сравнением часов разных систем. Общий validator проверяет binding, полный session/receipt envelope; loader дополнительно проверяет точные bytes/hash, containment и полноту дерева. Подстановка новых дат или challenges в уже сохранённый пакет не заменяет новое чтение. Формат и алгоритм определены capture/session inputs и `scripts/lib/component-evidence-freshness.mjs`, не компонентными контрактами.

Проверяется не только визуальный снимок, но и фактические данные Mobile и Desktop: дерево и порядок слоёв, тексты, типографика, размеры, padding, gaps, alignment, цвета, fills, bindings, видимость, значения и эффекты component properties, границы ассетов. Снимок служит дополнительной визуальной проверкой, а не заменяет сравнение данных. Число, цвет или текст проверяются по конкретному Figma node, source path, viewport и точному значению.

Связь `Figma variant + node + source path → contract path` хранится в `contracts.figma_fact_links` самого component record. Внешняя карта соответствий, сохранённый `source_variants` или статус не могут подтвердить запись. Аудит проверяет обе стороны: изменённый либо неучтённый факт Figma, несовпадение значения, а также contract fact без прямого Figma-источника. Для прямых атомарных facts нужен `figma-literal` или `figma-binding` provenance того же node. Значение, которое требует cross-source, policy-derived или normative proof, ссылается на один owner-local typed `contract-proof`; совпадение числа или статус не заменяют этот proof.

Если Figma MCP не дал значение, тип или paint не поддержан capture-профилем, либо непонятно, влияет ли поле на реализацию, результат остаётся непроверенным. Исключать факты можно только по узкой и обоснованной классификации незначимых полей, а не ради прохождения аудита. Нельзя заявлять о полной сверке компонента, пока этот факт-аудит не прошёл на свежих данных и не проверено визуальное соответствие.

## Typed fact proof: границы доказательства

Optional `evidence_links.fact_proofs` и `normative_decisions` — служебные authoring metadata. Старые evidence arrays остаются обязательными; удаление proof не отменяет fact coverage. Каждый proof адресует один собственный typed `/facts/N/value`; покрываемые scalar leaves определяет тип самого значения, не пользовательская маска. IDs уникальны во всех evidence arrays. Exact selectors сохраняют component/variant/full compound node identity.

Механизм различает native source values всех source-only variants, consumer geometry через фактическую dependency/asset цепочку, suffix/export-profile ownership, existing typography style usage, Mobile proportional-auto policy, Desktop HUG/FILL content-height topology и отдельно согласованный CSS linear-gradient angle. Размер source и consumer не приравнивается по одному числу. Native sizing само по себе не доказывает HTML auto; native gradient transform не выдаётся за согласованный CSS angle.

Style usage сохраняет direct native style-ID provenance и проверяет unique foundation ID/name/viewport, параметры и полные mixed-text runs с их локальным оформлением. Normative decision хранит фактическую инструкцию пользователя и согласованный spec reference; owner/viewport/element/fact/value и native paint/ancestor context связаны digests. Hash подтверждает неизменность контекста, но сам не является разрешением пользователя.

Request-bound capture 1.3 добавляет actual selected `owner_identity`; прежний 1.2 не повышается до нового proof. Canonical SHA, receipts, request echo, полный variant-set/tree и точные packet bytes проверяются независимо. Raw scalar report сохраняется; effective report закрывает только exact unmapped/uncovered obligations успешных proofs, вычисленных для той же canonical record и того же неизменённого capture packet. Обе стороны сверки должны быть настоящими результатами соответствующих auditors: изготовленный, скопированный, изменённый либо полученный на другом packet raw report не устанавливает coverage. Value mismatch, identity, capture и остальные diagnostics не скрываются. Combined acceptance требует всех независимых ветвей audit.

Metadata не поступают в email bundle, HTML, export policy или compact Description. Ни один proof не подставляет новое rendering value и не превращает вспомогательный source в блок письма.

## Same-node native reductions

Optional `evidence_links.native_fact_proofs` содержит только supplementary authoring proof: `uniform-corners`, `text-resize-alias`, `text-alignment-alias`, `axis-sizing-alias`. Каждая запись адресует собственный typed fact и exact selector того же node/variant; direct `figma-literal`/`figma-binding` provenance и единственный `figma_fact_link` сохраняются. Это additive metadata в schema 2.3.0: runtime values, provenance и обязательные evidence arrays не меняются.

Радиус подтверждается только при четырёх присутствующих числовых углах, в точности равных scalar radius с independently mapped pixel measure. TEXT alias требует совпадения style/geometry на одном TEXT node с известным enum и прямым lowercase mapping. Axis reduction требует известной HORIZONTAL/VERTICAL orientation: primary/counter определяет directional axis, HUG соответствует AUTO, FILL/FIXED — FIXED; режим NONE не сворачивается в этот proof. Ни один reduction не принимает числовое совпадение без независимого mapping.

Capture identity/freshness остаётся у общего request-bound proof environment. Native coverage вычисляется по полному свежему packet и закрывает только exact source tuples. Original raw report и computed proof object должны быть подлинными, неизменёнными и от одного record/packet; copied или caller-made reports не принимаются. Composition с typed fact proofs начинается от original raw report, а не от изготовленного effective clone. Value mismatch, неизвестный native field, capture failure и остальные obligations сохраняются.

У этих metadata нет общего ignore-list, rendering fallback или stored PASS. Неиспользованный/удалённый proof оставляет исходные obligations открытыми. Owner-local IDs уникальны во всех evidence arrays; один source/kind/axis имеет один reduction. Метаданные не меняют HTML, export boundary, compact Description или роль source-only artwork.

## Native structure and control references

Optional `evidence_links.native_relation_proofs` адресует собственный element (`element-structure`) или зарегистрированный default variant (`owner-controls`). Это authoring metadata, не runtime override или копия source tree. Точное размещение элемента подтверждается одним same-node typed `reference-size` и независимыми width/height mappings. Имена/классы/visibility и порядок непосредственных children выводятся из semantic element, registered axes, Boolean properties и source identities дочерних reference-size facts; неизвестное не получает default. Alternate contracts используют собственный Viewport axis.

Boolean reference проверяет native property name (нормализуется только Figma ID suffix), canonical default и actual visibility. Полный native definition set сверяется с canonical Boolean properties и полными axis domains всех registered variants. UI order options не имеет смысла для HTML и сравнивается как точное множество без дублей. Выбор default хранится ссылкой на точный registered variant, не выводится из порядка вариантов или числа.

Nested-component INSTANCE требует registered main variant, complete VARIANT properties и независимые direct mappings значений каждой оси. Rendered-node image INSTANCE требует точную собственную asset boundary/dependency цепочку; его native children не становятся HTML. Структурный proof не скрывает artwork/capability diagnostics, scalar mismatch, неизвестные поля или непроверенные bindings. Дополнительные controls/неподдерживаемые modes остаются unverified. Raw report сохраняется; coverage принимается только от internally computed неизменённого proof для того же exact record/packet.

## Native variable binding references

Optional `evidence_links.native_variable_proofs` ссылается на существующий same-node typed px/color fact, точный native binding leaf и variable identity (ID/key/name/type/collection). Равное число или цвет не доказывают правильную переменную. Existing fact value/provenance не заменяются копией variable definition.

Request-bound capture 1.3.0 дополнительно возвращает `binding_evidence`: фактические Variable/VariableCollection definitions, mode selections из consumer и `resolveForConsumer` result. Alias chain разрешается по реально выбранному mode каждой collection; default mode никогда не используется как fallback. Terminal, consumer result, native scalar и независимо mapped typed fact должны совпасть. Unknown fields, missing mode, wrong identity/type/alpha, duplicate usage и alias cycles остаются unverified.

Profile допускает exact Auto Layout padding/item spacing, uniform four-corner aliases и one visible opaque SOLID fill. Coverage снимает только подтверждённый binding ID из списка raw obligations, не скрывает native scalar mismatch или новый paint/layout context. Private internally computed report связан с тем же canonical record/packet; raw report сохраняется.

### Mixed styled text ownership

Existing `style-usage` proof проверяет единственный foundation style ID/name/viewport и фактические size/weight/line-height/tracking. Aggregate family/style/decoration `null` не является CSS значением. Их redundant native obligations закрываются только при complete producer-shaped ranges, точном typed `styled-text-segments` того же element/node, полном независимом primitive mapping всех ranges и сохранённых local underline/paint. Не наследовать weight/style ID/tracking из ranges; отсутствие/подмена local paint, новый field или неполные ranges остаются unverified.

## Native HTML context references

Optional `evidence_links.native_context_proofs` references one owned, independently verified `element-structure` proof. It carries no copied native values or caller field mask. The html-element-context kind is restricted to ordinary HTML capabilities; source-only artwork and Templates are not admitted by that role alone.

The narrow absence profile requires AUTO positioning, null minimum width, opacity 1, rotation 0 and empty strokes; present effects must be empty. Nonzero grow and explicit alignment require independent exact same-node mappings. Empty bindings are proved as empty; nonempty aliases remain the variable checker’s responsibility. Auto Layout orientation/wrap require their own direct facts, NO_WRAP and zero counter-axis spacing. Active unsupported values are not silently approximated.

Successful internally computed coverage is paired with the exact canonical record and live raw packet. Unknown fields remain uncovered; mismatches and capture errors remain. The profile changes audit evidence only, never HTML defaults, rendering values or the semantic tree.

The paint profile requires one closed opaque visible SOLID with an independently mapped exact own color; an empty paint array proves absence only without an own color fact. Hidden paint is accepted only inside an independently verified rendered-node image boundary and never becomes an HTML matte. Extra/unknown paints remain unsupported. A flat divider or rendered image with independently mapped sizing/wrap can prove inert NONE layout only with explicit zero padding/spacing and supported axis qualifiers; no general NONE exemption exists.

### Native image Fill paint reference

`image-fill-paint-context` is a closed `{id, kind, structure_proof_id}` authoring reference to one independently verified own element structure and its existing image-fill asset. Source viewport, exact semantic boundary, same-node mapped reference geometry, file ratio and 2x output dimensions must agree with the canonical compatible JPEG/source/display/alpha/clipping/background policies. No copied expected paint values or caller field masks are accepted.

The narrow captured-paint profile requires one complete visible opaque IMAGE Fill, a nonempty actual source hash, FILL mode, identity 2×3 transform, zero rotation and all seven zero filters. Per the [Figma ImagePaint API](https://developers.figma.com/docs/plugins/api/Paint/#imagepaint), scalingFactor applies to TILE only; a finite positive factor under guarded FILL is inactive, not an export scale. Active filters, transforms, other modes, unknown paint fields, absent evidence or conflicting ownership remain unverified.

Coverage closes only the 20 captured paint leaves after exact request-bound identity and independent structure validation. It does not cover axis sizing, node clipping, unknown context, raster resolution, actual crop/output bytes, JPEG quality/sRGB or uncaptured paint properties. A library paint proof does not replace concrete-instance export preflight or claim an exported file is ready. Runtime values, crop/export policy and raw audit diagnostics remain unchanged.

## Onboarding нового компонента

Если в библиотеке появился неизвестный компонент:

1. Определить его semantic role и принадлежность к библиотеке.
2. Прочитать фактическую Mobile- и Desktop-структуру, properties, nested references, bindings и asset boundaries.
3. Сопоставить общие решения с существующими foundations.
4. Создать новую запись только из подтверждённых фактов.
5. Если schema не умеет выразить обязательный факт, остановить onboarding и сначала расширить общую модель без component-specific исключения.
6. Провести impact review и получить разрешение на записи.
7. Проверить schema, cross-references, generated registry и compact Figma projection.
8. Синхронизировать Figma Description отдельной разрешённой MCP-операцией, если этот этап входит в задачу.

Новый компонент нельзя считать готовым к production-использованию, пока обязательные Mobile и Desktop contracts не проходят проверку.

## Потребители

- Library maintenance и component onboarding используют этот стандарт для создания и изменения records.
- Generated documentation использует records как единственный источник component facts.
- Email build получает только выбранные разрешённые contracts компонентов конкретного письма.
- Email build не обязан читать этот authoring standard и не использует Figma Description как источник реализации.

## Native artwork context references

`rendered-artwork-context` references an independently verified owned direct-image element and its existing whole-node PNG @4x export boundary. It requires preserve-artwork clipping, exact-node-after-overrides, preservation of own visible boundary Fill, no artificial matte, and a fresh complete declared source-dependency graph. It reuses narrow image context guards; it does not turn graphic descendants into HTML.

`source-artwork-context` names the other canonical export owner, its element-structure proof and its exact dependency-link ID. Actual same-file ancestry, INSTANCE main-component identity, publication key and both request-bound captures must verify. Source-only role, a name match or numerical coincidence never constitutes proof. The narrow profile admits a complete visible component with positive intrinsic dimensions, inert fixed NONE layout, zero corners, clipping, empty controls/bindings/strokes, no active effects and one opaque visible SOLID paint. Different supported paint is preserved by the actual export, not copied into an HTML color contract.

Intrinsic source dimensions, consumer/display dimensions and scaled export dimensions have different owners and need not equal one another. Source root values are delegated to the verified whole artwork boundary, not asserted as HTML scalar equality. No expected native values or caller field masks are accepted. Unsupported appearance, broken identity/dependency, missing fresh evidence and unknown root fields remain unverified/uncovered. Raw scalar findings and capture diagnostics are retained.
