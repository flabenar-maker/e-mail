# CUPIS: ремонт доказательств fact provenance — implementation plan

**Актуальный статус10.10.2026:** этот адресный P2-план выполнен, принят и слит PR #110/main e44c726175ca3b93c3a41b43d75424d060bf6390. Ниже сохранена историческая последовательность с собственными pins; она не является командой повторить работу. Текущий P3 реализован в кандидате и проходит итоговую проверку — [draft PR #112](https://github.com/flabenar-maker/e-mail/pull/112), порядок — [cutover plan](../2026-10-01-cupis-final-maintenance-cutover.md#p3-current-2026-10-10).

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

- [x] 27 behavioural tests закрывают семь kinds, source/consumer/asset/style/policy/decision ownership и fail-closed coverage. Отклонение от первоначального порядка: до первого production был clean минимальный API RED; широкий набор был исправлен и выполнен позднее. Отдельные native letter-spacing, forged proof и raw/proof pairing обходы воспроизведены RED до соответствующих hardening fixes; нельзя утверждать, что все семь kinds прошли RED до первой реализации.
- [x] Terra проверяет RED на точном cloud commit: feature-missing assertions, не setup/import typo.
- [x] Ввести closed schema/semantic validation, pure module и exact loader/version compatibility. Targeted GREEN.

### 2. Полные proof checks и orchestration

- [x] Реализовать прямые source pairs, consumer chain (включая Product), asset suffix/ownership, style/run usage, responsive policies/topology, normative decision. Нет branches по CUPIS component ID, wildcard, ignored diagnostics или caller success.
- [x] Raw diagnostics сохраняются; authentic raw/proof pairing обязателен. Effective coverage только typed successful target/source leaves после provenance change. Source errors не маскируются.
- [x] In-memory и CLI одинаково fail closed. Negative cases: same value/wrong node, missing Product variant/capture, incomplete mixed runs, unrelated policy, swapped siblings, native FIXED→auto alone, altered angle/context.

### 3. Свежая Figma и canonical metadata

- [x] Read-only MCP producer текущего SHA для 8 владельцев: ordinary/compact/product logos, Header, Hero, Secondary, Primary, Contact. Сохранять receipts/challenges/bytes. Не исправлять packets post-call.
- [x] Metadata ограничены шестью owners: 18 proof definitions, включая шесть supplementary style-usage с сохранением native provenance; один decision содержит два Primary targets. 11 facts получили contract-proof provenance; asset-reference остаётся validator-exempt. Все прежние 18 unmapped leaves закрыты на свежей сверке. Ordinary source322×50 и Mobile consumer212×33 сохранены, не приравнены.
- [x] Normative decision25° только два existing Primary targets, согласно «По кнопке: делай 25 градусов точным значением» и одобрению этой spec. Digests из действительного native read, не Description.
- [x] Core: границы proof ownership, generated doc provenance renderer + механическая генерация; никаких HTML правил/новых таблиц чисел.
- [x] Автоматически сравнить rendering projection/HTML/export/Description, facts values/trees и unrelated records с базой5431. Expected byte-identical design/runtime projections.

### 4. Итоговая проверка и handoff

- [x] Targeted tests всех зависимостей, validator, generate:check; independent whole-repair review. Critical/Important — одна исправляющая RED/GREEN pass.
- [x] Fresh final-SHA session и exact accounting18 leaves/6 usage; все не покрытые duties/diagnostics явно остаются, не объявлять combined P2 acceptance.
- [x] Full local suite на финальном product commit и raw blob integrity; записать фактические receipts/SHA/results. Docs-only status commit проверять отдельно и не приписывать ему прошлый full gate.
- [x] Обновить эту checklist, родительский журнал, roadmap и PR body/status; manual active-work-context не трогать. PR draft/open, merge и следующий пакет не запускать.

## Dependency review

Schema→pure checker: общие closed поля и exact target types. Capture→freshness/model: 1.3 содержит owner_identity, 1.2 не повышается. Model→proof: одни registered sources; ownership chain не новый reverse dependency graph (cycles прежнего source_dependencies остаются). Proof→orchestrator: только verified exact coverage, независимо от raw ok. Provenance→docs/bundle: human-readable category; excluded design-time metadata не меняет HTML. Canonical metadata→final session: новый SHA требует новых receipts.

## Review focus

Злоупотребление optional arrays, чужой canonical object/session, одинаковые numbers у другого owner, пробелы полного variant-set, references без scoped ownership, ложная native CSS-angle proof, partial mixed runs, неполный ancestor/paint context; старые diagnostics должны оставаться. Проверять projection equality, не только зелёные new tests.

## Итог 03.10.2026 — bounded repair, не приёмка P2

Bounded fact-proof repair завершён в кандидате PR #110, не в main и не как приёмка всего P2.

