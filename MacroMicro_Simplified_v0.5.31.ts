# ============================================================
# Macro Micro Simplified 5-of-6 Intraday Study
# Version: v0.5.31
# TOS Study: _dk_codex_macro_micro_v1
# Label: 5-of-6 intraday simplified
# Timeframe focus: 5m first, then 15m validation/tuning.
# Active build: v0.5.31 REAL CHOP.
# - Fresh working-style review arrows remain the default visible path.
# - Visual-only score-probe arrows are optional via showScoreProbeArrows and default off after v0.5.26 cleanup.
# - Setup-review arrows require directional follow-through instead of score-only 6/6 refreshes.
# - Final visible arrows are throttled separately from raw DBG REV counts.
# - Setup-review and real-entry review arrows both need local trend efficiency and score dominance to avoid chop clusters.
# - Low-volume momentum no longer bypasses the review-arrow chop filter.
# - DBG SET / DBG REV / DBG PROBE labels separate setup source, review gate, and probe cadence.
# - Review/probe visual booleans sanitize NaN states so debug counts and arrows do not disappear after recalculation.
# - Compact L/S marker bubbles are optional via showSignalBubbles and default off to keep arrows readable.
# - Real trade entries and PT/SL tracking still use realLongEntry / realShortEntry only.
# Full version history lives in VERSIONING.md.
# ============================================================

declare upper;

DefineGlobalColor("CautionAmber", CreateColor(180, 95, 0));

input price = close;

input emaFastLen = 8;
input emaSlowLen = 17;
input microFastLen = 5;
input microSlowLen = 13;
input lrcLength = 38;

input atrLength = 14;
input targetATRFactor = 1.5;
input stopATRFactor = 1.0;
input maxExtensionATR = 1.25;

input stATRLength = 10;
input stMultiplier = 3.0;
input adxLength = 14;
input chopADX = 14;

input useVWAPFilter = yes;
input volumeMALength = 50;
input minRelVolume = 0.80;
input blockRelVolume = 0.00;
input exceptionalMomentumATRFactor = 1.60;
input lowVolumeMomentumATRFactor = 1.20;
input fastBreakTRFactor = 1.35;
input fastBreakLookback = 3;
input biasFlipMinScore = 2;
input biasFlipRequiresVWAPBreak = yes;
input continuationBreakLookback = 2;
input continuationRangeFactor = 0.35;
input setupPulseBars = 5;
input rawSetupBubbleBars = 13;
input showReviewSignalArrows = yes;
input showSetupReviewArrows = yes;
input setupReviewRefreshBars = 21;
input reviewVisualMinBars = 8;
input reviewChopFilterEnabled = yes;
input reviewChopLookbackBars = 12;
input minReviewTrendEfficiency = 0.30;
input minReviewScoreSeparation = 2;
input reviewDebugLookbackBars = 200;
input showScoreProbeArrows = no;
input showRawProofBubbles = no;

input minSlopeTicks = 0.25;
input offsetTicks = 8;
input cooldownBars = 5;
input scoreTriggerFreshBars = 3;
input resetSameSideAfterBars = 30;
input useFifteenMinuteProfile = no;
input fifteenMinuteScoreTriggerFreshBars = 1;
input fifteenMinuteResetSameSideAfterBars = 10;
input dangerScoreThreshold = 3;
input dangerDropFromPeak = 2;
input allowCautionFourOfSix = yes;

input showStandbyDots = yes;
input showTargetStopLines = yes;
input showSignalBubbles = no;
input showContinuationAnchorArrows = no;
input showFailsafeSignalBubbles = no;
input showContinuationBubbles = yes;
input showDangerBubbles = yes;
input showTargetStopBubbles = yes;
input showDashboard = yes;
input showDebugLabel = yes;
input debugForceArrows = no;
input debugPaintBigArrow = no;

input muteAllAlerts = no;
input alertSoundUp = Sound.Bell;
input alertSoundDown = Sound.Bell;
input alertSoundExit = Sound.Ding;

def tick = TickSize();
def off = offsetTicks * tick;
def minSlope = minSlopeTicks * tick;
def standbyThreshold = 4;
def triggerThreshold = 5;
def activeScoreTriggerFreshBars = if useFifteenMinuteProfile then fifteenMinuteScoreTriggerFreshBars else scoreTriggerFreshBars;
def activeResetSameSideAfterBars = if useFifteenMinuteProfile then fifteenMinuteResetSameSideAfterBars else resetSameSideAfterBars;
def lastVisibleBar = BarNumber() == HighestAll(if !IsNaN(close) then BarNumber() else 0);

# ---------------- Utility ----------------
script BarsSinceTrue {
    input condition = no;
    def count = if condition then 0 else if IsNaN(count[1]) then 10000 else count[1] + 1;
    plot barsSince = count;
}

# ---------------- Core Trend Inputs ----------------
def emaFast = ExpAverage(price, emaFastLen);
def emaSlow = ExpAverage(price, emaSlowLen);
def dFast = emaFast - emaFast[1];
def dSlow = emaSlow - emaSlow[1];

plot EMA8 = emaFast;
plot EMA17 = emaSlow;
EMA8.Hide();
EMA17.Hide();

def lrcLine = Inertia(price, lrcLength);
def lrcSlope = lrcLine - lrcLine[1];

def vwapLine = reference VWAP("time frame" = "DAY");
def psar = ParabolicSAR(0.02, 0.20);

# ---------------- Supertrend ----------------
def newSession = GetDay() <> GetDay()[1];
def atrST = Average(TrueRange(high, close, low), stATRLength);
def basicUpper = (high + low) / 2 + stMultiplier * atrST;
def basicLower = (high + low) / 2 - stMultiplier * atrST;

def finalUpper =
    if newSession or IsNaN(finalUpper[1]) or basicUpper < finalUpper[1] or close[1] > finalUpper[1]
    then basicUpper
    else finalUpper[1];

def finalLower =
    if newSession or IsNaN(finalLower[1]) or basicLower > finalLower[1] or close[1] < finalLower[1]
    then basicLower
    else finalLower[1];

def supertrend =
    if newSession or IsNaN(supertrend[1]) then (high + low) / 2
    else if close > finalUpper[1] then finalLower
    else if close < finalLower[1] then finalUpper
    else if supertrend[1] == finalUpper[1] and close <= finalUpper then finalUpper
    else if supertrend[1] == finalUpper[1] and close > finalUpper then finalLower
    else if supertrend[1] == finalLower[1] and close >= finalLower then finalLower
    else finalUpper;

# ---------------- Micro + Volume ----------------
def microFast = ExpAverage(close, microFastLen);
def microSlow = ExpAverage(close, microSlowLen);
def microCrossUp = microFast crosses above microSlow;
def microCrossDown = microFast crosses below microSlow;

def avgVol = Average(volume, volumeMALength);
def relVol = if avgVol > 0 then volume / avgVol else 0;
def volPower = (close - open) * volume;
def volBias = Average(volPower, 5);
def buyPressure = volBias > 0;
def sellPressure = volBias < 0;

def atr = Average(TrueRange(high, close, low), atrLength);
def adx = ADX(adxLength);

# ---------------- 6-Point Setup Score ----------------
def emaLongOK = emaFast > emaSlow and dFast > minSlope and dSlow >= -minSlope;
def emaShortOK = emaFast < emaSlow and dFast < -minSlope and dSlow <= minSlope;

def lrcLongOK = lrcSlope > minSlope;
def lrcShortOK = lrcSlope < -minSlope;

def superLongOK = close > supertrend;
def superShortOK = close < supertrend;

