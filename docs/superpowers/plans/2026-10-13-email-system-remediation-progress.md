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

**Task 1 — уточнён; тесты RED подготовлены, подтверждение RED и реализация ещё не выполнены.** Следующее действие: дождаться локальной baseline-проверки, запустить новые resource/Altcraft тесты на точном RED cloud commit, убедиться в ожидаемых failures, затем минимально исправить collector.

| Шаг | Состояние |
| --- | --- |
| 1. R1, serialized resource paths | RED tests prepared |
| 2. #130/E13, root-slot projection | Не начат |
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

## Проверки

Baseline и результаты каждого шага записываются после фактических локальных запусков с SHA. Непроверенные коммиты не обозначаются как passing.
