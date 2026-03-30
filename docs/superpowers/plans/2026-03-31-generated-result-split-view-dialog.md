# Generated Result Split View Dialog Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated `See both` control that opens a large split dialog with preview and code shown together in the real generated result viewer.

**Architecture:** Keep the inline viewer state machine unchanged with `preview` and `code` as the only inline modes. Extend `GenerationResultViewer` with a second modal path for split view, and share rendering helpers so single-surface and split-surface dialogs use the same panel components without duplicating content logic.

**Tech Stack:** React client components, Next.js App Router client-side rendering, Vitest, Testing Library, shadcn/ui button and card primitives

---

## Chunk 1: Tests First

### Task 1: Add failing coverage for the split-view control and dialog

**Files:**
- Modify: `tests/components/generation-result-viewer.test.tsx`
- Reference: `src/components/generation-result-viewer.tsx`

- [ ] **Step 1: Write the failing test for the new toolbar control**

Add assertions that the viewer renders a `See both` button with an accessible name such as `Open split view`.

- [ ] **Step 2: Run the focused viewer test file to verify it fails**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: FAIL because the new control does not exist yet.

- [ ] **Step 3: Write the failing interaction test for the split dialog**

Add a user interaction test that clicks the new button and asserts:
- a dialog named `Split view` appears
- the preview frame is present in the dialog
- the generated code viewer content is also present in the dialog

- [ ] **Step 4: Run the focused viewer test file again to verify the new test fails for the right reason**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: FAIL with missing button or missing split dialog assertions, not with an unrelated runtime error.

## Chunk 2: Minimal Implementation

### Task 2: Add split-view dialog support to the real result viewer

**Files:**
- Modify: `src/components/generation-result-viewer.tsx`
- Test: `tests/components/generation-result-viewer.test.tsx`
- Reference: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

- [ ] **Step 1: Read the relevant Next.js client component guide before editing**

Read: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
Expected: confirm the component remains a client component and the change stays local to the viewer.

- [ ] **Step 2: Add minimal state for the split dialog**

Introduce dedicated state for the split-view dialog without changing the existing inline `activeView` behavior or the existing large single-surface dialog state.

- [ ] **Step 3: Add the new toolbar button**

Render a second small toolbar button next to the maximize button. Give it a stable accessible label such as `Open split view`.

- [ ] **Step 4: Add a shared render helper for split content**

Render `GenerationPreviewFrame` and `GenerationCodePanel` together in a responsive two-column layout sized for the dialog. Reuse the existing panel components rather than creating split-specific copies.

- [ ] **Step 5: Add the split dialog container**

Render a dialog labeled `Split view` with the split layout content and the existing close affordances.

- [ ] **Step 6: Run the focused viewer test file to verify it passes**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: PASS

## Chunk 3: Regression Verification

### Task 3: Verify the existing viewer workflows still work

**Files:**
- Modify: `tests/components/generation-result-viewer.test.tsx` if needed for stabilization only
- Verify: `src/components/generation-result-viewer.tsx`

- [ ] **Step 1: Re-run the focused viewer test file and confirm the existing large preview/code dialog coverage remains green**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx`
Expected: PASS with existing toggle and large-dialog tests still succeeding.

- [ ] **Step 2: Run a broader related test target if available**

Run: `npm test -- tests/components/generation-result-viewer.test.tsx tests/app/workspace-page.test.tsx tests/app/generation-detail-page.test.tsx`
Expected: PASS or actionable failures tied to the viewer change.

- [ ] **Step 3: Review the final diff**

Run: `git diff -- src/components/generation-result-viewer.tsx tests/components/generation-result-viewer.test.tsx docs/superpowers/specs/2026-03-31-generated-result-split-view-dialog-design.md docs/superpowers/plans/2026-03-31-generated-result-split-view-dialog.md`
Expected: only the planned split-view docs, tests, and viewer implementation changes appear.
