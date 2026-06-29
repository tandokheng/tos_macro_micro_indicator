# TOS Macro/Micro Indicator Project Plan

## Goal

Build a cleaner Thinkorswim macro/micro intraday indicator that is practical for QQQ-style trading, starting with 5-minute entries and then validating whether the same logic can be tuned for 15-minute charts.

## Current Strategy

- Optimize the simplified 5-of-6 model on 5-minute charts first.
- Treat 15-minute tuning as the next validation pass, not as a simultaneous target.
- Keep the chart readable: armed 4/6 setup-coming dots, next-candle 5/6 review arrows, compact optional signal bubbles, optional target/stop bubbles, and review-only `R-TP1` / `R-TP2` / `R-SL` overlays with arrows spaced outside the risk bubbles when judging arrow quality.
- Use static verifier checks to catch accidental regressions in versioning, thresholds, arrow count, and old visual spam.
- If/when a Yahoo Finance Python backtest is built, follow `BACKTESTING_GUARDRAILS.md`: probe data coverage first, avoid look-ahead, use pessimistic fills, report costs/statistical uncertainty, and disclose limitations.

## Higher-Timeframe Context Hypothesis

Do not hard-gate 5-minute entries with daily or 4-hour context yet. For the next design pass, test 1-hour context first as a soft filter or dashboard state because it is close enough to intraday structure to help entries without muting most 5-minute signals.

Candidate hierarchy:

- 1-hour: best first candidate for entry context, likely soft gate or caution label.
- 4-hour: broader trend context, likely dashboard-only unless 1-hour testing proves too noisy.
- Daily: regime awareness only; avoid using it as a hard entry gate for 5-minute scalps/rebounds.

## Milestones

- Done: Create `MacroMicro_Simplified_v0.2.0.ts` with stronger RVOL gating, candle confirmation, cleaner target/stop display, and compact signal bubbles.
- Doing: Review/import `MacroMicro_Simplified_v0.5.44.ts`, a QQQ 5m armed-dot build where the first 4/6 side gets one setup-coming dot, opposite 4/6 chop is ignored until trigger/failure/timeout, arrows mean next-candle 5/6 trigger confirmation, and TP1/TP2/SL review overlays help judge follow-through.
- Todo: Build a separate Python/Yahoo Finance backtest only after agreeing on scope, using `BACKTESTING_GUARDRAILS.md` as the safety checklist.
- Todo: Decide whether a higher-timeframe context filter improves 5-minute entries.
- Todo: Validate/tune the indicator on QQQ 15-minute charts after 5-minute behavior is acceptable.
