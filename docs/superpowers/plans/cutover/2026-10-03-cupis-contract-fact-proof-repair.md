# CUPIS: ремонт доказательств fact provenance — implementation plan

Дата: 03.10.2026. Пользователь одобрил спецификацию командой «Делай сразу весь»: выполняем весь этот ремонт без промежуточных запросов, но без merge/P3/cutover. Основание — PR #110@5431e8b61920d3eed6e9d59d6cd23c0932deae6c; main@618d124df0a664c84d23a724ba50ef2b324e9b97.

Спецификация: [contract-fact-proof](../../specs/2026-10-03-cupis-contract-fact-proof-design.md). Родитель: [cutover](../2026-10-01-cupis-final-maintenance-cutover.md). Это только остаток provenance P2; F2, широкая native/binding/visual coverage и F7 не закрываются.

## Границы

Только cloud-authoring PR #110. Temporary transport и exact-SHA execution snapshots не рабочая копия. Без Figma writes, email/images, renderer, skills, routes, PR #109, main и merge. Все rendering values, trees, assets, foundations и compact Description сохраняются. Routine tests/audits — retained GPT-5.6 Terra Medium; без Actions/Checks. Полный gate один раз на финальном code SHA, после targeted RED/GREEN. npm недоступен: разрешён direct Node с проверенными same-lock dependencies; это не npm ci.

## Машинные интерфейсы

Optional evidence_links.fact_proofs и normative_decisions; прежние два массива обязательны. Новые поля closed, IDs уникальны среди всех четырёх массивов. Версия components 2.3.0, existing loaders/schema/envelopes синхронно. Exact contract_path оканчивается /facts/N/value; он адресует один typed value: leaf coverage вычисляется из его собственного type, не маской или caller-list. Atomic provenance contract-proof содержит только kind и proof_id. References сохраняются без provenance; style-usage supplementary сохраняет direct native provenance.

Selector: {component_id, variant_node_id, node_id}, exact own registered variant, полный compound ID. Для каждого kind ровно перечисленные дополнительные поля:

| kind | поля сверх id/kind/contract_path |
| --- | --- |
| source-value-set | sources: selectors[], field: color или dimensions; все canonical source-only variants |
| consumer-geometry | consumer_component_id, asset_contract_id, placements: {mobile:selector,desktop:selector}; полный source→consumer→Compact/dependency chain |
| asset-profile | asset_owner_id, asset_contract_id; только собственный asset либо доказанный consumer chain |
| style-usage | source:selector; unique existing typography ID/name/viewport, native node/runs |
| mobile-image-auto | source:selector, asset_contract_id; Mobile direct-image + existing display policy |
| content-height-cover | card:selector, content:selector, image:selector, asset_contract_id; exact siblings/order/HUG/FILL + policy |
| approved-css-gradient-angle | source:selector, paint_index, decision_id; только typed numeric CSS linear-angle |

Decision: {id,kind:css-linear-gradient-angle,owner_id,targets,authorization}. Target: {viewport,element_id,fact_id,contract_path,value_sha256,context_sha256,source,paint_index}. Authorization: {user_instruction,scope:{owner_id,contract_paths},approved_spec:{path,git_sha}}; действительное согласие пользователя, не вывод из hash/status. SHA256 value = canonical sorted JSON owner/viewport/element/fact/value; context = exact file/variant/node/paint-index/paint + ancestor visibility/opacity. Не хранить дубликаты чисел. Approval reference — утверждённая spec@5431e8b61920d3eed6e9d59d6cd23c0932deae6c.

Pure module scripts/lib/contract-fact-proofs.mjs: validateContractFactProofReferences({records}), auditContractFactProofs({record,model,session}), contractDecisionValueDigest({record,contractPath}), contractDecisionContextDigest({selector,paintIndex,model,session}), applyContractFactProofCoverage({facts,proofs}). Canonical/session/live gates обязательны внутри audit и orchestration. Coverage закрывает только exact UNMAPPED/UNCOVERED gaps успешных proofs; mismatch/identity/capture diagnostics остаются. Empty links не отменяют duties существующего walker.

