# Generation-History Hybrid Drawer Design

## Summary

Replace the current always-visible left rail in the shared generation/history layout with a hybrid drawer: open by default and content-pushing on desktop, closed by default and overlaying on smaller screens.

## Goals

- Turn the left menu into a real drawer instead of a permanently mounted rail.
- Keep the generation/history navigation available across `/workspace`, `/history`, and `/history/[generationId]`.
- Preserve the existing sidebar content and information hierarchy.
- Use desktop behavior that keeps the main workspace visible while still making the menu collapsible.
- Use mobile behavior that prioritizes content space and predictable overlay navigation patterns.

## Non-Goals

- No redesign of the workspace, history index, or history detail page content.
- No change to generation history APIs, saved-run fetching, or route structure.
- No new navigation destinations beyond the existing `New run`, `View all history`, and `Recent runs` content.
- No dependency on a third-party drawer library for this change.

## Chosen Direction

Use an approved hybrid drawer pattern:

- On `xl` and larger screens, the drawer starts open and pushes the main content to the right.
- Below `xl`, the drawer starts closed and opens as an overlay with a backdrop.
- A persistent menu trigger in the shared shell header controls the drawer at every breakpoint.
- The drawer content is reused across both desktop and mobile states so navigation and recent history stay in one source of truth.

This is the strongest UX for the current app because the navigation supports the workspace instead of acting like the primary destination. Desktop users should keep the main content visible while retaining quick access to navigation. Smaller screens benefit from a temporary overlay that protects limited space.

## Architecture

### Shared layout ownership

The drawer should be owned by the shared generation/history layout, not by individual pages and not by the result viewer.

- `src/app/(app)/(generation-history)/layout.tsx`
  - Remains the shared route layout entry point.
  - Renders a dedicated client shell component that owns drawer behavior.

- `src/components/generation-history-shell.tsx`
  - New client component responsible for:
    - responsive default-open behavior
    - drawer open/close state
    - header trigger
    - desktop pushed layout
    - mobile overlay/backdrop behavior
    - escape key handling and route-change cleanup for mobile

This keeps interactive state inside a narrow client boundary, which matches the App Router guidance for preserving server-rendered layout structure while layering interactivity only where it is needed.

### Sidebar decomposition

Split the current sidebar into reusable pieces so the navigation content is not duplicated:

- `src/components/app-sidebar-content.tsx`
  - New shared content component for:
    - product label
    - generation workspace copy
    - `New run` link
    - `View all history` link
    - `Recent runs` section

- `src/components/app-sidebar.tsx`
  - Becomes a framed container that renders `AppSidebarContent`.
  - Accepts styling hooks needed by the shell without owning drawer state directly.

The navigation content should remain visually consistent across desktop and mobile drawer presentations.

### Shell layout

The client shell should render three pieces:

- a shared top header row containing the drawer trigger
- a responsive sidebar region
- the main content card wrapping `children`

Desktop state:

- the sidebar region stays in normal document flow
- opening and closing animates width and content offset
- the main content remains readable at all times

Mobile/tablet state:

- the sidebar renders inside a fixed overlay panel
- a backdrop covers the rest of the screen
- the main content remains mounted beneath the overlay

## Interaction Model

### Trigger behavior

- The menu trigger should always be visible in the shared shell header.
- The trigger label and `aria-label` should reflect state, such as `Open navigation menu` and `Close navigation menu`.
- The trigger controls the shared drawer state and must be keyboard accessible.

### Desktop behavior

- Default state is open on first render at `xl` and above.
- Closing the drawer collapses the sidebar region without turning the layout into a modal interaction.
- Reopening restores the pushed two-column layout.
- The motion should be subtle and tied to width/spacing changes, not a heavy full-screen transition.

### Mobile and tablet behavior

- Default state is closed below `xl`.
- Opening the drawer shows a backdrop and a slide-in panel from the left.
- The drawer closes on backdrop click.
- The drawer closes on `Escape`.
- The drawer closes automatically after route navigation so the next page is immediately visible.

### Accessibility

- The overlay drawer should expose `role="dialog"` and `aria-modal="true"` when active on smaller screens.
- Focus should move into the overlay drawer when it opens and return to the trigger when it closes.
- Desktop pushed mode should not behave like a modal dialog because it is part of the normal page layout.
- Existing active-route indicators for `/workspace` and `/history` must remain intact.

## State Design

- `isDesktop`
  - derived from a client media-query check at the shell level

- `isDrawerOpen`
  - initialized from breakpoint-aware defaults
  - desktop default: `true`
  - mobile default: `false`

- Route synchronization
  - on mobile/tablet, route changes force the overlay closed
  - on desktop, route changes keep the current open/closed preference

- Hydration behavior
  - the server-rendered structure should keep the main content readable before client state attaches
  - responsive enhancements should avoid creating a broken intermediate layout during hydration

## Testing Strategy

- Add shell-level component tests for:
  - desktop default-open behavior
  - mobile default-closed behavior
  - desktop toggle behavior
  - mobile open/close behavior
  - mobile close on backdrop click
  - mobile close on `Escape`
  - mobile close on route change

- Add regression coverage for sidebar content so the drawer refactor does not change:
  - visible navigation items
  - active-state behavior
  - recent-runs rendering

- Run targeted Vitest coverage for the new shell and sidebar components, then run the full test suite and `npm run lint`.

## Risks and Mitigations

- Risk: duplicating sidebar markup across breakpoints creates drift.
  - Mitigation: extract a shared sidebar content component and reuse it in both presentations.

- Risk: client-only breakpoint logic causes hydration mismatch or layout flicker.
  - Mitigation: keep the server-rendered content-first structure stable and limit client logic to the shell boundary.

- Risk: desktop overlay behavior could obscure the workspace and feel modal.
  - Mitigation: use pushed desktop layout instead of a desktop overlay.

- Risk: mobile drawer remains open after navigation and obscures the destination page.
  - Mitigation: close the overlay on route changes below `xl`.
