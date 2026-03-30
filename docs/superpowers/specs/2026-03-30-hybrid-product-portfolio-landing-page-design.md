# Hybrid Product Portfolio Landing Page Design

## Summary

Redesign the public landing page at `/` so it feels like the public front door to the same product system as `/workspace` and `/history`, while still reading as a design engineer portfolio rather than a generic SaaS homepage.

The approved direction is a hybrid product portfolio:
- public homepage structure
- product-system visual language
- portfolio-oriented messaging
- one strong live workspace specimen that demonstrates shipped interface thinking

## Goals

- Align `/` with the workspace and history pages through the same spacing rhythm, border treatment, panel density, and restrained light-surface palette.
- Reframe the homepage copy around a design engineer portfolio identity instead of a marketing promise for a component generator.
- Use real product-like composition as the proof surface so visitors immediately understand the combination of design taste and implementation skill.
- Preserve the existing auth-aware header behavior and the existing `/workspace` CTA destination.

## Non-Goals

- No redesign of the authenticated app shell itself.
- No new routes, portfolio CMS, case-study system, or content model.
- No changes to auth, generation, history, API contracts, or persistence.
- No animation-heavy hero treatment or decorative editorial redesign that breaks visual continuity with the existing app.

## Visual Direction

### Core Direction

The landing page should feel like a public product surface with editorial restraint:
- approximately `80%` product-system precision
- approximately `20%` authored portfolio expression

It should not feel like:
- a generic startup marketing page
- an internal dashboard shell
- a magazine-style editorial spread

### Typography

Keep typography restrained and technical.

Preferred direction:
- preserve the existing app font stack for continuity
- optionally reserve a more distinctive grotesk headline treatment only if it can be introduced without fragmenting the rest of the UI

Typography rules:
- tight headline tracking
- shorter line lengths
- concise uppercase labels only where hierarchy benefits
- supporting copy that reads like product UI, not launch copy

### Color and Surfaces

Stay inside the current light-mode system:
- light neutral page background
- white and muted cards for structure
- dark text and code surfaces for contrast
- cobalt reserved for actions, focus, and selected emphasis

Avoid adding a new brand palette for the homepage. The visual continuity with `/workspace` and `/history` is more important than inventing a separate marketing identity.

### Shape and Depth

Use the same rounded, thin-border panel language already established in the app:
- outer hero and section panels: `20-28px`
- inner cards and lists: `16-20px`
- controls and chips: compact rounded shapes
- shadows remain soft and sparse

## Page Structure

The landing page should be reorganized into four public sections.

### 1. Compact Header

Keep the existing compact rounded header pattern from the current homepage, including auth-aware behavior:
- signed-out users see the Google sign-in button
- signed-in users see the account menu

Content direction changes:
- identity reads as a design engineer portfolio or product-system portfolio
- title language is more authored and less promotional

### 2. Product-First Hero

The hero becomes the primary statement of intent.

Left side:
- portfolio-first headline
- brief supporting copy about designing and shipping product systems
- primary CTA to `/workspace`
- secondary supporting action or account entry depending on auth state
- small evidence cards that read like proof of shipped practice rather than trust badges

Right side:
- a large live workspace specimen panel
- composition should visibly borrow from the workspace/history surfaces
- include input, generated code, and preview-like framing
- static composition only; no fake interactivity requirement

This panel is the key change from the current page. It should be the strongest visual proof on the screen.

### 3. Evidence Band

Replace the current generic workflow/trust section with denser portfolio evidence.

Approved direction:
- small cards or compact panels that communicate shipped surfaces, system thinking, and code-to-UI workflow
- content should be scannable and direct
- the section should feel operational, not testimonial-driven

Avoid:
- generic trust badges
- heavy social proof sections
- soft “feature marketing” language

### 4. Selected Work and Principles

Replace the current explainer section with two product-like blocks:

`Selected work`
- a short list of focused project or case-study entries
- concise labels, context, and outcomes
- structured like app panels, not like blog cards

`Operating principles`
- short statements about design engineering approach
- dense and practical
- framed with the same border/radius language as the app

### 5. Closing CTA

Keep a final CTA section, but rewrite it as entry into a working environment:
- less “start building now”
- more “enter the workspace” or “open the working surface”

## Content Direction

Homepage copy should present the owner as a design engineer who works through product surfaces.

Tone rules:
- concise
- precise
- product-literate
- no inflated marketing language
- no generic startup urgency

The page should communicate:
- portfolio identity
- system thinking
- interface implementation fluency
- continuity between public positioning and the actual product workspace

## Behavior and Responsiveness

- Keep the page mostly static and server-rendered.
- Preserve the existing auth-aware header and CTA behavior.
- Do not introduce new homepage state machines.
- On mobile, stack into a single column in this order:
  1. header
  2. hero copy
  3. workspace specimen
  4. evidence cards
  5. selected work
  6. principles
  7. closing CTA
- The specimen panel must collapse naturally into a stacked composition, not a tiny fake dashboard screenshot.

## Accessibility and Motion

- Maintain strong light-mode contrast.
- Keep focus-visible states obvious.
- Do not rely on hover for critical actions.
- Limit motion to subtle border, color, or shadow transitions.
- Respect `prefers-reduced-motion` for any nonessential transition.

## Testing Strategy

Update the existing homepage test contract to reflect the new landing page language and hierarchy:
- signed-out state still shows explicit Google sign-in buttons
- signed-in state still shows account menu instead of sign-in buttons
- hero heading reflects the new portfolio-first message
- main `/workspace` CTA remains present
- new section labels or evidence content replace the old marketing copy assertions

Verification should continue to cover:
- `npm run lint`
- `npm run test`
- `npm run build`

## Implementation Recommendation

Implement the redesign inside the existing `src/app/page.tsx` route using the current local UI primitives (`Button`, `Card`, `Badge`, `Separator`, `AccountMenu`, `GoogleSignInButton`) instead of inventing a separate homepage component system.

This keeps the public page visibly connected to the workspace/history experience, limits scope to content hierarchy and composition, and avoids unnecessary churn outside the landing page surface.
