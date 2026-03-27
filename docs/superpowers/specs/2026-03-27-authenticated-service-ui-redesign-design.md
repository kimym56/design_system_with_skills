# Authenticated Service UI Redesign Design

## Summary

Redesign the authenticated product surfaces to feel closer to Vercel's product UI language while preserving this product's `6:3:1` color balance:
- `60%` light backgrounds and surfaces
- `30%` dark typography, borders, and code surfaces
- `10%` cobalt emphasis for actions, selected states, links, and focus

This redesign applies only to the authenticated service experience:
- `/workspace`
- `/history`
- `/history/[generationId]`

The public landing page `/` stays unchanged for now.

## Goals

- Make the service feel like a focused product tool rather than a marketing/editorial hybrid.
- Align the authenticated shell, workspace, and history views into one consistent design system.
- Move the UI closer to Vercel-style product patterns for border radius, icon scale, typography rhythm, and layout density.
- Keep existing auth, API, quota, generation, and history behavior intact.

## Non-Goals

- No redesign of `/`.
- No backend, Prisma, or API contract changes.
- No auth flow changes.
- No new routes or product features.
- No change to generation, preview, or persistence behavior.

## Visual Direction

### Color

Use the existing `6:3:1` color logic with more restraint:

- Light surfaces for page background, panels, cards, and form controls
- Dark graphite for headings, body text, separators, and code surfaces
- Cobalt only for high-signal interaction states

System intent:
- primary action = cobalt
- current navigation state = cobalt tint + border
- selected skill state = cobalt-tinted surface
- code panel = dark, high contrast

### Typography

Keep the existing Geist font setup from `src/app/layout.tsx`.

Type rules:
- tighter heading tracking
- shorter line lengths
- compact uppercase labels only where they improve hierarchy
- supporting copy that reads like product UI, not landing-page copy

### Shape and Depth

- main app shell radius: `20-24px`
- inner cards/panels: `16-20px`
- controls: `10-14px`
- thin neutral borders carry most of the structure
- shadows stay soft and sparse

This should feel precise and technical, not soft or oversized.

## Shared Shell

### App Layout

`src/app/(app)/layout.tsx` becomes a calmer product frame:
- slimmer left rail
- quieter product identity block
- compact navigation
- roomy primary content canvas
- less visual weight than the current large rounded container

### Sidebar

`src/components/app-sidebar.tsx` should behave like a product rail, not a promo card:
- smaller icons
- tighter nav rows
- stronger active-state clarity
- less decorative copy

## Page Designs

### Workspace

`src/app/(app)/workspace/page.tsx` and `src/components/create-generation-form.tsx` become the primary operational surface:

- concise page header
- left column for component selection, quota/status, skill selection, and action
- right column for generated output
- preview panel first
- code panel second
- rationale treated as lower-priority supporting context

Skill selection rows should feel selectable and technical rather than like showcase cards.

### History List

`src/app/(app)/history/page.tsx` and `src/components/history-list.tsx` should become a cleaner saved-runs index:

- strong heading
- short supporting description
- clearer information hierarchy per item
- timestamp and component type visible quickly
- selected skills secondary but still scannable

Loading and empty states should match the same shell language as the rest of the app.

### History Detail

`src/app/(app)/history/[generationId]/page.tsx` should mirror the workspace mental model:

- metadata header with back action
- selected skills summary
- preview panel
- code panel
- rationale, if present, as supporting copy

The goal is to make reopening a saved run feel like returning to a previous workspace state.

## Shared Primitives

Refine the local UI primitives under `src/components/ui` so the product inherits the same style everywhere:

- `button`: more compact, stronger outline treatment, cleaner icon spacing
- `card`: lighter elevation, more structured spacing
- `badge`: quieter product labels instead of loud chips
- `input`: flatter, more technical control styling
- `separator`: subtle neutral divider treatment

If a small helper primitive is useful for consistency, it can be added, but the UI kit should remain minimal.

## Content Direction

Authenticated copy should shift toward concise product language:
- fewer marketing phrases
- more direct operational labels
- shorter descriptions
- emphasis on action and state clarity

## Behavior Boundaries

- Keep all current fetch flows intact.
- Keep current client/server responsibilities intact.
- Keep current quota and error handling intact.
- UI changes may adjust labels and hierarchy, but must not change contracts or business logic.

## Testing Strategy

Update the existing test suite to reflect the new authenticated UI contract:
- app shell navigation and framing
- workspace heading and action framing
- history index empty/list framing
- generation detail loading and saved-run framing

Verification remains:
- `npm run lint`
- `npm run test`
- `npm run build`

## Implementation Recommendation

Use a shared product-shell redesign with refined local primitives, then refactor the authenticated pages around those primitives.

This keeps the scope tight around service implementation and avoids unnecessary landing-page churn.
