# Generation-History Hybrid Drawer Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the shared generation/history left rail with a hybrid drawer that is open by default and content-pushing on desktop, and closed by default as an overlay on smaller screens.

**Architecture:** Add a small client shell component at the shared generation/history layout boundary to own responsive drawer state and interactions. Split the current sidebar into reusable content and frame components so the same navigation is used in both desktop and mobile drawer presentations without duplicating logic.

**Tech Stack:** Next.js App Router, React 19 client components, Tailwind CSS, Vitest, Testing Library, lucide-react

---

## Chunk 1: Responsive Drawer Shell

### Task 1: Lock the shell behavior with failing tests

**Files:**
- Create: `tests/components/generation-history-shell.test.tsx`
- Modify: `tests/app/app-layout.test.tsx`
- Reference: `src/app/(app)/(generation-history)/layout.tsx`

- [ ] **Step 1: Write the failing tests**

Add shell coverage for:
- desktop default-open state using a `matchMedia("(min-width: 1280px)")` stub
- smaller-screen default-closed state
- toggle button text or `aria-label` changing between open and closed states
- mobile overlay close on backdrop click
- mobile overlay close on `Escape`

Update the shared layout test so it expects the layout to render:
- the shell trigger
- the shared navigation content
- the wrapped child content

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/components/generation-history-shell.test.tsx tests/app/app-layout.test.tsx`
Expected: FAIL because the shell component and drawer interactions do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/generation-history-shell.tsx` with:
- `"use client"`
- breakpoint-aware default state driven by `window.matchMedia("(min-width: 1280px)")`
- `isDrawerOpen` state
- desktop pushed layout markup
- mobile overlay drawer markup with backdrop
- a shared trigger button
- `Escape` handling for the mobile overlay
- route-change close behavior for the overlay using `usePathname`

Update `src/app/(app)/(generation-history)/layout.tsx` to render the new shell and pass `children` into its main content area.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/components/generation-history-shell.test.tsx tests/app/app-layout.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/generation-history-shell.tsx src/app/'(app)'/'(generation-history)'/layout.tsx tests/components/generation-history-shell.test.tsx tests/app/app-layout.test.tsx
git commit -m "feat: add hybrid drawer shell for generation history"
```

## Chunk 2: Shared Sidebar Content and Integration

### Task 2: Extract reusable sidebar content and wire it into the shell

**Files:**
- Create: `src/components/app-sidebar-content.tsx`
- Modify: `src/components/app-sidebar.tsx`
- Modify: `src/components/generation-history-shell.tsx`
- Modify: `tests/components/app-sidebar.test.tsx`
- Modify: `tests/components/generation-history-shell.test.tsx`
- Reference: `src/components/recent-history-list.tsx`

- [ ] **Step 1: Write the failing tests**

Update sidebar tests so they verify:
- the shared navigation content still renders for `/workspace`, `/history`, and `/history/[generationId]`
- active-route behavior still marks `New run` active only on `/workspace`
- active-route behavior still marks `View all history` active on history routes

Extend the shell tests so they verify:
- the same sidebar content appears in desktop pushed mode and mobile overlay mode
- closing the desktop drawer collapses the sidebar region without removing the menu trigger
- reopening restores the visible rail

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/components/app-sidebar.test.tsx tests/components/generation-history-shell.test.tsx`
Expected: FAIL because the sidebar is still a single fixed rail component and the shell is not yet using shared sidebar content in both modes.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/app-sidebar-content.tsx` containing the existing nav and recent-run content.

Update `src/components/app-sidebar.tsx` so it:
- stays responsible for the bordered panel frame
- renders `AppSidebarContent`
- accepts optional `className` hooks for shell-controlled sizing/layout

Update `src/components/generation-history-shell.tsx` so it:
- renders `AppSidebar` inside the desktop pushed panel
- renders the same `AppSidebar` inside the mobile overlay panel
- preserves the main content card styling currently supplied by the shared layout

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/components/app-sidebar.test.tsx tests/components/generation-history-shell.test.tsx tests/app/app-layout.test.tsx`
Expected: PASS

- [ ] **Step 5: Run broader verification**

Run: `npm test`
Expected: PASS

Run: `npm run lint -- src/components/app-sidebar-content.tsx src/components/app-sidebar.tsx src/components/generation-history-shell.tsx src/app/'(app)'/'(generation-history)'/layout.tsx tests/components/app-sidebar.test.tsx tests/components/generation-history-shell.test.tsx tests/app/app-layout.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/app-sidebar-content.tsx src/components/app-sidebar.tsx src/components/generation-history-shell.tsx src/app/'(app)'/'(generation-history)'/layout.tsx tests/components/app-sidebar.test.tsx tests/components/generation-history-shell.test.tsx tests/app/app-layout.test.tsx
git commit -m "refactor: reuse sidebar content across hybrid drawer states"
```
