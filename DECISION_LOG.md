# Decision Log

## 2026-06-19

- Use `MacroMicro_Simplified_v0.2.0.ts` for the next signal-logic/dashboard iteration because v0.2.0 changes gating, candle confirmation, bubbles, and dashboard behavior.
- Optimize for 5-minute behavior first, then validate/tune 15-minute behavior separately.
- Keep the 5-of-6 arrow trigger and 4-of-6 standby threshold for v0.2.0.
- Use stronger RVOL and candle confirmation before adding any higher-timeframe entry gate.
- Consider 1-hour as the first higher-timeframe context candidate; keep 4-hour and daily as broader context until testing proves otherwise.
- Add v0.2.1 as the first trade-management refinement: first signal gets `ENTRY`, same-direction repeat signals become `ADD`, target/stop bubbles default on, and score breakdown to 3/6 shows `DANGER`.

- Add v0.3.5 after live WHY: RVOL feedback: for 5-minute QQQ, treat 0.35-0.80 RVOL as CAUTION and reserve hard blocking for RVOL below 0.35.

- Add v0.3.6 after QQQ 5m no-arrow review: keep 5/6 as clean trigger, but permit 4/6 candle-confirmed CAUTION arrows for practical 5-minute testing.

- Add v0.3.7 after continued no-arrow feedback: drive cooldown from plotted entries instead of candidate-ready edges, use the existing same-side reset window for sustained trends, and replace bright yellow UI with darker amber for readability.

- Add v0.3.8 as a suggested improvement pass: keep 5m as the visible/default profile, add optional 15m timing-only profile controls, and let same-side refresh wait for the next valid candidate instead of requiring the exact reset bar.

- Add v0.3.9 as a compile fix for v0.3.8: use a single recursive `entryState` to avoid ThinkScript forward references while keeping plotted-entry cooldown and same-side refresh.

- Add v0.4.0 after QQQ 5m no-signal screenshots: keep score/RVOL gates intact, but add fast break candle confirmation so 5/6 TRADE OK impulse moves can trigger.

- Add v0.4.1 as a temporary diagnostic build: force magenta/cyan TEST arrows from 5/6 score + TRADE OK so plot visibility can be separated from trigger gating.

- Add v0.4.2 after v0.4.1 was still RVOL-blocked: forced debug arrows now ignore TRADE/RVOL and depend only on dominant 5/6 score.

- Add v0.4.3 after score-only forced arrows still did not appear: paint one unconditional big cyan last-bar arrow and bubble to isolate TOS plot rendering from all signal conditions.

- Add v0.4.4 after `DebugBigArrow` rendered: use fresh `VisibleLongArrow`/`VisibleShortArrow` plot names because old arrow plot names likely inherited hidden/custom TOS settings.

- Add v0.4.5 after `FORCED: S` appeared without visible normal arrows: route score-forced shorts through the known-visible `DebugBigArrow` plot and make forced debug bubbles independent of `showSignalBubbles`.

- Add v0.4.6 after cyan forced shorts appeared but no up arrows were seen: add a mirrored magenta `DebugBigUpArrow` for score-forced long diagnostics without changing entry logic.

- Add v0.4.7 after both cyan forced shorts and magenta forced longs appeared: turn forced-arrow debug off by default and keep real arrows tied only to `newLongEntry` / `newShortEntry`.

- Add v0.4.8 after v0.4.7 showed no real arrows: the rendering path is proven, so move RVOL 0.10-0.80 into CAUTION and reserve hard blocking for sub-0.10 volume unless impulse momentum is present.

- Add v0.4.9 after v0.4.8 still showed no arrows: keep the stricter recursive entry state, but add practical setup-edge `realLongEntry` / `realShortEntry` arrows and use them for PT/SL tracking.

- Add v0.5.0 after screenshot showed `BIAS: LONG`, `SETUP: 5/6`, `RVOL: 0.02`, and `WHY: RVOL`: RVOL readings are too brittle as a hard blocker on QQQ 5m, so use RVOL as a caution state while preserving structure/chop blocking.

- Add v0.5.1 to split the old combined `WHY:` diagnostic into `BLOCKED BY`, `CAUTION BY`, and `NEXT` so low RVOL is shown as a caution source instead of looking like the reason for a hard block.

- Add v0.5.2 after screenshot showed `BIAS: LONG`, `SETUP: 4/6`, `TRADE: OK`, and `NEXT: CANDLE` during a sharp QQQ selloff: add fast bias-flip caution arrows so hard breakdown/breakout bars can signal before the slower 6-point bias fully flips.

