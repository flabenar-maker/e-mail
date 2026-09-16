# CUPIS Email Client Resilience Design

Дата: 2026-09-16.

Статус: архитектура согласована; реализация запланирована внутри этапа 8, Package 10.

## 1. Назначение

Документ определяет, как CUPIS renderer должен сохранять читаемость и проверяемость письма в целевых почтовых клиентах, не подменяя фактические Figma-контракты внешними шаблонами и не добавляя визуальные значения по предположению.

Область охватывает шесть связанных задач: fallback без `<style>`, минимальную поддерживаемую ширину, бюджет embedded CSS, язык и направление документа, явную alt-семантику и политику тёмной темы.

## 2. Границы

Изменения относятся к rendering foundation, временной модели письма, renderer shell, email-примитивам, диагностике и QA этапа 8.

Они не:

- меняют размеры, отступы, цвета, структуру или assets компонентов;
- меняют Figma без отдельного подтверждённого клиентского дефекта и отдельного разрешения;
- заменяют Mobile/Desktop component contracts общей эвристикой;
- добавляют VML, Outlook-only ветви, `@font-face` или dark-mode image swapping;
- считают browser preview доказательством поведения конкретного почтового клиента;
- выводят размер MIME из размера локального HTML.

## 3. Источники и доказательства

- CUPIS `main@fa080508446e06afe3a986fb5380636b6503a1ec` — текущая реализация до этой доработки.
- Research PR #60 — внешние email-практики и их сопоставление с CUPIS; этот PR остаётся исследовательским и не меняет active rules.
- Email Guidelines — отсутствие `<style>` в отдельных клиентах и повторение `lang` на внутреннем wrapper.
- Gmail style-limit test — совокупный embedded CSS должен быть строго меньше 16 384 UTF-8 байт.
- Cerberus и Good Email Code — только источник низкоуровневых email-паттернов; их компонентная модель не переносится в CUPIS.
- Can I Email — данные по отдельным возможностям, а не готовая стратегия целевых приложений Яндекс Почты и Mail.ru.

## 4. Владельцы данных

| Данные | Единственный владелец | Не хранить |
|---|---|---|
| Точные общие параметры client resilience | `data/foundations/rendering.yaml` | Core prose, component contracts |
| Допустимая форма параметров | `schemas/rendering.schema.json` | renderer code constants |
| Язык, направление и alt-решение конкретного письма | email model | component description, Figma prose |
| Геометрия и визуальные значения компонента | component contracts и foundations | client policy |
| Генерация HTML | renderer/interpreter/primitives | generated docs |
| Доказательство поведения в клиенте | Package 10 QA evidence | предположения в contracts |

## 5. Rendering foundation

Rendering foundation получает точные машинные поля.

```yaml
shell:
  background_color: '#F3F3F5'
  horizontal_inset_px: 15
  max_width_px: 600
  min_supported_viewport_px: 300

embedded_css:
  max_bytes_exclusive: 16384

color_scheme:
  declaration: none
  dark_variant: none

responsive_fallback:
  without_embedded_css: desktop
  validation: required-before-change
```

`min_supported_viewport_px` означает ширину всего доступного viewport, а не ширину внутренней таблицы. Минимальная доступная ширина content вычисляется renderer как `min_supported_viewport_px - 2 * horizontal_inset_px`; отдельная константа `270` не хранится.

`max_bytes_exclusive: 16384` означает `Buffer.byteLength(css, "utf8") < 16384`. Значение `16384` уже является ошибкой.

`color_scheme.declaration: none` означает, что renderer не выводит `color-scheme`, `supported-color-schemes` или `prefers-color-scheme`. `dark_variant: none` запрещает автоматическое переключение assets.

`responsive_fallback.without_embedded_css: desktop` сначала фиксирует фактическое текущее поведение. Поле не разрешает считать его окончательно подходящим целевым клиентам: смена значения допускается только после Package 10D.

## 6. Язык и направление

Email model обязан содержать:

```json
{
  "metadata": {
    "language": "ru",
    "direction": "ltr"
  }
}
```

`language` — валидный BCP 47 tag. `direction` — только `ltr` или `rtl`. Значения обязательны и не угадываются renderer.

Renderer выводит оба атрибута на `<html>` и на единственном внутреннем content wrapper внутри `<body>`, чтобы семантика сохранялась после удаления внешней оболочки webmail-клиентом.

## 7. Alt-семантика

Значение `alt-text` в email model становится tagged value:

```json
{
  "type": "alt-text",
  "purpose": "informative",
  "value": "Описание изображения"
}
```

или:

```json
{
  "type": "alt-text",
  "purpose": "decorative",
  "value": ""
}
```

Инварианты:

- `informative` требует непустой `value` после проверки длины; renderer не генерирует текст;
- `decorative` требует ровно пустую строку;
- отсутствие `purpose` или `value` блокирует сборку;
- каждый rendered `direct-image` получает явно разрешённый `alt`;
- primitive не использует `props.alt ?? ""` и не превращает отсутствие решения в декоративное изображение;
- component contract определяет наличие и тип `alt-text` slot, но actual purpose принадлежит конкретному email instance.

Перед включением обязательности выполняется read-only аудит всех `direct-image` элементов. Недостающий `alt-text` slot фиксируется как contract blocker и не добавляется по догадке.

## 8. Responsive fallback и минимальная ширина

Текущая схема показывает Desktop inline и включает Mobile через media query `max-width:659px`. Package 10 сначала создаёт два диагностических представления одного HTML:

1. обычное — с generated `<style>`;
2. no-style — с полностью удалёнными `<style>` без других изменений.

Оба проверяются на viewport `300`, `320`, `360` и `600` px. Browser gate подтверждает отсутствие горизонтального scroll и читаемость, но не заменяет client test.

После доставки того же письма через Altcraft проверяются мобильные приложения Яндекс Почты, Mail.ru и Gmail с фиксацией ОС, версии приложения и типа аккаунта.

Decision gate:

- если embedded CSS применяется в целевых сочетаниях, сохраняется Desktop baseline;
- если существенный целевой клиент удаляет `<style>`, предпочтительный следующий вариант — Mobile-first baseline;
- hybrid single-tree рассматривается только если Mobile-first не обеспечивает приемлемый desktop fallback;
- изменение baseline выполняется отдельным reviewable commit после зафиксированного результата, а не внутри тестовой подготовки.

## 9. Output metrics и диагностика

Renderer вычисляет embedded CSS bytes после окончательной сборки CSS и до postprocessing/output. При превышении лимита сборка возвращает стабильную blocking diagnostic.

Локально измеряются:

- `embedded_css_bytes`;
- `html_bytes`.

MIME size не вычисляется локально. Если он нужен, значение фиксируется после обработки Altcraft и не становится производной формулой от HTML.

## 10. Тёмная тема

До отдельного решения renderer сохраняет точные Figma-подтверждённые цвета и assets и не заявляет поддержку dark scheme.

Реальная клиентская проверка оценивает логотип, текст, фоны и CTA в доступных светлом и тёмном режимах. Подтверждённое расхождение сначала классифицируется:

- shell/client policy;
- конкретная component implementation;
- asset/Figma defect.

Только третий случай создаёт отдельную Figma-задачу с mutation gate. Автоматическая подложка запрещена.

## 11. Интеграция в этап 8

Package 10 делится на четыре обязательных подпакета:

- **10A — Exact policy and model:** rendering foundation/schema, metadata и alt model.
- **10B — Renderer implementation:** shell, primitive, interpreter, diagnostics и metrics.
- **10C — Automated and browser resilience:** normal/no-style scenarios, exact widths, CSS boundary и visual pilot.
- **10D — Altcraft client evidence and fallback decision:** целевые приложения, зафиксированный результат и отдельное решение о baseline.

Только после 10D выполняется финальный visual gate Package 10 для Email/Header, Email/Footer и пилотных блоков. Package 11 не начинается раньше завершения 10A–10D.

## 12. Критерии готовности

- Rendering foundation хранит все шесть точных политик без component-specific данных.
- Email model не проходит validation без `language`, `direction` и явной alt-семантики.
- `<html>` и внутренний wrapper получают одинаковые `lang` и `dir`.
- Совокупный embedded CSS проходит при `16383` байтах и блокируется при `16384`.
- На заявленной минимальной ширине normal preview не имеет горизонтального overflow.
- No-style preview создан и проверен отдельно, без выдачи его за конкретный клиент.
- Результат Altcraft-проверки содержит точные client coordinates и приводит к явному fallback decision.
- Dark-mode policy генерирует ровно объявленный результат и не добавляет графику.
- Figma и component visual contracts не меняются без отдельного подтверждённого дефекта.
- Все code/schema проверки выполняются локально на точном cloud SHA; GitHub Actions не используются.