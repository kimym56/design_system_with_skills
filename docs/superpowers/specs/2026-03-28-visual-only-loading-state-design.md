# Visual-Only Loading State Design

## Summary

Remove the textual loading intro block from the generation loading state so the pending UI is driven only by the preview skeleton and generic code skeleton.

## Goals

- Remove the `Running` label and explanatory loading copy.
- Keep the component-type-specific preview skeletons.
- Keep the code-side loading shell generic.
- Preserve the current result card framing.

## Design

- Keep the `Generated result` card header.
- Remove the left-side loading summary block from the loading body.
- Let the loading body consist only of:
  - the preview skeleton card
  - the generic code skeleton card
- Keep the selected component type visible only through the preview silhouette label and shape.

## Testing

- Update loading-state tests so they assert the component-type silhouette remains visible.
- Remove assertions for the deleted loading copy.
