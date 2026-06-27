# Follow Up

## High Leverage

- FU-001 - Replace `_dk_codex_macro_micro_v1` with `MacroMicro_Simplified_v0.5.25.ts` in Thinkorswim and confirm it compiles.
- FU-002 - Capture one screenshot showing `BUILD: v0.5.25 NAN SAFE`, `DBG SET L200/S200`, `DBG REV L200/S200`, `DBG PROBE L/S`, and any visible magenta/cyan or green/red arrows.

## Easy To Complete

- FU-003 - Confirm the dashboard shows `PROFILE: 5m` and `SETUP` displays as `4/6` instead of `4.00/6`.
- FU-004 - If arrows are still absent, confirm whether `DBG REV` is numeric or still `NaN`; `NaN` would mean another unsafe boolean path remains.
- FU-005 - After 5-minute review, collect a smaller QQQ 15-minute sample for separate validation.
