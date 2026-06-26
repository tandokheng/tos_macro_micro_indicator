# Thinkorswim Install Notes

## Current Test Script

- File: `MacroMicro_Simplified_v0.5.8.ts`
- Import-ready file: `_dk_codex_macro_micro_v1.ts`
- Thinkorswim study to replace: `_dk_codex_macro_micro_v1`
- Primary chart for review: QQQ 5-minute, 20-day view

## What v0.5.8 Is Testing

- Real arrows use `realLongEntry` / `realShortEntry`, which combine the strict entry-state path with practical setup-edge arrows.
- `debugForceArrows` defaults to `no`; do not turn it back on unless specifically debugging plot visibility.
- Real entries now paint through the known-visible arrow plots: magenta up arrows from `DebugBigUpArrow` and cyan down arrows from `DebugBigArrow`.
- Real arrows use a closer `liveArrowOff` so they stay nearer to the candles; diagnostic debug arrows still use the larger offset.
- Normal signal bubbles default off for an arrows-first review. Turn `showSignalBubbles` back on only if you need scrollback text labels.
- Failsafe `SETUP L/S` bubbles remain available through `showFailsafeSignalBubbles`, but they default off because v0.5.6 proved they can overwhelm the chart.
- RVOL is treated as `CAUTION`, not a hard block, for qualified setups.
- Dashboard diagnostics now split into `BLOCKED BY`, `CAUTION BY`, and `NEXT`.
- Fast breakdown/breakout bars can produce `FLIP S/L` caution arrows before the slower 6-point bias fully flips.
- Active 4/6 trends can produce `CONT S/L` caution arrows when price keeps breaking in the bias direction but strict candle confirmation still says `NEXT: CANDLE`.
- Sustained 5/6 setups can produce `SETUP S/L` caution arrows every `setupPulseBars` bars; v0.5.8 defaults this to 5 bars as the middle ground.
- Profit target and stop tracking follow the practical real-entry layer.
- If there are still no arrows while `TRIGGER` shows `SETUP LONG` or `SETUP SHORT`, look for the failsafe `SETUP L/S` bubble. If neither arrow nor bubble appears, the dashboard may be reporting the latest loaded bar while the chart is scrolled elsewhere.

## Current Manual Test Flow

- Paste `_dk_codex_macro_micro_v1.ts` into the Thinkorswim study `_dk_codex_macro_micro_v1`.
- Confirm the header shows `# Version: v0.5.8` in the pasted source.
- Review QQQ 5m first; defer 15m validation until 5m behavior is acceptable.
