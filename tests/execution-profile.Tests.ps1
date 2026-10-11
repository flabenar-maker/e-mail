param([string]$RepositoryRoot = (Split-Path -Parent $PSScriptRoot))
$ErrorActionPreference = 'Stop'
$temporaryRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('cupis-profile-contract-' + [guid]::NewGuid().ToString())
[System.IO.Directory]::CreateDirectory($temporaryRoot) | Out-Null
try {
    $fixture = @'
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
import {readFile} from 'node:fs/promises';
const [repo,temporaryRoot]=process.argv.slice(2);
const api=await import(pathToFileURL(join(repo,'scripts/init-execution-profile.mjs'))).catch(()=>({}));
assert.equal(typeof api.runExecutionProfile,'function','profile command must exist');
let calls=0;
const collectOnce=async()=>{if(++calls>1)throw Error('COLLECTOR_MUST_NOT_RUN');return {platform:'win32',architecture:'x64',logical_cpus:8,physical_ram_gib:16,free_ram_gib:8,free_temporary_disk_gib:4,runtimes:{node:{present:true,major:24},powershell:{present:true}}};};
const args=['--workspace',join(temporaryRoot,'persistent-workspace'),'--pair-key','synthetic-powershell-pair'];
const first=await api.runExecutionProfile(['--action','init',...args],{collectOnce,repoRoot:repo});
assert.equal(first.status,'resolved');
assert.equal(first.profile.observations_status,'available');
assert.equal(first.profile.workload_decisions.find(x=>x.id==='windows-bootstrap').target,'local');
await api.runExecutionProfile(['--action','init',...args],{collectOnce,repoRoot:repo});
for(let i=0;i<100;i++)assert.equal((await api.runExecutionProfile(['--action','read',...args],{collectOnce,repoRoot:repo})).profile.initialized_at,first.profile.initialized_at);
assert.equal(calls,1);
await assert.rejects(api.runExecutionProfile(['--action','refresh',...args],{collectOnce,repoRoot:repo}),{code:'PROFILE_REFRESH_REQUIRED'});
console.log('PASS: external persistent profile, repeat init and 100 reads; synthetic collector only.');
'@
    $fixturePath = Join-Path $temporaryRoot 'profile-fixture.mjs'
    [System.IO.File]::WriteAllText($fixturePath, $fixture, [System.Text.UTF8Encoding]::new($false))
    & node $fixturePath $RepositoryRoot $temporaryRoot
    if ($LASTEXITCODE -ne 0) { throw 'Execution profile contract failed.' }
    # Parse collector in the actual Windows PowerShell language without running it.
    $collectorPath = Join-Path $RepositoryRoot 'bootstrap/collect-machine-profile.ps1'
    if (-not (Test-Path -LiteralPath $collectorPath -PathType Leaf)) { throw 'Collector is missing.' }
    $parseTokens = $null
    $parseErrors = $null
    [System.Management.Automation.Language.Parser]::ParseFile($collectorPath, [ref]$parseTokens, [ref]$parseErrors) | Out-Null
    if ($parseErrors.Count -gt 0) { throw 'Collector is incompatible with this PowerShell parser.' }
    # Synthetic query functions intercept both CIM reads; invalid temp path prevents
    # any actual disk query even on the intentionally failing pre-fix implementation.
    $script:denialQueries = 0
    function Get-CimInstance {
        param($ClassName, $Property, $OperationTimeoutSec)
        $script:denialQueries++
        throw [System.UnauthorizedAccessException]::new('Synthetic denied observation')
    }
    $denialPropagated = $false
    try {
        & $collectorPath -NodeExecutable 'COLLECTOR_MUST_NOT_RUN' -TemporaryRoot ([string][char]0) | Out-Null
    } catch { $denialPropagated = $true }
    finally { Remove-Item -LiteralPath 'Function:\Get-CimInstance' }
    if (-not $denialPropagated -or $script:denialQueries -ne 1) { throw 'Collector must stop on the first denied query and propagate unavailable; no retry.' }
    Write-Output '[PASS] Execution profile contract passed; actual hardware was not sampled.'
} finally {
    $resolvedTemporaryRoot = [System.IO.Path]::GetFullPath($temporaryRoot)
    $expectedPrefix = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
    if ($resolvedTemporaryRoot.StartsWith($expectedPrefix, [System.StringComparison]::OrdinalIgnoreCase) -and ([System.IO.Path]::GetFileName($resolvedTemporaryRoot)).StartsWith('cupis-profile-contract-')) { Remove-Item -LiteralPath $resolvedTemporaryRoot -Recurse -Force }
}
