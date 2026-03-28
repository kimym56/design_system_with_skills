# Generated Code Viewer Faux IDE Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the generated code panel into a read-only faux IDE viewer with editor chrome, a line-number gutter, copy support, and lightweight TSX-oriented syntax coloring while preserving the existing shared result-viewer behavior.

**Architecture:** Keep `GenerationResultViewer` as the preview/code toggle and dialog shell. Add a dedicated read-only code viewer component for the code surface, keep `GenerationCodePanel` as a thin adapter, and isolate lightweight highlighting into a focused helper so the app keeps a clean future swap point for Monaco without adding that dependency now.

**Tech Stack:** Next.js App Router, React 19 client components, TypeScript, Tailwind CSS v4, Testing Library, Vitest, browser Clipboard API

---

## File Structure

### Viewer shell

- Create: `src/components/generated-code-viewer.tsx`
- Modify: `src/components/generation-code-panel.tsx`

### Highlighting helper

- Create: `src/lib/code-viewer/highlight-tsx.ts`

### Tests

- Create: `tests/components/generated-code-viewer.test.tsx`
- Modify: `tests/components/generation-result-viewer.test.tsx`

## Chunk 1: Dedicated Read-Only Viewer Shell

### Task 1: Add the faux IDE frame behind `GenerationCodePanel`

**Files:**
- Create: `tests/components/generated-code-viewer.test.tsx`
- Create: `src/components/generated-code-viewer.tsx`
- Modify: `src/components/generation-code-panel.tsx`

- [ ] **Step 1: Write the failing viewer-shell tests**

Create `tests/components/generated-code-viewer.test.tsx` with coverage for:

```tsx
test("renders editor chrome, fallback file label, and visible line numbers", () => {
  render(
    <GeneratedCodeViewer
      code={`export function Demo() {\n  return <button>Demo</button>;\n}`}
      size="inline"
    />,
  );

  expect(screen.getByText(/generated-component\.tsx/i)).toBeInTheDocument();
  expect(screen.getByText(/^tsx$/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /copy generated code/i })).toBeInTheDocument();
  expect(screen.getByText(/^1$/)).toBeInTheDocument();
  expect(screen.getByText(/^3$/)).toBeInTheDocument();
});

test("keeps the faux IDE frame for the empty state", () => {
  render(<GeneratedCodeViewer code={null} size="inline" />);

  expect(screen.getByText(/generated component code appears after a successful run/i)).toBeInTheDocument();
  expect(screen.getByText(/generated-component\.tsx/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run: `npx vitest run tests/components/generated-code-viewer.test.tsx`
Expected: FAIL because the dedicated viewer component does not exist yet

- [ ] **Step 3: Implement the minimal dedicated viewer shell**

Create `src/components/generated-code-viewer.tsx` and update `src/components/generation-code-panel.tsx` so that:
- `GenerationCodePanel` becomes a thin wrapper
- the new viewer renders the editor header, file tab, language badge, status row, gutter, and scrollable code region
- inline and dialog modes reuse the same component with different height classes
- the empty state stays inside the same frame

- [ ] **Step 4: Run the targeted tests to verify they pass**

Run: `npx vitest run tests/components/generated-code-viewer.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit the shell extraction**

```bash
git add tests/components/generated-code-viewer.test.tsx src/components/generated-code-viewer.tsx src/components/generation-code-panel.tsx
git commit -m "feat: add faux ide generated code viewer shell"
```

## Chunk 2: Lightweight Highlighting And Copy Behavior

### Task 2: Add TSX-oriented highlighting and exact copy support

**Files:**
- Modify: `tests/components/generated-code-viewer.test.tsx`
- Create: `src/lib/code-viewer/highlight-tsx.ts`
- Modify: `src/components/generated-code-viewer.tsx`

- [ ] **Step 1: Extend the tests with copy and token behavior**

Add failing tests for:

