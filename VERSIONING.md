# Indicator Versioning

Use an explicit version in every new indicator file and in the file header.

## Convention

- File name: `MacroMicro_Simplified_vX.Y.Z.ts`
- Header line: `# Version: vX.Y.Z`
- Optional short label: `# Label: 5-of-6 intraday simplified`

## Current Baseline

- `MacroMicro_Simplified_5of6.ts` is the unversioned first simplified baseline.
- `MacroMicro_Simplified_v0.2.0.ts` adds stronger risk gating, candle confirmation, compact signal bubbles, and `TRADE` dashboard state.
- `MacroMicro_Simplified_v0.2.1.ts` adds entry/add/danger signal labeling and clearer target/stop display.
- `MacroMicro_Simplified_v0.3.0.ts` adds confirmed score-cross entries so clean 5-minute momentum is not missed after the first micro-cross.
- MacroMicro_Simplified_v0.3.1.ts adds a short fresh 5/6 confirmation window so the 5m chart can trigger after score turns without requiring the exact score-cross bar.
- MacroMicro_Simplified_v0.3.2.ts adds sustained 5/6 candle-confirmed entries.
- MacroMicro_Simplified_v0.3.3.ts adds anti-starvation pulses for cooldown-blocked 5/6 setups.
- MacroMicro_Simplified_v0.3.4.ts explicitly declares the study as an upper/price overlay and adds a WHY diagnostic label for no-arrow troubleshooting.
- MacroMicro_Simplified_v0.3.5.ts relaxes the 5-minute RVOL hard block for quiet QQQ bars.
- MacroMicro_Simplified_v0.3.6.ts allows candle-confirmed 4/6 CAUTION arrows and integer setup scores.
- MacroMicro_Simplified_v0.3.7.ts fixes historical arrow starvation by resetting cooldown from plotted entries instead of candidate-ready edges, refreshes same-side arrows after the reset window, and replaces bright yellow with amber.
- MacroMicro_Simplified_v0.3.8.ts keeps 5m as the default profile, adds an optional 15m timing profile, and lets same-side refresh wait for the next valid candidate after the reset window.
- MacroMicro_Simplified_v0.3.9.ts fixes ThinkScript compile errors from forward references in v0.3.8 by using a compile-safe recursive entry state.
- MacroMicro_Simplified_v0.4.0.ts adds fast break confirmation so 5/6 trade-OK impulse moves are not blocked by overly strict candle confirmation.
- MacroMicro_Simplified_v0.4.1.ts is a temporary forced-arrow diagnostic build; it plots TEST arrows from 5/6 score + trade OK to isolate plot visibility from trigger gating.
- MacroMicro_Simplified_v0.4.2.ts changes the forced-arrow diagnostic to score-only, bypassing TRADE/RVOL so plot visibility can be tested directly.
- MacroMicro_Simplified_v0.4.3.ts adds an always-on big cyan last-bar arrow and `BIG TEST ARROW` bubble to test whether price-overlay plots render at all.
- MacroMicro_Simplified_v0.4.4.ts renames the primary arrow plots to `VisibleLongArrow` and `VisibleShortArrow` to avoid inherited hidden/custom TOS settings on the old `LongArrow`/`ShortArrow` plot names.
- MacroMicro_Simplified_v0.4.5.ts routes score-forced short diagnostics through the known-visible `DebugBigArrow` plot and makes forced debug bubbles independent of the normal signal-bubble toggle.
- MacroMicro_Simplified_v0.4.6.ts adds a mirrored score-forced `DebugBigUpArrow` for long-side plot visibility testing.
- MacroMicro_Simplified_v0.4.7.ts turns forced-arrow debug off by default and restores the main arrows to real entries only, using a larger real-entry offset for visibility.
- MacroMicro_Simplified_v0.4.8.ts retunes 5m RVOL gating so sub-0.35 RVOL is CAUTION, while only sub-0.10 RVOL hard-blocks unless price action shows impulse momentum.
- MacroMicro_Simplified_v0.4.9.ts adds a practical real-entry layer so visible arrows can fire from qualified setup edges without waiting for the full recursive entry-state stack.
- MacroMicro_Simplified_v0.5.0.ts changes RVOL from a hard arrow blocker into a caution state for qualified setups; structure/chop can still block trades.
- MacroMicro_Simplified_v0.5.1.ts splits dashboard diagnostics into `BLOCKED BY`, `CAUTION BY`, and `NEXT` so RVOL warnings are not confused with hard blockers.
- MacroMicro_Simplified_v0.5.2.ts adds fast bias-flip caution arrows for hard breakdown/breakout bars before the slower 6-point bias fully flips.
- MacroMicro_Simplified_v0.5.3.ts adds 4/6 continuation-pressure caution arrows when the bias is already correct but strict candle confirmation still reports `NEXT: CANDLE`.
- MacroMicro_Simplified_v0.5.4.ts adds a 5/6 setup-pulse fallback so sustained qualified setups print caution arrows even when candle confirmation never opens the normal entry path.
- MacroMicro_Simplified_v0.5.5.ts adds fresh v0.5.5 arrow plot names and dense 5/6 setup pulses so inherited hidden TOS plot settings or pulse spacing cannot make valid setups look arrowless.
- MacroMicro_Simplified_v0.5.6.ts routes real entries through the known-visible big debug arrow plots and adds failsafe setup bubbles after `TRIGGER: SETUP LONG/SHORT` appeared without visible arrows.
- MacroMicro_Simplified_v0.5.7.ts reduces v0.5.6 chart clutter by throttling setup pulses to 8 bars and defaulting failsafe setup bubbles off.
- MacroMicro_Simplified_v0.5.8.ts switches to arrows-first review: signal bubbles default off, setup pulses run every 5 bars, and real arrows use a closer live offset.
- MacroMicro_Simplified_v0.5.9.ts adds continuation-anchor arrows so persistent `NEXT: CONTINUE S/L` states can paint without resetting trade tracking.
- MacroMicro_Simplified_v0.5.10.ts adds default-on compact `L` / `S` marker bubbles from the visible-signal state because Thinkorswim plot arrows remained unreliable during scrollback testing; setup-ready markers are visual-only and do not reset target/stop tracking.
- MacroMicro_Simplified_v0.5.11.ts hardwires compact marker bubbles, adds fresh v0.5.11 marker dot plots, and adds a `MARKER: L/S` dashboard label so marker visibility no longer depends on a saved TOS input.
- MacroMicro_Simplified_v0.5.12.ts adds always-visible `BUILD: v0.5.12 DIAG` and `MARKER: NONE/L/S` labels plus a last-bar proof dot/bubble so screenshots prove whether the correct build is active and whether the marker state is actually none.
- MacroMicro_Simplified_v0.5.13.ts adds a deliberately noisy raw setup/continuation spam diagnostic to prove the chart-bubble marker path.
- MacroMicro_Simplified_v0.5.14.ts fixes v0.5.13 ThinkScript parser errors by splitting diagnostic labels into static `AddLabel` calls.
- MacroMicro_Simplified_v0.5.15.ts removes the `SPAM L/S` diagnostic bubbles and routes setup visibility through throttled setup-pulse markers for a cleaner QQQ 5m test build.
- MacroMicro_Simplified_v0.5.16.ts replaces pulse-edge-only setup visibility with raw setup cadence markers: first setup bar, every `setupPulseBars` bars, and the live bar.
- MacroMicro_Simplified_v0.5.17.ts adds direct raw setup proof bubbles (`RAW L/S`) using the v0.5.14-proven larger offset and moves compact `L/S` markers closer to candles.
- MacroMicro_Simplified_v0.5.18.ts keeps the proven direct raw proof bubbles but thins them to a separate 13-bar cadence after v0.5.17 showed too many `RAW L/S` bubbles.
- MacroMicro_Simplified_v0.5.19.ts adds fresh dedicated raw setup arrow plots that mirror the known-working arrow script: direct condition, `low/high +/- off`, `ARROW_UP/DOWN`, `AssignValueColor`, and line weight 5.
- MacroMicro_Simplified_v0.5.20.ts keeps the v0.5.19 working-style arrows default-on and turns raw proof bubbles off by default after the user confirmed arrows render in Thinkorswim.
- MacroMicro_Simplified_v0.5.21.ts makes raw setup diagnostic-only and moves default arrows to fresh working-style review plots driven only by real trade-entry signals.
- MacroMicro_Simplified_v0.5.22.ts restores balanced default arrows by adding first 5/6 setup-edge and 6/6-upgrade review signals, while avoiding raw cadence spam and keeping trade tracking on real entries only.
- MacroMicro_Simplified_v0.5.23.ts adds a slow quality-gated sustained setup review refresh so historical 5/6 regions can show arrows without returning to raw cadence spam.
- MacroMicro_Simplified_v0.5.24.ts adds debug count labels plus visual-only score-probe arrows to diagnose whether v0.5.23's no-arrow result came from setup source absence or an over-strict review gate.
- MacroMicro_Simplified_v0.5.25.ts sanitizes review visual booleans after v0.5.24 showed `DBG REV: NaN`; probe arrows can now plot when setup/probe is alive and review is safely false.
- MacroMicro_Simplified_v0.5.26.ts keeps v0.5.25's NaN-safe arrows but gates compact `L/S` marker bubbles behind `showSignalBubbles` so the default chart is arrow-first again.
- MacroMicro_Simplified_v0.5.27.ts keeps the NaN-safe review arrows default-on, but makes green/red score-probe diagnostic arrows opt-in while keeping `DBG PROBE` counts ungated for troubleshooting.
- MacroMicro_Simplified_v0.5.28.ts tightens noisy review arrows by slowing setup-review refresh to 21 bars and requiring directional follow-through instead of score-only 6/6 refreshes.
- MacroMicro_Simplified_v0.5.29.ts adds a final visual-only review throttle with `reviewVisualMinBars = 8`, keeps raw `DBG REV` counts unthrottled, and adds `DBG VIS L/S` so chart noise can be tuned without hiding source diagnostics.
- MacroMicro_Simplified_v0.5.30.ts adds a default-on setup-review chop filter using 12-bar trend efficiency, 2-point score dominance, and side-specific slow-EMA direction, plus `DBG CHOP L/S` counts for suppressed review arrows.
- MacroMicro_Simplified_v0.5.31.ts applies the chop filter to real-entry review arrows too and removes low-volume momentum as a direct review-arrow bypass, so `DBG CHOP L/S` now catches both setup-review and real-entry review arrows blocked by chop.
- MacroMicro_Simplified_v0.5.32.ts adds a mixed-direction review filter: when long and short review candidates both appear within 13 bars, visible review arrows are blocked unless a fast break, continuation pressure, or efficient VWAP/EMA-aligned move escapes the range.
- MacroMicro_Simplified_v0.5.33.ts tightens the mixed-direction review filter by removing continuation pressure as an automatic conflict escape, and adds `DBG BOTH L/S` so screenshots can separate detected long/short conflict from actually blocked `DBG MIX` pulses.
- MacroMicro_Simplified_v0.5.34.ts widens `reviewConflictLookbackBars` from 13 to 21 after v0.5.33 screenshots showed `DBG BOTH L/S` was alive but too low to catch the visible chop cycle.
- MacroMicro_Simplified_v0.5.35.ts keeps the 21-bar mixed-conflict lookback but tightens mixed-conflict escape to `minConflictEscapeTrendEfficiency = 0.45` and `minConflictEscapeScoreSeparation = 3`, plus `DBG ESC L/S` so screenshots separate detected conflict, escaped conflict, and blocked conflict.
- MacroMicro_Simplified_v0.5.36.ts keeps the proven v0.5.35 renderer but blocks review-arrow continuation-pressure pullbacks unless they also break a wider 5-bar structure window with 2-point side dominance, plus `DBG CONT L/S` to count blocked continuation bypasses.
- MacroMicro_Simplified_v0.5.37.ts keeps v0.5.36 trend/reversal behavior but blocks raw fast-break review arrows unless they also pass a stronger review-only 5-bar structure break and 1.60 ATR-range proof, plus `DBG FAST L/S` to count raw fast breaks suppressed in chop.
- MacroMicro_Simplified_v0.5.38.ts blocks normal efficient-score review arrows unless they also break 5-bar local structure, adding `DBG STRUCT L/S` so screenshots can separate score/efficiency candidates that lacked structure from true review arrows.
- MacroMicro_Simplified_v0.5.39.ts tightens the normal efficient-score review path again: it now uses an 8-bar structure break plus directional close follow-through against EMA fast before painting, while fast-break, continuation, and real trade-entry logic remain unchanged.
- MacroMicro_Simplified_v0.5.40.ts adds a raw-pressure flip guard after v0.5.39 screenshots showed candidate-level `DBG BOTH/MIX` stayed too low. Final review arrows now check recent opposite raw pressure over 34 bars and only escape on stronger fast-break or confirmed trend structure, with `DBG FLIP L/S` counting blocked chop flips.
- MacroMicro_Simplified_v0.5.41.ts tightens v0.5.40 by requiring score dominance even for fast-break escapes inside mixed/raw-pressure conflict, lengthens final review-arrow spacing to 10 bars, and adds review-only `R-TP` / `R-SL` lines and bubbles from visible review arrows without feeding real trade tracking.
- MacroMicro_Simplified_v0.5.42.ts keeps real trade PT/SL unchanged but separates review-risk visuals: review arrows move outside the review stop zone with a risk-aware ATR offset, and review-only `R-TP` uses a wider 2 ATR follow-through target so screenshots can judge whether v0.5.41 was taking profit too early.
- MacroMicro_Simplified_v0.5.43.ts clarifies the visual contract: compact dots are 4/6 setup-coming warnings, review arrows paint on the next candle after a 5/6 trigger, and review risk now shows TP1/TP2 plus a structure-aware stop capped by ATR risk.

## Version Meaning

- Patch: compile fix, typo, small parameter/default change.
- Minor: signal logic, dashboard, target/stop, or filter changes.
- Major: a materially different trading model.
