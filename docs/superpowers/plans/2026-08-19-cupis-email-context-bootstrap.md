# Portable CUPIS Email Context Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `flabenar-maker/e-mail` restore its Codex project context on another computer from one natural-language command after the repository is opened.

**Architecture:** Keep canonical email rules in their existing files. Add a small root entrypoint, a single bootstrap protocol, a machine-readable dependency manifest, safe portable recommendations, and a read-only PowerShell verifier. Move the maintenance skill to Codex's repo-scoped discovery path and test the repository contract without network writes.

**Tech Stack:** Markdown, YAML, TOML, PowerShell 7/Windows PowerShell, GitHub repository-scoped Codex skills.

**Spec:** `docs/superpowers/specs/2026-08-19-cupis-email-context-bootstrap-design.md`

## Global Constraints

- Repository: `flabenar-maker/e-mail`.
- Required plugins: `figma@openai-curated-remote` and `github@openai-curated-remote`.
- Optional plugin: `superpowers@openai-curated-remote`.
- Figma file key: `8zka5bHkcrJVK9I9dKjnhC`; Marketing root: `538:17236`; Service root: `538:17235`.
- Never store secrets, OAuth data, absolute machine paths, local runtime IDs, or plugin cache paths.
- Never overwrite the user's whole `~/.codex/config.toml`; preserve unknown keys and require backup plus diff before a merge.
- Never enable elevated sandbox automatically or require a specific model ID.
- Keep core instructions, component contracts, registry content, and workflow content canonical and unduplicated.
- Do not change Figma, `main`, concrete email projects, `email.html`, `images/`, reports, or archives.

---

### Task 1: Repository bootstrap contract and read-only verifier

**Files:**
- Create: `tests/bootstrap-contract.Tests.ps1`
- Create: `bootstrap/verify.ps1`

**Interfaces:**
- Consumes: repository root containing `bootstrap/manifest.yaml` and the paths named by that manifest.
- Produces: `bootstrap/verify.ps1 [-RepositoryRoot <path>]`, which writes `[OK]`/`[ERROR]` lines and exits `0` only when every required static check passes.

- [ ] **Step 1: Write the failing contract tests**

Create a dependency-free PowerShell test runner with a helper that launches the verifier in a child process:

```powershell
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$verify = Join-Path $repoRoot 'bootstrap/verify.ps1'

function Invoke-Verify([string]$Root) {
    $output = & pwsh -NoProfile -File $verify -RepositoryRoot $Root 2>&1 | Out-String
    [pscustomobject]@{ ExitCode = $LASTEXITCODE; Output = $output }
}

function Assert-True([bool]$Condition, [string]$Message) {
    if (-not $Condition) { throw $Message }
}

Assert-True (Test-Path -LiteralPath $verify) 'Verifier must exist.'
$valid = Invoke-Verify $repoRoot
Assert-True ($valid.ExitCode -eq 0) "Valid repository failed verification:`n$($valid.Output)"
```

Add fixture cases that copy only contract-relevant paths to `$TestDrive`, then prove failure for: a missing canonical file, the legacy `skills/maintaining-cupis-email-system` duplicate, and a secret-like line appended to `bootstrap/config.portable.toml`. Hash all fixture files before and after two valid verifier runs and assert equality to prove read-only/idempotent behavior. Always remove the temporary directory in `finally`.

- [ ] **Step 2: Run the test to verify RED**

Run:

```powershell
pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1
```

Expected: FAIL with `Verifier must exist.` because `bootstrap/verify.ps1` has not been created.

- [ ] **Step 3: Implement the minimal verifier**

Implement these pure checks in `bootstrap/verify.ps1`:

```powershell
param([string]$RepositoryRoot = (Split-Path -Parent $PSScriptRoot))
$ErrorActionPreference = 'Stop'
$errors = [System.Collections.Generic.List[string]]::new()

function Require-File([string]$RelativePath) {
    if (-not (Test-Path -LiteralPath (Join-Path $RepositoryRoot $RelativePath) -PathType Leaf)) {
        $errors.Add("Missing required file: $RelativePath")
    }
}

