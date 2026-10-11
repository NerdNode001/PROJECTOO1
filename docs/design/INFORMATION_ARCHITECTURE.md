# TRACE Information Architecture

## Primary navigation
- Workspace
- Library
- Guides
- Settings

## Workspace zones
1. Top bar: product identity, breadcrumb, save status, quick actions.
2. Left nav: section switching with active state.
3. Canvas stage: media display, selection overlays, zoom/fit/reset, status strip.
4. Inspector: mode and goal controls, consent notice, analysis action, results panels.

## Core entities in UI
- Asset (uploaded or sample)
- Selection (point or region)
- Analysis request context (mode, goal, constraints)
- Analysis report (summary, evidence, steps, troubleshooting)

## Responsive IA
- <=1024px: left nav collapses into icon rail, inspector uses drawer toggle.
- <=640px: single-column workspace, bottom-sheet inspector, persistent Analyze CTA.
