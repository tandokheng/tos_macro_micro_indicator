# ============================================================
#  LRC + EMA(8/17) + PSAR + VWAP + Supertrend
#  + Smart EXIT + ATR TP + Micro Engine + Confluence
#  + ENTRY BUBBLES (Macro + TR/MC)
#  + Early TP with % + Full Dashboard Restored
#  + Neutral Trend Mode (Macro-Neutral Grind Up/Down)
# Version: original-nonrepaint-v1
# Non-repaint contract: visible signals use completed candles and print on the next bar.
# ============================================================

declare upper;

input price = close;
input emaFastLen = 8;
input emaSlowLen = 17;
input oncePerFlip = yes;
input offsetTicks = 8;
input minSlopeTicks = 0.25;

input atrLength = 14;
input atrTargetFactor = 1.5;
input emaDistanceATRFactor = 0.5;

input stATRLength = 10;
input stMultiplier = 3.0;

input muteAllAlerts = no;
input alertSoundUp = Sound.Bell;
input alertSoundDown = Sound.Bell;
input alertSoundExit = Sound.Ding;

input useVWAPFilter = no;

input volumeMALength = 14;
input minVolMultForArrows = 1.30;
input volBiasLen = 5;

input useValueAreaProxy = yes;
input vaStdLen = 50;
input vaMultiplier = 1.0;

input lrcLength = 38;

input microLength = 50;
input microMultiplier = 1.5;
input emaLengthBuy = 5;
input emaLengthSell = 13;
input volChangePctThresholdUp = 100.0;
input volChangePctThresholdDown = 100.0;

input sensitivity = {default Normal, Loose, Tight};
input showDashboard = yes;

input adxLength = 14;
input neutralSlopeTicks = 1.0;   # slope threshold in ticks for neutral trend
input neutralBars = 3;           # bars since last macro entry for neutral trend

def tick = TickSize();
def off  = offsetTicks * tick;
def minSlope = minSlopeTicks * tick;
def useClosedSignals = yes;

# ---------------- Utility: BarsSinceTrue ----------------
script BarsSinceTrue {
    input condition = no;
    def count = if condition then 0 else if IsNaN(count[1]) then 0 else count[1] + 1;
    plot barsSince = count;
}

# ---------------- LRC ----------------
def lrcLine = Inertia(price, lrcLength);
def lrcSlope = lrcLine - lrcLine[1];
def lrcUp = lrcSlope > 0;
def lrcDown = lrcSlope < 0;

# ---------------- EMA ----------------
def emaFast = ExpAverage(price, emaFastLen);
def emaSlow = ExpAverage(price, emaSlowLen);

plot EMA8  = emaFast;
plot EMA17 = emaSlow;
EMA8.Hide();
EMA17.Hide();

# ---------------- VWAP ----------------
def vwap = reference VWAP("time frame" = "DAY");

# ---------------- PSAR ----------------
def psar = ParabolicSAR(0.02, 0.20);
def psarBull = close > psar;
def psarBear = close < psar;

# ---------------- EMA Slopes ----------------
def dFast = emaFast - emaFast[1];
def dSlow = emaSlow - emaSlow[1];
def emaFastUp   = dFast >  minSlope;
def emaFastDown = dFast < -minSlope;
def emaSlowUp   = dSlow >  minSlope;
def emaSlowDown = dSlow < -minSlope;

def allUp   = emaFastUp and emaSlowUp;
def allDown = emaFastDown and emaSlowDown;

# ---------------- Supertrend ----------------
def newSession = GetDay() <> GetDay()[1];
def atrST = Average(TrueRange(high, close, low), stATRLength);
def basicUpper = (high + low) / 2 + stMultiplier * atrST;
def basicLower = (high + low) / 2 - stMultiplier * atrST;

def finalUpper =
    if newSession or basicUpper < finalUpper[1] or close[1] > finalUpper[1]
    then basicUpper else finalUpper[1];

def finalLower =
    if newSession or basicLower > finalLower[1] or close[1] < finalLower[1]
    then basicLower else finalLower[1];

def supertrend =
    if newSession then (high + low) / 2
    else if close > finalUpper[1] then finalLower
    else if close < finalLower[1] then finalUpper
    else if supertrend[1] == finalUpper[1] and close <= finalUpper then finalUpper
    else if supertrend[1] == finalUpper[1] and close >  finalUpper then finalLower
    else if supertrend[1] == finalLower[1] and close >= finalLower then finalLower
    else finalUpper;

