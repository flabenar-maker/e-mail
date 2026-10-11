param(
    [Parameter(Mandatory = $true)][string]$NodeExecutable,
    [Parameter(Mandatory = $true)][string]$TemporaryRoot
)
# Called only by explicit init/reassessment; the parent limits this process to 15 seconds.
# Read only the allowlisted baseline properties. Never emit machine/user identifiers.
$ErrorActionPreference = 'Stop'
$logicalCpus = $null
$physicalRam = $null
$freeRam = $null
$freeDisk = $null
try {
    $system = Get-CimInstance -ClassName Win32_ComputerSystem -Property NumberOfLogicalProcessors, TotalPhysicalMemory -OperationTimeoutSec 3
    $logicalCpus = [int]$system.NumberOfLogicalProcessors
    $physicalRam = [double]$system.TotalPhysicalMemory / 1GB
} catch { }
try {
    $memory = Get-CimInstance -ClassName Win32_OperatingSystem -Property FreePhysicalMemory -OperationTimeoutSec 3
    $freeRam = [double]$memory.FreePhysicalMemory * 1KB / 1GB
} catch { }
try {
    $temporaryDrive = [System.IO.DriveInfo]::new([System.IO.Path]::GetPathRoot([System.IO.Path]::GetFullPath($TemporaryRoot)))
    $freeDisk = [double]$temporaryDrive.AvailableFreeSpace / 1GB
} catch { }
$architecture = $null
$nativeArchitecture = $env:PROCESSOR_ARCHITEW6432
if (-not $nativeArchitecture) { $nativeArchitecture = $env:PROCESSOR_ARCHITECTURE }
switch ($nativeArchitecture) {
    'AMD64' { $architecture = 'x64' }
    'ARM64' { $architecture = 'arm64' }
    'x86' { $architecture = 'ia32' }
}
$nodePresent = $false
$nodeMajor = $null
try {
    $version = (& $NodeExecutable --version 2>$null | Out-String).Trim()
    if ($LASTEXITCODE -eq 0 -and $version -match '^v([0-9]+)\.') { $nodePresent = $true; $nodeMajor = [int]$Matches[1] }
} catch { }
$profile = [ordered]@{
    platform = 'win32'
    architecture = $architecture
    logical_cpus = $logicalCpus
    physical_ram_gib = $physicalRam
    free_ram_gib = $freeRam
    free_temporary_disk_gib = $freeDisk
    runtimes = [ordered]@{
        node = [ordered]@{ present = $nodePresent; major = $nodeMajor }
        powershell = [ordered]@{ present = $true }
    }
}
$profile | ConvertTo-Json -Depth 4 -Compress
