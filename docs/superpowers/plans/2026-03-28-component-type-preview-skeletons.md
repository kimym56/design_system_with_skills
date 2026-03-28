# Component-Type Preview Skeletons Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render a unique literal preview skeleton for each selected component type while generation is pending.

**Architecture:** The form passes the selected `componentType` into the result viewer. The viewer keeps the existing loading shell and generic code panel, but swaps the preview-side loading block through a small component-type-specific renderer inside the same file.

**Tech Stack:** Next.js App Router client components, React 19, Tailwind CSS, Vitest, Testing Library

---

## Chunk 1: Preview Skeleton Variants

### Task 1: Lock in per-component loading behavior with failing tests

**Files:**
- Modify: `tests/components/create-generation-form.test.tsx`
- Modify: `tests/components/generation-result-viewer.test.tsx`

- [ ] **Step 1: Write the failing tests**

Add tests that verify:
- the pending generation state reflects the selected component type from the form
- the result viewer renders a distinct preview skeleton marker for representative component types such as `Button` and `Modal`

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/components/create-generation-form.test.tsx tests/components/generation-result-viewer.test.tsx`
Expected: FAIL because the viewer does not yet receive or render component-type-specific preview skeletons

- [ ] **Step 3: Write minimal implementation**

Update:
- `src/components/create-generation-form.tsx` to pass `componentType` into `GenerationResultViewer`
- `src/components/generation-result-viewer.tsx` to accept the prop and render one of twelve preview skeleton silhouettes during loading

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/components/create-generation-form.test.tsx tests/components/generation-result-viewer.test.tsx`
Expected: PASS

- [ ] **Step 5: Run broader verification**

Run: `npm run lint`
Expected: PASS
