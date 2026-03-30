# Agent Skill UI Evaluation Playground Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the landing page as a technical playground for rapidly evaluating UI output from new agent skills without changing routing or auth behavior.

**Architecture:** Keep the implementation constrained to the homepage route and its focused test. First update the homepage test contract to describe the new product purpose, verify the current page fails that contract, then rewrite the copy and section labels in `src/app/page.tsx` to match the approved playground positioning.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library

---

## File Structure

- Modify: `tests/app/home-page.test.tsx`
  Purpose: Lock in the new landing-page copy contract and preserve auth-aware behavior.
- Modify: `src/app/page.tsx`
  Purpose: Rewrite homepage labels and supporting content from portfolio framing to evaluation-playground framing.

## Chunk 1: Homepage Contract

### Task 1: Update the homepage test first

**Files:**
- Modify: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Rewrite the signed-out copy assertions**

Check for the new tooling-oriented hero and section labels:

```tsx
expect(
  screen.getByRole("heading", {
    name: /rapid ui evaluation for new agent skills/i,
  }),
).toBeInTheDocument();

expect(screen.getByText(/evaluation surfaces/i)).toBeInTheDocument();
expect(screen.getByText(/review rules/i)).toBeInTheDocument();
```

- [ ] **Step 2: Keep the auth behavior assertions**

Preserve checks for:
- `/workspace` CTA
- two signed-out Google sign-in buttons
- signed-in account menu replacing those buttons

- [ ] **Step 3: Run the focused homepage test and verify it fails**

Run: `npx vitest run tests/app/home-page.test.tsx`

Expected: FAIL because the current homepage still uses portfolio-oriented language.

## Chunk 2: Homepage Rewrite

### Task 2: Update the homepage copy and labels

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite the top header identity**

Replace any "Design Engineer" phrasing with an evaluation-playground identity.

- [ ] **Step 2: Rewrite the hero headline and supporting copy**

Describe the page as a technical playground for rapidly evaluating UI output from new agent skills.

- [ ] **Step 3: Retune the evidence cards**

Use labels and body text that reinforce:
- rapid iteration
- inspectable output
- saved run continuity

- [ ] **Step 4: Rename the lower sections**

Replace portfolio-oriented labels such as selected work or operating principles with workflow-oriented labels such as:
- evaluation surfaces
- review rules

- [ ] **Step 5: Retune the closing CTA**

Describe `/workspace` as the evaluation environment.

- [ ] **Step 6: Re-run the focused homepage test**

Run: `npx vitest run tests/app/home-page.test.tsx`

Expected: PASS

## Chunk 3: Verification

### Task 3: Verify the updated contract

**Files:**
- Modify: `src/app/page.tsx` only if verification exposes a homepage-scoped issue
- Modify: `tests/app/home-page.test.tsx` only if verification exposes an incorrect assertion

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: PASS

- [ ] **Step 2: If lint fails because of the homepage rewrite, make the minimal fix and re-run it**