Capture producer request-bound 1.3.0: owner_identity {node_id,node_type,name} выбранного COMPONENT/SET. Старые 1.2 допустимы прежним checks, не suffix proof. Session 1.1.0 и clock domains неизменны. Model загружает registered assets/typography data+schemas, no new definitions. Effective report рядом с raw facts; combined требует effective facts + evidence_links + nested_artwork + fact_proofs.

## Последовательность и критерии

### 1. RED и typed metadata

- [ ] Записать behavioural tests до production: все seven kinds, stale/absent provenance, own-path/kind/type, duplicate/foreign IDs, sources variants, capture identity/version/hash/receipt/SHA, gradients approval/membership/digests.
- [ ] Terra проверяет RED на точном cloud commit: feature-missing assertions, не setup/import typo.
- [ ] Ввести closed schema/semantic validation, pure module и exact loader/version compatibility. Targeted GREEN.

### 2. Полные proof checks и orchestration

- [ ] Реализовать прямые source pairs, consumer chain (включая Product), asset suffix/ownership, style/run usage, responsive policies/topology, normative decision. Нет branches по CUPIS component ID, wildcard, ignored diagnostics или caller success.
- [ ] Raw audit неизменен; effective coverage только typed successful target/source leaves после provenance change. Source errors не маскируются.
- [ ] In-memory и CLI одинаково fail closed. Negative cases: same value/wrong node, missing Product variant/capture, incomplete mixed runs, unrelated policy, swapped siblings, native FIXED→auto alone, altered angle/context.

### 3. Свежая Figma и canonical metadata

- [ ] Read-only MCP producer текущего SHA для 8 владельцев: ordinary/compact/product logos, Header, Hero, Secondary, Primary, Contact. Сохранять receipts/challenges/bytes. Не исправлять packets post-call.
- [ ] Allowlist только evidence_links новых kinds и provenance точных 18 leaves плюс шести style-ID supplementary proofs. Ordinary source 322×50 не Mobile consumer212×33; размеры не переписывать.
- [ ] Normative decision25° только два existing Primary targets, согласно «По кнопке: делай 25 градусов точным значением» и одобрению этой spec. Digests из действительного native read, не Description.
- [ ] Core: границы proof ownership, generated doc provenance renderer + механическая генерация; никаких HTML правил/новых таблиц чисел.
- [ ] Автоматически сравнить rendering projection/HTML/export/Description, facts values/trees и unrelated records с базой5431. Expected byte-identical design/runtime projections.

### 4. Итоговая проверка и handoff

- [ ] Targeted tests всех зависимостей, validator, generate:check; independent whole-repair review. Critical/Important — одна исправляющая RED/GREEN pass.
- [ ] Fresh final-SHA session и exact accounting18 leaves/6 usage; все не покрытые duties/diagnostics явно остаются, не объявлять combined P2 acceptance.
- [ ] Full local suite на финальном product commit и raw blob integrity; записать фактические receipts/SHA/results. Docs-only status commit проверять отдельно и не приписывать ему прошлый full gate.
- [ ] Обновить эту checklist, родительский журнал, roadmap и PR body/status; manual active-work-context не трогать. PR draft/open, merge и следующий пакет не запускать.

## Dependency review

Schema→pure checker: общие closed поля и exact target types. Capture→freshness/model: 1.3 содержит owner_identity, 1.2 не повышается. Model→proof: одни registered sources; ownership chain не новый reverse dependency graph (cycles прежнего source_dependencies остаются). Proof→orchestrator: только verified exact coverage, независимо от raw ok. Provenance→docs/bundle: human-readable category; excluded design-time metadata не меняет HTML. Canonical metadata→final session: новый SHA требует новых receipts.

## Review focus

Злоупотребление optional arrays, чужой canonical object/session, одинаковые numbers у другого owner, пробелы полного variant-set, references без scoped ownership, ложная native CSS-angle proof, partial mixed runs, неполный ancestor/paint context; старые diagnostics должны оставаться. Проверять projection equality, не только зелёные new tests.
