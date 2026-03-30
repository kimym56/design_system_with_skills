# Agent Skill UI Evaluation Playground Design

## Summary

Reposition the public landing page at `/` so it clearly describes the product as a technical evaluation playground for rapidly testing the UI output of new agent skills.

The approved direction is:
- technical/tooling tone
- no portfolio framing
- no "design engineer" identity language
- strong emphasis on rapid evaluation, preview, inspection, and iteration

## Goals

- Make the page immediately readable as a tool for evaluating UI output from new agent skills.
- Preserve the existing auth-aware header behavior and `/workspace` CTA destination.
- Keep the current page structure and specimen composition, but retune labels and copy so they describe an evaluation workflow.
- Keep the landing page visually aligned with the workspace and history routes.

## Non-Goals

- No redesign of the authenticated workspace or history views.
- No new routes, filtering features, comparison UI, or persistence changes.
- No changes to auth flows, APIs, or generation logic.
- No decorative marketing rewrite detached from the actual product behavior.

## Content Direction

The homepage should describe the product as a working tool:
- concise
- technical
- operational
- specific about what is evaluated

Preferred language:
- UI evaluation playground
- agent skills
- generated output
- preview
- inspect
- iterate
- saved runs

Avoid:
- design engineer
- portfolio
- selected work
- operating principles
- authored self-description

## Page Structure

Keep the existing broad structure, but retune each section:

### 1. Header

Use a short product identity line that frames the page as an evaluation environment for agent-skill UI output.

### 2. Hero

Hero headline and body should explain:
- this is a playground
- the target is new agent skills
- the action is generating and reviewing UI output quickly

Evidence cards should support the workflow with ideas such as:
- rapid iteration
- inspectable output
- run history

### 3. Workspace Specimen

Keep the large right-column specimen panel. Its copy should describe:
- choosing component types
- selecting approved skills
- generating a run
- reviewing code and preview output

This specimen remains static, but it should read like an evaluation surface rather than a product showcase.

### 4. Lower Information Band

Replace portfolio-oriented labels with workflow-oriented ones.

Approved direction:
- one panel for key surfaces in the evaluation loop
- one panel for evaluation rules or review priorities

### 5. Closing CTA

Frame `/workspace` as the place to run evaluations, not enter a portfolio or product demo.

## Behavior and Responsiveness

- Keep the page server-rendered and mostly static.
- Preserve current auth-aware controls.
- Preserve current responsive stacking behavior.
- Do not add new state or fake interactions to the landing page.

## Testing Strategy

Update the existing homepage test to lock in the new product purpose:
- hero heading reflects the evaluation-playground positioning
- workspace CTA remains present
- lower sections use workflow/evaluation language instead of portfolio language
- signed-in and signed-out auth behaviors remain unchanged

Verification should include:
- `npx vitest run tests/app/home-page.test.tsx`
- `npm run lint`
