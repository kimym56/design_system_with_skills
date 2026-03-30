# Explicit Google Sign-In Button Design

## Goal

Make explicit `Sign in with Google` clicks feel faster by sending users straight into Google OAuth from the landing page, while keeping the app-owned `/sign-in` route for forced sign-in redirects.

## Current State

- The landing page sign-in CTAs link to `/sign-in?callbackUrl=%2Fworkspace`.
- The `/sign-in` page immediately calls `signIn("google")` and works well for signed-out protected-route redirects.
- Protected routes already redirect to `/sign-in?callbackUrl=...` through middleware.

## Decision

Split the auth entrypoints by intent:

- explicit user sign-in clicks on the landing page should call `signIn("google", { callbackUrl })` directly from a client button
- forced auth from protected routes should continue to use the branded `/sign-in` page

This keeps the product reliable while removing one visible step from the intentional CTA flow.

## Behavior

### Landing page

- Both `Sign in with Google` CTAs render as buttons, not links.
- Clicking either button calls `signIn("google", { callbackUrl: "/workspace" })` immediately.
- The existing `Open workspace` link remains unchanged.

### Protected routes

- Middleware still redirects signed-out requests to `/sign-in?callbackUrl=<requested destination>`.
- The `/sign-in` page still exists as the fallback and forced-auth path.

## Files Affected

- `src/app/page.tsx`
- `src/components/auth/google-sign-in-button.tsx`
- `tests/app/home-page.test.tsx`

## Risks

- The landing page must stay a Server Component; the client-side sign-in behavior should live in a small leaf component to avoid expanding the client bundle unnecessarily.
- Tests must verify both the UI shape change and the `signIn()` callback URL.

## Success Criteria

- Landing-page sign-in CTAs invoke Google OAuth directly on click.
- Protected-route redirects still use `/sign-in`.
- Focused tests and the production build pass.
