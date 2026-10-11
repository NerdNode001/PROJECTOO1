# ADR 0001: Phase 0/1 architecture baseline

## Status
Accepted

## Context
Repository began with no app implementation. The first milestone requires a polished interactive workspace before backend integration.

## Decision
Implement a Next.js App Router app with client-rendered workspace interactions, semantic design tokens, and normalized selection math isolated in `src/lib/workspace/geometry.ts`.

## Consequences
- Fast progress on UX and interaction quality.
- Coordinates and transforms are testable and reusable for server payloads.
- Persistence and provider integrations remain future work and are explicitly documented.
