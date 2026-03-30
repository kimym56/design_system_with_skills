# Signed-In Account Menu Design

## Goal

Show the currently signed-in Google account in the product chrome, replace signed-in homepage sign-in CTAs with an account control, and replace the app-shell `Generation history` label with a small account menu trigger.

## Current State

- The homepage always renders explicit `Sign in with Google` buttons.
- The generation-history shell renders a static `Generation history` text label in the top bar.
- Server auth is available through `getServerAuthSession()`.
- There is no existing avatar, dropdown, or account-menu component in the UI layer.

## Decision

Build one shared account-menu component with two visual variants:

- `homepage`: a wider identity chip that shows avatar, display name, and a small `Account` label
- `compact`: a tighter chip for the generation-history shell that shows avatar plus a short name

The menu body stays the same in both places:

- current user avatar, name, and email
- `Workspace` link
- `History` link
- `Sign out` action

## Behavior

### Homepage

- Signed out: keep the existing Google sign-in buttons.
- Signed in: replace the sign-in buttons with the homepage account chip.
- The `Open workspace` button remains available.

### App shell

- Replace the static `Generation history` label in the top bar with the compact account chip.
- Opening the chip reveals the shared account menu.
- Signed-out state is not a first-class branch here because middleware already protects these routes.

### Account menu

- Opens and closes on trigger click.
- Closes on outside click and `Escape`.
- Shows avatar initials when no Google image is present.
- `Sign out` returns the user to `/`.

## Architecture

- Keep session lookup on the server in route components/layouts using `getServerAuthSession()`.
- Pass only the minimal user fields needed for display into a small client menu component.
- Keep the homepage and route layouts as Server Components; isolate interactivity in the shared client account-menu component.

## Files Affected

- `src/app/page.tsx`
- `src/app/(app)/(generation-history)/layout.tsx`
- `src/components/generation-history-shell.tsx`
- `src/components/auth/account-menu.tsx`
- `src/components/auth/account-menu-trigger.tsx` or equivalent helper file if the implementation benefits from a split
- `tests/app/home-page.test.tsx`
- `tests/app/app-layout.test.tsx`
- `tests/components/generation-history-shell.test.tsx`
- `tests/components/auth/account-menu.test.tsx`

## Risks

- Layouts are cached on navigation, so account data for the app shell should come from the initial server render and not depend on query-string updates.
- The client menu must manage focus/close behavior without introducing a brittle custom overlay system.
- Replacing static homepage links with a signed-in control must not regress the existing signed-out Google sign-in flow.

## Success Criteria

- Signed-in homepage users see an account chip instead of `Sign in with Google`.
- The app-shell top bar shows the compact account trigger instead of `Generation history`.
- The menu shows the current account identity plus `Workspace`, `History`, and `Sign out`.
- Signed-out homepage behavior still works.
- Focused tests and the production build pass.
