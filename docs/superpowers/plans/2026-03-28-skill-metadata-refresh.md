# Skill Metadata Refresh Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a manual command that refreshes GitHub stars and descriptions for published skills and persists the latest metadata into the local database.

**Architecture:** Add a reusable catalog refresh helper that loads eligible skills from Prisma, fetches repository metadata from GitHub through Octokit, and updates each skill independently. Expose that helper through a small CLI script and keep the runtime `/api/skills` path database-only.

**Tech Stack:** Next.js App Router, TypeScript, Prisma, PostgreSQL, Octokit, Vitest

---

## File Structure

### Refresh logic

- Create: `src/lib/catalog/refresh-skill-metadata.ts`
- Create: `scripts/refresh-skill-metadata.ts`

### Package wiring

- Modify: `package.json`

### Tests

- Create: `tests/catalog/refresh-skill-metadata.test.ts`

## Chunk 1: Refresh Helper

### Task 1: Add failing tests for manual metadata refresh

**Files:**
- Create: `tests/catalog/refresh-skill-metadata.test.ts`
- Test: `tests/catalog/refresh-skill-metadata.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
test("refreshes published skills with repo coordinates", async () => {
  // asserts description, stars, and lastSyncedAt are updated
});

test("continues refreshing after one repo lookup fails", async () => {
  // asserts one failure does not abort the rest
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/catalog/refresh-skill-metadata.test.ts`
Expected: FAIL because the refresh helper does not exist yet

- [ ] **Step 3: Implement the minimal refresh helper**

Create `src/lib/catalog/refresh-skill-metadata.ts` with:
- a helper that reads published skills with `repoOwner` and `repoName`
- a GitHub fetch function using `GET /repos/{owner}/{repo}`
- per-skill update logic for `description`, `githubStars`, and `lastSyncedAt`
- a return summary with checked, updated, and failed counts

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- tests/catalog/refresh-skill-metadata.test.ts`
Expected: PASS

## Chunk 2: CLI Entry Point

### Task 2: Add the manual command

**Files:**
- Create: `scripts/refresh-skill-metadata.ts`
- Modify: `package.json`

- [ ] **Step 1: Add a small CLI wrapper**

The script should:
- create an Octokit client using `GITHUB_TOKEN`
- call the refresh helper
- print a compact summary
- exit non-zero only for top-level command failure

- [ ] **Step 2: Add an npm script**

Add:

```json
"skills:refresh": "tsx scripts/refresh-skill-metadata.ts"
```

- [ ] **Step 3: Re-run the targeted tests**

Run: `npm test -- tests/catalog/refresh-skill-metadata.test.ts`
Expected: PASS

## Chunk 3: Verification

### Task 3: Verify the manual refresh path

**Files:**
- Modify: `src/lib/catalog/refresh-skill-metadata.ts`
- Modify: `scripts/refresh-skill-metadata.ts`
- Modify: `package.json`
- Modify: `tests/catalog/refresh-skill-metadata.test.ts`

- [ ] **Step 1: Run the focused test file**

Run: `npm test -- tests/catalog/refresh-skill-metadata.test.ts`
Expected: PASS

- [ ] **Step 2: Run a broader regression slice**

Run: `npm test -- tests/app/workspace-page.test.tsx tests/catalog/refresh-skill-metadata.test.ts`
Expected: PASS

Plan complete and saved to `docs/superpowers/plans/2026-03-28-skill-metadata-refresh.md`. Ready to execute?
