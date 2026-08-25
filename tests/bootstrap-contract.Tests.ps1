$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$verifyScript = Join-Path $repoRoot 'bootstrap/verify.ps1'
$powerShell = if (Get-Command pwsh -ErrorAction SilentlyContinue) {
    (Get-Command pwsh).Source
} else {
    (Get-Command powershell -ErrorAction Stop).Source
}

function Assert-True {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw $Message }
}

function Invoke-Verify {
    param([string]$Root, [string]$Engine = $powerShell)
    $engineArguments = @('-NoProfile')
    if ([System.IO.Path]::GetFileNameWithoutExtension($Engine) -eq 'powershell') {
        $engineArguments += @('-ExecutionPolicy', 'Bypass')
    }
    $engineArguments += @('-File', $verifyScript, '-RepositoryRoot', $Root)
    $output = & $Engine @engineArguments 2>&1 | Out-String
    [pscustomobject]@{ ExitCode = $LASTEXITCODE; Output = $output }
}

function Copy-ContractFixture {
    param([string]$Source, [string]$Destination)
    New-Item -ItemType Directory -Path $Destination | Out-Null
    foreach ($file in @('README.md', 'AGENTS.md', '.gitattributes')) {
        Copy-Item -LiteralPath (Join-Path $Source $file) -Destination (Join-Path $Destination $file)
    }
    foreach ($directory in @(
        'bootstrap', '.agents', 'core', 'registry', 'workflows',
        'system', 'schemas', 'templates', 'data'
    )) {
        Copy-Item -Recurse -LiteralPath (Join-Path $Source $directory) -Destination (Join-Path $Destination $directory)
    }
}

function Get-FixtureHash {
    param([string]$Root)
    $resolvedRoot = [System.IO.Path]::GetFullPath($Root).TrimEnd(
        [System.IO.Path]::DirectorySeparatorChar,
        [System.IO.Path]::AltDirectorySeparatorChar
    ) + [System.IO.Path]::DirectorySeparatorChar
    $lines = Get-ChildItem -LiteralPath $Root -File -Recurse |
        Sort-Object FullName |
        ForEach-Object {
            $fullName = [System.IO.Path]::GetFullPath($_.FullName)
            $relative = $fullName.Substring($resolvedRoot.Length)
            $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash
            "$relative=$hash"
        }
    $bytes = [System.Text.Encoding]::UTF8.GetBytes(($lines -join "`n"))
    $stream = [System.IO.MemoryStream]::new($bytes)
    try { (Get-FileHash -Algorithm SHA256 -InputStream $stream).Hash }
    finally { $stream.Dispose() }
}

function Add-RequiredSkill {
    param([string]$Root, [string]$Name, [bool]$CreateFile, [string]$FrontmatterName = $Name)
    $manifestPath = Join-Path $Root 'system/manifest.yaml'
    $content = Get-Content -Raw -LiteralPath $manifestPath
    $needle = '    - { id: maintaining-cupis-email-system, path: .agents/skills/maintaining-cupis-email-system }'
    $replacement = $needle + "`n    - { id: $Name, path: .agents/skills/$Name }"
    Set-Content -NoNewline -LiteralPath $manifestPath -Value ($content.Replace($needle, $replacement))
    if ($CreateFile) {
        $skillDirectory = Join-Path $Root ".agents/skills/$Name"
        New-Item -ItemType Directory -Path $skillDirectory -Force | Out-Null
        Set-Content -LiteralPath (Join-Path $skillDirectory 'SKILL.md') -Value "---`nname: $FrontmatterName`n---`n"
    }
}

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("cupis-bootstrap-tests-" + [guid]::NewGuid().ToString('N'))