def psarLongOK = close > psar;
def psarShortOK = close < psar;

def vwapLongOK = if useVWAPFilter then close > vwapLine else yes;
def vwapShortOK = if useVWAPFilter then close < vwapLine else yes;

def microLongOK = microFast > microSlow;
def microShortOK = microFast < microSlow;

def longScore =
    (if emaLongOK then 1 else 0) +
    (if lrcLongOK then 1 else 0) +
    (if superLongOK then 1 else 0) +
    (if psarLongOK then 1 else 0) +
    (if vwapLongOK then 1 else 0) +
    (if microLongOK then 1 else 0);

def shortScore =
    (if emaShortOK then 1 else 0) +
    (if lrcShortOK then 1 else 0) +
    (if superShortOK then 1 else 0) +
    (if psarShortOK then 1 else 0) +
    (if vwapShortOK then 1 else 0) +
    (if microShortOK then 1 else 0);

def maxScore = Max(longScore, shortScore);
def longBias = longScore > shortScore and longScore >= standbyThreshold;
def shortBias = shortScore > longScore and shortScore >= standbyThreshold;

# ---------------- Candle Confirmation + Trigger Conditions ----------------
def candleTR = TrueRange(high, close, low);
def avgTR20 = Average(candleTR, 20);
def candleBody = AbsValue(close - open);
def candleBodyShare = if candleTR > 0 then candleBody / candleTR else 0;
def decisiveBody = candleBodyShare >= 0.45;
def healthyRange = candleTR >= avgTR20 * 0.80;
def bigCandle = candleTR > avgTR20 * 1.2;
def strongCloseLong = close >= high - candleTR * 0.30;
def strongCloseShort = close <= low + candleTR * 0.30;

def longCandleConfirm =
    close > open and
    close > close[1] and
    close > (high + low) / 2 and
    strongCloseLong and
    decisiveBody and
    healthyRange;

def shortCandleConfirm =
    close < open and
    close < close[1] and
    close < (high + low) / 2 and
    strongCloseShort and
    decisiveBody and
    healthyRange;

def momentumLong = bigCandle and longCandleConfirm;
def momentumShort = bigCandle and shortCandleConfirm;

def entryRangeOK = candleTR >= avgTR20 * 0.55;
def directionalLongConfirm =
    close > open and
    close > close[1] and
    close > emaFast and
    close >= high - candleTR * 0.40 and
    entryRangeOK;

def directionalShortConfirm =
    close < open and
    close < close[1] and
    close < emaFast and
    close <= low + candleTR * 0.40 and
    entryRangeOK;

def longBreakConfirm = directionalLongConfirm and (close > high[1] or close > emaSlow);
def shortBreakConfirm = directionalShortConfirm and (close < low[1] or close < emaSlow);
def fastBreakVolumeOK = relVol >= minRelVolume or candleTR >= avgTR20 * lowVolumeMomentumATRFactor;
def fastBreakoutConfirm =
    candleTR >= avgTR20 * fastBreakTRFactor and
    close > close[1] and
    close > emaFast and
    close >= high - candleTR * 0.45 and
    close > Highest(high[1], fastBreakLookback) and
    fastBreakVolumeOK;
def fastBreakdownConfirm =
    candleTR >= avgTR20 * fastBreakTRFactor and
    close < close[1] and
    close < emaFast and
    close <= low + candleTR * 0.45 and
    close < Lowest(low[1], fastBreakLookback) and
    fastBreakVolumeOK;
def longEntryConfirm = longCandleConfirm or longBreakConfirm or fastBreakoutConfirm;
def shortEntryConfirm = shortCandleConfirm or shortBreakConfirm or fastBreakdownConfirm;

def trendRejectionLong = low <= emaFast and close > emaFast and longEntryConfirm;
def trendRejectionShort = high >= emaFast and close < emaFast and shortEntryConfirm;

def longScoreCrossEvent = longScore >= triggerThreshold and longScore[1] < triggerThreshold;
def shortScoreCrossEvent = shortScore >= triggerThreshold and shortScore[1] < triggerThreshold;
def longScoreFresh = BarsSinceTrue(longScoreCrossEvent) <= activeScoreTriggerFreshBars;
def shortScoreFresh = BarsSinceTrue(shortScoreCrossEvent) <= activeScoreTriggerFreshBars;
def longScoreCrossTrigger = longScoreFresh and longEntryConfirm;
def shortScoreCrossTrigger = shortScoreFresh and shortEntryConfirm;
def sustainedLongTrigger = longScore >= triggerThreshold and longScore > shortScore and longEntryConfirm;
def sustainedShortTrigger = shortScore >= triggerThreshold and shortScore > longScore and shortEntryConfirm;

def longTrigger = sustainedLongTrigger or longScoreCrossTrigger or (microCrossUp and longEntryConfirm) or momentumLong or trendRejectionLong;
def shortTrigger = sustainedShortTrigger or shortScoreCrossTrigger or (microCrossDown and shortEntryConfirm) or momentumShort or trendRejectionShort;

def exceptionalLongMomentum =
    longScore == 6 and
    candleTR > avgTR20 * exceptionalMomentumATRFactor and
    close > high[1] and
    longCandleConfirm and
    buyPressure;

def exceptionalShortMomentum =
    shortScore == 6 and
    candleTR > avgTR20 * exceptionalMomentumATRFactor and
    close < low[1] and
    shortCandleConfirm and
    sellPressure;

def lowVolumeLongMomentum =
    longScore >= triggerThreshold and
    longScore > shortScore and
    candleTR >= avgTR20 * lowVolumeMomentumATRFactor and
    close > close[1] and
    close > emaFast and
    close >= high - candleTR * 0.50;

def lowVolumeShortMomentum =
    shortScore >= triggerThreshold and
    shortScore > longScore and
    candleTR >= avgTR20 * lowVolumeMomentumATRFactor and
    close < close[1] and
    close < emaFast and
    close <= low + candleTR * 0.50;

# ---------------- Trade State ----------------
def mixedBias = longScore >= standbyThreshold and shortScore >= standbyThreshold;
def extensionATR = if atr > 0 then AbsValue(close - emaFast) / atr else 0;
def extended = extensionATR > maxExtensionATR;
def lowVolume = relVol < minRelVolume;
def extremeLowRelVolume = relVol < blockRelVolume;
def chop = adx < chopADX and maxScore < triggerThreshold;

def structureBlocked = mixedBias or chop;
def longVolumeOK = yes;
def shortVolumeOK = yes;
def tradeBlocked = structureBlocked;
def longTradeOK = !structureBlocked and longVolumeOK;
def shortTradeOK = !structureBlocked and shortVolumeOK;
def longTradeCaution = longTradeOK and (extended or lowVolume or adx < chopADX or (extremeLowRelVolume and exceptionalLongMomentum));
def shortTradeCaution = shortTradeOK and (extended or lowVolume or adx < chopADX or (extremeLowRelVolume and exceptionalShortMomentum));
def tradeCaution = !tradeBlocked and (
    (longBias and longTradeCaution) or
    (shortBias and shortTradeCaution) or
    (!longBias and !shortBias and (extended or lowVolume or adx < chopADX))
);
def tradeOK = !tradeBlocked and !tradeCaution;

def fastFlipShortSetup =
    shortTradeOK and
    fastBreakdownConfirm and
    close < emaSlow and
    shortScore >= biasFlipMinScore and
    shortScore >= shortScore[1] and
    longScore >= standbyThreshold and
    longBias and
    (if biasFlipRequiresVWAPBreak then close < vwapLine else yes);

