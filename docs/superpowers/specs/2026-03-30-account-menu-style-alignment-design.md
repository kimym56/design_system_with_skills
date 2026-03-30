# Account Menu Style Alignment Design

## Goal

Make the signed-in account trigger and menu match the app's existing geometry, surface, and shadow language instead of reading like a standalone auth chip.

## Current State

- The shared account menu works functionally on the homepage and generation-history shell.
- The trigger uses a pill-like `rounded-full` treatment that stands out from the rest of the UI.
- The dropdown panel and action rows are close, but still read softer and more auth-specific than the other app surfaces.

## Decision

Keep the current account-menu behavior and information architecture, but restyle the trigger and dropdown to match the rest of the app:

- homepage trigger: `rounded-[14px]`, bordered, card-like, using the same surface language as nearby controls
- compact trigger: `rounded-[12px]`, tighter secondary-control styling for the app shell
- dropdown panel: `rounded-[16px]`, `bg-card`, `border-border`, and the same lighter panel shadow used by other menus and cards
- action rows: `rounded-[10px]` to align with the button system

The avatar itself remains circular.

## Behavior

- No behavior changes.
- Signed-in homepage users still see the wider adaptive account control.
- Signed-in app-shell users still see the compact account trigger.
- Menu contents and actions remain unchanged.

## Files Affected

- `src/components/auth/account-menu.tsx`
- `tests/components/auth/account-menu.test.tsx`

## Risks

- Over-specifying styling in tests can make future visual refinement harder, so tests should lock only the key geometry/surface classes that express the approved design.
- The trigger still needs to read as account-related even after losing the pill silhouette.

## Success Criteria

- The account trigger no longer uses the pill/chip treatment.
- The trigger and dropdown visually align with the app's existing button/card language.
- Focused tests and the production build pass.
