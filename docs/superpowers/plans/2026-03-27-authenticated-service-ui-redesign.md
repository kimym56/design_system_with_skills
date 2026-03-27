# Authenticated Service UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the authenticated product surfaces into a tighter Vercel-inspired service UI without changing generation, auth, quota, or history behavior.

**Architecture:** Retune the shared Tailwind/theme tokens and local UI primitives first, then refactor the authenticated shell, workspace, history index, and saved-run detail page around that shared system. Keep the existing App Router structure, client/server boundaries, and API flows intact while updating the existing tests to lock in the new UI contract.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, local shadcn-style primitives, Vitest, Testing Library

---

## File Structure

- Modify: `src/app/globals.css`
  Purpose: Tighten the shared color, radius, border, and code-surface tokens around the approved `6:3:1` product palette.
- Modify: `src/components/ui/button.tsx`
  Purpose: Make button variants more compact and product-like.
- Modify: `src/components/ui/card.tsx`
  Purpose: Normalize panel spacing and reduce visual weight.
- Modify: `src/components/ui/badge.tsx`
  Purpose: Quiet badge/chip styling so state labels feel operational instead of promotional.
- Modify: `src/components/ui/input.tsx`
  Purpose: Align control radius and focus treatment with the new shell.
- Modify: `src/components/ui/separator.tsx`
  Purpose: Keep divider tone consistent across shell and pages.
- Modify: `src/app/(app)/layout.tsx`
  Purpose: Reframe the authenticated area around a slimmer rail and calmer content canvas.
- Modify: `src/components/app-sidebar.tsx`
  Purpose: Convert the sidebar into a compact product navigation rail.
- Modify: `src/app/(app)/workspace/page.tsx`
  Purpose: Rewrite the workspace header for a more operational tone.
- Modify: `src/components/create-generation-form.tsx`
  Purpose: Rebuild the builder into a left-controls/right-results layout with clearer hierarchy.
- Modify: `src/components/skill-multi-select.tsx`
  Purpose: Make skill rows feel selectable and technical.
- Modify: `src/components/generation-preview-frame.tsx`
  Purpose: Present preview output in a lighter framed panel.
- Modify: `src/components/generation-code-panel.tsx`
  Purpose: Keep code as the intentional dark surface while matching the new spacing/radius system.
- Modify: `src/app/(app)/history/page.tsx`
  Purpose: Rewrite the history page header for concise product language.
- Modify: `src/components/history-list.tsx`
  Purpose: Restructure loading, empty, and loaded states into a stronger saved-runs index.
- Modify: `src/app/(app)/history/[generationId]/page.tsx`
  Purpose: Make saved-run detail mirror workspace panel structure.
- Modify: `tests/app/app-layout.test.tsx`
  Purpose: Lock in the new shell identity and navigation contract.
- Modify: `tests/app/workspace-page.test.tsx`
  Purpose: Lock in the new workspace header and supporting copy.
- Modify: `tests/app/history-page.test.tsx`
  Purpose: Lock in the new history framing and empty-state language.
- Modify: `tests/app/generation-detail-page.test.tsx`
  Purpose: Lock in the saved-run detail loading/success framing.
- Modify: `tests/components/ui/button.test.tsx`
  Purpose: Keep one shared primitive smoke test aligned with the redesigned button API.

## Chunk 1: Shared Theme and Authenticated Shell

### Task 1: Tighten the shared product theme and primitive surfaces

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/components/ui/badge.tsx`
- Modify: `src/components/ui/input.tsx`
- Modify: `src/components/ui/separator.tsx`
- Modify: `tests/components/ui/button.test.tsx`

- [ ] **Step 1: Extend the button test with one new contract that represents the redesign**

Add one assertion to `tests/components/ui/button.test.tsx` that locks in the compact outline variant remaining available:

```tsx
test("button keeps the outline variant for secondary product actions", () => {
  render(<Button variant="outline">Open history</Button>);

  const button = screen.getByRole("button", { name: /open history/i });
  expect(button.className).toMatch(/border/);
});
```

- [ ] **Step 2: Run the targeted primitive test**

Run: `npx vitest run tests/components/ui/button.test.tsx`

Expected: PASS or FAIL is acceptable here. The purpose is to capture the current baseline before the visual rewrite, because this task is mostly style-system work.

- [ ] **Step 3: Rewrite the shared surface tokens and primitive styling**

Update the theme and local primitives to match the approved direction:
- reduce oversized radii
- keep cobalt for primary emphasis only
- lighten card elevation
- keep dark code surfaces distinct
- make controls flatter and more technical

Representative `Button` direction:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[12px] text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/92",
        outline: "border border-border bg-background text-foreground hover:bg-muted",
      },
    },
  },
);
```

