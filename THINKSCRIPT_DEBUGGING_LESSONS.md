# ThinkScript Debugging Lessons

These are project rules for debugging Thinkorswim studies when Codex or Claude cannot run thinkScript directly and must rely on screenshots plus static review.

## Instrument First

- Add on-chart state readouts while developing; do not infer everything from whether an arrow or bubble rendered.
- Prefer explicit labels for source booleans and contracts, such as `RAW SETUP`, `RAW CONT`, `TRIGGER`, `MARKER`, and `CONTRACT`.
- If a study shows nothing at all, ask the human to read the error line at the bottom of the ThinkScript editor. Compile errors usually do not appear on the chart.

## Time Windows

- A same-day time window uses `afterStart and beforeEnd`.
- Use `afterStart or beforeEnd` only when the window crosses midnight.
- A wrong same-day `or` window can be true almost all day, preventing session-edge resets and breaking running high/low logic.

Example:

```thinkscript
def afterStart = SecondsFromTime(startTime) >= 0;
def beforeEnd = SecondsTillTime(endTime) > 0;
def inWindow =
    if startTime < endTime
    then afterStart and beforeEnd
    else afterStart or beforeEnd;
```

## Signal Markers

- Use value-based arrow plots at a price offset, not `PaintingStrategy.BOOLEAN_ARROW`.
- `BOOLEAN_ARROW` can render faintly and can be obscured by bubbles on the same bar.
- If a bubble renders from a condition but an arrow from the same condition does not, treat it as rendering/placement/style state, not as a signal-gate failure.
- After arrow visibility is proven, tune the signal gate separately. Raw setup cadence can spam the chart, while entry-only gates can make arrows disappear. Prefer first-edge or quality-upgrade review signals before changing trade-tracking entries.
- Market status does not suppress historical ThinkScript plots. If the market is closed and the build/test bubble renders but past arrows are missing, inspect sustained historical signal gates rather than assuming the chart is inactive.
- If the working arrow primitive has already been proven and a later build shows zero arrows after scrollback, instrument the source and review gates before loosening rules. Track recent setup counts, review counts, and probe counts so a screenshot can separate "setup source absent" from "review gate too strict."
- If a debug count label shows `NaN`, treat the upstream boolean as unsafe, not merely false. Sanitize visual-layer booleans into 0/1 flags before using them in `Sum(...)`, `HighestAll(...)`, negation gates like `!reviewSignal`, or arrow plots.
- Once arrows are proven stable, remove or gate proof bubbles. Hardwired compact `L/S` bubbles are useful diagnostics, but they can hide the cleaner arrow layer during review.
- Keep diagnostic counts separate from visual toggles once a probe layer is proven. A default-off arrow toggle such as `showScoreProbeArrows` should not also zero the `DBG PROBE` count if that count is needed to explain whether the source cadence exists.
- After arrow rendering and NaN-safe counts are proven, treat excessive arrows as review-gate tuning. Score-only 6/6 refreshes can still be noisy in chop; require directional follow-through or slow the refresh cadence before changing the rendering path again.
- If raw review counts are useful but plotted arrows remain noisy, throttle only the final visible-arrow layer. Keep `DBG REV` as the unthrottled source count and add a separate plotted count such as `DBG VIS` so tuning does not hide diagnostics.
- If arrows work in clear trends but remain noisy in chop, add a regime filter before the visible review layer rather than changing the arrow primitive. Keep a blocked-count label such as `DBG CHOP` so screenshots can prove whether the filter is active.
- If `DBG CHOP` is high but plotted arrows are still noisy, inspect alternate visible-arrow sources that bypass the filter. In v0.5.30, setup-review arrows were chop-filtered but real-entry review arrows and low-volume momentum bypasses could still paint; v0.5.31 gates those paths too.
- If `DBG CHOP` is high and arrows are still noisy after all visible sources pass the same chop gate, look for alternating long/short candidates. A mixed-direction lookback filter plus `DBG MIX` can suppress range flip-flops without touching the working arrow primitive.
- If `DBG MIX` is zero while alternating arrows remain, split mixed-conflict detection from mixed-conflict blocking. v0.5.33 adds `DBG BOTH` because v0.5.32 could detect a conflict but let continuation pressure auto-escape, leaving `DBG MIX` at zero.
- If `DBG BOTH` is nonzero but low while visible arrows still alternate, tune the mixed-conflict lookback before changing the renderer or source gate. v0.5.34 widens the lookback from 13 to 21 to match the slower visible chop cycle.
- If `DBG BOTH` rises but `DBG MIX` stays modest, the conflict is being detected but escaping. Add or inspect an escape counter such as `DBG ESC`; then tighten only the mixed-conflict escape thresholds before touching the proven arrow renderer. v0.5.35 keeps the broad conflict lookback and raises escape requirements to 0.45 trend efficiency and 3-point score separation.
- If `DBG CHOP`, `DBG BOTH`, and `DBG ESC` explain much of the chop but visible arrows still leak through, inspect continuation-pressure bypasses in the review gate. v0.5.36 keeps raw continuation diagnostics alive but requires review continuation arrows to break a wider 5-bar structure window with 2-point side dominance, and adds `DBG CONT` for blocked continuation pullbacks.
- If trend/reversal arrows work but chop still leaks after continuation bypasses are guarded, inspect raw fast-break bypasses next. v0.5.37 keeps raw fast breaks for the trading model but only lets them paint review arrows or escape mixed chop after a stronger review-only 5-bar break and 1.60 range proof, and adds `DBG FAST` for blocked raw fast-break pulses.
- If `DBG FAST` is nonzero but `DBG VIS` still shows chop arrows, inspect the normal efficient-score path. v0.5.38 requires that path to break local 5-bar structure before it can paint, and adds `DBG STRUCT` for score/efficiency candidates blocked because they lacked structure.
- Different screenshot locations are useful anti-overfitting evidence. Tune only when the same failure mode appears across multiple chart regions; do not overfit a single visible window.
- Keep setup-coming markers and entry arrows semantically separate. In v0.5.43, compact dots mean a 4/6 setup is approaching; magenta/cyan review arrows mean the next candle after a completed 5/6 trigger. Do not judge TP/SL from the dot bar.
- Setup-coming dots should be armed state, not raw 4/6 edge pulses. If long and short 4/6 scores alternate in chop, raw dots will flip-flop and imply conflicting readiness; v0.5.44 prints only the first side's dot until that side triggers, fails, gets overridden by an opposite 5/6 trigger, or times out.

