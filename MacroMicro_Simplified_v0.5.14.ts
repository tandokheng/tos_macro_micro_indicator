# ============================================================
# Macro Micro Simplified 5-of-6 Intraday Study
# Version: v0.5.14
# TOS Study: _dk_codex_macro_micro_v1
# Label: 5-of-6 intraday simplified
# Timeframe focus: 5m first, then 15m validation/tuning.
# - One primary LONG / SHORT arrow
# - Same-direction continuation signals are labeled ADD, not re-entry arrows
# - Score-break danger bubbles when an active trade degrades
# - Standby dots before trigger
# - Stronger candle confirmation and RVOL trade gating
# - Directional ATR ptarget / sloss
# - Compact dashboard plus arrow-bar signal bubbles
# - Confirmed score-cross entries so 5m momentum is not missed after a micro-cross
# - Fresh 5/6 trigger window so entries can confirm shortly after the score turns
# - Sustained 5/6 candle-confirmed entries so visible trends are not missed after the first cross
# - Anti-starvation entry pulse so cooldown-blocked 5/6 setups can still arrow once eligible
# - Explicit upper-chart declaration and WHY diagnostics for no-arrow troubleshooting
# - 5m RVOL tuning: quiet bars become CAUTION, only extreme low RVOL blocks arrows
# - 5m caution entries: strong 4/6 setups can arrow as CAUTION, while 5/6 remains the clean trigger
# - Setup dashboard score displays as an integer, not 4.00/6
# - Cooldown now resets from plotted entries, not candidate-ready edges that can starve arrows
# - Same-side arrows can refresh after resetSameSideAfterBars during sustained strong trends
# - Caution labels use amber instead of bright yellow for better white-text readability
# - 5m remains the default profile; optional 15m profile adjusts timing windows only
# - Same-side refresh waits for the next valid candidate after the reset window, not one exact bar
# - Compile fix: entry state no longer references newLongEntry/newShortEntry/lastEntryDir before definition
# - Fast break confirmation so 5/6 trade-OK impulse moves are not starved by strict candle filters
# - Debug force arrows: temporary test mode plots 5/6 trade-OK arrows without candle/entry-state gating
# - Debug force arrows now ignore TRADE/RVOL too, so this is a true plot-visibility test
# - Debug big arrow: always paints one huge cyan arrow/bubble on the last visible bar
# - Fresh primary arrow plot names avoid inherited hidden TOS plot settings from LongArrow/ShortArrow
# - Forced short debug now uses the known-visible DebugBigArrow plot and ungated forced bubbles
# - Forced long debug now has a mirrored big magenta DebugBigUpArrow plot
# - Clean signal test: debug-force defaults off and real arrows no longer include forced debug conditions
# - RVOL tuning: sub-0.35 RVOL is CAUTION, hard block is reserved for truly dead volume or non-impulse bars
# - Practical real-entry layer: arrows can fire from qualified setup edges without waiting for full recursive entry-state alignment
# - RVOL is now caution-only for qualified setups; structure/chop can still block trades
# - Dashboard diagnostics split hard blocks from caution warnings and next trigger waits
# - Fast bias-flip caution arrows catch hard breaks before the slower 6-point bias fully flips
# - 4/6 continuation-pressure caution arrows reduce NEXT:CANDLE starvation in active trends
# - 5/6 setup pulse fallback prevents sustained qualified setups from producing no arrows
# - Fresh v0.5.5 arrow plot names plus dense setup pulses avoid inherited hidden TOS plot settings
# - Known-visible big arrow plots now carry real entries when normal primary plots remain hidden
# - Failsafe setup bubbles default off and setup pulses are throttled after v0.5.6 proved visibility but spammed the chart
# - Arrows-first review: signal bubbles default off, setup pulses moderate, and real arrows plot closer to candles
# - Continuation anchor arrows show persistent CONTINUE S/L states without resetting trade tracking
# - Compact S/L marker bubbles are now the primary visible signal marker because TOS plot arrows are unreliable
# - Setup-ready markers are visual-only so strong 5/6 states show without repeatedly resetting PT/SL
# - Marker bubbles are hardwired instead of controlled by a new input, avoiding saved TOS input-value drift
# - Fresh v0.5.11 marker dot plots and a MARKER dashboard label provide non-bubble visibility proof
# - Always-visible BUILD and MARKER dashboard labels prove which pasted build TOS is actually running
# - Last-loaded-bar build bubble proves AddChartBubble is active independent of signal conditions
# - Spam diagnostic build: raw setup/continuation pressure paints hardwired markers without resetting trade tracking
# - Dashboard trigger contract now uses named booleans and exposes trigger/marker mismatches
# - Compile fix: split diagnostic MARKER/CONTRACT/RAW labels into static labels to avoid TOS parser failures
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
input useKnownVisibleSignalArrows = yes;
input showContinuationAnchorArrows = yes;
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
def visualLongSetupReady = longSetupPulseReady;
def visualShortSetupReady = shortSetupPulseReady;
def realLongEntry = newLongEntry or practicalLongArrow or fastFlipLongArrow or longContinuationArrow;
def realShortEntry = newShortEntry or practicalShortArrow or fastFlipShortArrow or shortContinuationArrow;
def spamDiagMode = yes;
def spamDiagLong = spamDiagMode and (longSetupPulseReady or longContinuationPressure);
def spamDiagShort = spamDiagMode and (shortSetupPulseReady or shortContinuationPressure);
def visibleLongSignal = realLongEntry or continuationAnchorLongArrow or visualLongSetupReady or spamDiagLong;
def visibleShortSignal = realShortEntry or continuationAnchorShortArrow or visualShortSetupReady or spamDiagShort;
def arrowMarkerLong = visibleLongSignal;
def arrowMarkerShort = visibleShortSignal;
def dashboardContLong = continuationAnchorLongArrow or longContinuationArrow;
def dashboardContShort = continuationAnchorShortArrow or shortContinuationArrow;
def dashboardTriggerLong = fastFlipLongArrow or dashboardContLong or setupPulseLongArrow or realLongEntry;
def dashboardTriggerShort = fastFlipShortArrow or dashboardContShort or setupPulseShortArrow or realShortEntry;
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
def longSignalCaution = longScore < triggerThreshold or longTradeCaution or fastFlipLongArrow or longContinuationArrow or setupPulseLongArrow;
def shortSignalCaution = shortScore < triggerThreshold or shortTradeCaution or fastFlipShortArrow or shortContinuationArrow or setupPulseShortArrow;
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
def bigArrowOff = Max(off * 50, atr * 1.20);

