# Preview-Only Loading Skeleton Design

## Summary

During generation loading, show only the preview skeleton and hide the code side entirely.

## Goals

- Keep the loading state focused on the preview silhouette only.
- Remove the code-side loading panel completely.
- Preserve the normal preview/code viewer after the request resolves.

## Design

- Keep the existing result card header.
- Render one loading body panel only: the component-type preview skeleton card.
- Keep the selected component type visible through the preview silhouette label.
- Do not render any code-side loading shell, editor frame, or placeholder.

## Testing

- Update pending-state tests to assert there is only one loading panel inside the status region.
- Keep assertions for the component-type silhouette.
