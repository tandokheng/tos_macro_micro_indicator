# Next Tasks

## Doing

- Install `MacroMicro_Simplified_v0.5.18.ts` into Thinkorswim study `_dk_codex_macro_micro_v1` and confirm every screenshot shows `BUILD: v0.5.18 RAW THIN`, `RAW SETUP`, `RAW CONT`, and fewer direct `RAW L/S` proof bubbles than v0.5.17.

## Todo

- If v0.5.18 does not show `BUILD: v0.5.18 RAW THIN`, remove duplicate/old `_dk_codex_macro_micro_v1` studies and re-add the pasted source once.
- Confirm old `SPAM L/S` bubbles are gone; v0.5.18 should still show direct `RAW L/S` bubbles, but on a slower proof cadence.
- If `RAW SETUP` stays active on the live bar but no direct `RAW L/S` proof bubble appears, capture that screenshot because it means the proven raw chart-bubble route regressed.
- If `CONTRACT: FAIL TRIGGER/MARKER` appears, capture that screenshot because it proves dashboard trigger and marker logic diverged on the same bar.
- Log 5 to 10 QQQ 5-minute examples where arrows were helpful, late, blocked correctly, or still noisy.
- Decide whether the first higher-timeframe context test should use 1-hour as a soft gate, caution state, or dashboard-only label.
- Run a separate QQQ 15-minute validation pass after the 5-minute setup is stable.
- Add static verifier checks for any higher-timeframe variables if they are introduced.

## Done

