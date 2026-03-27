# Open Access Guest Mode Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Temporarily open the product so guests can use the full builder, generation flow, and saved history without Google login, while keeping Google auth available and disabling daily quota enforcement for now.

**Architecture:** Introduce a single request-actor resolver that chooses between a signed-in user and a guest cookie identity. Persist saved generations against either `userId` or `guestId`, make the generation and history routes actor-scoped instead of auth-gated, and keep the quota subsystem in place but bypassed behind a single temporary branch.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Auth.js, Prisma, PostgreSQL, Zod, Vitest, Testing Library

---

## File Structure

### Data and ownership

- Modify: `prisma/schema.prisma`
- Create: `src/lib/auth/request-actor.ts`
- Modify: `src/lib/generation/history-service.ts`
- Modify: `src/lib/generation/handle-generate-request.ts`

### API routes

- Modify: `src/app/api/skills/route.ts`
- Modify: `src/app/api/generate/route.ts`
- Modify: `src/app/api/history/route.ts`
- Modify: `src/app/api/history/[generationId]/route.ts`

### UI copy and app behavior

- Modify: `src/app/page.tsx`
- Modify: `src/components/app-sidebar.tsx`
- Modify: `src/components/create-generation-form.tsx`

### Tests

- Create: `tests/auth/request-actor.test.ts`
- Create: `tests/generation/history-service.test.ts`
- Modify: `tests/generation/handle-generate-request.test.ts`
- Modify: `tests/app/home-page.test.tsx`

## Chunk 1: Guest Actor Resolution And Ownership

### Task 1: Add a request actor resolver with guest cookie support

**Files:**
- Create: `src/lib/auth/request-actor.ts`
- Test: `tests/auth/request-actor.test.ts`

- [ ] **Step 1: Write the failing actor-resolution tests**

```ts
import { expect, test } from "vitest";
import { resolveRequestActor } from "@/lib/auth/request-actor";

test("signed-in sessions win over guest cookies", async () => {
  const result = await resolveRequestActor({
    session: { user: { id: "user_123" } },
    guestCookieValue: "guest_existing",
  });

  expect(result.actor).toEqual({ type: "user", userId: "user_123" });
  expect(result.cookieToSet).toBeNull();
});

test("anonymous requests reuse an existing guest cookie", async () => {
  const result = await resolveRequestActor({
    session: null,
    guestCookieValue: "guest_existing",
  });

  expect(result.actor).toEqual({
    type: "guest",
    guestId: "guest_existing",
    isNewGuest: false,
  });
});
```

- [ ] **Step 2: Run the actor-resolution tests to verify they fail**

Run: `npx vitest run tests/auth/request-actor.test.ts`
Expected: FAIL because `resolveRequestActor` does not exist yet

- [ ] **Step 3: Implement the minimal actor resolver**

Create `src/lib/auth/request-actor.ts` with:
- a guest cookie name constant
- a small `RequestActor` union type
- a pure `resolveRequestActor()` helper that accepts a session and optional guest cookie value
- server-safe guest ID generation for the no-session, no-cookie path
- a return shape that includes `cookieToSet` when a new guest needs to be persisted

- [ ] **Step 4: Re-run the actor-resolution tests**

Run: `npx vitest run tests/auth/request-actor.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the actor resolver**

```bash
git add src/lib/auth/request-actor.ts tests/auth/request-actor.test.ts
git commit -m "feat: add guest request actor resolver"
```

### Task 2: Add guest ownership to saved generations

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `src/lib/generation/history-service.ts`
- Create: `tests/generation/history-service.test.ts`

- [ ] **Step 1: Write the failing history ownership tests**

```ts
import { expect, test } from "vitest";
import { buildGenerationOwnerFilter } from "@/lib/generation/history-service";

test("guest filters target the guest id", () => {
  expect(
    buildGenerationOwnerFilter({ type: "guest", guestId: "guest_123", isNewGuest: false }),
  ).toEqual({ guestId: "guest_123" });
});

test("user filters target the user id", () => {
  expect(
    buildGenerationOwnerFilter({ type: "user", userId: "user_123" }),
  ).toEqual({ userId: "user_123" });
});
```

- [ ] **Step 2: Run the history ownership tests to verify they fail**

Run: `npx vitest run tests/generation/history-service.test.ts`
Expected: FAIL because the helper does not exist yet

- [ ] **Step 3: Update the Prisma schema for guest-owned generations**

Change `ComponentGeneration` so that:
- `userId` is optional
- `guestId` is added as an optional `String`
- owner indexes exist for both `userId` and `guestId`

Keep the `User` relation for signed-in records and do not change `DailyUsage`.

- [ ] **Step 4: Implement actor-aware history helpers**

Update `src/lib/generation/history-service.ts` to:
- expose a small owner-filter helper
- save generations with either `userId` or `guestId`
- list generations for the resolved actor
- fetch a single generation for the resolved actor

- [ ] **Step 5: Re-run the history ownership tests**

Run: `npx vitest run tests/generation/history-service.test.ts`
Expected: PASS

- [ ] **Step 6: Validate the Prisma schema**

Run: `npx prisma validate`
Expected: PASS

- [ ] **Step 7: Create and review the migration**

Run: `npx prisma migrate dev --name add_guest_generation_owner`
Expected: migration generated with nullable `userId` and new `guestId`

- [ ] **Step 8: Commit the ownership changes**

```bash
git add prisma/schema.prisma prisma/migrations src/lib/generation/history-service.ts tests/generation/history-service.test.ts
git commit -m "feat: support guest-owned generation history"
```

## Chunk 2: Public API Access And Quota Bypass

### Task 3: Allow anonymous generation without quota enforcement

**Files:**
- Modify: `src/lib/generation/handle-generate-request.ts`
- Modify: `tests/generation/handle-generate-request.test.ts`

- [ ] **Step 1: Replace the old auth/quota test with a guest-access test**

```ts
import { expect, test } from "vitest";
import { handleGenerateRequest } from "@/lib/generation/handle-generate-request";

