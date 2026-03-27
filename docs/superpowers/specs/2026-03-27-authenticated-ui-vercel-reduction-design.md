# Authenticated UI Vercel Reduction Design

## Summary

Refine the authenticated product UI so it reads much closer to Vercel's product console language:
- fewer badges
- fewer standalone cards
- flatter surfaces
- denser navigation
- mostly monochrome structure with cobalt reserved for primary action and active state

This redesign applies only to:
- `/workspace`
- `/history`
- `/history/[generationId]`
- the authenticated shell and shared primitives those routes use

The public landing page remains out of scope.

## Goals

- Reduce decorative chrome from the authenticated UI.
- Make the shell feel more like a product console and less like a promo layout.
- Flatten the workspace into a clearer tool canvas.
- Turn history into a denser saved-run surface.
- Keep current behavior, APIs, auth, and fetch flows unchanged.

## Non-Goals

- No landing-page redesign.
- No new routes or features.
- No backend or auth changes.
- No generation-flow contract changes.

## Visual Direction

- background: near-white
- content surfaces: plain white
- borders: light gray and structural
- code surface: near-black
- cobalt: primary button, active nav, focus ring, minimal selection emphasis

Rules:
- remove most badges
- remove promo-style callout panels
- reduce shadows to almost nothing
- reduce radius to roughly `10-16px`
- use small labels only where they carry product meaning

## Shell

- slimmer left rail
- product name, one primary action, compact nav rows
- no bottom marketing/support card
- no tinted rail sections unless required for active state clarity

## Workspace

- remove the top summary cards
- keep one page heading and one short supporting sentence
- left side becomes one compact form surface
- right side becomes preview and code panes with minimal headers
- rationale becomes supporting text below code rather than a featured panel

## History

- switch from showcase-style cards to flatter rows or restrained cards
- component name and timestamp lead
- selected skills remain visible but lower priority
- hover behavior should be subtle

## Detail View

- simple top bar with title and back action
- compact metadata block
- preview and code use the same pane language as workspace
- rationale is supporting text, not hero content

## Testing

Update app tests only where needed to lock in the reduction:
- shell remains navigable without promo chrome
- workspace no longer renders the extra summary cards
- detail page still renders saved run summary

Verification remains:
- `npm run test`
- `npm run lint`
- `npm run build`
