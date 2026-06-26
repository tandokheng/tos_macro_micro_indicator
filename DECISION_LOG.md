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
