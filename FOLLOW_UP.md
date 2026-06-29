# Follow Up

## High Leverage

- FU-001 - Replace `_dk_codex_macro_micro_v1` with `MacroMicro_Simplified_v0.5.42.ts` in Thinkorswim and confirm it compiles with `BUILD: v0.5.42 RISK SPACE`.
- FU-002 - Capture one screenshot where `R-TP` / `R-SL` bubbles no longer cover the magenta/cyan arrow body, especially around the old overlap examples.

## Easy To Complete

- FU-003 - Confirm each visible magenta/cyan review arrow gets review-only `R-TP` and `R-SL` context without changing the real PT/SL bubbles.
- FU-004 - Check whether review `R-TP` at 2.0 ATR still feels too conservative in clean trends; note if 2.5 ATR should be tested.
- FU-005 - If the chart feels cluttered, first set `showReviewTargetStopBubbles = no` while leaving `showReviewTargetStopLines = yes`.
