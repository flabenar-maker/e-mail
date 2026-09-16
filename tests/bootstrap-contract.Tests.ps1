$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$verifyScript = Join-Path $repoRoot 'bootstrap/verify.ps1'
$powerShell = if (Get-Command pwsh -ErrorAction SilentlyContinue) {
    (Get-Command pwsh).Source
} else {
    (Get-Command powershell -ErrorAction Stop).Source
}

$fixtureFiles = @(
    'README.md', 'AGENTS.md', '.gitattributes',
    'bootstrap/config.portable.toml', 'bootstrap/README.md', 'bootstrap/verify.ps1',
    '.agents/skills/maintaining-cupis-email-system/SKILL.md',
    '.agents/skills/maintaining-cupis-email-system/agents/openai.yaml',
    'core/asset-export-standard.md', 'core/component-contract-standard.md',
    'core/email-rendering-standard.md', 'core/figma-component-description-standard.md',
    'core/figma-library-standard.md', 'core/typography-standard.md',
    'workflows/system-paused.md', 'system/manifest.yaml',
    'schemas/assets.schema.json', 'schemas/components.schema.json',
    'schemas/figma-naming.schema.json', 'schemas/manifest.schema.json',
    'schemas/renderer-registry.schema.json', 'schemas/rendering.schema.json',
    'schemas/spacing.schema.json', 'schemas/typography.schema.json',
    'data/components/marketing.yaml', 'data/components/service.yaml',
    'data/components/shared.yaml', 'data/foundations/assets.yaml',
    'data/foundations/figma-naming.yaml', 'data/foundations/rendering.yaml',
    'data/foundations/spacing.yaml', 'data/foundations/typography.yaml',
    'data/renderers/registry.yaml', 'docs/generated/asset-registry.md',
    'docs/generated/component-registry.md', 'docs/generated/naming-reference.md',
    'docs/generated/typography-registry.md',
    'docs/superpowers/plans/2026-08-25-cupis-migration-roadmap.md'
)

