# Preview-Only Loading Skeleton Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the code side during loading and render only the preview skeleton panel.

**Architecture:** Keep the existing loading header and preview skeleton renderer, but collapse the loading body to a single preview card inside the status region. Update tests so the pending state must contain exactly one loading panel.

**Tech Stack:** Next.js App Router client components, React 19, Tailwind CSS, Vitest, Testing Library

---

## Chunk 1: Preview-Only Pending Layout

### Task 1: Remove the code-side loading panel with TDD

**Files:**
- Modify: `tests/components/create-generation-form.test.tsx`
- Modify: `tests/components/generation-result-viewer.test.tsx`
- Modify: `src/components/generation-result-viewer.tsx`

- [ ] **Step 1: Write the failing tests**

Require the pending status region to contain only one loading panel while preserving the preview silhouette assertions.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/components/create-generation-form.test.tsx tests/components/generation-result-viewer.test.tsx`
Expected: FAIL because the code-side loading panel is still rendered

- [ ] **Step 3: Write minimal implementation**

Update the loading branch of `GenerationResultViewer` so it renders only the preview skeleton card.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/components/create-generation-form.test.tsx tests/components/generation-result-viewer.test.tsx`
Expected: PASS

- [ ] **Step 5: Run broader verification**

Run: `npm run lint`
Expected: PASS
