# Backtesting Guardrails

These are rules for building any Python/Yahoo Finance backtest for this Thinkorswim indicator. The goal is not to produce an impressive number. The goal is to produce a number that has survived adversarial checks.

## Data Coverage

- Probe the data source before testing rules. Do not accept "data exists" as enough.
- For every test, print coverage: first bar, last bar, bar count, missing bars, skipped sessions, and whether extended-hours data is present.
- Yahoo/yfinance intraday data is limited and can be partial at the edges. Treat a 5-minute backtest as a recent-window directional read, not full validation.
- For QQQ 5m, verify whether the downloaded bars match the intended chart session. If extended hours are needed, explicitly request and report that mode.
- For overnight/futures setups, verify build window, entry window, and management tail separately. If equity ETF data lacks the required overnight bars, use a suitable futures symbol only after confirming coverage.

## Look-Ahead Bias

- A signal decided from bar `i` closes may enter no earlier than bar `i + 1` open.
- Snapshot stop, target, ATR, and setup state on the trigger bar before advancing state.
- A build window must not overlap the trade window that uses its levels.
- Any regime or external feature join must use the most recent value strictly before the decision timestamp.
- Treat unexpectedly strong results as a reason to re-audit for look-ahead.

## Fills And Trade Management

- Use pessimistic intrabar ordering: if stop and target are both touched inside one bar, count the stop first unless there is stronger evidence.
- If price gaps beyond the stop, fill at the bar open, not the stop level.
- Manage existing trades after the entry window ends until the true hard-flat time; do not truncate management to the entry window.
- Require risk to be strictly greater than zero before calculating `R`.
- Model gross and net results separately. Print commission, slippage, and the cost-to-risk derivation.

## Sessions And Timezones

- Use `zoneinfo` with `America/New_York` for US-market session logic. Do not hardcode fixed UTC offsets.
- Map each bar to an explicit session date.
- Drop empty weekend/holiday buckets instead of merging dates.
- Require near-complete build, entry, and management windows before accepting a session. Print skipped-session counts and reasons.

## Rule Transcription

- Port the ThinkScript rules literally first, then simplify only after comparing outputs.
- Keep one position at a time. The simulator must return the true exit bar so entry scanning can continue while new entries are blocked until the trade is closed.
- Evaluate long and short trigger booleans independently. If both trigger on the same bar, skip as ambiguous and count it.
- Skip over-max-stop or degenerate-risk signals as non-events; do not touch daily caps, re-entry flags, or position state.
- If using separate trigger and management bar lists, align by timestamp or assert matching timestamps at shared indices.

## Statistics

- Report wins, losses, scratches, target hits, stop hits, forced flats, and ambiguous skips separately.
- Report win rate on decided trades and target-hit rate separately.
- Print sample size and standard error. Flag any result below the action threshold, such as fewer than 50 trades.
- Treat forced-flat exits as continuous partial `R`, not target wins.
- For regime splits, restrict comparisons to overlapping coverage and label no-data buckets honestly.

## Verification

- Re-read for data coverage, look-ahead, fills, sessions, rule transcription, and stats before trusting a result.
- Use independent review passes for high-risk dimensions before using results for decisions.
- Reproduce any reported bug independently and confirm the direction of its effect before fixing.
- Every output should disclose data limits, assumptions, costs, and what is not modeled.
- Small backtests generate hypotheses and test the method. They do not replace forward, journaled validation.
