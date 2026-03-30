# Direct Google Sign-In Flow Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route all unauthenticated users through an app-owned `/sign-in` page that immediately starts Google OAuth instead of showing the Auth.js provider-selection page.

**Architecture:** Keep Auth.js as the session/OAuth engine, but move the user-facing entrypoint into the app. Protected routes redirect to `/sign-in` with the full requested destination preserved, and the new client page triggers `signIn("google")` on mount while keeping a visible fallback.

**Tech Stack:** Next.js 16 App Router, NextAuth v4, React 19, Vitest, Testing Library

---

### Task 1: Save The Approved Auth Flow Design

**Files:**
- Create: `docs/superpowers/specs/2026-03-30-direct-google-sign-in-flow-design.md`
- Create: `docs/superpowers/plans/2026-03-30-direct-google-sign-in-flow.md`

- [ ] **Step 1: Save the design doc**

Capture the approved behavior for the app-owned `/sign-in` entrypoint, landing-page CTA changes, and middleware redirect changes.

- [ ] **Step 2: Save the implementation plan**

Write the exact implementation and verification steps for the auth-flow change.

### Task 2: Redirect Landing-Page CTAs Into The App-Owned Entry Point

**Files:**
- Modify: `src/app/page.tsx`
- Test: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Write the failing test**

Extend the homepage test to assert that the sign-in CTAs link to `/sign-in?callbackUrl=%2Fworkspace`.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/app/home-page.test.tsx`

Expected: FAIL because the page still links directly to `/api/auth/signin/google`.

- [ ] **Step 3: Write the minimal implementation**

Update both landing-page sign-in links to point at the new `/sign-in` route.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- tests/app/home-page.test.tsx`

Expected: PASS

### Task 3: Add The Direct Google Sign-In Page

**Files:**
- Create: `src/app/sign-in/page.tsx`
- Test: `tests/app/sign-in-page.test.tsx`

- [ ] **Step 1: Write the failing test**

Add a client-page test that verifies:
- the page triggers `signIn("google", { callbackUrl })` on mount
- the page renders redirect messaging
- the fallback button triggers `signIn("google", { callbackUrl })` when clicked

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/app/sign-in-page.test.tsx`

Expected: FAIL because the route does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

Create the `/sign-in` page with a mount effect that starts Google sign-in and a fallback button.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- tests/app/sign-in-page.test.tsx`

Expected: PASS

### Task 4: Redirect Protected Routes To The New Entry Point

**Files:**
- Modify: `middleware.ts`
- Test: `tests/middleware.test.ts`

- [ ] **Step 1: Write the failing test**

Add middleware tests that verify:
- protected unauthenticated requests redirect to `/sign-in`
- `callbackUrl` preserves the original path and query string
- authenticated requests still continue
- public routes still continue

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/middleware.test.ts`

Expected: FAIL because middleware still redirects to `/`.

- [ ] **Step 3: Write the minimal implementation**

Update middleware to send unauthenticated protected requests to `/sign-in` with the original destination encoded in `callbackUrl`.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- tests/middleware.test.ts`

Expected: PASS

### Task 5: Verify End State

**Files:**
- Verify only

- [ ] **Step 1: Run focused tests**

Run: `npm test -- tests/app/home-page.test.tsx tests/app/sign-in-page.test.tsx tests/middleware.test.ts`

Expected: PASS

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: PASS

- [ ] **Step 3: Review the working tree**

Run: `git status --short`

Expected: only intended tracked file changes remain, with `.env.local` still ignored.