plot DebugBigArrow =
    if useKnownVisibleSignalArrows and visibleShortSignal then high + liveArrowOff
    else if (debugPaintBigArrow and lastVisibleBar) or (debugForceArrows and debugForcedShortArrow) then high + bigArrowOff
    else Double.NaN;
DebugBigArrow.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
DebugBigArrow.SetLineWeight(5);
DebugBigArrow.SetDefaultColor(Color.CYAN);

plot DebugBigUpArrow =
    if useKnownVisibleSignalArrows and visibleLongSignal then low - liveArrowOff
    else if debugForceArrows and debugForcedLongArrow then low - bigArrowOff
    else Double.NaN;
DebugBigUpArrow.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
DebugBigUpArrow.SetLineWeight(5);
DebugBigUpArrow.SetDefaultColor(Color.MAGENTA);

plot MarkerLongDotV0513 =
    if arrowMarkerLong then low - liveArrowOff else Double.NaN;
MarkerLongDotV0513.SetPaintingStrategy(PaintingStrategy.POINTS);
MarkerLongDotV0513.SetLineWeight(5);
MarkerLongDotV0513.SetDefaultColor(Color.MAGENTA);

plot MarkerShortDotV0513 =
    if arrowMarkerShort then high + liveArrowOff else Double.NaN;
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
    arrowMarkerLong,
    low - liveArrowOff,
    "L",
    Color.MAGENTA,
    no
);
AddChartBubble(
    arrowMarkerShort,
    high + liveArrowOff,
    "S",
    Color.CYAN,
    yes
);

AddChartBubble(spamDiagLong, low - bigArrowOff * 0.75, "SPAM L", Color.MAGENTA, no);
AddChartBubble(spamDiagShort, high + bigArrowOff * 0.75, "SPAM S", Color.CYAN, yes);

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
AddChartBubble(lastVisibleBar, high + liveArrowOff * 1.3, "v0.5.14 TEST", Color.CYAN, yes);

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
AddLabel(yes, "BUILD: v0.5.14 SPAM DIAG", Color.BLACK);
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
         else if setupPulseLongArrow then "SETUP LONG"
         else if setupPulseShortArrow then "SETUP SHORT"
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
    else if setupPulseLongArrow then Color.GREEN
    else if setupPulseShortArrow then Color.RED
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
         else if setupPulseShortArrow or setupPulseLongArrow then "SETUP"
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
              else if setupPulseLongArrow then "PULSE READY"
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
              else if setupPulseShortArrow then "PULSE READY"
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
