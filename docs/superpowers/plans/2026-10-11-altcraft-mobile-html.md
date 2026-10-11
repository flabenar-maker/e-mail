# Этап 2 Мобильная основа HTML и десктопные правила

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Delegate routine local tests and all visual comparisons to gpt-5.6-terra, medium, fork_turns=none. Steps use checkbox syntax.

**Goal:** Выпускать согласованный профиль Альткрафта с мобильной версией по умолчанию, правильным десктопным переключением и изолированными правилами Outlook.

**Architecture:** Профиль передаётся в контрактный интерпретатор до формирования HTML. Он меняет стратегию эмиссии выбранных Mobile/Desktop-фактов, а не сами факты. Оболочки объединяются только при доказанном совпадении; необходимые split-ветви сохраняются.

**Tech Stack:** Node 24, существующий интерпретатор/HTML primitives, локальная среда браузерных проверок проекта.

**Spec:** ../specs/2026-10-11-altcraft-html-release.md

## Статус реализации

Код опубликован в draft [PR №119](https://github.com/flabenar-maker/e-mail/pull/119); итоговая локальная приёмка ещё выполняется. Реализован профиль с мобильной основой: десктоп включается только при одновременной достаточной ширине окна и устройства; Outlook получает отдельную условную ветвь. Сохраняются существующие доказательства структурного соответствия Mobile/Desktop и полный учёт обычного и MSO CSS.

Исторические source/Figma/install pins сохранены. Установленные тонкие навыки менять или переустанавливать не требуется: восстановление получает зарегистрированные источники и обновлённый workflow. Внешняя проверка импорта, отправки и почтовых клиентов — not-run; слияние PR не выполнено.

## Global Constraints

- Зависит от этапа 1: профиль, загрузчик и delivery handoff уже существуют.
- Component contracts и data/foundations/rendering.yaml не меняются.
- Правила desktop: min-width:660px AND min-device-width:660px. Значение effective_fallback=mobile.
- Outlook-only desktop-правила остаются внутри conditional comments. Сохранить существующий MSO shell и фоны.
- Не объединять разные деревья по одинаковому тексту и не конвертировать весь проект в один DOM.
- Учитывать CSS budget 16384 bytes exclusive; сохранять image Fixed/Fill guards PR118. База реализации — слитый main b037987d9ab6df4cdc3f169fa6002212abc3580c; guards PR118 уже входят в неё.
- Все проверки локально Terra medium. Реальный Яндекс/Outlook не объявляется проверенным по browser screenshot.

## Review Focus

- Viewport 980px при device width 390px обязан оставаться мобильным — задачи 1 и 3.
- При удалении style мобильная ветвь видна ровно один раз — задачи 2 и 3.
- Односторонние M-only/D-only узлы не должны исчезать в своём режиме — задача 2.
- MSO-only CSS не должен попадать в общий CSS и управлять мобильным браузером — задача 2.
- Атрибуты изображений и скрытие split-ветвей не должны возвращать растягивание Fixed и принудительную ширину Fill — задача 3.

## Карта файлов

Новый scripts/lib/email-emission-profile.mjs; новый tests/rendering/email-emission-profile.test.mjs.

Изменения: data/delivery/profiles.yaml и его schema из этапа 1; scripts/lib/email-interpreter.mjs; email-renderer.mjs; email-primitives.mjs; email-preview.mjs; email-metrics.mjs; tests/rendering/email-interpreter.test.mjs, email-preview.test.mjs и visual-scenarios.test.mjs. Новые синтетические входы: tests/fixtures/rendering/altcraft-profile-scenarios.json. Screenshots и браузерный harness остаются в приватной папке проверок; verify-real-email-visual.mjs связывает evidence, но сам не снимает и не сравнивает картинки. Обновить core/email-rendering-standard.md только для явной стратегии выпуска и записи effective fallback.

## Задача 1 Явная стратегия вместо подмены foundations

**Interfaces:**

    resolveEmissionProfile({ deliveryProfile, renderingFoundation }) -> EmissionProfile
    createViewportRules({ profile, classes, mobileDisplay, desktopDisplay })
      -> { ordinaryRules: string[], msoRules: string[] }

EmissionProfile: id, version, fallback_viewport, desktop_condition, mso_desktop, preserve_structural_splits. desktop_condition в altcraft-mobile-base-v1 содержит viewport_min_px=660 и device_min_px=660. Для вызова без delivery-профиля используется прежняя desktop-default стратегия. Незнакомый профиль даёт диагностику, а не молчаливый fallback.

- [ ] Зафиксировать tests profile-without-delivery-preserves-current-default, altcraft-profile-has-mobile-fallback, desktop-needs-both-widths, unknown-profile-rejected. assert.equal(profile.fallback_viewport, 'mobile'); обе границы равны 660.
- [ ] Добавить строго типизированную конфигурацию стратегии в профиль и её проверку, сохраняя исходный renderingFoundation неизменным. Хранить ширины в профиле, не повторять их в нескольких строках рендера.
- [ ] Реализовать модуль emission profile. OrdinaryRules включают обратное переключение split-ветвей только внутри условия desktop. msoRules предназначены только для условной MSO-обёртки; общий style их не содержит.
- [ ] Terra выполняет node --test tests/rendering/email-emission-profile.test.mjs. Готово: выбор стратегии явный и проверяемый.

## Задача 2 Выпуск выбранных ветвей и MSO

**Consumes:** EmissionProfile и createViewportRules.

**Produces:** renderContractTree получает emissionProfile; возвращает html, css, msoCss, diagnostics. renderEmailDocument собирает отдельный ordinary style и MSO conditional style, записывает emission_profile и effective_fallback в служебную информацию результата.

- [ ] Зафиксировать cases no-css-shows-mobile, desktop-shows-desktop-once, mobile-only-node-visible-without-css, desktop-only-node-visible-on-desktop, shared-shell-remains-shared, mso-rules-stay-conditional. Для профиля Mobile wrapper не hidden inline; Desktop wrapper hidden inline с collapse. Существующее поведение без профиля сохраняется.
- [ ] В renderSplit выбирать hidden по fallback_viewport, не по фиксированным mobile=true/desktop=false. Стратегия точно восстанавливает native display/max-height/overflow при переключении; не ставить display:block на табличные элементы, которым требуется table/table-row/table-cell.
- [ ] Сохранить renderPaired доказательство совпадения оболочек. Изменение профиля не является разрешением объединять несовпадающие shells, фоны или элементы с условной visibility.
- [ ] Для MSO гарантировать исключение мобильной split-ветви через downlevel-revealed non-MSO conditional wrapper. Десктопное содержимое оставлять доступным MSO с отдельными conditional helper rules; не полагаться на наследование display:none от div для скрытия таблиц Word. Не дублировать полный Desktop DOM третьим деревом.
- [ ] Не переписывать width/height атрибуты одной ветви значениями другой. Все background/VML и существующая MSO shell сохраняют свои native данные.
- [ ] Передавать профиль через renderComponent, renderContractTree и контекст вложенных вызовов. Изменить renderEmailDocument так, чтобы обычный и MSO CSS были отдельными фрагментами.
- [ ] В метриках и CSS budget учитывать сумму обычного и MSO CSS в байтах UTF-8. Не прятать превышение перенесением правил в conditional style.
- [ ] Terra выполняет node --test tests/rendering/email-emission-profile.test.mjs tests/rendering/email-interpreter.test.mjs. Готово: локальные структурные проверки подтверждают переключение и MSO-изоляцию; реальное отображение Word остаётся внешней приёмкой.

## Задача 3 Локальная геометрия и совместимость

**Files:** tests/rendering/email-preview.test.mjs, email-emission-profile.test.mjs, visual-scenarios.test.mjs; tests/fixtures/rendering/altcraft-profile-scenarios.json. Локальный браузерный harness и изображения вне source; проверки visual-scenarios являются структурными и не заменяют реальное сравнение screenshot. Реальные вложенные письма не копировать в GitHub fixtures.

- [ ] Добавить synthetic fixtures для shared tree, split footer, неодинаковых размеров Mobile/Desktop, картинки Fixed рядом с Fill и one-sided visibility.
- [ ] Terra сравнивает изображения нового профиля с прежним контрактным рендером соответствующего viewport: 375, 390, 659, 660, 800px; viewport=980/device=390; отдельный CSS-stripped preview.
- [ ] В каждом режиме проверить единственный видимый экземпляр каждого логического блока, отсутствие горизонтального переполнения, совпадение текста/изображений/геометрии и требуемое переключение на границе. Допустимы только изменения видимости, заданные профилем; визуальный дизайн сохраняется.
- [ ] Проверить Fixed min-width guard и Fill inert-axis guards против PR118, включая вложенный layout и фоновое изображение. Не устранять различия изменением component facts.
- [ ] В preview поддержать выбранную emission strategy без отдельной копии HTML-логики. Отчёт показывает profile/fallback; он не заявляет Yandex/Outlook PASS.
- [ ] Terra выполняет затронутые тесты и visual comparisons, возвращает только выполненные проверки, failures/root cause/changes/final status. Обычные визуальные исправления не эскалируются; архитектурные или неоднозначные требуют анализа координатора.
- [ ] Опубликовать отдельный этап после согласования плана. Коммит: feat: add mobile-base HTML emission profile for Altcraft. При изменении cloud SHA повторить релевантную локальную проверку точного результата. Никаких Actions; новый PR не сливается без отдельного разрешения.

## Результат этапа

Работающий локально профиль HTML с мобильной основой и изолированным десктопом. Browser/структурная приёмка фиксируется отдельно от внешней приёмки, которая имеет not-run. Следующий этап сериализует и упаковывает уже выбранную стратегию, не меняет её постобработкой.
