# Thinkorswim Install Notes

## Current Test Script

- File: `MacroMicro_Simplified_v0.5.6.ts`
- Import-ready file: `_dk_codex_macro_micro_v1.ts`
- Thinkorswim study to replace: `_dk_codex_macro_micro_v1`
- Primary chart for review: QQQ 5-minute, 20-day view

## What v0.5.6 Is Testing

- Real arrows use `realLongEntry` / `realShortEntry`, which combine the strict entry-state path with practical setup-edge arrows.
- `debugForceArrows` defaults to `no`; do not turn it back on unless specifically debugging plot visibility.
- Real entries now paint through the known-visible big arrow plots: magenta up arrows from `DebugBigUpArrow` and cyan down arrows from `DebugBigArrow`.
- Setup pulses also get short failsafe `SETUP L/S` bubbles through `showFailsafeSignalBubbles`, independent of the older signal-bubble input.
- RVOL is treated as `CAUTION`, not a hard block, for qualified setups.
- Dashboard diagnostics now split into `BLOCKED BY`, `CAUTION BY`, and `NEXT`.
- Fast breakdown/breakout bars can produce `FLIP S/L` caution arrows before the slower 6-point bias fully flips.
- Active 4/6 trends can produce `CONT S/L` caution arrows when price keeps breaking in the bias direction but strict candle confirmation still says `NEXT: CANDLE`.
- Sustained 5/6 setups can produce `SETUP S/L` caution arrows on every valid setup bar by default because `setupPulseBars = 1`.
- Profit target and stop tracking follow the practical real-entry layer.
- If there are still no arrows while `TRIGGER` shows `SETUP LONG` or `SETUP SHORT`, look for the failsafe `SETUP L/S` bubble. If neither arrow nor bubble appears, the dashboard may be reporting the latest loaded bar while the chart is scrolled elsewhere.

## Current Manual Test Flow

- Paste `_dk_codex_macro_micro_v1.ts` into the Thinkorswim study `_dk_codex_macro_micro_v1`.
- Confirm the header shows `# Version: v0.5.6` in the pasted source.
- Review QQQ 5m first; defer 15m validation until 5m behavior is acceptable.
