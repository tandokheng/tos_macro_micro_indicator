# Claude Prompt: Thinkorswim Arrow Rendering Lesson

Use this prompt when asking Claude to help with the Thinkorswim macro/micro indicator arrow visibility issue.

```text
Open this project folder:
C:\Users\tan_d\_Project Local Drive\TOS-macro-micro-indicator

Do not work from the old OneDrive folder unless only reading old context.

Task context:
- The active Thinkorswim study is `_dk_codex_macro_micro_v1`.
- Keep `_dk_codex_macro_micro_v1.ts` synced exactly to the latest versioned file.
- Run `tests\verify_simplified_indicator.ps1` after changes.
- Use QQQ 5m first; keep 15m validation separate.

Critical learning from v0.5.19:
- The missing-arrow problem was not primarily signal gating.
- Earlier builds proved raw setup state and chart bubbles rendered, but old/multiplexed arrow plot paths still failed to show arrows.
- User provided a separate ThinkScript where arrows rendered correctly.
- The working primitive was:
  - fresh dedicated plot name,
  - direct condition,
  - `low - off` for up arrows and `high + off` for down arrows,
  - `SetPaintingStrategy(PaintingStrategy.ARROW_UP/DOWN)`,
  - `AssignValueColor(...)`,
  - `SetLineWeight(5)`.
- v0.5.19 copied that primitive into fresh `RawSetupLongArrowV0519` / `RawSetupShortArrowV0519` plots, and the user confirmed arrows appeared in Thinkorswim.

Rule for future debugging:
- If labels/bubbles prove the signal boolean is true but arrows do not show, stop changing the signal gates first.
- Treat it as a Thinkorswim rendering/style-state problem.
- Use fresh dedicated plot names and the simple working arrow primitive above.
- Avoid old plot names that may inherit hidden/custom TOS style settings.
- Avoid hiding essential diagnostic visuals behind new saved inputs during diagnosis; saved Thinkorswim input values can drift.
- After the visual route is proven, gate or remove noisy proof bubbles so the chart becomes usable again.
- Do not swing from raw setup cadence directly to entry-only arrows without checking screenshots. v0.5.20 was too noisy because raw cadence became the default arrow layer; v0.5.21 was too sparse because arrows were entry-only. Prefer balanced setup-review edges such as first 5/6 setup bars or 6/6 upgrades while keeping trade tracking tied to real entries.
- After v0.5.23, remember that once the arrow primitive is proven, zero arrows after scrolling is likely a silent signal-gate issue, not market status. Instrument first with setup/review/probe counts before loosening the trading model.
- v0.5.24's intended diagnostic pattern is `DBG SET L200/S200`, `DBG REV L200/S200`, and `DBG PROBE L/S`: nonzero SET with zero REV means the review gate is too strict; zero SET means the setup source is absent in the loaded region. Green/red score-probe arrows are visual-only and must not feed entries, target/stop tracking, or alerts.
- v0.5.24 screenshot showed a more specific trap: `DBG SET` and `DBG PROBE` were numeric but `DBG REV` / `DBG ANY` were `NaN`, and arrows disappeared after TOS recalculated. That means the visual review boolean was unsafe; sanitize booleans into 0/1 flags before using them in `Sum`, `HighestAll`, negation gates, or arrow plots.
- v0.5.25 proved arrows survive after NaN-safe review sanitization, but hardwired compact `L/S` marker bubbles cluttered the chart. Keep proof bubbles optional/off by default once arrows are confirmed.
- v0.5.26 proved the clean visual direction: marker bubbles can be gated behind `showSignalBubbles`, and NaN-safe review arrows remain visible. v0.5.27 then makes green/red score-probe arrows opt-in while keeping `DBG PROBE` counts based on probe readiness, not on the visual arrow toggle.
- v0.5.27 confirmed the `.ts` file can open fine and the review-arrow path works, but some sideways regions are still noisy. v0.5.28 tightened the review gate by slowing refresh and requiring directional follow-through. v0.5.29 adds a final visible-arrow throttle, keeps raw `DBG REV` counts unthrottled, and adds `DBG VIS L/S` for the actual plotted arrow count.
- Do not "fix" noise by hiding raw diagnostics. Tune the visible layer first (`reviewVisualMinBars`) when `DBG REV` is high but `DBG VIS` is acceptably lower.
- v0.5.29 screenshots showed clear-direction arrows are useful but chop is still poor. v0.5.30 adds a setup-review chop filter using trend efficiency, score dominance, and EMA17 direction, plus `DBG CHOP L/S` for blocked pulses. If `DBG CHOP` rises in sideways regions, tune those thresholds before touching the working arrow primitive.
- v0.5.30 follow-up showed a second chop lesson: if `DBG CHOP` is high but arrows are still noisy, look for visible-arrow sources that bypassed the filter. v0.5.31 gates real-entry review arrows through the same chop filter and removes low-volume momentum as a direct review-arrow bypass. Actual `realLongEntry` / `realShortEntry` trade tracking remains unchanged.
- v0.5.31 follow-up showed a third chop lesson: even after all visible sources pass the same chop gate, alternating long/short review candidates can still survive the visual throttle. v0.5.32 adds a mixed-direction conflict filter and `DBG MIX L/S`; if `DBG MIX` rises while `DBG VIS` drops in sideways regions, the filter is working.
- v0.5.32 follow-up showed a fourth chop lesson: `DBG MIX` counted blocked mixed-conflict pulses only, so `DBG MIX: 0/0` did not prove no conflict was detected. v0.5.33 adds `DBG BOTH L/S` for detected long/short conflict and removes continuation pressure as an automatic mixed-conflict escape.
- v0.5.33 follow-up showed a fifth chop lesson: if `DBG BOTH` is nonzero but still low while arrows alternate, tune the mixed-conflict lookback before changing the renderer. v0.5.34 widens `reviewConflictLookbackBars` from 13 to 21.
- v0.5.34 follow-up showed a sixth chop lesson: if `DBG BOTH` rises but `DBG MIX` remains modest, the conflict is being detected but escaping. Add/read `DBG ESC L/S`, then tighten the mixed-conflict escape threshold before touching the proven arrow renderer. v0.5.35 keeps the 21-bar lookback, adds `DBG ESC L/S`, and requires `minConflictEscapeTrendEfficiency = 0.45` plus `minConflictEscapeScoreSeparation = 3` for non-fast-break mixed-conflict escapes.
- Avoid forward self-reference traps in throttles. Keep self-referential state inside `CompoundValue`; do not define a separate `ready` boolean before the recursive state and then use it inside that same state expression.

General ThinkScript debugging rules:
- Instrument first with on-chart state labels. If the study shows nothing, ask the human to read the bottom error line in the ThinkScript editor.
- Same-day time windows use `afterStart and beforeEnd`; use `or` only for windows that cross midnight.
- Use value-based arrow plots at `low/high +/- off`, not `PaintingStrategy.BOOLEAN_ARROW`.
- Keep recursive self-references simple; avoid wrapping `x[1]` inside conditional expressions inside `Max()` / `Min()` calls.
- Session times are in the chart timezone. Make times inputs and document ET/SGT presets when time logic is introduced.
- Version every study, sync `_dk_codex_macro_micro_v1.ts`, and run an independent review pass because the assistant cannot execute thinkScript.

Current next direction:
- Build from the latest versioned file.
- Keep the working-style arrows as the default visible marker path.
- Hide raw proof bubbles by default once arrows are confirmed.
- Use v0.5.35's strict-mix build as the starting point: NaN-safe raw review diagnostics remain active, compact `L/S` marker bubbles are optional through `showSignalBubbles`, green/red score-probe arrows are off by default through `showScoreProbeArrows`, setup-review and real-entry review arrows need chop-filter approval, `DBG BOTH L/S` shows detected mixed long/short conflict, `DBG ESC L/S` shows detected conflicts that escaped, `DBG MIX L/S` shows blocked mixed-conflict review pulses, `reviewConflictLookbackBars` defaults to 21, and mixed-conflict escape is stricter than the general chop gate.
- Update VERSIONING.md, TOS_INSTALL_NOTES.md, NEXT_TASKS.md, FOLLOW_UP.md, PROJECT_PLAN.md, QQQ_5M_REVIEW_LOG.md, and DECISION_LOG.md.
- Commit and push useful checkpoints.
```
