# Docs.json Refactor Plan

This project is migrating docs rendering from `src/shiso.config.json` docs navigation to Mintlify-style `docs.json` navigation.

## Scope

- Use `docs.json` as the source of truth for docs navigation.
- Keep blog rendering behavior unchanged.
- Preserve MDX rendering with `@mdx-js/mdx`.
- Replace ad-hoc markdown heading parsing with AST-based heading extraction.
- Remove legacy docs tabs/navigation parsing from client components.

## Milestones

1. Add a typed loader for `docs.json` and fail fast on invalid config.
2. Normalize Mintlify navigation into a runtime model (`tabs`, `groups`, `pages`, `prev/next`, `slug lookup`).
3. Refactor server docs routing and metadata generation to use normalized model.
4. Refactor docs UI components to consume normalized docs model.
5. Migrate docs authoring docs and remove legacy docs navigation code.

## Guardrails

- No behavior changes for blog routes.
- No destructive git operations.
- Keep compatibility for app-level `shiso.config.json` settings unrelated to docs navigation.