def fastFlipLongSetup =
    longTradeOK and
    fastBreakoutConfirm and
    close > emaSlow and
    longScore >= biasFlipMinScore and
    longScore >= longScore[1] and
    shortScore >= standbyThreshold and
    shortBias and
    (if biasFlipRequiresVWAPBreak then close > vwapLine else yes);

def shortContinuationPressure =
    shortTradeOK and
    shortBias and
    shortScore >= standbyThreshold and
    shortScore > longScore and
    close < close[1] and
    close < emaFast and
    close < emaSlow and
    close < vwapLine and
    (close < open or close < low[1]) and
    (close < Lowest(low[1], continuationBreakLookback) or low <= Lowest(low[1], continuationBreakLookback)) and
    candleTR >= avgTR20 * continuationRangeFactor;

def longContinuationPressure =
    longTradeOK and
    longBias and
    longScore >= standbyThreshold and
    longScore > shortScore and
    close > close[1] and
    close > emaFast and
    close > emaSlow and
    close > vwapLine and
    (close > open or close > high[1]) and
    (close > Highest(high[1], continuationBreakLookback) or high >= Highest(high[1], continuationBreakLookback)) and
    candleTR >= avgTR20 * continuationRangeFactor;

def longSetup = longScore >= triggerThreshold and longScore > shortScore and longTradeOK;
def shortSetup = shortScore >= triggerThreshold and shortScore > longScore and shortTradeOK;
def longCautionSetup = allowCautionFourOfSix and longScore == standbyThreshold and longScore > shortScore and longTradeOK and (longEntryConfirm or longContinuationPressure);
def shortCautionSetup = allowCautionFourOfSix and shortScore == standbyThreshold and shortScore > longScore and shortTradeOK and (shortEntryConfirm or shortContinuationPressure);
def longQualifiedSetup = longSetup or longCautionSetup;
def shortQualifiedSetup = shortSetup or shortCautionSetup;

def rawLongEntry = (longSetup and longTrigger) or longCautionSetup;
def rawShortEntry = (shortSetup and shortTrigger) or shortCautionSetup;
def longReadyEntry = longQualifiedSetup and longEntryConfirm;
def shortReadyEntry = shortQualifiedSetup and shortEntryConfirm;
def longEntryEdge = rawLongEntry and !rawLongEntry[1];
def shortEntryEdge = rawShortEntry and !rawShortEntry[1];
def longReadyEdge = longReadyEntry and !longReadyEntry[1];
def shortReadyEdge = shortReadyEntry and !shortReadyEntry[1];
def longEntryCandidate = rawLongEntry or longReadyEntry;
def shortEntryCandidate = rawShortEntry or shortReadyEntry;

def entryState =
    CompoundValue(
        1,
        if longEntryCandidate and (entryState[1] == 0 or AbsValue(entryState[1]) > cooldownBars) and (entryState[1] <= 0 or entryState[1] > activeResetSameSideAfterBars) then 1
        else if shortEntryCandidate and (entryState[1] == 0 or AbsValue(entryState[1]) > cooldownBars) and (entryState[1] >= 0 or AbsValue(entryState[1]) > activeResetSameSideAfterBars) then -1
        else if entryState[1] > 0 and (shortBias or longScore < triggerThreshold) then 0
        else if entryState[1] < 0 and (longBias or shortScore < triggerThreshold) then 0
        else if entryState[1] > 0 then entryState[1] + 1
        else if entryState[1] < 0 then entryState[1] - 1
        else 0,
        0
    );

def barsSincePlottedEntry = if entryState == 0 then cooldownBars + 1 else AbsValue(entryState);
def cooldownOK = entryState == 0 or AbsValue(entryState) > cooldownBars;
def cooldownJustCleared = !cooldownOK[1] and cooldownOK;
def longTradeJustUnblocked = longTradeOK and !longTradeOK[1];
def shortTradeJustUnblocked = shortTradeOK and !shortTradeOK[1];

def lastEntryDir = if entryState > 0 then 1 else if entryState < 0 then -1 else 0;
def trendResetLong = entryState[1] > 0 and (shortBias or longScore < triggerThreshold);
def trendResetShort = entryState[1] < 0 and (longBias or shortScore < triggerThreshold);
def sameSideLongExpired = entryState[1] > activeResetSameSideAfterBars and !trendResetLong;
def sameSideShortExpired = entryState[1] < -activeResetSameSideAfterBars and !trendResetShort;

def newLongEntry = entryState == 1 and entryState[1] != 1;
def newShortEntry = entryState == -1 and entryState[1] != -1;

def longSetupPulseReady =
    longTradeOK and
    longScore >= triggerThreshold and
    longScore > shortScore;

def shortSetupPulseReady =
    shortTradeOK and
    shortScore >= triggerThreshold and
    shortScore > longScore;

def setupPulseState =
    CompoundValue(
        1,
        if longSetupPulseReady and (setupPulseState[1] <= 0 or setupPulseState[1] >= setupPulseBars) then 1
        else if shortSetupPulseReady and (setupPulseState[1] >= 0 or AbsValue(setupPulseState[1]) >= setupPulseBars) then -1
        else if longSetupPulseReady and setupPulseState[1] > 0 then setupPulseState[1] + 1
        else if shortSetupPulseReady and setupPulseState[1] < 0 then setupPulseState[1] - 1
        else 0,
        0
    );

def setupPulseLongArrow = longSetupPulseReady and (setupPulseState[1] <= 0 or setupPulseState[1] >= setupPulseBars);
def setupPulseShortArrow = shortSetupPulseReady and (setupPulseState[1] >= 0 or AbsValue(setupPulseState[1]) >= setupPulseBars);
def setupCadenceBars = Max(1, setupPulseBars);
def setupCadenceSlot =
    BarNumber() - Floor(BarNumber() / setupCadenceBars) * setupCadenceBars == 0;
def rawSetupLongMarker = longSetupPulseReady and (!longSetupPulseReady[1] or setupCadenceSlot or lastVisibleBar);
def rawSetupShortMarker = shortSetupPulseReady and (!shortSetupPulseReady[1] or setupCadenceSlot or lastVisibleBar);
def rawSetupBubbleCadenceBars = Max(1, rawSetupBubbleBars);
def rawSetupBubbleCadenceSlot =
    BarNumber() - Floor(BarNumber() / rawSetupBubbleCadenceBars) * rawSetupBubbleCadenceBars == 0;
def rawSetupBubbleLong = longSetupPulseReady and (!longSetupPulseReady[1] or rawSetupBubbleCadenceSlot or lastVisibleBar);
def rawSetupBubbleShort = shortSetupPulseReady and (!shortSetupPulseReady[1] or rawSetupBubbleCadenceSlot or lastVisibleBar);

def practicalLongSetup =
    longTradeOK and
    longScore >= triggerThreshold and
    longScore > shortScore and
    (longEntryConfirm or lowVolumeLongMomentum or (close > emaFast and close > close[1]));

def practicalShortSetup =
    shortTradeOK and
    shortScore >= triggerThreshold and
    shortScore > longScore and
    (shortEntryConfirm or lowVolumeShortMomentum or (close < emaFast and close < close[1]));

def practicalLongCautionSetup =
    allowCautionFourOfSix and
    longTradeOK and
    longScore == standbyThreshold and
    longScore > shortScore and
    (longEntryConfirm or lowVolumeLongMomentum or longContinuationPressure);

def practicalShortCautionSetup =
    allowCautionFourOfSix and
    shortTradeOK and
    shortScore == standbyThreshold and
    shortScore > longScore and
    (shortEntryConfirm or lowVolumeShortMomentum or shortContinuationPressure);

