# Thinkorswim Install Notes

## Current Test Script

- File: `MacroMicro_Simplified_v0.2.1.ts`
- Thinkorswim study to replace: `_dk_codex_macro_micro_v1`
- Primary chart for review: QQQ 5-minute, 20-day view

## What v0.2.1 Changes Visually

- First valid long/short leg shows `ENTRY L` or `ENTRY S`.
- Same-direction repeat signals show `ADD L` or `ADD S` instead of another plain entry arrow.
- Profit target and stop bubbles default to visible with `PT` and `SL`.
- Score breakdown from a strong active trade to 3/6 shows `DANGER L` or `DANGER S`.

## Current Automation Blocker

Computer Use can see the Thinkorswim chart, but cannot activate app windows right now. It returned `failed to activate captured window` for both Thinkorswim and Notepad after a helper reset. Because of that, the script was not pasted into Thinkorswim automatically in this run.
