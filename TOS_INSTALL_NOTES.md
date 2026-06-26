# Thinkorswim Install Notes

## Current Test Script

- File: `MacroMicro_Simplified_v0.5.10.ts`
- Import-ready file: `_dk_codex_macro_micro_v1.ts`
- Thinkorswim study to replace: `_dk_codex_macro_micro_v1`
- Primary chart for review: QQQ 5-minute, 20-day view

## What v0.5.10 Is Testing

- Compact `L` / `S` marker bubbles are now the primary visible signal marker because they use the chart-bubble path that already rendered reliably in Thinkorswim.
- Plot arrows are still present as secondary diagnostics, but do not depend on them as the only proof that a signal exists.
- Real entries use `realLongEntry` / `realShortEntry`, which combine the strict entry-state path with practical setup-edge, fast-flip, and continuation-edge arrows.
- Setup-ready states now feed `visibleLongSignal` / `visibleShortSignal` as visual markers only, so strong 5/6 or 6/6 states can appear on scrollback without repeatedly resetting entry price, ATR, target, or stop tracking.
- Continuation-anchor states also feed `visibleLongSignal` / `visibleShortSignal`, so `NEXT: CONTINUE S/L` can paint markers without resetting trade tracking.
- `showArrowMarkerBubbles` defaults to `yes`; this is separate from verbose `showSignalBubbles`.
- `debugForceArrows` defaults to `no`; do not turn it back on unless specifically debugging plot visibility.
- Real entries now paint through the known-visible arrow plots: magenta up arrows from `DebugBigUpArrow` and cyan down arrows from `DebugBigArrow`.
- Real arrows use a closer `liveArrowOff` so they stay nearer to the candles; diagnostic debug arrows still use the larger offset.
- Normal signal bubbles default off for an arrows-first review. Turn `showSignalBubbles` back on only if you need scrollback text labels.
- Failsafe `SETUP L/S` bubbles remain available through `showFailsafeSignalBubbles`, but they default off because v0.5.6 proved they can overwhelm the chart.
- RVOL is treated as `CAUTION`, not a hard block, for qualified setups.
- Dashboard diagnostics now split into `BLOCKED BY`, `CAUTION BY`, and `NEXT`.
- Fast breakdown/breakout bars can produce `FLIP S/L` caution arrows before the slower 6-point bias fully flips.
- Active 4/6 trends can produce `CONT S/L` caution arrows when price keeps breaking in the bias direction but strict candle confirmation still says `NEXT: CANDLE`.
- Sustained 5/6 setups can produce compact `S` / `L` marker bubbles while they remain setup-ready; the older setup pulse is now visual diagnostics, not a trade-state reset.
- Profit target and stop tracking follow the practical real-entry layer.
- If there are still no plot arrows, look for compact cyan `S` or magenta `L` marker bubbles. If marker bubbles appear but plot arrows do not, this is a TOS plot/style/rendering issue rather than missing signal logic.

## Current Manual Test Flow

- Paste `_dk_codex_macro_micro_v1.ts` into the Thinkorswim study `_dk_codex_macro_micro_v1`.
- Confirm the header shows `# Version: v0.5.10` in the pasted source.
- Review QQQ 5m first; defer 15m validation until 5m behavior is acceptable.
