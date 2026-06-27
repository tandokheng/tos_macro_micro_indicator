# QQQ 5-Minute Review Log

Use this after importing `MacroMicro_Simplified_v0.3.1.ts` into Thinkorswim.

## Review Fields

- Date/session:
- Market condition:
- Signal side:
- Signal text:
- RVOL shown:
- TRADE state:
- Candle quality:
- Outcome after 3 to 5 bars:
- Outcome after 10 to 15 bars:
- Notes:

## Examples

### Example 1

- Date/session:
- Market condition:
- Signal side:
- Signal text:
- RVOL shown:
- TRADE state:
- Candle quality:
- Outcome after 3 to 5 bars:
- Outcome after 10 to 15 bars:
- Notes:

### Example 2

- Date/session:
- Market condition:
- Signal side:
- Signal text:
- RVOL shown:
- TRADE state:
- Candle quality:
- Outcome after 3 to 5 bars:
- Outcome after 10 to 15 bars:
- Notes:

## 2026-06-19 Computer Use pass

- Observation: v0.2.1 displayed the new TRADE dashboard, but June 11 regular-session QQQ 5m looked too quiet after scrolling; likely missed when the micro-cross occurred before the score reached 5/6.
- Change: v0.3.0 allows a candle-confirmed 5/6 score-cross to trigger an entry while keeping RVOL blocking, cooldown, one primary arrow per direction, ADD continuation labels, and active-only PT/SL.
- Next visual check: confirm v0.3.0 produces entries on clean 5m momentum legs without bringing back repeated old L/S 6/6 bubbles.


## 2026-06-19 No-arrow follow-up

- Observation: Manual v0.3.3 paste still showed no arrows during user scrollback.
- Root-cause hypothesis: study placement may still be lower/Volume because previous builds lacked declare upper;; remaining blockers need visible diagnostics.
- Change: v0.3.4 adds declare upper;, ready-entry fallback, and a WHY: dashboard label to show whether RVOL, structure, candle confirmation, cooldown, or same-side suppression is blocking arrows.


## 2026-06-20 RVOL follow-up

- Observation: User pasted v0.3.4 and still saw no arrows; WHY: reported RVOL.
- Root cause: 5m relative volume hard block at .60 was too restrictive for quiet but still valid QQQ continuation/reversal bars.
- Change: v0.3.5 lowers hard block to 0.35 and lowers caution threshold to 0.80, so 0.35-0.80 RVOL can still arrow as CAUTION.


## 2026-06-25 Score/candle follow-up

- Observation: User screenshot on QQQ 5D 5m showed SETUP: 4.00/6, TRADE: OK, WHY: CANDLE, RVOL: 1.60, and still no arrows across most of 20 days.
- Root cause: after RVOL was relaxed, the practical blocker became strict 5/6 scoring plus candle confirmation; debug wording could also show NO SETUP without indicating score/tie clearly.
- Change: v0.3.6 keeps 5/6 as the clean trigger but allows candle-confirmed 4/6 entries as CAUTION, decouples micro score from volume pressure, reports SCORE/TIE in WHY, and removes decimal score text from SETUP.


## 2026-06-25 Historical arrow starvation follow-up

- Observation: User still did not see past arrows even during very strong QQQ 5m trends.
- Root cause: v0.3.6 reset cooldown from candidate-ready edges instead of plotted entry arrows. In a strong trend, repeated confirming candidate bars could keep resetting the cooldown before any historical arrow was allowed. The same-side reset input also existed but was not used.
- Change: v0.3.7 resets cooldown from plotted entries, allows a same-side arrow refresh after `resetSameSideAfterBars`, keeps continuation signals as `ADD` bubbles, and changes bright yellow label/bubble backgrounds to darker amber for white-text readability.


## 2026-06-25 Suggested improvement pass

