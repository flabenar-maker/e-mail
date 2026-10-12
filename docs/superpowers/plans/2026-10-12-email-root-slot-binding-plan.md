# Исправление привязки корневого слота Figma: план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Правильно проверять связи блоков с Content-слотом конкретного экземпляра письма и сохранять отказ для чужих или недоказанных связей.

**Architecture:** Маленький локальный helper в валидаторе видимости строит составной ID по уже используемому в системе алгоритму. Обе ветки `expectedNode()` вызывают его; проверки identity, ancestry и видимости остаются прежними. Регрессионные данные используют независимые физические ID, соответствующие формату сохранённого чтения Figma.

**Tech Stack:** Node.js, JavaScript ESM, `node:test`, существующие source CLI и email handoff.

**Spec:** [Подтверждённая причина и требования](../specs/2026-10-12-email-root-slot-binding-diagnosis.md).

## Границы задачи

Сейчас опубликованы только диагностика и этот план. Все флажки ниже относятся к будущей реализации. Код не исправлен; исходное письмо по-прежнему воспроизводит 26 ошибок на проверенном коммите `b8ee255bde370a9b932cf36071904be771d86d8e`.

- Постоянные правки публикуются в GitHub; локально используется точный изолированный снимок для проверки. Конкретное письмо, его тексты, raw MCP captures, изображения и диагностические пробы остаются локально.
- Figma, контракты, evidence links, source graph и correspondence не меняются ради прохождения проверки.
- Сохраняются обязательные owner/variant/file/viewport/ancestry/order/visibility/scope проверки и повторная production-проверка перед renderer. `--selected-test` не используется как выпускная проверка.
- Исполнители наследуют выбранную пользователем модель. Навык выбирает только её поддерживаемое усилие с запасом качества; тесты и проверки делегируются, выполняются локально. GitHub Actions и PR Checks не используются.
- У реализации отдельный PR и отдельное разрешение на слияние. Новые зависимости и общий рефакторинг не нужны.

## На что обратить внимание при ревью

1. Числовой owner и Content-слот без собственных геометрических фактов: Mobile `2021:4164` / `1103:7`, Desktop `2021:4163` / `1103:8`.
2. Owner уже содержит `I`, native ID сам является составным: сохранить оба полных пути и один начальный префикс.
3. Root binding: выбранный корень остаётся `2021:4164`, а не `I2021:4164`.
4. Похожий суффикс под другим владельцем или в другом viewport: отказ без подбора альтернативного ID.
5. Скрытые/опущенные дочерние экземпляры и неправильная ancestry: исправление формата не отменяет обязательных доказательств.

## Файлы будущего изменения

| Файл | Изменение |
| --- | --- |
| `scripts/lib/email-source-visibility.mjs` | Локальный helper и два вызова из `expectedNode()` |
| `tests/rendering/email-instance-visibility.test.mjs` | Представительный граф, обе ветки, отрицательные проверки |
| `tests/skills/email-source-cli.test.mjs` | Production CLI с настоящей формой составных ID |
| `tests/skills/email-build-handoff.test.mjs` | Проверка допуска/остановки до renderer |
| `docs/system-status.md` | Подтверждённый статус после завершения реализации |

Правки `figma-component-evidence.mjs`, схем, реестров, asset-профилей, рендера и навыков не требуются. Generated outputs при такой границе не меняются; это подтверждается перед публикацией по текущему manifest, а не принимается на веру.

## Задача 1: правильная проекция и физические связи

**Interface:** сохранить `verifyEmailModelSource({ model, readings, correspondence, resolvedContracts, selectedTest })` и его typed diagnostics. В `email-source-visibility.mjs` добавить приватную `projectInstanceDescendantNodeId(ownerNodeId, nativeNodeId): string | null`; новые публичные API не нужны.