def practicalLongCandidate = practicalLongSetup or practicalLongCautionSetup;
def practicalShortCandidate = practicalShortSetup or practicalShortCautionSetup;
def practicalLongArrow = practicalLongCandidate and !practicalLongCandidate[1];
def practicalShortArrow = practicalShortCandidate and !practicalShortCandidate[1];
def fastFlipLongArrow = fastFlipLongSetup and !fastFlipLongSetup[1] and (cooldownOK or lastEntryDir[1] == -1);
def fastFlipShortArrow = fastFlipShortSetup and !fastFlipShortSetup[1] and (cooldownOK or lastEntryDir[1] == 1);
def longContinuationArrow = longContinuationPressure and !longContinuationPressure[1] and (cooldownOK or lastEntryDir[1] != 1);
def shortContinuationArrow = shortContinuationPressure and !shortContinuationPressure[1] and (cooldownOK or lastEntryDir[1] != -1);
def continuationAnchorLongArrow = showContinuationAnchorArrows and longContinuationPressure and longScore >= triggerThreshold;
def continuationAnchorShortArrow = showContinuationAnchorArrows and shortContinuationPressure and shortScore >= triggerThreshold;
def realLongEntry = newLongEntry or practicalLongArrow or fastFlipLongArrow or longContinuationArrow;
def realShortEntry = newShortEntry or practicalShortArrow or fastFlipShortArrow or shortContinuationArrow;
def setupReviewLongEdge =
    longSetupPulseReady and
    (longScoreCrossEvent or !longSetupPulseReady[1] or (longScore >= 6 and longScore[1] < 6));
def setupReviewShortEdge =
    shortSetupPulseReady and
    (shortScoreCrossEvent or !shortSetupPulseReady[1] or (shortScore >= 6 and shortScore[1] < 6));
def setupReviewCadenceBars = Max(1, setupReviewRefreshBars);
def setupReviewCadenceSlot =
    BarNumber() - Floor(BarNumber() / setupReviewCadenceBars) * setupReviewCadenceBars == 0;
def setupReviewLongDirectional = close > emaFast and close > close[1] and dFast >= 0;
def setupReviewShortDirectional = close < emaFast and close < close[1] and dFast <= 0;
def reviewChopLookback = Max(2, reviewChopLookbackBars);
def reviewTrendTravel = AbsValue(close - close[reviewChopLookback]);
def reviewTrendRange = Sum(candleTR, reviewChopLookback);
def reviewTrendEfficiency = if reviewTrendRange > 0 then reviewTrendTravel / reviewTrendRange else 0;
def reviewEfficientMove = reviewTrendEfficiency >= minReviewTrendEfficiency;
def reviewLongScoreDominant = longScore >= triggerThreshold and longScore - shortScore >= minReviewScoreSeparation;
def reviewShortScoreDominant = shortScore >= triggerThreshold and shortScore - longScore >= minReviewScoreSeparation;
def reviewLongRegimeOK =
    !reviewChopFilterEnabled or
    fastBreakoutConfirm or
    longContinuationPressure or
    (reviewEfficientMove and reviewLongScoreDominant and close > emaSlow);
def reviewShortRegimeOK =
    !reviewChopFilterEnabled or
    fastBreakdownConfirm or
    shortContinuationPressure or
    (reviewEfficientMove and reviewShortScoreDominant and close < emaSlow);
def setupReviewLongQualityRaw = longEntryConfirm or lowVolumeLongMomentum or longContinuationPressure or (longScore >= 6 and setupReviewLongDirectional);
def setupReviewShortQualityRaw = shortEntryConfirm or lowVolumeShortMomentum or shortContinuationPressure or (shortScore >= 6 and setupReviewShortDirectional);
def setupReviewLongQuality = setupReviewLongQualityRaw and reviewLongRegimeOK;
def setupReviewShortQuality = setupReviewShortQualityRaw and reviewShortRegimeOK;
def reviewChopBlockedLongSetup = setupReviewLongQualityRaw and !reviewLongRegimeOK;
def reviewChopBlockedShortSetup = setupReviewShortQualityRaw and !reviewShortRegimeOK;
def setupReviewLongEdgeQualified = setupReviewLongEdge and setupReviewLongQuality;
def setupReviewShortEdgeQualified = setupReviewShortEdge and setupReviewShortQuality;
def setupReviewLongRefresh = longSetupPulseReady and setupReviewCadenceSlot and setupReviewLongQuality;
def setupReviewShortRefresh = shortSetupPulseReady and setupReviewCadenceSlot and setupReviewShortQuality;
def scoreProbeLongReady = longSetupPulseReady and setupReviewCadenceSlot;
def scoreProbeShortReady = shortSetupPulseReady and setupReviewCadenceSlot;
def scoreProbeLongSignal = showScoreProbeArrows and scoreProbeLongReady;
def scoreProbeShortSignal = showScoreProbeArrows and scoreProbeShortReady;
def realLongEntryReviewFlagRaw = if realLongEntry then 1 else 0;
def realShortEntryReviewFlagRaw = if realShortEntry then 1 else 0;
def realLongEntryReviewFlag = if IsNaN(realLongEntryReviewFlagRaw) then 0 else realLongEntryReviewFlagRaw;
def realShortEntryReviewFlag = if IsNaN(realShortEntryReviewFlagRaw) then 0 else realShortEntryReviewFlagRaw;
def realLongEntryForReviewRaw = realLongEntryReviewFlag == 1;
def realShortEntryForReviewRaw = realShortEntryReviewFlag == 1;
def reviewChopBlockedLongReal = realLongEntryForReviewRaw and !reviewLongRegimeOK;
def reviewChopBlockedShortReal = realShortEntryForReviewRaw and !reviewShortRegimeOK;
def realLongEntryForReview = realLongEntryForReviewRaw and reviewLongRegimeOK;
def realShortEntryForReview = realShortEntryForReviewRaw and reviewShortRegimeOK;
def reviewChopBlockedLong = reviewChopBlockedLongSetup or reviewChopBlockedLongReal;
def reviewChopBlockedShort = reviewChopBlockedShortSetup or reviewChopBlockedShortReal;
def reviewLongSetupSignalRaw = showSetupReviewArrows and (setupReviewLongEdgeQualified or setupReviewLongRefresh);
def reviewShortSetupSignalRaw = showSetupReviewArrows and (setupReviewShortEdgeQualified or setupReviewShortRefresh);
def reviewLongSetupSignalFlagRaw = if reviewLongSetupSignalRaw then 1 else 0;
def reviewShortSetupSignalFlagRaw = if reviewShortSetupSignalRaw then 1 else 0;
def reviewLongSetupSignalFlag = if IsNaN(reviewLongSetupSignalFlagRaw) then 0 else reviewLongSetupSignalFlagRaw;
def reviewShortSetupSignalFlag = if IsNaN(reviewShortSetupSignalFlagRaw) then 0 else reviewShortSetupSignalFlagRaw;
def reviewLongSetupSignal = reviewLongSetupSignalFlag == 1;
def reviewShortSetupSignal = reviewShortSetupSignalFlag == 1;
def visualLongSetupReady = reviewLongSetupSignal;
def visualShortSetupReady = reviewShortSetupSignal;
def reviewLongSignal = realLongEntryForReview or reviewLongSetupSignal;
def reviewShortSignal = realShortEntryForReview or reviewShortSetupSignal;
def reviewVisualSpacingBars = Max(1, reviewVisualMinBars);
def reviewVisualState =
    CompoundValue(
        1,
        if reviewLongSignal and (reviewVisualState[1] == 0 or AbsValue(reviewVisualState[1]) >= reviewVisualSpacingBars) then 1
        else if reviewShortSignal and (reviewVisualState[1] == 0 or AbsValue(reviewVisualState[1]) >= reviewVisualSpacingBars) then -1
        else if reviewVisualState[1] > 0 then reviewVisualState[1] + 1
        else if reviewVisualState[1] < 0 then reviewVisualState[1] - 1
        else 0,
        0
    );
