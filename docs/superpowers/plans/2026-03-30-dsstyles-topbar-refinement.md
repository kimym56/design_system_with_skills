# DSSkills Top Bar Refinement Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the landing-page header into a solid Claude-style top bar with no radius and shared button radius on `Try DSSkills`.

**Architecture:** Keep the change contained to the landing shell and its focused component test. Lock the visual contract with a small test, then update the header structure and button class overrides without touching auth or route behavior.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library

---

## File Structure

- Modify: `src/components/landing-page-shell.tsx`
  Purpose: Change the header from a floating pill into a full-width opaque top bar and remove custom rounded-full button overrides.
- Modify: `tests/components/landing-page-shell.test.tsx`
  Purpose: Lock the top-bar and button-radius contract.

## Chunk 1: Test Contract

### Task 1: Update the landing-shell test for the refined top bar

**Files:**

- Modify: `tests/components/landing-page-shell.test.tsx`

- [ ] **Step 1: Add assertions for the top-bar surface**

Assert that the landing top bar:

- exists via a dedicated test id
- has no rounded corners
- uses a bottom border instead of a floating rounded shell

- [ ] **Step 2: Add assertions for button radius**

Assert that the signed-out `Try DSSkills` trigger does not use `rounded-full`.

- [ ] **Step 3: Run the landing-shell test to verify it fails**

Run: `npx vitest run tests/components/landing-page-shell.test.tsx`

Expected: FAIL because the current header is still rounded and the trigger still overrides its radius.

## Chunk 2: Implementation And Verification

### Task 2: Implement the header refinement

**Files:**

- Modify: `src/components/landing-page-shell.tsx`
- Modify: `tests/components/landing-page-shell.test.tsx`

- [ ] **Step 1: Rebuild the header wrapper as a full-width sticky bar**

Use a solid surface, no radius, and a bottom divider. Ensure content starts beneath it instead of visually underneath a floating shell.

- [ ] **Step 2: Remove custom pill overrides from `Try DSSkills`**

Let the top CTA inherit the shared button radius rather than forcing `rounded-full`.

- [ ] **Step 3: Run targeted verification**

Run: `npx vitest run tests/components/landing-page-shell.test.tsx tests/app/home-page.test.tsx`

Expected: PASS