Финальный product SHA `997077f0a3182653dbcf71ab861d84aacfeae357`, tree `c271a6636793aeaf95a15fe4c25189fc24efdd87`. Closed schema2.3, request-bound capture1.3, existing session1.1; pure proof checker, raw/effective/orchestration, loader assets+typography, generated provenance/dependencies и Core синхронизированы. Нет component-ID exceptions, caller success/coverage mask или подмены rendering facts.

Read-only MCP на этом SHA: 03.10.2026 14:57:30.691–14:59:08.592 UTC, 8/8 packets приняты с новыми challenges и проверенными bytes/hashes. 18/18 definitions verified; raw unmapped18→0, raw/effective issues1765→1718, uncovered1743→1714. Native style usage6/6 и обе approved Primary gradient/value/context связи подтверждены. Numeric/missing-path/identity mismatches0. Capture/evidence errors34, unsupported1, links-not-contract3 и scope-unsupported2 остаются; combined acceptancefalse у всех восьми owners. CLIPrimary JSON равен in-memory, exit1 по сохранённому combinedfalse — ожидаемо, не test failure.

Сохранность:62/62 records, values/typed trees/assets/variants/properties/compact Descriptions прежние; только6evidence owners и envelopes2.3. Все foundations/renderer/routes/skills/workflows/export защищены. Контрольная Header/PersonalData/Receipt сборка: projection, HTML, asset plan/assets byte-identical. Generated registries обновлены механически, naming output неизменен.

Independent whole-repair review: один Important raw/proof pairing обход исправлен с genuine RED→GREEN; других Critical/Important/Minor нет. Review не заменяет локальные результаты, actual MCP read или fullP2/visual acceptance. Исторические невалидные fixtures, старый GitHEAD в temporary snapshots и session-start с7fractionaldigits не засчитаны как финальная проверка; raw evidence сохранено, не переписано.

Следующая граница — оставшиеся F2 reference widths, required native/binding/visual evidence и F7. PR #110 остаётся draft/open. P3, #109, activation, production cutover и merge не начинались; отдельного разрешения на них нет.

## Фактические итоговые проверки

Exact-product local gate `997077f0a3182653dbcf71ab861d84aacfeae357` / tree `c271a6636793aeaf95a15fe4c25189fc24efdd87`: targeted шесть файлов exit0,82.998s; `node scripts/validate-system.mjs` и `node scripts/generate-docs.mjs --check` оба exit0, общий29.325s; full package test selection с output-only `--test-reporter=tap` —1075/1075 PASS,fail/cancelled/skipped/todo0,439.5883831s. HEAD/tree/index exact,249/249 raw blobs до/после без изменений. Полный gate не Actions/PR Checks. Windows/bootstrap gates7cf сохранены как history/source-identical, не выданы за новый997 rerun.

Compact receipts SHA256: full `4166a495b0712af483071674976b93cf7a649e9fd78a43a3360d039690b3656b`; targeted `3b8c50ec37066def0de7d4be59f668adefcf3b19b959cff767940302c6f32de4`; validator/generate `6ab29b9a9bc18c81997b8dbaf4e6fcc71e9d1c458f966fe5cbf3d7ac9e15368d`; fresh final audit `8b5020367280bdefa6d8919dfc5a1e91c5f5414a0457540d5dbd7e7578d91d61`. Сырой TAP footer подтверждает1075tests/pass (top-level plan1063 включает nestedcases); счётчик1077 spec result-lines предыдущего failed7cf не используется как количество тестов. Post-run PowerShell counter wrapper ошибся после завершения Node; финальный receipt восстановлен по completed TAP footer без нового прогона.

Исторический full7cf exit1 показал14 failing blocks. Пять минимальных test-only fixes опубликованы в997: valid fixture schema2.3, request capture1.3, generated expected2.3; bundle fixture сохраняет обязательные fact_proofs/normative_decisions, удаляет лишь другие evidence arrays. CONTRACT_PROOF_REFERENCE_MISSING был правильным blocker, маршруты/проверки не ослаблены. Ни canonical values, ни runtime code этим исправлением не менялись.

Последующий docs-only status commit проверяется отдельно; его exact SHA и actual local results записываются в PR body. Прошлый full gate не приписывается status commit; raw997 Figma packets не repin на него.

Сохранность по `preservation-122819-receipt.json` SHA256 `F6E30B6CF53B5B7954C5E79A477F58225595F9363C0E1379A5E639F867886659`:62/62 records, values/typed trees/assets/variants/properties/compact Description прежние. Последующие7cf/997 изменения только тестовые. Header/PersonalData/Receipt projection/HTML/assets byte-equal. Дополнительный7cf changed-owner comparison: Contact/Primary HTML/CSS equal; Hero/Secondary projections/export equal, но их HTML честно unknown из-за missing required fixture inputs на обеих сторонах. Это не visual regression acceptance.

Fresh final9978/8: сначала host receipt без обязательного packet_sha256 закономерно был blocked до чтения packets. Исходный неполный host session сохранён; добавлены только SHA256 уже сохранённых raw bytes. Ни один packet, timestamp, challenge, canonical SHA или Figma fact не изменён. Повторное admission той же genuine session прошло8/8. Session SHA256 `64487a6bc680b77d29b98b216fcafe07d15cdccdcff37b4fcafa7840458aeff2`; actual host UTC03.10.2026 14:57:30.691–14:59:08.592. Saved packets:

| component ID | SHA256 packet bytes |
| --- | --- |
| asset-header-logo-4x | 422e056f2aef6ecd3d60f914b61b77ab7ca0896cd8044ffabb7a73146eb67eb5 |
| asset-header-logo-compact-4x | c3d6649defb1d5723822d2331b73c39a40c33c5f23964e841b667210ed6c4a55 |
| asset-product-logo | 5f104874746b60f5f28eb7c2324105272e803c086727f80c54aed1942fef1835 |
| email-header | 7b2a9ac602aece5ccac2a4dfbb29cdf3e9ca9205e84f020851bb7f13d77157a8 |
| banner-hero | 0b96b1c09a866551fdc08ae6555935109cd14a190badd9cd153467dfd81d5aa8 |
| banner-secondary | 2e69fcfb536078d3f3c1723190666493eb024c7843097f36b7e0484ac9899a5c |
| button-primary | c02b224a4d77a78cd21df011a8f949277c452dd2986237d5019ef49ca48a6b35 |
| block-contact-support | 53b763542cf81743c6915ecc968437e2101d5b2b17a50ff855e54cb5a46d7c71 |

Сырые compressed responses/packets и compact execution receipts временно сохранены вне рабочей папки/репозитория: `C:/Users/flabe/AppData/Local/Temp/cupis-p2-rolemap-20261002/`. Это evidence транспорта, не второй реестр фактов. Повторная сверка должна получать новый genuine request-bound capture, а не переписывать эти fingerprints.

## Решения и отклонения процедуры

- Cloud-only authoring имеет приоритет над local-worktree workflow: только cloud blobs/commits и temporary transports/exact verification snapshots. Стоимость — дополнительные publications/materializations; source fallback не разрешён.
- Новые spawn требуемой модели недоступны: использованы retained GPT-5.6 Terra Medium, без подмены; ограничение — нет нового параллельного implementer. npm недоступен: direct Node24.19 с verified same-lock dependencies, не npm ci.
- Source-value-set квалифицируется ролью Shared asset/icon и полным non-Viewport source variant-set, не HTML render_mode; ordinary logo presentation-tree не менялся. При неверной квалификации потребовалось бы сузить metadata, а не менять рендер.
- Узкий verified proof закрывает только свои exact leaves. Unrelated capture/layout/binding diagnostics остаются и combinedfalse; стоимость — остальная приёмка P2 всё ещё впереди, но не скрыта.
- Module-probe snapshots со старым GitHEAD не засчитаны как exact-repository gates. Фактические cloud Git objects/tree/index/raw blobs восстановлены механически; цена — повторная изолированная materialization. Историческая122819 session с7 fractional timestamp digits не принята и не retimestamped; новые genuine reads выполнены на7cf, затем997.
- Широкие27 tests были выполнены после первой реализации; полный preproduction RED для всех семи kinds не заявляется. Минимальный API RED и три реальных hardening RED→GREEN подтверждены отдельно. Все27 входят в1075 финального suite.
- Final review не доказывает external execution, actual MCP authenticity, полный P2, visual acceptance или merge. Они отделены: реальные capture/execution receipts получены; остальные обязанности не закрывались. Ошибка pairing исправлена за одну genuine RED→GREEN pass; повторного reviewer вместо tests нет. Deferred minors отсутствуют.
- Missing Node footer/exit раннего запуска не засчитан; actual7cf failure сохранён, не назван успехом. Final997 TAP меняет только output, не test selection. Отдельная ошибка post-run wrapper не меняет законченный Node result; receipt восстановлен по footer, без слепого rerun.

## Следующая граница

Согласованный дочерний repair выполнен и отражён в родительском плане/roadmap. В последующем отдельно разрешённом F2 follow-up четыре reference widths исправлены и fresh-verified на894; его факты/проверки — в текущей точке родительского плана, не часть прежнего preservation claim этого repair. Required native/binding/visual evidence и F7 остаются в P2; overall P2 не принят. Нет merge, P3, #109, activation, cutover, Figma writes или изменений email/images/skills. PR #110 draft/open. Docs-only publication не разрешает эти действия.

## Текущий итог после слияния P2 — 10.10.2026

Работа этого адресного P2-плана включена в слитый PR #110/main e44c726175ca3b93c3a41b43d75424d060bf6390. Собственные historical receipts/точные SHA/ограничения выше сохранены; старые «кандидат/не слит» не являются актуальной командой продолжения. P2 принят; повторять его закрытые scopes нельзя. Текущий P3 и дальнейшие зависимости задаёт [единый cutover plan](../2026-10-01-cupis-final-maintenance-cutover.md#p3-current-2026-10-10), глобальную очередь — [roadmap](../2026-08-25-cupis-migration-roadmap.md).
