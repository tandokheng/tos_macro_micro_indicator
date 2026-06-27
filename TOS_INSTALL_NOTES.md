# Thinkorswim Install Notes

## Current Test Script

- File: `MacroMicro_Simplified_v0.5.25.ts`
- Import-ready file: `_dk_codex_macro_micro_v1.ts`
- Side-panel readable copy: `MacroMicro_Simplified_v0.5.25_READABLE.txt`
- Thinkorswim study to replace: `_dk_codex_macro_micro_v1`
- Primary chart for review: QQQ 5-minute, 20-day view

## What v0.5.25 Is Testing

- `BUILD: v0.5.25 NAN SAFE` is always visible through a static `AddLabel(yes, ...)`; if absent, TOS is not running this pasted build or study labels are hidden.
- v0.5.14 proved raw setup pressure can render, but it did so with intentionally noisy `SPAM L/S` bubbles. v0.5.15 removed those hardwired spam bubbles.
- v0.5.19 proved the real missing-arrow issue was Thinkorswim arrow plot rendering/style state, not raw setup gating.
- The working arrow primitive is now documented: fresh dedicated plot name, direct condition, `low/high +/- off`, `ARROW_UP/DOWN`, `AssignValueColor`, and line weight 5.
- v0.5.20 proved the working arrows were visible but too noisy because raw setup cadence became the default arrow layer.
- v0.5.21 proved entry-only review arrows were too strict and could make arrows disappear again.
- v0.5.22 proved first-edge/6-upgrade review arrows were still too sparse on historical candles and could show no arrows while the market was closed.
- v0.5.23 keeps raw setup labels for diagnosis and adds a slow quality-gated `setupReviewRefreshBars = 13` visual refresh for sustained 5/6 setups.
- v0.5.23 still showed no arrows after scrolling, so v0.5.24 adds explicit `DBG SET`, `DBG REV`, and `DBG PROBE` count labels before changing the trading model again.
- v0.5.24 screenshot showed `DBG SET` and `DBG PROBE` counts were alive, but `DBG REV` and `DBG ANY` were `NaN`; that can suppress both review arrows and probe-arrow fallback after Thinkorswim recalculates.
- v0.5.25 sanitizes review visual booleans into 0/1 flags before they drive counts, review arrows, and probe-arrow suppression.
- v0.5.25 uses fresh dedicated `ReviewLongArrowV0525` / `ReviewShortArrowV0525` and `ScoreProbeLongArrowV0525` / `ScoreProbeShortArrowV0525` plots to avoid saved TOS plot-style drift.
- Direct `RAW L/S` proof bubbles remain available but default off through `showRawProofBubbles = no`, because arrows are now the cleaner review path.
- Compact `L/S` markers still render for comparison, but they now use a closer candle offset so TOS is less likely to clip them off-scale.
- `RAW SETUP: L/S/-` and `RAW CONT: L/S/-` remain visible through static labels so screenshots still show whether the source logic is firing.
- `MARKER: NONE/L/S/BOTH` and `CONTRACT: OK/FAIL TRIGGER/MARKER` remain visible. Capture a screenshot if the contract fails.
- A cyan `v0.5.25 TEST` bubble and `BuildProofDotV0513` point remain on the last loaded bar to prove the chart-bubble/point drawing paths are active independent of signal logic.
- Real trade entries and PT/SL tracking still use `realLongEntry` / `realShortEntry`; visual setup markers do not reset entry price, ATR, target, or stop.
- RVOL remains a `CAUTION` source for qualified setups, not a hard blocker by itself.

## Current Manual Test Flow

- Paste `_dk_codex_macro_micro_v1.ts` into the Thinkorswim study `_dk_codex_macro_micro_v1`.
- If the `.ts` file does not open in Codex side panel, open `MacroMicro_Simplified_v0.5.25_READABLE.txt`; it is verified to match the `.ts` source exactly.
- Confirm the pasted source header shows `# Version: v0.5.25`.
- Confirm the chart labels show `BUILD: v0.5.25 NAN SAFE`, `RAW SETUP`, `RAW CONT`, `DBG SET L200/S200`, `DBG REV L200/S200`, `DBG PROBE L/S`, and `CONTRACT: OK` or `FAIL TRIGGER/MARKER`.
- Confirm old `SPAM L` / `SPAM S` bubbles are gone.
- Confirm direct `RAW L` / `RAW S` proof bubbles are hidden by default.
- If magenta/cyan review arrows are absent, read the debug counts: `DBG REV` should no longer show `NaN`; nonzero `DBG PROBE` should show green/red probe arrows on some historical bars unless review arrows already consumed those bars.
- Review QQQ 5m first; defer 15m validation until 5m marker behavior is acceptable.

## Codex Link Note

- In chat, use clickable file links with `C:/Users/tan_d/...`; the `/mnt/c/...` form does not open reliably in the side panel.
- Keep the current versioned `.ts` file compact. The side panel opened v0.5.17 reliably at about 47 KB; v0.5.24's long cumulative header pushed it above that range, so the header was trimmed and the full history stays in `VERSIONING.md`.

## Arrow Rendering Lesson

- When chart labels/bubbles prove a ThinkScript boolean is true but arrows are missing, do not keep loosening signal logic first.
- Thinkorswim can retain hidden/custom style state or behave poorly with inherited/multiplexed arrow plots.
- Use fresh dedicated arrow plot names and the simple working primitive: direct condition, `low/high +/- off`, `PaintingStrategy.ARROW_UP/DOWN`, `AssignValueColor`, and `SetLineWeight(5)`.
- After visibility is proven, tune the trigger layer separately: raw cadence can be too noisy, while entry-only gates can be too sparse. Prefer setup-edge or quality-upgrade review arrows before changing trade tracking.
- Closed-market charts should still render historical arrows. If the test bubble renders but no past arrows appear, debug the historical signal gate, not market status.

## General ThinkScript Debugging Lessons

- Instrument first with on-chart state labels. If a study renders nothing, check the bottom error line in the ThinkScript editor.
- Same-day time windows require `afterStart and beforeEnd`; reserve `or` for windows crossing midnight.
- Use value-based arrow plots at price offsets instead of `PaintingStrategy.BOOLEAN_ARROW`.
- Keep recursive state simple and avoid conditional self-references inside `Max()` / `Min()` calls.
- Session times are in the chart timezone; make time presets explicit when time logic is added.
- See `THINKSCRIPT_DEBUGGING_LESSONS.md` for the full checklist.
