# Follow Up

## High Leverage

- FU-001 - Replace `_dk_codex_macro_micro_v1` with `MacroMicro_Simplified_v0.5.40.ts` in Thinkorswim and confirm it compiles.
- FU-002 - Capture one screenshot showing `BUILD: v0.5.40 FLIP GUARD`, numeric `DBG REV`, `DBG VIS`, and `DBG FLIP` in a sideways/chop area where v0.5.39 still alternated arrows.

## Easy To Complete

- FU-003 - Confirm the dashboard shows `PROFILE: 5m` and `SETUP` displays as `4/6` instead of `4.00/6`.
- FU-004 - If large `L/S` marker bubbles still appear, check whether `showSignalBubbles` is saved on in the TOS study settings.
- FU-005 - If v0.5.40 feels too quiet in clean trends, lower `minPressureConflictEscapeTrendEfficiency` from `0.55` to `0.50` for one screenshot before changing the working arrow renderer.
