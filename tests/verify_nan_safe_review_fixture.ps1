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

function Convert-ToSafeFlag {
    param(
        [double] $RawValue
    )

    if ([double]::IsNaN($RawValue)) {
        return 0
    }

    if ($RawValue -ne 0) {
        return 1
    }

    return 0
}

$rawRealEntry = [double]::NaN
$rawReviewSetup = [double]::NaN
$rawProbeSignal = 1

$realEntryFlag = Convert-ToSafeFlag -RawValue $rawRealEntry
$reviewSetupFlag = Convert-ToSafeFlag -RawValue $rawReviewSetup
$reviewSignal = ($realEntryFlag -eq 1) -or ($reviewSetupFlag -eq 1)
$probeCanPlot = ($rawProbeSignal -eq 1) -and -not $reviewSignal

Assert-True -Condition (-not $reviewSignal) -Message "NaN review components must collapse to a false review signal"
Assert-True -Condition $probeCanPlot -Message "Probe arrow should still plot when setup/probe is true and review is NaN-safe false"
Assert-True -Condition (-not [double]::IsNaN($realEntryFlag)) -Message "Safe real-entry flag must not be NaN"
Assert-True -Condition (-not [double]::IsNaN($reviewSetupFlag)) -Message "Safe setup-review flag must not be NaN"

Write-Host "NaN-safe review fixture verification passed."
