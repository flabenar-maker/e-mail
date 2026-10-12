# Последовательная реализация плана email-системы

Основание: [план #133 на закреплённом коммите](https://github.com/flabenar-maker/e-mail/blob/4f8cec973cfbe8ae5b61833be8066ac088952753/docs/superpowers/plans/2026-10-13-email-system-remediation-order.md). Начальный main: `b8ee255bde370a9b932cf36071904be771d86d8e`.

## Уточнения задания

- Пользователь разрешил реализацию 13 октября 2026 года: один новый draft PR с последовательными изменениями Task 1 → 12. Это заменяет предложение о двенадцати отдельных runtime PR. Каждому шагу соответствуют отдельные коммиты и локальные результаты проверки; следующий шаг начинается после завершения предыдущего.
- PR #127 исключён как крайне низкоприоритетный. PR #128–133 используются только как источники; их ветки и статусы не изменяются. Merge, установка навыков и Figma writes не входят в задание.
- Если детализация шага недостаточна, сначала дополнить её здесь, затем писать тесты и реализацию. Изменение поведения за пределами исходного плана не подменять догадкой.
- Остановка при **5% оставшегося лимита Codex** (usedPercent ≥95): прекратить новые работы, сохранить текущие артефакты и точную точку продолжения, отметить PR, затем выполнить обычное выключение Windows без принудительного закрытия приложений. Лимит общий для аккаунта; проверяется между фазами и перед тяжёлыми запусками.
- Изоляция — новая облачная ветка. Локальные exact-SHA snapshots используются только для проверок; staging вне исходников содержит временные публикационные артефакты. Полные тестовые логи остаются локально. Actions/PR Checks не используются.
- Внешняя приёмка: `not-run`.

## Текущая точка

**Task 1 завершён в ветке на `c0808e1e3d18bfd1824dd34386d22d9c0c1090a7`.** Свежие targeted/full и независимая приёмка успешны. Следующее действие: Task 2 — опубликованная ниже детализация, затем RED и минимальное исправление физических ID. Task 2 production code ещё не менялся.

| Шаг | Состояние |
| --- | --- |
| 1. R1, serialized resource paths | Accepted на c0808e1; targeted 26/full 2215 PASS |
| 2. #130/E13, root-slot projection | Детализирован перед RED; код не менялся |
| 3. R3, instance identities | Не начат |
| 4. R5, workflow identity presence | Не начат |
| 5. R2, source/candidate/release binding | Не начат |
| 6. R6, contained asset bytes | Не начат |
| 7. R4, fast-uri 3.x | Не начат |
| 8. #132/E04/E05, compact variants | Не начат |
| 9. #132/E14/E15, centering/labels | Не начат |
| 10. #128/E08, single compact link form | Не начат |
| 11. #131, NPS click area | Не начат |
| 12. #132/E17, measured geometry | Не начат; только доказанные причины |

## Task 1 — детализация перед изменением

**Граница:** `scripts/lib/email-resource-references.mjs`, resource/Altcraft tests и этот progress document. Serializer и ZIP encoder сохраняются.

1. Внутри `style` атрибута сначала декодировать один слой HTML entities в отдельное представление с соответствием каждому исходному span. CSS `url()` распознаётся по этому представлению; `start/end/raw_value` продолжают указывать на исходный HTML, исключительно на содержимое ресурса между кавычками. Текст `<style>` читается как raw text: браузер не декодирует там HTML entities.
2. Включить named `&quot;`/`&apos;`, decimal/hex quotes, повтор одинакового ресурса, обычные CSS quotes, VML/HTML background, пробелы и Unicode/percent escaping. Заменять только span пути в обратном порядке offsets. Не декодировать весь документ и не затрагивать action href. Независимый preflight уточнил: в `<style>` entity-like text и semicolon допустимы как literal URL; collector обязан собрать их и проверить exact literal filename, а не молча пропустить. HTML entities декодируются ровно один раз только в attribute context. Основание: [CSS Syntax, consume URL token](https://www.w3.org/TR/css-syntax-3/#consume-url-token).
3. Validation декодирует значение пути и сверяет с exact declared entry. Remote/data/absolute/traversal/backslash/другая регистровая форма/undeclared ресурсы дают diagnostics и неизменённый HTML. Prefix replacement должен учитывать encoded separator `%2F` и `&#47;`, а не искать только первый буквальный `/`; encoding суффикса сохраняется.
4. RED: реальные collector/rebaser и сборка Altcraft entries → ZIP encoder → независимое чтение STORE entries. Ожидаемые пути задаются литералами; все ссылки ведут к `images/...` из `email/html.html`, image bytes точны. Negative cases не создают пригодный rebased HTML.
5. GREEN: resource, Altcraft, primitive, serializer suites; затем полный локальный `verify` и `generate:check` на cloud SHA. Проверить raw snapshot и permitted diff, независимая приёмка завершённого шага. Полные журналы не добавлять в GitHub.

**Уточнение перед исправлением reviewer finding:** HTML named entities регистрозависимы. Разрешённые здесь exact spellings: `amp`/`AMP`, `quot`/`QUOT`, `apos`, `lt`/`LT`, `gt`/`GT`; numeric `x`/`X` допускается отдельно. Нельзя превращать произвольные `&QuOt;`, `&APOS;`, `&aMp;` в кавычки или ampersand: literal resource иначе ошибочно совпадёт с declared entry. Такие несовпадающие имена дают diagnostics и исходный HTML. Основание: [WHATWG named character references](https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references). Общая таблица всех HTML entities или CSS parser в этот bounded fix не добавляется.

## Task 2 — детализация перед изменением

**Граница:** `scripts/lib/email-source-visibility.mjs`; visibility, source-fidelity, production CLI и handoff tests; общий test-only fixture `tests/helpers/email-physical-source-fixture.mjs` при необходимости; этот документ. Схемы, реестры, contracts, renderer, Figma captures и публичные interfaces сохраняются. Основание — закреплённые #130 и Task 2 плана #133.

1. `expectedNode()` сохраняет root identity: root остаётся физическим owner. Приватный `projectInstanceDescendantNodeId(ownerNodeId, nativeNodeId): string | null` используется только в двух descendant ветках: единственный provenance node и зарегистрированное Content foundation evidence. Допустимые формы — numeric `123:456` либо `I123:456;789:10[;...]`. Композиция: один `I` + полный owner без одного ведущего `I` + `;` + полный native без одного ведущего `I`. Пустой/неподдержанный/неоднозначный input даёт `null`; старые искусственные ID не получают fallback. Образец алгоритма — существующий `projectedNodeId()` в `figma-component-evidence.mjs`, который не меняется и не экспортируется.
2. Независимые literal expectations: Mobile root `2021:4164`, Content `I2021:4164;1103:7`; Desktop root `2021:4163`, Content `I2021:4163;1103:8`; nested owner `I2021:4164;1103:7;1104:1` + native `I1200:1;1200:2` даёт `I2021:4164;1103:7;1104:1;1200:1;1200:2`. Полные parent chains включают промежуточные nodes. Ожидания не вычисляются production helper.
3. Production regression без `--selected-test`: зарегистрированные `email-template` и Count=2 `nps-options`, оба viewport, реальные owner/main variant IDs из pinned registry. Content скрыт concrete mask, NPS расположен под ним: этот небольшой полный fixture изолирует root-slot identity и сохраняет существующие правила скрытого содержимого. Это test fixture, не свежий capture реального письма. Для provenance/nested/root cases используются отдельные synthetic contracts с явно включённым selected-test и физическими ID; qualification production identity остаётся строгой.
4. Затронутые synthetic visibility fixtures переводятся из `m-root`/`d-root` и путей без `I` в числовые roots и физические compound IDs. Содержание старых negative assertions сохраняется. Недопустимый native, другой owner/viewport suffix, отсутствующий/duplicate Content, неверная ancestry/main variant, блок вне Content, повторный target, скрытый parent, omitted/retained nested и hidden field/asset guards продолжают блокировать. Регистрация foundation link и совпадение его selected variant проверяются до projection; отсутствие/подмена доказательства не компенсируются helper.
5. До исправления подтвердить RED положительных literal physical graph cases на exact cloud SHA. Production CLI возвращает 0 только для valid full-email source. Handoff valid source достигает renderer; foreign Content/owner даёт source-evidence mismatch до renderer и без готовых HTML/ZIP. Existing manual-passed/incomplete/subtree guards сохраняются. Test-only fixture может переиспользоваться CLI/handoff, runtime dependencies не добавляются.
6. После RED изменить только private helper и две конкатенации. Локально targeted visibility/source-fidelity/source-cli/handoff, затем штатный `repository-full` с generate check на итоговом cloud SHA. Проверить source snapshot и allowed diff; независимая приёмка actual artifact refs. Следующий шаг начинается после её завершения.

**Уточнение negative control перед его добавлением:** отказ для malformed native нельзя доказывать одним несовпадающим target. Использовать минимальный synthetic root/group с native `11:2;12:1` (недопустимый compound без `I`) и совпадающим с композицией без проверки literal target `I2021:4164;11:2;12:1`, аналогично Desktop; intermediate parent присутствует. Слепая композиция дала бы совпадение, строгая validation должна дать `EMAIL_SOURCE_VISIBILITY_TARGET_MISMATCH`. Все прочие identity/ancestry/visibility inputs валидны. Это проверяет именно отказ `null`, а не случайную ошибку другого узла; runtime scope сохраняется.

Исторические 26 errors из диагноза #130 не обозначаются свежим replay: исходные private captures этого письма в текущем задании не предоставлены. Проверяемая здесь граница — independent registered/synthetic regression и production CLI/handoff; внешняя визуальная приёмка остаётся `not-run`.

## Проверки

Baseline и результаты каждого шага записываются после фактических локальных запусков с SHA. Непроверенные коммиты не обозначаются как passing.

- Baseline `b8ee255`: полный локальный test-equivalent дал 2202 PASS / 5 FAIL. Все пять failures — окружение: Python отсутствовал в PATH и `CUPIS_SYSTEM_COMMIT` не был установлен. После процессного исправления targeted zip-store/source-delivery rerun: 7 PASS / 0 FAIL. Source/test/config не менялись. Это не повторный успешный полный suite; runtime GREEN ниже ещё ожидается.
- Task 1 RED `b71c03bcb67571e40ee7e15f31d471d5b7ee889a`: resource/Altcraft suites — 13 tests, 6 PASS / 7 expected FAIL, exit 1; unrelated failures нет. Проверено raw 344 files / 0 mismatches; production/data/schema сохранялись. Failures воспроизводят serialized entity quotes, encoded prefix, raw-style/attribute decoding, silent omission и реальную primitive → serializer → ZIP цепочку.
- Для последующих локальных запусков Node 24 и bundled Python доступны только через окружение процесса; `CUPIS_SYSTEM_COMMIT` равен exact tested SHA. Machine PATH и настройки компьютера не изменяются. Внешняя приёмка остаётся `not-run`.
- Preliminary GREEN `a354aeb`: четыре targeted suites, 25 PASS / 0 FAIL. Независимый reviewer затем обнаружил mixed-case entity alias. Регрессионный RED `6913f563140948a2077455b0adaafd5825920669`: resource suite, 8 PASS / 1 expected FAIL, exit 1. Полный запуск preliminary SHA остановлен как `interrupted`, не PASS. Окончательный GREEN/full gate выполняется после этого минимального исправления.
- Task 1 final `c0808e1e3d18bfd1824dd34386d22d9c0c1090a7`: targeted 26 PASS / 0 FAIL; штатный local `repository-full` 2215 PASS / 0 FAIL, exit 0; validator и `generate-docs --check` exit 0; raw 344 файлов / 0 несовпадений. Request `email-remediation-task1-final-20261013`. Независимый reviewer `/root/implementation_review` принял семь exact refs; штатный finalizer `accepted`. Приёмка относится к этому SHA и только Task 1. Baseline full rerun не заявляется.
