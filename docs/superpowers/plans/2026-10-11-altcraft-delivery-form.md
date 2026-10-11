# Этап 1 Параметры выпуска и единая форма

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for coordination and implementation. Delegate routine local test/regression work and all visual comparisons to gpt-5.6-terra, medium, fork_turns=none. Steps use checkbox syntax. User instructions override remote-check and implicit merge recommendations.

**Goal:** До HTML-вёрстки собрать все параметры и адреса конкретного письма в одну русскую форму и запретить финальный выпуск с незаполненными обязательными действиями.

**Architecture:** Исследованная логическая модель остаётся владельцем дизайна. Независимая инвентаризация действий и DeliveryDocument задают параметры выпуска; проверенная проекция заполняет только существующие href-slots и явно зарегистрированные output-only роли. Форма не требует предварительного HTML-рендера.

**Tech Stack:** Node 24, существующие AJV/YAML, самостоятельный HTML формы без библиотек и внешних запросов.

**Spec:** ../specs/2026-10-11-altcraft-html-release.md

## Статус реализации

Код опубликован в draft [PR №119](https://github.com/flabenar-maker/e-mail/pull/119); итоговая локальная приёмка ещё выполняется. Реализованы типизированные параметры выпуска, инвентаризация видимых действий, автономная русская форма, проверка ответов и обязательный шаг их получения перед экспортом ассетов. Схемы и профиль включены в manifest и оба email-bundle; Markdown-контекст содержит ссылки на схемы вместо их развёрнутых тел. Исходный дизайн проверяется независимо от проекции ссылок.

Исторические source/Figma/install pins сохранены. Установленные тонкие навыки менять или переустанавливать не требуется: восстановление получает зарегистрированные источники и обновлённый workflow. Внешняя проверка импорта, отправки и почтовых клиентов — not-run; слияние PR не выполнено.

## Global Constraints

- Не изменять component contracts, Фигму и email-model metadata. PR118 уже слит отдельной работой; новые изменения не добавляются в его ветку.
- Все будущие source-правки публиковать только в отдельной cloud-ветке; локальные снимки только для чтения/проверки. База новой ветки — слитый main b037987d9ab6df4cdc3f169fa6002212abc3580c, содержащий принятые исправления PR118.
- Формы, значения отправителей, реальные письма и изображения хранить вне репозитория.
- Все тесты локально, Terra medium. Планирование не обращается к профилю ПК.
- Единая форма предшествует экспорту изображений и выпуску финального HTML.
- Новый документ и профиль регистрируются через manifest; навык не получает копии URL/HTML-рецептов.

## Review Focus

- Пропущенные href не должны мешать самой инвентаризации, но не должны проходить финальный выпуск — задача 1 и 3.
- Два одинаковых CTA в разных карточках должны оставаться разными полями — задача 1.
- Разные Mobile/Desktop назначения нельзя молча объединять — задача 1.
- Изменение структуры после заполнения формы делает ответы устаревшими — задача 3.
- Скрытый NPS/Telegram не должен создавать обязательных полей; видимый NPS требует три — задача 1.

## Карта файлов

Новые:

- schemas/email-delivery.schema.json — только формат локальных параметров письма.
- schemas/email-delivery-profiles.schema.json — только формат профилей системы.
- data/delivery/profiles.yaml — профиль, утверждённые адреса и адресуемые роли; шаблонные правила активируются на этапе 4.
- scripts/lib/email-delivery-profile.mjs — чтение и семантическая проверка профиля.
- scripts/lib/email-action-inventory.mjs — видимые действия и точные адреса назначения.
- scripts/lib/email-delivery-form.mjs — русское представление, заполнение и сохранение ответов.
- scripts/lib/email-delivery.mjs — проверка ответов, готовность и выходная проекция.
- scripts/prepare-email-delivery.mjs — подготовка формы как одна CLI-операция.
- tests/rendering/email-action-inventory.test.mjs, email-delivery-form.test.mjs, email-delivery.test.mjs.
- tests/foundation/email-delivery-profile.test.mjs.

Изменяемые: system/manifest.yaml; scripts/lib/system-manifest.mjs и context-bundle.mjs; scripts/lib/email-build-orchestration.mjs; scripts/render-email.mjs и render-email-preview.mjs; data/workflows/email-build.yaml; package.json; tests/skills/email-source-delivery.test.mjs. Небольшое обновление core/email-rendering-standard.md фиксирует принадлежность delivery-данных, не вводит контрактных исключений. SKILL.md меняется только если для запуска формы действительно нужна новая граница или форма handoff.

## Задача 1 Инвентаризация без готовых ссылок

**Interfaces:**

    collectEmailActions({ model, componentIndex, profile })
      -> { fields: ActionField[], inventory_digest: string, diagnostics: Diagnostic[] }

ActionField и Binding определены в Spec. Точный порядок: порядок блоков/экземпляров исходного письма, затем порядок действий внутри блока. Идентификатор поля основан на полном instance_path и целевом слоте; label не является идентификатором. Отпечаток включает профиль/варианты/видимость/структуру bindings, но не введённые пользовательские URL.

- [ ] Terra создаёт маленькие синтетические fixtures из уже поддержанных контрактных форм: две карточки с одинаковой надписью, visible/hidden NPS, вложенное действие, rich-text link, различающиеся viewport-слоты.
- [ ] Зафиксировать тесты absent-urls-do-not-block-inventory, duplicate-labels-have-distinct-fields, hidden-actions-omitted, visible-nps-has-three-fields, ambiguous-viewport-pair-is-not-merged. Для первого fields непустой и нет диагностики про отсутствие URL; для второго assert.notEqual(fields[0].id, fields[1].id); NPS required-строк ровно 3.
- [ ] Реализовать обход выбранных variant_axes, property/instance visibility, slots и nested_components с помощью существующего selectVariantRoot. Не проходить все варианты реестра вместо конкретного письма.
- [ ] Объединять viewport-bindings только по доказанному логическому соответствию. Профиль содержит явное соответствие для постоянных ролей; не вводить сопоставление по порядку, одинаковой подписи или визуальной похожести.
- [ ] Сохранить полный диагностический результат ошибок структуры. Режим исследования допускает отсутствующие URL и файлы ассетов, но не разрешает подавление остальных ошибок рендера/модели.
- [ ] Terra выполняет node --test tests/rendering/email-action-inventory.test.mjs. Готово: все указанные случаи проходят локально.

## Задача 2 Профиль и русская форма

**Interfaces:**

    loadEmailDeliveryProfiles({ repoRoot }) -> Promise<DeliveryProfiles>
    renderDeliveryForm({ inventory, deliveryDraft }) -> string
    createDeliveryDraft({ emailId, sourceSha, profile, inventory }) -> DeliveryDocument

DeliveryDocument определяется Spec; sender/reply_to содержат mode=inherit или mode=explicit с name/address. plain_text содержит mode=auto или mode=manual с value. answers — объект field_id → строка. Для preview параметры могут быть неполными; readiness различает черновик и финал.

- [ ] Зафиксировать schema-rejects-unknown-fields, inherited-sender-is-not-empty-override, form-labels-are-russian, managed-links-are-prefilled, form-has-no-network-requests. assert.equal(document.sender.mode, 'inherit'); managed logo/store/unsubscribe отображаются без повторного обязательного запроса.
- [ ] В profiles.yaml зарегистрировать точные URL из Spec, разрешённую метку {unsubscribe} и существующие роли footer/NPS. Логотип — отдельная output-only роль, без добавления action в component contract. Проверка профиля подтверждает существование адресуемых владельцев/элементов и отсутствие конфликтующих role mappings.
- [ ] Отобразить секции «Параметры письма» и «Ссылки в письме». Каждая ссылка показывает блок, экземпляр, текст/описание, обязательность и значение. Не показывать пользователю node IDs, адреса файлов и технические flags AMP/CSS.
- [ ] Самостоятельная HTML-форма экспортирует один проверяемый JSON ответов. Все вставляемые подписи и исходные значения экранируются. Никаких remote fetch, автоматического отправления письма или записи поверх готовой версии.
- [ ] Добавить prepare-email-delivery.mjs с аргументами --model, --profile, --output; выход — form.html и delivery.json в отдельной локальной папке. Недостающие пользовательские адреса не мешают созданию формы.
- [ ] Terra выполняет node --test tests/foundation/email-delivery-profile.test.mjs tests/rendering/email-delivery-form.test.mjs. Готово: формат и значения формы корректны.

## Задача 3 Ответы и проверка готовности

**Interfaces:**

    validateDeliveryDocument({ document, inventory, profile, purpose }) -> Diagnostic[]
    projectDeliveryBindings({ model, document, inventory, profile })
      -> { model: EmailModel, outputBindings: OutputBinding[] }

purpose равен preview или final. Функция проекции возвращает новую модель, не мутирует оригинал. outputBindings предназначены только для зарегистрированных выходных ролей; их фактический HTML-хук добавляется на этапе 4.

- [ ] Зафиксировать stale-inventory-is-rejected, final-missing-required-link-blocks, example-domain-is-not-send-ready, fixed-links-cannot-be-overridden, original-model-is-unchanged.
- [ ] Проверить email_id/profile version/source binding/inventory_digest и точный набор field IDs. Не применять ответы по label. Неизвестные/устаревшие поля дают отдельную понятную диагностику.
- [ ] Для final отклонять обязательные пустые адреса, '#', зарезервированные example.com/example.org/example.net и неподходящие шаблонные метки. Разрешать явные HTTP/HTTPS/mailto/tel назначения по роли; служебные метки только по allowlist профиля. Не подменять адрес автоматически.
- [ ] Проверить сохранение разных ссылок разных экземпляров. Header URL не используется для footer-site. Не строить NPS URL из предполагаемого шаблона backend.
- [ ] Собрать exact slot projection с scope=all только при доказанной общей привязке; иначе scope=mobile/desktop. После проекции выполнить обычную семантическую проверку модели, не ослабляя её.
- [ ] Terra выполняет node --test tests/rendering/email-delivery.test.mjs. Готово: все обязательные данные конечного выпуска проверяются независимо от корректности дизайна.

## Задача 4 Подключение в процесс и источники

**Consumes:** три интерфейса предыдущих задач.

**Produces:** executeEmailBuildHandoff принимает deliveryDocument/profile; rendererRunner получает deliveryPath и purpose. CLI --delivery подключает внешний документ; существующий вызов без документа сохраняет базовое поведение для совместимости. Workflow для финального CUPIS Altcraft-выпуска требует новый документ и readiness, поэтому старый CLI не становится обходом нового release-gate.

- [ ] Добавить профиль/schema в manifest и соответствующие bundle profiles. Обновить загрузчики и validateSystem, чтобы отсутствующие/несогласованные новые источники останавливались типизированной диагностикой.
- [ ] В workflow между исследованием структуры и asset/export/build добавить prepare-delivery-form и validate-delivery-inputs. Required inputs не требуют ссылки для первого шага; build/export шаг требует readiness final.
- [ ] Сохранить source-fidelity проверки исходного дизайна. Новые пользовательские href проверяются как явно адресуемые delivery-значения; это не исключение для любых изменений текста, геометрии или изображений.
- [ ] Передавать deliveryPath через defaultRendererRunner и preview CLI; временные JSON создавать вне source и удалять только собственные проверенные пути. Черновик с незаполненными адресами не публикует готовый ZIP.
- [ ] Дополнить email-source-delivery.test.mjs случаями no-asset-export-before-form и final-handoff-requires-ready-delivery. Существующие проверки Figma source и asset evidence сохраняются.
- [ ] Terra выполняет node --test tests/skills/email-source-delivery.test.mjs tests/rendering/email-delivery.test.mjs, затем npm run validate и npm run generate:check. Готово: процесс действительно использует форму, а не только умеет нарисовать её.
- [ ] Опубликовать этап в отдельной cloud-ветке после согласования этого плана. Коммит: feat: add typed email delivery inputs and Russian intake form. Изменять историческую ветку PR118/main напрямую и сливать новый PR без отдельного разрешения запрещено.

## Результат этапа

Одна форма с найденными действиями; сохранённые проверяемые ответы; новые входы workflow; финальный release-gate. Нет изменения дизайна или работающего в Альткрафте шаблона до следующих этапов. Внешняя приёмка not-run. Следующий этап использует зарегистрированный профиль и проверенные данные.
