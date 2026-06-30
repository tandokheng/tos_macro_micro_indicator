# v0.6.0 Simplified Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `MacroMicro_Simplified_v0.6.0.ts` as a clean reset based on the original macro-confluence script, with one ready dot, one entry arrow, and simple R-based management.

**Architecture:** Create a new versioned ThinkScript study rather than refactoring v0.5.47. Replace the existing v0.5-heavy verifier contract with focused v0.6.0 checks, then sync the import-ready and readable copies exactly.

**Tech Stack:** ThinkScript source files, PowerShell static verifier, Git.

---

### Task 1: Verifier Contract

**Files:**
- Modify: `tests/verify_simplified_indicator.ps1`

- [x] **Step 1: Write failing v0.6.0 checks**

Check for `MacroMicro_Simplified_v0.6.0.ts`, exact `_dk_codex_macro_micro_v1.ts` sync, the clean macro-confluence engine, ready score dots, one entry arrow family, R-based management, and absence of v0.5 debug clutter.

- [x] **Step 2: Run verifier to confirm red**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File tests\verify_simplified_indicator.ps1`
Expected: fails because `MacroMicro_Simplified_v0.6.0.ts` does not exist yet.

### Task 2: Clean Study

**Files:**
- Create: `MacroMicro_Simplified_v0.6.0.ts`
- Create: `MacroMicro_Simplified_v0.6.0_READABLE.txt`
- Modify: `_dk_codex_macro_micro_v1.ts`

- [x] **Step 1: Create v0.6.0 source**

Implement the approved reset design with original macro confluence as the only entry arrow path, soft score ready dots, R-based plan levels, invalidation, and PSAR runner context.

- [x] **Step 2: Sync import/readable files**

Copy the final source exactly to `_dk_codex_macro_micro_v1.ts` and `MacroMicro_Simplified_v0.6.0_READABLE.txt`.

### Task 3: Notes, Verify, Checkpoint

**Files:**
- Modify: `VERSIONING.md`
- Modify: `NEXT_TASKS.md`
- Modify: `FOLLOW_UP.md`
- Modify: `DECISION_LOG.md`

- [x] **Step 1: Update project notes**

Record the v0.6.0 reset and make v0.6.0 the active install target.

- [x] **Step 2: Verify**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File tests\verify_simplified_indicator.ps1`
Expected: `Simplified indicator verification passed.`

- [x] **Step 3: Commit and push**

Commit with `Add simplified macro reset build` and push `main`.