- [ ] **Step 4: Re-run the targeted primitive test**

Run: `npx vitest run tests/components/ui/button.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit the theme/primitives pass**

```bash
git add src/app/globals.css src/components/ui/button.tsx src/components/ui/card.tsx src/components/ui/badge.tsx src/components/ui/input.tsx src/components/ui/separator.tsx tests/components/ui/button.test.tsx
git commit -m "style: tighten authenticated ui primitives"
```

### Task 2: Rebuild the authenticated shell around the new product frame

**Files:**
- Modify: `src/app/(app)/layout.tsx`
- Modify: `src/components/app-sidebar.tsx`
- Modify: `tests/app/app-layout.test.tsx`

- [ ] **Step 1: Update the shell test first**

Change `tests/app/app-layout.test.tsx` so it asserts the redesigned shell identity instead of the older promotional copy:

```tsx
expect(screen.getByText(/approved component pipeline/i)).toBeInTheDocument();
expect(screen.getAllByRole("link", { name: /workspace/i }).length).toBeGreaterThan(0);
expect(screen.getByRole("link", { name: /history/i })).toBeInTheDocument();
```

- [ ] **Step 2: Run the shell test to verify the new copy assertion fails**

Run: `npx vitest run tests/app/app-layout.test.tsx`

Expected: FAIL on the new shell copy assertion.

- [ ] **Step 3: Implement the slimmer rail and calmer content canvas**

Update:
- `src/app/(app)/layout.tsx` to reduce the shell’s visual weight
- `src/components/app-sidebar.tsx` to use smaller icons, tighter nav rows, quieter copy, and clearer active-state emphasis

Implementation notes:
- keep navigation labels obvious
- avoid heavy shadows
- use `Card`, `Badge`, and `Separator` only where they reduce custom class churn
- do not add any new app behavior

- [ ] **Step 4: Re-run the shell test**

Run: `npx vitest run tests/app/app-layout.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit the shell pass**

```bash
git add 'src/app/(app)/layout.tsx' src/components/app-sidebar.tsx tests/app/app-layout.test.tsx
git commit -m "style: redesign authenticated service shell"
```

## Chunk 2: Workspace Builder Surface

### Task 3: Rewrite the workspace header and builder layout

**Files:**
- Modify: `src/app/(app)/workspace/page.tsx`
- Modify: `src/components/create-generation-form.tsx`
- Modify: `src/components/skill-multi-select.tsx`
- Modify: `src/components/generation-preview-frame.tsx`
- Modify: `src/components/generation-code-panel.tsx`
- Modify: `tests/app/workspace-page.test.tsx`

- [ ] **Step 1: Update the workspace test first**

Rewrite `tests/app/workspace-page.test.tsx` so it locks in the tighter operational framing:

```tsx
expect(
  screen.getByRole("heading", { name: /run a component generation/i }),
).toBeInTheDocument();
expect(
  screen.getByText(/choose one component type and approved skills/i),
).toBeInTheDocument();
```

- [ ] **Step 2: Run the workspace test to confirm it fails**

Run: `npx vitest run tests/app/workspace-page.test.tsx`

Expected: FAIL because the current page still uses the older editorial copy.

- [ ] **Step 3: Refactor the workspace around the approved two-column structure**

Implement:
- a concise page header in `src/app/(app)/workspace/page.tsx`
- a left controls column in `src/components/create-generation-form.tsx`
- a right results column with preview first, code second, rationale third
- cleaner selectable rows in `src/components/skill-multi-select.tsx`
- lighter framing in `src/components/generation-preview-frame.tsx`
- tighter spacing/radius in `src/components/generation-code-panel.tsx`

Representative panel structure:

```tsx
<div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
  <section>{/* controls */}</section>
  <section>{/* preview, code, rationale */}</section>
</div>
```

- [ ] **Step 4: Re-run the workspace test**

