$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$studyPath = Join-Path $root "MacroMicro_Simplified_v0.6.0.ts"
$tosStudyPath = Join-Path $root "_dk_codex_macro_micro_v1.ts"
$readableStudyPath = Join-Path $root "MacroMicro_Simplified_v0.6.0_READABLE.txt"
$gitAttributesPath = Join-Path $root ".gitattributes"

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

function Assert-NoRegex {
    param(
        [string] $Text,
        [string] $Pattern,
        [string] $Description
    )

    Assert-True -Condition (-not [regex]::IsMatch($Text, $Pattern)) -Message $Description
}

function Assert-RegexCount {
    param(
        [string] $Text,
        [string] $Pattern,
        [int] $Expected,
        [string] $Description
    )

    $count = [regex]::Matches($Text, $Pattern).Count
    Assert-True -Condition ($count -eq $Expected) -Message "$Description expected $Expected, found $count"
}

function Assert-MaxRegexCount {
    param(
        [string] $Text,
        [string] $Pattern,
        [int] $Maximum,
        [string] $Description
    )

    $count = [regex]::Matches($Text, $Pattern).Count
    Assert-True -Condition ($count -le $Maximum) -Message "$Description maximum $Maximum, found $count"
}

function Assert-Before {
    param(
        [string] $Text,
        [string] $Earlier,
        [string] $Later,
        [string] $Description
    )

    $earlierIndex = $Text.IndexOf($Earlier)
    $laterIndex = $Text.IndexOf($Later)
    Assert-True -Condition ($earlierIndex -ge 0) -Message "Missing order source: $Description"
    Assert-True -Condition ($laterIndex -ge 0) -Message "Missing order target: $Description"
    Assert-True -Condition ($earlierIndex -lt $laterIndex) -Message "Invalid ThinkScript definition order: $Description"
}

function Assert-RenderCallsClosed {
    param(
        [string] $Text,
        [string] $CallName
    )

    $escapedCall = [regex]::Escape($CallName)
    $openCount = [regex]::Matches($Text, "\b$escapedCall\s*\(").Count
    $closedCount = [regex]::Matches($Text, "\b$escapedCall\s*\((?s:.*?)\);").Count
    Assert-True -Condition ($openCount -eq $closedCount) -Message "$CallName render statements are not balanced: $closedCount closed / $openCount opened"
}

Assert-True -Condition (Test-Path -LiteralPath $studyPath) -Message "Study file does not exist: $studyPath"
Assert-True -Condition (Test-Path -LiteralPath $tosStudyPath) -Message "TOS import study file does not exist: $tosStudyPath"
Assert-True -Condition (Test-Path -LiteralPath $readableStudyPath) -Message "Side-panel readable study copy does not exist: $readableStudyPath"
Assert-True -Condition (Test-Path -LiteralPath $gitAttributesPath) -Message ".gitattributes must exist to keep TOS/powershell line endings stable"

$text = Get-Content -LiteralPath $studyPath -Raw
$tosText = Get-Content -LiteralPath $tosStudyPath -Raw
$readableText = Get-Content -LiteralPath $readableStudyPath -Raw
$gitAttributesText = Get-Content -LiteralPath $gitAttributesPath -Raw

Assert-RegexCount $text "(?m)^# Version:" 1 "single version header"
Assert-RegexCount $text "(?m)^declare upper;" 1 "single upper declaration"
Assert-NoRegex $text "(?m)^else\b" "Naked top-level else statement detected"
Assert-RenderCallsClosed $text "AddLabel"
Assert-RenderCallsClosed $text "AddChartBubble"
Assert-RenderCallsClosed $text "Alert"
Assert-Contains $gitAttributesText "*.ts text eol=lf" "ThinkScript LF normalization"
Assert-Contains $gitAttributesText "*.ps1 text eol=lf" "PowerShell LF normalization"
Assert-Contains $text "# Version: v0.6.0" "v0.6.0 version header"
Assert-Contains $text "# TOS Study: _dk_codex_macro_micro_v1" "TOS study name header"
Assert-Contains $text "declare upper;" "upper price-chart declaration"
Assert-True -Condition ($tosText -eq $text) -Message "TOS import study file must match MacroMicro_Simplified_v0.6.0.ts exactly"
Assert-True -Condition ($readableText -eq $text) -Message "Side-panel readable .txt copy must match MacroMicro_Simplified_v0.6.0.ts exactly"

Assert-MaxRegexCount $text "(?m)^\s*input\s+" 45 "simplified reset input count"
Assert-MaxRegexCount $text "(?m)^\s*plot\s+" 14 "simplified reset plot count"
Assert-MaxRegexCount $text "\bAddLabel\s*\(" 12 "simplified reset dashboard label count"
Assert-MaxRegexCount $text "\bAddChartBubble\s*\(" 16 "simplified reset bubble count"
Assert-MaxRegexCount $text "(?m)^\s*def\s+" 180 "simplified reset definition count"