try {
    Assert-True (Test-Path -LiteralPath $verifyScript -PathType Leaf) 'Verifier must exist.'
    Assert-True (Test-Path -LiteralPath (Join-Path $repoRoot 'system/manifest.yaml') -PathType Leaf) 'Canonical system manifest must exist.'
    Assert-True (-not (Test-Path -LiteralPath (Join-Path $repoRoot 'bootstrap/manifest.yaml'))) 'Legacy bootstrap manifest must not exist.'

    foreach ($consumer in @('README.md', 'bootstrap/README.md', '.agents/skills/maintaining-cupis-email-system/SKILL.md')) {
        $content = Get-Content -Raw -LiteralPath (Join-Path $repoRoot $consumer)
        Assert-True ($content.Contains('system/manifest.yaml')) "$consumer must use system/manifest.yaml."
        Assert-True (-not $content.Contains('bootstrap/manifest.yaml')) "$consumer must not use bootstrap/manifest.yaml."
    }

    $readme = [System.Text.Encoding]::UTF8.GetString(
        [System.IO.File]::ReadAllBytes((Join-Path $repoRoot 'README.md'))
    )
    $readOnlyPhrase = [System.Text.Encoding]::UTF8.GetString(
        [System.Convert]::FromBase64String('0J7Qt9C90LDQutC+0LzRjNGB0Y8g0YEg0L/RgNC+0LXQutGC0L7QvA==')
    )
    $restorePhrase = [System.Text.Encoding]::UTF8.GetString(
        [System.Convert]::FromBase64String('0JLQvtGB0YHRgtCw0L3QvtCy0Lgg0YDQsNCx0L7Rh9GD0Y4g0YHRgNC10LTRgyDQv9GA0L7QtdC60YLQsA==')
    )
    Assert-True ($readme.Contains($readOnlyPhrase)) 'README must declare the read-only phrase.'
    Assert-True ($readme.Contains($restorePhrase)) 'README must declare the restore phrase.'
    Assert-True ($readme.Contains('bootstrap/README.md')) 'README must link the bootstrap protocol.'

    $attributes = Get-Content -Raw -LiteralPath (Join-Path $repoRoot '.gitattributes')
    Assert-True ($attributes.Contains('.agents/skills/** text eol=lf')) '.gitattributes must normalize every repo-scoped skill.'

    $valid = Invoke-Verify $repoRoot
    Assert-True ($valid.ExitCode -eq 0) "Valid repository failed verification:`n$($valid.Output)"

    $windowsPowerShell = Get-Command powershell -ErrorAction SilentlyContinue
    if ($windowsPowerShell) {
        $windowsResult = Invoke-Verify -Root $repoRoot -Engine $windowsPowerShell.Source
        Assert-True ($windowsResult.ExitCode -eq 0) "Windows PowerShell failed verification:`n$($windowsResult.Output)"
    }

    New-Item -ItemType Directory -Path $tempRoot | Out-Null

    $readOnlyFixture = Join-Path $tempRoot 'read-only'
    Copy-ContractFixture -Source $repoRoot -Destination $readOnlyFixture
    $beforeHash = Get-FixtureHash $readOnlyFixture
    $firstRun = Invoke-Verify $readOnlyFixture
    $secondRun = Invoke-Verify $readOnlyFixture
    $afterHash = Get-FixtureHash $readOnlyFixture
    Assert-True ($firstRun.ExitCode -eq 0 -and $secondRun.ExitCode -eq 0) 'Verifier must pass repeatedly on a valid fixture.'
    Assert-True ($beforeHash -eq $afterHash) 'Verifier must not modify repository files.'

    $missingRequired = Join-Path $tempRoot 'missing-required-skill'
    Copy-ContractFixture -Source $repoRoot -Destination $missingRequired
    Add-RequiredSkill -Root $missingRequired -Name 'future-email-skill' -CreateFile $false
    $missingRequiredResult = Invoke-Verify $missingRequired
    Assert-True ($missingRequiredResult.ExitCode -ne 0) 'Verifier must reject a missing required skill.'
    Assert-True ($missingRequiredResult.Output.Contains('missing-required-skill')) 'Missing skill error must expose its diagnostic code.'

    $presentRequired = Join-Path $tempRoot 'present-required-skill'
    Copy-ContractFixture -Source $repoRoot -Destination $presentRequired
    Add-RequiredSkill -Root $presentRequired -Name 'future-email-skill' -CreateFile $true
    $presentRequiredResult = Invoke-Verify $presentRequired
    Assert-True ($presentRequiredResult.ExitCode -eq 0) "Verifier must accept a valid required skill:`n$($presentRequiredResult.Output)"

    $missingOptional = Join-Path $tempRoot 'missing-optional-skill'
    Copy-ContractFixture -Source $repoRoot -Destination $missingOptional
    $optionalManifest = Join-Path $missingOptional 'system/manifest.yaml'
    $optionalContent = Get-Content -Raw -LiteralPath $optionalManifest
    Set-Content -NoNewline -LiteralPath $optionalManifest -Value (
        $optionalContent.Replace(
            '  optional: []',
            '  optional: [{ id: optional-email-skill, path: .agents/skills/optional-email-skill }]'
        )
    )
    $missingOptionalResult = Invoke-Verify $missingOptional
    Assert-True ($missingOptionalResult.ExitCode -eq 0) "Verifier must allow a missing optional skill:`n$($missingOptionalResult.Output)"

    $mismatchedSkill = Join-Path $tempRoot 'mismatched-skill'
    Copy-ContractFixture -Source $repoRoot -Destination $mismatchedSkill
    Add-RequiredSkill -Root $mismatchedSkill -Name 'future-email-skill' -CreateFile $true -FrontmatterName 'wrong-skill-name'
    $mismatchedResult = Invoke-Verify $mismatchedSkill
    Assert-True ($mismatchedResult.ExitCode -ne 0) 'Verifier must reject a mismatched skill name.'
    Assert-True ($mismatchedResult.Output.Contains('skill-name-mismatch')) 'Mismatch must expose its diagnostic code.'

    $missingSource = Join-Path $tempRoot 'missing-source'
    Copy-ContractFixture -Source $repoRoot -Destination $missingSource
    Remove-Item -LiteralPath (Join-Path $missingSource 'core/email-figma-prompt.md')
    $missingSourceResult = Invoke-Verify $missingSource
    Assert-True ($missingSourceResult.ExitCode -ne 0) 'Verifier must reject a missing declared source.'
    Assert-True ($missingSourceResult.Output.Contains('missing-declared-path')) 'Missing source must expose its diagnostic code.'

    $legacySkill = Join-Path $tempRoot 'legacy-skill'
    Copy-ContractFixture -Source $repoRoot -Destination $legacySkill
    New-Item -ItemType Directory -Path (Join-Path $legacySkill 'skills/maintaining-cupis-email-system') -Force | Out-Null
    Set-Content -LiteralPath (Join-Path $legacySkill 'skills/maintaining-cupis-email-system/SKILL.md') -Value 'duplicate'
    $legacySkillResult = Invoke-Verify $legacySkill
    Assert-True ($legacySkillResult.ExitCode -ne 0) 'Verifier must reject a legacy skill.'
    Assert-True ($legacySkillResult.Output.Contains('legacy-skill-path')) 'Legacy skill must expose its diagnostic code.'

    $legacyManifest = Join-Path $tempRoot 'legacy-manifest'
    Copy-ContractFixture -Source $repoRoot -Destination $legacyManifest
    Set-Content -LiteralPath (Join-Path $legacyManifest 'bootstrap/manifest.yaml') -Value 'legacy: true'
    $legacyManifestResult = Invoke-Verify $legacyManifest
    Assert-True ($legacyManifestResult.ExitCode -ne 0) 'Verifier must reject the legacy manifest.'
    Assert-True ($legacyManifestResult.Output.Contains('legacy-manifest-path')) 'Legacy manifest must expose its diagnostic code.'

    $secretFixture = Join-Path $tempRoot 'secret-config'
    Copy-ContractFixture -Source $repoRoot -Destination $secretFixture
    Add-Content -LiteralPath (Join-Path $secretFixture 'bootstrap/config.portable.toml') -Value ("`n" + 'api_token = "secret-value"')
    $secretResult = Invoke-Verify $secretFixture
    Assert-True ($secretResult.ExitCode -ne 0) 'Verifier must reject secret-like config values.'
    Assert-True ($secretResult.Output.Contains('Portable config contains a secret-like assignment')) 'Secret error must identify the unsafe category.'
    Assert-True (-not $secretResult.Output.Contains('secret-value')) 'Verifier must not print secret values.'

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
