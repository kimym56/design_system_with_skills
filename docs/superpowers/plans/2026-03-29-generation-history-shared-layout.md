# Generation-History Shared Layout Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the left menu visually consistent across `/workspace`, `/history`, and `/history/[generationId]` by moving those routes under a shared nested Next.js layout.

**Architecture:** Introduce a route-group layout dedicated to the generation/history flow and move the existing workspace/history pages under it without changing their URLs. Simplify `AppSidebar` so it always renders the same rich rail for those routes and only changes active states.

**Tech Stack:** Next.js App Router route groups and layouts, React 19 client components, Tailwind CSS, Vitest, Testing Library

---

## Chunk 1: Route Group Layout Refactor

### Task 1: Lock the shared nested layout behavior with failing tests

**Files:**
- Modify: `tests/app/app-layout.test.tsx`
- Modify: `tests/app/workspace-page.test.tsx`
- Modify: `tests/app/history-page.test.tsx`
- Modify: `tests/app/generation-detail-page.test.tsx`

- [ ] **Step 1: Write the failing tests**

Update imports and assertions so tests expect:
- the shared generation/history layout to live at `src/app/(app)/(generation-history)/layout.tsx`
- workspace, history index, and history detail page modules to live under `src/app/(app)/(generation-history)/...`
- the shared left rail to remain available across those routes

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/app/app-layout.test.tsx tests/app/workspace-page.test.tsx tests/app/history-page.test.tsx tests/app/generation-detail-page.test.tsx`
Expected: FAIL because the route-group layout and moved page modules do not exist yet

- [ ] **Step 3: Write minimal implementation**

Create or move:
- `src/app/(app)/(generation-history)/layout.tsx`
- `src/app/(app)/(generation-history)/workspace/page.tsx`
- `src/app/(app)/(generation-history)/history/page.tsx`
- `src/app/(app)/(generation-history)/history/[generationId]/page.tsx`

Update:
- `src/app/(app)/layout.tsx` so it no longer owns the generation/history two-column shell

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/app/app-layout.test.tsx tests/app/workspace-page.test.tsx tests/app/history-page.test.tsx tests/app/generation-detail-page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/(app)/layout.tsx src/app/(app)/(generation-history)/layout.tsx src/app/(app)/(generation-history)/workspace/page.tsx src/app/(app)/(generation-history)/history/page.tsx src/app/(app)/(generation-history)/history/[generationId]/page.tsx tests/app/app-layout.test.tsx tests/app/workspace-page.test.tsx tests/app/history-page.test.tsx tests/app/generation-detail-page.test.tsx
git commit -m "refactor: move generation history routes under shared layout"
```

## Chunk 2: Consistent Sidebar Rail

### Task 2: Lock consistent left-rail behavior with failing tests

**Files:**
- Modify: `tests/components/app-sidebar.test.tsx`
- Modify: `src/components/app-sidebar.tsx`
- Reference: `src/components/recent-history-list.tsx`

- [ ] **Step 1: Write the failing tests**

Update sidebar tests so they verify:
- `/workspace` shows the rich rail
- `/history` shows the same rich rail instead of a fallback nav
- `/history/[generationId]` also shows the same rich rail
- active states move between `New run` and `View all history` appropriately

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/components/app-sidebar.test.tsx`
Expected: FAIL because the sidebar still branches between rich and fallback shells

- [ ] **Step 3: Write minimal implementation**

Update `src/components/app-sidebar.tsx` to:
- always render the shared rail for the generation/history layout
- remove the fallback-nav branch
- compute active states from the pathname for:
  - `New run` on `/workspace`
  - `View all history` on `/history` and `/history/[generationId]`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/components/app-sidebar.test.tsx`
Expected: PASS

- [ ] **Step 5: Run broader verification**

Run: `npm test`
Expected: PASS

Run: `npm run lint -- src/components/app-sidebar.tsx src/components/recent-history-list.tsx src/app/'(app)'/layout.tsx src/app/'(app)'/'(generation-history)'/layout.tsx tests/components/app-sidebar.test.tsx tests/app/app-layout.test.tsx tests/app/workspace-page.test.tsx tests/app/history-page.test.tsx tests/app/generation-detail-page.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/app-sidebar.tsx src/components/recent-history-list.tsx src/app/(app)/layout.tsx src/app/(app)/(generation-history)/layout.tsx tests/components/app-sidebar.test.tsx tests/app/app-layout.test.tsx tests/app/workspace-page.test.tsx tests/app/history-page.test.tsx tests/app/generation-detail-page.test.tsx
git commit -m "fix: keep left rail consistent across workspace and history"
```
