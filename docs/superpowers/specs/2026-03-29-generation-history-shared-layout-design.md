# Generation-History Shared Layout Design

## Summary

Keep the left rail visually consistent when moving between `/workspace`, `/history`, and `/history/[generationId]` by moving those routes under a shared nested Next.js layout instead of swapping sidebar shells inside a single client component.

## Goals

- Preserve the same left-rail UI across the generation and history flows.
- Use Next.js nested layouts and route groups instead of pathname-based shell switching.
- Keep existing public URLs unchanged.
- Keep `New run`, `View all history`, and `Recent runs` visible across the shared flow.
- Maintain correct active-state behavior for workspace and history routes.

## Non-Goals

- No redesign of the actual workspace page content.
- No redesign of the history index or history detail content areas.
- No API changes to `/api/history` or saved-generation behavior.
- No broader authenticated-shell redesign outside the generation/history area.

## Chosen Direction

Use a nested route-group layout for the generation/history flow.

Proposed structure:

- `src/app/(app)/layout.tsx`
  - Keep only the outer authenticated page framing that should apply broadly.

- `src/app/(app)/(generation-history)/layout.tsx`
  - Own the two-column shell and shared left rail.

- `src/app/(app)/(generation-history)/workspace/page.tsx`
- `src/app/(app)/(generation-history)/history/page.tsx`
- `src/app/(app)/(generation-history)/history/[generationId]/page.tsx`

Because `(generation-history)` is a route group, the URL paths remain:

- `/workspace`
- `/history`
- `/history/[generationId]`

## Architecture

### Shared layout ownership

The generation/history shell should be owned by the nested layout, not by route-conditional logic inside `AppSidebar`.

That nested layout should render:

- the left-rail column
- the main content card for the wrapped page

This matches Next.js layout behavior more cleanly: the shell is shared because the routes live under the same nested layout boundary.

### Sidebar behavior

`AppSidebar` should become a consistent generation-history rail:

- product label and short context copy
- `New run` link
- `View all history` link
- `Recent runs` section

It should not switch to a fallback nav on history routes.

Only active states should vary:

- `New run` reads as active on `/workspace`
- `View all history` reads as active on `/history` and `/history/[generationId]`
- recent history links can continue to highlight the matching saved run when applicable if that logic is easy to support cleanly

### Route organization

Move the current workspace and history pages into the shared route group so they inherit the nested layout naturally.

This removes the need to treat `/workspace` as special inside the sidebar and fixes the current inconsistency when navigating from the workspace to history.

## Testing Strategy

- Update layout tests to point at the nested shared layout file.
- Update sidebar tests so the shared rail is expected on workspace, history index, and history detail routes.
- Keep route URLs unchanged in assertions.
- Run the full Vitest suite and targeted lint checks after the refactor.

## Risks and Mitigations

- Risk: moving route files can silently break imports or tests.
  - Mitigation: keep page component code unchanged where possible and only move files into the route group.

- Risk: stale sidebar branching logic survives the layout move.
  - Mitigation: simplify `AppSidebar` so it always renders the shared rail for this route group.

- Risk: tests still reference the old `(app)/layout.tsx` shell.
  - Mitigation: update layout test imports and expectations alongside the route move.
