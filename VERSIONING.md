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

## Version Meaning

- Patch: compile fix, typo, small parameter/default change.
- Minor: signal logic, dashboard, target/stop, or filter changes.
- Major: a materially different trading model.
