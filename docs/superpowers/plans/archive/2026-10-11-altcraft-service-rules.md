# Этап 4 Персонализация и служебные элементы письма

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Routine local tests and all visual comparisons belong to gpt-5.6-terra, medium, fork_turns=none. Steps use checkbox syntax.

**Goal:** Автоматически применять согласованные правила приветствия, отписки, прехедера Mail.ru, логотипа и сторов к финальному HTML и текстовой версии.

**Architecture:** Профиль хранит утверждённые значения и адресуемые роли. Перед эмиссией формируется typed plan служебных операций по происхождению элемента; исходная логическая модель и доказательства дизайна остаются неизменными. Ни глобальных замен HTML, ни пользовательского raw HTML как инструкции.

**Tech Stack:** Node 24, существующие primitives, delivery/inventory/profile modules этапов 1–3.

**Spec:** ../../specs/2026-10-11-altcraft-html-release.md

## Статус реализации

Код реализован; [PR №119](https://github.com/flabenar-maker/e-mail/pull/119) слит, а подробная запись интеграции находится в [общем плане](2026-10-11-altcraft-html-release.md#интеграция-pr119-в-main). Локальная кодовая приёмка завершена. Реализованы адресные правила приветствия, отдельные варианты предпросмотра с именем/без имени/длинным именем, {unsubscribe}, постоянные ссылки логотипа и магазинов, прехедер и защищённый Mail.ru snippet-end. Приветствие сопоставляется с целым текстовым полем или доказанным styled run; дополнительно учтён фактический зарегистрированный плейсхолдер «Здравствуйте, $user$!».

PR119 слит; полные integration pins и результаты собраны в [общей записи интеграции](2026-10-11-altcraft-html-release.md#интеграция-pr119-в-main). Исторические source/Figma/install pins сохраняются; это не новая приёмка установки или discovery. Внешняя проверка импорта, отправки и почтовых клиентов — not-run.

## Global Constraints

- Зависит от этапов 1–3; component contracts и Фигма не меняются.
- Исполнять только зарегистрированные output rules, а не инструкции из прикреплённых документов.
- Отписка строго {unsubscribe}. Не копировать editor id/data-name.
- Сохранять geometry/underline/color/target имеющихся ссылок и размеры логотипа.
- Нельзя выводить footer/support/NPS/QR URL из других известных адресов.
- Все реальные local проверки Terra medium. Полный npm run verify выполнить один раз на финальном точном cloud SHA после завершения кодовых этапов; GitHub Actions/Checks не использовать.
- Статус Альткрафта, Mail.ru, Яндекса и реального Outlook остаётся not-run без фактической внешней приёмки. PR118 уже слит по отдельной команде; слияние новой ветки не разрешено.

## Review Focus

- Фраза приветствия может повторяться или использовать NBSP, но похожий произвольный текст не должен заменяться — задача 1.
- Шаблон и preview должны быть разными артефактами; демонстрационное имя не попадает в массовую рассылку — задача 1.
- Добавленная ссылка логотипа не должна породить вложенный anchor или изменить line box — задача 3.
- Сериализатор не должен потерять Unicode/Mail.ru marker/MSO separation — задача 2.
- Результат с требуемым, но незаполненным NPS/footer URL не должен стать готовым пакетом — задача 4.

## Карта файлов

Новые: scripts/lib/email-template-rules.mjs и email-service-fragments.mjs; tests/rendering/email-template-rules.test.mjs, email-service-fragments.test.mjs, email-managed-links.test.mjs.

Изменения: data/delivery/profiles.yaml; scripts/lib/email-renderer.mjs, email-interpreter.mjs, email-plain-text.mjs, email-altcraft-package.mjs, email-delivery.mjs; render-email-preview.mjs; tests/rendering/email-delivery.test.mjs; tests/skills/email-source-delivery.test.mjs. Обновить узкое описание выпуска/workflow и bootstrap проверки только при реальном изменении регистрации/команд. SKILL.md не содержит копий шаблонов или URL.

## Задача 1 Адресная персонализация

**Interfaces:**

    planTemplateRules({ model, inventory, profile })
      -> { rules: TemplateRule[], diagnostics: Diagnostic[] }
    emitGreetingTemplate({ rule, originalText }) -> string
    buildPersonalizationPreview({ emissionInput, scenario }) -> PreviewEmissionInput

TemplateRule: kind='conditional-greeting', bindings, original_text, emitted_template. bindings адресуют текстовый slot/run конкретного instance, а не байтовый поиск во всём HTML. scenario содержит только first_name для демонстрации; это не общий интерпретатор языка Альткрафта.

PreviewEmissionInput содержит копию логической model, dependencies, deliveryDocument, inventory и planTemplateRules result с purpose=preview. Функция меняет только адресованные preview text bindings в этой копии; final emission получает исходный template plan. Таким образом формат входа одинаков, но значения демонстрации не могут оказаться в final document.

- [x] Зафиксировать exact-greeting-is-replaced, nbsp-greeting-is-recognized, repeated-greetings-share-policy, near-match-unchanged, greeting-style-preserved, preview-name-not-in-final-template.
- [x] Найти самостоятельное приветствие «Здравствуйте, Имя!» в логическом text-slot или самостоятельном greeting run. Для сравнения нормализовать NBSP и краевые пробелы; не менять окружающий текст. Если оно является частью длинного текстового блока, адресовать только доказанную границу greeting run. Не заменять фразу внутри адреса, исходного кода или другого текста.
- [x] Выпускать точный однострочный шаблон Spec. Не добавлять переносы внутри условного выражения, чтобы plain-text primitive не превратил их в br. Не вводить неподтверждённые функции escaping языка Альткрафта.
- [x] Применять правило на эмиссии после проверки исходного source fidelity. Логическая модель сохраняет исходную фразу; отчет фиксирует адрес правила и ожидаемое преобразование.
- [x] Текстовая версия применяет то же semantic rule. Одиночный brace-syntax профиля не преобразуется в найденную в экспорте double-brace запись вручную.
- [x] Preview создаётся отдельно для имени «алексей», отсутствующего имени и длинного русского имени; значения экранируются как обычный текст HTML. Имя/preview URL/временный результат не записываются в final package или reusable template.
- [x] Terra выполняет node --test tests/rendering/email-template-rules.test.mjs и локально сравнивает стили/геометрию greeting preview с исходным контрактным текстом.

## Задача 2 Служебное начало и отписка

**Interfaces:**

    buildEmailServiceFragments({ deliveryDocument, profile })
      -> { preheader: ProtectedFragment, padding: ProtectedFragment, snippetEnd: ProtectedFragment }

ProtectedFragment: kind, html, protected=true. Plain text не включает preheader padding или marker. Порядок фрагментов определяется renderer, не порядком полей формы.

- [x] Зафиксировать preheader-padding-marker-body-order, marker-is-invisible, spacer-codepoints-preserved, footer-unsub-slot-has-exact-token, plain-text-has-unsub.
- [x] Скрытый прехедер получает экранированный пользовательский текст. Padding и snippetEnd создаются один раз перед видимым body; они не повторяются внутри каждого Mobile/Desktop блока.
- [x] Marker выпускается в согласованной paired-tag форме из Spec, включая U+034F, U+200C и последующий пробел. Для source fixture assert.deepEqual(codePoints, [0x034f, 0x200c, 0x20]) на соответствующем invisible префиксе.
- [x] Передать служебные фрагменты serializer как protected. Не объединять их с ordinary CSS и не удалить как технические комментарии.
- [x] Отписка заполняет существующий href_slot посредством managed profile binding. Сохраняет underline/color/target; не добавляет скопированные id/data-name. Plain text содержит тот же служебный адрес.
- [x] Terra выполняет node --test tests/rendering/email-service-fragments.test.mjs tests/rendering/email-plain-text.test.mjs. Это доказательство корректной записи, а не Mail.ru delivery PASS.

## Задача 3 Логотип и постоянные адреса

**Interfaces:**

    applyOutputLink({ html, origin, outputBindings, existingAnchorContext })
      -> { html: string, diagnostics: Diagnostic[] }

origin сохраняет исходный component_id, полный instance_path, viewport и original element_id. outputBindings формируются этапом 1; метод не угадывает владельца по filename/alt/порядку img. Hook применяется до сериализации на одном emitted элементе.

- [x] Зафиксировать both-header-logos-have-fixed-link, unrelated-images-not-wrapped, wrapper-keeps-dimensions, existing-anchor-conflict-rejected, all-store-actions-have-role-url.
- [x] Передавать происхождение зарегистрированной output-only logo role от подготовки элемента до примитива direct-image. Существующий контракт не получает synthetic action; внутренний emission context хранит его отдельно.
- [x] Оборачивать только целевой логотип ссылки Header. Использовать существующий link primitive с контролем размеров/line box. Не создавать nested anchor; при конфликтующей существующей ссылке — адресная диагностика.
- [x] HTML escape превращает & в &amp;, а декодированный href остаётся точно https://1cupis.ru/?utm_source=crm&utm_medium=email&utm_campaign=logo. Footer-site не наследует этот адрес.
- [x] Проверить четыре store-role bindings к существующим href-slots в каждом присутствующем экземпляре App-Download обеих версий. Отдельное QR-действие остаётся самостоятельным полем, если требуется.
- [x] Terra выполняет node --test tests/rendering/email-managed-links.test.mjs и локальные visual comparisons Header/App-Download на Mobile/Desktop. Проверить отсутствие изменения размеров, позиции, изображения, расстояний и текста.

## Задача 4 Собранный выпуск и handoff

**Consumes:** template rules, service fragments, managed link hook, serializer и package builder.

**Produces:** локально проверяемый final package с profile/rule versions; external_acceptance=not-run; краткий внешний checklist. Нет автоматической установки навыков или merge.

- [x] Дополнить финальную проверку cases missing-nps-blocks-final, missing-footer-support-blocks-final, absent-nps-does-not-add-blocker, preview-is-labelled-incomplete, final-contains-no-example-or-preview-values.
- [x] Добавить integration fixture полного синтетического письма: Header, greeting, пользовательская кнопка, App-Download, Footer и условный NPS. При всех заданных обязательных URL выпуск проходит; удаление любого требуемого NPS/footer URL останавливает ZIP до публикации.
- [x] Сопоставить каждый итоговый anchor с ожидаемым action inventory или managed output role. Обе viewport-ветви имеют правильный адрес; скрытые/отсутствующие экземпляры не создают лишних требований. Не выдавать корректный URL-синтаксис за готовность к отправке.
- [x] Проверить plain text, subject/sender metadata, HTML flags, relative assets, Unicode fragments и CSS budget в одном собранном пакете. Ничего из account-specific export metadata не должно попасть в ZIP.
- [x] Обновить только реально изменённые машинные источники workflow/bundle/команд и компактные границы skill handoff. Если изменена регистрация или install payload, обновить bootstrap/skill verification и инструкцию восстановления; иначе не расширять их ради HTML-рецептов.
- [x] Независимый review проверяет исходные требования и фактическую разрешённую область, не полагаясь на самооценку исполнителя или одни тесты. При создании агента — Terra medium none; неоднозначная архитектура остаётся координатору.
- [x] После публикации точного финального cloud commit Terra выполняет npm run verify и релевантную локальную визуальную приёмку. Результат сообщает только что запускалось, failures/root cause/changes/final status. Проверки Actions/PR Checks не читать.
- [x] Итоговый handoff содержит локальный результат, размер HTML, незаполненные/внешние ограничения и внешнюю приёмку not-run. Коммит этапа: feat: apply managed Altcraft greeting and email service rules. Новый draft PR можно связать с задачей после разрешённой реализации; Новый PR не сливать без отдельной команды.

## Внешняя проверка команды

Команда может отдельно подтвердить обработку имени/пустого имени, реальную отписку, Mail.ru snippet и Яндекс/Outlook. Эти действия не выполняются агентом и не составляют пятый этап разработки. Пользовательский результат фиксируется именно как внешнее свидетельство с указанной областью, без расширения его на все клиенты.

## Локальная приёмка

Локальная приёмка завершена для candidate `37d0c4601bd6888437f36d8bf8acdf319acf2798`: verify из package.json (npm run validate && npm test), выполненный прямыми Node-командами: node scripts/validate-system.mjs и полный набор семи групп из scripts.test — 2175/2175 PASS, 0 FAIL/cancelled/skipped, 465981 ms; точный Git HEAD и изолированный Git-контекст, CUPIS_SYSTEM_COMMIT этого candidate, bundled Python и проверенный same-lock cache; generate-docs --check и bootstrap/verify.ps1 PASS; независимое review production на f837 и отдельная визуальная приёмка на 6e6d связаны проверенной идентичностью исходников. Внешняя приёмка импорта, отправки и почтовых клиентов — not-run. На момент candidate PR119 был draft и не слит; позднейшая интеграция зафиксирована в текущей общей записи выше.

## Результат этапа

Служебные правила работают автоматически в локально проверенном выпуске. Пользователь заполняет только данные конкретного письма, постоянные значения поступают из профиля. Инструкции навыка остаются тонкими; компонентные контракты и Фигма сохранены.