```tsx
test("copies the exact generated source and shows copied feedback", async () => {
  const user = userEvent.setup();
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, {
    clipboard: { writeText },
  });

  const source = `export function Demo() {\n  return <button>Demo</button>;\n}`;

  render(<GeneratedCodeViewer code={source} size="inline" />);

  await user.click(screen.getByRole("button", { name: /copy generated code/i }));

  expect(writeText).toHaveBeenCalledWith(source);
  expect(screen.getByRole("button", { name: /copied generated code/i })).toBeInTheDocument();
});

test("renders known TSX tokens with token metadata while preserving text", () => {
  render(
    <GeneratedCodeViewer
      code={`export function Demo() {\n  return <button type="button">Demo</button>;\n}`}
      size="inline"
    />,
  );

  expect(screen.getByText("export")).toHaveAttribute("data-token-type", "keyword");
  expect(screen.getByText("button")).toHaveAttribute("data-token-type", "tag");
  expect(screen.getByText(/type/)).toHaveAttribute("data-token-type", "attribute");
});
```

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run: `npx vitest run tests/components/generated-code-viewer.test.tsx`
Expected: FAIL on copy state and token metadata assertions

- [ ] **Step 3: Implement the highlighting helper and clipboard behavior**

Create `src/lib/code-viewer/highlight-tsx.ts` and update `src/components/generated-code-viewer.tsx` so that:
- highlighting is lightweight and local
- unknown text falls back to plain rendering
- rendered text still preserves the exact source order and content
- copy uses `navigator.clipboard.writeText(code)` when available
- a short-lived copied state updates the button label without breaking subsequent copies

- [ ] **Step 4: Run the targeted tests to verify they pass**

Run: `npx vitest run tests/components/generated-code-viewer.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit the highlighting pass**

```bash
git add tests/components/generated-code-viewer.test.tsx src/lib/code-viewer/highlight-tsx.ts src/components/generated-code-viewer.tsx
git commit -m "feat: add generated code viewer highlighting and copy"
```

## Chunk 3: Shared Viewer Regression Coverage

### Task 3: Prove the outer result viewer still behaves correctly

**Files:**
- Modify: `tests/components/generation-result-viewer.test.tsx`
- Modify: `src/components/generation-code-panel.tsx`
- Modify: `src/components/generated-code-viewer.tsx`

- [ ] **Step 1: Extend the shared viewer tests first**

Update `tests/components/generation-result-viewer.test.tsx` so code mode asserts the new viewer shell instead of only raw code text:

```tsx
expect(screen.getByRole("button", { name: /copy generated code/i })).toBeInTheDocument();
expect(screen.getByText(/generated-component\.tsx/i)).toBeInTheDocument();
expect(screen.getByText(/^tsx$/i)).toBeInTheDocument();
expect(screen.getByText(/export function demo/i)).toBeInTheDocument();
```

Keep the existing preview-default and dialog assertions intact.

- [ ] **Step 2: Run the shared viewer tests to verify they fail if wiring is incomplete**

Run: `npx vitest run tests/components/generation-result-viewer.test.tsx`
Expected: FAIL until the new code viewer shell is fully exposed through `GenerationCodePanel`

- [ ] **Step 3: Finish any minimal wiring adjustments**

Ensure:
- `GenerationCodePanel` forwards `code` and `size` directly to the new viewer
- dialog mode keeps the same code viewer structure with taller height
- shared result-viewer behavior does not regress

- [ ] **Step 4: Run the shared viewer tests to verify they pass**

Run: `npx vitest run tests/components/generation-result-viewer.test.tsx`
Expected: PASS

## Chunk 4: Focused Verification

### Task 4: Run the targeted regression suite

**Files:**
- Modify: `src/components/generated-code-viewer.tsx`
- Modify: `src/components/generation-code-panel.tsx`
- Modify: `src/lib/code-viewer/highlight-tsx.ts`
- Modify: `tests/components/generated-code-viewer.test.tsx`
- Modify: `tests/components/generation-result-viewer.test.tsx`

- [ ] **Step 1: Run the focused component tests**

Run: `npx vitest run tests/components/generated-code-viewer.test.tsx tests/components/generation-result-viewer.test.tsx`
Expected: PASS

- [ ] **Step 2: Run lint on the touched files**

Run: `npm run lint -- src/components/generated-code-viewer.tsx src/components/generation-code-panel.tsx src/lib/code-viewer/highlight-tsx.ts tests/components/generated-code-viewer.test.tsx tests/components/generation-result-viewer.test.tsx`
Expected: PASS or no reported issues in the touched files

Plan complete and saved to `docs/superpowers/plans/2026-03-28-generated-code-viewer-faux-ide.md`. Ready to execute?