- Added `MacroMicro_Simplified_v0.2.0.ts`.
- Added `MacroMicro_Simplified_v0.2.1.ts` with entry/add/danger/PT-SL display refinements.
- Added `MacroMicro_Simplified_v0.3.4.ts` with explicit `declare upper;`, ready-entry fallback, and `WHY:` diagnostics after v0.3.3 still showed no arrows.
- Added `MacroMicro_Simplified_v0.3.5.ts` to relax 5m RVOL hard block from `0.60` to `0.35` and make `0.35-0.80` relative volume a CAUTION zone.
- Added `MacroMicro_Simplified_v0.3.6.ts` to allow 4/6 candle-confirmed CAUTION arrows, decouple micro score from volume pressure, and show integer setup scores.
- Added `MacroMicro_Simplified_v0.3.7.ts` to fix historical arrow starvation from candidate-edge cooldown resets, use same-side arrow refresh after 30 bars, and change bright yellow UI to amber.
- Added `MacroMicro_Simplified_v0.3.8.ts` with a visible default 5m profile, optional 15m timing profile, and same-side refresh that waits for the next valid candidate after the reset window.
- Added `MacroMicro_Simplified_v0.3.9.ts` to fix v0.3.8 ThinkScript forward-reference compile errors with a recursive entry-state model.
- Updated `tests/verify_simplified_indicator.ps1` for v0.3.9 static checks, including guards against the forward-reference bug.
- Added `MacroMicro_Simplified_v0.4.0.ts` with fast break confirmation for 5/6 TRADE OK impulse moves that were blocked by strict candle confirmation.
- Updated `tests/verify_simplified_indicator.ps1` for v0.4.0 fast-break static checks.
- Added `MacroMicro_Simplified_v0.4.1.ts` as a forced-arrow diagnostic build with magenta/cyan `TEST L/S` arrows and bubbles.
- Updated `tests/verify_simplified_indicator.ps1` for v0.4.1 debug-force checks.
- Added `MacroMicro_Simplified_v0.4.2.ts` so forced debug arrows ignore TRADE/RVOL and test plot visibility from score only.
- Updated `tests/verify_simplified_indicator.ps1` for v0.4.2 score-only forced-arrow checks.
- Added `MacroMicro_Simplified_v0.4.3.ts` with one always-on big cyan last-bar arrow and `BIG TEST ARROW` bubble.
- Updated `tests/verify_simplified_indicator.ps1` for v0.4.3 big-arrow diagnostic checks.
- Added `MacroMicro_Simplified_v0.4.4.ts` with fresh primary arrow plot names to avoid inherited hidden/custom settings from old TOS plot names.
- Updated `tests/verify_simplified_indicator.ps1` for v0.4.4 fresh-arrow-plot checks.
- Added `MacroMicro_Simplified_v0.4.5.ts` so score-forced shorts use the known-visible `DebugBigArrow` plot and forced debug bubbles ignore the normal signal-bubble toggle.
- Updated `tests/verify_simplified_indicator.ps1` for v0.4.5 forced-arrow render-path checks.
- Added `MacroMicro_Simplified_v0.4.6.ts` with a mirrored magenta `DebugBigUpArrow` for score-forced long visibility testing.
- Updated `tests/verify_simplified_indicator.ps1` for v0.4.6 mirrored long debug-arrow checks.
- Added `MacroMicro_Simplified_v0.4.7.ts` with forced-arrow debug defaulted off and real entry arrows separated from debug-forced arrows.
- Updated `tests/verify_simplified_indicator.ps1` for v0.4.7 clean-signal checks.
- Added `MacroMicro_Simplified_v0.4.8.ts` so RVOL 0.10-0.80 is CAUTION and only truly dead volume hard-blocks without impulse momentum.
- Updated `tests/verify_simplified_indicator.ps1` for v0.4.8 RVOL/impulse checks.
- Added `MacroMicro_Simplified_v0.4.9.ts` with practical real-entry arrows and PT/SL tracking based on `realLongEntry` / `realShortEntry`.
- Updated `tests/verify_simplified_indicator.ps1` for v0.4.9 practical real-entry checks.
- Added `MacroMicro_Simplified_v0.5.0.ts` so RVOL is caution-only for qualified setups instead of a hard arrow blocker.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.0 RVOL-as-caution checks.
- Added `MacroMicro_Simplified_v0.5.1.ts` to split dashboard diagnostics into hard block, caution source, and next trigger reason.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.1 diagnostic label checks.
- Added `MacroMicro_Simplified_v0.5.2.ts` with fast bias-flip caution arrows for hard breakdown/breakout bars while the slower score bias lags.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.2 fast bias-flip checks.
- Added `MacroMicro_Simplified_v0.5.3.ts` with 4/6 continuation-pressure caution arrows for active trends stuck on `NEXT: CANDLE`.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.3 continuation-pressure checks.
- Added `MacroMicro_Simplified_v0.5.4.ts` with a 5/6 setup-pulse fallback to prevent sustained qualified setups from producing no arrows.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.4 setup-pulse checks.
- Added `MacroMicro_Simplified_v0.5.5.ts` with fresh v0.5.5 arrow plot names and dense setup pulses on every valid 5/6 setup bar.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.5 fresh-plot and dense-pulse checks.
- Added `MacroMicro_Simplified_v0.5.6.ts` so real entries use the known-visible big arrow plots and setup pulses have failsafe bubbles.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.6 known-visible rendering checks.
- Added `MacroMicro_Simplified_v0.5.7.ts` to throttle setup pulses to 8 bars and turn failsafe setup bubbles off by default after v0.5.6 proved too noisy.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.7 clutter-control checks.
- Added `MacroMicro_Simplified_v0.5.8.ts` for arrows-first review: setup pulses every 5 bars, signal bubbles default off, and real arrows closer to candles.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.8 arrows-first checks.
- Added `MacroMicro_Simplified_v0.5.9.ts` with continuation-anchor arrows for persistent `NEXT: CONTINUE S/L` states.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.9 continuation-anchor checks.
- Added `MacroMicro_Simplified_v0.5.10.ts` with compact default-on `S` / `L` marker bubbles and visual-only setup-ready markers.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.10 render-contract marker checks.
- Added `MacroMicro_Simplified_v0.5.11.ts` with hardwired marker bubbles, fresh marker dot plots, and a `MARKER: S/L` dashboard label.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.11 hardwired marker checks.
- Added `MacroMicro_Simplified_v0.5.12.ts` with always-visible build/marker labels and a last-bar proof dot/bubble.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.12 always-visible diagnostic checks.
- Added `MacroMicro_Simplified_v0.5.13.ts` with hardwired spam diagnostics, raw setup/continuation labels, and explicit dashboard-trigger/marker contract checks.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.13 spam diagnostic and contract checks.
- Added `MacroMicro_Simplified_v0.5.14.ts` to split v0.5.13 diagnostic labels into static labels after Thinkorswim rejected the chained `AddLabel` string expressions.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.14 compile-safe diagnostic label checks.
- Added `MacroMicro_Simplified_v0.5.15.ts` to remove hardwired spam diagnostic bubbles and route raw setup visibility through throttled setup-pulse markers.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.15 clean marker checks, duplicate-header guards, top-level `else` guard, and render-call closure checks.
- Added `MacroMicro_Simplified_v0.5.16.ts` so raw setup markers use a direct first-bar/cadence/live-bar marker instead of depending only on setup-pulse edges.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.16 raw-cadence marker checks.
- Added `MacroMicro_Simplified_v0.5.17.ts` with direct raw setup proof bubbles and closer compact `L/S` marker placement after v0.5.16 showed `MARK READY` without visible markers.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.17 direct raw-bubble checks.
- Added `MacroMicro_Simplified_v0.5.18.ts` to thin direct raw proof bubbles to a separate 13-bar cadence after v0.5.17 rendered successfully but too densely.
- Updated `tests/verify_simplified_indicator.ps1` for v0.5.18 raw proof-bubble cadence checks.