# ---------------- ADX ----------------
def adx = ADX(adxLength);

# ---------------- Value Area Proxy ----------------
def pxStDev = StDev(close, vaStdLen);
def VAHpx   = vwap + vaMultiplier * pxStDev;
def VALpx   = vwap - vaMultiplier * pxStDev;

def VApassLong  = if useValueAreaProxy then close > VAHpx else 1;
def VApassShort = if useValueAreaProxy then close < VALpx else 1;

# ---------------- Volume ----------------
def vol = volume;
def avgVol50 = Average(vol, 50);
def arrowStrongVol = vol > minVolMultForArrows * avgVol50;

def volPower = (close - open) * vol;
def volBias  = Average(volPower, volBiasLen);
def buyPressure = volBias > 0;
def sellPressure = volBias < 0;

# ---------------- MICRO ----------------
def microEMA1 = ExpAverage(close, emaLengthBuy);
def microEMA2 = ExpAverage(close, emaLengthSell);
def microEMA8  = ExpAverage(close, 8);
def microEMA21 = ExpAverage(close, 21);

def microEMAConfirmUp   = microEMA8 > microEMA21;
def microEMAConfirmDown = microEMA8 < microEMA21;

def microCrossoverUp   = microEMA1 crosses above microEMA2;
def microCrossoverDown = microEMA1 crosses below microEMA2;

def microRelVol = volume / avgVol50;
def microVolChangePct = (microRelVol - 1) * 100;

def microSpikeUp   = microVolChangePct >= volChangePctThresholdUp;
def microSpikeDown = microVolChangePct >= volChangePctThresholdDown;

def microBull = close > open;
def microBear = close < open;

def microArrowUpRaw =
    (microSpikeUp and microBull and microEMAConfirmUp)
    or microCrossoverUp;

def microArrowDownRaw =
    (microSpikeDown and microBear and microEMAConfirmDown)
    or microCrossoverDown;

def microArrowUp =
    if sensitivity == sensitivity.Loose then microArrowUpRaw
    else if sensitivity == sensitivity.Tight then (microEMAConfirmUp and microCrossoverUp and microSpikeUp and microBull)
    else (microEMAConfirmUp and microCrossoverUp);

def microArrowDown =
    if sensitivity == sensitivity.Loose then microArrowDownRaw
    else if sensitivity == sensitivity.Tight then (microEMAConfirmDown and microCrossoverDown and microSpikeDown and microBear)
    else (microEMAConfirmDown and microCrossoverDown);

# ---------------- MACRO ENGINE ----------------
def upConfirmed =
    allUp and psarBull and close > supertrend and lrcUp and VApassLong;

def downConfirmed =
    allDown and psarBear and close < supertrend and lrcDown and VApassShort;

def upConfirmedClosed = upConfirmed[1];
def downConfirmedClosed = downConfirmed[1];

def state =
    if upConfirmedClosed then 1
    else if downConfirmedClosed then -1
    else 0;

def flipUp   = state == 1 and state[1] != 1;
def flipDown = state == -1 and state[1] != -1;

def fireUp = if oncePerFlip then flipUp else upConfirmedClosed and arrowStrongVol[1] and buyPressure[1];
def fireDown = if oncePerFlip then flipDown else downConfirmedClosed and arrowStrongVol[1] and sellPressure[1];

plot UpArrow = if fireUp then low - off else Double.NaN;
plot DownArrow = if fireDown then high + off else Double.NaN;
UpArrow.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
DownArrow.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
UpArrow.AssignValueColor(Color.GREEN);
DownArrow.AssignValueColor(Color.RED);
UpArrow.SetLineWeight(5);
DownArrow.SetLineWeight(5);

Alert(!muteAllAlerts and fireUp,   "Macro Up",   Alert.BAR, alertSoundUp);
Alert(!muteAllAlerts and fireDown, "Macro Down", Alert.BAR, alertSoundDown);

# ==========================================================
# NEW: NEUTRAL TREND MODE (Macro-Neutral Grind Up/Down)
#       - Long + Short
#       - Treated as REAL entries
#       - Own arrows + bubbles
# ==========================================================

