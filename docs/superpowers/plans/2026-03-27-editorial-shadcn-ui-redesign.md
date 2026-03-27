# Editorial Shadcn UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign every current user-facing page into a simple white/black/cobalt editorial UI using Tailwind and local shadcn/ui primitives without changing product logic.

**Architecture:** Add a small shadcn-compatible UI foundation in `src/components/ui` and `src/lib/utils.ts`, then refactor the landing page, app shell, workspace, history list, and generation detail page to consume those primitives. Keep existing data fetching, auth, API handlers, and generation behavior intact while updating app tests to reflect the new UI contract.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, local shadcn/ui-style components, Vitest, Testing Library

---

## File Structure

- Create: `components.json`
  Purpose: Record shadcn-style aliases/config for future consistency.
- Create: `src/lib/utils.ts`
  Purpose: Export the shared `cn` helper for UI primitives.
- Create: `src/components/ui/button.tsx`
  Purpose: Shared cobalt/neutral button variants.
- Create: `src/components/ui/card.tsx`
  Purpose: Shared white-surface editorial card shell.
- Create: `src/components/ui/badge.tsx`
  Purpose: Shared small labels for skill tags, quota, and states.
- Create: `src/components/ui/input.tsx`
  Purpose: Shared form control styles.
- Create: `src/components/ui/separator.tsx`
  Purpose: Shared neutral divider.
- Modify: `package.json`
  Purpose: Add any shadcn-compatible dependencies needed by the local UI primitives.
- Modify: `src/app/globals.css`
  Purpose: Replace ad hoc global styling with white/black/cobalt tokens and shadcn-compatible CSS variables.
- Modify: `src/app/layout.tsx`
  Purpose: Keep the root font setup but update metadata and body-level shell classes.
- Modify: `src/app/page.tsx`
  Purpose: Redesign the landing page into the approved editorial frame.
- Modify: `src/app/(app)/layout.tsx`
  Purpose: Redesign the authenticated shell.
- Modify: `src/components/app-sidebar.tsx`
  Purpose: Convert navigation to the new editorial sidebar treatment.
- Modify: `src/app/(app)/workspace/page.tsx`
  Purpose: Update workspace framing and header hierarchy.
- Modify: `src/components/create-generation-form.tsx`
  Purpose: Refactor the builder layout around the new card/button/badge system.
- Modify: `src/components/skill-multi-select.tsx`
  Purpose: Restyle skill selection to white cards with cobalt selected state.
- Modify: `src/components/generation-code-panel.tsx`
  Purpose: Keep this as the intentional dark surface.
- Modify: `src/components/generation-preview-frame.tsx`
  Purpose: Frame the preview inside a light editorial surface.
- Modify: `src/app/(app)/history/page.tsx`
  Purpose: Update history heading and page framing.
- Modify: `src/components/history-list.tsx`
  Purpose: Restyle empty state and generation cards.
- Modify: `src/app/(app)/history/[generationId]/page.tsx`
  Purpose: Align detail page with the new editorial system.
- Modify: `tests/app/home-page.test.tsx`
  Purpose: Keep landing assertions aligned with the redesigned content.
- Modify: `tests/app/app-layout.test.tsx`
  Purpose: Keep authenticated-shell navigation assertions aligned.
- Modify: `tests/app/workspace-page.test.tsx`
  Purpose: Assert updated workspace heading/copy.
- Modify: `tests/app/history-page.test.tsx`
  Purpose: Assert updated history heading/empty-state copy.
- Create: `tests/app/generation-detail-page.test.tsx`
  Purpose: Add a small smoke test for the detail page shell.

## Chunk 1: Foundation, Theme, and Shell

### Task 1: Add the shadcn-compatible foundation

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/separator.tsx`
- Modify: `package.json`
- Modify: `src/app/globals.css`
- Test: `tests/components/ui/button.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/ui/button.test.tsx` with a simple render assertion:

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

test("button renders children and remains clickable", () => {
  render(<Button>Generate component</Button>);
  expect(
    screen.getByRole("button", { name: /generate component/i }),
  ).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/ui/button.test.tsx`

Expected: FAIL because `@/components/ui/button` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implement the local shadcn foundation:
- add `components.json`
- add `src/lib/utils.ts` with `clsx` + `tailwind-merge`
- add `src/components/ui/*` primitives
- update `package.json` for any missing UI dependencies
- rewrite `src/app/globals.css` around editorial CSS variables:
  - white backgrounds
  - black text/borders
  - cobalt accent
  - shadcn-compatible token names

Representative `Button` shape:

```tsx
export function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run the targeted test**

Run: `npx vitest run tests/components/ui/button.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components.json package.json src/lib/utils.ts src/components/ui src/app/globals.css tests/components/ui/button.test.tsx
git commit -m "feat: add editorial shadcn ui foundation"
```

### Task 2: Redesign the root layout, app shell, and sidebar

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/(app)/layout.tsx`
- Modify: `src/components/app-sidebar.tsx`
- Modify: `tests/app/app-layout.test.tsx`

- [ ] **Step 1: Update the app-layout test first**

Expand `tests/app/app-layout.test.tsx` so it continues to assert navigation labels and the product identity:

```tsx
expect(screen.getByRole("link", { name: /workspace/i })).toBeInTheDocument();
expect(screen.getByRole("link", { name: /history/i })).toBeInTheDocument();
expect(screen.getByText(/skill-guided builder/i)).toBeInTheDocument();
```

- [ ] **Step 2: Run the targeted test to verify the new assertion fails**

Run: `npx vitest run tests/app/app-layout.test.tsx`

Expected: FAIL on the new shell copy assertion.

- [ ] **Step 3: Implement the new shell**

