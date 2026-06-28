# Follow Up

## High Leverage

- FU-001 - Replace `_dk_codex_macro_micro_v1` with `MacroMicro_Simplified_v0.5.36.ts` in Thinkorswim and confirm it compiles.
- FU-002 - Capture one screenshot showing `BUILD: v0.5.36 CONT GUARD`, numeric `DBG REV`, `DBG CONT`, `DBG BOTH`, `DBG ESC`, `DBG MIX`, and lower `DBG VIS` in sideways/chop areas.

## Easy To Complete

- FU-003 - Confirm the dashboard shows `PROFILE: 5m` and `SETUP` displays as `4/6` instead of `4.00/6`.
- FU-004 - If large `L/S` marker bubbles still appear, check whether `showSignalBubbles` is saved on in the TOS study settings.
- FU-005 - If v0.5.36 feels too quiet in clear trends, lower `reviewContinuationBreakLookbackBars` from `5` to `4` for one screenshot before changing the review-arrow source gate.
