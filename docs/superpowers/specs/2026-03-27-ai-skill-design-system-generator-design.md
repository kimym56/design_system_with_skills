# AI Skill Design System Generator Design

**Date:** 2026-03-27

**Goal:** Build an MVP service where a signed-in user can select published UI/UX-oriented agent skills plus a predefined design system component type, then generate a `Next.js + TypeScript + Tailwind` component using only the selected skills. The service must show both source code and a rendered result, support Google sign-in, save generation history, and enforce a per-user limit of 5 generations per day.

## Product Scope

### Included in MVP

- Google sign-in for any Google account
- Predefined component generation for the Core 12 component types:
  - `Button`
  - `Input`
  - `Textarea`
  - `Select`
  - `Checkbox`
  - `Radio`
  - `Switch`
  - `Card`
  - `Modal`
  - `Tabs`
  - `Accordion`
  - `Navbar`
- Hybrid skill catalog:
  - manually seeded entries
  - GitHub-discovered entries that auto-publish only if they match the catalog rules
- GitHub catalog rules for discovered skills:
  - public repository
  - UI/UX-related topic or README match
  - README present
  - at least `1,000` GitHub stars
- Server-side component generation using OpenAI
- Structured output constrained to `Next.js + TypeScript + Tailwind`
- Safe rendered preview plus code view
- Per-user generation history
- Server-enforced limit of `5` generations per user per day
- Minimal internal admin tools for catalog review and sync visibility

### Explicitly Excluded from MVP

- Payments
- Free-form component requests
- Arbitrary component types outside the Core 12
- Arbitrary package installation in previews
- Team workspaces
- Collaborative editing
- Exporting directly into external repositories

## Recommended Architecture

The MVP uses a server-composed generation pipeline built on `Next.js`, `Auth.js`, `Prisma`, and `Postgres`.

### Core application areas

1. **Public and authenticated app shell**
   - Public landing page
   - Google sign-in flow
   - Authenticated workspace for component selection, skill selection, generation, and history

2. **Skill catalog service**
   - Serves the user-visible catalog from the application database
   - Combines seeded records and GitHub-discovered records
   - Runs GitHub discovery in the background instead of during user requests

3. **Generation service**
   - Validates auth, quota, component type, and selected skills
   - Builds a strict OpenAI request using only approved skill data and the chosen component template
   - Stores generated code, metadata, and preview artifacts in history

4. **Preview and history**
   - Renders code in a safe isolated preview
   - Shows generated source code and metadata
   - Lets the user reopen prior generations

## Request Flow

1. User signs in with Google.
2. User selects one Core 12 component type.
3. User selects one or more approved UI/UX skills from the catalog.
4. User submits the generation request.
5. The server checks the current day's usage count.
6. The server builds a constrained OpenAI request from the component type template and normalized selected skill data.
7. The server validates the response and stores the result.
8. The UI shows source code, rendered preview, and saved history.

## Data Model

### `User`

Stores Auth.js-linked identity information and future billing/profile extension points.

### `Skill`

Represents a published skill visible in the catalog. Fields should include:

- source type: `seeded` or `github_discovered`
- repository owner/name and URL
- description
- topics
- star count
- README snapshot
- normalized tags and style cues
- publish state
- sync timestamps

### `SkillSyncRun`

Tracks each GitHub sync execution, including:

- run start/end time
- search configuration
- result counts
- skip reasons
- sync errors

### `ComponentGeneration`

Stores:

- user ID
- component type
- selected skill IDs
- generation input snapshot
- generated code
- preview payload
- model metadata
- validation status
- timestamps

### `DailyUsage`

Stores the per-user, per-day generation count used for enforcing the daily quota.

### `CatalogRuleConfig`

Stores adjustable catalog discovery rules such as:

- minimum star threshold
- topic keywords
- sync cadence
- auto-publish flags

## Business Rules

