# Generated Result Viewer Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the side-by-side preview/code layout with a shared viewer that defaults to preview, supports preview/code toggling, and opens the active mode in a larger dialog on both the workspace and history detail pages.

**Architecture:** Add a reusable client-side `GenerationResultViewer` that owns the active-mode toggle and enlarge dialog state, while keeping `GenerationPreviewFrame` and `GenerationCodePanel` as focused renderers with inline and enlarged sizing modes. Wire both existing pages through that shared viewer so behavior stays consistent and tests cover the shared interaction rather than duplicating page-specific logic.

**Tech Stack:** Next.js App Router, React 19 client components, TypeScript, Tailwind CSS v4, Testing Library, Vitest, Lucide React

---

## File Structure

### Shared viewer

- Create: `src/components/generation-result-viewer.tsx`

### Rendering primitives

- Modify: `src/components/generation-preview-frame.tsx`
- Modify: `src/components/generation-code-panel.tsx`

### Page integration

- Modify: `src/components/create-generation-form.tsx`
- Modify: `src/app/(app)/history/[generationId]/page.tsx`

### Tests

- Create: `tests/components/generation-result-viewer.test.tsx`
- Modify: `tests/app/workspace-page.test.tsx`
- Modify: `tests/app/generation-detail-page.test.tsx`

## Chunk 1: Shared Viewer Behavior

### Task 1: Add failing tests for the shared viewer

**Files:**
- Create: `tests/components/generation-result-viewer.test.tsx`
- Test: `tests/components/generation-result-viewer.test.tsx`

- [ ] **Step 1: Write the failing tests**

```ts
test("defaults to preview and switches to code", async () => {
  // assert preview content renders first and code appears after toggle
});

test("opens the active mode in a large dialog", async () => {
  // assert the enlarge control opens preview first, then code when code is active
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: FAIL because the shared viewer does not exist yet

- [ ] **Step 3: Implement the minimal shared viewer**

Create `src/components/generation-result-viewer.tsx` with:
- local `preview` / `code` mode state defaulting to `preview`
- a compact toggle button group
- an icon-only enlarge button with an accessible label
- a fixed-position dialog overlay for the active mode
- inline rendering through `GenerationPreviewFrame` and `GenerationCodePanel`

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: PASS

## Chunk 2: Inline And Enlarged Sizing

### Task 2: Support inline and enlarged rendering variants

**Files:**
- Modify: `src/components/generation-preview-frame.tsx`
- Modify: `src/components/generation-code-panel.tsx`
- Test: `tests/components/generation-result-viewer.test.tsx`

- [ ] **Step 1: Extend the failing tests if needed**

Add assertions that:
- inline preview uses a shorter viewport than the current oversized frame
- enlarged preview and code render inside the dialog with taller dimensions

- [ ] **Step 2: Run the tests to verify they fail for sizing behavior**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: FAIL on the new sizing assertions

- [ ] **Step 3: Implement the minimal sizing support**

Update the renderers so they accept a simple size mode such as `inline` or `dialog` and apply:
- reduced inline preview height
- increased dialog preview height
- taller inline code panel
- increased dialog code panel height with scroll support

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: PASS

## Chunk 3: Page Integration

### Task 3: Replace duplicated page layouts with the shared viewer

**Files:**
- Modify: `src/components/create-generation-form.tsx`
- Modify: `src/app/(app)/history/[generationId]/page.tsx`
- Modify: `tests/app/workspace-page.test.tsx`
- Modify: `tests/app/generation-detail-page.test.tsx`

- [ ] **Step 1: Update the page tests first**

Adjust expectations so the pages assert:
- the shared preview/code toggle is present
- preview is the default visible mode
- the enlarge control is available
- the old simultaneous side-by-side headings are no longer required

- [ ] **Step 2: Run the page tests to verify they fail**

Run: `npm test -- tests/app/workspace-page.test.tsx tests/app/generation-detail-page.test.tsx`
Expected: FAIL because the pages still render the old layout

- [ ] **Step 3: Implement the page wiring**

Replace the duplicate preview/code card sections with `GenerationResultViewer` on both pages and keep the rationale block on the workspace page below the viewer.

- [ ] **Step 4: Run the page tests to verify they pass**

Run: `npm test -- tests/app/workspace-page.test.tsx tests/app/generation-detail-page.test.tsx`
Expected: PASS

## Chunk 4: Verification

### Task 4: Run focused regression coverage

**Files:**
- Modify: `src/components/generation-result-viewer.tsx`
- Modify: `src/components/generation-preview-frame.tsx`
- Modify: `src/components/generation-code-panel.tsx`
- Modify: `src/components/create-generation-form.tsx`
- Modify: `src/app/(app)/history/[generationId]/page.tsx`
- Modify: `tests/components/generation-result-viewer.test.tsx`
- Modify: `tests/app/workspace-page.test.tsx`
- Modify: `tests/app/generation-detail-page.test.tsx`

- [ ] **Step 1: Run the focused component and page tests**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx tests/app/workspace-page.test.tsx tests/app/generation-detail-page.test.tsx`
Expected: PASS

- [ ] **Step 2: Run lint on the touched UI files if needed**

Run: `npm run lint -- src/components/generation-result-viewer.tsx src/components/generation-preview-frame.tsx src/components/generation-code-panel.tsx src/components/create-generation-form.tsx src/app/'(app)'/history/'[generationId]'/page.tsx`
Expected: PASS or no reported issues in the touched files

Plan complete and saved to `docs/superpowers/plans/2026-03-28-generated-result-viewer.md`. Ready to execute?
