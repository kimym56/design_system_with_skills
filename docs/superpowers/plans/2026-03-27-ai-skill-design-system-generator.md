# AI Skill Design System Generator Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MVP web service that lets a Google-authenticated user select approved UI/UX skills and one predefined component type, then generate a `Next.js + TypeScript + Tailwind` component with code, safe preview, per-user history, and a 5-per-day server-enforced quota.

**Architecture:** This is a greenfield `Next.js` App Router application backed by `Postgres` via `Prisma` and authenticated with `Auth.js` Google OAuth. GitHub skill discovery runs server-side into a normalized local catalog, and the generation pipeline calls the OpenAI Responses API with a constrained prompt and validates the returned code before showing it inside an isolated preview frame.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Auth.js, Prisma, PostgreSQL, Zod, OpenAI Node SDK, Octokit/GitHub REST API, Vitest, Testing Library

---

## File Structure

### App and UI

- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`
- Create: `app/(app)/layout.tsx`
- Create: `app/(app)/workspace/page.tsx`
- Create: `app/(app)/history/page.tsx`
- Create: `app/(app)/history/[generationId]/page.tsx`
- Create: `app/admin/skills/page.tsx`
- Create: `components/app-sidebar.tsx`
- Create: `components/create-generation-form.tsx`
- Create: `components/generation-code-panel.tsx`
- Create: `components/generation-preview-frame.tsx`
- Create: `components/history-list.tsx`
- Create: `components/skill-multi-select.tsx`

### Auth and server wiring

- Create: `auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `middleware.ts`
- Create: `lib/auth/guards.ts`
- Create: `lib/env.ts`
- Create: `lib/db.ts`

### Domain logic

- Create: `lib/catalog/component-types.ts`
- Create: `lib/catalog/catalog-rules.ts`
- Create: `lib/catalog/catalog-service.ts`
- Create: `lib/catalog/readme-parser.ts`
- Create: `lib/catalog/skill-normalizer.ts`
- Create: `lib/catalog/github-sync.ts`
- Create: `lib/generation/generation-schema.ts`
- Create: `lib/generation/build-generation-input.ts`
- Create: `lib/generation/build-generation-prompt.ts`
- Create: `lib/generation/openai-client.ts`
- Create: `lib/generation/validate-generated-code.ts`
- Create: `lib/generation/quota-service.ts`
- Create: `lib/generation/history-service.ts`
- Create: `lib/preview/build-preview-document.ts`

### Data and background jobs

- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `scripts/sync-skills.ts`
- Create: `.env.example`
- Create: `docker-compose.yml`

### Tests

- Create: `tests/catalog/catalog-rules.test.ts`
- Create: `tests/catalog/skill-normalizer.test.ts`
- Create: `tests/generation/quota-service.test.ts`
- Create: `tests/generation/validate-generated-code.test.ts`
- Create: `tests/generation/build-generation-input.test.ts`
- Create: `tests/app/workspace-page.test.tsx`
- Create: `tests/app/history-page.test.tsx`
- Create: `tests/api/generate-route.test.ts`
- Create: `tests/api/sync-route.test.ts`

## Chunk 1: Project Foundation

### Task 1: Scaffold the application and tooling baseline

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `.env.example`
- Create: `docker-compose.yml`
- Test: `tests/app/workspace-page.test.tsx`

- [ ] **Step 1: Scaffold the Next.js app**

Run: `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir false --use-npm --import-alias "@/*"`
Expected: project scaffolded without overwriting `docs/`, `.gitignore`, or `skills-lock.json`

- [ ] **Step 2: Install runtime and test dependencies**

Run: `npm install @auth/prisma-adapter @prisma/client next-auth openai octokit zod date-fns clsx`
Run: `npm install -D prisma vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/node tsx`
Expected: dependencies added to `package.json`

- [ ] **Step 3: Write the failing workspace smoke test**

```tsx
import { render, screen } from "@testing-library/react";
import WorkspacePage from "@/app/(app)/workspace/page";

test("workspace page shows the generation builder heading", async () => {
  render(await WorkspacePage());

  expect(
    screen.getByRole("heading", { name: /build a component/i }),
  ).toBeInTheDocument();
});
```

- [ ] **Step 4: Run the smoke test to verify it fails**

Run: `npx vitest run tests/app/workspace-page.test.tsx`
Expected: FAIL because the workspace route does not exist yet

