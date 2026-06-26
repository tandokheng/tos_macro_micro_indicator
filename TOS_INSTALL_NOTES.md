# Thinkorswim Install Notes

## Current Test Script

- File: `MacroMicro_Simplified_v0.5.1.ts`
- Import-ready file: `_dk_codex_macro_micro_v1.ts`
- Thinkorswim study to replace: `_dk_codex_macro_micro_v1`
- Primary chart for review: QQQ 5-minute, 20-day view

## What v0.5.1 Is Testing

- Real arrows use `realLongEntry` / `realShortEntry`, which combine the strict entry-state path with practical setup-edge arrows.
- `debugForceArrows` defaults to `no`; do not turn it back on unless specifically debugging plot visibility.
- RVOL is treated as `CAUTION`, not a hard block, for qualified setups.
- Dashboard diagnostics now split into `BLOCKED BY`, `CAUTION BY`, and `NEXT`.
- Profit target and stop tracking follow the practical real-entry layer.
- If there are still no arrows, capture the dashboard labels from that exact chart area.

## Current Manual Test Flow

- Paste `_dk_codex_macro_micro_v1.ts` into the Thinkorswim study `_dk_codex_macro_micro_v1`.
- Confirm the header shows `# Version: v0.5.1` in the pasted source.
- Review QQQ 5m first; defer 15m validation until 5m behavior is acceptable.
