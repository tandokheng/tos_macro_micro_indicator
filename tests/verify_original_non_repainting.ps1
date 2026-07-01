$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$studyPath = Join-Path $root "Original_Comparison_NonRepainting_v1.ts"
$readableStudyPath = Join-Path $root "Original_Comparison_NonRepainting_v1_READABLE.txt"

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
    Assert-True -Condition ($earlierIndex -lt $laterIndex) -Message "Invalid ordering: $Description"
}

Assert-True -Condition (Test-Path -LiteralPath $studyPath) -Message "Study file does not exist: $studyPath"
Assert-True -Condition (Test-Path -LiteralPath $readableStudyPath) -Message "Readable study copy does not exist: $readableStudyPath"

$text = Get-Content -LiteralPath $studyPath -Raw
$readableText = Get-Content -LiteralPath $readableStudyPath -Raw

Assert-Contains $text "# Version: original-nonrepaint-v1" "non-repaint version header"
Assert-Contains $text 'AddLabel(yes, "BUILD: ORIGINAL NR v1", Color.BLACK);' "build label"
Assert-True -Condition ($readableText -eq $text) -Message "Readable copy must match the non-repainting source exactly"

Assert-Contains $text "def useClosedSignals = yes;" "closed-signal guard"
Assert-Contains $text "def upConfirmedClosed = upConfirmed[1];" "macro long uses completed candle"
Assert-Contains $text "def downConfirmedClosed = downConfirmed[1];" "macro short uses completed candle"
Assert-Contains $text "def fireUp = if oncePerFlip then flipUp else upConfirmedClosed and arrowStrongVol[1] and buyPressure[1];" "macro up arrow uses completed candle inputs"
Assert-Contains $text "def fireDown = if oncePerFlip then flipDown else downConfirmedClosed and arrowStrongVol[1] and sellPressure[1];" "macro down arrow uses completed candle inputs"

Assert-Contains $text "def neutralTrendLongRaw =" "neutral long raw state"
Assert-Contains $text "def neutralTrendShortRaw =" "neutral short raw state"
Assert-Contains $text "def fireNeutralLong = neutralTrendLongRaw[1];" "neutral long confirmed signal"
Assert-Contains $text "def fireNeutralShort = neutralTrendShortRaw[1];" "neutral short confirmed signal"

Assert-Contains $text "def confLongSignal = confLongRaw[1];" "confluence long confirmed signal"
Assert-Contains $text "def confShortSignal = confShortRaw[1];" "confluence short confirmed signal"
Assert-Contains $text "plot ConfluenceUpArrow =" "confluence up plot"
Assert-Contains $text "if confLongSignal then low - off * 2 else Double.NaN" "confluence up plot uses confirmed signal"
Assert-Contains $text "if confShortSignal then high + off * 2 else Double.NaN" "confluence short plot uses confirmed signal"
Assert-NoRegex $text "plot ConfluenceUpArrow\s*=\s*[\r\n\s]*if confLongRaw" "Confluence up arrow must not plot raw current-bar condition"
Assert-NoRegex $text "plot ConfluenceDownArrow\s*=\s*[\r\n\s]*if confShortRaw" "Confluence down arrow must not plot raw current-bar condition"

Assert-Contains $text "def entryPrice = CompoundValue(" "entry price tracker"
Assert-Contains $text "if FireAnyLong then open" "entry price uses next-bar open for long signals"
Assert-Contains $text "else if FireAnyShort then open" "entry price uses next-bar open for short signals"
Assert-Contains $text "def momentumLongSignal = momentumLong[1];" "entry momentum long uses completed candle"
Assert-Contains $text "def trendRejectionLongSignal = trendRejectionLong[1];" "entry rejection long uses completed candle"
Assert-Contains $text "def momentumShortSignal = momentumShort[1];" "entry momentum short uses completed candle"
Assert-Contains $text "def trendRejectionShortSignal = trendRejectionShort[1];" "entry rejection short uses completed candle"

Assert-Contains $text "def tpCandidate = tpCandidateRaw[1];" "take-profit bubble uses completed candle"
Assert-Contains $text "def earlyTP_long_cond = earlyTP_long_raw[1];" "early long TP uses completed candle"
Assert-Contains $text "def earlyTP_short_cond = earlyTP_short_raw[1];" "early short TP uses completed candle"

Assert-Before $text "def upConfirmedClosed = upConfirmed[1];" "def state =" "confirmed macro values before state"
Assert-Before $text "def confLongSignal = confLongRaw[1];" "plot ConfluenceUpArrow =" "confirmed confluence before plot"

Write-Host "Original comparison non-repainting verification passed."
