# Account Menu Style Alignment Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the shared account trigger and dropdown so they match the app's existing border radius, surface, and shadow language.

**Architecture:** Keep the existing shared `AccountMenu` behavior intact and limit the work to visual class changes in that component. Use one focused component test to lock the approved geometry and panel styling without spreading design assertions across unrelated page tests.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Vitest, Testing Library

---

### Task 1: Save The Approved Style Design

**Files:**
- Create: `docs/superpowers/specs/2026-03-30-account-menu-style-alignment-design.md`
- Create: `docs/superpowers/plans/2026-03-30-account-menu-style-alignment.md`

- [ ] **Step 1: Save the design doc**

Capture the approved shift from pill-like account chrome to app-aligned rectangular controls.

- [ ] **Step 2: Save the implementation plan**

Write the exact focused test and verification steps for the account-menu restyle.

### Task 2: Lock The Account Menu Geometry With A Failing Test

**Files:**
- Modify: `tests/components/auth/account-menu.test.tsx`

- [ ] **Step 1: Write the failing test**

Extend the component test to verify:
- homepage trigger uses the larger app-aligned radius
- compact trigger uses the tighter app-shell radius
- dropdown panel uses the app-aligned card radius

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/components/auth/account-menu.test.tsx`

Expected: FAIL because the trigger still uses the pill-like shape and the panel radius/shadow are not yet aligned.

### Task 3: Restyle The Shared Account Menu

**Files:**
- Modify: `src/components/auth/account-menu.tsx`
- Test: `tests/components/auth/account-menu.test.tsx`

- [ ] **Step 1: Write the minimal implementation**

Adjust the trigger, panel, and row classes so they match the rest of the app's button/card language.

- [ ] **Step 2: Run the focused test to verify it passes**

Run: `npm test -- tests/components/auth/account-menu.test.tsx`

Expected: PASS

### Task 4: Verify End State

**Files:**
- Verify only

- [ ] **Step 1: Run focused account tests**

Run: `npm test -- tests/components/auth/account-menu.test.tsx tests/app/home-page.test.tsx tests/app/app-layout.test.tsx tests/components/generation-history-shell.test.tsx`

Expected: PASS

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: PASS

- [ ] **Step 3: Review the working tree**

Run: `git status --short`

Expected: only intended tracked file changes remain.
