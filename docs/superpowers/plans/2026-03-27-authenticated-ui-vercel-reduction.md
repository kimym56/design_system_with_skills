# Authenticated UI Vercel Reduction Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the authenticated UI into a more Vercel-like product console without changing application behavior.

**Architecture:** Keep the existing route structure and data flow, but strip decorative UI chrome from the shell, workspace, history list, and detail page. Reuse the current primitives where possible, flatten surfaces, reduce badges, and shift the layout toward denser monochrome tool panes.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, local UI primitives, Vitest, Testing Library

---

## File Structure

- Modify: `src/app/globals.css`
  Purpose: Reduce gradients, shadows, and oversized radii at the theme level.
- Modify: `src/components/ui/button.tsx`
  Purpose: Keep primary accent but make buttons feel denser and more product-like.
- Modify: `src/components/ui/card.tsx`
  Purpose: Flatten the default surface treatment.
- Modify: `src/components/app-sidebar.tsx`
  Purpose: Remove promo chrome and tighten the rail.
- Modify: `src/app/(app)/layout.tsx`
  Purpose: Flatten the main content shell.
- Modify: `src/app/(app)/workspace/page.tsx`
  Purpose: Keep concise workspace framing.
- Modify: `src/components/create-generation-form.tsx`
  Purpose: Remove summary cards and convert the workspace into one main tool canvas.
- Modify: `src/components/skill-multi-select.tsx`
  Purpose: Make skill rows feel like dense product list items.
- Modify: `src/components/history-list.tsx`
  Purpose: Convert saved runs into flatter rows or restrained cards.
- Modify: `src/app/(app)/history/[generationId]/page.tsx`
  Purpose: Simplify metadata and remove extra decorative framing.
- Modify: `tests/app/app-layout.test.tsx`
  Purpose: Lock in the denser rail contract.
- Modify: `tests/app/workspace-page.test.tsx`
  Purpose: Lock in the removal of the extra workspace summary cards.

## Chunk 1: Tests First

### Task 1: Update shell and workspace tests for the reduction pass

**Files:**
- Modify: `tests/app/app-layout.test.tsx`
- Modify: `tests/app/workspace-page.test.tsx`

- [ ] **Step 1: Update the shell test**
- [ ] **Step 2: Update the workspace test**
- [ ] **Step 3: Run the targeted tests and confirm they fail**
Run: `npx vitest run tests/app/app-layout.test.tsx tests/app/workspace-page.test.tsx`
Expected: FAIL until the promo chrome is removed.

## Chunk 2: Implement the reduction

### Task 2: Flatten shell, workspace, history, and detail surfaces

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/app/(app)/layout.tsx`
- Modify: `src/components/app-sidebar.tsx`
- Modify: `src/app/(app)/workspace/page.tsx`
- Modify: `src/components/create-generation-form.tsx`
- Modify: `src/components/skill-multi-select.tsx`
- Modify: `src/components/history-list.tsx`
- Modify: `src/app/(app)/history/[generationId]/page.tsx`

- [ ] **Step 1: Flatten the shell**
- [ ] **Step 2: Remove workspace summary cards and badges**
- [ ] **Step 3: Reduce history and detail chrome**
- [ ] **Step 4: Re-run targeted tests**
Run: `npx vitest run tests/app/app-layout.test.tsx tests/app/workspace-page.test.tsx tests/app/history-page.test.tsx tests/app/generation-detail-page.test.tsx`
Expected: PASS

## Chunk 3: Verification

### Task 3: Run full verification

**Files:**
- Modify: none expected

- [ ] **Step 1: Run tests**
Run: `npm run test`
Expected: PASS

- [ ] **Step 2: Run lint**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Run build**
Run: `npm run build`
Expected: PASS
