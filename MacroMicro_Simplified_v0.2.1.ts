# ============================================================
# Macro Micro Simplified 5-of-6 Intraday Study
# Version: v0.2.1
# Label: 5-of-6 intraday simplified
# Timeframe focus: 5m first, then 15m validation/tuning.
# - One primary LONG / SHORT arrow
# - Same-direction continuation signals are labeled ADD, not re-entry arrows
# - Score-break danger bubbles when an active trade degrades
# - Standby dots before trigger
# - Stronger candle confirmation and RVOL trade gating
# - Directional ATR ptarget / sloss
# - Compact dashboard plus arrow-bar signal bubbles
# ============================================================

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
input minRelVolume = 1.10;
input blockRelVolume = 0.60;
input exceptionalMomentumATRFactor = 1.60;

input minSlopeTicks = 0.25;
input offsetTicks = 8;
input cooldownBars = 5;
input resetSameSideAfterBars = 30;
input dangerScoreThreshold = 3;
input dangerDropFromPeak = 2;

input showStandbyDots = yes;
input showTargetStopLines = yes;
input showSignalBubbles = yes;
input showContinuationBubbles = yes;
input showDangerBubbles = yes;
input showTargetStopBubbles = yes;
input showDashboard = yes;

input muteAllAlerts = no;
input alertSoundUp = Sound.Bell;
input alertSoundDown = Sound.Bell;
input alertSoundExit = Sound.Ding;

def tick = TickSize();
def off = offsetTicks * tick;
def minSlope = minSlopeTicks * tick;
def standbyThreshold = 4;
def triggerThreshold = 5;

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

def microLongOK = microFast > microSlow and buyPressure;
def microShortOK = microFast < microSlow and sellPressure;

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

def trendRejectionLong = low <= emaFast and close > emaFast and longCandleConfirm;
def trendRejectionShort = high >= emaFast and close < emaFast and shortCandleConfirm;

def longTrigger = (microCrossUp and longCandleConfirm) or momentumLong or trendRejectionLong;
def shortTrigger = (microCrossDown and shortCandleConfirm) or momentumShort or trendRejectionShort;

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

# ---------------- Trade State ----------------
def mixedBias = longScore >= standbyThreshold and shortScore >= standbyThreshold;
def extensionATR = if atr > 0 then AbsValue(close - emaFast) / atr else 0;
def extended = extensionATR > maxExtensionATR;
def lowVolume = relVol < minRelVolume;
def extremeLowRelVolume = relVol < blockRelVolume;
def chop = adx < chopADX and maxScore < triggerThreshold;

def structureBlocked = mixedBias or chop;
def longVolumeOK = !extremeLowRelVolume or exceptionalLongMomentum;
def shortVolumeOK = !extremeLowRelVolume or exceptionalShortMomentum;
def tradeBlocked = structureBlocked or (extremeLowRelVolume and !exceptionalLongMomentum and !exceptionalShortMomentum);
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

def longSetup = longScore >= triggerThreshold and longScore > shortScore and longTradeOK;
def shortSetup = shortScore >= triggerThreshold and shortScore > longScore and shortTradeOK;

def rawLongEntry = longSetup and longTrigger;
def rawShortEntry = shortSetup and shortTrigger;
def longEntryEdge = rawLongEntry and !rawLongEntry[1];
def shortEntryEdge = rawShortEntry and !rawShortEntry[1];
def anyEntryEdge = longEntryEdge or shortEntryEdge;

def barsSinceEntryEdge =
    CompoundValue(
        1,
        if anyEntryEdge then 0 else barsSinceEntryEdge[1] + 1,
        cooldownBars + 1
    );

def cooldownOK = barsSinceEntryEdge[1] > cooldownBars;

def lastEntryDir =
    CompoundValue(
        1,
        if lastEntryDir[1] == 1 and (shortBias or longScore <= dangerScoreThreshold) then 0
        else if lastEntryDir[1] == -1 and (longBias or shortScore <= dangerScoreThreshold) then 0
        else if longEntryEdge and cooldownOK and lastEntryDir[1] != 1 then 1
        else if shortEntryEdge and cooldownOK and lastEntryDir[1] != -1 then -1
        else lastEntryDir[1],
        0
    );

def trendResetLong = lastEntryDir[1] == 1 and (shortBias or longScore <= dangerScoreThreshold);
def trendResetShort = lastEntryDir[1] == -1 and (longBias or shortScore <= dangerScoreThreshold);
def newLongEntry = longEntryEdge and cooldownOK and lastEntryDir[1] != 1;
def newShortEntry = shortEntryEdge and cooldownOK and lastEntryDir[1] != -1;
def continuationLongSignal = longEntryEdge and cooldownOK and lastEntryDir[1] == 1 and !trendResetLong;
def continuationShortSignal = shortEntryEdge and cooldownOK and lastEntryDir[1] == -1 and !trendResetShort;

# ---------------- Trade Tracking + PTarget / SLoss ----------------
def activeEntryPrice =
    CompoundValue(
        1,
        if newLongEntry or newShortEntry then close else activeEntryPrice[1],
        close
    );

