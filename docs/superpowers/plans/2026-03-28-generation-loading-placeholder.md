# Generation Loading Placeholder Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a visible loading placeholder panel to the workspace result area while a generation request is in flight.

**Architecture:** Keep the change local to the existing generation form and result viewer. The form owns request lifecycle state, while the viewer receives an `isLoading` prop and renders a dedicated editorial placeholder with skeleton surfaces when a run is pending.

**Tech Stack:** Next.js App Router client components, React 19, Tailwind CSS, Vitest, Testing Library

---

## Chunk 1: Loading Placeholder UX

### Task 1: Lock in the pending-state behavior with a component test

**Files:**
- Modify: `tests/components/create-generation-form.test.tsx`
- Test: `tests/components/create-generation-form.test.tsx`

- [ ] **Step 1: Write the failing test**

Add a test that:
- renders `CreateGenerationForm`
- loads one available skill
- starts a generation request that never resolves
- submits the form
- asserts the loading placeholder copy appears while the request is pending

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/create-generation-form.test.tsx`
Expected: FAIL because the loading placeholder does not exist yet

- [ ] **Step 3: Write minimal implementation**

Update the form and result viewer so:
- submit sets loading state immediately
- previous generation is cleared before the new request resolves
- the result section renders a dedicated loading placeholder with skeleton blocks and loading copy

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/create-generation-form.test.tsx`
Expected: PASS

- [ ] **Step 5: Run focused regression checks**

Run: `npm test -- tests/components/create-generation-form.test.tsx tests/components/generation-result-viewer.test.tsx`
Expected: PASS

- [ ] **Step 6: Run broader verification**

Run: `npm run lint`
Expected: PASS
