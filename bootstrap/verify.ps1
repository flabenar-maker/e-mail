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

function Get-ManifestSkills {
    param([string]$ManifestPath)

    $entries = [System.Collections.Generic.List[object]]::new()
    $inSkills = $false
    $foundSkills = $false
    $currentKind = $null
    $pendingPath = $null
    $pendingKind = $null

    foreach ($line in Get-Content -LiteralPath $ManifestPath) {
        if (-not $inSkills) {
            if ($line -match '^skills:\s*$') {
                $inSkills = $true
                $foundSkills = $true
            }
            continue
        }

        if ($line -match '^\S') {
            break
        }

        if ($line -match '^\s{2}(required|optional):\s*(?:\[\])?\s*$') {
            if ($pendingPath) {
                $errors.Add("Manifest skill entry is missing name: $pendingPath")
                $pendingPath = $null
            }
            $currentKind = $Matches[1]
            continue
        }

        if ($line -match '^\s{4}-\s+path:\s*(.+?)\s*$') {
            if ($pendingPath) {
                $errors.Add("Manifest skill entry is missing name: $pendingPath")
            }
            if (-not $currentKind) {
                $errors.Add('Manifest skill path must be inside skills.required or skills.optional')
            }
            $pendingPath = $Matches[1].Trim().Trim('"').Trim("'")
            $pendingKind = $currentKind
            continue
        }

        if ($line -match '^\s{6}name:\s*(.+?)\s*$') {
            if (-not $pendingPath) {
                $errors.Add('Manifest skill name must follow a skill path')
                continue
            }

            $entries.Add([pscustomobject]@{
                Kind = $pendingKind
                Path = $pendingPath
                Name = $Matches[1].Trim().Trim('"').Trim("'")
            })
            $pendingPath = $null
            $pendingKind = $null
        }
    }

    if ($pendingPath) {
        $errors.Add("Manifest skill entry is missing name: $pendingPath")
    }
    if (-not $foundSkills) {
        $errors.Add('Manifest must contain a skills section')
    }

    return $entries
}

$requiredFiles = @(
    'README.md',
    'AGENTS.md',
    '.gitattributes',
    'core/email-figma-prompt.md',
    'core/figma-component-naming-standard.md',
    'registry/email-component-descriptions-registry.md',
    'registry/email-typography-registry.md',
    'workflows/library-maintenance-checkpoint.md',
    'workflows/email-build-checkpoint.md',
    'bootstrap/README.md',
    'bootstrap/manifest.yaml',
    'bootstrap/config.portable.toml',
    'bootstrap/verify.ps1'
)

foreach ($requiredFile in $requiredFiles) {
    Require-File $requiredFile
}

$readOnlyPhrase = [System.Text.Encoding]::UTF8.GetString(
    [System.Convert]::FromBase64String('0J7Qt9C90LDQutC+0LzRjNGB0Y8g0YEg0L/RgNC+0LXQutGC0L7QvA==')
)
$restorePhrase = [System.Text.Encoding]::UTF8.GetString(
    [System.Convert]::FromBase64String('0JLQvtGB0YHRgtCw0L3QvtCy0Lgg0YDQsNCx0L7Rh9GD0Y4g0YHRgNC10LTRgyDQv9GA0L7QtdC60YLQsA==')
)

Require-Literal 'README.md' $readOnlyPhrase 'the read-only phrase'
Require-Literal 'README.md' $restorePhrase 'the restore phrase'
Require-Literal 'README.md' 'bootstrap/README.md' 'the bootstrap entrypoint'
Require-Literal 'AGENTS.md' 'README.md' 'the project map'
Require-Literal 'AGENTS.md' 'bootstrap/README.md' 'the bootstrap entrypoint'

