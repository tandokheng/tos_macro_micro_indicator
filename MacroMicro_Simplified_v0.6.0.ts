# ============================================================
# Macro Micro Simplified Clean Reset
# Version: v0.6.0
# TOS Study: _dk_codex_macro_micro_v1
# Label: original-confluence simplified
# Active build: v0.6.0 CLEAN.
# ============================================================

declare upper;

input price = close;
input emaFastLen = 8;
input emaSlowLen = 17;
input lrcLength = 38;
input atrLength = 14;
input stATRLength = 10;
input stMultiplier = 3.0;
input useVWAPFilter = no;
input useValueAreaProxy = yes;
input vaStdLen = 50;
input vaMultiplier = 1.0;
input volumeMALength = 50;
input minVolumeMultiple = 0.75;
input minSlopeTicks = 0.25;
input offsetTicks = 8;
input readyScoreThreshold = 4;
input readyDotNeutralResetBars = 3;
input riskATRFactor = 1.0;
input tp1RMultiple = 1.0;
input tp2RMultiple = 2.0;
input structureStopLookbackBars = 5;
input stopBufferATR = 0.20;
input maxStopATRFactor = 1.50;
input planHoldBars = 24;
input usePSARRunner = yes;
input psarStrongSlopeATR = 0.08;
input invalidScoreThreshold = 3;
input showReadyDots = yes;
input showEntryArrows = yes;
input showPlanLines = yes;
input showPlanBubbles = yes;
input showEntryBubbles = no;
input showHitBubbles = no;
input showInvalidationBubble = yes;
input showDashboard = yes;
input muteAllAlerts = no;
input alertSoundUp = Sound.Bell;
input alertSoundDown = Sound.Bell;
input alertSoundExit = Sound.Ding;

def tick = TickSize();
def off = offsetTicks * tick;
def minSlope = minSlopeTicks * tick;

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
def atr = Average(TrueRange(high, close, low), atrLength);

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

# ---------------- Original-style macro confluence ----------------
def emaLongOK = emaFast > emaSlow and dFast > minSlope and dSlow >= -minSlope;
def emaShortOK = emaFast < emaSlow and dFast < -minSlope and dSlow <= minSlope;

def psarLongOK = close > psar;
def psarShortOK = close < psar;

def superLongOK = close > supertrend;
def superShortOK = close < supertrend;

def lrcLongOK = lrcSlope > minSlope;
def lrcShortOK = lrcSlope < -minSlope;

def vwapLongOK = if useVWAPFilter then close > vwapLine else yes;
def vwapShortOK = if useVWAPFilter then close < vwapLine else yes;
def valueRange = StDev(close, vaStdLen) * vaMultiplier;
def valueHigh = vwapLine + valueRange;
def valueLow = vwapLine - valueRange;
def valueLongOK = if useValueAreaProxy then close > vwapLine and close > valueLow else vwapLongOK;
def valueShortOK = if useValueAreaProxy then close < vwapLine and close < valueHigh else vwapShortOK;

def avgVolume = Average(volume, volumeMALength);
def volumeLongOK = close >= open and volume >= avgVolume * minVolumeMultiple;
def volumeShortOK = close <= open and volume >= avgVolume * minVolumeMultiple;

def macroLongConfirmed = emaLongOK and psarLongOK and superLongOK and lrcLongOK and valueLongOK;
def macroShortConfirmed = emaShortOK and psarShortOK and superShortOK and lrcShortOK and valueShortOK;

def macroLongScore =
    (if emaLongOK then 1 else 0) +
    (if psarLongOK then 1 else 0) +
    (if superLongOK then 1 else 0) +
    (if lrcLongOK then 1 else 0) +
    (if valueLongOK then 1 else 0) +
    (if volumeLongOK then 1 else 0);

def macroShortScore =
    (if emaShortOK then 1 else 0) +
    (if psarShortOK then 1 else 0) +
    (if superShortOK then 1 else 0) +
    (if lrcShortOK then 1 else 0) +
    (if valueShortOK then 1 else 0) +
    (if volumeShortOK then 1 else 0);