Run: `npx vitest run tests/app/workspace-page.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit the workspace pass**

```bash
git add 'src/app/(app)/workspace/page.tsx' src/components/create-generation-form.tsx src/components/skill-multi-select.tsx src/components/generation-preview-frame.tsx src/components/generation-code-panel.tsx tests/app/workspace-page.test.tsx
git commit -m "style: redesign authenticated workspace"
```

## Chunk 3: Saved Runs Index, Detail, and Verification

### Task 4: Rewrite the history index into a stronger saved-runs view

**Files:**
- Modify: `src/app/(app)/history/page.tsx`
- Modify: `src/components/history-list.tsx`
- Modify: `tests/app/history-page.test.tsx`

- [ ] **Step 1: Update the history-page test first**

Change `tests/app/history-page.test.tsx` to assert the new saved-runs framing:

```tsx
expect(
  screen.getByRole("heading", { name: /saved runs/i }),
).toBeInTheDocument();
expect(
  await screen.findByText(/no runs yet/i),
).toBeInTheDocument();
```

- [ ] **Step 2: Run the history-page test to verify it fails**

Run: `npx vitest run tests/app/history-page.test.tsx`

Expected: FAIL because the current copy still references "saved generations" and the older empty state.

- [ ] **Step 3: Implement the saved-runs index redesign**

Refactor:
- `src/app/(app)/history/page.tsx` to use concise header copy
- `src/components/history-list.tsx` to tighten loaded cards and simplify loading/empty states

Keep this information hierarchy:
- component type and reopen action first
- timestamp second
- selected skills last

- [ ] **Step 4: Re-run the history-page test**

Run: `npx vitest run tests/app/history-page.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit the history index pass**

```bash
git add 'src/app/(app)/history/page.tsx' src/components/history-list.tsx tests/app/history-page.test.tsx
git commit -m "style: redesign saved runs index"
```

### Task 5: Make saved-run detail mirror the workspace mental model

**Files:**
- Modify: `src/app/(app)/history/[generationId]/page.tsx`
- Modify: `tests/app/generation-detail-page.test.tsx`

- [ ] **Step 1: Update the detail-page test first**

Expand `tests/app/generation-detail-page.test.tsx` to assert the saved-run framing after data resolves:

```tsx
test("generation detail page shows the saved run summary", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        generation: {
          id: "demo-generation",
          componentType: "Button",
          rationale: "Approved skills favored a compact primary action.",
          resultCode: "export function Demo() { return <button />; }",
          createdAt: "2026-03-27T10:00:00.000Z",
          model: "gpt-5.4",
          previewPayload: { html: "<button>Demo</button>" },
          selectedSkills: [{ skill: { id: "s1", name: "minimalist-ui" } }],
        },
      })) as unknown as typeof fetch,
  );

  render(<GenerationDetailPage />);

  expect(await screen.findByRole("heading", { name: /button/i })).toBeInTheDocument();
  expect(await screen.findByText(/saved run summary/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the detail-page test to confirm it fails**

Run: `npx vitest run tests/app/generation-detail-page.test.tsx`

Expected: FAIL on the new saved-run summary assertion.

- [ ] **Step 3: Refactor the detail page to match the workspace panel language**

Update `src/app/(app)/history/[generationId]/page.tsx` so it uses:
- a tighter metadata header
- a skills summary panel
- preview and code panels aligned with the workspace treatment
- rationale as supporting context

Do not change the fetch lifecycle or route behavior.

- [ ] **Step 4: Re-run the detail-page test**

Run: `npx vitest run tests/app/generation-detail-page.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit the detail-page pass**

```bash
git add 'src/app/(app)/history/[generationId]/page.tsx' tests/app/generation-detail-page.test.tsx
git commit -m "style: redesign saved run detail"
```

### Task 6: Run full verification and prepare the branch for review

**Files:**
- Modify: none expected

- [ ] **Step 1: Run the app-focused test suite**

Run: `npx vitest run tests/app tests/components/ui/button.test.tsx`

Expected: PASS

- [ ] **Step 2: Run the full project test suite**

Run: `npm run test`

Expected: PASS

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: PASS

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: PASS

- [ ] **Step 5: Commit any final polish required by verification**

```bash
git add src/app/globals.css src/components/ui src/components src/app tests/app tests/components/ui/button.test.tsx
git commit -m "style: complete authenticated service ui redesign"
```
