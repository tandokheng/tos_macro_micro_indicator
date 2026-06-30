# v0.6.0 Simplified Reset Design

## Goal

Reset the user-facing Thinkorswim indicator back toward the original script's accurate macro-confluence model while removing the excessive arrow families and diagnostic clutter that accumulated through v0.5.47.

## Approved Direction

Use the original full macro confluence for the main arrow:

- EMA 8/17 slope agreement
- PSAR side agreement
- Supertrend side agreement
- LRC slope agreement
- Optional VWAP/value-area context

Use a softer component score only for the ready dot. A ready dot means "conditions are aligning"; it is not an entry.

## User-Facing Contract

- One ready dot family: magenta/cyan points when macro components are close to alignment.
- One entry arrow family: green/red arrows only when full macro confluence flips into a new direction.
- One management layer: TP1, TP2, SL, invalidation, and PSAR runner context.
- One compact dashboard: build, trend, ready, entry, risk, and PSAR context.

## Removed From Default User Experience

- v0.5 debug labels and counters.
- Score-probe arrows.
- Raw setup labels.
- Multiple review/real signal engines.
- Repeated confluence, neutral, continuation, and failsafe arrow families.

## Kept From v0.5 Learnings

- Value-based arrow plots, not boolean-arrow plots.
- Next-candle entry planning from the completed trigger candle.
- R-based TP1/TP2/SL levels.
- One invalidation bubble.
- PSAR runner/gradient context.
- Import-ready `_dk_codex_macro_micro_v1.ts` always matching the latest versioned file.