def readyLong = macroLongScore >= readyScoreThreshold and !macroLongConfirmed and macroLongScore > macroShortScore;
def readyShort = macroShortScore >= readyScoreThreshold and !macroShortConfirmed and macroShortScore > macroLongScore;
def readyNeutral = macroLongScore < readyScoreThreshold and macroShortScore < readyScoreThreshold;
def readyNeutralCount = CompoundValue(1, if readyNeutral then readyNeutralCount[1] + 1 else 0, 0);
def readyLockedDir = CompoundValue(
    1,
    if readyNeutralCount >= readyDotNeutralResetBars then 0
    else if readyLockedDir[1] == 0 and readyLong then 1
    else if readyLockedDir[1] == 0 and readyShort then -1
    else if readyLockedDir[1] > 0 and macroLongConfirmed then 0
    else if readyLockedDir[1] < 0 and macroShortConfirmed then 0
    else readyLockedDir[1],
    0
);
def readyLongDot = readyLockedDir == 1 and readyLockedDir[1] == 0;
def readyShortDot = readyLockedDir == -1 and readyLockedDir[1] == 0;

def macroState = CompoundValue(
    1,
    if macroLongConfirmed then 1
    else if macroShortConfirmed then -1
    else macroState[1],
    0
);
def macroLongFlip = macroLongConfirmed and macroState[1] != 1;
def macroShortFlip = macroShortConfirmed and macroState[1] != -1;
def entryLongSignal = macroLongFlip[1];
def entryShortSignal = macroShortFlip[1];

plot ReadyLongDotV0600 = if showReadyDots and readyLongDot then low - off * 0.75 else Double.NaN;
plot ReadyShortDotV0600 = if showReadyDots and readyShortDot then high + off * 0.75 else Double.NaN;
ReadyLongDotV0600.SetPaintingStrategy(PaintingStrategy.POINTS);
ReadyShortDotV0600.SetPaintingStrategy(PaintingStrategy.POINTS);
ReadyLongDotV0600.AssignValueColor(Color.CYAN);
ReadyShortDotV0600.AssignValueColor(Color.MAGENTA);
ReadyLongDotV0600.SetLineWeight(5);
ReadyShortDotV0600.SetLineWeight(5);

plot MacroLongArrowV0600 = if showEntryArrows and entryLongSignal then low - off else Double.NaN;
plot MacroShortArrowV0600 = if showEntryArrows and entryShortSignal then high + off else Double.NaN;
MacroLongArrowV0600.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
MacroShortArrowV0600.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
MacroLongArrowV0600.AssignValueColor(Color.GREEN);
MacroShortArrowV0600.AssignValueColor(Color.RED);
MacroLongArrowV0600.SetLineWeight(5);
MacroShortArrowV0600.SetLineWeight(5);

# ---------------- R plan ----------------
def planStart = entryLongSignal or entryShortSignal;
def planDir = CompoundValue(1, if entryLongSignal then 1 else if entryShortSignal then -1 else planDir[1], 0);
def planEntryPrice = CompoundValue(1, if planStart then open else planEntryPrice[1], close);
def planATR = CompoundValue(1, if planStart then atr[1] else planATR[1], atr);
def planAge = CompoundValue(1, if planStart then 0 else planAge[1] + 1, 10000);

def planLongATRStop = planEntryPrice - planATR * riskATRFactor;
def planShortATRStop = planEntryPrice + planATR * riskATRFactor;
def planLongStructureStop = Lowest(low[1], structureStopLookbackBars) - planATR * stopBufferATR;
def planShortStructureStop = Highest(high[1], structureStopLookbackBars) + planATR * stopBufferATR;
def planLongWideStop = Min(planLongATRStop, planLongStructureStop);
def planShortWideStop = Max(planShortATRStop, planShortStructureStop);
def planLongMaxStop = planEntryPrice - planATR * maxStopATRFactor;
def planShortMaxStop = planEntryPrice + planATR * maxStopATRFactor;
def planStopPrice = if planDir == 1 then Max(planLongWideStop, planLongMaxStop) else if planDir == -1 then Min(planShortWideStop, planShortMaxStop) else Double.NaN;
def planRiskR = if planDir == 1 then planEntryPrice - planStopPrice else if planDir == -1 then planStopPrice - planEntryPrice else Double.NaN;
def planTP1Price = if planDir == 1 then planEntryPrice + planRiskR * tp1RMultiple else if planDir == -1 then planEntryPrice - planRiskR * tp1RMultiple else Double.NaN;
def planTP2Price = if planDir == 1 then planEntryPrice + planRiskR * tp2RMultiple else if planDir == -1 then planEntryPrice - planRiskR * tp2RMultiple else Double.NaN;

