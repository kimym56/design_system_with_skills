# Signed-In Account Menu Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface the current signed-in account in the homepage and app shell, replacing signed-in Google CTAs and the app-shell `Generation history` label with a shared account menu.

**Architecture:** Resolve the current session in Server Components/layouts with `getServerAuthSession()`, then pass minimal user display props into one small client account-menu component. Reuse that component in a larger `homepage` presentation and a tighter `compact` presentation so the menu behavior stays shared while the chrome stays context-appropriate.

**Tech Stack:** Next.js 16 App Router, NextAuth v4, React 19, Vitest, Testing Library

---

### Task 1: Save The Approved Signed-In Account Design

**Files:**
- Create: `docs/superpowers/specs/2026-03-30-signed-in-account-menu-design.md`
- Create: `docs/superpowers/plans/2026-03-30-signed-in-account-menu.md`

- [ ] **Step 1: Save the design doc**

Capture the approved adaptive account-chip behavior for the homepage and generation-history shell.

- [ ] **Step 2: Save the implementation plan**

Write the exact TDD and verification steps for the shared account-menu work.

### Task 2: Lock Homepage Signed-In Versus Signed-Out Behavior

**Files:**
- Modify: `tests/app/home-page.test.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write the failing tests**

Add homepage coverage for:
- signed-out state still rendering Google sign-in buttons
- signed-in state rendering the larger account chip instead of Google sign-in

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/app/home-page.test.tsx`

Expected: FAIL because the homepage does not yet branch on session state.

- [ ] **Step 3: Write the minimal implementation**

Make the homepage an async Server Component that reads `getServerAuthSession()` and swaps signed-in CTA chrome accordingly.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- tests/app/home-page.test.tsx`

Expected: PASS

### Task 3: Build The Shared Client Account Menu

**Files:**
- Create: `src/components/auth/account-menu.tsx`
- Test: `tests/components/auth/account-menu.test.tsx`

- [ ] **Step 1: Write the failing tests**

Add account-menu tests that verify:
- avatar fallback initials render
- menu opens and closes
- user name and email display
- `Workspace` and `History` links appear
- `Sign out` calls `signOut({ callbackUrl: \"/\" })`

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/components/auth/account-menu.test.tsx`

Expected: FAIL because the component does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

Create the shared client account-menu component with `homepage` and `compact` variants.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- tests/components/auth/account-menu.test.tsx`

Expected: PASS

### Task 4: Replace The App-Shell Label With The Compact Account Trigger

**Files:**
- Modify: `src/app/(app)/(generation-history)/layout.tsx`
- Modify: `src/components/generation-history-shell.tsx`
- Modify: `tests/app/app-layout.test.tsx`
- Modify: `tests/components/generation-history-shell.test.tsx`

- [ ] **Step 1: Write the failing tests**

Add layout/shell coverage for:
- session user data being passed into the shell
- the compact account trigger rendering instead of `Generation history`

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `npm test -- tests/app/app-layout.test.tsx tests/components/generation-history-shell.test.tsx`

Expected: FAIL because the shell still renders the static label and does not accept account props.

- [ ] **Step 3: Write the minimal implementation**

Resolve the session in the generation-history layout and pass the minimal user display data into the shell, then swap the top-bar label for the compact account trigger.

- [ ] **Step 4: Run the focused tests to verify they pass**

Run: `npm test -- tests/app/app-layout.test.tsx tests/components/generation-history-shell.test.tsx`

Expected: PASS

### Task 5: Verify End State

**Files:**
- Verify only

- [ ] **Step 1: Run focused account/auth tests**

Run: `npm test -- tests/app/home-page.test.tsx tests/app/app-layout.test.tsx tests/components/generation-history-shell.test.tsx tests/components/auth/account-menu.test.tsx`

Expected: PASS

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: PASS

- [ ] **Step 3: Review the working tree**

Run: `git status --short`

Expected: only intended tracked file changes remain, with `.env.local` still ignored.
