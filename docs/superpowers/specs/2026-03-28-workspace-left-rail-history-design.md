# Workspace Left-Rail History Design

## Summary

Redesign the left rail on the workspace page so it supports the generation task directly: one clear primary action, one secondary history entry point, and a compact recent-runs list that links to saved run detail pages.

## Goals

- Make the left rail useful on the `/workspace` page instead of acting like generic app navigation.
- Surface recent generation history directly beside the generation flow.
- Preserve a prominent `New run` action at the top of the rail.
- Keep `View all history` available as a secondary destination.
- Reuse the existing saved-run detail pages when a recent item is selected.

## Non-Goals

- No redesign of the standalone `/history` page or `/history/[generationId]` detail page.
- No change to generation saving behavior or history API semantics.
- No broader authenticated app-shell navigation expansion.
- No inline preview or workspace rehydration from the sidebar history items.

## Chosen Direction

Use the approved `A: Action + Recent Runs` direction.

The workspace left rail should be a focused task rail with this order:

- Product label and short context
- Primary action: `New run`
- Secondary link: `View all history`
- `Recent runs` section with the latest 5 to 7 saved generations

Each recent-run row should be compact and scannable:

- Component type as the primary label
- Timestamp as the secondary label
- Optional concise skill summary only if it fits without crowding

Selecting a recent-run row should navigate to the existing history detail route for that generation.

## Architecture

- `src/app/(app)/layout.tsx`
  - Continue to own the shared app shell.
  - Keep the left column in the shared layout, but allow the sidebar to render route-aware content.

- `src/components/app-sidebar.tsx`
  - Replace the generic two-link navigation with a workspace-oriented rail.
  - Detect when the current route is the workspace route and render the focused action/history layout.
  - Keep a lighter fallback navigation state for non-workspace routes so the rest of the app shell remains usable.

- `src/components/recent-history-list.tsx`
  - Add a new compact client component for the narrow-rail history presentation.
  - Fetch `/api/history`, normalize the latest items, and render loading, empty, success, and error states sized for the sidebar.

This keeps the existing full-width `HistoryList` intact while giving the sidebar its own narrow, purpose-built presentation.

## Data Flow

- The sidebar fetches recent history client-side from the existing `/api/history` endpoint.
- The sidebar trims the returned generations to a small recent set for readability.
- Each item links to `/history/[generationId]`, preserving the existing review flow.
- The workspace page itself stays focused on generation inputs and result review, with no coupling to the sidebar fetch lifecycle.

## State Design

- Loading
  - Show compact skeleton rows in the `Recent runs` section.

- Empty
  - Show a short prompt that indicates there are no saved runs yet and keeps attention on creating the first run.

- Error
  - Show a lightweight inline message inside the rail without disrupting the main workspace content.

- Responsive behavior
  - On smaller screens, stack the rail above the main content.
  - Keep the rail compact so the generation form remains the visual priority.

## UX Notes

- The left rail should read as support for the current task, not a destination hub.
- `New run` must remain the strongest visual affordance.
- `View all history` should look secondary to avoid competing with the primary action.
- Recent runs should feel lightweight and fast to scan, with tight spacing and stable hover/focus states.
- Avoid adding extra destinations such as settings or libraries unless they become necessary later.

## Testing Strategy

- Update workspace shell tests to reflect the new left-rail content and route-aware behavior.
- Add component tests for the compact recent-history sidebar list:
  - loading state
  - empty state
  - error state
  - success state with links to detail pages
- Keep existing history page tests green to confirm the redesign does not change saved-run browsing outside the workspace rail.