def planWindowActive = planDir != 0 and planAge <= planHoldBars;
def planTP1HitCandidate = planWindowActive and planRiskR > 0 and ((planDir == 1 and high >= planTP1Price) or (planDir == -1 and low <= planTP1Price));
def planTP2HitCandidate = planWindowActive and planRiskR > 0 and ((planDir == 1 and high >= planTP2Price) or (planDir == -1 and low <= planTP2Price));
def planStopHitCandidate = planWindowActive and planRiskR > 0 and ((planDir == 1 and low <= planStopPrice) or (planDir == -1 and high >= planStopPrice));

def planPSARSlopeATR = if planATR > 0 then AbsValue(psar - psar[1]) / planATR else 0;
def planPSARAligned = (planDir == 1 and close > psar) or (planDir == -1 and close < psar);
def planPSARSlopeAligned = (planDir == 1 and psar > psar[1]) or (planDir == -1 and psar < psar[1]);
def planPSARStrong = planPSARAligned and planPSARSlopeAligned and planPSARSlopeATR >= psarStrongSlopeATR;
def planTP2RunnerCandidate = planTP2HitCandidate and usePSARRunner and planPSARStrong;
def planOppositeInvalid = (planDir == 1 and macroShortConfirmed) or (planDir == -1 and macroLongConfirmed);
def planScoreInvalid = (planDir == 1 and macroLongScore <= invalidScoreThreshold and macroShortScore > macroLongScore) or (planDir == -1 and macroShortScore <= invalidScoreThreshold and macroLongScore > macroShortScore);
def planInvalidCandidate = planWindowActive and planAge > 0 and !planStopHitCandidate and (planOppositeInvalid or planScoreInvalid);

def planOutcomeState = CompoundValue(
    1,
    if planStart then 0
    else if planOutcomeState[1] >= 0 and planStopHitCandidate then -1
    else if planOutcomeState[1] >= 0 and planTP2RunnerCandidate then 3
    else if planOutcomeState[1] >= 0 and planTP2HitCandidate then 2
    else if planOutcomeState[1] >= 0 and planOutcomeState[1] != 2 and planInvalidCandidate then -2
    else if planOutcomeState[1] == 0 and planTP1HitCandidate then 1
    else planOutcomeState[1],
    0
);
def planTP1Hit = planOutcomeState == 1 and planOutcomeState[1] == 0;
def planTP2Hit = planOutcomeState == 2 and planOutcomeState[1] != 2;
def planStopHit = planOutcomeState == -1 and planOutcomeState[1] != -1;
def planInvalidated = planOutcomeState == -2 and planOutcomeState[1] != -2;
def planRunnerActive = planOutcomeState == 3;
def planActive = planWindowActive and planRiskR > 0 and planOutcomeState != -1 and planOutcomeState != -2 and planOutcomeState != 2;
def planRiskPoints = if planActive then AbsValue(planRiskR) else Double.NaN;
def currentPSARSlopeATR = if atr > 0 then AbsValue(psar - psar[1]) / atr else 0;
def currentPSARLongStrong = psarLongOK and psar > psar[1] and currentPSARSlopeATR >= psarStrongSlopeATR;
def currentPSARShortStrong = psarShortOK and psar < psar[1] and currentPSARSlopeATR >= psarStrongSlopeATR;

plot PlanTP1LineV0600 = if showPlanLines and planActive then planTP1Price else Double.NaN;
plot PlanTP2LineV0600 = if showPlanLines and planActive then planTP2Price else Double.NaN;
plot PlanStopLineV0600 = if showPlanLines and planActive then planStopPrice else Double.NaN;
PlanTP1LineV0600.SetDefaultColor(Color.ORANGE);
PlanTP2LineV0600.SetDefaultColor(Color.ORANGE);
PlanStopLineV0600.SetDefaultColor(Color.RED);
PlanTP1LineV0600.SetStyle(Curve.SHORT_DASH);
PlanTP2LineV0600.SetStyle(Curve.SHORT_DASH);
PlanStopLineV0600.SetStyle(Curve.SHORT_DASH);
PlanTP1LineV0600.SetLineWeight(2);
PlanTP2LineV0600.SetLineWeight(2);
PlanStopLineV0600.SetLineWeight(2);

def longBubblePrice = low - off * 1.8;
def shortBubblePrice = high + off * 1.8;
def invalidationBubblePrice = if planDir == 1 then low - off * 2.0 else high + off * 2.0;
def invalidationBubbleUp = planDir == -1;

