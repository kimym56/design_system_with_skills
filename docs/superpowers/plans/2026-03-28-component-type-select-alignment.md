# Component Type Select Alignment Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the native `Component type` field with a custom single-select dropdown that matches the `Approved skills` selector while preserving current generation behavior.

**Architecture:** Keep `CreateGenerationForm` as the owner of selection and submission state. Add a focused `ComponentTypeSelect` client component that mirrors the skills selector's trigger and popup treatment, then verify the new behavior through a dedicated component test and the existing workspace page test.

**Tech Stack:** Next.js 16 App Router, React 19 client components, TypeScript, Testing Library, Vitest, Tailwind CSS

---

## Chunk 1: Tests First

### Task 1: Add component dropdown behavior coverage

**Files:**
- Create: `tests/components/component-type-select.test.tsx`
- Create: `src/components/component-type-select.tsx`
- Modify: `src/lib/catalog/component-types.ts`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ComponentTypeSelect } from "@/components/component-type-select";

test("opens the dropdown, selects a new component type, and closes", async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();

  render(
    <ComponentTypeSelect
      value="Button"
      onSelect={onSelect}
      labelId="component-type-label"
    />,
  );

  await user.click(screen.getByRole("button", { name: /component type button/i }));
  expect(screen.getByText(/single-line text fields for forms and search\./i)).toBeInTheDocument();

  await user.click(screen.getByText(/^input$/i));

  expect(onSelect).toHaveBeenCalledWith("Input");
  expect(screen.queryByText(/single-line text fields for forms and search\./i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/component-type-select.test.tsx`

Expected: FAIL because `ComponentTypeSelect` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```tsx
export function ComponentTypeSelect() {
  return null;
}
```

- [ ] **Step 4: Run test to confirm the failure changes**

Run: `npm test -- tests/components/component-type-select.test.tsx`

Expected: FAIL on missing behavior rather than missing module.

- [ ] **Step 5: Commit**

```bash
git add tests/components/component-type-select.test.tsx src/components/component-type-select.tsx
git commit -m "test: cover component type dropdown behavior"
```

### Task 2: Add form-level coverage for component type submission

**Files:**
- Modify: `tests/app/workspace-page.test.tsx`
- Modify: `src/components/create-generation-form.tsx`

- [ ] **Step 1: Write the failing test update**

Add assertions that:

- the component type trigger is a button instead of a native combobox
- selecting `Input` updates the visible trigger label
- the workspace still renders the approved skills selector and generated result shell

- [ ] **Step 2: Run the focused workspace test**

Run: `npm test -- tests/app/workspace-page.test.tsx`

Expected: FAIL because the page still renders the native select.

- [ ] **Step 3: Keep the implementation target minimal**

Do not add a generic select abstraction. Limit the work to wiring in `ComponentTypeSelect` and any tiny shared style extraction that is clearly necessary.

- [ ] **Step 4: Re-run the focused workspace test after implementation**

Run: `npm test -- tests/app/workspace-page.test.tsx`

Expected: PASS with the custom trigger and existing skills flow still working.

- [ ] **Step 5: Commit**

```bash
git add tests/app/workspace-page.test.tsx src/components/create-generation-form.tsx
git commit -m "test: cover custom component type selector in workspace"
```

## Chunk 2: Implement the Custom Single-Select

### Task 3: Build the `ComponentTypeSelect` component

**Files:**
- Create: `src/components/component-type-select.tsx`
- Modify: `src/lib/catalog/component-types.ts`

- [ ] **Step 1: Implement the trigger and popup shell**

Use the same interaction pattern already present in `src/components/skill-multi-select.tsx`:

- local `isOpen` state
- outside-click close behavior
- `Escape` close behavior
- trigger chevron rotation

- [ ] **Step 2: Render single-select options**

Each option should display:

- the component type name
- the matching summary from `COMPONENT_TYPE_SUMMARIES`
- a selected checkmark state for the active value

- [ ] **Step 3: Close on selection**

When an option is clicked:

```tsx
onSelect(type);
setIsOpen(false);
```

- [ ] **Step 4: Run the component test**

Run: `npm test -- tests/components/component-type-select.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/component-type-select.tsx src/lib/catalog/component-types.ts tests/components/component-type-select.test.tsx
git commit -m "feat: add component type dropdown"
```

### Task 4: Replace the native select in the generation form

**Files:**
- Modify: `src/components/create-generation-form.tsx`
- Modify: `tests/app/workspace-page.test.tsx`

- [ ] **Step 1: Swap the control in the form**

Replace:

```tsx
<select id="component-type" ...>
```

With:

```tsx
<ComponentTypeSelect
  value={componentType}
  onSelect={setComponentType}
  labelId="component-type-label"
/>
```

- [ ] **Step 2: Align the label structure**

Use a text label block matching the `Approved skills` field so both controls read as the same input family.

- [ ] **Step 3: Run focused tests**

Run: `npm test -- tests/components/component-type-select.test.tsx tests/app/workspace-page.test.tsx`

Expected: PASS

- [ ] **Step 4: Run a lint pass for touched files if needed**

Run: `npm run lint -- src/components/create-generation-form.tsx src/components/component-type-select.tsx tests/components/component-type-select.test.tsx tests/app/workspace-page.test.tsx`

Expected: PASS or no relevant issues.

- [ ] **Step 5: Commit**

```bash
git add src/components/create-generation-form.tsx src/components/component-type-select.tsx tests/components/component-type-select.test.tsx tests/app/workspace-page.test.tsx
git commit -m "feat: align component type selector with skills dropdown"
```

## Chunk 3: Final Verification

### Task 5: Verify the completed change set

**Files:**
- Verify: `src/components/component-type-select.tsx`
- Verify: `src/components/create-generation-form.tsx`
- Verify: `tests/components/component-type-select.test.tsx`
- Verify: `tests/app/workspace-page.test.tsx`
- Reference: `docs/superpowers/specs/2026-03-28-component-type-select-alignment-design.md`

- [ ] **Step 1: Run the focused test suite**

Run: `npm test -- tests/components/component-type-select.test.tsx tests/app/workspace-page.test.tsx`

Expected: PASS

- [ ] **Step 2: Run broader regression coverage if fast enough**

Run: `npm test -- tests/components tests/app/workspace-page.test.tsx`

Expected: PASS

- [ ] **Step 3: Review the diff for scope**

Run: `git diff -- src/components/create-generation-form.tsx src/components/component-type-select.tsx tests/components/component-type-select.test.tsx tests/app/workspace-page.test.tsx`

Expected: Only the selector alignment work appears.

- [ ] **Step 4: Prepare a concise summary**

Capture:

- what changed
- what tests passed
- any remaining limitations

- [ ] **Step 5: Commit**

```bash
git add src/components/create-generation-form.tsx src/components/component-type-select.tsx tests/components/component-type-select.test.tsx tests/app/workspace-page.test.tsx
git commit -m "test: verify component type selector alignment"
```
