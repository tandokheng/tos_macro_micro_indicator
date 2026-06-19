$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$studyPath = Join-Path $root "MacroMicro_Simplified_v0.2.1.ts"

function Assert-True {
    param(
        [bool] $Condition,
        [string] $Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Assert-Contains {
    param(
        [string] $Text,
        [string] $Needle,
        [string] $Description
    )

    Assert-True -Condition $Text.Contains($Needle) -Message "Missing: $Description"
}

Assert-True -Condition (Test-Path -LiteralPath $studyPath) -Message "Study file does not exist: $studyPath"

$text = Get-Content -LiteralPath $studyPath -Raw

Assert-Contains $text "# Version: v0.2.1" "v0.2.1 version header"
Assert-Contains $text "Timeframe focus: 5m first, then 15m validation/tuning." "5m-first tuning note"
Assert-Contains $text "def standbyThreshold = 4;" "4/6 standby threshold"
Assert-Contains $text "def triggerThreshold = 5;" "5/6 trigger threshold"
Assert-Contains $text "input dangerScoreThreshold = 3;" "danger score threshold"
Assert-Contains $text "input dangerDropFromPeak = 2;" "danger drop from peak"
Assert-Contains $text "plot StandbyLongDot" "long standby dot plot"
Assert-Contains $text "plot StandbyShortDot" "short standby dot plot"
Assert-Contains $text "plot LongArrow" "primary long arrow"
Assert-Contains $text "plot ShortArrow" "primary short arrow"
Assert-True -Condition ([regex]::Matches($text, "(?m)^\s*plot\s+LongArrow\b").Count -eq 1) -Message "Expected exactly one LongArrow plot"
Assert-True -Condition ([regex]::Matches($text, "(?m)^\s*plot\s+ShortArrow\b").Count -eq 1) -Message "Expected exactly one ShortArrow plot"
Assert-True -Condition ([regex]::Matches($text, "PaintingStrategy\.ARROW_UP").Count -eq 1) -Message "Expected exactly one up-arrow painting strategy"
Assert-True -Condition ([regex]::Matches($text, "PaintingStrategy\.ARROW_DOWN").Count -eq 1) -Message "Expected exactly one down-arrow painting strategy"
Assert-Contains $text "def longCandleConfirm" "long candle confirmation"
Assert-Contains $text "def shortCandleConfirm" "short candle confirmation"
Assert-Contains $text "def extremeLowRelVolume" "extreme low relative volume gate"
Assert-Contains $text "def exceptionalLongMomentum" "exceptional long momentum override"
Assert-Contains $text "def exceptionalShortMomentum" "exceptional short momentum override"
Assert-Contains $text "def longVolumeOK" "long direction volume gate"
Assert-Contains $text "def shortVolumeOK" "short direction volume gate"
Assert-Contains $text "def tradeBlocked" "trade blocked state"
Assert-Contains $text "def longTradeOK" "long trade permission state"
Assert-Contains $text "def shortTradeOK" "short trade permission state"
Assert-Contains $text "def trendResetLong" "long trend reset state"
Assert-Contains $text "def trendResetShort" "short trend reset state"
Assert-Contains $text "def continuationLongSignal" "long continuation signal"
Assert-Contains $text "def continuationShortSignal" "short continuation signal"
Assert-Contains $text "def activeTradeScore" "active trade score"
Assert-Contains $text "def peakTradeScore" "peak trade score"
Assert-Contains $text "def longDanger" "long danger state"
Assert-Contains $text "def shortDanger" "short danger state"
Assert-Contains $text "def longDangerEdge" "long danger edge"
Assert-Contains $text "def shortDangerEdge" "short danger edge"
Assert-Contains $text "def longProfitMove = close - activeEntryPrice;" "directional long profit calculation"
Assert-Contains $text "def shortProfitMove = activeEntryPrice - close;" "directional short profit calculation"
Assert-Contains $text "def longTargetPrice = activeEntryPrice + lockedATR * targetATRFactor;" "long ATR target"
Assert-Contains $text "def shortTargetPrice = activeEntryPrice - lockedATR * targetATRFactor;" "short ATR target"
Assert-Contains $text "def longStopPrice = activeEntryPrice - lockedATR * stopATRFactor;" "long ATR stop"
Assert-Contains $text "def shortStopPrice = activeEntryPrice + lockedATR * stopATRFactor;" "short ATR stop"
Assert-Contains $text "if showTargetStopLines and activeDir == 1 then longTargetPrice" "long target only while trade is active"
Assert-Contains $text "if showTargetStopLines and activeDir == -1 then shortTargetPrice" "short target only while trade is active"
Assert-Contains $text "if showTargetStopLines and targetHit and activeDir[1] == 1 then longTargetPrice[1]" "long target visible on hit bar"
Assert-Contains $text "if showTargetStopLines and stopHit and activeDir[1] == 1 then longStopPrice[1]" "long stop visible on hit bar"
Assert-Contains $text "AddChartBubble(showSignalBubbles and newLongEntry" "compact long signal bubble"
Assert-Contains $text "AddChartBubble(showSignalBubbles and newShortEntry" "compact short signal bubble"
Assert-Contains $text "AddChartBubble(showContinuationBubbles and continuationLongSignal" "long continuation bubble"
Assert-Contains $text "AddChartBubble(showContinuationBubbles and continuationShortSignal" "short continuation bubble"
Assert-Contains $text "AddChartBubble(showDangerBubbles and longDangerEdge" "long danger bubble"
Assert-Contains $text "AddChartBubble(showDangerBubbles and shortDangerEdge" "short danger bubble"
Assert-Contains $text '"ENTRY L "' "entry long bubble label"
Assert-Contains $text '"ADD L "' "add long bubble label"
Assert-Contains $text '"DANGER L "' "danger long bubble label"
Assert-Contains $text '"PT"' "profit target bubble label"
Assert-Contains $text '"SL"' "stop loss bubble label"
Assert-Contains $text '"TRADE: "' "trade dashboard label"
Assert-Contains $text '"OK"' "trade ok dashboard state"
Assert-Contains $text '"CAUTION"' "risk caution dashboard state"
Assert-Contains $text '"BLOCKED"' "trade blocked dashboard state"

Assert-True -Condition (-not $text.Contains("AbsValue(close - entryPrice)")) -Message "Old absolute target math is still present"
Assert-True -Condition (-not $text.Contains('"RISK: "')) -Message "Old RISK dashboard label is still present"
Assert-True -Condition (-not $text.Contains('"NORMAL"')) -Message "Old risk NORMAL dashboard state is still present"
Assert-True -Condition (-not $text.Contains("plot NeutralUpArrow")) -Message "Old neutral up arrow plot is still present"
Assert-True -Condition (-not $text.Contains("plot NeutralDownArrow")) -Message "Old neutral down arrow plot is still present"
Assert-True -Condition (-not $text.Contains("plot ConfluenceUpArrow")) -Message "Old confluence up arrow plot is still present"
Assert-True -Condition (-not $text.Contains("plot ConfluenceDownArrow")) -Message "Old confluence down arrow plot is still present"

Write-Host "Simplified indicator verification passed."
