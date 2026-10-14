# Raster Image Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить узкий пользовательский выбор для визуального расхождения содержательного растра без расширения разрешений на код и остальные части письма.

**Architecture:** Это изменение инструкций и evidence-процесса поверх существующей сборки и protected publication. Skill определяет eligibility и пользовательскую ветку; канонический asset standard хранит технические правила. Новых runtime, helpers или схем решений нет.

**Tech Stack:** Markdown-инструкции; существующие Node 24 тесты `node:test`; локальные pressure-прогоны поведения агента.

**Spec:** [Решение пользователя о растровом изображении](../specs/2026-10-14-raster-image-review-design.md)

## Global Constraints

- Этот PR содержит только spec и plan; ниже описана будущая отдельно разрешённая реализация.
- Eligibility: только фотографии и растровые иллюстрации в баннерах, карточках с изображениями и аналогичных блоках.
- Варианты пользователя: **Продолжаем / Остановись / Исправь сам**.
- Фактическая пара reference/rendered показывается до вопроса о критичности.
- Ожидание ответа не означает stop, согласие или разрешённый выпуск; elapsed time не заменяет ответ.
- Исключены иконки, логотипы, QR, кнопки, текст, UI-подписи, компоновка, ссылки и всё остальное.
- Missing/broken assets, wrong source/contract и HTML failures сохраняют прежние gates.
- Image-only исправление не меняет HTML/CSS/VML/template/renderer/contracts/schemas/исходную Figma.
- Числовой пример из запроса не является порогом; технические параметры остаются каноническими.
- Все проверки локальные; отдельный verification agent наследует выбранную модель.
- GitHub Actions и PR Checks не запускаются и не используются как quality evidence.

## Review Focus

- Смешанный дефект фото и геометрии: только фото допускает выбор; отдельный layout failure остаётся blocking (Task 1).
- PNG-логотип и JPEG-фотография: решение определяется ролью, а не форматом (Task 1).
- Молчание пользователя и срочный дедлайн: нет принятия или финального stop по таймеру (Task 1, Task 4).
- Уже принятое фото и новый crop/viewport: прежний ответ переиспользуется только при совпавшем виде и scope (Task 2, Task 4).
- Общий файл для двух viewport без допустимого image-only решения: показать неудачу и вернуть выбор (Task 2, Task 4).

---

### Task 1: Узкая ветка в навыке сборки

**Files:**
- Modify: `.agents/skills/building-cupis-emails/SKILL.md`
- Test: `tests/skills/email-build-skill-boundary.test.mjs`

**Interfaces:** Потребляет finding независимой визуальной проверки и существующий resolved workflow; выдаёт разрешённое действие или ожидание пользовательского ответа, без нового программного API.

- [ ] **Перед изменением skill:** выполнить контроль и baseline из Task 4 Step 1 на pinned исходных инструкциях; сохранить реальные ответы и подтвердить failure.
- [ ] **Step 1: Добавить новые failing assertions** в существующий boundary test с именами:
  `raster-image review is semantic and narrowly scoped`, `raster-image review shows evidence before the three choices`, `raster-image review waits without elapsed consent`.
  Проверить узкую content-raster роль, полный список исключений, порядок actual comparison → вопрос → exact labels, запрет молчаливого согласия и dependent publication.
  Assertions читают skill; негативные текстовые fixtures исключают blanket image-category и extension-only правила.
- [ ] **Step 2: Выполнить локальный RED**: `node --test --test-concurrency=2 --test-name-pattern="raster-image review" tests/skills/email-build-skill-boundary.test.mjs`.
  Ожидается FAIL новых assertions: baseline предлагает только missing links и сохранение работы при невозможности продолжить; новой ветки нет.
  Сохранить конкретные failing assertions, не утверждать RED до фактического запуска.
- [ ] **Step 3: Изменить skill**: условно заменить blanket stop для eligible visual finding, добавить разрешённый вопрос и exact labels.
  Сначала показать парную фактическую evidence, затем объяснить эффект и спросить критичность.
  До ответа описать ожидание и допустимую независимую работу; не объявлять готовый выпуск.
  Сохранить stop для иных ошибок, paused/blocked routes и технических gates.
  Добавить три последствия и запреты на изменение кода, остальных элементов и исходной Figma.
  Не вставлять в skill числовые параметры, component tables, core paths или workflow IDs; сослаться словесно на возвращённый asset standard.
