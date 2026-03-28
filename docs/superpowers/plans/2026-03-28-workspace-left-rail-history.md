# Workspace Left-Rail History Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the workspace left rail so it emphasizes `New run`, offers `View all history`, and shows compact recent saved runs that link to existing detail pages.

**Architecture:** Keep the shared authenticated app shell, but make `AppSidebar` render a workspace-specific rail when the current route is `/workspace`. Introduce a dedicated `RecentHistoryList` client component for the narrow sidebar presentation so the existing full-width `HistoryList` remains unchanged.

**Tech Stack:** Next.js App Router client components, React 19, Tailwind CSS, Vitest, Testing Library

---

## Chunk 1: Compact Recent History Sidebar List

### Task 1: Lock the compact sidebar list behavior with failing tests

**Files:**
- Create: `tests/components/recent-history-list.test.tsx`
- Reference: `src/components/history-list.tsx`
- Reference: `src/app/api/history/route.ts`

- [ ] **Step 1: Write the failing tests**

Add tests that verify `RecentHistoryList`:
- renders compact loading placeholders before fetch resolves
- renders an empty-state message when `generations` is an empty array
- renders an inline error message when the request fails
- renders only the first 5 recent runs from `/api/history`
- links each rendered item to `/history/<generationId>`

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/components/recent-history-list.test.tsx`
Expected: FAIL because `RecentHistoryList` does not exist yet

- [ ] **Step 3: Write minimal implementation**

Create `src/components/recent-history-list.tsx` as a client component that:
- fetches `/api/history` on mount
- stores `items` and `error` state with the same guarded async pattern used by `HistoryList`
- trims successful results with `.slice(0, 5)`
- renders:
  - loading skeleton rows sized for the sidebar
  - compact empty-state copy
  - compact inline error copy
  - success rows with component type and formatted time inside `next/link`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/components/recent-history-list.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/recent-history-list.tsx tests/components/recent-history-list.test.tsx
git commit -m "feat: add compact recent history sidebar list"
```

## Chunk 2: Workspace Sidebar Integration

### Task 2: Lock the workspace-specific rail behavior with failing tests

**Files:**
- Create: `tests/components/app-sidebar.test.tsx`
- Modify: `src/components/app-sidebar.tsx`
- Modify: `src/app/(app)/layout.tsx`
- Reference: `src/components/history-list.tsx`

- [ ] **Step 1: Write the failing tests**

Add tests that verify:
- on `/workspace`, `AppSidebar` shows:
  - the product label
  - a `New run` link to `/workspace`
  - a `View all history` link to `/history`
  - the `Recent runs` section label
- on `/history`, `AppSidebar` falls back to a lighter non-workspace navigation state instead of showing the workspace-only history rail

Mock:
- `next/navigation` for `usePathname`
- `RecentHistoryList` so the sidebar test stays focused on sidebar composition, not fetch state

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/components/app-sidebar.test.tsx`
Expected: FAIL because the current sidebar only renders the old two-link nav

- [ ] **Step 3: Write minimal implementation**

Update `src/components/app-sidebar.tsx` to:
- detect `pathname === "/workspace"`
- render the focused workspace rail with:
  - product label and short descriptor
  - primary `New run` CTA
  - secondary `View all history` link
  - embedded `RecentHistoryList`
- keep a simpler fallback nav for non-workspace routes

Update `src/app/(app)/layout.tsx` to:
- slightly widen the left column so the recent-history rows fit comfortably
- preserve the existing stacked mobile layout and sticky large-screen behavior

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/components/app-sidebar.test.tsx`
Expected: PASS

- [ ] **Step 5: Run broader verification**

Run: `npm test -- tests/components/recent-history-list.test.tsx tests/components/app-sidebar.test.tsx tests/app/workspace-page.test.tsx tests/app/history-page.test.tsx`
Expected: PASS

Run: `npm run lint -- src/components/app-sidebar.tsx src/components/recent-history-list.tsx src/app/'(app)'/layout.tsx tests/components/app-sidebar.test.tsx tests/components/recent-history-list.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/app-sidebar.tsx src/components/recent-history-list.tsx src/app/'(app)'/layout.tsx tests/components/app-sidebar.test.tsx tests/components/recent-history-list.test.tsx
git commit -m "feat: redesign workspace sidebar with recent history"
```
