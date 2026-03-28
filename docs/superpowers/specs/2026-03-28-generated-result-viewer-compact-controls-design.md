# Generated Result Viewer Compact Controls Design

**Date:** 2026-03-28

**Goal:** Reduce the visual footprint of the generated result viewer's `Preview`, `Code`, and enlarge controls without changing behavior, layout structure, or accessibility semantics.

## Product Behavior

- The `Preview` and `Code` segmented controls should remain in the same place and keep the same pressed-state behavior.
- The enlarge control should remain icon-only and continue opening the active mode in the dialog.
- No copy, dialog, preview, or code-rendering behavior should change.

## Layout Intent

- The header controls currently read slightly oversized relative to the surrounding viewer chrome.
- The refinement should tighten the control row by reducing tab padding, text sizing, and icon-button dimensions.
- The change should preserve tap targets that remain practical on desktop and mobile widths.

## Architecture

Keep the change local to `src/components/generation-result-viewer.tsx`. The control sizing is presentation-only, so it should not introduce new shared button variants or new component props unless later reuse makes that necessary.

## Accessibility And Usability

- Keep real `button` elements for the segmented control.
- Preserve `aria-pressed`, `aria-label`, and dialog behavior.
- Do not reduce contrast or remove focus-visible affordances.

## Testing Strategy

- Extend the existing `tests/components/generation-result-viewer.test.tsx` coverage with assertions that the two tab buttons and enlarge button use the new compact sizing classes.
- Verify that the existing interaction tests still pass after the style change.

## Scope Limits

- No new shared button sizes
- No text-label change for the enlarge action
- No dialog layout change
- No result-viewer structural refactor
