# Hybrid Product Portfolio Landing Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the public landing page into a product-first design engineer portfolio surface that visually matches the workspace and history pages without changing auth or route behavior.

**Architecture:** Keep the redesign contained to the existing App Router homepage and its page-level test. Recompose `src/app/page.tsx` around four public sections, reuse the existing local UI primitives and auth-aware controls, and lock in the new contract with focused homepage assertions instead of broader app-shell churn.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, local shadcn-style UI primitives, Vitest, Testing Library

---

## File Structure

- Modify: `src/app/page.tsx`
  Purpose: Replace the current marketing/editorial landing structure with the approved hybrid product portfolio layout, copy, and specimen panel while preserving auth-aware CTA behavior.
- Modify: `tests/app/home-page.test.tsx`
  Purpose: Lock in the new homepage heading, section framing, CTA behavior, and signed-in/signed-out auth states.

## Chunk 1: Homepage Contract and Layout Rewrite

### Task 1: Update the homepage test to the approved portfolio contract

**Files:**
- Modify: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Rewrite the signed-out assertions around the approved landing language**

Update the signed-out test so it checks the new portfolio-first hierarchy and removes dependency on the old marketing copy:

```tsx
expect(
  screen.getByRole("heading", {
    name: /product systems with working surfaces/i,
  }),
).toBeInTheDocument();

expect(
  screen.getByText(/selected work/i),
).toBeInTheDocument();

expect(
  screen.getByText(/operating principles/i),
).toBeInTheDocument();

expect(
  screen.getByRole("link", { name: /open workspace/i }),
).toHaveAttribute("href", "/workspace");

expect(
  screen.queryByText(/simple workflow/i),
).not.toBeInTheDocument();
```

- [ ] **Step 2: Rewrite the signed-in assertions to reflect a single header account entry**

Change the signed-in test so it expects the account menu to remain available while the Google sign-in buttons disappear:

```tsx
expect(
  screen.getByRole("button", { name: /yongmin kim/i }),
).toBeInTheDocument();

expect(
  screen.queryByRole("button", { name: /sign in with google/i }),
).not.toBeInTheDocument();
```

- [ ] **Step 3: Run the homepage test to verify the new contract fails**

Run: `npx vitest run tests/app/home-page.test.tsx`

Expected: FAIL because the current homepage still renders the old “generate design system components” hero and marketing section copy.

- [ ] **Step 4: Commit the failing test-only change**

```bash
git add tests/app/home-page.test.tsx
git commit -m "test: update homepage contract for portfolio landing"
```

### Task 2: Rebuild `src/app/page.tsx` around the approved hybrid product portfolio

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Replace the current content data with portfolio-oriented section data**

Delete the current `trustSignals`, `workflowSteps`, and similar marketing arrays, then introduce compact structured data for:
- evidence cards
- selected work entries
- operating principles
- specimen panel labels

Representative data shape:

```tsx
const evidenceCards = [
  {
    label: "Shipped surfaces",
    value: "Workspace, history, and auth flows designed as one system.",
  },
  {
    label: "System thinking",
    value: "Reusable panels, states, and interaction patterns.",
  },
  {
    label: "Code-backed UI",
    value: "Interface decisions carried through implementation details.",
  },
];
```

- [ ] **Step 2: Rewrite the page structure into the four approved sections**

Implement this top-level structure inside the existing async `Home` page:

```tsx
<main className="min-h-screen bg-background">
  <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-4 sm:px-6 sm:py-6">
    <header>{/* compact auth-aware header */}</header>
    <section>{/* product-first hero + specimen panel */}</section>
    <section>{/* selected work + operating principles */}</section>
    <section>{/* closing CTA */}</section>
  </div>
</main>
```

Implementation notes:
- keep `getServerAuthSession()` and `toAccountMenuUser()` exactly as the auth source
- preserve the primary CTA to `/workspace`
- reuse `AccountMenu`, `GoogleSignInButton`, `Button`, `Card`, `Badge`, and `Separator`
- keep the specimen panel static and composition-driven; do not add new interactivity

- [ ] **Step 3: Build the new hero composition so it clearly echoes the workspace/history surfaces**

Use a two-column hero on large screens:
- left column for eyebrow, headline, supporting copy, CTA row, and evidence cards
- right column for a large specimen panel composed from nested `Card` blocks, code surface styling, and preview framing

Representative hero copy contract:

```tsx
<p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
  Design Engineer Portfolio
</p>
<h1 className="text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
  Product systems with working surfaces.
</h1>
<p className="max-w-2xl text-lg leading-8 text-muted-foreground">
  I design and ship interface systems that stay coherent from the public entry
  point to the working product surface.
</p>
```

- [ ] **Step 4: Replace the old explainer section with selected work and operating principles panels**

Implement two dense product-like blocks under the hero:
- `Selected work` as a short list of focused entries
- `Operating principles` as concise design-engineering statements

Representative section framing:

```tsx
<section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
  <Card>{/* selected work list */}</Card>
  <Card className="bg-muted/50">{/* operating principles */}</Card>
</section>
```

- [ ] **Step 5: Keep the closing CTA minimal and product-like**

Reuse the current CTA destination but tighten the copy:

```tsx
<Button asChild size="lg">
  <Link href="/workspace">
    Open workspace
    <ArrowUpRight className="size-4" />
  </Link>
</Button>
```

The surrounding copy should frame `/workspace` as the working environment, not a sign-up funnel.

- [ ] **Step 6: Run the homepage test again**

Run: `npx vitest run tests/app/home-page.test.tsx`

Expected: PASS

- [ ] **Step 7: Commit the homepage rewrite**

```bash
git add src/app/page.tsx tests/app/home-page.test.tsx
git commit -m "feat: redesign landing page as hybrid product portfolio"
```

## Chunk 2: Verification and Final Cleanup

### Task 3: Verify the redesigned homepage against the broader app contract

**Files:**
- Modify: `src/app/page.tsx` (only if verification exposes a regression)
- Modify: `tests/app/home-page.test.tsx` (only if verification exposes an incorrect assertion)

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: PASS

- [ ] **Step 2: Run the full test suite**

Run: `npm run test`

Expected: PASS

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: PASS

- [ ] **Step 4: If any verification step fails, make the minimal homepage-scoped fix and re-run the failing command**

Keep fixes limited to:
- `src/app/page.tsx`
- `tests/app/home-page.test.tsx`

Do not broaden scope into authenticated pages unless the landing-page rewrite directly exposed a pre-existing assumption in shared UI.

- [ ] **Step 5: Commit any verification-driven fix**

```bash
git add src/app/page.tsx tests/app/home-page.test.tsx
git commit -m "fix: address landing page verification regressions"
```
