# Decision Log

## 2026-06-19

- Use `MacroMicro_Simplified_v0.2.0.ts` for the next signal-logic/dashboard iteration because v0.2.0 changes gating, candle confirmation, bubbles, and dashboard behavior.
- Optimize for 5-minute behavior first, then validate/tune 15-minute behavior separately.
- Keep the 5-of-6 arrow trigger and 4-of-6 standby threshold for v0.2.0.
- Use stronger RVOL and candle confirmation before adding any higher-timeframe entry gate.
- Consider 1-hour as the first higher-timeframe context candidate; keep 4-hour and daily as broader context until testing proves otherwise.
- Add v0.2.1 as the first trade-management refinement: first signal gets `ENTRY`, same-direction repeat signals become `ADD`, target/stop bubbles default on, and score breakdown to 3/6 shows `DANGER`.
