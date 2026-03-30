# Generated Result Split View Dialog Design

## Goal

Let users inspect the generated preview and generated code at the same time from the real result viewer without changing the existing inline single-panel workflow.

## Current State

- `GenerationResultViewer` defaults to an inline `Preview` mode and can switch to `Code`.
- The existing maximize control opens a large dialog for the currently active inline mode only.
- There is no way to compare preview and code simultaneously in the real viewer.

## Decision

Add a dedicated `See both` toolbar button to the real generated result viewer. The button opens a separate large dialog with a split layout: preview on the left and code on the right.

This preserves the current inline `Preview` / `Code` toggle semantics while adding a clearly discoverable comparison workflow for users who want both surfaces together.

## Behavior

### Inline viewer

- Keep `Preview` and `Code` as the only inline toggle states.
- Keep the current maximize button behavior unchanged: it opens a large single-surface dialog for the active inline mode.

### Split view dialog

- Add a persistent `See both` button in the viewer toolbar next to the existing maximize button.
- Clicking `See both` opens a separate modal dialog.
- The dialog renders the preview frame and code panel side by side in a large two-column layout.
- The dialog does not depend on the current inline toggle state; it always shows both surfaces together.
- The dialog closes via the existing overlay click and close button behavior.

## Files Affected

- `src/components/generation-result-viewer.tsx`
- `tests/components/generation-result-viewer.test.tsx`

## Risks

- Adding a second dialog path can create duplicated modal logic if rendering is not shared carefully.
- The split dialog needs accessible naming that clearly distinguishes it from the existing large preview and large code dialogs.
- Tests need to verify both surfaces are present at the same time so the new workflow does not regress into another single-panel dialog.

## Success Criteria

- Users can open a dedicated split-view dialog from the real generated result viewer.
- The split-view dialog shows preview and code simultaneously.
- Existing inline toggle behavior and existing large single-surface dialogs continue to work.
- Focused viewer tests pass.
