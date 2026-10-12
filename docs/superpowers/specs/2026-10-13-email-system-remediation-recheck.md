# Повторная проверка email-системы и открытых PR

Дата: 13 октября 2026 года. Канонический репозиторий: `flabenar-maker/e-mail`.
База: [`b8ee255bde370a9b932cf36071904be771d86d8e`](https://github.com/flabenar-maker/e-mail/tree/b8ee255bde370a9b932cf36071904be771d86d8e), после слияния #126.
Предыдущая база аудита: `a15ff3368bcc84bf5af12a5f4e0d8cbc216e2aa5`.
[Центральный порядок реализации](../plans/2026-10-13-email-system-remediation-order.md).

## Область и доказательства

Это новая документация: повторная проверка R1–R6, review шести открытых PR и очередь отдельных реализаций. Код, существующие PR, Figma, реальные письма и навыки не изменяются. Принятие этого плана не разрешает реализацию, слияние или установку.

Точный локальный снимок main проверен по raw blobs: 343 файла, несовпадений нет. Локальные probes выполнял отдельный проверяющий на этой базе. Повторная проверка ниже различает свежую reproduction, наблюдение текущего кода и непроведённую приёмку. Старые результаты из PR bodies не считаются свежими тестами. Actions и PR Checks не запускались и не использовались.

Маршрут анализа — `system-progress/read-only`; маршрут разрешённой публикации документов — `library-maintenance/write`. Execution decision — `bounded-change`, выбранная модель унаследована, поддерживаемое усилие с запасом — `high`. Частные captures, тексты, ассеты и локальные отчёты не входят в PR.

## R1–R6 на текущей базе

| Замечание | Свежие данные и предел вывода | Требование к исправлению |
| --- | --- | --- |
| R1: CSS resource rebasing | Свежий primitive → serializer → rebase → ZIP probe: diagnostics пусты, HTML background перебазирован, CSS URL остался `images/...`; ZIP создан (604 байта). Это воспроизведение дефекта, не полный реальный выпуск | Распознавать сериализованный CSS URL, включая HTML entities; каждый локальный URL разрешается относительно `email/html.html` в существующий ZIP entry, ссылки действий не меняются |
| R2: текущий источник/модель/HTML | Текущий код статически принимает равные email/file пары без сравнения с выбранным письмом и принимает произвольные непустые visual IDs с `passed`. `verifyNewBuildSource()` пропускает continue-fix; rendererRunner сразу публикует output. Свежий end-to-end или visual обход не выполнялся | Доверенная выбранная identity + production source comparison до candidate; независимая qualified visual evidence после candidate; release только проверенных bytes |
| R3: instance identity | Свежий duplicate-sibling probe: semantic/render diagnostics пусты; первый marker исчез, второй встречается 4 раза. Delivery уже блокирует duplicate instance path. Статически production source comparison uniqueIndex уже отклоняет глобальный повтор bare ID; direct render probe не доказывает обход source proof | Закрыть missing direct model/render global guard до bare-ID Map/index; inventory уже наследует semantic guard, существующий source uniqueIndex rejection сохраняется. Проверять уникальность `instance_id` во всём дереве root/slots/nested, включая hidden; retain scoped-path guard. Один общий Mobile/Desktop logical instance — одна запись |
| R4: зависимость fast-uri | Lock на текущем SHA: fast-uri `3.1.6`, Ajv `8.20.0`. 13 октября свежие primary GHSA range reads подтверждают affected `3.1.6` и patched `3.1.7`/`3.1.8`; npm audit и application exploit probe не выполнялись | Совместимое обновление fast-uri до `>=3.1.8` в `3.x`, минимальный lock diff и локальная Ajv/schema регрессия; без major upgrade |
| R5: отсутствующая identity | Свежий resolver probe без `emailId` выбирает `new-build`, `blocker:null`, разрешает outputs. Same-field equality сравнивает отсутствующие значения как равные | Каждое участвующее поле должно быть present/nonblank до equality; valid matching fields проходят. Существующий camelCase `emailId` адаптируется к R2 `email_id`, без глобального переименования |
| R6: asset containment/bytes | Статически: прямой ZIP readFile и folder stat/copy следуют filesystem links; handoff имеет containment, но standalone путь и повторное чтение остаются. Свежая escape/race reproduction не выполнялась | Один bounded loader для ZIP и folder: physical containment, file validation и публикация тех же проверенных buffers; preserve geometry/alpha/hash/profile guards |

Основные неизменяемые источники:

- [R1 collector/rebase](https://github.com/flabenar-maker/e-mail/blob/b8ee255bde370a9b932cf36071904be771d86d8e/scripts/lib/email-resource-references.mjs), [serializer](https://github.com/flabenar-maker/e-mail/blob/b8ee255bde370a9b932cf36071904be771d86d8e/scripts/lib/email-html-serializer.mjs).
- [R2/R5 orchestration](https://github.com/flabenar-maker/e-mail/blob/b8ee255bde370a9b932cf36071904be771d86d8e/scripts/lib/email-build-orchestration.mjs), [strict visual receipt helper](https://github.com/flabenar-maker/e-mail/blob/b8ee255bde370a9b932cf36071904be771d86d8e/scripts/verify-real-email-visual.mjs).
- [R3 semantic validator](https://github.com/flabenar-maker/e-mail/blob/b8ee255bde370a9b932cf36071904be771d86d8e/scripts/lib/email-model.mjs), [bare-ID source maps](https://github.com/flabenar-maker/e-mail/blob/b8ee255bde370a9b932cf36071904be771d86d8e/scripts/lib/email-source-visibility.mjs), [existing uniqueness invariant](https://github.com/flabenar-maker/e-mail/blob/b8ee255bde370a9b932cf36071904be771d86d8e/core/email-model-assembly-standard.md).
- R4 primary advisory ranges: [GHSA-qw65-cvwx-89v3](https://github.com/advisories/GHSA-qw65-cvwx-89v3) — affected `3.x <3.1.7`, high; [GHSA-hrr3-gc8f-f4qj](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj) — affected `3.x <3.1.8`, moderate. Fresh primary range verification 13 октября обосновывает compatible floor `>=3.1.8 <4`; это не npm audit или доказательство exploit приложения.
- [R4 exact lock](https://github.com/flabenar-maker/e-mail/blob/b8ee255bde370a9b932cf36071904be771d86d8e/package-lock.json).
- [R6 direct rendering](https://github.com/flabenar-maker/e-mail/blob/b8ee255bde370a9b932cf36071904be771d86d8e/scripts/render-email.mjs), [folder publisher](https://github.com/flabenar-maker/e-mail/blob/b8ee255bde370a9b932cf36071904be771d86d8e/scripts/lib/email-output.mjs).

R3 не вводит новый формат ID или новое правило Figma. Уже действующий assembly standard требует стабильный уникальный bare `instance_id`; current maps используют именно его. Повтор bare ID под другим родителем сейчас также небезопасен, даже когда полные scoped paths различаются. Поэтому один лишь sibling/path guard недостаточен.

## Все открытые PR

Точные head snapshots raw-verified, diff scope и relative links проверены локально. Пять PR меняют только документы; #129 — единственное изменение поведения инструкции, шесть строк. Ни один не исправляет R1–R6.

| PR и закреплённый head | Что реально опубликовано | Свежая локальная проверка и решение по порядку |
| --- | --- | --- |
| [#127](https://github.com/flabenar-maker/e-mail/pull/127), `a67953911557bc668e7cdf7a28abcc8a162e2518` | [Banner/Inline research](https://github.com/flabenar-maker/e-mail/blob/a67953911557bc668e7cdf7a28abcc8a162e2518/docs/superpowers/specs/2026-10-12-banner-inline-click-area-research.md), [plan](https://github.com/flabenar-maker/e-mail/blob/a67953911557bc668e7cdf7a28abcc8a162e2518/docs/superpowers/plans/2026-10-12-banner-inline-click-area-plan.md) | 345 blobs, 0 mismatches, 4 links valid; решение полного набора требований ещё не доказано. Крайне низкий приоритет, заморожено до отдельного явного выбора пользователя |
| [#128](https://github.com/flabenar-maker/e-mail/pull/128), `8d1d7ceeb1a4134bcaa5ae29a437b4bc94bf2818` | [Link-form spec](https://github.com/flabenar-maker/e-mail/blob/8d1d7ceeb1a4134bcaa5ae29a437b4bc94bf2818/docs/superpowers/specs/2026-10-12-email-link-form-design.md), [plan](https://github.com/flabenar-maker/e-mail/blob/8d1d7ceeb1a4134bcaa5ae29a437b4bc94bf2818/docs/superpowers/plans/2026-10-12-email-link-form.md) | 345 blobs, 0 mismatches, 2 links valid; документы после #132/#131. Реализация объединяет E08, ждёт R3 для inventory changes |
| [#129](https://github.com/flabenar-maker/e-mail/pull/129), `84d1fb2189431beef5e08dd6c436dc18d2dda0fb` | [Шесть строк plain explanations](https://github.com/flabenar-maker/e-mail/blob/84d1fb2189431beef5e08dd6c436dc18d2dda0fb/.agents/skills/building-cupis-emails/SKILL.md) | 343 blobs, 0 mismatches; 13 локальных skill/router/execution-boundary тестов, 0 failures. Независимый, может идти первым; stop #126 при системном дефекте сохраняется |
| [#130](https://github.com/flabenar-maker/e-mail/pull/130), `f6079cfbdfe88a1dc542df0c6cc6366b4c2c9674` | [Root-slot diagnosis](https://github.com/flabenar-maker/e-mail/blob/f6079cfbdfe88a1dc542df0c6cc6366b4c2c9674/docs/superpowers/specs/2026-10-12-email-root-slot-binding-diagnosis.md), [plan](https://github.com/flabenar-maker/e-mail/blob/f6079cfbdfe88a1dc542df0c6cc6366b4c2c9674/docs/superpowers/plans/2026-10-12-email-root-slot-binding-plan.md) | 345 blobs, 0 mismatches, 10 links valid; первым среди связанных документов. Физическая проекция нужна перед concrete-email source proof/R2 integration |
| [#131](https://github.com/flabenar-maker/e-mail/pull/131), `4641cb58d1a5ee6055ae3fb09ba50e8252e274c1` | [NPS diagnosis](https://github.com/flabenar-maker/e-mail/blob/4641cb58d1a5ee6055ae3fb09ba50e8252e274c1/docs/superpowers/specs/2026-10-12-nps-options-click-area-diagnosis.md), [plan](https://github.com/flabenar-maker/e-mail/blob/4641cb58d1a5ee6055ae3fb09ba50e8252e274c1/docs/superpowers/plans/2026-10-12-nps-options-click-area-plan.md) | 345 blobs, 0 mismatches, 7 links valid; после #132. Реализация сохраняет output_origin, дизайн, visibility и отдельные URLs |
| [#132](https://github.com/flabenar-maker/e-mail/pull/132), `524fe2d2c6b0dc9e9fceb7973d815473acdb96e2` | [E01–E24 diagnosis](https://github.com/flabenar-maker/e-mail/blob/524fe2d2c6b0dc9e9fceb7973d815473acdb96e2/docs/superpowers/specs/2026-10-12-light-email-error-diagnosis.md), [closure plan](https://github.com/flabenar-maker/e-mail/blob/524fe2d2c6b0dc9e9fceb7973d815473acdb96e2/docs/superpowers/plans/2026-10-12-light-email-error-closure-plan.md) | 345 blobs, 0 mismatches, 4 links valid; после #130, перед #131/#128. Несколько последовательных узких implementation PR, а не один общий renderer fix |

## Поправки к будущему исполнению

В #128 current-run label нельзя принять только unit fixtures: [loadEmailModel](https://github.com/flabenar-maker/e-mail/blob/b8ee255bde370a9b932cf36071904be771d86d8e/scripts/lib/email-model.mjs) сворачивает typed rich-text segments в scalar. Нужна проверка фактического prepare CLI → inventory/digest → final render, с узкой корректировкой intake/loader при доказанной необходимости. Старые answers не мигрируют, новые вопросы не добавляются.

В R2 выбрать последовательность candidate → independent review → release. Требовать visual pass до создания candidate было бы циклом; нынешний прямой выпуск runner нельзя принять как безопасную границу. Источник проверяется до candidate, visual evidence — после; любой изменённый source/model/render/asset digest аннулирует proof.

E01–E03/E06–E07/E09–E12 и E18–E24 из #132 — корректные ограничения либо профилактика работы инструментов, не повод менять дизайн и guards. E04/E05 — compact variants/naming; E13 — #130; E14/E15 — centered serialized CTA/significant whitespace/hug; E08 — единственная форма #128; E17 — доказанные element contributors после renderer corrections. E16 crop остаётся отдельным решением до contract/Figma changes. Deferred property-capture breadth и cache/optimization не входят в исправления.

## Приёмка и пределы

- Текущая docs-only приёмка: exact diff, три allowed paths, unchanged blobs, один append-link, relative links, coverage/order и независимое review. Runtime suite не заявляется выполненной этой документацией.
- Будущие runtime/contract PR: targeted red/green, затем полный локальный `npm run verify` и `npm run generate:check` на точном финальном SHA; browser/visual проверки отдельным агентом. Изменение SHA требует свежих результатов.
- Новые реализации начинают с обновлённого фактического main после prerequisite merges. При слиянии документов сохраняются все разделы `docs/system-status.md`; старый head receipt не переносится на rebased commit.
- Figma live read, новое concrete-email end-to-end, реальные клиенты, import/send не выполнялись. `external_acceptance: not-run` сохраняется до действительного внешнего результата.
- Новая плановая метка: `план: порядок реализации`; назначение — поиск центрального draft PR, без запуска CI.