def reviewVisualReady = reviewVisualState[1] == 0 or AbsValue(reviewVisualState[1]) >= reviewVisualSpacingBars;
def visibleLongSignal = reviewLongSignal and reviewVisualState == 1 and reviewVisualState[1] != 1;
def visibleShortSignal = reviewShortSignal and reviewVisualState == -1 and reviewVisualState[1] != -1;
def setupLongRecentCount = Sum(if longSetupPulseReady then 1 else 0, reviewDebugLookbackBars);
def setupShortRecentCount = Sum(if shortSetupPulseReady then 1 else 0, reviewDebugLookbackBars);
def reviewLongRecentCount = Sum(if reviewLongSignal then 1 else 0, reviewDebugLookbackBars);
def reviewShortRecentCount = Sum(if reviewShortSignal then 1 else 0, reviewDebugLookbackBars);
def visibleLongRecentCount = Sum(if visibleLongSignal then 1 else 0, reviewDebugLookbackBars);
def visibleShortRecentCount = Sum(if visibleShortSignal then 1 else 0, reviewDebugLookbackBars);
def reviewChopBlockedLongRecentCount = Sum(if reviewChopBlockedLong then 1 else 0, reviewDebugLookbackBars);
def reviewChopBlockedShortRecentCount = Sum(if reviewChopBlockedShort then 1 else 0, reviewDebugLookbackBars);
def scoreProbeLongRecentCount = Sum(if scoreProbeLongReady then 1 else 0, reviewDebugLookbackBars);
def scoreProbeShortRecentCount = Sum(if scoreProbeShortReady then 1 else 0, reviewDebugLookbackBars);
def reviewLongAnyLoaded = HighestAll(if reviewLongSignal then 1 else 0);
def reviewShortAnyLoaded = HighestAll(if reviewShortSignal then 1 else 0);
def arrowMarkerLong = visibleLongSignal;
def arrowMarkerShort = visibleShortSignal;
def dashboardContLong = longContinuationArrow;
def dashboardContShort = shortContinuationArrow;
def dashboardTriggerLong = visibleLongSignal;
def dashboardTriggerShort = visibleShortSignal;
def markerRequiredLong = dashboardTriggerLong;
def markerRequiredShort = dashboardTriggerShort;
def markerContractFail =
    (markerRequiredLong and !arrowMarkerLong) or
    (markerRequiredShort and !arrowMarkerShort);

def longEntryPulse =
    longEntryCandidate and
    (longEntryEdge or longReadyEdge or cooldownJustCleared or longTradeJustUnblocked or sameSideLongExpired);
def shortEntryPulse =
    shortEntryCandidate and
    (shortEntryEdge or shortReadyEdge or cooldownJustCleared or shortTradeJustUnblocked or sameSideShortExpired);
def longSignalCaution = longScore < triggerThreshold or longTradeCaution or fastFlipLongArrow or longContinuationArrow or reviewLongSetupSignal;
def shortSignalCaution = shortScore < triggerThreshold or shortTradeCaution or fastFlipShortArrow or shortContinuationArrow or reviewShortSetupSignal;
def continuationLongSignal = longEntryPulse and cooldownOK and lastEntryDir[1] == 1 and !sameSideLongExpired and !trendResetLong;
def continuationShortSignal = shortEntryPulse and cooldownOK and lastEntryDir[1] == -1 and !sameSideShortExpired and !trendResetShort;

# ---------------- Trade Tracking + PTarget / SLoss ----------------
def activeEntryPrice =
    CompoundValue(
        1,
        if realLongEntry or realShortEntry then close else activeEntryPrice[1],
        close
    );

def lockedATR =
    CompoundValue(
        1,
        if realLongEntry or realShortEntry then atr else lockedATR[1],
        atr
    );

def longProfitMove = close - activeEntryPrice;
def shortProfitMove = activeEntryPrice - close;

def longTargetPrice = activeEntryPrice + lockedATR * targetATRFactor;
def shortTargetPrice = activeEntryPrice - lockedATR * targetATRFactor;
def longStopPrice = activeEntryPrice - lockedATR * stopATRFactor;
def shortStopPrice = activeEntryPrice + lockedATR * stopATRFactor;

def activeDir =
    CompoundValue(
        1,
        if realLongEntry then 1
        else if realShortEntry then -1
        else if activeDir[1] == 1 and (high >= longTargetPrice[1] or low <= longStopPrice[1] or shortScore >= triggerThreshold) then 0
        else if activeDir[1] == -1 and (low <= shortTargetPrice[1] or high >= shortStopPrice[1] or longScore >= triggerThreshold) then 0
        else activeDir[1],
        0
    );

def targetHit =
    (activeDir[1] == 1 and high >= longTargetPrice[1]) or
    (activeDir[1] == -1 and low <= shortTargetPrice[1]);

def stopHit =
    (activeDir[1] == 1 and low <= longStopPrice[1]) or
    (activeDir[1] == -1 and high >= shortStopPrice[1]);

def oppositeInvalidation =
    (activeDir[1] == 1 and shortScore >= triggerThreshold) or
    (activeDir[1] == -1 and longScore >= triggerThreshold);

def activeTradeScore =
    if activeDir == 1 then longScore
    else if activeDir == -1 then shortScore
    else 0;

def peakTradeScore =
    CompoundValue(
        1,
        if realLongEntry or realShortEntry then activeTradeScore
        else if activeDir != 0 then Max(peakTradeScore[1], activeTradeScore)
        else 0,
        0
    );

def longDanger =
    activeDir[1] == 1 and
    peakTradeScore[1] >= triggerThreshold and
    longScore <= dangerScoreThreshold and
    peakTradeScore[1] - longScore >= dangerDropFromPeak;

def shortDanger =
    activeDir[1] == -1 and
    peakTradeScore[1] >= triggerThreshold and
    shortScore <= dangerScoreThreshold and
    peakTradeScore[1] - shortScore >= dangerDropFromPeak;

def longDangerEdge = longDanger and !longDanger[1];
def shortDangerEdge = shortDanger and !shortDanger[1];

# ---------------- Standby Dots + Primary Arrows ----------------
def longStandby = longBias and !longTrigger and longTradeOK and activeDir != 1;
def shortStandby = shortBias and !shortTrigger and shortTradeOK and activeDir != -1;
def debugForcedLongArrow = debugForceArrows and longScore >= triggerThreshold and longScore > shortScore;
def debugForcedShortArrow = debugForceArrows and shortScore >= triggerThreshold and shortScore > longScore;
def arrowOff = Max(off, atr * 0.12);
def signalArrowOff = Max(off * 8, atr * 0.30);
def liveArrowOff = Max(off * 18, atr * 0.50);
def compactMarkerOff = off * 1.4;
def bigArrowOff = Max(off * 50, atr * 1.20);

plot DebugBigArrow =
    if (debugPaintBigArrow and lastVisibleBar) or (debugForceArrows and debugForcedShortArrow) then high + bigArrowOff
    else Double.NaN;
DebugBigArrow.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
DebugBigArrow.SetLineWeight(5);
DebugBigArrow.SetDefaultColor(Color.CYAN);

