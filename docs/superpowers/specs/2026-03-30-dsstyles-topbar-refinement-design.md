# DSSkills Top Bar Refinement Design

## Summary

Refine the landing-page header so it behaves like the top menu on `https://claude.ai/login`:

- always visible on its own solid background
- no floating overlap with scrolling content
- no border radius on the top menu surface
- `Try DSSkills` uses the shared button radius instead of a pill override

## Goals

- Make the top menu read as a persistent page bar rather than a floating chip.
- Remove the rounded header treatment.
- Keep the existing signed-in and signed-out CTA behavior unchanged.
- Align the `Try DSSkills` trigger radius with the rest of the button system.

## Non-Goals

- No change to hero copy, footer content, or CTA destinations.
- No broader visual retheme outside the landing header shell.

## Approved Direction

The landing shell should use a full-width sticky top bar with an opaque background and bottom divider. The page content starts below that bar so the header does not visually overlap the hero while scrolling.

The `Try DSSkills` control should stop overriding button radius with `rounded-full` and instead inherit the shared button radius token from the button primitive.