- Add v0.5.3 after screenshot showed `BIAS: SHORT`, `SETUP: 4/6`, `TRADE: CAUTION`, `CAUTION BY: RVOL`, and `NEXT: CANDLE` during an active QQQ downtrend: add 4/6 continuation-pressure caution arrows so active trends are not starved by strict candle confirmation.

- Add v0.5.4 after user reported no arrows even while scrolling back and screenshot showed `BIAS: SHORT`, `SETUP: 5/6`, `TRADE: CAUTION`, `CAUTION BY: RVOL`, and `NEXT: CANDLE`: add a 5/6 setup-pulse fallback so sustained qualified setups can print caution arrows even when strict candle confirmation never opens.

- Add v0.5.5 after v0.5.4 still showed no visible arrows on a chart with `SETUP: 6/6` and `NEXT: SETUP PULSE`: use fresh v0.5.5 arrow plot names and set setup pulses dense by default so every valid 5/6 setup bar can paint `SETUP S/L`.

- Add v0.5.6 after screenshot showed `TRIGGER: SETUP LONG` but still no visible arrow: treat the score/trigger path as working and move real entries onto the previously proven-visible `DebugBigArrow` / `DebugBigUpArrow` plots, with failsafe setup bubbles as a second visual route.

- Add v0.5.7 after v0.5.6 screenshot showed the visibility path working but flooding the chart with `SETUP L/S` bubbles: keep known-visible arrows, turn failsafe bubbles off by default, and throttle setup pulses to every 8 bars.

- Add v0.5.8 after v0.5.7 screenshot became quiet again on a non-triggering `SETUP: 4/6` bar: keep the known-visible arrow path, move live arrows closer to candles, turn normal bubbles off by default, and use `setupPulseBars = 5` as a middle ground.

- Add v0.5.9 after screenshot showed `BIAS: SHORT`, `SETUP: 6/6`, `TRADE: OK`, `NEXT: CONTINUE S`, and `TRIGGER: WAIT`: add visible continuation-anchor arrows that do not feed `realShortEntry` / `realLongEntry`, so they do not reset target/stop tracking.

- Add v0.5.10 after multi-agent review of continued no-arrow screenshots: treat chart bubbles as the proven-visible marker path, add compact default-on `S` / `L` marker bubbles from `visibleShortSignal` / `visibleLongSignal`, and keep setup-ready markers visual-only so they do not repeatedly reset PT/SL tracking.

- Add v0.5.11 after v0.5.10 showed `TRIGGER: CONT SHORT` but still no marker bubble: remove the new marker input as a possible saved-input failure point, hardwire marker bubbles, add fresh marker dot plots, and add a `MARKER: S/L` dashboard label tied to the same marker state.

- Add v0.5.12 after the user still saw no markers on a `TRIGGER: WAIT` / `NEXT: SCORE` screenshot: make the build and marker state visible on every bar with `BUILD: v0.5.12 DIAG` and `MARKER: NONE/L/S`, plus a last-bar proof dot/bubble to identify TOS study-instance or display issues before changing signal logic again.

- Add v0.5.13 after a screenshot showed the logically inconsistent state `BUILD: v0.5.12 DIAG`, `TRIGGER: CONT SHORT`, and `MARKER: NONE`: recreate the useful v0.5.6 spam proof through hardwired raw setup/continuation markers, add `RAW` and `CONTRACT` labels, and keep diagnostic spam visual-only so PT/SL tracking does not reset every bar.

- Add v0.5.14 after Thinkorswim rejected v0.5.13 with `Invalid statement: AddLabel`: split the new diagnostic MARKER/CONTRACT/RAW labels into static AddLabel statements so the spam diagnostic can compile while preserving the same marker contract and raw pressure proof.

- Add v0.5.15 after v0.5.14 rendered many `SPAM L/S` bubbles: keep the raw setup/continuation dashboard diagnostics, remove hardwired spam bubbles, and route setup visibility through throttled setup-pulse markers so QQQ 5m can be tested without chart flooding.

- Add v0.5.16 after v0.5.15 showed `RAW SETUP: L` and the last-bar test bubble/dot but no compact markers: keep spam removed, but route visible setup markers through direct raw setup cadence on the first setup bar, every `setupPulseBars` bars, and the live bar.

- Add v0.5.17 after v0.5.16 showed `TRIGGER: SETUP LONG` and `NEXT: MARK READY` without visible markers: parallel agent review found the marker boolean path was true, so use direct raw setup proof bubbles with the v0.5.14-proven larger offset and move compact markers closer to candles.