function Require-Text([string]$RelativePath, [string]$Pattern, [string]$Label) {
    $path = Join-Path $RepositoryRoot $RelativePath
    if ((Test-Path -LiteralPath $path) -and -not (Select-String -LiteralPath $path -Pattern $Pattern -Quiet)) {
        $errors.Add("$RelativePath does not declare $Label")
    }
}
```

Require the four canonical files, `AGENTS.md`, all four bootstrap files, and the repo-scoped skill files. Reject the legacy skill directory. Check README/AGENTS/bootstrap cross-references, plugin IDs, repository locator, Figma identifiers, and skill name. Scan only `bootstrap/config.portable.toml` for case-insensitive secret keys with assigned values, Windows drive paths, home-directory paths, plugin cache paths, runtime IDs, and `sandbox = "elevated"`. Print every error and `exit 1`; otherwise print a concise success summary and `exit 0`. Do not call the network or write files.

- [ ] **Step 4: Run the test to verify GREEN after Tasks 2 and 3 provide the declared files**

Run:

```powershell
pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1
```

Expected after Tasks 2 and 3: PASS for the repository plus PASS for all negative fixtures, with exit code `0`.

- [ ] **Step 5: Commit with the files from Tasks 1–3 after the first complete green cycle**

```powershell
git add tests/bootstrap-contract.Tests.ps1 bootstrap/verify.ps1
git commit -m "test: verify portable Codex bootstrap"
```

Do not make this commit while the suite is red; group it with the production files if needed to keep the branch green.

### Task 2: Natural-language entrypoints and portable dependency declaration

**Files:**
- Create: `AGENTS.md`
- Create: `bootstrap/README.md`
- Create: `bootstrap/manifest.yaml`
- Create: `bootstrap/config.portable.toml`
- Modify: `README.md`

**Interfaces:**
- Consumes: the exact phrases `Ознакомься с проектом` and `Восстанови рабочую среду проекта`.
- Produces: a read-only context-loading route and a safe setup route that Codex can follow without the user naming internal paths.

- [ ] **Step 1: Extend the RED tests with entrypoint assertions**

Before creating production files, add assertions that fail unless:

```powershell
$readme = Get-Content -Raw -LiteralPath (Join-Path $repoRoot 'README.md')
Assert-True ($readme.Contains('Ознакомься с проектом')) 'README must declare the read-only phrase.'
Assert-True ($readme.Contains('Восстанови рабочую среду проекта')) 'README must declare the restore phrase.'
Assert-True ($readme.Contains('bootstrap/README.md')) 'README must link the bootstrap protocol.'
```

Also assert that `AGENTS.md` points to README and bootstrap, and that the manifest contains the exact repository, canonical paths, plugin IDs, skill path, Figma file key, roots, portable config path, and verifier path.

- [ ] **Step 2: Run the entrypoint tests to verify RED**

Run the same test command. Expected: FAIL because `AGENTS.md` and `bootstrap/manifest.yaml` do not exist and README lacks the phrases.

- [ ] **Step 3: Add the minimal root entrypoints**

Add a short README section before the operating modes:

```markdown
## Восстановление контекста

После открытия этого репозитория достаточно сказать Codex:

- «Ознакомься с проектом» — только прочитать актуальный контекст и ничего не менять;
- «Восстанови рабочую среду проекта» — проверить и безопасно подключить зависимости по [bootstrap-протоколу](bootstrap/README.md).

В пустой задаче сначала укажи репозиторий: «Открой `flabenar-maker/e-mail` и восстанови рабочую среду проекта».
```

Create a minimal `AGENTS.md` that routes both phrases to README and `bootstrap/README.md` without copying email rules or component contracts.

- [ ] **Step 4: Add the authoritative bootstrap protocol**

Write `bootstrap/README.md` with two explicit branches:

- read-only mode pins current `main`, fetches all four canonical files at the same SHA, reads the manifest, reports context, and performs no writes;
- restore mode first performs read-only mode, checks required plugins, uses Codex's available standard plugin installation path, pauses for OAuth, checks the repo-scoped skill, proposes a redacted config diff, backs up before an approved minimal merge, re-parses the result, runs the verifier, and reports manual blockers.

State that unknown config keys must survive, duplicate skills require confirmation, unavailable models fall back without blocking, Superpowers is optional, plugin installation and OAuth are separate, and the protocol never edits Figma.

- [ ] **Step 5: Add manifest and portable TOML**

Create `bootstrap/manifest.yaml` with the exact structure approved in the spec. Create `bootstrap/config.portable.toml` containing only:

```toml
# Merge only missing safe keys after backup and a redacted diff.
# A compatible current model is acceptable; no model ID is required.
model_reasoning_effort = "high"