- Observation: v0.3.7 refreshed same-side entries only on the first bar after the reset window. If that exact bar lacked candle confirmation, the refreshed same-side arrow could still be missed.
- Change: v0.3.8 keeps 5m as the default profile, adds a visible `PROFILE: 5m` dashboard label, adds an optional `15m TEST` timing profile, and lets same-side refresh fire on the next valid candidate after the reset window.
- Note: The 15m profile only changes timing windows for now; scoring/RVOL should remain 5m-first until the 5m chart is acceptable.


## 2026-06-25 Compile fix follow-up

- Observation: Thinkorswim rejected v0.3.8 with `No such variable` errors for `newLongEntry`, `newShortEntry`, and `lastEntryDir`.
- Root cause: v0.3.8 referenced those variables before their definitions. ThinkScript does not allow that forward-reference pattern.
- Change: v0.3.9 replaces the circular entry/cooldown block with a compile-safe recursive `entryState`, then derives arrows, direction, cooldown, and same-side refresh from that state.


## 2026-06-25 Fast downtrend no-signal follow-up

- Observation: User screenshot showed a large QQQ 5m selloff with `BIAS: SHORT`, `SETUP: 5/6`, `TRADE: OK`, `RVOL: 1.52`, but `TRIGGER: WAIT` and `WHY: CANDLE`. User also reported no arrows while scrolling back.
- Root cause: the score/trade gates were valid, but candle confirmation was too strict for fast impulse/breakdown bars, causing signal starvation.
- Change: v0.4.0 adds fast break confirmation: large directional range, break of recent high/low, position relative to EMA fast, and acceptable volume can confirm entries when setup/trade already agree.


## 2026-06-25 Forced-arrow diagnostic pass

- Observation: User still saw no arrows and asked whether arrows might be too small or visually hidden.
- Diagnostic: v0.4.1 temporarily forces arrows from score + trade permission only: long score 5/6+ and trade OK plots magenta `TEST L`; short score 5/6+ and trade OK plots cyan `TEST S`.
- Expected result: If forced arrows appear, plotting is fine and the remaining bug is trigger/candle/entry-state gating. If forced arrows do not appear, investigate plot visibility, study settings, or TOS rendering.


## 2026-06-25 Score-only forced-arrow diagnostic correction

- Observation: v0.4.1 still showed no arrows on a 5/6 short because `TRADE: BLOCKED`, `WHY: RVOL`, and `RVOL: 0.06` prevented the forced-arrow condition.
- Root cause: v0.4.1 was not a true plot-visibility test because forced arrows still required trade permission.
- Change: v0.4.2 forces arrows from score only: 5/6+ dominant short plots cyan `TEST S`; 5/6+ dominant long plots magenta `TEST L`, regardless of TRADE/RVOL.


## 2026-06-25 Big arrow plot-render diagnostic

- Observation: v0.4.2 still did not visibly show forced arrows even when the dashboard showed `SETUP: 6/6` and `DEBUG FORCE ARROWS`.
- Diagnostic: v0.4.3 ignores all signal conditions and paints one big cyan `DebugBigArrow` plus a `BIG TEST ARROW` bubble on the last loaded bar.
- Expected result: If this does not show, the problem is not score, RVOL, candle, cooldown, or entry state; investigate TOS plot visibility, study subgraph/price-overlay behavior, or chart/study settings.


## 2026-06-25 Fresh plot-name diagnostic

- Observation: v0.4.3 `DebugBigArrow` displayed correctly, proving price-overlay plots and bubbles can render.
- Root-cause hypothesis: the old `LongArrow`/`ShortArrow` plot names may have inherited hidden/custom TOS plot settings from earlier study edits, while newly named plots display normally.
- Change: v0.4.4 renames the primary arrow plots to `VisibleLongArrow` and `VisibleShortArrow`, defaults `debugPaintBigArrow` off, and adds a `FORCED: L/S/NONE` dashboard label to prove whether the score-forced condition is active.


## 2026-06-26 Known-visible debug path follow-up

