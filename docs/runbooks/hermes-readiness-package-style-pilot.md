# Hermes Readiness Package-Style Pilot

## Purpose

Pilot package-style Hermes readiness wiring in `ai-ops-console` before `@hermes/readiness` is installable.

## Current State

`ai-ops-console` no longer keeps a copied `scripts/hermes-readiness.cjs` file.

Instead, `package.json` uses the intended future command:

```json
{
  "scripts": {
    "hermes:readiness": "hermes-readiness"
  }
}
```

For this pilot, `hermes-readiness` is supplied locally through `node_modules/.bin/hermes-readiness` and points at the checked-out `hermes-observability` package scaffold.

## Validation

```bash
PATH="$PWD/node_modules/.bin:$PATH" npm run hermes:readiness
PATH="$PWD/node_modules/.bin:$PATH" npm run check
```

## Notes

This removes the repo-specific lint ignore previously needed for the copied CommonsJS script.

## Future Migration

After `@hermes/readiness` is package-ready, replace the local shim with a package install.

Expected future shape:

```bash
npm install --save-dev @hermes/readiness
npm run hermes:readiness
npm run check
```