- Add v0.5.18 after v0.5.17 proved direct `RAW L/S` bubbles render but produced too much clutter: keep the raw proof route and thin only its visual cadence to 13 bars.

- Add v0.5.19 after comparing a user-provided script whose arrows render correctly in Thinkorswim: keep v0.5.18's raw proof bubbles and add fresh dedicated raw setup arrow plots using the working pattern of direct conditions, `low/high +/- off`, `ARROW_UP/DOWN`, `AssignValueColor`, and line weight 5.

- Treat the v0.5.19 screenshot as the canonical arrow-rendering lesson: when labels/bubbles prove signal state but arrows do not render, use fresh dedicated working-style arrow plots before changing signal gates.

- Add v0.5.20 after v0.5.19 confirmed arrows render: keep working-style raw arrows default-on and hide direct raw proof bubbles by default for cleaner QQQ 5m review.

- Add `THINKSCRIPT_DEBUGGING_LESSONS.md` after receiving Claude's ThinkScript lessons: preserve general guardrails for instrumentation, time-window logic, value-based arrows, recursive state, chart timezone, versioning, and independent review.

- Add `BACKTESTING_GUARDRAILS.md` before writing any Yahoo Finance backtest: require data coverage probes, no look-ahead fills, pessimistic stop/target handling, timezone/session checks, one-position state, honest statistics, and explicit limitations.

- Add v0.5.21 after v0.5.20 was visibly too noisy: raw setup should remain a diagnostic label/source state, while default arrows should use fresh working-style plots driven only by real trade-review entries.

- Add v0.5.22 after v0.5.21 removed too many arrows: default review arrows should include first 5/6 setup edges and 6/6 upgrades, but still avoid raw cadence repeats and not reset trade tracking unless a real entry fires.

- Add v0.5.23 after v0.5.22 still showed no historical arrows: closed market is not a reason for missing past arrows, so add a slow quality-gated visual refresh for sustained 5/6 setup states while leaving real trade tracking untouched.

- Add v0.5.24 after the user scrolled v0.5.23 and still saw zero arrows: follow the instrumentation-first lesson by adding 200-bar setup/review/probe counts and visual-only score-probe arrows before changing the trading gate again.

- Trim the v0.5.24 ThinkScript header after the user reported `.ts` files were not readable again: keep the active paste file near the v0.5.17 size that opened successfully and store cumulative history in `VERSIONING.md`.

- Add v0.5.25 after v0.5.24 showed `DBG SET` and `DBG PROBE` counts but `DBG REV: NaN`: sanitize review visual booleans before counts and plot gates so probe arrows are not suppressed by an unsafe review state.

- Add v0.5.26 after v0.5.25 confirmed arrows survive recalculation but the chart was cluttered by hardwired compact `L/S` bubbles: keep arrows and diagnostics, but gate compact marker bubbles behind existing `showSignalBubbles`.

- Add v0.5.27 after v0.5.26 cleaned up marker bubbles but still showed green/red score-probe arrows as diagnostic noise: keep magenta/cyan NaN-safe review arrows default-on, make score-probe arrows opt-in through `showScoreProbeArrows = no`, and keep `DBG PROBE` counts based on probe readiness rather than the visual toggle.

- Add v0.5.28 after v0.5.27 confirmed the `.ts` file can open cleanly and the review-arrow path works, but some sideways QQQ 5m regions were still noisy: slow setup-review refresh to 21 bars and require directional follow-through so score-only 6/6 does not keep painting arrows in chop.

- Add v0.5.29 after v0.5.28 still showed repeated arrow clusters even though source diagnostics were useful: keep raw `DBG REV` counts unthrottled, add a final visible-arrow throttle with `reviewVisualMinBars = 8`, and expose `DBG VIS L/S` so chart-noise tuning does not hide raw review activity.

- Add v0.5.30 after v0.5.29 screenshots showed the indicator works in clean direction but still marks chop: filter setup-review arrows through local trend efficiency, side-specific score dominance, and EMA17 direction while leaving fast break, low-volume momentum, continuation pressure, and real-entry tracking intact.

- Add v0.5.31 after v0.5.30 screenshots still showed noisy chop arrows while `DBG CHOP` was high: apply the same chop gate to real-entry review arrows and remove low-volume momentum as a direct review-arrow bypass, while leaving actual `realLongEntry` / `realShortEntry` trade tracking intact.

- Add v0.5.32 after v0.5.31 still showed too many arrows in sideways regions: add a mixed-direction conflict filter that blocks visible review arrows when both long and short candidates fired within 13 bars, unless a fast break, continuation, or efficient VWAP/EMA-aligned move escapes the range.

