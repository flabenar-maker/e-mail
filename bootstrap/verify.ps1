param(
    [string]$RepositoryRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
$RepositoryRoot = [System.IO.Path]::GetFullPath($RepositoryRoot)
$errors = [System.Collections.Generic.List[string]]::new()

function Require-Literal {
    param([string]$RelativePath, [string]$Text, [string]$Label)
    $path = Join-Path $RepositoryRoot $RelativePath
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        $errors.Add("Missing required file: $RelativePath")
        return
    }
    if (-not (Select-String -LiteralPath $path -SimpleMatch -Pattern $Text -Quiet)) {
        $errors.Add("$RelativePath does not declare $Label")
    }
}

function Forbid-Literal {
    param([string]$RelativePath, [string]$Text, [string]$Label)
    $path = Join-Path $RepositoryRoot $RelativePath
    if ((Test-Path -LiteralPath $path -PathType Leaf) -and
        (Select-String -LiteralPath $path -SimpleMatch -Pattern $Text -Quiet)) {
        $errors.Add("$RelativePath still declares $Label")
    }
}

if (-not (Test-Path -LiteralPath $RepositoryRoot -PathType Container)) {
    Write-Output '[ERROR] Repository root does not exist.'
    Write-Output '[FAIL] Bootstrap verification failed.'
    exit 1
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    $errors.Add('Node.js 24 is required but node was not found')
} else {
    $nodeVersion = (& $node.Source --version 2>$null | Out-String).Trim()
    if ($LASTEXITCODE -ne 0 -or $nodeVersion -notmatch '^v24\.') {
        $errors.Add("Node.js major version must be 24; detected $nodeVersion")
    } else {
        $validatorScript = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../scripts/validate-system.mjs'))
        if (-not (Test-Path -LiteralPath $validatorScript -PathType Leaf)) {
            $errors.Add('System validator is missing: scripts/validate-system.mjs')
        } else {
            $validatorOutput = & $node.Source $validatorScript --repo-root $RepositoryRoot 2>&1 | Out-String
            if ($LASTEXITCODE -ne 0) {
                foreach ($line in ($validatorOutput.Trim() -split '\r?\n')) {
                    if ($line) { $errors.Add($line) }
                }
            }
        }
    }
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
Require-Literal 'README.md' 'system/manifest.yaml' 'the canonical system manifest'
Require-Literal 'bootstrap/README.md' 'system/manifest.yaml' 'the canonical system manifest'
Require-Literal '.agents/skills/maintaining-cupis-email-system/SKILL.md' 'system/manifest.yaml' 'the canonical system manifest'
Require-Literal 'AGENTS.md' 'README.md' 'the project map'
Require-Literal 'AGENTS.md' 'bootstrap/README.md' 'the bootstrap entrypoint'
Require-Literal '.gitattributes' '.agents/skills/** text eol=lf' 'LF normalization for repo-scoped skills'

foreach ($consumer in @(
    'README.md',
    'bootstrap/README.md',
    '.agents/skills/maintaining-cupis-email-system/SKILL.md'
)) {
    Forbid-Literal $consumer 'bootstrap/manifest.yaml' 'the retired bootstrap manifest'
}

$configPath = Join-Path $RepositoryRoot 'bootstrap/config.portable.toml'
if (Test-Path -LiteralPath $configPath -PathType Leaf) {
    $portableConfig = Get-Content -Raw -LiteralPath $configPath
    if ($portableConfig -match '(?im)^\s*(?:api[_-]?key|access[_-]?token|api[_-]?token|token|password|secret|oauth[^=]*|credential)\s*=\s*["''][^"'']+["'']') {
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
    Write-Output "[FAIL] Bootstrap verification has $($errors.Count) error(s)."
    exit 1
}

Write-Output '[PASS] Bootstrap verification passed.'
exit 0