- [ ] **Step 5: Add the minimum app shell to make the smoke test pass**

Create the marketing homepage and workspace page with a heading placeholder, global styles, and Vitest setup.

- [ ] **Step 6: Re-run the smoke test**

Run: `npx vitest run tests/app/workspace-page.test.tsx`
Expected: PASS

- [ ] **Step 7: Commit the foundation scaffold**

```bash
git add .
git commit -m "feat: scaffold next app foundation"
```

### Task 2: Add environment parsing, database wiring, and local Postgres support

**Files:**
- Create: `lib/env.ts`
- Create: `lib/db.ts`
- Create: `prisma/schema.prisma`
- Create: `docker-compose.yml`
- Create: `.env.example`
- Test: `tests/catalog/catalog-rules.test.ts`

- [ ] **Step 1: Write the failing environment validation test**

```ts
import { expect, test } from "vitest";
import { envSchema } from "@/lib/env";

test("env schema requires the OpenAI, GitHub, Google, and database settings", () => {
  const result = envSchema.safeParse({});

  expect(result.success).toBe(false);
});
```

- [ ] **Step 2: Run the environment test to verify it fails**

Run: `npx vitest run tests/catalog/catalog-rules.test.ts`
Expected: FAIL because `envSchema` does not exist yet

- [ ] **Step 3: Implement env parsing and database client setup**

Create:
- a `zod` environment schema
- a singleton Prisma client
- a PostgreSQL Prisma schema with base models for `User`, `Account`, `Session`, and `VerificationToken`
- local `docker-compose.yml` for Postgres
- `.env.example` with required keys

- [ ] **Step 4: Re-run the environment test**

Run: `npx vitest run tests/catalog/catalog-rules.test.ts`
Expected: PASS

- [ ] **Step 5: Generate the Prisma client**

Run: `npx prisma generate`
Expected: Prisma client generated without schema errors

- [ ] **Step 6: Commit the env and database baseline**

```bash
git add .
git commit -m "feat: add env and database baseline"
```

## Chunk 2: Authentication, Catalog Data, and Quotas

### Task 3: Model the skill catalog, generation history, and daily usage tables

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `lib/catalog/component-types.ts`
- Test: `tests/catalog/skill-normalizer.test.ts`

- [ ] **Step 1: Write the failing component type catalog test**

```ts
import { expect, test } from "vitest";
import { CORE_COMPONENT_TYPES } from "@/lib/catalog/component-types";

test("core component type list contains the approved 12 items", () => {
  expect(CORE_COMPONENT_TYPES).toHaveLength(12);
  expect(CORE_COMPONENT_TYPES).toContain("Button");
  expect(CORE_COMPONENT_TYPES).toContain("Navbar");
});
```

- [ ] **Step 2: Run the catalog test to verify it fails**

Run: `npx vitest run tests/catalog/skill-normalizer.test.ts`
Expected: FAIL because the component type module does not exist yet

- [ ] **Step 3: Implement the schema and seed inputs**

Add Prisma models for:
- `Skill`
- `SkillSyncRun`
- `ComponentGeneration`
- `GenerationSkillSelection`
- `DailyUsage`
- `CatalogRuleConfig`

Also add:
- the Core 12 component list module
- Prisma seed logic that imports initial skill metadata from `skills-lock.json`

- [ ] **Step 4: Re-run the catalog test**

Run: `npx vitest run tests/catalog/skill-normalizer.test.ts`
Expected: PASS

- [ ] **Step 5: Create the first migration**

Run: `npx prisma migrate dev --name init`
Expected: migration generated and database schema applied

- [ ] **Step 6: Seed the database**

Run: `npx prisma db seed`
Expected: seeded component types, catalog rules, and starter skills from `skills-lock.json`

- [ ] **Step 7: Commit the domain schema**

```bash
git add .
git commit -m "feat: add skill catalog and generation schema"
```

### Task 4: Add Auth.js Google sign-in and route protection

**Files:**
- Create: `auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `middleware.ts`
- Create: `lib/auth/guards.ts`
- Create: `app/(app)/layout.tsx`
- Modify: `app/page.tsx`
- Test: `tests/app/history-page.test.tsx`

- [ ] **Step 1: Write the failing protected-layout test**

```tsx
import { render, screen } from "@testing-library/react";
import AppLayout from "@/app/(app)/layout";

