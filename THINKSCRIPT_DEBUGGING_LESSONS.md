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