def macroNeutral = (state == 0);
def lrcSlopeTicks = lrcSlope / tick;
def barsSinceMacroSignal = BarsSinceTrue(fireUp or fireDown);

def neutralTrendLongRaw =
    macroNeutral and
    close > supertrend and
    emaFast > emaSlow and
    close > vwap and
    adx < 20 and
    lrcSlopeTicks > neutralSlopeTicks and
    barsSinceMacroSignal > neutralBars;

def neutralTrendShortRaw =
    macroNeutral and
    close < supertrend and
    emaFast < emaSlow and
    close < vwap and
    adx < 20 and
    lrcSlopeTicks < -neutralSlopeTicks and
    barsSinceMacroSignal > neutralBars;

def fireNeutralLong = neutralTrendLongRaw[1];
def fireNeutralShort = neutralTrendShortRaw[1];

# Combined real entry signals (Macro + Neutral)
def FireAnyLong  = fireUp or fireNeutralLong;
def FireAnyShort = fireDown or fireNeutralShort;

# Neutral arrows
plot NeutralUpArrow =
    if fireNeutralLong then low - off * 1.3 else Double.NaN;
NeutralUpArrow.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
NeutralUpArrow.AssignValueColor(Color.CYAN);
NeutralUpArrow.SetLineWeight(5);

plot NeutralDownArrow =
    if fireNeutralShort then high + off * 1.3 else Double.NaN;
NeutralDownArrow.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
NeutralDownArrow.AssignValueColor(Color.ORANGE);
NeutralDownArrow.SetLineWeight(5);

# Neutral bubbles
AddChartBubble(
    fireNeutralLong,
    low - off * 1.6,
    "NEUTRAL LONG",
    Color.CYAN,
    no
);

AddChartBubble(
    fireNeutralShort,
    high + off * 1.6,
    "NEUTRAL SHORT",
    Color.ORANGE,
    yes
);

Alert(!muteAllAlerts and fireNeutralLong,
      "Neutral Trend LONG",
      Alert.BAR, Sound.Ding);

Alert(!muteAllAlerts and fireNeutralShort,
      "Neutral Trend SHORT",
      Alert.BAR, Sound.Ding);

# ---------------- ENTRY PRICE TRACKER (UPDATED: Macro + Neutral) ----------------
def entryPrice = CompoundValue(
    1,
    if FireAnyLong then open
    else if FireAnyShort then open
    else entryPrice[1],
    close
);

# ---------------- TAKE PROFIT ----------------
def atr = Average(TrueRange(high, close, low), atrLength);
def moveFromEntry = AbsValue(close - entryPrice);

def slopeWeakLong  = state[1] == 1 and dFast < dFast[1];
def slopeWeakShort = state[1] == -1 and dFast > dFast[1];

def targetReached = moveFromEntry >= atr * atrTargetFactor;

def tpCandidateRaw =
    (state[1] == 1 and targetReached and slopeWeakLong)
    or
    (state[1] == -1 and targetReached and slopeWeakShort);
def tpCandidate = tpCandidateRaw[1];

def tpSeen = CompoundValue(
    1,
    if FireAnyLong or FireAnyShort then 0
    else if tpCandidate and tpSeen[1] == 0 then 1
    else tpSeen[1],
    0
);

def newTP = tpCandidate and tpSeen[1] == 0;

AddChartBubble(
    newTP and state[1] == 1,
    high + off * 1.2,
    "TAKE PROFIT",
    Color.YELLOW,
    yes
);
AddChartBubble(
    newTP and state[1] == -1,
    low - off * 1.2,
    "TAKE PROFIT",
    Color.YELLOW,
    no
);

# ---------------- EARLY TP (% only) ----------------
def lrcMicro = Inertia(price, 10);
def lrcMicroSlope = lrcMicro - lrcMicro[1];
def lrcMicroDown = lrcMicroSlope < 0;
def lrcMicroUp   = lrcMicroSlope > 0;

def emaFastWeakLong  = emaFast < emaFast[1] and emaFast[1] > emaFast[2];
def emaFastWeakShort = emaFast > emaFast[1] and emaFast[1] < emaFast[2];
def weakVolPostEntry = volume < avgVol50 * 0.75;

