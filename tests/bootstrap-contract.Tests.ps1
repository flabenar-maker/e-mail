$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$verifyScript = Join-Path $repoRoot 'bootstrap/verify.ps1'
$powerShell = if (Get-Command pwsh -ErrorAction SilentlyContinue) {
    (Get-Command pwsh).Source
} else {
    (Get-Command powershell -ErrorAction Stop).Source
}

function Assert-True {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Invoke-Verify {
    param([string]$Root)

    $output = & $powerShell -NoProfile -File $verifyScript -RepositoryRoot $Root 2>&1 | Out-String
    [pscustomobject]@{
        ExitCode = $LASTEXITCODE
        Output = $output
    }
}

function Copy-ContractFixture {
    param(
        [string]$Source,
        [string]$Destination
    )

    New-Item -ItemType Directory -Path $Destination | Out-Null

    foreach ($file in @('README.md', 'AGENTS.md', '.gitattributes')) {
        Copy-Item -LiteralPath (Join-Path $Source $file) -Destination (Join-Path $Destination $file)
    }

    foreach ($directory in @('bootstrap', '.agents', 'core', 'registry', 'workflows')) {
        Copy-Item -Recurse -LiteralPath (Join-Path $Source $directory) -Destination (Join-Path $Destination $directory)
    }
}

function Get-FixtureHash {
    param([string]$Root)

    $lines = Get-ChildItem -LiteralPath $Root -File -Recurse |
        Sort-Object FullName |
        ForEach-Object {
            $relative = [System.IO.Path]::GetRelativePath($Root, $_.FullName)
            $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash
            "$relative=$hash"
        }

    $bytes = [System.Text.Encoding]::UTF8.GetBytes(($lines -join "`n"))
    $stream = [System.IO.MemoryStream]::new($bytes)
    try {
        (Get-FileHash -Algorithm SHA256 -InputStream $stream).Hash
    } finally {
        $stream.Dispose()
    }
}

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("cupis-bootstrap-tests-" + [guid]::NewGuid().ToString('N'))

try {
    Assert-True (Test-Path -LiteralPath $verifyScript -PathType Leaf) 'Verifier must exist.'

    $readme = Get-Content -Raw -LiteralPath (Join-Path $repoRoot 'README.md')
    Assert-True ($readme.Contains('Ознакомься с проектом')) 'README must declare the read-only phrase.'
    Assert-True ($readme.Contains('Восстанови рабочую среду проекта')) 'README must declare the restore phrase.'
    Assert-True ($readme.Contains('bootstrap/README.md')) 'README must link the bootstrap protocol.'

    $agents = Get-Content -Raw -LiteralPath (Join-Path $repoRoot 'AGENTS.md')
    Assert-True ($agents.Contains('README.md')) 'AGENTS.md must point to README.md.'
    Assert-True ($agents.Contains('bootstrap/README.md')) 'AGENTS.md must point to bootstrap/README.md.'

    $manifest = Get-Content -Raw -LiteralPath (Join-Path $repoRoot 'bootstrap/manifest.yaml')
    foreach ($requiredText in @(
        'repository: flabenar-maker/e-mail',
        'entrypoint: bootstrap/README.md',
        'core/email-figma-prompt.md',
        'registry/email-component-descriptions-registry.md',
        'workflows/library-maintenance-checkpoint.md',
        'path: .agents/skills/maintaining-cupis-email-system',
        'name: maintaining-cupis-email-system',
        'figma@openai-curated-remote',
        'github@openai-curated-remote',
        'superpowers@openai-curated-remote',
        'file_key: 8zka5bHkcrJVK9I9dKjnhC',
        'marketing: "538:17236"',
        'service: "538:17235"',
        'portable_config: bootstrap/config.portable.toml',
        'verification: bootstrap/verify.ps1'
    )) {
        Assert-True ($manifest.Contains($requiredText)) "Manifest is missing: $requiredText"
    }

    $skillPath = Join-Path $repoRoot '.agents/skills/maintaining-cupis-email-system/SKILL.md'
    $agentMetadataPath = Join-Path $repoRoot '.agents/skills/maintaining-cupis-email-system/agents/openai.yaml'
    Assert-True (Test-Path -LiteralPath $skillPath -PathType Leaf) 'Repo-scoped SKILL.md must exist.'
    Assert-True (Test-Path -LiteralPath $agentMetadataPath -PathType Leaf) 'Repo-scoped openai.yaml must exist.'
    Assert-True (-not (Test-Path -LiteralPath (Join-Path $repoRoot 'skills/maintaining-cupis-email-system'))) 'Legacy skill directory must not exist.'

    $skill = Get-Content -Raw -LiteralPath $skillPath
    Assert-True ($skill -match '(?m)^name: maintaining-cupis-email-system$') 'Skill name must be preserved.'

    $attributes = Get-Content -Raw -LiteralPath (Join-Path $repoRoot '.gitattributes')
    Assert-True ($attributes.Contains('.agents/skills/maintaining-cupis-email-system/** text eol=lf')) '.gitattributes must normalize the repo-scoped skill.'
    Assert-True (-not ($attributes -match '(?m)^skills/maintaining-cupis-email-system/\*\*')) '.gitattributes must not retain the legacy skill path.'

    $valid = Invoke-Verify $repoRoot
    Assert-True ($valid.ExitCode -eq 0) "Valid repository failed verification:`n$($valid.Output)"

    New-Item -ItemType Directory -Path $tempRoot | Out-Null

    $readOnlyFixture = Join-Path $tempRoot 'read-only'
    Copy-ContractFixture -Source $repoRoot -Destination $readOnlyFixture
    $beforeHash = Get-FixtureHash $readOnlyFixture
    $firstRun = Invoke-Verify $readOnlyFixture
    $secondRun = Invoke-Verify $readOnlyFixture
    $afterHash = Get-FixtureHash $readOnlyFixture
    Assert-True ($firstRun.ExitCode -eq 0 -and $secondRun.ExitCode -eq 0) 'Verifier must pass repeatedly on a valid fixture.'
    Assert-True ($beforeHash -eq $afterHash) 'Verifier must not modify repository files.'

    $missingFixture = Join-Path $tempRoot 'missing-canonical'
    Copy-ContractFixture -Source $repoRoot -Destination $missingFixture
    Remove-Item -LiteralPath (Join-Path $missingFixture 'core/email-figma-prompt.md')
    $missingResult = Invoke-Verify $missingFixture
    Assert-True ($missingResult.ExitCode -ne 0) 'Verifier must reject a missing canonical file.'
    Assert-True ($missingResult.Output.Contains('Missing required file: core/email-figma-prompt.md')) 'Missing-file error must name the canonical path.'

    $duplicateFixture = Join-Path $tempRoot 'duplicate-skill'
    Copy-ContractFixture -Source $repoRoot -Destination $duplicateFixture
    $legacySkill = Join-Path $duplicateFixture 'skills/maintaining-cupis-email-system'
    New-Item -ItemType Directory -Path $legacySkill -Force | Out-Null
    Set-Content -LiteralPath (Join-Path $legacySkill 'SKILL.md') -Value 'duplicate'
    $duplicateResult = Invoke-Verify $duplicateFixture
    Assert-True ($duplicateResult.ExitCode -ne 0) 'Verifier must reject a duplicate legacy skill.'
    Assert-True ($duplicateResult.Output.Contains('Legacy skill directory must be removed')) 'Duplicate-skill error must explain the conflict.'

    $secretFixture = Join-Path $tempRoot 'secret-config'
    Copy-ContractFixture -Source $repoRoot -Destination $secretFixture
    Add-Content -LiteralPath (Join-Path $secretFixture 'bootstrap/config.portable.toml') -Value ("`n" + 'api_token = "secret-value"')
    $secretResult = Invoke-Verify $secretFixture
    Assert-True ($secretResult.ExitCode -ne 0) 'Verifier must reject secret-like config values.'
    Assert-True ($secretResult.Output.Contains('Portable config contains a secret-like assignment')) 'Secret error must identify the unsafe category without printing the value.'

    Write-Output '[PASS] Bootstrap contract tests passed.'
    exit 0
} catch {
    Write-Error "[FAIL] $($_.Exception.Message)"
    exit 1
} finally {
    if (Test-Path -LiteralPath $tempRoot) {
        $resolvedTemp = [System.IO.Path]::GetFullPath($tempRoot)
        $systemTemp = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
        if ($resolvedTemp.StartsWith($systemTemp, [System.StringComparison]::OrdinalIgnoreCase) -and
            ([System.IO.Path]::GetFileName($resolvedTemp)).StartsWith('cupis-bootstrap-tests-')) {
            Remove-Item -Recurse -Force -LiteralPath $resolvedTemp
        }
    }
}