- Add v0.5.33 after v0.5.32 still showed alternating chop arrows with `DBG MIX L/S: 0/0`: remove continuation pressure as an automatic mixed-conflict escape and add `DBG BOTH L/S` to distinguish conflict detection from actual blocked `DBG MIX` pulses.

- Add v0.5.34 after v0.5.33 showed `DBG BOTH L/S: 1/2` and `DBG MIX L/S: 0/2` while arrows still alternated: widen `reviewConflictLookbackBars` from 13 to 21 before changing the arrow renderer or review source gate.

- Add v0.5.35 after v0.5.34 showed `DBG BOTH L/S: 1/4` but `DBG MIX L/S: 0/2`: keep the proven arrow renderer and 21-bar conflict lookback, add `DBG ESC L/S`, and require stricter mixed-conflict escape (`0.45` trend efficiency and 3-point score separation) before a conflicted review candidate can still plot.

- Add v0.5.36 after v0.5.35 still showed too many arrows during chop and a cyan down arrow that could cause a stop-out in a pullback: keep the proven renderer, but stop raw continuation pressure from directly bypassing the review chop gate unless it breaks a wider 5-bar structure window with 2-point score dominance; add `DBG CONT L/S` to count blocked continuation bypasses.

- Add v0.5.37 after v0.5.36 screenshots showed trend and reversal behavior working but chop still leaking through: keep raw fast-break logic for real trend/reversal detection, but require a stronger review-only 5-bar fast break and 1.60 range proof before raw fast breaks can bypass review chop or escape mixed-direction conflict; add `DBG FAST L/S` to count suppressed raw fast breaks.

- Add v0.5.38 after v0.5.37 showed `DBG FAST L/S` was catching raw fast-break chop but visible arrows remained through the normal efficient-score path: keep trend/reversal and fast-break guards intact, but require the normal efficient-score review path to break 5-bar local structure before painting; add `DBG STRUCT L/S`.

- Add v0.5.40 after v0.5.39 screenshots showed `DBG VIS L/S` unchanged while candidate-level `DBG BOTH/MIX` remained too low: keep the proven arrow renderer and real trade engine, but add a final raw-pressure flip guard that remembers recent opposite pressure before earlier guards suppress it; add `DBG FLIP L/S` to prove whether chop flips are being blocked.

- Add v0.5.41 after v0.5.40 made arrows quieter but still needed risk context: require score dominance for fast-break conflict escapes and add review-only `R-TP` / `R-SL` overlays from visible review arrows, independent from real trade tracking and alerts.

- Add v0.5.42 after v0.5.41 showed useful review TP/SL context but the bubbles could cover arrows and the 1.5 ATR review TP looked too conservative for follow-through evaluation: keep real `targetATRFactor` / `stopATRFactor` unchanged, but move review arrows beyond the review stop zone and use separate review-only 2 ATR target / 1 ATR stop factors.

- Add v0.5.43 after clarifying the marker contract: compact dots should warn at 4/6 that setup is coming, while visible review arrows should appear on the next candle after a completed 5/6 trigger. Use a review-only entry plan with TP1=1R, TP2=2R, and a structure-aware stop capped by ATR risk so screenshots can judge both signal quality and risk/reward.

- Add v0.5.44 after v0.5.43 screenshots showed setup-coming dots flip-flopping in chop: keep the 4/6 early-warning idea, but make dots one-sided and stateful so the first side arms until 5/6 trigger, failure below 3/6, opposite 5/6 trigger, or a 21-bar timeout.
- Add v0.5.45 after v0.5.44 screenshots still showed setup-coming dots flip-flopping: remove timeout rearming and use a neutral-reset campaign latch, so 4/6 warning dots only re-arm after both sides cool off or a real 5/6 trigger resolves the campaign.
- Use QQQ for regular-session ETF/options validation and `/NQ` or `/MNQ` for extended-hours futures validation; do not tune one session/instrument as if it proves the other.
- For `/NQ` options, keep indicator risk labels in underlying futures points only. Estimate option dollars separately from the actual option chain quote, delta/gamma, IV, spread, expiry, and fees; do not convert chart points directly to option P/L.

## 2026-06-30

- Add v0.5.47 after `/NQ` review screenshots: keep multiple TP lines while a condition is active, show one `R-INV` bubble for non-TP/non-SL invalidation, and use PSAR alignment/gradient as review-management context rather than a replacement for hard stops.
- Add v0.6.0 as a model reset after comparing v0.5.47 with the original script: return entry arrows to original-style macro confluence, keep ready dots as soft 4/6 warnings only, and remove v0.5 diagnostic/review-arrow layers from the default user experience.
