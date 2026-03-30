# DSSkills Product Frame Landing Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public landing page into the approved DSSkills product-frame layout with auth-aware CTA behavior, a static workspace specimen, three product cards, and a four-icon footer.

**Architecture:** Keep session resolution in the existing async App Router page and move only scroll/focus CTA behavior into a small client landing component. Lock the redesign with homepage tests plus a focused interaction test for the signed-out `Try DSSkills` focus-transfer behavior.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, local UI primitives, next-auth, Vitest, Testing Library

---

## File Structure

- Create: `src/components/landing-page-shell.tsx`
  Purpose: Render the approved landing layout and own sticky-header scroll state plus signed-out CTA scroll/focus behavior.
- Modify: `src/components/auth/google-sign-in-button.tsx`
  Purpose: Forward a button ref so the landing shell can focus the main Google CTA.
- Modify: `src/app/page.tsx`
  Purpose: Keep server-side session lookup and pass auth state into the new landing shell.
- Modify: `src/app/globals.css`
  Purpose: Add any shared landing-specific keyframes or utility selectors needed for the highlight treatment.
- Modify: `tests/app/home-page.test.tsx`
  Purpose: Replace the old homepage assertions with the approved landing contract.
- Create: `tests/components/landing-page-shell.test.tsx`
  Purpose: Verify the signed-out `Try DSSkills` interaction scrolls and focuses the hero Google button.

## Chunk 1: Test Contract Rewrite

### Task 1: Update the homepage test to the approved DSSkills contract

**Files:**

- Modify: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Rewrite the signed-out homepage assertions**

Replace the old evaluation-playground assertions with checks for:

- heading text matching the new hero
- top-right `Try DSSkills` button
- one main `Sign in with Google` button
- the three product-card labels
- footer links for email, GitHub, LinkedIn, and website
- absence of the old homepage copy such as `generate design system components with agent skills`

- [ ] **Step 2: Rewrite the signed-in homepage assertions**

Change the signed-in test so it asserts:

- `Try DSSkills` links to `/workspace`
- the signed-out Google button is not rendered
- the old homepage account-chip assumption is removed

- [ ] **Step 3: Add a focused component test for signed-out CTA orchestration**

Create `tests/components/landing-page-shell.test.tsx` with a test that:

- renders the landing shell in signed-out mode
- stubs `scrollIntoView`
- clicks `Try DSSkills`
- verifies the main Google button receives focus
- verifies highlight state or highlight marker is applied

- [ ] **Step 4: Run the targeted tests to verify they fail**

Run: `npx vitest run tests/app/home-page.test.tsx tests/components/landing-page-shell.test.tsx`

Expected: FAIL because the current homepage still renders the previous layout and the landing shell component does not exist yet.

## Chunk 2: Landing Shell Implementation

### Task 2: Create the client landing shell and ref-forwarding sign-in button

**Files:**

- Create: `src/components/landing-page-shell.tsx`
- Modify: `src/components/auth/google-sign-in-button.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/components/landing-page-shell.test.tsx`

- [ ] **Step 1: Implement the smallest possible `LandingPageShell` API**

Create a client component that accepts minimal auth props, for example:

```tsx
type LandingPageShellProps = {
  isSignedIn: boolean;
};
```

Its initial responsibility is just:

- render the sticky header and hero CTA targets
- expose the signed-out `Try DSSkills` click handler
- toggle a highlight marker on the hero CTA

- [ ] **Step 2: Make `GoogleSignInButton` forward its ref**

Refactor the button to use `React.forwardRef<HTMLButtonElement, GoogleSignInButtonProps>` so the landing shell can focus it directly.

- [ ] **Step 3: Add the signed-out interaction behavior**

On signed-out `Try DSSkills` click:

- prevent navigation
- call `scrollIntoView({ behavior: "smooth", block: "center" })` on the main Google button
- move focus to that button
- set temporary highlight state

On signed-in render:

- make `Try DSSkills` a normal link to `/workspace`

- [ ] **Step 4: Add the landing highlight animation**

Add the minimal CSS needed for a short pulse or ring treatment in `src/app/globals.css`. Keep it narrowly scoped to landing-specific selectors or animation names.

- [ ] **Step 5: Run the landing-shell tests**

Run: `npx vitest run tests/components/landing-page-shell.test.tsx`

Expected: PASS

## Chunk 3: Homepage Layout Rewrite

### Task 3: Rebuild `src/app/page.tsx` around the approved landing shell

**Files:**

- Modify: `src/app/page.tsx`
- Modify: `tests/app/home-page.test.tsx`
- Create or modify: `src/components/landing-page-shell.tsx`

- [ ] **Step 1: Replace the page-level homepage markup with the new shell**

Keep:

- `getServerAuthSession()`
- `toAccountMenuUser()` only if still needed for display

Replace the current card-heavy homepage JSX with a single render of the landing shell.

- [ ] **Step 2: Implement the approved page sections inside the landing shell**

Build:

- sticky header with responsive brand text
- split hero
- workspace specimen
- three product cards
- footer with four icon links

- [ ] **Step 3: Use copy that matches the approved design**

Ensure the layout includes the approved labels:

- `Design System Skills`
- `DSSkills`
- `Try DSSkills`
- `Generation workspace`
- `Saved runs history`
- `Custom (TBD)`
- `© 2026 YongMin Kim. All rights reserved.`

- [ ] **Step 4: Run the homepage tests**

Run: `npx vitest run tests/app/home-page.test.tsx`

Expected: PASS

## Chunk 4: Verification

### Task 4: Run final verification and make the smallest fix if needed

**Files:**

- Modify only if verification exposes a landing-specific regression:
  - `src/app/page.tsx`
  - `src/components/landing-page-shell.tsx`
  - `src/components/auth/google-sign-in-button.tsx`
  - `src/app/globals.css`
  - `tests/app/home-page.test.tsx`
  - `tests/components/landing-page-shell.test.tsx`

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: PASS

- [ ] **Step 2: Run the targeted landing tests together**

Run: `npx vitest run tests/app/home-page.test.tsx tests/components/landing-page-shell.test.tsx`

Expected: PASS

- [ ] **Step 3: If verification fails, apply the smallest landing-scoped fix and rerun the failing command**

Keep any follow-up fix limited to landing-page files and their tests.
