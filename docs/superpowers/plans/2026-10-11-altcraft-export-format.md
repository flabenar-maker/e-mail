# Этап 3 Структурная запись HTML и пакет Альткрафта

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Routine tests, archive regression and all visual comparisons belong to gpt-5.6-terra, medium, fork_turns=none. Steps use checkbox syntax.

**Goal:** Выпускать читаемый структурированный HTML и полный пакет Альткрафта с параметрами, текстовой версией и проверенными изображениями, сохраняя дизайн.

**Architecture:** Рендер остаётся владельцем геометрии. Отдельная lossless-сериализация управляет только записью разметки; упаковщик пересчитывает только объявленные ресурсные ссылки и строит файл-набор полного формата. Предпросмотр и ZIP публикуются одной новой версией атомарно.

**Tech Stack:** Node 24, существующие HTML modules; небольшой deterministic ZIP store writer без внешнего архиватора. Для независимого чтения ZIP в локальной проверке используется доступный bundled Python zipfile, без установки зависимостей.

**Spec:** ../specs/2026-10-11-altcraft-html-release.md

## Global Constraints

- Зависит от этапов 1 и 2. Реальные файлы и наполненные параметры остаются вне source.
- Не менять геометрию, текстовые пробелы, p/br, атрибуты, порядок контента, внутренние байты protected fragments и изображения.
- Исправлять структуру записи по агентским образцам, не воспроизводить произвольные ручные переносы. Наблюдение пользователя о работе Альткрафта принято; универсальный алгоритм парсера платформы не заявляется.
- Ни фиксированного лимита длины строки, ни replace('><', '>\n<') как форматировщика.
- Базовые пути модели остаются images/*. ../images/* допустимы только как вычисленный адрес существующего файла внутри целевого полного пакета.
- Не смешивать simple/full import formats; не копировать чужой template.json, IDs, suppression/group/account settings.
- Все проверки локально Terra medium; никаких попыток скрыто подключиться к аккаунту Альткрафта.

## Review Focus

- Пробел между соседними inline-link/span/image меняет ширину или текст — задача 1 и 4.
- Шаблонные выражения, Unicode spacer и условный MSO могут быть испорчены обычным HTML-парсером — задача 1.
- CSS url и VML background могут ссылаться на изображение вне обычного img src — задача 2.
- Пустой sender-файл может стереть наследуемое значение — задача 3.
- Повторные viewport-ветви не должны удвоить текстовую версию; ошибки записи не должны оставлять готовую неполную версию — задачи 3 и 4.

## Принцип оформления по приложенным файлам

Два агентских файла и export используют структурные строки table/tbody/tr/td, отдельные законченные блоки и комментарии; открывающий тег с атрибутами сохраняется цельным. Export в целом сохраняет организацию агентского письма №2. Во всех трёх preheader/spacer занимает одну длинную строку: общий максимум 3618 символов относится к этому фрагменту, а не к пределу строк Альткрафта.

Для нашего генератора выбирается последовательная запись по вложенности с отступом 2 пробела. Это собственное правило читаемости, не заявленное требование платформы. Между законченными логическими блоками — одна пустая строка. Текстовые острова, inline-последовательности, полные атрибуты, macro tokens, VML/MSO-comments и preheader padding остаются цельными. Пустые строки находятся только на безопасных структурных границах.

## Карта файлов

Новые: scripts/lib/email-html-serializer.mjs; email-resource-references.mjs; email-plain-text.mjs; email-altcraft-package.mjs; zip-store.mjs. Новые tests/rendering/email-html-serializer.test.mjs, email-resource-references.test.mjs, email-plain-text.test.mjs, email-altcraft-package.test.mjs, zip-store.test.mjs.

Изменения: scripts/lib/email-output.mjs, email-metrics.mjs, email-renderer.mjs и email-build-orchestration.mjs; scripts/render-email.mjs; data/delivery/profiles.yaml; tests/rendering/email-output.test.mjs. Workflow экспортирует новые разрешённые outputs; manifest/bundle содержит профиль, schema и описание формата. Никаких изменений component facts.

## Задача 1 Сериализация без изменения содержимого

**Interfaces:**

    serializeEmailHtml({ html, blockBoundaries, protectedFragments, indentWidth })
      -> { html: string, diagnostics: Diagnostic[] }

blockBoundaries содержит подтверждённые границы emitted блоков/экземпляров. protectedFragments адресует служебные фрагменты и текстовые острова. Они создаются из emission-происхождения, не из угадывания по маркетинговым текстам. Предусмотрен lossless scanner контролируемой HTML-грамматики: кавычки атрибутов, raw style payload и conditional comments учитываются до поиска границ. Никакого browser DOM parse → outerHTML, который нормализует шаблоны или MSO.

- [ ] Зафиксировать cases structural-lines-not-one-stream, inline-text-is-byte-preserved, attributes-and-urls-unchanged, mso-fragment-unchanged, padding-codepoints-unchanged, serialization-is-idempotent. Для protected fragment assert.equal(afterSlice, beforeSlice); для повторного вызова assert.equal(second.html, first.html).
- [ ] Читать токены с сохранением исходных байтов. Добавлять indentation/LF на безопасных table/tbody/tr/td границах и между отдельными блоками; не пересобирать открывающие теги из attribute map.
- [ ] Максимальные текстовые и inline-острова сохранять без внутреннего форматирования. Leaf cell с прямым текстом не получает добавленных текстовых whitespace. Не разрезать соседние inline elements, в том числе элементы кнопок icon+text.
- [ ] Protected MSO/VML и preheader fragments расположить в структуре документа без изменения их внутренней записи. Комментарии границ блоков делать короткими и понятными; не вставлять их между частями inline-текста.
- [ ] Генерируемый обычный CSS записывать отдельным style-блоком с границами правил/деклараций из их структурного построителя. Существующие непрозрачные payload CSS не переформатировать. Переносы внутри quoted URL и значений запрещены.
- [ ] Предупреждение синтаксиса сериализации останавливает final release, а не запускает generic formatter fallback. После сериализации повторно измерять финальный HTML/CSS, учитывая добавленные байты.
- [ ] Terra выполняет node --test tests/rendering/email-html-serializer.test.mjs. Готово: структурная запись и сохранность payload доказаны локально.

## Задача 2 Все ресурсные ссылки и rebasing

**Interfaces:**

    collectResourceReferences({ html }) -> ResourceReference[]
    rebasePackageResources({ html, assetPaths, htmlEntry, assetRootEntry })
      -> { html: string, references: ResourceReference[], diagnostics: Diagnostic[] }

ResourceReference: kind, source_start, source_end, raw_value, resolved_asset_path. Реальная замена выполняется по точным диапазонам в обратном порядке. htmlEntry='email/html.html', assetRootEntry='images'. Нельзя заменить похожую строку внутри href, обычного текста, macro или постороннего CSS.

- [ ] Зафиксировать references-cover-img-css-background-and-vml, exact-case-is-required, rebase-keeps-url-escaping, undeclared-asset-rejected, output-path-remains-inside-package. src/background/CSS url/VML получают адрес ../images/<имя>; нересурсный href с похожим текстом остаётся прежним.
- [ ] Поддержать одинарные/двойные кавычки, HTML entity decoding при сопоставлении ресурса и сохранение нужного quoting при записи. Не разрешать произвольный ../ на уровне email-model или validate-local-src.
- [ ] Проверить каждый target по нормализованному пути, существованию объявленного файла и точному case. Отказаться от абсолютного пути, backslash, URL схемы для локального ресурса и выхода из package root.
- [ ] Сохранить byte hash копируемых изображений. CSS background и VML reference должны ссылаться на тот же файл, что и fallback img.
- [ ] Terra выполняет node --test tests/rendering/email-resource-references.test.mjs. Готово: пути корректны для нового расположения HTML без ослабления старых защит.

## Задача 3 Текстовая версия и полный файл-набор

**Interfaces:**

    buildPlainText({ model, inventory, deliveryDocument, profile }) -> string
    buildAltcraftEntries({ html, assetBuffers, deliveryDocument, plainText, profile })
      -> { entries: { path: string, bytes: Buffer }[], diagnostics: Diagnostic[] }

assetBuffers содержит уже проверенные declared path → bytes. entries не содержит абсолютных файловых путей, данных формы или служебного отчёта. subject обязателен в final; optional sender/reply_to файлы создаются только для явно заданных значений. is_amp.txt='false', is_not_inline.txt='true'.

- [ ] Зафиксировать plain-text-is-not-duplicated-by-viewports, plain-text-excludes-hidden-service-fragments, unsub-is-present-in-both-versions, inherited-sender-files-are-omitted, full-format-not-mixed-with-simple.
- [ ] Генерировать text.txt из логического содержания и действий, не из regex strip tags двух готовых viewport-деревьев. Разные структуры представления одной сущности не удваивают абзацы. Противоречащие тексты двух версий дают диагностику, а не случайный выбор.
- [ ] Для ручного text.txt проверить необходимые служебные ссылки; пользовательский текст не переписывать молча. На этапе 4 персонализация/отписка применяются и к plain text через тот же policy.
- [ ] Построить email/html.html, subject.txt, text.txt и заданные sender/reply_to файлы, profile flags, images/. Не добавлять inactive AMP и не копировать export template.json.
- [ ] Обычный email.html предпросмотра хранит images/*; пакетный html.html получает rebase. Сериализовать каждый результат после собственных преобразований пути, сохраняя один алгоритм оформления.
- [ ] Terra выполняет node --test tests/rendering/email-plain-text.test.mjs tests/rendering/email-altcraft-package.test.mjs. Готово: структуру пакета можно проверить без аккаунта Альткрафта.

## Задача 4 ZIP и атомарный выпуск

**Interfaces:**

    encodeZipStore(entries) -> Buffer
    publishFileSetAtomically({ outputDir, entries }) -> Promise<{ outputDir, files }>

ZIP store method=0, UTF-8 names, CRC32 и фиксированное допустимое DOS time, entries отсортированы. ZIP64 не нужен для наших писем: превышение 65535 entries или uint32 size/offset отклоняется. Не вводить дефлятор ради уже сжатых PNG/JPEG и не полагаться на внешний архиватор.

- [ ] Зафиксировать standard-zip-reader-can-open-package, zip-crc-and-bytes-match, invalid-entry-path-rejected, failed-write-leaves-no-final-version, existing-version-not-overwritten. Независимую проверку ZIP выполняет bundled Python zipfile через Terra, а не второй самописный reader той же реализации.
- [ ] Реализовать ZIP writer с относительными нормализованными entry names. Отклонить duplicates и escape paths. Буфер каждого изображения после независимого чтения ZIP должен совпадать побайтно.
- [ ] Выделить общий безопасный atomic file-set publisher из существующего email-output, сохранив publishEmailAtomically старый интерфейс и защиту непустой папки. Staging находится рядом с target, cleanup затрагивает только собственный проверенный путь.
- [ ] Новая версия содержит предпросмотр email.html/images, altcraft.zip и release-report.json; при необходимости локальную копию DeliveryDocument вне ZIP. Никаких source email overwrite.
- [ ] Отчёт содержит hashes/counts, html_bytes/css_bytes, serializer/profile version, link readiness, local checks и external_acceptance=not-run. Размер HTML показывать отдельно от ZIP/images; повышенный размер не устранять удалением нужных ветвей.
- [ ] Terra выполняет node --test tests/rendering/zip-store.test.mjs tests/rendering/email-output.test.mjs tests/rendering/email-altcraft-package.test.mjs; независимо читает собранный ZIP и сравнивает declared references/actual files/hashes.
- [ ] Terra сравнивает до/после сериализации и распакованного пакетного HTML на 375/390/660/800px и CSS-stripped режиме. Требование: геометрия, текст, порядок, все изображения и ссылки сохранены. Это не проверка импортера Альткрафта.
- [ ] Подключить новый exporter к build handoff и разрешённым outputs workflow. Публикация этапа после согласования: feat: emit structured HTML and full Altcraft packages. Историческая ветка PR118 сохраняется; новый PR требует отдельного разрешения на слияние.

## Ручная проверка команды

Выдать краткие действия: импортировать один новый ZIP привычным способом, открыть HTML editor, проверить распознавание групп и изображений без ручного редактирования, сохранить и при возможности выгрузить шаблон. Результат или изменённый HTML пользователь может сообщить/передать позднее. Агент не запускает импорт и не ждёт обязательного полного доступа для завершения локальной кодовой части. Пока результата нет, external_acceptance=not-run.

## Результат этапа

Читаемый HTML, полноценный файл-набор параметров и ZIP с доказанной локально сохранностью ресурсов и отображения. Проблема организации исходника исправляется по принципу приложенных примеров; фактическое распознавание Альткрафтом подтверждает команда отдельно.