- [ ] **Step 4: Выполнить локальный GREEN** той же командой; ожидается PASS всех новых assertions.
- [ ] **Step 5: Запустить весь существующий boundary test**: `node --test --test-concurrency=2 tests/skills/email-build-skill-boundary.test.mjs`.
  Ожидается PASS прежних `email-build skill obeys the resolver route boundary`, `email-build skill does not duplicate canonical material`, `email-build skill has no contradictory prohibited instructions`.
  Не ослаблять прежние guard fixtures ради нового текста.
- [ ] **Step 6: Commit** только skill и test: `git add .agents/skills/building-cupis-emails/SKILL.md tests/skills/email-build-skill-boundary.test.mjs`; `git commit -m "docs: add scoped raster image decision branch"`.

### Task 2: Image-only попытка и честная evidence

**Files:**
- Modify: `core/asset-export-standard.md`
- Test: `tests/skills/email-build-skill-boundary.test.mjs`

**Interfaces:** Потребляет ветку Task 1 и существующие asset-контракт/preflight; выдаёт локальную запись решения или попытки с actual digests, совместимую с действующим review/publisher.

- [ ] **Step 1: Добавить failing tests** `raster-image decisions preserve findings and scoped direct answers`, `raster-image repair stays within existing contracts`, `raster-image repair failure returns the user choice`.
  Читать skill и asset standard; проверить literal answer + image/viewport/appearance scope, отсутствие global PASS, повторный выбор после неудачи и неизменные технические gates.
  Негативные fixtures: чужой waiver, неизвестный source, wrong crop/output size, просьба исправить renderer, принятый прежний crop после изменения файла.
- [ ] **Step 2: RED**: `node --test --test-concurrency=2 --test-name-pattern="raster-image (decisions|repair)" tests/skills/email-build-skill-boundary.test.mjs`.
  Ожидается FAIL отсутствующих правил, а не ошибка импорта/теста.
- [ ] **Step 3: Дополнить asset standard** коротким процессом visual decision, отдельно от существующего resolution/preflight выбора.
  Продолжаем: сохранить finding, literal waiver и узкий scope; выполнить остальные QA/review и existing protected publisher.
  Остановись: сохранить локальную работу и остановиться по прямому ответу пользователя.
  Исправь сам: допустимы только re-export/crop/scale/processing изображения в рамках прежнего контракта; не обещать исправимость.
  Успех требует свежих bytes, render и сравнения; неудача показывается с актуальной парой и возвращает те же варианты.
  Новая image evidence использует существующие локальные записи, без новой схемы или helper.
  Сохранить source node/hash, asset, viewport, finding, reference/rendered refs, digests, literal decision и применённую операцию.
  Переиспользовать прежний прямой ответ лишь при совпавшем изображении, внешнем виде и scope; не переносить на другое письмо.
- [ ] **Step 4: GREEN** той же командой; ожидается PASS новых assertions и отсутствуют изменения numerical export facts.
- [ ] **Step 5: Повторить полный boundary test** после изменений; ожидается PASS, включая тонкость skill и все старые запреты.
- [ ] **Step 6: Commit**: `git add core/asset-export-standard.md tests/skills/email-build-skill-boundary.test.mjs`; `git commit -m "docs: preserve evidence for image-only decisions"`.

### Task 3: Понятная инструкция пользователю

**Files:**
- Modify: `docs/user-guide.md`
- Test: `tests/skills/email-build-skill-boundary.test.mjs`

**Interfaces:** Потребляет решения Tasks 1–2; выдаёт пользовательскую инструкцию с тем же порядком и границами, без технических параметров в вопросе.

- [ ] **Step 1: Добавить failing test** `user guide describes the three raster-image choices`.
  Проверить actual pair до вопроса, три exact labels, ожидание, сохранение принятого finding и возврат выбора при недоступном image-only исправлении.
- [ ] **Step 2: RED**: `node --test --test-concurrency=2 --test-name-pattern="user guide describes the three raster-image choices" tests/skills/email-build-skill-boundary.test.mjs`; ожидается FAIL отсутствующего раздела.
- [ ] **Step 3: Добавить короткий русский раздел**: какой вид агент покажет, что означают варианты, почему остальные проверки сохраняются.
  Не использовать процент как threshold; явно исключить иконки, кнопки и остальные роли.
  Не обещать, что Исправь сам исправит любой crop; при невозможности пользователь увидит результат и снова выберет действие.
