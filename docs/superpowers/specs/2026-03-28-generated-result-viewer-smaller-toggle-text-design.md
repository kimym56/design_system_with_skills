# Generated Result Viewer Smaller Toggle Text Design

**Date:** 2026-03-28

**Goal:** Reduce only the `Preview` and `Code` toggle label size in the generated result viewer while preserving the current dense button geometry and interaction behavior.

## Product Behavior

- `Preview` and `Code` remain full-text toggle labels.
- The toggle buttons keep the current padding, radii, and pressed-state behavior.
- The enlarge button and dialog behavior remain unchanged.

## Layout Intent

- The current toggle font still reads too large relative to the desired header density.
- This refinement should make the labels feel lighter without shrinking the click target or button chrome.

## Architecture

Keep the change local to `src/components/generation-result-viewer.tsx`. This is a typography-only refinement, so no new component props or shared UI variants are needed.

## Accessibility And Usability

- Keep the existing real `button` elements and `aria-pressed` semantics.
- Preserve readability of the active and inactive labels.
- Avoid changing hit area sizing so the toggle remains easy to use.

## Testing Strategy

- Update `tests/components/generation-result-viewer.test.tsx` to assert a smaller text class for the toggle labels.
- Keep the existing assertions for current dense geometry and enlarge button sizing.

## Scope Limits

- No padding changes
- No radius changes
- No enlarge button changes
- No label text changes
