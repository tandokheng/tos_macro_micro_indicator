# Thinkorswim Install Notes

## Current Test Script

- File: `MacroMicro_Simplified_v0.5.45.ts`
- Import-ready file: `_dk_codex_macro_micro_v1.ts`
- Side-panel readable copy: `MacroMicro_Simplified_v0.5.45_READABLE.txt`
- Thinkorswim study to replace: `_dk_codex_macro_micro_v1`
- Primary chart for review: QQQ 5-minute regular session first; use `/NQ` or `/MNQ` as a separate extended-hours futures validation track

## What v0.5.45 Is Testing

- `BUILD: v0.5.45 QUIET DOTS` is always visible through a static `AddLabel(yes, ...)`; if absent, TOS is not running this pasted build or study labels are hidden.
- Compact magenta/cyan dots are 4/6 setup-coming warnings, not entries.
- v0.5.45 removes timeout-based setup-dot rearming. A fresh dot should appear only after both sides cool to neutral for several bars or after a real 5/6 trigger resolves the campaign.
- Review arrows remain the next-candle visual entry after a completed 5/6 trigger.
- Review-only `R-TP1`, `R-TP2`, and `R-SL` overlays remain visual context and do not feed the real trade engine.
- QQQ extended-hours screenshots can stress-test logic, but tune trade assumptions separately from `/NQ` or `/MNQ` futures.

## Current Manual Test Flow

- Paste `_dk_codex_macro_micro_v1.ts` into the Thinkorswim study `_dk_codex_macro_micro_v1`.
- Confirm the pasted source header shows `# Version: v0.5.45`.
- Confirm the chart labels show `BUILD: v0.5.45 QUIET DOTS`, `RAW SETUP`, `RAW CONT`, `DBG SET`, `DBG REV`, `DBG VIS`, `DBG CHOP`, `DBG CONT`, `DBG FAST`, `DBG STRUCT`, `DBG BOTH`, `DBG ESC`, `DBG MIX`, `DBG PROBE`, and `CONTRACT: OK` or `FAIL TRIGGER/MARKER`.
- Confirm old `SPAM L/S` bubbles are gone.
- Confirm green/red score-probe arrows are hidden by default.
- Confirm 4/6 setup-coming dots do not flip-flop repeatedly between sides during the same chop campaign.
- Confirm review arrows still get TP1/TP2/SL context without changing real `ENTRY`, `PT`, or `SL` tracking.
- Review QQQ regular-session 5m first if trading QQQ shares/options. Use `/NQ` or `/MNQ` as a separate 5m validation pass if trading futures outside regular stock-market hours. Defer 15m validation until 5m marker behavior is acceptable.

## Arrow Rendering Lesson

- If labels or bubbles prove a condition is true but arrows do not show, treat it as a Thinkorswim rendering/placement issue before changing the signal logic.
- Use value-based arrow plots at a price offset:

```thinkscript
plot LongSig = if trigLong then low - off else Double.NaN;
plot ShortSig = if trigShort then high + off else Double.NaN;
LongSig.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
ShortSig.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
LongSig.SetLineWeight(5);
ShortSig.SetLineWeight(5);
```

- Avoid `PaintingStrategy.BOOLEAN_ARROW` for these markers.
- Use fresh plot names if Thinkorswim appears to keep old hidden/custom plot styling.