AddChartBubble(showPlanBubbles and showEntryBubbles and entryLongSignal, longBubblePrice, "ENTRY L", Color.GREEN, no);
AddChartBubble(showPlanBubbles and showEntryBubbles and entryShortSignal, shortBubblePrice, "ENTRY S", Color.RED, yes);
AddChartBubble(showPlanBubbles and planStart and planDir == 1, planTP1Price, "R-TP1", Color.ORANGE, yes);
AddChartBubble(showPlanBubbles and planStart and planDir == 1, planTP2Price, "R-TP2", Color.ORANGE, yes);
AddChartBubble(showPlanBubbles and planStart and planDir == 1, planStopPrice, "R-SL", Color.RED, no);
AddChartBubble(showPlanBubbles and planStart and planDir == -1, planTP1Price, "R-TP1", Color.ORANGE, no);
AddChartBubble(showPlanBubbles and planStart and planDir == -1, planTP2Price, "R-TP2", Color.ORANGE, no);
AddChartBubble(showPlanBubbles and planStart and planDir == -1, planStopPrice, "R-SL", Color.RED, yes);
AddChartBubble(showHitBubbles and planTP1Hit, planTP1Price, "TP1", Color.ORANGE, planDir == 1);
AddChartBubble(showHitBubbles and planTP2Hit, planTP2Price, "TP2", Color.ORANGE, planDir == 1);
AddChartBubble(showHitBubbles and planStopHit, planStopPrice, "SL", Color.RED, planDir == -1);
AddChartBubble(showPlanBubbles and showInvalidationBubble and planInvalidated, invalidationBubblePrice, "R-INV", Color.GRAY, invalidationBubbleUp);

# ---------------- Dashboard and alerts ----------------
AddLabel(yes, "BUILD: v0.6.0 CLEAN", Color.BLACK);
AddLabel(showDashboard, "TREND: " + (if macroState == 1 then "LONG" else if macroState == -1 then "SHORT" else "NEUTRAL"), if macroState == 1 then Color.GREEN else if macroState == -1 then Color.RED else Color.GRAY);
AddLabel(showDashboard, "READY: " + (if readyLockedDir == 1 then "LONG " + AsText(macroLongScore) + "/6" else if readyLockedDir == -1 then "SHORT " + AsText(macroShortScore) + "/6" else "WAIT"), if readyLockedDir == 1 then Color.CYAN else if readyLockedDir == -1 then Color.MAGENTA else Color.GRAY);
AddLabel(showDashboard, "ENTRY: " + (if entryLongSignal then "LONG" else if entryShortSignal then "SHORT" else if planActive and planDir == 1 then "LONG PLAN" else if planActive and planDir == -1 then "SHORT PLAN" else "WAIT"), if entryLongSignal or (planActive and planDir == 1) then Color.GREEN else if entryShortSignal or (planActive and planDir == -1) then Color.RED else Color.GRAY);
AddLabel(showDashboard and planActive, "RISK PTS: " + AsText(Round(planRiskPoints, 2)) + " | TP1 " + AsText(Round(planRiskR * tp1RMultiple, 2)) + " | TP2 " + AsText(Round(planRiskR * tp2RMultiple, 2)), Color.BLACK);
AddLabel(showDashboard, "PSAR: " + (if planActive and planPSARStrong then "PLAN STRONG" else if currentPSARLongStrong then "LONG STRONG" else if currentPSARShortStrong then "SHORT STRONG" else if psarLongOK then "LONG" else if psarShortOK then "SHORT" else "FLAT") + " | SLOPE " + AsText(Round(currentPSARSlopeATR, 2)), if (planActive and planPSARStrong) or currentPSARLongStrong then Color.GREEN else if currentPSARShortStrong then Color.RED else if psarLongOK then Color.CYAN else if psarShortOK then Color.MAGENTA else Color.GRAY);
AddLabel(showDashboard and planActive and planRunnerActive, "RUNNER: PSAR", Color.GREEN);

Alert(!muteAllAlerts and entryLongSignal, "v0.6.0 Macro Long", Alert.BAR, alertSoundUp);
Alert(!muteAllAlerts and entryShortSignal, "v0.6.0 Macro Short", Alert.BAR, alertSoundDown);
Alert(!muteAllAlerts and planStopHit, "v0.6.0 R stop", Alert.BAR, alertSoundExit);
Alert(!muteAllAlerts and planInvalidated, "v0.6.0 plan invalidated", Alert.BAR, alertSoundExit);
