param(
    [string]$RepositoryRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
$RepositoryRoot = [System.IO.Path]::GetFullPath($RepositoryRoot)
$errors = [System.Collections.Generic.List[string]]::new()

function Require-File {
    param([string]$RelativePath)

    if (-not (Test-Path -LiteralPath (Join-Path $RepositoryRoot $RelativePath) -PathType Leaf)) {
        $errors.Add("Missing required file: $RelativePath")
    }
}

function Require-Literal {
    param(
        [string]$RelativePath,
        [string]$Text,
        [string]$Label
    )

    $path = Join-Path $RepositoryRoot $RelativePath
    if ((Test-Path -LiteralPath $path -PathType Leaf) -and
        -not (Select-String -LiteralPath $path -SimpleMatch -Pattern $Text -Quiet)) {
        $errors.Add("$RelativePath does not declare $Label")
    }
}

$requiredFiles = @(
    'README.md',
    'AGENTS.md',
    '.gitattributes',
    'core/email-figma-prompt.md',
    'registry/email-component-descriptions-registry.md',
    'workflows/library-maintenance-checkpoint.md',
    'bootstrap/README.md',
    'bootstrap/manifest.yaml',
    'bootstrap/config.portable.toml',
    'bootstrap/verify.ps1',
    '.agents/skills/maintaining-cupis-email-system/SKILL.md',
    '.agents/skills/maintaining-cupis-email-system/agents/openai.yaml'
)

foreach ($requiredFile in $requiredFiles) {
    Require-File $requiredFile
}

$legacySkillPath = Join-Path $RepositoryRoot 'skills/maintaining-cupis-email-system'
if (Test-Path -LiteralPath $legacySkillPath) {
    $errors.Add('Legacy skill directory must be removed: skills/maintaining-cupis-email-system')
}

Require-Literal 'README.md' 'Ознакомься с проектом' 'the read-only phrase'
Require-Literal 'README.md' 'Восстанови рабочую среду проекта' 'the restore phrase'
Require-Literal 'README.md' 'bootstrap/README.md' 'the bootstrap entrypoint'
Require-Literal 'AGENTS.md' 'README.md' 'the project map'
Require-Literal 'AGENTS.md' 'bootstrap/README.md' 'the bootstrap entrypoint'

$manifestRequirements = [ordered]@{
    'schema_version: 1' = 'schema version 1'
    'repository: flabenar-maker/e-mail' = 'the canonical repository'
    'entrypoint: bootstrap/README.md' = 'the bootstrap entrypoint'
    'core/email-figma-prompt.md' = 'the core instruction'
    'registry/email-component-descriptions-registry.md' = 'the component registry'
    'workflows/library-maintenance-checkpoint.md' = 'the maintenance checkpoint'
    'path: .agents/skills/maintaining-cupis-email-system' = 'the repo-scoped skill path'
    'name: maintaining-cupis-email-system' = 'the skill name'
    'figma@openai-curated-remote' = 'the required Figma plugin'
    'github@openai-curated-remote' = 'the required GitHub plugin'
    'superpowers@openai-curated-remote' = 'the optional Superpowers plugin'
    'file_key: 8zka5bHkcrJVK9I9dKjnhC' = 'the Figma file key'
    'marketing: "538:17236"' = 'the Marketing root'
    'service: "538:17235"' = 'the Service root'
    'portable_config: bootstrap/config.portable.toml' = 'the portable config'
    'verification: bootstrap/verify.ps1' = 'the verifier path'
}

foreach ($requirement in $manifestRequirements.GetEnumerator()) {
    Require-Literal 'bootstrap/manifest.yaml' $requirement.Key $requirement.Value
}

Require-Literal 'registry/email-component-descriptions-registry.md' '8zka5bHkcrJVK9I9dKjnhC' 'the same Figma file key as the manifest'
Require-Literal 'registry/email-component-descriptions-registry.md' '538:17236' 'the same Marketing root as the manifest'
Require-Literal 'registry/email-component-descriptions-registry.md' '538:17235' 'the same Service root as the manifest'
Require-Literal '.agents/skills/maintaining-cupis-email-system/SKILL.md' 'name: maintaining-cupis-email-system' 'the expected skill name'
Require-Literal '.agents/skills/maintaining-cupis-email-system/SKILL.md' 'flabenar-maker/e-mail' 'the canonical repository locator'
Require-Literal '.gitattributes' '.agents/skills/maintaining-cupis-email-system/** text eol=lf' 'LF normalization for the repo-scoped skill'

$configPath = Join-Path $RepositoryRoot 'bootstrap/config.portable.toml'
if (Test-Path -LiteralPath $configPath -PathType Leaf) {
    $portableConfig = Get-Content -Raw -LiteralPath $configPath

    if ($portableConfig -match '(?im)^\s*(?:api[_-]?key|access[_-]?token|api[_-]?token|token|password|secret|oauth[^=]*)\s*=\s*["''][^"'']+["'']') {
        $errors.Add('Portable config contains a secret-like assignment')
    }
    if ($portableConfig -match '(?i)(?:[A-Z]:\\|/Users/|/home/|~[/\\])') {
        $errors.Add('Portable config contains an absolute machine-specific path')
    }
    if ($portableConfig -match '(?i)plugins[/\\]cache') {
        $errors.Add('Portable config contains a plugin cache path')
    }
    if ($portableConfig -match '(?im)^\s*runtime[_-]?id\s*=') {
        $errors.Add('Portable config contains a local runtime ID')
    }
    if ($portableConfig -match '(?im)^\s*sandbox\s*=\s*["'']elevated["'']') {
        $errors.Add('Portable config must not enable elevated sandbox')
    }
}

if ($errors.Count -gt 0) {
    foreach ($errorMessage in $errors) {
        Write-Output "[ERROR] $errorMessage"
    }
    Write-Output "[FAIL] Bootstrap contract has $($errors.Count) error(s)."
    exit 1
}

foreach ($requiredFile in $requiredFiles) {
    Write-Output "[OK] $requiredFile"
}
Write-Output '[PASS] Bootstrap contract is valid and no files were changed.'
exit 0