test("authenticated app layout renders navigation labels", async () => {
  render(
    await AppLayout({
      children: <div>child</div>,
    }),
  );

  expect(screen.getByText(/workspace/i)).toBeInTheDocument();
  expect(screen.getByText(/history/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the layout test to verify it fails**

Run: `npx vitest run tests/app/history-page.test.tsx`
Expected: FAIL because the authenticated layout and auth wiring do not exist yet

- [ ] **Step 3: Implement the minimum auth stack**

Add:
- Auth.js config with Google provider and Prisma adapter
- auth route handler
- simple auth guard helpers
- middleware that protects `/workspace`, `/history`, and `/admin`
- marketing homepage CTA that routes signed-in users into the workspace
- authenticated app layout with navigation shell

- [ ] **Step 4: Re-run the layout test**

Run: `npx vitest run tests/app/history-page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit the auth layer**

```bash
git add .
git commit -m "feat: add google auth and protected app shell"
```

### Task 5: Add server-side daily quota enforcement

**Files:**
- Create: `lib/generation/quota-service.ts`
- Modify: `prisma/schema.prisma`
- Test: `tests/generation/quota-service.test.ts`

- [ ] **Step 1: Write the failing quota test**

```ts
import { expect, test } from "vitest";
import { canCreateGeneration } from "@/lib/generation/quota-service";

test("users with five generations already used cannot create another one", async () => {
  const result = await canCreateGeneration({
    userId: "user_123",
    usedToday: 5,
  });

  expect(result.allowed).toBe(false);
  expect(result.remaining).toBe(0);
});
```

- [ ] **Step 2: Run the quota test to verify it fails**

Run: `npx vitest run tests/generation/quota-service.test.ts`
Expected: FAIL because the quota service does not exist yet

- [ ] **Step 3: Implement the minimal quota service**

Implement:
- UTC date bucket logic
- daily remaining calculation
- an atomic increment path for successful generation attempts
- a helper used by the generation route and workspace UI

- [ ] **Step 4: Re-run the quota test**

Run: `npx vitest run tests/generation/quota-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the quota service**

```bash
git add .
git commit -m "feat: add daily generation quota enforcement"
```

## Chunk 3: Skill Catalog Sync and Admin Controls

### Task 6: Implement catalog rules and skill normalization

**Files:**
- Create: `lib/catalog/catalog-rules.ts`
- Create: `lib/catalog/readme-parser.ts`
- Create: `lib/catalog/skill-normalizer.ts`
- Test: `tests/catalog/catalog-rules.test.ts`

- [ ] **Step 1: Write the failing catalog rule test**

```ts
import { expect, test } from "vitest";
import { qualifiesForAutoPublish } from "@/lib/catalog/catalog-rules";

test("only public ui/ux repositories with README and at least 1000 stars auto-publish", () => {
  expect(
    qualifiesForAutoPublish({
      isPrivate: false,
      stars: 1200,
      topics: ["ui", "design-system"],
      hasReadme: true,
      readmeText: "A UI component skill for design systems",
    }),
  ).toBe(true);
});
```

- [ ] **Step 2: Run the catalog rule test to verify it fails**

Run: `npx vitest run tests/catalog/catalog-rules.test.ts`
Expected: FAIL because the rule module does not exist yet

- [ ] **Step 3: Implement rule evaluation and normalization**

Add:
- repo qualification logic
- README keyword matching
- normalization of raw GitHub metadata into the internal `Skill` shape

- [ ] **Step 4: Re-run the catalog rule test**

Run: `npx vitest run tests/catalog/catalog-rules.test.ts`
Expected: PASS

- [ ] **Step 5: Commit catalog rule logic**

```bash
git add .
git commit -m "feat: add skill catalog rule evaluation"
```

### Task 7: Build the GitHub sync job and admin surface

**Files:**
- Create: `lib/catalog/github-sync.ts`
- Create: `scripts/sync-skills.ts`
- Create: `app/admin/skills/page.tsx`
- Create: `tests/api/sync-route.test.ts`

- [ ] **Step 1: Write the failing sync service test**

```ts
import { expect, test } from "vitest";
import { mapSearchResultToCandidate } from "@/lib/catalog/github-sync";

test("sync candidate mapper keeps the repository identity and star count", () => {
  const candidate = mapSearchResultToCandidate({
    id: 42,
    full_name: "acme/ui-skill",
    stargazers_count: 1001,
    topics: ["ux", "ui"],
    private: false,
    description: "UI skill",
  });

  expect(candidate.fullName).toBe("acme/ui-skill");
  expect(candidate.stars).toBe(1001);
});
```

- [ ] **Step 2: Run the sync service test to verify it fails**

Run: `npx vitest run tests/api/sync-route.test.ts`
Expected: FAIL because the sync module does not exist yet

- [ ] **Step 3: Implement GitHub sync and admin read model**

Add:
- GitHub search integration
- README fetch and normalization
- database upsert flow for `Skill` and `SkillSyncRun`
- admin page showing included/excluded skills and sync status
- optional `ADMIN_EMAILS` guard for the admin route

- [ ] **Step 4: Re-run the sync service test**

Run: `npx vitest run tests/api/sync-route.test.ts`
Expected: PASS

- [ ] **Step 5: Add the sync entrypoint**

Run: `node --import tsx scripts/sync-skills.ts`
Expected: script executes and logs a dry-run or clear missing-env error

- [ ] **Step 6: Commit GitHub sync and admin tools**

```bash
git add .
git commit -m "feat: add github skill sync and admin catalog"
```

## Chunk 4: Generation, Preview, and History

### Task 8: Build generation request assembly and output validation

**Files:**
- Create: `lib/generation/generation-schema.ts`
- Create: `lib/generation/build-generation-input.ts`
- Create: `lib/generation/build-generation-prompt.ts`
- Create: `lib/generation/validate-generated-code.ts`
- Create: `tests/generation/build-generation-input.test.ts`
- Create: `tests/generation/validate-generated-code.test.ts`

- [ ] **Step 1: Write the failing generation input test**

```ts
import { expect, test } from "vitest";
import { buildGenerationInput } from "@/lib/generation/build-generation-input";

test("generation input includes the selected component type and normalized skills", () => {
  const result = buildGenerationInput({
    componentType: "Button",
    skills: [
      { name: "minimalist-ui", styleCues: ["minimal", "clean"] },
      { name: "design-taste-frontend", styleCues: ["bold", "structured"] },
    ],
  });

  expect(result.componentType).toBe("Button");
  expect(result.styleCues).toContain("minimal");
  expect(result.styleCues).toContain("bold");
});
```

- [ ] **Step 2: Run the generation input test to verify it fails**

Run: `npx vitest run tests/generation/build-generation-input.test.ts`
Expected: FAIL because generation input assembly does not exist yet

- [ ] **Step 3: Implement generation schema and prompt assembly**

Add:
- request input merger
- prompt builder that constrains output to `Next.js + TypeScript + Tailwind`
- `zod` schema for expected model output

- [ ] **Step 4: Write the failing generated-code validation test**

```ts
import { expect, test } from "vitest";
import { validateGeneratedCode } from "@/lib/generation/validate-generated-code";

test("generated code rejects fetch and external imports", () => {
  const result = validateGeneratedCode(
    "import axios from 'axios'; export function Demo(){ fetch('/x'); return <div />; }",
  );

  expect(result.ok).toBe(false);
});
```

- [ ] **Step 5: Run the validation test to verify it fails**

Run: `npx vitest run tests/generation/validate-generated-code.test.ts`
Expected: FAIL because the validator does not exist yet

- [ ] **Step 6: Implement preview safety validation**

Validate:
- allowed imports only
- no `fetch`
- no server-only APIs
- a single exported React component

- [ ] **Step 7: Re-run both generation tests**

Run: `npx vitest run tests/generation/build-generation-input.test.ts tests/generation/validate-generated-code.test.ts`
Expected: PASS

- [ ] **Step 8: Commit generation assembly and validation**

```bash
git add .
git commit -m "feat: add generation input assembly and validation"
```

### Task 9: Add the OpenAI generation route and user workspace UI

**Files:**
- Create: `lib/generation/openai-client.ts`
- Create: `app/api/generate/route.ts`
- Create: `components/create-generation-form.tsx`
- Create: `components/skill-multi-select.tsx`
- Create: `app/(app)/workspace/page.tsx`
- Create: `tests/api/generate-route.test.ts`

- [ ] **Step 1: Write the failing generation route test**

```ts
import { expect, test } from "vitest";
import { POST } from "@/app/api/generate/route";

test("generation route rejects requests above the daily quota", async () => {
  const response = await POST(
    new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        componentType: "Button",
        skillIds: ["skill_1"],
      }),
    }),
  );

  expect(response.status).toBe(429);
});
```

- [ ] **Step 2: Run the generation route test to verify it fails**

Run: `npx vitest run tests/api/generate-route.test.ts`
Expected: FAIL because the route does not exist yet

- [ ] **Step 3: Implement the generation endpoint**

Implement:
- auth guard
- component type and skill validation
- quota check
- OpenAI Responses API call
- response parsing
- output validation
- persistence into `ComponentGeneration`

- [ ] **Step 4: Add the workspace UI**

Implement:
- component type selector
- skill multi-select
- remaining quota indicator
- submit button and error handling
- result code panel and preview panel

- [ ] **Step 5: Re-run the generation route test**

Run: `npx vitest run tests/api/generate-route.test.ts`
Expected: PASS

- [ ] **Step 6: Commit generation route and workspace UI**

```bash
git add .
git commit -m "feat: add generation workflow and workspace ui"
```

### Task 10: Add history pages and isolated preview rendering

**Files:**
- Create: `lib/preview/build-preview-document.ts`
- Create: `components/generation-preview-frame.tsx`
- Create: `components/generation-code-panel.tsx`
- Create: `components/history-list.tsx`
- Create: `app/(app)/history/page.tsx`
- Create: `app/(app)/history/[generationId]/page.tsx`
- Test: `tests/app/history-page.test.tsx`

- [ ] **Step 1: Write the failing history page test**

```tsx
import { render, screen } from "@testing-library/react";
import HistoryPage from "@/app/(app)/history/page";

test("history page shows a heading and empty-state copy", async () => {
  render(await HistoryPage());

  expect(screen.getByRole("heading", { name: /generation history/i })).toBeInTheDocument();
  expect(screen.getByText(/no saved generations yet/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the history test to verify it fails**

Run: `npx vitest run tests/app/history-page.test.tsx`
Expected: FAIL because the history page does not exist yet

- [ ] **Step 3: Implement history and preview rendering**

Implement:
- history list page
- generation detail page
- isolated iframe document builder for preview-safe rendering
- code panel with syntax-friendly formatting

- [ ] **Step 4: Re-run the history test**

Run: `npx vitest run tests/app/history-page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit history and preview pages**

```bash
git add .
git commit -m "feat: add generation history and preview renderer"
```

## Chunk 5: End-to-End Verification and Developer Experience

### Task 11: Add README and local development instructions

**Files:**
- Create: `README.md`
- Modify: `.env.example`
- Modify: `package.json`

- [ ] **Step 1: Write the failing documentation checklist**

Create a checklist in the task branch covering:
- local Postgres startup
- Prisma migration and seed
- GitHub sync
- OpenAI and Google OAuth env setup
- running tests

- [ ] **Step 2: Confirm the current README is missing required setup guidance**

Run: `test -f README.md && sed -n '1,220p' README.md || echo "README missing"`
Expected: `README missing` or incomplete guidance

- [ ] **Step 3: Write the setup guide**

Document:
- required env vars
- how to run Postgres locally
- how to seed and sync skills
- how the quota works
- how preview safety works

- [ ] **Step 4: Commit developer docs**

```bash
git add .
git commit -m "docs: add local development guide"
```

### Task 12: Run the final verification suite

**Files:**
- Modify: `docs/superpowers/plans/2026-03-27-ai-skill-design-system-generator.md`

- [ ] **Step 1: Run unit and route tests**

Run: `npx vitest run`
Expected: PASS with zero failing tests

- [ ] **Step 2: Run linting**

Run: `npm run lint`
Expected: PASS with zero errors

- [ ] **Step 3: Run the Next.js production build**

Run: `npm run build`
Expected: PASS and compile the app successfully

- [ ] **Step 4: Run Prisma validation**

Run: `npx prisma validate`
Expected: `The schema at prisma/schema.prisma is valid`

- [ ] **Step 5: Run the GitHub sync entrypoint without credentials to verify controlled failure**

Run: `node --import tsx scripts/sync-skills.ts`
Expected: clear missing-env message and non-zero exit if `GITHUB_TOKEN` is absent

- [ ] **Step 6: Mark the completed steps in this plan**

Update the checkboxes and note any deviations from the original plan.

- [ ] **Step 7: Commit final verification updates**

```bash
git add .
git commit -m "chore: verify ai skill generator mvp"
```