def earlyTP_long_raw =
    state[1] == 1 and (emaFastWeakLong or lrcMicroDown or weakVolPostEntry);
def earlyTP_long_cond = earlyTP_long_raw[1];

def earlyTP_short_raw =
    state[1] == -1 and (emaFastWeakShort or lrcMicroUp or weakVolPostEntry);
def earlyTP_short_cond = earlyTP_short_raw[1];

def earlyTPSeen =
    CompoundValue(
        1,
        if FireAnyLong or FireAnyShort then 0
        else if (earlyTP_long_cond or earlyTP_short_cond) and earlyTPSeen[1] == 0 then 1
        else earlyTPSeen[1],
        0
    );

def newEarlyTP_long  = earlyTP_long_cond  and earlyTPSeen[1] == 0;
def newEarlyTP_short = earlyTP_short_cond and earlyTPSeen[1] == 0;

def earlyTP_rawPct = (moveFromEntry / (atr * atrTargetFactor)) * 100;
def earlyTP_pct_clamped =
    if earlyTP_rawPct > 100 then 100
    else if earlyTP_rawPct < 0 then 0
    else earlyTP_rawPct;

AddChartBubble(
    newEarlyTP_long,
    high + off,
    "EARLY TP (" + AsText(Round(earlyTP_pct_clamped, 0)) + "%)",
    Color.YELLOW,
    yes
);
AddChartBubble(
    newEarlyTP_short,
    low - off,
    "EARLY TP (" + AsText(Round(earlyTP_pct_clamped, 0)) + "%)",
    Color.YELLOW,
    no
);

Alert(!muteAllAlerts and newEarlyTP_long,
      "Early TP LONG " + AsText(Round(earlyTP_pct_clamped, 0)) + "%",
      Alert.BAR, Sound.Ding);
Alert(!muteAllAlerts and newEarlyTP_short,
      "Early TP SHORT " + AsText(Round(earlyTP_pct_clamped, 0)) + "%",
      Alert.BAR, Sound.Ding);

# ---------------- CONFLUENCE ENGINE ----------------
def confLongRaw  = upConfirmed and microArrowUp;
def confShortRaw = downConfirmed and microArrowDown;
def confLongSignal = confLongRaw[1];
def confShortSignal = confShortRaw[1];

def confTrendState =
    if confLongSignal then 1
    else if confShortSignal then -1
    else 0;

plot ConfluenceUpArrow =
    if confLongSignal then low - off * 2 else Double.NaN;
plot ConfluenceDownArrow =
    if confShortSignal then high + off * 2 else Double.NaN;
ConfluenceUpArrow.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
ConfluenceDownArrow.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
ConfluenceUpArrow.AssignValueColor(Color.CYAN);
ConfluenceDownArrow.AssignValueColor(Color.ORANGE);
ConfluenceUpArrow.SetLineWeight(5);
ConfluenceDownArrow.SetLineWeight(5);

Alert(!muteAllAlerts and confLongSignal,  "Confluence LONG",  Alert.BAR, alertSoundUp);
Alert(!muteAllAlerts and confShortSignal, "Confluence SHORT", Alert.BAR, alertSoundDown);

# ==========================================================
#      MACRO ENTRY CONFIRMATION: Trend Rejection + Momentum
# ==========================================================

# Momentum candle
def trBody = TrueRange(high, close, low);
def avgTR20 = Average(trBody, 20);
def bigCandle = trBody > avgTR20 * 1.2;
def strongCloseLong  = close >= high - trBody * 0.25;
def strongCloseShort = close <= low  + trBody * 0.25;

def momentumLong  = bigCandle and strongCloseLong;
def momentumShort = bigCandle and strongCloseShort;
def momentumLongSignal = momentumLong[1];
def momentumShortSignal = momentumShort[1];

# Trend rejection (EMA8)
def trendRejectionLong  = low <= emaFast and close > emaFast;
def trendRejectionShort = high >= emaFast and close < emaFast;
def trendRejectionLongSignal = trendRejectionLong[1];
def trendRejectionShortSignal = trendRejectionShort[1];

# Combined
def entryLong_TR   = fireUp and trendRejectionLongSignal  and !momentumLongSignal;
def entryLong_MC   = fireUp and momentumLongSignal        and !trendRejectionLongSignal;
def entryLong_Both = fireUp and trendRejectionLongSignal  and momentumLongSignal;