- Observation: User screenshot showed `FORCED: S`, `BIAS: SHORT`, and `SETUP: 6/6`, but still no visible forced arrow on a large downtrend.
- Root-cause hypothesis: the score-forced condition is true, but the normal forced-arrow plots are still not visible in the active TOS study settings; v0.4.3 proved `DebugBigArrow` itself can render.
- Change: v0.4.5 routes score-forced shorts through the known-visible `DebugBigArrow` plot and makes `TEST L/S` debug bubbles independent of `showSignalBubbles`.


## 2026-06-26 Mirrored long debug path follow-up

- Observation: v0.4.5 produced visible cyan forced-short arrows, but user did not see up arrows while scrolling back.
- Root-cause hypothesis: v0.4.5 only routed forced shorts through the known-visible big plot; forced longs still depended on the ordinary long arrow plot unless the bubble alone was noticed.
- Change: v0.4.6 adds a mirrored magenta `DebugBigUpArrow` for score-forced longs. If magenta arrows still do not appear, check whether the dashboard ever shows `FORCED: L`; if not, the long score is not reaching dominant 5/6 in that region.


## 2026-06-26 Clean real-entry test

- Observation: v0.4.6 screenshot showed both cyan forced-short and magenta forced-long arrows, proving both arrow directions render on the price chart.
- Root-cause conclusion: The previous no-arrow problem was not price-overlay rendering anymore; the remaining tuning issue is real signal logic and gating.
- Change: v0.4.7 defaults `debugForceArrows` to `no`, gates forced arrows behind that debug toggle, and restores visible primary arrows to real `newLongEntry` / `newShortEntry` only.


## 2026-06-26 Real-entry RVOL follow-up

- Observation: User reported all arrows disappeared again after forced debug was disabled.
- Root-cause hypothesis: the proven-visible plots were fine; real entries were still blocked by `longTradeOK` / `shortTradeOK`, especially `WHY: RVOL` around 0.29 on QQQ 5m.
- Change: v0.4.8 lowers the hard RVOL block to 0.10, keeps RVOL below 0.80 as CAUTION, and allows very low RVOL only when an impulse candle confirms momentum.


## 2026-06-26 Practical real-entry follow-up

- Observation: User reported no arrows even after v0.4.8 RVOL tuning.
- Root-cause hypothesis: real arrows were still dependent on the full recursive `entryState` path, so practical setup edges could appear on the dashboard without a visible entry arrow.
- Change: v0.4.9 adds `realLongEntry` / `realShortEntry`, combining the strict entry-state pulses with practical setup-edge arrows, and routes visible arrows, entry bubbles, alerts, and PT/SL tracking through that layer.


## 2026-06-26 RVOL caution-only follow-up

- Observation: User screenshot showed `BIAS: LONG`, `SETUP: 5/6`, `TRADE: BLOCKED`, `WHY: RVOL`, and `RVOL: 0.02`.
- Root-cause conclusion: Thinkorswim RVOL can be extremely low even when a clean directional 5/6 setup is visible; using it as a hard gate still suppresses practical arrows.
- Change: v0.5.0 changes RVOL to caution-only for qualified setups by setting `longVolumeOK` and `shortVolumeOK` to `yes` and leaving hard blocking to structure/chop.


## 2026-06-26 dashboard diagnostic split

- Observation: The single `WHY:` label could still make low RVOL look like a hard block even after v0.5.0 changed RVOL to caution-only.
- Change: v0.5.1 replaces `WHY:` with `BLOCKED BY`, `CAUTION BY`, and `NEXT` labels so hard blocks, warning conditions, and next trigger waits are visually separated.


## 2026-06-26 fast breakdown bias-flip follow-up

- Observation: User screenshot showed `BIAS: LONG`, `SETUP: 4/6`, `TRADE: OK`, and `NEXT: CANDLE` while QQQ was already breaking down hard.
- Root-cause conclusion: the 6-point bias can lag during fast 5-minute selloffs, so waiting for the normal short score to fully win can miss the first useful short cue.
- Change: v0.5.2 adds strict `FLIP S/L` caution arrows when a large fast-break candle crosses VWAP/EMA structure while the old bias is still stale.