- [ ] **Зафиксировать RED на исходном случае.** Повторить production source CLI на неизменённых локальных captures конкретного письма: код 1, ровно 26 `EMAIL_SOURCE_VISIBILITY_RELATION_MISMATCH`. Сверить модель и evidence по свежим digest; не использовать диагностическую копию с переименованными слотами.
- [ ] **Добавить независимый регрессионный fixture.** Выбрать `email-template` из текущего реестра; включить `visibility_values`, чтобы заработала физическая проверка. Использовать полный numeric/compound граф, нужные owner/variant и нормализованный null-parent выбранного корня. Ожидаемые ID задавать литералами из таблицы спецификации, не через helper.
- [ ] **Проверить обе ветки `expectedNode()`.** Для Content без facts ожидать `I2021:4164;1103:7` и `I2021:4163;1103:8`; для элемента с provenance — отдельный положительный случай с точным native ID. Подтвердить, что владельцы блоков находятся под правильным физическим Content и диагностика отсутствует. На текущем коде новые положительные проверки должны падать по указанным связям.
- [ ] **Зафиксировать nested/root cases.** Для owner `I2021:4164;1103:7;1104:1` и native `I1200:1;1200:2` ожидаемый descendant — `I2021:4164;1103:7;1104:1;1200:1;1200:2`; промежуточные узлы присутствуют в графе. Для root expected ID остаётся `2021:4164`. Добавить неизвестный/пустой/неподдержанный native ID, который не может дать готовую проекцию.
- [ ] **Обновить затронутые visibility fixtures.** Заменить искусственные physical IDs `m-root` / `d-root` и производные пути на числовые корни и точные `I`-цепочки. Сохранить содержание тестовых сценариев и отрицательные assertions. Synthetic contracts в явно включённом selected-test режиме не превращаются в production-исключение; fallback для старой тестовой формы не добавляется.
- [ ] **Реализовать helper.** Использовать проверку допустимой формы ID и композицию по образцу `projectedNodeId()` в `figma-component-evidence.mjs`: `I` + owner без одного начального `I` + `;` + полный native ID без одного начального `I`. Недопустимый вход возвращает `null`. В `expectedNode()` корневая ветка остаётся прежней; helper заменяет обе конкатенации, а квалификация зарегистрированного slot evidence сохраняется.
- [ ] **Проверить ложные совпадения и видимость.** Отсутствующий и повторный Content, другой owner, другой viewport suffix, блок вне Content, неправильный main variant, порядок блоков, скрытый родитель и отсутствие зарегистрированного slot evidence по-прежнему дают diagnostic. Проверить retained и omitted nested instances, hidden fields/assets и полные пути: исправление не позволяет возобновить скрытое содержимое.
- [ ] **Выполнить локальную проверку задачи.** `node --test tests/rendering/email-instance-visibility.test.mjs tests/skills/email-source-fidelity.test.mjs`. Все новые и существующие assertions проходят; raw capture/control graph не изменены. Зафиксировать целевой коммит в GitHub.

## Задача 2: production CLI и граница перед HTML

**Interfaces:** существующий `scripts/verify-email-source.mjs <source-evidence.json>`; существующий `executeEmailBuildHandoff()` из `scripts/lib/email-build-orchestration.mjs`. Формат source evidence, готовый comparison и аргументы handoff сохраняются.

- [ ] **Дополнить CLI regression.** В `tests/skills/email-source-cli.test.mjs` использовать обе версии полного письма и native-shaped visibility graph. Валидный источник даёт код 0 и отсутствие diagnostics, без `--selected-test`; неверный owner/slot даёт код 1. Данные каждой версии независимы, selection scope — `full-email`.
- [ ] **Дополнить handoff regression.** В `tests/skills/email-build-handoff.test.mjs` валидный source evidence с видимостью проходит повторную проверку и достигает обычного renderer. Подмена Content чужим узлом даёт `source-evidence-mismatch`; HTML/ZIP не создаются. Сохранить отрицательные случаи для неполного scope, selected-subtrees и готового флага passed без исходных данных.
- [ ] **Повторить исходную проверку.** Production CLI на неизменённых captures конкретного письма больше не выдаёт эти 26 ошибок. Зафиксировать фактический результат и любые другие diagnostics отдельно. Этот прогон проверяет источник; он не доказывает дизайн HTML или отображение в почтовых клиентах.
- [ ] **Выполнить локальные CLI/handoff тесты.** `node --test tests/skills/email-source-cli.test.mjs tests/skills/email-build-handoff.test.mjs`; ожидается полный PASS. Зафиксировать целевой коммит в GitHub.

## Задача 3: финальная приёмка исправления

- [ ] На точном итоговом облачном коммите выполнить локально `npm run verify` и `npm run generate:check`; не запускать новые области повторно после успешного результата без причины.
- [ ] Проверить allowed-path diff, сохранённые исходные blobs и отсутствие изменений макета/контрактов/captured evidence. Если manifest выявит generated зависимость, пересобрать её через `npm run generate` и повторно проверить точный финальный SHA; вручную generated файлы не редактировать.
- [ ] Независимый проверяющий сверяет исходные требования, raw-case replay, обе ветки projection, root/nested IDs и отрицательные guards. Обновить этот план и `docs/system-status.md` только по реально выполненным шагам.
- [ ] Открыть отдельный draft PR реализации с причиной, итоговым поведением, локальными результатами и ограничениями. Слияние выполняется после отдельного разрешения.

В текущем PR подтверждены причина и план, а не исправление системы. Вёрстка исходного письма в другом чате и внешняя проверка почтовиков остаются отдельными задачами.
