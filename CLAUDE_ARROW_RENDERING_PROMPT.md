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
- Use v0.5.23's review-refresh idea as the starting point: real entries plus setup-edge/quality-upgrade review arrows and a slow quality-gated sustained setup refresh, not repeated raw cadence.
- Update VERSIONING.md, TOS_INSTALL_NOTES.md, NEXT_TASKS.md, FOLLOW_UP.md, PROJECT_PLAN.md, QQQ_5M_REVIEW_LOG.md, and DECISION_LOG.md.
- Commit and push useful checkpoints.
```