## 2026-06-26 short continuation pressure follow-up

- Observation: User screenshot showed `BIAS: SHORT`, `SETUP: 4/6`, `TRADE: CAUTION`, `CAUTION BY: RVOL`, and `NEXT: CANDLE` while QQQ remained in an active downtrend.
- Root-cause conclusion: after the bias has flipped correctly, strict candle confirmation can still starve 4/6 continuation entries during low-RVOL trend pressure.
- Change: v0.5.3 adds `CONT S/L` caution arrows when price keeps breaking in the active 4/6 bias direction despite strict candle confirmation not passing.


## 2026-06-26 setup-pulse starvation follow-up

- Observation: User reported no arrows anywhere while scrolling back; screenshot showed `BIAS: SHORT`, `SETUP: 5/6`, `TRADE: CAUTION`, `CAUTION BY: RVOL`, and `NEXT: CANDLE`.
- Root-cause conclusion: real arrows were still too dependent on candidate edges and candle confirmation, so sustained 5/6 setups could remain valid without printing visible historical arrows.
- Change: v0.5.4 adds `SETUP S/L` caution arrows on 5/6 setup pulses, with a refresh every `setupPulseBars` bars while the qualified setup persists.


## 2026-06-26 dense setup-pulse visibility follow-up

- Observation: User screenshot still showed no arrows while the dashboard showed a valid 5/6 setup and `NEXT: SETUP PULSE`.
- Root-cause hypothesis: either the setup pulse spacing was still too sparse for the visible window, or Thinkorswim kept inherited hidden/custom plot settings on the previous primary arrow plot names.
- Change: v0.5.5 uses fresh `SignalLongV055Arrow` / `SignalShortV055Arrow` plot names and sets `setupPulseBars = 1`, so every valid 5/6 setup bar should print a visible `SETUP S/L` caution arrow.


## 2026-06-26 known-visible signal rendering follow-up

- Observation: User screenshot showed `TRIGGER: SETUP LONG`, `SETUP: 5/6`, and `TRADE: CAUTION`, but still no visible arrow.
- Root-cause conclusion: the signal condition is now firing; the remaining failure is the standard primary arrow rendering path or scrollback/dashboard mismatch, not the score trigger.
- Change: v0.5.6 routes real entries through the known-visible `DebugBigArrow` / `DebugBigUpArrow` plots and adds short failsafe `SETUP L/S` bubbles on setup pulses.


## 2026-06-26 setup bubble clutter follow-up

- Observation: v0.5.6 screenshot showed many cyan/magenta `SETUP S/L` bubbles across the chart, proving the visual path but making the chart too noisy.
- Root-cause conclusion: `setupPulseBars = 1` plus default-on failsafe bubbles was appropriate for proof, but not for trading review.
- Change: v0.5.7 keeps the known-visible arrow route, restores `setupPulseBars` to 8, and defaults `showFailsafeSignalBubbles` to `no`.


## 2026-06-26 arrows-first middle-ground follow-up

- Observation: v0.5.7 screenshot showed a clean chart, but also no visible signals in the reviewed area; the current bar itself was `SETUP: 4/6`, `TRIGGER: WAIT`, and `NEXT: CANDLE`.
- Root-cause conclusion: the current bar was correctly not triggering, but the review build should make historical arrows easier to see without needing setup bubbles.
- Change: v0.5.8 defaults `showSignalBubbles` to `no`, sets `setupPulseBars = 5`, and moves real arrows closer to candles with `liveArrowOff` while preserving the known-visible debug plot names.


## 2026-06-26 continuation-anchor follow-up

- Observation: v0.5.8 screenshot showed `BIAS: SHORT`, `SETUP: 6/6`, `TRADE: OK`, and `NEXT: CONTINUE S`, but `TRIGGER: WAIT` and no visible arrow.
- Root-cause conclusion: continuation pressure can persist after the edge-based continuation arrow has already passed, so the dashboard can show a valid continuation state without a current plotted arrow.
- Change: v0.5.9 adds continuation-anchor arrows through `visibleLongSignal` / `visibleShortSignal`, separate from trade-entry tracking, so persistent `NEXT: CONTINUE S/L` states can paint without resetting PT/SL.


