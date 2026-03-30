# Local Env / Vercel Env Split Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move local secrets to `.env.local`, document the local-versus-Vercel env split, and verify the CLI env-loading path still works.

**Architecture:** Keep runtime behavior aligned with Next.js defaults. Local development uses `.env.local`, committed examples stay in `.env.example`, and deployed secrets stay in Vercel. Update the CLI env helper test to exercise development-style `.env.local` loading explicitly.

**Tech Stack:** Next.js 16, `@next/env`, Vitest, Vercel

---

### Task 1: Document The Agreed Env Strategy

**Files:**
- Create: `docs/superpowers/specs/2026-03-30-local-env-vercel-env-split-design.md`
- Create: `docs/superpowers/plans/2026-03-30-local-env-vercel-env-split.md`

- [ ] **Step 1: Save the approved design**

Write the approved design doc describing:
- `.env.local` for local secrets
- `.env.example` for committed examples
- Vercel env vars for deployed secrets

- [ ] **Step 2: Save the implementation plan**

Write the implementation plan with the exact files, test steps, and verification commands.

### Task 2: Update Local Env Loading Behavior

**Files:**
- Modify: `src/lib/load-cli-env.ts`
- Test: `tests/config/load-cli-env.test.ts`

- [ ] **Step 1: Write the failing test**

Add a test that writes `.env.local` in a temp project directory and calls `loadCliEnv()` in development mode.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/config/load-cli-env.test.ts`

Expected: FAIL because the helper test still only covers `.env`.

- [ ] **Step 3: Write the minimal implementation**

Update `loadCliEnv()` so callers can explicitly request development-mode loading and the helper defaults stay sensible for local CLI usage.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- tests/config/load-cli-env.test.ts`

Expected: PASS

### Task 3: Move Local Secrets And Document Usage

**Files:**
- Modify: `README.md`
- Rename: `.env` -> `.env.local`

- [ ] **Step 1: Move the local secret file**

Rename the local machine secret file from `.env` to `.env.local`.

- [ ] **Step 2: Update README**

Add a short section that states:
- local secrets belong in `.env.local`
- Vercel `Preview`/`Production` use project env vars
- Google OAuth should include both localhost and production callback URLs

- [ ] **Step 3: Verify local secret files remain ignored**

Run: `git status --short`

Expected: `.env.local` should remain untracked because `.gitignore` already ignores `.env*`.

### Task 4: Verify End State

**Files:**
- Verify only

- [ ] **Step 1: Run focused tests**

Run: `npm test -- tests/config/load-cli-env.test.ts`

Expected: PASS

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: PASS

- [ ] **Step 3: Review git status**

Run: `git status --short`

Expected: only intended tracked file changes remain, with local secret files ignored.