$manifestRequirements = [ordered]@{
    'schema_version: 1' = 'schema version 1'
    'repository: flabenar-maker/e-mail' = 'the canonical repository'
    'entrypoint: bootstrap/README.md' = 'the bootstrap entrypoint'
    'core/email-figma-prompt.md' = 'the core instruction'
    'core/figma-component-naming-standard.md' = 'the Figma naming standard'
    'registry/email-component-descriptions-registry.md' = 'the component registry'
    'registry/email-typography-registry.md' = 'the typography registry'
    'workflows/library-maintenance-checkpoint.md' = 'the maintenance checkpoint'
    'workflows/email-build-checkpoint.md' = 'the email build checkpoint'
    'skills:' = 'the skills section'
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
Require-Literal '.gitattributes' '.agents/skills/** text eol=lf' 'LF normalization for repo-scoped skills'

$manifestPath = Join-Path $RepositoryRoot 'bootstrap/manifest.yaml'
if (Test-Path -LiteralPath $manifestPath -PathType Leaf) {
    $manifestSkills = @(Get-ManifestSkills $manifestPath)
    $requiredSkillCount = @($manifestSkills | Where-Object { $_.Kind -eq 'required' }).Count
    if ($requiredSkillCount -eq 0) {
        $errors.Add('Manifest must declare at least one required repo-scoped skill')
    }

    $seenSkillNames = @{}
    $seenSkillPaths = @{}

    foreach ($manifestSkill in $manifestSkills) {
        if ($manifestSkill.Path -notmatch '^\.agents/skills/[a-z0-9][a-z0-9-]*$') {
            $errors.Add("Manifest skill path is not a safe repo-scoped path: $($manifestSkill.Path)")
            continue
        }
        if ($manifestSkill.Name -notmatch '^[a-z0-9][a-z0-9-]*$') {
            $errors.Add("Manifest skill name is invalid: $($manifestSkill.Name)")
            continue
        }
        if ($seenSkillNames.ContainsKey($manifestSkill.Name)) {
            $errors.Add("Manifest contains duplicate skill name: $($manifestSkill.Name)")
            continue
        }
        if ($seenSkillPaths.ContainsKey($manifestSkill.Path)) {
            $errors.Add("Manifest contains duplicate skill path: $($manifestSkill.Path)")
            continue
        }

        $seenSkillNames[$manifestSkill.Name] = $true
        $seenSkillPaths[$manifestSkill.Path] = $true

        $skillFile = "$($manifestSkill.Path)/SKILL.md"
        $skillFilePath = Join-Path $RepositoryRoot $skillFile
        $skillExists = Test-Path -LiteralPath $skillFilePath -PathType Leaf

        if ($manifestSkill.Kind -eq 'required' -and -not $skillExists) {
            $errors.Add("Missing required file: $skillFile")
            continue
        }
        if (-not $skillExists) {
            continue
        }

        $skillContent = Get-Content -Raw -LiteralPath $skillFilePath
        $frontmatterMatch = [regex]::Match($skillContent, '\A---\s*\r?\n(?<frontmatter>.*?)\r?\n---', 'Singleline')
        if (-not $frontmatterMatch.Success) {
            $errors.Add("Skill frontmatter is missing: $skillFile")
            continue
        }

        $nameMatch = [regex]::Match($frontmatterMatch.Groups['frontmatter'].Value, '(?m)^name:\s*(?<name>[^\r\n]+)\s*$')
        if (-not $nameMatch.Success) {
            $errors.Add("Skill frontmatter name is missing: $skillFile")
            continue
        }

        $actualName = $nameMatch.Groups['name'].Value.Trim().Trim('"').Trim("'")
        if ($actualName -ne $manifestSkill.Name) {
            $errors.Add("Skill name mismatch for $($manifestSkill.Name): $skillFile")
        }

        $legacySkillPath = Join-Path $RepositoryRoot "skills/$($manifestSkill.Name)"
        if (Test-Path -LiteralPath $legacySkillPath) {
            $errors.Add("Legacy skill directory must be removed: skills/$($manifestSkill.Name)")
        }
    }
}

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