Working primitive:

```thinkscript
plot LongSig = if trigLong then low - off else Double.NaN;
plot ShortSig = if trigShort then high + off else Double.NaN;
LongSig.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
ShortSig.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
LongSig.AssignValueColor(Color.GREEN);
ShortSig.AssignValueColor(Color.RED);
LongSig.SetLineWeight(5);
ShortSig.SetLineWeight(5);
```

## Recursive State

- Keep recursive/self-referential state simple and seeded on known bars.
- Avoid wrapping self-references in conditional expressions inside `Max()` / `Min()` calls; this can fail to compile and leave the chart blank.
- Prefer plain state updates split across readable `def` blocks.
- For self-referential throttles, keep the state update inside `CompoundValue` and avoid depending on a separate forward-referenced ready boolean inside the recursive expression.

Risky pattern:

```thinkscript
rec x = Max(if IsNaN(x[1]) then seed else x[1], high);
```

Safer pattern:

```thinkscript
rec x =
    if resetCondition then high
    else Max(x[1], high);
```

## Session Times

- Thinkorswim session times are interpreted in the chart timezone.
- Make important times inputs, document ET/SGT presets, and have the human confirm computed levels against hand-drawn levels.
- ET inputs are usually safer for US-market logic because they are DST-aware in the chart context.

## Version And Review

- Every study build needs a `# Version: vX.Y.Z` header plus a short changelog note.
- Always sync `_dk_codex_macro_micro_v1.ts` to the latest versioned file.
- Keep the active `.ts` paste file compact enough to open reliably in the Codex side panel. Put cumulative history in `VERSIONING.md`, not in the ThinkScript header.
- Re-read specifically for these traps before handing off: missing instrumentation, wrong same-day time-window `or`, `BOOLEAN_ARROW`, complex recursive self-references, and timezone assumptions.
- Use an independent review pass when the visual behavior cannot be executed locally.
