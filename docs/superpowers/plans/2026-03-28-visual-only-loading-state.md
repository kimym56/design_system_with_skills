# Visual-Only Loading State Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the textual loading intro block and leave a visual-only pending state driven by skeleton surfaces.

**Architecture:** Keep the existing loading card and component-type preview skeleton renderer, but collapse the loading body to two visual panels: preview skeleton and generic code skeleton. Update tests to assert the silhouette remains while the removed text no longer appears.

**Tech Stack:** Next.js App Router client components, React 19, Tailwind CSS, Vitest, Testing Library

---

## Chunk 1: Visual-Only Loading Body

### Task 1: Remove loading copy with TDD

**Files:**
- Modify: `tests/components/create-generation-form.test.tsx`
- Modify: `tests/components/generation-result-viewer.test.tsx`
- Modify: `src/components/generation-result-viewer.tsx`

- [ ] **Step 1: Write the failing tests**

Remove expectations for the loading copy and add assertions that the deleted text is absent.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/components/create-generation-form.test.tsx tests/components/generation-result-viewer.test.tsx`
Expected: FAIL because the loading copy is still rendered

- [ ] **Step 3: Write minimal implementation**

Update the loading layout so it renders only the preview silhouette card and the generic code skeleton card.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/components/create-generation-form.test.tsx tests/components/generation-result-viewer.test.tsx`
Expected: PASS

- [ ] **Step 5: Run broader verification**

Run: `npm run lint`
Expected: PASS
