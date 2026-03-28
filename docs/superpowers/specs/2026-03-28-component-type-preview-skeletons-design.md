# Component-Type Preview Skeletons Design

## Summary

Replace the generic preview-side loading placeholder with a unique literal silhouette for each selected component type while keeping the code-side loading panel generic.

## Goals

- Make the in-flight preview area reflect the currently selected component type.
- Use literal silhouettes so each skeleton is immediately recognizable.
- Preserve the existing editorial loading card and code-side loading treatment.
- Keep the change local to the current generation form and result viewer.

## Non-Goals

- No backend or API changes.
- No changes to saved generation behavior.
- No component-type-specific code loading panel.
- No separate file per skeleton variant.

## Chosen Direction

Use the approved `A: Literal Component Silhouettes` direction.

Each selected component type gets its own preview-only loading silhouette:

- `Button`: centered CTA pills or stacked action buttons
- `Input`: label and single-line text field
- `Textarea`: label and multi-line field
- `Select`: label, field shell, and chevron affordance
- `Checkbox`: stacked checkbox rows
- `Radio`: stacked radio option rows
- `Switch`: preference rows with toggle pills
- `Card`: title, body, and action card shell
- `Modal`: centered dialog surface with header/body/footer
- `Tabs`: tab strip with an active panel
- `Accordion`: stacked collapsible rows
- `Navbar`: brand, navigation links, and right-side action

## Architecture

- `src/components/create-generation-form.tsx`
  - Pass the selected `componentType` into the loading result viewer.
- `src/components/generation-result-viewer.tsx`
  - Accept the selected component type as a prop.
  - Keep the current loading shell and generic code skeleton.
  - Replace the generic preview loading block with a component-type-specific renderer.

This keeps the data flow simple: the form already owns the selected component type, so it should pass that value directly into the loading viewer.

## Testing Strategy

- Extend `tests/components/create-generation-form.test.tsx` so a pending request reflects the selected component type in the loading state.
- Extend `tests/components/generation-result-viewer.test.tsx` so the loading viewer renders distinct preview skeleton variants for at least representative component types.
- Keep existing viewer interaction tests green.
