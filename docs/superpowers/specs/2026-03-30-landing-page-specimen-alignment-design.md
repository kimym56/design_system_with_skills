# Landing Page Specimen Alignment Design

## Summary

Polish the public landing page at `/` so the hero specimen reflects the real workspace UI more accurately, the evidence cards read more compactly, and radius usage aligns across shared UI surfaces.

This is not a new landing page concept. It is a targeted refinement pass on the existing homepage direction already in progress.

## Goals

- Shorten the three evidence card descriptions so they scan quickly.
- Replace the misleading right-side hero specimen with a composition derived from the actual workspace structure.
- Show the preview as the leading result surface in the hero specimen, with code secondary.
- Normalize radius usage at the shared-system level so homepage, workspace, and shared controls feel related.

## Non-Goals

- No new routes, content sections, or changes to auth behavior.
- No redesign of workspace information architecture or generation flow.
- No new interactive behavior on the landing page specimen.
- No broad visual rewrite of every app surface beyond the radius cleanup needed for consistency.

## Approved Direction

### 1. Evidence Cards

Keep the existing three-card structure but reduce each description to a tighter product-style line.

The intent is:
- retain the current labels
- keep the cards compact
- reduce copy density so the cards behave like proof points instead of mini paragraphs

### 2. Hero Specimen

The right-side specimen should use a hybrid layout based on the real workspace.

Structure:
- top input strip modeled on `Generation inputs`
- result area modeled on `Generated result`
- preview displayed first
- code shown as the secondary companion surface

The specimen should still be optimized for homepage composition rather than acting as a literal screenshot. The goal is “recognizably real,” not “pixel-for-pixel copy.”

### 3. Shared Radius System

Tighten the radius hierarchy so the system reads consistently.

Approved shape hierarchy:
- large outer panels and section shells use one shared large radius
- standard cards use one shared card radius
- inputs, segmented controls, and inner framed panels use one shared medium radius
- buttons and compact toggles use one shared compact radius

Implementation should favor shared primitives and tokens over one-off homepage values wherever practical.

## Affected Areas

- `src/app/page.tsx`
- `src/app/globals.css`
- shared UI primitives used by homepage/workspace such as `src/components/ui/card.tsx` and `src/components/ui/button.tsx`
- homepage test coverage in `tests/app/home-page.test.tsx`

## Responsiveness

- Preserve the existing single-column mobile flow.
- The hero specimen should stack cleanly and keep preview visually dominant on narrow screens.
- Copy tightening should reduce wrapping pressure rather than introduce new layout rules.

## Testing Strategy

Update homepage tests to reflect the refined copy where assertions depend on exact text.

Verification should cover:
- `npm run test -- tests/app/home-page.test.tsx`
- any targeted tests affected by shared primitive changes
- `npm run lint`

## Implementation Recommendation

Implement the polish in place, layering on top of the current staged homepage direction rather than replacing it. Shared radius cleanup should be limited to primitives and the homepage/workspace surfaces directly affected by this inconsistency.