- [ ] **Step 4: GREEN** той же командой; затем полный boundary test, ожидается PASS.
- [ ] **Step 5: Commit**: `git add docs/user-guide.md tests/skills/email-build-skill-boundary.test.mjs`; `git commit -m "docs: explain raster image review choices"`.

### Task 4: Pressure-проверка поведения и границ

**Files:**
- Review only: четыре изменённых файла Tasks 1–3; новые production files не создаются.
- Test scenarios: описанные ниже синтетические dry-run prompts; результаты только в локальной evidence.

**Interfaces:** Потребляет готовые инструкции и assertions; выдаёт независимую локальную поведенческую оценку и allowed-path/preserved-blob checks.

- [ ] **Step 1: До авторства skill провести RED и wording micro-tests**: content photo, контрактные bytes valid, все прочие gates passed, визуально изменилось лицо; давление срочного дедлайна, уже затраченной работы и усталости, без запрета вопросов или предположенного согласия.
  Претензия пользователя сообщает о stop/preserve; это не результат synthetic baseline. Проверить pinned baseline без новой guidance: по одному fresh-context ответу на вызов, полный реалистичный контекст и та же выбранная модель, минимум 5 повторений для control.
  Записать реальные ответы и причины failure до Task 1 изменения skill. Если control не воспроизводит failure, уточнить сценарий до авторства guidance; не выдумывать RED.
  После изменения сравнить candidate guidance на тех же inputs: минимум 5 fresh-context повторений для каждого варианта формулировки, включая no-guidance control; не смешивать контексты.
- [ ] **Step 2: Выполнить полные локальные GREEN pressure-сценарии** на candidate instructions с тем же synthetic finding:
  без ответа агент показывает pair, спрашивает exact choices и ждёт; Продолжаем сохраняет finding/waiver и остальные gates; Остановись сохраняет работу и прекращает выпуск.
  Проверить порядок сообщений и отсутствие elapsed/default consent, fake accepted или global image PASS.
- [ ] **Step 3: Выполнить image-only dry-runs**: допускаемый crop исправляет изображение с fresh evidence; общий файл двух viewport не допускает решения и возвращает выбор с показанной неудачей.
  Дополнительно проверить literal прежний ответ при том же виде и непереносимость ответа на изменённый crop/viewport.
- [ ] **Step 4: Выполнить исключения под давлением**: PNG-logo, QR, кнопка, text/layout defect, broken asset и неверный source/contract.
  Ожидается прежняя блокирующая ветка; смешанная photo+layout проблема не выпускает письмо по waiver фотографии.
  Запрос «Исправь сам, поменяй HTML/VML» не расширяет полномочия.
- [ ] **Step 5: Независимый reviewer вручную оценивает реальные transcripts** control/candidate и каждый flagged match, отличая действия от цитат и повторения шаблона.
  Scoring по spec: pair-before-question, exact labels, narrow role/scope, pending without consent, сохранённый finding, image-only repair и failure-return; сохранить нарушения, rationalizations и разброс между повторениями. Static assertions и micro-tests не заменяют полные pressure-сценарии.
  После corrections повторить затронутый вариант с 5+ reps и соответствующий pressure-сценарий; все прогоны локальные, concrete email не пересобирается.
- [ ] **Step 6: Проверить exact cloud commit** в disposable snapshot с same-lock dependencies и scoped execution decision.
  Verification agent запускает локальный boundary test и обязательные full repository/generation/validation workloads по fresh decision: `npm run generate:check`, `npm run validate`, `npm test` (либо их канонические runner workloads), поскольку меняется test.mjs.
  Allowed-path diff и raw preserved-blob checks подтверждают, что изменены только четыре future target paths; expected PASS без недекларированного generated drift. Generated outputs не переписывать для сокрытия failure.
  Сохранить фактические receipts и distinct primary review; не читать/запускать Actions или PR Checks.
- [ ] **Step 7: Handoff** нового implementation PR с hashes/receipts/ограничениями; merge и установка skill требуют отдельного разрешения.
  Настоящий plan-only PR не выполняет ни один implementation step выше и не загружает письма, PNG или QA packets.
