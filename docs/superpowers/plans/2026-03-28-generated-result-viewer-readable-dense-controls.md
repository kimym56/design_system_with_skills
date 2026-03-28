# Generated Result Viewer Readable Dense Controls Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the font size and overall button density of the generated result viewer controls while keeping the labels readable.

**Architecture:** Keep the change local to `src/components/generation-result-viewer.tsx` and drive it with the existing viewer component test. Update only the segmented control and enlarge button classes so the interaction model and accessibility semantics stay intact.

**Tech Stack:** Next.js App Router client components, React 19, TypeScript, Tailwind CSS v4, Testing Library, Vitest

---

## File Structure

### Viewer UI

- Modify: `src/components/generation-result-viewer.tsx`

### Tests

- Modify: `tests/components/generation-result-viewer.test.tsx`

## Chunk 1: Denser Control Assertions

### Task 1: Add a failing test for the denser readable controls

**Files:**
- Modify: `tests/components/generation-result-viewer.test.tsx`
- Test: `tests/components/generation-result-viewer.test.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions that:
- the `Preview` and `Code` buttons use `text-xs`
- the tab padding is smaller than the prior compact pass
- the enlarge button uses a tighter square size and smaller icon

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: FAIL because the viewer still uses the previous larger compact classes

- [ ] **Step 3: Implement the minimal sizing update**

Update `src/components/generation-result-viewer.tsx` so:
- the header control gap is slightly tighter
- the segmented wrapper padding is reduced
- the tab buttons use smaller font and padding
- the enlarge button and icon shrink one more step

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: PASS

## Chunk 2: Focused Verification

### Task 2: Re-run focused verification

**Files:**
- Modify: `src/components/generation-result-viewer.tsx`
- Modify: `tests/components/generation-result-viewer.test.tsx`

- [ ] **Step 1: Run the focused component test**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: PASS

- [ ] **Step 2: Run lint on the touched files**

Run: `npm run lint -- src/components/generation-result-viewer.tsx tests/components/generation-result-viewer.test.tsx`
Expected: PASS or no reported issues in the touched files