plot DebugBigUpArrow =
    if debugForceArrows and debugForcedLongArrow then low - bigArrowOff
    else Double.NaN;
DebugBigUpArrow.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
DebugBigUpArrow.SetLineWeight(5);
DebugBigUpArrow.SetDefaultColor(Color.MAGENTA);

plot ReviewLongArrowV0531 =
    if showReviewSignalArrows and visibleLongSignal then low - off else Double.NaN;
plot ReviewShortArrowV0531 =
    if showReviewSignalArrows and visibleShortSignal then high + off else Double.NaN;
ReviewLongArrowV0531.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
ReviewShortArrowV0531.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
ReviewLongArrowV0531.AssignValueColor(Color.MAGENTA);
ReviewShortArrowV0531.AssignValueColor(Color.CYAN);
ReviewLongArrowV0531.SetLineWeight(5);
ReviewShortArrowV0531.SetLineWeight(5);

plot ScoreProbeLongArrowV0531 =
    if scoreProbeLongSignal and !reviewLongSignal then low - off * 2 else Double.NaN;
plot ScoreProbeShortArrowV0531 =
    if scoreProbeShortSignal and !reviewShortSignal then high + off * 2 else Double.NaN;
ScoreProbeLongArrowV0531.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
ScoreProbeShortArrowV0531.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
ScoreProbeLongArrowV0531.AssignValueColor(Color.GREEN);
ScoreProbeShortArrowV0531.AssignValueColor(Color.RED);
ScoreProbeLongArrowV0531.SetLineWeight(3);
ScoreProbeShortArrowV0531.SetLineWeight(3);

plot MarkerLongDotV0513 =
    if arrowMarkerLong then low - compactMarkerOff else Double.NaN;
MarkerLongDotV0513.SetPaintingStrategy(PaintingStrategy.POINTS);
MarkerLongDotV0513.SetLineWeight(5);
MarkerLongDotV0513.SetDefaultColor(Color.MAGENTA);

plot MarkerShortDotV0513 =
    if arrowMarkerShort then high + compactMarkerOff else Double.NaN;
MarkerShortDotV0513.SetPaintingStrategy(PaintingStrategy.POINTS);
MarkerShortDotV0513.SetLineWeight(5);
MarkerShortDotV0513.SetDefaultColor(Color.CYAN);

plot BuildProofDotV0513 =
    if lastVisibleBar then high + liveArrowOff else Double.NaN;
BuildProofDotV0513.SetPaintingStrategy(PaintingStrategy.POINTS);
BuildProofDotV0513.SetLineWeight(5);
BuildProofDotV0513.SetDefaultColor(Color.CYAN);

plot StandbyLongDot =
    if showStandbyDots and longStandby then low - off * 0.6 else Double.NaN;
StandbyLongDot.SetPaintingStrategy(PaintingStrategy.POINTS);
StandbyLongDot.SetLineWeight(3);
StandbyLongDot.SetDefaultColor(CreateColor(0, 160, 0));

plot StandbyShortDot =
    if showStandbyDots and shortStandby then high + off * 0.6 else Double.NaN;
StandbyShortDot.SetPaintingStrategy(PaintingStrategy.POINTS);
StandbyShortDot.SetLineWeight(3);
StandbyShortDot.SetDefaultColor(CreateColor(190, 0, 0));

# ---------------- Target / Stop Lines ----------------
plot PTarget =
    if showTargetStopLines and activeDir == 1 then longTargetPrice
    else if showTargetStopLines and activeDir == -1 then shortTargetPrice
    else if showTargetStopLines and targetHit and activeDir[1] == 1 then longTargetPrice[1]
    else if showTargetStopLines and targetHit and activeDir[1] == -1 then shortTargetPrice[1]
    else Double.NaN;
PTarget.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
PTarget.SetStyle(Curve.SHORT_DASH);
PTarget.SetLineWeight(2);
PTarget.SetDefaultColor(Color.GREEN);

plot SLoss =
    if showTargetStopLines and activeDir == 1 then longStopPrice
    else if showTargetStopLines and activeDir == -1 then shortStopPrice
    else if showTargetStopLines and stopHit and activeDir[1] == 1 then longStopPrice[1]
    else if showTargetStopLines and stopHit and activeDir[1] == -1 then shortStopPrice[1]
    else Double.NaN;
SLoss.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
SLoss.SetStyle(Curve.SHORT_DASH);
SLoss.SetLineWeight(2);
SLoss.SetDefaultColor(Color.RED);

# ---------------- Bubbles + Alerts ----------------
AddChartBubble(
    showSignalBubbles and arrowMarkerLong,
    low - compactMarkerOff,
    "L",
    Color.MAGENTA,
    no
);
AddChartBubble(
    showSignalBubbles and arrowMarkerShort,
    high + compactMarkerOff,
    "S",
    Color.CYAN,
    yes
);
AddChartBubble(
    showRawProofBubbles and rawSetupBubbleLong,
    low - bigArrowOff * 0.75,
    "RAW L " +
        (if longScore >= 6 then "6" else if longScore >= 5 then "5" else if longScore >= 4 then "4" else if longScore >= 3 then "3" else if longScore >= 2 then "2" else if longScore >= 1 then "1" else "0") +
        "/6",
    Color.MAGENTA,
    no
);
AddChartBubble(
    showRawProofBubbles and rawSetupBubbleShort,
    high + bigArrowOff * 0.75,
    "RAW S " +
        (if shortScore >= 6 then "6" else if shortScore >= 5 then "5" else if shortScore >= 4 then "4" else if shortScore >= 3 then "3" else if shortScore >= 2 then "2" else if shortScore >= 1 then "1" else "0") +
        "/6",
    Color.CYAN,
    yes
);

AddChartBubble(
    showSignalBubbles and realLongEntry,
    low - off * 1.4,
    (if fastFlipLongArrow then "FLIP L " else if longContinuationArrow then "CONT L " else if setupPulseLongArrow then "SETUP L " else "ENTRY L ") +
        (if longScore >= 6 then "6" else if longScore >= 5 then "5" else if longScore >= 4 then "4" else if longScore >= 3 then "3" else if longScore >= 2 then "2" else if longScore >= 1 then "1" else "0") +
        "/6 " +
        (if longSignalCaution then "CAUTION" else "OK"),
    Color.GREEN,
    no
);
AddChartBubble(
    showSignalBubbles and realShortEntry,
    high + off * 1.4,
    (if fastFlipShortArrow then "FLIP S " else if shortContinuationArrow then "CONT S " else if setupPulseShortArrow then "SETUP S " else "ENTRY S ") +
        (if shortScore >= 6 then "6" else if shortScore >= 5 then "5" else if shortScore >= 4 then "4" else if shortScore >= 3 then "3" else if shortScore >= 2 then "2" else if shortScore >= 1 then "1" else "0") +
        "/6 " +
        (if shortSignalCaution then "CAUTION" else "OK"),
    Color.RED,
    yes
);

AddChartBubble(
    showFailsafeSignalBubbles and setupPulseLongArrow,
    low - bigArrowOff * 0.80,
    "SETUP L",
    Color.MAGENTA,
    no
);
AddChartBubble(
    showFailsafeSignalBubbles and setupPulseShortArrow,
    high + bigArrowOff * 0.80,
    "SETUP S",
    Color.CYAN,
    yes
);