- Any Google account can sign in.
- Only cataloged skills can be used for generation.
- GitHub-discovered skills auto-publish only if they satisfy the configured rules.
- Users cannot submit a free-form component request in v1.
- Users can generate only from the Core 12 list.
- Each signed-in user can generate at most `5` components per day.
- History is stored per user and can be reopened later.
- Failed generations should be retained for auditability even if only successful generations are shown in the primary history list.

## Skill Normalization Policy

Raw GitHub repositories should not be read live during a user request. Each skill should be reduced during sync into a safe internal representation that includes:

- repository metadata
- README summary
- UI/UX classification
- style cues
- usage notes

The generation pipeline should consume this normalized representation rather than arbitrary repository files at runtime.

## Generation Pipeline

### Inputs

- selected Core 12 component type
- selected approved skills
- fixed code target: `Next.js + TypeScript + Tailwind`
- strict output schema

### Model integration

Use the OpenAI `Responses API` and start with `gpt-5.4` for the coding-heavy generation workflow. This aligns with current official guidance that recommends `gpt-5.4` as the default for broad general-purpose and coding tasks, and recommends the Responses API for GPT-5 workflows.

Sources:

- https://platform.openai.com/docs/api-reference/responses
- https://developers.openai.com/api/docs/guides/latest-model

### Output contract

The model response should be parsed into a constrained structure such as:

- component name
- component source code
- optional supporting style metadata
- short rationale
- preview-safe metadata

If parsing or validation fails, the request should be rejected and recorded as a failed generation.

## Preview Safety Model

The generated output must be treated as untrusted visual code, not trusted application code.

### Preview constraints

- run inside an isolated preview frame
- allow only approved preview runtime primitives
- block arbitrary package imports
- block network requests
- block access to secrets, server actions, filesystem, and unrestricted browser APIs

### Validation before save/render

- component type matches the requested type
- imports are restricted to the approved preview runtime
- no disallowed APIs or `fetch` calls
- code compiles inside the preview harness
- output remains within complexity and size limits

If validation fails, the service returns a controlled error instead of rendering unsafe code.

## GitHub Sync And Admin Operations

### Sync behavior

GitHub discovery should run as a background job on a schedule. Each run should:

1. search GitHub for candidate UI/UX skill repositories
2. evaluate each repository against the auto-publish rules
3. snapshot the README and relevant metadata
4. upsert matching records into the catalog
5. log the run in `SkillSyncRun`

### Minimal admin surface

The MVP should include a simple internal admin area that allows:

- viewing synced skills
- inspecting why a skill was included or excluded
- forcing a resync
- disabling an auto-published skill manually

## Quota Policy

Quota enforcement is server-side only. The UI may show remaining generations for convenience, but the backend is the source of truth.

For consistency, the MVP should reset daily quotas on a fixed UTC day boundary. User-local reset behavior can be added later if needed.

## Testing Strategy

The implementation should cover:

- auth-protected routes
- Google sign-in integration boundaries
- quota enforcement
- GitHub sync rule evaluation
- generation request validation
- preview safety validation
- history persistence
- create/view/reopen user flows

## Risks And Mitigations

### Risk: low-quality GitHub skill ingestion

Mitigation:

- strict catalog rules
- normalized internal representation
- internal admin disable control

### Risk: unsafe generated output

Mitigation:

- strict output schema
- server-side validation
- isolated preview runtime
- no arbitrary packages or network access

### Risk: quota abuse

Mitigation:

- Google sign-in required
- server-enforced per-user quota
- persistent usage records

### Risk: over-scoping the first release

Mitigation:

- fixed Core 12 component scope
- no free-form prompts
- no billing in MVP

## Implementation Notes

- Use `Auth.js` with Google OAuth for authentication.
- Use `Prisma` with `Postgres` for user, catalog, history, and quota data.
- Keep GitHub sync, generation, preview, and auth as separate units with explicit interfaces so billing can be added later without rewriting the core flow.
