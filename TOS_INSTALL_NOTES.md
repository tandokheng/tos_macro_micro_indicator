# Thinkorswim Install Notes

## Current Test Script

- File: `MacroMicro_Simplified_v0.5.13.ts`
- Import-ready file: `_dk_codex_macro_micro_v1.ts`
- Thinkorswim study to replace: `_dk_codex_macro_micro_v1`
- Primary chart for review: QQQ 5-minute, 20-day view

## What v0.5.13 Is Testing

- `BUILD: v0.5.13 SPAM DIAG` is always visible through `AddLabel(yes, ...)`; if that label is absent, TOS is not running this pasted build or study labels are hidden.
- `MARKER: NONE/L/S/BOTH` is always visible through `AddLabel(yes, ...)`, and turns red if the dashboard trigger contract says a marker should exist but the marker state is false.
- `CONTRACT: OK/FAIL TRIGGER/MARKER` is always visible. If it fails, screenshot that bar because the trigger label and marker path disagree.
- `RAW: SETUP L/S/- | CONT L/S/-` is always visible. It shows whether raw setup-ready or continuation-pressure logic is firing even if the clean trigger is not.
- A cyan `v0.5.13 TEST` bubble and `BuildProofDotV0513` point appear on the last loaded bar to prove the bubble/point drawing paths are active independent of signal logic.
- Hardwired `SPAM L` / `SPAM S` bubbles and the known-visible arrow plots now fire from raw setup/continuation pressure. This is intentionally noisy for diagnostics.
- Compact `L` / `S` marker bubbles are hardwired to the marker state, not controlled by a new input. This avoids TOS preserving or remapping old saved input values and silently turning the marker off.
- Fresh dot fallback plots, `MarkerLongDotV0511` and `MarkerShortDotV0511`, paint magenta/cyan points from the same marker state without using arrow painting.
- Compact `L` / `S` marker bubbles remain the primary visible signal marker because they use the chart-bubble path that already rendered reliably in Thinkorswim.
- Plot arrows are still present as secondary diagnostics, but do not depend on them as the only proof that a signal exists.
- Real entries use `realLongEntry` / `realShortEntry`, which combine the strict entry-state path with practical setup-edge, fast-flip, and continuation-edge arrows.
- Setup-ready states now feed `visibleLongSignal` / `visibleShortSignal` as visual markers only, so strong 5/6 or 6/6 states can appear on scrollback without repeatedly resetting entry price, ATR, target, or stop tracking.
- Continuation-anchor states also feed `visibleLongSignal` / `visibleShortSignal`, so `NEXT: CONTINUE S/L` can paint markers without resetting trade tracking.
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
- If `BUILD: v0.5.13 SPAM DIAG` appears, the correct build is active. If `RAW` shows setup/continuation pressure but no spam bubble/arrow appears, the remaining issue is TOS display/style/rendering rather than signal logic.
- v0.5.13 is not the final clean trading view. It is a diagnostic checkpoint to recreate the useful v0.5.6 spam proof without letting setup pulses reset PT/SL every bar.

## Current Manual Test Flow

- Paste `_dk_codex_macro_micro_v1.ts` into the Thinkorswim study `_dk_codex_macro_micro_v1`.
- Confirm the header shows `# Version: v0.5.13` in the pasted source.
- Confirm the chart labels show `BUILD: v0.5.13 SPAM DIAG`, `CONTRACT: OK` or `FAIL TRIGGER/MARKER`, and `RAW: ...`.
- Review QQQ 5m first; defer 15m validation until 5m behavior is acceptable.