Assert-Contains $text "def macroLongConfirmed =" "full macro long confluence"
Assert-Contains $text "def macroShortConfirmed =" "full macro short confluence"
Assert-Contains $text "emaLongOK and psarLongOK and superLongOK and lrcLongOK and valueLongOK" "long entry uses original-style full confluence"
Assert-Contains $text "emaShortOK and psarShortOK and superShortOK and lrcShortOK and valueShortOK" "short entry uses original-style full confluence"
Assert-Contains $text "def macroLongScore =" "soft long ready score"
Assert-Contains $text "def macroShortScore =" "soft short ready score"
Assert-Contains $text "def readyLong = macroLongScore >= readyScoreThreshold and !macroLongConfirmed and macroLongScore > macroShortScore;" "ready dot is softer than entry"
Assert-Contains $text "def readyShort = macroShortScore >= readyScoreThreshold and !macroShortConfirmed and macroShortScore > macroLongScore;" "short ready dot is softer than entry"

Assert-Contains $text "plot ReadyLongDotV0600 =" "single long ready dot plot"
Assert-Contains $text "plot ReadyShortDotV0600 =" "single short ready dot plot"
Assert-Contains $text "ReadyLongDotV0600.SetPaintingStrategy(PaintingStrategy.POINTS);" "ready long uses point plot"
Assert-Contains $text "ReadyShortDotV0600.SetPaintingStrategy(PaintingStrategy.POINTS);" "ready short uses point plot"
Assert-Contains $text "plot MacroLongArrowV0600 =" "single long entry arrow plot"
Assert-Contains $text "plot MacroShortArrowV0600 =" "single short entry arrow plot"
Assert-Contains $text "MacroLongArrowV0600.SetPaintingStrategy(PaintingStrategy.ARROW_UP);" "long entry uses value-based arrow"
Assert-Contains $text "MacroShortArrowV0600.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);" "short entry uses value-based arrow"
Assert-True -Condition ([regex]::Matches($text, "PaintingStrategy\.ARROW_UP").Count -eq 1) -Message "Only one up-arrow family should remain"
Assert-True -Condition ([regex]::Matches($text, "PaintingStrategy\.ARROW_DOWN").Count -eq 1) -Message "Only one down-arrow family should remain"
Assert-True -Condition (-not $text.Contains("PaintingStrategy.BOOLEAN_ARROW")) -Message "Do not use BOOLEAN_ARROW; use value-based ARROW_UP/ARROW_DOWN plots at a price offset"

Assert-Contains $text "def planEntryPrice =" "plan entry state"
Assert-Contains $text "def planStopPrice =" "R-based stop state"
Assert-Contains $text "def planTP1Price =" "R-based TP1 state"
Assert-Contains $text "def planTP2Price =" "R-based TP2 state"
Assert-Contains $text "def planPSARSlopeATR =" "PSAR gradient context"
Assert-Contains $text "def planRunnerActive = planOutcomeState == 3;" "PSAR runner state"
Assert-Contains $text "def planInvalidated = planOutcomeState == -2 and planOutcomeState[1] != -2;" "single invalidation edge"
Assert-Contains $text "def planInvalidCandidate = planWindowActive and planAge > 0 and !planStopHitCandidate and (planOppositeInvalid or planScoreInvalid);" "PSAR does not invalidate plan by itself"
Assert-True -Condition (-not $text.Contains("planPSARInvalid")) -Message "PSAR should be runner/context only in v0.6.0, not an invalidation trigger"
Assert-Contains $text 'AddChartBubble(showPlanBubbles and showInvalidationBubble and planInvalidated, invalidationBubblePrice, "R-INV", Color.GRAY, invalidationBubbleUp);' "one invalidation bubble"
Assert-Contains $text "plot PlanTP1LineV0600 =" "TP1 line"
Assert-Contains $text "plot PlanTP2LineV0600 =" "TP2 line"
Assert-Contains $text "plot PlanStopLineV0600 =" "stop line"

Assert-Contains $text 'AddLabel(yes, "BUILD: v0.6.0 CLEAN", Color.BLACK);' "build label"
Assert-Contains $text '"TREND: "' "trend dashboard"
Assert-Contains $text '"READY: "' "ready dashboard"
Assert-Contains $text '"ENTRY: "' "entry dashboard"
Assert-Contains $text '"RISK PTS: "' "risk dashboard"
Assert-Contains $text '"PSAR: "' "PSAR dashboard"

Assert-NoRegex $text "DBG|ScoreProbe|RawSetup|ReviewLongArrow|ReviewShortArrow|setupReadyLockedDir|reviewConflict|reviewPressure|debugForceArrows|debugPaintBigArrow|showDebugLabel" "v0.6.0 should not carry v0.5 diagnostic clutter"
Assert-NoRegex $text "NeutralUpArrow|NeutralDownArrow|ConfluenceUpArrow|ConfluenceDownArrow|continuationAnchor|failsafe|BuildProofDot" "v0.6.0 should not carry extra arrow families"

Assert-Before $text "def macroLongConfirmed =" "def entryLongSignal =" "macro confluence before entry signal"
Assert-Before $text "def planStopPrice =" "plot PlanStopLineV0600 =" "plan stop before stop line plot"
Assert-Before $text "else if planOutcomeState[1] >= 0 and planTP2RunnerCandidate then 3" "else if planOutcomeState[1] >= 0 and planOutcomeState[1] != 2 and planInvalidCandidate then -2" "TP2 runner should beat condition invalidation on same-bar conflicts"

Write-Host "Simplified indicator verification passed."
