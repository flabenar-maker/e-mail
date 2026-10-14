# Email System Remediation Implementation Plan

## Актуальный итог — шаги 1–11 выполнены и приняты

Пакет реализации объединён в [PR #134](https://github.com/flabenar-maker/e-mail/pull/134). Самостоятельные планы #128, #130, #131 и общий план #133 включены в этот пакет; пояснения из #129 согласованы с действующими инструкциями. Сохраняются изменения экспорта из #137: итоговый `email.html` и каталог `images/`.

| Шаг | Выполненная работа | Принятая runtime/test версия |
| --- | --- | --- |
| 1 | Перебазирование путей ресурсов | `c0808e1e` |
| 2 | Физическая привязка корневого слота | `9d1a19c8` |
| 3 | Глобальная уникальность экземпляров | `81052bdc` |
| 4 | Проверка наличия identity | `5b557800` |
| 5 | Источник → кандидат → независимое ревью → выпуск | `e306f000` |
| 6 | Публикация проверенных bytes изображений | `5dbbaec6` |
| 7 | Совместимое обновление fast-uri | `373934ba` |
| 8 | Контекст вариантов и понятные пояснения | `1e5e49be` |
| 9 | Выравнивание, значимые пробелы и Hug | `74857314` |
| 10 | Компактная форма ссылок | `b766c52f639d45a3e098a00cfce2b80a3131673c` |
| 11 | Область клика NPS | `aac08e53d7937356f9b35c6f1358a951e01616f9` |

Шаг 12 отложен для отдельного будущего анализа E17. Изменения runtime по нему не выполнены, приёмка не заявляется. Перед продолжением требуется правильное сопоставление адаптивного TEXT-контейнера Figma с контейнером текста в HTML: ширина текстового слоя не является шириной вложенной ссылки. Предположение о дефекте Fill на основании такого сравнения отозвано. Произвольная компенсация высоты, отступов и дробных размеров не допускается.

Основной отчёт: [результат реализации](2026-10-13-email-system-remediation-progress.md). Свежая проверка интеграции фиксируется в описании PR #134 с точным SHA; прежние результаты относятся к своим исходным версиям. Внешняя почтовая приёмка остаётся `not-run`.

## Архив утверждённого плана шагов 1–11

Первоначальные подробности ниже отражают выполненный план; текущие результаты и ограничения приведены в итоговом отчёте.

### Task 1: R1 — serialized package resource paths

**Files:** Modify `scripts/lib/email-resource-references.mjs`; Test `tests/rendering/email-resource-references.test.mjs`, `email-primitives.test.mjs`, `email-html-serializer.test.mjs`, `email-altcraft-package.test.mjs` (все под `tests/rendering/`). Serializer менять только если offset probe доказывает его дефект.
**Interfaces:** Preserve `collectResourceReferences({html})` offsets и `rebasePackageResources({html,assetPaths,htmlEntry,assetRootEntry}) -> {html,references,diagnostics}`. Private proposed `decodeCssResourceValue(raw: string): string`; HTML entities распознаются в CSS wrapper без потери offsets.
**Acceptance:** Каждый объявленный ресурс serialized HTML разрешается к exact entry `images/...` из `email/html.html`; href actions и opaque service fragments сохраняются.

- [x] Add red cases `serialized css entity quotes rebase into ZIP`, `CSS VML background share declared resource`, `unsafe encoded css resource fails closed`: литералы `url(&quot;images/card.png&quot;)`, `url(&#39;images/bg.png&#39;)`, `url(&#x27;images/bg.png&#x27;)`, HTML background и CSS/VML; expected relative resource `../images/card.png`, ZIP содержит exact image bytes.
- [x] Delegate `node --test tests/rendering/email-resource-references.test.mjs tests/rendering/email-altcraft-package.test.mjs`; новые valid-path assertions FAIL на текущем collector. Отрицательные remote/data/absolute/traversal/case/undeclared cases остаются blocked; encoded action href unchanged.
- [x] Implement bounded collector decoding с заменой только span ресурса; не делать глобальный HTML unescape/regex replacement. Сохранить entity/percent representation там, где она нужна serializer.
- [x] Delegate green command плюс primitive/serializer suites; unpack synthetic ZIP и проверить разрешение всех ссылок resources. Проверка реального клиента не заявляется.
- [x] Apply Gate F; отдельный commit `fix: rebase serialized CSS package resources`.

### Task 2: #130/E13 — physical root-slot projection

**Files:** Modify `scripts/lib/email-source-visibility.mjs`; Test `tests/rendering/email-instance-visibility.test.mjs`, `tests/skills/email-source-fidelity.test.mjs`, `email-source-cli.test.mjs`, `email-build-handoff.test.mjs` (последние три в `tests/skills/`).
**Interfaces:** Preserve `verifyEmailModelSource({model,readings,correspondence,resolvedContracts,selectedTest,authorizedInputs=[],assetEvidence=[]}) -> diagnostics[]`; proposed private `projectInstanceDescendantNodeId(ownerNodeId,nativeNodeId): string|null` используется обеими branches `expectedNode()`.
**Prerequisite:** Принят spec #130; для private concrete-email replay отдельно разрешены неизменённые локальные inputs. Synthetic graph достаточен для первой red/green проверки.

- [x] Add red literals Mobile `I2021:4164;1103:7`, Desktop `I2021:4163;1103:8`; root stays `2021:4164`; nested owner `I2021:4164;1103:7;1104:1` + native `I1200:1;1200:2` gives full chain с одним начальным I.
- [x] Delegate `node --test tests/rendering/email-instance-visibility.test.mjs tests/skills/email-source-cli.test.mjs tests/skills/email-build-handoff.test.mjs`; physical valid graph FAIL до изменения. Wrong owner/viewport/order/ancestry/hidden/unregistered slot evidence остаются diagnostics.
- [x] Implement exact native/owner composition по существующему projectedNodeId convention; invalid inputs return null. Не переименовывать captured nodes и не принимать synthetic fallback в production.
- [x] Delegate green плюс source-fidelity; production CLI без selected-test проходит valid full-email graph, foreign slot блокирует renderer. Исторические 26 errors не выдавать за свежий replay без фактического прогона.
- [x] Apply Gate F; `fix: project physical email root-slot IDs`.

### Task 3: R3 — identity до bare-ID индексов

**Files:** Modify `scripts/lib/email-model.mjs`; Inspect `scripts/lib/email-renderer.mjs`, `email-source-fidelity.mjs`, `email-source-visibility.mjs`, `email-action-inventory.mjs`; conditional Modify только точного direct public entrypoint, если тест доказывает обход semantic guard или прежнего equivalent rejection; Test `tests/rendering/email-model.test.mjs`, `email-interpreter.test.mjs`, `email-action-inventory.test.mjs`, `tests/skills/email-source-fidelity.test.mjs`, `email-source-cli.test.mjs`, `email-build-handoff.test.mjs` (последние три в `tests/skills/`).
**Interfaces:** Preserve `validateEmailModelSemantics(model,dependencies,options={})`; proposed shared export `validateEmailInstanceIdentities(model) -> diagnostics` даёт `EMAIL_MODEL_INSTANCE_DUPLICATE` с обеими JSON locations, вызывается semantic validator до viewport visibility и Map creation. Inventory уже вызывает semantic validation до indexDeliveryInstances, поэтому получает guard без дублирующей правки. Production source verifier уже использует uniqueIndex по bare instance_id и блокирует duplicate; сохранять существующий диагностический контракт, менять source только при доказанной недостаточности. Shared export повторно используется direct renderer entrypoint лишь при установленном обходе guard.
**Rationale:** Existing assembly standard уже требует unique bare ID. Distinct parent paths не защищают current `byId`/mappedInstances Maps. Path guard delivery остаётся дополнительной защитой; формат IDs не меняется.

- [x] Add red `duplicate sibling never overwrites first`, `duplicate across slots nested hidden blocked`: одинаковые bare IDs у root/descendant, разных родителей/slots/nested, hidden vs visible дают diagnostic; HTML/ZIP/intake не создаются.
- [x] Delegate `node --test tests/rendering/email-model.test.mjs tests/rendering/email-action-inventory.test.mjs tests/skills/email-build-handoff.test.mjs`; новые direct semantic/render cases FAIL по отсутствующему early diagnostic; existing source global duplicate rejection и delivery path rejection должны уже PASS. Не заявлять отсутствующую production source защиту.
- [x] Implement one tree traversal root → slots → nested, до фильтрации visibility; valid normalized IDs сохранять, не генерировать новые IDs и не менять public schema.
- [x] Delegate green; positive unique descendants сохраняют оба markers, shared Mobile/Desktop logical instance проходит один раз; output exact order/URL assets unchanged. Все public paths достигают guard.
- [x] Apply Gate F; `fix: reject duplicate logical instance identities`.

### Task 4: R5 — identity presence перед equality

**Files:** Modify `scripts/lib/email-build-orchestration.mjs`; Test `tests/skills/email-build-orchestration.test.mjs`, `email-build-handoff.test.mjs`; Inspect `data/workflows/email-build.yaml` (существующее relation definition, менять только при доказанной необходимости).
**Interfaces:** Preserve `resolveEmailBuildRequest({workflow,inputs}) -> {mode,blocker,allowedOutputs}`; relationBlocker сначала проверяет `hasValue` каждого `inputs[id][relation.field]`, затем ordered/equality relation. Внутренний Task 5 adapter `emailId -> email_id`, без глобального rename.
**Prerequisite:** Нет source dependency; сериализовать orchestration edits с Task 5.

- [x] Add red `both same-field identities absent block`, `one absent identity blocks`, `blank null undefined identities block`, `different valid emailId blocks`; assert blocker equals declared relation blocker, outputs `[]`.
- [x] Delegate `node --test tests/skills/email-build-orchestration.test.mjs`; absent pair currently проходит, red должен фиксировать именно это.
- [x] Implement presence check только relation fields; сохранить mode selection, configured blocker и ordered-field behavior. Не заставлять несвязанные optional inputs становиться required.
- [x] Delegate green plus handoff; matching nonblank emailId и correct ordered Mobile/Desktop проходят, no-output на mismatches, valid new-build/text/link-only regressions сохраняются.
- [x] Apply Gate F; `fix: require workflow identity values before comparison`.

### Task 5: R2 — source → candidate → review → release

**Files:** Modify `scripts/lib/email-build-orchestration.mjs`, `scripts/render-email.mjs`; reuse `scripts/verify-email-source.mjs`, `scripts/verify-real-email-visual.mjs`, `scripts/lib/email-output.mjs`; Test `tests/skills/email-build-handoff.test.mjs`, `email-source-delivery.test.mjs`, `verification-runner.test.mjs`, `tests/rendering/email-delivery-link-only.test.mjs`, `email-preview.test.mjs`.
**Prerequisites:** Tasks 2/3/4; refreshed main и source fixture с physical root IDs. R1 уже завершён перед shared release edits.
**Proposed interfaces:** Add trusted `selectedSourceBinding` к `executeEmailBuildHandoff`, REQUIRED и validated для protected `new-build`/`continue-fix-design` modes; absent/null/blank/invalid binding блокирует до candidate. В других modes optional только по действующим границам technical/text/link-only. Shape: `{email_id:string,file_key:string,roots:{mobile:string,desktop:string},source_sha:string,model_digest:string}`. Binding поступает от coordinator-selected current source, а не из continueFixEvidence. `model_digest` — SHA-256 exact persisted final normalized model UTF-8 bytes, после current delivery projection/масок.
**Proposed callback:** `candidateReviewer({candidateDir,selectedSourceBinding,sourceComparisonRef}) -> Promise<VisualVerificationContext>`; context имеет existing `{inputRefs,referenceRoot,inputRoots,identity,reviewQualification}` для `verifyRealEmailVisual`. Existing `rendererRunner({repoRoot,modelPath,outputDir,deliveryPath,sourceSha})` signature сохраняется; его outputDir для protected workflow — isolated candidateDir, не final outputDir.
**Owned boundary:** Orchestrator фиксирует final normalized model bytes один раз; production source verification проверяет эту же модель, current roots/email/file/system SHA и actual applied scoped change, а не unrelated passed object. Renderer использует ту же подготовку current URL projection и не нормализует иной результат молча. Candidate entries читаются/хешируются до review и после сверяются; финальная публикация `publishFileSetAtomically({outputDir,entries})` использует frozen checked buffers, без повторного render.

- [x] Add red source cases: absent/null/blank/invalid selectedSourceBinding; pair internally equal but other email/file/root/SHA; changed final model digest; selected-subtree/selected-test; scoped change absent from comparison; continue-fix skips source. Assert no candidate, no final folder, meaningful existing blocker.
- [x] Add red release cases: bare `passed/reference_id/render_id`; missing receipt; same executor/reviewer; wrong selected model/effort; missing reviewed images/category; edited candidate/model/asset after review. Assert final folder absent, no publication; review cannot be supplied before candidate.
- [x] Delegate `node --test tests/skills/email-build-handoff.test.mjs tests/skills/email-source-delivery.test.mjs tests/skills/verification-runner.test.mjs`; prove separate missing binding/source/release guards on actual handoff.
- [x] Implement minimal selected binding adapter, reusable production source gate for new-build and design change before candidate. Replace continueFix arbitrary visual IDs with strict post-candidate helper; preserve technical/text/link-only routes and current masks/URL projection. Не требовать новый дизайн-review для чистого изменения URL/text, когда действующий workflow его не требует.
- [x] Bind existing visual receipt `identity.source_sha/artifact_digest` к selected SHA и candidate manifest digest; model inventory digest к exact normalized bytes; reference/render inventories ко всем Mobile/Desktop images. Qualified actual independent reviewer examines six categories, callback itself не доказательство acceptance.
- [x] Delegate green source/release suites plus delivery-link-only/preview. Positive complete current source → candidate → strict independent accepted review publishes byte-identical HTML/ZIP/assets; unchanged valid new-build and technical/text/link-only остаются supported.
- [x] Delegate actual synthetic candidate/render/reference visual comparison отдельному агенту; private concrete-email proof только отдельно разрешёнными inputs. Apply Gate F; `fix: bind current email evidence to reviewed release bytes`.

### Task 6: R6 — общий loader проверенных bytes

**Files:** Create `scripts/lib/email-asset-bytes.mjs`; Modify `scripts/render-email.mjs`, `scripts/render-email-preview.mjs`, `scripts/lib/email-output.mjs`; integrate containment reuse in `email-build-orchestration.mjs` only where повторное чтение требуется; Test `tests/rendering/email-output.test.mjs`, `email-altcraft-package.test.mjs`, `email-preview.test.mjs`, `tests/skills/email-build-handoff.test.mjs`.
**Proposed interfaces:** `readContainedAssetBytes({assetRoot,assets}) -> Promise<Array<{path:string,bytes:Buffer}>>`; normalized `images/...`, physical root/target containment, regular files, target case/collision checks. `publishEmailAtomically({outputDir,html,assets,assetRoot})` сохраняет existing asset descriptors, читает их через helper и пишет checked bytes; CLI передаёт modelFolder как trusted assetRoot. Все существующие file-backed callers и их tests передают trusted root явно; missing-root file-backed call fail closed. При нуле assets вызов без root сохраняется. Никогда не выводить root из sourcePath. ZIP использует тот же helper.
**Prerequisite:** Serialize shared render/output with Tasks 1/5. Existing contract PNG geometry/alpha/hash rules не заменяются loader и не ослабляются.

- [x] Add red direct CLI ZIP и folder cases: symlink/junction file or directory outside assetRoot, wrong type, missing trusted root для file-backed call, traversal/absolute/case collision, source changed between check/publication. Assert failure и no final output.
- [x] Delegate `node --test tests/rendering/email-output.test.mjs tests/rendering/email-altcraft-package.test.mjs tests/rendering/email-preview.test.mjs`; escape must fail on actual entrypoints, not helper-only simulation. Platform inability create junction записать limit, не PASS.
- [x] Implement bounded one-read buffers; resolve physical containment до read, validate file identity around read where available, reject target changes; publish frozen validated buffers instead of stat→copy/re-read. No new arbitrary size limits/profile rewrite.
- [x] Delegate green plus handoff; zero-assets без root, normal in-root files/nested images and допустимый in-root link проходят одинаково; mutation after successful read either rejected or checked original buffers publish, никогда replacement bytes.
- [x] Apply Gate F; `fix: publish physically contained checked asset bytes`.

### Task 7: R4 — compatible fast-uri maintenance

**Files:** Modify `package-lock.json`; `package.json` only если targeted supported override нужен; Test existing `tests/foundation/schema-validation.test.mjs`, `validator-cli.test.mjs`, `tests/skills/skill-context.test.mjs`.
**Interfaces:** Ajv public behavior и renderer APIs unchanged; resolved fast-uri `>=3.1.8 <4`, integrity согласован с lock. Advisory источник/affected range перепроверить перед actual update, текущий аудит не выдумывать.

- [x] Зафиксировать failing baseline по exact lock/advisory inspection: resolved fast-uri `3.1.6` попадает в affected ranges двух primary GHSA; новый version-only unit test не создавать. Сохранить существующие behavioral schema/URI valid и invalid examples (relative/absolute/ref/escaped cases).
- [x] Delegate targeted schema/validator suites и fresh lock inspection; record affected dependency path, без reliance on Actions. Fresh audit outcome отдельно от version check.
- [x] Update targeted lock resolution в compatible 3.x; no broad dependency refresh, unrelated lock entries preserved.
- [x] Delegate green targeted suites, fresh advisory check; если network advisory unavailable, отметить limitation вместо clean verdict. Apply Gate F.
- [x] Independent reviewer checks minimal lock diff, resolved version/integrity and Ajv behavior; commit `fix: update fast-uri within compatible major`.

### Task 8: #132/E04/E05 — compact runtime variants/naming

**Files:** Modify `scripts/lib/context-bundle.mjs`, `scripts/lib/email-interpreter.mjs`, `core/email-model-assembly-standard.md`; Inspect `scripts/lib/component-registry.mjs`, conditional Modify только при доказанной необходимости за пределами private runtime collector; Test `tests/generation/context-bundle.test.mjs`, `context-bundle-cli.test.mjs`, `evidence-metadata-bundle.test.mjs`, `tests/rendering/renderer-contract-semantics.test.mjs`, `tests/skills/email-build-handoff.test.mjs`.
**Interfaces:** Preserve context bundle public shape and `selectVariantRoot(component,viewport,variantAxes={})`; compact contracts retain variant roots plus minimal base runtime identity/selector. Proposed private `collectRuntimeComponentReferences(component,viewport)` в context-bundle используется recursive/projected/foundation/closure путями, обходит все runtime roots только выбранного viewport и исключает metadata keys; common registry collector не менять без доказанной необходимости. Invalid selector emits diagnostic rather than base fallback.
**Prerequisite:** #132 spec accepted; synthetic fixtures independent of #130. Interpreter serialized before Task 9/11.

- [x] Add red compact NPS Count=2/3/999 in both viewports; Count=2 excludes neutral; Count=3 includes neutral; 999 blocked; variant-only nested asset/foundation dependency present. Evidence/provenance bulk remains absent.
- [x] Delegate `node --test tests/generation/context-bundle.test.mjs tests/generation/context-bundle-cli.test.mjs tests/generation/evidence-metadata-bundle.test.mjs tests/rendering/renderer-contract-semantics.test.mjs`; new compact cases FAIL on silent base fallback/closure.
- [x] Implement minimum runtime variant selector/private closure в context-bundle, single-viewport filtering и metadata-key exclusion; no restoration всех design-time graphs или unconditional common registry rewrite. E05 instruction mirrors existing suffix/profile basename rules; guards unchanged.
- [x] Delegate green plus handoff; full and compact inputs select equivalent runtime trees, irrelevant contracts excluded, naming matches current export profile.
- [x] Apply Gate F; `fix: preserve compact runtime variant selection`.

### Task 9: #132/E14/E15 — serialized alignment/whitespace/hug

**Files:** Modify `scripts/lib/email-interpreter.mjs`; Test `tests/rendering/pilot-email-fidelity-feedback.test.mjs`, `pilot-fidelity-regressions.test.mjs`, `renderer-contract-semantics.test.mjs`, `html-invariants.test.mjs`.
**Interfaces:** Existing interpreter/propsFromFacts/whole-button paths; choose alignment by child render-mode/layout and actual wrapper, не first HTML character. Significant single-line hug label uses local whitespace style; width_and_height не ограничивается reference max-width.
**Prerequisite:** Task 8; serial CTA correction before NPS and residual geometry measurements.

- [x] Add red leading comment/conditional marker before nested CTA; presentation table centered with comments retained. «2  шаг»/«3  шаг» preserve two spaces in both viewports; single-space/body paragraphs wrap normally. Long hug beyond reference width expands; fixed/fill unchanged.
- [x] Delegate `node --test tests/rendering/pilot-email-fidelity-feedback.test.mjs tests/rendering/pilot-fidelity-regressions.test.mjs tests/rendering/html-invariants.test.mjs`; red asserts actual final serialized output/DOM geometry, не internal helper flag.
- [x] Implement structural wrapper selection/local white-space/width fact projection; no global table rewriting, arbitrary padding, marker removal or body pre formatting. Long hug is separate proven case, не причина исходных коротких labels.
- [x] Delegate green plus renderer-contract suite and visual compare Hero/Steps/CTA/App-Download both viewports. Preserve live text, link, images, responsive wrappers and comments.
- [x] Apply Gate F; `fix: preserve serialized CTA layout and significant labels`.

### Task 10: #128 + E08 — одна компактная форма

**Files:** Modify `scripts/lib/email-action-inventory.mjs`, `email-delivery-form.mjs`, `docs/user-guide.md`, `tests/fixtures/rendering/email-delivery-fixtures.mjs`; Test `tests/rendering/email-action-labels.test.mjs`, `email-action-inventory.test.mjs`, `email-delivery-form.test.mjs`, `email-delivery-reuse.test.mjs`, `email-delivery-link-only.test.mjs`, `email-delivery.test.mjs`. Conditional narrow Modify `scripts/lib/email-model.mjs`, `scripts/prepare-email-delivery.mjs`, `scripts/render-email.mjs` only to preserve validated current typed-run mapping through real intake/render.
**Interfaces:** Preserve `collectEmailActions({model,componentIndex,profile})`, `validateDeliveryDocument({document,inventory,profile,purpose,sourceSha?,emailId?})`, `projectDeliveryBindings({model,document,inventory,profile})`. Presentation metadata `{display_group:{id,label},display_context,viewport_hint:'Mobile'|'Desktop'|null}`. `renderDeliveryForm()` adds optional read-only known/managed review; pending controls still only missing links.
**Prerequisite:** Task 3 before inventory changes; accepted #128 spec reconciled with E08 from #132. No second form PR, extra Figma read or AI presentation generation.

- [x] Add red exact labels: «Помощь» → current typed run «Поддержка»; shared two nonadjacent underline fragments omit middle text; emoji/newline; ambiguous scalar mapping blocks, never guessed substring. IDs/kinds/ranges/source bindings unchanged; label/group changes invalidate digest, old answers not migrated.
- [x] Add red structural groups/repeated heading/card CTA/order/split counterpart hints; HTML-like captions escaped; optional review shows known/managed read-only, zero pending produces no mandatory questionnaire, no known value re-request.
- [x] Delegate `node --test tests/rendering/email-action-labels.test.mjs tests/rendering/email-action-inventory.test.mjs tests/rendering/email-delivery-form.test.mjs tests/rendering/email-delivery-reuse.test.mjs`; expected new assertions FAIL.
- [x] Add actual `prepare-email-delivery.mjs --model <synthetic> --output <new-intake>` integration: current changed rich-text run remains exact label; downloaded delivery JSON digest equals intake inventory; final `render-email.mjs` uses same binding/digest/run without stale/ambiguous failure. Unit raw-run fixtures alone insufficient because loadEmailModel currently scalarizes segments.
- [x] Implement minimum validated loader/intake preservation if integration proves loss; preserve normalization and model schema for all existing callers. Implement deterministic compact template/metadata/optional review; no extra prompts, old answer migration or visibility/required/managed gate weakening.
- [x] Delegate green all listed suites and actual CLI path; inspect downloaded JSON IDs/values/digests. Delegate browser visual/keyboard at 360/1280 px and 200% zoom, no horizontal page scroll; split pending half keeps correct hint. No new pixel baseline claimed.
- [x] Apply Gate F; `feat: compact link intake with optional filled-link review`.

**Принятые уточнения FIRST Task10:** actual CLI доказал необходимость opt-in сохранения typed runs в loader/prepare/render. Первый полный прогон затем доказал несовместимость неизменённого source-equal rich-text с иным числом segments и default preview; детализация до ремонта разрешила дополнительно только `scripts/lib/email-renderer.mjs` и `scripts/render-email-preview.mjs`. Narrow adapter требует выбранный html-text rich-text slot, mismatch counts и точное равенство trusted source; matching counts сохраняют supplied identity, изменённый mismatch блокируется. Interpreter/schema/contracts/registries/dependencies не менялись. Окончательная приёмка — точный `b766c52`, 18-пунктовая независимая матрица, strict typed receipts и actual finalizer/workflow; история не переписана.

### Task 11: #131 — NPS whole-button area

**Files:** Modify `scripts/lib/email-interpreter.mjs`; `scripts/lib/email-renderer.mjs` only если existing output_origin недостаточен; Test `tests/rendering/nps-options-rounded-controls.test.mjs`, `renderer-contract-semantics.test.mjs`, `pilot-fidelity-regressions.test.mjs`, `email-instance-visibility.test.mjs`.
**Interfaces:** Existing `output_origin.component_id/original_element_id`, `renderWholeButtonAction()`; exact nps-options option owner + whole-element + href_slot. Standalone `renderContractTree` receives trusted existing component context; bare role/suffix не identity proof.
**Prerequisite:** Tasks 8/9; concrete-email proof after 2/5. Banner/Inline #127 excluded.

- [x] Add red Count=2/3 × 320/360/600/720 px: anchor rect covers painted button within rounding 0.5 px; elementFromPoint center/edge/padding resolves each own URL; gaps/outside do not link. No nested anchors/shared group URL/table anchor.
- [x] Delegate focused NPS/contract tests plus local browser hit-area: current uncovered padding FAIL; existing App-Download/CTA baseline PASS. Include hidden icon/parent, disabled image/alt, separate viewport URL/masks, standalone/scoped/nested paths.
- [x] Implement narrow trusted owner detection and existing whole-button path first; private NPS-only fallback only when measured empty/line-height/height cases require it. Contract facts supply dimensions; no new fixed 44/54/84 px constants or global fonts.
- [x] Delegate green all listed suites and independent visual comparison both viewports; preserve radii, icon rects/alt, order, padding, no neutral Count=2; visible missing URL still blocks, hidden absent assets/URL.
- [x] Apply Gate F; `fix: cover each NPS option with its own link`.

### Task 12: будущий отдельный анализ #132/E17 — proven element geometry only

**Files:** Initially local measurement/diagnostic artifacts outside repo; if proven Modify narrow `scripts/lib/email-interpreter.mjs` or `scripts/lib/email-primitives.mjs`; Test `tests/rendering/pilot-fidelity-regressions.test.mjs`, `component-root-sizing-regressions.test.mjs`, `email-primitives.test.mjs`.
**Interfaces:** Existing public renderer + source DOM bounds/computed styles. Output evidence: 13 block deltas, wrapping/font/line-height/fractional image/baseline contributors and explicit unknown residual. No general geometry correction interface.
**Prerequisite:** Tasks 9/11 before final residual measurement; source selection accepted via Tasks 2/5. Измерение одной rect не автоматически равно изменению высоты блока.

- [ ] Delegate matched-width/font/assets source/render measurements, classify per-element contributors. If причина не доказана single-variable probe, keep diagnosis open and do not manufacture code PR.
- [ ] For each proved contributor add red literal bounds/wrapping expectation к owning suite; negative neighboring QR/image critical path must not acquire compensation. Delegate focused command с exact listed suite/test name.
- [ ] Implement one bounded cause per independently reviewable commit; preserve fixed/fill/hug and all registered design values. Не компенсировать сумму arbitrary padding/height, не менять контракт ради общего delta.
- [ ] Delegate green and per-block independent visual comparison; record corrected contributors and unknown residual separately. Small total delta не acceptance unknown contributors.
- [ ] Apply Gate F only if code changed; `fix: measured element geometry contributors` name уточнить по реальной причине.

## Отдельные решения и профилактика

- **E16 crop:** отдельно сравнить исходный Desktop, общий Mobile-cropped asset и достижимый output; пользователь выбирает точную совместимость/экспорт либо ограниченный результат. До решения contract/Figma/export model changes не разрешены; CSS не возвращает вырезанные pixels.
- **#127 Banner/Inline:** после отдельного explicit выбора прочитать frozen research/plan и recheck feasibility для всей матрицы почтовиков; browser prototype не доказывает совместимость. Приоритет остаётся крайне низким.
- **#132 профилактика:** E01 nullable только внутри registered artwork boundary; E02/E19 bounded complete reads; E03 hidden graph read; E06/E07/E09–E12 retain correct guards; E18 actual stdout CLI; E20 existing bound inventory; E21 actual receipt ref; E22 preserve failed source history; E23 supported file URL/browser/read-only screenshot; E24 correct harness inventory/viewport/text selectors. Это bounded tool guidance в maintenance инструкции, не новый renderer framework.
- **Deferred:** property-capture breadth и cache/optimization не относятся к current fixes; отдельная задача/доказательства, без включения в эту очередь.