def lockedATR =
    CompoundValue(
        1,
        if newLongEntry or newShortEntry then atr else lockedATR[1],
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
        if newLongEntry then 1
        else if newShortEntry then -1
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
        if newLongEntry or newShortEntry then activeTradeScore
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

plot LongArrow = if newLongEntry then low - off else Double.NaN;
LongArrow.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
LongArrow.SetLineWeight(5);
LongArrow.SetDefaultColor(Color.GREEN);

plot ShortArrow = if newShortEntry then high + off else Double.NaN;
ShortArrow.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
ShortArrow.SetLineWeight(5);
ShortArrow.SetDefaultColor(Color.RED);

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
AddChartBubble(showSignalBubbles and newLongEntry, low - off * 1.4, "ENTRY L " + AsText(longScore) + "/6 " + (if longTradeCaution then "CAUTION" else "OK"), Color.GREEN, no);
AddChartBubble(showSignalBubbles and newShortEntry, high + off * 1.4, "ENTRY S " + AsText(shortScore) + "/6 " + (if shortTradeCaution then "CAUTION" else "OK"), Color.RED, yes);

AddChartBubble(showContinuationBubbles and continuationLongSignal, low - off * 1.1, "ADD L " + AsText(longScore) + "/6", Color.GREEN, no);
AddChartBubble(showContinuationBubbles and continuationShortSignal, high + off * 1.1, "ADD S " + AsText(shortScore) + "/6", Color.RED, yes);

AddChartBubble(showDangerBubbles and longDangerEdge, high + off * 1.8, "DANGER L " + AsText(longScore) + "/6", Color.ORANGE, yes);
AddChartBubble(showDangerBubbles and shortDangerEdge, low - off * 1.8, "DANGER S " + AsText(shortScore) + "/6", Color.ORANGE, no);

AddChartBubble(showTargetStopBubbles and newLongEntry, longTargetPrice, "PT", Color.YELLOW, yes);
AddChartBubble(showTargetStopBubbles and newLongEntry, longStopPrice, "SL", Color.RED, no);
AddChartBubble(showTargetStopBubbles and newShortEntry, shortTargetPrice, "PT", Color.YELLOW, no);
AddChartBubble(showTargetStopBubbles and newShortEntry, shortStopPrice, "SL", Color.RED, yes);
AddChartBubble(showTargetStopBubbles and targetHit and activeDir[1] == 1, longTargetPrice[1], "PT", Color.YELLOW, yes);
AddChartBubble(showTargetStopBubbles and targetHit and activeDir[1] == -1, shortTargetPrice[1], "PT", Color.YELLOW, no);
AddChartBubble(showTargetStopBubbles and stopHit and activeDir[1] == 1, longStopPrice[1], "SL", Color.RED, no);
AddChartBubble(showTargetStopBubbles and stopHit and activeDir[1] == -1, shortStopPrice[1], "SL", Color.RED, yes);

Alert(!muteAllAlerts and newLongEntry, "LONG 5/6 Trigger", Alert.BAR, alertSoundUp);
Alert(!muteAllAlerts and newShortEntry, "SHORT 5/6 Trigger", Alert.BAR, alertSoundDown);
Alert(!muteAllAlerts and targetHit, "PTARGET Hit", Alert.BAR, alertSoundExit);
Alert(!muteAllAlerts and stopHit, "SLOSS Hit", Alert.BAR, alertSoundExit);
Alert(!muteAllAlerts and longDangerEdge, "DANGER LONG score breakdown", Alert.BAR, alertSoundExit);
Alert(!muteAllAlerts and shortDangerEdge, "DANGER SHORT score breakdown", Alert.BAR, alertSoundExit);

# ---------------- Compact Dashboard ----------------
def dashOK = showDashboard;
def dashDir = if longBias then 1 else if shortBias then -1 else 0;
def dashScore = if dashDir == 1 then longScore else if dashDir == -1 then shortScore else maxScore;
def dashTradeBlocked = if dashDir == 1 then !longTradeOK else if dashDir == -1 then !shortTradeOK else tradeBlocked;
def dashTradeCaution = !dashTradeBlocked and (if dashDir == 1 then longTradeCaution else if dashDir == -1 then shortTradeCaution else tradeCaution);
def dashTradeOK = !dashTradeBlocked and !dashTradeCaution;

AddLabel(
    dashOK,
    "BIAS: " + (if dashDir == 1 then "LONG" else if dashDir == -1 then "SHORT" else "NO TRADE"),
    if dashDir == 1 then Color.GREEN else if dashDir == -1 then Color.RED else Color.GRAY
);

AddLabel(
    dashOK,
    "SETUP: " + AsText(dashScore) + "/6",
    if dashScore >= triggerThreshold then Color.GREEN else if dashScore >= standbyThreshold then Color.YELLOW else Color.GRAY
);

AddLabel(
    dashOK,
    "TRIGGER: " +
        (if longDangerEdge then "DANGER LONG"
         else if shortDangerEdge then "DANGER SHORT"
         else if newLongEntry then "LONG"
         else if newShortEntry then "SHORT"
         else if longStandby then "LONG STANDBY"
         else if shortStandby then "SHORT STANDBY"
         else if dashTradeBlocked and dashDir != 0 then "BLOCKED"
         else "WAIT"),
    if longDangerEdge or shortDangerEdge then Color.ORANGE
    else if newLongEntry then Color.GREEN
    else if newShortEntry then Color.RED
    else if longStandby or shortStandby then Color.YELLOW
    else if dashTradeBlocked and dashDir != 0 then Color.RED
    else Color.GRAY
);

AddLabel(
    dashOK and (longDanger or shortDanger),
    "DANGER: " +
        (if longDanger then "LONG " + AsText(longScore) + "/6"
         else "SHORT " + AsText(shortScore) + "/6"),
    Color.ORANGE
);

AddLabel(
    dashOK,
    "TRADE: " +
        (if dashTradeBlocked then "BLOCKED"
         else if dashTradeCaution then "CAUTION"
         else "OK"),
    if dashTradeOK then Color.GREEN else if dashTradeCaution then Color.YELLOW else Color.RED
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
