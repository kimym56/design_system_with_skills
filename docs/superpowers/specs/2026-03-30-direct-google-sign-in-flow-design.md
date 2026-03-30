# Direct Google Sign-In Flow Design

## Goal

Remove the extra Auth.js provider-selection page from the normal product flow so unauthenticated users are sent into Google sign-in immediately.

## Current State

- The landing page links directly to `/api/auth/signin/google?callbackUrl=%2Fworkspace`.
- Protected routes (`/workspace`, `/history`, `/admin`) redirect unauthenticated users back to `/`.
- Auth.js renders an intermediate sign-in page before the user reaches Google.
- Google is the only configured auth provider in this app.

## Decision

Introduce an app-owned `/sign-in` route that immediately starts Google OAuth and becomes the only sign-in entrypoint used by the product.

This keeps the auth flow inside application-owned UI while preserving Auth.js session handling:

- landing-page sign-in links point to `/sign-in?callbackUrl=/workspace`
- middleware redirects protected routes to `/sign-in?callbackUrl=<requested path>`
- the `/sign-in` page automatically calls `signIn("google", { callbackUrl })`
- the page renders a minimal fallback state if JavaScript does not redirect immediately

## Behavior

### Landing page

- Both "Sign in with Google" CTAs should link to `/sign-in?callbackUrl=%2Fworkspace`.
- "Open workspace" can remain `/workspace`; middleware will redirect unauthenticated users into the same `/sign-in` entrypoint.

### Protected routes

- Requests to protected paths without a valid auth token should redirect to `/sign-in`.
- The redirect should preserve the original path and query string in `callbackUrl`.

### Sign-in page

- The page should be client-rendered because it needs to call `signIn()` on mount.
- It should show a compact branded "Redirecting to Google…" state.
- It should expose a fallback button that manually calls `signIn()` again if the automatic redirect does not happen.

## Files Affected

- `src/app/page.tsx`
- `src/app/sign-in/page.tsx`
- `middleware.ts`
- `tests/app/home-page.test.tsx`
- `tests/app/sign-in-page.test.tsx`
- `tests/middleware.test.ts`

## Risks

- Middleware must preserve both the pathname and query string in `callbackUrl`; otherwise protected deep links regress.
- The client sign-in page must avoid infinite retry loops if `signIn()` throws or the page is opened without JavaScript.
- Tests need lightweight mocks for `next-auth/react` and Next request/response behavior.

## Success Criteria

- Normal sign-in no longer lands on the Auth.js provider-selection page first.
- Landing-page sign-in CTAs use the new `/sign-in` route.
- Unauthenticated protected-route access redirects to `/sign-in` with the original destination preserved.
- Focused tests and the production build pass.