Update:
- `src/app/layout.tsx` to set product metadata and bright body styling
- `src/app/(app)/layout.tsx` to use a white page background and editorial frame
- `src/components/app-sidebar.tsx` to use white surfaces, thin borders, black text, and cobalt active-state emphasis

Implementation notes:
- avoid heavy shadows
- keep whitespace generous
- use `Card`, `Badge`, and `Separator` where they reduce custom class churn

- [ ] **Step 4: Run the targeted test**

Run: `npx vitest run tests/app/app-layout.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx 'src/app/(app)/layout.tsx' src/components/app-sidebar.tsx tests/app/app-layout.test.tsx
git commit -m "style: redesign authenticated shell"
```

### Task 3: Redesign the landing page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Update the landing-page test first**

Keep the current headline + CTA assertions, and add one more assertion for the editorial trust framing:

```tsx
expect(screen.getByText(/approved skills only/i)).toBeInTheDocument();
```

- [ ] **Step 2: Run the targeted test**

Run: `npx vitest run tests/app/home-page.test.tsx`

Expected: FAIL until the landing page is rewritten.

- [ ] **Step 3: Implement the approved editorial landing page**

Rewrite `src/app/page.tsx` with:
- large editorial hero
- one primary `Start with Google` CTA
- short trust strip
- simplified workflow section
- restrained mockup using one dark code block and light preview framing

Keep the palette aligned to:
- white primary surface
- black structure
- cobalt accent

- [ ] **Step 4: Run the targeted test**

Run: `npx vitest run tests/app/home-page.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx tests/app/home-page.test.tsx
git commit -m "style: redesign landing page"
```

## Chunk 2: Workspace, History, and Verification

### Task 4: Refactor the workspace and generator surfaces

**Files:**
- Modify: `src/app/(app)/workspace/page.tsx`
- Modify: `src/components/create-generation-form.tsx`
- Modify: `src/components/skill-multi-select.tsx`
- Modify: `src/components/generation-code-panel.tsx`
- Modify: `src/components/generation-preview-frame.tsx`
- Modify: `tests/app/workspace-page.test.tsx`

- [ ] **Step 1: Update the workspace-page test first**

Add one more assertion that matches the editorial builder framing:

```tsx
expect(
  screen.getByText(/approved github-published ui\/ux skills/i),
).toBeInTheDocument();
```

- [ ] **Step 2: Run the targeted test**

Run: `npx vitest run tests/app/workspace-page.test.tsx`

Expected: FAIL on the new assertion.

- [ ] **Step 3: Implement the workspace redesign**

Update the workspace UI so it uses shared primitives and cleaner hierarchy:
- editorial page heading in `src/app/(app)/workspace/page.tsx`
- white left-column builder surface in `src/components/create-generation-form.tsx`
- cobalt selected state in `src/components/skill-multi-select.tsx`
- dark code surface in `src/components/generation-code-panel.tsx`
- framed light preview in `src/components/generation-preview-frame.tsx`

Implementation rules:
- no dark full-page backgrounds
- no amber accents
- code stays dark by exception

- [ ] **Step 4: Run the targeted test**

Run: `npx vitest run tests/app/workspace-page.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(app)/workspace/page.tsx' src/components/create-generation-form.tsx src/components/skill-multi-select.tsx src/components/generation-code-panel.tsx src/components/generation-preview-frame.tsx tests/app/workspace-page.test.tsx
git commit -m "style: redesign workspace builder"
```

### Task 5: Refactor the history list and generation detail page

**Files:**
- Modify: `src/app/(app)/history/page.tsx`
- Modify: `src/components/history-list.tsx`
- Modify: `src/app/(app)/history/[generationId]/page.tsx`
- Modify: `tests/app/history-page.test.tsx`
- Create: `tests/app/generation-detail-page.test.tsx`

- [ ] **Step 1: Write the failing tests**

Update `tests/app/history-page.test.tsx` to match the new copy, and add a smoke test for detail-page framing:

```tsx
import { render, screen } from "@testing-library/react";
import GenerationDetailPage from "@/app/(app)/history/[generationId]/page";

test("generation detail page shows loading copy before data arrives", () => {
  render(<GenerationDetailPage />);
  expect(screen.getByText(/loading generation/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the targeted tests**

Run: `npx vitest run tests/app/history-page.test.tsx tests/app/generation-detail-page.test.tsx`

Expected: FAIL until the new test file and updated page shell exist.

- [ ] **Step 3: Implement the history redesign**

Refactor:
- `src/app/(app)/history/page.tsx` into the editorial list page
- `src/components/history-list.tsx` into white cards with black structure and cobalt reopen emphasis
- `src/app/(app)/history/[generationId]/page.tsx` into a matching editorial detail layout

Keep detail-page behavior intact:
- loading state
- error state
- rationale
- preview/code split

- [ ] **Step 4: Run the targeted tests**

Run: `npx vitest run tests/app/history-page.test.tsx tests/app/generation-detail-page.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(app)/history/page.tsx' 'src/app/(app)/history/[generationId]/page.tsx' src/components/history-list.tsx tests/app/history-page.test.tsx tests/app/generation-detail-page.test.tsx
git commit -m "style: redesign history views"
```

### Task 6: Final verification and cleanup

**Files:**
- Verify all modified UI files from both chunks

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`

Expected: PASS

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: PASS

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: PASS

- [ ] **Step 4: Check final git status**

Run: `git status --short`

Expected: only the intended UI changes remain unstaged or staged for the final commit.

- [ ] **Step 5: Commit**

```bash
git add components.json package.json src/app src/components src/lib/utils.ts tests
git commit -m "style: complete editorial shadcn ui redesign"
```
