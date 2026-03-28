# Skill Metadata Refresh Design

**Date:** 2026-03-28

**Goal:** Refresh GitHub-backed skill metadata on demand and persist the latest repository description and star count into the local `Skill` table, without adding runtime GitHub fetches to the public skill picker.

## Product Behavior

### Manual refresh model

- The workspace skill picker continues to read only from `/api/skills`.
- `/api/skills` continues to return database values only.
- Repository description and star count are updated only when an explicit refresh command is run.
- Refresh is a maintenance action, not a user-facing runtime behavior.

### Explicitly preserved

- Opening the skill list does not make GitHub API calls.
- Existing selection and generation flows do not change.
- Existing seeded and discovered skills remain in the same table and keep the same public shape.

## Refresh Scope

The refresh should target published skills that already have a GitHub repository identity:

- `publishStatus = PUBLISHED`
- `repoOwner` present
- `repoName` present

For each matching skill, the refresh should fetch:

- current GitHub repository description
- current GitHub star count

The refresh should then write:

- `description`
- `githubStars`
- `lastSyncedAt`

## Architecture

Introduce a small catalog-level refresh helper that accepts a Prisma client and Octokit instance, reads eligible skills from the database, fetches repository metadata from GitHub, and updates each skill independently.

Wrap that helper in a CLI script so metadata can be refreshed manually with a terminal command such as `npm run skills:refresh`.

## Failure Handling

- A single repository failure must not abort the entire refresh.
- Missing or deleted repositories should be counted as failures and skipped.
- The command should print a compact summary at the end:
  - number of skills checked
  - number of skills updated
  - number of failures

## Data Handling Rules

- If GitHub returns a non-empty description, persist it.
- If GitHub returns `null` for description, store `null` rather than inventing a new summary.
- Always persist the latest star count returned by GitHub.
- Always update `lastSyncedAt` for successfully refreshed skills.

## Testing Strategy

The implementation should cover:

- selecting only published skills with a repository owner and name
- updating `description`, `githubStars`, and `lastSyncedAt` from GitHub responses
- continuing after one repository fetch fails
- returning a usable summary for the CLI script

## Operational Notes

- The refresh uses the existing `GITHUB_TOKEN` environment variable.
- The command is safe to run repeatedly.
- This design intentionally avoids background jobs, admin UI, and runtime cache invalidation because the requirement is manual refresh only.
