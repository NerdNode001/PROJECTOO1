# TRACE Build Plan

## Repository baseline
- Repository was effectively empty except for a short README.
- Bootstrapped with Next.js App Router, TypeScript, Tailwind CSS, and ESLint.

## Route map
- `/` Workspace (primary flow)
- `/library` Projects and saved analyses (Phase 1 placeholder)
- `/guides` Saved how-to guides (Phase 1 placeholder)
- `/settings` Provider and workspace settings (Phase 1 placeholder)

## Component inventory
- Shell: top bar, left navigation, responsive mobile nav
- Workspace: upload/dropzone, sample fixture loader, zoom controls, selection tool controls, coordinate status
- Inspector: mode/intent controls, consent notice, analyze action, progress/error/success report sections

## Key user flows (Phase 0/1)
1. First-use workspace with guided empty state.
2. Upload image or open sample scene.
3. Select point or rectangle target in normalized coordinates.
4. Choose mode + intent and run simulated analysis state transitions.
5. Review structured sample output and copy next steps.

## Environment dependencies
- Node.js (Next.js 16 baseline)
- Optional future providers: Supabase + vision provider credentials

## Phased implementation
- Phase 0: audit repo, document IA/wireframes/decisions/quality gates.
- Phase 1: premium responsive workspace UI + selection overlay + seeded analysis states.
- Phase 2+: auth/storage/real AI/video as documented in product pack.

## Acceptance criteria for this phase
- Workspace route is intentional and polished on desktop/tablet/mobile.
- Selection supports point + rectangle and keyboard point nudging.
- Inspector includes progress/failure/success states without fake backend claims.
- Unit tests cover coordinate math transforms.
