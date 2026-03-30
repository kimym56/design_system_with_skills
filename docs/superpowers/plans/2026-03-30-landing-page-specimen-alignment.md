# Landing Page Specimen Alignment Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten the homepage specimen, evidence card copy, and shared radius system so the landing page matches the real workspace UI more closely.

**Architecture:** Keep the existing homepage structure and revise the right-side specimen to mirror the real workspace hierarchy: inputs first, result second, preview leading. Normalize shape language through shared tokens and primitives so the same radius scale carries across homepage and workspace surfaces without a wider redesign.

**Tech Stack:** Next.js App Router, React Server Components and Client Components, Tailwind CSS v4 utilities, Vitest, Testing Library

---

## File Structure

- Modify: `src/app/page.tsx`
  - Tighten evidence card copy.
  - Recompose the hero specimen to match the real workspace structure.
  - Make preview the first result surface in the specimen.
- Modify: `src/app/globals.css`
  - Define a clearer radius token hierarchy for shared use.
- Modify: `src/components/ui/card.tsx`
  - Point base card rounding at the shared radius token.
- Modify: `src/components/ui/button.tsx`
  - Align button rounding with the shared compact-control radius.
- Modify: `tests/app/home-page.test.tsx`
  - Update copy assertions to the new compact evidence text if needed.
  - Preserve current auth-aware behavior assertions.

## Chunk 1: Shared Shape Language

### Task 1: Define the radius hierarchy

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing test target**

Use the existing style contract test file if the current radius token expectations require adjustment after the CSS change.

- [ ] **Step 2: Inspect existing token usage**

Run: `rg "rounded-\\[|--radius" src/app src/components tests`
Expected: identify the largest inconsistencies between page-specific radii and shared primitive values.

- [ ] **Step 3: Write the minimal token update**

Add or revise shared radius tokens in `src/app/globals.css` so there is a consistent hierarchy for:
- outer shell
- card
- medium control
- compact control

- [ ] **Step 4: Align shared primitives**

Update `src/components/ui/card.tsx` and `src/components/ui/button.tsx` to consume the shared radius scale instead of unrelated hard-coded values.

- [ ] **Step 5: Run targeted validation**

Run: `npm run test -- tests/app/globals-css.test.ts`
Expected: PASS, or update that test if the token contract intentionally changed.

## Chunk 2: Homepage Specimen and Copy

### Task 2: Tighten the evidence cards

**Files:**
- Modify: `src/app/page.tsx`
- Test: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Write the failing homepage assertion**

Add or adjust an assertion in `tests/app/home-page.test.tsx` for at least one shortened evidence-card description.

- [ ] **Step 2: Run the homepage test to verify failure**

Run: `npm run test -- tests/app/home-page.test.tsx`
Expected: FAIL on the old evidence-card copy.

- [ ] **Step 3: Implement the shortened copy**

Update the `evidenceCards` content in `src/app/page.tsx` to use tighter one-line descriptions.

- [ ] **Step 4: Re-run the homepage test**

Run: `npm run test -- tests/app/home-page.test.tsx`
Expected: PASS for the evidence-card copy change.

### Task 3: Rebuild the hero specimen around the real workspace

**Files:**
- Modify: `src/app/page.tsx`
- Test: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Compare with workspace structure**

Inspect: `src/components/create-generation-form.tsx` and `src/components/generation-result-viewer.tsx`
Expected: confirm the homepage specimen copies the real section order and naming.

- [ ] **Step 2: Implement the specimen update**

Revise the hero specimen in `src/app/page.tsx` so it:
- shows generation inputs first
- shows generated result second
- places preview before code in the result area
- uses the updated shared radius scale

- [ ] **Step 3: Keep the layout responsive**

Confirm the specimen stacks cleanly on smaller viewports without becoming a fake screenshot strip.

- [ ] **Step 4: Re-run homepage coverage**

Run: `npm run test -- tests/app/home-page.test.tsx`
Expected: PASS with unchanged auth and main CTA behavior.

## Chunk 3: Verification

### Task 4: Verify the final polish pass

**Files:**
- Modify: none unless verification reveals breakage

- [ ] **Step 1: Run targeted tests**

Run: `npm run test -- tests/app/home-page.test.tsx tests/app/globals-css.test.ts`
Expected: PASS

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Review the diff**

Run: `git diff -- src/app/page.tsx src/app/globals.css src/components/ui/card.tsx src/components/ui/button.tsx tests/app/home-page.test.tsx`
Expected: only the agreed landing-page and shared-radius changes appear.

- [ ] **Step 4: Commit if requested**

```bash
git add src/app/page.tsx src/app/globals.css src/components/ui/card.tsx src/components/ui/button.tsx tests/app/home-page.test.tsx docs/superpowers/specs/2026-03-30-landing-page-specimen-alignment-design.md docs/superpowers/plans/2026-03-30-landing-page-specimen-alignment.md
git commit -m "refactor: align landing page specimen with workspace UI"
```