AddChartBubble(
    debugForceArrows and debugForcedLongArrow and !realLongEntry,
    low - bigArrowOff * 1.1,
    "TEST L " +
        (if longScore >= 6 then "6" else if longScore >= 5 then "5" else if longScore >= 4 then "4" else if longScore >= 3 then "3" else if longScore >= 2 then "2" else if longScore >= 1 then "1" else "0") +
        "/6",
    Color.MAGENTA,
    no
);
AddChartBubble(
    debugForceArrows and debugForcedShortArrow and !realShortEntry,
    high + bigArrowOff * 1.1,
    "TEST S " +
        (if shortScore >= 6 then "6" else if shortScore >= 5 then "5" else if shortScore >= 4 then "4" else if shortScore >= 3 then "3" else if shortScore >= 2 then "2" else if shortScore >= 1 then "1" else "0") +
        "/6",
    Color.CYAN,
    yes
);

AddChartBubble(
    debugPaintBigArrow and lastVisibleBar,
    high + bigArrowOff * 1.2,
    "BIG TEST ARROW",
    Color.CYAN,
    yes
);
AddChartBubble(lastVisibleBar, high + liveArrowOff * 1.3, "v0.5.31 TEST", Color.CYAN, yes);

AddChartBubble(showContinuationBubbles and continuationLongSignal, low - off * 1.1, "ADD L " + (if longScore >= 6 then "6" else if longScore >= 5 then "5" else if longScore >= 4 then "4" else if longScore >= 3 then "3" else if longScore >= 2 then "2" else if longScore >= 1 then "1" else "0") + "/6", Color.GREEN, no);
AddChartBubble(showContinuationBubbles and continuationShortSignal, high + off * 1.1, "ADD S " + (if shortScore >= 6 then "6" else if shortScore >= 5 then "5" else if shortScore >= 4 then "4" else if shortScore >= 3 then "3" else if shortScore >= 2 then "2" else if shortScore >= 1 then "1" else "0") + "/6", Color.RED, yes);

AddChartBubble(showDangerBubbles and longDangerEdge, high + off * 1.8, "DANGER L " + (if longScore >= 6 then "6" else if longScore >= 5 then "5" else if longScore >= 4 then "4" else if longScore >= 3 then "3" else if longScore >= 2 then "2" else if longScore >= 1 then "1" else "0") + "/6", Color.ORANGE, yes);
AddChartBubble(showDangerBubbles and shortDangerEdge, low - off * 1.8, "DANGER S " + (if shortScore >= 6 then "6" else if shortScore >= 5 then "5" else if shortScore >= 4 then "4" else if shortScore >= 3 then "3" else if shortScore >= 2 then "2" else if shortScore >= 1 then "1" else "0") + "/6", Color.ORANGE, no);

AddChartBubble(showTargetStopBubbles and realLongEntry, longTargetPrice, "PT", GlobalColor("CautionAmber"), yes);
AddChartBubble(showTargetStopBubbles and realLongEntry, longStopPrice, "SL", Color.RED, no);
AddChartBubble(showTargetStopBubbles and realShortEntry, shortTargetPrice, "PT", GlobalColor("CautionAmber"), no);
AddChartBubble(showTargetStopBubbles and realShortEntry, shortStopPrice, "SL", Color.RED, yes);
AddChartBubble(showTargetStopBubbles and targetHit and activeDir[1] == 1, longTargetPrice[1], "PT", GlobalColor("CautionAmber"), yes);
AddChartBubble(showTargetStopBubbles and targetHit and activeDir[1] == -1, shortTargetPrice[1], "PT", GlobalColor("CautionAmber"), no);
AddChartBubble(showTargetStopBubbles and stopHit and activeDir[1] == 1, longStopPrice[1], "SL", Color.RED, no);
AddChartBubble(showTargetStopBubbles and stopHit and activeDir[1] == -1, shortStopPrice[1], "SL", Color.RED, yes);

Alert(!muteAllAlerts and realLongEntry, "LONG 5/6 Trigger", Alert.BAR, alertSoundUp);
Alert(!muteAllAlerts and realShortEntry, "SHORT 5/6 Trigger", Alert.BAR, alertSoundDown);
Alert(!muteAllAlerts and targetHit, "PTARGET Hit", Alert.BAR, alertSoundExit);
Alert(!muteAllAlerts and stopHit, "SLOSS Hit", Alert.BAR, alertSoundExit);
Alert(!muteAllAlerts and longDangerEdge, "DANGER LONG score breakdown", Alert.BAR, alertSoundExit);
Alert(!muteAllAlerts and shortDangerEdge, "DANGER SHORT score breakdown", Alert.BAR, alertSoundExit);

# ---------------- Compact Dashboard ----------------
def dashOK = showDashboard;
def dashDir = if fastFlipLongSetup then 1 else if fastFlipShortSetup then -1 else if longBias then 1 else if shortBias then -1 else 0;
def dashScore = if dashDir == 1 then longScore else if dashDir == -1 then shortScore else maxScore;
def dashTradeBlocked = if dashDir == 1 then !longTradeOK else if dashDir == -1 then !shortTradeOK else tradeBlocked;
def dashTradeCaution = !dashTradeBlocked and ((if dashDir == 1 then longTradeCaution else if dashDir == -1 then shortTradeCaution else tradeCaution) or fastFlipLongSetup or fastFlipShortSetup);
def dashTradeOK = !dashTradeBlocked and !dashTradeCaution;

AddLabel(dashOK, "PROFILE: " + (if useFifteenMinuteProfile then "15m TEST" else "5m"), if useFifteenMinuteProfile then GlobalColor("CautionAmber") else Color.GRAY);
AddLabel(yes, "BUILD: v0.5.31 REAL CHOP", Color.BLACK);
AddLabel(arrowMarkerLong and arrowMarkerShort, "MARKER: BOTH", if markerContractFail then Color.RED else Color.GRAY);
AddLabel(arrowMarkerLong and !arrowMarkerShort, "MARKER: L", if markerContractFail then Color.RED else Color.MAGENTA);
AddLabel(!arrowMarkerLong and arrowMarkerShort, "MARKER: S", if markerContractFail then Color.RED else Color.CYAN);
AddLabel(!arrowMarkerLong and !arrowMarkerShort, "MARKER: NONE", if markerContractFail then Color.RED else Color.GRAY);
AddLabel(markerContractFail, "CONTRACT: FAIL TRIGGER/MARKER", Color.RED);
AddLabel(!markerContractFail, "CONTRACT: OK", Color.GRAY);
AddLabel(longSetupPulseReady, "RAW SETUP: L", Color.MAGENTA);
AddLabel(shortSetupPulseReady, "RAW SETUP: S", Color.CYAN);
AddLabel(!longSetupPulseReady and !shortSetupPulseReady, "RAW SETUP: -", Color.GRAY);
AddLabel(longContinuationPressure, "RAW CONT: L", Color.MAGENTA);
AddLabel(shortContinuationPressure, "RAW CONT: S", Color.CYAN);
AddLabel(!longContinuationPressure and !shortContinuationPressure, "RAW CONT: -", Color.GRAY);
AddLabel(showDebugLabel, "DBG SET L200: " + AsText(setupLongRecentCount), Color.MAGENTA);
AddLabel(showDebugLabel, "DBG SET S200: " + AsText(setupShortRecentCount), Color.CYAN);
AddLabel(showDebugLabel, "DBG REV L200: " + AsText(reviewLongRecentCount), Color.MAGENTA);
AddLabel(showDebugLabel, "DBG REV S200: " + AsText(reviewShortRecentCount), Color.CYAN);
AddLabel(showDebugLabel, "DBG VIS L/S: " + AsText(visibleLongRecentCount) + "/" + AsText(visibleShortRecentCount), Color.GRAY);
AddLabel(showDebugLabel, "DBG CHOP L/S: " + AsText(reviewChopBlockedLongRecentCount) + "/" + AsText(reviewChopBlockedShortRecentCount), Color.GRAY);
AddLabel(showDebugLabel, "DBG ANY L/S: " + AsText(reviewLongAnyLoaded) + "/" + AsText(reviewShortAnyLoaded), Color.GRAY);
AddLabel(showDebugLabel, "DBG PROBE L/S: " + AsText(scoreProbeLongRecentCount) + "/" + AsText(scoreProbeShortRecentCount), Color.GRAY);

