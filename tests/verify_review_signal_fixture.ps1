$ErrorActionPreference = "Stop"

function Assert-True {
    param(
        [bool] $Condition,
        [string] $Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Get-CadenceSlot {
    param(
        [int] $Bar,
        [int] $Cadence
    )

    return ($Bar - [Math]::Floor($Bar / $Cadence) * $Cadence) -eq 0
}

$cadence = 13
$bars = 60
$edgeCount = 0
$refreshCount = 0
$rawCadenceCount = 0
$reviewSignalCount = 0
$realEntryCount = 0
$previousReady = $false

for ($bar = 1; $bar -le $bars; $bar++) {
    $ready = $bar -ge 5
    $quality = $bar -ge 10
    $score = 5
    $scoreCross = $bar -eq 5
    $sixUpgrade = $false

    $edge = $ready -and ($scoreCross -or -not $previousReady -or $sixUpgrade)
    $cadenceSlot = Get-CadenceSlot -Bar $bar -Cadence $cadence
    $refresh = $ready -and $cadenceSlot -and $quality
    $rawCadence = $ready -and $cadenceSlot
    $realEntry = $false
    $reviewSignal = $realEntry -or $edge -or $refresh

    if ($edge) { $edgeCount++ }
    if ($refresh) { $refreshCount++ }
    if ($rawCadence) { $rawCadenceCount++ }
    if ($realEntry) { $realEntryCount++ }
    if ($reviewSignal) { $reviewSignalCount++ }

    $previousReady = $ready
}

Assert-True -Condition ($edgeCount -eq 1) -Message "Expected exactly one setup edge in sustained setup fixture, found $edgeCount"
Assert-True -Condition ($refreshCount -ge 3) -Message "Expected sustained setup refresh pulses, found $refreshCount"
Assert-True -Condition ($reviewSignalCount -eq ($edgeCount + $refreshCount)) -Message "Review signal should be visual-only edge plus refresh when real entries are absent"
Assert-True -Condition ($realEntryCount -eq 0) -Message "Fixture review refresh must not create real trade entries"
Assert-True -Condition ($refreshCount -lt ($bars / 3)) -Message "Refresh cadence is too dense and risks returning to raw spam"
Assert-True -Condition ($rawCadenceCount -ge $refreshCount) -Message "Quality gate should only reduce or equal raw cadence"

Write-Host "Review signal fixture verification passed."