## 2026-06-26 compact marker-bubble follow-up

- Observation: User still reported no arrows while scrolling back; screenshot showed `BIAS: SHORT`, `SETUP: 6/6`, `TRADE: CAUTION`, `CAUTION BY: RVOL`, and `NEXT: SETUP PULSE`.
- Multi-agent conclusion: `SETUP: 6/6` means the setup score is strong, but the throttled setup-pulse edge can still be false on that bar; also, v0.5.6 proved chart bubbles rendered, not necessarily that plot-arrow rendering was reliable.
- Change: v0.5.10 adds default-on compact `S` / `L` marker bubbles driven by `visibleShortSignal` / `visibleLongSignal`, and moves setup-ready states into visual markers instead of `realShortEntry` / `realLongEntry` so PT/SL tracking is not repeatedly reset.


## 2026-06-26 hardwired marker follow-up

- Observation: After v0.5.10, user still saw no marker bubbles while the dashboard showed `TRIGGER: CONT SHORT`, which means the visible short marker state should be true.
- Root-cause hypothesis: the new `showArrowMarkerBubbles` input may have inherited or remapped an old saved Thinkorswim study input value, silently disabling the new marker layer on the existing study instance.
- Change: v0.5.11 removes the marker input, hardwires compact `S` / `L` marker bubbles, adds fresh `MarkerShortDotV0511` / `MarkerLongDotV0511` point plots, and adds a `MARKER: S/L` dashboard label from the same marker boolean.


## 2026-06-26 always-visible build/marker diagnostic

- Observation: User again reported no marker while scrolling, but the screenshot showed `BIAS: NO TRADE`, `SETUP: 3/6`, `TRIGGER: WAIT`, and `NEXT: SCORE`, so the current bar correctly had no marker contract.
- Root-cause conclusion: v0.5.11 still could not prove whether the active chart was running the latest pasted build when marker state was `NONE`.
- Change: v0.5.12 adds always-visible `BUILD: v0.5.12 DIAG` and `MARKER: NONE/L/S` labels plus a last-loaded-bar `v0.5.12 TEST` bubble and `BuildProofDotV0512` point.


## 2026-06-26 spam diagnostic contract follow-up

- Observation: User screenshot showed `BUILD: v0.5.12 DIAG`, `MARKER: NONE`, `BIAS: SHORT`, `SETUP: 6/6`, and `TRIGGER: CONT SHORT`. Multi-agent review found that combination is logically impossible from the local v0.5.12 source because `CONT SHORT` should feed `visibleShortSignal`, then `arrowMarkerShort`.
- Root-cause hypothesis: the active TOS study may be behaviorally drifting from the local source through paste/input/style state, or the dashboard trigger chain needs explicit contract diagnostics instead of transitive reasoning.
- Change: v0.5.13 is a deliberately loud spam-diagnostic build. It hardwires raw setup/continuation pressure into visible spam markers (`SPAM L/S`) and the known-visible arrow plots without resetting PT/SL tracking, adds `BUILD: v0.5.13 SPAM DIAG`, `RAW`, and `CONTRACT` labels, and makes dashboard continuation trigger labels use named contract booleans.


## 2026-06-26 v0.5.13 compile follow-up

- Observation: Thinkorswim rejected v0.5.13 with `Invalid statement: AddLabel` and a later `Invalid statement: else`.
- Root-cause hypothesis: the new diagnostic labels used long chained string expressions with nested string `if/else`, which likely confused the ThinkScript parser and caused it to report the next dashboard `AddLabel`.
- Change: v0.5.14 preserves the spam diagnostic and marker contract, but splits `MARKER`, `CONTRACT`, `RAW SETUP`, and `RAW CONT` into static AddLabel statements.


