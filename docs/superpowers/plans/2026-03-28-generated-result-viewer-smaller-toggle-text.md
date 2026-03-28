# Generated Result Viewer Smaller Toggle Text Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the generated result viewer toggle labels smaller without changing the button geometry.

**Architecture:** Keep the update local to `src/components/generation-result-viewer.tsx` and drive it from the existing component test. Change only the toggle label text class while preserving the current dense spacing and enlarge control styles.

**Tech Stack:** Next.js App Router client components, React 19, TypeScript, Tailwind CSS v4, Testing Library, Vitest

---

## File Structure

### Viewer UI

- Modify: `src/components/generation-result-viewer.tsx`

### Tests

- Modify: `tests/components/generation-result-viewer.test.tsx`

## Chunk 1: Smaller Toggle Text Assertions

### Task 1: Add a failing test for the smaller toggle text

**Files:**
- Modify: `tests/components/generation-result-viewer.test.tsx`
- Test: `tests/components/generation-result-viewer.test.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions that:
- the `Preview` and `Code` buttons use `text-[11px]`
- the existing dense padding remains unchanged
- the enlarge button sizing remains unchanged

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: FAIL because the viewer still uses `text-xs`

- [ ] **Step 3: Implement the minimal typography update**

Update `src/components/generation-result-viewer.tsx` so:
- the toggle labels use `text-[11px]`
- no other sizing classes in the control row change

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
