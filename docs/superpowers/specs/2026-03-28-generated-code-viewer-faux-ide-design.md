# Generated Code Viewer Faux IDE Design

**Date:** 2026-03-28

**Goal:** Upgrade the generated code panel from a plain dark code block into a read-only faux IDE viewer that feels like a real editor while preserving the exact generated source, the existing preview/code toggle, and the current result-viewer dialog flow.

## Product Scope

### Included

- Keep the existing shared result-viewer interaction model on the workspace and history detail pages.
- Replace the plain code block with a read-only editor-style surface.
- Add an editor header with a file tab, language badge, and copy action.
- Add a status row and line-number gutter.
- Add lightweight TSX-oriented syntax coloring that improves readability without introducing an editor dependency.
- Use the same code viewer in both inline and dialog modes, with height as the primary size difference.
- Preserve the empty state inside the same editor shell.

### Explicitly Excluded

- Monaco or any other full editor dependency in this pass
- Code editing, search, folding, minimap, or command palette behavior
- Changes to generation payloads, API routes, or persisted generation data
- Arbitrary multi-language highlighting beyond the generated TypeScript/TSX target

## Product Behavior

### Shared viewer behavior

- The workspace page and history detail page should keep using the same `GenerationResultViewer` shell.
- The `Code` tab should continue to render the exact generated source for the saved run or current generation.
- Inline and dialog code views should render the same component and differ only in layout height and available space.

### Faux IDE treatment

- The code viewer should visually read as a technical, read-only editor rather than a styled `<pre>` block.
- The top chrome should include:
  - an editor-style tab with a stable fallback file label such as `generated-component.tsx`
  - a small `TSX` language badge
  - a copy action
- A secondary status row should communicate that the viewer is read-only and generated.
- The body should include:
  - a line-number gutter
  - a scrollable code region
  - syntax-colored text tuned for generated TSX

### Copy interaction

- The copy action should copy the full, exact source string rather than a transformed or prettified version.
- A short-lived success state such as `Copied` is acceptable.
- Clipboard failure should not block the viewer from rendering or selecting text.

### Empty state

- When no code is available yet, the user should still see the faux IDE frame rather than dropping back to a generic placeholder box.
- The empty state should explain that generated component code appears after a successful run.

## Architecture

Introduce a dedicated read-only code viewer component beneath the existing result-viewer shell. `GenerationResultViewer` should continue to own the preview/code toggle and dialog state. `GenerationCodePanel` should become a thin adapter that passes the generated source and size mode into the dedicated viewer component.

This keeps the current page-level integration stable while creating a clean future swap point if a real editor such as Monaco is introduced later. The rest of the app should treat the code viewer as a rendering primitive, not as an interactive editor surface.

## Component Boundaries

### `GenerationResultViewer`

Responsible for:

- preview/code mode switching
- dialog open and close state
- choosing inline versus dialog size

Not responsible for:

- code highlighting logic
- line-number generation
- clipboard implementation details

### `GenerationCodePanel`

Responsible for:

- adapting generation data into the code viewer API
- preserving existing empty and size-based entry points for callers

Not responsible for:

- owning the full faux IDE layout
- page-level toggle or dialog behavior

### Dedicated read-only code viewer

Responsible for:

- editor chrome
- line-number gutter
- code rendering
- copy interaction
- placeholder rendering inside the same frame

## Highlighting Strategy

- Keep highlighting lightweight and local rather than introducing a runtime-heavy dependency.
- Optimize for the generated target: TypeScript function syntax, JSX tags, attributes, strings, and punctuation.
- If a token cannot be classified confidently, render it as plain code text instead of risking broken markup.
- Preserve the original source order and content in the rendered output.

## Accessibility And Usability

- The copy action must be a real button with an accessible name.
- The file label and language badge should remain readable at narrow widths without breaking the header layout.
- The code region must support keyboard scrolling and text selection.
- The line-number gutter should be ignored by screen readers if it does not add semantic value.

## Error Handling

- Clipboard errors should fail quietly and leave the viewer usable.
- Unexpected highlighting fallbacks should degrade to unstyled text instead of throwing.
- Very long generated lines should remain readable through horizontal scrolling rather than forced wrapping by default.

## Testing Strategy

The implementation should cover:

- rendering the faux IDE shell in code mode
- preserving exact code text
- showing line numbers for visible lines
- rendering the fallback file label and language badge
- copying the full source string
- preserving the shared result-viewer preview/code toggle and dialog behavior
- preserving the empty state inside the viewer shell

## Relationship To Existing Viewer Work

This design builds on the existing `Generated Result Viewer` work rather than replacing it. The preview-first shared viewer remains the outer interaction model. This pass only upgrades the code rendering surface inside that viewer so the result feels more like a real code viewer.
