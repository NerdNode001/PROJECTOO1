# ADR 0002: Normalized selection coordinate model

## Status
Accepted

## Context
Selections must stay accurate through resize, fit, zoom, and responsive layout shifts.

## Decision
Represent point and region selection in normalized 0..1 asset coordinates and convert to/from viewport coordinates using deterministic transform functions.

## Consequences
- Payloads are resolution-independent.
- Transform math can be unit tested and shared with future API and rendering logic.
- Overlay rendering requires a consistent media layout calculation each frame.
