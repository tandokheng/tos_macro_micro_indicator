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

## Version Meaning

- Patch: compile fix, typo, small parameter/default change.
- Minor: signal logic, dashboard, target/stop, or filter changes.
- Major: a materially different trading model.
