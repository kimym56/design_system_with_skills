# Generation Loading Placeholder Design

## Summary

Add an explicit in-flight loading treatment to the workspace generation flow so users see a visible placeholder panel while a component run is being generated.

## Goals

- Make it obvious that a generation request is actively running.
- Replace the static empty result state with a temporary loading surface during submission.
- Keep the UI aligned with the existing editorial workspace design.
- Preserve the current API contract and generation logic.

## Non-Goals

- No backend or API changes.
- No changes to generation payload structure.
- No full-page blocking overlay.
- No animation-heavy redesign of the workspace.

## UX Direction

Use a visible placeholder panel in the result area while the request is in flight.

- Keep the form visible so users retain context.
- Disable the submit button and supporting controls during the request.
- Replace the result area with a dedicated loading state instead of leaving stale or empty content in place.
- Use editorial loading copy such as "Generating component run" with short supporting text.
- Include lightweight skeleton blocks that imply both preview and code surfaces.

## Component Boundaries

- `src/components/create-generation-form.tsx`
  - Tracks whether a request is currently running.
  - Clears the previous generation before starting a new request.
  - Passes loading state into the result viewer.
- `src/components/generation-result-viewer.tsx`
  - Accepts an `isLoading` prop.
  - Renders a loading placeholder card when `isLoading` is true.
  - Keeps existing preview/code behavior unchanged when a generation is available.

## Error Handling

- If generation fails, hide the loading placeholder and show the existing error message.
- If generation succeeds, replace the placeholder with the returned result and rationale.

## Testing Strategy

- Extend the component test for `CreateGenerationForm` to verify that a loading placeholder appears after submit and before the mocked response resolves.
- Verify the placeholder copy and/or status indicator is visible while the request is pending.