AddLabel(dashOK and debugForceArrows, "DEBUG FORCE ARROWS", Color.MAGENTA);
AddLabel(dashOK and debugForceArrows, "FORCED: " + (if debugForcedLongArrow then "L" else if debugForcedShortArrow then "S" else "NONE"), if debugForcedLongArrow then Color.MAGENTA else if debugForcedShortArrow then Color.CYAN else Color.GRAY);
AddLabel(dashOK and debugPaintBigArrow, "BIG TEST", Color.CYAN);

AddLabel(
    dashOK,
    "BIAS: " + (if fastFlipLongSetup then "FLIP LONG" else if fastFlipShortSetup then "FLIP SHORT" else if dashDir == 1 then "LONG" else if dashDir == -1 then "SHORT" else "NO TRADE"),
    if dashDir == 1 then Color.GREEN else if dashDir == -1 then Color.RED else Color.GRAY
);

AddLabel(
    dashOK,
    "SETUP: " +
        (if dashScore >= 6 then "6" else if dashScore >= 5 then "5" else if dashScore >= 4 then "4" else if dashScore >= 3 then "3" else if dashScore >= 2 then "2" else if dashScore >= 1 then "1" else "0") +
        "/6",
    if dashScore >= triggerThreshold then Color.GREEN else if dashScore >= standbyThreshold then GlobalColor("CautionAmber") else Color.GRAY
);

AddLabel(
    dashOK,
    "TRIGGER: " +
        (if longDangerEdge then "DANGER LONG"
         else if shortDangerEdge then "DANGER SHORT"
         else if debugPaintBigArrow and lastVisibleBar then "BIG TEST"
         else if debugForcedLongArrow and !realLongEntry then "TEST LONG"
         else if debugForcedShortArrow and !realShortEntry then "TEST SHORT"
         else if fastFlipLongArrow then "FLIP LONG"
         else if fastFlipShortArrow then "FLIP SHORT"
         else if dashboardContLong then "CONT LONG"
         else if dashboardContShort then "CONT SHORT"
         else if reviewLongSetupSignal then "REVIEW LONG"
         else if reviewShortSetupSignal then "REVIEW SHORT"
         else if realLongEntry then "LONG"
         else if realShortEntry then "SHORT"
         else if longStandby then "LONG STANDBY"
         else if shortStandby then "SHORT STANDBY"
         else if dashTradeBlocked and dashDir != 0 then "BLOCKED"
         else "WAIT"),
    if longDangerEdge or shortDangerEdge then Color.ORANGE
    else if debugPaintBigArrow and lastVisibleBar then Color.CYAN
    else if debugForcedLongArrow and !realLongEntry then Color.MAGENTA
    else if debugForcedShortArrow and !realShortEntry then Color.CYAN
    else if fastFlipLongArrow then Color.GREEN
    else if fastFlipShortArrow then Color.RED
    else if dashboardContLong then Color.GREEN
    else if dashboardContShort then Color.RED
    else if reviewLongSetupSignal then Color.MAGENTA
    else if reviewShortSetupSignal then Color.CYAN
    else if realLongEntry then Color.GREEN
    else if realShortEntry then Color.RED
    else if longStandby or shortStandby then GlobalColor("CautionAmber")
    else if dashTradeBlocked and dashDir != 0 then Color.RED
    else Color.GRAY
);

AddLabel(
    dashOK and (longDanger or shortDanger),
    "DANGER: " +
        (if longDanger then "LONG " + (if longScore >= 6 then "6" else if longScore >= 5 then "5" else if longScore >= 4 then "4" else if longScore >= 3 then "3" else if longScore >= 2 then "2" else if longScore >= 1 then "1" else "0") + "/6"
         else "SHORT " + (if shortScore >= 6 then "6" else if shortScore >= 5 then "5" else if shortScore >= 4 then "4" else if shortScore >= 3 then "3" else if shortScore >= 2 then "2" else if shortScore >= 1 then "1" else "0") + "/6"),
    Color.ORANGE
);

AddLabel(
    dashOK,
    "TRADE: " +
        (if dashTradeBlocked then "BLOCKED"
         else if dashTradeCaution then "CAUTION"
         else "OK"),
    if dashTradeOK then Color.GREEN else if dashTradeCaution then GlobalColor("CautionAmber") else Color.RED
);

AddLabel(
    dashOK and showDebugLabel and dashTradeBlocked,
    "BLOCKED BY: " +
        (if structureBlocked then "STRUCT"
         else "TRADE"),
    Color.RED
);

AddLabel(
    dashOK and showDebugLabel and !dashTradeBlocked and dashTradeCaution,
    "CAUTION BY: " +
        (if fastFlipShortSetup then "BREAKDOWN"
         else if fastFlipLongSetup then "BREAKOUT"
         else if shortContinuationPressure then "CONTINUE S"
         else if longContinuationPressure then "CONTINUE L"
         else if lowVolume then "RVOL"
         else if extended then "EXTENDED"
         else if adx < chopADX then "CHOP"
         else "MIXED"),
    GlobalColor("CautionAmber")
);

AddLabel(
    dashOK and showDebugLabel and !dashTradeBlocked,
    "NEXT: " +
        (if dashDir == 1 then
            (if dashScore < standbyThreshold or (dashScore < triggerThreshold and !allowCautionFourOfSix) then "SCORE"
             else if fastFlipLongSetup then "BREAKOUT"
             else if longContinuationPressure then "CONTINUE L"
              else if longSetupPulseReady then "SETUP READY"
             else if !longEntryConfirm then "CANDLE"
             else if !cooldownOK then "COOLDOWN"
             else if lastEntryDir[1] == 1 and !sameSideLongExpired then "SAME"
             else if rawLongEntry or longReadyEntry then "READY L"
             else "WAIT L")
         else if dashDir == -1 then
            (if dashScore < standbyThreshold or (dashScore < triggerThreshold and !allowCautionFourOfSix) then "SCORE"
             else if fastFlipShortSetup then "BREAKDOWN"
             else if shortContinuationPressure then "CONTINUE S"
              else if shortSetupPulseReady then "SETUP READY"
             else if !shortEntryConfirm then "CANDLE"
             else if !cooldownOK then "COOLDOWN"
             else if lastEntryDir[1] == -1 and !sameSideShortExpired then "SAME"
             else if rawShortEntry or shortReadyEntry then "READY S"
             else "WAIT S")
         else if longScore == shortScore and maxScore >= standbyThreshold then "TIE"
         else "SCORE"),
    Color.GRAY
);

AddLabel(
    dashOK and activeDir != 0,
    "ENTRY: " + AsText(Round(activeEntryPrice, 2)) +
        " | PT: " +
        AsText(Round(if activeDir == 1 then longTargetPrice else shortTargetPrice, 2)) +
        " | SL: " +
        AsText(Round(if activeDir == 1 then longStopPrice else shortStopPrice, 2)),
    if activeDir == 1 then Color.GREEN else Color.RED
);

AddLabel(
    dashOK,
    "ATR: " + AsText(Round(atr, 2)) + " | RVOL: " + AsText(Round(relVol, 2)),
    Color.GRAY
);
