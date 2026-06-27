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