def entryShort_TR   = fireDown and trendRejectionShortSignal and !momentumShortSignal;
def entryShort_MC   = fireDown and momentumShortSignal       and !trendRejectionShortSignal;
def entryShort_Both = fireDown and trendRejectionShortSignal and momentumShortSignal;

# ---------- ENTRY BUBBLES (Macro + TR/MC only) ----------
# Bubbles aligned with arrow height, moved LEFT by one candle

# LONG entries
AddChartBubble(
    entryLong_Both,
    low[1] - off,
    "ENTRY LONG (TR+MC)",
    Color.GREEN,
    no
);

AddChartBubble(
    entryLong_TR,
    low[1] - off,
    "ENTRY LONG (TR)",
    Color.GREEN,
    no
);

AddChartBubble(
    entryLong_MC,
    low[1] - off,
    "ENTRY LONG (MC)",
    Color.GREEN,
    no
);

# SHORT entries
AddChartBubble(
    entryShort_Both,
    high[1] + off,
    "ENTRY SHORT (TR+MC)",
    Color.RED,
    yes
);

AddChartBubble(
    entryShort_TR,
    high[1] + off,
    "ENTRY SHORT (TR)",
    Color.RED,
    yes
);

AddChartBubble(
    entryShort_MC,
    high[1] + off,
    "ENTRY SHORT (MC)",
    Color.RED,
    yes
);

# ==========================================================
#                        DASHBOARD
# ==========================================================

def dashOK = showDashboard;

AddLabel(yes, "BUILD: ORIGINAL NR v1", Color.BLACK);

AddLabel(
    dashOK,
    "TREND: " +
        (if state == 1 then "UP" else if state == -1 then "DOWN" else "NEUTRAL"),
    if state == 1 then Color.GREEN else if state == -1 then Color.RED else Color.GRAY
);

AddLabel(
    dashOK,
    "CONF: " +
        (if confTrendState == 1 then "LONG"
         else if confTrendState == -1 then "SHORT"
         else "NEUTRAL"),
    if confTrendState == 1 then Color.GREEN else if confTrendState == -1 then Color.RED else Color.GRAY
);

AddLabel(
    dashOK,
    "MICRO: " +
        (if microArrowUp then "UP"
         else if microArrowDown then "DOWN"
         else "NEUTRAL"),
    if microArrowUp then Color.GREEN else if microArrowDown then Color.RED else Color.GRAY
);

AddLabel(
    dashOK,
    "MACRO: " +
        (if state == 1 then "UP" else if state == -1 then "DOWN" else "NEUTRAL"),
    if state == 1 then Color.GREEN else if state == -1 then Color.RED else Color.GRAY
);

AddLabel(
    dashOK,
    "NEUTRAL TREND: " +
        (if fireNeutralLong then "LONG"
         else if fireNeutralShort then "SHORT"
         else "-"),
    if fireNeutralLong then Color.CYAN else if fireNeutralShort then Color.ORANGE else Color.GRAY
);

AddLabel(
    dashOK,
    "LRC: " +
        (if lrcUp then "↑" else if lrcDown then "↓" else "→"),
    if lrcUp then Color.GREEN else if lrcDown then Color.RED else Color.GRAY
);

AddLabel(
    dashOK,
    "EMA8: " + (if emaFast > emaFast[1] then "↑" else "↓"),
    if emaFast > emaFast[1] then Color.GREEN else Color.RED
);

AddLabel(
    dashOK,
    "EMA17: " + (if emaSlow > emaSlow[1] then "↑" else "↓"),
    if emaSlow > emaSlow[1] then Color.GREEN else Color.RED
);

AddLabel(
    dashOK,
    "PSAR: " + (if psarBull then "↑" else "↓"),
    if psarBull then Color.GREEN else Color.RED
);

AddLabel(
    dashOK,
    "ST: " + (if close > supertrend then "↑" else "↓"),
    if close > supertrend then Color.GREEN else Color.RED
);

AddLabel(dashOK, "Entry Δ: " + AsText(Round(moveFromEntry, 2)), Color.BLACK);
AddLabel(dashOK, "ATR: " + AsText(Round(atr, 2)), Color.BLACK);
