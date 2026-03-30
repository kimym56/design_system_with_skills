# DSSkills Product Frame Landing Page Design

## Summary

Redesign the public landing page at `/` so it reads more like Anthropic's restrained split layout while staying explicitly product-oriented.

The approved direction is:

- sticky header with a scroll-responsive brand label
- top-right `Try DSSkills` CTA that is auth-aware
- sparse left-column hero copy
- polished right-column workspace specimen
- three explanatory cards below the hero
- footer with copyright plus four external profile icons

The selected visual direction is the `Product Frame` variant: calmer than the current homepage, but with stronger product borders and clearer software-surface framing than the more editorial option.

## Goals

- Replace the current card-heavy marketing composition with a simpler split hero and calmer reading rhythm.
- Keep the homepage aligned with the real workspace language so the specimen feels credible.
- Make the signed-out CTA flow more guided by scrolling and moving keyboard focus to the main Google sign-in button.
- Keep the signed-in flow direct by sending `Try DSSkills` to `/workspace`.
- Add a footer that exposes email, GitHub, LinkedIn, and website links.

## Non-Goals

- No changes to authenticated workspace or history route behavior.
- No embedded live workspace, API calls, or fake landing-page-only app state.
- No change to sign-in provider, auth routing, or generation logic.
- No broad retheme of the full application shell.

## Layout

### 1. Sticky Header

The header stays pinned to the top of the viewport.

Initial state:

- left brand label: `Design System Skills`
- right CTA: `Try DSSkills`

Scrolled state:

- left brand label compresses to `DSSkills`
- header becomes slightly tighter and more application-like

If the user is signed in, the CTA links directly to `/workspace`.

If the user is signed out, the CTA does not navigate. Instead it:

- scrolls the main hero CTA into view
- moves keyboard focus to the Google sign-in button
- applies a short highlight treatment so the target is obvious

### 2. Hero

Desktop hero layout:

- left: title, subtitle, and primary CTA
- right: workspace specimen

Mobile layout:

- header
- hero copy
- hero specimen

The left side should remain intentionally sparse. Signed-out users see the Google sign-in button. Signed-in users see a workspace-entry CTA in the same position so the layout remains stable.

### 3. Workspace Specimen

The specimen is static and should borrow directly from the real workspace language already used in the app:

- generation inputs
- approved skills
- preview
- generated code

It should not behave like a live app embed. Controls can look real, but they are presentational only.

Compared with the previous homepage specimen, this version should:

- feel more explicit as product UI
- use stronger borders and panel grouping
- keep the overall tone warm and restrained

### 4. Product Cards

The section under the hero contains exactly three cards:

- `Generation workspace`
- `Saved runs history`
- `Custom (TBD)`

These cards explain the current product surfaces and future extension area. They are static content blocks and should not introduce new interactions.

### 5. Footer

The footer includes:

- `© 2026 YongMin Kim. All rights reserved.`
- icon buttons for:
  - `mailto:kimym.svb@gmail.com`
  - `https://github.com/kimym56/`
  - `https://linkedin.com/in/kimym56`
  - `https://ymkim-portfolio.vercel.app`

All icon buttons must include accessible labels and open their destinations through standard links.

## Interaction Model

The homepage stays mostly server-rendered. Session lookup remains in `src/app/page.tsx`, which passes only the minimum signed-in information needed by a small client interaction layer.

That client layer owns:

- scroll detection for the brand swap
- signed-out `Try DSSkills` behavior
- temporary hero-CTA highlight state

The Google sign-in control should expose a focus target so the signed-out top-right CTA can drive focus accessibly rather than faking a click.

## Visual Direction

- warm, light page background
- restrained typography and spacing
- crisp workspace surfaces on the right
- stronger panel framing than the current homepage
- limited motion: brand swap, smooth scroll, CTA highlight pulse

The page should feel closer to a calm software landing page than a marketing collage.

## Testing Strategy

Homepage coverage should verify:

- signed-out users see the approved split-hero content and only one main Google sign-in action
- signed-out `Try DSSkills` exists and the old marketing copy is gone
- signed-in users get a direct workspace CTA path
- the three product cards render with the approved labels
- the footer icon links render with the approved destinations

Component-level coverage should verify the signed-out CTA orchestration:

- clicking `Try DSSkills` scrolls to the hero CTA target
- keyboard focus moves onto the main Google button
- highlight state is applied

Verification should include:

- `npx vitest run tests/app/home-page.test.tsx tests/components/landing-page-shell.test.tsx`
- `npm run lint`