[features]
multi_agent = true
```

- [ ] **Step 6: Run the entrypoint tests**

Expected: entrypoint/manifest assertions pass; the overall suite may still fail only on the legacy skill location until Task 3.

### Task 3: Migrate the maintenance skill to repo-scoped discovery

**Files:**
- Move: `skills/maintaining-cupis-email-system/SKILL.md` → `.agents/skills/maintaining-cupis-email-system/SKILL.md`
- Move: `skills/maintaining-cupis-email-system/agents/openai.yaml` → `.agents/skills/maintaining-cupis-email-system/agents/openai.yaml`
- Modify: `.gitattributes`
- Modify: `README.md`

**Interfaces:**
- Consumes: Codex repo-scoped discovery under `.agents/skills`.
- Produces: exactly one repository skill named `maintaining-cupis-email-system`, with unchanged routing semantics and LF normalization.

- [ ] **Step 1: Add the migration assertions before moving files**

Assert that the new `SKILL.md` and `agents/openai.yaml` exist, the old directory does not exist, the YAML frontmatter still declares `name: maintaining-cupis-email-system`, and README plus `.gitattributes` reference only `.agents/skills/maintaining-cupis-email-system`.

- [ ] **Step 2: Run the tests to verify RED**

Expected: FAIL because the old path exists and the new path does not.

- [ ] **Step 3: Move the skill without changing its canonical routing content**

Use `git mv` for both files/directories. Update only path references in README. Replace the old attribute with:

```gitattributes
.agents/skills/maintaining-cupis-email-system/** text eol=lf
bootstrap/** text eol=lf
tests/*.ps1 text eol=lf
AGENTS.md text eol=lf
```

Do not copy email rules or component descriptions into the skill.

- [ ] **Step 4: Run the complete suite to verify GREEN**

```powershell
pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1
pwsh -NoProfile -File bootstrap/verify.ps1
```

Expected: both commands exit `0`, with no warnings or errors.

- [ ] **Step 5: Commit the atomic implementation**

```powershell
git add AGENTS.md README.md .gitattributes bootstrap tests .agents/skills/maintaining-cupis-email-system skills/maintaining-cupis-email-system
git commit -m "feat: add portable Codex context bootstrap"
```

### Task 4: Requirement, preservation, and publication verification

**Files:**
- Modify: `docs/superpowers/specs/2026-08-19-cupis-email-context-bootstrap-design.md`
- Modify: pull request #8 description through GitHub.

**Interfaces:**
- Consumes: green test output, base SHA `768b4cd9d025d07c06322e87685b8b94337786b7`, and the approved spec.
- Produces: a branch whose diff is limited to approved bootstrap/migration paths, plus an evidence-backed draft PR handoff.

- [ ] **Step 1: Mark the design status as implemented**

Change only the status line to `Статус: реализовано в draft PR; ожидает review и отдельного разрешения на merge` after all checks are green.

- [ ] **Step 2: Re-run fresh verification**

```powershell
pwsh -NoProfile -File tests/bootstrap-contract.Tests.ps1
pwsh -NoProfile -File bootstrap/verify.ps1
git status -sb
git diff --check
git diff --name-status 768b4cd9d025d07c06322e87685b8b94337786b7...HEAD
```

Expected: both PowerShell commands and `git diff --check` exit `0`; the diff contains only the spec/plan, root entrypoints, bootstrap, tests, skill move, README, and `.gitattributes`.

- [ ] **Step 3: Verify preserved canonical blobs**

```powershell
git rev-parse 768b4cd9d025d07c06322e87685b8b94337786b7:core/email-figma-prompt.md
git rev-parse HEAD:core/email-figma-prompt.md
git rev-parse 768b4cd9d025d07c06322e87685b8b94337786b7:registry/email-component-descriptions-registry.md
git rev-parse HEAD:registry/email-component-descriptions-registry.md
git rev-parse 768b4cd9d025d07c06322e87685b8b94337786b7:workflows/library-maintenance-checkpoint.md
git rev-parse HEAD:workflows/library-maintenance-checkpoint.md
git rev-parse 768b4cd9d025d07c06322e87685b8b94337786b7:workflows/email-build-checkpoint.md
git rev-parse HEAD:workflows/email-build-checkpoint.md
```

Expected: each base/head SHA pair is identical.

- [ ] **Step 4: Commit the final status update and push**

```powershell
git add docs/superpowers/specs/2026-08-19-cupis-email-context-bootstrap-design.md docs/superpowers/plans/2026-08-19-cupis-email-context-bootstrap.md
git commit -m "docs: record bootstrap implementation plan"
git push origin codex/email-context-bootstrap
```

- [ ] **Step 5: Verify the published branch and update PR #8**

Fetch the branch through GitHub, compare it with the pinned base, confirm the allowed path list and preserved blob SHAs, then update the draft PR body with changed paths, exact commands/results, OAuth limitations, and the statement that Figma and `main` were not changed. Do not merge or mark ready without separate user authorization.
