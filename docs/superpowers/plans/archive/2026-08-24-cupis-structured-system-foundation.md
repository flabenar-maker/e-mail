# CUPIS Structured System Foundation Implementation Plan

> **Архив завершённого этапа.** Этот документ сохраняет исходные решения, команды, пути, чекбоксы и промежуточные статусы; они не являются текущей очередью или разрешением выполнять старые шаги. Часть работ могла быть отменена или передана в последующие этапы. Актуальный порядок и открытые обязательства находятся в [едином roadmap](../2026-08-25-cupis-migration-roadmap.md).

> **Исторический implementation plan.** Реализован в [PR #17](https://github.com/flabenar-maker/e-mail/pull/17). Команды, пути и чекбоксы ниже описывают выполнение того этапа, а не текущий рабочий маршрут: старый контур находится в Legacy/, маршруты остановлены, проверки теперь локальные. Для продолжения использовать свежие manifest и [roadmap](../2026-08-25-cupis-migration-roadmap.md).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать первый исполняемый фундамент новой CUPIS email-системы: один канонический `system/manifest.yaml`, строгую машинную проверку и атомарное переключение всех текущих потребителей без изменения правил писем, реестров, Figma или локальных email-проектов.

**Architecture:** Node.js 24 читает YAML в строгом режиме, проверяет manifest через JSON Schema 2020-12 и выполняет межфайловые проверки ссылок. `bootstrap/verify.ps1` остаётся тонкой оболочкой для bootstrap-ограничений, а GitHub Actions запускает одинаковые проверки на Linux и Windows. В финальном состоянии `bootstrap/manifest.yaml` отсутствует: два manifest-файла не могут попасть в mergeable PR.

**Tech Stack:** Node.js 24 LTS; ECMAScript modules (`.mjs`); built-in `node:test`; `ajv@8.20.0`; `yaml@2.9.0`; JSON Schema 2020-12; PowerShell 7 и Windows PowerShell 5.1; GitHub Actions `actions/checkout@v7` и `actions/setup-node@v7`.

**Spec:** `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`

## Global Constraints

- Реализация начинается от `main@02def3ec9fc46a1d229045a75ff14bc6b633b225`.
- Единственный manifest после cutover — `system/manifest.yaml`; redirect, compatibility copy и второй manifest запрещены.
- Этот этап не переносит типографику, spacing, assets, naming или компоненты в structured data.
- Этот этап не переписывает содержательные правила `core/`, `registry/` или `workflows/`.
- Этот этап не открывает и не меняет Figma.
- Конкретные `email.html`, `images/`, тестовые письма и локальные рабочие папки не входят в репозиторий.
- YAML anchors, aliases, merge keys, duplicate keys и remote schema references запрещены.
- JSON Schema использует `additionalProperties: false` на каждом объектном уровне.
- Manifest schema version — `1.0.0`; runtime поддерживает только эту версию.
- Все проверки read-only: они не форматируют и не изменяют репозиторий.
- Merge требует отдельного разрешения пользователя; реализация заканчивается draft PR.
- Во время промежуточных TDD-коммитов два manifest-файла могут кратко сосуществовать только в рабочей ветке. Такая точка не готова к PR или merge.
- До финального PR без содержательных изменений сохраняются `core/`, `registry/`, Markdown-checkpoints в `workflows/` и мастер-спецификация.
- Зависимости фиксируются точно: `ajv@8.20.0` и `yaml@2.9.0`; Node.js — `>=24 <25`.
- Команды и ошибки не печатают содержимое секретов или portable config.

---

## File Responsibility Map

### Новые файлы

- `package.json` и `package-lock.json` — команды, runtime floor и воспроизводимые зависимости.
- `system/manifest.yaml` — единственная карта существующей системы на этом этапе.
- `schemas/manifest.schema.json` — строгая структура manifest версии `1.0.0`.
- `scripts/lib/diagnostics.mjs` — единый тип и формат диагностик.
- `scripts/lib/strict-yaml.mjs` — чтение YAML без неоднозначных конструкций.
- `scripts/lib/system-manifest.mjs` — schema и semantic validation.
- `scripts/validate-system.mjs` — read-only CLI.
- `tests/helpers/system-fixture.mjs` — безопасные временные fixtures.
- `tests/foundation/*.test.mjs` — YAML, manifest, CLI и CI contracts.
- `tests/characterization/foundation-preserved-files.test.mjs` — защита неизменяемой области.
- `.github/workflows/system-validation.yml` — Linux/Windows проверки.

### Изменяемые файлы

- `README.md` и `bootstrap/README.md` — новая единственная точка входа.
- `bootstrap/verify.ps1` — делегирует структуру Node-валидатору.
- `tests/bootstrap-contract.Tests.ps1` — проверяет cutover.
- `.agents/skills/maintaining-cupis-email-system/SKILL.md` — разрешает пути через manifest.
- `.gitattributes` — LF для новых системных файлов.

### Удаляемый файл

- `bootstrap/manifest.yaml` — удаляется в атомарном cutover-коммите.

### Неизменяемые файлы

- `core/email-figma-prompt.md`
- `core/figma-component-naming-standard.md`
- `registry/email-component-descriptions-registry.md`
- `registry/email-typography-registry.md`
- `workflows/library-maintenance-checkpoint.md`
- `workflows/email-build-checkpoint.md`
- `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`

---

### Task 1: Node Runtime and Strict YAML Boundary

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `scripts/lib/diagnostics.mjs`
- Create: `scripts/lib/strict-yaml.mjs`
- Test: `tests/foundation/strict-yaml.test.mjs`

**Interfaces:**
- Produces: `SystemValidationError(code: string, path: string, message: string)`.
- Produces: `parseStrictYaml(text: string, sourcePath: string): unknown`.
- Produces: `readStrictYaml(filePath: string): Promise<unknown>`.

- [ ] **Step 1: Add runtime and exact dependencies**

Create `package.json`:

```json
{
  "name": "cupis-email-system",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=24 <25" },
  "scripts": {
    "validate": "node scripts/validate-system.mjs",
    "test": "node --test tests/foundation/*.test.mjs",
    "verify": "npm run validate && npm test"
  },
  "dependencies": {
    "ajv": "8.20.0",
    "yaml": "2.9.0"
  }
}
```

Run `npm install --package-lock-only --ignore-scripts` and `npm ci --ignore-scripts`. Expected: lockfile version 3 and a clean install.

- [ ] **Step 2: Write failing strict-YAML tests**

Create tests for plain mappings/arrays and these errors:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { parseStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

test("parses plain YAML", () => {
  assert.deepEqual(
    parseStrictYaml("schema_version: 1.0.0\nitems:\n  - alpha\n", "fixture.yaml"),
    { schema_version: "1.0.0", items: ["alpha"] }
  );
});

for (const [name, yaml, code] of [
  ["duplicate keys", "value: 1\nvalue: 2\n", "yaml-duplicate-key"],
  ["anchors", "value: &shared 1\n", "yaml-anchor-forbidden"],
  ["aliases", "value: &shared 1\ncopy: *shared\n", "yaml-alias-forbidden"],
  ["merge keys", "base: &base\n  a: 1\ncopy:\n  <<: *base\n", "yaml-merge-key-forbidden"]
]) {
  test(`rejects ${name}`, () => {
    assert.throws(
      () => parseStrictYaml(yaml, "fixture.yaml"),
      error => error.code === code && error.path === "fixture.yaml"
    );
  });
}
```

- [ ] **Step 3: Confirm red state**

Run `node --test tests/foundation/strict-yaml.test.mjs`. Expected: `ERR_MODULE_NOT_FOUND` for `scripts/lib/strict-yaml.mjs`.

- [ ] **Step 4: Implement diagnostics and parser**

Create `scripts/lib/diagnostics.mjs`:

```js
export class SystemValidationError extends Error {
  constructor(code, path, message) {
    super(message);
    this.name = "SystemValidationError";
    this.code = code;
    this.path = path;
  }
}

export function formatDiagnostic(error) {
  return `${error.path}: [${error.code}] ${error.message}`;
}
```

In `scripts/lib/strict-yaml.mjs` use `parseDocument`, `visit`, `isAlias` and `isScalar` from `yaml`. Parse with `strict: true`, `uniqueKeys: true`, `merge: false` and `prettyErrors: false`. Map the parser’s duplicate-key message to `yaml-duplicate-key` and other parser errors to `yaml-syntax`. Walk the document before conversion: reject non-empty `anchor`, any alias node and scalar Pair key `<<` with the codes above. Convert only through `doc.toJS({ maxAliasCount: 0 })`. `readStrictYaml` reads UTF-8 and passes the path through unchanged.

- [ ] **Step 5: Verify green state and commit**

Run `node --test tests/foundation/strict-yaml.test.mjs` and `npm test`. Expected: PASS.

```bash
git add package.json package-lock.json scripts/lib/diagnostics.mjs scripts/lib/strict-yaml.mjs tests/foundation/strict-yaml.test.mjs
git commit -m "feat: add strict YAML validation boundary"
```

---

### Task 2: Manifest Schema and Canonical Manifest

**Files:**
- Create: `schemas/manifest.schema.json`
- Create: `system/manifest.yaml`
- Create: `scripts/lib/system-manifest.mjs`
- Create: `tests/helpers/system-fixture.mjs`
- Test: `tests/foundation/system-manifest.test.mjs`

**Interfaces:**
- Consumes `readStrictYaml` and `SystemValidationError`.
- Produces `loadSystemManifest({ repoRoot, manifestPath? }): Promise<object>`.
- Produces `validateManifestShape(manifest, schema): SystemValidationError[]`.
- Produces `validateManifestSemantics(manifest, repoRoot): Promise<SystemValidationError[]>`.

- [ ] **Step 1: Build safe fixture helpers and failing shape tests**

`tests/helpers/system-fixture.mjs` must expose `createSystemFixture`, `writeFixtureFile` and `copyFixtureFile`. Use `mkdtemp(join(tmpdir(), "cupis-system-"))`. Reject absolute/outside-root paths. Cleanup may recursively remove only a resolved temp path whose basename starts with `cupis-system-`.

Tests must cover: canonical manifest loads; `1.0.0` accepted; `1.1.0` returns `manifest-version-unsupported`; unknown root/nested properties fail; missing required section fails; absolute, Windows-style and `..` paths fail; declared paths resolve only under supplied root.

Run `node --test tests/foundation/system-manifest.test.mjs`. Expected: module/file missing failure.

- [ ] **Step 2: Create the canonical manifest**

Create `system/manifest.yaml` exactly as follows:

```yaml
schema_version: 1.0.0
system:
  id: cupis-email-system
  repository: flabenar-maker/e-mail
entrypoints:
  repository: README.md
  bootstrap: bootstrap/README.md
sources:
  - { id: repository-readme, kind: entrypoint, path: README.md }
  - { id: bootstrap-readme, kind: entrypoint, path: bootstrap/README.md }
  - { id: email-figma-prompt, kind: core, path: core/email-figma-prompt.md }
  - { id: figma-component-naming-standard, kind: core, path: core/figma-component-naming-standard.md }
  - { id: component-descriptions-registry, kind: registry, path: registry/email-component-descriptions-registry.md }
  - { id: typography-registry, kind: registry, path: registry/email-typography-registry.md }
  - { id: library-maintenance-checkpoint, kind: workflow, path: workflows/library-maintenance-checkpoint.md }
  - { id: email-build-checkpoint, kind: workflow, path: workflows/email-build-checkpoint.md }
  - { id: email-project-brief, kind: template, path: templates/email-project-brief.md }
  - { id: manifest-schema, kind: schema, path: schemas/manifest.schema.json }
bundle_profiles:
  - id: library-maintenance
    source_ids: [repository-readme, email-figma-prompt, figma-component-naming-standard, component-descriptions-registry, typography-registry, library-maintenance-checkpoint]
  - id: component-onboarding
    source_ids: [repository-readme, email-figma-prompt, figma-component-naming-standard, component-descriptions-registry, typography-registry, library-maintenance-checkpoint]
  - id: figma-description-sync
    source_ids: [repository-readme, email-figma-prompt, component-descriptions-registry, typography-registry, library-maintenance-checkpoint]
  - id: figma-naming-audit
    source_ids: [repository-readme, figma-component-naming-standard, component-descriptions-registry, library-maintenance-checkpoint]
  - id: email-new-build
    source_ids: [repository-readme, email-figma-prompt, figma-component-naming-standard, component-descriptions-registry, typography-registry, email-build-checkpoint, email-project-brief]
  - id: email-continue-fix
    source_ids: [repository-readme, email-figma-prompt, figma-component-naming-standard, component-descriptions-registry, typography-registry, email-build-checkpoint]
routes:
  - { id: library-maintenance, workflow_source_id: library-maintenance-checkpoint, bundle_profile_id: library-maintenance }
  - { id: component-onboarding, workflow_source_id: library-maintenance-checkpoint, bundle_profile_id: component-onboarding }
  - { id: figma-description-sync, workflow_source_id: library-maintenance-checkpoint, bundle_profile_id: figma-description-sync }
  - { id: figma-naming-audit, workflow_source_id: library-maintenance-checkpoint, bundle_profile_id: figma-naming-audit }
  - { id: email-new-build, workflow_source_id: email-build-checkpoint, bundle_profile_id: email-new-build }
  - { id: email-continue-fix, workflow_source_id: email-build-checkpoint, bundle_profile_id: email-continue-fix }
skills:
  required:
    - { id: maintaining-cupis-email-system, path: .agents/skills/maintaining-cupis-email-system }
  optional: []
plugins:
  required: [figma@openai-curated-remote, github@openai-curated-remote]
  optional: [superpowers@openai-curated-remote]
figma:
  file_key: 8zka5bHkcrJVK9I9dKjnhC
  roots: { marketing: "538:17236", service: "538:17235" }
bootstrap:
  portable_config: bootstrap/config.portable.toml
  verifier: bootstrap/verify.ps1
commands:
  validate: npm run validate
  test: npm test
  verify: npm run verify
```

It references only current files plus the new schema; it does not predeclare future data or generated files.

- [ ] **Step 3: Create strict JSON Schema 2020-12**

`schemas/manifest.schema.json` must set `$schema` to draft 2020-12, `$id` to the repository schema URL and `additionalProperties: false` at root and every object definition. Require all ten top-level keys. Exact constraints:

- `schema_version`: `const: "1.0.0"`;
- IDs: `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`;
- repo paths: `^(?!/)(?![A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))(?!.*\\\\)[^\\0]+$`;
- Figma node IDs: `^[0-9]+:[0-9]+$`;
- source kind enum: `entrypoint, core, registry, workflow, template, schema, generated`;
- source requires `id, kind, path`;
- bundle profile requires `id, source_ids`;
- route requires `id, workflow_source_id, bundle_profile_id`;
- skill requires `id, path`;
- `sources`, `bundle_profiles`, `routes`, `skills.required` and `plugins.required` are non-empty;
- optional skills/plugins may be empty;
- all strings have `minLength: 1` and arrays `uniqueItems: true`;
- no `$ref` value begins with `http://` or `https://`.

- [ ] **Step 4: Implement schema loading and shape validation**

Import `Ajv2020` from `ajv/dist/2020.js`; parse the local schema JSON; compile with `{ allErrors: true, strict: true }`. Before compile, recursively reject remote `$ref` values. Map Ajv errors to `SystemValidationError("manifest-schema", instancePath || "/", message)`. Reject any version other than `1.0.0` as `manifest-version-unsupported`. Never fall back to `bootstrap/manifest.yaml`.

- [ ] **Step 5: Verify and commit**

Run `node --test tests/foundation/system-manifest.test.mjs` and `npm test`. Expected: PASS.

```bash
git add schemas/manifest.schema.json system/manifest.yaml scripts/lib/system-manifest.mjs tests/helpers/system-fixture.mjs tests/foundation/system-manifest.test.mjs
git commit -m "feat: add canonical system manifest"
```

---

### Task 3: Cross-Reference Validation and CLI

**Files:**
- Modify: `scripts/lib/system-manifest.mjs`
- Create: `scripts/validate-system.mjs`
- Modify: `tests/foundation/system-manifest.test.mjs`
- Test: `tests/foundation/validator-cli.test.mjs`

**Interfaces:**
- Produces `validateSystem({ repoRoot, manifestPath? }): Promise<{ manifest: object|null, errors: SystemValidationError[] }>`.
- CLI accepts only optional `--repo-root <path>`.
- Success: exit 0 and `[PASS] CUPIS system validation passed.`. Failure: exit 1, one sanitized diagnostic per line.

- [ ] **Step 1: Add failing semantic tests**

Add fixtures for exact codes: duplicate source ID/path; duplicate bundle/route ID; duplicate skill ID/path across required+optional; unknown bundle source; workflow reference with non-workflow kind; unknown route profile; missing declared source/entrypoint/config/verifier; missing required skill; missing optional skill accepted; present optional or required skill with mismatched frontmatter name; legacy `skills/maintaining-cupis-email-system` rejected.

- [ ] **Step 2: Add failing CLI tests**

Spawn `process.execPath` with `scripts/validate-system.mjs --repo-root <fixture>`. Assert success/failure exit codes, deterministic diagnostics, unknown option `cli-arguments`, secret test value never printed and two runs leave the fixture SHA-256 digest unchanged.

Run the two test files. Expected: FAIL because semantic checks/CLI are absent.

- [ ] **Step 3: Implement semantic validation**

Implement:

```js
function findDuplicates(items, key) {
  // return repeated non-empty values once, sorted lexically
}

async function validateSkill(skill, required, repoRoot) {
  // optional missing => []; required missing/frontmatter mismatch => diagnostics
}

export async function validateManifestSemantics(manifest, repoRoot) {
  // return sorted diagnostics without writes
}

export async function validateSystem({
  repoRoot,
  manifestPath = "system/manifest.yaml"
}) {
  // return { manifest, errors }; ordinary validation errors do not throw
}
```

Validation order: unique source IDs/paths; profile/route IDs; skill IDs/paths; source/profile/workflow references; declared path existence; skill/frontmatter checks; legacy path check. Sort by path, code, message.

- [ ] **Step 4: Implement CLI**

`scripts/validate-system.mjs` exports `main(args)` and uses a direct-execution guard. Default root is `process.cwd()`. Unknown/missing arguments produce `cli-arguments`. Expected errors print via `formatDiagnostic` with no stack trace or file contents.

- [ ] **Step 5: Verify and commit**

Run `npm run validate` and `npm test`. Expected: PASS.

```bash
git add scripts/lib/system-manifest.mjs scripts/validate-system.mjs tests/foundation/system-manifest.test.mjs tests/foundation/validator-cli.test.mjs
git commit -m "feat: validate system manifest references"
```

---

### Task 4: Atomic Bootstrap Cutover

**Files:**
- Modify: `README.md`
- Modify: `bootstrap/README.md`
- Modify: `bootstrap/verify.ps1`
- Modify: `tests/bootstrap-contract.Tests.ps1`
- Modify: `.agents/skills/maintaining-cupis-email-system/SKILL.md`
- Modify: `.gitattributes`
- Modify: `tests/foundation/system-manifest.test.mjs`
- Delete: `bootstrap/manifest.yaml`

**Interfaces:**
- Every consumer locates `system/manifest.yaml`.
- `bootstrap/verify.ps1 -RepoRoot <path>` remains compatible.
- The skill pins one GitHub SHA and resolves route/profile/source paths from the manifest at that SHA.

- [ ] **Step 1: Write failing cutover contracts**

Node test: `system/manifest.yaml` must exist and `bootstrap/manifest.yaml` must not. PowerShell fixtures must mutate the new manifest, require all three consumer documents to mention it, reject any mention/existence of the old manifest and retain idempotence, skills, missing source, legacy skill and secret-config cases.

Run `npm test` and `pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1`. Expected: FAIL while the old manifest/consumers remain.

- [ ] **Step 2: Update human entrypoints**

`README.md` declares the new manifest the only machine-readable map while keeping “Ознакомься с проектом”, “Восстанови рабочую среду проекта” and the bootstrap link.

`bootstrap/README.md` instructs: pin main SHA; fetch new manifest at that SHA; fetch declared entrypoints; run `npm ci --ignore-scripts`, `npm run validate` and the verifier; treat missing Node 24 as blocker; preserve safe portable-config merge/redacted diff. Remove every old-manifest reference.

- [ ] **Step 3: Refactor PowerShell wrapper**

`bootstrap/verify.ps1` validates root, exact Node major 24, calls `node scripts/validate-system.mjs --repo-root <root>`, retains README/AGENTS phrases, secret-like portable-config key check and gitattributes skill line, then prints `[PASS] Bootstrap verification passed.`. Remove the hardcoded canonical file array and manual manifest text parsing.

- [ ] **Step 4: Make the maintenance skill manifest-driven**

Replace the hardcoded canonical list with: pin main SHA; fetch new manifest; select `routes[].id`; resolve profile; fetch only the profile’s source paths at the same SHA; stop on invalid reference; never use local/cached/legacy fallbacks. Preserve the current mutation gate, Figma authorization, cloud-only publication, diff guard and separate merge authorization.

- [ ] **Step 5: Delete old manifest and normalize files**

Delete `bootstrap/manifest.yaml`. Append:

```gitattributes
system/** text eol=lf
schemas/** text eol=lf
scripts/** text eol=lf
tests/**/*.mjs text eol=lf
.github/workflows/** text eol=lf
package*.json text eol=lf
```

- [ ] **Step 6: Verify and commit atomic state**

Run Node validation/tests plus bootstrap and contract tests under `pwsh` and, on Windows, `powershell.exe`. Expected: PASS and exactly one manifest.

```bash
git add README.md bootstrap/README.md bootstrap/verify.ps1 tests/bootstrap-contract.Tests.ps1 .agents/skills/maintaining-cupis-email-system/SKILL.md .gitattributes tests/foundation/system-manifest.test.mjs
git rm bootstrap/manifest.yaml
git commit -m "refactor: switch bootstrap to system manifest"
```

---

### Task 5: Continuous Validation on Linux and Windows

**Files:**
- Create: `.github/workflows/system-validation.yml`
- Test: `tests/foundation/system-validation-workflow.test.mjs`

**Interfaces:**
- CI performs no live Figma check.
- Linux runs npm validation/tests; Windows runs npm install and both PowerShell contracts.

- [ ] **Step 1: Write failing workflow contract**

Parse the workflow with `readStrictYaml`. Assert triggers `pull_request` and push to main; `permissions.contents: read`; exactly `node-validation` and `windows-bootstrap` jobs; checkout/setup-node v7; Node 24 plus npm cache; expected commands; no `figma`, token assignment or write permission.

Run the focused test. Expected: `ENOENT`.

- [ ] **Step 2: Create workflow**

```yaml
name: System validation
"on":
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  node-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with: { node-version: "24", cache: npm }
      - run: npm ci --ignore-scripts
      - run: npm run validate
      - run: npm test
  windows-bootstrap:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with: { node-version: "24", cache: npm }
      - run: npm ci --ignore-scripts
      - { shell: pwsh, run: "pwsh -NoProfile -File bootstrap/verify.ps1" }
      - { shell: pwsh, run: "pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1" }
```

- [ ] **Step 3: Verify and commit**

Run workflow test, `npm test`, `npm run validate` and PowerShell contract. Expected: PASS.

```bash
git add .github/workflows/system-validation.yml tests/foundation/system-validation-workflow.test.mjs
git commit -m "ci: validate CUPIS system foundation"
```

---

### Task 6: Characterization and Preserved-Scope Guard

**Files:**
- Create: `tests/characterization/foundation-preserved-files.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Test computes real Git blob SHA-1: `sha1("blob " + byteLength + "\0" + bytes)`.
- `npm test` includes foundation and characterization tests.

- [ ] **Step 1: Add immutable baseline assertions**

Use these exact path/blob pairs:

```js
const preserved = {
  "core/email-figma-prompt.md": "37ff4cdf5910e39b712decd85898be29d2283563",
  "core/figma-component-naming-standard.md": "97c922e918244d6142d3e82bc89f9ca09652389d",
  "registry/email-component-descriptions-registry.md": "945a2f6fdeace8913cc1bc041f5e1b5680ef415b",
  "registry/email-typography-registry.md": "12e5ae0b0aa1c5f18f9132e2e948e6a712c0f1bd",
  "workflows/library-maintenance-checkpoint.md": "c749878e57811b1028664a1438037574b3582575",
  "workflows/email-build-checkpoint.md": "42f8f91ca6e867b514c6d1af3dbef5c292cb8106",
  "docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md": "b3891c0f0a31e14ea8bd9a4e192d1366351ec489"
};
```

Mismatch output names only path and hashes.

- [ ] **Step 2: Expand test command and verify**

Set `test` to `node --test tests/foundation/*.test.mjs tests/characterization/*.test.mjs`. Run `npm test`, `npm run validate` and `npm run verify`. Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add package.json tests/characterization/foundation-preserved-files.test.mjs
git commit -m "test: guard foundation migration scope"
```

---

### Task 7: Final Verification and Draft Pull Request

**Files:**
- Verify Tasks 1–6 only.
- Never add reports, clones, archives, `node_modules/` or email outputs.

**Interfaces:**
- Produces one implementation branch and draft PR to main.
- Does not merge.

- [ ] **Step 1: Clean dependency and security check**

Run `npm ci --ignore-scripts` and `npm audit --omit=dev`. Expected: install succeeds and no known production vulnerability. A reported vulnerability triggers `superpowers:systematic-debugging`; do not suppress it.

- [ ] **Step 2: Run all validation**

Run:

```bash
npm run validate
npm test
npm run verify
pwsh -NoProfile -File bootstrap/verify.ps1
pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1
git diff --check main...HEAD
```

On Windows additionally run both PowerShell files with `powershell.exe`. Expected: exit 0.

- [ ] **Step 3: Check atomic state and tracked-output exclusions**

Confirm `system/manifest.yaml` exists; old manifest does not; tracked files contain no `email.html`, `images/`, `node_modules/` or archives.

- [ ] **Step 4: Enforce allowed diff**

Only these paths may differ:

```text
.github/workflows/system-validation.yml
.agents/skills/maintaining-cupis-email-system/SKILL.md
.gitattributes
README.md
bootstrap/README.md
bootstrap/verify.ps1
bootstrap/manifest.yaml (deleted)
package.json
package-lock.json
schemas/manifest.schema.json
scripts/lib/diagnostics.mjs
scripts/lib/strict-yaml.mjs
scripts/lib/system-manifest.mjs
scripts/validate-system.mjs
system/manifest.yaml
tests/bootstrap-contract.Tests.ps1
tests/characterization/foundation-preserved-files.test.mjs
tests/foundation/strict-yaml.test.mjs
tests/foundation/system-manifest.test.mjs
tests/foundation/system-validation-workflow.test.mjs
tests/foundation/validator-cli.test.mjs
tests/helpers/system-fixture.mjs
```

Any other path blocks publication pending diagnosis.

- [ ] **Step 5: Re-read through GitHub and open draft PR**

Compare against `02def3ec9fc46a1d229045a75ff14bc6b633b225`. Confirm allowed paths, old manifest deletion, new manifest addition, preserved blobs, no Figma write and passing CI. Open a draft PR whose body states the one-manifest outcome, checks run, preserved files, no Figma/business-rule migration, rollback branch and separate merge permission.

- [ ] **Step 6: Stop for review**

Report branch, commits, draft PR, changed paths, evidence and real limitations. Do not merge or enable auto-merge.

---

## Self-Review Checklist for the Plan Author

Результат самопроверки: пробелов по объёму foundation-этапа, неразрешённых placeholders и расхождений интерфейсов не найдено.

- [x] Master-spec sections 4, 10 and the foundation portion of section 15 map to Tasks 1–7.
- [x] No component, typography, spacing, asset or naming data migrates here.
- [x] Manifest contains no future missing source path.
- [x] Interface names match across all tasks.
- [x] No unresolved placeholder or “implement similarly” instruction remains.
- [x] Final repository has exactly one manifest.
- [x] Final PR uses only the allowlist and never touches Figma.
- [x] Publication and merge remain separate user decisions.

## Reference Versions

- Node.js: https://nodejs.org/en/about/previous-releases
- Ajv: https://www.npmjs.com/package/ajv
- YAML: https://www.npmjs.com/package/yaml
- Checkout: https://github.com/actions/checkout
- Setup Node: https://github.com/actions/setup-node/releases
