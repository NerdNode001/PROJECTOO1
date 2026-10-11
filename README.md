# TRACE

See it. Understand it. Make it.

TRACE is a premium visual reverse-engineering workspace. This milestone implements **Phase 0 + Phase 1**: design system, responsive shell, interactive image selection (point/region), and seeded analysis states.

## Run locally

```bash
npm install
npm run dev
```

## Quality commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Current scope

- Responsive workspace route (`/`) with top bar, navigation, canvas, and inspector
- Upload / drag-and-drop image flow plus sample demo fixture
- Zoom, fit, pan, point and region selection in normalized coordinates
- Structured seeded analysis result in the inspector
- Coordinate transform unit tests

## Documentation

- `/docs/BUILD_PLAN.md`
- `/docs/design/*`
- `/docs/TECHNICAL_DECISIONS.md`
- `/docs/QUALITY_GATES.md`
- `/docs/decisions/*`
- `/trace-product-pack/*`
