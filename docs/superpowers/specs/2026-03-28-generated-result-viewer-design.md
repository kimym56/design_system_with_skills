# Generated Result Viewer Design

**Date:** 2026-03-28

**Goal:** Replace the cramped side-by-side preview/code layout with a shared viewer that defaults to preview, lets users toggle between preview and code, and opens the active view in a larger dialog on both the workspace and history detail pages.

## Product Behavior

### Shared interaction model

- The workspace page and history detail page should use the same result-viewer interaction.
- The viewer should default to `Preview` whenever a result first appears.
- Users should be able to switch between `Preview` and `Code` with a compact two-state toggle in the viewer header.
- The viewer header should include an icon-only enlarge action rather than a text button.

### Large view behavior

- The enlarge action should open the currently active mode in a dialog.
- If the active mode is `Preview`, the dialog should show an enlarged preview.
- If the active mode is `Code`, the dialog should show an enlarged code panel.
- Closing the dialog should return the user to the same active mode in the inline viewer.

### Explicitly preserved

- Existing empty states should remain visible before a generation loads.
- Existing rationale content should remain outside the viewer and continue to render when present.
- Preview rendering should stay inside the isolated iframe runtime.
- Code rendering should continue to show the exact generated source without transformation.

## Layout Intent

- The current side-by-side layout makes small preview content look oversized and leaves the code panel too narrow.
- The new viewer should give the active mode the full card width instead of splitting width between preview and code.
- The inline preview height should be reduced from the current oversized presentation so small components, such as a button, do not immediately create a scroll-heavy experience.
- The enlarged dialog should provide a much larger viewport for either mode without changing the underlying generation data.

## Architecture

Introduce a reusable client component for the result viewer that owns the mode toggle and dialog state. Both the workspace page and history detail page should pass the same preview HTML and generated code into this shared viewer instead of duplicating layout logic in each page.

Keep `GenerationPreviewFrame` and `GenerationCodePanel` as focused rendering primitives, but allow them to support both inline and enlarged presentation through simple size variants or equivalent props. The viewer component should decide which renderer is visible and whether it is being shown inline or in the dialog.

## Component Boundaries

### Shared result viewer

This unit should be responsible for:

- active mode state
- defaulting to `Preview`
- toggle controls
- icon-only enlarge control
- dialog open and close state
- passing size mode to preview and code renderers

This unit should not be responsible for:

- sanitizing preview markup
- generating preview documents
- formatting or transforming code content

### Preview frame

`GenerationPreviewFrame` should remain responsible for:

- rendering the isolated iframe
- empty preview state
- applying inline versus enlarged height rules

### Code panel

`GenerationCodePanel` should remain responsible for:

- rendering the code block
- empty code state
- applying inline versus enlarged height rules

## Accessibility And Usability

- The preview/code toggle should use real buttons with clear pressed-state semantics.
- The icon-only enlarge control must have an accessible name.
- The dialog should expose a clear close action and support keyboard dismissal.
- The inline viewer should remain usable on narrow screens and wide screens without switching to a different interaction pattern.

## Testing Strategy

The implementation should cover:

- defaulting the shared viewer to `Preview`
- switching from `Preview` to `Code`
- opening the enlarged dialog for the active mode
- rendering the shared viewer on both the workspace page and the history detail page
- preserving empty-state behavior when preview HTML or code is absent

## Scope Limits

- No resizable split panes
- No desktop-only side-by-side fallback
- No syntax-highlighting refactor
- No changes to generation payload shape or API contracts
