# Local Env / Vercel Env Split Design

## Goal

Make the repository use `.env.local` for local secrets while keeping Vercel as the source of truth for deployed `Preview` and `Production` secrets.

## Current State

- The repo currently keeps local secrets in `.env`.
- `.env.example` exists as the committed template.
- Local CLI code uses `loadCliEnv()` via `@next/env`.
- The project is already deployed on Vercel and uses project environment variables there.

## Decision

Use `.env.local` as the local developer secret file and keep `.env.example` as the committed template.

This keeps the local setup aligned with Next.js guidance:

- local development secrets live in `.env.local`
- committed defaults/examples live in `.env.example`
- deployed secrets live in Vercel environment variables

## Behavior

### Local development

- Developers keep machine-specific secrets in `.env.local`.
- Next.js runtime automatically loads `.env.local`.
- CLI helpers that use `@next/env` should also support `.env.local` in development workflows.

### Vercel deployments

- `Preview` and `Production` continue to read secrets from Vercel project environment variables.
- No deployed secrets are read from repository env files.

### Tests

- Tests should explicitly cover the local CLI env-loading path that matters for this repo.
- The env-loading helper test should verify `.env.local` is used for local-style development loading.

## Files Affected

- `.env` to be replaced locally by `.env.local`
- `src/lib/load-cli-env.ts`
- `tests/config/load-cli-env.test.ts`
- `README.md`

## Risks

- `.env.local` is intentionally ignored in test mode by Next.js when using default test semantics, so the helper test must opt into the intended development-style loading path explicitly.
- Renaming the local secret file must not leak secrets into git. Existing `.gitignore` already covers `.env*`.

## Success Criteria

- Local secrets live in `.env.local`.
- Repo docs clearly distinguish local secrets from Vercel env vars.
- CLI env loading still works for local development.
- Tests pass after the helper/test update.
