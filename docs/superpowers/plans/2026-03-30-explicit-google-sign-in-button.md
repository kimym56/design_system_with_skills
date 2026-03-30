# Explicit Google Sign-In Button Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send explicit landing-page `Sign in with Google` clicks directly into Google OAuth, while preserving the `/sign-in` route for forced sign-in redirects from protected pages.

**Architecture:** Keep the landing page as a Server Component and introduce a small client auth button component that calls `signIn("google", { callbackUrl })`. Reuse the existing middleware and `/sign-in` route for protected-route redirects so reliability does not change.

**Tech Stack:** Next.js 16 App Router, NextAuth v4, React 19, Vitest, Testing Library

---

### Task 1: Save The Approved Design

**Files:**
- Create: `docs/superpowers/specs/2026-03-30-explicit-google-sign-in-button-design.md`
- Create: `docs/superpowers/plans/2026-03-30-explicit-google-sign-in-button.md`

- [ ] **Step 1: Save the design doc**

Capture the approved split between direct landing-page sign-in clicks and `/sign-in` forced redirects.

- [ ] **Step 2: Save the implementation plan**

Write the exact test and implementation steps for the smaller CTA change.

### Task 2: Lock The Landing-Page Sign-In Behavior With A Failing Test

**Files:**
- Modify: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Write the failing test**

Change the homepage test to verify:
- the sign-in controls are buttons
- clicking them calls `signIn("google", { callbackUrl: "/workspace" })`

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/app/home-page.test.tsx`

Expected: FAIL because the page still renders sign-in links to `/sign-in`.

### Task 3: Add A Client Sign-In Button And Wire It Into The Landing Page

**Files:**
- Create: `src/components/auth/google-sign-in-button.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Write the minimal implementation**

Create a small client component that renders a button and calls `signIn("google", { callbackUrl })` on click.

- [ ] **Step 2: Update the landing page**

Replace the two landing-page sign-in links with the new client button component, keeping the page itself server-rendered.

- [ ] **Step 3: Run the focused test to verify it passes**

Run: `npm test -- tests/app/home-page.test.tsx`

Expected: PASS

### Task 4: Verify End State

**Files:**
- Verify only

- [ ] **Step 1: Run focused auth tests**

Run: `npm test -- tests/app/home-page.test.tsx tests/app/sign-in-page.test.tsx tests/middleware.test.ts`

Expected: PASS

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: PASS

- [ ] **Step 3: Review the working tree**

Run: `git status --short`

Expected: only intended tracked file changes remain, with `.env.local` still ignored.