function Get-FixtureRelativeFilePaths {
    param([string]$Root)
    $resolvedRoot = [System.IO.Path]::GetFullPath($Root).TrimEnd(
        [System.IO.Path]::DirectorySeparatorChar,
        [System.IO.Path]::AltDirectorySeparatorChar
    ) + [System.IO.Path]::DirectorySeparatorChar
    Get-ChildItem -LiteralPath $Root -File -Recurse |
        ForEach-Object {
            ([System.IO.Path]::GetFullPath($_.FullName)).Substring($resolvedRoot.Length).Replace('\', '/')
        } |
        Sort-Object
}
function Get-ManifestFixtureFilePaths {
    param([string]$Root)
    $node = Get-Command node -ErrorAction Stop
    $program = @"
import { lstat, readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { parse } from "yaml";
const root = resolve(process.argv[1]);
const manifest = parse(await readFile(join(root, "system/manifest.yaml"), "utf8"));
const declaredPaths = [manifest.entrypoints.repository, manifest.entrypoints.bootstrap, ...manifest.sources.map(({ path }) => path), manifest.bootstrap.portable_config, manifest.bootstrap.verifier, ...manifest.skills.required.map(({ path }) => path), "AGENTS.md", ".gitattributes"];
async function expand(relativePath) {
  const absolutePath = resolve(root, relativePath);
  const stat = await lstat(absolutePath);
  if (stat.isFile()) return [relative(root, absolutePath).replaceAll("\\", "/")];
  const entries = await readdir(absolutePath, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const entryPath = join(absolutePath, entry.name);
    return entry.isDirectory() ? expand(relative(root, entryPath)) : [relative(root, entryPath).replaceAll("\\", "/")];
  }))).flat();
}
console.log(JSON.stringify([...new Set((await Promise.all(declaredPaths.map(expand))).flat())].sort()));
"@
    $output = & $node.Source --input-type=module --eval $program $Root 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) { throw "Could not derive fixture files from manifest:`n$output" }
    [string[]](ConvertFrom-Json $output)
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
    foreach ($file in $fixtureFiles) {
        $sourcePath = Join-Path $Source $file
        $destinationPath = Join-Path $Destination $file
        New-Item -ItemType Directory -Path (Split-Path -Parent $destinationPath) -Force | Out-Null
        Copy-Item -LiteralPath $sourcePath -Destination $destinationPath
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
    foreach ($archivedPath in @('Legacy', 'registry', 'templates')) {
        Assert-True (-not (Test-Path -LiteralPath (Join-Path $readOnlyFixture $archivedPath))) "Fixture must not copy archived path: $archivedPath."
    }
    $actualFixtureFiles = Get-FixtureRelativeFilePaths $readOnlyFixture
    $expectedFixtureFiles = Get-ManifestFixtureFilePaths $repoRoot
    Assert-True (($actualFixtureFiles -join "`n") -eq ($expectedFixtureFiles -join "`n")) 'Fixture must copy only active manifest sources and bootstrap assertions.'

    $manifestDrivenSource = Join-Path $tempRoot 'manifest-driven-source'
    Copy-ContractFixture -Source $repoRoot -Destination $manifestDrivenSource
    $manifestOnlySource = 'docs/superpowers/plans/2026-08-24-cupis-structured-system-foundation.md'
    $manifestOnlyDestination = Join-Path $manifestDrivenSource $manifestOnlySource
    New-Item -ItemType Directory -Path (Split-Path -Parent $manifestOnlyDestination) -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $repoRoot $manifestOnlySource) -Destination $manifestOnlyDestination
    $manifestPath = Join-Path $manifestDrivenSource 'system/manifest.yaml'
    $manifestContent = Get-Content -Raw -LiteralPath $manifestPath
    Set-Content -NoNewline -LiteralPath $manifestPath -Value ($manifestContent.Replace(
        'sources:',
        "sources:`n  - { id: fixture-manifest-source, kind: core, path: $manifestOnlySource }"
    ))
    $manifestDrivenFixture = Join-Path $tempRoot 'manifest-driven-fixture'
    Copy-ContractFixture -Source $manifestDrivenSource -Destination $manifestDrivenFixture
    $manifestDrivenActual = Get-FixtureRelativeFilePaths $manifestDrivenFixture
    $manifestDrivenExpected = Get-ManifestFixtureFilePaths $manifestDrivenSource
    Assert-True (($manifestDrivenActual -join "`n") -eq ($manifestDrivenExpected -join "`n")) 'Fixture must derive active source files from the manifest.'
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
    Remove-Item -LiteralPath (Join-Path $missingSource 'core/email-rendering-standard.md')
    $missingSourceResult = Invoke-Verify $missingSource
    Assert-True ($missingSourceResult.ExitCode -ne 0) 'Verifier must reject a missing declared source.'
    Assert-True ($missingSourceResult.Output.Contains('missing-declared-path')) 'Missing source must expose its diagnostic code.'

    $legacySkill = Join-Path $tempRoot 'legacy-skill'
    Copy-ContractFixture -Source $repoRoot -Destination $legacySkill
    New-Item -ItemType Directory -Path (Join-Path $legacySkill 'skills/maintaining-cupis-email-system') -Force | Out-Null
    Set-Content -LiteralPath (Join-Path $legacySkill 'skills/maintaining-cupis-email-system/SKILL.md') -Value 'duplicate'
    $legacySkillResult = Invoke-Verify $legacySkill
    Assert-True ($legacySkillResult.ExitCode -ne 0) 'Verifier must reject a legacy skill.'
    Assert-True ($legacySkillResult.Output.Contains('retired-skill-path')) 'Legacy skill must expose its diagnostic code.'

    $legacyManifest = Join-Path $tempRoot 'legacy-manifest'
    Copy-ContractFixture -Source $repoRoot -Destination $legacyManifest
    Set-Content -LiteralPath (Join-Path $legacyManifest 'bootstrap/manifest.yaml') -Value 'legacy: true'
    $legacyManifestResult = Invoke-Verify $legacyManifest
    Assert-True ($legacyManifestResult.ExitCode -ne 0) 'Verifier must reject the legacy manifest.'
    Assert-True ($legacyManifestResult.Output.Contains('retired-manifest-path')) 'Legacy manifest must expose its diagnostic code.'

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
