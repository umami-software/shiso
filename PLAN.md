# Mintlify Feature Implementation Plan

## Goal

Implement comprehensive Mintlify-compatible rendering in Shiso, with all custom MDX components backed by `@umami/react-zen` primitives and prop-based styling.

## Constraints

- Use `@umami/react-zen` components and props over class-driven styling in component implementations.
- Keep existing docs routing and Mintlify `docs.json` normalization behavior intact.
- Enhance existing components (`CodeBlock`, `PageLinks`, and current docs shell pieces) instead of replacing the docs architecture.

## Source of Truth

- `docs.json`: schema and config shape to support for docs settings/navigation.
- `SETTINGS.md`: practical component/tag patterns that must render correctly in real Mintlify-authored pages.
- Existing Shiso renderer and docs model: `src/lib/docs-config.ts`, `src/server/index.ts`, `src/components/*`.

## Feature Inventory

### 1. Docs Shell Components

- `CodeBlock` with copy interaction
- `PageLinks` heading anchor list
- `SideNav` section/page nav
- `Markdown` MDX runtime rendering wrapper

### 2. Mintlify MDX Component Surface

- Callouts:
  - `Note`
  - `Tip`
  - `Warning`
  - `Info`
  - `Check`
  - `Callout` (generic)
- Structured docs:
  - `Expandable`
  - `ResponseField`
  - `RequestExample`
- Grouped content:
  - `Tabs`
  - `Tab`
  - `CodeGroup`
  - `Steps`
  - `Step`
- Common reusable Mintlify-style components for broader compatibility:
  - `Card`
  - `CardGroup`
  - `Accordion`
  - `AccordionGroup`
  - `Frame`
  - `Tooltip`
  - `Param`
  - `ParamField`

### 3. Provider Wiring

- Register all custom components in the default MDX provider map in `Shiso`.
- Ensure custom names override any colliding default Zen exports (`Tabs`, `Tab`, etc.).

## Execution Plan

1. Build a dedicated Mintlify component layer:
   - Add `src/components/Mintlify.tsx`.
   - Implement all feature components using Zen primitives and prop-based styling.
2. Refactor existing docs components:
   - Upgrade `CodeBlock`, `PageLinks`, `SideNav`, `Markdown`.
   - Remove reliance on custom class styling for these components where feasible.
3. Wire provider:
   - Update `src/components/Shiso.tsx` to expose Mintlify components to MDX.
4. Validate:
   - Run build/type checks.
   - Fix typing/runtime issues.
5. Follow-up polish:
   - Add doc examples under `src/content/docs/components/index.mdx` demonstrating every new component.
   - Prune now-unused CSS selectors from `src/app/global.css`.

## Status Checklist

- [x] Implement Mintlify component layer (`src/components/Mintlify.tsx`)
- [x] Enhance `CodeBlock` with Zen-prop UI
- [x] Refactor `PageLinks` to prop-driven rendering
- [x] Refactor `SideNav` to prop-driven rendering
- [x] Update `Markdown` wrapper to Zen container
- [x] Register Mintlify components in `Shiso` MDX provider
- [x] Build/type validation pass
- [ ] Docs examples page expansion
- [ ] Global CSS cleanup

## Files Touched During This Plan

- `src/components/Mintlify.tsx`
- `src/components/Shiso.tsx`
- `src/components/CodeBlock.tsx`
- `src/components/PageLinks.tsx`
- `src/components/SideNav.tsx`
- `src/components/Markdown.tsx`
- `src/components/Callout.tsx`
- `src/components/Note.tsx`
- `src/components/hooks/useShiso.ts`
