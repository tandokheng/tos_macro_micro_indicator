# Indicator Versioning

Use an explicit version in every new indicator file and in the file header.

## Convention

- File name: `MacroMicro_Simplified_vX.Y.Z.ts`
- Header line: `# Version: vX.Y.Z`
- Optional short label: `# Label: 5-of-6 intraday simplified`

## Current Baseline

- `MacroMicro_Simplified_5of6.ts` is the unversioned first simplified baseline.
- The next generated copy should start at `v0.2.0` unless it is only a compile fix, in which case use `v0.1.1`.

## Version Meaning

- Patch: compile fix, typo, small parameter/default change.
- Minor: signal logic, dashboard, target/stop, or filter changes.
- Major: a materially different trading model.
