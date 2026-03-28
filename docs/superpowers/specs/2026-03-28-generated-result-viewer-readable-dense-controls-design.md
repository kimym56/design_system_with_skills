# Generated Result Viewer Readable Dense Controls Design

**Date:** 2026-03-28

**Goal:** Make the generated result viewer's `Preview`, `Code`, and enlarge controls clearly denser than the current compact pass while keeping the labels readable and the interaction unchanged.

## Product Behavior

- `Preview` and `Code` remain full-text segmented buttons.
- The enlarge button remains icon-only and continues opening the active mode in the dialog.
- No toggle, dialog, preview, or code-panel behavior changes.

## Layout Intent

- The first compact-control pass still reads visually large in the viewer header.
- This refinement should reduce both font size and button chrome so the row feels lighter and denser.
- The controls should remain readable at a glance rather than collapsing into a tiny utility style.

## Architecture

Keep the change local to `src/components/generation-result-viewer.tsx`. This is a presentation-only refinement, so there is no need for new shared button sizes or broader component API changes.

## Accessibility And Usability

- Keep real `button` elements and pressed-state semantics.
- Preserve the accessible label on the enlarge control.
- Maintain visible focus styles and practical tap targets for the header controls.

## Testing Strategy

- Update `tests/components/generation-result-viewer.test.tsx` to assert the smaller text size and denser control classes.
- Re-run the existing viewer interaction coverage to confirm the control-size changes do not affect behavior.

## Scope Limits

- No icon-only preview/code tabs
- No text label renaming
- No dialog layout changes
- No shared UI primitive refactor