## 2026-06-26 clean raw-marker follow-up

- Observation: v0.5.14 screenshot showed `BUILD: v0.5.14 SPAM DIAG`, `RAW SETUP: S`, and many cyan/magenta `SPAM S/L` bubbles, proving the chart-bubble marker route and raw setup source both work.
- Root-cause conclusion: raw setup state was being painted every bar through the diagnostic layer, while the dashboard clean trigger could still say `WAIT` because it uses the edge/throttled setup-pulse layer.
- Change: v0.5.15 removes hardwired `SPAM L/S` bubbles and routes setup visibility through `setupPulseLongArrow` / `setupPulseShortArrow`, keeping raw labels for diagnosis but making the visible marker layer clean enough for QQQ 5m review.


## 2026-06-26 raw cadence marker follow-up

- Observation: v0.5.15 screenshot showed `BUILD: v0.5.15 CLEAN RAW`, `RAW SETUP: L`, and the last-bar test bubble/dot, with old `SPAM L/S` bubbles gone, but no compact `L/S` markers even after scrolling.
- Root-cause conclusion: the raw setup source and chart-bubble path were alive, but visible setup markers depended only on the setup-pulse edge/counter path, which could leave a valid raw setup visually silent.
- Change: v0.5.16 adds direct raw setup cadence markers on the first setup bar, every `setupPulseBars` bars while raw setup persists, and the live last bar for immediate screenshot confirmation.


## 2026-06-27 direct raw-bubble follow-up

- Observation: v0.5.16 screenshot showed `BUILD: v0.5.16 RAW CADENCE`, `RAW SETUP: L`, `TRIGGER: SETUP LONG`, and `NEXT: MARK READY`, but no visible compact `L/S` marker after the study was removed and re-added.
- Root-cause conclusion: parallel agent review confirmed the local boolean path is true; the remaining failure is the compact marker rendering route or placement, not raw setup gating.
- Change: v0.5.17 keeps spam removed but adds direct `RAW L/S` proof bubbles using the v0.5.14-proven larger offset, and moves compact `L/S` marker dots/bubbles closer to candles for comparison.


## 2026-06-27 raw-bubble density follow-up

- Observation: v0.5.17 screenshot showed `BUILD: v0.5.17 RAW BUBBLE`, the `v0.5.17 TEST` bubble, and many direct `RAW L/S` proof bubbles, confirming the clean raw-bubble route works.
- Root-cause conclusion: visibility is solved for direct raw proof bubbles, but v0.5.17 is too noisy for review/trading.
- Change: v0.5.18 keeps direct raw proof bubbles but gives them a separate `rawSetupBubbleBars = 13` cadence so proof remains visible with less chart clutter.


## 2026-06-27 working-arrow comparison follow-up

- Observation: User provided a separate ThinkScript that successfully shows arrows in Thinkorswim; its arrow plots use direct fire conditions, `low/high +/- off` placement, `PaintingStrategy.ARROW_UP/DOWN`, `AssignValueColor`, and line weight 5.
- Root-cause hypothesis: v0.5.18 raw setup state and proof bubbles work, so the missing arrows are likely tied to the older multiplexed debug plot rendering path, color/style state, or placement rather than setup gating.
- Change: v0.5.19 keeps the thinned raw proof bubbles and adds fresh `RawSetupLongArrowV0519` / `RawSetupShortArrowV0519` plots that mirror the known-working arrow script pattern.


## 2026-06-27 v0.5.19 arrow confirmation

- Observation: User screenshot showed `BUILD: v0.5.19 RAW ARROWS`, `v0.5.19 TEST`, direct `RAW L/S` proof bubbles, and visible magenta/cyan arrows on QQQ 5m.
- Root-cause conclusion: the no-arrow issue was a Thinkorswim rendering/style-state problem around the previous arrow plot path, not the raw setup boolean. Fresh dedicated working-style plots rendered correctly.
- Change: v0.5.20 keeps the working-style arrows default-on and turns raw proof bubbles off by default so the chart becomes cleaner for signal review.


