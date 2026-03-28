# Component Type Select Alignment Design

**Date:** 2026-03-28

**Goal:** Make the `Component type` field use the same custom dropdown treatment as `Approved skills` while keeping component type selection single-choice.

## Context

The generation form currently mixes two different selection patterns:

- `Component type` uses a native `<select>`.
- `Approved skills` uses a custom trigger and popup list.

That mismatch makes the form feel inconsistent even though both controls sit side by side and are part of the same input group.

## Decision

Replace the native `Component type` control with a custom single-select dropdown that visually matches the existing skills selector.

The new control should:

- Use the same trigger shell, spacing, border radius, chevron, popup surface, and selected-state affordances as the skills selector.
- Stay single-select only.
- Close immediately after a selection is made.
- Show the selected component type in the trigger.
- Show each component type with a short summary inside the dropdown so the field feels consistent with the richer skills list presentation.

## Architecture

### UI structure

- Keep `CreateGenerationForm` responsible for form state and submission.
- Introduce a dedicated `ComponentTypeSelect` client component for the single-select dropdown behavior.
- Keep `SkillMultiSelect` in place for the skills field.

This avoids an unnecessary generic select abstraction for now while still aligning the two controls visually.

### Data flow

- `CreateGenerationForm` continues to own `componentType` state.
- `ComponentTypeSelect` receives:
  - the currently selected component type
  - an `onSelect` callback
  - the optional label id for accessible naming
- Selecting an option updates form state and closes the dropdown.
- No backend or API contract changes are required.

## Behavior

### Trigger

- The trigger uses the same custom dropdown styling family as `SkillMultiSelect`.
- The selected component type name is shown as the trigger value.
- The trigger indicates open and closed state with the chevron rotation.

### Dropdown content

- Each option shows:
  - the component type name
  - the corresponding summary from `COMPONENT_TYPE_SUMMARIES`
- The active option shows the same checkmark treatment used in the skills dropdown.
- Clicking outside the control closes the menu.
- Pressing `Escape` closes the menu.

### Selection rules

- Only one component type may be selected at a time.
- Selecting a new option replaces the current one.
- Selecting an option closes the menu immediately.

## Accessibility

- Preserve an explicit label relationship through `aria-labelledby`.
- Keep the trigger keyboard-focusable.
- Expose expanded state on the trigger.
- Keep the popup semantics consistent with the current custom dropdown approach used by the skills selector.

## Files

- Modify `src/components/create-generation-form.tsx`
  - Replace the native `<select>` with the new custom component.
- Create `src/components/component-type-select.tsx`
  - Implement the single-select dropdown UI and behavior.
- Optionally refine `src/components/skill-multi-select.tsx`
  - Only if small style sharing is needed to keep the two controls visually aligned.
- Add tests under `tests/components/`
  - Cover open, select, and close behavior for the new dropdown.
  - Cover form submission using a changed component type.

## Testing

- Add a component test for the new single-select:
  - opens from the trigger
  - shows the current selection
  - updates selection on click
  - closes after selection
- Add or extend a form-level test:
  - change the component type
  - submit generation
  - verify the request payload includes the selected component type

## Risks and constraints

- The repo already has custom dropdown behavior for skills, so the new control should follow that existing pattern instead of introducing a separate UI system.
- This is a client-component change only; server-side request handling remains unchanged.
- The work should stay focused on this alignment issue and avoid turning into a generic select refactor.
