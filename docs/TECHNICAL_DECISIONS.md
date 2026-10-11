# Technical Decisions (Phase 0/1)

1. **Framework:** Next.js App Router + strict TypeScript for production-aligned architecture and route handlers.
2. **Styling:** Tailwind CSS with semantic token variables in `globals.css`.
3. **Selection model:** Store point/region in normalized (0..1) coordinates to survive responsive resizing and zoom changes.
4. **State strategy:** Client-local state for Phase 1 interaction; backend persistence deferred to Phase 2.
5. **Validation:** Zod schema introduced for `AnalysisReportV1` contract and future API validation.
6. **Testing:** Vitest used for deterministic geometry unit tests.
7. **Provider boundary:** Future AI integration must occur server-side behind a provider adapter and never directly in browser components.
