# Editorial Shadcn UI Redesign Design

## Summary

Redesign the full current app surface into a simple editorial UI that follows a `60/30/10` balance:
- `60% white` for background and primary surfaces
- `30% black` for typography, borders, and code surfaces
- `10% cobalt blue` for action, selection, and focus states

The redesign applies to all current routed pages:
- `/`
- `/workspace`
- `/history`
- `/history/[generationId]`

The implementation must use Tailwind and local `shadcn/ui`-style primitives, while keeping the existing auth, API, generation, history, and quota behavior intact.

## Goals

- Replace the current dark block-based UI with an airy editorial system.
- Introduce a small reusable UI foundation under `src/components/ui`.
- Make landing, workspace, and history feel like one product instead of separate visual systems.
- Keep the app simple and high-contrast with minimal decorative treatment.
- Preserve existing product logic and route structure.

## Non-Goals

- No backend or API contract changes.
- No generation-flow logic changes.
- No new product features.
- No payment or billing work.
- No redesign of routes that do not currently exist in the app.

## Visual System

### Color

Use the `60/30/10` rule as a system guideline, not as literal CSS percentages.

- White layer:
  - page background
  - cards
  - form surfaces
  - preview surfaces
- Black layer:
  - headings
  - body text
  - borders
  - code panel
  - separators
- Cobalt layer:
  - primary buttons
  - active navigation state
  - selected skill state
  - quota/status accents
  - focus rings and links

Proposed palette:
- Background: `#FFFFFF`
- Surface: `#FAFAFA`
- Border: `#D4D4D8`
- Foreground: `#09090B`
- Muted text: `#52525B`
- Accent: `#1D4ED8`
- Accent soft: `#EFF6FF`
- Code surface: `#09090B`

### Typography

Retain the current Geist font setup already defined in `src/app/layout.tsx`. It is neutral enough for an editorial feel and avoids adding another font-loading dependency during the UI pass.

Typography rules:
- larger headings with tighter tracking
- short paragraphs and restrained copy width
- uppercase micro-labels for section framing
- heavier visual hierarchy from type and spacing, not from gradients or shadows

### Shape and Depth

- rounded corners remain, but smaller and more consistent than the current oversized dark cards
- thin black or neutral borders carry structure
- shadows, if used, should be soft and sparse
- cobalt should create emphasis instead of glow

## Shared Shell

### Root App

`src/app/globals.css` becomes the single source of truth for the editorial theme tokens and shadcn-compatible CSS variables.

### Authenticated App Shell

`src/app/(app)/layout.tsx` and `src/components/app-sidebar.tsx` will be redesigned into a bright tool shell:
- white outer background
- light sidebar or rail
- black dividers and labels
- cobalt current-state treatment
- large content canvas with less visual weight than the current dark panel

The shell should feel structured and calm, not like a dark developer console.

## Page Designs

### Landing Page

`src/app/page.tsx` will use the approved `A: Editorial Frame` direction:
- large editorial hero
- one primary Google sign-in CTA
- a short trust strip
- a concise “how it works” section
- restrained product mockup

It should stay mostly white, with one dark code area and cobalt only on actions, small badges, and selected states.

### Workspace

`src/app/(app)/workspace/page.tsx` and `src/components/create-generation-form.tsx` become a clean two-column builder:
- left column for component selection, skill selection, quota, and action
- right column for preview and code

The workspace must feel more like a guided editorial tool than a dashboard. The form should use shared primitives and consistent spacing.

### History List

`src/app/(app)/history/page.tsx` and `src/components/history-list.tsx` will move to a clean card/list layout:
- strong heading
- simple empty state
- reopenable cards with component type, skills, and timestamp

### History Detail

`src/app/(app)/history/[generationId]/page.tsx` will align with the workspace layout:
- editorial header
- rationale copy
- light preview surface and dark code surface

## Component System

Add a minimal local UI kit under `src/components/ui` using shadcn conventions:
- `button`
- `card`
- `badge`
- `input`
- `separator`
- utility support via `src/lib/utils.ts`

If the implementation benefits from one or two extra primitives such as `checkbox` or `textarea`, they may be added, but the UI kit should stay minimal.

The goal is not to flood the repo with components. The goal is to standardize the surfaces the current pages already need.

## Behavior Boundaries

- Keep all API routes and business logic unchanged.
- Keep current fetch flows intact.
- Keep current auth behavior intact.
- Keep current quota and generation handling intact.
- UI changes may improve labels, hierarchy, and structure, but must not change server contracts.

## Testing Strategy

Update and extend the existing app tests so they validate the new UI contract:
- landing page headline and primary CTA
- authenticated layout navigation labels
- workspace heading and supporting copy
- history page empty state or list framing
- generation detail page loading and heading behavior, if useful

Continue running:
- `npx vitest run`
- `npm run lint`
- `npm run build`

## Implementation Recommendation

Use the approved approach:

`Introduce core shadcn primitives and refactor pages around them`

This keeps the scope focused on design consistency and shared UI structure without rewriting existing logic.