test("guest generation requests succeed without a user session", async () => {
  const response = await handleGenerateRequest(
    { componentType: "Button", skillIds: ["skill_1"] },
    {
      resolveActor: async () => ({ actor: { type: "guest", guestId: "guest_123", isNewGuest: false }, cookieToSet: null }),
      getQuotaStatus: async () => {
        throw new Error("quota should be bypassed");
      },
      getSkills: async () => [{ id: "skill_1", name: "Skill", styleCues: [] }],
      generateComponent: async () => ({
        componentName: "Button",
        code: "export function Button(){ return <button>OK</button>; }",
        previewMarkup: "<button>OK</button>",
        rationale: "Uses selected skill.",
      }),
      recordUsage: async () => {
        throw new Error("usage should not be recorded while quota is disabled");
      },
      saveGeneration: async () => ({ id: "generation_123" }),
    },
  );

  expect(response.status).toBe(200);
});
```

- [ ] **Step 2: Run the generation handler test to verify it fails**

Run: `npx vitest run tests/generation/handle-generate-request.test.ts`
Expected: FAIL because `handleGenerateRequest()` still requires a session

- [ ] **Step 3: Refactor the generation handler around resolved actors**

Update `src/lib/generation/handle-generate-request.ts` to:
- depend on `resolveActor()` instead of `getSession()`
- save under `userId` or `guestId`
- bypass quota checks and usage recording behind one obvious temporary branch
- keep request validation and generated-code validation unchanged

- [ ] **Step 4: Re-run the generation handler test**

Run: `npx vitest run tests/generation/handle-generate-request.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the public generation flow**

```bash
git add src/lib/generation/handle-generate-request.ts tests/generation/handle-generate-request.test.ts
git commit -m "feat: allow guest generation requests"
```

### Task 4: Make skills and history routes public and actor-scoped

**Files:**
- Modify: `src/app/api/skills/route.ts`
- Modify: `src/app/api/generate/route.ts`
- Modify: `src/app/api/history/route.ts`
- Modify: `src/app/api/history/[generationId]/route.ts`

- [ ] **Step 1: Wire the public routes through the actor resolver**

Update the route handlers so they:
- no longer return `401 Authentication required` for anonymous callers
- resolve the current actor
- set the guest cookie when `cookieToSet` exists
- pass actor-scoped identifiers into the history and generation services

- [ ] **Step 2: Return stable quota metadata for open access mode**

Keep the current UI contract stable by returning a quota payload shape that clearly represents temporary unlimited access.

- [ ] **Step 3: Verify the affected behavior with targeted tests**

Run: `npx vitest run tests/generation/handle-generate-request.test.ts tests/generation/history-service.test.ts`
Expected: PASS

- [ ] **Step 4: Commit the route changes**

```bash
git add src/app/api/skills/route.ts src/app/api/generate/route.ts src/app/api/history/route.ts src/app/api/history/[generationId]/route.ts
git commit -m "feat: make builder routes publicly accessible"
```

## Chunk 3: UI Messaging And Final Verification

### Task 5: Update the product copy for open access mode

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/app-sidebar.tsx`
- Modify: `src/components/create-generation-form.tsx`
- Modify: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Write the failing landing-page copy test**

Update `tests/app/home-page.test.tsx` so it expects:
- a primary CTA that opens `/workspace`
- copy that no longer says Google sign-in is required

- [ ] **Step 2: Run the landing-page test to verify it fails**

Run: `npx vitest run tests/app/home-page.test.tsx`
Expected: FAIL because the current primary CTA still points at Google sign-in

- [ ] **Step 3: Update the landing page and shell copy**

Adjust the UI so that:
- the primary landing CTA goes to `/workspace`
- Google sign-in becomes optional secondary access
- sidebar and workspace copy stop promising `Google-authenticated` access or a hard `5/day` cap

- [ ] **Step 4: Re-run the landing-page test**

Run: `npx vitest run tests/app/home-page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit the messaging update**

```bash
git add src/app/page.tsx src/components/app-sidebar.tsx src/components/create-generation-form.tsx tests/app/home-page.test.tsx
git commit -m "feat: update ui copy for open access mode"
```

### Task 6: Run end-to-end verification for the temporary open-access release

**Files:**
- Modify: none
- Test: `tests/auth/request-actor.test.ts`
- Test: `tests/generation/history-service.test.ts`
- Test: `tests/generation/handle-generate-request.test.ts`
- Test: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Run the focused test suite**

Run: `npx vitest run tests/auth/request-actor.test.ts tests/generation/history-service.test.ts tests/generation/handle-generate-request.test.ts tests/app/home-page.test.tsx`
Expected: PASS

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Run the production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit the verified open-access release**

```bash
git add .
git commit -m "feat: add temporary guest open access mode"
```