## 2026-06-27 v0.5.20 noise follow-up

- Observation: User screenshot showed `BUILD: v0.5.20 CLEAN ARROWS` and many magenta/cyan arrows across QQQ 5m, even though raw proof bubbles were hidden.
- Root-cause conclusion: v0.5.20 still fed raw setup cadence into `visibleLongSignal` / `visibleShortSignal`, and also kept a separate raw setup arrow layer. Visibility was solved, but diagnostic raw setup became the default signal layer.
- Change: v0.5.21 makes raw setup diagnostic-only, removes raw setup from dashboard triggers/default markers, and adds fresh working-style review arrows driven only by `realLongEntry` / `realShortEntry`.


## 2026-06-27 v0.5.21 sparse-arrow follow-up

- Observation: User screenshot showed `BUILD: v0.5.21 QUIET ARROWS`, the test bubble/dot, target/stop lines, and no magenta/cyan review arrows across the visible QQQ 5m region.
- Root-cause conclusion: v0.5.21 overcorrected by moving default arrows to entry-only gates. That avoided raw cadence spam, but it also removed useful setup-review arrows from historical chart review.
- Change: v0.5.22 keeps the proven working-style arrow primitive, adds setup-review arrows only on first 5/6 setup edges or 6/6 upgrades, and keeps PT/SL trade tracking tied to `realLongEntry` / `realShortEntry`.


## 2026-06-27 v0.5.22 historical-arrow follow-up

- Observation: User screenshot showed `BUILD: v0.5.22 BALANCED ARROWS` and the `v0.5.22 TEST` bubble, but no magenta/cyan arrows on historical QQQ 5m candles. The user correctly asked whether arrows should still show while the market is closed.
- Root-cause conclusion: Closed market is not the blocker; ThinkScript should still render historical bars. v0.5.22's first-edge/6-upgrade gate was still too sparse for visible scrollback regions.
- Change: v0.5.23 keeps the working-style arrow primitive and adds a visual-only slow refresh every `setupReviewRefreshBars = 13` bars during sustained 5/6 setups when quality is present. This does not feed `realLongEntry` / `realShortEntry`, PT/SL tracking, or alerts.


## 2026-06-27 v0.5.23 no-arrow diagnostic follow-up

- Observation: User scrolled through v0.5.23 and reported there was not a single arrow. The screenshot still showed the study/dashboard path rendering, so this is not a closed-market or blank-study issue.
- Root-cause hypothesis: after the arrow-rendering primitive was proven in v0.5.19/v0.5.20, v0.5.23's remaining no-arrow behavior is likely a silent historical signal-gate problem: either the setup source is absent in the loaded region or the review-quality gate is too strict.
- Change: v0.5.24 adds on-chart `DBG SET`, `DBG REV`, and `DBG PROBE` counts over a 200-bar lookback, plus fresh visual-only green/red score-probe arrows that fire from 5/6 setup cadence only when the normal review arrow is silent. Trade entry and PT/SL tracking remain tied to `realLongEntry` / `realShortEntry`.


## 2026-06-27 v0.5.24 NaN review follow-up

- Observation: User saw many arrows immediately after v0.5.24 loaded, then Thinkorswim recalculated and all arrows disappeared. The screenshot showed `DBG SET L200: 53`, `DBG SET S200: 80`, and `DBG PROBE L/S: 5/7`, but `DBG REV L200/S200` and `DBG ANY L/S` were `NaN`.
- Root-cause conclusion: setup and probe cadence were alive, but the review visual signal was not a clean boolean. Because the probe plot was gated by `!reviewLongSignal` / `!reviewShortSignal`, a `NaN` review state also suppressed the probe arrows.
- Change: v0.5.25 converts real-entry and setup-review components into NaN-safe 0/1 flags before building `reviewLongSignal` / `reviewShortSignal`, then uses fresh v0.5.25 review/probe arrow plot names.
