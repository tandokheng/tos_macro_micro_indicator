# Thinkorswim Install Notes

## Current Test Script

- File: `MacroMicro_Simplified_v0.5.20.ts`
- Import-ready file: `_dk_codex_macro_micro_v1.ts`
- Thinkorswim study to replace: `_dk_codex_macro_micro_v1`
- Primary chart for review: QQQ 5-minute, 20-day view

## What v0.5.20 Is Testing

- `BUILD: v0.5.20 CLEAN ARROWS` is always visible through a static `AddLabel(yes, ...)`; if absent, TOS is not running this pasted build or study labels are hidden.
- v0.5.14 proved raw setup pressure can render, but it did so with intentionally noisy `SPAM L/S` bubbles. v0.5.15 removed those hardwired spam bubbles.
- v0.5.19 proved the real missing-arrow issue was Thinkorswim arrow plot rendering/style state, not raw setup gating.
- The working arrow primitive is now documented: fresh dedicated plot name, direct condition, `low/high +/- off`, `ARROW_UP/DOWN`, `AssignValueColor`, and line weight 5.
- v0.5.20 keeps fresh dedicated `RawSetupLongArrowV0520` / `RawSetupShortArrowV0520` plots default-on through `showRawSetupArrows = yes`.
- Direct `RAW L/S` proof bubbles remain available but default off through `showRawProofBubbles = no`, because arrows are now the cleaner review path.
- Compact `L/S` markers still render for comparison, but they now use a closer candle offset so TOS is less likely to clip them off-scale.
- `RAW SETUP: L/S/-` and `RAW CONT: L/S/-` remain visible through static labels so screenshots still show whether the source logic is firing.
- `MARKER: NONE/L/S/BOTH` and `CONTRACT: OK/FAIL TRIGGER/MARKER` remain visible. Capture a screenshot if the contract fails.
- A cyan `v0.5.20 TEST` bubble and `BuildProofDotV0513` point remain on the last loaded bar to prove the chart-bubble/point drawing paths are active independent of signal logic.
- Real trade entries and PT/SL tracking still use `realLongEntry` / `realShortEntry`; visual setup markers do not reset entry price, ATR, target, or stop.
- RVOL remains a `CAUTION` source for qualified setups, not a hard blocker by itself.

## Current Manual Test Flow

- Paste `_dk_codex_macro_micro_v1.ts` into the Thinkorswim study `_dk_codex_macro_micro_v1`.
- Confirm the pasted source header shows `# Version: v0.5.20`.
- Confirm the chart labels show `BUILD: v0.5.20 CLEAN ARROWS`, `RAW SETUP`, `RAW CONT`, and `CONTRACT: OK` or `FAIL TRIGGER/MARKER`.
- Confirm old `SPAM L` / `SPAM S` bubbles are gone.
- Confirm direct `RAW L` / `RAW S` proof bubbles are hidden by default.
- Confirm magenta/cyan raw setup arrows still appear on the QQQ 5m historical review area.
- Review QQQ 5m first; defer 15m validation until 5m marker behavior is acceptable.

## Codex Link Note

- In chat, use clickable file links with `C:/Users/tan_d/...`; the `/mnt/c/...` form does not open reliably in the side panel.

## Arrow Rendering Lesson

- When chart labels/bubbles prove a ThinkScript boolean is true but arrows are missing, do not keep loosening signal logic first.
- Thinkorswim can retain hidden/custom style state or behave poorly with inherited/multiplexed arrow plots.
- Use fresh dedicated arrow plot names and the simple working primitive: direct condition, `low/high +/- off`, `PaintingStrategy.ARROW_UP/DOWN`, `AssignValueColor`, and `SetLineWeight(5)`.
