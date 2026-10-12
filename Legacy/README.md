# Архив исторических baseline CUPIS

Эти файлы сохранены как материалы аудита и восстановления истории. Текущие правила, факты, workflows и формы определяются [основной системой](../README.md) через `system/manifest.yaml`. Архив не подключается к активным bundles и не является владельцем текущих значений.

В пакете 6 удалены 13 неиспользуемых архивных копий тестов и утилит. Действующие тесты находятся в `tests/`. Подробные решения и точные прежние пути записаны в [плане очистки](../docs/superpowers/plans/2026-10-12-cupis-p6-cleanup.md).

| Сохранённый файл | Роль |
| --- | --- |
| [core/email-figma-prompt.md](core/email-figma-prompt.md) | Сохранить исходный текст для аудита миграции; не использовать как рабочую инструкцию |
| [core/figma-component-naming-standard.md](core/figma-component-naming-standard.md) | Сохранить нормативный baseline; текущие значения читать из foundation |
| [docs/generated/component-registry.md](docs/generated/component-registry.md) | Сохранить сравнимый исторический baseline, не генерировать и не подключать к bundles |
| [figma-component-descriptions/2026-09-17-pre-compact-sync.json](figma-component-descriptions/2026-09-17-pre-compact-sync.json) | Сохранить evidence для ручного разбора и разрешённого отката metadata; автоматического Figma rollback нет |
| [registry/email-component-descriptions-registry.md](registry/email-component-descriptions-registry.md) | Сохранить исторические значения и provenance, не считать владельцем текущих фактов |
| [registry/email-typography-registry.md](registry/email-typography-registry.md) | Сохранить материал для аудита миграции; рабочие определения находятся в foundation |
| [templates/email-project-brief.md](templates/email-project-brief.md) | Сохранить историческую форму; новые письма используют единую форму из фактических действий письма |
| [tests/fixtures/rendering/legacy-baseline.json](tests/fixtures/rendering/legacy-baseline.json) | Сохранить измерения для исторического сравнения; текущий renderer его не читает |
| [workflows/email-build-checkpoint.md](workflows/email-build-checkpoint.md) | Сохранить baseline: active tests/characterization/html-rendering-shadow.test.mjs проверяет исходный digest |
| [workflows/library-maintenance-checkpoint.md](workflows/library-maintenance-checkpoint.md) | Сохранить baseline: active tests/characterization/html-rendering-shadow.test.mjs проверяет исходный digest |

Два архивных workflow читаются действующим regression-тестом только для сравнения baseline-digests. Это evidence миграции, а не источник рабочих правил. Прежние относительные пути внутри historical-файлов описывают прошлое состояние и не являются текущими entrypoints.
