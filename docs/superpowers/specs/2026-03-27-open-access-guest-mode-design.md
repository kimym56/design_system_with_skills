# Open Access Guest Mode Design

**Date:** 2026-03-27

**Goal:** Temporarily allow the full product to be used without Google login. Unauthenticated visitors should be able to browse the skill catalog, generate components, view saved history, and reopen prior results. Access should be scoped to a browser-level guest identity cookie for anonymous users, while existing Google sign-in remains available but optional. The current `5/day` quota should be disabled for everyone until authenticated limits are reintroduced.

## Product Policy

### Temporary open access behavior

- `/workspace`, `/history`, and `/history/[generationId]` are publicly accessible.
- `/api/skills`, `/api/generate`, `/api/history`, and `/api/history/[generationId]` no longer require an authenticated Google session.
- Users with an active Google session continue to use their existing account-backed data.
- Users without a Google session receive a guest identity and can use the full product anonymously.
- Daily generation quota enforcement is disabled for now for both guests and signed-in users.

### Explicitly preserved

- Google sign-in remains wired and usable.
- Existing authenticated users continue to see only their own history.
- Skill publication rules, generation validation, preview isolation, and persistence behavior do not change.

## Actor Resolution Model

Every request that needs ownership information resolves a single actor in this order:

1. signed-in user session
2. existing guest cookie
3. newly issued guest cookie

The server should normalize this into a single actor shape, for example:

```ts
type RequestActor =
  | { type: "user"; userId: string }
  | { type: "guest"; guestId: string; isNewGuest: boolean };
```

### Cookie rules

- Cookie is HTTP-only and same-site restricted.
- Cookie value is a server-generated opaque identifier, not a user-facing token.
- Guest cookie issuance should happen lazily when an anonymous request first reaches a public API route that needs actor scoping.

## Data Model Changes

The cleanest reversible schema change is to support either a user-backed owner or a guest-backed owner on each saved generation.

### `ComponentGeneration`

Current shape is user-only. Update it to support guest ownership:

- `userId` becomes optional
- `guestId` is added as an optional string
- exactly one owner is expected at write time:
  - signed-in requests write `userId`
  - guest requests write `guestId`

Recommended indexes:

- `@@index([userId, createdAt])`
- `@@index([guestId, createdAt])`

### `DailyUsage`

No schema change is required. The table remains in place but is not consulted while open access mode is enabled.

## Routing And Service Changes

### Public skill catalog

`/api/skills` becomes public. It always returns:

- published skills
- quota metadata shaped for the current product policy

Since quota is disabled, the response should either omit meaningful enforcement or return an unlimited-style payload that keeps the current UI stable.

### Public generation

`/api/generate` becomes actor-aware instead of auth-only:

- resolve actor
- validate selected component type and skills
- skip quota enforcement
- save the generation using either `userId` or `guestId`
- return the saved artifact plus quota metadata that reflects the temporary unlimited policy

### Public history

`/api/history` and `/api/history/[generationId]` become actor-scoped:

- signed-in users query by `userId`
- guests query by `guestId`
- guest A cannot see guest B’s results because their cookie-scoped `guestId` differs

## UI Adjustments

The interface should stop implying that login is required.

### Landing page

- primary CTA should open the builder directly
- Google sign-in should be secondary or informational
- copy should explain that access is currently open

### App shell and workspace copy

- remove phrases such as `Google-authenticated workspace`
- keep the trust language about approved skills and safe preview
- remove or soften quota copy since the limit is disabled

### History behavior

- guest users can save and reopen results normally
- if they clear cookies or switch browsers, their guest history is lost

## Guardrails And Limitations

- Guest access is temporary product policy, not a durable identity system.
- The guest cookie scopes data but does not provide account recovery.
- Clearing cookies means losing anonymous history access.
- Signed-in and guest histories remain separate for now; no merge path is needed in this temporary phase.

## Testing Strategy

The implementation should cover:

- actor resolution precedence:
  - signed-in session wins
  - existing guest cookie is reused
  - new guest cookie is issued when needed
- generation persistence:
  - signed-in saves use `userId`
  - guest saves use `guestId`
- history lookup:
  - list and detail queries filter by the resolved actor
- open access behavior:
  - generation no longer fails without a session
  - skills route no longer fails without a session
- UI messaging:
  - landing page no longer makes Google login the required entry point
  - app shell/workspace copy no longer promises an enforced daily quota

## Reversibility

This change should be easy to unwind later:

- keep Auth.js configuration intact
- keep quota logic intact behind a single branch or flag
- isolate actor resolution in one helper so routes can switch back to session-only behavior later
- leave guest-owned history separate from account-owned history until a real claim/migration feature is designed
