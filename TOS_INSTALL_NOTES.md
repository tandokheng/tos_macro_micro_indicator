# Thinkorswim Install Notes

## Current Test Script

- File: `MacroMicro_Simplified_v0.4.9.ts`
- Import-ready file: `_dk_codex_macro_micro_v1.ts`
- Thinkorswim study to replace: `_dk_codex_macro_micro_v1`
- Primary chart for review: QQQ 5-minute, 20-day view

## What v0.4.9 Is Testing

- Real arrows use `realLongEntry` / `realShortEntry`, which combine the strict entry-state path with practical setup-edge arrows.
- `debugForceArrows` defaults to `no`; do not turn it back on unless specifically debugging plot visibility.
- RVOL from `0.10` to `0.80` is treated as `CAUTION`, not a hard block.
- Profit target and stop tracking follow the practical real-entry layer.
- If there are still no arrows, capture the dashboard labels from that exact chart area.

## Current Manual Test Flow

- Paste `_dk_codex_macro_micro_v1.ts` into the Thinkorswim study `_dk_codex_macro_micro_v1`.
- Confirm the header shows `# Version: v0.4.9` in the pasted source.
- Review QQQ 5m first; defer 15m validation until 5m behavior is acceptable.
