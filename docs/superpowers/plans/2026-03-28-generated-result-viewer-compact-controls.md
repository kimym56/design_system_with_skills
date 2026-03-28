# Generated Result Viewer Compact Controls Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the generated result viewer's `Preview`, `Code`, and enlarge controls smaller while preserving the current interaction model.

**Architecture:** Keep the change local to `src/components/generation-result-viewer.tsx` and drive it with the existing component test file. Reduce only the control-row sizing classes so the viewer behavior, accessibility semantics, and dialog logic remain unchanged.

**Tech Stack:** Next.js App Router client components, React 19, TypeScript, Tailwind CSS v4, Testing Library, Vitest

---

## File Structure

### Viewer UI

- Modify: `src/components/generation-result-viewer.tsx`

### Tests

- Modify: `tests/components/generation-result-viewer.test.tsx`

## Chunk 1: Compact Control Assertions

### Task 1: Add a failing test for the smaller controls

**Files:**
- Modify: `tests/components/generation-result-viewer.test.tsx`
- Test: `tests/components/generation-result-viewer.test.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions that:
- the `Preview` button uses reduced horizontal and vertical padding
- the `Code` button uses the same reduced sizing
- the enlarge button uses a smaller square size than the current implementation

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: FAIL because the viewer still uses the larger control classes

- [ ] **Step 3: Implement the minimal sizing update**

Update `src/components/generation-result-viewer.tsx` so:
- the segmented control wrapper is slightly tighter
- the `Preview` and `Code` buttons use smaller padding and text size
- the enlarge button and icon use smaller dimensions

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: PASS

## Chunk 2: Focused Verification

### Task 2: Re-run focused regression coverage

**Files:**
- Modify: `src/components/generation-result-viewer.tsx`
- Modify: `tests/components/generation-result-viewer.test.tsx`

- [ ] **Step 1: Run the focused component test**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: PASS

- [ ] **Step 2: Run lint on the touched files**

Run: `npm run lint -- src/components/generation-result-viewer.tsx tests/components/generation-result-viewer.test.tsx`
Expected: PASS or no reported issues in the touched files
